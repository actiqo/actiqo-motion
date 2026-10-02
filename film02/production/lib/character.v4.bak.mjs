// Film 02 · editorial character renderer (final production). Side view facing +x.
// Flat colour, one shade tone, hairline construction strokes; no AI-generated imagery.
import { BODY, ik2 } from './gait.mjs';

const R = Math.PI / 180;
const P = (x, y) => ({ x, y });
const add = (a, b) => P(a.x + b.x, a.y + b.y);
const sub = (a, b) => P(a.x - b.x, a.y - b.y);
const mul = (a, k) => P(a.x * k, a.y * k);
const lerpP = (a, b, t) => P(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t);
const rot = (p, deg) => { const c = Math.cos(deg * R), s = Math.sin(deg * R); return P(p.x * c - p.y * s, p.x * s + p.y * c); };
const f = (v) => (Math.round(v * 10) / 10).toString();
const pt = (p) => `${f(p.x)},${f(p.y)}`;

/** closed Catmull-Rom spline through points (tension 0.5) */
export function spline(pts, closed = true) {
  const n = pts.length; let d = `M${pt(pts[0])}`;
  const last = closed ? n : n - 1;
  for (let i = 0; i < last; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    const q0 = !closed && i === 0 ? p1 : p0, q3 = !closed && i === n - 2 ? p2 : p3;
    const c1 = P(p1.x + (p2.x - q0.x) / 6, p1.y + (p2.y - q0.y) / 6), c2 = P(p2.x - (q3.x - p1.x) / 6, p2.y - (q3.y - p1.y) / 6);
    d += ` C${pt(c1)} ${pt(c2)} ${pt(p2)}`;
  }
  return closed ? d + 'Z' : d;
}
const fill = (d, c, extra = '') => `<path d="${d}" fill="${c}" ${extra}/>`;
const stroke = (d, c, w, extra = '') => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${f(w)}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;

/** tapered capsule a→b */
function limb(a, b, ra, rb, c, extra = '') {
  const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 1;
  const ux = dx / d, uy = dy / d, nx = -uy, ny = ux;
  const k = (ra - rb) / d, s = Math.sqrt(Math.max(0, 1 - k * k));
  const o = (r, sg) => P(nx * s * r * sg - ux * k * r, ny * s * r * sg - uy * k * r);
  const a1 = add(a, o(ra, 1)), a2 = add(a, o(ra, -1)), b1 = add(b, o(rb, 1)), b2 = add(b, o(rb, -1));
  return `<path fill="${c}" ${extra} d="M${pt(a1)} L${pt(b1)} A${f(rb)},${f(rb)} 0 0 0 ${pt(b2)} L${pt(a2)} A${f(ra)},${f(ra)} 0 0 0 ${pt(a1)}Z"/>`;
}
/** a soft-tapered limb through 3 points (hip-knee-ankle) as one organic outline */
function leg3(a, b, c, ra, rb, rc, col, bendFwd = 1) {
  const n1 = norm(sub(b, a)), n2 = norm(sub(c, b));
  const perp = (v) => P(-v.y, v.x);
  const kn = norm(add(perp(n1), perp(n2)));
  const front = [add(a, mul(perp(n1), -ra)), add(b, mul(kn, -rb)), add(c, mul(perp(n2), -rc))];
  const back = [add(c, mul(perp(n2), rc)), add(b, mul(kn, rb * 1.04)), add(a, mul(perp(n1), ra))];
  // calf swell on the back of the shin, thigh swell front
  const calf = add(lerpP(b, c, 0.32), mul(perp(n2), rb * 1.12));
  const thighF = add(lerpP(a, b, 0.45), mul(perp(n1), -ra * 0.98));
  return fill(spline([front[0], thighF, front[1], front[2], back[0], calf, back[1], back[2]]), col);
}
export function mix(a, b, t) {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16)), pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return '#' + pa.map((v, i) => Math.round(v + (pb[i] - v) * t).toString(16).padStart(2, '0')).join('');
}
const norm = (v) => { const d = Math.hypot(v.x, v.y) || 1; return P(v.x / d, v.y / d); };

