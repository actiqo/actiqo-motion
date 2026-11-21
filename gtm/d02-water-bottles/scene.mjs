// D02 · "Six Water Bottles". The single timeline source (checkpoint draft, data only, nothing renders yet).
// One reusable body + one CTA; only the hook line (and its hold) changes per variant.
// Times are seconds at 30 fps. Mirrors brief/D02_BRIEF.md and brief/HOOKS.md: change them together.

export const FPS = 30;
export const FORMAT = { W: 1080, H: 1920 };

/** Hooks: same opener footage (S1), different on-screen line. `hold` = opener length; the body starts at `hold`. */
export const HOOKS = {
  d02_waterbottles: { variant: 'A', primary: true, line: 'Six water bottles. None in the bag.', hold: 2.70, vo: { file: 'd02_vo_hook_waterbottles.wav', segs: [[0.00, 1.45], [1.70, 2.82]], gain: 0.417 } }, // narrated; pause after "bottles." tightened 0.37→0.12 s
  d02_20minutes:    { variant: 'B', line: 'Practice starts in 20 minutes. Guess what we forgot.', hold: 2.50, vo: null }, // text only: spoken (3.6 s) would push B to ~10.9 s
  d02_alwaysforget: { variant: 'C', line: 'The one thing we always forget before practice.', hold: 2.0, parked: true }, // PARKED 2026-11-21 (draft kept, not advanced)
  d02_ownsix:       { variant: 'D', line: 'Somehow we own six of these.', hold: 2.50, vo: { file: 'd02_vo_hook_ownsix.wav', segs: [[0.00, 2.40]], gain: 0.569 } },
};

/** Opener: object shot, AI-generated (people-free), shared by every hook. */
export const OPENER = { id: 'S1', src: 'gen', asset: 'generations/review/s1/d02_s1_bottles_fast_v01.mp4', in: 0.3, note: 'LOCKED Veo Fast v01 (req 01a1fbf8): hand checks the open bag, no bottle inside, six bottles beside it' };

/** Body, in seconds relative to the hook end. REAL ACTIQO capture only (ui/capture/d02_ui_flow_9x16.mp4); `in` comes from ui/beats.json. */
export const BODY = [
  { id: 'S2', t0: 0.00, t1: 1.30, src: 'ui', beat: 'gameplan',     note: 'Game Plan: "What to bring · Water bottle, Cleats, Shin guards · 0/3" → tap' },
  { id: 'S3', t0: 1.30, t1: 2.60, src: 'ui', beat: 'prepOpen',     note: 'Prep list: "3 items to pack" · Water bottle "Not packed" (waiting ~1.9×)' },
  { id: 'S4', t0: 2.60, t1: 4.00, src: 'ui', beat: 'bottleTap',    note: 'tap Water bottle → "1 of 3 packed" (real speed)' },
  { id: 'S5', t0: 4.00, t1: 5.30, src: 'ui', beat: 'prepComplete', note: '"Prep complete" / "Everything on the prep list is packed" (payoff: Saved cue + bed release)', hold: true },
  { id: 'S6', t0: 5.30, t1: 7.30, src: 'brand', note: 'End card' },
];

export const END_CARD = {
  wordmark: '../../brand/logo/current/actiqo-wordmark-navy-teal_trimmed.png', // official raster, flat teal Q
  cta: 'Try it with your next practice.',
  url: 'getactiqo.com',
  secondary: null, // "Complimentary Family access during Early Access" only if it fits without weakening the CTA (default: omitted)
};

/** Absolute timeline for one hook. */
export function timelineFor(hookId) {
  const h = HOOKS[hookId]; if (!h) throw new Error(`unknown hook ${hookId}`);
  const shots = [{ ...OPENER, t0: 0, t1: h.hold, hook: h.line }, ...BODY.map((s) => ({ ...s, t0: +(s.t0 + h.hold).toFixed(2), t1: +(s.t1 + h.hold).toFixed(2) }))];
  return { hookId, duration: +(h.hold + BODY.at(-1).t1).toFixed(2), shots };
}
// Narration (Sarah, ACTIQO via IPA /ˈæktɛkoʊ/): hook VO 0.05→; body VO at body+0.05 (src 0–4.95); CTA VO (D01 final take src 8.50–10.15) at body+5.45.
// Durations: A 10.00 · B 9.80 · D 9.80 (C parked).
export const BODY_VO = { file: 'd02_vo_body.wav', src: [0.0, 4.95], at: 0.05, gain: 0.484 };
export const CTA_VO = { file: '../../../d01-pickup/v2/audio/final/d01_narration_sarah_final.wav', src: [8.50, 10.15], at: 5.45, gain: 0.484 };

export const TOKENS = '../../brand/actiqo-motion-tokens.css'; // the only style source
