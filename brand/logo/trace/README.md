# Experimental wordmark trace — NOT approved for use

`actiqo-wordmark-trace_EXPERIMENTAL.svg` is a vector trace of the official raster wordmark
`public/email/actiqo-logo.png` (copied to `../current/actiqo-wordmark-navy-teal_1672w.png`,
alpha-trimmed to `actiqo-wordmark-navy-teal_trimmed.png`, 1525×329).

**Film 01 keeps using the official raster.** Swap to this SVG only after you approve it.

## Method
Built with `tools/trace-wordmark.cjs` (potrace 2, local to the motion workspace):
1. Split the raster's two inks by hue.
2. Build alpha-weighted coverage masks for each ink.
3. Upscale the masks 4× with bicubic filtering, so the 50% threshold lands on the true sub-pixel edge.
4. Run potrace with `turdSize 8` and `optTolerance 0.2`.
5. Merge the two paths into one SVG.

No shapes were redrawn or corrected by hand. The letterforms are not attributed to any typeface.

## Colours
The fills are the raster's own measured solid inks, not the UI tokens:
- navy `#011E4E` (the UI ink token is `#0B1F3B`)
- teal `#00B7B2` (the UI mark token and `icon-primary.svg` use `#14B8A6`)

This mismatch already exists in the official assets. Worth resolving when a master logo file exists.

## Verification (rasterized at 1525×329 in Chrome, compared against the original on white)
- RMSE: 0.026
- Pixels differing by more than 25%: 3,826 of 501,725 (0.76%), all on anti-aliased edges
- Visual checks:
  - `verification_original-trace-diff.png`: original, trace, and a difference image
  - `verification_q-detail-3x_original-left_trace-right.png`: 3× zoom on the Q's bars and tail

## Before production use
Have a designer check it against a master logo file, if one exists. Check especially:
- the bar tops inside the Q
- the Q tail tip
- the A apex
