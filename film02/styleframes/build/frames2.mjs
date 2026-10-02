// Film 02 · "What You Carry" — five key moments × two formats (16:9 master, 9:16 social). Static styleframes.
import { readFileSync, writeFileSync } from 'node:fs';
import { figure, POSES, PALETTE } from './figure.mjs';

const BRAND = '/workspaces/actiqo-motion/brand';
const icon = (name, size, style = '') => {
  const s = readFileSync(`${BRAND}/icons/fontawesome-7/${name}.svg`, 'utf8');
  return `<svg width="${size}" height="${size}" viewBox="${s.match(/viewBox="([^"]+)"/)[1]}" style="display:block;${style}"><path fill="currentColor" d="${s.match(/ d="([^"]+)"/)[1]}"/></svg>`;
};
const r = (v) => Math.round(v * 10) / 10;

// ── semantic colours (production tokens) ────────────────────────────────────
const C = {
  ink: '#0B1F3B', ink2: '#3F4C63', ink3: '#7A869A', hair: 'rgba(11,31,59,0.08)',
  green: '#0F7A4B', greenS: '#DCEFE3', orange: '#C2410C', orangeS: '#FBEAD9', blue: '#1D4ED8', blueS: '#E6EEFE',
  leo: '#0EA5E9', maya: '#7C3AED', tint: 'rgba(11,31,59,0.06)',
};

