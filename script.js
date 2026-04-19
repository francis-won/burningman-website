/* ══════════════════════════════════════
   VID-CARD-INNER 자동 래핑
══════════════════════════════════════ */
document.querySelectorAll('.vid-card').forEach(card => {
  const thumb = card.querySelector('.vid-thumb');
  const overlay = card.querySelector('.vid-overlay');
  if (thumb && overlay) {
    const inner = document.createElement('div');
    inner.className = 'vid-card-inner';
    card.insertBefore(inner, thumb);
    inner.appendChild(thumb);
    inner.appendChild(overlay);
  }
});

/* ══════════════════════════════════════
   THREE.JS BG
══════════════════════════════════════ */
(function(){
  const canvas=document.getElementById('bg-canvas');
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  renderer.setSize(innerWidth,innerHeight);
  renderer.setClearColor(0x000000,0);
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(55,innerWidth/innerHeight,.1,1000);
  camera.position.z=5;
  const N=3500,pos=new Float32Array(N*3),col=new Float32Array(N*3);
  const cA=new THREE.Color(0xff3d00),cB=new THREE.Color(0xff8c00),cC=new THREE.Color(0xffffff);
  for(let i=0;i<N;i++){
    const i3=i*3;
    pos[i3]=(Math.random()-.5)*22;
    pos[i3+1]=(Math.random()-.5)*22;
    pos[i3+2]=(Math.random()-.5)*12;
    const r=Math.random(),c=r<.55?cA:r<.75?cB:cC;
    col[i3]=c.r;col[i3+1]=c.g;col[i3+2]=c.b;
  }
  const geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
  geo.setAttribute('color',new THREE.BufferAttribute(col,3));
  const pts=new THREE.Points(geo,new THREE.PointsMaterial({
    size:.038,vertexColors:true,transparent:true,opacity:.65,
    sizeAttenuation:true,blending:THREE.AdditiveBlending,depthWrite:false
  }));
  scene.add(pts);
  function addRing(r,tube,color,opacity,rx,ry){
    const m=new THREE.Mesh(
      new THREE.TorusGeometry(r,tube,2,140),
      new THREE.MeshBasicMaterial({color,transparent:true,opacity,
        blending:THREE.AdditiveBlending,depthWrite:false})
    );
    m.rotation.x=rx;m.rotation.y=ry;scene.add(m);return m;
  }
  const r1=addRing(3.2,.007,0xff3d00,.18,Math.PI/3,0);
  const r2=addRing(5,.005,0xff8c00,.08,-Math.PI/4,Math.PI/5);
  const r3=addRing(1.8,.009,0xffcc00,.1,Math.PI/2,.3);
  let mx=0,my=0,sy=0;
  document.addEventListener('mousemove',e=>{
    mx=(e.clientX/innerWidth-.5)*2;
    my=-(e.clientY/innerHeight-.5)*2;
  });
  window.addEventListener('scroll',()=>{sy=scrollY;},{passive:true});
  const clock=new THREE.Clock();
  (function tick(){
    requestAnimationFrame(tick);
    const t=clock.getElapsedTime();
    pts.rotation.y=t*.025+mx*.08;
    pts.rotation.x=my*.04+sy*.00025;
    r1.rotation.z=t*.04;r1.rotation.y=mx*.15;
    r2.rotation.z=-t*.025;r2.rotation.x=-Math.PI/4+my*.08;
    r3.rotation.z=t*.07;
    camera.position.x+=(mx*.4-camera.position.x)*.05;
    camera.position.y+=(my*.25-camera.position.y)*.05;
    camera.position.z=5-sy*.0008;
    renderer.render(scene,camera);
  })();
  window.addEventListener('resize',()=>{
    camera.aspect=innerWidth/innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth,innerHeight);
  });
})();

/* ══════════════════════════════════════
   CURSOR
══════════════════════════════════════ */
const cur=document.getElementById('cursor');
const curR=document.getElementById('cursor-ring');
let cx=0,cy=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{
  cx=e.clientX;cy=e.clientY;
  cur.style.left=cx+'px';cur.style.top=cy+'px';
});
(function animCur(){
  rx+=(cx-rx)*.11;ry+=(cy-ry)*.11;
  curR.style.left=rx+'px';curR.style.top=ry+'px';
  requestAnimationFrame(animCur);
})();
const aiSec=document.getElementById('ai-reel');
window.addEventListener('scroll',()=>{
  const rect=aiSec.getBoundingClientRect();
  const inAI=rect.top<innerHeight&&rect.bottom>0;
  cur.classList.toggle('ai-mode',inAI);
  curR.classList.toggle('ai-mode',inAI);
},{passive:true});
document.querySelectorAll('a,button,.svc-item,.vid-card').forEach(el=>{
  el.addEventListener('mouseenter',()=>{
    cur.style.width='18px';cur.style.height='18px';
    curR.style.width='56px';curR.style.height='56px';
  });
  el.addEventListener('mouseleave',()=>{
    cur.style.width='10px';cur.style.height='10px';
    curR.style.width='36px';curR.style.height='36px';
  });
});

/* ══════════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════════ */
const obs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('on');});
},{threshold:.08,rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));

/* ══════════════════════════════════════
   CONTACT FORM
══════════════════════════════════════ */
function handleForm(e){
  e.preventDefault();
  const btn=e.target.querySelector('.form-btn');
  btn.textContent='Sent ✓';btn.style.background='#1a7a1a';
  setTimeout(()=>{
    btn.textContent='Send Message';btn.style.background='';e.target.reset();
  },3000);
}
