# ACTIQO brand → motion audit

Audit date: 2026-09-30. Source: `/workspaces/actiqo`, branch `fix/rsvp-summary-delivery-authority`, read-only (no files modified, no git state changed). Copied assets and provenance: `brand/` and `brand/SOURCES.md`. Motion rules: `ACTIQO_MOTION_SYSTEM.md`. Styleframes: `styleframes/film01/`.

**Authority order used when sources disagree.** This follows the repo's own precedence rules (`design_handoff_onboarding_v10/START_HERE.md`, the `base-tokens.ts` header):
1. Shipped production code and its latest founder rulings (`src/styles/base-tokens.ts`, `tokens.ts`, `layout.tsx`, `globals.css`).
2. The most recent QA screenshots of the live app (2026-09-07 to 09-09).
3. The handoff design-system bundle, which labels itself "reference only".
4. Figma variable exports and prototypes.

---

## 1. Brand assets found

| Asset | Status | Best file |
|---|---|---|
| **Q mark, flat teal `#14B8A6`** | CURRENT (shipped 2026-08-31) | `brand/logo/current/actiqo-q-mark-teal.svg`, the only true vector |
| **Wordmark, navy "ACTI" + teal Q + navy "O"** | CURRENT (2026-09-01) | `actiqo-wordmark-navy-teal_1672w.png`; trimmed copy at 1525×329 |
| Wordmark, white + teal Q (for dark grounds) | CURRENT | `actiqo-wordmark-white-teal_480w.png` (480 px: too small for video) and `actiqo-logo-alt.svg` (700 px PNG inside an SVG) |
| App icon: white Q on teal field | CURRENT (iOS, 2026-09-01) | `app-icon-ios_1024.png` |
| Gradient Q (blue→teal ring + coral "tail") | SUPERSEDED | `brand/logo/superseded/*` |
| Social OG card (navy, "Early access waitlist") | SUPERSEDED | `superseded/og-image-waitlist-era.png` |
| 3D family/activity illustrations | Mentioned in the handoff DS readme only. Nothing current in `public/`; `public/assets/illustrations/*.svg` are older flat SVGs. | Not copied. Not used. |
| Child avatars | `public/assets/avatars/child-0*.svg` (older illustration set) | Not copied. Production renders initials in tinted circles. |

**Logo usage rules I could establish.** No brand guideline document exists for clear-space or minimum size.
- On light grounds use the navy wordmark with the teal Q. On navy use the white wordmark with the teal Q (`actiqo-logo-alt`, login screen).
- Production's top bar shows the wordmark at 28 px high (`shell.tsx:1611`). The login screen shows it at 68 px high (`login/page.tsx:85`).
- The handoff DS readme says "Never redraw the mark; at small sizes prefer the wordmark asset over typed text."
- **Missing: a vector wordmark.** Every wordmark file is raster, including both "SVG" logos, which are PNG wrappers. The wordmark typeface is a geometric sans that appears nowhere else in the product (see §10).

## 2. Source paths

The full table is in `brand/SOURCES.md`. The files that define the system:
- `src/styles/base-tokens.ts`: the semantic contract (type roles, radius roles, tint families, icon wells, motion).
- `src/styles/tokens.ts`: primitive colours, shadows, button spec.
- `src/app/layout.tsx:5-34`: font loading.
- `src/app/globals.css`: canvas ruling, keyframes, view-transition timing.
- `src/lib/icons/system-icons.ts`, `icon-map.ts`, `docs/iconpolicy.md`: icons.
- `src/components/daily-snapshot/UpNextCard.tsx`, `WeekStrip.tsx`, `GamePlanCard.tsx`, `KidsReadinessStrip.tsx`; `src/components/game-plan/structure/views.tsx`; `src/components/calendar/WeekCalendar.tsx`: the UI patterns in §8.

## 3. Fonts

