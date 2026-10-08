import {util,wxApi,common,regeneratorRuntime} from '../../../common/commonImport'
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo = wx.getStorageSync('userInfo');
    this.setData({userInfo})
    this.queryCardTotal();
  },
  async queryCardTotal(){
    let cardTotal = await util.postByBeanName('bankTF','queryBankInfoCount');
    this.setData({cardTotal})
  },
  toBankcards(){
    wx.navigateTo({
      url: '../bankcards/bankcards',
    })
  },
  toFeeDetail(){
    wx.navigateTo({
      url: '../feeDetail/feeDetail',
    })
  },
  toStaffManager(){
    wx.navigateTo({
      url: '../staff/staffManager/staffManager',
    })
  },
  toDetail(){
    wx.navigateTo({
      url: '../supplierDetail/supplierDetail',
    })
  },
  async toLogout(){
    await util.postByBeanName('wxUserTF','logout',{});
    wx.setStorageSync('userInfo', {});
    wx.offLocationChange();
    wx.reLaunch({
      url: '/pages/guideIndex/guideIndex',
    })
  }
})