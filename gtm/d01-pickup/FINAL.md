# D01 "Pickup was handled.": FINAL (closed 2026-11-21)

## Deliverables (`final/`)
| Master | File | SHA-256 |
|---|---|---|
| **Final master (canonical)** | `final/ACTIQO_D01_PickupWasHandled_9x16_FINAL.mp4` | `ce52ce674ce1ed01befe6c174b0eecefc01a493bf09d72873c8face3c96188fe` |
| Music-free alternate | `final/ACTIQO_D01_PickupWasHandled_9x16_FINAL_musicfree.mp4` | `ab930cf35468b2b5c20d6d506efce145b59e86354181207a301a1dc2aa3e9c08` |
| Clean picture (no audio) | `final/ACTIQO_D01_PickupWasHandled_9x16_FINAL_clean.mp4` | `9b992556065b6728115f322fe9385ee35e88936e5d00271d41993e2a59d487be` |

These are byte-identical copies, with no re-encode, of `edit/review/d01_final_candidate_v02.mp4`, `…_v02_musicfree.mp4` and `…_v01_clean.mp4` respectively.

**Format:** 1080×1920 (9:16), 30 fps, **15.00 s**, H.264 picture. The two audio masters carry AAC-LC 320 kb/s, 48 kHz stereo, with `+faststart`.

⚠️ `edit/review/d01_final_candidate_v02_PHONECHECK_reference.mp4` is a **review-only** small-speaker simulation. **Never distribute it.**

## Audio
| Master | Integrated | True peak (4× oversampled) | Dialogue (0.10–2.70 s) |
|---|---|---|---|
| Final | **−17.7 LUFS** | **−1.49 dBTP** | −14.1 LUFS, the loudest content |
| Music-free | −16.2 LUFS (gated) | −1.49 dBTP | −14.1 LUFS |

Integrated loudness is deliberately below −14 because only 2.7 s of the 15 s is speech; the bed and sound effects sit under the dialogue. Details and phone-speaker checks are in `edit/AUDIO_NOTES.md`.

## Lineage (actiqo/actiqo-motion `main`)
| Step | Commit |
|---|---|
| Real ACTIQO UI capture | `958da47` |
| Alex keyframe v01 / Jordan keyframe v01 | `ee9d72a` / `cfed53a` |
| Alex Veo Fast v01 / Jordan Veo Fast v01 (both locked) | `945d7cf` / `0b0cca5` |
| Rough cut v01 (structure approved) | `998fcc8` |
| **Picture lock v02**: captions, CTA end card, timing | **`2d1e81d`** (video MD5 `aa2c258c7420181eec9e72ded6b53a4a`, carried unchanged into every master) |
| Audio final candidate v01 | `a624d04` |
| **Audio final candidate v02 (approved final)** | **`4a52fd7`** |

Edit: HyperFrames 0.9.72 (`edit/index.html`, timing in `edit/TIMELINE.md`). Audio: `edit/sound/synth.mjs` + `edit/sound/mix.sh`.

## AI generation (fal.ai): 4 billed requests, **$1.50 total**
The total is confirmed by fal's usage API.

| Asset | Endpoint | Request ID | Cost |
|---|---|---|---|
| Alex keyframe | `fal-ai/nano-banana-pro` (9:16, 2K, PNG) | `01a1fa6e-1bef-7860-a73c-9cdb24cbc931` | $0.15 |
| Jordan keyframe | `fal-ai/nano-banana-pro/edit` (Alex v01 as reference) | `01a1faa5-47a2-7623-989f-5826b6186e66` | $0.15 |
| Alex motion (S1) | `fal-ai/veo3.1/fast/image-to-video` (9:16, 1080p, 4 s, native audio) | `01a1faa8-e91c-73e2-a345-61a7b1cfe170` | $0.60 |
| Jordan motion (S2) | `fal-ai/veo3.1/fast/image-to-video` (9:16, 1080p, 4 s, native audio) | `01a1fb66-d7e5-7a52-bdbf-77e4ee1a88c9` | $0.60 |

fal refused the other submits at submit (account unfunded or locked): no job was created and they cost $0. `gtm/generations-ledger.jsonl` records three of them (2026-11-20 19:18Z and 19:20Z for s1, 19:43Z for s2). Not used: Veo Standard, 4K, and the second paid video allowance for either shot.

The AI generated only the two people, their props, the room and their spoken lines. The lines use Veo native audio, trimmed so the unscripted speech after them is cut.

## Real ACTIQO UI (S3–S7)
- **Source:** a screen recording of the shipping product, **not redrawn, recreated or composited**.
- **Build:** `actiqo/actiqo@main` `66ccdf64a03b50d3a0ae06129cb70912ca902331`, deployed as a temporary protected Vercel Preview (`dpl_2HyEZoSL965KDKcXk3rAKBdYGdkV`) against **QA Supabase only**. The preview was deleted after capture.
- **Recording:** signed in as the QA demo user Jordan. The real flow is Game Plan → Assignments → "Who brings them home?" → Alex → Save assignments. The save was real (`200 {"ok":true,"scope":"permanent"}`), and the QA fixture was reset afterwards.
- **Records:** `ui/CAPTURE_RECORD.md`.

## Audio provenance
- **Dialogue:** the native Veo dialogue from the two locked clips, timing unchanged. Alex is lifted +3 dB, with a 70 Hz high-pass and no denoise or pitch/time changes.
- **Room tone:** taken from Jordan's own clip, during a pause with no speech.
- **UI sounds and bed:** **original, synthesized from scratch** in `edit/sound/synth.mjs` from oscillators and filtered noise (D major, 104 BPM). No samples, libraries or downloads. The Saved cue is locked as `edit/sound/locked/sfx_saved_v01.wav`.
- **No third-party music.** No licensed or stock track was used.

## Brand and claims
- **Brand assets:** the raster ACTIQO wordmark (flat teal Q), Inter, and ACTIQO ink colours from `brand/`.
- **End card:** "Try it with your next practice." / "Complimentary Family access during Early Access" / getactiqo.com.
- **Claims:** no "Free" claim, no other pricing claim, and no third-party integration claims.
