// Particles (sugar, cream splats, sparkles), guidance halos, the pointing hand, thought bubbles.
import * as THREE from 'three';
import { rnd, clamp } from './util.js';

function radial(c0, c1, size = 128) {
  const c = document.createElement('canvas'); c.width = c.height = size;
  const g = c.getContext('2d');
  const gr = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gr.addColorStop(0, c0); gr.addColorStop(1, c1);
  g.fillStyle = gr; g.fillRect(0, 0, size, size);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

// ---------------------------------------------------------------- powder / droplet particles (lit, varied size)
export class Particles {
  constructor(scene, max = 1600, kind = 'sugar') {
    this.max = max; this.n = 0;
    this.pos = new Float32Array(max * 3); this.vel = new Float32Array(max * 3);
    this.life = new Float32Array(max); this.size = new Float32Array(max);
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(this.pos, 3));
    g.setAttribute('psize', new THREE.BufferAttribute(this.size, 1));
    g.setAttribute('plife', new THREE.BufferAttribute(this.life, 1));
    const col = kind === 'sugar' ? new THREE.Color(1.0, 0.99, 0.97) : kind === 'spark' ? new THREE.Color(2.4, 2.0, 1.4) : new THREE.Color(0.98, 0.95, 0.9);
    this.mat = new THREE.ShaderMaterial({
      uniforms: { col: { value: col }, scale: { value: 600 }, light: { value: 1 } },
      vertexShader: `attribute float psize; attribute float plife; varying float vL; uniform float scale;
        void main(){ vL = plife; vec4 mv = modelViewMatrix*vec4(position,1.); gl_Position = projectionMatrix*mv; gl_PointSize = psize*scale/-mv.z; }`,
      fragmentShader: `uniform vec3 col; uniform float light; varying float vL;
        void main(){ vec2 p = gl_PointCoord*2.-1.; float r = dot(p,p); if(r>1.) discard;
          float sh = 0.75 + 0.25*(-p.x*0.6 - p.y*0.8); // lit from the window side
          gl_FragColor = vec4(col*sh*light, smoothstep(1.,0.4,r)*clamp(vL*3.,0.,1.)); }`,
      transparent: true, depthWrite: false,
      blending: kind === 'spark' ? THREE.AdditiveBlending : THREE.NormalBlending,
    });
    this.pts = new THREE.Points(g, this.mat); this.pts.frustumCulled = false; this.pts.renderOrder = 5;
    this.kind = kind;
    scene.add(this.pts);
  }
  emit(p, v, size, life) {
    let i = this.n < this.max ? this.n++ : Math.floor(rnd() * this.max);
    this.pos[i * 3] = p.x; this.pos[i * 3 + 1] = p.y; this.pos[i * 3 + 2] = p.z;
    this.vel[i * 3] = v.x; this.vel[i * 3 + 1] = v.y; this.vel[i * 3 + 2] = v.z;
    this.size[i] = size; this.life[i] = life;
  }
  update(dt, floorY = -1, onLand = null) {
    let alive = 0;
    const drag = this.kind === 'sugar' ? 3.5 : 0.6, gr = this.kind === 'sugar' ? 1.6 : this.kind === 'spark' ? -0.05 : 9.8;
    for (let i = 0; i < this.n; i++) {
      if (this.life[i] <= 0) continue;
      this.life[i] -= dt;
      const o = i * 3;
      this.vel[o + 1] -= gr * dt;
      const k = Math.exp(-drag * dt);
      this.vel[o] *= k; this.vel[o + 2] *= k; if (this.kind !== 'drop') this.vel[o + 1] *= k;
      if (this.kind === 'sugar') { this.vel[o] += (rnd() - .5) * 0.02; this.vel[o + 2] += (rnd() - .5) * 0.02; }
      this.pos[o] += this.vel[o] * dt; this.pos[o + 1] += this.vel[o + 1] * dt; this.pos[o + 2] += this.vel[o + 2] * dt;
      if (onLand && this.pos[o + 1] < floorY) { onLand(this.pos[o], this.pos[o + 1], this.pos[o + 2], i); this.life[i] = 0; }
      if (this.life[i] <= 0) { this.size[i] = 0; } else alive++;
    }
    if (!alive) this.n = 0;
    const g = this.pts.geometry;
    g.attributes.position.needsUpdate = true; g.attributes.psize.needsUpdate = true; g.attributes.plife.needsUpdate = true;
  }
}

