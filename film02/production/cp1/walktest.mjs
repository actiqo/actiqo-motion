// CP1 walk-cycle tests. Each lane is camera-tracked on its walker; hour lines are planted in world space,
// so any foot sliding would be visible against them. Outputs 16:9 and 9:16 tests + Mom load ladder.
import { simulate, smooth } from '../lib/gait.mjs';
import { drawFigure, CAST } from '../lib/character.mjs';
import { renderVideo, renderStill } from '../lib/render.mjs';

const OUT = new URL('./out/', import.meta.url).pathname;
const N = 0x1f3b;
const GAIT = {
  momLoaded: { cad: 1.07, stride: 0.6 * 3.6 },   // 14-frame half cycle, short steps
  momFree: { cad: 0.94, stride: 0.71 * 3.6 },    // 16-frame half cycle, stride +18%
  dad: { cad: 0.95, stride: 0.74 * 3.6 },
  grandma: { cad: 0.84, stride: 0.56 * 3.6 },    // ~18-frame half cycle
};
const ARMS = {
  momLoaded: { load: 1, arms: { near: 'phone', far: 'cleats' }, bag: 'mom', tilt: 14 },
  momMid: { load: 0.45, arms: { near: 'phone' }, tilt: 4 },
  momFree: { load: 0, arms: {}, tilt: -2 },
  dad: { load: 0, arms: {} },
  dadBag: { load: 0.1, arms: { far: 'carry' }, bag: 'mom' },
  grandma: { load: 0, arms: {} },
};

/** one tracked lane: walker centred at anchorX, ground at G; returns svg for time t */
function lane({ c, h, G, anchorX, gait, opts, x0 = 0, label, labelX = 60, w }) {
  const sim = simulate({ h, x0, groundY: G, cadence: () => gait.cad, stride: () => gait.stride, t0: -2, t1: 14 });
  return (t) => {
    const s = sim.at(t), cam = s.x - anchorX;
    const shift = (st) => ({ ...st, x: st.x - cam, feet: st.feet.map((f) => ({ ...f, ankle: { x: f.ankle.x - cam, y: f.ankle.y } })) });
    let o = '';
    // world-planted hour lines (every 2.4 heads) + ground line
    const sp = 2.4 * h; const first = Math.floor(cam / sp) - 1;
    for (let k = first; k < first + Math.ceil(w / sp) + 3; k++) {
      const x = k * sp - cam;
      o += `<line x1="${x.toFixed(1)}" x2="${x.toFixed(1)}" y1="${G - 0.15 * h}" y2="${G + 0.5 * h}" stroke="#0B1F3B" stroke-opacity=".16" stroke-width="1"/>`;
    }
    o += `<line x1="0" x2="${w}" y1="${G}" y2="${G}" stroke="#0B1F3B" stroke-opacity=".14" stroke-width="1"/>`;
    o += drawFigure(shift(s), c, h, { ...opts, lag: shift(sim.at(t - 0.07)) }).svg;
    if (label) o += `<text x="${labelX}" y="${G + 0.95 * h}" font-family="Inter" font-weight="500" font-size="${Math.max(15, 0.26 * h).toFixed(0)}" fill="#0B1F3B" fill-opacity=".55">${label}</text>`;
    return o;
  };
}
const slate = (w, title, sub) => `<text x="60" y="70" font-family="Fraunces" font-weight="600" font-size="34" fill="#0B1F3B">${title}</text><text x="60" y="104" font-family="Inter" font-weight="500" font-size="18" fill="#0B1F3B" fill-opacity=".55">${sub}</text>`;
const bg = (w, h) => `<rect width="${w}" height="${h}" fill="#FCFAF7"/>`;

const DUR = 8, NF = DUR * 30;

