# deviceArrangeHis - 器具整理记录列表

## 1. 页面概述

- **路径**: `supplier/device/deviceArrangeHis/`
- **定位**: 查看所有器具整理记录，支持搜索和分页
- **涉及文件**: `deviceArrangeHis.js`, `deviceArrangeHis.wxml`, `deviceArrangeHis.wxss`, `deviceArrangeHis.json`

## 2. 数据状态

| 字段 | 类型 | 说明 |
|------|------|------|
| `list` | Array | 整理记录列表 |
| `page` | Number | 分页页码 |
| `info` | Object | 搜索条件 (searchStr) |
| `isRefresh` | Boolean | 刷新状态 |

## 3. 功能模块

### 3.1 列表查询
- `queryDeviceClearUpRecordPageForCust` 分页查询
- 支持搜索关键字、滚动加载、下拉刷新

### 3.2 记录卡片
- 显示整理单号、确认状态、整理日期、器具数量、客户名称、备注

### 3.3 查看详情
- 点击跳转 `deviceArrangeDetail?id=`

## 4. API 接口

| Bean | 方法 | 参数 | 说明 |
|------|------|------|------|
| `deviceRecordService` | `queryDeviceClearUpRecordPageForCust` | `{...info, page}` | 分页查询整理记录 |
