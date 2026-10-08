# vehicleRepairCostList - 车辆维修成本列表

## 页面概述
司机端车辆维修/保养成本列表页，展示自有车辆的维修和保养记录。支持按审核状态/付款状态筛选、车牌号模糊搜索、分页加载和删除操作。

## 数据状态
| 字段 | 类型 | 说明 |
|------|------|------|
| list | Array | 维修成本记录列表 |
| page | Number | 当前页码 |
| hasNext | Boolean | 是否有下一页 |
| isRefresh | Boolean | 刷新动画状态 |
| info.searchKey | String | 搜索关键字（车牌号） |
| info.wxapp | Number | 微信客户端标识=1 |
| info.verifyState | String | 审核状态筛选 |
| info.payState | String | 付款状态筛选 |

## 生命周期
- **onShow()**: 每次显示时重新查询 `doQuery(true)`

## 功能模块

### 1. 多条件筛选
- **7个Tab标签**: 全部 / 未审核(0) / 审核通过(1) / 审核不通过(2) / 未付款(0) / 部分付款(1) / 全部付款(2)
- 切换Tab时重置另一维度的筛选

### 2. 模糊搜索
- 按车牌号搜索，300ms 防抖

### 3. 列表展示
- 每条记录：车牌号、审核状态（带颜色）、维修类型、金额、付款状态
- 日期、下次保养日期、下次保养里程、修理费、费用合计
- 审核不通过时显示不通过原因

### 4. 操作功能
- **新增**: 底部固定按钮跳转 `vehicleRepairCost` 新增页
- **编辑**: 点击列表项跳转 `vehicleRepairCost?id=xxx`
- **删除**: 非审核通过状态可删除，弹出确认对话框

### 5. 分页加载
- 滚动到底部加载更多，顶部下拉刷新

## API 接口
| Bean | 方法 | 说明 |
|------|------|------|
| vehicleRepairCostService | queryVehicleRepairCostPage | 分页查询维修成本列表 |
| vehicleRepairCostService | deleteVehicleRepairCostById | 删除维修成本记录 |

## 路由导航
- 点击列表项 → `/driver/vehicleRepairCost/vehicleRepairCost/vehicleRepairCost?id=${id}`
- 点击新增 → `/driver/vehicleRepairCost/vehicleRepairCost/vehicleRepairCost`

## 注意事项
- 与 `costCapacityList` 页面结构极其相似（均为司机端成本管理）
- 审核通过记录不可删除
- 维修类型有：保养、修理、其他
