'use strict';
const crypto = require('node:crypto');
const EVENT = 'events/halloween-2026';
class Fault extends Error { constructor(status, message) { super(message); this.status = status; } }
function assert(ok, message, status = 400) { if (!ok) throw new Fault(status, message); }
function initial() { return {title:'Lumens Halloween 2026',scheduledAt:Date.parse('2026-10-30T15:00:00+08:00'),durationMs:1800000,mode:'scheduled',remainingMs:1800000,endsAt:null,published:false,employees:[],employeeProfiles:{},votes:{},revision:0,candidates:[1,2,3,4].map(n=>({id:String(n).padStart(2,'0'),name:`參賽者 ${n}`,costume:'造型即將揭曉',description:'',photo:'',active:false}))}; }
function clock(s, now) { if (s.mode === 'ended') return {status:'ended',remainingMs:0,endsAt:s.endsAt}; if(s.mode==='paused') return {status:'paused',remainingMs:s.remainingMs,endsAt:null}; const end=s.mode==='running'?s.endsAt:s.scheduledAt+s.durationMs; if(s.mode==='scheduled'&&now<s.scheduledAt)return {status:'scheduled',remainingMs:s.durationMs,endsAt:end};return {status:now>=end?'ended':'running',remainingMs:Math.max(0,end-now),endsAt:end}; }
function counts(s) { return require('./awards.cjs').results(s); }
function publicView(s,now){const c=clock(s,now);return {apiVersion:require('./package.json').version,votesPerVoter:2,title:s.title,generation:s.generation||0,startedAt:s.startedAt||(c.status==='scheduled'?null:s.scheduledAt),scheduledAt:s.scheduledAt,durationMs:s.durationMs,...c,serverNow:now,published:s.published,candidates:s.candidates.map(({id,name,costume,description,photo,photos,video,active},i)=>active?{id,name:s.published&&c.status==='ended'?name:`參賽者 ${i+1}`,costume,description,photo,video:video||null,photos:photos||(photo?[photo]:[]),active}:{id,name:`參賽者 ${i+1}`,costume:"造型即將揭曉",description:"",photo:"",photos:[],active:false}),...(s.published&&c.status==='ended'?{results:counts(s)}:{})};}
function adminView(s,now){return {...publicView(s,now),candidates:s.candidates,awards:s.awards||{},revision:s.revision,totalVotes:Object.keys(s.votes).length,totalSelections:Object.values(s.votes).reduce((n,v)=>n+(v.candidateIds?.length||1),0),employeeCount:s.employees.length,results:counts(s)};}
function employeeId(value){const id=String(value??'').trim().normalize('NFKC').toUpperCase();assert(/^[A-Z0-9_-]{1,32}$/.test(id),'工號格式不正確');return id;}
const keyFor=(secret,scope,value)=>crypto.createHmac('sha256',secret).update(`${scope}:${value}`).digest('hex');
function passwordHash(password){const salt=crypto.randomBytes(16).toString('hex');return `${salt}:${crypto.scryptSync(password,salt,64).toString('hex')}`;}
function verifyPassword(password,hash){const [salt,key]=String(hash).split(':');if(!salt||!key||typeof password!=='string'||password.length>200)return false;const expected=Buffer.from(key,'hex'),actual=crypto.scryptSync(password,salt,64);return expected.length===actual.length&&crypto.timingSafeEqual(actual,expected);}
function control(s,action,now){const c=clock(s,now);assert(!s.published,'結果已公布，活動已鎖定');switch(action){case 'start':assert(c.status==='scheduled','只能提前開始尚未開始的活動');assert(s.employees.length&&s.candidates.filter(c=>c.active&&c.photo).length>=2,'請先匯入工號，並至少發布兩位有照片的參賽者');s.mode='running';s.startedAt=now;s.endsAt=now+s.durationMs;break;case 'pause':assert(c.status==='running','目前不是投票中');s.mode='paused';s.remainingMs=c.remainingMs;s.endsAt=null;break;case 'resume':assert(c.status==='paused','目前不是暫停中');s.mode='running';s.endsAt=now+s.remainingMs;break;case 'end':assert(c.status!=='ended','活動已結束');s.mode='ended';s.endsAt=now;s.remainingMs=0;break;case 'publish':throw new Fault(400,'請使用公布結果操作');default:throw new Fault(400,'不支援的操作');}s.revision++;return s;}
function settings(s,b,now){assert(clock(s,now).status==='scheduled'&&!Object.keys(s.votes).length,'時間僅能在活動開始前修改');const at=Number(b.scheduledAt),minutes=Number(b.durationMinutes);assert(Number.isFinite(at)&&at>now,'開始時間必須晚於現在');assert(Number.isInteger(minutes)&&minutes>=1&&minutes<=1440,'投票時長須為 1–1440 分鐘');s.scheduledAt=at;s.durationMs=minutes*60000;s.remainingMs=s.durationMs;s.revision++;return s;}
function vote(s,b,secret,now){
 assert(Array.isArray(b.candidateIds)&&b.candidateIds.length===2&&new Set(b.candidateIds).size===2,'請重新整理網頁，選擇兩位不同選手後一次送出',400);
 assert(b.generation===(s.generation||0),'活動已重設，請重新整理後再投票',409);
 assert(clock(s,now).status==='running','目前尚未開放投票或投票已停止',409);
 const id=keyFor(secret,'employee',employeeId(b.employeeId));assert(s.employees.includes(id),'工號不在本次投票資格名單',403);
 assert(!s.votes[id],'此工號已投票，無法重複投票或改票',409);
 const ids=b.candidateIds.map(id=>{const c=s.candidates.find(c=>c.id===id);assert(c?.active&&c.photo,'此參賽者尚未開放投票',409);return c.id;});
 s.votes[id]={candidateIds:ids,at:now};return s;
}

function reset(s,b,now){
 assert(b.confirmation==='RESET','請輸入 RESET 確認重設');
 assert(b.expectedTotalVotes===Object.keys(s.votes).length,'票數已變動，請重新整理並重新確認',409);
 const at=Number(b.scheduledAt),minutes=Number(b.durationMinutes);
 assert(Number.isFinite(at)&&at>now,'重設後的開始時間必須晚於現在');
 assert(Number.isInteger(minutes)&&minutes>=1&&minutes<=1440,'投票時長須為 1–1440 分鐘');
 for(const c of initial().candidates){if(!s.candidates.some(existing=>existing.id===c.id))s.candidates.push(c);}s.votes={};s.awards={};s.published=false;s.mode='scheduled';s.startedAt=null;s.endsAt=null;s.scheduledAt=at;s.durationMs=minutes*60000;s.remainingMs=s.durationMs;s.generation=(s.generation||0)+1;s.revision++;
 return s;
}
module.exports={EVENT,Fault,assert,initial,clock,counts,publicView,adminView,employeeId,keyFor,passwordHash,verifyPassword,control,settings,vote,reset};
