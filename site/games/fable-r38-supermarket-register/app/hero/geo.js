// hero の形づくりの道具（three の形をまとめる・回転体・管・平らな多角形）。
// どれも「位置・法線・uv・色(rgb)」を持つ BufferGeometry を返し、mergeGeos で1つにまとめる（商品1個＝draw call 1回）。

const EPS = 1e-6;

// アトラス上の四角（px）→ uv の四角 [u0, v0, u1, v1]（Canvas は上が v=1）
export function rectUV(px, py, pw, ph, W, H, inset = 2) {
  return [(px + inset) / W, 1 - (py + ph - inset) / H, (px + pw - inset) / W, 1 - (py + inset) / H];
}

// groceries.jpg の四分の一（qx,qy は 0|1。qy=1 が上段）
export function quadRect(qx, qy, inset = 0.012) {
  return [qx * 0.5 + inset, qy * 0.5 + inset, qx * 0.5 + 0.5 - inset, qy * 0.5 + 0.5 - inset];
}

// parts: [{ geo, matrix?, rect?, swapUV?, color? }] を1つの形に。元の形は dispose する。
export function mergeGeos(THREE, parts) {
  let nv = 0, ni = 0;
  for (const p of parts) {
    const g = p.geo;
    nv += g.attributes.position.count;
    ni += g.index ? g.index.count : g.attributes.position.count;
  }
  const pos = new Float32Array(nv * 3);
  const nor = new Float32Array(nv * 3);
  const uvs = new Float32Array(nv * 2);
  const col = new Float32Array(nv * 3);
  const idx = nv > 65535 ? new Uint32Array(ni) : new Uint16Array(ni);
  const v = new THREE.Vector3();
  const nm = new THREE.Matrix3();
  let vo = 0, io = 0;
  for (const p of parts) {
    const g = p.geo;
    const P = g.attributes.position, N = g.attributes.normal, U = g.attributes.uv, C = g.attributes.color;
    const n = P.count;
    const m = p.matrix || null;
    if (m) nm.getNormalMatrix(m);
    const r = p.rect || null;
    const c = p.color || null;
    for (let i = 0; i < n; i++) {
      v.fromBufferAttribute(P, i);
      if (m) v.applyMatrix4(m);
      pos[(vo + i) * 3] = v.x; pos[(vo + i) * 3 + 1] = v.y; pos[(vo + i) * 3 + 2] = v.z;
      if (N) {
        v.fromBufferAttribute(N, i);
        if (m) v.applyMatrix3(nm);
        const len = v.length();
        if (len > EPS) v.multiplyScalar(1 / len); else v.set(0, 1, 0);
      } else v.set(0, 1, 0);
      nor[(vo + i) * 3] = v.x; nor[(vo + i) * 3 + 1] = v.y; nor[(vo + i) * 3 + 2] = v.z;
      let a = U ? U.getX(i) : 0.5, b = U ? U.getY(i) : 0.5;
      if (p.swapUV) { const t = a; a = b; b = t; }
      if (r) { a = r[0] + (r[2] - r[0]) * Math.min(1, Math.max(0, a)); b = r[1] + (r[3] - r[1]) * Math.min(1, Math.max(0, b)); }
      uvs[(vo + i) * 2] = a; uvs[(vo + i) * 2 + 1] = b;
      let cr = 1, cg = 1, cb = 1;
      if (C) { cr = C.getX(i); cg = C.getY(i); cb = C.getZ(i); }
      if (c) { cr *= c[0]; cg *= c[1]; cb *= c[2]; }
      col[(vo + i) * 3] = cr; col[(vo + i) * 3 + 1] = cg; col[(vo + i) * 3 + 2] = cb;
    }
    const I = g.index;
    const m3 = I ? I.count : n;
    for (let k = 0; k < m3; k += 3) {
      const a = I ? I.getX(k) : k, b = I ? I.getX(k + 1) : k + 1, cc = I ? I.getX(k + 2) : k + 2;
      // 面の向きを頂点の法線に合わせる（裏返しの面を作らない）
      const ax = pos[(vo + a) * 3], ay = pos[(vo + a) * 3 + 1], az = pos[(vo + a) * 3 + 2];
      const e1x = pos[(vo + b) * 3] - ax, e1y = pos[(vo + b) * 3 + 1] - ay, e1z = pos[(vo + b) * 3 + 2] - az;
      const e2x = pos[(vo + cc) * 3] - ax, e2y = pos[(vo + cc) * 3 + 1] - ay, e2z = pos[(vo + cc) * 3 + 2] - az;
      const fx = e1y * e2z - e1z * e2y, fy = e1z * e2x - e1x * e2z, fz = e1x * e2y - e1y * e2x;
      const sx = nor[(vo + a) * 3] + nor[(vo + b) * 3] + nor[(vo + cc) * 3];
      const sy = nor[(vo + a) * 3 + 1] + nor[(vo + b) * 3 + 1] + nor[(vo + cc) * 3 + 1];
      const sz = nor[(vo + a) * 3 + 2] + nor[(vo + b) * 3 + 2] + nor[(vo + cc) * 3 + 2];
      const back = fx * sx + fy * sy + fz * sz < 0;
      idx[io + k] = vo + a;
      idx[io + k + 1] = vo + (back ? cc : b);
      idx[io + k + 2] = vo + (back ? b : cc);
    }
    vo += n; io += m3;
    g.dispose();
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  out.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
  out.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  out.setAttribute('color', new THREE.BufferAttribute(col, 3));
  out.setIndex(new THREE.BufferAttribute(idx, 1));
  out.computeBoundingBox();
  out.computeBoundingSphere();
  return out;
}

// 形の箱の中心を原点に寄せ、(必要なら) 指定の大きさに合わせる。size = [x,y,z]（0 の軸は合わせない）
export function centerAndFit(geo, size) {
  geo.computeBoundingBox();
  const b = geo.boundingBox;
  const cx = (b.min.x + b.max.x) / 2, cy = (b.min.y + b.max.y) / 2, cz = (b.min.z + b.max.z) / 2;
  geo.translate(-cx, -cy, -cz);
  if (size) {
    const sx = size[0] > 0 ? size[0] / Math.max(EPS, b.max.x - b.min.x) : 1;
    const sy = size[1] > 0 ? size[1] / Math.max(EPS, b.max.y - b.min.y) : 1;
    const sz = size[2] > 0 ? size[2] / Math.max(EPS, b.max.z - b.min.z) : 1;
    geo.scale(sx, sy, sz);
    // 等しくない拡大で法線がずれるので直す
    const N = geo.attributes.normal;
    for (let i = 0; i < N.count; i++) {
      const x = N.getX(i) / sx, y = N.getY(i) / sy, z = N.getZ(i) / sz;
      const l = Math.hypot(x, y, z);
      if (l > EPS) N.setXYZ(i, x / l, y / l, z / l);
    }
  }
  geo.computeBoundingBox();
  geo.computeBoundingSphere();
  return geo;
}

// Y 軸まわりの回転体。profile: [{ r, y, t?, rect?, planar?, color? }]（下から上へ）。
// uv：rect の中で u=まわり, v=t（planar のときは上から見た x,z をそのまま rect に写す）。
// 法線は断面の接線から計算する（長さ0は避ける）。
export function latheGeo(THREE, profile, segs, { swapUV = false, mirrorU = false } = {}) {
  const np = profile.length;
  const cols = segs + 1;
  const nv = np * cols;
  const pos = new Float32Array(nv * 3), nor = new Float32Array(nv * 3), uvs = new Float32Array(nv * 2), col = new Float32Array(nv * 3);
  let rmax = EPS;
  for (const p of profile) rmax = Math.max(rmax, p.r);
  for (let j = 0; j < np; j++) {
    const p = profile[j];
    const a = profile[Math.max(0, j - 1)], b = profile[Math.min(np - 1, j + 1)];
    let tx = b.r - a.r, ty = b.y - a.y;
    let tl = Math.hypot(tx, ty);
    if (tl < EPS) { tx = 0; ty = 1; tl = 1; }
    const nr = ty / tl, ny = -tx / tl; // 外向き（断面が下→上のとき）
    const rect = p.rect || [0, 0, 1, 1];
    const t = p.t === undefined ? j / (np - 1) : p.t;
    const c = p.color || [1, 1, 1];
    for (let i = 0; i < cols; i++) {
      const u = i / segs;
      const ang = u * Math.PI * 2;
      const s = Math.sin(ang), co = Math.cos(ang);
      const k = j * cols + i;
      pos[k * 3] = p.r * co; pos[k * 3 + 1] = p.y; pos[k * 3 + 2] = -p.r * s;
      nor[k * 3] = nr * co; nor[k * 3 + 1] = ny; nor[k * 3 + 2] = -nr * s;
      let uu, vv;
      if (p.planar) { uu = 0.5 + 0.5 * (p.r / rmax) * co; vv = 0.5 + 0.5 * (p.r / rmax) * s; }
      else { const um = mirrorU ? 1 - Math.abs(2 * u - 1) : u; uu = um; vv = t; if (swapUV) { uu = t; vv = um; } }
      uvs[k * 2] = rect[0] + (rect[2] - rect[0]) * uu;
      uvs[k * 2 + 1] = rect[1] + (rect[3] - rect[1]) * vv;
      col[k * 3] = c[0]; col[k * 3 + 1] = c[1]; col[k * 3 + 2] = c[2];
    }
  }
  const idx = new Uint16Array((np - 1) * segs * 6);
  let o = 0;
  for (let j = 0; j < np - 1; j++) {
    for (let i = 0; i < segs; i++) {
      const a = j * cols + i, b = a + 1, c = a + cols, d = c + 1;
      idx[o++] = a; idx[o++] = b; idx[o++] = c;
      idx[o++] = b; idx[o++] = d; idx[o++] = c;
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
  g.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  g.setIndex(new THREE.BufferAttribute(idx, 1));
  return g;
}

// 中心線 center(t)→[x,y,z] と半径 radius(t) の管（両端は細くして閉じる）。uv：u=長さ方向, v=まわり（rect の中）。
export function tubeGeo(THREE, { n, m, center, radius, up = [0, 1, 0], rect = [0, 0, 1, 1], squashUp = 1 }) {
  const cols = m + 1, rows = n + 1;
  const nv = rows * cols;
  const pos = new Float32Array(nv * 3), nor = new Float32Array(nv * 3), uvs = new Float32Array(nv * 2);
  const c0 = [0, 0, 0];
  for (let j = 0; j < rows; j++) {
    const t = j / n;
    const c = center(t);
    const ca = center(Math.max(0, t - 0.01)), cb = center(Math.min(1, t + 0.01));
    let tx = cb[0] - ca[0], ty = cb[1] - ca[1], tz = cb[2] - ca[2];
    let tl = Math.hypot(tx, ty, tz);
    if (tl < EPS) { tx = 1; ty = 0; tz = 0; tl = 1; }
    tx /= tl; ty /= tl; tz /= tl;
    // 横方向 N = up × T、上方向 B = T × N
    let nx = up[1] * tz - up[2] * ty, ny = up[2] * tx - up[0] * tz, nz = up[0] * ty - up[1] * tx;
    let nl = Math.hypot(nx, ny, nz);
    if (nl < EPS) { nx = 0; ny = 0; nz = 1; nl = 1; }
    nx /= nl; ny /= nl; nz /= nl;
    const bx = ty * nz - tz * ny, by = tz * nx - tx * nz, bz = tx * ny - ty * nx;
    const r = Math.max(0.0004, radius(t));
    c0[0] = c[0]; c0[1] = c[1]; c0[2] = c[2];
    for (let i = 0; i < cols; i++) {
      const a = (i / m) * Math.PI * 2;
      const ca2 = Math.cos(a), sa = Math.sin(a) * squashUp;
      const k = j * cols + i;
      const ox = nx * ca2 + bx * sa, oy = ny * ca2 + by * sa, oz = nz * ca2 + bz * sa;
      pos[k * 3] = c0[0] + r * ox; pos[k * 3 + 1] = c0[1] + r * oy; pos[k * 3 + 2] = c0[2] + r * oz;
      const ol = Math.max(EPS, Math.hypot(ox, oy, oz));
      nor[k * 3] = ox / ol; nor[k * 3 + 1] = oy / ol; nor[k * 3 + 2] = oz / ol;
      uvs[k * 2] = rect[0] + (rect[2] - rect[0]) * t;
      uvs[k * 2 + 1] = rect[1] + (rect[3] - rect[1]) * (i / m);
    }
  }
  const idx = new Uint16Array(n * m * 6);
  let o = 0;
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < m; i++) {
      const a = j * cols + i, b = a + 1, c = a + cols, d = c + 1;
      idx[o++] = a; idx[o++] = c; idx[o++] = b;
      idx[o++] = b; idx[o++] = c; idx[o++] = d;
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
  g.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  g.setIndex(new THREE.BufferAttribute(idx, 1));
  return g;
}

// 平らな面（三角・四角）を集めて、面ごとの法線で作る。quad(a,b,c,d, rect)：a→b→c→d は外から見て反時計回り。
// center を渡すと、面を center から外向きにそろえる（凸の形用）。
export function polyBuilder(THREE, center = null) {
  const pos = [], nor = [], uvs = [], col = [];
  function tri(a, b, c, ua, ub, uc, color) {
    if (center) {
      const ux0 = b[0] - a[0], uy0 = b[1] - a[1], uz0 = b[2] - a[2];
      const vx0 = c[0] - a[0], vy0 = c[1] - a[1], vz0 = c[2] - a[2];
      const fx = uy0 * vz0 - uz0 * vy0, fy = uz0 * vx0 - ux0 * vz0, fz = ux0 * vy0 - uy0 * vx0;
      const mx = (a[0] + b[0] + c[0]) / 3 - center[0], my = (a[1] + b[1] + c[1]) / 3 - center[1], mz = (a[2] + b[2] + c[2]) / 3 - center[2];
      if (fx * mx + fy * my + fz * mz < 0) { const t = b; b = c; c = t; const tu = ub; ub = uc; uc = tu; }
    }
    const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2];
    const vx = c[0] - a[0], vy = c[1] - a[1], vz = c[2] - a[2];
    let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
    const l = Math.hypot(nx, ny, nz);
    if (l < 1e-12) return;
    nx /= l; ny /= l; nz /= l;
    const cc = color || [1, 1, 1];
    for (const [p, u] of [[a, ua], [b, ub], [c, uc]]) {
      pos.push(p[0], p[1], p[2]); nor.push(nx, ny, nz); uvs.push(u[0], u[1]); col.push(cc[0], cc[1], cc[2]);
    }
  }
  function quad(a, b, c, d, rect, color) {
    const r = rect || [0, 0, 1, 1];
    const u00 = [r[0], r[1]], u10 = [r[2], r[1]], u11 = [r[2], r[3]], u01 = [r[0], r[3]];
    tri(a, b, c, u00, u10, u11, color);
    tri(a, c, d, u00, u11, u01, color);
  }
  function tri3(a, b, c, rect, color) {
    const r = rect || [0, 0, 1, 1];
    tri(a, b, c, [r[0], r[1]], [r[2], r[1]], [(r[0] + r[2]) / 2, r[3]], color);
  }
  function build() {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pos), 3));
    g.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(nor), 3));
    g.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), 2));
    g.setAttribute('color', new THREE.BufferAttribute(new Float32Array(col), 3));
    return g;
  }
  return { tri3, quad, build };
}

export function mat4(THREE, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, sx = 1, sy = sx, sz = sx) {
  const m = new THREE.Matrix4();
  m.compose(new THREE.Vector3(x, y, z), new THREE.Quaternion().setFromEuler(new THREE.Euler(rx, ry, rz)), new THREE.Vector3(sx, sy, sz));
  return m;
}

export const clamp = (x, a, b) => (x < a ? a : x > b ? b : x);
export const smoothstep = (a, b, x) => { const t = clamp((x - a) / Math.max(EPS, b - a), 0, 1); return t * t * (3 - 2 * t); };
export const lerp = (a, b, t) => a + (b - a) * t;