// ── the world: the afternoon is a floor. X = clock time, Z = depth lanes (one per person/child) ──
const HOUR = 760;
const X = (hr) => (hr - 16) * HOUR;
const LANE = { mom: 1150, leo: 1600, maya: 2300 };
function cam({ horizon, F, camH, x0, sx }) {
  const p = (x, z) => ({ x: sx + ((x - x0) * F) / z, y: horizon + (camH * F) / z, s: F / z });
  return { horizon, F, camH, x0, sx, p };
}
function ground(c, { W, H, opacity = 1, from = 14.5, to = 20.5, zNear = 700, zFar = 9000, labels = true, labelZ = 900, lanes = true, fold = null }) {
  let g = '';
  const zEnd = fold || zFar;
  const hy = Math.max(0, c.horizon);
  g += `<defs><linearGradient id="floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FCFAF7"/><stop offset="1" stop-color="#F3EEE6"/></linearGradient></defs><rect x="0" y="${r(hy)}" width="${W}" height="${r(H - hy)}" fill="url(#floor)"/>`;
  for (let hh = from; hh <= to; hh += 0.5) {
    const full = hh % 1 === 0;
    const a = c.p(X(hh), zNear), b = c.p(X(hh), zEnd);
    g += `<line x1="${r(a.x)}" y1="${r(a.y)}" x2="${r(b.x)}" y2="${r(b.y)}" stroke="rgba(11,31,59,${full ? 0.10 : 0.045})" stroke-width="${full ? 2 : 1.5}"/>`;
    if (full && labels) {
      const l = c.p(X(hh), labelZ);
      if (l.x > 40 && l.x < W - 120 && l.y < H - 20) g += `<text x="${r(l.x + 12)}" y="${r(l.y - 12)}" font-family="Inter" font-weight="500" font-size="${r(Math.max(22, 26 * l.s / 0.9))}" fill="${C.ink3}">${hh - 12} PM</text>`;
    }
  }
  if (lanes) for (const z of [LANE.mom, LANE.leo, LANE.maya].filter((z) => !fold || z < fold)) {
    const a = c.p(X(from), z), b = c.p(X(to), z);
    g += `<line x1="${r(a.x)}" y1="${r(a.y)}" x2="${r(b.x)}" y2="${r(b.y)}" stroke="rgba(11,31,59,0.05)" stroke-width="2"/>`;
  }
  return `<g opacity="${opacity}">${g}</g>`;
}
const seg = (c, x1, x2, z, { color, width = 6, dash = '', opacity = 1 }) => {
  const a = c.p(x1, z), b = c.p(x2, z);
  return `<line x1="${r(a.x)}" y1="${r(a.y)}" x2="${r(b.x)}" y2="${r(b.y)}" stroke="${color}" stroke-width="${r(width * a.s / 0.6)}" stroke-linecap="round" ${dash ? `stroke-dasharray="${dash}"` : ''} opacity="${opacity}"/>`;
};
const TONE = {
  green: { ink: C.green, bg: C.greenS }, orange: { ink: C.orange, bg: C.orangeS }, leo: { ink: C.leo, bg: `${C.leo}24` },
  maya: { ink: C.maya, bg: `${C.maya}1F` }, neutral: { ink: C.ink, bg: C.tint },
};
/** A marker planted at (time, lane): ground tick + short stem + two-line label to one side of the stem. */
function marker(c, { x, z, title, sub, tone, glyph, side = 'right', rise = 110, size = 38, min = 24, opacity = 1, titleInk, subInk }) {
  const g = c.p(x, z), k = Math.max(g.s / 0.62, min / size), t = TONE[tone];
  const top = g.y - rise * g.s;
  const svg = `<ellipse cx="${r(g.x)}" cy="${r(g.y)}" rx="${r(16 * g.s)}" ry="${r(6 * g.s)}" fill="${t.ink}" opacity="${opacity}"/>` +
    `<line x1="${r(g.x)}" y1="${r(g.y)}" x2="${r(g.x)}" y2="${r(top)}" stroke="${t.ink}" stroke-width="${r(Math.max(2, 3.2 * g.s))}" opacity="${0.6 * opacity}"/>`;
  const fs = size * k, ws = 52 * k;
  const html = `<div class="mk" style="left:${r(g.x)}px;top:${r(top)}px;opacity:${opacity};transform:translate(${side === 'left' ? `calc(-100% - ${r(10 * k)}px)` : `${r(-ws / 2)}px`},-50%)">
    <div class="mk-in" style="gap:${r(12 * k)}px;${side === 'left' ? 'flex-direction:row-reverse;text-align:right' : ''}">
      <div class="well" style="width:${r(ws)}px;height:${r(ws)}px;background:${t.bg};color:${t.ink}">${icon(glyph, r(ws * 0.42))}</div>
      <div><div style="font-size:${r(fs)}px;line-height:${r(fs * 1.16)}px;font-weight:600;color:${titleInk || C.ink};white-space:nowrap;letter-spacing:-0.01em">${title}</div>
      ${sub ? `<div style="font-size:${r(fs * 0.72)}px;line-height:${r(fs * 0.94)}px;font-weight:500;color:${subInk || C.ink2};white-space:nowrap">${sub}</div>` : ''}</div>
    </div></div>`;
  return { svg, html, g, top, k };
}
/** The afternoon's routes on the floor: the drive (green), Leo's practice (sky), Maya's dance (violet). */
function routes(c, { opacity = 1 } = {}) {
  return seg(c, X(16.8), X(17.5), LANE.leo, { color: C.green, width: 6, opacity: 0.85 * opacity }) +
    seg(c, X(17.5), X(18.5), LANE.leo, { color: C.leo, width: 6, opacity: 0.5 * opacity }) +
    seg(c, X(17.25), X(18.25), LANE.maya, { color: C.maya, width: 6, opacity: 0.45 * opacity });
}
function markersAll(c, o = {}) {
  const size = o.size || 38, min = o.min || 24;
  return {
    leave: marker(c, { x: X(16.8), z: LANE.leo, title: 'Leave by 4:48 PM', sub: 'Dad drop-off', tone: 'green', glyph: 'solid-car-side', side: 'left', size, min, titleInk: C.green, ...(o.leave || {}) }),
    leo: marker(c, { x: X(17.5), z: LANE.leo, title: 'Leo · Soccer Practice', sub: '5:30 · Field 7', tone: 'leo', glyph: 'solid-futbol', side: 'right', size, min, ...(o.leo || {}) }),
    maya: marker(c, { x: X(17.25), z: LANE.maya, title: 'Maya · Dance', sub: '5:15', tone: 'maya', glyph: 'solid-compact-disc', side: 'right', size, min, ...(o.maya || {}) }),
    pick: marker(c, { x: X(18.5), z: LANE.leo, title: 'Pickup · 6:30 · ?', sub: null, tone: 'orange', glyph: 'solid-person-walking', side: 'right', size, min, titleInk: C.orange, ...(o.pick || {}) }),
  };
}
// Mom / Grandma placement (feet on the ground at a screen point)
function person(kind, pose, at, h, { flip = false, shadow = true, props } = {}) {
  const P0 = POSES[pose];
  const fig = figure(props ? { ...P0, props } : P0, kind === 'grandma' ? PALETTE.grandma : PALETTE.mom, h);
  const tx = at.x, ty = at.y - fig.feetY;
  const sh = shadow ? `<ellipse cx="${r(at.x)}" cy="${r(at.y)}" rx="${r(h * 1.5)}" ry="${r(h * 0.16)}" fill="rgba(11,31,59,0.09)"/>` : '';
  const handN = { x: tx + (flip ? -1 : 1) * fig.handN.x, y: ty + fig.handN.y };
  const handF = { x: tx + (flip ? -1 : 1) * fig.handF.x, y: ty + fig.handF.y };
  return { svg: `${sh}<g transform="translate(${r(tx)},${r(ty)})${flip ? ' scale(-1,1)' : ''}">${fig.svg}</g>`, handN, handF, head: { x: tx + fig.headC.x, y: ty + fig.headC.y } };
}
const thread = (a, b, { color = C.orange, dash = '2 13', width = 4.5, sag = 120, opacity = 1 } = {}) =>
  `<path d="M${r(a.x)},${r(a.y)} C${r(a.x + (b.x - a.x) * 0.3)},${r(a.y + sag)} ${r(b.x - (b.x - a.x) * 0.25)},${r(b.y + sag * 0.6)} ${r(b.x)},${r(b.y)}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" ${dash ? `stroke-dasharray="${dash}"` : ''} opacity="${opacity}"/>` +
  `<circle cx="${r(a.x)}" cy="${r(a.y)}" r="${r(width * 1.6)}" fill="${color}" opacity="${opacity}"/>`;
