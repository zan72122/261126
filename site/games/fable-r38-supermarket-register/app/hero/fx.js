// 小さな演出：商品の丸影（動く四角を1つの形にまとめて draw call 1回）と、きらめき（InstancedMesh 1つ）。
// どちらも hero の手続きテクスチャ（アトラス）の形を使う。毎フレームの new はしない。

export function createFx(THREE, { atlas, layout: L, maxShadows = 12, maxSparks = 28 }) {
  const group = new THREE.Group();
  group.name = 'fx';

  // ---------- 丸影 ----------
  const sr = atlas.rects.blob;
  const sPos = new Float32Array(maxShadows * 4 * 3);
  const sUv = new Float32Array(maxShadows * 4 * 2);
  const sCol = new Float32Array(maxShadows * 4 * 4);
  const sIdx = new Uint16Array(maxShadows * 6);
  for (let i = 0; i < maxShadows; i++) {
    const o = i * 4;
    sUv.set([sr[0], sr[1], sr[2], sr[1], sr[2], sr[3], sr[0], sr[3]], o * 2);
    sIdx.set([o, o + 1, o + 2, o, o + 2, o + 3], i * 6);
    for (let k = 0; k < 4; k++) { sCol[(o + k) * 4] = 1; sCol[(o + k) * 4 + 1] = 1; sCol[(o + k) * 4 + 2] = 1; sCol[(o + k) * 4 + 3] = 0; }
  }
  const sGeo = new THREE.BufferGeometry();
  const sPosAttr = new THREE.BufferAttribute(sPos, 3); sPosAttr.setUsage(THREE.DynamicDrawUsage);
  const sColAttr = new THREE.BufferAttribute(sCol, 4); sColAttr.setUsage(THREE.DynamicDrawUsage);
  sGeo.setAttribute('position', sPosAttr);
  sGeo.setAttribute('uv', new THREE.BufferAttribute(sUv, 2));
  sGeo.setAttribute('color', sColAttr);
  sGeo.setIndex(new THREE.BufferAttribute(sIdx, 1));
  sGeo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 5);
  const sMat = new THREE.MeshBasicMaterial({
    map: atlas.texture, color: 0x000000, transparent: true, depthWrite: false, vertexColors: true, toneMapped: false,
    polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -3,
  });
  const shadows = new THREE.Mesh(sGeo, sMat);
  shadows.frustumCulled = false;
  shadows.renderOrder = 1;
  group.add(shadows);
  let sCount = 0;

  const B = L.belt, SC = L.scanner, BK = L.basket, WL = L.bag;
  // その場所の「床」の高さ（影を落とす面）。袋置き場の上は影なし（NaN）
  function groundY(x, z) {
    if (x > B.x0 - 0.02 && x < B.x1 + 0.02 && Math.abs(z - B.z) < B.width / 2 + 0.02) return B.topY + 0.0012;
    if (x > WL.base[0] - 0.22 && Math.abs(z - WL.base[2]) < 0.18 && x < WL.base[0] + 0.22) return NaN;
    if (Math.abs(x - SC.center[0]) < SC.size[0] / 2 + 0.02 && Math.abs(z - SC.center[2]) < SC.size[1] / 2 + 0.02) return 0.0215;
    if (Math.abs(x - BK.center[0]) < BK.size[0] / 2 && Math.abs(z - BK.center[2]) < BK.size[2] / 2) return 0.0135;
    return 0.0015;
  }
  function beginShadows() { sCount = 0; }
  // (x,y,z)：物の中心、rx/rz：影の半径、h：物の半分の高さ
  function addShadow(x, y, z, rx, rz, h) {
    if (sCount >= maxShadows) return;
    const gy = groundY(x, z);
    if (!(gy === gy)) return;
    const lift = Math.max(0, y - h - gy);
    const spread = 1 + lift * 2.2;
    const alpha = 0.5 / (1 + lift * 9);
    if (alpha < 0.03) return;
    const o = sCount * 4;
    const ax = rx * spread, az = rz * spread;
    // 光は右上手前から：影は少し左奥へ
    const cx = x - 0.012 - lift * 0.12, cz = z - 0.006 - lift * 0.08;
    sPos[o * 3] = cx - ax; sPos[o * 3 + 1] = gy; sPos[o * 3 + 2] = cz + az;
    sPos[o * 3 + 3] = cx + ax; sPos[o * 3 + 4] = gy; sPos[o * 3 + 5] = cz + az;
    sPos[o * 3 + 6] = cx + ax; sPos[o * 3 + 7] = gy; sPos[o * 3 + 8] = cz - az;
    sPos[o * 3 + 9] = cx - ax; sPos[o * 3 + 10] = gy; sPos[o * 3 + 11] = cz - az;
    for (let k = 0; k < 4; k++) sCol[(o + k) * 4 + 3] = alpha;
    sCount++;
  }
  function endShadows() {
    sGeo.setDrawRange(0, sCount * 6);
    shadows.visible = sCount > 0;
    if (sCount > 0) { sPosAttr.needsUpdate = true; sColAttr.needsUpdate = true; }
  }

  // ---------- きらめき ----------
  const pr = atlas.rects.star;
  const pGeo = new THREE.PlaneGeometry(1, 1);
  {
    const uv = pGeo.attributes.uv;
    for (let i = 0; i < uv.count; i++) uv.setXY(i, pr[0] + (pr[2] - pr[0]) * uv.getX(i), pr[1] + (pr[3] - pr[1]) * uv.getY(i));
    pGeo.rotateX(-0.68); // 固定カメラ（約39°〜51°見下ろし）の方へ向ける
  }
  const pMat = new THREE.MeshBasicMaterial({ map: atlas.texture, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false });
  const sparks = new THREE.InstancedMesh(pGeo, pMat, maxSparks);
  sparks.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(maxSparks * 3), 3);
  sparks.count = 0;
  sparks.frustumCulled = false;
  sparks.renderOrder = 4;
  group.add(sparks);
  const P = [];
  for (let i = 0; i < maxSparks; i++) P.push({ on: false, t: 0, life: 0, x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, s: 0, r: 1, g: 1, b: 1, spin: 0 });
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), vp = new THREE.Vector3(), vs = new THREE.Vector3(), zAxis = new THREE.Vector3(0, 0.63, 0.777), col = new THREE.Color();
  let anySpark = false;

  // (x,y,z) から n 個。speed：飛ぶ速さ、up：上向きの強さ、colors：色の候補（hex の配列）
  function burst(x, y, z, n, rnd, { speed = 0.5, up = 0.5, size = 0.05, colors = [0xffffff], life = 0.45 } = {}) {
    let made = 0;
    for (const p of P) {
      if (made >= n) break;
      if (p.on) continue;
      const a = (made / n) * Math.PI * 2 + rnd() * 0.8;
      const sp = speed * (0.6 + 0.6 * rnd());
      p.on = true; p.t = 0; p.life = life * (0.75 + 0.5 * rnd());
      p.x = x; p.y = y; p.z = z;
      p.vx = Math.cos(a) * sp; p.vz = Math.sin(a) * sp * 0.7; p.vy = up * (0.6 + 0.8 * rnd());
      p.s = size * (0.7 + 0.6 * rnd());
      col.set(colors[Math.floor(rnd() * colors.length) % colors.length]);
      p.r = col.r; p.g = col.g; p.b = col.b;
      p.spin = (rnd() - 0.5) * 6;
      made++;
    }
    anySpark = true;
  }

  function updateSparks(dt) {
    if (!anySpark) return;
    let n = 0;
    for (const p of P) {
      if (!p.on) continue;
      p.t += dt;
      const u = p.t / p.life;
      if (u >= 1) { p.on = false; continue; }
      p.vy -= 1.6 * dt;
      p.vx *= Math.exp(-2.5 * dt); p.vz *= Math.exp(-2.5 * dt);
      p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt;
      const s = Math.max(0.0005, p.s * Math.sin(Math.PI * Math.min(1, u * 1.15 + 0.08)));
      vp.set(p.x, p.y, p.z); vs.set(s, s, s);
      q.setFromAxisAngle(zAxis, p.spin * p.t);
      m4.compose(vp, q, vs);
      sparks.setMatrixAt(n, m4);
      const k = 1 - u * u;
      sparks.instanceColor.setXYZ(n, p.r * k, p.g * k, p.b * k);
      n++;
    }
    sparks.count = n;
    sparks.visible = n > 0;
    if (n > 0) { sparks.instanceMatrix.needsUpdate = true; sparks.instanceColor.needsUpdate = true; }
    anySpark = n > 0;
  }

  function clear() { for (const p of P) p.on = false; sparks.count = 0; sparks.visible = false; anySpark = false; sCount = 0; endShadows(); }

  function dispose() { sGeo.dispose(); sMat.dispose(); pGeo.dispose(); pMat.dispose(); sparks.dispose(); }

  sparks.visible = false;
  shadows.visible = false;
  return { group, beginShadows, addShadow, endShadows, burst, updateSparks, clear, dispose };
}
