import {util,wxApi,common,regeneratorRuntime} from '../../../common/commonImport'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    active:0,
    info:{
      keyStr:"",
      type:1,
    },
    isRefresh:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow() {
    this.doQuery(true);
  },
  async doQuery(clear){
    if (clear) {  //clear为true的时候清空页码
      this.setData({ page: 1 });
    }
    let {info,page} = this.data;
    let {items,hasNext} = await util.postByBeanName('resVehicleInfoTF','queryVehicleCheckPage',{...info,page}); 
    if (clear) {  //clean为true的时候清空数组(请求后操作，避免出现阶段性页面空白)
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
  search(e){
    this.setData({['info.keyStr']:e.detail})
    //延迟查询
    if (this.data.searchTimeout) clearTimeout(this.data.searchTimeout);
    this.data.searchTimeout = setTimeout(() => {
      this.doQuery(true)
      clearTimeout(this.data.searchTimeout);
    }, 300)
  },
  onChange(e){
    let state = e.detail.name;
    switch(state){
      case 0:this.setData({['info.state']:""}); break;   //全部
      case 1:this.setData({['info.state']:0}); break;    //待确认
      case 2:this.setData({['info.state']:1}); break;    //待跟进
      case 3:this.setData({['info.state']:2}); break;    //已确认已处理
    }
    this.doQuery(true);
  },
  // 查看详情
  toDetail(e){
    let {item} = e.currentTarget.dataset;
    wx.navigateTo({
      url: '../vehicleCheckDetail/vehicleCheckDetail?id='+item.id
    })
  },
})