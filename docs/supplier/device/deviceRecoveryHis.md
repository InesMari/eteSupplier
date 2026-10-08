# deviceRecoveryHis - 器具回收记录列表

## 1. 页面概述

- **路径**: `supplier/device/deviceRecoveryHis/`
- **定位**: 查看所有器具回收记录，支持搜索和分页
- **涉及文件**: `deviceRecoveryHis.js`, `deviceRecoveryHis.wxml`, `deviceRecoveryHis.wxss`, `deviceRecoveryHis.json`

## 2. 数据状态

| 字段 | 类型 | 说明 |
|------|------|------|
| `list` | Array | 回收记录列表 |
| `page` | Number | 分页页码 |
| `info` | Object | 搜索条件 (searchStr) |
| `isRefresh` | Boolean | 刷新状态 |

## 3. 功能模块

### 3.1 列表查询
- `queryDeviceReoveryRecordPageForCust` 分页查询
- 支持搜索关键字、滚动加载、下拉刷新

### 3.2 记录卡片
- 显示回收单号、确认状态、回收日期、器具数量、来源地、交付地、备注

## 4. API 接口

| Bean | 方法 | 参数 | 说明 |
|------|------|------|------|
| `deviceRecordService` | `queryDeviceReoveryRecordPageForCust` | `{...info, page}` | 分页查询回收记录 |
