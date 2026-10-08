# eteSupplier · 易迁易（供应商版）

> 一款面向物流供应链上下游的微信小程序双端平台，把"供应商找活干活"和"司机接单跑车"装进同一个 App。

`eteSupplier`（项目代号"易迁易"）是一套基于微信生态的轻量化移动协同解决方案，定位为 **"供应商 + 司机"双角色一站式掌上业务工具**。同一小程序内按登录身份自动分流：供应商（货主/承运方）负责运输、零担、运力、竞价、器具、作业登记与财务结算；司机负责接单执行、车辆点检、成本上报与回单打印，两端数据实时联动。

---

## 一、产品定位

- **面向客户**：物流企业、承运商、供应商车队及其自有/外协司机。
- **面向用户角色**：供应商管理员、调度员、司机、车辆管理员、财务人员。
- **核心价值**：
  - 双端合一：一个 App 承载供应商端与司机端，登录后按 `userType`（1 供应商 / 2 司机 / 3 双重身份）自动分流，双重身份可随时切换。
  - 业务闭环：从竞价抢单、派车调度、作业登记到回单上传、运费转账，全流程手机端完成。
  - 车队数字化：车辆档案、车辆监控、车辆点检、变动成本与修理成本上报，司机端后台持续定位。
  - 现场作业工具化：拍照识别二维码（jsqr）、蓝牙标签打印机打印回单标签、上传单据与公里数。

---

## 二、核心能力一览

| 能力 | 简介 |
| --- | --- |
| 双角色登录 | 一个账号体系，供应商 / 司机 / 双重身份三种身份自动分流与切换 |
| 派车调度 | 派车单管理、作业点顺序调整、选择司机派车 |
| 零担业务 | 零担派车、运作上报、单据上传的独立流程 |
| 运力管理 | 运力调度、上报运力、车辆监控、竞价管理与竞价 |
| 作业登记 | 作业登记（管理 / 操作 / 详情 / 汇总），器具登记、回收与整理 |
| 司机任务 | 待办任务、历史任务、上传单据、公里数上传、打印回单标签 |
| 车辆管理 | 车辆档案、新增车辆、车辆点检、变动成本、修理成本上报 |
| 消息与财务 | 消息中心、银行卡绑定（含转账非本人承诺函）、运费查询、员工管理 |
| 安全保障 | RSA 密码加密、SHA1 网关签名、登录态 403 强制回落登录页 |

---

## 三、业务模块全景

小程序采用 **微信小程序原生分包加载架构**（`app.json` 中的 `subpackages`），主包承载登录与首页，两个业务子包分别对应供应商端与司机端。

### 1. 主包（`pages`）

| 页面 | 作用 |
| --- | --- |
| `preserve` | 启动中转页：校验登录态（`wxUserTF.checkLogin`），未登录跳引导页 |
| `guideIndex` | 引导页（"供应商版易迁易"） |
| `login` / `resetPsw` / `forgetPsw` | 账号密码登录（RSA 加密）、设置新密码、忘记密码 |
| `index` | 双角色首页：按 `userType` 分流进入供应商端 / 司机端，双重身份可切换 |
| `registerDriver` | 司机注册 |
| `protocol` / `agreement` | 注册协议、业务协议 |
| `camera` | 自定义拍照 + jsqr 二维码识别 |

### 2. 供应商端（`supplier`，44 个页面）

- **运输管理**（`transport`）：运输管理总览、派车单详情、作业点信息、调整作业点顺序、派车-选择司机。
- **零担业务**（`ld`）：零担业务、零担派车、派车单详情、上传单据、运作上报。
- **司机管理**（`driver`）：司机管理、司机信息、新增司机。
- **车辆管理**（`vehicle`）：车辆管理、新增车辆、车辆信息、车辆监控。
- **运力调度**（`capacity`）：运力调度、上报运力、运力详情。
- **竞价管理**（`bid`）：竞价管理、竞价。
- **器具管理**（`device`）：器具登记、器具回收 / 整理（新增、详情、记录）。
- **作业登记**（`jobReg`）：作业登记（管理、操作、详情、汇总详情）。
- **消息管理**（`msg`）：消息管理、消息。
- **个人中心**（`personal`）：个人信息、供应商信息、银行卡（列表 / 新增 / 详情）、转账非本人承诺函、运费、员工管理、新增员工。

