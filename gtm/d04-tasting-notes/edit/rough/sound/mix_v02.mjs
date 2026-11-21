// D04 voiced rough v02 sound: Alec's REAL voice (trimmed takes, 80 Hz high-pass, per-line level match only: no pitch,
// no time-stretch, no noise reduction (noise floor ≈ −71 dB), no clone/TTS) + two quiet synthesized notification blips +
// soft end-card chime (locked D01 cue) + faint room tone. Master → ≈ −14 LUFS, 4×-oversampled −1.5 dBFS limiter (as D01–D03).
// Usage: node mix_v02.mjs <picture.mp4> <out.mp4>
import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DUR, VO, SFX } from '../voiced.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '../../../../..'); // repo root (the memos were uploaded there)
const TAKE = { A: join(ROOT, 'gtm/d04-tasting-notes/audio/source/d04_alec_voice_take1.m4a'), B: join(ROOT, 'gtm/d04-tasting-notes/audio/source/d04_alec_voice_take2.m4a') };
const CHIME = join(ROOT, 'gtm/d01-pickup/edit/sound/locked/sfx_saved_v01.wav');
const [PIC, OUT] = process.argv.slice(2);
const W = '/tmp/claude-1000/-workspaces-actiqo-motion/86b47b57-f058-4fdf-aa1c-0227865b12fc/scratchpad/d04snd'; mkdirSync(W, { recursive: true });
const ff = (args) => execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...args]);
const ms = (t) => Math.round(t * 1000);

// original synthesized notification blip: two soft sine partials, fast decay (not any platform's tone)
const BLIP = join(W, 'blip.wav');
ff(['-f', 'lavfi', '-i', "aevalsrc='0.5*(sin(2*PI*1175*t)+0.6*sin(2*PI*1760*t))*exp(-t*28)':s=48000:d=0.25", '-af', 'afade=t=in:d=0.004,aformat=channel_layouts=stereo', BLIP]);

const graph = (masterDb) => {
  const f = []; const ins = [];
  VO.forEach((v, i) => { f.push(`[${i}:a]atrim=${v.src[0]}:${v.src[1]},asetpts=N/SR/TB,aformat=sample_rates=48000:channel_layouts=stereo,highpass=f=80:poles=2,afade=t=in:d=0.015,afade=t=out:st=${(v.src[1] - v.src[0] - 0.04).toFixed(3)}:d=0.04,volume=${v.gainDb}dB,adelay=${ms(v.at)}|${ms(v.at)},apad=whole_dur=${DUR}[v${i}]`); ins.push(`[v${i}]`); });
  const b = VO.length, c = b + 1, r = b + 2;
  f.push(`[${b}:a]asplit=2[b1][b2]`);
  f.push(`[b1]volume=0.10,adelay=${ms(SFX.notify1)}|${ms(SFX.notify1)},apad=whole_dur=${DUR}[n1]`, `[b2]volume=0.08,adelay=${ms(SFX.notify2)}|${ms(SFX.notify2)},apad=whole_dur=${DUR}[n2]`);
  f.push(`[${c}:a]aformat=sample_rates=48000:channel_layouts=stereo,volume=0.12,adelay=${ms(SFX.endChime)}|${ms(SFX.endChime)},apad=whole_dur=${DUR}[ch]`);
  f.push(`[${r}:a]lowpass=f=3500,highpass=f=120,volume=0.0035,afade=t=in:d=0.4,afade=t=out:st=${(DUR - 0.6).toFixed(2)}:d=0.6[rt]`);
  f.push(`${ins.join('')}[n1][n2][ch][rt]amix=inputs=${ins.length + 4}:normalize=0,atrim=0:${DUR},asetpts=N/SR/TB,volume=${masterDb}dB,aresample=192000,alimiter=limit=0.8414:attack=1:release=60:level=disabled,aresample=48000[m]`);
  return f.join(';');
};
const inputs = [...VO.flatMap((v) => ['-i', TAKE[v.take]]), '-i', BLIP, '-i', CHIME, '-f', 'lavfi', '-t', String(DUR), '-i', 'anoisesrc=color=pink:sample_rate=48000:amplitude=1'];
const render = (db, wav) => ff([...inputs, '-filter_complex', graph(db), '-map', '[m]', '-c:a', 'pcm_s24le', '-ar', '48000', wav]);
// two passes: measure at 0 dB, then set the master gain for ≈ −14 LUFS integrated
const probe = join(W, 'probe.wav'); render(0, probe);
const out = execFileSync('bash', ['-c', `ffmpeg -hide_banner -nostats -i "${probe}" -af ebur128 -f null - 2>&1 | grep -E '^\\s+I:' | tail -1`]).toString();
const Ip = +out.match(/-?[\d.]+/)[0];
const gain = +(-14 - Ip).toFixed(1);
const wav = join(W, 'd04_v02_mix.wav'); render(gain, wav);
ff(['-i', PIC, '-i', wav, '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-crf', '19', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '320k', '-ar', '48000', '-movflags', '+faststart', '-t', String(DUR), OUT]);
console.log(JSON.stringify({ DUR, preMasterLUFS: Ip, masterGainDb: gain }));
