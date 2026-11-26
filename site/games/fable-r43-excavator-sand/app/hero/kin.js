// 腕の運動学（three に依存しない純粋な計算）。
// 腕の平面 (u, v) で、手首（バケットピン）W とバケット角 psi から、
// ブーム角・アーム角・各取付点・油圧シリンダー長・バケットリンクの節点を解く。
const clamp = (x, a, b) => (x < a ? a : x > b ? b : x);
const acosS = (x) => Math.acos(clamp(x, -1, 1));

// 3次ベジェの点
function bez(c, t, out) {
  const s = 1 - t, a = s * s * s, b = 3 * s * s * t, d = 3 * s * t * t, e = t * t * t;
  out[0] = a * c[0][0] + b * c[1][0] + d * c[2][0] + e * c[3][0];
  out[1] = a * c[0][1] + b * c[1][1] + d * c[2][1] + e * c[3][1];
  return out;
}

// バケットの側面形（外側の輪郭）。ピン原点、x＝ピン→刃先、y＝底の側。
export function bucketOutline(P, n = 14) {
  const pts = [];
  const tmp = [0, 0];
  for (let i = 0; i <= n; i++) { bez(P.bucketCurve, i / n, tmp); pts.push([tmp[0], tmp[1]]); }
  return pts; // 上の縁（ピン側）→ 背 → 底 → 刃先
}

