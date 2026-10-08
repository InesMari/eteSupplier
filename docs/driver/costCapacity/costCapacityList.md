# costCapacityList - 运力成本列表

## 页面概述
司机端运力成本管理列表页，展示自有车辆的运营成本记录，支持按审核状态/付款状态筛选、车牌号模糊搜索、分页加载和删除操作。

## 数据状态
| 字段 | 类型 | 说明 |
|------|------|------|
| list | Array | 成本记录列表 |
| page | Number | 当前页码 |
| hasNext | Boolean | 是否有下一页 |
| isRefresh | Boolean | 刷新动画状态 |
| info.searchKey | String | 搜索关键字（车牌号） |
| info.verifyState | String | 审核状态筛选 |
| info.payState | String | 付款状态筛选 |
| heads | Array | 费用类型表头数据 |

## 生命周期
- **onShow()**: 每次显示时重新查询列表 `doQuery(true)`

## 功能模块

### 1. 多条件筛选
- **7个Tab标签**: 全部 / 未审核(0) / 审核通过(1) / 审核不通过(2) / 未付款(0) / 部分付款(1) / 全部付款(2)
- `onChange`: 切换Tab时清空另一维度筛选，重新查询

### 2. 模糊搜索
- 输入车牌号关键字，300ms 防抖后执行搜索

### 3. 列表展示
- 每条记录显示：车牌号、审核状态、日期、费用类型、支付类型、付款状态、里程数、数量、单位、金额、费用合计
- 审核不通过时显示不通过原因

### 4. 操作功能
- **新增**: 底部固定按钮跳转到 `costCapacity` 新增页
- **编辑**: 点击列表项跳转到 `costCapacity?id=xxx`
- **删除**: 非审核通过状态可删除，弹出确认对话框

### 5. 分页加载
- 滚动到底部 `scrolltolowerHandler` 自动加载下一页
- 顶部下拉 `toupper` 触发刷新

## API 接口
| Bean | 方法 | 说明 |
|------|------|------|
| vehicleWaybillCostService | queryVehicleWaybillCostPage | 分页查询成本列表 |
| vehicleWaybillCostService | deleteVehicleWaybillCostById | 删除成本记录 |
| commonTF | querySysStaticDataHeads | 查询表头字典 |

## 路由导航
- 点击列表项 → `/driver/costCapacity/costCapacity/costCapacity?id=${id}`
- 点击新增 → `/driver/costCapacity/costCapacity/costCapacity`

## 注意事项
- 审核通过（verifyState==1）的记录不显示删除按钮
- 模糊搜索使用300ms防抖避免频繁请求
