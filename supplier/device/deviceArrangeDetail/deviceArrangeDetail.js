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
  onLoad: function ({id}) {
    this.doQuery(id);
  },
  async doQuery(id){    
    let info = await util.postByBeanName('deviceRecordService','loadDeviceRecordById',{id});
    let receiptsList = [{url:info.info.url}];
    this.setData({info,receiptsList})
  },
})