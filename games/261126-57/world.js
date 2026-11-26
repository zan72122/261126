// Festival night stall: environment map, lights, stall structure, lanterns, ground, backdrop.
import * as THREE from './three.module.min.js';
import { pbr, tex, canvasTex } from './tex.js';
import { loftGeo, latheGeo, M4 } from './geo.js';

const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);

export function roundedBox(w, h, d, r = 0.01, seg = 3) {
  const s = new THREE.Shape();
  const x0 = -w / 2 + r, y0 = -h / 2 + r, x1 = w / 2 - r, y1 = h / 2 - r;
  s.moveTo(x0, -h / 2); s.lineTo(x1, -h / 2); s.quadraticCurveTo(w / 2, -h / 2, w / 2, y0);
  s.lineTo(w / 2, y1); s.quadraticCurveTo(w / 2, h / 2, x1, h / 2); s.lineTo(x0, h / 2);
  s.quadraticCurveTo(-w / 2, h / 2, -w / 2, y1); s.lineTo(-w / 2, y0); s.quadraticCurveTo(-w / 2, -h / 2, x0, -h / 2);
  const g = new THREE.ExtrudeGeometry(s, { depth: d - 2 * r, bevelEnabled: true, bevelThickness: r, bevelSize: r * 0.9, bevelSegments: seg, curveSegments: seg });
  g.translate(0, 0, -(d - 2 * r) / 2);
  return g;
}

// box with world-scaled UVs (for tiling textures in metres)
export function woodBox(w, h, d, mat, r = 0.006, uvScale = 1) {
  const g = roundedBox(w, h, d, r);
  // planar box projection uv
  const p = g.attributes.position, n = g.attributes.normal; const uv = g.attributes.uv;
  for (let i = 0; i < p.count; i++) {
    const ax = Math.abs(n.getX(i)), ay = Math.abs(n.getY(i)), az = Math.abs(n.getZ(i));
    let u, v;
    if (ay >= ax && ay >= az) { u = p.getX(i); v = p.getZ(i); }
    else if (ax >= az) { u = p.getZ(i); v = p.getY(i); }
    else { u = p.getX(i); v = p.getY(i); }
    uv.setXY(i, u * uvScale, v * uvScale);
  }
  return new THREE.Mesh(g, mat);
}

export function buildEnvironment(renderer) {
  // HDR-ish environment for reflections: night sky, warm stall glows all around
  const s = new THREE.Scene();
  const skyMat = new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false,
    vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
    fragmentShader: `varying vec3 vP; void main(){
      float y = vP.y;
      vec3 sky = mix(vec3(0.09,0.11,0.24), vec3(0.02,0.03,0.08), smoothstep(0.0,0.7,y));
      vec3 hor = vec3(0.9,0.5,0.26);
      vec3 col = mix(hor, sky, smoothstep(-0.02,0.35,y));
      vec3 gnd = vec3(0.16,0.11,0.08);
      col = mix(gnd, col, smoothstep(-0.12,0.0,y));
      gl_FragColor = vec4(col,1.0); }`,
  });
  s.add(new THREE.Mesh(new THREE.SphereGeometry(50, 32, 16), skyMat));
  const warm = new THREE.MeshBasicMaterial({ color: new THREE.Color(1.0, 0.55, 0.25).multiplyScalar(6) });
  const red = new THREE.MeshBasicMaterial({ color: new THREE.Color(1.0, 0.25, 0.12).multiplyScalar(5) });
  const bulb = new THREE.MeshBasicMaterial({ color: new THREE.Color(1.0, 0.8, 0.55).multiplyScalar(30) });
  const sg = new THREE.SphereGeometry(1, 12, 8);
  for (let i = 0; i < 26; i++) {
    const a = i / 26 * Math.PI * 2;
    const m = new THREE.Mesh(sg, i % 3 === 0 ? red : warm);
    m.position.set(Math.cos(a) * 20, 3 + Math.sin(i * 1.7) * 1.2, Math.sin(a) * 20); m.scale.setScalar(0.9 + (i % 4) * 0.3);
    s.add(m);
  }
  // lantern row just above the stall front
  for (let i = 0; i < 6; i++) { const m = new THREE.Mesh(sg, i % 2 ? red : warm); m.position.set(-2.5 + i, 3.5, 6); m.scale.setScalar(0.5); s.add(m); }
  const b = new THREE.Mesh(sg, bulb); b.position.set(0, 6, 0); b.scale.setScalar(0.5); s.add(b);
  // a soft warm "street" panel in front (light reflected from the crowd side)
  const panel = new THREE.Mesh(new THREE.PlaneGeometry(30, 6), new THREE.MeshBasicMaterial({ color: new THREE.Color(0.9, 0.6, 0.4), side: THREE.DoubleSide }));
  panel.position.set(0, 2, 18); s.add(panel);
  // warm wooden stall interior around the origin (what the steel bowl and glass mirror)
  const box = new THREE.Mesh(new THREE.BoxGeometry(5, 3, 4), new THREE.MeshBasicMaterial({ color: new THREE.Color(0.3, 0.27, 0.25), side: THREE.BackSide }));
  box.position.set(0, 1.5, -1.5); s.add(box);
  const canopyGlow = new THREE.Mesh(new THREE.PlaneGeometry(5, 3), new THREE.MeshBasicMaterial({ color: new THREE.Color(1.4, 0.5, 0.4), side: THREE.DoubleSide }));
  canopyGlow.rotation.x = Math.PI / 2; canopyGlow.position.set(0, 2.9, -1); s.add(canopyGlow);
  const pm = new THREE.PMREMGenerator(renderer);
  const rt = pm.fromScene(s, 0.035);
  pm.dispose();
  return rt.texture;
}

