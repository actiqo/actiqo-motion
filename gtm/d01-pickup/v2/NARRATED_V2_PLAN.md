# D01 Narrated v2: checkpoint plan (2026-11-21, nothing generated, nothing spent)

**v1 is preserved untouched:** `final/` masters, `edit/review/*`, locked clips, and picture-lock commit `2d1e81d`. v2 will be built as a separate composition (`v2/edit/`) from the same locked sources. No v1 file is modified.

## 1. Narration script: 26 words, 157 characters
| # | Line | Words | Over |
|---|---|---|---|
| N1a | "ACTIQO keeps pickup and drop-off with the activity," | 8 | Game Plan → pickup needs someone → Assignments |
| N1b | "so everyone sees who's handling what." | 6 | Assign Alex → Save |
| N2 | "No guessing. Everyone knows the plan." | 6 | resolved real state |
| N3 | "Try it with your next practice." | 6 | end card |

The Alex and Jordan dialogue is unchanged and is not narrated. The Early Access line is **not** spoken.
⚠️ **The pronunciation of "ACTIQO" is needed.** Nothing in the repo documents it. ElevenLabs accepts an IPA override, so it can be locked once known.

## 2. Proposed timeline (15.00 s)
Speech estimates assume about 2.9 words/s, a brisk social pace. Final timings snap to the voice's own timestamps.

| t (s) | Picture | Source | Narration / audio |
|---|---|---|---|
| 0.00–1.30 | S1 Alex (unchanged) | Alex Fast v01 0.00–1.30 | "I thought you had pickup." (native) |
| 1.30–2.80 | S2 Jordan (unchanged) | Jordan Fast v01 0.25–1.75 | "I did drop-off." (native) |
| **2.80–6.50** | **P1, one continuous UI pass** | UI src **2.40 → 7.30** | **N1a** starts on the cut (~2.85) and runs to ~5.6 |
| **6.50–10.00** | **P2, one continuous UI pass** | UI src **7.30 → 14.40** | **N1b** ~6.55–8.6, landing "who's handling what" on the Alex tap |
| 10.00–12.20 | R, resolved Game Plan | UI src **18.85 → 21.05** (1×) | **N2** ~10.05–12.0, with the Saved cue on the cut |
| 12.20–15.00 | End card (v02 hierarchy) | brand | **N3** ~12.35–14.2, in sync with the CTA text |

## 3. Voice/TTS: options found in this environment
| Option | Quality for this brief | Cost for the script |
|---|---|---|
| **ElevenLabs Eleven v4 via fal** (`elevenlabs/tts/eleven-v4`, on the funded fal key) | **Recommended.** Natural conversational American voices. It supports `timestamps` (character timing, which drives captions) and IPA pronunciation. | **$0.08 / 1,000 chars → about $0.013 per full read** |
| ElevenLabs v4 Turbo / Turbo v2.5 (fal) | Good, slightly less nuanced | $0.04–0.05 / 1k chars |
| MiniMax Speech 2.8 HD, Gemini 3.x Flash TTS, Inworld, Chatterbox (fal) | Usable alternates | $0.01–0.10 / 1k chars |
| HyperFrames `tts`, local Kokoro-82M (12 preset voices) | Free, but audibly synthetic. **Not used**, per the brief | $0 |

No other TTS keys exist (only `FAL_KEY` / `FAL_BILLING_KEY`).
**Plan:**
1. **Audition:** read the full script in **4 ElevenLabs v4 voices**. Candidates are two warm American female and two warm American male stock voices. Exact names are confirmed against the endpoint at run time, and none is reused from Alex or Jordan (theirs are Veo-native).
2. **Pick:** you choose one.
3. **Polish:** up to **6** more takes on that voice for cadence and pronunciation.
4. **Settings:** `output_format: pcm_48000`, `timestamps: true`, stability about 0.45–0.55.

