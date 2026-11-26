// 粒子：ハートときらきら。InstancedMesh 2つ（draw call 2）、カメラに向く板。
import * as THREE from 'three';

export function createFx(scene, camera, tex, maxCount) {
  const geo = new THREE.PlaneGeometry(1, 1);
  function system(map, additive, n) {
    const mat = new THREE.MeshBasicMaterial({ map, transparent: true, depthWrite: false, blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending });
    const mesh = new THREE.InstancedMesh(geo, mat, n);
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    mesh.count = 0;
    mesh.frustumCulled = false;
    mesh.renderOrder = 10;
    scene.add(mesh);
    const ps = [];
    for (let i = 0; i < n; i++) ps.push({ life: 0, max: 1, p: new THREE.Vector3(), v: new THREE.Vector3(), s: 0.03, spin: 0 });
    return { mesh, ps, n, next: 0 };
  }
  const nSpark = Math.max(16, Math.floor(maxCount * 0.7));
  const nHeart = Math.max(8, Math.floor(maxCount * 0.3));
  const sys = { sparkle: system(tex.sparkle, true, nSpark), heart: system(tex.heart, false, nHeart) };
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), rq = new THREE.Quaternion(), tq = new THREE.Quaternion(), zAxis = new THREE.Vector3(0, 0, 1);

  function burst(pos, kind = 'sparkle', count = 10, spread = 1) {
    const S = sys[kind];
    if (!S) return;
    for (let k = 0; k < count; k++) {
      const P = S.ps[S.next];
      S.next = (S.next + 1) % S.n;
      P.p.copy(pos);
      const a = Math.random() * Math.PI * 2, up = Math.random();
      if (kind === 'heart') { P.v.set(Math.cos(a) * 0.12 * spread, 0.25 + up * 0.2, Math.sin(a) * 0.05); P.max = 1.3 + Math.random() * 0.4; P.s = 0.05 + Math.random() * 0.025; }
      else { P.v.set(Math.cos(a) * 0.35 * spread * up, (Math.random() * 0.4 + 0.1) * spread, Math.sin(a) * 0.2 * spread * up); P.max = 0.5 + Math.random() * 0.4; P.s = 0.03 + Math.random() * 0.03; }
      P.life = P.max; P.spin = (Math.random() - 0.5) * 4;
    }
  }

  function update(dt) {
    q.copy(camera.quaternion);
    for (const key in sys) {
      const S = sys[key];
      let c = 0;
      for (const P of S.ps) {
        if (P.life <= 0) continue;
        P.life -= dt;
        if (P.life <= 0) continue;
        P.p.addScaledVector(P.v, dt);
        if (key === 'sparkle') P.v.y -= 0.6 * dt; else P.v.multiplyScalar(Math.exp(-dt * 0.8));
        const k = P.life / P.max;
        const sc = P.s * (key === 'heart' ? Math.min(1, (1 - k) * 6) * (0.6 + 0.4 * k) : k);
        rq.setFromAxisAngle(zAxis, P.spin * (1 - k));
        s.set(sc, sc, sc);
        m.compose(P.p, tq.copy(q).multiply(rq), s);
        S.mesh.setMatrixAt(c++, m);
      }
      S.mesh.count = c;
      S.mesh.instanceMatrix.needsUpdate = true;
    }
  }

  return { burst, update };
}
