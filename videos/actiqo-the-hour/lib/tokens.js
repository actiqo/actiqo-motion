/*
 * ACTIQO tokens for Film 01, as JS (the film interpolates colours and sizes numerically).
 * Mirrors brand/actiqo-motion-tokens.css. Every value is from the production repo; see
 * ACTIQO_BRAND_MOTION_AUDIT.md §3–§7 for sources. k = 2.5 (phone pt → 1080 px frame).
 */
(function () {
  window.AQ_TOKENS = {
    k: 2.5,
    color: {
      canvas: "#FCFAF7", // appCanvas, founder ruling 2026-08-31
      surface: "#FFFFFF",
      hairline: "rgba(11,31,59,0.08)",
      ink: "#0B1F3B", // navy: text, dominant object, primary brand/action colour (Film 01 decision)
      ink2: "#3F4C63",
      ink3: "#7A869A",
      inkMuted: "#A8B0BE",
      inkTint: "rgba(11,31,59,0.06)",
      greenInk: "#0F7A4B", greenSurface: "#DCEFE3", // ready / leave-by / assigned
      orangeInk: "#C2410C", orangeSurface: "#FBEAD9", // unassigned responsibility ONLY
      blueInk: "#1D4ED8", blueSurface: "#E6EEFE", // informational (prep)
      // Child identity: both from production CHILD_COLORS (AddChildModal.tsx:40), rendered with
      // the calendar's exact block formula: fill `${color}1C`, 2.5 px left rail (WeekCalendar.tsx:238).
      childLeo: "#0EA5E9",
      childMaya: "#7C3AED",
    },
    font: {
      ui: "'Inter', system-ui, sans-serif",
      editorial: "'Fraunces', Georgia, serif",
    },
    radius: { surface: 40, overlay: 50, calBlock: 12.5 }, // 16k, 20k, 5k
    shadow: {
      // shadows.soft / shadows.lift, offsets ×k
      surface: "0 2.5px 5px rgba(11,31,59,0.04), 0 10px 30px rgba(11,31,59,0.04)",
      overlayFilter: "drop-shadow(0px 5px 5px rgba(11,31,59,0.05)) drop-shadow(0px 30px 35px rgba(11,31,59,0.08))",
    },
    ease: {
      standard: [0.2, 0, 0, 1], // view transitions
      enter: [0.2, 0.8, 0.2, 1], // ds-fadein card entrance
      breath: [0.4, 0, 0.2, 1], // actiqoBreathIn editorial reveal
      camera: [0.65, 0, 0.35, 1], // film-only pull-back
    },
  };
})();
