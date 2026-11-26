// お客さん：顔が単純でかわいい動物（球の組み合わせ、テクスチャなし）。
// 状態：enter → wait（expect で手を伸ばす）→ receive → eat → happy → leave
import { CUSTOMER, COUNTER } from './layout.js';

export const KINDS = [
  { id: 'bunny', fur: 0xfff4f0, inner: 0xffc2d4, muzzle: 0xffffff, nose: 0xff7fa6, ears: 'long' },
  { id: 'bear', fur: 0xc88b5a, inner: 0xf0c49a, muzzle: 0xf3d6b4, nose: 0x4a2c20, ears: 'round' },
  { id: 'cat', fur: 0xffc27a, inner: 0xffd9e2, muzzle: 0xfff1de, nose: 0xff8fa6, ears: 'tri' },
  { id: 'panda', fur: 0xffffff, inner: 0x2b2b33, muzzle: 0xffffff, nose: 0x2b2b33, ears: 'round', patches: 0x2b2b33 },
];

const HEAD_Y = 1.20, HEAD_R = 0.165;

export function createCustomerFactory(THREE, tex) {
  const geos = {
    sphere: new THREE.SphereGeometry(1, 20, 14),
    sphereLo: new THREE.SphereGeometry(1, 12, 8),
    cone: new THREE.ConeGeometry(1, 1, 12, 1),
    arc: new THREE.TorusGeometry(1, 0.22, 6, 16, Math.PI),   // 目の「^」・口の笑い
    heart: heartGeometry(THREE),
    halo: new THREE.PlaneGeometry(1, 1),
  };
  const black = new THREE.MeshStandardMaterial({ color: 0x241a1e, roughness: 0.35 });
  const white = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const cheekMat = new THREE.MeshStandardMaterial({ color: 0xff8fa6, roughness: 0.9, transparent: true, opacity: 0.75 });
  const mouthMat = new THREE.MeshStandardMaterial({ color: 0x7a2c3a, roughness: 0.8 });
  const heartMat = new THREE.MeshBasicMaterial({ color: 0xff6f9c, transparent: true, depthWrite: false });
  const haloMat = new THREE.MeshBasicMaterial({ map: tex.glow, color: 0xfff0b0, transparent: true, opacity: 0, depthWrite: false, toneMapped: false });
  const shared = [black, white, cheekMat, mouthMat, heartMat, haloMat, ...Object.values(geos)];

  function create(kindIndex, sfx) {
    const kind = KINDS[kindIndex % KINDS.length];
    const own = [];
    const mat = (c, r = 0.85) => { const m = new THREE.MeshStandardMaterial({ color: c, roughness: r }); own.push(m); return m; };
    const furM = mat(kind.fur), innerM = mat(kind.inner), muzM = mat(kind.muzzle), noseM = mat(kind.nose, 0.4);
    const smearM = mat(0xff8fc0, 1.0); smearM.transparent = true; smearM.opacity = 0.9; smearM.emissive.setHex(0x332a2a);
    const patchM = kind.patches ? mat(kind.patches) : null;
    const M = (g, m, x, y, z, sx, sy, sz) => { const o = new THREE.Mesh(g, m); o.position.set(x, y, z); o.scale.set(sx, sy ?? sx, sz ?? sx); return o; };

    const root = new THREE.Group(); root.name = 'customer-' + kind.id;
    const bodyG = new THREE.Group(); root.add(bodyG);         // 跳ねる・傾く
    const body = M(geos.sphere, furM, 0, 0.76, 0, 0.21, 0.36, 0.18); bodyG.add(body);
    const belly = M(geos.sphereLo, muzM, 0, 0.78, 0.085, 0.14, 0.22, 0.11); bodyG.add(belly);
    const headG = new THREE.Group(); headG.position.set(0, HEAD_Y, 0); bodyG.add(headG);
    headG.add(M(geos.sphere, furM, 0, 0, 0, HEAD_R, HEAD_R * 0.94, HEAD_R * 0.92));
    // 耳
    const earL = new THREE.Group(), earR = new THREE.Group();
    earL.position.set(-0.085, 0.12, -0.01); earR.position.set(0.085, 0.12, -0.01);
    headG.add(earL, earR);
    for (const [e, s] of [[earL, -1], [earR, 1]]) {
      if (kind.ears === 'long') {
        e.add(M(geos.sphere, furM, 0, 0.12, 0, 0.045, 0.13, 0.03));
        e.add(M(geos.sphereLo, innerM, 0, 0.12, 0.018, 0.026, 0.1, 0.015));
        e.rotation.z = -s * 0.18;
      } else if (kind.ears === 'tri') {
        const c = M(geos.cone, furM, 0, 0.04, 0, 0.06, 0.1, 0.03); e.add(c);
        e.add(M(geos.cone, innerM, 0, 0.035, 0.016, 0.035, 0.065, 0.012));
        e.rotation.z = -s * 0.35; e.position.y = 0.1;
      } else {
        e.add(M(geos.sphereLo, patchM || furM, 0, 0.03, 0, 0.055, 0.052, 0.03));
        e.add(M(geos.sphereLo, patchM ? patchM : innerM, 0, 0.03, 0.014, 0.033, 0.03, 0.02));
        e.rotation.z = -s * 0.4; e.position.x = s * 0.11; e.position.y = 0.1;
      }
    }
    // 顔（+z がカメラ側）
    const fz = HEAD_R * 0.86;
    headG.add(M(geos.sphere, muzM, 0, -0.055, fz - 0.03, 0.075, 0.055, 0.05));
    if (patchM) for (const s of [-1, 1]) { const p = M(geos.sphereLo, patchM, s * 0.058, 0.0, fz - 0.025, 0.04, 0.05, 0.03); p.rotation.z = s * 0.5; headG.add(p); }
    const nose = M(geos.sphereLo, noseM, 0, -0.03, fz + 0.012, 0.018, 0.013, 0.012); headG.add(nose);
    const eyes = new THREE.Group(); headG.add(eyes);
    const eyeBalls = [];
    for (const s of [-1, 1]) {
      const eg = new THREE.Group(); eg.position.set(s * 0.058, 0.0, fz - 0.005); eyes.add(eg);
      const ball = M(geos.sphereLo, black, 0, 0, 0, 0.024, 0.028, 0.016); eg.add(ball);
      eg.add(M(geos.sphereLo, white, -0.007, 0.009, 0.014, 0.008, 0.008, 0.004));
      eyeBalls.push(eg);
    }
    const happyEyes = new THREE.Group(); headG.add(happyEyes); happyEyes.visible = false;
    for (const s of [-1, 1]) { const a = M(geos.arc, black, s * 0.058, -0.004, fz, 0.022, 0.022, 0.022); happyEyes.add(a); }
    const smile = M(geos.arc, mouthMat, 0, -0.07, fz + 0.012, 0.022, 0.018, 0.02); smile.rotation.z = Math.PI; smile.userData.dynamic = true; headG.add(smile);
    const openMouth = M(geos.sphereLo, mouthMat, 0, -0.075, fz + 0.005, 0.022, 0.024, 0.012); openMouth.visible = false; openMouth.userData.dynamic = true; headG.add(openMouth);
    const cheeks = [];
    for (const s of [-1, 1]) { const c = M(geos.sphereLo, cheekMat, s * 0.098, -0.04, fz - 0.035, 0.03, 0.02, 0.012); c.rotation.y = s * 0.5; headG.add(c); cheeks.push(c); }
    // 口のまわりのわたあめ（食べた後に出る）
    const smear = new THREE.Group(); smear.visible = false; headG.add(smear);
    [[-0.04, -0.082, 0.017], [0.038, -0.088, 0.013], [0.012, -0.104, 0.011]]
      .forEach(([x, y, r]) => smear.add(M(geos.sphereLo, smearM, x, y, fz + 0.004, r * 1.3, r, r * 0.45)));
    // 腕と手（肩から回る）
    const arms = [];
    for (const s of [-1, 1]) {
      const sh = new THREE.Group(); sh.position.set(s * 0.17, 0.98, 0.02); bodyG.add(sh);
      const arm = M(geos.sphereLo, furM, 0, -0.08, 0, 0.05, 0.11, 0.05); sh.add(arm);
      const paw = M(geos.sphereLo, patchM || furM, 0, -0.18, 0, 0.05, 0.05, 0.05); sh.add(paw);
      arms.push({ sh, s });
    }
    // わたあめを持つ点（両手の間）
    const grip = new THREE.Group(); bodyG.add(grip);
    // 後光（ヒント用）
    const halo = new THREE.Mesh(geos.halo, haloMat.clone()); own.push(halo.material);
    halo.position.set(0, HEAD_Y - 0.05, -0.25); halo.scale.setScalar(0.9); halo.renderOrder = -1; root.add(halo);
    // 疑似影
    const shadow = new THREE.Mesh(geos.halo, new THREE.MeshBasicMaterial({ color: 0x1a0f0a, alphaMap: tex.blob, transparent: true, opacity: 0.4, depthWrite: false }));
    own.push(shadow.material); shadow.rotation.x = -Math.PI / 2; shadow.scale.set(0.5, 0.4, 1); shadow.position.y = 0.003; root.add(shadow);
    // ハート（6つ、使い回し）
    const hearts = [];
    for (let i = 0; i < 6; i++) {
      const h = new THREE.Mesh(geos.heart, heartMat.clone()); own.push(h.material);
      h.visible = false; h.renderOrder = 5; root.add(h);
      hearts.push({ m: h, t: -1, x: 0, vx: 0 });
    }

    // 動かない部品は材質ごとに1つにまとめる（draw call を減らす）
    for (const grp of [bodyG, headG, earL, earR, eyes, happyEyes, smear, ...arms.map(a => a.sh)]) own.push(...mergeStatic(THREE, grp));
    // 耳は頭にまとめる
    // （earL/earR はそれぞれまとめ済み）

    // 当たり判定（大きめの箱）
    const hitM = new THREE.MeshBasicMaterial({ visible: false }); own.push(hitM);
    const hitG = new THREE.BoxGeometry(0.6, 0.75, 0.5); own.push(hitG);
    const hit = new THREE.Mesh(hitG, hitM); hit.position.set(0, 1.12, 0.05); hit.userData.customer = true; root.add(hit);

    root.position.set(...CUSTOMER.enterFrom);

    // ---- 状態
    const st = {
      mode: 'enter', t: 0, expect: 0, expectTarget: 0, hint: 0, blinkT: 2 + Math.random() * 2,
      handle: null, bigness: 0, munches: 0, onDone: null, look: 0, wave: 0, tilt: 0, surprise: 0,
    };
    const from = new THREE.Vector3(...CUSTOMER.enterFrom), home = new THREE.Vector3(...CUSTOMER.pos), to = new THREE.Vector3(...CUSTOMER.exitTo);
    const v = new THREE.Vector3(), gripTarget = new THREE.Vector3(0, 0.86, 0.24);
    grip.position.copy(gripTarget);

    function spawnHearts(n) {
      let k = 0;
      for (const h of hearts) { if (k >= n) break; if (h.t < 0) { h.t = 0; h.x = (Math.random() - 0.5) * 0.3; h.vx = (Math.random() - 0.5) * 0.15; h.delay = k * 0.12; k++; } }
    }

    function setArms(reach, hold, wave, t) {
      // reach 0..1：前に手を伸ばす。hold：わたあめを持つ。wave：片手を振る
      for (const a of arms) {
        let rx = -0.2 * (1 - reach) - 1.25 * reach, rz = a.s * (0.25 - 0.15 * reach);
        if (hold > 0) { rx = rx * (1 - hold) + (-1.15) * hold; rz = rz * (1 - hold) + a.s * -0.28 * hold; }
        if (wave > 0 && a.s > 0) { rx = rx * (1 - wave) + (-2.6) * wave; rz = rz * (1 - wave) + (-0.3 + Math.sin(t * 14) * 0.35) * wave; }
        if (reach > 0 && hold === 0) rx += Math.sin(t * 9 + a.s) * 0.08 * reach;
        a.sh.rotation.set(rx, 0, rz);
      }
    }

    const api = {
      root, kind, hit, grip, headG,
      get mode() { return st.mode; },
      get ready() { return st.mode === 'wait'; },
      // 渡せる合図（0..1）
      setExpect(x) { st.expectTarget = x; },
      setHint(x) { st.hint = x; },
      // 空の割り箸を渡されそうになった／空でタップされた：首をかしげてにこっ
      puzzle() { if (st.mode === 'wait') { st.tilt = 1.0; sfx.hmm(); } },
      wave() { if (st.mode === 'wait') st.wave = 1.6; },
      // わたあめが育った節目：目をまるくしてぴょん
      surprise() { if (st.mode === 'wait') st.surprise = 0.6; },
      // わたあめが手元に届く位置（ワールド）
      gripWorld(out) { return grip.getWorldPosition(out); },
      receive(handle, bigness) { st.mode = 'receive'; st.t = 0; st.handle = handle; st.bigness = bigness; },
      startEat(onDone) { st.mode = 'eat'; st.t = 0; st.munches = 0; st.onDone = onDone; },
      leave(onGone) { st.mode = 'leave'; st.t = 0; st.onDone = onGone; },
      update, dispose,
    };

    function update(dt, t) {
      st.t += dt;
      st.expect += (st.expectTarget - st.expect) * Math.min(1, dt * 6);
      st.tilt = Math.max(0, st.tilt - dt * 0.8);
      st.wave = Math.max(0, st.wave - dt);
      st.surprise = Math.max(0, st.surprise - dt);
      // まばたき
      st.blinkT -= dt;
      const blink = st.blinkT < 0.12 && st.blinkT > 0 ? 0.15 : 1;
      if (st.blinkT < 0) st.blinkT = 2.2 + Math.random() * 2.5;
      eyeBalls.forEach(e => { const w = 1 + st.surprise * 0.5; e.scale.set(w, blink * (1 + st.expect * 0.25) * w, 1); });

      let hop = 0, lean = 0, reach = 0, hold = 0;
      halo.material.opacity = 0;
      if (st.mode === 'enter') {
        const k = Math.min(1, st.t / 1.3);
        v.lerpVectors(from, home, easeOut(k)); root.position.copy(v);
        hop = Math.abs(Math.sin(st.t * 9)) * 0.06 * (1 - k);
        if (k >= 1) { st.mode = 'wait'; st.t = 0; st.wave = 1.4; }
      } else if (st.mode === 'wait') {
        root.position.copy(home);
        const ex = st.expect;
        hop = Math.abs(Math.sin(t * 5)) * 0.03 * ex + Math.abs(Math.sin(t * 7)) * 0.04 * st.hint + Math.sin(st.surprise / 0.6 * Math.PI) * 0.06;
        lean = 0.12 * ex;
        reach = ex;
        halo.material.opacity = 0.55 * st.hint * (0.75 + 0.25 * Math.sin(t * 4));
      } else if (st.mode === 'receive') {
        root.position.copy(home); reach = 1; lean = 0.15;
      } else if (st.mode === 'eat') {
        root.position.copy(home);
        hold = 1; lean = 0.22;
        const munchT = 0.36;
        const n = Math.floor(st.t / munchT);
        if (n > st.munches && n <= 4) { st.munches = n; sfx.munch(); }
        if (st.t > 4 * munchT + 0.2) {
          st.mode = 'happy'; st.t = 0;
          smear.visible = true;
          spawnHearts(3 + Math.min(3, st.bigness));
          sfx.yay(st.bigness);
          if (st.onDone) { const f = st.onDone; st.onDone = null; f(); }
        }
      } else if (st.mode === 'happy') {
        root.position.copy(home); hold = 0.6;
        const hops = 2 + st.bigness;
        const period = 0.42;
        if (st.t < hops * period) {
          hop = Math.abs(Math.sin(st.t / period * Math.PI)) * (0.06 + 0.02 * st.bigness);
          if (Math.floor(st.t / period) !== Math.floor((st.t - dt) / period)) sfx.hop();
        }
      } else if (st.mode === 'leave') {
        const k = Math.min(1, st.t / 1.5);
        v.lerpVectors(home, to, easeIn(k)); root.position.copy(v);
        hop = Math.abs(Math.sin(st.t * 9)) * 0.06; hold = 0.6;
        if (k >= 1 && st.onDone) { const f = st.onDone; st.onDone = null; f(); }
      }
      // 表情
      const isHappy = st.mode === 'happy' || st.mode === 'leave';
      happyEyes.visible = isHappy; eyes.visible = !isHappy;
      const eating = st.mode === 'eat';
      openMouth.visible = eating || (st.mode === 'wait' && (st.expect > 0.6 || st.surprise > 0)) || st.mode === 'receive';
      smile.visible = !openMouth.visible;
      if (eating) openMouth.scale.y = 0.012 + 0.02 * Math.abs(Math.sin(st.t / 0.36 * Math.PI));
      else openMouth.scale.y = 0.024;
      cheeks.forEach(c => { c.material.opacity = isHappy ? 1.0 : 0.7; });

      bodyG.position.y = hop;
      bodyG.rotation.x = lean;
      headG.rotation.z = Math.sin(t * 1.3) * 0.04 + st.tilt * 0.3 * Math.sin(Math.min(1, st.tilt) * Math.PI);
      headG.rotation.x = eating ? 0.25 + Math.sin(st.t / 0.36 * Math.PI * 2) * 0.06 : 0;
      setArms(reach, hold, st.wave > 0 ? Math.min(1, st.wave) : 0, t);

      // 手元（grip）：持つ位置。食べる間は顔のすぐ前、それ以外は胸の前（なめらかに移る）
      if (st.handle) {
        const h = st.handle;
        if (eating) {
          // わたあめの中心が口の少し前に来るように：grip = 口 - candyCenter + 前へ (半径 * 0.55)
          gripTarget.set(0, HEAD_Y - 0.06 - h.candyCenter.y, HEAD_R * 0.8 + h.radius * 0.55);
        } else if (isHappy) {
          gripTarget.set(0.24, 0.80, 0.16);
        } else {
          gripTarget.set(0, 0.86, 0.24);
        }
      } else gripTarget.set(0, 0.86, 0.24);
      grip.position.lerp(gripTarget, Math.min(1, dt * 7));

      // ハート
      for (const h of hearts) {
        if (h.t < 0) continue;
        h.t += dt;
        const k = h.t - (h.delay || 0);
        if (k < 0) { h.m.visible = false; continue; }
        if (k > 1.6) { h.t = -1; h.m.visible = false; continue; }
        h.m.visible = true;
        h.m.position.set(h.x + h.vx * k + Math.sin(k * 6) * 0.02, HEAD_Y + 0.15 + k * 0.32, 0.18);
        const s = 0.05 * Math.min(1, k * 5) * (1 + 0.15 * Math.sin(k * 12));
        h.m.scale.set(s, s, s);
        h.m.material.opacity = Math.min(1, (1.6 - k) * 2);
      }
    }

    function setSmearColor(hex) { smearM.color.setHex(hex); }
    api.setSmearColor = setSmearColor;

    function dispose() {
      root.removeFromParent();
      for (const o of own) o.dispose();
    }
    return api;
  }

  return { create, dispose() { for (const s of shared) s.dispose(); } };
}

