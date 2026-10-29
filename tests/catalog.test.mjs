import test from 'node:test';
import assert from 'node:assert/strict';
import {THEMES} from '../src/catalog.mjs';
import {contrastRatio} from '../src/core.mjs';
test('ten correct pathway levels, including Seer and Fool',()=>{
 assert.equal(THEMES.length,10);
 assert.deepEqual(THEMES.map(t=>t.id),['9','8','7','6','5','4','3','2','1','0']);
 assert.deepEqual(THEMES.map(t=>t.name),['占卜家','小丑','魔术师','无面人','秘偶大师','诡法师','古代学者','奇迹师','诡秘侍者','愚者']);
 assert.equal(THEMES.find(t=>t.id==='8').dark,false,'approved Clown remains light');
 assert.ok(THEMES.some(t=>t.dark)&&THEMES.some(t=>!t.dark),'the collection mixes light and dark');
 assert.ok(THEMES.some(t=>t.gradient)&&THEMES.some(t=>!t.gradient),'decorative gradients are selective');
});
test('every primary/secondary/controls/code pairing remains legible',()=>{
 for(const t of THEMES){
  for(const bg of [t.bg,t.panel,t.panelSoft]){
   assert.ok(contrastRatio(t.text,bg)>=7,t.name+' primary');
   assert.ok(contrastRatio(t.muted,bg)>=4.5,t.name+' secondary');
  }
  assert.ok(contrastRatio(t.onAccent,t.accent)>=4.5,t.name+' button');
  for(const bg of [t.panel,t.panelSoft,t.sidebar])assert.ok(contrastRatio(t.aux,bg)>=4.5,t.name+' auxiliary links/icons');
  assert.ok(contrastRatio(t.codeText,t.codeBg)>=7,t.name+' code');
 }
});

