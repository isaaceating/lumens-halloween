const test=require('node:test'),assert=require('node:assert/strict'),C=require('../functions/core.cjs');
const secret='pairs-test-only';
function seed(){const s=C.initial();s.scheduledAt=100;s.durationMs=10000;s.employees=[C.keyFor(secret,'employee','T01')];s.candidates.forEach(c=>{c.active=true;c.photo='/media/aa.jpg';});return s;}
test('exactly two different candidates required; all invalid requests leave no partial vote',()=>{
 for(const patch of [{candidateId:'01'},{candidateIds:[]},{candidateIds:['01']},{candidateIds:['01','01']},{candidateIds:['01','02','03']},{candidateIds:['01','99']},{candidateIds:['01',2]},{candidateIds:['01','02'],generation:1}]){
 const s=seed(),before=structuredClone(s);assert.throws(()=>C.vote(s,{employeeId:'T01',generation:0,...patch},secret,200));assert.deepEqual(s,before);
 }
 const s=seed();s.candidates[1].active=false;assert.throws(()=>C.vote(s,{employeeId:'T01',generation:0,candidateIds:['01','02']},secret,200));assert.deepEqual(s.votes,{});
});
test('two selections count independently but one employee can only submit once',()=>{
 const s=seed(),b={employeeId:'T01',generation:0,candidateIds:['01','04']};C.vote(s,b,secret,200);const view=C.adminView(s,200);assert.equal(view.totalVotes,1);assert.equal(view.totalSelections,2);assert.deepEqual(view.results.map(r=>[r.id,r.votes]),[['01',1],['02',0],['03',0],['04',1]]);assert.throws(()=>C.vote(s,{...b,candidateIds:['02','03']},secret,201));assert.equal(C.counts(s).reduce((n,r)=>n+r.votes,0),2);
});
test('reset migrates three candidates to four without changing original media or roster',()=>{
 const s=seed();s.candidates.pop();s.candidates[0].video={id:'fake',url:'test.mp4',poster:'test.jpg'};s.candidates[0].photos=['first.jpg','second.jpg'];C.vote(s,{employeeId:'T01',generation:0,candidateIds:['01','02']},secret,200);const before=structuredClone(s);C.reset(s,{confirmation:'RESET',expectedTotalVotes:1,scheduledAt:50000,durationMinutes:30},300);assert.deepEqual(s.candidates.slice(0,3),before.candidates);assert.deepEqual(s.employees,before.employees);assert.equal(s.candidates[3].id,'04');assert.equal(s.candidates[3].active,false);assert.deepEqual(s.votes,{});assert.equal(s.generation,1);
});

