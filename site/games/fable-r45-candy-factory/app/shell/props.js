// 近景の小物：飴のトレーと塊、はさみ、贈り物の袋とリボン（低ポリ・パラメトリック）
import * as THREE from 'three';
import { LAYOUT, PALETTE } from './config.js';
import { blobShadow } from './scene.js';
import { mergeGeometries } from '../vendor/three/addons/utils/BufferGeometryUtils.js';

const V3 = THREE.Vector3;
const ease = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));
const easeOutBack = (t) => { const c = 1.9; t = Math.min(1, Math.max(0, t)); return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };

// ---------------- トレーと飴の塊 ----------------
export function createTray(scene, tex) {
  const T = LAYOUT.tray;
  const group = new THREE.Group();
  group.name = 'tray';
  const woodMat = new THREE.MeshStandardMaterial({ map: tex.wood, color: 0xfff0e0, roughness: 0.7 });
  const base = new THREE.Mesh(new THREE.BoxGeometry(T.w, 0.014, T.d), woodMat);
  base.position.y = 0.007;
  const rimGeo = new THREE.BoxGeometry(T.w, 0.03, 0.014);
  const rimF = new THREE.Mesh(rimGeo, woodMat); rimF.position.set(0, 0.02, T.d / 2);
  const rimB = new THREE.Mesh(rimGeo, woodMat); rimB.position.set(0, 0.02, -T.d / 2);
  group.add(base, rimF, rimB);
  group.position.set(T.x, 0, T.z);
  scene.add(group);

  // 塊：太く短い棒（カプセル）。geometry は共有、色ごとの material を共有
  const lumpGeo = new THREE.CapsuleGeometry(0.052, 0.075, 6, 16);
  lumpGeo.rotateZ(Math.PI / 2);
  const mats = PALETTE.map((p) => new THREE.MeshStandardMaterial({
    color: p.color, map: tex.candy, roughness: 0.32, emissive: p.color, emissiveIntensity: 0,
  }));
  const proxyGeo = new THREE.SphereGeometry(0.085, 8, 6);
  const proxyMat = new THREE.MeshBasicMaterial({ visible: false });

  const lumps = [];
  // 塊の疑似影は全部で1つの InstancedMesh（draw call 1）
  const SH_MAX = 12;
  const shadowMesh = new THREE.InstancedMesh(
    new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2),
    new THREE.MeshBasicMaterial({ map: tex.shadow, transparent: true, opacity: 0.35, depthWrite: false, color: 0x6a4050 }),
    SH_MAX,
  );
  shadowMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  shadowMesh.renderOrder = -1;
  shadowMesh.frustumCulled = false;
  shadowMesh.count = 0;
  scene.add(shadowMesh);
  const shM = new THREE.Matrix4(), shQ = new THREE.Quaternion(), shP = new V3(), shS = new V3();
  function makeLump() {
    const mesh = new THREE.Mesh(lumpGeo, mats[0]);
    const holder = new THREE.Group();
    holder.add(mesh);
    const proxy = new THREE.Mesh(proxyGeo, proxyMat);
    holder.add(proxy);
    scene.add(holder);
    const L = { holder, mesh, proxy, colorIndex: 0, state: 'gone', bounce: 0, t: 0, from: new V3(), to: new V3(), home: new V3(), hint: 0, onArrive: null, seed: Math.random() * 10, delay: 0 };
    lumps.push(L);
    return L;
  }
  for (let i = 0; i < 5; i++) makeLump();

  function setColor(L, ci) { L.colorIndex = ci; L.mesh.material = mats[ci]; }

  // 新しいトレー：6色から5本を毎回ちがう組み合わせ・並びで
  let roundSeed = 0;
  function fill(first) {
    roundSeed++;
    const order = [0, 1, 2, 3, 4, 5];
    for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
    if (first) { order.splice(order.indexOf(0), 1); order.unshift(0); } // 最初はピンクを先頭に
    for (let i = 0; i < 5; i++) {
      const L = lumps[i];
      setColor(L, order[i]);
      L.home.set(LAYOUT.lumpXs[i], 0.066, LAYOUT.tray.z);
      if (first) { L.state = 'tray'; L.holder.position.copy(L.home); L.holder.visible = true; L.holder.scale.setScalar(1); }
      else { L.state = 'slideIn'; L.t = 0; L.delay = i * 0.06; L.from.copy(L.home).add(new V3(-1.6, 0.3, 0.2)); L.holder.visible = true; L.holder.position.copy(L.from); L.holder.scale.setScalar(1); }
    }
    for (let i = 5; i < lumps.length; i++) { lumps[i].state = 'gone'; lumps[i].holder.visible = false; }
  }

  // 跳ぶ（タップした塊 → hero の lumpDrop）
  function hop(L, target, dur, onArrive) {
    L.state = 'fly'; L.t = 0; L.dur = dur; L.from.copy(L.holder.position); L.to.copy(target); L.onArrive = onArrive;
  }
  function spawnExtra(ci) { // トレーが空のときの予備
    const L = lumps.find((l) => l.state === 'gone') || makeLump();
    setColor(L, ci);
    L.holder.position.set(LAYOUT.tray.x, 0.3, LAYOUT.tray.z);
    L.holder.visible = true;
    return L;
  }

  function update(dt, t) {
    for (const L of lumps) {
      if (L.state === 'tray') {
        // 光る・ぴょこっ
        const beat = Math.max(0, Math.sin(t * 5.0 - lumps.indexOf(L) * 0.7)); // 順に波のように
        L.holder.position.copy(L.home);
        L.holder.position.y += L.hint * 0.02 * beat;
        // その場でぴょん（今は機械に入れられない時にタップされた）
        let s = 1 + L.hint * 0.06 * beat;
        if (L.bounce > 0) {
          L.bounce = Math.max(0, L.bounce - dt);
          const k = 1 - L.bounce / 0.45;
          L.holder.position.y += Math.sin(Math.PI * k) * 0.06;
          s *= 1 + 0.12 * Math.sin(Math.PI * k * 2) * (1 - k);
        }
        L.holder.scale.set(s, 1 / Math.sqrt(s), s);
        L.mesh.material.emissiveIntensity = L.hint * 0.22 * beat;
      } else if (L.state === 'slideIn') {
        if (L.delay > 0) { L.delay -= dt; continue; }
        L.t = Math.min(1, L.t + dt / 0.55);
        L.holder.position.lerpVectors(L.from, L.home, ease(L.t));
        L.holder.position.y += Math.sin(Math.PI * L.t) * 0.05;
        if (L.t >= 1) L.state = 'tray';
      } else if (L.state === 'slideOut') {
        L.t = Math.min(1, L.t + dt / 0.4);
        L.holder.position.lerpVectors(L.from, L.to, ease(L.t));
        if (L.t >= 1) { L.state = 'gone'; L.holder.visible = false; }
      } else if (L.state === 'fly') {
        L.t = Math.min(1, L.t + dt / L.dur);
        const e = ease(L.t);
        L.holder.position.lerpVectors(L.from, L.to, e);
        L.holder.position.y += Math.sin(Math.PI * L.t) * 0.22;
        const sq = 1 + 0.25 * Math.sin(Math.PI * L.t);
        L.holder.scale.set(1 / Math.sqrt(sq), sq, 1 / Math.sqrt(sq));
        L.holder.rotation.z = (1 - e) * 0.8;
        if (L.t >= 1) {
          L.state = 'gone'; L.holder.visible = false; L.holder.rotation.z = 0;
          const cb = L.onArrive; L.onArrive = null; cb && cb(L);
        }
      }
      const i = lumps.indexOf(L);
      if (i < SH_MAX) {
        const on = L.holder.visible && (L.state === 'tray' || L.state === 'slideIn');
        shP.set(L.holder.position.x, 0.016, L.holder.position.z);
        shS.set(on ? 0.2 : 0, 1, on ? 0.12 : 0);
        shadowMesh.setMatrixAt(i, shM.compose(shP, shQ, shS));
      }
    }
    shadowMesh.count = Math.min(SH_MAX, lumps.length);
    shadowMesh.instanceMatrix.needsUpdate = true;
  }

  function slideOutRemaining() {
    for (const L of lumps) if (L.state === 'tray') { L.state = 'slideOut'; L.t = 0; L.from.copy(L.holder.position); L.to.copy(L.holder.position).add(new V3(-1.6, 0.25, 0.1)); }
  }

  return {
    group, lumps, fill, hop, update, spawnExtra, slideOutRemaining,
    available: () => lumps.filter((l) => l.state === 'tray'),
    bounce(L) { L.bounce = 0.45; },
    setHint(level, wave = true) { lumps.forEach((l) => { l.hint = level; }); },
  };
}

