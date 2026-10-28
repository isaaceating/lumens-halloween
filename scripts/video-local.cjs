'use strict';
const fs=require('node:fs/promises'),path=require('node:path'),crypto=require('node:crypto');
function localFiles(dir){return {
 putPart:async(id,i,bytes)=>{await fs.mkdir(path.join(dir,'uploads'),{recursive:true});await fs.writeFile(path.join(dir,'uploads',`${id}-${i}`),bytes);},
 getPart:(id,i)=>fs.readFile(path.join(dir,'uploads',`${id}-${i}`)),
 publish:async(file,ext)=>{const name=crypto.randomUUID()+'.'+ext;await fs.copyFile(file,path.join(dir,'media',name));return '/media/'+name;},
 cleanup:async(id,count)=>Promise.all(Array.from({length:count},(_,i)=>fs.unlink(path.join(dir,'uploads',`${id}-${i}`))))
};}
module.exports={localFiles};
