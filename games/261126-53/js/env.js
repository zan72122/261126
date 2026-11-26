// midsummer noon desert: sky, sun, HDR-ish environment, ground, far mesas, shrubs, pebbles
import * as THREE from 'three';
import { scene, renderer, pbr, tex, rng } from './core.js';
import { rockGeo, sweep, merge, xform, setColor, fbm } from './geo.js';

export const SUN_DIR = new THREE.Vector3(0.42, 1.0, 0.62).normalize(); // high noon-ish, slightly in front-right of camera
const ZEN = new THREE.Color(0.05, 0.18, 0.62), HOR = new THREE.Color(0.62, 0.72, 0.84);
export const HAZE = new THREE.Color().setRGB(0.78, 0.76, 0.72, THREE.SRGBColorSpace);

function skyMaterial(sunBoost) {
  return new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false,
    uniforms: { sunDir: { value: SUN_DIR }, zen: { value: ZEN }, hor: { value: HOR }, boost: { value: sunBoost } },
    vertexShader: `varying vec3 vDir; void main(){ vDir = normalize(position); vec4 p = projectionMatrix*modelViewMatrix*vec4(position,1.); gl_Position = p.xyww; }`,
    fragmentShader: `varying vec3 vDir; uniform vec3 sunDir, zen, hor; uniform float boost;
      void main(){
        vec3 d = normalize(vDir);
        float h = max(d.y, 0.);
        vec3 c = mix(hor*1.55, zen*1.5, pow(h, .45));
        float s = max(dot(d, sunDir), 0.);
        c += vec3(1.,.93,.8) * (pow(s, 8.)*.35 + pow(s, 64.)*.8);
        c += vec3(1.,.97,.9) * smoothstep(.99985,.99995,s) * boost;
        // below horizon: warm ground bounce
        c = mix(c, vec3(.55,.42,.28)*1.1, smoothstep(0.,-.08,d.y));
        gl_FragColor = vec4(c, 1.);
      }`,
  });
}

export const sun = new THREE.DirectionalLight(new THREE.Color().setRGB(1.0, 0.955, 0.88), 3.3);
export function setupEnvironment() {
  // environment map from an HDR-like sky + bright ochre ground
  const envScene = new THREE.Scene();
  envScene.add(new THREE.Mesh(new THREE.SphereGeometry(50, 48, 24), skyMaterial(60)));
  const groundDisc = new THREE.Mesh(new THREE.CircleGeometry(48, 48), new THREE.MeshBasicMaterial({ color: new THREE.Color(0.62, 0.44, 0.27) }));
  groundDisc.rotation.x = -Math.PI / 2; groundDisc.position.y = -2;
  envScene.add(groundDisc);
  const pm = new THREE.PMREMGenerator(renderer);
  scene.environment = pm.fromScene(envScene, 0.02).texture;
  scene.environmentIntensity = 0.62;
  pm.dispose();

  const skyMesh = new THREE.Mesh(new THREE.SphereGeometry(800, 48, 24), skyMaterial(30));
  skyMesh.frustumCulled = false; skyMesh.renderOrder = -10;
  scene.add(skyMesh);
  scene.fog = new THREE.Fog(HAZE, 90, 900);

  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  const sc = sun.shadow.camera; sc.left = -4.5; sc.right = 4.5; sc.top = 4.5; sc.bottom = -4.5; sc.near = 1; sc.far = 40;
  sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.015;
  scene.add(sun, sun.target);
  setShadowFocus(new THREE.Vector3());
}
export function setShadowFocus(p, size = 4.5) {
  sun.target.position.copy(p);
  sun.position.copy(p).addScaledVector(SUN_DIR, 18);
  const sc = sun.shadow.camera;
  if (sc.right !== size) { sc.left = -size; sc.right = size; sc.top = size; sc.bottom = -size; sc.updateProjectionMatrix(); }
}

