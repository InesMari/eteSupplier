import {util,wxApi,common,regeneratorRuntime} from '../../../common/commonImport'
import * as echarts from '../../ec-canvas/echarts'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    page:1,
    info:{},
    isRefresh:false,
    isshowChart:true,
    bar: {},
    pie: {},
    barHis:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    this.initData();
  },
  initData(){
    let type = this.data.info.loadHistory;
    if(type == 1){
      this.queryHisChartData();
    }else{
      this.queryChartData();
    }
    this.querySchedule();
    this.doQuery(true);
  },
  // 查匹配柱状图表数据
  async queryChartData(){    
    let info = await util.postByBeanName('vehicleScheduleService','loadCylindricalDataGroupByBaseCity');
    let baseCityIdNames = [];
    let matchCounts = [];
    let unMatchCounts = [];
    info.forEach(el => {
      baseCityIdNames.push(el.baseCityIdName);
      matchCounts.push(el.matchCount);
      unMatchCounts.push(el.unMatchCount);
    })
    this.setData({baseCityIdNames,matchCounts,unMatchCounts});
    this.setData({['bar.onInit']:this.initBarChart});
  },
  // 查历史运力柱状图表数据
  async queryHisChartData(){    
    let info = await util.postByBeanName('vehicleScheduleService','loadCylindricalDataGroupByBaseCity',{loadHistory:1});
    console.log(info)
    let hisBaseCityIdNames = [];
    let hisTotals = [];
    info.forEach(el => {
      hisBaseCityIdNames.push(el.baseCityIdName);
      hisTotals.push(el.total);
    })
    this.setData({hisBaseCityIdNames,hisTotals});
    this.setData({['barHis.onInit']:this.initHisBarChart});
  },
  // 查匹配率
  async querySchedule(){
    let schedule = await util.postByBeanName('vehicleScheduleService','queryVehicleScheduleData');
    this.setData({schedule})
    this.setData({['pie.onInit']:this.initPieChart});
  },
  /**
   * 
   * @param clear true:重新加载 ,false:加载下一页
   */
  async doQuery(clear){
    if (clear) {  //clean为true的时候清空数组和页码
      this.setData({ page: 1 });
    }
    let {items,hasNext} = await util.postByBeanName('vehicleScheduleService','queryVehicleSchedulePage',{...this.data.info,page:this.data.page});
    if (clear) {  //clean为true的时候清空数组
      this.setData({ list: [] });
    }
    this.setData({ list: [...this.data.list, ...items], hasNext, isRefresh: false});
  },
  // 滚动加载
  scrolltolowerHandler(){
    if (this.data.hasNext) {
      this.setData({ page: ++this.data.page });
      this.doQuery()
    }
  },
  // 上拉刷新
  toupper(){
    this.setData({ isRefresh:true})
    this.doQuery(true);
  },
  // 搜索车牌
  search(e){
    this.setData({['info.serchKey']:e.detail})
    //延迟查询
    if (this.data.searchTimeout) clearTimeout(this.data.searchTimeout);
    this.data.searchTimeout = setTimeout(() => {
      this.doQuery(true)
      clearTimeout(this.data.searchTimeout);
    }, 300)
  },
  onChange(e){
    let waybillState = e.detail.name;
    switch(waybillState){
      case 0:this.setData({['info.loadHistory']:""}); break;   //当前运力
      case 1:this.setData({['info.loadHistory']:1}); break;    //历史运力
    }
    this.initData();
  },
  // 删除车辆
  async delVehicle(e){
    let {id} = e.currentTarget.dataset;
    await util.postByBeanName('resVehicleInfoTF','delTenantVehicle',{id});
    await wxApi.showModal('删除成功');
    this.doQuery(true);
  },
  // 新增
  toAddCapacity(){
    wx.navigateTo({
      url: '../addCapacity/addCapacity',
    })
  },
  // 切换展示模式
  changeShow(e){
    let {type} = e.currentTarget.dataset;
    if(type == 1){
      this.setData({isshowChart:true});
    }else if(type == 2){
      this.setData({isshowChart:false});
    }
  },
  initBarChart(canvas, width, height, dpr){
    console.log('开始渲染柱状图')
    let chart = echarts.init(canvas, null, {
      width: width,
      height: height,
      devicePixelRatio: dpr // new
    });
    canvas.setChart(chart);
  
    var option = {
      grid: {
        left: 20,
        right: 20,
        bottom: 15,
        top: 40,
        containLabel: true
      },
      legend: {},
      yAxis: [
        {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#999'
            }
          },
          axisLabel: {
            color: '#666'
          },
          minInterval: 1,
        }
      ],
      xAxis: [
        {
          type: 'category',
          axisTick: { show: false },
          data: this.data.baseCityIdNames,
          axisLine: {
            lineStyle: {
              color: '#999'
            }
          },
          axisLabel: {
            color: '#666',
            textStyle:{
              fontSize:10
            }
          }
        }
      ],
      series: [
        {
          name: '匹配',
          type: 'bar',
          label: {
            normal: {
              show: true,
              position: 'top',
              color:"#5087ec"
            }
          },
          itemStyle:{
            color:"#5087ec"
          },
          data: this.data.matchCounts,
        },
        {
          name: '未匹配',
          type: 'bar',
          label: {
            normal: {
              show: true,
              position: 'top',
              color:"#ff4d4f"
            }
          },
          itemStyle:{
            color:"#ff4d4f"
          },
          data: this.data.unMatchCounts,
        }
      ]
    };
  
    chart.setOption(option);
    return chart;
  },
  initPieChart(canvas, width, height, dpr){
    console.log('开始渲染饼图')
    let chart = echarts.init(canvas, null, {
      width: width,
      height: height,
      devicePixelRatio: dpr // new
    });
    canvas.setChart(chart);
  
    var option = {
      grid: {
        left: 0,
        right: 0,
        bottom: 10,
        top: 0
      },
      color:['#5087ec', '#ff4d4f'],
      label: {
        formatter: '{b}\n{c}'
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: '70%',
          data: [
            { value: this.data.schedule.vehicleScheduleMatch, name: '匹配' },
            { value: this.data.schedule.vehicleScheduleUnMatch, name: '未匹配' },
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
  
    chart.setOption(option);
    return chart;
  },
  initHisBarChart(canvas, width, height, dpr){
    console.log('开始渲染历史柱状图')
    let chart = echarts.init(canvas, null, {
      width: width,
      height: height,
      devicePixelRatio: dpr // new
    });
    canvas.setChart(chart);
  
    var option = {
      grid: {
        left: 20,
        right: 20,
        bottom: 15,
        top: 40,
        containLabel: true
      },
      yAxis: [
        {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#999'
            }
          },
          axisLabel: {
            color: '#666'
          },
          minInterval: 1,
        }
      ],
      xAxis: [
        {
          type: 'category',
          axisTick: { show: false },
          data: this.data.hisBaseCityIdNames,
          axisLine: {
            lineStyle: {
              color: '#999'
            }
          },
          axisLabel: {
            color: '#666',
            textStyle:{
              fontSize:10
            }
          }
        }
      ],
      series: [
        {
          type: 'bar',
          label: {
            normal: {
              show: true,
              position: 'top',
              color:"#5087ec"
            }
          },
          itemStyle:{
            color:"#5087ec"
          },
          data: this.data.hisTotals,
        }
      ]
    };
  
    chart.setOption(option);
    return chart;
  },
  // 查看详情
  toDetail(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../capacityDetail/capacityDetail?id='+id,
    })
  },
})