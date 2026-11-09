import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';
import {STORAGE_KEY,contrastRatio} from '../src/core.mjs';
import {THEMES,ASSET_PREFIX} from '../src/catalog.mjs';

// Exercise the current source without requiring a generated bundle first.
const source=(path)=>readFileSync(new URL('../src/'+path,import.meta.url),'utf8');
const clientSource=source('client.js')
 .replace('/* CORE */',source('core.mjs').replace(/^export /gm,''))
 .replace('/* STYLES */',source('styles.mjs').replace(/^import .*$/gm,'').replace(/^export /gm,''))
 .replace('/* NATIVE_SKIN */',source('native-skin.mjs').replace(/^export /gm,''))
 .replace('/* CATALOG */','const THEMES='+JSON.stringify(THEMES)+';const ASSET_PREFIX='+JSON.stringify(ASSET_PREFIX)+';');

function fixture(saved,baseline,{ResizeObserver}={}) {
 const dom=new JSDOM('<html><head></head><body><div id="root"><aside class="mP3x-q_sidebarCol"><div><div class="host_logoRow">Brand</div><button class="host_newSession" aria-label="新建会话">+</button></div></aside><div data-tool><span class="tool_title">Title</span><span class="tool_summary">Summary</span></div></div></body></html>',{url:'https://desktop.test/',runScripts:'outside-only'});
 const w=dom.window, effects=[], events=new Set(), schemeCalls=[], images=[];
 Object.defineProperty(w.document,'hidden',{configurable:true,value:false});
 const media=[];
 w.HTMLMediaElement.prototype.play=function(){media.push(['play',this]);return Promise.resolve();};
 w.HTMLMediaElement.prototype.pause=function(){media.push(['pause',this]);};
 w.HTMLMediaElement.prototype.load=function(){media.push(['load',this]);};
 if(ResizeObserver)w.ResizeObserver=ResizeObserver;
 if(saved)w.localStorage.setItem(STORAGE_KEY,JSON.stringify(saved));
 if(baseline)w.localStorage.setItem(STORAGE_KEY+'/previous-theme',JSON.stringify({preference:baseline}));
 w.localStorage.setItem('dsh-gradually-theme','classic');
 let preference='light',layer,Row,api;
 const emit=()=>{for(const fn of [...events])fn();};
 const ctx={
  effect(fn){const dispose=fn();if(typeof dispose==='function')effects.push(dispose);},
  on(name,fn){assert.equal(name,'theme/change');events.add(fn);return()=>events.delete(fn);},
  locale:{register(){return()=>{};}},
  slots:{inject(name,fn){assert.equal(name,'settings.general.item');return fn();},register(def,row){Row=row;return()=>{Row=undefined;};}},
  theme:{getTheme(){return{preference,active:{colorScheme:preference==='system'?'light':preference,tokens:layer?Object.fromEntries(Object.entries(layer).map(([k,v])=>[k,v[preference==='light'?'light':'dark']])):{'--dsw-alias-brand-primary':'#5666BB'}}};},
   setTheme(p){schemeCalls.push(p);preference=p;emit();},
   overrideTokens(source,pairs){assert.equal(source,'dsh-lotm-sequence-atlas');const own=pairs;layer=own;emit();return()=>{if(layer===own)layer=undefined;emit();};}}
 };
 w.Image=class{constructor(){images.push(this);}set src(v){this.url=v;}};
 const react={createElement:(type,props,...children)=>({type,props:props||{},children}),useState:value=>[typeof value==='function'?value():value,()=>{}],useEffect:()=>{}};
 w.__ModuleLoader__={load(def){api=def.factory(id=>{assert.equal(id,'react');return react;});}};
 vm.runInContext(clientSource,dom.getInternalVMContext());
 api.apply(ctx);
 function buttons(node,result=[]){if(!node)return result;if(Array.isArray(node)){for(const n of node)buttons(n,result);}else{if(node.type==='button')result.push(node);buttons(node.children,result);}return result;}
 function click(label){const b=buttons(Row()).find(b=>b.props['aria-label']===label);assert.ok(b,label);b.props.onClick();}
 return{w,dom,images,media,schemeCalls,ctx,click,buttons:()=>buttons(Row()),stop(){for(const fn of effects.reverse())fn();dom.window.close();},external(){layer={'--dsw-alias-brand-primary':{light:'#112233',dark:'#112233'}};preference='light';emit();}};
}

