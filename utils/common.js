//返回promise方法resolve或reject参数，主要用于获取reject参数
const handlerPromise = (promise) => promise.then(data => [null, data]).catch(err => [err])

// 判断为空
const isBlank = str => (typeof str == 'number' && isNaN(str)) || (!str && str !== 0 && str !== false) || str=='undefined';
// 判断非空
const isNotBlank = str => !isBlank(str);

// 腾讯地图经纬度转百度地图经纬度
const qqMapTransBMap = function (lng, lat) {

  let x = Number(lng);
  let y = Number(lat);
  if (!isNaN(x) && !isNaN(y)) {
    let x_pi = 3.14159265358979324 * 3000.0 / 180.0;
    let z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
    let theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
    let longitude = z * Math.cos(theta) + 0.0065;
    let latitude = z * Math.sin(theta) + 0.006;

    return {
      longitude,
      latitude
    }
  }
}
// 百度地图经纬度转腾讯地图经纬度
const bMapTransQQMap = function (lng, lat) {
  let x = Number(lng);
  let y = Number(lat);
  if (!isNaN(x) && !isNaN(y)) {
    let x_pi = 3.14159265358979324 * 3000.0 / 180.0;
    x = x - 0.0065;
    y = y - 0.006;
    let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
    let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
    let longitude = z * Math.cos(theta);
    let latitude = z * Math.sin(theta);

    return {
      longitude,
      latitude
    }
  }
}

const getBigImgPath = function(path){
  let paramIdx = path.lastIndexOf("?");
  if(paramIdx>-1){
      path = path.substring(0,paramIdx);
  }
  
  // 检查是否已经包含 "_big"
  let pathWithoutExt = path.substring(0, path.lastIndexOf("."));
  let extension = path.substring(path.lastIndexOf("."));
  
  if (pathWithoutExt.endsWith("_big")) {
      return path; // 已经是 _big 路径，直接返回
  } else {
      return pathWithoutExt + "_big" + extension; // 添加 _big
  }
}

// 获取日期时间
const formatDate = {
  timestamp:new Date().getTime(),
  year(){
      return new Date(this.timestamp).getFullYear()
  },
  month(){
      return new Date(this.timestamp).getMonth() + 1
  },
  day(){
      return new Date(this.timestamp).getDate()
  },
  hour(){
      return new Date(this.timestamp).getHours()
  },
  min(){
      return new Date(this.timestamp).getMinutes()
  },
  sec(){
      return new Date(this.timestamp).getSeconds()
  },
  // 获取月份
  getMonth(timestamp){
      if(timestamp) this.timestamp = timestamp;
      let year = this.year();
      let month = this.month();
      return year +"-" + (month<10?'0'+month:month);
  },
  // 获取日期
  getDate(timestamp){
      if(timestamp) this.timestamp = timestamp;
      let year = this.year();
      let month = this.month();
      let day = this.day();
      return year +"-" + (month<10?'0'+month:month) +"-" + (day<10?'0'+day:day);
  },
  // 获取时间
  getTime(timestamp){
      if(timestamp) this.timestamp = timestamp;
      let hour = this.hour();
      let min = this.min();
      let sec = this.sec();
      return (hour<10?'0'+hour:hour) +":" + (min<10?'0'+min:min) +":" + (sec<10?'0'+sec:sec);
  },
  // 获取日期时间
  getDateTime(){
      return this.getDate() + " " + this.getTime();
  },
}

// 检查位置授权状态
const checkLocationAuth = function() {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success: (res) => {
        // 已授权
        if (res.authSetting['scope.userLocation']) {
          resolve(true);
        } 
        // 未授权但未拒绝过（首次请求）
        else if (!res.authSetting.hasOwnProperty('scope.userLocation')) {
          resolve(false);
        } 
        // 已拒绝授权
        else {
          resolve(false);
        }
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
}

/*
计算距离，参数分别为第一点的纬度，经度；第二点的纬度，经度
默认单位m
*/
const getMapDistance = function (lat1, lng1, lat2, lng2) {
  //进行经纬度转换为距离的计算
  const Rad = function (d) {
    return d * Math.PI / 180.0; //经纬度转换成三角函数中度分表形式。
  }
  let radLat1 = Rad(lat1);
  let radLat2 = Rad(lat2);
  let a = radLat1 - radLat2;
  let b = Rad(lng1) - Rad(lng2);
  let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
  s = s * 6378137; // EARTH_RADIUS;
  s = s.toFixed(0);
  return s;
}
export default {
  handlerPromise,
  isBlank,
  isNotBlank,
  qqMapTransBMap,
  bMapTransQQMap,
  getBigImgPath,
  formatDate,
  checkLocationAuth,
  getMapDistance,
}