## 4. Real UI: what becomes continuous footage
**v1:** five separate holds (S3–S7) cut from different points.
**v2:** **two continuous passes plus one resolved hold**. Each pass is a contiguous source range, built from back-to-back clips with constant playback rates. Real-time taps play at 1×; dwell between taps is time-compressed. There are no jump cuts inside a pass, and nothing is re-ordered or fabricated.

| Pass | Source range | Real events inside it | Timing treatment |
|---|---|---|---|
| **P1** | **2.40 → 7.30** (4.9 s → 3.7 s) | Game Plan "Pickup · needs someone" → tap Who's doing what (≈4.13) → Assignments tab appears (4.27, "Pickup · needs someone · Assign") → tap Assign → editor appears (7.13, "Pickup · Not assigned") | 1× 2.40–4.40 · ~2× 4.40–6.80 (tab dwell) · 1× 6.80–7.30 |
| **P2** | **7.30 → 14.40** (7.1 s → 3.5 s) | editor → tap Pickup (≈9.2) → "Who brings them home?" → tap **Alex** (≈12.0) → editor "Pickup · Alex" → tap **Save assignments** → **Saving…** (13.70) | ~2.5× on dwells (7.30–9.10, 9.40–11.70, 12.30–13.40) · 1× on each tap and its response (≈9.10–9.40, 11.70–12.30, 13.40–14.40) |
| **R** | **18.85 → 21.05** (1×) | resolved Game Plan: "**Pickup · Alex · Saved** — Alex is picking up", "Who's doing what · **Drop-off · You, Pickup · Alex**" | one cut from Saving… to here, skipping the app's slow-refreshing Assignments tab |

**Cuts removed vs v1:** the S3/S4/S5/S6 internal jumps and the static-feeling holds. **States skipped:** none inside the passes. The only skip is 14.40 → 18.85 (the stale tab and the navigation back).

**Camera:** one consistent crop language, slow eased punch-ins of at most 1.10×:
- **P1:** toward the Pickup row.
- **P2:** toward the Pickup row and the Alex choice. It eases back out before the Save button (bottom of frame) so nothing gets cropped.
- **R:** toward "Pickup · Alex · Saved".
No transitions inside the product, no overlays, and no tap indicators unless you ask for them.

**At the 2.80 cut:** no whoosh. N1a starts within about 50 ms of the cut, with a very soft room-tail and felt-pluck handoff (the existing v02 cue, quieter). The narrator is the bridge.

**Captions:**
- **Alex and Jordan:** unchanged.
- **Narration:** phrase-by-phrase (N1a, N1b, N2, N3), timed from the TTS timestamps, in the same Inter-on-ink style but smaller.
- **Placement:** a lower band inside the platform safe zones, nudged per shot so it never covers the Pickup / Alex / Saved rows. No product labels are captioned.

**Sound:** reuse the approved audio v02 bed, taps and locked Saved cue, re-timed to the new cut:
- Taps follow the real taps at ≈ the P1 Assign, P2 Pickup, Alex and Save points.
- The Saved cue lands at 10.00.
- The bed is ducked about 10 dB under all narration.
- Narration sits at about the dialogue level (−14 LUFS short-term).
- Same −1.5 dBTP ceiling.

## 5. Paid cost
| Item | Estimate |
|---|---|
| Audition: 4 voices × 157 chars | ≈ $0.05 |
| Up to 6 polish takes | ≈ $0.08 |
| **Total TTS** | **≈ $0.13**, proposed hard cap **$0.50** |
| Veo / keyframes | **$0**. Alex and Jordan are not regenerated. If the finished edit still makes the live action look clearly inferior, I'll report that before any Standard Veo spend. |

## Decisions needed
1. How is **ACTIQO** pronounced?
2. Approve **ElevenLabs v4 via fal** and the ≤$0.50 TTS cap.
3. Any preference on narrator gender? Otherwise, audition both.