test('sequence background uses one muted loop; readiness, switching and shutdown release old media',()=>{
 const f=fixture({sequence:'8',readability:'clear'}),d=f.w.document;
 const old=d.querySelector('#lotm-atlas-background video');assert.ok(old);
 assert.equal(new URL(old.getAttribute('src'),'https://desktop.test').pathname,ASSET_PREFIX+'videos/sequence-8.mp4');
 assert.equal(old.muted,true);assert.equal(old.defaultMuted,true);assert.equal(old.loop,true);
 assert.equal(old.autoplay,true);assert.equal(old.playsInline,true);assert.equal(old.controls,false);
 old.dispatchEvent(new f.w.Event('playing'));
 assert.equal(d.getElementById('lotm-atlas-background').dataset.videoReady,'true');
 f.click('清晰内容面');assert.equal(d.querySelector('video'),old);
 f.click('序列 9 占卜家');
 const current=d.querySelector('video');assert.notEqual(current,old);
 assert.equal(old.getAttribute('src'),null);assert.ok(f.media.some(([op,v])=>op==='pause'&&v===old));
 old.dispatchEvent(new f.w.Event('playing'));
 assert.notEqual(d.getElementById('lotm-atlas-background').dataset.videoReady,'true');
 current.dispatchEvent(new f.w.Event('playing'));
 f.click('关闭诡秘风格');assert.equal(d.querySelector('video'),null);
 assert.equal(current.getAttribute('src'),null);f.stop();
});
test('video failure keeps the current poster; hidden windows pause and resume current media',async()=>{
 const f=fixture({sequence:'8',readability:'clear'}),d=f.w.document;
 const video=d.querySelector('video');assert.ok(video);
 let hidden=true;Object.defineProperty(d,'hidden',{configurable:true,get:()=>hidden});
 d.dispatchEvent(new f.w.Event('visibilitychange'));
 assert.equal(f.media.at(-1)[0],'pause');
 hidden=false;d.dispatchEvent(new f.w.Event('visibilitychange'));
 assert.equal(f.media.at(-1)[0],'play');
 video.dispatchEvent(new f.w.Event('error'));
 assert.equal(d.querySelector('video'),null);
 assert.ok(d.getElementById('lotm-atlas-theme-css').textContent.includes('sequence-8-light.webp'));
 f.click('序列 7 魔术师');const roof=d.querySelector('video');assert.ok(roof);
 f.w.HTMLMediaElement.prototype.play=()=>Promise.reject(new Error('autoplay blocked'));
 hidden=false;d.dispatchEvent(new f.w.Event('visibilitychange'));await Promise.resolve();await Promise.resolve();
 assert.equal(d.querySelector('video'),null);f.stop();
});

test('autoplay that finishes starting in a hidden window pauses before exposing the video',()=>{
 const f=fixture({sequence:'8',readability:'clear'}),d=f.w.document,video=d.querySelector('video');
 Object.defineProperty(d,'hidden',{configurable:true,value:true});
 video.dispatchEvent(new f.w.Event('playing'));
 assert.equal(f.media.at(-1)[0],'pause');
 assert.notEqual(d.getElementById('lotm-atlas-background').dataset.videoReady,'true');
 f.stop();assert.equal(video.getAttribute('src'),null);
});

test('Daly dream holds its final frame across visibility and readability changes, then restarts only after reselection',()=>{
 const f=fixture({sequence:'4',readability:'clear'}),d=f.w.document;
 const video=d.querySelector('video');
 assert.equal(video.loop,false,'a progressive disappearance must not pop back to its first frame');
 video.dispatchEvent(new f.w.Event('playing'));
 Object.defineProperty(video,'ended',{configurable:true,value:true});
 video.dispatchEvent(new f.w.Event('ended'));
 const plays=f.media.filter(([op,v])=>op==='play'&&v===video).length;
 Object.defineProperty(d,'hidden',{configurable:true,value:true});
 d.dispatchEvent(new f.w.Event('visibilitychange'));
 Object.defineProperty(d,'hidden',{configurable:true,value:false});
 d.dispatchEvent(new f.w.Event('visibilitychange'));
 f.click('清晰内容面');
 assert.equal(f.media.filter(([op,v])=>op==='play'&&v===video).length,plays);
 assert.equal(d.querySelector('video'),video);
 assert.equal(d.getElementById('lotm-atlas-background').dataset.videoReady,'true');
 f.click('序列 5 秘偶大师');
 assert.equal(d.querySelector('video').loop,true);
 f.click('序列 4 诡法师');
 const replay=d.querySelector('video');
 assert.notEqual(replay,video);assert.equal(replay.loop,false);
 assert.equal(video.getAttribute('src'),null);
 assert.ok(f.media.some(([op,v])=>op==='play'&&v===replay));
 f.stop();
});

