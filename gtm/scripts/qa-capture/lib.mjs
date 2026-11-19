// Shared capture helpers: QA-only browser context, third-party blocking, login as Jordan (QA demo).
// Target: D01_BASE (a temporary protected Vercel Preview of current actiqo main, QA-only env) or http://localhost:3000.
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
const require = createRequire('/workspaces/actiqo-motion/film02/production/package.json');
export const { chromium } = require('playwright-core');
export const S = process.env.D01_RUNTIME ?? '/tmp/d01-runtime'; // holds d01-demo-creds.env and capture intermediates (never committed)
export const BASE = (process.env.D01_BASE ?? 'http://localhost:3000').replace(/\/$/, '');
export const QA_HOST = 'oqoqmzjldpefchegfqry.supabase.co';
export const ACTIVITY = 'd01de000-0000-4000-8000-0000000000ac';
export const DATE = process.env.D01_DATE ?? '2026-11-19'; // an upcoming Tue/Thu Soccer Practice date (household clock America/Chicago)
export const GP = `/dashboard/game-plan?activity=${ACTIVITY}&date=${DATE}`;
const PW = () => readFileSync(`${S}/d01-demo-creds.env`, 'utf8').match(/D01_PW=(.*)/)[1].trim();

/** 9:16 phone layout rendered at 1080×1920 device pixels (432×768 CSS × 2.5). */
export async function open({ width = 432, height = 768, dsf = 2.5, onRequest = null, recordVideoDir = null } = {}) {
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-extensions', '--disable-background-networking', '--disable-component-update'] });
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: dsf, isMobile: true, hasTouch: true, timezoneId: 'America/Chicago', locale: 'en-US',
    ...(recordVideoDir ? { recordVideo: { dir: recordVideoDir, size: { width: Math.round(width * dsf), height: Math.round(height * dsf) } } } : {}),
    // neutral identity: no iPhone/Android UA, so the web-only "now on the App Store" sheet does not appear
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36' });
  ctx.setDefaultTimeout(60000); ctx.setDefaultNavigationTimeout(90000);
  const baseHost = new URL(BASE).host;
  const blocked = [];
  // Only the app host and QA Supabase may be reached. Everything else (analytics, CDNs, vercel.live toolbar, …) is aborted.
  await ctx.route((u) => u.host !== baseHost && u.host !== QA_HOST && !u.protocol.startsWith('data') && !u.protocol.startsWith('blob'), (r) => { blocked.push(new URL(r.request().url()).host); return r.abort(); });
  await ctx.addInitScript(() => { const add = () => { const st = document.createElement('style'); st.textContent = 'nextjs-portal,vercel-live-feedback{display:none!important}'; document.head.appendChild(st); }; if (document.head) add(); else document.addEventListener('DOMContentLoaded', add); });
  if (onRequest) ctx.on('request', onRequest);
  const page = await ctx.newPage();
  return { browser, ctx, page, blocked };
}

/** Vercel deployment protection: one navigation with the automation-bypass query sets a cookie for the app host only. */
export async function bypass(page) {
  const secret = process.env.D01_BYPASS; if (!secret) return;
  await page.goto(`${BASE}/login?x-vercel-protection-bypass=${encodeURIComponent(secret)}&x-vercel-set-bypass-cookie=true`, { waitUntil: 'load' });
}

export async function login(page) {
  await bypass(page);
  await page.goto(BASE + '/login?next=' + encodeURIComponent(GP), { waitUntil: 'load' });
  await page.fill('input[type=email]', 'd01-demo-jordan@example.com');
  await page.fill('input[type=password]', PW());
  await page.keyboard.press('Enter');
  await page.waitForURL((u) => !u.pathname.startsWith('/login'), { timeout: 90000 });
  await page.waitForTimeout(2500);
  if (await page.getByText('Review and accept to continue').count()) { // real consent gate, if the current legal version needs it
    const cb = page.locator('input[type=checkbox], [role=checkbox]').first();
    if (await cb.count()) await cb.check({ force: true }).catch(() => cb.click());
    await page.getByRole('button', { name: 'Accept and continue' }).click();
    await page.waitForTimeout(4000);
  }
}
