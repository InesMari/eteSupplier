# deviceRecovery - 新增器具回收登记

## 1. 页面概述

- **路径**: `supplier/device/deviceRecovery/`
- **定位**: 登记器具回收信息，选择来源地/交付地、器具、客户，上传附件
- **涉及文件**: `deviceRecovery.js`, `deviceRecovery.wxml`, `deviceRecovery.wxss`, `deviceRecovery.json`
- **依赖组件**: `popover`(器具选择弹窗), `van-icon`, `van-uploader`

## 2. 数据状态

| 字段 | 类型 | 说明 |
|------|------|------|
| `info` | Object | 表单数据 (reoveryDate, srcWorkId, destWorkId, remark, deviceList) |
| `custWorkList` | Array | 来源地列表 |
| `houseList` | Array | 交付地（作业点）列表 |
| `deviceList` / `deviceListCache` | Array | 可选器具列表 |
| `tenantList` | Array | 客户列表 |
| `receiptsList` | Array | 附件列表 |

## 3. 功能模块

### 3.1 来源地/交付地选择
- 来源地从 `custWorkList` 选择
- 交付地选择后自动加载该点的器具和客户列表

### 3.2 器具管理
- 支持动态添加/删除器具行
- 弹窗搜索并选择器具，自动回显规格
- 输入器具数量，选择客户

### 3.3 附件上传与保存
- 上传回收凭证附件
- 二次确认后提交

## 4. API 接口

| Bean | 方法 | 参数 | 说明 |
|------|------|------|------|
| `deviceContractService` | `queryCustWorkInfo` | - | 获取来源地列表 |
| `storeHouseBizTF` | `queryStoreHouseList` | - | 获取交付地列表 |
| `deviceBaseService` | `queryOutDeviceInfoListForCust` | `{workId}` | 获取器具列表 |
| `wmsTenantTF` | `queryArrivalManufacturerTenantList` | `{workId}` | 获取客户列表 |
| `deviceRecordService` | `saveOutDeviceReoveryRecordForCust` | `info` | 保存回收记录 |

## 5. 与 deviceArrange 的差异
- 回收需要选择"来源地"和"交付地"两个地点
- 整理了需要选择"作业点"一个地点
