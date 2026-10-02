// CP4 contact sheets (A–I), frames pulled from the rendered MP4s.
import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { renderStill } from '../lib/render.mjs';
const O = new URL('./out/', import.meta.url).pathname, B = O + 'beats4/'; mkdirSync(B, { recursive: true });
const BEATS = [[20.0, 'A · 20.0 the plan, Dad on drop-off'], [22.6, 'B · 22.6 Who’s doing what (tap)'], [23.2, 'C · 23.2 Assignments: No one on pickup'], [23.6, 'D · 23.6 Assign (tap)'], [24.2, 'E · 24.2 Grandma walks in'], [24.9, 'F · 24.9 Grandma takes the thread'], [25.5, 'G · 25.5 Grandma pickup · At 6:30 PM'], [25.8, 'H · 25.8 the phone goes away'], [25.967, 'I · 26.0 free hands']];
const VID = { wide: 'ACTIQO_WhatYouCarry_CP4_20-26s_16x9.mp4', tall: 'ACTIQO_WhatYouCarry_CP4_20-26s_9x16.mp4' };
for (const fmt of ['wide', 'tall']) BEATS.forEach(([t], i) => execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', O + VID[fmt], '-vf', `select=eq(n\\,${Math.min(179, Math.round((t - 20) * 30))})`, '-frames:v', '1', `${B}${fmt}_${i}.png`]));
const ink = '#0B1F3B';
const cap = (t, x, y, sz = 22) => `<text x="${x}" y="${y}" font-family="Inter" font-weight="500" font-size="${sz}" fill="${ink}" fill-opacity=".75">${t}</text>`;
const img = (p, x, y, w, h) => `<image href="file://${p}" x="${x}" y="${y}" width="${w}" height="${h}"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${ink}" stroke-opacity=".14"/>`;
{ const tw = 760, th = 428, W = 120 + 3 * tw + 60, H = 170 + 3 * (th + 70);
  let s = `<rect width="${W}" height="${H}" fill="#FCFAF7"/><text x="60" y="76" font-family="Fraunces" font-weight="600" font-size="44" fill="${ink}">Film 02 · What You Carry — CP4 · 20–26 s · 16:9</text>` + cap('Frames pulled from ACTIQO_WhatYouCarry_CP4_20-26s_16x9.mp4 (1920×1080, 30 fps). I = last frame (25.97 s).', 60, 116);
  BEATS.forEach(([, l], i) => { const x = 60 + (i % 3) * (tw + 30), y = 150 + Math.floor(i / 3) * (th + 70); s += img(`${B}wide_${i}.png`, x, y, tw, th) + cap(l, x, y + th + 32); });
  await renderStill({ w: W, h: H, svg: s, out: O + 'CP4_contact_16x9.png' }); }
{ const tw = 400, th = 711, W = 120 + 5 * tw + 4 * 24, H = 170 + 2 * (th + 70);
  let s = `<rect width="${W}" height="${H}" fill="#FCFAF7"/><text x="60" y="76" font-family="Fraunces" font-weight="600" font-size="44" fill="${ink}">Film 02 · What You Carry — CP4 · 20–26 s · 9:16</text>` + cap('Frames pulled from ACTIQO_WhatYouCarry_CP4_20-26s_9x16.mp4 (1080×1920).', 60, 116);
  BEATS.forEach(([, l], i) => { const x = 60 + (i % 5) * (tw + 24), y = 150 + Math.floor(i / 5) * (th + 70); s += img(`${B}tall_${i}.png`, x, y, tw, th) + cap(l, x, y + th + 30, 17); });
  await renderStill({ w: W, h: H, svg: s, out: O + 'CP4_contact_9x16.png' }); }
console.log('ok');
