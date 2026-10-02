// src/styles/tokens.ts
// ACTIQO design tokens.
//
// Authoritative source: docs/design-system/24_actiqo_full_redesign.md
// Prototype reference:  docs/design-system/prototypes/actiqo_full/redesign/tokens.js
//
// The earlier launch-refinement rules below (no shadows on product surfaces,
// no gradients, no eyebrows, no ALL CAPS, no letter-spacing) have been
// SUPERSEDED by the full redesign spec. They are retained here as historical
// context only — see AUDIT.md §1b and CHANGES.md §Token conflicts resolved.
//
// Naming policy:
//   • Existing keys (trustBlue, balancedTeal, warmCoralAccent, inkSuccess, etc.,
//     plus all legacy compat aliases below) are retained so 30+ existing
//     consumers stay green.
//   • Spec-named keys (blue, teal, coral, navy, cardSoft, blueSoft,
//     needAction, etc., and the new `radii` and shadow.soft/lift) are added
//     alongside, mapped to identical values, so new code can match the spec
//     verbatim.
//
// Earlier rules (now historical):
//   1. One `display` per screen. One `title` per section.
//   2. One accent color per screen: colors.trustBlue.
//   3. Status = ink color on text. Never a tinted background fill. (Superseded — see needActionBg / successBg.)
//   4. Containers are a last resort — try whitespace + rule dividers first.
//   5. Never nest cards. Never colored card borders (snapshot hero only). (Superseded — accent left-borders allowed per spec.)
//   6. No boxShadow on product surfaces. Ever. (Superseded — `shadows.soft` is the default card shadow.)
//   7. No gradients. No backdrop-blur. No sparkles. (Superseded — see "Since yesterday" gradient.)
//   8. Sentence case. No ALL CAPS eyebrows. No letter-spacing tricks. (Superseded — SectionLabel is uppercase / 0.06em.)

import type React from 'react';

