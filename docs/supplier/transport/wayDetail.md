# wayDetail (Transport) - 作业点详情

## 1. 页面概述

- **路径**: `supplier/transport/wayDetail/`
- **定位**: 查看单个作业点详细信息（只读）
- **涉及文件**: `wayDetail.js`, `wayDetail.wxml`, `wayDetail.wxss`, `wayDetail.json`
- **依赖组件**: `van-cell-group`, `van-cell`, `wxs/format.wxs`

## 2. 数据状态

| 字段 | 类型 | 说明 |
|------|------|------|
| `info` | Object | 作业点信息 (workName, workAddress, workTypeName, workDate, linkmanName, bill, phone) |

## 3. 功能

- `onLoad({info})` 将 URL 编码的作业点 JSON 解码并展示
- 展示: 作业点名称、详细地址、作业内容、要求运作时间、联系人、电话