### 3. 司机端（`driver`，22 个页面）

- **任务执行**（`task`）：待办任务、历史任务、派车单详情、调整作业点顺序、上传单据、上传公里数、车辆点检、打印回单标签、短驳配送详情。
- **订单包**（`orderPackage`）：订单包业务、订单包详情。
- **点检管理**（`vehicleCheck`）：点检管理、车辆点检。
- **成本上报**（`costCapacity` / `vehicleRepairCost`）：车辆变动成本、车辆修理成本（列表 / 编辑）。
- **车辆管理**（`vehicle`）：车辆管理、新增车辆、车辆信息。
- **个人信息**（`personal`）：司机信息、个人信息。

> 每个页面的功能说明在 `docs/` 目录下有对应 Markdown 文档（如 `docs/pages/login.md`、`docs/driver/task/todoTasks.md`，共 93 篇），与页面一一对应，可对照查阅。

---

## 四、接口与服务约定

小程序所有后端能力均通过统一网关访问，调用入口位于 `utils/util.js`。**前端不直接耦合具体接口 URL**，而是通过 *Bean 名称 + 方法名* 间接调用，便于后端服务演进与灰度。

### 4.1 网关与运行环境

| 环境 | 触发条件 | 网关地址 |
| --- | --- | --- |
| 开发版 | 微信开发者工具 → 编译模式 = 开发 | `https://wxapp-t.ete56.cn/intf?` |
| 体验版 | 微信后台标记为体验版 | `https://wxapp-t.ete56.cn/intf?` |
| 正式版 | 线上 release | `https://wxapp.1000e56.com/intf?` |

> 网关识别通过 `__wxConfig.envVersion` 自动切换，无需业务代码手动改地址。

### 4.2 主要调用方式

`util.postByBeanName(beanName, methodName, param, successFun, errorFun, postType, showLoading)`

- `beanName`：后端服务 Bean 名（字符串）。
- `methodName`：该 Bean 暴露的方法名。
- `param`：请求参数对象，`{}` 表示无参。
- `successFun / errorFun`：可选回调（同时返回 Promise）。
- `postType`：请求方式（默认 POST）。
- `showLoading`：是否显示全局 loading（默认 `true`）。

辅助调用：

- `util.postByCode(inCode, param, successFun, errorFun, postType)`：通过接口编码（`inCode`）调用，适合面向业务编码已稳定的接口。
- `util.uploadFile(file)`：文件上传（`fileCommonTF.doUpload`），签名规则一致。

### 4.3 安全与签名

- **应用标识**：`WXAPP`。
- **签名机制**：将 `[intfKey, tokenId, time, rd, JSON.stringify(content)]` 排序后拼成数组字符串，经 `sha.js` 计算 SHA1 得到 `sign`。
- **加密**：登录密码经 `jsencrypt.min.js` RSA 公钥加密；GET 链接使用 `md5.js` 签名（`signUrl`）。
- **密钥管理**：内置 `intfKey`（见 `utils/util.js`），用于构造签名，**请勿在公网仓库泄露**，建议接入后端下发的动态密钥机制。
- **登录态**：`tokenId` 由响应自动写入 storage；**响应 status 403 时强制 `reLaunch` 回登录页**，501 及其他错误自动弹窗。

### 4.4 主要后端 Bean

| Bean | 用途 |
| --- | --- |
| `wxUserTF` | 登录 / 登录态校验（`programType: 2` 标识本小程序） |
| `miniProgramDriverTF` | 司机端业务 |
| `miniProgramWaybillTF` | 待办 / 历史任务（`queryWaybillListPage`） |
| `fileCommonTF` | 文件上传（`doUpload`） |

