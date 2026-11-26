import * as THREE from 'three';

// Flag on the top of the hill (follows hero.getPeak()), and the joy effects (hearts / stars).

export function createFlag(shadows) {
  const root = new THREE.Group(); root.name = 'shell.flag';
  const inner = new THREE.Group(); root.add(inner);
  const poleMat = new THREE.MeshLambertMaterial({ color: 0xf2f2f2 });
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.045, 1.4, 12).translate(0, 0.7, 0), poleMat);
  const knob = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 8).translate(0, 1.42, 0), new THREE.MeshLambertMaterial({ color: 0xffd23f, emissive: 0xffc400, emissiveIntensity: 0.3 }));
  // triangular cloth with a few segments so it can wave
  const cloth = new THREE.BufferGeometry();
  const SEG = 6, pos = [], idx = [];
  for (let i = 0; i <= SEG; i++) {
    const u = i / SEG, h = 0.42 * (1 - u);
    pos.push(u * 0.75, 1.36 - (0.42 - h) / 2, 0, u * 0.75, 1.36 - (0.42 - h) / 2 - h, 0);
    if (i < SEG) { const a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
  }
  cloth.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  cloth.setIndex(idx); cloth.computeVertexNormals();
  const clothMat = new THREE.MeshLambertMaterial({ color: 0xff4f6d, side: THREE.DoubleSide, emissive: 0xff3050, emissiveIntensity: 0 });
  const flag = new THREE.Mesh(cloth, clothMat);
  inner.add(pole, knob, flag);
  root.traverse((o) => { if (o.isMesh) o.castShadow = shadows; });
  const base = cloth.attributes.position.array.slice();
  const pick = new THREE.Mesh(new THREE.BoxGeometry(1.3, 2.0, 1.3), new THREE.MeshBasicMaterial({ visible: false }));
  pick.position.y = 0.9; root.add(pick);

  const st = { t: 0, glow: 0, pop: 0, scale: 1 };
  return {
    root, pick,
    setGlow(v) { st.glow = v; },
    pop() { st.pop = 1; },
    setStage(stage) { st.scale = 1 + 0.12 * stage; },
    update(dt, target, hard) {
      st.t += dt;
      if (hard) root.position.copy(target); else root.position.lerp(target, Math.min(1, dt * 3));
      // wave the cloth
      const a = cloth.attributes.position.array;
      for (let i = 0; i < a.length; i += 3) { const u = base[i] / 0.75; a[i + 2] = Math.sin(st.t * 5 - u * 3) * 0.06 * u; }
      cloth.attributes.position.needsUpdate = true;
      st.pop = Math.max(0, st.pop - dt * 1.5);
      const s = st.scale * (1 + Math.sin(st.pop * Math.PI * 3) * 0.25 * st.pop);
      inner.scale.setScalar(s);
      inner.position.y = st.glow > 0 ? Math.max(0, Math.sin(st.t * 6)) * 0.12 * st.glow : 0;
      clothMat.emissiveIntensity = st.glow * (0.3 + 0.25 * Math.sin(st.t * 6));
    },
    dispose() { root.traverse((o) => { if (o.isMesh) { o.geometry.dispose(); o.material.dispose(); } }); if (root.parent) root.parent.remove(root); },
  };
}

function heartShape() {
  const s = new THREE.Shape();
  s.moveTo(0, -0.5);
  s.bezierCurveTo(-0.15, -0.3, -0.55, -0.1, -0.5, 0.2);
  s.bezierCurveTo(-0.45, 0.5, -0.1, 0.55, 0, 0.3);
  s.bezierCurveTo(0.1, 0.55, 0.45, 0.5, 0.5, 0.2);
  s.bezierCurveTo(0.55, -0.1, 0.15, -0.3, 0, -0.5);
  return s;
}
function starShape() {
  const s = new THREE.Shape();
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2 + Math.PI / 2, r = i % 2 ? 0.22 : 0.5;
    if (i === 0) s.moveTo(Math.cos(a) * r, Math.sin(a) * r); else s.lineTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  s.closePath();
  return s;
}

