# historyTasks - 历史任务列表

## 页面概述
司机端历史任务查看页，展示已完成的运单记录，支持按日期/月份筛选、模糊搜索和分页加载。区分普通运单和短驳配送。

## 数据状态
| 字段 | 类型 | 说明 |
|------|------|------|
| list | Array | 历史运单列表 |
| page | Number | 当前页码 |
| hasNext | Boolean | 是否有下一页 |
| isRefresh | Boolean | 刷新动画状态 |
| info.searchKey | String | 搜索关键字 |
| info.queryType | Number | 查询类型=2（历史任务） |
| info.startDateType | Number | 日期类型=2 |
| info.startDate | String | 筛选日期（默认当前月） |
| dateTypeList | Array | 日期类型选项 [按日期, 按月份] |
| dateTypeIndex | Number | 日期类型索引 |
| orderNumbers | Number | 总订单数 |

## 生命周期
- **onLoad()**: 设置默认日期为当前月，执行 `doQuery(true)`

## 功能模块

### 1. 日期筛选
- 按日期/按月份切换（picker）
- 按日期：选择具体日期（date picker）
- 按月份：自定义 monthPicker 组件
- 切换日期类型时自动更新日期值
- 支持清空日期条件

### 2. 模糊搜索
- 按派车单号/客户名称/线路名称/车型搜索，300ms 防抖

### 3. 列表展示
- 总订单数统计
- 每条记录：线路名称、运输车辆（车牌+车型+车长）、派车单来源、运作/送达时间
- 短驳配送(dispatchType==9) 显示"要求送达时间"

### 4. 详情跳转
- 短驳配送 → `/driver/task/shortBarge/shortBarge?waybillId=`
- 普通运单 → `/driver/task/truckingDetail/truckingDetail?waybillId=`

### 5. 分页加载
- 滚动到底部加载更多
- 顶部下拉刷新

## API 接口
| Bean | 方法 | 说明 |
|------|------|------|
| miniProgramWaybillTF | queryDriverWaybillListPage | 分页查询司机运单列表 |

## 路由导航
- 短驳配送 → `shortBarge`
- 普通运单 → `truckingDetail`

## 注意事项
- queryType=2 表示查询历史任务
- 默认展示当前月份的记录
- 总订单数从分页接口返回
