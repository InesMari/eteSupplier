import {util,wxApi,common,regeneratorRuntime} from '../../../common/commonImport'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showDriver:true,    //显示选择司机列表
    showVehicle:false,  //显示选择车辆列表
    showFinish:false,   //显示完成页面
    paramsDriver:{},    //司机查询参数
    paramsVehicle:{},   //车辆查询参数
    driverList:[],      //司机列表
    vehicleList:[],     //车辆列表
    selectVehicleBtn:true,
    submitBtn:true,
    isRefresh:false,
    page:1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad({info}) {
    info = JSON.parse(decodeURI(info));
    let {isInvoice,driverUserId,vehicleId,waybillId,waybillState} = info;
    this.setData({['paramsDriver.isInvoice']:isInvoice,['paramsVehicle.isInvoice']:isInvoice,driverUserId,vehicleId,waybillId,info})
    this.doQueryDriver(true)
  },
  /**
   * 司机
   * @param clean true:重新加载 ,false:加载下一页
   */
  async doQueryDriver(clear){
    if (clear) {  //clean为true的时候清空数组和页码
      this.setData({ page: 1 });
    }
    let {items,hasNext} = await util.postByBeanName('miniProgramWaybillTF','queryDriverList',{...this.data.paramsDriver,page:this.data.page});
    if (clear) {  //clean为true的时候清空数组
      this.setData({ driverList: [] });
    }
    let driverList = [...this.data.driverList,...items];
    if(driverList.length==1){
      driverList[0].isChecked = true;  //只有一个时默认选中
      this.setData({selectVehicleBtn:false})
    }
    this.setData({driverList,hasNext, isRefresh: false})
  },
  // 滚动加载
  driverScrolltolowerHandler(){
    if (this.data.hasNext) {
      this.setData({ page: ++this.data.page });
      this.doQueryDriver()
    }
  },
  // 上拉刷新
  driverToupper(){
    // this.setData({ isRefresh:true})
    // this.doQueryDriver(true);
  },
  searchDriver(e){
    this.setData({['paramsDriver.driverName']:e.detail})
    //延迟查询
    if (this.data.searchTimeout) clearTimeout(this.data.searchTimeout);
    this.data.searchTimeout = setTimeout(() => {
      this.doQueryDriver(true)
      clearTimeout(this.data.searchTimeout);
    }, 300)
  },
  driverRadioChange(e){
    let {index,item} = e.currentTarget.dataset;
    this.data.driverList.forEach(el => {
      el.isChecked = false
    })
    this.data.driverList[index].isChecked = true;
    this.setData({driverList:this.data.driverList,selectVehicleBtn:false,driverUserId:item.driverUserId})
  },
  toshowVehicle(){
    this.setData({showVehicle:true,showDriver:false,page:1});
    this.doQueryVehicle();
    wx.setNavigationBarTitle({title:"派车-选择车辆"})
  },
  /**
   * 车辆
   * @param clear true:重新加载 ,false:加载下一页
   */
  async doQueryVehicle(clear){
    if (clear) {  //clear为true的时候清空数组和页码
      this.setData({ page: 1 });
    }
    let {items,hasNext} = await util.postByBeanName('miniProgramWaybillTF','queryVehicleList',{...this.data.paramsVehicle,page:this.data.page});
    if (clear) {  //clear为true的时候清空数组
      this.setData({ vehicleList: [] });
    }
    let vehicleList = [...this.data.vehicleList,...items];
    if(vehicleList.length==1){
      vehicleList[0].isChecked = true;  //只有一个时默认选中
      this.setData({submitBtn:false})
    }
    this.setData({vehicleList,hasNext, isRefresh: false})
  },
  // 上拉刷新
  vehicleToupper(){
    // this.setData({ isRefresh:true})
    // this.doQueryVehicle(true);
  },
  //滚动加载
  vehicleScrolltolowerHandler(){
    console.log("toNext")
    if (this.data.hasNext) {
      this.setData({ page: ++this.data.page });
      this.doQueryVehicle();
    }
  },
  // 搜索车牌
  searchVehicle(e){
    this.setData({['params.plateNumber']:e.detail})
    //延迟查询
    if (this.data.searchTimeout) clearTimeout(this.data.searchTimeout);
    this.data.searchTimeout = setTimeout(() => {
      this.doQueryVehicle(true)
      clearTimeout(this.data.searchTimeout);
    }, 300)
  },
  vehicleRadioChange(e){
    let {index,item} = e.currentTarget.dataset;
    this.data.vehicleList.forEach(el => {
      el.isChecked = false
    })
    this.data.vehicleList[index].isChecked = true;
    this.setData({vehicleList:this.data.vehicleList,submitBtn:false,vehicleId:item.vehicleId})
  },
  toshowDriver(){
    this.setData({showDriver:true,showVehicle:false,page:1});
    wx.setNavigationBarTitle({title:"派车-选择司机"})
    this.doQueryDriver(true);
  },
  async submit(){
    let param = {
      vehicleId:this.data.vehicleId,
      driverUserId:this.data.driverUserId,
      waybillId:this.data.waybillId,
      isInvoice:this.data.paramsDriver.isInvoice
    }
    await util.postByBeanName('miniProgramWaybillTF','dispatchCar',param);
    this.setData({showFinish:true,showVehicle:false});
    wx.setNavigationBarTitle({title:"调度成功"})
  },

  // 返回首页
  toHome(){
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
  // 查看详情
  toDetail(e){
    let info = encodeURI(JSON.stringify(this.data.info));
    wx.redirectTo({
      url: '../waybill/waybill?info='+info,
    })
  },
})