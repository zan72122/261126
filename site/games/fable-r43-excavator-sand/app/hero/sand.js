// 砂の高さマップ（砂地と荷台で共用）：積む・崩す（安息角）・頂点更新（変わった範囲だけ）。
// 砂のマテリアル：乾いた砂と湿った砂を頂点の「湿り」でまぜる。

export function createSandMaterial(THREE, textures) {
  const mat = new THREE.MeshLambertMaterial({ map: textures.sandDry, color: 0xffffff });
  const uni = { tWet: { value: textures.sandWet } };
  mat.onBeforeCompile = (shader) => {
    shader.uniforms.tWet = uni.tWet;
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nattribute float wet;\nvarying float vWet;\nvarying float vHgt;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvWet = wet;\nvHgt = position.y;');
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nuniform sampler2D tWet;\nvarying float vWet;\nvarying float vHgt;')
      .replace('#include <map_fragment>', [
        '#ifdef USE_MAP',
        '  vec4 dryC = texture2D( map, vMapUv );',
        '  vec4 wetC = texture2D( tWet, vMapUv );',
        '  float wm = smoothstep( 0.12, 0.8, clamp( vWet, 0.0, 1.0 ) + ( dryC.g - 0.55 ) * 0.5 );',
        '  vec3 sandC = mix( dryC.rgb * vec3( 1.04, 1.0, 0.94 ), wetC.rgb * vec3( 1.5, 1.34, 1.14 ), wm );',
        '  sandC *= 1.0 - 0.42 * smoothstep( 0.0, 0.2, -vHgt );',
        '  sandC *= 1.0 + 0.1 * smoothstep( 0.0, 0.12, vHgt ) * ( 1.0 - wm );',
        '  diffuseColor.rgb *= sandC;',
        '#endif',
      ].join('\n'));
  };
  mat.customProgramCacheKey = () => 'heroSand1';
  // debug の集計がテクスチャを見つけられるように（three は Lambert の uniforms プロパティを使わない）
  mat.uniforms = uni;
  return mat;
}

