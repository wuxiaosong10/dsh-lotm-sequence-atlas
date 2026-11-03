import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {createNativeSkin} from '../src/native-skin.mjs';

function setup(){
 const dom=new JSDOM(`<body><aside class="host_sidebarCol"><div class="host_logoRow"><span class="host_brandName">deepseek HARNESS</span></div><button class="host_newSession" aria-label="新建会话"><svg></svg><span>新会话</span></button><nav><button class="host_panelRow"><svg></svg><span>插件</span></button><button class="host_panelRow">自动化任务</button><button class="host_panelRow">任务看板</button></nav><span class="host_sectionLabel">工作区</span></aside><main class="host_centerCol"><div class="WOwLGG_headline"><span>探索未至之境</span></div><div data-composer-card><div class="GRgSLq_placeholder">录入问题</div><div contenteditable="true">插件是我输入的正文</div><textarea placeholder="录入问题"></textarea></div><article class="xMeOpW_body">插件 自动化任务 工作区</article></main></body>`);
 const d=dom.window.document,skin=createNativeSkin(d);return{dom,d,skin,stop(){skin.dispose();dom.window.close();}};
}
test('theme names and downloaded-icon markers change only native chrome, preserving controls and user text',()=>{
 const f=setup(),{d,skin}=f;let clicks=0;const button=d.querySelector('.host_newSession');button.addEventListener('click',()=>clicks++);
 const svg=button.querySelector('svg');skin.setEnabled(true);
 assert.equal(button.textContent,'塔罗会');assert.equal(button.getAttribute('aria-label'),'塔罗会');
 assert.deepEqual([...d.querySelectorAll('.host_panelRow')].map(n=>n.textContent),['封印物','秘偶','亵渎石板']);
 assert.equal(d.querySelector('.host_sectionLabel').textContent,'成神途径');
 assert.equal(d.querySelector('.WOwLGG_headline').textContent,'欢迎来到诡秘世界');
 assert.equal(button.dataset.lotmIcon,'cards');assert.equal(d.querySelector('.host_panelRow').dataset.lotmIcon,'cube');
 assert.equal(d.querySelectorAll('.host_panelRow')[1].dataset.lotmIcon,'masks-theater');
 assert.equal(button.querySelector('svg'),svg);button.click();assert.equal(clicks,1);
 assert.equal(d.querySelector('article').textContent,'插件 自动化任务 工作区');
 assert.equal(d.querySelector('[contenteditable]').textContent,'插件是我输入的正文');f.stop();
});
test('placeholder changes do not change editor values, and closing restores original text and attributes',()=>{
 const f=setup(),{d,skin}=f,ta=d.querySelector('textarea');ta.value='已输入的任务';skin.setEnabled(true);
 assert.equal(ta.placeholder,'我有一个任务要发布');assert.equal(ta.value,'已输入的任务');
 assert.equal(d.querySelector('.GRgSLq_placeholder').textContent,'我有一个任务要发布');
 skin.setEnabled(false);
 assert.equal(ta.placeholder,'录入问题');assert.equal(ta.value,'已输入的任务');
 assert.equal(d.querySelector('.host_newSession').textContent,'新会话');
 assert.equal(d.querySelector('.host_newSession').getAttribute('aria-label'),'新建会话');
 assert.equal(d.querySelector('.WOwLGG_headline').textContent,'探索未至之境');
 assert.equal(d.querySelector('[data-lotm-icon]'),null);assert.equal(d.querySelector('.lotm-brand-label'),null);f.stop();
});
test('late native control mounts are themed and external changes are not overwritten on cleanup',async()=>{
 const f=setup(),{d,skin}=f;skin.setEnabled(true);const nav=d.querySelector('nav');
 const button=d.createElement('button');button.className='host_panelRow';button.textContent='插件';nav.append(button);
 await new Promise(r=>f.dom.window.setTimeout(r,15));assert.equal(button.textContent,'封印物');
 const original=d.querySelector('.host_newSession');original.firstChild.remove();
 original.textContent='其他插件的新名称';original.setAttribute('aria-label','外部名称');
 skin.setEnabled(false);assert.equal(original.textContent,'其他插件的新名称');assert.equal(original.getAttribute('aria-label'),'外部名称');
 button.textContent='插件';await new Promise(r=>f.dom.window.setTimeout(r,15));assert.equal(button.textContent,'插件');f.stop();
});

test('collapsed sidebar keeps its native toggle and does not gain a full brand label',()=>{
 const dom=new JSDOM('<body><aside class="host_sidebarCol"><div class="wtg9ga_root wtg9ga_collapsed"><div class="host_logoRow"><button aria-label="展开侧栏"></button></div></div></aside></body>');
 const d=dom.window.document,skin=createNativeSkin(d),toggle=d.querySelector('button');skin.setEnabled(true);
 assert.equal(d.querySelector('.lotm-brand-label'),null);assert.equal(d.querySelector('button'),toggle);
 skin.dispose();dom.window.close();
});

test('four-corner sidebar frame mounts once and is fully removed on close',()=>{
 const f=setup(),{d,skin}=f;skin.setEnabled(true);skin.setEnabled(true);
 const frames=d.querySelectorAll('.lotm-sidebar-frame');assert.equal(frames.length,1);
 assert.equal(frames[0].getAttribute('aria-hidden'),'true');
 assert.deepEqual([...frames[0].children].map(n=>n.dataset.corner),['tl','tr','bl','br']);
 skin.setEnabled(false);assert.equal(d.querySelector('.lotm-sidebar-frame'),null);f.stop();
});

test('decorative wordmark retains real text and falls back when its image cannot load',()=>{
 const f=setup(),{d,skin}=f;skin.setEnabled(true);const label=d.querySelector('.lotm-brand-label'),image=label.querySelector('img');
 assert.ok(image);assert.equal(label.textContent,'诡秘之主');assert.equal(label.dataset.lotmWordmark,undefined);
 image.dispatchEvent(new f.dom.window.Event('load'));assert.equal(label.dataset.lotmWordmark,'ready');
 image.dispatchEvent(new f.dom.window.Event('error'));assert.equal(label.dataset.lotmWordmark,undefined);
 skin.setEnabled(false);image.dispatchEvent(new f.dom.window.Event('load'));assert.equal(d.querySelector('.lotm-brand-label'),null);f.stop();
});
test('sidebar relics follow their native controls and leave the fallback available until loaded',async()=>{
 const f=setup(),{d,skin}=f;
 const buttons=[...d.querySelectorAll('.host_newSession,.host_panelRow')];
 skin.setEnabled(true);
 const images=buttons.map(button=>button.querySelector('img'));
 assert.ok(images.every(image=>image?.hidden && image.alt===''));
 assert.deepEqual(images.map(image=>image.getAttribute('src').split('/').at(-1)),['cards.webp','cube.webp','masks-theater.webp','script.webp']);
 const [tarot]=images,{Event}=f.dom.window;
 tarot.dispatchEvent(new Event('load'));
 assert.equal(tarot.hidden,false);
 tarot.dispatchEvent(new Event('error'));
 assert.equal(tarot.hidden,true);
 skin.setEnabled(true);
 assert.equal(buttons[0].querySelector('img'),tarot);
 buttons[1].querySelector('span').textContent='任务看板';
 await new Promise(resolve=>f.dom.window.setTimeout(resolve,0));
 assert.equal(buttons[1].querySelector('img')?.getAttribute('src').split('/').at(-1),'script.webp');
 assert.equal(images[1].isConnected,false);
 skin.setEnabled(false);
 assert.ok(buttons.every(button=>!button.querySelector('img')));
 f.stop();
});
