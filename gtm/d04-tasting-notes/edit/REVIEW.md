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

---
# Step 4: real ACTIQO product capture (2026-11-21), for review
**Founder motion locked:** `generations/review/s2/d04_s2_founder_fast_v01.mp4`. Not slowed or regenerated. Preferred section: src ≈2.6–5.2 s.

**Capture:** `ui/capture/d04_ui_flow_9x16.mp4` (16.5 s, real current UI, QA only). Full record: `ui/CAPTURE_RECORD.md`.
- **All three ideas on ONE real Game Plan screen:**
  - **Leave by 4:30 PM · Fixed leave time**
  - **Pickup · You · Saved**
  - **What to bring · Water bottle, Cleats, Shin guards · 0/3**
- **The sequence:** settled Game Plan (6.1 s hold) → real tap on What to bring → **Prep list: 3 items to pack** (4.6 s) → back → Game Plan (4.6 s).
- **Cost:** $0. The temporary preview is deleted; no production credentials or data were involved.

## Composite layout tests (`edit/layout_tests/`, free; red tint = TikTok/Reels unsafe areas)
| | Layout | Result |
|---|---|---|
| A | Whole app screen scaled into the right clean zone (485 px wide) | **Not recommended.** The UI drops to ~45% scale and the row text is very small on a phone. The right edge also overlaps the TikTok/Reels button rail from y 840 down. |
| **B** | **Real rows region, full row width (labels, "Change", "0/3" and chevrons intact), 660 px wide inside the lower safe area (x 120–780), below Alec's face** | **Recommended.** About 66% scale, readable. Alec's face and shoulders stay fully visible above it. |

**Refinement for B:** at 660 px wide, the whole rows region (leave card → What to bring) is ~490 px tall and would cross the bottom safe line (y 1260). So the composite should be a **real 660 × ~400 window that slowly pans down the genuine Game Plan**, following the line:
- "pickup": the leave card and pickup row
- "packing": the What to bring row (optionally a brief cut to the real Prep list, "3 items to pack")
- "leave times": the leave card

It's one continuous, uncropped-width piece of the real screen, not floating cards, with Alec on the left and above.

**D04 spent so far:** $1.50 (unchanged).

**Still on hold:** closing keyframe and motion (≈$0.75), voice (I need a reference recording from you), lip-sync.

---
# Step 5: ROUGH visual assembly v01 (no new spend, 2026-11-21), for review
- **File:** `edit/rough/review/d04_rough_v01_silent.mp4` (1080×1920, 30 fps, 18.9 s, **silent**). Also `…_contact.png` and `…_product_pan_states.png`.
- **Build:** `edit/rough/build.mjs` → `index.html` → HyperFrames 0.9.72. Check passes: 0 errors, every caption inside the TikTok/Reels/Shorts safe areas. The red review overlays are **not** in the render.
- **Voice:** the planned lines are **placeholder subtitles only** (Cork tan `#E9D6B4` panel, burgundy `#8B3E3D` text; the title uses inverted colours). No audio.
- **Typography:** Inter is a placeholder. No Cork font is defined in the repo; supply one if Cork has a brand typeface.

| t (s) | Picture | Placeholder line |
|---|---|---|
| 0.0–6.0 | **Locked opener**, full 6 s. Title "TASTING NOTES OF PARENTHOOD" 0–2.6. | "Notes of blackberry. Hints of oak." / "Twelve texts about tomorrow's soccer practice." (then the deadpan beat, 5.1–6.0) |
| 6.0–12.0 | **Locked founder clip**, full 6 s, **real speed** (no slow-motion, no freeze) | "I'm Alec, the dad behind Cork Connoisseur." |
| 8.45–12.0 | **Layout B:** ONE real Game Plan window (660 × 390, ≈0.66 scale, x 120–780, y 870–1260) over the founder's stable section. Alec's face and shoulders stay clear. | "I also built ACTIQO to keep pickup, packing and leave times together." (caption moves to the top zone) |
| | Pan in spoken order (the whole window moves; no element animated on its own): **"pickup"** Pickup · You · Saved → **"packing"** (10.15) What to bring · Water bottle, Cleats, Shin guards · 0/3 → **"leave times together"** (10.75) Leave by 4:30 PM · Fixed leave time | |
| 12.0–14.0 | **Closing test A:** reuse of opener src 4.0–6.0 | "Try it with your next practice." |
| 14.0–16.4 | **Closing test B:** reuse of opener src 0.0–2.4 (callback to the sniff) | "Then we can get back to the tasting notes." |
| 16.4–18.9 | End card: ACTIQO · Try it with your next practice. · Free. · getactiqo.com | — |

