import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {THEMES} from '../src/catalog.mjs';
import {themeCss} from '../src/styles.mjs';

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
