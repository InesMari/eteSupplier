import {util,wxApi,common,regeneratorRuntime} from '../../../common/commonImport'

Component({
  externalClasses: ['placeholder-class', 'extends-class'],
  properties: {
    value: {
      type: Object,
      value: {},
      observer(n, o){
        if(n != o && common.isNotBlank(n)){
          this.valueListener(n);
        }
      }
    },
    disabled: {
      type: Boolean,
      value: false
    },
    placeholder: {
      type: String,
      value: '请选择'
    },
    showDistrict:{
      type: Boolean,  //false时只选择省市
      value: true
    }
  },
  data: {
    range: [],
    selected: [0, 0, 0],
    isChange: false
  },
  ready() {
    this. init();
  },
  methods: {
    async init(){
      try {
        let provinces = await this.getProvince();
        let provinceId = provinces[0].id; //默认北京
        //获取北京下级市
        let city = await this.getCity(provinceId)
        let cityId = city[0].id;
        if(!this.data.showDistrict) return;
        //获取北京下级区
        await this.getDistrict(cityId);
      } catch (error) {
        console.log(error);
      }
    },
    //获取省数据
    async getProvince() {
        let items = await util.postByBeanName("selectStaticDataTF","selectProvince",{});
        this.setData({['range[0]']:items});
        return items;
    },
    //获取对应的市
    async getCity(provinceId){
      let items = await util.postByBeanName("selectStaticDataTF","selectCity",{provinceId});
      this.setData({['range[1]']:items});
      return items;
    },
    //获取对应的区
    async getDistrict(cityId) {
      let items = await util.postByBeanName("selectStaticDataTF","selectDistrict",{cityId});
      this.setData({['range[2]']:items});
      return items;
    },
    changeHandler(e) {
      let { value } = e.detail;
      this.setData({ selected: value, isChange: true });
      let { range } = this.data;
      let result = {};
      result.province = { id: range[0][value[0]].id, name: range[0][value[0]].name };
      result.city = { id: range[1][value[1]].id, name: range[1][value[1]].name };
      if(this.data.showDistrict){
        result.district = { id: range[2][value[2]].id, name: range[2][value[2]].name };
      }
      this.triggerEvent('change', { value: result });
    },
    cancelHandler() {
      this.triggerEvent('cancel');
    },
    //滚动时刷新子区域列表
    async columnchangeHandler(e) {
      let { column, value } = e.detail;
      this.setData({ ['selected['+column+']']: value})
      // console.log(e.detail)
      if (column==0){
        let provinceId = this.data.range[column][value].id;
        //获取下级市
        let city = await this.getCity(provinceId)
        //获取下级区
        if(!this.data.showDistrict) return;
        let cityId = city[0].id;
        await this.getDistrict(cityId);
      }else if (column == 1){        
        if(!this.data.showDistrict) return;
        let cityId = this.data.range[column][value].id;
        await this.getDistrict(cityId);
      }
    },
    //地址回显
    async valueListener(){
      // let { range: { provinceList, cityList, districtList},value:{provinceId, cityId, districtId}} = this.data;
      if (this.data.range.length == 0) {
        await this.init();
      }
      let { provinceId, cityId, districtId } = this.data.value;
      // 省
      let provinceList = await this.getProvince();
      provinceList.forEach((item,index) => {
        if (item.id == provinceId){
          this.data.selected[0] = index;
          this.setData({ provinceName: item.name, provinceId});
        }
      })
    // 市
      let cityList = await this.getCity(provinceId);
      cityList.forEach((item, index) => {
        if (item.id == cityId) {
          this.data.selected[1] = index;
          this.setData({ cityName: item.name, cityId });
        }
      })
      if(this.data.showDistrict){
        // 区
        let districtList = await this.getDistrict(cityId);
        districtList.forEach((item, index) => {
          if (item.id == districtId) {
            this.data.selected[2] = index;
            this.setData({ districtName: item.name, districtId });
          }
        })
        var range = [provinceList, cityList, districtList];
      }else{
        var range = [provinceList, cityList,];
      }
      this.setData({ isChange: true, selected: this.data.selected, range});
    },
    cleanData(){
      this.setData({ isChange: false});
    }
  },
});
