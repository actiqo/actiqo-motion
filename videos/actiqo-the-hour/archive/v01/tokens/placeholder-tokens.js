/*
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  PLACEHOLDER DESIGN TOKENS: TEMPORARY, NOT THE ACTIQO BRAND           ║
 * ║                                                                      ║
 * ║  Every colour, typeface, radius, shadow and spacing value used by    ║
 * ║  the film lives here and ONLY here. They are neutral stand-ins so     ║
 * ║  motion, timing and hierarchy can be judged before ACTIQO's real     ║
 * ║  brand system is supplied.                                           ║
 * ║                                                                      ║
 * ║  To apply the real brand: replace this file with an                  ║
 * ║  `actiqo-tokens.js` exposing the same shape, and change the one      ║
 * ║  <script> tag in index.html. No component hard-codes a style value.  ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */
(function () {
  const T = {
    status: "PLACEHOLDER",

    color: {
      paper: "#EFEFEC", // canvas
      surface: "#F9F9F7", // chip fill
      ink: "#17181B", // primary text, Hour Block fill
      ink2: "#55575C", // secondary text
      ink3: "#727479", // tertiary / ruler labels
      hairline: "#B9BBBF", // threads, chip borders
      grid: "#DCDDDF", // calendar grid lines
      eventFill: "#D9DADC", // other (muted) events
      bubbleFill: "#E1E2E4", // message bubble
      onInk: "#F4F4F2", // text on the Hour Block
      onInk2: "#B4B6BA", // secondary text on the Hour Block
      accent: "#17181B", // PLACEHOLDER: reserved for S6 clarity moment; deliberately = ink (no colour yet)
    },

    type: {
      family: "Inter", // PLACEHOLDER neutral grotesk (pre-bundled by HyperFrames, 400/700 only)
      weightRegular: 400,
      weightBold: 700,
      tracking: "-0.02em",
      trackingDisplay: "-0.03em",
      // sizes in screen px at 1080×1920
      bubble: 64,
      blockTitle: 44, // Hour Block title at day scale
      blockTime: 32,
      chip: 30,
      leaveBy: 32,
      ruler: 24,
      dayHeader: 24,
    },

    radius: {
      bubble: 50,
      hourBlock: 14, // WORLD units (scales with the camera)
      chip: 14,
      monogram: 999,
    },

    shadow: {
      // single soft source, used only on the Hour Block/bubble
      hourBlock: "drop-shadow(0px 10px 18px rgba(23,24,27,0.14))",
    },

    stroke: {
      thread: 2,
      chipBorder: 2,
      grid: 1.5,
      leaveBy: 3,
    },

    space: {
      safeTop: 250, // Reels/TikTok top UI
      safeBottom: 1570, // content should stay above this y
      safeSide: 60,
      chipPadX: 20,
      chipPadY: 12,
      chipGap: 12,
      blockPad: 26, // WORLD units x day scale → screen
      bubblePadX: 46,
      bubblePadY: 34,
    },

    // Motion vocabulary (cubic-bezier control points)
    ease: {
      signature: [0.2, 0.0, 0.0, 1.0], // fast departure, long settle
      pull: [0.4, 0.0, 0.2, 1.0], // hero camera: gentle start, long even settle (scale is log-interpolated)
      chaos: [0.3, 0.0, 0.35, 1.0], // stiffer, less settled (pre-ACTIQO disorder)
      draw: [0.45, 0.0, 0.25, 1.0], // hairline draw-on
    },
  };

  window.AQ_TOKENS = T;

  // Mirror colours/type into CSS custom properties so stylesheets never hard-code values.
  const root = document.documentElement.style;
  Object.entries(T.color).forEach(([k, v]) => root.setProperty(`--aq-${k}`, v));
  root.setProperty("--aq-font", `"${T.type.family}", ui-sans-serif, system-ui, sans-serif`);
  root.setProperty("--aq-tracking", T.type.tracking);
  root.setProperty("--aq-tracking-display", T.type.trackingDisplay);
})();
