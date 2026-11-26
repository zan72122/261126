// Parametric geometry builders. Everything is made from numbers; nothing is loaded.
// createGeom(THREE) returns the builders so that three.js is never imported here.

export function createGeom(THREE) {
  // Merge geometries (position, normal, optional uv / color) into one indexed geometry. Inputs are disposed.
  function merge(parts) {
    let nv = 0, ni = 0;
    for (const g of parts) { nv += g.attributes.position.count; ni += g.index ? g.index.count : g.attributes.position.count; }
    const pos = new Float32Array(nv * 3), nor = new Float32Array(nv * 3), uv = new Float32Array(nv * 2), col = new Float32Array(nv * 3).fill(1);
    const idx = nv > 65535 ? new Uint32Array(ni) : new Uint16Array(ni);
    let vo = 0, io = 0;
    for (const g of parts) {
      const a = g.attributes, cnt = a.position.count;
      pos.set(a.position.array, vo * 3);
      if (a.normal) nor.set(a.normal.array, vo * 3);
      if (a.uv) uv.set(a.uv.array, vo * 2);
      if (a.color) col.set(a.color.array, vo * 3);
      if (g.index) { const src = g.index.array; for (let i = 0; i < src.length; i++) idx[io++] = src[i] + vo; }
      else for (let i = 0; i < cnt; i++) idx[io++] = vo + i;
      vo += cnt;
      g.dispose();
    }
    const out = new THREE.BufferGeometry();
    out.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    out.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
    out.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    out.setAttribute('color', new THREE.BufferAttribute(col, 3));
    out.setIndex(new THREE.BufferAttribute(idx, 1));
    out.computeBoundingSphere();
    return out;
  }

  const _c = new THREE.Color();
  function paint(geo, hex) {
    _c.set(hex);
    const n = geo.attributes.position.count, a = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { a[i * 3] = _c.r; a[i * 3 + 1] = _c.g; a[i * 3 + 2] = _c.b; }
    geo.setAttribute('color', new THREE.BufferAttribute(a, 3));
    return geo;
  }

  // Geometry from raw arrays.
  function raw(pos, nor, uv, idx) {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pos), 3));
    g.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(nor), 3));
    if (uv) g.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uv), 2));
    g.setIndex(idx);
    return g;
  }

  // Box with rounded edges and corners (smooth normals). m = segments per rounded corner.
  // UVs are a box projection with the given period (metres per texture repeat).
  function roundedBox(w, h, d, r, m = 3, uvPeriod = 1.5) {
    const half = [w / 2, h / 2, d / 2];
    r = Math.min(r, half[0], half[1], half[2]);
    const e = [half[0] - r, half[1] - r, half[2] - r];
    const ts = [], sg = [];
    for (let i = 0; i <= m; i++) { ts.push(Math.tan((-1 + i / m) * Math.PI / 4)); sg.push(-1); }
    for (let i = 0; i <= m; i++) { ts.push(Math.tan((i / m) * Math.PI / 4)); sg.push(1); }
    const n1 = ts.length;
    const pos = [], nor = [], uv = [], idx = [];
    const p = [0, 0, 0], c = [0, 0, 0];
    for (let axis = 0; axis < 3; axis++) for (const s of [1, -1]) {
      let ua = (axis + 1) % 3, va = (axis + 2) % 3;
      if (s < 0) { const t = ua; ua = va; va = t; }
      const base = pos.length / 3;
      for (let b = 0; b < n1; b++) for (let a = 0; a < n1; a++) {
        c[axis] = s; c[ua] = ts[a]; c[va] = ts[b];
        const l = Math.hypot(c[0], c[1], c[2]);
        p[axis] = (c[axis] / l) * r + s * e[axis];
        p[ua] = (c[ua] / l) * r + sg[a] * e[ua];
        p[va] = (c[va] / l) * r + sg[b] * e[va];
        pos.push(p[0], p[1], p[2]);
        nor.push(c[0] / l, c[1] / l, c[2] / l);
        uv.push(p[ua] / uvPeriod + 0.5, p[va] / uvPeriod + 0.5);
      }
      for (let b = 0; b < n1 - 1; b++) for (let a = 0; a < n1 - 1; a++) {
        const i0 = base + b * n1 + a, i1 = i0 + 1, i2 = i0 + n1 + 1, i3 = i0 + n1;
        idx.push(i0, i1, i2, i0, i2, i3);
      }
    }
    return raw(pos, nor, uv, idx);
  }

  // Curved plow blade: an arc (radius R) extruded along x, concave side to +z.
  // Local frame: cutting edge on y = 0 at z = 0, the blade rises to y = height.
  function blade(width, height, R, thick = 0.05, segs = 8, uvPeriod = 1.5) {
    // the arc spans from below to above its centre so that it is `height` tall
    const a0 = -25 * Math.PI / 180;
    const a1 = Math.asin(Math.min(0.95, height / R + Math.sin(a0)));
    const zc = R * Math.cos(a0), yc = -R * Math.sin(a0);
    const hw = width / 2;
    const pos = [], nor = [], uv = [], idx = [];
    const quad = (i0, i1, i2, i3) => idx.push(i0, i1, i2, i0, i2, i3);
    const front = [], back = [];
    for (let i = 0; i <= segs; i++) {
      const a = a0 + (a1 - a0) * (i / segs), ca = Math.cos(a), sa = Math.sin(a);
      front.push({ z: zc - R * ca, y: yc + R * sa, nz: ca, ny: -sa });
      back.push({ z: zc - (R + thick) * ca, y: yc + (R + thick) * sa, nz: -ca, ny: sa });
    }
    // front and back sheets
    for (const [prof, flip] of [[front, false], [back, true]]) {
      const base = pos.length / 3;
      prof.forEach((q, i) => {
        for (const x of [-hw, hw]) { pos.push(x, q.y, q.z); nor.push(0, q.ny, q.nz); uv.push(x / uvPeriod + 0.5, (i / segs) * height / uvPeriod); }
      });
      for (let i = 0; i < segs; i++) {
        const a = base + i * 2, b = a + 1, c = a + 3, d = a + 2;
        if (flip) quad(a, d, c, b); else quad(a, b, c, d);
      }
    }
    // top and bottom rims, end caps (flat normals)
    const flat = (pts, n) => {
      const base = pos.length / 3;
      for (const q of pts) { pos.push(q[0], q[1], q[2]); nor.push(n[0], n[1], n[2]); uv.push(q[0] / uvPeriod + 0.5, q[1] / uvPeriod); }
      quad(base, base + 1, base + 2, base + 3);
    };
    const fT = front[segs], bT = back[segs], fB = front[0], bB = back[0];
    flat([[-hw, fT.y, fT.z], [hw, fT.y, fT.z], [hw, bT.y, bT.z], [-hw, bT.y, bT.z]], [0, 1, 0]);
    flat([[-hw, bB.y, bB.z], [hw, bB.y, bB.z], [hw, fB.y, fB.z], [-hw, fB.y, fB.z]], [0, -1, 0]);
    for (const sx of [-1, 1]) for (let i = 0; i < segs; i++) {
      const f0 = front[i], f1 = front[i + 1], b0 = back[i], b1 = back[i + 1], x = sx * hw;
      if (sx > 0) flat([[x, f0.y, f0.z], [x, b0.y, b0.z], [x, b1.y, b1.z], [x, f1.y, f1.z]], [1, 0, 0]);
      else flat([[x, b0.y, b0.z], [x, f0.y, f0.z], [x, f1.y, f1.z], [x, b1.y, b1.z]], [-1, 0, 0]);
    }
    return raw(pos, nor, uv, idx);
  }

  // Chunky wheel, axle along x: rounded tyre, tread lugs, coloured hub. Vertex colours, no texture.
  function wheel(R, W, lugs, tyreHex = 0x25272c, hubHex = 0xffc93c) {
    const parts = [];
    const prof = [[R * 0.52, -W / 2 + 0.02], [R - 0.06, -W / 2], [R - 0.012, -W / 2 + 0.05], [R - 0.012, W / 2 - 0.05], [R - 0.06, W / 2], [R * 0.52, W / 2 - 0.02]]
      .map(([x, y]) => new THREE.Vector2(x, y));
    parts.push(paint(new THREE.LatheGeometry(prof, 20).rotateZ(-Math.PI / 2), tyreHex));
    for (let i = 0; i < lugs; i++) {
      const a = (i / lugs) * Math.PI * 2;
      const lug = new THREE.BoxGeometry(W * 0.92, 0.05, 0.085).translate(i % 2 ? 0.01 : -0.01, R - 0.022, 0).rotateX(a);
      parts.push(paint(lug, 0x1b1c20));
    }
    parts.push(paint(new THREE.CylinderGeometry(R * 0.56, R * 0.56, W * 0.9, 16).rotateZ(Math.PI / 2), hubHex));
    parts.push(paint(new THREE.CylinderGeometry(R * 0.2, R * 0.2, W * 1.0, 10).rotateZ(Math.PI / 2), 0x8a8f99));
    return merge(parts);
  }

  // A sheet with thickness from a parametric surface fn(u, v, out[3]) (u, v in 0..1).
  // Outer side = the side the grid normal (du x dv) points away from; the inner side is offset by `thick`.
  function thickSheet(nu, nv, fn, thick) {
    const cols = nu + 1, rows = nv + 1, cnt = cols * rows;
    const P0 = new Float32Array(cnt * 3), Nn = new Float32Array(cnt * 3);
    const o = [0, 0, 0];
    for (let b = 0; b < rows; b++) for (let a = 0; a < cols; a++) { fn(a / nu, b / nv, o); P0.set(o, (b * cols + a) * 3); }
    const at = (a, b, k) => P0[(Math.min(rows - 1, Math.max(0, b)) * cols + Math.min(cols - 1, Math.max(0, a))) * 3 + k];
    for (let b = 0; b < rows; b++) for (let a = 0; a < cols; a++) {
      const ux = at(a + 1, b, 0) - at(a - 1, b, 0), uy = at(a + 1, b, 1) - at(a - 1, b, 1), uz = at(a + 1, b, 2) - at(a - 1, b, 2);
      const vx = at(a, b + 1, 0) - at(a, b - 1, 0), vy = at(a, b + 1, 1) - at(a, b - 1, 1), vz = at(a, b + 1, 2) - at(a, b - 1, 2);
      let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
      const l = Math.hypot(nx, ny, nz) || 1;
      Nn.set([nx / l, ny / l, nz / l], (b * cols + a) * 3);
    }
    const pos = [], nor = [], uv = [], idx = [];
    // inner (normal side) and outer (opposite side)
    for (const side of [1, -1]) {
      const base = pos.length / 3, off = side > 0 ? thick : 0;
      for (let k = 0; k < cnt; k++) {
        pos.push(P0[k * 3] + Nn[k * 3] * off, P0[k * 3 + 1] + Nn[k * 3 + 1] * off, P0[k * 3 + 2] + Nn[k * 3 + 2] * off);
        nor.push(Nn[k * 3] * side, Nn[k * 3 + 1] * side, Nn[k * 3 + 2] * side);
        uv.push((k % cols) / nu, Math.floor(k / cols) / nv);
      }
      for (let b = 0; b < nv; b++) for (let a = 0; a < nu; a++) {
        const i0 = base + b * cols + a, i1 = i0 + 1, i2 = i0 + cols + 1, i3 = i0 + cols;
        if (side > 0) idx.push(i0, i1, i2, i0, i2, i3); else idx.push(i0, i2, i1, i0, i3, i2);
      }
    }
    // rim: join the two sides along the border
    const border = [];
    for (let a = 0; a < nu; a++) border.push([a, 0, a + 1, 0]);
    for (let b = 0; b < nv; b++) border.push([nu, b, nu, b + 1]);
    for (let a = nu; a > 0; a--) border.push([a, nv, a - 1, nv]);
    for (let b = nv; b > 0; b--) border.push([0, b, 0, b - 1]);
    for (const [a0, b0, a1, b1] of border) {
      const k0 = (b0 * cols + a0) * 3, k1 = (b1 * cols + a1) * 3;
      const q = [
        [P0[k0], P0[k0 + 1], P0[k0 + 2]], [P0[k1], P0[k1 + 1], P0[k1 + 2]],
        [P0[k1] + Nn[k1] * thick, P0[k1 + 1] + Nn[k1 + 1] * thick, P0[k1 + 2] + Nn[k1 + 2] * thick],
        [P0[k0] + Nn[k0] * thick, P0[k0 + 1] + Nn[k0 + 1] * thick, P0[k0 + 2] + Nn[k0 + 2] * thick],
      ];
      const ex = q[1][0] - q[0][0], ey = q[1][1] - q[0][1], ez = q[1][2] - q[0][2];
      const fx = q[3][0] - q[0][0], fy = q[3][1] - q[0][1], fz = q[3][2] - q[0][2];
      let nx = ey * fz - ez * fy, ny = ez * fx - ex * fz, nz = ex * fy - ey * fx;
      const l = Math.hypot(nx, ny, nz) || 1;
      const base = pos.length / 3;
      for (const v of q) { pos.push(v[0], v[1], v[2]); nor.push(nx / l, ny / l, nz / l); uv.push(a0 / nu, b0 / nv); }
      idx.push(base, base + 1, base + 2, base, base + 2, base + 3);
    }
    return raw(pos, nor, uv, idx);
  }

  // Plastic toboggan: a shallow tray whose front curls up. Local frame: bottom on y = 0, +z forward.
  function sledShell(len, wid, curlR, sideH, thick) {
    // centre line in the z-y plane: small rear lip, flat run, front curl (110 degrees)
    const zRear = -len / 2, zCurl = len / 2 - curlR - 0.06;
    const path = [];
    path.push([zRear, 0.075], [zRear + 0.03, 0.03], [zRear + 0.08, 0.004]);
    const flatN = 6;
    for (let i = 1; i <= flatN; i++) path.push([zRear + 0.08 + (zCurl - zRear - 0.08) * (i / flatN), 0]);
    const curlN = 9, sweep = (110 * Math.PI) / 180;
    for (let i = 1; i <= curlN; i++) { const a = sweep * (i / curlN); path.push([zCurl + curlR * Math.sin(a), curlR - curlR * Math.cos(a)]); }
    const nP = path.length - 1;
    // cumulative length for an even parameter
    const acc = [0];
    for (let i = 1; i <= nP; i++) acc.push(acc[i - 1] + Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]));
    const total = acc[nP];
    const curlStart = acc[3 + flatN - 1] / total;
    const along = (s, out) => {
      const d = s * total;
      let i = 1;
      while (i < nP && acc[i] < d) i++;
      const t = (d - acc[i - 1]) / Math.max(1e-6, acc[i] - acc[i - 1]);
      const z = path[i - 1][0] + (path[i][0] - path[i - 1][0]) * t, y = path[i - 1][1] + (path[i][1] - path[i - 1][1]) * t;
      let tz = path[i][0] - path[i - 1][0], ty = path[i][1] - path[i - 1][1];
      const l = Math.hypot(tz, ty) || 1;
      tz /= l; ty /= l;
      out[0] = z; out[1] = y; out[2] = -ty; out[3] = tz;   // point, then the normal (z, y) that points into the tray
    };
    const q = [0, 0, 0, 0];
    const nu = 12, nv = 22;
    // u across the width, v along the length; du x dv must point into the tray
    return thickSheet(nu, nv, (u, v, out) => {
      along(v, q);
      const t = 1 - u * 2;                             // +1 = +x side
      const curl = Math.max(0, (v - curlStart) / (1 - curlStart));
      const rear = Math.max(0, 1 - v / 0.08);
      const hw = (wid / 2) * (1 - 0.32 * curl * curl) * (1 - 0.06 * rear);
      const at = Math.abs(t);
      const side = at > 0.6 ? Math.pow((at - 0.6) / 0.4, 1.6) : 0;
      const rise = sideH * side * (1 - 0.75 * curl);
      out[0] = t * hw;
      out[1] = q[1] + q[3] * rise;
      out[2] = q[0] + q[2] * rise;
    }, thick);
  }

  return { merge, paint, raw, roundedBox, blade, wheel, thickSheet, sledShell };
}
