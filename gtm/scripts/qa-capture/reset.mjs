// Return the D01 fixture's pickup to "Not assigned" through the REAL Assignments editor (no direct DB write).
import { open, login, BASE, GP, QA_HOST } from './lib.mjs';
import { attach } from './exposure.mjs';
const { browser, ctx, page } = await open({ dsf: 1 });
const scan = attach(ctx, { qaHost: QA_HOST });
const saves = []; page.on('response', async (r) => { if (r.url().includes('/api/family-sync/config/save')) saves.push(r.status()); });
await login(page);
if (!page.url().includes('game-plan')) await page.goto(BASE + GP, { waitUntil: 'load' });
await page.getByRole('button', { name: /Who.s doing what/ }).tap(); await page.waitForTimeout(2500);
await page.getByRole('button', { name: /^Change assignments$/ }).tap(); await page.waitForTimeout(2000);
await page.getByRole('button', { name: /^Pickup, / }).tap(); await page.getByText('Who brings them home?').waitFor(); await page.waitForTimeout(800);
await page.getByRole('radio', { name: /^Not assigned/ }).tap(); await page.waitForTimeout(1000);
const back = page.getByRole('button', { name: 'Back to assignments' });
if (await back.isVisible().catch(() => false)) { await back.tap(); await page.waitForTimeout(1000); }
await page.getByRole('button', { name: 'Save assignments' }).tap();
await page.waitForResponse((r) => r.url().includes('/api/family-sync/config/save'), { timeout: 30000 }); await page.waitForTimeout(2500);
console.log('reset save responses', JSON.stringify(saves));
console.log('after reset:', (await page.evaluate(() => document.body.innerText)).split('\n').filter((l) => /Pickup|Drop-off/.test(l)).join(' | '));
console.log('EXPOSURE', JSON.stringify(await scan.report()));
await browser.close();
