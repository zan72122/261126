// Hand props: wire brush, cotton rag, small oil can, dad's big oil can, folded coveralls + gloves, a crate.
import * as THREE from 'three';
import { tex, pbr, aoBlob } from './tex.js';
import { roundBox, pill, latheProfile, LiveTube, deformedSphere } from './geo.js';

const brass = () => new THREE.MeshPhysicalMaterial({ color: 0xb08d57, metalness: 1, roughness: 0.3, normalMap: tex('rust_msk', { repeat: [2, 2] }), normalScale: new THREE.Vector2(0.08, 0.08), clearcoat: 0.2 });

export function makeBrush() {
  const g = new THREE.Group();
  const wood = pbr('timber', { arm: true, repeat: [0.6, 0.2] }); wood.color.set(0xc49a6c);
  const block = new THREE.Mesh(roundBox(0.11, 0.022, 0.036, 0.009, 200), wood); block.position.y = 0.03; block.castShadow = true; g.add(block);
  const handle = new THREE.Mesh(pill(0.12, 0.012, 0.01, 20, 20), wood); handle.rotation.z = Math.PI / 2; handle.position.set(0.17, 0.045, 0); handle.rotation.y = 0; handle.castShadow = true; g.add(handle);
  handle.rotation.set(0, 0, -Math.PI / 2 - 0.25); handle.position.set(0.05, 0.04, 0);
  const steel = new THREE.MeshPhysicalMaterial({ color: 0xb8b8b8, metalness: 1, roughness: 0.35 });
  const n = 220, im = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.0007, 0.0007, 0.02, 4), steel, n);
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler();
  for (let i = 0; i < n; i++) { e.set((Math.random() - 0.5) * 0.25, 0, (Math.random() - 0.5) * 0.25); q.setFromEuler(e); m.compose(new THREE.Vector3((Math.random() - 0.5) * 0.1, 0.01, (Math.random() - 0.5) * 0.03), q, new THREE.Vector3(1, 0.8 + Math.random() * 0.4, 1)); im.setMatrixAt(i, m); }
  im.castShadow = true; g.add(im);
  g.userData.glowMats = [wood];
  return g; // bristles point -y
}

export function makeRag() {
  const g = new THREE.Group();
  const geo = new THREE.PlaneGeometry(0.15, 0.13, 40, 36);
  const p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i); p.setZ(i, 0.006 * Math.sin(x * 70 + y * 20) + 0.004 * Math.sin(y * 90) - 0.015 * (x * x + y * y) * 30); }
  geo.computeVertexNormals();
  const m = new THREE.MeshPhysicalMaterial({ map: tex('knit_col', { srgb: true, repeat: [2, 2] }), normalMap: tex('knit_nrm', { repeat: [2, 2] }), color: 0xd09088, roughness: 0.95, sheen: 1, sheenColor: new THREE.Color(0.8, 0.7, 0.7), side: THREE.DoubleSide });
  const mesh = new THREE.Mesh(geo, m); mesh.rotation.x = -Math.PI / 2; mesh.castShadow = true; mesh.receiveShadow = true; g.add(mesh);
  // a bunched-up second layer
  const m2 = new THREE.Mesh(deformedSphere(1, 24, 16, (v) => v.set(v.x * 0.045 + Math.sin(v.y * 9) * 0.004, v.y * 0.018, v.z * 0.04 + Math.sin(v.x * 8) * 0.004)), m);
  m2.position.y = 0.012; m2.castShadow = true; g.add(m2);
  g.userData.glowMats = [m];
  return g;
}

function makeCan(r, h, bodyMat, spoutLen) {
  const g = new THREE.Group();
  const body = new THREE.Mesh(latheProfile(h, (t) => r * (t < 0.05 ? 0.92 + t * 1.6 : t > 0.75 ? 1 - (t - 0.75) * 2.4 : 1) * (t > 0.98 ? 0.4 : 1), 40, 48), bodyMat);
  body.castShadow = true; body.receiveShadow = true; g.add(body);
  const st = new LiveTube(20, 12, (s) => r * (0.16 - 0.09 * s));
  const pts = [new THREE.Vector3(0, h * 0.95, 0), new THREE.Vector3(0, h * 1.05, r * 0.3), new THREE.Vector3(0, h * 1.25, r * 0.3 + spoutLen * 0.5), new THREE.Vector3(0, h * 1.38, r * 0.3 + spoutLen)];
  st.update(pts);
  const spout = new THREE.Mesh(st.geo, bodyMat); spout.castShadow = true; g.add(spout);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(r * 0.98, r * 0.05, 8, 48), bodyMat); ring.rotation.x = Math.PI / 2; ring.position.y = h * 0.75; g.add(ring);
  g.userData.tip = pts[3].clone();
  return g;
}
export function makeOilCan() {
  const m = brass();
  const g = makeCan(0.038, 0.06, m, 0.1);
  const pump = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.02, 16), m); pump.position.set(0, 0.062, -0.012); g.add(pump);
  g.userData.glowMats = [m];
  return g;
}
export function makeBigCan() {
  const m = new THREE.MeshPhysicalMaterial({ color: 0x7a2e26, metalness: 0.4, roughness: 0.45, clearcoat: 0.6, clearcoatRoughness: 0.3, normalMap: tex('rust_msk', { repeat: [2, 2] }), normalScale: new THREE.Vector2(0.05, 0.05) });
  const g = makeCan(0.075, 0.14, m, 0.16);
  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.007, 10, 30, Math.PI), m); handle.position.set(0, 0.14, 0); handle.rotation.y = Math.PI / 2; g.add(handle);
  return g;
}

