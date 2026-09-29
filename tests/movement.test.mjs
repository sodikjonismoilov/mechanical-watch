import test from 'node:test';
import assert from 'node:assert/strict';
import { train, movementState, springPoint } from '../src/mechanics.js';
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-7,`${a} != ${b}`);
test('every gear pair meets at its pitch circles and preserves its tooth ratio',()=>{
 for(let i=1;i<train.length;i++){
 const p=train[i-1],g=train[i];near(Math.hypot(g.x-p.x,g.y-p.y),p.teeth*.006+g.pinion*.006);
 const a=movementState(1.2),b=movementState(2.3);
 near((b.angles[i-1]-a.angles[i-1])*p.teeth+(b.angles[i]-a.angles[i])*g.pinion,0);
 }
});
test('fourth wheel completes one turn per minute and escape wheel locks between impulses',()=>{
 near(Math.abs(movementState(60).angles[3]-movementState(0).angles[3]),Math.PI*2);
 near(movementState(.02).escape,movementState(.07).escape);
 assert.notEqual(movementState(.12).escape,movementState(.02).escape);
});
test('hairspring outer anchor stays fixed while its inner end follows the balance',()=>{
 const a=springPoint(1,-1),b=springPoint(1,1);near(a.x,b.x);near(a.y,b.y);
 const c=springPoint(0,0),d=springPoint(0,1);near(Math.atan2(d.y,d.x)-Math.atan2(c.y,c.x),1);
});

test('3D assembly opens without separating meshing gears and deforms without invalid geometry',async()=>{
 const {createMovement}=await import('../src/movement.js');
 const {root,update}=createMovement();
 const gears=root.children.filter(o=>train.some(g=>g.name===o.name));
 const initial=gears.map(g=>g.position.clone());
 for(let i=0;i<=80;i++){
   update(i/320,i/80);
   gears.forEach((g,j)=>assert.ok(g.position.equals(initial[j])));
   root.traverse(o=>{if(o.isMesh)for(const v of o.geometry.attributes.position.array)assert.ok(Number.isFinite(v));});
 }
 update(1,0);
 assert.equal(gears.length,5);
});
