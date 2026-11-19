// Exploration only: log in as Jordan, open the Game Plan, dump visible text + clickable labels, screenshot. Optional click path via argv (text labels).
import { open, login, BASE, GP, S } from './lib.mjs';
import { mkdirSync, writeFileSync } from 'node:fs';
const OUT = `${S}/cap/explore2`; mkdirSync(OUT, { recursive: true });
const { browser, page, blocked } = await open({ dsf: 1 });
page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) console.log('console.error', m.text().slice(0, 160)); });
let n = 0;
const dump = async (name) => {
  await page.waitForTimeout(2500);
  await page.screenshot({ path: `${OUT}/${String(++n).padStart(2, '0')}_${name}.png` });
  const clickables = await page.evaluate(() => [...document.querySelectorAll('button,a,[role=button],[role=radio],[role=option],[role=tab]')]
    .filter((e) => e.offsetParent !== null).map((e) => `${e.tagName.toLowerCase()}[${e.getAttribute('role') ?? ''}] "${(e.getAttribute('aria-label') || e.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 70)}"`));
  writeFileSync(`${OUT}/${String(n).padStart(2, '0')}_${name}.txt`, page.url() + '\n\n' + (await page.evaluate(() => document.body.innerText)).slice(0, 3000) + '\n\n--- clickables ---\n' + clickables.join('\n'));
  console.log('dumped', name, page.url());
};
await login(page);
if (!page.url().includes('game-plan')) { await dump('after-login'); await page.goto(BASE + GP, { waitUntil: 'load' }); }
await page.waitForTimeout(6000);
if (await page.getByText('Taking longer than expected').count()) { await page.getByRole('button', { name: 'Try again' }).click(); await page.waitForTimeout(10000); }
await dump('gameplan');
if (await page.getByText('Review and accept to continue').count()) {
  const cb = page.locator('input[type=checkbox], [role=checkbox]').first();
  if (await cb.count()) { await cb.check({ force: true }).catch(async () => cb.click()); console.log('checked consent box'); }
  await page.getByRole('button', { name: 'Accept and continue' }).click(); console.log('accepted terms (consent gate, real UI)');
  await page.waitForTimeout(8000);
  await dump('after-consent');
}
for (const label of process.argv.slice(2)) {
  const loc = page.getByRole('button', { name: new RegExp(label, 'i') }).or(page.getByRole('link', { name: new RegExp(label, 'i') })).or(page.getByText(new RegExp('^' + label + '$', 'i'))).first();
  await loc.click(); console.log('clicked', label);
  await dump('after_' + label.replace(/\W+/g, '_').slice(0, 30));
}
console.log('blocked third-party hosts:', [...new Set(blocked)].join(', ') || 'none');
await browser.close();