/* ---------- 1. Color ---------- */
export const colors = {
  // Surfaces — spec values.
  page:        '#F4F1EC',                   // warm off-white app background (spec)
  canvas:      '#FAF8F4',                   // secondary canvas (spec, NEW) — Home's released ground
  appCanvas:   '#FCFAF7',                   // FOUNDER RULING 2026-08-31: canonical page canvas for every customer screen except Home (sampled from the approved mocks)
  card:        '#FFFFFF',
  cardSoft:    '#FBF9F5',                   // softer card / readiness panels (spec, NEW)
  cardElev:    '#FFFFFF',                   // for rows-on-surface (legacy)
  hairline:    'rgba(11,31,59,0.08)',       // 1px borders inside cards (spec)
  divider:     'rgba(11,31,59,0.12)',       // between sections (spec)

  // Weekly-recap paper surfaces — warmer off-whites used only on the recap
  // page and share cards. Do not reach for these elsewhere.
  paperSoft:   '#FDFDFB',                   // recap page background
  paperMoment: '#FBFAF6',                   // moment-reflection card
  paperShare:  '#F7F4EC',                   // share card canvas

  // Ink (spec values).
  inkPrimary:   '#0B1F3B',                  // Deep Navy
  inkSecondary: '#3F4C63',
  inkTertiary:  '#7A869A',
  inkMuted:     '#A8B0BE',                  // placeholder, disabled (spec, NEW)

  // Brand accents — production names.
  trustBlue:       '#1D4ED8',               // PRIMARY — CTAs, links, active nav   (spec: blue) [v3 brand: was #2563EB]
  trustBlueHover:  '#1D4ED8',               // (spec: blueHover)
  trustBlueSoft:   '#E6EEFE',               // (spec: blueSoft, NEW)
  balancedTeal:    '#14B8A6',               // completed / ready / positive        (spec: teal)
  balancedTealSoft:'#DDF5F1',               // (spec: tealSoft, NEW)
  warmCoralAccent: '#FB7185',               // insights / highlights / risk emphasis (spec: coral) [v3 brand: renamed from warmCoral]
  warmCoralSoft:   '#FCE5E8',               // (spec: coralSoft, NEW)
  navy:            '#0B1F3B',               // premium emphasis — primary CTA fills, headers (spec, NEW alias of inkPrimary)

  // Spec-named aliases (same values as the production-named keys above) —
  // let new code use spec names without forcing a rename of every existing
  // call site.
  blue:        '#1D4ED8',
  blueHover:   '#1D4ED8',
  blueSoft:    '#E6EEFE',
  teal:        '#14B8A6',
  tealSoft:    '#DDF5F1',
  coral:       '#FB7185',
  coralSoft:   '#FCE5E8',

  // Status (ink on text only — never fills)
  inkSuccess:  '#0F7A4B',
  inkWarning:  '#A05A00',
  inkCritical: '#B4243A',

  // ── Brand v3 status accents ─────────────────────────────────────────────
  // The Daily Snapshot + Weekly View v2 surfaces use these directly.
  // Mapping authority: ACTIQO Brand Guidelines v3 §Color meaning.
  //   successGreen → Mastery (completion / on-track / ready)
  //   warningAmber → Attention (behind pace / watch / log nudge)
  //   alertCoral   → Urgency (overlaps / "Leave now" / errors)
  // (Blue = Action ONLY → trustBlue above; Teal = Momentum → balancedTeal above.)
  successGreen: '#059669',
  warningAmber: '#D97706',
  alertCoral:   '#E11D48',

  // Brand-glyph amber-tone pair (Brand Glyph Set spec). `amberTint` is
  // the chip background; pair with `warningDark` (#92400E) for the
  // foreground glyph stroke. Distinct from `needActionBg` (which is
  // reserved for the "input required" state and shouldn't be overloaded).
  amberTint:   '#F6EBD8',

  // Semantic lilac (visual-foundation F0, founder N-family mocks) — the
  // fourth tint family (green · lilac · blue · orange). Promoted from the
  // approved R7A onboarding accent; never an action color.
  lilac:         '#5B4BB5',
  lilacSoft:     '#EFEBF8',
  // Quiet ink tint — the neutral icon well / back-circle ground (F0).
  inkTint:       'rgba(11,31,59,0.06)',

  // Semantic — input-required state (spec, NEW)
  needAction:    '#C2410C',                 // burnt orange — input required ONLY
  needActionBg:  '#FBEAD9',
  successBg:     '#DCEFE3',

  // Tile tints (Doc 08 — leading-visual blocks on rows)
  tileSand:  '#F1EBE0',
  tileFog:   '#E9ECF2',
  tileMoss:  '#E3EBE4',
  tileDusk:  '#E8E4F0',
  tileShell: '#F2E9E8',

  // Zone dots (snapshot block only)
  zoneLight:    '#94A3B8',
  zoneBalanced: '#14B8A6',
  zoneStacking: '#D97706',
  zoneOverload: '#FB7185',

  white: '#FFFFFF',

  // ── Legacy compat aliases (phase out during Days 3–5 rewrites) ──
  offWhite:          '#FAF8F4',
  deepNavy:          '#0E1A2B',
  primaryBlue:       '#2563EB',
  trustBlueDeep:     '#1E40AF',
  trustBlueLight:    '#EFF6FF',
  trustBlueMid:      '#BFDBFE',
  trustBluePale:     '#DBEAFE',
  balancedTealDark:  '#0F766E',
  balancedTealLight: '#F0FDF9',
  balancedTealMid:   '#99F6E4',
  warmCoralLight:    '#FFF1F2',
  warmCoralMid:      '#FECDD3',
  textPrimary:       '#0E1A2B',
  textSecondary:     '#475569',
  gray50:  '#FAF8F4',
  gray100: '#F1F5F9',
  gray150: '#E5E7EB',
  gray200: '#E2E8F0',
  gray300: '#CBD5E1',
  gray400: '#94A3B8',
  gray500: '#64748B',
  gray600: '#475569',
  gray700: '#334155',
  success:      '#22C55E',
  successLight: '#F0FDF4',
  successMid:   '#BBF7D0',
  successDark:  '#16A34A',
  successDeep:  '#166534',
  warning:      '#C2410C',
  warningLight: '#FFFBEB',
  warningMid:   '#FDE68A',
  warningDark:  '#92400E',
  error:        '#EF4444',
} as const;

