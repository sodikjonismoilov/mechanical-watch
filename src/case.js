import * as T from 'three';

// Radial cross-section revolved around the dial axis, with a recessed inner wall.
export function createCaseBody(material) {
  const profile=[
    [1.91,-.32],[2.00,-.32],[2.045,-.29],[2.085,-.23],
    [2.11,-.13],[2.115,.07],[2.10,.16],[2.07,.23],
    [2.025,.28],[1.93,.28],[1.91,.25],[1.91,-.32]
  ];
  const body=new T.Mesh(new T.LatheGeometry(profile.map(([r,z])=>new T.Vector2(r,z)),128),material);
  body.rotation.x=Math.PI/2;body.name='Sculpted case middle';return body;
}
export function createBezel(material) {
  const profile=[[1.895,.30],[2.025,.27],[2.09,.29],[2.11,.32],[2.08,.36],[1.98,.43],[1.93,.44],[1.895,.415],[1.895,.30]];
  const bezel=new T.Mesh(new T.LatheGeometry(profile.map(([r,z])=>new T.Vector2(r,z)),128),material);
  bezel.rotation.x=Math.PI/2;bezel.name='Sloped polished bezel';return bezel;
}
export function createLug(side,end,material) {
  const shape=new T.Shape();
  shape.moveTo(.73,1.76);shape.bezierCurveTo(.82,1.73,1.01,1.72,1.12,1.82);
  shape.bezierCurveTo(1.13,2.00,1.03,2.33,.97,2.43);
  shape.quadraticCurveTo(.90,2.49,.81,2.43);shape.lineTo(.74,2.05);shape.closePath();
  const geo=new T.ExtrudeGeometry(shape,{depth:.24,bevelEnabled:true,bevelThickness:.085,bevelSize:.06,bevelSegments:5,curveSegments:20});
  // Transform the geometry so mirrored lugs retain outward-facing triangle winding.
  const lug=new T.Mesh(geo,material);lug.scale.set(side,end,1);lug.position.z=-.17;
  lug.name='Tapered case lug';return lug;
}
