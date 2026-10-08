# orderList - 订单包列表

## 页面概述
司机端订单包列表页，展示可供领取的订单计划，支持线路模糊搜索和分页加载。点击列表项进入详情页，也可直接在列表页弹窗领单。

## 数据状态
| 字段 | 类型 | 说明 |
|------|------|------|
| list | Array | 订单计划列表 |
| page | Number | 当前页码 |
| hasNext | Boolean | 是否有下一页 |
| isRefresh | Boolean | 刷新动画状态 |
| info.searchKey | String | 搜索关键字（线路） |
| info.queryType | Number | 查询类型=1 |
| showDialog | Boolean | 领单弹窗显示 |
| planId | String | 当前操作的订单ID |
| planCount | Number | 领取数量 |
| iptDisabled | Boolean | 是否禁用数量输入 |
| planUnCount | Number | 剩余计划数 |

## 生命周期
- **onShow()**: 每次显示时重新查询 `doQuery(true)`

## 功能模块

### 1. 模糊搜索
- 按线路关键字搜索，300ms 防抖

### 2. 列表展示
- 线路名称、计划单位、起始时间、结束时间、剩余计划数
- 往返订单标记 `orderType==2`

### 3. 领单弹窗
- `showDialog`: 点击领单按钮弹出，显示剩余计划数和可领取数量
- 单次只能领1单，完成之前不可再领
- `claimOrder`: 获取定位后调用 `claimOrderPlan` 领单

### 4. 定位与授权
- 获取GPS定位进行百度坐标转换
- 定位失败时引导用户开启定位权限

### 5. 分页加载
- 滚动到底部加载更多
- 顶部下拉刷新

## API 接口
| Bean | 方法 | 说明 |
|------|------|------|
| miniProgramDriverTF | queryPlanListPage | 分页查询订单计划 |
| miniProgramDriverTF | claimOrderPlan | 领单 |

## 路由导航
- 点击列表项 → `/driver/orderPackage/orderDetail/orderDetail?planId=`
- 领单成功 → navigateBack

## 注意事项
- 定位失败时提示授权或检查系统GPS
- 单次只能领1单，未完成前不可再领
