// D01 · "Pickup was handled." The single timeline source (v1, data only, nothing renders yet).
// A later gtm/scripts/build.mjs turns this into a HyperFrames composition (hyperframes@0.8.98, as Film 01).
// Times are seconds at 30 fps. Mirrors brief/D01_SHOTLIST.md: change both together.

export const FPS = 30;
export const FORMAT = { W: 1080, H: 1920, duration: 15.0 };
export const SAFE = { top: 220, bottom: 1540 }; // keep text and key UI rows inside this band (9:16 platform chrome)

/** src: 'gen' = external video model · 'ui' = real ACTIQO capture (manually recorded, see ui/MANUAL_CAPTURE.md) · 'brand' = official brand assets */
const OPENING = [
  { id: 'S1', t0: 0.0, t1: 34 / 30, src: 'gen', asset: 'generations/selects/s1.mp4', in: null, note: 'Alex (A), car keys' },
  { id: 'S2', t0: 34 / 30, t1: 2.0, src: 'gen', asset: 'generations/selects/s2.mp4', in: null, note: 'Jordan (B), youth soccer bag' },
];
const END = { id: 'S8', t0: 13.3, t1: 15.0, src: 'brand', note: 'End card' };

/**
 * Product section (2.0–13.3 s). The edit takes whichever REAL recording exists, and never redraws or fakes UI.
 * `beats` = ui/beats.json: source timecodes (seconds into the recording) of the moments below; null = not in the footage.
 * Mode is picked from what's present:
 *   'full'        : unresolved → (whoTap) → assignments → picker → (alexTap) → saveTap → saved, as in the shot list.
 *   'beforeAfter' : only unresolved + saved (optionally assignTap): hold the real open pickup, HARD CUT on the real tap
 *                   (or on a plain cut), then hold the real saved state. No dissolve, so no implied UI motion that wasn't recorded.
 * Every segment plays the recording at 1×, except holds, which may freeze the last real frame. Pushes are subtle scale moves only.
 */
export function productShots(beats, asset) {
  const b = beats ?? {};
  const has = (...k) => k.every((x) => typeof b[x] === 'number');
  if (has('unresolved', 'assignments', 'picker', 'saveTap', 'saved')) {
    return { mode: 'full', shots: [
      { id: 'S3', t0: 2.0, t1: 4.0, src: 'ui', asset, in: b.unresolved, note: 'Game Plan: "No one on pickup" visible', push: [1.0, 1.06] },
      { id: 'S4', t0: 4.0, t1: 6.2, src: 'ui', asset, in: b.whoTap ?? b.assignments, note: 'Who\'s doing what → Assignments' },
      { id: 'S5', t0: 6.2, t1: 8.6, src: 'ui', asset, in: b.picker, note: 'Who will pick up Leo? → Alex' },
      { id: 'S6', t0: 8.6, t1: 11.0, src: 'ui', asset, in: b.saveTap, note: 'Save, on camera' },
      { id: 'S7', t0: 11.0, t1: 13.3, src: 'ui', asset, in: b.saved, note: 'Hold the real saved state', push: [1.0, 1.03], hold: true },
    ] };
  }
  if (has('unresolved', 'saved')) {
    const cut = 6.6; // VO "…stay with the activity," lands on the cut once narration exists
    return { mode: 'beforeAfter', shots: [
      { id: 'S3', t0: 2.0, t1: cut, src: 'ui', asset, in: b.unresolved, note: 'Real open pickup ("No one on pickup")', push: [1.0, 1.08], hold: true },
      ...(has('assignTap') ? [{ id: 'S3b', t0: cut - 0.5, t1: cut, src: 'ui', asset, in: b.assignTap, note: 'Real tap on Assign (0.5 s, 1×)' }] : []),
      { id: 'S7', t0: cut, t1: 13.3, src: 'ui', asset, in: b.saved, note: 'Real saved state: Jordan drop-off / Alex pickup', push: [1.03, 1.0], hold: true },
    ] };
  }
  return { mode: 'missing', shots: [] }; // the build refuses to render without real product footage
}

/** Full timeline for a given beats manifest. */
export const shotsFor = (beats, asset = 'ui/capture/d01_ui_flow_9x16.mp4') => {
  const p = productShots(beats, asset);
  return { mode: p.mode, shots: [...OPENING, ...p.shots, END] };
};

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
