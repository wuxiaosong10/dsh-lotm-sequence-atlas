# 诡秘十序列 · DSH 桌面插件

独立插件 `dsh-lotm-sequence-atlas`，当前版本 **1.2.4**。提供占卜家途径序列9至0的十套主题，与现有 `dsh-gradually-themes` 共存。

| 序列 | 场景 | 配色 |
|---|---|---|
| 9 占卜家 | 黄水晶灵摆 | 夜青、月铜、青色 |
| 8 小丑 | 独自献花 | 象牙白、雾青、绯红 |
| 7 魔术师 | 雾霾中的屋顶 | 雾麦灰绿、梅紫 |
| 6 无面人 | 格尔曼提箱登船 | 靛海蓝、古铜、冰青 |
| 5 秘偶大师 | 木偶双手、腕肘随牵丝动作 | 墨绿、旧金 |
| 4 诡法师 | 戴莉最后一舞，幻梦渐散 | 灰玫、旧铜、雾青 |
| 3 古代学者 | 特莉丝带伤站立 | 青瓷、旧金 |
| 2 奇迹师 | 梅林与许愿机 | 奶杏、孔雀蓝、铜金 |
| 1 诡秘侍者 | 帷幕后乌托邦 | 紫幕、冷翠、月粉 |
| 0 愚者 | 克莱恩成神，空无斗篷与面容成形 | 深雾银、旧金、灰蓝 |

## 当前功能

插件使用DSH原生React设置插槽和主题令牌，在通用设置中提供十个图片按钮、内容清晰度及关闭图标。首次安装默认关闭，选中后保存本机偏好。

十套主题均使用本地静音视频。戴莉播放结束停留尾帧，重新选中后重播；其他序列循环。视频加载失败时使用静态图，切换主题释放旧播放器，后台暂停、返回后继续。愚者保留独立取景参数。

侧栏采用细框、角饰、眼纹分隔和原创中文字标。四个主导航使用原创写实藏品图标，并根据明暗主题调整光影。图片加载失败时显示 Tabler 线性图标。标题使用宋体，正文使用系统中文字体，代码保持等宽。正文、代码、执行结果和输入框共用中轴；代码区保留ANSI颜色。

设置弹窗、当前选中项、主题缩略图边框和开关跟随所选序列配色；关闭主题后撤销插件样式。回复、思考与执行过程、输入框使用不同内容面，清晰与均衡两档分别调整透明度。人物场景分别调整背景焦点与顶部留位，静态图和视频共用定位；小窗口恢复覆盖取景，愚者保留原有独立构图。立柱、角饰、眼纹及原有素材保持完整。

主题启用时，原生导航文案替换为塔罗会、封印物、秘偶、亵渎石板和成神途径；用户输入、消息及会话名称保留。关闭后恢复宿主原有文案、明暗偏好和插件自己的样式状态；切换回Gradually主题时交还控制。

资源通过58条固定本地路由提供，包括20张场景及缩略图 WebP、4张透明 WebP 导航图标、6张透明PNG、18枚SVG图标和10段MP4。已移除不再使用的小丑旧版静态图；当前小丑使用 `sequence-8-light.webp` 和对应缩略图。

## 安装与运行

本插件面向DSH桌面端，不是独立网页服务。入口为 `lib/index.js`、`lib/client.js`，注册配置为 `cordis.patch.yml`。

公开仓库：[wuxiaosong10/dsh-lotm-sequence-atlas](https://github.com/wuxiaosong10/dsh-lotm-sequence-atlas)。安装到已有DSH profile时，可使用：

```powershell
dsh plugin --profile desktop add github:wuxiaosong10/dsh-lotm-sequence-atlas
```

需要固定安装版本时，在仓库标识末尾加 `#<commit-sha>`；profile名称按实际环境替换。

本机安装位置为 `%USERPROFILE%\.dsh\profiles\desktop\node_modules\dsh-lotm-sequence-atlas`。当前安装目录通过junction指向本项目，因此 `lib/` 与 `assets/` 是实际运行文件，必须保留。修改源代码后先构建，再由DSH正常重载插件；无需重装其他主题。

项目不保留安装包。在另一台电脑安装时，先按下文生成包，再按该DSH版本的本地插件安装方式导入，并使用包内的 `cordis.patch.yml` 注册。

### 配置、权限与卸载

主题及内容清晰度通过插件设置选择并保存本地偏好，不需要单独配置模型或API Key。

插件使用宿主的主题、语言、渲染和设置服务，修改界面样式与导航文案，并注册58条本地资源路由。Host从本插件的固定素材白名单读取文件，图片和视频均由本地提供。

关闭主题会恢复宿主原有文案和明暗偏好。卸载时，在DSH插件管理中移除此插件及对应的bundle安装项；原有Gradually主题可继续使用。

## 开发与打包

运行入口声明Node.js 18以上；开发和测试依赖jsdom 29，要求Node.js `^20.19.0`、`^22.13.0` 或 `>=24.0.0`。`package-lock.json` 固定当前依赖。

在项目根目录执行：

```powershell
npm ci
npm test
npm run build
npm run check
```

需要分发安装包时，可将产物输出到项目外：

```powershell
npm pack --pack-destination "$env:TEMP"
```

`npm test` 是正式回归测试，覆盖主题状态、可读性、资源路由、视频范围请求、原生界面和生命周期。`scripts/build.mjs` 从 `src/` 生成 `lib/`。发布包仅包含 `lib/`、`assets/`、注册配置、README及第三方许可，不包含设计稿、开发依赖或测试产物。

`node_modules/` 只在本地开发和测试时由 `npm ci` 生成，当前仅含开发依赖。日常运行插件不需要此目录。

## 保留的目录

| 目录 | 用途 |
|---|---|
| `src/` | 可维护的插件源代码 |
| `lib/` | DSH实际加载的构建文件 |
| `assets/` | 当前图片、视频、图标及来源、许可、哈希清单 |
| `scripts/` | 构建脚本 |
| `tests/` | 正式回归测试 |

项目不保留设计原稿、历史安装包、重复视频、截图、审核输出或临时脚本。素材清单中的Archived original仅记录制作来源名称，不是项目文件路径。

## 素材来源与许可

活动素材与SHA256见 [图片清单](https://github.com/wuxiaosong10/dsh-lotm-sequence-atlas/blob/main/assets/manifest.json)、[视频清单](https://github.com/wuxiaosong10/dsh-lotm-sequence-atlas/blob/main/assets/videos/manifest.json) 和 [装饰来源](https://github.com/wuxiaosong10/dsh-lotm-sequence-atlas/blob/main/assets/ornaments/sources.json)。必要参考来源已合并到图片清单，透明装饰原图保存在 `assets/ornaments/`。

图标为Tabler Icons Outline，作者Paweł Kuna及贡献者。原始SVG、固定版本来源与MIT许可分别保留在 [original目录](https://github.com/wuxiaosong10/dsh-lotm-sequence-atlas/tree/main/assets/icons/tabler/original/)、[sources.json](https://github.com/wuxiaosong10/dsh-lotm-sequence-atlas/blob/main/assets/icons/tabler/sources.json) 和 [LICENSE](https://github.com/wuxiaosong10/dsh-lotm-sequence-atlas/blob/main/assets/icons/tabler/LICENSE)，另见 [第三方声明](https://github.com/wuxiaosong10/dsh-lotm-sequence-atlas/blob/main/THIRD-PARTY-NOTICES.md)。

背景与装饰为同人生成素材，角色与作品权利属于原权利人，不附带官方授权。
