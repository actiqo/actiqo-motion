// Film 02 · deterministic frame renderer: one headless Chrome page, SVG per frame → PNG → ffmpeg.
import { chromium } from 'playwright-core';
import { spawn } from 'node:child_process';
import { writeFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, resolve, join } from 'node:path';
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
      await page.evaluate(async (s) => {
        const el = document.getElementById('s'); el.innerHTML = s;
        // raster <image>s (the end-card wordmark): wait until decoded so no frame is captured before it paints
        const ims = el.querySelectorAll('image');
        if (ims.length) {
          await Promise.all([...ims].map((i) => { const im = new Image(); im.src = i.getAttribute('href'); return im.decode().catch(() => {}); }));
          await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
        }
      }, svgInner);
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

const X264 = ['-c:v', 'libx264', '-preset', 'slow', '-crf', '14', '-pix_fmt', 'yuv420p'];
const run = (args) => new Promise((r, j) => spawn('ffmpeg', ['-y', '-loglevel', 'error', ...args], { stdio: 'inherit' }).on('close', (c) => (c === 0 ? r() : j(new Error('ffmpeg ' + c)))));

/**
 * render n frames to an mp4 (H.264, yuv420p, CRF 14).
 * holdLast (optional): the last holdLast frames are one held image, and must DECODE pixel-identical. A lossy encoder
 * keeps refining a still image frame after frame, so the hold is encoded on its own: its first frame once, then every
 * further frame from that frame's exact reconstruction (zero residual → skip blocks), and joined to the main encode.
 */
export async function renderVideo({ w, h, n, frame, out, fps = 30, before, holdLast = 0 }) {
  mkdirSync(dirname(out), { recursive: true });
  const st = await openStage(w, h);
  if (before) await before(st);
  const tmp = holdLast ? mkdtempSync(join(tmpdir(), 'film02-hold-')) : null;
  const nMain = n - holdLast;
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-', ...X264,
    ...(holdLast ? ['-x264-params', 'repeat-headers=1', join(tmp, 'a.mp4')] : ['-movflags', '+faststart', out])], { stdio: ['pipe', 'inherit', 'inherit'] });
  let cur = st;
  for (let i = 0; i < n; i++) {
    if (i === nMain) {                                   // the held image: rendered once
      writeFileSync(join(tmp, 'hold.png'), await cur.frame(frame(i)));
      break;
    }
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
  if (!holdLast) return;
  const raw = ['-f', 'rawvideo', '-pix_fmt', 'yuv420p', '-s', `${w}x${h}`, '-framerate', String(fps)];
  const P = (f) => join(tmp, f), hp = ['-x264-params', 'repeat-headers=1:mbtree=0'];
  await run(['-i', P('hold.png'), '-pix_fmt', 'yuv420p', '-f', 'rawvideo', P('s.yuv')]);
  await run([...raw, '-i', P('s.yuv'), ...X264, ...hp, P('i.mp4')]);
  await run(['-i', P('i.mp4'), '-pix_fmt', 'yuv420p', '-f', 'rawvideo', P('d.yuv')]);
  const d = readFileSync(P('d.yuv'));
  writeFileSync(P('b.yuv'), Buffer.concat([readFileSync(P('s.yuv')), ...Array(holdLast - 1).fill(d)]));
  await run([...raw, '-i', P('b.yuv'), ...X264, ...hp, P('b.mp4')]);
  // join without re-encoding (the concat demuxer keeps both segments' timestamps; in-band headers in both)
  writeFileSync(P('list.txt'), `file '${P('a.mp4')}'\nfile '${P('b.mp4')}'\n`);
  await run(['-f', 'concat', '-safe', '0', '-i', P('list.txt'), '-c', 'copy', '-movflags', '+faststart', out]);
  if (!process.env.KEEP_HOLD) rmSync(tmp, { recursive: true, force: true }); else console.log('hold tmp', tmp);
}

export async function renderStill({ w, h, svg, out, scale = 1 }) {
  mkdirSync(dirname(out), { recursive: true });
  const st = await openStage(w, h, scale);
  writeFileSync(out, await st.frame(svg));
  await st.close();
}
