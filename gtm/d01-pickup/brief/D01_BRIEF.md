# D01 · "Pickup was handled." Production brief

**Status:** v1. Gate 0 decisions received 2026-11-19 (below). Nothing has been generated or spent. The real UI capture is **blocked** (see `ui/UI_CAPTURE_SPEC.md`).

## 1. What this is
This is ACTIQO's first GTM short-form ad: a **15 s, vertical-first (1080×1920, 30 fps)** realistic social video.

- **The problem:** two adults each thought the other had pickup. One did drop-off, and nobody owned pickup.
- **The answer:** in ACTIQO, drop-off and pickup belong to the *activity*. Anyone in the household can open it and see who's doing what.
- **The ask:** "Try it with your next practice." Close on **ACTIQO · Complimentary Family access during Early Access**.

## 2. Hybrid production rules (non-negotiable)
| Layer | Source | Rule |
|---|---|---|
| Live action (0–2 s) | External video-generation model | Photorealistic people, props and room **only**. No phone screens, text, logos, UI or brand marks in any prompt or output. If a take shows any of these, reject it. |
| Product (2–13 s) | **Real ACTIQO UI**, captured from a current build (see `ui/UI_CAPTURE_SPEC.md`) | Never generated and never redrawn as invented UI. We may crop, scale, mask, reframe or zoom in. We never change copy, add screens or invent states. |
| Brand (end card) | `brand/logo/current/` official raster wordmark, `brand/fonts/`, `brand/actiqo-motion-tokens.css` | Use the flat teal Q only. Never use the gradient Q or the unapproved vector trace. |
| Edit / composite | HyperFrames (pinned `hyperframes@0.8.98`, same as Film 01) | `scene.mjs` is the single timeline source. |

## 3. Script (locked copy, as supplied)
| Time | Who | Line |
|---|---|---|
| 0.00–1.13 | Adult A (car keys), sync | "I thought you had pickup." |
| 1.13–2.00 | Adult B (youth sports bag), sync | "I did drop-off." |
| 2.0–4.0 | VO *(deferred: added after visual approval)* | "This is exactly the problem." |
| 4.0–11.0 | VO *(deferred)* | "In ACTIQO, pickup and drop-off stay with the activity, so we can actually see who's doing what." |
| 11.0–15.0 | VO *(deferred)* | "Try it with your next practice." |
| 13.3–15.0 | End card (on screen) | **ACTIQO** · Complimentary Family access during Early Access |

## 4. Claims check (against the product, origin/main 27a2492, 2026-11-18)
| Claim | Verdict | Evidence (read-only, `/workspaces/actiqo`) |
|---|---|---|
| "pickup and drop-off stay with the activity" | ✅ True | Assignments are stored per activity ("Every {Activity} session" scope), with optional per-session overrides. `src/components/game-plan/AssignmentsEditor.tsx` header; `POST /api/family-sync/config/save { activityId, scope }`. |
| "we can actually see who's doing what" | ✅ True, and these are the product's own words | Game Plan row **"Who's doing what"** (`structure/views.tsx:549`, `v3views.tsx:250`). |
| An open pickup is visible | ✅ True on current main | `OPEN_PICKUP = 'No one on pickup'`, which "is SAID, never dropped (Game Plan overview + Assignments)" (`assignmentCopy.ts`). |
| "Complimentary Family access during Early Access" | ✅ **Approved 2026-11-19** (replaces "Free during Early Access", which must not be used) | Matches the product: "Early Access · Complimentary access to the full Family experience". No other pricing claim may appear anywhere. |
| No calendar or third-party claims | ✅ | No mention of calendars, GameChanger, TeamSnap or PlayMetrics anywhere in D01. |

## 5. Cast and world (APPROVED 2026-11-19)
- **Adult A, Alex:** a woman in her late 30s. She has the car keys. In the app, she ends up with pickup.
- **Adult B, Jordan:** a man in his late 30s. He carries the youth soccer bag and did drop-off. In the app, his row reads *Jordan drop-off*.
- They are co-parents. They should look like believable real parents with natural proportions: not models, not influencer-polished, no sitcom acting, no stock-photo smiles.
- **Performance:** slightly distracted and matter-of-fact. This is a familiar mix-up, not anger and not marital conflict. The humour comes from the assumption.
- **Child, Leo:** never on screen. **Activity:** Soccer Practice.
- **Home:** a comfortable, ordinary Midwestern suburban entryway next to the kitchen. Late-afternoon natural light. Lived-in but uncluttered. Youth sports appear only through the props.
- **Wardrobe:** simple, neutral everyday clothes. No logos, no printed text, no luxury styling.
- **The UI household must be the same:** Alex, Jordan, Leo, Soccer Practice.

## 6. Look
- **Live action:** premium, realistic smartphone / consumer-ad cinematography. Natural handheld, or extremely subtle stabilised movement. No dramatic camera moves, **no shallow-focus glamour**, no slow motion. Shot/reverse-shot singles with opposite eyelines (Alex looks screen-right, Jordan looks screen-left). The two keyframes share one home, light, colour temperature, camera height and lens feel. No music; room tone only. **No generated text or UI anywhere.**
- **Product:** the real UI sits on ACTIQO canvas `#FCFAF7`. Motion follows `ACTIQO_MOTION_SYSTEM.md`: card entrance 12–15 f `cubic-bezier(0.2,0.8,0.2,1)`, structural moves 18–24 f, no bounce, no glow, no particles.
- **Captions:** burned-in captions for all five lines, because most feed viewers watch muted. Inter 600, real tokens. They sit in the 9:16 safe zone (clear of the top 220 px and the bottom 380 px of platform chrome).

## 7. Deliverables
1. `renders/D01_pickup_15s_9x16_v01.mp4`: 1080×1920, 30 fps, H.264, captions burned in. This is the master.
2. `renders/D01_pickup_15s_9x16_v01_nocap.mp4`: the same without captions, for platforms that add their own.
3. Optional later: 4:5 (1080×1350) and 1:1 crops from the same `scene.mjs`.

## 8. Gates
| Gate | What you approve | Spend |
|---|---|---|
| **0** | This brief, `D01_SHOTLIST.md`, the prompts, the UI capture spec and the API choice | none |
| 1 | Two **keyframe stills** (Alex first, then Jordan generated with Alex as the reference), `fal-ai/nano-banana-pro` (+`/edit`), 2K, 9:16 | $0.15 per still |
| 2 | **One Fast draft per shot** (`fal-ai/veo3.1/fast/image-to-video`, 1080p, 9:16, 4 s, audio on, Veo native dialogue). Then the draft composition with the real UI. | $0.60 per draft |
| 2b | **Standard keepers**, only after the draft composition is approved (`fal-ai/veo3.1/image-to-video`). **Hard cap: 2 paid video generations per shot**, then stop and report. No 4K. | $1.60 per keeper |
| 3 | Real UI capture received and verified against `ui/UI_CAPTURE_SPEC.md` | none |
| 4 | Silent animatic with scratch VO | none |
| 5 | Product narration (deferred until visual approval), mix and captions, then the master | TBD |
