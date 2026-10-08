import {util,wxApi,common,regeneratorRuntime} from '../../../common/commonImport'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:{},
    selectCitys:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad({id,copy}) {
    await this.doQuery();
    await this.initSite();
    if(common.isNotBlank(id)){
      this.initData(id,copy);
    }
    this.initDate();
    this.setData({copy})
  },
  async doQuery(){
    let {tenantId} = wx.getStorageSync("userInfo");
    let {items:vehicleList} = await util.postByBeanName("resVehicleInfoTF", "selVehicleInfoListByCond", {tenantId,isInvoice:-1,rows:999});
    let {items:driveList} = await util.postByBeanName("driverTF", "selDriverInfoListByCond", {tenantId,isInvoice:-1,rows:999});    
    let {BASE_CITY:baseCityList} = await util.postByBeanName('commonTF','getSysStaticDataByCodeTypes',{codeType:"BASE_CITY"});
    this.setData({vehicleList,driveList,baseCityList})
  },
  // 数据初始化回显
  async initData(id,copy){
    let info = await util.postByBeanName("vehicleScheduleService", "loadVehicleScheduleById", {id});
    if(copy==1){
      info.id = null;
      info.scheduleTime = "";
    }
    this.setData({info})
    // 车辆
    this.data.vehicleList.forEach((item,i) => {
      if(item.vehicleId == info.vehicleId){
        this.setData({vehicleIndex:i})
      }
    })
    // 司机
    this.data.driveList.forEach((item,i) => {
      if(item.driverUserId == info.driverUserId){
        this.setData({driveIndex:i})
      }
    })
    // 预计到达起始地
    this.data.baseCityList.forEach((item,i) => {
      if(item.codeValue == info.baseCityId){
        this.setData({baseCityIndex:i})
      }
    })
    // 常运线路目的地
    let endCity = this.data.info.endCity.split(",");
    let endCityName = this.data.info.endCityName.split(",");
    let {selectCitys,provinceList} = this.data;
    endCity.forEach((el,i) => {
      selectCitys.push({id:el,name:endCityName[i]})
    })
    let provinceIds = endCity.map(el => el.slice(0,2));
    provinceList.forEach(el => {
      if(common.isBlank(el.selectCount)) el.selectCount=0;
      provinceIds.forEach(item => {
        if(el.id == item){
          el.selectCount++;
        }
      })
    })
    this.setData({selectCitys,provinceList});
  },
  // 初始化日期
  initDate(){
    let timeList = [
      [
        {
          "name":'今天',
          "id":common.formatDate.getDate(new Date().getTime())
        },
        {
          "name":'明天',
          "id":common.formatDate.getDate(new Date().getTime() + 24*60*60*1000)
        },
        {
          "name":'后天',
          "id":common.formatDate.getDate(new Date().getTime() + 24*60*60*1000*2)
        }
      ],
    ];
    let hours = [];
    for(let i=0;i<24;i++){
      let value = i<10?'0'+i:i;
      hours.push({"name":value,id:value});
    }
    timeList.push(hours);
    let mins = [];
    for(let i=0;i<60;i++){
      let value = i<10?'0'+i:i;
      mins.push({"name":value,id:value});
    }
    timeList.push(mins);
    this.setData({timeList})
  },
  timeChange(e){
    let { value } = e.detail;
    let time = this.data.timeList[0][value[0]].id+" "+this.data.timeList[1][value[1]].id+":"+this.data.timeList[2][value[2]].id;
    this.setData({
      'info.scheduleTime':time
    })
  },
  // 初始化地址
  async initSite(){
    let provinceList = await this.getProvince();
    provinceList[0].active = true;
    let provinceId = provinceList[0].id; //默认北京
    //获取北京下级市
    let cityList = await this.getCity(provinceId);
    this.setData({provinceList,cityList,selectCitys:[]})
  },
  //获取省数据
  async getProvince() {
      let items = await util.postByBeanName("selectStaticDataTF","selectProvince",{});
      return items;
  },
  //获取对应的市
  async getCity(provinceId){
    let items = await util.postByBeanName("selectStaticDataTF","selectCity",{provinceId});
    items.forEach(item => {
      this.data.selectCitys.forEach(el => {
        if(item.id == el.id){
          item.select = true;
        }
      })
    })
    return items;
  },
  // 选择省份
  async selectProvince(e){
    let { item } = e.currentTarget.dataset;
    let provinceList = this.data.provinceList;
    provinceList.forEach(el => {
      el.active = false;
      if(item.id == el.id){
        el.active = true;
      }
    })
    let cityList = await this.getCity(item.id);
    this.setData({provinceList,cityList,currentProvince:item})
  },
  // 选择城市
  selectCity(e){
    let { index } = e.currentTarget.dataset;
    let {cityList,provinceList,currentProvince,selectCitys} = this.data;
    cityList[index].select = cityList[index].select?false:true;
    let selectCount = 0;
    // 遍历增加选择数量
    cityList.forEach(el => {
      if(el.select){
        selectCount++;
      }
    })
    provinceList.forEach(el => {
      if(currentProvince.id == el.id){
        el.selectCount = selectCount;
      }
    })
    // 判断是否已选择城市
    let isSel = false;
    selectCitys.forEach((el,i) => {
      if(el.id == cityList[index].id){
        isSel = true;
        selectCitys.splice(i,1)
      };
    })
    if(!isSel){
      let obj = {
        name:currentProvince.name + cityList[index].name,
        id:cityList[index].id
      }
      selectCitys.push(obj);
    }
    this.setData({provinceList,cityList,selectCitys})
  },
  // 清空选择
  clearCitys(){
    this.initSite();
    this.setData({
      ['info.endCity']:'',
      ['info.endCityName']:'',
    });
  },
  // 确认选择
  sureCitys(){
    let endCity = "";
    let endCityName = "";
    this.data.selectCitys.forEach(el => {
      endCity += el.id +",";
      endCityName += el.name +"，";
    })
    endCity = endCity.substr(0,endCity.length-1);
    endCityName = endCityName.substr(0,endCityName.length-1);
    this.setData({
      ['info.endCity']:endCity,
      ['info.endCityName']:endCityName,
      isShowPopover:false
    });
  },
  // 选择车牌号
  vehicleChange(e){
    let { value } = e.detail;
    this.setData({
      "info.plateNumber": this.data.vehicleList[value].plateNumber,
      "info.vehicleId": this.data.vehicleList[value].vehicleId,
      "info.vehicleLengthName": this.data.vehicleList[value].vehicleLengthName,
      "info.vehicleTypeName": this.data.vehicleList[value].vehicleTypeName,
      vehicleIndex: value
    })
  },
  // 选择司机
  driveChange(e){
    let { value } = e.detail;
    this.setData({
      "info.driverName": this.data.driveList[value].driverName,
      "info.driverUserId": this.data.driveList[value].driverUserId,
      "info.driverPhone": this.data.driveList[value].driverPhone,
      driveIndex: value
    })
  },
  // 选择预计到达起始地
  baseCityChange(e){
    let value = e.detail.value;
    this.setData({
      'info.baseCityId':this.data.baseCityList[value].codeValue,
      baseCityIndex: value
    })
  },
  // 起始省市选择回调
  regionBeginChange(e){
    let value = e.detail.value;
    this.setData({
      'info.beginProvinceId':value.province.id,
      'info.beginCityId':value.city.id,
    })
  },
  // 目的省市选择回调
  regionEndChange(e){
    let value = e.detail.value;
    this.setData({
      'info.endProvinceId':value.province.id,
      'info.endCityId':value.city.id,
    })
  },
  //原生 - input赋值
  inputSetDataDefault(e){
    let {value} = e.detail;
    let { key } = e.currentTarget.dataset;
    this.data.info[key] = value;
    this.setData({ info: this.data.info });
  },
  showPopover(){
    this.setData({isShowPopover:true})
  },
  // 提交
  async submit(){
    await util.postByBeanName('vehicleScheduleService','saveOrUpdateVehicleSchedule',this.data.info);
    await wxApi.showModal('保存成功');
    if(this.data.copy==1){
      wx.redirectTo({
        url: '../capacityManager/capacityManager',
      })
    }else{
      wx.navigateBack({
        delta: 1,
      })
    }
  },
})