# printTag - 蓝牙打印标签

## 页面概述
司机端蓝牙打印页面，通过手机蓝牙连接便携打印机，打印带有二维码和运单号的标签。支持自动搜索连接打印机、生成预览图和打印操作。

## 数据状态
| 字段 | 类型 | 说明 |
|------|------|------|
| canvasId | String | 打印画布ID "print-canvas" |
| waybillNum | String | 运单号 |
| waybillId | String | 运单ID（用于生成二维码） |
| deviceList | Array | 搜索到的打印机设备列表 |
| deviceIndex | Number | 当前选择设备索引 |
| isPrinterConnected | Boolean | 打印机是否已连接 |
| isConnecting | Boolean | 是否正在连接中 |
| isPrinting | Boolean | 是否正在打印中 |
| previewImage | String | 预览图片地址 |

## 生命周期
- **onLoad({waybillId, waybillNum})**: 接收运单号和运单ID
- **onReady()**: 初始化打印机API，自动搜索并连接打印机，生成预览
- **onHide()**: 关闭打印机连接
- **onUnload()**: 关闭打印机连接

## 功能模块

### 1. 蓝牙打印初始化
- `initApi()`: 使用 `LPAPIFactory.getInstance()` 创建打印实例
- 基于 canvas 2D 进行标签绘制

### 2. 自动搜索连接
- `autoSearchAndConnect()`: 页面加载时自动搜索蓝牙打印机（10秒超时）
- `searchAndConnectPrinter()`: 手动搜索蓝牙打印机（8秒超时）
- 搜索到设备后自动连接第一个设备
- `connectPrinter()`: 调用 `lpapi.openPrinter` 建立连接

### 3. 设备管理
- `onDeviceFound(devices)`: 搜索到设备后更新列表
- `onDeviceChanged(e)`: 手动切换打印机
- `togglePrinterConnection()`: 切换连接/断开状态
- `closePrinter()`: 断开连接

### 4. 标签打印
- 标签尺寸: 40mm × 30mm
- 内容: waybillId 生成二维码 + waybillNum 文本
- `printQrcode()`: 调用 API 绘制并提交打印
  - `startJob({width, height, orientation:0})`
  - `draw2DQRCode()` 绘制二维码
  - `drawText()` 绘制运单号文字
  - `commitJob()` 提交打印任务

### 5. 预览功能
- `generatePreview()`: 生成标签预览图（jobName: "#!#preview#!#"）
- `previewFullImage()`: 点击预览图查看大图
- `copyWaybillNum()`: 复制运单号

## 依赖
- `utils/lpapi-ble/index` - 蓝牙打印API封装 (LPAPIFactory)

## 注意事项
- 需开启手机蓝牙和打印机蓝牙
- 标签为横向打印（orientation:0）
- 页面隐藏/卸载时自动关闭连接避免资源泄漏
- 搜索失败时提示检查打印机是否开机、蓝牙是否开启
