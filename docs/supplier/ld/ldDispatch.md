# ldDispatch - 物流派车调度

## 1. 页面概述

- **路径**: `supplier/ld/ldDispatch/`
- **定位**: 为运单分配提货/干线/送货三种类型的车辆和司机
- **涉及文件**: `ldDispatch.js`, `ldDispatch.wxml`, `ldDispatch.wxss`, `ldDispatch.json`
- **依赖组件**: `popover`(车辆/司机选择弹窗), `van-icon`

## 2. 数据状态

| 字段 | 类型 | 说明 |
|------|------|------|
| `info` | Object | 派车数据对象 (含 PICK_/TRUNK_/DELIVERY_ 前缀字段) |
| `tabAct` | Number | 车辆类型 0=提货/1=干线/2=送货 |
| `vehicleList` | Array | 车辆列表 |
| `driveList` | Array | 司机列表 |
| `vehicleTypeList`/`vehicleLengthList` | Array | 车型/车长枚举 |

## 3. 功能模块

### 3.1 三类型车辆/司机分配
- **提货车辆**: PICK_PLATE_NUMBER / PICK_DRIVER_NAME / PICK_LINK_PHONE
- **干线车辆**: TRUNK_PLATE_NUMBER / TRUNK_DRIVER_NAME / TRUNK_LINK_PHONE
- **送货车辆**: DELIVERY_PLATE_NUMBER / DELIVERY_DRIVER_NAME / DELIVERY_LINK_PHONE

每种需分别选择车型和车长

### 3.2 车辆/司机选择弹窗
- 支持搜索车辆(车牌号)和司机(姓名)
- 可从列表选择或直接手动输入

### 3.3 派车提交
- 调用 `waybillSendCarLD` 提交
- 成功返回上一页

## 4. API 接口

| Bean | 方法 | 参数 | 说明 |
|------|------|------|------|
| `resVehicleInfoTF` | `selVehicleInfoListByCond` | `{tenantId}` | 获取车辆列表 |
| `driverTF` | `selDriverInfoListByCond` | `{tenantId}` | 获取司机列表 |
| `commonTF` | `getSysStaticDataByCodeTypes` | `{codeType:"VEHICLE_TYPE,VEHICLE_LENGTH"}` | 获取枚举 |
| `miniProgramWaybillTF` | `waybillSendCarLD` | `{waybillId, dispatchId, transitOrderDataMap}` | 提交派车 |