test('updated media URLs bypass the previous release cache for video, poster and setting thumbnails',()=>{
 const f=fixture({sequence:'3',readability:'clear'}),d=f.w.document;
 const video=d.querySelector('video');
 const check=(value,path)=>{const url=new URL(value,'https://desktop.test');assert.equal(url.pathname,ASSET_PREFIX+path);assert.ok(url.searchParams.get('v'),'release media needs a cache revision');};
 check(video.getAttribute('src'),'videos/sequence-3.mp4');
 check(video.poster,'sequence-3.webp');
 const choice=f.buttons().find(b=>b.props['aria-label']==='序列 3 古代学者');
 check(choice.children[0].props.src,'thumb-3.webp');
 f.stop();
});

test('native settings exposes ten named image choices; activation/close restores old preference and no old key is changed',()=>{
 const f=fixture();
 assert.equal(f.buttons().filter(b=>b.props.className==='lotm-atlas-choice').length,10);
 f.click('序列 9 占卜家');
 assert.equal(f.w.document.documentElement.dataset.lotmAtlas,'9');
 assert.ok(f.w.document.getElementById('lotm-atlas-background'));
 assert.equal(f.ctx.theme.getTheme().active.colorScheme,'dark');
 assert.equal(f.w.localStorage.getItem('dsh-gradually-theme'),'classic');
 f.click('关闭诡秘风格');
 assert.equal(f.schemeCalls.at(-1),'light');
 assert.equal(f.w.document.getElementById('lotm-atlas-background'),null);
 assert.equal(f.w.document.documentElement.hasAttribute('data-lotm-atlas'),false);
 f.stop();
});
test('restored selection survives reload baseline; rapid image responses cannot revert the current scene',()=>{
 const f=fixture({sequence:'6',readability:'clear'},'system');
 f.click('序列 8 小丑');
 const latest=f.images.at(-1);latest.onload();
 f.images[0].onload();
 assert.ok(f.w.document.getElementById('lotm-atlas-theme-css').textContent.includes('sequence-8-light.webp'));
 assert.equal(new URL(f.w.document.getElementById('lotm-atlas-background').dataset.asset,'https://desktop.test').pathname,'/api/lotm-sequence-atlas/assets/sequence-8-light.webp');
 f.click('关闭诡秘风格');assert.equal(f.schemeCalls.at(-1),'system');f.stop();
});
test('choosing another palette hands off without clobbering its theme; unload removes every plugin node',()=>{
 const f=fixture({sequence:'8',readability:'clear'});
 f.external();
 assert.equal(JSON.parse(f.w.localStorage.getItem(STORAGE_KEY)).sequence,'native');
 assert.equal(f.w.document.getElementById('lotm-atlas-theme-css'),null);
 f.click('序列 3 古代学者');
 assert.equal(f.ctx.theme.getTheme().active.colorScheme,'light');
 f.stop();
});
test('existing Gradually explicit tool text colors cannot leak into the new dark scene',()=>{
 const f=fixture();const legacy=f.w.document.createElement('style');
 legacy.textContent='div[data-tool] [class*="title"]{color:#252E3D!important}div[data-tool] [class*="summary"]{color:#5E6B7F!important}';f.w.document.head.append(legacy);
 f.click('序列 9 占卜家');
 assert.equal(f.w.getComputedStyle(f.w.document.querySelector('.tool_title')).color,'rgb(240, 244, 246)');
 const summary=f.w.getComputedStyle(f.w.document.querySelector('.tool_summary')).color;
 assert.notEqual(summary,'rgb(94, 107, 127)');
 const ink='#'+summary.match(/\d+/g).slice(0,3).map(value=>Number(value).toString(16).padStart(2,'0')).join('');
 assert.ok(contrastRatio(ink,THEMES.find(t=>t.id==='9').panel)>=4.5);
 f.stop();
});

