// Piped cream (hero). API: docs/HERO-SPEC.md. Build: `npm run build:hero` -> app/hero/hero.bundle.js
//
// How it works, in one paragraph: while the finger is down a nozzle path is integrated every frame
// (finger → leashed anchor → swirl around the anchor when it rests). Rings of a star cross-section are
// laid along that path; each ring rests on the height field of what is already there (older strokes,
// fruit, and this stroke's own cream further back), so piles, crossings and layers all come from the
// same rule. The newest stretch still hangs up to the nozzle and settles as the nozzle moves on; what
// it settles on is squashed. On release the hanging end is pulled into a horn that snaps and wobbles.
// params.js holds every number, field.js the height field, ropes.js the ring data → merged mesh (and the
// triangle budget), cue.js the "here next" twinkle. Notes and limits: docs/hero-notes.md.
import { P } from './params.js';
import { createField } from './field.js';
import { createRopes, X, Y, Z, R, SX, SY, S as ARC, Q, Q0, SID, TX, TY, TZ, BX, BY, BZ, LIFT, RV, SLOPE, TW, YB, FIX, STRIDE, RCAP } from './ropes.js';
import { createCue } from './cue.js';

const TAU = Math.PI * 2;
const num = (v, d) => (typeof v === 'number' && isFinite(v) ? v : d);
const clamp = (x, a, b) => (x < a ? a : x > b ? b : x);
const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const DEFAULT_COLORS = [{ hex: 0xfffaf2 }, { hex: 0xffb3c8 }, { hex: 0x8a5236 }, { hex: 0xffe27a }];

