// 紙袋：1枚のメッシュ（側面＋底を1つの BufferGeometry）の頂点変形だけで形を変える。布の物理は使わない。
//
// 形の決め方（頂点ごと。q＝空の袋での位置、n＝その外向きの水平な法線、v＝高さ 0..1）：
//   1) 全体のふくらみ   R(v) = 1 + SWELL·f·sin(πv)^0.7（中身の高さより上では弱める）  f＝満ち具合
//   2) 口のすぼみ       空のとき奥行きを 0.78 倍、入るほど開く。商品が飛んで来る間は大きく開ける（ぱくっ）
//   3) まち（横の折り目） 空のとき横の面の真ん中が内へ折れ、入るほど伸びる
//   4) 持ち上げ         持ち手が寄るので口の真ん中がつままれ、角が下がる。重いほど底が下がる
//   5) 中身の出っ張り   中身の「かたまりの球」(中心 c, 半径 r) ごとに、紙がその球の外へ出るように
//                        d = max(0, r + pad − (p−c)·n) · exp(−|横ずれ|²/σ²) を n 方向へ（丸い物は pad 大＝ぽこっ、箱は角ばった減り方）
//      そのあと、中身の外形（球・箱・カプセル）＋すき間の内側に残った頂点を、n 方向の出口まで動かす（突き抜け防止）
//   6) 目標の形へ、頂点ごとのバネ x'' = k(x_目標 − x) − c·x' で寄せる（上ほど柔らかい → ぽよんと行き過ぎて戻る）。
//      バネは減衰振動の厳密な式で進めるので、dt が大きくても発散しない。
// 中身の置き場所は「上から落として、いちばん低く収まる所」を球どうしの式で選ぶ（どの順でも重ならない）。
import { clamp, smoothstep, lerp, tubeGeo } from './geo.js';

const SPRING_K = 170, SPRING_C = 11;   // 仕様の k=160, c=12 を出発点に、上の輪ほど k を小さく
const SWELL = 0.14;                    // 全体のふくらみの大きさ（仕様の 0.18 から少し下げ、そのぶん中身の出っ張りを大きく）
const PAPER_FILL = 0.27;               // 中身の体積（箱の体積）÷(袋の容積×これ) = 満ち具合 f
// 袋は天板より下の袋置き場に立つので、底に置いた物は固定カメラから見えない。
// 中身は「上げ底」の高さから積む（紙は不透明なので底は見えない）→ 入れた物が口からのぞき、口の形が変わる。
// 上げ底は中身が増えるほど下がる（入れるたびに、前の中身が少し沈む＝重くなった）。
const FLOOR_TOP = 0.15, FLOOR_STEP = 0.012, FLOOR_MIN = 0.02;
const floorFor = (n) => (n <= 5 ? FLOOR_TOP - FLOOR_STEP * (n - 1) : Math.max(FLOOR_MIN, FLOOR_TOP - FLOOR_STEP * 4 - 0.035 * (n - 5)));
const MAX_SWING = 0.62;                // 揺れ角の上限 (rad)
const HULL_MARGIN = 0.013;             // 紙と中身の外形のあいだに必ず空けるすき間 (m)

