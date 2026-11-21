# D02 "Six Water Bottles": FINAL (closed 2026-11-21)

**Primary:** A · `d02_waterbottles`. **Controlled hook variants:** B · `d02_20minutes`, D · `d02_ownsix`. C (`d02_alwaysforget`) is parked; its draft is kept in `edit/review/`, not advanced.

## Deliverables (`final/`)
| Hook (`utm_content`) | Hook line (on screen + narrated) | Runtime | Full-sound master | SHA-256 |
|---|---|---|---|---|
| **A `d02_waterbottles` (PRIMARY)** | "Six water bottles. None in the bag." | **10.00 s** | `ACTIQO_D02_SixWaterBottles_9x16_d02_waterbottles.mp4` | `abb5e0233c9ef5438698aa03b7432bf73cac53364692c15797065f8355d0b169` |
| B `d02_20minutes` | "Practice in 20. Guess what we forgot." | 10.10 s | `ACTIQO_D02_SixWaterBottles_9x16_d02_20minutes.mp4` | `aa03a5275192f5cefd075d0a49220330ce71e8e0f6f8357215eb3bbff238a91e` |
| D `d02_ownsix` | "Somehow we own six of these." | 9.80 s | `ACTIQO_D02_SixWaterBottles_9x16_d02_ownsix.mp4` | `eb2c0110a0f40d4f6f4b86f7591a41cc2d0b8e0117d1020d9bf0872eb3a47a03` |

**Music-free alternates:**

| Hook | File | SHA-256 |
|---|---|---|
| A | `…_d02_waterbottles_musicfree.mp4` | `df41f3a2…6602a` |
| B | `…_d02_20minutes_musicfree.mp4` | `602ab052…79185` |
| D | `…_d02_ownsix_musicfree.mp4` | `88742055…79988` |

**Format:** 1080×1920 (9:16), 30 fps, H.264 + AAC-LC 320 kb/s 48 kHz.
**Loudness:** narration about −13.5 LUFS short-term, masters about −14 LUFS integrated, true peak **−1.49 dBTP**.
**Approved as-is:** A and D are byte-identical to the approved v02 review masters (`edit/review/v02/`). B is the one controlled revision: a shortened line, now narrated, with an explicit line break after "20.". The v02 B in `edit/review/v02/` is superseded.

**What's shared:** all three use identical opener footage, product body, body narration, sound design and end card. Only the hook copy, its hold (A 2.70 s, B 2.80 s, D 2.50 s) and its hook voice line differ. Source of truth: `scene.mjs` (HOOKS, BODY, BODY_VO, CTA_VO) → `edit/build.mjs` (picture) + `edit/sound/mix_d02.mjs` (sound).

## Attribution
- **Public destination:** `https://getactiqo.com/`. Never `actiqo.app`.
- **Parameters:** `utm_medium=paid_social`, `utm_campaign=d02_six_water_bottles`, and `utm_content` = `d02_waterbottles` / `d02_20minutes` / `d02_ownsix`, set in the ad platform link. Details are in `brief/HOOKS.md`.
- **On screen:** only "getactiqo.com".

## Structure (A; B and D shift by their hold H)
| t | Shot | Source |
|---|---|---|
| 0 → H | Opener + hook text + hook narration | Veo Fast v01 (locked), src 0.30 → 0.30 + H |
| H → H+1.30 | Game Plan · **What to bring · Water bottle, Cleats, Shin guards · 0/3** → real tap | real capture |
| H+1.30 → H+2.60 | **3 items to pack** (waiting at 1.92×) | real capture |
| H+2.60 → H+4.00 | real tap **Water bottle** → **1 of 3 packed** | real capture, 1× |
| H+4.00 → H+5.30 | **Prep complete** (payoff: Saved chime + bed release + end of narration) | real capture |
| H+5.30 → H+7.30 | End card: wordmark · **Try it with your next practice.** · getactiqo.com | brand |

## Real ACTIQO UI provenance
**Build:**
- **Source:** `actiqo/actiqo@main` **`dca1b87c9a81371c02bb36177da46e3b894f0f7e`**.
- **Runtime:** a temporary protected Vercel Preview `dpl_GEMCJHQYvtd3XzZh7VXXsJKkTbGT`, with **QA Supabase only**. The project was deleted after capture.

**Fixture:** QA demo household "Sam" / Leo / Soccer Practice, `d02de000-…`. The prep items were added through the real Prep list editor.

**Capture:**
- **Every tick is a real tap** (`PATCH /api/family-sync/session-state`, 200). The app suggests and packs nothing.
- **Clean run:** 0 secret or production-ref hits, no notifications.
- **Reset:** the session was reset to 0/3 through the real UI.

**Not redrawn:** the UI isn't redrawn, composited or cropped; punch-ins are at most 1.06×.

**Record:** `ui/CAPTURE_RECORD.md`. The capture files are in `ui/capture/`.

## Generation provenance and cost (fal.ai; ledger `gtm/generations-ledger.jsonl`, totals confirmed against fal's usage API)
| Asset | Endpoint | Request ID | Cost |
|---|---|---|---|
| Opener keyframe (locked) | `fal-ai/nano-banana-pro` (9:16 2K) | `01a1fbce-61da-7fb1-b093-f48199a2caf9` | $0.15 |
| Opener motion (locked, src 0.30 → 0.30+H used) | `fal-ai/veo3.1/fast/image-to-video` (4 s, silent) | `01a1fbf8-bfce-74b1-bdbe-6f2ef8f3a866` | $0.40 |
| Hook A voice | `elevenlabs/tts/eleven-v4` (Sarah) | `01a1fc04-43b3-7403-aa6d-5894b0337932` | $0.0028 |
| Hook B voice (final, shortened) | same | `01a1fe73-02aa-7600-92db-02bf385b3236` | $0.0033 |
| Hook B voice (original long line, unused) | same | `01a1fc04-5146-7be2-a763-a0129bcbfb14` | $0.0045 |
| Hook D voice | same | `01a1fc04-5f9e-78e2-abea-22141de998a9` | $0.0022 |
| Body voice "ACTIQO keeps the prep list with the activity, so you know what's packed before you leave." | same | `01a1fc04-6e9b-7ab2-beda-0d68bb82a165` | $0.0074 |
| CTA voice "Try it with your next practice." | reused from the approved D01 final Sarah take (`01a1fbfa-…`, src 8.50–10.15) | | $0 |
| **D02 total** | | | **$0.570** (cap $0.70) |

**Voice:** ACTIQO is forced via ElevenLabs IPA **`/ˈæktɛkoʊ/` ("ACT-eh-co")**. Sarah is the series narrator, as in D01.
**Edits to the voice lines:** none are time-stretched. Only the pauses after "bottles." (A) and "twenty." (B) were shortened, by cutting silence.

## Audio provenance
- **Narration:** Sarah (above).
- **Sound design:** the **original, synthesized** D01 language from `../d01-pickup/edit/sound/synth.mjs` (104 BPM D-major bed, felt taps) plus the locked D01 Saved cue (`../d01-pickup/edit/sound/locked/sfx_saved_v01.wav`), mixed by `edit/sound/mix_d02.mjs`.
- **Music:** **no third-party music**, and no licensed, stock or downloaded audio.
