// CP4 render (20.0–26.0 s of the shared Film 02 timeline): node cp4/render.mjs <wide|tall> <name>
import { makeScene, FMT, STRINGS } from '../film/scene.mjs';
import { setMetrics } from '../lib/world.mjs';
import { renderVideo } from '../lib/render.mjs';
const [fmt, name] = process.argv.slice(2); const f = FMT[fmt], s0 = 600, n = 180;
const frame = makeScene(fmt);
await renderVideo({ w: f.W, h: f.H, n, out: new URL('./out/' + name, import.meta.url).pathname, before: async (st) => setMetrics(await st.measure(STRINGS)), frame: (i) => frame((s0 + i) / 30) });
console.log('done', name);
