# driverDetail - 司机详情/绑定司机

## 1. 页面概述

- **路径**: `supplier/driver/driverDetail/`
- **定位**: 双模式页面 - 查看司机详情 或 绑定已存在司机
- **涉及文件**: `driverDetail.js`, `driverDetail.wxml`, `driverDetail.wxss`, `driverDetail.json`
- **依赖组件**: `van-uploader`, `van-cell-group`, `van-field`

## 2. 数据状态

| 字段 | 类型 | 说明 |
|------|------|------|
| `info` | Object | 司机信息 |
| `isEdit` | Boolean | true=绑定模式，false=查看详情 |
| `idCardFrontList`等 | Array | 证件图片列表 |

## 3. 生命周期

- **`onLoad({id})`**: 
  - 有 `id` → 加载司机详情 (`queryDriverInfoById`)
  - 无 `id` → 绑定司机模式 (`isEdit=true`)

## 4. 功能模块

### 4.1 查看详情模式
- 展示司机所有证件照和基本信息的只读视图

### 4.2 绑定司机模式
- 输入手机号 → `blur` 触发 `queryInfo()` 查询司机
- 显示司机信息供确认
- 提交调用 `bandTenantDriverMini` 进行绑定

## 5. API 接口

| Bean | 方法 | 参数 | 说明 |
|------|------|------|------|
| `driverTF` | `queryDriverInfoById` | `{id}` | 加载司机详情 |
| `driverTF` | `queryTenantDriverMini` | `{driverPhone}` | 按手机号查询司机 |
| `driverTF` | `bandTenantDriverMini` | `{id}` | 绑定司机 |
