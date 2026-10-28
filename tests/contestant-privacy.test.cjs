const test=require('node:test'),assert=require('node:assert/strict');
const C=require('../functions/core.cjs');
test('contestant identity remains private until ended AND explicitly published',()=>{
 const s=C.initial();s.candidates[0]={...s.candidates[0],name:'PRIVATE_CONTESTANT',costume:'月夜伯爵',description:'披著斗篷的訪客',photo:'/media/aa.jpg',photos:['/media/aa.jpg'],active:true};
 for(const mode of ['scheduled','running','paused','ended']){
  s.mode=mode;s.endsAt=999999;s.scheduledAt=999999;
  const publicData=C.publicView(s,1000);assert.equal(JSON.stringify(publicData).includes('PRIVATE_CONTESTANT'),false);assert.equal(publicData.candidates[0].costume,'月夜伯爵');assert.equal(publicData.candidates[0].description,'披著斗篷的訪客');assert.equal(C.adminView(s,1000).candidates[0].name,'PRIVATE_CONTESTANT');
 }
 s.published=true;s.mode='running';assert.equal(JSON.stringify(C.publicView(s,1000)).includes('PRIVATE_CONTESTANT'),false);
 s.mode='ended';const published=C.publicView(s,1000);assert.equal(published.candidates[0].name,'PRIVATE_CONTESTANT');assert.equal(published.results[0].name,'PRIVATE_CONTESTANT');
 C.reset(s,{confirmation:'RESET',expectedTotalVotes:0,scheduledAt:999999,durationMinutes:30},1000);assert.equal(JSON.stringify(C.publicView(s,1000)).includes('PRIVATE_CONTESTANT'),false);
});
