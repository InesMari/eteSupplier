# driverManage - 司机管理列表

## 1. 页面概述

- **路径**: `supplier/driver/driverManage/`
- **定位**: 供应商司机管理列表，支持搜索、增删改查
- **涉及文件**: `driverManage.js`, `driverManage.wxml`, `driverManage.wxss`, `driverManage.json`
- **依赖组件**: `van-search`, `van-swipe-cell`

## 2. 数据状态

| 字段 | 类型 | 说明 |
|------|------|------|
| `list` | Array | 司机列表 |
| `page` | Number | 分页页码 |
| `params` | Object | 查询参数 |
| `isRefresh` | Boolean | 刷新状态 |

## 3. 功能模块

### 3.1 列表查询
- `queryDriverInfoList` 分页查询
- 支持搜索司机姓名、滚动加载、下拉刷新

### 3.2 司机卡片
- 显示头像、姓名、手机号、审核状态
- 审核状态: 审核中(0)、空闲中(1)、不通过(2)
- 不通过显示原因

### 3.3 操作
- **删除**: 左滑删除 (`delTenantDriver`)
- **查看**: 通过状态跳转 → 审核通过跳 `driverDetail`，不通过跳 `addDriver` (编辑)
- **新增司机**: 跳 `addDriver`
- **绑定司机**: 跳 `driverDetail`(无id，绑定模式)

## 4. API 接口

| Bean | 方法 | 参数 | 说明 |
|------|------|------|------|
| `driverTF` | `queryDriverInfoList` | `{...params, page}` | 分页查询司机列表 |
| `driverTF` | `delTenantDriver` | `{id}` | 删除司机 |

## 5. 路由跳转

| 目标 | 条件 |
|------|------|
| `../addDriver/addDriver` | state!=2 或 state为空 → 新增 |
| `../addDriver/addDriver?id=` | state==2(不通过) → 编辑重审 |
| `../driverDetail/driverDetail?id=` | 审核通过 → 详情 |
| `../driverDetail/driverDetail` | 无id → 绑定模式 |
