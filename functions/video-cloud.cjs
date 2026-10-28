'use strict';
const crypto=require('node:crypto');
function cloudFiles(bucket){return {
 putPart:(id,i,bytes)=>bucket.file(`video-uploads/${id}/${i}`).save(bytes,{resumable:false,metadata:{contentType:'application/octet-stream'}}),
 getPart:async(id,i)=>(await bucket.file(`video-uploads/${id}/${i}`).download())[0],
 publish:async(file,ext)=>{const name=`${ext==='mp4'?'videos':'photos'}/${crypto.randomUUID()}.${ext}`,token=crypto.randomUUID();await bucket.upload(file,{destination:name,resumable:false,metadata:{contentType:ext==='mp4'?'video/mp4':'image/jpeg',metadata:{firebaseStorageDownloadTokens:token}}});return `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(name)}?alt=media&token=${token}`;},
 cleanup:async(id,count)=>Promise.all(Array.from({length:count},(_,i)=>bucket.file(`video-uploads/${id}/${i}`).delete({ignoreNotFound:true})))
};}
module.exports={cloudFiles};
