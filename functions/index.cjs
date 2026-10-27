'use strict';
const {onRequest}=require('firebase-functions/v2/https');
const {defineSecret}=require('firebase-functions/params');
const {initializeApp}=require('firebase-admin/app');
const {getFirestore}=require('firebase-admin/firestore');
const {getStorage}=require('firebase-admin/storage');
const crypto=require('node:crypto');
const {createApi}=require('./api.cjs');
initializeApp();
const adminHash=defineSecret('ADMIN_PASSWORD_HASH'),appSecret=defineSecret('APP_SECRET');
const origins=new Set(['https://isaaceating.github.io']);
exports.api=onRequest({region:'asia-east1',maxInstances:3,timeoutSeconds:30,memory:'256MiB',secrets:[adminHash,appSecret]},async(req,res)=>{
 const origin=req.headers.origin;if(origin&&!origins.has(origin))return res.status(403).json({error:'來源不允許'});
 if(origin)res.set('Access-Control-Allow-Origin',origin);res.set('Vary','Origin');res.set('Cache-Control','no-store');res.set('X-Content-Type-Options','nosniff');
 if(req.method==='OPTIONS'){res.set('Access-Control-Allow-Methods','GET, POST, OPTIONS');res.set('Access-Control-Allow-Headers','Content-Type, Authorization');return res.status(204).end();}
 const db=getFirestore();const store={get:async p=>(await db.doc(p).get()).data(),transaction:fn=>db.runTransaction(tx=>fn({get:async p=>(await tx.get(db.doc(p))).data(),set:(p,v)=>tx.set(db.doc(p),v)}))};
 const api=createApi({store,secret:appSecret.value(),passwordHash:adminHash.value(),savePhoto:async(bytes,ext)=>{const bucket=getStorage().bucket('lumens-halloween-2026.firebasestorage.app'),name=`photos/${crypto.randomUUID()}.${ext}`,token=crypto.randomUUID();await bucket.file(name).save(bytes,{metadata:{contentType:ext==='png'?'image/png':'image/jpeg',metadata:{firebaseStorageDownloadTokens:token}},resumable:false});return `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(name)}?alt=media&token=${token}`;}});
 try{res.json(await api({method:req.method,path:req.path.replace(/\/$/,'')||'/',body:req.body||{},token:(req.headers.authorization||'').replace(/^Bearer /,''),ip:req.ip||'unknown'}));}catch(e){if(!e.status)console.error('API failure',e.code||e.name);res.status(e.status||500).json({error:e.status?e.message:'服務暫時無法使用，請稍後再試'});}
});
