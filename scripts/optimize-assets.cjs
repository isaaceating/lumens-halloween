// Rebuild approved Q90 runtime copies; never overwrite lossless archival assets.
const path=require('node:path'),fs=require('node:fs'),{spawnSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),ffmpeg=require('../functions/node_modules/ffmpeg-static'),config=require('./hero-quality.json');
for(const {file} of config.assets){const result=spawnSync(ffmpeg,['-hide_banner','-loglevel','error','-y','-i',path.join(root,'assets/lossless',file),'-c:v','libwebp','-lossless','0','-quality',String(config.quality),'-compression_level',String(config.compressionLevel),path.join(root,'assets',file)],{encoding:'utf8'});if(result.status!==0)throw Error(result.error?.message||result.stderr);console.log(file+': '+fs.statSync(path.join(root,'assets',file)).size+' bytes');}
