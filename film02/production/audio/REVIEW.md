# Film 02 · Audio (sound design + music)

| | |
|---|---|
| **Phase** | Final sound design + music, against locked picture |
| **Status** | **Sourcing decision needed.** No audio is rendered yet. |

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

## Why no audio yet
The brief asks for the score to be judged by the same premium standard as the picture, and to stop rather than force procedural audio in. Two facts decide this:
1. **There's no recorded source material on this machine:** no music, foley or ambience library, and no samples or sound fonts. The only available synthesis is ffmpeg's oscillators and noise generators. A score and foley built from those (footsteps, cloth, a bag handoff, a phone in a pocket, a warm organic/electronic bed) would sound procedural, which is exactly the outcome the brief rules out.
2. **I can't listen to audio.** I can measure loudness, peaks, sync and spectra, but I can't judge whether something sounds natural, warm or premium. Signing off a score I can't hear would not be an honest quality judgement.

## Options
1. **Recorded/licensed sources, cut and mixed here (recommended for picture-locked premium quality).**
   - **Music:** a licensed track or stems (for example Musicbed, Artlist or Epidemic), or a composer working to `CUES.md`.
   - **Foley and ambience:** a recorded library (for example Soundly or BOOM), or a sound designer.
   - I place everything frame-accurately against the cue sheet and footfalls, build the four stems, mix and deliver through the review workflow.
2. **AI-generated audio** through a connected generation service. This uses that service's credits and licence terms, and you would still be the judge of how it sounds.
3. **A code-built temp track,** clearly labelled as a timing guide only, never as the final mix.