export function buildLights(scene) {
  const L = {};
  // bare incandescent bulb under the canopy: the key light with soft shadows
  const key = new THREE.SpotLight(0xffd9b0, 9, 7, 1.1, 0.9, 2);
  key.position.set(0.05, 2.0, 0.12);
  key.target.position.set(-0.08, 0.8, -0.4);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.bias = -0.0004; key.shadow.normalBias = 0.02; key.shadow.radius = 6;
  key.shadow.camera.near = 0.2; key.shadow.camera.far = 5;
  scene.add(key, key.target);
  L.key = key;
  // lantern glow (warm, red-ish) left/right
  const l1 = new THREE.PointLight(0xff9a55, 3.2, 5, 2); l1.position.set(-0.95, 2.0, 0.25); scene.add(l1);
  const l2 = new THREE.PointLight(0xffa560, 3.2, 5, 2); l2.position.set(0.95, 2.0, 0.25); scene.add(l2);
  L.lan = [l1, l2];
  // light from the busy street (front fill so faces read) and back rim from the stalls behind
  const fill = new THREE.DirectionalLight(0xffe4c8, 1.5); fill.position.set(0.8, 1.6, 3); scene.add(fill);
  const street = new THREE.PointLight(0xffb070, 2.2, 6, 1.6); street.position.set(0.4, 1.5, 1.8); scene.add(street); L.street = street;
  const rim = new THREE.DirectionalLight(0xffa65a, 1.4); rim.position.set(-1.5, 2.2, -3); scene.add(rim);
  L.fill = fill; L.rim = rim;
  const hemi = new THREE.HemisphereLight(0x33427a, 0x2a1c12, 0.55); scene.add(hemi);
  L.hemi = hemi;
  // firework flash (scene 3)
  const flash = new THREE.PointLight(0xffffff, 0, 40, 1.2); flash.position.set(0, 7, -6); scene.add(flash);
  L.flash = flash;
  return L;
}

