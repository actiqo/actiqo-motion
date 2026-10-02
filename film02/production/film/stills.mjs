// CP2 key-beat stills (and quick look-dev): node cp2/stills.mjs [wide|tall] [times...]
import { makeScene, FMT, STRINGS } from './scene.mjs';
import { setMetrics } from '../lib/world.mjs';
import { openStage } from '../lib/render.mjs';
import { writeFileSync, mkdirSync } from 'node:fs';
const fmt = process.argv[2] || 'wide';
const times = process.argv.slice(3).map(Number);
const f = FMT[fmt], OUT = new URL('./out/stills/', import.meta.url).pathname; mkdirSync(OUT, { recursive: true });
const st = await openStage(f.W, f.H);
setMetrics(await st.measure(STRINGS));
const frame = makeScene(fmt);
for (const t of times) writeFileSync(`${OUT}${fmt}_${t.toFixed(2)}.png`, await st.frame(frame(t)));
await st.close(); console.log('ok');
