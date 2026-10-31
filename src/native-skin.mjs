// Cosmetic adapter for the shipped DSH React chrome. It never replaces controls
// or touches editor values, messages, project names, or conversation titles.
export function createNativeSkin(document) {
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
