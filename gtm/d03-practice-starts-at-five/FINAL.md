# D03 "Practice Starts at Five": FINAL (closed 2026-11-21, NOT published)

**One primary version:** `d03_leave430`. **Publishing requires separate approval from the owner.** Nothing has been posted or scheduled.

## Deliverables (`final/`)
| File | What | SHA-256 |
|---|---|---|
| `ACTIQO_D03_PracticeStartsAtFive_9x16_d03_leave430.mp4` | **Full-sound master** | `c1836dcf8cdab61646d768b41d3482f72f54db11f77d843cf8b73670491987dc` |
| `ACTIQO_D03_PracticeStartsAtFive_9x16_d03_leave430_musicfree.mp4` | Music-free alternate (narration + UI cues, no bed) | `a6db7802f6b80d73ba3bcb4354ab306f5b7c5322e430a040cce1956db7f9fa74` |
| `…_contact.png` | Contact sheet | |
| `qa_phone_390pt_estimate_vs_fixed.png`, `qa_platform_720p_1200k_estimate_vs_fixed.png` | QA evidence: estimate vs fixed at phone size and under platform compression | |

**Format:** 1080×1920 (9:16), 30 fps, H.264 + AAC-LC 320 kb/s 48 kHz, **11.05 s** of programme (the container reads 11.07 s; the last frame is the end card).
**Approved as is:** the masters are byte-identical to the approved first complete cut v01 (`edit/review/…_v01*.mp4`, commit `7a046fc`). Nothing in the picture, timing or narration changed at finalization.

## Story, and how it maps to the real product
1. **Practice starts at 5:00.** The opener and hook ("Practice starts at five. We can't leave at five.").
2. **ACTIQO shows an estimated departure from the saved drive time.** Real Game Plan: **"Leave by about 4:30 PM · Based on 20 min travel time"**.
3. **The parent saves a fixed 4:30 departure.** Real Manual sheet: **"Preview: Leave by 4:30 PM"** · **"Starting point: your saved 20 min drive + 10 min buffer."** → **Save leave time**.
4. **Game Plan confirms the fixed leave time.** **"Leave by 4:30 PM · Fixed leave time"**.

**Precision note on the buffer:** the 10-minute buffer is ACTIQO's fixed default, already included in both the estimate and the sheet's starting point (20 + 10 = 30 min, so 4:30). The parent reviews it and saves it as a fixed time, with no adjustment taps. The cut shows exactly that. Nothing in it says the parent typed in the buffer. Narration: "Twenty minutes to drive, ten to get inside. We're leaving at four-thirty."

## Claims
- **Never shown, said or implied:** live traffic, traffic-aware or automatic departure, dynamic recalculation, reminder delivery.
  - The sheet's own line, "This is a fixed leave time. It won't adjust for traffic, location changes, or current conditions.", is on screen during the body.
  - The real post-save toast ("Leave-time reminders are off.") is cut around: from "Saving…" (src ≤ 8.70) to the settled state (src ≥ 12.75; the toast is fully gone at 12.70).
  - The "Automatic" option is visible as real UI. It's never selected, pushed toward or narrated.
- **End card:** ACTIQO · **Try it with your next practice.** · **Free.** · getactiqo.com.
- **⚠️ Pricing validity: "Free."** reflects ACTIQO's **current public pricing state** at closeout (2026-11-21; product `main` runs open access for every signed-in user). **It must be revisited, and the end card re-cut, if pricing changes.** Not "Early Access", "complimentary", "temporary" or any future-pricing wording. The owner approved it without blocking on legal review.
- **No integration claims:** no GameChanger, TeamSnap or PlayMetrics.

## Structure
| t (s) | Shot | Source |
|---|---|---|
| 0.00–1.95 | Opener still + hook text | **locked** AI still v02 (logo removed from v01) |
| 1.95–2.85 | Dissolve (0.17 s) into Veo Fast v01, **src 0.00–0.90 only** (hard cutoff before the person enters; a hand edge appears in the last 2 frames, no head or face) | Veo Fast v01 |
| 2.85–4.10 | Game Plan: **Leave by about 4:30 PM · Based on 20 min travel time** → real tap **Change** | real capture src 2.62–3.87 |
| 4.10–7.40 | Sheet: **Manual · Preview: Leave by 4:30 PM · saved 20 min drive + 10 min buffer** → real tap **Save leave time** → "Saving…" | real capture src 3.87–4.75 + 6.28–8.70 (identical static frames trimmed) |
| 7.40–8.90 | **Leave by 4:30 PM · Fixed leave time** (payoff: Saved chime + bed release; push ≤1.05×) | real capture src 12.75–14.25 |
| 8.90–11.05 | End card | brand (official raster wordmark, flat teal Q) |

