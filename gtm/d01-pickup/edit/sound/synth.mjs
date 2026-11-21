// D01 · audio v02 (phone translation): original sound design + restrained rhythmic bed, synthesized from scratch (no samples, no third-party audio).
// Deterministic: fixed PRNG seed. Output: 48 kHz stereo 24-bit WAVs in ./out (git-ignored; rebuilt by mix.sh).
// Musical frame: D major, 104 BPM, downbeat grid anchored at the product entry (timeline 2.80 s).
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SR = 48000, OUT = join(dirname(fileURLToPath(import.meta.url)), 'out');
mkdirSync(OUT, { recursive: true });

let seed = 0x0d01c0de; // mulberry32
const rnd = () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const noise = () => rnd() * 2 - 1;
const TAU = Math.PI * 2;
const hz = (m) => 440 * 2 ** ((m - 69) / 12); // MIDI → Hz

function buf(sec) { const n = Math.ceil(sec * SR); return [new Float32Array(n), new Float32Array(n)]; }
function add(b, i, l, r = l) { if (i >= 0 && i < b[0].length) { b[0][i] += l; b[1][i] += r; } }
function lp1(x, fc) { const a = 1 - Math.exp(-TAU * fc / SR); let y = 0; for (let i = 0; i < x.length; i++) { y += a * (x[i] - y); x[i] = y; } return x; }
function hp1(x, fc) { const y = Float32Array.from(x); lp1(y, fc); for (let i = 0; i < x.length; i++) x[i] -= y[i]; return x; }
function stereoLp(b, fc) { lp1(b[0], fc); lp1(b[1], fc); return b; }
function gain(b, g) { for (const ch of b) for (let i = 0; i < ch.length; i++) ch[i] *= g; return b; }

function wav(name, b) { // 24-bit PCM, TPDF dither
  const n = b[0].length, data = Buffer.alloc(n * 6);
  let peak = 0;
  for (let i = 0; i < n; i++) for (let c = 0; c < 2; c++) {
    peak = Math.max(peak, Math.abs(b[c][i]));
    let v = Math.round(Math.max(-1, Math.min(1, b[c][i])) * 8388607 + (rnd() - rnd()));
    v = Math.max(-8388608, Math.min(8388607, v)); data.writeIntLE(v, (i * 2 + c) * 3, 3);
  }
  const h = Buffer.alloc(44);
  h.write('RIFF', 0); h.writeUInt32LE(36 + data.length, 4); h.write('WAVEfmt ', 8); h.writeUInt32LE(16, 16);
  h.writeUInt16LE(1, 20); h.writeUInt16LE(2, 22); h.writeUInt32LE(SR, 24); h.writeUInt32LE(SR * 6, 28);
  h.writeUInt16LE(6, 32); h.writeUInt16LE(24, 34); h.write('data', 36); h.writeUInt32LE(data.length, 40);
  writeFileSync(join(OUT, name), Buffer.concat([h, data]));
  console.log(`${name}  ${(n / SR).toFixed(3)} s  peak ${(20 * Math.log10(peak || 1e-9)).toFixed(1)} dBFS`);
}