export function createKin(P) {
  const { L1, L2, Lb } = P;
  const B = P.boomPivot;
  const RMAX = Math.sqrt(L1 * L1 + L2 * L2 - 2 * L1 * L2 * Math.cos(P.elbowMax));
  const RMIN = Math.sqrt(L1 * L1 + L2 * L2 - 2 * L1 * L2 * Math.cos(P.elbowMin));
  const relMin = Math.PI - P.elbowMax, relMax = Math.PI - P.elbowMin;

  // ---- バケットの輪郭（極座標で持つ：回すのが速い）----
  const outline = bucketOutline(P, 14);
  const NO = outline.length;
  const oR = new Float32Array(NO), oA = new Float32Array(NO);
  for (let i = 0; i < NO; i++) { oR[i] = Math.hypot(outline[i][0], outline[i][1]); oA[i] = Math.atan2(outline[i][1], outline[i][0]); }
  const ou = new Float32Array(NO), ov = new Float32Array(NO);
  // 内側（砂の入る所）の面積
  let bowlArea = 0;
  for (let i = 0; i < NO; i++) {
    const a = outline[i], b = outline[(i + 1) % NO];
    bowlArea += a[0] * b[1] - b[0] * a[1];
  }
  bowlArea = Math.abs(bowlArea) / 2;

  // 輪郭を psi だけ回す（ピン原点の (u, v)）。戻り値：一番低い v
  function rotateOutline(psi) {
    let lo = Infinity;
    for (let i = 0; i < NO; i++) {
      const a = oA[i] + psi;
      ou[i] = oR[i] * Math.cos(a); ov[i] = oR[i] * Math.sin(a);
      if (ov[i] < lo) lo = ov[i];
    }
    return lo;
  }
  // バケットの「足あと」：psi の時の u の範囲・中心・一番低い v（ピン原点）
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
    out.uMin = a; out.uMax = b; out.uMid = (a + b) / 2; out.low = lo;
    return out;
  }
  // 下側の包絡線：u の等間隔 K 点での一番低い v（ピン原点）。out は Float32Array(K)
  function underside(psi, out, range) {
    rotateOutline(psi);
    let a = Infinity, b = -Infinity;
    for (let i = 0; i < NO; i++) { if (ou[i] < a) a = ou[i]; if (ou[i] > b) b = ou[i]; }
    const K = out.length;
    for (let k = 0; k < K; k++) {
      const u = a + ((b - a) * k) / (K - 1);
      let lo = Infinity;
      for (let i = 0; i < NO; i++) {
        const j = (i + 1) % NO;
        const u0 = ou[i], u1 = ou[j];
        if ((u0 - u) * (u1 - u) > 0) continue;
        const du = u1 - u0;
        const v = Math.abs(du) < 1e-9 ? Math.min(ov[i], ov[j]) : ov[i] + ((ov[j] - ov[i]) * (u - u0)) / du;
        if (v < lo) lo = v;
      }
      out[k] = lo === Infinity ? 0 : lo;
    }
    range.uMin = a; range.uMax = b;
    return out;
  }

  // 持てる量（0..1）：口が上なら 1、傾くほど減る
  function holdFrac(psi) {
    return clamp((P.holdNone - psi) / (P.holdNone - P.holdFull), 0, 1);
  }
  // 量 f を持てる一番開いた角度
  function psiHold(f) {
    return P.holdNone - clamp(f, 0, 1) * (P.holdNone - P.holdFull) - 0.06;
  }

  // ---- 逆運動学 ----
  // o に結果を書く。入力が届かない所でも必ず有効な姿勢を返す（NaN なし）。
  function solve(Wu, Wv, psi, o) {
    let dx = Wu - B.u, dy = Wv - B.v;
    let d = Math.hypot(dx, dy);
    if (!(d > 1e-6)) { dx = 1e-6; dy = 0; d = 1e-6; }
    const dc = clamp(d, RMIN, RMAX);
    let th1 = Math.atan2(dy, dx) + acosS((L1 * L1 + dc * dc - L2 * L2) / (2 * L1 * dc));
    th1 = clamp(th1, P.boomMin, P.boomMax);
    const Eu = B.u + L1 * Math.cos(th1), Ev = B.v + L1 * Math.sin(th1);
    const wu = B.u + (dx / d) * dc, wv = B.v + (dy / d) * dc;
    let a2 = Math.atan2(wv - Ev, wu - Eu);
    let rel = th1 - a2;
    while (rel < -Math.PI) rel += 2 * Math.PI;
    while (rel > Math.PI) rel -= 2 * Math.PI;
    rel = clamp(rel, relMin, relMax);
    a2 = th1 - rel;
    const Wu2 = Eu + L2 * Math.cos(a2), Wv2 = Ev + L2 * Math.sin(a2);
    const beta = clamp(psi - a2, P.betaMin, P.betaMax);
    const ps = a2 + beta;
    o.th1 = th1; o.a2 = a2; o.psi = ps; o.beta = beta;
    o.Eu = Eu; o.Ev = Ev; o.Wu = Wu2; o.Wv = Wv2;
    o.Tu = Wu2 + Lb * Math.cos(ps); o.Tv = Wv2 + Lb * Math.sin(ps);
    o.clamped = dc !== d;
    return o;
  }

  // ---- 取付点・シリンダー・リンク（solve の結果から）----
  function rot(p, q, ang, ou_, ov_, out, k) {
    const c = Math.cos(ang), s = Math.sin(ang);
    out[k] = ou_ + p * c - q * s; out[k + 1] = ov_ + p * s + q * c;
  }
  const bc = P.boomCyl, ac = P.armCyl, kc = P.bucketCyl, lk = P.link;
  // o.pts = Float32Array(16): [A1, C1, A2, C2, A3, J, N, Q]
  function linkage(o) {
    const pts = o.pts || (o.pts = new Float32Array(16));
    pts[0] = bc.a.u; pts[1] = bc.a.v;
    rot(bc.c.p, bc.c.q, o.th1, B.u, B.v, pts, 2);
    rot(ac.a.p, ac.a.q, o.th1, B.u, B.v, pts, 4);
    rot(ac.c.p, ac.c.q, o.a2, o.Eu, o.Ev, pts, 6);
    rot(kc.a.p, kc.a.q, o.a2, o.Eu, o.Ev, pts, 8);
    rot(lk.n.p, lk.n.q, o.a2, o.Eu, o.Ev, pts, 12);
    rot(lk.q.x, lk.q.y, o.psi, o.Wu, o.Wv, pts, 14);
    // J：円 (N, l1) と円 (Q, l2) の交点のうち、ピンから遠い側
    const Nu = pts[12], Nv = pts[13], Qu = pts[14], Qv = pts[15];
    let ex = Qu - Nu, ey = Qv - Nv;
    let dd = Math.hypot(ex, ey);
    if (!(dd > 1e-6)) { ex = 1e-6; ey = 0; dd = 1e-6; }
    const dn = clamp(dd, Math.abs(lk.l1 - lk.l2) + 1e-4, lk.l1 + lk.l2 - 1e-4);
    const a = (lk.l1 * lk.l1 - lk.l2 * lk.l2 + dn * dn) / (2 * dn);
    const h = Math.sqrt(Math.max(0, lk.l1 * lk.l1 - a * a));
    ex /= dd; ey /= dd;
    const mu = Nu + ex * a, mv = Nv + ey * a;
    let ju = mu - ey * h, jv = mv + ex * h;
    // ピン W と反対側を選ぶ
    if ((ju - mu) * (o.Wu - mu) + (jv - mv) * (o.Wv - mv) > 0) { ju = mu + ey * h; jv = mv - ex * h; }
    pts[10] = ju; pts[11] = jv;
    o.boomLen = Math.hypot(pts[2] - pts[0], pts[3] - pts[1]);
    o.armLen = Math.hypot(pts[6] - pts[4], pts[7] - pts[5]);
    o.bucketLen = Math.hypot(pts[10] - pts[8], pts[11] - pts[9]);
    return o;
  }

  return { B, RMIN, RMAX, outline, bowlArea, solve, linkage, footprint, underside, rotateOutline, ou, ov, holdFrac, psiHold };
}
