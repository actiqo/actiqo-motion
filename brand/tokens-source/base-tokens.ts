// src/styles/base-tokens.ts
//
// ACTIQO additive semantic token contract — the redesign foundation layer.
//
// SCOPE / INTENT (Phase 1A, per design_handoff_onboarding_v10/
// CODEX_RECONCILED_DIRECTIVE.md — the current canonical governance
// package; see docs/CURRENT_HANDOFF.md for the pointer)
//   This module is the ONLY token source new foundation components
//   (src/components/foundation/*) may consume. Roles are named by PURPOSE
//   (canvas, action primary, confirmed…), never by raw appearance, so a
//   call site states intent and the value can evolve in one place.
//
// ADDITIVE BY DESIGN — DO NOT confuse with the legacy token files.
//   src/styles/tokens.ts stays the frozen compatibility hub for existing
//   screens; src/lib/tokens-v3-costs.ts and the feature-local modules stay
//   untouched. This file only ALIASES stable primitives from tokens.ts
//   (imports change nothing for existing consumers) and adds semantic
//   roles on top. Nothing in production imports this module until a
//   foundation component does, so correcting it is zero-blast.
//
//   The `--acti-*` CSS variables in src/app/globals.css are a STALE manual
//   mirror of an earlier draft of this file. Do not consume them; they are
//   not updated by this contract and will be generated from it in a later,
//   separately approved phase.
//
// TYPE POLICY (binding — founder visual SOT 2026-08-28, N-family mocks)
//   • Inter is the OPERATIONAL default for all interface text.
//   • Fraunces renders through the display / page-title roles
//     (`displayTitle`, `pageTitle`) and the explicit `editorial` roles —
//     never for body, labels, controls or metadata.
//   • Section labels are sentence case (no uppercase / tracking).
//   • No SF / -apple-system heading stack. No bundled prototype fonts.
//
// COLOR POLICY (binding, §5-D/E and directive overrides)
//   • Warm cream #F4F1EC is the product canvas.
//   • Ink navy is the dominant-action color.
//   • Teal is reserved mainly for ready / confirmed / positive status.
//   • Warm burnt-orange attention treatment for unresolved responsibility.
//   • Restrained radii: ~10–12 controls, 14–16 surfaces (§5-H).

import type React from 'react';
import { colors, shadows } from './tokens';

/* ---------- 1. Font families ----------
 * Two axes: operational (Inter — the product default) and editorial
 * (Fraunces — selective, human moments only). The stacks reuse the
 * next/font variables already wired in src/app/layout.tsx.
 */
export const ACTI_FONT_FAMILY = {
  operational: "var(--font-inter), 'Inter', 'Segoe UI', system-ui, sans-serif",
  editorial:   "var(--font-fraunces), 'Fraunces', Georgia, serif",
} as const;

export type ActiFontFamilyKey = keyof typeof ACTI_FONT_FAMILY;

/* ---------- 2. Font weights ---------- */
export const ACTI_WEIGHT = {
  regular:  400,
  medium:   500,
  semibold: 600,
  bold:     700,
} as const;

export type ActiWeightKey = keyof typeof ACTI_WEIGHT;

/* ---------- 3. Typography scale (primitives) ----------
 * Size + line-height pairs; family and weight are separate axes. Line
 * heights are explicit px strings (legacy TYPE convention) so inherited
 * unitless line-heights never distort them.
 */
export interface ActiTypeStep {
  fontSize:   number;
  lineHeight: string;
}

export const ACTI_TYPE = {
  t34: { fontSize: 34, lineHeight: '40px' },
  t32: { fontSize: 32, lineHeight: '37px' },
  t28: { fontSize: 28, lineHeight: '34px' },
  t24: { fontSize: 24, lineHeight: '30px' },
  t22: { fontSize: 22, lineHeight: '28px' },
  t20: { fontSize: 20, lineHeight: '25px' },
  t18: { fontSize: 18, lineHeight: '23px' },
  t17: { fontSize: 17, lineHeight: '24px' },
  t16: { fontSize: 16, lineHeight: '22px' },
  t15: { fontSize: 15, lineHeight: '20px' },
  t14: { fontSize: 14, lineHeight: '19px' },
  t13: { fontSize: 13, lineHeight: '18px' },
  t12: { fontSize: 12, lineHeight: '16px' },
} as const satisfies Record<string, ActiTypeStep>;

export type ActiTypeKey = keyof typeof ACTI_TYPE;

/* ---------- 4. Semantic type roles ----------
 * Purpose-named recipes. Operational roles are Inter; editorial roles are
 * the ONLY sanctioned Fraunces entry point. Color is deliberately absent —
 * tone is a separate axis owned by the Text component.
 */
export interface ActiTypeRole {
  step:          ActiTypeStep;
  family:        string;
  weight:        number;
  letterSpacing?: string;
}