## Findings
1. **The founder and product section fits at real speed.** Both founder lines need ≈6 s spoken, the founder clip is 6 s, and the product window sits on its stable section. **No slow-motion, freeze or extra founder footage is needed.**
2. **Layout B reads.** Each pan stop lands cleanly on a real row (see `…_product_pan_states.png`), and it stays recognisably one Game Plan.
3. **The reused footage does NOT close the piece cleanly:**
   - At 12–14 s Alec is still **looking down at the glowing phone**, so "Try it with your next practice." lands on a glance-down, not the knowing look the script needs.
   - At 14–16.4 s the **opening sniff visibly repeats**, and the **phone jumps from lit back to dark**, a continuity break.
   - On a second viewing it reads as recycled footage, not a callback.
   - The founder clip can't close either: it's fully used under the founder and product lines.

## Recommendation
**Generate the separate closing shot: ≈$0.75** (one closing keyframe $0.15 + one Veo Fast 6 s silent $0.60). Seated, waist-up, same identity, outfit and set; the glass in hand, the phone dark. A knowing look to camera on "Try it with your next practice.", then a glance back at the glass on "Then we can get back to the tasting notes." That replaces 12.0–16.4 and finishes the bookend.

**No-spend alternative** (weaker): cut from the product section straight to the end card. "Try it with your next practice." plays over the end card, and "Then we can get back to the tasting notes." is either dropped or played over the end card. That loses the Cork callback, which is the joke's payoff.

**D04 spent:** $1.50 (unchanged). With the closing shot: ≈$2.25. Voice and lip-sync are priced after your reference recording.

---
# Step 6: closing keyframe v01 (2026-11-21), for review: ⚠️ too close to the founder frame
- **File:** `references/keyframes/d04_s3_closing_keyframe_v01.png` (1536×2752). Comparison: `references/keyframes/d04_s3_closing_v01_vs_founder.jpg` (founder left, closing right). Prompt: `generations/prompts/s3_closing.json`.
- **Generation:** `fal-ai/nano-banana-pro/edit` with anchors `corkconnoisseur.png` + opening keyframe + founder keyframe. 2K. Request `01a1ffe7-2d97-75e0-a847-b27f915260ea`, **$0.15**.

## Assessment
**Right:**
- **Identity and look:** face, swept-back hair, beard, burgundy corduroy blazer, white crew-neck. The same set, light and lens.
- **Expression:** looking straight into the camera with a dry, knowing half-smile, the "we survived that" look, restrained.
- **Phone:** dark and inactive. No glow, sniff, text, logos, UI or other people.
- **Bottles:** soft cream labels with no readable text.

**Misses the brief:**
1. **It repeats the founder pose** almost exactly: the same left-of-centre placement, the same arm across the table, the same hand at the glass base. Next to the founder frame it reads as **a repeat, not a callback** (see the comparison).
2. **The glass is set down on the table** with his hand at the base. It isn't **held** low at chest height, so the planned motion ("attention drifts back to the wine") has less to work with.
3. **It isn't closer or centred** as asked; the framing is about the same as the founder shot. Subtitle space is fine above and below.

