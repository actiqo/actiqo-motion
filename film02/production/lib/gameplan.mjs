// Film 02 · ACTIQO 3.0 Game Plan (root overview), drawn as SVG from production structure + tokens.
// Source of truth (read-only): src/components/game-plan/structure/views.tsx (GamePlanView, IdentityCard, LeaveByLine, Row)
// and src/styles/{tokens,base-tokens}.ts at the shipped 3.0 commit ea2d7216.
// Rows shown: Who's doing what · What to bring. The card continues below (Snack Rotation …) — cropped, not redesigned.
import { C, r, text, tw, icon } from './world.mjs';

export const T3 = {
  canvas: '#FCFAF7', card: '#FFFFFF', cardSoft: '#FBF9F5', hair: 'rgba(11,31,59,0.08)',
  ink: '#0B1F3B', ink2: '#3F4C63', ink3: '#7A869A', green: '#0F7A4B', greenS: '#DCEFE3', blue: '#1D4ED8', blueS: '#E6EEFE',
};
const op = (k) => r(Math.max(0, Math.min(1, k)) * 1000) / 1000;
const rrect = (x, y, w, h, rad, fill, extra = '', corners = [1, 1, 1, 1]) => {
  const [tl, tr, br, bl] = corners.map((c) => c * rad);
  return `<path d="M${r(x + tl)},${r(y)} H${r(x + w - tr)} ${tr ? `Q${r(x + w)},${r(y)} ${r(x + w)},${r(y + tr)}` : ''} V${r(y + h - br)} ${br ? `Q${r(x + w)},${r(y + h)} ${r(x + w - br)},${r(y + h)}` : ''} H${r(x + bl)} ${bl ? `Q${r(x)},${r(y + h)} ${r(x)},${r(y + h - bl)}` : ''} V${r(y + tl)} ${tl ? `Q${r(x)},${r(y)} ${r(x + tl)},${r(y)}` : ''}Z" fill="${fill}" ${extra}/>`;
};

/** Layout in screen px for a card column at (x, y) with width 358·U (the product's phone column). Returns slot positions. */
export function gpLayout(x, y, U) {
  const u = (v) => v * U, w = u(358);
  const L = { x, y, U, w };
  L.title = { x: x + w / 2, y: y + u(26), size: u(28) };                           // pageTitle · Fraunces 28/34 centered
  const sc = { x, y: y + u(44), w, h: u(68) + u(52) };                              // session card: identity row + leave band
  L.session = sc;
  L.well = { cx: x + u(16 + 22), cy: sc.y + u(34), r: u(22) };
  const tx = x + u(16 + 44 + 12);
  L.name = { x: tx, y: sc.y + u(24), size: u(15) };                                 // strong 15/20
  L.date = { x: tx + u(20), y: sc.y + u(43), size: u(14), ix: tx + u(7), iy: sc.y + u(38) };
  L.loc = { x: tx + u(20), y: sc.y + u(61), size: u(14), ix: tx + u(7), iy: sc.y + u(56) };
  L.band = { x, y: sc.y + u(68), w, h: u(52) };
  L.bandWell = { cx: x + u(16 + 16), cy: L.band.y + u(26), r: u(16) };
  L.leave = { x: x + u(16 + 32 + 10), y: L.band.y + u(25), size: u(18) };           // detailTitle role at 18/24, green
  L.drive = { x: L.leave.x, y: L.band.y + u(41), size: u(12) };                      // metadata 12/16
  L.bandChev = { x: x + w - u(22), y: L.band.y + u(26) };
  const sy = sc.y + sc.h + u(16);
  L.section = { x, y: sy + u(16), size: u(15), meta: { x: x + w, y: sy + u(15), size: u(12) } };   // sectionLabel 15 · "Prep 0 of 2"
  const py = sy + u(26);
  L.plan = { x, y: py, w, rowH: u(64) };
  const row = (i) => { const ry = py + i * u(64); return { y: ry, h: u(64), well: { cx: x + u(16 + 20), cy: ry + u(32), r: u(20) }, label: { x: x + u(16 + 40 + 12), y: ry + u(28), size: u(15) }, desc: { x: x + u(16 + 40 + 12), y: ry + u(47), size: u(13) }, val: { x: x + w - u(40), y: ry + u(37), size: u(14) }, chev: { x: x + w - u(22), y: ry + u(32) } }; };
  L.who = row(0); L.bring = row(1);
  L.bottom = py + 2 * u(64);
  return L;
}

/**
 * Draw the Game Plan. k = per-element visibility (0..1):
 *  frame (title + card surfaces), name, date, loc, band (green band surface), leave, drive, section, prep, whoRow, whoDesc, bringRow, bringDesc, bringVal,
 *  whoTint / bringTint (acknowledgement tints 0..1). clipY crops the card column (the list continues below).
 */
