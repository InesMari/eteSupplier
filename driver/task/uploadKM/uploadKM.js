import {util,wxApi,common,regeneratorRuntime} from '../../../common/commonImport'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:{},
    ticketList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad({waybillId,waybillNum,workNodeId,driverOpType}) {  
    this.data.info.waybillId = waybillId;
    this.data.info.waybillNum = waybillNum;
    this.data.info.driverOpType = driverOpType;
    if(common.isBlank(waybillNum)){
      let data = await util.postByBeanName('miniProgramDriverTF','loadReceiptsDataByWaybillId',{waybillId});  
      this.data.info.waybillNum = data.waybillNum;
    }
    this.setData({info:this.data.info,workNodeId});
  },
  //原生 - input赋值
  inputSetDataDefault(e){
    let {value} = e.detail;
    let { key } = e.currentTarget.dataset;
    this.data.info[key] = value;
    this.setData({ info: this.data.info });
  },
  async afterRead(event) {
    wx.showLoading();
    const { file } = event.detail;
    let {id} = event.currentTarget.dataset;
    let {data} = await util.uploadFile(file);
    wx.hideLoading();
    data = JSON.parse(data);  //数据转化
    let obj = {};
    obj.url = data.content.fullPath;
    obj.imgId = data.content.flowId;
    obj.imgPath = data.content.storePath;
    obj.fullPath = data.content.fullPath;
    obj.fileName = data.content.fileName;
    this.data.ticketList.push(obj);
    this.setData({ticketList:this.data.ticketList});
    console.log(data);
  },
  deleteImg(event){
    let index = event.detail.index;
    this.data.ticketList.splice(index,1);
    this.setData({ticketList:this.data.ticketList});
  },
  async submit(){
    let {info,ticketList,workNodeId} = this.data;
    if(ticketList.length==0){
      wxApi.showToast("请上传图片");
      return
    }
    info.mileageFileId = ticketList[0].imgId;
    info.mileageFilePath = ticketList[0].imgPath;
    await util.postByBeanName('ordWaybillTF','addMileage',info);
    if(info.driverOpType == 1){ //接单出车
      let _this = this;
      if(wx.canIUse("getLocation")){
        wx.getLocation({
          type: 'wgs84',
          async success (res) {
            _this.toSubmit(res)
          },
          fail(){
            _this.checkLocationAuth();
          }
        })
      }else{
        _this.toSubmit();
      }
    }else if(info.driverOpType == 2){ //收车
      await util.postByBeanName('miniProgramDriverTF','opWorkNode',{workNodeId});
      await wxApi.showModal('操作成功');
      wx.navigateBack({
        delta:1,
      })
    }
  },
  // 检查定位
  async checkLocationAuth(){
    let isAuthorized;
    try{
      isAuthorized = await common.checkLocationAuth();
    }catch(e){}
    if(isAuthorized){
      //  已授权则提升系统定位没打开
      wxApi.showToast("无法获取定位，请检查系统是否已打开定位。")
    }else{
      //  未授权则跳去授权页面
      this.setData({isshowAlert:true})
    }
  },
  openSetting(){
    wx.openSetting();
  },
  cancelAlert(){
    this.setData({isshowAlert:false})
  },
  async toSubmit(res){
    let param = {
      workNodeId:this.data.workNodeId,
      waybillId:this.data.info.waybillId
    }
    if(res){
      let {latitude,longitude} = common.qqMapTransBMap(res.longitude,res.latitude);
      param.latitude = latitude;
      param.longitude = longitude;
    }
    await util.postByBeanName('miniProgramDriverTF','opWaybillLanding',param);
    await wxApi.showModal("接单成功");
    wx.navigateBack({
      delta:2,
    })
  }
})