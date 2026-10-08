# vehicleCheckDetail - 车辆点检详情（查看）

## 页面概述
司机端车辆点检记录详情查看页（只读模式），展示已完成点检的出车/收车里程照片、出车点检和收车点检结果。

## 数据状态
| 字段 | 类型 | 说明 |
|------|------|------|
| info | Object | 点检详情（含 startCheckList/endCheckList/waybillNum/routeName/plateNumber/driverName 等） |
| startMileageList | Array | 出车里程表照片 |
| endMileageList | Array | 收车里程表照片 |
| disabled | Boolean | 始终为 true（只读模式） |

## 生命周期
- **onLoad({id})**: 根据点检记录ID查询详情 `doQuery(id)`

## 功能模块

### 1. 基本信息
- 派车单号、线路名称、车牌号、司机姓名、挂车号码

### 2. 出车里程
- 出车里程表照片 + 公里数（只读）

### 3. 收车里程
- 收车里程表照片 + 公里数（只读）

### 4. 出车点检信息
- 点检项目列表，每项显示：序号+名称+检查要求（rich-text）
- 正常/异常单选结果（disabled）
- 异常项：异常照片 + 备注
- 出车点检备注

### 5. 收车点检信息
- 同出车点检，展示收车点的检查结果
- 收车点检备注

## API 接口
| Bean | 方法 | 说明 |
|------|------|------|
| resVehicleInfoTF | getVehicleCheckInfo | 根据ID查询点检详情 |

## 路由导航
- 从 `vehicleCheckManage` 列表点击进入
- 参数：id（点检记录ID）

## 注意事项
- 纯只读查看模式，disabled=true 全局禁用编辑
- 于 `checkAndUploadKM` 不同，此页面用于查看已完成的点检记录
- 点检内容通过 rich-text 渲染富文本格式
