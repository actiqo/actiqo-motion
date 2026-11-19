// D01 automated capture of the REAL current UI (no redraw): Game Plan → Who's doing what → Assignments → Assign → Pickup
// → Alex → Save assignments → saved state. Records Chrome's screencast at 1080×1920 device pixels (432×768 CSS × 2.5).
// The reset back to "Not assigned" is reset.mjs (same real editor), run after the saved state is verified in QA.
// Writes frames + stills into $D01_RUNTIME/rec/ ; encoding/copying into the repo is done by encode.sh.
import { open, login, BASE, GP, S, QA_HOST } from './lib.mjs';
import { attach } from './exposure.mjs';
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';

const OUT = `${S}/rec`; rmSync(OUT, { recursive: true, force: true }); mkdirSync(`${OUT}/frames`, { recursive: true });
const { browser, ctx, page, blocked } = await open();
const scan = attach(ctx, { qaHost: QA_HOST });
const log = (...a) => console.log(new Date().toISOString().slice(11, 23), ...a);
const saves = [];
page.on('response', async (r) => { if (r.url().includes('/api/family-sync/config/save')) saves.push({ status: r.status(), body: (await r.text().catch(() => '')).slice(0, 300) }); });

await login(page);
if (!page.url().includes('game-plan')) await page.goto(BASE + GP, { waitUntil: 'load' });
await page.getByText('Pickup · needs someone').first().waitFor();
await page.waitForTimeout(2500); // let fonts, icons and data settle before the first frame
await scan.page(page, 'gameplan-before');

// ── Chrome screencast at device pixels (1080×1920): JPEG q100, ack first so Chrome keeps streaming ──
const cdp = await ctx.newCDPSession(page);
const frames = []; let idx = 0;
cdp.on('Page.screencastFrame', (f) => {
  cdp.send('Page.screencastFrameAck', { sessionId: f.sessionId }).catch(() => {});
  const file = `${OUT}/frames/${String(idx++).padStart(5, '0')}.jpg`;
  writeFileSync(file, Buffer.from(f.data, 'base64')); frames.push({ file, t: f.metadata.timestamp });
});
await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 100, maxWidth: 1080, maxHeight: 1920, everyNthFrame: 1 });
const T1 = Date.now() / 1000;
const marks = {}; const mark = (k) => { marks[k] = +(Date.now() / 1000).toFixed(3); log('mark', k, marks[k]); };
const still = async (name) => { await page.screenshot({ path: `${OUT}/${name}.png` }); log('still', name); };
const tap = async (loc, k) => { await loc.waitFor(); mark(k); await loc.tap(); };
const hold = (ms) => page.waitForTimeout(ms);

mark('start'); await hold(2500);
mark('unresolved'); await still('d01_pickup_unresolved'); await hold(1500);
await tap(page.getByRole('button', { name: /Who.s doing what/ }), 'whoTap'); await hold(2200);
mark('assignments'); await hold(800);
await tap(page.getByRole('button', { name: /^Assign$/ }), 'assignTap'); await hold(2000);
await tap(page.getByRole('button', { name: /^Pickup, Not assigned$/ }), 'pickupRowTap');
await page.getByText('Who brings them home?').waitFor(); await hold(1500);
mark('picker'); await still('d01_pickup_picker'); await hold(1200);
await tap(page.getByRole('radio', { name: /Alex/ }), 'alexTap'); await hold(1600);
const back = page.getByRole('button', { name: 'Back to assignments' });
if (await back.isVisible().catch(() => false)) { await tap(back, 'backToEditor'); await hold(1500); }
const saveBtn = page.getByRole('button', { name: 'Save assignments' });
await tap(saveBtn, 'saveTap');
await page.waitForResponse((r) => r.url().includes('/api/family-sync/config/save'), { timeout: 30000 });
await hold(2500);
mark('savedAssignments'); await still('d01_pickup_saved_assignments'); await hold(1500);
const toGp = page.getByRole('button', { name: 'Back to Game Plan' });
if (await toGp.isVisible().catch(() => false)) { await tap(toGp, 'backToGamePlan'); await hold(2500); }
mark('saved'); await still('d01_pickup_saved'); await hold(3500);
mark('end');
await page.waitForTimeout(300);
await cdp.send('Page.stopScreencast');
await scan.page(page, 'gameplan-after');
const finalText = await page.evaluate(() => document.body.innerText);
writeFileSync(`${OUT}/final_text.txt`, finalText);
writeFileSync(`${OUT}/frames.json`, JSON.stringify({ frames, marks, saves }, null, 1));
log('frames', frames.length);
log('save responses', JSON.stringify(saves));

console.log('EXPOSURE', JSON.stringify(await scan.report()));
console.log('blocked third-party hosts:', [...new Set(blocked)].join(', ') || 'none');
await browser.close();
