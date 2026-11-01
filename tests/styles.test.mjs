import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {THEMES} from '../src/catalog.mjs';
import {themeCss,SETTINGS_CSS} from '../src/styles.mjs';
import {contrastRatio} from '../src/core.mjs';

test('resident DSH conversation root cannot hide artwork behind its opaque base fill',()=>{
 const dom=new JSDOM('<html data-lotm-atlas="7"><head></head><body><div id="root"><div class="mP3x-q_frame"><div class="mP3x-q_centerCol"><div data-slot="main"><div><div class="an3WzG_root"><div data-conversation-region="chat"><pre>output</pre></div></div></div></div></div></div></div><div id="lotm-atlas-background"></div></body></html>');
 const {document,getComputedStyle}=dom.window;
 const host=document.createElement('style');
 // Exact resident container rule from DSH 0.2.1-rc.3 ui-conversation.
 host.textContent='.an3WzG_root{background:var(--dsw-alias-bg-base);background-color:rgb(37,46,33);height:100%;position:relative}';
 document.head.append(host);
 for(const theme of [THEMES.find(t=>t.id==='7'),THEMES.find(t=>t.id==='3')]){
  const own=document.createElement('style');own.textContent=themeCss(theme,'/api/lotm-sequence-atlas/assets/'+theme.asset);document.head.append(own);
  assert.equal(getComputedStyle(document.querySelector('.an3WzG_root')).backgroundColor,'rgba(0, 0, 0, 0)');
  assert.notEqual(getComputedStyle(document.querySelector('pre')).backgroundColor,'rgba(0, 0, 0, 0)');
  own.remove();
 }
 dom.window.close();
});

test('Gradually-shaped new-session control keeps its icon and label visible',()=>{
 const dom=new JSDOM('<html data-lotm-atlas="8"><head></head><body><aside class="mP3x-q_sidebarCol"><div><button class="host_newSession"><span class="host_newSessionContent"><svg style="width:1em;height:1em"></svg><span class="host_newSessionLabelMask"><span class="host_newSessionLabel">新会话</span></span></span></button></div></aside></body></html>');
 const {document,getComputedStyle}=dom.window;
 const own=document.createElement('style');own.textContent=themeCss(THEMES[1],'/scene.webp');document.head.append(own);
 const label=document.querySelector('.host_newSessionLabel'),icon=document.querySelector('svg');
 assert.ok(Number.parseFloat(getComputedStyle(label).fontSize)>=12);
 assert.notEqual(getComputedStyle(label).display,'none');
 assert.ok(Number.parseFloat(getComputedStyle(icon).fontSize)>=14);
 dom.window.close();
});

test('hero composer keeps the native intrinsic height instead of adding an empty strip below its toolbar',()=>{
 const dom=new JSDOM('<html data-lotm-atlas="8"><head></head><body><div class="an3WzG_root" data-phase="hero"><div class="GRgSLq_card" data-composer-card><div contenteditable="true"></div><div class="native_toolbar"><button>发送</button></div></div></div></body></html>');
 const {document,getComputedStyle}=dom.window,card=document.querySelector('[data-composer-card]');
 const host=document.createElement('style');host.textContent='.GRgSLq_card{display:flex;flex-direction:column;gap:12px;padding-top:8px}';document.head.append(host);
 const nativeMinHeight=getComputedStyle(card).minHeight;
 const own=document.createElement('style');own.textContent=themeCss(THEMES[1],'/scene.webp');document.head.append(own);
 assert.equal(getComputedStyle(card).minHeight,nativeMinHeight);
 dom.window.close();
});

test('Windows central panes keep the scene visible for both div and main containers',()=>{
 for(const tag of ['div','main']){
  const dom=new JSDOM(`<html data-lotm-atlas="5" data-windows-titlebar><head></head><body><div id="root"><div class="mP3x-q_frame"><${tag} class="mP3x-q_centerCol"></${tag}></div></div></body></html>`);
  const {document,getComputedStyle}=dom.window;
  const host=document.createElement('style');host.textContent='[data-windows-titlebar] .mP3x-q_centerCol{background:rgb(16,35,31)}';document.head.append(host);
  const own=document.createElement('style');own.textContent=themeCss(THEMES.find(t=>t.id==='5'),'/scene.webp');document.head.append(own);
  assert.equal(getComputedStyle(document.querySelector('.mP3x-q_centerCol')).backgroundColor,'rgba(0, 0, 0, 0)',tag);
  dom.window.close();
 }
});

