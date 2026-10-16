'use strict';
const canvas=document.querySelector('canvas'), status=document.querySelector('#status');
const gl=canvas.getContext('webgl',{alpha:false,antialias:false,preserveDrawingBuffer:true});
let ready=false,playing=true,clock=0,last=performance.now();
const vertex=`attribute vec2 p; varying vec2 uv; void main(){uv=(p+1.)*.5;gl_Position=vec4(p,0,1);}`;
// Masks follow the silhouettes of the supplied reference, expressed in normalized image coordinates.
// Their inner margin pins each silhouette: no sky pixels, text, or source highlights are animated.
const fragment=`precision highp float;
varying vec2 uv; uniform sampler2D image; uniform float time;
float seg(float x,float a,float b,float c,float d){return mix(b,d,clamp((x-a)/(c-a),0.,1.));}
float leftEdge(float x){
if(x<.10)return seg(x,0.,.154,.10,.264);
if(x<.23)return seg(x,.10,.264,.23,.401);
if(x<.36)return seg(x,.23,.401,.36,.503);
if(x<.47)return seg(x,.36,.503,.47,.559);
return seg(x,.47,.559,.535,.613);}
float rightEdge(float x){
if(x<.60)return seg(x,.53,.644,.60,.622);
if(x<.67)return seg(x,.60,.622,.67,.536);
if(x<.73)return seg(x,.67,.536,.73,.478);
if(x<.83)return seg(x,.73,.478,.83,.397);
return seg(x,.83,.397,1.,.244);}
void main(){
vec2 q=vec2(uv.x,1.-uv.y);float x=q.x,y=q.y;
float l=smoothstep(0.012,.045,y-leftEdge(x))*(1.-smoothstep(.515,.545,x));
float r=smoothstep(.014,.05,y-rightEdge(x))*smoothstep(.535,.565,x);
float m=clamp(l+r,0.,1.);float edge=smoothstep(0.,.07,min(x,1.-x));
float phase=6.28318530718*mod(time,5.)/5.;
float side=step(.545,x);float wind=mix(x,1.-x,side);float offset=side*1.7;
// All temporal frequencies are integer harmonics: value and velocity repeat at exactly 5 s.
float a=sin(phase-16.*wind+5.*y+offset);
float b=sin(2.*phase-31.*wind-8.*y+offset);
float c=sin(3.*phase-52.*wind+13.*y);
vec2 displacement=vec2(.0024*a+.0009*b,.006*a+.002*b+.0007*c)*m*edge;
// Use the original photographed light. No animated exposure, shading, or added light sources.
vec3 color=texture2D(image,clamp(q+displacement,vec2(.0001),vec2(.9999))).rgb;
gl_FragColor=vec4(color,1.);
}`;
function compile(type,source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;}
let program;
try{if(!gl)throw Error('WebGL недоступен');program=gl.createProgram();gl.attachShader(program,compile(gl.VERTEX_SHADER,vertex));gl.attachShader(program,compile(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));gl.useProgram(program);
const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);const pos=gl.getAttribLocation(program,'p');gl.enableVertexAttribArray(pos);gl.vertexAttribPointer(pos,2,gl.FLOAT,false,0,0);gl.viewport(0,0,1920,1080);
}catch(e){status.textContent=e.message;}
const timeUniform=gl&&program?gl.getUniformLocation(program,'time'):null;
function renderAt(t){if(!ready)return;gl.uniform1f(timeUniform,t%5);gl.drawArrays(gl.TRIANGLES,0,6);}
async function loadImage(src){const im=new Image();im.src=src;await im.decode();if(Math.abs(im.width/im.height-16/9)>.02)throw Error('Нужно исходное изображение 16:9');const tex=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,tex);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,im);ready=true;clock=0;document.querySelector('#empty').style.display='none';for(const id of ['play','seek','export'])document.getElementById(id).disabled=false;status.textContent='WebGL · Бесшовный цикл 5 с';renderAt(0);}
window.flagScene={loadImage,renderAt,pause(){playing=false},get ready(){return ready}};
function loop(now){if(playing&&ready)clock=(clock+(now-last)/1000)%5;last=now;renderAt(clock);document.querySelector('#seek').value=clock;requestAnimationFrame(loop)}requestAnimationFrame(loop);
document.querySelector('#play').onclick=e=>{playing=!playing;e.target.textContent=playing?'Пауза':'Воспроизвести'};
document.querySelector('#seek').oninput=e=>{playing=false;clock=+e.target.value;document.querySelector('#play').textContent='Воспроизвести';renderAt(clock)};
document.querySelector('#file').onchange=async e=>{const f=e.target.files[0];if(!f)return;const url=URL.createObjectURL(f);try{await loadImage(url);const res=await fetch('/api/source',{method:'POST',body:f});if(!res.ok)throw Error('Изображение открыто. Для MP4 запустите server.py.');}catch(err){status.textContent=err.message}finally{URL.revokeObjectURL(url)}};
document.querySelector('#export').onclick=async()=>{const button=document.querySelector('#export');button.disabled=true;status.textContent='Рендеринг 150 кадров…';try{const res=await fetch('/api/export',{method:'POST'});if(!res.ok)throw Error(await res.text());let job;do{await new Promise(r=>setTimeout(r,1000));job=await(await fetch('/api/status')).json();status.textContent=job.message;}while(job.state==='running');if(job.state!=='done')throw Error(job.message);const a=document.createElement('a');a.href='flags-1080p.mp4';a.download='flags-1080p.mp4';a.click();}catch(e){status.textContent=e.message}finally{button.disabled=false}};
if(new URLSearchParams(location.search).has('render')){document.body.classList.add('render');playing=false;}
fetch('/api/has-source').then(r=>r.json()).then(x=>{if(x.exists)return loadImage('/source-image')}).catch(()=>{});
