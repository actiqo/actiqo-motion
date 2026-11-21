# D04 Checkpoint 1: opening keyframe v01 (2026-11-21)

- **File:** `references/keyframes/d04_s1_open_keyframe_v01.png` (1536×2752, 9:16). Record: `…_v01.json`. Prompt: `generations/prompts/s1_tasting_open.json`.
- **Generation:** `fal-ai/nano-banana-pro/edit`, the only input `corkconnoisseur.png`, 2K, request `01a1ff86-975e-7231-a921-300ce5e461b0`, **$0.15**.

## Assessment
- **Identity:** strong match to the reference: face shape, eyes, ears, swept-back brown hair, trimmed full beard. Outfit kept: burgundy corduroy blazer, white crew-neck.
- **Action:** waist-up, seated at a dark-wood table, red wine glass at his nose, eyes on the wine, a dry and serious tasting look. That's the setup for the deadpan.
- **Look:** warm amber pendants, wine shelf in soft focus, side key plus rim light. Reads as premium editorial, not stock.
- **Phone:** on the table screen-up, but the screen is **black and blank** (no text). That suits the later notification beat; any screen glow will be kept free of text.
- **Watch items:**
  1. The bottle labels in the background are blurred cream labels with faint, unreadable pseudo-lettering. No logos or readable text, but they're the busiest detail. They could be softened in the edit, or re-specified as "no labels" in later shots.
  2. The top fifth holds the pendant lights. The "TASTING NOTES OF PARENTHOOD" title will sit on its own Cork burgundy/tan panel there.
  3. The bright spot inside the glass is a specular highlight, not an object.

## Plan after approval (each step stops for review; exact cost before each call)
| Step | What | Expected cost |
|---|---|---|
| 1 | **S1 opening motion**: Veo 3.1 Fast image-to-video from this keyframe, 6 s, silent. Swirl and sniff, the phone buzzes twice (screen glow, no text), he glances down, deadpan to camera. | $0.60 |
| 2 | **S2/S3 founder + product-side keyframe**: same identity, glass set down, slightly wider, facing camera, framed to leave room for the real app beside him | $0.15 |
| 3 | **S2/S3 motion**: Veo Fast, 6 s silent (founder intro, then held beside the real app) | $0.60 |
| 4 | **S4 closing keyframe + motion**: knowing look, then a glance back at the glass. Keyframe $0.15 + Veo Fast 6 s silent $0.60 | $0.75 |
| | **Visuals total** (including this $0.15) | **≈ $2.25** |
| — | **QA product capture** (approved): one Game Plan with pickup saved + What to bring populated + leave time saved | $0 |
| — | **Voice clone + lip-sync**: priced once your voice reference is in hand | TBD; reported before any call |

All clips are generated **without embedded speech** (per your option B).

---
# Step 1: opening motion v01 (2026-11-21), for review
- **File:** `generations/review/s1/d04_s1_open_fast_v01.mp4` (+ `_contact.png` at 4 fps, + `.json`). Raw copy in `generations/raw/s1/` (git-ignored).
- **Generation:** `fal-ai/veo3.1/fast/image-to-video`, 9:16, 1080p, **6 s, silent**, start frame = locked keyframe v01. Request `01a1ff8a-2eeb-7692-9ac4-76dd3b2973d3`, **$0.60**.
- **Output:** 1080×1920, 24 fps, 144 frames, no audio track.

| Source time | Action |
|---|---|
| 0.0–2.0 s | Swirl and sniff, glass at the nose, serious tasting focus |
| ≈2.0 s | The phone screen lights up (plain blue glow, **no text or icons**) and stays lit |
| 2.5–4.3 s | He lowers the glass, glances down at the phone, a beat |
| ≈4.5–6.0 s | Looks straight into the camera. A brief mouth movement around 4.8 s, then a **dry, deadpan, knowing hold** to the end |

**Checks:**
- **Identity:** holds through the clip (face, hair, beard, blazer, white tee). The final frames are a strong match to the reference.
- **Clean:** no new people, text or logos. The glass and hands stay stable, with no morphing.
- **Background:** the bottle labels stay soft and unreadable.

**Notes:**
1. The phone lights **once** and stays lit, not two separate pulses. The two notification sounds will be timed in the mix: one on the glow (≈2.0 s), one around 2.6 s as he looks down.
2. The camera is held steady rather than pushed in. A gentle push-in can be added in the edit if wanted.
3. Your opening line ("Notes of blackberry. Hints of oak. Twelve texts about tomorrow's soccer practice.") will be laid in with your voice. With the glass at his mouth in the first 2 s, lip-sync works best on the second half (the to-camera section). The first sentences can play as natural off-mouth murmur during the sniff.

**D04 spent:** $0.75 (keyframe $0.15 + motion $0.60).

**Next, after approval:** step 2, the founder/product-side keyframe, **$0.15**.

---
# Step 2: founder-intro keyframe v01 (2026-11-21), for review
**Opener locked:** `generations/review/s1/d04_s1_open_fast_v01.mp4` is approved. No regeneration and no editorial push-in.

