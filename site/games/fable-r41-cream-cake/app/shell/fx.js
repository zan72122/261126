// Particles: hearts, sparkle stars / confetti, puffs (smoke, wind). Billboarded instanced quads, 3 draw calls.
import { THREE } from './util.js';

export class Fx {
  constructor(scene, assets, camera, capacity) {
    this.camera = camera;
    this.cap = capacity;
    const quad = new THREE.PlaneGeometry(1, 1);
    this.kinds = {};
    for (const key of ['heart', 'star', 'puff']) {
      const mat = new THREE.MeshBasicMaterial({ map: assets.tex[key], transparent: true, depthWrite: false, alphaTest: 0.02 });
      const mesh = new THREE.InstancedMesh(quad, mat, capacity);
      mesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(capacity * 3), 3);
      mesh.count = 0; mesh.frustumCulled = false; mesh.renderOrder = 5;
      scene.add(mesh);
      this.kinds[key] = { mesh, list: [] };
    }
    this._m = new THREE.Matrix4(); this._q = new THREE.Quaternion(); this._qz = new THREE.Quaternion();
    this._v = new THREE.Vector3(); this._s = new THREE.Vector3(); this._z = new THREE.Vector3(0, 0, 1); this._c = new THREE.Color();
  }

  emit(key, pos, { n = 6, speed = 1.5, up = 1.5, size = 0.3, life = 1.0, gravity = -1.5, colors = [0xffffff], spread = 0.2, dir = null } = {}) {
    const k = this.kinds[key];
    for (let i = 0; i < n; i++) {
      if (k.list.length >= this.cap) k.list.shift();
      const a = Math.random() * Math.PI * 2, s = speed * (0.4 + Math.random() * 0.6);
      const p = {
        x: pos.x + (Math.random() - 0.5) * spread, y: pos.y + (Math.random() - 0.5) * spread, z: pos.z + (Math.random() - 0.5) * spread,
        vx: Math.cos(a) * s, vy: up * (0.6 + Math.random() * 0.6), vz: Math.sin(a) * s,
        life, age: 0, size: size * (0.7 + Math.random() * 0.6), g: gravity,
        spin: (Math.random() - 0.5) * 6, rot: Math.random() * 6, color: colors[i % colors.length],
      };
      if (dir) { p.vx = dir.x * (0.7 + Math.random() * 0.6) + (Math.random() - 0.5) * 0.4; p.vy = dir.y + (Math.random() - 0.5) * 0.3; p.vz = dir.z * (0.7 + Math.random() * 0.6); }
      k.list.push(p);
    }
  }

  update(dt) {
    const cq = this.camera.quaternion;
    for (const key in this.kinds) {
      const k = this.kinds[key];
      let w = 0;
      for (let i = 0; i < k.list.length; i++) {
        const p = k.list[i];
        p.age += dt;
        if (p.age >= p.life) continue;
        p.vy += p.g * dt;
        p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt;
        p.vx *= 1 - 1.2 * dt; p.vz *= 1 - 1.2 * dt;
        p.rot += p.spin * dt;
        const t = p.age / p.life;
        const sc = Math.max(1e-3, p.size * (key === 'puff' ? (0.5 + t) * (1 - t * t * t) : Math.min(1, t * 6) * (1 - t * t)));
        this._qz.setFromAxisAngle(this._z, p.rot);
        this._q.copy(cq).multiply(this._qz);
        this._m.compose(this._v.set(p.x, p.y, p.z), this._q, this._s.set(sc, sc, sc));
        k.mesh.setMatrixAt(w, this._m);
        this._c.setHex(p.color); k.mesh.instanceColor.setXYZ(w, this._c.r, this._c.g, this._c.b);
        k.list[w++] = p;
      }
      const was = k.mesh.count;
      k.list.length = w;
      k.mesh.count = w;
      if (w || was) { k.mesh.instanceMatrix.needsUpdate = true; k.mesh.instanceColor.needsUpdate = true; } // no re-upload while idle
    }
  }

  clear() { for (const key in this.kinds) { this.kinds[key].list.length = 0; this.kinds[key].mesh.count = 0; } }
}
