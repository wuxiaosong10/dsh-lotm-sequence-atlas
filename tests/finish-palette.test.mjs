import test from 'node:test';
import assert from 'node:assert/strict';
import { THEMES } from '../src/catalog.mjs';
import { contrastRatio } from '../src/core.mjs';

const syntaxKeys = ['codeText', 'codeKeyword', 'codeString', 'codeFunction', 'codeNumber', 'codeComment'];

test('each sequence has its own code surface instead of a shared dark fallback', () => {
 assert.equal(new Set(THEMES.map(theme => theme.codeBg)).size, 10);
});

test('code text and every syntax role are readable on each sequence code surface', () => {
 for (const theme of THEMES) {
  for (const key of syntaxKeys) {
   assert.match(theme[key] ?? '', /^#[0-9A-F]{6}$/i, `${theme.name} ${key} is a color`);
   assert.ok(contrastRatio(theme[key], theme.codeBg) >= 4.5, `${theme.name} ${key} contrast`);
  }
  assert.ok(new Set(syntaxKeys.map(key => theme[key])).size >= 3, `${theme.name} syntax colors remain distinct`);
 }
});

test('sequence chrome and typography are present without weakening body text contrast', () => {
 for (const theme of THEMES) {
  assert.match(theme.chromeBg ?? '', /^#[0-9A-F]{6}$/i, `${theme.name} chrome color`);
  assert.ok(contrastRatio(theme.text, theme.chromeBg) >= 7, `${theme.name} chrome text`);
  assert.ok(contrastRatio(theme.muted, theme.chromeBg) >= 4.5, `${theme.name} chrome secondary`);
  assert.ok(theme.displayFont?.includes('STSong') && theme.displayFont?.includes('SimSun'), `${theme.name} Song display font`);
  assert.ok(theme.uiFont?.includes('Microsoft YaHei UI'), `${theme.name} Chinese body font`);
  assert.ok(theme.uiFont?.includes('Segoe UI'), `${theme.name} system UI font`);
  assert.ok(theme.codeFont?.includes('Cascadia Code') && theme.codeFont?.includes('Consolas'), `${theme.name} code font`);
 }
});
