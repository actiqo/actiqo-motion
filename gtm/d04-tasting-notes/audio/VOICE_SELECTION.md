# D04 · Voice memo review and line selection (2026-11-21). Nothing processed, cut or cloned yet.

**Source files (as uploaded, repo root):**

| Take | File | Length |
|---|---|---|
| **Take A** (slate "take one") | `gtm/d04-tasting-notes/audio/source/d04_alec_voice_take1.m4a` | 24.38 s |
| **Take B** (slate "take two") | `gtm/d04-tasting-notes/audio/source/d04_alec_voice_take2.m4a` | 19.78 s |

Both: AAC, 48 kHz stereo, ≈130 kb/s. Each begins with a spoken slate ("D-zero voice, take one/two", ≈1.6–3.7 s), which gets trimmed.

**Analysis (local only):**
- **Word timings:** Parakeet ASR via HyperFrames, run locally in scratch. No audio left the machine and nothing was billed.
- **Boundaries:** pauses from `silencedetect` (−40 dB, ≥0.12 s).
- **Levels:** `ebur128` / `astats`.
- **Timestamps:** seconds in the original files.

## Technical condition (both takes)
| Check | Take A | Take B |
|---|---|---|
| Background noise | very low (noise floor ≈ −71 dB) | very low (≈ −74 dB) |
| Room echo | dry: the tail drops ≈30 dB within ≈150 ms after the last word | dry: the same |
| Clipping | **brief full-scale peaks** (about 140 samples at 0 dBFS in total) on hard onsets: "Notes" 4.69, "Twelve" 7.26–7.30, "built" 12.75–12.80, "Try" 17.12–17.15. **L2 is the only line with none** (peak −2.1 dBFS). | the same pattern: "Blackberry" 4.33, "Twelve" 6.01–6.05, "I'm" 8.66, "also" 11.34, "pickup" 12.77, "with" 15.10 |
| Plosives | the clipped onsets above are plosive/attack transients (p, b, t). Phone distance plus the phone's level control. | the same |
| Loudness | ≈ −16 to −19 LUFS per line | ≈ −16 to −17 LUFS per line (≈1–1.5 dB hotter than A) |

Each clipped event is a single 10–20 ms transient. They're usually inaudible or only a faint click, so **please confirm by ear**. If one is audible, a light declip or de-plosive pass on that word fixes it (it's processing, so it needs your OK first).

## Delivery and timing per line
| Line | Take A (in–out) | Take B (in–out) | Notes |
|---|---|---|---|
| **1a** "Notes of blackberry. Hints of oak." | **4.55–6.47** (1.8 s) | 3.86–5.60 (1.6 s; starts only 0.16 s after the slate) | **A** has the requested deliberate **pause after "oak": 0.76 s**. B's pause is 0.38 s. |
| **1b** "Twelve texts about tomorrow's soccer practice." | 7.09–9.58 (2.4 s) | **5.85–8.09** (2.1 s) | In **A** the ASR heard "*All* text…", so the "Tw-" of "Twelve" may be soft or swallowed (and it clips at 7.26). **B**'s "Twelve" transcribes cleanly. |
| **2** "I'm Alec, the dad behind Cork Connoisseur." | **9.86–12.08** (2.1 s) | 8.53–11.01 (2.4 s) | **A** is crisp and the only line with no clipping. B is slightly slower. |
| **3** "I also built ACTIQO to keep pickup, packing and leave times together." | 12.29–16.49 (4.1 s, comma pause 0.26 s after "pickup") | **11.15–14.56** (3.3 s) | **B** is tighter. **A2 + B3 ≈ 5.9 s** fits the 6 s locked founder clip at real speed; A2 + A3 ≈ 6.5 s would overrun it. |
| **4** "Try it with your next practice. Then we can get back to the tasting notes." | **16.95–21.03** (3.95 s; a 0.29 s beat between the sentences) | 14.58–18.36 (3.7 s; a 0.18 s beat) | **A** is more relaxed and "knowing". It fits the closing window: "Try it…" lands in 0–1.8 s (eye contact), "Then we can…" in ≈2.1–4.0 s (eyes on the glass), inside the 4.9 s edit. |

**ASR spellings, very likely mishearings; please confirm by ear:**
- "Court" for **Cork** (both takes)
- "tasty notes" for **tasting notes** (both)
- "Actico/Acticode" for **ACTIQO** (the ACT-eh-co pronunciation is what's expected)
- "text" for **texts**

## Recommended composite (real voice only; cuts fall in natural pauses, no time-stretch)
| Slot | Source | In–out (s) | Length |
|---|---|---|---|
| Line 1a | **Take A** | 4.55–6.47 | 1.92 |
| (pause after "oak") | Take A's own 0.76 s pause, kept | 6.47–7.09 | — |
| Line 1b | **Take B** | 5.85–8.09 | 2.24 |
| Line 2 | **Take A** | 9.86–12.08 | 2.22 |
| Line 3 | **Take B** | 11.15–14.56 | 3.41 |
| Line 4 | **Take A** | 16.95–21.03 | 4.08 |

- **Matching:** joining A and B in Line 1 needs only a ≈1.4 dB level match (B is hotter), which is part of the later clean-up pass. Both takes share the same room and mic, so the join should be seamless at the pause.
- **Simpler alternative:** if Take A's "Twelve" sounds fine to you, use **Take A for all of Line 1** (4.55–9.58), avoiding the cross-take join.
- **Lines 2 + 3** (≈5.9 s with a short gap) sit on the founder clip. **Line 4** sits on the closing clip.

**Privacy (done 2026-11-22):** the memos were moved/renamed to `audio/source/d04_alec_voice_take1.m4a` / `…take2.m4a` (audio bytes unchanged), and the original upload paths were purged from the repository history.

---
## USER SELECTIONS (2026-11-21), used in voiced rough v02: real voice only, no clone
| Line | Take | User approx. | **Exact trim (waveform + local ASR)** | Why it differs |
|---|---|---|---|---|
| Opening | **1 (A)** | 4.60–9.30 | **4.56–9.56** (5.00 s) | "practice." ends at 9.50; a 9.30 out would cut the word. Keeps the natural 0.76 s pause after "oak". |
| Founder | **2 (B)** | 8.58–10.74 | **8.55–11.00** (2.45 s) | "Connoisseur." ends at 10.95 |
| Product | **2 (B)** | 11.22–14.48 | **11.18–14.54** (3.36 s) | cut inside the pauses either side |
| Closing | **2 (B)** | 15.02–18.22 | **14.97–18.34** (3.37 s) | "Try" starts at 15.08 (confirmed by re-transcribing from 15.0 s). A stray "yeah" at 14.62–14.85 is excluded. "notes." ends at 18.28. |

**Treatment:**
- **Applied:** slate removed by the trims, 80 Hz high-pass, per-line level match (+2.5 / +0.2 / +1.0 / +0.2 dB to ≈ −16 LUFS), 15 ms / 40 ms edge fades.
- **Not applied:**
  - **No noise reduction:** the noise floor is already ≈ −71 to −74 dB.
  - **No pitch change, time-stretch, EQ colouring, clone or TTS.**
- **Clipped transients:** left as recorded (the master limiter catches peaks). Confirm by ear; declip only on request.
