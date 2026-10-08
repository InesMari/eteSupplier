# supplierDetail - 供应商资料详情

## 1. 页面概述

- **路径**: `supplier/personal/supplierDetail/`
- **定位**: 查看供应商基本资料和营业执照（只读）
- **涉及文件**: `supplierDetail.js`, `supplierDetail.wxml`, `supplierDetail.wxss`, `supplierDetail.json`
- **依赖组件**: `van-uploader`, `van-field`

## 2. 数据状态

| 字段 | 类型 | 说明 |
|------|------|------|
| `info` | Object | 供应商资料 |
| `businessLicenseImg` | Array | 营业执照图片 |

## 3. 功能

- `onLoad` 从 storage 获取 `tenantId`，调用 `getSupplierDetailInfo` 加载
- 展示: 营业执照、名称、类型、地址、联系人、联系电话、是否开票
- 所有字段只读

## 4. API 接口

| Bean | 方法 | 参数 | 说明 |
|------|------|------|------|
| `supplierTF` | `getSupplierDetailInfo` | `{tenantId}` | 获取供应商资料 |
