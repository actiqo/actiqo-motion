/**
 * src/styles/typography.ts
 *
 * Six-token type scale + family stack. The canonical source for every
 * fontSize / fontFamily reference in the product. Surfaces that import
 * from here should NOT hardcode numeric sizes alongside the import —
 * the scale is the contract.
 *
 * Scale rationale:
 *   - caption  (11) — eyebrow, footnote, dismiss-hint italic
 *   - body     (13) — default body text, list rows, secondary copy
 *   - bodyLg   (15) — primary CTA labels, dense form input text
 *   - headline (22) — section H1/H2 (settings sections, simple page titles)
 *   - title    (28) — flagship page titles (signup hero, /insights hero,
 *                     pattern-unlock sentence, MinimalSetup hero)
 *   - display  (36) — dashboard "Caught up." class, monthly recap title
 *
 * Line heights are paired with each size — using them as a unit
 * prevents the "size set, lineHeight forgotten" drift that plagues
 * the codebase today (886 raw 13s, 662 raw 12s).
 *
 * Families:
 *   - serif (Fraunces)  — headlines, voice-line moments, italic asides
 *   - sans  (Inter)     — body text, UI chrome, controls
 *   - mono              — code-like numeric runs that should NOT use
 *                         tabular-nums (rare; most numeric uses prefer
 *                         sans + tabular-nums via NUMERIC below)
 *
 * `NUMERIC` is a one-liner spread that flips on tabular-nums for any
 * surface rendering numbers — costs, scores, counts, streaks. Use it
 * inline rather than handcrafting `fontVariantNumeric` strings.
 */

export const FONT_FAMILY = {
  serif: "var(--font-fraunces), 'Fraunces', Georgia, serif",
  sans:  "var(--font-inter), 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  mono:  "ui-monospace, SFMono-Regular, Menlo, Monaco, 'Cascadia Mono', monospace",
} as const;

export interface TypeStep {
  fontSize:   number;
  lineHeight: string;
  /** Suggested tracking — set to undefined when 0 is fine (most body). */
  letterSpacing?: string;
}

/** Six-token scale. Pick the closest step; never hardcode a number. */
export const TYPE = {
  caption:  { fontSize: 11, lineHeight: '15px', letterSpacing: '0.2px' },
  body:     { fontSize: 13, lineHeight: '18px' },
  bodyLg:   { fontSize: 15, lineHeight: '22px', letterSpacing: '-0.1px' },
  headline: { fontSize: 22, lineHeight: '28px', letterSpacing: '-0.3px' },
  title:    { fontSize: 28, lineHeight: '34px', letterSpacing: '-0.4px' },
  display:  { fontSize: 36, lineHeight: '42px', letterSpacing: '-0.6px' },
} as const satisfies Record<string, TypeStep>;

export type TypeKey = keyof typeof TYPE;

/**
 * Spread into a numeric display's style object so digit widths line up
 * across the row. Always pair with sans family — Fraunces ligatures
 * fight tabular-nums and produce uneven runs.
 */
export const NUMERIC = {
  fontVariantNumeric: 'tabular-nums' as const,
  fontFeatureSettings: '"tnum"',
};

/**
 * Convenience composer — `text(TYPE.headline, FONT_FAMILY.serif)` produces
 * a complete style fragment. Useful when the call site doesn't want to
 * hand-merge tokens.
 */
export function text(step: TypeStep, family: string = FONT_FAMILY.sans): React.CSSProperties {
  return {
    fontSize:      step.fontSize,
    lineHeight:    step.lineHeight,
    letterSpacing: step.letterSpacing,
    fontFamily:    family,
  };
}
