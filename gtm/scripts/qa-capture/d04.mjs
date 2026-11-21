// D04 "Tasting Notes of Parenthood": real-UI capture of ONE ACTIQO Game Plan with pickup saved + What to bring populated + leave time saved.
// MODE=setup   headless: sign in as the D04 demo parent (Sam); add Water bottle / Cleats / Shin guards through the REAL Prep list editor;
//              save the Manual leave time through the REAL Leave time sheet ("Save leave time"). Dumps every step.
// MODE=record  headed on Xvfb (run via d04-record.sh): settled Game Plan hold → tap What to bring → prep list hold → back → Game Plan hold.
//              1080×1920 @30 fps lossless (ffmpeg x11grab), stills, beat marks. QA-only routing + exposure scan (as D01–D03).
// Env: D04_BASE, D04_BYPASS, D04_SCAN_SECRETS, D04_RUNTIME (default /tmp/d04-runtime, holds d04-demo-creds.env; never committed), D04_DATE.
import { createRequire } from 'node:module';
import { readFileSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { attach } from './exposure.mjs';
const require = createRequire('/workspaces/actiqo-motion/film02/production/package.json');
const { chromium } = require('playwright-core');

const MODE = process.env.MODE ?? 'setup';
const S = process.env.D04_RUNTIME ?? '/tmp/d04-runtime';
const BASE = (process.env.D04_BASE ?? '').replace(/\/$/, ''); if (!BASE) throw new Error('D04_BASE required');
const QA_HOST = 'oqoqmzjldpefchegfqry.supabase.co';
const ACTIVITY = 'd04de000-0000-4000-8000-0000000000ac';
const TZ = 'Pacific/Honolulu';
const DATE = process.env.D04_DATE ?? new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(new Date());
const GP = `/dashboard/game-plan?activity=${ACTIVITY}&date=${DATE}`;
const ITEMS = ['Water bottle', 'Cleats', 'Shin guards'];
const PW = readFileSync(`${S}/d04-demo-creds.env`, 'utf8').match(/D04_PW=(.*)/)[1].trim();
const OUT = `${S}/rec`; mkdirSync(OUT, { recursive: true });
const log = (...a) => console.log(new Date().toISOString().slice(11, 23), ...a);
process.env.D01_SCAN_SECRETS = process.env.D04_SCAN_SECRETS ?? '';

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
page.on('response', async (r) => { const u = r.url(); const m = r.request().method(); if (m !== 'GET' && m !== 'OPTIONS' && new URL(u).host === baseHost && u.includes('/api/')) writes.push({ m, path: new URL(u).pathname, status: r.status() }); });

if (headed) {
  const c = await ctx.newCDPSession(page); const { windowId } = await c.send('Browser.getWindowForTarget');
  await c.send('Browser.setWindowBounds', { windowId, bounds: { windowState: 'fullscreen' } }); await page.waitForTimeout(800);
  const v = await page.evaluate(() => ({ ow: outerWidth, oh: outerHeight, dpr: devicePixelRatio }));
  if (v.ow !== 432 || v.oh !== 768 || v.dpr !== 2.5) { console.log('ABORT: emulated viewport is not 432×768 @2.5', JSON.stringify(v)); await browser.close(); process.exit(2); }
}

await page.goto(`${BASE}/login?x-vercel-protection-bypass=${encodeURIComponent(process.env.D04_BYPASS ?? '')}&x-vercel-set-bypass-cookie=true`, { waitUntil: 'load' });
await page.goto(BASE + '/login?next=' + encodeURIComponent(GP), { waitUntil: 'load' });
await page.fill('input[type=email]', 'd04-demo-parent@example.com'); await page.fill('input[type=password]', PW); await page.keyboard.press('Enter');
await page.waitForURL((u) => !u.pathname.startsWith('/login'), { timeout: 90000 });
await page.waitForTimeout(2500);
if (await page.getByText('Review and accept to continue').count()) {
  log('consent gate shown → accepting through the real UI');
  const boxes = page.locator('input[type=checkbox], [role=checkbox]'); const n = await boxes.count();
  for (let i = 0; i < n; i++) await boxes.nth(i).check({ force: true }).catch(() => boxes.nth(i).click());
  await page.getByRole('button', { name: 'Accept and continue' }).click(); await page.waitForTimeout(4000);
}
const gotoGP = async () => { await page.goto(BASE + GP, { waitUntil: 'load' }); await page.getByTestId('gp-leave-card').first().waitFor(); await page.waitForTimeout(2500); };
if (!page.url().includes('game-plan')) await gotoGP(); else { await page.getByTestId('gp-leave-card').first().waitFor(); await page.waitForTimeout(2500); }
await scan.page(page, `gameplan-${MODE}`);

const dump = async (label) => {
  const names = await page.evaluate(() => [...document.querySelectorAll('button,[role=button],[role=checkbox],a,input')].filter((e) => e.offsetParent !== null)
    .map((e) => `${e.tagName.toLowerCase()}${e.getAttribute('role') ? '[' + e.getAttribute('role') + ']' : ''}: ${(e.getAttribute('aria-label') || e.innerText || e.getAttribute('placeholder') || '').replace(/\s+/g, ' ').trim().slice(0, 90)}`));
  writeFileSync(`${OUT}/${label}.txt`, (await page.evaluate(() => document.body.innerText)) + '\n---\n' + names.join('\n'));
  await page.screenshot({ path: `${OUT}/${label}.png` }); log('dumped', label);
};
const openPrep = async () => { await page.getByRole('button', { name: /What to bring/ }).first().tap(); await page.getByText(/items? to pack|packed|Prep complete|No prep items yet|Build the prep list/).first().waitFor(); await page.waitForTimeout(1500); };

if (MODE === 'setup') {
  await dump('setup-01-gameplan');
  // 1) prep items through the REAL Prep list editor (as D02)
  await openPrep(); await dump('setup-02-prep');
  const add = page.getByRole('button', { name: /^(Add items|Edit|Add or edit items|Set up|Build the prep list)$/ }).first(); await add.tap();
  const input = page.getByPlaceholder(/Add item/); await input.waitFor();
  const have = await page.evaluate(() => document.body.innerText);
  for (const it of ITEMS) { if (have.includes(it)) { log('already present:', it); continue; } const resp = page.waitForResponse((r) => r.url().includes('/api/family-sync/checklist') && r.request().method() === 'POST', { timeout: 30000 }); await input.fill(it); await input.press('Enter'); const rr = await resp; await page.waitForTimeout(1200); log('added via real editor:', it, rr.status()); }
  await dump('setup-03-editor');
  await page.getByRole('button', { name: /^Close$/ }).first().tap(); await page.waitForTimeout(1500);
  // 2) leave time through the REAL Leave time sheet (Manual default; suggestion = saved 20 min drive + 10 min buffer)
  await gotoGP();
  await page.getByTestId('gp-leave-card').first().getByRole('button').first().tap();
  await page.getByText(/Preview: Leave by/).first().waitFor(); await page.waitForTimeout(1500); await dump('setup-04-leave-sheet');
  const resp = page.waitForResponse((r) => /\/api\/activities\/[^/]+\/leave-default/.test(r.url()) && r.request().method() === 'PUT', { timeout: 30000 });
  await page.getByRole('button', { name: /^Save leave time$/ }).first().tap(); log('leave-default', (await resp).status());
  await page.waitForTimeout(8000);
  await gotoGP(); await dump('setup-05-gameplan-final');
}

if (MODE === 'record') {
  rmSync(`${OUT}/d04_ui_flow_source.mkv`, { force: true });
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'x11grab', '-draw_mouse', '0', '-framerate', '30', '-video_size', '1080x1920', '-i', `${DISPLAY}.0+0,0`,
    '-c:v', 'libx264rgb', '-preset', 'ultrafast', '-qp', '0', '-pix_fmt', 'bgr0', `${OUT}/d04_ui_flow_source.mkv`], { stdio: ['pipe', 'inherit', 'inherit'] });
  const REC0 = Date.now() / 1000; await page.waitForTimeout(800);
  const marks = {}; const mark = (k) => { marks[k] = +(Date.now() / 1000 - REC0).toFixed(3); log('mark', k, marks[k]); };
  const still = async (n) => { await page.screenshot({ path: `${OUT}/${n}.png` }); log('still', n); };
  const hold = (ms) => page.waitForTimeout(ms);
  mark('gameplan'); await hold(6000); await still('d04_gameplan_all_three');
  mark('whatToBringTap'); await page.getByRole('button', { name: /What to bring/ }).first().tap();
  await page.getByText(/items? to pack/).first().waitFor(); mark('prepOpen'); await hold(4500); await still('d04_prep_list');
  const back = page.getByRole('button', { name: /Back to Game Plan|^Back$/ }).first();
  if (await back.isVisible().catch(() => false)) { mark('backTap'); await back.tap(); await page.getByTestId('gp-leave-card').first().waitFor(); mark('gameplanAgain'); await hold(4500); await still('d04_gameplan_return'); }
  mark('end'); ff.stdin.write('q'); await new Promise((ok) => ff.on('close', ok));
  writeFileSync(`${OUT}/marks.json`, JSON.stringify({ marks, writes, date: DATE, tz: TZ }, null, 1));
  await dump('record-final');
}

writeFileSync(`${OUT}/writes-${MODE}.json`, JSON.stringify(writes, null, 1));
log('writes', JSON.stringify(writes.map((w) => `${w.m} ${w.path} ${w.status}`)));
console.log('EXPOSURE', JSON.stringify(await scan.report()));
console.log('blocked third-party hosts:', [...new Set(blocked)].join(', ') || 'none');
await browser.close();
