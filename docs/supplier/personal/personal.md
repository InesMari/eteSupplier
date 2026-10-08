# personal - 个人中心首页

## 1. 页面概述

- **路径**: `supplier/personal/personal/`
- **定位**: 供应商个人中心入口，展示企业信息并提供功能导航
- **涉及文件**: `personal.js`, `personal.wxml`, `personal.wxss`, `personal.json`
- **依赖组件**: `van-icon`

## 2. 数据状态

| 字段 | 类型 | 说明 |
|------|------|------|
| `userInfo` | Object | 用户信息 (tenantName, billId) |
| `cardTotal` | Number | 银行卡数量 |

## 3. 生命周期

- `onLoad` 从 storage 获取用户信息，查询银行卡数量

## 4. 功能入口

| 入口 | 目标页面 | 说明 |
|------|------|------|
| 资料管理 | `supplierDetail` | 查看供应商资料 |
| 运费明细 | `feeDetail` | 查看运费明细 |
| 银行卡 | `bankcards` | 银行卡管理 |
| 员工管理 | `staffManager` | 员工管理 |

### 4.2 退出登录
- `toLogout`: 调用 `logout`，清除 storage，关闭后台定位，reLaunch 到引导页

## 5. API 接口

| Bean | 方法 | 参数 | 说明 |
|------|------|------|------|
| `bankTF` | `queryBankInfoCount` | - | 获取银行卡数量 |
| `wxUserTF` | `logout` | - | 退出登录 |