test('legacy Gradually stylesheet is reversibly suspended, including a late replacement',async()=>{
 const f=fixture();
 const old=f.w.document.createElement('style');old.dataset.pluginCss='dsh-gradually-themes/skin.css';old.media='screen';
 f.w.document.head.append(old);
 f.click('序列 9 占卜家');
 assert.equal(old.media,'not all');
 const late=f.w.document.createElement('style');late.dataset.pluginCss='dsh-gradually-themes/skin.css';f.w.document.head.append(late);
 await Promise.resolve();
 assert.equal(late.media,'not all');
 f.click('关闭诡秘风格');
 assert.equal(old.media,'screen');assert.equal(late.hasAttribute('media'),false);
 assert.equal(f.w.localStorage.getItem('dsh-gradually-theme'),'classic');
 f.stop();
});

test('the bookbinding stays inside the mounted sidebar across switches and replacements',async()=>{
 const f=fixture(), d=f.w.document;
 f.click('序列 8 小丑');
 const column=d.querySelector('[class*="sidebarCol"]');
 const frame=column.querySelector(':scope > .lotm-sidebar-frame');
 assert.ok(frame);
 assert.equal(d.querySelector('#lotm-atlas-pillar,#lotm-atlas-pillar-right'),null);
 f.click('序列 0 愚者');
 assert.equal(column.querySelector('.lotm-sidebar-frame'),frame);
 const replacement=column.cloneNode(false);
 column.replaceWith(replacement);
 await nextFrame(f);
 assert.equal(replacement.querySelectorAll(':scope > .lotm-sidebar-frame').length,1);
 f.click('关闭诡秘风格');
 assert.equal(d.querySelector('.lotm-sidebar-frame'),null);
 f.click('序列 3 古代学者');
 f.stop();
 assert.equal(d.querySelector('.lotm-sidebar-frame,[id^="lotm-atlas-"]'),null);
});
test('streaming tool output does not repeatedly force sidebar layout measurements',async()=>{
 const f=fixture();let measures=0;
 f.w.document.querySelector('[class*="sidebarCol"]').getBoundingClientRect=()=>{measures++;return{right:280,width:280};};
 f.click('序列 8 小丑');await nextFrame(f);
 const before=measures;
 f.w.document.querySelector('[data-tool]').append(f.w.document.createElement('span'));
 await nextFrame(f);
 assert.equal(measures,before);
 f.stop();
});

function statsFixture(f,{headerRight=1400,tabsRight=520,width=240,height=28}={}){
 const d=f.w.document,host=d.createElement('main');
 host.innerHTML='<header class="app_header"><div class="app_tabs"><button>对话</button><button>轨迹</button></div></header><section class="composer"><div data-composer-dock style="position:fixed;left:10px;top:600px;right:auto;bottom:auto" class="external-dock"><div data-composer-stat="activity" title="输出速度"><svg></svg><span class="stat_label">200 tok/s</span></div><div data-composer-stat="usage" aria-label="缓存用量"><svg></svg><span class="stat_label">14.5k tok · 缓存命中 99.7%</span></div><button aria-haspopup="dialog" title="上下文">32%</button></div></section>';
 const header=host.querySelector('header'),tabs=header.firstElementChild,dock=host.querySelector('[data-composer-dock]');
 const geometry={headerRight,tabsRight,width,height,measures:0};
 header.getBoundingClientRect=()=>{geometry.measures++;return{left:280,right:geometry.headerRight,top:40,bottom:96,width:geometry.headerRight-280,height:56};};
 tabs.getBoundingClientRect=()=>({left:300,right:geometry.tabsRight,top:48,bottom:88,width:geometry.tabsRight-300,height:40});
 Object.defineProperties(dock,{offsetWidth:{get:()=>geometry.width,configurable:true},offsetHeight:{get:()=>geometry.height,configurable:true}});
 d.querySelector('#root').append(host);
 return{host,header,tabs,dock,geometry,activity:dock.querySelector('[data-composer-stat="activity"]'),usage:dock.querySelector('[data-composer-stat="usage"]'),context:dock.querySelector('[aria-haspopup="dialog"]')};
}
const nextFrame=async(f)=>{await Promise.resolve();await new Promise(resolve=>f.w.setTimeout(resolve,30));};

