# deviceRecoveryDetail - 器具回收详情

## 1. 页面概述

- **路径**: `supplier/device/deviceRecoveryDetail/`
- **定位**: 查看某一条器具回收记录的详细信息（只读）
- **涉及文件**: `deviceRecoveryDetail.js`, `deviceRecoveryDetail.wxml`, `deviceRecoveryDetail.wxss`, `deviceRecoveryDetail.json`

## 2. 功能

- `onLoad({id})` → 调用 `loadDeviceRecordById` 获取详情
- 展示回收单号、确认状态（背景图区分）、回收日期、来源地、交付地、备注、附件、器具明细列表

## 3. API 接口

| Bean | 方法 | 参数 | 说明 |
|------|------|------|------|
| `deviceRecordService` | `loadDeviceRecordById` | `{id}` | 加载回收记录详情 |
