import { alpha, hexRgb, themeTokens } from './core.mjs';
const ICON_NAMES=['cards','cube','masks-theater','script','stairs-up','eye','eye-off','moon-stars','pentagram','send','paperclip','settings','plus','x','minus','chevron-down','search','layout-sidebar'];
const ICON_CSS=ICON_NAMES.map(name=>`[data-lotm-glyph="${name}"],[data-lotm-icon="${name}"]{--lotm-icon:url('/api/lotm-sequence-atlas/assets/icons/tabler/original/${name}.svg')}`).join('\n');
export const SETTINGS_CSS = `
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

export function themeCss(t, assetUrl, readability = 'clear') {
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
${settingsFinishCss(t)}
`;
}

// Settings are portalled outside #root, where the host token layer may not
// inherit. Keep these overrides scoped to the active atlas and settings modal.
function settingsFinishCss(t){
 const s='html[data-lotm-atlas]';
 const modal=`${s} :is([data-shortcut-modal="settings"],[role="dialog"]:has(.lotm-atlas-settings))`;
 const tokens=Object.entries(themeTokens(t)).map(([name,value])=>`${name}:${value.light}`).join(';');
 const edge=alpha(t.accent,t.dark?.28:.23);
 const selected=alpha(t.accent,t.dark?.19:.10);
 return `
${modal}{${tokens};--dsw-specific-sidebar-nav-item-active:${selected};--dsw-specific-sidebar-nav-item-hover:${alpha(t.accent,.08)};--dsw-alias-brand-primary-new-colorprimary-new-color:${t.accent};background:${t.panel}!important;color:${t.text}!important;border:1px solid ${edge}!important;font-family:${t.uiFont}!important}
${modal} :is([aria-current="true"],[aria-current="page"],[role="tab"][aria-selected="true"]){background:${selected}!important;color:${t.accent}!important}
${modal} [role="switch"][aria-checked="true"]{background:${t.accent}!important}
${s} .lotm-atlas-settings{color:${t.text};border-color:${edge};font-family:${t.uiFont}}
${s} .lotm-atlas-heading small{color:${t.muted}}
${s} .lotm-atlas-tools button{background:${t.panelSoft};color:${t.text};border-color:${edge}}
${s} .lotm-atlas-tools button[aria-pressed="true"]{background:${selected};color:${t.accent};border-color:${alpha(t.accent,.6)}}
${s} .lotm-atlas-choice[aria-pressed="true"]{border-color:${t.accent};box-shadow:0 0 0 1px ${t.accent}}
${s} .lotm-atlas-settings button:focus-visible{outline-color:${t.accent}!important}
${s} .lotm-atlas-tools button:hover:not(:disabled){border-color:${t.accent}}
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
 const surfaceOpacity=t.dark?{clear:.92,balanced:.86}:{clear:.90,balanced:.76};
 const surface=alpha(t.panel,surfaceOpacity[readability]||surfaceOpacity.clear);
 const processSurface=alpha(t.panelSoft,readability==='clear'?.94:.90);
 const edge=alpha(t.ornament||t.accent,t.dark?.20:.18);
 const glint=t.dark?'rgba(255,255,255,.045)':'rgba(255,255,255,.52)';
 const process=`${s} [data-step-process][data-group-expanded-mode],${s} [data-step-process]:has(>div>.BE0jCW_title[aria-expanded="true"])`;
 return `
${process},${s} .xMeOpW_body{box-sizing:border-box;min-width:0;background:${surface}!important;border:1px solid ${edge}!important;border-radius:13px!important;padding:12px 16px!important;box-shadow:inset 0 1px 0 ${glint}!important;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);color:${t.text}!important}
${process}{background:${processSurface}!important}
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
 const relicButton=`${s} [class*="sidebarCol"] button:has(> .lotm-nav-relic)`;
 const relicFilter=t.dark ? `brightness(1.16) drop-shadow(0 0 1px ${alpha(ink,.48)})` : 'drop-shadow(0 1px 1px rgba(46,27,17,.25))';
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
${s} .lotm-nav-relic{display:none!important}
@media(forced-colors:none){
${relicButton} :is(svg,[class*="panelGlyph"]){display:none!important}
${relicButton}::before{content:"";display:block;flex:none;width:24px;height:24px;background:${ink};mask:var(--lotm-icon) center/19px 19px no-repeat;-webkit-mask:var(--lotm-icon) center/19px 19px no-repeat;pointer-events:none}
${relicButton}:has(> .lotm-nav-relic:not([hidden]))::before{display:none}
${relicButton} > .lotm-nav-relic:not([hidden]){display:block!important;flex:none;width:24px;height:24px;object-fit:contain;pointer-events:none;filter:${relicFilter}}
}
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
${s} #lotm-atlas-background{--lotm-art-offset:${t.artOffset};--lotm-art-top:${t.artTop||'50%'};--lotm-art-width:max(calc(100vw + ${t.id==='8'||t.id==='0'?'0px':'clamp(144px,18vw,320px)'}),calc(100vh * 1.78));--lotm-art-position:calc(50% - var(--lotm-art-offset)) var(--lotm-art-top);background-image:${backgroundLayers.join(',')};background-size:${backgroundSizes};background-position:${backgroundPositions}}
${s} #lotm-atlas-background{overflow:hidden}
${s} #lotm-atlas-background > video{position:absolute;z-index:0;left:calc(50% - var(--lotm-art-offset));top:var(--lotm-art-top);width:var(--lotm-art-width);height:auto;max-width:none;max-height:none;transform:translate(-50%,${t.artTop?'0':'-50%'});pointer-events:none;opacity:0}
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
@media(max-width:1100px){${s} #lotm-atlas-background{--lotm-art-offset:${({'9':'24px','8':'-110px','6':'0px','5':'-48px','4':'32px','3':'-32px','0':'0px'})[t.id]||'64px'}}}
@media(max-width:820px){${s} [data-conversation-scroll]{padding-left:20px!important;padding-right:20px!important}${s} #lotm-atlas-background{background-image:linear-gradient(${alpha(t.bg,.87)},${alpha(t.bg,.87)}),url(${JSON.stringify(assetUrl)});background-position:center,center;background-size:cover,cover}${s} #lotm-atlas-background > video{inset:0;width:100%;height:100%;object-fit:cover;transform:none}${s} #lotm-atlas-background::after{background-image:linear-gradient(${alpha(t.bg,.87)},${alpha(t.bg,.87)})}${s} :is(#lotm-atlas-pillar,#lotm-atlas-pillar-right){display:none}}
@media(prefers-reduced-motion:reduce){${s} *,${s} *:before,${s} *:after{transition:none!important;animation:none!important}}
`;
}
