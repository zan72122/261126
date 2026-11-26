// Late-autumn 3 p.m. light: low warm sun through the left shop window, cool sky fill,
// warm 2700K pendant bulbs inside. The environment map is rendered from a simplified
// HDR copy of the actual room so reflections (chocolate gloss, eyes, steel) match the scene.
import * as THREE from 'three';

export function kelvin(k) {
  // Tanner Helland approximation -> linear-ish THREE.Color
  const t = k / 100; let r, g, b;
  if (t <= 66) { r = 255; g = 99.4708025861 * Math.log(t) - 161.1195681661; b = t <= 19 ? 0 : 138.5177312231 * Math.log(t - 10) - 305.0447927307; }
  else { r = 329.698727446 * Math.pow(t - 60, -0.1332047592); g = 288.1221695283 * Math.pow(t - 60, -0.0755148492); b = 255; }
  const c = new THREE.Color();
  c.setRGB(Math.min(255, Math.max(0, r)) / 255, Math.min(255, Math.max(0, g)) / 255, Math.min(255, Math.max(0, b)) / 255, THREE.SRGBColorSpace);
  return c;
}

export function buildEnvironment(renderer) {
  const s = new THREE.Scene();
  const box = new THREE.BoxGeometry(1, 1, 1);
  const em = (c, i) => new THREE.MeshBasicMaterial({ color: new THREE.Color(c).multiplyScalar(i), side: THREE.BackSide });
  const emF = (c, i) => new THREE.MeshBasicMaterial({ color: new THREE.Color(c).multiplyScalar(i) });
  // room shell (shop is ~6 x 2.8 x 5 m)
  const room = new THREE.Mesh(box, [em(0xd9cfc2, 0.55), em(0xd9cfc2, 0.5), em(0xece6de, 0.5), em(0x5a3a24, 0.32), em(0xe0d6ca, 0.55), em(0xd9cfc2, 0.5)]);
  room.scale.set(6, 2.8, 5); room.position.y = 1.4; s.add(room);
  // window on the left wall (-x): sky + sunlit street
  const win = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 1.6), emF(kelvin(7500), 4.2));
  win.position.set(-2.98, 1.45, -0.2); win.rotation.y = Math.PI / 2; s.add(win);
  const sunPatch = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.0), emF(kelvin(4300), 7));
  sunPatch.position.set(-1.2, 0.01, 0.2); sunPatch.rotation.x = -Math.PI / 2; s.add(sunPatch);
  // shop front glass (+z)
  const front = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 1.8), emF(kelvin(6800), 2.2));
  front.position.set(0.6, 1.3, 2.48); front.rotation.y = Math.PI; s.add(front);
  // pendant bulbs
  for (const x of [-1.2, 0, 1.2]) {
    const b = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 8), emF(kelvin(2700), 28));
    b.position.set(x, 2.05, 0.0); s.add(b);
  }
  // dark wooden counters / shelves as darker bands
  const shelf = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.9, 0.6), emF(0x3a2416, 0.25));
  shelf.position.set(0, 0.45, -2.2); s.add(shelf);
  const pm = new THREE.PMREMGenerator(renderer);
  const rt = pm.fromScene(s, 0.035, 0.1, 20);
  pm.dispose();
  return rt.texture;
}

export function buildLights(scene) {
  const sunCol = kelvin(4300);
  const sun = new THREE.DirectionalLight(sunCol, 5.2);
  // sun from the left window, low (~25 deg) afternoon
  sun.position.set(-4.2, 2.6, 1.0);
  sun.target.position.set(0.2, 0.9, -0.3);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  const sc = sun.shadow.camera;
  sc.left = -2.6; sc.right = 2.6; sc.top = 2.2; sc.bottom = -1.6; sc.near = 0.5; sc.far = 9;
  sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.02;
  sun.shadow.radius = 5; sun.shadow.blurSamples = 12;
  scene.add(sun, sun.target);

  const hemi = new THREE.HemisphereLight(kelvin(8000), new THREE.Color(0x6a4a34), 0.35);
  scene.add(hemi);

  // warm interior pendants (point lights) - only two to keep the cost low on phones
  const bulbs = [];
  for (const x of [-0.6, 0.9]) {
    const p = new THREE.PointLight(kelvin(2700), 3.2, 6, 2);
    p.position.set(x, 2.0, 0.05);
    scene.add(p); bulbs.push(p);
  }
  // soft key from the front glass (camera side) so faces never sink into shadow
  const fill = new THREE.DirectionalLight(kelvin(6500), 0.9);
  fill.position.set(1.0, 1.8, 3.5); fill.target.position.set(0, 1.0, -0.5);
  scene.add(fill, fill.target);
  return { sun, hemi, bulbs, fill };
}
