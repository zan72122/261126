// カメラの構図（shell）：主役（ショベルとバケットの掘る所）を中心に、主役の大きさから距離を決める。
// 場面ごとに「ショット」を選び、減衰付き（臨界減衰のばね）でつなぐ。急なズームや揺れはさせない。
//   work    … 作業中。ショベルとバケットの間を見て、バケットの先を少しだけ追う（寄り）
//   load    … 荷台へ積む。ショベルと荷台が両方入るまで引く
//   deliver … 渡す。トラック・お城・友だち（とショベル）が入るまでゆっくり引く
//   guest   … お客さん（友だち）が来た時。deliver と同じ範囲を見せてから work へ寄る
//   finale  … 完成。お城と友だちを中心にゆっくり引く
// 縦長と横長で構図を分ける：画角は「短い辺」で決め、縦長では主役を指の届く下寄りに置く。
// 指が触れている間はショットを切り替えず、バケットも追わない（指の下の物が勝手に動かないように）。
// カメラは毎フレームの最後に動かす。指の判定（レイキャスト）は次のフレームの最初に、
// その時に画面に出ていたカメラで行う（input.frame()）ので、見えている物と指が必ず一致する。
import * as THREE from '../vendor/three/three.module.js';
import { LAYOUT } from './config.js';

const D2R = Math.PI / 180;

// 臨界減衰のばね（Game Programming Gems 4 の SmoothDamp と同じ形）。動き出しも止まり際も滑らか。
function damp(cur, target, vel, i, smooth, dt) {
  const w = 2 / Math.max(1e-4, smooth);
  const x = w * dt;
  const e = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
  const ch = cur - target;
  const tmp = (vel[i] + w * ch) * dt;
  vel[i] = (vel[i] - w * tmp) * e;
  let out = target + (ch + tmp) * e;
  if (!Number.isFinite(out)) { out = target; vel[i] = 0; }
  return out;
}

