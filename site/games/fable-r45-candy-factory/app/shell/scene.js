// 部屋・作業台・光・カメラ（遠景は低ポリ＋写真風テクスチャ、または板）
import * as THREE from 'three';
import { LAYOUT } from './config.js';

export function createRenderer(canvas) {
  const renderer = new THREE.WebGLRenderer({
    canvas, antialias: false, alpha: false, depth: true, stencil: false,
    powerPreference: 'high-performance', preserveDrawingBuffer: false,
  });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NoToneMapping;
  renderer.shadowMap.enabled = false;
  renderer.info.autoReset = true;
  renderer.setClearColor(0xfbe9e4, 1);
  return renderer;
}

export function createCamera() {
  const cam = new THREE.PerspectiveCamera(LAYOUT.baseVFov, LAYOUT.baseAspect, 0.05, 20);
  cam.position.fromArray(LAYOUT.camPos);
  cam.lookAt(new THREE.Vector3().fromArray(LAYOUT.camTarget));
  return cam;
}

// 横の範囲を保つ：4:3 より縦長なら縦画角を広げる
export function fitCamera(cam, aspect) {
  const baseH = THREE.MathUtils.degToRad(LAYOUT.baseVFov);
  let v = baseH;
  if (aspect < LAYOUT.baseAspect) {
    const hHalf = Math.atan(Math.tan(baseH / 2) * LAYOUT.baseAspect);
    v = 2 * Math.atan(Math.tan(hHalf) / aspect);
  }
  cam.fov = THREE.MathUtils.radToDeg(v);
  cam.aspect = aspect;
  cam.updateProjectionMatrix();
}

export function createLights(scene) {
  const hemi = new THREE.HemisphereLight(0xfff4f8, 0xd8c8c0, 1.6);
  const key = new THREE.DirectionalLight(0xffffff, 2.2);
  key.position.set(-0.45, 1.0, 0.8).multiplyScalar(3);
  const fill = new THREE.DirectionalLight(0xffeef6, 0.6);
  fill.position.set(1.5, 0.6, 2.0);
  scene.add(hemi, key, fill, key.target, fill.target);
  return { hemi, key, fill };
}

