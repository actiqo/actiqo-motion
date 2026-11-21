# D02 "Six Water Bottles": checkpoint brief (2026-11-21, nothing generated or deployed)

**Problem:** families own all the gear; the hard part is remembering what has to leave the house.
**Proof:** the real ACTIQO **Prep list** ("What to bring") attached to the activity, ticked off per session.
**Format:** 9:16, **9.5 s** (hook B 10.0 s). One reusable body, four hooks (`HOOKS.md`).

## 1. The real product flow
Full detail is in `ui/UI_FLOW.md` (main `dca1b87`):
- Game Plan shows "What to bring · Water bottle, Cleats, Shin guards · **0/3**".
- Tapping the row opens the **Prep list** tab: "**3 items to pack**", with each item "Not packed".
- Tap Water bottle → "**1 of 3 packed**". All three → "**Prep complete** / Everything on the prep list is packed".
- The optional Ready check ("I'm ready" → "You're set.") is captured as an alternate only.
- There are no preset item chips, and the list is per activity. The packed state is per session.

## 2. Fixture
A **separate D02 QA fixture** (one adult "Sam", Leo, Soccer Practice, pickup assigned so there's no warning). The three prep items are added through the real app UI. D01's household stays untouched. Plan: `ui/QA_FIXTURE_PLAN.md`.

## 3. Capture
Reuse the proven D01 path: temporary isolated Vercel **Preview** of current main → **QA Supabase only** → headed-Chrome Xvfb recorder at 1080×1920 (`gtm/scripts/qa-capture/`). Beats B1–B5 (+ B6/B7 alternates) are in `ui/UI_FLOW.md`, reset through the real UI.

## 4. Opener: object-focused (recommended)
| | Live-action parent | **Object-focused** |
|---|---|---|
| Reads in <2 s | Needs a face, an action and a reaction to land "missing bottle". Hard in 1.75 s without dialogue. | One frame: six bottles out, bag open, no bottle in it. The hook line does the rest. |
| Works for all 4 hooks | A/C/D only; B ("Guess what we forgot") fights a specific reaction | **All four**, because the picture is neutral and the line changes |
| Risk | Hands, faces, continuity, uncanny acting | Bottle count, and stray text or logos (checked at keyframe review) |
| Cost | Keyframe + Fast with audio ($0.75), likely re-dos | **Keyframe $0.15 + Fast 4 s silent $0.40 = $0.55** |

Recommendation: **object-focused**, with no people. It's simpler, cheaper and hook-agnostic. Prompt draft: `generations/prompts/s1_bottles_object.json`.
**Fallback if the still alone reads well:** skip Veo and use the keyframe with a gentle HyperFrames push. Total **$0.15**.

## 5. Timeline (hook A: 9.50 s; others shift by their hold)
| t (s) | Shot | Source | On screen |
|---|---|---|---|
| 0.00–1.75 | S1 opener | gen (people-free) | six bottles + open empty bag, with the **hook line** in the top third (D01-style Inter-on-ink panel) |
| 1.75–3.05 | S2 | real UI | Game Plan · **What to bring · Water bottle, Cleats, Shin guards · 0/3** |
| 3.05–4.25 | S3 | real UI | Prep list · **3 items to pack** · Water bottle **Not packed** |
| 4.25–5.75 | S4 | real UI | tap **Water bottle** → **1 of 3 packed** |
| 5.75–7.25 | S5 | real UI | **Prep complete** · Everything on the prep list is packed |
| 7.25–9.50 | S6 | brand | wordmark · **Try it with your next practice.** · getactiqo.com |

"Complimentary Family access during Early Access" is **omitted by default**, so it doesn't crowd the 2.25 s CTA.
**Sound (later, after picture):** the opener is silent (Veo audio off). The D01 synth bed, taps and saved cue can be adapted. No licensed music search.

## 6. Paid cost
| Item | Expected | Cap (enforced by `brief/budget.json`) |
|---|---|---|
| Opener keyframe (nano-banana-pro, 9:16 2K) | $0.15 | 2 keyframes = $0.30 |
| Opener motion (Veo 3.1 Fast, 4 s, silent) | $0.40 | 1 clip = $0.40 |
| **Total** | **$0.55** (or $0.15 still-only) | **$0.70** max, against D01's $1.50 |

The Vercel preview and QA usage have no incremental cost. No Standard Veo, no 4K.

## 7. Files
```
gtm/d02-water-bottles/
  README.md                         status + gates
  scene.mjs                         timeline data: HOOKS, OPENER, BODY, END_CARD, timelineFor()
  brief/D02_BRIEF.md                this file
  brief/HOOKS.md                    4 hook IDs / utm_content / runtimes
  brief/budget.json                 caps: 2 keyframes, 1 Fast clip, no keeper, no 4K
  generations/prompts/s1_bottles_object.json   opener keyframe + Fast prompt (draft, not run)
  references/opener/                keyframe lands here after approval
  ui/UI_FLOW.md                     real flow + capture beats
  ui/QA_FIXTURE_PLAN.md             D02 fixture (proposed)
  ui/capture/                       (later) d02_ui_flow_9x16.mp4, lossless source, stills, beats.json
  edit/                             (later) HyperFrames project: one body sub-composition, a per-hook opener, shared end card
  audio/                            (later)
```

## Gates
1. **Now:** approve the plan.
2. **Keyframe:** $0.15, then stop for review.
3. **Vercel QA preview + fixture + capture:** independent of fal.
4. **Fast clip:** only if the still doesn't hold up on its own.
5. **Edit, hook A first:** then B, C and D are re-renders with only the line changed.
6. **Sound.**
