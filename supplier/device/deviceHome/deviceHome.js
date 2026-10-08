// device/deviceHome/deviceHome.js
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

  },
  // 器具登记记录
  toDeviceHis(){
    wx.navigateTo({
      url: '/supplier/device/deviceRecoveryHis/deviceRecoveryHis',
    })
  },
  // 新增器具回收
  toDeviceRecovery(){
    wx.navigateTo({
      url: '/supplier/device/deviceRecovery/deviceRecovery',
    })
  },
  // 器具整理记录
  toDeviceArrangeHis(){
    wx.navigateTo({
      url: '/supplier/device/deviceArrangeHis/deviceArrangeHis',
    })
  },
  // 新增整理登记
  toDeviceArrange(){
    wx.navigateTo({
      url: '/supplier/device/deviceArrange/deviceArrange',
    })
  },
})