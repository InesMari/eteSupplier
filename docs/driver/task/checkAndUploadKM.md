# checkAndUploadKM - 车辆点检与里程上传

## 页面概述
司机端车辆点检/里程上传页面，功能核心且复杂。支持三种模式：接单出车(type=1)、中途点检、收车(type=3)。包含里程照片上传（支持拍照带水印）、点检项目评分、异常拍照等功能。提交后会回调来源页面的 `receive` 方法。

## 数据状态
| 字段 | 类型 | 说明 |
|------|------|------|
| info | Object | 车辆点检基础信息（含 checkList 点检清单） |
| ticketList | Array | 里程表照片列表 |
| startMileageList | Array | 出车里程照片（收车模式回显） |
| abnormalList | Array | 异常项照片列表 |
| disabled | Boolean | 已提交后禁用编辑 |
| showFinish | Boolean | 是否显示提交成功页 |
| workNodeId | String | 作业节点ID（收车模式用） |
| showUnPassAlert | Boolean | 审核不通过弹窗 |

## 生命周期
- **onLoad({waybillId, workNodeId, type, id})**: 
  - 传入 id 时加载已有记录（只读模式）
  - 传入 waybillId 时查询基础信息并获取点检项列表
- **onShow()**: 检查 `app.globalData.cameraImage`，从拍照页返回时接收图片和识别的里程数

## 功能模块

### 1. 基本信息展示
- 派车单号、线路名称、车牌号、司机姓名、挂车号码

### 2. 里程照片上传（核心）
- type != 3 时：上传出车里程表照片 + 输入公里数
- 拍照模式: `toCamera()` 跳转 `/pages/camera/camera`，拍照后自动识别里程数水印
- 普通上传: van-uploader 直接上传
- `usePhoto()`: 接收拍照页返回的带水印图片，自动填充识别的里程数
- type == 3 时：显示出车里程（只读）+ 上传收车里程照片

### 3. 车辆点检清单
- 动态获取点检项列表（根据 type 不同）
- 每个点检项：显示序号、名称和检查要求（rich-text 富文本）
- **正常/异常** 单选切换（van-radio-group）
- 异常时：上传异常照片 + 填写备注
- 提交前：校验里程照片必须上传

### 4. 提交处理
- 调用 `resVehicleInfoTF.submitVehicleCheck` 提交点检数据
- **防重复提交**: 设置 disabled=true，2秒后恢复
- type==1（接单出车）: 提交后回调上一页（todoTasks/truckingDetail/orderDetail）的 `receive` 方法
- type==3（收车）: 调用 `opWorkNode` 完成节点操作，返回上一页

## API 接口
| Bean | 方法 | 说明 |
|------|------|------|
| resVehicleInfoTF | getVehicleCheckInfo | 根据ID查询点检详情 |
| resVehicleInfoTF | getVehicleCheckBaseInfo | 查询点检基础信息 |
| resVehicleInfoTF | getVehicleCheckList | 获取点检项列表 |
| resVehicleInfoTF | submitVehicleCheck | 提交点检数据 |
| miniProgramDriverTF | opWorkNode | 完成作业节点操作 |

## 路由导航
- 接收参数：waybillId, workNodeId, type, id
- 拍照页：`/pages/camera/camera`
- 提交成功回调后 navigateBack

## 注意事项
- type 决定模式：1=接单出车, 2=中途点检, 3=收车
- 拍照上传是核心功能，自动识别里程数水印填充输入框
- 提交后通过 `getCurrentPages()` 找到上一页并调用其 `receive` 方法
- 已提交记录所有字段 disabled 不可修改
