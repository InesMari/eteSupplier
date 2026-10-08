import {util,wxApi,common,regeneratorRuntime} from '../../common/commonImport'
/*
miniProgramDriverTF 司机端都是这个接口

homeStatisticsData首页静态数据

loadReceiptsDataByWaybillId 点击上传单据进入页面获取数据接口 参数waybillId

uploadWaybillReceipts 提交单据接口 参数 waybillId currentWaybillWorkId receiptsList

queryWaybillInfoByWaybillId派车单详情接口 参数 waybillId

loadWaybillGoodsListByWaybillId 查询提货、卸货货物明细接口 参数 waybillId、goodsWorkType 1提 2卸
节点操作   出车收车也是这个
opWorkNode  参数workNodeId

miniProgramWaybillTF
queryWaybillListPage 待办任务接口 参数 queryType 1

queryWaybillListPage 历史任务接口 参数 queryType 2
*/

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userType:1,       //用户类型，1供应商，2司机
    haveUserType:3,   //值为3时，同时是供应商和司机
    userInfo:{},
    info:{},
    isPickupGoodsList:true,
    isshowGoodsDetail:false,  //是否展示货物清单
    lastSaveTime:0,
    // 短驳单确认完成相关数据
    isshowAlert:false,
    timeoutReasonList:[],
    mileage:"",
    // 后台定位失败后的定时器
    locationFallbackTimer: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo = wx.getStorageSync('userInfo');
    this.setData({haveUserType:userInfo.userType,userInfo,token:userInfo.tokenId});
    if(this.data.haveUserType!=3){
      this.setData({userType:this.data.haveUserType});
    }
    // 司机首页时查询任务
    if(userInfo.userType==2){
      this.queryTask();
    }
  },
  onShow:function(){
    wx.hideHomeButton();
    let userInfo = wx.getStorageSync('userInfo');
    //查询银行卡数
    if(userInfo.userType!=2){
      this.queryCardTotal();
    }
    // 司机首页时查询任务
    if(common.isNotBlank(userInfo)&&this.data.userType==2){
      this.queryTask();
    }
  },
  onHide:function(){
    // 页面隐藏时销毁定位fallback定时器
    if(this.data.locationFallbackTimer){
      clearInterval(this.data.locationFallbackTimer);
      this.setData({locationFallbackTimer:null});
    }
  },
  //切换用户类型
  async chooseUserType(e){
    let {type} = e.currentTarget.dataset;
    this.setData({userType:type})
    let token = this.data.token;
    await util.postByBeanName('wxUserTF','selUserType',{token,userType:type});
    // 司机首页时查询任务
    if(type==2){
      this.queryTask();
    }
  },
  //查询银行卡数
  async queryCardTotal(){
    let cardTotal = await util.postByBeanName('bankTF','queryBankInfoCount');
    this.setData({cardTotal})
  },
  //查询司机任务
  async queryTask(){
    let info = await util.postByBeanName('miniProgramDriverTF','homeStatisticsData');
    this.setData({info,goodsList:info.pickupGoodsList,isPickupGoodsList:true});
    if(info.hasCurrentTask) {
      let lastWorkList = info.workList[info.workList.length - 1];
      let lastWork = "";
      lastWorkList.nodeList.forEach(item => {
        if(item.nodeType == 99){
          lastWork = item;
        }
      })
      this.setData({['info.lastWorkList']:lastWorkList,['info.lastWork']:lastWork});
      if(info.currentWork.workType==2){
        this.changeGoodsTyep();
      }
      let res = await util.postByBeanName('resVehicleInfoTF','isNeedMobileGps');
      if(res){
        wx.offLocationChange();
        this.checkPermissionAndStartLocation();
      }
    }
    
    // 检查短驳单是否超时
    if(info.currentWmsTask){
      let isTimeout = await util.postByBeanName('miniProgramWaybillTF','isTimeout',{waybillId:info.currentWmsTask.id});
      if(isTimeout){
        let {TIMEOUT_REASON4} = await util.postByBeanName('commonTF','getSysStaticDataByCodeTypes',{codeType:"TIMEOUT_REASON4"});
        this.setData({isTimeout,timeoutReasonList:TIMEOUT_REASON4});
      }
    }
  },
  // 切换货物信息
  changeGoodsTyep(){
    let {isPickupGoodsList,info} = this.data;
    isPickupGoodsList = isPickupGoodsList?false:true;
    this.setData({isPickupGoodsList});
    if(isPickupGoodsList){  //提货信息
      this.setData({goodsList:info.pickupGoodsList})
    }else{    //卸货信息
      this.setData({goodsList:info.deliveryGoodsList})
    }
  },
  getLocaltion(){
    var {latitude,longitude,workAddress} = this.data.info.currentWork;
    var {latitude,longitude} = common.bMapTransQQMap(longitude,latitude);
    wx.showLoading({
      title: '正在加载地图',
    })
    wx.getLocation({
      type: 'wgs84', 
      success: function (res) {
        wx.openLocation({//​使用微信内置地图查看位置。
          latitude:Number(latitude),//要去的纬度-地址
          longitude:Number(longitude),//要去的经度-地址
          name:workAddress
        })
        wx.hideLoading()
      },
      fail(res){
        wx.hideLoading()
        if(res.errCode == 2){
          wxApi.showToast("请打开手机GPS定位服务！");
        }
      }
    })
  },
  // 运输管理
  toTransport(){
    wx.navigateTo({
      url: '/supplier/transport/transportManage/transportManage',
    })
  },
  // 零担业务
  toLD(){
    wx.navigateTo({
      url: '/supplier/ld/ldManage/ldManage',
    })
  },
  // 司机管理
  toDrive(){
    wx.navigateTo({
      url: '/supplier/driver/driverManage/driverManage',
    })
  },
  // 供应商 - 车辆管理
  toVehicle(){
    wx.navigateTo({
      url: '/supplier/vehicle/vehicleManage/vehicleManage',
    })
  },
  //运力管理
  toCapacity(){
    wx.navigateTo({
      url: '/supplier/capacity/capacityManager/capacityManager',
    })
  },
  toBid(){
    wx.navigateTo({
      url: '/supplier/bid/bidManage/bidManage',
    })
  },
  // 器具登记
  toDeviceHome(){
    wx.navigateTo({
      url: '/supplier/device/deviceHome/deviceHome',
    })
  },
  // 作业登记
  toJobReg(){
    wx.navigateTo({
      url: '/supplier/jobReg/jobRegManage/jobRegManage',
    })
  },
  //银行卡管理
  toBankcards(){
    wx.navigateTo({
      url: '/supplier/personal/bankcards/bankcards',
    })
  },
  // 未完成模块
  toWait(){
    wxApi.showToast("功能暂未开放，敬请期待~")
  },
  // 个人信息
  toPersonal(){
    if(this.data.userType==1){
      wx.navigateTo({
        url: '/supplier/personal/personal/personal',
      })
    }else if(this.data.userType==2){
      wx.navigateTo({
        url: '/driver/personal/personal/personal',
      })
    }
  },
  toMsg(){
    // if(this.data.userType==1){
      wx.navigateTo({
        url: '/supplier/msg/msgManage/msgManage',
      })
    // }
  },

  //任务start
  toWaySort(){  //调整作业点
    let info = encodeURI(JSON.stringify(this.data.info.workList));
    wx.navigateTo({
      url: `/driver/task/waySort/waySort?info=${info}&waybillId=${this.data.info.waybill.waybillId}`,
    })
  },
  // 节点操作前置逻辑
  async nodeOperation(e){ 
    let {item} = e.currentTarget.dataset;
    // let item = this.data.info.lastWork;
    // 车辆点检
    // if(this.data.info.currentWork.vehicleCheck){
    //   wx.navigateTo({
    //     url: `/driver/vehicleCheck/vehicleCheckDetail/vehicleCheckDetail?waybillId=${this.data.info.waybill.waybillId}&workNodeId=${item.workNodeId}`,
    //   })
    //   return;
    // }
    if(item.sts == 1) return;   //已到达则拦截
    if(item.nodeType==99 && this.data.info.waybill.vehicleAttribution==2){  //收车 - 跳去上传公里数页面      
      wx.navigateTo({
        url: `/driver/task/checkAndUploadKM/checkAndUploadKM?waybillId=${this.data.info.waybill.waybillId}&workNodeId=${item.workNodeId}&type=3`,
      })
      return
    }
    let _this = this;  
    //获取当前位置
    var data = await wxApi.getLocation().catch(async function(res){
      if(res.errCode == 2){   //没有打开定位是处理
        let {confirm} = await wxApi.showModal({
          content:"获取当前位置失败，手机没开启GPS定位服务，是否跳过定位继续操作？",
          showCancel:true
        });
        //是否跳过定位
        if(confirm) _this.doNodeOperation(item.workNodeId);
      }else{
        //其他错误时候
        _this.doNodeOperation(item.workNodeId);
      }
    })
    //有定位信息时候的节点操作
    if(common.isNotBlank(data)) this.doNodeOperation(item.workNodeId,data.latitude,data.longitude);
  },
  /**
   * 节点操作
   * @param {作业点Id} workNodeId 
   * @param {纬度，不能写latitude，敏感字段} lat 
   * @param {经度，不能写longitude，敏感字段} lng 
   */
  async doNodeOperation(workNodeId,lat,lng){
    if(common.isNotBlank(lat) && common.isNotBlank(lng)){
      var {latitude,longitude} = common.qqMapTransBMap(lng,lat);
    }else{
      var latitude = "",longitude = "";
    }
    await util.postByBeanName('miniProgramDriverTF','opWorkNode',{workNodeId,latitude,longitude});
    await this.queryTask();
    await wxApi.showModal("操作成功");
  },
  // 申请回程业务
  apply(){
    if(this.data.info.hasSchedule){
      wxApi.showToast("已申请回程业务，无需再次申请。")
    }else{
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
          console.log(error)
          wxApi.showToast("请打开定位服务。")
        }
      })   
      
    }
  },
  async submitApply(){
    let {confirm} = await wxApi.showModal({
      title:"申请回程单提示",
      content:"是否确定申请回程单？",
      showCancel:true
    });
    if(confirm){
      await util.postByBeanName('resOwnVehicleScheduleTF','saveOwnVehicleSchedule',{waybillId:this.data.info.waybill.waybillId});
      wxApi.showToast("成功提交申请。")
    }
  },
  // 上锁拍照
  async photoLock(){
    let _this = this;    
    //获取当前位置
    try{
      var {latitude,longitude} = await wxApi.getLocation();
      if(common.isNotBlank(latitude) && common.isNotBlank(longitude)){
        var {latitude,longitude} = common.qqMapTransBMap(longitude,latitude);
      }else{
        latitude = "";longitude = "";
      }
    }catch(e){};
    wx.chooseImage({
      sourceType: ['camera'],
      async success(res){
        let {data} = await util.uploadFile(res.tempFiles[0]);
        data = JSON.parse(data);  //数据转化
        let imgId = data.content.flowId;
        let imgPath = data.content.storePath;
        let waybillId = _this.data.info.waybill.waybillId;
        let currentWaybillWorkId = _this.data.info.currentWork.id;
        await util.postByBeanName('miniProgramDriverTF','lockUpload',{waybillId,currentWaybillWorkId,imgId,imgPath,latitude,longitude});
        wxApi.showModal("上传成功");
      }
    })
  },
  // 查看提货凭证
  seePickupImg(){
    let urls = [];
    this.data.info.pickupCertificateList.forEach(el => {
      urls.push(el.fullPath);
    })
    wx.previewImage({
      urls // 需要预览的图片http链接列表
    })
  },
  /**
   * 查看货物详情
   */
  showGoodsDetail(){
    let isshowGoodsDetail = this.data.isshowGoodsDetail?false:true;
    this.setData({isshowGoodsDetail});
  },
  // 上传单据
  toUploadTicket(){
    wx.navigateTo({
      url: `/driver/task/uploadTicket/uploadTicket?waybillId=${this.data.info.waybill.waybillId}`,
    })
  },
  // 派车单详情
  toTruckingDetail(){
    wx.navigateTo({
      url: `/driver/task/truckingDetail/truckingDetail?waybillId=${this.data.info.waybill.waybillId}`,
    })
  },
  // 短驳单单详情
  toShortBargeDetail(){
    wx.navigateTo({
      url: `/driver/task/shortBarge/shortBarge?waybillId=${this.data.info.currentWmsTask.id}`,
    })
  },
  // 待办任务
  todoTasks(){
    wx.navigateTo({
      url: `/driver/task/todoTasks/todoTasks`,
    })
  },
  // 订单包业务
  toOrderPackage(){
    wx.navigateTo({
      url: `/driver/orderPackage/orderList/orderList`,
    })
  },
  // 历史任务
  toHistoryTasks(){
    wx.navigateTo({
      url: `/driver/task/historyTasks/historyTasks`,
    })
  },
  // 点检管理
  toVehicleCheck(){
    wx.navigateTo({
      url: `/driver/vehicleCheck/vehicleCheckManage/vehicleCheckManage`,
    })
  },
  // 司机 - 车辆管理
  toDriverVehicle(){
    let vehicleId = this.data.info.vehicleId;
    wx.navigateTo({
      url: '/driver/vehicle/addVehicle/addVehicle?id='+vehicleId,
    })
  },
  // 车辆运输成本
  toCostCapacity(){
    wx.navigateTo({
      url: `/driver/costCapacity/costCapacityList/costCapacityList`,
    })
  },
  // 车辆修理成本
  toVehicleRepairCost(){
    wx.navigateTo({
      url: `/driver/vehicleRepairCost/vehicleRepairCostList/vehicleRepairCostList`,
    })
  },
  // 标签扫码查询
  doScan(){
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        console.log('扫码成功:', res);
        const waybillId = res.result;
        wx.navigateTo({
          url: `/driver/task/truckingDetail/truckingDetail?waybillId=${waybillId}`,
        });
      },
      fail: (err) => {
        console.error('扫码失败:', err);
        wx.showToast({
          title: '扫码失败，请重试',
          icon: 'none'
        });
      }
    });
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
  checkPermissionAndStartLocation() {
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
      console.log(res)
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
  
  // 短驳单确认完成相关方法
  // 输入重量
  inputSetDataMileage(e){
    let {value} = e.detail;
    this.setData({ mileage:value });
  },
  // 显示确认完成对话框
  showAlert(){
    this.setData({isshowAlert:true})
  },
  // 隐藏确认完成对话框
  cancelAlert(){
    this.setData({isshowAlert:false,mileage:""})
  },
  // 确认完成
  async sureAlert(){
    let returnNums = this.data.mileage;
    let isReturn = this.data.info.currentWmsTask.isReturn || 0;
    let timeoutReason = this.data.timeoutReason;
    if(this.data.isTimeout && common.isBlank(timeoutReason)){
      wxApi.showToast("请选择超时原因！")
      return;
    }
    await util.postByBeanName('miniProgramWaybillTF','driverDoneWaybill',{
      waybillId: this.data.info.currentWmsTask.id,
      returnNums,
      isReturn,
      timeoutReason
    }); 
    await wxApi.showModal("确认成功！");
    this.cancelAlert();
    await this.queryTask();
  },
  // 选择超时原因
  timeoutReasonChange(e){
    let { value } = e.detail;
    this.setData({
      timeoutReason: this.data.timeoutReasonList[value].codeValue,
      timeoutReasonIndex: value,
    })
  },
  // 选择返程
  onRaidoChange(e){
    this.setData({['info.currentWmsTask.isReturn']:e.detail,mileage:""})
  },
})