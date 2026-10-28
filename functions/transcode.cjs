'use strict';
const {execFile}=require('node:child_process'),{promisify}=require('node:util');
const run=promisify(execFile);
async function transcode(input,output,poster){
 const probe=await run(require('ffprobe-static').path,['-v','error','-protocol_whitelist','file,pipe','-format_whitelist','mov,matroska,webm','-show_format','-show_streams','-of','json',input],{timeout:30000,maxBuffer:1024*1024});
 const info=JSON.parse(probe.stdout),video=info.streams.find(s=>s.codec_type==='video'),duration=Number(info.format.duration);
 if(!video||!Number.isFinite(duration)||duration<=0||duration>60.1||video.width>8192||video.height>8192)throw new Error('影片須在 60 秒以內，解析度不超過 8K');
 const ffmpeg=require('ffmpeg-static');
 await run(ffmpeg,['-nostdin','-y','-protocol_whitelist','file,pipe','-format_whitelist','mov,matroska,webm','-i',input,'-t','60','-map','0:v:0','-map','0:a:0?','-vf',"scale='min(1080,iw)':'min(1080,ih)':force_original_aspect_ratio=decrease:force_divisible_by=2,setsar=1",'-c:v','libx264','-preset','veryfast','-crf','24','-pix_fmt','yuv420p','-threads','2','-c:a','aac','-b:a','128k','-movflags','+faststart',output],{timeout:400000,maxBuffer:1024*1024});
 await run(ffmpeg,['-nostdin','-y','-ss',String(Math.min(.5,duration/2)),'-i',output,'-frames:v','1',poster],{timeout:30000,maxBuffer:1024*1024});
 return duration;
}
module.exports={transcode};
