'use strict';
const crypto=require('node:crypto'),fs=require('node:fs/promises'),os=require('node:os'),path=require('node:path'),C=require('./core.cjs');
const CHUNK=2*1024*1024,MAX=200*1024*1024;
function createVideoService({store,files,convert=require('./transcode.cjs').transcode,now=Date.now}){
 return async function video(action,b){
  if(action==='init'){const s=await store.get(C.EVENT)||C.initial();C.assert(C.clock(s,now()).status==='scheduled','影片僅能於活動開始前上傳');C.assert(s.candidates.some(c=>c.id===b.candidateId),'無此參賽者');C.assert(Number.isInteger(b.size)&&b.size>0&&b.size<=MAX,'影片須小於 200 MB');const id=crypto.randomUUID();await store.transaction(async tx=>tx.set('media-jobs/'+id,{candidateId:b.candidateId,size:b.size,parts:{},status:'uploading',expiresAt:now()+86400000}));return {id,chunkSize:CHUNK};}
  C.assert(typeof b.id==='string'&&/^[a-f0-9-]{36}$/.test(b.id),'影片編號不正確');const key='media-jobs/'+b.id,job=await store.get(key);C.assert(job,'找不到影片',404);
  if(action==='status')return {status:job.status,video:job.video||null,error:job.error||''};
  C.assert(job.expiresAt>now(),'上傳已過期，請重新選擇影片',409);
  if(action==='chunk'){C.assert(job.status==='uploading','影片已進入處理階段',409);const count=Math.ceil(job.size/CHUNK);C.assert(Number.isInteger(b.index)&&b.index>=0&&b.index<count,'片段編號不正確');const bytes=Buffer.from(String(b.data||''),'base64');C.assert(bytes.length===Math.min(CHUNK,job.size-b.index*CHUNK),'影片片段大小不符');await files.putPart(b.id,b.index,bytes);await store.transaction(async tx=>{const current=await tx.get(key);C.assert(current.status==='uploading','影片已進入處理階段',409);current.parts[b.index]=bytes.length;tx.set(key,current);});return {ok:true};}
  C.assert(action==='finalize','找不到影片操作',404);if(job.status==='ready')return {status:'ready',video:job.video};
  await store.transaction(async tx=>{const current=await tx.get(key);C.assert(current.status==='uploading'||current.status==='failed','影片正在轉檔，請稍候',409);C.assert(Object.keys(current.parts).length===Math.ceil(current.size/CHUNK),'影片尚未完整上傳');current.status='processing';tx.set(key,current);});
  const dir=await fs.mkdtemp(path.join(os.tmpdir(),'lumens-video-'));
  try {const input=path.join(dir,'source'),output=path.join(dir,'output.mp4'),poster=path.join(dir,'poster.jpg'),handle=await fs.open(input,'w');try{for(let i=0;i<Math.ceil(job.size/CHUNK);i++)await handle.write(await files.getPart(b.id,i));}finally{await handle.close();}
   const duration=await convert(input,output,poster),url=await files.publish(output,'mp4'),posterUrl=await files.publish(poster,'jpg'),video={id:b.id,url,poster:posterUrl,duration};await store.transaction(async tx=>{const current=await tx.get(key);current.status='ready';current.video=video;tx.set(key,current);});await files.cleanup(b.id,Math.ceil(job.size/CHUNK)).catch(()=>{});return {status:'ready',video};
  }catch(e){await store.transaction(async tx=>{const current=await tx.get(key);current.status='failed';current.error='影片轉檔失敗，請確認影片不超過 60 秒且可正常播放，再重新上傳。';tx.set(key,current);});throw new C.Fault(400,'影片轉檔失敗，請確認影片不超過 60 秒且可正常播放，再重新上傳。');}finally{await fs.rm(dir,{recursive:true,force:true});}
 };
}
module.exports={createVideoService,CHUNK,MAX};
