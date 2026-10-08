# bankcardDetail - 银行卡详情

## 1. 页面概述

- **路径**: `supplier/personal/bankcardDetail/`
- **定位**: 查看银行卡详情，支持解绑
- **涉及文件**: `bankcardDetail.js`, `bankcardDetail.wxml`, `bankcardDetail.wxss`, `bankcardDetail.json`
- **依赖工具**: `bankCardSet.js`
- **依赖组件**: `van-cell-group`, `van-cell`

## 2. 数据状态

| 字段 | 类型 | 说明 |
|------|------|------|
| `info` | Object | 银行卡详情 |
| `id` | String | 银行卡 ID |

## 3. 功能

- `onLoad({id})` → 调用 `queryBankInfoById` 获取详情
- 通过 `setBankcard` 设置银行显示名称和图标
- 展示: 银行图标、开户行、账号类型、卡号、开户名等
- **解绑**: 二次确认后调用 `cancleBankInfo`

## 4. API 接口

| Bean | 方法 | 参数 | 说明 |
|------|------|------|------|
| `bankTF` | `queryBankInfoById` | `{id}` | 获取银行卡详情 |
| `bankTF` | `cancleBankInfo` | `{id}` | 解绑银行卡 |
