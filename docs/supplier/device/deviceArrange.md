# deviceArrange - 新增器具整理登记

## 1. 页面概述

- **路径**: `supplier/device/deviceArrange/`
- **定位**: 登记器具整理信息，选择作业点、器具、客户，上传附件
- **涉及文件**: `deviceArrange.js`, `deviceArrange.wxml`, `deviceArrange.wxss`, `deviceArrange.json`
- **依赖组件**: `popover`(器具选择弹窗), `van-icon`, `van-uploader`

## 2. 数据状态

| 字段 | 类型 | 说明 |
|------|------|------|
| `info` | Object | 表单数据 (clearUpDate, workId, remark, deviceList) |
| `deviceList` | Array | 可选器具列表 |
| `deviceListCache` | Array | 器具缓存（搜索用） |
| `tenantList` | Array | 客户列表 |
| `receiptsList` | Array | 上传的附件列表 |

## 3. 功能模块

### 3.1 作业点选择
- 选择作业点后自动查询该点的器具列表和客户列表

### 3.2 器具管理
- 支持动态添加/删除多个器具行
- 通过弹窗搜索并选择器具名称，自动回显规格
- 输入器具数量

### 3.3 客户选择
- 每个器具行可选择对应客户

### 3.4 附件上传
- 使用 `van-uploader` 上传说收附件

### 3.5 保存
- 二次确认后提交，数据不可修改

## 4. API 接口

| Bean | 方法 | 参数 | 说明 |
|------|------|------|------|
| `storeHouseBizTF` | `queryStoreHouseList` | - | 获取作业点列表 |
| `deviceBaseService` | `queryOutDeviceInfoListForCust` | `{workId}` | 获取某作业点器具列表 |
| `wmsTenantTF` | `queryArrivalManufacturerTenantList` | `{workId}` | 获取某作业点客户 |
| `deviceRecordService` | `saveOutDeviceClearUpRecordForCust` | `info` | 保存整理记录 |
