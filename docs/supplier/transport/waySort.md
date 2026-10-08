# waySort - 调整作业点顺序

## 1. 页面概述

- **路径**: `supplier/transport/waySort/`
- **定位**: 调整运单中作业点的执行顺序
- **涉及文件**: `waySort.js`, `waySort.wxml`, `waySort.wxss`, `waySort.json`

## 2. 数据状态

| 字段 | 类型 | 说明 |
|------|------|------|
| `list` | Array | 作业点列表 |
| `waybillId` | String | 运单 ID |

## 3. 功能

- `onLoad`: 解析作业点列表 JSON
- 每个作业点有输入框可修改排序序号
- 首尾作业点不可修改（disabled）
- 提交调用 `adjustmentWorkOrder` 保存新顺序

## 4. API 接口

| Bean | 方法 | 参数 | 说明 |
|------|------|------|------|
| `miniProgramWaybillTF` | `adjustmentWorkOrder` | `{waybillId, workList}` | 调整作业点顺序 |
