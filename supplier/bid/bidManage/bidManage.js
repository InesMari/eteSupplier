import {util,wxApi,common,regeneratorRuntime} from '../../../common/commonImport'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    page:1,
    info:{},
    isRefresh:false,
    isShowFilterPopover:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    this.queryStaticData();
    this.doQuery(true);
  },
  // 查询静态枚举
  async queryStaticData() {
    let {VEHICLE_LENGTH} = await util.postByBeanName('commonTF', 'getSysStaticDataByCodeTypes', {codeType: "VEHICLE_LENGTH"});
    this.setData({
      vehicleLengthList: VEHICLE_LENGTH, //车长
    })
  },
  /**   * 
   * @param clear true:重新加载 ,false:加载下一页
   */
  async doQuery(clear){
    if (clear) {  //clean为true的时候清空数组和页码
      this.setData({ page: 1 });
    }
    let {items,hasNext} = await util.postByBeanName('bidQuoteTF','queryBidQuotePage',{...this.data.info,page:this.data.page});
    if (clear) {  //clean为true的时候清空数组
      this.setData({ list: [] });
    }
    this.setData({ list: [...this.data.list, ...items], hasNext, isRefresh: false});
    this.doCount();
    setInterval(()=>{
      this.doCount();
    },1000)
  },
  // 开始倒数
  doCount(){
    this.data.list.forEach((item,index)=>{
      var expireDate = +new Date(item.expireDate);
      var nowTime = +new Date();
      this.countDown({expireDate,nowTime,index})
    })
  },
  // 倒数逻辑
  countDown({expireDate,nowTime,index}){
    //把剩余时间毫秒数转化为秒
    let times = (expireDate - nowTime) / 1000;

    //计算天数 转化为整数
    let eDay = parseInt(times / 60 / 60 / 24);

    //计算小时数 转化为整数
    let h = parseInt(times / 60 / 60 % 24);
    let eHour = h < 10 ? "0" + h : h;

    //计算分钟数 转化为整数
    let m = parseInt(times / 60 % 60);
    let eMin = m < 10 ? "0" + m : m;

    //计算描述 转化为整数
    let s = parseInt(times % 60);
    let eSec = s < 10 ? "0" + s : s;
    
    this.setData({
      ['list['+index+'].eDay']:eDay,
      ['list['+index+'].eHour']:eHour,
      ['list['+index+'].eMin']:eMin,
      ['list['+index+'].eSec']:eSec,
    });

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
  //原生 - input赋值
  inputSetDataDefault(e){
    let {value} = e.detail;
    let { key } = e.currentTarget.dataset;
    this.data.info[key] = value;
    this.setData({ info: this.data.info });
  },
  // 选择车长
  vehicleLengthChange(e){
    let { value } = e.detail;
    this.setData({
      ["info.vehicleLength"]: this.data.vehicleLengthList[value].codeValue,
      vehicleLengthIndex: value
    })
  },
  selectItem(e){
    let { index } = e.currentTarget.dataset;
    this.setData({
      ['vehicleLengthList['+index+'].isSelect']:!this.data.vehicleLengthList[index].isSelect
    })
  },
  // 显示筛选弹窗
  showFilter(){
    this.setData({isShowFilterPopover:true});
  },
  // 筛选确认 
  sureFilter(){
    let vehicleLength = [];
    this.data.vehicleLengthList.forEach(item => {
      if(item.isSelect){
        vehicleLength.push(item.codeValue)
      }
    })
    this.setData({["info.vehicleLength"]: vehicleLength})
    this.doQuery(true);
    this.hideFilter();
  },
  // 隐藏筛选
  hideFilter(){
    this.setData({isShowFilterPopover:false});
  },
  // 详情
  toDetail(e){
    let { id } = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: '../bidDetail/bidDetail?id='+id,
    })
  },
})