## Recommendation: ONE controlled retry (≈$0.15; the shot's keyframe cap allows a second)
Re-run with stronger, explicit differences:
- Centred and **chest-up, clearly closer** than the founder frame.
- **The stem held in his hand, the glass lifted to mid-chest** (not on the table and not near his face). His other forearm rests on the table.
- **A slight lean back**, the shoulders squared to the camera.
- The same knowing half-smile, the phone dark at the table edge.
- Add the founder frame to the prompt as "do NOT repeat this pose".

If you'd rather not spend, v01 can still be animated. But the close would then look like a return to the founder shot.

**D04 spent:** $1.65 (+ this $0.15). Motion is on hold.

---
# Step 6b: closing keyframe v02, the approved retry (2026-11-21), for review
- **File:** `references/keyframes/d04_s3_closing_keyframe_v02.png` (1536×2752). Comparison: `references/keyframes/d04_keyframes_open_founder_closing_v02.jpg` (opening | founder | closing v02).
- **Generation:** `fal-ai/nano-banana-pro/edit`, the same three anchors, with the founder frame named as "do NOT repeat this pose". 2K. Request `01a20006-8e6b-7c50-a659-a70b1af92b8d`, **$0.15**. This was the shot's 2nd and last keyframe under the cap.

## Assessment
**Distinct from both earlier shots:**
- **Placement:** centred, shoulders square to the camera.
- **Glass:** held by the stem at **mid-chest**, red wine visible, not at his face (unlike the opener) and not resting on the table (unlike the founder shot).
- **Other arm:** his forearm rests on the table edge.

**Matches the brief:**
- **Expression:** direct to camera with a restrained, dry, knowing half-smile, "the joke landed".
- **Continuity:** same identity, burgundy corduroy blazer, white crew-neck, dark-wood table, amber pendants, warm side and rim light. It reads as the same evening a few moments later.
- **Clean:** the phone lies dark at the table edge (no glow). No text, logos, UI or other people. The background shelf bottles are soft, with no readable labels.
- **Subtitle space:** calm space above his head (below the pendants) and on the lower table area. Subtitles won't cover the face or glass.
- **Motion:** this frame gives the planned move room: from the look to camera on "Try it with your next practice." to his attention drifting down to the held glass on "Then we can get back to the tasting notes."

**Notes:**
1. The framing scale is only slightly closer than the founder shot. The difference comes mainly from centring and the raised glass, which is enough to read as a new shot.
2. The background shows a little more of the bottle shelf on the right than the earlier shots. It's plausible within the same room.

**D04 spent:** $1.80.

**Next, after approval:** closing motion, Veo Fast 6 s silent, **$0.60**, giving ≈$2.40 for visuals.

---
# Step 7: closing motion v01 (2026-11-21), for review
**Closing keyframe locked:** `references/keyframes/d04_s3_closing_keyframe_v02.png`.

- **File:** `generations/review/s3/d04_s3_closing_fast_v01.mp4` (+ `_contact.png` at 4 fps, `_detail.png` at 1.2 / 2.6 / 4.6 / 5.8 s, `.json`). Raw copy in `generations/raw/s3/` (git-ignored).
- **Generation:** `fal-ai/veo3.1/fast/image-to-video`, 9:16, 1080p, **6 s, silent**, start frame = locked keyframe v02. Request `01a2000b-dce7-7d42-b88f-571dc1d87470`, **$0.60**.
- **Output:** 1080×1920, 24 fps, 144 frames, no audio.

| Source time | Action |
|---|---|
| 0.0–2.0 s | Direct eye contact with a half-smile. Lips move as if saying one short line, for **"Try it with your next practice."** |
| ≈2.0–3.6 s | His attention drifts down to the wine. He lowers the glass to rest on the table, with a quiet, satisfied, closed-mouth look. |
| ≈3.8–4.9 s | He lifts the glass to mid-chest and gives it a small swirl while looking at the wine (**not** sniffing, not drinking) |
| ≈5.0–6.0 s | The glass settles back to the table. He keeps looking at it with a contented half-smile, a calm ending hold. |

**Checks:**
- **Continuity:** identity holds in every checked frame (face, hair, beard, burgundy corduroy blazer, white crew-neck), with the same set, light and lens.
- **Clean:** **the phone stays dark** the whole time. No text, logos, UI or other people. The background bottles stay soft and unreadable.
- **Stable:** no hand or glass morphing.

