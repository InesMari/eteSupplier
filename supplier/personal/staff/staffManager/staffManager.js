import {util,wxApi,common,regeneratorRuntime} from '../../../../common/commonImport'

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
    let {items,hasNext} = await util.postByBeanName('wxUserTF','queryStaffs',{...this.data.params,page:this.data.page});
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
    this.setData({['params.keyword']:e.detail})
    //延迟查询
    if (this.data.searchTimeout) clearTimeout(this.data.searchTimeout);
    this.data.searchTimeout = setTimeout(() => {
      this.doQuery(true)
      clearTimeout(this.data.searchTimeout);
    }, 300)
  },
  // 删除员工
  async toDel(e){
    let {staffId:staffIds,userName:userNames} = e.currentTarget.dataset.item;
    let res = await wxApi.showModal({content:'是否确认删除员工：'+userNames,showCancel:true});
    if(res.confirm){
      await util.postByBeanName('wxUserTF','delStaff',{staffIds,userNames});
      await wxApi.showModal('删除成功');
      this.doQuery(true);
    }
  },
  toAdd(){
    wx.navigateTo({
      url: '../addStaff/addStaff?type=0',
    })
  },
  toEdit(e){
    let staffId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../addStaff/addStaff?type=1&staffId='+staffId,
    })
  },
  toDetail(e){
    let staffId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../addStaff/addStaff?type=2&staffId='+staffId,
    })
  },
})