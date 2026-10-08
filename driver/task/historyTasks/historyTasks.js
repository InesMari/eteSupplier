// driver/task/historyTasks/historyTasks.js
import {util,wxApi,common,regeneratorRuntime} from '../../../common/commonImport'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],    
    page:1,
    isRefresh:false,
    info:{
      searchKey:"",
      queryType:2,
      startDateType:2,
    },
    dateTypeList:[
      {codeName:"按日期",codeValue:0},
      {codeName:"按月份",codeValue:1}
    ],
    dateTypeIndex:1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let date = this.getCurrentMonth();
    this.setData({["info.startDate"]:date});

    this.doQuery(true);
  }, 
  /**
   * 获取当前月
   */
  getCurrentMonth(){
    let year = new Date().getFullYear();
    let m = new Date().getMonth()+1;
    if(m<10) m = "0"+m; 
    let date = year+"-"+m;
    return date;
  },
  /**
   * 获取当前日
   */
  getCurrentDay(){
    let year = new Date().getFullYear();
    let m = new Date().getMonth()+1;
    if(m<10) m = "0"+m; 
    let d = new Date().getDate();
    if(d<10) d = "0"+d; 
    let date = year+"-"+m+"-"+d;
    return date;
  },
  // 选择日期类型
  dateTypeChange(e){
    let { value } = e.detail;
    this.setData({dateTypeIndex: value})
    if(value==0) this.setData({["info.startDate"]:this.getCurrentDay()})
  },
  // 日期选择
  bindDateChange: function(e) {
    let {value} = e.detail;
    let {key} = e.currentTarget.dataset
    this.data.info[key] = value;
    this.setData({ info: this.data.info });
    this.doQuery(true);
  },
  // 月份选择
  monthChange(e){
    this.setData({["info.startDate"]:e.detail});
    this.doQuery(true);
  },
  // 清空日期
  clearDate(){
    this.setData({["info.startDate"]:""});
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
    let {info,page} = this.data;
    let {items,hasNext,totalNum} = await util.postByBeanName('miniProgramWaybillTF','queryDriverWaybillListPage',{...info,page});
    if (clear) {  //clean为true的时候清空数组
      this.setData({ list: [] });
    }
    this.setData({ list: [...this.data.list, ...items], hasNext, isRefresh: false,orderNumbers:totalNum});
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
  toTruckingDetail(e){
    let {waybillId,dispatchType} = e.currentTarget.dataset.item;
    if(dispatchType == 9){  //短驳配送
      wx.navigateTo({
        url: `/driver/task/shortBarge/shortBarge?waybillId=${waybillId}`,
      })
    }else{
      wx.navigateTo({
        url: `/driver/task/truckingDetail/truckingDetail?waybillId=${waybillId}`,
      })
    }
  },
})