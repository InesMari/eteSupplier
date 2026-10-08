import {util,wxApi,common,regeneratorRuntime} from '../../../common/commonImport'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:{},    
    isshowPickupGoodsDetail:false,  //是否展示货物清单
    isshowAlert:false,
    param:{},
  },
  onLoad(query) {
    if(query.scene){  //二维码
      let planId = decodeURIComponent(query.scene);
      this.setData({planId,scene:true});
    }else{
      this.setData({planId:query.planId});
    }
    this.doQuery();
  },
  async doQuery(){
    try{
      let info = await util.postByBeanName('ordPlanTF','loadPlanInfoByPlanId',{planId:this.data.planId,fromWechat:1});
      info.currentWork =  info.workData[0];
      this.setData({info})
    }catch(e){
      if(e.data.status != 501) return;
      wx.showModal({
        title: '退出登录',
        content: '该账户没有操作权限是否登录其他账号？',
        success: (res) => {
          if (res.confirm) {
            util.postByBeanName('wxUserTF', 'logout');
            wx.reLaunch({
              url: '/pages/login/login',
            })
          }
        }
      });
    }
  },
  // 选择车牌号
  supplierChange(e){
    let { value } = e.detail;
    this.setData({
      "supplierName": this.data.info.supplierList[value].supplierName,
      "supplierTenantId": this.data.info.supplierList[value].supplierTenantId,
      supplierIndex: value
    })
  },
  // 货物清单
  async showPickupGoodsDetail(){
    let isshowPickupGoodsDetail = this.data.isshowPickupGoodsDetail?false:true;
    this.setData({isshowPickupGoodsDetail});
  },
  // 选择作业点
  workChange(e){
    let { item } = e.currentTarget.dataset;
    this.setData({
      "info.currentWork": item,
    })
  },
  // 获取定位
  async getLocation(){    
    let _this = this;
    if(wx.canIUse("getLocation")){
      wx.getLocation({
        type: 'wgs84',
        async success (res) {          
          let param = _this.data.param;
          if(res){
            let {latitude,longitude} = common.qqMapTransBMap(res.longitude,res.latitude);
            param.latitude = latitude;
            param.longitude = longitude;
          }
          _this.setData({param})
          _this.claimOrder()
        },
        fail(){
          _this.checkLocationAuth();
        }
       })
    }else{
      _this.claimOrder()
    }
  },
  inputSetPlateNumber(e){
    this.setData({plateNumber:e.detail.value})
  },
  // 领单
  async claimOrder(){
    if(this.data.info.vehicleId < 0 && common.isBlank(this.data.plateNumber)){
      wxApi.showToast("请输入车牌号。");
      return
    }
    let param = this.data.param;
    //没有绑定司机需要输入车牌
    if(this.data.info.vehicleId < 0){
      param.plateNumber = this.data.plateNumber;
    }else{
      param.vehicleId = this.data.info.vehicleId;
    }
    param.planId = this.data.info.orderPlan.id;
    param.planCount = 1;
    param.supplierTenantId = this.data.supplierTenantId;

    let res = await util.postByBeanName('miniProgramDriverTF','createTransportationAgreementForOrderPlan',param);
    param = {...param,...res};
    this.setData({param})
    if(!res.vehicleCheck){
      // 非自有车跳去协议
      wx.navigateTo({
        url: `/pages/agreement/agreement?url=${res.transportationAgreementFileUrl}`,
      })
    }else{
      this.toCheck();
    }
  },
  // 非自有车协议确认回调方法
  async webViewCallback(){
    let param = this.data.param;
    let res = await util.postByBeanName('miniProgramDriverTF','claimOrderPlan',this.data.param);
    param.waybillId = res.waybillId;
    this.setData({param});
    this.doQuery();
    this.receive();
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
  // 自有车逻辑
  async toCheck(){
    let param = this.data.param;
    let res = await util.postByBeanName('miniProgramDriverTF','claimOrderPlan',param);
    param.waybillId = res.waybillId;
    this.setData({param});
    // 自有车跳去点检
    wx.navigateTo({
      url: `/driver/task/checkAndUploadKM/checkAndUploadKM?waybillId=${res.waybillId}&type=1`,
    })
  },
  // 接单出车（子页面会回调这个方法，请勿改名）
  async receive(){
    let param = this.data.param;
    await util.postByBeanName('miniProgramDriverTF','opWaybillLanding',param);
    await wxApi.showModal('领单成功');
    wx.reLaunch({
      url: '../../../pages/index/index',
    })
  },
  // 返回上一页
  back(){
    wx.navigateBack({
      delta: 1,
    })
  }
})