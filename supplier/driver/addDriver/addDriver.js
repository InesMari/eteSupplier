import {util,wxApi,common,regeneratorRuntime} from '../../../common/commonImport'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowDateRange:false,
    fileList: [],
    info:{},
    isUpdate:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad({id}) {
    if(common.isNotBlank(id)){
      let info = await util.postByBeanName('driverTF','queryDriverInfoById',{id}); 
      let idCardFrontList = [{ url: common.getBigImgPath(info.idCardFrontImgPath_) }];
      let idCardBackList = [{ url: common.getBigImgPath(info.idCardBackImgPath_) }];
      let driverLicenceFrontList = [{ url: common.getBigImgPath(info.driverLicenceFrontImgPath_) }];
      let driverLicenceBackList = [{ url: common.getBigImgPath(info.driverLicenceBackImgPath_) }];
      let qualifyCertList = [{ url: common.getBigImgPath(info.qualifyCertImgPath) }];
      this.setData({info,idCardFrontList,idCardBackList,driverLicenceFrontList,driverLicenceBackList,qualifyCertList,isUpdate:true});
    }
  },
  inputSetData(e){
    let value = e.detail;
    let { key } = e.currentTarget.dataset;
    this.data.info[key] = value;
    this.setData({ info: this.data.info });
  },
  // 日期选择
  bindDateChange: function(e) {
    let {value} = e.detail;
    let {key} = e.currentTarget.dataset
    this.data.info[key] = value;
    this.setData({ info: this.data.info });
  },
  async afterRead(event) {
    wx.showLoading();
    const { file } = event.detail;
    let {id} = event.currentTarget.dataset;
    let {data} = await util.uploadFile(file);
    wx.hideLoading();
    data = JSON.parse(data);  //数据转化
    console.log(data);
    //数据拼接保存
    this.data.info[id+'Img'] = data.content.flowId;
    this.data.info[id+'ImgPath'] = data.content.storePath;
    this.data[id+'List'] = [{...file,url:common.getBigImgPath(data.content.fullPath)}]
    this.setData({info:this.data.info,[id+'List']:this.data[id+'List']});
    this.checkImg(id);
  },
  /**
   * 识别图片
   * idCardFront  身份证
   * driverLicenceFront  驾驶证
   */
  async checkImg(id){
    if(id=="idCardFront"){
      wx.showLoading({title: '正在识别身份证信息'})
      let {idCardNum,name} = await util.postByBeanName('driverTF','getIdCardOcrData',{fileId:this.data.info.idCardFrontImgPath},null,null,null,false);
      this.setData({['info.driverName']:name});
      this.setData({['info.idCard']:idCardNum});
    }else if(id=="driverLicenceFront"){
      wx.showLoading({title: '正在识别驾驶证信息'})
      let {drivingLicense,driverClass,effectiveDateStr,expireDateStr} = await util.postByBeanName('driverTF','getDrivingLicenseOcrData',{fileId:this.data.info.driverLicenceFrontImgPath},null,null,null,false);
      this.setData({['info.driverLicence']:drivingLicense});
      this.setData({['info.driverClass']:driverClass});
      this.setData({['info.effectiveDate']:effectiveDateStr});
      this.setData({['info.expireDate']:expireDateStr});
    }
    wx.hideLoading();
  },
  deleteImg(event){
    let {id} = event.currentTarget.dataset;
    this.data.info[id+'Img'] = '';
    this.data.info[id+'ImgPath'] = '';
    this.data[id+'List'] = []
    this.setData({info:this.data.info,[id+'List']:this.data[id+'List']});
  },
  async submit(){
    if(!this.data.isUpdate){   //提交
      await util.postByBeanName('driverTF','saveDriverProcess',this.data.info);
    }else{  //修改
      await util.postByBeanName('driverTF','upTenantDriverGYS',this.data.info);
    }
    await wxApi.showModal('保存成功');
    wx.navigateBack({
      delta: 1,
    })
  },
})