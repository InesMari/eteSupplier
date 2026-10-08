# capacityManager - 运力管理中心

## 1. 页面概述

- **路径**: `supplier/capacity/capacityManager/`
- **定位**: 供应商运力管理首页，支持图表/列表双模式查看、当前运力/历史运力切换
- **涉及文件**: `capacityManager.js`, `capacityManager.wxml`, `capacityManager.wxss`, `capacityManager.json`
- **依赖组件**: `van-tabs`, `van-search`, `van-swipe-cell`, `ec-canvas`(ECharts图表), `headerRemind`

## 2. 数据状态

| 字段 | 类型 | 说明 |
|------|------|------|
| `list` | Array | 运力列表 |
| `page` | Number | 分页页码 |
| `info` | Object | 筛选条件 (loadHistory, serchKey) |
| `isRefresh` | Boolean | 刷新状态 |
| `isshowChart` | Boolean | 是否显示图表模式 |
| `bar` | Object | 柱状图配置 |
| `pie` | Object | 饼图配置 |
| `barHis` | Object | 历史柱状图配置 |
| `schedule` | Object | 运力匹配统计数据 |
| `baseCityIdNames` | Array | 柱状图X轴城市名 |
| `matchCounts`/`unMatchCounts` | Array | 匹配/未匹配数量 |

## 3. 生命周期

- **`onShow`** → `initData()` → 根据 `loadHistory` 判断加载当前或历史数据

## 4. 功能模块

### 4.1 Tab 切换
- **当前运力 / 历史运力** 切换，通过 `onChange` 设置 `info.loadHistory`

### 4.2 图表/列表双模式
- `isshowChart` 控制显示图形或列表
- **图形模式**: 柱状图(各城市匹配/未匹配统计) + 饼图(整体匹配率)
- **列表模式**: 车辆卡片信息 (车牌、车型、车长、预计到达时间等)

### 4.3 ECharts 图表
- `initBarChart`: 按起始城市分组的匹配/未匹配柱状图
- `initPieChart`: 运力匹配率饼图
- `initHisBarChart`: 历史运力总数柱状图

### 4.4 运力统计
- 运力总数、未匹配数、已匹配数、匹配率

## 5. API 接口

| Bean | 方法 | 参数 | 说明 |
|------|------|------|------|
| `vehicleScheduleService` | `loadCylindricalDataGroupByBaseCity` | `{}`/`{loadHistory:1}` | 柱状图数据 |
| `vehicleScheduleService` | `queryVehicleScheduleData` | - | 运力匹配统计 |
| `vehicleScheduleService` | `queryVehicleSchedulePage` | `{...info, page}` | 运力分页列表 |

## 6. 路由跳转

| 目标页面 | 触发 |
|------|------|
| `../addCapacity/addCapacity` | 点击"上报运力" |
| `../capacityDetail/capacityDetail?id=` | 点击列表项 |
