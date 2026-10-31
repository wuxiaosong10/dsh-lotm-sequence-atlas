// Read-only browser fixture using the installed host's CSS and DOM contracts.
// It is a layout test surface, not an alternative DSH frontend.
import fs from 'node:fs';
import http from 'node:http';
import {THEMES} from '../src/catalog.mjs';
import {createAssetRoutes} from '../src/host.mjs';
const root=new URL('../',import.meta.url);
const fd=fs.openSync('D:/deepseek/resources/app.asar','r'),head=Buffer.alloc(16);
fs.readSync(fd,head,0,16,0);
const json=Buffer.alloc(head.readUInt32LE(12));fs.readSync(fd,json,0,json.length,16);
const archive=JSON.parse(json.toString()),offset=8+head.readUInt32LE(4);
let hostCss='';
for(const name of ['ui-layout','ui-sidebar','ui-conversation','ui-chat','ui-workspace']){
 let node=archive;
 for(const part of `dsh/node_modules/@deepseek-ai/dsh-client-${name}/lib/client.js`.split('/'))node=node.files[part];
 const data=Buffer.alloc(node.size);fs.readSync(fd,data,0,data.length,offset+Number(node.offset));
 for(const match of data.toString().matchAll(/const css\$?\d* = ("(?:[^"\\]|\\.)*")/g)){
  try{hostCss+=JSON.parse(match[1])+'\n';}catch{}
 }
}
fs.closeSync(fd);
const routes=new Map(createAssetRoutes().map(route=>[route.path,route]));
const bootstrap=theme=>`<script>
localStorage.setItem('dsh-lotm-sequence-atlas/v1',JSON.stringify({sequence:${JSON.stringify(theme.id)},readability:'clear'}));
let currentTokens={},preference=${JSON.stringify(theme.dark?'dark':'light')};
window.__ModuleLoader__={load(def){const api=def.factory(()=>({createElement(){return null}}));api.apply({
effect(fn){fn()},on(){return()=>{}},locale:{register(){return()=>{}}},slots:{inject(name,fn){return fn()},register(){return()=>{}}},
theme:{getTheme(){return{preference,active:{colorScheme:preference,tokens:currentTokens}}},setTheme(id){preference=id},overrideTokens(source,pairs){currentTokens=Object.fromEntries(Object.entries(pairs).map(([name,pair])=>[name,pair[preference]]));for(const [name,value]of Object.entries(currentTokens))document.documentElement.style.setProperty(name,value);return()=>{}}}
})}};
</script><script src="/client.js"></script>`;
const html=theme=>`<!doctype html><html data-lotm-atlas="${theme.id}"><head><meta charset="utf-8"><style>${hostCss}
html,body,#root{height:100%;margin:0}*{box-sizing:border-box}button{font:inherit;color:inherit}header{color:inherit}#root{--dsh-content-font-size:14px;--dsh-content-font-delta:0px;--dsh-composer-stack-gap:8px;--dsh-composer-dock-inset:8px}.mP3x-q_frame{grid-template-columns:260px minmax(0,1fr)}aside>div{height:100%;display:flex;flex-direction:column}.host_panelList{display:grid}.host_panelRow{display:flex;align-items:center;border:0;background:transparent;text-align:left}.host_logoRow{display:flex;align-items:center}.host_sessionRow,.host_projectRow{display:flex;align-items:center}.host_time{margin-left:auto}.host_sectionHeader{display:flex;align-items:center;margin-top:16px}.host_title{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.mP3x-q_centerCol,.mP3x-q_centerCol > div{height:100%}.an3WzG_header{min-height:86px}.host_tabs{grid-column:1/-1;display:flex;height:28px;margin-top:10px}.host_viewTabs{display:flex;gap:24px}.host_tab{font-size:13px}pre{white-space:pre;overflow:auto}.fixture-readout{display:flex;gap:10px;align-items:center;color:${theme.muted};font-size:12px}[data-composer-stat]{display:flex;gap:6px}.GRgSLq_card{padding:8px 12px 12px}.GRgSLq_root{min-height:130px}.xMeOpW_body{padding-block:8px}.md-code-block{margin-block:16px}.host_label{white-space:nowrap}.host_regionArea{flex:1;min-height:0;overflow:auto}.host_footArea{flex:none;padding-bottom:10px}.fixture-footer-actions{display:flex;justify-content:space-between;padding:4px 14px}.fixture-footer-actions button{display:grid;place-items:center;width:28px;height:28px;background:transparent;border:0;cursor:pointer}
</style><link rel="stylesheet" href="/theme.css?sequence=${theme.id}"></head><body><div id="root"><div class="mP3x-q_frame"><aside class="mP3x-q_sidebarCol"><div><div class="wtg9ga_logoRow"><button class="wtg9ga_brand" aria-label="新建会话"><span class="wtg9ga_brandIdentity"><span class="wtg9ga_brandMark"></span><span class="wtg9ga_brandName">deepseek HARNESS</span></span></button><button class="wtg9ga_iconButton" aria-label="收起侧栏"><span class="lotm-ui-icon" data-lotm-glyph="layout-sidebar"></span></button></div><button class="host_newSession" aria-label="新建会话"><span>新会话</span></button><nav class="host_panelList"><button class="host_panelRow">插件</button><button class="host_panelRow">自动化任务</button><button class="host_panelRow">任务看板</button></nav><div class="host_regionArea"><div class="host_sectionHeader"><span class="host_sectionLabel">工作区</span></div><div class="host_projectRow">诡秘之主</div><div class="host_sessionRow" aria-selected="true"><span class="host_title">主题配置</span><span class="host_time">刚刚</span></div><div class="host_sessionRow"><span class="host_title">背景资源</span><span class="host_time">15分钟</span></div><div class="host_projectRow">Gradually</div></div><div class="host_footArea"><div class="fixture-footer-actions"><button aria-label="设置"><span class="lotm-ui-icon" data-lotm-glyph="settings"></span></button><button aria-label="搜索"><span class="lotm-ui-icon" data-lotm-glyph="search"></span></button><button aria-label="主题"><span class="lotm-ui-icon" data-lotm-glyph="moon-stars"></span></button></div></div></div></aside><main class="mP3x-q_centerCol"><div><div class="an3WzG_root" data-phase="active"><header class="an3WzG_header"><div class="an3WzG_titleRow"><span class="host_crumbCurrent">主题配置</span></div><div class="host_tabs"><div class="host_viewTabs"><span class="host_tab">对话</span><span class="host_tab">轨迹</span></div></div></header><div class="an3WzG_body" data-conversation-region="chat"><div class="an3WzG_scrollBody" data-conversation-scroll><div data-slot="conversation.session"><div class="an3WzG_viewArea"><div class="V4vHZW_frame"><div class="V4vHZW_root"><div class="V4vHZW_scroll"><div class="V4vHZW_column" id="reading-axis"><div class="LOmM4q_bubble">让十个序列切换后保持文字清晰。</div><div class="xMeOpW_body"><p>已完成主题配置与资源检查。</p><div class="md-code-block" id="code-axis"><div data-code-block-banner>theme.py</div><pre><code><span style="color:var(--shiki-token-keyword)">from</span> pathlib <span style="color:var(--shiki-token-keyword)">import</span> Path

<span style="color:var(--shiki-token-keyword)">def</span> <span style="color:var(--shiki-token-function)">resolve_scene</span>(sequence: int) -&gt; Path:
    <span style="color:var(--shiki-token-keyword)">return</span> Path(<span style="color:var(--shiki-token-string)">"assets"</span>) / <span style="color:var(--shiki-token-string)">f"sequence-{sequence}.webp"</span>

scene = resolve_scene(<span style="color:var(--shiki-token-constant)">8</span>)</code></pre></div><div data-tool><span class="tool_title">检查序列资源</span><pre class="EqXNNG_body" id="execution-axis">10 scenes verified
build complete</pre></div><p>序列资源齐全，文字对比检查通过。</p></div></div></div></div></div></div></div><div class="an3WzG_composerSeat" data-composer-seat><div data-slot="conversation.composer"><div class="GRgSLq_root"><div class="GRgSLq_card" data-composer-card id="input-axis"><div contenteditable="true">继续处理主题</div></div><div class="F07MqG_dock fixture-readout" data-composer-dock><div data-composer-stat="activity"><span class="host_label">200 tok/s</span></div><div data-composer-stat="usage"><span class="host_label">缓存命中 99.7%</span></div><button aria-haspopup="dialog">42%</button></div></div></div></div></div></div></div></div></main></div></div><div id="lotm-atlas-background"></div><script>document.documentElement.style.setProperty('--lotm-sidebar-edge','260px');</script></body></html>`;
function heroHtml(theme){
 const main=`<main class="mP3x-q_centerCol"><div><div class="an3WzG_root" data-phase="hero">
 <header class="an3WzG_header"><div class="an3WzG_titleRow"><span class="lotm-ui-icon" data-lotm-glyph="cards" aria-hidden="true"></span><span class="host_crumbCurrent">塔罗会</span></div></header>
 <div class="an3WzG_body" data-conversation-region="chat"><div class="an3WzG_scrollBody" data-conversation-scroll>
 <div class="an3WzG_composerSeat" data-composer-seat data-conversation-region="composer"><div data-slot="conversation.composer"><div class="an3WzG_composerStack an3WzG_composerHero">
 <div class="WOwLGG_root"><div class="WOwLGG_stack"><div class="WOwLGG_headline"><div class="WOwLGG_fishHitbox"></div><div class="WOwLGG_titleGroup"><span>探索未至之境</span><span class="WOwLGG_previewBadge">PREVIEW</span></div></div><div class="WOwLGG_body"></div></div></div>
 <div class="GRgSLq_root"><div class="GRgSLq_card" data-composer-card id="input-axis"><div class="fixture-input"><div class="GRgSLq_placeholder">录入问题</div><div class="GRgSLq_input" role="textbox" aria-label="录入问题" contenteditable="true"></div></div><div class="fixture-input-tools"><button aria-label="添加附件" title="添加附件"><span class="lotm-ui-icon" data-lotm-glyph="paperclip"></span></button><button aria-label="默认模型" title="默认模型">默认模型<span class="lotm-ui-icon" data-lotm-glyph="chevron-down"></span></button><button class="host_primary" aria-label="发布任务" title="发布任务"><span class="lotm-ui-icon" data-lotm-glyph="send"></span></button></div></div></div>
 </div></div></div></div></div></div></div></main>`;
 return html(theme).replace(/<main class="mP3x-q_centerCol">[\s\S]*?<\/main>/,main).replace('</style>',`
 .an3WzG_header{min-height:56px}.an3WzG_titleRow{display:flex;align-items:center;gap:12px}.fixture-input{position:relative;min-height:42px}.GRgSLq_placeholder{position:absolute;top:0;left:0;pointer-events:none}.GRgSLq_input{position:relative;min-height:42px;outline:0}.fixture-input:has([contenteditable]:not(:empty)) .GRgSLq_placeholder{display:none}.fixture-input-tools{display:flex;align-items:center;gap:8px}.fixture-input-tools button{background:transparent;border:1px solid transparent;display:flex;align-items:center;gap:10px;border-radius:20px;padding:6px 10px;font-size:12px}.fixture-input-tools .host_primary{margin-left:auto;width:38px;height:38px;justify-content:center}.host_newSession{cursor:pointer}.host_panelRow{display:flex;align-items:center;border:0;background:transparent;text-align:left}.host_projectRow{margin-top:5px}
 </style>`).replace('主题配置</span>','廷根的委托</span>').replace('背景资源</span>','贝克兰德来信</span>').replace('<div class="host_projectRow">Gradually</div>','<div class="host_sessionRow"><span class="host_title">灰雾中的约定</span></div>');
}
function processHtml(theme){
 const think=(text)=>`<div class="VJlF5q_root" data-variant="think" data-state="ok" data-preview><div class="VJlF5q_row"><button class="fixture-disclosure" data-disclosure-header aria-expanded="false"><span class="lotm-ui-icon" data-lotm-glyph="pentagram" aria-hidden="true"></span><span class="VJlF5q_title">思考</span><span class="VJlF5q_separator" aria-hidden="true"></span><span class="VJlF5q_summary"><span class="VJlF5q_summaryText">${text}</span></span></button></div></div>`;
 const tool=(title,summary,error=false)=>`<div data-tool="command" data-state="${error?'error':'ok'}"><button class="fixture-disclosure" data-disclosure-header aria-expanded="false"><span class="lotm-ui-icon" data-lotm-glyph="script" aria-hidden="true"></span><span class="tool_title">${title}</span><span class="EqXNNG_separator" aria-hidden="true"></span><span class="EqXNNG_summary" ${error?'data-error':''}>${summary}</span></button></div>`;
 const action=(title,status)=>`<div data-tool="computer" data-state="ok"><button class="fixture-disclosure" data-disclosure-header aria-expanded="false"><span class="lotm-ui-icon" data-lotm-glyph="layout-sidebar" aria-hidden="true"></span><span class="tool_title">${title}</span><span class="tool_summary">${status}</span></button></div>`;
 const main=`<main class="mP3x-q_centerCol"><div><div class="an3WzG_root" data-phase="active"><header class="an3WzG_header"><div class="an3WzG_titleRow"><span class="host_crumbCurrent">廷根的来信</span></div><div class="host_tabs"><div class="host_viewTabs"><span class="host_tab">对话</span><span class="host_tab">轨迹</span></div></div></header><div class="an3WzG_body" data-conversation-region="chat"><div class="an3WzG_scrollBody" data-conversation-scroll><div class="V4vHZW_frame"><div class="V4vHZW_root"><div class="V4vHZW_scroll"><div class="V4vHZW_column" id="reading-axis"><div class="_1KfHza_actions"><span class="_1KfHza_endInfo"><span class="_1KfHza_timeEnd">10月31日 23:38</span></span></div><button class="hE4tRW_root" data-turn-process disabled><span class="hE4tRW_label">已完成，用时 <span class="hE4tRW_durationNumber">2分59秒</span></span></button><div class="BE0jCW_root" data-step-process data-group-expanded-mode><div class="BE0jCW_body BE0jCW_expandedBody" data-step-process-body><div class="BE0jCW_content" data-step-process-content data-chat-flow>
 ${think('Read the letter from Tingen, then inspect the archive before following the next clue.')}
 ${tool('工具调用','inspect · assets/manifest.json · 10 scenes')}
 ${think('The scene is ready. I will compare the warm light against the ink and engraved borders.')}
 ${tool('工具调用','query · archive/tingen-notes.md · chapter: the red moon')}
 ${action('本轮桌面操作','已完成 · 8 步操作')}
 ${action('查看打开的窗口','已完成')}
 ${think('The old brass should stay quiet; the paper surface carries the text while the mist stays visible.')}
 ${action('查看屏幕','已完成')}
 ${action('检查当前记录','已完成')}
 ${think('The answer lies in the letter. Return to the archive and keep the final note in view.')}
 </div></div></div><div class="xMeOpW_root"><div class="xMeOpW_body"><p>廷根的来信已经送达。旧档案里的细节，或许正指向我们寻找的答案。</p><p>灰雾缓缓退去，书页上的墨迹仍然清晰。</p></div></div></div></div></div></div></div></div></div></div></main>`;
 return html(theme).replace(/<main class="mP3x-q_centerCol">[\s\S]*?<\/main>/,main).replace('</style>',`.fixture-disclosure{display:flex;align-items:center;gap:8px;width:100%;min-width:0;min-height:24px;padding:0;border:0;background:transparent;font:600 14px/24px var(--dsw-font-family);color:var(--dsw-alias-label-secondary);text-align:left}.fixture-disclosure .lotm-ui-icon{width:16px;height:16px}.fixture-disclosure .tool_summary{margin-left:8px}.V4vHZW_column>[data-step-process]{margin:10px 0 18px}.hE4tRW_root{margin-top:10px}.BE0jCW_content>div[data-tool]{min-height:28px}.xMeOpW_body{padding:0}</style>`);
}
http.createServer(async(req,res)=>{
 const url=new URL(req.url,'http://127.0.0.1');
 // Development-only capture sink: browser automation can save its screenshot
 // using this ordinary local form. No caller-controlled filesystem paths.
 if(url.pathname==='/capture'){
  if(req.method==='POST'){
   let body='';for await(const chunk of req){body+=chunk;if(body.length>8*1024*1024){res.writeHead(413);res.end();return;}}
   const data=new URLSearchParams(body).get('png')||'';
   if(!/^[A-Za-z0-9+/=]+$/.test(data)){res.writeHead(400);res.end();return;}
   const bytes=Buffer.from(data,'base64');
   if(bytes.subarray(0,8).toString('hex')!=='89504e470d0a1a0a'){res.writeHead(400);res.end();return;}
   const dir=new URL('output/qa/',root);fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(new URL('latest-capture.png',dir),bytes);
   res.writeHead(200,{'content-type':'text/html; charset=utf-8','cache-control':'no-store'});res.end('<title>已保存</title>已保存');return;
  }
  res.writeHead(200,{'content-type':'text/html; charset=utf-8','cache-control':'no-store'});res.end('<form method="post"><textarea name="png" aria-label="PNG"></textarea><button>保存</button></form>');return;
 }
 const route=routes.get(url.pathname);if(route){route.handler(req,res);return;}
 const theme=THEMES.find(t=>t.id===url.searchParams.get('sequence'))||THEMES[1];
 if(url.pathname==='/theme.css'){
  const file=new URL('src/styles.mjs',root),mtime=fs.statSync(file).mtimeMs;
  const {themeCss}=await import(file.href+'?'+mtime);
  res.writeHead(200,{'content-type':'text/css','cache-control':'no-store'});res.end(themeCss(theme,'/api/lotm-sequence-atlas/assets/'+theme.asset));return;
 }
 if(url.pathname==='/client.js'){
  const file=new URL(url.searchParams.has('baseline')?'output/readability-20261031/baseline-client.js':'lib/client.js',root);
  if(!fs.existsSync(file)){res.writeHead(404,{'content-type':'text/plain; charset=utf-8'});res.end('Baseline bundle is not available in this checkout.');return;}
  res.writeHead(200,{'content-type':'text/javascript','cache-control':'no-store'});res.end(fs.readFileSync(file));return;
 }
 if(url.pathname==='/'){
  res.writeHead(200,{'content-type':'text/html; charset=utf-8','cache-control':'no-store'});
  const state=url.searchParams.get('state');
  let page=heroHtml(theme);
  if(state==='process')page=processHtml(theme);
  else if(state==='active')page=html(theme);
  let init=bootstrap(theme);
  if(url.searchParams.get('readability')==='balanced')init=init.replace("readability:'clear'","readability:'balanced'");
  if(url.searchParams.has('baseline')){
   page=page.replace(/<link rel="stylesheet" href="\/theme.css[^>]+>/,'');
   init=init.replace('src="/client.js"','src="/client.js?baseline=1"');
  }
  res.end((url.searchParams.has('windows')?page.replace('<html ', '<html data-windows-titlebar '):page).replace('</body>',init+'</body>'));return;
 }
 res.writeHead(404);res.end();
}).listen(4187,'127.0.0.1',()=>console.log('DSH layout fixture at http://127.0.0.1:4187'));
