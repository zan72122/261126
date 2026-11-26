// The lit living room + lights, and the light-state blend (lamp on <-> candle only).
import * as THREE from 'three';
import { E } from './engine.js';
import { buildRoom, ROOM } from './room.js';
import { Candle } from './candle.js';

export function buildStage() {
  const S = {};
  const room = buildRoom(E.scene);
  S.room = room;
  // pendant spot (2700K)
  const spot = new THREE.SpotLight(0xffd8b4, 0, 8, 1.05, 0.85, 2);
  spot.position.set(0.02, 1.74, 0.02);
  spot.target.position.set(0.02, 0, 0.05);
  spot.castShadow = true;
  spot.shadow.mapSize.set(1024, 1024);
  spot.shadow.camera.near = 0.2; spot.shadow.camera.far = 4;
  spot.shadow.bias = -0.0004; spot.shadow.normalBias = 0.01; spot.shadow.radius = 6;
  E.scene.add(spot, spot.target);
  // light inside the shade lighting the ceiling
  const up = new THREE.PointLight(0xffb070, 0, 5, 2); up.position.set(0.02, 1.86, 0.02); E.scene.add(up);
  // warm floor lamp in the right-front corner (bounce / fill)
  const fill = new THREE.PointLight(0xffdcc0, 0, 9, 2); fill.position.set(2.1, 1.5, 1.8); E.scene.add(fill);
  // cool moonlight through the window
  const moon = new THREE.DirectionalLight(0x9fb6ff, 0);
  moon.position.set(2.2, 3.2, -4.5); moon.target.position.set(0, 0.7, 0.3);
  moon.castShadow = false;
  const mc = moon.shadow.camera; mc.left = -2.5; mc.right = 2.5; mc.top = 2.5; mc.bottom = -2.5; mc.near = 1; mc.far = 10;
  moon.shadow.bias = -0.0006; moon.shadow.radius = 4; moon.shadow.normalBias = 0.02;
  E.scene.add(moon, moon.target);
  // soft hemispheric fill so faces never go black
  const hemi = new THREE.HemisphereLight(0x8090b8, 0x2a1a10, 0);
  E.scene.add(hemi);
  // tea lights on the sideboard
  const teas = [];
  for (const p of room.teaPos) {
    const c = new Candle({ radius: 0.02, height: 0.035, intensity: 0.35, halo: 0.6 });
    const wp = p.clone(); room.sideboard.localToWorld(wp);
    c.group.position.copy(wp); E.scene.add(c.group); teas.push(c);
  }
  S.lights = { spot, up, fill, moon, hemi, teas };
  S.dark = 0; S.darkTarget = 0;
  S.update = (dt, t) => {
    S.dark += (S.darkTarget - S.dark) * Math.min(1, dt * 2.2);
    const on = 1 - S.dark;
    spot.intensity = 9.5 * on;
    up.intensity = 1.4 * on;
    fill.intensity = 5.5 * on + 0.0;
    moon.intensity = 0.06 + 0.22 * S.dark;
    hemi.intensity = 0.05 + 0.10 * S.dark;
    room.shadeM.emissiveIntensity = 0.85 * on;
    room.bulb.material.color.setRGB(4 * on + 0.02, 3 * on + 0.015, 2 * on + 0.01);
    E.scene.environment = S.dark > 0.5 ? E.env.dark : E.env.lit;
    E.scene.environmentIntensity = S.dark > 0.5 ? 1.0 : 0.9 * on + 0.1;
    for (const c of teas) { c.setLit(S.dark > 0.3); c.update(t, dt, E.camera); }
  };
  return S;
}
