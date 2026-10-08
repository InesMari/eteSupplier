import {
  util,
  wxApi,
  common,
  regeneratorRuntime
} from '../../../common/commonImport'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {},
    isshowPickupGoodsDetail: false, //是否展示货物清单 - 提货
    isshowDeliveryGoodsDetail: false, //是否展示货物清单 - 卸货
    ticketList: [],
    lastSaveTime:0,
    // 后台定位失败后的定时器
    locationFallbackTimer: null,
  },

  onShow() {
    // 延迟执行不然storage存储失败
    const timer = setTimeout(() => {
      if (common.isNotBlank(this.data.waybillId)) {
        this.doQuery();
      }
      clearTimeout(timer)
    }, 500)
    wx.offLocationChange();
    this.checkPermissionAndStartLocation();
  },
  onHide() {
    // 页面隐藏时销毁定位fallback定时器
    this.stopLocationFallbackTimer();
  },
  onUnload() {
    // 页面卸载时销毁定位fallback定时器
    this.stopLocationFallbackTimer();
  },
  onLoad(query) {
    console.log(query)
    if (query.scene) { //二维码
      let dataStr = decodeURIComponent(query.scene);
      let dataArr = dataStr.split("=");
      let waybillId = dataArr[1];
      wx.setStorageSync('toTruckingDetail', {
        waybillId,
        toTruckingDetail: 1
      });
      this.setData({
        waybillId
      });
    } else {
      let {
        waybillId,
        inWaySum,
        workNodeId
      } = query;
      this.setData({
        waybillId,
        inWaySum,
        workNodeId
      });
    }
    // 延迟执行不然storage存储失败
    // const timer = setTimeout(() => {
    //   this.doQuery();
    //   clearTimeout(timer)
    // }, 300)

  },
  async doQuery() {    
    try{
      console.log(this.data.waybillId)
      let info = await util.postByBeanName('miniProgramDriverTF', 'queryWaybillInfoByWaybillId', {
        waybillId: this.data.waybillId
      });
      this.setData({
        info
      });
      try{
        let lastWorkList = info.workList[info.workList.length - 1];
        let lastWork = "";
        lastWorkList.nodeList.forEach(item => {
          if(item.nodeType == 99){
            lastWork = item;
          }
        })
        this.setData({
          ['info.lastWorkList']:lastWorkList,
          ['info.lastWork']:lastWork,
        })
      }catch(e){}
      if (info.waybillState > 2) {
        this.setData({
          "info.currentWork": info.workList[0],
          ticketList: []
        })
      }
      this.fliterImg();
    }catch(e){
      if(e.data.status != 501) return;
      wx.showModal({
        title: '退出登录',
        content: '该账户没有操作权限是否登录其他账号？',
        success: (res) => {
          if (res.confirm) {
            util.postByBeanName('wxUserTF', 'logout');
            wx.reLaunch({
              url: '/pages/login/login',
            })
          }
        }
      });
    }
  },
  // 根据作业点筛选图片
  fliterImg() {
    this.data.ticketList = [];
    let {
      receiptsList
    } = this.data.info;
    let currentWorkId = this.data.info.currentWork.id;
    receiptsList.forEach((el, index) => {
      if (currentWorkId == el.waybillWorkId) {
        let obj = {
          url: common.getBigImgPath(el.fullPath),
          name: el.receiptsTypeName,
          deletable: false
        }
        this.data.ticketList.push(obj);
      }
    })
    this.setData({
      ticketList: this.data.ticketList
    })
  },
  // 货物清单 - 提货
  async showPickupGoodsDetail() {
    if (common.isBlank(this.data.pickupGoodsList)) {
      var pickupGoodsList = await util.postByBeanName('miniProgramDriverTF', 'loadWaybillGoodsListByWaybillId', {
        waybillId: this.data.waybillId,
        goodsWorkType: 1
      });
    }
    let isshowPickupGoodsDetail = this.data.isshowPickupGoodsDetail ? false : true;
    this.setData({
      isshowPickupGoodsDetail,
      pickupGoodsList
    });
  },
  // 货物清单 - 卸货
  async showDeliveryGoodsDetail() {
    if (common.isBlank(this.data.deliveryGoodsList)) {
      var deliveryGoodsList = await util.postByBeanName('miniProgramDriverTF', 'loadWaybillGoodsListByWaybillId', {
        waybillId: this.data.waybillId,
        goodsWorkType: 2
      });
    }
    let isshowDeliveryGoodsDetail = this.data.isshowDeliveryGoodsDetail ? false : true;
    this.setData({
      isshowDeliveryGoodsDetail,
      deliveryGoodsList
    });
  },
  // 选择作业点
  workChange(e) {
    let {
      item
    } = e.currentTarget.dataset;
    this.setData({
      "info.currentWork": item,
      ticketList: []
    })
    this.fliterImg();
  },
  // 上传单据
  toUploadTicket() {
    wx.navigateTo({
      url: `/driver/task/uploadTicket/uploadTicket?waybillId=${this.data.waybillId}`,
    })
  },
  // 打印回单
  toPrintTag(){
    wx.navigateTo({
      url: `/driver/task/printTag/printTag?waybillNum=${this.data.info.waybillNum}&waybillId=${this.data.waybillId}`,
    })
  },
  // 操作作业点
  async nodeOperation(e) {
    let {
      item
    } = e.currentTarget.dataset;
    // let item = this.data.info.lastWork;

    // 车辆点检
    if (this.data.info.currentWork.vehicleCheck) {
      wx.navigateTo({
        url: `/driver/vehicleCheck/vehicleCheckDetail/vehicleCheckDetail?waybillId=${this.data.waybillId}&workNodeId=${item.workNodeId}`,
      })
      return;
    }

    if (item.nodeType == 99 && this.data.info.vehicleAttribution == 2) { //收车 - 跳去上传公里数页面（自有车才上传）
      wx.navigateTo({
        url: `/driver/task/checkAndUploadKM/checkAndUploadKM?waybillId=${this.data.waybillId}&workNodeId=${item.workNodeId}&type=3`,
      })
    } else {
      await util.postByBeanName('miniProgramDriverTF', 'opWorkNode', {
        workNodeId: item.workNodeId
      });
      await this.doQuery();
      await wxApi.showModal("操作成功");
    }
  },
  // 申请回程业务
  async apply() {
    if (this.data.info.hasSchedule) {
      wxApi.showToast("已申请回程业务，无需再次申请。")
    } else {
      let _this = this;
      if(this.data.isLocaltionTimer){
        wxApi.showToast("正在获取定位，请稍候再进行点击")
        return
      }
      wx.getLocation({
        type:"gcj02",
        success(res){
          _this.data.isLocaltionTimer = true;
          _this.data.localtionTimer = setTimeout(()=>{
            _this.data.isLocaltionTimer = false;
            clearTimeout(_this.data.localtionTimer)
          },30000)
          let point = common.qqMapTransBMap(res.longitude,res.latitude);        
          let distance = common.getMapDistance(_this.data.info.lastWorkList.latitude,_this.data.info.lastWorkList.longitude,point.latitude,point.longitude);
          console.log(distance)
          if(distance<100000){
            _this.submitApply();
          }else{
            wxApi.showToast("与当前的始发地距离大于100公里，不可申请回程单！")
          }
        },
        fail(error){
          wxApi.showToast("请打开定位服务。")
        }
      })  
    }
  },
  async submitApply(){
    let {
      confirm
    } = await wxApi.showModal({
      title: "申请回程单提示",
      content: "是否确定申请回程单？",
      showCancel: true
    });
    if (confirm) {
      await util.postByBeanName('resOwnVehicleScheduleTF', 'saveOwnVehicleSchedule', {
        waybillId: this.data.waybillId
      });
      wxApi.showToast("成功提交申请。")
    }
  },
  // 调整作业点
  toWaySort() {
    let info = encodeURI(JSON.stringify(this.data.info.workList));
    wx.navigateTo({
      url: `/driver/task/waySort/waySort?info=${info}&waybillId=${this.data.waybillId}`,
    })
  },
  // 上锁拍照
  async photoLock() {
    let _this = this;
    wx.chooseImage({
      sourceType: ['camera'],
      async success(res) {
        let {
          data
        } = await util.uploadFile(res.tempFiles[0]);
        data = JSON.parse(data); //数据转化
        let imgId = data.content.flowId;
        let imgPath = data.content.storePath;
        let waybillId = _this.data.waybillId;
        let currentWaybillWorkId = _this.data.info.currentWork.id;
        await util.postByBeanName('miniProgramDriverTF', 'lockUpload', {
          waybillId,
          currentWaybillWorkId,
          imgId,
          imgPath
        });
        wxApi.showModal("上传成功");
      }
    })
  },
  // 查看公里数大图
  seeBigImg(e) {
    let {
      key
    } = e.currentTarget.dataset;
    if (key == '1') {
      wx.previewImage({
        urls: [this.data.info.mileage.startMileageFilePath],
      })
    }
    if (key == '2') {
      wx.previewImage({
        urls: [this.data.info.mileage.endMileageFilePath],
      })
    }
  },
  // 接单出车
  async toReceive() {
    if (this.data.info.vehicleAttribution != 2) {
      let url = await util.postByBeanName('miniProgramDriverTF', 'createTransportationAgreement', {
        waybillId: this.data.waybillId
      });
      wx.navigateTo({
        url: `/pages/agreement/agreement?url=${url}`,
      })
    }else{
      wx.navigateTo({
        url: `/driver/task/checkAndUploadKM/checkAndUploadKM?waybillId=${this.data.waybillId}&type=1`,
      })
    }
  },
  // 接单出车
  async receive() {
    let _this = this;
    if (wx.canIUse("getLocation")) {
      wx.getLocation({
        type: 'wgs84',
        async success(res) {
          _this.submit(res)
        },
        fail() {
          _this.checkLocationAuth();
        }
      })
    } else {
      _this.submit()
    }
  },
  // 检查定位
  async checkLocationAuth() {
    let isAuthorized;
    try {
      isAuthorized = await common.checkLocationAuth();
    } catch (e) {}
    if (isAuthorized) {
      //  已授权则提升系统定位没打开
      wxApi.showModal("无法获取定位，请检查系统是否已打开定位。")
    } else {
      //  未授权则跳去授权页面
      this.setData({
        isshowAlert: true
      })
    }
  },
  openSetting() {
    wx.openSetting();
  },
  cancelAlert() {
    this.setData({
      isshowAlert: false
    })
  },
  async submit(res) {
    let param = {
      workNodeId: this.data.workNodeId,
      waybillId: this.data.waybillId
    }
    if (res) {
      let {
        latitude,
        longitude
      } = common.qqMapTransBMap(res.longitude, res.latitude);
      param.latitude = latitude;
      param.longitude = longitude;
    }
    await util.postByBeanName('miniProgramDriverTF', 'opWaybillLanding', param);
    await wxApi.showModal("接单成功");
    wx.navigateBack({
      delta: 2,
    })
  },
  // 查看接单声明
  toArgeement() {
    let url = this.data.info.transportationAgreementFileUrl;
    wx.navigateTo({
      url: `/pages/agreement/agreement?detail=true&url=${url}`,
    })
  },
  // 协议回调方法
  webViewCallback({
    down,
    id
  }) {
    if (down) { //下载
      this.downPDF();
    } else { //接单
      this.receive();
    }
  },
  // 下载pdf
  downPDF() {
    let url = this.data.info.transportationAgreementFileUrl;
    console.log(url)
    wx.downloadFile({
      url, // 下载url
      success(res) {
        // 下载完成后转发
        wx.shareFileMessage({
          filePath: res.tempFilePath,
          fileName: "接单声明协议.pdf",
          success() {
            wxApi.showToast("下载成功");
          },
          fail(error) {
            console.log(error)
            wxApi.showToast("下载失败");
          },
        })
      },
      fail(error) {
        console.log(error)
        wxApi.showToast("下载失败");
      },
    })
  },

  // 检查系统定位服务是否开启（需在已有scope.userLocation授权后调用）
  checkSystemLocation() {
    return new Promise((resolve) => {
      wx.getLocation({
        type: 'gcj02',
        success: () => {
          resolve(true);
        },
        fail: () => {
          // 已有权限的情况下还失败，说明系统GPS未开启
          wxApi.showModal('请打开手机系统GPS定位服务！');
          resolve(false);
        }
      });
    });
  },

  // 检查权限并启动定位
  async checkPermissionAndStartLocation() {    
    let needGps = await util.postByBeanName('resVehicleInfoTF','isNeedMobileGps');
    if(!needGps) return;

    var _this = this;
    wx.getSetting({
      success: async (res) => {
        if (res.authSetting['scope.userLocation']) {
          // 已有权限 → 检测系统GPS是否开启
          var systemLocationOn = await _this.checkSystemLocation();
          if (systemLocationOn) {
            _this.startBackgroundLocation();
          } else {
            // 系统GPS未开，启动备用定时器
            _this.uploadAuthorizeLocation(0);
            _this.startLocationFallbackTimer();
          }
        } else {
          // 没有权限，请求授权
          _this.requestLocationPermission();
        }
      },
      fail: (err) => {
        console.error('检查权限失败:', err);
        _this.setData({ status: '检查权限失败' });
      }
    });
  },

  // 请求位置权限
  requestLocationPermission() {
    var _this = this;
    wx.authorize({
      scope: 'scope.userLocation',
      success: async () => {
        console.log('位置权限授权成功');
        // 授权成功后再检测系统GPS
        var systemLocationOn = await _this.checkSystemLocation();
        if (systemLocationOn) {
          _this.startBackgroundLocation();
        } else {
          _this.uploadAuthorizeLocation(0);
          _this.startLocationFallbackTimer();
        }
      },
      fail: (err) => {
        console.error('位置权限授权失败:', err);
        _this.uploadAuthorizeLocation(-1);
        // 引导用户手动授权
        wx.showModal({
          title: '需要位置权限',
          content: '请在设置位置信息中选择使用小程序期间和离开小程序后',
          confirmText: '去设置',
          success: (res) => {
            if (res.confirm) {
              wx.openSetting();
            }
          }
        });
      }
    });
  },

  // 启动后台定位
  startBackgroundLocation() {
    let startListenLocationTime = new Date().getTime();
    wx.setStorageSync('startListenLocationTime',startListenLocationTime);
    wx.startLocationUpdateBackground({
      success: () => {
        console.log('后台定位启动成功');
        // 停止备用fallback定时器（如果存在）
        this.stopLocationFallbackTimer();
        this.uploadAuthorizeLocation(1);
        this.setData({
          status: '后台定位运行中...'
        });

        // 开始监听位置变化
        this.startLocationListener();

      },
      fail: (err) => {
        console.error('后台定位启动失败:', err);
        this.uploadAuthorizeLocation(0);
        // 启动备用定时器，每30秒用getLocation获取一次定位
        this.startLocationFallbackTimer();
        // 引导用户手动授权
        wx.showModal({
          title: '需要位置权限',
          content: '请在设置位置信息中选择使用小程序期间和离开小程序后',
          confirmText: '去设置',
          success: (res) => {
            if (res.confirm) {
              wx.openSetting();
            }
          }
        });
      }
    });
  },
  // 上传是否开启定位
  uploadAuthorizeLocation(sts){
    let userInfo = wx.getStorageSync("userInfo");
    util.postByBeanName('driverTF','isOpenLocation',{userId:userInfo.userId,isOpenLocation:sts});
  },
  // 开始监听位置变化
  startLocationListener() {
    wx.onLocationChange((res) => {
      let {longitude,latitude} = common.qqMapTransBMap(res.longitude,res.latitude);
      this.updateLocation({
        latitude,
        longitude,
        accuracy: res.accuracy,
        speed: res.speed,
        altitude: res.altitude
      });
    });
  },
  // 启动备用定位定时器（后台定位失败时使用）
  startLocationFallbackTimer() {
    // 先清除已存在的定时器，避免重复
    this.stopLocationFallbackTimer();
    var locationTimer = setInterval(() => {
      wx.getLocation({
        type: 'gcj02',
        success: (res) => {
          console.log('fallback定位成功:', res);
          let {longitude, latitude} = common.qqMapTransBMap(res.longitude, res.latitude);
          this.updateLocation({
            latitude,
            longitude,
            accuracy: res.accuracy,
            speed: res.speed,
            altitude: res.altitude
          });
        },
        fail: (err) => {
          console.error('fallback定位失败:', err);
        }
      });
    }, 30000);
    this.setData({locationFallbackTimer: locationTimer});
  },
  // 销毁备用定位定时器
  stopLocationFallbackTimer() {
    if (this.data.locationFallbackTimer) {
      clearInterval(this.data.locationFallbackTimer);
      this.setData({locationFallbackTimer: null});
    }
  },
  // 更新位置信息
  updateLocation(location) {
    const now = new Date();            
    // 获取年月日
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    
    // 获取时分秒
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    let gpsTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    const locationWithTime = {
      ...location,
      plateNumber:this.data.info.plateNumber,
      gpsTime,
    };

    // 更新显示的位置信息
    this.setData({
      location: locationWithTime
    });

    // 每分钟保存一次到历史记录
    this.saveLocationToHistory(locationWithTime);
  },
  // 保存位置到历史记录（每分钟保存一次）
  async saveLocationToHistory(location) {
    const currentTime = Date.now();
    
    console.log(this.data.lastSaveTime)
    // 检查是否距离上次保存已超过1分钟
    if (currentTime - this.data.lastSaveTime < 60000) {
      return;
    }
    let startListenLocationTime = wx.getStorageSync('startListenLocationTime');
    let tenDay = 60*1000*60*24*10;  //10天时间
    if(currentTime - startListenLocationTime > tenDay){   //10天自动退出监听
      wx.offLocationChange();
    }
    this.setData({
      lastSaveTime: currentTime
    });
    console.log(location)
    await util.postByBeanName('resVehicleInfoTF','saveVehicleMobileGps',location);
  },
})