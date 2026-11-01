# 诡秘十序列 · DSH 桌面插件

独立插件 `dsh-lotm-sequence-atlas`，当前版本 **1.2.4**。提供占卜家途径序列9至0的十套主题，与现有 `dsh-gradually-themes` 共存。

| 序列 | 场景 | 配色 |
|---|---|---|
| 9 占卜家 | 黄水晶灵摆 | 深夜蓝、月铜、青色 |
| 8 小丑 | 独自献花 | 象牙白、雾青、绯红 |
| 7 魔术师 | 雾霾中的屋顶 | 雾麦灰绿、梅紫 |
| 6 无面人 | 格尔曼提箱登船 | 深海蓝、古铜、冰青 |
| 5 秘偶大师 | 木偶双手、腕肘随牵丝动作 | 墨绿、旧金 |
| 4 诡法师 | 戴莉最后一舞，幻梦渐散 | 暮金、灰玫、青铜 |
| 3 古代学者 | 特莉丝带伤站立 | 青瓷、旧金 |
| 2 奇迹师 | 梅林与许愿机 | 奶杏、孔雀蓝、铜金 |
| 1 诡秘侍者 | 帷幕后乌托邦 | 紫幕、冷翠、月粉 |
| 0 愚者 | 克莱恩成神，空无斗篷与面容成形 | 深雾银、旧金、灰蓝 |

## 当前功能

插件使用DSH原生React设置插槽和主题令牌，在通用设置中提供十个图片按钮、内容清晰度及关闭图标。首次安装默认关闭，选中后保存本机偏好。

十套主题均使用本地静音视频。戴莉播放结束停留尾帧，重新选中后重播；其他序列循环。视频加载失败时使用静态图，切换主题释放旧播放器，后台暂停、返回后继续。愚者保留独立取景参数。

侧栏采用细框、角饰、眼纹分隔和原创中文字标。图标统一为Tabler Outline，标题使用宋体，正文使用系统中文字体，代码保持等宽。正文、代码、执行结果和输入框共用中轴；代码区保留ANSI颜色。

主题启用时，原生导航文案替换为塔罗会、封印物、秘偶、亵渎石板和成神途径；用户输入、消息及会话名称保留。关闭后恢复宿主原有文案、明暗偏好和插件自己的样式状态；切换回Gradually主题时交还控制。

资源通过54条固定本地路由提供：20张活动WebP、6张透明PNG、18枚SVG图标、10段MP4。已移除不再使用的小丑旧版静态图；当前小丑使用 `sequence-8-light.webp` 和对应缩略图。

## 安装与运行

本插件面向DSH桌面端，不是独立网页服务。入口为 `lib/index.js`、`lib/client.js`，注册配置为 `cordis.patch.yml`。

本机安装位置为 `%USERPROFILE%\.dsh\profiles\desktop\node_modules\dsh-lotm-sequence-atlas`。当前安装目录通过junction指向本项目，因此 `lib/` 与 `assets/` 是实际运行文件，必须保留。修改源代码后先构建，再由DSH正常重载插件；无需重装其他主题。

`output/` 仅保留最新发布包 `dsh-lotm-sequence-atlas-1.2.4.tgz` 及其SHA256校验文件。在另一台电脑安装时，按该DSH版本的本地插件安装方式导入该包，并使用包内的 `cordis.patch.yml` 注册；不要把单独一张背景图当作完整插件。

## 开发与打包

运行入口声明Node.js 18以上；开发和测试依赖jsdom 29，要求Node.js `^20.19.0`、`^22.13.0` 或 `>=24.0.0`。`package-lock.json` 固定当前依赖。

在项目根目录执行：

```powershell
npm ci
npm test
npm run build
npm run check
npm pack --pack-destination output
```

`npm test` 是正式回归测试，覆盖主题状态、可读性、资源路由、视频范围请求、原生界面和生命周期。`scripts/build.mjs` 从 `src/` 生成 `lib/`。发布包仅包含 `lib/`、`assets/`、注册配置、README及第三方许可，不包含设计稿、开发依赖或测试产物。

## 保留的目录

| 目录 | 用途 |
|---|---|
| `src/` | 可维护的插件源代码 |
| `lib/` | DSH实际加载的构建文件 |
| `assets/` | 当前图片、视频、图标及来源、许可、哈希清单 |
| `design/` | 十套当前背景原稿、选定视觉参考和必要的制作来源记录 |
| `scripts/` | 构建脚本 |
| `tests/` | 正式回归测试 |
| `output/` | 唯一最新发布包，已被Git忽略 |

历史安装包、未选候选、重复视频原片、截图、审核JSON、旧规格和一次性验证脚本已移出项目。素材清单中的previous或旧制作路径仅记录历史来源，不是运行依赖。

## 素材来源与许可

活动素材与SHA256见 [图片清单](assets/manifest.json)、[视频清单](assets/videos/manifest.json) 和 [装饰来源](assets/ornaments/sources.json)。当前背景原稿保留在 `design/`，透明装饰原图直接保存在 `assets/ornaments/`。

图标为Tabler Icons Outline，作者Paweł Kuna及贡献者。原始SVG、固定版本来源与MIT许可分别保留在 [original目录](assets/icons/tabler/original/)、[sources.json](assets/icons/tabler/sources.json) 和 [LICENSE](assets/icons/tabler/LICENSE)，另见 [第三方声明](THIRD-PARTY-NOTICES.md)。

背景与装饰为同人生成素材，角色与作品权利属于原权利人，不附带官方授权。
