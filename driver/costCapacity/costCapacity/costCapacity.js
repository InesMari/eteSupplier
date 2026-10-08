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
    vehicleData: [],
    feeTypeData: [],
    info: {},
    fileList: [],
    receiptsList:[],
    disabled: false,
    tip: ['升', '次', '克', '次', '次'],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad({
    id
  }) {
    await this.initStaticData();
    if (common.isNotBlank(id)) {
      this.doQuery(id);
    }
  },
  async initStaticData() {
    let vehicleData = await util.postByBeanName("resVehicleInfoTF", "queryAllVehicleNoPage", {
      vehicleAttribution: 2
    });
    let plateNumerId = await util.postByBeanName('vehicleWaybillCostService', 'getPlateNumer');
    let {VEHICLE_WAYBILL_COST_VEHICLE_TYPE,COST_PAY_TYPE} = await util.postByBeanName('commonTF','getSysStaticDataByCodeTypes',{codeType:"VEHICLE_WAYBILL_COST_VEHICLE_TYPE,COST_PAY_TYPE"});
    this.setData({
      vehicleData,
      costPayData:COST_PAY_TYPE,
      feeTypeData:VEHICLE_WAYBILL_COST_VEHICLE_TYPE
    })
    this.data.vehicleData.forEach((item, index) => {
      if (item.id == plateNumerId) {
        this.setData({
          "info.plateNumber": item.plateNumber,
          "info.vehicleId": item.id,
          vehicleIndex: index
        })
      }
    })
  },
  async doQuery(id) {
    let info = await util.postByBeanName("vehicleWaybillCostService", "queryVehicleWaybillCostInfoById", {
      id
    });
    let disabled = info.info.verifyState == 1 ? true : false;
    this.setData({
      info: info.info,
      fileList: info.fileList,
      receiptsList: info.receiptsList,
      disabled
    })
    this.initData();
  },
  // 数据回显
  async initData() {
    // 车牌号回显
    this.data.vehicleData.forEach((item, index) => {
      if (item.id == this.data.info.vehicleId) {
        this.setData({
          vehicleIndex: index
        })
      }
    })
    // 费用类型回显
    this.data.feeTypeData.forEach((el, index) => {
      if (this.data.info.costPayType == el.codeValue) {
        this.setData({
          costPayIndex: index
        })
      }
    })
    // 支付类型回显
    this.data.costPayData.forEach((el, index) => {
      if (this.data.info.feeType == el.codeValue) {
        this.setData({
          feeTypeIndex: index
        })
      }
    })
    // 附件回显
    this.data.fileList.forEach(async (item, index) => {
      let data = await util.postByBeanName("fileCommonTF", "doQuery", {
        flowIds: item.flowId
      });
      item.url = common.getBigImgPath(data[0].fullPath);
      item.fileName = data[0].fileName;
      item.fullPath = data[0].fullPath;
      item.flowId = data[0].flowId;
      item.storePath = data[0].storePath;
      this.setData({
        ['fileList[' + index + ']']: item
      })
    })
    // 付款截图回显
    this.data.receiptsList.forEach(async (item, index) => {
      let data = await util.postByBeanName("fileCommonTF", "doQuery", {
        flowIds: item.flowId
      });
      item.url = common.getBigImgPath(data[0].fullPath);
      item.fileName = data[0].fileName;
      item.fullPath = data[0].fullPath;
      item.flowId = data[0].flowId;
      item.storePath = data[0].storePath;
      this.setData({
        ['receiptsList[' + index + ']']: item
      })
    })
  },
  // 选择车牌号
  vehicleChange(e) {
    let {
      value
    } = e.detail;
    this.setData({
      "info.plateNumber": this.data.vehicleData[value].plateNumber,
      "info.vehicleId": this.data.vehicleData[value].id,
      vehicleIndex: value
    })
  },
  // 选择费用类型
  feeTypeChange(e) {
    let {
      value
    } = e.detail;
    this.setData({
      ['info.feeType']: this.data.feeTypeData[value].codeValue,
      feeTypeIndex: value,
      ['info.unit']: this.data.tip[value],
      ['info.costPayType']: '',
      costPayIndex: null,
    })
  },
  // 支付类型
  costPayChange(e){
    let {
      value
    } = e.detail;
    this.setData({
      ['info.costPayType']: this.data.costPayData[value].codeValue,
      costPayIndex: value,
    })
  },
  //原生 - input赋值
  inputSetDataDefault(e) {
    let {
      value
    } = e.detail;
    let {
      key
    } = e.currentTarget.dataset;
    this.data.info[key] = value;
    this.setData({
      info: this.data.info
    });
  },
  inputSetItemDataDefault(e) {
    let {
      value
    } = e.detail;
    let {
      key
    } = e.currentTarget.dataset;
    this.setData({
      ['info.' + key]: value
    })
  },
  // 日期选择
  bindDateChange: function (e) {
    let {
      value
    } = e.detail;
    let {
      key
    } = e.currentTarget.dataset;
    this.setData({
      ['info.' + key]: value
    })
  },
  // 选择附件
  async afterRead(event) {
    wx.showLoading();
    const {
      file
    } = event.detail;
    let {
      data
    } = await util.uploadFile(file);
    wx.hideLoading();
    data = JSON.parse(data); //数据转化
    let obj = {};
    obj.url = data.content.fullPath;
    obj.flowId = data.content.flowId;
    obj.storePath = data.content.storePath;
    obj.fullPath = data.content.fullPath;
    obj.fileName = data.content.fileName;
    this.data.fileList.push(obj);
    this.setData({
      fileList: this.data.fileList
    });
  },
  
  // 选择付款截图
  async afterReadReceipt(event) {
    wx.showLoading();
    const {
      file
    } = event.detail;
    let {
      data
    } = await util.uploadFile(file);
    data = JSON.parse(data); //数据转化
    let receiptNumber = await util.postByBeanName("vehicleWaybillCostService", "recognizeReceiptNumber", {
      fileId: data.content.storePath
    });
    wx.hideLoading();
    if(!receiptNumber){
      return
    }
    let obj = {};
    obj.url = data.content.fullPath;
    obj.flowId = data.content.flowId;
    obj.storePath = data.content.storePath;
    obj.fullPath = data.content.fullPath;
    obj.fileName = data.content.fileName;
    obj.receiptNumber = receiptNumber;
    this.data.receiptsList.push(obj);
    this.setData({
      receiptsList: this.data.receiptsList
    });
  },
  async submit() {
    let {
      info,
      fileList,
      receiptsList,
    } = this.data;
    info.fileList = fileList;
    info.receiptsList = receiptsList;
    if(fileList.length == 0){
      wxApi.showToast("请上传附件");
      return
    }
    await util.postByBeanName('vehicleWaybillCostService', 'saveOrUpdateVehicleWaybillCost', info);
    await wxApi.showModal('保存成功');
    wx.navigateBack({
      delta: 1,
    })
  }
})