/* ---------- 2. Spacing ---------- */
const _spacing = {
  '1':  '4px',
  '2':  '8px',
  '3':  '12px',
  '4':  '16px',
  '6':  '24px',
  '8':  '32px',       // default section gap
  '12': '48px',
  pageH:       '24px',
  sectionGap:  '32px',
  subGap:      '16px',
  cardPadding: '20px 24px',
} as const;
// Intersection with a string-index returning `string | undefined` lets
// call sites that reach for keys not yet in the table (e.g. spacing['5'])
// typecheck cleanly. Runtime behavior is unchanged — missing keys
// remain undefined.
export const spacing: typeof _spacing & Readonly<Record<string, string | undefined>> = _spacing;

/* ---------- 3. Radius ---------- */
// `radius` keeps the existing legacy keys (control / card / full / sm / md /
// lg / xl / badge) at their original values so existing consumers stay
// pixel-stable. The new `radii` export below carries the spec scale (xs:6 /
// sm:10 / md:14 / lg:20 / xl:28 / pill:9999) for new code; do not migrate
// existing call sites in this pass — that would be a visual change blast
// across many surfaces unrelated to the dashboard.
const _radius = {
  control: '10px',    // buttons, inputs, pills
  card:    '14px',
  full:    '9999px',

  // ── Legacy compat (phase out with Days 3–5 rewrites) ──
  sm:    '6px',
  md:    '8px',
  lg:    '10px',
  xl:    '12px',
  badge: '9999px',
} as const;
// Same widening pattern as `spacing` — call sites that use unmapped keys
// (radius['2xl'], radius['4xl']) typecheck without hiding the missing
// values. Runtime returns undefined for those keys, identical to before.
export const radius: typeof _radius & Readonly<Record<string, string | undefined>> = _radius;

// Spec radii — numeric pixel values matching window.A.r in the prototype.
// New components should pull from this, not from `radius`.
export const radii = {
  xs:   6,
  sm:   10,
  md:   14,
  lg:   20,
  xl:   28,
  pill: 9999,
} as const;

/* ---------- 4. Shadows ---------- */
// Earlier rule "no boxShadow on product surfaces" has been superseded by the
// redesign spec. The default card shadow is now `shadows.soft`. `shadows.md`
// and `shadows.modal` are kept as 'none' so legacy code stays pixel-stable.
export const shadows = {
  none:  'none',
  md:    'none',
  modal: 'none',
  // Spec — default card surface shadow.
  soft:  '0 1px 2px rgba(11,31,59,0.04), 0 4px 12px rgba(11,31,59,0.04)',
  // Spec — floating sheets / modals only.
  lift:  '0 2px 4px rgba(11,31,59,0.05), 0 12px 28px rgba(11,31,59,0.08)',
} as const;

/* ---------- 4b. Transitions (legacy compat) ---------- */
export const transition = {
  all:   'all 0.2s ease',
  color: 'color 0.2s ease',
} as const;

/* ---------- 4c. Numeric treatment (Doc 08) ---------- */
// Apply to every metric (score, $/mo, hrs/wk, dates).
export const num: React.CSSProperties = {
  fontFeatureSettings: '"tnum", "ss01"',
  fontVariantNumeric: 'tabular-nums',
};

/* ---------- 5. Typography ---------- */
export const typography = {
  family: {
    sans:  "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    // Editorial serif — reserved for weekly-recap headlines, moment-reflection
    // titles, and share-card headlines. Never used for UI chrome or meta.
    serif: "var(--font-fraunces), 'Fraunces', 'Iowan Old Style', Georgia, serif",
    mono:  "'JetBrains Mono', ui-monospace, monospace",
  },
  size: {
    display:   '56px',   // dashboard score hero
    displaySm: '40px',   // screen openers
    title:     '22px',
    bodyLg:    '17px',   // hero subtext and row titles
    body:      '15px',
    label:     '13px',
    micro:     '11px',

    // ── Legacy compat ──
    xs:   '10px',
    sm:   '11px',
    base: '12px',
    md:   '13px',
    lg:   '14px',
    xl:   '15px',
    '2xl': '16px',
    '3xl': '18px',
    '4xl': '20px',
    '5xl': '22px',
    '6xl': '24px',
    '7xl': '28px',
    '8xl': '32px',
  },
  weight: {
    regular:   400,
    medium:    500,
    semibold:  600,
    // legacy compat
    normal:    400,
    bold:      700,
    extrabold: 800,
    black:     900,
  },
  // ── Legacy compat ──
  bodySize: '14px',
  metaSize: '12px',
  lineHeight: {
    none:    1,
    tight:   1.25,
    snug:    1.375,
    normal:  1.5,
    relaxed: 1.65,
    loose:   1.7,
  },
} as const;

