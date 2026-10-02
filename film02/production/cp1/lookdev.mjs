// CP1 look-dev: three characters × four gait phases (contact, down, passing, up) for inspection.
import { simulate } from '../lib/gait.mjs';
import { drawFigure, CAST } from '../lib/character.mjs';
import { renderStill } from '../lib/render.mjs';

const W = 1920, H = 1080;
const rows = [
  { c: CAST.mom, h: 40, opts: { load: 1, arms: { near: 'phone', far: 'cleats' }, bag: 'mom', tilt: 14 }, cad: 1.07, stride: 0.62 * 3.6 },
  { c: CAST.dad, h: 41, opts: { load: 0, arms: {} }, cad: 0.94, stride: 0.74 * 3.6 },
  { c: CAST.grandma, h: 38.5, opts: { load: 0, arms: {} }, cad: 0.86, stride: 0.6 * 3.6 },
];
const parts = [];
rows.forEach((r, ri) => {
  const G = 330 + ri * 350;
  parts.push(`<line x1="40" x2="${W - 40}" y1="${G}" y2="${G}" stroke="#0B1F3B" stroke-opacity=".12"/>`);
  [0, 0.125, 0.25, 0.375].forEach((ph, ci) => {
    const x = 260 + ci * 440;
    const sim = simulate({ h: r.h, x0: x, groundY: G, cadence: () => r.cad, stride: () => r.stride, t0: -3, t1: 3 });
    const t = ph / r.cad;
    const s = sim.at(t), dx = x - s.x;
    const shift = (st) => ({ ...st, x: st.x + dx, feet: st.feet.map((f) => ({ ...f, ankle: { x: f.ankle.x + dx, y: f.ankle.y } })) });
    parts.push(drawFigure(shift(s), r.c, r.h, { ...r.opts, lag: shift(sim.at(t - 0.07)) }).svg);
  });
});
const svg = `<rect width="${W}" height="${H}" fill="#FCFAF7"/>${parts.join('')}`;
await renderStill({ w: W, h: H, svg, out: new URL(`./out/lookdev_${process.argv[2] || 'v2'}.png`, import.meta.url).pathname });
console.log('ok');
