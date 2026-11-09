import test from 'node:test';
import assert from 'node:assert/strict';
import {createAssetRoutes} from '../src/host.mjs';

test('all packaged active images can be served as actual WebP files',()=>{
 for(const route of createAssetRoutes().filter(r=>r.path.endsWith('.webp'))){
  const res={writeHead(status,headers){this.status=status;this.headers=headers;},end(body){this.body=body;}};
  route.handler({method:'GET'},res);
  assert.equal(res.status,200,route.path);
  assert.ok(res.body.length>100,route.path);
  assert.equal(res.body.toString('ascii',0,4),'RIFF',route.path);
  assert.equal(res.body.toString('ascii',8,12),'WEBP',route.path);
  assert.equal(Number(res.headers['content-length']),res.body.length);
 }
});
test('only known exact asset paths are registered; no traversal handler',()=>{
 const routes=createAssetRoutes({read:()=>Buffer.from('webp')});
 assert.equal(routes.length,59);
 assert.ok(routes.some(r=>r.path.endsWith('/icons/relics/potion.webp')));
 assert.ok(routes.every(r=>r.kind==='exact'));
 assert.equal(routes.filter(r=>r.path.includes('../')).length,0);
 assert.equal(new Set(routes.map(r=>r.path)).size,routes.length);
 assert.ok(!routes.some(r=>/\/(?:sequence|thumb)-8\.webp$/.test(r.path)));
});

const response=()=>({writeHead(status,headers){this.status=status;this.headers=headers;},end(body){this.body=body;}});
test('all ten sequence videos are served as MP4, with HEAD and browser byte ranges',()=>{
 const routes=createAssetRoutes().filter(r=>r.path.endsWith('.mp4'));
 assert.equal(routes.length,10);
 for(const route of routes){
  const full=response();route.handler({method:'GET'},full);
  assert.equal(full.status,200);assert.equal(full.headers['content-type'],'video/mp4');
  assert.equal(full.headers['accept-ranges'],'bytes');
  assert.equal(full.body.toString('ascii',4,8),'ftyp');
  const part=response();route.handler({method:'GET',headers:{range:'bytes=0-31'}},part);
  assert.equal(part.status,206);assert.equal(part.headers['content-range'],`bytes 0-31/${full.body.length}`);
  assert.equal(part.headers['content-length'],32);assert.deepEqual(part.body,full.body.subarray(0,32));
  const head=response();route.handler({method:'HEAD'},head);
  assert.equal(head.status,200);assert.equal(head.body,undefined);
  assert.equal(head.headers['content-length'],full.body.length);
 }
});
test('video ranges handle suffix, open end and unsatisfiable requests',()=>{
 const route=createAssetRoutes({read:()=>Buffer.from('0123456789')}).find(r=>r.path.endsWith('.mp4'));
 assert.ok(route);
 for(const [range,expected]of [['bytes=7-','789'],['bytes=-3','789'],['bytes=8-99','89']]){
  const res=response();route.handler({method:'GET',headers:{range}},res);
  assert.equal(res.status,206);assert.equal(res.body.toString(),expected);
 }
 for(const range of ['bytes=10-','bytes=6-2','bytes=-0','bytes=-','bytes=0-1,4-5','bytes=999999999999999999999-']){
  const res=response();route.handler({method:'GET',headers:{range}},res);
  assert.equal(res.status,416,range);assert.equal(res.headers['content-range'],'bytes */10');
 }
});
test('retained column and generated occult PNGs are served; rejected throne is not exposed',()=>{
 const routes=createAssetRoutes().filter(r=>r.path.endsWith('.png'));
 assert.deepEqual(routes.map(r=>r.path.split('/').at(-1)),['pillar-fog-slim.png','occult-eye.png','occult-corner.png','lotm-wordmark.png','occult-frame-corner.png','occult-divider.png']);
 for(const route of routes){
  const res={writeHead(status,headers){this.status=status;this.headers=headers;},end(body){this.body=body;}};
  route.handler({method:'GET'},res);
  assert.equal(res.status,200);assert.equal(res.headers['content-type'],'image/png');
  assert.equal(res.body.toString('hex',0,8),'89504e470d0a1a0a');
 }
});

test('all downloaded icons serve a safe SVG with the correct MIME type',()=>{
 const routes=createAssetRoutes().filter(r=>r.path.endsWith('.svg'));assert.equal(routes.length,18);
 for(const route of routes){
  const res=response();route.handler({method:'GET'},res);
  assert.equal(res.status,200);assert.equal(res.headers['content-type'],'image/svg+xml');
  const svg=res.body.toString();assert.match(svg,/<svg\s/);assert.doesNotMatch(svg,/<script|<foreignObject|\bonload=|https?:\/\/(?!www.w3.org)/i);
 }
});
test('GET/HEAD, method errors and missing assets are predictable',()=>{
 const get=createAssetRoutes({read:()=>Buffer.from('webp')})[0];
 const res=()=>({headers:null,status:null,body:null,writeHead(status,headers){this.status=status;this.headers=headers;},end(body){this.body=body;}});
 let r=res();get.handler({method:'GET'},r);assert.equal(r.status,200);assert.equal(r.headers['content-type'],'image/webp');assert.equal(r.body.toString(),'webp');
 r=res();get.handler({method:'HEAD'},r);assert.equal(r.status,200);assert.equal(r.body,undefined);
 r=res();get.handler({method:'POST'},r);assert.equal(r.status,405);
 const missing=createAssetRoutes({read:()=>{throw Error('missing')}})[0];r=res();missing.handler({method:'GET'},r);assert.equal(r.status,404);
});