### 4.5 接口约定建议（新增业务时）

1. **优先使用 Bean + MethodName 形式**，避免直接拼接 `inCode` 路径。
2. **统一在 `param` 中传递业务主键**（如 `orgId / userId`），由后端在网关层注入。
3. **页面层只关心业务结果**，分页、loading、错误提示由 `util` 统一处理。
4. **新增模块前先在 `app.json` 中注册子包**（`subpackages` 数组），避免主包体积膨胀。

---

## 五、项目结构

```
eteSupplier/
├─ app.js / app.json / app.wxss   # 小程序入口与全局配置（全局注册 15 个 Vant 组件）
├─ pages/                         # 主包页面（启动、引导、登录、密码、首页、司机注册、协议、拍照）
├─ common/                        # 公共资源
│  ├─ commonImport.js             # 统一导出 util / common / regeneratorRuntime / wxApi
│  ├─ components/                 # 自定义组件（alert、datetimepicker、header-remind、
│  │                              #   monthPicker、popover、region-picker）
│  ├─ wxApi/                      # 微信 API promisify 二次封装
│  ├─ wxs/                        # 页面级脚本片段
│  ├─ css/                        # 全局样式
│  └─ images/                     # 公共图片资源（含各银行卡片图标）
├─ utils/                         # 工具方法
│  ├─ util.js                     # 接口网关封装（postByBeanName / postByCode / 上传）
│  ├─ common.js                   # 通用工具（判空、经纬度转换、大图路径等）
│  ├─ md5.js / sha.js / jsencrypt.min.js / base64.js   # 加密
│  ├─ qrcode.js / jsqr(miniprogram_npm)                # 二维码生成与识别
│  ├─ qqmap-wx-jssdk.js           # 腾讯地图 SDK
│  └─ lpapi-ble/                  # 蓝牙标签打印机 SDK
├─ miniprogram_npm/               # npm 构建产物（@vant/weapp、jsqr）
├─ icons/                         # logo 与自绘底导航图标
├─ supplier/                      # 供应商端子包（44 个页面）
├─ driver/                        # 司机端子包（22 个页面）
├─ docs/                          # 93 篇页面功能说明文档（与页面一一对应）
├─ project.config.json            # 微信开发者工具项目配置
├─ sitemap.json                   # 站内搜索配置
├─ jsconfig.json                  # JavaScript 智能提示配置
├─ package.json                   # 依赖（@vant/weapp、jsqr）
└─ package-lock.json
```

---

## 六、技术栈

