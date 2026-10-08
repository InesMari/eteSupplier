# waySort - 作业点排序

## 页面概述
司机端作业点顺序调整页面，以拖拽/数字输入方式调整运单中各作业点的执行顺序（首位和末位不可移动）。

## 数据状态
| 字段 | 类型 | 说明 |
|------|------|------|
| list | Array | 作业点列表（从上级页面传入） |
| waybillId | String | 运单ID |

## 生命周期
- **onLoad({info, waybillId})**: 接收URL编码的作业点列表JSON数据，解码后展示

## 功能模块

### 1. 作业点列表展示
- 显示作业点类型（提货/卸货/提卸货）及对应图标
- 作业点名称和地址
- 序号输入框（number类型）

### 2. 序号调整
- `numIpt`: 直接输入序号修改作业点顺序
- 首项(index==0)和末项(index==list.length-1)的输入框 disabled

### 3. 提交
- `submit()`: 调用 `adjustmentWorkOrder` 保存新的作业点顺序

## API 接口
| Bean | 方法 | 说明 |
|------|------|------|
| miniProgramWaybillTF | adjustmentWorkOrder | 调整作业点顺序 |

## 路由导航
- 从 `truckingDetail` 进入
- 参数 info 为 URL 编码的 workList JSON 字符串
- 提交成功后 navigateBack

## 注意事项
- 首尾作业点不可调整（固定起始点和终点）
- 仅当 workList.length > 2 时才显示排序入口
