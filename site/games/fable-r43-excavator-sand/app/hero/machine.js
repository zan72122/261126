// ショベルカーの形（パラメータから作る）と、解いた姿勢の反映。
// 剛体ごとに「黄色い樹脂」と「塗り（頂点色）」の2メッシュに結合。シリンダーとリンクは InstancedMesh。
import { createGeo } from './geo.js';
import { bucketOutline } from './kin.js';

const C = {
  rubber: 0x2b2d33, pad: 0x3b3e46, frame: 0x4a4e58, hub: 0x8b9099, cap: 0xf2b417,
  glass: 0x20384f, roof: 0x34373f, beacon: 0xff7a1a, pinc: 0x9aa0aa, tube: 0x3a3d46, rod: 0xe3e8ee,
  tooth: 0xc9ced6, edge: 0x565b66, link: 0x4a4e58, vent: 0x2e3138,
};

export function createMachine(THREE, P, kin, opts) {
  const G = createGeo(THREE);
  const tier = opts.tier;
  const disposables = [];
  const keep = (x) => { disposables.push(x); return x; };
  const shadows = !!tier.shadows;

  // ---- マテリアル ----
  const yellowMat = keep(new THREE.MeshPhongMaterial({ map: opts.textures.toyYellow, color: 0xffffff, specular: 0x3a3a34, shininess: 42 }));
  const bucketMat = keep(new THREE.MeshPhongMaterial({ map: opts.textures.toyYellow, color: 0xffffff, specular: 0x3a3a34, shininess: 42, emissive: 0x000000 }));
  const paintMat = keep(new THREE.MeshPhongMaterial({ vertexColors: true, specular: 0x222222, shininess: 24 }));

  let triCount = 0;
  function mesh(geos, mat, parent, colored) {
    const g = keep(G.merge(geos, colored));
    triCount += g.attributes.position.count / 3;
    const m = new THREE.Mesh(g, mat);
    m.castShadow = shadows;
    parent.add(m);
    return m;
  }

  // ================= 足回り（動かない）=================
  const base = new THREE.Group();
  base.name = 'excavator';
  base.position.copy(opts.excavator.position);
  base.rotation.y = opts.excavator.yaw || 0;
  {
    const parts = [];
    const hl = P.trackL / 2, r = P.trackH / 2;
    const stadium = [];
    G.arc(hl - r, r, r, -Math.PI / 2, Math.PI / 2, 6, stadium);
    G.arc(-(hl - r), r, r, Math.PI / 2, (3 * Math.PI) / 2, 6, stadium);
    // 履帯の突起の位置（周長に沿って等間隔）
    const straight = 2 * (hl - r), per = 2 * straight + 2 * Math.PI * r;
    const pads = 24;
    for (const sx of [-1, 1]) {
      const cx = (sx * P.gauge) / 2;
      parts.push(G.paint(G.plate(stadium, P.trackW, 0.012, cx), C.rubber));
      for (let k = 0; k < pads; k++) {
        let s = ((k + 0.5) / pads) * per, u, v, ang;
        if (s < straight) { u = -(hl - r) + s; v = 0; ang = 0; }
        else if ((s -= straight) < Math.PI * r) { const a = -Math.PI / 2 + s / r; u = hl - r + Math.cos(a) * r; v = r + Math.sin(a) * r; ang = a + Math.PI / 2; }
        else if ((s -= Math.PI * r) < straight) { u = hl - r - s; v = 2 * r; ang = Math.PI; }
        else { s -= straight; const a = Math.PI / 2 + s / r; u = -(hl - r) + Math.cos(a) * r; v = r + Math.sin(a) * r; ang = a + Math.PI / 2; }
        const b = G.box(P.trackW + 0.008, 0.012, 0.03);
        b.rotateX(ang);
        b.translate(cx, v, -u);
        parts.push(G.paint(b, C.pad));
      }
      // 起動輪・遊動輪・下転輪（外側に少し出す）
      const wl = P.trackW + 0.014;
      for (const e of [-1, 1]) {
        parts.push(G.paint(G.pin(P.wheelR - 0.012, wl, e * (hl - r), r, cx, 12), C.hub));
        parts.push(G.paint(G.pin(0.02, wl + 0.008, e * (hl - r), r, cx, 8), C.cap));
      }
      for (let k = 0; k < P.rollers; k++) {
        const u = -(hl - r) * 0.62 + ((hl - r) * 1.24 * k) / (P.rollers - 1);
        parts.push(G.paint(G.pin(0.021, wl, u, 0.03, cx, 8), C.hub));
      }
      // 履帯フレーム
      parts.push(G.paint(G.box(P.trackW + 0.004, 0.04, straight * 0.96, cx, 0.062, 0), C.frame));
    }
    parts.push(G.paint(G.box(P.gauge - P.trackW + 0.02, 0.07, 0.3, 0, 0.085, 0), C.frame));
    parts.push(G.paint(G.cylY(0.125, 0.115, P.swingY - 0.1, 16, 0, 0.1, 0), C.frame));
    mesh(parts, paintMat, base, true);
  }

  // ================= 旋回体 =================
  const turret = new THREE.Group();
  turret.position.y = P.swingY;
  base.add(turret);
  const cabPoint = new THREE.Vector3((P.cab.x0 + P.cab.x1) / 2, P.deck.h + P.cab.h * 0.55, -(P.cab.u0 + P.cab.u1) / 2);
  {
    const d = P.deck, cb = P.cab, ax = P.armX;
    const y = [], p = [];
    // 本体（前が四角・後ろが丸いカウンタウェイト）
    y.push(G.slab(G.roundRect(-d.halfW, -d.back, d.halfW, d.front, [0.14, 0.14, 0.035, 0.035], 4), 0, d.h, 0.014));
    // エンジンカバー
    y.push(G.slab(G.roundRect(-d.halfW + 0.022, -d.back + 0.018, d.halfW - 0.022, cb.u0 - 0.012, [0.12, 0.12, 0.02, 0.02], 4), d.h - 0.01, 0.1, 0.02));
    // 運転席
    y.push(G.slab(G.roundRect(cb.x0, cb.u0, cb.x1, cb.u1, 0.03, 3), d.h - 0.01, cb.h + 0.01, 0.018));
    // ブームの受け（2枚の板）
    const br = [[0.035, 0.085], [0.1, 0.172], [0.168, 0.172], [0.268, 0.05], [0.262, -0.012], [0.19, -0.012], [0.19, 0.085]];
    for (const s of [-1, 1]) y.push(G.plate(br, 0.012, 0.003, ax + s * 0.041));
    // 窓（濃いガラス）
    const gy = d.h + cb.h * 0.56, gh = cb.h * 0.5, cw = cb.x1 - cb.x0, cl = cb.u1 - cb.u0, cxm = (cb.x0 + cb.x1) / 2, cum = (cb.u0 + cb.u1) / 2;
    p.push(G.paint(G.box(cw - 0.05, gh, 0.006, cxm, gy, -cb.u1), C.glass));
    p.push(G.paint(G.box(cw - 0.06, gh * 0.8, 0.006, cxm, gy + gh * 0.08, -cb.u0), C.glass));
    p.push(G.paint(G.box(0.006, gh, cl - 0.06, cb.x0, gy, -cum), C.glass));
    p.push(G.paint(G.box(0.006, gh, cl - 0.06, cb.x1, gy, -cum), C.glass));
    // 屋根・回転灯
    p.push(G.paint(G.slab(G.roundRect(cb.x0 - 0.008, cb.u0 - 0.008, cb.x1 + 0.008, cb.u1 + 0.014, 0.03, 3), d.h + cb.h - 0.004, 0.018, 0.006), C.roof));
    p.push(G.paint(G.cylY(0.017, 0.013, 0.024, 8, cxm, d.h + cb.h + 0.014, -cum + 0.03), C.beacon));
    // エンジンカバーの溝・排気管
    for (let k = 0; k < 3; k++) p.push(G.paint(G.box(0.16, 0.004, 0.012, 0.03, d.h + 0.091, 0.12 + k * 0.035), C.vent));
    p.push(G.paint(G.cylY(0.012, 0.012, 0.07, 8, d.halfW - 0.07, d.h + 0.085, 0.2), C.frame));
    // 後ろのバンパー帯
    p.push(G.paint(G.slab(G.roundRect(-d.halfW - 0.004, -d.back - 0.004, d.halfW + 0.004, -d.back + 0.16, [0.142, 0.142, 0, 0], 4), 0.012, 0.03, 0.004), C.roof));
    // ピン
    p.push(G.paint(G.pin(0.016, 0.105, P.boomPivot.u, P.boomPivot.v, ax), C.pinc));
    p.push(G.paint(G.pin(0.012, 2 * P.boomCyl.side + 0.04, P.boomCyl.a.u, P.boomCyl.a.v, ax), C.pinc));
    mesh(y, yellowMat, turret, false);
    mesh(p, paintMat, turret, true);
  }

  // ================= ブーム（バナナ形）=================
  const boom = new THREE.Group();
  boom.position.set(P.armX, P.boomPivot.v, -P.boomPivot.u);
  turret.add(boom);
  {
    const L1 = P.L1, bend = P.boomBend, k = P.boomBendAt;
    const sTot = L1 / Math.sqrt(k * k + (1 - k) * (1 - k) + 2 * k * (1 - k) * Math.cos(bend));
    const a = k * sTot, b = (1 - k) * sTot;
    const apexQ = (a * b * Math.sin(bend)) / L1, apexP = Math.sqrt(Math.max(0, a * a - apexQ * apexQ));
    // 中心線：根元 → 頂点（丸める）→ 先
    const ctr = [];
    const A = [0, 0], M = [apexP, apexQ], Z = [L1, 0];
    const lerp2 = (p0, p1, t) => [p0[0] + (p1[0] - p0[0]) * t, p0[1] + (p1[1] - p0[1]) * t];
    const q0 = lerp2(A, M, 0.62), q1 = lerp2(M, Z, 0.38);
    ctr.push(A, lerp2(A, M, 0.31));
    for (let i = 0; i <= 6; i++) { const t = i / 6, s = 1 - t; ctr.push([s * s * q0[0] + 2 * s * t * M[0] + t * t * q1[0], s * s * q0[1] + 2 * s * t * M[1] + t * t * q1[1]]); }
    ctr.push(lerp2(M, Z, 0.69), Z);
    const n = ctr.length, top = [], bot = [];
    for (let i = 0; i < n; i++) {
      const p0 = ctr[Math.max(0, i - 1)], p1 = ctr[Math.min(n - 1, i + 1)];
      let tx = p1[0] - p0[0], ty = p1[1] - p0[1];
      const tl = Math.hypot(tx, ty) || 1; tx /= tl; ty /= tl;
      const f = ctr[i][0] / L1;
      const wgt = f < k ? f / k : (1 - f) / (1 - k);
      const hd = 0.036 + 0.02 * wgt * wgt * (3 - 2 * wgt) - 0.006 * f;
      top.push([ctr[i][0] - ty * hd, ctr[i][1] + tx * hd]);
      bot.push([ctr[i][0] + ty * hd, ctr[i][1] - tx * hd]);
    }
    const outline = [];
    const ang0 = Math.atan2(ctr[1][1], ctr[1][0]);
    G.arc(0, 0, 0.04, ang0 + Math.PI / 2 + 0.3, ang0 + (3 * Math.PI) / 2 - 0.3, 4, outline);
    for (let i = 1; i < n - 1; i++) outline.push(bot[i]);
    const ang1 = Math.atan2(Z[1] - ctr[n - 2][1], Z[0] - ctr[n - 2][0]);
    G.arc(L1, 0, 0.032, ang1 - Math.PI / 2 + 0.3, ang1 + Math.PI / 2 - 0.3, 4, outline);
    for (let i = n - 2; i >= 1; i--) outline.push(top[i]);
    const y = [G.plate(outline, P.boomW, 0.01)];
    // アームシリンダーの受け
    const ac = P.armCyl.a;
    const lug = [[ac.p - 0.07, ac.q - 0.04], [ac.p - 0.012, ac.q + 0.018], [ac.p + 0.014, ac.q + 0.018], [ac.p + 0.06, ac.q - 0.04]];
    for (const s of [-1, 1]) y.push(G.plate(lug, 0.008, 0.002, s * 0.024));
    const p = [];
    p.push(G.paint(G.pin(0.011, 0.066, ac.p, ac.q, 0, 8), C.pinc));
    p.push(G.paint(G.pin(0.012, 2 * P.boomCyl.side + 0.04, P.boomCyl.c.p, P.boomCyl.c.q, 0, 8), C.pinc));
    p.push(G.paint(G.pin(0.015, P.boomW + 0.02, L1, 0, 0), C.pinc));
    mesh(y, yellowMat, boom, false);
    mesh(p, paintMat, boom, true);
  }

  // ================= アーム =================
  const arm = new THREE.Group();
  arm.position.set(0, 0, -P.L1);
  boom.add(arm);
  {
    const L2 = P.L2, cc = P.armCyl.c, ka = P.bucketCyl.a, nn = P.link.n;
    const outline = [
      [cc.p - 0.022, cc.q - 0.012], [cc.p - 0.012, cc.q + 0.02], [cc.p + 0.02, cc.q + 0.024],
      [-0.01, 0.046], [0.12, 0.04], [L2 - 0.03, 0.025],
    ];
    G.arc(L2, 0, 0.026, Math.PI / 2 - 0.1, -Math.PI / 2 + 0.1, 5, outline);
    outline.push([L2 - 0.03, -0.025], [0.14, -0.04], [0.02, -0.046], [-0.04, -0.03]);
    const y = [G.plate(outline, P.armW, 0.008)];
    const lug = [[ka.p - 0.05, ka.q - 0.036], [ka.p - 0.012, ka.q + 0.016], [ka.p + 0.014, ka.q + 0.016], [ka.p + 0.06, ka.q - 0.036]];
    for (const s of [-1, 1]) y.push(G.plate(lug, 0.007, 0.002, s * 0.02));
    const p = [];
    p.push(G.paint(G.pin(0.01, 0.058, ka.p, ka.q, 0, 8), C.pinc));
    p.push(G.paint(G.pin(0.011, 0.064, cc.p, cc.q, 0, 8), C.pinc));
    p.push(G.paint(G.pin(0.01, 2 * P.link.sideH + 0.014, nn.p, nn.q, 0, 8), C.pinc));
    p.push(G.paint(G.pin(0.013, 0.1, L2, 0, 0), C.pinc));
    mesh(y, yellowMat, arm, false);
    mesh(p, paintMat, arm, true);
  }

  // ================= バケット =================
  // wrist：腕の平面に沿った「回らない」枠（−Z＝前、+Y＝上）。光る時はここを拡大する。
  const wrist = new THREE.Group();
  wrist.position.set(0, 0, -P.L2);
  arm.add(wrist);
  const bucket = new THREE.Group();
  wrist.add(bucket);
  const innerHalfW = P.bucketW / 2 - P.bucketWall;
  {
    const out = bucketOutline(P, 14);
    const n = out.length, wall = P.bucketWall;
    // 内側の輪郭（法線の向きに厚みぶん寄せる）
    const inn = [];
    for (let i = 0; i < n; i++) {
      const p0 = out[Math.max(0, i - 1)], p1 = out[Math.min(n - 1, i + 1)];
      let tx = p1[0] - p0[0], ty = p1[1] - p0[1];
      const tl = Math.hypot(tx, ty) || 1; tx /= tl; ty /= tl;
      // 輪郭は 上の縁→背→底→刃先 の順。内側は進行方向の右
      inn.push([out[i][0] + ty * wall, out[i][1] - tx * wall]);
    }
    const band = out.concat(inn.slice().reverse());
    const y = [G.plate(band, P.bucketW, 0.002)];
    for (const s of [-1, 1]) y.push(G.plate(out, wall, 0.002, s * (P.bucketW / 2 - wall / 2)));
    // 耳（ピンとリンクピンの受け）
    const q = P.link.q;
    const ear = [[-0.03, -0.02], [0.012, -0.024], [0.03, 0.0], [0.02, 0.05], [q.x + 0.02, q.y + 0.022], [q.x - 0.016, q.y + 0.02], [-0.045, 0.03]];
    for (const s of [-1, 1]) y.push(G.plate(ear, 0.009, 0.002, s * 0.038));
    const p = [];
    // 爪と刃
    const t3 = P.bucketCurve[3], t2 = P.bucketCurve[2];
    let tx = t3[0] - t2[0], ty = t3[1] - t2[1];
    const tl = Math.hypot(tx, ty); tx /= tl; ty /= tl;
    const nx = -ty, ny = tx;
    const pt = (a, b) => [t3[0] + tx * a + nx * b, t3[1] + ty * a + ny * b];
    p.push(G.paint(G.plate([pt(-0.035, 0.006), pt(0.004, 0.004), pt(0.004, -0.006), pt(-0.035, -0.008)], P.bucketW + 0.004, 0.001), C.edge));
    const tw = 0.03;
    for (let k = 0; k < P.teeth; k++) {
      const cx = -P.bucketW / 2 + tw / 2 + 0.012 + ((P.bucketW - tw - 0.024) * k) / (P.teeth - 1);
      p.push(G.paint(G.plate([pt(-0.022, 0.01), pt(0.036, 0.0), pt(-0.022, -0.012)], tw, 0.004, cx), C.tooth));
    }
    p.push(G.paint(G.pin(0.009, 2 * P.link.sideT + 0.014, q.x, q.y, 0, 8), C.pinc));
    const bm = mesh(y, bucketMat, bucket, false);
    bm.name = 'bucketShell';
    mesh(p, paintMat, bucket, true);
  }

  // ================= 油圧シリンダーとリンク（InstancedMesh）=================
  // 各シリンダーの伸縮範囲（1自由度なので走査で求める）→ 筒とロッドの長さ
  const sol = { pts: new Float32Array(16) };
  const range = (fn) => { let lo = Infinity, hi = -Infinity; for (let i = 0; i <= 60; i++) { const v = fn(i / 60); if (v < lo) lo = v; if (v > hi) hi = v; } return [lo, hi]; };
  const tmp = { pts: new Float32Array(16) };
  const probe = (th1, a2, psi) => { tmp.th1 = th1; tmp.a2 = a2; tmp.psi = psi; tmp.Eu = kin.B.u + P.L1 * Math.cos(th1); tmp.Ev = kin.B.v + P.L1 * Math.sin(th1); tmp.Wu = tmp.Eu + P.L2 * Math.cos(a2); tmp.Wv = tmp.Ev + P.L2 * Math.sin(a2); return kin.linkage(tmp); };
  const rBoom = range((t) => probe(P.boomMin + (P.boomMax - P.boomMin) * t, -1, -2).boomLen);
  const rArm = range((t) => probe(0.5, 0.5 - (Math.PI - P.elbowMax) - (P.elbowMax - P.elbowMin) * t, -2).armLen);
  const rBucket = range((t) => probe(0.5, -1, -1 + P.betaMin + (P.betaMax - P.betaMin) * t).bucketLen);
  const cylDef = [
    { r: P.boomCyl.r, rr: P.boomCyl.rodR, range: rBoom, x: -P.boomCyl.side, a: 0, c: 2 },
    { r: P.boomCyl.r, rr: P.boomCyl.rodR, range: rBoom, x: P.boomCyl.side, a: 0, c: 2 },
    { r: P.armCyl.r, rr: P.armCyl.rodR, range: rArm, x: 0, a: 4, c: 6 },
    { r: P.bucketCyl.r, rr: P.bucketCyl.rodR, range: rBucket, x: 0, a: 8, c: 10 },
  ];
  for (const c of cylDef) {
    c.tube = c.range[0] - 0.014;                 // 筒：一番縮んだ長さより少し短い
    c.rod = Math.min(c.range[0] - 0.004, Math.max(c.range[1] - c.tube + 0.02, c.range[0] * 0.6)); // ロッド：先端から筒の中まで
  }
  const tubeGeo = (() => {
    const a = new THREE.CylinderGeometry(1, 1, 0.9, 10); a.translate(0, 0.45, 0);
    const b = new THREE.CylinderGeometry(1.16, 1.16, 0.1, 10); b.translate(0, 0.95, 0);
    return keep(G.merge([G.paint(a, C.tube), G.paint(b, C.frame)], true));
  })();
  const rodGeo = (() => {
    const a = new THREE.CylinderGeometry(1, 1, 1, 8); a.translate(0, 0.5, 0);
    return keep(G.merge([G.paint(a, C.rod)], true));
  })();
  const tubes = new THREE.InstancedMesh(tubeGeo, paintMat, cylDef.length);
  const rods = new THREE.InstancedMesh(rodGeo, paintMat, cylDef.length);
  const linkGeo = (() => {
    const a = G.box(0.007, 1, 0.017, 0, 0.5, 0);
    return keep(G.merge([G.paint(a, C.link)], true));
  })();
  const links = new THREE.InstancedMesh(linkGeo, paintMat, 4);
  for (const im of [tubes, rods, links]) { im.frustumCulled = false; im.castShadow = shadows; turret.add(im); }
  triCount += (tubeGeo.attributes.position.count / 3 + rodGeo.attributes.position.count / 3) * cylDef.length + (linkGeo.attributes.position.count / 3) * 4;

  const m4 = new THREE.Matrix4(), q4 = new THREE.Quaternion(), v0 = new THREE.Vector3(), v1 = new THREE.Vector3(), sc = new THREE.Vector3();
  const up = new THREE.Vector3(0, 1, 0);
  // 腕の平面の点 (u, v) → 旋回体の局所座標
  function setBar(im, i, x, au, av, bu, bv, radius, len) {
    v0.set(x, av, -au);
    v1.set(0, bv - av, -(bu - au));
    const l = v1.length();
    if (l > 1e-6) v1.multiplyScalar(1 / l); else v1.set(0, 1, 0);
    q4.setFromUnitVectors(up, v1);
    sc.set(radius, len, radius);
    m4.compose(v0, q4, sc);
    im.setMatrixAt(i, m4);
  }

  // ================= バケットの中の砂 =================
  const NS = 8, NT = 6;
  const sandGeo = keep(new THREE.BufferGeometry());
  const sandPos = new Float32Array((NS + 1) * (NT + 1) * 3);
  {
    const uv = new Float32Array((NS + 1) * (NT + 1) * 2), wet = new Float32Array((NS + 1) * (NT + 1)).fill(0.9);
    const idx = [];
    for (let i = 0; i <= NS; i++) for (let j = 0; j <= NT; j++) {
      const k = i * (NT + 1) + j;
      uv[k * 2] = (i / NS) * 0.3 + 0.13; uv[k * 2 + 1] = (j / NT) * 0.37 + 0.41;
      if (i < NS && j < NT) idx.push(k, k + 1, k + NT + 1, k + 1, k + NT + 2, k + NT + 1);
    }
    sandGeo.setIndex(idx);
    const pa = new THREE.BufferAttribute(sandPos, 3); pa.setUsage(THREE.DynamicDrawUsage);
    sandGeo.setAttribute('position', pa);
    const na = new THREE.BufferAttribute(new Float32Array(sandPos.length), 3); na.setUsage(THREE.DynamicDrawUsage);
    sandGeo.setAttribute('normal', na);
    sandGeo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    sandGeo.setAttribute('wet', new THREE.BufferAttribute(wet, 1));
    sandGeo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, -0.05, 0), 0.4);
  }
  const sandMesh = new THREE.Mesh(sandGeo, opts.sandMaterial);
  sandMesh.visible = false;
  sandMesh.name = 'bucketSand';
  sandMesh.castShadow = false;
  wrist.add(sandMesh);
  triCount += NS * NT * 2;

  // 内側の輪郭（砂の断面の計算用。外側の輪郭を重心へ少し縮めたもの）
  const NO = kin.outline.length;
  const inR = new Float32Array(NO), inA = new Float32Array(NO);
  {
    let cx = 0, cy = 0;
    for (const p of kin.outline) { cx += p[0] / NO; cy += p[1] / NO; }
    for (let i = 0; i < NO; i++) {
      const x = cx + (kin.outline[i][0] - cx) * 0.9, y = cy + (kin.outline[i][1] - cy) * 0.9;
      inR[i] = Math.hypot(x, y); inA[i] = Math.atan2(y, x);
    }
  }
  const pu = new Float32Array(NO), pv = new Float32Array(NO);
  // 直線 v = c + m (u − ur) より下の面積と、直線が輪郭を切る u の範囲
  const cut = { area: 0, uA: 0, uB: 0 };
  function clipArea(c, m, ur) {
    let area = 0, uA = Infinity, uB = -Infinity;
    let px = pu[NO - 1], py = pv[NO - 1], pg = py - (c + m * (px - ur));
    let fx = 0, fy = 0, lx = 0, ly = 0, has = false;
    const emit = (x, y) => { if (!has) { fx = x; fy = y; has = true; } else area += lx * y - x * ly; lx = x; ly = y; };
    for (let i = 0; i < NO; i++) {
      const x = pu[i], y = pv[i], g = y - (c + m * (x - ur));
      if ((pg <= 0) !== (g <= 0)) {
        const t = pg / (pg - g);
        const ix = px + (x - px) * t, iy = py + (y - py) * t;
        if (ix < uA) uA = ix;
        if (ix > uB) uB = ix;
        emit(ix, iy);
      }
      if (g <= 0) emit(x, y);
      px = x; py = y; pg = g;
    }
    if (has) area += lx * fy - fx * ly;
    cut.area = Math.abs(area) / 2; cut.uA = uA; cut.uB = uB;
    return cut;
  }
  let sandPsi = 99, sandVol = -1;
  const TAN_REPOSE = P.repose;
  function updateSand(psi, vol) {
    if (vol <= 1e-6) { if (sandMesh.visible) { sandMesh.visible = false; sandVol = 0; } return; }
    if (Math.abs(psi - sandPsi) < 0.004 && Math.abs(vol - sandVol) < 2e-6 && sandMesh.visible) return;
    sandPsi = psi; sandVol = vol;
    let lo = Infinity, cu = 0;
    for (let i = 0; i < NO; i++) {
      const a = inA[i] + psi;
      pu[i] = inR[i] * Math.cos(a); pv[i] = inR[i] * Math.sin(a);
      if (pv[i] < lo) lo = pv[i];
      cu += pu[i] / NO;
    }
    // 低い方の縁から、内側へ安息角まで登る面が「いっぱい」
    const sU = pu[0], sV = pv[0], tU = pu[NO - 1], tV = pv[NO - 1];
    const tipLow = tV < sV;
    const lowU = tipLow ? tU : sU, lowV = tipLow ? tV : sV, hiU = tipLow ? sU : tU, hiV = tipLow ? sV : tV;
    const dir = hiU > lowU ? 1 : -1;
    // 面の傾き：安息角まで。ただし口の線（縁から縁）より急にはしない
    const mLip = Math.abs(hiV - lowV) / Math.max(1e-4, Math.abs(hiU - lowU));
    const rim = mLip <= TAN_REPOSE;        // 口の線がそのまま「いっぱい」の面
    const m = dir * Math.min(TAN_REPOSE, mLip);
    const want = vol / (2 * innerHalfW);
    let c = lowV;
    clipArea(c, m, lowU);
    let extra = 0, uA, uB;
    if (cut.area <= want) {
      extra = want - cut.area;
      if (rim) { uA = Math.min(lowU, hiU); uB = Math.max(lowU, hiU); }
      else { uA = Math.min(cut.uA, lowU); uB = Math.max(cut.uB, lowU); }
    } else {
      let a = lo - 0.02, b = lowV;
      for (let k = 0; k < 11; k++) { c = (a + b) / 2; if (clipArea(c, m, lowU).area > want) b = c; else a = c; }
      clipArea(c, m, lowU);
      uA = cut.uA; uB = cut.uB;
    }
    if (!(uB - uA > 1e-4)) { uA = lowU - 0.01; uB = lowU + 0.01; }
    const span = uB - uA;
    const dome = Math.min(0.055, (extra / Math.max(0.05, span)) * 1.5) + 0.01 * Math.min(1, vol / (P.bucketCap * 0.3));
    for (let i = 0; i <= NS; i++) {
      const s = i / NS, u = uA + span * s, vl = c + m * (u - lowU);
      for (let j = 0; j <= NT; j++) {
        const t = -1 + (2 * j) / NT, k = (i * (NT + 1) + j) * 3;
        const bump = dome * 4 * s * (1 - s) * (1 - t * t * 0.8) * (1 + 0.18 * Math.sin(i * 2.3 + j * 1.7));
        sandPos[k] = t * innerHalfW; sandPos[k + 1] = vl + bump; sandPos[k + 2] = -u;
      }
    }
    sandGeo.attributes.position.needsUpdate = true;
    sandGeo.computeVertexNormals();
    sandMesh.visible = true;
  }

  // ================= つかむ当たり判定・疑似影 =================
  const handle = new THREE.Mesh(keep(new THREE.BoxGeometry(0.46, 0.4, 0.46)), keep(new THREE.MeshBasicMaterial({ visible: false })));
  handle.name = 'bucketHandle';
  let blobBucket = null, blobBody = null, blobTex = null;
  if (!shadows) {
    const S = 32, data = new Uint8Array(S * S * 4);
    for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
      const d = Math.hypot(x - (S - 1) / 2, y - (S - 1) / 2) / (S / 2);
      const a = Math.max(0, 1 - d); data[(y * S + x) * 4 + 3] = Math.round(255 * a * a * (3 - 2 * a));
    }
    blobTex = keep(new THREE.DataTexture(data, S, S, THREE.RGBAFormat));
    blobTex.magFilter = THREE.LinearFilter; blobTex.minFilter = THREE.LinearFilter; blobTex.generateMipmaps = false;
    blobTex.name = 'heroBlob(data)';
    blobTex.needsUpdate = true;
    const g = keep(new THREE.PlaneGeometry(1, 1)); g.rotateX(-Math.PI / 2);
    const mk = (op) => { const m = new THREE.Mesh(g, keep(new THREE.MeshBasicMaterial({ map: blobTex, color: 0x000000, transparent: true, opacity: op, depthWrite: false }))); m.renderOrder = 1; return m; };
    blobBucket = mk(0.4); blobBody = mk(0.38);
    blobBody.scale.set(0.8, 1, 0.95); blobBody.position.copy(opts.excavator.position); blobBody.position.y += 0.012;
    triCount += 4;
  }

  // ================= 姿勢の反映 =================
  function applyPose(o, phi) {
    turret.rotation.y = phi;
    boom.rotation.x = o.th1;
    arm.rotation.x = o.a2 - o.th1;
    wrist.rotation.x = -o.a2;
    bucket.rotation.x = o.psi;
    const pts = o.pts;
    for (let i = 0; i < cylDef.length; i++) {
      const c = cylDef[i];
      const au = pts[c.a], av = pts[c.a + 1], cu = pts[c.c], cv = pts[c.c + 1];
      setBar(tubes, i, P.armX + c.x, au, av, cu, cv, c.r, c.tube);
      setBar(rods, i, P.armX + c.x, cu, cv, au, av, c.rr, c.rod);
    }
    const lk = P.link;
    for (let s = 0; s < 2; s++) {
      const sx = s ? 1 : -1;
      setBar(links, s, P.armX + sx * lk.sideH, pts[12], pts[13], pts[10], pts[11], 1, lk.l1);
      setBar(links, 2 + s, P.armX + sx * lk.sideT, pts[14], pts[15], pts[10], pts[11], 1, lk.l2);
    }
    tubes.instanceMatrix.needsUpdate = true; rods.instanceMatrix.needsUpdate = true; links.instanceMatrix.needsUpdate = true;
  }

  return {
    base, turret, wrist, bucket, bucketMat, handle, blobBucket, blobBody, cabPoint,
    applyPose, updateSand, sol,
    cylinders: cylDef.map((c) => ({ min: c.range[0], max: c.range[1], tube: c.tube, rod: c.rod })),
    get triangles() { return triCount; },
    onContextRestored() { if (blobTex) blobTex.needsUpdate = true; },
    dispose() { for (const d of disposables) d.dispose(); tubes.dispose(); rods.dispose(); links.dispose(); },
  };
}
