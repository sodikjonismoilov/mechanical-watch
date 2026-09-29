import * as T from 'three';
import { train, movementState, springPoint } from './mechanics.js';

export function createMovement() {
  const root=new T.Group();root.name='Connected mechanical movement';
  const gold=new T.MeshStandardMaterial({color:0xc6a054,metalness:.88,roughness:.3});
  const silver=new T.MeshStandardMaterial({color:0x83999e,metalness:.85,roughness:.4});
  const dark=new T.MeshStandardMaterial({color:0x1b2d32,metalness:.6,roughness:.48});
  const blue=new T.MeshStandardMaterial({color:0x4779a1,metalness:.85,roughness:.27});
  const jewel=new T.MeshPhysicalMaterial({color:0x9f1645,metalness:.15,roughness:.18,clearcoat:1});
  function mesh(geometry,material,parent,x=0,y=0,z=0){const m=new T.Mesh(geometry,material);m.position.set(x,y,z);parent.add(m);return m;}
  function cylinder(r,h,material,parent,x,y,z){const m=mesh(new T.CylinderGeometry(r,r,h,40),material,parent,x,y,z);m.rotation.x=Math.PI/2;return m;}
  function extrude(shape,h,material,parent,z=0){return mesh(new T.ExtrudeGeometry(shape,{depth:h,bevelEnabled:true,bevelSize:.004,bevelThickness:.004,bevelSegments:2,curveSegments:48}),material,parent,0,0,z);}
  function annulus(r,inner,h,material,parent,x=0,y=0,z=0){const s=new T.Shape();s.absarc(0,0,r,0,Math.PI*2);const p=new T.Path();p.absarc(0,0,inner,0,Math.PI*2,true);s.holes.push(p);const m=extrude(s,h,material,parent,z);m.position.x=x;m.position.y=y;return m;}
  function bar(a,b,width,depth,material,parent,z){const dx=b[0]-a[0],dy=b[1]-a[1];const m=mesh(new T.BoxGeometry(width,Math.hypot(dx,dy),depth),material,parent,(a[0]+b[0])/2,(a[1]+b[1])/2,z);m.rotation.z=-Math.atan2(dx,dy);return m;}
  function bearing(x,y,z,parent){annulus(.082,.032,.022,silver,parent,x,y,z);annulus(.05,.017,.029,jewel,parent,x,y,z+.012);cylinder(.016,.045,blue,parent,x,y,z+.03);}
  function screw(x,y,z,parent){cylinder(.065,.034,blue,parent,x,y,z);bar([x-.046,y],[x+.046,y],.012,.008,dark,parent,z+.019);}
  function wheel(teeth,parent,z,pinion=false,escape=false){const r=teeth*.006,add=.009,shape=new T.Shape();
    for(let i=0;i<teeth;i++)for(let j=0;j<6;j++){
      const offsets=escape?[0,.16,.23,.36,.74,1]:[0,.18,.32,.68,.82,1];
      const radii=escape?[r-add,r-add,r+add*1.7,r+add*1.7,r-add,r-add]:[r-add,r-add,r+add,r+add,r-add,r-add];
      const a=(i+offsets[j])*Math.PI*2/teeth,x=Math.cos(a)*radii[j],y=Math.sin(a)*radii[j];
      i===0&&j===0?shape.moveTo(x,y):shape.lineTo(x,y);
    }shape.closePath();
    if(!pinion){const hole=new T.Path();hole.absarc(0,0,r*.72,0,Math.PI*2,true);shape.holes.push(hole);}
    extrude(shape,.035,pinion?silver:gold,parent,z);
    if(!pinion){cylinder(r*.18,.045,gold,parent,0,0,z+.018);for(let i=0;i<5;i++){const a=i*Math.PI*2/5;bar([0,0],[Math.cos(a)*r*.86,Math.sin(a)*r*.86],.033,.03,gold,parent,z+.018);}}
  }
  // The open mainplate allows the same gear train to be inspected from either side.
  const base=new T.Group();root.add(base);annulus(1.65,1.47,.07,silver,base,0,0,-.32);
  for(const [a,b] of [[[-1.5,.9],[1.2,.9]],[[-1.4,-.7],[-.6,.9]],[[1.3,-.7],[1.2,.9]]])bar(a,b,.13,.06,dark,base,-.29);
  const wheels=train.map((g,i)=>{const group=new T.Group();group.name=g.name;group.position.set(g.x,g.y,0);root.add(group);wheel(g.teeth,group,g.z,false,i===4);if(i)wheel(g.pinion,group,train[i-1].z,true);cylinder(.022,g.z+.37,silver,group,0,0,(g.z-.33)/2);bearing(g.x,g.y,-.37,base);return group;});
  // Barrel wall and a continuous coiled mainspring, underneath the first wheel.
  annulus(.525,.497,.11,silver,root,train[0].x,train[0].y,-.2);
  const coil=[];for(let i=0;i<=420;i++){const u=i/420,a=u*Math.PI*18,r=.075+.395*u;coil.push(new T.Vector3(train[0].x+Math.cos(a)*r,train[0].y+Math.sin(a)*r,-.115));}
  mesh(new T.TubeGeometry(new T.CatmullRomCurve3(coil),420,.006,4,false),blue,root);
  const bridges=new T.Group();root.add(bridges);
  for(let i=1;i<train.length;i++){const g=train[i];bar([g.x,g.y],[g.x,g.y+.27],.105,.05,silver,bridges,.45);bearing(g.x,g.y,.48,bridges);screw(g.x,g.y+.24,.48,bridges);}
  bar([-.97,.99],[.87,.99],.16,.055,silver,bridges,.45);screw(-.97,.99,.49,bridges);screw(.87,.99,.49,bridges);
  const escape=train[4],bx=escape.x,by=escape.y-.94;
  const balance=new T.Group();balance.position.set(bx,by,.17);root.add(balance);
  annulus(.46,.412,.06,gold,balance);for(let i=0;i<3;i++){const a=i*Math.PI*2/3;bar([0,0],[Math.cos(a)*.435,Math.sin(a)*.435],.038,.04,silver,balance,.025);}
  for(let i=0;i<12;i++){const a=i*Math.PI/6;cylinder(.024,.075,gold,balance,Math.cos(a)*.437,Math.sin(a)*.437,.028);}
  cylinder(.065,.2,blue,balance,0,0,.035);cylinder(.021,.055,jewel,balance,0,.17,.105);
  // Dynamic ribbon: outer stud remains fixed, inner end rotates with the balance staff.
  const count=384,positions=new Float32Array((count+1)*2*3),indices=[];
  for(let i=0;i<count;i++){const a=i*2;indices.push(a,a+1,a+2,a+1,a+3,a+2);}
  const springGeo=new T.BufferGeometry();springGeo.setAttribute('position',new T.BufferAttribute(positions,3).setUsage(T.DynamicDrawUsage));springGeo.setIndex(indices);
  const springMat=new T.MeshStandardMaterial({color:0x4b7dba,metalness:.8,roughness:.3,side:T.DoubleSide});
  const spring=mesh(springGeo,springMat,root,bx,by,.33);spring.frustumCulled=false;
  cylinder(.036,.09,silver,root,bx+.405,by,.35);
  const pallet=new T.Group();pallet.position.set(escape.x,escape.y-.35,.37);root.add(pallet);
  bar([0,0],[-.145,.20],.039,.025,silver,pallet,0);bar([0,0],[.145,.20],.039,.025,silver,pallet,0);
  for(const x of [-.145,.145]){const m=mesh(new T.BoxGeometry(.07,.035,.055),jewel,pallet,x,.20,.012);m.rotation.z=x<0?-.4:.4;}
  bar([0,0],[0,-.34],.035,.03,silver,pallet,0);
  for(const x of [-.038,.038])bar([0,-.30],[x,-.40],.018,.03,silver,pallet,0);
  bearing(pallet.position.x,pallet.position.y,.42,bridges);
  bar([bx-.6,by-.22],[bx,by],.10,.05,silver,bridges,.46);bearing(bx,by,.49,bridges);screw(bx-.6,by-.22,.49,bridges);
  let previousAngle=NaN;
  function update(seconds,opening=0){
    const state=movementState(seconds);wheels.forEach((g,i)=>{g.rotation.z=state.angles[i];});
    balance.rotation.z=state.balance;pallet.rotation.z=state.pallet;
    bridges.position.z=opening*.95;base.position.z=-opening*.55;
    if(state.balance!==previousAngle){for(let i=0;i<=count;i++){const p=springPoint(i/count,state.balance);const k=i*6;positions[k]=p.x;positions[k+1]=p.y;positions[k+2]=-.012;positions[k+3]=p.x;positions[k+4]=p.y;positions[k+5]=.012;}springGeo.attributes.position.needsUpdate=true;springGeo.computeVertexNormals();previousAngle=state.balance;}
  }
  update(0);return {root,update};
}
