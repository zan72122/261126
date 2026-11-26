// 入力：Pointer Events（指・マウス共通）。指1本だけ使う。
// 押した瞬間に一番手前の物を判定し、指の持ち主（'hero' | 'truck' | 'friend'）を決める。
import * as THREE from '../vendor/three/three.module.js';

const TAP_PX = 12, TAP_SEC = 0.35;

export function createInput(canvas, camera, getPickables) {
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const st = {
    id: null, owner: null, down: false, pressed: false, released: false, tap: false, onHandle: false,
    x: 0, y: 0, sx: 0, sy: 0, t0: 0, moved: 0, lastInput: 0,
  };
  const ray = new THREE.Ray();
  const events = []; // shell 向けの tap など
  let enabled = true;

  function toNdc(e) {
    const r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
  }
  function updateRay() {
    raycaster.setFromCamera(ndc, camera);
    ray.copy(raycaster.ray);
  }
  function pick() {
    updateRay();
    const list = getPickables();
    const hits = raycaster.intersectObjects(list.map((p) => p.obj), true);
    if (!hits.length) return { owner: 'hero', onHandle: false, behind: null };
    const ownerOf = (obj) => {
      for (const p of list) { let o = obj; while (o) { if (o === p.obj) return p.owner; o = o.parent; } }
      return null;
    };
    const first = ownerOf(hits[0].object) || 'hero';
    // バケットの後ろにある物（例：荷台の上で止まっているバケットの奥のトラック）も覚えておく
    let behind = null;
    for (let i = 1; i < hits.length && !behind; i++) { const o = ownerOf(hits[i].object); if (o && o !== first) behind = o; }
    return { owner: first, onHandle: first === 'hero', behind };
  }

  function onDown(e) {
    if (!enabled) return;
    e.preventDefault();
    st.lastInput = performance.now() / 1000;
    if (st.id !== null) return; // 2本目以降は無視
    st.id = e.pointerId;
    try { canvas.setPointerCapture(e.pointerId); } catch (_) { /* noop */ }
    st.x = st.sx = e.clientX; st.y = st.sy = e.clientY; st.moved = 0; st.t0 = performance.now() / 1000;
    toNdc(e);
    const p = pick();
    st.owner = p.owner; st.onHandle = p.onHandle; st.behind = p.behind;
    st.down = true; st.pressed = true;
    events.push({ type: 'down', owner: st.owner });
  }
  function onMove(e) {
    if (e.pointerId !== st.id) return;
    e.preventDefault();
    st.lastInput = performance.now() / 1000;
    st.x = e.clientX; st.y = e.clientY;
    st.moved = Math.max(st.moved, Math.hypot(st.x - st.sx, st.y - st.sy));
    toNdc(e);
    // トラック・友だち・お城の上に置いた指を動かしたら、ショベル（hero）が受け取る：引けば必ず何かが動く
    if (st.down && st.owner !== 'hero' && st.moved >= TAP_PX) { st.owner = 'hero'; st.onHandle = false; st.pressed = true; st.behind = null; }
  }
  function onUp(e) {
    if (e.pointerId !== st.id) return;
    e.preventDefault();
    st.lastInput = performance.now() / 1000;
    toNdc(e);
    const dt = performance.now() / 1000 - st.t0;
    st.tap = st.moved < TAP_PX && dt < TAP_SEC;
    st.down = false; st.released = true;
    events.push({ type: 'up', owner: st.owner, tap: st.tap, behind: st.behind });
    try { canvas.releasePointerCapture(e.pointerId); } catch (_) { /* noop */ }
    st.id = null;
  }
  canvas.addEventListener('pointerdown', onDown, { passive: false });
  canvas.addEventListener('pointermove', onMove, { passive: false });
  canvas.addEventListener('pointerup', onUp, { passive: false });
  canvas.addEventListener('pointercancel', onUp, { passive: false });
  canvas.addEventListener('contextmenu', (e) => e.preventDefault());
  // iOS のピンチ・ダブルタップ拡大を止める
  for (const t of ['gesturestart', 'gesturechange', 'gestureend']) document.addEventListener(t, (e) => e.preventDefault(), { passive: false });
  document.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
  document.addEventListener('dblclick', (e) => e.preventDefault());

  // hero に渡す形（HERO-SPEC 4.1）
  const heroPointer = { down: false, pressed: false, released: false, tap: false, onHandle: false, ray: new THREE.Ray(), ndc: new THREE.Vector2() };

  return {
    state: st,
    events,
    ray,
    ndc,
    setEnabled(v) { enabled = v; },
    // 毎フレーム最初に呼ぶ
    frame() {
      updateRay();
      const mine = st.owner === 'hero';
      heroPointer.down = mine && st.down;
      heroPointer.pressed = mine && st.pressed;
      heroPointer.released = mine && st.released;
      heroPointer.tap = mine && st.released && st.tap;
      heroPointer.onHandle = mine && st.onHandle;
      heroPointer.ray.copy(ray);
      heroPointer.ndc.copy(ndc);
      return heroPointer;
    },
    // 毎フレーム最後に呼ぶ
    endFrame() {
      st.pressed = false;
      if (st.released) { st.released = false; st.tap = false; st.owner = st.down ? st.owner : null; }
      events.length = 0;
    },
    idleSeconds() { return performance.now() / 1000 - st.lastInput; },
    poke() { st.lastInput = performance.now() / 1000; },
  };
}
