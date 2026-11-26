// 寄った時に見える「高さマップの格子」を、表示側だけで滑らかにする（hero のコードは変えない）。
// hero の山のメッシュ（N×N 格子、'hero.mound'）を毎回読み、縦横 2 倍に細分した表示用メッシュを作って差し替える。
//   ・高さ・色・染み（aSurf）は Catmull-Rom の 3 次補間（色と染みは両隣の値の範囲に収めて、にじみ・行き過ぎを出さない）
//   ・色と染みは補間の前に軽くぼかす（染みの縁のマス目の階段を丸める）
//   ・法線は細かくなった面の高さから作り直す（陰影がなめらかにつながる）
//   ・縁の外へ寄せた頂点（格子からずれている）の周りは直線補間（縁の折り返しをこわさない）
// マテリアルは hero の物をそのまま使う（同じシェーダー・同じ見た目）。hero の頂点が変わった時（version が増えた時）だけ、2 フレームに 1 回作り直す。
// 三角形は山の分が 4 倍（N=64 で約 7.9k → 約 31.6k）。hero の予算 5 万・全体 10 万の内側。

export function createMoundSmoother(THREE, hero) {
  let mound = null;
  hero.root.traverse((o) => { if (o.name === 'hero.mound' && o.isMesh) mound = o; });
  if (!mound || !mound.geometry || !mound.geometry.index) return null;
  const g0 = mound.geometry, A = g0.attributes;
  if (!A.position || !A.normal || !A.color || !A.aSurf || !A.uv) return null;
  const cnt = A.position.count, N = Math.round(Math.sqrt(cnt));
  if (N * N !== cnt || N < 4) return null;
  const P0 = A.position.array, X0 = P0[0], Z0 = P0[2], CELL = P0[3] - P0[0];
  if (!(CELL > 0)) return null;

  // ---- 使われている頂点・四角形、格子どおりの頂点（reg） ----
  const I0 = g0.index.array, used = new Uint8Array(cnt), quad = new Uint8Array(cnt);
  for (let t = 0; t < I0.length; t += 3) {
    let mi = N, mj = N;
    for (let e = 0; e < 3; e++) { const k = I0[t + e]; used[k] = 1; const i = k % N, j = (k / N) | 0; if (i < mi) mi = i; if (j < mj) mj = j; }
    quad[mj * N + mi] = 1;
  }
  const reg = new Uint8Array(cnt);
  const updateReg = () => {
    for (let k = 0; k < cnt; k++) {
      const i = k % N, j = (k / N) | 0;
      reg[k] = used[k] && Math.abs(P0[k * 3] - (X0 + i * CELL)) < 1e-6 && Math.abs(P0[k * 3 + 2] - (Z0 + j * CELL)) < 1e-6 ? 1 : 0;
    }
  };
  updateReg();

  // ---- 細かい格子 ----
  const M = 2 * N - 1, MM = M * M;
  const fPos = new Float32Array(MM * 3), fNor = new Float32Array(MM * 3), fCol = new Float32Array(MM * 3), fSurf = new Float32Array(MM * 3), fUv = new Float32Array(MM * 2);
  const fReg = new Uint8Array(MM); // 格子どおりの頂点だけから作った（＝面の高さから法線を作ってよい）
  const idx = [];
  for (let qj = 0; qj < N - 1; qj++) for (let qi = 0; qi < N - 1; qi++) {
    if (!quad[qj * N + qi]) continue;
    for (let dj = 0; dj < 2; dj++) for (let di = 0; di < 2; di++) {
      const I = 2 * qi + di, J = 2 * qj + dj, a = J * M + I, b = a + 1, c = a + M, d = c + 1;
      if ((I + J) & 1) idx.push(a, c, b, b, c, d); else idx.push(a, c, d, a, d, b);
    }
  }
  const geo = new THREE.BufferGeometry();
  const aPos = new THREE.BufferAttribute(fPos, 3).setUsage(THREE.DynamicDrawUsage);
  const aNor = new THREE.BufferAttribute(fNor, 3).setUsage(THREE.DynamicDrawUsage);
  const aCol = new THREE.BufferAttribute(fCol, 3).setUsage(THREE.DynamicDrawUsage);
  const aSurf = new THREE.BufferAttribute(fSurf, 3).setUsage(THREE.DynamicDrawUsage);
  const aUv = new THREE.BufferAttribute(fUv, 2);
  geo.setAttribute('position', aPos); geo.setAttribute('normal', aNor); geo.setAttribute('color', aCol);
  geo.setAttribute('aSurf', aSurf); geo.setAttribute('uv', aUv);
  geo.setIndex(idx);
  geo.boundingSphere = g0.boundingSphere ? g0.boundingSphere.clone() : new THREE.Sphere(new THREE.Vector3(0, 0.12, 0), 0.2);

  const mesh = new THREE.Mesh(geo, mound.material);
  mesh.name = 'shell.moundSmooth';
  mesh.position.copy(mound.position); mesh.quaternion.copy(mound.quaternion); mesh.scale.copy(mound.scale);
  mesh.renderOrder = mound.renderOrder;
  mound.parent.add(mesh);
  mound.visible = false;

  // ---- 補間 ----
  // Catmull-Rom の真ん中（t=0.5）
  const cr = (a, b, c, d) => (-a + 9 * b + 9 * c - d) * 0.0625;
  const within = (v, b, c) => { const lo = b < c ? b : c, hi = b < c ? c : b; return v < lo ? lo : v > hi ? hi : v; };
  // 細かい頂点 f を、粗い頂点 b,c（と外側の a,d）の間の真ん中として埋める。cubic=4 点がそろっていて格子どおり
  function mid(f, a, b, c, d, cubic) {
    const f3 = f * 3, b3 = b * 3, c3 = c * 3;
    const SP = srcPos, SN = srcNor, SC = srcCol, SS = srcSurf, SU = srcUv;
    fPos[f3] = (SP[b3] + SP[c3]) * 0.5; fPos[f3 + 2] = (SP[b3 + 2] + SP[c3 + 2]) * 0.5;
    fUv[f * 2] = (SU[b * 2] + SU[c * 2]) * 0.5; fUv[f * 2 + 1] = (SU[b * 2 + 1] + SU[c * 2 + 1]) * 0.5;
    for (let e = 0; e < 3; e++) fNor[f3 + e] = (SN[b3 + e] + SN[c3 + e]) * 0.5;
    if (cubic) {
      const a3 = a * 3, d3 = d * 3;
      fPos[f3 + 1] = cr(SP[a3 + 1], SP[b3 + 1], SP[c3 + 1], SP[d3 + 1]);
      for (let e = 0; e < 3; e++) {
        fCol[f3 + e] = within(cr(SC[a3 + e], SC[b3 + e], SC[c3 + e], SC[d3 + e]), SC[b3 + e], SC[c3 + e]);
        fSurf[f3 + e] = within(cr(SS[a3 + e], SS[b3 + e], SS[c3 + e], SS[d3 + e]), SS[b3 + e], SS[c3 + e]);
      }
    } else {
      fPos[f3 + 1] = (SP[b3 + 1] + SP[c3 + 1]) * 0.5;
      for (let e = 0; e < 3; e++) { fCol[f3 + e] = (SC[b3 + e] + SC[c3 + e]) * 0.5; fSurf[f3 + e] = (SS[b3 + e] + SS[c3 + e]) * 0.5; }
    }
  }
  let srcPos = P0, srcNor = A.normal.array, srcCol = A.color.array, srcSurf = A.aSurf.array, srcUv = A.uv.array;
  // 色と染みは、格子どおりの頂点の間だけで 3×3 の二項ぼかし（1-2-1）をかけてから補間する。
  // 染みの縁がマス目の階段になるのを丸める（表示用の写しだけ。hero の配列には書かない）
  const bCol = new Float32Array(cnt * 3), bSurf = new Float32Array(cnt * 3), tmpA = new Float32Array(cnt * 3);
  // ぼかすのは氷かシロップのある所とそのすぐ隣だけ（何も無い器の底の絵付けはくっきりのまま）
  const wetIce = new Uint8Array(cnt), act = new Uint8Array(cnt);
  function markActive(surf) {
    for (let k = 0; k < cnt; k++) { const k3 = k * 3; wetIce[k] = reg[k] && (surf[k3] > 0.01 || surf[k3 + 1] > 0.01 || surf[k3 + 2] > 0.01) ? 1 : 0; }
    for (let k = 0; k < cnt; k++) {
      if (!reg[k]) { act[k] = 0; continue; }
      const i = k % N, j = (k / N) | 0;
      act[k] = wetIce[k] || (i > 0 && wetIce[k - 1]) || (i < N - 1 && wetIce[k + 1]) || (j > 0 && wetIce[k - N]) || (j < N - 1 && wetIce[k + N]) ? 1 : 0;
    }
  }
  function blur3(src, out) {
    for (let p = 0; p < 2; p++) {
      const from = p === 0 ? src : tmpA, to = p === 0 ? tmpA : out, step = p === 0 ? 1 : N;
      for (let k = 0; k < cnt; k++) {
        const k3 = k * 3;
        if (!act[k]) { to[k3] = from[k3]; to[k3 + 1] = from[k3 + 1]; to[k3 + 2] = from[k3 + 2]; continue; }
        const i = p === 0 ? k % N : (k / N) | 0;
        const l = i > 0 && reg[k - step] ? 1 : 0, r = i < N - 1 && reg[k + step] ? 1 : 0, w = 1 / (2 + l + r);
        const kl = (k - step * l) * 3, kr = (k + step * r) * 3;
        to[k3] = (2 * from[k3] + l * from[kl] + r * from[kr]) * w;
        to[k3 + 1] = (2 * from[k3 + 1] + l * from[kl + 1] + r * from[kr + 1]) * w;
        to[k3 + 2] = (2 * from[k3 + 2] + l * from[kl + 2] + r * from[kr + 2]) * w;
      }
    }
  }
  // 細かい格子の偶数行・偶数列は粗い頂点そのもの。奇数の所を、まず粗い頂点どうしの間（辺の真ん中）で埋める
  function fill() {
    srcPos = A.position.array; srcNor = A.normal.array; srcUv = A.uv.array;
    markActive(A.aSurf.array); blur3(A.color.array, bCol); blur3(A.aSurf.array, bSurf); srcCol = bCol; srcSurf = bSurf;
    for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
      const k = j * N + i, f = 2 * j * M + 2 * i, k3 = k * 3, f3 = f * 3;
      for (let e = 0; e < 3; e++) { fPos[f3 + e] = srcPos[k3 + e]; fNor[f3 + e] = srcNor[k3 + e]; fCol[f3 + e] = srcCol[k3 + e]; fSurf[f3 + e] = srcSurf[k3 + e]; }
      fUv[f * 2] = srcUv[k * 2]; fUv[f * 2 + 1] = srcUv[k * 2 + 1];
      fReg[f] = reg[k];
      // 横の辺の真ん中
      if (i < N - 1) {
        const b = k, c = k + 1, ok = reg[b] && reg[c];
        const cub = ok && i > 0 && i < N - 2 && reg[k - 1] && reg[k + 2];
        mid(f + 1, cub ? k - 1 : b, b, c, cub ? k + 2 : c, cub);
        fReg[f + 1] = ok ? 1 : 0;
      }
      // 縦の辺の真ん中
      if (j < N - 1) {
        const b = k, c = k + N, ok = reg[b] && reg[c];
        const cub = ok && j > 0 && j < N - 2 && reg[k - N] && reg[k + 2 * N];
        mid(f + M, cub ? k - N : b, b, c, cub ? k + 2 * N : c, cub);
        fReg[f + M] = ok ? 1 : 0;
      }
    }
    // 四角形の真ん中：4つの辺の真ん中の平均から、4隅の平均の半分を引く（直線なら双一次の真ん中、曲がっていればその分ふくらむ）
    for (let j = 0; j < N - 1; j++) for (let i = 0; i < N - 1; i++) {
      const f = (2 * j + 1) * M + 2 * i + 1, f3 = f * 3;
      const eT = f - M, eB = f + M, eL = f - 1, eR = f + 1;            // 辺の真ん中
      const c00 = eT - 1, c10 = eT + 1, c01 = eB - 1, c11 = eB + 1;     // 4隅（粗い頂点）
      const ok = fReg[c00] && fReg[c10] && fReg[c01] && fReg[c11];
      fReg[f] = ok ? 1 : 0;
      for (let e = 0; e < 3; e++) {
        const q = (fPos[c00 * 3 + e] + fPos[c10 * 3 + e] + fPos[c01 * 3 + e] + fPos[c11 * 3 + e]) * 0.25;
        const m = (fPos[eT * 3 + e] + fPos[eB * 3 + e] + fPos[eL * 3 + e] + fPos[eR * 3 + e]) * 0.25;
        fPos[f3 + e] = ok && e === 1 ? 2 * m - q : q;
        fNor[f3 + e] = (fNor[c00 * 3 + e] + fNor[c10 * 3 + e] + fNor[c01 * 3 + e] + fNor[c11 * 3 + e]) * 0.25;
        for (let w = 0; w < 2; w++) {
          const arr = w === 0 ? fCol : fSurf;
          const a0 = arr[c00 * 3 + e], a1 = arr[c10 * 3 + e], a2 = arr[c01 * 3 + e], a3 = arr[c11 * 3 + e];
          let v = (arr[eT * 3 + e] + arr[eB * 3 + e] + arr[eL * 3 + e] + arr[eR * 3 + e]) * 0.5 - (a0 + a1 + a2 + a3) * 0.25;
          if (!ok) v = (a0 + a1 + a2 + a3) * 0.25;
          const lo = Math.min(a0, a1, a2, a3), hi = Math.max(a0, a1, a2, a3);
          arr[f3 + e] = v < lo ? lo : v > hi ? hi : v;
        }
      }
      fUv[f * 2] = (fUv[c00 * 2] + fUv[c11 * 2]) * 0.5; fUv[f * 2 + 1] = (fUv[c00 * 2 + 1] + fUv[c11 * 2 + 1]) * 0.5;
    }
    // 法線：格子どおりの所は、細かくなった面の高さから作り直す（間隔は粗い格子の 1 マス）。それ以外は平均を長さ 1 に
    const inv = 1 / CELL;
    for (let J = 0; J < M; J++) for (let I = 0; I < M; I++) {
      const f = J * M + I, f3 = f * 3;
      if (I > 0 && J > 0 && I < M - 1 && J < M - 1 && fReg[f] && fReg[f - 1] && fReg[f + 1] && fReg[f - M] && fReg[f + M]) {
        const gx = (fPos[(f + 1) * 3 + 1] - fPos[(f - 1) * 3 + 1]) * inv, gz = (fPos[(f + M) * 3 + 1] - fPos[(f - M) * 3 + 1]) * inv;
        const n = 1 / Math.sqrt(gx * gx + 1 + gz * gz);
        fNor[f3] = -gx * n; fNor[f3 + 1] = n; fNor[f3 + 2] = -gz * n;
      } else {
        const l = Math.hypot(fNor[f3], fNor[f3 + 1], fNor[f3 + 2]);
        if (l > 1e-6) { fNor[f3] /= l; fNor[f3 + 1] /= l; fNor[f3 + 2] /= l; } else { fNor[f3] = 0; fNor[f3 + 1] = 1; fNor[f3 + 2] = 0; }
      }
    }
    aPos.needsUpdate = true; aNor.needsUpdate = true; aCol.needsUpdate = true; aSurf.needsUpdate = true; aUv.needsUpdate = true;
  }

  let seen = -1, ms = 0, frame = 0, pending = false;
  // force=true で必ず作り直す。普段は hero の頂点が変わった時だけ、それも 2 フレームに 1 回（30Hz で十分なめらか、CPU は半分）
  function update(force) {
    frame++;
    const v = A.position.version + A.color.version * 7 + A.aSurf.version * 13;
    if (v !== seen) { seen = v; pending = true; }
    if (!pending || (!force && (frame & 1))) return;
    pending = false;
    const t0 = performance.now();
    fill();
    ms = ms * 0.9 + (performance.now() - t0) * 0.1;
  }
  update(true);

  return {
    mesh, update,
    get ms() { return ms; },
    onContextRestored() { aPos.needsUpdate = true; aNor.needsUpdate = true; aCol.needsUpdate = true; aSurf.needsUpdate = true; aUv.needsUpdate = true; },
    dispose() { mesh.removeFromParent(); geo.dispose(); mound.visible = true; },
  };
}
