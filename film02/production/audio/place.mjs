// Film 02 · place licensed audio assets on the LOCKED timeline → the four stems: node audio/place.mjs [manifest]
// Reads audio/assets.json (default): every placement names a library file from audio/assets/ and a time on the picture's
// own timeline, written as seconds (17.5), a timeline key ("@cleatsDown"), or a key plus an offset ("@cleatsDown+0.3").
// Footsteps are placed automatically on the gait simulator's heel strikes (cues.json), round-robin through each walker's takes.
// Output: audio/stems/{music,ambience,foley,ui}.wav (48 kHz / 24-bit stereo, exactly 30.000 s); then run audio/mix.mjs.
// No sound is synthesised here: every sample in a stem comes from a supplied file.
import { execFileSync } from 'node:child_process';
import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { T } from '../film/scene.mjs';

const A = new URL('./', import.meta.url).pathname;
const M = JSON.parse(readFileSync(process.argv[2] || A + 'assets.json', 'utf8'));
const CUES = JSON.parse(readFileSync(A + 'cues.json', 'utf8'));
const DUR = 30, SR = 48000;
const ROOT = process.env.AUDIO_ASSETS || A + 'assets/';
const ASSET = (f) => { const p = f.startsWith('/') ? f : ROOT + f; if (!existsSync(p)) throw new Error('missing asset: ' + f); return p; };

/**
 * "@key", "@key+0.3", "@key-0.1" or a number → seconds on the film timeline.
 * Prefix "beat:" or "bar:" snaps the time to the NEAREST beat / bar line of the music (manifest `grid`: { bpm, downbeat, beatsPerBar }),
 * where `downbeat` is the film time of any bar line. Arrangement changes then land on the music's own grid, not mid-beat.
 */
const at = (v) => {
  if (typeof v === 'number') return v;
  let str = String(v).trim(), snap = null, after = 0;
  const pa = /^(.*)\|\s*([+-][\d.]+)$/.exec(str); if (pa) { str = pa[1].trim(); after = +pa[2]; }   // "beat:@leave|+0.3": snap, THEN offset
  const q = /^(beat|bar):(.*)$/.exec(str); if (q) { snap = q[1]; str = q[2].trim(); }
  let t;
  if (/^-?[\d.]+$/.test(str)) t = +str;
  else {
    const m = /^@(\w+)\s*([+-]\s*[\d.]+)?$/.exec(str);
    if (!m || T[m[1]] == null) throw new Error('bad time: ' + v);
    t = T[m[1]] + (m[2] ? +m[2].replace(/\s/g, '') : 0);
  }
  if (!snap) return t + after;
  if (!M.grid?.bpm) throw new Error(`"${v}" needs a music grid (manifest grid.bpm / grid.downbeat)`);
  const step = (60 / M.grid.bpm) * (snap === 'bar' ? M.grid.beatsPerBar || 4 : 1), d0 = M.grid.downbeat || 0;
  return d0 + Math.round((t - d0) / step) * step + after;
};

/** the sync point inside a file: a number (s), or "auto" = first moment the file rises above `db` dBFS (skips library pre-roll) */
const onsetCache = new Map();
const onset = (file, v, db = -40) => {
  if (typeof v === 'number') return v;
  if (v !== 'auto') return 0;
  const k = file + db; if (onsetCache.has(k)) return onsetCache.get(k);
  const e = execFileSync('sh', ['-c', `ffmpeg -hide_banner -nostats -i "${file}" -af silencedetect=n=${db}dB:d=0.002 -f null - 2>&1`]).toString();
  const s0 = /silence_start: (-?[\d.]+)/.exec(e), s1 = /silence_end: ([\d.]+)/.exec(e);
  const v2 = s0 && Math.abs(+s0[1]) < 0.001 && s1 ? +s1[1] : 0;
  onsetCache.set(k, v2); return v2;
};

const fileDur = (f) => +execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString().trim();

/**
 * One placed clip → an ffmpeg filter chain. p: { file, at, offset ('auto'|s), dur, gain_db, fade_in, fade_out, pan (-1..1), rate? }
 * The file's sync point (offset) lands exactly on `at`. A sync point earlier than the clip's own pre-roll is kept: the
 * pre-roll then starts before `at` (e.g. a bag-lift whose rustle leads the lift).
 */
