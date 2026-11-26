// All tunable numbers of the hero in one place (units: m, s, rad). See docs/HERO-SPEC.md §9/§10 and docs/hero-notes.md.
const DEG = Math.PI / 180;

export const P = {
  // ---- hull ----
  length: 20, beam: 8, sternZ: -10, bowZ: 10,
  deckY: 2.0, keelY: -1.0, sheerY: 2.7, sheerRise: 1.0, // bulwark top; it rises toward the bow
  foreStartZ: 2.5, foreExp: 2.3, bowRake: 2.6, // forebody: superellipse plan, raked stem
  aftTaper: 0.07, aftTuck: 0.11, // stern is a little narrower, more so at the bottom
  bulwarkT: 0.22,
  bootY: 0.3, bandLo: 1.15, bandHi: 0.72, // red bottom up to bootY; colored band between (sheer-bandLo) and (sheer-bandHi)
  hullUv: 5.0, deckUv: 5.5,

  // ---- car deck ----
  deckHalfW: 3.4, deckFrontZ: 4.8,
  slots: [[1.9, -6.8], [-1.9, -6.8], [1.9, -3.8], [-1.9, -3.8], [1.9, -0.8], [-1.9, -0.8]], // filled in this order when the finger gives no place
  slotPitch: 3.0,

  // ---- superstructure ----
  cabinZ0: 5.0, cabinZ1: 9.4, cabinNoseZ: 8.2, cabinHalfW: 3.2, cabinTop: 4.5,
  houseZ0: 5.6, houseZ1: 8.6, houseHalfW: 1.9, houseTop: 6.1, roofY: 6.22, // flat roof: the shell's gulls sit at y≈6.25
  funnelX: 2.68, funnelZ: 6.0, funnelR: 0.46, funnelTop: 8.0,

  // ---- ramp (hinge at the stern edge of the deck) ----
  rampLen: 4.6, rampMain: 2.9, rampW: 3.6, rampT: 0.25, rampTipT: 0.07,
  rampClosed: 60 * DEG, rampFold: 164 * DEG, // raised: main section 60° up, outer section folded back onto it (low, so it does not hide the deck)
  rampLowerTime: 1.25, rampRaiseTime: 1.3, rampDockDelay: 0.15,
  rampBounce: 2 * DEG, rampBounceTime: 0.14,
  towerX: 2.02, towerH: 2.5, cableAt: 2.5,
  footBeyond: 1.3, // getRampFoot: this far beyond the full ramp length on the quay (root z = sternZ - rampLen - footBeyond = -15.9)

  // ---- mooring lines ----
  cleats: [[3.38, 2.9, -9.78], [-3.38, 2.9, -9.78]], // bitts on top of the stern bulwark corners
  lineSeg: 13, lineR: 0.045, lineSides: 6, lineThrow: 0.5, lineStagger: 0.12, lineTighten: 0.32, lineRelease: 1.0,
  sagTaut: 0.05, sagLoose: 2.0,

  // ---- ship motion (damped springs) ----
  sinkPerCar: 0.06, pitchK: 0.006, pitchRefZ: -3.8, rollK: 0.015,
  omega: 2 * Math.PI * 0.55, zeta: 0.22,
  landKick: 0.35, hopKick: 0.28, dropKick: 0.24, pokeKick: 0.22, liftKick: 0.1,
  kickPitch: 0.016, kickRoll: 0.06,
  maxPitch: 0.06, maxRoll: 0.09, maxSink: 0.62,
  turnRoll: 0.05, accelPitch: 0.01,
  waveHeave: 0.04, wavePitch: 0.006, waveRoll: 0.01,

  // ---- cars ----
  car: {
    length: 2.6, width: 1.6, wheelbase: 1.7, wheelR: 0.36, wheelW: 0.3, track: 0.7,
    bodyLo: 0.25, bodyHi: 0.95, seatY: 0.75, seatZ: -0.15, cargoY: 1.0, cargoZ: -0.85,
  },
  carSpeed: 4.0, carAccel: 4.5, carBrake: 6.5, rampSpeed: 3.2, exitSpeed: 1.8,
  gap: 3.1, // centre distance between cars that follow each other in the ramp / aisle corridor
  unloadInterval: 0.6,
  hopInTime: 0.4, hopInH: 0.5, hopOutTime: 0.5, hopOutH: 0.7, settleTime: 0.3,
  dragLift: 0.4, dragOver: 1.25,
  stage: [[-3.0, -15.5], [-5.8, -15.5], [-8.6, -15.5], [-11.4, -15.5]], // where boarding cars wait while others drive off: a queue along the quay edge, clear of the exit lane and of the shell's waiting places
  rushTime: 0.9, // undock(): cars still on the way are hurried so that the ramp is clear in this time

  // ---- hints ----
  hintPeriod: 1.2, hopPeriod: 2.0, hopTime: 0.35, hopH: 0.18, rampTap: 1.5 * DEG,
};

export const COL = {
  hullWhite: 0xfbfbf6, hullBottom: 0xd3443b, band: 0x2f6fd6, bandLight: 0x79aef2,
  cabin: 0xffffff, cabinShade: 0xe8eef4, roof: 0xf2f5f8, trim: 0x2f6fd6,
  glass: 0x3f8fd8, glassLight: 0xa9dcff, door: 0xff8a5c,
  funnel: 0xffc93d, funnelBand: 0xf0564a, funnelCap: 0x35363c,
  rail: 0xf4f6f8, steel: 0x8f9aa6, dark: 0x30333a, rubber: 0x2a2b30,
  yellow: 0xffd23a, hazard: 0x34363d, lineWhite: 0xf6f6ee, rope: 0xead7a8, red: 0xe9483f, wood: 0xc98d55,
  deckTint: 0xffffff, rampTint: 0xf2fff2,
};
