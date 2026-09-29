import * as T from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { clockAngles } from './clock.js';
import { createMovement } from './movement.js';
import '@fontsource/cormorant-garamond/500-italic.css';
import '@fontsource/space-grotesk/400.css';
import '@fontsource/space-grotesk/500.css';
import { mountNewYork } from './city.js';
import './style.css';

const canvas=document.querySelector('#watch'), loading=document.querySelector('#loading');
function updateReadout(date){document.querySelector('#digital').textContent=date.toLocaleTimeString([], {hour12:false});document.querySelector('#zone').textContent=Intl.DateTimeFormat().resolvedOptions().timeZone.replaceAll('_',' ');}
const isNewYork = Intl.DateTimeFormat().resolvedOptions().timeZone === 'America/New_York';
document.querySelector('#city-miniature').hidden = !isNewYork;
if (isNewYork) { try { mountNewYork(document.querySelector('#city')); } catch (error) { document.querySelector('#city').hidden = true; console.warn('City miniature unavailable', error); } }
updateReadout(new Date());setInterval(()=>updateReadout(new Date()),1000);
try { init(); } catch(error){console.error(error);loading.textContent='The 3D view could not start. Please enable hardware acceleration or try a browser with WebGL support. Your local time is still shown.';}
function init(){
const renderer=new T.WebGLRenderer({canvas,antialias:true,alpha:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=.95;
const scene=new T.Scene(),camera=new T.PerspectiveCamera(34,1,.1,100);camera.position.set(0,-2.4,16.5);
const pmrem=new T.PMREMGenerator(renderer);const room=new RoomEnvironment();scene.environment=pmrem.fromScene(room,.04).texture;room.dispose();pmrem.dispose();
scene.add(new T.HemisphereLight(0xe0f2ff,0x222c2a,.8));const key=new T.DirectionalLight(0xffeed0,2);key.position.set(-3,5,9);scene.add(key);const fill=new T.DirectionalLight(0x8cc5e4,1);fill.position.set(5,-1,3);scene.add(fill);
const controls=new OrbitControls(camera,canvas);controls.enableDamping=true;controls.enablePan=false;controls.minDistance=8;controls.maxDistance=23;controls.autoRotateSpeed=.55;controls.target.set(0,0,0);
const model=new T.Group();scene.add(model);model.rotation.z=-.22;
const steel=new T.MeshStandardMaterial({color:0xb8c7cb,metalness:1,roughness:.23});const brushed=new T.MeshStandardMaterial({color:0x76858b,metalness:.95,roughness:.4});const brass=new T.MeshStandardMaterial({color:0xc49b4e,metalness:.88,roughness:.26});const dark=new T.MeshStandardMaterial({color:0x141f23,metalness:.75,roughness:.35});const ruby=new T.MeshStandardMaterial({color:0x6d1539,metalness:.25,roughness:.2});const lume=new T.MeshStandardMaterial({color:0xe4e4cb,roughness:.35,metalness:.15});const blue=new T.MeshStandardMaterial({color:0x296077,metalness:.85,roughness:.21});
function mesh(geo,mat,parent,x=0,y=0,z=0){const m=new T.Mesh(geo,mat);m.position.set(x,y,z);parent.add(m);return m;}
function disk(r,h,mat,parent,x=0,y=0,z=0){let m=mesh(new T.CylinderGeometry(r,r,h,80),mat,parent,x,y,z);m.rotation.x=Math.PI/2;return m;}
function ring(r,w,h,mat,parent,x=0,y=0,z=0){const s=new T.Shape();s.absarc(0,0,r,0,Math.PI*2,false);const hole=new T.Path();hole.absarc(0,0,r-w,0,Math.PI*2,true);s.holes.push(hole);return mesh(new T.ExtrudeGeometry(s,{depth:h,bevelEnabled:true,bevelSize:.025,bevelThickness:.025,bevelSegments:2,curveSegments:96}),mat,parent,x,y,z-h/2);}
function box(w,h,d,mat,parent,x,y,z,rad=.06){return mesh(new RoundedBoxGeometry(w,h,d,3,rad),mat,parent,x,y,z);}
function screw(x,y,z,parent=model){disk(.082,.055,steel,parent,x,y,z);box(.11,.016,.008,dark,parent,x,y,z+.03,.004);}
// Leather grain is procedural, with individually modeled edge stitches and strap holes.
const leatherCanvas=document.createElement('canvas');leatherCanvas.width=leatherCanvas.height=256;const lc=leatherCanvas.getContext('2d');lc.fillStyle='#242728';lc.fillRect(0,0,256,256);let seed=7;for(let i=0;i<18000;i++){seed=(seed*16807)%2147483647;const x=seed%256;seed=(seed*16807)%2147483647;const y=seed%256;lc.fillStyle=i%2?'#343737':'#161b1c';lc.fillRect(x,y,1,2);}const texture=new T.CanvasTexture(leatherCanvas);texture.wrapS=texture.wrapT=T.RepeatWrapping;texture.repeat.set(2,4);const leather=new T.MeshStandardMaterial({map:texture,bumpMap:texture,bumpScale:.022,roughness:.86,color:0x303631});const thread=new T.MeshStandardMaterial({color:0x7b796a,roughness:1});
for(const sign of [-1,1]){const strap=box(1.7,3.1,.22,leather,model,0,sign*3.3,-.15,.15);for(let j=0;j<21;j++)for(const x of [-.71,.71])box(.025,.076,.022,thread,model,x,sign*(2.02+j*.13),-.025,.01);for(const x of [-.95,.95]){const lug=box(.32,.85,.55,steel,model,x,sign*2.05,.05,.14);lug.rotation.z=-sign*Math.sign(x)*.13;}if(sign===-1)for(let j=0;j<5;j++){disk(.057,.024,dark,model,0,-3.15-j*.3,-.022);}else{ring(.15,.06,.12,steel,model,0,4.7,-.05);}}
box(1.82,.18,.28,steel,model,0,4.73,-.11);for(const x of [-.86,.86])box(.13,.7,.28,steel,model,x,4.45,-.1);box(.1,.65,.12,steel,model,0,4.46,.07);
// Case, exhibition back and concentric bezel. Z faces the viewer.
ring(2.06,.18,.61,brushed,model,0,0,0);ring(2.12,.12,.14,steel,model,0,0,.29);ring(2.02,.07,.08,brass,model,0,0,.38);ring(2.09,.13,.12,steel,model,0,0,-.32);ring(1.91,.14,.07,brushed,model,0,0,-.31);
const crown=disk(.28,.38,steel,model,2.18,0,.02);crown.rotation.z=Math.PI/2;for(let i=0;i<36;i++){const a=i*Math.PI*2/36;const rib=box(.38,.025,.028,brushed,model,2.2,Math.cos(a)*.28,Math.sin(a)*.28+.02,.01);}disk(.1,.08,brass,model,2.4,0,.03).rotation.y=Math.PI/2;
const dialStart=model.children.length;
ring(1.91,.23,.07,dark,model,0,0,.43);
for(let i=0;i<60;i++){const a=i*Math.PI/30;const major=i%5===0;const mark=box(major?.065:.022,major?.22:.085,.035,major?lume:brass,model,Math.sin(a)*1.79,Math.cos(a)*1.79,.485,.009);mark.rotation.z=-a;}
// Ring numerals are textures on small transparent planes, retaining depth and crispness.
for(const [text,a] of [['12',0],['3',Math.PI/2],['6',Math.PI],['9',Math.PI*1.5]]){const c=document.createElement('canvas');c.width=c.height=128;const ctx=c.getContext('2d');ctx.font='italic 500 66px Georgia';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#ddd9c8';ctx.fillText(text,64,68);const mat=new T.MeshBasicMaterial({map:new T.CanvasTexture(c),transparent:true,depthWrite:false});mesh(new T.PlaneGeometry(.33,.33),mat,model,Math.sin(a)*1.47,Math.cos(a)*1.47,.49);}
const dialParts=model.children.slice(dialStart);
const movement=createMovement();model.add(movement.root);
const handsStart=model.children.length;
function hand(length,width,z,mat){const g=new T.Group();g.position.z=z;model.add(g);const s=new T.Shape();s.moveTo(-width*.55,-.25);s.lineTo(-width, .25);s.lineTo(-width*.45,length*.82);s.lineTo(0,length);s.lineTo(width*.45,length*.82);s.lineTo(width,.25);s.lineTo(width*.55,-.25);s.closePath();mesh(new T.ExtrudeGeometry(s,{depth:.035,bevelEnabled:true,bevelSize:.012,bevelThickness:.01,bevelSegments:2}),mat,g);box(width*.45,length*.56,.02,lume,g,0,length*.46,.048,.007);return g;}
const hour=hand(1.06,.09,.56,steel),minute=hand(1.49,.061,.65,steel);const second=new T.Group();second.position.z=.76;model.add(second);box(.024,2.05,.025,brass,second,0,.51,0,.007);ring(.11,.022,.025,brass,second,0,-.37,0);disk(.12,.10,blue,model,0,0,.77);disk(.043,.11,brass,model,0,0,.79);
// Sapphire edge catches the light; the open center keeps the movement clearly visible.
ring(1.925,.025,.04,new T.MeshPhysicalMaterial({color:0xb9e1ef,transparent:true,opacity:.3,metalness:0,roughness:.03}),model,0,0,.84);
const liftedParts=[...dialParts,...model.children.slice(handsStart)].map(part=>({part,z:part.position.z}));
let opening=0;const openingSlider=document.querySelector('#opening');
openingSlider.addEventListener('input',()=>{opening=Number(openingSlider.value)/100;document.querySelector('#opening-value').textContent=Math.round(opening*100)+'%';});
let slow=false,mechanismTime=Date.now()/1000,lastFrame=null;
const slowButton=document.querySelector('#slow');slowButton.onclick=()=>{slow=!slow;slowButton.setAttribute('aria-pressed',String(slow));};
let rear=false;const frontBtn=document.querySelector('#front'),backBtn=document.querySelector('#back'),rotateBtn=document.querySelector('#rotate');
function view(back){rear=back;camera.position.set(0,-2.4,back?-16.5:16.5);camera.up.set(0,1,0);controls.target.set(0,0,0);controls.update();frontBtn.setAttribute('aria-pressed',String(!back));backBtn.setAttribute('aria-pressed',String(back));document.querySelector('#view-name').textContent=back?'02 / EXHIBITION BACK':'01 / SKELETON DIAL';}
frontBtn.onclick=()=>view(false);backBtn.onclick=()=>view(true);rotateBtn.onclick=()=>{controls.autoRotate=!controls.autoRotate;rotateBtn.setAttribute('aria-pressed',String(controls.autoRotate));};document.querySelector('#reset').onclick=()=>{controls.autoRotate=false;rotateBtn.setAttribute('aria-pressed','false');opening=0;openingSlider.value='0';document.querySelector('#opening-value').textContent='0%';slow=false;slowButton.setAttribute('aria-pressed','false');view(false);};
canvas.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','=','-'].includes(e.key)){e.preventDefault();const p=camera.position;if(e.key==='+'||e.key==='=')p.multiplyScalar(.9);else if(e.key==='-')p.multiplyScalar(1.1);else {const axis=(e.key==='ArrowUp'||e.key==='ArrowDown')?new T.Vector3(1,0,0):new T.Vector3(0,1,0);p.applyAxisAngle(axis,(e.key==='ArrowLeft'||e.key==='ArrowUp')?.12:-.12);}p.setLength(T.MathUtils.clamp(p.length(),8,23));controls.update();}});
const observer=new ResizeObserver(()=>{const w=canvas.clientWidth,h=canvas.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.fov=w/h<.65?43:38;camera.updateProjectionMatrix();});observer.observe(canvas);
let last=0;const reduced=matchMedia('(prefers-reduced-motion: reduce)');
function render(ms){requestAnimationFrame(render);if(document.hidden)return;if(reduced.matches&&ms-last<100)return;last=ms;const date=new Date(),a=clockAngles(date);hour.rotation.z=a.hour;minute.rotation.z=a.minute;second.rotation.z=a.second;const dt=lastFrame===null?0:Math.min((ms-lastFrame)/1000,.15);lastFrame=ms;mechanismTime=slow?mechanismTime+dt*.08:date.getTime()/1000;movement.update(mechanismTime,opening);for(const {part,z} of liftedParts)part.position.z=z+opening*1.85;controls.update();renderer.render(scene,camera);canvas.dataset.ready='true';loading.hidden=true;}
canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();loading.hidden=false;loading.textContent='The 3D view was interrupted. Reload this page to restore it.';});requestAnimationFrame(render);
}
