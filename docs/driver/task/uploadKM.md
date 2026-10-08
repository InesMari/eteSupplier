# uploadKM - 上传里程

## 页面概述
司机端上传车辆里程数页面，支持接单出车和收车两种操作模式。上传里程表照片和输入公里数后提交。

## 数据状态
| 字段 | 类型 | 说明 |
|------|------|------|
| info | Object | 里程信息（waybillId, waybillNum, mileage, driverOpType） |
| ticketList | Array | 里程表照片列表 |
| workNodeId | String | 作业节点ID（收车模式用） |
| isshowAlert | Boolean | 定位授权弹窗 |

## 生命周期
- **onLoad({waybillId, waybillNum, workNodeId, driverOpType})**: 接收运单信息，若无运单号则通过接口查询

## 功能模块

### 1. 表单
- 派车单号（展示）
- 公里数输入（数字类型）
- 里程表照片上传（最多1张，capture: ['camera']）

### 2. 提交处理
- `submit()`: 校验照片不能为空
- driverOpType==1（接单出车）: 获取定位 → 调用 `ordWaybillTF.addMileage` + `opWaybillLanding`
- driverOpType==2（收车）: 调用 `addMileage` + `opWorkNode`
- 接单成功后 navigateBack

### 3. 定位获取
- 接单出车时获取GPS定位并转换坐标系
- 定位失败时引导授权

## API 接口
| Bean | 方法 | 说明 |
|------|------|------|
| miniProgramDriverTF | loadReceiptsDataByWaybillId | 加载运单数据（含运单号） |
| ordWaybillTF | addMileage | 添加里程记录 |
| miniProgramDriverTF | opWaybillLanding | 接单出车 |
| miniProgramDriverTF | opWorkNode | 完成节点操作 |

## 路由导航
- 按钮文字根据 `driverOpType` 显示"接单出车"或"收车"
- 提交成功后 navigateBack

## 注意事项
- driverOpType 1=接单出车, 2=收车
- 接单出车需要获取GPS定位
- 仅支持拍照上传（capture: ['camera']）
