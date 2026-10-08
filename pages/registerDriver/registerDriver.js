import {util,wxApi,common,regeneratorRuntime} from '../../common/commonImport'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:{
      individualSupplier:0,
    },          //司机注册信息
    isShowSupplierPopover:false,
    supplierInfo:{
      rows:20
    },  //查询供应商
    page:1,           //供应商列表页码
    supplierList:[],  //供应商列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad() {
    
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
  // 删除图片
  deleteImg(event){
    let {id} = event.currentTarget.dataset;
    this.data.info[id+'Img'] = '';
    this.data.info[id+'ImgPath'] = '';
    this.data[id+'List'] = []
    this.setData({info:this.data.info,[id+'List']:this.data[id+'List']});
  },
  // 选择是否个体司机
  radioChange(e){
    this.setData({['info.individualSupplier']:e.detail})
  },
  // 选择供应商popover
  showSupplierPopover(){
    this.querySupplierList(true);
    this.setData({isShowSupplierPopover:true})
  },
  /**
   * 查询供应商列表
   * @param clear true:重新加载 ,false:加载下一页
   */
  async querySupplierList(clear){
    if (clear) {  //clean为true的时候清空数组和页码
      this.setData({ page: 1 });
    }
    let {items,hasNext} = await util.postByBeanName('supplierTF','querySupplierList',{...this.data.supplierInfo,page:this.data.page});
    if (clear) {  //clean为true的时候清空数组
      this.setData({ supplierList: [] });
    }
    this.setData({ supplierList: [...this.data.supplierList, ...items], hasNext, isRefresh: false});
  },
  // 滚动加载
  scrolltolowerHandler(){
    if (this.data.hasNext) {
      this.setData({ page: ++this.data.page });
      this.querySupplierList();
    }
  },
  // 查询供应商
  searchSupplierList(e){
    let value = e.detail.value;
    this.setData({ 'supplierInfo.supplierName': value });
    //延迟查询
    if (this.data.searchTimeout) clearTimeout(this.data.searchTimeout);
    this.data.searchTimeout = setTimeout(() => {
      this.querySupplierList(true);
      clearTimeout(this.data.searchTimeout);
    }, 300)
  },
  /**
   * 选择供应商
   */
  selectSupplier(e){
    let { item } = e.currentTarget.dataset;
    this.setData({'supplierInfo.supplierName':""})
    //选择供应商逻辑
    this.setData({ 
      ['info.supplierTenantId']: item.tenantId, 
      ['info.supplierName']: item.supplierName, 
      isShowSupplierPopover:false 
    })
  },
  async submit(){
    // 校验身份证正反面是否上传
    if (!this.data.info.idCardFrontImg) {
      await wxApi.showModal('请上传身份证人像面');
      return;
    }
    if (!this.data.info.idCardBackImg) {
      await wxApi.showModal('请上传身份证国徽面');
      return;
    }
    // 校验驾驶证正反面是否上传
    if (!this.data.info.driverLicenceFrontImg) {
      await wxApi.showModal('请上传驾驶证正面');
      return;
    }
    if (!this.data.info.driverLicenceBackImg) {
      await wxApi.showModal('请上传驾驶证反面');
      return;
    }
    await util.postByBeanName('driverTF','registerDriver',this.data.info);
    let driverName = this.data.info.driverName || '';
    await wxApi.showModal(`司机：${driverName}注册成功，请及时联系我司客服进行审核处理！`);
    wx.navigateBack({
      delta: 1,
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: '司机注册',
      path: '/pages/registerDriver/registerDriver',
      imageUrl: '', // 可替换为自定义分享图片路径
    }
  },
})