// ---------- UI sound design ----------
// Tactile tap: a felt-tip click (band-limited noise, 4 ms) + a soft wooden body (pitch-dropping sine) + a low "seat".
function tap(firm = 1, pitch = 1) { // v02: + a soft 2–4 kHz felt transient and a slightly longer upper-mid body
  const b = tapV1(firm, pitch), n = b[0].length;
  const tr = new Float32Array(n);
  for (let i = 0; i < 0.007 * SR; i++) tr[i] = noise() * (1 - i / (0.007 * SR)) ** 2;
  hp1(tr, 2000); hp1(tr, 2000); lp1(tr, 4200); lp1(tr, 4200);
  let ph = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR; ph += TAU * 2600 * pitch / SR;
    const knock = Math.sin(ph) * Math.exp(-t / 0.0045) * 0.10;
    const v = tr[i] * 1.35 + knock * 1.4;
    add(b, i, v, v * 0.97);
  }
  return b;
}
function tapV1(firm = 1, pitch = 1) {
  const b = buf(0.14), n = b[0].length;
  const click = new Float32Array(n);
  for (let i = 0; i < 0.004 * SR; i++) click[i] = noise() * (1 - i / (0.004 * SR));
  hp1(click, 1800); lp1(click, 5200);
  let ph = 0, ph2 = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const f = (1250 + 350 * Math.exp(-t / 0.006)) * pitch;
    ph += TAU * f / SR; ph2 += TAU * 190 * pitch / SR;
    const body = Math.sin(ph) * Math.exp(-t / 0.016) * 0.32;
    const seat = Math.sin(ph2) * Math.exp(-t / 0.028) * 0.22 * firm;
    const v = (click[i] * 0.30 + body + seat) * Math.min(1, t / 0.0006);
    add(b, i, v * 0.98, v);
  }
  return stereoLp(b, 7000);
}

// Warm bell tone for the confirmation: sine + soft partials, 6 ms attack, long gentle decay, slight stereo offset.
function bell(b, t0, midi, amp, decay = 0.42, pan = 0) {
  const f = hz(midi), s = Math.round(t0 * SR), n = Math.round((decay * 5) * SR);
  for (let i = 0; i < n; i++) {
    const t = i / SR, e = Math.min(1, t / 0.006) * Math.exp(-t / decay);
    const v = (Math.sin(TAU * f * t) + 0.22 * Math.sin(TAU * 2 * f * t) * Math.exp(-t / 0.12) + 0.06 * Math.sin(TAU * 3.01 * f * t) * Math.exp(-t / 0.06)) * e * amp;
    add(b, s + i, v * (1 - pan * 0.3), v * (1 + pan * 0.3));
  }
}

function saved() { // two-note rising fifth in D (D5 → A5) with a felt "seat" underneath: the warmest moment, still small
  const b = buf(2.4);
  const seat = tapV1(1.1, 0.8); // unchanged from v01 for (let i = 0; i < seat[0].length; i++) add(b, i, seat[0][i] * 0.55, seat[1][i] * 0.55);
  bell(b, 0.000, 74, 0.20, 0.40, -0.4); // D5
  bell(b, 0.085, 81, 0.17, 0.55, 0.4);  // A5
  bell(b, 0.085, 69, 0.07, 0.65, 0.0);  // A4 underlay for warmth
  return stereoLp(b, 6500);
}

function enter() { // into ACTIQO: a soft air lift (band-swept noise) resolving into one low felt pluck; no whoosh
  const b = buf(1.2), n = Math.round(0.30 * SR);
  const air = new Float32Array(n);
  for (let i = 0; i < n; i++) air[i] = noise();
  let y = 0; for (let i = 0; i < n; i++) { const t = i / n; const fc = 500 + 2600 * t; const a = 1 - Math.exp(-TAU * fc / SR); y += a * (air[i] - y); air[i] = y * (t ** 1.6) * (1 - t) ** 0.4; }
  hp1(air, 300);
  const s0 = Math.round(0.02 * SR);
  for (let i = 0; i < n; i++) add(b, s0 + i, air[i] * 0.10, air[i] * 0.12);
  bell(b, 0.30, 62, 0.10, 0.30, 0); // D4 felt pluck exactly on the cut
  return stereoLp(b, 6000);
}