/* ---------- 6. Surfaces ---------- */
export const surfaces = {
  card: {
    background:   colors.card,
    border:       `1px solid ${colors.hairline}`,
    borderRadius: radius.card,
    padding:      spacing.cardPadding,
  } as React.CSSProperties,
  // Doc 08 — holds a stack of rows, no padding (rows pad themselves).
  rowSurface: {
    background:   colors.card,
    border:       `1px solid ${colors.hairline}`,
    borderRadius: radius.card,
    overflow:     'hidden',
  } as React.CSSProperties,
  // Doc 08 — screen opener spacing.
  hero: {
    padding: '40px 0 32px',
  } as React.CSSProperties,
} as const;

/* ---------- 7. Buttons ----------
   Canonical primary CTA — investor-demo readiness pass. Every
   "Save", "Continue", "Get started", "Log how it went" on the demo
   path must feel like the same button:
     height 52, radius 12, bg inkPrimary, text Inter 15 / 600 / white,
     disabled opacity 0.4, active opacity 0.88 + scale(.98) over 80ms.
   The :active behavior lives on the Button primitive (CSS class)
   since inline styles can't express pseudo-classes. */
export const buttons = {
  primary: {
    background: colors.inkPrimary,
    color: colors.white,
    border: 'none',
    borderRadius: 12,
    fontWeight: 600,
    fontSize: 15,
    padding: '0 20px',
    minHeight: 52,
    cursor: 'pointer',
    fontFamily: typography.family.sans,
    transition: 'opacity 80ms ease, transform 80ms ease',
  } as React.CSSProperties,
  secondary: {
    background: 'transparent',
    color: colors.inkPrimary,
    border: `1px solid ${colors.hairline}`,
    borderRadius: radius.control,
    fontWeight: 500,
    fontSize: 15,
    padding: '12px 20px',
    minHeight: 44,
    cursor: 'pointer',
    fontFamily: typography.family.sans,
  } as React.CSSProperties,
  ghost: {
    background: 'transparent',
    color: colors.trustBlue,
    border: 'none',
    padding: 0,
    fontWeight: 500,
    fontSize: 15,
    cursor: 'pointer',
    fontFamily: typography.family.sans,
  } as React.CSSProperties,
} as const;

/* ---------- 8. Type style helpers (import everywhere) ---------- */
export const displayStyle: React.CSSProperties = {
  fontSize: 56, lineHeight: '56px', fontWeight: 500,
  letterSpacing: '-1.6px', color: colors.inkPrimary,
  fontFamily: typography.family.sans,
};
export const displaySmStyle: React.CSSProperties = {
  fontSize: 40, lineHeight: '44px', fontWeight: 500,
  letterSpacing: '-0.8px', color: colors.inkPrimary,
  fontFamily: typography.family.sans,
};
export const titleStyle: React.CSSProperties = {
  fontSize: 22, lineHeight: '28px', fontWeight: 600,
  color: colors.inkPrimary, margin: 0,
  fontFamily: typography.family.sans,
};
export const bodyStyle: React.CSSProperties = {
  fontSize: 15, lineHeight: '22px', fontWeight: 400,
  color: colors.inkSecondary,
  fontFamily: typography.family.sans,
};
export const labelStyle: React.CSSProperties = {
  fontSize: 13, lineHeight: '18px', fontWeight: 500,
  color: colors.inkTertiary, letterSpacing: 0, textTransform: 'none',
  margin: 0, fontFamily: typography.family.sans,
};
export const microStyle: React.CSSProperties = {
  fontSize: 11, lineHeight: '14px', fontWeight: 500,
  color: colors.inkTertiary,
  fontFamily: typography.family.sans,
};
