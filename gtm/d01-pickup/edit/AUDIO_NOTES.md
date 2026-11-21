# D01 Final candidate: audio notes and source manifest

**Current: audio v02** (phone-speaker translation pass). v01 below is kept for reference.
**Picture:** LOCKED at v02. Every master stream-copies the video of `review/d01_rough_v02.mp4`. The video MD5 `aa2c258c7420181eec9e72ded6b53a4a` is identical in v02 rough, all v01 masters, all v02 masters and the phone-check reference.
**Build:** `./link-assets.sh && ./sound/mix.sh` (runs `sound/synth.mjs`, mixes, writes masters + phone-check). `./sound/phonecheck.sh <file>` prints per-section full-band vs phone-band loudness.

## Audio v02 deliverables (`review/`)
| File | What |
|---|---|
| `d01_final_candidate_v02.mp4` | **Final sound master v02** (dialogue + room tail + UI SFX + bed) |
| `d01_final_candidate_v02_musicfree.mp4` | Music-free v02 (dialogue + room tail + UI SFX) |
| `d01_final_candidate_v01_clean.mp4` | Clean picture master. Unchanged, not duplicated |
| `d01_final_candidate_v02_PHONECHECK_reference.mp4` | **Comparison only, NOT a master.** Full v02 mix, mono-summed, HP 180 Hz / LP 8 kHz (12 dB/oct), AAC 192k |
| `d01_final_candidate_v02_audio.png` | v02 waveform + spectrogram |
| `d01_audio_v01_vs_v02_spectrum.png` | v01 vs v02 spectrograms, stacked |

All are 1080×1920, 30 fps, 15.00 s, H.264 (stream-copied) + AAC-LC 320 kb/s 48 kHz.

## What changed in v02 (audio only)
| Area | Change | Unchanged |
|---|---|---|
| Rhythm | **Pluck:** 3rd/4th partials (fast-decaying) for 0.7–4 kHz presence, level about +5 dB in the stem (0.045 → 0.085). **Shaker:** band moved from 5.5–11 kHz to 2.5–7 kHz, about +5 dB (0.06 → 0.11). **Kick:** sub 46→52 Hz base, shorter, −7 dB, plus a soft ~900 Hz "knock" so the pulse reads without sub. **Bass:** 2nd/3rd/4th harmonics carry the line above 180 Hz; fundamental −4 dB. Stem LP 9 → 8.5 kHz | 104 BPM, the same grid, pattern, harmony and groove stop at 12.03 |
| Pad | HP 200 Hz ×2 (was none), LP 1.7 → 2.4 kHz. Over the end card (12.03 → 15.00) a **faint F#5 + A5** (Dmaj9 tones, −41 dBFS each in the stem) so the last 2.8 s survive a phone speaker | Chords, envelopes, fade 13.6 → 15.0, no percussion after 12.03 |
| UI taps | + a soft 2–4 kHz felt transient (7 ms) and a short 2.6 kHz body. 0.7–4 kHz peaks +1.3 to +2.5 dB vs v01. Save tap level 0.14 → 0.11 so it stays under Saved | Cue times 6.19 / 8.59 / 9.21, the same family (felt click + wooden body) |
| **Saved (9.71)** | **None.** The exact v01 render is committed as `sound/locked/sfx_saved_v01.wav` (MD5 `fbf4ffe14d987f994c319b131b9650fc`) and the mix uses that file | D5→A5 rising fifth + A4 underlay + felt seat; level 0.21 |
| Dialogue | **None.** The 0–2.45 s audio of the music-free masters has the same MD5 in v01 and v02. Same +3 dB Alex match, 70 Hz HP, fades and timing | |
| Loudness | Master gain **fixed at v01's 11.9 dB** (no re-targeting). Bed mix levels pad 0.33 → 0.56 and rhythm 0.127 → 0.285, so full-band section loudness matches v01 within ±0.6 LU | 4×-oversampled limiter at −1.5 dBFS |

