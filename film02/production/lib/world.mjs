// Film 02 · the world: the afternoon is a floor. X = clock time, Z = depth lanes. Ported from the approved styleframes.
// All SVG (no HTML overlays) so every frame is one deterministic SVG document.
import { readFileSync } from 'node:fs';

const BRAND = '/workspaces/actiqo-motion/brand';
export const r = (v) => Math.round(v * 10) / 10;
export const C = {
  ink: '#0B1F3B', ink2: '#3F4C63', ink3: '#7A869A', ivory: '#FCFAF7',
  green: '#0F7A4B', greenS: '#DCEFE3', orange: '#C2410C', orangeS: '#FBEAD9', blue: '#1D4ED8', blueS: '#E6EEFE',
  leo: '#0EA5E9', leoS: '#DDF2FC', maya: '#7C3AED', mayaS: '#EEE7FD', neutralS: '#EDEEF1',
};
export const HOUR = 760;
export const X = (hr) => (hr - 16) * HOUR;
export const LANE = { mom: 1150, fold: 1460, leo: 1600, maya: 2300 };

// ── easing (motion system) ──
function bezier(x1, y1, x2, y2) {
  return (t) => {
    if (t <= 0) return 0; if (t >= 1) return 1;
    let u = t; for (let i = 0; i < 12; i++) { const x = 3 * (1 - u) ** 2 * u * x1 + 3 * (1 - u) * u ** 2 * x2 + u ** 3 - t; const dx = 3 * (1 - u) ** 2 * x1 + 6 * (1 - u) * u * (x2 - x1) + 3 * u ** 2 * (1 - x2); if (Math.abs(dx) < 1e-6) break; u -= x / dx; u = Math.min(1, Math.max(0, u)); }
    return 3 * (1 - u) ** 2 * u * y1 + 3 * (1 - u) * u ** 2 * y2 + u ** 3;
  };
}
export const EASE = { enter: bezier(0.2, 0.8, 0.2, 1), std: bezier(0.2, 0, 0, 1), breath: bezier(0.4, 0, 0.2, 1), cam: bezier(0.65, 0, 0.35, 1) };
export const clamp01 = (v) => Math.max(0, Math.min(1, v));
/** progress of a span [t0, t0+d] with easing */
export const span = (t, t0, d, e = EASE.std) => e(clamp01((t - t0) / d));
export const lerp = (a, b, k) => a + (b - a) * k;

// ── camera: shared vertical projection; separate horizontal origins for Mom's path and the plan floor ──
export function cam({ horizon, F, camH, sx, x0 }) {
  const p = (x, z) => ({ x: sx + ((x - x0) * F) / z, y: horizon + (camH * F) / z, s: F / z });
  return { horizon, F, camH, sx, x0, p };
}

/** the plan floor, folded up by theta (rad) about the fold line z = fold. p(x, z) keeps the lane-depth API. */
export function foldCam(c, fold, theta) {
  const cs = Math.cos(theta), sn = Math.sin(theta);
  const p = (x, z) => { const d = z - fold, z3 = fold + d * cs, up = d * sn; return { x: c.sx + ((x - c.x0) * c.F) / z3, y: c.horizon + ((c.camH - up) * c.F) / z3, s: c.F / z3 }; };
  return { ...c, p, theta, fold };
}

// ── icons (Font Awesome 7, licensed in brand/icons) ──
const ICON = {};
export function icon(name, x, y, size, color) {
  if (!ICON[name]) { const s = readFileSync(`${BRAND}/icons/fontawesome-7/${name}.svg`, 'utf8'); ICON[name] = { vb: s.match(/viewBox="([^"]+)"/)[1], d: s.match(/ d="([^"]+)"/)[1] }; }
  const I = ICON[name];
  return `<svg x="${r(x - size / 2)}" y="${r(y - size / 2)}" width="${r(size)}" height="${r(size)}" viewBox="${I.vb}"><path fill="${color}" d="${I.d}"/></svg>`;
}

// ── text (widths come from the browser's real font metrics, measured once) ──
let METRICS = null;
export const setMetrics = (m) => { METRICS = m; };
export const tw = (text, size, weight = 600) => {
  const k = `${weight}|${text}`; if (!METRICS || METRICS[k] == null) throw new Error('unmeasured: ' + k);
  return METRICS[k] * size;
};
export const text = (x, y, s, size, { weight = 600, fill = C.ink, anchor = 'start', opacity = 1, family = 'Inter', ls = -0.01 } = {}) =>
  `<text x="${r(x)}" y="${r(y)}" font-family="${family}" font-weight="${weight}" font-size="${r(size)}" fill="${fill}" text-anchor="${anchor}" letter-spacing="${ls}em" opacity="${r(opacity * 1000) / 1000}">${s}</text>`;