// ---------- Rhythmic/ambient bed (104 BPM, D major) ----------
const DUR = 15.0, BPM = 104, BEAT = 60 / BPM, GRID0 = 2.80; // beat k at GRID0 + k·BEAT
const beatT = (k) => GRID0 + k * BEAT;
// Bars from the product entry: Bm7 | Gmaj7 | Em7 → A7sus4 | Dmaj9 (release at 9.72 ≈ the resolved cut 9.70) | Dmaj9 held
const CHORDS = [
  { t: 0, notes: [47, 54, 57, 62, 66] },        // Bm7 (pre-roll under dialogue, ducked)
  { t: beatT(4), notes: [43, 50, 54, 59, 62] },  // Gmaj7
  { t: beatT(8), notes: [40, 47, 50, 55, 62] },  // Em7
  { t: beatT(10), notes: [45, 52, 55, 57, 62] }, // A7sus4
  { t: beatT(12), notes: [38, 50, 54, 57, 64, 69] }, // Dmaj9 (release / alignment)
];
const chordAt = (t) => { let c = CHORDS[0]; for (const x of CHORDS) if (t >= x.t) c = x; return c; };

function pad() {
  const b = buf(DUR);
  for (let ci = 0; ci < CHORDS.length; ci++) {
    const c = CHORDS[ci], t1 = ci + 1 < CHORDS.length ? CHORDS[ci + 1].t : DUR;
    const s = Math.round(c.t * SR), e = Math.round(Math.min(DUR, t1 + 0.25) * SR);
    for (const m of c.notes) {
      const f = hz(m + 12 * (m < 45 ? 1 : 0)); // keep the pad above ~110 Hz
      for (let d = -1; d <= 1; d++) {
        const fd = f * (1 + d * 0.0035), p0 = rnd() * TAU;
        for (let i = s; i < e; i++) {
          const t = (i - s) / SR, tt = i / SR;
          const att = Math.min(1, t / (ci === 0 ? 0.8 : 0.22));
          const rel = Math.min(1, (e - i) / (0.25 * SR));
          const lfo = 1 + 0.15 * Math.sin(TAU * 0.23 * tt + d);
          const v = (Math.sin(TAU * fd * t + p0) + 0.18 * Math.sin(TAU * 2 * fd * t + p0)) * att * rel * lfo * 0.020;
          add(b, i, v * (1 - d * 0.35), v * (1 + d * 0.35));
        }
      }
    }
  }
  // v02: shelve the low end out of the pad (HP 200 Hz ×2), open the top slightly (LP 2.4 kHz)
  for (const ch of b) { hp1(ch, 200); hp1(ch, 200); lp1(ch, 2400); }
  // v02: faint midrange harmonic over the end card so the last 2.8 s survive a phone speaker (F#5 + A5, Dmaj9 tones)
  for (const [m, pan] of [[78, -0.3], [81, 0.3]]) {
    const f = hz(m), s0 = Math.round(12.03 * SR), e0 = Math.round(DUR * SR);
    for (let i = s0; i < e0; i++) {
      const t = (i - s0) / SR, env = Math.min(1, t / 0.6) * Math.min(1, (e0 - i) / (1.2 * SR));
      const v = Math.sin(TAU * f * t + m) * (1 + 0.2 * Math.sin(TAU * 0.4 * t)) * env * 0.0085;
      add(b, i, v * (1 - pan), v * (1 + pan));
    }
  }
  return b;
}

