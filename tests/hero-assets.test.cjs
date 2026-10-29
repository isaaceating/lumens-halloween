const test=require('node:test'),assert=require('node:assert/strict'),{loadHeroAsset,prepareHeroAssets}=require('../hero-assets.js');
test('background does not block scene decode; unique queue has at most four concurrent loads',async()=>{let active=0,max=0;const calls=[],progress=[];const result=await prepareHeroAssets('bg',['bg','a','a','b','c','d'],async src=>{calls.push(src);max=Math.max(max,++active);await new Promise(r=>setTimeout(r,src==='bg'?15:2));active--;return src;},{onProgress:(n,total)=>progress.push([n,total])});assert.equal(max,4);assert.deepEqual(calls,['bg','a','b','c','d']);assert.equal(result.length,5);assert.deepEqual(progress.map(p=>p[0]),[0,1,2,3,4,5]);assert.ok(progress.every(p=>p[1]===5));});
test('retry retains completed assets and real progress without reloading successes',async()=>{const cache=new Map(),calls=[],progress=[];let fail=true;const load=async src=>{calls.push(src);if(src==='a'&&fail)throw Error('missing');return src};const options={cache,onProgress:n=>progress.push(n)};await assert.rejects(prepareHeroAssets('bg',['a','b'],load,options));assert.equal(cache.size,2);fail=false;await prepareHeroAssets('bg',['a','b'],load,options);assert.deepEqual(calls,['bg','a','b','a']);assert.deepEqual(progress,[0,1,2,2,3]);});
test('readiness waits for actual decode and propagates failure or timeout',async()=>{let release;class FakeImage{decode(){return new Promise(r=>release=r)}}let ready=false;const load=loadHeroAsset('bg',{ImageCtor:FakeImage,timeoutMs:100}).then(()=>ready=true);await Promise.resolve();assert.equal(ready,false);release();await load;assert.equal(ready,true);class Broken{decode(){return Promise.reject(new Error('bad'))}}await assert.rejects(loadHeroAsset('bg',{ImageCtor:Broken,timeoutMs:100}));class Stuck{decode(){return new Promise(()=>{})}}await assert.rejects(loadHeroAsset('bg',{ImageCtor:Stuck,timeoutMs:5}));});
const {fetchHeroBytes,loadHeroTransfer,waitForHeroFonts}=require('../hero-assets.js');
const fs=require('node:fs'),vm=require('node:vm'),crypto=require('node:crypto');
test('streaming reports bytes before completion and resets idle timeout on every chunk',async()=>{
 const progress=[];let i=0;const bytes=await fetchHeroBytes('asset',{idleMs:35,totalMs:500,expectedSize:4,onBytes:n=>progress.push(n),fetchImpl:async()=>({ok:true,body:{getReader:()=>({read:async()=>{await new Promise(r=>setTimeout(r,15));return i++<4?{value:Uint8Array.of(i),done:false}:{done:true}}})}})});
 assert.deepEqual([...bytes],[1,2,3,4]);assert.deepEqual(progress,[1,2,3,4]);
});
test('stalled primary is aborted and fallback downloads identical bytes',async()=>{
 const calls=[];let aborted=false;const payload=Uint8Array.of(1,2,3),sha=crypto.createHash('sha256').update(payload).digest('hex');
 const result=await loadHeroTransfer('assets/test.webp',{url:'https://primary/?alt=media',size:3,sha},{idleMs:10,totalMs:200,fetchImpl:(url,{signal})=>{calls.push(url);if(calls.length===1)return new Promise((resolve,reject)=>signal.addEventListener('abort',()=>{aborted=true;reject(Error('aborted'))}));return Promise.resolve(new Response(payload));},decode:async()=>{},createURL:()=> 'blob:verified'});
 assert.equal(aborted,true);assert.equal(result.url,'blob:verified');assert.equal(calls.length,2);assert.ok(calls[1].startsWith('assets/test.webp?hero='));
});
test('corrupt content and failed decode cannot be marked ready; allocated URL is revoked',async()=>{
 const payload=Uint8Array.of(1,2,3),sha=crypto.createHash('sha256').update(payload).digest('hex');let calls=0,decodes=0;const revoked=[];
 const result=await loadHeroTransfer('assets/test.webp',{url:'https://primary/?alt=media',size:3,sha},{fetchImpl:async()=>new Response(++calls===1?Uint8Array.of(4,5,6):payload),decode:async()=>{if(++decodes===1)throw Error('decode')},createURL:()=> 'blob:'+calls,revokeURL:u=>revoked.push(u)});
 assert.equal(calls,3);assert.deepEqual(revoked,['blob:2']);assert.equal(result.url,'blob:3');
});
test('incomplete response rejected and stalled font server cannot block images',async()=>{await assert.rejects(fetchHeroBytes('asset',{fetchImpl:async()=>new Response(Uint8Array.of(1)),expectedSize:2}),/不完整/);await waitForHeroFonts({ready:new Promise(()=>{})},5);});
test('immutable manifest matches full-quality local assets and is shipped with the site',()=>{
 const sandbox={window:{}};vm.runInNewContext(fs.readFileSync('hero-manifest.js','utf8'),sandbox);const manifest=sandbox.window.HERO_ASSET_MANIFEST;
 assert.equal(Object.keys(manifest).length,13);
 for(const [file,entry] of Object.entries(manifest)){const bytes=fs.readFileSync(file);assert.equal(bytes.length,entry.size);assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),entry.sha);if(file==='assets/cute-pumpkin.webp'){assert.equal(entry.url,undefined);}else{assert.ok(entry.url.includes(entry.sha));}}
 const html=fs.readFileSync('index.html','utf8');assert.ok(html.indexOf('src="hero-manifest.js?v=1.24.1"')<html.indexOf('src="hero-assets.js?v=1.24.1"'));assert.ok(!html.includes('rel="preload" as="image"'));assert.ok(fs.readFileSync('scripts/build.cjs','utf8').includes("'hero-manifest.js'"));
});
