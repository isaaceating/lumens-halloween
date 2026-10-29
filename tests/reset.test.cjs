const test=require('node:test'),assert=require('node:assert/strict');
const C=require('../functions/core.cjs'),{createApi}=require('../functions/api.cjs'),{LocalStore}=require('../scripts/store.cjs');
async function setup(){
 const secret='isolated-reset-test',s=C.initial();s.scheduledAt=100000;
 s.employees=['TEST001','TEST002'].map(id=>C.keyFor(secret,'employee',id));
 s.employeeProfiles=Object.fromEntries(s.employees.map(key=>[key,{name:'測試同仁',department:'測試部'}]));
 s.candidates[0]={...s.candidates[0],name:'測試造型',photo:'/media/aa.jpg',photos:['/media/aa.jpg','/media/bb.jpg'],active:true};
 s.candidates[1]={...s.candidates[1],photo:'/media/bb.jpg',active:true};
 const store=new LocalStore(null,{[C.EVENT]:s});let now=1000;
 const api=createApi({store,secret,passwordHash:C.passwordHash('isolated-test'),savePhoto:async()=>'',now:()=>now});
 const {token}=await api({method:'POST',path:'/login',body:{password:'isolated-test'}});
 const get=()=>api({method:'GET',path:'/admin/event',token});
 const post=(path,body)=>api({method:'POST',path,body,token});
 const control=async action=>post('/admin/control',{revision:(await get()).revision,action});
 const ballot=async id=>post('/vote',{employeeId:id,candidateIds:['01','02'],generation:(await get()).generation});
 const resetBody=async()=>{const v=await get();return {revision:v.revision,expectedTotalVotes:v.totalVotes,confirmation:'RESET',scheduledAt:200000,durationMinutes:30};};
 return {store,api,get,post,control,ballot,resetBody,advance:t=>now=t};
}
test('full isolated lifecycle: pause/resume, hidden results, publish, reset and vote again',async()=>{
 const f=await setup(),before=await f.store.get(C.EVENT);
 await f.control('start');await f.ballot('TEST001');await f.control('pause');
 const remaining=(await f.get()).remainingMs;f.advance(8000);assert.equal((await f.get()).remainingMs,remaining);
 await assert.rejects(f.ballot('TEST002'),e=>e.status===409);
 await f.control('resume');assert.equal((await f.get()).endsAt,8000+remaining);
 await f.ballot('TEST002');await f.control('end');
 assert.equal((await f.api({method:'GET',path:'/event'})).results,undefined);
 await f.control('publish');assert.equal((await f.api({method:'GET',path:'/event'})).results[0].votes,2);
 const reset=await f.post('/admin/reset',await f.resetBody());assert.equal(reset.status,'scheduled');assert.equal(reset.totalVotes,0);assert.equal(reset.published,false);assert.equal(reset.generation,1);
 const after=await f.store.get(C.EVENT);for(const k of ['employees','employeeProfiles','candidates'])assert.deepEqual(after[k],before[k]);
 assert.equal((await f.api({method:'GET',path:'/event'})).results,undefined);
 await f.control('start');await f.ballot('TEST001');assert.equal((await f.get()).totalVotes,1);
 await assert.rejects(f.ballot('TEST001'),e=>e.status===409);
});
test('reset rejects unauthorized, unconfirmed, stale or invalid requests atomically',async()=>{
 const f=await setup();await f.control('start');await f.ballot('TEST001');const b=await f.resetBody();
 const before=await f.store.get(C.EVENT);
 await assert.rejects(f.api({method:'POST',path:'/admin/reset',body:b}),e=>e.status===401);
 for(const invalid of [{confirmation:''},{confirmation:'reset'},{revision:b.revision-1},{expectedTotalVotes:0},{scheduledAt:0},{durationMinutes:0}]){
  await assert.rejects(f.post('/admin/reset',{...b,...invalid}));assert.deepEqual(await f.store.get(C.EVENT),before);
 }
 await f.ballot('TEST002');await assert.rejects(f.post('/admin/reset',b),e=>e.status===409);
 assert.equal((await f.get()).totalVotes,2);
});
test('simultaneous reset confirmations execute only once',async()=>{
 const f=await setup(),b=await f.resetBody();const r=await Promise.allSettled([f.post('/admin/reset',b),f.post('/admin/reset',b)]);
 assert.equal(r.filter(x=>x.status==='fulfilled').length,1);assert.equal((await f.get()).generation,1);
});
