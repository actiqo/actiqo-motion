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
let CLIP = 0;
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
    skin: '#DDAA86', skinShade: '#C18E6C', lip: '#B57E66', hair: '#3A2C23', hairHi: '#55443A', hairStyle: 'crop',
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

/** hand: wrist at w, pointing along dir (deg, 0 = +x); local −y = thumb side. mode relaxed|grip|open */
const HAND = {
  // softly curled, tapered; thumb separated by the web notch; fingers grouped, tips curling in
  relaxed: [[0, -0.078], [0.08, -0.104], [0.16, -0.128], [0.232, -0.14], [0.274, -0.131], [0.284, -0.11], [0.255, -0.094], [0.225, -0.082],
    [0.34, -0.079], [0.46, -0.068], [0.55, -0.044], [0.586, -0.006], [0.57, 0.033], [0.5, 0.058], [0.42, 0.083], [0.28, 0.094], [0.04, 0.075]],
  // hooked grip on laces: thumb pressed onto the curled index, middle/ring/little folded behind
  grip: [[0, -0.08], [0.12, -0.1], [0.2, -0.128], [0.3, -0.148], [0.38, -0.142], [0.395, -0.116], [0.33, -0.104], [0.41, -0.098],
    [0.47, -0.074], [0.515, -0.034], [0.522, 0.01], [0.495, 0.044], [0.452, 0.052], [0.478, 0.074], [0.444, 0.102], [0.36, 0.11], [0.22, 0.104], [0.04, 0.08]],
  open: [[0, -0.08], [0.12, -0.1], [0.24, -0.16], [0.36, -0.215], [0.4, -0.2], [0.3, -0.12], [0.36, -0.09], [0.6, -0.07], [0.66, -0.045],
    [0.6, -0.025], [0.66, 0.0], [0.6, 0.02], [0.63, 0.045], [0.56, 0.06], [0.44, 0.085], [0.24, 0.1], [0.04, 0.08]],
};
const HAND_LINES = {
  relaxed: [[[0.355, -0.038], [0.45, -0.03], [0.525, -0.012]], [[0.335, 0.02], [0.41, 0.03], [0.47, 0.046]], [[0.215, -0.09], [0.18, -0.098], [0.13, -0.096]]],
  grip: [[[0.42, -0.058], [0.475, -0.04], [0.5, -0.004]], [[0.4, 0.004], [0.44, 0.022], [0.462, 0.05]], [[0.368, -0.086], [0.372, -0.01], [0.38, 0.07]]],
  open: [[[0.4, -0.05], [0.5, -0.04], [0.6, -0.035]], [[0.4, 0.0], [0.5, 0.005], [0.58, 0.01]], [[0.38, 0.04], [0.46, 0.05], [0.54, 0.05]]],
};
export const handPoint = (w, dir, h, x, y) => add(w, rot(P(x * h, y * h), dir));
function hand(w, dir, h, col, shade, mode = 'relaxed') {
  const T = (x, y) => handPoint(w, dir, h, x, y);
  const key = HAND[mode] ? mode : 'relaxed';
  const line = mix(col, shade, 0.62);
  return fill(spline(HAND[key].map(([x, y]) => T(x, y))), col)
    + HAND_LINES[key].map(([q0, q1, q2]) => stroke(`M${pt(T(...q0))} Q${pt(T(...q1))} ${pt(T(...q2))}`, line, 0.011 * h)).join('');
}
/** phone held upright in front of the chest, screen toward her face: back of hand on the near side,
 *  fingers wrap the back edge (stacked), thumb lies on the screen edge. */
