// Drops & splashes (lit, varied sizes), rippling dye liquid surfaces, puddles, hint glow.
import * as THREE from '../vendor/three.module.min.js';

const V3 = THREE.Vector3;

export class Drops {
  constructor(scene, max = 500) {
    const geo = new THREE.IcosahedronGeometry(1, 2);
    const mat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.04, metalness: 0, clearcoat: 1, transparent: true, opacity: 0.88, specularIntensity: 1 });
    this.mesh = new THREE.InstancedMesh(geo, mat, max);
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.mesh.setColorAt(0, new THREE.Color());
    this.mesh.count = 0; this.mesh.frustumCulled = false; this.mesh.castShadow = false;
    scene.add(this.mesh);
    this.p = []; this.max = max; this.o = new THREE.Object3D();
  }
  spawn(pos, vel, size, color, opts = {}) {
    if (this.p.length >= this.max) this.p.shift();
    this.p.push({ pos: pos.clone(), vel: vel.clone(), size, color: color.clone(), life: opts.life ?? 3, onLand: opts.onLand, stretch: opts.stretch ?? 1 });
  }
  update(dt, env) {
    const o = this.o; let n = 0;
    for (let i = this.p.length - 1; i >= 0; i--) {
      const d = this.p[i];
      d.life -= dt; d.vel.y -= 9.8 * dt; d.vel.multiplyScalar(1 - 0.4 * dt);
      d.pos.addScaledVector(d.vel, dt);
      const floor = env.floorAt(d.pos.x, d.pos.z, d.pos.y);
      const liq = env.liquidSurfaceAt ? env.liquidSurfaceAt(d.pos.x, d.pos.z) : null;
      if (liq !== null && d.pos.y < liq) { if (d.onLand) d.onLand(d, 'liquid'); this.p.splice(i, 1); continue; }
      if (d.pos.y < floor || d.life < 0) { if (d.onLand) d.onLand(d, 'floor'); this.p.splice(i, 1); continue; }
    }
    for (const d of this.p) {
      o.position.copy(d.pos);
      const sp = d.vel.length();
      const st = 1 + Math.min(sp * 0.25, 1.4) * d.stretch;
      o.scale.set(d.size, d.size * st, d.size);
      if (sp > 0.01) o.quaternion.setFromUnitVectors(new V3(0, 1, 0), d.vel.clone().normalize()); else o.quaternion.identity();
      o.updateMatrix(); this.mesh.setMatrixAt(n, o.matrix); this.mesh.setColorAt(n, d.color); n++;
    }
    this.mesh.count = n;
    this.mesh.instanceMatrix.needsUpdate = true; if (this.mesh.instanceColor) this.mesh.instanceColor.needsUpdate = true;
  }
}

// Height-field ripples on a dye bath surface
export class Liquid {
  constructor(tub, kind, size = 48) {
    this.tub = tub; this.kind = kind; this.N = size;
    this.h0 = new Float32Array(size * size); this.h1 = new Float32Array(size * size);
    this.data = new Uint8Array(size * size * 4);
    this.normal = new THREE.DataTexture(this.data, size, size); this.normal.magFilter = THREE.LinearFilter; this.normal.minFilter = THREE.LinearFilter;
    this.normal.wrapS = this.normal.wrapT = THREE.ClampToEdgeWrapping;
    const isI = kind === 'indigo';
    const mat = new THREE.MeshPhysicalMaterial({
      color: isI ? new THREE.Color(0.012, 0.03, 0.045) : new THREE.Color(0.2, 0.018, 0.06),
      roughness: 0.04, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.02, specularIntensity: 1,
      normalMap: this.normal, normalScale: new THREE.Vector2(1.6, 1.6), clearcoatNormalMap: this.normal,
      envMapIntensity: 0.7,
    });
    if (isI) mat.map = flowerTexture();
    this.mat = mat;
    this.mesh = new THREE.Mesh(new THREE.CircleGeometry(1, 64).rotateX(-Math.PI / 2), mat);
    this.mesh.receiveShadow = true;
    tub.group.add(this.mesh);
    this.t = 0;
  }
  disturb(x, z, amt, rad = 2) {
    // x,z in world
    const N = this.N, R = this.radius;
    const u = ((x - this.tub.x) / R * 0.5 + 0.5) * N, v = ((z - this.tub.z) / R * 0.5 + 0.5) * N;
    for (let j = -rad; j <= rad; j++) for (let i = -rad; i <= rad; i++) {
      const xi = Math.round(u + i), yj = Math.round(v + j); if (xi < 1 || yj < 1 || xi >= N - 1 || yj >= N - 1) continue;
      const f = Math.exp(-(i * i + j * j) / (rad * rad * 0.5));
      this.h0[yj * N + xi] += amt * f;
    }
  }
  update(dt) {
    this.t += dt;
    const tub = this.tub; const N = this.N;
    const lvl = tub.level;
    const R = tub.R0 + (tub.R1 - tub.R0) * Math.min(1, lvl / tub.H) - 0.003;
    this.radius = R;
    this.mesh.position.y = Math.max(lvl, 0.0001);
    this.mesh.scale.set(R, 1, R);
    this.mesh.visible = lvl > 0.012;
    // wave equation
    const a = this.h0, b = this.h1;
    for (let j = 1; j < N - 1; j++) for (let i = 1; i < N - 1; i++) {
      const k = j * N + i;
      b[k] = ((a[k - 1] + a[k + 1] + a[k - N] + a[k + N]) * 0.5 - b[k]) * 0.985;
    }
    this.h0 = b; this.h1 = a;
    // gentle wind ripples
    if (Math.random() < 0.3) this.disturb(tub.x + (Math.random() - 0.5) * R, tub.z + (Math.random() - 0.5) * R, 0.15, 1);
    const h = this.h0, d = this.data;
    for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
      const k = j * N + i;
      const dx = (h[Math.min(k + 1, N * N - 1)] - h[Math.max(k - 1, 0)]);
      const dy = (h[Math.min(k + N, N * N - 1)] - h[Math.max(k - N, 0)]);
      d[k * 4] = Math.max(0, Math.min(255, 128 - dx * 90));
      d[k * 4 + 1] = Math.max(0, Math.min(255, 128 + dy * 90));
      d[k * 4 + 2] = 255; d[k * 4 + 3] = 255;
    }
    this.normal.needsUpdate = true;
  }
}

