// Rebuild exact-size lossless runtime assets; original illustrations remain the source.
const fs=require('node:fs'),path=require('node:path'),{spawnSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),ffmpeg=require('../functions/node_modules/ffmpeg-static');
for(const asset of require('./visual-assets.json')){
 const result=spawnSync(ffmpeg,['-hide_banner','-loglevel','error','-y','-i',path.join(root,'assets',asset.source),...(asset.crop?['-vf','crop='+asset.crop.join(':')+':exact=1']:[]),'-c:v','libwebp','-lossless','1','-compression_level','6',path.join(root,'assets',asset.output)],{encoding:'utf8'});
 if(result.status!==0)throw new Error(result.error?.message||result.stderr);
 console.log(asset.output+': '+fs.statSync(path.join(root,'assets',asset.output)).size+' bytes');
}