export function createBagKit(THREE, { size, detail, texPaper }) {
  const W = size[0], H = size[1], D = size[2];
  const NT = Math.max(20, Math.round(60 * detail / 4) * 4);   // 周方向（仕様の 40 から増やして、出っ張りの輪郭をなめらかに）
  const NH = Math.max(10, Math.round(28 * detail));           // 高さ方向（仕様の 20 から）
  const NB = 3;
  const CR = 0.028;
  const HANDLE_H = 0.058;
  const GRIP_H = H + HANDLE_H;
  const cols = NT + 1, rings = NH + 1;
  const nSim = NT * rings;
  const nSide = cols * rings;
  const nBottom = NB * NT + 1;
  const nVert = nSide + nBottom;

  // ---- 角丸の四角を道のりで等分（面の真ん中にも頂点が均等に並ぶ） ----
  const sa = W - 2 * CR, sb = D - 2 * CR, arc = Math.PI * CR / 2;
  const PER = 2 * sa + 2 * sb + 4 * arc;
  function ringPoint(s, out) {
    let t = ((s % PER) + PER) % PER;
    const seg = [sb / 2, arc, sa, arc, sb, arc, sa, arc, sb / 2];
    let k = 0;
    while (k < 8 && t > seg[k]) { t -= seg[k]; k++; }
    const hx = sa / 2, hz = sb / 2;
    let x, z, nx, nz, ph;
    switch (k) {
      case 0: x = W / 2; z = t; nx = 1; nz = 0; break;
      case 1: ph = t / CR; x = hx + CR * Math.cos(ph); z = hz + CR * Math.sin(ph); nx = Math.cos(ph); nz = Math.sin(ph); break;
      case 2: x = hx - t; z = D / 2; nx = 0; nz = 1; break;
      case 3: ph = Math.PI / 2 + t / CR; x = -hx + CR * Math.cos(ph); z = hz + CR * Math.sin(ph); nx = Math.cos(ph); nz = Math.sin(ph); break;
      case 4: x = -W / 2; z = hz - t; nx = -1; nz = 0; break;
      case 5: ph = Math.PI + t / CR; x = -hx + CR * Math.cos(ph); z = -hz + CR * Math.sin(ph); nx = Math.cos(ph); nz = Math.sin(ph); break;
      case 6: x = -hx + t; z = -D / 2; nx = 0; nz = -1; break;
      case 7: ph = Math.PI * 1.5 + t / CR; x = hx + CR * Math.cos(ph); z = -hz + CR * Math.sin(ph); nx = Math.cos(ph); nz = Math.sin(ph); break;
      default: x = W / 2; z = -hz + t; nx = 1; nz = 0; break;
    }
    out.x = x; out.z = z; out.nx = nx; out.nz = nz;
    return out;
  }
  const cx = new Float32Array(NT), cz = new Float32Array(NT), cnx = new Float32Array(NT), cnz = new Float32Array(NT);
  const sideW = new Float32Array(NT), pinchW = new Float32Array(NT), riseW = new Float32Array(NT), cornerShade = new Float32Array(NT);
  {
    const o = {};
    for (let i = 0; i < NT; i++) {
      ringPoint((i / NT) * PER, o);
      cx[i] = o.x; cz[i] = o.z; cnx[i] = o.nx; cnz[i] = o.nz;
      const zn = clamp(o.z / (D / 2), -1, 1);
      sideW[i] = o.nx * o.nx * (1 - zn * zn);
      pinchW[i] = Math.exp(-Math.pow(o.x / 0.125, 2));
      riseW[i] = 0.012 * Math.exp(-Math.pow(o.x / 0.10, 2)) - 0.010 * Math.pow(o.x / (W / 2), 2);
      const corner = Math.abs(o.nx) > 0.05 && Math.abs(o.nz) > 0.05 ? 1 : 0;
      cornerShade[i] = 1 - 0.07 * corner - 0.06 * Math.pow(sideW[i], 6);
    }
  }
  const iFront = Math.round(((sb / 2 + arc + sa / 2) / PER) * NT) % NT;
  const iBack = Math.round(((sb / 2 + arc + sa + arc + sb + arc + sa / 2) / PER) * NT) % NT;

  // ---- 共有するもの：紙のマテリアル（外＝紙、内側＝暗く）、持ち手の形、uv・色・index の元 ----
  const paperMat = new THREE.MeshStandardMaterial({ map: texPaper, roughness: 0.93, metalness: 0, side: THREE.DoubleSide, vertexColors: true });
  // 裏（袋の内側）だけ、頂点色のアルファ分 暗くする。pow / normalize は使わない
  paperMat.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <color_fragment>',
      '#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )\n\tdiffuseColor.rgb *= vColor.rgb * ( gl_FrontFacing ? 1.0 : vColor.a );\n#endif',
    );
  };
  paperMat.customProgramCacheKey = () => 'r38-paper-bag';

  const handleGeo = tubeGeo(THREE, {
    n: Math.max(8, Math.round(14 * detail)), m: 6, up: [0, 0, 1],
    center: (t) => [-0.052 * Math.cos(Math.PI * t), (HANDLE_H + 0.004) * Math.pow(Math.max(0, Math.sin(Math.PI * t)), 0.75) - 0.004, 0],
    radius: () => 0.008,
  });
  const proxyGeo = new THREE.BoxGeometry(W + 0.07, H + 0.15, D + 0.10);
  const proxyMat = new THREE.MeshBasicMaterial({ visible: false });

  const uvT = new Float32Array(nVert * 2);
  const colT = new Float32Array(nVert * 4);
  const idxT = new Uint16Array(NT * NH * 6 + (NB - 1) * NT * 6 + NT * 3);
  {
    for (let j = 0; j < rings; j++) {
      const v = j / NH;
      const band = 1 - 0.08 * (1 - smoothstep(0, 0.07, v)) - 0.05 * smoothstep(0.9, 0.93, v) * (1 - smoothstep(0.985, 1, v));
      for (let i = 0; i < cols; i++) {
        const k = j * cols + i;
        uvT[k * 2] = (i / NT) * 3; uvT[k * 2 + 1] = v * 1.05;
        const sh = band * cornerShade[i % NT];
        colT[k * 4] = sh; colT[k * 4 + 1] = sh; colT[k * 4 + 2] = sh;
        colT[k * 4 + 3] = lerp(0.26, 0.74, Math.pow(v, 1.3));
      }
    }
    for (let r = 0; r < NB; r++) {
      const rho = 1 - r / NB;
      for (let i = 0; i < NT; i++) {
        const k = nSide + r * NT + i;
        uvT[k * 2] = 0.5 + (cx[i] * rho) / W; uvT[k * 2 + 1] = 0.5 + (cz[i] * rho) / W;
        colT[k * 4] = 0.86; colT[k * 4 + 1] = 0.86; colT[k * 4 + 2] = 0.86; colT[k * 4 + 3] = 0.32;
      }
    }
    const kc = nSide + NB * NT;
    uvT[kc * 2] = 0.5; uvT[kc * 2 + 1] = 0.5;
    colT[kc * 4] = 0.86; colT[kc * 4 + 1] = 0.86; colT[kc * 4 + 2] = 0.86; colT[kc * 4 + 3] = 0.32;
    let o = 0;
    for (let j = 0; j < NH; j++) {
      for (let i = 0; i < NT; i++) {
        const a = j * cols + i, b = a + 1, c = a + cols, d = c + 1;
        idxT[o++] = a; idxT[o++] = c; idxT[o++] = b;
        idxT[o++] = b; idxT[o++] = c; idxT[o++] = d;
      }
    }
    for (let r = 0; r < NB - 1; r++) {
      for (let i = 0; i < NT; i++) {
        const i2 = (i + 1) % NT;
        const a = nSide + r * NT + i, b = nSide + r * NT + i2, c = nSide + (r + 1) * NT + i, d = nSide + (r + 1) * NT + i2;
        idxT[o++] = a; idxT[o++] = b; idxT[o++] = c;
        idxT[o++] = b; idxT[o++] = d; idxT[o++] = c;
      }
    }
    for (let i = 0; i < NT; i++) {
      const i2 = (i + 1) % NT;
      idxT[o++] = nSide + (NB - 1) * NT + i; idxT[o++] = nSide + (NB - 1) * NT + i2; idxT[o++] = kc;
    }
  }

  // 頂点ごとの元の明るさ（折り目・角・口の折り返し）
  const shadeT = new Float32Array(nSim);
  for (let j = 0; j < rings; j++) for (let i = 0; i < NT; i++) shadeT[j * NT + i] = colT[(j * cols + i) * 4];

  // 輪ごとの作業用（毎フレーム使い回す）
  const rSwell = new Float32Array(rings), rMouth = new Float32Array(rings), rGus = new Float32Array(rings), rLift = new Float32Array(rings);
  const rY = new Float32Array(rings), rSin = new Float32Array(rings), rV = new Float32Array(rings);
  const cA = new Float32Array(rings), cB = new Float32Array(rings), cC = new Float32Array(rings), cD = new Float32Array(rings);
  for (let j = 0; j < rings; j++) {
    const v = j / NH;
    rV[j] = v;
    rSin[j] = Math.pow(Math.max(Math.sin(Math.PI * v), 0), 0.7);
  }
  const eul = new THREE.Euler();
  const m4 = new THREE.Matrix4();
  const v3 = new THREE.Vector3();
  const MAXS = 8;

  // =====================================================================
  function makeBag() {
    const pivot = new THREE.Group();   // 原点＝持ち手の中心（吊り下げ点）
    pivot.name = 'bag';
    const swing = new THREE.Group();   // 振り子の揺れ
    const body = new THREE.Group();    // 原点＝袋の底の中心
    body.position.y = -GRIP_H;
    pivot.add(swing); swing.add(body);

    const pos = new Float32Array(nVert * 3), nor = new Float32Array(nVert * 3);
    const geo = new THREE.BufferGeometry();
    const posAttr = new THREE.BufferAttribute(pos, 3); posAttr.setUsage(THREE.DynamicDrawUsage);
    const norAttr = new THREE.BufferAttribute(nor, 3); norAttr.setUsage(THREE.DynamicDrawUsage);
    geo.setAttribute('position', posAttr);
    geo.setAttribute('normal', norAttr);
    geo.setAttribute('uv', new THREE.BufferAttribute(uvT.slice(), 2));
    const colA = colT.slice();
    const colAttr = new THREE.BufferAttribute(colA, 4); colAttr.setUsage(THREE.DynamicDrawUsage);
    geo.setAttribute('color', colAttr);
    geo.setIndex(new THREE.BufferAttribute(idxT.slice(), 1));
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, H / 2, 0), 0.5);
    const mesh = new THREE.Mesh(geo, paperMat);
    mesh.name = 'paperBag';
    mesh.frustumCulled = false;

    const handleMat = new THREE.MeshStandardMaterial({ color: 0xefe3c8, roughness: 0.8, emissive: 0xffb62e, emissiveIntensity: 0 });
    const handleF = new THREE.Mesh(handleGeo, handleMat);
    const handleB = new THREE.Mesh(handleGeo, handleMat);
    const contents = new THREE.Group();
    const proxy = new THREE.Mesh(proxyGeo, proxyMat);
    proxy.position.y = H / 2 + 0.055;
    proxy.userData.heroTarget = { kind: 'bag' };
    body.add(mesh, handleF, handleB, contents, proxy);

    // 頂点のバネの状態（今の位置・速さ・目標）
    const px = new Float32Array(nSim), py = new Float32Array(nSim), pz = new Float32Array(nSim);
    const vx = new Float32Array(nSim), vy = new Float32Array(nSim), vz = new Float32Array(nSim);
    const tx = new Float32Array(nSim), ty = new Float32Array(nSim), tz = new Float32Array(nSim);

    const bag = {
      pivot, swing, body, mesh, contents, proxy, handleMat, gripH: GRIP_H,
      items: [], entries: [], blobs: [], hulls: [], floor: FLOOR_TOP,
      count: 0, vol: 0, weight: 0, topY: 0,
      mode: 'rest',
      lift: 0, liftTarget: 0, gape: 0, gapeTarget: 0, appear: 1,
      phi: 0, phiV: 0, psi: 0, psiV: 0,
      jostle: 0, jostleV: 0,
      awake: true, dirty: true,
      last: { f: -1, open: -1, lift: -1, gape: -1, heavy: -1, nb: -1 },
      handleTilt: -0.2, handleTiltV: 0,
    };

    // ---- 置き場所：上から落として、いちばん低く収まる所（球どうしの式） ----
    // entries：入った順の中身。各 { K, n, sx,sy,sz,sr（向きを掛けた球）, x,z（固定）, y（積み直した高さ）, yNow（今の見た目の高さ）, ... }
    // 上げ底の高さは中身の数で下がる（1個目は口のすぐ下 → 増えるほど沈む）。新しい物が入るたびに、同じ順で積み直す。
    const entries = bag.entries;
    function dropY(en, upto) {
      let y = (en.K.pole ? 0 : bag.floor) - en.minBot;
      for (let e = 0; e < upto; e++) {
        const o = entries[e];
        for (let a = 0; a < o.n; a++) {
          const ox = o.x + o.sx[a], oy = o.y + o.sy[a], oz = o.z + o.sz[a], orr = o.sr[a];
          for (let s = 0; s < en.n; s++) {
            const dx = en.x + en.sx[s] - ox, dz = en.z + en.sz[s] - oz;
            const R = en.sr[s] + orr;
            const d2 = dx * dx + dz * dz;
            if (d2 < R * R) {
              const need = oy + Math.sqrt(Math.max(0, R * R - d2)) - en.sy[s];
              if (need > y) y = need;
            }
          }
        }
      }
      return y < en.yMin ? en.yMin : y;
    }
    function relayout(count) {
      bag.floor = floorFor(count);
      for (let e = 0; e < entries.length; e++) entries[e].y = dropY(entries[e], e);
    }
    function setPose(en, pose) {
      const S = en.K.spheres;
      en.n = Math.min(MAXS, S.length);
      eul.set(pose.r[0], pose.r[1], pose.r[2]);
      let minX = 1e9, maxX = -1e9, minZ = 1e9, maxZ = -1e9, maxTop = -1e9, minBot = 1e9;
      for (let s = 0; s < en.n; s++) {
        v3.set(S[s][0], S[s][1], S[s][2]).applyEuler(eul);
        en.sx[s] = v3.x; en.sy[s] = v3.y; en.sz[s] = v3.z; en.sr[s] = S[s][3];
        minX = Math.min(minX, v3.x - S[s][3]); maxX = Math.max(maxX, v3.x + S[s][3]);
        minZ = Math.min(minZ, v3.z - S[s][3]); maxZ = Math.max(maxZ, v3.z + S[s][3]);
        maxTop = Math.max(maxTop, v3.y + S[s][3]); minBot = Math.min(minBot, v3.y - S[s][3]);
      }
      en.minX = minX; en.maxX = maxX; en.minZ = minZ; en.maxZ = maxZ; en.maxTop = maxTop; en.minBot = minBot;
      en.yMin = en.K.pole ? H + en.K.out - maxTop : 0;
      en.rx = pose.r[0]; en.ry = pose.r[1]; en.rz = pose.r[2];
    }
    // en の向きは決まっている前提で、いちばん良い (x,z) を探す。score を返す
    function bestSpot(en, rnd) {
      const K = en.K, idx = entries.length;
      const ov = K.pole ? 0.03 : (K.shape === 'round' ? 0.024 : 0.006);   // 壁に少し食い込ませる（出っ張りになる）
      let x0 = -W / 2 - ov - en.minX, x1 = W / 2 + ov - en.maxX, z0 = -D / 2 - ov - en.minZ, z1 = D / 2 + ov - en.maxZ;
      if (x0 > x1) x0 = x1 = (x0 + x1) / 2;
      if (z0 > z1) z0 = z1 = (z0 + z1) / 2;
      const gx = x1 - x0 > 0.01 ? 5 : 1, gz = z1 - z0 > 0.01 ? 4 : 1;
      const zr = Math.max(1e-3, Math.max(Math.abs(z0), Math.abs(z1)));
      const xr = Math.max(1e-3, Math.max(Math.abs(x0), Math.abs(x1)));
      let best = 1e9, bx = 0, bz = 0, by = 0;
      for (let a = 0; a < gx; a++) {
        for (let b = 0; b < gz; b++) {
          en.x = gx > 1 ? x0 + (x1 - x0) * (a + 0.15 + 0.7 * rnd()) / gx : x0;
          en.z = gz > 1 ? z0 + (z1 - z0) * (b + 0.15 + 0.7 * rnd()) / gz : z0;
          const y = dropY(en, idx);
          // 低い所が先。固定カメラ（左手前の上）から見える「奥・右」を少し優先、丸い物は壁ぎわ・箱は中央
          const score = y + en.maxTop + (K.wall || 0) * (Math.abs(en.z) / zr) + 0.022 * (en.z / zr) - 0.02 * (en.x / xr) + rnd() * 0.006;
          if (score < best) { best = score; bx = en.x; bz = en.z; by = y; }
        }
      }
      en.x = bx; en.z = bz; en.y = by;
      return best;
    }
    // 商品の種類 K の置き場所を決めて予約する。戻り値 entry の x,y,z,rx,ry,rz が袋ローカルの置き場所（y は積み直しで変わる）
    function reserve(K, rnd) {
      relayout(entries.length + 1);
      const en = {
        K, n: 0, sx: new Float32Array(MAXS), sy: new Float32Array(MAXS), sz: new Float32Array(MAXS), sr: new Float32Array(MAXS),
        x: 0, y: 0, z: 0, yNow: 0, rx: 0, ry: 0, rz: 0, minX: 0, maxX: 0, minZ: 0, maxZ: 0, maxTop: 0, minBot: 0, yMin: 0,
        landed: false, obj: null,
      };
      let bestM = 1e9, bp = 0, bx = 0, by = 0, bz = 0;
      for (let p = 0; p < K.poses.length; p++) {
        setPose(en, K.poses[p]);
        bestSpot(en, rnd);
        let metric;
        if (K.pole) metric = (en.y - en.yMin) + rnd() * 0.03 + p * 0.002;
        else metric = en.y + en.maxTop <= H + 0.012 ? p * 0.001 : 1 + en.y + en.maxTop;
        if (metric < bestM) { bestM = metric; bp = p; bx = en.x; by = en.y; bz = en.z; }
      }
      setPose(en, K.poses[bp]);
      en.x = bx; en.y = by; en.z = bz; en.yNow = by;
      // 見た目だけの回り（球の並びがほぼ変わらない軸だけ）
      if (K.shape === 'round') { en.rx = rnd() * 6.28; en.ry = rnd() * 6.28; en.rz = rnd() * 6.28; }
      else if (bp === 0 && !K.pole) en.ry += K.size[0] > 0.15 ? (rnd() - 0.5) * 0.2 : Math.floor(rnd() * 4) * Math.PI / 2 + (rnd() - 0.5) * 0.3;
      entries.push(en);
      return en;
    }

    // 収まった中身（landed）から、出っ張りの球と、突き抜け防止の外形を作り直す
    function rebuildShapes() {
      const blobs = bag.blobs, hulls = bag.hulls;
      let nb = 0, nh = 0;
      bag.topY = 0;
      for (let e = 0; e < entries.length; e++) {
        const en = entries[e];
        if (!en.landed) continue;
        const K = en.K;
        for (let s = 0; s < en.n; s++) {
          const r = en.sr[s];
          const sg = r * (K.shape === 'round' ? 1.3 : 1.15);
          const q = blobs[nb] || (blobs[nb] = {});
          q.x = en.x + en.sx[s]; q.y = en.yNow + en.sy[s]; q.z = en.z + en.sz[s]; q.r = r; q.pad = K.pad;
          q.is2 = 1 / (sg * sg); q.box = !!K.box; q.reach = r + K.pad + sg * 2.6;
          if (q.y + r > bag.topY) bag.topY = q.y + r;
          nb++;
        }
        const hl = K.hull;
        if (hl) {
          m4.makeRotationFromEuler(eul.set(en.rx, en.ry, en.rz));
          const el = m4.elements;
          const h = hulls[nh] || (hulls[nh] = {});
          h.t = hl.t === 'sphere' ? 0 : hl.t === 'box' ? 1 : 2;
          h.cx = en.x; h.cy = en.yNow; h.cz = en.z;
          h.a11 = el[0]; h.a12 = el[1]; h.a13 = el[2]; h.a21 = el[4]; h.a22 = el[5]; h.a23 = el[6]; h.a31 = el[8]; h.a32 = el[9]; h.a33 = el[10];
          let br;
          if (h.t === 0) { h.ex = hl.r; h.ey = 0; h.ez = 0; br = hl.r; }
          else if (h.t === 1) { h.ex = hl.h[0]; h.ey = hl.h[1]; h.ez = hl.h[2]; br = Math.hypot(hl.h[0], hl.h[1], hl.h[2]); }
          else { h.ex = hl.a; h.ey = hl.r; h.ez = 0; br = hl.a + hl.r; }
          br += HULL_MARGIN + 0.002;
          h.br2 = br * br;
          nh++;
        }
      }
      blobs.length = nb; hulls.length = nh;
      bag.dirty = true;
    }

    // 袋に収まった：前からある中身は少し沈み、出っ張りを作り直し、紙をはじく。obj＝商品の Object3D（contents の子）
    function land(en, obj) {
      en.landed = true; en.obj = obj;
      for (let e = 0; e < entries.length; e++) if (entries[e].landed) entries[e].yNow = entries[e].y;
      rebuildShapes();
      const K = en.K;
      bag.count++; bag.vol += K.vol; bag.weight += K.weight;
      kick(0.20 + 0.34 * K.weight, 0.5 + 0.5 * K.weight);
      bag.jostleV += 0.5 + 0.5 * K.weight;
    }

    // 紙をはじく（外へふくらむ速さ out、口が下がる速さ down）
    function kick(out, down) {
      for (let j = 0; j < rings; j++) {
        const s = Math.sin(Math.PI * rV[j]);
        const o = out * (0.35 + 0.65 * s), dn = down * 0.22 * rV[j];
        for (let i = 0; i < NT; i++) {
          const k = j * NT + i;
          vx[k] += cnx[i] * o; vz[k] += cnz[i] * o * 1.2; vy[k] -= dn;
        }
      }
      bag.awake = true;
    }

    // 紙の頂点 (x,y,z) が中身の外形（＋すき間 HULL_MARGIN）の内側にあれば、n 方向へ外に出るまでの距離を返す。
    // 球・カプセルは「線と球」の式、箱は「線と箱」の式で、出口までの距離をそのまま求める（くり返し探索しない）。
    function hullPush(x, y, z, nx, nz) {
      const hulls = bag.hulls, nh = hulls.length;
      let t = 0;
      for (let pass = 0; pass < 2; pass++) {
        let moved = false;
        for (let i = 0; i < nh; i++) {
          const h = hulls[i];
          const dx = x + nx * t - h.cx, dy = y - h.cy, dz = z + nz * t - h.cz;
          if (dx * dx + dy * dy + dz * dz > h.br2) continue;
          let ex = 0;
          if (h.t === 1) {
            const l1 = dx * h.a11 + dy * h.a12 + dz * h.a13, l2 = dx * h.a21 + dy * h.a22 + dz * h.a23, l3 = dx * h.a31 + dy * h.a32 + dz * h.a33;
            const e1 = h.ex + HULL_MARGIN, e2 = h.ey + HULL_MARGIN, e3 = h.ez + HULL_MARGIN;
            if (Math.abs(l1) >= e1 || Math.abs(l2) >= e2 || Math.abs(l3) >= e3) continue;
            const d1 = nx * h.a11 + nz * h.a13, d2 = nx * h.a21 + nz * h.a23, d3 = nx * h.a31 + nz * h.a33;
            ex = 1e9;
            if (Math.abs(d1) > 1e-5) ex = Math.min(ex, ((d1 > 0 ? e1 : -e1) - l1) / d1);
            if (Math.abs(d2) > 1e-5) ex = Math.min(ex, ((d2 > 0 ? e2 : -e2) - l2) / d2);
            if (Math.abs(d3) > 1e-5) ex = Math.min(ex, ((d3 > 0 ? e3 : -e3) - l3) / d3);
            if (ex > 1e8) continue;
          } else {
            // 球：中心。カプセル：軸の上のいちばん近い点を中心にした球として解く
            let wx = dx, wy = dy, wz = dz, R = h.ex + HULL_MARGIN;
            if (h.t === 2) {
              const l1 = clamp(dx * h.a11 + dy * h.a12 + dz * h.a13, -h.ex, h.ex);
              wx -= h.a11 * l1; wy -= h.a12 * l1; wz -= h.a13 * l1;
              R = h.ey + HULL_MARGIN;
            }
            const w2 = wx * wx + wy * wy + wz * wz;
            if (w2 >= R * R) continue;
            const wn = wx * nx + wz * nz;
            ex = -wn + Math.sqrt(Math.max(0, wn * wn - (w2 - R * R)));
          }
          if (ex > 1e-5) { t += ex; moved = true; }
        }
        if (!moved) break;
      }
      return t > 0.13 ? 0.13 : t;
    }

    // ---- 目標の形 ----
    function computeTargets(f, open, lift, gape, heavy) {
      const mouth = lerp(lerp(0.78, 1.0, open), 1.07, gape);
      const gus = 0.046 * (1 - open) * (1 - gape) + 0.022 * lift;
      const hc = bag.topY / H;
      for (let j = 0; j < rings; j++) {
        const v = rV[j];
        rSwell[j] = SWELL * f * rSin[j] * (1 - 0.55 * smoothstep(hc, hc + 0.35, v));
        rMouth[j] = 1 - (1 - mouth) * smoothstep(0.4, 1, v);
        rGus[j] = gus * smoothstep(0.12, 1, v);
        rLift[j] = lift * smoothstep(0.5, 1, v);
        rY[j] = v * H - lift * heavy * 0.012 * (1 - v);
      }
      const limX = W / 2 + 0.06 + lift * 0.3, limZ = D / 2 + 0.058 + lift * 0.3;
      const blobs = bag.blobs, nb = blobs.length, nh = bag.hulls.length;
      for (let j = 0; j < rings; j++) {
        const xs = 1 + rSwell[j], zs = (1 + rSwell[j] * 1.25) * rMouth[j];
        const gr = rGus[j], lr2 = rLift[j], y0 = rY[j];
        for (let i = 0; i < NT; i++) {
          const k = j * NT + i;
          const nx = cnx[i], nz = cnz[i];
          let x = cx[i] * xs - (cx[i] > 0 ? gr : -gr) * sideW[i];
          let z = cz[i] * zs * (1 - lr2 * 0.72 * pinchW[i]);
          let y = y0 + lr2 * riseW[i];
          // 中身の出っ張り（なめらかな最大：3乗の和の立方根）。全体のふくらみで紙が離れたぶん(swn)は差し引かない＝ふくらんでも出っ張りは残る
          const swn = rSwell[j] * 0.85 * (Math.abs(cx[i] * nx) + 1.25 * Math.abs(cz[i] * nz));
          let acc = 0;
          for (let b = 0; b < nb; b++) {
            const q = blobs[b];
            const wy = y - q.y;
            if (wy > q.reach || wy < -q.reach) continue;
            const wx = x - q.x, wz = z - q.z;
            const depth = wx * nx + wz * nz - swn;
            const push = q.r + q.pad - depth;
            if (push <= 0) continue;
            let perp2 = (wx * wx + wy * wy + wz * wz - depth * depth) * q.is2;
            if (perp2 < 0) perp2 = 0;
            if (q.box) perp2 = perp2 * perp2;
            if (perp2 > 12) continue;
            const d = push * Math.exp(-perp2);
            acc += d * d * d;
          }
          let bump = 0;
          if (acc > 0) {
            bump = Math.min(0.11, Math.cbrt(acc));
            x += nx * bump; z += nz * bump;
          }
          if (nh > 0) {
            const d = hullPush(x, y, z, nx, nz);
            if (d > 0) { x += nx * d; z += nz * d; bump += d; }
          }
          // 出っ張りの頂は明るく、まわりは少し暗く（やわらかい光でも でこぼこが見える）
          const sh = shadeT[k] * (0.93 + 0.15 * smoothstep(0.002, 0.034, bump));
          const oc = (j * cols + i) * 4;
          colA[oc] = sh; colA[oc + 1] = sh; colA[oc + 2] = sh;
          if (i === 0) { const os = (j * cols + NT) * 4; colA[os] = sh; colA[os + 1] = sh; colA[os + 2] = sh; }
          tx[k] = clamp(x, -limX, limX); ty[k] = y; tz[k] = clamp(z, -limZ, limZ);
        }
      }
      colAttr.needsUpdate = true;
    }

    // ---- 位置・法線を形に書く ----
    function writeGeometry() {
      for (let j = 0; j < rings; j++) {
        const jm = j > 0 ? j - 1 : j, jp = j < NH ? j + 1 : j;
        for (let i = 0; i < NT; i++) {
          const k = j * NT + i;
          const o = (j * cols + i) * 3;
          pos[o] = px[k]; pos[o + 1] = py[k]; pos[o + 2] = pz[k];
          const il = j * NT + (i + NT - 1) % NT, ir = j * NT + (i + 1) % NT;
          const ku = jp * NT + i, kd = jm * NT + i;
          const sx = px[ir] - px[il], sy = py[ir] - py[il], sz = pz[ir] - pz[il];
          const ux = px[ku] - px[kd], uy = py[ku] - py[kd], uz = pz[ku] - pz[kd];
          // 外向き＝(上向きの接線) × (まわりの接線)
          let nx = uy * sz - uz * sy, ny = uz * sx - ux * sz, nz = ux * sy - uy * sx;
          const l = Math.sqrt(nx * nx + ny * ny + nz * nz);
          if (l > 1e-9) { nx /= l; ny /= l; nz /= l; } else { nx = cnx[i]; ny = 0; nz = cnz[i]; }
          nor[o] = nx; nor[o + 1] = ny; nor[o + 2] = nz;
        }
        // 継ぎ目（最後の列＝最初の列）
        const a = (j * cols) * 3, b = (j * cols + NT) * 3;
        pos[b] = pos[a]; pos[b + 1] = pos[a + 1]; pos[b + 2] = pos[a + 2];
        nor[b] = nor[a]; nor[b + 1] = nor[a + 1]; nor[b + 2] = nor[a + 2];
      }
      // 底：いちばん下の輪を中心へ縮めて作る（持ち上げると重さで少し下がる）
      let mx = 0, my = 0, mz = 0;
      for (let i = 0; i < NT; i++) { mx += px[i]; my += py[i]; mz += pz[i]; }
      mx /= NT; my /= NT; mz /= NT;
      const sag = bag.lift * (0.006 + 0.012 * Math.min(1, bag.weight / 2.5));
      for (let r = 0; r <= NB; r++) {
        const rho = 1 - r / NB;
        const dy = -sag * (1 - rho * rho);
        const slope = sag * 2 * rho / Math.max(0.05, Math.min(W, D) / 2);
        const cnt = r < NB ? NT : 1;
        for (let i = 0; i < cnt; i++) {
          const o = (nSide + r * NT + i) * 3;
          pos[o] = mx + (px[i] - mx) * rho; pos[o + 1] = my + (py[i] - my) * rho + dy; pos[o + 2] = mz + (pz[i] - mz) * rho;
          let nx = cnx[i] * slope * (r < NB ? 1 : 0), nz = cnz[i] * slope * (r < NB ? 1 : 0);
          const l = Math.sqrt(nx * nx + 1 + nz * nz);
          nor[o] = nx / l; nor[o + 1] = -1 / l; nor[o + 2] = nz / l;
        }
      }
      posAttr.needsUpdate = true; norAttr.needsUpdate = true;
    }

    function snap() {
      const st = shapeParams();
      computeTargets(st.f, st.open, bag.lift, bag.gape, st.heavy);
      px.set(tx); py.set(ty); pz.set(tz);
      vx.fill(0); vy.fill(0); vz.fill(0);
      writeGeometry();
      placeHandles(0, 0, false);
      bag.dirty = false; bag.awake = false;
      const L0 = bag.last; L0.f = st.f; L0.open = st.open; L0.lift = bag.lift; L0.gape = bag.gape; L0.heavy = st.heavy; L0.nb = bag.blobs.length;
    }

    const sp = { f: 0, open: 0, heavy: 0 };
    function shapeParams() {
      sp.f = clamp(bag.vol / (W * H * D * PAPER_FILL), 0, 1);
      sp.open = clamp(sp.f * 1.9, 0, 1);
      sp.heavy = Math.min(1, bag.weight / 2.2);
      return sp;
    }

    function placeHandles(time, hint, hinting) {
      const kf = NH * NT + iFront, kb = NH * NT + iBack;
      const wig = hinting ? 0.28 * Math.sin(time * Math.PI * 2 * 2.6) * hint : 0;
      const zf = Math.abs(pz[kf]), zb = Math.abs(pz[kb]);
      const tIn = bag.handleTilt;
      handleF.position.set(px[kf], py[kf] - 0.004, pz[kf]);
      handleB.position.set(px[kb], py[kb] - 0.004, pz[kb]);
      // 持ち上げると、2本の持ち手が真ん中で合う（tIn → asin(z/高さ)）
      const inF = Math.asin(clamp(zf / HANDLE_H, 0, 0.92)), inB = Math.asin(clamp(zb / HANDLE_H, 0, 0.92));
      handleF.rotation.x = -(lerp(tIn, inF, bag.lift)) + wig;
      handleB.rotation.x = lerp(tIn, inB, bag.lift) + wig;
      handleF.rotation.z = wig * 0.5; handleB.rotation.z = -wig * 0.5;
    }

    // ---- 毎フレーム：形のバネ。ax, az：持ち手の加速度（振り子用）。swingOn：揺らすか ----
    function update(dt, time, hintAmt, ax, az, swingOn) {
      if (dt > 0) {
        // 持ち上げ・口の開きはなめらかに
        const kl = 1 - Math.exp(-dt * 11), kg = 1 - Math.exp(-dt * 16);
        bag.lift += (bag.liftTarget - bag.lift) * kl;
        if (Math.abs(bag.liftTarget - bag.lift) < 1e-4) bag.lift = bag.liftTarget;
        bag.gape += (bag.gapeTarget - bag.gape) * kg;
        if (Math.abs(bag.gapeTarget - bag.gape) < 1e-4) bag.gape = bag.gapeTarget;
        // 現れる（ぽん）
        if (bag.appear < 1) {
          bag.appear = Math.min(1, bag.appear + dt / 0.28);
          const a = bag.appear - 1;
          body.scale.setScalar(Math.max(0.001, 1 + 2.70158 * a * a * a + 1.70158 * a * a));
          if (bag.appear >= 1) { body.scale.setScalar(1); kick(0.25, 0.3); }
        }
        // 振り子：φ'' = −(g/ℓ)·sinφ − c·φ' − a/ℓ（ℓ = 0.25 + 0.05·中身の数）
        if (swingOn) {
          const ell = 0.25 + 0.05 * Math.min(8, bag.count), c = 3;
          const phiV0 = bag.phiV, psiV0 = bag.psiV;
          const steps = dt > 0.02 ? 2 : 1, h = dt / steps;
          for (let s = 0; s < steps; s++) {
            bag.phiV += (-(9.8 / ell) * Math.sin(bag.phi) - c * bag.phiV - ax / ell) * h;
            bag.psiV += (-(9.8 / ell) * Math.sin(bag.psi) - c * bag.psiV + az / ell) * h;
            bag.phi = clamp(bag.phi + bag.phiV * h, -MAX_SWING, MAX_SWING);
            bag.psi = clamp(bag.psi + bag.psiV * h, -MAX_SWING, MAX_SWING);
            if (Math.abs(bag.phi) >= MAX_SWING) bag.phiV *= -0.3;
            if (Math.abs(bag.psi) >= MAX_SWING) bag.psiV *= -0.3;
          }
          // 揺れの角加速度ぶん、袋の下の方が遅れてついてくる（ぷるん）。頂点のバネに速さとして足す
          const aPhi = clamp((bag.phiV - phiV0) / dt, -40, 40), aPsi = clamp((bag.psiV - psiV0) / dt, -40, 40);
          if (Math.abs(aPhi) + Math.abs(aPsi) > 0.6) {
            const g = 0.22 * dt;
            for (let j = 0; j < rings; j++) {
              const d = (GRIP_H - rV[j] * H) * g;
              const ix = -aPhi * d, iz = aPsi * d;
              for (let i = 0; i < NT; i++) { const k = j * NT + i; vx[k] += ix; vz[k] += iz; }
            }
            bag.awake = true;
          }
        } else {
          const kd = Math.exp(-dt * 14);
          bag.phi *= kd; bag.psi *= kd; bag.phiV = 0; bag.psiV = 0;
        }
        swing.rotation.set(bag.psi, 0, bag.phi);
        // 中身のかたかた（落ちた時・下ろした時）
        bag.jostleV += (-260 * bag.jostle - 14 * bag.jostleV) * Math.min(dt, 0.03);
        bag.jostle += bag.jostleV * Math.min(dt, 0.03);
        contents.position.y = Math.max(-0.004, bag.jostle * 0.02);
        // 沈む中身を、今の高さへなめらかに
        const ks = 1 - Math.exp(-dt * 16);
        for (let e = 0; e < entries.length; e++) {
          const en = entries[e];
          if (en.landed && en.obj) en.obj.position.y += (en.yNow - en.obj.position.y) * ks;
        }
        // 持ち手の立ち方（置いてある時は少し外へ開く）
        const tt = -0.22;
        bag.handleTiltV += (120 * (tt - bag.handleTilt) - 9 * bag.handleTiltV) * Math.min(dt, 0.03);
        bag.handleTilt += bag.handleTiltV * Math.min(dt, 0.03);
      }
      handleMat.emissiveIntensity = hintAmt > 0 ? hintAmt * (0.55 + 0.45 * Math.sin(time * Math.PI * 2 * 1.3)) : 0;

      const st = shapeParams();
      const L0 = bag.last;
      const changed = bag.dirty || Math.abs(st.f - L0.f) > 1e-5 || Math.abs(st.open - L0.open) > 1e-5 || Math.abs(bag.lift - L0.lift) > 1e-5
        || Math.abs(bag.gape - L0.gape) > 1e-5 || Math.abs(st.heavy - L0.heavy) > 1e-5 || bag.blobs.length !== L0.nb;
      if (changed) {
        computeTargets(st.f, st.open, bag.lift, bag.gape, st.heavy);
        L0.f = st.f; L0.open = st.open; L0.lift = bag.lift; L0.gape = bag.gape; L0.heavy = st.heavy; L0.nb = bag.blobs.length;
        bag.dirty = false; bag.awake = true;
      }
      if (bag.awake && dt > 0) {
        // 減衰振動の厳密な一歩（輪ごとに係数を作る。上ほど柔らかい）
        const al = SPRING_C / 2;
        const ed = Math.exp(-al * dt);
        for (let j = 0; j < rings; j++) {
          const k = SPRING_K * (1 - 0.5 * rV[j]);
          const wd = Math.sqrt(Math.max(1, k - al * al));
          const co = Math.cos(wd * dt), si = Math.sin(wd * dt);
          cA[j] = ed * (co + (al / wd) * si); cB[j] = ed * (si / wd);
          cC[j] = -ed * (k / wd) * si; cD[j] = ed * (co - (al / wd) * si);
        }
        let energy = 0;
        for (let j = 0; j < rings; j++) {
          const A = cA[j], Bc = cB[j], C = cC[j], Dd = cD[j];
          for (let i = 0; i < NT; i++) {
            const k = j * NT + i;
            let d = px[k] - tx[k], w = vx[k];
            px[k] = tx[k] + A * d + Bc * w; vx[k] = C * d + Dd * w;
            energy += d * d + w * w * 0.004;
            d = py[k] - ty[k]; w = vy[k];
            py[k] = ty[k] + A * d + Bc * w; vy[k] = C * d + Dd * w;
            energy += d * d + w * w * 0.004;
            d = pz[k] - tz[k]; w = vz[k];
            pz[k] = tz[k] + A * d + Bc * w; vz[k] = C * d + Dd * w;
            energy += d * d + w * w * 0.004;
          }
        }
        if (!(energy === energy)) { px.set(tx); py.set(ty); pz.set(tz); vx.fill(0); vy.fill(0); vz.fill(0); energy = 0; } // NaN 防止
        if (energy < 2e-9 * nSim) { px.set(tx); py.set(ty); pz.set(tz); vx.fill(0); vy.fill(0); vz.fill(0); bag.awake = false; }
        writeGeometry();
      }
      placeHandles(time, hintAmt, hintAmt > 0);
    }

    function disposeOwn() {
      geo.dispose();
      handleMat.dispose();
    }

    bag.reserve = reserve; bag.land = land; bag.kick = kick; bag.update = update; bag.snap = snap; bag.disposeOwn = disposeOwn;
    snap();
    return bag;
  }

  function dispose() {
    paperMat.dispose(); handleGeo.dispose(); proxyGeo.dispose(); proxyMat.dispose();
  }

  return { makeBag, dispose, W, H, D, GRIP_H, trisPerBag: idxT.length / 3 };
}