| Role | Family | Weights loaded | Spec |
|---|---|---|---|
| Operational (all UI, body, labels, chips, times) | **Inter** | 400 / 500 / 600 (`layout.tsx:23`) | body 16/22 400; label 14/19 500; section label 15/20 600, sentence case; metadata 12/16 400; screen title 24/30 600 −0.01em |
| Editorial (display, page and detail titles, human moments) | **Fraunces** | 300 / 400 / 500 / 600 (`layout.tsx:30`) | displayTitle 34/40 600 −0.5px; pageTitle 28/34 600 −0.5px; detailTitle 22/28 600 −0.5px; editorialBody 18/23 400 |
| Numbers | Inter with `tnum` | | tabular figures on every time and metric |

- Both fonts load from Google Fonts via `next/font/google`. No font files are committed. I fetched the same OFL variable files into `brand/fonts/`.
- **Inter 700 is not loaded.** `UpNextCard` asks for 700 on "Leave by", which renders as a faux-bold or fallback. The styleframes use 600, which is what actually renders.
- Tracking: display and titles −0.5px at phone size (about −0.018em). Body is 0.

## 4. Colours (exact production values)

| Role | Hex | Source |
|---|---|---|
| Page canvas, every non-Home screen | `#FCFAF7` | founder ruling 2026-08-31, `globals.css:22` |
| Home canvas | `#FAF8F4` | `globals.css:34` |
| Legacy cream (Weekly and tints only) | `#F4F1EC` | `tokens.ts` `page` |
| Card / surface | `#FFFFFF` | |
| Soft surface | `#FBF9F5` | |
| Hairline | `rgba(11,31,59,0.08)` | |
| Divider | `rgba(11,31,59,0.12)` | |
| **Ink / navy: primary text, dominant action, premium emphasis** | **`#0B1F3B`** | |
| Ink 2 / Ink 3 / muted | `#3F4C63` / `#7A869A` / `#A8B0BE` | |
| **Teal: brand mark** (also "ready" in older code) | **`#14B8A6`** | |
| Green tint (ready, confirmed, leave-by, assigned) | ink `#0F7A4B`, surface `#DCEFE3` | `ACTI_TINT.green` |
| Orange tint (input required, **unassigned responsibility only**) | ink `#C2410C`, surface `#FBEAD9` | `ACTI_TINT.orange` |
| Blue tint (informational, links, selection) | ink `#1D4ED8`, surface `#E6EEFE` | `ACTI_TINT.blue` |
| Lilac tint (family, optional, editorial accent) | ink `#5B4BB5`, surface `#EFEBF8` | `ACTI_TINT.lilac` |
| Danger (real risk only) | `#E11D48` | `ACTI_COLOR.danger` |
| Child identity palette | `#818CF8 #34D399 #2563EB #14B8A6 #7C3AED #DB2777 #D97706 #059669 #F97316 #0EA5E9` | `AddChildModal.tsx:40` |

**Gradients:** effectively none. The only sanctioned one is the subtle blue "Since yesterday" card. The gradient Q is retired.

## 5. Shape and radius

| Element | Radius at 1× |
|---|---|
| Controls | 10 |
| Fields and primary action | 12 |
| Surfaces and cards | 16 (`ACTI_RADIUS.surface`; legacy `tokens.ts` says 14) |
| Overlays and sheets | 20 |
| Pills and icon wells | full circle (`9999`) |

- Calendar event blocks: radius 5, with a 2.5px left rail in the child's colour.
- Cards: 1px hairline border. An accent is a 3–4px left rail, never a coloured outline.
- Primary button: navy fill, radius 12, height 52–56, Inter 15/600 white.
- Chips and pills: radius full, padding 3–5 × 9–12, Inter 12/600 on a tint surface.
- Icon wells: always circles of 40, 44 or 56 px, tint surface with a tint-ink glyph. Never square, never emoji.
- Dividers: 1px hairline top rule between rows. No double borders.

## 6. Shadow and elevation

- Card: `0 1px 2px rgba(11,31,59,0.04), 0 4px 12px rgba(11,31,59,0.04)`, almost invisible.
- Floating sheet or overlay: `0 2px 4px rgba(11,31,59,0.05), 0 12px 28px rgba(11,31,59,0.08)`.
- Tinted panels (Up Next green panel, orange watchout) have **no border and no shadow**. Depth comes from tint, not elevation.
- There is **no blur, no glass and no translucency** in shipped UI. Figma exports carry iOS "liquid glass" kit variables, but those are system-kit chrome, not ACTIQO.

