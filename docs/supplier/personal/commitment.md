# commitment - 转账非本人承诺函

## 1. 页面概述

- **路径**: `supplier/personal/commitment/`
- **定位**: 查看"转账非本人承诺函"协议内容
- **涉及文件**: `commitment.js`, `commitment.wxml`, `commitment.wxss`, `commitment.json`

## 2. 功能

- `onLoad` 调用 `getSupplierDetailInfoMini` 获取供应商信息（名称、身份证号、地址、联系方式）
- 展示完整的承诺函协议文本，含甲乙方信息和6条协议条款

## 3. API 接口

| Bean | 方法 | 参数 | 说明 |
|------|------|------|------|
| `supplierTF` | `getSupplierDetailInfoMini` | - | 获取供应商信息 |
