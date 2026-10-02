// Film 02 · CP2 · 0–12 s — recognition + accumulation. One timeline, two separately composed formats.
import { simulate } from '../lib/gait.mjs';
import { drawFigure, CAST, cleatsArt } from '../lib/character.mjs';
import { C, X, LANE, EASE, span, lerp, clamp01, cam, r, text, tw, pathFloor, planFloor, route, marker, bubble, hangingThread, threadPts, thread } from '../lib/world.mjs';

// ── one shared timeline (seconds) ──
export const T = {
  buzz1: 0.4, msg1: 0.48, buzz2: 1.5, msg2: 1.58,
  floorUp: 3.0, leave: 3.0, dad: 4.2, leo: 5.2, field7: 5.25, maya: 6.4, prep: 7.4, cleatsFly: 7.58, cleatsLand: 8.1,
  question: 7.95, spool: 8.25, pullback: 9.0, pickup: 9.55, hold: 10.6, end: 12.0,
};
const bump = (t, t0, d = 0.6) => EASE.std(clamp01((t - t0) / d));
/** Mom's load: bag + phone at the start; each new responsibility adds a little; cleats add the most; the stop settles at 1 */
export const load = (t) => Math.min(1, 0.42 + 0.06 * (bump(t, T.leave) + bump(t, T.dad) + bump(t, T.leo) + bump(t, T.maya)) + 0.2 * bump(t, T.cleatsLand - 0.3, 0.5) + 0.1 * bump(t, 9.2, 1.2))
  + (t > T.hold - 0.6 ? 0.018 * Math.sin(((t - (T.hold - 0.6)) / 3.0) * Math.PI * 2) : 0);
/** head: reading → glancing up at the world as it builds → down at the phone as the question becomes the thread → the weight */
const tilt = (t) => lerp(lerp(lerp(14, 3, span(t, 3.0, 0.6, EASE.breath)), 11, span(t, 7.95, 0.5, EASE.breath)), 16, span(t, 9.3, 1.0, EASE.breath));

// ── per-format composition ──
export const FMT = {
  wide: {
    W: 1920, H: 1080, L: LANE, hx: 1.3,
    cam0: { horizon: 180, F: 1000, camH: 862, sx: 960 }, cam1: { horizon: 150, F: 840, camH: 1000, sx: 960 },
    momH: 84,                                   // head height (px) at the opening
    momX: [[0, 640], [3, 600], [9, 420], [10.6, 330]], // Mom's hip, screen x
    leaveX: [[0, 1060], [3, 990], [9, 900], [10.6, 842]], // the 4:48 tick, screen x (the plan floor's slow drift)
    msg: { size: 46, b1: [700, 112], b2: [780, 232] },
    mk: { size: 44, min: 34, leave: { side: 'right', rise: 150 }, leo: { side: 'right', rise: 480 }, maya: { side: 'left', rise: 170 }, pick: { side: 'left', rise: 150 } },
    labelSize: 24, threadW: 4.5, sag: 150,
  },
  tall: {
    // derived so that (final) Mom's feet ≈ y 1700, Leo's lane ≈ y 900, Maya's lane ≈ y 600, fold ≈ y 1100
    W: 1080, H: 1920, L: { mom: 1150, fold: 1458, leo: 1600, maya: 1876 }, hx: 0.619,
    cam0: { horizon: -1373, F: 996, camH: 3571, sx: 540 }, cam1: { horizon: -1144, F: 860, camH: 3803, sx: 540 },
    momH: 110,
    momX: [[0, 380], [3, 350], [9, 300], [10.6, 245]],
    leaveX: [[0, 600], [3, 545], [9, 520], [10.6, 470]],
    msg: { size: 52, b1: [110, 226], b2: [180, 330] },
    mk: { size: 44, min: 38, leave: { side: 'left', rise: 96 }, leo: { side: 'left', rise: 337 }, maya: { side: 'left', rise: 62 }, pick: { side: 'left', rise: 874 } },
    labelSize: 26, threadW: 5, thread: 'rise', sag: 70,
  },
};

