// 周辺の場面：屋台・背景・釜・瓶・棚・提灯。低ポリ＋写真風テクスチャ。
import { COUNTER, PAN, PAN_ORIGIN, JARS, RACK, BACKDROP, SHOTS } from './layout.js';

export function createWorld(THREE, tex, tier) {
  const root = new THREE.Group(); root.name = 'world';
  const disposables = [];
  const keep = o => (disposables.push(o), o);

  // ---- 光（2灯＋半球光。影マップなし）
  const hemi = new THREE.HemisphereLight(0xfff1dc, 0x4a3a46, 1.35);
  root.add(hemi);
  const key = new THREE.DirectionalLight(0xffe2c0, 2.1);
  key.position.set(1.2, 3.0, 2.0); root.add(key);
  const fill = new THREE.DirectionalLight(0xbfd4ff, 0.55);
  fill.position.set(-2, 1.5, -1.5); root.add(fill);

  // ---- 疑似影の材質（共用）
  // 動かない疑似影（釜・瓶・棚）は全部を1つの形にまとめる（濃さは頂点色のα、1 draw call）
  const shadowMat = keep(new THREE.MeshBasicMaterial({ color: 0x2a1a10, alphaMap: tex.blob, vertexColors: true, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -4 }));
  const shadowSpecs = [];
  let shadowGeo = null;
  function blobShadow(x, y, z, sx, sz, op = 0.55) { shadowSpecs.push([x, y + 0.004, z, sx, sz, op]); return shadowSpecs.length - 1; }
  // 1つの疑似影の位置を動かす（瓶を置き直した時）
  function moveShadow(i, x, z) {
    const sp = shadowSpecs[i]; sp[0] = x; sp[2] = z;
    if (!shadowGeo) return;
    const pos = shadowGeo.attributes.position;
    [[-0.5, -0.5], [0.5, -0.5], [-0.5, 0.5], [0.5, 0.5]].forEach(([dx, dz], k) => pos.setXYZ(i * 4 + k, x + dx * sp[3], sp[1], z - dz * sp[4]));
    pos.needsUpdate = true;
    shadowGeo.computeBoundingSphere();
  }
  function buildShadows() {
    const n = shadowSpecs.length, pos = new Float32Array(n * 12), uv = new Float32Array(n * 8), col = new Float32Array(n * 16), idx = new Uint16Array(n * 6);
    shadowSpecs.forEach(([x, y, z, sx, sz, op], i) => {
      [[-0.5, -0.5, 0, 0], [0.5, -0.5, 1, 0], [-0.5, 0.5, 0, 1], [0.5, 0.5, 1, 1]].forEach(([dx, dz, u, v], k) => {
        // PlaneGeometry を -90° 倒したのと同じ並び（+v が奥 = -z）
        pos.set([x + dx * sx, y, z - dz * sz], (i * 4 + k) * 3);
        uv.set([u, v], (i * 4 + k) * 2);
        col.set([1, 1, 1, op], (i * 4 + k) * 4);
      });
      idx.set([0, 1, 2, 2, 1, 3].map(a => a + i * 4), i * 6);
    });
    const g = keep(new THREE.BufferGeometry());
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    g.setAttribute('color', new THREE.BufferAttribute(col, 4));
    g.setIndex(new THREE.BufferAttribute(idx, 1));
    g.computeBoundingSphere();
    shadowGeo = g;
    const m = new THREE.Mesh(g, shadowMat); m.name = 'shadows'; m.renderOrder = 1;
    root.add(m);
  }

  // ---- 背景の写真板（カメラに正対、視界を覆う大きさは fitBackdrop で）
  const bdMat = keep(new THREE.MeshBasicMaterial({ map: tex.festival, toneMapped: false, depthWrite: false, fog: false }));
  bdMat.color.setRGB(0.92, 0.9, 0.95);
  const backdrop = new THREE.Mesh(keep(new THREE.PlaneGeometry(1, 1)), bdMat);
  backdrop.renderOrder = -10; backdrop.name = 'backdrop';
  root.add(backdrop);

  // ---- カウンター（木の天板＋赤白の前垂れ）
  const woodTop = tex.wood.clone(); woodTop.needsUpdate = true; keep(woodTop);
  woodTop.repeat.set(3, 1.2); woodTop.rotation = Math.PI / 2; woodTop.center.set(0.5, 0.5);
  const topMat = keep(new THREE.MeshStandardMaterial({ map: woodTop, color: 0xd9b48a, roughness: 0.8, metalness: 0 }));
  const cw = COUNTER.x1 - COUNTER.x0, cd = COUNTER.z1 - COUNTER.z0;
  const counter = new THREE.Mesh(keep(new THREE.BoxGeometry(cw, COUNTER.thick, cd)), topMat);
  counter.position.set((COUNTER.x0 + COUNTER.x1) / 2, COUNTER.top - COUNTER.thick / 2, (COUNTER.z0 + COUNTER.z1) / 2);
  root.add(counter);
  const awnTex = tex.awning.clone(); awnTex.needsUpdate = true; keep(awnTex);
  awnTex.repeat.set(6, 1);
  const skirtMat = keep(new THREE.MeshStandardMaterial({ map: awnTex, roughness: 0.9 }));
  const skirt = new THREE.Mesh(keep(new THREE.PlaneGeometry(cw, COUNTER.top - 0.05)), skirtMat);
  skirt.position.set(0, (COUNTER.top - 0.05) / 2, COUNTER.z0 - 0.001); skirt.rotation.y = Math.PI;
  root.add(skirt);

  // ---- 柱と日よけ（上端に垂れ幕の波形）
  const poleMat = keep(new THREE.MeshStandardMaterial({ map: tex.wood, color: 0xb98a5a, roughness: 0.8 }));
  const poleGeo = keep(new THREE.CylinderGeometry(0.035, 0.035, 2.2, 8));
  for (const x of [-1.2, 1.2]) {
    const p = new THREE.Mesh(poleGeo, poleMat); p.position.set(x, 1.1, -0.6); root.add(p);
  }
  const valTex = tex.awning.clone(); valTex.needsUpdate = true; keep(valTex);
  valTex.repeat.set(5, 1);
  const valMat = keep(new THREE.MeshStandardMaterial({ map: valTex, roughness: 0.9, side: THREE.DoubleSide }));
  const valance = new THREE.Mesh(keep(scallopGeometry(THREE, 3.0, 0.22, 12, 0.05)), valMat);
  valance.position.set(0, 1.62, -0.62); root.add(valance);

  // ---- 提灯（InstancedMesh、ゆっくり揺れる）
  const nL = tier.lanterns;
  const lanGeo = keep(new THREE.SphereGeometry(0.11, 12, 8).scale(1, 1.15, 1));
  const lanMat = keep(new THREE.MeshBasicMaterial({ color: 0xffe2a8, toneMapped: false }));
  const lanterns = new THREE.InstancedMesh(lanGeo, lanMat, nL);
  const lanBase = [];
  for (let i = 0; i < nL; i++) {
    const u = nL === 1 ? 0.5 : i / (nL - 1);
    const x = -2.6 + u * 5.2, z = -3.2 - Math.sin(u * 3.1) * 0.4;
    const y = 1.52 - Math.sin(u * Math.PI) * 0.12;
    lanBase.push([x, y, z, Math.random() * 6.28]);
  }
  lanterns.name = 'lanterns'; root.add(lanterns);
  // 提灯の光：カメラにほぼ正対する板を1つの形にまとめる（Sprite 10 個と同じ見た目、1 draw call）。
  // カメラは寄ったり引いたりするが、見下ろす角はおよそ work〜give の間なので、その中ほどの向きに合わせる
  {
    const pitch = THREE.MathUtils.degToRad((SHOTS.work.pitch + SHOTS.give.pitch) / 2);
    const cm = new THREE.Matrix4().lookAt(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -Math.sin(pitch), -Math.cos(pitch)), new THREE.Vector3(0, 1, 0));
    const rx = new THREE.Vector3().setFromMatrixColumn(cm, 0), ry = new THREE.Vector3().setFromMatrixColumn(cm, 1);
    const n = lanBase.length, pos = new Float32Array(n * 12), uv = new Float32Array(n * 8), idx = new Uint16Array(n * 6), h = 0.55 / 2;
    lanBase.forEach(([x, y, z], i) => {
      [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b], k) => {
        pos.set([x + (rx.x * a + ry.x * b) * h, y + (rx.y * a + ry.y * b) * h, z + (rx.z * a + ry.z * b) * h], (i * 4 + k) * 3);
        uv.set([(a + 1) / 2, (b + 1) / 2], (i * 4 + k) * 2);
      });
      idx.set([0, 1, 2, 2, 1, 3].map(v => v + i * 4), i * 6);
    });
    const g = keep(new THREE.BufferGeometry());
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    g.setIndex(new THREE.BufferAttribute(idx, 1));
    g.computeBoundingSphere();
    const gm = keep(new THREE.MeshBasicMaterial({ map: tex.glow, color: 0xffc56a, transparent: true, opacity: 0.5, depthWrite: false, toneMapped: false }));
    const glows = new THREE.Mesh(g, gm); glows.name = 'lantern-glows';
    root.add(glows);
  }

  // ---- 釜（台・ボウル・回転頭）
  const pan = new THREE.Group(); pan.name = 'pan';
  pan.position.set(PAN_ORIGIN[0], PAN_ORIGIN[1], PAN_ORIGIN[2]);
  root.add(pan);
  const steel = tex.steel;
  const steelMat = keep(new THREE.MeshStandardMaterial({ map: steel, color: 0xf4f6fa, roughness: 0.45, metalness: 0.12, side: THREE.DoubleSide }));
  const bodyMat = keep(new THREE.MeshStandardMaterial({ map: steel, color: 0xf6b8c8, roughness: 0.5, metalness: 0.2 }));
  // ボウル：外壁→縁→内壁→底（Lathe）
  const R = PAN.innerRadius, Ro = PAN.outerRadius, rimY = PAN.rimY, floorY = PAN.floorY;
  const prof = [
    [0.075, floorY], [R * 0.80, floorY], [R * 0.95, floorY + 0.03], [R, rimY - 0.02], [R, rimY],
    [R + 0.012, rimY + 0.012], [Ro, rimY + 0.004], [Ro, rimY - 0.03], [Ro - 0.01, floorY - 0.02], [0.14, floorY - 0.05],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  const bowl = new THREE.Mesh(keep(new THREE.LatheGeometry(prof, 64)), steelMat);
  pan.add(bowl);
  // 機械の胴（ピンク）
  const body = new THREE.Mesh(keep(new THREE.CylinderGeometry(0.22, 0.25, PAN_ORIGIN[1] + floorY - 0.05 - COUNTER.top, 40)), bodyMat);
  body.position.y = (COUNTER.top + (PAN_ORIGIN[1] + floorY - 0.05)) / 2 - PAN_ORIGIN[1];
  pan.add(body);
  // 回転頭
  const spinMat = keep(new THREE.MeshStandardMaterial({ map: tex.spinner, roughness: 0.4, metalness: 0.4 }));
  const spinGeo = keep(new THREE.CylinderGeometry(PAN.spinnerRadius, PAN.spinnerRadius * 1.15, -floorY, 32));
  { const gs = spinGeo.groups, side = gs[0].count; spinGeo.clearGroups(); spinGeo.addGroup(0, side, 0); spinGeo.addGroup(side, spinGeo.index.count - side, 1); }  // 上下のふたを1つに
  const spinner = new THREE.Mesh(spinGeo, [keep(new THREE.MeshStandardMaterial({ color: 0xb8bcc4, roughness: 0.4, metalness: 0.6 })), spinMat]);
  spinner.position.y = floorY / 2; pan.add(spinner);
  // 熱のほのかな光
  const heat = new THREE.Sprite(keep(new THREE.SpriteMaterial({ map: tex.glow, color: 0xff9a5a, transparent: true, opacity: 0.35, depthWrite: false })));
  heat.position.y = 0.01; heat.scale.setScalar(0.18); pan.add(heat);
  blobShadow(0, COUNTER.top, 0.02, 1.4, 1.2, 0.5);    // 縁がなめらかに消える濃淡なので、釜より一回り大きく

  // ---- 瓶（ざらめ）。ガラスは半透明（屈折なし）、中のざらめは不透明
  const jarGlassGeo = keep(new THREE.LatheGeometry([
    [0.0, 0], [0.058, 0], [0.068, 0.01], [0.07, 0.11], [0.06, 0.14], [0.05, 0.15], [0.05, 0.165], [0.054, 0.17],
  ].map(([x, y]) => new THREE.Vector2(x, y)), 24));
  const jarGlassMat = keep(new THREE.MeshStandardMaterial({ color: 0xeaf6ff, roughness: 0.15, metalness: 0, transparent: true, opacity: 0.32, depthWrite: false }));
  // ざらめ（胴＋盛り上がった上面）は1つの形に
  const sugarBody = new THREE.CylinderGeometry(0.06, 0.056, 0.11, 20, 1).translate(0, 0.062, 0);
  const sugarTop = new THREE.SphereGeometry(0.06, 20, 6, 0, Math.PI * 2, 0, Math.PI / 2).scale(1, 0.35, 1).translate(0, 0.117, 0);
  const sugarGeo = keep(mergeGeos(THREE, [sugarBody, sugarTop]));
  sugarBody.dispose(); sugarTop.dispose();
  // 瓶のガラス4つは InstancedMesh（毎フレーム、各瓶の傾きを写す）
  const glassInst = new THREE.InstancedMesh(jarGlassGeo, jarGlassMat, JARS.length);
  glassInst.name = 'jar-glass'; glassInst.renderOrder = 2; glassInst.frustumCulled = false;
  root.add(glassInst);
  const hitGeo = keep(new THREE.CylinderGeometry(0.1, 0.1, 0.26, 8)); hitGeo.translate(0, 0.11, 0);
  const hitMat = keep(new THREE.MeshBasicMaterial({ visible: false }));
  const jars = JARS.map((j, i) => {
    const g = new THREE.Group(); g.name = 'jar-' + j.id;
    g.position.set(j.pos[0], COUNTER.top, j.pos[2]);
    const pivot = new THREE.Group(); g.add(pivot);  // 傾ける軸（瓶の底）
    const sm = keep(new THREE.MeshStandardMaterial({ color: j.color, roughness: 0.75, emissive: j.color, emissiveIntensity: 0.0 }));
    const sugar = new THREE.Mesh(sugarGeo, sm);
    pivot.add(sugar);
    const hit = new THREE.Mesh(hitGeo, hitMat); hit.userData.jarIndex = i; g.add(hit);
    root.add(g);
    const shadow = blobShadow(j.pos[0], COUNTER.top, j.pos[2], 0.2, 0.2, 0.45);
    return { group: g, pivot, mat: sm, hit, index: i, color: j.color, anim: -1, wiggle: 0, used: i === 0, shadow };
  });

  // 選ばれている瓶の下の光る輪
  const ringMat = keep(new THREE.MeshBasicMaterial({ color: 0xffffff, map: tex.glow, transparent: true, opacity: 0.9, depthWrite: false, toneMapped: false }));
  const ring = new THREE.Mesh(keep(new THREE.PlaneGeometry(0.26, 0.26).rotateX(-Math.PI / 2)), ringMat);
  ring.renderOrder = 1; root.add(ring);

  // ---- ざらめの粒（注ぐ演出、1 draw call）
  const nG = tier.sugarGrains;
  const grainGeo = keep(new THREE.IcosahedronGeometry(0.006, 0));
  const grainMat = keep(new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 }));
  const grains = new THREE.InstancedMesh(grainGeo, grainMat, nG);
  grains.count = 0; grains.frustumCulled = false; root.add(grains);
  const grainState = Array.from({ length: nG }, () => ({ t: -1, wait: 0, p0: new THREE.Vector3(), v: new THREE.Vector3() }));

  // ---- 店先の棚
  const rackTex = tex.awning.clone(); rackTex.needsUpdate = true; keep(rackTex); rackTex.repeat.set(2.5, 0.4);
  const rackMat = keep(new THREE.MeshStandardMaterial({ map: rackTex, color: 0xffe4ec, roughness: 0.85 }));
  const nSlots = Math.min(RACK.slots, tier.rackSlots);
  const rackLen = RACK.slotStep * (nSlots - 1) + 0.12;
  const rack = new THREE.Mesh(keep(new THREE.BoxGeometry(rackLen, 0.07, 0.10)), rackMat);
  rack.position.set(RACK.pos[0] + RACK.slotStep * (nSlots - 1) / 2, COUNTER.top + 0.035, RACK.pos[2]);
  root.add(rack);
  blobShadow(rack.position.x, COUNTER.top, rack.position.z, rackLen + 0.15, 0.25, 0.4);
  const slotPos = [];
  for (let i = 0; i < nSlots; i++) slotPos.push(new THREE.Vector3(RACK.pos[0] + i * RACK.slotStep, COUNTER.top + 0.06, RACK.pos[2]));

  // ---- 背景を視界いっぱいに合わせる（毎フレーム。カメラは寄ったり引いたりし、レンズのずらしもある）
  const tmpV = new THREE.Vector3(), tmpQ = new THREE.Quaternion(), tmpR = new THREE.Vector3(), tmpU = new THREE.Vector3();
  function fitBackdrop(camera) {
    camera.getWorldDirection(tmpV);
    camera.getWorldQuaternion(tmpQ); backdrop.quaternion.copy(tmpQ);
    const ty = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)), tx = ty * camera.aspect;
    // setViewOffset で画面の中心は元の NDC で (-sx, -sy) の向きにずれている → 板の中心もそこへ
    let sx = 0, sy = 0;
    const vw = camera.view;
    if (vw && vw.enabled) { sx = -2 * vw.offsetX / vw.width; sy = 2 * vw.offsetY / vw.height; }
    tmpR.set(1, 0, 0).applyQuaternion(tmpQ); tmpU.set(0, 1, 0).applyQuaternion(tmpQ);
    backdrop.position.copy(camera.position).addScaledVector(tmpV, BACKDROP.dist)
      .addScaledVector(tmpR, -sx * tx * BACKDROP.dist).addScaledVector(tmpU, -sy * ty * BACKDROP.dist);
    const h = 2 * BACKDROP.dist * ty * 1.04;
    const w = h * camera.aspect;
    const s = Math.max(w, h);
    backdrop.scale.set(w, h, 1);
    // 正方形の写真を cover で切り出す（上の提灯を優先して見せる）
    const rx = w / s, ry = h / s;
    tex.festival.repeat.set(rx, ry);
    tex.festival.offset.set((1 - rx) / 2, (1 - ry) * 0.62);
  }

  // ---- 毎フレーム
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), s3 = new THREE.Vector3(1, 1, 1), p3 = new THREE.Vector3();
  let selected = 0;
  function update(dt, t, spinAngle) {
    spinner.rotation.y = spinAngle;
    heat.material.opacity = 0.28 + 0.06 * Math.sin(t * 5.3);
    for (let i = 0; i < nL; i++) {
      const [x, y, z, ph] = lanBase[i];
      e.set(0, 0, Math.sin(t * 0.9 + ph) * 0.06);
      q.setFromEuler(e); p3.set(x, y + Math.sin(t * 0.7 + ph) * 0.01, z);
      m4.compose(p3, q, s3); lanterns.setMatrixAt(i, m4);
    }
    lanterns.instanceMatrix.needsUpdate = true;

    // 瓶：注ぐ動き・ゆらゆら
    for (const j of jars) {
      const pv = j.pivot;
      if (j.anim >= 0) {
        j.anim += dt;
        const k = j.anim;
        // 0-0.25 持ち上げ・傾け、0.25-0.75 注ぐ、0.75-1.0 戻す
        const up = k < 0.25 ? ease(k / 0.25) : k < 0.75 ? 1 : 1 - ease((k - 0.75) / 0.25);
        pv.position.set(POUR.dx * up, POUR.lift * up, 0);
        pv.rotation.set(0, 0, -POUR.tilt * up);
        if (k > 1.0) { j.anim = -1; pv.position.set(0, 0, 0); pv.rotation.set(0, 0, 0); }
      } else {
        j.wiggle = Math.max(0, j.wiggle - dt);
        const w = j.wiggle;
        pv.rotation.set(0, 0, Math.sin(w * 18) * 0.12 * w);
        pv.position.y = Math.abs(Math.sin(w * 9)) * 0.03 * w;
      }
      j.mat.emissiveIntensity = j.index === selected ? 0.18 + 0.08 * Math.sin(t * 3) : 0.0 + j.wiggle * 0.5;
    }
    // ガラス：各瓶の pivot の姿勢を写す
    for (const j of jars) { j.pivot.updateWorldMatrix(true, false); glassInst.setMatrixAt(j.index, j.pivot.matrixWorld); }
    glassInst.instanceMatrix.needsUpdate = true;
    const sj = jars[selected];
    ring.position.set(sj.group.position.x, COUNTER.top + 0.003, sj.group.position.z);
    ringMat.color.setHex(sj.color);
    ringMat.opacity = 0.75 + 0.2 * Math.sin(t * 3);

    // 粒
    let n = 0;
    for (const g of grainState) {
      if (g.t < 0) continue;
      g.t += dt;
      if (g.t > 0.9) { g.t = -1; continue; }
      p3.copy(g.p0).addScaledVector(g.v, g.t); p3.y -= 4.9 * g.t * g.t;
      if (g.t > 0.3 && p3.y < PAN_ORIGIN[1] + 0.005) { g.t = -1; continue; }
      m4.makeTranslation(p3.x, p3.y, p3.z); grains.setMatrixAt(n++, m4);
    }
    grains.count = n; grains.instanceMatrix.needsUpdate = true;
  }

  function pour(index) {
    const j = jars[index];
    selected = index; j.used = true;
    j.anim = 0;
    grainMat.color.setHex(j.color);
    // 粒を時間差で出す：持ち上がった瓶の口からボウルの中心へ放物線
    const mouth = new THREE.Vector3(j.group.position.x + POUR.dx + 0.17 * Math.sin(POUR.tilt), COUNTER.top + POUR.lift + 0.17 * Math.cos(POUR.tilt) + 0.02, j.group.position.z);
    grainState.forEach((g, i) => {
      g.wait = 0.2 + (i / nG) * 0.5; g.t = -1;
      g.p0.set(mouth.x + (Math.random() - 0.5) * 0.02, mouth.y, mouth.z + (Math.random() - 0.5) * 0.02);
      const tx = PAN_ORIGIN[0] + (Math.random() - 0.5) * 0.08, ty = PAN_ORIGIN[1] + 0.01, tz = PAN_ORIGIN[2] + (Math.random() - 0.5) * 0.08;
      const T = 0.34 + Math.random() * 0.08;
      g.v.set((tx - g.p0.x) / T, (ty - g.p0.y + 4.9 * T * T) / T, (tz - g.p0.z) / T);
    });
  }
  // 待ち時間付きの粒を進める
  function updateGrainWaits(dt) {
    for (const g of grainState) {
      if (g.wait > 0) { g.wait -= dt; if (g.wait <= 0) { g.wait = 0; g.t = 0; } }
    }
  }

  function wiggleJar(i) { if (jars[i].anim < 0) jars[i].wiggle = 1.0; }

  // 瓶の x を置き直す（画面比に合わせて、寄った構図の左端に見えるように。main.js の placeJars）
  function setJarX(xs) {
    jars.forEach((j, i) => {
      const x = xs[i]; if (!(x === x)) return;
      j.group.position.x = x;
      moveShadow(j.shadow, x, j.group.position.z);
    });
  }

  buildShadows();

  function dispose() {
    root.traverse(o => { if (o.isInstancedMesh) o.dispose(); });
    for (const d of disposables) d.dispose && d.dispose();
  }

  return {
    root, pan, jars, slotPos, fitBackdrop, dispose,
    update(dt, t, spinAngle) { updateGrainWaits(dt); update(dt, t, spinAngle); },
    pour, wiggleJar, setJarX,
    get selected() { return selected; },
    jarHits: jars.map(j => j.hit),
  };
}