## Phone-speaker check (HP 180 Hz / LP 8 kHz, K-weighted LUFS per section)
| Section | v01 full | v01 phone | v01 loss | **v02 full** | **v02 phone** | **v02 loss** | phone gain v01→v02 |
|---|---|---|---|---|---|---|---|
| Dialogue 0.10–2.70 | −14.1 | −14.4 | 0.3 | −14.1 | −14.4 | 0.3 | 0.0 (unchanged) |
| UI 2.80–6.20 | −19.8 | −23.0 | 3.2 | −19.7 | −21.8 | **2.1** | **+1.2** |
| Assign → Save 6.10–9.70 | −20.2 | −24.7 | 4.5 | −20.9 | −23.9 | **3.0** | **+0.8** |
| Resolved 9.70–12.20 | −17.2 | −19.7 | 2.5 | −16.7 | −18.2 | **1.5** | **+1.5** |
| End card 12.20–15.00 | −19.4 | −22.4 | 3.0 | −18.8 | −20.1 | **1.3** | **+2.3** |

Whole master: v01 −17.8 → **v02 −17.7 LUFS integrated**, true peak (4× oversampled) **−1.49 dBTP**. Music-free v02: −16.2 LUFS (gated), −1.49 dBTP. Dialogue stays the loudest content by ≥5 LU.

**SFX peaks** (music-free, full band / 0.7–4 kHz band, dBFS):

| Cue | Time (s) | Peak (full / 0.7–4 kHz) | v01 |
|---|---|---|---|
| Assign | 6.19 | −10.7 / −15.5 | −12.3 / −16.8 |
| Alex | 8.59 | −12.0 / −15.2 | −12.6 / −17.5 |
| Save | 9.21 | −10.6 / −15.3 | −10.7 / −15.6 |
| **Saved** | **9.71** | **−9.1 / −14.5** | identical to v01, still the strongest cue |

## Still to judge by ear
I measured these (section loudness, band peaks, spectrograms) but can't listen. Please compare on a phone speaker:
- Is the groove still audible at moderate volume through the 2.80–9.70 section?
- Do the taps read as tactile and not clicky?
- Is the end card present but spacious?

The phone-check file is there to A/B against the master.

---

# Audio v01 (reference)

**Picture:** LOCKED at v02. All three masters **stream-copy** the video of `review/d01_rough_v02.mp4`. The video MD5 is identical in v02 and all three masters (`aa2c258c7420181eec9e72ded6b53a4a`), so nothing in the picture changed.
**Build:** `./link-assets.sh && ./sound/mix.sh` (runs `sound/synth.mjs`, mixes with ffmpeg, writes the masters to `review/`).

## Masters (`review/`)
| File | Content | Loudness |
|---|---|---|
| `d01_final_candidate_v01.mp4` | **A. Final sound master**: dialogue + room tail + UI SFX + rhythmic/ambient bed | dialogue −14.1 LUFS (short-term), integrated −17.8 LUFS, true peak −1.48 dBTP |
| `d01_final_candidate_v01_musicfree.mp4` | **B. Music-free**: same mix without the bed | same gain as A (dialogue identical), integrated −16.2 LUFS (gated), −1.5 dBTP |
| `d01_final_candidate_v01_clean.mp4` | **C. Clean picture**: no audio | n/a |

All are 1080×1920, 30 fps, 15.00 s, H.264 (picture as v02) + AAC-LC 320 kb/s 48 kHz stereo, with `+faststart`.

**Loudness approach:** the dialogue is the loudest element and is set to about −14 LUFS short-term, which is social-normalisation level. Everything else sits under it: UI section −19.8/−20.2, resolved −17.2, end card −19.4 LUFS. A 4×-oversampled peak limiter holds −1.5 dBFS. Integrated is −17.8 LUFS because only 2.7 s of the 15 s is speech. Pushing integrated to −14 would put the bed and SFX level with the dialogue, which the brief rules out. Platforms that normalise up will lift it about 3–4 dB without changing the balance.

