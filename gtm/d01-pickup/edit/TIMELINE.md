# D01 "Pickup was handled." Rough/picture-lock candidate v02 timeline

Current: **v02** `review/d01_rough_v02.mp4` (v01 `review/d01_rough_v01.mp4` kept for comparison; its points are under "v01 (superseded)").
Render: `review/d01_rough_v02.mp4`, 1080×1920, 30 fps, H.264 CRF 16 + AAC 48 kHz stereo, **15.00 s**.
Source: `index.html` (HyperFrames **0.9.72**; 0.8.98 rendered the right 8 px black in this environment, see below).
Rebuild: `./link-assets.sh` (hard-links the locked sources into the git-ignored `assets/`), then `npx --yes hyperframes@0.9.72 render -f 30 --video-frame-format png`.

**Not in this cut, by design:** music, SFX, VO (still deferred), grade, and the product-section VO lines from `scene.mjs`. v02 adds the dialogue captions and the CTA end card.
**Nothing new was generated.** Every frame comes from the locked Veo clips, the real ACTIQO capture, or the brand assets.

## Dialogue (Parakeet TDT 0.6B v3 word timestamps, checked against the speech-band energy envelope)
| Clip | Words in the scripted line | Source in → out | Correct? | Unscripted speech after the line (discarded) |
|---|---|---|---|---|
| Alex `d01_s1_alex_fast_v01.mp4` | "I thought you had pickup" | **0.16 → 1.20 s** (energy onset 0.24, dip at 1.20) | ✅ all 5 words, in order | 1.20–1.84 s (ASR: "not look at it", low-level) and 2.08–4.0 s (ASR: "Yeah, no, you still have a little bit of me, so") |
| Jordan `d01_s2_jordan_fast_v01.mp4` | "I did drop off" | **0.40 → 1.60 s** (energy onset 0.40) | ✅ all 4 words, in order | 1.76–2.08 s "um", then 2.32–3.52 s (ASR: "a chin F."), plus energy after 3.84 s |

## v02 picture (current)
| Shot | Timeline in → out (dur) | Source | Source in → out | What's on screen |
|---|---|---|---|---|
| S1 | 0.00 → 1.30 (1.30) | Alex Fast v01 (locked) | 0.00 → 1.30 | "I thought you had pickup." + caption |
| S2 | 1.30 → 2.80 (1.50) | Jordan Fast v01 (locked) | 0.25 → 1.75 | "I did drop-off." + caption |
| S3 | 2.80 → 4.60 (1.80) | real UI capture | 2.20 → 4.00 | Game Plan: **Pickup · needs someone**; push 1.00 → 1.05 |
| S4 | 4.60 → 6.80 (2.20) | real UI capture | 5.50 → 7.70 | Assignments tab → **Assign** → editor |
| S5 | 6.80 → 8.90 (2.10) | real UI capture | 10.20 → 12.30 | **"Who brings them home?"** → **Alex** → Pickup · Alex |
| S6 | 8.90 → 9.70 (**0.80**, was 1.90) | real UI capture | 13.35 → 14.15 | **Save assignments** (0.35 s) → **Saving…** (from src 13.70, 0.45 s) |
| S7 | 9.70 → 12.20 (**2.50**, was 2.00) | real UI capture | 20.00 → 22.50 | **Pickup · Alex · Saved / Alex is picking up** · **Drop-off · You, Pickup · Alex**; push 1.00 → 1.03 |
| S8 | 12.20 → 15.00 (**2.80**, was 2.20) | brand | n/a | see end card below |

### v02 captions (scripted dialogue only; none on the product UI)
| Caption | On → off (fade) | Spoken (timeline) | Placement |
|---|---|---|---|
| "I thought you had pickup." (2 lines) | 0.10 → 1.25 (in 0.12 s, out 1.15–1.25) | 0.16 → 1.20 | x 120–~450, y 600: left of her face over the window/background, clear of face, keys and hand |
| "I did drop-off." | 1.40 → 2.70 (in 0.12 s, out 2.60–2.70) | 1.45 → 2.65 | same anchor: left of his face over the doorway, clear of face, strap, bag and gesturing hand |

Style: Inter 600, 46 px, white on ACTIQO ink `#0B1F3B` at 82%, radius 25 px (`--acti-r-control`). Inside the TikTok, Reels and Shorts clear areas. Captions run with the voice, so they're on screen about as long as the line is spoken. The check flags Alex's caption (1.09 s on screen) as under a read-only floor, which is expected for synced dialogue captions.

### v02 end card (12.20 → 15.00)
| Element | In | Style | Box |
|---|---|---|---|
| Wordmark (raster, flat teal Q) | 12.20 (fade 0.30) | 560 px wide | y 400–521, centred |
| **"Try it with your next practice."** (primary CTA) | 12.35 (fade + 14 px rise, 0.35) | Inter 650, 60 px, ink `#0B1F3B`, 2 balanced lines | y 588–722, x 200–880 |
| "Complimentary Family access during Early Access" (secondary) | 12.65 (fade 0.30) | Inter 500, 32 px, ink-2 `#3F4C63` | y 770–855, x 300–780 |
| "getactiqo.com" (discreet) | 12.75 (fade 0.30) | Inter 500, 30 px, ink-3 `#7A869A` | y 900, x 300–780 |

CTA on screen 2.65 s. Every element sits inside the TikTok (y 240–840 → x 120–960; y 840–1260 → x 120–780), Reels and Shorts (y 288–1248, x 48–888) clear areas.

### v02 audio
Unchanged from v01 (see below): native dialogue only, Alex 0.00–1.26, Jordan 1.30–2.73, silence after.

---
## v01 (superseded)

### v01 picture
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
