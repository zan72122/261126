// Particles (hearts, stars, drops, puffs, glow rings, wake foam) in ONE instanced draw call.
import * as THREE from './three.js';
import { makeParticleAtlas } from './textures.js';

export const CELL = { heart: 0, star: 1, drop: 2, puff: 3, ring: 4 };
const CELLS = 8;

export function createFx(scene, max) {
  const atlas = makeParticleAtlas();
  const geo = new THREE.PlaneGeometry(1, 1);
  const aCell = new THREE.InstancedBufferAttribute(new Float32Array(max), 1);
  const aAlpha = new THREE.InstancedBufferAttribute(new Float32Array(max), 1);
  aCell.setUsage(THREE.DynamicDrawUsage); aAlpha.setUsage(THREE.DynamicDrawUsage);
  geo.setAttribute('aCell', aCell); geo.setAttribute('aAlpha', aAlpha);
  const mat = new THREE.ShaderMaterial({
    uniforms: { uMap: { value: atlas } },
    transparent: true, depthWrite: false,
    vertexShader: /* glsl */`
      attribute float aCell; attribute float aAlpha;
      varying vec2 vUv; varying float vAlpha; varying vec3 vColor;
      void main() {
        vUv = vec2((uv.x + aCell) / ${CELLS}.0, uv.y);
        vAlpha = aAlpha;
        #ifdef USE_INSTANCING_COLOR
          vColor = instanceColor;
        #else
          vColor = vec3(1.0);
        #endif
        gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: /* glsl */`
      uniform sampler2D uMap; varying vec2 vUv; varying float vAlpha; varying vec3 vColor;
      void main() {
        vec4 t = texture2D(uMap, vUv);
        float a = t.a * vAlpha;
        if (a < 0.01) discard;
        gl_FragColor = vec4(vColor * t.rgb, a);
        #include <colorspace_fragment>
      }`,
  });
  const mesh = new THREE.InstancedMesh(geo, mat, max);
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  mesh.setColorAt(0, new THREE.Color(1, 1, 1)); mesh.instanceColor.setUsage(THREE.DynamicDrawUsage);
  mesh.frustumCulled = false; mesh.renderOrder = 5; mesh.count = 0; mesh.name = 'fx';
  scene.add(mesh);

  const parts = []; // live particles
  const immediates = []; // one-frame quads (hint rings)
  const col = new THREE.Color(), m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), qFlat = new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0));
  const s3 = new THREE.Vector3(), p3 = new THREE.Vector3(), qz = new THREE.Quaternion(), zAxis = new THREE.Vector3(0, 0, 1);

  function spawn(o) {
    if (parts.length >= max - 16) parts.shift();
    parts.push({
      cell: CELL[o.type] ?? 0, pos: o.pos.clone(), vel: o.vel ? o.vel.clone() : new THREE.Vector3(),
      life: o.life ?? 1.2, age: 0, size: o.size ?? 0.6, grow: o.grow ?? 0, gravity: o.gravity ?? 0,
      color: new THREE.Color(o.color ?? 0xffffff), flat: !!o.flat, spin: o.spin ?? 0, rot: Math.random() * 6.28, fadeIn: o.fadeIn ?? 0.08, alpha: o.alpha ?? 1, drag: o.drag ?? 0,
    });
  }
  function burst(type, pos, n, o = {}) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, sp = (o.speed ?? 2) * (0.5 + Math.random() * 0.7);
      spawn({
        type, pos, life: (o.life ?? 1.2) * (0.8 + Math.random() * 0.4), size: (o.size ?? 0.6) * (0.75 + Math.random() * 0.5),
        vel: new THREE.Vector3(Math.cos(a) * sp * (o.spread ?? 0.6), (o.up ?? 2.5) * (0.7 + Math.random() * 0.6), Math.sin(a) * sp * (o.spread ?? 0.6)),
        gravity: o.gravity ?? -2, color: Array.isArray(o.color) ? o.color[i % o.color.length] : o.color, spin: o.spin ?? 0, grow: o.grow ?? 0, drag: o.drag ?? 0.5,
      });
    }
  }
  /** a flat glowing ring for this frame only (hints) */
  function ring(pos, size, alpha, color = 0xffe27a) { immediates.push({ pos, size, alpha, color }); }

  function update(dt, camera) {
    let n = 0;
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i]; p.age += dt;
      if (p.age >= p.life) { parts.splice(i, 1); continue; }
      p.vel.y += p.gravity * dt; p.vel.multiplyScalar(Math.max(0, 1 - p.drag * dt));
      p.pos.addScaledVector(p.vel, dt); p.rot += p.spin * dt;
    }
    for (const p of parts) {
      if (n >= max) break;
      const k = p.age / p.life; const a = Math.min(1, p.age / Math.max(p.fadeIn, 1e-3)) * (1 - k * k) * p.alpha;
      const s = p.size * (1 + p.grow * k);
      if (p.flat) q.copy(qFlat); else q.copy(camera.quaternion);
      if (p.spin) q.multiply(qz.setFromAxisAngle(zAxis, p.rot));
      m4.compose(p.pos, q, s3.set(s, s, s)); mesh.setMatrixAt(n, m4);
      mesh.setColorAt(n, p.color); aCell.array[n] = p.cell; aAlpha.array[n] = a; n++;
    }
    for (const r of immediates) {
      if (n >= max) break;
      m4.compose(p3.copy(r.pos), qFlat, s3.set(r.size, r.size, r.size)); mesh.setMatrixAt(n, m4);
      mesh.setColorAt(n, col.set(r.color)); aCell.array[n] = CELL.ring; aAlpha.array[n] = r.alpha; n++;
    }
    immediates.length = 0;
    mesh.count = n;
    mesh.instanceMatrix.needsUpdate = true; if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    aCell.needsUpdate = true; aAlpha.needsUpdate = true;
  }
  return { spawn, burst, ring, update, mesh, get count() { return parts.length; }, dispose() { geo.dispose(); mat.dispose(); atlas.dispose(); } };
}
