// D02 sound: Sarah narration (hook VO if any + body VO + CTA VO) + D01 sound language (original synth bed, felt taps,
// locked Saved cue as the "Prep complete" payoff) → full + music-free masters muxed onto the HyperFrames picture.
// Usage: node mix_d02.mjs <hookId> <picture.mp4> <out_full.mp4> <out_musicfree.mp4>
// Identical for every hook except the hook VO and the hold offset H. Master gain fixed at D01's 11.9 dB; −1.5 dBFS limiter.
import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { HOOKS, BODY, BODY_VO, CTA_VO } from '../../scene.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const D02 = join(HERE, '../..'); const D01SND = join(D02, '../d01-pickup/edit/sound');
const NARR = join(D02, 'audio/narration');
const [id, PIC, OUT_FULL, OUT_MF] = process.argv.slice(2);
const h = HOOKS[id]; if (!h || h.parked) throw new Error(`hook ${id} unknown or parked`);
const H = h.hold, DUR = +(H + BODY.at(-1).t1).toFixed(2);
const W = '/tmp/claude-1000/-workspaces-actiqo-motion/86b47b57-f058-4fdf-aa1c-0227865b12fc/scratchpad/d02snd'; mkdirSync(W, { recursive: true });
execFileSync('node', [join(D01SND, 'synth.mjs')], { stdio: 'ignore' }); // D01 synth → its git-ignored out/

const ms = (t) => Math.round(t * 1000);
const inputs = []; const add = (f) => { inputs.push(f); return inputs.length - 1; };
const iSnd = { enter: add(join(D01SND, 'out/sfx_enter.wav')), tap: add(join(D01SND, 'out/sfx_tap.wav')), sel: add(join(D01SND, 'out/sfx_tap_select.wav')),
  saved: add(join(D01SND, 'locked/sfx_saved_v01.wav')), pad: add(join(D01SND, 'out/bed_pad.wav')), rh: add(join(D01SND, 'out/bed_rhythm.wav')) };
