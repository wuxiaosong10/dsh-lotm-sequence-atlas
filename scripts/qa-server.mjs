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
for(const name of ['ui-layout','ui-conversation','ui-chat','ui-workspace']){
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
html,body,#root{height:100%;margin:0}*{box-sizing:border-box}button{font:inherit;color:inherit}header{color:inherit}#root{--dsh-content-font-size:14px;--dsh-content-font-delta:0px;--dsh-composer-stack-gap:8px;--dsh-composer-dock-inset:8px}.mP3x-q_frame{grid-template-columns:260px minmax(0,1fr)}aside>div{height:100%;display:flex;flex-direction:column}.host_panelList{display:grid}.host_logoRow{display:flex;align-items:center}.host_sessionRow,.host_projectRow{display:flex;align-items:center}.host_time{margin-left:auto}.host_sectionHeader{display:flex;align-items:center;margin-top:16px}.host_title{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.mP3x-q_centerCol{height:100%}.an3WzG_header{min-height:86px}.host_tabs{grid-column:1/-1;display:flex;height:28px;margin-top:10px}.host_viewTabs{display:flex;gap:24px}.host_tab{font-size:13px}pre{white-space:pre;overflow:auto}.fixture-readout{display:flex;gap:10px;align-items:center;color:${theme.muted};font-size:12px}[data-composer-stat]{display:flex;gap:6px}.GRgSLq_card{min-height:110px;padding:16px}.GRgSLq_root{min-height:130px}.xMeOpW_body{padding-block:8px}.md-code-block{margin-block:16px}.host_label{white-space:nowrap}
</style><link rel="stylesheet" href="/theme.css?sequence=${theme.id}"></head><body><div id="root"><div class="mP3x-q_frame"><aside class="mP3x-q_sidebarCol"><div><div class="host_logoRow"><span class="host_brandName">deepseek HARNESS</span></div><button class="host_newSession" aria-label="新建会话">+</button><nav class="host_panelList"><button class="host_panelRow">插件</button><button class="host_panelRow">自动化任务</button><button class="host_panelRow">任务看板</button></nav><div class="host_sectionHeader"><span class="host_sectionLabel">工作区</span></div><div class="host_projectRow">诡秘之主</div><div class="host_sessionRow" aria-selected="true"><span class="host_title">主题配置</span><span class="host_time">刚刚</span></div><div class="host_sessionRow"><span class="host_title">背景资源</span><span class="host_time">15分钟</span></div><div class="host_projectRow">Gradually</div></div></aside><main class="mP3x-q_centerCol"><div><div class="an3WzG_root" data-phase="active"><header class="an3WzG_header"><div class="an3WzG_titleRow"><span class="host_crumbCurrent">主题配置</span></div><div class="host_tabs"><div class="host_viewTabs"><span class="host_tab">对话</span><span class="host_tab">轨迹</span></div></div></header><div class="an3WzG_body" data-conversation-region="chat"><div class="an3WzG_scrollBody" data-conversation-scroll><div data-slot="conversation.session"><div class="an3WzG_viewArea"><div class="V4vHZW_frame"><div class="V4vHZW_root"><div class="V4vHZW_scroll"><div class="V4vHZW_column" id="reading-axis"><div class="LOmM4q_bubble">让十个序列切换后保持文字清晰。</div><div class="xMeOpW_body"><p>已完成主题配置与资源检查。</p><div class="md-code-block" id="code-axis"><div data-code-block-banner>theme.py</div><pre><code><span style="color:var(--shiki-token-keyword)">from</span> pathlib <span style="color:var(--shiki-token-keyword)">import</span> Path

<span style="color:var(--shiki-token-keyword)">def</span> <span style="color:var(--shiki-token-function)">resolve_scene</span>(sequence: int) -&gt; Path:
    <span style="color:var(--shiki-token-keyword)">return</span> Path(<span style="color:var(--shiki-token-string)">"assets"</span>) / <span style="color:var(--shiki-token-string)">f"sequence-{sequence}.webp"</span>

scene = resolve_scene(<span style="color:var(--shiki-token-constant)">8</span>)</code></pre></div><div data-tool><span class="tool_title">检查序列资源</span><pre class="EqXNNG_body" id="execution-axis">10 scenes verified
build complete</pre></div><p>序列资源齐全，文字对比检查通过。</p></div></div></div></div></div></div></div><div class="an3WzG_composerSeat" data-composer-seat><div data-slot="conversation.composer"><div class="GRgSLq_root"><div class="GRgSLq_card" data-composer-card id="input-axis"><div contenteditable="true">继续处理主题</div></div><div class="F07MqG_dock fixture-readout" data-composer-dock><div data-composer-stat="activity"><span class="host_label">200 tok/s</span></div><div data-composer-stat="usage"><span class="host_label">缓存命中 99.7%</span></div><button aria-haspopup="dialog">42%</button></div></div></div></div></div></div></div></div></main></div></div><div id="lotm-atlas-background"></div><script>document.documentElement.style.setProperty('--lotm-sidebar-edge','260px');</script></body></html>`;
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
 if(url.pathname==='/client.js'){res.writeHead(200,{'content-type':'text/javascript','cache-control':'no-store'});res.end(fs.readFileSync(new URL('lib/client.js',root)));return;}
 if(url.pathname==='/'){res.writeHead(200,{'content-type':'text/html; charset=utf-8','cache-control':'no-store'});res.end(html(theme).replace('</body>',bootstrap(theme)+'</body>'));return;}
 res.writeHead(404);res.end();
}).listen(4187,'127.0.0.1',()=>console.log('DSH layout fixture at http://127.0.0.1:4187'));
