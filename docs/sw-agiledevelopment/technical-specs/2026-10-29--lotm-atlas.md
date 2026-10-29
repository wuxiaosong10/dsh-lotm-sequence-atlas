# 诡秘十序列 · 技术设计
包名dsh-lotm-sequence-atlas，宿主id lotm-sequence-atlas。包根目录为当前工作区，保留design。客户端window.__ModuleLoader__.load工厂，require宿主React，inject theme/slots/locale。不修改Gradually包。
src目录：catalog.mjs十主题；core.mjs可测纯函数（状态、颜色、令牌、CSS）；client.js插件工厂模板；assets十张WebP与小缩略图。lib/client.js构建后单模块，lib/index.js宿主静态GET路由，限白名单文件，使用ctx.webServer.register及ctx.effect。
状态localStorage独立key dsh-lotm-sequence-atlas/v1，默认关闭，安装验收后选占卜家。保存enabled/sequence/readability。有效值9..0与native，无效值安全关闭。新主题overrideTokens disposer始终替换旧层；只临时强制document color-scheme与host theme预期时保留原preference，关闭恢复。退出释放effect、监听、slot、DOM与样式。
排版：保留原应用布局。全屏pointer-events:none背景；聊天左文字列连续的同色不透明/高浓度表面，右侧让人物透出；正文、表格、工具结果、代码、终端、输入、弹出层分别精确适配，避免通配*覆盖语法色/状态。现有九套重新应用时通过明确插件间DOM事件或样式竞争检测让当前主动选择者获胜，禁止改它的存储或源码。
安装：备份本机profile package/lock/cordis.patch与相关状态记录，pnpm add link:项目；追加bundle/loader条目幂等不覆盖无关配置。重载宿主之后真实设置点击验证。无需重启正在运行的后端任务。

