// Film 02 · stems → mixes → picture: node audio/mix.mjs [--lufs -16] [--tp -1]
// Inputs: audio/stems/{music,ambience,foley,ui}.wav (any rate/channels; conformed here to 48 kHz stereo, exactly 30.000 s).
// Outputs (audio/out/): mix_full.wav · music_only.wav · sfx_only.wav (ambience+foley+ui) · stem_*.wav — 48 kHz / 24-bit.
//   ONE gain (from the full mix's integrated loudness) is applied to every stem, so the stems still sum exactly to the mix;
//   a true-peak limiter runs only on the full mix if it is needed.
// Then muxes the full mix into the SILENT masters (video stream copied, never re-encoded; silent masters left untouched):
//   film/out/ACTIQO_WhatYouCarry_30s_mix_16x9.mp4 and _9x16.mp4 (AAC-LC 320 kb/s, 48 kHz).
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, rmSync } from 'node:fs';
const A = new URL('./', import.meta.url).pathname, S = A + 'stems/', O = A + 'out/', F = A + '../film/out/';
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? +process.argv[i + 1] : d; };
const LUFS = arg('--lufs', -16), TP = arg('--tp', -1);
const STEMS = ['music', 'ambience', 'foley', 'ui'];
const ff = (args) => execFileSync('ffmpeg', ['-hide_banner', '-y', ...args], { stdio: ['ignore', 'pipe', 'pipe'] }).toString();
const meter = (f) => {
  const e = execFileSync('sh', ['-c', `ffmpeg -hide_banner -nostats -i "${f}" -af ebur128=peak=true -f null - 2>&1 | tail -14`]).toString();
  return { I: +(/I:\s+(-?[\d.]+) LUFS/.exec(e)?.[1] ?? NaN), TP: +(/Peak:\s+(-?[\d.]+) dBFS/.exec(e)?.[1] ?? NaN) };
};

for (const s of STEMS) if (!existsSync(S + s + '.wav')) { console.error(`missing stem: audio/stems/${s}.wav`); process.exit(1); }
mkdirSync(O, { recursive: true });
const W = ['-c:a', 'pcm_s24le', '-ar', '48000', '-ac', '2'];
// conform: 48 kHz stereo, exactly 30.000 s (pad with silence or trim; never time-stretch)
for (const s of STEMS) ff(['-i', S + s + '.wav', '-af', 'aresample=48000,apad=whole_dur=30,atrim=0:30', ...W, O + `c_${s}.wav`]);
const sum = (ins, out, extra = '') => ff([...ins.flatMap((s) => ['-i', O + `c_${s}.wav`]), '-filter_complex', `${ins.map((_, i) => `[${i}]`).join('')}amix=inputs=${ins.length}:normalize=0:duration=longest${extra}`, ...W, out]);
sum(STEMS, O + 'raw_full.wav');
const m = meter(O + 'raw_full.wav');
if (!Number.isFinite(m.I)) { console.error('full mix is silent; nothing to normalise'); process.exit(1); }
const g = LUFS - m.I;                       // one gain for everything
for (const s of STEMS) ff(['-i', O + `c_${s}.wav`, '-af', `volume=${g.toFixed(2)}dB`, ...W, O + `stem_${s}.wav`]);
ff(['-i', O + 'stem_music.wav', ...W, O + 'music_only.wav']);
ff(['-i', O + 'stem_ambience.wav', '-i', O + 'stem_foley.wav', '-i', O + 'stem_ui.wav', '-filter_complex', '[0][1][2]amix=inputs=3:normalize=0', ...W, O + 'sfx_only.wav']);
const lim = m.TP + g > TP ? `,alimiter=limit=${Math.pow(10, TP / 20).toFixed(4)}:attack=1:release=60:level=disabled` : '';
ff(['-i', O + 'raw_full.wav', '-af', `volume=${g.toFixed(2)}dB${lim}`, ...W, O + 'mix_full.wav']);
for (const [fmt, tag] of [['16x9', '16x9'], ['9x16', '9x16']]) ff(['-i', F + `ACTIQO_WhatYouCarry_30s_review_${fmt}.mp4`, '-i', O + 'mix_full.wav', '-map', '0:v:0', '-map', '1:a:0',
  '-c:v', 'copy', '-c:a', 'aac', '-b:a', '320k', '-ar', '48000', '-t', '30', '-movflags', '+faststart', F + `ACTIQO_WhatYouCarry_30s_mix_${tag}.mp4`]);
for (const f of [...STEMS.map((s) => `c_${s}.wav`), 'raw_full.wav']) rmSync(O + f);
const r = meter(O + 'mix_full.wav');
console.log(`gain ${g.toFixed(2)} dB · full mix ${r.I} LUFS integrated, true peak ${r.TP} dBTP${lim ? ' (limited)' : ''}`);