// ───────────────────────────── cast ─────────────────────────────
export const CAST = {
  mom: {
    name: 'Mom', heads: 7.5, build: 1.0,
    skin: '#C48A69', skinShade: '#A9714F', lip: '#A5604A', hair: '#2B211D', hairHi: '#4A3B33', hairStyle: 'bun',
    face: 'mom',
    garment: 'trench', coat: '#D9CAB0', coatShade: '#C4B394', coatLine: '#AE9C7B', coatLen: 1.5,
    top: '#0B1F3B', topShade: '#081730',
    pants: '#6F829B', pantsShade: '#5A6C84', pantsCuff: '#7E90A8',
    shoe: '#F3F0E9', shoeShade: '#E2DCD1', sole: '#D3CBBE', shoeStyle: 'sneaker',
  },
  dad: {
    name: 'Dad', heads: 7.6, build: 1.1,
    skin: '#DDAA86', skinShade: '#C18E6C', lip: '#B57E66', hair: '#3A2C23', hairHi: '#55443A', hairStyle: 'crop', stubble: true,
    face: 'dad',
    garment: 'chore', coat: '#6D7965', coatShade: '#5B6654', coatLine: '#4F5A49', coatLen: 0.3,
    top: '#ECE6DA', topShade: '#D9D2C4',
    pants: '#474D57', pantsShade: '#3A3F48', pantsCuff: '#525862',
    shoe: '#7B5B43', shoeShade: '#684C37', sole: '#4E3B2C', shoeStyle: 'derby',
  },
  grandma: {
    name: 'Grandma', heads: 7.2, build: 0.97,
    skin: '#E2BB9C', skinShade: '#C9A083', lip: '#B98670', hair: '#DCD8D2', hairHi: '#F0EDE8', hairShade: '#B9B4AD', hairStyle: 'silver',
    face: 'grandma',
    garment: 'cardigan', coat: '#8E9CAA', coatShade: '#7B8997', coatLine: '#6D7B89', coatLen: 1.62,
    top: '#EEE7DB', topShade: '#DCD3C5',
    pants: '#CBBFAE', pantsShade: '#B6AA99', pantsCuff: '#D6CBBB',
    shoe: '#6C5547', shoeShade: '#5A4639', sole: '#463730', shoeStyle: 'loafer',
  },
};

// ───────────────────────────── parts ─────────────────────────────
function shoe(ankle, angle, h, c, near) {
  // foot-local, ankle at origin, flat sole at y = +ankleH
  const A = BODY.ankleH;
  const S = {
    sneaker: [[-0.27, 0.2], [-0.28, 0.02], [-0.18, -0.13], [0.02, -0.15], [0.2, -0.06], [0.48, 0.03], [0.7, 0.08], [0.82, 0.16], [0.8, 0.22], [0.5, 0.235], [-0.2, 0.235]],
    derby: [[-0.27, 0.2], [-0.28, 0.0], [-0.17, -0.12], [0.03, -0.12], [0.24, -0.04], [0.52, 0.04], [0.74, 0.1], [0.84, 0.17], [0.81, 0.22], [0.5, 0.23], [-0.2, 0.23]],
    loafer: [[-0.26, 0.2], [-0.27, 0.02], [-0.15, -0.08], [0.06, -0.06], [0.3, 0.0], [0.56, 0.06], [0.74, 0.11], [0.82, 0.17], [0.79, 0.22], [0.5, 0.225], [-0.2, 0.225]],
  }[c.shoeStyle];
  const T = (x, y) => add(ankle, rot(P(x * h, y * h), -angle));
  const body = S.map(([x, y]) => T(x, y));
  let o = fill(spline(body), near ? c.shoe : c.shoeShade);
  // sole band
  o += fill(spline([T(-0.27, 0.17), T(0.5, 0.18), T(0.8, 0.165), T(0.81, 0.225), T(0.5, 0.24), T(-0.2, 0.24), T(-0.27, 0.215)]), c.sole);
  if (near && c.shoeStyle === 'sneaker') o += stroke(`M${pt(T(0.0, -0.1))} Q${pt(T(0.22, -0.02))} ${pt(T(0.42, 0.04))}`, c.shoeShade, 0.035 * h);
  if (near && c.shoeStyle === 'derby') o += stroke(`M${pt(T(0.02, -0.1))} L${pt(T(0.3, -0.01))}`, c.shoeShade, 0.03 * h);
  if (near && c.shoeStyle === 'loafer') o += stroke(`M${pt(T(0.2, -0.01))} Q${pt(T(0.36, -0.06))} ${pt(T(0.5, 0.04))}`, c.shoeShade, 0.03 * h);
  return o;
}

