// Particles: rust powder & flakes (they stay where they land), oil drops, water drips/splashes,
// dust motes floating in the window light, star glints on polished steel.
import * as THREE from 'three';
import { canvas, canvasTex } from './tex.js';

const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _s = new THREE.Vector3(), _p = new THREE.Vector3(), _e = new THREE.Euler();

class Pool {
  constructor(scene, geo, mat, n, shadow = false) {
    this.mesh = new THREE.InstancedMesh(geo, mat, n);
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.mesh.castShadow = shadow; this.mesh.receiveShadow = true; this.mesh.frustumCulled = false;
    this.n = n; this.i = 0; this.p = [];
    for (let k = 0; k < n; k++) { this.p.push({ alive: false, pos: new THREE.Vector3(), vel: new THREE.Vector3(), rot: new THREE.Euler(), spin: new THREE.Vector3(), size: 0, life: 0, rest: false }); _m.makeScale(0, 0, 0); this.mesh.setMatrixAt(k, _m); }
    scene.add(this.mesh);
  }
  spawn() { const p = this.p[this.i]; this.i = (this.i + 1) % this.n; p.alive = true; p.rest = false; p.life = 0; return p; }
  write(k, p, sx, sy, sz) { _q.setFromEuler(p.rot); _s.set(sx, sy, sz); _m.compose(p.pos, _q, _s); this.mesh.setMatrixAt(k, _m); }
}