// 16:9 · family lanes (front → back = Mom, Dad, Grandma)
const ONLY = process.argv[2];
if (!ONLY || ONLY === 'family16') {
  const W = 1920, H = 1080;
  const L = [
    lane({ c: CAST.grandma, h: 44, G: 470, anchorX: 1180, gait: GAIT.grandma, opts: ARMS.grandma, label: 'Grandma · 18-frame half cycle', labelX: 1290, w: W }),
    lane({ c: CAST.dad, h: 52, G: 700, anchorX: 1020, gait: GAIT.dad, opts: ARMS.dad, label: 'Dad · 16-frame half cycle', labelX: 1150, w: W }),
    lane({ c: CAST.mom, h: 62, G: 980, anchorX: 820, gait: GAIT.momLoaded, opts: ARMS.momLoaded, label: 'Mom · loaded · 14-frame half cycle', labelX: 980, w: W }),
  ];
  await renderVideo({ w: W, h: H, n: NF, out: OUT + 'CP1_walk_family_16x9.mp4', frame: (i) => bg(W, H) + slate(W, 'Film 02 · CP1 · walk-cycle test', 'Tracked lanes · hour lines planted in world space · 30 fps') + L.map((f) => f(i / 30)).join('') });
}
// 16:9 · Mom load ladder (same scale, three lanes)
if (!ONLY || ONLY === 'ladder') {
  const W = 1920, H = 1080;
  const L = [
    lane({ c: CAST.mom, h: 34, G: 420, anchorX: 900, gait: GAIT.momLoaded, opts: ARMS.momLoaded, label: 'Loaded · phone, cleats, bag · lean 10° · shoulders up', labelX: 1040, w: W }),
    lane({ c: CAST.mom, h: 34, G: 700, anchorX: 900, gait: { cad: 1.0, stride: 0.66 * 3.6 }, opts: ARMS.momMid, label: 'After the put-downs · phone + thread only', labelX: 1040, w: W }),
    lane({ c: CAST.mom, h: 34, G: 980, anchorX: 900, gait: GAIT.momFree, opts: ARMS.momFree, label: 'Free · longest stride · open posture', labelX: 1040, w: W }),
  ];
  await renderVideo({ w: W, h: H, n: NF, out: OUT + 'CP1_mom_load_ladder_16x9.mp4', frame: (i) => bg(W, H) + slate(W, 'Mom · load posture ladder', 'One load parameter: lean, shoulder height, head angle, stride, arm swing') + L.map((f) => f(i / 30)).join('') });
}
// 9:16 · vertical composition: Mom large in the bottom third, family lanes above
if (!ONLY || ONLY === 'tall') {
  const W = 1080, H = 1920;
  const L = [
    lane({ c: CAST.grandma, h: 42, G: 720, anchorX: 640, gait: GAIT.grandma, opts: ARMS.grandma, label: 'Grandma', labelX: 760, w: W }),
    lane({ c: CAST.dad, h: 50, G: 1010, anchorX: 560, gait: GAIT.dad, opts: ARMS.dad, label: 'Dad', labelX: 700, w: W }),
    lane({ c: CAST.mom, h: 92, G: 1520, anchorX: 430, gait: GAIT.momLoaded, opts: ARMS.momLoaded, label: 'Mom', labelX: 700, w: W }),
  ];
  const safe = `<rect x="0" y="0" width="${W}" height="220" fill="#0B1F3B" fill-opacity=".04"/><rect x="0" y="${H - 384}" width="${W}" height="384" fill="#0B1F3B" fill-opacity=".04"/><rect x="950" y="700" width="130" height="836" fill="#0B1F3B" fill-opacity=".04"/>`;
  await renderVideo({ w: W, h: H, n: NF, out: OUT + 'CP1_walk_family_9x16.mp4', frame: (i) => bg(W, H) + safe + `<g transform="translate(0,190)">${slate(W, 'CP1 · vertical walk test', 'Shaded bands = platform UI zones')}</g>` + L.map((f) => f(i / 30)).join('') });
}
// Dad handoff pose check (bag carried by Dad)
if (!ONLY || ONLY === 'dadbag') {
  const W = 1920, H = 1080;
  const L = [lane({ c: CAST.dad, h: 70, G: 900, anchorX: 900, gait: GAIT.dad, opts: ARMS.dadBag, label: 'Dad · carrying the soccer bag (after the handoff)', labelX: 1080, w: W })];
  await renderVideo({ w: W, h: H, n: 120, out: OUT + 'CP1_dad_bag_16x9.mp4', frame: (i) => bg(W, H) + slate(W, 'Dad · bag carry', 'Strap over the near shoulder, bag at the far hip') + L.map((f) => f(i / 30)).join('') });
}
console.log('done');
