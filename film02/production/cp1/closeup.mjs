// CP1 close-up: faces, hands, props at large scale (inspection only).
import { simulate } from '../lib/gait.mjs';
import { drawFigure, CAST } from '../lib/character.mjs';
import { renderStill } from '../lib/render.mjs';
const W = 1920, H = 1080;
const parts = [];
const one = (c, h, x, G, opts, cad, stride, ph) => {
  const sim = simulate({ h, x0: x, groundY: G, cadence: () => cad, stride: () => stride, t0: -3, t1: 3 });
  const t = ph / cad; const s = sim.at(t), dx = x - s.x;
  const sh = (st) => ({ ...st, x: st.x + dx, feet: st.feet.map((f) => ({ ...f, ankle: { x: f.ankle.x + dx, y: f.ankle.y } })) });
  return drawFigure(sh(s), c, h, { ...opts, lag: sh(sim.at(t - 0.07)) }).svg;
};
// big heads: ground far below frame so the upper body fills it
parts.push(one(CAST.mom, 230, 420, 2050, { load: 1, arms: { near: 'phone', far: 'cleats' }, bag: 'mom', tilt: 14 }, 1.07, 2.2, 0.1));
parts.push(one(CAST.dad, 230, 1060, 2080, { load: 0, arms: {} }, 0.94, 2.6, 0.3));
parts.push(one(CAST.grandma, 230, 1640, 2000, { load: 0, arms: {} }, 0.86, 2.1, 0.3));
await renderStill({ w: W, h: H, svg: `<rect width="${W}" height="${H}" fill="#FCFAF7"/>${parts.join('')}`, out: new URL(`./out/closeup_${process.argv[2] || 'v1'}.png`, import.meta.url).pathname });
console.log('ok');
