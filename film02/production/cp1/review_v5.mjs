// Review V5 — character-art refinement pass (hands, faces, hair, props). Rig/gait/proportions unchanged.
import { simulate } from '../lib/gait.mjs';
import { drawFigure, CAST } from '../lib/character.mjs';
import { renderStill } from '../lib/render.mjs';
import { execFileSync } from 'node:child_process';

const OUT = new URL('./review_v5/', import.meta.url).pathname;
const IVORY = '#FCFAF7', H_MAX = 110;
const G = {
  momLoaded: { cad: 1.07, stride: 0.6 * 3.6, opts: { load: 1, arms: { near: 'phone', far: 'cleats' }, bag: 'mom', tilt: 14 } },
  momLight: { cad: 1.0, stride: 0.66 * 3.6, opts: { load: 0.35, arms: { near: 'phone' }, tilt: 6 } },
  dad: { cad: 0.95, stride: 0.74 * 3.6, opts: { load: 0, arms: {} } },
  dadBag: { cad: 0.95, stride: 0.74 * 3.6, opts: { load: 0.1, arms: { far: 'carry' }, bag: 'mom' } },
  grandma: { cad: 0.84, stride: 0.56 * 3.6, opts: { load: 0, arms: {} } },
};
function fig(c, g, h, x, ground, ph = 0.12) {
  const sim = simulate({ h, x0: x, groundY: ground, cadence: () => g.cad, stride: () => g.stride, t0: -3, t1: 3 });
  const t = ph / g.cad, s = sim.at(t), dx = x - s.x;
  const sh = (st) => ({ ...st, x: st.x + dx, feet: st.feet.map((f) => ({ ...f, ankle: { x: f.ankle.x + dx, y: f.ankle.y } })) });
  return drawFigure(sh(s), c, h, { ...g.opts, lag: sh(sim.at(t - 0.07)) });
}
function floor(w, hgt, horizonY, vpX) {
  let o = `<rect width="${w}" height="${hgt}" fill="${IVORY}"/>`;
  const n = Math.ceil((w * 0.75) / 260);
  for (let k = -n; k <= n; k++) o += `<line x1="${vpX + k * 26}" y1="${horizonY}" x2="${vpX + k * 260}" y2="${hgt + 40}" stroke="#0B1F3B" stroke-opacity=".07"/>`;
  return o;
}
const still = (name, w, h, svg, scale = 2) => renderStill({ w, h, svg, out: OUT + name, scale });
const crop = (src, name, x, y, w, h) => execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', OUT + src, '-vf', `crop=${w}:${h}:${Math.round(x)}:${Math.round(y)}`, OUT + name]);

// largest-scale sheet (9:16 foreground scale): Mom loaded, Dad, Grandma at H_MAX, native + 2×
{
  const w = 1080, h = 1920;
  const mom = fig(CAST.mom, G.momLoaded, H_MAX, 470, 1640);
  await still('L_mom_1x.png', w, h, floor(w, h, 900, 540) + mom.svg, 1);
  await still('L_mom_2x.png', w, h, floor(w, h, 900, 540) + mom.svg, 2);
  const a = mom.anchors;
  const box = (cx, cy, sz) => [cx - sz / 2, cy - sz / 2, sz, sz];
  const boxes = {
    '1_mom_face': box(a.headC.x + 0.06 * H_MAX, a.headC.y + 0.04 * H_MAX, 240),
    '2_phone_hand': box(a.handN.x + 0.12 * H_MAX, a.handN.y - 0.24 * H_MAX, 200),
    '3_cleats_hand': box(a.handF.x + 0.12 * H_MAX, a.handF.y + 0.3 * H_MAX, 220),
  };
  for (const [k, [x, y, bw, bh]] of Object.entries(boxes)) { crop('L_mom_1x.png', `${k}_native.png`, x, y, bw, bh); crop('L_mom_2x.png', `${k}_2x.png`, 2 * x, 2 * y, 2 * bw, 2 * bh); }
  for (const [name, c, g] of [['4_dad_face', CAST.dad, G.dad], ['5_grandma_face', CAST.grandma, G.grandma]]) {
    const F = fig(c, g, H_MAX, 470, 1640, 0.2);
    await still(`L_${name}_1x.png`, w, h, floor(w, h, 900, 540) + F.svg, 1);
    await still(`L_${name}_2x.png`, w, h, floor(w, h, 900, 540) + F.svg, 2);
    const x = F.anchors.headC.x + 0.06 * H_MAX - 120, y = F.anchors.headC.y + 0.02 * H_MAX - 120;
    crop(`L_${name}_1x.png`, `${name}_native.png`, x, y, 240, 240); crop(`L_${name}_2x.png`, `${name}_2x.png`, 2 * x, 2 * y, 480, 480);
  }
}
// 6 · full Mom loaded, 16:9
await still('6_mom_loaded_16x9.png', 1920, 1080, floor(1920, 1080, 300, 960) + fig(CAST.mom, G.momLoaded, 100, 900, 930).svg);
// 7 · 9:16 family frame — lanes spaced so no figure overlaps another
{
  const w = 1080, h = 1920;
  const svg = floor(w, h, 520, 540)
    + fig(CAST.grandma, G.grandma, 42, 800, 700, 0.3).svg
    + fig(CAST.dad, G.dadBag, 52, 760, 1000, 0.4).svg
    + fig(CAST.mom, G.momLight, H_MAX, 380, 1640, 0.15).svg;
  await still('7_family_9x16.png', w, h, svg);
}
console.log('ok');
