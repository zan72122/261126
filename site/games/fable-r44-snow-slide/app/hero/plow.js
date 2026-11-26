// The snow plow: a chunky toy truck built from parameters, the way it drives toward the finger,
// and what its blade does to the snow (cut, carry, spill at the ends, lay down, push up a hill).
import { FIELD, GRID, PLOW } from './params.js';
import { clamp, damp, smoothstep, wrapAngle, finite } from './util.js';

const { N, V, CELL } = GRID;
const CELL2 = CELL * CELL;
const HW = PLOW.BLADE_W / 2;
const LS = 18, LT = 8;                  // lump grid: segments across / forward

// Shape of the snow carried in front of the blade, from its volume v (m3):
// half width wl, height hc at the blade, length lc. Its volume is exactly (8/9) * hc * lc * wl = v.
function lumpDims(v, out) {
  const wl = 0.45 + 0.65 * Math.sqrt(Math.min(1, v / 0.35));
  const hc = Math.sqrt((Math.max(v, 0) * 9) / (8 * PLOW.LUMP_SLOPE * wl));
  out.wl = wl; out.hc = hc; out.lc = hc * PLOW.LUMP_SLOPE;
  return out;
}
// Height of the lump above the ground at blade coordinates (u across, w forward from the blade face).
function lumpHeight(u, w, d) {
  const s = u / d.wl, p = 1 - s * s;
  if (!(p > 0) || w < 0) return 0;
  const sp = Math.sqrt(p), t = w / (d.lc * sp);
  return t >= 1 ? 0 : d.hc * sp * (1 - t * t);
}