// ── floor ──
/** Mom's path: the floor in front of the fold line. Faint paving seams move with her feet (planted footing). */
export function pathFloor(cP, { W, opacity = 1, seam = 230, zNear = 640, L = LANE }) {
  let g = '';
  const xa = cP.x0 - (cP.sx * zNear) / cP.F - seam, xb = cP.x0 + ((W - cP.sx) * zNear) / cP.F + seam;
  for (let x = Math.floor(xa / seam) * seam; x <= xb; x += seam) {
    const a = cP.p(x, zNear), b = cP.p(x, L.fold);
    g += `<line x1="${r(a.x)}" y1="${r(a.y)}" x2="${r(b.x)}" y2="${r(b.y)}" stroke="${C.ink}" stroke-opacity=".045" stroke-width="1.5"/>`;
  }
  return `<g opacity="${opacity}">${g}</g>`;
}
/** The plan floor beyond the fold line: hour / half-hour lines, child lanes, hour labels. */
export function planFloor(cL, { W, H, opacity = 1, from = 15, to = 20, zFar = 9000, labels = 1, lanes = 1, labelSize = 24, L = LANE, Xf = X, grid = 0, planDim = 1 }) {
  let g = '';
  const fy = cL.p(0, L.fold).y;
  g += `<line x1="0" x2="${W}" y1="${r(fy)}" y2="${r(fy)}" stroke="${C.ink}" stroke-opacity=".10" stroke-width="1.5"/>`;
  for (let hh = from; hh <= to; hh += 0.5) {
    const full = hh % 1 === 0;
    const a = cL.p(Xf(hh), L.fold), b = cL.p(Xf(hh), zFar);
    g += `<line x1="${r(a.x)}" y1="${r(a.y)}" x2="${r(b.x)}" y2="${r(b.y)}" stroke="${C.ink}" stroke-opacity="${r((full ? 0.1 : 0.045) * (1 + 0.7 * grid) * planDim * 1000) / 1000}" stroke-width="${full ? 2 : 1.5}"/>`;
    if (full && labels > 0) {
      // a ruler on the fold line: hour labels sit just in front of it, so nothing on the plan floor ever covers them
      const l = cL.p(Xf(hh), L.fold);
      if (l.x > 30 && l.x < W - 90) g += text(l.x + 8, l.y + labelSize * 1.15, `${hh - 12} PM`, labelSize, { weight: 500, fill: C.ink3, opacity: labels, ls: 0 });
    }
  }
  if (lanes > 0) for (const z of [L.leo, L.maya]) {
    const a = cL.p(Xf(from), z), b = cL.p(Xf(to), z);
    g += `<line x1="${r(a.x)}" y1="${r(a.y)}" x2="${r(b.x)}" y2="${r(b.y)}" stroke="${C.ink}" stroke-opacity="${r(0.06 * lanes * (1 + 1.2 * grid) * planDim * 1000) / 1000}" stroke-width="2"/>`;
    // alignment: quarter-hour ticks register along each lane
    if (grid > 0) for (let q = from; q <= to; q += 0.25) { const a1 = cL.p(Xf(q), z - 26), b1 = cL.p(Xf(q), z + 26);
      g += `<line x1="${r(a1.x)}" y1="${r(a1.y)}" x2="${r(b1.x)}" y2="${r(b1.y)}" stroke="${C.ink}" stroke-opacity="${r(0.14 * grid * planDim * 1000) / 1000}" stroke-width="1.5"/>`; }
  }
  return `<g opacity="${opacity}">${g}</g>`;
}
/** a route along a lane, drawn from x1 toward x2 by fraction k */
export function route(cL, x1, x2, z, k, { color, width = 6, opacity = 1 }) {
  if (k <= 0) return '';
  const a = cL.p(x1, z), b = cL.p(lerp(x1, x2, k), z);
  return `<line x1="${r(a.x)}" y1="${r(a.y)}" x2="${r(b.x)}" y2="${r(b.y)}" stroke="${color}" stroke-width="${r(width * a.s / 0.6)}" stroke-linecap="round" opacity="${opacity}"/>`;
}