function chain(i, p) {
  const t = at(p.at);
  // align_end: the file's own ending lands exactly on the film's last frame (a track that resolves naturally at 30.0 s)
  const off = p.align_end ? Math.max(0, fileDur(p.path) - (DUR - t)) : onset(p.path, p.offset ?? 'auto', p.onsetDb);
  const lead = Math.min(off, t, p.lead ?? off);            // how much of the file before the sync point to keep
  const start = off - lead, when = t - lead;
  const len = Math.min(p.dur != null ? p.dur + lead : Infinity, DUR - when);   // never past the film's end, so end fades land on 30.0 s
  const f = [`[${i}]aresample=${SR}`, 'aformat=channel_layouts=stereo', `atrim=start=${start.toFixed(4)}:duration=${len.toFixed(4)}`, 'asetpts=PTS-STARTPTS'];
  if (p.fade_in) f.push(`afade=t=in:d=${p.fade_in}`);
  if (p.fade_out) f.push(`areverse,afade=t=in:d=${p.fade_out},areverse`);
  if (p.gain_db) f.push(`volume=${p.gain_db}dB`);
  if (p.pan) { const l = Math.min(1, 1 - p.pan), r = Math.min(1, 1 + p.pan); f.push(`pan=stereo|c0=${l.toFixed(3)}*c0|c1=${r.toFixed(3)}*c1`); }
  if (p.automation) {                                      // [[t, dB], ...] in film time: linear dB ramps between points
    const pts = p.automation.map(([tt, db]) => [at(tt) - when, db]);
    pts.forEach(([x], k) => { if (k && x < pts[k - 1][0] - 1e-6) throw new Error(`automation out of order in "${p.cue || p.file}" at point ${k}: ${JSON.stringify(p.automation[k])}`); });
    let expr = `${pts[pts.length - 1][1]}`;
    for (let k = pts.length - 2; k >= 0; k--) { const [t0, d0] = pts[k], [t1, d1] = pts[k + 1];
      expr = `if(lt(t,${t1.toFixed(4)}),${d0}+(${d1}-(${d0}))*max(0,(t-${t0.toFixed(4)}))/${Math.max(1e-4, t1 - t0).toFixed(4)},${expr})`; }
    f.push(`volume='pow(10,(if(lt(t,${pts[0][0].toFixed(4)}),${pts[0][1]},${expr}))/20)':eval=frame`);
  }
  f.push(`adelay=${Math.round(when * 1000)}:all=1`);
  return f.join(',') + `[s${i}]`;
}

function stem(name, placements) {
  const out = A + `stems/${name}.wav`;
  const W = ['-c:a', 'pcm_s24le', '-ar', String(SR), '-ac', '2'];
  if (!placements.length) {                               // an empty stem is honest silence, not a stand-in sound
    execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-f', 'lavfi', '-i', `anullsrc=r=${SR}:cl=stereo`, '-t', String(DUR), ...W, out]);
    return 0;
  }
  const ins = placements.flatMap((p) => ['-i', p.path]);
  const g = placements.map((p, i) => chain(i, p)).join(';') + ';' + placements.map((_, i) => `[s${i}]`).join('')
    + `amix=inputs=${placements.length}:normalize=0:duration=longest,apad=whole_dur=${DUR},atrim=0:${DUR}[o]`;
  execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...ins, '-filter_complex', g, '-map', '[o]', ...W, out]);
  return placements.length;
}

// ── collect placements per stem ──
const S = { music: [], ambience: [], foley: [], ui: [] };
const add = (p) => { if (!S[p.stem]) throw new Error('unknown stem: ' + p.stem + ' (' + (p.cue || p.file) + ')'); S[p.stem].push({ ...p, path: ASSET(p.file) }); };
for (const m of M.music || []) add({ stem: 'music', offset: 0, ...m });
for (const e of M.events || []) add(e);
// footsteps on the simulated heel strikes; weight follows walking speed (a settling step is lighter), far foot a touch quieter
for (const [who, cfg] of Object.entries(M.footsteps || {})) {
  const steps = CUES.footfalls.filter((s) => s.who === who && s.t >= (cfg.from ?? 0) && s.t <= (cfg.to ?? DUR));
  steps.forEach((s, n) => add({ stem: 'foley', cue: `${who} step ${n + 1}`, file: cfg.files[n % cfg.files.length], at: s.t, offset: cfg.offset ?? 'auto',
    lead: cfg.lead ?? 0.02, dur: cfg.dur, pan: cfg.pan, fade_out: cfg.fade_out ?? 0.03,
    gain_db: (cfg.gain_db ?? 0) + 20 * Math.log10(0.55 + 0.45 * s.moving) + (s.foot === 'far' ? (cfg.far_db ?? -1) : 0) }));
}
mkdirSync(A + 'stems', { recursive: true });
const report = {};
for (const k of Object.keys(S)) report[k] = stem(k, S[k]);
// placement log (what landed where), for review against CUES.md
const log = Object.entries(S).flatMap(([k, ps]) => ps.map((p) => ({ stem: k, cue: p.cue || '', file: p.file, at: +at(p.at).toFixed(3), frame: Math.round(at(p.at) * 30) })))
  .sort((a, b) => a.at - b.at);
writeFileSync(A + 'stems/placements.json', JSON.stringify(log, null, 1));
console.log('stems written:', Object.entries(report).map(([k, n]) => `${k} ${n} clip(s)`).join(' · '));
