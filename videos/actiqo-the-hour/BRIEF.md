---
workflow: general-video
flow: companion
storyboard: yes
message: "The activity lasts an hour. The coordination lasts all week."
destination: instagram-reels
aspect: 1080x1920
language: en
length: 15s
---

## Intent

ACTIQO Film 01, "The Hour": a 13–15 s vertical social/brand film (Reels, TikTok, Shorts) for ACTIQO,
Family Activity Intelligence. Recognition → deceptively simple → revelation → "that's my life" →
relief → understanding ACTIQO. Apple-level restraint, Linear-level motion precision, warm but never
childish. The approved storyboard lives in the chat transcript (revised final storyboard, S1–S8).

**S1–S5 LOCKED (2026-09-30) at v02-1** — `renders/actiqo-the-hour-s1-s5_v02-1.mp4`. v02-1 = v02 + a refined 1.0–1.45 s morph only (sequential question → event handoff carried by the card's colour change). Do not modify S1–S5 without an explicit request.

**v02 (2026-09-30): S1–S5 rebuilt on the real ACTIQO system** (`lib/tokens.js` mirrors `brand/actiqo-motion-tokens.css`). The v01 placeholder system is archived in `archive/v01/` and must not be reused. Keyframes = approved styleframes: A at 0.0 s, B at 4.6 s, C at 7.2–8.0 s. Render: `renders/actiqo-the-hour-s1-s5_v02.mp4`. Stills: `stills/v02/`, comparison: `stills/v01-v02_comparison_contact-sheet.png`.

**Earlier pass (v01): S1–S5 only, 8.0 s.** It validates the hook, the bubble → Hour Block morph,
the Hour Block primitive, the Leave-By tick, coordination threads, the day → week pull-back, the density
escalation and the 24-frame stillness beat. S6–S8 (real ACTIQO UI, village, end card) are blocked
until the real product screens and brand assets arrive.

## Assets

- Brand: `/workspaces/actiqo-motion/brand/` (provenance in `brand/SOURCES.md`). Fonts: `assets/fonts/` (Inter + Fraunces, OFL).
- Decisions (user, 2026-09-30): navy `#0B1F3B` is the primary brand/action colour for abstract motion and the end card; real product UI in S6+ keeps its exact screen colours. Flat teal Q is current; never the gradient Q. Film 01 uses the official raster wordmark; `brand/logo/trace/` holds an unapproved experimental vector trace.
- ACTIQO 3.0 screens for S6–S8 (Game Plan, Responsibilities, Home/Up Next) are still to be chosen.

## Customizations

- Reusable motion primitives: MessageBubble, HourBlock, TimeRuler, LeaveByTick, CoordinationThread,
  LogisticsChip, WeekGrid, VillageMonogram (see `components/`).
- All temporary styling lives in `tokens/placeholder-tokens.js`, which is swapped wholesale when the brand arrives.

## Notes

- Never invent brand (fonts, accent colour, logo) or product UI. The placeholder tokens are explicitly temporary.
- ACTIQO syncs Google Calendar and Apple Calendar only. Never mention GameChanger, TeamSnap or PlayMetrics.
- No glow, gradients, particles, exaggerated 3D, decorative blur, bouncing type or flying cards.
- The house-style "ambient motion on every decorative" is deliberately NOT applied: the user asked for true
  stillness and restraint. 7.2–8.0 s must be pixel-identical.
- Audio: this pass renders silent by choice. SFX beats are specified in the storyboard for a later pass.
