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

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad({tenantId,workId,month,itemId}) {
    let info = await util.postByBeanName('workOrderService','loadWorkOrderMonthData',{tenantId,workId,month,itemId});
    this.setData({
      info
    })
  },
})