function phoneHand(w, h, lean, c) {
  // phone turned slightly so its back reads; the hand cradles it: heel of the hand at the lower body-side edge,
  // four fingers lying across the back (nails toward us), thumb on the screen with its tip just past the edge
  const ang = -64 - lean;
  const U = rot(P(1, 0), ang), V = rot(P(0, 1), ang); // U: toward the phone's top · V: across its back
  const F = (u, v) => P(w.x + (U.x * u + V.x * v) * h, w.y + (U.y * u + V.y * v) * h);
  const line = mix(c.skin, c.skinShade, 0.6);
  let o = '';
  // thumb tip (on the screen side — behind the phone, only the tip shows past the edge)
  o += limb(F(0.26, -0.1), F(0.44, -0.098), 0.034 * h, 0.029 * h, c.skin);
  // phone: back, visible side edge, camera island
  const rr = (u0, u1, v0, v1, r) => `M${pt(F(u0 + r, v0))} L${pt(F(u1 - r, v0))} Q${pt(F(u1, v0))} ${pt(F(u1, v0 + r))} L${pt(F(u1, v1 - r))} Q${pt(F(u1, v1))} ${pt(F(u1 - r, v1))} L${pt(F(u0 + r, v1))} Q${pt(F(u0, v1))} ${pt(F(u0, v1 - r))} L${pt(F(u0, v0 + r))} Q${pt(F(u0, v0))} ${pt(F(u0 + r, v0))}Z`;
  o += fill(rr(0.02, 0.64, -0.082, 0.082, 0.032), '#161B24');                       // back
  o += fill(rr(0.05, 0.61, -0.082, -0.066, 0.008), '#2E3746');                      // side edge (thickness)
  o += fill(rr(0.5, 0.59, 0.014, 0.064, 0.014), '#202733');                         // camera island
  // heel of the hand / palm edge along the body-side edge, from the wrist
  o += fill(spline([F(-0.08, -0.06), F(-0.04, -0.13), F(0.08, -0.14), F(0.2, -0.128), F(0.3, -0.105), F(0.32, -0.07), F(0.22, -0.05), F(0.1, -0.03), F(0.0, 0.0), F(-0.07, 0.0)]), c.skin);
  // fingers across the back: little, ring, middle, index (index on top), each separated by a hairline
  const finger = (u0, u1, len, r0) => limb(F(u0, -0.075), F(u1, -0.075 + len), r0 * h, (r0 - 0.005) * h, c.skin, `stroke="${line}" stroke-width="${f(0.009 * h)}"`);
  o += finger(0.115, 0.125, 0.135, 0.027) + finger(0.175, 0.19, 0.165, 0.031) + finger(0.24, 0.258, 0.176, 0.032) + finger(0.305, 0.325, 0.162, 0.031);
  // nails: a hint only, toward the fingertips
  for (const [uu, vv] of [[0.326, 0.07], [0.258, 0.083], [0.19, 0.072]]) o += fill(spline([F(uu - 0.016, vv - 0.012), F(uu + 0.014, vv - 0.012), F(uu + 0.012, vv + 0.012), F(uu - 0.014, vv + 0.012)]), mix(c.skin, '#FFFFFF', 0.18));
  return o;
}

