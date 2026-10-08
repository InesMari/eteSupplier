import {util,wxApi,common,regeneratorRuntime} from '../../../common/commonImport'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    MsgNoReadCount:0,
  },
  async onShow(){
    let {items} = await util.postByBeanName('bankTF','queryMessageData');
    let MsgNoReadCount = await util.postByBeanName('bankTF','queryMessageNoReadCount');
    this.setData({list:items,MsgNoReadCount})
  },
  wait(){
    wxApi.showToast("暂无系统公告~")
  },
  toMsgDetail(e){
    let {item} = e.currentTarget.dataset;
    util.postByBeanName('bankTF','upMessageSts',{id:item.id});    //修改消息状态
    let detail = encodeURI(JSON.stringify(item)); //对象转码
    wx.navigateTo({
      url: '../msgDetail/msgDetail?info='+detail,
    })
  }
})