// 部屋（遠景）と台・カウンター・ベンチ
export function createRoom(scene, tex) {
  const room = new THREE.Group();
  room.name = 'room';
  const L = LAYOUT;

  // 奥の壁：ぼけた工房の写真を1枚の板に（ライト不要）
  const wallW = 6.6, wallH = 5.6;
  const wall = new THREE.Mesh(
    new THREE.PlaneGeometry(wallW, wallH),
    new THREE.MeshBasicMaterial({ map: tex.workshop, color: 0xffffff }),
  );
  wall.position.set(0.3, 1.2, L.backdropZ);
  room.add(wall);
  // 写真の外側は同じ色調の板でつなぐ（横長画面用）
  const side = new THREE.MeshBasicMaterial({ color: 0xf6dccf });
  const wl = new THREE.Mesh(new THREE.PlaneGeometry(4, 4), side);
  wl.position.set(0.3 - wallW / 2 - 2, 1.2, L.backdropZ + 0.01);
  const wr = wl.clone(); wr.position.x = 0.3 + wallW / 2 + 2;
  room.add(wl, wr);

  // 床
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(8, 5), new THREE.MeshLambertMaterial({ color: 0xe2b48e }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0.3, -L.table.legH, -0.4);
  room.add(floor);

  // 作業台（天板は steel 512²）
  const T = L.table;
  const tw = T.x1 - T.x0, td = T.z1 - T.z0;
  tex.steel.repeat.set(2, 1);
  const topMat = new THREE.MeshStandardMaterial({ map: tex.steel, color: 0xf4f6fa, metalness: 0.35, roughness: 0.45 });
  const top = new THREE.Mesh(new THREE.BoxGeometry(tw, T.thick, td), topMat);
  top.position.set((T.x0 + T.x1) / 2, -T.thick / 2, (T.z0 + T.z1) / 2);
  room.add(top);
  const legMat = new THREE.MeshStandardMaterial({ color: 0xc9ccd4, metalness: 0.4, roughness: 0.5 });
  const legGeo = new THREE.BoxGeometry(0.05, T.legH, 0.05);
  const legs = new THREE.InstancedMesh(legGeo, legMat, 4);
  const m = new THREE.Matrix4();
  [[T.x0 + 0.06, T.z0 + 0.06], [T.x1 - 0.06, T.z0 + 0.06], [T.x0 + 0.06, T.z1 - 0.06], [T.x1 - 0.06, T.z1 - 0.06]]
    .forEach(([x, z], i) => legs.setMatrixAt(i, m.makeTranslation(x, -T.legH / 2 - T.thick, z)));
  room.add(legs);
  // 前の縁のピンクの帯（かわいさ）
  const trim = new THREE.Mesh(new THREE.BoxGeometry(tw + 0.01, 0.035, 0.012), new THREE.MeshStandardMaterial({ color: 0xff9cc2, roughness: 0.6 }));
  trim.position.set((T.x0 + T.x1) / 2, -0.03, T.z1 + 0.006);
  room.add(trim);

  // お客さんのカウンター（木目）
  const C = L.counter;
  const woodMat = new THREE.MeshStandardMaterial({ map: tex.wood, color: 0xffffff, roughness: 0.75 });
  const counter = new THREE.Mesh(new THREE.BoxGeometry(C.x1 - C.x0, 0.05, C.z1 - C.z0), woodMat);
  counter.position.set((C.x0 + C.x1) / 2, C.top - 0.025, (C.z0 + C.z1) / 2);
  const counterFront = new THREE.Mesh(new THREE.BoxGeometry(C.x1 - C.x0, 0.9, 0.04), new THREE.MeshStandardMaterial({ color: 0xffc6da, roughness: 0.8 }));
  counterFront.position.set((C.x0 + C.x1) / 2, C.top - 0.48, C.z1 - 0.02);
  room.add(counter, counterFront);

  // ベンチ（あげたお客さんが座る）
  const B = L.bench;
  // 窓ぎわの高いベンチ（作業台の奥・お客さんの上に見える）
  const bench = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.05, 0.28), woodMat);
  bench.position.set(B.x, B.y, B.z);
  const benchH = B.y + L.table.legH;
  const bLegs = new THREE.InstancedMesh(new THREE.BoxGeometry(0.05, benchH, 0.05), new THREE.MeshStandardMaterial({ color: 0xd59a6a, roughness: 0.8 }), 4);
  const bm = new THREE.Matrix4();
  [[-0.68, -0.1], [0.68, -0.1], [-0.68, 0.1], [0.68, 0.1]].forEach(([dx, dz], i) => bLegs.setMatrixAt(i, bm.makeTranslation(B.x + dx, B.y - 0.025 - benchH / 2, B.z + dz)));
  room.add(bench, bLegs);

  // 壁の大きな看板キャンディ（candy_stripes の左上 1/4）
  const signGeo = new THREE.CircleGeometry(0.30, 40);
  const uv = signGeo.attributes.uv;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * 0.5, 0.5 + uv.getY(i) * 0.5);
  const sign = new THREE.Mesh(signGeo, new THREE.MeshBasicMaterial({ map: tex.stripes }));
  sign.position.set(-0.6, 0.05, L.backdropZ + 0.05);
  const signStick = new THREE.Mesh(new THREE.PlaneGeometry(0.05, 0.6), new THREE.MeshBasicMaterial({ color: 0xfffaf4 }));
  signStick.position.set(-0.6, -0.5, L.backdropZ + 0.04);
  room.add(sign, signStick);

  scene.add(room);
  return { room, woodMat };
}

// 疑似影（放射グラデーションの板）
export function blobShadow(tex, w, d, opacity = 0.45) {
  const mat = new THREE.MeshBasicMaterial({ map: tex.shadow, transparent: true, opacity, depthWrite: false, color: 0x6a4050 });
  const s = new THREE.Mesh(blobShadow.geo || (blobShadow.geo = new THREE.PlaneGeometry(1, 1)), mat);
  s.rotation.x = -Math.PI / 2;
  s.scale.set(w, d, 1);
  s.renderOrder = -1;
  return s;
}