// ---------------- はさみ（「できた」と「ちょきん」） ----------------
export function createScissors(scene, tex) {
  const g = new THREE.Group();
  g.name = 'scissors';
  const blade = new THREE.Shape();
  blade.moveTo(0, -0.012); blade.lineTo(0.15, -0.002); blade.quadraticCurveTo(0.16, 0.004, 0.15, 0.008); blade.lineTo(0, 0.014); blade.lineTo(0, -0.012);
  const bladeGeo = new THREE.ExtrudeGeometry(blade, { depth: 0.006, bevelEnabled: false, curveSegments: 4 });
  const metal = new THREE.MeshStandardMaterial({ color: 0xeef2f8, metalness: 0.7, roughness: 0.25, map: tex.steel, emissive: 0xffffff, emissiveIntensity: 0 });
  const ringGeo = new THREE.TorusGeometry(0.034, 0.011, 8, 22);
  const pinkMat = new THREE.MeshStandardMaterial({ color: 0xff7fb0, roughness: 0.4, emissive: 0xff5aa0, emissiveIntensity: 0 });
  const aquaMat = new THREE.MeshStandardMaterial({ color: 0x7fd0ff, roughness: 0.4, emissive: 0x58b8ff, emissiveIntensity: 0 });
  function half(mat, sign) {
    const h = new THREE.Group();
    const b = new THREE.Mesh(bladeGeo, metal);
    b.position.set(0, 0, sign > 0 ? 0 : -0.006);
    const r = new THREE.Mesh(ringGeo, mat);
    r.position.set(-0.05, sign * 0.026, 0);
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.012, 0.008), mat);
    arm.position.set(-0.012, sign * 0.012, 0);
    arm.rotation.z = sign * 0.6;
    h.add(b, r, arm);
    return h;
  }
  const upper = half(pinkMat, 1), lower = half(aquaMat, -1);
  const pinGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.02, 10);
  pinGeo.rotateX(Math.PI / 2);
  const pin = new THREE.Mesh(pinGeo, metal);
  const inner = new THREE.Group();
  inner.add(upper, lower, pin);
  g.add(inner);
  const proxy = new THREE.Mesh(new THREE.SphereGeometry(0.11, 8, 6), new THREE.MeshBasicMaterial({ visible: false }));
  proxy.position.x = 0.02;
  g.add(proxy);
  g.scale.setScalar(1.45);
  const sh = blobShadow(tex, 0.36, 0.16, 0.3);
  scene.add(g, sh);

  const rest = new V3().fromArray(LAYOUT.scissors);
  const S = { mode: 'rest', pos: rest.clone(), goal: rest.clone(), open: 0.35, snipT: 1, hint: 0, t: 0 };
  // 横たわる姿勢（rest）と、刃を下に向けて浮く姿勢（hover）
  const qRest = new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 2.6));
  const qHover = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, -Math.PI / 2 - 0.2));
  const q = qRest.clone();

  function update(dt, t) {
    S.t = t;
    const k = 1 - Math.exp(-dt / 0.09);
    S.pos.lerp(S.goal, k);
    q.slerp(S.mode === 'rest' ? qRest : qHover, k);
    g.quaternion.copy(q);
    const beat = Math.abs(Math.sin(t * Math.PI * 1.6));
    g.position.copy(S.pos);
    if (S.mode === 'rest') g.position.y += S.hint * 0.02 * beat;
    else g.position.y += Math.sin(t * 3) * 0.006;
    // ちょきん：閉じて開く
    S.snipT = Math.min(1, S.snipT + dt / 0.22);
    const target = S.mode === 'rest' ? 0.12 : 0.45;
    const snip = Math.sin(Math.PI * S.snipT);
    S.open = target * (1 - snip);
    upper.rotation.z = S.open / 2; lower.rotation.z = -S.open / 2;
    const glow = S.hint * (0.2 + 0.35 * beat);
    pinkMat.emissiveIntensity = glow; aquaMat.emissiveIntensity = glow; metal.emissiveIntensity = glow * 0.25;
    sh.position.set(g.position.x, 0.004, g.position.z);
    sh.material.opacity = S.mode === 'rest' ? 0.3 : 0.12;
  }

  return {
    group: g, proxy,
    update,
    setHint(v) { S.hint = v; },
    get mode() { return S.mode; },
    rest() { S.mode = 'rest'; S.goal.copy(rest); },
    hover(p) { S.mode = 'hover'; S.goal.copy(p); S.goal.y += 0.14; S.goal.z += 0.02; },
    snipAt(p) { S.mode = 'hover'; S.goal.copy(p).add(new V3(0, 0.07, 0.03)); S.pos.lerp(S.goal, 0.7); S.snipT = 0; },
  };
}

