# personal - 司机个人中心

## 页面概述
司机端个人中心页面，展示当前登录用户信息，提供资料管理和退出登录功能。页面简洁，主要作为功能入口。

## 数据状态
| 字段 | 类型 | 说明 |
|------|------|------|
| userInfo | Object | 当前用户信息（从本地缓存获取） |

## 生命周期
- **onLoad()**: 从 `wx.getStorageSync('userInfo')` 获取用户信息

## 功能模块

### 1. 用户信息展示
- 用户头像背景图
- 用户名显示
- "资料管理" 入口按钮（箭头图标）

### 2. 资料管理
- `toDetail()`: 跳转到 `driverDetail` 查看驾照/身份证详情

### 3. 退出登录
- `toLogout()`: 调用 `wxUserTF.logout` 接口
- 清除本地 `userInfo` 缓存
- 重定向到引导页 `/pages/guideIndex/guideIndex`

## API 接口
| Bean | 方法 | 说明 |
|------|------|------|
| wxUserTF | logout | 退出登录 |

## 路由导航
- 资料管理 → `../driverDetail/driverDetail`
- 退出登录 → `wx.reLaunch` 到 `/pages/guideIndex/guideIndex`

## 注意事项
- 退出登录使用 `reLaunch` 关闭所有页面
- 本地缓存 `userInfo` 在退出时清空
