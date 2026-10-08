
var timer;
import {util,common} from '../../common/commonImport'
Page({
  data: {
    device: 'back',
    flash: '',
    date: "",
    time: "",
    week: "",
    address: "",
    addressName: "",
    cameraWidth: 0,
    cameraHeight: 0,
    canvasWidth: 0,
    canvasHeight: 0,
    tempImagePath: '',
    showPreview: false,
    watermarkedImage: '',
    croppedImage: '',
    showWatermark: true,
    imageMode: 'aspectFit',
    locationRetryCount: 0, // 定位重试次数
    cameraAuthorized: false, // 摄像头是否已授权
    isCheckingPermission: false, // 是否正在检查权限，防止重复检查
    showCamera: false // 是否显示摄像头组件
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    const systemInfo = wx.getSystemInfoSync();
    const screenWidth = systemInfo.screenWidth;
    const screenHeight = systemInfo.screenHeight;
    const statusBarHeight = systemInfo.statusBarHeight;
    const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
    const cameraWidth = screenWidth;
    const cameraHeight = screenHeight - statusBarHeight - menuButtonInfo.height - (menuButtonInfo.top -
      systemInfo.statusBarHeight) * 2 - 90;

    console.log(systemInfo)
    this.setData({
      cameraWidth: cameraWidth,
      cameraHeight: cameraHeight,
      systemScreenWidth: screenWidth // 保存屏幕宽度
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let timeData = this.formatTime()
    this.setData({
      date: timeData.date,
      time: timeData.time,
      timeDigits: timeData.time.split(''),
      week: timeData.week
    })
    this.getTime()
    this.checkCameraPermission()
  },

  /**
   * 获取当前时间
   */
  getTime: function () {
    timer = setInterval(() => {
      let timeData = this.formatTime()
      this.setData({
        date: timeData.date,
        time: timeData.time,
        timeDigits: timeData.time.split(''),
        week: timeData.week
      })
    }, 60000)
  },
  /**
   * 格式化时间
   */
  formatTime: function () {
    const date = new Date();
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const weekDay = ['日', '一', '二', '三', '四', '五', '六'][date.getDay()]
    const hour = date.getHours()
    const minute = date.getMinutes()
    return {
      date: [year, month, day].map(this.formatNumber).join('-'),
      time: [hour, minute].map(this.formatNumber).join(':'),
      week: '星期' + weekDay
    }
  },
  formatNumber: function (n) {
    const s = n.toString()
    return s[1] ? s : '0' + s
  },

  /**
   * 检查摄像头权限
   */
  checkCameraPermission: function (fromOnShow = false) {
    // 防止重复检查
    if (this.data.isCheckingPermission) {
      return;
    }

    let _this = this;
    _this.setData({ isCheckingPermission: true });

    // 先检查授权设置
    wx.getSetting({
      success: (res) => {
        const cameraAuth = res.authSetting['scope.camera'];

        if (cameraAuth === false) {
          // 用户之前拒绝过，引导去设置页面
          // 如果是onShow调用的且已授权，则不弹窗
          if (!fromOnShow || !_this.data.cameraAuthorized) {
            wx.showModal({
              title: '需要摄像头权限',
              content: '拍照功能需要使用摄像头，请允许摄像头权限',
              confirmText: '去设置',
              cancelText: '取消',
              success: (modalRes) => {
                if (modalRes.confirm) {
                  wx.openSetting();
                }
                _this.setData({
                  isCheckingPermission: false,
                  showCamera: false
                });
              }
            })
          } else {
            _this.setData({
              isCheckingPermission: false,
              showCamera: false
            });
          }
        } else if (cameraAuth === undefined) {
          // 未授权（首次使用），显示摄像头组件并获取位置信息
          _this.setData({
            cameraAuthorized: false,
            isCheckingPermission: false,
            showCamera: true
          });
          // 如果已经在获取地址，则不再重复获取
          if (!_this.data.address) {
            _this.getLocation();
          }
        } else {
          // 已授权，显示摄像头组件
          _this.setData({
            cameraAuthorized: true,
            isCheckingPermission: false,
            showCamera: true
          });
          // 如果已经在获取地址，则不再重复获取
          if (!_this.data.address) {
            _this.getLocation();
          }
        }
      },
      fail: (err) => {
        console.error('获取权限设置失败:', err);
        _this.setData({
          isCheckingPermission: false,
          showCamera: true
        });
        // 获取设置失败，仍然尝试获取位置
        if (!_this.data.address) {
          _this.getLocation();
        }
      }
    })
  },

  /**
   * 获取地址信息
   */
  getLocation: function (isRetry = false) {
    let _this = this;
    wx.getLocation({
      type: 'gcj02',
      success: res => {
        console.log('定位成功:', res.longitude, res.latitude);
        let point = common.qqMapTransBMap(res.longitude, res.latitude)
        util.postByBeanName('miniProgramDriverTF', 'getBaiduAdder', point, function(data){
          // 检查返回数据是否有效
          if (data && data.formattedAddress && data.formattedAddress.trim() !== '') {
            _this.setData({
              address: data.formattedAddress,
              locationRetryCount: 0 // 重置重试次数
            })
            console.log('地址获取成功:', data.formattedAddress)
          } else {
            _this.setData({
              address: '地址解析失败',
            })
            console.error('地址解析失败，返回数据:', data)
          }
        }, function(err) {
          // 接口请求失败
          _this.setData({
            address: '地址获取失败',
          })
          console.error('获取地址接口失败:', err)
          // 如果是重试调用，可以尝试重新获取定位
          if (!isRetry && _this.data.locationRetryCount < 2) {
            _this.setData({ locationRetryCount: _this.data.locationRetryCount + 1 });
            setTimeout(() => {
              _this.getLocation(true);
            }, 1000); // 1秒后重试
          }
        });
      },
      fail: err => {
        console.log('获取位置失败:', err);
        let errorMsg = '定位失败'
        // 根据错误码设置更具体的错误信息
        if (err.errCode === 2) {
          errorMsg = '位置权限被拒绝'
        } else if (err.errCode === 1) {
          errorMsg = '请开启系统定位'
        } else if (err.errCode === 3) {
          errorMsg = '定位超时'
        }
        _this.setData({
          address: errorMsg
        })
        // 如果是网络问题或超时，尝试重试
        if (!isRetry && (err.errCode === 3 || err.errMsg && err.errMsg.includes('timeout')) && _this.data.locationRetryCount < 2) {
          _this.setData({ locationRetryCount: _this.data.locationRetryCount + 1 });
          setTimeout(() => {
            _this.getLocation(true);
          }, 1000); // 1秒后重试
        }
      }
    })
  },

/**
 * 图片安全检测
 */
checkImage: function (imageUrl) {
  //自己去接入一下
  return new Promise((resolve, reject) => {
    wx.request({
      url: checkApi,
      method: "POST",
      data: {
        image: imageUrl
      },
      success: res => {
        wx.hideLoading()
        resolve(res.data.errcode)
        if (res.data.errcode == 0) { } else if (res.data.errcode == 87014) {
          wx.showModal({
            title: '温馨提示',
            content: '您的照片存在违规内容，请规范本小程序使用。',
            showCancel: false,
            complete: (res) => {
              wx.reLaunch({
                url: '/pages/index/index',
              })
            }
          })
        } else {
          wx.showToast({
            title: '图片检测失败，请重试',
            success: () => {
              wx.reLaunch({
                url: '/pages/index/index',
              })
            }
          })
        }
      }
    })
  })
},

/**
 * 绘制水印内容
 */
drawWatermarkContent: function(ctx, canvas, canvasWidth, canvasHeight, logo, resolve, reject) {
  // 使用保存的实际屏幕宽度计算缩放比例
  const systemScreenWidth = this.data.systemScreenWidth || 375;
  const scaleRatio = canvasWidth / systemScreenWidth;

  // 水印容器位置 - 对应 .watermark { padding: 20rpx 40rpx; bottom: 100px; }
  const watermarkPaddingTop = 20 * scaleRatio; // 20rpx -> px
  const watermarkPaddingBottom = 10 * scaleRatio; // 20rpx -> px
  const watermarkPaddingLeft = 20 * scaleRatio; // 40rpx -> px
  const watermarkPaddingRight = 40 * scaleRatio; // 40rpx -> px
  const watermarkBottom = 70 * scaleRatio; // 100px

  // topView 容器 - 对应 .topView { width: 60%; }
  const topViewWidth = canvasWidth * 0.6;
  const topViewHeight = 50 * scaleRatio; // 50px
  const topViewX = watermarkPaddingLeft;
  const topViewY = canvasHeight - watermarkBottom - watermarkPaddingBottom - topViewHeight;
  const topViewRadius = 6 * scaleRatio; // 6px

  // 绘制 topView 白色背景和圆角
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(topViewX + topViewRadius, topViewY);
  ctx.lineTo(topViewX + topViewWidth - topViewRadius, topViewY);
  ctx.quadraticCurveTo(topViewX + topViewWidth, topViewY, topViewX + topViewWidth, topViewY + topViewRadius);
  ctx.lineTo(topViewX + topViewWidth, topViewY + topViewHeight - topViewRadius);
  ctx.quadraticCurveTo(topViewX + topViewWidth, topViewY + topViewHeight, topViewX + topViewWidth - topViewRadius, topViewY + topViewHeight);
  ctx.lineTo(topViewX + topViewRadius, topViewY + topViewHeight);
  ctx.quadraticCurveTo(topViewX, topViewY + topViewHeight, topViewX, topViewY + topViewHeight - topViewRadius);
  ctx.lineTo(topViewX, topViewY + topViewRadius);
  ctx.quadraticCurveTo(topViewX, topViewY, topViewX + topViewRadius, topViewY);
  ctx.closePath();
  ctx.fill();

  // time 区域 (60% of topView)
  const timeX = topViewX;
  const timeY = topViewY;
  const timeWidth = topViewWidth * 0.5;
  const timeHeight = topViewHeight;

  // 绘制 time 浅色底色
  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
  ctx.fillRect(timeX, timeY, timeWidth, timeHeight);

  // 绘制时间数字 - 每个数字独立绘制
  const timeDigits = this.data.timeDigits;
  const digitPadding = 12 * scaleRatio;
  const digitWidth = (timeWidth - digitPadding * 2) / timeDigits.length;
  const digitHeight = 22 * scaleRatio;
  const digitY = timeY + (timeHeight - digitHeight) / 2;
  const digitRadius = 4 * scaleRatio;

  for (let i = 0; i < timeDigits.length; i++) {
    const digitX = timeX + digitPadding + i * digitWidth;
    const char = timeDigits[i];
    const dw = digitWidth - 4 * scaleRatio;

    // 绘制数字文字 (渐变色)
    const gradient = ctx.createLinearGradient(digitX, digitY, digitX, digitY + digitHeight);
    gradient.addColorStop(0, '#0160f2');
    gradient.addColorStop(1, '#00000c');
    ctx.fillStyle = gradient;
    ctx.font = `bold ${digitHeight}px null`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(char, digitX + dw / 2, digitY + digitHeight / 2);
  }

  // logo 区域 (40% of topView)
  const logoX = topViewX + timeWidth;
  const logoY = topViewY;
  const logoWidth = topViewWidth * 0.5;
  const logoHeight = topViewHeight;

  // 绘制 logo
  if (logo) {
    const logoDrawWidth = logoWidth * 0.8; // 保留 5% padding
    const logoDrawHeight = logo.height / logo.width * logoDrawWidth;
    const logoDrawX = logoX + (logoWidth - logoDrawWidth) / 2;
    const logoDrawY = logoY + (logoHeight - logoDrawHeight) / 2;
    ctx.drawImage(logo, logoDrawX, logoDrawY, logoDrawWidth, logoDrawHeight);
  }

  // bottomView
  const fontSize = 12 * scaleRatio; // 12px
  const marginBetweenViews = 10 * scaleRatio; // 10px
  const bottomViewY = topViewY + topViewHeight + marginBetweenViews;
  const bottomViewPaddingTop = 2 * scaleRatio; // 2px

  // 绘制红色竖线 - 对应 .bottomView .line { left: 0; }
  const lineWidth = 3 * scaleRatio; // 3px
  const bottomViewPaddingLeft = 10 * scaleRatio; // 10px

  // 绘制日期和星期
  ctx.fillStyle = '#ffffff';
  ctx.font = `normal ${fontSize}px null`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  const dateWeekText = this.data.date + ' ' + this.data.week;
  ctx.fillText(dateWeekText, topViewX + bottomViewPaddingLeft, bottomViewY + bottomViewPaddingTop);

  // 绘制地址
  const addressY = bottomViewY + fontSize * 1.5 + 8 * scaleRatio; // 8px
  const addressMaxWidth = 350 * scaleRatio; // 350rpx
  const address = this.data.address;
  const words = address.split('');
  let line = '';
  let lineY = addressY;

  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n];
    const metrics = ctx.measureText(testLine);
    if (metrics.width > addressMaxWidth && n > 0) {
      ctx.fillText(line, topViewX + bottomViewPaddingLeft, lineY);
      line = words[n];
      lineY += fontSize * 1.5;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, topViewX + bottomViewPaddingLeft, lineY);

  // 计算红色竖线高度 - 对应 .bottomView .line { height: 100%; }
  const totalBottomHeight = lineY + fontSize * 1.5 - bottomViewY;
  ctx.fillStyle = '#e50011';
  ctx.fillRect(topViewX, bottomViewY, lineWidth, totalBottomHeight);

  // 转换为临时文件 - 传入canvas实例
  wx.canvasToTempFilePath({
    canvas: canvas,
    fileType: 'jpg', // 使用jpg格式
    quality: 0.8, // 压缩质量0.8
    success: (res) => {
      wx.hideLoading()
      resolve(res.tempFilePath);
    },
    fail: (err) => {
      wx.hideLoading()
      console.error('转换为图片失败:', err)
      reject(new Error('转换为图片失败'));
    }
  });
},

/**
 * 拍摄事件
 */
takePhoto: function () {
  // 检查是否获取到定位地址 - 判断地址是否有效（非空且不是错误信息）
  if (!this.data.address ||
      this.data.address === '定位失败' ||
      this.data.address === '地址解析失败' ||
      this.data.address === '地址获取失败' ||
      this.data.address === '位置权限被拒绝' ||
      this.data.address === '请开启系统定位' ||
      this.data.address === '定位超时') {
    this.requestLocationPermission()
    return
  }

  const ctx = wx.createCameraContext()
  ctx.takePhoto({
    quality: 'normal', // 降低质量从high到normal
    success: async (res) => {
      console.log(res)
      // 计算图片宽高比，选择合适的显示模式
      const imgRatio = res.width / res.height
      const screenRatio = 750 / 1334 // 默认屏幕宽高比（假设）
      const imageMode = Math.abs(imgRatio - screenRatio) < 0.1 ? 'aspectFill' : 'aspectFit'

      this.setData({
        canvasWidth: res.width,
        canvasHeight: res.height,
        tempImagePath: res.tempImagePath,
        imageMode: imageMode
      })
      // 先图片内容安全检测
      // let checkResult = await this.checkImage(imageUrl)
      // if(checkResult==0){}

      // 调用高亮框识别
      await this.cropFocusArea(res.tempImagePath, res.width, res.height)

      // 生成带水印的完整图片
      let addWatermark = await this.addWatermark(res.tempImagePath, res.width, res.height)

      // 压缩图片以减少内存占用
      wx.compressImage({
        src: addWatermark,
        quality: 80, // 压缩质量80
        success: (compressRes) => {
          console.log('压缩后图片:', compressRes.tempFilePath)
          this.setData({
            watermarkedImage: compressRes.tempFilePath,
            showPreview: true,
            showWatermark: false,
            tempImagePath: ''
          })
        },
        fail: (err) => {
          console.error('图片压缩失败:', err)
          // 压缩失败使用原图
          this.setData({
            watermarkedImage: addWatermark,
            showPreview: true,
            showWatermark: false,
            tempImagePath: ''
          })
        }
      })
    }
  })
},

/**
 * 请求定位权限并获取位置
 */
requestLocationPermission: function () {
  // 先检查授权设置
  wx.getSetting({
    success: (settingRes) => {
      const locationAuth = settingRes.authSetting['scope.userLocation'];

      if (locationAuth === false) {
        // 用户之前拒绝过，直接引导去设置页面
        wx.showModal({
          title: '需要定位权限',
          content: '拍照需要获取您的位置信息，请在设置中开启定位权限',
          confirmText: '去设置',
          cancelText: '取消',
          success: (modalRes) => {
            if (modalRes.confirm) {
              wx.openSetting();
            }
          }
        })
      } else {
        // 未授权或首次请求，直接请求定位
        this.getLocation()
      }
    }
  })
},

/**
 * 给图片添加水印
 */
addWatermark: function (imageUrl, width, height) {
  console.log(imageUrl)
  return new Promise((resolve, reject) => {
    const query = wx.createSelectorQuery();
    query.select('#canvas').fields({
      node: true,
      size: true
    }).exec((res) => {
      console.log(res)
      if (!res || !res[0] || !res[0].node) {
        reject(new Error('Canvas节点获取失败'));
        return;
      }
      const canvas = res[0].node;
      const ctx = canvas.getContext('2d');

      // 使用传入的宽高参数，不使用scale以保持水印尺寸一致
      const canvasWidth = width;
      const canvasHeight = height;
      canvas.width = canvasWidth
      canvas.height = canvasHeight

      // 绘制背景图片
      const image = canvas.createImage();
      const logo = canvas.createImage();

      let imagesLoaded = 0;

      const checkAllLoaded = () => {
        imagesLoaded++;
        if (imagesLoaded >= 2) {
          this.drawWatermarkContent(ctx, canvas, canvasWidth, canvasHeight, logo, resolve, reject);
        }
      };

      image.onload = () => {
        ctx.drawImage(image, 0, 0, canvasWidth, canvasHeight);
        checkAllLoaded();
      };

      logo.onload = () => {
        checkAllLoaded();
      };

      logo.onerror = () => {
        // 如果logo加载失败，直接绘制文字
        imagesLoaded++;
        if (imagesLoaded >= 1) {
          this.drawWatermarkContent(ctx, canvas, canvasWidth, canvasHeight, null, resolve, reject);
        }
      };

      image.src = imageUrl;
      logo.src = '/common/images/logo.png';
    });
  });
},

/**
 * 截取高亮框区域并识别
 */
cropFocusArea: function (imageUrl, width, height) {
  const that = this;
  return new Promise((resolve, reject) => {
    const query = wx.createSelectorQuery();
    query.select('#canvas').fields({
      node: true,
      size: true
    }).exec((res) => {
      if (!res || !res[0] || !res[0].node) {
        reject(new Error('Canvas节点获取失败'));
        return;
      }
      const canvas = res[0].node;
      const ctx = canvas.getContext('2d');

      // 高亮框在界面上的比例：宽度30%，高度5%
      const cropWidth = width * 0.3;
      const cropHeight = height * 0.05;
      const cropX = (width - cropWidth) / 2; // 居中
      const cropY = (height - cropHeight) / 2; // 居中

      // 设置canvas尺寸为截取后的尺寸
      canvas.width = cropWidth;
      canvas.height = cropHeight;

      // 绘制图片（只绘制高亮框区域）
      const image = canvas.createImage();
      image.onload = () => {
        ctx.drawImage(image, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);

        const base64Data = canvas.toDataURL('image/jpeg', 0.8);
        console.log('截取区域Base64:', base64Data);
        console.log('截取区域Base64长度:', base64Data.length);
        that.setData({base64Data});

        // 调用后台识别图片
        util.postByBeanName('ordWaybillTF','getMileage',{imageBase64:base64Data},function(data){
          console.log('后台识别结果:', data);

          // 提取返回数据中的数字
          let mileageNumber = '';
          if (data && typeof data === 'string') {
            // 如果返回的是字符串，直接提取数字
            mileageNumber = data.replace(/[^0-9]/g, '');
          } else if (data && typeof data === 'object') {
            // 如果返回的是对象，尝试从常见字段中提取
            mileageNumber = data.mileage || data.number || data.value || data.result || '';
            if (typeof mileageNumber === 'string') {
              mileageNumber = mileageNumber.replace(/[^0-9]/g, '');
            }
          }

          console.log('提取的里程数:', mileageNumber);

          // 判断是否提取到数字
          if (!mileageNumber || mileageNumber === '') {
            wx.showToast({
              title: '未检测到总里程表数值，请重拍！',
              icon: 'none',
              duration: 2000
            });
            // 延迟后返回拍照界面
            setTimeout(() => {
              that.setData({
                showPreview: false,
                watermarkedImage: '',
                croppedImage: '',
                croppedBase64: '',
                base64Data: ''
              });
            }, 2000);
            return;
          }

          // 识别成功，保存里程数
          that.mileageNumber = mileageNumber;
          resolve(null); // 不返回截取图片路径
        });
      };
      image.onerror = () => {
        reject(new Error('图片加载失败'));
      };
      image.src = imageUrl;
    });
  });
},

/**
 * 切换摄像头
 */
setDevice: function () {
  this.setData({
    device: this.data.device == 'back' ? 'front' : 'back'
  })
  let text = this.data.device == 'back' ? '后置' : "前置";
  wx.showToast({
    title: "摄像头" + text
  })
},

/**
 * 闪光灯开关
 */
setFlash: function () {
  this.setData({
    flash: this.data.flash == 'torch' ? 'off' : 'torch'
  })
},


/**
 * 生命周期函数--监听页面显示
 */
onShow() {
  // 从设置页返回时，重新检查摄像头权限
  // 延迟一下确保权限状态已更新
  setTimeout(() => {
    this.checkCameraPermission(true);
  }, 300);
},


/**
 * 使用照片
 */
usePhoto() {
  if (!this.data.watermarkedImage) {
    wx.showToast({
      title: '请先拍照',
      icon: 'none'
    });
    return;
  }

  // 将图片路径存储到app全局数据，供上一页面使用
  const app = getApp();
  app.globalData.cameraImage = this.data.watermarkedImage;
  if (this.mileageNumber) {
    app.globalData.mileageNumber = this.mileageNumber;
  }

  // 返回上一页
  wx.navigateBack({
    delta: 1
  });
},

/**
 * 重拍
 */
retakePhoto() {
  this.setData({
    showPreview: false,
    watermarkedImage: '',
    croppedImage: '',
    showWatermark: true
  });
  // 清空识别的里程数
  this.mileageNumber = null;
},

})