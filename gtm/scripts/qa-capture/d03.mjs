// D03 "Practice Starts at Five": real-UI capture of the current ACTIQO leave-time flow against QA (temporary protected Vercel Preview).
// MODE=probe   headless: sign in as the D03 demo parent (Sam), dump the Game Plan, open the leave-time sheet, dump it, Cancel (no write).
// MODE=record  headed on Xvfb (run via d03-record.sh): Game Plan → tap leave action → Manual sheet (Preview: Leave by 4:30 PM) →
//              Save leave time → wait for the toast to clear → settled Game Plan "Leave by 4:30 PM · Fixed leave time".
//              1080×1920 @30 fps lossless (ffmpeg x11grab), stills, beat marks, toast on/off marks. Same QA-only routing + exposure scan.
// Reset is fixture-only SQL on the D03 activity row (documented in ui/CAPTURE_RECORD.md), never in this script.
// Env: D03_BASE, D03_BYPASS, D03_SCAN_SECRETS, D03_RUNTIME (default /tmp/d03-runtime, holds d03-demo-creds.env; never committed), D03_DATE.
import { createRequire } from 'node:module';
import { readFileSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { attach } from './exposure.mjs';
const require = createRequire('/workspaces/actiqo-motion/film02/production/package.json');
const { chromium } = require('playwright-core');

const MODE = process.env.MODE ?? 'probe';
const S = process.env.D03_RUNTIME ?? '/tmp/d03-runtime';
const BASE = (process.env.D03_BASE ?? '').replace(/\/$/, ''); if (!BASE) throw new Error('D03_BASE required');
const QA_HOST = 'oqoqmzjldpefchegfqry.supabase.co';
const ACTIVITY = 'd03de000-0000-4000-8000-0000000000ac';
const TZ = 'Pacific/Honolulu'; // household clock: Saturday morning local, so "Today 5:00 PM" is upcoming and well before 4:30
const DATE = process.env.D03_DATE ?? new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(new Date());
const GP = `/dashboard/game-plan?activity=${ACTIVITY}&date=${DATE}`;
const PW = readFileSync(`${S}/d03-demo-creds.env`, 'utf8').match(/D03_PW=(.*)/)[1].trim();
const OUT = `${S}/rec`; mkdirSync(OUT, { recursive: true });
const log = (...a) => console.log(new Date().toISOString().slice(11, 23), ...a);
process.env.D01_SCAN_SECRETS = process.env.D03_SCAN_SECRETS ?? ''; // exposure.mjs reads this name

const headed = MODE === 'record';
const DISPLAY = process.env.DISPLAY ?? ':99';
const browser = await chromium.launch({ headless: !headed, executablePath: '/usr/bin/google-chrome', ...(headed ? { env: { ...process.env, DISPLAY } } : {}),
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-extensions', '--disable-background-networking', '--disable-component-update', '--hide-scrollbars',
    ...(headed ? ['--kiosk', '--force-device-scale-factor=2.5', '--window-position=0,0', '--window-size=432,768', '--disable-infobars', '--no-first-run',
      '--no-default-browser-check', '--disable-features=Translate,MediaRouter,OptimizationHints', '--password-store=basic'] : [])] });
