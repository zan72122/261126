// おもちゃのダンプトラック（shell）。荷台の砂は hero が bed.anchor の子として持つ。
// ローカル座標：原点＝地面の車体中心、+X＝前（運転台）。heading h で前 = (cos h, 0, -sin h)。
import * as THREE from '../vendor/three/three.module.js';
import { LAYOUT, BED } from './config.js';
import { blobShadow } from './assets.js';
import { mergeStatic } from './merge.js';

const L = 0.95, W = 0.5;
const HINGE_X = -0.46, HINGE_Y = 0.21;
const FLOOR_T = 0.03;
const WHEEL_R = 0.1, WHEEL_X = 0.3, WHEEL_Z = 0.22;

export function createTruck(scene, tier, heightAt) {
  const disposables = [];
  const keep = (x) => { disposables.push(x); return x; };
  const root = new THREE.Group();
  root.name = 'truck';
  const body = new THREE.Group(); // 揺れ・はね用
  root.add(body);

  const mats = {
    cab: keep(new THREE.MeshLambertMaterial({ color: 0x2f8fe0 })),
    dump: keep(new THREE.MeshLambertMaterial({ color: 0xff7a2f })),
    chassis: keep(new THREE.MeshLambertMaterial({ color: 0x4a4f5a })),
    tire: keep(new THREE.MeshLambertMaterial({ color: 0x2a2a2e })),
    hub: keep(new THREE.MeshLambertMaterial({ color: 0xf2f2f2 })),
    glass: keep(new THREE.MeshLambertMaterial({ color: 0xbfe6ff, emissive: 0x1d3a52 })),
    light: keep(new THREE.MeshLambertMaterial({ color: 0xfff3a0, emissive: 0x6b5a10 })),
  };
  const glowMats = [mats.cab, mats.dump];

  const box = (w, h, d, mat, x, y, z, parent = body) => {
    const g = keep(new THREE.BoxGeometry(w, h, d));
    const m = new THREE.Mesh(g, mat);
    m.position.set(x, y, z);
    m.castShadow = tier.shadows;
    parent.add(m);
    return m;
  };
  const rbox = (w, h, d, r, mat, x, y, z, parent = body) => {
    // 角丸の箱（Extrude）
    const s = new THREE.Shape();
    const hw = w / 2 - r, hh = h / 2 - r;
    s.moveTo(-hw, -h / 2); s.lineTo(hw, -h / 2); s.quadraticCurveTo(w / 2, -h / 2, w / 2, -hh);
    s.lineTo(w / 2, hh); s.quadraticCurveTo(w / 2, h / 2, hw, h / 2); s.lineTo(-hw, h / 2);
    s.quadraticCurveTo(-w / 2, h / 2, -w / 2, hh); s.lineTo(-w / 2, -hh); s.quadraticCurveTo(-w / 2, -h / 2, -hw, -h / 2);
    const g = keep(new THREE.ExtrudeGeometry(s, { depth: d - 2 * r, bevelEnabled: true, bevelThickness: r, bevelSize: r * 0.6, bevelSegments: 2, curveSegments: 3 }));
    g.translate(0, 0, -(d - 2 * r) / 2);
    const m = new THREE.Mesh(g, mat);
    m.position.set(x, y, z);
    m.castShadow = tier.shadows;
    parent.add(m);
    return m;
  };

  // 車台
  box(L * 0.92, 0.07, W * 0.62, mats.chassis, -0.02, 0.15, 0);
  // 運転台
  rbox(0.3, 0.28, W * 0.9, 0.05, mats.cab, 0.31, 0.33, 0);
  box(0.02, 0.12, W * 0.74, mats.glass, 0.462, 0.38, 0);
  box(0.16, 0.11, 0.02, mats.glass, 0.31, 0.39, W * 0.45 + 0.001);
  box(0.16, 0.11, 0.02, mats.glass, 0.31, 0.39, -W * 0.45 - 0.001);
  box(0.03, 0.05, 0.08, mats.light, 0.47, 0.24, 0.15);
  box(0.03, 0.05, 0.08, mats.light, 0.47, 0.24, -0.15);
  rbox(0.08, 0.06, W * 0.8, 0.02, mats.chassis, 0.46, 0.17, 0);

  // タイヤ（4本、InstancedMesh 2つ）
  const tireGeo = keep(new THREE.CylinderGeometry(WHEEL_R, WHEEL_R, 0.09, 18));
  tireGeo.rotateX(Math.PI / 2);
  const hubGeo = keep(new THREE.CylinderGeometry(WHEEL_R * 0.5, WHEEL_R * 0.5, 0.095, 12));
  hubGeo.rotateX(Math.PI / 2);
  const tires = new THREE.InstancedMesh(tireGeo, mats.tire, 4);
  const hubs = new THREE.InstancedMesh(hubGeo, mats.hub, 4);
  tires.castShadow = tier.shadows;
  body.add(tires, hubs);
  const wheelPos = [[WHEEL_X, WHEEL_Z], [WHEEL_X, -WHEEL_Z], [-WHEEL_X, WHEEL_Z], [-WHEEL_X, -WHEEL_Z]];
  let wheelSpin = 0;
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), one = new THREE.Vector3(1, 1, 1), tmp = new THREE.Vector3();
  const zAxis = new THREE.Vector3(0, 0, 1);
  function updateWheels() {
    q.setFromAxisAngle(zAxis, wheelSpin);
    wheelPos.forEach(([x, z], i) => {
      tmp.set(x, WHEEL_R, z);
      m4.compose(tmp, q, one);
      tires.setMatrixAt(i, m4); hubs.setMatrixAt(i, m4);
    });
    tires.instanceMatrix.needsUpdate = true; hubs.instanceMatrix.needsUpdate = true;
  }
  updateWheels();

  // 荷台（後ろ下のちょうつがいで傾く）
  const dump = new THREE.Group();
  dump.position.set(HINGE_X, HINGE_Y, 0);
  body.add(dump);
  const bi = BED.inner;
  const innerX0 = 0.015, cx = innerX0 + bi.length / 2; // ちょうつがいからの床中心
  const wt = 0.025;
  box(bi.length + 2 * wt, FLOOR_T, bi.width + 2 * wt, mats.dump, cx, FLOOR_T / 2, 0, dump);
  box(bi.length + 2 * wt, bi.wallHeight, wt, mats.dump, cx, FLOOR_T + bi.wallHeight / 2, bi.width / 2 + wt / 2, dump);
  box(bi.length + 2 * wt, bi.wallHeight, wt, mats.dump, cx, FLOOR_T + bi.wallHeight / 2, -bi.width / 2 - wt / 2, dump);
  box(wt, bi.wallHeight + 0.06, bi.width + 2 * wt, mats.dump, innerX0 + bi.length + wt / 2, FLOOR_T + (bi.wallHeight + 0.06) / 2, 0, dump);
  // 後ろあおり（上辺で開く）
  const gatePivot = new THREE.Group();
  gatePivot.position.set(innerX0 - wt / 2, FLOOR_T + bi.wallHeight, 0);
  dump.add(gatePivot);
  box(wt, bi.wallHeight, bi.width + 2 * wt, mats.dump, 0, -bi.wallHeight / 2, 0, gatePivot);

  // 荷台アンカー：原点＝床上面の中心、+Z＝後ろあおり側（トラックの -X）
  const anchor = new THREE.Object3D();
  anchor.name = 'bedAnchor';
  anchor.position.set(cx, FLOOR_T, 0);
  anchor.rotation.y = -Math.PI / 2;
  dump.add(anchor);

  // 動かない部品を材質ごとに結合（車体 8→4、荷台 4→1 の draw call）。窓・ライトは小さいので影を落とさない
  for (const o of body.children) if (o.material === mats.glass || o.material === mats.light) o.castShadow = false;
  for (const g of [...mergeStatic(body, { disposeOriginals: true }), ...mergeStatic(dump, { disposeOriginals: true })]) keep(g);

  // 当たり判定用（見えない箱）
  const pickGeo = keep(new THREE.BoxGeometry(L + 0.06, 0.55, W + 0.08));
  const pickMat = keep(new THREE.MeshBasicMaterial({ visible: false }));
  const pick = new THREE.Mesh(pickGeo, pickMat);
  pick.position.set(0, 0.28, 0);
  pick.userData.owner = 'truck';
  root.add(pick);

  // 影なしティアでは丸い疑似影
  let blob = null;
  if (!tier.shadows) { blob = blobShadow(THREE, W * 1.3, L * 1.2, 0.4); blob.rotation.y = Math.PI / 2; blob.rotation.order = 'YXZ'; root.add(blob); }

  scene.add(root);

  // ---- 走行：s=0 が駐車、s=pathLen が配達位置（まっすぐ +Z へバック）----
  const T = LAYOUT.truck;
  const pathLen = T.stopZ - T.park.z;
  function poseAt(s, out) {
    out.x = T.park.x; out.z = T.park.z + s; out.h = T.park.heading;
    return out;
  }

  const st = {
    s: 0, mode: 'parked', // parked | out | dumping | back
    t: 0, glow: 0, bounce: 0, bounceV: 0, dumpAngle: 0, gate: 0,
    pitch: 0, roll: 0, y: 0, reversing: false,
  };
  const pose = { x: 0, z: 0, h: 0 };
  const fwd = new THREE.Vector3();

  function groundAt(x, z) { return heightAt(x, z); }

  function applyPose() {
    poseAt(st.s, pose);
    const c = Math.cos(pose.h), sn = Math.sin(pose.h);
    // 4輪の接地高さ
    const hy = [];
    for (const [lx, lz] of wheelPos) {
      const wx = pose.x + lx * c + lz * sn, wz = pose.z - lx * sn + lz * c;
      hy.push(Math.max(groundAt(wx, wz), -0.12));
    }
    const yAvg = (hy[0] + hy[1] + hy[2] + hy[3]) / 4;
    const pitch = Math.atan2((hy[0] + hy[1]) / 2 - (hy[2] + hy[3]) / 2, 2 * WHEEL_X);
    const roll = Math.atan2((hy[0] + hy[2]) / 2 - (hy[1] + hy[3]) / 2, 2 * WHEEL_Z);
    const k = 0.25;
    st.y += (yAvg - st.y) * k; st.pitch += (pitch - st.pitch) * k; st.roll += (roll - st.roll) * k;
    root.position.set(pose.x, st.y, pose.z);
    root.rotation.set(0, pose.h, 0);
    body.rotation.set(-st.roll, 0, st.pitch);
    body.position.y = st.bounce;
  }
  applyPose();
  st.y = 0;

  function update(dt, time) {
    // はね（ばね）
    st.bounceV += (-st.bounce * 260 - st.bounceV * 14) * dt;
    st.bounce += st.bounceV * dt;
    if (st.bounce < 0) { st.bounce = 0; st.bounceV = Math.abs(st.bounceV) * 0.3; }

    let v = 0;
    if (st.mode === 'out') {
      const before = st.s;
      st.s = Math.min(pathLen, st.s + T.speed * dt);
      v = st.s - before;
      st.reversing = true;
      if (st.s >= pathLen) { st.mode = 'arrived'; st.t = 0; st.reversing = false; }
    } else if (st.mode === 'back') {
      const before = st.s;
      st.s = Math.max(0, st.s - T.speed * dt);
      v = before - st.s;
      st.reversing = false;
      if (st.s <= 0) { st.mode = 'parked'; }
    }
    const dir = st.mode === 'out' ? -1 : st.mode === 'back' ? 1 : 0; // バックは逆回転
    wheelSpin -= dir * (v / WHEEL_R);
    updateWheels();

    dump.rotation.z = st.dumpAngle;
    gatePivot.rotation.z = -st.gate;

    // 光る
    const g = st.glow > 0 ? st.glow * (0.5 + 0.5 * Math.sin(time * 6.5)) : 0;
    for (const m of glowMats) m.emissive.setRGB(g * 0.35, g * 0.3, g * 0.12);
    applyPose();
  }

  return {
    root, anchor, pick, state: st,
    pathLen,
    isParked: () => st.mode === 'parked',
    depart() { if (st.mode === 'parked') { st.mode = 'out'; return true; } return false; },
    goBack() { st.mode = 'back'; },
    hop(strength = 1) { st.bounceV = 1.6 * strength; },
    setGlow(v) { st.glow = v; },
    // 荷台の後端（ワールド）＝砂が落ちる口
    tailPoint(out) {
      out.set(0, 0, BED.inner.length / 2 + 0.02);
      return anchor.localToWorld(out);
    },
    forward(out) { return out.set(Math.cos(pose.h), 0, -Math.sin(pose.h)); },
    update,
    dispose() { for (const d of disposables) d.dispose(); tires.dispose(); hubs.dispose(); if (blob) blob.userData.dispose(); scene.remove(root); },
  };
}
