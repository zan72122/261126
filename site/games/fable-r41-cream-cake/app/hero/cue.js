// "Here next": when nothing has been squeezed for a moment, a little golden twinkle hops on a free spot of
// the cake (or on the lowest cream once the top is full). One quad, one 64² canvas texture, no light.
export function createCue(THREE, root, field, RAD) {
  const cv = document.createElement('canvas');
  cv.width = cv.height = 64;
  const g = cv.getContext('2d');
  const grd = g.createRadialGradient(32, 32, 3, 32, 32, 31);
  grd.addColorStop(0, 'rgba(255,196,60,0.55)');
  grd.addColorStop(0.55, 'rgba(255,150,120,0.22)');
  grd.addColorStop(1, 'rgba(255,150,120,0)');
  g.fillStyle = grd; g.fillRect(0, 0, 64, 64);
  const star = (r0, r1, fill) => {
    g.beginPath();
    for (let i = 0; i < 8; i++) { const r = i % 2 ? r1 : r0, a = (i * Math.PI) / 4 - Math.PI / 2; g[i ? 'lineTo' : 'moveTo'](32 + r * Math.cos(a), 32 + r * Math.sin(a)); }
    g.closePath(); g.fillStyle = fill; g.fill();
  };
  star(29, 9, 'rgba(240,140,30,0.95)');   // warm rim so it reads on white cream
  star(24, 6.5, 'rgba(255,214,70,1)');
  star(13, 3.5, 'rgba(255,252,235,1)');
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.name = 'hero-cue';
  const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, opacity: 0, toneMapped: false });
  const geo = new THREE.PlaneGeometry(1, 1);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.visible = false; mesh.renderOrder = 4; mesh.name = 'hero-cue';
  root.add(mesh);

  let idle = 0, t = -1, lastX = 9, lastZ = 9, baseY = 0;
  const zAxis = new THREE.Vector3(0, 0, 1), face = new THREE.Vector3();

  function pick() {
    root.updateWorldMatrix(true, false);
    const e = root.matrixWorld.elements;
    let fx = e[2], fz = e[10];                    // camera side (+Z of the world) in cake coordinates
    const fl = Math.hypot(fx, fz) || 1; fx /= fl; fz /= fl;
    let bx = 0, bz = 0, bs = -1e9, bestFree = 0;
    for (let pass = 0; pass < 2; pass++) {
      for (let k = 0; k < 19; k++) {
        const ring = k === 0 ? 0 : k < 7 ? 0.45 : 0.76, a = k < 7 ? (k / 6) * Math.PI * 2 : (k / 12) * Math.PI * 2 + 0.26;
        const x = Math.cos(a) * ring * RAD, z = Math.sin(a) * ring * RAD;
        let free = 0;
        for (let m = 0; m < 9; m++) {
          const px = x + (m ? Math.cos(m * 0.785) * 0.2 : 0), pz = z + (m ? Math.sin(m * 0.785) * 0.2 : 0);
          if (!field.covered(px, pz) && field.heightAt(px, pz) < 0.03) free++;
        }
        const front = x * fx + z * fz;
        const near = Math.hypot(x - lastX, z - lastZ) < 0.3 ? 1 : 0;
        const s = pass === 0 ? (free / 9) * 2 + front * 0.5 + Math.random() * 0.3 - near
          : -field.heightAt(x, z) * 2 + front * 0.35 + Math.random() * 0.2 - near;
        if (s > bs) { bs = s; bx = x; bz = z; bestFree = free; }
      }
      if (pass === 0 && bestFree >= 4) break;     // enough free room there; otherwise invite a second layer on the lowest cream
      if (pass === 0) bs = -1e9;
    }
    lastX = bx; lastZ = bz;
    baseY = field.heightAt(bx, bz) + 0.16;
    mesh.position.set(bx, baseY, bz);
    // face the fixed camera (in front, about 39° up), whatever the turntable angle
    face.set(fx * 0.78, 0.63, fz * 0.78).normalize();
    mesh.quaternion.setFromUnitVectors(zAxis, face);
  }

  return {
    mesh,
    // ok = cream exists, nothing is being squeezed, the cake is not finished
    update(dt, ok) {
      if (!ok) { idle = 0; t = -1; if (mesh.visible) { mesh.visible = false; mat.opacity = 0; } return; }
      idle += dt;
      if (t < 0) { if (idle > 2.4) { pick(); t = 0; mesh.visible = true; } else return; }
      t += dt;
      const k = t / 1.7;
      if (k >= 1) { t = -1; idle = 1.0; mesh.visible = false; mat.opacity = 0; return; }
      const env = Math.min(1, Math.sin(Math.PI * k) * 2.2), hop = Math.abs(Math.sin(k * Math.PI * 3));
      mat.opacity = 0.95 * env;
      const s = (0.3 + 0.1 * hop) * (0.6 + 0.4 * env);
      mesh.scale.set(s, s, s);
      mesh.position.y = baseY + 0.07 * hop;
    },
    get visible() { return mesh.visible; },
    bytes: 64 * 64 * 4,
    dispose() { root.remove(mesh); geo.dispose(); mat.dispose(); tex.dispose(); },
  };
}