/** hand: wrist at w, pointing along dir (deg, 0 = +x), mode relaxed|grip|open */
function hand(w, dir, h, col, shade, mode = 'relaxed', flip = 1) {
  const T = (x, y) => add(w, rot(P(x * h, y * h * flip), dir));
  if (mode === 'open') {
    const palm = [T(0, -0.1), T(0.26, -0.12), T(0.52, -0.1), T(0.74, -0.06), T(0.76, 0.0), T(0.56, 0.05), T(0.62, 0.1), T(0.42, 0.12), T(0.2, 0.12), T(0.02, 0.09)];
    return fill(spline(palm), col) + fill(spline([T(0.1, -0.08), T(0.3, -0.2), T(0.44, -0.24), T(0.46, -0.18), T(0.3, -0.06)]), col)
      + stroke(`M${pt(T(0.44, 0.0))} L${pt(T(0.66, -0.02))}`, shade, 0.018 * h, 'stroke-opacity=".6"');
  }
  if (mode === 'grip') {
    const fist = [T(0, -0.11), T(0.22, -0.14), T(0.4, -0.12), T(0.5, -0.02), T(0.48, 0.1), T(0.34, 0.15), T(0.14, 0.14), T(0.0, 0.1)];
    return fill(spline(fist), col) + fill(spline([T(0.12, -0.1), T(0.34, -0.2), T(0.48, -0.17), T(0.38, -0.08)]), col)
      + stroke(`M${pt(T(0.3, 0.02))} Q${pt(T(0.4, 0.08))} ${pt(T(0.32, 0.13))}`, shade, 0.018 * h, 'stroke-opacity=".7"');
  }
  // relaxed: palm, softly curled fingers, thumb forward
  const palm = [T(0, -0.1), T(0.24, -0.13), T(0.46, -0.11), T(0.62, -0.04), T(0.66, 0.06), T(0.56, 0.13), T(0.36, 0.14), T(0.14, 0.13), T(0.0, 0.1)];
  return fill(spline(palm), col)
    + fill(spline([T(0.1, -0.09), T(0.3, -0.19), T(0.44, -0.2), T(0.42, -0.13), T(0.26, -0.06)]), col)
    + stroke(`M${pt(T(0.42, 0.02))} Q${pt(T(0.56, 0.08))} ${pt(T(0.5, 0.13))}`, shade, 0.018 * h, 'stroke-opacity=".7"');
}

