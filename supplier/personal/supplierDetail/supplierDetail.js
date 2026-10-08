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
  async onLoad() {    
    let userInfo = wx.getStorageSync('userInfo');
    let info = await util.postByBeanName('supplierTF','getSupplierDetailInfo',{tenantId:userInfo.tenantId});
    let businessLicenseImg = [{ url: info.businessLicenseImgUrl}];
    this.setData({info,businessLicenseImg});
  },
  back(){
    wx.navigateBack({
      delta: 1,
    })
  }
})