const bubble = (x, y, text, size, { align = 'left' } = {}) =>
  `<div class="bubble" style="left:${x}px;top:${y}px;font-size:${size}px;line-height:${r(size * 1.18)}px;padding:${r(size * 0.5)}px ${r(size * 0.68)}px ${r(size * 0.56)}px;border-radius:${r(size * 0.62)}px ${r(size * 0.62)}px ${r(size * 0.62)}px ${r(size * 0.18)}px;${align === 'right' ? 'transform:translateX(-100%)' : ''}">${text}</div>`;

// ── real ACTIQO UI (release/3.0-integrated-candidate) at a scale U ───────────
function ui(U) {
  const u = (pt) => r(pt * U);
  const css = `
    .gp-title{font-family:var(--acti-font-editorial);font-weight:600;font-size:${u(28)}px;line-height:${u(34)}px;letter-spacing:${u(-0.5)}px;text-align:center;color:${C.ink}}
    .gp-sub{font-size:${u(14)}px;line-height:${u(19)}px;color:${C.ink2};text-align:center}
    .card{background:#fff;border:2px solid ${C.hair};border-radius:${u(16)}px;box-shadow:0 ${u(1)}px ${u(2)}px rgba(11,31,59,.04),0 ${u(4)}px ${u(12)}px rgba(11,31,59,.04);overflow:hidden}
    .idrow{display:flex;gap:${u(12)}px;align-items:center;padding:${u(12)}px ${u(16)}px}
    .strong{font-size:${u(15)}px;line-height:${u(20)}px;font-weight:600;color:${C.ink}}
    .supporting{font-size:${u(14)}px;line-height:${u(19)}px;color:${C.ink2};display:flex;gap:${u(6)}px;align-items:center}
    .band{border-top:2px solid ${C.hair};padding:${u(12)}px ${u(16)}px;display:flex;gap:${u(10)}px;align-items:center;background:${C.greenS}}
    .leave{font-family:var(--acti-font-editorial);font-weight:600;font-size:${u(18)}px;line-height:${u(24)}px;letter-spacing:${u(-0.5)}px;color:${C.green}}
    .meta{font-size:${u(12)}px;line-height:${u(16)}px;color:${C.ink3}}
    .seclabel{display:flex;justify-content:space-between;align-items:center;font-size:${u(15)}px;line-height:${u(20)}px;font-weight:600;color:${C.ink};margin-bottom:${u(6)}px}
    .row{display:flex;align-items:center;gap:${u(12)}px;min-height:${u(52)}px;padding:${u(12)}px ${u(16)}px;box-sizing:border-box}
    .row + .row{border-top:2px solid ${C.hair}}
    .rlabel{font-size:${u(15)}px;line-height:${u(20)}px;font-weight:500;color:${C.ink};display:flex;gap:${u(8)}px;align-items:center}
    .rdesc{font-size:${u(13)}px;line-height:${u(18)}px;color:${C.ink2};margin-top:2px}
    .rval{font-size:${u(14)}px;line-height:${u(19)}px;color:${C.ink3}}
    .rval.att{color:${C.orange}}
    .pill{font-size:${u(12)}px;line-height:${u(16)}px;font-weight:600;padding:${u(3)}px ${u(9)}px;border-radius:999px;background:${C.tint};color:${C.ink}}
    .tabs{display:flex;gap:${u(6)}px}
    .tab{flex:1;text-align:center;padding:${u(7)}px ${u(10)}px;border-radius:999px;font-size:${u(14)}px;line-height:${u(19)}px;font-weight:600;border:2px solid ${C.hair};background:#fff;color:${C.ink};white-space:nowrap}
    .tab.on{background:${C.ink};border-color:${C.ink};color:#fff}`;
  const W = (tint, g, size = 44) => `<div class="well" style="width:${u(size)}px;height:${u(size)}px;background:${tint.bg};color:${tint.ink}">${icon(g, u(12))}</div>`;
  const T = { green: { bg: C.greenS, ink: C.green }, blue: { bg: C.blueS, ink: C.blue }, neutral: { bg: C.tint, ink: C.ink }, orange: { bg: C.orangeS, ink: C.orange } };
  const chev = `<span style="color:${C.ink3}">${icon('solid-chevron-right', u(12))}</span>`;
  return {
    u, css,
    sessionCard: () => `<div class="card"><div class="idrow">
        <div class="well" style="width:${u(44)}px;height:${u(44)}px;background:#FBF9F5;color:${C.ink}">${icon('solid-futbol', u(20))}</div>
        <div><div class="strong">Leo — Soccer Practice</div>
        <div class="supporting">${icon('regular-calendar', u(12), `color:${C.ink3}`)}Thu 5:30 PM</div>
        <div class="supporting">${icon('solid-location-dot', u(12), `color:${C.ink3}`)}Field 7</div></div></div>
      <div class="band">${W(T.green, 'solid-car-side', 40)}<div style="flex:1"><div class="leave">Leave by 4:48 PM</div><div class="meta">32 min drive</div></div>${chev}</div></div>`,
    planCard: ({ who = 'Dad drop-off' } = {}) => `<div class="seclabel"><span>Today’s plan</span><span class="meta">Prep 0 of 2</span></div>
      <div class="card">
        <div class="row">${W(T.green, 'solid-people-group')}<div style="flex:1"><div class="rlabel">Who’s doing what</div><div class="rdesc">${who}</div></div>${chev}</div>
        <div class="row">${W(T.blue, 'solid-bag-shopping')}<div style="flex:1"><div class="rlabel">What to bring</div><div class="rdesc">Cleats, Shin guards</div></div><div class="rval">0/2</div>${chev}</div>
      </div>`,
    assignments: ({ resolved }) => `
      <div class="gp-title" style="font-size:${u(22)}px;line-height:${u(28)}px">Game Plan</div>
      <div class="gp-sub" style="margin-bottom:${u(10)}px">Leo • Soccer Practice</div>
      <div class="tabs" style="margin-bottom:${u(16)}px"><div class="tab on">Assignments</div><div class="tab">Prep list</div><div class="tab">Ready Check</div></div>
      <div class="seclabel"><span>Assignments</span><span style="font-size:${u(13.5)}px;font-weight:500;color:${C.blue}">Edit</span></div>
      <div class="card">
        <div class="row">${W(T.green, 'solid-car-side')}<div style="flex:1"><div class="rlabel">Dad drop-off <span class="pill">Dad</span></div><div class="rdesc">Leave by 4:48 PM</div></div></div>
        ${resolved
          ? `<div class="row">${W(T.blue, 'solid-person-walking')}<div style="flex:1"><div class="rlabel">Grandma pickup <span class="pill">Grandma</span></div><div class="rdesc">At 6:30 PM</div></div></div>`
          : `<div class="row">${W(T.neutral, 'solid-people-group')}<div style="flex:1"><div class="rlabel">No one on pickup</div></div><div class="rval att">Assign</div>${chev}</div>`}
      </div>`,
  };
}