const key = (kf, t, e = EASE.std) => {
  if (t <= kf[0][0]) return kf[0][1];
  for (let i = 1; i < kf.length; i++) if (t <= kf[i][0]) { const [t0, v0] = kf[i - 1], [t1, v1] = kf[i]; const ease = t0 >= T.pullback - 0.01 ? EASE.cam : (u) => u; return lerp(v0, v1, ease((t - t0) / (t1 - t0))); }
  return kf[kf.length - 1][1];
};
const camAt = (f, t) => { const k = span(t, T.pullback, T.hold - T.pullback, EASE.cam); const o = {}; for (const n of ['horizon', 'F', 'camH', 'sx']) o[n] = lerp(f.cam0[n], f.cam1[n], k); return o; };

// strings to measure (Inter metrics)
export const STRINGS = [
  ['Practice moved to ', 600], ['Field 7', 600], ['Who has pickup?', 600], ['Practice moved to Field 7', 600],
  ['Leave by 4:48 PM', 600], ['Dad drop-off', 500], ['Leo · Soccer Practice', 600], ['5:30 · Field 7', 500], ['5:30 · ', 500], ['Field 7', 500],
  ['Cleats · Shin guards', 500], ['Maya · Dance', 600], ['5:15', 500], ['Pickup · 6:30 · ?', 600],
];

