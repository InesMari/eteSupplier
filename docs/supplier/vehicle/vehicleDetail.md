# vehicleDetail - 车辆详情/绑定车辆

## 1. 页面概述

- **路径**: `supplier/vehicle/vehicleDetail/`
- **定位**: 双模式页面 - 查看车辆详情 或 绑定已存在车辆
- **涉及文件**: `vehicleDetail.js`, `vehicleDetail.wxml`, `vehicleDetail.wxss`, `vehicleDetail.json`
- **依赖组件**: `van-uploader`, `van-cell-group`, `van-field`

## 2. 数据状态

| 字段 | 类型 | 说明 |
|------|------|------|
| `info` | Object | 车辆信息 |
| `isBang` | Boolean | true=绑定模式，false=查看详情 |
| `vehicleLicenseFrontList`等 | Array | 证件图片列表 |

## 3. 生命周期

- **`onLoad({id})`:** 
  - 有 `id` → 查询车辆详情
  - 无 `id` → 绑定车辆模式

## 4. 功能模块

### 4.1 查看详情模式
- 展示车辆所有证件照和基本信息的只读视图

### 4.2 绑定车辆模式
- 输入车牌号和识别代号后6位 → `blur` 触发查询
- 校验 `vinCheck` 与车辆 `vin` 后6位是否匹配
- 匹配成功则显示车辆信息，提交调用 `bandTenantVehicleMini`

### 4.3 安全校验
- 识别代号后6位校验不通过则清空图片数据并提示

## 5. API 接口

| Bean | 方法 | 参数 | 说明 |
|------|------|------|------|
| `resVehicleInfoTF` | `queryVehicleInfoById` | `{id}` | 加载车辆详情 |
| `resVehicleInfoTF` | `queryTenantVehicleMini` | `{plateNumber}` | 按车牌查询车辆 |
| `resVehicleInfoTF` | `bandTenantVehicleMini` | `{id}` | 绑定车辆 |
