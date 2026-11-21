// D03 · "Practice Starts at Five". The single timeline source for edit/build.mjs (picture) and edit/sound/mix_d03.mjs (sound).
// One primary version (utm_content d03_leave430). Absolute seconds at 30 fps.
export const FPS = 30;
export const FORMAT = { W: 1080, H: 1920 };
export const ID = 'd03_leave430';
export const DUR = 11.05;

/** Hook: spoken by Sarah and on screen for the opener (0 → H). The VO runs on into the first UI shot (J-cut). */
export const HOOK = { line: 'Practice starts at five. We can’t leave at five.', lineHtml: 'Practice starts at five.<br>We can’t leave at five.', hold: 2.85 };

/** Opener, Option A (user 2026-11-21): the LOCKED v02 still, then ONLY the clean start of Veo Fast v01.
 *  Hard cutoff: clip src 0.00–0.90 (forearm enters at 0.92; the head appears ≈1.00). No later footage, no crop salvage. */
export const OPENER = {
  still: { asset: 'references/opener/d03_cleats_keyframe_v02.png', t0: 0.00, t1: 2.12, fadeOut: [1.95, 2.12] }, // 5-frame dissolve into the clip's own (identical) start frame, to hide Veo's softer texture
  clip:  { asset: 'generations/review/s1/d03_s1_cleats_fast_v01.mp4', t0: 1.95, src: [0.00, 0.90], req: '01a1ff29-bbea-77b1-9369-b2489dd99acb' },
};

/** Body: REAL ACTIQO capture only (ui/capture/d03_ui_flow_9x16.mp4; beats in ui/capture/beats.json). Real speed; only static dwell is trimmed. */
export const BODY = [
  { id: 'gp',     t0: 2.85, t1: 4.10, src: 2.62, push: 'gp',   note: 'Game Plan · "Leave by about 4:30 PM · Based on 20 min travel time" (the real pre-save estimate from the saved drive) → tap Change (src 3.728)' },
  { id: 'sheetA', t0: 4.10, t1: 4.98, src: 3.87, push: null,   note: 'Leave time sheet slides up · Manual · "Preview: Leave by 4:30 PM"' },
  { id: 'sheetB', t0: 4.98, t1: 7.40, src: 6.28, push: null,   note: 'same static sheet (dwell trimmed) · "Starting point: your saved 20 min drive + 10 min buffer." → tap Save leave time (Saving… src 8.27) → cut at src 8.70, before the sheet dismisses' },
  { id: 'saved',  t0: 7.40, t1: 8.90, src: 12.75, push: 'saved', note: 'settled Game Plan · "Leave by 4:30 PM · Fixed leave time" (src ≥ 12.70: the post-save reminder toast has fully cleared; payoff)' },
];
export const SFX = { enter: 2.55, tapChange: 3.96, tapSave: 6.96, saved: 7.40 }; // tap times = real tap frames mapped into the timeline

export const END_CARD = { t0: 8.90, t1: 11.05, wordmark: '../../brand/logo/current/actiqo-wordmark-navy-teal_trimmed.png', cta: 'Try it with your next practice.', price: 'Free.', url: 'getactiqo.com' };
// "Free." approved by the user for D03 (2026-11-21). It reflects the product's current public pricing state; revisit if pricing changes.

/** Narration: Sarah (ElevenLabs v4 via fal). Gains matched to D02's body take (0.484 at −19.0 LUFS). */
export const VO = {
  hook: { file: 'd03_vo_hook.wav', src: [0.00, 3.76], at: 0.05, gain: 0.645, req: '01a1ff38-7730-77e2-86db-0d13e99e2f51' },  // −21.5 LUFS take; ends ≈3.61
  body: { file: 'd03_vo_body.wav', src: [0.00, 4.64], at: 4.15, gain: 0.431, req: '01a1ff38-8c18-7c62-8c36-2ea40f0cec11' },  // −18.0 LUFS; "inside." ends 7.27, "four-thirty" 7.91 on the saved row
  cta:  { file: '../../../d01-pickup/v2/audio/final/d01_narration_sarah_final.wav', src: [8.50, 10.15], at: 9.05, gain: 0.484 }, // approved D01 final take, reused
};
export const NARRATION = { hook: HOOK.line, body: 'Twenty minutes to drive, ten to get inside. We’re leaving at four-thirty.', cta: END_CARD.cta };
