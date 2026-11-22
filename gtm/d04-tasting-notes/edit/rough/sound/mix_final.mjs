// D04 FINAL sound. Same voice graph as the approved v02 mix (Alec's REAL takes: trims + 80 Hz HPF + per-line level match;
// no pitch, no stretch, no noise reduction, no declip: the flagged peaks are single-sample AAC overs, flat factor 0) +
// two quiet synthesized notification blips + faint room tone + subtle end-card chime (locked D01 cue).
// FULL adds a restrained ORIGINAL synthesized bed (D01 synth.mjs pad + rhythm, no licensed music): enters with the founder line,
// ducked under every voice line, its release landing on the end card. MUSIC-FREE omits the bed.
// Loudness: post-limiter integrated ≈ −14 LUFS (iterated), 4×-oversampled −2.0 dBFS limiter (0.5 dB margin: AAC overshoot measured up to +0.3 dB); true peak verified ≤ −1.5 dBTP on the encoded masters.
// Usage: node mix_final.mjs <picture.mp4> <out_full.mp4> <out_musicfree.mp4> [<clean_picture.mp4> <out_clean.mp4>]
import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DUR, VO, SFX, END } from '../voiced.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '../../../../..');
const D01SND = join(ROOT, 'gtm/d01-pickup/edit/sound');
const TAKE = { A: join(ROOT, 'gtm/d04-tasting-notes/audio/source/d04_alec_voice_take1.m4a'), B: join(ROOT, 'gtm/d04-tasting-notes/audio/source/d04_alec_voice_take2.m4a') };
const [PIC, OUT_FULL, OUT_MF, PIC_CLEAN, OUT_CLEAN] = process.argv.slice(2);
const W = '/tmp/claude-1000/-workspaces-actiqo-motion/86b47b57-f058-4fdf-aa1c-0227865b12fc/scratchpad/d04final'; mkdirSync(W, { recursive: true });
const ff = (a) => execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...a]);
const ms = (t) => Math.round(t * 1000);
execFileSync('node', [join(D01SND, 'synth.mjs')], { stdio: 'ignore' });
const BLIP = join(W, 'blip.wav');
ff(['-f', 'lavfi', '-i', "aevalsrc='0.5*(sin(2*PI*1175*t)+0.6*sin(2*PI*1760*t))*exp(-t*28)':s=48000:d=0.25", '-af', 'afade=t=in:d=0.004,aformat=channel_layouts=stereo', BLIP]);

// bed: D01 bed release (9.723 s into the bed) lands on the end card; enters at the founder line, ducked under voice
const BED_IN = 6.0, OFF = +(9.723 - END.t0).toFixed(3); // bed time = timeline + OFF (negative → starts later)
const voIv = VO.map((v) => [v.at, v.at + v.src[1] - v.src[0]]);
const r = 0.15, merged = []; for (const [a, b] of [...voIv].sort((x, y) => x[0] - y[0])) { const m = merged.at(-1); if (m && a - m[1] < 2 * r + 0.05) m[1] = Math.max(m[1], b); else merged.push([a, b]); }
const level = (t) => { let v = 0.62; for (const [a, b] of merged) { if (t >= a && t <= b) return 0.22; const d = t < a ? a - t : t - b; if (d < r) v = Math.min(v, 0.22 + (0.40 * d) / r); } return v; };
const gain = (t) => t < BED_IN ? 0 : level(t) * Math.min(1, (t - BED_IN) / 0.8) * Math.min(1, Math.max(0, (DUR - t) / 0.8));
const raw = []; for (let i = 0; i <= Math.round(DUR * 10); i++) raw.push([+(i / 10).toFixed(2), +gain(i / 10).toFixed(3)]);
const pts = raw.filter((p, i) => i === 0 || i === raw.length - 1 || Math.abs((p[1] - raw[i - 1][1]) - (raw[i + 1][1] - p[1])) > 1e-6);
let env = `${pts.at(-1)[1]}`; for (let i = pts.length - 2; i >= 0; i--) { const [t0, v0] = pts[i], [t1, v1] = pts[i + 1]; env = `if(lt(t,${t1}),${v0}+${((v1 - v0) / (t1 - t0)).toFixed(4)}*(t-${t0}),${env})`; }

