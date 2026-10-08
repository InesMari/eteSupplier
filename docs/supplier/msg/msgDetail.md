# msgDetail - 消息详情

## 1. 页面概述

- **路径**: `supplier/msg/msgDetail/`
- **定位**: 查看消息详细内容
- **涉及文件**: `msgDetail.js`, `msgDetail.wxml`, `msgDetail.wxss`, `msgDetail.json`

## 2. 数据状态

| 字段 | 类型 | 说明 |
|------|------|------|
| `info` | Object | 消息详情 (messageModelName, formatCreateDate, messageContent) |

## 3. 功能

- `onLoad({info})` 将 URL 编码的消息 JSON 解码并展示
- 展示: 消息模板名称、创建时间、消息内容
