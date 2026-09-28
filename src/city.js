import * as T from 'three';

// A miniature Manhattan study, with stepped Art Deco towers and a faceted spire.
export function createNewYorkModel() {
  const city = new T.Group();
  const stone = new T.MeshStandardMaterial({ color: 0xc3b99f, roughness: .65, metalness: .22 });
  const copper = new T.MeshStandardMaterial({ color: 0x7b9b94, roughness: .4, metalness: .55 });
  const gold = new T.MeshStandardMaterial({ color: 0xd2aa64, roughness: .35, metalness: .6 });
  const windows = new T.MeshStandardMaterial({ color: 0xffd894, emissive: 0xd39b42, emissiveIntensity: .35 });
  const water = new T.MeshStandardMaterial({ color: 0x254b55, roughness: .3, metalness: .4 });
  const land = new T.MeshStandardMaterial({ color: 0x324740, roughness: .85 });
  function add(geometry, material, x, y, z) {
    const m = new T.Mesh(geometry, material);
    m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; city.add(m); return m;
  }
  function block(x, z, w, d, h, bottom = .12, material = stone) {
    return add(new T.BoxGeometry(w, h, d), material, x, bottom + h / 2, z);
  }
  const sea = add(new T.CylinderGeometry(1.7, 1.7, .07, 64), water, 0, -.035, 0);
  sea.scale.z = .57;
  const island = add(new T.CylinderGeometry(1.48, 1.55, .12, 8), land, 0, .045, 0);
  island.scale.z = .49;
  for (const [x,z,w,d,h] of [[-1.03,.12,.24,.29,.43],[-.7,.35,.27,.25,.56],[-.27,.4,.23,.24,.4],[.12,.36,.22,.26,.54],[.49,.4,.24,.23,.34],[1.0,.08,.22,.29,.48],[-.94,-.33,.23,.2,.6],[.85,-.3,.29,.25,.65]]) {
    block(x,z,w,d,h);
    for(let row=0;row<Math.floor(h/.11)-1;row++)for(let col=0;col<2;col++) {
      block(x+(col-.5)*w*.42,z+d/2+.004,.028,.008,.036,.21+row*.11,windows);
    }
  }
  // Empire State-inspired tiered tower and needle.
  block(-.38,-.08,.48,.38,.22);
  block(-.38,-.08,.34,.29,.76,.34);
  block(-.38,-.08,.26,.23,.23,1.1);
  block(-.38,-.08,.17,.16,.19,1.33);
  block(-.38,-.08,.09,.09,.16,1.52,gold);
  add(new T.CylinderGeometry(.014,.025,.32,12),gold,-.38,1.84,-.08);
  for(let row=0;row<8;row++)for(let col=0;col<3;col++)block(-.38+(col-1)*.08,.068,.023,.01,.044,.4+row*.085,windows);
  // Chrysler-inspired stacked crown.
  block(.27,-.27,.28,.27,.82);
  for(let i=0;i<4;i++)add(new T.CylinderGeometry(.09-i*.02,.18-i*.025,.105,4),gold,.27,.99+i*.09,-.27).rotation.y=Math.PI/4;
  add(new T.ConeGeometry(.042,.29,12),gold,.27,1.42,-.27);
  // Faceted glass tower, offset so all three silhouettes remain readable.
  const tower=add(new T.CylinderGeometry(.085,.2,1.06,4),copper,.68,.65,-.01);
  tower.rotation.y=Math.PI/4;
  add(new T.CylinderGeometry(.009,.018,.32,8),gold,.68,1.34,-.01);
  // A small park and waterfront promenade complete the miniature base.
  for(let i=0;i<5;i++)add(new T.SphereGeometry(.058,8,6),copper,-1.15+i*.14,.2,.38);
  return city;
}

export function mountNewYork(canvas) {
  const renderer = new T.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.toneMapping = T.ACESFilmicToneMapping;
  const scene = new T.Scene();
  scene.add(createNewYorkModel());
  scene.add(new T.HemisphereLight(0xe7f3ff, 0x24332c, 2.6));
  const light = new T.DirectionalLight(0xffd9a3, 3); light.position.set(-3,5,4); scene.add(light);
  const camera = new T.OrthographicCamera(-2,2,1.6,-1.6,.1,30);
  camera.position.set(3,2.7,5); camera.lookAt(0,.8,0);
  const observer = new ResizeObserver(() => {
    const w=canvas.clientWidth,h=canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w,h,false);
    camera.left=-1.6*w/h; camera.right=1.6*w/h; camera.updateProjectionMatrix();
    renderer.render(scene,camera);
  });
  observer.observe(canvas);
}
