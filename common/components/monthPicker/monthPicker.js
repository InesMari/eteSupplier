// common/components/monthPicker/monthPicker.js
Component({
  ready(){
    this.initDateTimeArray();
    this.bindChangeTigger();
  },
  properties:{
    yearRange:{
      type:Number,
      value:30
    },
    placeholder: {
      type: String,
      value: '请选择月份',
    },
  },
  /**
   * 页面的初始数据
   */
  data: {
    dateTimeArray:[],
    dateShow:true,
  },
  methods:{
    /**
     * 初始化数据对象
     */
    initDateTimeArray(){
      //年份
      let currentYear = new Date().getFullYear();
      let currentYearIndex = 0;
      let yearArr = [];
      for(let year=currentYear-this.data.yearRange;year<currentYear+this.data.yearRange;year++){
        if(currentYear<=year) currentYearIndex++;
        yearArr.push(year);
      }
      // 月份
      let monthArr = [];
      let currentMonthIndex = 0;
      for(let m=1;m<13;m++){
        if(m<new Date().getMonth()+1) currentMonthIndex++;
        if(m<10) m = "0"+m;
        monthArr.push(String(m))
      }
      this.setData({dateTimeArray:[yearArr,monthArr],dateTime:[currentYearIndex,currentMonthIndex]});
    },
    bindDateChange(e){
      this.setData({
        dateTime: e.detail.value,
        dateShow: true,
      });
      this.bindChangeTigger();
    },
    // 清空日期
    clearDate(){
      this.setData({dateShow:false});
      this.bindChangeTigger();
    },
    bindChangeTigger(){
      let {dateTimeArray,dateTime} = this.data;
      let date = dateTimeArray[0][dateTime[0]]+"-"+dateTimeArray[1][dateTime[1]]
      let data = this.data.dateShow?date:"";
      this.triggerEvent("change",data);
    }
  }
})