// Lazily created burst particles (InstancedMesh, billboards facing the camera).
export class Bursts {
  constructor(scene, camera) { this.scene = scene; this.camera = camera; this.sys = null; }
  _make() {
    const COUNT = 40;
    const mk = (shape) => {
      const geo = new THREE.ShapeGeometry(shape, 6);
      const mat = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, transparent: true, depthWrite: false, fog: false });
      const m = new THREE.InstancedMesh(geo, mat, COUNT);
      m.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(COUNT * 3), 3);
      m.frustumCulled = false; m.renderOrder = 5;
      this.scene.add(m);
      return { m, p: Array.from({ length: COUNT }, () => ({ life: 0 })), next: 0 };
    };
    this.sys = { heart: mk(heartShape()), star: mk(starShape()) };
    this.m4 = new THREE.Matrix4(); this.q = new THREE.Quaternion(); this.v = new THREE.Vector3(); this.s = new THREE.Vector3(); this.c = new THREE.Color();
  }
  emit(kind, pos, n, colors) {
    if (!this.sys) this._make();
    const S = this.sys[kind];
    for (let i = 0; i < n; i++) {
      const p = S.p[S.next]; S.next = (S.next + 1) % S.p.length;
      const a = Math.random() * Math.PI * 2, sp = 0.6 + Math.random() * 1.2;
      Object.assign(p, { life: 1.6 + Math.random() * 0.8, max: 2.4, x: pos.x, y: pos.y, z: pos.z, vx: Math.cos(a) * sp, vy: 1.8 + Math.random() * 1.6, vz: Math.sin(a) * sp * 0.6, size: 0.18 + Math.random() * 0.14, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 4 });
      this.c.set(colors[i % colors.length]);
      S.m.instanceColor.setXYZ((S.next + S.p.length - 1) % S.p.length, this.c.r, this.c.g, this.c.b);
    }
    S.m.instanceColor.needsUpdate = true;
  }
  update(dt) {
    if (!this.sys) return;
    this.q.copy(this.camera.quaternion);
    const roll = new THREE.Quaternion();
    for (const S of Object.values(this.sys)) {
      S.p.forEach((p, i) => {
        if (p.life > 0) {
          p.life -= dt; p.vy -= 1.2 * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt; p.rot += p.vr * dt;
          const k = Math.min(1, p.life / 0.5) * Math.min(1, (p.max - p.life) * 6 + 0.2);
          roll.setFromAxisAngle(this.v.set(0, 0, 1), Math.sin(p.rot) * 0.4);
          this.s.setScalar(p.size * Math.max(0, k));
          this.m4.compose(this.v.set(p.x, p.y, p.z), this.q.clone().multiply(roll), this.s);
        } else this.m4.makeScale(0, 0, 0);
        S.m.setMatrixAt(i, this.m4);
      });
      S.m.instanceMatrix.needsUpdate = true;
    }
  }
  dispose() {
    if (!this.sys) return;
    for (const S of Object.values(this.sys)) { this.scene.remove(S.m); S.m.geometry.dispose(); S.m.material.dispose(); S.m.dispose(); }
    this.sys = null;
  }
}

// A soft ring that opens on the snow where the finger lands: every touch shows at once that it was felt.
// One small mesh, reused; hidden when idle (0 draw calls).
export function createTouchRing(scene) {
  const geo = new THREE.RingGeometry(0.22, 0.34, 28).rotateX(-Math.PI / 2);
  const mat = new THREE.MeshBasicMaterial({ color: 0xfff3b0, transparent: true, opacity: 0, depthWrite: false, fog: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.name = 'shell.touchRing'; mesh.visible = false; mesh.renderOrder = 4;
  scene.add(mesh);
  let t = 1;
  return {
    show(x, y, z) { if (!Number.isFinite(x + y + z)) return; mesh.position.set(x, y + 0.04, z); t = 0; mesh.visible = true; },
    update(dt) {
      if (!mesh.visible) return;
      t += dt / 0.5;
      if (t >= 1) { mesh.visible = false; return; }
      mesh.scale.setScalar(1 + t * 1.6);
      mat.opacity = 0.9 * (1 - t) * (1 - t);
    },
    dispose() { scene.remove(mesh); geo.dispose(); mat.dispose(); },
  };
}