## 7. Icons

- **Library: Font Awesome Free 7.2.0.** Production mostly uses solid glyphs, with a few regular ones (`clock`, `calendar`, `envelope`).
- Production sizes at 1×: 10 / 12 / 14 / 20 / 28. Inside wells the glyph is about 16 px in a 40 well.
- Icons always sit in a circular tint well or inline before a label. Colour carries meaning through the tint family.
- Policy (`docs/iconpolicy.md`): SystemIcon means state; activity/avatar icons mean identity (user-picked). Emoji are banned by ESLint outside allowlisted files. `sparkles` is restricted.
- Film-relevant glyphs: `car-side` (leave / driving), `person-walking` (pickup), `user` (assigned person), `bag-shopping` (what to bring), `location-dot`, `futbol` (soccer), `compact-disc` (dance), `list-check`, `people-group` (Game Plan), `triangle-exclamation` (watchouts), `life-ring` (backup).

## 8. Key UI patterns (what makes ACTIQO look like ACTIQO)

1. **Fraunces page title over an ivory canvas, then Inter everywhere else.** This serif-title / sans-body split is the single most recognizable signature. Examples: "Welcome to ACTIQO", "You're all set", "Manage activity", "Automatic leave time".
2. **White hairline cards containing rows with circular tint wells.** A 44 well, a 15/500 label, a 13 secondary line, a right-aligned value and a chevron.
3. **Leave-by is a green object.** The canonical copy is `Leave by 4:48 PM`, with a sub-line like `26 min drive + 10 min buffer` or `12 min drive`.
   - It sits in a green surface with a white `car-side` well.
   - Other-day form: `Leave by Wed 4:48 PM`.
   - Urgency eyebrows: `LEAVE SOON` in orange, `LEAVE NOW` in coral.
4. **Responsibility is a person pill.**
   - Assigned: a green pill with `user`, e.g. `Dana is on this` or `You're on this`.
   - Game Plan rows: `{Name} driving` (sub `Leave by 4:48 PM`) and `{Name} pickup` (sub `At 7:00 PM`).
   - Unassigned is **orange**: `No one assigned yet`, `Not assigned`.
5. **Preparation** appears as `What to bring` with a comma list, e.g. `Cleats, Water bottle, … +N more`, and progress like `3 of 5 packed`, `Almost ready`, `Prep complete`.
6. **Changes** read like `Start time moved to 6:00 PM` or `Moved to Thu · 6:00 PM`, with the detail line `This session · usually 5:30 PM`.
7. **Sibling conflicts** only surface as orange Watchouts copy: `Pickup conflict — two routes within 10 min.`
8. **Child identity** is an initial in a circle tinted with the child's colour (about 15%). Calendar blocks use the child's colour at about 11% with a left rail.
9. **Week** layouts:
   - Home week strip: `M T W T F S S`, with the selected date in a blue-soft rounded square.
   - Calendar: selected date as a navy filled circle, today with a navy ring, header `Sep 28 – Oct 4`.
10. **Time format** (`lib/event-time.ts`): `4:48 PM`; ranges `5:30 – 7:00 PM` with an en dash and spaces, AM/PM dropped from the start when shared; date plus time `Wed, Jul 8 · 5:30 – 7:00 PM`.
11. **Density:** generous. Screen gutter is 16–24 at 1×, card padding 14–18, section gaps 24–32. There is usually one tinted "hero" object per screen and everything else is white or neutral.

## 9. Current marketing visuals

- **No App Store screenshots, launch graphics or social templates exist in the repo.** There is no marketing site either: `src/app/page.tsx` just redirects to `/signup`. `.gstack/design-reports/screenshots/` holds only QA captures.
- The only social asset is the waitlist-era OG card. It is outdated: gradient logo, fallback font, and copy ("calm AI reflections") that no longer matches positioning.
- The closest thing to current "marketing" is the onboarding flow (Sep 9 captures), which states the positioning line verbatim: *"The activity lasts an hour. The coordination lasts all week."* This supports it as the Film 01 end line.
- The share-card and Weekly Recap prototypes (`docs/design-system/prototypes/…Share Card…`) use the warmer `#F7F4EC` paper canvas with Fraunces headlines. That is the product's own "shareable" register and a sensible reference for end cards.

