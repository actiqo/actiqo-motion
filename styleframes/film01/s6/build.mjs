// S6 styleframes (static, 1080×1920): 9.0 s mid-transition and 10.8 s end state.
// Usage: node build.mjs && ./render.sh
//
// The REAL surface is the Game Plan root screen (GamePlanView) from
// /workspaces/actiqo @ release/3.0-integrated-candidate:
//   src/components/game-plan/structure/views.tsx  (GamePlanView, IdentityCard, LeaveByLine, GpSection)
//   src/components/activity-home/ui.tsx           (HomeCard, Row, .ah-rowdesc, SectionTitle)
//   src/components/ui/Icon.tsx                    (IconCircle wells 40/44/56, glyph sm 12 / lg 20)
//   src/components/foundation/PageHeader.tsx      (centered pageTitle)
// Every size below is the production point value × U (phone pt → film px). Nothing is added to the screen;
// Snack Rotation, Caregivers and the Ready Check button are omitted for legibility (crop, not redesign).
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const brand = join(here, '../../../brand');
const U = 2.3; // phone pt → px
const u = (pt) => Math.round(pt * U * 10) / 10;

const icon = (name, size, extra = '') => {
  const s = readFileSync(join(brand, 'icons/fontawesome-7', `${name}.svg`), 'utf8');
  const vb = s.match(/viewBox="([^"]+)"/)[1], d = s.match(/ d="([^"]+)"/)[1];
  return `<svg width="${size}" height="${size}" viewBox="${vb}" style="display:block;${extra}"><path fill="currentColor" d="${d}"/></svg>`;
};

// ── Real Game Plan geometry (end state) ────────────────────────────────────
const X = 84, W = u(358);                  // 16pt page padding → content column 358pt
const HEADER_Y = 300;                      // "Game Plan" (pageTitle, centered)
const CARD_Y = 410;                        // IdentityCard
const ID_H = u(12) + Math.max(u(44), u(20) + u(19) * 2) + u(12);
const BAND_H = u(12) + u(24) + u(16) + u(12);
const CARD_H = ID_H + BAND_H;
const SEC_Y = CARD_Y + CARD_H + u(16);     // GpSection padding-top 16
const PLAN_Y = SEC_Y + u(20) + u(6);       // SectionLabel 20 + margin 6
const ROW_H = u(12) + u(20) + 2 + u(18) + u(12);
const PICK_Y = PLAN_Y + ROW_H * 2 + 70;

