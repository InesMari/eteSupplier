# addStaff - 新增/编辑员工

## 1. 页面概述

- **路径**: `supplier/personal/staff/addStaff/`
- **定位**: 新增或修改员工信息，按 type 区分模式
- **涉及文件**: `addStaff.js`, `addStaff.wxml`, `addStaff.wxss`, `addStaff.json`
- **依赖组件**: `van-field`, `van-cell-group`

## 2. 数据状态

| 字段 | 类型 | 说明 |
|------|------|------|
| `type` | String | 0=新增, 1=修改, 2=详情 |
| `info` | Object | 员工表单数据 |
| `psSee` / `cpsSee` | Boolean | 密码可见性 |
| `pswCanSet` | Boolean | 是否允许修改密码 |

## 3. 功能模块

### 3.1 三种模式
- **新增** (type=0): 空表单填写
- **修改** (type=1): 加载员工数据，密码默认隐藏为 '000000'
- **详情** (type=2): 只读模式，无密码字段

### 3.2 密码管理
- 密码可见性切换
- 修改模式下点击密码框弹出确认清空提示
- 提交时 RSA 加密密码

### 3.3 提交
- 新增: `addStaff`
- 修改: `updateStaff`
- 密码一致性校验

## 4. API 接口

| Bean | 方法 | 参数 | 说明 |
|------|------|------|------|
| `wxUserTF` | `getStaff` | `{staffId}` | 加载员工信息 |
| `wxUserTF` | `addStaff` | `info` | 新增员工 |
| `wxUserTF` | `updateStaff` | `info` | 修改员工 |
