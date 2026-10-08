# totalDetail - 作业汇总详情

## 1. 页面概述

- **路径**: `supplier/jobReg/totalDetail/`
- **定位**: 查看某客户某月份的作业汇总统计
- **涉及文件**: `totalDetail.js`, `totalDetail.wxml`, `totalDetail.wxss`, `totalDetail.json`
- **依赖组件**: `wxs/format.wxs`

## 2. 数据状态

| 字段 | 类型 | 说明 |
|------|------|------|
| `info` | Object | 汇总详情 |

## 3. 功能

- `onLoad` 接收参数 `tenantId`, `workId`, `month`, `itemId`
- 调用 `loadWorkOrderMonthData` 获取月度汇总
- 展示: 登记月份、仓储名称、费用类型、税率、期初未结算、作业单数量、确认数量、结算数量、含税金额等

## 4. API 接口

| Bean | 方法 | 参数 | 说明 |
|------|------|------|------|
| `workOrderService` | `loadWorkOrderMonthData` | `{tenantId, workId, month, itemId}` | 加载月度汇总 |
