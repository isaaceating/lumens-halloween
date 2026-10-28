const test = require('node:test');
const assert = require('node:assert/strict');
const C = require('../functions/core.cjs');
const {createApi} = require('../functions/api.cjs');
const {LocalStore} = require('../scripts/store.cjs');
const secret = 'import-test-secret';
const key = id => C.keyFor(secret, 'employee', id);
async function setup() {
  const state = C.initial();
  state.employees = [key('001'), key('002')];
  state.employeeProfiles = {[key('001')]: {name:'測試甲',department:'測試部'}, [key('002')]:{name:'測試乙',department:'保留部'}};
  const store = new LocalStore(null, {[C.EVENT]:state});
  const api = createApi({store,secret,passwordHash:C.passwordHash('test-only'),now:()=>1000});
  const {token} = await api({method:'POST',path:'/login',body:{password:'test-only'}});
  const send = body => api({method:'POST',path:'/admin/employees',token,body});
  return {store,api,token,send};
}
test('default merge updates matching identity, adds once, preserves absent employees and omitted profiles',async()=>{
  const {store,send} = await setup();
  const result = await send({ids:[{id:'001',name:'測試甲更新',department:'新部門'},{id:'003',name:'測試丙',department:'測試部'},'003']});
  assert.deepEqual(result.importSummary,{mode:'merge',added:1,updated:1,removed:0,total:3});
  let s = await store.get(C.EVENT);
  assert.equal(s.employeeProfiles[key('002')].name,'測試乙');
  assert.equal(s.employeeProfiles[key('003')].name,'測試丙');
  await send({ids:['001']});
  s = await store.get(C.EVENT);
  assert.equal(s.employeeProfiles[key('001')].name,'測試甲更新');
  assert.equal(s.employees.length,3);
});
test('replacement requires explicit confirmation and current revision; confirmed replacement removes absent identities',async()=>{
  const {store,send} = await setup();
  await assert.rejects(send({ids:['001'],mode:'replace',revision:0}));
  await assert.rejects(send({ids:['001'],mode:'replace',confirmReplace:true,revision:99}),e=>e.status===409);
  assert.equal((await store.get(C.EVENT)).employees.length,2);
  const result = await send({ids:['001'],mode:'replace',confirmReplace:true,revision:0});
  assert.deepEqual(result.importSummary,{mode:'replace',added:0,updated:0,removed:1,total:1});
  const s = await store.get(C.EVENT);
  assert.equal(s.employeeProfiles[key('002')],undefined);
  assert.equal(s.employeeProfiles[key('001')].name,'測試甲');
});
test('concurrent merges preserve both imports and invalidate stale replacement',async()=>{
  const {store,send} = await setup();
  await Promise.all([send({ids:['003']}),send({ids:['004']})]);
  assert.equal((await store.get(C.EVENT)).employees.length,4);
  await assert.rejects(send({ids:['001'],mode:'replace',confirmReplace:true,revision:0}),e=>e.status===409);
});
test('invalid batch is atomic and total merged limit is enforced',async()=>{
  const {store,send} = await setup();
  const before = await store.get(C.EVENT);
  await assert.rejects(send({ids:['003',{id:'004',name:'',department:''}]}));
  assert.deepEqual(await store.get(C.EVENT),before);
  await assert.rejects(send({ids:Array.from({length:2000},(_,i)=>'NEW'+i)}));
  assert.deepEqual(await store.get(C.EVENT),before);
  await assert.rejects(send({ids:['003'],mode:'wrong'}));
});
test('imports require admin and cannot change a started event',async()=>{
  const {store,api,send} = await setup();
  await assert.rejects(api({method:'POST',path:'/admin/employees',body:{ids:['003']}}),e=>e.status===401);
  await store.transaction(async tx=>{const s=await tx.get(C.EVENT);s.mode='running';s.endsAt=999999;tx.set(C.EVENT,s);});
  await assert.rejects(send({ids:['003']}));
  assert.equal((await store.get(C.EVENT)).employees.length,2);
});
test('v1.20.3 frontend keeps the compatible v1.14 API',()=>{
  const fs=require('node:fs');
  assert.equal(require('../package.json').version,'1.20.3');
  assert.equal(require('../functions/package.json').version,'1.14.0');
  assert.equal(require('../functions/package-lock.json').packages[''].version,'1.14.0');
  assert.match(fs.readFileSync('site-config.js','utf8'),/version:"v1\.20\.3"/);
  assert.equal(C.publicView(C.initial(),1000).apiVersion,'1.14.0');
});