**Notes:**
1. **Delivery:** at ≈1.0–1.5 s the talking beat is a little more animated than "restrained" (brows up, a broad mouth shape). Lip-sync to your voice will re-drive the mouth, and the knowing half-smile is clear at 0.0 and 1.8–2.0 s.
2. **"Then we can get back to the tasting notes."** plays over 2.0–4.9 s, while his eyes are on the glass and his mouth is mostly closed. In the edit it can work as an **off-mouth line** (natural for a glance away), or lip-sync can animate it. I'll judge on the rough cut with your voice.
3. **Edit window:** about 0.0–5.0 s covers both lines. 5.0–6.0 s is a clean ending hold before the end card.

**D04 visuals complete:** opener + founder + closing, all locked/approved pending this review.

**D04 spent:** **$2.40** (keyframes $0.15 + $0.15 + $0.15 + $0.15 retry; motions $0.60 × 3).

**Next (on hold until you say so):** the voice. I need a reference recording from you (a phone voice memo, quiet room: the four lines read naturally, plus ≈30–60 s of normal talking). Then a voice clone and lip-sync, priced before any call. The rough cut v02 then swaps in the closing shot.

---
# Step 8: VOICED rough cut v02 (real voice, no lip-sync, no new spend; 2026-11-21), for review
- **File:** `edit/rough/review/d04_rough_v02_voiced.mp4` (1080×1920, 30 fps, **19.40 s**, AAC 320k) + `…_v02_contact.png`.
- **Build:** `edit/rough/voiced.mjs` (timeline) → `build_v02.mjs` (picture, HyperFrames check passes) + `sound/mix_v02.mjs` (sound).
- **Visuals:** all LOCKED; no new generation.
- **Voice:** Alec's REAL takes (trims in `audio/VOICE_SELECTION.md`).
- **Mix:** −14.7 LUFS integrated, peak −1.4 dBFS.
  - **Voice:** 80 Hz high-pass and level match only.
  - **Notifications:** two quiet, originally synthesized blips (2.00 / 2.62 s).
  - **End card:** soft chime (locked D01 cue).
  - **Room tone:** faint. No music bed (placeholder mix).

| t (s) | Picture | Real voice |
|---|---|---|
| 0.00–6.00 | Locked opener (title 0–2.6) | Take 1, **voice-over**: "Notes of blackberry. Hints of oak." (0.20–2.03, over the sniff) · natural 0.76 s pause · "Twelve texts about tomorrow's soccer practice." (2.78–5.14, phone glow → glance down) · **≈0.9 s of silence on the deadpan** before the cut |
| 6.00–12.00 | Locked founder clip, real speed | Take 2: "I'm Alec, the dad behind Cork Connoisseur." (6.10–8.55) |
| 8.65–12.00 | + Layout B real Game Plan window | Take 2: "I also built ACTIQO to keep pickup, packing and leave times together." (8.65–12.00). The pan lands on the words: pickup (shown from 8.65; spoken 10.03) → What to bring (10.42; "packing" 10.51) → Leave by 4:30 PM (10.92; "leave times" 10.99) |
| 12.00–16.90 | Locked closing, src 0.0–4.9, clean cut | Take 2: "Try it with your next practice." (12.21–≈13.7, eye contact, mouth moving) · "Then we can get back to the tasting notes." (13.94–≈15.75, **voice-over** while his eyes go to the glass, mouth closed as generated) |
| 16.90–19.40 | ACTIQO end card: Try it with your next practice. · Free. · getactiqo.com | chime |

