import {util,wxApi,common,regeneratorRuntime} from '../../../common/commonImport'
import {scanQRCode} from '../../../utils/qrcode'
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
  async onLoad({waybillId}) {
    let info = await util.postByBeanName('miniProgramDriverTF','loadReceiptsDataByWaybillId',{waybillId});
    let {cfgValue} = await util.postByBeanName('commonTF','getSysCfgByCfgName',{cfgName:"SCAN_RECEIPT_QRCODE"});
    this.setData({info,waybillId,isRecognizeCode:cfgValue});
    //回显当前作业点
    if(common.isNotBlank(info.currentWorkId)){
      info.workList.forEach((el,index) => {
        if(el.id == info.currentWorkId){
          this.setData({workIndex: index})
        }
      })
    }else{
      this.setData({workIndex: 0})
    }
    //根据作业点筛选图片
    this.fliterImg();
  },
  // 根据作业点筛选图片
  fliterImg(){
    let {receiptsList,currentWorkId} = this.data.info;
    receiptsList.forEach((el,index) => {
      if(currentWorkId==el.waybillWorkId){
        el.url = common.getBigImgPath(el.fullPath);
        el.name = el.receiptsTypeName;
        this.data.ticketList.push(el);
      }
    })
    this.setData({ticketList:this.data.ticketList})
  },
  // 选择作业点
  workChange(e){
    let { value } = e.detail;
    this.setData({
      "info.currentWorkId": this.data.info.workList[value].id,
      "info.currentWorkAddress":this.data.info.workList[value].workAddress,
      workIndex: value,
      ticketList:[]
    })
    this.fliterImg();
  },
  async afterRead(event) {
    wx.showLoading({ title: '上传中...' });
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

    // vehicleAttribution == 2 && isRecognizeCode == 1 时需要做二维码识别
    if (this.data.info.vehicleAttribution == 2 && this.data.isRecognizeCode=='1') {
      // 识别图片中的二维码或条形码
      try {
        const codeResult = await this.scanCodeFromImage(file.path);
        if (codeResult) {
          console.log('识别到的二维码/条形码值:', codeResult);
          // 对比运单号
          if (codeResult !== this.data.waybillId) {
            wx.showModal({
              title: '提示',
              content: '该回单二维码与当前派车单不匹配，请上传正确的回单图片',
              showCancel: false
            });
            return;  // 不添加图片到列表
          }
        } else {
          // 识别失败，提示重新上传
          wx.showModal({
            title: '提示',
            content: '识别失败，请重新拍照上传',
            showCancel: false
          });
          return;  // 不添加图片到列表
        }
      } catch (err) {
        console.error('识别二维码失败:', err);
        // 识别失败，提示重新上传
        wx.showModal({
          title: '提示',
          content: '识别失败，请重新拍照上传',
          showCancel: false
        });
        return;  // 不添加图片到列表
      }
    } else {
      console.log('vehicleAttribution != 2, 跳过二维码识别,直接上传');
    }

    this.data.ticketList.push(obj);
    this.setData({ticketList:this.data.ticketList});
    console.log(data);
  },

  // 从图片路径识别二维码
  scanCodeFromImage(imagePath) {
    return scanQRCode(imagePath);
  },
  deleteImg(event){
    let index = event.detail.index;
    this.data.ticketList.splice(index,1);
    this.setData({ticketList:this.data.ticketList});
  },
  async submit(){
    let {waybillId,ticketList} = this.data;
    let currentWaybillWorkId = this.data.info.currentWorkId;
    await util.postByBeanName('miniProgramDriverTF','uploadWaybillReceipts',{waybillId,currentWaybillWorkId,receiptsList:ticketList});
    await wxApi.showModal('保存成功');
    wx.navigateBack({
      delta: 1,
    })
  }
})