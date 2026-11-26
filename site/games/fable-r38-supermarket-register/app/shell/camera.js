// 動くカメラ（主役中心の構図）。
// 構図＝「注目点 F」「主役の大きさ hero（m）」「必ず入れる左右の範囲 span（x, m）」「見下ろす角度 pitch」。
//   距離は主役の大きさから決める：主役が画面の短い辺の FILL（約62%）を占める距離。
//   ただし span が横に入りきらない時だけ、入るところまで下がる。
// 場面（作業・渡す・喜ぶ）が変わったら、各値を減衰付きのばね（臨界減衰）でゆっくり次の構図へ寄せる。
// 急なズーム・揺れはさせない（入力の位置ではなく、遊びの状態だけで構図を選ぶ → 指とカメラが追いかけっこしない）。
// 縦長：短い辺＝横。主役を画面の下寄り（指の届く所）に置き、上にお客さんが見える。
// 横長：短い辺＝縦。主役は真ん中より少し下。
// レイキャストは毎フレーム camera.matrixWorld を使うので、update() の後で flow.update() を呼べば指の判定はカメラについてくる。

const DEG = Math.PI / 180;
export const FILL = 0.62;          // 主役が短い辺に占める割合（55〜70% の真ん中）
const FOV_SHORT = 40;              // 短い辺の視野角（度）
const FOV_LONG_MAX = 72;           // 長い辺の視野角の上限（細長いスマホで歪みすぎないように）

// 構図（m・度）。座標は layout.js と同じ（原点＝天板の上面、−Z＝お客さん側）。
// lift＝主役を画面の下へずらす量（画面の高さに対する割合。[横長, 縦長]）。縦長は指の届く下寄りに置く。
// tiltP＝縦長の時だけ足す見下ろし角（縦に長い画面で、天板の奥行きを縦に広げて使う）。
export const SHOTS = Object.freeze({
  // かごから商品を取る：かご（主役＝中の商品）＋スキャナー。ベルトは右端に少し
  pick: { focus: [-0.45, 0.05, 0.07], hero: 0.50, span: [-0.86, -0.06], pitch: 47, yaw: 0, lift: [0.07, 0.19], tiltP: 6, tau: 0.55 },
  // 商品を持っている：スキャン窓と商品に寄る。かごは端に半分
  scan: { focus: [-0.36, 0.07, 0.05], hero: 0.42, span: [-0.70, -0.04], pitch: 50, yaw: 0, lift: [0.07, 0.19], tiltP: 6, tau: 0.6 },
  // かごが空になった → ベルトの先と袋、その奥のお客さんへゆっくり振る（渡す場面）
  give: { focus: [0.61, 0.10, -0.22], hero: 0.68, span: [0.10, 1.12], pitch: 33, yaw: -6, lift: [0.0, 0.10], tiltP: 3, tau: 0.9 },
  // 喜ぶ・お礼の花・次のお客さん：引いて、お客さんと花台を入れる
  happy: { focus: [-0.19, 0.22, -0.45], hero: 0.95, span: [-1.00, 0.62], pitch: 30, yaw: 0, lift: [0.0, 0.05], tiltP: 0, tau: 0.85 },
});

// 臨界減衰のばね（行き過ぎない・急に止まらない）
function spring(s, target, tau, dt) {
  const w = 2 / Math.max(0.05, tau);
  const a = w * w * (target - s.x) - 2 * w * s.v;
  s.v += a * dt;
  s.x += s.v * dt;
}

