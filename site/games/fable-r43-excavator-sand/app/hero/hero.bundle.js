/* 生成物: npm run build:hero で app/hero/hero.js から作る。直接編集しない */
var __HERO__ = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // app/hero/hero.js
  var hero_exports = {};
  __export(hero_exports, {
    createHero: () => createHero
  });

  // app/hero/params.js
  var DEG = Math.PI / 180;
  var P = {
    // ---- 足回り ----
    trackL: 0.62,
    trackW: 0.12,
    trackH: 0.13,
    gauge: 0.4,
    wheelR: 0.056,
    rollers: 4,
    swingY: 0.16,
    // 旋回体の原点の高さ（足回りの上）
    // ---- 旋回体 ----
    deck: { halfW: 0.23, front: 0.2, back: 0.3, h: 0.1 },
    cab: { x0: -0.222, x1: -0.03, u0: -0.03, u1: 0.19, h: 0.27 },
    armX: 0.07,
    // 腕の平面の横ずれ（運転席の右）
    // ---- 腕 ----
    boomPivot: { u: 0.14, v: 0.12 },
    // ブームの根元（＝足回り原点から高さ 0.28）
    L1: 0.62,
    boomBend: 25 * DEG,
    boomBendAt: 0.55,
    boomW: 0.066,
    L2: 0.46,
    armW: 0.05,
    Lb: 0.2,
    bucketW: 0.26,
    bucketWall: 8e-3,
    teeth: 4,
    boomMin: -20 * DEG,
    boomMax: 84 * DEG,
    elbowMin: 34 * DEG,
    elbowMax: 172 * DEG,
    // ブームとアームの内角
    betaMin: -178 * DEG,
    betaMax: 32 * DEG,
    // バケット角（アームに対する刃先の向き）
    // ---- 油圧シリンダー（取付点）----
    boomCyl: { a: { u: 0.228, v: 0.018 }, c: { p: 0.33, q: 0.028 }, side: 0.068, r: 0.02, rodR: 0.011 },
    armCyl: { a: { p: 0.265, q: 0.118 }, c: { p: -0.105, q: 0.04 }, r: 0.022, rodR: 0.012 },
    bucketCyl: { a: { p: 0.055, q: 0.072 }, r: 0.019, rodR: 0.0105 },
    // ---- バケットリンク（4節）----
    link: { n: { p: 0.46 - 0.095, q: 0.012 }, q: { x: -0.012, y: 0.07 }, l1: 0.105, l2: 0.11, sideH: 0.031, sideT: 0.041 },
    // ---- バケットの側面形（ピン原点、x＝ピン→刃先、y＝底の側）：3次ベジェ ----
    bucketCurve: [[0, 0.016], [-0.036, 0.152], [0.1, 0.152], [0.2, 0]],
    // ---- バケットの姿勢 ----
    psiDig: -105 * DEG,
    // 掘る：刃先が下・少し手前
    psiCarry: -190 * DEG,
    // 運ぶ：口が上
    psiRest: -168 * DEG,
    // 空で待つ
    psiDump: -42 * DEG,
    // あける：口が下
    holdFull: -128 * DEG,
    holdNone: -70 * DEG,
    // この角度の間で持てる量が 1→0
    // ---- 届く範囲と動き ----
    reachMin: 0.5,
    reachMax: 1.27,
    wristVMax: 0.8,
    home: { x: 0.53, z: 0.27, hover: 0.13 },
    // 待機の位置（足回り中心から。前が −z）
    omega: 14,
    omegaPsi: 16,
    maxSwingSpeed: 3,
    maxLinSpeed: 2.6,
    maxPsiSpeed: 7,
    // ---- 砂 ----
    digDepth: 0.085,
    fullSkim: 0.015,
    minH: -0.22,
    maxH: 0.42,
    bucketCap: 45e-4,
    bedFullBuckets: 3.5,
    repose: Math.tan(34 * DEG),
    healLevel: -0.1,
    healTau: 60,
    wetTau: 70,
    pourTime: 0.6,
    // 満杯のバケットをあける時間の目安
    grainR: 0.011,
    gravity: 7,
    bedCells: [20, 24]
  };

  // app/hero/kin.js
  var clamp = (x, a, b) => x < a ? a : x > b ? b : x;
  var acosS = (x) => Math.acos(clamp(x, -1, 1));
  function bez(c, t, out) {
    const s = 1 - t, a = s * s * s, b = 3 * s * s * t, d = 3 * s * t * t, e = t * t * t;
    out[0] = a * c[0][0] + b * c[1][0] + d * c[2][0] + e * c[3][0];
    out[1] = a * c[0][1] + b * c[1][1] + d * c[2][1] + e * c[3][1];
    return out;
  }
  function bucketOutline(P2, n = 14) {
    const pts = [];
    const tmp = [0, 0];
    for (let i = 0; i <= n; i++) {
      bez(P2.bucketCurve, i / n, tmp);
      pts.push([tmp[0], tmp[1]]);
    }
    return pts;
  }
  function createKin(P2) {
    const { L1, L2, Lb } = P2;
    const B = P2.boomPivot;
    const RMAX = Math.sqrt(L1 * L1 + L2 * L2 - 2 * L1 * L2 * Math.cos(P2.elbowMax));
    const RMIN = Math.sqrt(L1 * L1 + L2 * L2 - 2 * L1 * L2 * Math.cos(P2.elbowMin));
    const relMin = Math.PI - P2.elbowMax, relMax = Math.PI - P2.elbowMin;
    const outline = bucketOutline(P2, 14);
    const NO = outline.length;
    const oR = new Float32Array(NO), oA = new Float32Array(NO);
    for (let i = 0; i < NO; i++) {
      oR[i] = Math.hypot(outline[i][0], outline[i][1]);
      oA[i] = Math.atan2(outline[i][1], outline[i][0]);
    }
    const ou = new Float32Array(NO), ov = new Float32Array(NO);
    let bowlArea = 0;
    for (let i = 0; i < NO; i++) {
      const a = outline[i], b = outline[(i + 1) % NO];
      bowlArea += a[0] * b[1] - b[0] * a[1];
    }
    bowlArea = Math.abs(bowlArea) / 2;
    function rotateOutline(psi) {
      let lo = Infinity;
      for (let i = 0; i < NO; i++) {
        const a = oA[i] + psi;
        ou[i] = oR[i] * Math.cos(a);
        ov[i] = oR[i] * Math.sin(a);
        if (ov[i] < lo) lo = ov[i];
      }
      return lo;
    }
    const fp = { uMin: 0, uMax: 0, uMid: 0, low: 0 };
    function footprint(psi, out = fp) {
      let lo = Infinity, a = Infinity, b = -Infinity;
      for (let i = 0; i < NO; i++) {
        const ang = oA[i] + psi;
        const u = oR[i] * Math.cos(ang), v = oR[i] * Math.sin(ang);
        if (v < lo) lo = v;
        if (u < a) a = u;
        if (u > b) b = u;
      }
      out.uMin = a;
      out.uMax = b;
      out.uMid = (a + b) / 2;
      out.low = lo;
      return out;
    }
    function underside(psi, out, range) {
      rotateOutline(psi);
      let a = Infinity, b = -Infinity;
      for (let i = 0; i < NO; i++) {
        if (ou[i] < a) a = ou[i];
        if (ou[i] > b) b = ou[i];
      }
      const K = out.length;
      for (let k = 0; k < K; k++) {
        const u = a + (b - a) * k / (K - 1);
        let lo = Infinity;
        for (let i = 0; i < NO; i++) {
          const j = (i + 1) % NO;
          const u0 = ou[i], u1 = ou[j];
          if ((u0 - u) * (u1 - u) > 0) continue;
          const du = u1 - u0;
          const v = Math.abs(du) < 1e-9 ? Math.min(ov[i], ov[j]) : ov[i] + (ov[j] - ov[i]) * (u - u0) / du;
          if (v < lo) lo = v;
        }
        out[k] = lo === Infinity ? 0 : lo;
      }
      range.uMin = a;
      range.uMax = b;
      return out;
    }
    function holdFrac(psi) {
      return clamp((P2.holdNone - psi) / (P2.holdNone - P2.holdFull), 0, 1);
    }
    function psiHold(f) {
      return P2.holdNone - clamp(f, 0, 1) * (P2.holdNone - P2.holdFull) - 0.06;
    }
    function solve(Wu, Wv, psi, o) {
      let dx = Wu - B.u, dy = Wv - B.v;
      let d = Math.hypot(dx, dy);
      if (!(d > 1e-6)) {
        dx = 1e-6;
        dy = 0;
        d = 1e-6;
      }
      const dc = clamp(d, RMIN, RMAX);
      let th1 = Math.atan2(dy, dx) + acosS((L1 * L1 + dc * dc - L2 * L2) / (2 * L1 * dc));
      th1 = clamp(th1, P2.boomMin, P2.boomMax);
      const Eu = B.u + L1 * Math.cos(th1), Ev = B.v + L1 * Math.sin(th1);
      const wu = B.u + dx / d * dc, wv = B.v + dy / d * dc;
      let a2 = Math.atan2(wv - Ev, wu - Eu);
      let rel = th1 - a2;
      while (rel < -Math.PI) rel += 2 * Math.PI;
      while (rel > Math.PI) rel -= 2 * Math.PI;
      rel = clamp(rel, relMin, relMax);
      a2 = th1 - rel;
      const Wu2 = Eu + L2 * Math.cos(a2), Wv2 = Ev + L2 * Math.sin(a2);
      const beta = clamp(psi - a2, P2.betaMin, P2.betaMax);
      const ps = a2 + beta;
      o.th1 = th1;
      o.a2 = a2;
      o.psi = ps;
      o.beta = beta;
      o.Eu = Eu;
      o.Ev = Ev;
      o.Wu = Wu2;
      o.Wv = Wv2;
      o.Tu = Wu2 + Lb * Math.cos(ps);
      o.Tv = Wv2 + Lb * Math.sin(ps);
      o.clamped = dc !== d;
      return o;
    }
    function rot(p, q, ang, ou_, ov_, out, k) {
      const c = Math.cos(ang), s = Math.sin(ang);
      out[k] = ou_ + p * c - q * s;
      out[k + 1] = ov_ + p * s + q * c;
    }
    const bc = P2.boomCyl, ac = P2.armCyl, kc = P2.bucketCyl, lk = P2.link;
    function linkage(o) {
      const pts = o.pts || (o.pts = new Float32Array(16));
      pts[0] = bc.a.u;
      pts[1] = bc.a.v;
      rot(bc.c.p, bc.c.q, o.th1, B.u, B.v, pts, 2);
      rot(ac.a.p, ac.a.q, o.th1, B.u, B.v, pts, 4);
      rot(ac.c.p, ac.c.q, o.a2, o.Eu, o.Ev, pts, 6);
      rot(kc.a.p, kc.a.q, o.a2, o.Eu, o.Ev, pts, 8);
      rot(lk.n.p, lk.n.q, o.a2, o.Eu, o.Ev, pts, 12);
      rot(lk.q.x, lk.q.y, o.psi, o.Wu, o.Wv, pts, 14);
      const Nu = pts[12], Nv = pts[13], Qu = pts[14], Qv = pts[15];
      let ex = Qu - Nu, ey = Qv - Nv;
      let dd = Math.hypot(ex, ey);
      if (!(dd > 1e-6)) {
        ex = 1e-6;
        ey = 0;
        dd = 1e-6;
      }
      const dn = clamp(dd, Math.abs(lk.l1 - lk.l2) + 1e-4, lk.l1 + lk.l2 - 1e-4);
      const a = (lk.l1 * lk.l1 - lk.l2 * lk.l2 + dn * dn) / (2 * dn);
      const h = Math.sqrt(Math.max(0, lk.l1 * lk.l1 - a * a));
      ex /= dd;
      ey /= dd;
      const mu = Nu + ex * a, mv = Nv + ey * a;
      let ju = mu - ey * h, jv = mv + ex * h;
      if ((ju - mu) * (o.Wu - mu) + (jv - mv) * (o.Wv - mv) > 0) {
        ju = mu + ey * h;
        jv = mv - ex * h;
      }
      pts[10] = ju;
      pts[11] = jv;
      o.boomLen = Math.hypot(pts[2] - pts[0], pts[3] - pts[1]);
      o.armLen = Math.hypot(pts[6] - pts[4], pts[7] - pts[5]);
      o.bucketLen = Math.hypot(pts[10] - pts[8], pts[11] - pts[9]);
      return o;
    }
    return { B, RMIN, RMAX, outline, bowlArea, solve, linkage, footprint, underside, rotateOutline, ou, ov, holdFrac, psiHold };
  }

  // app/hero/geo.js
  function createGeo(THREE) {
    const col = new THREE.Color();
    function shapeOf(pts) {
      const s = new THREE.Shape();
      for (let i = 0; i < pts.length; i++) i ? s.lineTo(pts[i][0], pts[i][1]) : s.moveTo(pts[i][0], pts[i][1]);
      s.closePath();
      return s;
    }
    function extrude(pts, depth, bevel) {
      const b = Math.max(0, Math.min(bevel || 0, depth / 2 - 1e-4));
      const g = new THREE.ExtrudeGeometry(shapeOf(pts), {
        depth: depth - 2 * b,
        steps: 1,
        curveSegments: 2,
        bevelEnabled: b > 0,
        bevelThickness: b,
        bevelSize: b,
        bevelOffset: -b,
        bevelSegments: 1
      });
      g.translate(0, 0, -(depth - 2 * b) / 2);
      return g;
    }
    function plate(pts, width, bevel = 0, cx = 0) {
      const g = extrude(pts, width, bevel);
      g.rotateY(Math.PI / 2);
      if (cx) g.translate(cx, 0, 0);
      return g;
    }
    function slab(pts, y0, h, bevel = 0) {
      const g = extrude(pts, h, bevel);
      g.rotateX(-Math.PI / 2);
      g.translate(0, y0 + h / 2, 0);
      return g;
    }
    function roundRect(x0, y0, x1, y1, r, seg = 3) {
      const rr = typeof r === "number" ? [r, r, r, r] : r;
      const pts = [];
      const corner = (cx, cy, rad, a0) => {
        if (rad <= 1e-5) {
          pts.push([cx, cy]);
          return;
        }
        for (let i = 0; i <= seg; i++) {
          const a = a0 + i / seg * (Math.PI / 2);
          pts.push([cx + Math.cos(a) * rad, cy + Math.sin(a) * rad]);
        }
      };
      corner(x0 + rr[0], y0 + rr[0], rr[0], Math.PI);
      corner(x1 - rr[1], y0 + rr[1], rr[1], -Math.PI / 2);
      corner(x1 - rr[2], y1 - rr[2], rr[2], 0);
      corner(x0 + rr[3], y1 - rr[3], rr[3], Math.PI / 2);
      return pts;
    }
    function arc(cx, cy, r, a0, a1, seg, out = []) {
      for (let i = 0; i <= seg; i++) {
        const a = a0 + (a1 - a0) * i / seg;
        out.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
      }
      return out;
    }
    function box(w, h, d, x = 0, y = 0, z = 0) {
      const g = new THREE.BoxGeometry(w, h, d);
      g.translate(x, y, z);
      return g;
    }
    function pin(r, len, p, q, cx = 0, seg = 10) {
      const g = new THREE.CylinderGeometry(r, r, len, seg);
      g.rotateZ(Math.PI / 2);
      g.translate(cx, q, -p);
      return g;
    }
    function cylY(r0, r1, h, seg, x = 0, y = 0, z = 0) {
      const g = new THREE.CylinderGeometry(r1, r0, h, seg);
      g.translate(x, y + h / 2, z);
      return g;
    }
    function paint(g, hex) {
      col.set(hex);
      const n = g.attributes.position.count;
      const a = new Float32Array(n * 3);
      for (let i = 0; i < n; i++) {
        a[i * 3] = col.r;
        a[i * 3 + 1] = col.g;
        a[i * 3 + 2] = col.b;
      }
      g.setAttribute("color", new THREE.BufferAttribute(a, 3));
      return g;
    }
    function merge(list, withColor = false) {
      const parts = [];
      let total = 0;
      for (const g0 of list) {
        const g = g0.index ? g0.toNonIndexed() : g0;
        if (g !== g0) g0.dispose();
        if (!g.attributes.normal) g.computeVertexNormals();
        parts.push(g);
        total += g.attributes.position.count;
      }
      const pos = new Float32Array(total * 3), nor = new Float32Array(total * 3), uv = new Float32Array(total * 2);
      const colr = withColor ? new Float32Array(total * 3).fill(1) : null;
      let o = 0;
      for (const g of parts) {
        const n = g.attributes.position.count;
        pos.set(g.attributes.position.array.subarray(0, n * 3), o * 3);
        nor.set(g.attributes.normal.array.subarray(0, n * 3), o * 3);
        if (g.attributes.uv) uv.set(g.attributes.uv.array.subarray(0, n * 2), o * 2);
        if (colr && g.attributes.color) colr.set(g.attributes.color.array.subarray(0, n * 3), o * 3);
        o += n;
        g.dispose();
      }
      const out = new THREE.BufferGeometry();
      out.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      out.setAttribute("normal", new THREE.BufferAttribute(nor, 3));
      out.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
      if (colr) out.setAttribute("color", new THREE.BufferAttribute(colr, 3));
      out.computeBoundingSphere();
      return out;
    }
    return { plate, slab, roundRect, arc, box, pin, cylY, paint, merge, extrude };
  }

  // app/hero/machine.js
  var C = {
    rubber: 2829619,
    pad: 3882566,
    frame: 4869720,
    hub: 9146521,
    cap: 15905815,
    glass: 2111567,
    roof: 3422015,
    beacon: 16742938,
    pinc: 10133674,
    tube: 3816774,
    rod: 14936302,
    tooth: 13225686,
    edge: 5659494,
    link: 4869720,
    vent: 3027256
  };
  function createMachine(THREE, P2, kin, opts) {
    const G = createGeo(THREE);
    const tier = opts.tier;
    const disposables = [];
    const keep = (x) => {
      disposables.push(x);
      return x;
    };
    const shadows = !!tier.shadows;
    const yellowMat = keep(new THREE.MeshPhongMaterial({ map: opts.textures.toyYellow, color: 16777215, specular: 3815988, shininess: 42 }));
    const bucketMat = keep(new THREE.MeshPhongMaterial({ map: opts.textures.toyYellow, color: 16777215, specular: 3815988, shininess: 42, emissive: 0 }));
    const paintMat = keep(new THREE.MeshPhongMaterial({ vertexColors: true, specular: 2236962, shininess: 24 }));
    let triCount = 0;
    function mesh(geos, mat, parent, colored) {
      const g = keep(G.merge(geos, colored));
      triCount += g.attributes.position.count / 3;
      const m = new THREE.Mesh(g, mat);
      m.castShadow = shadows;
      parent.add(m);
      return m;
    }
    const base = new THREE.Group();
    base.name = "excavator";
    base.position.copy(opts.excavator.position);
    base.rotation.y = opts.excavator.yaw || 0;
    {
      const parts = [];
      const hl = P2.trackL / 2, r = P2.trackH / 2;
      const stadium = [];
      G.arc(hl - r, r, r, -Math.PI / 2, Math.PI / 2, 6, stadium);
      G.arc(-(hl - r), r, r, Math.PI / 2, 3 * Math.PI / 2, 6, stadium);
      const straight = 2 * (hl - r), per = 2 * straight + 2 * Math.PI * r;
      const pads = 24;
      for (const sx of [-1, 1]) {
        const cx = sx * P2.gauge / 2;
        parts.push(G.paint(G.plate(stadium, P2.trackW, 0.012, cx), C.rubber));
        for (let k = 0; k < pads; k++) {
          let s = (k + 0.5) / pads * per, u, v, ang;
          if (s < straight) {
            u = -(hl - r) + s;
            v = 0;
            ang = 0;
          } else if ((s -= straight) < Math.PI * r) {
            const a = -Math.PI / 2 + s / r;
            u = hl - r + Math.cos(a) * r;
            v = r + Math.sin(a) * r;
            ang = a + Math.PI / 2;
          } else if ((s -= Math.PI * r) < straight) {
            u = hl - r - s;
            v = 2 * r;
            ang = Math.PI;
          } else {
            s -= straight;
            const a = Math.PI / 2 + s / r;
            u = -(hl - r) + Math.cos(a) * r;
            v = r + Math.sin(a) * r;
            ang = a + Math.PI / 2;
          }
          const b = G.box(P2.trackW + 8e-3, 0.012, 0.03);
          b.rotateX(ang);
          b.translate(cx, v, -u);
          parts.push(G.paint(b, C.pad));
        }
        const wl = P2.trackW + 0.014;
        for (const e of [-1, 1]) {
          parts.push(G.paint(G.pin(P2.wheelR - 0.012, wl, e * (hl - r), r, cx, 12), C.hub));
          parts.push(G.paint(G.pin(0.02, wl + 8e-3, e * (hl - r), r, cx, 8), C.cap));
        }
        for (let k = 0; k < P2.rollers; k++) {
          const u = -(hl - r) * 0.62 + (hl - r) * 1.24 * k / (P2.rollers - 1);
          parts.push(G.paint(G.pin(0.021, wl, u, 0.03, cx, 8), C.hub));
        }
        parts.push(G.paint(G.box(P2.trackW + 4e-3, 0.04, straight * 0.96, cx, 0.062, 0), C.frame));
      }
      parts.push(G.paint(G.box(P2.gauge - P2.trackW + 0.02, 0.07, 0.3, 0, 0.085, 0), C.frame));
      parts.push(G.paint(G.cylY(0.125, 0.115, P2.swingY - 0.1, 16, 0, 0.1, 0), C.frame));
      mesh(parts, paintMat, base, true);
    }
    const turret = new THREE.Group();
    turret.position.y = P2.swingY;
    base.add(turret);
    const cabPoint = new THREE.Vector3((P2.cab.x0 + P2.cab.x1) / 2, P2.deck.h + P2.cab.h * 0.55, -(P2.cab.u0 + P2.cab.u1) / 2);
    {
      const d = P2.deck, cb = P2.cab, ax = P2.armX;
      const y = [], p = [];
      y.push(G.slab(G.roundRect(-d.halfW, -d.back, d.halfW, d.front, [0.14, 0.14, 0.035, 0.035], 4), 0, d.h, 0.014));
      y.push(G.slab(G.roundRect(-d.halfW + 0.022, -d.back + 0.018, d.halfW - 0.022, cb.u0 - 0.012, [0.12, 0.12, 0.02, 0.02], 4), d.h - 0.01, 0.1, 0.02));
      y.push(G.slab(G.roundRect(cb.x0, cb.u0, cb.x1, cb.u1, 0.03, 3), d.h - 0.01, cb.h + 0.01, 0.018));
      const br = [[0.035, 0.085], [0.1, 0.172], [0.168, 0.172], [0.268, 0.05], [0.262, -0.012], [0.19, -0.012], [0.19, 0.085]];
      for (const s of [-1, 1]) y.push(G.plate(br, 0.012, 3e-3, ax + s * 0.041));
      const gy = d.h + cb.h * 0.56, gh = cb.h * 0.5, cw = cb.x1 - cb.x0, cl = cb.u1 - cb.u0, cxm = (cb.x0 + cb.x1) / 2, cum = (cb.u0 + cb.u1) / 2;
      p.push(G.paint(G.box(cw - 0.05, gh, 6e-3, cxm, gy, -cb.u1), C.glass));
      p.push(G.paint(G.box(cw - 0.06, gh * 0.8, 6e-3, cxm, gy + gh * 0.08, -cb.u0), C.glass));
      p.push(G.paint(G.box(6e-3, gh, cl - 0.06, cb.x0, gy, -cum), C.glass));
      p.push(G.paint(G.box(6e-3, gh, cl - 0.06, cb.x1, gy, -cum), C.glass));
      p.push(G.paint(G.slab(G.roundRect(cb.x0 - 8e-3, cb.u0 - 8e-3, cb.x1 + 8e-3, cb.u1 + 0.014, 0.03, 3), d.h + cb.h - 4e-3, 0.018, 6e-3), C.roof));
      p.push(G.paint(G.cylY(0.017, 0.013, 0.024, 8, cxm, d.h + cb.h + 0.014, -cum + 0.03), C.beacon));
      for (let k = 0; k < 3; k++) p.push(G.paint(G.box(0.16, 4e-3, 0.012, 0.03, d.h + 0.091, 0.12 + k * 0.035), C.vent));
      p.push(G.paint(G.cylY(0.012, 0.012, 0.07, 8, d.halfW - 0.07, d.h + 0.085, 0.2), C.frame));
      p.push(G.paint(G.slab(G.roundRect(-d.halfW - 4e-3, -d.back - 4e-3, d.halfW + 4e-3, -d.back + 0.16, [0.142, 0.142, 0, 0], 4), 0.012, 0.03, 4e-3), C.roof));
      p.push(G.paint(G.pin(0.016, 0.105, P2.boomPivot.u, P2.boomPivot.v, ax), C.pinc));
      p.push(G.paint(G.pin(0.012, 2 * P2.boomCyl.side + 0.04, P2.boomCyl.a.u, P2.boomCyl.a.v, ax), C.pinc));
      mesh(y, yellowMat, turret, false);
      mesh(p, paintMat, turret, true);
    }
    const boom = new THREE.Group();
    boom.position.set(P2.armX, P2.boomPivot.v, -P2.boomPivot.u);
    turret.add(boom);
    {
      const L1 = P2.L1, bend = P2.boomBend, k = P2.boomBendAt;
      const sTot = L1 / Math.sqrt(k * k + (1 - k) * (1 - k) + 2 * k * (1 - k) * Math.cos(bend));
      const a = k * sTot, b = (1 - k) * sTot;
      const apexQ = a * b * Math.sin(bend) / L1, apexP = Math.sqrt(Math.max(0, a * a - apexQ * apexQ));
      const ctr = [];
      const A = [0, 0], M = [apexP, apexQ], Z = [L1, 0];
      const lerp2 = (p0, p1, t) => [p0[0] + (p1[0] - p0[0]) * t, p0[1] + (p1[1] - p0[1]) * t];
      const q0 = lerp2(A, M, 0.62), q1 = lerp2(M, Z, 0.38);
      ctr.push(A, lerp2(A, M, 0.31));
      for (let i = 0; i <= 6; i++) {
        const t = i / 6, s = 1 - t;
        ctr.push([s * s * q0[0] + 2 * s * t * M[0] + t * t * q1[0], s * s * q0[1] + 2 * s * t * M[1] + t * t * q1[1]]);
      }
      ctr.push(lerp2(M, Z, 0.69), Z);
      const n = ctr.length, top = [], bot = [];
      for (let i = 0; i < n; i++) {
        const p0 = ctr[Math.max(0, i - 1)], p1 = ctr[Math.min(n - 1, i + 1)];
        let tx = p1[0] - p0[0], ty = p1[1] - p0[1];
        const tl = Math.hypot(tx, ty) || 1;
        tx /= tl;
        ty /= tl;
        const f = ctr[i][0] / L1;
        const wgt = f < k ? f / k : (1 - f) / (1 - k);
        const hd = 0.036 + 0.02 * wgt * wgt * (3 - 2 * wgt) - 6e-3 * f;
        top.push([ctr[i][0] - ty * hd, ctr[i][1] + tx * hd]);
        bot.push([ctr[i][0] + ty * hd, ctr[i][1] - tx * hd]);
      }
      const outline = [];
      const ang0 = Math.atan2(ctr[1][1], ctr[1][0]);
      G.arc(0, 0, 0.04, ang0 + Math.PI / 2 + 0.3, ang0 + 3 * Math.PI / 2 - 0.3, 4, outline);
      for (let i = 1; i < n - 1; i++) outline.push(bot[i]);
      const ang1 = Math.atan2(Z[1] - ctr[n - 2][1], Z[0] - ctr[n - 2][0]);
      G.arc(L1, 0, 0.032, ang1 - Math.PI / 2 + 0.3, ang1 + Math.PI / 2 - 0.3, 4, outline);
      for (let i = n - 2; i >= 1; i--) outline.push(top[i]);
      const y = [G.plate(outline, P2.boomW, 0.01)];
      const ac = P2.armCyl.a;
      const lug = [[ac.p - 0.07, ac.q - 0.04], [ac.p - 0.012, ac.q + 0.018], [ac.p + 0.014, ac.q + 0.018], [ac.p + 0.06, ac.q - 0.04]];
      for (const s of [-1, 1]) y.push(G.plate(lug, 8e-3, 2e-3, s * 0.024));
      const p = [];
      p.push(G.paint(G.pin(0.011, 0.066, ac.p, ac.q, 0, 8), C.pinc));
      p.push(G.paint(G.pin(0.012, 2 * P2.boomCyl.side + 0.04, P2.boomCyl.c.p, P2.boomCyl.c.q, 0, 8), C.pinc));
      p.push(G.paint(G.pin(0.015, P2.boomW + 0.02, L1, 0, 0), C.pinc));
      mesh(y, yellowMat, boom, false);
      mesh(p, paintMat, boom, true);
    }
    const arm = new THREE.Group();
    arm.position.set(0, 0, -P2.L1);
    boom.add(arm);
    {
      const L2 = P2.L2, cc = P2.armCyl.c, ka = P2.bucketCyl.a, nn = P2.link.n;
      const outline = [
        [cc.p - 0.022, cc.q - 0.012],
        [cc.p - 0.012, cc.q + 0.02],
        [cc.p + 0.02, cc.q + 0.024],
        [-0.01, 0.046],
        [0.12, 0.04],
        [L2 - 0.03, 0.025]
      ];
      G.arc(L2, 0, 0.026, Math.PI / 2 - 0.1, -Math.PI / 2 + 0.1, 5, outline);
      outline.push([L2 - 0.03, -0.025], [0.14, -0.04], [0.02, -0.046], [-0.04, -0.03]);
      const y = [G.plate(outline, P2.armW, 8e-3)];
      const lug = [[ka.p - 0.05, ka.q - 0.036], [ka.p - 0.012, ka.q + 0.016], [ka.p + 0.014, ka.q + 0.016], [ka.p + 0.06, ka.q - 0.036]];
      for (const s of [-1, 1]) y.push(G.plate(lug, 7e-3, 2e-3, s * 0.02));
      const p = [];
      p.push(G.paint(G.pin(0.01, 0.058, ka.p, ka.q, 0, 8), C.pinc));
      p.push(G.paint(G.pin(0.011, 0.064, cc.p, cc.q, 0, 8), C.pinc));
      p.push(G.paint(G.pin(0.01, 2 * P2.link.sideH + 0.014, nn.p, nn.q, 0, 8), C.pinc));
      p.push(G.paint(G.pin(0.013, 0.1, L2, 0, 0), C.pinc));
      mesh(y, yellowMat, arm, false);
      mesh(p, paintMat, arm, true);
    }
    const wrist = new THREE.Group();
    wrist.position.set(0, 0, -P2.L2);
    arm.add(wrist);
    const bucket = new THREE.Group();
    wrist.add(bucket);
    const innerHalfW = P2.bucketW / 2 - P2.bucketWall;
    {
      const out = bucketOutline(P2, 14);
      const n = out.length, wall = P2.bucketWall;
      const inn = [];
      for (let i = 0; i < n; i++) {
        const p0 = out[Math.max(0, i - 1)], p1 = out[Math.min(n - 1, i + 1)];
        let tx2 = p1[0] - p0[0], ty2 = p1[1] - p0[1];
        const tl2 = Math.hypot(tx2, ty2) || 1;
        tx2 /= tl2;
        ty2 /= tl2;
        inn.push([out[i][0] + ty2 * wall, out[i][1] - tx2 * wall]);
      }
      const band = out.concat(inn.slice().reverse());
      const y = [G.plate(band, P2.bucketW, 2e-3)];
      for (const s of [-1, 1]) y.push(G.plate(out, wall, 2e-3, s * (P2.bucketW / 2 - wall / 2)));
      const q = P2.link.q;
      const ear = [[-0.03, -0.02], [0.012, -0.024], [0.03, 0], [0.02, 0.05], [q.x + 0.02, q.y + 0.022], [q.x - 0.016, q.y + 0.02], [-0.045, 0.03]];
      for (const s of [-1, 1]) y.push(G.plate(ear, 9e-3, 2e-3, s * 0.038));
      const p = [];
      const t3 = P2.bucketCurve[3], t2 = P2.bucketCurve[2];
      let tx = t3[0] - t2[0], ty = t3[1] - t2[1];
      const tl = Math.hypot(tx, ty);
      tx /= tl;
      ty /= tl;
      const nx = -ty, ny = tx;
      const pt = (a, b) => [t3[0] + tx * a + nx * b, t3[1] + ty * a + ny * b];
      p.push(G.paint(G.plate([pt(-0.035, 6e-3), pt(4e-3, 4e-3), pt(4e-3, -6e-3), pt(-0.035, -8e-3)], P2.bucketW + 4e-3, 1e-3), C.edge));
      const tw = 0.03;
      for (let k = 0; k < P2.teeth; k++) {
        const cx = -P2.bucketW / 2 + tw / 2 + 0.012 + (P2.bucketW - tw - 0.024) * k / (P2.teeth - 1);
        p.push(G.paint(G.plate([pt(-0.022, 0.01), pt(0.036, 0), pt(-0.022, -0.012)], tw, 4e-3, cx), C.tooth));
      }
      p.push(G.paint(G.pin(9e-3, 2 * P2.link.sideT + 0.014, q.x, q.y, 0, 8), C.pinc));
      const bm = mesh(y, bucketMat, bucket, false);
      bm.name = "bucketShell";
      mesh(p, paintMat, bucket, true);
    }
    const sol = { pts: new Float32Array(16) };
    const range = (fn) => {
      let lo = Infinity, hi = -Infinity;
      for (let i = 0; i <= 60; i++) {
        const v = fn(i / 60);
        if (v < lo) lo = v;
        if (v > hi) hi = v;
      }
      return [lo, hi];
    };
    const tmp = { pts: new Float32Array(16) };
    const probe = (th1, a2, psi) => {
      tmp.th1 = th1;
      tmp.a2 = a2;
      tmp.psi = psi;
      tmp.Eu = kin.B.u + P2.L1 * Math.cos(th1);
      tmp.Ev = kin.B.v + P2.L1 * Math.sin(th1);
      tmp.Wu = tmp.Eu + P2.L2 * Math.cos(a2);
      tmp.Wv = tmp.Ev + P2.L2 * Math.sin(a2);
      return kin.linkage(tmp);
    };
    const rBoom = range((t) => probe(P2.boomMin + (P2.boomMax - P2.boomMin) * t, -1, -2).boomLen);
    const rArm = range((t) => probe(0.5, 0.5 - (Math.PI - P2.elbowMax) - (P2.elbowMax - P2.elbowMin) * t, -2).armLen);
    const rBucket = range((t) => probe(0.5, -1, -1 + P2.betaMin + (P2.betaMax - P2.betaMin) * t).bucketLen);
    const cylDef = [
      { r: P2.boomCyl.r, rr: P2.boomCyl.rodR, range: rBoom, x: -P2.boomCyl.side, a: 0, c: 2 },
      { r: P2.boomCyl.r, rr: P2.boomCyl.rodR, range: rBoom, x: P2.boomCyl.side, a: 0, c: 2 },
      { r: P2.armCyl.r, rr: P2.armCyl.rodR, range: rArm, x: 0, a: 4, c: 6 },
      { r: P2.bucketCyl.r, rr: P2.bucketCyl.rodR, range: rBucket, x: 0, a: 8, c: 10 }
    ];
    for (const c of cylDef) {
      c.tube = c.range[0] - 0.014;
      c.rod = Math.min(c.range[0] - 4e-3, Math.max(c.range[1] - c.tube + 0.02, c.range[0] * 0.6));
    }
    const tubeGeo = (() => {
      const a = new THREE.CylinderGeometry(1, 1, 0.9, 10);
      a.translate(0, 0.45, 0);
      const b = new THREE.CylinderGeometry(1.16, 1.16, 0.1, 10);
      b.translate(0, 0.95, 0);
      return keep(G.merge([G.paint(a, C.tube), G.paint(b, C.frame)], true));
    })();
    const rodGeo = (() => {
      const a = new THREE.CylinderGeometry(1, 1, 1, 8);
      a.translate(0, 0.5, 0);
      return keep(G.merge([G.paint(a, C.rod)], true));
    })();
    const tubes = new THREE.InstancedMesh(tubeGeo, paintMat, cylDef.length);
    const rods = new THREE.InstancedMesh(rodGeo, paintMat, cylDef.length);
    const linkGeo = (() => {
      const a = G.box(7e-3, 1, 0.017, 0, 0.5, 0);
      return keep(G.merge([G.paint(a, C.link)], true));
    })();
    const links = new THREE.InstancedMesh(linkGeo, paintMat, 4);
    for (const im of [tubes, rods, links]) {
      im.frustumCulled = false;
      im.castShadow = shadows;
      turret.add(im);
    }
    triCount += (tubeGeo.attributes.position.count / 3 + rodGeo.attributes.position.count / 3) * cylDef.length + linkGeo.attributes.position.count / 3 * 4;
    const m4 = new THREE.Matrix4(), q4 = new THREE.Quaternion(), v0 = new THREE.Vector3(), v1 = new THREE.Vector3(), sc = new THREE.Vector3();
    const up = new THREE.Vector3(0, 1, 0);
    function setBar(im, i, x, au, av, bu, bv, radius, len) {
      v0.set(x, av, -au);
      v1.set(0, bv - av, -(bu - au));
      const l = v1.length();
      if (l > 1e-6) v1.multiplyScalar(1 / l);
      else v1.set(0, 1, 0);
      q4.setFromUnitVectors(up, v1);
      sc.set(radius, len, radius);
      m4.compose(v0, q4, sc);
      im.setMatrixAt(i, m4);
    }
    const NS = 8, NT = 6;
    const sandGeo = keep(new THREE.BufferGeometry());
    const sandPos = new Float32Array((NS + 1) * (NT + 1) * 3);
    {
      const uv = new Float32Array((NS + 1) * (NT + 1) * 2), wet = new Float32Array((NS + 1) * (NT + 1)).fill(0.9);
      const idx = [];
      for (let i = 0; i <= NS; i++) for (let j = 0; j <= NT; j++) {
        const k = i * (NT + 1) + j;
        uv[k * 2] = i / NS * 0.3 + 0.13;
        uv[k * 2 + 1] = j / NT * 0.37 + 0.41;
        if (i < NS && j < NT) idx.push(k, k + 1, k + NT + 1, k + 1, k + NT + 2, k + NT + 1);
      }
      sandGeo.setIndex(idx);
      const pa = new THREE.BufferAttribute(sandPos, 3);
      pa.setUsage(THREE.DynamicDrawUsage);
      sandGeo.setAttribute("position", pa);
      const na = new THREE.BufferAttribute(new Float32Array(sandPos.length), 3);
      na.setUsage(THREE.DynamicDrawUsage);
      sandGeo.setAttribute("normal", na);
      sandGeo.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
      sandGeo.setAttribute("wet", new THREE.BufferAttribute(wet, 1));
      sandGeo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, -0.05, 0), 0.4);
    }
    const sandMesh = new THREE.Mesh(sandGeo, opts.sandMaterial);
    sandMesh.visible = false;
    sandMesh.name = "bucketSand";
    sandMesh.castShadow = false;
    wrist.add(sandMesh);
    triCount += NS * NT * 2;
    const NO = kin.outline.length;
    const inR = new Float32Array(NO), inA = new Float32Array(NO);
    {
      let cx = 0, cy = 0;
      for (const p of kin.outline) {
        cx += p[0] / NO;
        cy += p[1] / NO;
      }
      for (let i = 0; i < NO; i++) {
        const x = cx + (kin.outline[i][0] - cx) * 0.9, y = cy + (kin.outline[i][1] - cy) * 0.9;
        inR[i] = Math.hypot(x, y);
        inA[i] = Math.atan2(y, x);
      }
    }
    const pu = new Float32Array(NO), pv = new Float32Array(NO);
    const cut = { area: 0, uA: 0, uB: 0 };
    function clipArea(c, m, ur) {
      let area = 0, uA = Infinity, uB = -Infinity;
      let px = pu[NO - 1], py = pv[NO - 1], pg = py - (c + m * (px - ur));
      let fx = 0, fy = 0, lx = 0, ly = 0, has = false;
      const emit = (x, y) => {
        if (!has) {
          fx = x;
          fy = y;
          has = true;
        } else area += lx * y - x * ly;
        lx = x;
        ly = y;
      };
      for (let i = 0; i < NO; i++) {
        const x = pu[i], y = pv[i], g = y - (c + m * (x - ur));
        if (pg <= 0 !== g <= 0) {
          const t = pg / (pg - g);
          const ix = px + (x - px) * t, iy = py + (y - py) * t;
          if (ix < uA) uA = ix;
          if (ix > uB) uB = ix;
          emit(ix, iy);
        }
        if (g <= 0) emit(x, y);
        px = x;
        py = y;
        pg = g;
      }
      if (has) area += lx * fy - fx * ly;
      cut.area = Math.abs(area) / 2;
      cut.uA = uA;
      cut.uB = uB;
      return cut;
    }
    let sandPsi = 99, sandVol = -1;
    const TAN_REPOSE = P2.repose;
    function updateSand(psi, vol) {
      if (vol <= 1e-6) {
        if (sandMesh.visible) {
          sandMesh.visible = false;
          sandVol = 0;
        }
        return;
      }
      if (Math.abs(psi - sandPsi) < 4e-3 && Math.abs(vol - sandVol) < 2e-6 && sandMesh.visible) return;
      sandPsi = psi;
      sandVol = vol;
      let lo = Infinity, cu = 0;
      for (let i = 0; i < NO; i++) {
        const a = inA[i] + psi;
        pu[i] = inR[i] * Math.cos(a);
        pv[i] = inR[i] * Math.sin(a);
        if (pv[i] < lo) lo = pv[i];
        cu += pu[i] / NO;
      }
      const sU = pu[0], sV = pv[0], tU = pu[NO - 1], tV = pv[NO - 1];
      const tipLow = tV < sV;
      const lowU = tipLow ? tU : sU, lowV = tipLow ? tV : sV, hiU = tipLow ? sU : tU, hiV = tipLow ? sV : tV;
      const dir = hiU > lowU ? 1 : -1;
      const mLip = Math.abs(hiV - lowV) / Math.max(1e-4, Math.abs(hiU - lowU));
      const rim = mLip <= TAN_REPOSE;
      const m = dir * Math.min(TAN_REPOSE, mLip);
      const want = vol / (2 * innerHalfW);
      let c = lowV;
      clipArea(c, m, lowU);
      let extra = 0, uA, uB;
      if (cut.area <= want) {
        extra = want - cut.area;
        if (rim) {
          uA = Math.min(lowU, hiU);
          uB = Math.max(lowU, hiU);
        } else {
          uA = Math.min(cut.uA, lowU);
          uB = Math.max(cut.uB, lowU);
        }
      } else {
        let a = lo - 0.02, b = lowV;
        for (let k = 0; k < 11; k++) {
          c = (a + b) / 2;
          if (clipArea(c, m, lowU).area > want) b = c;
          else a = c;
        }
        clipArea(c, m, lowU);
        uA = cut.uA;
        uB = cut.uB;
      }
      if (!(uB - uA > 1e-4)) {
        uA = lowU - 0.01;
        uB = lowU + 0.01;
      }
      const span = uB - uA;
      const dome = Math.min(0.055, extra / Math.max(0.05, span) * 1.5) + 0.01 * Math.min(1, vol / (P2.bucketCap * 0.3));
      for (let i = 0; i <= NS; i++) {
        const s = i / NS, u = uA + span * s, vl = c + m * (u - lowU);
        for (let j = 0; j <= NT; j++) {
          const t = -1 + 2 * j / NT, k = (i * (NT + 1) + j) * 3;
          const bump = dome * 4 * s * (1 - s) * (1 - t * t * 0.8) * (1 + 0.18 * Math.sin(i * 2.3 + j * 1.7));
          sandPos[k] = t * innerHalfW;
          sandPos[k + 1] = vl + bump;
          sandPos[k + 2] = -u;
        }
      }
      sandGeo.attributes.position.needsUpdate = true;
      sandGeo.computeVertexNormals();
      sandMesh.visible = true;
    }
    const handle = new THREE.Mesh(keep(new THREE.BoxGeometry(0.46, 0.4, 0.46)), keep(new THREE.MeshBasicMaterial({ visible: false })));
    handle.name = "bucketHandle";
    let blobBucket = null, blobBody = null, blobTex = null;
    if (!shadows) {
      const S = 32, data = new Uint8Array(S * S * 4);
      for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
        const d = Math.hypot(x - (S - 1) / 2, y - (S - 1) / 2) / (S / 2);
        const a = Math.max(0, 1 - d);
        data[(y * S + x) * 4 + 3] = Math.round(255 * a * a * (3 - 2 * a));
      }
      blobTex = keep(new THREE.DataTexture(data, S, S, THREE.RGBAFormat));
      blobTex.magFilter = THREE.LinearFilter;
      blobTex.minFilter = THREE.LinearFilter;
      blobTex.generateMipmaps = false;
      blobTex.name = "heroBlob(data)";
      blobTex.needsUpdate = true;
      const g = keep(new THREE.PlaneGeometry(1, 1));
      g.rotateX(-Math.PI / 2);
      const mk = (op) => {
        const m = new THREE.Mesh(g, keep(new THREE.MeshBasicMaterial({ map: blobTex, color: 0, transparent: true, opacity: op, depthWrite: false })));
        m.renderOrder = 1;
        return m;
      };
      blobBucket = mk(0.4);
      blobBody = mk(0.38);
      blobBody.scale.set(0.8, 1, 0.95);
      blobBody.position.copy(opts.excavator.position);
      blobBody.position.y += 0.012;
      triCount += 4;
    }
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
        setBar(tubes, i, P2.armX + c.x, au, av, cu, cv, c.r, c.tube);
        setBar(rods, i, P2.armX + c.x, cu, cv, au, av, c.rr, c.rod);
      }
      const lk = P2.link;
      for (let s = 0; s < 2; s++) {
        const sx = s ? 1 : -1;
        setBar(links, s, P2.armX + sx * lk.sideH, pts[12], pts[13], pts[10], pts[11], 1, lk.l1);
        setBar(links, 2 + s, P2.armX + sx * lk.sideT, pts[14], pts[15], pts[10], pts[11], 1, lk.l2);
      }
      tubes.instanceMatrix.needsUpdate = true;
      rods.instanceMatrix.needsUpdate = true;
      links.instanceMatrix.needsUpdate = true;
    }
    return {
      base,
      turret,
      wrist,
      bucket,
      bucketMat,
      handle,
      blobBucket,
      blobBody,
      cabPoint,
      applyPose,
      updateSand,
      sol,
      cylinders: cylDef.map((c) => ({ min: c.range[0], max: c.range[1], tube: c.tube, rod: c.rod })),
      get triangles() {
        return triCount;
      },
      onContextRestored() {
        if (blobTex) blobTex.needsUpdate = true;
      },
      dispose() {
        for (const d of disposables) d.dispose();
        tubes.dispose();
        rods.dispose();
        links.dispose();
      }
    };
  }

  // app/hero/sand.js
  function createSandMaterial(THREE, textures) {
    const mat = new THREE.MeshLambertMaterial({ map: textures.sandDry, color: 16777215 });
    const uni = { tWet: { value: textures.sandWet } };
    mat.onBeforeCompile = (shader) => {
      shader.uniforms.tWet = uni.tWet;
      shader.vertexShader = shader.vertexShader.replace("#include <common>", "#include <common>\nattribute float wet;\nvarying float vWet;\nvarying float vHgt;").replace("#include <begin_vertex>", "#include <begin_vertex>\nvWet = wet;\nvHgt = position.y;");
      shader.fragmentShader = shader.fragmentShader.replace("#include <common>", "#include <common>\nuniform sampler2D tWet;\nvarying float vWet;\nvarying float vHgt;").replace("#include <map_fragment>", [
        "#ifdef USE_MAP",
        "  vec4 dryC = texture2D( map, vMapUv );",
        "  vec4 wetC = texture2D( tWet, vMapUv );",
        "  float wm = smoothstep( 0.12, 0.8, clamp( vWet, 0.0, 1.0 ) + ( dryC.g - 0.55 ) * 0.5 );",
        "  vec3 sandC = mix( dryC.rgb * vec3( 1.04, 1.0, 0.94 ), wetC.rgb * vec3( 1.5, 1.34, 1.14 ), wm );",
        "  sandC *= 1.0 - 0.42 * smoothstep( 0.0, 0.2, -vHgt );",
        "  sandC *= 1.0 + 0.1 * smoothstep( 0.0, 0.12, vHgt ) * ( 1.0 - wm );",
        "  diffuseColor.rgb *= sandC;",
        "#endif"
      ].join("\n"));
    };
    mat.customProgramCacheKey = () => "heroSand1";
    mat.uniforms = uni;
    return mat;
  }
  function createGrid(THREE, o) {
    const nx = o.nx, nz = o.nz, VX = nx + 1, VZ = nz + 1, N = VX * VZ;
    const dx = o.dx, dz = o.dz, x0 = o.x0, z0 = o.z0, cellA = dx * dz;
    const H = new Float32Array(N);
    const wet = new Float32Array(N).fill(o.wet0 || 0);
    const floor = o.floor || null;
    const hideEmpty = !!o.hideEmpty;
    const repose = o.repose;
    const mDx = repose * dx, mDz = repose * dz, mDd = repose * Math.hypot(dx, dz);
    const pos = new Float32Array(N * 3), nor = new Float32Array(N * 3), uv = new Float32Array(N * 2);
    for (let iz = 0; iz < VZ; iz++) for (let ix = 0; ix < VX; ix++) {
      const i = iz * VX + ix;
      pos[i * 3] = x0 + ix * dx;
      pos[i * 3 + 2] = z0 + iz * dz;
      nor[i * 3 + 1] = 1;
      uv[i * 2] = (x0 + ix * dx) * o.uvScale + (o.uvOff || 0);
      uv[i * 2 + 1] = (z0 + iz * dz) * o.uvScale + (o.uvOff || 0) * 0.6;
    }
    const index = new Uint16Array(nx * nz * 6);
    let t = 0;
    for (let iz = 0; iz < nz; iz++) for (let ix = 0; ix < nx; ix++) {
      const a = iz * VX + ix, b = a + 1, c = a + VX, d = c + 1;
      if (ix + iz & 1) {
        index[t++] = a;
        index[t++] = c;
        index[t++] = b;
        index[t++] = b;
        index[t++] = c;
        index[t++] = d;
      } else {
        index[t++] = a;
        index[t++] = c;
        index[t++] = d;
        index[t++] = a;
        index[t++] = d;
        index[t++] = b;
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setIndex(new THREE.BufferAttribute(index, 1));
    const aPos = new THREE.BufferAttribute(pos, 3), aNor = new THREE.BufferAttribute(nor, 3), aWet = new THREE.BufferAttribute(wet, 1);
    for (const a of [aPos, aNor, aWet]) a.setUsage(THREE.DynamicDrawUsage);
    geo.setAttribute("position", aPos);
    geo.setAttribute("normal", aNor);
    geo.setAttribute("wet", aWet);
    geo.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(x0 + nx * dx / 2, 0, z0 + nz * dz / 2), Math.hypot(nx * dx, nz * dz) / 2 + 0.6);
    const mesh = new THREE.Mesh(geo, o.material);
    let d0x = 1e9, d0z = 1e9, d1x = -1, d1z = -1;
    function touch(ax, az, bx, bz) {
      if (ax < d0x) d0x = ax < 0 ? 0 : ax;
      if (az < d0z) d0z = az < 0 ? 0 : az;
      if (bx > d1x) d1x = bx > nx ? nx : bx;
      if (bz > d1z) d1z = bz > nz ? nz : bz;
    }
    function touchAll() {
      d0x = 0;
      d0z = 0;
      d1x = nx;
      d1z = nz;
    }
    let volDirty = true, volCache = 0;
    function flush() {
      if (d1x < d0x || d1z < d0z) return false;
      const ax = Math.max(0, d0x - 1), az = Math.max(0, d0z - 1), bx = Math.min(nx, d1x + 1), bz = Math.min(nz, d1z + 1);
      const ng = o.normalGain || 1;
      const ix2 = ng / (2 * dx), iz2 = ng / (2 * dz);
      for (let iz = az; iz <= bz; iz++) {
        const zm = iz > 0 ? -VX : 0, zp = iz < nz ? VX : 0, kz = zm && zp ? iz2 : iz2 * 2;
        for (let ix = ax; ix <= bx; ix++) {
          const i = iz * VX + ix, h = H[i];
          pos[i * 3 + 1] = hideEmpty && h < 12e-4 ? -0.01 : h;
          const xm = ix > 0 ? -1 : 0, xp = ix < nx ? 1 : 0, kx = xm && xp ? ix2 : ix2 * 2;
          const sx = (H[i + xp] - H[i + xm]) * kx, sz = (H[i + zp] - H[i + zm]) * kz;
          const il = 1 / Math.sqrt(sx * sx + sz * sz + 1);
          nor[i * 3] = -sx * il;
          nor[i * 3 + 1] = il;
          nor[i * 3 + 2] = -sz * il;
        }
      }
      const s = az * VX + ax, e = bz * VX + bx, n = e - s + 1;
      aPos.addUpdateRange(s * 3, n * 3);
      aPos.needsUpdate = true;
      aNor.addUpdateRange(s * 3, n * 3);
      aNor.needsUpdate = true;
      aWet.addUpdateRange(s, n);
      aWet.needsUpdate = true;
      d0x = 1e9;
      d0z = 1e9;
      d1x = -1;
      d1z = -1;
      volDirty = true;
      return true;
    }
    function fullUpload() {
      for (const a of [aPos, aNor, aWet]) {
        a.clearUpdateRanges();
        a.needsUpdate = true;
      }
    }
    function sample(x, z) {
      let fx = (x - x0) / dx, fz = (z - z0) / dz;
      if (fx < 0) fx = 0;
      else if (fx > nx) fx = nx;
      if (fz < 0) fz = 0;
      else if (fz > nz) fz = nz;
      let ix = fx | 0, iz = fz | 0;
      if (ix >= nx) ix = nx - 1;
      if (iz >= nz) iz = nz - 1;
      const u = fx - ix, v = fz - iz, i = iz * VX + ix;
      return (H[i] * (1 - u) + H[i + 1] * u) * (1 - v) + (H[i + VX] * (1 - u) + H[i + VX + 1] * u) * v;
    }
    function inside(x, z) {
      return x >= x0 && z >= z0 && x <= x0 + nx * dx && z <= z0 + nz * dz;
    }
    function volume() {
      if (volDirty) {
        let s = 0;
        for (let i = 0; i < N; i++) s += H[i];
        volCache = s * cellA;
        volDirty = false;
      }
      return volCache;
    }
    function deposit(x, z, vol, wetV, margin = 0) {
      let fx = (x - x0) / dx, fz = (z - z0) / dz;
      const lo = margin, hx = nx - margin, hz = nz - margin;
      if (fx < lo) fx = lo;
      else if (fx > hx) fx = hx;
      if (fz < lo) fz = lo;
      else if (fz > hz) fz = hz;
      let ix = fx | 0, iz = fz | 0;
      if (ix >= nx) ix = nx - 1;
      if (iz >= nz) iz = nz - 1;
      const u = fx - ix, v = fz - iz, i = iz * VX + ix, k = vol / cellA;
      const w00 = (1 - u) * (1 - v), w10 = u * (1 - v), w01 = (1 - u) * v, w11 = u * v;
      H[i] += k * w00;
      H[i + 1] += k * w10;
      H[i + VX] += k * w01;
      H[i + VX + 1] += k * w11;
      if (wetV > 0) {
        const g = wetV * Math.min(1, 0.35 + k * 60);
        let w = g * Math.min(1, w00 * 2.2);
        if (wet[i] < w) wet[i] = w;
        w = g * Math.min(1, w10 * 2.2);
        if (wet[i + 1] < w) wet[i + 1] = w;
        w = g * Math.min(1, w01 * 2.2);
        if (wet[i + VX] < w) wet[i + VX] = w;
        w = g * Math.min(1, w11 * 2.2);
        if (wet[i + VX + 1] < w) wet[i + VX + 1] = w;
      }
      touch(ix, iz, ix + 1, iz + 1);
      activate(ix - 1, iz - 1, ix + 2, iz + 2);
      volDirty = true;
    }
    let act = null;
    let sweepN = 0;
    function activate(ax, az, bx, bz) {
      if (ax < 0) ax = 0;
      if (az < 0) az = 0;
      if (bx > nx) bx = nx;
      if (bz > nz) bz = nz;
      if (!act) act = [ax, az, bx, bz];
      else {
        if (ax < act[0]) act[0] = ax;
        if (az < act[1]) act[1] = az;
        if (bx > act[2]) act[2] = bx;
        if (bz > act[3]) act[3] = bz;
      }
    }
    const KF = 0.42;
    function relax(sweeps, ux = 0, uy = 1, uz = 0, wetFlow = 0) {
      if (!act) return 0;
      let total = 0;
      const tX = -dx * ux, tZ = -dz * uz;
      const iy = 1 / Math.max(0.3, uy);
      for (let s = 0; s < sweeps && act; s++) {
        const ax = act[0], az = act[1], bx = act[2], bz = act[3];
        let c0x = 1e9, c0z = 1e9, c1x = -1, c1z = -1;
        const rev = sweepN++ & 1;
        for (let zi = az; zi <= bz; zi++) {
          const iz = rev ? bz - (zi - az) : zi;
          for (let xi = ax; xi <= bx; xi++) {
            const ix = rev ? bx - (xi - ax) : xi;
            const i = iz * VX + ix;
            let ch = 0;
            for (let n = 0; n < 4; n++) {
              let j, maxD, tl;
              if (n === 0) {
                if (ix >= nx) continue;
                j = i + 1;
                maxD = mDx;
                tl = tX;
              } else if (n === 1) {
                if (iz >= nz) continue;
                j = i + VX;
                maxD = mDz;
                tl = tZ;
              } else if (n === 2) {
                if (ix >= nx || iz >= nz) continue;
                j = i + VX + 1;
                maxD = mDd;
                tl = tX + tZ;
              } else {
                if (ix <= 0 || iz >= nz) continue;
                j = i + VX - 1;
                maxD = mDd;
                tl = -tX + tZ;
              }
              const d = (H[i] - H[j]) * uy + tl;
              let a, b, m;
              if (d > maxD) {
                a = i;
                b = j;
                m = (d - maxD) * KF * iy;
              } else if (d < -maxD) {
                a = j;
                b = i;
                m = (-d - maxD) * KF * iy;
              } else continue;
              const lim = H[a] - (floor ? floor[a] : 0);
              if (m > lim) m = lim;
              if (m <= 2e-6) continue;
              H[a] -= m;
              H[b] += m;
              total += m;
              if (wetFlow > 0) {
                const w = m * 220 * wetFlow;
                const wa = w > 1 ? 1 : w, wb = wa * 0.7;
                if (wet[a] < wa) wet[a] = wa;
                if (wet[b] < wb) wet[b] = wb;
              }
              ch = 1;
            }
            if (ch) {
              if (ix - 1 < c0x) c0x = ix - 1;
              if (ix + 1 > c1x) c1x = ix + 1;
              if (iz < c0z) c0z = iz;
              if (iz + 1 > c1z) c1z = iz + 1;
            }
          }
        }
        if (c1x < 0) act = null;
        else {
          touch(c0x, c0z, c1x, c1z);
          act = [Math.max(0, c0x - 1), Math.max(0, c0z - 1), Math.min(nx, c1x + 1), Math.min(nz, c1z + 1)];
        }
      }
      if (total > 0) volDirty = true;
      return total * cellA;
    }
    return {
      nx,
      nz,
      VX,
      VZ,
      N,
      dx,
      dz,
      x0,
      z0,
      cellA,
      H,
      wet,
      mesh,
      geo,
      touch,
      touchAll,
      flush,
      fullUpload,
      sample,
      inside,
      volume,
      deposit,
      activate,
      relax,
      get active() {
        return !!act;
      },
      markVolume() {
        volDirty = true;
      },
      dispose() {
        geo.dispose();
      }
    };
  }

  // app/hero/grains.js
  function createGrains(THREE, max, P2) {
    const geo = new THREE.IcosahedronGeometry(1, 0);
    const mat = new THREE.MeshLambertMaterial({ color: 16777215 });
    const mesh = new THREE.InstancedMesh(geo, mat, max);
    mesh.count = 0;
    mesh.frustumCulled = false;
    mesh.castShadow = false;
    mesh.name = "sandGrains";
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    mesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(max * 3), 3);
    mesh.instanceColor.setUsage(THREE.DynamicDrawUsage);
    const M = mesh.instanceMatrix.array, Cc = mesh.instanceColor.array;
    M.fill(0);
    const px = new Float32Array(max), py = new Float32Array(max), pz = new Float32Array(max);
    const vx = new Float32Array(max), vy = new Float32Array(max), vz = new Float32Array(max);
    const vol = new Float32Array(max), size = new Float32Array(max), age = new Float32Array(max);
    const kind = new Uint8Array(max);
    const shade = new Float32Array(max);
    let n = 0, flying = 0;
    let seed = 12345;
    const rnd = () => (seed = seed * 1664525 + 1013904223 >>> 0) / 4294967296;
    const base = new THREE.Color(12160856);
    function emit(x, y, z, ux, uy, uz, v, k) {
      if (!(v > 0)) return;
      flying += v;
      if (n >= max) {
        vol[rnd() * n | 0] += v;
        return;
      }
      const i = n++;
      px[i] = x;
      py[i] = y;
      pz[i] = z;
      vx[i] = ux;
      vy[i] = uy;
      vz[i] = uz;
      vol[i] = v;
      kind[i] = k;
      age[i] = 0;
      size[i] = P2.grainR * (0.65 + 0.8 * rnd());
      shade[i] = 0.78 + 0.34 * rnd();
    }
    function kill(i) {
      flying -= vol[i];
      const l = --n;
      if (i !== l) {
        px[i] = px[l];
        py[i] = py[l];
        pz[i] = pz[l];
        vx[i] = vx[l];
        vy[i] = vy[l];
        vz[i] = vz[l];
        vol[i] = vol[l];
        kind[i] = kind[l];
        age[i] = age[l];
        size[i] = size[l];
        shade[i] = shade[l];
      }
    }
    function update(dt, collide) {
      const g = P2.gravity;
      for (let i = n - 1; i >= 0; i--) {
        age[i] += dt;
        vy[i] -= g * dt;
        px[i] += vx[i] * dt;
        py[i] += vy[i] * dt;
        pz[i] += vz[i] * dt;
        if (collide(i)) kill(i);
      }
      if (n === 0) flying = 0;
      for (let i = 0; i < n; i++) {
        const o = i * 16, s = size[i] * Math.min(1, 0.45 + age[i] * 9);
        M[o] = s;
        M[o + 5] = s;
        M[o + 10] = s;
        M[o + 15] = 1;
        M[o + 12] = px[i];
        M[o + 13] = py[i];
        M[o + 14] = pz[i];
        const c = shade[i];
        Cc[i * 3] = base.r * c;
        Cc[i * 3 + 1] = base.g * c;
        Cc[i * 3 + 2] = base.b * c;
      }
      if (n > 0 || mesh.count > 0) {
        mesh.count = n;
        mesh.instanceMatrix.needsUpdate = true;
        mesh.instanceColor.needsUpdate = true;
      }
    }
    function countKind(k) {
      let c = 0;
      for (let i = 0; i < n; i++) if (kind[i] === k) c++;
      return c;
    }
    return {
      mesh,
      px,
      py,
      pz,
      vx,
      vy,
      vz,
      vol,
      kind,
      age,
      emit,
      update,
      countKind,
      rnd,
      get count() {
        return n;
      },
      get flying() {
        return flying > 0 ? flying : 0;
      },
      clear() {
        n = 0;
        flying = 0;
        mesh.count = 0;
      },
      dispose() {
        geo.dispose();
        mat.dispose();
        mesh.dispose();
      }
    };
  }

  // app/hero/hero.js
  var clamp2 = (x, a, b) => x < a ? a : x > b ? b : x;
  var lerp = (a, b, t) => a + (b - a) * t;
  var smooth = (t) => {
    t = clamp2(t, 0, 1);
    return t * t * (3 - 2 * t);
  };
  var wrapPi = (a) => {
    a = (a + Math.PI) % (2 * Math.PI);
    if (a < 0) a += 2 * Math.PI;
    return a - Math.PI;
  };
  var fin = (x, d) => Number.isFinite(x) ? x : d;
  function createHero(THREE, opts) {
    const sb = opts.sandbox, tier = opts.tier, bed = opts.bed;
    const onEvent = opts.onEvent || (() => {
    });
    const shadows = !!tier.shadows;
    const root = new THREE.Group();
    root.name = "hero";
    const kin = createKin(P);
    for (const k of ["sandDry", "sandWet", "toyYellow"]) {
      const t = opts.textures[k];
      if (t && t.repeat) {
        t.repeat.set(1, 1);
        t.offset.set(0, 0);
      }
    }
    const NX = Math.max(8, tier.terrainCells[0] | 0), NZ = Math.max(8, tier.terrainCells[1] | 0);
    const TW = sb.maxX - sb.minX, TD = sb.maxZ - sb.minZ, baseY = sb.baseY;
    const sandMat = createSandMaterial(THREE, opts.textures);
    const TN = (NX + 1) * (NZ + 1);
    const floorArr = new Float32Array(TN).fill(P.minH);
    const ter = createGrid(THREE, { nx: NX, nz: NZ, x0: sb.minX, z0: sb.minZ, dx: TW / NX, dz: TD / NZ, uvScale: 1 / 0.7, material: sandMat, floor: floorArr, repose: P.repose, normalGain: 1.7 });
    ter.mesh.position.y = baseY;
    ter.mesh.receiveShadow = shadows;
    ter.mesh.name = "terrain";
    root.add(ter.mesh);
    const refH = new Float32Array(TN);
    const seedH = new Float32Array(TN);
    const edgeD = new Uint8Array(TN);
    const padD = new Float32Array(TN);
    const exPos = opts.excavator.position, yaw = opts.excavator.yaw || 0;
    const turretY = exPos.y + P.swingY;
    {
      const cy = Math.cos(yaw), sy = Math.sin(yaw);
      const hx = P.gauge / 2 + P.trackW / 2 + 0.035, hz = P.trackL / 2 + 0.035;
      for (let iz = 0; iz <= NZ; iz++) for (let ix = 0; ix <= NX; ix++) {
        const i = iz * ter.VX + ix;
        const lx = sb.minX + ix * ter.dx - exPos.x, lz = sb.minZ + iz * ter.dz - exPos.z;
        const ax = Math.abs(lx * cy - lz * sy) - hx, az = Math.abs(lx * sy + lz * cy) - hz;
        const d = Math.hypot(Math.max(ax, 0), Math.max(az, 0));
        padD[i] = d;
        floorArr[i] = d <= 0 ? 0 : Math.max(P.minH, -P.repose * 0.9 * d);
        edgeD[i] = Math.min(3, ix, iz, NX - ix, NZ - iz);
      }
    }
    function makeSeed(seed, out) {
      let s = Math.abs(seed | 0) % 2147483646 + 1;
      const rnd = () => (s = s * 16807 % 2147483647) / 2147483647;
      const ph = [];
      for (let k = 0; k < 8; k++) ph.push(rnd() * Math.PI * 2);
      const f1 = 1.7 + rnd() * 0.9, f2 = 1.4 + rnd() * 0.9;
      for (let iz = 0; iz <= NZ; iz++) for (let ix = 0; ix <= NX; ix++) {
        const i = iz * ter.VX + ix, x = sb.minX + ix * ter.dx, z = sb.minZ + iz * ter.dz;
        let h = 0.02 * Math.sin(x * f1 + ph[0]) * Math.cos(z * f2 + ph[1]) + 0.011 * Math.sin(x * 3.9 + z * 2.7 + ph[2]) + 6e-3 * Math.sin(x * 8.3 - z * 7.1 + ph[3]) + 3e-3 * Math.sin(x * 17 + ph[4]) * Math.sin(z * 15 + ph[5]);
        h *= Math.min(1, Math.min(ix, iz, NX - ix, NZ - iz) / 4) * smooth(padD[i] / 0.18);
        out[i] = h;
      }
    }
    const heightAt = (x, z) => ter.inside(x, z) ? baseY + ter.sample(x, z) : baseY;
    function sampleArr(arr, x, z) {
      let fx = clamp2((x - sb.minX) / ter.dx, 0, NX), fz = clamp2((z - sb.minZ) / ter.dz, 0, NZ);
      const ix = Math.min(NX - 1, fx | 0), iz = Math.min(NZ - 1, fz | 0), u = fx - ix, v = fz - iz, i = iz * ter.VX + ix;
      return (arr[i] * (1 - u) + arr[i + 1] * u) * (1 - v) + (arr[i + ter.VX] * (1 - u) + arr[i + ter.VX + 1] * u) * v;
    }
    const snapshotRef = () => refH.set(ter.H);
    const BW = bed.inner.width, BL = bed.inner.length, BH = bed.inner.wallHeight;
    const BNX = P.bedCells[0], BNZ = P.bedCells[1];
    const bedG = createGrid(THREE, { nx: BNX, nz: BNZ, x0: -BW / 2, z0: -BL / 2, dx: BW / BNX, dz: BL / BNZ, uvScale: 1 / 0.7, uvOff: 0.37, material: sandMat, wet0: 0.62, hideEmpty: true, repose: P.repose, normalGain: 1.25 });
    bedG.mesh.userData.heroPart = true;
    bedG.mesh.receiveShadow = shadows;
    bedG.mesh.name = "bedSand";
    bed.anchor.add(bedG.mesh);
    bedG.touchAll();
    const bedFullVol = P.bucketCap * P.bedFullBuckets;
    let bedAvailable = true;
    const KO = { x0: bed.keepOut.min[0], y0: bed.keepOut.min[1], z0: bed.keepOut.min[2], x1: bed.keepOut.max[0], y1: bed.keepOut.max[1], z1: bed.keepOut.max[2] };
    const koBox = new THREE.Box3(new THREE.Vector3(KO.x0, KO.y0, KO.z0), new THREE.Vector3(KO.x1, KO.y1, KO.z1));
    const bedM = new THREE.Matrix4(), bedInv = new THREE.Matrix4();
    const T = { x: 0, y: 0, z: 0, cos: 1, sin: 0, ux: 0, uy: 1, uz: 0, tilt: false, pux: 0, puy: 1, puz: 0 };
    function updateTruck() {
      bed.anchor.updateWorldMatrix(true, false);
      bedM.copy(bed.anchor.matrixWorld);
      bedInv.copy(bedM).invert();
      const e = bedM.elements;
      T.x = fin(e[12], 0);
      T.y = fin(e[13], 0);
      T.z = fin(e[14], 0);
      const hl = Math.hypot(e[8], e[10]);
      if (hl > 0.2) {
        T.sin = e[8] / hl;
        T.cos = e[10] / hl;
      }
      const ul = Math.hypot(e[1], e[5], e[9]) || 1;
      T.ux = e[1] / ul;
      T.uy = e[5] / ul;
      T.uz = e[9] / ul;
      T.tilt = T.uy < 0.985;
      if (Math.abs(T.ux - T.pux) + Math.abs(T.uz - T.puz) > 4e-3) {
        T.pux = T.ux;
        T.puy = T.uy;
        T.puz = T.uz;
        bedG.activate(0, 0, BNX, BNZ);
      }
    }
    const toBedX = (x, z) => (x - T.x) * T.cos - (z - T.z) * T.sin;
    const toBedZ = (x, z) => (x - T.x) * T.sin + (z - T.z) * T.cos;
    function obstacleTop(x, z) {
      const lx = toBedX(x, z), lz = toBedZ(x, z);
      const dxo = Math.max(KO.x0 - lx, 0, lx - KO.x1);
      const zSplit = -BL / 2 - 0.03;
      let top = -1e9;
      let dzo = Math.max(zSplit - lz, 0, lz - KO.z1);
      let d = Math.hypot(dxo, dzo);
      let t = T.y + Math.max(BH, bedTop) + 0.045 - Math.max(0, d - 0.15) * 6;
      if (t > top) top = t;
      dzo = Math.max(KO.z0 - lz, 0, lz - zSplit);
      d = Math.hypot(dxo, dzo);
      t = T.y + KO.y1 + 0.04 - Math.max(0, d - 0.15) * 6;
      if (t > top) top = t;
      return top;
    }
    let bedTop = 0;
    const spillAcc = [0, 0, 0, 0];
    const machine = createMachine(THREE, P, kin, { tier, textures: opts.textures, excavator: opts.excavator, sandMaterial: sandMat });
    root.add(machine.base);
    root.add(machine.handle);
    if (machine.blobBucket) root.add(machine.blobBucket, machine.blobBody);
    const grains = createGrains(THREE, Math.max(16, tier.grainMax | 0), P);
    root.add(grains.mesh);
    const grainVol = P.bucketCap / Math.max(60, Math.min(260, tier.grainMax * 0.6));
    const HOME = { phi: -1.92, u: 0.68, v: 0.13, psi: P.psiRest, x: 0, z: 0, hover: 0.13 };
    {
      const c = Math.cos(yaw), sn = Math.sin(yaw), ox = P.home.x, oz = P.home.z;
      HOME.x = exPos.x + ox * c + oz * sn;
      HOME.z = exPos.z - ox * sn + oz * c;
      HOME.hover = P.home.hover;
    }
    const homeGoal = () => ({ kind: "ground", x: HOME.x, z: HOME.z, hover: HOME.hover });
    const S = {
      phase: "idle",
      pourTarget: null,
      phi: HOME.phi,
      u: HOME.u,
      v: HOME.v,
      psi: HOME.psi,
      dphi: 0,
      du: 0,
      dv: 0,
      dpsi: 0,
      tPhi: HOME.phi,
      tU: HOME.u,
      tV: HOME.v,
      tPsi: HOME.psi,
      vol: 0,
      full: false,
      goal: homeGoal(),
      queue: [],
      stepT: 0,
      pour: null,
      armed: 0,
      armX: 0,
      armY: 0,
      armZ: 0,
      overBed: false,
      hint: 0,
      hintT: 0,
      pop: 0,
      time: 0,
      armSpeed: 0,
      digRate: 0,
      pourRate: 0,
      digQuiet: 1,
      sprayAcc: 0,
      pourAcc: 0,
      pourAcc2: 0,
      carryT: 0,
      landT: 0,
      resetT: -1,
      healRow: 0,
      shipped: 0,
      refill: 0,
      vol0: 0
    };
    const state = { phase: "idle", pourTarget: null, bucketFill: 0, bedFill: 0, armSpeed: 0, digRate: 0, pourRate: 0 };
    const sol = machine.sol;
    const W = new THREE.Vector3(), TIP = new THREE.Vector3(), CEN = new THREE.Vector3(), prevTip = new THREE.Vector3(), tipVel = new THREE.Vector3();
    const prevW = new THREE.Vector3();
    let prevValid = false;
    const fp = { uMin: 0, uMax: 0, uMid: 0, low: 0 };
    const cyl = { phi: 0, u: 0 };
    const v3 = new THREE.Vector3(), v3b = new THREE.Vector3();
    const lray = new THREE.Ray();
    function toCyl(x, z, out) {
      const tx = x - exPos.x, tz = z - exPos.z;
      const r = Math.max(Math.hypot(tx, tz), Math.abs(P.armX) + 0.02);
      out.u = Math.sqrt(r * r - P.armX * P.armX);
      out.phi = Math.atan2(-tx, -tz) + Math.atan2(P.armX, out.u) - yaw;
      return out;
    }
    function toWorld(phi, u, v, out) {
      const a = phi + yaw, c = Math.cos(a), s = Math.sin(a);
      return out.set(exPos.x + P.armX * c - u * s, turretY + v, exPos.z - P.armX * s - u * c);
    }
    function clampAim(p, rMax) {
      p.x = clamp2(p.x, sb.minX + 0.09, sb.maxX - 0.09);
      p.z = clamp2(p.z, sb.minZ + 0.09, sb.maxZ - 0.09);
      let rx = p.x - exPos.x, rz = p.z - exPos.z;
      let r = Math.hypot(rx, rz);
      if (r < 1e-4) {
        rx = 0;
        rz = -1;
        r = 1;
      }
      const rc = clamp2(r, P.reachMin, rMax);
      if (rc !== r) {
        p.x = exPos.x + rx / r * rc;
        p.z = exPos.z + rz / r * rc;
      }
      return p;
    }
    function rayToTruck(ray, out) {
      if (!bedAvailable || T.tilt) return false;
      lray.copy(ray).applyMatrix4(bedInv);
      if (!lray.intersectBox(koBox, v3)) return false;
      const dy = lray.direction.y;
      let lx = v3.x, lz = v3.z;
      if (dy < -1e-4) {
        const t = (BH - lray.origin.y) / dy;
        if (t > 0) {
          lx = lray.origin.x + lray.direction.x * t;
          lz = lray.origin.z + lray.direction.z * t;
        }
      }
      out.x = clamp2(lx, -BW / 2 + 0.09, BW / 2 - 0.09);
      out.z = clamp2(lz, -BL / 2 + 0.1, BL / 2 - 0.1);
      return true;
    }
    function rayToGround(ray, arr, out) {
      const o = ray.origin, d = ray.direction;
      if (d.y > -0.02) {
        out.set(o.x + d.x * 20, baseY, o.z + d.z * 20);
        return true;
      }
      const tA = (baseY + P.maxH - o.y) / d.y, tB = (baseY + P.minH - 0.02 - o.y) / d.y;
      let prev = Math.max(0, tA), hit = -1;
      for (let t = prev; t <= tB + 0.03; t += 0.03) {
        const x = o.x + d.x * t, z = o.z + d.z * t, y = o.y + d.y * t;
        const h = ter.inside(x, z) ? baseY + sampleArr(arr, x, z) : baseY;
        if (y <= h) {
          hit = t;
          break;
        }
        prev = t;
      }
      if (hit < 0) hit = (baseY - o.y) / d.y;
      else {
        let a = prev, b = hit;
        for (let k = 0; k < 6; k++) {
          const m = (a + b) / 2, x = o.x + d.x * m, z = o.z + d.z * m;
          const h = ter.inside(x, z) ? baseY + sampleArr(arr, x, z) : baseY;
          if (o.y + d.y * m <= h) b = m;
          else a = m;
        }
        hit = b;
      }
      out.set(o.x + d.x * hit, 0, o.z + d.z * hit);
      return true;
    }
    const distB = (u, v) => Math.hypot(u - kin.B.u, v - kin.B.v);
    let noDig = false;
    function planGround(g) {
      v3.set(g.x, 0, g.z);
      const f = clamp2(S.vol / P.bucketCap, 0, 1);
      const hover = g.hover || 0;
      const digging = hover <= 0 && !S.full;
      clampAim(v3, digging ? P.reachMax : P.reachMax - 0.12);
      toCyl(v3.x, v3.z, cyl);
      const hNow = heightAt(v3.x, v3.z);
      const hRef = baseY + sampleArr(refH, v3.x, v3.z);
      let psi, bottom;
      if (hover > 0) {
        psi = S.vol > 1e-6 ? P.psiCarry : P.psiRest;
        bottom = hNow + hover;
        noDig = true;
      } else if (S.full) {
        psi = P.psiCarry;
        bottom = Math.max(hRef - P.fullSkim, baseY + P.minH);
        noDig = false;
      } else {
        psi = lerp(P.psiDig, P.psiCarry, f);
        const depth = P.digDepth * clamp2((1 - f) / 0.4, 0.15, 1) * (g.depthK || 1);
        bottom = Math.max(hRef - depth, baseY + P.minH);
        noDig = false;
      }
      kin.footprint(psi, fp);
      let wu = cyl.u - fp.uMid, wv = bottom - turretY - fp.low;
      if (distB(wu, wv) > kin.RMAX - 4e-3) {
        const pMax = Math.max(psi, Math.min(kin.psiHold(f), -58 * DEG));
        if (pMax > psi + 1e-3) {
          let a = psi, b = pMax;
          kin.footprint(b, fp);
          if (distB(cyl.u - fp.uMid, bottom - turretY - fp.low) <= kin.RMAX - 4e-3) {
            for (let k = 0; k < 8; k++) {
              const m = (a + b) / 2;
              kin.footprint(m, fp);
              if (distB(cyl.u - fp.uMid, bottom - turretY - fp.low) <= kin.RMAX - 4e-3) b = m;
              else a = m;
            }
          }
          psi = b;
          kin.footprint(psi, fp);
          wu = cyl.u - fp.uMid;
          wv = bottom - turretY - fp.low;
        }
      }
      S.tPhi = cyl.phi;
      S.tU = wu;
      S.tV = wv;
      S.tPsi = psi;
    }
    function planBed(g) {
      const lx = -0.06;
      const x = T.x + lx * T.cos + g.lz * T.sin, z = T.z - lx * T.sin + g.lz * T.cos;
      toCyl(x, z, cyl);
      const heap = Math.max(BH, Math.min(bedTop, BH + 0.08));
      S.tPhi = cyl.phi;
      S.tU = cyl.u;
      S.tV = T.y + heap + 0.075 + 0.205 - turretY;
      S.tPsi = S.vol > 1e-6 ? P.psiCarry : P.psiRest;
      noDig = true;
    }
    function plan() {
      const g = S.goal;
      if (g.kind === "ground") planGround(g);
      else if (g.kind === "bed") {
        if (bedAvailable) planBed(g);
        else {
          S.goal = { kind: "pose", phi: S.phi, u: S.u, v: S.v, psi: S.vol > 1e-6 ? P.psiCarry : P.psiRest };
          noDig = true;
        }
      } else {
        S.tPhi = g.phi;
        S.tU = g.u;
        S.tV = g.v;
        S.tPsi = g.psi != null ? g.psi : S.vol > 1e-6 ? P.psiCarry : P.psiRest;
        noDig = true;
      }
      if (!Number.isFinite(S.tPhi + S.tU + S.tV + S.tPsi)) {
        S.tPhi = S.phi;
        S.tU = S.u;
        S.tV = S.v;
        S.tPsi = S.psi;
      }
    }
    function holdGoal(hover) {
      return { kind: "ground", x: CEN.x, z: CEN.z, hover };
    }
    function liftCarry() {
      S.queue.length = 0;
      S.goal = holdGoal(S.vol > 1e-6 ? 0.2 : 0.16);
      S.phase = "idle";
    }
    function startQueue(steps) {
      S.queue = steps;
      S.stepT = 0;
      S.phase = "auto";
      if (steps.length && steps[0].goal) S.goal = steps[0].goal;
    }
    function scoopAt(p) {
      if (S.phase === "pour") return false;
      v3b.set(p.x, 0, p.z);
      clampAim(v3b, P.reachMax);
      if (S.full) {
        startQueue([{ goal: { kind: "ground", x: v3b.x, z: v3b.z, hover: 0.18 }, arrive: true, timeout: 1.6 }]);
        return true;
      }
      let rx = v3b.x - exPos.x, rz = v3b.z - exPos.z;
      const r = Math.hypot(rx, rz) || 1;
      rx /= r;
      rz /= r;
      const rOut = clamp2(r + 0.1, P.reachMin + 0.3, P.reachMax), rIn = rOut - 0.3;
      const x0 = exPos.x + rx * rOut, z0 = exPos.z + rz * rOut, x1 = exPos.x + rx * rIn, z1 = exPos.z + rz * rIn;
      snapshotRef();
      startQueue([
        { goal: { kind: "ground", x: x0, z: z0, hover: 0.07 }, arrive: true, timeout: 1.3 },
        { stroke: { x0, z0, x1, z1, T: 0.55 }, goal: { kind: "ground", x: x0, z: z0 } },
        { goal: { kind: "ground", x: x1, z: z1, hover: 0.2 }, arrive: true, timeout: 1 }
      ]);
      return true;
    }
    function bestBedSpot() {
      let best = 0, bh = Infinity;
      for (const lz of [0, -0.11, 0.11]) {
        const h = bedG.sample(-0.02, lz) + Math.abs(lz) * 0.08;
        if (h < bh) {
          bh = h;
          best = lz;
        }
      }
      return best;
    }
    const homeStep = () => ({ goal: homeGoal(), arrive: true, timeout: 1.6 });
    function dumpToBed(lx, lz) {
      if (S.vol <= 1e-6 || !bedAvailable || S.phase === "pour" || T.tilt) return false;
      const g = { kind: "bed", lx: lx != null ? lx : -0.02, lz: lz != null ? lz : bestBedSpot() };
      startQueue([{ goal: g, arrive: true, timeout: 2.4 }, { pour: true, goal: g }, homeStep()]);
      return true;
    }
    function pourHere() {
      if (S.vol <= 1e-6 || S.phase === "pour") return false;
      const g = { kind: "pose", phi: S.phi, u: clamp2(S.u, 0.66, 0.98), v: Math.max(S.v, heightAt(CEN.x, CEN.z) + 0.4 - turretY), psi: P.psiCarry };
      startQueue([{ goal: g, arrive: true, timeout: 0.9 }, { pour: true, goal: g }, { goal: { kind: "pose", phi: g.phi, u: g.u, v: g.v - 0.08, psi: P.psiRest }, arrive: true, timeout: 0.7 }]);
      return true;
    }
    function goHome() {
      startQueue([homeStep()]);
      return true;
    }
    function arrived() {
      const eV = S.goal.kind === "ground" && !noDig ? 0.05 : 0.03;
      return Math.abs(wrapPi(S.tPhi - S.phi)) * Math.max(0.4, S.u) < 0.035 && Math.abs(S.tU - S.u) < 0.03 && Math.abs(S.tV - S.v) < eV && Math.abs(S.tPsi - S.psi) < 0.2 && Math.abs(S.dphi) < 0.6 && Math.abs(S.du) + Math.abs(S.dv) < 0.5;
    }
    function startPour() {
      S.phase = "pour";
      toWorld(S.phi, S.u + P.Lb * 0.5, 0, v3);
      const lx = toBedX(v3.x, v3.z), lz = toBedZ(v3.x, v3.z);
      const target = bedAvailable && !T.tilt && Math.abs(lx) < BW / 2 + 0.03 && Math.abs(lz) < BL / 2 + 0.03 ? "bed" : "ground";
      S.pourTarget = target;
      S.pour = { t: 0, vol0: S.vol, emptyT: -1, target };
      onEvent("pourStart", { target, volume: S.vol });
    }
    function endPour() {
      const pr = S.pour;
      S.pour = null;
      S.pourTarget = null;
      S.full = false;
      S.phase = "auto";
      onEvent("pourEnd", { target: pr.target, volume: pr.vol0, bedFill: bedG.volume() / bedFullVol });
    }
    function stepQueue(dt) {
      if (S.phase !== "auto" && S.phase !== "pour") return;
      const st = S.queue[0];
      if (!st) {
        S.phase = "idle";
        return;
      }
      S.stepT += dt;
      if (st.goal && S.phase !== "pour") S.goal = st.goal;
      let done = false;
      if (st.pour) {
        if (S.phase !== "pour") {
          if (S.vol > 1e-6) startPour();
          else done = true;
        } else {
          const pr = S.pour;
          pr.t += dt;
          if (S.vol <= 0 && pr.emptyT < 0) pr.emptyT = pr.t;
          if (pr.t > 1.9 && S.vol > 0) flushBucket();
          if (pr.emptyT >= 0 && pr.t - pr.emptyT > 0.1 && grains.countKind(1) === 0 || pr.t > 3.2) {
            endPour();
            done = true;
          }
        }
      } else if (st.stroke) {
        const k = st.stroke, s = smooth((S.stepT - 0.16) / k.T);
        st.goal.x = lerp(k.x0, k.x1, s);
        st.goal.z = lerp(k.z0, k.z1, s);
        if (S.stepT > k.T + 0.3 || S.full && S.stepT > 0.2) done = true;
      } else if (st.arrive) {
        if (S.stepT > 0.05 && (arrived() || S.stepT > (st.timeout || 1.5))) done = true;
      } else done = true;
      if (done) {
        S.queue.shift();
        S.stepT = 0;
        if (!S.queue.length) {
          S.phase = "idle";
          if (S.goal.kind === "ground" && !S.goal.hover) S.goal = holdGoal(S.vol > 1e-6 ? 0.2 : 0.16);
        }
      }
    }
    const aim = { x: 0, z: 0 };
    function startFollow() {
      S.queue.length = 0;
      S.phase = "follow";
      S.overBed = false;
      snapshotRef();
      S.pop = 1;
      onEvent("grab", {});
    }
    function followAim(ray) {
      if (rayToTruck(ray, aim)) {
        S.overBed = true;
        S.goal = { kind: "bed", lx: aim.x, lz: aim.z };
        return;
      }
      S.overBed = false;
      if (rayToGround(ray, refH, v3)) S.goal = { kind: "ground", x: v3.x, z: v3.z };
    }
    function handleInput(p) {
      if (!p || !p.ray) return;
      if ((p.pressed || p.down) && S.phase !== "pour" && S.phase !== "follow") {
        startFollow();
        if (p.onHandle && p.pressed) {
          S.armed = 0.14;
          S.armX = p.ray.direction.x;
          S.armY = p.ray.direction.y;
          S.armZ = p.ray.direction.z;
          S.goal = holdGoal(Math.max(0.02, CEN.y - 0.1 - heightAt(CEN.x, CEN.z)));
        } else S.armed = 0;
      }
      if (S.phase === "follow" && (p.down || p.pressed)) {
        if (S.armed > 0) {
          const d = p.ray.direction;
          if (Math.abs(d.x - S.armX) + Math.abs(d.y - S.armY) + Math.abs(d.z - S.armZ) > 0.012) S.armed = 0;
        }
        if (S.armed <= 0) followAim(p.ray);
      }
      if (p.released) {
        onEvent("release", {});
        if (S.phase === "pour") return;
        const wasFollow = S.phase === "follow";
        S.armed = 0;
        if (p.tap) {
          const overTruck = rayToTruck(p.ray, aim);
          if (p.onHandle) {
            if (S.vol > 1e-6) {
              if (overTruck && S.overBed) dumpToBed(aim.x, aim.z);
              else pourHere();
            } else if (!overTruck && rayToGround(p.ray, ter.H, v3)) scoopAt(v3);
            else liftCarry();
          } else if (overTruck) {
            if (!dumpToBed(aim.x, aim.z)) liftCarry();
          } else if (rayToGround(p.ray, ter.H, v3)) scoopAt(v3);
          else liftCarry();
        } else if (wasFollow) {
          if (S.overBed && S.vol > 1e-6 && bedAvailable && S.goal.kind === "bed") dumpToBed(S.goal.lx, S.goal.lz);
          else if (S.overBed) goHome();
          else liftCarry();
        }
      }
    }
    function springStep(x, vel, target, w, dt, vmax, out) {
      const e = Math.exp(-w * dt), d0 = x - target, c2 = vel + w * d0;
      let nx = target + (d0 + c2 * dt) * e, nv = (vel - w * c2 * dt) * e;
      if (nv > vmax || nv < -vmax || Math.abs(nx - x) > vmax * dt) {
        nv = clamp2(nv, -vmax, vmax);
        nx = x + clamp2(nx - x, -vmax * dt, vmax * dt);
      }
      out[0] = nx;
      out[1] = nv;
    }
    const sp = [0, 0];
    function move(dt) {
      kin.footprint(S.psi, fp);
      const low = fp.low, mid = fp.uMid;
      toWorld(S.phi, S.u + mid, 0, v3);
      let need = obstacleTop(v3.x, v3.z);
      const la = 0.11;
      toWorld(S.phi + S.dphi * la, S.u + mid + S.du * la, 0, v3b);
      const needAhead = Math.max(need, obstacleTop(v3b.x, v3b.z));
      if (noDig) {
        const g = S.goal.kind === "ground" ? 0.03 : 0.045;
        need = Math.max(need, heightAt(v3.x, v3.z) + g);
      }
      const bottom = turretY + S.v + low;
      let slow = 1;
      if (needAhead > bottom + 0.012) slow = clamp2(1 - (needAhead - bottom) / 0.14, 0.1, 1);
      const tV = clamp2(Math.max(S.tV, Math.max(need, needAhead) - low - turretY), -0.45, P.wristVMax);
      const pouring = S.phase === "pour";
      const dPhi = wrapPi(S.tPhi - S.phi);
      springStep(S.phi, S.dphi, S.phi + dPhi, P.omega, dt, P.maxSwingSpeed * slow, sp);
      S.phi = wrapPi(sp[0]);
      S.dphi = sp[1];
      springStep(S.u, S.du, clamp2(S.tU, 0.2, 1.4), P.omega, dt, P.maxLinSpeed * slow, sp);
      S.u = sp[0];
      S.du = sp[1];
      springStep(S.v, S.dv, tV, P.omega, dt, P.maxLinSpeed, sp);
      S.v = sp[0];
      S.dv = sp[1];
      const tPsi = pouring ? P.psiDump : S.tPsi;
      springStep(S.psi, S.dpsi, tPsi, pouring ? 9 : P.omegaPsi, dt, pouring ? 4.2 : P.maxPsiSpeed, sp);
      S.psi = sp[0];
      S.dpsi = sp[1];
      const hard = need - 0.02 - low - turretY;
      if (S.v < hard) {
        S.v = Math.min(hard, S.v + 3.5 * dt + 2e-3);
        if (S.dv < 0) S.dv = 0;
      }
      if (!Number.isFinite(S.phi + S.u + S.v + S.psi + S.dphi + S.du + S.dv + S.dpsi)) {
        S.phi = HOME.phi;
        S.u = HOME.u;
        S.v = HOME.v;
        S.psi = HOME.psi;
        S.dphi = S.du = S.dv = S.dpsi = 0;
      }
    }
    const ENV_K = 12;
    const env = new Float32Array(ENV_K), envR = { uMin: 0, uMax: 0 };
    const halfW = P.bucketW / 2;
    function carveAt(wx, wy, wz, eux, euz) {
      const uMin = envR.uMin, uMax = envR.uMax, span = Math.max(1e-4, uMax - uMin);
      const cx = wx + eux * (uMin + uMax) / 2, cz = wz + euz * (uMin + uMax) / 2;
      const ext = span / 2 + halfW + 0.01;
      const ix0 = Math.max(1, Math.floor((cx - ext - sb.minX) / ter.dx)), ix1 = Math.min(NX - 1, Math.ceil((cx + ext - sb.minX) / ter.dx));
      const iz0 = Math.max(1, Math.floor((cz - ext - sb.minZ) / ter.dz)), iz1 = Math.min(NZ - 1, Math.ceil((cz + ext - sb.minZ) / ter.dz));
      if (ix1 < ix0 || iz1 < iz0) return 0;
      const H = ter.H, wet = ter.wet;
      let removed = 0, bx0 = 1e9, bz0 = 1e9, bx1 = -1, bz1 = -1;
      for (let iz = iz0; iz <= iz1; iz++) {
        const rz = sb.minZ + iz * ter.dz - wz;
        for (let ix = ix0; ix <= ix1; ix++) {
          const rx = sb.minX + ix * ter.dx - wx;
          const u = rx * eux + rz * euz;
          if (u < uMin || u > uMax) continue;
          const w = -rx * euz + rz * eux;
          if (w > halfW || w < -halfW) continue;
          const t = (u - uMin) / span * (ENV_K - 1);
          const k = Math.min(ENV_K - 2, t | 0), fr = t - k;
          const yb = wy + env[k] * (1 - fr) + env[k + 1] * fr - baseY;
          const i = iz * ter.VX + ix;
          const fl = yb > floorArr[i] ? yb : floorArr[i];
          if (H[i] > fl) {
            removed += H[i] - fl;
            H[i] = fl;
            wet[i] = 1;
            if (wet[i - 1] < 0.5) wet[i - 1] = 0.5;
            if (wet[i + 1] < 0.5) wet[i + 1] = 0.5;
            if (wet[i - ter.VX] < 0.5) wet[i - ter.VX] = 0.5;
            if (wet[i + ter.VX] < 0.5) wet[i + ter.VX] = 0.5;
            if (ix < bx0) bx0 = ix;
            if (ix > bx1) bx1 = ix;
            if (iz < bz0) bz0 = iz;
            if (iz > bz1) bz1 = iz;
          }
        }
      }
      if (removed > 0) {
        ter.touch(bx0 - 1, bz0 - 1, bx1 + 1, bz1 + 1);
        ter.activate(bx0 - 2, bz0 - 2, bx1 + 2, bz1 + 2);
        ter.markVolume();
      }
      return removed * ter.cellA;
    }
    function dig(dt) {
      let removed = 0;
      const a = S.phi + yaw, eux = -Math.sin(a), euz = -Math.cos(a);
      if (S.phase !== "pour" && W.y + fp.low < baseY + P.maxH && S.resetT < 0) {
        kin.underside(sol.psi, env, envR);
        const n = prevValid ? clamp2(Math.ceil(Math.hypot(W.x - prevW.x, W.z - prevW.z) / (ter.dx * 0.7)), 1, 4) : 1;
        for (let k = 1; k <= n; k++) {
          const t = k / n;
          removed += carveAt(lerp(prevW.x, W.x, t), lerp(prevW.y, W.y, t), lerp(prevW.z, W.z, t), eux, euz);
        }
      }
      prevW.copy(W);
      prevValid = true;
      if (removed > 0) {
        const room = Math.max(0, P.bucketCap - S.vol);
        let take = Math.min(removed, room);
        const over = removed - take;
        S.sprayAcc += take * 0.05;
        take *= 0.95;
        S.vol += take;
        while (S.sprayAcc >= grainVol * 0.6) {
          S.sprayAcc -= grainVol * 0.6;
          const r = (grains.rnd() - 0.5) * P.bucketW;
          grains.emit(
            TIP.x + Math.cos(a) * r,
            Math.max(TIP.y, heightAt(TIP.x, TIP.z)) + 0.02,
            TIP.z - Math.sin(a) * r,
            tipVel.x * 0.4 + (grains.rnd() - 0.5) * 0.5,
            0.7 + grains.rnd() * 0.6,
            tipVel.z * 0.4 + (grains.rnd() - 0.5) * 0.5,
            grainVol * 0.6,
            2
          );
        }
        if (over > 0) spill(over, a);
        if (S.digQuiet > 0.25) onEvent("digStart", { x: TIP.x, z: TIP.z });
        S.digQuiet = 0;
        if (!S.full && S.vol >= P.bucketCap * 0.975) {
          S.full = true;
          onEvent("bucketFull", {});
        }
      } else S.digQuiet += dt;
      if (S.full && S.vol < P.bucketCap * 0.8) S.full = false;
      S.digRate += (removed / dt - S.digRate) * Math.min(1, dt * 12);
    }
    function spill(vol, a) {
      S.pourAcc2 += vol;
      while (S.pourAcc2 >= grainVol) {
        S.pourAcc2 -= grainVol;
        const side = grains.rnd() < 0.5 ? -1 : 1, along = (grains.rnd() - 0.5) * 0.16;
        const ex = Math.cos(a), ez = -Math.sin(a), ux = -Math.sin(a), uz = -Math.cos(a);
        grains.emit(
          CEN.x + ex * side * (halfW + 0.01) + ux * along,
          CEN.y + 0.02,
          CEN.z + ez * side * (halfW + 0.01) + uz * along,
          ex * side * (0.35 + grains.rnd() * 0.3) + tipVel.x * 0.3,
          0.5 + grains.rnd() * 0.5,
          ez * side * (0.35 + grains.rnd() * 0.3) + tipVel.z * 0.3,
          grainVol,
          2
        );
      }
    }
    const tipDirU = (() => {
      const c = P.bucketCurve;
      const x = c[3][0] - c[2][0], y = c[3][1] - c[2][1], l = Math.hypot(x, y);
      return [x / l, y / l];
    })();
    function emitPour(vol, kind) {
      const a = S.phi + yaw, ex = Math.cos(a), ez = -Math.sin(a), ux = -Math.sin(a), uz = -Math.cos(a);
      const c = Math.cos(sol.psi), s = Math.sin(sol.psi);
      const fu = tipDirU[0] * c - tipDirU[1] * s, fv = tipDirU[0] * s + tipDirU[1] * c;
      const r = (grains.rnd() - 0.5) * 2 * (halfW - 0.02), back = grains.rnd() * 0.05;
      const sl = 0.12 + grains.rnd() * 0.22;
      grains.emit(
        TIP.x + ex * r - ux * fu * back,
        TIP.y - fv * back + 4e-3,
        TIP.z + ez * r - uz * fu * back,
        tipVel.x * 0.3 + ux * fu * sl + (grains.rnd() - 0.5) * 0.12,
        tipVel.y * 0.3 + fv * sl,
        tipVel.z * 0.3 + uz * fu * sl + (grains.rnd() - 0.5) * 0.12,
        vol,
        kind
      );
    }
    function flushBucket() {
      if (S.vol > 0) {
        emitPour(S.vol + S.pourAcc, 1);
        S.vol = 0;
        S.pourAcc = 0;
      }
    }
    function pourAndSpill(dt) {
      let out = 0;
      const hold = P.bucketCap * kin.holdFrac(sol.psi);
      if (S.vol > hold + 1e-7) {
        out = Math.min(S.vol - hold, P.bucketCap / P.pourTime * dt);
        if (S.vol - out < grainVol * 0.5 && hold <= 0) out = S.vol;
        S.vol -= out;
        S.pourAcc += out;
        const kind = S.phase === "pour" ? 1 : 2;
        while (S.pourAcc >= grainVol) {
          S.pourAcc -= grainVol;
          emitPour(grainVol, kind);
        }
        if (S.vol <= 0) {
          S.vol = 0;
          if (S.pourAcc > 0) {
            emitPour(S.pourAcc, kind);
            S.pourAcc = 0;
          }
        }
      }
      if (S.phase !== "pour" && S.vol > P.bucketCap * 0.9 && S.armSpeed > 1.3) {
        S.carryT += dt;
        if (S.carryT > 0.09) {
          S.carryT = 0;
          const v = Math.min(grainVol * 0.5, S.vol);
          S.vol -= v;
          grains.emit(CEN.x + (grains.rnd() - 0.5) * 0.12, CEN.y + 0.03, CEN.z + (grains.rnd() - 0.5) * 0.12, tipVel.x * 0.5, 0.25, tipVel.z * 0.5, v, 2);
        }
      }
      S.pourRate += (out / dt - S.pourRate) * Math.min(1, dt * 14);
    }
    let truckNear = true, grainDt = 0.016;
    function landed(target, x, y, z, vol) {
      if (S.landT > 0.05) {
        S.landT = 0;
        onEvent("land", { target, x, y, z, volume: vol });
      }
    }
    function collide(i) {
      const x = grains.px[i], y = grains.py[i], z = grains.pz[i], vol = grains.vol[i];
      if (truckNear) {
        const e = bedInv.elements;
        let lx = e[0] * x + e[4] * y + e[8] * z + e[12], ly = e[1] * x + e[5] * y + e[9] * z + e[13], lz = e[2] * x + e[6] * y + e[10] * z + e[14];
        const inBed = Math.abs(lx) < BW / 2 && Math.abs(lz) < BL / 2;
        if (inBed) {
          const surf = Math.max(0, bedG.sample(lx, lz)) + 4e-3;
          if (ly > surf) return false;
          const lyPrev = ly - grains.vy[i] * grainDt * T.uy;
          if (lyPrev > -0.03 && bedAvailable) {
            bedG.deposit(lx, lz, vol, 0.62, 0);
            landed("bed", x, y, z, vol);
            return true;
          }
        }
        if (lx > KO.x0 && lx < KO.x1 && lz > KO.z0 && lz < KO.z1 && ly > -0.2) {
          const overBed = lz > -BL / 2 - 0.03;
          const top = overBed ? (lz < -BL / 2 ? BH + 0.06 : BH) + 4e-3 : KO.y1;
          if (ly < top) {
            let ox = 0, oz = 0;
            if (overBed && bedAvailable && Math.abs(lx) < BW / 2 + 0.012 && lz < BL / 2 + 0.012 && lz > -BL / 2 - 0.012) {
              lx = clamp2(lx, -BW / 2 + 6e-3, BW / 2 - 6e-3);
              lz = clamp2(lz, -BL / 2 + 6e-3, BL / 2 - 6e-3);
            } else {
              const dxm = lx - KO.x0, dxp = KO.x1 - lx, dzp = KO.z1 - lz;
              if (overBed && dzp < dxm && dzp < dxp) {
                lz = KO.z1 + 0.012;
                oz = 1;
              } else if (dxm < dxp) {
                lx = KO.x0 - 0.012;
                ox = -1;
              } else {
                lx = KO.x1 + 0.012;
                ox = 1;
              }
            }
            const m = bedM.elements;
            grains.px[i] = m[0] * lx + m[4] * ly + m[8] * lz + m[12];
            grains.py[i] = m[1] * lx + m[5] * ly + m[9] * lz + m[13];
            grains.pz[i] = m[2] * lx + m[6] * ly + m[10] * lz + m[14];
            grains.vx[i] = (m[0] * ox + m[8] * oz) * 0.3;
            grains.vz[i] = (m[2] * ox + m[10] * oz) * 0.3;
            if (grains.vy[i] > 0) grains.vy[i] = 0;
            return grains.age[i] > 5 ? (ter.deposit(x, z, vol, 0.75, 2), true) : false;
          }
        }
      }
      if (x >= sb.minX && x <= sb.maxX && z >= sb.minZ && z <= sb.maxZ) {
        if (y <= baseY + ter.sample(x, z)) {
          ter.deposit(x, z, vol, 0.75, 2);
          landed("ground", x, y, z, vol);
          return true;
        }
        return false;
      }
      if (y < baseY + 0.17) {
        grains.px[i] = clamp2(x, sb.minX + 0.02, sb.maxX - 0.02);
        grains.pz[i] = clamp2(z, sb.minZ + 0.02, sb.maxZ - 0.02);
        grains.vx[i] *= -0.2;
        grains.vz[i] *= -0.2;
        if (y <= baseY - 0.02 || grains.age[i] > 5) {
          ter.deposit(x, z, vol, 0.75, 2);
          return true;
        }
      }
      return false;
    }
    function bedOverflow() {
      if (!bedAvailable || T.tilt) return;
      const H = bedG.H, VX = bedG.VX;
      let any = false;
      for (let iz = 0; iz <= BNZ; iz++) {
        const edgeZ = iz === 0 || iz === BNZ;
        for (let ix = 0; ix <= BNX; ix += edgeZ ? 1 : BNX) {
          const i = iz * VX + ix;
          const side = iz === 0 ? 0 : iz === BNZ ? 1 : ix === 0 ? 2 : 3;
          const lim = (side === 0 ? BH + 0.06 : BH) + 0.014;
          if (H[i] > lim) {
            spillAcc[side] += (H[i] - lim) * bedG.cellA;
            H[i] = lim;
            any = true;
            bedG.touch(ix, iz, ix, iz);
            if (spillAcc[side] >= grainVol) {
              const v = spillAcc[side];
              spillAcc[side] = 0;
              const ox = side === 2 ? -1 : side === 3 ? 1 : 0, oz = side === 0 ? -1 : side === 1 ? 1 : 0;
              v3.set(-BW / 2 + ix * bedG.dx + ox * 0.045, lim + 0.012, -BL / 2 + iz * bedG.dz + oz * 0.045).applyMatrix4(bedM);
              const m = bedM.elements;
              grains.emit(v3.x, v3.y, v3.z, (m[0] * ox + m[8] * oz) * 0.35, 0.1, (m[2] * ox + m[10] * oz) * 0.35, v, 2);
            }
          }
        }
      }
      if (any) bedG.markVolume();
    }
    function tendTerrain(dt) {
      const H = ter.H, wet = ter.wet, VX = ter.VX;
      if (S.resetT >= 0) {
        S.resetT += dt;
        const k = S.resetT >= 0.7 ? 1 : 1 - Math.exp(-dt * 9);
        for (let i = 0; i < TN; i++) {
          H[i] += (seedH[i] - H[i]) * k;
          wet[i] *= 1 - k;
        }
        ter.touchAll();
        ter.markVolume();
        if (S.resetT >= 0.7) {
          S.resetT = -1;
          S.vol0 = ter.volume();
          S.shipped = 0;
          S.refill = 0;
        }
        return;
      }
      const rows = Math.max(1, Math.round((NZ + 1) * Math.min(1, dt / 0.5)));
      const period = 0.5;
      const kHeal = 1 - Math.exp(-period / P.healTau), kWet = Math.exp(-period / P.wetTau);
      const kE = [1, 1 - Math.exp(-period / 6), 1 - Math.exp(-period / 20)];
      for (let r = 0; r < rows; r++) {
        const iz = S.healRow;
        S.healRow = (S.healRow + 1) % (NZ + 1);
        let ch = false, add = 0;
        for (let ix = 0; ix <= NX; ix++) {
          const i = iz * VX + ix, h = H[i];
          const e = edgeD[i];
          if (e < 3) {
            const d = (seedH[i] - h) * kE[e];
            if (d > 1e-5 || d < -1e-5) {
              H[i] = h + d;
              add += d;
              ch = true;
            }
          } else if (h < P.healLevel) {
            const d = (P.healLevel - h) * kHeal;
            H[i] = h + d;
            add += d;
            ch = true;
          }
          const dev = H[i] - seedH[i];
          const tg = e < 2 ? 0 : dev < 0 ? Math.min(0.62, -dev * 9) : Math.min(0.42, dev * 6.5);
          const w = wet[i];
          if (w > tg + 4e-3) {
            wet[i] = tg + (w - tg) * kWet;
            ch = true;
          } else if (w < tg - 0.02) {
            wet[i] = w + (tg - w) * 0.25;
            ch = true;
          }
        }
        if (ch) ter.touch(0, iz, NX, iz);
        if (add !== 0) {
          S.refill += add * ter.cellA;
          ter.markVolume();
        }
      }
    }
    function pose(dt) {
      let bob = 0;
      if (S.hint > 0) {
        const ph = S.hintT % 0.6 / 0.6;
        bob = (ph < 0.5 ? Math.sin(ph * 2 * Math.PI) : 0) * S.hint;
      }
      const idle = S.phase === "idle";
      const breathe = idle ? Math.sin(S.time * 1.7) * 6e-3 : 0;
      kin.solve(S.u, S.v + breathe + bob * 0.035, S.psi + (idle ? Math.sin(S.time * 1.3) * 0.02 : 0), sol);
      kin.linkage(sol);
      machine.applyPose(sol, S.phi);
      toWorld(S.phi, sol.Wu, sol.Wv, W);
      toWorld(S.phi, sol.Tu, sol.Tv, TIP);
      CEN.copy(W).add(TIP).multiplyScalar(0.5);
      kin.footprint(sol.psi, fp);
      if (dt > 0) {
        tipVel.copy(TIP).sub(prevTip).multiplyScalar(1 / dt);
        const sp2 = tipVel.length();
        if (sp2 > 4) tipVel.multiplyScalar(4 / sp2);
        S.armSpeed += (Math.min(sp2, 4) - S.armSpeed) * Math.min(1, dt * 12);
      }
      prevTip.copy(TIP);
      const sc = 1 + bob * 0.16 + S.pop * 0.07;
      machine.wrist.scale.setScalar(sc);
      const g = S.hint * (0.5 + 0.5 * Math.sin(S.hintT * 7.5)) + S.pop * 0.35;
      machine.bucketMat.emissive.setRGB(g * 0.62, g * 0.5, g * 0.12);
    }
    function visuals() {
      machine.updateSand(sol.psi, S.vol);
      machine.handle.position.copy(CEN);
      if (machine.blobBucket) {
        const gy = heightAt(CEN.x, CEN.z), h = Math.max(0, CEN.y - gy);
        machine.blobBucket.position.set(CEN.x, gy + 0.012, CEN.z);
        const s = 0.34 + h * 0.35;
        machine.blobBucket.scale.set(s, 1, s);
        machine.blobBucket.material.opacity = clamp2(0.5 - h * 0.6, 0.12, 0.5);
      }
      ter.flush();
      bedG.flush();
    }
    function update(dt, input) {
      if (!(dt > 0)) return;
      dt = Math.min(dt, 0.05);
      S.time += dt;
      S.hintT += dt;
      S.landT += dt;
      S.pop = Math.max(0, S.pop - dt * 5);
      updateTruck();
      {
        const ddx = T.x - exPos.x, ddz = T.z - exPos.z;
        truckNear = ddx * ddx + ddz * ddz < 9;
      }
      if (S.armed > 0) S.armed -= dt;
      handleInput(input && input.pointer);
      stepQueue(dt);
      if (S.phase === "follow" && !(input && input.pointer && input.pointer.down) && !S.queue.length) liftCarry();
      plan();
      move(dt);
      pose(dt);
      dig(dt);
      pourAndSpill(dt);
      {
        const n = dt > 0.022 ? 2 : 1;
        grainDt = dt / n;
        for (let k = 0; k < n; k++) grains.update(grainDt, collide);
      }
      const sweeps = clamp2(Math.round(dt * 200), 1, 6);
      if (ter.active) ter.relax(sweeps, 0, 1, 0, 1);
      tendTerrain(dt);
      if (bedG.active) {
        bedG.relax(sweeps, T.ux, T.uy, T.uz, 0);
        bedOverflow();
        let top = 0;
        const Hb = bedG.H;
        for (let i = 0; i < bedG.N; i++) if (Hb[i] > top) top = Hb[i];
        bedTop = top;
      }
      visuals();
      state.phase = S.phase;
      state.pourTarget = S.pourTarget;
      state.bucketFill = clamp2(S.vol / P.bucketCap, 0, 1);
      state.bedFill = bedG.volume() / bedFullVol;
      state.armSpeed = fin(S.armSpeed, 0);
      state.digRate = fin(Math.max(0, S.digRate), 0);
      state.pourRate = fin(Math.max(0, S.pourRate), 0);
    }
    const commands = {
      dumpToBed: () => dumpToBed(),
      scoopAt: (p) => p && Number.isFinite(p.x + p.z) ? scoopAt(p) : false,
      pourHere: () => pourHere(),
      home: () => S.phase === "pour" ? false : goHome()
    };
    function drainBed(fraction) {
      const f = clamp2(fin(fraction, 0), 0, 1);
      const before = bedG.volume();
      let need = before * f;
      if (need <= 0) return 0;
      const H = bedG.H, VX = bedG.VX;
      for (let iz = BNZ; iz >= 0 && need > 1e-9; iz--) {
        let row = 0;
        for (let ix = 0; ix <= BNX; ix++) row += H[iz * VX + ix];
        row *= bedG.cellA;
        if (row <= 0) continue;
        const k = row <= need ? 0 : 1 - need / row;
        for (let ix = 0; ix <= BNX; ix++) H[iz * VX + ix] *= k;
        need -= row * (1 - k);
      }
      if (f >= 1) H.fill(0);
      bedG.touchAll();
      bedG.markVolume();
      bedG.activate(0, 0, BNX, BNZ);
      const removed = before - bedG.volume();
      S.shipped += removed;
      return removed;
    }
    function reset(o = {}) {
      makeSeed(o.seed != null ? o.seed : 1, seedH);
      S.resetT = 0;
      bedG.H.fill(0);
      bedG.touchAll();
      bedG.markVolume();
      bedTop = 0;
      grains.clear();
      S.vol = 0;
      S.full = false;
      S.pourAcc = 0;
      S.sprayAcc = 0;
      S.pourAcc2 = 0;
      if (S.pour) {
        S.pour = null;
        S.pourTarget = null;
      }
      S.phase = "idle";
      S.queue.length = 0;
      S.armed = 0;
      goHome();
    }
    makeSeed(opts.seed != null ? opts.seed : 1, seedH);
    ter.H.set(seedH);
    ter.touchAll();
    snapshotRef();
    S.vol0 = ter.volume();
    updateTruck();
    plan();
    HOME.phi = S.phi = S.tPhi;
    HOME.u = S.u = S.tU;
    HOME.v = S.v = S.tV;
    HOME.psi = S.psi = S.tPsi;
    pose(0);
    prevValid = false;
    visuals();
    if (opts.debug) {
      root.userData.heroBed = () => Array.from(bedG.H);
      root.userData.heroDebug = () => ({
        terrain: ter.volume(),
        bed: bedG.volume(),
        bucket: S.vol,
        flying: grains.flying,
        shipped: S.shipped,
        refill: S.refill,
        start: S.vol0,
        // 保存の確認：terrain + bed + bucket + flying + shipped − refill − start ≈ 0
        balance: ter.volume() + bedG.volume() + S.vol + grains.flying + S.pourAcc + S.sprayAcc + S.pourAcc2 + spillAcc[0] + spillAcc[1] + spillAcc[2] + spillAcc[3] + S.shipped - S.refill - S.vol0,
        grains: grains.count,
        triangles: machine.triangles,
        cylinders: machine.cylinders,
        pose: { phi: S.phi, u: S.u, v: S.v, psi: S.psi, th1: sol.th1, a2: sol.a2, boom: sol.boomLen, arm: sol.armLen, bucket: sol.bucketLen },
        goal: S.goal,
        phase: S.phase,
        full: S.full
      });
    }
    return {
      root,
      pickTargets: [machine.handle],
      update,
      command(name, arg) {
        return commands[name] ? !!commands[name](arg) : false;
      },
      setBedAvailable(on) {
        bedAvailable = !!on;
        if (!bedAvailable && S.phase !== "pour" && (S.goal.kind === "bed" || S.queue.some((q) => q.goal && q.goal.kind === "bed"))) liftCarry();
      },
      getBedFill() {
        return bedG.volume() / bedFullVol;
      },
      getBedVolume() {
        return bedG.volume();
      },
      drainBed,
      heightAt,
      getPoint(name, out = new THREE.Vector3()) {
        if (name === "bucketTip") return out.copy(TIP);
        if (name === "bucketCenter") return out.copy(CEN);
        if (name === "cab") {
          const c = machine.cabPoint, a = S.phi + yaw, cs = Math.cos(a), sn = Math.sin(a);
          return out.set(exPos.x + c.x * cs + c.z * sn, turretY + c.y, exPos.z - c.x * sn + c.z * cs);
        }
        return out.set(0, 0, 0);
      },
      getState() {
        return state;
      },
      setHint(name, level) {
        if (name === "bucket") S.hint = clamp2(fin(level, 0), 0, 1);
      },
      reset,
      onContextRestored() {
        ter.fullUpload();
        bedG.fullUpload();
        machine.onContextRestored();
        ter.touchAll();
        bedG.touchAll();
      },
      dispose() {
        bed.anchor.remove(bedG.mesh);
        ter.dispose();
        bedG.dispose();
        sandMat.dispose();
        machine.dispose();
        grains.dispose();
        root.removeFromParent();
      }
    };
  }
  return __toCommonJS(hero_exports);
})();
