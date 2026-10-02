// CP2 render: node cp2/render.mjs [wide|tall]  → 0–12 s (frames 0–359) at 30 fps
import { makeScene, FMT, STRINGS } from './scene.mjs';
import { setMetrics } from '../lib/world.mjs';
import { renderVideo } from '../lib/render.mjs';
const fmt = process.argv[2] || 'wide', f = FMT[fmt];
const frame = makeScene(fmt);
const name = fmt === 'wide' ? 'ACTIQO_WhatYouCarry_CP2_0-12s_16x9.mp4' : 'ACTIQO_WhatYouCarry_CP2_0-12s_9x16.mp4';
await renderVideo({ w: f.W, h: f.H, n: 360, out: new URL('./out/' + name, import.meta.url).pathname, before: async (st) => setMetrics(await st.measure(STRINGS)), frame: (i) => frame(i / 30) });
console.log('done', name);