// ---------------- 贈り物の袋（最初に必要になったときに作る） ----------------
const BAG_SCALE = 1.45;
export function createBag(scene, tex) {
  const g = new THREE.Group();
  g.name = 'bag';
  // 袋：回転体（丸い底 → くびれ（リボン）→ 上のひらひら）
  const prof = [];
  const H = 0.30;
  const pts = [[0.0, 0], [0.05, 0.004], [0.075, 0.02], [0.085, 0.06], [0.086, 0.15], [0.078, 0.19], [0.03, 0.225], [0.026, 0.235], [0.05, 0.27], [0.065, H]];
  for (const [r, y] of pts) prof.push(new THREE.Vector2(r, y));
  const bagGeo = new THREE.LatheGeometry(prof, 28);
  tex.cellophane.repeat.set(2, 1);
  const bagMat = new THREE.MeshStandardMaterial({
    map: tex.cellophane, color: 0xffffff, transparent: true, opacity: 0.42, roughness: 0.15, metalness: 0.0,
    side: THREE.DoubleSide, depthWrite: false, emissive: 0xffffff, emissiveIntensity: 0,
  });
  const bag = new THREE.Mesh(bagGeo, bagMat);
  bag.renderOrder = 5;
  const content = new THREE.Group(); // ピースを入れる所
  // リボン
  const ribbon = new THREE.Group();
  const ribbonMat = new THREE.MeshStandardMaterial({ color: 0xff6fa8, roughness: 0.5 });
  const loopGeo = new THREE.TorusGeometry(0.03, 0.009, 8, 18);
  const l1 = new THREE.Mesh(loopGeo, ribbonMat); l1.scale.set(1.2, 0.7, 1); l1.position.set(-0.03, 0, 0.03); l1.rotation.z = 0.35;
  const l2 = l1.clone(); l2.position.x = 0.03; l2.rotation.z = -0.35;
  const knot = new THREE.Mesh(new THREE.SphereGeometry(0.014, 12, 8), ribbonMat); knot.position.z = 0.03;
  const tailGeo = new THREE.BoxGeometry(0.012, 0.06, 0.004);
  const t1 = new THREE.Mesh(tailGeo, ribbonMat); t1.position.set(-0.015, -0.03, 0.03); t1.rotation.z = 0.35;
  const t2 = t1.clone(); t2.position.x = 0.015; t2.rotation.z = -0.35;
  const band = new THREE.Mesh(new THREE.TorusGeometry(0.03, 0.006, 6, 20), ribbonMat); band.rotation.x = Math.PI / 2;
  // 6つの部品を1つの geometry に結合（draw call 1）
  const parts = [l1, l2, knot, t1, t2, band].map((m) => { m.updateMatrix(); const g = m.geometry.clone().applyMatrix4(m.matrix); g.deleteAttribute('uv'); return g; });
  const ribbonMesh = new THREE.Mesh(mergeGeometries(parts, false), ribbonMat);
  parts.forEach((g) => g.dispose());
  ribbon.add(ribbonMesh);
  ribbon.position.y = 0.228;
  ribbon.scale.setScalar(0.001);
  const proxy = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.34, 8), new THREE.MeshBasicMaterial({ visible: false }));
  proxy.position.y = 0.15;
  g.add(content, bag, ribbon, proxy);
  const sh = blobShadow(tex, 0.24, 0.24, 0.4);
  scene.add(g, sh);
  g.visible = false; sh.visible = false;

  const S = { tie: 0, tieGoal: 0, appear: 0, hint: 0, ribbonColors: [0xff6fa8, 0x6fc3ff, 0xffc94d, 0xa98bff, 0x6fe0b0] };
  return {
    group: g, proxy, content, ribbonMat, shadow: sh,
    show(pos, round) {
      g.visible = true; sh.visible = true;
      g.position.copy(pos); g.rotation.set(0, 0, 0); g.scale.setScalar(0.01);
      S.appear = 0; S.tie = 0; S.tieGoal = 0; ribbon.scale.setScalar(0.001);
      ribbonMat.color.setHex(S.ribbonColors[round % S.ribbonColors.length]);
    },
    tie() { S.tieGoal = 1; },
    get tied() { return S.tieGoal >= 1; },
    hide() { g.visible = false; sh.visible = false; },
    setHint(v) { S.hint = v; },
    update(dt, t) {
      if (!g.visible) return;
      S.appear = Math.min(1, S.appear + dt / 0.35);
      const s = easeOutBack(S.appear);
      const beat = Math.abs(Math.sin(t * Math.PI * 1.6));
      g.scale.setScalar(BAG_SCALE * Math.max(0.01, s) * (1 + S.hint * 0.04 * beat));
      if (S.tieGoal > S.tie) {
        S.tie = Math.min(1, S.tie + dt / 0.3);
        ribbon.scale.setScalar(Math.max(0.001, easeOutBack(S.tie)));
      }
      bagMat.emissiveIntensity = S.hint * 0.25 * beat;
      if (g.parent === scene) { sh.visible = true; sh.position.set(g.position.x, 0.003, g.position.z); sh.material.opacity = 0.4 / (1 + Math.max(0, g.position.y) * 8); }
      else sh.visible = false;
    },
  };
}
