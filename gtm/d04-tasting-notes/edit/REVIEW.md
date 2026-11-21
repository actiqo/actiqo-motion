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
