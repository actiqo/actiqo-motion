// Experimental vector trace of the official ACTIQO raster wordmark.
// Input : brand/logo/current/actiqo-wordmark-navy-teal_trimmed.png (from public/email/actiqo-logo.png)
// Output: brand/logo/trace/actiqo-wordmark-trace_EXPERIMENTAL.svg
// Method: split the raster into its two inks (navy / teal) by hue, build 4x coverage masks
// (alpha-weighted, so anti-aliased edges land at their true sub-pixel position), trace each
// with potrace at a 50% threshold, and emit one SVG in the raster's own pixel space.
const Jimp = require('jimp');
const potrace = require('potrace');
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..', 'brand', 'logo');
const SRC = path.join(ROOT, 'current', 'actiqo-wordmark-navy-teal_trimmed.png');
const OUT = path.join(ROOT, 'trace');
const UP = 4;

(async () => {
  const img = await Jimp.read(SRC);
  const { width: W, height: H, data } = img.bitmap;
  const isTeal = (r, g, b) => g > 115 && g > r + 60;           // teal Q vs navy letters
  const acc = { navy: [0, 0, 0, 0], teal: [0, 0, 0, 0] };
  const masks = { navy: new Jimp(W, H, 0xffffffff), teal: new Jimp(W, H, 0xffffffff) };
  for (let i = 0; i < W * H; i++) {
    const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2], a = data[i * 4 + 3];
    const k = isTeal(r, g, b) ? 'teal' : 'navy';
    if (a > 250) { acc[k][0] += r; acc[k][1] += g; acc[k][2] += b; acc[k][3]++; }
    const v = 255 - a; // coverage → black
    const m = masks[k].bitmap.data;
    m[i * 4] = m[i * 4 + 1] = m[i * 4 + 2] = v;
  }
  const hex = (a) => '#' + a.slice(0, 3).map((v) => Math.round(v / a[3]).toString(16).padStart(2, '0')).join('').toUpperCase();
  const colors = { navy: hex(acc.navy), teal: hex(acc.teal) };
  console.log('measured inks', colors);

  const paths = {};
  for (const k of ['navy', 'teal']) {
    const m = masks[k].resize(W * UP, H * UP, Jimp.RESIZE_BICUBIC);
    const f = path.join(OUT, `${k}-mask-${UP}x.png`);
    await m.writeAsync(f);
    const svg = await new Promise((res, rej) =>
      potrace.trace(f, { threshold: 128, turdSize: 8, optTolerance: 0.2, alphaMax: 1.0, color: colors[k], background: 'transparent' },
        (e, s) => (e ? rej(e) : res(s))));
    paths[k] = svg.match(/<path[^>]*d="([^"]+)"/)[1];
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W * UP} ${H * UP}" width="${W}" height="${H}">
  <!-- EXPERIMENTAL potrace of public/email/actiqo-logo.png (official raster). Not yet approved for use. -->
  <path fill="${colors.navy}" fill-rule="evenodd" d="${paths.navy}"/>
  <path fill="${colors.teal}" fill-rule="evenodd" d="${paths.teal}"/>
</svg>
`;
  fs.writeFileSync(path.join(OUT, 'actiqo-wordmark-trace_EXPERIMENTAL.svg'), svg);
  console.log('wrote svg', (svg.length / 1024).toFixed(0) + ' KB');
})().catch((e) => { console.error(e); process.exit(1); });
