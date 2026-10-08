# addDriver - 新增/编辑司机

## 1. 页面概述

- **路径**: `supplier/driver/addDriver/`
- **定位**: 新增或编辑司机信息，上传证件照并支持OCR识别
- **涉及文件**: `addDriver.js`, `addDriver.wxml`, `addDriver.wxss`, `addDriver.json`
- **依赖组件**: `van-uploader`, `van-cell-group`, `van-field`

## 2. 数据状态

| 字段 | 类型 | 说明 |
|------|------|------|
| `info` | Object | 司机表单数据 |
| `idCardFrontList` / `idCardBackList` | Array | 身份证正反面图片 |
| `driverLicenceFrontList` / `driverLicenceBackList` | Array | 驾驶证正反面图片 |
| `qualifyCertList` | Array | 从业资格证图片 |
| `isUpdate` | Boolean | 是否为编辑模式 |

## 3. 生命周期

- **`onLoad({id})`** → 如果有 `id` 则加载司机信息并回显（编辑模式），设置 `isUpdate=true`

## 4. 功能模块

### 4.1 证件上传 + OCR 识别
- **身份证正面** (`idCardFront`): OCR 识别 driverName、idCard
- **驾驶证正面** (`driverLicenceFront`): OCR 识别 driverLicence、driverClass、effectiveDate、expireDate
- **身份证反面、驾驶证反面、从业资格证**: 仅上传图片

### 4.2 表单填写
- 司机姓名、手机号、身份证号、驾驶证号、准驾车型、发证机关、从业资格证号
- 有效期限（开始/结束日期选择）

### 4.3 审核状态（编辑模式）
- 显示审核状态和审核备注（只读）

### 4.4 提交
- 新增: `saveDriverProcess`
- 修改: `upTenantDriverGYS`

## 5. API 接口

| Bean | 方法 | 参数 | 说明 |
|------|------|------|------|
| `driverTF` | `queryDriverInfoById` | `{id}` | 加载司机信息 |
| `driverTF` | `getIdCardOcrData` | `{fileId}` | OCR 识别身份证 |
| `driverTF` | `getDrivingLicenseOcrData` | `{fileId}` | OCR 识别驾驶证 |
| `driverTF` | `saveDriverProcess` | `info` | 新增司机 |
| `driverTF` | `upTenantDriverGYS` | `info` | 修改司机 |
