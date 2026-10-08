# driverDetail - 司机资料详情

## 页面概述
司机端个人资料查看页，纯展示页面，以只读方式展示司机的身份证和驾驶证信息，包括证件照片和详细信息。

## 数据状态
| 字段 | 类型 | 说明 |
|------|------|------|
| info | Object | 司机详细信息 |
| idCardFrontList | Array | 身份证正面照片列表 |
| idCardBackList | Array | 身份证背面照片列表 |
| driverLicenceFrontList | Array | 驾驶证正面照片列表 |
| driverLicenceBackList | Array | 驾驶证背面照片列表 |

## 生命周期
- **onLoad()**: 从本地缓存获取 userInfo，根据 driverId 调用 `driverTF.queryDriverInfoById` 查询司机详情

## 功能模块

### 1. 证件照片展示
- 身份证：正面 / 背面（uploader 只读模式）
- 驾驶证：正面 / 背面（uploader 只读模式）

### 2. 司机信息展示
- 司机姓名、手机号
- 身份证号、驾驶证号
- 准驾车型、发证机关
- 驾驶证有效期限（起止日期）
- 所有字段均为 `disabled="true"` 只读

## API 接口
| Bean | 方法 | 说明 |
|------|------|------|
| driverTF | queryDriverInfoById | 根据ID查询司机详情 |

## 路由导航
- 从 `personal` 页跳入 → `../driverDetail/driverDetail`
- 返回按钮 → navigateBack

## 注意事项
- 纯展示页面，无编辑功能
- 证件图片使用 `deletable="{{false}}"` 禁止删除