## Lip-sync: is it needed?
| Section | Verdict |
|---|---|
| **Opening** | **Not needed.** The glass hides the mouth during the first sentence. The punchline plays as natural voice-over over the glance at the phone and the deadpan. |
| **Founder (6.0–12.0)** | **Recommended.** It's the only sustained to-camera speech: ≈5.9 s of continuous real voice with his face large. The generated mouth "talks" in its own rhythm (open-mouth shapes and pauses that don't match the real phrasing), so the mismatch is likely visible on a phone. |
| **Closing, first sentence (12.1–13.7)** | **Optional.** The generated mouth is already moving in the same window, so the mismatch is mild at about 1.5 s. Judge on the founder result first. |
| **Closing, second sentence** | **Not needed.** Voice-over while he looks at the glass, as you wanted. |

**Model and cost** (fal list prices, read-only pricing API, 2026-11-21):

| Model | List price | Founder 6 s | Closing line ~1.8 s |
|---|---|---|---|
| **`fal-ai/sync-lipsync/v2/pro`** (Sync Labs lipsync-2-pro, highest quality) — recommended | $5 / min | **≈ $0.50** | ≈ $0.15 |
| `fal-ai/sync-lipsync/v2` (lipsync-2) | $3 / min | ≈ $0.30 | — |
| `fal-ai/latentsync` (open model) | $0.005 / s | ≈ $0.03 | — |

`latentsync` is cheap but lower-resolution around the mouth, with a higher risk of a soft or "synthetic" mouth on a large face. The recommended pass is **one `sync-lipsync/v2/pro` run on the locked founder clip (6 s) with the exact v02 founder audio (both lines, as placed), ≈$0.50**. Minimum-billing granularity per request isn't published in the pricing response; the actual charge is checked against fal usage afterwards.

**D04 spent:** $2.40 (unchanged; this step was free). With the founder lip-sync: ≈$2.90 (+ ≈$0.15 if the closing line is also done).

---
# Step 9: founder lip-sync (ONE pass) + voiced rough v03 (2026-11-21), for review
**Pass:**
- **Model:** `fal-ai/sync-lipsync/v2/pro` (Sync Labs lipsync-2-pro), `sync_mode: cut_off`. Request `01a20087-1cdd-7cc0-856e-00d7a9ae51ca`.
- **Cost:** **$0.50, confirmed by fal's usage API** (0.1 min × $5/min).
- **Runner:** `gtm/scripts/lipsync.mjs` (dry-run by default, ledger before submit, 1-pass cap in `brief/budget.json`).

**Inputs:**
- **Video:** the **LOCKED clean founder clip** `generations/review/s2/d04_s2_founder_fast_v01.mp4`, with no ACTIQO overlay.
- **Audio:** `audio/lipsync/d04_founder_audio_6s.wav`, **cut sample-exact from the approved v02 mix at 6.00–12.00 s**. Its pauses match the v02 MP4 exactly (2.316–2.467 s and 5.772–5.939 s). That's Take 2 "I'm Alec, the dad behind Cork Connoisseur." + Take 2 "I also built ACTIQO to keep pickup, packing and leave times together.", as placed. No re-synthesis, clone or time-stretch.

**Outputs:**
- **Raw lip-synced clip:** `generations/review/lipsync/d04_s2_founder_lipsync_pro_v01.mp4` (+ `.json`). 1080×1920, 24 fps, **144 frames, 6.00 s**, identical to the source.
- **Comparison:**
  - `…_sidebyside.mp4`: source | lip-sync, with the real audio
  - `…_mouth_compare.png`: mouth at 10 moments, source above, lip-sync below
  - `…_zoom_pause.png`: full-resolution mouth around the pause and at 3.0 s
- **Updated cut:** `edit/rough/review/d04_rough_v03_founder_lipsync.mp4` (19.40 s) = v02 with **only** the founder clip swapped (`build_v03.mjs`).
  - **The same everything else:** timing, the real ACTIQO overlay, opener, closing, subtitles, and the **byte-identical v02 audio**.
  - **Check:** closing section SSIM 1.000 against v02. The opener differs only by re-encode (0.995).

