// CP3 contact sheets (A–I), frames pulled from the rendered MP4s.
import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { renderStill } from '../lib/render.mjs';
const O = new URL('./out/', import.meta.url).pathname, B = O + 'beats3/'; mkdirSync(B, { recursive: true });
const BEATS = [[12.0, 'A · 12.0 held state'], [12.6, 'B · 12.6 alignment'], [13.2, 'C · fold ~13.2'], [14.0, 'D · fold ~14.0'], [15.0, 'E · Game Plan recognized ~15.0'],
  [16.2, 'F · information registered ~16.2'], [17.8, 'G · cleats put-down ~17.8'], [19.0, 'H · Dad handoff ~19.0'], [19.967, 'I · Dad drop-off acknowledged ~20.0']];
const VID = { wide: 'ACTIQO_WhatYouCarry_CP3_12-20s_16x9.mp4', tall: 'ACTIQO_WhatYouCarry_CP3_12-20s_9x16.mp4' };
for (const fmt of ['wide', 'tall']) BEATS.forEach(([t], i) => execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', O + VID[fmt], '-vf', `select=eq(n\\,${Math.min(239, Math.round((t - 12) * 30))})`, '-frames:v', '1', `${B}${fmt}_${i}.png`]));
const ink = '#0B1F3B';
const cap = (t, x, y, sz = 22) => `<text x="${x}" y="${y}" font-family="Inter" font-weight="500" font-size="${sz}" fill="${ink}" fill-opacity=".75">${t}</text>`;
const img = (p, x, y, w, h) => `<image href="file://${p}" x="${x}" y="${y}" width="${w}" height="${h}"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${ink}" stroke-opacity=".14"/>`;
{ const tw = 760, th = 428, W = 120 + 3 * tw + 60, H = 170 + 3 * (th + 70);
  let s = `<rect width="${W}" height="${H}" fill="#FCFAF7"/><text x="60" y="76" font-family="Fraunces" font-weight="600" font-size="44" fill="${ink}">Film 02 · What You Carry — CP3 · 12–20 s · 16:9</text>` + cap('Frames pulled from ACTIQO_WhatYouCarry_CP3_12-20s_16x9.mp4 (1920×1080, 30 fps). I = last frame (19.97 s).', 60, 116);
  BEATS.forEach(([, l], i) => { const x = 60 + (i % 3) * (tw + 30), y = 150 + Math.floor(i / 3) * (th + 70); s += img(`${B}wide_${i}.png`, x, y, tw, th) + cap(l, x, y + th + 32); });
  await renderStill({ w: W, h: H, svg: s, out: O + 'CP3_contact_16x9.png' }); }
{ const tw = 400, th = 711, W = 120 + 5 * tw + 4 * 24, H = 170 + 2 * (th + 70);
  let s = `<rect width="${W}" height="${H}" fill="#FCFAF7"/><text x="60" y="76" font-family="Fraunces" font-weight="600" font-size="44" fill="${ink}">Film 02 · What You Carry — CP3 · 12–20 s · 9:16</text>` + cap('Frames pulled from ACTIQO_WhatYouCarry_CP3_12-20s_9x16.mp4 (1080×1920).', 60, 116);
  BEATS.forEach(([, l], i) => { const x = 60 + (i % 5) * (tw + 24), y = 150 + Math.floor(i / 5) * (th + 70); s += img(`${B}tall_${i}.png`, x, y, tw, th) + cap(l, x, y + th + 30, 17); });
  await renderStill({ w: W, h: H, svg: s, out: O + 'CP3_contact_9x16.png' }); }
console.log('ok');
