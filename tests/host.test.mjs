import test from 'node:test';
import assert from 'node:assert/strict';
import {createAssetRoutes} from '../src/host.mjs';

test('all packaged active and retained images can be served as actual WebP files',()=>{
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
 assert.equal(routes.length,23);
 assert.ok(routes.every(r=>r.kind==='exact'));
 assert.equal(routes.filter(r=>r.path.includes('../')).length,0);
 assert.equal(new Set(routes.map(r=>r.path)).size,23);
});
test('only the retained column PNG is served; rejected throne is not exposed',()=>{
 const routes=createAssetRoutes().filter(r=>r.path.endsWith('.png'));
 assert.deepEqual(routes.map(r=>r.path.split('/').at(-1)),['pillar-fog-slim.png']);
 for(const route of routes){
  const res={writeHead(status,headers){this.status=status;this.headers=headers;},end(body){this.body=body;}};
  route.handler({method:'GET'},res);
  assert.equal(res.status,200);assert.equal(res.headers['content-type'],'image/png');
  assert.equal(res.body.toString('hex',0,8),'89504e470d0a1a0a');
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