// ground material with macro variation to break tiling; holes where sand fields replace it
export const groundHoles = []; for (let i = 0; i < 6; i++) groundHoles.push(new THREE.Vector4(0, 0, 0, 0));
let holeN = 0;
export function addGroundHole(x0, z0, x1, z1) { groundHoles[holeN++ % 6].set(x0, z0, x1, z1); }
export function groundMaterial(rep) {
  const m = pbr('sand', { repeat: rep });
  m.onBeforeCompile = sh => {
    sh.uniforms.holes = { value: groundHoles };
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vWP;')
      .replace('#include <worldpos_vertex>', '#include <worldpos_vertex>\nvWP = (modelMatrix*vec4(transformed,1.)).xyz;');
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nvarying vec3 vWP; uniform vec4 holes[6];')
      .replace('#include <map_fragment>', `
        for (int i = 0; i < 6; i++) { vec4 h = holes[i]; if (h.z > h.x && vWP.x > h.x && vWP.x < h.z && vWP.z > h.y && vWP.z < h.w) discard; }
        vec4 sA = texture2D(map, vMapUv);
        vec4 sB = texture2D(map, vWP.xz*0.37 + vec2(.31,.17));
        vec4 mac = texture2D(map, vWP.xz*0.013);
        vec4 mac2 = texture2D(map, vWP.xz*0.0021 + .5);
        vec3 sc = mix(sA.rgb, sB.rgb, .35);
        sc *= mix(.84, 1.12, smoothstep(.55,.85, mac.r)) * mix(.9,1.08, smoothstep(.5,.9,mac2.g));
        float far = smoothstep(15., 120., length(vWP.xz - cameraPosition.xz));
        sc = mix(sc, vec3(.62,.45,.29)*1.05, far*.35);
        diffuseColor *= vec4(sc, 1.);`);
  };
  return m;
}

