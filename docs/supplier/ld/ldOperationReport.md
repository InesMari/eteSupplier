# ldOperationReport - 物流运作上报

## 1. 页面概述

- **路径**: `supplier/ld/ldOperationReport/`
- **定位**: 对运输中的运单做运作上报，填写节点跟踪和预计到达时间
- **涉及文件**: `ldOperationReport.js`, `ldOperationReport.wxml`, `ldOperationReport.wxss`, `ldOperationReport.json`
- **依赖组件**: `datetimepicker`, `wxs/format.wxs`

## 2. 数据状态

| 字段 | 类型 | 说明 |
|------|------|------|
| `info` | Object | 运单数据 (waybillId, workList, nodeList, deliveryOrderNo) |

## 3. 功能模块

### 3.1 外发单号填写
- 输入贵司单号 `deliveryOrderNo`

### 3.2 作业点预计到达时间
- 遍历 `workList` 显示每个作业点
- 通过 `datetimepicker` 选择各点的预计到达时间

### 3.3 节点跟踪
- 遍历 `nodeList` 显示每个跟踪节点
- 可填写节点跟踪内容

### 3.4 提交
- 调用 `opReport` 提交运作上报数据

## 4. API 接口

| Bean | 方法 | 参数 | 说明 |
|------|------|------|------|
| `miniProgramWaybillTF` | `loadWaybillDataByWaybillId` | `{waybillId}` | 加载运单运作数据 |
| `miniProgramWaybillTF` | `opReport` | `{...info}` | 提交运作上报 |
