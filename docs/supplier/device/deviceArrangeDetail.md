# deviceArrangeDetail - 器具整理详情

## 1. 页面概述

- **路径**: `supplier/device/deviceArrangeDetail/`
- **定位**: 查看某一条器具整理记录的详细信息（只读）
- **涉及文件**: `deviceArrangeDetail.js`, `deviceArrangeDetail.wxml`, `deviceArrangeDetail.wxss`, `deviceArrangeDetail.json`

## 2. 功能

- `onLoad({id})` → 调用 `loadDeviceRecordById` 获取详情
- 展示整理单号、确认状态（背景图区分）、整理日期、作业点、备注、附件、器具明细列表

## 3. API 接口

| Bean | 方法 | 参数 | 说明 |
|------|------|------|------|
| `deviceRecordService` | `loadDeviceRecordById` | `{id}` | 加载整理记录详情 |
