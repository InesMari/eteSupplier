import {util,wxApi,common,regeneratorRuntime} from '../../common/commonImport'

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  onLoad: function (res) {
    wx.removeStorageSync('toTruckingDetail');
  },
    /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let userInfo = wx.getStorageSync('userInfo');
    if(common.isBlank(userInfo)){
      wx.reLaunch({
        url: '/pages/guideIndex/guideIndex',
      })
      return false;
    }
    wx.login({
      success: res => {
         //后台处理登录相关
        util.postByBeanName("wxUserTF", "checkLogin", {
          wxCode: res.code,
          programType:2
        },
        function (data) {
          if(data=='Y'){
            //登录成功
            let userId = wx.getStorageSync("userInfo").userId;
            if(userId == "21121" || userId == "21122" || userId == "21123"){
              wx.reLaunch({
                url: '/supplier/vehicle/vehicleMonitor/vehicleMonitor',
              })
            }else{              
              wx.reLaunch({
                url: '/pages/index/index',
              })
            }
          }else{
            wx.reLaunch({
              url: '/pages/guideIndex/guideIndex',
            })
          }
        },
        function (data) {
          wx.reLaunch({
            url: '/pages/guideIndex/guideIndex',
          })
        });
      }
    })
  },
})