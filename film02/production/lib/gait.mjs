// Film 02 · gait solver. Feet are PLANTED in world space during stance (no foot sliding by construction).
// The body advances by integrated speed; each foot's plant is fixed at heel strike; swing travels plant→next plant.
// Units: world px. h = head height (px). Facing +x.

export const FPS = 30;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
export const smooth = (t) => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };
const smoother = (t) => { t = clamp(t, 0, 1); return t * t * t * (t * (t * 6 - 15) + 10); };

export const STANCE = 0.6;           // fraction of a cycle a foot is on the ground
const STRIKE_TOEUP = 14;             // deg, toe raised at heel strike
const TOEOFF = 36;                   // deg, heel raised at toe-off

/** skeleton proportions in head units (≈7.5 heads tall) */
export const BODY = { thigh: 1.78, shin: 1.68, ankleH: 0.2, heel: 0.24, ball: 0.52, toe: 0.8, hipBase: 3.62 };

/**
 * Simulate a walker. spec:
 *  h, x0 (hip world x at t=0), groundY, t0, t1 (sim range, s),
 *  load(t) 0..1, stride(t) step length in heads, cadence(t) cycles/s, speedScale(t) 0..1 (0 = standing),
 *  phase0 (cycle phase at t0)
 * Returns { at(t) } giving joint positions at time t.
 */