const css = `
  html,body{margin:0;padding:0}
  body{width:1080px;height:1920px;overflow:hidden;background:var(--acti-app-canvas);position:relative;
       font-family:var(--acti-font-ui);color:var(--acti-ink);-webkit-font-smoothing:antialiased}
  .abs{position:absolute}
  /* real UI (GamePlanView) at U=${U} */
  .gp-title{font-family:var(--acti-font-editorial);font-weight:600;font-size:${u(28)}px;line-height:${u(34)}px;letter-spacing:${u(-0.5)}px;text-align:center}
  .card{background:#fff;border:2px solid var(--acti-hairline);border-radius:${u(16)}px;box-shadow:0 ${u(1)}px ${u(2)}px rgba(11,31,59,.04),0 ${u(4)}px ${u(12)}px rgba(11,31,59,.04);overflow:hidden}
  .idrow{display:flex;gap:${u(12)}px;align-items:center;padding:${u(12)}px ${u(16)}px}
  .well{flex:none;border-radius:50%;display:flex;align-items:center;justify-content:center}
  .strong{font-size:${u(15)}px;line-height:${u(20)}px;font-weight:600;color:var(--acti-ink)}
  .supporting{font-size:${u(14)}px;line-height:${u(19)}px;font-weight:400;color:var(--acti-ink-2);display:flex;gap:${u(6)}px;align-items:center}
  .band{border-top:2px solid var(--acti-hairline);padding:${u(12)}px ${u(16)}px;display:flex;gap:${u(10)}px;align-items:center;background:var(--acti-green-surface)}
  .leave{font-family:var(--acti-font-editorial);font-weight:600;font-size:${u(18)}px;line-height:${u(24)}px;letter-spacing:${u(-0.5)}px;color:var(--acti-green-ink)}
  .meta{font-size:${u(12)}px;line-height:${u(16)}px;color:var(--acti-ink-3)}
  .seclabel{display:flex;justify-content:space-between;align-items:center;font-size:${u(15)}px;line-height:${u(20)}px;font-weight:600}
  .row{display:flex;align-items:center;gap:${u(12)}px;min-height:${u(52)}px;padding:${u(12)}px ${u(16)}px;box-sizing:border-box}
  .row + .row{border-top:2px solid var(--acti-hairline)}
  .rlabel{font-size:${u(15)}px;line-height:${u(20)}px;font-weight:500}
  .rdesc{font-size:${u(13)}px;line-height:${u(18)}px;color:var(--acti-ink-2);margin-top:2px}
  .rval{font-size:${u(14)}px;line-height:${u(19)}px;color:var(--acti-ink-3)}
  .chev{color:var(--acti-ink-3)}
  /* film layer (abstract, from the locked S1–S5 system) */
  .chip{display:flex;align-items:center;gap:18px;padding:18px 34px 18px 18px;white-space:nowrap;border-radius:40px}
  .chip.orange{background:var(--acti-orange-surface)}
  .chip.green{background:var(--acti-green-surface)}
  .chip.white{background:#fff;border:2px solid var(--acti-hairline);box-shadow:var(--acti-shadow-surface);padding:16px 28px 16px 16px}
  .chip .t{font-size:38px;line-height:44px;font-weight:600;letter-spacing:-.3px}
  .chip .s{font-size:27px;line-height:33px;font-weight:600}
  .hline{height:2px;background:var(--acti-hairline)}
`;
const page = (title, body) => `<!doctype html><html><head><meta charset="utf-8"><title>${title}</title>
<link rel="stylesheet" href="../../../brand/actiqo-motion-tokens.css"><style>${css}</style></head><body>${body}</body></html>`;

// Real UI fragments ---------------------------------------------------------
const identityRow = (opacity = 1) => `
  <div class="idrow" style="opacity:${opacity}">
    <div class="well" style="width:${u(44)}px;height:${u(44)}px;background:var(--acti-surface-soft);color:var(--acti-ink)">${icon('solid-futbol', u(20))}</div>
    <div>
      <div class="strong">Leo — Soccer Practice</div>
      <div class="supporting">${icon('regular-calendar', u(12), 'color:var(--acti-ink-3)')}Thu 5:30 PM</div>
      <div class="supporting">${icon('solid-location-dot', u(12), 'color:var(--acti-ink-3)')}Field 7</div>
    </div>
  </div>`;
const leaveBand = `
  <div class="band">
    <div class="well" style="width:${u(40)}px;height:${u(40)}px;background:var(--acti-green-surface);color:var(--acti-green-ink);box-shadow:inset 0 0 0 2px rgba(15,122,75,.0)">${icon('solid-car-side', u(12))}</div>
    <div style="flex:1"><div class="leave">Leave by 4:48 PM</div><div class="meta">32 min drive</div></div>
    <span class="chev">${icon('solid-chevron-right', u(12))}</span>
  </div>`;
const row = (well, glyph, label, desc, value) => `
  <div class="row">
    <div class="well" style="width:${u(44)}px;height:${u(44)}px;background:var(--acti-${well}-surface);color:var(--acti-${well}-ink)">${icon(glyph, u(12))}</div>
    <div style="flex:1;min-width:0"><div class="rlabel">${label}</div><div class="rdesc">${desc}</div></div>
    ${value ? `<div class="rval">${value}</div>` : ''}
    <span class="chev">${icon('solid-chevron-right', u(12))}</span>
  </div>`;
const pickupChip = (x, y, s = 1, id = 'pick') => `
  <div class="abs chip orange" id="${id}" style="left:${x}px;top:${y}px;transform:scale(${s});transform-origin:0 0">
    <div class="well" style="width:80px;height:80px;background:#fff;color:var(--acti-orange-ink)">${icon('solid-person-walking', 34)}</div>
    <div><div class="t">Pickup · 6:30 PM</div><div class="s" style="color:var(--acti-orange-ink)">No one assigned yet</div></div>
  </div>`;

