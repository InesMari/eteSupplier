# deviceHome - 器具管理首页

## 1. 页面概述

- **路径**: `supplier/device/deviceHome/`
- **定位**: 器具管理模块入口，提供4个功能入口（回收记录、新增回收、整理记录、新增整理）
- **涉及文件**: `deviceHome.js`, `deviceHome.wxml`, `deviceHome.wxss`, `deviceHome.json`

## 2. 数据状态

无特殊数据状态，纯导航页。

## 3. 生命周期

- `onLoad` 无特殊逻辑

## 4. 功能入口

| 入口 | 目标页面 | 说明 |
|------|------|------|
| 器具回收记录 | `deviceRecoveryHis` | 查看所有器具回收记录 |
| 新增器具回收 | `deviceRecovery` | 新增器具回收登记 |
| 器具整理记录 | `deviceArrangeHis` | 查看所有器具整理记录 |
| 新增整理登记 | `deviceArrange` | 登记整理信息 |
