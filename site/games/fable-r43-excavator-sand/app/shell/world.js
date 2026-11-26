// 周辺の場面：空・遠景（公園の写真）・芝生・砂場の木枠・ライト。すべて低ポリ。
import * as THREE from '../vendor/three/three.module.js';
import { LAYOUT } from './config.js';
import { loadTex, grassTexture } from './assets.js';

export function createWorld(scene, tier, shared) {
  const group = new THREE.Group();
  group.name = 'world';
  scene.add(group);
  const disposables = [];
  const keep = (...xs) => { disposables.push(...xs); return xs[0]; };

  // 空：頂点カラーのグラデーション球
  {
    const geo = keep(new THREE.SphereGeometry(40, 16, 8));
    const col = [];
    const top = new THREE.Color('#7cc4f2'), hor = new THREE.Color('#e9f6ff');
    const p = geo.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const t = THREE.MathUtils.clamp(p.getY(i) / 40, 0, 1);
      const c = hor.clone().lerp(top, Math.sqrt(t));
      col.push(c.r, c.g, c.b);
    }
    geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
    const mat = keep(new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide, depthWrite: false, fog: false }));
    const sky = new THREE.Mesh(geo, mat);
    sky.renderOrder = -10;
    sky.name = 'sky';
    group.add(sky);
  }

  // 遠景：公園の写真（512×256）をカメラに正対する板に貼り、画面の上側を覆う（fitBackdrop で配置）。
  // 深度は使わず最初に描く。手前の芝生・茂みが下側を上書きして継ぎ目を隠す。
  let backdrop;
  {
    const tex = keep(loadTex('park_backdrop_512x256', { repeat: false, aniso: 1 }));
    const geo = keep(new THREE.PlaneGeometry(1, 1));
    const mat = keep(new THREE.MeshBasicMaterial({ map: tex, depthTest: false, depthWrite: false, fog: false, color: 0xf4f4f4 }));
    backdrop = new THREE.Mesh(geo, mat);
    backdrop.renderOrder = -9;
    backdrop.frustumCulled = false;
    backdrop.name = 'backdrop';
    group.add(backdrop);
  }
  const _fwd = new THREE.Vector3(), _up = new THREE.Vector3();
  function fitBackdrop(camera) {
    const d = 40;
    const h = 2 * d * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const w = h * camera.aspect * 1.04;
    const ph = Math.max(w / 2, h * 0.42);
    const pw = Math.max(w, ph * 2);
    camera.getWorldDirection(_fwd);
    _up.set(0, 1, 0).applyQuaternion(camera.quaternion);
    backdrop.quaternion.copy(camera.quaternion);
    backdrop.scale.set(pw, ph, 1);
    backdrop.position.copy(camera.position).addScaledVector(_fwd, d).addScaledVector(_up, h / 2 - ph / 2 + h * 0.01);
  }

  // 芝生：砂場の外形をくり抜いた四角（奥は z=-3.3 で終わり、その先は遠景の写真）
  const sb = LAYOUT.sandbox, fr = LAYOUT.frame;
  const GRASS_FAR = -3.3;
  {
    const tex = keep(grassTexture());
    tex.repeat.set(1 / 1.2, 1 / 1.2);
    const shape = new THREE.Shape();
    shape.moveTo(-7, -GRASS_FAR); shape.lineTo(8, -GRASS_FAR); shape.lineTo(8, -8); shape.lineTo(-7, -8); shape.lineTo(-7, -GRASS_FAR);
    const hole = new THREE.Path();
    const x0 = sb.minX - fr.thick, x1 = sb.maxX + fr.thick, z0 = sb.minZ - fr.thick, z1 = sb.maxZ + fr.thick;
    // ShapeGeometry は xy 平面。回転で y→-z になるので z を反転して置く
    hole.moveTo(x0, -z0); hole.lineTo(x0, -z1); hole.lineTo(x1, -z1); hole.lineTo(x1, -z0); hole.lineTo(x0, -z0);
    shape.holes.push(hole);
    const geo = keep(new THREE.ShapeGeometry(shape, 1));
    geo.rotateX(-Math.PI / 2);
    // UV を世界座標から
    const p = geo.attributes.position, uv = geo.attributes.uv;
    for (let i = 0; i < p.count; i++) uv.setXY(i, p.getX(i), p.getZ(i));
    const mat = keep(new THREE.MeshLambertMaterial({ map: tex, color: 0xffffff }));
    const g = new THREE.Mesh(geo, mat);
    g.receiveShadow = tier.shadows;
    g.name = 'grass';
    group.add(g);
  }

  // 砂場の木枠（右辺は出入口）
  {
    const tex = keep(loadTex('wood_frame_512', { aniso: 4 }));
    const mat = keep(new THREE.MeshLambertMaterial({ map: tex, color: 0xf4e8d8 }));
    const h = fr.top - fr.bottom, yc = (fr.top + fr.bottom) / 2, t = fr.thick;
    const boards = [
      [sb.minX - t / 2, (sb.minZ + sb.maxZ) / 2, t, sb.maxZ - sb.minZ + 2 * t],
      [sb.maxX + t / 2, (sb.minZ + sb.maxZ) / 2, t, sb.maxZ - sb.minZ + 2 * t],
      [(sb.minX + sb.maxX) / 2, sb.minZ - t / 2, sb.maxX - sb.minX, t],
      [(sb.minX + fr.gapMinX) / 2, sb.maxZ + t / 2, fr.gapMinX - sb.minX, t],
      [(fr.gapMaxX + sb.maxX) / 2, sb.maxZ + t / 2, sb.maxX - fr.gapMaxX, t],
    ];
    for (const [x, z, w, d] of boards) {
      const geo = keep(new THREE.BoxGeometry(w, h, d));
      const len = Math.max(w, d);
      const uv = geo.attributes.uv;
      for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * len * 1.4, uv.getY(i) * 0.35);
      const m = new THREE.Mesh(geo, mat);
      m.position.set(x, yc, z);
      m.castShadow = tier.shadows; m.receiveShadow = tier.shadows;
      m.name = 'frame';
      group.add(m);
    }
    // 出入口の床（砂色の板）と、その下の壁
    const sandMat = keep(new THREE.MeshLambertMaterial({ map: shared.sandDry, color: 0xe8d2a8 }));
    const gapGeo = keep(new THREE.PlaneGeometry(fr.gapMaxX - fr.gapMinX, t + 0.02));
    gapGeo.rotateX(-Math.PI / 2);
    const gap = new THREE.Mesh(gapGeo, sandMat);
    gap.position.set((fr.gapMinX + fr.gapMaxX) / 2, 0.001, sb.maxZ + t / 2);
    gap.receiveShadow = tier.shadows;
    group.add(gap);
    const skirtGeo = keep(new THREE.PlaneGeometry(fr.gapMaxX - fr.gapMinX, -fr.bottom));
    const skirtMat = keep(new THREE.MeshLambertMaterial({ map: shared.sandWet, color: 0xb59a74, side: THREE.DoubleSide }));
    const skirt = new THREE.Mesh(skirtGeo, skirtMat);
    skirt.position.set((fr.gapMinX + fr.gapMaxX) / 2, fr.bottom / 2, sb.maxZ + 0.001);
    group.add(skirt);
    // 砂場の底（穴の下が抜けて見えないように）
    const floorGeo = keep(new THREE.PlaneGeometry(sb.maxX - sb.minX, sb.maxZ - sb.minZ));
    floorGeo.rotateX(-Math.PI / 2);
    const floor = new THREE.Mesh(floorGeo, skirtMat);
    floor.position.set((sb.minX + sb.maxX) / 2, fr.bottom, (sb.minZ + sb.maxZ) / 2);
    group.add(floor);
  }

  // 奥の低ポリの生け垣（芝生と写真の継ぎ目を隠す）：InstancedMesh 1つ
  {
    const geo = keep(new THREE.IcosahedronGeometry(1, 1));
    const mat = keep(new THREE.MeshLambertMaterial({ color: 0x5f9e48 }));
    const spots = [];
    for (let i = 0; i < 16; i++) {
      const x = -6 + i * 0.85, r = 0.32 + ((i * 37) % 7) * 0.03;
      spots.push([x, GRASS_FAR - 0.1 + ((i * 13) % 5) * 0.06, r]);
    }
    spots.push([-3.2, -1.8, 0.45], [4.6, -1.4, 0.5]);
    const inst = new THREE.InstancedMesh(geo, mat, spots.length);
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), p = new THREE.Vector3();
    spots.forEach(([x, z, r], i) => {
      p.set(x, r * 0.25, z); s.set(r * 1.4, r * 0.6, r);
      inst.setMatrixAt(i, m4.compose(p, q, s));
    });
    inst.castShadow = false;
    inst.name = 'bushes';
    group.add(inst);
  }

  // ライト：半球光＋太陽1灯（影は 512² まで）
  const hemi = new THREE.HemisphereLight(0xeef7ff, 0xb89a68, 1.35);
  group.add(hemi);
  const sun = new THREE.DirectionalLight(0xfff0d8, 2.3);
  sun.position.set(-1.8, 5.5, 3.2);
  sun.target.position.set(0.2, 0, 0.5);
  const sunOffset = sun.position.clone().sub(sun.target.position);
  group.add(sun, sun.target);
  if (tier.shadows) {
    sun.castShadow = true;
    sun.shadow.mapSize.set(tier.shadowMapSize, tier.shadowMapSize);
    const c = sun.shadow.camera;
    c.left = -2.6; c.right = 2.6; c.top = 2.4; c.bottom = -2.4; c.near = 0.5; c.far = 12;
    c.updateProjectionMatrix();
    sun.shadow.bias = -0.0008;
    sun.shadow.normalBias = 0.015;
    sun.shadow.radius = 1.6; // PCF の5点を少し広げて、寄った時の影の縁を柔らかく
  }

  // 影の範囲をカメラの注視点に合わせる（影の画像 512² は変えずに、寄った時は狭い範囲へ細かく使う）。
  // 動いても影がちらつかないよう、光から見た平面で影の画素の格子にそろえる。
  const lz = sunOffset.clone().normalize();
  const lx = new THREE.Vector3(0, 1, 0).cross(lz).normalize();
  const ly = lz.clone().cross(lx);
  const _c = new THREE.Vector3();
  let shadowExt = 2.4;
  function followShadow(focus, visibleHalf) {
    if (!tier.shadows) return;
    const ext = THREE.MathUtils.clamp(visibleHalf * 1.55, 1.25, 2.6);
    if (Math.abs(ext - shadowExt) > 1e-3) {
      shadowExt = ext;
      const c = sun.shadow.camera;
      c.left = -ext; c.right = ext; c.top = ext * 0.92; c.bottom = -ext * 0.92;
      c.updateProjectionMatrix();
    }
    const texel = (2 * shadowExt) / tier.shadowMapSize;
    const x = Math.round(focus.dot(lx) / texel) * texel, y = Math.round(focus.dot(ly) / texel) * texel, z = focus.dot(lz);
    _c.copy(lx).multiplyScalar(x).addScaledVector(ly, y).addScaledVector(lz, z);
    sun.target.position.copy(_c);
    sun.position.copy(_c).add(sunOffset);
    sun.target.updateMatrixWorld();
    sun.updateMatrixWorld();
  }

  return {
    group,
    sun,
    fitBackdrop,
    // 毎フレーム、カメラを動かした後に呼ぶ
    followView(camera, focus, visibleHalf) { fitBackdrop(camera); followShadow(focus, visibleHalf); },
    dispose() {
      for (const d of disposables) d.dispose?.();
      scene.remove(group);
    },
  };
}
