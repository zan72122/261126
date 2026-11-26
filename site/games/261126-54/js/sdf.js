// Signed-distance modelling + naive surface nets mesher.
// Characters and soft props are sculpted as smooth unions of round cones / ellipsoids,
// so bodies come out as one continuous organic surface (no capsule seams).
import * as THREE from 'three';

export function smin(a, b, k) {
  if (k <= 0) return Math.min(a, b);
  const h = Math.max(k - Math.abs(a - b), 0) / k;
  return Math.min(a, b) - h * h * k * 0.25;
}
export function smax(a, b, k) { return -smin(-a, -b, k); }

export function sdSphere(x, y, z, cx, cy, cz, r) {
  const dx = x - cx, dy = y - cy, dz = z - cz;
  return Math.sqrt(dx * dx + dy * dy + dz * dz) - r;
}
export function sdEll(x, y, z, cx, cy, cz, rx, ry, rz) {
  const px = (x - cx) / rx, py = (y - cy) / ry, pz = (z - cz) / rz;
  const k0 = Math.sqrt(px * px + py * py + pz * pz);
  const qx = px / rx, qy = py / ry, qz = pz / rz;
  const k1 = Math.sqrt(qx * qx + qy * qy + qz * qz);
  return k1 < 1e-9 ? -Math.min(rx, ry, rz) : k0 * (k0 - 1) / k1;
}
// iq round cone between a and b with radii r1, r2
export function sdRC(x, y, z, ax, ay, az, bx, by, bz, r1, r2) {
  const bax = bx - ax, bay = by - ay, baz = bz - az;
  const l2 = bax * bax + bay * bay + baz * baz;
  const rr = r1 - r2, a2 = l2 - rr * rr, il2 = 1 / l2;
  const pax = x - ax, pay = y - ay, paz = z - az;
  const yv = pax * bax + pay * bay + paz * baz;
  const zv = yv - l2;
  const xx = pax * l2 - bax * yv, xy = pay * l2 - bay * yv, xz = paz * l2 - baz * yv;
  const x2 = xx * xx + xy * xy + xz * xz;
  const y2 = yv * yv * l2, z2 = zv * zv * l2;
  const k = Math.sign(rr) * rr * rr * x2;
  if (Math.sign(zv) * a2 * z2 > k) return Math.sqrt(x2 + z2) * il2 - r2;
  if (Math.sign(yv) * a2 * y2 < k) return Math.sqrt(x2 + y2) * il2 - r1;
  return (Math.sqrt(x2 * a2 * il2) + yv * rr) * il2 - r1;
}
export function sdRBox(x, y, z, cx, cy, cz, hx, hy, hz, r) {
  const qx = Math.abs(x - cx) - hx + r, qy = Math.abs(y - cy) - hy + r, qz = Math.abs(z - cz) - hz + r;
  const mx = Math.max(qx, 0), my = Math.max(qy, 0), mz = Math.max(qz, 0);
  return Math.sqrt(mx * mx + my * my + mz * mz) + Math.min(Math.max(qx, Math.max(qy, qz)), 0) - r;
}

// Primitive list evaluation. prim: [type, blendK, ...params]; type 0 sphere,1 ellipsoid,2 roundcone,3 rbox, negative k = smooth subtract
export function evalList(list, x, y, z) {
  let d = 1e9;
  for (let i = 0; i < list.length; i++) {
    const p = list[i];
    let e;
    switch (p[0]) {
      case 0: e = sdSphere(x, y, z, p[2], p[3], p[4], p[5]); break;
      case 1: e = sdEll(x, y, z, p[2], p[3], p[4], p[5], p[6], p[7]); break;
      case 2: e = sdRC(x, y, z, p[2], p[3], p[4], p[5], p[6], p[7], p[8], p[9]); break;
      case 3: e = sdRBox(x, y, z, p[2], p[3], p[4], p[5], p[6], p[7], p[8]); break;
    }
    const k = p[1];
    if (k < 0) d = smax(d, -e, -k); else d = i === 0 ? e : smin(d, e, k);
  }
  return d;
}

/**
 * Surface nets polygonisation.
 * f(x,y,z) -> signed distance. opts.uv(x,y,z,nx,ny,nz)->[u,v]
 */
