# orderDetail - 订单包详情与领单

## 页面概述
司机端订单包详情页，展示订单计划信息、作业点信息、货物清单，支持领单出车操作。领单时区分自有车（直接点检）和非自有车（需签运输协议）。

## 数据状态
| 字段 | 类型 | 说明 |
|------|------|------|
| info | Object | 订单计划详情（含 orderPlan、workData、supplierList、goodsData） |
| planId | String | 订单计划ID |
| plateNumber | String | 非自有车时输入的车牌号 |
| supplierIndex | Number | 选择的供应商索引 |
| isshowPickupGoodsDetail | Boolean | 是否展开货物明细 |
| isshowAlert | Boolean | 是否显示定位授权弹窗 |
| param | Object | 领单参数 |
| scene | Boolean | 是否从二维码进入 |

## 生命周期
- **onLoad(query)**: 解析 planId（支持二维码scene参数），调用 `doQuery` 查询订单详情

## 功能模块

### 1. 订单信息展示
- 车牌号输入（非自有车时 vehicleId<0）
- 供应商选择（picker）
- 订单包号、计划单位、剩余计划数

### 2. 作业点切换
- 横向滚动 `scroll-view` 展示作业点列表
- `workChange`: 点击切换当前作业点，更新作业地址/联系人/电话

### 3. 货物清单
- 汇总信息：件数、重量(KG)、体积(m³)
- 货物明细：可展开显示每种货物的规格、件数、包装、重量、类别、体积

### 4. 领单并出车
- `getLocation`: 获取定位（QQ地图→百度地图坐标转换）
- **自有车**: 调用 `createTransportationAgreementForOrderPlan` → 直接跳转 `checkAndUploadKM` 车辆点检
- **非自有车**: 跳转运输协议页面 `pages/agreement`，确认后回调 `webViewCallback` 领单
- `receive`: 领单成功后调用 `opWaybillLanding` 完成出车，跳回首页

### 5. 定位授权处理
- 获取定位失败时检查授权状态
- 已授权但失败 → 提示检查系统GPS
- 未授权 → 弹窗引导去设置页

## API 接口
| Bean | 方法 | 说明 |
|------|------|------|
| ordPlanTF | loadPlanInfoByPlanId | 加载订单计划详情 |
| miniProgramDriverTF | createTransportationAgreementForOrderPlan | 创建运输协议（非自有车） |
| miniProgramDriverTF | claimOrderPlan | 领单 |
| miniProgramDriverTF | opWaybillLanding | 接单出车 |
| wxUserTF | logout | 退出登录（无权限时） |

## 路由导航
- 从 `orderList` 点击进入 → 携带 planId
- 自有车领单 → `/driver/task/checkAndUploadKM/checkAndUploadKM?waybillId=&type=1`
- 非自有车领单 → `/pages/agreement/agreement?url=`
- 领单成功 → `wx.reLaunch` 跳转首页

## 注意事项
- 二维码进入时 planId 需 decodeURIComponent 解码
- 非自有车需先输入车牌号才能领单
- 无操作权限(501)时提示退出登录
- 坐标系转换: QQ地图 → 百度地图 (`qqMapTransBMap`)
