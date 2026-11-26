// 友だちの砂のお城。配達のたびに1段ずつ育つ（土台の山 → 天守 → 塔 → 旗）。
// 形は友だちごとに少し変える（塔の数・旗の色）。湿った砂のテクスチャ（shell 用の複製）を使う。
import * as THREE from '../vendor/three/three.module.js';

export function createCastle(scene, tier, pos, wetTex, design, dryTex) {
  const group = new THREE.Group();
  group.name = 'castle';
  group.position.copy(pos);
  scene.add(group);
  const disposables = [];
  const keep = (x) => { disposables.push(x); return x; };
  const sandMat = keep(new THREE.MeshLambertMaterial({ map: dryTex || wetTex }));
  sandMat.color.setRGB(1.0, 0.86, 0.7); // 乾いた砂の写真を少し湿った色に（湿った砂の写真は暗すぎる）
  const pieces = []; // {obj, t, target}
  // お城を建てる場所（芝生の上の湿った砂の丸）：最初から見せて「ここに砂を運ぶ」と分かるように
  {
    const g = keep(new THREE.CircleGeometry(0.42, 28));
    g.rotateX(-Math.PI / 2);
    const pm = keep(new THREE.MeshLambertMaterial({ map: dryTex || wetTex }));
    pm.color.setRGB(0.86, 0.8, 0.72);
    const m = new THREE.Mesh(g, pm);
    m.position.y = 0.004;
    m.receiveShadow = tier.shadows;
    group.add(m);
  }
  // 当たり判定（見えない円柱）：お城をトンしても「渡す」へ進める
  const pick = new THREE.Mesh(keep(new THREE.CylinderGeometry(0.42, 0.42, 0.6, 10)), keep(new THREE.MeshBasicMaterial({ visible: false })));
  pick.position.y = 0.3;
  group.add(pick);
  let count = 0;
  let mound = null;
  let moundSize = 0, moundTarget = 0;

  function lathe(profile, seg = 20) {
    const g = keep(new THREE.LatheGeometry(profile.map(([r, y]) => new THREE.Vector2(r, y)), seg));
    return g;
  }
  function addMesh(geo, mat, parent, x = 0, y = 0, z = 0) {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    m.castShadow = tier.shadows; m.receiveShadow = tier.shadows;
    parent.add(m);
    return m;
  }
  function crenels(parent, r, y, n, size) {
    const g = keep(new THREE.BoxGeometry(size, size * 0.9, size));
    const inst = new THREE.InstancedMesh(g, sandMat, n);
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(1, 1, 1), p = new THREE.Vector3();
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), -a);
      p.set(Math.cos(a) * r, y, Math.sin(a) * r);
      inst.setMatrixAt(i, m4.compose(p, q, s));
    }
    inst.castShadow = tier.shadows;
    parent.add(inst);
    return inst;
  }
  function towerAt(parent, x, z, r, h) {
    const t = new THREE.Group();
    t.position.set(x, 0, z);
    addMesh(lathe([[0, 0], [r, 0], [r * 0.85, h], [r * 0.95, h], [r * 0.95, h + 0.012], [0, h + 0.012]], 14), sandMat, t);
    crenels(t, r * 0.8, h + 0.02, 6, r * 0.45);
    parent.add(t);
    return t;
  }

  const builders = [
    // 0: 土台の山
    () => {
      const g = new THREE.Group();
      mound = addMesh(lathe([[0, 0], [0.32, 0], [0.29, 0.03], [0.22, 0.08], [0.12, 0.105], [0, 0.11]], 24), sandMat, g);
      return g;
    },
    // 1: 天守（円柱＋のこぎり屋根）
    () => {
      const g = new THREE.Group();
      g.position.y = 0.095;
      addMesh(lathe([[0, 0], [0.14, 0], [0.13, 0.17], [0.145, 0.17], [0.145, 0.19], [0, 0.19]], 20), sandMat, g);
      crenels(g, 0.125, 0.205, 8, 0.04);
      const door = addMesh(keep(new THREE.CircleGeometry(0.045, 12, 0, Math.PI)), keep(new THREE.MeshLambertMaterial({ color: 0x7a5130 })), g, 0, 0.0, 0.142);
      door.scale.y = 1.6;
      return g;
    },
    // 2: 塔（友だちごとに本数がちがう）
    () => {
      const g = new THREE.Group();
      const n = design.castleTowers;
      for (let i = 0; i < n; i++) {
        const a = Math.PI * 0.15 + (i / n) * Math.PI * 2;
        towerAt(g, Math.cos(a) * 0.22, Math.sin(a) * 0.22 + 0.02, 0.06, 0.12 + (i % 2) * 0.03).position.y = 0.035;
      }
      return g;
    },
    // 3: 旗と貝がら
    () => {
      const g = new THREE.Group();
      const pole = addMesh(keep(new THREE.CylinderGeometry(0.006, 0.006, 0.22, 6)), keep(new THREE.MeshLambertMaterial({ color: 0x8a5a2b })), g, 0, 0.39, 0);
      pole.castShadow = false;
      const fs = new THREE.Shape(); fs.moveTo(0, 0); fs.lineTo(0.12, -0.035); fs.lineTo(0, -0.07);
      const flag = addMesh(keep(new THREE.ShapeGeometry(fs)), keep(new THREE.MeshLambertMaterial({ color: design.flag, side: THREE.DoubleSide, emissive: 0x220000 })), g, 0.006, 0.5, 0);
      flag.userData.flag = true;
      const shellGeo = keep(new THREE.SphereGeometry(0.018, 8, 6));
      const shellMat = keep(new THREE.MeshLambertMaterial({ color: 0xffd6e4 }));
      for (let i = 0; i < 7; i++) {
        const a = (i / 7) * Math.PI * 2 + 0.3;
        const s = addMesh(shellGeo, shellMat, g, Math.cos(a) * 0.27, 0.035, Math.sin(a) * 0.27);
        s.scale.y = 0.5;
      }
      return g;
    },
  ];
  const extra = () => {
    const g = new THREE.Group();
    const a = Math.random() * Math.PI * 2;
    towerAt(g, Math.cos(a) * 0.3, Math.sin(a) * 0.3, 0.045, 0.08 + Math.random() * 0.05);
    return g;
  };

  const tmp = new THREE.Vector3();
  return {
    group, pick,
    get count() { return count; },
    // amount: 0..1（荷台の量）。新しい段を足して、その段の上端（ワールド）を返す
    addPiece(amount) {
      const b = count < builders.length ? builders[count] : count < builders.length + 6 ? extra : null;
      count++;
      moundTarget = Math.min(1.35, moundTarget + 0.25 + 0.35 * THREE.MathUtils.clamp(amount, 0, 1.2));
      if (!b) return group.localToWorld(tmp.set(0, 0.3, 0));
      const obj = b();
      obj.scale.setScalar(0.001);
      group.add(obj);
      pieces.push({ obj, t: 0 });
      return group.localToWorld(tmp.set(0, 0.15 + Math.min(count, 4) * 0.08, 0));
    },
    topWorld(out) { return group.localToWorld(out.set(0, 0.1 + Math.min(count, 4) * 0.09, 0)); },
    update(dt, time) {
      for (const pc of pieces) {
        if (pc.t < 1) {
          pc.t = Math.min(1, pc.t + dt / 0.55);
          const t = pc.t;
          const s = t < 1 ? 1 + Math.sin(t * Math.PI) * 0.22 - (1 - t) * (1 - t) * 0.9 : 1;
          pc.obj.scale.setScalar(Math.max(0.001, s));
        }
      }
      if (mound) {
        moundSize += (moundTarget - moundSize) * Math.min(1, dt * 3);
        const k = 0.75 + 0.25 * moundSize;
        mound.scale.set(k, 0.6 + 0.4 * moundSize, k);
      }
      group.traverse((o) => { if (o.userData.flag) o.rotation.y = Math.sin(time * 5) * 0.35; });
    },
    dispose() { group.traverse((o) => { if (o.isInstancedMesh) o.dispose(); }); for (const d of disposables) d.dispose(); scene.remove(group); },
  };
}
