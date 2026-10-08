# feeDetail - 运费明细

## 1. 页面概述

- **路径**: `supplier/personal/feeDetail/`
- **定位**: 查看运单运费明细列表，按状态筛选
- **涉及文件**: `feeDetail.js`, `feeDetail.wxml`, `feeDetail.wxss`, `feeDetail.json`
- **依赖组件**: `van-tabs`, `van-search`, `wxs/format.wxs`

## 2. 数据状态

| 字段 | 类型 | 说明 |
|------|------|------|
| `active` | Number | 当前 Tab (1-5) |
| `info` | Object | 查询条件 (searchKey, waybillState) |
| `list` | Array | 运费列表 |
| `isRefresh` | Boolean | 刷新状态 |

## 3. 功能模块

### 3.1 Tab 状态映射
| Tab | waybillState | 说明 |
|------|-------------|------|
| 全部 | "" | 所有 |
| 待派车 | 0 | 未调度 |
| 待出车 | 1 | 已调度 |
| 运作中 | 2 | 运输中 |
| 已完成 | 3 | 已完成 |
| 异常终止 | 4 | 已取消 |

### 3.2 列表展示
- 每条显示: 线路名称、状态、派车单号、车辆信息、运费合计(应收/已收/未收)

### 3.3 查看详情
- 点击跳 `waybill/waybill?info=`

## 4. API 接口

| Bean | 方法 | 参数 | 说明 |
|------|------|------|------|
| `miniProgramWaybillTF` | `queryWaybillListPage` | `{...info, page}` | 分页查询运单 |