// ── page shell ──────────────────────────────────────────────────────────────
const page = (Wd, Ht, extraCss, body) => `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="file://${BRAND}/actiqo-motion-tokens.css"><style>
  @font-face{font-family:'Inter';src:url('file://${BRAND}/fonts/Inter[opsz,wght].ttf');font-weight:100 900}
  html,body{margin:0;padding:0}
  body{width:${Wd}px;height:${Ht}px;overflow:hidden;position:relative;background:#FCFAF7;font-family:'Inter',sans-serif;color:${C.ink};-webkit-font-smoothing:antialiased}
  .abs{position:absolute}
  svg.world{position:absolute;left:0;top:0}
  .mk{position:absolute}
  .mk-in{display:flex;align-items:center}
  .well{flex:none;border-radius:50%;display:flex;align-items:center;justify-content:center}
  .bubble{position:absolute;background:#fff;border:2px solid ${C.hair};box-shadow:0 5px 10px rgba(11,31,59,.05),0 30px 70px rgba(11,31,59,.08);font-weight:600;letter-spacing:-0.02em;color:${C.ink};white-space:nowrap}
  .grain{position:absolute;inset:0;pointer-events:none;opacity:.07;mix-blend-mode:multiply;background:url(noise.png) repeat}
  ${extraCss}
</style></head><body>${body}
<div class="grain"></div>
</body></html>`;

