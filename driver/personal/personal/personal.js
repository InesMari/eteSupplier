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
  },
  toDetail(){
    wx.navigateTo({
      url: '../driverDetail/driverDetail',
    })
  },
  async toLogout(){
    await util.postByBeanName('wxUserTF','logout',{});
    wx.setStorageSync('userInfo', {});
    wx.reLaunch({
      url: '/pages/guideIndex/guideIndex',
    })
  }
})