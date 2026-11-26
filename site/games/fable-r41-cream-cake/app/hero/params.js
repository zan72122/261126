// Every number that shapes the cream lives here. Units: 1.0 = 10 cm, seconds, radians.
// The rest of app/hero/ derives geometry and motion from these by formula (no fixed shapes are stored).
export const P = {
  // --- star cross-section: s(θ) = 1 − (1−k)·((1 − cos Nθ)/2)^p, scaled by the tube radius ---
  star: { N: 8, k: 0.70, p: 1.6 },
  a: 0.16,            // nominal tube radius (ridge tips)
  sx: 1.06,           // a laid tube sags: a little wider …
  sy: 0.90,           // … and a little lower than a circle
  rNozzle: 0.6,       // radius at the nozzle mouth, × a (the cream swells after it leaves the tip)
  twist: 0.9,         // ridges slowly wind around the tube, rad per unit of length

  // --- the first blob under the nozzle ("kiss"): rings stacked on a vertical axis ---
  kiss: {
    r: 1.28,                                  // widest radius, × a
    y: [-0.07, 0.035, 0.09, 0.145, 0.19],     // ring heights above the surface it sits on
    w: [0.78, 1.0, 0.97, 0.83, 0.64],         // ring radius, × kiss.r·a
    s0: 0.42,                                 // size in the very first frame (so the touch shows at once)
    tGrow: 0.17,                              // seconds to full size (ease-out-back, overshoots a little)
    over: 1.6,                                // overshoot strength of that ease
  },

  // --- flow ---
  tauIn: 0.12,        // flow(t) = 1 − e^(−t/tauIn)
  tMin: 0.11,         // a tap still squeezes for this long
  tRun: 0.15,         // holding longer than this starts the swirl
  amountT: 2.5,       // seconds of squeezing that count as amount = 1

  // --- finger → anchor ---
  leash: 0.06,        // the anchor is dragged behind the finger on a string this long (kills jitter)
  planeRate: 12,      // how fast the finger plane follows the cream that was there before the stroke (1/s)
  vStill: 0.04,       // anchor speed below which the nozzle swirls fully
  vDrag: 0.16,        // anchor speed above which it does not swirl at all
  tauVUp: 0.03, tauVDown: 0.2, // the speed estimate rises fast and falls slowly

  // --- swirl (soft-serve) ---
  rho0: 0.18,         // radius of the first turn
  rhoPow: 0.7,        // ρ(h) = rho0·(1 − h/headroom)^rhoPow
  omega: 7.6,         // rad/s on the first turn
  omegaMax: 11.5,     // upper turns are smaller, so they go round faster (same cream per second)
  tauRho: 0.10,       // radius follows its target with this time constant
  turnBlend: [0.85, 2.0], // turn 2 rises gradually out of turn 1 → a smooth helix, no step

  // --- tube radius from speed (same cream per second → fast = thin, slow = fat) ---
  vRef: 0.9,          // drag speed that gives radius a
  rMin: 0.66, rMax: 1.12, // × a
  topThin: 0.22,      // tube gets this much thinner toward the top of a swirl
  tauR: 0.14, lenR: 0.3, // radius eases to its target over this time / this much travel

  // --- laying rings ---
  dsMax: 0.055,       // ring spacing on straight parts
  dsMin: 0.016,       // smallest spacing in tight turns
  turnCos: Math.cos(18 * Math.PI / 180), // a new ring every 18° of turning
  maxRingsPerFrame: 18,
  capLen: 0.13,       // the tube reaches its full radius over this length (rounded start)
  lag: 0.20,          // the last stretch of tube still hangs between the surface and the nozzle
  nozzleGap: 0.05,
  lowpass: 0.07,      // resting height is smoothed over this much travel
  drape: 0.12,        // a swirl's ground may rise this much above the lowest ground under its first turn
  lowpassSwirl: 0.16, // … and over more while swirling, so a coil does not fold over a step in the ground
  embed: 0.2,         // a tube sinks this fraction of its half-height into what it lies on
  sink: 0.04,         // … and this much more into cream (which is squashed by the same amount)
  stampLag: 0.55,     // a stroke may rest on its own cream that lies this far back along the tube

  // --- squash of the layer underneath ---
  //   q = share of its height a ring has lost; one stroke adds step·w, w = (1 − d²/radius²)²; width grows by bulge·q
  squash: { step: 0.2, max: 0.4, bulge: 0.75, radius: 1.6, up: 0.08, down: 0.18, tau: 0.09, omega: 22, tJig: 0.45, crush: 0.82 },
  //   crush: a horn or blob that new cream comes down on is pressed flat (up to this q), not just dented

  // --- top-out: at the height limit the pile gets fatter instead ---
  capRoom: 0.36,      // laid centre line stays this far under maxHeight (room for the horn)
  fatRate: 0.14, fatMax: 0.4, fatR: 0.8,

  // --- letting go: the tip stretches, snaps and stands up ---
  tTail: 0.17,
  tipLen: [0.10, 0.22],
  tipProfile: [1, 0.62, 0.3, 0.03],
  tipLift: 0.22,      // part of the tip length that goes into lifting the hanging end
  lean: 0.28,         // the horn leans along the way the nozzle was going
  wob: { A: 0.04, tau: 0.12, omega: 40, sway: 0.03, tSettle: 0.5 },

  // --- field ---
  grid: 96,
  edge: 0.10,         // tube centre lines stay this far inside the rim

  // --- budget ---
  chunkRings: 30,     // a long stroke is cut into chunks of about this many rings (the unit of simplifying / dropping)
  reserve: 2600,      // start simplifying old cream when this few triangles are left
  sweepFrom: 0.35,    // above this share of the budget, look for cream that can no longer be seen and take it out
  seeSlope: 1.05,     // "cannot be seen" = blocked, all around, for a ray climbing this steeply (46°; the camera looks at 33–42°, lower is easier to block)

  // --- look ---
  uRepeat: 2, vRepeat: 1.4,
  aoValley: 0.20,     // valleys between ridges are this much darker
  aoUnder: 0.30,      // undersides are this much darker
  gain: 1.0,          // brightness of the cream colours (the photo is used as relief only, so it does not darken them)
  roughness: 0.58,
  bump: 1.2,
};
