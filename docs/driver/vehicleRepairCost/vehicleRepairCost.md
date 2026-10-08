# vehicleRepairCost - 车辆维修成本登记/编辑

## 页面概述
司机端车辆维修/保养成本登记页面，用于记录自有车辆的保养费用和修理费用。区分保养(type=2)和修理(type=1/3)两种场景，支持附件和付款截图上传。

## 数据状态
| 字段 | 类型 | 说明 |
|------|------|------|
| vehicleData | Array | 自有车辆列表 |
| repairTypeData | Array | 维修类型字典（REPAIR_TYPE） |
| payModeData | Array | 结算方式字典（VEHICLE_REPAIR_PAY_MODE） |
| info | Object | 维修成本表单数据 |
| fileList | Array | 附件列表 |
| receiptsList | Array | 付款截图列表 |
| disabled | Boolean | 审核通过后禁用编辑 |

## 生命周期
- **onLoad({id})**: 初始化静态数据，若传入id则为编辑模式查询详情

## 功能模块

### 1. 基本信息
- **车牌号**: picker 选择自有车辆
- **备注**: 文本输入
- **费用类型**: 保养/修理/其他（REPAIR_TYPE字典）
- **结算方式**: picker 选择结算方式

### 2. 保养信息（repairType==2时显示）
- 保养费用、保养日期、下次保养日期、下次保养里程

### 3. 修理费用信息（repairType==1 或 ==3时显示）
- 日期、项目名称、金额
- 供应商名称、维修联系人、维修电话

### 4. 附件上传
- van-uploader，最多6张

### 5. 付款截图上传
- 上传后自动识别付款单号 `recognizeReceiptNumber`
- 提示支持微信/支付宝等支付方式的单号

### 6. 数据提交
- `submit()`: 调用 `vehicleRepairCostService.saveOrUpdateVehicleRepairCost`

## API 接口
| Bean | 方法 | 说明 |
|------|------|------|
| resVehicleInfoTF | queryAllVehicleNoPage | 查询所有自有车辆 |
| vehicleWaybillCostService | getPlateNumer | 获取当前绑定车牌 |
| vehicleRepairCostService | queryVehicleRepairCostInfoById | 查询维修成本详情 |
| vehicleRepairCostService | saveOrUpdateVehicleRepairCost | 保存/更新维修成本 |
| vehicleRepairCostService | recognizeReceiptNumber | 识别付款单号 |
| commonTF | getSysStaticDataByCodeTypes | 获取字典数据 |
| fileCommonTF | doQuery | 查询文件信息 |

## 路由导航
- 从 `vehicleRepairCostList` 点击新增/编辑跳入
- 提交成功后 navigateBack

## 注意事项
- 审核通过（verifyState==1）后全局禁用编辑
- 切换费用类型时清空相关字段（fee/feeDate/nextMaintenanceDate/nextMaintenanceMileage）
- 保养和修理的费用信息展示逻辑不同
- 付款截图识别失败时直接return不加入列表
