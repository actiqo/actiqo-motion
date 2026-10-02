// CP2 contact sheets: key beats pulled from the rendered MP4s (not re-rendered stills), plus a 9:16 lane-clearance check.
import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { renderStill, openStage } from '../lib/render.mjs';
import { makeScene, FMT, STRINGS } from './scene.mjs';
import { setMetrics } from '../lib/world.mjs';
import { simulate } from '../lib/gait.mjs';
import { drawFigure, CAST } from '../lib/character.mjs';
import { writeFileSync } from 'node:fs';

const O = new URL('./out/', import.meta.url).pathname, B = O + 'beats/'; mkdirSync(B, { recursive: true });
const BEATS = [[0.15, 'Opening'], [1.0, 'Practice moved to Field 7'], [2.3, 'Who has pickup?'], [3.8, 'Leave by 4:48 PM'], [4.9, 'Dad drop-off'],
  [7.3, 'Leo + Maya routes'], [8.5, 'Cleats / load · the thread'], [10.2, 'Pickup · 6:30 · ?'], [11.5, 'Held weight (10.6–12 s)']];
const VID = { wide: 'ACTIQO_WhatYouCarry_CP2_0-12s_16x9.mp4', tall: 'ACTIQO_WhatYouCarry_CP2_0-12s_9x16.mp4' };
for (const fmt of ['wide', 'tall']) BEATS.forEach(([t], i) => execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', O + VID[fmt], '-vf', `select=eq(n\\,${Math.round(t * 30)})`, '-frames:v', '1', `${B}${fmt}_${i}.png`]));

// lane-clearance check (9:16): the held frame + Dad and Grandma on Mom's path, where their beats stage them later
{
  const f = FMT.tall, st = await openStage(f.W, f.H); setMetrics(await st.measure(STRINGS));
  const base = makeScene('tall')(11.5);
  const put = (c, x, h, opts, cad, stride, ph) => { const sim = simulate({ h, x0: x, groundY: 1700, cadence: () => cad, stride: () => stride, t0: -3, t1: 3 }); const t = ph / cad, s = sim.at(t), dx = x - s.x;
    const sh = (q) => ({ ...q, x: q.x + dx, feet: q.feet.map((ff) => ({ ...ff, ankle: { x: ff.ankle.x + dx, y: ff.ankle.y } })) }); return drawFigure(sh(s), c, h, { ...opts, lag: sh(sim.at(t - 0.07)) }).svg; };
  const svg = base + put(CAST.dad, 600, 97, { load: 0.1, arms: { far: 'carry' }, bag: 'mom' }, 0.95, 2.66, 0.4) + put(CAST.grandma, 860, 91, { load: 0, arms: {} }, 0.84, 2.0, 0.1)
    + `<rect x="950" y="700" width="130" height="836" fill="#C2410C" fill-opacity=".06"/><rect x="0" y="0" width="1080" height="220" fill="#C2410C" fill-opacity=".06"/><rect x="0" y="1536" width="1080" height="384" fill="#C2410C" fill-opacity=".06"/>`;
  writeFileSync(B + 'tall_clearance.png', await st.frame(svg)); await st.close();
}

// sheet
const ink = '#0B1F3B';
const cap = (t, x, y, sz = 22) => `<text x="${x}" y="${y}" font-family="Inter" font-weight="500" font-size="${sz}" fill="${ink}" fill-opacity=".75">${t}</text>`;
const img = (p, x, y, w, h) => `<image href="file://${p}" x="${x}" y="${y}" width="${w}" height="${h}"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${ink}" stroke-opacity=".14"/>`;
{ // 16:9 sheet: 3×3
  const tw = 760, th = 428, W = 60 * 2 + 3 * tw + 2 * 30, H = 170 + 3 * (th + 70);
  let s = `<rect width="${W}" height="${H}" fill="#FCFAF7"/><text x="60" y="76" font-family="Fraunces" font-weight="600" font-size="44" fill="${ink}">Film 02 · What You Carry — CP2 · 0–12 s · 16:9 key beats</text>` + cap('Frames pulled from ACTIQO_WhatYouCarry_CP2_0-12s_16x9.mp4 (1920×1080, 30 fps)', 60, 116);
  BEATS.forEach(([t, l], i) => { const x = 60 + (i % 3) * (tw + 30), y = 150 + Math.floor(i / 3) * (th + 70); s += img(`${B}wide_${i}.png`, x, y, tw, th) + cap(`${t.toFixed(1)} s · ${l}`, x, y + th + 32); });
  await renderStill({ w: W, h: H, svg: s, out: O + 'CP2_contact_16x9.png' });
}
{ // 9:16 sheet: 5 + 5 (9 beats + clearance check)
  const tw = 432, th = 768, W = 60 * 2 + 5 * tw + 4 * 24, H = 170 + 2 * (th + 70);
  let s = `<rect width="${W}" height="${H}" fill="#FCFAF7"/><text x="60" y="76" font-family="Fraunces" font-weight="600" font-size="44" fill="${ink}">Film 02 · What You Carry — CP2 · 0–12 s · 9:16 key beats</text>` + cap('Frames pulled from ACTIQO_WhatYouCarry_CP2_0-12s_9x16.mp4 (1080×1920). Last tile: layout check, not a CP2 beat.', 60, 116);
  [...BEATS.map(([t, l], i) => [`${B}tall_${i}.png`, `${t.toFixed(1)} s · ${l}`]), [`${B}tall_clearance.png`, 'Lane check: Dad + Grandma on Mom’s path']].forEach(([p, l], i) => {
    const x = 60 + (i % 5) * (tw + 24), y = 150 + Math.floor(i / 5) * (th + 70); s += img(p, x, y, tw, th) + cap(l, x, y + th + 32, 19); });
  await renderStill({ w: W, h: H, svg: s, out: O + 'CP2_contact_9x16.png' });
}
console.log('ok');