export function buildLandscape() {
  const R = rng(531);
  // big ground with gentle undulation (flat near the work area)
  const g = new THREE.PlaneGeometry(1400, 1400, 160, 160);
  g.rotateX(-Math.PI / 2);
  const p = g.attributes.position, uv = g.attributes.uv;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), z = p.getZ(i);
    const d = Math.hypot(x - 2, z + 2);
    const k = THREE.MathUtils.smoothstep(d, 14, 60);
    let y = fbm(x * 0.012, 0, z * 0.012, 4) * 6 * k + fbm(x * 0.05, 3, z * 0.05, 3) * 0.8 * k;
    y -= THREE.MathUtils.smoothstep(d, 200, 700) * 8;
    p.setY(i, y - 0.004);
    uv.setXY(i, x / 0.85, z / 0.85);
  }
  g.computeVertexNormals();
  const ground = new THREE.Mesh(g, groundMaterial(1));
  ground.receiveShadow = true;
  scene.add(ground);

  // far mesas & buttes
  const rockMat = pbr('rock', { repeat: 1 });
  rockMat.onBeforeCompile = sh => {
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vWP2;')
      .replace('#include <worldpos_vertex>', '#include <worldpos_vertex>\nvWP2 = (modelMatrix*vec4(transformed,1.)).xyz;');
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nvarying vec3 vWP2;')
      .replace('#include <map_fragment>', `
        vec2 suv = vec2(vWP2.x*.013 + vWP2.z*.011, vWP2.y*.03);
        vec3 sc = texture2D(map, suv).rgb * mix(.8,1.15, texture2D(map, vWP2.xz*.002).r);
        float band = sin(vWP2.y*.55 + sin(vWP2.x*.02)*2.)*.5+.5;
        sc *= mix(vec3(.92,.88,.86), vec3(1.08,1.0,.95), band);
        diffuseColor *= vec4(sc,1.);`);
  };
  const mesas = [
    [-260, -420, 120, 38, 0.32], [-90, -520, 160, 52, 0.38], [140, -480, 90, 46, 0.5], [320, -390, 140, 30, 0.3],
    [-420, -260, 110, 26, 0.3], [460, -200, 80, 34, 0.45], [40, -330, 30, 40, 0.9], [-170, -300, 26, 30, 0.95],
    [260, -600, 200, 60, 0.3], [-400, -600, 200, 70, 0.3],
  ];
  mesas.forEach(([x, z, w, h, flat], i) => {
    const geo = rockGeo(1, i * 7 + 3, 4, 1);
    const pp = geo.attributes.position;
    for (let k = 0; k < pp.count; k++) {
      let y = pp.getY(k);
      // flat top with cliff walls
      const top = 0.55 + fbm(pp.getX(k) * 2 + i, 0, pp.getZ(k) * 2, 2) * 0.05;
      if (y > top) y = top + (y - top) * 0.08;
      y = Math.max(y, -0.4);
      pp.setY(k, (y + 0.4) / 1.0);
      pp.setX(k, pp.getX(k) * (1 + (0.6 - y) * 0.25));
      pp.setZ(k, pp.getZ(k) * (1 + (0.6 - y) * 0.25));
    }
    geo.computeVertexNormals();
    const m = new THREE.Mesh(geo, rockMat);
    m.scale.set(w, h * flat * 1.4, w * 0.6);
    m.position.set(x, -14, z);
    m.rotation.y = R() * 6.28;
    scene.add(m);
  });

  // dry desert shrubs (instanced)
  const twigs = [];
  const RR = rng(77);
  for (let i = 0; i < 26; i++) {
    const a = RR() * 6.28, l = 0.25 + RR() * 0.3, tilt = 0.4 + RR() * 0.7;
    const pts = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(Math.cos(a) * l * 0.35 * tilt, l * 0.55, Math.sin(a) * l * 0.35 * tilt), new THREE.Vector3(Math.cos(a) * l * 0.8 * tilt, l, Math.sin(a) * l * 0.8 * tilt)];
    const tg = sweep(pts, { radius: t => 0.008 * (1 - t * 0.8), segs: 4, radial: 4, caps: false });
    setColor(tg, (v, c) => c.setRGB(0.32, 0.25, 0.18));
    twigs.push(tg);
    for (let k = 0; k < 3; k++) {
      const lg = new THREE.IcosahedronGeometry(0.05 + RR() * 0.05, 1);
      lg.deleteAttribute('uv'); lg.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(lg.attributes.position.count * 2), 2));
      const tt = 0.5 + k * 0.25;
      xform(lg, { p: new THREE.Vector3(Math.cos(a) * l * 0.8 * tilt * tt, l * tt, Math.sin(a) * l * 0.8 * tilt * tt), s: new THREE.Vector3(1, 0.7, 1) });
      const gc = 0.75 + RR() * 0.3;
      setColor(lg, (v, c) => c.setRGB(0.42 * gc, 0.45 * gc, 0.33 * gc));
      twigs.push(lg);
    }
  }
  const shrubGeo = merge(twigs);
  const shrubMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9, normalMap: tex('dino', 'n', 3), normalScale: new THREE.Vector2(0.6, 0.6) });
  const SH = 90;
  const shrubs = new THREE.InstancedMesh(shrubGeo, shrubMat, SH);
  const M = new THREE.Matrix4(), Q = new THREE.Quaternion(), S = new THREE.Vector3(), Pp = new THREE.Vector3();
  let n = 0;
  while (n < SH) {
    const ang = RR() * 6.28, d = 7 + RR() ** 1.5 * 70;
    const x = Math.cos(ang) * d + 2, z = Math.sin(ang) * d - 2;
    if (z > 4 && Math.abs(x - 2) < 9) continue; // keep behind-camera area free
    const s = 0.6 + RR() * 1.0;
    Pp.set(x, 0, z); Q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), RR() * 6.28); S.set(s, s * (0.7 + RR() * 0.5), s);
    M.compose(Pp, Q, S); shrubs.setMatrixAt(n++, M);
  }
  shrubs.castShadow = true; shrubs.receiveShadow = true;
  scene.add(shrubs);

  // pebbles everywhere near the camp
  const pebGeo = rockGeo(1, 11, 2, 0.55);
  const pebMat = pbr('rock', { repeat: 0.5 });
  const PN = 420;
  const peb = new THREE.InstancedMesh(pebGeo, pebMat, PN);
  for (let i = 0; i < PN; i++) {
    let x, z;
    do { x = -6 + RR() * 16; z = -7 + RR() * 12; } while (inWork(x, z));
    const s = 0.008 + RR() ** 3 * 0.06;
    Pp.set(x, -s * 0.15, z); Q.setFromEuler(new THREE.Euler(RR() * 0.4, RR() * 6.28, RR() * 0.4)); S.set(s * (0.8 + RR() * 0.6), s, s * (0.8 + RR() * 0.6));
    M.compose(Pp, Q, S); peb.setMatrixAt(i, M);
    const c = new THREE.Color().setHSL(0.07 + RR() * 0.03, 0.25 + RR() * 0.2, 0.45 + RR() * 0.25);
    peb.setColorAt(i, c);
  }
  peb.castShadow = true; peb.receiveShadow = true;
  scene.add(peb);
}
// keep pebbles off the pit and the exhibit sand patch
export function inWork(x, z) {
  if (x > -1.35 && x < 1.35 && z > -0.75 && z < 0.7) return true;
  if (x > 2.3 && x < 7.7 && z > -1.6 && z < 1.9) return true;
  return false;
}
