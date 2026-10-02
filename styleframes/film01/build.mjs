// Builds the three Film 01 art-direction styleframes (static, 1080×1920).
// Usage: node build.mjs && ./render.sh
// All colour/type/radius/shadow values come from ../../brand/actiqo-motion-tokens.css.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const brand = join(here, '../../brand');

// Inline a Font Awesome 7 glyph (production icon library) so it paints with currentColor.
const icon = (name, size) => {
  const svg = readFileSync(join(brand, 'icons/fontawesome-7', `${name}.svg`), 'utf8')
    .replace(/<!--.*?-->/s, '');
  return svg.replace('<svg ', `<svg class="fa" width="${size}" height="${size}" `);
};

// ── Time → y mapping helpers ────────────────────────────────────────────────
const timeAxis = (startHour, y0, hourPx) => (h, m = 0) => y0 + (h - startHour + m / 60) * hourPx;

// ── Shared page shell ───────────────────────────────────────────────────────
const page = (title, body, extraCss = '') => `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<title>${title}</title>
<link rel="stylesheet" href="../../brand/actiqo-motion-tokens.css">
<style>
  html,body{margin:0;padding:0}
  body{width:1080px;height:1920px;overflow:hidden;background:var(--acti-app-canvas);
       font-family:var(--acti-font-ui);color:var(--acti-ink);-webkit-font-smoothing:antialiased;
       position:relative}
  .abs{position:absolute}
  .fa{display:block}
  /* Page title: ACTI_TYPE_ROLE.pageTitle, Fraunces 28/34 600 -0.5px, ×k=2.5 → 70/85 */
  .page-title{font-family:var(--acti-font-editorial);font-weight:600;font-size:76px;line-height:84px;
              letter-spacing:-1.4px;font-variation-settings:"opsz" 72, "SOFT" 0, "WONK" 0}
  .page-sub{font-size:34px;line-height:44px;font-weight:400;color:var(--acti-ink-2)}
  .hour{font-size:26px;font-weight:500;color:var(--acti-ink-3);text-align:right;width:92px;
        transform:translateY(-50%)}
  .hline{height:2px;background:var(--acti-hairline)}
  .hline.half{background:rgba(11,31,59,0.045)}
  /* Chip: ACTIQO Row / pill language (white surface, hairline, soft shadow, circular tint well) */
  .chip{display:flex;align-items:center;gap:18px;background:var(--acti-surface);
        border:2px solid var(--acti-hairline);border-radius:var(--acti-r-surface);
        box-shadow:var(--acti-shadow-surface);padding:16px 26px 16px 16px;white-space:nowrap}
  .well{flex:none;border-radius:50%;display:flex;align-items:center;justify-content:center}
  .chip .t{font-size:32px;line-height:38px;font-weight:600;letter-spacing:-0.3px;color:var(--acti-ink)}
  .chip .s{font-size:25px;line-height:31px;font-weight:500;color:var(--acti-ink-2)}
  .chip.green{background:var(--acti-green-surface);border-color:transparent;box-shadow:none}
  .chip.orange{background:var(--acti-orange-surface);border-color:transparent;box-shadow:none}
  .w-green{background:var(--acti-green-surface);color:var(--acti-green-ink)}
  .w-white-green{background:#fff;color:var(--acti-green-ink)}
  .w-white-orange{background:#fff;color:var(--acti-orange-ink)}
  .w-blue{background:var(--acti-blue-surface);color:var(--acti-blue-ink)}
  .w-neutral{background:var(--acti-ink-tint);color:var(--acti-ink)}
  .w-lilac{background:var(--acti-lilac-surface);color:var(--acti-lilac-ink)}
  svg.threads{position:absolute;left:0;top:0;width:1080px;height:1920px;overflow:visible;pointer-events:none}
  ${extraCss}
</style></head>
<body>
${body}
</body></html>`;

// ═══════════════════════════════════════════════════════════════════════════
// STYLEFRAME A: the question
// ═══════════════════════════════════════════════════════════════════════════
const frameA = page('Film 01 · Styleframe A', `
  ${[0,1,2,3].map(i => `<div class="abs hline" style="left:196px;width:884px;top:${470 + i*320}px;background:rgba(11,31,59,0.035)"></div>`).join('')}
  <div class="abs" style="left:84px;top:660px">
    <div style="display:flex;align-items:baseline;gap:16px;margin:0 0 22px 8px">
      <span style="font-size:32px;font-weight:600;color:var(--acti-ink)">Dana</span>
      <span style="font-size:28px;font-weight:500;color:var(--acti-ink-3)">3:12 PM</span>
    </div>
    <div class="bubble">who’s got pickup<br>today?</div>
  </div>
`, `
  .bubble{background:var(--acti-surface);border:2px solid var(--acti-hairline);
          border-radius:56px 56px 56px 16px;box-shadow:var(--acti-shadow-overlay);
          padding:52px 64px 60px;font-size:98px;line-height:110px;font-weight:600;
          letter-spacing:-2.6px;color:var(--acti-ink);display:inline-block}
`);

