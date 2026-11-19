// Shared capture helpers: QA-only browser context, third-party blocking, dev-badge hiding, login as Jordan.
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
const require = createRequire('/workspaces/actiqo-motion/film02/production/package.json');
export const { chromium } = require('playwright-core');
export const S = process.env.D01_RUNTIME ?? '/tmp/d01-runtime'; // holds actiqo-app/, d01-demo-creds.env, cap/ (never committed)
export const BASE = 'http://localhost:3000';
export const ACTIVITY = 'd01de000-0000-4000-8000-0000000000ac';
export const DATE = process.env.D01_DATE ?? '2026-11-19'; // an upcoming Tue/Thu Soccer Practice date (household clock America/Chicago)
export const GP = `/dashboard/game-plan?activity=${ACTIVITY}&date=${DATE}`;
const PW = readFileSync(`${S}/d01-demo-creds.env`, 'utf8').match(/D01_PW=(.*)/)[1].trim();

export async function open({ width = 390, height = 844, dsf = 2, recordNet = null } = {}) {
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox', '--disable-dev-shm-usage', '--renderer-process-limit=1', '--disable-site-isolation-trials', '--disable-features=site-per-process,Translate,MediaRouter,OptimizationHints', '--disable-extensions', '--disable-background-networking', '--disable-component-update', '--js-flags=--max-old-space-size=768'] });
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: dsf, isMobile: true, hasTouch: true, timezoneId: 'America/Chicago', locale: 'en-US',
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36' });
  ctx.setDefaultTimeout(150000); ctx.setDefaultNavigationTimeout(150000);
  const blocked = [];
  // Only the local disposable app and QA Supabase may be reached. Everything else (analytics, fonts CDNs, …) is aborted.
  await ctx.route(/^https?:\/\/(?!localhost|oqoqmzjldpefchegfqry\.supabase\.co)/, (r) => { blocked.push(new URL(r.request().url()).host); return r.abort(); });
  // Hide Next's own dev-tools badge (framework chrome, not product UI).
  await ctx.addInitScript(() => { const add = () => { const st = document.createElement('style'); st.textContent = 'nextjs-portal{display:none!important}'; document.head.appendChild(st); }; if (document.head) add(); else document.addEventListener('DOMContentLoaded', add); });
  if (recordNet) ctx.on('request', (r) => recordNet.push(r));
  const page = await ctx.newPage();
  return { browser, ctx, page, blocked };
}

export async function login(page) {
  await page.goto(BASE + '/login?next=' + encodeURIComponent(GP), { waitUntil: 'load' });
  await page.fill('input[type=email]', 'd01-demo-jordan@example.com');
  await page.fill('input[type=password]', PW);
  await page.keyboard.press('Enter');
  await page.waitForURL((u) => !u.pathname.startsWith('/login'), { timeout: 150000 });
  await page.waitForTimeout(3000);
  console.log('after login:', page.url());
}
