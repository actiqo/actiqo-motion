// D03 · "Practice Starts at Five". Timeline source (checkpoint draft, data only, nothing renders yet).
// One primary version (utm_content d03_leave430). Times in seconds at 30 fps; re-snapped to real voice timings at build.
export const FPS = 30;
export const FORMAT = { W: 1080, H: 1920 };
export const ID = 'd03_leave430';
export const HOOK = { line: 'Practice starts at five. We can’t leave at five.', hold: 2.90 }; // spoken by Sarah + on screen
export const OPENER = { id: 'S1', src: 'gen', note: "kid's cleats still by the front door, bag beside them (people-free, no clock)" };
/** Body (relative to hook end). REAL ACTIQO capture only (ui/capture/d03_ui_flow_9x16.mp4). */
export const BODY = [
  { id: 'S2', t0: 0.00, t1: 1.20, src: 'ui', beat: 'unset',  note: 'Game Plan · Soccer Practice · Today 5:00 PM · "Leave time not set" → tap "Set leave time"' },
  { id: 'S3', t0: 1.20, t1: 4.00, src: 'ui', beat: 'sheet',  note: 'Leave time · Manual · "Preview: Leave by 4:30 PM" · "your saved 20 min drive + 10 min buffer" → tap "Save leave time"' },
  { id: 'S4', t0: 4.00, t1: 5.50, src: 'ui', beat: 'saved',  note: 'Game Plan · "Leave by 4:30 PM" · "Fixed leave time" (payoff)', hold: true },
  { id: 'S5', t0: 5.50, t1: 7.80, src: 'brand', note: 'End card' },
];
export const NARRATION = {
  hook: 'Practice starts at five. We can’t leave at five.',
  body: 'Twenty minutes to drive, ten to get inside. We’re leaving at four-thirty.',
  cta: 'Try it with your next practice.', // reused from the approved D01 final Sarah take (src 8.50–10.15)
};
export const END_CARD = { wordmark: true, cta: 'Try it with your next practice.', price: 'Free.', url: 'getactiqo.com' }; // "Free." per user 2026-11-21 (pending claim confirmation)