test('statistics are fixed beside header tabs using own coordinates and preserve native DOM, styles, labels and accessibility',()=>{
 const f=fixture(),s=statsFixture(f),originalParent=s.dock.parentElement,originalStyle=s.dock.getAttribute('style');
 f.click('序列 8 小丑');
 assert.equal(s.dock.dataset.lotmDock,'header');
 assert.equal(f.w.document.documentElement.style.getPropertyValue('--lotm-stats-left'),'1140px');
 assert.equal(f.w.document.documentElement.style.getPropertyValue('--lotm-stats-top'),'54px');
 assert.equal(s.dock.parentElement,originalParent);
 assert.equal(s.dock.getAttribute('style'),originalStyle);
 assert.equal(s.dock.className,'external-dock');
 assert.equal(s.activity.querySelector('span').dataset.lotmNumber,'200');
 assert.equal(s.usage.querySelector('span').dataset.lotmNumber,'99.7%');
 assert.equal(s.activity.textContent,'200 tok/s');
 assert.equal(s.usage.textContent,'14.5k tok · 缓存命中 99.7%');
 assert.equal(s.activity.title,'输出速度');
 assert.equal(s.usage.getAttribute('aria-label'),'缓存用量');
 assert.equal(s.context.textContent,'32%');
 f.stop();
});

test('collision detection measures compact statistics rather than the native full-width dock',()=>{
 const f=fixture(),s=statsFixture(f,{headerRight:1100});
 Object.defineProperty(s.dock,'offsetWidth',{get:()=>s.dock.dataset.lotmDock==='header'?240:740,configurable:true});
 f.click('序列 8 小丑');
 assert.equal(s.dock.dataset.lotmDock,'header');
 assert.equal(f.w.document.documentElement.style.getPropertyValue('--lotm-stats-left'),'840px');
 f.stop();
});

test('late statistics mount and replacement are discovered while narrow headers return to native placement',async()=>{
 const f=fixture();f.click('序列 8 小丑');
 let s=statsFixture(f);await nextFrame(f);
 assert.equal(s.dock.dataset.lotmDock,'header');
 const oldDock=s.dock,oldActivity=s.activity;
 s.host.remove();s=statsFixture(f,{width:0,height:0,headerRight:1300});await nextFrame(f);
 assert.equal(oldDock.hasAttribute('data-lotm-dock'),false);
 assert.equal(oldActivity.querySelector('span').hasAttribute('data-lotm-number'),false);
 assert.equal(s.dock.dataset.lotmDock,'header');
 assert.equal(f.w.document.documentElement.style.getPropertyValue('--lotm-stats-left'),'1040px');
 assert.equal(f.w.document.documentElement.style.getPropertyValue('--lotm-stats-top'),'54px');
 s.geometry.tabsRight=1120;f.w.dispatchEvent(new f.w.Event('resize'));await nextFrame(f);
 assert.equal(s.dock.hasAttribute('data-lotm-dock'),false);
 assert.equal(f.w.document.documentElement.style.getPropertyValue('--lotm-stats-left'),'');
 s.geometry.tabsRight=520;Object.defineProperty(f.w,'innerWidth',{value:800,configurable:true});f.w.dispatchEvent(new f.w.Event('resize'));await nextFrame(f);
 assert.equal(s.dock.hasAttribute('data-lotm-dock'),false);
 f.stop();
});

for(const groupKind of ['viewTabs','tablist'])test('full-width header tabs use the '+groupKind+' controls for collision detection',async()=>{
 const f=fixture(),s=statsFixture(f,{tabsRight:1400});
 const group=f.w.document.createElement('div');
 if(groupKind==='viewTabs')group.className='app_viewTabs';else group.setAttribute('role','tablist');
 group.append(...s.tabs.childNodes);s.tabs.append(group);
 let groupRight=520;
 group.getBoundingClientRect=()=>({left:300,right:groupRight,top:48,bottom:88,width:groupRight-300,height:40});
 f.click('序列 8 小丑');
 assert.equal(s.dock.dataset.lotmDock,'header');
 assert.equal(f.w.document.documentElement.style.getPropertyValue('--lotm-stats-left'),'1140px');
 assert.equal(f.w.document.documentElement.style.getPropertyValue('--lotm-stats-top'),'54px');
 groupRight=1200;f.w.dispatchEvent(new f.w.Event('resize'));await nextFrame(f);
 assert.equal(s.dock.hasAttribute('data-lotm-dock'),false);
 assert.equal(f.w.document.documentElement.style.getPropertyValue('--lotm-stats-left'),'');
 f.stop();
});