/** profile head. C = head centre, tilt deg (+ = looking down) */
const FACE = {
  // a specific person: sloped forehead, soft bridge dip, straight nose with a slight lift, defined lips, neat chin
  mom: {
    prof: [[-0.27, 0.4], [-0.43, 0.1], [-0.38, -0.27], [-0.12, -0.5], [0.16, -0.5], [0.33, -0.34], [0.385, -0.18], [0.395, -0.12], [0.374, -0.074], [0.41, -0.02], [0.452, 0.045], [0.468, 0.066], [0.456, 0.088], [0.42, 0.1], [0.395, 0.114], [0.404, 0.148], [0.416, 0.172], [0.394, 0.19], [0.406, 0.208], [0.392, 0.236], [0.368, 0.264], [0.384, 0.306], [0.352, 0.366], [0.27, 0.4], [0.12, 0.392], [-0.02, 0.33]],
    eye: [0.295, -0.068], eyeS: 1, brow: [[0.235, -0.148], [0.305, -0.168], [0.372, -0.146]], browW: 0.024,
    lipU: [[0.392, 0.118], [0.416, 0.172], [0.394, 0.19], [0.352, 0.19]], lipL: [[0.394, 0.19], [0.406, 0.208], [0.392, 0.236], [0.355, 0.2]], mouth: [[0.394, 0.19], [0.352, 0.192]],
    nost: [[0.425, 0.064], [0.405, 0.085], [0.42, 0.098]], ear: 0,
  },
  // stronger jaw and chin, straighter higher bridge, lower heavier brow, narrower eye, thinner lips
  dad: {
    prof: [[-0.29, 0.42], [-0.45, 0.08], [-0.39, -0.28], [-0.13, -0.51], [0.17, -0.5], [0.355, -0.33], [0.405, -0.17], [0.426, -0.115], [0.41, -0.076], [0.45, -0.002], [0.488, 0.068], [0.476, 0.098], [0.44, 0.114], [0.415, 0.124], [0.425, 0.164], [0.428, 0.188], [0.408, 0.2], [0.42, 0.218], [0.405, 0.24], [0.39, 0.27], [0.415, 0.32], [0.41, 0.38], [0.355, 0.432], [0.22, 0.442], [0.05, 0.43], [-0.05, 0.36]],
    eye: [0.302, -0.064], eyeS: 0.88, brow: [[0.22, -0.13], [0.3, -0.142], [0.385, -0.13]], browW: 0.034,
    lipU: [[0.415, 0.128], [0.428, 0.188], [0.408, 0.2], [0.365, 0.2]], lipL: [[0.408, 0.2], [0.42, 0.218], [0.405, 0.24], [0.368, 0.208]], mouth: [[0.408, 0.2], [0.362, 0.203]],
    nost: [[0.448, 0.07], [0.428, 0.092], [0.444, 0.106]], ear: 0.01,
  },
  // softer jaw and receding chin line, slightly longer nose with a gentle downturn, thin lips, hooded lid
  grandma: {
    prof: [[-0.28, 0.38], [-0.42, 0.08], [-0.37, -0.27], [-0.12, -0.48], [0.15, -0.48], [0.32, -0.32], [0.37, -0.17], [0.38, -0.12], [0.36, -0.076], [0.395, -0.01], [0.438, 0.06], [0.45, 0.082], [0.438, 0.104], [0.405, 0.116], [0.38, 0.126], [0.385, 0.16], [0.39, 0.18], [0.372, 0.192], [0.382, 0.21], [0.37, 0.228], [0.354, 0.256], [0.362, 0.296], [0.33, 0.352], [0.26, 0.386], [0.15, 0.405], [0.02, 0.38], [-0.05, 0.3]],
    eye: [0.282, -0.062], eyeS: 0.92, brow: [[0.225, -0.152], [0.29, -0.166], [0.356, -0.15]], browW: 0.017, hooded: true,
    lipU: [[0.38, 0.128], [0.39, 0.18], [0.372, 0.192], [0.335, 0.192]], lipL: [[0.372, 0.192], [0.382, 0.21], [0.37, 0.228], [0.338, 0.198]], mouth: [[0.372, 0.192], [0.332, 0.195]],
    nost: [[0.412, 0.072], [0.392, 0.094], [0.406, 0.108]], ear: 0.02,
  },
};
function head(C, tilt, h, c, load = 0) {
  const T = (x, y) => add(C, rot(P(x * h, y * h), tilt));
  const F = FACE[c.face];
  const shade1 = mix(c.skin, c.skinShade, 0.6), shade2 = mix(c.skin, c.skinShade, 0.85);
  let o = '';
  // hair behind the head (bun)
  if (c.hairStyle === 'bun') {
    o += fill(spline([T(-0.38, 0.06), T(-0.6, 0.0), T(-0.71, 0.16), T(-0.62, 0.33), T(-0.42, 0.33), T(-0.34, 0.2)]), c.hair);
    o += stroke(`M${pt(T(-0.64, 0.08))} Q${pt(T(-0.55, 0.17))} ${pt(T(-0.61, 0.28))}`, mix(c.hair, c.hairHi, 0.6), 0.016 * h);
    o += stroke(`M${pt(T(-0.5, 0.04))} Q${pt(T(-0.46, 0.17))} ${pt(T(-0.5, 0.3))}`, mix(c.hair, c.hairHi, 0.45), 0.012 * h);
  }
  o += fill(spline(F.prof.map(([x, y]) => T(x, y))), c.skin);
  // hair (drawn before the ear: the ear sits in front of the pulled-back hair)
  if (c.hairStyle === 'bun') {
    o += fill(spline([T(-0.42, 0.24), T(-0.46, -0.08), T(-0.32, -0.42), T(-0.02, -0.56), T(0.24, -0.5), T(0.352, -0.345), T(0.3, -0.302), T(0.2, -0.272), T(0.125, -0.222), T(0.094, -0.14), T(0.084, -0.064), T(0.052, -0.086), T(0.02, -0.122), T(-0.06, -0.112), T(-0.1, 0.0), T(-0.13, 0.12), T(-0.2, 0.24), T(-0.3, 0.3)]), c.hair);
    for (const [a, b, d] of [[[0.3, -0.36], [0.04, -0.42], [-0.34, -0.12]], [[0.2, -0.28], [-0.02, -0.3], [-0.3, 0.02]], [[0.08, -0.5], [-0.2, -0.42], [-0.4, -0.1]], [[0.13, -0.2], [0.04, -0.2], [-0.08, -0.13]]])
      o += stroke(`M${pt(T(...a))} Q${pt(T(...b))} ${pt(T(...d))}`, mix(c.hair, c.hairHi, 0.6), 0.012 * h);
    o += stroke(`M${pt(T(0.12, -0.215))} Q${pt(T(0.1, -0.16))} ${pt(T(0.105, -0.11))}`, mix(c.hair, c.skin, 0.25), 0.008 * h); // fine temple hair
  } else if (c.hairStyle === 'crop') {
    o += fill(spline([T(-0.31, 0.33), T(-0.46, 0.08), T(-0.45, -0.2), T(-0.3, -0.46), T(-0.02, -0.58), T(0.24, -0.53), T(0.385, -0.38), T(0.372, -0.31), T(0.25, -0.3), T(0.152, -0.26), T(0.12, -0.17), T(0.104, -0.078), T(0.06, -0.09), T(0.022, -0.128), T(-0.078, -0.118), T(-0.12, 0.02), T(-0.18, 0.2)]), c.hair);
    for (const [a, b, d] of [[[0.3, -0.44], [0.04, -0.5], [-0.3, -0.32]], [[0.22, -0.34], [-0.02, -0.38], [-0.34, -0.1]]])
      o += stroke(`M${pt(T(...a))} Q${pt(T(...b))} ${pt(T(...d))}`, mix(c.hair, c.hairHi, 0.6), 0.012 * h);
  } else {
    // silver: soft layered cut built from overlapping locks swept up and back — an irregular, hair-like edge
    o += fill(spline([T(-0.27, 0.27), T(-0.44, 0.12), T(-0.48, -0.1), T(-0.4, -0.36), T(-0.18, -0.52), T(0.1, -0.54), T(0.3, -0.46), T(0.38, -0.33), T(0.3, -0.29), T(0.2, -0.27), T(0.13, -0.2), T(0.1, -0.11), T(0.04, -0.12), T(-0.07, -0.1), T(-0.12, 0.02), T(-0.18, 0.16)]), c.hair);
    const lock = (p0, p1, p2, wd, col) => {
      const q = (t) => P((1 - t) * (1 - t) * p0[0] + 2 * (1 - t) * t * p1[0] + t * t * p2[0], (1 - t) * (1 - t) * p0[1] + 2 * (1 - t) * t * p1[1] + t * t * p2[1]);
      const side = [], other = [];
      for (const t of [0, 0.2, 0.45, 0.7, 0.9, 1]) {
        const a0 = q(Math.max(0, t - 0.02)), a1 = q(Math.min(1, t + 0.02)); const d = norm(P(a1.x - a0.x, a1.y - a0.y));
        const wt = wd * Math.sin(Math.PI * Math.min(1, Math.max(0.0, t * 0.92 + 0.04))) * (t < 0.5 ? 1 : 1 - (t - 0.5) * 0.9);
        const m = q(t); side.push(T(m.x - d.y * wt, m.y + d.x * wt)); other.unshift(T(m.x + d.y * wt * 0.6, m.y - d.x * wt * 0.6));
      }
      return fill(spline([...side, ...other]), col);
    };
    const hi = mix(c.hair, c.hairHi, 0.55), lo = mix(c.hair, c.hairShade, 0.45), lo2 = mix(c.hair, c.hairShade, 0.75);
    o += lock([0.02, -0.04], [-0.24, 0.0], [-0.33, 0.31], 0.07, lo2);
    o += lock([0.1, -0.16], [-0.16, -0.16], [-0.48, 0.05], 0.09, lo);
    o += lock([0.2, -0.26], [-0.06, -0.34], [-0.47, -0.2], 0.1, c.hair);
    o += lock([0.0, -0.55], [-0.3, -0.52], [-0.46, -0.26], 0.08, lo);
    o += lock([0.34, -0.3], [0.08, -0.46], [-0.32, -0.44], 0.1, hi);
    o += lock([0.4, -0.33], [0.22, -0.6], [-0.12, -0.56], 0.1, c.hairHi);
    for (const [a1, b1, d1] of [[[0.36, -0.36], [0.12, -0.5], [-0.2, -0.48]], [[0.24, -0.27], [0.0, -0.36], [-0.38, -0.24]], [[0.1, -0.15], [-0.12, -0.15], [-0.42, 0.04]], [[-0.04, -0.06], [-0.2, 0.02], [-0.3, 0.24]]])
      o += stroke(`M${pt(T(...a1))} Q${pt(T(...b1))} ${pt(T(...d1))}`, mix(c.hair, c.hairShade, 0.9), 0.009 * h);
  }
  // ear
  const e = F.ear;
  o += fill(spline([T(-0.04, -0.09), T(0.0, -0.088), T(0.03, -0.054), T(0.036, 0.016), T(0.022, 0.08), T(0.004, 0.122 + e), T(-0.03, 0.132 + e), T(-0.048, 0.1), T(-0.052, 0.0)]), mix(c.skin, c.skinShade, 0.4));
  o += stroke(`M${pt(T(-0.002, -0.058))} Q${pt(T(0.024, 0.0))} ${pt(T(0.002, 0.074))}`, shade2, 0.011 * h);
  o += stroke(`M${pt(T(-0.016, -0.01))} Q${pt(T(-0.004, 0.03))} ${pt(T(-0.02, 0.06))}`, shade1, 0.009 * h);
  if (c.stubble) o += fill(spline([T(-0.02, 0.2), T(0.12, 0.29), T(0.3, 0.3), T(0.39, 0.29), T(0.412, 0.34), T(0.395, 0.39), T(0.34, 0.425), T(0.2, 0.43), T(0.04, 0.42), T(-0.04, 0.34)]), mix(c.skin, c.hair, 0.1));
  // nose wing + nostril
  o += stroke(`M${pt(T(...F.nost[0]))} Q${pt(T(...F.nost[1]))} ${pt(T(...F.nost[2]))}`, shade1, 0.011 * h);
  // lips: upper (deeper) and lower (lighter), separated by the mouth line
  o += fill(spline(F.lipU.map(([x, y]) => T(x, y))), mix(c.skin, c.lip, 0.5));
  o += fill(spline(F.lipL.map(([x, y]) => T(x, y))), mix(c.skin, c.lip, 0.36));
  o += stroke(`M${pt(T(...F.mouth[0]))} L${pt(T(...F.mouth[1]))}`, mix(c.lip, '#2B211D', 0.35), 0.01 * h);
  // eye (profile almond, opening toward the front) + lids
  const [ex, ey] = F.eye, k = F.eyeS, lidDrop = (F.hooded ? 0.008 : 0) + 0.006 * load;
  o += fill(spline([T(ex - 0.046 * k, ey + 0.002), T(ex - 0.012 * k, ey - 0.018 * k + lidDrop), T(ex + 0.03 * k, ey - 0.002), T(ex - 0.004 * k, ey + 0.012 * k)]), '#F4EEE6');
  o += `<ellipse cx="${f(T(ex + 0.012 * k, ey - 0.001).x)}" cy="${f(T(ex + 0.012 * k, ey - 0.001).y)}" rx="${f(0.014 * k * h)}" ry="${f(0.018 * k * h)}" fill="#2B211D"/>`;
  o += stroke(`M${pt(T(ex - 0.05 * k, ey + 0.002))} Q${pt(T(ex - 0.008 * k, ey - 0.026 * k + lidDrop))} ${pt(T(ex + 0.036 * k, ey - 0.004))}`, '#2B211D', 0.015 * h);
  o += stroke(`M${pt(T(ex - 0.04 * k, ey - 0.034 * k + lidDrop * 0.6))} Q${pt(T(ex - 0.005 * k, ey - 0.046 * k + lidDrop * 0.6))} ${pt(T(ex + 0.022 * k, ey - 0.032 * k))}`, shade1, 0.008 * h);
  o += stroke(`M${pt(T(ex - 0.038 * k, ey + 0.012))} Q${pt(T(ex - 0.006 * k, ey + 0.02 * k))} ${pt(T(ex + 0.024 * k, ey + 0.006))}`, shade1, 0.007 * h);
  // brow: tapered, thicker at the inner (front) end; under load the inner end settles slightly (focus, not distress)
  const [b0, b1, b2] = F.brow, bw = F.browW, browC = mix(c.hairStyle === 'silver' ? '#9C958D' : c.hair, c.skin, 0.12);
  const b2l = [b2[0], b2[1] + 0.01 * load];
  o += fill(spline([T(b0[0], b0[1]), T(b1[0], b1[1] - bw * 0.35), T(b2l[0], b2l[1] - bw * 0.45), T(b2l[0] + 0.004, b2l[1] + bw * 0.55), T(b1[0], b1[1] + bw * 0.5), T(b0[0] + 0.01, b0[1] + bw * 0.25)]), browC);
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
  const farHand = farInFrontMode(opts) ? c.skin : c.skinShade;
  const farArm = () => limb(shF, armF.elbow, 0.21 * h * c.build, 0.17 * h, sleeveF) + limb(armF.elbow, armF.wrist, 0.17 * h, 0.13 * h, sleeveF)
    + (opts.arms?.far === 'cleats' ? cleats(handPoint(armF.wrist, armF.handDir, h, 0.44, 0.0), h, st, lag) : '')
    + (armF.handMode !== 'hidden' ? hand(armF.wrist, armF.handDir, h, farHand, c.skinShade, armF.handMode) : '');
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
    const neck = limb(bot, top, 0.2 * h, 0.165 * h, c.skin);
    g(neck);
    // under-jaw shadow, clipped to the neck so it can never spill outside it
    const HT = (x, y) => add(headC, rot(P(x * h, y * h), tilt));
    const id = 'nk' + (++CLIP);
    g(`<clipPath id="${id}">${neck}</clipPath>` + fill(spline([HT(0.24, 0.38), HT(0.06, 0.37), HT(-0.08, 0.3), HT(-0.1, 0.44), HT(0.04, 0.5), HT(0.2, 0.47)]), mix(c.skin, c.skinShade, 0.7), `clip-path="url(#${id})"`)); }
  if (c.garment === 'trench' || c.garment === 'cardigan') g(fill(spline([TP(-0.36, 2.5), TP(-0.1, 2.74), TP(0.12, 2.6), TP(0.1, 2.42), TP(-0.28, 2.38)]), c.coat)); // collar behind neck
  g(head(headC, tilt, h, c, load));
  // ── near arm ──
  const sleeve = c.coat;
  g(limb(shN, armN.elbow, 0.22 * h * c.build, 0.18 * h, c.coatLine));
  g(limb(armN.elbow, armN.wrist, 0.18 * h, 0.145 * h, c.coatLine));
  g(limb(shN, armN.elbow, 0.2 * h * c.build, 0.165 * h, sleeve));
  g(limb(armN.elbow, armN.wrist, 0.165 * h, 0.13 * h, sleeve));
  g(stroke(`M${pt(lerpP(shN, armN.elbow, 0.55))} Q${pt(add(armN.elbow, P(0.04 * h, -0.02 * h)))} ${pt(lerpP(armN.elbow, armN.wrist, 0.3))}`, c.coatLine, 0.016 * h, 'stroke-opacity=".6"'));
  if (opts.arms?.near === 'phone') g(phoneHand(armN.wrist, h, lean, c));
  else if (armN.handMode !== 'hidden') g(hand(armN.wrist, armN.handDir, h, c.skin, c.skinShade, armN.handMode));
  return { svg: o.join(''), anchors: { hip, headC, handN: armN.wrist, handF: armF.wrist, shN, neckBase } };
}