export function createPlow(THREE, { geom, terrain, textures, shadows, emit, spray }) {
  const { H, B } = terrain;
  const owned = [];
  const own = (x) => (owned.push(x), x);

  // ------------------------------------------------------------ materials
  const paintMat = own(new THREE.MeshStandardMaterial({ map: textures.plowPaint || null, vertexColors: true, roughness: 0.5, metalness: 0.05, emissive: 0xff8a1e, emissiveIntensity: 0 }));
  const trimMat = own(new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.5, metalness: 0.05, emissive: 0xffc070, emissiveIntensity: 0 }));
  const beaconMat = own(new THREE.MeshStandardMaterial({ color: 0xffb81f, emissive: 0xff9a00, emissiveIntensity: 0.8, roughness: 0.3 }));
  const lumpMat = own(new THREE.MeshStandardMaterial({ map: textures.snowFresh || null, roughness: 0.95, metalness: 0 }));
  lumpMat.color.setRGB(1.16, 1.16, 1.16);
  const pickMat = own(new THREE.MeshBasicMaterial({ visible: false }));

  // ------------------------------------------------------------ model (+z forward, wheels stand on y = 0)
  const group = new THREE.Group(); group.name = 'hero.plow';
  const body = new THREE.Group(); group.add(body);
  const topY = PLOW.BODY_Y + PLOW.HGT;
  const [cabW, cabH, cabL] = PLOW.CAB;
  const cabZ = -PLOW.LEN / 2 + cabL / 2 + 0.05, cabY = topY + cabH / 2 - 0.03;
  const DARK = 0x2b2e35, GREY = 0x8d939e, GLASS = 0xbfe6ff, WHITE = 0xf6faff, LAMP = 0xfff3c0;

  const paintParts = [
    geom.roundedBox(PLOW.WID, PLOW.HGT, PLOW.LEN, PLOW.ROUND, 4).translate(0, PLOW.BODY_Y + PLOW.HGT / 2, 0),
    geom.roundedBox(cabW, cabH, cabL, 0.14, 4).translate(0, cabY, cabZ),
  ];
  for (const sx of [-1, 1]) for (const sz of [-1, 1])   // mud guards over the wheels
    paintParts.push(geom.roundedBox(PLOW.WHEEL_W + 0.1, 0.07, PLOW.WHEEL_R * 2 + 0.16, 0.03, 2).translate(sx * (PLOW.WHEEL_X - 0.02), PLOW.WHEEL_R * 2 + 0.07, sz * PLOW.WHEEL_Z));
  const bodyPaint = new THREE.Mesh(own(geom.merge(paintParts)), paintMat);
  bodyPaint.name = 'hero.plow.paint';

  const tp = [];
  const tbox = (w, h, d, r, hex, x, y, z) => tp.push(geom.paint(geom.roundedBox(w, h, d, r, 2).translate(x, y, z), hex));
  tbox(cabW * 0.8, cabH * 0.5, 0.05, 0.02, GLASS, 0, cabY + 0.07, cabZ + cabL / 2);            // windscreen
  tbox(cabW * 0.7, cabH * 0.42, 0.05, 0.02, GLASS, 0, cabY + 0.09, cabZ - cabL / 2);           // rear window
  for (const sx of [-1, 1]) tbox(0.05, cabH * 0.46, cabL * 0.62, 0.02, GLASS, sx * cabW / 2, cabY + 0.08, cabZ);
  tbox(cabW + 0.08, 0.09, cabL + 0.08, 0.04, WHITE, 0, cabY + cabH / 2 + 0.01, cabZ);            // roof with snow on it
  tbox(PLOW.WID * 0.62, 0.2, 0.05, 0.02, DARK, 0, PLOW.BODY_Y + 0.2, PLOW.LEN / 2);              // grille
  tbox(PLOW.WID + 0.06, 0.11, 0.12, 0.04, DARK, 0, PLOW.BODY_Y + 0.03, PLOW.LEN / 2 + 0.01);     // bumper
  for (const sx of [-1, 1]) {
    tp.push(geom.paint(new THREE.SphereGeometry(0.105, 14, 10).scale(1, 1, 0.45).translate(sx * 0.36, PLOW.BODY_Y + 0.4, PLOW.LEN / 2 - 0.005), LAMP));   // head lamps
    tp.push(geom.paint(new THREE.TorusGeometry(0.11, 0.022, 6, 16).translate(sx * 0.36, PLOW.BODY_Y + 0.4, PLOW.LEN / 2), GREY));
    tbox(0.1, 0.1, PLOW.BLADE_Z - PLOW.LEN / 2 + 0.1, 0.02, DARK, sx * 0.34, 0.3, (PLOW.BLADE_Z + PLOW.LEN / 2) / 2 - 0.05);                             // blade arms
  }
  tp.push(geom.paint(new THREE.CylinderGeometry(0.045, 0.045, 0.42, 10).translate(0.4, topY + 0.2, 0.42), DARK));    // exhaust
  tp.push(geom.paint(new THREE.CylinderGeometry(0.06, 0.05, 0.06, 10).translate(0.4, topY + 0.43, 0.42), GREY));
  tp.push(geom.paint(new THREE.CylinderGeometry(0.085, 0.1, 0.05, 12).translate(0, cabY + cabH / 2 + 0.07, cabZ), DARK));  // beacon foot
  const bodyTrim = new THREE.Mesh(own(geom.merge(tp)), trimMat);
  bodyTrim.name = 'hero.plow.trim';

  const beacon = new THREE.Mesh(own(new THREE.SphereGeometry(PLOW.BEACON_R, 12, 8).scale(1, 1.25, 1)), beaconMat);
  beacon.position.set(0, cabY + cabH / 2 + 0.07 + PLOW.BEACON_R, cabZ);
  beacon.name = 'hero.plow.beacon';

  // blade: curved sheet, dark cutting edge, end plates and ribs (one mesh; the dark parts use vertex colour)
  const bladeParts = [
    geom.blade(PLOW.BLADE_W, PLOW.BLADE_H, PLOW.BLADE_R, 0.05, 8),
    geom.paint(geom.roundedBox(PLOW.BLADE_W + 0.02, 0.07, 0.08, 0.02, 1).translate(0, 0.035, -0.01), 0x33353c),
  ];
  for (const sx of [-1, 1]) {
    bladeParts.push(geom.roundedBox(0.05, PLOW.BLADE_H * 0.92, 0.2, 0.02, 1).translate(sx * HW, PLOW.BLADE_H * 0.47, 0.03));
    bladeParts.push(geom.paint(geom.roundedBox(0.07, PLOW.BLADE_H * 0.7, 0.1, 0.02, 1).translate(sx * 0.34, PLOW.BLADE_H * 0.45, -0.11), 0x33353c));
  }
  const bladeMesh = new THREE.Mesh(own(geom.merge(bladeParts)), paintMat);
  bladeMesh.name = 'hero.plow.blade';
  const bladeGroup = new THREE.Group();
  bladeGroup.position.set(0, 0, PLOW.BLADE_Z);
  bladeGroup.rotation.y = PLOW.BLADE_YAW;
  bladeGroup.add(bladeMesh);

  const wheels = new THREE.InstancedMesh(own(geom.wheel(PLOW.WHEEL_R, PLOW.WHEEL_W, PLOW.LUGS)), trimMat, 4);
  wheels.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  wheels.frustumCulled = false;
  wheels.name = 'hero.plow.wheels';
  const WHEEL_POS = [[-1, 1], [1, 1], [-1, -1], [1, -1]].map(([sx, sz]) => new THREE.Vector3(sx * PLOW.WHEEL_X, PLOW.WHEEL_R, sz * PLOW.WHEEL_Z));

  body.add(bodyPaint, bodyTrim, beacon, bladeGroup, wheels);
  for (const m of [bodyPaint, bodyTrim, bladeMesh, wheels]) m.castShadow = !!shadows;

  const pick = new THREE.Mesh(own(new THREE.BoxGeometry(2.6, 1.7, 3.0)), pickMat);
  pick.position.set(0, 0.75, 0.2);
  group.add(pick);

  // snow carried in front of the blade: a small grid reshaped every frame (world coordinates)
  const lumpCols = LS + 1, lumpRows = LT + 2;
  const lumpPos = new Float32Array(lumpCols * lumpRows * 3), lumpNor = new Float32Array(lumpCols * lumpRows * 3), lumpUv = new Float32Array(lumpCols * lumpRows * 2);
  const lumpGeo = own(new THREE.BufferGeometry());
  {
    const idx = [];
    for (let b = 0; b < lumpRows - 1; b++) for (let a = 0; a < LS; a++) {
      const i0 = b * lumpCols + a, i1 = i0 + 1, i2 = i0 + lumpCols + 1, i3 = i0 + lumpCols;
      idx.push(i0, i2, i1, i0, i3, i2);
    }
    lumpGeo.setIndex(idx);
    lumpGeo.setAttribute('position', new THREE.BufferAttribute(lumpPos, 3).setUsage(THREE.DynamicDrawUsage));
    lumpGeo.setAttribute('normal', new THREE.BufferAttribute(lumpNor, 3).setUsage(THREE.DynamicDrawUsage));
    lumpGeo.setAttribute('uv', new THREE.BufferAttribute(lumpUv, 2).setUsage(THREE.DynamicDrawUsage));
    lumpGeo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 1, 0), 9.5);
  }
  const lump = new THREE.Mesh(lumpGeo, lumpMat);
  lump.name = 'hero.plowSnow';
  lump.frustumCulled = false;
  lump.visible = false;
  lump.castShadow = !!shadows;
  lump.receiveShadow = !!shadows;

  // ------------------------------------------------------------ state
  const pl = {
    x: 1.5, z: 3.2, h: Math.PI, y: 0, sP: 0, sR: 0, bY: 0, bR: 0, speed: 0,
    vol: 0, driving: false, moving: false,
    stillT: 0, pressT: 0, settling: 0, settleV0: 0, k: 1, remain: 0, want: 0,
    spillT: 0, spillAcc: 0,
    wheelRot: 0, travel: 0, kick: 0, crumbT: 0, squash: 0,
    hint: 0, moved: 0, detour: 0, done: false, doneX: 0, doneZ: 0,
  };
  const pv = { bx: 0, bz: 0, fx: 0, fz: -1, rx: -1, rz: 0 };   // blade line of the previous frame
  const dims = { wl: 1, hc: 0, lc: 0 };
  let fx = 0, fz = -1, rx = -1, rz = 0;     // forward and local +x in the world (x, z)
  let time = 0;
  function axes() { fx = Math.sin(pl.h); fz = Math.cos(pl.h); rx = fz; rz = -fx; }

  // ground under a wheel: wheels sink through loose snow and ride on the firm snow below
  function wheelGround(lx, lz) {
    const x = pl.x + rx * lx + fx * lz, z = pl.z + rz * lx + fz * lz;
    return Math.max(terrain.firmAt(x, z), terrain.heightAt(x, z) - PLOW.SINK_MAX);
  }
  const gnd = { y: 0, sP: 0, sR: 0 };
  function sampleGround() {
    const tw = PLOW.TRACK / 2, wb = PLOW.WHEELBASE / 2;
    const fl = wheelGround(tw, wb), fr = wheelGround(-tw, wb), bl = wheelGround(tw, -wb), br = wheelGround(-tw, -wb);
    gnd.y = (fl + fr + bl + br) / 4;
    gnd.sP = clamp((fl + fr - bl - br) / (2 * PLOW.WHEELBASE), -0.9, 0.9);
    gnd.sR = clamp((fl + bl - fr - br) / (2 * PLOW.TRACK), -0.7, 0.7);
  }
  // How steep the firm snow is 1.5 m away in direction a (loose heaps do not count: the blade pushes them).
  // Three probes across the plow: their mean, or with a full blade (mix = 1) the highest of them, so that
  // a loaded plow is stopped even by a narrow firm heap.
  function gradeToward(a, mix = 0) {
    const hx = Math.sin(a), hz = Math.cos(a);
    let sum = 0, top = -1e9;
    for (let n = -1; n <= 1; n++) {
      const x = pl.x + hz * n * 0.6 + hx * 1.5, z = pl.z - hx * n * 0.6 + hz * 1.5;
      const d = Math.max(terrain.firmAt(x, z), terrain.heightAt(x, z) - PLOW.SINK_MAX) - pl.y;
      sum += d; if (d > top) top = d;
    }
    return (sum / 3 + (top - sum / 3) * mix) / 1.5;
  }
  // slope the plow would have to climb in direction a: where it stands now, or 1.5 m on, whichever is steeper
  function climb(a) {
    return Math.max(pl.sP * Math.cos(a - pl.h) + pl.sR * Math.sin(a - pl.h), gradeToward(a));
  }
  // The finger is far behind a steep hill: steer around the hill instead of pressing against it.
  function wayAround(ang) {
    if (climb(ang) < PLOW.GRADE_FREE + 0.08) { pl.detour = 0; return ang; }
    const first = pl.detour || (climb(ang + 0.9) <= climb(ang - 0.9) ? 1 : -1);
    for (const m of [0.6, 1.1, 1.6, 2.2]) for (const sgn of [first, -first]) {
      if (climb(ang + sgn * m) < PLOW.GRADE_FREE) { pl.detour = sgn; return ang + sgn * m; }
    }
    return ang;
  }

  // The firm snow just ahead of the blade (not yet cut): mean height and slope across the blade.
  const ref = { y: 0, s: 0 };
  function firmRef() {
    const bx = pl.x + fx * (PLOW.BLADE_Z + 0.15), bz = pl.z + fz * (PLOW.BLADE_Z + 0.15);
    let a = 0, m = 0;
    for (let n = -2; n <= 2; n++) {
      const u = n * 0.45, x = bx + rx * u, z = bz + rz * u;
      const f = Math.min(terrain.firmAt(x, z), terrain.heightAt(x, z));
      a += f; m += u * f;
    }
    ref.y = a / 5; ref.s = clamp(m / 2.025, -0.7, 0.7);
  }

  function reset(round) {
    const pk = terrain.peak;
    pl.x = round % 2 ? -1.5 : 1.5; pl.z = 3.2;
    pl.h = wrapAngle(Math.atan2(pk.x - pl.x, pk.z - pl.z) + (pl.x > pk.x ? 0.45 : -0.45));   // looks toward the hill, a little side-on
    pl.speed = 0; pl.vol = 0; pl.driving = false; pl.moving = false;
    pl.stillT = 0; pl.pressT = 0; pl.settling = 0; pl.k = 1; pl.remain = 0; pl.want = 0;
    pl.spillT = 0; pl.spillAcc = 0; pl.kick = 0; pl.squash = 0; pl.moved = 0; pl.travel = 0; pl.detour = 0; pl.done = false;
    axes();
    sampleGround();
    pl.y = gnd.y; pl.sP = gnd.sP; pl.sR = gnd.sR;
    firmRef(); pl.bY = ref.y; pl.bR = ref.s;
    pv.bx = pl.x + fx * PLOW.BLADE_Z; pv.bz = pl.z + fz * PLOW.BLADE_Z; pv.fx = fx; pv.fz = fz; pv.rx = rx; pv.rz = rz;
    lump.visible = false;
    pose();
  }

  // ------------------------------------------------------------ blade against the snow
  // The blade edge rides on the firm snow (pl.bY, pl.bR: its line, smoothed over half a metre of driving),
  // as far as its lift on the body allows. Cells under it are cut down to that line: loose snow completely,
  // firm snow only a bite per pass. Hollows below the line are filled from the carried snow, and the strip
  // is left firm. Updates pl.vol, pl.remain, pl.moved.
  function bladeWork() {
    const bx = pl.x + fx * PLOW.BLADE_Z, bz = pl.z + fz * PLOW.BLADE_Z;
    // box around the blade line before and after this frame's move
    const pad = CELL, hx = Math.max(Math.abs(rx), Math.abs(pv.rx)) * HW + pad, hz = Math.max(Math.abs(rz), Math.abs(pv.rz)) * HW + pad;
    const i0 = Math.max(1, Math.floor(terrain.toI(Math.min(bx, pv.bx) - hx))), i1 = Math.min(N - 1, Math.ceil(terrain.toI(Math.max(bx, pv.bx) + hx)));
    const j0 = Math.max(1, Math.floor(terrain.toI(Math.min(bz, pv.bz) - hz))), j1 = Math.min(N - 1, Math.ceil(terrain.toI(Math.max(bz, pv.bz) + hz)));
    pl.remain = 0;
    if (i1 < i0 || j1 < j0) return;
    const plane = pl.y + pl.sP * PLOW.BLADE_Z, floor = FIELD.groundY + 0.02;
    let cut = 0, fill = 0, avail = pl.vol / CELL2, remain = 0;
    for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) {
      const cx = terrain.toX(i), cz = terrain.toX(j);
      const dx = cx - bx, dz = cz - bz;
      const u = dx * rx + dz * rz;
      // a cell is worked exactly once: in the frame the blade line passes over it (driving or swinging round)
      if (u < -HW || u > HW || dx * fx + dz * fz > 0 || (cx - pv.bx) * pv.fx + (cz - pv.bz) * pv.fz <= 0) continue;
      const k = j * V + i, h0 = H[k];
      const body = plane + pl.sR * u;
      const target = Math.max(floor, clamp(pl.bY + pl.bR * u, body - PLOW.LIFT[0], body + PLOW.LIFT[1]));
      let h = h0;
      if (h0 > target) {
        const firm = Math.max(target, Math.min(B[k], h0));          // loose snow above this goes completely
        h = Math.max(target, firm - PLOW.BITE_FIRM);                // firm snow: only a bite per pass
        cut += h0 - h;
        if (h - target > remain) remain = h - target;
      } else if (h0 < target - 0.012 && avail > 0) {
        const f = Math.min(target - 0.012 - h0, avail);
        h = h0 + f; fill += f; avail -= f;
      }
      H[k] = h;
      B[k] = h;                                                     // the blade leaves a firm surface
    }
    pl.remain = remain;
    cut *= CELL2; fill *= CELL2;
    if (cut > 0 || fill > 0) { terrain.markDirty(i0, j0, i1, j1); terrain.disturb(i0, j0, i1, j1); }
    else terrain.markDirty(i0, j0, i1, j1);
    pl.moved += cut;

    // the fuller the blade, the more of the new snow runs off its ends
    const full = pl.vol / PLOW.LOAD_MAX;
    const take = cut * (1 - full * full * full);
    let spill = cut - take;
    pl.vol += take - fill;
    if (pl.vol > PLOW.LOAD_MAX) { spill += pl.vol - PLOW.LOAD_MAX; pl.vol = PLOW.LOAD_MAX; }
    if (pl.vol < 0) pl.vol = 0;
    if (spill > 1e-6) {
      const share = 0.5 - clamp(pl.bR * 0.8, -0.3, 0.3);   // more runs off the downhill end
      const off = HW + 0.14;
      terrain.deposit(bx + rx * off, bz + rz * off, spill * share, 0.16, 0);
      terrain.deposit(bx - rx * off, bz - rz * off, spill * (1 - share), 0.16, 0);
      pl.spillAcc += spill;
      if (pl.spillT <= 0 && pl.spillAcc > 0.012) {
        const side = Math.random() < share ? 1 : -1;
        const sx = bx + rx * off * side, sz = bz + rz * off * side;
        emit('spill', { x: sx, y: terrain.heightAt(sx, sz), z: sz });
        spray.burst(sx, terrain.heightAt(sx, sz) + 0.25, sz, 3, 0.9, rx * side * 1.2, rz * side * 1.2);
        spray.burst(bx - rx * off * side, terrain.heightAt(bx - rx * off * side, bz - rz * off * side) + 0.25, bz - rz * off * side, 2, 0.9, -rx * side * 1.2, -rz * side * 1.2);
        pl.spillT = PLOW.SPILL_EVERY; pl.spillAcc = 0;
      }
    }
  }

  // rear wheels leave firmer tread marks
  function wheelMarks(dist) {
    for (const sx of [-1, 1]) {
      const x = pl.x + rx * sx * PLOW.WHEEL_X - fx * PLOW.WHEEL_Z, z = pl.z + rz * sx * PLOW.WHEEL_X - fz * PLOW.WHEEL_Z;
      terrain.packDisc(x, z, 0.16, dist * 2.5);
    }
  }

  // Lay the carried snow down where it is: the ground rises in exactly the shape of the lump.
  let wBx = 0, wBz = 0;
  const lumpWeight = (x, z) => {
    const dx = x - wBx, dz = z - wBz;
    return lumpHeight(dx * rx + dz * rz, dx * fx + dz * fz, dims);
  };
  function layDown(vol) {
    lumpDims(pl.settleV0, dims);                 // the shape is frozen while it is laid down
    wBx = pl.x + fx * PLOW.BLADE_Z; wBz = pl.z + fz * PLOW.BLADE_Z;
    const cx = wBx + fx * dims.lc * 0.5, cz = wBz + fz * dims.lc * 0.5;
    const ex = Math.abs(rx) * dims.wl + Math.abs(fx) * dims.lc * 0.5 + CELL, ez = Math.abs(rz) * dims.wl + Math.abs(fz) * dims.lc * 0.5 + CELL;
    const done = terrain.addShape(Math.floor(terrain.toI(cx - ex)), Math.floor(terrain.toI(cz - ez)), Math.ceil(terrain.toI(cx + ex)), Math.ceil(terrain.toI(cz + ez)), lumpWeight, vol, PLOW.DROP_PACK);
    // at the very edge of the field there may be no cell under the lump: put it just inside
    if (!done) terrain.deposit(clamp(cx, -5.6, 5.6), clamp(cz, -5.6, 5.6), vol, 0.3, PLOW.DROP_PACK);
    pl.vol = Math.max(0, pl.vol - vol);
  }

  // Pressed against a hill: the carried snow is shoved up the slope and heaps up near the top.
  const _g = { x: 0, z: 0 };
  function pushUp(tx, tz) {
    const v = pl.vol;
    const reach = PLOW.PUSH_REACH[0] + PLOW.PUSH_REACH[1] * Math.sqrt(v);
    let px = pl.x + fx * (PLOW.BLADE_Z + 0.25), pz = pl.z + fz * (PLOW.BLADE_Z + 0.25);
    let ph = terrain.heightAt(px, pz);
    const lim = FIELD.half - 0.7;
    for (let s = 0; s < reach; s += 0.15) {
      terrain.gradAt(px, pz, 0.25, _g);
      const gl = Math.hypot(_g.x, _g.z);
      let dx = fx * 0.5, dz = fz * 0.5;
      if (gl > 1e-3) { dx += (_g.x / gl) * 0.5; dz += (_g.z / gl) * 0.5; }
      const dl = Math.hypot(dx, dz) || 1;
      const nx = clamp(px + (dx / dl) * 0.15, -lim, lim), nz = clamp(pz + (dz / dl) * 0.15, -lim, lim);
      const nh = terrain.heightAt(nx, nz);
      if (nh < ph - 0.004 && s > 0.3) break;    // over the crest
      terrain.packDisc(px, pz, 0.6, 0.35);      // the pushed snow presses a smooth chute on its way up
      terrain.smoothDisc(px, pz, 0.7, 0.7);
      spray.burst(px, ph + 0.2, pz, 1, 1.4, fx * 0.8, fz * 0.8);
      px = nx; pz = nz; ph = nh;
    }
    const sigma = PLOW.PUSH_SIGMA[0] + PLOW.PUSH_SIGMA[1] * Math.sqrt(v);
    terrain.pour(px, pz, v, sigma, PLOW.PUSH_PACK, PLOW.PUSH_TIME);
    pl.vol = 0; pl.kick = 1; pl.squash = 1; pl.pressT = 0;
    pl.done = true; pl.doneX = tx; pl.doneZ = tz;      // delivered: wait here until the finger goes somewhere else
    emit('pileUp', { x: px, y: ph, z: pz, amount: v });
    spray.burst(px, ph + 0.35, pz, 6 + Math.round(v * 8), 2.2, 0, 0);
  }

  // ------------------------------------------------------------ per frame
  function update(dt, input) {
    time += dt;
    const tgt = input && input.plowTarget;
    const ok = !!tgt && Number.isFinite(tgt.x + tgt.z);
    pl.driving = ok;
    let want = 0;
    const hBefore = pl.h;
    if (pl.done && !(ok && Math.hypot(tgt.x - pl.doneX, tgt.z - pl.doneZ) < 0.6)) pl.done = false;
    if (pl.done) pl.driving = false;
    if (ok && !pl.done) {
      const dx = tgt.x - pl.x, dz = tgt.z - pl.z, d = Math.hypot(dx, dz);
      if (d > 0.2) {
        const da = wrapAngle((d > PLOW.DETOUR_MIN ? wayAround(Math.atan2(dx, dz)) : Math.atan2(dx, dz)) - pl.h);
        pl.h = wrapAngle(pl.h + clamp(da, -PLOW.TURN * dt, PLOW.TURN * dt));
        // Drive until the snow in front of the blade is under the finger (not until the truck is): what is
        // pushed ends up where the finger points. A finger close to the truck only turns it.
        const left = dx * Math.sin(pl.h) + dz * Math.cos(pl.h) - (PLOW.BLADE_Z + PLOW.REACH);
        if (d > PLOW.NEAR && left > 0) { const c = Math.max(0, Math.cos(da)); want = Math.min(PLOW.VMAX, left * 2.6) * c * c; }
        if (want < 0.05 && pl.speed < 0.05 && Math.abs(da) < 0.2) pl.driving = false;   // arrived
      }
    }
    axes();
    pl.want = want;
    const turned = wrapAngle(pl.h - hBefore);

    // steep firm snow, or a wall of it at the blade, slows the plow down to a stall; with a full blade it
    // stalls on gentler slopes (so a load pushed at any firm heap is shoved up onto it, see below)
    const load = pl.vol / PLOW.LOAD_MAX, s = Math.max(pl.sP, gradeToward(pl.h, load));
    const k = Math.min(1 - smoothstep(PLOW.GRADE_FREE - PLOW.GRADE_LOAD[0] * load, PLOW.GRADE_STALL - PLOW.GRADE_LOAD[1] * load, s), 1 - smoothstep(0.18, 0.45, pl.remain));
    pl.k = k;
    pl.speed += (want * k - pl.speed) * damp(dt, PLOW.ACC_TC);
    if (pl.speed < 0.02 && want * k < 0.02) pl.speed = 0;

    // move, stay inside the field (the blade too)
    const x0 = pl.x, z0 = pl.z;
    const lim = FIELD.half - PLOW.EDGE, bl = FIELD.half - PLOW.BLADE_EDGE;
    let nx = clamp(pl.x + fx * pl.speed * dt, -lim, lim), nz = clamp(pl.z + fz * pl.speed * dt, -lim, lim);
    const bxp = nx + fx * PLOW.BLADE_Z, bzp = nz + fz * PLOW.BLADE_Z;
    if (bxp > bl) nx -= bxp - bl; else if (bxp < -bl) nx += -bl - bxp;
    if (bzp > bl) nz -= bzp - bl; else if (bzp < -bl) nz += -bl - bzp;
    pl.x = finite(nx, x0); pl.z = finite(nz, z0);
    const dist = Math.max(0, (pl.x - x0) * fx + (pl.z - z0) * fz);
    const edgeStop = pl.speed * dt > 1e-4 && dist < pl.speed * dt * 0.5;
    if (edgeStop) pl.speed = dist / dt;
    pl.travel += dist;
    pl.wheelRot += (dist + (want > 0.3 ? want * (1 - k) * dt * 0.6 : 0)) / PLOW.WHEEL_R;   // wheels spin a bit when stalled

    const moving = pl.moving ? pl.speed > 0.04 : pl.speed > 0.1;
    if (moving && !pl.moving) { emit('plowStart', {}); pl.squash = Math.max(pl.squash, 0.6); }
    if (!moving && pl.moving) emit('plowStop', {});
    pl.moving = moving;

    pl.spillT -= dt;
    if (dist > 1e-5 || Math.abs(turned) > 1e-4) { bladeWork(); wheelMarks(dist); } else pl.remain *= 0.9;
    pv.bx = pl.x + fx * PLOW.BLADE_Z; pv.bz = pl.z + fz * PLOW.BLADE_Z; pv.fx = fx; pv.fz = fz; pv.rx = rx; pv.rz = rz;

    // where the wheels stand now
    sampleGround();
    const a = damp(dt, 0.09);
    pl.y += (gnd.y - pl.y) * a; pl.sP += (gnd.sP - pl.sP) * a; pl.sR += (gnd.sR - pl.sR) * a;
    // The blade line follows the firm snow ahead of it, smoothed over half a metre of driving (or a turn).
    // It reads snow the blade has not touched yet, so the cut cannot feed back into itself (no washboard).
    firmRef();
    const kb = 1 - Math.exp(-(dist / PLOW.BLADE_FOLLOW + Math.abs(turned) / 0.5));
    pl.bY += (ref.y - pl.bY) * kb; pl.bR += (ref.s - pl.bR) * kb;
    if (!Number.isFinite(pl.y + pl.sP + pl.sR + pl.bY + pl.bR)) { pl.y = 0; pl.sP = pl.sR = pl.bY = pl.bR = 0; }

    // what happens to the carried snow
    const pressing = ok && want > 0.4 && (k < 0.5 || edgeStop);
    pl.pressT = pressing ? pl.pressT + dt : 0;
    pl.stillT = pl.speed < 0.12 ? pl.stillT + dt : 0;
    if (pl.settling > 0 && pl.speed > 0.3) pl.settling = 0;
    if (pl.vol > 1e-4 && pl.settling <= 0) {
      // a real load goes up at once; crumbs shaved off while pressing are collected a little longer
      if (!edgeStop && ((pl.pressT > PLOW.PUSH_AFTER && pl.vol > 0.15) || (pl.pressT > 0.9 && pl.vol > 0.05))) pushUp(tgt.x, tgt.z);
      else if (pl.stillT > PLOW.SETTLE_AFTER) {
        pl.settling = pl.settleV0 = pl.vol;
        if (pl.vol > 0.04) {
          lumpDims(pl.vol, dims);
          const cx = pl.x + fx * (PLOW.BLADE_Z + dims.lc * 0.4), cz = pl.z + fz * (PLOW.BLADE_Z + dims.lc * 0.4);
          const cy = terrain.heightAt(cx, cz);
          emit('pileUp', { x: cx, y: cy, z: cz, amount: pl.vol });
          spray.burst(cx, cy + dims.hc * 0.6, cz, 4 + Math.round(pl.vol * 5), 1.4, 0, 0);
          pl.kick = Math.max(pl.kick, 0.6);
        }
      }
    }
    if (pl.settling > 0) {
      layDown(Math.min(pl.vol, (pl.settling / PLOW.SETTLE_TIME) * dt + 1e-4));
      if (pl.vol <= 1e-4) { pl.vol = 0; pl.settling = 0; }
    }

    // crumbs tumbling off the front of the lump while pushing, snow thrown by spinning wheels
    pl.crumbT -= dt * (pl.speed + 0.2) * (0.3 + pl.vol);
    if (pl.vol > 0.08 && pl.speed > 0.3 && pl.crumbT <= 0) {
      pl.crumbT = 0.09;
      lumpDims(pl.vol, dims);
      const u = (Math.random() * 2 - 1) * dims.wl * 0.9, w = dims.lc * (0.5 + Math.random() * 0.4);
      const x = pl.x + fx * (PLOW.BLADE_Z + w) + rx * u, z = pl.z + fz * (PLOW.BLADE_Z + w) + rz * u;
      spray.burst(x, terrain.heightAt(x, z) + lumpHeight(u, w, dims) + 0.1, z, 1, 0.7, fx * pl.speed, fz * pl.speed);
    }
    if (want > 0.4 && k < 0.3 && Math.random() < dt * 14) {
      const sx = Math.random() < 0.5 ? -1 : 1;
      const x = pl.x + rx * sx * PLOW.WHEEL_X - fx * (PLOW.WHEEL_Z + 0.3), z = pl.z + rz * sx * PLOW.WHEEL_X - fz * (PLOW.WHEEL_Z + 0.3);
      spray.burst(x, pl.y + 0.15, z, 1, 0.8, -fx * 1.5, -fz * 1.5);
    }
    pl.kick = Math.max(0, pl.kick - dt * 3.2);
    pl.squash = Math.max(0, pl.squash - dt * 3.5);
  }

  // ------------------------------------------------------------ visuals
  const vF = new THREE.Vector3(), vR = new THREE.Vector3(), vU = new THREE.Vector3(), m4 = new THREE.Matrix4();
  const wq = new THREE.Quaternion(), wAxis = new THREE.Vector3(1, 0, 0), wScale = new THREE.Vector3(1, 1, 1);
  function pose() {
    vF.set(fx, pl.sP, fz).normalize();
    vR.set(rx, pl.sR, rz).normalize();
    vU.crossVectors(vF, vR).normalize();
    vR.crossVectors(vU, vF).normalize();
    m4.makeBasis(vR, vU, vF);
    group.quaternion.setFromRotationMatrix(m4);
    group.position.set(pl.x, pl.y, pl.z);

    // hint: glow + little hops; life: engine shake, squash when starting or heaping
    const lvl = pl.hint;
    const u = (time * 0.95) % 1;
    const hop = lvl > 0 && u < 0.28 ? Math.sin((u / 0.28) * Math.PI) : 0;
    const sq = Math.sin(pl.squash * Math.PI) * 0.06 + (lvl > 0 && u >= 0.28 && u < 0.4 ? Math.sin(((u - 0.28) / 0.12) * Math.PI) * 0.05 * lvl : 0);
    const shake = pl.driving || pl.speed > 0.05 ? Math.sin(time * 47) * 0.004 : Math.sin(time * 23) * 0.0015;
    body.position.y = hop * 0.2 * lvl + shake;
    body.scale.set(1 + sq * 0.6, 1 - sq + hop * 0.04 * lvl, 1 + sq * 0.6);
    body.rotation.x = -pl.squash * 0.03;
    const glow = lvl * (0.3 + 0.25 * Math.sin(time * 6));
    paintMat.emissiveIntensity = glow;
    trimMat.emissiveIntensity = glow * 0.25;
    beaconMat.emissiveIntensity = 0.75 + 0.45 * Math.sin(time * 2.6) + lvl * 0.5;
    bladeGroup.position.z = PLOW.BLADE_Z + Math.sin(pl.kick * Math.PI) * 0.07;
    bladeGroup.position.y = clamp(pl.bY - pl.y - pl.sP * PLOW.BLADE_Z, -PLOW.LIFT[0], PLOW.LIFT[1]);   // the blade lifts to ride on the firm snow

    wq.setFromAxisAngle(wAxis, pl.wheelRot);
    for (let i = 0; i < 4; i++) wheels.setMatrixAt(i, m4.compose(WHEEL_POS[i], wq, wScale));
    wheels.instanceMatrix.needsUpdate = true;
    updateLump();
  }

  function updateLump() {
    const v = pl.vol;
    lump.visible = v > 0.004;
    if (!lump.visible) return;
    // while it is being laid down the lump keeps its outline and only gets lower, so ground + lump stays the same
    const fade = pl.settling > 0 && pl.settleV0 > 1e-6 ? clamp(v / pl.settleV0, 0, 1) : 1;
    lumpDims(fade < 1 ? pl.settleV0 : v, dims);
    const bz0 = PLOW.BLADE_Z + (fade < 1 ? 0 : Math.sin(pl.kick * Math.PI) * 0.07);
    const bx = pl.x + fx * bz0, bz = pl.z + fz * bz0;
    const roll = pl.travel * 5;
    for (let a = 0; a <= LS; a++) {
      const sN = -1 + (2 * a) / LS, u = sN * dims.wl;
      const sp = Math.sqrt(Math.max(0, 1 - sN * sN)), L = dims.lc * sp;
      for (let b = 0; b < lumpRows; b++) {
        const t = b === 0 ? 0 : (b - 1) / LT;
        const w = b === 0 ? -0.09 : t * L;
        let sH = b === 0 ? 0 : dims.hc * sp * (1 - t * t) * fade;
        if (sH > 0) sH *= 1 + 0.08 * Math.sin(u * 8 + roll) * Math.sin(t * 6 + roll * 0.7);
        const x = bx + rx * u + fx * w, z = bz + rz * u + fz * w;
        const k = (b * lumpCols + a) * 3;
        lumpPos[k] = x; lumpPos[k + 2] = z;
        lumpPos[k + 1] = terrain.heightAt(x, z) + sH - 0.02 * (1 - Math.min(1, sH / 0.08));
        lumpUv[(b * lumpCols + a) * 2] = x / GRID.UV_PERIOD; lumpUv[(b * lumpCols + a) * 2 + 1] = z / GRID.UV_PERIOD;
      }
    }
    // smooth normals from the grid (dv x du points up)
    const at = (a, b, c) => lumpPos[(Math.min(lumpRows - 1, Math.max(0, b)) * lumpCols + Math.min(LS, Math.max(0, a))) * 3 + c];
    for (let b = 0; b < lumpRows; b++) for (let a = 0; a <= LS; a++) {
      const ux = at(a + 1, b, 0) - at(a - 1, b, 0), uy = at(a + 1, b, 1) - at(a - 1, b, 1), uz = at(a + 1, b, 2) - at(a - 1, b, 2);
      const vx = at(a, b + 1, 0) - at(a, b - 1, 0), vy = at(a, b + 1, 1) - at(a, b - 1, 1), vz = at(a, b + 1, 2) - at(a, b - 1, 2);
      let nx = vy * uz - vz * uy, ny = vz * ux - vx * uz, nz = vx * uy - vy * ux;
      const l = Math.hypot(nx, ny, nz);
      const k = (b * lumpCols + a) * 3;
      if (l > 1e-6) { lumpNor[k] = nx / l; lumpNor[k + 1] = ny / l; lumpNor[k + 2] = nz / l; }
      else { lumpNor[k] = 0; lumpNor[k + 1] = 1; lumpNor[k + 2] = 0; }
    }
    lumpGeo.attributes.position.needsUpdate = true;
    lumpGeo.attributes.normal.needsUpdate = true;
    lumpGeo.attributes.uv.needsUpdate = true;
  }

  return {
    group, lump, pick, state: pl,
    update, pose, reset,
    setHint(v) { pl.hint = v; },
    setShadows(on) { for (const m of [bodyPaint, bodyTrim, bladeMesh, wheels, lump]) m.castShadow = on; },
    // two circles the sled must stay out of: the body, and the blade with its snow
    colliders(out) {
      out[0].x = pl.x; out[0].z = pl.z; out[0].r = 1.15;
      out[1].x = pl.x + fx * (PLOW.BLADE_Z + 0.25); out[1].z = pl.z + fz * (PLOW.BLADE_Z + 0.25); out[1].r = 1.2;
      return out;
    },
    getPose() {
      return { x: pl.x, y: pl.y, z: pl.z, heading: pl.h, speed: pl.speed, load: clamp(pl.vol / PLOW.LOAD_MAX, 0, 1), driving: pl.driving };
    },
    get movedVolume() { return pl.moved; },
    onContextRestored() {
      wheels.instanceMatrix.needsUpdate = true;
      for (const n of ['position', 'normal', 'uv']) lumpGeo.attributes[n].needsUpdate = true;
    },
    dispose() { owned.forEach((o) => o.dispose()); wheels.dispose(); },
  };
}
