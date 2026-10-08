# capacityDetail - 运力详情

## 1. 页面概述

- **路径**: `supplier/capacity/capacityDetail/`
- **定位**: 查看运力详情，支持修改、复制新增、删除
- **涉及文件**: `capacityDetail.js`, `capacityDetail.wxml`, `capacityDetail.wxss`, `capacityDetail.json`

## 2. 数据状态

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | String | 运力 ID |
| `info` | Object | 运力详情 |

## 3. 生命周期

- `onLoad({id})` → 存储 `id` → `doQuery()`
- `onShow` → `doQuery()`

## 4. 功能模块

### 4.1 查看详情
- 展示车牌号、车长、车型、预计到达时间、装货地、目的地、司机信息、匹配状态等

### 4.2 修改
- 跳转 `addCapacity?id=` 进入编辑模式

### 4.3 复制新增
- 跳转 `addCapacity?id=&copy=1` 复制已有信息新增

### 4.4 删除
- 二次确认后调用删除接口

### 4.5 底部按钮区分
- 非历史运力显示：删除 + 修改
- 历史运力显示：复制

## 5. API 接口

| Bean | 方法 | 参数 | 说明 |
|------|------|------|------|
| `vehicleScheduleService` | `loadVehicleScheduleById` | `{id}` | 加载详情 |
| `vehicleScheduleService` | `deleteVehicleScheduleById` | `{id}` | 删除运力 |

## 6. 路由跳转

| 目标页面 | 参数 | 触发 |
|------|------|------|
| `../addCapacity/addCapacity` | `id` | 修改 |
| `../addCapacity/addCapacity` | `id&copy=1` | 复制新增 |
