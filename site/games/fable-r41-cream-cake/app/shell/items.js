// Toppings: strawberry, kiwi, blueberry, mandarin (fruits atlas 2x2) and candles.
// On the cake they are InstancedMeshes under cakeTop (cake-local coords, same frame as hero.root).
import { THREE, mergeGeos, place, wobble, clamp } from './util.js';
import { L } from './world.js';

// atlas quadrants of fruits_512 (u0, v0) lower-left corner, size 0.5
const Q = { straw: [0, 0.5], kiwi: [0.5, 0.5], blue: [0, 0], orange: [0.5, 0] };

function remapUV(g, fn) {
  const p = g.getAttribute('position'), n = g.getAttribute('normal'), uv = g.getAttribute('uv');
  for (let i = 0; i < p.count; i++) {
    const [u, v] = fn(p.getX(i), p.getY(i), p.getZ(i), n.getX(i), n.getY(i), n.getZ(i), uv.getX(i), uv.getY(i));
    uv.setXY(i, u, v);
  }
  return g;
}

function strawberryGeo() {
  const prof = [[0, 0], [0.1, 0.005], [0.15, 0.06], [0.158, 0.14], [0.13, 0.23], [0.075, 0.31], [0.02, 0.355], [0, 0.36]].map(([r, y]) => new THREE.Vector2(r, y));
  const body = remapUV(new THREE.LatheGeometry(prof, 18), (x, y, z, nx, ny, nz, u, v) => [Q.straw[0] + 0.03 + u * 0.44, Q.straw[1] + 0.03 + v * 0.44]);
  // little green leaves at the base (UV into the green kiwi flesh)
  const leaf = new THREE.ConeGeometry(0.2, 0.05, 8, 1, true).translate(0, 0.02, 0);
  const leaves = remapUV(leaf, () => [0.6, 0.62]);
  return mergeGeos([body, leaves]);
}

function kiwiGeo() {
  const g = new THREE.CylinderGeometry(0.19, 0.19, 0.045, 22, 1).translate(0, 0.0225, 0);
  remapUV(g, (x, y, z, nx, ny) => (Math.abs(ny) > 0.5 ? [0.905 + (x / 0.19) * 0.088, 0.84 + (z / 0.19) * 0.088] : [0.56, 0.58]));
  // stand it on its edge, leaning back a little (like kiwi slices on a cake)
  return place(g, 0, 0.17, 0, -1.2, 0, 0);
}

function blueberryGeo() {
  const g = new THREE.SphereGeometry(0.085, 14, 10).scale(1, 0.85, 1).translate(0, 0.072, 0);
  return remapUV(g, (x, y, z, nx, ny, nz) => [0.25 + nx * 0.2, 0.31 - nz * 0.2]);
}

function mandarinGeo() {
  const g = new THREE.SphereGeometry(0.2, 16, 10).scale(1, 0.5, 0.42);
  const p = g.getAttribute('position');
  for (let i = 0; i < p.count; i++) { const x = p.getX(i); p.setY(i, p.getY(i) + 1.6 * x * x); }
  g.computeVertexNormals();
  g.translate(0, 0.1 - 0.0, 0);
  return remapUV(g, (x, y, z) => [0.75 + x * 1.1, 0.25 + (y - 0.1) * 1.2 + z * 0.4]);
}

function candleGeo() {
  const body = new THREE.CylinderGeometry(0.038, 0.038, 0.45, 10, 1).translate(0, 0.225, 0);
  const wick = new THREE.CylinderGeometry(0.008, 0.008, 0.06, 4).translate(0, 0.48, 0);
  remapUV(wick, () => [0.02, 0.02]);
  return mergeGeos([body, wick]);
}

function flameGeo() {
  const prof = [[0, 0], [0.035, 0.03], [0.045, 0.07], [0.03, 0.12], [0, 0.17]].map(([r, y]) => new THREE.Vector2(r, y));
  return new THREE.LatheGeometry(prof, 10);
}