export const ACTI_TYPE_ROLE = {
  // F0 visual foundation (founder N-family SOT) — the canonical screen hierarchy
  displayTitle: { step: ACTI_TYPE.t34, family: ACTI_FONT_FAMILY.editorial,   weight: ACTI_WEIGHT.semibold, letterSpacing: '-0.5px' },   // welcome / hero moments
  pageTitle:    { step: ACTI_TYPE.t28, family: ACTI_FONT_FAMILY.editorial,   weight: ACTI_WEIGHT.semibold, letterSpacing: '-0.5px' },   // root page title
  detailTitle:  { step: ACTI_TYPE.t22, family: ACTI_FONT_FAMILY.editorial,   weight: ACTI_WEIGHT.semibold, letterSpacing: '-0.5px' },   // pushed / detail page title (centered, compact)
  subtitle:     { step: ACTI_TYPE.t17, family: ACTI_FONT_FAMILY.operational, weight: ACTI_WEIGHT.regular },                             // page subtitle under the title
  sectionLabel: { step: ACTI_TYPE.t15, family: ACTI_FONT_FAMILY.operational, weight: ACTI_WEIGHT.semibold },                            // sentence-case section label
  supporting:   { step: ACTI_TYPE.t14, family: ACTI_FONT_FAMILY.operational, weight: ACTI_WEIGHT.regular },                             // supporting / meta line under a row title
  // Operational (Inter)
  screenTitle:  { step: ACTI_TYPE.t24, family: ACTI_FONT_FAMILY.operational, weight: ACTI_WEIGHT.semibold, letterSpacing: '-0.01em' },
  sectionTitle: { step: ACTI_TYPE.t18, family: ACTI_FONT_FAMILY.operational, weight: ACTI_WEIGHT.semibold },
  body:         { step: ACTI_TYPE.t16, family: ACTI_FONT_FAMILY.operational, weight: ACTI_WEIGHT.regular },
  bodyStrong:   { step: ACTI_TYPE.t16, family: ACTI_FONT_FAMILY.operational, weight: ACTI_WEIGHT.semibold },
  label:        { step: ACTI_TYPE.t14, family: ACTI_FONT_FAMILY.operational, weight: ACTI_WEIGHT.medium },
  metadata:     { step: ACTI_TYPE.t12, family: ACTI_FONT_FAMILY.operational, weight: ACTI_WEIGHT.regular },
  // Editorial (Fraunces — selective human moments only)
  editorialTitle: { step: ACTI_TYPE.t28, family: ACTI_FONT_FAMILY.editorial, weight: ACTI_WEIGHT.semibold, letterSpacing: '-0.01em' },
  editorialBody:  { step: ACTI_TYPE.t18, family: ACTI_FONT_FAMILY.editorial, weight: ACTI_WEIGHT.regular },
} as const satisfies Record<string, ActiTypeRole>;

export type ActiTypeRoleKey = keyof typeof ACTI_TYPE_ROLE;

/* ---------- 5. Spacing scale ----------
 * Full 4px grid, 4 → 64. Keyed by px value.
 */
export const ACTI_SPACE = {
  space4:  4,
  space8:  8,
  space12: 12,
  space16: 16,
  space20: 20,
  space24: 24,
  space28: 28,
  space32: 32,
  space36: 36,
  space40: 40,
  space44: 44,
  space48: 48,
  space52: 52,
  space56: 56,
  space60: 60,
  space64: 64,
} as const;

export type ActiSpaceKey = keyof typeof ACTI_SPACE;

/* ---------- 6. Radius roles ----------
 * Restrained by decision §5-H: controls ~10–12, surfaces 14–16. `full` is
 * for genuinely circular elements (avatars, progress dots) only — never a
 * default pill treatment for buttons or inputs.
 */
export const ACTI_RADIUS = {
  control: 10,
  field:   12,
  /** F0 — the mock's primary / outline action radius (56px CTA, r12). */
  action:  12,
  surface: 16,
  overlay: 20,
  full:    9999,
} as const;

export type ActiRadiusKey = keyof typeof ACTI_RADIUS;

/* ---------- 7. Semantic color roles ----------
 * Purpose-named. Values alias the stable primitives in src/styles/tokens.ts
 * (frozen compatibility hub) so the two layers cannot drift while it is
 * frozen. Styling must never be the only carrier of plan, readiness, or
 * permission truth — callers pass facts, roles only present them.
 */
