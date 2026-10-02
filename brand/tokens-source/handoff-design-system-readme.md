# ACTIQO Design System

ACTIQO is a family activity intelligence and coordination app for parents managing children's extracurricular activities — preparation, pickup/drop-off responsibility, caregiver confirmations, reminders, expenses, lightweight post-activity check-ins, and insights earned from real family data. The product is a **calm family command center**: What needs my attention? Are we ready? Who's responsible? How did it go?

It should never feel like a generic SaaS dashboard, a project-management tool, a children's game, or a loud productivity app. Premium quality comes from hierarchy, spacing, restraint, and calm semantic color.

## Sources
- **Figma**: "ACTIQO (Copy) (Copy).fig" — the Branding page (typography, colors, spacing/radius, 3D illustrations, icon set, and the full component inventory). Canonical for IA, screen structure, states, and component values.
- **GitHub**: [actiqo/actiqo](https://github.com/actiqo/actiqo) — production Next.js app. Canonical token sources: `src/styles/tokens.ts`, `typography.ts`, `spacing.ts`, `base-tokens.ts`, `src/app/globals.css`; redesign spec `docs/design-system/24_actiqo_full_redesign.md`; copy rules `docs/design-system/05_copy.md`; screen prototypes `docs/design-system/prototypes/actiqo_full/redesign/`. Explore these for deeper context when designing new surfaces.
- **Uploads**: wordmark PNGs (`uploads/logo.png`, `actiqo-logo-white.png`) and the Q app-icon mark (`unnamed.jpeg`) — copied into `assets/logo/`.

## Product model (design against this)
- An **Activity** is a recurring template (Soccer Practice); an **Occurrence** is one scheduled instance. Statuses (Preparing, Ready, In Progress, Completed, Missed, Check-In Logged) belong to occurrences.
- Occurrence lifecycle: **Prepare → Confirm Ready → Log Check-In → Check-In Logged**. Render it as progress, never as a free tab control; future stages look unavailable.
- A complete checklist never auto-confirms readiness. **Confirm Anyway** is allowed with incomplete items; save who confirmed, when, and how many items were complete.
- Check-in choices: **Great · Okay · Rough · Didn't Happen** (emoji may support, never replace, the labels). One choice + optional note.
- **Data trust**: never invent scores, trends, totals, percentages, or AI summaries. Every populated value traces to real saved records; examples are unmistakably labeled. Subscription access and data availability are separate gates.
- Plans: **Free** (limited, "me manage") · **Plus** (cost tracking, history, earned insights) · **Family** (assign another adult, caregiver confirmation, reminders — "us coordinate"). 7-day Family trial, no card, falls back to Free. Free shows a locked Cost preview with **See Plans**.
- Navigation (approved IA): **Home · Activities · Children · Cost · Settings**.

## CONTENT FUNDAMENTALS
Tone: calm · human · observant · confident. Plain parent language.
- Sentence case everywhere (SectionLabel eyebrows are the one uppercase exception). Zero exclamation marks. No emoji in product copy.
- CTAs are one verb, 1–3 words: "Save", "Add activity", "Log Check-In", "See Plans", "Not now".
- Name the activity, the kid, and a number: "Soccer is going well for Emma." "Three activities need a check-in." Concrete > poetic.
- Errors describe, never apologize: "That didn't go through. Try again." Success is terse: "Saved."
- Numbers 1–10 as words in prose; digits for data. Bold the data, not the prose.
- Banned vocabulary: "unlock insights", "optimize", "leverage", "awesome", "oops", "let's", "we noticed", "sharpen", "taking shape", "strong signal", "coming soon", "You've got this".
- The full before/after copy dictionary lives in the repo at `docs/design-system/05_copy.md`.

## VISUAL FOUNDATIONS
- **Canvas**: warm cream `#F4F1EC` page; white cards; `#FBF9F5` soft inset panels; warmer paper tints (`#FDFDFB`/`#F7F4EC`) reserved for recap/share surfaces. No gradients except the subtle blue-tinted "Since yesterday" card.
- **Ink**: navy `#0B1F3B` primary text (also the premium CTA fill), `#3F4C63` secondary, `#7A869A` tertiary/meta, `#A8B0BE` placeholder/disabled.
- **Color meaning (non-negotiable)**: blue `#1D4ED8` = primary action only · teal `#14B8A6` = ready/completed/positive · burnt orange `#C2410C` = input required only (3px left-border accent or small pill) · coral `#FB7185` = true risk, sparingly · navy = premium emphasis. Status usually reads as ink on text, not background fills. Don't introduce other colors.
- **Type**: Inter for all operational UI (13/13.5/14 body, 11–12 meta, 22/600 page headers); Fraunces serif only for editorial/emotional moments (greeting, "Up next" hero, recap headlines, 22–32/500, −0.02em); SF Pro (system, via -apple-system) on iOS-kit chrome. Tabular numerals on every metric.
- **Section labels**: 11–12px / 600 / uppercase / 0.06em, ink-tertiary, optional right-aligned blue action link.
- **Cards**: white, radius 14, `0.5px solid rgba(11,31,59,0.08)` hairline, shadow `soft` (`0 1px 2px …04, 0 4px 12px …04`); `lift` only on floating sheets. Accent = 3px left border. Never nest gray boxes in gray boxes.
- **Radii**: 6 / 10 (controls) / 14 (cards) / 20 / 28 / pill. Figma branding board also names 12/15/24/50/100.
- **Spacing**: 4px grid; screen pad 16, card pad 14–18, tight gaps 8–12, sectional 16–32.
- **Buttons**: primary = navy fill, radius 12, min-height 52, Inter 15/600 white, disabled opacity 0.4, active opacity .88 + scale(.98) over 80ms; secondary = hairline outline; tertiary/ghost = blue text. One dominant action per screen. No giant pills everywhere.
- **Motion**: calm — 300ms cubic-bezier(0.2,0,0,1) view transitions, 600ms "breath" reveal for one-sentence editorial moments, full `prefers-reduced-motion` fallbacks.
- **Hover/press**: opacity/darken shifts, never bounces. Focus: 2px solid blue outline, offset 2 (keyboard only).
- **Imagery**: warm 3D-rendered family/activity illustrations (bitmaps in `components/brand/assets/` — never redraw); photos warm-toned.
- **Accessibility**: WCAG 2.2 AA, 44px min targets, color never the only signal, visible focus, reduced-motion/transparency support.

## ICONOGRAPHY
- Product icons are a **HugeIcons-style 24×24 line set, ~1.5px stroke, round caps** extracted from the Figma file into `assets/icons/icon-data.js` — render via `<Icon name="Calendar03" size={20}/>` (names in `assets/icons/Icon.d.ts`). Icons paint with `currentColor`.
- Duotone/filled activity glyphs (`Activity`, `Football`, `Zeppelin`) and nav-state variants (`HomeProperty1Bold`) come from the same file.
- Production web uses Font Awesome classes (`fa-regular fa-calendar`) — in this design system prefer the extracted set; it is the branded direction.
- No emoji as icons. Icons carry text labels unless meaning is obvious. The repo's `docs/iconpolicy.md` governs production usage.
- Logo: use `assets/logo/actiqo-wordmark.png` (navy on light), `actiqo-wordmark-white.png` (on navy), `actiqo-mark-q.jpeg` / `actiqo-icon.png` (Q mark). Never redraw the mark; at small sizes prefer the wordmark asset over typed text.

## Index
- `styles.css` — global entry (imports everything below)
- `tokens/` — `colors.css`, `typography.css`, `spacing.css`, `fig-tokens.css` (Figma Variables incl. iOS-kit modes)
- `assets/logo/`, `assets/images/`, `assets/icons/` (icon set + `Icon` component)
- `components/controls/` — buttons, inputs, toggles
- `components/cards/` — hero cards, activity/cost/event sections
- `components/navigation/` — bottom nav, segmented control
- `components/ios/` — Apple iOS 26 library pieces the frames use
- `components/brand/` — logo, splash, illustrations
- `guidelines/` — foundation specimen cards
- `ui_kits/actiqo-app/` — interactive Home / Activity Detail / Cost recreation
- `SKILL.md` — agent skill entry point

## Components
**Controls**: Buttons (primary / primary small / secondary / variant4), IconButton, Switch, CheckmarkCircle01 (tick/untick), CheckmarkCircle012 (selected/unsel), Component1 (check option row), InputField, InputField2, TestField (label/OTP field), Dropdown, Popup, ButtonsUpload, PreviewPhoto, TextMessage, ChildCard2, SmallB, Frame (progress dots), ArrowRight, ArrowUp01, ArrowUp012, Delete03, Edit02, Eye, Notification01, VuesaxLinearAdd.
**Cards & sections**: SectionHeroCardNeedsAttention, HeroCardSoccerPracticeReady, ResponsibilityCard, ActivityCard13, ActivityHealth, Metrics, Component8 (metric tiles), Component9, Component10, Component11, Component12, UpcomingEvent, TravelReminders, SectionSnackRotation, Checklist, Calender, Time, Tab, TabItem, Cost, Cost2, Enpense, Payment, PaymentCard, ReceiptUploaded, ProfileUpload, PP7Edit, Notification, Bannar, Tooltip, AI, OverlayShadow, ProgressDotsGroup, Frame, Frame2, Cpu.
**Navigation**: Bottom (home/activities/children/cost/settings), SegmentedControl (2–5 segments), MoreVertical, Home.
**iOS kit**: ButtonBack, ButtonSymbol, ButtonText, ButtonsTop, ContentsDisclosure, DateAndTimeCollapsed, Decrement, Increment, EditButtonsLight, Grabber, HomeIndicator, IPhone17Pro, ImagesRegular, ImagesTall, LiquidGlassRegularSmall, MenuIndicator, Row, RowButton, ScrollEdgeEffectSoft, Separator, StatusBarIPhone, Stepper, SubtitleSubheadline, TitleLargeTitle, ToggleSwitch, Trailing.
**Brand**: Logo2, Splash, IllustrationActivities, ChildrenIllustration, Illustration, IllustrationEmpty, MomentGallery, Item, Activity, Football, Zeppelin.
**Icons**: Icon (52 glyphs — see `assets/icons/Icon.d.ts`).

Component names mirror the Figma layer names verbatim (including quirks like "Bannar", "Enpense", "Calender", numbered "Component N" sets) so designers can match them to the file. `ArrowUp012` / `CheckmarkCircle012` are the file's *second* component sets that reuse the names "arrow-up-01" / "checkmark-circle-01" — intentional, not inventions.

## Intentional additions
- `ArrowUp012` and `CheckmarkCircle012` — the Figma file defines *two* component sets each named "arrow-up-01" and "checkmark-circle-01"; the `…2` suffix disambiguates the second set. Both are from the kit, not inventions.
- `Icon` (`assets/icons/`) — wrapper over the kit's extracted icon glyph data.

## Notes & caveats
- **SF Pro Display** is self-hosted from uploaded OTFs (`fonts/`, wired in `tokens/fonts.css`; upright 400/500/700 + italic 100–900 minus regular italic). SF Pro *Text* still falls back through `-apple-system`. Inter and Fraunces load from Google Fonts.
- The Figma file's SVG wordmark isn't vector-extractable; the PNG uploads are canonical logo assets.
- Production still carries legacy tokens (`gray50–950`, old radii); this system encodes the redesign spec, which supersedes them.
