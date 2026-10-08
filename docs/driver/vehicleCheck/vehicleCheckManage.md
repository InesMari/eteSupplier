# vehicleCheckManage - 车辆点检管理列表

## 页面概述
司机端车辆点检记录管理列表页，查看所有已提交的车辆点检记录。支持按状态筛选（全部/待确认/待跟进/已确认已处理）和模糊搜索。

## 数据状态
| 字段 | 类型 | 说明 |
|------|------|------|
| active | Number | Tab激活索引 |
| info.keyStr | String | 搜索关键字 |
| info.type | Number | 类型=1（查询类型） |
| info.state | String | 状态筛选（空=全部, 0=待确认, 1=待跟进, 2=已确认已处理） |
| list | Array | 点检记录列表 |
| page | Number | 当前页码 |
| hasNext | Boolean | 是否有下一页 |
| isRefresh | Boolean | 刷新动画状态 |

## 生命周期
- **onShow()**: 每次显示时重新查询 `doQuery(true)`

## 功能模块

### 1. Tab筛选
- 全部 / 待确认 / 待跟进 / 已确认已处理
- `onChange`: 切换Tab更新 `info.state`

### 2. 模糊搜索
- 按关键字搜索，300ms 防抖

### 3. 列表展示
- 线路名称、审核状态（带颜色区分）
- 派车单号、车牌号码、挂车号码、提交日期

### 4. 查看详情
- `toDetail`: 点击列表项跳转 `vehicleCheckDetail?id=`

### 5. 分页加载
- 滚动到底部加载更多，顶部下拉刷新

## API 接口
| Bean | 方法 | 说明 |
|------|------|------|
| resVehicleInfoTF | queryVehicleCheckPage | 分页查询车辆点检记录 |

## 路由导航
- 点击列表项 → `../vehicleCheckDetail/vehicleCheckDetail?id=`

## 注意事项
- 审核状态颜色区分：state0(待确认), state1(待跟进), state2(已确认已处理)
- 搜索框placeholder："输入关键字模糊搜索"