// paper lantern (chochin): ribbed washi glowing from inside
export function chochin(color = 0xd23a2a, h = 0.36, r = 0.13) {
  const g = new THREE.Group();
  const pts = [];
  const N = 40;
  for (let i = 0; i <= N; i++) {
    const t = i / N; const y = (t - 0.5) * h;
    let rr = r * Math.sin(Math.PI * (0.08 + t * 0.84)) ** 0.75;
    rr *= 1 - 0.035 * Math.abs(Math.sin(t * Math.PI * 14)); // bamboo ribs
    pts.push([rr, y]);
  }
  const lg = latheGeo(pts, 40);
  const mat = new THREE.MeshStandardMaterial({
    color, map: tex('washi_c', 1, true), normalMap: tex('washi_n', 1), roughness: 0.85,
    emissive: new THREE.Color(color).lerp(new THREE.Color(0xffb070), 0.45), emissiveMap: tex('washi_c', 1, true), emissiveIntensity: 1.6,
    side: THREE.DoubleSide,
  });
  const body = new THREE.Mesh(lg, mat); g.add(body);
  const capM = new THREE.MeshStandardMaterial({ color: 0x15100e, roughness: 0.35, metalness: 0.1 });
  const capG = new THREE.CylinderGeometry(r * 0.42, r * 0.45, h * 0.08, 24);
  const c1 = new THREE.Mesh(capG, capM); c1.position.y = h * 0.47; g.add(c1);
  const c2 = new THREE.Mesh(capG, capM); c2.position.y = -h * 0.47; g.add(c2);
  // cord
  const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.003, 0.2, 6), capM); cord.position.y = h * 0.5 + 0.1; g.add(cord);
  g.userData.mat = mat;
  return g;
}

function sagPlane(w, d, sx, sz, sag, mat) {
  const g = new THREE.PlaneGeometry(w, d, sx, sz);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i);
    const fx = Math.sin((x / w + 0.5) * Math.PI * 4) * 0.5 + 0.5;
    p.setZ(i, -sag * Math.sin((y / d + 0.5) * Math.PI) * (0.5 + 0.5 * fx));
  }
  g.computeVertexNormals();
  return new THREE.Mesh(g, mat);
}