// ═══════════════════════════════════════════════════════════════════════════
// SCENES — composed separately for 16:9 and 9:16 (never cropped from each other)
// ═══════════════════════════════════════════════════════════════════════════
const WIDE = { W: 1920, H: 1080 }, TALL = { W: 1080, H: 1920 };
const svgWrap = (d, inner) => `<svg class="world" width="${d.W}" height="${d.H}">${inner}</svg>`;
// 16:9: a high camera, ~35° down — the afternoon reads as an architectural floor.
const camWide = (x0, o = {}) => cam({ horizon: 180, F: 1000, camH: 862, x0, sx: 960, ...o });
// 9:16: a steep, near top-down camera — the floor fills the vertical frame; time runs across, lanes run up.
const camTall = (x0, o = {}) => cam({ horizon: -400, F: 1000, camH: 1962, x0, sx: 540, ...o });

// A · RECOGNITION — walking, phone, two family messages (a family text, not ACTIQO UI)
function sceneA(f) {
  const d = f === 'wide' ? WIDE : TALL, wide = f === 'wide';
  const c = wide ? camWide(X(16.3)) : camTall(X(16.3));
  const mom = wide ? person('mom', 'reading', c.p(X(15.62), LANE.mom), 90) : person('mom', 'reading', { x: 330, y: 1640 }, 112);
  const ph = { x: mom.handN.x + 6, y: mom.handN.y - 20 };
  const fs = wide ? 50 : 58;
  const b1 = wide ? { x: ph.x + 130, y: ph.y - 310 } : { x: 120, y: 520 };
  const b2 = wide ? { x: ph.x + 200, y: ph.y - 175 } : { x: 210, y: 680 };
  const tEnd = wide ? { x: b2.x + 10, y: b2.y + 72 } : { x: b2.x + 40, y: b2.y + 82 };
  const tether = `<path d="M${r(ph.x)},${r(ph.y)} C${r(ph.x + 30)},${r(ph.y - 80)} ${r(tEnd.x - 40)},${r(tEnd.y + 80)} ${r(tEnd.x)},${r(tEnd.y)}" fill="none" stroke="rgba(11,31,59,.2)" stroke-width="2.5" stroke-dasharray="2 9" stroke-linecap="round"/>`;
  return page(d.W, d.H, '', svgWrap(d, ground(c, { ...d, opacity: 0.4, labels: false, lanes: false }) + tether + mom.svg) +
    bubble(b1.x, b1.y, 'Practice moved to Field 7', fs) + bubble(b2.x, b2.y, 'Who has pickup?', fs));
}

