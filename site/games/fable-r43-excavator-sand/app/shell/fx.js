// 演出用の粒（InstancedMesh 1種につき draw call 1）：ハート・紙吹雪・きらきら・砂の流れ。
import * as THREE from '../vendor/three/three.module.js';
import { heartShape } from './assets.js';

class Particles {
  constructor(parent, geo, mat, max, { gravity = -9.8, drag = 0, billboard = false, spin = 0, colors = null } = {}) {
    this.geo = geo; this.mat = mat; this.max = max;
    this.mesh = new THREE.InstancedMesh(geo, mat, max);
    this.mesh.count = 0;
    this.mesh.frustumCulled = false;
    this.mesh.name = 'fx';
    if (colors) this.mesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(max * 3), 3);
    parent.add(this.mesh);
    this.gravity = gravity; this.drag = drag; this.billboard = billboard; this.spin = spin;
    this.p = []; // {pos, vel, life, age, size, rot, rotV, floor}
    this._m = new THREE.Matrix4(); this._q = new THREE.Quaternion(); this._s = new THREE.Vector3(); this._e = new THREE.Euler();
  }
  emit(pos, vel, life, size, color, floor = -Infinity) {
    if (this.p.length >= this.max) this.p.shift();
    const rot = new THREE.Euler(Math.random() * 6, Math.random() * 6, Math.random() * 6);
    this.p.push({ pos: pos.clone(), vel: vel.clone(), life, age: 0, size, rot, rotV: (Math.random() - 0.5) * this.spin, color, floor });
  }
  update(dt, camera) {
    const arr = this.p;
    let n = 0;
    for (let i = 0; i < arr.length; i++) {
      const q = arr[i];
      q.age += dt;
      if (q.age >= q.life) continue;
      q.vel.y += this.gravity * dt;
      if (this.drag) q.vel.multiplyScalar(Math.max(0, 1 - this.drag * dt));
      q.pos.addScaledVector(q.vel, dt);
      if (q.pos.y < q.floor) { q.age = q.life; continue; }
      q.rot.x += q.rotV * dt; q.rot.y += q.rotV * 0.7 * dt;
      arr[n++] = q;
    }
    arr.length = n;
    for (let i = 0; i < n; i++) {
      const q = arr[i];
      const t = q.age / q.life;
      const s = Math.max(1e-3, q.size * Math.min(1, q.age * 10) * (t > 0.7 ? (1 - t) / 0.3 : 1));
      if (this.billboard) this._q.copy(camera.quaternion);
      else this._q.setFromEuler(q.rot);
      this._s.set(s, s, s);
      this._m.compose(q.pos, this._q, this._s);
      this.mesh.setMatrixAt(i, this._m);
      if (this.mesh.instanceColor && q.color) this.mesh.setColorAt(i, q.color);
    }
    this.mesh.count = n;
    this.mesh.instanceMatrix.needsUpdate = true;
    if (this.mesh.instanceColor) this.mesh.instanceColor.needsUpdate = true;
  }
  dispose() { this.mesh.removeFromParent(); this.mesh.dispose?.(); }
}

export function createFx(scene, tier, sandTex) {
  const group = new THREE.Group();
  group.name = 'fx';
  scene.add(group);
  const disposables = [];
  const keep = (x) => { disposables.push(x); return x; };

  const heartGeo = keep(new THREE.ExtrudeGeometry(heartShape(), { depth: 0.18, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.06, bevelSegments: 2, curveSegments: 8 }));
  heartGeo.center();
  const hearts = new Particles(group, heartGeo, keep(new THREE.MeshLambertMaterial({ color: 0xff5f93, emissive: 0x7a1030 })), 12, { gravity: 0.6, drag: 1.2, billboard: true });

  const grainGeo = keep(new THREE.IcosahedronGeometry(1, 0));
  const sand = new Particles(group, grainGeo, keep(new THREE.MeshLambertMaterial({ color: 0xd9b27a, map: sandTex })), 140, { gravity: -6.5, spin: 6 });

  const starGeo = keep(new THREE.OctahedronGeometry(1, 0));
  const stars = new Particles(group, starGeo, keep(new THREE.MeshBasicMaterial({ color: 0xfff27a })), 40, { gravity: -0.4, drag: 2.5, spin: 8 });

  let confetti = null; // 必要になった時に作る
  const confettiColors = [0xff5c9e, 0x3d8bff, 0xffd84a, 0x55d17a, 0xff8a1e, 0xb67cff].map((c) => new THREE.Color(c));

  const v = new THREE.Vector3(), p = new THREE.Vector3();
  const rnd = (a, b) => a + Math.random() * (b - a);

  return {
    group,
    heartBurst(pos, n = 5) {
      for (let i = 0; i < n; i++) {
        v.set(rnd(-0.35, 0.35), rnd(0.5, 0.9), rnd(-0.2, 0.2));
        hearts.emit(p.copy(pos).add(new THREE.Vector3(rnd(-0.1, 0.1), rnd(0, 0.1), 0)), v, rnd(1.4, 1.9), rnd(0.07, 0.11));
      }
    },
    starBurst(pos, n = 12, speed = 1.2) {
      for (let i = 0; i < n; i++) {
        v.set(rnd(-1, 1), rnd(0.2, 1.2), rnd(-1, 1)).normalize().multiplyScalar(speed * rnd(0.5, 1));
        stars.emit(pos, v, rnd(0.6, 1.0), rnd(0.015, 0.03));
      }
    },
    sandPour(from, dir, floorY, n = 3) {
      for (let i = 0; i < n; i++) {
        v.copy(dir).multiplyScalar(rnd(0.5, 0.9)).add(new THREE.Vector3(rnd(-0.12, 0.12), rnd(-0.05, 0.1), rnd(-0.12, 0.12)));
        p.copy(from).add(new THREE.Vector3(rnd(-0.12, 0.12), rnd(-0.02, 0.02), rnd(-0.12, 0.12)));
        sand.emit(p, v, 1.2, rnd(0.012, 0.022), null, floorY);
      }
    },
    sandPuff(pos, n = 14) {
      for (let i = 0; i < n; i++) {
        v.set(rnd(-1, 1), rnd(0.6, 1.4), rnd(-1, 1)).multiplyScalar(0.7);
        sand.emit(pos, v, 0.8, rnd(0.01, 0.018), null, pos.y - 0.05);
      }
    },
    confettiBurst(pos, n = 120) {
      if (!confetti) {
        const g = keep(new THREE.PlaneGeometry(0.035, 0.05));
        confetti = new Particles(group, g, keep(new THREE.MeshLambertMaterial({ side: THREE.DoubleSide })), 160, { gravity: -1.4, drag: 1.6, spin: 10, colors: true });
      }
      for (let i = 0; i < n; i++) {
        v.set(rnd(-1.4, 1.4), rnd(2.2, 3.6), rnd(-1.4, 1.4));
        confetti.emit(pos, v, rnd(2.2, 3.2), 1, confettiColors[i % confettiColors.length]);
      }
    },
    update(dt, camera) {
      hearts.update(dt, camera); sand.update(dt, camera); stars.update(dt, camera);
      if (confetti) confetti.update(dt, camera);
    },
    dispose() {
      [hearts, sand, stars, confetti].forEach((x) => x && x.dispose());
      for (const d of disposables) d.dispose();
      scene.remove(group);
    },
  };
}