// ═══ 10.8 s END STATE ═══════════════════════════════════════════════════════
const end = page('S6 end · 10.8 s', `
  <div class="abs gp-title" style="left:${X}px;width:${W}px;top:${HEADER_Y}px">Game Plan</div>
  <div class="abs card" style="left:${X}px;top:${CARD_Y}px;width:${W}px">${identityRow()}${leaveBand}</div>
  <div class="abs seclabel" style="left:${X}px;width:${W}px;top:${SEC_Y}px"><span>Today’s plan</span><span class="meta">Prep 0 of 2</span></div>
  <div class="abs card" id="plan" style="left:${X}px;top:${PLAN_Y}px;width:${W}px">
    ${row('green', 'solid-people-group', 'Who’s doing what', 'Dad drop-off')}
    ${row('blue', 'solid-bag-shopping', 'What to bring', 'Cleats, Shin guards', '0/2')}
  </div>
  ${pickupChip(X, PICK_Y, 0.84)}
  <svg class="abs" style="left:0;top:0" width="1080" height="1920" viewBox="0 0 1080 1920">
    <path d="M${X} ${PLAN_Y + ROW_H / 2} C ${X - 44} ${PLAN_Y + ROW_H / 2}, ${X - 44} ${PICK_Y + 40}, ${X + 2} ${PICK_Y + 40}" fill="none"
      stroke="#C2410C" stroke-width="4" stroke-linecap="round" stroke-dasharray="2 12"/>
    <circle cx="${X}" cy="${PLAN_Y + ROW_H / 2}" r="7" fill="#C2410C"/>
  </svg>
`);