export function createCameraRig(camera, opts) {
  const C = LAYOUT.camera;
  const { machineCenter, bucketTip, bedPoint, fixedPoints, machineObject } = opts;
  // 状態：[cx, cy, cz, dist, pitch, yaw, screenY]
  const cur = new Float64Array(7), tgt = new Float64Array(7), vel = new Float64Array(7);
  let portrait = false, aspect = 1, halfShort = 20 * D2R, snapNext = true;
  let shot = 'guest', shotT = 0, held = false;
  const followC = new THREE.Vector3(); // work の注視点（指が触れている間は止める）
  let followInit = false;
  const v = new THREE.Vector3(), m = new THREE.Vector3(), b = new THREE.Vector3(), lookAt = new THREE.Vector3();
  // 決まった物でできたショットの範囲（形が変わらないので一度だけ計算）
  // 各点は [x, y, z, 半径]（物の大きさ）
  const fixedSets = {};
  for (const k in fixedPoints) fixedSets[k] = fixedPoints[k].map((p) => ({ p: new THREE.Vector3(p[0], p[1], p[2]), r: p[3] || 0.15 }));
  // ショベル本体・荷台・バケット・腕の中ほど（上がった腕も切らない）
  const loadSet = [{ p: new THREE.Vector3(), r: 0.42 }, { p: new THREE.Vector3(), r: 0.36 }, { p: new THREE.Vector3(), r: 0.2 }, { p: new THREE.Vector3(), r: 0.15 }];
  const vr = new THREE.Vector3(), vu = new THREE.Vector3(), vb = new THREE.Vector3(), q = new THREE.Vector3();
  const fit = { c: new THREE.Vector3(), d: 1 };
  // 物の集まりが画面に収まる注視点と距離：カメラの向き（pitch, yaw）で各点を画面の横・縦へ写して、
  // どの点も「短い辺・長い辺それぞれの fill の内側」に入る一番近い距離を選ぶ（縦長でも横長でも、実際の写り方で合わせる）
  function fitSet(set, pitchDeg, yawDeg, sy, fill) {
    const p = pitchDeg * D2R, y = yawDeg * D2R, cp = Math.cos(p);
    vb.set(Math.sin(y) * cp, Math.sin(p), Math.cos(y) * cp); // 注視点→カメラ
    vr.set(Math.cos(y), 0, -Math.sin(y));
    vu.crossVectors(vb, vr);
    // 画面の横・縦の範囲の中心に注視点を置く
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity, z0 = Infinity, z1 = -Infinity;
    for (const e of set) {
      const a = e.p.dot(vr), b2 = e.p.dot(vu), c2 = e.p.dot(vb);
      x0 = Math.min(x0, a - e.r); x1 = Math.max(x1, a + e.r);
      y0 = Math.min(y0, b2 - e.r); y1 = Math.max(y1, b2 + e.r);
      z0 = Math.min(z0, c2); z1 = Math.max(z1, c2);
    }
    fit.c.copy(vr).multiplyScalar((x0 + x1) / 2).addScaledVector(vu, (y0 + y1) / 2).addScaledVector(vb, (z0 + z1) / 2);
    const tanV = Math.tan((camera.fov / 2) * D2R), tanH = tanV * aspect;
    let d = 0.5;
    for (const e of set) {
      q.copy(e.p).sub(fit.c);
      const a = q.dot(vr), b2 = q.dot(vu), depth = -q.dot(vb); // depth＞0 は注視点より奥
      d = Math.max(d, (Math.abs(a) + e.r) / (fill * tanH) - depth);
      // 縦：注視点は画面の sy にある。上へは fill - sy、下へは fill + sy まで使える
      const lim = b2 >= 0 ? fill - sy : fill + sy;
      d = Math.max(d, (Math.abs(b2) + e.r) / (Math.max(0.2, lim) * tanV) - depth);
    }
    fit.d = d;
    return fit;
  }

  // 球（半径 r）が短い辺の fill を占める距離
  const distFor = (r, fill) => r / Math.sin(Math.atan(fill * Math.tan(halfShort)));
  const o = () => (portrait ? C.portrait : C.landscape);

  function resize(w, h) {
    aspect = w / h;
    const was = portrait;
    portrait = aspect < 1;
    // 画角は短い辺で決める（横長＝縦の画角、縦長＝横の画角）。4:3 の横幅を守る作りはやめた
    halfShort = (o().shortFov / 2) * D2R;
    const vHalf = portrait ? Math.atan(Math.tan(halfShort) / aspect) : halfShort;
    camera.aspect = aspect;
    camera.fov = (2 * vHalf) / D2R;
    camera.updateProjectionMatrix();
    if (was !== portrait) snapNext = true; // 向きが変わった時は構図を作り直す（滑らせない）
  }

  function setTarget(dt) {
    const L = o();
    let c, r, fill, pitch = L.pitch, sy = L.screenY;
    if (shot === 'work' || shot === 'load') {
      machineCenter(m);
      bucketTip(b);
      const sb = LAYOUT.sandbox;
      b.x = THREE.MathUtils.clamp(b.x, sb.minX - 0.2, sb.maxX + 0.2);
      b.z = THREE.MathUtils.clamp(b.z, sb.minZ - 0.2, sb.maxZ + 0.2);
      const by = b.y;
      b.y = THREE.MathUtils.clamp(b.y, 0, 0.45);
      if (shot === 'work') {
        if (!held || !followInit) { followC.copy(m).lerp(b, C.follow); followInit = true; }
        c = followC; r = C.heroRadius; fill = C.fill;
      } else {
        // ショベル・荷台・バケットが入るまで引く（荷台の位置はトラックが止まっている所）
        loadSet[0].p.copy(m); bedPoint(loadSet[1].p); loadSet[2].p.copy(b).setY(THREE.MathUtils.clamp(by, 0, 1.0));
        loadSet[3].p.copy(m).lerp(loadSet[2].p, 0.5); loadSet[3].p.y = Math.max(loadSet[3].p.y, loadSet[2].p.y) + 0.15;
        pitch += L.loadPitch || 0;
        const f = fitSet(loadSet, pitch, C.yaw, sy, C.loadFill);
        c = f.c; r = 0; fill = 0;
        // work より近づかない（荷台が入るまで「引く」）
        tgt[3] = Math.max(f.d, distFor(C.heroRadius, C.fill));
      }
    } else {
      sy = L.screenYWide;
      const f = fitSet(fixedSets[shot] || fixedSets.deliver, pitch, C.yaw, sy, C.groupFill);
      c = f.c; tgt[3] = f.d; r = 0;
    }
    tgt[0] = c.x; tgt[1] = c.y; tgt[2] = c.z;
    if (r > 0) tgt[3] = distFor(r, fill);
    tgt[4] = pitch * D2R; tgt[5] = C.yaw * D2R; tgt[6] = sy;
  }

  function apply() {
    const pitch = cur[4], yaw = cur[5], d = cur[3];
    const cp = Math.cos(pitch);
    lookAt.set(cur[0], cur[1], cur[2]);
    camera.position.set(cur[0] + Math.sin(yaw) * cp * d, cur[1] + Math.sin(pitch) * d, cur[2] + Math.cos(yaw) * cp * d);
    camera.up.set(0, 1, 0);
    camera.lookAt(lookAt);
    // 注視点を画面の上下 screenY（NDC）に置く：カメラを上に傾ける（縦の線は少し傾くが、画面の端で切れない）
    const vHalf = (camera.fov / 2) * D2R;
    camera.rotateX(Math.atan(-cur[6] * Math.tan(vHalf)));
    camera.updateMatrixWorld(true);
  }

  return {
    resize,
    get shot() { return shot; },
    // name: 場面が求めるショット、dragging: 指で主役を動かしている間
    update(dt, name, dragging) {
      held = !!dragging;
      if (!held && name !== shot) { shot = name; shotT = 0; }
      shotT += dt;
      setTarget(dt);
      if (snapNext) {
        snapNext = false;
        for (let i = 0; i < 7; i++) { cur[i] = tgt[i]; vel[i] = 0; }
      } else {
        // 引く場面はゆっくり、寄る場面は少し速く。指が触れている間はさらにゆっくり
        let smooth = C.smooth[shot] || 0.6;
        if (held) smooth *= 4;
        for (let i = 0; i < 7; i++) cur[i] = damp(cur[i], tgt[i], vel, i, smooth, dt);
      }
      apply();
    },
    snap() { snapNext = true; },
    focus(out) { return out.set(cur[0], cur[1], cur[2]); },
    // 注視点の高さで見える短い辺の半分の長さ（影の範囲などに使う）
    visibleHalf() { return cur[3] * Math.tan(halfShort); },
    // ?debug=1 の確認用：主役（ショベル本体）の画面上の大きさ（短い辺に対する割合）
    measure(canvasW, canvasH) {
      const obj = machineObject();
      if (!obj) return 0;
      let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
      obj.updateMatrixWorld(true);
      obj.traverseVisible((o) => {
        if (!o.isMesh || !o.geometry || !o.geometry.attributes.position || !o.material || o.material.visible === false) return;
        const p = o.geometry.attributes.position;
        const n = o.isInstancedMesh ? 0 : p.count;
        for (let i = 0; i < n; i++) {
          v.fromBufferAttribute(p, i).applyMatrix4(o.matrixWorld).project(camera);
          if (v.z > 1) continue;
          x0 = Math.min(x0, v.x); x1 = Math.max(x1, v.x); y0 = Math.min(y0, v.y); y1 = Math.max(y1, v.y);
        }
      });
      if (!(x1 > x0)) return 0;
      const wpx = ((x1 - x0) / 2) * canvasW, hpx = ((y1 - y0) / 2) * canvasH;
      return Math.max(wpx, hpx) / Math.min(canvasW, canvasH);
    },
    debugLine() {
      return `cam ${shot}${held ? '(hold)' : ''} ${portrait ? 'portrait' : 'landscape'} d ${cur[3].toFixed(2)}m fov ${camera.fov.toFixed(0)}° pitch ${(cur[4] / D2R).toFixed(0)}°`;
    },
  };
}
