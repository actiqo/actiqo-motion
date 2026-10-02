// Film 02 · scene, 0–20 s (CP2 recognition + accumulation · CP3 alignment, fold, Game Plan, put-downs). One timeline, two formats.
// For t < 12 this reproduces the approved CP2 exactly.
import { simulate } from '../lib/gait.mjs';
import { drawFigure, CAST, cleatsArt, bagArt } from '../lib/character.mjs';
import { gpLayout, gamePlan, mayaCard, mayaSlots, asLayout, assignments } from '../lib/gameplan.mjs';
import { C, X, LANE, EASE, span, lerp, clamp01, cam, r, text, tw, pathFloor, planFloor, route, marker, bubble, hangingThread, threadPts, thread, foldCam, mixHex, catmull } from '../lib/world.mjs';

// ── one shared timeline (seconds) ──
export const T = {
  buzz1: 0.4, msg1: 0.48, buzz2: 1.5, msg2: 1.58,
  floorUp: 3.0, leave: 3.0, dad: 4.2, leo: 5.2, field7: 5.25, maya: 6.4, prep: 7.4, cleatsFly: 7.58, cleatsLand: 8.1,
  question: 7.95, spool: 8.25, pullback: 9.0, pickup: 9.55, hold: 10.6, end: 12.0,
  // CP3
  align: 12.0, fold: 12.6, foldEnd: 14.4, gp: 14.35, regLeo: 14.45, regLeave: 15.25, regDad: 15.6, regPrep: 16.0, regMaya: 14.1,
  prepFly: 0.75, cleatsReg: 17.0, cleatsDown: 17.5, dadIn: 18.2, reach: 18.95, bagLift: 19.45, ack: 19.65, cp3End: 20.0,
  // CP4 · 20–26 s: Who's doing what → Assignments → Assign → Grandma takes the pickup
  look: 22.25, tapWho: 22.6, asOut: 22.75, asIn: 23.0, threadRe: 23.0, tapAssign: 23.6, gEnter: 23.4, catch: 24.55, resolve: 25.4, pocket: 25.55, cp4End: 26.0,
};
const bump = (t, t0, d = 0.6) => EASE.std(clamp01((t - t0) / d));
/** Mom's load: bag + phone at the start; each new responsibility adds a little; cleats add the most; the stop settles at 1 */
export const load = (t) => Math.min(1, 0.42 + 0.06 * (bump(t, T.leave) + bump(t, T.dad) + bump(t, T.leo) + bump(t, T.maya)) + 0.2 * bump(t, T.cleatsLand - 0.3, 0.5) + 0.1 * bump(t, 9.2, 1.2))
  + (t > T.hold - 0.6 ? 0.018 * Math.sin(((t - (T.hold - 0.6)) / 3.0) * Math.PI * 2) : 0)
  - 0.22 * bump(t, T.cleatsDown + 0.1, 0.7) - 0.25 * bump(t, T.bagLift, 0.6) - 0.1 * bump(t, T.resolve + 0.1, 0.6);
/** head: reading → glancing up at the world as it builds → down at the phone as the question becomes the thread → the weight */
const tilt = (t) => lerp(lerp(lerp(lerp(lerp(lerp(14, 3, span(t, 3.0, 0.6, EASE.breath)), 11, span(t, 7.95, 0.5, EASE.breath)), 16, span(t, 9.3, 1.0, EASE.breath)), 5, span(t, 14.2, 1.0, EASE.breath)),
  13, span(t, T.look, 0.35, EASE.breath)), 2, span(t, T.tapAssign + 0.3, 0.55, EASE.breath));

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
    tiltY: 40, gp: { x: 650, y: 88, U: 1.72 }, clip: 'card', maya: { x: 300, y: 122, U: 1.6 }, pickRiseEnd: 0.08, dadDz: 140, dadStopX: 175, gDz: 130, gStopX: 535,
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
    tiltY: 30, gp: { x: 230, y: 236, U: 2.0 }, clip: 'card', maya: { x: 36, y: 238, U: 1.25 }, pickRiseEnd: 0.05, dadDz: 110, dadStopX: 125, foldRise: { maya: 330, pickK: 0.06 }, gDz: 55, gStopX: 650, pickAnchor: 'below',
  },
};

