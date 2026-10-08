# vehicleMonitor - 车辆监控地图

## 1. 页面概述

- **路径**: `supplier/vehicle/vehicleMonitor/`
- **定位**: 在地图上实时查看所有车辆位置
- **涉及文件**: `vehicleMonitor.js`, `vehicleMonitor.wxml`, `vehicleMonitor.wxss`, `vehicleMonitor.json`
- **依赖组件**: `van-search`, `map`(微信原生)

## 2. 数据状态

| 字段 | 类型 | 说明 |
|------|------|------|
| `latitude` / `longitude` | Number | 地图中心坐标(默认北京) |
| `markers` | Array | 地图标注点 |
| `vehicleData` | Array | 车辆位置数据 |
| `params` | Object | 搜索参数 (plateNumber) |

## 3. 功能模块

### 3.1 车辆位置查询
- `vehicleMonitor` 查询车辆GPS数据

### 3.2 地图渲染
- `initMap` 将车辆数据转换为地图 markers
- 坐标转换: `bMapTransQQMap` (百度→腾讯坐标系转换)
- 每个 marker 显示车牌号标签
- `includePoints` 自动调整视野包含所有车辆

### 3.3 搜索
- 搜索车牌号后重新查询并渲染

## 4. API 接口

| Bean | 方法 | 参数 | 说明 |
|------|------|------|------|
| `miniProgramWaybillTF` | `vehicleMonitor` | `{plateNumber}` | 获取车辆位置数据 |

## 5. 注意事项
- 使用百度坐标系转腾讯坐标系 (`bMapTransQQMap`)
- 初始默认定位在北京
