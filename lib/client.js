window.__ModuleLoader__.load({
  id: 'dsh-lotm-sequence-atlas',
  factory: (require) => {
    const React = require('react');
    const h = React.createElement;
    const exports = {};
    const STORAGE_KEY = 'dsh-lotm-sequence-atlas/v1';

const DEFAULT_STATE = Object.freeze({ sequence: 'native', readability: 'clear' });
const READABILITY = new Set(['clear', 'balanced']);

function sequenceId(value) {
  if (value === 'native') return value;
  if (typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= 9) return String(value);
  return typeof value === 'string' && /^[0-9]$/.test(value) ? value : null;
}

/** Recover only the plugin's supported state fields from untrusted storage. */
function normalizeState(raw) {
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
function hexRgb(hex) {
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

function contrastRatio(first, second) {
  const a = luminance(first);
  const b = luminance(second);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

function alpha(hex, opacity) {
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
function themeTokens(theme) {
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
function createSelectionStore(storage, { onChange } = {}) {
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

    
const ICON_NAMES=['cards','cube','masks-theater','script','stairs-up','eye','eye-off','moon-stars','pentagram','send','paperclip','settings','plus','x','minus','chevron-down','search','layout-sidebar'];
const ICON_CSS=ICON_NAMES.map(name=>`[data-lotm-glyph="${name}"],[data-lotm-icon="${name}"]{--lotm-icon:url('/api/lotm-sequence-atlas/assets/icons/tabler/original/${name}.svg')}`).join('\n');
const SETTINGS_CSS = `
${ICON_CSS}
.lotm-ui-icon{display:inline-block;flex:none;width:18px;height:18px;background:currentColor;mask:var(--lotm-icon) center/contain no-repeat;-webkit-mask:var(--lotm-icon) center/contain no-repeat}
.lotm-atlas-settings{padding:16px 0;display:grid;gap:12px;border-bottom:1px solid var(--dsw-alias-border-l2);color:var(--dsw-alias-label-primary);font:inherit}
.lotm-atlas-heading{display:flex;align-items:center;justify-content:space-between;gap:12px}
.lotm-atlas-heading small{margin-left:12px;color:var(--dsw-alias-label-secondary);font-size:12px}
.lotm-atlas-tools{display:flex;gap:8px}
.lotm-atlas-tools button{width:30px;height:30px;display:grid;place-items:center;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);border-radius:8px;cursor:pointer}
.lotm-atlas-tools svg{width:17px;height:17px}
.lotm-atlas-tools button[aria-pressed=true]{background:var(--dsw-alias-interactive-bg-selected)}
.lotm-atlas-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:9px}
.lotm-atlas-choice{appearance:none;padding:0;position:relative;aspect-ratio:1.65;overflow:hidden;min-width:0;border:2px solid transparent;border-radius:9px;background:var(--dsw-alias-bg-layer-2);cursor:pointer;transition:border-color 120ms,transform 120ms}
.lotm-atlas-choice img{display:block;width:100%;height:100%;object-fit:cover}
.lotm-atlas-choice[aria-pressed=true]{border-color:var(--dsw-alias-brand-primary);box-shadow:0 0 0 1px var(--dsw-alias-brand-primary)}
.lotm-atlas-choice:hover{transform:translateY(-1px)}
.lotm-atlas-settings button:focus-visible{outline:2px solid var(--dsw-alias-brand-primary)!important;outline-offset:3px!important}
@media(max-width:600px){.lotm-atlas-grid{grid-template-columns:repeat(3,minmax(0,1fr))}.lotm-atlas-heading small{display:block;margin:3px 0 0}}
@media(prefers-reduced-motion:reduce){.lotm-atlas-choice{transition:none}.lotm-atlas-choice:hover{transform:none}}
`;

function themeCss(t, assetUrl, readability = 'clear') {
  const scope = 'html[data-lotm-atlas]';
  // A continuous content wash, not an overlay on top of output or controls.
  const wash = alpha(t.bg, readability === 'clear' ? 0.98 : 0.92);
  const soft = alpha(t.bg, readability === 'clear' ? 0.90 : 0.78);
  return `
${scope}{color-scheme:${t.dark ? 'dark' : 'light'};--lotm-text:${t.text};--lotm-panel:${t.panel};--lotm-code:${t.codeBg};--lotm-muted:${t.muted};background:${t.bg}!important}
${scope} body{background:${t.bg}!important;color:${t.text}!important;background-image:none!important;font-family:"Segoe UI","Microsoft YaHei UI",sans-serif!important}
${scope} #lotm-atlas-background{position:fixed;inset:0;z-index:0;pointer-events:none;background-color:${t.bg};background-image:linear-gradient(90deg,${wash} 0%,${wash} 35%,${soft} 55%,transparent 81%),url(${JSON.stringify(assetUrl)});background-size:cover,cover;background-position:center,right center;background-repeat:no-repeat}
${scope} #root{position:relative;z-index:1;background:transparent!important}
${scope} #root > [class*="frame"],${scope} .mP3x-q_frame,${scope} [class*="centerCol"]{background:transparent!important;background-image:none!important}
${scope} [class*="centerCol"] > div,${scope} .an3WzG_root,${scope} [data-conversation-region="chat"],${scope} [data-chat-flow]{background:transparent!important;background-image:none!important}
${scope} [class*="sidebarCol"],${scope} [class*="rightbarCol"]{background:${alpha(t.sidebar,0.97)}!important;background-image:none!important;color:${t.text}!important;box-shadow:none!important;backdrop-filter:none!important}
${scope} header[class*="header"]{background:${alpha(t.bg,0.96)}!important;background-image:none!important;color:${t.text}!important;border-color:${t.line}!important;box-shadow:none!important}
${scope} .xMeOpW_root,${scope} .xMeOpW_body,${scope} .VJlF5q_thinkBody,${scope} [class*="_markdown_"]{color:${t.text}!important;background-image:none!important;text-shadow:none!important}
${scope} div[data-tool] [class*="title"],${scope} div[data-tool] [class*="fileLink"]{color:${t.text}!important}
${scope} div[data-tool] [class*="summary"],${scope} div[data-tool] [class*="summarySuffix"]{color:${t.muted}!important}
${scope} [class*="_markdown_"] :is(h1,h2,h3,h4,strong,b),${scope} .xMeOpW_body :is(h1,h2,h3,h4,strong,b){color:${t.text}!important}
${scope} .LOmM4q_bubble{background:${t.panelSoft}!important;color:${t.text}!important;box-shadow:none!important}
${scope} .EqXNNG_body,${scope} .hKdVjq_bodyWrap,${scope} .hKdVjq_ioText,${scope} .hKdVjq_codeBody,${scope} .cr4P6W_terminal,${scope} .cr4P6W_ioText{background:${t.codeBg}!important;color:${t.codeText}!important;background-image:none!important;opacity:1!important;text-shadow:none!important}
${scope} pre,${scope} .md-code-block,${scope} [data-code-block-banner],${scope} ._70dcBq_screen{background:${t.codeBg}!important;background-image:none!important;opacity:1!important}
${scope} ._70dcBq_screen{color:${t.codeText}!important}
${scope} [class*="markdown"] :not(pre) > code{background:${t.panelSoft}!important;color:${t.text}!important}
${scope} .GRgSLq_card,${scope} [data-composer-dock],${scope} div[class*="card"]:has([contenteditable="true"]),${scope} div[class*="card"]:has(textarea){background:${t.panel}!important;background-image:none!important;color:${t.text}!important;box-shadow:none!important;border-color:${t.line}!important;backdrop-filter:none!important}
${scope} .GRgSLq_input,${scope} [contenteditable="true"],${scope} textarea{color:${t.text}!important;caret-color:${t.accent}!important;background:transparent!important}
${scope} .GRgSLq_placeholder,${scope} input::placeholder,${scope} textarea::placeholder{color:${t.muted}!important;opacity:1!important}
${scope} [role="dialog"],${scope} [role="menu"],${scope} [role="listbox"],${scope} [role="tooltip"]{background:${t.panel}!important;background-image:none!important;color:${t.text}!important;border-color:${t.line}!important}
${scope} [class*="settings"] [class*="card"],${scope} input:not([type="checkbox"]):not([type="radio"]),${scope} select{background:${t.panelSoft}!important;color:${t.text}!important;border-color:${t.line}!important;background-image:none!important}
${scope} .lotm-atlas-settings{background:transparent!important}
${scope} ::selection{background:${t.accent};color:${t.onAccent}}
@media(max-width:900px){${scope} #lotm-atlas-background{background-image:linear-gradient(${wash},${wash}),url(${JSON.stringify(assetUrl)})}}
${themeFinishCss(t,assetUrl,readability)}
${occultFinishCss(t)}
${readingFinishCss(t,readability)}
`;
}

function readingFinishCss(t,readability){
 const s='html[data-lotm-atlas]';
 const blend=(a,b,weight)=>{
  const second=hexRgb(b);
  return '#'+hexRgb(a).map((value,index)=>Math.round(value*(1-weight)+second[index]*weight).toString(16).padStart(2,'0')).join('');
 };
 const secondary=blend(t.muted,t.text,.28);
 const command=blend(t.text,t.aux||t.accent,.12);
 const surface=alpha(t.panel,readability==='clear'?.80:.62);
 const edge=alpha(t.ornament||t.accent,t.dark?.20:.18);
 const glint=t.dark?'rgba(255,255,255,.045)':'rgba(255,255,255,.52)';
 const process=`${s} [data-step-process][data-group-expanded-mode],${s} [data-step-process]:has(>div>.BE0jCW_title[aria-expanded="true"])`;
 return `
${process},${s} .xMeOpW_body{box-sizing:border-box;min-width:0;background:${surface}!important;border:1px solid ${edge}!important;border-radius:13px!important;padding:12px 16px!important;box-shadow:inset 0 1px 0 ${glint}!important;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);color:${t.text}!important}
${s} [data-step-process] .xMeOpW_body{background:transparent!important;border:0!important;border-radius:0!important;padding:0!important;box-shadow:none!important;backdrop-filter:none;-webkit-backdrop-filter:none}
${s} .xMeOpW_body > :is(p,ul,ol,table),${s} .xMeOpW_body [class*="_markdown_"] > :is(p,ul,ol,table){background:transparent!important;border-radius:0!important}
${s} .xMeOpW_body > p{width:auto!important;margin:0!important}
${s} .xMeOpW_body > :first-child{margin-top:0!important}
${s} .xMeOpW_body > :last-child{margin-bottom:0!important}
${s} [data-step-process] [data-disclosure-header],${s} [data-tool] [data-disclosure-header]{font-family:${t.uiFont}!important;font-size:max(14px,var(--dsh-content-font-size,14px))!important;font-weight:500!important;letter-spacing:.005em;color:${t.text}!important}
${s} .VJlF5q_title,${s} .EqXNNG_title,${s} [data-tool] [class*="title"]{font-weight:500!important;color:${t.text}!important}
${s} .VJlF5q_summary{font-family:${t.uiFont}!important;font-size:max(13px,var(--dsh-content-font-size-secondary,13px))!important;font-weight:400!important;line-height:inherit!important;letter-spacing:.005em;color:${secondary}!important}
${s} .EqXNNG_summary,${s} [data-tool] [class*="summary"]{font-family:${t.codeFont}!important;font-size:max(12.5px,var(--dsh-content-font-size-secondary,13px))!important;font-weight:400!important;line-height:inherit!important;letter-spacing:0;color:${command}!important}
${s} .VJlF5q_summary *,${s} .EqXNNG_summary *,${s} [data-tool] [class*="summary"] *{font-weight:inherit!important;color:inherit!important}
${s} [data-tool="computer"] [class*="summary"]{font-family:${t.uiFont}!important;color:${secondary}!important}
${s} .VJlF5q_leading,${s} .EqXNNG_leading,${s} [data-step-process] .BE0jCW_leading{color:${t.ornament||t.accent}!important}
${s} .BE0jCW_title{font:500 max(13px,var(--dsh-content-font-size-secondary,13px))/1.7 ${t.uiFont}!important;color:${secondary}!important}
${s} .hE4tRW_root{width:fit-content!important;max-width:100%;height:auto!important;min-height:28px;padding:2px 8px!important;margin-block:4px 8px;border:0!important;border-radius:6px!important;background:${surface}!important;color:${secondary}!important;font:500 max(12px,var(--dsh-content-font-size-secondary,13px))/1.65 ${t.uiFont}!important}
${s} .hE4tRW_root:disabled,${s} [data-disclosure-header]:disabled{opacity:1!important}
${s} .hE4tRW_durationNumber{font-family:${t.codeFont}!important;font-variant-numeric:tabular-nums}
${s} ._1KfHza_endInfo,${s} ._1KfHza_timeStart{color:${secondary}!important}
${s} :is(._1KfHza_timeStart,._1KfHza_timeEnd){font:400 max(11.5px,calc(var(--dsh-content-font-size-secondary,13px) - 1px))/1.7 ${t.uiFont}!important;font-variant-numeric:tabular-nums;background:${alpha(t.panel,.72)};border-radius:5px;padding:1px 5px}
${s} .EqXNNG_summary[data-error],${s} [data-tool][data-state="error"] [class*="summary"],${s} [data-tool][data-state="error"] [data-disclosure-header]{color:${t.danger}!important}
@media(max-width:820px){${process},${s} .xMeOpW_body{padding:10px 12px!important;border-radius:10px!important}${s} [data-step-process] .xMeOpW_body{padding:0!important}}
`;
}

function occultFinishCss(t) {
 const s='html[data-lotm-atlas]',ink=t.ornament||t.accent;
 const eye="url('/api/lotm-sequence-atlas/assets/ornaments/occult-eye.png')";
 const corner="url('/api/lotm-sequence-atlas/assets/ornaments/occult-corner.png')";
 const frameCorner="url('/api/lotm-sequence-atlas/assets/ornaments/occult-frame-corner.png')";
 const divider="url('/api/lotm-sequence-atlas/assets/ornaments/occult-divider.png')";
 const wordmark="url('/api/lotm-sequence-atlas/assets/ornaments/lotm-wordmark.png')";
 return `
${s}{--lotm-engraving:${ink}}
${s} [data-lotm-original-brand]{display:none!important}
${s} [class*="sidebarCol"] [class*="logoRow"]{height:48px!important;margin:0 0 5px!important;padding:4px 6px!important;gap:9px!important}
${s} [class*="brandIdentity"]{display:flex!important;align-items:center!important;gap:9px!important;min-width:0;height:32px!important}
${s} .lotm-brand-mark{display:block;flex:none;width:34px;height:34px;background:${ink};mask:${eye} center/contain no-repeat;-webkit-mask:${eye} center/contain no-repeat}
${s} .lotm-brand-label{font:500 22px/1.3 ${t.displayFont};letter-spacing:.08em;color:${t.text};white-space:nowrap}
${s} [class*="brandIdentity"]:has(.lotm-brand-label[data-lotm-wordmark="ready"]){height:40px!important;gap:6px!important;transform:none!important}
${s} .lotm-brand-label[data-lotm-wordmark="ready"]{display:block;flex:0 1 122px;min-width:0;width:122px;height:40px;font-size:0!important;color:transparent!important;letter-spacing:0;background:${ink};mask:${wordmark} center/contain no-repeat;-webkit-mask:${wordmark} center/contain no-repeat}
${s} .lotm-brand-label img{display:none!important}
${s} .lotm-sidebar-frame{position:absolute;display:block;inset:7px 9px 7px 6px;z-index:2;pointer-events:none;border:1px solid ${alpha(ink,.28)};border-radius:2px;box-sizing:border-box}
${s} .lotm-frame-corner{position:absolute;display:block;width:54px;height:54px;background:${ink};opacity:.72;pointer-events:none;mask:${frameCorner} center/contain no-repeat;-webkit-mask:${frameCorner} center/contain no-repeat}
${s} .lotm-frame-corner[data-corner="tl"]{top:-5px;left:-4px}
${s} .lotm-frame-corner[data-corner="tr"]{top:-5px;right:-4px;transform:scaleX(-1)}
${s} .lotm-frame-corner[data-corner="bl"]{bottom:-5px;left:-4px;transform:scaleY(-1)}
${s} .lotm-frame-corner[data-corner="br"]{bottom:-5px;right:-4px;transform:rotate(180deg)}
${s} [class*="sidebarCol"]:has(.wtg9ga_collapsed) .lotm-sidebar-frame{display:none}
${s} [class*="sidebarCol"]::before{content:"";position:absolute;pointer-events:none;left:-66px;bottom:56px;width:300px;height:300px;background:${ink};opacity:${t.dark?.07:.06};mask:${eye} center/contain no-repeat;-webkit-mask:${eye} center/contain no-repeat}
${s} [class*="sidebarCol"] > div{position:relative;z-index:1;padding:8px 12px 10px!important;gap:3px!important}
${s} [class*="sidebarCol"] button[class*="newSession"]{height:35px!important;min-height:35px!important;padding:0 12px!important;gap:10px!important;margin:0 0 7px!important;border-radius:7px!important;border-color:${alpha(ink,.42)}!important;background:${alpha(ink,t.dark?.055:.065)}!important;color:${t.text}!important;box-shadow:inset 0 1px 0 ${alpha(ink,.05)}!important;font-family:${t.uiFont}!important;font-size:13px!important}
${s} [class*="sidebarCol"] [class*="newSessionLabel"]{font-family:${t.uiFont}!important;font-size:13px!important;font-weight:500!important}
${s} [class*="sidebarCol"] button[data-lotm-icon] svg{display:none!important}
${s} [class*="sidebarCol"] button[data-lotm-icon] [class*="panelGlyph"]{display:none!important}
${s} button[data-lotm-icon]::before{content:"";display:block;flex:none;width:19px;height:19px;background:${ink};mask:var(--lotm-icon) center/contain no-repeat;-webkit-mask:var(--lotm-icon) center/contain no-repeat;pointer-events:none}
${s} [class*="sidebarCol"] button[class*="panelRow"]{height:32px!important;min-height:32px!important;padding:4px 12px!important;gap:10px!important;font-size:13px!important;font-weight:400!important;border:1px solid transparent!important;border-radius:7px!important}
${s} [class*="sidebarCol"] button[class*="panelRow"][aria-current="page"]{background:${alpha(ink,.10)}!important;border-color:${alpha(ink,.22)}!important;color:${t.text}!important}
${s} [class*="sidebarCol"] nav[class*="panelList"]{gap:2px!important;margin-bottom:8px!important;padding-bottom:0!important;border-bottom:0!important}
${s} [class*="sidebarCol"] nav[class*="panelList"]::after,${s} [class*="sidebarCol"] [class*="footArea"]::before{content:"";display:block;flex:none;width:calc(100% - 16px);height:22px;margin:4px auto 0;background:${ink};opacity:${t.dark?.65:.58};pointer-events:none;mask:${divider} center/100% auto no-repeat;-webkit-mask:${divider} center/100% auto no-repeat}
${s} [class*="sidebarCol"] [class*="footArea"]::before{margin:0 auto 6px}
${s} .wtg9ga_collapsed nav[class*="panelList"]::after,${s} .wtg9ga_collapsed [class*="footArea"]::before{display:none!important}
${s} [class*="sidebarCol"] [class*="sectionLabel"]{font:500 13px/1.5 ${t.displayFont}!important;letter-spacing:.08em!important;color:${ink}!important}
${s} [class*="sidebarCol"] [class*="sectionHeader"]{height:26px!important;min-height:26px!important;margin-bottom:3px!important}
${s} [class*="sidebarCol"] [class*="sessionRow"]{min-height:32px!important;height:32px!important;border-radius:7px!important;margin:2px 0!important}
${s} [class*="sidebarCol"] [class*="sessionRow"][aria-selected="true"],${s} [class*="sidebarCol"] [class*="sessionRow"][class*="selected"]{border-color:${alpha(ink,.35)}!important;background:${alpha(ink,t.dark?.10:.12)}!important;box-shadow:none!important}
${s} [class*="sidebarCol"] button:focus-visible{outline-color:${ink}!important}
${s} .wtg9ga_root.wtg9ga_collapsed{padding:8px 6px!important;gap:6px!important}
${s} .wtg9ga_collapsed .wtg9ga_logoRow{height:32px!important;justify-content:center!important;padding:0!important;margin:0!important}
${s} [class*="sidebarCol"] .wtg9ga_collapsed button.wtg9ga_newSession{width:32px!important;min-width:32px!important;height:32px!important;min-height:32px!important;padding:0!important;margin:0!important;justify-content:center!important;gap:0!important}
${s} .wtg9ga_collapsed .wtg9ga_newSessionLabelMask,${s} .wtg9ga_collapsed .lotm-brand-label,${s} .wtg9ga_collapsed .lotm-brand-mark{display:none!important}
${s}[data-windows-titlebar] .wtg9ga_root.wtg9ga_collapsed{padding:0!important}
${s}[data-windows-titlebar] .wtg9ga_collapsed .wtg9ga_logoRow{height:0!important}
${s}[data-windows-titlebar] [class*="sidebarCol"] .wtg9ga_collapsed button.wtg9ga_newSession{width:28px!important;min-width:28px!important;height:28px!important;min-height:28px!important}
${s} [data-conversation-region="chat"]{--lotm-content-width:800px}
${s} .an3WzG_root[data-phase="hero"] .an3WzG_scrollBody{justify-content:center!important;align-items:center!important}
${s} .an3WzG_composerHero,${s} [data-composer-seat]{align-self:center!important;margin-inline:auto!important}
${s} .WOwLGG_root{width:100%!important;max-width:var(--lotm-content-width,800px)!important;margin-inline:auto!important;padding:0!important;box-sizing:border-box}
${s} .WOwLGG_stack{width:100%!important;max-width:var(--lotm-content-width,800px)!important;align-items:center!important;gap:24px!important;margin-inline:auto!important}
${s} .WOwLGG_headline{position:relative;display:flex!important;flex-direction:column!important;justify-content:center!important;align-items:center!important;gap:12px!important;width:100%!important;margin:0 0 36px!important;text-align:center!important;color:${t.text}!important}
${s} .WOwLGG_titleGroup{display:flex!important;justify-content:center!important;align-items:center!important}
${s} .WOwLGG_titleGroup > span:first-child,${s} .WOwLGG_headline > span{font:500 clamp(27px,2.9vw,42px)/1.5 ${t.displayFont}!important;letter-spacing:.075em!important;text-wrap:balance}
${s} .WOwLGG_previewBadge,${s} .WOwLGG_body:empty{display:none!important}
${s} .WOwLGG_fishHitbox{pointer-events:none;display:block!important;width:56px!important;height:46px!important;background:${ink};mask:${eye} center/contain no-repeat;-webkit-mask:${eye} center/contain no-repeat}
${s} .WOwLGG_fishHitbox > *{visibility:hidden!important}
${s} .GRgSLq_card,${s} [data-composer-card]{position:relative;border-radius:13px!important;border-color:${alpha(ink,.55)}!important;background:${alpha(t.panel,t.dark?.86:.94)}!important;box-shadow:inset 0 1px 0 ${alpha(ink,.08)},0 6px 24px ${alpha(t.bg,.1)}!important}
${s} [data-composer-card]::before,${s} [data-composer-card]::after{content:"";position:absolute;width:32px;height:32px;background:${ink};opacity:.75;pointer-events:none;mask:${corner} -12px -12px/96px 96px no-repeat;-webkit-mask:${corner} -12px -12px/96px 96px no-repeat}
${s} [data-composer-card]::before{top:0;left:0}
${s} [data-composer-card]::after{bottom:0;right:0;transform:rotate(180deg)}
${s} .GRgSLq_card:focus-within,${s} [data-composer-card]:focus-within{border-color:${ink}!important;box-shadow:0 0 0 2px ${alpha(ink,.09)}!important}
${s} .GRgSLq_placeholder{font-size:15px!important;color:${t.muted}!important}
@media(max-width:1100px){${s} [data-conversation-region="chat"]{--lotm-content-width:700px}${s} .lotm-brand-label{font-size:22px}${s} .WOwLGG_headline{margin-bottom:24px!important}}
@media(max-width:600px){${s} .WOwLGG_titleGroup > span:first-child{font-size:26px!important;letter-spacing:.02em!important}${s} .WOwLGG_headline{margin-bottom:16px!important}}
`;
}

// Adapt the chosen glass composition to the resident DSH DOM. Artwork remains
// behind the app; only reading surfaces and code carry opaque/tinted fills.
function themeFinishCss(t,assetUrl,readability) {
 const s='html[data-lotm-atlas]';
 const auxiliary=t.aux||t.accent;
 const edge=alpha(auxiliary,t.dark?0.23:0.25);
 const highlight=t.dark?'rgba(255,255,255,.07)':'rgba(255,255,255,.65)';
 const shadow=t.dark?'rgba(0,0,0,.23)':'rgba(30,48,56,.10)';
 const left=alpha(t.bg,readability==='clear'?0.97:0.90);
 const middle=alpha(t.bg,readability==='clear'?0.89:0.74);
 const far=alpha(t.bg,readability==='clear'?0.24:0.12);
 // Decorative color gradients are opt-in. All scenes still need an artwork
 // readability mask; this does not change the flat code/output surfaces.
 const backgroundLayers=[
  ...(t.gradient?[
   `radial-gradient(ellipse at 20% 78%,${alpha(t.mistStart,t.dark?.22:.45)} 0%,transparent 52%)`,
   `radial-gradient(ellipse at 89% 68%,${alpha(t.mistEnd,t.dark?.16:.28)} 0%,transparent 48%)`
  ]:[]),
  `linear-gradient(90deg,${left} 0%,${left} 22%,${middle} 44%,${far} 70%,${alpha(t.bg,.06)} 90%)`,
  `url(${JSON.stringify(assetUrl)})`
 ];
 const backgroundPositions=backgroundLayers.map((_,index)=>index===backgroundLayers.length-1?'var(--lotm-art-position)':'center').join(',');
 const backgroundSizes=backgroundLayers.map((_,index)=>index===backgroundLayers.length-1?'var(--lotm-art-width) auto':'cover').join(',');
 return `
${s} body{--dsw-font-family:${t.uiFont};--lotm-code-keyword:${t.codeKeyword};--lotm-code-string:${t.codeString};--lotm-code-function:${t.codeFunction};--lotm-code-number:${t.codeNumber};--lotm-code-comment:${t.codeComment};--shiki-foreground:${t.codeText};--shiki-background:${t.codeBg};--shiki-token-constant:${t.codeNumber};--shiki-token-string:${t.codeString};--shiki-token-string-expression:${t.codeString};--shiki-token-comment:${t.codeComment};--shiki-token-keyword:${t.codeKeyword};--shiki-token-parameter:${t.codeFunction};--shiki-token-function:${t.codeFunction};--shiki-token-punctuation:${t.codeText};--shiki-token-link:${t.codeFunction};font-family:${t.uiFont}!important}
${s} #lotm-atlas-background{--lotm-art-offset:${t.id==='8'?'calc(-1 * clamp(110px,10vw,180px))':'clamp(72px,9vw,160px)'};--lotm-art-width:max(calc(100vw + max(0px,var(--lotm-art-offset)) * 2),calc(100vh * 1.78));--lotm-art-position:calc(50% - var(--lotm-art-offset)) center;background-image:${backgroundLayers.join(',')};background-size:${backgroundSizes};background-position:${backgroundPositions}}
${s} #lotm-atlas-background{overflow:hidden}
${s} #lotm-atlas-background > video{position:absolute;z-index:0;left:calc(50% - var(--lotm-art-offset));top:50%;width:var(--lotm-art-width);height:auto;max-width:none;max-height:none;transform:translate(-50%,-50%);pointer-events:none;opacity:0}
${s} #lotm-atlas-background[data-video-ready=true] > video{opacity:1}
${s} #lotm-atlas-background::after{content:"";position:absolute;inset:0;z-index:1;pointer-events:none;opacity:0;background-image:${backgroundLayers.slice(0,-1).join(',')};background-size:cover;background-position:center}
${s} #lotm-atlas-background[data-video-ready=true]::after{opacity:1}
${s} [class*="sidebarCol"]{position:relative;background:${alpha(t.chromeBg,.94)}!important;border-right:0!important;box-shadow:inset 0 1px 0 ${highlight}!important}
${s} [class*="rightbarCol"]{border-left:0!important}
${s} [class*="sidebarCol"] > div{background:transparent!important;background-image:none!important;padding:5px 8px 8px!important;gap:5px!important;font-size:12px!important}
${s} :is(#lotm-atlas-pillar,#lotm-atlas-pillar-right){position:fixed;z-index:2;pointer-events:none;top:12px;bottom:8px;width:24px;background:url('/api/lotm-sequence-atlas/assets/ornaments/pillar-fog-slim.png') center/640% 100% no-repeat;opacity:${t.dark?.48:.34};filter:drop-shadow(0 1px 3px ${shadow})}
${s} #lotm-atlas-pillar{left:calc(var(--lotm-sidebar-edge,280px) - 12px)}
${s} #lotm-atlas-pillar-right{left:calc(var(--lotm-center-edge,100vw) - 28px)}
${s} :is(#lotm-atlas-pillar,#lotm-atlas-pillar-right)[hidden]{display:none}
${s} [class*="sidebarCol"] [class*="logoRow"]{height:44px!important;box-sizing:border-box;padding:6px 8px!important;margin-bottom:2px!important;gap:8px!important}
${s} [class*="sidebarCol"] [class*="brandName"]{font-family:${t.displayFont}!important;font-size:16px!important;font-weight:700!important;letter-spacing:.02em!important;color:${t.text}!important}
${s} [class*="sidebarCol"] [class*="buildVersion"]{font-size:8px!important;height:12px!important;line-height:12px!important;padding:0 4px!important;border-radius:4px!important}
${s} [class*="sidebarCol"] button[class*="newSession"]{width:100%!important;min-width:0!important;height:34px!important;min-height:34px!important;margin:0 0 8px!important;padding:0 10px!important;display:flex!important;align-items:center!important;justify-content:flex-start!important;gap:6px!important;font-size:13px!important;font-weight:500!important;background:${alpha(t.panel,.94)}!important;color:${t.text}!important;border:1px solid ${edge}!important;border-radius:9px!important;box-shadow:inset 0 1px 0 ${highlight}!important;container-type:normal!important}
${s} [class*="sidebarCol"] button[class*="newSession"] svg{width:14px!important;height:14px!important;font-size:14px!important;flex:none;color:${auxiliary}!important;stroke-width:2}
${s} [class*="sidebarCol"] [class*="newSessionContent"]{width:auto!important;min-width:0!important;flex:0 1 auto!important;display:flex!important;align-items:center!important;justify-content:flex-start!important;gap:7px!important;font-size:13px!important}
${s} [class*="sidebarCol"] [class*="newSessionLabelMask"],${s} [class*="sidebarCol"] [class*="newSessionLabel"]{font-size:13px!important;line-height:20px!important;background:transparent!important;mask-image:none!important;-webkit-mask-image:none!important;box-shadow:none!important;border:0!important;outline:0!important;text-shadow:none!important;filter:none!important;min-width:0!important;max-width:100%!important;overflow:hidden!important;text-overflow:ellipsis!important}
${s} [class*="sidebarCol"] [class*="newSessionShortcut"]{display:none!important}
${s} [class*="sidebarCol"] nav[class*="panelList"]{gap:2px!important;margin-bottom:10px!important}
${s} [class*="sidebarCol"] button[class*="panelRow"]{min-height:32px!important;margin:0!important;padding:4px 8px!important;border-radius:8px!important;gap:8px!important;line-height:20px!important;font-size:13px!important;font-weight:500!important;color:${t.text}!important;transition:background .16s,color .16s}
${s} [class*="sidebarCol"] button[class*="panelRow"] svg{color:${auxiliary}!important;width:18px!important;height:18px!important}
${s} [class*="sidebarCol"] button[class*="panelRow"]:hover,${s} [class*="sidebarCol"] [class*="sessionRow"]:hover{background:${alpha(auxiliary,.09)}!important}
${s} [class*="sidebarCol"] [class*="sectionHeader"]{height:30px!important;padding-left:2px!important;margin-bottom:2px!important;gap:4px!important}
${s} [class*="sidebarCol"] button[class*="iconButton"]{width:24px!important;height:24px!important;border-radius:6px!important}
${s} [class*="sidebarCol"] [class*="projectRow"]{height:30px!important;padding:0 8px!important;border-radius:8px!important;font-size:12.5px!important;gap:6px!important}
${s} [class*="sidebarCol"] [class*="sessionRow"]{height:36px!important;min-height:36px!important;margin:1px 0!important;border:1px solid transparent!important;border-radius:8px!important;padding:0 26px 0 8px!important;gap:8px!important;font-size:12px!important;box-sizing:border-box;box-shadow:none!important;color:${t.text}!important}
${s} [class*="sidebarCol"] [class*="sessionRow"] [class*="title"]{font-size:12px!important;line-height:1.42!important;font-weight:400!important}
${s} [class*="sidebarCol"] [class*="sessionRow"][aria-selected="true"] [class*="title"]{font-weight:600!important}
${s} [class*="sidebarCol"] [class*="sessionRow"][aria-selected="true"],${s} [class*="sidebarCol"] [class*="sessionRow"][class*="selected"]{background:${alpha(auxiliary,.14)}!important;border-color:${edge}!important;box-shadow:inset 0 1px 0 ${highlight}!important}
${s} [class*="sidebarCol"] [class*="sectionLabel"],${s} [class*="sidebarCol"] [class*="time"]{color:${t.muted}!important;font-size:11px!important;font-weight:500!important;letter-spacing:.025em!important}
${s} [class*="sidebarCol"] [class*="workspaceLabel"]{color:${t.text}!important;font-weight:600!important;letter-spacing:.025em}
${s} header[class*="header"]{background:${alpha(t.chromeBg,.83)}!important;backdrop-filter:blur(20px) saturate(1.12)!important;border-bottom:1px solid ${edge}!important;box-shadow:inset 0 1px 0 ${highlight}!important}
${s} header [class*="crumbCurrent"]{font:600 15px/1.5 ${t.uiFont}!important;color:${t.text}!important}
${s} header button[class*="tab"]{font-size:12px!important;font-weight:600!important;color:${t.muted}!important}
${s} header button[class*="tab"][aria-selected="true"],${s} header button[class*="tab"][class*="Active"]{color:${t.accent}!important}
${s} [data-conversation-region="chat"]{--lotm-content-width:740px;--lotm-content-gutter:clamp(24px,2.4vw,38px);--dsh-chat-content-width:var(--lotm-content-width);--dsh-composer-card-max-width:var(--lotm-content-width);--dsh-composer-side-clearance:0px;font-size:max(14px,var(--dsh-content-font-size,14px));line-height:1.8}
${s} [data-conversation-scroll]{box-sizing:border-box;margin-right:0!important;scrollbar-gutter:stable both-edges!important;padding-left:var(--lotm-content-gutter)!important;padding-right:var(--lotm-content-gutter)!important}
${s} .V4vHZW_column{max-width:var(--lotm-content-width)!important;width:100%!important;margin-left:auto!important;margin-right:auto!important}
${s} .V4vHZW_scroll{padding:16px 0 12px!important}
${s} [data-composer-seat]{background:transparent!important;padding:0!important;align-items:stretch!important;width:100%!important;max-width:var(--lotm-content-width)!important;box-sizing:border-box;margin-left:auto!important;margin-right:auto!important}
${s} [data-composer-seat] > *{margin-left:auto!important;margin-right:auto!important;max-width:var(--lotm-content-width)!important;width:100%!important;box-sizing:border-box}
${s} [data-composer-seat] .GRgSLq_root,${s} [data-composer-seat] .WOwLGG_root{padding:0 0 4px!important;align-items:stretch!important;justify-content:flex-start!important;box-sizing:border-box}
${s} [data-composer-seat] .WOwLGG_stack{max-width:var(--lotm-content-width)!important}
${s} [data-composer-dock]{background:transparent!important;box-shadow:none!important}
${s} [data-composer-dock][data-lotm-dock="header"]{position:fixed!important;left:var(--lotm-stats-left)!important;top:var(--lotm-stats-top)!important;right:auto!important;bottom:auto!important;z-index:45!important;display:flex!important;flex-direction:row!important;align-items:center!important;justify-content:flex-end!important;gap:3px!important;width:max-content!important;max-width:none!important;margin:0!important;padding:0!important;background:transparent!important;border:0!important;box-shadow:none!important;font-size:11.5px!important;font-variant-numeric:tabular-nums;color:${t.muted}!important;pointer-events:auto}
${s} [data-composer-dock][data-lotm-dock="header"] > *{flex:none!important}
${s} [data-composer-dock][data-lotm-dock="header"] [class*="sep"]{display:none!important}
${s} [data-composer-dock][data-lotm-dock="header"] [data-lotm-number]{font-size:0!important}
${s} [data-composer-dock][data-lotm-dock="header"] [data-lotm-number]::after{content:attr(data-lotm-number);font:500 11.5px/1.4 ${t.uiFont};color:inherit;font-variant-numeric:tabular-nums}
${s} [data-composer-dock][data-lotm-dock="header"] [data-lotm-alert="true"],${s} [data-composer-dock][data-lotm-dock="header"] [data-lotm-alert="true"] :is(svg,[class*="label"]){color:${t.danger}!important}
${s} .xMeOpW_body,${s} [class*="_markdown_"]{font-family:${t.uiFont}!important;font-size:max(14px,var(--dsh-content-font-size,14px))!important;line-height:1.85!important;letter-spacing:.005em;color:${t.text}!important}
${s} .xMeOpW_body > :is(p,ul,ol,table),${s} [class*="_markdown_"] > :is(p,ul,ol,table){background:${alpha(t.panel,.92)}!important;border-radius:5px}
${s} .xMeOpW_body > p,${s} [class*="_markdown_"] > p{width:fit-content;max-width:100%}
${s} [class*="_markdown_"] :is(h1,h2,h3,h4){color:${t.text}!important;font-weight:650!important;line-height:1.55!important;letter-spacing:.015em}
${s} [class*="_markdown_"] :is(h1,h2),${s} .xMeOpW_body :is(h1,h2){color:${t.accent}!important}
${s} [class*="_markdown_"] p{margin-block:10px!important}
${s} [class*="_markdown_"] a{color:${auxiliary}!important;text-decoration-color:${alpha(auxiliary,.5)}}
${s} [class*="_markdown_"] :is(th,td){padding:9px 12px!important;border-color:${alpha(t.accent,.18)}!important}
${s} [class*="_markdown_"] th{background:${alpha(t.panel,.92)}!important;color:${t.text}!important;font-weight:600}
${s} [class*="_markdown_"] blockquote{border:1px solid ${edge}!important;border-radius:9px!important;background:${alpha(t.panel,.9)}!important;padding:10px 14px!important;color:${t.muted}!important}
${s} [class*="_markdown_"] hr{border:0!important;height:1px;margin-block:24px!important;background:${edge}!important}
${s} .LOmM4q_bubble{background:${alpha(t.panelSoft,.93)}!important;border:1px solid ${edge}!important;border-radius:15px!important;padding:11px 16px!important;box-shadow:inset 0 1px 0 ${highlight}!important;font-size:14px!important;line-height:1.75!important}
${s} div[data-tool]{color:${t.text}!important;font-size:13px!important;line-height:1.65!important}
${s} div[data-tool] [class*="title"]{font-weight:600!important}
${s} div[data-tool] [class*="summary"],${s} div[data-tool] [class*="summarySuffix"]{font-family:${t.codeFont}!important;font-size:11.5px!important;line-height:1.7!important;color:${t.muted}!important}
${s} .BE0jCW_title,${s} [data-variant="think"] [data-disclosure-header]{font-weight:600!important;color:${t.muted}!important}
${s} .md-code-block,${s} pre,${s} .EqXNNG_body,${s} .hKdVjq_codeBody,${s} .cr4P6W_terminal{background:${t.codeBg}!important;color:${t.codeText}!important;border:1px solid ${edge}!important;border-radius:12px!important;box-shadow:inset 0 1px 0 ${highlight},0 8px 28px -18px ${shadow}!important;overflow:auto}
${s} pre{padding:16px 18px!important;tab-size:4;box-sizing:border-box;max-width:100%}
${s} .md-code-block,${s} .EqXNNG_body,${s} .hKdVjq_bodyWrap,${s} .hKdVjq_codeBody,${s} .cr4P6W_terminal{box-sizing:border-box;width:100%;max-width:100%;margin-left:0!important;margin-right:0!important}
${s} pre:has([data-code-block-banner]){padding:0!important}
${s} pre code,${s} .EqXNNG_body,${s} .hKdVjq_codeBody,${s} .hKdVjq_ioText,${s} .cr4P6W_ioText{font-family:${t.codeFont}!important;font-size:13px!important;line-height:1.75!important;font-variant-ligatures:none;letter-spacing:0}
${s} pre code{background:transparent!important;color:${t.codeText}!important;padding:0!important;border:0!important}
${s} .md-code-block pre{margin:0!important;border:0!important;border-radius:0 0 12px 12px!important;box-shadow:none!important}
${s} [data-code-block-banner]{background:${t.codeBg}!important;color:${t.muted}!important;border-bottom:1px solid ${edge}!important;font:500 11.5px/1.6 ${t.uiFont}!important;padding:9px 14px!important;border-radius:12px 12px 0 0}
${s} [class*="markdown"] :not(pre) > code{font-family:${t.codeFont}!important;font-size:.9em!important;background:${t.panelSoft}!important;color:${auxiliary}!important;border:1px solid ${alpha(auxiliary,.15)}!important;border-radius:5px!important;padding:1px 5px!important}
${s} .GRgSLq_card,${s} [data-composer-card]{background:${alpha(t.panel,.96)}!important;color:${t.text}!important;border:1px solid ${edge}!important;border-radius:19px!important;box-shadow:inset 0 1px 0 ${highlight},0 12px 32px -22px ${shadow}!important;backdrop-filter:blur(18px)!important}
${s} .GRgSLq_card:focus-within,${s} [data-composer-card]:focus-within{border-color:${alpha(t.accent,.6)}!important;box-shadow:0 0 0 3px ${alpha(t.accent,.09)},inset 0 1px 0 ${highlight}!important}
${s} [data-input-mirror],${s} [data-composer-input],${s} [data-lexical-editor],${s} [contenteditable=true]{font-family:${t.uiFont}!important;font-size:14px!important;line-height:1.8!important;color:${t.text}!important;caret-color:${t.accent}!important}
${s} [data-composer-card] button[class*="primary"],${s} .GRgSLq_card button[class*="primary"]{background:${t.accent}!important;color:${t.onAccent}!important;border-radius:50%!important;border:0!important;box-shadow:0 4px 14px -6px ${alpha(t.accent,.55)}!important}
${s} button:disabled{opacity:.45;cursor:default}
${s} button:focus-visible,${s} [role="treeitem"]:focus-visible{outline:2px solid ${t.accent}!important;outline-offset:2px!important}
${s} ::-webkit-scrollbar{width:8px;height:8px}
${s} ::-webkit-scrollbar-thumb{background:${alpha(t.accent,.3)};border-radius:8px;border:2px solid transparent;background-clip:padding-box}
@media(max-width:1100px){${s} #lotm-atlas-background{--lotm-art-offset:${t.id==='8'?'-110px':'64px'}}}
${t.id==='0'?`${s} #lotm-atlas-background{--lotm-art-offset:0px;--lotm-art-position:center 32px}${s} #lotm-atlas-background > video{top:32px;transform:translateX(-50%)}`:''}
@media(max-width:820px){${s} [data-conversation-scroll]{padding-left:20px!important;padding-right:20px!important}${s} #lotm-atlas-background{background-image:linear-gradient(${alpha(t.bg,.87)},${alpha(t.bg,.87)}),url(${JSON.stringify(assetUrl)});background-position:center,center;background-size:cover,cover}${s} #lotm-atlas-background > video{inset:0;width:100%;height:100%;object-fit:cover;transform:none}${s} #lotm-atlas-background::after{background-image:linear-gradient(${alpha(t.bg,.87)},${alpha(t.bg,.87)})}${s} :is(#lotm-atlas-pillar,#lotm-atlas-pillar-right){display:none}}
@media(prefers-reduced-motion:reduce){${s} *,${s} *:before,${s} *:after{transition:none!important;animation:none!important}}
`;
}

    const THEMES=[{"id":"9","name":"占卜家","colorName":"夜蓝月铜","dark":true,"bg":"#141B29","panel":"#202A37","panelSoft":"#2B3745","sidebar":"#17232C","text":"#F0F4F6","muted":"#B9CAD1","accent":"#DFC08B","aux":"#8FCFD0","onAccent":"#1F2630","chromeBg":"#17232C","mistStart":"#294B62","mistEnd":"#665274","gradient":true,"codeBg":"#0E1722","codeText":"#F0F4F6","codeKeyword":"#D3AFDF","codeString":"#BDDAAB","codeFunction":"#E6C593","codeNumber":"#B4C7ED","codeComment":"#9BAEB8","displayFont":"\"STSong\", \"SimSun\", \"Songti SC\", serif","uiFont":"\"Microsoft YaHei UI\", \"Segoe UI\", system-ui, sans-serif","codeFont":"\"Cascadia Code\", Consolas, \"Courier New\", monospace","line":"#657383","success":"#9ED8B1","warning":"#E7C78B","danger":"#F3A5AD","asset":"sequence-9.webp","thumb":"thumb-9.webp","video":"videos/sequence-9.mp4","videoLoop":true,"mediaVersion":"20261031.1","ornament":"#CFB887"},{"id":"8","name":"小丑","colorName":"象牙绯红","dark":false,"bg":"#F4EFE8","panel":"#FCFAF6","panelSoft":"#ECE5E0","sidebar":"#DFE9E6","text":"#24323A","muted":"#48595F","accent":"#854055","aux":"#356A72","onAccent":"#FFFFFF","chromeBg":"#DFE9E6","mistStart":"#BDD5D7","mistEnd":"#DFB8AE","gradient":true,"codeBg":"#FBF8F2","codeText":"#24323A","codeKeyword":"#7D3F72","codeString":"#91500F","codeFunction":"#256875","codeNumber":"#66528A","codeComment":"#536560","displayFont":"\"STSong\", \"SimSun\", \"Songti SC\", serif","uiFont":"\"Microsoft YaHei UI\", \"Segoe UI\", system-ui, sans-serif","codeFont":"\"Cascadia Code\", Consolas, \"Courier New\", monospace","line":"#BFCCCE","success":"#26704A","warning":"#7C5A1C","danger":"#A3293D","asset":"sequence-8-light.webp","thumb":"thumb-8-light.webp","video":"videos/sequence-8.mp4","videoLoop":true,"mediaVersion":"20261031.1","ornament":"#866B46"},{"id":"7","name":"魔术师","colorName":"雾麦梅紫","dark":false,"bg":"#EFEEE4","panel":"#FAFAF4","panelSoft":"#E8E9DC","sidebar":"#E3E7DB","text":"#2E372F","muted":"#4E5A4A","accent":"#53673D","aux":"#865365","onAccent":"#FFFFFF","chromeBg":"#E3E7DB","mistStart":"#D1D8B9","mistEnd":"#D7C39B","gradient":false,"codeBg":"#F7F8EE","codeText":"#2E372F","codeKeyword":"#7D3F72","codeString":"#91500F","codeFunction":"#256875","codeNumber":"#66528A","codeComment":"#536560","displayFont":"\"STSong\", \"SimSun\", \"Songti SC\", serif","uiFont":"\"Microsoft YaHei UI\", \"Segoe UI\", system-ui, sans-serif","codeFont":"\"Cascadia Code\", Consolas, \"Courier New\", monospace","line":"#BFCCCE","success":"#26704A","warning":"#7C5A1C","danger":"#A3293D","asset":"sequence-7.webp","thumb":"thumb-7.webp","video":"videos/sequence-7.mp4","videoLoop":true,"mediaVersion":"20261031.1","ornament":"#786343"},{"id":"6","name":"无面人","colorName":"深海古铜","dark":true,"bg":"#111D31","panel":"#1B2A43","panelSoft":"#27364F","sidebar":"#152A38","text":"#F2F6FA","muted":"#BBCBDC","accent":"#E2B98B","aux":"#91C9E0","onAccent":"#1F2630","chromeBg":"#152A38","mistStart":"#254F77","mistEnd":"#785743","gradient":true,"codeBg":"#0D1728","codeText":"#F2F6FA","codeKeyword":"#D3AFDF","codeString":"#BDDAAB","codeFunction":"#E6C593","codeNumber":"#B4C7ED","codeComment":"#9BAEB8","displayFont":"\"STSong\", \"SimSun\", \"Songti SC\", serif","uiFont":"\"Microsoft YaHei UI\", \"Segoe UI\", system-ui, sans-serif","codeFont":"\"Cascadia Code\", Consolas, \"Courier New\", monospace","line":"#657383","success":"#9ED8B1","warning":"#E7C78B","danger":"#F3A5AD","asset":"sequence-6.webp","thumb":"thumb-6.webp","video":"videos/sequence-6.mp4","videoLoop":true,"mediaVersion":"20261031.1","ornament":"#CFAB7D"},{"id":"5","name":"秘偶大师","colorName":"墨绿旧金","dark":true,"bg":"#10231F","panel":"#1B332C","panelSoft":"#2C443A","sidebar":"#10231F","text":"#EEE5D2","muted":"#BBD2C5","accent":"#D1BC91","aux":"#9EBFAE","onAccent":"#1F2630","chromeBg":"#10231F","mistStart":"#275E52","mistEnd":"#6D536F","gradient":false,"codeBg":"#0E211A","codeText":"#EEE5D2","codeKeyword":"#D3AFDF","codeString":"#BDDAAB","codeFunction":"#E6C593","codeNumber":"#B4C7ED","codeComment":"#9BAEB8","displayFont":"\"STSong\", \"SimSun\", \"Songti SC\", serif","uiFont":"\"Microsoft YaHei UI\", \"Segoe UI\", system-ui, sans-serif","codeFont":"\"Cascadia Code\", Consolas, \"Courier New\", monospace","line":"#657383","success":"#9ED8B1","warning":"#E7C78B","danger":"#F3A5AD","asset":"sequence-5.webp","thumb":"thumb-5.webp","video":"videos/sequence-5.mp4","videoLoop":true,"mediaVersion":"20261031.1","ornament":"#CAB98C"},{"id":"4","name":"诡法师","colorName":"暮金灰玫","dark":false,"bg":"#F2ECE3","panel":"#FCF8F2","panelSoft":"#E9DFD6","sidebar":"#E7DDD5","text":"#382F2C","muted":"#62534E","accent":"#804C40","aux":"#3F6269","onAccent":"#FFFFFF","chromeBg":"#E7DDD5","mistStart":"#D4CBC0","mistEnd":"#CDAFA5","gradient":true,"codeBg":"#FAF6EF","codeText":"#382F2C","codeKeyword":"#7D3F72","codeString":"#91500F","codeFunction":"#256875","codeNumber":"#66528A","codeComment":"#536560","displayFont":"\"STSong\", \"SimSun\", \"Songti SC\", serif","uiFont":"\"Microsoft YaHei UI\", \"Segoe UI\", system-ui, sans-serif","codeFont":"\"Cascadia Code\", Consolas, \"Courier New\", monospace","line":"#BFCCCE","success":"#26704A","warning":"#7C5A1C","danger":"#A3293D","asset":"sequence-4.webp","thumb":"thumb-4.webp","video":"videos/sequence-4.mp4","videoLoop":false,"mediaVersion":"20261031.1","ornament":"#86583D"},{"id":"3","name":"古代学者","colorName":"青瓷旧金","dark":false,"bg":"#EDF1F0","panel":"#FAFBF9","panelSoft":"#E2EAE9","sidebar":"#DEE8E7","text":"#283B40","muted":"#465C62","accent":"#40636A","aux":"#7A5B36","onAccent":"#FFFFFF","chromeBg":"#DEE8E7","mistStart":"#C6D9D2","mistEnd":"#E0D0B6","gradient":false,"codeBg":"#F4F9F7","codeText":"#283B40","codeKeyword":"#7D3F72","codeString":"#91500F","codeFunction":"#256875","codeNumber":"#66528A","codeComment":"#536560","displayFont":"\"STSong\", \"SimSun\", \"Songti SC\", serif","uiFont":"\"Microsoft YaHei UI\", \"Segoe UI\", system-ui, sans-serif","codeFont":"\"Cascadia Code\", Consolas, \"Courier New\", monospace","line":"#BFCCCE","success":"#26704A","warning":"#7C5A1C","danger":"#A3293D","asset":"sequence-3.webp","thumb":"thumb-3.webp","video":"videos/sequence-3.mp4","videoLoop":true,"mediaVersion":"20261031.1","ornament":"#806644"},{"id":"2","name":"奇迹师","colorName":"奶杏孔雀","dark":false,"bg":"#F4EEE2","panel":"#FCF9F2","panelSoft":"#EEE4D5","sidebar":"#E9E4D9","text":"#3E342A","muted":"#5C5145","accent":"#80572C","aux":"#3F656B","onAccent":"#FFFFFF","chromeBg":"#E9E4D9","mistStart":"#C3D9D5","mistEnd":"#E2C497","gradient":true,"codeBg":"#FCF7ED","codeText":"#3E342A","codeKeyword":"#7D3F72","codeString":"#91500F","codeFunction":"#256875","codeNumber":"#66528A","codeComment":"#536560","displayFont":"\"STSong\", \"SimSun\", \"Songti SC\", serif","uiFont":"\"Microsoft YaHei UI\", \"Segoe UI\", system-ui, sans-serif","codeFont":"\"Cascadia Code\", Consolas, \"Courier New\", monospace","line":"#BFCCCE","success":"#26704A","warning":"#7C5A1C","danger":"#A3293D","asset":"sequence-2.webp","thumb":"thumb-2.webp","video":"videos/sequence-2.mp4","videoLoop":true,"mediaVersion":"20261031.1","ornament":"#886238"},{"id":"1","name":"诡秘侍者","colorName":"紫幕冷翠","dark":true,"bg":"#251C31","panel":"#342B43","panelSoft":"#443851","sidebar":"#1F2C33","text":"#F8F1FC","muted":"#D1C2DE","accent":"#E1B9CB","aux":"#9ECEC5","onAccent":"#1F2630","chromeBg":"#1F2C33","mistStart":"#57416F","mistEnd":"#2F645D","gradient":true,"codeBg":"#1B1427","codeText":"#F8F1FC","codeKeyword":"#D3AFDF","codeString":"#BDDAAB","codeFunction":"#E6C593","codeNumber":"#B4C7ED","codeComment":"#9BAEB8","displayFont":"\"STSong\", \"SimSun\", \"Songti SC\", serif","uiFont":"\"Microsoft YaHei UI\", \"Segoe UI\", system-ui, sans-serif","codeFont":"\"Cascadia Code\", Consolas, \"Courier New\", monospace","line":"#657383","success":"#9ED8B1","warning":"#E7C78B","danger":"#F3A5AD","asset":"sequence-1.webp","thumb":"thumb-1.webp","video":"videos/sequence-1.mp4","videoLoop":true,"mediaVersion":"20261031.1","ornament":"#C9A9BD"},{"id":"0","name":"愚者","colorName":"雾银旧金","dark":true,"bg":"#202831","panel":"#2C3743","panelSoft":"#3A4551","sidebar":"#242E39","text":"#F5F7FA","muted":"#C7D0DA","accent":"#DDC397","aux":"#A9C6D5","onAccent":"#1F2630","chromeBg":"#242E39","mistStart":"#40576B","mistEnd":"#745B60","gradient":false,"codeBg":"#171F2A","codeText":"#F5F7FA","codeKeyword":"#D3AFDF","codeString":"#BDDAAB","codeFunction":"#E6C593","codeNumber":"#B4C7ED","codeComment":"#9BAEB8","displayFont":"\"STSong\", \"SimSun\", \"Songti SC\", serif","uiFont":"\"Microsoft YaHei UI\", \"Segoe UI\", system-ui, sans-serif","codeFont":"\"Cascadia Code\", Consolas, \"Courier New\", monospace","line":"#657383","success":"#9ED8B1","warning":"#E7C78B","danger":"#F3A5AD","asset":"sequence-0.webp","thumb":"thumb-0.webp","video":"videos/sequence-0.mp4","videoLoop":true,"mediaVersion":"20261031.2","ornament":"#C9B88D"}];const ASSET_PREFIX="/api/lotm-sequence-atlas/assets/";
    // Cosmetic adapter for the shipped DSH React chrome. It never replaces controls
// or touches editor values, messages, project names, or conversation titles.
function createNativeSkin(document) {
  const sidebar = '[class*="sidebarCol"]';
  const chrome = `${sidebar} button[class*="newSession"],${sidebar} button[class*="panelRow"],${sidebar} [class*="sectionLabel"],.WOwLGG_headline`;
  const placeholders = '.GRgSLq_placeholder,[data-composer-card] [placeholder],[data-composer-card] [data-placeholder]';
  const watch = `${sidebar},.WOwLGG_headline,${placeholders}`;
  const names = new Map([
    ['新会话','塔罗会'],['新建会话','塔罗会'],['插件','封印物'],
    ['自动化任务','秘偶'],['任务看板','亵渎石板'],['工作区','成神途径'],
    ['探索未至之境','欢迎来到诡秘世界'],
  ]);
  const prompts = new Map([
    ['录入问题','我有一个任务要发布'],
    ['发消息或创建任务, / 调用指令, @ 文件或对话','我有一个任务要发布'],
    ['描述你想要构建的内容, / 调用指令, @ 文件或对话','我有一个任务要发布'],
  ]);
  const icons = new Map([['塔罗会','cards'],['封印物','cube'],['秘偶','masks-theater'],['亵渎石板','script']]);
  const texts = new Map(), attributes = new Map(), owned = new Set();
  let enabled = false, pending = false, generation = 0;
  const changeAttribute = (node,key,value) => {
    if (node.getAttribute(key) === value) return;
    let saved = attributes.get(node);
    if (!saved) attributes.set(node,saved=new Map());
    const old = saved.get(key);
    saved.set(key,{before:old && node.getAttribute(key)===old.after ? old.before : node.getAttribute(key),after:value});
    node.setAttribute(key,value);
  };
  const changeTexts = (element,dictionary) => {
    const walker = document.createTreeWalker(element,4);
    let node;
    while ((node=walker.nextNode())) {
      if (node.parentElement?.closest('[contenteditable],textarea,input,script,style')) continue;
      const value = node.nodeValue, next = dictionary.get(value.trim());
      if (!next) continue;
      const after = value.replace(value.trim(),next), old=texts.get(node);
      texts.set(node,{before:old && value===old.after ? old.before : value,after});
      node.nodeValue=after;
    }
  };
  const refresh = () => {
    if (!enabled) return;
    for (const node of texts.keys()) if (!node.isConnected) texts.delete(node);
    for (const node of attributes.keys()) if (!node.isConnected) attributes.delete(node);
    for (const node of owned) if (!node.isConnected) owned.delete(node);
    for (const column of document.querySelectorAll(sidebar)) {
      if (!column.querySelector(':scope > .lotm-sidebar-frame')) {
        const frame=document.createElement('span');
        frame.className='lotm-sidebar-frame';frame.setAttribute('aria-hidden','true');
        for (const corner of ['tl','tr','bl','br']) {
          const ornament=document.createElement('span');
          ornament.className='lotm-frame-corner';ornament.dataset.corner=corner;frame.append(ornament);
        }
        column.append(frame);owned.add(frame);
      }
    }
    for (const element of document.querySelectorAll(chrome)) {
      changeTexts(element,names);
      for (const node of [element,...element.querySelectorAll('[aria-label],[title]')]) {
        for (const key of ['aria-label','title']) {
          const value=node.getAttribute(key),next=names.get(value?.trim());
          if (next) changeAttribute(node,key,next);
        }
      }
      if (element.matches('button')) {
        const icon=element.matches('[class*="newSession"]') ? 'cards' : icons.get(element.textContent.trim()) || icons.get(element.getAttribute('aria-label'));
        if (icon) changeAttribute(element,'data-lotm-icon',icon);
      }
    }
    for (const element of document.querySelectorAll(placeholders)) {
      // Lexical's ghost placeholder is outside the editable document.
      if (element.matches('.GRgSLq_placeholder') && !element.closest('[contenteditable]')) changeTexts(element,prompts);
      for (const key of ['placeholder','data-placeholder']) {
        const next=prompts.get(element.getAttribute(key));
        if (next) changeAttribute(element,key,next);
      }
    }
    for (const row of document.querySelectorAll(`${sidebar} [class*="logoRow"]`)) {
      const identity=row.querySelector('[class*="brandIdentity"]') || (row.querySelector('[class*="brandName"],[class*="brandMark"]') ? row : null);
      if (!identity) continue;
      for (const original of identity.querySelectorAll('[class*="brandName"],[class*="brandMark"],[class*="buildVersion"]')) changeAttribute(original,'data-lotm-original-brand','');
      if (!identity.querySelector('.lotm-brand-label')) {
        const mark=document.createElement('span'),label=document.createElement('span');
        mark.className='lotm-brand-mark';mark.setAttribute('aria-hidden','true');
        label.className='lotm-brand-label';label.textContent='诡秘之主';
        // Keep real text as the fallback until the decorative asset has loaded.
        const preview=document.createElement('img');preview.hidden=true;preview.alt='';
        preview.onload=()=>{if(enabled && label.isConnected)label.dataset.lotmWordmark='ready';};
        preview.onerror=()=>{delete label.dataset.lotmWordmark;};
        label.append(preview);owned.add(preview);
        identity.append(mark,label);owned.add(mark);owned.add(label);
        preview.src='/api/lotm-sequence-atlas/assets/ornaments/lotm-wordmark.png';
      }
    }
  };
  const observer = new document.defaultView.MutationObserver(records => {
    if (!enabled || pending) return;
    const relevant=records.some(record => {
      const target=record.target.nodeType===1?record.target:record.target.parentElement;
      return target?.closest(watch) || [...record.addedNodes].some(node=>node.nodeType===1&&(node.matches(watch)||node.querySelector(watch)));
    });
    if (!relevant) return;
    pending=true;const ticket=generation;
    document.defaultView.queueMicrotask(()=>{if(ticket!==generation)return;pending=false;refresh();});
  });
  function setEnabled(next) {
    if (next) {
      if (!enabled) {
        enabled=true;refresh();
        observer.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['placeholder','data-placeholder','aria-label','title']});
      } else refresh();
      return;
    }
    enabled=false;generation++;pending=false;observer.disconnect();
    for (const [node,{before,after}] of texts) if (node.nodeValue===after) node.nodeValue=before;
    for (const [node,saved] of attributes) for (const [key,{before,after}] of saved) if (node.getAttribute(key)===after) {
      if (before===null) node.removeAttribute(key);else node.setAttribute(key,before);
    }
    for (const node of owned) {
      if (node.tagName==='IMG') node.onload=node.onerror=null;
      node.remove();
    }
    texts.clear();attributes.clear();owned.clear();
  }
  return {setEnabled,dispose:()=>setEnabled(false)};
}

    const SOURCE = 'dsh-lotm-sequence-atlas';
    const BASELINE_KEY = STORAGE_KEY + '/previous-theme';
    const UI_STYLE = 'lotm-atlas-settings-css';
    const THEME_STYLE = 'lotm-atlas-theme-css';
    const BG_ID = 'lotm-atlas-background';
    const NS = 'settings.lotm-sequence-atlas';
    const mediaUrl = (theme,filename) => ASSET_PREFIX + filename + '?v=' + theme.mediaVersion;
    // Downloaded Tabler Outline, MIT. The same series is used across the skin.
    function icon(kind) {
      return h('span',{className:'lotm-ui-icon','data-lotm-glyph':kind==='power'?'eye-off':'moon-stars','aria-hidden':true});
    }
    function putStyle(id, text) {
      let element = document.getElementById(id);
      if (!element) { element = document.createElement('style'); element.id = id; document.head.appendChild(element); }
      element.textContent = text;
      return element;
    }
    exports.inject = ['theme', 'slots', 'locale'];
    exports.apply = (ctx) => {
      let storage;
      try { storage = window.localStorage; } catch { storage = undefined; }
      const store = createSelectionStore(storage);
      const nativeSkin = createNativeSkin(document);
      let releaseTokens, active = false, applying = false, suppressRestore = false;
      let destroyed = false, desiredAsset = '', previousPreference;
      let activeVideo, desiredVideo = '';
      const disposers = [];
      const pausedSkins = new Map();
      let measuredSidebar, measuredCenter, sidebarResize, chromeFrame;
      let measuredDock, measuredHeader, measuredTabs, measuredTabControls, statsObserver, statsResize, statsFrame;
      const statsLabels = new Set();
      const statsStructureSelector = '[data-composer-dock],header[class*="header"]';
      const requestFrame = window.requestAnimationFrame?.bind(window) || (fn=>window.setTimeout(fn,16));
      const cancelFrame = window.cancelAnimationFrame?.bind(window) || window.clearTimeout.bind(window);
      function scheduleStats() {
        if (statsFrame !== undefined || destroyed || store.state().sequence === 'native') return;
        statsFrame = requestFrame(() => { statsFrame = undefined; syncStats(); });
      }
      function clearStatsPlacement(dock = measuredDock) {
        dock?.removeAttribute('data-lotm-dock');
        document.documentElement.style.removeProperty('--lotm-stats-left');
        document.documentElement.style.removeProperty('--lotm-stats-top');
      }
      function clearStatsLabels() {
        for (const node of statsLabels) {
          node.removeAttribute('data-lotm-number');
          node.removeAttribute('data-lotm-alert');
        }
        statsLabels.clear();
      }
      function removeStats() {
        if (statsFrame !== undefined) { cancelFrame(statsFrame); statsFrame = undefined; }
        statsObserver?.disconnect(); statsObserver = undefined;
        statsResize?.disconnect(); statsResize = undefined;
        clearStatsPlacement(); clearStatsLabels();
        measuredDock = measuredHeader = measuredTabs = measuredTabControls = undefined;
      }
      function syncStats() {
        if (destroyed || store.state().sequence === 'native') return;
        const dock = document.querySelector('[data-composer-dock]');
        const header = document.querySelector('header[class*="header"]');
        const tabs = header?.querySelector('[class*="tabs"]');
        const tabControls = tabs?.querySelector('[class*="viewTabs"]') || tabs?.querySelector('[role="tablist"]') || tabs;
        if (dock !== measuredDock || header !== measuredHeader || tabs !== measuredTabs || tabControls !== measuredTabControls) {
          statsObserver?.disconnect(); statsResize?.disconnect();
          clearStatsPlacement(); clearStatsLabels();
          measuredDock = dock; measuredHeader = header; measuredTabs = tabs; measuredTabControls = tabControls;
          if (dock) {
            statsObserver = new MutationObserver(scheduleStats);
            statsObserver.observe(dock,{childList:true,characterData:true,subtree:true});
          }
          if (typeof ResizeObserver !== 'undefined') {
            statsResize = new ResizeObserver(scheduleStats);
            for (const node of new Set([dock,header,tabs,tabControls])) if (node) statsResize.observe(node);
          }
        }
        clearStatsLabels();
        if (!dock) { clearStatsPlacement(); return; }
        const number = (kind,pattern,format,alert) => {
          const stat = dock.querySelector('[data-composer-stat="'+kind+'"]');
          const label = stat?.querySelector('[class*="label"]');
          const match = pattern.exec(label?.textContent || '');
          if (!label || !match) return;
          label.dataset.lotmNumber = format(match[1]); statsLabels.add(label);
          if (alert(Number(match[1]))) { stat.dataset.lotmAlert = 'true'; statsLabels.add(stat); }
        };
        number('activity',/([\d.]+)\s*tok\/s/i,value=>value,value=>value<100);
        number('usage',/([\d.]+)\s*%/,value=>value+'%',value=>value<95);
        for (const trigger of dock.querySelectorAll('[aria-haspopup="dialog"]')) {
          const match = /^([\d.]+)\s*%$/.exec(trigger.textContent.trim());
          if (match && Number(match[1])>80) { trigger.dataset.lotmAlert = 'true'; statsLabels.add(trigger); }
        }
        if (!header || !tabs || window.innerWidth<900) { clearStatsPlacement(dock); return; }
        const headerRect = header.getBoundingClientRect();
        const tabsRect = tabs.getBoundingClientRect();
        const tabControlsRect = tabControls === tabs ? tabsRect : tabControls.getBoundingClientRect();
        // Measure the compact top-row presentation, not the native full-width
        // composer dock. Position/visibility settle in this same paint cycle.
        dock.dataset.lotmDock = 'header';
        const width = dock.offsetWidth || 240, height = dock.offsetHeight || 28;
        const left = headerRect.right-width-20, top = tabsRect.top+(tabsRect.height-height)/2;
        if (tabsRect.width<=0 || tabsRect.height<=0 || left<tabControlsRect.right+20) { clearStatsPlacement(dock); return; }
        document.documentElement.style.setProperty('--lotm-stats-left',Math.round(left)+'px');
        document.documentElement.style.setProperty('--lotm-stats-top',Math.round(top)+'px');
        dock.dataset.lotmDock = 'header';
      }
      function scheduleLayout() { scheduleChrome(); scheduleStats(); }
      function scheduleChrome() {
        if (chromeFrame !== undefined || destroyed || store.state().sequence === 'native') return;
        chromeFrame = requestFrame(() => { chromeFrame = undefined; syncChrome(); });
      }
      function removeChrome() {
        if (chromeFrame !== undefined) { cancelFrame(chromeFrame); chromeFrame = undefined; }
        sidebarResize?.disconnect(); sidebarResize = undefined; measuredSidebar = measuredCenter = undefined;
        // Also retract the ornament from the earlier preview when hot-updating.
        document.getElementById('lotm-atlas-crest')?.remove();
        document.getElementById('lotm-atlas-pillar')?.remove();
        document.getElementById('lotm-atlas-pillar-right')?.remove();
        document.documentElement.style.removeProperty('--lotm-sidebar-edge');
        document.documentElement.style.removeProperty('--lotm-center-edge');
      }
      function syncChrome() {
        if (destroyed || store.state().sequence === 'native') return;
        const sidebar = document.querySelector('[class*="sidebarCol"]');
        const center = document.querySelector('[class*="centerCol"]');
        if (!sidebar && !center) { removeChrome(); return; }
        document.getElementById('lotm-atlas-crest')?.remove();
        const columns = ['lotm-atlas-pillar','lotm-atlas-pillar-right'].map(id => {
          let column = document.getElementById(id);
          if (!column) {
            column = document.createElement('div'); column.id = id;
            column.setAttribute('aria-hidden','true'); document.body.appendChild(column);
          }
          return column;
        });
        const measure = () => {
          if (destroyed || store.state().sequence === 'native' || !columns[0].isConnected) return;
          const rootStyle = document.documentElement.style;
          for (const [index,node,key] of [[0,sidebar,'--lotm-sidebar-edge'],[1,center,'--lotm-center-edge']]) {
            const rect = node?.isConnected ? node.getBoundingClientRect() : undefined;
            columns[index].hidden = !rect || rect.width < 80;
            if (columns[index].hidden) rootStyle.removeProperty(key);
            else if (rootStyle.getPropertyValue(key) !== rect.right+'px') rootStyle.setProperty(key,rect.right+'px');
          }
          scheduleStats();
        };
        measure();
        if (measuredSidebar !== sidebar || measuredCenter !== center) {
          sidebarResize?.disconnect(); measuredSidebar = sidebar; measuredCenter = center;
          if (typeof ResizeObserver !== 'undefined') {
            sidebarResize = new ResizeObserver(measure);
            for (const node of [sidebar,center]) if (node) sidebarResize.observe(node);
          }
        }
      }
      const legacySkinSelector = 'style[data-plugin-css="dsh-gradually-themes/skin.css"]';
      function pauseLegacySkins() {
        for (const node of document.querySelectorAll(legacySkinSelector)) {
          if (!pausedSkins.has(node)) pausedSkins.set(node,node.getAttribute('media'));
          if (node.media !== 'not all') node.media = 'not all';
        }
      }
      function restoreLegacySkins() {
        for (const [node,media] of pausedSkins) {
          if (node.getAttribute('media') === 'not all') {
            if (media === null) node.removeAttribute('media'); else node.setAttribute('media',media);
          }
        }
        pausedSkins.clear();
      }
      function storedBaseline() {
        try { return JSON.parse(storage?.getItem(BASELINE_KEY) ?? 'null'); } catch { return null; }
      }
      function rememberBaseline() {
        if (previousPreference !== undefined) return;
        const saved = storedBaseline();
        previousPreference = typeof saved?.preference === 'string' ? saved.preference : ctx.theme.getTheme().preference;
        try { storage?.setItem(BASELINE_KEY, JSON.stringify({preference:previousPreference})); } catch {}
      }
      function stopVideo() {
        const video = activeVideo;
        activeVideo = undefined; desiredVideo = '';
        delete document.getElementById(BG_ID)?.dataset.videoReady;
        if (!video) return;
        video.onplaying = video.onerror = null;
        video.pause(); video.removeAttribute('src'); video.load(); video.remove();
      }
      function failVideo(video) {
        if (activeVideo !== video) return;
        const url = desiredVideo;
        stopVideo(); desiredVideo = url;
        const bg = document.getElementById(BG_ID);
        if (bg) bg.dataset.videoError = 'true';
      }
      function playVideo() {
        const video = activeVideo;
        if (!video || destroyed || document.hidden || (!video.loop && video.ended)) return;
        try {
          video.play()?.catch(error => {
            if (activeVideo === video && !document.hidden && error?.name !== 'AbortError') failVideo(video);
          });
        } catch { failVideo(video); }
      }
      function visibilityChanged() {
        if (document.hidden) activeVideo?.pause(); else playVideo();
      }
      function syncVideo(theme,bg) {
        const url = mediaUrl(theme,theme.video);
        if (desiredVideo === url) return;
        stopVideo(); desiredVideo = url;
        delete bg.dataset.videoError;
        const video = document.createElement('video');
        activeVideo = video;
        video.muted = video.defaultMuted = true;
        video.autoplay = video.playsInline = true;
        video.loop = theme.videoLoop !== false;
        video.preload = 'auto'; video.controls = false;
        video.setAttribute('aria-hidden','true'); video.tabIndex = -1;
        video.poster = mediaUrl(theme,theme.asset);
        video.onplaying = () => {
          if (activeVideo !== video || destroyed) return;
          if (document.hidden) { video.pause(); return; }
          bg.dataset.videoReady = 'true';
        };
        video.onerror = () => failVideo(video);
        video.src = url; bg.appendChild(video); playVideo();
      }
      function disable(restore = true) {
        applying = true;
        try {
          restoreLegacySkins();
          removeChrome();
          removeStats();
          nativeSkin.setEnabled(false);
          releaseTokens?.(); releaseTokens = undefined;
          document.getElementById(THEME_STYLE)?.remove();
          stopVideo();
          document.getElementById(BG_ID)?.remove();
          delete document.documentElement.dataset.lotmAtlas;
          if (active && restore && previousPreference !== undefined) {
            try { ctx.theme.setTheme(previousPreference); } catch {}
          }
          active = false; desiredAsset = '';
          previousPreference = undefined;
          try { storage?.removeItem(BASELINE_KEY); } catch {}
        } finally { applying = false; }
      }
      function renderTheme(state) {
        if (destroyed) return;
        if (state.sequence === 'native') { disable(!suppressRestore); suppressRestore = false; return; }
        const theme = THEMES.find(t => t.id === state.sequence);
        if (!theme) return;
        rememberBaseline();
        applying = true;
        try {
          // Suspend only the known legacy skin in this renderer. Its files,
          // selection and token layer remain intact and are restored on handoff.
          pauseLegacySkins();
          const url = mediaUrl(theme,theme.asset);
          document.documentElement.dataset.lotmAtlas = theme.id;
          nativeSkin.setEnabled(true);
          let bg = document.getElementById(BG_ID);
          if (!bg) { bg = document.createElement('div'); bg.id = BG_ID; bg.setAttribute('aria-hidden','true'); document.body.appendChild(bg); }
          syncVideo(theme,bg);
          // Keep the last successfully loaded artwork during fast switches; a missing
          // asset still leaves a readable theme-colored background.
          const current = bg.dataset.asset || '';
          putStyle(THEME_STYLE, themeCss(theme,current || url,state.readability));
          if (desiredAsset !== url) {
            desiredAsset = url;
            const image = new Image();
            image.onload = () => {
              if (destroyed || desiredAsset !== url || store.state().sequence !== theme.id) return;
              bg.dataset.asset = url;
              putStyle(THEME_STYLE,themeCss(theme,url,store.state().readability));
            };
            image.onerror = () => { if (desiredAsset === url) bg.dataset.assetError = 'true'; };
            image.src = url;
          }
          releaseTokens?.();
          releaseTokens = ctx.theme.overrideTokens(SOURCE,themeTokens(theme));
          const scheme = theme.dark ? 'dark' : 'light';
          if (ctx.theme.getTheme().active.colorScheme !== scheme) ctx.theme.setTheme(scheme);
          active = true;
          syncChrome();
          syncStats();
        } finally { applying = false; }
      }
      function handOff() {
        if (store.state().sequence === 'native') return;
        suppressRestore = true;
        store.select('native');
      }
      function externalThemeChanged() {
        if (!active || applying) return;
        const theme = THEMES.find(t => t.id === store.state().sequence);
        const brand = ctx.theme.getTheme().active.tokens?.['--dsw-alias-brand-primary'];
        if (theme && brand && brand.toLowerCase() !== theme.accent.toLowerCase()) handOff();
      }
      function externalPaletteClick(event) {
        const button = event.target?.closest?.('button');
        if (!button || button.closest('.lotm-atlas-settings')) return;
        // Read the existing row's heading rather than altering that plugin or its
        // stored preference. Capture runs before Gradually's own click handler.
        let group = button.parentElement;
        for (let i=0;i<4 && group;i++,group=group.parentElement) {
          if (group.firstElementChild?.textContent?.trim() === '配色风格（Gradually）' || group.firstElementChild?.textContent?.trim() === 'Colour style (Gradually)') { handOff(); break; }
        }
      }
      function SequenceAtlasRow() {
        const [state,setState] = React.useState(store.state());
        React.useEffect(() => store.subscribe(setState), []);
        const selected = THEMES.find(t=>t.id===state.sequence);
        return h('section',{className:'lotm-atlas-settings','aria-label':'诡秘十序列'},
          h('div',{className:'lotm-atlas-heading'},
            h('div',null,'诡秘十序列',h('small',null,selected ? '序列 '+selected.id+' · '+selected.name : '已关闭')),
            h('div',{className:'lotm-atlas-tools'},
              h('button',{type:'button',title:'清晰内容面','aria-label':'清晰内容面','aria-pressed':state.readability==='clear',onClick:()=>store.setReadability(state.readability==='clear'?'balanced':'clear')},icon('contrast')),
              h('button',{type:'button',title:'关闭诡秘风格','aria-label':'关闭诡秘风格','aria-pressed':!selected,onClick:()=>store.select('native')},icon('power')))),
          h('div',{className:'lotm-atlas-grid'},THEMES.map(theme=>h('button',{
            key:theme.id,type:'button',className:'lotm-atlas-choice',title:'序列 '+theme.id+' · '+theme.name+' · '+theme.colorName,
            'aria-label':'序列 '+theme.id+' '+theme.name,'aria-pressed':state.sequence===theme.id,
            onClick:()=>store.select(theme.id)},h('img',{src:mediaUrl(theme,theme.thumb),alt:'',loading:'lazy',decoding:'async'})))));
      }
      ctx.effect(() => {
        putStyle(UI_STYLE,SETTINGS_CSS);
        disposers.push(store.subscribe(renderTheme));
        disposers.push(ctx.on('theme/change',externalThemeChanged));
        document.addEventListener('click',externalPaletteClick,true);
        const skinObserver = new MutationObserver(() => { if (active && !destroyed) pauseLegacySkins(); });
        skinObserver.observe(document.head,{childList:true,subtree:true});
        const chromeObserver = new MutationObserver(records => {
          if (!active || destroyed) return;
          // Transcript streaming is deliberately outside this observer's work.
          // Inspect only sidebar replacement/collapse and batch chrome changes.
          const relevant = records.some(record => record.type === 'attributes'
            || record.target.closest?.('[class*="sidebarCol"]')
            || [...record.addedNodes,...record.removedNodes].some(node => node.nodeType === 1 && (node.matches('[class*="sidebarCol"],[class*="centerCol"]') || node.querySelector('[class*="sidebarCol"],[class*="centerCol"]'))));
          if (relevant) scheduleChrome();
          const statsChanged = records.some(record => record.type === 'attributes'
            || record.target === measuredHeader || record.target === measuredTabs
            || [...record.addedNodes,...record.removedNodes].some(node => node.nodeType === 1 && (node.matches(statsStructureSelector) || node.querySelector(statsStructureSelector)
              || node === measuredTabs || node.contains(measuredTabs)
              || (node.matches('[class*="tabs"]') && node.closest('header[class*="header"]')))));
          if (statsChanged) scheduleStats();
        });
        chromeObserver.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['data-sidebar-collapsed']});
        window.addEventListener('resize',scheduleLayout);
        document.addEventListener('visibilitychange',visibilityChanged);
        renderTheme(store.state());
        return () => {
          destroyed = true;
          skinObserver.disconnect();
          chromeObserver.disconnect();
          window.removeEventListener('resize',scheduleLayout);
          document.removeEventListener('visibilitychange',visibilityChanged);
          document.removeEventListener('click',externalPaletteClick,true);
          for(const dispose of disposers.reverse()) dispose?.();
          disable(true);
          document.getElementById(UI_STYLE)?.remove();
          store.dispose();
        };
      },'lotm-sequence-atlas: theme lifecycle');
      ctx.effect(()=>ctx.locale.register(NS,{zh:{'style.title':'诡秘十序列'},en:{'style.title':'Mystery sequences'}}),'lotm-sequence-atlas: labels');
      ctx.effect(()=>ctx.slots.inject('settings.general.item',()=>ctx.slots.register({
        name:'settings.general.item',id:'lotm-sequence-atlas',order:13,locale:NS
      },SequenceAtlasRow)),'lotm-sequence-atlas: settings row');
    };
    return exports;
  }
});