// B · THE LOAD BUILDS — the afternoon fills in around her; the pickup thread starts
function sceneB(f) {
  const d = f === 'wide' ? WIDE : TALL, wide = f === 'wide';
  if (wide) {
    const c = camWide(X(16.85));
    const mom = person('mom', 'glancing', c.p(X(15.9), LANE.mom), 86);
    const m = markersAll(c, { size: 44, min: 32, leave: { rise: 120 }, leo: { rise: 330 }, maya: { rise: 520, side: 'left' } });
    const th = thread(mom.handF, { x: d.W + 40, y: c.p(X(18.5), LANE.leo).y }, { sag: 150, opacity: 0.9 });
    return page(d.W, d.H, '', svgWrap(d, ground(c, { ...d, opacity: 0.85 }) + routes(c) + m.leave.svg + m.leo.svg + m.maya.svg + th + mom.svg) + m.leave.html + m.leo.html + m.maya.html);
  }
  const c = camTall(X(17.2));
  const mom = person('mom', 'glancing', { x: 230, y: 1700 }, 100);
  const m = markersAll(c, { size: 46, min: 34, leave: { side: 'right', rise: 180 }, leo: { side: 'left', rise: 420 }, maya: { side: 'right', rise: 320 } });
  const th = thread(mom.handF, { x: d.W + 40, y: c.p(X(18.5), LANE.leo).y - 20 }, { sag: 140, opacity: 0.9 });
  return page(d.W, d.H, '', svgWrap(d, ground(c, { ...d, opacity: 0.85, labelZ: 1300 }) + routes(c) + m.leave.svg + m.leo.svg + m.maya.svg + th + mom.svg) + m.leave.html + m.leo.html + m.maya.html);
}

// C · THE WEIGHT — the camera pulls back: the whole afternoon rises around her; she stops
function sceneC(f) {
  const d = f === 'wide' ? WIDE : TALL, wide = f === 'wide';
  if (wide) {
    const c = cam({ horizon: 150, F: 840, camH: 1000, x0: X(17.35), sx: 1060 });
    const mom = person('mom', 'weight', c.p(X(16.0), LANE.mom - 120), 96);
    const m = markersAll(c, { size: 46, min: 32, leave: { rise: 150 }, leo: { rise: 520 }, maya: { rise: 1150, side: 'left' }, pick: { rise: 330 } });
    const th = thread(mom.handF, m.pick.g, { sag: 160, width: 5 });
    return page(d.W, d.H, '', svgWrap(d, ground(c, { ...d, opacity: 1 }) + routes(c) + Object.values(m).map((x) => x.svg).join('') + th + mom.svg) + Object.values(m).map((x) => x.html).join(''));
  }
  const c = camTall(X(17.62), { F: 900 });
  const mom = person('mom', 'weight', { x: 300, y: 1720 }, 112);
  const m = markersAll(c, { size: 44, min: 34, leave: { side: 'right', rise: 330 }, leo: { side: 'right', rise: 560 }, maya: { side: 'right', rise: 250 }, pick: { side: 'left', rise: 150 } });
  const th = thread(mom.handF, m.pick.g, { sag: 160, width: 5 });
  return page(d.W, d.H, '', svgWrap(d, ground(c, { ...d, opacity: 1, labelZ: 1300 }) + routes(c) + Object.values(m).map((x) => x.svg).join('') + th + mom.svg) + Object.values(m).map((x) => x.html).join(''));
}

