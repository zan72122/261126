// All tunable numbers of the hero in one place (metres, seconds, radians). See docs/hero-notes.md.

export const FIELD = Object.freeze({ half: 6, baseY: 0, groundY: -0.4, maxY: 3 });

export const GRID = Object.freeze({
  N: 96,                 // cells per side
  V: 97,                 // vertices per side
  CELL: 12 / 96,         // 0.125 m
  UV_PERIOD: 1.5,        // snow texture repeats every 1.5 m
});

export const SNOW = Object.freeze({
  TAN_FRESH: Math.tan((35 * Math.PI) / 180),   // angle of repose, loose snow
  TAN_PACKED: Math.tan((45 * Math.PI) / 180),  // angle of repose, packed snow
  RELAX_RATE: 0.25,      // share of the excess moved per neighbour pair and pass
  RELAX_PASSES: 3,       // passes per frame over each unsettled region
  COVER: 0.14,           // m of loose snow on the untouched field (so a blade lane is this deep)
  LOOSE_LOOK: [0.04, 0.14], // m of loose snow: up to the first the firm snow still looks (and slides) packed, from the second not at all
  REFILL_RATE: 0.005,    // m/s, snowfall refills places below y = 0
  REFILL_EVERY: 0.25,    // s
  SET_TIME: 5,           // s: a heap left alone turns firm inside (keeps COVER of loose snow as a shell)
  SET_ABOVE: 0.1,        // m: only snow lying higher than this sets (heaps, not the field)
  PEAK_EVERY: 0.25,      // s, how often the summit is searched
  PEAK_HYST: 0.15,       // m, the summit only moves to a spot this much higher
});

export const PLOW = Object.freeze({
  // shape
  LEN: 1.5, WID: 1.1, HGT: 0.55, ROUND: 0.12, BODY_Y: 0.28,
  CAB: [0.9, 0.7, 0.8],            // width, height, length
  WHEEL_R: 0.3, WHEEL_W: 0.25, LUGS: 12, WHEEL_X: 0.66, WHEEL_Z: 0.48,
  BLADE_W: 2.0, BLADE_H: 0.57, BLADE_R: 0.6, BLADE_Z: 1.05, BLADE_YAW: 0,
  BEACON_R: 0.08,
  // driving
  VMAX: 2.0, TURN: 3.0, ACC_TC: 0.11, NEAR: 0.6,
  REACH: 0.4,                      // the plow stops when the point this far in front of the blade is under the finger
  EDGE: 0.8,                       // the body stays this far inside the field
  BLADE_EDGE: 0.3,                 // the blade centre stays this far inside the field
  TRACK: 1.2, WHEELBASE: 0.96,     // where the ground is sampled under the wheels
  GRADE_FREE: 0.28, GRADE_STALL: 0.52, // climbs gentle ramps, stalls on steep firm slopes
  GRADE_LOAD: [0.14, 0.22],        // a full blade lowers those two limits by this much
  DETOUR_MIN: 3.2,                 // m: a finger farther away than this behind a steep hill = drive around the hill
  // snow
  SINK_MAX: 0.22,                  // wheels sink through loose snow to the firm snow, at most this deep
  BLADE_FOLLOW: 0.5,               // m of driving over which the blade edge follows the firm snow ahead
  LIFT: [0.12, 0.25],              // m the blade can go below / above its rest position on the body
  BITE_FIRM: 0.06,                 // m of firm snow one pass of the blade can shave off (loose snow goes completely)
  LOAD_MAX: 1.0,                   // m3 carried in front of the blade when full (load = 1)
  LUMP_SLOPE: 1.6,                 // lump length / lump height
  SPILL_EVERY: 0.3,                // s, at most one 'spill' event per this time
  SETTLE_AFTER: 0.15,              // s standing still before the lump is laid down
  SETTLE_TIME: 0.2,                // s it takes to lay the lump down
  PUSH_AFTER: 0.12,                // s pressed against a hill before the lump is pushed up
  PUSH_REACH: [0.6, 1.0],          // m: reach up the slope = a + b * sqrt(volume)
  PUSH_SIGMA: [0.42, 0.26],        // m: width of the pushed heap = a + b * sqrt(volume)
  PUSH_PACK: 0.7, DROP_PACK: 0.1,  // share of pushed / laid down snow that ends up firm
  PUSH_TIME: 0.24,                 // s the heap takes to swell
});

export const SLED = Object.freeze({
  // shape
  LEN: 1.3, WID: 0.62, CURL_R: 0.25, SIDE_H: 0.12, THICK: 0.028,
  SEAT_FRONT_Z: 0.2, SEAT_BACK_Z: -0.35, SEAT_Y: 0.1,
  // sliding
  G: 9.8, G_AIR: 7.8,
  MU_FRESH: 0.12, MU_PACKED: 0.04, DRAG: 0.22,
  VMAX: 6.0,
  FOOT_LEN: 0.45, FOOT_WID: 0.25,  // half sizes of the footprint the ground is sampled over
  SUBSTEP: 0.012,                  // s
  TILT_TC: 0.1, TILT_MAX: 0.75, HEAD_TC: 0.12,
  POP: 0.3, HOP_MAX: 0.4,          // extra lift when it leaves the snow on a bump (m/s), cap of the hop height (m)
  STOP_SPEED: 0.05, STOP_TIME: 0.3, MIN_DIST: 1.5, MIN_SPEED: 0.9,
  EDGE: 0.5, BANK_K: 40, BANK_C: 8, // soft bank near the field edge
  TRACK_R: 0.32, TRACK_DEPTH: 0.03,
  HOLD_Y: 0.3, HOP_TIME: [0.5, 0.8], RETURN_SPEED: 1.3,
  PUSH: 1.4,                       // m/s starting push
  MAX_TIME: 25,                    // s, a slide always ends
});

export const SPRAY = Object.freeze({ MAX: 64, MAX_LOW: 24, R: 0.055 });