export function gamePlan(L, k, { clipY = Infinity, id = 'gp' } = {}) {
  const u = (v) => v * L.U;
  let s = '';
  const clip = isFinite(clipY) ? `<clipPath id="${id}c"><rect x="${r(L.x - 40)}" y="${r(L.y - 200)}" width="${r(L.w + 80)}" height="${r(clipY - L.y + 200)}"/></clipPath>` : '';
  s += clip + `<g ${clip ? `clip-path="url(#${id}c)"` : ''}>`;
  const shadow = (x, y, w, h, corners) => rrect(x, y + u(2), w, h, u(16), 'rgba(11,31,59,0.035)', '', corners) + rrect(x, y + u(0.5), w, h, u(16), 'rgba(11,31,59,0.03)', '', corners);
  // title
  s += `<text x="${r(L.title.x)}" y="${r(L.title.y)}" font-family="Fraunces" font-weight="600" font-size="${r(L.title.size)}" fill="${T3.ink}" text-anchor="middle" letter-spacing="${r(-0.5 * L.U * 10) / 10}" opacity="${op(k.frame)}">Game Plan</text>`;
  // session card
  const sc = L.session;
  s += `<g opacity="${op(k.frame)}">` + shadow(sc.x, sc.y, sc.w, sc.h) + rrect(sc.x, sc.y, sc.w, sc.h, u(16), T3.card, `stroke="${T3.hair}" stroke-width="${r(Math.max(1, L.U * 0.75))}"`)
    + `<circle cx="${r(L.well.cx)}" cy="${r(L.well.cy)}" r="${r(L.well.r)}" fill="${T3.cardSoft}"/>` + icon('solid-futbol', L.well.cx, L.well.cy, u(20), T3.ink) + '</g>';
  s += text(L.name.x, L.name.y, 'Leo — Soccer Practice', L.name.size, { fill: T3.ink, opacity: k.name ?? 0, ls: 0 });
  if ((k.date ?? 0) > 0) s += `<g opacity="${op(k.date)}">${icon('regular-calendar', L.date.ix, L.date.iy, u(12), T3.ink3)}</g>` + text(L.date.x, L.date.y, 'Thu 5:30 PM', L.date.size, { weight: 400, fill: T3.ink2, opacity: k.date, ls: 0 });
  if ((k.loc ?? 0) > 0) s += `<g opacity="${op(k.loc)}">${icon('solid-location-dot', L.loc.ix, L.loc.iy, u(12), T3.ink3)}</g>` + text(L.loc.x, L.loc.y, 'Field 7', L.loc.size, { weight: 400, fill: T3.ink2, opacity: k.loc, ls: 0 });
  // leave band (bottom of the session card)
  const b = L.band;
  if ((k.band ?? 0) > 0) s += `<g opacity="${op(k.band)}">` + rrect(b.x + 0.5, b.y, b.w - 1, b.h - 0.5, u(16), T3.greenS, '', [0, 0, 1, 1]) + `<line x1="${r(b.x)}" x2="${r(b.x + b.w)}" y1="${r(b.y)}" y2="${r(b.y)}" stroke="${T3.hair}" stroke-width="${r(Math.max(1, L.U * 0.75))}"/>`
    + `<circle cx="${r(L.bandWell.cx)}" cy="${r(L.bandWell.cy)}" r="${r(L.bandWell.r)}" fill="#FFFFFF" fill-opacity=".55"/>` + icon('solid-car-side', L.bandWell.cx, L.bandWell.cy, u(13), T3.green)
    + icon('solid-chevron-right', L.bandChev.x, L.bandChev.y, u(12), T3.ink3) + '</g>';
  s += `<text x="${r(L.leave.x)}" y="${r(L.leave.y)}" font-family="Fraunces" font-weight="600" font-size="${r(L.leave.size)}" fill="${T3.green}" letter-spacing="${r(-0.5 * L.U * 10) / 10}" opacity="${op(k.leave ?? 0)}">Leave by 4:48 PM</text>`;
  s += text(L.drive.x, L.drive.y, '32 min drive', L.drive.size, { weight: 400, fill: T3.ink3, opacity: k.drive ?? 0, ls: 0 });
  // Today's plan
  s += text(L.section.x, L.section.y, 'Today’s plan', L.section.size, { fill: T3.ink, opacity: k.section ?? 0, ls: 0 });
  s += text(L.section.meta.x, L.section.meta.y, 'Prep 0 of 2', L.section.meta.size, { weight: 400, fill: T3.ink3, anchor: 'end', opacity: k.prep ?? 0, ls: 0 });
  const p = L.plan, ph = Math.max(0, Math.min(L.bottom + u(30), clipY) - p.y);
  // the list continues below (Snack Rotation …): cropped with an open bottom edge, never redrawn as a closed card
  if ((k.frame ?? 0) > 0) s += `<g opacity="${op(k.frame)}">` + shadow(p.x, p.y, p.w, ph + u(16)) + rrect(p.x, p.y, p.w, ph + u(16), u(16), T3.card) + `<path d="M${r(p.x)},${r(p.y + ph + u(16))} V${r(p.y + u(16))} Q${r(p.x)},${r(p.y)} ${r(p.x + u(16))},${r(p.y)} H${r(p.x + p.w - u(16))} Q${r(p.x + p.w)},${r(p.y)} ${r(p.x + p.w)},${r(p.y + u(16))} V${r(p.y + ph + u(16))}" fill="none" stroke="${T3.hair}" stroke-width="${r(Math.max(1, L.U * 0.75))}"/>` + '</g>';
  const rowSvg = (R, tint, well, ico, label, rk, tintK, tintCol) => {
    let o = '';
    if (tintK > 0) o += `<rect x="${r(p.x + 1)}" y="${r(R.y + 1)}" width="${r(p.w - 2)}" height="${r(R.h - 2)}" fill="${tintCol}" opacity="${op(tintK)}"/>`;
    if (rk <= 0) return o;
    o += `<g opacity="${op(rk)}"><circle cx="${r(R.well.cx)}" cy="${r(R.well.cy)}" r="${r(R.well.r)}" fill="${well}"/>` + icon(ico, R.well.cx, R.well.cy, u(15), tint)
      + text(R.label.x, R.label.y, label, R.label.size, { weight: 500, fill: T3.ink, ls: 0 }) + icon('solid-chevron-right', R.chev.x, R.chev.y, u(12), T3.ink3) + '</g>';
    return o;
  };
  s += rowSvg(L.who, T3.green, T3.greenS, 'solid-people-group', 'Who’s doing what', k.whoRow ?? 0, k.whoTint ?? 0, T3.greenS);
  s += text(L.who.desc.x, L.who.desc.y, 'Dad drop-off', L.who.desc.size, { weight: 400, fill: T3.ink2, opacity: k.whoDesc ?? 0, ls: 0 });
  if ((k.frame ?? 0) > 0) s += `<line x1="${r(p.x + u(16))}" x2="${r(p.x + p.w)}" y1="${r(L.bring.y)}" y2="${r(L.bring.y)}" stroke="${T3.hair}" stroke-width="${r(Math.max(1, L.U * 0.75))}" opacity="${op(k.frame)}"/>`;
  s += rowSvg(L.bring, T3.blue, T3.blueS, 'solid-bag-shopping', 'What to bring', k.bringRow ?? 0, k.bringTint ?? 0, T3.blueS);
  s += text(L.bring.desc.x, L.bring.desc.y, 'Cleats, Shin guards', L.bring.desc.size, { weight: 400, fill: T3.ink2, opacity: k.bringDesc ?? 0, ls: 0 });
  s += text(L.bring.val.x, L.bring.val.y, '0/2', L.bring.val.size, { weight: 400, fill: T3.ink3, anchor: 'end', opacity: k.bringVal ?? 0, ls: 0 });
  return s + '</g>';
}