export const ACTI_COLOR = {
  // Canvas + surfaces
  canvas:          colors.page,          // #F4F1EC warm cream — RETIRED as a page ground on non-Home screens (founder ruling 2026-08-31); kept for Home's Weekly view + legacy tints
  pageCanvas:      colors.canvas,        // #FAF8F4 — HOME's released page ground (F0 N-family). Home only: new/non-Home screens use appCanvas
  appCanvas:       colors.appCanvas,     // #FCFAF7 light warm ivory — the canonical page canvas behind content on EVERY customer screen except Home (founder ruling 2026-08-31). Cards/sheets/modals keep their own surfaces
  surface:         colors.card,          // primary card / sheet surface
  surfaceSoft:     colors.cardSoft,      // quiet grouping surface
  hairline:        colors.hairline,      // 1px borders inside surfaces
  divider:         colors.divider,       // between sections

  // Ink
  textPrimary:     colors.inkPrimary,    // #0B1F3B deep ink navy
  textSecondary:   colors.inkSecondary,
  textTertiary:    colors.inkTertiary,
  textDisabled:    colors.inkMuted,
  textInverse:     colors.white,

  // Actions
  actionPrimary:     colors.navy,        // ink navy — the dominant action
  actionPrimaryText: colors.white,
  link:              colors.trustBlue,   // links / selection
  selectionSoft:     colors.blueSoft,

  // Status (semantic, not decorative)
  confirmed:       colors.balancedTeal,  // ready / confirmed / positive ONLY
  confirmedSoft:   colors.balancedTealSoft,
  attention:       colors.needAction,    // unresolved responsibility / input required
  attentionSoft:   colors.needActionBg,
  danger:          colors.alertCoral,    // destructive / real risk
  dangerSoft:      colors.warmCoralSoft,

  // Focus + disabled
  focusRing:       colors.trustBlue,
  disabledSurface: colors.gray150,
} as const;

export type ActiColorKey = keyof typeof ACTI_COLOR;

/* ---------- 7b. Semantic tint families (F0) ----------
 * The founder N-family mocks use exactly four tinted treatments — green ·
 * lilac · blue · orange — for icon wells, informational cards and pills.
 * Each family is an ink (glyph / text) plus a subtle surface. `navy` is the
 * inverse well (owner / brand circle) and `neutral` the quiet well. These
 * are semantic surfaces, NOT action colors: the only action color is navy.
 */
export const ACTI_TINT = {
  green:   { ink: colors.inkSuccess, surface: colors.successBg },     // ready / positive / child
  lilac:   { ink: colors.lilac,      surface: colors.lilacSoft },     // family / optional / editorial accent
  blue:    { ink: colors.trustBlue,  surface: colors.blueSoft },      // informational / tip
  orange:  { ink: colors.needAction, surface: colors.needActionBg },  // attention / input required
  navy:    { ink: colors.white,      surface: colors.navy },          // inverse well (owner / brand)
  neutral: { ink: colors.inkPrimary, surface: colors.inkTint },       // quiet well (visible on card AND page canvas)
} as const;

export type ActiTintKey = keyof typeof ACTI_TINT;
/** The four semantic families callers may choose for cards / pills. */
export type ActiSemanticTint = 'green' | 'lilac' | 'blue' | 'orange';

/* ---------- 7c. Icon wells (F0) ----------
 * Circular tinted icon wells: 40 (row leading), 44 (card leading), 56
 * (onboarding / hero rows). Always circular; content is an outline glyph
 * or an initial — never emoji, never a square tile.
 */
export const ACTI_ICON_WELL = { sm: 40, md: 44, lg: 56 } as const;
export type ActiIconWellKey = keyof typeof ACTI_ICON_WELL;

/* ---------- 8. Shadow roles ---------- */
export const ACTI_SHADOW = {
  none:    'none',
  surface: shadows.soft,   // default card surface
  overlay: shadows.lift,   // floating sheets / overlays only
} as const;

export type ActiShadowKey = keyof typeof ACTI_SHADOW;

/* ---------- 9. Motion roles ----------
 * Finite, restrained. `actiPrefersReducedMotion()` is SSR-safe; use
 * `actiTransition()` so foundation components automatically drop
 * transitions when the user asks for reduced motion.
 */
export const ACTI_MOTION = {
  durationFastMs: 120,
  durationBaseMs: 200,
  easing:         'ease',
} as const;

export function actiPrefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function actiTransition(
  properties: string[] = ['all'],
  durationMs: number = ACTI_MOTION.durationBaseMs,
): string {
  if (actiPrefersReducedMotion()) return 'none';
  return properties
    .map((p) => `${p} ${durationMs}ms ${ACTI_MOTION.easing}`)
    .join(', ');
}

/* ---------- 10. Numeric treatment ----------
 * Tabular numerals for metrics (times, money, counts) so columns align.
 */
export const ACTI_NUM: React.CSSProperties = {
  fontVariantNumeric: 'tabular-nums',
  fontFeatureSettings: '"tnum"',
};

/* ---------- 11. Hit targets ---------- */
export const ACTI_MIN_HIT_TARGET = 44;

/* ---------- 12. Composers ---------- */
export function actiText(
  step: ActiTypeStep,
  family: string = ACTI_FONT_FAMILY.operational,
  weight: number = ACTI_WEIGHT.regular,
): React.CSSProperties {
  return {
    fontSize:   step.fontSize,
    lineHeight: step.lineHeight,
    fontFamily: family,
    fontWeight: weight,
  };
}

/** Complete style fragment for a semantic type role. */
export function actiTextRole(role: ActiTypeRoleKey): React.CSSProperties {
  const r: ActiTypeRole = ACTI_TYPE_ROLE[role];
  return {
    fontSize:      r.step.fontSize,
    lineHeight:    r.step.lineHeight,
    fontFamily:    r.family,
    fontWeight:    r.weight,
    ...(r.letterSpacing ? { letterSpacing: r.letterSpacing } : null),
  };
}
