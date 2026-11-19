// Read-only exploration of the real UI on the target: screenshots + visible text + clickable labels per step.
// Usage: node explore.mjs [label …]   (clicks each label in turn; never clicks a save control)
import { open, login, BASE, GP, S, QA_HOST } from './lib.mjs';
import { attach } from './exposure.mjs';
import { mkdirSync, writeFileSync } from 'node:fs';
const OUT = `${S}/explore`; mkdirSync(OUT, { recursive: true });
const { browser, ctx, page, blocked } = await open({ dsf: 1 });
const scan = attach(ctx, { qaHost: QA_HOST });
let n = 0;
const dump = async (name) => {
  await page.waitForTimeout(2000);
  const f = `${OUT}/${String(++n).padStart(2, '0')}_${name}`;
  await page.screenshot({ path: f + '.png' });
  await scan.page(page, name);
  const clickables = await page.evaluate(() => [...document.querySelectorAll('button,a,[role=button],[role=radio],[role=option],[role=tab],[role=checkbox],label')]
    .filter((e) => e.offsetParent !== null).map((e) => `${e.tagName.toLowerCase()}[${e.getAttribute('role') ?? ''}] "${(e.getAttribute('aria-label') || e.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 80)}"`));
  writeFileSync(f + '.txt', page.url() + '\n\n' + (await page.evaluate(() => document.body.innerText)).slice(0, 4000) + '\n\n--- clickables ---\n' + clickables.join('\n'));
  console.log('dumped', name);
};
await login(page);
if (!page.url().includes('game-plan')) await page.goto(BASE + GP, { waitUntil: 'load' });
await page.waitForTimeout(5000);
await dump('gameplan');
for (const label of process.argv.slice(2)) {
  if (/save|assign pickup$/i.test(label)) { console.log('refusing to click a save control in explore:', label); break; }
  const re = new RegExp(label, 'i');
  const loc = page.getByRole('button', { name: re }).or(page.getByRole('link', { name: re })).or(page.getByRole('radio', { name: re })).or(page.getByRole('option', { name: re })).first();
  await loc.click(); console.log('clicked', label);
  await dump('after_' + label.replace(/\W+/g, '_').slice(0, 30));
}
console.log('EXPOSURE', JSON.stringify(await scan.report()));
console.log('blocked third-party hosts:', [...new Set(blocked)].join(', ') || 'none');
await browser.close();
