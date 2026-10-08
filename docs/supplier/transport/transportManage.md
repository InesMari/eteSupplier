# transportManage - 运输管理列表

## 1. 页面概述

- **路径**: `supplier/transport/transportManage/`
- **定位**: 运输管理运单列表，按状态筛选，支持派车和上传单据
- **涉及文件**: `transportManage.js`, `transportManage.wxml`, `transportManage.wxss`, `transportManage.json`
- **依赖组件**: `van-tabs`, `van-search`, `wxs/format.wxs`

## 2. 数据状态

| 字段 | 类型 | 说明 |
|------|------|------|
| `active` | Number | 当前 Tab |
| `info` | Object | 查询条件 (searchKey, waybillState) |
| `list` | Array | 运单列表 |
| `isRefresh` | Boolean | 刷新状态 |

## 3. 功能模块

### 3.1 Tab 状态
| Tab | waybillState | 
|------|-------------|
| 全部 | "" |
| 待派车 | 0 |
| 待出车 | 1 |
| 运作中 | 2 |
| 已完成 | 3 |
| 异常终止 | 4 |

### 3.2 列表操作
- 每条显示: 线路、急单标记、运费、派车单号、车辆信息
- **待派车**: "派车"按钮 → `dispatch`
- **待出车(state=1)**: "重新派车"按钮 → `dispatch`
- **已完成**: "上传单据"按钮 → LD 模块的 `ldUploadTicket`

### 3.3 查看详情
- 点击跳 `waybill/waybill?info=`

## 4. API 接口

| Bean | 方法 | 参数 | 说明 |
|------|------|------|------|
| `miniProgramWaybillTF` | `queryWaybillListPage` | `{...info, page}` | 分页查询运单 |

## 5. 路由跳转

| 目标 | 触发 |
|------|------|
| `../waybill/waybill?info=` | 查看详情 |
| `../dispatch/dispatch?info=` | 派车 |
| `/supplier/ld/ldUploadTicket/ldUploadTicket?info=` | 上传单据 |
