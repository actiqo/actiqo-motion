# ACTIQO motion

The motion production workspace for ACTIQO brand films. It is **separate from the product repo** (`actiqo/actiqo`), which this workspace only ever read from.

## Map
| Path | What it is |
|---|---|
| `ACTIQO_BRAND_MOTION_AUDIT.md` | Brand extraction: real tokens, type, logo, UI patterns, conflicts |
| `ACTIQO_MOTION_SYSTEM.md` | Motion rules: timing, easing, primitives, never-animate list |
| `brand/` | Copied brand assets with provenance (`brand/SOURCES.md`), production tokens, fonts, Font Awesome 7 icons, the experimental wordmark trace |
| `styleframes/film01/` | Film 01 styleframes (v1-approved and v2), plus the S6 styleframes and product mapping (`s6/S6_PRODUCT_MAPPING.md`) |
| `videos/actiqo-the-hour/` | **Film 01, "The Hour"**: the HyperFrames project. S1–S5 are locked at v02-1. Stills are in `stills/`. |
| `film02/` | **Film 02, "What You Carry"**: treatments, the storyboard (`FILM02_STORYBOARD.md`), styleframes, and production checkpoints |
| `film02/production/cpN/REVIEW.md` | One review sheet per checkpoint: runtime, files to review, nits, decisions, approval status |
| `tools/` | Utility scripts, such as the wordmark trace |

## Film 02 review entry points
- CP1, character and walk: `film02/production/cp1/REVIEW.md`, with the sheet at `cp1/review_v5/00_REVIEW_V5_contact_sheet.png`
- CP2, 0–12 s: `film02/production/cp2/REVIEW.md`, with sheets at `cp2/out/CP2_contact_16x9.png` and `CP2_contact_9x16.png`
- CP3, 12–20 s: `film02/production/cp3/REVIEW.md`. The renders live in `film02/production/film/out/`.

## Conventions
- **Videos and audio** (`.mp4`, `.mov`, `.wav`, `.aiff`) are stored with **Git LFS**. Run `git lfs install` before cloning to get the files rather than pointer stubs.
- **Not tracked:** `node_modules/`, caches, temporary frames and scratch output (see `.gitignore`).
- **Brand rules:** only real ACTIQO brand assets and real 3.0 UI. ACTIQO syncs **Google Calendar and Apple Calendar only**; never imply GameChanger, TeamSnap or PlayMetrics integration.
