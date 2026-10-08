# bidDetail - 竞价详情/报价页

## 1. 页面概述

- **路径**: `supplier/bid/bidDetail/`
- **定位**: 查看竞价详情并填写报价信息提交
- **涉及文件**: `bidDetail.js`, `bidDetail.wxml`, `bidDetail.wxss`, `bidDetail.json`
- **依赖组件**: `van-icon`, `van-uploader`, `wxs/format.wxs`

## 2. 数据状态

| 字段 | 类型 | 说明 |
|------|------|------|
| `info` | Object | 竞价详情对象，含 `baseInfo`, `dtls`, `bidFiles`, `requirements`, `secFiles` |

## 3. 生命周期

- **`onLoad`** → 根据 `id` 调用 `getBidQuoteDetail` → 启动1秒倒计时定时器

## 4. 功能模块

### 4.1 竞价倒计时
- 页面加载后启动 `setInterval(1000)` 每秒更新倒计时
- 使用 `countDown` 方法计算剩余天/时/分/秒

### 4.2 竞价详情展示
- 按 `rfqQuoteType` 展示不同类型：
  - **Type 1 (整车)**: 线路信息、运费单价、点位费
  - **Type 2 (零担)**: 区间报价
  - **Type 3 (仓配)**: 单价金额报价
  - **Type 4 (批量询价)**: 上传附件报价

### 4.3 报价填写
- 明细输入: `inputSetDataDefaultDetail` 设置 dtls 数组中的字段
- 账期输入: `inputSetDataDefault` 设置 baseInfo 字段
- 日期选择: `bindDateChange` 设置生效/失效时间

### 4.4 文件上传下载
- `afterRead`: 上传附件（批量询价类型）
- `download`: 下载并预览招标方附件（支持 pdf/xls/doc/pic）
- `delFile`: 删除已上传附件

### 4.5 联系方式
- `callPhone`: 拨打联系人电话

### 4.6 提交与取消
- `submit`: 调用 `saveBidQuote` 提交报价，成功后返回
- `cancel`: 二次确认后调用 `cancelBidQuote` 取消竞价

## 5. API 接口

| Bean | 方法 | 参数 | 说明 |
|------|------|------|------|
| `bidQuoteTF` | `getBidQuoteDetail` | `{id}` | 获取竞价详情 |
| `bidQuoteTF` | `saveBidQuote` | `this.data.info` | 保存报价 |
| `bidQuoteTF` | `cancelBidQuote` | `{bidId}` | 取消竞价 |
| `util.uploadFile` | - | `file` | 上传文件 |

## 6. 注意事项
- 定时器 `setInterval` 在页面销毁时需要清理（当前未清理，可能内存泄漏）
- 点位费在 `billingType==5` 时显示为 `--` 不可编辑
