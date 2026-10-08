import {util,wxApi,common,regeneratorRuntime} from '../../../common/commonImport'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:{
      deviceList:[{}],
    },
    receiptsList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.queryData();
  },
  // 查询数据
  async queryData(){    
    let custWorkList = await util.postByBeanName('deviceContractService','queryCustWorkInfo');
    let houseList = await util.postByBeanName('storeHouseBizTF','queryStoreHouseList');
    this.setData({custWorkList,houseList})
  },

  //原生 - input赋值
  inputSetDataDefault(e){
    let {value} = e.detail;
    let { key } = e.currentTarget.dataset;
    this.setData({['info.'+key]:value});
  },

  /**
   * 选择来源
   */
  custWorkChange(e){
    let { value } = e.detail;
    let item = this.data.custWorkList[value];
    this.setData({
      ["info.srcWorkId"]: item.workId,
      ["info.srcWorkAddress"]: item.address,
      custWorkIndex: value
    });
  },
  /**
   * 选择交付地
   */
  async houseChange(e){
    let { value } = e.detail;
    let item = this.data.houseList[value];
    this.setData({
      ["info.destWorkId"]: item.workId,
      ["info.destWorkAddress"]: item.workAddressStr,
      houseIndex: value
    });
    let deviceList = await util.postByBeanName('deviceBaseService','queryOutDeviceInfoListForCust',{workId:item.workId}); 
    let tenantList = await util.postByBeanName('wmsTenantTF','queryArrivalManufacturerTenantList',{workId:item.workId});
    this.setData({deviceList,deviceListCache:deviceList,tenantList})
  },
  // 输入器具数量
  inputSetDataDevice(e){
    let {value} = e.detail;
    let { key,index } = e.currentTarget.dataset;
    this.setData({['info.deviceList['+index+'].'+key]:value});
  },
  // 添加器具
  addDevice(){
    this.data.info.deviceList.push({});
    this.setData({['info.deviceList']:this.data.info.deviceList})
  },
  // 删除器具
  delDevice(e){
    let deviceList = this.data.info.deviceList;
    if(deviceList.length>1){
      let { index } = e.currentTarget.dataset;
      deviceList.splice(index,1)
      this.setData({['info.deviceList']:deviceList})
    }
  },
  // 打开器具选择
  showDevicePopover(e){
    let {index} = e.currentTarget.dataset;
    this.setData({isShowDevicePopover:true,currentIndex:index});
  },
  // 搜索器具
  searchDeviceList(e){
    let value = e.detail.value;
    this.setData({ deviceSearch: value });
    //延迟查询
    if (this.data.searchTimeout) clearTimeout(this.data.searchTimeout);
    this.data.searchTimeout = setTimeout(() => {
      let list = [];
      this.data.deviceListCache.forEach(item => {
        if(item.name.indexOf(value) > -1){
          list.push(item);
        }
      })
      this.setData({deviceList:list})
      clearTimeout(this.data.searchTimeout);
    }, 300)
  },
  // 选择器具
  selectDevice(e){
    let {item} = e.currentTarget.dataset;
    this.setData({
      isShowDevicePopover:false,
      ['info.deviceList['+this.data.currentIndex+'].devDeviceId']:item.id,
      ['info.deviceList['+this.data.currentIndex+'].deviceName']:item.name,
      ['info.deviceList['+this.data.currentIndex+'].spec']:item.spec,
    })

  },
  /**
   * 选择客户
   */
  tenantChange(e){
    let { value } = e.detail;
    let {index} = e.currentTarget.dataset
    let item = this.data.tenantList[value];
    this.setData({
      ["info.deviceList["+index+"].useTenantId"]: item.wId,
      ["info.deviceList["+index+"].tenantIndex"]: value,
    });
  },
  // 上传附件
  async afterRead(event) {
    wx.showLoading();
    const { file } = event.detail;
    let {data} = await util.uploadFile(file);
    wx.hideLoading();
    data = JSON.parse(data);  //数据转化
    let obj = {};
    obj.url = data.content.fullPath;
    obj.fileId = data.content.flowId;
    obj.imgPath = data.content.storePath;
    obj.fullPath = data.content.fullPath;
    obj.fileName = data.content.fileName;
    this.data.receiptsList.push(obj);
    this.setData({receiptsList:this.data.receiptsList,['info.fileId']:obj.fileId,['info.filePath']:obj.imgPath});
    console.log(data);
  },
  deleteImg(event){
    let index = event.detail.index;
    this.data.receiptsList.splice(index,1);
    this.setData({receiptsList:this.data.receiptsList,['info.fileId']:'',['info.filePath']:''});
  },
  // 日期选择
  bindDateChange: function(e) {
    let {value} = e.detail;
    let {key} = e.currentTarget.dataset
    this.data.info[key] = value;
    this.setData({ info: this.data.info });
  },
  // 保存
  async save(){
    let {confirm} = await wxApi.showModal({
      content:"您正在操作登记确认，提交后数据不允许修改是否继续？",
      showCancel:true
    });
    if(confirm){
      await util.postByBeanName('deviceRecordService','saveOutDeviceReoveryRecordForCust',this.data.info); 
      await wxApi.showModal("保存成功");
      wx.navigateBack({
        delta: 1,
      })
    }
  }
})