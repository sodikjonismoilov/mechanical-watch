import * as T from 'three';

// Large reflection panels give metal broad highlights separated by dark bands.
// This studio is only sampled by PMREM; it is never drawn behind the watch.
export function createReflectionStudio() {
  const studio=new T.Scene();studio.background=new T.Color(0x101619);
  for(const {position,size,color,intensity} of [
    {position:[-4,3,5],size:[2.5,7],color:0xfff1dc,intensity:4},
    {position:[4,1,3],size:[1.3,6],color:0xe1edff,intensity:2.5},
    {position:[0,5,-3],size:[5,2],color:0xffffff,intensity:3},
    {position:[-3,-1,-5],size:[3,6],color:0xe8eeff,intensity:2.5},
  ]) {
    const material=new T.MeshBasicMaterial({color:new T.Color(color).multiplyScalar(intensity),side:T.DoubleSide});
    const panel=new T.Mesh(new T.PlaneGeometry(...size),material);
    panel.position.set(...position);panel.lookAt(0,0,0);studio.add(panel);
  }
  return studio;
}
export function configureWatchLighting(scene,renderer) {
  renderer.outputColorSpace=T.SRGBColorSpace;
  renderer.toneMapping=T.AgXToneMapping;
  renderer.toneMappingExposure=1.05;
  renderer.shadowMap.enabled=true;
  renderer.shadowMap.type=T.PCFSoftShadowMap;
  scene.environmentIntensity=.65;
  const studio=createReflectionStudio(),pmrem=new T.PMREMGenerator(renderer);
  const environment=pmrem.fromScene(studio,.035);scene.environment=environment.texture;
  studio.traverse(o=>{if(o.isMesh){o.geometry.dispose();o.material.dispose();}});pmrem.dispose();
  scene.add(new T.HemisphereLight(0xeaf1ff,0x242529,.25));
  const key=new T.DirectionalLight(0xfff0db,1.8);key.position.set(-3.5,5,8);key.castShadow=true;
  key.shadow.mapSize.set(2048,2048);
  Object.assign(key.shadow.camera,{left:-6,right:6,top:6,bottom:-6,near:.5,far:25});
  key.shadow.camera.updateProjectionMatrix();key.shadow.bias=-.00004;key.shadow.normalBias=.008;
  scene.add(key);
  const fill=new T.DirectionalLight(0xdceaff,.45);fill.position.set(5,0,4);scene.add(fill);
  const back=new T.DirectionalLight(0xe7edff,1.15);back.position.set(0,4,-7);scene.add(back);
}
export function enableWatchShadows(model) {
  model.traverse(object=>{
    if(!object.isMesh)return;
    const materials=Array.isArray(object.material)?object.material:[object.material];
    const opaque=materials.every(m=>!m.transparent);
    object.castShadow=opaque;
    object.receiveShadow=opaque;
  });
}
