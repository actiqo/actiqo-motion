// D01 · "Pickup was handled." The single timeline source (v1, data only, nothing renders yet).
// A later gtm/scripts/build.mjs turns this into a HyperFrames composition (hyperframes@0.8.98, as Film 01).
// Times are seconds at 30 fps. Mirrors brief/D01_SHOTLIST.md: change both together.

export const FPS = 30;
export const FORMAT = { W: 1080, H: 1920, duration: 15.0 };
export const SAFE = { top: 220, bottom: 1540 }; // keep text and key UI rows inside this band (9:16 platform chrome)

/** src: 'gen' = external video model · 'ui' = real ACTIQO capture · 'brand' = official brand assets */
export const SHOTS = [
  { id: 'S1', t0: 0.0, t1: 34 / 30, src: 'gen', asset: 'generations/selects/s1.mp4', in: null, note: 'Alex (A), car keys' },
  { id: 'S2', t0: 34 / 30, t1: 2.0, src: 'gen', asset: 'generations/selects/s2.mp4', in: null, note: 'Jordan (B), youth soccer bag' },
  { id: 'S3', t0: 2.0, t1: 4.0, src: 'ui', asset: 'ui/capture/flow.mov', in: null, note: 'Activity: Game Plan, open pickup visible', push: [1.0, 1.06] },
  { id: 'S4', t0: 4.0, t1: 6.2, src: 'ui', asset: 'ui/capture/flow.mov', in: null, note: "Responsibilities: Assignments (Lead · Drop-off · Pickup · Backup)" },
  { id: 'S5', t0: 6.2, t1: 8.6, src: 'ui', asset: 'ui/capture/flow.mov', in: null, note: 'Pickup picker: Who will pick up Leo?' },
  { id: 'S6', t0: 8.6, t1: 11.0, src: 'ui', asset: 'ui/capture/flow.mov', in: null, note: 'Save, on camera' },
  { id: 'S7', t0: 11.0, t1: 13.3, src: 'ui', asset: 'ui/capture/flow.mov', in: null, note: 'Hold the real saved state', push: [1.0, 1.03] },
  { id: 'S8', t0: 13.3, t1: 15.0, src: 'brand', note: 'End card' },
]; // `in` = source in-point, set once the selects and the capture exist

// VO lines are DEFERRED (deferred: true) until the live-action direction is approved.
export const LINES = [
  { who: 'Alex', kind: 'sync', t0: 0.0, text: 'I thought you had pickup.' },
  { who: 'Jordan', kind: 'sync', t0: 34 / 30, text: 'I did drop-off.' },
  { who: 'VO', kind: 'vo', deferred: true, t0: 2.05, text: 'This is exactly the problem.' },
  { who: 'VO', kind: 'vo', deferred: true, t0: 4.1, text: "In ACTIQO, pickup and drop-off stay with the activity, so we can actually see who's doing what." },
  { who: 'VO', kind: 'vo', deferred: true, t0: 11.05, text: 'Try it with your next practice.' },
];

export const END_CARD = {
  wordmark: '../../brand/logo/current/actiqo-wordmark-navy-teal_trimmed.png', // official raster, flat teal Q
  line: 'Complimentary Family access during Early Access', // approved 2026-11-19; never 'Free…', no other pricing claim
  wordmarkIn: 13.3, lineIn: 13.55, stillFrom: 15.0 - 10 / FPS,
};

export const TOKENS = '../../brand/actiqo-motion-tokens.css'; // the only style source; never invent colours or fonts