const iBody = add(join(NARR, BODY_VO.file)), iCta = add(join(NARR, CTA_VO.file));
const iHook = h.vo ? add(join(NARR, h.vo.file)) : null;
const f = []; const voIv = [];
const clip = (i, a, b, at, g, label) => { f.push(`[${i}:a]atrim=${a}:${b},asetpts=N/SR/TB,aformat=sample_rates=48000:channel_layouts=stereo,afade=t=in:d=0.02,afade=t=out:st=${(b - a - 0.04).toFixed(3)}:d=0.04,volume=${g},adelay=${ms(at)}|${ms(at)},apad=whole_dur=${DUR}[${label}]`); };
const vo = [];
if (h.vo) { // hook VO segments, butted together (only the internal pause is tightened; no time-stretch)
  let at = 0.05; h.vo.segs.forEach(([a, b], k) => { clip(iHook, a, b, at, h.vo.gain, `hk${k}`); vo.push(`[hk${k}]`); at += b - a; }); voIv.push([0.05, at]);
}
clip(iBody, BODY_VO.src[0], BODY_VO.src[1], H + BODY_VO.at, BODY_VO.gain, 'body'); vo.push('[body]'); voIv.push([H + BODY_VO.at, H + BODY_VO.at + BODY_VO.src[1] - BODY_VO.src[0]]);
clip(iCta, CTA_VO.src[0], CTA_VO.src[1], H + CTA_VO.at, CTA_VO.gain, 'cta'); vo.push('[cta]'); voIv.push([H + CTA_VO.at, H + CTA_VO.at + CTA_VO.src[1] - CTA_VO.src[0]]);
f.push(`${vo.join('')}amix=inputs=${vo.length}:normalize=0,highpass=f=80:poles=1[narr]`);
const sfx = (i, at, g, label) => f.push(`[${i}:a]volume=${g},adelay=${ms(at)}|${ms(at)},apad=whole_dur=${DUR}[${label}]`);
sfx(iSnd.enter, H - 0.30, 0.22, 'enter');      // soft air → felt pluck on the cut into ACTIQO
sfx(iSnd.tap, H + 1.22, 0.12, 't1');           // real tap: What to bring (screen changes ≈ H+1.26)
sfx(iSnd.sel, H + 2.80, 0.13, 't2');           // real tap: Water bottle checkbox (src 7.03 → H+2.83)
sfx(iSnd.saved, H + 4.00, 0.21, 'saved');      // PAYOFF: "Prep complete" (locked D01 Saved cue)
// bed: same D01 bed, offset so its release (bed 9.723 s) lands on Prep complete (H+4.00); ducked under every VO line
const off = +(9.723 - (H + 4.0)).toFixed(3);
// duck envelope: 0.30 inside (merged) VO intervals, 0.75 outside, 0.15 s ramps; 0.3 s fade-in, 0.6 s fade-out; sampled every 0.1 s
const r = 0.15, merged = [];
for (const [a, b] of [...voIv].sort((x, y) => x[0] - y[0])) { const m = merged.at(-1); if (m && a - m[1] < 2 * r + 0.05) m[1] = Math.max(m[1], b); else merged.push([a, b]); }
const level = (t) => { let v = 0.75; for (const [a, b] of merged) { if (t >= a && t <= b) return 0.30; const d = t < a ? a - t : t - b; if (d < r) v = Math.min(v, 0.30 + (0.45 * d) / r); } return v; };
const gain = (t) => level(t) * Math.min(1, t / 0.3) * Math.min(1, Math.max(0, (DUR - t) / 0.6));
const raw = []; for (let i = 0; i <= Math.round(DUR * 10); i++) raw.push([+(i / 10).toFixed(2), +gain(i / 10).toFixed(3)]);
const pts = raw.filter((p, i) => i === 0 || i === raw.length - 1 || Math.abs((p[1] - raw[i - 1][1]) - (raw[i + 1][1] - p[1])) > 1e-6); // keep slope changes only
let env = `${pts.at(-1)[1]}`; for (let i = pts.length - 2; i >= 0; i--) { const [t0, v0] = pts[i], [t1, v1] = pts[i + 1]; const k = ((v1 - v0) / (t1 - t0)).toFixed(4); env = `if(lt(t,${t1}),${v0}+${k}*(t-${t0}),${env})`; }
f.push(`[${iSnd.pad}:a]volume=0.56[pad];[${iSnd.rh}:a]volume=0.285[rh];[pad][rh]amix=inputs=2:normalize=0,atrim=${off}:${(off + DUR).toFixed(3)},asetpts=N/SR/TB,volume='${env}':eval=frame[bed]`);
const run = (withBed, out) => {
  const ins = `[narr][enter][t1][t2][saved]${withBed ? '[bed]' : ''}`; const n = withBed ? 6 : 5;
  const graph = [...f, ...(withBed ? [] : ['[bed]anullsink']), `${ins}amix=inputs=${n}:normalize=0,atrim=0:${DUR},asetpts=N/SR/TB,volume=11.9dB,aresample=192000,alimiter=limit=0.8414:attack=1:release=60:level=disabled,aresample=48000[m]`].join(';');
  const wav = join(W, `${id}_${withBed ? 'full' : 'mf'}.wav`);
  execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...inputs.flatMap((x) => ['-i', x]), '-filter_complex', graph, '-map', '[m]', '-c:a', 'pcm_s24le', '-ar', '48000', wav]);
  execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-i', PIC, '-i', wav, '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '320k', '-ar', '48000', '-movflags', '+faststart', '-t', String(DUR), out]);
};
run(true, OUT_FULL); if (OUT_MF) run(false, OUT_MF);
console.log(JSON.stringify({ id, H, DUR, bedOffset: off, vo: voIv.map(([a, b]) => [+a.toFixed(2), +b.toFixed(2)]) }));
