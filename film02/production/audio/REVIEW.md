# Film 02 · Audio (sound design + music)

| | |
|---|---|
| **Phase** | Final sound design + music, against locked picture |
| **Status** | **Waiting for licensed assets** (Artlist Pro, decided 2026-10-02). No audio rendered yet; no code-generated sound will be used in the final. |

## Ready
- **`CUES.md` / `cues.json`:** a frame-accurate spotting list generated from the locked picture's own timeline (`node audio/cues.mjs`).
  - 49 events, each tagged with the stem it belongs to (music / ambience / foley / UI), with frame numbers and timecode.
  - 31 on-screen footfalls: the gait simulator's actual heel strikes for Mom, Dad and Grandma, so every step lands on the frame the foot does. Each has its speed, for step weight.
- **`mix.mjs`:** the stem → mix → picture pipeline (`node audio/mix.mjs`, default −16 LUFS integrated, −1 dBTP).
  - Takes `stems/{music,ambience,foley,ui}.wav` and conforms them to 48 kHz stereo, exactly 30.000 s.
  - Applies ONE loudness gain to every stem, so the stems still sum to the mix (verified: residual −132 dB).
  - Writes `out/mix_full.wav`, `out/music_only.wav`, `out/sfx_only.wav` and `out/stem_*.wav` (48 kHz / 24-bit).
  - Muxes the mix into copies of the silent masters, `../film/out/ACTIQO_WhatYouCarry_30s_mix_{16x9,9x16}.mp4`. The video stream is copied, never re-encoded, and the silent masters are left untouched.
  - The pipeline has been tested end to end (with test noise only; nothing is committed).

## Sourcing (decided)
- **Music:** one licensed Artlist track, chosen by you; **with stems**, so the arrangement can build, align and subtract on cue. The brief and the arrangement plan are in `ASSETS.md`.
- **SFX / foley / ambience:** Artlist library assets (the list and file names are in `ASSETS.md`). A cue the library can't cover (most likely the fold or the alignment snap) is flagged individually for possible AI SFX, never the whole soundtrack.
- **Pipeline:** `audio/assets/` (raw licensed files, git-ignored) → `node audio/place.mjs` (places everything frame-accurately on the timeline / heel strikes, arranges the music stems on the track's bar and beat grid) → `audio/stems/` → `node audio/mix.mjs` → WAVs + review masters. `assets.example.json` is the starting manifest; it's been dry-run end to end.

## Why the audio is licensed rather than code-built
The brief asks for the score to be judged by the same premium standard as the picture, and to stop rather than force procedural audio in. Two facts decide this:
1. **There's no recorded source material on this machine:** no music, foley or ambience library, and no samples or sound fonts. The only available synthesis is ffmpeg's oscillators and noise generators. A score and foley built from those (footsteps, cloth, a bag handoff, a phone in a pocket, a warm organic/electronic bed) would sound procedural, which is exactly the outcome the brief rules out.
2. **I can't listen to audio.** I can measure loudness, peaks, sync and spectra, but I can't judge whether something sounds natural, warm or premium. Signing off a score I can't hear would not be an honest quality judgement.
