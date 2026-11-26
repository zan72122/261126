// HDR-like environment maps generated from small emissive "rooms" (PMREM).
import * as THREE from 'three';

function envScene(kind) {
  const s = new THREE.Scene();
  const geo = new THREE.BoxGeometry(1, 1, 1);
  const room = new THREE.Mesh(new THREE.BoxGeometry(10, 5, 10), new THREE.MeshBasicMaterial({ side: THREE.BackSide, color: 0xffffff }));
  room.position.y = 2.5;
  const add = (col, pos, scale) => { const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: col })); m.position.copy(pos); m.scale.copy(scale); s.add(m); return m; };
  if (kind === 'lit') {
    room.material.color.setRGB(0.20, 0.15, 0.10);   // warm plaster lit by tungsten
    s.add(room);
    add(new THREE.Color(0.08, 0.05, 0.03), new THREE.Vector3(0, 0.01, 0), new THREE.Vector3(10, 0.02, 10)); // wood floor
    add(new THREE.Color(9, 6.2, 3.6), new THREE.Vector3(0, 3.2, 0), new THREE.Vector3(0.6, 0.3, 0.6));     // pendant
    add(new THREE.Color(0.35, 0.27, 0.18), new THREE.Vector3(0, 4.95, 0), new THREE.Vector3(6, 0.05, 6));   // lit ceiling
    add(new THREE.Color(0.03, 0.05, 0.1), new THREE.Vector3(1, 2, -4.95), new THREE.Vector3(1.4, 1.6, 0.05)); // night window
    add(new THREE.Color(2.0, 1.3, 0.7), new THREE.Vector3(4.9, 1.6, 2), new THREE.Vector3(0.1, 0.8, 0.8));     // floor lamp
  } else if (kind === 'dark') {
    room.material.color.setRGB(0.012, 0.010, 0.012);
    s.add(room);
    add(new THREE.Color(0.05, 0.08, 0.16), new THREE.Vector3(1, 2, -4.95), new THREE.Vector3(1.4, 1.6, 0.05)); // moonlit window
    add(new THREE.Color(0.5, 0.25, 0.08), new THREE.Vector3(0, 1.0, 0), new THREE.Vector3(0.4, 0.4, 0.4));     // lantern glow
    add(new THREE.Color(0.06, 0.035, 0.02), new THREE.Vector3(0, 4.95, 0), new THREE.Vector3(5, 0.05, 5));
  } else {
    // garden night: deep blue sky dome, dark ground, warm house light
    room.material.color.setRGB(0.012, 0.018, 0.035);
    s.add(room);
    add(new THREE.Color(0.03, 0.05, 0.1), new THREE.Vector3(0, 4.9, 0), new THREE.Vector3(10, 0.1, 10));
    add(new THREE.Color(0.012, 0.012, 0.008), new THREE.Vector3(0, 0.01, 0), new THREE.Vector3(10, 0.02, 10));
    add(new THREE.Color(1.6, 1.0, 0.5), new THREE.Vector3(0, 1.4, -4.9), new THREE.Vector3(1.5, 1.5, 0.1));
    add(new THREE.Color(0.6, 0.65, 0.8), new THREE.Vector3(3, 4.5, -3), new THREE.Vector3(0.5, 0.5, 0.5));
  }
  return s;
}

export function makeEnvMaps(renderer) {
  const pm = new THREE.PMREMGenerator(renderer);
  const out = {};
  for (const k of ['lit', 'dark', 'garden']) out[k] = pm.fromScene(envScene(k), 0.035).texture;
  pm.dispose();
  return out;
}
