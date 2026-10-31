import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {THEMES,ASSET_PREFIX} from '../src/catalog.mjs';
const root=new URL('../',import.meta.url);
const [core,css,client,skin]=await Promise.all(['src/core.mjs','src/styles.mjs','src/client.js','src/native-skin.mjs'].map(p=>readFile(new URL(p,root),'utf8')));
const bundle=client.replace('/* CORE */',core.replace(/^export /gm,'')).replace('/* STYLES */',css.replace(/^import .*$/gm,'').replace(/^export /gm,'')).replace('/* NATIVE_SKIN */',skin.replace(/^export /gm,'')).replace('/* CATALOG */','const THEMES='+JSON.stringify(THEMES)+';const ASSET_PREFIX='+JSON.stringify(ASSET_PREFIX)+';');
await mkdir(new URL('lib/',root),{recursive:true});
await writeFile(new URL('lib/client.js',root),bundle);
await writeFile(new URL('lib/index.js',root),await readFile(new URL('src/host.mjs',root),'utf8'));
console.log('Built native DSH desktop client and host modules');

