// pages/agreement/agreement.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:"",
  },

  /**
   * 生命周期函数--监听页面加载
   * url  pdf路径
   * index  接单任务列表下标
   * detail 是否查看协议
   */
  onLoad: function ({url,index,detail}) {
    let env = __wxConfig.envVersion;
    let src = "";
    switch(env){
      // 开发环境
      case 'develop':
        console.log("开发环境");
        src = "https://t.ete56.cn/agreement.html"
        break;
      // 体验版
      case 'trial':
        console.log("体验环境");
        src = "https://t.ete56.cn/agreement.html"
        break;
      // 生产
      case 'release':
        console.log("生产环境");
        src = "https://pt.1000e56.com/agreement.html"
        break;
    }
    src = `${src}?pdf=${url}&index=${index}&detail=${detail}`;
    this.setData({url:src})
  },
  getMessage: function(event) {
    var pages = getCurrentPages();
    var previousPage = pages[pages.length - 2];
    let data = event.detail.data[0];
    if(data.detail){  //返回去详情
      previousPage.webViewCallback({down:data.down});
    }else{  //接单出车
      previousPage.webViewCallback(event.detail.data[0].index);
    }
  }
})