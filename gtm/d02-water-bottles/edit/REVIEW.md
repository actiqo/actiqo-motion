# D02 "Six Water Bottles" · DRAFT v01 for review (2026-11-21)

## Files (`edit/review/`)
| Hook ID (`utm_content`) | Draft | Runtime |
|---|---|---|
| **`d02_waterbottles`** (A, primary) | `d02_draft_v01_d02_waterbottles.mp4` | 9.50 s |
| `d02_20minutes` (B) | `d02_draft_v01_d02_20minutes.mp4` | 10.00 s |
| `d02_alwaysforget` (C) | `d02_draft_v01_d02_alwaysforget.mp4` | 9.50 s |
| `d02_ownsix` (D) | `d02_draft_v01_d02_ownsix.mp4` | 9.50 s |

All are 1080×1920, 30 fps, H.264, **silent** (sound comes after picture approval, per the brief). Also here: the contact sheet for hook A (`…_waterbottles_contact.png`) and the B/C/D hook frames (`d02_draft_v01_hooks_BCD.png`).
Build: `node edit/build.mjs <hookId>` writes `edit/index.html` from `scene.mjs`, then a HyperFrames 0.9.72 render. **Only the hook line and its hold differ between hooks.** The body and end card are byte-for-byte the same composition.

## Timeline (hook A; the others shift by their hold)
| t (s) | Shot | Source |
|---|---|---|
| 0.00–2.00 | Opener: six bottles + open bag with no bottle, gentle push, **hook line** (Inter on ACTIQO ink, top third) | AI keyframe still (people-free); **no Veo clip used** |
| 2.00–3.30 | Game Plan · **What to bring · Water bottle, Cleats, Shin guards · 0/3** → real tap | real capture src 2.25–3.55 |
| 3.30–4.60 | Prep list · **3 items to pack** · all "Not packed" | src 4.30–6.80 at 1.92× (waiting only) |
| 4.60–6.00 | real tap on **Water bottle** → **1 of 3 packed** | src 6.80–8.20, real speed |
| 6.00–7.35 | **Prep complete** · Everything on the prep list is packed (all three ticked) | src 10.30–11.65 |
| 7.35–9.50 | End card: wordmark · **Try it with your next practice.** · getactiqo.com | brand |

**Hook holds:** 2.0 s, or 2.5 s for B, which is up from the planned 1.75 / 2.25 so the line can be read. To keep runtimes at 9.5 / 10.0 s, "Prep complete" was trimmed by 0.15 s and the end card by 0.10 s.

**Accuracy:**
- Every tick is the user tapping the real checkbox. The app never suggests or packs anything.
- The items were typed into the real Prep list editor.
- The cut from "1 of 3 packed" to "Prep complete" skips the two remaining taps (Cleats, Shin guards), which were also really tapped.

## Cost
| Item | Actual | Cap |
|---|---|---|
| Opener keyframe (`fal-ai/nano-banana-pro`, req `01a1fbce-61da-7fb1-b093-f48199a2caf9`) | **$0.15** (fal usage API) | $0.70 |
| Veo Fast clip | **not used ($0)**: the still with a push reads well. Available ($0.40) if you want real motion. | |
| QA preview and capture | $0 | |

## Quality assessment
- **The opener reads instantly:** six countable bottles, an open bag, no bottle. All four hook lines sit cleanly in the top third over the soft background. With no people there's no uncanny risk. The trade-off is that it's a still, so it reads "graphic", not "footage". A $0.40 Fast clip would add life if that matters for the test.
- **The product body is accurate and clear.** But the real Prep list occupies only the top third of the screen, so the checklist is small on a phone and there's a lot of empty app background below. I tried larger punch-ins, but the UI is full-width and they crop labels and checkboxes, so pushes are capped at about 1.06×.
- **Readability:** hook C (8 words) is on screen 1.96 s against a 2.17 s reading guideline. Shortening its line, or giving C a 2.3 s hold (runtime 9.8 s), would fix that.
- **Not done yet (by design):** sound. Next is to adapt the D01 bed, taps and a soft "packed" confirmation.

---
# Opener motion test (2026-11-21), for review before sound
- **File:** `generations/review/s1/d02_s1_bottles_fast_v01.mp4` (+ `_contact.png`, `.json`). Raw copy in `generations/raw/s1/` (git-ignored).
- **Generation:** `fal-ai/veo3.1/fast/image-to-video`, 9:16, 1080p, 4 s, **audio off**, start frame = locked keyframe v01, request `01a1fbf8-bfce-74b1-bdbe-6f2ef8f3a866`, **$0.40** (the single allowed Fast generation; D02 cap now fully used: $0.15 + $0.40 = $0.55 of $0.70).
- **Result:**
  - **The check:** a hand (forearm only, no face; a second hand briefly steadies the flap) lifts the open bag, rummages past the cleats and orange shin guards, and makes it clear no bottle is inside.
  - **The bottles:** all six stay in place and countable.
  - **Clean:** no text, logos, morphing or new objects visible in the contact sheet.
  - **Camera:** subtle drift only.
- **Planned use:** about 2 s, src ≈ 0.3–2.3 (hand in → open → rummage).
- **Active hooks:** A `d02_waterbottles`, B `d02_20minutes`, D `d02_ownsix`. C `d02_alwaysforget` is parked (draft kept).
- **Next, once you approve this motion:** swap the still for this clip, add the Sarah narration ("ACTIQO keeps the prep list with the activity, so you know what's packed before you leave." / "Try it with your next practice.", ACTIQO forced via IPA), then sound.

