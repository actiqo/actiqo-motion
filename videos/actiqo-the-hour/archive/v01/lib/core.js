/* Shared math + camera for ACTIQO motion primitives. Pure functions only (seek-safe). */
(function () {
  const AQ = (window.AQ = window.AQ || {});

  AQ.lerp = (a, b, t) => a + (b - a) * t;
  AQ.clamp01 = (t) => (t < 0 ? 0 : t > 1 ? 1 : t);
  /** Map v from [a,b] to [0,1], clamped. */
  AQ.range = (v, a, b) => AQ.clamp01((v - a) / (b - a));

  /** CSS-style cubic-bezier easing function (deterministic Newton + bisection solve). */
  AQ.cubicBezier = function (x1, y1, x2, y2) {
    const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
    const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
    const sx = (t) => ((ax * t + bx) * t + cx) * t;
    const sy = (t) => ((ay * t + by) * t + cy) * t;
    const dx = (t) => (3 * ax * t + 2 * bx) * t + cx;
    return function (x) {
      if (x <= 0) return 0;
      if (x >= 1) return 1;
      let t = x;
      for (let i = 0; i < 8; i++) {
        const e = sx(t) - x;
        if (Math.abs(e) < 1e-6) return sy(t);
        const d = dx(t);
        if (Math.abs(d) < 1e-6) break;
        t -= e / d;
      }
      let lo = 0, hi = 1;
      t = x;
      for (let i = 0; i < 30; i++) {
        const v = sx(t);
        if (Math.abs(v - x) < 1e-6) break;
        if (v < x) lo = t; else hi = t;
        t = (lo + hi) / 2;
      }
      return sy(t);
    };
  };

  /** Named eases from the token file, usable directly as GSAP `ease` functions. */
  AQ.eases = {};
  Object.entries(window.AQ_TOKENS.ease).forEach(([k, p]) => {
    AQ.eases[k] = AQ.cubicBezier(p[0], p[1], p[2], p[3]);
  });

  function hexToRgb(h) {
    const n = parseInt(h.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  AQ.mixColor = function (a, b, t) {
    const A = hexToRgb(a), B = hexToRgb(b);
    const c = A.map((v, i) => Math.round(AQ.lerp(v, B[i], t)));
    return `rgb(${c[0]},${c[1]},${c[2]})`;
  };

  /**
   * Camera: maps WORLD coordinates (the time system) to SCREEN pixels.
   * screen = focusScreen + scale * (world - focusWorld)
   * A pull-back interpolates scale logarithmically so perceived zoom speed is even.
   */
  AQ.Camera = function (focusWorld) {
    const cam = { fx: 0, fy: 0, s: 1, wx: focusWorld.x, wy: focusWorld.y };
    cam.set = function (a, b, q) {
      cam.s = a.s * Math.pow(b.s / a.s, q);
      cam.fx = AQ.lerp(a.fx, b.fx, q);
      cam.fy = AQ.lerp(a.fy, b.fy, q);
      return cam;
    };
    cam.x = (xw) => cam.fx + cam.s * (xw - cam.wx);
    cam.y = (yw) => cam.fy + cam.s * (yw - cam.wy);
    cam.rect = (r) => ({ x: cam.x(r.x), y: cam.y(r.y), w: r.w * cam.s, h: r.h * cam.s });
    return cam;
  };

  /** Create an element with class + optional parent. */
  AQ.el = function (tag, cls, parent, ns) {
    const e = ns ? document.createElementNS(ns, tag) : document.createElement(tag);
    if (cls) e.setAttribute("class", cls);
    if (parent) parent.appendChild(e);
    return e;
  };
  AQ.SVGNS = "http://www.w3.org/2000/svg";

  /** Round to 0.01px: keeps SVG strings short and avoids sub-pixel shimmer from float noise. */
  AQ.r = (v) => Math.round(v * 100) / 100;
})();
