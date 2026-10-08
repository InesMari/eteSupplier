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
  onLoad({info}) {
    info = JSON.parse(decodeURI(info));
    this.setData({waybillId:info.waybillId});
    this.doQuery();
  },
  async doQuery(){    
    let {waybillId} = this.data;
    let info = await util.postByBeanName('miniProgramWaybillTF','queryWaybillInfoByWaybillId',{waybillId}); 
    this.setData({info});
    this.initImg();
  },
  // 初始化图片
  initImg(){
    let ticketList = [];
    this.data.info.receiptsList.forEach(el => {
      el.url = el.fullPath;
      ticketList.push(el);
    })
    this.setData({ticketList});
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
  },
  deleteImg(event){
    let index = event.detail.index;
    this.data.ticketList.splice(index,1);
    this.setData({ticketList:this.data.ticketList});
  },
  async submit(){
    let {waybillId,ticketList} = this.data;
    await util.postByBeanName('miniProgramWaybillTF','uploadReceipts',{waybillId,receiptsList:ticketList});
    await wxApi.showModal('保存成功');
    wx.navigateBack({
      delta: 1,
    })
  }
})