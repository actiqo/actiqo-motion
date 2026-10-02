# Film 02 · Checkpoint 3: 12–20 s (the fold → put it down)

| | |
|---|---|
| **Checkpoint** | CP3 |
| **Runtime covered** | 12.00–20.00 s (the hero fold at 12.6–14.4 s, then the first put-downs) |
| **Approval status** | **LOCKED** (2026-10-02). The concept was approved. The two polish notes below were applied and verified frame by frame, and the user's instruction was to lock CP3 once they were clean. |

> **Location note.** The CP3 renders were produced in **`film02/production/film/out/`**, not in this folder. They were left in place rather than moved, so the paths below point there. The scene source is `film02/production/film/scene.mjs`.

## Files to review
- `../film/out/CP3_contact_16x9.png`: **16:9 contact sheet**
- `../film/out/CP3_contact_9x16.png`: **9:16 contact sheet**
- The hero fold, 12.6–14.4 s:
  - 16:9: `../film/out/stills/wide_12.60.png`, `wide_13.20.png`, `wide_14.00.png`, `wide_14.60.png`
  - 9:16: `../film/out/stills/tall_13.20.png`, `tall_13.60.png`, `tall_14.00.png`, `tall_14.40.png`
- `../film/out/stills/`: every timed keyframe, 11.95–20.00 s
- `../film/out/beats3/`: one frame per beat for each format (`wide_0–8`, `tall_0–8`)
- Previews (Git LFS): `../film/out/ACTIQO_WhatYouCarry_CP3_12-20s_16x9.mp4`, `../film/out/ACTIQO_WhatYouCarry_CP3_12-20s_9x16.mp4`

There are no dedicated close-up or zoomed stills of the hero fold. The fold is covered by the full-frame timed stills listed above.

## Polish applied (v2, 2026-10-02)
1. **What to bring registration (~16.0–16.75 s).** There is one copy of the text on every frame.
   - The marker line hands off at the exact frame the flight leaves it.
   - The flight takes a clean route: in 16:9 it drops beside the card, then slides along the row's own baseline, and no longer crosses "Dad drop-off". In 9:16 it's a short hop up.
   - " · " becomes the product's ", " in flight.
   - The real row copy appears at the landing frame. `0/2`, `Prep 0 of 2` and the row chevron wait until landing.
2. **Cleats (~17.0–18.4 s).** The long blue dotted trajectory is removed.
   - Mom lowers the cleats into the bag, and her posture releases.
   - What to bring gives one soft tint acknowledgement as the cleats go in.
   - No path is drawn from the cleats to the UI.

**Unchanged:** the fold geometry, Game Plan scale and hierarchy, the orange Pickup thread (still unresolved), Maya receding, Dad's handoff timing, all product copy and data, and the character art.
- **Lossless check:** comparing scene output with clip-path IDs normalized, frames 12.00–15.83 s are identical to the approved version.
- **The only change before 16.0 s:** the What to bring chevron now appears at landing rather than at 15.85 s.

**Note:** the previously committed timed stills for 13–15 s came from an earlier scene revision and did not match the approved MP4 (RMSE 0.073 at 13.2 s). The regenerated stills match the MP4.

## Known nits
_None open._

## Decisions needed
_None._
