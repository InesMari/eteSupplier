import {util,wxApi,common,regeneratorRuntime} from '../../../common/commonImport'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],    
    page:1,
    isRefresh:false,
    info:{
      searchKey:"",
      queryType:1
    },
    isshowAlert:false,
    isshowUploadAlert:false,
    receiptsList: [],
    isshowAutoAlert:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    this.doQuery(true);
  },
  /**
   * 
   * @param clear true:重新加载 ,false:加载下一页
   */
  async doQuery(clear){
    if (clear) {  //clean为true的时候清空数组和页码
      this.setData({ page: 1 });
    }
    let {info,page} = this.data;
    let {items,hasNext} = await util.postByBeanName('miniProgramWaybillTF','queryDriverWaybillListPage',{...info,page});
    if (clear) {  //clean为true的时候清空数组
      this.setData({ list: [] });
    }
    this.setData({ list: [...this.data.list, ...items], hasNext, isRefresh: false});
  },  
  // 滚动加载
  scrolltolowerHandler(){
    if (this.data.hasNext) {
      this.setData({ page: ++this.data.page });
      this.doQuery()
    }
  },
  // 上拉刷新
  toupper(){
    this.setData({ isRefresh:true})
    this.doQuery(true);
  },
  search(e){
    this.setData({['info.searchKey']:e.detail})
    //延迟查询
    if (this.data.searchTimeout) clearTimeout(this.data.searchTimeout);
    this.data.searchTimeout = setTimeout(() => {
      this.doQuery(true)
      clearTimeout(this.data.searchTimeout);
    }, 300)
  },
  //节点操作
  async nodeOperation(e){
    let {item,index} = e.currentTarget.dataset;
    if(item.vehicleAttribution!=2){   //需要阅读同意协议
      let url = await util.postByBeanName('miniProgramDriverTF','createTransportationAgreement',{waybillId:item.waybillId});
      wx.navigateTo({
        url: `/pages/agreement/agreement?index=${index}&url=${url}`,
      })
    }else{
      wx.navigateTo({
        url: `/driver/task/checkAndUploadKM/checkAndUploadKM?waybillId=${item.waybillId}&type=1`,
      })
    }
    this.setData({currentItem:item});
  },
  // 回调方法
  webViewCallback(){
    this.receive();
  },
  // 接单
  async receive(){
    let item = this.data.currentItem;
    let _this = this;
    if(wx.canIUse("getLocation")){
      wx.getLocation({
        type: 'wgs84',
        async success (res) {
          _this.submit(item,res)
        },
        fail(){
          _this.checkLocationAuth();
        }
        })
    }else{
      _this.submit(item)
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
      this.setData({isshowAutoAlert:true})
    }
  },
  openSetting(){
    wx.openSetting();
  },
  cancelAutoAlert(){
    this.setData({isshowAutoAlert:false})
  },
  async submit(item,res){
    let params = {
      workNodeId:item.workNodeId,
      waybillId:item.waybillId
    }
    if(res){
      let {latitude,longitude} = common.qqMapTransBMap(res.longitude,res.latitude);
      params.latitude = latitude;
      params.longitude = longitude;
    }
    await util.postByBeanName('miniProgramDriverTF','opWaybillLanding',params);
    await wxApi.showModal("接单成功");
    this.doQuery(true);
    wx.navigateBack({
      delta: 1,
    })
  },
  // 显示确认完成对话框
  showAlert(e){
    let {item} = e.currentTarget.dataset;
    this.setData({isshowAlert:true,currentItem:item})
  },
  // 隐藏确认完成对话框
  cancelAlert(){
    this.setData({isshowAlert:false})
  },
  // 确认完成
  async sureAlert(){
    if(this.data.currentItem.isReturn==1 && common.isBlank(this.data.mileage)){
      wxApi.showToast("请输入回程重量！")
      return;
    }
    await util.postByBeanName('miniProgramWaybillTF','driverDoneWaybill',{waybillId:this.data.currentItem.waybillId}); 
    this.setData({isshowAlert:false})
    this.doQuery(true);
    wxApi.showModal("确认成功！");
  },
  toDetail(e){
    let {waybillId,dispatchType,inWaySum,workNodeId,waybillState} = e.currentTarget.dataset.item;
    if(dispatchType == 9){  //短驳配送
      if(inWaySum>0 && waybillState != 2){
        wxApi.showToast("请先完成已接短驳单。")
      }else{
        wx.navigateTo({
          url: `/driver/task/shortBarge/shortBarge?waybillId=${waybillId}`,
        })
      }
    }else{  //派车单详情
      wx.navigateTo({
        url: `/driver/task/truckingDetail/truckingDetail?waybillId=${waybillId}&inWaySum=${inWaySum}&workNodeId=${workNodeId}`,
      })
    }
  },
  // 显示上传回单对话框
  async showUploadAlert(e){
    let {item} = e.currentTarget.dataset;
    let currentItem = await util.postByBeanName('miniProgramWaybillTF','queryDriverWaybillInfoByWaybillId',{waybillId:item.waybillId}); 
    currentItem.baseInfo.waybillId = item.waybillId;
    let receiptsList = currentItem.receiptsList?currentItem.receiptsList:[];
    receiptsList.forEach(item => {
      item.url = item.fullPath;
    })
    let fromTenantList = await util.postByBeanName('wmsWaybillService','queryWaybillFromTenantByWaybillId',{waybillId:item.waybillId});
    this.setData({isshowUploadAlert:true,currentItem,receiptsList,fromTenantList})
  },
  // 选择到货厂商
  fromTenantChange(e){
    let { value } = e.detail;
    this.setData({
      fromTenantId: this.data.fromTenantList[value].fromTenantId,
      fromTenantIndex: value,
    })
  },
  // 输入重量
  inputSetDataMileage(e){
    let {value} = e.detail;
    this.setData({ mileage:value });
  },
  // 隐藏上传回单对话框
  cancelUploadAlert(){
    this.setData({isshowUploadAlert:false})
  },
  async afterRead(event) {
    wx.showLoading();
    const { file } = event.detail;
    let {data} = await util.uploadFile(file);
    wx.hideLoading();
    data = JSON.parse(data);  //数据转化
    let obj = {};
    obj.url = data.content.fullPath;
    obj.imgId = data.content.flowId;
    obj.imgPath = data.content.storePath;
    obj.fullPath = data.content.fullPath;
    obj.fileName = data.content.fileName;
    this.data.receiptsList.push(obj);
    this.setData({receiptsList:this.data.receiptsList});
    console.log(data);
  },
  deleteImg(event){
    let index = event.detail.index;
    this.data.receiptsList.splice(index,1);
    this.setData({receiptsList:this.data.receiptsList});
  },
  // 上传回单
  async sureUpload(){    
    let {currentItem,receiptsList} = this.data;
    await util.postByBeanName('miniProgramWaybillTF','uploadWmsWaybillReceipts',{waybillId:currentItem.baseInfo.waybillId,receiptsList}); 
    wxApi.showToast("上传成功！");
    this.cancelUploadAlert();
    this.doQuery(true);
  },
})