# todoTasks - 待办任务列表

## 页面概述
司机端待办任务列表页，展示当前需要处理的运单任务。支持模糊搜索、接单出车（含自有车点检/非自有车协议）、确认完成和上传回单操作。区分普通运单和短驳配送。

## 数据状态
| 字段 | 类型 | 说明 |
|------|------|------|
| list | Array | 待办运单列表 |
| page | Number | 当前页码 |
| hasNext | Boolean | 是否有下一页 |
| isRefresh | Boolean | 刷新动画状态 |
| info.searchKey | String | 搜索关键字 |
| info.queryType | Number | 查询类型=1（待办任务） |
| currentItem | Object | 当前操作的运单项 |
| isshowAlert | Boolean | 确认完成弹窗显示 |
| isshowUploadAlert | Boolean | 上传回单弹窗显示 |
| mileage | String | 回程重量输入 |
| receiptsList | Array | 回单图片列表 |
| fromTenantList | Array | 到货厂商列表 |
| isshowAutoAlert | Boolean | 定位授权弹窗 |

## 生命周期
- **onShow()**: 每次显示时重新查询 `doQuery(true)`

## 功能模块

### 1. 模糊搜索
- 按派车单号关键字搜索，300ms 防抖

### 2. 列表展示
- 普通运单显示：线路名称、派车单号、运输车辆、来源、运作时间
- 短驳配送(dispatchType==9)：配送单号、"短驳"标签、要求送达时间
- 加急标记 "急"（红色）

### 3. 接单出车
- `nodeOperation`: 点击"接单出车"按钮
  - **自有车**(vehicleAttribution==2)：直接跳 `checkAndUploadKM` 车辆点检
  - **非自有车**：创建运输协议 → 跳转 `pages/agreement` 阅读确认
- `webViewCallback`: 协议回调后执行 `receive`
- `receive`: 获取定位 → 调用 `opWaybillLanding` 完成接单

### 4. 详情跳转
- 短驳配送 → 需先完成已接短驳单，跳 `shortBarge`
- 普通运单 → 跳 `truckingDetail`

### 5. 上传回单
- 弹窗选择到货厂商、上传回单图片
- `sureUpload`: 调用 `uploadWmsWaybillReceipts`

### 6. 定位授权
- 获取定位失败时引导授权
- 坐标转换：QQ地图 → 百度地图

### 7. 分页加载
- 滚动到底部加载更多，顶部下拉刷新

## API 接口
| Bean | 方法 | 说明 |
|------|------|------|
| miniProgramWaybillTF | queryDriverWaybillListPage | 分页查询运单列表 |
| miniProgramDriverTF | createTransportationAgreement | 创建运输协议 |
| miniProgramDriverTF | opWaybillLanding | 接单出车 |
| miniProgramWaybillTF | queryDriverWaybillInfoByWaybillId | 查询运单详情 |
| miniProgramWaybillTF | uploadWmsWaybillReceipts | 上传回单 |
| wmsWaybillService | queryWaybillFromTenantByWaybillId | 查询到货厂商 |

## 注意事项
- queryType=1 表示查询待办任务
- 非自有车接单需先签协议再获取定位
- 短驳配送已在途(waybillState!=2)时提示先完成已接单
