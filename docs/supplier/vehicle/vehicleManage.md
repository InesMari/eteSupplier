# vehicleManage - 车辆管理列表

## 1. 页面概述

- **路径**: `supplier/vehicle/vehicleManage/`
- **定位**: 供应商车辆管理列表，支持搜索、增删改查、远程解锁、跳转车辆监控
- **涉及文件**: `vehicleManage.js`, `vehicleManage.wxml`, `vehicleManage.wxss`, `vehicleManage.json`
- **依赖组件**: `van-search`, `van-swipe-cell`

## 2. 数据状态

| 字段 | 类型 | 说明 |
|------|------|------|
| `list` | Array | 车辆列表 |
| `page` | Number | 分页页码 |
| `params` | Object | 查询参数 (plateNumber) |
| `isRefresh` | Boolean | 刷新状态 |

## 3. 功能模块

### 3.1 列表查询
- `queryVehicleInfoListByCond` 分页查询
- 支持搜索车牌、滚动加载、下拉刷新

### 3.2 车辆卡片
- 显示车头图标、车长、车型、车牌号、审核状态
- 审核状态: 审核中(0)、空闲中(1)、不通过(2)
- 如有 `lockNum` 显示远程解锁图标

### 3.3 操作
- **删除**: 左滑删除 (`delTenantVehicle`)
- **查看**: 通过状态跳转 → 审核通过跳 `vehicleDetail`，不通过跳 `addVehicle`(编辑)
- **新增车辆**: 跳 `addVehicle`
- **绑定车辆**: 跳 `vehicleDetail`(绑定模式)
- **车辆监控**: 跳 `vehicleMonitor`
- **远程解锁**: 二次确认后调用 `remoteOpenLockByEquipmentNumber`

## 4. API 接口

| Bean | 方法 | 参数 | 说明 |
|------|------|------|------|
| `resVehicleInfoTF` | `queryVehicleInfoListByCond` | `{...params, page}` | 分页查询车辆列表 |
| `resVehicleInfoTF` | `delTenantVehicle` | `{id}` | 删除车辆 |
| `equipmentTF` | `remoteOpenLockByEquipmentNumber` | `{equipmentNumber, lockNum}` | 远程开锁 |

## 5. 路由跳转

| 目标 | 条件 |
|------|------|
| `../vehicleDetail/vehicleDetail?id=` | 查看详情/绑定 |
| `../addVehicle/addVehicle?id=` | 编辑重审(state==2) |
| `../vehicleMonitor/vehicleMonitor` | 车辆监控 |
