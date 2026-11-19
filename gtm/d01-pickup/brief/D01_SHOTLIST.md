# D01 · Shot list (v1, decisions 2026-11-19)

> **First pass = S1, S2 and the raw real-UI capture only.** All VO lines and their caption cards are deferred until the live-action direction is approved.

The frame is 1080×1920 at 30 fps, and the runtime is **15.00 s = 450 frames**. Frame numbers are inclusive start and exclusive end.
The source of each shot is labelled as follows: **GEN** means external video model, **UI** means real ACTIQO capture, and **BRAND** means official brand assets.

| # | Time | Frames | Src | Picture | Sound |
|---|---|---|---|---|---|
| **S1** | 0.00–1.13 | 0–34 | GEN | **Alex (A), medium close-up**, in the entryway by the front door. Car keys are raised mid-gesture at chest height and clearly readable. A looks screen-right at B, puzzled and mildly accusing, not angry. Light handheld drift. **The first frame must already be mid-action** (no slow start; this is the thumb-stop). | Alex (Veo native sync): "I thought you had pickup." |
| **S2** | 1.13–2.00 | 34–60 | GEN | **Hard cut. Jordan (B), medium close-up**, in the same entryway in the reverse angle. A youth soccer bag hangs on the shoulder, and a strap is gripped. B looks screen-left at A, with a defensive half-shrug. | Jordan (Veo native sync): "I did drop-off." The line may J-cut 3–4 f under the end of S1 if delivery runs long. |
| **S3** | 2.00–4.00 | 60–120 | UI | **Hard cut into ACTIQO.** The real **Game Plan** for *Leo · Soccer Practice* (the activity). Over 0.4 s the card enters on canvas (`#FCFAF7`). The **"Who's doing what"** row shows **Jordan drop-off** and the open pickup, **"No one on pickup"**. A slow 1.00→1.06 push centres that row. | VO: "This is exactly the problem." Room tone ducks out. Optional single soft UI tick on the card landing. |
| **S4** | 4.00–6.20 | 120–186 | UI | A tap on **Who's doing what** opens **Assignments** (the responsibilities): **Lead · Drop-off · Pickup · Backup**. Drop-off reads Jordan. **Pickup is open.** Tap **Assign**. The UI is reframed so the four rows fill about 80 % of the width. | VO starts: "In ACTIQO, pickup and drop-off stay with the activity, …" |
| **S5** | 6.20–8.60 | 186–258 | UI | A tap on **Pickup** opens the real pickup picker: **"Who will pick up Leo?"** Alex's option (**"Alex will pick up Leo"**, or the viewer form "I'll pick up Leo" if Alex's account records) is selected, using the real selection state and a real tap. | VO: "… so we can actually see …" |
| **S6** | 8.60–11.00 | 258–330 | UI | A tap on the real save button (**"Assign pickup"** / **"Save assignments"**, whichever the capture build shows) returns to the Assignments or Game Plan view with **both legs filled**. The save happens on camera. | VO: "… who's doing what." |
| **S7** | 11.00–13.30 | 330–399 | UI | **Hold the real saved state.** The Game Plan "Who's doing what" reads **Jordan drop-off · Alex pickup** (or the viewer form, e.g. "You're on pickup"), word for word from the capture. Nothing moves except a slow 1.00→1.03 settle. | VO: "Try it with your next practice." |
| **S8** | 13.30–15.00 | 399–450 | BRAND | **End card** on canvas: the official wordmark (`actiqo-wordmark-navy-teal_trimmed.png`), then the line **"Complimentary Family access during Early Access"** (Inter 500, `ink2`). Opacity-only entrance, staggered 0.25 s, the same grammar as Film 02's end card. The last 10 f are a clean still for the platform loop. | Room tone or tail of the UI tick; no music by default (see `audio/README.md`). |

## Caption track (burned-in master only)
| Frames | Text |
|---|---|
| 2–33 | I thought you had pickup. |
| 34–60 | I did drop-off. |
| 62–118 | This is exactly the problem. |
| 122–328 | In ACTIQO, pickup and drop-off stay with the activity, so we can actually see who's doing what. (Split into 2–3 phrase cards and retimed to the VO) |
| 332–396 | Try it with your next practice. |

## Continuity and edit notes
- **S1→S2:** shot/reverse-shot in the *same* room and light. The stills from Gate 1 lock wardrobe, set and light before any video spend.
- **S2→S3:** a hard cut, with no phone-in-hand screen replacement. A generated phone would need screen tracking and invites model-generated UI. The cut itself is the "transition immediately into ACTIQO".
- **UI timing:** the real recording is retimed per beat (cuts at taps, speed ramps only between interactions). We never time-warp an animation the product actually performs.
- **Fallback if the real save animation is longer than 2.4 s:** cut on the tap, then cut to the settled saved state. That's still real; no invented in-between.
- **Safe zones (9:16):** keep text and key UI rows inside y 220–1540.