## 10. Conflicts and inconsistencies

**Resolved by the user (2026-09-30):**
- #1: Navy is the brand/action colour for abstract motion and the end card. Real UI keeps its exact screen colours.
- #2: The flat teal Q is current. Never use the gradient Q.
- #3: Film 01 uses the official raster wordmark. An experimental vector trace is in `brand/logo/trace/`, not yet approved.

These are ranked by impact on the film. None were resolved by guessing.

1. **Primary action colour is split.**
   - The token contract says navy is the dominant action and `#1D4ED8` blue is for links and selection only.
   - The Sep 9 onboarding screenshots show **bright blue** full-width CTAs ("Get started", "Continue", "Build my week", "Go to Home").
   - Detail screens use **navy** ("Add activity", "Save automatic time").
   - Film impact: S6–S8 UI must copy whichever screen is shown. The styleframes avoid CTAs entirely. **Decision needed from you.**
2. **Two logo generations are live in the repo.** The flat teal Q (shipped Aug 31 / Sep 1) and the gradient Q (handoff bundle Aug 10, OG image, `actiqo_logo_transparent_v2.png`). I treat flat teal as current. **Please confirm.**
3. **No vector wordmark, and the wordmark typeface is unidentified.** It is a heavy geometric sans, possibly Montserrat-like, but that is unverified. The largest clean raster is 1525 px wide, fine up to about 1500 px in video. **An SVG wordmark is needed for 4K and web-hero uses.**
4. **Canvas colour has three values.**
   - `#FCFAF7` is the current ruling for non-Home screens.
   - `#FAF8F4` is Home.
   - `#F4F1EC` is still described as "the product canvas" in the `base-tokens.ts` header and the handoff readme.
   - The film uses `#FCFAF7`.
5. **Section-label casing.** `base-tokens` binds sentence case, but the handoff readme and the daily-snapshot eyebrows (`LEAVE SOON`, `HAPPENING NOW`) are uppercase and tracked.
6. **Heading font.** `globals.css` `--acti-font-heading` still names SF Pro, and the handoff readme mentions self-hosted SF Pro. `base-tokens.ts` explicitly bans the SF heading stack and calls the CSS vars stale. Fraunces wins.
7. **Icon direction.** The handoff DS calls an extracted HugeIcons-style 1.5px line set "the branded direction". Production ships Font Awesome 7 (mostly solid). The film uses what ships (FA7). A future switch would change the icon feel.
8. **Card radius** is 14 in `tokens.ts` and 16 in `base-tokens.ts`. Film uses 16.
9. **Danger / coral** is `#FB7185` (`coral`) in the spec and `#E11D48` (`alertCoral`, `ACTI_COLOR.danger`) in shipped danger. The icon policy also lists `#2563EB` blue (legacy).
10. **Child avatar font** is DM Sans (`AvatarPicker.tsx`), outside the Inter/Fraunces rule. The film uses Fraunces initials, per `IconCircle`.
11. **Figma variable export** carries `--primary: rgb(67,167,222)` and `--static-font-brand: "Roboto"`. These come from the iOS/Material kit, not ACTIQO. Ignored.
12. **Motion values are fragmented** across 120/200 ms `ease`, a 300 ms view transition, a 320 ms card entrance, a 600 ms breath reveal, and a `v2-complete-pop` with 1.02 overshoot. Reconciled in `ACTIQO_MOTION_SYSTEM.md`.
13. **Emoji leak:** `⚠️ Snacks open` in `UpNextCard.tsx:642` contradicts the icon policy. Not carried into the film.
14. **Missing UI for concepts the film uses.**
    - There is no dedicated "location changed" UI; "Field 4 → 7" follows the `Moved to …` change pattern.
    - There is no dedicated sibling-conflict component, only Watchouts copy.
    - There is no "Needs owner" copy; the product says `No one assigned yet`.