export class Items {
  constructor(W, assets, tier, hero) {
    this.W = W; this.hero = hero; this.tier = tier;
    const atlas = assets.photo('fruits_512');
    atlas.wrapS = atlas.wrapT = THREE.ClampToEdgeWrapping;
    this.fruitMat = new THREE.MeshStandardMaterial({ map: atlas, roughness: 0.38, emissive: 0x000000 });
    this.candleMat = new THREE.MeshLambertMaterial({ map: assets.tex.candle, emissive: 0x000000 });
    this.flameMat = new THREE.MeshBasicMaterial({ color: 0xffc94d });
    const defs = [
      { key: 'straw', geo: strawberryGeo(), mat: this.fruitMat, r: 0.16, h: 0.36, sink: 0.35 },
      { key: 'kiwi', geo: kiwiGeo(), mat: this.fruitMat, r: 0.18, h: 0.34, sink: 0.25 },
      { key: 'blue', geo: blueberryGeo(), mat: this.fruitMat, r: 0.09, h: 0.15, sink: 0.4 },
      { key: 'orange', geo: mandarinGeo(), mat: this.fruitMat, r: 0.2, h: 0.18, sink: 0.35 },
      { key: 'candle', geo: candleGeo(), mat: this.candleMat, r: 0.05, h: 0.5, sink: 0.12 },
    ];
    this.types = defs.map((d, i) => {
      const cap = d.key === 'candle' ? tier.maxCandles : tier.maxPerFruit;
      const mesh = new THREE.InstancedMesh(d.geo, d.mat, cap);
      mesh.count = 0; mesh.frustumCulled = false;
      W.cakeTop.add(mesh);
      const carry = new THREE.Mesh(d.geo, d.mat);
      carry.visible = false;
      W.scene.add(carry);
      return Object.assign(d, { index: i, cap, mesh, carry, list: [] });
    });
    this.candle = this.types[4];
    this.flames = new THREE.InstancedMesh(flameGeo(), this.flameMat, tier.maxCandles);
    this.flames.count = 0; this.flames.frustumCulled = false;
    W.cakeTop.add(this.flames);

    // tray displays: three of each fruit per dish, candles standing in their dish (one small mesh per dish so it can bounce)
    this.trayGroups = L.dishes.map(([x, z], i) => {
      const t = this.types[i];
      const spots = t.key === 'candle' ? [[-0.15, 0, 0.3], [0.15, 0, -0.2], [0.05, 0.15, 0.1], [-0.1, -0.2, -0.1]] : [[-0.2, -0.1, 0.4], [0.18, -0.12, -0.5], [0.0, 0.2, 1.4]];
      const geos = spots.map(([dx, dz, ry]) => place(t.geo.clone(), dx, 0.05, dz, t.key === 'candle' ? 0.25 * dx : 0, ry, t.key === 'candle' ? 0.25 * dz : 0, 1.15));
      const g = new THREE.Group();
      g.position.set(x, 0, z);
      g.add(new THREE.Mesh(mergeGeos(geos), t.mat));
      W.scene.add(g);
      return g;
    });
    // tray pick proxies (generous)
    this.proxies = L.dishes.map(([x, z], i) => {
      const m = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.72, 0.9, 10).translate(0, 0.3, 0), new THREE.MeshBasicMaterial({ visible: false }));
      m.position.set(x, 0, z); m.userData = { kind: 'tray', index: i };
      W.scene.add(m);
      return m;
    });
    this._m = new THREE.Matrix4(); this._q = new THREE.Quaternion(); this._v = new THREE.Vector3(); this._s = new THREE.Vector3(); this._e = new THREE.Euler();
    this.flights = [];
  }

  dishWorld(i, out = new THREE.Vector3()) { const [x, z] = L.dishes[i]; return out.set(x, 0.3, z); }
  canAdd(i) { const t = this.types[i]; return t.list.length < t.cap; }
  get placedCount() { return this.types.reduce((a, t) => a + t.list.length, 0); }
  get candleCount() { return this.candle.list.length; }

  // Choose a nice free spot on the cake (cake-local), facing the camera, preferring cream peaks for fruit.
  autoSpot(i, frontLocal) {
    const t = this.types[i];
    const R = L.radius;
    let best = null, bestS = -1e9;
    const all = this.types.flatMap((tt) => tt.list);
    const cand = [];
    for (let k = 0; k < 16; k++) cand.push([0.78 * R, (k / 16) * Math.PI * 2]);
    for (let k = 0; k < 8; k++) cand.push([0.42 * R, (k / 8) * Math.PI * 2 + 0.2]);
    cand.push([0, 0]);
    for (const [r, a] of cand) {
      const x = Math.cos(a) * r, z = Math.sin(a) * r;
      let s = (x * frontLocal.x + z * frontLocal.z) * 0.8 + Math.random() * 0.25;
      const h = this.hero.heightAt(x, z);
      // fruit likes to sit on cream, but only a little more on tall cream: the hero's swirls can reach 14 cm, and
      // an uncapped bonus piled every tapped fruit onto the tallest tower (hero-notes §7.1)
      if (t.key !== 'candle') s += Math.min(h, 0.3) * 2.5; else s += (r < 0.5 ? 0.6 : 0) - Math.min(h, 0.6) * 0.5;
      for (const o of all) { const d = Math.hypot(o.x - x, o.z - z); if (d < 0.34) s -= (0.34 - d) * 12; }
      if (s > bestS) { bestS = s; best = { x, z }; }
    }
    return best;
  }

  // Place on the cake at local (x,z). Returns the instance record.
  land(i, x, z, ry = Math.random() * Math.PI * 2) {
    const t = this.types[i];
    if (!this.canAdd(i)) return null;
    const r = Math.hypot(x, z), maxR = L.radius - t.r * 0.6;
    if (r > maxR) { x *= maxR / r; z *= maxR / r; }
    const h = this.hero.heightAt(x, z);
    const y = h > 0.03 ? h - t.h * t.sink : 0;
    const rec = { x, y, z, ry, age: 0, lit: t.key === 'candle', flame: 1 };
    t.list.push(rec);
    t.mesh.count = t.list.length;
    this._write(t, t.list.length - 1);
    this.hero.stampObstacle(x, z, t.r, y + t.h);
    return rec;
  }

  _write(t, k) {
    const rec = t.list[k];
    const sq = 1 + wobble(rec.age, 22, 9) * 0.22;
    this._q.setFromEuler(this._e.set(0, rec.ry, 0));
    this._m.compose(this._v.set(rec.x, rec.y, rec.z), this._q, this._s.set(1 / Math.sqrt(sq), sq, 1 / Math.sqrt(sq)));
    t.mesh.setMatrixAt(k, this._m);
    t.mesh.instanceMatrix.needsUpdate = true;
  }

  clear() {
    for (const t of this.types) { t.list.length = 0; t.mesh.count = 0; }
    this.flames.count = 0;
    this.flights.length = 0;
    for (const t of this.types) t.carry.visible = false;
  }

  blowOut(k) { const c = this.candle.list[k]; if (c) c.lit = false; return c; }

  update(dt, time) {
    for (const t of this.types) {
      for (let k = 0; k < t.list.length; k++) {
        const rec = t.list[k];
        if (rec.age < 1.2) { rec.age += dt; this._write(t, k); }
      }
    }
    // candle flames flicker; blown-out ones shrink away
    const cl = this.candle.list;
    this.flames.count = cl.length;
    for (let k = 0; k < cl.length; k++) {
      const c = cl[k];
      c.flame = clamp(c.flame + (c.lit ? 4 : -6) * dt, 0, 1);
      const f = c.flame * (1 + 0.12 * Math.sin(time * 23 + k * 1.7) + 0.06 * Math.sin(time * 37 + k));
      const sq = 1 + wobble(c.age, 22, 9) * 0.22;
      this._q.setFromEuler(this._e.set(0.08 * Math.sin(time * 9 + k), 0, 0.08 * Math.sin(time * 7 + k)));
      this._m.compose(this._v.set(c.x, c.y + 0.5 * sq, c.z), this._q, this._s.set(Math.max(1e-3, f), Math.max(1e-3, f * (1.1 + 0.1 * Math.sin(time * 17 + k))), Math.max(1e-3, f)));
      this.flames.setMatrixAt(k, this._m);
    }
    if (cl.length) this.flames.instanceMatrix.needsUpdate = true;
  }
}
