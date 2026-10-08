# uploadTicket - 上传单据

## 页面概述
司机端运单回单上传页面，上传运单相关单据图片。自带车且启用回单二维码识别时，会对上传图片进行二维码/条形码校验（确保与运单ID匹配）。

## 数据状态
| 字段 | 类型 | 说明 |
|------|------|------|
| info | Object | 运单信息（waybillNum, workList, receiptsList, vehicleAttribution, currentWorkId） |
| waybillId | String | 运单ID |
| ticketList | Array | 上传的单据图片列表 |
| workIndex | Number | 当前选中的作业点索引 |
| isRecognizeCode | String | 是否启用二维码识别配置 |

## 生命周期
- **onLoad({waybillId})**: 加载运单回单数据，获取二维码识别配置
- 回显当前作业点和工作节点索引
- 根据作业点筛选已上传的图片

## 功能模块

### 1. 作业点选择
- picker 选择作业点
- `workChange`: 切换作业点后重新筛选对应图片
- 显示作业点详细地址

### 2. 图片上传与二维码识别
- van-uploader 上传，最多5张
- **自有车 + 启用识别**: 调用 `scanQRCode` 识别图片中的二维码/条形码
  - 识别结果与运单ID对比
  - 不匹配 → 提示"回单二维码与当前派车单不匹配"
  - 识别失败 → 提示重新拍照
- **非自有车或未启用**: 直接上传不识别
- 自有车强制拍照（capture: ['camera']），非自有车支持相册和拍照

### 3. 提交
- `submit()`: 调用 `uploadWaybillReceipts` 提交当前作业点的回单

## API 接口
| Bean | 方法 | 说明 |
|------|------|------|
| miniProgramDriverTF | loadReceiptsDataByWaybillId | 加载回单数据 |
| miniProgramDriverTF | uploadWaybillReceipts | 上传回单 |
| commonTF | getSysCfgByCfgName | 获取系统配置（二维码识别开关） |

## 依赖
- `utils/qrcode` - 二维码识别工具 (scanQRCode)

## 注意事项
- 二维码识别功能通过系统配置 `SCAN_RECEIPT_QRCODE` 控制
- 识别校验仅针对自有车（vehicleAttribution==2）
- 非自有车可选择相册或拍照上传
- 作业点切换时 ticketList 会重置