test('statistics text updates refresh numeric display and alerts without measuring sidebar or editing source text',async()=>{
 const f=fixture(),s=statsFixture(f);let sidebarMeasures=0;
 f.w.document.querySelector('[class*="sidebarCol"]').getBoundingClientRect=()=>{sidebarMeasures++;return{right:280,width:280};};
 f.click('序列 8 小丑');await nextFrame(f);
 const before=sidebarMeasures;
 s.activity.querySelector('span').firstChild.data='83.5 tok/s';
 s.usage.querySelector('span').textContent='16k tok · Cache hit 91.2%';
 s.context.firstChild.data='82%';
 await nextFrame(f);
 assert.equal(s.activity.querySelector('span').dataset.lotmNumber,'83.5');
 assert.equal(s.usage.querySelector('span').dataset.lotmNumber,'91.2%');
 assert.equal(s.activity.dataset.lotmAlert,'true');assert.equal(s.usage.dataset.lotmAlert,'true');assert.equal(s.context.dataset.lotmAlert,'true');
 assert.equal(sidebarMeasures,before);
 assert.equal(s.activity.textContent,'83.5 tok/s');assert.equal(s.usage.textContent,'16k tok · Cache hit 91.2%');assert.equal(s.context.textContent,'82%');
 s.activity.querySelector('span').textContent='Waiting';s.usage.querySelector('span').textContent='No usage';s.context.textContent='42%';await nextFrame(f);
 assert.equal(s.activity.querySelector('span').hasAttribute('data-lotm-number'),false);
 assert.equal(s.usage.querySelector('span').hasAttribute('data-lotm-number'),false);
 assert.equal(s.dock.querySelector('[data-lotm-alert]'),null);
 f.stop();
});

test('close, handoff and unload clear statistics attributes, coordinates, and pending work without changing external styles',async()=>{
 const f=fixture(),s=statsFixture(f),root=f.w.document.documentElement,style=s.dock.getAttribute('style');
 const assertClean=()=>{
  assert.equal(s.dock.hasAttribute('data-lotm-dock'),false);
  assert.equal(s.dock.querySelector('[data-lotm-number],[data-lotm-alert]'),null);
  assert.equal(root.style.getPropertyValue('--lotm-stats-left'),'');assert.equal(root.style.getPropertyValue('--lotm-stats-top'),'');
  assert.equal(s.dock.getAttribute('style'),style);assert.equal(s.dock.className,'external-dock');
 };
 f.click('序列 8 小丑');assert.equal(s.dock.dataset.lotmDock,'header');s.activity.querySelector('span').textContent='20 tok/s';await Promise.resolve();
 f.click('关闭诡秘风格');await nextFrame(f);assertClean();
 f.click('序列 8 小丑');assert.equal(s.dock.dataset.lotmDock,'header');f.external();assertClean();
 f.click('序列 8 小丑');assert.equal(s.dock.dataset.lotmDock,'header');f.w.dispatchEvent(new f.w.Event('resize'));f.stop();assertClean();
});

test('header resize and sidebar collapse remeasure statistics while transcript streaming does not',async()=>{
 const observers=new Set();
 class ResizeObserver {
  constructor(callback){this.callback=callback;this.targets=new Set();observers.add(this);}
  observe(target){this.targets.add(target);}
  disconnect(){this.targets.clear();}
 }
 const resize=(target)=>{for(const observer of observers)if(observer.targets.has(target))observer.callback([]);};
 const f=fixture(undefined,undefined,{ResizeObserver}),s=statsFixture(f);
 f.click('序列 8 小丑');await nextFrame(f);
 s.geometry.headerRight=1200;resize(s.header);await nextFrame(f);
 assert.equal(f.w.document.documentElement.style.getPropertyValue('--lotm-stats-left'),'940px');
 s.geometry.headerRight=1100;f.w.document.querySelector('[class*="sidebarCol"]').setAttribute('data-sidebar-collapsed','true');await nextFrame(f);
 assert.equal(f.w.document.documentElement.style.getPropertyValue('--lotm-stats-left'),'840px');
 const before=s.geometry.measures;
 const tool=f.w.document.querySelector('[data-tool]');
 for(let i=0;i<5;i++)tool.append(f.w.document.createElement('span'));
 await nextFrame(f);assert.equal(s.geometry.measures,before);
 f.click('关闭诡秘风格');s.geometry.headerRight=1400;resize(s.header);await nextFrame(f);
 assert.equal(s.geometry.measures,before);assert.equal(s.dock.hasAttribute('data-lotm-dock'),false);
 f.stop();
});