// 高さマップの格子。頂点 (ix, iz)、ix=0..nx、iz=0..nz。局所座標 x = x0 + ix*dx、z = z0 + iz*dz、y = 高さ。
export function createGrid(THREE, o) {
  const nx = o.nx, nz = o.nz, VX = nx + 1, VZ = nz + 1, N = VX * VZ;
  const dx = o.dx, dz = o.dz, x0 = o.x0, z0 = o.z0, cellA = dx * dz;
  const H = new Float32Array(N);
  const wet = new Float32Array(N).fill(o.wet0 || 0);
  const floor = o.floor || null;           // これより下へは減らない（null なら 0）
  const hideEmpty = !!o.hideEmpty;         // 荷台：砂のない所は床の下に隠す
  const repose = o.repose;
  const mDx = repose * dx, mDz = repose * dz, mDd = repose * Math.hypot(dx, dz);

  const pos = new Float32Array(N * 3), nor = new Float32Array(N * 3), uv = new Float32Array(N * 2);
  for (let iz = 0; iz < VZ; iz++) for (let ix = 0; ix < VX; ix++) {
    const i = iz * VX + ix;
    pos[i * 3] = x0 + ix * dx; pos[i * 3 + 2] = z0 + iz * dz; nor[i * 3 + 1] = 1;
    uv[i * 2] = (x0 + ix * dx) * o.uvScale + (o.uvOff || 0); uv[i * 2 + 1] = (z0 + iz * dz) * o.uvScale + (o.uvOff || 0) * 0.6;
  }
  const index = new Uint16Array(nx * nz * 6);
  let t = 0;
  for (let iz = 0; iz < nz; iz++) for (let ix = 0; ix < nx; ix++) {
    const a = iz * VX + ix, b = a + 1, c = a + VX, d = c + 1;
    // 対角線の向きを市松にして、溝の縁のぎざぎざを目立たなくする
    if ((ix + iz) & 1) { index[t++] = a; index[t++] = c; index[t++] = b; index[t++] = b; index[t++] = c; index[t++] = d; }
    else { index[t++] = a; index[t++] = c; index[t++] = d; index[t++] = a; index[t++] = d; index[t++] = b; }
  }
  const geo = new THREE.BufferGeometry();
  geo.setIndex(new THREE.BufferAttribute(index, 1));
  const aPos = new THREE.BufferAttribute(pos, 3), aNor = new THREE.BufferAttribute(nor, 3), aWet = new THREE.BufferAttribute(wet, 1);
  for (const a of [aPos, aNor, aWet]) a.setUsage(THREE.DynamicDrawUsage);
  geo.setAttribute('position', aPos); geo.setAttribute('normal', aNor); geo.setAttribute('wet', aWet);
  geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(x0 + (nx * dx) / 2, 0, z0 + (nz * dz) / 2), Math.hypot(nx * dx, nz * dz) / 2 + 0.6);
  const mesh = new THREE.Mesh(geo, o.material);

  // ---- 変わった範囲 ----
  let d0x = 1e9, d0z = 1e9, d1x = -1, d1z = -1;
  function touch(ax, az, bx, bz) {
    if (ax < d0x) d0x = ax < 0 ? 0 : ax;
    if (az < d0z) d0z = az < 0 ? 0 : az;
    if (bx > d1x) d1x = bx > nx ? nx : bx;
    if (bz > d1z) d1z = bz > nz ? nz : bz;
  }
  function touchAll() { d0x = 0; d0z = 0; d1x = nx; d1z = nz; }
  let volDirty = true, volCache = 0;
  function flush() {
    if (d1x < d0x || d1z < d0z) return false;
    const ax = Math.max(0, d0x - 1), az = Math.max(0, d0z - 1), bx = Math.min(nx, d1x + 1), bz = Math.min(nz, d1z + 1);
    const ng = o.normalGain || 1; // 陰影を少し強調して、遠くからでも穴と山の形が読めるようにする
    const ix2 = ng / (2 * dx), iz2 = ng / (2 * dz);
    for (let iz = az; iz <= bz; iz++) {
      const zm = iz > 0 ? -VX : 0, zp = iz < nz ? VX : 0, kz = zm && zp ? iz2 : iz2 * 2;
      for (let ix = ax; ix <= bx; ix++) {
        const i = iz * VX + ix, h = H[i];
        pos[i * 3 + 1] = hideEmpty && h < 0.0012 ? -0.01 : h;
        const xm = ix > 0 ? -1 : 0, xp = ix < nx ? 1 : 0, kx = xm && xp ? ix2 : ix2 * 2;
        const sx = (H[i + xp] - H[i + xm]) * kx, sz = (H[i + zp] - H[i + zm]) * kz;
        const il = 1 / Math.sqrt(sx * sx + sz * sz + 1);
        nor[i * 3] = -sx * il; nor[i * 3 + 1] = il; nor[i * 3 + 2] = -sz * il;
      }
    }
    const s = az * VX + ax, e = bz * VX + bx, n = e - s + 1;
    aPos.addUpdateRange(s * 3, n * 3); aPos.needsUpdate = true;
    aNor.addUpdateRange(s * 3, n * 3); aNor.needsUpdate = true;
    aWet.addUpdateRange(s, n); aWet.needsUpdate = true;
    d0x = 1e9; d0z = 1e9; d1x = -1; d1z = -1;
    volDirty = true;
    return true;
  }
  function fullUpload() {
    for (const a of [aPos, aNor, aWet]) { a.clearUpdateRanges(); a.needsUpdate = true; }
  }

  // ---- 高さ ----
  function sample(x, z) {
    let fx = (x - x0) / dx, fz = (z - z0) / dz;
    if (fx < 0) fx = 0; else if (fx > nx) fx = nx;
    if (fz < 0) fz = 0; else if (fz > nz) fz = nz;
    let ix = fx | 0, iz = fz | 0;
    if (ix >= nx) ix = nx - 1;
    if (iz >= nz) iz = nz - 1;
    const u = fx - ix, v = fz - iz, i = iz * VX + ix;
    return (H[i] * (1 - u) + H[i + 1] * u) * (1 - v) + (H[i + VX] * (1 - u) + H[i + VX + 1] * u) * v;
  }
  function inside(x, z) { return x >= x0 && z >= z0 && x <= x0 + nx * dx && z <= z0 + nz * dz; }
  function volume() {
    if (volDirty) { let s = 0; for (let i = 0; i < N; i++) s += H[i]; volCache = s * cellA; volDirty = false; }
    return volCache;
  }

  // ---- 積む：着地点のまわり4頂点に体積を配る（margin マス内側に丸める）----
  function deposit(x, z, vol, wetV, margin = 0) {
    let fx = (x - x0) / dx, fz = (z - z0) / dz;
    const lo = margin, hx = nx - margin, hz = nz - margin;
    if (fx < lo) fx = lo; else if (fx > hx) fx = hx;
    if (fz < lo) fz = lo; else if (fz > hz) fz = hz;
    let ix = fx | 0, iz = fz | 0;
    if (ix >= nx) ix = nx - 1;
    if (iz >= nz) iz = nz - 1;
    const u = fx - ix, v = fz - iz, i = iz * VX + ix, k = vol / cellA;
    const w00 = (1 - u) * (1 - v), w10 = u * (1 - v), w01 = (1 - u) * v, w11 = u * v;
    H[i] += k * w00; H[i + 1] += k * w10; H[i + VX] += k * w01; H[i + VX + 1] += k * w11;
    if (wetV > 0) {
      // 少しの砂は薄く、たくさん積もると濃く湿って見える
      const g = wetV * Math.min(1, 0.35 + k * 60);
      let w = g * Math.min(1, w00 * 2.2); if (wet[i] < w) wet[i] = w;
      w = g * Math.min(1, w10 * 2.2); if (wet[i + 1] < w) wet[i + 1] = w;
      w = g * Math.min(1, w01 * 2.2); if (wet[i + VX] < w) wet[i + VX] = w;
      w = g * Math.min(1, w11 * 2.2); if (wet[i + VX + 1] < w) wet[i + VX + 1] = w;
    }
    touch(ix, iz, ix + 1, iz + 1);
    activate(ix - 1, iz - 1, ix + 2, iz + 2);
    volDirty = true;
  }

  // ---- 崩す：安息角を超えた段差を低い方へ流す。動いている範囲だけを追う ----
  let act = null; // [ax, az, bx, bz]
  let sweepN = 0;
  function activate(ax, az, bx, bz) {
    if (ax < 0) ax = 0;
    if (az < 0) az = 0;
    if (bx > nx) bx = nx;
    if (bz > nz) bz = nz;
    if (!act) act = [ax, az, bx, bz];
    else { if (ax < act[0]) act[0] = ax; if (az < act[1]) act[1] = az; if (bx > act[2]) act[2] = bx; if (bz > act[3]) act[3] = bz; }
  }
  const KF = 0.42;
  // tilt：格子の傾き（世界の上向きを格子の局所座標で表したもの）。水平なら (0,1,0)
  function relax(sweeps, ux = 0, uy = 1, uz = 0, wetFlow = 0) {
    if (!act) return 0;
    let total = 0;
    const tX = -dx * ux, tZ = -dz * uz; // 隣（+x／+z）との「標高差」に足す分
    const iy = 1 / Math.max(0.3, uy);
    for (let s = 0; s < sweeps && act; s++) {
      const ax = act[0], az = act[1], bx = act[2], bz = act[3];
      let c0x = 1e9, c0z = 1e9, c1x = -1, c1z = -1;
      const rev = sweepN++ & 1;
      for (let zi = az; zi <= bz; zi++) {
        const iz = rev ? bz - (zi - az) : zi;
        for (let xi = ax; xi <= bx; xi++) {
          const ix = rev ? bx - (xi - ax) : xi;
          const i = iz * VX + ix;
          let ch = 0;
          for (let n = 0; n < 4; n++) {
            let j, maxD, tl;
            if (n === 0) { if (ix >= nx) continue; j = i + 1; maxD = mDx; tl = tX; }
            else if (n === 1) { if (iz >= nz) continue; j = i + VX; maxD = mDz; tl = tZ; }
            else if (n === 2) { if (ix >= nx || iz >= nz) continue; j = i + VX + 1; maxD = mDd; tl = tX + tZ; }
            else { if (ix <= 0 || iz >= nz) continue; j = i + VX - 1; maxD = mDd; tl = -tX + tZ; }
            const d = (H[i] - H[j]) * uy + tl;
            let a, b, m;
            if (d > maxD) { a = i; b = j; m = (d - maxD) * KF * iy; }
            else if (d < -maxD) { a = j; b = i; m = (-d - maxD) * KF * iy; }
            else continue;
            const lim = H[a] - (floor ? floor[a] : 0);
            if (m > lim) m = lim;
            if (m <= 2e-6) continue;
            H[a] -= m; H[b] += m; total += m;
            if (wetFlow > 0) {
              const w = m * 220 * wetFlow;
              const wa = w > 1 ? 1 : w, wb = wa * 0.7;
              if (wet[a] < wa) wet[a] = wa;
              if (wet[b] < wb) wet[b] = wb;
            }
            ch = 1;
          }
          if (ch) {
            if (ix - 1 < c0x) c0x = ix - 1;
            if (ix + 1 > c1x) c1x = ix + 1;
            if (iz < c0z) c0z = iz;
            if (iz + 1 > c1z) c1z = iz + 1;
          }
        }
      }
      if (c1x < 0) act = null;
      else {
        touch(c0x, c0z, c1x, c1z);
        act = [Math.max(0, c0x - 1), Math.max(0, c0z - 1), Math.min(nx, c1x + 1), Math.min(nz, c1z + 1)];
      }
    }
    if (total > 0) volDirty = true;
    return total * cellA;
  }

  return {
    nx, nz, VX, VZ, N, dx, dz, x0, z0, cellA, H, wet, mesh, geo,
    touch, touchAll, flush, fullUpload, sample, inside, volume, deposit, activate, relax,
    get active() { return !!act; },
    markVolume() { volDirty = true; },
    dispose() { geo.dispose(); },
  };
}
