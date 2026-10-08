# addVehicle - 新增/编辑车辆

## 1. 页面概述

- **路径**: `supplier/vehicle/addVehicle/`
- **定位**: 新增或编辑车辆信息，上传行驶证等证件并支持OCR识别
- **涉及文件**: `addVehicle.js`, `addVehicle.wxml`, `addVehicle.wxss`, `addVehicle.json`
- **依赖组件**: `van-uploader`, `van-cell-group`, `van-field`

## 2. 数据状态

| 字段 | 类型 | 说明 |
|------|------|------|
| `info` | Object | 车辆表单数据 |
| `isUpdate` | Boolean | 是否编辑模式 |
| `vehicleLicenseFrontList` / `vehicleLicenseBackList` | Array | 行驶证正反面 |
| `roadTransportCertificateList` | Array | 道路运输证 |
| `roadOperatingPermitList` | Array | 道路运输经营许可证 |

## 3. 功能模块

### 3.1 证件上传
- 行驶证正反面
- 道路运输证
- 道路运输经营许可证

### 3.2 行驶证 OCR 识别
- 上传行驶证正面自动识别:
  - 车牌号 `plateNumber`、识别代号 `vin`、车辆所有人 `vehicleOwner`
  - 使用性质 `useCharacter`、发证日期、注册日期

### 3.3 表单填写
- 车牌号、车牌颜色、车型、报价车型、车长、能源类型
- 核定载质量(KG)、总质量(KG)
- 识别代号、车辆所有人、使用性质、发证机关
- 道路运输证号、道路运输经营许可证书

### 3.4 静态枚举
- `PLATE_COLOR`、`VEHICLE_TYPE`、`VEHICLE_LENGTH`、`VEHICLE_ENERGY_TYPE`、`VEHICLE_USE_CHARACTER`、`VEHICLE_TYPE_QUOTE`

### 3.5 编辑回显
- 遍历匹配所有 picker 枚举值回显

### 3.6 提交
- 新增: `saveVehicleInfo`
- 修改: `upTenantVehicleGYS`
- 自动设置 `vehicleAttribution=1`

## 5. API 接口

| Bean | 方法 | 参数 | 说明 |
|------|------|------|------|
| `commonTF` | `getSysStaticDataByCodeTypes` | 6种枚举 | 获取枚举 |
| `resVehicleInfoTF` | `queryVehicleInfoById` | `{id}` | 加载车辆信息 |
| `resVehicleInfoTF` | `getVehicleLicenseInfo` | `{fileId}` | OCR 识别行驶证 |
| `resVehicleInfoTF` | `saveVehicleInfo` | `info` | 新增车辆 |
| `resVehicleInfoTF` | `upTenantVehicleGYS` | `info` | 修改车辆 |
