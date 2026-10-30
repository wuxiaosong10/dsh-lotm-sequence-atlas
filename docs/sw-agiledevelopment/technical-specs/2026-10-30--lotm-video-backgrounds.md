# 诡秘动态背景技术规范

沿用 src/catalog.mjs、src/client.js、src/styles.mjs 和 src/host.mjs。catalog 每序列增加固定 videos/sequence-N.mp4。host 在原23个固定路径外增加10个视频路径，返回 video/mp4、Accept-Ranges，支持单一 bytes 范围206、无效范围416和HEAD，路径不参与文件拼接。

client 在现有背景节点内维护单一 video，muted/defaultMuted、autoplay、loop、playsInline，固定无交互。playing 事件后才显示，error 或 play 拒绝时回到静态图。CSS 保持原图的宽度、偏移和中心裁切，video 上方使用现有阅读遮罩。序列切换清空旧 src、load 并移除节点；可见性改变只控制当前有效播放器，卸载清理监听。阅读清晰度只改变样式。

验收通过 Node 单元测试覆盖路由真实文件/范围、切换竞态/失败/释放/后台行为；构建和语法检查；浏览器同构夹具检查当前时间递增、视频定位与遮罩；本机 DSH 检查加载和播放。遵循 main，保留旧素材，记录 Obsidian，完成 open-code-review 后提交。
