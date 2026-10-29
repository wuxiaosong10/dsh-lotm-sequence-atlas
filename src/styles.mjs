import { alpha } from './core.mjs';
export const SETTINGS_CSS = `
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
${scope} #root > [class*="frame"],${scope} .mP3x-q_frame,${scope} div[class*="centerCol"]{background:transparent!important;background-image:none!important}
${scope} div[class*="centerCol"] > div,${scope} .an3WzG_root,${scope} [data-conversation-region="chat"],${scope} [data-chat-flow]{background:transparent!important;background-image:none!important}
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
${s} [class*="sidebarCol"]{position:relative;background:${alpha(t.chromeBg,.94)}!important;border-right:0!important;box-shadow:inset 0 1px 0 ${highlight}!important}
${s} [class*="rightbarCol"]{border-left:0!important}
${s} [class*="sidebarCol"] > div{background:transparent!important;background-image:none!important;padding:5px 8px 8px!important;gap:5px!important;font-size:12px!important}
${s} :is(#lotm-atlas-pillar,#lotm-atlas-pillar-right){position:fixed;z-index:2;pointer-events:none;top:104px;bottom:20px;width:24px;background:url('/api/lotm-sequence-atlas/assets/ornaments/pillar-fog-slim.png') center/640% 100% no-repeat;opacity:${t.dark?.48:.34};filter:drop-shadow(0 1px 3px ${shadow})}
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
@media(max-width:820px){${s} [data-conversation-scroll]{padding-left:20px!important;padding-right:20px!important}${s} #lotm-atlas-background{background-image:linear-gradient(${alpha(t.bg,.87)},${alpha(t.bg,.87)}),url(${JSON.stringify(assetUrl)});background-position:center,center;background-size:cover,cover}${s} :is(#lotm-atlas-pillar,#lotm-atlas-pillar-right){display:none}}
@media(prefers-reduced-motion:reduce){${s} *,${s} *:before,${s} *:after{transition:none!important;animation:none!important}}
`;
}