// D · HERO — the floor folds up into a wall: the grid was ACTIQO's structure all along
function sceneD(f) {
  const d = f === 'wide' ? WIDE : TALL, wide = f === 'wide';
  const c = wide ? camWide(X(16.9)) : camTall(X(16.9));
  const FOLD = 1460, fy = c.p(0, FOLD).y;
  const U = wide ? 1.72 : 1.92, K = ui(U);
  const uiW = K.u(358), uiX = wide ? 1010 : (d.W - uiW) / 2;
  const wallTop = wide ? 40 : 230, wallH = fy - wallTop, uiTop = wide ? 0 : 0;
  const tilt = 16;
  let vlines = '';
  for (let hh = 14.5; hh <= 20.5; hh += 0.5) {
    const x = c.p(X(hh), FOLD).x;
    if (x < -50 || x > d.W + 50) continue;
    vlines += `<div class="abs" style="left:${r(x - 1)}px;bottom:0;width:${hh % 1 === 0 ? 2 : 1.5}px;height:${r(wallH)}px;background:linear-gradient(to top, rgba(11,31,59,${hh % 1 === 0 ? 0.11 : 0.05}), rgba(11,31,59,0))"></div>`;
  }
  const mk = ui(wide ? 1.5 : 1.75);
  const mayaCard = (x, y) => `<div class="abs" style="left:${r(x)}px;top:${r(y)}px;width:${mk.u(184)}px">
      <div style="background:#fff;border:2px solid ${C.hair};border-radius:${mk.u(16)}px;box-shadow:0 ${mk.u(4)}px ${mk.u(12)}px rgba(11,31,59,.05);display:flex;gap:${mk.u(10)}px;align-items:center;padding:${mk.u(10)}px ${mk.u(12)}px">
      <div class="well" style="width:${mk.u(36)}px;height:${mk.u(36)}px;background:${C.maya}1C;color:${C.maya}">${icon('solid-compact-disc', mk.u(12))}</div>
      <div><div style="font-size:${mk.u(15)}px;line-height:${mk.u(19)}px;font-weight:600">Maya — Dance</div><div style="font-size:${mk.u(13)}px;line-height:${mk.u(17)}px;color:${C.ink2}">Thu 5:15 PM</div></div></div></div>`;
  const wall = `<div class="abs" style="left:0;top:${r(wallTop)}px;width:${d.W}px;height:${r(wallH)}px;perspective:${wide ? 1700 : 2400}px;perspective-origin:50% -20%">
    <div style="position:absolute;inset:0;transform:rotateX(${tilt}deg);transform-origin:50% 100%;background:linear-gradient(to top, rgba(246,242,235,1), rgba(252,250,247,0) 92%)">
      ${vlines}
      <div class="abs" style="left:${r(uiX)}px;top:${uiTop}px;width:${uiW}px">
        <div class="gp-title" style="margin-bottom:${K.u(8)}px">Game Plan</div>${K.sessionCard()}<div style="height:${K.u(14)}px"></div>${K.planCard()}
      </div>
      ${wide ? mayaCard(470, 120) : ''}
    </div></div>`;
  const mom = wide ? person('mom', 'steady', c.p(X(15.95), LANE.mom), 88, { props: { bag: true, cleats: true } }) : person('mom', 'steady', { x: 250, y: 1760 }, 100, { props: { bag: true, cleats: true } });
  // where things went: the fold line, ghost labels of what just registered, dashed registration lines
  const gp = (hh) => c.p(X(hh), FOLD);
  const yOf = (pt) => wallTop + uiTop + K.u(pt) * (wide ? 0.97 : 0.98);
  const leaveY = yOf(34 + 8 + 76 + 24), sessY = yOf(34 + 8 + 28), whoY = yOf(34 + 8 + 128 + 14 + 26 + 26), bringY = yOf(34 + 8 + 128 + 14 + 26 + 78);
  const reg = (a, b, color, bend = 140) => `<path d="M${r(a.x)},${r(a.y)} C${r(a.x)},${r(a.y - bend)} ${r(b.x - 90)},${r(b.y)} ${r(b.x)},${r(b.y)}" fill="none" stroke="${color}" stroke-width="3" stroke-dasharray="2 9" stroke-linecap="round" opacity=".75"/>`;
  const ghost = (hh, text, color) => { const p = gp(hh); return `<text x="${r(p.x - 14)}" y="${r(fy + 34)}" text-anchor="end" font-family="Inter" font-weight="600" font-size="${wide ? 22 : 26}" fill="${color}" opacity=".45">${text}</text><ellipse cx="${r(p.x)}" cy="${r(fy)}" rx="13" ry="5" fill="${color}" opacity=".6"/>`; };
  const foldLine = `<line x1="0" y1="${r(fy)}" x2="${d.W}" y2="${r(fy)}" stroke="rgba(11,31,59,.12)" stroke-width="2"/>`;
  const regs =
    reg(gp(16.8), { x: uiX + K.u(6), y: leaveY }, C.green) +
    reg(gp(17.5), { x: uiX + K.u(6), y: sessY }, C.leo, 220) +
    reg({ x: mom.handF.x + 34, y: mom.handF.y + 60 }, { x: uiX + 4, y: bringY }, C.blue, 60) +
    thread(mom.handN, { x: uiX + 4, y: whoY }, { sag: wide ? 10 : 30, width: 4.5 });
  const mayaFloor = wide ? '' : mayaCard(600, fy + 230);
  return page(d.W, d.H, K.css, svgWrap(d, ground(c, { ...d, opacity: 0.9, labels: false, fold: FOLD, lanes: true }) + foldLine) + wall + mayaFloor +
    svgWrap(d, (wide
      ? ghost(16.8, 'Leave by 4:48 PM', C.green) + ghost(17.5, 'Leo · Soccer Practice', C.leo).replace('text-anchor="end"', 'text-anchor="start"').replace(`x="${r(gp(17.5).x - 14)}"`, `x="${r(gp(17.5).x + 14)}"`)
      : ghost(16.8, 'Leave by 4:48 PM', C.green).replace('text-anchor="end"', 'text-anchor="start"').replace(`x="${r(gp(16.8).x - 14)}"`, `x="${r(gp(16.8).x + 14)}"`)
        + ghost(17.5, 'Leo · Soccer Practice', C.leo).replace(`y="${r(fy + 34)}"`, `y="${r(fy + 76)}"`))
    + regs + mom.svg));
}