// ═══ 9.0 s MID-TRANSITION ═══════════════════════════════════════════════════
// The week recedes (≈20%), the navy Hour Block is rising into the session-card slot and has
// already re-set its content to the product's identity fields; the leave-by chip is widening into
// the card's green band (Fraunces, real copy) while "Dad driving" peels off toward the plan;
// "Moved to Field 7" is shrinking into the card's location line; "What to bring" is mid-flight
// into its row; the plan card is only a forming outline; pickup holds, orange and unresolved.
// Art-directed in-flight positions at 9.0 s (every object has its own lane; nothing collides).
const HB = { x: 200, y: 590, w: 680, h: u(12) + u(19) * 3 + u(12) };
const BAND = { x: 200, y: HB.y + HB.h + 14, w: 640, h: BAND_H * 0.9 };
const weekGhost = () => {
  const cols = [164, 260, 356, 452, 784, 856, 928, 1000];
  const hours = [0, 1, 2, 3, 4].map((i) => 610 + i * 210);
  return `<div style="opacity:.2">
    ${hours.map((y) => `<div class="abs hline" style="left:164px;width:916px;top:${y}px"></div>`).join('')}
    ${cols.map((x) => `<div class="abs" style="left:${x}px;top:596px;width:2px;height:880px;background:rgba(11,31,59,.06)"></div>`).join('')}
    ${[[170, '#7C3AED', 1082], [266, '#0EA5E9', 1135], [362, '#7C3AED', 1082]].map(([x, c, y]) =>
      `<div class="abs" style="left:${x}px;top:${y}px;width:84px;height:210px;border-radius:12.5px;background:${c}1C;border-left:6px solid ${c}"></div>`).join('')}
  </div>`;
};
const mid = page('S6 mid · 9.0 s', `
  ${weekGhost()}
  <!-- Hour Block → session card: still navy; content already re-set to the product's identity fields -->
  <div class="abs" style="left:${HB.x}px;top:${HB.y}px;width:${HB.w}px;height:${HB.h}px;border-radius:${u(16)}px;background:var(--acti-ink);
       box-shadow:var(--acti-shadow-overlay);color:#fff;overflow:hidden">
    <div class="idrow">
      <div class="well" style="width:${u(40)}px;height:${u(40)}px;background:rgba(255,255,255,.12);color:#fff">${icon('solid-futbol', u(18))}</div>
      <div>
        <div class="strong" style="color:#fff">Leo — Soccer Practice</div>
        <div class="supporting" style="color:#BABEC5">${icon('regular-calendar', u(12), 'color:#BABEC5')}Thu 5:30 PM</div>
        <div class="supporting" style="color:#BABEC5;opacity:0">${icon('solid-location-dot', u(12), 'color:#BABEC5')}Field 7</div>
      </div>
    </div>
  </div>
  <!-- "Moved to Field 7" landing in the card's location line; "Usually Field 4" dissolving -->
  <div class="abs chip white" style="left:${HB.x + u(16) + u(40) + u(12) - 10}px;top:${HB.y + u(12) + u(20) + u(19) - 6}px;transform:scale(.6);transform-origin:0 0">
    <div class="well" style="width:56px;height:56px;background:var(--acti-ink-tint);color:var(--acti-ink)">${icon('solid-location-dot', 24)}</div>
    <div><div class="t" style="font-size:32px;line-height:38px">Moved to Field 7</div><div class="s" style="font-size:26px;line-height:32px;font-weight:500;color:var(--acti-ink-2);opacity:.28">Usually Field 4</div></div>
  </div>
  <!-- leave-by chip docking as the card's green band (copy already the product's) -->
  <div class="abs" style="left:${BAND.x}px;top:${BAND.y}px;width:${BAND.w}px;height:${BAND.h}px;border-radius:${u(16)}px;
       background:var(--acti-green-surface);display:flex;align-items:center;gap:${u(10)}px;padding:0 ${u(16)}px;box-sizing:border-box">
    <div class="well" style="width:${u(40)}px;height:${u(40)}px;background:#fff;color:var(--acti-green-ink)">${icon('solid-car-side', u(12))}</div>
    <div><div class="leave">Leave by 4:48 PM</div><div class="meta" style="opacity:.5">32 min drive</div></div>
  </div>
  <!-- "Dad driving" has peeled off the leave card and is travelling to "Who's doing what" -->
  <div class="abs" style="left:330px;top:${BAND.y + BAND.h + 34}px;display:flex;gap:12px;align-items:center;background:var(--acti-green-surface);border-radius:999px;padding:10px 24px 10px 12px">
    <div class="well" style="width:46px;height:46px;background:#fff;color:var(--acti-green-ink)">${icon('solid-user', 20)}</div>
    <div style="font-size:31px;line-height:37px;font-weight:600">Dad driving</div>
  </div>
  <!-- "What to bring" mid-flight, already row-shaped -->
  <div class="abs" style="left:200px;top:${BAND.y + BAND.h + 150}px;width:580px;display:flex;gap:${u(12)}px;align-items:center;
       background:#fff;border:2px solid var(--acti-hairline);border-radius:${u(16)}px;box-shadow:var(--acti-shadow-surface);padding:${u(12)}px ${u(16)}px;box-sizing:border-box">
    <div class="well" style="width:${u(44)}px;height:${u(44)}px;background:var(--acti-blue-surface);color:var(--acti-blue-ink)">${icon('solid-bag-shopping', u(12))}</div>
    <div><div class="rlabel">What to bring</div><div class="rdesc">Cleats, Shin guards</div></div>
  </div>
  <!-- pickup: unchanged and unresolved; its thread now hangs from the session itself -->
  ${pickupChip(520, 1360, 0.84)}
  <svg class="abs" style="left:0;top:0" width="1080" height="1920" viewBox="0 0 1080 1920">
    <path d="M${BAND.x + BAND.w - 40} ${BAND.y + BAND.h} C ${BAND.x + BAND.w - 40} ${1180}, ${820} ${1250}, ${820} 1360" fill="none" stroke="#C2410C" stroke-width="4" stroke-linecap="round" stroke-dasharray="2 12"/>
    <circle cx="${BAND.x + BAND.w - 40}" cy="${BAND.y + BAND.h}" r="7" fill="#C2410C"/>
  </svg>
`);

writeFileSync(join(here, 's6-mid_9.0s.html'), mid);
writeFileSync(join(here, 's6-end_10.8s.html'), end);
console.log('wrote S6 styleframes');
