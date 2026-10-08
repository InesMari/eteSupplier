# shortBarge - 短驳配送详情

## 页面概述
司机端短驳配送任务详情页，针对 dispatchType==9 的短驳运单。提供接单出车、确认完成（含返程和超时原因）、上传回单等功能。

## 数据状态
| 字段 | 类型 | 说明 |
|------|------|------|
| info | Object | 短驳配送详情（baseInfo、goodsList） |
| waybillId | String | 运单ID |
| mileage | String | 返程数量（已注释） |
| isTimeout | Boolean | 是否超时 |
| timeoutReason | String | 超时原因 |
| timeoutReasonList | Array | 超时原因字典 |
| fromTenantList | Array | 到货厂商列表 |
| fromTenantId | String | 选择的到货厂商ID |
| list | Array | 按到货厂商分组的回单图片 |
| receiptsList | Array | 上传的回单图片列表 |
| isshowAlert | Boolean | 确认完成弹窗显示 |
| isshowUploadAlert | Boolean | 上传回单弹窗显示 |

## 生命周期
- **onLoad({waybillId})**: 接收运单ID，调用 `doQuery` 查询详情

## 功能模块

### 1. 运单信息展示
- 配送单号、配送状态、运输车辆（车牌+车型+车长）
- 是否加急、是否回单
- 要求送达时间、运单备注

### 2. 货物信息展示
- 按物料编号分组
- 货主、送货地址、托数、卸货点、联系人、联系电话

### 3. 回单信息
- 按到货厂商分组展示回单图片
- `showUploadAlert`: 弹窗上传回单（选择到货厂商 + 上传图片）
- `sureUpload`: 调用 `uploadWmsWaybillReceipts` 上传

### 4. 操作按钮
- **waybillState==1**: "接单出车" → 调用 `driverStartWaybill`
- **waybillState==2**: "确认完成" → 弹窗确认
  - 是否返程选择（radio）
  - 超时时可选择超时原因
  - `sureAlert`: 调用 `driverDoneWaybill`

### 5. 超时判断
- 运单状态==2时查询 `isTimeout`
- 超时时加载 `TIMEOUT_REASON4` 字典

## API 接口
| Bean | 方法 | 说明 |
|------|------|------|
| miniProgramWaybillTF | queryDriverWaybillInfoByWaybillId | 查询短驳单详情 |
| miniProgramWaybillTF | driverStartWaybill | 接单出车 |
| miniProgramWaybillTF | driverDoneWaybill | 确认完成 |
| miniProgramWaybillTF | isTimeout | 判断是否超时 |
| miniProgramWaybillTF | uploadWmsWaybillReceipts | 上传回单 |
| wmsWaybillService | queryWaybillFromTenantByWaybillId | 查询到货厂商 |
| commonTF | getSysStaticDataByCodeTypes | 获取字典 |

## 路由导航
- 从 `todoTasks` 或 `historyTasks` 点击进入
- navigateBack 返回上一页

## 注意事项
- 返程数量和重量输入目前已被注释（可能是业务调整）
- 超时原因目前也已注释校验逻辑
- 回单图片按到货厂商分组展示
