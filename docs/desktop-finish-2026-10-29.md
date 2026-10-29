# 桌面外观实施与验收

用户确认的视觉目标为第二张绯红玻璃修订稿，后续以最新反馈覆盖局部：十序列分别配色；取消宝座门头；人物内移；所有内容统一居中；侧栏按 Gradually 的现有结构；统计读数移到页签右侧。

## 依据

- 已查看确认稿：`C:/Users/DELL/.codex/generated_images/01a1864b-d4e7-7430-bd6e-faa3946dd366/exec-a825acec-6e1c-455b-9759-bf249f0977db.png`。
- 已读本机 `D:/代码/dsh-gradually-themes/lib/client.js` 的侧栏、统计与皮肤清理实现；保留原插件文件、九个风格及存储。
- 已读用户指定的 `C:/Users/DELL/.dsh/skins/maid-atelier/{skin.json,skin.css,patches.css,hooks.mjs}`，仅研究装饰与内容分层。未复制其女仆、蕾丝等素材或整套实现。
- 真实 DSH 0.2.1-rc.3 的 ASAR 确认了 ConversationRoot 不透明底色、容器边距、composer 原生包裹层、Shiki CSS 变量及统计 DOM。

## 实现

- 10 套场景图与缩略图，深浅色、侧栏、代码背景和语法色同步切换。
- 内容使用同一个 740px 最大宽度和左右对称边距；清除输入包裹层额外边距，代码与执行框使用 border-box。
- 新会话控件恢复完整行；不再将其子元素字号清零，图标显式 17px、文字 13px，解除原标签遮罩。
- 统计栏保留原 React DOM 位置，只使用自有属性和 CSS 坐标定位；测量紧凑形态和实际页签组，避免把整行宽度误判为控件占用。
- 统计更新不触发侧栏测量；流式执行内容不触发侧栏或统计的无关布局。关闭、切回旧主题及卸载恢复自有节点、样式与属性。
- 固定白名单资源路由，20 张 WebP 和 1 张透明柱图。宝座门头已退出运行资源，保留在 design/ornaments/rejected-throne-crest.png 作为被否决设计记录。

## 验证

- `npm run build`、`npm test`（37 项）、`npm run check` 通过。
- Open Code Review delegate 完整覆盖 18/18 可审代码文件；已修复旧样式前景色干扰、流式输出重复测量、整行页签碰撞和原统计宽度误判。
- 浏览器使用已安装 DSH 的原始 CSS 与同构 DOM 夹具量测：正文、代码、执行和输入四处左右边界及宽度一致，统计栏处于 header 模式，无页面横向溢出。夹具不是 DSH 桌面实际运行验收的替代。
- 桌面最终可见状态单独记录在项目 `design-qa.md`；不能以构建或夹具结果代替桌面截图。

## 安装与恢复

已安装到 `C:/Users/DELL/.dsh/profiles/desktop`，依赖通过 junction 指向本项目，bundle 注册为 `dsh-lotm-sequence-atlas`。原九种 Gradually 依赖、bundle 和客户端文件保留。安装前备份位于 `D:/Codex-Recovery/2026-10-29-lotm-desktop-install-191752`，外观修订前 patch 备份位于 `D:/Codex-Recovery/2026-10-29-lotm-finish-203918`。