function processStyleFixture(theme,readability='clear'){
 const dom=new JSDOM(`<html data-lotm-atlas="${theme.id}"><head></head><body><button class="hE4tRW_root" data-turn-process disabled>已完成</button><div class="BE0jCW_root" data-step-process data-group-expanded-mode><div class="VJlF5q_root" data-variant="think"><button data-disclosure-header><span class="VJlF5q_title">思考</span><span class="VJlF5q_summary">A long reasoning preview</span></button></div><div data-tool="command"><span class="EqXNNG_summary">inspect assets/manifest.json</span></div><div data-tool="command" data-state="error"><span class="EqXNNG_summary" data-error>失败</span></div></div><div class="xMeOpW_body"><p>旧档案中的线索</p></div><button id="send" disabled>发送</button></body></html>`);
 const d=dom.window.document,host=d.createElement('style');host.textContent=`[data-disclosure-header]{font-weight:600}.EqXNNG_summary[data-error]{color:${theme.danger}}`;d.head.append(host);
 const own=d.createElement('style');own.textContent=themeCss(theme,'/scene.webp',readability);d.head.append(own);
 return dom;
}
const rgbaChannels=css=>(css.match(/[\d.]+/g)||[]).map(Number);
const rgbHex=values=>'#'+values.slice(0,3).map(v=>Math.round(v).toString(16).padStart(2,'0')).join('');

test('process and prose use translucent reading surfaces with enough contrast over either a bright or dark scene',()=>{
 for(const theme of THEMES)for(const mode of ['clear','balanced']){
  const dom=processStyleFixture(theme,mode),{document,getComputedStyle}=dom.window;
  for(const [surfaceSelector,inkSelectors]of [
   ['[data-step-process]',['.VJlF5q_summary','[data-tool]:not([data-state="error"]) .EqXNNG_summary']],
   ['.xMeOpW_body',['.xMeOpW_body']],
  ]){
   const surface=rgbaChannels(getComputedStyle(document.querySelector(surfaceSelector)).backgroundColor),opacity=surface[3]??1;
   assert.ok(opacity>0&&opacity<1,`${theme.name} ${surfaceSelector} stays translucent`);
   for(const backdrop of [0,255])for(const selector of inkSelectors){
    const background=rgbHex(surface.map(v=>v*opacity+backdrop*(1-opacity)));
    const ink=rgbHex(rgbaChannels(getComputedStyle(document.querySelector(selector)).color));
    assert.ok(contrastRatio(ink,background)>=4.5,`${theme.name} ${selector} on ${backdrop}`);
   }
  }
  dom.window.close();
 }
});

test('read-only progress labels remain visible while disabled actions and error states keep their semantics',()=>{
 const theme=THEMES.find(t=>t.id==='2'),dom=processStyleFixture(theme),{document,getComputedStyle}=dom.window;
 const progress=document.querySelector('[data-turn-process]');
 assert.equal(progress.disabled,true);assert.equal(getComputedStyle(progress).opacity,'1');
 assert.equal(getComputedStyle(document.querySelector('#send')).opacity,'0.45');
 assert.equal(rgbHex(rgbaChannels(getComputedStyle(document.querySelector('[data-error]')).color)),theme.danger.toLowerCase());
 assert.ok(Number(getComputedStyle(document.querySelector('.VJlF5q_summary')).fontWeight)<600);
 assert.equal(document.querySelector('.VJlF5q_summary').textContent,'A long reasoning preview');
 dom.window.close();
});

test('settings portals and theme choices use the active palette instead of host blue',()=>{
 for(const theme of THEMES){
  const dom=new JSDOM(`<html data-lotm-atlas="${theme.id}"><head></head><body><div role="dialog" data-shortcut-modal="settings"><nav><button class="AnXs9G_navCell AnXs9G_active" aria-current="true">通用设置</button></nav><section class="lotm-atlas-settings"><button class="lotm-atlas-choice" aria-pressed="true"></button></section><input id="field"><button role="switch" aria-checked="true"></button></div></body></html>`);
  const {document,getComputedStyle}=dom.window;
  const host=document.createElement('style');host.textContent='body{--dsw-alias-brand-primary:#6688ff;--dsw-alias-bg-layer-2:#fff}.AnXs9G_active{background:#dde5ff}'+SETTINGS_CSS;document.head.append(host);
  const own=document.createElement('style');own.textContent=themeCss(theme,'/scene.webp');document.head.append(own);
  const choice=getComputedStyle(document.querySelector('.lotm-atlas-choice'));
  assert.equal(rgbHex(rgbaChannels(choice.borderTopColor)),theme.accent.toLowerCase());
  assert.notEqual(getComputedStyle(document.querySelector('[aria-current]')).backgroundColor,'rgb(221, 229, 255)');
  assert.equal(getComputedStyle(document.querySelector('[role="dialog"]')).getPropertyValue('--dsw-alias-brand-primary').trim(),theme.accent);
  own.remove();
  assert.equal(getComputedStyle(document.querySelector('[aria-current]')).backgroundColor,'rgb(221, 229, 255)','removing the theme restores host settings');
  dom.window.close();
 }
});

test('prose, process and composer have separate surface weights',()=>{
 for(const theme of THEMES){
  const dom=processStyleFixture(theme),{document,getComputedStyle}=dom.window;
  const composer=document.createElement('div');composer.dataset.composerCard='';document.body.append(composer);
  const values=['.xMeOpW_body','[data-step-process]','[data-composer-card]'].map(selector=>getComputedStyle(document.querySelector(selector)).backgroundColor);
  assert.equal(new Set(values).size,3,theme.name);
  dom.window.close();
 }
});
