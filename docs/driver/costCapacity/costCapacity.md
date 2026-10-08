# costCapacity - 运力成本登记/编辑

## 页面概述
司机端运力成本登记页面，用于记录车辆运营过程中的各类费用，支持新增和编辑模式。审核通过后禁止修改。

## 数据状态
| 字段 | 类型 | 说明 |
|------|------|------|
| vehicleData | Array | 自有车辆列表 |
| feeTypeData | Array | 费用类型（油费/燃气费/电费/路桥费/维修费等） |
| costPayData | Array | 支付类型（垫付/补能） |
| info | Object | 成本表单数据 |
| fileList | Array | 附件列表 |
| receiptsList | Array | 付款截图列表 |
| disabled | Boolean | 审核通过后禁用编辑 |
| tip | Array | 各费用类型的单位提示 ['升','次','克','次','次'] |
| vehicleIndex | Number | 当前选中的车辆索引 |
| feeTypeIndex | Number | 费用类型索引 |
| costPayIndex | Number | 支付类型索引 |

## 生命周期
- **onLoad({id})**: 初始化静态数据（车辆列表、费用类型字典），若传入 id 则进入编辑模式查询详情
- **initStaticData()**: 获取自有车辆列表、当前绑定车牌号、费用类型/支付类型字典

## 功能模块

### 1. 费用登记表单
- **车牌号选择**: picker 选择自有车辆
- **费用类型**: 油费(1)、燃气费(6)、电费(7)时额外显示支付类型（垫付/补能）
- **日期选择**: mode="date" 日期选择器
- **数量/单位/金额**: 数字输入，单位根据费用类型自动填充
- **备注**: 文本输入（油费需登记油品，路桥费需登记起止路线）

### 2. 附件上传
- `afterRead`: van-uploader 上传附件，最多6张，调用 `util.uploadFile`
- 编辑模式下回显已有附件，通过 `fileCommonTF.doQuery` 查询

### 3. 付款截图上传
- `afterReadReceipt`: 上传付款截图后自动调用 `recognizeReceiptNumber` 识别付款单号
- 支持微信/支付宝等支付方式，需清晰显示转账单号

### 4. 数据提交
- `submit()`: 调用 `vehicleWaybillCostService.saveOrUpdateVehicleWaybillCost` 保存
- 提交前校验附件不能为空

## API 接口
| Bean | 方法 | 说明 |
|------|------|------|
| resVehicleInfoTF | queryAllVehicleNoPage | 查询所有自有车辆 |
| vehicleWaybillCostService | getPlateNumer | 获取当前绑定车牌 |
| vehicleWaybillCostService | queryVehicleWaybillCostInfoById | 查询成本详情 |
| vehicleWaybillCostService | saveOrUpdateVehicleWaybillCost | 保存/更新成本 |
| vehicleWaybillCostService | recognizeReceiptNumber | 识别付款单号 |
| commonTF | getSysStaticDataByCodeTypes | 获取字典数据 |
| fileCommonTF | doQuery | 查询文件信息 |

## 路由导航
- 从 `costCapacityList` 点击新增/编辑跳入
- 提交成功后 `wx.navigateBack` 返回上一页

## 注意事项
- 审核通过（verifyState==1）后表单禁用编辑
- 费用类型切换时自动更新单位和重置支付类型
- 付款截图上传失败时（receiptNumber为空）会直接 return 不加入列表