export function createHero(THREE, opts) {
  opts = opts || {};
  const RAD = num(opts.radius, 1.2), HMAX = num(opts.maxHeight, 1.4);
  const YCAP = HMAX - P.capRoom;                 // highest centre line of a laid tube
  const RC = RAD - P.edge - 0.02, RD = RAD - P.edge;
  const A = P.a;
  const budget = Math.max(4000, Math.min(50000, num(opts.tier && opts.tier.heroTriangles, 50000)) - 200);
  const colorList = (Array.isArray(opts.colors) && opts.colors.length ? opts.colors : DEFAULT_COLORS)
    .map((c) => { const k = new THREE.Color(num(c && c.hex, 0xffffff)); return [k.r * P.gain, k.g * P.gain, k.b * P.gain]; });
  const emit = (type, detail) => { if (opts.onEvent) { try { opts.onEvent(type, detail); } catch (e) { console.error(e); } } };

  const root = new THREE.Group();
  root.name = 'hero-root';
  const creamTex = (opts.textures && opts.textures.cream) || null;
  const material = new THREE.MeshStandardMaterial({
    color: 0xffffff, vertexColors: true, bumpMap: creamTex, bumpScale: P.bump, roughness: P.roughness, metalness: 0,
  });
  if (creamTex && opts.onTexturesReady) { try { opts.onTexturesReady(() => { material.needsUpdate = true; }); } catch (e) { /* optional */ } }

  const field = createField(RAD, HMAX);
  const ropes = createRopes(THREE, { maxTris: budget, colors: colorList, material, maxR: RAD + 0.08, maxY: HMAX + 0.05 });
  root.add(ropes.mesh);
  const cue = createCue(THREE, root, field, RAD);

  const state = { phase: 'idle', flow: 0, nozzle: new THREE.Vector3(0, 0.3, 0), strokes: 0, coverage: 0 };
  let stage = 0, sidCounter = 0, finished = false, lastCov = -1;
  const scratch = new Float32Array(RCAP * STRIDE);

  // ---------- rays ----------
  const inv = new THREE.Matrix4(), lray = new THREE.Ray();
  const hitP = new THREE.Vector3(), hitN = new THREE.Vector3(0, 1, 0), hitOut = { point: hitP, normal: hitN, onCream: false };
  function toLocal(ray) {
    if (!ray || !ray.origin || !ray.direction) return null;
    root.updateWorldMatrix(true, false);
    inv.copy(root.matrixWorld).invert();
    lray.copy(ray).applyMatrix4(inv);
    const o = lray.origin, d = lray.direction;
    const l = d.length();
    if (!(l > 1e-9) || !isFinite(o.x + o.y + o.z + l)) return null;
    d.multiplyScalar(1 / l);
    return lray;
  }

  function hitTest(rayWorld) {
    const r = toLocal(rayWorld);
    if (!r) return null;
    const o = r.origin, d = r.direction;
    const t = field.raycast(field.hm, field.max, o.x, o.y, o.z, d.x, d.y, d.z);
    if (!(t >= 0)) return null;
    const x = o.x + d.x * t, z = o.z + d.z * t, e = field.cell, hm = field.hm;
    const h = field.sample(hm, x, z);
    hitP.set(x, h > 0 ? h : 0, z);
    hitN.set(field.sample(hm, x - e, z) - field.sample(hm, x + e, z), 2 * e, field.sample(hm, x, z - e) - field.sample(hm, x, z + e)).normalize();
    hitOut.onCream = h > 0.02;
    return hitOut;
  }

  // ---------- the stroke being squeezed ----------
  const S = {
    active: false, phase: 'idle', sid: 0, ci: 0, t: 0,
    chunks: [], ch: null, nFixed: 0, kissEnd: 0, softFirst: 0, baked: false,
    cx: 0, cz: 0, fx: 0, fz: 0, pfx: 0, pfz: 0, planeY: 0,
    base: 0, kissS: 0, kissDone: false, kissDirty: false,
    ran: false, runT: 0, phi: 0, rho: 0, rho0: P.rho0, omK: 1, turns: 0, g: 1, vC: 0, shape: 1,
    dx: 0, dy: 0, dz: 0, yLp: 0, r: A, arc: 0, lx: 0, ly: 0, lz: 0, ldx: 0, ldy: 1, ldz: 0,
    wmK: 0, wmI: 0, sqK: 0, sqI: 0, emitted: 0,
    layered: false, capped: false, capT: 0, capMode: false, fat: 0, fatDirty: false,
    runArc0: 0, pend: false, tailT: 0, L: 0.1, flowRel: 1, wobT: 0, tdx: 0, tdz: 0, tw0: 0,
    tipx: 0, tipy: 0, tipz: 0,
  };

  function clampDisc(o, kx, kz, lim) {
    const x = o[kx], z = o[kz], d = Math.hypot(x, z);
    if (d > lim) { o[kx] = (x * lim) / d; o[kz] = (z * lim) / d; }
  }

  function startStroke(input) {
    const ci = clamp(num(input.colorIndex, 0) | 0, 0, colorList.length - 1);
    let px = state.nozzle.x, pz = state.nozzle.z, got = false;
    const r = toLocal(input.ray);
    if (r) {
      const o = r.origin, d = r.direction;
      let t = field.raycast(field.hm, field.max, o.x, o.y, o.z, d.x, d.y, d.z);
      if (!(t >= 0) && d.y < -1e-4) t = -o.y / d.y;
      if (t >= 0 && isFinite(t)) { px = o.x + d.x * t; pz = o.z + d.z * t; got = true; }
    }
    if (!got && !isFinite(px + pz)) { px = 0; pz = 0; }
    const hHit = field.sample(field.hm, px, pz);
    S.fx = px; S.fz = pz;
    clampDisc(S, 'fx', 'fz', RC);
    S.cx = S.fx; S.cz = S.fz; S.pfx = S.fx; S.pfz = S.fz;
    field.snapshot();

    // the blob sits on what is there (a little into it, if that is cream)
    const h0 = field.sample(field.hm, S.cx, S.cz), hA = field.around(field.hm, S.cx, S.cz, 0.11);
    let base = Math.max(h0, hA - 0.06);
    const onCream = base > 0.03;
    if (onCream) base -= P.sink;
    base = clamp(base, 0, YCAP - 0.1);

    S.active = true; S.phase = 'flow'; S.sid = ++sidCounter; S.ci = ci; S.t = 0;
    S.planeY = clamp(hHit, 0, HMAX);
    S.base = base; S.kissS = P.kiss.s0; S.kissDone = false; S.kissDirty = true;
    S.ran = false; S.runT = 0; S.phi = Math.random() * TAU; S.rho = 0;
    S.rho0 = P.rho0 * (0.94 + 0.12 * Math.random()); S.omK = 0.94 + 0.12 * Math.random();
    S.turns = 0; S.g = 1; S.vC = 0; S.shape = 1; S.r = A * 0.85; S.arc = 0;
    S.wmK = 0; S.wmI = 0; S.sqK = 0; S.sqI = P.kiss.y.length; S.emitted = 0;
    S.layered = false; S.capped = false; S.capT = 0; S.capMode = false; S.fat = 0; S.fatDirty = false;
    S.pend = false; S.tailT = 0; S.wobT = 0; S.baked = false;
    S.tw0 = Math.random() * TAU;
    const la = Math.random() * TAU;
    S.tdx = Math.cos(la) * 0.12; S.tdz = Math.sin(la) * 0.12; // a lone blob's horn leans a little, any way

    ropes.makeRoom(P.reserve);
    const ch = ropes.newChunk(ci, S.sid);
    S.chunks.length = 0; S.chunks.push(ch); S.ch = ch;
    const d = ch.d, k = P.kiss, nk = k.y.length, ba = Math.random() * TAU;
    for (let j = 0; j < nk; j++) {
      const o = j * STRIDE;
      d[o + X] = S.cx; d[o + Z] = S.cz; d[o + SX] = 1; d[o + SY] = 1; d[o + RV] = 1;
      d[o + ARC] = k.y[j] - k.y[0]; d[o + TW] = S.tw0 + d[o + ARC] * 2.4; d[o + YB] = base + k.y[0];
      d[o + TY] = 1; d[o + BX] = Math.cos(ba); d[o + BZ] = Math.sin(ba);
    }
    S.nFixed = nk; S.kissEnd = nk; S.softFirst = nk;
    S.arc = k.y[nk - 1] - k.y[0];
    kissPose();
    S.dx = S.cx; S.dz = S.cz; S.dy = d[(nk - 1) * STRIDE + Y];
    S.lx = S.dx; S.ly = S.dy; S.lz = S.dz; S.ldx = 0; S.ldy = 1; S.ldz = 0; S.yLp = S.dy;

    if (onCream) ropes.squash(S.cx, S.cz, base, A * P.squash.radius * 1.15, S.sid, 1);
    finished = false;
    state.phase = 'flow';
    const pt = { x: S.cx, y: base, z: S.cz };
    emit('stroke-start', { point: pt, colorIndex: ci, onCream });
    if (onCream) { S.layered = true; emit('layer', { point: { x: pt.x, y: pt.y, z: pt.z } }); }
    if (stage < 1) { stage = 1; emit('stage', { level: 1, point: { x: pt.x, y: pt.y, z: pt.z } }); }
  }

  // the first blob grows out of the nozzle: size s(t) by ease-out-back
  function kissPose() {
    const c0 = S.chunks[0];
    if (!c0 || c0.dead || c0.rev > 0) { S.kissDone = true; return; }
    const k = P.kiss, u = Math.min(1, S.t / k.tGrow), v = u - 1;
    const e = 1 + (k.over + 1) * v * v * v + k.over * v * v;
    const s = k.s0 + (1 - k.s0) * e, sr = 0.5 + 0.5 * s, d = c0.d;
    S.kissS = s;
    for (let j = 0; j < k.y.length; j++) {
      const o = j * STRIDE;
      d[o + Y] = S.base + (j ? k.y[j] * s : k.y[0]);
      d[o + R] = A * k.r * k.w[j] * sr;
    }
    const nk = k.y.length;
    if (S.ran && c0.n > nk) d[nk * STRIDE + Y] = d[(nk - 1) * STRIDE + Y] + 0.025; // the cap stays on top while the blob still grows
    if (u >= 1) S.kissDone = true;
    S.kissDirty = true;
    if (c0 !== S.ch) { ropes.frames(c0, 0, nk, c0.n); ropes.writeRings(c0, 0, nk); S.kissDirty = false; }
  }

  // The nozzle starts to travel: the blob is closed with a little cap and the tube starts inside it with a
  // rounded end (two pin-point rings: top of the blob, start of the tube), so nothing folds where they meet.
  function beginRun(far) {
    const ch = S.ch, d = ch.d, top = (S.nFixed - 1) * STRIDE, ry = S.r * P.sy;
    let o = S.nFixed * STRIDE;
    const y0 = clamp(S.base + (1 - P.embed) * ry, 0, YCAP);
    for (let j = 0; j < 2; j++, o += STRIDE) {
      d.copyWithin(o, top, top + STRIDE);
      d[o + Y] = j ? y0 : d[top + Y] + 0.025; d[o + R] = 0.004; d[o + RV] = 1; d[o + LIFT] = 0;
      S.arc += j ? Math.abs(d[o + Y] - d[o - STRIDE + Y]) : 0.025;
      d[o + ARC] = S.arc; d[o + YB] = d[top + YB];
      if (!j) { d[o + TX] = 0; d[o + TY] = 1; d[o + TZ] = 0; d[o + SLOPE] = -3; d[o + FIX] = 1; } // the cap looks up
    }
    S.nFixed += 2; S.kissEnd = S.nFixed; S.softFirst = S.nFixed; S.sqI = Math.max(S.sqI, S.nFixed);
    S.runArc0 = S.arc;
    S.lx = S.cx; S.ly = y0; S.lz = S.cz; S.ldx = 0; S.ldy = 0; S.ldz = 0;
    S.dx = S.cx; S.dy = y0; S.dz = S.cz; S.yLp = y0;
    S.ran = true; S.runT = 0; S.vC = far ? 1 : 0;
    S.kissDirty = true;
  }

  function readFinger(input, dt) {
    const r = toLocal(input.ray);
    if (!r) return;
    const o = r.origin, d = r.direction;
    if (!(d.y < -1e-4)) return;
    // the plane the finger slides on follows the cream that was there before this stroke
    const t = field.raycast(field.hm0, field.max0, o.x, o.y, o.z, d.x, d.y, d.z);
    if (t >= 0) {
      const yT = clamp(o.y + d.y * t, 0, HMAX);
      S.planeY += (yT - S.planeY) * (1 - Math.exp(-dt * P.planeRate));
    }
    const tp = (S.planeY - o.y) / d.y;
    if (!(tp > 0)) return;
    const x = o.x + d.x * tp, z = o.z + d.z * tp;
    if (!isFinite(x + z)) return;
    S.fx = x; S.fz = z;
    clampDisc(S, 'fx', 'fz', RAD + 0.4);
  }

  function split() {
    const old = S.ch, b = S.softFirst - 1;
    if (b < 8 || b >= S.nFixed) return false;
    const cnt = S.nFixed - b;
    scratch.set(old.d.subarray(b * STRIDE, (S.nFixed + 4) * STRIDE));
    ropes.setCount(old, b + 1);
    ropes.close(old);
    const ch = ropes.newChunk(S.ci, S.sid, true);
    ch.d.set(scratch.subarray(0, (cnt + 4) * STRIDE));
    for (let i = 0; i < cnt; i++) { const o = i * STRIDE; ropes.grow(ch, ch.d[o + X], ch.d[o + Y], ch.d[o + Z], ch.d[o + R] * 1.25); }
    S.chunks.push(ch); S.ch = ch;
    const last = S.chunks.length - 2;
    if (S.wmK === last && S.wmI > b) { S.wmK++; S.wmI -= b; }
    if (S.sqK === last && S.sqI > b) { S.sqK++; S.sqI -= b; }
    S.nFixed = cnt; S.softFirst = 1; S.kissEnd = Math.max(0, S.kissEnd - b);
    ropes.setCount(ch, cnt + 4);
    ropes.frames(ch, 0, cnt + 3, cnt + 4);
    ropes.writeRings(ch, 0, cnt + 3);
    return true;
  }

  function emitRing(x, y, z, r) {
    if (S.emitted >= P.maxRingsPerFrame) return false;
    if (S.nFixed >= RCAP - 6 && !split()) return false;
    if (!ropes.makeRoom(60)) return false;
    const ch = S.ch, d = ch.d, o = S.nFixed * STRIDE;
    S.arc += Math.hypot(x - S.lx, y - S.ly, z - S.lz);
    const cap = clamp((S.arc - S.runArc0) / P.capLen, 0, 1);
    if (cap < 1) r *= 0.3 + 0.7 * Math.sqrt(cap * (2 - cap));   // rounded start of the tube
    d[o + X] = x; d[o + Y] = y; d[o + Z] = z; d[o + R] = r; d[o + SX] = P.sx; d[o + SY] = P.sy;
    d[o + ARC] = S.arc; d[o + Q] = 0; d[o + Q0] = 0; d[o + SID] = 0; d[o + LIFT] = 0; d[o + RV] = 1;
    d[o + TW] = S.tw0 + S.arc * P.twist; d[o + YB] = y - r * P.sy; d[o + FIX] = 0;
    S.lx = x; S.ly = y; S.lz = z;
    S.nFixed++; S.emitted++;
    ropes.grow(ch, x, y, z, r * 1.25);
    return true;
  }

  // one small time step of the nozzle path. e = how far the release has gone (0 while squeezing)
  function advance(h, fx, fz, e) {
    // finger → anchor on a short leash
    let moved = 0;
    if (S.phase === 'flow' && !S.pend) {
      const ddx = fx - S.cx, ddz = fz - S.cz, dd = Math.hypot(ddx, ddz);
      if (dd > P.leash) {
        const k = (dd - P.leash) / dd, ox = S.cx, oz = S.cz;
        S.cx += ddx * k; S.cz += ddz * k;
        clampDisc(S, 'cx', 'cz', RC);
        moved = Math.hypot(S.cx - ox, S.cz - oz);
      }
    }
    // speed of the anchor: picks up at once, forgets slowly (a gap between two finger events is not a stop)
    const vNow = moved / h;
    S.vC += (vNow - S.vC) * (1 - Math.exp(-h / (vNow > S.vC ? P.tauVUp : P.tauVDown)));
    const g = 1 - smooth(P.vStill, P.vDrag, S.vC);
    S.g = g;
    if (moved > 0) S.turns *= Math.exp(-moved / 0.2);

    // swirl around the anchor: ρ shrinks with the height of this stroke's own pile, ω keeps the cream per second
    let rhoT = S.rho0 * S.shape * g;
    if (e > 0) rhoT *= (1 - e) * (1 - e);
    else if (S.capMode) rhoT = Math.max(rhoT, 0.035);
    S.rho += (rhoT - S.rho) * (1 - Math.exp(-h / P.tauRho));
    const om = clamp((P.omega * P.rho0) / Math.max(S.rho, 0.03), P.omega, P.omegaMax) * S.omK;
    S.phi += om * h;
    S.turns += (om * h * g) / TAU;
    let qx = S.cx + S.rho * Math.cos(S.phi), qz = S.cz + S.rho * Math.sin(S.phi);
    const qd = Math.hypot(qx, qz);
    if (qd > RD) { qx *= RD / qd; qz *= RD / qd; }
    const step = Math.hypot(qx - S.dx, qz - S.dz);

    // tube radius: same cream per second, so fast = thin; a swirl thins toward its top; the tail tapers
    const vr = clamp(Math.sqrt(P.vRef / Math.max(S.vC, 0.05)), P.rMin, P.rMax);
    const sw = 1 - P.topThin * (1 - S.shape);
    let rT = A * (vr + (sw - vr) * g);
    if (e > 0) rT *= 1 - 0.45 * e;
    S.r += (rT - S.r) * (1 - Math.exp(-(h / P.tauR + step / P.lenR)));

    // Resting height: on what was there before the stroke, or on this stroke's own cream if that is higher.
    // A swirl keeps level: its ground is the lowest ground around its first turn (+ a little drape), so next
    // to a rope or another swirl it leans into it instead of climbing it. During the first turn of a swirl
    // own cream is ignored and during the second it fades in, so the coil becomes a smooth helix instead of
    // climbing a step where the turn closes.
    const rx = S.r * P.sx * 0.9, ry = S.r * P.sy;
    const r0 = field.rest(field.hm0, qx, qz, rx, ry);
    let base = r0;
    if (g > 0) {
      const level = field.lowAround(field.hm0, S.cx, S.cz, S.rho0) + ry + P.drape;
      if (level < r0) base = r0 + (level - r0) * g;
    }
    const m = 1 - g * (1 - smooth(P.turnBlend[0], P.turnBlend[1], S.turns));
    const own = Math.max(0, field.restOwn(qx, qz, rx, ry) - base) * m;
    const lying = base + own - ry > 0.03;
    let yT = base + own - P.embed * ry - (lying ? P.sink : 0);
    const room = Math.max(0.05, YCAP - (base - P.embed * ry));
    S.shape = Math.pow(clamp(1 - own / room, 0, 1), P.rhoPow);
    S.capped = yT >= YCAP - 0.004;
    if (yT > YCAP) yT = YCAP;
    if (yT < 0) yT = 0;
    S.yLp += (yT - S.yLp) * (1 - Math.exp(-(step + h * 0.3) / (P.lowpass + (P.lowpassSwirl - P.lowpass) * g)));
    S.dx = qx; S.dz = qz; S.dy = S.yLp;

    if (!S.layered && e === 0 && r0 - ry > 0.035) { S.layered = true; emit('layer', { point: { x: qx, y: S.dy, z: qz } }); }

    // lay rings: every dsMax of travel, or every 15° of turning
    const ex = S.dx - S.lx, ey = S.dy - S.ly, ez = S.dz - S.lz, dist = Math.sqrt(ex * ex + ey * ey + ez * ez);
    if (dist >= P.dsMin && !S.capMode) {
      const cosT = (ex * S.ldx + ey * S.ldy + ez * S.ldz) / dist;
      if (dist >= P.dsMax || cosT < P.turnCos) {
        let n = Math.ceil(dist / (P.dsMax * 1.4));
        const left = P.maxRingsPerFrame - S.emitted;
        if (n > left) n = left;
        const sx0 = S.lx, sy0 = S.ly, sz0 = S.lz;
        let ok = n > 0;
        for (let k = 1; k <= n && ok; k++) { const f = k / n; ok = emitRing(sx0 + ex * f, sy0 + ey * f, sz0 + ez * f, S.r); }
        if (ok) { S.ldx = ex / dist; S.ldy = ey / dist; S.ldz = ez / dist; }
      }
    }
  }

  // Rings that have settled press on what is under them and (later) become ground for this same stroke.
  function advanceMarks(final) {
    const arcHead = S.arc + Math.hypot(S.dx - S.lx, S.dy - S.ly, S.dz - S.lz);
    const lagArc = final ? -1 : Math.max(P.lag + 0.01, P.stampLag + (clamp(0.45 * TAU * S.rho, P.lag + 0.01, P.stampLag) - P.stampLag) * S.g);
    const rad = A * P.squash.radius, last = S.chunks.length - 1;
    // squash
    for (;;) {
      const c = S.chunks[S.sqK];
      const lim = S.sqK === last ? (final ? S.nFixed : S.softFirst) : c.n;
      if (c.dead) S.sqI = lim;
      while (S.sqI < lim) {
        const o = S.sqI * STRIDE, d = c.d, ty = d[o + TY];
        const bottom = d[o + Y] - d[o + R] * d[o + SY] * (1 - ty * ty);
        if (bottom > 0.02 && d[o + R] > 0.03) ropes.squash(d[o + X], d[o + Z], bottom, rad, S.sid, 1);
        S.sqI++;
      }
      if (S.sqK < last) { S.sqK++; S.sqI = 1; } else break;
    }
    // stamp into the height field
    for (;;) {
      const c = S.chunks[S.wmK];
      const lim = S.wmK === last ? (final ? S.nFixed + 4 : S.softFirst) : c.n;
      if (c.dead) S.wmI = lim;
      let stop = false;
      while (S.wmI < lim) {
        const o = S.wmI * STRIDE, d = c.d;
        if (!final && arcHead - d[o + ARC] <= lagArc) { stop = true; break; }
        stampRing(d, o);
        S.wmI++;
      }
      c.elig = c.dead ? 0 : Math.min(S.wmI, c.n);
      if (stop) break;
      if (S.wmK < last) { c.busy = false; S.wmK++; S.wmI = 1; } else break;
    }
  }

  function stampRing(d, o) {
    const ty = d[o + TY], r = d[o + R] * d[o + RV];
    field.stamp(d[o + X], d[o + Z], d[o + Y] + d[o + LIFT], r * d[o + SX] * 0.9, r * d[o + SY] * (1 - ty * ty) + 0.005, true, S.sid);
  }

  // at the height limit the pile grows sideways instead
  function fatten(df) {
    const lim = RD + 0.03;
    for (let k = 0; k < S.chunks.length; k++) {
      const c = S.chunks[k];
      if (c.dead) continue;
      const d = c.d, n = c === S.ch ? S.nFixed : c.n;
      let any = false;
      for (let i = 0; i < n; i++) {
        const o = i * STRIDE, ddx = d[o + X] - S.cx, ddz = d[o + Z] - S.cz;
        if (ddx * ddx + ddz * ddz > 0.49) continue;
        let x = S.cx + ddx * (1 + df), z = S.cz + ddz * (1 + df);
        const q = Math.hypot(x, z);
        if (q > lim) { x *= lim / q; z *= lim / q; }
        d[o + X] = x; d[o + Z] = z; d[o + R] *= 1 + P.fatR * df;
        ropes.grow(c, x, d[o + Y], z, d[o + R] * 1.25);
        any = true;
      }
      if (any && c !== S.ch) ropes.writeRings(c, 0, n - 1);
    }
    S.lx = S.cx + (S.lx - S.cx) * (1 + df); S.lz = S.cz + (S.lz - S.cz) * (1 + df);
    S.fatDirty = true;
  }

  // The hanging end and the tip. e: 0 while squeezing → 1 when the horn has snapped off. wob: spring of the horn.
  function updateHead(e, wobY, wobS) {
    const ch = S.ch, d = ch.d, n = S.nFixed;
    const arcHead = S.arc + Math.hypot(S.dx - S.lx, S.dy - S.ly, S.dz - S.lz);
    const ry = S.r * P.sy;
    const lift0 = S.ran ? (ry * 0.9 + P.nozzleGap) * smooth(0, 0.12, S.runT) : 0.012;
    const roomUp = Math.max(0, HMAX + 0.03 - (S.dy + lift0));
    const tl = Math.min(P.tipLift * S.L, roomUp * 0.4) * e;
    const liftTop = lift0 + tl;
    const rn = Math.min(1, (P.rNozzle * A) / Math.max(S.r, 1e-3));
    const prev = S.softFirst;
    let first = n;
    if (!S.baked) {
      for (let i = n - 1; i >= S.kissEnd && n - i <= 14; i--) {
        const o = i * STRIDE;
        let u = 1 - (arcHead - d[o + ARC]) / P.lag;
        const ui = 1 - (n - 1 - i) / 14;
        if (ui < u) u = ui;
        if (!(u > 0)) break;
        const w = u * u * (3 - 2 * u);
        d[o + LIFT] = liftTop * w; d[o + RV] = 1 + (rn - 1) * w * Math.sqrt(w);
        first = i;
      }
      for (let i = Math.max(prev, S.kissEnd); i < first; i++) { const o = i * STRIDE; d[o + LIFT] = 0; d[o + RV] = 1; }
      S.softFirst = first;
    }
    // tip: four rings from the hanging end to the nozzle; when released they stretch into a horn
    const hy = S.dy + liftTop;
    const len = 0.045 + e * Math.min(S.L, Math.max(0.05, roomUp - tl)) + wobY;
    let lx, lz;
    if (e < 1 || !S.baked) {
      const hl = Math.hypot(S.ldx, S.ldz);
      if (S.ran && hl > 0.2) { S.tdx = (S.ldx / hl) * P.lean; S.tdz = (S.ldz / hl) * P.lean; }
    }
    lx = S.tdx * e; lz = S.tdz * e;
    const il = 1 / Math.sqrt(lx * lx + 1 + lz * lz);
    const headR = Math.min(S.r, P.rNozzle * A) * (S.ran ? 1 : 0.6 + 0.4 * S.kissS);
    const sl = Math.hypot(S.tdx, S.tdz) || 1, swx = (S.tdx / sl) * wobS, swz = (S.tdz / sl) * wobS;
    for (let j = 0; j < 4; j++) {
      const o = (n + j) * STRIDE, t = j / 3, tt = t * Math.sqrt(t);
      d[o + X] = S.dx + lx * il * len * t + swx * tt;
      d[o + Y] = hy + il * len * t;
      d[o + Z] = S.dz + lz * il * len * t + swz * tt;
      d[o + R] = headR * (1 + (P.tipProfile[j] - 1) * e);
      d[o + RV] = 1; d[o + LIFT] = 0; d[o + SX] = 1; d[o + SY] = 1; d[o + Q] = 0; d[o + Q0] = 0; d[o + SID] = 0;
      d[o + ARC] = arcHead + 0.02 + len * t; d[o + TW] = S.tw0 + d[o + ARC] * P.twist;
      d[o + YB] = S.dy - ry; d[o + FIX] = 0;
    }
    const nTot = n + 4;
    ropes.setCount(ch, nTot);
    let from = Math.min(prev, first, n);
    if (S.kissDirty && ch === S.chunks[0]) { from = 0; S.kissDirty = false; }
    if (S.fatDirty) { from = 0; S.fatDirty = false; }
    from = Math.max(0, from - 1);
    ropes.frames(ch, from, nTot - 1, nTot);
    ropes.writeRings(ch, from, nTot - 1);
    const o = (nTot - 1) * STRIDE;
    S.tipx = d[o + X]; S.tipy = d[o + Y]; S.tipz = d[o + Z];
    state.nozzle.set(S.tipx, S.tipy + 0.015 + 0.3 * e * e, S.tipz);
  }

  function beginTail() {
    S.phase = 'tail'; S.tailT = 0; S.pend = false;
    const amount = clamp(S.t / P.amountT, 0.05, 1);
    S.L = P.tipLen[0] + (P.tipLen[1] - P.tipLen[0]) * amount;
    S.flowRel = state.flow;
    state.phase = 'tail';
    state.strokes++;
    emit('stroke-end', { point: { x: S.tipx, y: S.tipy, z: S.tipz }, amount });
  }

  // the horn has snapped off: everything becomes ground, the spring starts
  function tipDone() {
    const d = S.ch.d;
    for (let i = S.softFirst; i < S.nFixed; i++) {
      const o = i * STRIDE;
      d[o + Y] += d[o + LIFT]; d[o + LIFT] = 0; d[o + R] *= d[o + RV]; d[o + RV] = 1;
    }
    S.baked = true; S.softFirst = S.nFixed;
    if (S.fat > 0) restampAll();
    advanceMarks(true);
    S.phase = 'settle'; S.wobT = 0;
    state.phase = 'idle'; state.flow = 0;
    emit('tip', { point: { x: S.tipx, y: S.tipy, z: S.tipz } });
    stages(S.tipx, S.tipy, S.tipz);
  }

  function restampAll() {
    for (const c of S.chunks) {
      if (c.dead) continue;
      const n = c === S.ch ? S.nFixed : c.n;
      for (let i = 0; i < n; i++) stampRing(c.d, i * STRIDE);
    }
  }

  function finalize() {
    updateHead(1, 0, 0);
    ropes.close(S.ch);
    for (const c of S.chunks) { c.busy = false; c.elig = c.dead ? 0 : c.n; }
    S.chunks.length = 0; S.ch = null;
    S.active = false; S.phase = 'idle';
  }

  function finishNow() {
    if (!S.active) return;
    if (S.phase === 'flow') beginTail();
    if (S.phase === 'tail') { S.tailT = P.tTail; updateHead(1, P.wob.A, 0); tipDone(); }
    if (S.phase === 'settle') finalize();
  }

  function stages(x, y, z) {
    if (field.covN === lastCov) return;
    lastCov = field.covN;
    state.coverage = field.coverage();
    const lv = state.coverage >= 0.5 ? 3 : state.coverage >= 0.2 ? 2 : stage >= 1 ? 1 : 0;
    while (stage < lv) { stage++; emit('stage', { level: stage, point: { x, y, z } }); }
  }

  function stepStroke(dt, input) {
    S.t += dt; S.emitted = 0;
    if (S.phase === 'settle') {
      S.wobT += dt;
      const w = P.wob, t = S.wobT;
      if (t >= w.tSettle) { finalize(); return; }
      updateHead(1, w.A * Math.exp(-t / w.tau) * Math.cos(w.omega * t), w.sway * Math.exp(-t / 0.15) * Math.sin(28 * t));
      return;
    }
    if (S.phase === 'flow') {
      if (input.down && !S.pend) readFinger(input, dt); else S.pend = true;
      if (S.pend && S.t >= P.tMin) beginTail();
    }
    let e = 0;
    if (S.phase === 'tail') {
      S.tailT += dt;
      const u = clamp(S.tailT / P.tTail, 0, 1);
      e = 1 - (1 - u) * (1 - u);
    }
    if (!S.kissDone) kissPose();
    if (!S.ran) {
      const far = Math.hypot(S.fx - S.cx, S.fz - S.cz) > P.leash;
      if (S.phase === 'flow' && !S.pend && (S.t >= P.tRun || far)) beginRun(far);
      if (!S.ran) S.dy = S.chunks[0].d[(P.kiss.y.length - 1) * STRIDE + Y];
    }
    if (S.ran) {
      S.runT += dt;
      const n = clamp(Math.ceil(dt / 0.008), 1, 7), h = dt / n;
      if (h > 0) {
        for (let k = 1; k <= n; k++) {
          const f = k / n;
          advance(h, S.pfx + (S.fx - S.pfx) * f, S.pfz + (S.fz - S.pfz) * f, e);
        }
      }
      S.pfx = S.fx; S.pfz = S.fz;
      // top-out: nowhere to go but sideways
      if (S.phase === 'flow' && S.capped && S.rho < 0.06) S.capT += dt; else S.capT = Math.max(0, S.capT - dt * 2);
      S.capMode = S.phase === 'flow' && S.capT > 0.25;
      if (S.capMode && S.fat < P.fatMax && dt > 0) { const df = Math.min(P.fatRate * dt, P.fatMax - S.fat); S.fat += df; fatten(df); }
    }
    updateHead(e, e > 0 ? P.wob.A * e * e : 0, 0);
    if (S.ran) advanceMarks(false);
    if (S.nFixed >= P.chunkRings && S.softFirst > 12) split();

    if (S.phase === 'tail') {
      state.flow = S.flowRel * (1 - e);
      if (S.tailT >= P.tTail) tipDone();
    } else {
      let f = 1 - Math.exp(-S.t / P.tauIn);
      if (S.capMode && S.fat >= P.fatMax) f *= 0.86 + 0.14 * Math.sin(S.t * 9);
      state.flow = f;
    }
    stages(S.dx, S.dy, S.dz);
  }

  // Is ring i of chunk c out of sight? Either walled in (no ray toward the camera side leaves from its top or
  // its flanks) or replaced (a later stroke lies in the same place at the same height).
  function ringHidden(c, i) {
    const d = c.d, o = i * STRIDE, x = d[o + X], y = d[o + Y], z = d[o + Z], r = d[o + R], ty = d[o + TY];
    const top = y + r * d[o + SY] * (1 - ty * ty);
    let bx = -d[o + TZ], bz = d[o + TX];
    const bl = Math.hypot(bx, bz);
    if (bl > 0.3) { bx /= bl; bz /= bl; } else { bx = 1; bz = 0; }
    const w = r * 0.6;
    if (field.owner(x, z) > c.sid && field.owner(x + bx * w, z + bz * w) > c.sid && field.owner(x - bx * w, z - bz * w) > c.sid
      && Math.abs(field.sample(field.hm, x, z) - top) < 0.05) return true;
    return field.hidden(x, top - 0.01, z, P.seeSlope) && field.hidden(x + bx * r, y, z + bz * r, P.seeSlope) && field.hidden(x - bx * r, y, z - bz * r, P.seeSlope);
  }

  // ---------- API ----------
  function update(dt, input) {
    dt = clamp(num(dt, 0), 0, 0.05);
    input = input || {};
    if (input.started) { finishNow(); startStroke(input); }
    if (S.active) stepStroke(dt, input);
    else if (state.flow > 0) state.flow = Math.max(0, state.flow - dt * 10);
    ropes.animate(dt);
    ropes.maintain(ringHidden);
    ropes.flush();
    cue.update(dt, !S.active && !input.down && !finished && state.strokes > 0);
  }

  function reset() {
    S.active = false; S.phase = 'idle'; S.chunks.length = 0; S.ch = null;
    ropes.clear();
    field.clear();
    stage = 0; lastCov = -1; finished = false;
    state.phase = 'idle'; state.flow = 0; state.strokes = 0; state.coverage = 0;
    state.nozzle.set(0, 0.3, 0);
    cue.update(0, false);
  }

  // for ?debug=1 and tuning in the console; not part of the shell contract
  const dbg = opts.debug ? { P, field, ropes, S, material, state, root, renderer: opts.renderer } : undefined;
  if (dbg && typeof window !== 'undefined') window.__heroDebug = dbg;

  const stats = { triangles: 0, drawCalls: 0, textures: 0, textureBytes: 0, geometryBytes: 0 };
  function getStats() {
    const tri = ropes.triangles;
    stats.triangles = tri + (cue.visible ? 2 : 0);
    stats.drawCalls = (tri > 0 ? 1 : 0) + (cue.visible ? 1 : 0);
    stats.textures = (creamTex ? 1 : 0) + 1;
    const img = creamTex && creamTex.image, w = (img && img.width) || 1024, h = (img && img.height) || 1024;
    stats.textureBytes = (creamTex ? Math.round((w * h * 4 * 4) / 3) : 0) + cue.bytes;
    stats.geometryBytes = ropes.bytes + 4 * (12 + 8 + 12) + 12;
    return stats;
  }

  const api = {
    root,
    update,
    hitTest,
    heightAt: (x, z) => field.heightAt(x, z),
    stampObstacle(x, z, r, top) {
      // thin things (candles) stand in the cream; cream does not climb them
      if (isFinite(x + z + r + top) && r >= 0.07 && top > 0) field.stampFlat(x, z, r, top);
    },
    endStroke() { finishNow(); finished = true; ropes.flush(); cue.update(0, false); },
    reset,
    getState: () => state,
    getStats,
    onContextLost() {},
    onContextRestored() { ropes.fullUpload(); },
    dispose() {
      root.removeFromParent();
      cue.dispose();
      ropes.dispose();
      material.dispose();
    },
    debug: dbg,
  };
  if (dbg) dbg.api = api;
  return api;
}
