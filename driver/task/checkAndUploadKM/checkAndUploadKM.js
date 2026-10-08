import {util,wxApi,common,regeneratorRuntime} from '../../../common/commonImport'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showFinish:false,
    showUnPassAlert:false,
    info:{},
    ticketList: [],
    abnormalList:[],  
    startMileageList:[],
    disabled:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad({waybillId,workNodeId,type,id}) {
    if(common.isNotBlank(id)){
      this.doQuery(id);
    }else{
      this.setData({workNodeId});
      await this.queryInfo(waybillId,type);
      await this.getVehicleCheckList(type);
    }
  },  
  async doQuery(id){
    let info = await util.postByBeanName('resVehicleInfoTF','getVehicleCheckInfo',{id});
    info.checkList = info.allCheckList;
    info.checkList.forEach((item,index) => {
      item.content = `<strong>*${index+1}.${item.itemName}：</strong>${item.requirements}`;
      item.abnormalList = [{url:item.fileUrl}];
    })
    let ticketList = [{url:info.endMileageFileUrl}];
    this.setData({info,disabled:true,ticketList});
  },   
  async queryInfo(waybillId,type){
    let info = await util.postByBeanName('resVehicleInfoTF','getVehicleCheckBaseInfo',{waybillId});
    info.waybillId = waybillId;
    info.type = type;
    let startMileageList = [{url:info.startMileageFilePathUrl}];
    this.setData({info,startMileageList});
  },  
  async getVehicleCheckList(type){
    let list = await util.postByBeanName('resVehicleInfoTF','getVehicleCheckList',{type});
    list.forEach((item,index) => {
      item.content = `<strong>*${index+1}.${item.itemName}：</strong>${item.requirements}`;
      item.checkState = 1;
      item.abnormalList = [];
    })
    this.setData({['info.checkList']:list});
  },  
  onRaidoChange(e){
    let {key,index} = e.currentTarget.dataset;
    this.setData({
      ['info.checkList['+index+'].'+key]: e.detail,
    });
  },
  // 到厂时间
  changeDate(e){
    let value = e.detail;
    this.setData({['info.arriveDate']:value});
  },
  //原生 - input赋值
  inputSetDataDefault(e){
    let {value} = e.detail;
    let { key } = e.currentTarget.dataset;
    this.setData({['info.'+key]:value});
  },
  inputSetItemDataDefault(e){
    let {value} = e.detail;
    let { key,index } = e.currentTarget.dataset;
    this.setData({['info.checkList['+index+'].'+key]:value});

  },

  /**
   * 页面显示时检查是否有拍照返回的图片
   */
  onShow() {
    const app = getApp();
    if (app.globalData.cameraImage) {
      this.usePhoto(app.globalData.cameraImage, app.globalData.mileageNumber);
      // 清空全局数据
      app.globalData.cameraImage = '';
      app.globalData.mileageNumber = '';
    }
  },

  toCamera(){
    wx.navigateTo({
      url: '/pages/camera/camera',
    })
  },

  /**
   * 使用拍照返回的照片
   */
  async usePhoto(imagePath, mileageNumber) {
    if (!imagePath) {
      return;
    }

    if (this.data.disabled) {
      wx.showToast({
        title: '该记录已提交，无法修改',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({ title: '上传中...' });

    try {
      // 上传完整带水印的图片
      const file = {
        path: imagePath,
        url: imagePath,
        size: 0
      };
      let { data } = await util.uploadFile(file);
      data = JSON.parse(data);
      console.log('完整图片上传结果:', data);

      const result = {
        url: data.content.fullPath,
        imgId: data.content.flowId,
        imgPath: data.content.storePath,
        fullPath: data.content.fullPath,
        fileName: data.content.fileName
      };

      wx.hideLoading();

      // 如果ticketList已有图片，清空后添加新图片
      this.setData({
        ticketList: [result]
      });

      // 如果识别到了里程数，自动填充到输入框
      if (mileageNumber && mileageNumber !== '') {
        this.setData({
          ['info.mileage']: mileageNumber
        });
      }

      wx.showToast({
        title: '上传成功',
        icon: 'success'
      });

    } catch (error) {
      wx.hideLoading();
      wx.showToast({
        title: '上传失败，请重试',
        icon: 'none'
      });
      console.error('上传失败:', error);
    }
  },

  /**
   * 预览图片
   */
  previewImage() {
    if (this.data.ticketList.length > 0) {
      let url = common.getBigImgPath(this.data.ticketList[0].url);
      wx.previewImage({
        urls: [url],
        current: url
      });
    }
  },

  /**
   * 删除照片
   */
  deletePhoto() {
    wx.showModal({
      title: '提示',
      content: '确定要删除这张照片吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            ticketList: []
          });
          wx.showToast({
            title: '删除成功',
            icon: 'success'
          });
        }
      }
    });
  },
  async afterRead(event) {
    wx.showLoading();
    const { file } = event.detail;
    let {id} = event.currentTarget.dataset;
    let {data} = await util.uploadFile(file);
    wx.hideLoading();
    data = JSON.parse(data);  //数据转化
    let obj = {};
    obj.url = data.content.fullPath;
    obj.imgId = data.content.flowId;
    obj.imgPath = data.content.storePath;
    obj.fullPath = data.content.fullPath;
    obj.fileName = data.content.fileName;
    this.data.ticketList.push(obj);
    this.setData({ticketList:this.data.ticketList});
    console.log(data);
  },
  deleteImg(event){
    let index = event.detail.index;
    this.data.ticketList.splice(index,1);
    this.setData({ticketList:this.data.ticketList});
  },
  
  async abnormalAfterRead(event) {
    wx.showLoading();
    const { file } = event.detail;
    let {index} = event.currentTarget.dataset;
    let {data} = await util.uploadFile(file);
    wx.hideLoading();
    data = JSON.parse(data);  //数据转化
    this.setData({
      ['info.checkList['+index+'].filePath']:data.content.storePath,
      ['info.checkList['+index+'].fileId']:data.content.flowId,
      ['info.checkList['+index+'].abnormalList']:[{url:data.content.fullPath}],
    });
  },
  abnormalDeleteImg(event){
    let {index} = event.currentTarget.dataset;
    this.setData({['info.checkList['+index+'].abnormalList']:[]});
  },
  // 提交
  async submit(e){
    let {info,ticketList} = this.data;
    if(ticketList.length==0){
      wxApi.showToast("请上传里程数图片");
      return
    }
    info.mileageFileId = ticketList[0].imgId;
    info.mileageFilePath = ticketList[0].imgPath;
    // 拦截重复提交
    if(this.data.disabled){
      return
    }else{
      const timer = setTimeout(() => {
        this.setData({disabled:false});
        clearTimeout(timer);
      },2000)
    }
    this.setData({disabled:true})
    await util.postByBeanName('resVehicleInfoTF','submitVehicleCheck',info);
    if(info.type==1){
      // 接单出车，调用来源页面的receive方法（todoTasks,truckingDetail）
      const pages = getCurrentPages();
      if (pages.length > 1) {
        const prevPage = pages[pages.length - 2];
        // 检查上一页是否为todoTask或truckingDetail页面
        if (prevPage.route && (
          prevPage.route.includes('todoTasks/todoTasks') || 
          prevPage.route.includes('truckingDetail/truckingDetail') ||
          prevPage.route.includes('orderDetail/orderDetail')
        )) {
          // 调用上一页的receive方法
          if (typeof prevPage.receive === 'function') {
            prevPage.receive();
          }
        }
      }
    }else if(info.type==3){
      await util.postByBeanName('miniProgramDriverTF','opWorkNode',{workNodeId: this.data.workNodeId});
      await wxApi.showModal('操作成功');
      wx.navigateBack({
        delta:1,
      })
    }
  },
  back(){
    wx.navigateBack({
      delta: 1,
    })
  },
})