const TONE = {
  green: { ink: C.green, bg: C.greenS }, orange: { ink: C.orange, bg: C.orangeS }, leo: { ink: C.leo, bg: C.leoS },
  maya: { ink: C.maya, bg: C.mayaS }, blue: { ink: C.blue, bg: C.blueS },
};
/**
 * A marker planted at (time, lane): ground tick → stem → label (well + title + sub lines).
 * a = { tick, stem, label } progress 0..1 (label uses the card-entrance rule: opacity + rise).
 * lines = [{ text, size (×title), weight, fill, k (0..1 visibility) }]
 */
export function marker(cL, { x, z, tone, glyph, title, titleInk, lines = [], side = 'right', rise = 110, size = 40, min = 26, a, riseK = 1 }) {
  rise *= riseK;
  const g = cL.p(x, z), t = TONE[tone];
  const k = Math.max(g.s / 0.62, min / size), fs = size * k, ws = 52 * k;
  const top = g.y - rise * g.s * a.stem;
  let s = '';
  if (a.tick > 0 && (a.keepTick || (a.wellK ?? 1) > 0)) s += `<ellipse cx="${r(g.x)}" cy="${r(g.y)}" rx="${r(16 * g.s * a.tick)}" ry="${r(6 * g.s * a.tick)}" fill="${t.ink}"/>`;
  if (a.stem > 0 && rise > 0.5 && (a.keepTick || (a.wellK ?? 1) > 0)) s += `<line x1="${r(g.x)}" y1="${r(g.y)}" x2="${r(g.x)}" y2="${r(top)}" stroke="${t.ink}" stroke-opacity=".6" stroke-width="${r(Math.max(2, 3.2 * g.s))}"/>`;
  const out = { svg: s, g, top: g.y - rise * g.s, k, fs, slots: {} };
  {
    const dy = (1 - a.label) * 20 * k, o = a.label;
    const cy = out.top + dy;
    const titleW = tw(title, fs);
    const subW = Math.max(0, ...lines.map((l) => tw(l.text, fs * (l.size || 0.72), l.weight || 500)));
    const gap = 12 * k, blockW = ws + gap + Math.max(titleW, subW);
    const x0 = side === 'left' ? g.x - 10 * k - blockW : g.x - ws / 2;
    const wellX = side === 'left' ? x0 + blockW - ws : x0;
    const tx = side === 'left' ? wellX - gap : wellX + ws + gap, anchor = side === 'left' ? 'end' : 'start';
    const nl = lines.length, lineH = fs * 0.94;
    const blockH = fs * 1.16 + nl * lineH;
    const ty0 = cy - blockH / 2 + fs * 0.9;
    s = `<g opacity="${r(o * 1000) / 1000}">`;
    const wk = a.wellK ?? 1, tk = a.titleK ?? 1;
    if (wk > 0) s += `<g opacity="${r(wk * 1000) / 1000}"><circle cx="${r(wellX + ws / 2)}" cy="${r(cy)}" r="${r(ws / 2)}" fill="${t.bg}"/>` + icon(glyph, wellX + ws / 2, cy, ws * 0.42, t.ink) + '</g>';
    if (tk > 0) s += text(tx, ty0, title, fs, { fill: titleInk || C.ink, anchor, opacity: tk });
    out.title = { x: anchor === 'end' ? tx - tw(title, fs) : tx, y: ty0, size: fs };
    lines.forEach((l, i) => {
      const y = ty0 + fs * 0.2 + (i + 1) * lineH - fs * 0.12;
      out.slots[i] = { x: tx, y, size: fs * (l.size || 0.72), anchor };
      if ((l.k ?? 1) > 0) s += text(tx, y + (1 - (l.k ?? 1)) * 12 * k, l.text, fs * (l.size || 0.72), { weight: l.weight || 500, fill: l.fill || C.ink2, anchor, opacity: l.k ?? 1 });
    });
    s += '</g>';
    if (a.label > 0) out.svg += s;
  }
  return out;
}

