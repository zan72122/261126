// 周辺（shell）：光、遠景、床、カウンター、かご、袋置き場、花台、ハート、疑似影。
// 遠くの物は低ポリ＋写真風テクスチャ（≤512²）か板1枚。
import { mergeParts, mat } from './geo.js';

export function buildEnvironment(THREE, { layout, assets }) {
  const group = new THREE.Group();
  group.name = 'env';
  const L = layout;
  const geos = [];
  const mats = [];
  const keepG = (g) => { geos.push(g); return g; };
  const keepM = (m) => { mats.push(m); return m; };

  // ---- 光（影は使わない） ----
  const hemi = new THREE.HemisphereLight(0xfff8ee, 0x8f7f6c, 1.7);
  const sun = new THREE.DirectionalLight(0xffffff, 1.9);
  sun.position.set(1.0, 3.0, 2.4);
  group.add(hemi, sun);

  // ---- 遠景：店内の写真を板1枚（約4m先）。下側は床に隠れる ----
  const bgTex = assets.texture('assets/store_bg.jpg');
  // カウンターの奥の縁より下は見えないので、床との境目は隠れる。写真の上12%あたりが画面の上端に来る高さに置く。
  // 横長の画面でも端が切れないよう、横に少し伸ばしている（ぼけた写真なので目立たない）。
  // 動くカメラ（縦長・引いた構図）でも上の端が見えないよう、上へ高く伸ばしてある（上端 y=2.2）
  const bgW = 7.4, bgH = 4.7;
  const bg = new THREE.Mesh(keepG(new THREE.PlaneGeometry(bgW, bgH)),
    keepM(new THREE.MeshBasicMaterial({ map: bgTex, toneMapped: false })));
  bg.position.set(0.06, 2.2 - bgH / 2, -1.6);
  bg.name = 'backdrop';
  group.add(bg);

  // ---- 床：手続きのタイル（256²） ----
  const floorTex = assets.canvasTexture('floor', 256, 256, (g, w, h) => {
    g.fillStyle = '#efe6d6'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#e4d8c3'; g.fillRect(0, 0, w / 2, h / 2); g.fillRect(w / 2, h / 2, w / 2, h / 2);
    g.strokeStyle = '#d2c3aa'; g.lineWidth = 3; g.strokeRect(0, 0, w, h);
    g.beginPath(); g.moveTo(w / 2, 0); g.lineTo(w / 2, h); g.moveTo(0, h / 2); g.lineTo(w, h / 2); g.stroke();
  }, { wrap: 'repeat', repeat: [8, 6] });
  const floor = new THREE.Mesh(keepG(new THREE.PlaneGeometry(8, 6)),
    keepM(new THREE.MeshLambertMaterial({ map: floorTex })));
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0.2, L.floorY, -1.2);
  group.add(floor);

  // ---- カウンター天板（袋置き場の穴あき）：Extrude 1つ ----
  const C = L.counter;
  const W = L.bagWell;
  const wx0 = W.center[0] - W.size[0] / 2, wx1 = W.center[0] + W.size[0] / 2;
  const wz0 = W.center[2] - W.size[1] / 2, wz1 = W.center[2] + W.size[1] / 2;
  const shape = new THREE.Shape();
  // shape の y = −z（rotateX(−π/2) で z に戻る）
  shape.moveTo(C.x0, -C.zFront); shape.lineTo(C.x1, -C.zFront); shape.lineTo(C.x1, -C.zBack); shape.lineTo(C.x0, -C.zBack); shape.lineTo(C.x0, -C.zFront);
  const hole = new THREE.Path();
  hole.moveTo(wx0, -wz1); hole.lineTo(wx0, -wz0); hole.lineTo(wx1, -wz0); hole.lineTo(wx1, -wz1); hole.lineTo(wx0, -wz1);
  shape.holes.push(hole);
  const topGeo = keepG(new THREE.ExtrudeGeometry(shape, { depth: C.thickness, bevelEnabled: false }));
  topGeo.rotateX(-Math.PI / 2);
  topGeo.translate(0, -C.thickness, 0);
  const counterTex = assets.texture('assets/counter.jpg', { wrap: 'repeat', repeat: [1.4, 1.4] });
  const top = new THREE.Mesh(topGeo, keepM(new THREE.MeshStandardMaterial({ map: counterTex, roughness: 0.5, metalness: 0.15 })));
  top.name = 'counterTop';
  group.add(top);

  // 前面パネル（店員側）と、奥の面、帯。色だけ。
  const bodyGeo = keepG(mergeParts(THREE, [
    { geo: new THREE.BoxGeometry(C.x1 - C.x0, -L.floorY - C.thickness, 0.02), matrix: mat(THREE, (C.x0 + C.x1) / 2, (L.floorY - C.thickness) / 2, C.zFront - 0.01), color: 0xfff4e2 },
    { geo: new THREE.BoxGeometry(C.x1 - C.x0, 0.07, 0.025), matrix: mat(THREE, (C.x0 + C.x1) / 2, -0.12, C.zFront + 0.003), color: 0x5bbf7a },
    { geo: new THREE.BoxGeometry(C.x1 - C.x0, -L.floorY - C.thickness, 0.02), matrix: mat(THREE, (C.x0 + C.x1) / 2, (L.floorY - C.thickness) / 2, C.zBack + 0.01), color: 0xf2e6d2 },
    { geo: new THREE.BoxGeometry(0.02, -L.floorY - C.thickness, C.zFront - C.zBack), matrix: mat(THREE, C.x0 + 0.01, (L.floorY - C.thickness) / 2, (C.zFront + C.zBack) / 2), color: 0xf2e6d2 },
    { geo: new THREE.BoxGeometry(0.02, -L.floorY - C.thickness, C.zFront - C.zBack), matrix: mat(THREE, C.x1 - 0.01, (L.floorY - C.thickness) / 2, (C.zFront + C.zBack) / 2), color: 0xf2e6d2 },
    // 天板のふち（手前）
    { geo: new THREE.BoxGeometry(C.x1 - C.x0 + 0.01, 0.02, 0.03), matrix: mat(THREE, (C.x0 + C.x1) / 2, -0.01, C.zFront), color: 0xd9dde0 },
  ]));
  group.add(new THREE.Mesh(bodyGeo, keepM(new THREE.MeshLambertMaterial({ vertexColors: true }))));

  // 袋置き場：上が開いた箱の内側（BackSide）
  const wellDepth = -W.center[1] - C.thickness;
  const well = new THREE.Mesh(keepG(new THREE.BoxGeometry(W.size[0], wellDepth, W.size[1])),
    keepM(new THREE.MeshLambertMaterial({ color: 0xd8cdbd, side: THREE.BackSide })));
  well.position.set(W.center[0], W.center[1] + wellDepth / 2, W.center[2]);
  group.add(well);

  // ---- かご（shell が描く。中の商品は hero） ----
  const B = L.basket;
  const grid = assets.canvasTexture('basketGrid', 128, 128, (g, w, h) => {
    g.fillStyle = '#000'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#fff';
    const s = w / 4;
    for (let i = 0; i <= 4; i++) { g.fillRect(i * s - 6, 0, 12, h); g.fillRect(0, i * s - 6, w, 12); }
  }, { wrap: 'repeat', repeat: [5, 1.5], srgb: false });
  const bw = B.size[0] + 0.02, bh = B.size[1], bd = B.size[2] + 0.02;
  const basket = new THREE.Group();
  basket.name = 'basket';
  basket.position.set(B.center[0], B.center[1], B.center[2]);
  const wallMat = keepM(new THREE.MeshStandardMaterial({ color: 0xe9473f, roughness: 0.6, alphaMap: grid, alphaTest: 0.5, side: THREE.DoubleSide }));
  const walls = keepG(mergeParts(THREE, [
    { geo: new THREE.PlaneGeometry(bw, bh), matrix: mat(THREE, 0, bh / 2, bd / 2) },
    { geo: new THREE.PlaneGeometry(bw, bh), matrix: mat(THREE, 0, bh / 2, -bd / 2) },
    { geo: new THREE.PlaneGeometry(bd, bh), matrix: mat(THREE, bw / 2, bh / 2, 0, 0, Math.PI / 2) },
    { geo: new THREE.PlaneGeometry(bd, bh), matrix: mat(THREE, -bw / 2, bh / 2, 0, 0, Math.PI / 2) },
  ], { uv: true }));
  basket.add(new THREE.Mesh(walls, wallMat));
  const solid = keepG(mergeParts(THREE, [
    { geo: new THREE.BoxGeometry(bw, 0.012, bd), matrix: mat(THREE, 0, 0.006, 0), color: 0xc93a33 },
    { geo: new THREE.BoxGeometry(bw + 0.02, 0.02, 0.02), matrix: mat(THREE, 0, bh, bd / 2), color: 0xf05a50 },
    { geo: new THREE.BoxGeometry(bw + 0.02, 0.02, 0.02), matrix: mat(THREE, 0, bh, -bd / 2), color: 0xf05a50 },
    { geo: new THREE.BoxGeometry(0.02, 0.02, bd + 0.02), matrix: mat(THREE, bw / 2, bh, 0), color: 0xf05a50 },
    { geo: new THREE.BoxGeometry(0.02, 0.02, bd + 0.02), matrix: mat(THREE, -bw / 2, bh, 0), color: 0xf05a50 },
    // 持ち手（左右に倒してある）
    { geo: new THREE.TorusGeometry(0.09, 0.008, 6, 16, Math.PI), matrix: mat(THREE, -bw / 2 - 0.005, bh, 0, 0, Math.PI / 2, -1.35), color: 0x333333 },
    { geo: new THREE.TorusGeometry(0.09, 0.008, 6, 16, Math.PI), matrix: mat(THREE, bw / 2 + 0.005, bh, 0, 0, Math.PI / 2, 1.35), color: 0x333333 },
  ]));
  basket.add(new THREE.Mesh(solid, keepM(new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.55 }))));
  group.add(basket);

  // ---- 疑似影（丸い影の板）：かご ----
  const shadowTex = assets.canvasTexture('blob', 128, 128, (g, w, h) => {
    const r = g.createRadialGradient(w / 2, h / 2, 4, w / 2, h / 2, w / 2);
    r.addColorStop(0, 'rgba(0,0,0,0.45)'); r.addColorStop(0.6, 'rgba(0,0,0,0.2)'); r.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = r; g.fillRect(0, 0, w, h);
  });
  const shadowMat = keepM(new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false, toneMapped: false }));
  const shadowGeo = keepG(new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2));
  const bs = new THREE.Mesh(shadowGeo, shadowMat);
  bs.scale.set(bw * 1.35, 1, bd * 1.5);
  bs.position.set(B.center[0], 0.002, B.center[2]);
  bs.renderOrder = -1;
  group.add(bs);

  // ---- 花台とお礼の花（InstancedMesh 3つ、最大12個） ----
  const G = L.gifts;
  const shelf = new THREE.Mesh(keepG(new THREE.BoxGeometry(G.x1 - G.x0 + 0.06, 0.025, 0.09)),
    keepM(new THREE.MeshLambertMaterial({ color: 0xd9a066 })));
  shelf.position.set((G.x0 + G.x1) / 2, 0.0125, G.z);
  group.add(shelf);
  const MAX_GIFTS = 12;
  const petalGeo = keepG(mergeParts(THREE, Array.from({ length: 5 }, (_, i) => {
    const a = (i / 5) * Math.PI * 2;
    return { geo: new THREE.SphereGeometry(0.019, 8, 6), matrix: mat(THREE, Math.cos(a) * 0.022, Math.sin(a) * 0.022, 0, 0, 0, a, 1, 0.75, 0.45) };
  })));
  const centerGeo = keepG(new THREE.SphereGeometry(0.014, 8, 6).scale(1, 1, 0.6));
  const stemGeo = keepG(mergeParts(THREE, [
    { geo: new THREE.CylinderGeometry(0.004, 0.004, 0.08, 5), matrix: mat(THREE, 0, -0.04, 0), color: 0x4caf50 },
    { geo: new THREE.SphereGeometry(0.014, 6, 4), matrix: mat(THREE, 0.012, -0.05, 0, 0, 0, 0.6, 1, 0.4, 0.3), color: 0x4caf50 },
    { geo: new THREE.CylinderGeometry(0.022, 0.017, 0.035, 10), matrix: mat(THREE, 0, -0.085, 0), color: 0xf7f2e8 },
  ]));
  const petalMat = keepM(new THREE.MeshLambertMaterial({ color: 0xffffff }));
  const centerMat = keepM(new THREE.MeshLambertMaterial({ color: 0xffd34d, emissive: 0x332200 }));
  const stemMat = keepM(new THREE.MeshLambertMaterial({ vertexColors: true }));
  const petals = new THREE.InstancedMesh(petalGeo, petalMat, MAX_GIFTS);
  const centers = new THREE.InstancedMesh(centerGeo, centerMat, MAX_GIFTS);
  const stems = new THREE.InstancedMesh(stemGeo, stemMat, MAX_GIFTS);
  for (const im of [petals, centers, stems]) { im.count = 0; im.frustumCulled = false; group.add(im); }
  petals.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(MAX_GIFTS * 3), 3);

  // 飛んでくる途中の花（1本だけ。普通の Mesh）
  const flying = new THREE.Group();
  const fp = new THREE.Mesh(petalGeo, keepM(new THREE.MeshLambertMaterial({ color: 0xffffff })));
  flying.add(fp, new THREE.Mesh(centerGeo, centerMat), new THREE.Mesh(stemGeo, stemMat));
  flying.visible = false;
  group.add(flying);

  // 右（真ん中寄り）から左へ並べる：寄った構図でも、もらったばかりの花が画面に入る
  const giftSlot = (i, out) => out.set(G.x1 - (G.x1 - G.x0) * (i / (MAX_GIFTS - 1)), 0.11, G.z);
  const gifts = { colors: [], pop: [] };
  const m4 = new THREE.Matrix4();
  const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.35, 0, 0));
  const v = new THREE.Vector3();
  const sc = new THREE.Vector3();
  const col = new THREE.Color();

  function writeGifts() {
    const n = gifts.colors.length;
    petals.count = centers.count = stems.count = n;
    for (let i = 0; i < n; i++) {
      giftSlot(i, v);
      const p = gifts.pop[i];
      // 少し行き過ぎてから戻る（easeOutBack）
      const s = p >= 1 ? 1 : 1 + 2.7 * Math.pow(p - 1, 3) + 1.7 * Math.pow(p - 1, 2);
      sc.setScalar(Math.max(0.001, s));
      m4.compose(v, q, sc);
      stems.setMatrixAt(i, m4);
      petals.setMatrixAt(i, m4);
      v.z += 0.004;
      m4.compose(v, q, sc);
      centers.setMatrixAt(i, m4);
      petals.setColorAt(i, col.set(gifts.colors[i]));
    }
    for (const im of [petals, centers, stems]) im.instanceMatrix.needsUpdate = true;
    if (petals.instanceColor) petals.instanceColor.needsUpdate = true;
  }

  function setGifts(colors) {
    gifts.colors = colors.slice(-MAX_GIFTS);
    gifts.pop = gifts.colors.map(() => 1);
    writeGifts();
  }

  function addGift(color) {
    if (gifts.colors.length >= MAX_GIFTS) { gifts.colors.shift(); gifts.pop.shift(); }
    gifts.colors.push(color);
    gifts.pop.push(0);
    writeGifts();
    return gifts.colors.length - 1;
  }

  // ---- ハート（Sprite のプール） ----
  const heartTex = assets.canvasTexture('heart', 128, 128, (g, w) => {
    g.fillStyle = '#ff5f8f';
    g.beginPath();
    const s = w / 128;
    g.moveTo(64 * s, 112 * s);
    g.bezierCurveTo(10 * s, 70 * s, 8 * s, 30 * s, 38 * s, 22 * s);
    g.bezierCurveTo(52 * s, 18 * s, 62 * s, 28 * s, 64 * s, 38 * s);
    g.bezierCurveTo(66 * s, 28 * s, 76 * s, 18 * s, 90 * s, 22 * s);
    g.bezierCurveTo(120 * s, 30 * s, 118 * s, 70 * s, 64 * s, 112 * s);
    g.fill();
    g.fillStyle = 'rgba(255,255,255,0.55)';
    g.beginPath(); g.ellipse(40 * s, 40 * s, 10 * s, 6 * s, -0.6, 0, Math.PI * 2); g.fill();
  });
  const hearts = [];
  for (let i = 0; i < 6; i++) {
    const m = keepM(new THREE.SpriteMaterial({ map: heartTex, transparent: true, depthWrite: false, toneMapped: false }));
    const s = new THREE.Sprite(m);
    s.visible = false;
    group.add(s);
    hearts.push({ s, t: 0, life: 0, vx: 0, x0: 0, y0: 0, z0: 0 });
  }
  function spawnHearts(pos, n = 5) {
    let k = 0;
    for (const h of hearts) {
      if (k >= n) break;
      if (h.s.visible) continue;
      h.s.visible = true; h.t = -k * 0.08; h.life = 1.3;
      h.x0 = pos.x + (k - (n - 1) / 2) * 0.09; h.y0 = pos.y; h.z0 = pos.z + 0.1;
      h.vx = (k - (n - 1) / 2) * 0.05;
      h.s.material.opacity = 0;
      k++;
    }
  }

  // ---- 毎フレーム ----
  const flight = { on: false, t: 0, T: 0.7, from: new THREE.Vector3(), to: new THREE.Vector3(), index: -1 };
  function sendGift(fromPos, color) {
    flying.visible = true;
    fp.material.color.set(color);
    flight.on = true; flight.t = 0;
    flight.from.copy(fromPos);
    flight.color = color;
    const next = Math.min(gifts.colors.length, MAX_GIFTS - 1);
    giftSlot(next, flight.to);
  }

  function update(dt) {
    // ハート
    for (const h of hearts) {
      if (!h.s.visible) continue;
      h.t += dt;
      if (h.t < 0) continue;
      const u = h.t / h.life;
      if (u >= 1) { h.s.visible = false; continue; }
      const sz = 0.09 * Math.min(1, h.t / 0.15) * (1 + 0.1 * Math.sin(h.t * 12));
      h.s.scale.set(sz, sz, 1);
      h.s.position.set(h.x0 + h.vx * h.t + 0.02 * Math.sin(h.t * 7), h.y0 + 0.35 * h.t, h.z0);
      h.s.material.opacity = u < 0.7 ? 1 : Math.max(0, 1 - (u - 0.7) / 0.3);
    }
    // 花の飛行
    if (flight.on) {
      flight.t += dt;
      const u = Math.min(1, flight.t / flight.T);
      const e = u * u * (3 - 2 * u);
      flying.position.lerpVectors(flight.from, flight.to, e);
      flying.position.y += Math.sin(Math.PI * u) * 0.25;
      flying.rotation.set(-0.35, 0, Math.sin(u * Math.PI * 2) * 0.4);
      const s = 0.7 + 0.5 * Math.sin(Math.PI * u);
      flying.scale.setScalar(s);
      if (u >= 1) {
        flight.on = false; flying.visible = false;
        addGift(flight.color);
      }
    }
    // 花がぽんと出る
    let dirty = false;
    for (let i = 0; i < gifts.pop.length; i++) {
      if (gifts.pop[i] < 1) {
        gifts.pop[i] = Math.min(1, gifts.pop[i] + dt * 4);
        dirty = true;
      }
    }
    if (dirty) writeGifts();
  }

  function dispose() {
    for (const g of geos) g.dispose();
    for (const m of mats) m.dispose();
    for (const im of [petals, centers, stems]) im.dispose();
  }

  return {
    group, update, dispose, spawnHearts, sendGift, setGifts,
    get giftColors() { return gifts.colors.slice(); },
    get giftFlying() { return flight.on; },
  };
}
