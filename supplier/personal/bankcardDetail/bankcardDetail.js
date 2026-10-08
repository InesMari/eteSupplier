import {util,wxApi,common,regeneratorRuntime} from '../../../common/commonImport'
import setBankcard from '../bankCardSet'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad({id}) {
    let res = await util.postByBeanName('bankTF','queryBankInfoById',{id});
    setBankcard([res],'bankDepositName');
    this.setData({info:res,id})
  },
  async unbind(){
    let res =  await wx.showModal({content:'是否解绑该银行卡？'});
    if(res.cancel) return;
    await util.postByBeanName('bankTF','cancleBankInfo',{id:this.data.id});
    await wxApi.showModal('解绑成功');
    wx.navigateBack({
      delta: 1,
    })
  }
})