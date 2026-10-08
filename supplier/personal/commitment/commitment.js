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
  async onLoad() {
    let data = await util.postByBeanName('supplierTF','getSupplierDetailInfoMini');
    this.setData({info:data})
  },
})