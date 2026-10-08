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
      queryType:1
    },
    isshowAlert:false,
    showDialog:false
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
    let {info,page} = this.data;
    let {items,hasNext} = await util.postByBeanName('miniProgramDriverTF','queryPlanListPage',{...info,page});
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
  toOrderDetail(e){
    let {planId} = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: `/driver/orderPackage/orderDetail/orderDetail?planId=${planId}`,
    })
  },
  showDialog(e){
    let {item} = e.currentTarget.dataset
    this.setData({
      showDialog:true,
      planId:item.planId,
      planCount:item.planCompany==1?1:'',
      iptDisabled:item.planCompany==1,
      planUnCount:item.planUnCount
    })
  },
  hideDialog(){
    this.setData({showDialog:false,planCount:""})
  },
  inputSetPlanCount(e){
    this.setData({planCount:e.detail.value})
  },
  // 领单
  async claimOrder(){    
    let _this = this;    
    if(wx.canIUse("getLocation")){
      wx.getLocation({
        type: 'wgs84',
        async success (res) {
          _this.submit(res)
        },
        fail(){
          _this.checkLocationAuth();
        }
       })
    }else{
      _this.submit()
    }
  },
  // 检查定位
  async checkLocationAuth(){
    let isAuthorized;
    try{
      isAuthorized = await common.checkLocationAuth();
    }catch(e){}
    if(isAuthorized){
      //  已授权则提升系统定位没打开
      wxApi.showToast("无法获取定位，请检查系统是否已打开定位。")
    }else{
      //  未授权则跳去授权页面
      this.setData({isshowAlert:true})
    }
  },
  openSetting(){
    wx.openSetting();
  },
  cancelAlert(){
    this.setData({isshowAlert:false})
  },
  async submit(res){
    let {planId,planCount} = this.data;
    let param = {
      planId,
      planCount
    }
    if(res){
      let {latitude,longitude} = common.qqMapTransBMap(res.longitude,res.latitude);
      param.latitude = latitude;
      param.longitude = longitude;
    }
    await util.postByBeanName('miniProgramDriverTF','claimOrderPlan',param,null,null,null,true);
    await wxApi.showModal('保存成功');
    this.hideDialog();
    wx.navigateBack({
      delta: 1,
    })
  }
})