function flowerTexture() {
  // the coppery foam "flower" that floats on a live indigo vat
  const N = 512, cv = document.createElement('canvas'); cv.width = cv.height = N; const g = cv.getContext('2d');
  g.fillStyle = 'rgb(255,255,255)'; g.fillRect(0, 0, N, N);
  for (let i = 0; i < 900; i++) {
    const a = Math.random() * Math.PI * 2, r = Math.pow(Math.random(), 1.6) * N * 0.27;
    const x = N / 2 + Math.cos(a) * r, y = N / 2 + Math.sin(a) * r * 0.9;
    const s = 3 + Math.random() * 12 * (1 - r / (N * 0.3));
    const gr = g.createRadialGradient(x - s * 0.3, y - s * 0.3, 0, x, y, s);
    const c = Math.random();
    gr.addColorStop(0, c < 0.5 ? 'rgba(240,190,150,1)' : 'rgba(200,140,190,1)');
    gr.addColorStop(0.6, 'rgba(120,70,110,0.95)'); gr.addColorStop(1, 'rgba(60,40,70,0)');
    g.fillStyle = gr; g.beginPath(); g.arc(x, y, s, 0, Math.PI * 2); g.fill();
  }
  // scale the outer area back to white (=no tint)
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function makePuddle() {
  const N = 256, cv = document.createElement('canvas'); cv.width = cv.height = N; const g = cv.getContext('2d');
  g.fillStyle = '#000'; g.fillRect(0, 0, N, N);
  g.fillStyle = '#fff';
  for (let i = 0; i < 26; i++) {
    const a = Math.random() * Math.PI * 2, r = Math.random() * N * 0.25;
    g.beginPath(); g.arc(N / 2 + Math.cos(a) * r * 1.3, N / 2 + Math.sin(a) * r * 0.8, 20 + Math.random() * 45, 0, Math.PI * 2); g.fill();
  }
  g.filter = 'blur(2px)';
  const t = new THREE.CanvasTexture(cv);
  const m = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(0.03, 0.06, 0.12), roughness: 0.03, clearcoat: 1, alphaMap: t, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -6, polygonOffsetUnits: -6 });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2), m);
  mesh.renderOrder = 2; mesh.receiveShadow = true;
  return mesh;
}

export class Sparkle {
  constructor(scene) {
    const cv = document.createElement('canvas'); cv.width = cv.height = 128; const g = cv.getContext('2d');
    const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, 'rgba(255,250,230,0.9)'); gr.addColorStop(0.25, 'rgba(255,240,200,0.35)'); gr.addColorStop(1, 'rgba(255,240,200,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
    const t = new THREE.CanvasTexture(cv);
    this.sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, blending: THREE.AdditiveBlending, depthWrite: false, depthTest: false, transparent: true, opacity: 0 }));
    this.sprite.renderOrder = 10; scene.add(this.sprite);
    this.target = null; this.t = 0; this.size = 0.2;
  }
  update(dt, target, size = 0.2) {
    this.t += dt;
    const m = this.sprite.material;
    if (target) { this.sprite.position.lerp(target, m.opacity < 0.05 ? 1 : 0.2); m.opacity += (0.55 - m.opacity) * 0.1; }
    else m.opacity *= 0.9;
    const s = size * (1 + 0.18 * Math.sin(this.t * 4));
    this.sprite.scale.set(s, s, s);
  }
}