export class FX {
  constructor(scene, floorY = 0) {
    this.scene = scene;
    // rust flakes: irregular little chips, lit
    const flakeG = new THREE.BufferGeometry();
    { const pts = [], n = 7; for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2, r = 0.6 + Math.random() * 0.5; pts.push(Math.cos(a) * r, (Math.random() - 0.5) * 0.25, Math.sin(a) * r); }
      const pos = [0, 0.12, 0]; pos.push(...pts); const idx = []; for (let i = 0; i < n; i++) idx.push(0, 1 + i, 1 + ((i + 1) % n));
      flakeG.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); flakeG.setIndex(idx); flakeG.computeVertexNormals(); }
    const flakeM = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.95, side: THREE.DoubleSide });
    this.flakes = new Pool(scene, flakeG, flakeM, 1400);
    this.flakeCol = [new THREE.Color(0x6a2e14), new THREE.Color(0x8a4320), new THREE.Color(0xa45a2a), new THREE.Color(0x4a2414), new THREE.Color(0xb07040)];
    for (let i = 0; i < 1400; i++) this.flakes.mesh.setColorAt(i, this.flakeCol[i % 5].clone().multiplyScalar(0.8 + Math.random() * 0.4));
    // oil drops: glossy amber
    const dropM = new THREE.MeshPhysicalMaterial({ color: 0x8a5a10, roughness: 0.05, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.02, transparent: true, opacity: 0.92, ior: 1.47, specularIntensity: 1 });
    this.oil = new Pool(scene, new THREE.SphereGeometry(1, 16, 12), dropM, 120);
    // water
    const waterM = new THREE.MeshPhysicalMaterial({ color: 0xc8d8e0, roughness: 0.02, metalness: 0, clearcoat: 1, transparent: true, opacity: 0.55 });
    this.water = new Pool(scene, new THREE.SphereGeometry(1, 12, 8), waterM, 200);
    // dust motes (additive points, size varies, drifting)
    const N = 260, pos = new Float32Array(N * 3), sz = new Float32Array(N), ph = new Float32Array(N);
    for (let i = 0; i < N; i++) { pos[i * 3] = (Math.random() - 0.5) * 2.4; pos[i * 3 + 1] = Math.random() * 1.9; pos[i * 3 + 2] = -2 + Math.random() * 3.2; sz[i] = 0.4 + Math.random() * Math.random() * 2.2; ph[i] = Math.random() * 100; }
    const dg = new THREE.BufferGeometry(); dg.setAttribute('position', new THREE.BufferAttribute(pos, 3)); dg.setAttribute('aSize', new THREE.BufferAttribute(sz, 1)); dg.setAttribute('aPh', new THREE.BufferAttribute(ph, 1));
    this.dustMat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uPx: { value: 300 }, uBright: { value: 1 } },
      vertexShader: `attribute float aSize; attribute float aPh; uniform float uTime, uPx; varying float vA;
        void main(){ vec3 p = position; p.x += sin(uTime*0.13+aPh)*0.12; p.y += sin(uTime*0.09+aPh*1.7)*0.08; p.z += cos(uTime*0.11+aPh)*0.1;
          vec4 mv = modelViewMatrix*vec4(p,1.0); gl_Position = projectionMatrix*mv;
          // brighter inside the window beam (a slab from the window toward the floor)
          float beam = smoothstep(0.7,0.2,abs(p.x - 0.0 + (p.z+2.0)*0.05)) * smoothstep(-2.2,-1.0,p.z) * smoothstep(1.6,-0.4,p.z);
          vA = (0.12 + beam*0.6) * (0.6+0.4*sin(uTime*1.3+aPh*3.0));
          gl_PointSize = aSize * uPx / -mv.z; }`,
      fragmentShader: `uniform float uBright; varying float vA; void main(){ vec2 d = gl_PointCoord-0.5; float a = smoothstep(0.5,0.0,length(d)); gl_FragColor = vec4(vec3(1.0,0.95,0.85)*a*vA*uBright, 1.0); }`,
    });
    this.dust = new THREE.Points(dg, this.dustMat); this.dust.frustumCulled = false; scene.add(this.dust);
    // glints
    const gc = canvas(64, 64), g = gc.getContext('2d');
    const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.15, 'rgba(255,250,235,0.6)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
    g.strokeStyle = 'rgba(255,255,255,0.9)'; g.lineWidth = 2; g.beginPath(); g.moveTo(32, 2); g.lineTo(32, 62); g.moveTo(2, 32); g.lineTo(62, 32); g.stroke();
    this.glintTex = canvasTex(gc);
    this.glints = [];
    for (let i = 0; i < 10; i++) { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: this.glintTex, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, color: new THREE.Color(3, 3, 3) })); s.visible = false; scene.add(s); this.glints.push({ s, life: 0 }); }
    this.floorY = floorY;
    this.onOilLand = null; this.onWaterLand = null;
  }
  rustBurst(p, n, normal) {
    for (let i = 0; i < n; i++) {
      const f = this.flakes.spawn();
      f.pos.copy(p).addScaledVector(normal, 0.004);
      f.vel.set((Math.random() - 0.5) * 0.25, Math.random() * 0.2, (Math.random() - 0.5) * 0.25).addScaledVector(normal, 0.15 + Math.random() * 0.2);
      f.rot.set(Math.random() * 6, Math.random() * 6, Math.random() * 6); f.spin.set(Math.random() * 20 - 10, Math.random() * 20 - 10, Math.random() * 20 - 10);
      // most are fine powder, a few are bigger flakes
      f.size = Math.random() < 0.82 ? 0.0008 + Math.random() * 0.0016 : 0.0025 + Math.random() * 0.004;
    }
  }
  oilDrop(p, v, size = 0.004) { const d = this.oil.spawn(); d.pos.copy(p); d.vel.copy(v); d.size = size * (0.8 + Math.random() * 0.4); d.rot.set(0, 0, 0); return d; }
  waterDrop(p, v, size = 0.004) { const d = this.water.spawn(); d.pos.copy(p); d.vel.copy(v); d.size = size * (0.7 + Math.random() * 0.6); d.rot.set(0, 0, 0); return d; }
  glint(p, size = 0.04) {
    const g = this.glints.find((x) => x.life <= 0) || this.glints[0];
    g.s.position.copy(p); g.life = 0.5; g.size = size; g.s.visible = true;
  }
  update(dt, t, colliders) {
    this.dustMat.uniforms.uTime.value = t;
    // flakes: fall, tumble, rest on the floor (they stay)
    const F = this.flakes;
    for (let k = 0; k < F.n; k++) {
      const f = F.p[k]; if (!f.alive) continue;
      if (!f.rest) {
        f.vel.y -= 9.8 * dt * (f.size < 0.0025 ? 0.35 : 1); // powder drifts down slower
        f.vel.multiplyScalar(f.size < 0.0025 ? 1 - 3 * dt : 1 - 0.5 * dt);
        f.pos.addScaledVector(f.vel, dt);
        f.rot.x += f.spin.x * dt; f.rot.y += f.spin.y * dt; f.rot.z += f.spin.z * dt;
        if (f.pos.y < this.floorY + 0.001) { f.pos.y = this.floorY + 0.0006 + Math.random() * 0.0006; f.rest = true; f.rot.x = (Math.random() - 0.5) * 0.3; f.rot.z = (Math.random() - 0.5) * 0.3; }
      }
      F.write(k, f, f.size, f.size, f.size);
    }
    F.mesh.instanceMatrix.needsUpdate = true;
    for (const [P, cb, stretch] of [[this.oil, this.onOilLand, 1], [this.water, this.onWaterLand, 1]]) {
      for (let k = 0; k < P.n; k++) {
        const d = P.p[k];
        if (!d.alive) { continue; }
        d.life += dt;
        d.vel.y -= 9.8 * dt; d.pos.addScaledVector(d.vel, dt);
        let landed = d.pos.y < this.floorY;
        if (colliders && !landed) for (const c of colliders) if (c(d.pos)) { landed = true; break; }
        if (landed || d.life > 4) {
          d.alive = false; if (cb) cb(d.pos.clone(), d);
          _m.makeScale(0, 0, 0); P.mesh.setMatrixAt(k, _m); continue;
        }
        const sp = Math.min(3, 1 + d.vel.length() * 0.6);
        _p.copy(d.vel).normalize(); _q.setFromUnitVectors(new THREE.Vector3(0, 1, 0), _p.lengthSq() > 0 ? _p : new THREE.Vector3(0, 1, 0));
        _s.set(d.size, d.size * sp, d.size); _m.compose(d.pos, _q, _s); P.mesh.setMatrixAt(k, _m);
      }
      P.mesh.instanceMatrix.needsUpdate = true;
    }
    for (const g of this.glints) {
      if (g.life <= 0) { g.s.visible = false; continue; }
      g.life -= dt; const a = Math.sin((1 - g.life / 0.5) * Math.PI);
      g.s.scale.setScalar(g.size * a); g.s.material.rotation = t * 2;
    }
  }
}