## Final QA (2026-11-21)
**Estimate vs saved fixed time, phone size: PASS.**
- **At 390 pt wide** (true phone size): the before row reads "Leave by **about** 4:30 PM / **Based on 20 min travel time**" and the after row reads "Leave by 4:30 PM / **Fixed leave time**". Both are legible.
- **Under platform compression** (720p @ 1.2 Mb/s, 360 pt wide): still legible.
- **The two cues** are the word "about" plus the basis line, against the "Fixed leave time" subline.
- **Placement:** the row sits at y ≈ 445–580 (1080 scale), inside the TikTok/Reels/Shorts safe zones. Its text starts at x ≈ 170.
- **Caveat:** the estimate row is unobstructed for about 1.4 s while Sarah finishes the hook. Viewers who don't pause will read "about" mostly peripherally. The distinction lands mainly on the saved state ("Fixed leave time", 1.5 s hold with push-in) and the narration ("We're leaving at four-thirty").

**Picture:**
- **Opener:** every frame from 1.80 to 2.90 s checked; no head or face. Seam: the still and the Veo frame 0 are geometrically identical; the dissolve hides Veo's softer texture.
- **App footage:** no redrawn UI, overlays or speed changes. HyperFrames 0.9.72 `check`: 0 errors. The two notes are structural (an `<img>` inside a timed block), the same as D02.

**Sound:**

| | Full mix | Music-free |
|---|---|---|
| Integrated loudness | −14.0 LUFS | −13.9 LUFS |
| Peak | −1.50 dBFS | −1.49 dBFS |
| Loudness range | 1.9 LU | 2.0 LU |
| Clipping | none | none |

- **Narration:** hook −13.9, body −13.5, CTA −13.6 LUFS.
- **Phone-speaker band** (HP 180 Hz / LP 8 kHz): narration loses only 0.8–1.2 dB, so speech carries on phone speakers.
- **Gaps:** the bed sits about 16 dB under the narration (−29 dB RMS).
- **Sync:** tap sounds land on the real taps (Change 3.96 vs frame 3.958; Save 6.96 vs 6.95). The Saved cue lands on the cut to the saved row.
- **Head/tail:** clean head, faded tail.

## Real ACTIQO UI provenance
`actiqo/actiqo@main` **`dca1b87`**, captured from a temporary protected Vercel Preview with **QA Supabase only**, then deleted. Isolated D03 QA fixture ("Sam"/Leo/Soccer Practice 17:00, saved drive 20 min, no events, every notification and the leave-time reminder off). One real write (`PUT …/leave-default` 200). No notifications, emails, SMS or deliveries. Fixture reset afterwards. Full record: `ui/CAPTURE_RECORD.md`.

## Generation provenance and cost (cap $0.75; ledger `gtm/generations-ledger.jsonl`)
| Asset | Endpoint | Request | Cost |
|---|---|---|---|
| Opener still v01 (superseded: brand logo on cleat) | `fal-ai/nano-banana-pro` | `01a1ff20-c109-7223-aff1-6d30d7823d8c` | $0.15 |
| **Opener still v02 (locked)**: logo removed only | `fal-ai/nano-banana-pro/edit` | `01a1ff24-a40a-77d1-bbcc-2c98e633a6c4` | $0.15 |
| Veo Fast v01 (src 0.00–0.90 used; later footage contains a person and is not used) | `fal-ai/veo3.1/fast/image-to-video` (4 s, silent) | `01a1ff29-bbea-77b1-9369-b2489dd99acb` | $0.40 |
| Hook VO "Practice starts at five. We can't leave at five." | `elevenlabs/tts/eleven-v4` (Sarah) | `01a1ff38-7730-77e2-86db-0d13e99e2f51` | $0.0038 |
| Body VO "Twenty minutes to drive, ten to get inside. We're leaving at four-thirty." | same | `01a1ff38-8c18-7c62-8c36-2ea40f0cec11` | $0.0058 |
| CTA VO "Try it with your next practice." | reused approved D01 final Sarah take (src 8.50–10.15) | | $0 |
| **D03 total** | | | **≈ $0.710** |

## Audio provenance
- **Narration:** Sarah (series narrator). Not time-stretched or edited.
- **Sound design:** the **original, synthesized** D01 language (`../d01-pickup/edit/sound/synth.mjs` bed + felt taps) and the locked D01 Saved cue, mixed by `edit/sound/mix_d03.mjs` (the D02 graph; master gain 11.9 dB; −1.5 dBFS limiter).
- **No third-party, licensed or stock audio.**

## Attribution
- **Destination:** `https://getactiqo.com/`.
- **Parameters:** `utm_medium=paid_social`, `utm_campaign=d03_practice_starts_at_five`, `utm_content=d03_leave430`, set in the ad platform link.
- **On screen:** only "getactiqo.com".

**Source of truth:** `scene.mjs` → `edit/build.mjs` (picture) + `edit/sound/mix_d03.mjs` (sound).
