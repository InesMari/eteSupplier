import {util,wxApi,common,regeneratorRuntime} from '../../../common/commonImport'
import setBankcard from '../bankCardSet'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bankcardList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    this.doQuery();
  },
  async doQuery(){
    let {items} = await util.postByBeanName('bankTF','queryBankData');
    setBankcard(items,'bankDepositName');
    this.setData({bankcardList:items})
  },
  // 删除银行卡
  async delCard(e){
    let {id} = e.currentTarget.dataset;
    await util.postByBeanName('bankTF','cancleBankInfo',{id});
    await wxApi.showModal('删除成功');
    this.doQuery();
  },
  // 新增银行卡
  toAddBankcard(){
    wx.navigateTo({
      url: '../addBankcard/addBankcard',
    })
  },
  // 查看详情
  toDetail(e){
    let {id} = e.currentTarget.dataset;
    wx.navigateTo({
      url: '../bankcardDetail/bankcardDetail?id='+id,
    })
  },
  
})