// ═══════════════════════════════════════════════════════════════════════════
// STYLEFRAME B: Thursday, day scale
// ═══════════════════════════════════════════════════════════════════════════
{
  var yB = timeAxis(16, 470, 320); // 4 PM at y=470, 320px per hour
}
const hoursB = [16, 17, 18, 19];
const labelB = h => `${h > 12 ? h - 12 : h} PM`;
const blockB = { x: 214, y: yB(17, 30), w: 334, h: 300 };
const frameB = page('Film 01 · Styleframe B', `
  <div class="abs" style="left:84px;top:252px">
    <div class="page-title">Thursday</div>
    <div class="page-sub" style="margin-top:6px">Leo’s soccer practice</div>
  </div>

  ${hoursB.map(h => `
    <div class="abs hour" style="left:84px;top:${yB(h)}px">${labelB(h)}</div>
    <div class="abs hline" style="left:196px;width:884px;top:${yB(h)}px"></div>
    <div class="abs hline half" style="left:196px;width:884px;top:${yB(h, 30)}px"></div>
  `).join('')}

  <!-- Leave-by bracket: 4:48 → 5:30, attached to the event's left edge -->
  <div class="abs" style="left:${blockB.x - 22}px;top:${yB(16, 48)}px;width:6px;height:${blockB.y - yB(16, 48)}px;
       background:var(--acti-green-ink);border-radius:3px"></div>
  <div class="abs" style="left:${blockB.x - 30}px;top:${yB(16, 48) - 3}px;width:22px;height:6px;
       background:var(--acti-green-ink);border-radius:3px"></div>

  <!-- Leave-by card (Home Up Next leave row, scaled) -->
  <div class="abs chip green" id="leave" style="left:${blockB.x}px;top:${yB(16, 48) - 58}px;padding:18px 34px 18px 18px">
    <div class="well w-white-green" style="width:80px;height:80px">${icon('solid-car-side', 36)}</div>
    <div>
      <div class="t" style="color:var(--acti-green-ink);font-weight:600;font-size:40px;line-height:46px">Leave by 4:48 PM</div>
      <div class="s">32 min drive + 10 min buffer</div>
    </div>
  </div>

  <!-- The Hour Block: navy = dominant object -->
  <div class="abs hour-block" style="left:${blockB.x}px;top:${blockB.y}px;width:${blockB.w}px;height:${blockB.h}px">
    <div style="display:flex;align-items:center;gap:16px">
      <div class="well" style="width:64px;height:64px;background:rgba(255,255,255,0.12);color:#fff">${icon('solid-futbol', 30)}</div>
      <div style="font-size:26px;font-weight:600;color:rgba(255,255,255,0.72)">Leo</div>
    </div>
    <div style="font-size:48px;line-height:54px;font-weight:600;letter-spacing:-0.9px;margin-top:24px">Soccer<br>Practice</div>
    <div style="font-size:28px;line-height:36px;font-weight:500;color:rgba(255,255,255,0.72);margin-top:6px">5:30 – 6:30 PM</div>
  </div>

  <!-- Responsibility: drop-off -->
  <div class="abs chip" id="driving" style="left:560px;top:${yB(17, 4)}px">
    <div class="well w-green" style="width:64px;height:64px">${icon('solid-user', 26)}</div>
    <div><div class="t">Dad driving</div><div class="s">Drop-off</div></div>
  </div>

  <!-- Preparation -->
  <div class="abs chip" id="bring" style="left:590px;top:${yB(17, 56)}px">
    <div class="well w-blue" style="width:64px;height:64px">${icon('solid-bag-shopping', 26)}</div>
    <div><div class="t">What to bring</div><div class="s">Cleats, shin guards</div></div>
  </div>

  <!-- Unresolved pickup: the reason the question exists -->
  <div class="abs chip orange" id="pickup" style="left:${blockB.x}px;top:${yB(18, 30) + 48}px;padding:18px 34px 18px 18px">
    <div class="well w-white-orange" style="width:80px;height:80px">${icon('solid-person-walking', 34)}</div>
    <div>
      <div class="t" style="font-size:38px;line-height:44px">Pickup · 6:30 PM</div>
      <div class="s" style="color:var(--acti-orange-ink);font-weight:600">No one assigned yet</div>
    </div>
  </div>

  <svg class="threads" id="threads"></svg>
  <script>
    // Threads: semantic origin (a time on the event) → destination (the chip that owns it).
    const T = document.getElementById('threads');
    const box = id => document.getElementById(id).getBoundingClientRect();
    const blk = { x:${blockB.x}, y:${blockB.y}, w:${blockB.w}, h:${blockB.h} };
    function thread(x1,y1,x2,y2,{color='rgba(11,31,59,0.28)',dash=false,dot=true}={}){
      const mx=(x1+x2)/2;
      T.insertAdjacentHTML('beforeend',
        '<path d="M'+x1+' '+y1+' C'+mx+' '+y1+' '+mx+' '+y2+' '+x2+' '+y2+'" fill="none" stroke="'+color+'" stroke-width="3" stroke-linecap="round"'+(dash?' stroke-dasharray="2 11"':'')+'/>'+
        (dot?'<circle cx="'+x1+'" cy="'+y1+'" r="8" fill="'+color+'"/>':''));
    }
    const lv=box('leave'), dr=box('driving'), br=box('bring'), pk=box('pickup');
    // leave-by → who is driving (responsibility hangs off the leave time)
    T.insertAdjacentHTML('beforeend','<circle cx="'+(dr.left+48)+'" cy="'+lv.bottom+'" r="8" fill="rgba(11,31,59,0.28)"/><line x1="'+(dr.left+48)+'" y1="'+lv.bottom+'" x2="'+(dr.left+48)+'" y2="'+dr.top+'" stroke="rgba(11,31,59,0.28)" stroke-width="3"/>');
    // the event → what it needs packed
    thread(blk.x+blk.w, blk.y+blk.h*0.62, br.left, br.top+br.height/2);
    // 6:30 end of practice → unassigned pickup (dashed = unresolved)
    T.insertAdjacentHTML('beforeend','<line x1="'+(blk.x+56)+'" y1="'+(blk.y+blk.h)+'" x2="'+(blk.x+56)+'" y2="'+pk.top+'" stroke="#C2410C" stroke-width="4" stroke-linecap="round" stroke-dasharray="2 12"/>');
  </script>
`, `
  .hour-block{background:var(--acti-ink);color:#fff;border-radius:var(--acti-r-surface);
              box-shadow:var(--acti-shadow-overlay);padding:26px 30px;box-sizing:border-box}
`);

