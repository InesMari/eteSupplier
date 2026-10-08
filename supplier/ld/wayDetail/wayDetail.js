import {util,wxApi,common,regeneratorRuntime} from '../../../common/commonImport'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:{},
    goodsList:null,             //货物清单数组
    isshowGoodsDetail:false,  //是否展示货物清单
    isshowFeeDetail:false,    //是否展示货物明细
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad({info}) {
    info = JSON.parse(decodeURI(info));
    let {isInvoice,driverUserId,vehicleId,waybillId,waybillState} = info;
    let res = await util.postByBeanName('miniProgramWaybillTF','queryWaybillInfoByWaybillId',{waybillId}); 
    this.setData({info:res,waybillId,driverUserId,vehicleId,isInvoice,waybillState})
  },
  /**
   * 查看货物详情
   */
  async showGoodsDetail(){
    if(common.isBlank(this.data.goodsList)){
      var goodsList = await util.postByBeanName('miniProgramWaybillTF','loadWaybillGoodsListByWaybillId',{waybillId:this.data.waybillId}); 
    }
    let isshowGoodsDetail = this.data.isshowGoodsDetail?false:true;
    this.setData({isshowGoodsDetail,goodsList});
  },
  /**
   * 查看费用详情
   */
  showFeeDetail(){
    let isshowFeeDetail = this.data.isshowFeeDetail?false:true;
    this.setData({isshowFeeDetail});
  },
  /**
   * 致电客服
   */
  callService(){
    wxApi.showToast("暂无客服电话")
    // wx.makePhoneCall({
    //   phoneNumber
    // })
  },
  /**
   * 致电司机 
   */
  callDriver(){
    let phoneNumber = this.data.info.distribution.linkPhone;
    if(common.isBlank(phoneNumber)){
        wxApi.showToast("司机未预留电话")
    }
    wx.makePhoneCall({
      phoneNumber
    })
  },
  /**
   * 线路详情
   */
  toWayDetail(e){
    let {item} = e.currentTarget.dataset;
    let info = encodeURI(JSON.stringify(item));
    wx.navigateTo({
      url: '../../transport/wayDetail/wayDetail?info='+info,
    })
  },
  /**
   * 调整作业点顺序
   */
  toWaySort(e){
    let {item} = e.currentTarget.dataset;
    let info = encodeURI(JSON.stringify(item));
    wx.navigateTo({
      url: `../../transport/waySort/waySort?info=${info}&waybillId=${this.data.waybillId}`,
    })
  },
  /**
   * 查看大图
   */
  seeBigImg(e){
    wx.previewImage({
      urls: [e.currentTarget.dataset.url] // 需要预览的图片http链接列表
    })
  },
  
  // 派车
  toDispatch(){
    let {isInvoice,driverUserId,vehicleId,waybillId} = this.data;
    let info = encodeURI(JSON.stringify({isInvoice,driverUserId,vehicleId,waybillId}));
    wx.navigateTo({
      url: `../ldDispatch/ldDispatch?info=${info}`,
    })
  },
  // 运作上报
  toOperationReport(e){
    let {isInvoice,driverUserId,vehicleId,waybillId} = this.data;
    let info = encodeURI(JSON.stringify({isInvoice,driverUserId,vehicleId,waybillId}));
    wx.navigateTo({
      url: `../ldOperationReport/ldOperationReport?info=${info}`,
    })
  },
  // 上传单据
  toUploadTicket(e){
    let {isInvoice,driverUserId,vehicleId,waybillId} = this.data;
    let info = encodeURI(JSON.stringify({isInvoice,driverUserId,vehicleId,waybillId}));
    wx.navigateTo({
      url: `../ldUploadTicket/ldUploadTicket?info=${info}`,
    })
  }
})