const ctx = await browser.newContext({ viewport: { width: 432, height: 768 }, deviceScaleFactor: 2.5, isMobile: true, hasTouch: true, timezoneId: TZ, locale: 'en-US',
  userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36' });
ctx.setDefaultTimeout(60000); ctx.setDefaultNavigationTimeout(90000);
const baseHost = new URL(BASE).host; const blocked = [];
await ctx.route((u) => u.host !== baseHost && u.host !== QA_HOST && !u.protocol.startsWith('data') && !u.protocol.startsWith('blob'), (r) => { blocked.push(new URL(r.request().url()).host); return r.abort(); });
await ctx.addInitScript(() => { const add = () => { const st = document.createElement('style'); st.textContent = 'nextjs-portal,vercel-live-feedback{display:none!important}'; document.head.appendChild(st); }; if (document.head) add(); else document.addEventListener('DOMContentLoaded', add); });
const scan = attach(ctx, { qaHost: QA_HOST });
const page = await ctx.newPage();
const writes = [];
page.on('response', async (r) => { const u = r.url(); const m = r.request().method(); if (m !== 'GET' && m !== 'OPTIONS' && new URL(u).host === baseHost && u.includes('/api/')) writes.push({ m, path: new URL(u).pathname, status: r.status(), body: (await r.text().catch(() => '')).slice(0, 200) }); });

if (headed) {
  const c = await ctx.newCDPSession(page); const { windowId } = await c.send('Browser.getWindowForTarget');
  await c.send('Browser.setWindowBounds', { windowId, bounds: { windowState: 'fullscreen' } }); await page.waitForTimeout(800);
  const v = await page.evaluate(() => ({ ow: outerWidth, oh: outerHeight, dpr: devicePixelRatio }));
  if (v.ow !== 432 || v.oh !== 768 || v.dpr !== 2.5) { console.log('ABORT: emulated viewport is not 432×768 @2.5', JSON.stringify(v)); await browser.close(); process.exit(2); }
}

await page.goto(`${BASE}/login?x-vercel-protection-bypass=${encodeURIComponent(process.env.D03_BYPASS ?? '')}&x-vercel-set-bypass-cookie=true`, { waitUntil: 'load' });
await page.goto(BASE + '/login?next=' + encodeURIComponent(GP), { waitUntil: 'load' });
await page.fill('input[type=email]', 'd03-demo-parent@example.com'); await page.fill('input[type=password]', PW); await page.keyboard.press('Enter');
await page.waitForURL((u) => !u.pathname.startsWith('/login'), { timeout: 90000 });
await page.waitForTimeout(2500);
if (await page.getByText('Review and accept to continue').count()) {
  log('consent gate shown → accepting through the real UI');
  const boxes = page.locator('input[type=checkbox], [role=checkbox]'); const n = await boxes.count();
  for (let i = 0; i < n; i++) await boxes.nth(i).check({ force: true }).catch(() => boxes.nth(i).click());
  await page.getByRole('button', { name: 'Accept and continue' }).click(); await page.waitForTimeout(4000);
}
if (!page.url().includes('game-plan')) await page.goto(BASE + GP, { waitUntil: 'load' });
const leaveCard = page.getByTestId('gp-leave-card').first();
await leaveCard.waitFor(); await page.waitForTimeout(2500);
await scan.page(page, `gameplan-${MODE}`);

const dump = async (label) => {
  const names = await page.evaluate(() => [...document.querySelectorAll('button,[role=button],[role=radio],[role=switch],a,input')].filter((e) => e.offsetParent !== null)
    .map((e) => `${e.tagName.toLowerCase()}${e.getAttribute('role') ? '[' + e.getAttribute('role') + ']' : ''}: ${(e.getAttribute('aria-label') || e.innerText || e.getAttribute('placeholder') || e.value || '').replace(/\s+/g, ' ').trim().slice(0, 90)}${e.getAttribute('aria-checked') ? ' (checked=' + e.getAttribute('aria-checked') + ')' : ''}`));
  writeFileSync(`${OUT}/${label}.txt`, (await page.evaluate(() => document.body.innerText)) + '\n---\n' + names.join('\n'));
  await page.screenshot({ path: `${OUT}/${label}.png` }); log('dumped', label);
};
const leaveAction = () => leaveCard.getByRole('button').first();
const sheet = () => page.getByRole('dialog').filter({ hasText: 'Leave time' }).first();
const toastLoc = () => page.locator('[role=status],[role=alert],[data-sonner-toast],[data-testid*=toast i]').filter({ hasText: /reminder/i });

if (MODE === 'probe') {
  await dump('probe-01-gameplan');
  log('leave card text:', JSON.stringify(await leaveCard.innerText()));
  await leaveAction().tap(); await page.getByText(/Preview: Leave by|Leave at/).first().waitFor(); await page.waitForTimeout(2000);
  await dump('probe-02-sheet');
  const cancel = page.getByRole('button', { name: /^Cancel$/ }).first(); await cancel.tap(); await page.waitForTimeout(1500);
  await dump('probe-03-after-cancel');
}

if (MODE === 'record') {
  rmSync(`${OUT}/d03_ui_flow_source.mkv`, { force: true });
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'x11grab', '-draw_mouse', '0', '-framerate', '30', '-video_size', '1080x1920', '-i', `${DISPLAY}.0+0,0`,
    '-c:v', 'libx264rgb', '-preset', 'ultrafast', '-qp', '0', '-pix_fmt', 'bgr0', `${OUT}/d03_ui_flow_source.mkv`], { stdio: ['pipe', 'inherit', 'inherit'] });
  const REC0 = Date.now() / 1000; await page.waitForTimeout(800);
  const marks = {}; const mark = (k) => { marks[k] = +(Date.now() / 1000 - REC0).toFixed(3); log('mark', k, marks[k]); };
  const still = async (n) => { await page.screenshot({ path: `${OUT}/${n}.png` }); log('still', n); };
  const hold = (ms) => page.waitForTimeout(ms);
  mark('gameplan'); await hold(2800); await still('d03_leave_before');
  mark('leaveTap'); await leaveAction().tap();
  await page.getByText(/Preview: Leave by 4:30 PM/).first().waitFor(); mark('sheetOpen'); await hold(3600); await still('d03_leave_sheet');
  const save = page.getByRole('button', { name: /^Save leave time$/ }).first();
  const resp = page.waitForResponse((r) => /\/api\/activities\/[^/]+\/leave-default/.test(r.url()) && r.request().method() === 'PUT', { timeout: 30000 });
  mark('saveTap'); await save.tap(); const rr = await resp; mark('saveResponse'); log('leave-default', rr.status());
  await page.getByText(/^Leave by 4:30 PM$/).first().waitFor({ timeout: 30000 }); mark('savedRowVisible');
  // the post-save warning toast: record when it shows and when it is fully gone; the edit only uses frames after toastGone
  const t0 = Date.now(); let seen = false;
  while (Date.now() - t0 < 15000) { const n = await toastLoc().count(); const vis = n ? await toastLoc().first().isVisible().catch(() => false) : false;
    if (vis && !seen) { seen = true; mark('toastOn'); } if (seen && !vis) { mark('toastGone'); break; } await hold(100); }
  if (!seen) mark('toastNeverSeen');
  await hold(4000); await still('d03_leave_saved'); mark('end');
  ff.stdin.write('q'); await new Promise((ok) => ff.on('close', ok));
  writeFileSync(`${OUT}/marks.json`, JSON.stringify({ marks, writes, date: DATE, tz: TZ }, null, 1));
  await dump('record-final');
}

writeFileSync(`${OUT}/writes-${MODE}.json`, JSON.stringify(writes, null, 1));
log('writes', JSON.stringify(writes.map((w) => `${w.m} ${w.path} ${w.status}`)));
console.log('EXPOSURE', JSON.stringify(await scan.report()));
console.log('blocked third-party hosts:', [...new Set(blocked)].join(', ') || 'none');
await browser.close();
