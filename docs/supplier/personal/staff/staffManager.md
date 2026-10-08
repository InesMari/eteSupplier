# staffManager - 员工管理列表

## 1. 页面概述

- **路径**: `supplier/personal/staff/staffManager/`
- **定位**: 员工管理列表，支持增删改查
- **涉及文件**: `staffManager.js`, `staffManager.wxml`, `staffManager.wxss`, `staffManager.json`
- **依赖组件**: `van-search`

## 2. 数据状态

| 字段 | 类型 | 说明 |
|------|------|------|
| `list` | Array | 员工列表 |
| `page` | Number | 分页页码 |
| `params` | Object | 查询参数 (keyword) |
| `isRefresh` | Boolean | 刷新状态 |

## 3. 功能模块

### 3.1 列表查询
- `queryStaffs` 分页查询
- 支持搜索、滚动加载、下拉刷新

### 3.2 操作
- **查看详情**: 跳 `addStaff?type=2&staffId=`
- **修改**: 跳 `addStaff?type=1&staffId=`
- **删除**: 二次确认后调用 `delStaff`
- **新增**: 跳 `addStaff?type=0`

## 4. API 接口

| Bean | 方法 | 参数 | 说明 |
|------|------|------|------|
| `wxUserTF` | `queryStaffs` | `{...params, page}` | 分页查询员工 |
| `wxUserTF` | `delStaff` | `{staffIds, userNames}` | 删除员工 |