## Sources (nothing licensed, nothing downloaded, nothing generated by AI)
| Element | Source | Provenance |
|---|---|---|
| Alex / Jordan dialogue | The locked native Veo dialogue, exactly as edited in v02 (Alex 0.00–1.26, Jordan 1.30–2.73) | Our fal/Veo generations (req 01a1faa8, 01a1fb66) |
| Room-tone tail | Jordan clip src 2.30–2.52 (his own room bed in a pause, no speech), ping-ponged to 0.66 s | Same locked clip |
| UI SFX (enter, 3 taps, saved) | `sound/synth.mjs`, synthesized from oscillators and filtered noise | **Original**, written for D01 |
| Rhythmic/ambient bed (pad + soft kick, bass, shaker, pluck) | `sound/synth.mjs`, D major, **104 BPM** | **Original**, written for D01 |
| Music | **None.** No cleared/licensed track exists in the repo (Film 02's Artlist folders are empty, and the D01 policy says licensed beds only). Per the brief's fallback, the master uses sound design plus the restrained original bed above, and no third-party music. | n/a |

## Dialogue treatment
- **Timing:** unchanged; same cut points and fades as v02.
- **Level match:** Alex +3 dB (she measured −28.5 vs Jordan −24.4 LUFS). This leaves about 1 dB of natural difference.
- **EQ:** a 70 Hz first-order high-pass (handling rumble only).
- **Not applied:** denoise, pitch/time changes, or compression beyond the final peak limiter. The room character is preserved.

## Event map (timeline seconds)
| t | Cue | Why there | Character |
|---|---|---|---|
| 0.00–2.70 | Bed ducked to −20 dB (pad only, Bm7) | under dialogue | barely there, keeps the opening alive |
| 2.62–3.28 | Room-tone tail (in 0.08, out 0.36) | covers the 2.73 cut so the room doesn't drop to silence | Jordan's own room |
| 2.52 → 2.80 | Enter: soft air lift → low felt D4 pluck **on the 2.80 cut** | the transition into ACTIQO | no whoosh, no boom |
| 2.70–3.00 | Bed rises to full; groove starts on the **2.80 downbeat** | after Jordan, the product sequence begins | warm, light percussion |
| 6.19 | Tap (Assign) | screen change at 6.233 | felt click + wooden body |
| 8.59 | Tap, slightly brighter (Alex selected) | screen change at 8.633 | same family |
| 9.21 | Tap, slightly firmer (Save) | "Saving…" at 9.25 | same family |
| **9.71** | **Saved**: felt seat + D5→A5 rising fifth with an A4 underlay | resolved Game Plan cut at 9.70 | the warmest cue, still small |
| 9.72 | Bed **release**: chord resolves to Dmaj9, shaker drops to quarters, higher simple motif, +1.5 dB | lands on beat 12 = 9.723 | "alignment" |
| 12.03 | Groove lands: one soft chord pluck + bass, percussion stops | bar line just before the end card (12.20) | clean |
| 12.20–15.00 | Pad holds; fades 13.6 → 15.0 | end card | spacious finish |

**Bed harmony:** Bm7 (0.00, under dialogue, then the 2.80 bar) | Gmaj7 (5.11) | Em7 (7.42) | A7sus4 (8.57) | **Dmaj9 (9.72 → end)**. It's in the same key as the saved chime.

**Mix levels:** enter 0.38, taps 0.12 / 0.12 / 0.14, saved 0.21, pad 0.33, rhythm 0.127. The bed envelope is in `mix.sh`.

## Review checklist (please listen on a phone speaker and on earbuds)
- Does the 2.73–2.80 handoff feel continuous rather than dead?
- Are the taps audible but understated, with the saved chime the most satisfying moment?
- Does the bed read as everyday momentum, neither corporate nor sentimental? It's original and synthesized, so it's simpler than a licensed track. If you want a licensed bed, drop it into `audio/assets/` and only the bed layer changes. The music-free master is the clean base.
- I evaluated this by measurement only: loudness per section, peaks, and the spectrogram (`review/d01_final_candidate_v01_audio.png`). I can't listen, so the judgment calls on taste are yours.
