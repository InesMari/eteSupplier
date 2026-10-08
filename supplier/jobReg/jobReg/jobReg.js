import {util,wxApi,common,regeneratorRuntime} from '../../../common/commonImport'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    opList:[],
    sceneList:[],
    info:{},
    operaterCertificateList:[],
    scenePictureList:[],
    customerDetailList:[{}],
    isShowCustomerPopover:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function ({id}) {
    this.doQuery(id);
  },
  // 查询客户
  async doQuery(id){
    let info = await util.postByBeanName('workOrderService','loadWorkOrderByIdForWechat',{id});
    if(info.info.unit.indexOf("吨") > -1){
      this.setData({digit:true});
    }else{
      this.setData({digit:false});
    }
    // 客户列表为空是插入空对象
    if(info.customerDetailList.length==0){
      info.customerDetailList.push({});
      var customerData = await util.postByBeanName('customerTF','queryCustomerListNoPage');
    }else{
      var customerData = info.customerDetailList;
    }
    // type清空，不然图片回显会有问题
    info.operaterCertificateList.map(item => item.type = undefined);
    info.scenePictureList.map(item => item.type = undefined);
    this.setData({
      customerData,
      customerDataCache:customerData,
      info:info.info,
      customerDetailList:info.customerDetailList,
      operaterCertificateList:info.operaterCertificateList,
      scenePictureList:info.scenePictureList,
    })

    this.sumNum();
  },
  //原生 - input赋值
  inputSetDataNum(e){
    let {value} = e.detail;
    let { key,index } = e.currentTarget.dataset;
    this.setData({ ['customerDetailList['+index+'].'+key]: value });
    this.sumNum();
  },
  // 合计数量
  sumNum(){
    let totalNum = 0;
    this.data.customerDetailList.forEach(item => {
      totalNum += Number(item.num);
    })
    this.setData({totalNum})
  },
  // 操作凭证
  async afterRead(event) {
    wx.showLoading();
    const { file } = event.detail;
    let {data} = await util.uploadFile(file);
    wx.hideLoading();
    data = JSON.parse(data);  //数据转化
    let obj = {};
    obj.url = data.content.fullPath;
    obj.fileId = data.content.flowId;
    obj.filePath = data.content.storePath;
    this.data.operaterCertificateList.push(obj);
    this.setData({operaterCertificateList:this.data.operaterCertificateList});
    console.log(data);
  },
  deleteImg(event){
    let index = event.detail.index;
    this.data.operaterCertificateList.splice(index,1);
    this.setData({operaterCertificateList:this.data.operaterCertificateList});
  },
  // 现场图片
  async afterReadScene(event) {
    wx.showLoading();
    const { file } = event.detail;
    let {data} = await util.uploadFile(file);
    wx.hideLoading();
    data = JSON.parse(data);  //数据转化
    let obj = {};
    obj.url = data.content.fullPath;
    obj.fileId = data.content.flowId;
    obj.filePath = data.content.storePath;
    this.data.scenePictureList.push(obj);
    this.setData({scenePictureList:this.data.scenePictureList});
    console.log(data);
  },
  deleteImgScene(event){
    let index = event.detail.index;
    this.data.scenePictureList.splice(index,1);
    this.setData({scenePictureList:this.data.scenePictureList});
  },
  // 添加客户
  addCustomer(){
    this.setData({customerDetailList:[...this.data.customerDetailList,{}]});
  },
  // 删除客户
  delCustomer(e){
    let { index } = e.currentTarget.dataset;
    let {customerDetailList} = this.data;
    customerDetailList.splice(index,1);
    this.setData({customerDetailList});
  },
  // 显示选择客户弹窗
  showCustomerPopover(e){
    let { index } = e.currentTarget.dataset;
    this.setData({
      isShowCustomerPopover:true,
      currentIndex:index,
      customerValue:"",
      customerData:this.data.customerDataCache
    })
  },
  // 查询客户
  searchCustomerList(e){
    let value = e.detail.value;
    this.setData({ customerValue: value });
    //延迟查询
    if (this.data.searchTimeout) clearTimeout(this.data.searchTimeout);
    this.data.searchTimeout = setTimeout(() => {
      let customerData = [];
      this.data.customerDataCache.forEach(item => {
        if(item.name.indexOf(this.data.customerValue)>-1){
          customerData.push(item);
        }
      })
      this.setData({customerData})
      clearTimeout(this.data.searchTimeout);
    }, 300)
  },
  /**
   * 选择客户
   */
  selectCustomer(e){
    let { item } = e.currentTarget.dataset;
    this.setData({customerValue:""});
    //选择客户逻辑
    let index = this.data.currentIndex;
    this.setData({ 
      ['customerDetailList['+index+'].tenantId']: item.tenantId, 
      ['customerDetailList['+index+'].tenantName']: item.name, 
      isShowCustomerPopover:false 
    })
  },
  async submit(){
    let {confirm} = await wxApi.showModal({
      content:"是否确认提交作业登记操作？",
      showCancel:true
    });
    if(confirm){
      let info = {
        id:this.data.info.id,
        operaterCertificateList:this.data.operaterCertificateList,
        scenePictureList:this.data.scenePictureList,
        customerDetailList:this.data.customerDetailList,
      }
      await util.postByBeanName('workOrderService','saveOrUpdateWorkOrderForWechat',info);
      await wxApi.showModal('登记成功');
      wx.navigateBack({
        delta: 1,
      })
    }
  },
})