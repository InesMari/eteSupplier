import {util,wxApi,common,regeneratorRuntime} from '../../../common/commonImport'
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  onShow(){
    this.doQuery();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function ({id}) {
    this.setData({id})
    this.doQuery();
  },
  async doQuery(id){
    let info = await util.postByBeanName("vehicleScheduleService", "loadVehicleScheduleById", {id:this.data.id});
    this.setData({info})
  },
  // 修改
  toEdit(){
    wx.navigateTo({
      url: '../addCapacity/addCapacity?id='+this.data.id,
    })
  },
  // 复制新增
  copyAdd(){
    wx.navigateTo({
      url: '../addCapacity/addCapacity?id='+this.data.id+'&copy=1',
    })
  },
  // 删除
  async del(){
    let {confirm} = await wxApi.showModal({
      title:"提示",
      content:"确认删除该运力？",
      showCancel:true
    })
    if(confirm){
      await util.postByBeanName("vehicleScheduleService", "deleteVehicleScheduleById", {id:this.data.id});
      await wxApi.showModal('删除成功');
      wx.navigateBack({
        delta: 1,
      })
    }
  }
})