| 类别 | 选型 |
| --- | --- |
| 运行平台 | 微信小程序（基础库 3.13.0 及以上） |
| 开发语言 | 原生 JavaScript（ES6+） |
| UI 组件库 | [`@vant/weapp`](https://youzan.github.io/vant-weapp/) 1.0（全局注册 15 个组件） |
| 扫码识别 | `jsqr`（配合自定义相机页 `pages/camera`） |
| 地图 | `qqmap-wx-jssdk`（腾讯地图） |
| 蓝牙打印 | `lpapi-ble`（蓝牙标签打印机 SDK，打印回单标签） |
| 加密 | `sha.js`（SHA1 签名）/ `md5.js` / `jsencrypt.min.js`（RSA） |
| 包管理 | npm（构建产物位于 `miniprogram_npm/`） |
| 接口调用 | 自研 `util.postByBeanName` / `util.postByCode` 网关封装 |
| 工具链 | 微信开发者工具 + PostCSS |

---

## 七、版本与更新说明

- **当前版本**：`1.0.0`（`package.json`）。
- **AppID**：`wx137b39626ebda80c`（`project.config.json`）。
- **版本管理**：
  - 小程序自身使用微信 `getUpdateManager` 检测新版本并提示用户重启（`app.js`）。
  - `preloadRule` 已配置登录页预下载 `supplier` 子包，加快供应商端首屏。
- **权限声明**：
  - `requiredBackgroundModes: ["location"]` —— 司机端后台持续定位。
  - `requiredPrivateInfos`：`getLocation` / `startLocationUpdateBackground` / `onLocationChange` / `startLocationUpdate`。
  - `permission`：`scope.userLocation`（位置展示）、`scope.bluetooth`（蓝牙打印机）。
- **兼容性**：建议在 **微信 8.0+** 客户端运行以获得完整能力。

---

## 八、常见问题（FAQ）

**Q1：供应商和司机为什么要用同一个小程序？**
A：供应链上下游协同频繁，双端合一降低推广与维护成本。登录后按账号 `userType` 自动分流（1 供应商 / 2 司机 / 3 双重身份），双重身份用户可在首页随时切换视角。

**Q2：司机端如何持续上报位置？**
A：小程序声明了后台定位（`requiredBackgroundModes: ["location"]`），司机执行任务期间可持续上报轨迹；请在系统设置中允许"使用小程序期间/后台"定位权限。

**Q3：打印回单标签需要什么硬件？**
A：支持蓝牙标签打印机。`utils/lpapi-ble/` 内置打印 SDK，在司机端"打印回单标签"页面连接打印机即可；需授予蓝牙权限（`scope.bluetooth`）。

**Q4：扫码为什么不用微信原生扫码？**
A：项目使用自定义相机页（`pages/camera`）+ `jsqr` 完成拍照识别二维码，便于在拍照与识别之间复用同一张图片（通过 `globalData.cameraImage` 传递）。

**Q5：如何处理登录态过期？**
A：`tokenId` 存储在本地 storage；后端返回 `status: 403` 时，`util` 会清空登录态并 `reLaunch` 回登录页，无需页面手动处理。

**Q6：后端接口会变吗？**
A：通过 `util.postByBeanName(beanName, methodName, ...)` 调用的接口由后端服务在网关层暴露，Bean 与方法名变更时需要在变更日志中同步说明，便于前端联调。

**Q7：每个页面的详细功能说明在哪里？**
A：`docs/` 目录下共 93 篇 Markdown 文档，与页面路径一一对应（如 `docs/supplier/transport/...`），新增页面时建议同步补充文档。

---

## 九、贡献与迭代指南

1. **业务扩展**：供应商端页面放 `supplier/`，司机端页面放 `driver/`，公共页面放主包 `pages/`，并同步注册 `app.json`。
2. **公共能力**：可复用 UI 放进 `common/components/`，微信 API 二次封装放进 `common/wxApi/`，通用工具放进 `utils/`。
3. **接口扩展**：与后端约定新的 `beanName` / `methodName`，复用 `util.postByBeanName` 入口；新的加解密策略先在 `utils/util.js` 抽象再使用。
4. **文档同步**：新增 / 修改页面时同步更新 `docs/` 下对应 Markdown。
5. **代码风格**：ES6+；优先使用 `async/await` 处理异步；统一从 `common/commonImport.js` 引入公共模块。
6. **测试与体验**：核心流程覆盖：登录 → 身份分流 → 供应商派车 / 司机接单 → 上传单据 / 打印回单 → 退出。
7. **发布前自检**：
   - `project.config.json` 中 `appid` 与发布小程序一致；
   - 后台定位、蓝牙等隐私能力已在 `requiredPrivateInfos` / `permission` 中声明；
   - 主包 + 两个子包体积合规、无未引用页面残留。

---

## 十、版权与联系

- **项目名称**：eteSupplier（易迁易 · 供应商版）
- **归属**：仅用于内部协作与对外介绍，请勿在未授权情况下用于商业分发。
- **问题反馈**：通过公司内部协作平台（项目群 / 需求管理工具）提交。
- **维护团队**：本 README 由项目组共同维护，更新时请同步至 `CHANGELOG.md`。

---

> 文档版本：v1.0 · 最近更新：2026-10-08
