# ldUploadTicket - 物流上传单据

## 1. 页面概述

- **路径**: `supplier/ld/ldUploadTicket/`
- **定位**: 上传派车单回单凭证图片（最多5张）
- **涉及文件**: `ldUploadTicket.js`, `ldUploadTicket.wxml`, `ldUploadTicket.wxss`, `ldUploadTicket.json`
- **依赖组件**: `van-uploader`

## 2. 数据状态

| 字段 | 类型 | 说明 |
|------|------|------|
| `info` | Object | 运单基本信息 |
| `waybillId` | String | 运单 ID |
| `ticketList` | Array | 已上传的回单图片 |

## 3. 功能模块

### 3.1 图片上传
- 使用 `van-uploader` 上传回单图片（最多5张）
- 支持删除已上传图片

### 3.2 初始化
- 从 `queryWaybillInfoByWaybillId` 获取已有回单并初始化为展示图片

### 3.3 提交
- 调用 `uploadReceipts` 提交回单列表

## 4. API 接口

| Bean | 方法 | 参数 | 说明 |
|------|------|------|------|
| `miniProgramWaybillTF` | `queryWaybillInfoByWaybillId` | `{waybillId}` | 获取运单详情(含已有回单) |
| `miniProgramWaybillTF` | `uploadReceipts` | `{waybillId, receiptsList}` | 上传回单 |