/** Maya's own event (not part of Leo's Game Plan): a small card in the same visual language, set apart */
export function mayaCard(x, y, U, k = 1, { nameK = 1, timeK = 1 } = {}) {
  const u = (v) => v * U, w = u(178), h = u(56);
  return `<g opacity="${op(k)}">` + rrect(x, y + u(1.5), w, h, u(16), 'rgba(11,31,59,0.035)') + rrect(x, y, w, h, u(16), T3.card, `stroke="${T3.hair}" stroke-width="${r(Math.max(1, U * 0.75))}"`)
    + `<circle cx="${r(x + u(12 + 16))}" cy="${r(y + h / 2)}" r="${r(u(16))}" fill="${C.mayaS}"/>` + icon('solid-compact-disc', x + u(28), y + h / 2, u(13), C.maya) + '</g>'
    + text(x + u(54), y + u(25), 'Maya — Dance', u(15), { fill: T3.ink, opacity: k * nameK, ls: 0 })
    + text(x + u(54), y + u(43), 'Thu 5:15 PM', u(13), { weight: 400, fill: T3.ink2, opacity: k * timeK, ls: 0 });
}
export const mayaSlots = (x, y, U) => ({ name: { x: x + 54 * U, y: y + 25 * U, size: 15 * U }, time: { x: x + 54 * U, y: y + 43 * U, size: 13 * U }, w: 178 * U, h: 56 * U });
