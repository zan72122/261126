// 飴引き機（パラメトリック）。動かない部品は頂点カラーで1つに結合、同じ形の爪（チャック）は InstancedMesh。
// 動き：ねじる持ち手（z 軸まわり）→ 左のチャック（飴の軸＝x 軸まわり、ギア比 1）、
//       アーム（支点 A から持ち手まで、伸縮＋向き）、右のチャック（持ち手の向きの変化で転がる）。
import { mergeGeometries } from '../vendor/three/addons/utils/BufferGeometryUtils.js';

export function createMachine(THREE, P, textures) {
  const V3 = THREE.Vector3;
  const geos = [], mats = [];
  const G = (g) => (geos.push(g), g);
  const M = (m) => (mats.push(m), m);
  const group = new THREE.Group();
  group.name = 'candy-puller';

  // ---- 部品づくりの補助（色つき・位置つきの geometry を作って後で結合） ----
  const tmpColor = new THREE.Color();
  function paint(geo, hex) {
    tmpColor.setHex(hex);
    const n = geo.attributes.position.count;
    const c = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { c[i * 3] = tmpColor.r; c[i * 3 + 1] = tmpColor.g; c[i * 3 + 2] = tmpColor.b; }
    geo.setAttribute('color', new THREE.BufferAttribute(c, 3));
    return geo;
  }
  const Y = new V3(0, 1, 0);
  const q = new THREE.Quaternion();
  // a から b への円柱
  function rod(a, b, r0, r1, seg, hex) {
    const d = new V3().subVectors(b, a);
    const len = Math.max(d.length(), 1e-4);
    const g = new THREE.CylinderGeometry(r1, r0, len, seg, 1);
    q.setFromUnitVectors(Y, d.clone().divideScalar(len));
    g.applyQuaternion(q);
    g.translate((a.x + b.x) / 2, (a.y + b.y) / 2, (a.z + b.z) / 2);
    return paint(g, hex);
  }
  function ball(c, r, hex, ws = 18, hs = 12) {
    const g = new THREE.SphereGeometry(r, ws, hs);
    g.translate(c.x, c.y, c.z);
    return paint(g, hex);
  }
  function box(c, sx, sy, sz, hex) {
    const g = new THREE.BoxGeometry(sx, sy, sz);
    g.translate(c.x, c.y, c.z);
    return paint(g, hex);
  }
  function merge(list) {
    const m = mergeGeometries(list.map((g) => (g.index ? g.toNonIndexed() : g)), false);
    list.forEach((g) => g.dispose());
    return G(m);
  }

  const STEEL = 0xe4e9f0, DARK = 0xaeb8c8, PINK = 0xff86b4, AQUA = 0x7fd4ff, CREAM = 0xfff3e2, MINT = 0x8ff0c0, YELLOW = 0xffd95a;

  // ---- 材質 ----
  const matBody = M(new THREE.MeshStandardMaterial({ color: 0xffffff, vertexColors: true, metalness: 0.12, roughness: 0.42 }));
  const matWheel = M(new THREE.MeshStandardMaterial({ color: 0xffffff, vertexColors: true, metalness: 0.05, roughness: 0.36, emissive: 0x58b8ff, emissiveIntensity: 0 }));
  const matKnob = M(new THREE.MeshStandardMaterial({ color: 0xffffff, vertexColors: true, metalness: 0.05, roughness: 0.32, emissive: 0xff5aa0, emissiveIntensity: 0 }));
  const matHome = M(new THREE.MeshStandardMaterial({ color: 0xffe9a8, metalness: 0.0, roughness: 0.4, emissive: 0xffc840, emissiveIntensity: 0 }));

  // ---- 動かない部品（1 draw call） ----
  const B = P.base;
  const parts = [];
  {
    // 台座：角を丸めた板
    const s = new THREE.Shape();
    const hw = B.w / 2, hd = B.d / 2, rr = 0.03;
    s.moveTo(-hw + rr, -hd); s.lineTo(hw - rr, -hd); s.quadraticCurveTo(hw, -hd, hw, -hd + rr);
    s.lineTo(hw, hd - rr); s.quadraticCurveTo(hw, hd, hw - rr, hd);
    s.lineTo(-hw + rr, hd); s.quadraticCurveTo(-hw, hd, -hw, hd - rr);
    s.lineTo(-hw, -hd + rr); s.quadraticCurveTo(-hw, -hd, -hw + rr, -hd);
    const g = new THREE.ExtrudeGeometry(s, { depth: B.h, bevelEnabled: false, curveSegments: 5 });
    g.rotateX(-Math.PI / 2); // 押し出し方向 +z → +y
    g.translate(B.x, 0, B.z);
    parts.push(paint(g, STEEL));
    // ボルト
    for (const bx of [-0.50, -0.30, 0.30, 0.50]) for (const bz of [-0.055, 0.055]) {
      parts.push(rod(new V3(bx, B.h, B.z + bz), new V3(bx, B.h + 0.006, B.z + bz), 0.011, 0.009, 8, DARK));
    }
  }
  // 左の柱と、ねじる持ち手の軸、ギア箱、左チャックの軸
  const postL = new V3(P.L.x - 0.13, 0, B.z);
  parts.push(rod(new V3(postL.x, B.h, B.z), new V3(postL.x, P.CT.y + 0.02, B.z), 0.036, 0.03, 20, STEEL));
  parts.push(rod(new V3(postL.x, B.h, B.z), new V3(postL.x, B.h + 0.03, B.z), 0.052, 0.046, 20, PINK));
  parts.push(ball(new V3(postL.x, P.CT.y + 0.02, B.z), 0.038, PINK, 16, 10));
  parts.push(rod(new V3(P.CT.x, P.CT.y, B.z), new V3(P.CT.x, P.CT.y, P.CT.z - 0.012), 0.013, 0.013, 12, DARK));
  parts.push(rod(new V3(postL.x, P.L.y, B.z), new V3(postL.x, P.L.y, -0.02), 0.02, 0.02, 12, STEEL));
  parts.push(box(new V3(P.L.x - 0.105, P.L.y, 0), 0.09, 0.085, 0.085, MINT));
  parts.push(rod(new V3(P.L.x - 0.06, P.L.y, 0), new V3(P.L.x - 0.02, P.L.y, 0), 0.014, 0.014, 12, DARK));
  // ベルトのカバー（ねじる持ち手 → ギア箱）
  parts.push(rod(new V3(P.CT.x, P.CT.y, -0.035), new V3(P.L.x - 0.105, P.L.y + 0.03, -0.035), 0.016, 0.016, 8, CREAM));
  // アームの柱と支点
  parts.push(rod(new V3(P.A.x, B.h, B.z), new V3(P.A.x, P.A.y - 0.01, P.A.z - 0.01), 0.036, 0.028, 20, STEEL));
  parts.push(rod(new V3(P.A.x, B.h, B.z), new V3(P.A.x, B.h + 0.03, B.z), 0.052, 0.046, 20, AQUA));
  parts.push(ball(P.A, 0.04, AQUA, 20, 14));
  const body = new THREE.Mesh(merge(parts), matBody);
  body.name = 'machine-body';
  group.add(body);

  // ---- ねじる持ち手（z 軸まわり） ----
  const wheel = new THREE.Group();
  wheel.position.copy(P.CT);
  {
    const ws = [];
    const rim = new THREE.TorusGeometry(P.wheelR, 0.012, 10, 36);
    ws.push(paint(rim, AQUA));
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
      ws.push(rod(new V3(0, 0, 0), new V3(Math.cos(a) * P.wheelR, Math.sin(a) * P.wheelR, 0), 0.008, 0.008, 8, CREAM));
    }
    const hub = new THREE.CylinderGeometry(0.024, 0.024, 0.026, 16);
    hub.rotateX(Math.PI / 2);
    ws.push(paint(hub, CREAM));
    // 握り玉（縁の上・手前）
    ws.push(rod(new V3(P.wheelR, 0, 0), new V3(P.wheelR, 0, 0.03), 0.01, 0.01, 8, CREAM));
    ws.push(ball(new V3(P.wheelR, 0, 0.034), P.twistKnobR, YELLOW, 20, 14));
    const m = new THREE.Mesh(merge(ws), matWheel);
    wheel.add(m);
  }
  group.add(wheel);

  // ---- チャック（左右で同じ形 → InstancedMesh 2個）。ローカル +x が飴の側 ----
  const cr = P.chuckR;
  const chuckGeo = (() => {
    const cs = [];
    const plate = new THREE.CylinderGeometry(cr * 1.12, cr * 1.12, 0.012, 24);
    plate.rotateZ(Math.PI / 2); plate.translate(-0.016, 0, 0);
    cs.push(paint(plate, STEEL));
    const hubc = new THREE.CylinderGeometry(cr * 0.5, cr * 0.62, 0.014, 16);
    hubc.rotateZ(-Math.PI / 2); hubc.translate(-0.026, 0, 0);
    cs.push(paint(hubc, DARK));
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2;
      const y = Math.cos(a) * cr, z = Math.sin(a) * cr;
      cs.push(rod(new V3(-0.012, y, z), new V3(0.03, y * 0.97, z * 0.97), 0.0085, 0.007, 8, i % 2 ? CREAM : PINK));
      cs.push(ball(new V3(0.03, y * 0.97, z * 0.97), 0.0085, i % 2 ? CREAM : PINK, 8, 6));
    }
    return merge(cs);
  })();
  const chucks = new THREE.InstancedMesh(chuckGeo, matBody, 2);
  chucks.name = 'chucks';
  chucks.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  chucks.frustumCulled = false;
  group.add(chucks);

  // ---- アーム（太い筒・細い筒）。長さは scale.y で伸縮 ----
  const tubeOuter = new THREE.Mesh(merge([
    paint(new THREE.CylinderGeometry(0.026, 0.026, 1, 16, 1), STEEL),
    (() => { const g = new THREE.CylinderGeometry(0.031, 0.031, 0.05, 16, 1); g.translate(0, 0.475, 0); return paint(g, PINK); })(),
  ]), matBody);
  const tubeInner = new THREE.Mesh(G(paint(new THREE.CylinderGeometry(0.019, 0.019, 1, 14, 1), DARK)), matBody);
  group.add(tubeOuter, tubeInner);

  // ---- 引く持ち手（握り玉）。ローカル原点 = H ----
  const pull = new THREE.Group();
  const knobC = new V3().copy(P.knobOffset);
  const pullKnob = new THREE.Mesh(merge([
    ball(new V3(0, 0, 0), P.pullKnobR, PINK, 28, 18),
    (() => { const g = new THREE.TorusGeometry(P.pullKnobR * 0.86, 0.006, 8, 28); g.rotateY(Math.PI / 2); g.translate(P.pullKnobR * -0.5, 0, 0); return paint(g, CREAM); })(),
  ]), matKnob);
  pullKnob.position.copy(knobC);
  const pullStem = new THREE.Mesh(merge([
    rod(new V3(-0.02, 0, 0), new V3(knobC.x - P.pullKnobR * 0.7, knobC.y, knobC.z), 0.012, 0.012, 10, DARK),
  ]), matBody);
  pull.add(pullKnob, pullStem);
  group.add(pull);

  // ---- 「ここへ戻す」の輪（折れるときに光る） ----
  const home = new THREE.Mesh(G(new THREE.TorusGeometry(P.foldDist * 0.42, 0.007, 8, 40)), matHome);
  home.position.set(P.L.x + 0.012, P.L.y, -0.012);
  home.rotation.y = 0.0;
  group.add(home);

  // ---- 当たり用（見えない・大きめ） ----
  const proxyMat = M(new THREE.MeshBasicMaterial({ visible: false }));
  const pullProxy = new THREE.Mesh(G(new THREE.SphereGeometry(0.09, 8, 6)), proxyMat);
  pullKnob.add(pullProxy);
  const twistProxy = new THREE.Mesh(G(new THREE.CylinderGeometry(0.125, 0.125, 0.08, 12)), proxyMat);
  twistProxy.rotation.x = Math.PI / 2;
  twistProxy.position.copy(P.CT);
  group.add(twistProxy);

  // ---- 毎フレームの姿勢 ----
  const mA = new THREE.Matrix4(), qA = new THREE.Quaternion(), sA = new V3(), pA = new V3();
  const X = new V3(1, 0, 0);
  const dir = new V3(0, -1, 0), end = new V3();
  const qFlip = new THREE.Quaternion().setFromAxisAngle(Y, Math.PI);
  const qRoll = new THREE.Quaternion();
  let prevDirOK = false;

  function setChuck(i, pos, rollAngle, flip, scale) {
    qRoll.setFromAxisAngle(X, rollAngle);
    if (flip) qA.copy(qFlip).multiply(qRoll); else qA.copy(qRoll);
    sA.set(1, scale, scale);
    pA.copy(pos);
    mA.compose(pA, qA, sA);
    chucks.setMatrixAt(i, mA);
  }

  // H：引く持ち手の中心、wheelAngle：ねじる持ち手の角、leftRoll／rightRoll：左右チャックの回転、
  // rL／rR：飴の端の半径（チャックがその太さをつかむ）
  function pose(H, wheelAngle, leftRoll, rightRoll, rL, rR, bobPull, bobTwist) {
    wheel.rotation.z = wheelAngle;
    wheel.position.set(P.CT.x, P.CT.y + bobTwist, P.CT.z);
    const sL = Math.min(2.3, Math.max(0.75, (rL * 1.08) / cr));
    const sR = Math.min(2.3, Math.max(0.75, (rR * 1.08) / cr));
    setChuck(0, P.L, leftRoll, false, sL);
    setChuck(1, H, -rightRoll, true, sR);
    chucks.instanceMatrix.needsUpdate = true;
    pull.position.copy(H);
    pullKnob.position.set(knobC.x + bobPull.x, knobC.y + bobPull.y, knobC.z);
    // アーム：向き = normalize(E − A)、伸縮 = |E − A|（長さが 1e-4 未満なら前の値）
    end.set(H.x + 0.03, H.y, H.z - 0.014);
    pA.subVectors(end, P.A);
    const len = pA.length();
    if (len > 1e-4) { dir.copy(pA).divideScalar(len); prevDirOK = true; } else if (!prevDirOK) dir.set(0, -1, 0);
    const L = Math.max(len, 0.05);
    const outerLen = Math.min(0.34, L * 0.8);
    tubeOuter.scale.set(1, outerLen, 1);
    tubeOuter.position.copy(P.A).addScaledVector(dir, outerLen / 2);
    tubeOuter.quaternion.setFromUnitVectors(Y, dir);
    const inStart = Math.max(0.02, outerLen - 0.06);
    const innerLen = Math.max(0.02, L - inStart);
    tubeInner.scale.set(1, innerLen, 1);
    tubeInner.position.copy(P.A).addScaledVector(dir, inStart + innerLen / 2);
    tubeInner.quaternion.copy(tubeOuter.quaternion);
  }

  return {
    group, pose, wheel, pullKnob, pullProxy, twistProxy, home,
    matWheel, matKnob, matHome,
    dispose() { geos.forEach((g) => g.dispose()); mats.forEach((m) => m.dispose()); chucks.dispose(); },
  };
}
