# gtm/: GTM short-form video system

This folder holds one directory per production (`d01-pickup`, `d02-water-bottles`, `d03-leave-time`, …), and each one has the same layout:
`brief/ references/ generations/ ui/ audio/ renders/ scene.mjs README.md`. Shared tools live in `scripts/`.

## Hybrid rule
- **The video model** makes people, props and rooms only. It never makes ACTIQO UI, text, logos, buttons or screens.
- **The product** comes only from real ACTIQO captures of the shipping build.
- **The brand** comes only from `brand/` (official wordmark, Inter/Fraunces, tokens).
- **The edit** is HyperFrames (`hyperframes@0.8.98`), driven by each production's `scene.mjs`.

## Conventions
- Raw generations and raw UI captures are git-ignored. Selects and renders are committed through LFS (`.gitattributes`).
- Every paid call is logged in `generations-ledger.jsonl`. Nothing spends money without `--confirm-spend`.
- Render into the scratchpad first (the disk is nearly full), then copy the master into `renders/`.
