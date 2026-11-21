// D03 sound: Sarah narration (hook + body + reused D01 CTA) + the D01/D02 sound language (original synth bed, felt taps,
// locked Saved cue as the "Leave by 4:30 PM" payoff) → full + music-free masters muxed onto the HyperFrames picture.
// Usage: node mix_d03.mjs <picture.mp4> <out_full.mp4> [<out_musicfree.mp4>]
// Same graph as gtm/d02-water-bottles/edit/sound/mix_d02.mjs: master gain fixed at D01's 11.9 dB; 4×-oversampled −1.5 dBFS limiter.
import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DUR, VO, SFX } from '../../scene.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const D03 = join(HERE, '../..'); const D01SND = join(D03, '../d01-pickup/edit/sound');
const NARR = join(D03, 'audio/narration');
const [PIC, OUT_FULL, OUT_MF] = process.argv.slice(2);
const W = '/tmp/claude-1000/-workspaces-actiqo-motion/86b47b57-f058-4fdf-aa1c-0227865b12fc/scratchpad/d03snd'; mkdirSync(W, { recursive: true });
execFileSync('node', [join(D01SND, 'synth.mjs')], { stdio: 'ignore' }); // D01 synth → its git-ignored out/

const ms = (t) => Math.round(t * 1000);
const inputs = []; const add = (f) => { inputs.push(f); return inputs.length - 1; };
const iSnd = { enter: add(join(D01SND, 'out/sfx_enter.wav')), tap: add(join(D01SND, 'out/sfx_tap.wav')), sel: add(join(D01SND, 'out/sfx_tap_select.wav')),
  saved: add(join(D01SND, 'locked/sfx_saved_v01.wav')), pad: add(join(D01SND, 'out/bed_pad.wav')), rh: add(join(D01SND, 'out/bed_rhythm.wav')) };
const f = []; const voIv = []; const vo = [];
const clip = (i, a, b, at, g, label) => { f.push(`[${i}:a]atrim=${a}:${b},asetpts=N/SR/TB,aformat=sample_rates=48000:channel_layouts=stereo,afade=t=in:d=0.02,afade=t=out:st=${(b - a - 0.04).toFixed(3)}:d=0.04,volume=${g},adelay=${ms(at)}|${ms(at)},apad=whole_dur=${DUR}[${label}]`); vo.push(`[${label}]`); voIv.push([at, at + b - a]); };
for (const [k, v] of Object.entries(VO)) clip(add(join(NARR, v.file)), v.src[0], v.src[1], v.at, v.gain, `vo_${k}`);
f.push(`${vo.join('')}amix=inputs=${vo.length}:normalize=0,highpass=f=80:poles=1[narr]`);
const sfx = (i, at, g, label) => f.push(`[${i}:a]volume=${g},adelay=${ms(at)}|${ms(at)},apad=whole_dur=${DUR}[${label}]`);
sfx(iSnd.enter, SFX.enter, 0.22, 'enter');      // soft air → felt pluck on the cut into ACTIQO (H − 0.30)
sfx(iSnd.tap, SFX.tapChange, 0.12, 't1');       // real tap: Change on the leave row
sfx(iSnd.sel, SFX.tapSave, 0.13, 't2');         // real tap: Save leave time
sfx(iSnd.saved, SFX.saved, 0.21, 'saved');      // PAYOFF: "Leave by 4:30 PM · Fixed leave time" (locked D01 Saved cue)
// bed: same D01 bed, offset so its release (bed 9.723 s) lands on the saved row; ducked under every VO line
const off = +(9.723 - SFX.saved).toFixed(3);
const r = 0.15, merged = [];
for (const [a, b] of [...voIv].sort((x, y) => x[0] - y[0])) { const m = merged.at(-1); if (m && a - m[1] < 2 * r + 0.05) m[1] = Math.max(m[1], b); else merged.push([a, b]); }
const level = (t) => { let v = 0.75; for (const [a, b] of merged) { if (t >= a && t <= b) return 0.30; const d = t < a ? a - t : t - b; if (d < r) v = Math.min(v, 0.30 + (0.45 * d) / r); } return v; };
const gain = (t) => level(t) * Math.min(1, t / 0.3) * Math.min(1, Math.max(0, (DUR - t) / 0.6));
const raw = []; for (let i = 0; i <= Math.round(DUR * 10); i++) raw.push([+(i / 10).toFixed(2), +gain(i / 10).toFixed(3)]);
const pts = raw.filter((p, i) => i === 0 || i === raw.length - 1 || Math.abs((p[1] - raw[i - 1][1]) - (raw[i + 1][1] - p[1])) > 1e-6);
let env = `${pts.at(-1)[1]}`; for (let i = pts.length - 2; i >= 0; i--) { const [t0, v0] = pts[i], [t1, v1] = pts[i + 1]; const k = ((v1 - v0) / (t1 - t0)).toFixed(4); env = `if(lt(t,${t1}),${v0}+${k}*(t-${t0}),${env})`; }
f.push(`[${iSnd.pad}:a]volume=0.56[pad];[${iSnd.rh}:a]volume=0.285[rh];[pad][rh]amix=inputs=2:normalize=0,atrim=${off}:${(off + DUR).toFixed(3)},asetpts=N/SR/TB,volume='${env}':eval=frame[bed]`);
const run = (withBed, out) => {
  const ins = `[narr][enter][t1][t2][saved]${withBed ? '[bed]' : ''}`; const n = withBed ? 6 : 5;
  const graph = [...f, ...(withBed ? [] : ['[bed]anullsink']), `${ins}amix=inputs=${n}:normalize=0,atrim=0:${DUR},asetpts=N/SR/TB,volume=11.9dB,aresample=192000,alimiter=limit=0.8414:attack=1:release=60:level=disabled,aresample=48000[m]`].join(';');
  const wav = join(W, `d03_${withBed ? 'full' : 'mf'}.wav`);
  execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...inputs.flatMap((x) => ['-i', x]), '-filter_complex', graph, '-map', '[m]', '-c:a', 'pcm_s24le', '-ar', '48000', wav]);
  execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-i', PIC, '-i', wav, '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '320k', '-ar', '48000', '-movflags', '+faststart', '-t', String(DUR), out]);
};
run(true, OUT_FULL); if (OUT_MF) run(false, OUT_MF);
console.log(JSON.stringify({ DUR, bedOffset: off, vo: voIv.map(([a, b]) => [+a.toFixed(2), +b.toFixed(2)]) }));
