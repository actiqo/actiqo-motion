# Film 02 · Audio assets to download (Artlist Pro)

Put each download in `audio/assets/<folder>/` under the file name given here. If a name doesn't fit, any name works as long as `assets.json` points to it. Raw licensed files stay on this machine (`audio/assets/` is git-ignored): only our mixes and stems are committed and packaged.

**Format:** WAV, 48 kHz / 24-bit if offered (any WAV or high-bitrate file is accepted and conformed). Single, dry takes are better than pre-mixed sequences. Several takes of anything repeated, so nothing machine-guns.

Every time below comes from the locked picture (`CUES.md`).

## Music · `assets/music/` (revised direction: momentum, arranged by layers)
**Choose a track that Artlist offers with STEMS.** The arrangement adds layers as the day fills up (3–9 s), aligns at the fold, releases layers as responsibilities leave Mom (17.95 and 19.65 s), and drops one last element when Grandma takes pickup (25.4 s). That can only be done convincingly by muting and unmuting the track's own stems on its beat grid. A single stereo file can only be made louder or quieter.

**Character (final brief):** a modern lifestyle groove, **100–110 BPM**, warm and understated, steady everyday momentum. Organic / electronic instrumentation, a minimal melodic hook, a repetitive pulse, subtle layering. No emotional drama, no corporate uplift. It should feel like moving through a busy weekday on autopilot.

> **The most important rule for choosing it:** do not choose a track that changes mood when the workload increases. Choose one whose arrangement can become denser while the underlying emotional tone stays pleasantly neutral. Density, not drama, carries the story.

Also avoid: ambient-only, ukulele, acoustic corporate guitar, handclap-heavy, sentimental piano, cinematic tension, EDM, cute / comedy, futuristic tech.

| File | What |
|---|---|
| `track.wav` | The full mix of the chosen track (reference, and fallback) |
| `stem_drums.wav`, `stem_bass.wav`, `stem_perc.wav`, `stem_keys.wav` (plucks / mallets), `stem_synth.wav` (texture / pulse), … | Whatever stems Artlist provides, named by their content. All stems must be the same length as the track. |
| **Tell me:** the BPM, and roughly where a bar starts (for example "the first kick is at 0.52 s") | Used to snap every layer change onto the music's own bar or beat lines. |

**Arrangement plan** (starting point in `assets.example.json`; it will be adjusted to the actual stems):
| Film time | Music |
|---|---|
| 0–3 s | Core groove already moving: light drums, bass, muted pluck. Appealing and everyday. |
| 3.0 / 4.2 / 5.2 / 6.4 / 7.4 s | Same groove, more density: one more element joins with each new responsibility, on the nearest beat, never as a sting. |
| 9.55–12.0 s | **Busiest:** all layers in, slightly tighter, less breathing room. Not dark. |
| 12.0–15.0 s | **Aligns:** off-grid / busy percussion drops; the layers left lock to the pulse; harmonically clearer. The same piece, organized. |
| 17.95 s | What to bring resolves: one layer simplifies. |
| 19.65 s | Dad takes drop-off: another small layer releases. |
| 20–25.4 s | Groove moving; one subtle remaining element (for example a pulsing synth or a nagging hat) is the open pickup. |
| 25.4 s | Grandma takes pickup: that element is removed. No chord, chime or ta-da. The music simply gets easier. |
| 26–30 s | The opening's energy back, with more space: a lighter, cleaner groove carrying into the end card. Natural ending on 30.0 s if the track allows; otherwise a musical fade. |

## Ambience · `assets/ambience/`
| File | What | Placed |
|---|---|---|
| `amb_afternoon.wav` | Quiet residential / suburban exterior, late afternoon: distant birds, very distant traffic, **no voices**. 40 s or more. | 0–30 s, under everything; thins out with the world from 27.3 s |

## Physical foley · `assets/foley/`
| File(s) | What | Placed |
|---|---|---|
| `steps_mom_01…06.wav` | Woman walking in light **sneakers** on a smooth hard surface (pavement or a hall floor), single steps, unhurried | 23 heel strikes: 0–10.2 s (stops), then 26.89 s onward (free walk) |
| `steps_dad_01…03.wav` | Man in **leather shoes**, slightly heavier | 18.42, 19.21 s |
| `steps_grandma_01…05.wav` | Older woman in soft **loafers**: lighter and slower, not shuffling | 23.34–25.34 s, then 26.86 and 27.42 s |
| `cloth_coat_01…03.wav` | Coat / trench rustle, small arm movements | Mom's glances; the start of the free walk |
| `cleats_handle.wav` | Soccer cleats picked up / knocking together (studs, laces) | 7.58 s (lift) → 8.1 s (in hand) |
| `cleats_into_bag.wav` | Shoes placed into a sports bag | 17.8–18.25 s |
| `bag_handoff.wav` | Duffel / sports bag lifted from someone's shoulder: strap, nylon, a soft weight shift | Reach 18.95 s, **lift 19.45 s** |
| `phone_pocket.wav` | Phone slid into a coat pocket | 25.55 s |

## UI / information · `assets/ui/`
| File(s) | What | Placed |
|---|---|---|
| `phone_buzz.wav` | One short phone vibration (a real phone on a hand or table, not a ringtone) | 0.40 s, "Practice moved to Field 7" |
| `notify_soft.wav` | A second, quieter, softer cue: a muted haptic tick, not a ding | 1.50 s, "Who has pickup?" |
| `register_01…05.wav` | Tactile, quiet "settle" sounds: a soft paper, felt or wood tick or tap. **Not** beeps, clicks or game sounds | Marker arrivals 3.0–7.4 s (very low); Game Plan registrations 14.1–16.75 s |
| `tap.wav` | A subtle screen touch | 22.6 s (Who's doing what), 23.6 s (Assign) |
| `view_change.wav` | A soft sheet / surface slide | 22.75–23.45 s (overview → Assignments) |
| `fold_structural.wav` | **The fold (hero):** a large paper / card fold or a slow structural settle; precise and physical, about 1.5–2 s | 12.6 s → 14.4 s |
| `align_snap.wav` | A tiny, precise snap / settle | 12.0 s (grid alignment) |

## Likely gaps (flag for single-cue AI SFX if the library has no fit)
- **`fold_structural`**: the most specific sound in the film. If nothing reads as "architectural, precise, physical" without sci-fi or whoosh, flag it.
- **`align_snap`**: tiny and precise. It could also come from a trimmed `register` take.
- **`register` set**: if the library's UI sounds are all beeps or clicks, a soft paper/felt foley tick (from a foley pack, not a UI pack) is the better source.

Once the files are in: `node audio/place.mjs` → `node audio/mix.mjs` → review masters `film/out/ACTIQO_WhatYouCarry_30s_mix_{16x9,9x16}.mp4`.
