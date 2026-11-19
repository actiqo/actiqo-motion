// D01 capture, headed: real Chrome (kiosk, forced DSF 2.5 → 432×768 CSS layout on a 1080×1920 X display) recorded by
// ffmpeg x11grab at 30 fps, lossless (libx264rgb -qp 0). Same real flow and the same QA-only routing/exposure scan as
// record.mjs. Run inside: Xvfb :99 -screen 0 1080x1920x24 (see record.sh).
import { chromium, BASE, GP, S, QA_HOST } from './lib.mjs';
import { attach } from './exposure.mjs';
import { mkdirSync, writeFileSync, rmSync, readFileSync } from 'node:fs';
import { spawn } from 'node:child_process';

const OUT = `${S}/rec`; rmSync(OUT, { recursive: true, force: true }); mkdirSync(OUT, { recursive: true });
const DISPLAY = process.env.DISPLAY ?? ':99';
const log = (...a) => console.log(new Date().toISOString().slice(11, 23), ...a);
const browser = await chromium.launch({ headless: false, executablePath: '/usr/bin/google-chrome', env: { ...process.env, DISPLAY },
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--kiosk', '--force-device-scale-factor=2.5', '--window-position=0,0', '--window-size=432,768', '--hide-scrollbars',
    '--disable-extensions', '--disable-background-networking', '--disable-component-update', '--disable-infobars', '--no-first-run', '--no-default-browser-check',
    '--disable-features=Translate,MediaRouter,OptimizationHints', '--password-store=basic'] });
const ctx = await browser.newContext({ viewport: { width: 432, height: 768 }, deviceScaleFactor: 2.5, isMobile: true, hasTouch: true, timezoneId: 'America/Chicago', locale: 'en-US',
  userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36' });
ctx.setDefaultTimeout(60000); ctx.setDefaultNavigationTimeout(90000);
const baseHost = new URL(BASE).host; const blocked = [];
await ctx.route((u) => u.host !== baseHost && u.host !== QA_HOST && !u.protocol.startsWith('data') && !u.protocol.startsWith('blob'), (r) => { blocked.push(new URL(r.request().url()).host); return r.abort(); });
await ctx.addInitScript(() => { const add = () => { const st = document.createElement('style'); st.textContent = 'nextjs-portal,vercel-live-feedback{display:none!important}'; document.head.appendChild(st); }; if (document.head) add(); else document.addEventListener('DOMContentLoaded', add); });
const scan = attach(ctx, { qaHost: QA_HOST });
const page = await ctx.newPage();
// fullscreen window (no tab strip / address bar) on a 1280×1920 display; device emulation draws the 432×768 @2.5 phone
// viewport into the top-left 1080×1920 px, which is exactly what ffmpeg grabs (Chrome's minimum window width is 500 DIP)
{ const c = await ctx.newCDPSession(page); const { windowId } = await c.send('Browser.getWindowForTarget');
  await c.send('Browser.setWindowBounds', { windowId, bounds: { windowState: 'fullscreen' } }); await page.waitForTimeout(800); }
{ const v = await page.evaluate(() => ({ w: innerWidth, h: innerHeight, ow: outerWidth, oh: outerHeight, dpr: devicePixelRatio }));
  console.log('window', JSON.stringify(v));
  if (v.ow !== 432 || v.oh !== 768 || v.dpr !== 2.5) { console.log('ABORT: emulated viewport is not 432×768 @2.5 — nothing recorded, nothing saved'); await browser.close(); process.exit(2); } }
const saves = [];
page.on('response', async (r) => { if (r.url().includes('/api/family-sync/config/save')) saves.push({ status: r.status(), body: (await r.text().catch(() => '')).slice(0, 200) }); });

// sign in as Jordan (bypass cookie for the protected preview first)
const PW = readFileSync(`${S}/d01-demo-creds.env`, 'utf8').match(/D01_PW=(.*)/)[1].trim();
if (process.env.D01_BYPASS) await page.goto(`${BASE}/login?x-vercel-protection-bypass=${encodeURIComponent(process.env.D01_BYPASS)}&x-vercel-set-bypass-cookie=true`, { waitUntil: 'load' });
await page.goto(BASE + '/login?next=' + encodeURIComponent(GP), { waitUntil: 'load' });
await page.fill('input[type=email]', 'd01-demo-jordan@example.com'); await page.fill('input[type=password]', PW); await page.keyboard.press('Enter');
await page.waitForURL((u) => !u.pathname.startsWith('/login'), { timeout: 90000 });
if (!page.url().includes('game-plan')) await page.goto(BASE + GP, { waitUntil: 'load' });
await page.getByText('Pickup · needs someone').first().waitFor();
const vp = await page.evaluate(() => ({ w: innerWidth, h: innerHeight, dpr: devicePixelRatio }));
log('layout', JSON.stringify(vp));
if (vp.w !== 432 || vp.h !== 768 || vp.dpr !== 2.5) { console.log('ABORT before recording: layout drifted'); await browser.close(); process.exit(2); }
await page.waitForTimeout(3000);
await scan.page(page, 'gameplan-before');

// ── start recording the display ──
const src = `${OUT}/d01_ui_flow_source.mkv`;
const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'x11grab', '-draw_mouse', '0', '-framerate', '30', '-video_size', '1080x1920', '-i', `${DISPLAY}.0+0,0`,
  '-c:v', 'libx264rgb', '-preset', 'ultrafast', '-qp', '0', '-pix_fmt', 'bgr0', src], { stdio: ['pipe', 'inherit', 'inherit'] });
const REC0 = Date.now() / 1000;
await page.waitForTimeout(800);
const marks = {}; const mark = (k) => { marks[k] = +(Date.now() / 1000 - REC0).toFixed(3); log('mark', k, marks[k]); };
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
await tap(page.getByRole('button', { name: 'Save assignments' }), 'saveTap');
await page.waitForResponse((r) => r.url().includes('/api/family-sync/config/save'), { timeout: 30000 });
await hold(2500);
mark('savedAssignments'); await still('d01_pickup_saved_assignments'); await hold(1500);
const toGp = page.getByRole('button', { name: 'Back to Game Plan' });
if (await toGp.isVisible().catch(() => false)) { await tap(toGp, 'backToGamePlan'); await hold(2500); }
mark('saved'); await still('d01_pickup_saved'); await hold(3500);
mark('end');
ff.stdin.write('q'); await new Promise((ok) => ff.on('close', ok));

await scan.page(page, 'gameplan-after');
writeFileSync(`${OUT}/final_text.txt`, await page.evaluate(() => document.body.innerText));
writeFileSync(`${OUT}/marks.json`, JSON.stringify({ layout: vp, marks, saves }, null, 1));
log('save responses', JSON.stringify(saves));
console.log('EXPOSURE', JSON.stringify(await scan.report()));
console.log('blocked third-party hosts:', [...new Set(blocked)].join(', ') || 'none');
await browser.close();
