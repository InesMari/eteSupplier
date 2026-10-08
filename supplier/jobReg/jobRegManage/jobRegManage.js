import {util,wxApi,common,regeneratorRuntime} from '../../../common/commonImport'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    active:0,
    info:{
      searchKey:"",
      registerState:0,
      confirmState:0,
    },
    method:"queryWorkOrderPageForWechat",
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
    let {items,hasNext} = await util.postByBeanName('workOrderService',this.data.method,{...info,page}); 
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
    this.setData({['info.searchKey']:e.detail})
    //延迟查询
    if (this.data.searchTimeout) clearTimeout(this.data.searchTimeout);
    this.data.searchTimeout = setTimeout(() => {
      this.doQuery(true)
      clearTimeout(this.data.searchTimeout);
    }, 300)
  },
  onChange(e){
    let waybillState = e.detail.name;
    switch(waybillState){
      case 0://待登记
        this.setData({
          active:0,
          ['info.registerState']:0,
          ['info.confirmState']:0,
          method:'queryWorkOrderPageForWechat'
        }); 
        this.doQuery(true);
        break;   
      case 1://已登记未确认
        this.setData({
          active:1,
          ['info.confirmState']:0,
          ['info.registerState']:1,
          method:'queryWorkOrderPageForWechat'
        }); 
        this.doQuery(true);
        break;    
      case 2://已确认
        this.setData({
          active:2,
          ['info.confirmState']:1,
          ['info.registerState']:'',
          method:'queryWorkOrderPageForWechat'
        }); 
        break;    
      case 3://作业汇总
        this.setData({method:'queryWorkOrderGroupByPageForWechat',active:3})
        this.doQuery(true);
        break;    
    }
    this.doQuery(true);
  },
  // 作业登记
  toReg(e){
    let {id} = e.currentTarget.dataset;
    wx.navigateTo({
      url: '../jobReg/jobReg?id='+id,
    })
  },
  // 查看详情
  toDetail(e){
    let {id} = e.currentTarget.dataset;
    wx.navigateTo({
      url: '../jobRegDetail/jobRegDetail?id='+id,
    })
  },
  // 查看汇总详情
  toSumDetail(e){
    let {tenantId,workId,month,itemId} = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: `../totalDetail/totalDetail?tenantId=${tenantId}&workId=${workId}&month=${month}&itemId=${itemId}`,
    })
  },
})