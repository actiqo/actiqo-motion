# D01 Narrated v2 · DRAFT for review (2026-11-21)

**v1 is preserved untouched** (`final/`, `edit/`). v2 lives in `v2/` and only reads the locked sources.
**The narration is a DRAFT placeholder.** The Sarah audition reads "ACTIQO" as **"Actico"**. The final narration is generated only after you confirm the pronunciation and choose a voice.

## Files
| File | What |
|---|---|
| `v2/edit/review/d01_narrated_v2_draft.mp4` | 1080×1920, 30 fps, **15.00 s**, H.264 + AAC 320k: picture + dialogue + narration + SFX + bed |
| `v2/edit/review/d01_narrated_v2_draft_musicfree.mp4` | the same, without the bed |
| `v2/edit/review/d01_narrated_v2_draft_contact.png` | contact sheet (2 fps) |
| `v2/audio/auditions/aud_{sarah,jessica,chris,eric}.wav` | **4 voice auditions** of the full script (ElevenLabs v4 via fal). Pick one. |

Build: `v2/edit/link-assets.sh` → HyperFrames 0.9.72 render of `v2/edit/index.html` (muted picture) → `v2/edit/sound/mix_v2.sh <picture> <out> [musicfree]`.

## Timeline (as built)
| t (s) | Picture (source) | Voice |
|---|---|---|
| 0.00–1.30 | Alex Fast v01, src 0.00–1.30 (locked) | "I thought you had pickup." (native, v1 edit) |
| 1.30–2.80 | Jordan Fast v01, src 0.25–1.75 (locked) | "I did drop-off." (native, v1 edit) |
| 2.80–6.50 | **P1**: real UI src 2.40→7.30 continuous. 1× 2.40–4.40 (Game Plan "Pickup · needs someone", Who's doing what tap) · 2× 4.40–6.80 (Assignments tab dwell) · 1× 6.80–7.30 (Assign → editor) | N1a 2.85–5.93 "ACTIQO keeps pickup and drop-off with the activity," |
| 6.50–10.00 | **P2**: real UI src 7.30→13.86 continuous. 2.5× dwell · **1× Pickup tap** (8.90–9.60) · 3× picker dwell · **1× Alex tap** (11.70–12.40) · 3× dwell · **1× Save tap → Saving…** (13.45–13.86) | N1b 6.60–8.95 "so everyone sees who's handling what." ("what" lands on the Alex tap) |
| 10.00–12.45 | **R**: resolved Game Plan, src 18.85–21.30 (1×) · "Pickup · Alex · Saved — Alex is picking up" / "Drop-off · You, Pickup · Alex" | N2 9.70–12.36 "No guessing. Everyone knows the plan." (starts on the Save) |
| 12.45–15.00 | End card (v02 hierarchy) | N3 12.60–14.26 "Try it with your next practice." |

**Adjustment from the plan:** N2 needs about 2.6 s, so it starts on the Save at 9.70 and the resolved hold runs to 12.45 (plan: 12.20). The end card runs 12.45–15.00.
**Camera:** gentle punch-ins only (≤1.05×). The real UI is full-width, and anything larger crops labels (seen and fixed on D02).
**Captions:**
- **Dialogue:** unchanged.
- **Narration:** three phrase captions in a lower, left-anchored band inside every platform's clear area.
- **N3:** not captioned, because the end card shows the same words.
- **Product labels:** none captioned.

## Sound
**Voices:**
- Dialogue is the exact v1 treatment.
- Narration is matched to the dialogue: N1a −14.3, N1b −13.8, N2 −13.8, N3 −14.2 LUFS (dialogue −14.1).
- The narration starts 50 ms after the 2.80 cut, so the voice is the bridge into the product.

**Cues:**
- The room-tone tail and a quieter felt-pluck handoff sit at 2.80.
- Taps fall on the real taps: Assign 6.29, Alex 8.80, Save 9.80.
- The **locked v01 Saved cue** lands on the resolved cut at 10.00.

**Bed:** the approved audio v02 bed, delayed 0.277 s so its release lands on 10.00. It sits at 0.10 under the dialogue, **0.30 (about −10 dB) under all narration** and 0.75 between phrases, then fades 13.9 → 15.0.

**Master:** −14.5 LUFS integrated, **−1.49 dBTP**.

## Cost
| Item | Actual |
|---|---|
| 4 auditions × 159 chars, ElevenLabs v4 | **$0.0509** (fal usage API), against the $0.50 cap |
| Final narration (after pronunciation) | about $0.013 per take, estimated |
| Veo / keyframes | $0 |

## Quality assessment (by measurement and frame review; I can't listen)
- **Coherence:** much better than v1. The narrator starts on the product cut and explains what the screens show. The UI plays as two real, continuous actions instead of five held screenshots, and "who's handling what" lands as Alex is chosen.
- **Pacing:** speech fills about 11.6 of 15 s. It's brisk but not crowded. Speed-ups touch only static waiting screens; every tap and its response plays in real time.
- **Captions:** the narration captions sit over the Game Plan's less important "What to bring / Check-In" rows, never the pickup rows. It's slightly busy on the Game Plan screens. A smaller caption, or a caption-free variant for sound-on placements, is an easy follow-up.
- **Live action:** next to the cleaner product section, the 2.8 s opener holds up in the contact sheet; it's natural, well lit and consistent with the stills. **I don't see a case for Standard Veo yet.** Please judge on a phone, with sound.
- **Open:** the ACTIQO pronunciation, the voice choice, then one final narration take of about $0.013 and a re-mix (same timings, re-snapped to that take's timestamps).

---
# FINAL narrated-v2 review master (2026-11-21)
| File | What |
|---|---|
| `v2/edit/review/d01_narrated_v2_master.mp4` | **Final review master**: 1080×1920, 30 fps, 15.00 s, H.264 + AAC 320k |
| `v2/edit/review/d01_narrated_v2_master_musicfree.mp4` | the same, without the bed |
| `v2/edit/review/d01_narrated_v2_master_contact.png` | contact sheet |
| `v2/audio/final/d01_narration_sarah_final.wav` (+ `.json` with timestamps) | the one final Sarah take |

The draft files above are superseded but kept.

- **Narration:** **one** final take, Sarah, ElevenLabs Eleven v4 via fal, request `01a1fbfa-5c96-73d2-8d9b-aecc5cf798f2`, 163 chars, **$0.0130**. ACTIQO was forced with the provider's IPA control, **`/ˈæktɛkoʊ/` ("Act-eh-co")**, and the response timestamps confirm the IPA token was used. Speech recognition spells it "Actico" (as it did for the non-IPA auditions); text ASR can't distinguish /ɛ/ from /ɪ/ in an unstressed syllable, so **please confirm by ear**.
- **Re-snapped to the final take** (src → timeline):

| Phrase | Source (s) | Timeline (s) |
|---|---|---|
| N1a | 0.00–2.95 | 2.85 |
| N1b | 3.00–5.55 | 6.55 ("what" ≈ 8.7, Alex tap 8.80) |
| N2 | 5.62–8.27 | 9.70 (ends before the 12.45 end card) |
| N3 | 8.50–10.15 | 12.60 |

  The captions and the bed's ducking intervals follow the same points.
- **Caption polish (minor only):** 40 → 38 px, tighter padding, max-width 640 → 600, same position and style. They stay clear of the Pickup / Alex / Saved rows, sitting over the Check-In row on the Game Plan and empty space elsewhere.
- **Picture:** structure unchanged. No Alex, Jordan, Veo or UI regeneration.
- **Levels:** dialogue −14.1, narration −13.6 / −13.7 / −13.7 / −13.7 LUFS (per-phrase matched). Whole mix **−14.1 LUFS integrated, −1.49 dBTP**.
- **D01 TTS total:** $0.0509 (auditions) + $0.0130 (final) = **$0.0639** of the $0.50 cap.