function farInFrontMode(opts) { return opts.arms?.far === 'cleats'; }
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
  const lace = '#D9D1C3';
  return stroke(`M${pt(w)} Q${pt(T(-0.03, 0.25))} ${pt(T(-0.07, 0.45))} M${pt(w)} Q${pt(T(0.08, 0.3))} ${pt(T(0.13, 0.52))}`, lace, 0.018 * h)
    + one(0.12, 0.08, '#262D3A') + one(0, 0, '#1B212C')
    + stroke(`M${pt(T(-0.09, 0.47))} Q${pt(T(-0.06, 0.43))} ${pt(T(-0.03, 0.47))}`, lace, 0.016 * h);
}
function bagBody(hip, h, st, lag) {
  const sw = Math.sin(lag.phi * Math.PI * 4 - 1.2) * 0.04 * h * (st.moving > 0.05 ? 1 : 0.1);
  const c = add(hip, P(-0.62 * h + sw, 0.32 * h + (lag.hipY - st.hipY) * 0.6));
  return fill(spline([add(c, P(-0.72 * h, -0.46 * h)), add(c, P(0.5 * h, -0.56 * h)), add(c, P(0.7 * h, 0.3 * h)), add(c, P(0.1 * h, 0.6 * h)), add(c, P(-0.78 * h, 0.4 * h))]), '#34425A')
    + stroke(`M${pt(add(c, P(-0.6 * h, -0.05 * h)))} Q${pt(add(c, P(0, 0.06 * h)))} ${pt(add(c, P(0.6 * h, -0.16 * h)))}`, '#2A3548', 0.045 * h)
    + fill(spline([add(c, P(-0.3 * h, 0.12 * h)), add(c, P(0.24 * h, 0.08 * h)), add(c, P(0.26 * h, 0.3 * h)), add(c, P(-0.28 * h, 0.34 * h))]), '#2D3A50');
}
