import {util,wxApi,common,regeneratorRuntime} from '../../../common/commonImport'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:{},
    operaterCertificateList:[],
    scenePictureList:[],
  },
  onShow(){
    if(common.isNotBlank(this.data.id)) this.doQuery();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function ({id}) {
    this.setData({id})
    this.doQuery();
  },
  // 查询客户
  async doQuery(){
    let info = await util.postByBeanName('workOrderService','loadWorkOrderByIdForWechat',{id:this.data.id});
    // type清空，不然图片回显会有问题
    info.operaterCertificateList.map(item => item.type = undefined);
    info.scenePictureList.map(item => item.type = undefined);
    this.setData({
      info,
      operaterCertificateList:info.operaterCertificateList,
      scenePictureList:info.scenePictureList,
    })
  },
  // 去修改
  toEdit(){
    wx.navigateTo({
      url: '../jobReg/jobReg?id='+this.data.info.info.id,
    })
  }
})