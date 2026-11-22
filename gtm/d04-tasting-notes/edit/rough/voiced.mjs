// D04 VOICED rough cut v02: timeline data shared by build_v02.mjs (picture) and sound/mix_v02.mjs (sound).
// All visuals LOCKED. Voice = Alec's REAL recorded takes (no clone, no TTS, no lip-sync yet).
export const DUR = 19.40;
// Founder timing correction, LOCKED 2026-11-22: +0.17 s on the founder-section audio + its captions + product cues. It compensates the
// ≈0.17 s early AAC source-trim/decode offset of the phone memos. D04_FOUNDER_DELAY overrides it (0 reproduces the pre-correction master).
const FD = +(process.env.D04_FOUNDER_DELAY ?? 0.17);
const d = (x) => +(x + FD).toFixed(3);

// Real voice trims (seconds in the original memos), cut inside real pauses (silencedetect −40 dB) + local ASR word timings.
// takeA = "gtm/d04-tasting-notes/audio/source/d04_alec_voice_take1.m4a" (slate "take one"), takeB = "gtm/d04-tasting-notes/audio/source/d04_alec_voice_take2.m4a" (slate "take two").
export const VO = [
  { id: 'open',    take: 'A', src: [4.56, 9.56],   at: 0.20, gainDb: 2.5, note: '"Notes of blackberry. Hints of oak." (0.76 s natural pause) "Twelve texts about tomorrow\'s soccer practice." Voice-over on the tasting' },
  { id: 'founder', take: 'B', src: [8.55, 11.00],  at: d(6.10), gainDb: 0.2, note: '"I\'m Alec, the dad behind Cork Connoisseur."' },
  { id: 'product', take: 'B', src: [11.18, 14.54], at: d(8.65), gainDb: 1.0, note: '"I also built ACTIQO to keep pickup, packing and leave times together."' },
  { id: 'closing', take: 'B', src: [14.97, 18.34], at: 12.10, gainDb: 0.2, note: '"Try it with your next practice. Then we can get back to the tasting notes." (stray "yeah" at 14.62–14.85 excluded)' },
];
// Word landmarks on the timeline (from ASR): "oak." ends 2.03 · "Twelve" 2.78 · "practice." ends 5.14 · "Connoisseur." ends 8.50 ·
// "pickup" 10.03 · "packing" 10.51 · "leave times" 10.99 · product ends 12.00 · "Try" 12.21 · "practice." ends ≈13.7 · "Then" 13.94 · "notes." ends ≈15.75
export const SHOTS = [
  { id: 'open',  src: 'opener.mp4',  t0: 0.00,  d: 6.00, ms: 0.00 },  // LOCKED opener, full 6 s
  { id: 'found', src: 'founder.mp4', t0: 6.00,  d: 6.00, ms: 0.00 },  // LOCKED founder, full 6 s, real speed
  { id: 'close', src: 'closing.mp4', t0: 12.00, d: 4.90, ms: 0.00 },  // LOCKED closing, src 0.0–4.9, clean cut to end card
];
export const END = { t0: 16.90, t1: 19.40 };
export const PROD = { t0: d(8.65), t1: 12.00, packing: d(10.42), leave: d(10.92) }; // Layout B window; pans land on the spoken words
export const CAP = [
  { t0: 0.20,  t1: 2.15,  txt: 'Notes of blackberry. Hints of oak.' },
  { t0: 2.72,  t1: 5.80,  txt: 'Twelve texts about tomorrow’s soccer practice.' },
  { t0: d(6.10),  t1: d(8.60),  txt: 'I’m Alec, the dad behind Cork Connoisseur.' },
  { t0: d(8.65),  t1: 12.00, txt: 'I also built ACTIQO to keep pickup, packing and leave times together.', top: true },
  { t0: 12.10, t1: 13.85, txt: 'Try it with your next practice.' },
  { t0: 13.90, t1: 16.90, txt: 'Then we can get back to the tasting notes.' },
];
export const SFX = { notify1: 2.00, notify2: 2.62, endChime: 16.90 }; // two quiet synthesized notification blips on the phone glow / glance; soft chime on the end card