export function makeClothesPile() {
  const g = new THREE.Group();
  const crateM = pbr('timber', { arm: true, repeat: [1, 0.3] }); crateM.color.set(0xb08a64);
  const crate = new THREE.Mesh(roundBox(0.36, 0.2, 0.3, 0.012, 50), crateM); crate.position.y = 0.1; crate.castShadow = crate.receiveShadow = true; g.add(crate);
  g.add(aoBlob(0.55, 0.45, 0.7));
  const coverMat = new THREE.MeshPhysicalMaterial({ map: tex('twill_col', { srgb: true, repeat: [2, 2] }), normalMap: tex('twill_nrm', { repeat: [2, 2] }), roughness: 0.9, sheen: 0.6, sheenColor: new THREE.Color(0.6, 0.6, 0.6), color: 0x8fb0d6 });
  const cover = new THREE.Group(); cover.position.set(-0.03, 0.2, 0); g.add(cover);
  for (let i = 0; i < 3; i++) {
    const L = new THREE.Mesh(roundBox(0.24 - i * 0.02, 0.028, 0.2 - i * 0.01, 0.012, 140), coverMat);
    const p = L.geometry.attributes.position; for (let j = 0; j < p.count; j++) { if (p.getY(j) > 0) p.setY(j, p.getY(j) + 0.003 * Math.sin(p.getX(j) * 60) * Math.cos(p.getZ(j) * 40)); }
    L.geometry.computeVertexNormals();
    L.position.y = 0.014 + i * 0.026; L.rotation.y = (i - 1) * 0.04; L.castShadow = L.receiveShadow = true; cover.add(L);
  }
  // pocket + a button on top layer
  const pk = new THREE.Mesh(roundBox(0.06, 0.006, 0.05, 0.002, 200), coverMat); pk.position.set(0.04, 0.086, 0.02); cover.add(pk);
  const btn = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, 0.003, 20), new THREE.MeshPhysicalMaterial({ color: 0x7a6a52, metalness: 1, roughness: 0.35 })); btn.position.set(-0.05, 0.09, 0.05); cover.add(btn);
  const gloveM = new THREE.MeshPhysicalMaterial({ map: tex('canvas_col', { srgb: true, repeat: [2, 2] }), normalMap: tex('canvas_nrm', { repeat: [2, 2] }), color: 0xf0e6d2, roughness: 0.92, sheen: 0.8, sheenColor: new THREE.Color(0.9, 0.9, 0.85) });
  const gloves = new THREE.Group(); gloves.position.set(0.09, 0.2, 0.06); g.add(gloves);
  for (const s of [-1, 1]) {
    const gl = new THREE.Group(); gl.position.set(s * 0.035, 0.012 + (s > 0 ? 0.012 : 0), 0); gl.rotation.y = s * 0.3; gloves.add(gl);
    const palm = new THREE.Mesh(deformedSphere(1, 24, 16, (v) => v.set(v.x * 0.034, v.y * 0.011, v.z * 0.05)), gloveM); palm.castShadow = true; gl.add(palm);
    for (let i = 0; i < 4; i++) { const f = new THREE.Mesh(pill(0.034, 0.0075, 0.0068, 10, 10), gloveM); f.rotation.x = Math.PI / 2; f.position.set((i - 1.5) * 0.0155, 0, 0.035); f.castShadow = true; gl.add(f); }
    const th = new THREE.Mesh(pill(0.03, 0.008, 0.007, 10, 10), gloveM); th.rotation.set(Math.PI / 2, 0, s * 0.9); th.position.set(-s * 0.03, 0, 0.012); gl.add(th);
    const band = new THREE.Mesh(roundBox(0.07, 0.016, 0.02, 0.006, 150), new THREE.MeshPhysicalMaterial({ color: 0x9a3a32, roughness: 0.8, sheen: 0.5 })); band.position.set(0, 0, -0.055); gl.add(band);
  }
  g.userData = { cover, gloves, coverMat, gloveM, glowMats: { cover: [coverMat], gloves: [gloveM] } };
  return g;
}
