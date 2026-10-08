# waybill (Transport) - 运单详情

## 1. 页面概述

- **路径**: `supplier/transport/waybill/`
- **定位**: 查看运单完整详情（作业点、货物、运费、配送信息、单据），支持派车操作
- **涉及文件**: `waybill.js`, `waybill.wxml`, `waybill.wxss`, `waybill.json`
- **依赖组件**: `van-icon`, `wxs/format.wxs`

## 2. 数据状态

| 字段 | 类型 | 说明 |
|------|------|------|
| `info` | Object | 运单完整信息 |
| `waybillId` / `waybillState` | String | 运单ID和状态 |
| `goodsList` | Array | 货物清单(lazy load) |
| `isshowGoodsDetail` | Boolean | 展开货物明细 |
| `isshowFeeDetail` | Boolean | 展开费用明细 |

## 3. 功能模块

### 3.1 运单头部
- 线路名称、状态背景图、派车单号

### 3.2 作业点信息
- 提/卸/提卸货作业点列表，支持调整顺序

### 3.3 货物清单
- 件数/重量/体积汇总
- 展开明细: 货物名称、规格、件数、包装、重量、类别、体积

### 3.4 运费信息
- 计费方式、净重、合计 / 展开后显示详细费用项
- 预付/到付/周期付

### 3.5 配送信息
- 车牌号、车型、车长、司机、电话、要求运作时间

### 3.6 底部操作
- 待派车/待出车: 显示"派车"按钮 → `dispatch`

## 4. API 接口

| Bean | 方法 | 参数 | 说明 |
|------|------|------|------|
| `miniProgramWaybillTF` | `queryWaybillInfoByWaybillId` | `{waybillId}` | 获取运单详情 |
| `miniProgramWaybillTF` | `loadWaybillGoodsListByWaybillId` | `{waybillId}` | 获取货物清单 |