export function createCameraRig(THREE, camera) {
  const keys = ['fx', 'fy', 'fz', 'hero', 'sl', 'sr', 'pitch', 'yaw', 'liftL', 'liftP', 'tiltP'];
  const S = {};
  for (const k of keys) S[k] = { x: 0, v: 0 };
  let shotName = 'pick';
  let pending = null, pendingT = 0;
  let aspect = 4 / 3;
  let viewW = 1, viewH = 1;
  const F = new THREE.Vector3();
  const dir = new THREE.Vector3();
  const info = { shot: shotName, dist: 0, fovV: 0, heroFill: 0, portrait: false };

  function load(name) {
    const s = SHOTS[name];
    return { fx: s.focus[0], fy: s.focus[1], fz: s.focus[2], hero: s.hero, sl: s.span[0], sr: s.span[1], pitch: s.pitch, yaw: s.yaw, liftL: s.lift[0], liftP: s.lift[1], tiltP: s.tiltP };
  }

  function setShot(name, immediate) {
    if (!SHOTS[name]) return;
    shotName = name; info.shot = name;
    if (immediate) {
      const t = load(name);
      for (const k of keys) { S[k].x = t[k]; S[k].v = 0; }
    }
  }

  // 遊びの状態から構図を選ぶ。切り替えは少し待ってから（一瞬の状態でふらふらしない）
  function choose(phase, st) {
    if (phase === 'giving' || phase === 'happy') return 'happy';
    if (phase === 'swap') return st.basket > 0 ? 'pick' : 'happy';
    if (st.held === 'bag') return 'give';
    if (st.held === 'item') return 'scan';
    if (st.basket > 0) return 'pick';
    return 'give';   // かごが空：ベルトの先・袋・お客さん
  }
  const DELAY = { pick: 0.5, scan: 0.12, give: 0.35, happy: 0.15 };   // pick へ戻るのは遅め（続けて持つ時に寄ったり引いたりしない）

  function resize(w, h) {
    viewW = Math.max(1, w); viewH = Math.max(1, h);
    aspect = viewW / viewH;
    apply();
  }

  function apply() {
    const portrait = aspect < 1;
    const tShort = Math.tan(FOV_SHORT / 2 * DEG);
    // 縦の視野角：横長は短い辺（縦）＝FOV_SHORT。縦長は横＝FOV_SHORT から縦を出す（上限あり）
    let tV, tH;
    if (!portrait) { tV = tShort; tH = tV * aspect; }
    else {
      tH = tShort; tV = tH / aspect;
      const tMax = Math.tan(FOV_LONG_MAX / 2 * DEG);
      if (tV > tMax) { tV = tMax; tH = tV * aspect; }
    }
    camera.fov = 2 * Math.atan(tV) / DEG;
    camera.aspect = aspect;

    // 距離：主役が短い辺の FILL を占める／span が横に入る、の大きい方
    const tS = Math.min(tV, tH);
    const dHero = S.hero.x / FILL / (2 * tS);
    const fx = S.fx.x;
    const needHalf = Math.max(fx - S.sl.x, S.sr.x - fx, 0) * 1.04;
    const dSpan = needHalf / tH;
    const dist = Math.min(4, Math.max(0.45, dHero, dSpan));

    const p = (S.pitch.x + (portrait ? S.tiltP.x : 0)) * DEG, y = S.yaw.x * DEG;
    dir.set(Math.sin(y) * Math.cos(p), -Math.sin(p), -Math.cos(y) * Math.cos(p));
    F.set(fx, S.fy.x, S.fz.x);
    camera.position.copy(F).addScaledVector(dir, -dist);
    camera.up.set(0, 1, 0);
    camera.lookAt(F);

    // 主役を下寄りに（レンズを上へずらす＝傾けずに画面の中で下へ）。縦長は指の届く下 2/3 の所
    // 細長い縦画面（スマホ）ほど少し多く下げる
    const shift = portrait ? S.liftP.x + Math.max(0, 0.75 - aspect) * 0.2 : S.liftL.x;
    camera.setViewOffset(viewW, viewH, 0, -shift * viewH, viewW, viewH);
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld(true);

    info.dist = dist; info.fovV = camera.fov; info.portrait = portrait;
    info.heroFill = S.hero.x / (2 * dist * tS);
  }

  function update(dt, phase, st) {
    const want = choose(phase, st);
    if (want !== shotName) {
      if (pending !== want) { pending = want; pendingT = 0; }
      pendingT += dt;
      if (pendingT >= (DELAY[want] || 0.2)) { shotName = want; info.shot = want; pending = null; }
    } else pending = null;
    const t = load(shotName);
    const tau = SHOTS[shotName].tau;
    const step = Math.min(dt, 0.05);
    for (const k of keys) spring(S[k], t[k], tau, step);
    apply();
  }

  setShot('pick', true);
  return { update, resize, setShot, info, get shot() { return shotName; } };
}
