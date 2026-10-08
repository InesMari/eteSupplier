# wayDetail (LD) - 物流运单详情

## 1. 页面概述

- **路径**: `supplier/ld/wayDetail/`
- **定位**: 查看物流运单的完整详情（作业点、货物清单、运费、单据），支持跳转操作
- **涉及文件**: `wayDetail.js`, `wayDetail.wxml`, `wayDetail.wxss`, `wayDetail.json`
- **依赖组件**: `van-icon`, `wxs/format.wxs`

## 2. 数据状态

| 字段 | 类型 | 说明 |
|------|------|------|
| `info` | Object | 运单完整信息 |
| `waybillId` | String | 运单 ID |
| `goodsList` | Array | 货物清单 |
| `isshowGoodsDetail` | Boolean | 是否展开货物明细 |
| `isshowFeeDetail` | Boolean | 是否展开费用明细 |

## 3. 功能模块

### 3.1 运单头部
- 派车单号、状态背景图

### 3.2 作业点信息
- 提/卸/提卸货 作业点列表
- 支持调整作业点顺序（state=0/1 且 >2个时显示）
- 致电客服/司机

### 3.3 货物清单
- 汇总: 件数/重量/体积
- 明细: 展开后显示每项货物品名、规格、包装等

### 3.4 运费信息
- 折叠汇总/展开明细
- 包含: 计费方式、净重、运费、装货费、卸货费、其他费等
- 预付/到付/周期付

### 3.5 底部操作按钮
- 待派车 → 派车
- 运输中 → 运作上报
- 已完成 → 上传单据

## 4. API 接口

| Bean | 方法 | 参数 | 说明 |
|------|------|------|------|
| `miniProgramWaybillTF` | `queryWaybillInfoByWaybillId` | `{waybillId}` | 获取运单详情 |
| `miniProgramWaybillTF` | `loadWaybillGoodsListByWaybillId` | `{waybillId}` | 获取货物清单 |

## 5. 路由跳转

| 目标 | 条件 |
|------|------|
| `../../transport/wayDetail/wayDetail?info=` | 查看线路详情 |
| `../../transport/waySort/waySort?info=&waybillId=` | 调整作业点顺序 |
| `../ldDispatch/ldDispatch?info=` | 派车 |
| `../ldOperationReport/ldOperationReport?info=` | 运作上报 |
| `../ldUploadTicket/ldUploadTicket?info=` | 上传单据 |