export function meshSDF(f, min, max, res, opts = {}) {
  const nx = Math.max(2, Math.ceil((max[0] - min[0]) / res) + 1);
  const ny = Math.max(2, Math.ceil((max[1] - min[1]) / res) + 1);
  const nz = Math.max(2, Math.ceil((max[2] - min[2]) / res) + 1);
  const sx = (max[0] - min[0]) / (nx - 1), sy = (max[1] - min[1]) / (ny - 1), sz = (max[2] - min[2]) / (nz - 1);
  const N = nx * ny * nz;
  const val = new Float32Array(N);
  let o = 0;
  for (let k = 0; k < nz; k++) {
    const z = min[2] + k * sz;
    for (let j = 0; j < ny; j++) {
      const y = min[1] + j * sy;
      for (let i = 0; i < nx; i++) { val[o++] = f(min[0] + i * sx, y, z); }
    }
  }
  const idx = (i, j, k) => i + nx * (j + ny * k);
  const cx = nx - 1, cy = ny - 1, cz = nz - 1;
  const cellV = new Int32Array(cx * cy * cz).fill(-1);
  const pos = [];
  const corner = new Float32Array(8);
  const E = [[0, 1], [2, 3], [4, 5], [6, 7], [0, 2], [1, 3], [4, 6], [5, 7], [0, 4], [1, 5], [2, 6], [3, 7]];
  const CO = [[0, 0, 0], [1, 0, 0], [0, 1, 0], [1, 1, 0], [0, 0, 1], [1, 0, 1], [0, 1, 1], [1, 1, 1]];
  for (let k = 0; k < cz; k++) for (let j = 0; j < cy; j++) for (let i = 0; i < cx; i++) {
    let mask = 0;
    for (let c = 0; c < 8; c++) {
      const v = val[idx(i + CO[c][0], j + CO[c][1], k + CO[c][2])];
      corner[c] = v; if (v < 0) mask |= 1 << c;
    }
    if (mask === 0 || mask === 255) continue;
    let ax = 0, ay = 0, az = 0, n = 0;
    for (let e = 0; e < 12; e++) {
      const a = E[e][0], b = E[e][1];
      const va = corner[a], vb = corner[b];
      if ((va < 0) === (vb < 0)) continue;
      const t = va / (va - vb);
      ax += CO[a][0] + (CO[b][0] - CO[a][0]) * t;
      ay += CO[a][1] + (CO[b][1] - CO[a][1]) * t;
      az += CO[a][2] + (CO[b][2] - CO[a][2]) * t;
      n++;
    }
    cellV[i + cx * (j + cy * k)] = pos.length / 3;
    pos.push(min[0] + (i + ax / n) * sx, min[1] + (j + ay / n) * sy, min[2] + (k + az / n) * sz);
  }
  const ind = [];
  const cv = (i, j, k) => cellV[i + cx * (j + cy * k)];
  for (let k = 0; k < nz; k++) for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
    const v0 = val[idx(i, j, k)] < 0;
    if (i < cx && j > 0 && k > 0 && j < cy && k < cz) {
      const v1 = val[idx(i + 1, j, k)] < 0;
      if (v0 !== v1) quad(cv(i, j - 1, k - 1), cv(i, j, k - 1), cv(i, j, k), cv(i, j - 1, k), v0);
    }
    if (j < cy && i > 0 && k > 0 && i < cx && k < cz) {
      const v1 = val[idx(i, j + 1, k)] < 0;
      if (v0 !== v1) quad(cv(i - 1, j, k - 1), cv(i - 1, j, k), cv(i, j, k), cv(i, j, k - 1), v0);
    }
    if (k < cz && i > 0 && j > 0 && i < cx && j < cy) {
      const v1 = val[idx(i, j, k + 1)] < 0;
      if (v0 !== v1) quad(cv(i - 1, j - 1, k), cv(i, j - 1, k), cv(i, j, k), cv(i - 1, j, k), v0);
    }
  }
  function quad(a, b, c, d, flip) {
    if (a < 0 || b < 0 || c < 0 || d < 0) return;
    if (flip) ind.push(a, b, c, a, c, d); else ind.push(a, c, b, a, d, c);
  }
  // project to surface + gradient normals
  const P = new Float32Array(pos), Nn = new Float32Array(pos.length);
  const h = res * 0.25;
  for (let v = 0; v < P.length; v += 3) {
    let x = P[v], y = P[v + 1], z = P[v + 2];
    let gx = 0, gy = 0, gz = 0;
    for (let it = 0; it < 2; it++) {
      const d = f(x, y, z);
      gx = f(x + h, y, z) - f(x - h, y, z);
      gy = f(x, y + h, z) - f(x, y - h, z);
      gz = f(x, y, z + h) - f(x, y, z - h);
      const l = Math.sqrt(gx * gx + gy * gy + gz * gz) || 1;
      gx /= l; gy /= l; gz /= l;
      const step = Math.max(-res * 0.6, Math.min(res * 0.6, d));
      x -= gx * step; y -= gy * step; z -= gz * step;
    }
    P[v] = x; P[v + 1] = y; P[v + 2] = z;
    Nn[v] = gx; Nn[v + 1] = gy; Nn[v + 2] = gz;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(P, 3));
  g.setAttribute('normal', new THREE.BufferAttribute(Nn, 3));
  if (opts.uv) {
    const U = new Float32Array(P.length / 3 * 2);
    for (let v = 0, w = 0; v < P.length; v += 3, w += 2) {
      const r = opts.uv(P[v], P[v + 1], P[v + 2], Nn[v], Nn[v + 1], Nn[v + 2]);
      U[w] = r[0]; U[w + 1] = r[1];
    }
    g.setAttribute('uv', new THREE.BufferAttribute(U, 2));
  }
  if (opts.color) {
    const C = new Float32Array(P.length);
    for (let v = 0; v < P.length; v += 3) {
      const r = opts.color(P[v], P[v + 1], P[v + 2], Nn[v], Nn[v + 1], Nn[v + 2]);
      C[v] = r[0]; C[v + 1] = r[1]; C[v + 2] = r[2];
    }
    g.setAttribute('color', new THREE.BufferAttribute(C, 3));
  }
  g.setIndex(P.length / 3 > 65535 ? new THREE.Uint32BufferAttribute(ind, 1) : new THREE.Uint16BufferAttribute(ind, 1));
  g.computeBoundingSphere();
  return g;
}

// cylindrical UV around Y axis (meters, for tiling textures)
export function cylUV(cx = 0, cz = 0, circ = 0.6) {
  return (x, y, z) => [(Math.atan2(x - cx, z - cz) / (Math.PI * 2) + 0.5) * circ, y];
}
