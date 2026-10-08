# addCapacity - 新增/编辑运力

## 1. 页面概述

- **路径**: `supplier/capacity/addCapacity/`
- **定位**: 新增或编辑车辆运力信息，选择车辆、司机、线路
- **涉及文件**: `addCapacity.js`, `addCapacity.wxml`, `addCapacity.wxss`, `addCapacity.json`
- **依赖组件**: `popover`(省市选择), `van-icon`

## 2. 数据状态

| 字段 | 类型 | 说明 |
|------|------|------|
| `info` | Object | 运力表单数据 |
| `selectCitys` | Array | 已选目的城市列表 |
| `vehicleList` | Array | 可选车辆列表 |
| `driveList` | Array | 可选司机列表 |
| `baseCityList` | Array | 装货起始地枚举 |
| `provinceList` | Array | 省份列表（目的城市选择） |
| `cityList` | Array | 城市列表 |
| `timeList` | Array | 日期时间选择器数据 |

## 3. 生命周期

- **`onLoad({id, copy})`** → `doQuery()` 获取车辆/司机/城市枚举 → 如果有 `id` 则 `initData` 回显

## 4. 功能模块

### 4.1 车辆选择
- 通过 picker 选择已录入的车辆，自动回显车长/车型信息

### 4.2 司机选择
- 通过 picker 选择已录入的司机，自动回显手机号

### 4.3 线路目的地选择
- 省-市二级联动选择弹窗
- 支持多选城市（多目的地）
- `selectCitys` 存储已选城市，生成 `endCity` 逗号分隔字符串

### 4.4 预计到达时间
- 三级 picker（日期/时/分），生成 `scheduleTime` 格式

### 4.5 回调 (编辑模式)
- `initData` 遍历比对回显所有 picker 的选中项

### 4.6 复制新增
- 当 `copy=1` 时，复制已有运力数据但清除 `id` 和 `scheduleTime`

## 5. API 接口

| Bean | 方法 | 参数 | 说明 |
|------|------|------|------|
| `resVehicleInfoTF` | `selVehicleInfoListByCond` | `{tenantId, isInvoice:-1, rows:999}` | 获取车辆列表 |
| `driverTF` | `selDriverInfoListByCond` | `{tenantId, isInvoice:-1, rows:999}` | 获取司机列表 |
| `commonTF` | `getSysStaticDataByCodeTypes` | `{codeType:"BASE_CITY"}` | 获取装货城市枚举 |
| `vehicleScheduleService` | `loadVehicleScheduleById` | `{id}` | 加载运力详情（编辑） |
| `selectStaticDataTF` | `selectProvince`/`selectCity` | - | 省/市数据 |
| `vehicleScheduleService` | `saveOrUpdateVehicleSchedule` | `info` | 保存运力 |
