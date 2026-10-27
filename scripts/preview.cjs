const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const allowed = new Set(['index.html','styles.css','app.js','magic.css','magic.js','haunted.js','painted.js','assets/slender-cat.png','painted.css','assets/castle-characters-v4.png','haunted.css','assets/lumens-castle-v3.png','assets/lumens-castle-v2.png','assets/lumens-logo-original.png']);
http.createServer((req,res)=>{const name = new URL(req.url,'http://localhost').pathname.slice(1)||'index.html';if(!allowed.has(name)){res.writeHead(404);return res.end('Not found')}res.writeHead(200,{'Content-Type':name.endsWith('.png')?'image/png':name.endsWith('.html')?'text/html; charset=utf-8':name.endsWith('.css')?'text/css; charset=utf-8':'text/javascript; charset=utf-8','Cache-Control':'no-store'});fs.createReadStream(path.join(root,name)).pipe(res)}).listen(4173,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:4173'));
