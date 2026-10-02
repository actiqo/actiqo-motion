// Film 02 · deterministic frame renderer: one headless Chrome page, SVG per frame → PNG → ffmpeg.
import { chromium } from 'playwright-core';
import { spawn } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const FONTS = resolve(HERE, '../../../brand/fonts');
const NOISE = resolve(HERE, '../../styleframes/build/noise.png');

export function stageHtml(w, h) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Inter;src:url("file://${FONTS}/Inter[opsz,wght].ttf");font-weight:100 900}
@font-face{font-family:Fraunces;src:url("file://${FONTS}/Fraunces[SOFT,WONK,opsz,wght].ttf");font-weight:100 900}
html,body{margin:0;width:${w}px;height:${h}px;overflow:hidden;background:#FCFAF7}
#s{position:absolute;inset:0}
#grain{position:absolute;inset:0;background:url("file://${NOISE}");opacity:.05;mix-blend-mode:multiply;pointer-events:none}
</style></head><body><svg id="s" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg"></svg><div id="grain"></div></body></html>`;
}

export async function openStage(w, h, scale = 1) {
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage', '--allow-file-access-from-files', '--font-render-hinting=none'] });
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: scale });
  const tmp = `/tmp/claude-1000/film02-stage-${w}x${h}.html`;
  writeFileSync(tmp, stageHtml(w, h));
  await page.goto('file://' + tmp);
  await page.evaluate(() => document.fonts.ready);
  return {
    async frame(svgInner) {
      await page.evaluate((s) => { document.getElementById('s').innerHTML = s; }, svgInner);
      return page.screenshot({ type: 'png', omitBackground: false });
    },
    /** advance widths in em for [text, weight] pairs, measured with the loaded Inter */
    async measure(items) {
      return page.evaluate(async (items) => {
        for (const w of [400, 500, 600, 700]) await document.fonts.load(`${w} 100px Inter`);
        const c = document.createElement('canvas').getContext('2d'); const out = {};
        for (const [t, w] of items) { c.font = `${w} 100px Inter`; c.letterSpacing = '-1px'; out[`${w}|${t}`] = c.measureText(t).width / 100; }
        return out;
      }, items);
    },
    close: () => browser.close(),
  };
}

/** render n frames to an mp4 (H.264, yuv420p, CRF 14) */
export async function renderVideo({ w, h, n, frame, out, fps = 30, before }) {
  mkdirSync(dirname(out), { recursive: true });
  const st = await openStage(w, h);
  if (before) await before(st);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-', '-c:v', 'libx264', '-preset', 'slow', '-crf', '14', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  let cur = st;
  for (let i = 0; i < n; i++) {
    // recycle the browser periodically: long renders on a memory-tight machine otherwise crash the tab
    if (i > 0 && i % 90 === 0) { await cur.close(); cur = await openStage(w, h); if (before) await before(cur); }
    let buf = null;
    for (let attempt = 0; !buf; attempt++) {
      try { buf = await cur.frame(frame(i)); }
      catch (e) {
        if (attempt >= 3) throw e;
        console.error(`frame ${i}: ${String(e.message).split('\n')[0]} — retry ${attempt + 1} on a fresh browser`);
        try { await cur.close(); } catch {}
        cur = await openStage(w, h); if (before) await before(cur);
      }
    }
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
  }
  ff.stdin.end();
  await new Promise((r, j) => ff.on('close', (c) => (c === 0 ? r() : j(new Error('ffmpeg ' + c)))));
  await cur.close();
}

export async function renderStill({ w, h, svg, out, scale = 1 }) {
  mkdirSync(dirname(out), { recursive: true });
  const st = await openStage(w, h, scale);
  writeFileSync(out, await st.frame(svg));
  await st.close();
}