export function makeScene(fmtName) {
  const f = FMT[fmtName];
  const L = f.L;
  const Xf = (hr) => X(hr) * f.hx;
  const hW = (f.momH * L.mom) / f.cam0.F;                    // Mom's head height in world units
  const sim = simulate({
    h: hW, x0: 0, groundY: 0, t0: -2, t1: 14,
    cadence: (t) => lerp(1.02, 1.07, load(t)), stride: (t) => lerp(2.45, 2.16, load(t)),
    speedScale: (t) => lerp(1, 0.3, span(t, T.pullback, 1.0, EASE.std)), stopAfter: 9.95,
  });

  return function frame(t) {
    const c = camAt(f, t);
    const kM = c.F / L.mom, gy = c.horizon + (c.camH * c.F) / L.mom;
    const st = sim.at(t), lag = sim.at(t - 0.07);
    const x0P = st.x - (key(f.momX, t) - c.sx) / kM;
    const cP = cam({ ...c, x0: x0P });
    const sLeo = c.F / L.leo;
    const cL = cam({ ...c, x0: Xf(16.8) - (key(f.leaveX, t) - c.sx) / sLeo });
    const toScr = (p) => ({ x: c.sx + (p.x - x0P) * kM, y: gy + p.y * kM });

    // floor: faint ghost at the start, full from ~4 s; hour labels arrive with the first marker
    const floorO = lerp(0.4, 1, span(t, T.floorUp, 1.2, EASE.breath));
    let s = `<rect width="${f.W}" height="${f.H}" fill="${C.ivory}"/>`;
    s += pathFloor(cP, { W: f.W, L, opacity: floorO });
    s += planFloor(cL, { W: f.W, H: f.H, L, Xf, opacity: floorO, labels: span(t, T.leave + 0.2, 0.6), lanes: span(t, T.floorUp, 1.0), labelSize: f.labelSize });

    // routes
    s += route(cL, Xf(16.8), Xf(17.5), L.leo, span(t, T.leo - 0.25, 0.7), { color: C.green, opacity: 0.85 });
    s += route(cL, Xf(17.5), Xf(18.5), L.leo, span(t, T.leo + 0.2, 0.8), { color: C.leo, opacity: 0.5 });
    s += route(cL, Xf(17.25), Xf(18.25), L.maya, span(t, T.maya + 0.15, 0.8), { color: C.maya, opacity: 0.45 });

    // markers
    const A = (t0) => ({ tick: span(t, t0, 0.14), stem: span(t, t0 + 0.08, 0.34), label: span(t, t0 + 0.25, 0.45, EASE.enter) });
    const M = f.mk;
    const mLeave = marker(cL, { x: Xf(16.8), z: L.leo, tone: 'green', glyph: 'solid-car-side', title: 'Leave by 4:48 PM', titleInk: C.green, size: M.size, min: M.min, ...M.leave, a: A(T.leave),
      lines: [{ text: 'Dad drop-off', k: span(t, T.dad, 0.45, EASE.enter) }] });
    const leoLines = [{ text: '5:30 · Field 7', k: 0 }, { text: 'Cleats · Shin guards', k: span(t, T.prep, 0.45, EASE.enter), fill: C.blue }];
    const mLeo = marker(cL, { x: Xf(17.5), z: L.leo, tone: 'leo', glyph: 'solid-futbol', title: 'Leo · Soccer Practice', size: M.size, min: M.min, ...M.leo, a: { ...A(T.leo), label: span(t, T.field7 + 0.5, 0.45, EASE.enter) }, lines: leoLines });
    const mMaya = marker(cL, { x: Xf(17.25), z: L.maya, tone: 'maya', glyph: 'solid-compact-disc', title: 'Maya · Dance', size: M.size, min: M.min, ...M.maya, a: A(T.maya), lines: [{ text: '5:15' }] });
    const mPick = marker(cL, { x: Xf(18.5), z: L.leo, tone: 'orange', glyph: 'solid-person-walking', title: 'Pickup · 6:30 · ?', titleInk: C.orange, size: M.size, min: M.min, ...M.pick, a: A(T.pickup), lines: [] });
    s += mLeave.svg + mMaya.svg + mLeo.svg + mPick.svg;

    // Leo's sub-line "5:30 · " + "Field 7" (Field 7 arrives from the message)
    const leoLabelK = span(t, T.field7 + 0.5, 0.45, EASE.enter);
    let field7Dest = null;
    if (mLeo.slots[0]) {
      const sl = mLeo.slots[0], full = tw('5:30 · Field 7', sl.size, 500);
      const x0 = sl.anchor === 'end' ? sl.x - full : sl.x;
      const dy = (1 - leoLabelK) * 20 * mLeo.k;
      s += text(x0, sl.y + dy, '5:30 · ', sl.size, { weight: 500, fill: C.ink2, opacity: leoLabelK });
      field7Dest = { x: x0 + tw('5:30 · ', sl.size, 500), y: sl.y, size: sl.size };
    }

    // ── messages (a family text — not ACTIQO UI) ──
    const a0 = sim.at(t);
    const fig = drawFigure(a0, CAST.mom, hW, { load: load(t), arms: { near: 'phone', far: t >= T.cleatsLand ? 'cleats' : 'swing' }, farMix: span(t, T.cleatsFly, T.cleatsLand - T.cleatsFly, EASE.std), bag: 'mom', tilt: tilt(t), lag });
    const phone = toScr(fig.anchors.phone);
    const ms = f.msg.size;
    // buzz: two short restrained tick pairs beside the phone
    for (const tb of [T.buzz1, T.buzz2]) { const u = (t - tb) / 0.22; if (u > 0 && u < 1) { const o = Math.sin(u * Math.PI) * 0.5; for (const sgn of [-1, 1]) s += `<path d="M${r(phone.x + sgn * 26)},${r(phone.y - 14)} q${r(sgn * 6)},14 0,28" fill="none" stroke="${C.ink}" stroke-opacity="${r(o * 100) / 100}" stroke-width="2" stroke-linecap="round"/>`; } }
    const b1In = span(t, T.msg1, 0.45, EASE.enter), b2In = span(t, T.msg2, 0.45, EASE.enter);
    const b1Out = span(t, T.field7 + 0.15, 0.4);
    const qOut = span(t, T.question, 0.35, EASE.std);
    const tether = (b, k) => { const tail = { x: b.x + 8, y: b.y + b.h - 4 }; const mid = { x: lerp(phone.x, tail.x, 0.5), y: Math.max(phone.y, tail.y) - 30 };
      return `<path d="M${r(phone.x)},${r(phone.y)} Q${r(mid.x)},${r(mid.y)} ${r(lerp(phone.x, tail.x, k))},${r(lerp(phone.y, tail.y, k))}" fill="none" stroke="${C.ink}" stroke-opacity=".2" stroke-width="2.5" stroke-dasharray="2 9" stroke-linecap="round"/>`; };
    let field7Src = null;
    if (b1In > 0 && b1Out < 1) {
      const B = bubble(f.msg.b1[0], f.msg.b1[1], ['Practice moved to ', 'Field 7'], ms, { opacity: b1In * (1 - b1Out), dy: (1 - b1In) * 20, hideFrom: t >= T.field7 ? 1 : -1 });
      field7Src = B.pos[1];
      if (t < T.msg2) s += tether({ x: f.msg.b1[0], y: f.msg.b1[1], h: B.h }, span(t, T.msg1 - 0.1, 0.2));
      s += B.svg;
    } else { const B = bubble(f.msg.b1[0], f.msg.b1[1], ['Practice moved to ', 'Field 7'], ms, { opacity: 0 }); field7Src = B.pos[1]; }
    if (b2In > 0 && qOut < 1) {
      const B = bubble(f.msg.b2[0], f.msg.b2[1], ['Who has pickup?'], ms, { opacity: b2In * (1 - qOut), dy: (1 - b2In) * 20 });
      // the question contracts toward its tail (the phone side) as it becomes the thread
      // the question returns down its tether into the phone (the thread then leaves from the same point)
      const sc = 1 - 0.94 * qOut, ox = f.msg.b2[0] + 8, oy = f.msg.b2[1] + B.h - 4;
      const tx = lerp(0, phone.x - ox, qOut), ty = lerp(0, phone.y - oy, qOut);
      s += tether({ x: f.msg.b2[0] + tx, y: f.msg.b2[1] + ty, h: B.h * sc }, (1 - qOut) * span(t, T.msg2 - 0.1, 0.2));
      s += `<g opacity="${r((1 - qOut) ** 1.5 * 1000) / 1000}" transform="translate(${r(ox + tx)},${r(oy + ty)}) scale(${r(sc * 1000) / 1000}) translate(${r(-ox)},${r(-oy)})">${B.svg}</g>`;
    }
    // "Field 7" leaves the message and lands in Leo's marker
    const fk = span(t, T.field7, 0.62, EASE.std);
    if (t >= T.field7 && field7Src && field7Dest) {
      const from = { x: field7Src.x, y: field7Src.y }, to = field7Dest;
      const ctrl = { x: lerp(from.x, to.x, 0.5), y: Math.min(from.y, to.y) - 60 };
      const u = fk, x = (1 - u) ** 2 * from.x + 2 * (1 - u) * u * ctrl.x + u * u * to.x, y = (1 - u) ** 2 * from.y + 2 * (1 - u) * u * ctrl.y + u * u * to.y;
      const size = lerp(ms, to.size, u), weight = Math.round(lerp(600, 500, u));
      const col = u < 1 ? C.ink : C.ink2;
      s += `<text x="${r(x)}" y="${r(y)}" font-family="Inter" font-weight="${weight}" font-size="${r(size)}" fill="${col}" letter-spacing="-0.01em">Field 7</text>`;
    }

    // ── the unresolved pickup: from the phone hand to 6:30 on Leo's lane ──
    const pickG = cL.p(Xf(18.5), L.leo);
    const spoolK = span(t, T.spool, 1.0, EASE.std);
    const threadSvg = spoolK > 0 ? thread(f.thread === 'rise' ? threadPts(phone, pickG, f.sag) : hangingThread(phone, pickG), spoolK, { width: f.threadW }) : '';

    // ── cleats: the prep line on Leo's marker becomes the physical load in her far hand ──
    let flySvg = '';
    if (t >= T.cleatsFly && t < T.cleatsLand && mLeo.slots[1]) {
      const u = span(t, T.cleatsFly, T.cleatsLand - T.cleatsFly, EASE.std);
      const sl = mLeo.slots[1];
      const from = { x: sl.anchor === 'end' ? sl.x - tw('Cleats · Shin guards', sl.size, 500) * 0.5 : sl.x + tw('Cleats · Shin guards', sl.size, 500) * 0.25, y: sl.y + sl.size * 0.4 };
      const to = toScr(fig.anchors.gripF);
      const ctrl = { x: lerp(from.x, to.x, 0.55), y: Math.min(from.y, to.y) - 40 };
      const x = (1 - u) ** 2 * from.x + 2 * (1 - u) * u * ctrl.x + u * u * to.x, y = (1 - u) ** 2 * from.y + 2 * (1 - u) * u * ctrl.y + u * u * to.y;
      const sc = lerp(0.35, 1, u) * kM;
      flySvg = `<g transform="translate(${r(x)},${r(y)}) scale(${r(sc * 1000) / 1000})" opacity="${r(Math.min(1, u * 4) * 1000) / 1000}">${cleatsArt({ x: 0, y: 0 }, hW)}</g>`;
    }

    // Mom (world → screen: exact projection at her lane depth, so her feet stay planted on the path)
    s += `<g transform="translate(${r(c.sx - x0P * kM)},${r(gy)}) scale(${r(kM * 10000) / 10000})">${fig.svg}</g>`;
    s += threadSvg + flySvg;
    return s;
  };
}