const key = (kf, t, e = EASE.std) => {
  if (t <= kf[0][0]) return kf[0][1];
  for (let i = 1; i < kf.length; i++) if (t <= kf[i][0]) { const [t0, v0] = kf[i - 1], [t1, v1] = kf[i]; const ease = t0 >= T.pullback - 0.01 ? EASE.cam : (u) => u; return lerp(v0, v1, ease((t - t0) / (t1 - t0))); }
  return kf[kf.length - 1][1];
};
const camAt = (f, t) => { const k = span(t, T.pullback, T.hold - T.pullback, EASE.cam); const o = {}; for (const n of ['horizon', 'F', 'camH', 'sx']) o[n] = lerp(f.cam0[n], f.cam1[n], k); o.horizon += (f.tiltY || 0) * span(t, T.fold, T.foldEnd - T.fold, EASE.cam); return o; };

// strings to measure (Inter metrics)
export const STRINGS = [
  ['Practice moved to ', 600], ['Field 7', 600], ['Who has pickup?', 600], ['Practice moved to Field 7', 600],
  ['Leave by 4:48 PM', 600], ['Dad drop-off', 500], ['Leo · Soccer Practice', 600], ['5:30 · Field 7', 500], ['5:30 · ', 500], ['Field 7', 500],
  ['Cleats · Shin guards', 500], ['Maya · Dance', 600], ['5:15', 500], ['Pickup · 6:30 · ?', 600],
  ['Leo — Soccer Practice', 600], ['Thu 5:30 PM', 400], ['Field 7', 400], ['32 min drive', 400], ['Today’s plan', 600], ['Prep 0 of 2', 400],
  ['Who’s doing what', 500], ['Dad drop-off', 400], ['What to bring', 500], ['Cleats, Shin guards', 400], ['0/2', 400],
  ['Cleats', 500], ['Cleats', 400], [' · ', 500], [' · ', 400], [', ', 500], [', ', 400],
  ['Dad drop-off', 500], ['Grandma pickup', 500], ['Dad', 600], ['Grandma', 600], ['No one on pickup', 500], ['Maya — Dance', 600], ['Thu 5:15 PM', 400], ['Thu ', 400], ['5:30', 500],
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
  // Dad: walks in on Mom's path (slightly behind her), stops behind her left where the bag hangs
  const dadSim = simulate({ h: hW, x0: 0, groundY: 0, t0: 16, t1: 24, cadence: () => 0.95, stride: () => 2.66,
    speedScale: (t) => lerp(1, 0.35, span(t, 18.7, 0.4, EASE.std)), stopAfter: 18.98 });
  const dadEndX = dadSim.at(21).x;
  const GPL = gpLayout(f.gp.x, f.gp.y, f.gp.U);
  const ASL = asLayout(f.gp.x, f.gp.y, f.gp.U);
  // Grandma: walks in from frame-left on a lane just in front of Mom's, steps into the pickup thread's line, stops facing the plan
  const gSim = simulate({ h: hW, x0: 0, groundY: 0, t0: 21, t1: 32, cadence: () => 0.9, stride: () => 2.25,
    speedScale: (t) => lerp(1, 0.35, span(t, 24.7, 0.45, EASE.std)), stopAfter: 24.95 });
  const gEndX = gSim.at(31).x;
  const resample = (pts, n) => { const d = [0]; for (let i = 1; i < pts.length; i++) d.push(d[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y));
    const out = []; for (let j = 0; j < n; j++) { const L0 = (d[d.length - 1] * j) / (n - 1); let i = 1; while (i < d.length - 1 && d[i] < L0) i++; const u = (L0 - d[i - 1]) / Math.max(1e-6, d[i] - d[i - 1]);
      out.push({ x: lerp(pts[i - 1].x, pts[i].x, u), y: lerp(pts[i - 1].y, pts[i].y, u) }); } return out; };

  return function frame(t) {
    const c = camAt(f, t);
    const kM = c.F / L.mom, gy = c.horizon + (c.camH * c.F) / L.mom;
    const st = sim.at(t), lag = sim.at(t - 0.07);
    const x0P = st.x - (key(f.momX, t) - c.sx) / kM;
    const cP = cam({ ...c, x0: x0P });
    const sLeo = c.F / L.leo;
    const cL0 = cam({ ...c, x0: Xf(16.8) - (key(f.leaveX, t) - c.sx) / sLeo });
    // CP3: the plan floor folds up about the fold line into a vertical surface — the same plane, re-oriented
    const kF = span(t, T.fold, T.foldEnd - T.fold, EASE.cam);
    const cL = foldCam(cL0, L.fold, kF * Math.PI / 2);
    const kAlign = span(t, T.align, 0.6, EASE.std);
    const gpK = span(t, T.gp + 0.25, 0.8, EASE.std);                 // the UI resolves: the plan floor recedes behind it
    const toScr = (p) => ({ x: c.sx + (p.x - x0P) * kM, y: gy + p.y * kM });

    // floor: faint ghost at the start, full from ~4 s; hour labels arrive with the first marker
    const floorO = lerp(0.4, 1, span(t, T.floorUp, 1.2, EASE.breath));
    let s = `<rect width="${f.W}" height="${f.H}" fill="${C.ivory}"/>`;
    s += pathFloor(cP, { W: f.W, L, opacity: floorO });
    s += planFloor(cL, { W: f.W, H: f.H, L, Xf, opacity: floorO, labels: span(t, T.leave + 0.2, 0.6), lanes: span(t, T.floorUp, 1.0), labelSize: f.labelSize, grid: kAlign, planDim: 1 - 0.55 * gpK });

    // routes
    s += route(cL, Xf(16.8), Xf(17.5), L.leo, span(t, T.leo - 0.25, 0.7), { color: C.green, opacity: 0.85 * (1 - span(t, T.regLeave, 0.5)) });
    s += route(cL, Xf(17.5), Xf(18.5), L.leo, span(t, T.leo + 0.2, 0.8), { color: C.leo, opacity: 0.5 });
    s += route(cL, Xf(17.25), Xf(18.25), L.maya, span(t, T.maya + 0.15, 0.8), { color: C.maya, opacity: 0.45 * (1 - span(t, T.regMaya, 0.5)) });

    // markers
    const A = (t0) => ({ tick: span(t, t0, 0.14), stem: span(t, t0 + 0.08, 0.34), label: span(t, t0 + 0.25, 0.45, EASE.enter) });
    const M = f.mk;
    const flat = 1;                                                 // labels keep their offsets as the plane stands up (legibility)
    const gone = (t0) => 1 - span(t, t0, 0.3);                     // a marker element leaves as its text departs
    const mLeave = marker(cL, { x: Xf(16.8), z: L.leo, tone: 'green', glyph: 'solid-car-side', title: 'Leave by 4:48 PM', titleInk: C.green, size: M.size, min: M.min, ...M.leave, a: { ...A(T.leave), titleK: gone(T.regLeave), wellK: gone(T.regLeave + 0.1) }, riseK: flat,
      lines: [{ text: 'Dad drop-off', k: span(t, T.dad, 0.45, EASE.enter) * gone(T.regDad) }] });
    const leoLines = [{ text: '5:30 · Field 7', k: 0 }, { text: 'Cleats · Shin guards', k: span(t, T.prep, 0.45, EASE.enter) * (t < T.regPrep ? 1 : 0), fill: C.blue }];
    const mLeo = marker(cL, { x: Xf(17.5), z: L.leo, tone: 'leo', glyph: 'solid-futbol', title: 'Leo · Soccer Practice', size: M.size, min: M.min, ...M.leo, a: { ...A(T.leo), label: span(t, T.field7 + 0.5, 0.45, EASE.enter), titleK: gone(T.regLeo), wellK: gone(T.regLeo + 0.2) }, riseK: flat, lines: leoLines });
    const mMaya = marker(cL, { x: Xf(17.25), z: L.maya, tone: 'maya', glyph: 'solid-compact-disc', title: 'Maya · Dance', size: M.size, min: M.min, ...M.maya, rise: M.maya.rise + (f.foldRise?.maya || 0) * kF, a: { ...A(T.maya), titleK: gone(T.regMaya), wellK: gone(T.regMaya + 0.1) }, riseK: flat, lines: [{ text: '5:15', k: gone(T.regMaya + 0.08) }] });
    const mPick = marker(cL, { x: Xf(18.5), z: L.leo, tone: 'orange', glyph: 'solid-person-walking', title: 'Pickup · 6:30 · ?', titleInk: C.orange, size: M.size, min: M.min, ...M.pick, a: { ...A(T.pickup), keepTick: true, titleK: f.foldRise ? 1 - span(t, 13.1, 0.3) + span(t, 14.15, 0.35) : 1, wellK: f.foldRise ? 1 - span(t, 13.1, 0.3) + span(t, 14.15, 0.35) : 1 }, riseK: f.foldRise ? lerp(1, f.foldRise.pickK, span(t, 13.4, 0.75, EASE.std)) : 1, lines: [] });
    const pickO = 1 - span(t, T.threadRe, 0.35, EASE.std);
    s += mLeave.svg + mMaya.svg + mLeo.svg + (pickO < 1 ? `<g opacity="${r(pickO * 1000) / 1000}">${mPick.svg}</g>` : mPick.svg);

    // Leo's sub-line "5:30 · " + "Field 7" (Field 7 arrives from the message)
    const leoLabelK = span(t, T.field7 + 0.5, 0.45, EASE.enter);
    let field7Dest = null;
    if (mLeo.slots[0]) {
      const sl = mLeo.slots[0], full = tw('5:30 · Field 7', sl.size, 500);
      const x0 = sl.anchor === 'end' ? sl.x - full : sl.x;
      const dy = (1 - leoLabelK) * 20 * mLeo.k;
      s += text(x0, sl.y + dy, '5:30 · ', sl.size, { weight: 500, fill: C.ink2, opacity: leoLabelK * gone(T.regLeo + 0.1) });
      field7Dest = { x: x0 + tw('5:30 · ', sl.size, 500), y: sl.y, size: sl.size };
    }

    // ── messages (a family text — not ACTIQO UI) ──
    const a0 = sim.at(t);
    const farMix = t < T.cleatsDown ? span(t, T.cleatsFly, T.cleatsLand - T.cleatsFly, EASE.std) : 1 - span(t, T.cleatsDown, 0.6, EASE.std);
    const holdingCleats = t >= T.cleatsLand && t < T.cleatsDown;
    const pocketK = span(t, T.pocket, 0.45, EASE.std);
    const fig = drawFigure(a0, CAST.mom, hW, { load: load(t), arms: { near: pocketK >= 0.95 ? 'pocket' : 'phone', far: holdingCleats ? 'cleats' : 'swing' }, nearMix: pocketK < 0.95 ? pocketK : 0, farMix, bag: t < T.bagLift ? 'mom' : null, tilt: tilt(t), lag });
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
    if (t >= T.field7 && t < T.regLeo + 0.2 && field7Src && field7Dest) {
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
    let threadPath = null;
    if (f.thread === 'rise') threadPath = threadPts(phone, pickG, f.sag);
    else if (kF <= 0) threadPath = hangingThread(phone, pickG);
    else {
      // the part lying on the plan floor folds with it: find those points on the flat floor, re-project them on the folded plane
      const g0 = cL0.p(Xf(18.5), L.leo), dx0 = g0.x - phone.x;
      const onPlane = (sx, sy) => { const z = (cL0.camH * cL0.F) / (sy - cL0.horizon); return cL.p(cL0.x0 + ((sx - cL0.sx) * z) / cL0.F, z); };
      const T1 = onPlane(phone.x + 0.2 * dx0, g0.y + 22), T2 = onPlane(phone.x + 0.55 * dx0, g0.y + 16);
      const mid = { x: phone.x + 0.06 * (pickG.x - phone.x), y: lerp(phone.y, T1.y - 22, 0.62) };
      threadPath = catmull([phone, mid, T1, T2, pickG]);
    }
    let threadSvg = spoolK > 0 ? thread(threadPath, spoolK, { width: f.threadW }) : '';

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

    // ══ CP3 ══
    let cp3Under = '', cp3Over = '', cleatsBehind = '', cleatsFront = '', dadSvg = '', bagSvg = '';
    if (t >= T.gp - 0.05) {
      // ── the Game Plan resolves on the folded surface; marker text registers into its real destinations ──
      const fl = (t0, d = 0.6) => span(t, t0, d, EASE.std);
      const show = (t0) => span(t, t0, 0.16);
      const k = {
        frame: span(t, T.gp, 0.5, EASE.enter),
        name: show(T.regLeo + 0.5), date: show(T.regLeo + 0.6), loc: show(T.regLeo + 0.7),
        band: span(t, T.regLeave - 0.15, 0.35), leave: show(T.regLeave + 0.5), drive: span(t, T.regLeave + 0.55, 0.35),
        section: span(t, T.regDad - 0.15, 0.35), whoRow: span(t, T.regDad - 0.1, 0.35), whoDesc: show(T.regDad + 0.5),
        bringRow: span(t, T.regPrep - 0.15, 0.35), bringDesc: t >= T.regPrep + T.prepFly ? 1 : 0, bringChev: span(t, T.regPrep + T.prepFly, 0.25),
        bringVal: span(t, T.regPrep + T.prepFly + 0.05, 0.35), prep: span(t, T.regPrep + T.prepFly + 0.05, 0.35),
        // one restrained acknowledgement as the cleats go into the bag (no path drawn from the cleats to the UI)
        bringTint: 0.6 * (span(t, T.cleatsDown + 0.45, 0.2) - span(t, T.cleatsDown + 0.9, 0.45)),
        whoTint: 0.9 * span(t, T.ack + 0.1, 0.18),
      };
      const clipY = f.clip === 'card' ? GPL.bottom : f.clip;
      const press = (t0) => span(t, t0, 0.08) - span(t, t0 + 0.16, 0.14);
      const asOutK = span(t, T.asOut, 0.25, EASE.std), asInK = span(t, T.asIn, 0.45, EASE.enter);
      if (asOutK < 1) {
        const pw = press(T.tapWho);
        cp3Under += `<g opacity="${r((1 - asOutK) * 1000) / 1000}" transform="translate(0,${r(-14 * f.gp.U * asOutK)})">` + gamePlan(GPL, k, { clipY, id: 'gp' + fmtName })
          + (pw > 0 ? `<rect x="${r(GPL.x + 1)}" y="${r(GPL.who.y + 1)}" width="${r(GPL.w - 2)}" height="${r(GPL.who.h - 2)}" fill="rgba(11,31,59,0.06)" opacity="${r(pw * 1000) / 1000}"/>` : '') + '</g>';
      }
      // CP4 · Game Plan › Assignments (real SyncView): Dad drop-off · No one on pickup / Assign → Grandma pickup · At 6:30 PM
      if (asInK > 0) {
        const resK = span(t, T.resolve, 0.15), doneK = span(t, T.resolve + 0.1, 0.3, EASE.enter);
        const ka = { frame: asInK, dadRow: span(t, T.asIn + 0.06, 0.45, EASE.enter), pickOpen: span(t, T.asIn + 0.1, 0.45, EASE.enter) * (1 - resK), pickDone: doneK,
          cardH: lerp(ASL.pickOpen.h, ASL.pickDone.h, span(t, T.resolve + 0.05, 0.3, EASE.std)), pickPress: press(T.tapAssign) };
        cp3Under += `<g transform="translate(0,${r(14 * f.gp.U * (1 - asInK))})">` + assignments(ASL, ka, { tw }) + '</g>';
      }
      // Maya: her own event, set apart from Leo's Game Plan; it recedes once it has registered
      const MS = mayaSlots(f.maya.x, f.maya.y, f.maya.U);
      const mayaK = span(t, T.regMaya + 0.45, 0.4) * (1 - 0.42 * span(t, T.regMaya + 1.2, 0.6, EASE.breath));
      cp3Under += mayaCard(f.maya.x, f.maya.y, f.maya.U, mayaK, { nameK: show(T.regMaya + 0.65), timeK: show(T.regMaya + 0.72) });
      // registration flights: same words, real destinations
      const fly = (str, from, to, t0, d = 0.6) => {
        const u = fl(t0, d); if (u <= 0 || !from) return '';
        const o = u < 0.82 ? 1 : 1 - (u - 0.82) / 0.18; if (o <= 0) return '';
        const ctrl = { x: lerp(from.x, to.x, 0.5), y: Math.min(from.y, to.y) - 30 };
        const x = (1 - u) ** 2 * from.x + 2 * (1 - u) * u * ctrl.x + u * u * to.x, y = (1 - u) ** 2 * from.y + 2 * (1 - u) * u * ctrl.y + u * u * to.y;
        const fam = to.family && u > 0.5 ? to.family : 'Inter';
        return `<text x="${r(x)}" y="${r(y)}" font-family="${fam}" font-weight="${Math.round(lerp(from.weight, to.weight, u))}" font-size="${r(lerp(from.size, to.size, u))}" fill="${mixHex(from.fill, to.fill, u)}" letter-spacing="${fam === 'Inter' ? '-0.01em' : '-0.5px'}" opacity="${r(o * 1000) / 1000}">${str}</text>`;
      };
      const lineLeft = (sl, str) => sl && ({ x: sl.anchor === 'end' ? sl.x - tw(str, sl.size, 500) : sl.x, y: sl.y, size: sl.size });
      const leoSub = mLeo.slots[0] && lineLeft(mLeo.slots[0], '5:30 · Field 7');
      if (mLeo.title) cp3Over += fly('Leo · Soccer Practice', { ...mLeo.title, weight: 600, fill: C.ink }, { ...GPL.name, weight: 600, fill: C.ink }, T.regLeo);
      if (leoSub) {
        cp3Over += fly('5:30', { ...leoSub, weight: 500, fill: C.ink2 }, { x: GPL.date.x + tw('Thu ', GPL.date.size, 400), y: GPL.date.y, size: GPL.date.size, weight: 400, fill: C.ink2 }, T.regLeo + 0.1);
        cp3Over += fly('Field 7', { x: leoSub.x + tw('5:30 · ', leoSub.size, 500), y: leoSub.y, size: leoSub.size, weight: 500, fill: C.ink2 }, { ...GPL.loc, weight: 400, fill: C.ink2 }, T.regLeo + 0.2);
      }
      if (mLeave.title) cp3Over += fly('Leave by 4:48 PM', { ...mLeave.title, weight: 600, fill: C.green }, { ...GPL.leave, weight: 600, fill: C.green, family: 'Fraunces' }, T.regLeave);
      if (mLeave.slots[0]) cp3Over += fly('Dad drop-off', { ...lineLeft(mLeave.slots[0], 'Dad drop-off'), weight: 500, fill: C.ink2 }, { ...GPL.who.desc, weight: 400, fill: C.ink2 }, T.regDad);
      // What to bring: ONE copy at every frame. It leaves the marker line at the frame that line hides, travels a clean
      // route (beside the card, then along the row's own text baseline — never across another row), turns its " · " into the
      // product's ", " in flight, and is replaced by the real row copy at the exact landing frame.
      if (mLeo.slots[1]) {
        const u0 = (t - T.regPrep) / T.prepFly;
        if (u0 >= 0 && u0 < 1) {
          const u = EASE.std(u0);
          const from = lineLeft(mLeo.slots[1], 'Cleats · Shin guards'), to = GPL.bring.desc;
          const cardR = GPL.x + GPL.w;
          let px, py;
          if (from.x > cardR - 4) {                       // beside the card: drop to the row baseline outside it, then slide in
            const l1 = Math.abs(to.y - from.y), l2 = Math.abs(from.x - to.x), sp = l1 / Math.max(1, l1 + l2);
            if (u < sp) { px = from.x; py = lerp(from.y, to.y, u / sp); } else { px = lerp(from.x, to.x, (u - sp) / (1 - sp)); py = to.y; }
          } else { px = lerp(from.x, to.x, u); py = lerp(from.y, to.y, u); }
          const size = lerp(from.size, to.size, u), wt = u < 0.5 ? 500 : 400, fill = mixHex(C.blue, C.ink2, u);
          const m = span(u, 0.35, 0.4);                   // separator morph: " · " → ", "
          const w1 = tw('Cleats', size, wt), wSep = lerp(tw(' · ', size, wt), tw(', ', size, wt), m);
          const o = { weight: wt, fill, ls: lerp(-0.01, 0, u) };
          cp3Over += text(px, py, 'Cleats', size, o) + text(px + w1, py, ' · ', size, { ...o, opacity: 1 - m }) + text(px + w1, py, ', ', size, { ...o, opacity: m })
            + text(px + w1 + wSep, py, 'Shin guards', size, o);
        }
      }
      if (mMaya.title) cp3Over += fly('Maya · Dance', { ...mMaya.title, weight: 600, fill: C.ink }, { ...MS.name, weight: 600, fill: C.ink }, T.regMaya, 0.75);
      if (mMaya.slots[0]) cp3Over += fly('5:15', { ...lineLeft(mMaya.slots[0], '5:15'), weight: 500, fill: C.ink2 }, { x: MS.time.x + tw('Thu ', MS.time.size, 400), y: MS.time.y, size: MS.time.size, weight: 400, fill: C.ink2 }, T.regMaya + 0.08, 0.75);
    }
    // ── 17.5 · Mom lowers the cleats into the soccer bag; What to bring acknowledges locally (row tint above) ──
    const grip = toScr(fig.anchors.gripF), bagC = toScr(fig.anchors.bag);
    if (t >= T.cleatsDown && t < T.cleatsDown + 0.75) {
      const u = span(t, T.cleatsDown + 0.3, 0.42, EASE.std);
      const p0 = grip, p1 = { x: bagC.x + 6 * kM, y: bagC.y - 18 * kM };
      const pos = { x: lerp(p0.x, p1.x, u), y: lerp(p0.y, p1.y, u) - Math.sin(u * Math.PI) * 14 * kM };
      const svgC = `<g transform="translate(${r(pos.x)},${r(pos.y)}) scale(${r(kM * lerp(1, 0.9, u) * 1000) / 1000})">${cleatsArt({ x: 0, y: 0 }, hW)}</g>`;
      if (farMix >= 0.5) cleatsFront = svgC; else cleatsBehind = svgC;
    }
    // ── 18.4 · Dad takes the soccer bag ──
    if (t >= T.dadIn) {
      const zD = L.mom + f.dadDz, kD = c.F / zD, gyD = c.horizon + (c.camH * c.F) / zD;
      const shiftW = x0P + (f.dadStopX - c.sx) / kD - dadEndX;
      const sh = (q) => ({ ...q, x: q.x + shiftW, feet: q.feet.map((ff) => ({ ...ff, ankle: { x: ff.ankle.x + shiftW, y: ff.ankle.y } })) });
      const ds = sh(dadSim.at(t)), dl = sh(dadSim.at(t - 0.07));
      const toW = (p) => ({ x: x0P + (p.x - c.sx) / kD, y: (p.y - gyD) / kD });
      const toS = (p) => ({ x: c.sx + (p.x - x0P) * kD, y: gyD + p.y * kD });
      const base = drawFigure(ds, CAST.dad, hW, { load: 0, arms: {}, lag: dl });
      const reachK = span(t, T.reach, 0.45, EASE.std);
      const bagTop = { x: bagC.x + 0.05 * hW * kM, y: bagC.y - 0.5 * hW * kM };
      const carryW = { x: base.anchors.hip.x + 0.55 * hW, y: base.anchors.hip.y + 0.45 * hW };
      const liftK = span(t, T.bagLift, 0.42, EASE.std);
      const targetS = liftK > 0 ? { x: lerp(bagTop.x, toS(carryW).x, liftK), y: lerp(bagTop.y, toS(carryW).y, liftK) - Math.sin(liftK * Math.PI) * 18 * kD } : bagTop;
      const nat = base.anchors.handN, tgtW = toW(targetS);
      const handW = { x: lerp(nat.x, tgtW.x, reachK), y: lerp(nat.y, tgtW.y, reachK) };
      const dad = reachK > 0 ? drawFigure(ds, CAST.dad, hW, { load: 0, arms: { near: 'reach' }, handTarget: handW, handDir: lerp(20, 78, reachK), reachHand: reachK > 0.85 ? 'grip' : 'open', lag: dl }) : base;
      dadSvg = `<g transform="translate(${r(c.sx - x0P * kD)},${r(gyD)}) scale(${r(kD * 10000) / 10000})">${dad.svg}</g>`;
      if (t >= T.bagLift) {
        // the same bag, now hanging from Dad's hand (scale moves from Mom's depth to Dad's)
        const hand = toS(handW);
        const bc = { x: lerp(bagC.x, hand.x - 0.05 * hW * kD, liftK), y: lerp(bagC.y, hand.y + 0.62 * hW * kD, liftK) };
        const kb = lerp(kM, kD, liftK);
        bagSvg = `<path d="M${r(bc.x - 0.25 * hW * kb)},${r(bc.y - 0.45 * hW * kb)} Q${r(hand.x)},${r(hand.y - 0.1 * hW * kb)} ${r(bc.x + 0.3 * hW * kb)},${r(bc.y - 0.5 * hW * kb)}" fill="none" stroke="#2A3548" stroke-width="${r(0.11 * hW * kb)}" stroke-linecap="round"/>`
          + `<g transform="translate(${r(bc.x)},${r(bc.y)}) scale(${r(kb * 1000) / 1000})">${bagArt({ x: 0, y: 0 }, hW)}</g>`;
        // ACTIQO acknowledges: Dad drop-off is now shared (a neutral link to Who's doing what)
        const ak = span(t, T.ack, 0.35, EASE.std);
        if (ak > 0) { const sh0 = toS(dad.anchors.headC), momHead = toScr(fig.anchors.headC);
          const asK = span(t, T.asOut, 0.55, EASE.std);
          const a1 = { x: sh0.x + 0.2 * hW * kD, y: sh0.y - 0.75 * hW * kD }, b1 = { x: GPL.x - 4, y: lerp(GPL.who.well.cy, ASL.dad.well.cy, asK) };
          const over = { x: momHead.x + 0.2 * hW * kM, y: momHead.y - 1.5 * hW * kM };     // the link arcs over Mom's head, never across her
          const via = over.y < Math.min(a1.y, b1.y) ? [a1, over, { x: lerp(over.x, b1.x, 0.55), y: lerp(over.y, b1.y, 0.6) - 10 }, b1] : [a1, { x: lerp(a1.x, b1.x, 0.5), y: Math.min(a1.y, b1.y) - 40 }, b1];
          cp3Over += thread(catmull(via, 64), ak, { color: '#0B1F3B', width: 3, dash: '1 0', opacity: 0.3, knot: false })
            + (ak >= 1 ? `<circle cx="${r(b1.x)}" cy="${r(b1.y)}" r="5" fill="#0B1F3B" fill-opacity=".3"/>` : ''); }
      }
    }

    // ══ CP4 ══ Grandma walks in, catches the pickup thread, the Assignments row resolves
    let gSvg = '', gHand = null, catchK = 0;
    if (t >= T.gEnter - 0.2) {
      const zG = L.mom - f.gDz, kG = c.F / zG, gyG = c.horizon + (c.camH * c.F) / zG;
      const shiftW = x0P + (f.gStopX - c.sx) / kG - gEndX;
      const sh = (q) => ({ ...q, x: q.x + shiftW, feet: q.feet.map((ff) => ({ ...ff, ankle: { x: ff.ankle.x + shiftW, y: ff.ankle.y } })) });
      const gs = sh(gSim.at(t)), gl = sh(gSim.at(t - 0.07));
      const toSG = (p) => ({ x: c.sx + (p.x - x0P) * kG, y: gyG + p.y * kG });
      const base = drawFigure(gs, CAST.grandma, hW, { load: 0, arms: {}, lag: gl });
      // her near hand rises to chest height in front of her: the open hand that takes the thread
      catchK = span(t, T.catch, 0.6, EASE.std);
      const nat = base.anchors.handN, chest = { x: base.anchors.hip.x + 0.95 * hW, y: base.anchors.hip.y - 1.35 * hW };
      const handW = { x: lerp(nat.x, chest.x, catchK), y: lerp(nat.y, chest.y, catchK) };
      const gFig = catchK > 0 ? drawFigure(gs, CAST.grandma, hW, { load: 0, arms: { near: 'reach' }, handTarget: handW, handDir: lerp(20, 70, catchK), reachHand: catchK > 0.85 ? 'grip' : 'open', lag: gl }) : base;
      gSvg = `<g transform="translate(${r(c.sx - x0P * kG)},${r(gyG)}) scale(${r(kG * 10000) / 10000})">${gFig.svg}</g>`;
      gHand = toSG(handW);
    }
    if (t >= T.threadRe && spoolK > 0) {
      // the thread's far end leaves 6:30 on the wall and attaches to the real row that states it
      const reK = span(t, T.threadRe, 0.5, EASE.std), resK = span(t, T.resolve + 0.05, 0.3, EASE.std);
      // 16:9: the row's left edge (toward Mom). 9:16: beneath "Assign" at the row's lower edge, so the thread rises away from Mom's face.
      const rowA = f.pickAnchor === 'below'
        ? { x: ASL.x + ASL.w * 0.8, y: lerp(ASL.pickOpen.y + ASL.pickOpen.h, ASL.pickDone.y + ASL.pickDone.h, resK) + 4 }
        : { x: ASL.x - 4, y: lerp(ASL.pickOpen.well.cy, ASL.pickDone.well.cy, resK) };
      const origin = gHand ? { x: lerp(phone.x, gHand.x, catchK), y: lerp(phone.y, gHand.y, catchK) } : phone;
      const N = 64, oldP = resample(threadPath, N), newP = resample(threadPts(origin, rowA, f.sag * 0.35, N), N);
      const pts = reK < 1 ? oldP.map((q, i) => ({ x: lerp(q.x, newP[i].x, reK), y: lerp(q.y, newP[i].y, reK) })) : newP;
      // resolved: orange dashed (unresolved responsibility) becomes the neutral solid link used for Dad's drop-off
      const nK = span(t, T.resolve, 0.2, EASE.std);
      threadSvg = (nK < 1 ? thread(pts, spoolK, { width: f.threadW, opacity: 1 - nK }) : '')
        + (nK > 0 ? thread(pts, 1, { color: '#0B1F3B', width: 3, dash: '1 0', opacity: 0.3 * nK, knot: false }) + `<circle cx="${r(rowA.x)}" cy="${r(rowA.y)}" r="5" fill="#0B1F3B" fill-opacity="${r(0.3 * nK * 1000) / 1000}"/>` : '');
    }

    // Mom (world → screen: exact projection at her lane depth, so her feet stay planted on the path)
    s += cp3Under + dadSvg + bagSvg + cleatsBehind;
    s += `<g transform="translate(${r(c.sx - x0P * kM)},${r(gy)}) scale(${r(kM * 10000) / 10000})">${fig.svg}</g>`;
    s += cleatsFront + gSvg + threadSvg + flySvg + cp3Over;
    return s;
  };
}
