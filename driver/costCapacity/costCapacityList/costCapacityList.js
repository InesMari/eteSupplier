import {util,wxApi,common,regeneratorRuntime} from '../../../common/commonImport'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1,
    isRefresh:false,
    info:{
      searchKey:"",
      wxapp:1,
    },
    heads:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    // this.initData();
    this.doQuery(true);
  },
  async initData(){
    let heads = await util.postByBeanName('commonTF', 'querySysStaticDataHeads', {'codeType': 'VEHICLE_WAYBILL_COST_VEHICLE_TYPE'});
    this.setData({heads})
  },
  /**
   * 
   * @param clear true:重新加载 ,false:加载下一页
   */
  async doQuery(clear){
    if (clear) {  //clean为true的时候清空数组和页码
      this.setData({ page: 1 });
    }
    let {info,page} = this.data;
    let {items,hasNext} = await util.postByBeanName('vehicleWaybillCostService','queryVehicleWaybillCostPage',{...info,page});
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
  search(e){
    this.setData({['info.searchKey']:e.detail})
    //延迟查询
    if (this.data.searchTimeout) clearTimeout(this.data.searchTimeout);
    this.data.searchTimeout = setTimeout(() => {
      this.doQuery(true)
      clearTimeout(this.data.searchTimeout);
    }, 300)
  },
  onChange(e){
    let state = e.detail.name;
    this.setData({['info.verifyState']:"",['info.payState']:""});   //全部
    switch(state){
      case 1:this.setData({['info.verifyState']:0}); break;    //未审核
      case 2:this.setData({['info.verifyState']:1}); break;    //审核通过
      case 3:this.setData({['info.verifyState']:2}); break;    //审核不通过
      case 4:this.setData({['info.payState']:0}); break;    //未付款
      case 5:this.setData({['info.payState']:1}); break;    //部分付款
      case 6:this.setData({['info.payState']:2}); break;    //全部付款
    }
    this.doQuery(true);
  },
  toCostCapacity(e){
    let {item} = e.currentTarget.dataset;
    if(item) var id = item.id;
    wx.navigateTo({
      url: `/driver/costCapacity/costCapacity/costCapacity?id=${id}`,
    })
  },
  inputSetPlanCount(e){
    this.setData({planCount:e.detail.value})
  },
  // 删除
  async toDel(e){
    let {item} = e.currentTarget.dataset;    
    let {confirm} = await wxApi.showModal({
      content:`是否确认删除${item.plateNumber}成本？`,
      showCancel:true
    });
    if(confirm){      
      await util.postByBeanName('vehicleWaybillCostService','deleteVehicleWaybillCostById',item);
      await wxApi.showToast('删除成功');
      this.doQuery(true);
    }
  }
})