import test from 'node:test';
import assert from 'node:assert/strict';
import * as core from '../src/core.mjs';
import { THEMES } from '../src/catalog.mjs';

const defaults = { sequence: 'native', readability: 'clear' };

test('public core is usable without a DOM or browser globals', () => {
  for (const name of ['normalizeState', 'hexRgb', 'contrastRatio', 'alpha', 'themeTokens', 'createSelectionStore']) {
    assert.equal(typeof core[name], 'function', `missing ${name}`);
  }
  assert.equal(core.STORAGE_KEY, 'dsh-lotm-sequence-atlas/v1');
});

test('saved selection accepts all ten sequences and strips unrelated fields', () => {
  for (let sequence = 0; sequence <= 9; sequence += 1) {
    assert.deepEqual(core.normalizeState(JSON.stringify({ version: 1, sequence, readability: 'balanced', otherPlugin: 'untouched' })), {
      sequence: String(sequence), readability: 'balanced',
    });
  }
  assert.deepEqual(core.normalizeState({ sequence: 'native', readability: 'clear', malicious: true }), defaults);
});

test('corrupt, missing and unknown saved states return a safe native selection', () => {
  for (const raw of [undefined, null, '', '{broken', 'null', '[]', [], 42, true]) {
    assert.deepEqual(core.normalizeState(raw), defaults);
  }
  for (const sequence of ['10', '-1', '09', 'bogus', 0.5, false, {}, NaN]) {
    assert.deepEqual(core.normalizeState({ sequence }), defaults);
  }
  assert.deepEqual(core.normalizeState({ sequence: '4', readability: 'bogus' }), { sequence: '4', readability: 'clear' });
});

test('color functions use RGB channels and WCAG relative luminance', () => {
  assert.deepEqual(core.hexRgb('#123abc'), [18, 58, 188]);
  assert.deepEqual(core.hexRgb('#AbC'), [170, 187, 204]);
  assert.equal(core.contrastRatio('#000000', '#ffffff'), 21);
  assert.equal(core.contrastRatio('#ffffff', '#000000'), 21);
  assert.equal(core.contrastRatio('#123456', '#123456'), 1);
  assert.ok(Math.abs(core.contrastRatio('#777777', '#ffffff') - 4.478089453577214) < 1e-10);
  assert.equal(core.alpha('#123abc', 0.24), 'rgba(18, 58, 188, 0.24)');
  assert.equal(core.alpha('#fff', -2), 'rgba(255, 255, 255, 0)');
  assert.equal(core.alpha('#000', 5), 'rgba(0, 0, 0, 1)');
  for (const color of ['red', '#xyz', '#12', '#abcd', null]) assert.throws(() => core.hexRgb(color), TypeError);
  assert.throws(() => core.alpha('#ffffff', NaN), TypeError);
});

const palette = {
  bg: '#111111', panel: '#222222', panelSoft: '#333333', sidebar: '#121212',
  text: '#eeeeee', muted: '#aaaaaa', accent: '#bb88ff', aux: '#88c3c7', onAccent: '#151515',
  codeBg: '#232323', codeText: '#dddddd', line: '#555555',
  success: '#55aa77', warning: '#ddaa44', danger: '#dd6677', dark: true,
};

test('theme token pairs cover native surfaces and preserve the selected palette in either host scheme', () => {
  const pairs = core.themeTokens(palette);
  const expected = {
    '--dsw-alias-bg-base': palette.bg,
    '--dsw-alias-bg-layer-1': palette.panel,
    '--dsw-alias-bg-layer-2': palette.panelSoft,
    '--dsw-alias-bg-layer-3': palette.panelSoft,
    '--dsw-alias-bg-layer-4': palette.panelSoft,
    '--dsw-alias-bg-overlay': palette.panel,
    '--dsw-alias-bg-base-inverse': palette.panel,
    '--dsw-alias-settings-card-fill': palette.panelSoft,
    '--dsw-alias-settings-card-stroke': palette.line,
    '--dsw-specific-sidebar-fill': palette.sidebar,
    '--dsw-alias-label-primary': palette.text,
    '--dsw-alias-label-secondary': palette.muted,
    '--dsw-alias-label-tertiary': palette.muted,
    '--dsw-alias-label-inverse': palette.onAccent,
    '--dsw-alias-label-dimmed': palette.muted,
    '--dsw-alias-label-primary-dimmed': palette.text,
    '--dsw-alias-label-primary-bluish': palette.aux,
    '--dsw-alias-label-document-preview': palette.text,
    '--dsw-alias-label-primary-foreground': palette.onAccent,
    '--dsw-alias-label-primary-inverted': palette.onAccent,
    '--dsw-alias-brand-primary': palette.accent,
    '--dsw-alias-state-business-primary': palette.accent,
    '--dsw-alias-state-error-primary': palette.danger,
    '--dsw-alias-state-warn-primary': palette.warning,
    '--dsw-alias-state-success-primary': palette.success,
    '--dsw-alias-state-idle-primary': palette.muted,
    '--dsw-alias-markdown-code-block': palette.codeBg,
    '--dsw-focus-ring-color': palette.accent,
    '--dsw-alias-button-primary-fill': palette.accent,
    '--dsw-alias-primary-foreground': palette.onAccent,
  };
  for (const [name, value] of Object.entries(expected)) assert.deepEqual(pairs[name], { light: value, dark: value }, name);
  assert.ok(pairs['--dsw-alias-button-primary-hover']);
  for (const [name, pair] of Object.entries(pairs)) {
    assert.deepEqual(Object.keys(pair).sort(), ['dark', 'light'], name);
    assert.equal(pair.light, pair.dark, name);
    assert.equal(typeof pair.light, 'string', name);
    assert.ok(pair.light.length > 0 && !pair.light.includes('undefined'), name);
  }
  assert.equal(JSON.stringify(palette).includes('focus'), false, 'caller palette is not mutated');
});

