// 砂の粒（InstancedMesh 1つ）。それぞれが体積を運び、着地した所の高さマップに足す。
// 衝突の相手は呼び出し側が渡す land(i) 関数で決める（荷台／砂地／壁）。
export function createGrains(THREE, max, P) {
  const geo = new THREE.IcosahedronGeometry(1, 0);
  const mat = new THREE.MeshLambertMaterial({ color: 0xffffff });
  const mesh = new THREE.InstancedMesh(geo, mat, max);
  mesh.count = 0;
  mesh.frustumCulled = false;
  mesh.castShadow = false;
  mesh.name = 'sandGrains';
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  mesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(max * 3), 3);
  mesh.instanceColor.setUsage(THREE.DynamicDrawUsage);
  const M = mesh.instanceMatrix.array, Cc = mesh.instanceColor.array;
  M.fill(0);

  const px = new Float32Array(max), py = new Float32Array(max), pz = new Float32Array(max);
  const vx = new Float32Array(max), vy = new Float32Array(max), vz = new Float32Array(max);
  const vol = new Float32Array(max), size = new Float32Array(max), age = new Float32Array(max);
  const kind = new Uint8Array(max); // 1＝あけている砂、2＝こぼれた砂
  const shade = new Float32Array(max);
  let n = 0, flying = 0;
  let seed = 12345;
  const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
  const base = new THREE.Color(0xb98f58);

  function emit(x, y, z, ux, uy, uz, v, k) {
    if (!(v > 0)) return;
    flying += v;
    if (n >= max) { // 満杯：いちばん新しい粒に体積を足す（体積は失わない）
      vol[(rnd() * n) | 0] += v;
      return;
    }
    const i = n++;
    px[i] = x; py[i] = y; pz[i] = z; vx[i] = ux; vy[i] = uy; vz[i] = uz;
    vol[i] = v; kind[i] = k; age[i] = 0;
    size[i] = P.grainR * (0.65 + 0.8 * rnd());
    shade[i] = 0.78 + 0.34 * rnd();
  }
  function kill(i) {
    flying -= vol[i];
    const l = --n;
    if (i !== l) {
      px[i] = px[l]; py[i] = py[l]; pz[i] = pz[l]; vx[i] = vx[l]; vy[i] = vy[l]; vz[i] = vz[l];
      vol[i] = vol[l]; kind[i] = kind[l]; age[i] = age[l]; size[i] = size[l]; shade[i] = shade[l];
    }
  }
  // collide(i) → true なら着地して消える（体積は collide の中で足しておく）
  function update(dt, collide) {
    const g = P.gravity;
    for (let i = n - 1; i >= 0; i--) {
      age[i] += dt;
      vy[i] -= g * dt;
      px[i] += vx[i] * dt; py[i] += vy[i] * dt; pz[i] += vz[i] * dt;
      if (collide(i)) kill(i);
    }
    if (n === 0) flying = 0;
    for (let i = 0; i < n; i++) {
      const o = i * 16, s = size[i] * Math.min(1, 0.45 + age[i] * 9);
      M[o] = s; M[o + 5] = s; M[o + 10] = s; M[o + 15] = 1;
      M[o + 12] = px[i]; M[o + 13] = py[i]; M[o + 14] = pz[i];
      const c = shade[i];
      Cc[i * 3] = base.r * c; Cc[i * 3 + 1] = base.g * c; Cc[i * 3 + 2] = base.b * c;
    }
    if (n > 0 || mesh.count > 0) {
      mesh.count = n;
      mesh.instanceMatrix.needsUpdate = true;
      mesh.instanceColor.needsUpdate = true;
    }
  }
  function countKind(k) { let c = 0; for (let i = 0; i < n; i++) if (kind[i] === k) c++; return c; }

  return {
    mesh, px, py, pz, vx, vy, vz, vol, kind, age,
    emit, update, countKind, rnd,
    get count() { return n; },
    get flying() { return flying > 0 ? flying : 0; },
    clear() { n = 0; flying = 0; mesh.count = 0; },
    dispose() { geo.dispose(); mat.dispose(); mesh.dispose(); },
  };
}
