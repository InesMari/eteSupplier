# jobRegManage - 作业登记管理

## 1. 页面概述

- **路径**: `supplier/jobReg/jobRegManage/`
- **定位**: 作业登记管理列表，支持4个Tab切换查看不同状态的作业单
- **涉及文件**: `jobRegManage.js`, `jobRegManage.wxml`, `jobRegManage.wxss`, `jobRegManage.json`
- **依赖组件**: `van-tabs`, `van-search`, `wxs/format.wxs`

## 2. 数据状态

| 字段 | 类型 | 说明 |
|------|------|------|
| `active` | Number | 当前 Tab (0-3) |
| `info` | Object | 查询条件 (searchKey, registerState, confirmState) |
| `method` | String | 查询方法名（动态切换） |
| `list` | Array | 作业单列表 |
| `isRefresh` | Boolean | 刷新状态 |

## 3. 功能模块

### 3.1 Tab 切换
- **待登记** (active=0): registerState=0, confirmState=0
- **已登记未确认** (active=1): registerState=1, confirmState=0
- **已确认** (active=2): confirmState=1
- **作业汇总** (active=3): method 切换为 `queryWorkOrderGroupByPageForWechat`

### 3.2 列表操作
- 待登记: 点击跳 `jobReg` 进行登记
- 已登记/已确认: 点击跳 `jobRegDetail` 查看详情
- 作业汇总: 点击跳 `totalDetail` 查看月度汇总

## 4. API 接口

| Bean | 方法 | 参数 | 说明 |
|------|------|------|------|
| `workOrderService` | `queryWorkOrderPageForWechat` | `{...info, page}` | 分页查询作业单 |
| `workOrderService` | `queryWorkOrderGroupByPageForWechat` | `{...info, page}` | 作业汇总查询 |
