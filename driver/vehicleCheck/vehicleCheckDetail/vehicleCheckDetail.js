import {util,wxApi,common,regeneratorRuntime} from '../../../common/commonImport'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showFinish:false,
    showUnPassAlert:false,
    info:{},
    startMileageList:[],
    endMileageList: [],
    abnormalList:[],  
    disabled:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad({id}) {
    this.doQuery(id);
  },  
  async doQuery(id){
    let info = await util.postByBeanName('resVehicleInfoTF','getVehicleCheckInfo',{id});
    info.startCheckList.forEach((item,index) => {
      item.content = `<strong>*${index+1}.${item.itemName}：</strong>${item.requirements}`;
      item.abnormalList = [{url:item.fileUrl}];
    })
    info.endCheckList.forEach((item,index) => {
      item.content = `<strong>*${index+1}.${item.itemName}：</strong>${item.requirements}`;
      item.abnormalList = [{url:item.fileUrl}];
    })
    let startMileageList = [{url:info.startMileageFileUrl}];
    let endMileageList = [{url:info.endMileageFileUrl}];
    this.setData({info,disabled:true,endMileageList,startMileageList});
  },
})