// E · THE VILLAGE — the real assignment resolves; Grandma takes the pickup; Mom's hands are free
function sceneE(f) {
  const d = f === 'wide' ? WIDE : TALL, wide = f === 'wide';
  const c = wide ? camWide(X(16.9)) : camTall(X(16.9));
  const U = wide ? 1.85 : 2.2, K = ui(U), cw = K.u(358);
  const cx = wide ? 1120 : (d.W - cw) / 2, cy = wide ? 150 : 250;
  const surface = `<div class="abs" style="left:${r(cx)}px;top:${cy}px;width:${cw}px">${K.assignments({ resolved: true })}</div>`;
  const mom = wide ? person('mom', 'free', c.p(X(15.95), LANE.mom), 88) : person('mom', 'free', { x: 270, y: 1700 }, 104);
  const gma = wide ? person('grandma', 'grandma', c.p(X(16.85), LANE.mom + 80), 82, { flip: true }) : person('grandma', 'grandma', { x: 780, y: 1640 }, 98, { flip: true });
  const rowY = cy + K.u(28 + 19 + 10 + 33 + 16 + 26) + K.u(52) + K.u(34);
  const end = wide ? { x: cx + 4, y: rowY } : { x: cx + K.u(40), y: cy + K.u(28 + 19 + 10 + 33 + 16 + 26 + 104 + 4) };
  const link = `<path d="M${r(gma.handN.x)},${r(gma.handN.y)} C${r(gma.handN.x + (wide ? 60 : 20))},${r(gma.handN.y - 200)} ${r(end.x - (wide ? 100 : 0))},${r(end.y + (wide ? 0 : 160))} ${r(end.x)},${r(end.y)}" fill="none" stroke="rgba(11,31,59,.32)" stroke-width="3" stroke-linecap="round"/><circle cx="${r(end.x)}" cy="${r(end.y)}" r="6" fill="rgba(11,31,59,.32)"/>`;
  return page(d.W, d.H, K.css, svgWrap(d, ground(c, { ...d, opacity: 0.45, labels: false, lanes: false }) + mom.svg + gma.svg + link) + surface);
}
const OUT = new URL('./out', import.meta.url).pathname;
import { mkdirSync } from 'node:fs';
mkdirSync(OUT, { recursive: true });
const S = { A: sceneA, B: sceneB, C: sceneC, D: sceneD, E: sceneE };
for (const [k, fn] of Object.entries(S)) for (const f of ['wide', 'tall']) writeFileSync(`${OUT}/${k}_${f}.html`, fn(f));
console.log('ok');
