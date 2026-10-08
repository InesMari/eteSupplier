# jobRegDetail - 作业登记详情

## 1. 页面概述

- **路径**: `supplier/jobReg/jobRegDetail/`
- **定位**: 查看作业登记详情，确认状态为0时可修改
- **涉及文件**: `jobRegDetail.js`, `jobRegDetail.wxml`, `jobRegDetail.wxss`, `jobRegDetail.json`
- **依赖组件**: `van-uploader`, `wxs/format.wxs`

## 2. 数据状态

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | String | 作业单 ID |
| `info` | Object | 作业单详情 |
| `operaterCertificateList` | Array | 操作凭证图片 |
| `scenePictureList` | Array | 现场图片 |

## 3. 功能模块

### 3.1 详情展示
- 费用类型、物流中心、作业名称、单位、登记时间、确认时间、登记数量
- 操作凭证和现场图片（只读）
- 客户明细表格

### 3.2 修改
- `confirmState==0` 时显示修改按钮，跳转 `jobReg?id=` 修改

## 4. API 接口

| Bean | 方法 | 参数 | 说明 |
|------|------|------|------|
| `workOrderService` | `loadWorkOrderByIdForWechat` | `{id}` | 加载作业单详情 |

## 5. 路由跳转

| 目标 | 条件 |
|------|------|
| `../jobReg/jobReg?id=` | confirmState==0 时修改 |
