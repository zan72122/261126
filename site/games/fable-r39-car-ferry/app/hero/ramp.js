// The stern ramp: a main section hinged at the deck edge and an outer section hinged to it.
// Down: both in line from the deck to the quay. Raised: main at 60°, outer folded back onto it (low stern door).
// A tiny vertex-shader twist keeps the tip flat on the quay while the hinge rolls with the ship.
import { P, COL } from './params.js';

export function buildRamp(THREE, kit, { textures, hintColor, own }) {
  const { Builder, mat } = kit;
  const L = P.rampLen, L1 = P.rampMain, W = P.rampW, hw = W / 2;
  const thick = (s) => P.rampT + (P.rampTipT - P.rampT) * (s / L);

  // geometry in "ramp coordinates": x across, y up from the driving surface, z = -s (s = distance from the hinge)
  function section(s0, s1, isMain) {
    const S = new Builder(); // driving surface (deck texture)
    const n = 4;
    S.grid(n + 1, 3, (i, j, o) => { const s = s0 + ((s1 - s0) * i) / n; o.x = (j - 1) * (hw - 0.14); o.y = 0; o.z = -s; o.u = o.x / P.deckUv; o.v = (P.sternZ - s) / P.deckUv; o.color = COL.rampTint; }, { flip: true });
    const B = new Builder(); // painted steel
    const t0 = thick(s0), t1 = thick(s1);
    // underside and edges
    B.quad([-hw, -t0, -s0], [-hw, -t1, -s1], [hw, -t1, -s1], [hw, -t0, -s0], COL.hullWhite);
    for (const sx of [1, -1]) {
      const a = [sx * hw, 0.13, -s0], b = [sx * hw, 0.13, -s1], c = [sx * hw, -t1, -s1], d = [sx * hw, -t0, -s0];
      if (sx > 0) B.quad(a, d, c, b, COL.band); else B.quad(a, b, c, d, COL.band);
    }
    B.quad([-hw, -t1, -s1], [-hw, 0.0, -s1], [hw, 0.0, -s1], [hw, -t1, -s1], isMain ? COL.steel : COL.yellow);
    B.quad([hw, -t0, -s0], [hw, 0.0, -s0], [-hw, 0.0, -s0], [-hw, -t0, -s0], COL.steel);
    // curbs with hazard blocks
    const nb = Math.round((s1 - s0) / 0.36), bl = (s1 - s0) / nb;
    for (let k = 0; k < nb; k++) for (const sx of [1, -1]) {
      B.box(0.14, 0.13, bl, (k + (isMain ? 0 : 1)) % 2 ? COL.hazard : COL.yellow, sx * (hw - 0.07), 0.065, -(s0 + (k + 0.5) * bl));
    }
    // chevrons that point up into the ship (tread bars)
    const cs = isMain ? [0.55, 1.4, 2.25] : [3.3, 4.05];
    for (const s of cs) for (const sx of [1, -1]) B.box(0.95, 0.035, 0.14, COL.yellow, sx * 0.4, 0.018, -s + 0.02, 0, sx * 0.62, 0);
    // ribs under the plate
    for (const x of [-1.2, 1.2]) B.box(0.12, 0.1, s1 - s0 - 0.1, COL.band, x, -(t0 + t1) / 2 - 0.04, -(s0 + s1) / 2, (t1 - t0) / (s1 - s0), 0, 0);
    if (isMain) {
      // hinge barrels at the deck edge and at the fold
      for (const x of [-1.25, 0, 1.25]) {
        B.add(new THREE.CylinderGeometry(0.1, 0.1, 0.7, 7), COL.steel, mat(x, -0.1, 0.0, 0, 0, Math.PI / 2));
        B.add(new THREE.CylinderGeometry(0.08, 0.08, 0.6, 7), COL.steel, mat(x, -0.08, -L1, 0, 0, Math.PI / 2));
      }
      // a heart under the plate: this side faces the sea camera when the ramp is up
      const sh = new THREE.Shape();
      sh.moveTo(0, -0.55); sh.bezierCurveTo(-0.95, 0.05, -0.62, 0.72, 0, 0.3); sh.bezierCurveTo(0.62, 0.72, 0.95, 0.05, 0, -0.55);
      B.add(new THREE.ShapeGeometry(sh, 6), 0xff7fa6, mat(0, -thick(1.5) - 0.012, -1.5, Math.PI / 2, 0, Math.PI, 1.15, 1.75, 1));
      for (const sx of [1, -1]) B.box(0.16, 0.2, 0.3, COL.yellow, sx * (hw - 0.08), 0.2, -P.cableAt); // cable lugs
    }
    return { surface: S.build({ uvScale: P.deckUv }), paint: B.build({ uvScale: P.hullUv }), tris: S.tris + B.tris };
  }
  const gMain = section(0, L1, true), gFlap = section(L1, L, false);
  own(gMain.surface); own(gMain.paint); own(gFlap.surface); own(gFlap.paint);

  // ---- materials (own instances: they glow as a hint and carry the twist) ----
  const uTwist = { value: 0 };
  const twist = (m) => {
    m.onBeforeCompile = (shader) => {
      shader.uniforms.uRampTwist = uTwist;
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', '#include <common>\nuniform float uRampTwist;')
        .replace('#include <begin_vertex>', '#include <begin_vertex>\ntransformed.y += uRampTwist * transformed.x * ( - transformed.z );');
    };
    m.customProgramCacheKey = () => 'ferry-ramp-twist';
    return m;
  };
  const surfMat = own(twist(new THREE.MeshLambertMaterial({ color: textures.deck ? 0xffffff : 0x2f9a5e, vertexColors: true, map: textures.deck || null, emissive: 0x000000 })));
  const paintMat = own(twist(new THREE.MeshLambertMaterial({ color: 0xffffff, vertexColors: true, map: textures.hull || null, emissive: 0x000000 })));

  const pivot = new THREE.Group(); pivot.name = 'rampPivot'; pivot.position.set(0, P.deckY, P.sternZ);
  const fold = new THREE.Group(); fold.name = 'rampFold'; fold.position.set(0, 0, -L1); pivot.add(fold);
  const meshes = [];
  for (const [g, parent, dz] of [[gMain, pivot, 0], [gFlap, fold, L1]]) {
    for (const [geo, m] of [[g.surface, surfMat], [g.paint, paintMat]]) {
      const mesh = new THREE.Mesh(geo, m); mesh.position.z = dz; mesh.frustumCulled = false; parent.add(mesh); meshes.push(mesh);
    }
  }
  // touch boxes (a little bigger than the plates)
  const hitMat = own(new THREE.MeshBasicMaterial({ visible: false }));
  const hgMain = own(new THREE.BoxGeometry(W + 0.5, 0.7, L1 + 0.2)); hgMain.translate(0, 0.05, -L1 / 2);
  const hgFlap = own(new THREE.BoxGeometry(W + 0.5, 0.7, L - L1 + 0.5)); hgFlap.translate(0, 0.05, -(L - L1) / 2 - 0.15);
  const hitMain = new THREE.Mesh(hgMain, hitMat), hitFlap = new THREE.Mesh(hgFlap, hitMat);
  hitMain.visible = false; hitFlap.visible = false; pivot.add(hitMain); fold.add(hitFlap);

  // ---- cables from the gate towers to the ramp (instanced: one draw call) ----
  const cableGeo = own(new THREE.CylinderGeometry(0.028, 0.028, 1, 5, 1, true)); cableGeo.translate(0, 0.5, 0);
  const cableMat = own(new THREE.MeshLambertMaterial({ color: COL.dark }));
  const cables = new THREE.InstancedMesh(cableGeo, cableMat, 2); cables.frustumCulled = false; cables.name = 'rampCables';
  const a = new THREE.Vector3(), b = new THREE.Vector3(), d = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0);
  const q = new THREE.Quaternion(), s = new THREE.Vector3(), m4 = new THREE.Matrix4();
  /** cables live in the hull frame (same parent as the pivot) */
  function updateCables() {
    pivot.updateMatrix();
    for (let k = 0; k < 2; k++) {
      const sx = k === 0 ? 1 : -1;
      a.set(sx * (P.towerX - 0.06), P.deckY + P.towerH - 0.16, P.sternZ + 0.02);
      b.set(sx * (hw - 0.08), 0.3, -P.cableAt).applyMatrix4(pivot.matrix);
      d.subVectors(b, a); const len = Math.max(d.length(), 1e-3); d.multiplyScalar(1 / len);
      q.setFromUnitVectors(up, d); s.set(1, len, 1);
      cables.setMatrixAt(k, m4.compose(a, q, s));
    }
    cables.instanceMatrix.needsUpdate = true;
  }

  const glowC = new THREE.Color();
  return {
    pivot, fold, cables, meshes, hits: [hitMain, hitFlap], tris: gMain.tris + gFlap.tris + 20,
    /** main: pivot rotation.x (+ = tip up), foldA: outer section's extra rotation (+ = folds back over the main section) */
    pose(main, foldA) { pivot.rotation.x = main; fold.rotation.x = foldA; },
    setTwist(k) { uTwist.value = Number.isFinite(k) ? k : 0; },
    setGlow(v) { glowC.copy(hintColor).multiplyScalar(v); surfMat.emissive.copy(glowC).multiplyScalar(0.55); paintMat.emissive.copy(glowC); },
    setTextures(t) {
      if (t.deck) { surfMat.map = t.deck; surfMat.color.set(0xffffff); surfMat.needsUpdate = true; }
      if (t.hull) { paintMat.map = t.hull; paintMat.needsUpdate = true; }
    },
    updateCables,
  };
}
