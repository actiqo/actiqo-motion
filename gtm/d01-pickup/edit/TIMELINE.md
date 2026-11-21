# D01 "Pickup was handled." Rough cut v01 timeline

Render: `review/d01_rough_v01.mp4`, 1080×1920, 30 fps, H.264 CRF 16 + AAC 48 kHz stereo, **15.00 s**.
Source: `index.html` (HyperFrames **0.9.72**; 0.8.98 rendered the right 8 px black in this environment, see below).
Rebuild: `./link-assets.sh` (hard-links the locked sources into the git-ignored `assets/`), then `npx --yes hyperframes@0.9.72 render -f 30 --video-frame-format png`.

**Not in this cut, by design:** music, SFX, captions, VO (still deferred), grade, and the product-section VO lines from `scene.mjs`.
**Nothing new was generated.** Every frame comes from the locked Veo clips, the real ACTIQO capture, or the brand assets.

## Dialogue (Parakeet TDT 0.6B v3 word timestamps, checked against the speech-band energy envelope)
| Clip | Words in the scripted line | Source in → out | Correct? | Unscripted speech after the line (discarded) |
|---|---|---|---|---|
| Alex `d01_s1_alex_fast_v01.mp4` | "I thought you had pickup" | **0.16 → 1.20 s** (energy onset 0.24, dip at 1.20) | ✅ all 5 words, in order | 1.20–1.84 s (ASR: "not look at it", low-level) and 2.08–4.0 s (ASR: "Yeah, no, you still have a little bit of me, so") |
| Jordan `d01_s2_jordan_fast_v01.mp4` | "I did drop off" | **0.40 → 1.60 s** (energy onset 0.40) | ✅ all 4 words, in order | 1.76–2.08 s "um", then 2.32–3.52 s (ASR: "a chin F."), plus energy after 3.84 s |

## Picture
| Shot | Timeline in → out (dur) | Source | Source in → out | What's on screen |
|---|---|---|---|---|
| S1 | 0.00 → 1.30 (1.30) | Alex Fast v01 (locked) | 0.00 → 1.30 | "I thought you had pickup." |
| S2 | 1.30 → 2.80 (1.50) | Jordan Fast v01 (locked) | 0.25 → 1.75 | "I did drop-off." (ends before "um" at 1.76) |
| S3 | 2.80 → 4.60 (1.80) | real UI capture | 2.20 → 4.00 | Game Plan: **Pickup · needs someone** / Who's doing what: **Drop-off · You**; push 1.00 → 1.05 |
| S4 | 4.60 → 6.80 (2.20) | real UI capture | 5.50 → 7.70 | Assignments tab → **Assign** → Assignments editor (Pickup · Not assigned) |
| S5 | 6.80 → 8.90 (2.10) | real UI capture | 10.20 → 12.30 | Picker **"Who brings them home?"** → **Alex** → editor shows Pickup · Alex |
| S6 | 8.90 → 10.80 (1.90) | real UI capture | 12.40 → 14.30 | **Save assignments** → **Saving…** (cut before the Assignments tab refresh) |
| S7 | 10.80 → 12.80 (2.00) | real UI capture | 20.00 → 22.00 | Game Plan: **Pickup · Alex · Saved — Alex is picking up** / **Drop-off · You, Pickup · Alex**; push 1.00 → 1.03 |
| S8 | 12.80 → 15.00 (2.20) | brand | n/a | Raster wordmark (flat teal Q) in at 12.80; **"Complimentary Family access during Early Access"** in at 12.90 (2.1 s on screen), inside the TikTok/Reels clear band |

All cuts are hard cuts. Jumps inside the UI recording (S3→S4, S4→S5, S5→S6, S6→S7) skip real-time travel between real recorded states. No UI frame is altered, redrawn or composited.

## Audio
| Track | Timeline in → out | Source | Source in → out | Envelope |
|---|---|---|---|---|
| a1 Alex native | 0.00 → 1.26 | Alex Fast v01 | 0.00 → 1.26 | unity, fade 1.20 → 1.26 (cuts on the post-"pickup" dip, before the unscripted 1.28 s onset) |
| a2 Jordan native | 1.30 → 2.73 | Jordan Fast v01 | 0.25 → 1.68 | unity, fade 2.67 → 2.73 (after "off", before "um" at 1.76 src) |
| – | 2.73 → 15.00 | – | – | silence (no music, SFX or VO yet) |

Speech on the timeline: Alex 0.16–1.20, a 0.25 s gap, then Jordan 1.45–2.65.

## Changes from `scene.mjs` v1 slots
- Live action is 2.80 s instead of 2.00 s: Alex 1.30 s (was 1.13), Jordan 1.50 s (was 0.87). Alex isn't stretched to the suggested 1.5–1.7 s, because she starts more unscripted speech at 1.28 s. Holding longer would show her mouthing words with the audio cut.
- Product shots are 0.8 s shorter in total and keep the same story beats. S7 holds 2.0 s so the end-card line gets ≥2 s.
- `scene.mjs` is still the v1 plan. This file and `index.html` are what the rough cut actually uses.

## Notes for review
- The UI recording's top rows ("Game Plan" title, Leo · time) sit inside the top ~220 px platform-chrome band. We could scale or reframe in polish.
- 2.73–12.80 s is silent until the VO, music and SFX pass.
- Renderer: HyperFrames 0.8.98 (Film 01's pin) captured the right 8 px of every frame as black in this environment, which a minimal one-colour test reproduced. 0.9.72 renders the full width. Film 01 is untouched and keeps its own pin.