// ═══════════════════════════════════════════════════════════════════════════
// STYLEFRAME C: the week, peak coordination
// ═══════════════════════════════════════════════════════════════════════════
const yC = timeAxis(15, 610, 210); // 3 PM at y=610, 210px/hour → 7 PM at 1450
const cols = [ // Thursday stays wide: it is the anchor the camera pulled back from
  { d: 'Mon', n: 28, x: 168, w: 102 }, { d: 'Tue', n: 29, x: 270, w: 102 },
  { d: 'Wed', n: 30, x: 372, w: 102 }, { d: 'Thu', n: 1,  x: 474, w: 296 },
  { d: 'Fri', n: 2,  x: 770, w: 76 },  { d: 'Sat', n: 3,  x: 846, w: 76 },
  { d: 'Sun', n: 4,  x: 922, w: 76 },
];
const col = d => cols.find(c => c.d === d);
const ev = (d, h1, m1, h2, m2, lane = [0, 1]) => {
  const c = col(d), pad = 6, inner = c.w - pad * 2;
  const x = c.x + pad + inner * lane[0], w = inner * (lane[1] - lane[0]) - (lane[1] < 1 ? 8 : 0);
  return { x, y: yC(h1, m1), w, h: yC(h2, m2) - yC(h1, m1) };
};
const childBlock = (r, child, lines, id) => `
  <div class="abs cblock" id="${id}" style="left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px;
       background:color-mix(in srgb, var(--child-${child}) 10%, white);border-left:6px solid var(--child-${child})">
    ${lines.map((l, i) => `<div class="${i === lines.length - 1 ? 'ct' : 'cl'}">${l}</div>`).join('')}
  </div>`;
const bracket = (x, yTop, yBottom, id = '') => `
  <div class="abs" ${id ? `id="${id}"` : ''} style="left:${x}px;top:${yTop}px;width:6px;height:${yBottom - yTop}px;background:var(--acti-green-ink);border-radius:3px"></div>
  <div class="abs" style="left:${x - 6}px;top:${yTop - 3}px;width:18px;height:6px;background:var(--acti-green-ink);border-radius:3px"></div>`;