/** profile head. C = head centre, tilt deg (+ = looking down) */
function head(C, tilt, h, c) {
  const T = (x, y) => add(C, rot(P(x * h, y * h), tilt));
  const prof = {
    mom: [[-0.29, 0.38], [-0.43, 0.08], [-0.37, -0.28], [-0.12, -0.49], [0.16, -0.5], [0.34, -0.33], [0.4, -0.13], [0.392, -0.05], [0.475, 0.075], [0.398, 0.12], [0.418, 0.178], [0.386, 0.215], [0.412, 0.25], [0.36, 0.34], [0.25, 0.42], [0.06, 0.4], [-0.05, 0.29]],
    dad: [[-0.3, 0.4], [-0.45, 0.06], [-0.38, -0.3], [-0.12, -0.5], [0.17, -0.5], [0.36, -0.33], [0.43, -0.13], [0.405, -0.04], [0.49, 0.085], [0.41, 0.13], [0.425, 0.19], [0.395, 0.225], [0.42, 0.26], [0.39, 0.37], [0.28, 0.45], [0.04, 0.43], [-0.07, 0.3]],
    grandma: [[-0.29, 0.38], [-0.43, 0.08], [-0.37, -0.28], [-0.12, -0.48], [0.16, -0.49], [0.33, -0.33], [0.39, -0.13], [0.382, -0.05], [0.462, 0.08], [0.392, 0.125], [0.405, 0.18], [0.378, 0.22], [0.398, 0.255], [0.35, 0.34], [0.24, 0.41], [0.06, 0.39], [-0.05, 0.29]],
  }[c.face].map(([x, y]) => T(x, y));
  let o = '';
  // hair behind the head (bun / back volume)
  if (c.hairStyle === 'bun') {
    o += fill(spline([T(-0.38, 0.06), T(-0.62, 0.02), T(-0.72, 0.17), T(-0.62, 0.33), T(-0.42, 0.32), T(-0.34, 0.2)]), c.hair);
    o += stroke(`M${pt(T(-0.66, 0.1))} Q${pt(T(-0.56, 0.18))} ${pt(T(-0.62, 0.28))}`, mix(c.hair, c.hairHi, 0.7), 0.022 * h);
  }
  o += fill(spline(prof), c.skin);
  // ear
  o += fill(spline([T(-0.05, -0.06), T(0.02, -0.05), T(0.03, 0.06), T(-0.01, 0.13), T(-0.07, 0.1), T(-0.08, 0.0)]), c.skinShade);
  o += stroke(`M${pt(T(-0.02, -0.02))} Q${pt(T(0.0, 0.04))} ${pt(T(-0.03, 0.08))}`, c.skin, 0.02 * h);
  if (c.stubble) o += fill(spline([T(-0.03, 0.16), T(0.1, 0.27), T(0.3, 0.29), T(0.392, 0.3), T(0.405, 0.36), T(0.37, 0.4), T(0.28, 0.452), T(0.1, 0.44), T(-0.02, 0.36)]), mix(c.skin, c.hair, 0.16));
  // features: lips, nostril, eye, lid, brow (solid tones only — no translucent overlays)
  o += fill(spline([T(0.386, 0.183), T(0.414, 0.178), T(0.408, 0.212), T(0.388, 0.216), T(0.41, 0.248), T(0.39, 0.25)]), mix(c.skin, c.lip, 0.55));
  o += stroke(`M${pt(T(0.405, 0.108))} Q${pt(T(0.37, 0.1))} ${pt(T(0.37, 0.07))}`, c.skinShade, 0.016 * h);
  const eye = T(0.3, -0.06);
  o += fill(spline([T(0.255, -0.06), T(0.3, -0.083), T(0.338, -0.068), T(0.33, -0.05), T(0.29, -0.045)]), '#F6F1EA');
  o += `<ellipse cx="${f(eye.x + 0.012 * h)}" cy="${f(eye.y - 0.002 * h)}" rx="${f(0.02 * h)}" ry="${f(0.022 * h)}" fill="#2B211D"/>`;
  o += stroke(`M${pt(T(0.248, -0.062))} Q${pt(T(0.3, -0.094))} ${pt(T(0.343, -0.07))}`, '#2B211D', 0.017 * h);
  o += stroke(`M${pt(T(0.26, -0.036))} Q${pt(T(0.3, -0.03))} ${pt(T(0.33, -0.045))}`, mix(c.skin, c.skinShade, 0.7), 0.01 * h);
  const browC = c.hairStyle === 'silver' ? '#A39D96' : c.hair;
  o += stroke(`M${pt(T(0.225, -0.15))} Q${pt(T(0.29, -0.172))} ${pt(T(0.36, -0.15))}`, mix(browC, c.skin, 0.15), (c.face === 'dad' ? 0.03 : 0.022) * h);
  if (c.face === 'grandma') o += stroke(`M${pt(T(0.37, 0.15))} Q${pt(T(0.352, 0.2))} ${pt(T(0.366, 0.24))}`, mix(c.skin, c.skinShade, 0.6), 0.01 * h);

  // hair
  if (c.hairStyle === 'bun') {
    o += fill(spline([T(-0.42, 0.24), T(-0.45, -0.1), T(-0.3, -0.42), T(0.0, -0.56), T(0.26, -0.47), T(0.37, -0.3), T(0.27, -0.27), T(0.16, -0.24), T(0.06, -0.14), T(0.02, -0.05), T(-0.06, -0.1), T(-0.14, 0.04), T(-0.2, 0.22), T(-0.3, 0.3)]), c.hair);
    for (const [a, b, d] of [[[-0.08, -0.48], [-0.34, -0.2], [-0.4, 0.12]], [[0.12, -0.46], [-0.16, -0.32], [-0.3, 0.02]], [[0.24, -0.36], [0.06, -0.3], [-0.06, -0.14]]])
      o += stroke(`M${pt(T(...a))} Q${pt(T(...b))} ${pt(T(...d))}`, mix(c.hair, c.hairHi, 0.7), 0.016 * h);
  } else if (c.hairStyle === 'crop') {
    o += fill(spline([T(-0.31, 0.33), T(-0.46, 0.08), T(-0.44, -0.2), T(-0.3, -0.45), T(-0.02, -0.58), T(0.24, -0.52), T(0.38, -0.36), T(0.33, -0.28), T(0.16, -0.31), T(0.04, -0.24), T(-0.02, -0.1), T(-0.1, -0.1), T(-0.15, 0.04), T(-0.2, 0.2)]), c.hair);
    o += stroke(`M${pt(T(0.2, -0.48))} Q${pt(T(-0.05, -0.47))} ${pt(T(-0.3, -0.3))}`, mix(c.hair, c.hairHi, 0.7), 0.016 * h);
  } else {
    // silver: soft short cut with volume, covers the top of the ear
    o += fill(spline([T(-0.4, 0.26), T(-0.48, -0.04), T(-0.38, -0.38), T(-0.12, -0.55), T(0.16, -0.56), T(0.36, -0.42), T(0.41, -0.27), T(0.3, -0.25), T(0.2, -0.29), T(0.08, -0.22), T(0.02, -0.1), T(0.04, -0.01), T(-0.06, -0.05), T(-0.13, 0.08), T(-0.22, 0.24), T(-0.32, 0.3)]), c.hair);
    for (const [a, b, d] of [[[0.3, -0.42], [0.04, -0.5], [-0.26, -0.34]], [[0.1, -0.3], [-0.14, -0.36], [-0.4, -0.08]], [[-0.1, -0.12], [-0.3, -0.06], [-0.38, 0.2]]])
      o += stroke(`M${pt(T(...a))} Q${pt(T(...b))} ${pt(T(...d))}`, mix(c.hair, c.hairShade, 0.8), 0.016 * h);
    o += stroke(`M${pt(T(0.26, -0.45))} Q${pt(T(0.0, -0.53))} ${pt(T(-0.22, -0.42))}`, c.hairHi, 0.02 * h);
  }
  return o;
}

// ───────────────────────────── full figure ─────────────────────────────
/**
 * st: gait state (from simulate().at(t)); c: CAST entry; h: head height px
 * opts: { load, arms: { near:'swing'|'phone'|'pocket'|'reach', far:'swing'|'cleats'|'carry' }, bag:'mom'|'dad'|null,
 *         tilt (head look, deg), lag: state at t-0.07 s (cloth/props), handTarget }
 */
