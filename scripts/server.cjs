'use strict';
const http=require('node:http'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {LocalStore}=require('./store.cjs'),{createApi}=require('../functions/api.cjs'),C=require('../functions/core.cjs');
const root=path.resolve(__dirname,'..'),privateDir=path.resolve(process.env.LUMENS_DATA_DIR||path.join(root,'private')),port=Number(process.env.LUMENS_PORT||4173);fs.mkdirSync(path.join(privateDir,'media'),{recursive:true});
const configPath=path.join(privateDir,'config.json');if(!fs.existsSync(configPath))throw new Error('Run npm run setup-local first.');
const config=JSON.parse(fs.readFileSync(configPath,'utf8')),state=C.initial(),importPath=path.join(privateDir,'employee-import.json');
if(fs.existsSync(importPath))state.employees=[...new Set(JSON.parse(fs.readFileSync(importPath,'utf8')).map(x=>C.keyFor(config.secret,'employee',C.employeeId(x))))];
const store=new LocalStore(path.join(privateDir,'state.json'),{[C.EVENT]:state});
const api=createApi({store,videoService:require('../functions/video.cjs').createVideoService({store,files:require('./video-local.cjs').localFiles(privateDir)}),secret:config.secret,passwordHash:config.passwordHash,savePhoto:async(bytes,ext)=>{const name=`${crypto.randomUUID()}.${ext}`;fs.writeFileSync(path.join(privateDir,'media',name),bytes);return `/media/${name}`;}});
const staticFiles=new Set(['music-credits.html','sound.js','network.js','hero-manifest.js','hero-assets.js','motion.js','hero.css','hero.js','awakening.js','index.html','admin.html','styles.css','magic.css','haunted.css','painted.css','live.css','admin.css','app.js','magic.js','haunted.js','painted.js','site-config.js','live.js','admin.js']);
const assetNames=new Set(fs.readdirSync(path.join(root,'assets')).filter(x=>/^[a-z0-9-]+\.(png|webp|mp3)$/.test(x)));
http.createServer(async(req,res)=>{
 res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Cache-Control','no-store');
 const pathname=new URL(req.url,'http://127.0.0.1').pathname;
 if(pathname.startsWith('/api/')){
  const origin=req.headers.origin;if(origin&&!['http://127.0.0.1:'+port,'http://localhost:'+port].includes(origin)){res.writeHead(403);return res.end();}
  try{let chunks=[],size=0;for await(const chunk of req){size+=chunk.length;if(size>4500000)throw new C.Fault(413,'上傳資料過大');chunks.push(chunk);}const body=size?JSON.parse(Buffer.concat(chunks).toString()):{};const result=await api({method:req.method,path:pathname.slice(4),body,token:(req.headers.authorization||'').replace(/^Bearer /,''),ip:req.socket.remoteAddress});res.setHeader('Content-Type','application/json; charset=utf-8');res.end(JSON.stringify(result));}catch(e){res.writeHead(e.status||500,{'Content-Type':'application/json; charset=utf-8'});res.end(JSON.stringify({error:e.status?e.message:'服務發生錯誤，請稍後再試'}));}return;
 }
 const name=pathname.slice(1)||'index.html';let file;
 if(staticFiles.has(name))file=path.join(root,name);
 else if(name.startsWith('assets/')&&assetNames.has(name.slice(7)))file=path.join(root,name);
 else if(/^media\/[a-f0-9-]+\.(png|jpg|mp4)$/.test(name))file=path.join(privateDir,name);
 if(!file||!fs.existsSync(file)){res.writeHead(404);return res.end('Not found');}
 const ext=path.extname(file),types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.mp3':'audio/mpeg','.mp4':'video/mp4'};res.setHeader('Content-Type',types[ext]||'application/octet-stream');const size=fs.statSync(file).size;res.setHeader('Accept-Ranges','bytes');const range=req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);if(range){const start=Number(range[1]),end=Math.min(Number(range[2]||size-1),size-1);if(start>end||start>=size){res.writeHead(416,{'Content-Range':'bytes */'+size});return res.end();}res.writeHead(206,{'Content-Range':`bytes ${start}-${end}/${size}`,'Content-Length':end-start+1});fs.createReadStream(file,{start,end}).pipe(res);}else{res.setHeader('Content-Length',size);fs.createReadStream(file).pipe(res);}
}).listen(port,'127.0.0.1',()=>console.log('Local app: http://127.0.0.1:'+port+' | Admin: /admin.html'));
