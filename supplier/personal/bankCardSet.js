
// 银行卡图标/背景色配置
const setBankcard = (items,code) => {
  items.forEach(item=>{
    let name = item[code];
    if(name.indexOf('中国银行')>-1){
      item.itemBg = '/common/images/card_zhongguo_bg.png'
      item.bankLogo = '/common/images/card_zhongguo.png'
    }
    if(name.indexOf('工商')>-1){
      item.itemBg = '/common/images/card_gongshang_bg.png'
      item.bankLogo = '/common/images/card_gongshang.png'
    }
    if(name.indexOf('广发')>-1){
      item.itemBg = '/common/images/card_guangfa_bg.png'
      item.bankLogo = '/common/images/card_guangfa.png'
    }
    if(name.indexOf('广州银行')>-1){
      item.itemBg = '/common/images/card_guangzhou_bg.png'
      item.bankLogo = '/common/images/card_guangzhou.png'
    }
    if(name.indexOf('华夏')>-1){
      item.itemBg = '/common/images/card_huaxia_bg.png'
      item.bankLogo = '/common/images/card_huaxia.png'
    }
    if(name.indexOf('招商')>-1){
      item.itemBg = '/common/images/card_zhaoshang_bg.png'
      item.bankLogo = '/common/images/card_zhaoshang.png'
    }
    if(name.indexOf('浙商')>-1){
      item.itemBg = '/common/images/card_zheshang_bg.png'
      item.bankLogo = '/common/images/card_zheshang.png'
    }
    if(name.indexOf('中信')>-1){
      item.itemBg = '/common/images/card_zhongxin_bg.png'
      item.bankLogo = '/common/images/card_zhongxin.png'
    }
    if(name.indexOf('恒丰')>-1){
      item.itemBg = '/common/images/card_hengfeng_bg.png'
      item.bankLogo = '/common/images/card_hengfeng.png'
    }
    if(name.indexOf('建设')>-1){
      item.itemBg = '/common/images/card_jianshe_bg.png'
      item.bankLogo = '/common/images/card_jianshe.png'
    }
    if(name.indexOf('交通')>-1){
      item.itemBg = '/common/images/card_jiaotong_bg.png'
      item.bankLogo = '/common/images/card_jiaotong.png'
    }
    if(name.indexOf('浦发')>-1){
      item.itemBg = '/common/images/card_pufa_bg.png'
      item.bankLogo = '/common/images/card_pufa.png'
    }
    if(name.indexOf('兴业')>-1){
      item.itemBg = '/common/images/card_xingye_bg.png'
      item.bankLogo = '/common/images/card_xingye.png'
    }
    if(name.indexOf('渤海')>-1){
      item.itemBg = '/common/images/card_bohai_bg.png'
      item.bankLogo = '/common/images/card_bohai.png'
    }
    if(name.indexOf('民生')>-1){
      item.itemBg = '/common/images/card_minsheng_bg.png'
      item.bankLogo = '/common/images/card_minsheng.png'
    }
    if(name.indexOf('农业')>-1){
      item.itemBg = '/common/images/card_nongye_bg.png'
      item.bankLogo = '/common/images/card_nongye.png'
    }
    if(name.indexOf('邮政')>-1){
      item.itemBg = '/common/images/card_youzheng_bg.png'
      item.bankLogo = '/common/images/card_youzheng.png'
    }
    if(name.indexOf('平安')>-1){
      item.itemBg = '/common/images/card_pingan_bg.png'
      item.bankLogo = '/common/images/card_pingan.png'
    }
    if(name.indexOf('光大')>-1){
      item.itemBg = '/common/images/card_guangda_bg.png'
      item.bankLogo = '/common/images/card_guangda.png'
    }
    if(name.indexOf('厦门')>-1){
      item.itemBg = '/common/images/card_xiamen_bg.png'
      item.bankLogo = '/common/images/card_xiamen.png'
    }
    if(name.indexOf('东莞银行')>-1){
      item.itemBg = '/common/images/card_dongguan_bg.png'
      item.bankLogo = '/common/images/card_dongguan.png'
    }
    if(name.indexOf('东莞农村商业')>-1){
      item.itemBg = '/common/images/card_dongguanncsy_bg.png'
      item.bankLogo = '/common/images/card_dongguanncsy.png'
    }
  })
}
export default setBankcard;