## 11. What carries into motion

- The ivory canvas `#FCFAF7`, navy ink, and white hairline surfaces with the near-invisible soft shadow.
- **Fraunces for the few editorial beats:** day and week titles, and later the end line. **Inter for every operational label.**
- **Semantic colour exactly as the product uses it:**
  - Green means leave-by and assigned or confirmed.
  - Orange means unassigned responsibility, used once, for the pickup.
  - Blue means informational (prep).
  - Neutral well means location.
  - Child colours are identity only.
  - Navy is the one dominant object: the Hour Block.
- Circular tint wells with FA7 glyphs. Sentence-case copy in the product's real phrasings: `Leave by 4:48 PM`, `32 min drive + 10 min buffer`, `Dad driving`, `No one assigned yet`, `What to bring`, `Cleats, shin guards`, `Sep 28 – Oct 4`, `5:30 – 6:30 PM`.
- The calendar block anatomy: child tint plus left rail. The navy selected-date circle.
- Restraint: one tinted hero per view, no gradients, no glass.

## 12. What must NOT carry into motion

- The gradient Q, the waitlist OG styling, and the "calm AI reflections" copy.
- Uppercase tracked eyebrows (`LEAVE SOON`) as a general style. Only use them if a real screen containing them is shown in S6+.
- The coral `LEAVE NOW` pulse ring and any pulsing or "happening now" dot animation. These are alerting UI and would read as alarm in a brand film.
- The `v2-complete-pop` overshoot.
- The iOS liquid-glass and Figma kit variables; Roboto; SF Pro headings.
- Emoji. Bright-blue CTAs until the navy-vs-blue question (§10.1) is decided.
- Invented components that don't exist in the product. S1–S5 stay abstract but speak the product's visual vocabulary.

## 13. Film 01 v01 placeholder choices that are clearly wrong

| v01 placeholder | Why wrong | Styleframe replacement |
|---|---|---|
| Canvas `#EFEFEC` cool grey | Not an ACTIQO value; reads as a wireframe | `#FCFAF7` ivory |
| Ink `#17181B` near-black; Hour Block black | ACTIQO ink is navy `#0B1F3B` | Navy Hour Block, white type |
| Inter 400/700 only, one family | Production is Inter 400/500/600 plus Fraunces 600 for titles; 700 isn't loaded | Fraunces titles, Inter 500/600 UI |
| Grey iMessage-style bubble `#E1E2E4` with tail | Generic messaging UI, no brand | White ACTIQO surface, overlay shadow, 16px "sent" corner, sender line |
| Chips: grey 2px outline, radius 14, text only | ACTIQO chips have circular tint wells, semantic tint surfaces and icons; no grey outlines | Well + FA7 glyph + semantic tint |
| `Leave 4:48` black line across Mon–Wed | Wrong semantics (reads as "now" line) and wrong copy | Green bracket local to Thursday's event, plus a `Leave by 4:48` card |
| Grey threads, straight, uniform | Technical, no meaning | Neutral curve for resolved links, **orange dashed for unresolved**, dot at the origin time |
| 7 AM – 10 PM week grid | 60% empty mornings; tiny blocks | 3 – 7 PM: where coordination actually lives |
| All other events identical grey | Loses who is who | Child-colour tint and rail; Maya and Leo are distinguishable |
| `Maya · 5:15`, `Pickup` with dashed circle, `Grandma? · Tue` | Ambiguous; not product phrasing | `Maya` / `Dance` / `5:15` block; `Thu pickup` / `No one yet`; `Tue pickup` / `Grandma` |
| `$85 due · Fri`, `Snack · Sat`, `Swap carpool? · Mon`, `Early pickup · Wed`, `Traffic +12m` | Filler; cost belongs to a later film | Removed |
| Hour labels 24px `#727479` | Too small at feed size | 26px Inter 500 `#7A869A` |
| No day or week framing | Viewer can't orient | Fraunces `Thursday` / `This week` titles |

**Sample data used in the styleframes:** Dana, Dad, Grandma, Leo, Maya, Field 4 → 7, and the Sep 28 – Oct 4 week. These are film fiction, not production data.
