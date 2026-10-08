# truckingDetail - 运单详情（最大最复杂页面）

## 页面概述
司机端最核心的运单详情页面（JS文件约18.77KB），展示完整运单信息，包含多作业点管理、货物清单、单据上传、作业节点操作、GPS后台定位跟踪、回程业务申请、上锁拍照等功能。

## 数据状态
| 字段 | 类型 | 说明 |
|------|------|------|
| info | Object | 运单完整信息（waybillNum, workList, receiptsList, pickupGoods, deliveryGoods, mileage等） |
| waybillId | String | 运单ID |
| isshowPickupGoodsDetail | Boolean | 是否展开提货货物明细 |
| isshowDeliveryGoodsDetail | Boolean | 是否展开卸货货物明细 |
| ticketList | Array | 当前作业点单据列表 |
| lastSaveTime | Number | 上次GPS保存时间戳 |
| locationFallbackTimer | Number | 定位fallback定时器 |
| pickupGoodsList | Array | 提货货物清单 |
| deliveryGoodsList | Array | 卸货货物清单 |

## 生命周期
- **onLoad(query)**: 接收 waybillId/inWaySum/workNodeId，支持二维码scene参数
- **onShow()**: 延迟500ms查询详情，检查权限并启动后台定位
- **onHide()**: 销毁定位fallback定时器
- **onUnload()**: 销毁定位fallback定时器

## 功能模块

### 1. 运单基本信息
- 派车单号、运单状态、运输车辆（车牌+车型+车长）
- 自有车显示：出车里程/收车里程/总里程
- 接单声明：查看PDF详情、分享下载
- 上传单据/打印回单标签按钮（waybillState>1）

### 2. 多作业点管理
- 横向滚动作业点列表（workList）
- `workChange`: 点击切换作业点，自动切换对应单据和货物信息
- 作业点类型：提货/卸货/提卸货

### 3. 作业节点操作
- `nodeOperation`: 点击作业节点按钮
  - 需车辆点检 → 跳 `vehicleCheckDetail`
  - 收车（自有车）→ 跳 `checkAndUploadKM`（type=3）
  - 普通节点 → 调用 `opWorkNode` 完成操作

### 4. 单据上传
- `toUploadTicket`: 跳转上传单据页
- 当前作业点绑定单据照片展示
- `fliterImg`: 根据作业点筛选对应单据

### 5. 货物清单
- 提货货物：件数/重量/体积汇总 + 可展开明细（规格/件数/包装/重量/类别/体积）
- 卸货货物：同理，懒加载模式首次展开时请求

### 6. GPS后台定位（核心功能）
- `checkPermissionAndStartLocation`: 检查是否需要GPS定位
- `startBackgroundLocation`: 启动后台定位 `wx.startLocationUpdateBackground`
- `startLocationListener`: 监听位置变化 `wx.onLocationChange`
- `updateLocation`: 坐标转换（QQ→百度），带时间戳和车牌号
- `saveLocationToHistory`: 每分钟保存一次GPS到 `resVehicleInfoTF.saveVehicleMobileGps`
- **10天自动退出**: 监听超过10天自动 `wx.offLocationChange`
- **Fallback机制**: 后台定位失败时启动30秒间隔的 `wx.getLocation` 备用定时器
- `uploadAuthorizeLocation`: 上报定位授权状态

### 7. 公里数信息
- 起始公里数/结束公里数/总里程
- 公里数照片展示（点击查看大图）

### 8. 上锁拍照
- `photoLock`: 调起相机拍照，上传后调用 `lockUpload`

### 9. 接单出车
- `toReceive`: 自有车跳点检，非自有车跳协议
- `receive`: 获取定位后调用 `opWaybillLanding`

### 10. 回程业务申请
- `apply`: 计算当前与始发地距离
- 距离<100km才可申请
- 30秒内不可重复点击

### 11. 作业点排序
- `toWaySort`: 跳转作业点排序页面

## API 接口
| Bean | 方法 | 说明 |
|------|------|------|
| miniProgramDriverTF | queryWaybillInfoByWaybillId | 查询运单详情 |
| miniProgramDriverTF | loadWaybillGoodsListByWaybillId | 加载货物清单 |
| miniProgramDriverTF | opWorkNode | 操作作业节点 |
| miniProgramDriverTF | opWaybillLanding | 接单出车 |
| miniProgramDriverTF | createTransportationAgreement | 创建运输协议 |
| miniProgramDriverTF | lockUpload | 上锁拍照上传 |
| resVehicleInfoTF | saveVehicleMobileGps | 保存GPS定位 |
| resVehicleInfoTF | isNeedMobileGps | 是否需要GPS定位 |
| driverTF | isOpenLocation | 上报定位授权状态 |
| resOwnVehicleScheduleTF | saveOwnVehicleSchedule | 申请回程业务 |

## 路由导航
- 上传单据 → `/driver/task/uploadTicket/uploadTicket`
- 打印回单 → `/driver/task/printTag/printTag`
- 车辆点检 → `/driver/vehicleCheck/vehicleCheckDetail/vehicleCheckDetail`
- 上传公里数 → `/driver/task/checkAndUploadKM/checkAndUploadKM`
- 作业点排序 → `/driver/task/waySort/waySort`
- 协议页 → `/pages/agreement/agreement`

## 注意事项
- GPS定位是本页面最复杂的功能，包含完整的权限检查、后台定位、fallback和10天自动退出机制
- 坐标系：QQ地图 → 百度地图（qqMapTransBMap）
- 回程业务申请有30秒防重复和100km距离限制
- 缺少操作权限(501)时引导退出登录
