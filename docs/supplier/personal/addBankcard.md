# addBankcard - 添加银行卡

## 1. 页面概述

- **路径**: `supplier/personal/addBankcard/`
- **定位**: 添加/绑定银行卡，支持OCR识别银行卡信息
- **涉及文件**: `addBankcard.js`, `addBankcard.wxml`, `addBankcard.wxss`, `addBankcard.json`
- **依赖组件**: `van-uploader`, `van-field`, `van-radio-group`, `van-checkbox`

## 2. 数据状态

| 字段 | 类型 | 说明 |
|------|------|------|
| `info` | Object | 银行卡表单数据 |
| `bankList` | Array | 开户行枚举 |
| `isIndividual` | Boolean | 是否个体供应商（只能对私账户） |
| `commitmentChecked` | Boolean | 是否勾选承诺函 |

## 3. 功能模块

### 3.1 银行卡 OCR 识别
- 上传银行卡照片后自动识别 `bankCardNumber` 和 `bankName`
- 自动匹配开户行到 `bankList` 枚举

### 3.2 表单填写
- 开户卡号、开户行、支行名称
- 银行卡类型: 对公/对私（个体供应商仅对私）
- 开户手机号、开户名字
- 对公: 纳税人识别号；对私: 身份证号

### 3.3 承诺函
- 对私账户且开户名与供应商名不一致时，需勾选"转账非本人承诺函"

### 3.4 提交
- 调用 `addBankInfo` 绑定银行卡

## 4. API 接口

| Bean | 方法 | 参数 | 说明 |
|------|------|------|------|
| `commonTF` | `getSysStaticDataByCodeTypes` | `{codeType:"BANK_DEPOSIT"}` | 获取开户行枚举 |
| `supplierTF` | `getSupplierDetailInfoMini` | - | 获取供应商身份证号 |
| `supplierTF` | `getSupplierTypeById` | - | 判断是否个体供应商 |
| `bankTF` | `getBankCardInfoOCR` | `{fileId}` | OCR 识别银行卡 |
| `bankTF` | `addBankInfo` | `info` | 绑定银行卡 |
