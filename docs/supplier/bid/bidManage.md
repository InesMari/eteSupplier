# bidManage - 竞价管理列表

## 1. 页面概述

- **路径**: `supplier/bid/bidManage/`
- **定位**: 供应商端竞价列表页，展示所有竞价报价，支持筛选和倒计时
- **涉及文件**: `bidManage.js`, `bidManage.wxml`, `bidManage.wxss`, `bidManage.json`
- **依赖组件**: `popover`(自定义筛选弹窗), `van-icon`

## 2. 数据状态

| 字段 | 类型 | 说明 |
|------|------|------|
| `list` | Array | 竞价列表数据 |
| `page` | Number | 分页页码 |
| `info` | Object | 筛选条件 (beginAddress, endAddress, vehicleLength) |
| `isRefresh` | Boolean | 是否正在刷新 |
| `isShowFilterPopover` | Boolean | 是否显示筛选弹窗 |
| `vehicleLengthList` | Array | 车长枚举列表 |

## 3. 生命周期

- **`onShow`** → `queryStaticData()` 获取车长枚举 → `doQuery(true)` 加载第一页

## 4. 功能模块

### 4.1 竞价列表查询
- 调用 `bidQuoteTF.queryBidQuotePage` 分页查询
- `doQuery(true)` 重置页码并刷新，`doQuery()` 加载下一页

### 4.2 倒计时
- `doCount()` 遍历列表中每个竞价项
- `countDown()` 计算截止时间与当前时间的差值，解析为天/时/分/秒展示

### 4.3 筛选功能
- 出发地/目的地输入筛选
- 车长多选筛选（从 `VEHICLE_LENGTH` 静态枚举获取）
- 筛选确认后调用 `doQuery(true)` 刷新

### 4.4 滚动加载 & 下拉刷新
- `scrolltolowerHandler` → 加载下一页
- `toupper` → 设置 `isRefresh=true` → 重新加载

## 5. API 接口

| Bean | 方法 | 参数 | 说明 |
|------|------|------|------|
| `commonTF` | `getSysStaticDataByCodeTypes` | `codeType:"VEHICLE_LENGTH"` | 获取车长枚举 |
| `bidQuoteTF` | `queryBidQuotePage` | `{...info, page}` | 分页查询竞价列表 |

## 6. 路由跳转

| 目标页面 | 参数 | 触发 |
|------|------|------|
| `../bidDetail/bidDetail` | `id` | 点击列表项查看详情 |
