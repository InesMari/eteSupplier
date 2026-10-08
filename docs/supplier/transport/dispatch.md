# dispatch (Transport) - 运输派车调度

## 1. 页面概述

- **路径**: `supplier/transport/dispatch/`
- **定位**: 为运单选择司机和车辆进行派车，三步骤流程
- **涉及文件**: `dispatch.js`, `dispatch.wxml`, `dispatch.wxss`, `dispatch.json`
- **依赖组件**: `van-search`

## 2. 数据状态

| 字段 | 类型 | 说明 |
|------|------|------|
| `showDriver` | Boolean | 显示选司机步骤 |
| `showVehicle` | Boolean | 显示选车辆步骤 |
| `showFinish` | Boolean | 显示完成页面 |
| `driverList` | Array | 司机列表 |
| `vehicleList` | Array | 车辆列表 |
| `selectVehicleBtn` | Boolean | 选车辆按钮禁用(未选司机时) |
| `submitBtn` | Boolean | 提交按钮禁用(未选车辆时) |

## 3. 功能模块

### 3.1 三步流程
1. **选择司机** (`showDriver`): 单选列表，支持搜索，仅1个时默认选中
2. **选择车辆** (`showVehicle`): 单选列表，支持搜索车牌，仅1个时默认选中
3. **完成** (`showFinish`): 调度成功提示，可查看运单或返回首页

### 3.2 派车提交
- 调用 `dispatchCar` 提交 `{vehicleId, driverUserId, waybillId, isInvoice}`

## 4. API 接口

| Bean | 方法 | 参数 | 说明 |
|------|------|------|------|
| `miniProgramWaybillTF` | `queryDriverList` | `{...paramsDriver, page}` | 查询司机列表 |
| `miniProgramWaybillTF` | `queryVehicleList` | `{...paramsVehicle, page}` | 查询车辆列表 |
| `miniProgramWaybillTF` | `dispatchCar` | `{vehicleId, driverUserId, waybillId, isInvoice}` | 派车 |

## 5. 与 ldDispatch 的差异
- LD版本支持提货/干线/送货三种车辆分别分配
- 本版本是一次性选一个司机+一个车辆
