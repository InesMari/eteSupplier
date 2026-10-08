import {util,wxApi,common,regeneratorRuntime} from '../../../common/commonImport'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowDateRange:false,
    fileList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad() {
    let userInfo = wx.getStorageSync('userInfo');
    let info = await util.postByBeanName('driverTF','queryDriverInfoById',{id:userInfo.driverId});
    let idCardFrontList = [{ url: info.idCardFrontImgPath_ }];
    let idCardBackList = [{ url: info.idCardBackImgPath_ }];
    let driverLicenceFrontList = [{ url: info.driverLicenceFrontImgPath_ }];
    let driverLicenceBackList = [{ url: info.driverLicenceBackImgPath_ }];
    this.setData({info,idCardFrontList,idCardBackList,driverLicenceFrontList,driverLicenceBackList});
  },
  back(){
    wx.navigateBack({
      delta: 1,
    })
  }
})