## Quality check (source vs lip-sync)
| Check | Result |
|---|---|
| Area changed | **Only the mouth/lower-lip area.** The time-accumulated difference map lights up just the mouth. Below the face (blazer, hands, glass, table) the difference is re-encode noise only (mean 0.8/255). |
| Identity, eyes, nose, skin, hair, blazer, shirt | Unchanged (they're outside the edited area) |
| Head motion, hand gesture, glass, framing, background, camera | Unchanged; same frame count and timing |
| Jaw shape / face flicker | None seen |
| Beard around the lips and chin | Kept. A **slight smoothing** of the beard edge right at the lips and inside the mouth compared with the source. Mild, typical of lip-sync, not plastic at full resolution. |
| Teeth | Natural-looking; no extra or stretched teeth |
| Articulation | Shapes now follow the real words: lips closing on "I'm", "Alec", "behind", "built", "pickup", "packing", and open vowels on "Connoisseur", "together" |
| Lips during real pauses | **The 0.15 s pause between the lines (2.32–2.47 s):** the mouth stays **open** through it, carrying from "Connoisseur" into the shape for "I also" (≈3–4 frames). It reads as natural co-articulation at phone size, but it is movement during a pause. **The end pause (5.77–5.94 s):** the mouth settles near-closed. |
| Frame/timing changes | None (144 → 144 frames, 6.00 s) |

**Verdict:** the founder section now reads as Alec actually saying the lines. The only artefacts are the mild lip-edge smoothing and the 3–4 frame open mouth in the inter-line pause. **Please review the side-by-side with sound.**

**D04 spent:** **$2.90** (visuals $2.40 + lip-sync $0.50).

**Not done (by instruction):** no opener or closing lip-sync and no retry. The closing ≈$0.15 pro pass is to be decided after you review this.

---
# Post-final timing test: founder lip-sync feels late (2026-11-22). NO SPEND, NO AI media re-run; the final master is unchanged
**Files** (`edit/rough/review/timing_test/`):

| Version | File | What |
|---|---|---|
| A | `d04_timing_A_current.mp4` | Byte copy of the approved final master |
| B | `d04_timing_B_founder_audio_plus022.mp4` | **+0.22 s** on the founder-section audio, its two captions and the product cues |

- **B's shifts:** founder line 6.10 → 6.32, product line 8.65 → 8.87, product window in 8.65 → 8.87, pan to "packing" 10.42 → 10.64, pan to "leave times" 10.92 → 11.14, captions 6.10/8.65 → 6.32/8.87.
- **Not shifted:** the lip-synced founder video, opener, closing, end card, every visual clip timing, the voice takes and the bed placement.
- **Built from:** `D04_FOUNDER_DELAY=0.22` in `edit/rough/voiced.mjs` (default 0 reproduces the approved final exactly), `build_v03.mjs` + `sound/mix_final.mjs`.
- **Both:** 19.40 s, −14.3 LUFS, −1.8 dBTP.

## Measured (music-free audio, −30 dB)
| | A (current) | B (+0.22 s) |
|---|---|---|
| "I'm" onset | **5.93 s**, 0.07 s *before* the cut to the founder clip | **6.15 s**, after the cut |
| Gap between "together." and the closing take's lead-in (breath, then "Try" ≈12.02 s) | 11.75–11.95 s (**0.21 s**) | **none**: "together." now ends ≈11.97 s and runs straight into the closing breath; "Try" follows ≈0.05 s later |

**Findings:**
1. **Systematic offset:** every real-voice line plays ≈0.17 s earlier than its nominal timeline placement. That's the phone memos' AAC decode/priming on the trims. So the founder audio already sat early; +0.22 s puts it ≈0.05 s after its nominal spot.
2. **The trailing room is ≈0.18–0.21 s, not 0.22 s.** In B the product line butts against the closing line at the cut. Listen at 11.8–12.1 s for a run-on.
3. **If B's sync is preferred but the handover feels rushed:**
   - **+0.15 to +0.18 s** keeps a small breath (≈0.03–0.06 s) without touching the closing.
   - Or keep +0.22 s and trim ≈0.04 s of the closing take's lead-in breath (an audio-only trim; the closing visual is unchanged).
   - Both are free.
