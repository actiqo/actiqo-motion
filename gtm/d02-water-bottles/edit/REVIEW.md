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