export function drawFigure(st, c, h, opts = {}) {
  const lag = opts.lag || st;
  const load = opts.load ?? 0;
  const B = BODY;
  const hip = P(st.x, st.hipY);
  const lean = (c === CAST.grandma ? 5 : 3) + 7 * load + (opts.leanAdd || 0);
  const up = rot(P(0, -1), lean), fw = rot(P(1, 0), lean);
  const TP = (fx, uy) => add(hip, add(mul(fw, fx * h * c.build), mul(up, uy * h)));
  const shrug = 0.07 * load * h;
  const neckBase = add(TP(0.06, 2.62), P(0, -shrug * 0.4));
  const shN = add(TP(0.04, 2.3), P(0, -shrug)), shF = add(TP(-0.12, 2.32), P(0, -shrug));
  const tilt = (opts.tilt ?? 0) + lean * 0.5;
  const headC = add(neckBase, rot(P(0.12 * h, -0.5 * h), lean * 0.4 + (opts.tilt ?? 0) * 0.35));

  // legs (foot 0 = near)
  const hipN = add(hip, P(0.08 * h, 0)), hipF = add(hip, P(-0.08 * h, 0));
  const legs = [0, 1].map((k) => {
    const hp = k ? hipF : hipN; const a = st.feet[k].ankle;
    return { hip: hp, knee: ik2(hp, a, B.thigh * h, B.shin * h, 1), ankle: a, angle: st.feet[k].angle };
  });
  const lagLegs = [0, 1].map((k) => { const lh = P(lag.x + (k ? -0.08 : 0.08) * h, lag.hipY); return { knee: ik2(lh, lag.feet[k].ankle, B.thigh * h, B.shin * h, 1), ankle: lag.feet[k].ankle }; });

  // arm swing from the OPPOSITE leg's position (in sync with the gait), damped by load
  const stepPx = Math.max(0.3 * h, lag.step || st.step || h);
  const swingOf = (legK) => Math.max(-1, Math.min(1, (lag.feet[legK].ankle.x - lag.x) / (stepPx * 0.75))) * (17 - 10 * load) * Math.min(1, st.moving * 1.5);
  const arm = (sh, which) => {
    const mode = opts.arms?.[which] || 'swing';
    const U = B.thigh * 0.78 * h, F = 1.22 * h;
    if (mode === 'phone') {
      // forearm raised, phone at chest height in front of the body, looked at
      const target = add(TP(0.98, 1.5), P(0, -shrug * 0.6));
      const elbow = ik2(sh, target, U, F, -1);
      return { elbow, wrist: target, handDir: 300 - lean, handMode: 'grip' };
    }
    if (mode === 'pocket') {
      const target = add(TP(0.2, 0.25), P(0, 0));
      return { elbow: ik2(sh, target, U, F, -1), wrist: target, handDir: 60, handMode: 'hidden' };
    }
    if (mode === 'reach' && opts.handTarget) {
      return { elbow: ik2(sh, opts.handTarget, U, F, -1), wrist: opts.handTarget, handDir: opts.handDir ?? 20, handMode: 'open' };
    }
    const sw = (which === 'near' ? swingOf(1) : swingOf(0)) * (mode === 'cleats' ? 0.35 : mode === 'carry' ? 0.2 : 1);
    const upperA = sw + (mode === 'cleats' ? 13 : 0);
    const elbow = add(sh, rot(P(0, U), -upperA));
    const foreA = upperA + 8 + Math.max(0, sw) * 0.9 + (mode === 'cleats' ? 10 : 0);
    const wrist = add(elbow, rot(P(0, F), -foreA));
    return { elbow, wrist, handDir: 90 - foreA - 6, handMode: mode === 'cleats' || mode === 'carry' ? 'grip' : 'relaxed' };
  };
  const armN = arm(shN, 'near'), armF = arm(shF, 'far');

  const o = [];
  const g = (s) => o.push(s);
  // ── contact shadow ──
  g(`<ellipse cx="${f(st.x + 0.15 * h)}" cy="${f(st.feet[0].contact || st.feet[1].contact ? Math.max(st.feet[0].ankle.y, st.feet[1].ankle.y) + B.ankleH * h * 1.05 : st.hipY + 3.75 * h)}" rx="${f(1.5 * h)}" ry="${f(0.16 * h)}" fill="#0B1F3B" opacity=".07"/>`);

  // ── far arm ──
  const sleeveF = c.coatShade;
  const farArm = () => limb(shF, armF.elbow, 0.21 * h * c.build, 0.17 * h, sleeveF) + limb(armF.elbow, armF.wrist, 0.17 * h, 0.13 * h, sleeveF)
    + (armF.handMode !== 'hidden' ? hand(armF.wrist, armF.handDir, h, c.skinShade, c.skinShade, armF.handMode) : '')
    + (opts.arms?.far === 'cleats' ? cleats(armF.wrist, h, st, lag) : '');
  const farInFront = opts.arms?.far === 'cleats';
  if (!farInFront) g(farArm());
  // ── far leg ──
  const lf = legs[1];
  g(leg3(lf.hip, lf.knee, add(lf.ankle, P(0, -0.04 * h)), 0.38 * h * c.build, 0.22 * h, 0.15 * h, c.pantsShade));
  g(shoe(lf.ankle, lf.angle, h, c, false));
  // ── bag behind the body (far hip) ──
  if (opts.bag) g(bagBody(hip, h, st, lag));
  // ── garment back panel ──
  const hemY = hip.y + c.coatLen * h;
  // hem follows the knees with a little lag, but cloth can only spread so far (no ballooning on long strides)
  const kMin = Math.min(lagLegs[0].knee.x, lagLegs[1].knee.x), kMax = Math.max(lagLegs[0].knee.x, lagLegs[1].knee.x);
  const backX = Math.max(hip.x - 1.0 * h, Math.min(kMin, hip.x) - (c.coatLen > 1 ? 0.42 : 0.5) * h);
  const frontX = Math.min(hip.x + 0.62 * h, Math.max(kMax, hip.x) + 0.22 * h);
  const sway = Math.sin((lag.phi * 2) * Math.PI * 2) * 0.04 * h;
  if (c.coatLen > 1) {
    g(fill(spline([TP(-0.36, 2.42), TP(-0.5, 1.7), TP(-0.46, 0.6), P(backX - 0.06 * h + sway, hemY - 0.35 * h), P(backX + sway, hemY + 0.02 * h), P(lerpP(P(backX, 0), P(frontX, 0), 0.5).x, hemY + 0.1 * h), P(frontX - 0.1 * h, hemY), TP(0.42, 0.4), TP(0.4, 2.0)]), c.coatShade));
  }
  // ── near leg ──
  const ln = legs[0];
  g(leg3(ln.hip, ln.knee, add(ln.ankle, P(0, -0.04 * h)), 0.39 * h * c.build, 0.22 * h, 0.15 * h, c.pants));
  g(stroke(`M${pt(add(ln.ankle, P(-0.15 * h, -0.08 * h)))} L${pt(add(ln.ankle, P(0.14 * h, -0.1 * h)))}`, c.pantsCuff, 0.05 * h));
  g(shoe(ln.ankle, ln.angle, h, c, true));
  // ── torso (top) ──
  g(fill(spline([TP(-0.36, 2.42), TP(0.18, 2.6), TP(0.44, 2.15), TP(0.46, 1.5), TP(0.36, 0.7), TP(0.4, 0.05), TP(-0.42, 0.05), TP(-0.44, 1.2), TP(-0.46, 2.0)]), c.top));
  // ── garment front panel ──
  if (c.garment === 'trench') {
    const frontHem = P(frontX + 0.12 * h, hemY - 0.06 * h);
    g(fill(spline([TP(-0.3, 2.5), TP(0.08, 2.5), TP(0.26, 2.0), TP(0.3, 1.2), TP(0.26, 0.5), P(frontHem.x - 0.04 * h, frontHem.y - 0.6 * h), frontHem, P((frontHem.x + backX) / 2, hemY + 0.06 * h), P(backX + 0.32 * h + sway, hemY), TP(-0.44, 0.4), TP(-0.48, 1.6), TP(-0.44, 2.2)]), c.coat));
    // open front edge + facing
    g(stroke(spline([TP(0.08, 2.5), TP(0.26, 2.0), TP(0.3, 1.2), TP(0.26, 0.5), P(frontHem.x - 0.04 * h, frontHem.y - 0.6 * h), frontHem], false), c.coatLine, 0.03 * h));
    // drape folds
    g(stroke(spline([TP(-0.1, 0.4), P(lerpP(hip, P(backX, hemY), 0.5).x + 0.1 * h + sway * 0.5, hip.y + 0.8 * h), P(backX + 0.45 * h + sway, hemY - 0.05 * h)], false), c.coatLine, 0.022 * h, 'stroke-opacity=".7"'));
    g(stroke(spline([TP(0.12, 0.2), P(hip.x + 0.25 * h, hip.y + 0.7 * h), P(frontHem.x - 0.35 * h, hemY - 0.08 * h)], false), c.coatLine, 0.018 * h, 'stroke-opacity=".55"'));
    // belt (tied back, ends hang)
    g(stroke(`M${pt(TP(-0.46, 0.62))} L${pt(TP(0.3, 0.6))}`, c.coatShade, 0.09 * h));
    const beltEnd = TP(-0.34, 0.6);
    g(stroke(`M${pt(beltEnd)} Q${pt(add(beltEnd, P(-0.05 * h + sway, 0.3 * h)))} ${pt(add(beltEnd, P(-0.02 * h + sway * 1.6, 0.62 * h)))}`, c.coatShade, 0.08 * h));
    // lapel
    g(fill(spline([TP(-0.18, 2.55), TP(0.12, 2.52), TP(0.3, 2.05), TP(0.16, 1.95), TP(0.02, 2.3)]), c.coatShade));
  } else if (c.garment === 'chore') {
    const hem = hip.y + c.coatLen * h;
    g(fill(spline([TP(-0.4, 2.48), TP(0.1, 2.56), TP(0.38, 2.1), TP(0.44, 1.2), TP(0.42, 0.2), P(hip.x + 0.46 * h, hem), P(hip.x - 0.5 * h, hem + 0.02 * h), TP(-0.5, 0.6), TP(-0.52, 1.8)]), c.coat));
    g(stroke(spline([TP(0.18, 2.48), TP(0.36, 1.9), TP(0.38, 1.0), P(hip.x + 0.42 * h, hem)], false), c.coatLine, 0.026 * h));
    g(fill(spline([TP(0.0, 1.35), TP(0.32, 1.35), TP(0.33, 0.95), TP(0.02, 0.95)]), c.coatShade)); // chest pocket
    g(fill(spline([TP(-0.26, 2.6), TP(0.12, 2.58), TP(0.24, 2.3), TP(-0.12, 2.36)]), c.coatShade)); // collar
  } else {
    const frontHem = P(frontX + 0.08 * h, hemY - 0.04 * h);
    g(fill(spline([TP(-0.26, 2.52), TP(0.06, 2.5), TP(0.2, 1.9), TP(0.24, 1.0), TP(0.24, 0.4), P(frontHem.x - 0.04 * h, frontHem.y - 0.5 * h), frontHem, P((frontHem.x + backX) / 2, hemY + 0.04 * h), P(backX + 0.3 * h + sway, hemY), TP(-0.44, 0.4), TP(-0.5, 1.6), TP(-0.44, 2.2)]), c.coat));
    g(stroke(spline([TP(0.06, 2.5), TP(0.2, 1.9), TP(0.24, 1.0), TP(0.24, 0.4), P(frontHem.x - 0.04 * h, frontHem.y - 0.5 * h), frontHem], false), c.coatLine, 0.03 * h));
    // knit rib texture: soft vertical lines
    for (const k of [0.3, 0.55]) g(stroke(spline([TP(-0.2 + k * 0.2, 1.8), P(hip.x - 0.1 * h + k * 0.3 * h, hip.y + 0.4 * h), P(lerpP(P(backX, 0), P(frontHem.x, 0), k).x + sway * 0.5, hemY - 0.05 * h)], false), c.coatLine, 0.016 * h, 'stroke-opacity=".5"'));
    g(fill(spline([TP(0.0, 0.9), TP(0.3, 0.9), TP(0.3, 0.45), TP(0.0, 0.45)]), c.coatShade, 'opacity=".8"')); // patch pocket
  }
  if (farInFront) g(farArm());
  // ── bag strap across the chest ──
  if (opts.bag) g(stroke(`M${pt(TP(0.02, 2.42))} Q${pt(TP(0.2, 1.3))} ${pt(add(hip, P(-0.3 * h, 0.1 * h)))}`, '#2A3548', 0.12 * h));
  // ── neck + head ──
  { const top = add(headC, rot(P(-0.02 * h, 0.3 * h), tilt)), bot = add(neckBase, P(-0.03 * h, 0.1 * h));
    g(limb(bot, top, 0.2 * h, 0.165 * h, c.skin));
    // under-jaw shadow on the neck (solid shade, the head covers its top edge)
    const HT = (x, y) => add(headC, rot(P(x * h, y * h), tilt));
    g(fill(spline([HT(0.22, 0.4), HT(0.06, 0.38), HT(-0.08, 0.3), HT(-0.12, 0.44), HT(0.02, 0.55), HT(0.16, 0.52)]), mix(c.skin, c.skinShade, 0.8))); }
  if (c.garment === 'trench' || c.garment === 'cardigan') g(fill(spline([TP(-0.36, 2.5), TP(-0.1, 2.74), TP(0.12, 2.6), TP(0.1, 2.42), TP(-0.28, 2.38)]), c.coat)); // collar behind neck
  g(head(headC, tilt, h, c));
  // ── near arm ──
  const sleeve = c.coat;
  g(limb(shN, armN.elbow, 0.22 * h * c.build, 0.18 * h, c.coatLine));
  g(limb(armN.elbow, armN.wrist, 0.18 * h, 0.145 * h, c.coatLine));
  g(limb(shN, armN.elbow, 0.2 * h * c.build, 0.165 * h, sleeve));
  g(limb(armN.elbow, armN.wrist, 0.165 * h, 0.13 * h, sleeve));
  g(stroke(`M${pt(lerpP(shN, armN.elbow, 0.55))} Q${pt(add(armN.elbow, P(0.04 * h, -0.02 * h)))} ${pt(lerpP(armN.elbow, armN.wrist, 0.3))}`, c.coatLine, 0.016 * h, 'stroke-opacity=".6"'));
  if (opts.arms?.near === 'phone') g(phone(armN.wrist, h, lean));
  if (armN.handMode !== 'hidden') g(hand(armN.wrist, armN.handDir, h, c.skin, c.skinShade, armN.handMode));
  if (opts.arms?.near === 'phone') g(fill(spline([add(armN.wrist, rot(P(0.18 * h, -0.2 * h), -lean)), add(armN.wrist, rot(P(0.34 * h, -0.26 * h), -lean)), add(armN.wrist, rot(P(0.38 * h, -0.18 * h), -lean)), add(armN.wrist, rot(P(0.24 * h, -0.1 * h), -lean))]), c.skin)); // thumb over screen
  return { svg: o.join(''), anchors: { hip, headC, handN: armN.wrist, handF: armF.wrist, shN, neckBase } };
}

