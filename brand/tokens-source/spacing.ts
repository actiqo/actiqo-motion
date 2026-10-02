/**
 * src/styles/spacing.ts
 *
 * 4pt grid enum. Every padding / margin / gap in the product should
 * resolve to one of these values. Off-grid numbers (10, 14, 18, 22,
 * 26, 28) drift in over time and break visual rhythm. The canonical
 * scale below is the only acceptable input.
 *
 * Naming: `s4` reads at the call site as "4-point" not "small/medium" —
 * t-shirt sizing collapses too much information when the design needs
 * to express a difference between (say) a 4pt chip pad and a 12pt
 * card pad. Numeric-suffix is the cleanest signal.
 */

export const SPACING = {
  s4:  4,
  s8:  8,
  s12: 12,
  s16: 16,
  s20: 20,
  s24: 24,
  s32: 32,
  s40: 40,
  s56: 56,
  s80: 80,
} as const;

export type SpacingKey = keyof typeof SPACING;

/** Compose a `padding: 'X Y'` style string with type safety. Pass two
 *  spacing keys; the function expands them to `${px} ${px}`. */
export function pad(v: SpacingKey, h: SpacingKey = v): string {
  return `${SPACING[v]}px ${SPACING[h]}px`;
}

/** Three-axis variant: top / horizontal / bottom. */
export function pad3(t: SpacingKey, h: SpacingKey, b: SpacingKey): string {
  return `${SPACING[t]}px ${SPACING[h]}px ${SPACING[b]}px`;
}

/** Four-axis variant for asymmetric layouts. */
export function pad4(t: SpacingKey, r: SpacingKey, b: SpacingKey, l: SpacingKey): string {
  return `${SPACING[t]}px ${SPACING[r]}px ${SPACING[b]}px ${SPACING[l]}px`;
}
