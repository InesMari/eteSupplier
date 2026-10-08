import {util,wxApi,common,regeneratorRuntime} from '../../../common/commonImport'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    page:1,
    params:{},
    isRefresh:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    this.doQuery(true);
  },
  /**
   * 
   * @param clear true:重新加载 ,false:加载下一页
   */
  async doQuery(clear){
    if (clear) {  //clean为true的时候清空数组和页码
      this.setData({ page: 1 });
    }
    let {items,hasNext} = await util.postByBeanName('resVehicleInfoTF','queryVehicleInfoListByCond',{...this.data.params,page:this.data.page});
    if (clear) {  //clean为true的时候清空数组
      this.setData({ list: [] });
    }
    this.setData({ list: [...this.data.list, ...items], hasNext, isRefresh: false});
  },
  // 滚动加载
  scrolltolowerHandler(){
    if (this.data.hasNext) {
      this.setData({ page: ++this.data.page });
      this.doQuery()
    }
  },
  // 上拉刷新
  toupper(){
    this.setData({ isRefresh:true})
    this.doQuery(true);
  },
  // 搜索车牌
  search(e){
    this.setData({['params.plateNumber']:e.detail})
    //延迟查询
    if (this.data.searchTimeout) clearTimeout(this.data.searchTimeout);
    this.data.searchTimeout = setTimeout(() => {
      this.doQuery(true)
      clearTimeout(this.data.searchTimeout);
    }, 300)
  },
  // 删除车辆
  async delVehicle(e){
    let {id} = e.currentTarget.dataset;
    await util.postByBeanName('resVehicleInfoTF','delTenantVehicle',{id});
    await wxApi.showModal('删除成功');
    this.doQuery(true);
  },
  toAddVehicle(){
    wx.navigateTo({
      url: '../addVehicle/addVehicle',
    })
  },
  toDetail(e){
    let {id,state} = e.currentTarget.dataset;
    if(state!=2 || common.isBlank(state)){
      wx.navigateTo({
        url: '../vehicleDetail/vehicleDetail?id='+id,
      })
    }else{
      wx.navigateTo({
        url: '../addVehicle/addVehicle?id='+id,
      })
    }
  }
})