// 注ぐ動き：持ち上げる高さ・右へ寄せる量・傾ける角（瓶が釜の近くにあっても縁に当たらないように、高く持ち上げる）
const POUR = { lift: 0.30, dx: 0.06, tilt: 1.05 };

function ease(x) { x = Math.min(1, Math.max(0, x)); return x * x * (3 - 2 * x); }

// 垂れ幕：上辺まっすぐ、下辺が半円の波
function scallopGeometry(THREE, width, height, n, depth) {
  const shape = new THREE.Shape();
  const w2 = width / 2, step = width / n, r = step / 2;
  shape.moveTo(-w2, height);
  shape.lineTo(w2, height);
  shape.lineTo(w2, depth);
  for (let i = n - 1; i >= 0; i--) {
    const cx = -w2 + step * (i + 0.5);
    shape.absarc(cx, depth, r, 0, -Math.PI, true);
  }
  shape.lineTo(-w2, height);
  const g = new THREE.ShapeGeometry(shape, 6);
  // UV：x を 0..1、y を 0..1 に
  const pos = g.attributes.position, uv = g.attributes.uv;
  for (let i = 0; i < pos.count; i++) uv.setXY(i, (pos.getX(i) + w2) / width, (pos.getY(i) + r) / (height + r));
  return g;
}

// 添字付きの形を1つにまとめる（position・normal・uv）
function mergeGeos(THREE, list) {
  let nv = 0, ni = 0;
  for (const g of list) { nv += g.attributes.position.count; ni += g.index.count; }
  const pos = new Float32Array(nv * 3), nor = new Float32Array(nv * 3), uv = new Float32Array(nv * 2), idx = new Uint16Array(ni);
  let vo = 0, io = 0;
  for (const g of list) {
    pos.set(g.attributes.position.array, vo * 3); nor.set(g.attributes.normal.array, vo * 3); uv.set(g.attributes.uv.array, vo * 2);
    for (let i = 0; i < g.index.count; i++) idx[io + i] = g.index.array[i] + vo;
    vo += g.attributes.position.count; io += g.index.count;
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  out.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
  out.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  out.setIndex(new THREE.BufferAttribute(idx, 1));
  out.computeBoundingSphere();
  return out;
}