function phone(w, h, lean) {
  // a slim slab held upright-ish, screen tipped toward her face; hand grips the lower third
  const C = add(w, rot(P(0.24 * h, -0.22 * h), -lean));
  const T = (x, y) => add(C, rot(P(x * h, y * h), -68 - lean));
  const slab = `M${pt(T(-0.3, -0.045))} L${pt(T(0.3, -0.045))} Q${pt(T(0.33, -0.045))} ${pt(T(0.33, -0.01))} L${pt(T(0.33, 0.02))} Q${pt(T(0.33, 0.05))} ${pt(T(0.3, 0.05))} L${pt(T(-0.3, 0.05))} Q${pt(T(-0.33, 0.05))} ${pt(T(-0.33, 0.02))} L${pt(T(-0.33, -0.01))} Q${pt(T(-0.33, -0.045))} ${pt(T(-0.3, -0.045))}Z`;
  return fill(slab, '#1A1F29') + stroke(`M${pt(T(-0.29, -0.05))} L${pt(T(0.29, -0.05))}`, '#3A4252', 0.014 * h);
}
function cleats(w, h, st, lag) {
  const sw = Math.sin(lag.phi * Math.PI * 2 - 0.9) * 7 * (st.moving > 0.05 ? 1 : 0.1);
  const T = (x, y) => add(w, rot(P(x * h, y * h), sw));
  const one = (dx, dy, col) => fill(spline([T(-0.22 + dx, 0.5 + dy), T(0.0 + dx, 0.42 + dy), T(0.3 + dx, 0.6 + dy), T(0.4 + dx, 0.72 + dy), T(0.34 + dx, 0.8 + dy), T(-0.2 + dx, 0.78 + dy)]), col)
    + [-0.12, 0.06, 0.22].map((x) => fill(spline([T(x + dx, 0.8 + dy), T(x + 0.05 + dx, 0.8 + dy), T(x + 0.05 + dx, 0.86 + dy), T(x + dx, 0.86 + dy)]), '#DDD6C9')).join('')
    + stroke(`M${pt(T(-0.08 + dx, 0.56 + dy))} L${pt(T(0.2 + dx, 0.62 + dy))}`, '#E8E2D6', 0.03 * h);
  return stroke(`M${pt(w)} L${pt(T(-0.06, 0.45))} M${pt(w)} L${pt(T(0.14, 0.52))}`, '#D8D0C2', 0.022 * h) + one(0.12, 0.08, '#262D3A') + one(0, 0, '#1B212C');
}
function bagBody(hip, h, st, lag) {
  const sw = Math.sin(lag.phi * Math.PI * 4 - 1.2) * 0.04 * h * (st.moving > 0.05 ? 1 : 0.1);
  const c = add(hip, P(-0.62 * h + sw, 0.32 * h + (lag.hipY - st.hipY) * 0.6));
  return fill(spline([add(c, P(-0.72 * h, -0.46 * h)), add(c, P(0.5 * h, -0.56 * h)), add(c, P(0.7 * h, 0.3 * h)), add(c, P(0.1 * h, 0.6 * h)), add(c, P(-0.78 * h, 0.4 * h))]), '#34425A')
    + stroke(`M${pt(add(c, P(-0.6 * h, -0.05 * h)))} Q${pt(add(c, P(0, 0.06 * h)))} ${pt(add(c, P(0.6 * h, -0.16 * h)))}`, '#2A3548', 0.045 * h)
    + fill(spline([add(c, P(-0.3 * h, 0.12 * h)), add(c, P(0.24 * h, 0.08 * h)), add(c, P(0.26 * h, 0.3 * h)), add(c, P(-0.28 * h, 0.34 * h))]), '#2D3A50');
}
