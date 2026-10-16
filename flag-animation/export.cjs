const {spawn}=require('node:child_process');
const {once}=require('node:events');
const fs=require('node:fs');
let pw;try{pw=require('playwright-core')}catch{pw=require('/opt/codex/runtimes/cua/lib/node_modules/playwright-core')}
(async()=>{
const browser=await pw.chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader']});
let ff;try{
const page=await browser.newPage({viewport:{width:1920,height:1080},deviceScaleFactor:1});
await page.goto('http://127.0.0.1:8765/?render');await page.waitForFunction(()=>window.flagScene?.ready);
await page.evaluate(()=>flagScene.pause());
ff=spawn('ffmpeg',['-y','-f','image2pipe','-vcodec','png','-framerate','30','-i','pipe:0','-an','-c:v','libx264','-crf','18','-preset','medium','-pix_fmt','yuv420p','-movflags','+faststart','flags-1080p.mp4'],{stdio:['pipe','ignore','pipe']});
let error='';ff.stderr.on('data',d=>error+=d);const done=once(ff,'close');
for(let n=0;n<150;n++){
const png=await page.evaluate(t=>{flagScene.renderAt(t);return document.querySelector('canvas').toDataURL('image/png').split(',')[1]},n/30);
if(!ff.stdin.write(Buffer.from(png,'base64')))await once(ff.stdin,'drain');
}
ff.stdin.end();const [code]=await done;if(code)throw Error(error);
console.log('Exported: 150 frames / 30 fps = 5 seconds, 1920x1080 H.264');
}finally{if(ff&&!ff.killed)ff.kill();await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
