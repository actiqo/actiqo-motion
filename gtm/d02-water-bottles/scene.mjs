// D02 · "Six Water Bottles". The single timeline source (checkpoint draft, data only, nothing renders yet).
// One reusable body + one CTA; only the hook line (and its hold) changes per variant.
// Times are seconds at 30 fps. Mirrors brief/D02_BRIEF.md and brief/HOOKS.md: change them together.

export const FPS = 30;
export const FORMAT = { W: 1080, H: 1920 };

/** Hooks: same opener footage (S1), different on-screen line. `hold` = opener length; the body starts at `hold`. */
export const HOOKS = {
  d02_waterbottles: { variant: 'A', primary: true, line: 'Six water bottles. None in the bag.', hold: 1.75 },
  d02_20minutes:    { variant: 'B', line: 'Practice starts in 20 minutes. Guess what we forgot.', hold: 2.25 }, // longer line needs ~0.5 s more to read
  d02_alwaysforget: { variant: 'C', line: 'The one thing we always forget before practice.', hold: 1.75 },
  d02_ownsix:       { variant: 'D', line: 'Somehow we own six of these.', hold: 1.75 },
};

/** Opener: object shot, AI-generated (people-free), shared by every hook. */
export const OPENER = { id: 'S1', src: 'gen', asset: 'generations/selects/s1_bottles.mp4', in: 0.0, note: 'six bottles on the counter, open bag, no bottle inside' };

/** Body, in seconds relative to the hook end. REAL ACTIQO capture only (ui/capture/d02_ui_flow_9x16.mp4); `in` comes from ui/beats.json. */
export const BODY = [
  { id: 'S2', t0: 0.00, t1: 1.30, src: 'ui', beat: 'gameplan',     note: 'Game Plan: "What to bring · Water bottle, Cleats, Shin guards · 0/3"' },
  { id: 'S3', t0: 1.30, t1: 2.50, src: 'ui', beat: 'prepOpen',     note: 'Prep list: "3 items to pack" · Water bottle "Not packed"' },
  { id: 'S4', t0: 2.50, t1: 4.00, src: 'ui', beat: 'bottleTap',    note: 'tap Water bottle → "1 of 3 packed"' },
  { id: 'S5', t0: 4.00, t1: 5.50, src: 'ui', beat: 'prepComplete', note: '"Prep complete" / "Everything on the prep list is packed"', hold: true },
  { id: 'S6', t0: 5.50, t1: 7.75, src: 'brand', note: 'End card' },
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
// timelineFor('d02_waterbottles').duration === 9.50 · timelineFor('d02_20minutes').duration === 10.00

export const TOKENS = '../../brand/actiqo-motion-tokens.css'; // the only style source
