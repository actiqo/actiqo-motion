// CP5 contact sheets (A–I), frames pulled from the rendered MP4s.
import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { renderStill } from '../lib/render.mjs';
const O = new URL('./out/', import.meta.url).pathname, B = O + 'beats5/'; mkdirSync(B, { recursive: true });
const BEATS = [[26.0, 'A · 26.0 resolved, held'], [26.5, 'B · 26.5 links let go'], [26.75, 'C · 26.75 first free step'], [27.0, 'D · 27.0 Grandma heads to 6:30'], [27.3, 'E · 27.3 the plan recedes'], [27.6, 'F · 27.6 the world quiets'], [28.2, 'G · 28.2 ACTIQO'], [28.8, 'H · 28.8 the lines'], [29.967, 'I · 30.0 final frame (held)']];
const VID = { wide: 'ACTIQO_WhatYouCarry_CP5_26-30s_16x9.mp4', tall: 'ACTIQO_WhatYouCarry_CP5_26-30s_9x16.mp4' };
for (const fmt of ['wide', 'tall']) BEATS.forEach(([t], i) => execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', O + VID[fmt], '-vf', `select=eq(n\\,${Math.min(119, Math.round((t - 26) * 30))})`, '-frames:v', '1', `${B}${fmt}_${i}.png`]));
const ink = '#0B1F3B';
const cap = (t, x, y, sz = 22) => `<text x="${x}" y="${y}" font-family="Inter" font-weight="500" font-size="${sz}" fill="${ink}" fill-opacity=".75">${t}</text>`;
const img = (p, x, y, w, h) => `<image href="file://${p}" x="${x}" y="${y}" width="${w}" height="${h}"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${ink}" stroke-opacity=".14"/>`;
{ const tw = 760, th = 428, W = 120 + 3 * tw + 60, H = 170 + 3 * (th + 70);
  let s = `<rect width="${W}" height="${H}" fill="#FCFAF7"/><text x="60" y="76" font-family="Fraunces" font-weight="600" font-size="44" fill="${ink}">Film 02 · What You Carry — CP5 · 26–30 s · 16:9</text>` + cap('Frames pulled from ACTIQO_WhatYouCarry_CP5_26-30s_16x9.mp4 (1920×1080, 30 fps). I = last frame (29.97 s); the final 24 frames are pixel-identical.', 60, 116);
  BEATS.forEach(([, l], i) => { const x = 60 + (i % 3) * (tw + 30), y = 150 + Math.floor(i / 3) * (th + 70); s += img(`${B}wide_${i}.png`, x, y, tw, th) + cap(l, x, y + th + 32); });
  await renderStill({ w: W, h: H, svg: s, out: O + 'CP5_contact_16x9.png' }); }
{ const tw = 400, th = 711, W = 120 + 5 * tw + 4 * 24, H = 170 + 2 * (th + 70);
  let s = `<rect width="${W}" height="${H}" fill="#FCFAF7"/><text x="60" y="76" font-family="Fraunces" font-weight="600" font-size="44" fill="${ink}">Film 02 · What You Carry — CP5 · 26–30 s · 9:16</text>` + cap('Frames pulled from ACTIQO_WhatYouCarry_CP5_26-30s_9x16.mp4 (1080×1920).', 60, 116);
  BEATS.forEach(([, l], i) => { const x = 60 + (i % 5) * (tw + 24), y = 150 + Math.floor(i / 5) * (th + 70); s += img(`${B}tall_${i}.png`, x, y, tw, th) + cap(l, x, y + th + 30, 17); });
  await renderStill({ w: W, h: H, svg: s, out: O + 'CP5_contact_9x16.png' }); }
console.log('ok');
