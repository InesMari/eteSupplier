# ldManage - 物流派车管理列表

## 1. 页面概述

- **路径**: `supplier/ld/ldManage/`
- **定位**: 物流派车运单管理列表，支持按状态筛选和跳转操作
- **涉及文件**: `ldManage.js`, `ldManage.wxml`, `ldManage.wxss`, `ldManage.json`
- **依赖组件**: `van-tabs`, `van-search`, `wxs/format.wxs`

## 2. 数据状态

| 字段 | 类型 | 说明 |
|------|------|------|
| `active` | Number | 当前 Tab (0-4) |
| `info` | Object | 查询条件 (searchKey, waybillState) |
| `list` | Array | 运单列表 |
| `isRefresh` | Boolean | 刷新状态 |

## 3. 功能模块

### 3.1 Tab 状态映射
| Tab | waybillState | 说明 |
|------|-------------|------|
| 全部 | "" | 所有状态 |
| 待派车 | 0 | 未调度车辆 |
| 运输中 | 2 | 运作中 |
| 已完成 | 3 | 已完成 |
| 异常终止 | 5 | 异常中止 |

### 3.2 列表操作按钮
- **待派车** (state=0): 显示"派车"按钮，跳 `ldDispatch`
- **运输中** (state=1/2): 显示"运作上报"，跳 `ldOperationReport`
- **已完成** (state=3): 显示"上传单据"，跳 `ldUploadTicket`

### 3.3 查看详情
- 点击列表项跳 `wayDetail`，传递整个 item JSON 编码

## 4. API 接口

| Bean | 方法 | 参数 | 说明 |
|------|------|------|------|
| `miniProgramWaybillTF` | `queryWaybillListPageLD` | `{...info, page}` | 分页查询LD运单 |
