# Film 02 · Checkpoint 4: 20–26 s (the village)

| | |
|---|---|
| **Checkpoint** | CP4 |
| **Runtime covered** | 20.00–26.00 s (storyboard beats 17–21) |
| **Approval status** | **APPROVED** (2026-10-02) |

## What happens
| Time | Beat |
|---|---|
| 20.0–22.2 | The plan holds. Dad stands with the soccer bag; his neutral link stays on **Who's doing what · Dad drop-off**. Mom stands, posture already released twice (cleats, bag). |
| 22.25 | Mom looks down at her phone. |
| 22.6 | A press state on **Who's doing what** (Mom opens it). |
| 22.75–23.45 | The overview gives way to the real **Game Plan › Assignments** view, strictly sequentially: the overview is fully gone before the new view starts. Shown: `Leo • Soccer Practice` · tabs `Assignments · Prep list · Ready Check` · `Assignments` + `Edit` · **Dad drop-off** [`Dad`] `Leave by 4:48 PM` · **No one on pickup** · `Assign` (attention orange). Dad's link follows his row. |
| 23.0–23.5 | The orange thread's far end leaves 6:30 on the wall and attaches to **No one on pickup**: at the row's left edge in 16:9, beneath `Assign` in 9:16 (so it rises away from Mom's face). The `Pickup · 6:30 · ?` marker fades as its meaning moves into the row. |
| 23.6 | A press state on **Assign** (Mom initiates). The caregiver picker is not shown, because it hasn't been captured from a real 3.0 build (storyboard §6 note 3). |
| 23.4–25.0 | Grandma walks in from frame-left on a lane just in front of Mom's, passes in front of Dad and Mom, and stops between Mom and the plan. |
| 24.55–25.15 | Grandma's open hand rises. The thread's origin passes from Mom's phone to Grandma's hand. |
| 25.4 | **Resolved:** the row becomes **Grandma pickup** [`Grandma`] · `At 6:30 PM`, sequentially, never both rows at once. The orange dashed thread becomes the same neutral solid link used for Dad's drop-off. |
| 25.5–26.0 | Mom releases a final notch of load and puts the phone in her pocket: free hands. |

## Files to review
- `out/CP4_contact_16x9.png`: **16:9 contact sheet** (beats A–I)
- `out/CP4_contact_9x16.png`: **9:16 contact sheet**
- `out/stills/`: timed keyframes (`wide_<t>.png`, `tall_<t>.png`)
- `out/beats4/`: one frame per beat for each format
- Previews (Git LFS): `out/ACTIQO_WhatYouCarry_CP4_20-26s_16x9.mp4`, `out/ACTIQO_WhatYouCarry_CP4_20-26s_9x16.mp4`
- Source: the shared timeline `../film/scene.mjs`, the Assignments view in `../lib/gameplan.mjs` (`asLayout`, `assignments`), and the scripts `render.mjs`, `stills.mjs`, `contact_cp4.mjs`

## Deviations from the storyboard
- **Beat 17, 20–23 s ("walk on"):** Mom stays standing; her release is shown through posture. Restarting a stopped walker isn't supported by the gait system yet, so her long-stride walk-on moves to CP5's payoff, where it's planned anyway.
- **Dad stays in frame** with the bag, rather than exiting, so the end of CP4 shows the whole village: Dad, Mom and Grandma, each linked to their own Assignments row.
- **Grandma enters from frame-left** rather than the right. In 16:9, a right-side entrance would cross the Game Plan rows at the moment they're read. From the left, she steps directly into the line of the pickup thread.
- **Timing nudges:** the Assignments view arrives at 22.75–23.45 s (storyboard 23.0–23.8) and Assign is tapped at 23.6 s (storyboard 23.8), so the swap is fully sequential. The resolve stays at 25.4 s, as in the storyboard.

## Known nits
_None recorded yet._

## Decisions (resolved 2026-10-02)
1. Grandma's frame-left entrance: **approved, keep**.
2. Dad and Grandma's neutral links: **do not persist into CP5**. They hold briefly, then fade over 0.4–0.7 s once Mom begins her free walk (implemented in CP5: 26.25–26.8 s).