export function simulate(spec) {
  const { h, x0, groundY, t0 = -3, t1 = 40, phase0 = 0 } = spec;
  const dt = 1 / 480;
  const samples = []; // { t, x, phi }
  let x = x0, phi = phase0;
  // integrate backward from 0 to t0 and forward to t1 so that x(0) = x0
  const step = (t, dir) => {
    const s = spec.speedScale ? spec.speedScale(t) : 1;
    const f = spec.cadence(t) * s;
    const v = 2 * spec.stride(t) * h * spec.cadence(t) * s; // px/s
    return { f, v };
  };
  const back = [];
  { let xb = x0, pb = phase0; for (let t = 0; t >= t0; t -= dt) { back.push({ t, x: xb, phi: pb }); const { f, v } = step(t); xb -= v * dt; pb -= f * dt; } }
  back.reverse();
  for (const s of back) samples.push(s);
  samples.pop();
  for (let t = 0; t <= t1; t += dt) { samples.push({ t, x, phi }); const { f, v } = step(t); x += v * dt; phi += f * dt; }
  const tStart = samples[0].t;
  const idx = (t) => clamp(Math.round((t - tStart) / dt), 0, samples.length - 1);
  let sampleAt = (t) => samples[idx(t)];

  // strike events per foot: foot 0 offset 0, foot 1 offset 0.5. Strike when (phi + off) crosses an integer.
  const strikes = [[], []];
  for (let i = 1; i < samples.length; i++) {
    for (let k = 0; k < 2; k++) {
      const off = k * 0.5;
      if (Math.floor(samples[i].phi + off) > Math.floor(samples[i - 1].phi + off)) {
        const t = samples[i].t;
        const stepLen = spec.stride(t) * h * (spec.speedScale ? spec.speedScale(t) : 1);
        // heel strikes ahead of the hip by half a step (+ ankle offset); a stopped walker plants under the hip
        strikes[k].push({ t, n: Math.floor(samples[i].phi + off), plant: samples[i].x + 0.5 * stepLen + 0.18 * h });
      }
    }
  }
  // feet that have not struck yet: synthesize a plant before the sim range
  for (let k = 0; k < 2; k++) if (!strikes[k].length || strikes[k][0].t > tStart + 1e-6) {
    strikes[k].unshift({ t: tStart - 1, n: -1e9, plant: samples[0].x + (k ? -0.4 : 0.4) * h });
  }

  const B = BODY;
  const g = groundY;
  // foot-local points (ankle origin, flat foot): heel and ball contact points on the ground
  const heelOff = { x: -B.heel * h, y: B.ankleH * h }, ballOff = { x: B.ball * h, y: B.ankleH * h };
  const rot = (p, deg) => { const r = (deg * Math.PI) / 180, c = Math.cos(r), s = Math.sin(r); return { x: p.x * c - p.y * s, y: p.x * s + p.y * c }; };
  // angle convention: footAngle > 0 = toe UP (rotate counter-clockwise on screen = negative screen rotation)
  const ankleFromHeelPivot = (plant, toeUp) => { const H = { x: plant + heelOff.x, y: g }; const v = rot({ x: -heelOff.x, y: -heelOff.y }, -toeUp); return { x: H.x + v.x, y: H.y + v.y }; };
  const ankleFromBallPivot = (plant, heelUp) => { const Bp = { x: plant + ballOff.x, y: g }; const v = rot({ x: -ballOff.x, y: -ballOff.y }, heelUp); return { x: Bp.x + v.x, y: Bp.y + v.y }; };

  let footAt = function (k, t) {
    const s = sampleAt(t);
    const p = ((s.phi + k * 0.5) % 1 + 1) % 1;
    const list = strikes[k];
    let i = list.length - 1; while (i > 0 && list[i].t > t + 1e-9) i--;
    const cur = list[i], next = list[i + 1];
    if (p < STANCE || !next) {
      const plant = cur.plant;
      if (!next && p >= STANCE) return { ankle: ankleFromBallPivot(plant, 0), angle: 0, contact: true, plant };
      if (p < 0.08) { const a = lerp(STRIKE_TOEUP, 0, smooth(p / 0.08)); return { ankle: ankleFromHeelPivot(plant, a), angle: a, contact: true, plant }; }
      if (p < 0.34) return { ankle: { x: plant, y: g - B.ankleH * h }, angle: 0, contact: true, plant };
      const a = lerp(0, TOEOFF, Math.pow((p - 0.34) / (STANCE - 0.34), 1.6));
      return { ankle: ankleFromBallPivot(plant, a), angle: -a, contact: true, plant };
    }
    // swing: from toe-off at cur.plant to heel strike at next.plant
    const u = (p - STANCE) / (1 - STANCE);
    const A0 = ankleFromBallPivot(cur.plant, TOEOFF), A1 = ankleFromHeelPivot(next.plant, STRIKE_TOEUP);
    const ex = smoother(u);
    const lift = 0.34 * h * Math.pow(Math.sin(Math.PI * Math.min(1, u * 1.08)), 1.1);
    const angle = lerp(-TOEOFF, STRIKE_TOEUP, smooth((u - 0.05) / 0.85));
    return { ankle: { x: lerp(A0.x, A1.x, ex), y: lerp(A0.y, A1.y, u) - lift }, angle, contact: false, plant: null };
  }

  // hip height: base, lowered only as much as needed so both legs reach (computed on a sampled grid, then smoothed)
  const legMax = (B.thigh + B.shin) * h * 0.992;
  const hipRaw = (t) => {
    const s = sampleAt(t); let y = g - B.hipBase * h;
    for (let k = 0; k < 2; k++) {
      const a = footAt(k, t).ankle; const hipX = s.x + (k ? -0.1 : 0.1) * h;
      const dx = a.x - hipX; const need = a.y - Math.sqrt(Math.max(0, legMax * legMax - dx * dx));
      if (y < need) y = need;
    }
    return y;
  };
  const hipCache = new Map();
  const hipY = (t) => {
    const key = Math.round(t * 240);
    if (hipCache.has(key)) return hipCache.get(key);
    // gaussian smoothing over ±60 ms keeps the bob organic without breaking reach
    let acc = 0, wsum = 0;
    for (let j = -8; j <= 8; j++) { const w = Math.exp(-(j * j) / 18); acc += hipRaw(t + j / 120) * w; wsum += w; }
    const sm = acc / wsum, raw = hipRaw(t);
    const v = Math.max(sm, raw); // never higher than reach allows
    hipCache.set(key, v); return v;
  };

  // optional clean stop: freeze at the first heel strike after spec.stopAfter (both feet are down at a strike),
  // then settle each foot flat about its own pivot (heel for the striking foot, ball for the trailing one) — no slide.
  let tStop = Infinity;
  if (spec.stopAfter != null) for (const k of [0, 1]) for (const e of strikes[k]) if (e.t >= spec.stopAfter && e.t < tStop) tStop = e.t;
  const SETTLE = spec.settle ?? 0.36;
  const footAtRaw = footAt;
  footAt = (k, t) => {
    if (t <= tStop) return footAtRaw(k, t);
    const f0 = footAtRaw(k, tStop), b = smooth((t - tStop) / SETTLE);
    const a = f0.angle * (1 - b);
    const ankle = f0.angle >= 0 ? ankleFromHeelPivot(f0.plant, a) : ankleFromBallPivot(f0.plant, -a);
    return { ankle, angle: a, contact: true, plant: f0.plant };
  };
  const sampleAtRaw = sampleAt;
  sampleAt = (t) => sampleAtRaw(Math.min(t, tStop));
  return {
    h, spec, tStop,
    at(t) {
      const s = sampleAt(t);
      const feet = [footAt(0, t), footAt(1, t)];
      const mvRaw = spec.speedScale ? spec.speedScale(Math.min(t, tStop)) : 1;
      const mv = t > tStop ? mvRaw * (1 - smooth((t - tStop) / SETTLE)) : mvRaw;
      return { t, x: s.x, phi: s.phi, hipY: hipY(t), feet, load: spec.load ? spec.load(t) : 0, moving: mv, step: spec.stride(t) * h * Math.max(mv, 0.05) };
    },
  };
}

/** 2-bone IK: knee/elbow bends toward `bend` side (+1 = forward/+x for knees) */
export function ik2(a, c, l1, l2, bend = 1) {
  const dx = c.x - a.x, dy = c.y - a.y;
  let d = Math.hypot(dx, dy); d = clamp(d, Math.abs(l1 - l2) + 1e-3, l1 + l2 - 1e-3);
  const ang = Math.atan2(dy, dx);
  const cosA = (l1 * l1 + d * d - l2 * l2) / (2 * l1 * d);
  const A = Math.acos(clamp(cosA, -1, 1));
  const th = ang - bend * A;
  return { x: a.x + Math.cos(th) * l1, y: a.y + Math.sin(th) * l1 };
}
