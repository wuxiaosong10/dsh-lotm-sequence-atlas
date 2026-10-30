# 诡秘动态背景实施计划

1. 修改 tests/host.test.mjs、tests/client.test.mjs：先验证缺失的 MP4 路由、字节范围和播放器生命周期产生失败。
2. 修改 src/host.mjs、src/catalog.mjs：增加固定视频资源与有效范围响应，通过路由测试。
3. 修改 src/client.js、src/styles.mjs：单播放器、静音循环、失败回退、切换/卸载释放、后台暂停、继承既有构图与遮罩，通过生命周期测试。
4. npm test、npm run build、npm run check；同构浏览器和已安装 DSH 实际运行验证。必要时通过正常重新加载插件刷新宿主路由与客户端。
5. open-code-review 完整覆盖本轮代码；追加日记和验收记录，选定本轮文件提交 main，不包含之前未跟踪的 design 素材。

自检：固定路径映射不接收请求路径；视频上层保留可读性遮罩；旧媒体异步事件不得操作新媒体；不修改其他插件或保存的序列偏好。任务均针对本轮范围。