export function buildStall(scene) {
  const S = {};
  const grp = new THREE.Group(); scene.add(grp);
  // ground
  const gm = new THREE.MeshStandardMaterial({ ...pbr('gravel', 14), roughness: 1, normalScale: new THREE.Vector2(1.2, 1.2) });
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), gm);
  ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; grp.add(ground);
  // wood materials (counter, posts)
  const wood = new THREE.MeshPhysicalMaterial({ ...pbr('wood', 1), roughness: 1, clearcoat: 0.15, clearcoatRoughness: 0.5 });
  const woodD = new THREE.MeshStandardMaterial({ ...pbr('wooddark', 1), roughness: 1 });
  S.wood = wood; S.woodD = woodD;
  // counter: top board + front panel + legs
  const top = woodBox(2.5, 0.045, 0.72, wood, 0.008, 0.9);
  top.position.set(0, 0.8 - 0.0225, -0.3); grp.add(top);
  const front = woodBox(2.4, 0.74, 0.03, woodD, 0.006, 1.2);
  front.position.set(0, 0.39, 0.02); grp.add(front);
  // front skirt cloth (indigo, gathered)
  const skirtM = new THREE.MeshPhysicalMaterial({ ...pbr('pants', [6, 2]), color: 0x4a5a8a, roughness: 1, sheen: 0.6, sheenColor: new THREE.Color(0.3, 0.35, 0.5), side: THREE.DoubleSide });
  const sg = new THREE.PlaneGeometry(2.42, 0.62, 120, 6);
  const sp = sg.attributes.position;
  for (let i = 0; i < sp.count; i++) { const x = sp.getX(i), y = sp.getY(i); sp.setZ(i, 0.012 * Math.sin(x * 46) * (0.6 + 0.4 * (0.31 - y) / 0.62) + 0.006 * Math.sin(x * 113)); }
  sg.computeVertexNormals();
  const kohaku = new THREE.MeshPhysicalMaterial({ ...pbr('canopy', [2.6, 1]), roughness: 1, sheen: 0.6, sheenColor: new THREE.Color(0.6, 0.4, 0.4), side: THREE.DoubleSide });
  const skirt = new THREE.Mesh(sg, kohaku); skirt.position.set(0, 0.42, 0.045); grp.add(skirt);
  // posts
  for (const x of [-1.28, 1.28]) for (const z of [0.12, -1.45]) {
    const p = woodBox(0.075, 2.35, 0.075, woodD, 0.01, 1.5); p.position.set(x, 1.175, z); grp.add(p);
  }
  // front beam
  const beam = woodBox(2.7, 0.08, 0.08, woodD, 0.01, 1.5); beam.position.set(0, 2.26, 0.12); grp.add(beam);
  // canopy (sloping tarp) + front valance
  const cm = new THREE.MeshPhysicalMaterial({ ...pbr('canopy', [3, 2]), roughness: 1, sheen: 0.5, sheenColor: new THREE.Color(0.6, 0.3, 0.3), side: THREE.DoubleSide });
  const canopy = sagPlane(2.75, 1.75, 40, 20, 0.05, cm);
  canopy.rotation.x = -Math.PI / 2 + 0.1; canopy.position.set(0, 2.36, -0.66); grp.add(canopy);
  const vg = new THREE.PlaneGeometry(2.8, 0.3, 140, 4);
  const vp = vg.attributes.position;
  for (let i = 0; i < vp.count; i++) {
    const x = vp.getX(i), y = vp.getY(i);
    // scalloped hem
    const sc = 0.04 * (1 - Math.abs(Math.sin(x * Math.PI / 0.35)));
    if (y < -0.1) vp.setY(i, y + sc);
    vp.setZ(i, 0.01 * Math.sin(x * 30) + 0.006 * Math.sin(x * 77));
  }
  vg.computeVertexNormals();
  const val = new THREE.Mesh(vg, cm); val.position.set(0, 2.2, 0.17); grp.add(val);
  // back wall: hanging indigo cloth and a shelf
  const backM = new THREE.MeshPhysicalMaterial({ ...pbr('cloth2', [4, 3]), color: 0xd8c8b0, roughness: 1, sheen: 0.5, sheenColor: new THREE.Color(0.6, 0.5, 0.4), side: THREE.DoubleSide });
  const back = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 2.3, 60, 4), backM);
  const bp = back.geometry.attributes.position;
  for (let i = 0; i < bp.count; i++) bp.setZ(i, 0.02 * Math.sin(bp.getX(i) * 9) + 0.008 * Math.sin(bp.getX(i) * 31));
  back.geometry.computeVertexNormals();
  back.position.set(0, 1.15, -1.48); grp.add(back);
  const shelf = woodBox(2.3, 0.035, 0.28, wood, 0.006, 0.9); shelf.position.set(0, 1.28, -1.33); grp.add(shelf);
  // things on the back shelf: kraft sugar sacks, steel canisters, a kettle, a bundle of sticks
  const kraft = new THREE.MeshPhysicalMaterial({ ...pbr('cloth2', [2, 2]), color: 0xb88a5a, roughness: 1, sheen: 0.3, sheenColor: new THREE.Color(0.5, 0.4, 0.3) });
  for (const [x, s] of [[-0.95, 1], [-0.72, 0.85]]) {
    const sack = new THREE.Mesh(loftGeo([
      { y: 0, rx: 0.1 * s, rz: 0.065 * s, p: 3, capBulge: 0 }, { y: 0.06 * s, rx: 0.112 * s, rz: 0.078 * s, p: 3.2 },
      { y: 0.2 * s, rx: 0.11 * s, rz: 0.074 * s, p: 3.2 }, { y: 0.25 * s, rx: 0.108 * s, rz: 0.05 * s, p: 3.6 }, { y: 0.275 * s, rx: 0.106 * s, rz: 0.018, p: 4, capBulge: 0.004 },
    ], 36, { capStart: true, capEnd: true, disp: (v, a) => 0.035 * Math.sin(a * 5 + v * 8) * v + 0.018 * Math.sin(a * 13) + 0.01 * Math.sin(a * 29 + v * 17) }), kraft);
    sack.position.set(x, 1.3, -1.36); sack.rotation.y = x; grp.add(sack);
  }
  const steelS = new THREE.MeshPhysicalMaterial({ ...pbr('steel', 1, { metal: true }), color: 0xc8ccd0, metalness: 1, roughness: 1, envMapIntensity: 2 });
  for (let i = 0; i < 3; i++) {
    const can = new THREE.Mesh(latheGeo([[0, 0], [0.06, 0], [0.062, 0.005], [0.062, 0.16], [0.058, 0.165], [0.058, 0.17], [0, 0.17]], 32), steelS);
    can.position.set(0.45 + i * 0.15, 1.3, -1.36); grp.add(can);
  }
  const kettle = new THREE.Mesh(latheGeo([[0, 0], [0.1, 0], [0.12, 0.04], [0.12, 0.12], [0.08, 0.17], [0.03, 0.18], [0.03, 0.2], [0, 0.2]], 36), steelS);
  kettle.position.set(0.98, 1.3, -1.34); grp.add(kettle);
  const spout = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.02, 0.14, 12), steelS); spout.position.set(1.08, 1.4, -1.3); spout.rotation.z = -0.9; grp.add(spout);
  const bundle = new THREE.Group();
  for (let i = 0; i < 40; i++) { const st = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.003, 0.34, 5), new THREE.MeshStandardMaterial({ ...pbr('wood', [0.05, 1]), color: 0xf0d8b0, roughness: 1 })); const a = Math.random() * 6.28, r = Math.sqrt(Math.random()) * 0.025; st.position.set(Math.cos(a) * r, 0.0, Math.sin(a) * r); st.rotation.z = Math.PI / 2; bundle.add(st); }
  bundle.position.set(0.1, 1.33, -1.3); bundle.rotation.y = 0.2; grp.add(bundle);
  const band = new THREE.Mesh(new THREE.TorusGeometry(0.03, 0.004, 6, 20), new THREE.MeshStandardMaterial({ color: 0xa02020, roughness: 0.6 })); band.position.copy(bundle.position); band.rotation.y = Math.PI / 2 + 0.2; grp.add(band);
  // crate (the girl stands on it)
  const crate = woodBox(0.6, 0.3, 0.38, woodD, 0.01, 1.2); crate.position.set(0.02, 0.15, -0.78); grp.add(crate);
  // lanterns along the beam
  S.lanterns = [];
  const xs = [-1.08, -0.65, -0.22, 0.22, 0.65, 1.08];
  xs.forEach((x, i) => {
    const l = chochin(i % 2 ? 0xe9dccb : 0xc8322a);
    l.position.set(x, 2.02, 0.22); grp.add(l); S.lanterns.push(l);
  });
  // bare bulb + cord + small shade
  const bulbM = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffd7a0, emissiveIntensity: 6 });
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.03, 16, 12), bulbM); bulb.scale.y = 1.25;
  bulb.position.set(0.05, 1.99, 0.12); grp.add(bulb);
  const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.003, 0.32, 6), new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.5 }));
  cord.position.set(0.05, 2.17, 0.12); grp.add(cord);
  const shade = new THREE.Mesh(latheGeo([[0.005, 0.04], [0.04, 0.03], [0.09, -0.02], [0.092, -0.025]], 32), new THREE.MeshStandardMaterial({ ...pbr('steel', 1, { metal: true }), color: 0x9aa0a6, metalness: 1, roughness: 1, side: THREE.DoubleSide }));
  shade.position.set(0.05, 2.05, 0.12); grp.add(shade);
  S.bulb = bulb;
  // hook for the happi on the right post
  const hook = new THREE.Mesh(new THREE.TorusGeometry(0.03, 0.005, 8, 16, Math.PI * 1.3), new THREE.MeshStandardMaterial({ color: 0x3a3a3a, metalness: 1, roughness: 0.4 }));
  hook.position.set(1.23, 1.68, 0.17); hook.rotation.set(0, Math.PI / 2, 0); grp.add(hook);
  S.hookPos = V(1.23, 1.66, 0.2);

  // neighbour stalls (left / right), simpler, darker, slightly out of focus by distance
  for (const sx of [-1, 1]) {
    const ng = new THREE.Group(); ng.position.set(sx * 3.4, 0, -0.6); grp.add(ng);
    const t2 = woodBox(2.4, 0.05, 0.7, wood, 0.008, 0.9); t2.position.set(0, 0.8, 0); ng.add(t2);
    const f2 = woodBox(2.3, 0.75, 0.03, woodD, 0.006, 1.2); f2.position.set(0, 0.39, 0.33); ng.add(f2);
    for (const x of [-1.2, 1.2]) { const p = woodBox(0.07, 2.3, 0.07, woodD, 0.01, 1.5); p.position.set(x, 1.15, 0.35); ng.add(p); }
    const c2 = sagPlane(2.6, 1.6, 20, 10, 0.05, sx > 0 ? new THREE.MeshStandardMaterial({ ...pbr('canopy', [3, 2]), color: 0x6a8ab0, side: THREE.DoubleSide }) : cm);
    c2.rotation.x = -Math.PI / 2 + 0.1; c2.position.set(0, 2.3, -0.4); ng.add(c2);
    for (let i = 0; i < 4; i++) { const l = chochin(i % 2 ? 0xe9dccb : 0xc8322a, 0.3, 0.11); l.position.set(-0.9 + i * 0.6, 2.0, 0.42); ng.add(l); }
    // goods on the neighbour counters: rows of glass bottles (ramune-like, no labels)
    const bm = new THREE.MeshPhysicalMaterial({ color: 0x9fd6d0, roughness: 0.05, transmission: 0, transparent: true, opacity: 0.55, clearcoat: 1 });
    for (let i = 0; i < 10; i++) { const b = new THREE.Mesh(latheGeo([[0, 0], [0.03, 0], [0.032, 0.01], [0.032, 0.13], [0.02, 0.17], [0.012, 0.2], [0.013, 0.23], [0, 0.23]], 16), bm); b.position.set(-0.8 + i * 0.17, 0.825, 0.05); ng.add(b); }
  }
  // string lights across the street (catenary) in mid distance
  const bulbM2 = new THREE.MeshBasicMaterial({ color: new THREE.Color(1, 0.75, 0.45).multiplyScalar(3) });
  const wireM = new THREE.LineBasicMaterial({ color: 0x0b0a0a });
  for (const z of [-3.5, -6]) {
    const pts = [];
    for (let i = 0; i <= 40; i++) { const x = -7 + i * 0.35; const y = 3.4 - 0.5 * Math.sin(i / 40 * Math.PI) * 0.9 + 0.12 * Math.sin(i / 40 * Math.PI * 3); pts.push(V(x, y, z)); }
    grp.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), wireM));
    const inst = new THREE.InstancedMesh(new THREE.SphereGeometry(0.035, 8, 6), bulbM2, 40);
    for (let i = 0; i < 40; i++) inst.setMatrixAt(i, M4([pts[i].x, pts[i].y - 0.05, pts[i].z]));
    grp.add(inst);
  }
  // far backdrop (photographic bokeh of the festival street)
  const bdTex = tex('backdrop', 1, true); bdTex.wrapS = bdTex.wrapT = THREE.ClampToEdgeWrapping;
  const bd = new THREE.Mesh(new THREE.PlaneGeometry(60, 30), new THREE.MeshBasicMaterial({ map: bdTex, color: 0xffffff, fog: false }));
  bd.position.set(0, 5.5, -18); grp.add(bd);
  S.backdrop = bd;
  // soft contact shadows helper texture
  S.blob = canvasTex(128, 128, (g, w, h) => {
    g.fillStyle = '#000'; g.fillRect(0, 0, w, h);
    const gr = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    gr.addColorStop(0, '#c0c0c0'); gr.addColorStop(0.45, '#5a5a5a'); gr.addColorStop(1, '#000');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
  }, false);
  grp.traverse(o => { if (o.isMesh && !o.isInstancedMesh && o !== bd) { o.castShadow = o !== ground; o.receiveShadow = true; } });
  S.grp = grp;
  return S;
}

// a soft dark blob on a surface (ambient occlusion where things touch)
export function contactShadow(S, w, d, opacity = 0.6) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshBasicMaterial({ map: S.blob, transparent: true, depthWrite: false, opacity, color: 0x000000, alphaMap: S.blob }));
  m.material.map = null;
  m.rotation.x = -Math.PI / 2;
  m.renderOrder = 1;
  return m;
}