const graph = (withBed, db) => {
  const f = []; const ins = [];
  VO.forEach((v, i) => { f.push(`[${i}:a]atrim=${v.src[0]}:${v.src[1]},asetpts=N/SR/TB,aformat=sample_rates=48000:channel_layouts=stereo,highpass=f=80:poles=2,afade=t=in:d=0.015,afade=t=out:st=${(v.src[1] - v.src[0] - 0.04).toFixed(3)}:d=0.04,volume=${v.gainDb}dB,adelay=${ms(v.at)}|${ms(v.at)},apad=whole_dur=${DUR}[v${i}]`); ins.push(`[v${i}]`); });
  const b = VO.length;
  f.push(`[${b}:a]asplit=2[b1][b2]`, `[b1]volume=0.10,adelay=${ms(SFX.notify1)}|${ms(SFX.notify1)},apad=whole_dur=${DUR}[n1]`, `[b2]volume=0.08,adelay=${ms(SFX.notify2)}|${ms(SFX.notify2)},apad=whole_dur=${DUR}[n2]`);
  f.push(`[${b + 1}:a]aformat=sample_rates=48000:channel_layouts=stereo,volume=0.12,adelay=${ms(SFX.endChime)}|${ms(SFX.endChime)},apad=whole_dur=${DUR}[ch]`);
  f.push(`[${b + 2}:a]lowpass=f=3500,highpass=f=120,volume=0.0035,afade=t=in:d=0.4,afade=t=out:st=${(DUR - 0.6).toFixed(2)}:d=0.6[rt]`);
  // bed: delay so bed time 0 sits at timeline −OFF, then envelope (0 before BED_IN)
  const delay = ms(-OFF);
  f.push(`[${b + 3}:a]volume=0.56[pad];[${b + 4}:a]volume=0.285[rh];[pad][rh]amix=inputs=2:normalize=0,aformat=sample_rates=48000:channel_layouts=stereo,adelay=${delay}|${delay},apad=whole_dur=${DUR},atrim=0:${DUR},asetpts=N/SR/TB,volume='${env}':eval=frame,volume=9dB[bed]`); // +9 dB: restrained (≈18 dB under voice when ducked, ≈10 dB under in gaps)
  // two-stage mix (a single 9-input amix was found to drop the delayed bed): voice + fx + room tone first, then the bed
  f.push(`${ins.join('')}[n1][n2][ch][rt]amix=inputs=${ins.length + 4}:normalize=0,apad=whole_dur=${DUR},atrim=0:${DUR},asetpts=N/SR/TB[pre]`);
  if (withBed) f.push(`[pre][bed]amix=inputs=2:normalize=0,atrim=0:${DUR},asetpts=N/SR/TB[mx]`); else f.push('[bed]anullsink', '[pre]anull[mx]');
  f.push(`[mx]volume=${db}dB,aresample=192000,alimiter=limit=0.7943:attack=1:release=60:level=disabled,aresample=48000[m]`);
  return f.join(';');
};
const inputs = [...VO.flatMap((v) => ['-i', TAKE[v.take]]), '-i', BLIP, '-i', join(D01SND, 'locked/sfx_saved_v01.wav'), '-f', 'lavfi', '-t', String(DUR), '-i', 'anoisesrc=color=pink:sample_rate=48000:amplitude=1', '-i', join(D01SND, 'out/bed_pad.wav'), '-i', join(D01SND, 'out/bed_rhythm.wav')];
const meas = (wav) => { const o = execFileSync('bash', ['-c', `ffmpeg -hide_banner -nostats -i "${wav}" -af ebur128=peak=true -f null - 2>&1 | grep -E '^\\s+(I|Peak):' | tail -2`]).toString(); const [I, TP] = [...o.matchAll(/-?[\d.]+/g)].map((m) => +m[0]); return { I, TP }; };
const mix = (withBed, name) => {
  let db = 2.4; let m; const wav = join(W, `${name}.wav`);
  for (let k = 0; k < 4; k++) { ff([...inputs, '-filter_complex', graph(withBed, db), '-map', '[m]', '-c:a', 'pcm_s24le', '-ar', '48000', wav]); m = meas(wav); if (Math.abs(m.I + 14) <= 0.2) break; db = +(db + (-14 - m.I)).toFixed(2); }
  return { wav, db, ...m };
};
const mux = (pic, wav, out) => ff(['-i', pic, '-i', wav, '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-crf', '17', '-preset', 'slow', '-profile:v', 'high', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '320k', '-ar', '48000', '-movflags', '+faststart', '-t', String(DUR), out]);
if (process.env.D04_DUMP) { console.log(graph(true, 0)); process.exit(0); }
const full = mix(true, 'd04_full'), mf = mix(false, 'd04_musicfree');
mux(PIC, full.wav, OUT_FULL); mux(PIC, mf.wav, OUT_MF);
if (PIC_CLEAN && OUT_CLEAN) mux(PIC_CLEAN, full.wav, OUT_CLEAN);
console.log(JSON.stringify({ DUR, full: { masterDb: full.db, I: full.I, TP: full.TP }, musicfree: { masterDb: mf.db, I: mf.I, TP: mf.TP }, bedOffset: OFF }));
