// Film render: node film/render.mjs <wide|tall> <startFrame> <endFrameExclusive> <name>
import { makeScene, FMT, STRINGS } from './scene.mjs';
import { setMetrics } from '../lib/world.mjs';
import { renderVideo } from '../lib/render.mjs';
const [fmt, a, b, name] = process.argv.slice(2); const f = FMT[fmt], s0 = +a, n = +b - s0;
const frame = makeScene(fmt);
await renderVideo({ w: f.W, h: f.H, n, out: new URL('./out/' + name, import.meta.url).pathname, before: async (st) => setMetrics(await st.measure(STRINGS)), frame: (i) => frame((s0 + i) / 30), holdLast: +b === 900 ? 24 : 0 });
console.log('done', name);
