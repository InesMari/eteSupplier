import {util,wxApi,common,regeneratorRuntime} from '../../../../common/commonImport'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:{},
    psSee:false,
    cpsSee:false,    
    pswCanSet:true,
  },

  /**
   * 生命周期函数--监听页面加载
   * type 0：新增，1：修改，2：详情
   */
  onLoad: function ({type,staffId}) {
    this.setData({type});
    if(type==1){
      this.setData({pswCanSet:false});
      wx.setNavigationBarTitle({title: '修改员工',})
      this.doQuery(staffId);
    }else if(type == 2){
      wx.setNavigationBarTitle({title: '员工详情',})
      this.doQuery(staffId);
    }
  },
  async doQuery(staffId){
    let info = await util.postByBeanName('wxUserTF','getStaff',{staffId});
    if(this.data.type == 1){
      info.password = '000000';
      info.confirmPassword = '000000';
    }
    this.setData({info});
  },
  psSeeChange(){
    if(this.data.pswCanSet){
      this.setData({psSee:this.data.psSee?false:true});
    }
  },
  cpsSeeChange(){
    if(this.data.pswCanSet){
      this.setData({cpsSee:this.data.cpsSee?false:true});
    }
  },
  //原生 - input赋值
  inputSetData(e){
    let value = e.detail;
    let { key } = e.currentTarget.dataset;
    this.data.info[key] = value;
    this.setData({ info: this.data.info });
  },
  resetAlert(){
    if(this.data.type == 1 && !this.data.pswCanSet){
      let _this = this;
      wx.showModal({
        title: '提示信息',
        content: '修改密码该操作将会清空密码，是否继续？',
        showCancel: true,
        success: res => {
          if(res.confirm){
            _this.setData({pswCanSet:true,['info.password']:'',['info.confirmPassword']:''});
          }
        },
    });
    }
  },
  // 提交
  async submit(){
    let {password,confirmPassword} = this.data.info;
    if(!this.data.pswCanSet){
      this.data.info.password = undefined;
      this.data.info.confirmPassword = undefined;
    }
    if(password !== confirmPassword){
      wxApi.showToast("两次输入的密码不一致")
      return;
    }
    this.data.info.password = util.rsaEncrypt(password);
    this.data.info.confirmPassword = util.rsaEncrypt(password);
    if(this.data.type == 0){   //添加
      await util.postByBeanName('wxUserTF','addStaff',this.data.info);
    }else{  //修改
      await util.postByBeanName('wxUserTF','updateStaff',this.data.info);
    }
    await wxApi.showModal('保存成功');
    wx.navigateBack({
      delta: 1,
    })
  },
})