function rhythm() {
  const b = buf(DUR);
  const kick = (t0, amp) => { const s = Math.round(t0 * SR); let ph = 0; for (let i = 0; i < 0.35 * SR; i++) { const t = i / SR; ph += TAU * (52 + 40 * Math.exp(-t / 0.03)) / SR; const body = Math.sin(ph) * Math.exp(-t / 0.10); const knock = Math.sin(ph * 9.5) * Math.exp(-t / 0.014) * 0.55; const v = (body + knock) * Math.min(1, t / 0.002) * amp; add(b, s + i, v); } }; // v02: shorter sub, soft ~900 Hz knock so the pulse reads on phones
  const shaker = (t0, amp, pan) => { const s = Math.round(t0 * SR), n = Math.round(0.07 * SR); const x = new Float32Array(n); for (let i = 0; i < n; i++) x[i] = noise(); hp1(x, 2500); hp1(x, 2500); lp1(x, 7000); lp1(x, 7000); /* v02: presence band 2.5–7 kHz */ for (let i = 0; i < n; i++) { const t = i / SR; const v = x[i] * Math.min(1, t / 0.008) * Math.exp(-t / 0.022) * amp; add(b, s + i, v * (1 - pan), v * (1 + pan)); } };
  const bass = (t0, m, amp, len) => { const s = Math.round(t0 * SR), f = hz(m); for (let i = 0; i < len * SR; i++) { const t = i / SR; const v = (0.8 * Math.sin(TAU * f * t) + 0.32 * Math.sin(TAU * 2 * f * t) + 0.16 * Math.sin(TAU * 3 * f * t) + 0.09 * Math.sin(TAU * 4 * f * t)) * Math.min(1, t / 0.01) * Math.exp(-t / (len * 0.6)) * amp; add(b, s + i, v); } }; // v02: harmonics carry the bass line above 180 Hz
  const pluck = (t0, m, amp, pan) => { const s = Math.round(t0 * SR), f = hz(m); for (let i = 0; i < 0.5 * SR; i++) { const t = i / SR; const v = (Math.sin(TAU * f * t) + 0.45 * Math.sin(TAU * 2 * f * t) * Math.exp(-t / 0.06) + 0.22 * Math.sin(TAU * 3 * f * t) * Math.exp(-t / 0.035) + 0.10 * Math.sin(TAU * 4 * f * t) * Math.exp(-t / 0.02)) * Math.min(1, t / 0.003) * Math.exp(-t / 0.12) * amp; add(b, s + i, v * (1 - pan * 0.4), v * (1 + pan * 0.4)); } }; // v02: 3rd/4th partials → 0.7–4 kHz presence, still a soft muted pluck
  const END = 16; // groove runs beats 0–15 (2.80 → 12.03), then lands
  for (let k = 0; k < END; k++) {
    const t = beatT(k), c = chordAt(t + 0.01), released = k >= 12;
    if (k % 2 === 0) kick(t, 0.13);
    if (k % 4 === 0 || k % 4 === 2) bass(t, c.notes[0] - (c.notes[0] > 45 ? 12 : 0), 0.085, BEAT * 1.6);
    // shaker: 8ths with a light swing while things are being sorted; quarters after the release
    shaker(t, released ? 0.09 : 0.11, -0.3);
    if (!released) shaker(t + BEAT * 0.54, 0.064, 0.3);
    // muted pluck on the off-beats, chord tones walking up; after the release a simpler, higher motif
    const tones = c.notes.slice(1);
    if (!released) pluck(t + BEAT * 0.5, tones[k % tones.length] + 12, 0.085, (k % 2) ? 0.5 : -0.5);
    else if (k % 2 === 0) pluck(t + BEAT * 0.5, [74, 76, 78, 81][(k / 2) % 4], 0.088, (k % 4) ? 0.5 : -0.5);
  }
  // landing: one soft chord pluck on the downbeat at 12.03 (just before the end card), then space
  for (const [m, p] of [[62, -0.4], [66, 0.0], [69, 0.4], [76, 0.1]]) pluck(beatT(END), m, 0.065, p);
  bass(beatT(END), 38, 0.08, 1.4);
  return stereoLp(b, 8500);
}

wav('sfx_tap.wav', tap(1.0, 1.0));
wav('sfx_tap_select.wav', tap(0.9, 1.12));
wav('sfx_tap_save.wav', tap(1.15, 0.94));
// Saved is LOCKED at v01: the mix uses sound/locked/sfx_saved_v01.wav (exact v01 render, from commit a624d04).
// saved() is kept here for reference only.
wav('sfx_enter.wav', enter());
wav('bed_pad.wav', pad());
wav('bed_rhythm.wav', rhythm());
console.log(`grid: 104 BPM, beat ${BEAT.toFixed(4)} s, downbeat 2.80; release beat 12 = ${beatT(12).toFixed(3)} s; landing beat 16 = ${beatT(16).toFixed(3)} s`);
