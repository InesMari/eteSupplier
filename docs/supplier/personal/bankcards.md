# bankcards - 银行卡列表

## 1. 页面概述

- **路径**: `supplier/personal/bankcards/`
- **定位**: 查看和管理所有绑定的银行卡
- **涉及文件**: `bankcards.js`, `bankcards.wxml`, `bankcards.wxss`, `bankcards.json`
- **依赖工具**: `bankCardSet.js` (银行卡样式设置)
- **依赖组件**: `van-swipe-cell`, `van-icon`

## 2. 数据状态

| 字段 | 类型 | 说明 |
|------|------|------|
| `bankcardList` | Array | 银行卡列表 |

## 3. 功能模块

### 3.1 列表展示
- `queryBankData` 获取列表，通过 `setBankcard` 工具设置银行图标和背景色

### 3.2 操作
- **查看详情**: 跳 `bankcardDetail?id=`
- **删除**: 左滑删除，调用 `cancleBankInfo`
- **新增**: 跳 `addBankcard`

## 4. API 接口

| Bean | 方法 | 参数 | 说明 |
|------|------|------|------|
| `bankTF` | `queryBankData` | - | 获取银行卡列表 |
| `bankTF` | `cancleBankInfo` | `{id}` | 删除银行卡 |