const monDance = ev('Mon', 17, 15, 18, 15), tueSoccer = ev('Tue', 17, 30, 18, 30), wedDance = ev('Wed', 17, 15, 18, 15);
const thuDance = ev('Thu', 17, 15, 18, 15, [0, 0.4]), thuSoccer = ev('Thu', 17, 30, 18, 30, [0.4, 1]);

const frameC = page('Film 01 · Styleframe C', `
  <div class="abs" style="left:84px;top:236px">
    <div class="page-title">This week</div>
    <div class="page-sub" style="margin-top:4px">Sep 28 – Oct 4</div>
  </div>

  ${cols.map(c => `
    <div class="abs dayhead" style="left:${c.x}px;width:${c.w}px;top:452px">
      <div class="dl" style="${c.d === 'Thu' ? 'color:var(--acti-ink)' : ''}">${c.d}</div>
      <div class="dn ${c.d === 'Thu' ? 'sel' : ''}">${c.n}</div>
    </div>
    <div class="abs" style="left:${c.x}px;top:596px;width:2px;height:880px;background:rgba(11,31,59,0.05)"></div>
  `).join('')}
  <div class="abs" style="left:${col('Thu').x}px;top:596px;width:296px;height:880px;background:rgba(11,31,59,0.025)"></div>

  ${[15, 16, 17, 18, 19].map(h => `
    <div class="abs hour" style="left:62px;top:${yC(h)}px;width:92px">${h - 12} PM</div>
    <div class="abs hline" style="left:168px;width:912px;top:${yC(h)}px"></div>
  `).join('')}

  ${childBlock(monDance, 'maya', ['Dance', '5:15'], 'mon')}
  ${childBlock(tueSoccer, 'leo', ['Soccer', '5:30'], 'tue')}
  ${childBlock(wedDance, 'maya', ['Dance', '5:15'], 'wed')}
  ${childBlock(thuDance, 'maya', ['Maya', 'Dance', '5:15'], 'thudance')}

  <!-- Thursday leave-by: bracket hangs from the leave card down to the practice it serves -->
  ${bracket(thuSoccer.x + 26, yC(16, 48) + 40, thuSoccer.y - 6)}

  <!-- Thursday soccer: the Hour Block, still navy at week scale -->
  <div class="abs hour-block" id="thu" style="left:${thuSoccer.x + 8}px;top:${thuSoccer.y}px;width:${thuSoccer.w - 8}px;height:${thuSoccer.h}px">
    <div style="font-size:24px;line-height:28px;font-weight:600;color:rgba(255,255,255,0.72)">Leo</div>
    <div style="font-size:31px;line-height:35px;font-weight:600;letter-spacing:-0.4px;margin-top:6px">Soccer<br>Practice</div>
    <div style="font-size:23px;line-height:30px;font-weight:500;color:rgba(255,255,255,0.72);margin-top:6px">5:30 – 6:30</div>
  </div>

  <!-- ── Coordination elements: Thursday's chain, stacked in time order ── -->
  <div class="abs chip" id="c-bring" style="left:${col('Thu').x + 6}px;top:${yC(15, 22)}px">
    <div class="well w-blue" style="width:56px;height:56px">${icon('solid-bag-shopping', 24)}</div>
    <div class="t">Cleats, shin guards</div>
  </div>

  <div class="abs chip" id="c-field" style="left:${col('Thu').x + 6}px;top:${yC(16, 2)}px">
    <div class="well w-neutral" style="width:56px;height:56px">${icon('solid-location-dot', 24)}</div>
    <div class="t">Field 4 → 7</div>
  </div>

  <div class="abs chip green" id="c-leave" style="left:${col('Thu').x + 6}px;top:${yC(16, 48) - 40}px;padding:10px 28px 10px 10px">
    <div class="well w-white-green" style="width:60px;height:60px">${icon('solid-car-side', 26)}</div>
    <div><div class="t" style="color:var(--acti-green-ink);font-weight:600">Leave by 4:48</div><div class="s">Dad driving</div></div>
  </div>

  <div class="abs chip" id="c-grandma" style="left:84px;top:${yC(18, 30) + 64}px;padding:12px 28px 12px 12px">
    <div class="well w-green" style="width:64px;height:64px">${icon('solid-person-walking', 26)}</div>
    <div><div class="t">Tue pickup</div><div class="s">Grandma</div></div>
  </div>

  <div class="abs chip orange" id="c-pickup" style="left:496px;top:${yC(18, 30) + 64}px;padding:12px 28px 12px 12px">
    <div class="well w-white-orange" style="width:64px;height:64px">${icon('solid-person-walking', 26)}</div>
    <div><div class="t">Thu pickup</div><div class="s" style="color:var(--acti-orange-ink);font-weight:600">No one yet</div></div>
  </div>

  <svg class="threads" id="threads"></svg>
  <script>
    const T = document.getElementById('threads');
    const b = id => document.getElementById(id).getBoundingClientRect();
    function curve(x1,y1,x2,y2,{color='rgba(11,31,59,0.30)',dash=false,dot=true,vert=false}={}){
      const d = vert
        ? 'M'+x1+' '+y1+' C'+x1+' '+((y1+y2)/2)+' '+x2+' '+((y1+y2)/2)+' '+x2+' '+y2
        : 'M'+x1+' '+y1+' C'+((x1+x2)/2)+' '+y1+' '+((x1+x2)/2)+' '+y2+' '+x2+' '+y2;
      T.insertAdjacentHTML('beforeend','<path d="'+d+'" fill="none" stroke="'+color+'" stroke-width="3" stroke-linecap="round"'+(dash?' stroke-dasharray="2 11"':'')+'/>'+
        (dot?'<circle cx="'+x1+'" cy="'+y1+'" r="7" fill="'+color+'"/>':''));
    }
    const thu=b('thu'), tue=b('tue'), dance=b('thudance');
    const br=b('c-bring'), fl=b('c-field'), pk=b('c-pickup'), gm=b('c-grandma');
    // Chain spine: pack → field change → leave (each is a precondition of the next)
    const lv=b('c-leave');
    const sx = br.left+44;
    T.insertAdjacentHTML('afterbegin','<line x1="'+sx+'" y1="'+br.bottom+'" x2="'+sx+'" y2="'+fl.top+'" stroke="rgba(11,31,59,0.30)" stroke-width="3" stroke-linecap="round"/>'+
      '<line x1="'+sx+'" y1="'+fl.bottom+'" x2="'+sx+'" y2="'+lv.top+'" stroke="rgba(11,31,59,0.30)" stroke-width="3" stroke-linecap="round"/>');
    // 6:30 practice end + 6:15 dance end → one open pickup (orange dashed = unresolved)
    curve(thu.left+thu.width*0.5, thu.bottom, pk.left+pk.width*0.72, pk.top, {color:'#C2410C',dash:true,vert:true});
    curve(dance.left+dance.width*0.5, dance.bottom, pk.left+pk.width*0.28, pk.top, {color:'#C2410C',dash:true,vert:true});
    // Tue practice end → Grandma (resolved handoff)
    curve(tue.left+tue.width*0.5, tue.bottom, gm.left+gm.width*0.62, gm.top, {vert:true});
  </script>
`, `
  .dayhead{display:flex;flex-direction:column;align-items:center;gap:12px}
  .dl{font-size:26px;font-weight:600;color:var(--acti-ink-3)}
  .dn{width:62px;height:62px;border-radius:50%;display:flex;align-items:center;justify-content:center;
      font-size:30px;font-weight:600;color:var(--acti-ink)}
  .dn.sel{background:var(--acti-ink);color:#fff}
  .cblock{box-sizing:border-box;border-radius:14px;padding:12px 4px 8px 9px;overflow:hidden}
  .cl{font-size:22px;line-height:27px;font-weight:600;color:var(--acti-ink);letter-spacing:-0.4px}
  .ct{font-size:21px;line-height:26px;font-weight:500;color:var(--acti-ink-2);margin-top:2px}
  .hour-block{background:var(--acti-ink);color:#fff;border-radius:22px;
              box-shadow:var(--acti-shadow-overlay);padding:16px 18px;box-sizing:border-box}
  .chip .t{font-size:31px;line-height:37px}
  .chip .s{font-size:25px;line-height:30px}
`);

writeFileSync(join(here, 'styleframe-A.html'), frameA);
writeFileSync(join(here, 'styleframe-B.html'), frameB);
writeFileSync(join(here, 'styleframe-C.html'), frameC);
console.log('wrote styleframe-A/B/C.html');

// NOTE (2026-09-30): this generator produced the v1-approved styleframes. The v2 styleframes
// (actiqo-film01-styleframe-{A,B,C}_v2.png) are exported directly from the v02 film composition
// (videos/actiqo-the-hour) so the approved frames and the animation cannot drift apart.