/** family text-message bubble (a family text, not ACTIQO UI): white card, hairline, tail at the lower left */
export function bubble(x, y, parts, size, { opacity = 1, dy = 0, hideFrom = -1 } = {}) {
  const padX = size * 0.68, padT = size * 0.5, padB = size * 0.56, lh = size * 1.18;
  const w = parts.reduce((acc, p) => acc + tw(p, size), 0) + 2 * padX, h = padT + lh + padB;
  const rr = size * 0.62, rt = size * 0.18;
  const Y = y + dy;
  const d = `M${r(x + rr)},${r(Y)} H${r(x + w - rr)} Q${r(x + w)},${r(Y)} ${r(x + w)},${r(Y + rr)} V${r(Y + h - rr)} Q${r(x + w)},${r(Y + h)} ${r(x + w - rr)},${r(Y + h)} H${r(x + rt)} Q${r(x)},${r(Y + h)} ${r(x)},${r(Y + h - rt)} V${r(Y + rr)} Q${r(x)},${r(Y)} ${r(x + rr)},${r(Y)}Z`;
  let s = `<g opacity="${r(opacity * 1000) / 1000}"><path d="${d}" fill="#FFFFFF" stroke="${C.ink}" stroke-opacity=".10" stroke-width="1.5"/>`;
  let cx = x + padX; const pos = [];
  parts.forEach((p, i) => { pos.push({ x: cx, y: Y + padT + size * 0.95, w: tw(p, size) }); if (i !== hideFrom) s += text(cx, Y + padT + size * 0.95, p, size); cx += tw(p, size); });
  return { svg: s + '</g>', w, h, pos };
}

export function mixHex(a, b, t) {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16)), pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return '#' + pa.map((v, i) => Math.round(v + (pb[i] - v) * t).toString(16).padStart(2, '0')).join('');
}
/** centripetal-free uniform Catmull-Rom through points */
export function catmull(P, n = 72) {
  const pts = [];
  for (let i = 0; i < P.length - 1; i++) {
    const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)];
    const m = Math.ceil(n / (P.length - 1));
    for (let j = 0; j < m; j++) { const t = j / m, t2 = t * t, t3 = t2 * t;
      pts.push({ x: 0.5 * (2 * p1.x + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
                 y: 0.5 * (2 * p1.y + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3) }); }
  }
  pts.push(P[P.length - 1]); return pts;
}
/** the loose end: hangs from the hand down to the floor, then lies along the floor to b (b is on the floor) */
export function hangingThread(a, b, n = 72) {
  const dx = b.x - a.x, gy = b.y;
  const P = [a, { x: a.x + 0.06 * dx, y: lerp(a.y, gy, 0.62) }, { x: a.x + 0.2 * dx, y: gy + 22 }, { x: a.x + 0.55 * dx, y: gy + 16 }, b];
  const pts = [];
  for (let i = 0; i < P.length - 1; i++) {
    const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)];
    const m = Math.ceil(n / (P.length - 1));
    for (let j = 0; j < m; j++) { const t = j / m, t2 = t * t, t3 = t2 * t;
      pts.push({ x: 0.5 * (2 * p1.x + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
                 y: 0.5 * (2 * p1.y + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3) }); }
  }
  pts.push(b); return pts;
}
/** sample a cubic bezier a→b with a downward sag (a thread lying toward the floor) */
export function threadPts(a, b, sag, n = 64) {
  const c1 = { x: a.x + (b.x - a.x) * 0.3, y: a.y + sag }, c2 = { x: b.x - (b.x - a.x) * 0.25, y: b.y + sag * 0.6 };
  const pts = [];
  for (let i = 0; i <= n; i++) { const t = i / n, u = 1 - t; pts.push({ x: u * u * u * a.x + 3 * u * u * t * c1.x + 3 * u * t * t * c2.x + t * t * t * b.x, y: u * u * u * a.y + 3 * u * u * t * c1.y + 3 * u * t * t * c2.y + t * t * t * b.y }); }
  return pts;
}
/** draw the first fraction k of a polyline as the orange unresolved thread */
export function thread(pts, k, { color = C.orange, width = 4.5, dash = '2 13', opacity = 1, knot = true } = {}) {
  if (k <= 0) return '';
  const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y));
  const tgt = L[L.length - 1] * k; const out = [pts[0]];
  for (let i = 1; i < pts.length; i++) { if (L[i] <= tgt) out.push(pts[i]); else { const f = (tgt - L[i - 1]) / (L[i] - L[i - 1]); out.push({ x: lerp(pts[i - 1].x, pts[i].x, f), y: lerp(pts[i - 1].y, pts[i].y, f) }); break; } }
  const d = 'M' + out.map((p) => `${r(p.x)},${r(p.y)}`).join(' L');
  return `<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-dasharray="${dash}" opacity="${opacity}"/>` +
    (knot ? `<circle cx="${r(pts[0].x)}" cy="${r(pts[0].y)}" r="${r(width * 1.4)}" fill="${color}" opacity="${opacity}"/>` : '');
}