// grp の直下の Mesh（子を持たない、userData.dynamic でない）を材質ごとに結合して置き換える
function mergeStatic(THREE, grp) {
  const by = new Map(), made = [];
  for (const o of grp.children.slice()) {
    if (!o.isMesh || o.children.length || o.userData.dynamic) continue;
    if (!by.has(o.material)) by.set(o.material, []);
    by.get(o.material).push(o);
  }
  for (const [mat, list] of by) {
    if (list.length < 2) continue;
    let nv = 0, ni = 0;
    for (const o of list) { nv += o.geometry.attributes.position.count; ni += o.geometry.index ? o.geometry.index.count : o.geometry.attributes.position.count; }
    const pos = new Float32Array(nv * 3), nor = new Float32Array(nv * 3), idx = new Uint32Array(ni);
    const v = new THREE.Vector3(), nm = new THREE.Matrix3();
    let vo = 0, io = 0;
    for (const o of list) {
      o.updateMatrix(); nm.getNormalMatrix(o.matrix);
      const g = o.geometry, P = g.attributes.position, N = g.attributes.normal;
      for (let i = 0; i < P.count; i++) {
        v.fromBufferAttribute(P, i).applyMatrix4(o.matrix); pos.set([v.x, v.y, v.z], (vo + i) * 3);
        v.fromBufferAttribute(N, i).applyMatrix3(nm).normalize(); nor.set([v.x, v.y, v.z], (vo + i) * 3);
      }
      if (g.index) for (let i = 0; i < g.index.count; i++) idx[io++] = g.index.getX(i) + vo;
      else for (let i = 0; i < P.count; i++) idx[io++] = i + vo;
      vo += P.count;
      grp.remove(o);
    }
    const mg = new THREE.BufferGeometry();
    mg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    mg.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
    mg.setIndex(new THREE.BufferAttribute(nv > 65535 ? idx : new Uint16Array(idx), 1));
    mg.computeBoundingSphere();
    grp.add(new THREE.Mesh(mg, mat));
    made.push(mg);
  }
  return made;
}

function easeOut(x) { return 1 - (1 - x) * (1 - x); }
function easeIn(x) { return x * x; }

function heartGeometry(THREE) {
  const s = new THREE.Shape();
  s.moveTo(0, -0.9);
  s.bezierCurveTo(-0.2, -0.6, -1.0, -0.2, -1.0, 0.35);
  s.bezierCurveTo(-1.0, 0.85, -0.45, 1.05, 0, 0.6);
  s.bezierCurveTo(0.45, 1.05, 1.0, 0.85, 1.0, 0.35);
  s.bezierCurveTo(1.0, -0.2, 0.2, -0.6, 0, -0.9);
  return new THREE.ShapeGeometry(s, 8);
}
