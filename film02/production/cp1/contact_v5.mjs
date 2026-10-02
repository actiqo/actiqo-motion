// Review V5 contact sheet: the seven requested views on one page.
import { renderStill } from '../lib/render.mjs';
const R = new URL('./review_v5/', import.meta.url).pathname;
const W = 2600, H = 1960, ink = '#0B1F3B';
const img = (f, x, y, w, h) => `<image href="file://${R}${f}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid meet"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${ink}" stroke-opacity=".12"/>`;
const cap = (t, x, y, sz = 21) => `<text x="${x}" y="${y}" font-family="Inter" font-weight="500" font-size="${sz}" fill="${ink}" fill-opacity=".72">${t}</text>`;
let s = `<rect width="${W}" height="${H}" fill="#FCFAF7"/>`;
s += `<text x="60" y="78" font-family="Fraunces" font-weight="600" font-size="44" fill="${ink}">Film 02 · What You Carry — character review V5</text>`;
s += cap('Art refinement only: hands, faces, Grandma’s hair, phone + cleats. Rig, gait, proportions, wardrobe colours, load system unchanged.', 60, 116);
s += cap('Rows 1–5: largest on-screen scale (9:16 foreground, 110 px head), shown as a 2× render of the crop; native 1:1 crops are in review_v5/*_native.png.', 60, 146);
const top = [['1_mom_face_2x.png', '1 · Mom face (loaded)'], ['2_phone_hand_2x.png', '2 · Phone hand'], ['3_cleats_hand_2x.png', '3 · Cleats hand'], ['4_dad_face_2x.png', '4 · Dad face'], ['5_grandma_face_2x.png', '5 · Grandma face']];
const tw = 476, gx = 20, y0 = 180;
top.forEach(([f, t], i) => { const x = 60 + i * (tw + gx); s += img(f, x, y0, tw, tw) + cap(t, x, y0 + tw + 32); });
const y1 = y0 + tw + 70, w6 = 1600, h6 = 900;
s += img('6_mom_loaded_16x9.png', 60, y1, w6, h6) + cap('6 · Mom loaded — full frame (16:9)', 60, y1 + h6 + 32);
const h7 = h6 + 120, w7 = Math.round(h7 * 9 / 16);
s += img('7_family_9x16.png', 60 + w6 + 40, y1, w7, h7) + cap('7 · Family frame (9:16)', 60 + w6 + 40, y1 + h7 + 32);
await renderStill({ w: W, h: H + 120, svg: s, out: R + '00_REVIEW_V5_contact_sheet.png', scale: 1 });
console.log('ok');
