export const STORAGE_KEY = 'dsh-lotm-sequence-atlas/v1';

const DEFAULT_STATE = Object.freeze({ sequence: 'native', readability: 'clear' });
const READABILITY = new Set(['clear', 'balanced']);

function sequenceId(value) {
  if (value === 'native') return value;
  if (typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= 9) return String(value);
  return typeof value === 'string' && /^[0-9]$/.test(value) ? value : null;
}

/** Recover only the plugin's supported state fields from untrusted storage. */
export function normalizeState(raw) {
  try {
    const value = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (!value || typeof value !== 'object' || Array.isArray(value)) return { ...DEFAULT_STATE };
    return {
      sequence: sequenceId(value.sequence) ?? DEFAULT_STATE.sequence,
      readability: READABILITY.has(value.readability) ? value.readability : DEFAULT_STATE.readability,
    };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

/** Accept CSS three- or six-digit hexadecimal colors. */
export function hexRgb(hex) {
  if (typeof hex !== 'string' || !/^#(?:[a-f\d]{3}|[a-f\d]{6})$/i.test(hex)) {
    throw new TypeError('Expected a three- or six-digit hex color');
  }
  const digits = hex.length === 4 ? [...hex.slice(1)].map((digit) => digit + digit).join('') : hex.slice(1);
  return [0, 2, 4].map((offset) => Number.parseInt(digits.slice(offset, offset + 2), 16));
}

function luminance(hex) {
  const [red, green, blue] = hexRgb(hex).map((channel) => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return red * 0.2126 + green * 0.7152 + blue * 0.0722;
}

export function contrastRatio(first, second) {
  const a = luminance(first);
  const b = luminance(second);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

export function alpha(hex, opacity) {
  if (!Number.isFinite(opacity)) throw new TypeError('Expected a finite opacity');
  return `rgba(${hexRgb(hex).join(', ')}, ${Math.max(0, Math.min(1, opacity))})`;
}

const FALLBACK_THEME = Object.freeze({
  bg: '#171923', panel: '#202330', panelSoft: '#282c3b', sidebar: '#151721',
  text: '#f4f0e8', muted: '#b6b0a8', accent: '#d5b976', aux: '#91bfc2', onAccent: '#211a10',
  codeBg: '#10121a', codeText: '#e6dcc5', line: '#494451',
  success: '#8fbc9a', warning: '#d7b77e', danger: '#d38f94', dark: true,
});

/** Both scheme entries use the selected palette; host scheme flips keep it intact. */
export function themeTokens(theme) {
  const source = theme && typeof theme === 'object' ? theme : {};
  const style = Object.fromEntries(Object.entries(FALLBACK_THEME).map(([key, fallback]) => [
    key, key === 'dark' ? (typeof source.dark === 'boolean' ? source.dark : fallback)
      : (typeof source[key] === 'string' && source[key].length > 0 ? source[key] : fallback),
  ]));
  const hover = alpha(style.aux, style.dark ? 0.18 : 0.1);
  const selected = alpha(style.aux, style.dark ? 0.24 : 0.14);
  const values = {
    '--dsw-alias-bg-base': style.bg,
    '--dsw-alias-bg-layer-1': style.panel,
    '--dsw-alias-bg-layer-2': style.panelSoft,
    '--dsw-alias-bg-layer-3': style.panelSoft,
    '--dsw-alias-bg-layer-4': style.panelSoft,
    '--dsw-alias-bg-overlay': style.panel,
    '--dsw-alias-bg-base-inverse': style.panel,
    '--dsw-alias-bg-module-platform': selected,
    '--dsw-alias-button-elevated-fill': style.panel,
    '--dsw-alias-button-floating-fill': style.panelSoft,
    '--dsw-alias-button-floating-hover': style.panelSoft,
    '--dsw-alias-button-info-fill': style.accent,
    '--dsw-alias-button-info-hover': style.accent,
    '--dsw-alias-button-primary-fill': style.accent,
    '--dsw-alias-button-primary-hover': style.accent,
    '--dsw-alias-primary-foreground': style.onAccent,
    '--dsw-alias-chat-bubble-fill': style.panelSoft,
    '--dsw-alias-toolbar-fill': style.panelSoft,
    '--dsw-specific-input-major': style.panel,
    '--dsw-specific-selector': selected,
    '--dsw-specific-sidebar-fill': style.sidebar,
    '--dsw-alias-border-l1': style.line,
    '--dsw-alias-border-l2': style.line,
    '--dsw-alias-border-l3': style.line,
    '--dsw-alias-border-l4': style.line,
    '--dsw-alias-label-primary': style.text,
    '--dsw-alias-label-secondary': style.muted,
    '--dsw-alias-label-tertiary': style.muted,
    '--dsw-alias-label-caption': style.muted,
    '--dsw-alias-label-inverse': style.onAccent,
    '--dsw-alias-label-dimmed': style.muted,
    '--dsw-alias-label-primary-dimmed': style.text,
    '--dsw-alias-label-primary-bluish': style.aux,
    '--dsw-alias-label-document-preview': style.text,
    '--dsw-alias-label-deep-diving': style.aux,
    '--dsw-alias-label-deep-diving-shimmer': style.aux,
    '--dsw-alias-label-shimmer': style.muted,
    '--dsw-alias-label-primary-foreground': style.onAccent,
    '--dsw-alias-label-primary-inverted': style.onAccent,
    '--dsw-alias-markdown-placeholder': style.muted,
    '--dsw-alias-state-warn-label': style.warning,
    '--dsw-alias-state-business-secondary': selected,
    '--dsw-alias-state-business-tertiary': style.panelSoft,
    '--dsw-alias-toast-bg': style.panel,
    '--dsw-alias-toast-label': style.text,
    '--dsw-alias-tooltip-bg': style.panel,
    '--dsw-alias-tooltip-key-bg': style.panelSoft,
    '--dsw-alias-brand-primary': style.accent,
    '--dsw-alias-state-business-primary': style.accent,
    '--dsw-alias-state-error-primary': style.danger,
    '--dsw-alias-state-warn-primary': style.warning,
    '--dsw-alias-state-success-primary': style.success,
    '--dsw-alias-state-idle-primary': style.muted,
    '--dsw-alias-interactive-bg-hover': hover,
    '--dsw-alias-interactive-bg-hover-solid': style.panelSoft,
    '--dsw-alias-interactive-bg-pressed': hover,
    '--dsw-alias-interactive-bg-selected': selected,
    '--dsw-alias-settings-card-fill': style.panelSoft,
    '--dsw-alias-settings-card-stroke': style.line,
    '--dsw-alias-markdown-code-block': style.codeBg,
    '--dsw-alias-markdown-code-text': style.codeText,
    '--dsw-alias-scrollbar-bg-l1': alpha(style.muted, 0.45),
    '--dsw-alias-scrollbar-bg-l2': alpha(style.muted, 0.45),
    '--dsw-alias-scrollbar-hover-l1': alpha(style.accent, 0.6),
    '--dsw-alias-scrollbar-hover-l2': alpha(style.accent, 0.6),
    '--dsw-focus-ring-color': style.accent,
  };
  return Object.fromEntries(Object.entries(values).map(([name, value]) => [name, { light: value, dark: value }]));
}

/** Storage is injected so state selection also works without a browser. */
export function createSelectionStore(storage, { onChange } = {}) {
  let current = { ...DEFAULT_STATE };
  try {
    current = normalizeState(storage?.getItem(STORAGE_KEY));
  } catch {
    // Restricted WebViews may deny storage while the plugin remains usable.
  }
  const listeners = new Set();
  if (typeof onChange === 'function') listeners.add(onChange);

  function update(next) {
    if (next.sequence === current.sequence && next.readability === current.readability) return;
    current = next;
    try {
      storage?.setItem(STORAGE_KEY, JSON.stringify({ version: 1, ...current }));
    } catch {
      // Quota and access failures must not prevent in-memory theme switching.
    }
    for (const listener of [...listeners]) listener({ ...current });
  }

  return {
    state: () => ({ ...current }),
    select(sequence) {
      const id = sequenceId(sequence);
      if (id === null) throw new RangeError('Unknown sequence');
      update({ ...current, sequence: id });
    },
    setReadability(readability) {
      if (!READABILITY.has(readability)) throw new RangeError('Unknown readability setting');
      update({ ...current, readability });
    },
    subscribe(listener) {
      if (typeof listener !== 'function') throw new TypeError('Expected a listener function');
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    dispose() { listeners.clear(); },
  };
}