---
# D02 v02: narrated + sound FINAL CANDIDATES (2026-11-21), for final review
**Active variants:** A (primary), B, D. C is parked (its v01 draft is kept).

| Hook (`utm_content`) | Full-sound master | Music-free | Runtime | Hook narrated? |
|---|---|---|---|---|
| **`d02_waterbottles` (A, primary)** | `review/v02/ACTIQO_D02_SixWaterBottles_9x16_d02_waterbottles.mp4` | `…_musicfree.mp4` | **10.00 s** | yes |
| `d02_20minutes` (B) | `review/v02/ACTIQO_D02_SixWaterBottles_9x16_d02_20minutes.mp4` | `…_musicfree.mp4` | 9.80 s | no (text only) |
| `d02_ownsix` (D) | `review/v02/ACTIQO_D02_SixWaterBottles_9x16_d02_ownsix.mp4` | `…_musicfree.mp4` | 9.80 s | yes |

All are 1080×1920, 30 fps, H.264 + AAC 320k. The contact sheet is `review/v02/…_d02_waterbottles_contact.png`.

## What's identical across A/B/D
- **The same:** the opener footage, product body, body narration, sound design and end card.
- **What differs:** only the hook text, its hold (A 2.70 s, B 2.50 s, D 2.50 s) and the hook VO.
- **Body:** each variant's composition is generated from the same `scene.mjs` body by `build.mjs`. The audio comes from the same `sound/mix_d02.mjs` graph, offset by the hold.

## Picture
**Opener:** the **locked Veo Fast v01** clip, src 0.30 → 0.30 + hold (A uses 0.30–3.00, B/D 0.30–2.80). A hand checks the open bag; there's no bottle inside, and all six bottles stay in view.

**Body (real capture, unchanged sequence):**
1. What to bring · **0/3** → tap.
2. **3 items to pack**.
3. tap **Water bottle** → **1 of 3 packed**.
4. **Prep complete**.

Punch-ins stay ≤1.06× (no label or checkbox is cropped). There are no fake UI or overlays.

**End card:** wordmark · **Try it with your next practice.** · getactiqo.com (2.0 s; the body hold and end card were trimmed 0.05 s / 0.15 s to fit the narration).

## Narration
Sarah, ElevenLabs v4 via fal, with ACTIQO forced via IPA **`/ˈæktɛkoʊ/`**:

| Line | Source | Placement |
|---|---|---|
| Hook A "Six water bottles. None in the bag." | req `01a1fc04-43b3-…` | at 0.05. The pause after "bottles." is tightened 0.37 → 0.12 s by an edit cut (no time-stretch) |
| Hook D "Somehow we own six of these." | req `01a1fc04-5f9e-…` | at 0.05 |
| Hook B "Practice starts in twenty minutes. Guess what we forgot." | req `01a1fc04-5146-…` (generated) | **not used**: at 3.6 s spoken, B would run about 10.9 s. B keeps on-screen text. |
| Body "ACTIQO keeps the prep list with the activity, so you know what's packed before you leave." | req `01a1fc04-6e9b-…` | H+0.05 → H+4.95. "…before you leave" lands on **Prep complete** (H+4.00) |
| CTA "Try it with your next practice." | the **same approved D01 final Sarah take** (src 8.50–10.15) | H+5.45 |

## Sound (the D01 language, original and synthesized)
- **Bed:** the same D01 synth bed (104 BPM, D major), offset so its **release lands on Prep complete**. It's ducked to 0.30 under every narration line and sits at 0.75 between lines.
- **Cues:**
  - The felt "into the app" pluck on the cut.
  - Real-action taps on the **What to bring** tap (H+1.22) and the **Water bottle checkbox** (H+2.80).
  - **Payoff:** the locked D01 Saved chime on **Prep complete** (H+4.00), together with the bed release.
- **Not used:** no licensed music, no whooshes or pings.
- **Levels:**
  - Narration −13.4 to −13.6 LUFS (the same with and without the bed); the bed is about 9 dB under it in gaps.
  - Masters: A −13.8 / B −14.9 / D −13.8 LUFS integrated (B has no hook VO), **true peak −1.49 dBTP**. The master gain is the same 11.9 dB used for D01.

## Cost (D02 total, fal usage API)
| Item | Cost |
|---|---|
| Keyframe | $0.15 |
| Veo Fast silent 4 s | $0.40 |
| Narration (4 takes, 212 chars) | $0.017 |
| CTA (reused from D01) | $0 |
| **Total** | **≈ $0.567** |

There's no more fal/Veo for D02.

## Quality assessment
- **Strong:** the opener now reads as real footage, with a real check of the bag. The narration bridges straight from the hook into the product. The "Prep complete" payoff gets the chime, the bed release and the end of the narration together.
- **Watch:** the real Prep list is still small on screen (top third), so the narration and taps carry the explanation. B's hook isn't narrated (timing); if you want it spoken, B would need about 10.9 s or a shorter line.
- **Please verify by ear:** ACTIQO = "Act-eh-co" (IPA forced; text ASR can't confirm the middle vowel).
