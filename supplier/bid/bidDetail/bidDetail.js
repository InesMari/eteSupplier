import {util,wxApi,common,regeneratorRuntime} from '../../../common/commonImport'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad({id}) {
    let info = await util.postByBeanName('bidQuoteTF','getBidQuoteDetail',{id});
    this.setData({info})
    this.doCount();
    setInterval(()=>{
      this.doCount();
    },1000)
  },
  // 开始倒数
  doCount(){
    let expireDate = +new Date(this.data.info.baseInfo.expireDate);
    let nowTime = +new Date();
    this.countDown({expireDate,nowTime})
  },
  // 倒数逻辑
  countDown({expireDate,nowTime}){
    //把剩余时间毫秒数转化为秒
    let times = (expireDate - nowTime) / 1000;

    //计算天数 转化为整数
    let eDay = parseInt(times / 60 / 60 / 24);

    //计算小时数 转化为整数
    let h = parseInt(times / 60 / 60 % 24);
    let eHour = h < 10 ? "0" + h : h;

    //计算分钟数 转化为整数
    let m = parseInt(times / 60 % 60);
    let eMin = m < 10 ? "0" + m : m;

    //计算描述 转化为整数
    let s = parseInt(times % 60);
    let eSec = s < 10 ? "0" + s : s;
    
    this.setData({
      ['info.baseInfo.eDay']:eDay,
      ['info.baseInfo.eHour']:eHour,
      ['info.baseInfo.eMin']:eMin,
      ['info.baseInfo.eSec']:eSec,
    });

  },
  
  //原生 - input赋值 - 明细
  inputSetDataDefaultDetail(e){
    let {value} = e.detail;
    let { key,index } = e.currentTarget.dataset;
    this.setData({ ['info.dtls['+index+'].'+key]: value });
  },
  //原生 - input赋值 - 账期
  inputSetDataDefault(e){
    let {value} = e.detail;
    let { key } = e.currentTarget.dataset;
    this.setData({ ['info.baseInfo.'+key]: value });
  },

  // 日期选择
  bindDateChange: function(e) {
    let {value} = e.detail;
    let {key} = e.currentTarget.dataset
    this.setData({ ['info.baseInfo.'+key]: value });
  },
  // 拨打电话
  callPhone(){
    wx.makePhoneCall({
      phoneNumber: this.data.info.baseInfo.linkmanBillId
    })
  },
  // 上传图片
  async afterRead(event) {
    wx.showLoading();
    const { file } = event.detail;
    let {data} = await util.uploadFile(file);
    wx.hideLoading();
    data = JSON.parse(data);  //数据转化
    let fileData = data.content;
    fileData.fileId = fileData.flowId;
    fileData.filePath = fileData.storePath;
    let bidFiles = this.data.info.bidFiles?this.data.info.bidFiles:[];
    bidFiles.push(fileData);
    this.setData({['info.bidFiles']:bidFiles});
  },
  // 下载文件
  download(e){
    let { index } = e.currentTarget.dataset;
    let file = this.data.info.secFiles[index];
    let url = file.fileUrl;
    if(/\.pdf$/i.test(url)){
      var fileType = 'pdf'
    }else if(/\.xls$/i.test(url)){
      var fileType = 'xls'
    }else if(/\.doc$/i.test(url)){
      var fileType = 'doc'
    }else{
      var fileType = 'pic'  //图片
    }
    if(fileType == 'pic'){
      let current = common.getBigImgPath(url);
      wx.previewImage({
        current,
        urls:[url], // 需要预览的图片http链接列表
      })
    }else{
        wx.showLoading("加载中");
        wx.downloadFile({
          // 示例 url，并非真实存在
          url,
          success: function (res) {
            const filePath = res.tempFilePath
            console.log(res)
            wx.openDocument({
              filePath: filePath,
              fileType: fileType,
              showMenu:true,
              success: function (res) {
                wx.hideLoading();
                console.log('打开文档成功')
              },
              fail(res){
                //不支持的文件利用分享下载
                wx.hideLoading();
                console.log(res);
                wx.shareFileMessage({
                  filePath: res.tempFilePath,
                  fileName: file.fileName,
                  success() {},
                  fail: console.error,
                })
              }
            })
          }
        })
    }
  },
  // 删除文件
  delFile(e){
    let { index } = e.currentTarget.dataset;
    let {bidFiles} = this.data.info;
    bidFiles.splice(index,1);
    this.setData({['info.bidFiles']:bidFiles})
  },
  // 提交
  async submit(){
    await util.postByBeanName('bidQuoteTF','saveBidQuote',this.data.info);
    await wxApi.showModal('提交成功');
    wx.navigateBack({
      delta: 1,
    })
  },
  // 确认取消
  async cancel(){
    let res = await wxApi.showModal({
      title: '提示',
      content: '取消后将不再显示该竞价，是否确认取消。',
      showCancel: true,
      }
    );
    if(res.confirm){
      await util.postByBeanName('bidQuoteTF','cancelBidQuote',{bidId:this.data.info.baseInfo.bidId});
      await wxApi.showModal('取消成功');
      wx.navigateBack({
        delta: 1,
      })
    }
  },
})