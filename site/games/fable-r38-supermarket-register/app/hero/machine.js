// スキャナーとベルト（パラメータから作る）。
// ベルトは「送り量 s」1つで、帯のテクスチャ・矢印の印・ローラーの回転を全部そろえる（商品の x も同じ s を使う）。
import { mergeGeos, polyBuilder, mat4, smoothstep } from './geo.js';

export const BELT_MARK_COUNT = 4;

export function createMachine(THREE, { layout: L, texture, atlas, detail }) {
  const group = new THREE.Group();
  group.name = 'machine';
  const geos = [], mats = [];
  const G = (g) => { geos.push(g); return g; };
  const M = (m) => { mats.push(m); return m; };
  const hex = (h) => { const c = new THREE.Color(h); return [c.r, c.g, c.b]; };

  // =====================================================================
  // スキャナー：枠（角を落とした台）＋暗い光沢のガラス＋レーザー線3本（±25°, 0°）＋奥の柱とランプ
  // =====================================================================
  const SC = L.scanner.center, sw = L.scanner.size[0], sd = L.scanner.size[1];
  const FRAME_W = 0.015, THICK = 0.02, GLASS_Y = 0.0165;
  const scanner = new THREE.Group();
  scanner.position.set(SC[0], SC[1], SC[2]);
  scanner.name = 'scanner';

  const cDark = hex(0x3b4049), cMetal = hex(0xc4cad1), cTower = hex(0x4c535d), cTrim = hex(0x7fd0c0);
  const ow = sw + FRAME_W * 2, od = sd + FRAME_W * 2;
  const bodyParts = [
    { geo: new THREE.BoxGeometry(ow + 0.02, 0.012, od + 0.02), matrix: mat4(THREE, 0, 0.006, 0), color: cDark },
    { geo: new THREE.BoxGeometry(ow, THICK - 0.012, FRAME_W), matrix: mat4(THREE, 0, 0.016, sd / 2 + FRAME_W / 2), color: cMetal },
    { geo: new THREE.BoxGeometry(ow, THICK - 0.012, FRAME_W), matrix: mat4(THREE, 0, 0.016, -sd / 2 - FRAME_W / 2), color: cMetal },
    { geo: new THREE.BoxGeometry(FRAME_W, THICK - 0.012, sd), matrix: mat4(THREE, sw / 2 + FRAME_W / 2, 0.016, 0), color: cMetal },
    { geo: new THREE.BoxGeometry(FRAME_W, THICK - 0.012, sd), matrix: mat4(THREE, -sw / 2 - FRAME_W / 2, 0.016, 0), color: cMetal },
    // 奥の柱（少し前に傾ける）と、上の丸み
    { geo: new THREE.BoxGeometry(sw * 0.74, 0.125, 0.04), matrix: mat4(THREE, 0, 0.062, -sd / 2 - FRAME_W - 0.03, 0.12, 0, 0), color: cTower },
    { geo: new THREE.CylinderGeometry(0.02, 0.02, sw * 0.74, Math.max(8, Math.round(12 * detail)), 1, false, 0, Math.PI), matrix: mat4(THREE, 0, 0.124, -sd / 2 - FRAME_W - 0.0225, 0.12, 0, Math.PI / 2), color: cTower },
    { geo: new THREE.BoxGeometry(sw * 0.74 + 0.006, 0.008, 0.046), matrix: mat4(THREE, 0, 0.012, -sd / 2 - FRAME_W - 0.03), color: cTrim },
  ];
  const scanBody = new THREE.Mesh(G(mergeGeos(THREE, bodyParts)), M(new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.45, metalness: 0.25 })));
  scanner.add(scanBody);

  const glassMat = M(new THREE.MeshStandardMaterial({ color: 0x141c26, roughness: 0.12, metalness: 0.35, emissive: 0xff2a2a, emissiveIntensity: 0.03 }));
  const glass = new THREE.Mesh(G(mergeGeos(THREE, [
    { geo: new THREE.BoxGeometry(sw, 0.003, sd), matrix: mat4(THREE, 0, GLASS_Y - 0.0015, 0) },
    { geo: new THREE.PlaneGeometry(sw * 0.56, 0.062), matrix: mat4(THREE, 0, 0.066, -sd / 2 - FRAME_W - 0.0085, 0.12, 0, 0) },
  ])), glassMat);
  scanner.add(glass);

  // レーザー線（emissive の細い板）
  const laserMat = M(new THREE.MeshBasicMaterial({ color: 0xff3b3b, toneMapped: false }));
  const laserParts = [];
  for (const deg of [-25, 0, 25]) {
    const len = deg === 0 ? sw * 0.9 : Math.min(sw * 0.9 / Math.cos(deg * Math.PI / 180), sd * 0.9 / Math.abs(Math.sin(deg * Math.PI / 180)));
    laserParts.push({ geo: new THREE.BoxGeometry(len, 0.0012, 0.0055), matrix: mat4(THREE, 0, GLASS_Y + 0.0008, 0, 0, deg * Math.PI / 180, 0) });
  }
  const lasers = new THREE.Mesh(G(mergeGeos(THREE, laserParts)), laserMat);
  scanner.add(lasers);

  // ランプ（ピッで緑に光る）
  const lampMat = M(new THREE.MeshBasicMaterial({ color: 0x6a2626, toneMapped: false }));
  const lamp = new THREE.Mesh(G(new THREE.SphereGeometry(0.014, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2).rotateX(Math.PI / 2 + 0.12)), lampMat);
  lamp.position.set(sw * 0.26, 0.108, -sd / 2 - FRAME_W - 0.0105);
  scanner.add(lamp);

  // 光のかたまりと輪（加算。光っている間だけ描く）
  const planeGeo = G(new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2));
  function fxPlane(rect, color) {
    const g = G(planeGeo.clone());
    const uv = g.attributes.uv;
    for (let i = 0; i < uv.count; i++) uv.setXY(i, rect[0] + (rect[2] - rect[0]) * uv.getX(i), rect[1] + (rect[3] - rect[1]) * uv.getY(i));
    const m = M(new THREE.MeshBasicMaterial({ map: atlas.texture, color, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }));
    const mesh = new THREE.Mesh(g, m);
    mesh.visible = false;
    mesh.renderOrder = 3;
    return mesh;
  }
  const glow = fxPlane(atlas.rects.blob, 0xff5a4a);
  glow.position.y = GLASS_Y + 0.006;
  const ring = fxPlane(atlas.rects.ring, 0xffd0c0);
  ring.position.y = GLASS_Y + 0.008;
  scanner.add(glow, ring);

  // 当たり判定（指の太さ分 大きめ）
  const proxyMat = M(new THREE.MeshBasicMaterial({ visible: false }));
  const scanProxy = new THREE.Mesh(G(new THREE.BoxGeometry(sw + 0.07, 0.07, sd + 0.07)), proxyMat);
  scanProxy.position.y = 0.035;
  scanProxy.userData.heroTarget = { kind: 'scanner' };
  scanner.add(scanProxy);
  group.add(scanner);

  let flashT = 10;      // ピッからの秒
  let flashAmp = 0;
  let lampGreen = 0;
  function flash(amp = 1) { flashT = 0; flashAmp = amp; lampGreen = 1; }

  const cA = new THREE.Color(), cB = new THREE.Color();
  function updateScanner(dt, time, hint, near) {
    flashT += dt;
    const I = flashAmp * Math.exp(-flashT / 0.12);          // I(t) = I0·exp(−t/0.12)
    const pulse = hint ? 0.5 + 0.5 * Math.sin(time * Math.PI * 2 * 1.3) : 0;
    const idle = 0.5 + 0.5 * Math.sin(time * 2.1);
    glassMat.emissiveIntensity = 0.02 + 0.02 * idle + 0.16 * pulse + 0.22 * near + 1.5 * I;
    const lz = 0.42 + 0.12 * idle + 0.45 * pulse + 0.35 * near + 1.2 * I;
    laserMat.color.setRGB(Math.min(1.6, lz * 1.05), Math.min(1, 0.16 * lz + 0.8 * I), Math.min(1, 0.14 * lz + 0.6 * I));
    // 合図のあいだ、レーザー線が少しふくらむ（ここだよ）
    const ls = 1 + 0.05 * pulse + 0.10 * I;
    lasers.scale.set(ls, 1, ls);
    // 光のかたまり
    const g = Math.min(1, 0.85 * I + 0.30 * pulse + 0.28 * near);
    glow.visible = g > 0.01;
    if (glow.visible) {
      glow.material.opacity = g;
      const s = 1 + 0.5 * (1 - Math.exp(-flashT / 0.12)) * (I > 0.01 ? 1 : 0) + 0.08 * pulse;
      glow.scale.set((sw + 0.16) * s, 1, (sd + 0.16) * s);
    }
    // 輪：ピッのたびに広がって消える
    const u = flashT / 0.34;
    ring.visible = u < 1 && flashAmp > 0;
    if (ring.visible) {
      const e = 1 - (1 - u) * (1 - u);
      ring.material.opacity = 0.85 * (1 - u) * flashAmp;
      ring.scale.set((sw + 0.02) * (0.6 + 1.3 * e), 1, (sd + 0.02) * (0.6 + 1.3 * e));
    }
    // ランプ：赤（待ち）→ 緑（ピッ）
    lampGreen = Math.max(0, lampGreen - dt / 0.55);
    cA.setRGB(0.42 + 0.3 * pulse, 0.12, 0.12);
    cB.setRGB(0.35, 1.0, 0.5);
    lampMat.color.copy(cA).lerp(cB, Math.min(1, lampGreen * 1.6));
  }

  // =====================================================================
  // ベルト：帯（上面＋両端はローラーの半円で巻き込む）、側板、ローラーの軸のふた、進む向きの印
  // =====================================================================
  const B = L.belt;
  const beltLen = B.x1 - B.x0;
  const RR = Math.max(0.008, B.topY / 2);          // ローラー半径（天板の上に乗る厚み＝上面の高さ）
  const bw = B.width;
  const TEX_LAMBDA = bw;                            // 帯のテクスチャ1枚ぶんの長さ（正方形の画素になる）
  const texBelt = texture('assets/conveyor_belt.jpg', { wrap: 'repeat' });

  // 帯の断面（x,y）を一周：上面 → 右の半円 → 下面 → 左の半円。uv.x = 道のり / TEX_LAMBDA
  const arcN = Math.max(4, Math.round(8 * detail));
  const path = [];
  let dist = 0;
  const pushPt = (x, y, nx, ny, d) => path.push({ x, y, nx, ny, d });
  pushPt(B.x0, B.topY, 0, 1, 0);
  dist = beltLen; pushPt(B.x1, B.topY, 0, 1, dist);
  for (let i = 1; i <= arcN; i++) {
    const a = (i / arcN) * Math.PI;
    pushPt(B.x1 + RR * Math.sin(a), B.topY - RR + RR * Math.cos(a), Math.sin(a), Math.cos(a), dist + RR * a);
  }
  dist += RR * Math.PI;
  pushPt(B.x0, B.topY - 2 * RR, 0, -1, dist + beltLen);
  dist += beltLen;
  for (let i = 1; i <= arcN; i++) {
    const a = (i / arcN) * Math.PI;
    pushPt(B.x0 - RR * Math.sin(a), B.topY - RR - RR * Math.cos(a), -Math.sin(a), -Math.cos(a), dist + RR * a);
  }
  {
    const n = path.length;
    const pos = new Float32Array(n * 2 * 3), nor = new Float32Array(n * 2 * 3), uv = new Float32Array(n * 2 * 2);
    for (let i = 0; i < n; i++) {
      const p = path[i];
      for (let k = 0; k < 2; k++) {
        const o = i * 2 + k;
        pos[o * 3] = p.x; pos[o * 3 + 1] = p.y; pos[o * 3 + 2] = B.z + (k ? -bw / 2 : bw / 2);
        nor[o * 3] = p.nx; nor[o * 3 + 1] = p.ny; nor[o * 3 + 2] = 0;
        uv[o * 2] = p.d / TEX_LAMBDA; uv[o * 2 + 1] = k;
      }
    }
    const idx = [];
    for (let i = 0; i < n - 1; i++) {
      const a = i * 2, b = a + 1, c = a + 2, d = a + 3;
      idx.push(a, c, b, b, c, d);
    }
    const g = G(new THREE.BufferGeometry());
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
    g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    g.setIndex(idx);
    const beltMat = M(new THREE.MeshStandardMaterial({ map: texBelt, roughness: 0.88, metalness: 0 }));
    beltMat.color.setScalar(1.25);
    const band = new THREE.Mesh(g, beltMat);
    band.name = 'belt';
    group.add(band);
  }

  // 側板（高さ 0.025＋上面より少し上）と端のガード
  const railH = B.topY + 0.012, railT = 0.014;
  const cRail = hex(0xd3d8de), cRailDark = hex(0x8d96a1), cBed = hex(0x2a2d32);
  const xm = (B.x0 + B.x1) / 2;
  const frameParts = [
    { geo: new THREE.BoxGeometry(beltLen + RR * 2 + 0.012, railH, railT), matrix: mat4(THREE, xm, railH / 2, B.z + bw / 2 + railT / 2 + 0.002), color: cRail },
    { geo: new THREE.BoxGeometry(beltLen + RR * 2 + 0.012, railH, railT), matrix: mat4(THREE, xm, railH / 2, B.z - bw / 2 - railT / 2 - 0.002), color: cRail },
    { geo: new THREE.BoxGeometry(beltLen + RR * 2 + 0.012, 0.006, railT + 0.006), matrix: mat4(THREE, xm, railH + 0.002, B.z + bw / 2 + railT / 2 + 0.002), color: cRailDark },
    { geo: new THREE.BoxGeometry(beltLen + RR * 2 + 0.012, 0.006, railT + 0.006), matrix: mat4(THREE, xm, railH + 0.002, B.z - bw / 2 - railT / 2 - 0.002), color: cRailDark },
    { geo: new THREE.BoxGeometry(beltLen - 0.01, B.topY - 0.006, bw - 0.01), matrix: mat4(THREE, xm, (B.topY - 0.006) / 2, B.z), color: cBed },
  ];
  group.add(new THREE.Mesh(G(mergeGeos(THREE, frameParts)), M(new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.4, metalness: 0.35 }))));

  // ローラーの軸のふた（手前の側板に2つ。点の印が回って「動いている」と分かる）
  const hubGeo = G(mergeGeos(THREE, [
    { geo: new THREE.CylinderGeometry(0.0125, 0.0125, 0.004, Math.max(8, Math.round(14 * detail))), matrix: mat4(THREE, 0, 0, 0, Math.PI / 2, 0, 0), color: hex(0x4a515b) },
    { geo: new THREE.CylinderGeometry(0.0038, 0.0038, 0.006, 8), matrix: mat4(THREE, 0.0068, 0, 0, Math.PI / 2, 0, 0), color: hex(0xffd84d) },
    { geo: new THREE.CylinderGeometry(0.0025, 0.0025, 0.006, 6), matrix: mat4(THREE, -0.0068, 0, 0, Math.PI / 2, 0, 0), color: hex(0xf2f2f2) },
  ]));
  const hubs = new THREE.InstancedMesh(hubGeo, M(new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.5, metalness: 0.2 })), 2);
  hubs.frustumCulled = false;
  group.add(hubs);

  // 進む向きの印（＞の形）。上面を s といっしょに流れ、端で細くなって巻き込まれる
  const MARK_P = beltLen / BELT_MARK_COUNT;
  const mk = polyBuilder(THREE);
  {
    const d = 0.05, hw = bw * 0.29, t = 0.02;
    mk.quad([-d / 2 - t / 2, 0, hw], [-d / 2 + t / 2, 0, hw], [d / 2 + t / 2, 0, 0], [d / 2 - t / 2, 0, 0]);
    mk.quad([-d / 2 + t / 2, 0, -hw], [-d / 2 - t / 2, 0, -hw], [d / 2 - t / 2, 0, 0], [d / 2 + t / 2, 0, 0]);
  }
  const markGeo = G(mk.build());
  const marks = new THREE.InstancedMesh(markGeo, M(new THREE.MeshBasicMaterial({ color: 0xe8cf7a, toneMapped: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2, side: THREE.DoubleSide })), BELT_MARK_COUNT);
  marks.frustumCulled = false;
  group.add(marks);

  const m4 = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const zAxis = new THREE.Vector3(0, 0, 1);
  const vPos = new THREE.Vector3(), vScale = new THREE.Vector3();
  let lastS = NaN;
  // s：送り量（m）。帯のテクスチャ、印、軸のふたを同じ s で動かす
  function setBelt(s) {
    if (s === lastS) return;
    lastS = s;
    const f = (s / TEX_LAMBDA) % 1;
    texBelt.offset.x = -f;
    for (let i = 0; i < BELT_MARK_COUNT; i++) {
      let xi = (s + i * MARK_P) % beltLen;
      if (xi < 0) xi += beltLen;
      const k = smoothstep(0, 0.04, xi) * smoothstep(0, 0.04, beltLen - xi);
      vPos.set(B.x0 + xi, B.topY + 0.0006, B.z);
      vScale.set(Math.max(0.001, k), 1, 1);
      q.identity();
      m4.compose(vPos, q, vScale);
      marks.setMatrixAt(i, m4);
    }
    marks.instanceMatrix.needsUpdate = true;
    const ang = -(s / RR) % (Math.PI * 2);
    q.setFromAxisAngle(zAxis, ang);
    vScale.set(1, 1, 1);
    for (let i = 0; i < 2; i++) {
      vPos.set(i ? B.x1 : B.x0, B.topY - RR, B.z + bw / 2 + railT + 0.0045);
      m4.compose(vPos, q, vScale);
      hubs.setMatrixAt(i, m4);
    }
    hubs.instanceMatrix.needsUpdate = true;
  }
  setBelt(0);

  function dispose() {
    for (const g of geos) g.dispose();
    for (const m of mats) m.dispose();
    marks.dispose(); hubs.dispose();
  }

  return {
    group, scanProxy, flash, updateScanner, setBelt, dispose,
    glassY: SC[1] + GLASS_Y, beltLen, rollerR: RR,
  };
}
