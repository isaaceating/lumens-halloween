'use strict';
const crypto=require('node:crypto');
const C=require('./core.cjs');
const {importEmployees}=require('./employees.cjs');
function createApi({store,secret,passwordHash,savePhoto,videoService,now=Date.now}){
 const transact=fn=>store.transaction(fn);
 async function rate(ip,scope,limit){const t=now(),id=`limits/${C.keyFor(secret,scope,ip)}-${Math.floor(t/60000)}`;await transact(async tx=>{const v=await tx.get(id)||{n:0};C.assert(v.n<limit,'操作太頻繁，請稍後再試',429);tx.set(id,{n:v.n+1,expiresAt:t+120000});});}
 async function auth(token){C.assert(typeof token==='string'&&/^[a-f0-9]{64}$/.test(token),'請先登入',401);const session=await store.get(`sessions/${C.keyFor(secret,'session',token)}`);C.assert(session&&session.expiresAt>now(),'登入已過期，請重新登入',401);}
 return async function dispatch({method,path,body={},token='',ip='unknown'}){
  const t=now();
  if(path==='/event'&&method==='GET'){const s=await store.get(C.EVENT)||C.initial();return C.publicView(s,t);}
  if(path==='/employee'&&method==='POST'){await rate(ip,'lookup',300);const s=await store.get(C.EVENT)||C.initial();C.assert(C.clock(s,t).status!=='ended','投票已結束',409);const key=C.keyFor(secret,'employee',C.employeeId(body.employeeId));const profile=s.employeeProfiles?.[key];C.assert(s.employees.includes(key)&&profile,'查無此工號資料，請確認或洽主辦人',404);return {department:profile.department,name:profile.name};}
  if(path==='/login'&&method==='POST'){await rate(ip,'login',8);C.assert(C.verifyPassword(body.password,passwordHash),'密碼不正確',401);const session=crypto.randomBytes(32).toString('hex');await transact(async tx=>tx.set(`sessions/${C.keyFor(secret,'session',session)}`,{expiresAt:t+8*3600000}));return {token:session,expiresAt:t+8*3600000};}
  if(path==='/vote'&&method==='POST'){await rate(ip,'vote',120);await transact(async tx=>{const s=await tx.get(C.EVENT)||C.initial();tx.set(C.EVENT,C.vote(s,body,secret,now()));});return {accepted:true};}
  C.assert(path.startsWith('/admin/'),'找不到此功能',404);await auth(token);
  if(path==='/admin/logout'&&method==='POST'){await transact(async tx=>tx.set(`sessions/${C.keyFor(secret,'session',token)}`,{expiresAt:0}));return {ok:true};}
  if(path==='/admin/event'&&method==='GET')return C.adminView(await store.get(C.EVENT)||C.initial(),t);
  C.assert(method==='POST','不支援此方法',405);
  if(path.startsWith('/admin/video/')){C.assert(videoService,'影片服務尚未啟用',503);return videoService(path.slice('/admin/video/'.length),body);}
  if(path==='/admin/photo'){
   const bytes=Buffer.from(String(body.data||''),'base64');C.assert(bytes.length>0&&bytes.length<=3*1024*1024,'照片大小須小於 3 MB');
   const png=bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]));const jpeg=bytes[0]===255&&bytes[1]===216&&bytes[2]===255;
   C.assert(png||jpeg,'請使用 PNG 或 JPEG 圖片');return {url:await savePhoto(bytes,png?'png':'jpg')};
  }
  return transact(async tx=>{const s=await tx.get(C.EVENT)||C.initial();
   let importSummary;
   if(path==='/admin/employees')importSummary=importEmployees(s,body,secret,now());
   else {C.assert(body.revision===s.revision,'資料已更新，請重新整理後再操作',409);
    if(path==='/admin/control'){if(body.action==='publish'){C.assert(C.clock(s,t).status==='ended','投票結束後才能公布');s.mode='ended';s.published=true;s.revision++;}else C.control(s,body.action,t);}
    else if(path==='/admin/awards')require('./awards.cjs').update(s,body,C);
    else if(path==='/admin/settings')C.settings(s,body,t);
    else if(path==='/admin/reset')C.reset(s,body,now());
    else if(path==='/admin/candidate'){const c=s.candidates.find(c=>c.id===body.id);C.assert(c,'無此參賽者');for(const [field,max]of [['name',60],['costume',80],['description',500]]){C.assert(typeof body[field]==='string'&&body[field].length<=max,`${field} 長度不正確`);c[field]=body[field].trim();}C.assert(c.name&&c.costume,'姓名及造型名稱必填');const photos=body.photos===undefined?(body.photo?[body.photo]:[]):body.photos;C.assert(Array.isArray(photos)&&photos.length<=3,'每位參賽者最多 3 張照片');for(const photo of photos){C.assert(typeof photo==='string'&&photo.length>0&&(/^\/media\/[a-f0-9-]+\.(png|jpg)$/.test(photo)||/^https:\/\/firebasestorage\.googleapis\.com\/v0\/b\/lumens-halloween-2026\.firebasestorage\.app\/o\/photos%2F[a-f0-9-]+\.(png|jpg)\?alt=media&token=[a-f0-9-]+$/.test(photo)),'照片網址不正確');}let video=c.video||null;if(body.videoId!==undefined){if(body.videoId===null)video=null;else {C.assert(typeof body.videoId==='string'&&/^[a-f0-9-]{36}$/.test(body.videoId),'影片編號不正確');const job=await tx.get('media-jobs/'+body.videoId);C.assert(job?.status==='ready'&&job.candidateId===c.id,'影片尚未完成處理或不屬於此選手');video={...job.video};}}C.assert(!video||photos.length<=2,'有影片時最多 2 張照片，請先移除多餘照片');if(video&&body.videoPoster){C.assert(typeof body.videoPoster==='string'&&(/^\/media\/[a-f0-9-]+\.(png|jpg)$/.test(body.videoPoster)||/^https:\/\/firebasestorage\.googleapis\.com\/v0\/b\/lumens-halloween-2026\.firebasestorage\.app\/o\/photos%2F[a-f0-9-]+\.(png|jpg)\?alt=media&token=[a-f0-9-]+$/.test(body.videoPoster)),'預覽圖網址不正確');video.poster=body.videoPoster;}c.video=video;c.photos=[...new Set(photos)];c.photo=video?.poster||c.photos[0]||'';c.active=body.active===true;s.revision++;}
    else throw new C.Fault(404,'找不到此功能');
   }
   tx.set(C.EVENT,s);return {...C.adminView(s,now()),...(importSummary?{importSummary}:{})};
  });
 };
}
module.exports={createApi};