test('partial themes have complete string values instead of leaking undefined', () => {
  for (const input of [{}, null, { accent: '#123456' }]) {
    const pairs = core.themeTokens(input);
    assert.ok(Object.keys(pairs).length >= 40);
    for (const pair of Object.values(pairs)) {
      assert.equal(typeof pair.light, 'string');
      assert.ok(!pair.light.includes('undefined'));
    }
  }
});

test('caption text remains readable after compositing on every shipped theme surface', () => {
  for (const theme of THEMES) {
    const token = core.themeTokens(theme)['--dsw-alias-label-caption'];
    for (const scheme of ['light', 'dark']) {
      for (const surface of ['bg', 'panel', 'panelSoft', 'sidebar']) {
        const color = token[scheme];
        const rgba = /^rgba\((\d+), (\d+), (\d+), ([\d.]+)\)$/.exec(color);
        const background = core.hexRgb(theme[surface]);
        const rendered = rgba
          ? `#${background.map((channel, index) => Math.round(Number(rgba[index + 1]) * Number(rgba[4]) + channel * (1 - Number(rgba[4]))).toString(16).padStart(2, '0')).join('')}`
          : color;
        const ratio = core.contrastRatio(rendered, theme[surface]);
        assert.ok(ratio >= 4.5, `${theme.id} ${scheme} ${surface}: caption contrast ${ratio.toFixed(2)}`);
      }
    }
  }
});

function memoryStorage(initial) {
  const values = new Map(Object.entries(initial ?? {}));
  const reads = [];
  const writes = [];
  return {
    values, reads, writes,
    getItem(key) { reads.push(key); return values.get(key) ?? null; },
    setItem(key, value) { writes.push([key, value]); values.set(key, value); },
  };
}

test('selection store restores, persists and notifies without touching another plugin key', () => {
  const storage = memoryStorage({
    [core.STORAGE_KEY]: JSON.stringify({ version: 1, sequence: '7', readability: 'balanced' }),
    'other-plugin': 'keep-me',
  });
  const changes = [];
  const store = core.createSelectionStore(storage, { onChange: (state) => changes.push(state) });
  assert.deepEqual(storage.reads, [core.STORAGE_KEY]);
  assert.deepEqual(store.state(), { sequence: '7', readability: 'balanced' });
  const snapshot = store.state();
  snapshot.sequence = '0';
  assert.equal(store.state().sequence, '7');
  store.select(0);
  store.setReadability('clear');
  assert.deepEqual(store.state(), { sequence: '0', readability: 'clear' });
  assert.equal(changes.length, 2);
  assert.deepEqual(core.normalizeState(storage.values.get(core.STORAGE_KEY)), store.state());
  assert.equal(storage.values.get('other-plugin'), 'keep-me');
  assert.ok(storage.writes.every(([key]) => key === core.STORAGE_KEY));
  store.select('0');
  store.setReadability('clear');
  assert.equal(changes.length, 2, 'unchanged selection does not issue redundant changes');
});

test('invalid store updates do not overwrite a valid selection', () => {
  const storage = memoryStorage();
  const store = core.createSelectionStore(storage);
  for (const sequence of ['10', '09', '', null, false, NaN]) assert.throws(() => store.select(sequence), RangeError);
  assert.throws(() => store.setReadability('unreadable'), RangeError);
  assert.deepEqual(store.state(), defaults);
  assert.equal(storage.writes.length, 0);
});

test('storage read/write failures and corrupt content do not break in-memory switching', () => {
  const corrupt = core.createSelectionStore(memoryStorage({ [core.STORAGE_KEY]: '{bad' }));
  assert.deepEqual(corrupt.state(), defaults);
  const store = core.createSelectionStore({
    getItem() { throw new Error('storage disabled'); },
    setItem() { throw new Error('quota exceeded'); },
  });
  assert.deepEqual(store.state(), defaults);
  assert.doesNotThrow(() => store.select('3'));
  assert.equal(store.state().sequence, '3');
  assert.doesNotThrow(() => core.createSelectionStore());
});

test('subscription disposal stops notifications and isolates listener snapshots', () => {
  const calls = [];
  const store = core.createSelectionStore(memoryStorage(), { onChange: () => calls.push('initial') });
  const remove = store.subscribe((state) => { calls.push('first'); state.sequence = '9'; });
  store.subscribe((state) => calls.push(state.sequence));
  store.select('1');
  assert.deepEqual(calls, ['initial', 'first', '1']);
  assert.equal(store.state().sequence, '1');
  remove();
  remove();
  store.select('2');
  assert.deepEqual(calls, ['initial', 'first', '1', 'initial', '2']);
  store.dispose();
  store.select('3');
  assert.deepEqual(calls, ['initial', 'first', '1', 'initial', '2']);
});
