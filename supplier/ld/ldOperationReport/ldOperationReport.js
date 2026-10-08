import {util,wxApi,common,regeneratorRuntime} from '../../../common/commonImport'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad({info}) {
    info = JSON.parse(decodeURI(info));
    this.setData({['info.waybillId']:info.waybillId});
    this.doQuery();
  },
  async doQuery(){    
    let {waybillId} = this.data.info;
    let info = await util.postByBeanName('miniProgramWaybillTF','loadWaybillDataByWaybillId',{waybillId}); 
    info.waybillId = waybillId;
    this.setData({info})
  },
  //节点跟踪内容input赋值
  inputSetNodeContent(e){
    let {index,key} = e.currentTarget.dataset;
    console.log(e.detail.value)
    this.setData({ ['info.nodeList['+index+'].'+key]: e.detail.value });
  },
  //原生 - input赋值
  inputSetDataDefault(e){
    let {value} = e.detail;
    let { key } = e.currentTarget.dataset;
    this.data.info[key] = value;
    this.setData({ info: this.data.info });
  },
  // 选择到达时间
  changeDate(e){
    let {index} = e.currentTarget.dataset;
    this.data.info.workList[index].predictedArrivalTime = e.detail;
    this.setData({ ['info.workList']: this.data.info.workList });
  },
  async submit(){
    // let {waybillId,nodeList,workList,deliveryOrderNo} = this.data.info;
    await util.postByBeanName('miniProgramWaybillTF','opReport',{...this.data.info}); 
    await wxApi.showModal('提交成功');
    wx.navigateBack({
      delta: 1,
    })
  }
})