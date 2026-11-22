# D04 "Tasting Notes of Parenthood": Cork Connoisseur × ACTIQO · FINAL (closed 2026-11-22, NOT published)

**Use:** **organic Cork Connoisseur posting first** (the user's decision). The wine-tasting setup is intentional. It isn't optimised for paid ads; a paid ACTIQO version would be a separate, alcohol-free cut. **Publishing requires separate approval from the owner.**

## Deliverables (`final/`)
| File | What | SHA-256 |
|---|---|---|
| `ACTIQO_CorkConnoisseur_D04_TastingNotesOfParenthood_9x16.mp4` | **Full-sound final master** (Cork title + subtitles, real ACTIQO, end card) | `0098be2d739846daeb2756f1ee0cba59a86c212e026ffb6a02bff0965da1b5af` |
| `…_9x16_musicfree.mp4` | Music-free master (voice, notification blips, room tone, end chime; no bed) | `53014151c15b31c7e5511a785d4c4f342f35340a3512fa0f63e6e3c0037b5c58` |
| `…_9x16_clean_picture.mp4` | Clean picture master: **no title or subtitles** (the real ACTIQO window and the end card stay), full-sound audio | `f762ff03e27cf4784d28cf6d96a60bb08650398c2659515fcef7ff5fba4db693` |
| `…_contact.png`, `…_clean_picture_contact.png` | Contact sheets | |

**Format:** 1080×1920 (9:16), 30 fps, H.264 High (CRF 17), AAC-LC 320 kb/s 48 kHz.
**Runtime:** **19.40 s**. The planned ≈22 s fitted in less because the real voice is tighter.

**Loudness:**

| Master | Integrated | True peak |
|---|---|---|
| Full | −14.3 LUFS | −1.8 dBTP |
| Music-free | −14.2 LUFS | −1.9 dBTP |
| Clean picture | −14.3 LUFS | −1.8 dBTP |

**Captions:** every caption sits inside the TikTok/Reels/Shorts safe areas (HyperFrames check passes).

## Structure
| t (s) | Picture | Voice (Alec's REAL recording) |
|---|---|---|
| 0.00–6.00 | **Locked opener** (Veo Fast v01, full 6 s). Title "TASTING NOTES OF PARENTHOOD" 0–2.6 (Cork burgundy `#8B3E3D` / tan `#E9D6B4`). | Take 1, **voice-over**: "Notes of blackberry. Hints of oak." (over the sniff) · natural 0.76 s pause · "Twelve texts about tomorrow's soccer practice." (phone glow → glance → deadpan) |
| 6.00–12.00 | **Locked founder clip, lip-synced** (real speed, 6 s) | Take 2: "I'm Alec, the dad behind Cork Connoisseur." |
| 8.65–12.00 | + **real ACTIQO Layout B**: one real Game Plan window (660 px, lower safe area) panned in spoken order: **Pickup · You · Saved → What to bring · Water bottle, Cleats, Shin guards · 0/3 → Leave by 4:30 PM · Fixed leave time** | Take 2: "I also built ACTIQO to keep pickup, packing and leave times together." |
| 12.00–16.90 | **Locked closing** (Veo Fast v01, src 0.0–4.9, clean cut) | Take 2: "Try it with your next practice." (to camera, natural mouth movement) · "Then we can get back to the tasting notes." (**voice-over** while his eyes return to the wine) |
| 16.90–19.40 | **ACTIQO end card:** ACTIQO · Try it with your next practice. · **Free.** · getactiqo.com | soft chime |

## Voice: real recording only (no clone, no TTS)
Source: two phone voice memos uploaded by Alec (repo root): Take 1 = `gtm/d04-tasting-notes/audio/source/d04_alec_voice_take1.m4a`, Take 2 = `gtm/d04-tasting-notes/audio/source/d04_alec_voice_take2.m4a`.

| Line | Take | Source trim (s) |
|---|---|---|
| Opening | 1 | 4.56–9.56 |
| Founder | 2 | 8.55–11.00 |
| Product | 2 | 11.18–14.54 |
| Closing | 2 | 14.97–18.34 (stray "yeah" at 14.62–14.85 excluded) |

- **Treatment:** slate removed by the trims, 80 Hz high-pass, per-line level match (+2.5 / +0.2 / +1.0 / +0.2 dB), 15/40 ms edge fades.
- **Not applied:** no pitch, time-stretch, noise reduction or announcer processing.
- **Peaks on "Twelve", "Try", "Notes", "pickup":** analysed (flat factor 0, peak count 2). They're single-sample AAC overs, not flat-topped clipping, so they're **left untouched**; the master limiter covers them.
- **Detail:** `audio/VOICE_SELECTION.md`.

## Founder lip-sync
- **Model:** `fal-ai/sync-lipsync/v2/pro` (Sync Labs lipsync-2-pro), `sync_mode: cut_off`, **one pass**. Request `01a20087-1cdd-7cc0-856e-00d7a9ae51ca`.
- **Cost:** **$0.50, confirmed via fal's usage API.**
- **Input video:** the locked clean founder clip (no overlay).
- **Input audio:** the exact approved founder audio (6.00–12.00 s of the v02 mix).
- **Result:** only the mouth area changed; same 144 frames and 6.00 s. Accepted: mild beard smoothing at the lips, and a ≈0.15 s open-mouth transition between the lines.
- **Not lip-synced:** the opener and closing (by decision).

## Real ACTIQO capture provenance (no generated ACTIQO UI)
- **Source:** `actiqo/actiqo@main` `c81c64e` (code identical to `dca1b87`), captured from a temporary protected Vercel **Preview** with **QA Supabase only**. Deleted after capture.
- **Fixture:** an isolated D04 QA household (user `aa3f48dd-…`, `d04de000-…` IDs).
  - **What to bring:** added through the real Prep list editor.
  - **Leave time:** saved through the real Leave time sheet (Manual).
  - **Pickup:** saved for Sam.
- **Clean run:** every notification off. 0 notifications, emails, SMS or deliveries. 0 secret or production hits.
- **Record:** `ui/CAPTURE_RECORD.md`.
- **The ACTIQO UI in the film is the real recording**, shown in one window and panned as a whole. No UI was generated, redrawn or animated element by element.

## Generation provenance and cost (fal.ai; ledger `gtm/generations-ledger.jsonl`)
| Asset | Endpoint | Request | Cost |
|---|---|---|---|
| Opening keyframe v01 (locked) | `fal-ai/nano-banana-pro/edit` (ref `corkconnoisseur.png`) | `01a1ff86-975e-7231-a921-300ce5e461b0` | $0.15 |
| Opening motion v01 (locked) | `fal-ai/veo3.1/fast/image-to-video` (6 s silent) | `01a1ff8a-2eeb-7692-9ac4-76dd3b2973d3` | $0.60 |
| Founder keyframe v01 (locked) | `nano-banana-pro/edit` | `01a1ff92-b911-7861-8172-f6a72a1437e3` | $0.15 |
| Founder motion v01 (locked) | `veo3.1/fast/image-to-video` (6 s silent) | `01a1ff9d-b00f-70d1-bbe9-1d5b8cc5fd07` | $0.60 |
| Closing keyframe v01 (not used: repeated the founder pose) | `nano-banana-pro/edit` | `01a1ffe7-2d97-75e0-a847-b27f915260ea` | $0.15 |
| Closing keyframe v02 (locked, approved retry) | `nano-banana-pro/edit` | `01a20006-8e6b-7c50-a659-a70b1af92b8d` | $0.15 |
| Closing motion v01 (locked) | `veo3.1/fast/image-to-video` (6 s silent) | `01a2000b-dce7-7d42-b88f-571dc1d87470` | $0.60 |
| Founder lip-sync | `fal-ai/sync-lipsync/v2/pro` | `01a20087-1cdd-7cc0-856e-00d7a9ae51ca` | $0.50 (usage-confirmed) |
| Voice | Alec's own recording | — | $0 |
| QA product capture | temporary Vercel Preview + QA Supabase | — | $0 |
| **D04 total** | | | **$2.90** |

## Audio provenance
- **Voice:** Alec (real).
- **Notification blips:** two quiet, **originally synthesized** sine blips (2.00 / 2.62 s).
- **Room tone:** faint filtered pink noise.
- **End card:** the locked D01 "Saved" cue as a soft confirmation.
- **Bed (full master only):** the **original synthesized D01 bed** (`gtm/d01-pickup/edit/sound/synth.mjs`). It enters with the founder line, sits ≈18 dB under the voice while he speaks and ≈10 dB under in the gaps, and resolves on the end card.
- **No licensed, stock or third-party music.**
- **Mixer:** `edit/rough/sound/mix_final.mjs` (two-stage mix, 4×-oversampled −2.0 dBFS limiter, loudness iterated to −14 LUFS).

## Claims and pricing
- **⚠️ Pricing validity: "Free."** reflects ACTIQO's **current public pricing state** at closeout (2026-11-22; product `main` gives open access to every signed-in user). **It must be revisited, and the end card re-cut, if pricing changes.** No "Early Access", "complimentary", "temporary" or future-pricing wording.
- **The product line** ("keep pickup, packing and leave times together") matches the real Game Plan shown: a saved pickup, a populated What to bring, a saved fixed leave time.
- **No integration claims** (GameChanger, TeamSnap, PlayMetrics).
- **Imagery:** Alec's likeness was generated with **his own consent** from his reference photo for his own channel. If a platform requires it, **label realistic AI-generated video** when posting.

## Source of truth
- **Picture:** `edit/rough/voiced.mjs` (timeline) → `edit/rough/build_v03.mjs` (picture; `D04_CLEAN=1` gives the textless master).
- **Sound:** `edit/rough/sound/mix_final.mjs`.
- **Locked assets:** `generations/review/s1|s2|s3`, `generations/review/lipsync/`, `ui/capture/`.
