# jobReg - 作业登记

## 1. 页面概述

- **路径**: `supplier/jobReg/jobReg/`
- **定位**: 对作业单进行登记操作，填写客户、数量、上传凭证
- **涉及文件**: `jobReg.js`, `jobReg.wxml`, `jobReg.wxss`, `jobReg.json`
- **依赖组件**: `popover`(客户选择弹窗), `van-uploader`, `van-icon`, `wxs/format.wxs`

## 2. 数据状态

| 字段 | 类型 | 说明 |
|------|------|------|
| `info` | Object | 作业单基本信息 |
| `customerDetailList` | Array | 客户明细列表（多客户） |
| `customerData` / `customerDataCache` | Array | 可选客户列表 |
| `operaterCertificateList` | Array | 操作凭证图片 |
| `scenePictureList` | Array | 现场图片 |
| `digit` | Boolean | 单位是否含"吨"（决定 input 类型） |

## 3. 生命周期

- **`onLoad({id})`** → `doQuery(id)` 加载作业单详情和客户列表

## 4. 功能模块

### 4.1 作业信息展示
- 作业单号、物流中心、费用类型、作业名称、单位、要求作业日期

### 4.2 图片上传
- 操作凭证: 最多5张
- 现场图片: 最多5张

### 4.3 客户管理
- 支持动态添加/删除客户行
- 弹窗搜索并选择客户
- 输入登记数量（单位含"吨"则使用 `digit` 键盘）
- 实时合计数量

### 4.4 提交
- 二次确认后提交 `saveOrUpdateWorkOrderForWechat`

## 5. API 接口

| Bean | 方法 | 参数 | 说明 |
|------|------|------|------|
| `workOrderService` | `loadWorkOrderByIdForWechat` | `{id}` | 加载作业单详情 |
| `customerTF` | `queryCustomerListNoPage` | - | 获取客户列表 |
| `workOrderService` | `saveOrUpdateWorkOrderForWechat` | `info` | 保存登记 |

## 6. 注意事项
- 图片 type 需要清空为 undefined 否则回显有问题
