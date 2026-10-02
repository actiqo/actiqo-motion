# Film 02 · Checkpoint 5: 26–30 s (payoff + end card)

| | |
|---|---|
| **Checkpoint** | CP5 |
| **Runtime covered** | 26.00–30.00 s (storyboard beats 22–23) |
| **Approval status** | **APPROVED · PICTURE LOCKED** (2026-10-02) |

## What happens
| Time | Beat |
|---|---|
| 26.0 | The resolved state holds: **Dad drop-off** [`Dad`] · **Grandma pickup** [`Grandma`] · `At 6:30 PM`, with both neutral links. Mom's phone is in her pocket. |
| 26.05 | Grandma sets off first, toward 6:30 (her leg), at her own slower cadence. |
| 26.15 | Mom walks on from her standing stance (the new walk restart: see below). |
| 26.25–26.8 | Both neutral responsibility links fade (0.55 s). No new tether or path graphics. |
| 26.25–26.85 | Mom's near hand leaves the pocket and joins the arm swing: free hands, no phone, no cleats, no bag. Her posture uprights: lean down about 2°, shoulders down, head level. |
| 26.35–26.95 | Grandma's catching hand returns to her own walk swing. |
| 26.6–27.1 | Maya's card goes, then the leftover practice route (26.9–27.4). |
| 27.0–27.6 | The Assignments card recedes deliberately. The resolved state was fully readable from 25.7 to 27.0 s. |
| 27.1–27.65 | Dad and Grandma soften out. They stay behind and ahead of Mom; nobody crosses. |
| 27.3–28.0 | The floor and the hour lines fade into the ivory ground. |
| 27.35–27.95 | Mom, still walking, softens out last. |
| 27.8 | **End card:** the official raster wordmark (navy + flat teal Q) fades in (0.6 s, breath curve). |
| 28.1 | `Family Activity Intelligence` (Inter 500, ink-2). |
| 28.45 / 28.57 | **The activity lasts an hour.** / **The coordination lasts all week.** (Fraunces 600, navy; 4 f sibling stagger). |
| 29.2–30.0 | **Held:** the final 24 frames are pixel-identical. |

The end card is opacity only: no logo zoom, bounce, flourish, wipe, fly-out or fade to black. Colours are ivory `#FCFAF7`, navy `#0B1F3B` and ink-2 `#3F4C63`; teal appears only inside the wordmark. There is no App Store badge, no feature list and no other copy.

## Walk restart (rig support added)
- `lib/gait.mjs`: a new `restartAt` option. Body and phase stay frozen at the settled stand until the restart, then integrate on from that exact state. The strikes from before the stop are kept, so both feet start from their exact plants.
  - The first stance after the restart starts flat (as the settle left it) and rises heel-first into the normal toe-off, so the trailing foot leaves the floor with no pop.
  - Gait initiation: the step rhythm leads the body speed (phase ∝ √speed), so the first steps are shorter rather than slow-motion: 3.0 heads, then a steady 2.5.
  - The hip's first rise out of the wide standing stance is eased over a wider window. It is never higher than leg reach allows.
- `lib/character.mjs`: `pocketOut` (hand out of the pocket into the swing) and `reachBlend` (Grandma's catching hand back to her swing). Both are additive rig blends; every existing end pose is unchanged.
- Verified numerically on both walkers at 120 Hz:
  - No planted foot changes plant while in contact (no sliding).
  - Ankle and hip motion are continuous through the restart.
  - Mom's hip rises about 0.45 heads over about 0.5 s. The steady free-walk bob is about 0.3 heads, in line with the opening walk.
- **Free gait:** cadence 0.95 cycles/s and stride 2.5 heads, the film's longest (+16% on the loaded walk).

## Files to review
- `out/CP5_contact_16x9.png`, `out/CP5_contact_9x16.png`: contact sheets (beats A–I)
- `out/stills/`: timed stills at 26.0 · 26.5 (link fade) · 26.75 (first free step) · 27.6 (transition) · 29.0 (end card) · 29.97 (final frame)
- Previews (Git LFS): `out/ACTIQO_WhatYouCarry_CP5_26-30s_16x9.mp4`, `out/ACTIQO_WhatYouCarry_CP5_26-30s_9x16.mp4`
- **Complete silent film (review masters):** `../film/out/ACTIQO_WhatYouCarry_30s_review_16x9.mp4`, `../film/out/ACTIQO_WhatYouCarry_30s_review_9x16.mp4`. Rendered in one pass from the shared timeline (not spliced from checkpoint files). Frames before 26 s are unchanged from CP2–CP4.

## Deviations from the storyboard
- **No 6% camera widen (26–27.6 s).** The camera holds still while Mom walks through the world, so the quieting reads as the world simplifying rather than a camera move.
- **Grandma walks on** (toward 6:30) instead of standing. Otherwise Mom would have to pass behind her while Grandma fades, and the two semi-transparent figures would overlap.
- **End-card timing:** the wordmark is at 27.8 s (storyboard 27.6) and the lines are at 28.45/28.57 s (storyboard 28.6/29.1). This lets the world finish quieting first and makes every element settle before frame 876, so the last 24 frames hold true stillness.

## Picture-lock micro-fix (2026-10-02)
- **16:9 only:** the Assignments card now begins its recede 0.15 s earlier (26.85 s instead of 27.0 s), so it is already going as Grandma's head reaches the start of **Grandma pickup**. Grandma, both walks, the 9:16 version, CP1–CP4 and the end-card timing are unchanged.
- Verified at the SVG level, frame by frame, against the approved masters: only 16:9 frames 806–827 (26.87–27.57 s) differ, and 9:16 is identical. The 16:9 CP5 preview, stills, contact sheet and 30 s master were re-rendered.

## Decisions needed
_None._ Picture is locked. Audio is tracked in `../audio/`.