// ---------------------------------------------------------------- glow halo behind touchable objects
let haloTex = null;
export function makeHalo(size = 0.3) {
  haloTex = haloTex || radial('rgba(255,236,200,0.55)', 'rgba(255,236,200,0)');
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: haloTex, transparent: true, depthWrite: false, depthTest: true, blending: THREE.AdditiveBlending, opacity: 0 }));
  s.scale.setScalar(size); s.renderOrder = 3; s.userData.noRay = true;
  s.userData.base = size;
  return s;
}

// ---------------------------------------------------------------- white pointing hand (soft 3D-looking glove)
export function makeHintHand() {
  const c = document.createElement('canvas'); c.width = c.height = 256;
  const g = c.getContext('2d');
  g.translate(128, 128); g.rotate(-0.5); g.translate(-128, -128);
  const path = () => {
    g.beginPath();
    // index finger up, others curled
    g.moveTo(112, 30); g.quadraticCurveTo(128, 18, 142, 30); g.lineTo(146, 120);
    g.quadraticCurveTo(170, 108, 184, 122); g.quadraticCurveTo(204, 118, 210, 138); g.quadraticCurveTo(226, 140, 226, 162);
    g.lineTo(222, 200); g.quadraticCurveTo(212, 238, 168, 240); g.lineTo(122, 240); g.quadraticCurveTo(92, 236, 84, 206);
    g.lineTo(62, 158); g.quadraticCurveTo(58, 140, 74, 136); g.quadraticCurveTo(92, 136, 106, 162); g.lineTo(110, 40); g.closePath();
  };
  g.shadowColor = 'rgba(0,0,0,0.45)'; g.shadowBlur = 18; g.shadowOffsetY = 8;
  g.fillStyle = '#ffffff'; path(); g.fill();
  g.shadowColor = 'transparent';
  const gr = g.createLinearGradient(60, 30, 230, 240); gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(1, 'rgba(170,160,150,0.45)');
  g.fillStyle = gr; path(); g.fill();
  g.strokeStyle = 'rgba(150,140,130,0.8)'; g.lineWidth = 3; path(); g.stroke();
  g.beginPath(); g.moveTo(146, 150); g.lineTo(150, 196); g.moveTo(184, 150); g.lineTo(186, 196); g.stroke();
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, depthTest: false, depthWrite: false, opacity: 0, toneMapped: false }));
  s.center.set(0.42, 0.9); s.renderOrder = 20; s.userData.noRay = true;
  return s;
}

// ---------------------------------------------------------------- thought bubble with a cake picture
export function makeBubble(img) {
  const S = 512;
  const c = document.createElement('canvas'); c.width = c.height = S;
  const g = c.getContext('2d');
  g.shadowColor = 'rgba(60,40,20,0.35)'; g.shadowBlur = 24; g.shadowOffsetY = 10;
  g.fillStyle = '#fffdf8';
  // cloud
  g.beginPath();
  const bumps = 11;
  for (let i = 0; i <= bumps; i++) { const a = i / bumps * Math.PI * 2; const x = 256 + Math.cos(a) * 190, y = 220 + Math.sin(a) * 160; g.moveTo(x + 62, y); g.arc(x, y, 62, 0, Math.PI * 2); }
  g.fill();
  g.beginPath(); g.ellipse(256, 220, 200, 165, 0, 0, Math.PI * 2); g.fill();
  g.beginPath(); g.arc(150, 430, 26, 0, 7); g.fill(); g.beginPath(); g.arc(112, 480, 15, 0, 7); g.fill();
  g.shadowColor = 'transparent';
  if (img) {
    g.save(); g.beginPath(); g.ellipse(256, 220, 190, 155, 0, 0, Math.PI * 2); g.clip();
    g.drawImage(img, 256 - 190, 220 - 160, 380, 320); g.restore();
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, depthWrite: false, toneMapped: false }));
  s.renderOrder = 10;
  s.center.set(0.25, 0.08);
  return s;
}

// ---------------------------------------------------------------- chocolate stream (glossy tube from spout to surface)
export function makeStream() {
  const mat = new THREE.MeshPhysicalMaterial({ color: 0x2e1308, roughness: 0.1, clearcoat: 1, clearcoatRoughness: 0.03 });
  const geo = new THREE.CylinderGeometry(1, 1, 1, 12, 8, true);
  geo.translate(0, -0.5, 0);
  const m = new THREE.Mesh(geo, mat); m.castShadow = true; m.visible = false; m.userData.noRay = true;
  return m;
}
