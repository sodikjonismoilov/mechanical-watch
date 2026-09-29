const TAU = Math.PI * 2;
export const train = [
  { name: 'Barrel', teeth: 90, pinion: 10, x: -.9, y: .75, z: -.08, phase: 0 },
  { name: 'Centre wheel', teeth: 64, pinion: 10, direction: -75 },
  { name: 'Third wheel', teeth: 75, pinion: 10, direction: 20 },
  { name: 'Fourth wheel', teeth: 80, pinion: 10, direction: 0 },
  { name: 'Escape wheel', teeth: 30, pinion: 10, direction: -55 },
];
for (let i=1;i<train.length;i++) {
  const p=train[i-1],g=train[i],a=g.direction*Math.PI/180,d=(p.teeth+g.pinion)*.006;
  g.x=p.x+Math.cos(a)*d;g.y=p.y+Math.sin(a)*d;g.z=p.z+.11;
  // Align each tooth with the opposing gap at the line of centres.
  g.phase=((p.teeth+g.pinion)*a+g.pinion*Math.PI-Math.PI-p.teeth*p.phase)/g.pinion;
}
const smooth=x=>x*x*(3-2*x);
export function movementState(seconds) {
  const beat=seconds*8,whole=Math.floor(beat),fraction=beat-whole;
  const release=smooth(Math.max(0,Math.min(1,(fraction-.72)/.23)));
  const escape=(whole+release)*Math.PI/30;
  const angles=new Array(train.length);angles[4]=escape+train[4].phase;
  for(let i=3;i>=0;i--)angles[i]=train[i].phase-(angles[i+1]-train[i+1].phase)*train[i+1].pinion/train[i].teeth;
  return {angles,escape,balance:Math.sin(seconds*TAU*4)*1.65,pallet:(whole%2===0?1:-1)*(.17-.34*release),release};
}
export function springPoint(u,angle) {
  const theta=u*TAU*7+angle*(1-u)*(1-u),r=.065+.34*u;
  return {x:Math.cos(theta)*r,y:Math.sin(theta)*r};
}
