'use strict';
const fs=require('node:fs');
class LocalStore{
 constructor(file,seed={}){this.file=file;this.data=file&&fs.existsSync(file)?JSON.parse(fs.readFileSync(file,'utf8')):structuredClone(seed);this.queue=Promise.resolve();}
 async get(key){await this.queue;return structuredClone(this.data[key]);}
 transaction(fn){const job=this.queue.then(async()=>{const copy=structuredClone(this.data);const result=await fn({get:async k=>structuredClone(copy[k]),set:(k,v)=>{copy[k]=structuredClone(v);}});if(this.file){fs.writeFileSync(this.file+'.tmp',JSON.stringify(copy));fs.renameSync(this.file+'.tmp',this.file);}this.data=copy;return result;});this.queue=job.catch(()=>{});return job;}
}
module.exports={LocalStore};
