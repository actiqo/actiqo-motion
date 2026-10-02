# brand/ provenance

Everything in this folder was **copied** (never moved or edited) from the read-only production repo `/workspaces/actiqo` (branch `fix/rsvp-summary-delivery-authority`, read 2026-09-30), except the fonts and Font Awesome icons. Those were fetched from the same upstream packages production uses. No file under `/workspaces/actiqo` was modified.

## logo/current/ — the current mark (flat teal Q + navy wordmark)

| File here | Source path | Last changed in git | Notes |
|---|---|---|---|
| `actiqo-q-mark-teal.svg` | `public/assets/logo/icon-primary.svg` | 2026-08-31 | **The only true vector brand asset.** Q mark, fill `#14B8A6`. Also shipped as `favicon.svg`. |
| `actiqo-q-mark-teal.png` | `ios/App/App/Assets.xcassets/actiqo-q.imageset/actiqo-q.png` | 2026-09-01 | Raster Q used by native iOS surfaces |
| `app-icon-ios_1024.png` | `ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png` | 2026-09-01 | The shipped app icon: white Q on a teal field |
| `actiqo-wordmark-navy-teal_1672w.png` | `public/email/actiqo-logo.png` | 2026-09-01 | Highest-resolution current wordmark (raster) |
| `actiqo-wordmark-navy-teal_trimmed.png` | derived from the file above | — | Alpha-trimmed to 1525×329 for layout. Pixels unchanged. |
| `actiqo-wordmark-white-teal_480w.png` | `public/email/actiqo-wordmark-white.png` | 2026-09-02 | Wordmark for dark grounds (low resolution: 480 px) |
| `actiqo-logo-primary.svg` | `public/assets/logo/actiqo-logo-primary.svg` | 2026-08-31 | SVG **wrapper around an embedded 711×169 PNG**, not a vector. Used by the app shell top bar and setup flow. |
| `actiqo-logo-alt.svg` | `public/assets/logo/actiqo-logo-alt.svg` | 2026-08-31 | SVG wrapper around a 700×350 PNG (white wordmark + teal Q). Used on the login screen. |

## logo/superseded/ — kept for reference only, do not use

| File here | Source path | Why superseded |
|---|---|---|
| `actiqo-logo-gradient-q_v2.png` | `public/assets/logo/actiqo_logo_transparent_v2.png` (2026-04-30) | Gradient Q (blue→teal plus coral tail). Replaced by the flat teal Q on 2026-08-31. No `src/` references. |
| `actiqo-wordmark-gradient-q_handoff.png` | `design_handoff_onboarding_v10/assets/actiqo-wordmark.png` (2026-08-10) | Handoff bundle is labelled "reference only". It still shows the gradient Q. |
| `app-icon-gradient-q_mar2026.png` | `assets/icon.png` (2026-03-28) | Old Capacitor source icon |
| `og-image-waitlist-era.png` | `public/assets/social/actiqo-og-image.png` | Waitlist-era social card. Uses a fallback font, old copy ("calm AI reflections") and the gradient Q. |

## fonts/

| File | Source | Why this source |
|---|---|---|
| `Inter[opsz,wght].ttf` + `Inter-OFL.txt` | github.com/google/fonts `ofl/inter/` | Production loads Inter through `next/font/google` (`src/app/layout.tsx:23`, weights 400/500/600). No font files exist in the repo. |
| `Fraunces[SOFT,WONK,opsz,wght].ttf` + `Fraunces-OFL.txt` | github.com/google/fonts `ofl/fraunces/` | Production loads Fraunces through `next/font/google` (`src/app/layout.tsx:30`, weights 300–600). |

Both fonts are SIL OFL 1.1, so embedding them in video is permitted.

## icons/fontawesome-7/

These are SVGs from the npm package `@fortawesome/fontawesome-free@7.2.0`, the exact version in production's `package.json`. Production renders them as `<i class="fa-solid fa-…">` through `src/lib/icons/system-icons.ts` and `icon-map.ts`. The icons are licensed CC BY 4.0 (see `LICENSE.txt`).

Glyph mapping as production uses it:

| Glyph | Production role |
|---|---|
| `car-side` | Leave-by / driving (`UpNextCard.tsx`, Game Plan) |
| `person-walking` | Pickup (Game Plan assignments) |
| `user` | Assigned person (`You're on this`) |
| `bag-shopping` | What to bring |
| `location-dot` | Location (`pin`) |
| `futbol` | Soccer (`activityIconMap.soccer`) |
| `compact-disc` | Dance (`activityIconMap.dance`) |
| `list-check` | Prep progress |
| `people-group` | Game Plan |
| `triangle-exclamation` | Watchouts |
| `life-ring` | Backup |
| `clock`, `calendar`, `calendar-days`, `check`, `comment-dots`, `arrow-right`, `car` | Supporting system icons |

## tokens-source/ — verbatim copies of the token authorities

`tokens.ts`, `base-tokens.ts`, `typography.ts`, `spacing.ts` (from `src/styles/`), `globals.css` (from `src/app/`), `iconpolicy.md` (from `docs/`), and `handoff-design-system-readme.md` (from `design_handoff_onboarding_v10/_ds/actiqo-design-system-8163ada4-…/readme.md`).

## reference-screens/

These are production QA captures at 390 px, copied from the repo root (dated 2026-09-07 to 2026-09-09). They are the most recent rendered evidence of the live UI:

- `onboard-truth-01-welcome-390.png`
- `onboard-truth-05-family-two-children-390.png`
- `onboard-truth-12-all-set-390.png`
- `travel-auto-2-automatic-complete-390.png` (the leave-by card)
- `owner-id-manage-390.png`
- `session-truth-drawer-390.png`
- `manage-open-before-390.png`
- `add-parity-s1-basic-viewport-390.png`

## actiqo-motion-tokens.css

This is the only style source the styleframes use. Every value is cited to its production file inside the CSS.
