// CP1 visual review pack — final production rendering, no debug overlays. Character art unchanged.
import { simulate } from '../lib/gait.mjs';
import { drawFigure, CAST } from '../lib/character.mjs';
import { renderStill } from '../lib/render.mjs';

const OUT = new URL('./review/', import.meta.url).pathname;
const IVORY = '#FCFAF7';
const H_MAX = 110; // largest head height anywhere in the film: 9:16 foreground Mom (≈825 px figure)

const G = {
  momLoaded: { cad: 1.07, stride: 0.6 * 3.6, opts: { load: 1, arms: { near: 'phone', far: 'cleats' }, bag: 'mom', tilt: 14 } },
  momFree: { cad: 0.94, stride: 0.71 * 3.6, opts: { load: 0, arms: {}, tilt: -2 } },
  dad: { cad: 0.95, stride: 0.74 * 3.6, opts: { load: 0, arms: {} } },
  grandma: { cad: 0.84, stride: 0.56 * 3.6, opts: { load: 0, arms: {} } },
};
/** a figure at screen x (hip), ground y, head height h, gait phase ph */
function fig(c, g, h, x, ground, ph = 0.12) {
  const sim = simulate({ h, x0: x, groundY: ground, cadence: () => g.cad, stride: () => g.stride, t0: -3, t1: 3 });
  const t = ph / g.cad, s = sim.at(t), dx = x - s.x;
  const sh = (st) => ({ ...st, x: st.x + dx, feet: st.feet.map((f) => ({ ...f, ankle: { x: f.ankle.x + dx, y: f.ankle.y } })) });
  return drawFigure(sh(s), c, h, { ...g.opts, lag: sh(sim.at(t - 0.07)) });
}
// the film's floor: faint receding hour lines + horizon-less ivory ground (as in the approved styleframes)
function floor(w, hgt, horizonY, vpX, groundY) {
  let o = `<rect width="${w}" height="${hgt}" fill="${IVORY}"/>`;
  const n = Math.ceil((w * 0.75) / 260);
  for (let k = -n; k <= n; k++) {
    const xb = vpX + k * 260;
    o += `<line x1="${vpX + k * 26}" y1="${horizonY}" x2="${xb}" y2="${hgt + 40}" stroke="#0B1F3B" stroke-opacity=".07" stroke-width="1"/>`;
  }
  for (const y of [groundY - 160, groundY - 60, groundY + 50, groundY + 170]) if (y > horizonY && y < hgt) o += `<line x1="0" x2="${w}" y1="${y}" y2="${y}" stroke="#0B1F3B" stroke-opacity=".05" stroke-width="1"/>`;
  return o;
}
const still = (name, w, h, svg, scale = 2) => renderStill({ w, h, svg, out: OUT + name, scale });

// 1 + 2 · Mom loaded / free — same scale, same camera
const W = 1920, Hh = 1080, MOM_H = 100, MOM_X = 900, GROUND = 930;
await still('01_mom_loaded_16x9.png', W, Hh, floor(W, Hh, 300, 960, GROUND) + fig(CAST.mom, G.momLoaded, MOM_H, MOM_X, GROUND).svg);
await still('02_mom_free_16x9.png', W, Hh, floor(W, Hh, 300, 960, GROUND) + fig(CAST.mom, G.momFree, MOM_H, MOM_X, GROUND).svg);

// 3 · face + hands at the largest on-screen scale (H_MAX), native pixels (1×) — plus the same crop at 2× device scale
{
  const w = 1080, h = 1920, ground = 1640;
  const F = fig(CAST.mom, G.momLoaded, H_MAX, 470, ground);
  const svg = floor(w, h, 900, 540, ground) + F.svg;
  await still('03_mom_largest_scale_9x16_full.png', w, h, svg, 1);
  await still('03_mom_largest_scale_9x16_full@2x.png', w, h, svg, 2);
  const a = F.anchors;
  // crop boxes (native px) around head and the two hands
  const box = (cx, cy, bw, bh) => ({ x: Math.round(cx - bw / 2), y: Math.round(cy - bh / 2), w: bw, h: bh });
  const crops = { head: box(a.headC.x + 10, a.headC.y + 10, 300, 300), handPhone: box(a.handN.x + 20, a.handN.y - 20, 260, 260), handCleats: box(a.handF.x + 20, a.handF.y + 40, 260, 260) };
  console.log(JSON.stringify(crops));
}

// 4 · Dad + Grandma side by side, final quality
{
  const g2 = 930;
  await still('04_dad_grandma_16x9.png', W, Hh, floor(W, Hh, 300, 960, g2) + fig(CAST.dad, G.dad, 102, 700, g2, 0.2).svg + fig(CAST.grandma, G.grandma, 97, 1230, g2, 0.05).svg);
}

// 5 · representative 16:9 family frame (late film: Mom lighter, Dad with the bag ahead, Grandma arriving on the far lane)
{
  const svg = floor(W, Hh, 300, 960, 960)
    + fig(CAST.grandma, G.grandma, 54, 1350, 640, 0.3).svg
    + fig(CAST.dad, { ...G.dad, opts: { load: 0.1, arms: { far: 'carry' }, bag: 'mom' } }, 62, 1060, 790, 0.4).svg
    + fig(CAST.mom, { cad: 1.0, stride: 0.66 * 3.6, opts: { load: 0.35, arms: { near: 'phone' }, tilt: 6 } }, 78, 720, 960, 0.15).svg;
  await still('05_family_16x9.png', W, Hh, svg);
}
// 6 · representative 9:16 family frame (Mom foreground at the largest scale; family lanes above; text-safe zones respected)
{
  const w = 1080, h = 1920;
  const svg = floor(w, h, 520, 540, 1640)
    + fig(CAST.grandma, G.grandma, 46, 760, 860, 0.3).svg
    + fig(CAST.dad, { ...G.dad, opts: { load: 0.1, arms: { far: 'carry' }, bag: 'mom' } }, 54, 560, 1080, 0.4).svg
    + fig(CAST.mom, { cad: 1.0, stride: 0.66 * 3.6, opts: { load: 0.35, arms: { near: 'phone' }, tilt: 6 } }, H_MAX, 400, 1640, 0.15).svg;
  await still('06_family_9x16.png', w, h, svg);
}
console.log('ok');
