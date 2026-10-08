# msgManage - 消息管理列表

## 1. 页面概述

- **路径**: `supplier/msg/msgManage/`
- **定位**: 查看通知消息和系统公告列表
- **涉及文件**: `msgManage.js`, `msgManage.wxml`, `msgManage.wxss`, `msgManage.json`

## 2. 数据状态

| 字段 | 类型 | 说明 |
|------|------|------|
| `list` | Array | 消息列表 |
| `MsgNoReadCount` | Number | 未读消息数量 |

## 3. 功能模块

### 3.1 消息列表
- `onShow` 调用 `queryMessageData` 和 `queryMessageNoReadCount`
- 未读消息数量标记在 Tab 上
- 系统公告暂时提示"暂无"

### 3.2 查看详情
- 点击跳转 `msgDetail`，传递整个消息 JSON
- 同时调用 `upMessageSts` 标记已读

## 4. API 接口

| Bean | 方法 | 参数 | 说明 |
|------|------|------|------|
| `bankTF` | `queryMessageData` | - | 获取消息列表 |
| `bankTF` | `queryMessageNoReadCount` | - | 获取未读消息数 |
| `bankTF` | `upMessageSts` | `{id}` | 标记消息已读 |
