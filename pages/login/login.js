import {util,wxApi,common,regeneratorRuntime} from '../../common/commonImport'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    username:'',
    password:'',
    disabled:false,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let billId = options.billId;
    this.setData({username:billId});
  },
  username(e) {
    this.setData({
      username: e.detail.value
    })
  },
  password(e) {
    this.setData({
      password: e.detail.value
    })
  },
  loginShowLoad(){
    wx.showLoading();
    this.login();
  },
  async login() {
    if(this.data.disabled) return;
    this.setData({disabled:true})
    try{
    let username = this.data.username;
    let password = this.data.password;
    if (username === "" || password === "") { //账号/密码为空
      await wxApi.showModal('请输入账号密码');
      return;
    } else if (username.length != 11) { //手机号码格式错误
      await wxApi.showModal('请输入正确的手机号');
      return;
    }
    //密码加密
    let pwd = util.rsaEncrypt(password);
    let res = await wxApi.login();
    let userInfo = await wxApi.getUserInfo();
    let params = {
      wxCode: res.code,
      userInfo: userInfo,
      billId: username,
      password: pwd,
      programType:2
    };
    let data = await util.postByBeanName("wxUserTF", "login",params)
    /**
     * 登录成功
     * passwordFlag   1修改密码，2过期，9正常
     */
    if(data.passwordFlag==1){
      let info = encodeURI(JSON.stringify(data));
      wx.navigateTo({
        url: `/pages/resetPsw/resetPsw?info=${info}`,
      })
    }else if(data.passwordFlag==9){
      let toTruckingDetail = wx.getStorageSync('toTruckingDetail');
      wx.setStorageSync('userInfo', data);
      if(toTruckingDetail){
        wx.reLaunch({
          url: '/driver/task/truckingDetail/truckingDetail?waybillId='+toTruckingDetail.waybillId,
        })
        return
      }
      let userId = wx.getStorageSync("userInfo").userId;
      if(userId == "21121" || userId == "21122" || userId == "21123"){
        wx.reLaunch({
          url: '/supplier/vehicle/vehicleMonitor/vehicleMonitor',
        })
      }else{              
        wx.reLaunch({
          url: '/pages/index/index',
        })
      }
    }
    this.setData({disabled:false})
    }catch(e){      
      this.setData({disabled:false})
    }

  },
  toForgetPsw(){
    wx.navigateTo({
      url: '/pages/forgetPsw/forgetPsw',
    })
  },
  protocol(){
    wx.navigateTo({
      url: '/pages/protocol/protocol',
    })
  },
  // 注册司机
  toRegisterDriver(){
    wx.navigateTo({
      url: '/pages/registerDriver/registerDriver',
    })
  }
})
