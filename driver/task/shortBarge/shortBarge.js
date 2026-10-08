import {util,wxApi,common,regeneratorRuntime} from '../../../common/commonImport'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:{}, 
    isshowUploadAlert:false,
    isshowAlert:false,
    receiptsList:[],
    timeoutReasonList:[],
  },

  onLoad({waybillId}) {
    this.setData({waybillId});
    this.doQuery();
  },
  async doQuery(){
    let info = await util.postByBeanName('miniProgramWaybillTF','queryDriverWaybillInfoByWaybillId',{waybillId:this.data.waybillId}); 
    
    // 根据到货厂商区分
    let list = [];
    if(common.isNotBlank(info.receiptsList)){
      info.receiptsList.forEach(item => {
        item.url = item.fullPath;
        let isNew = true;
        list.forEach(el => {
          if(el.id == item.fromTenantId){
            isNew = false;            
            el.imgList.push(item);
          }
        })
        if(isNew){
          let obj ={name:item.fromTenantName,imgList:[item],id:item.fromTenantId};
          list.push(obj);
        }
      })
    }

    let fromTenantList = await util.postByBeanName('wmsWaybillService','queryWaybillFromTenantByWaybillId',{waybillId:this.data.waybillId});
    this.setData({info,fromTenantList,list});
    if(info.baseInfo.waybillState == 2){
      let isTimeout = await util.postByBeanName('miniProgramWaybillTF','isTimeout',{waybillId:this.data.waybillId});
      if(isTimeout){
        let {TIMEOUT_REASON4} = await util.postByBeanName('commonTF','getSysStaticDataByCodeTypes',{codeType:"TIMEOUT_REASON4"});
        this.setData({isTimeout,timeoutReasonList:TIMEOUT_REASON4});
      }
    }
  },
  // 输入重量
  inputSetDataMileage(e){
    let {value} = e.detail;
    this.setData({ mileage:value });
  },
  // 显示确认完成对话框
  showAlert(e){
    this.setData({isshowAlert:true})
  },
  // 隐藏确认完成对话框
  cancelAlert(){
    this.setData({isshowAlert:false,mileage:""})
  },
  // 接单出车
  async accept(){
    let {confirm} = await wxApi.showModal({
      content:`是否确认接单？`,
      showCancel:true
    });
    if(confirm){  
      await util.postByBeanName('miniProgramWaybillTF','driverStartWaybill',{waybillId:this.data.waybillId}); 
      await wxApi.showModal("接单成功！");
      wx.navigateBack({
        delta: 1,
      })
    }
  },
  // 确认完成
  async sureAlert(){
    let returnNums = this.data.mileage;
    let isReturn = this.data.info.baseInfo.isReturn;
    // if(isReturn==1 && common.isBlank(returnNums)){
    //   wxApi.showToast("请输入回程重量！")
    //   return;
    // }
    let timeoutReason = this.data.timeoutReason;
    // if(this.data.isTimeout && common.isBlank(timeoutReason)){
    //   wxApi.showToast("请选择超时原因！")
    //   return;
    // }
    await util.postByBeanName('miniProgramWaybillTF','driverDoneWaybill',{waybillId:this.data.waybillId,returnNums,isReturn,timeoutReason}); 
    await wxApi.showModal("确认成功！");
    wx.navigateBack({
      delta: 1,
    })
  },
  
  // 选择到货厂商
  fromTenantChange(e){
    let { value } = e.detail;
    this.setData({
      fromTenantId: this.data.fromTenantList[value].fromTenantId,
      fromTenantIndex: value,
    })
  },
  // 选择超时原因
  timeoutReasonChange(e){
    let { value } = e.detail;
    this.setData({
      timeoutReason: this.data.timeoutReasonList[value].codeValue,
      timeoutReasonIndex: value,
    })
  },
  
  // 显示上传回单对话框
  async showUploadAlert(e){
    this.setData({isshowUploadAlert:true})
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
  // 选择返程
  onRaidoChange(e){
    console.log(e.detail)
    this.setData({['info.baseInfo.isReturn']:e.detail,mileage:""})
  },
  // 上传回单
  async sureUpload(){    
    let {waybillId,fromTenantId,receiptsList} = this.data;
    await util.postByBeanName('miniProgramWaybillTF','uploadWmsWaybillReceipts',{waybillId,fromTenantId,receiptsList}); 
    wxApi.showToast("上传成功！");
    this.cancelUploadAlert();
    this.setData({receiptsList:[]})
    this.doQuery();
  },
})