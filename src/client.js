window.__ModuleLoader__.load({
  id: 'dsh-lotm-sequence-atlas',
  factory: (require) => {
    const React = require('react');
    const h = React.createElement;
    const exports = {};
    /* CORE */
    /* STYLES */
    /* CATALOG */
    const SOURCE = 'dsh-lotm-sequence-atlas';
    const BASELINE_KEY = STORAGE_KEY + '/previous-theme';
    const UI_STYLE = 'lotm-atlas-settings-css';
    const THEME_STYLE = 'lotm-atlas-theme-css';
    const BG_ID = 'lotm-atlas-background';
    const NS = 'settings.lotm-sequence-atlas';
    // Lucide Power / Contrast, ISC; icon geometry is kept consistent with native controls.
    function icon(kind) {
      const common = {width:18,height:18,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:1.8,strokeLinecap:'round',strokeLinejoin:'round','aria-hidden':true};
      return kind === 'power'
        ? h('svg', common, h('path',{d:'M18.36 6.64a9 9 0 1 1-12.73 0'}), h('path',{d:'M12 2v10'}))
        : h('svg', common,h('circle',{cx:12,cy:12,r:10}),h('path',{d:'M12 2a10 10 0 0 1 0 20Z',fill:'currentColor',stroke:'none'}));
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
        if (!video || destroyed || document.hidden) return;
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
        const url = ASSET_PREFIX + theme.video;
        if (desiredVideo === url) return;
        stopVideo(); desiredVideo = url;
        delete bg.dataset.videoError;
        const video = document.createElement('video');
        activeVideo = video;
        video.muted = video.defaultMuted = true;
        video.autoplay = video.loop = video.playsInline = true;
        video.preload = 'auto'; video.controls = false;
        video.setAttribute('aria-hidden','true'); video.tabIndex = -1;
        video.poster = ASSET_PREFIX + theme.asset;
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
          const url = ASSET_PREFIX + theme.asset;
          document.documentElement.dataset.lotmAtlas = theme.id;
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
            onClick:()=>store.select(theme.id)},h('img',{src:ASSET_PREFIX+theme.thumb,alt:'',loading:'lazy',decoding:'async'})))));
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