- **File:** `references/keyframes/d04_s2_founder_keyframe_v01.png` (1536×2752). Record: `…_v01.json`. Prompt: `generations/prompts/s2_founder_side.json`.
- **Generation:** `fal-ai/nano-banana-pro/edit` with **two anchors**: `corkconnoisseur.png` (identity) and the locked opening keyframe (scene). 2K. Request `01a1ff92-b911-7861-8172-f6a72a1437e3`, **$0.15**.
  - `gtm/scripts/generate.mjs` now accepts an array of reference images (backward-compatible).

## Assessment
- **Identity and wardrobe:** matches the reference and the opener: face, swept-back hair, trimmed beard, burgundy corduroy blazer, white crew-neck.
- **Setting:** the same amber pendants, dark-wood table, warm side and rim light, and the same shallow lens character.
- **Pose:** seated and slightly wider than the opener (waist-up). He faces the camera with a small, warm, self-aware founder smile. The glass is **set down** at his right hand; the phone lies on the table with a dark, blank screen.
- **Space for the app:** a calm, softly lit warm wall on the right, roughly **x 595–1080 × y 180–1010** at 1080×1920 (about 485 × 830 px, close to a phone's aspect). There are no shelves, bottles or objects there, so it suits a large real ACTIQO recording beside him.
- **Composition:** Alec takes the left ~55–60% and stays dominant. His face sits at about y 520–830, clear of the platform's top and bottom controls.
- **Watch items:**
  1. A pale counter edge runs across the right side at y ≈ 1050 (at 1080 scale), just below the clean zone. The app panel can sit above it or overlap it.
  2. His left hand enters at the right edge, holding the glass base. It's anatomically fine.
- **Clean:** no text, labels, logos, UI or other people.

**D04 spent:** $0.90 (keyframe $0.15 + opener motion $0.60 + this keyframe $0.15).

**Next, after approval:** step 3, a founder-intro motion from this keyframe: Veo Fast, 6 s, silent, **$0.60**. QA capture, voice and the closing shot stay on hold until you say so.

---
# Step 3: founder-intro motion v01 (2026-11-21), for review
**Founder keyframe locked:** `references/keyframes/d04_s2_founder_keyframe_v01.png` is approved; no regeneration.

- **File:** `generations/review/s2/d04_s2_founder_fast_v01.mp4` (+ `_contact.png` at 4 fps, + `.json`). Raw copy in `generations/raw/s2/` (git-ignored).
- **Generation:** `fal-ai/veo3.1/fast/image-to-video`, 9:16, 1080p, **6 s, silent**, start frame = locked founder keyframe. Request `01a1ff9d-b00f-70d1-bbe9-1d5b8cc5fd07`, **$0.60**.
- **Output:** 1080×1920, 24 fps, 144 frames, no audio.

| Source time | Action |
|---|---|
| 0.0–1.9 s | Facing camera, calm. Lips move naturally as if he's starting to introduce himself. One normal blink at ≈1.75 s. |
| ≈2.0–2.5 s | One small, open, explanatory hand gesture (left hand, low over the table), then the hand returns to the glass base |
| **≈2.6–5.2 s** | **Most stable window (≈2.6 s):** hands at rest, steady eye contact, small speaking mouth movement, minimal head motion. Normal blink at ≈4.0 s. |
| ≈5.3–6.0 s | A soft glance down toward the table, a calm closing look |

**Checks:**
- **Frame 0:** identical to the locked keyframe; Veo didn't reframe. The camera stays locked off with no push or pan.
- **Identity:** holds (face, swept-back hair, beard, burgundy corduroy blazer, white crew-neck).
- **Table and set:** the glass stays set down and the phone stays dark and blank. No text, labels, logos, UI or other people.
- **Clean zone:** the right side (about x 595–1080 × y 180–1010) stays clean for all 6 s. The gesture at 2.0–2.5 s stays left of it.

**Notes for the edit (no action yet):**
1. **Framing:** the clip keeps the locked keyframe's framing. Alec takes the left ~55%, and the clean zone is ~45% of the width (about 485 px). Your note asked for 40–45% / 55–60%. Getting there would need a new keyframe, which you've ruled out, so the ACTIQO panel will be sized to the clean zone. It's still large: at about 485 × 830 px it shows the Game Plan at roughly 45% scale.
2. **Coverage:** 6–16 s is 10 s of script, but this clip is 6 s. Options for the edit:
   a. Play it at real speed for 6–12 s, then hold the calmest frames under the app at a slightly reduced rate.
   b. Slow the stable window a little (≈0.8×).
   c. Play the founder line (6–10 s) on the clip, then let the real ACTIQO recording take more of the frame for 10–16 s, with a calm portion of the clip beside it.

   I'll propose the exact choice once the capture and voice exist.
3. Lip-sync to your real voice will replace the generic mouth movement in the final.

**D04 spent:** $1.50 (opening keyframe $0.15 + opener motion $0.60 + founder keyframe $0.15 + founder motion $0.60).

**Still on hold until you say so:** QA product capture, closing shot ($0.75 planned), voice (reference needed from you).
