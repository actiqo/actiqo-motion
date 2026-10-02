/* Shared math, easing, shape and DOM helpers for ACTIQO motion. Pure functions only (seek-safe). */
(function () {
  const AQ = (window.AQ = window.AQ || {});

  AQ.lerp = (a, b, t) => a + (b - a) * t;
  AQ.clamp01 = (t) => (t < 0 ? 0 : t > 1 ? 1 : t);
  /** Map v from [a,b] to [0,1], clamped. */
  AQ.range = (v, a, b) => AQ.clamp01((v - a) / (b - a));
  AQ.smooth = (v) => v * v * (3 - 2 * v);
  /** Round to 0.01px: short SVG strings, no sub-pixel shimmer from float noise. */
  AQ.r = (v) => Math.round(v * 100) / 100;

  /** CSS-style cubic-bezier easing (deterministic Newton + bisection solve). */
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
  AQ.lerpRect = (a, b, t) => ({ x: AQ.lerp(a.x, b.x, t), y: AQ.lerp(a.y, b.y, t), w: AQ.lerp(a.w, b.w, t), h: AQ.lerp(a.h, b.h, t) });

  AQ.el = function (tag, cls, parent, ns) {
    const e = ns ? document.createElementNS(ns, tag) : document.createElement(tag);
    if (cls) e.setAttribute("class", cls);
    if (parent) parent.appendChild(e);
    return e;
  };
  AQ.SVGNS = "http://www.w3.org/2000/svg";

  /** Inline one production icon (Font Awesome 7) painting with currentColor. */
  AQ.icon = function (name, size) {
    const g = window.AQ_ICONS[name];
    return `<svg width="${size}" height="${size}" viewBox="${g.vb}" style="display:block"><path fill="currentColor" d="${g.d}"/></svg>`;
  };

  /**
   * Silhouette shared by the message bubble and the Hour Block: rounded rect {x,y,w,h},
   * radius r, and a bottom-left message tail of amount t ∈ [0,1] (0 = plain corner).
   * One path, so the bubble → Hour Block morph is ONE object changing shape.
   */
  const K45 = 0.2652, D45 = K45 / Math.SQRT2;
  AQ.shapePath = function (rect, r, t) {
    const L = rect.x, T = rect.y, R = rect.x + rect.w, B = rect.y + rect.h;
    r = Math.max(0, Math.min(r, rect.w / 2, rect.h / 2));
    const k = 0.5523 * r, f = AQ.r;
    const M0 = { x: L + r * (1 - Math.SQRT1_2), y: B - r * (1 - Math.SQRT1_2) };
    const tip = { x: L - 0.3 * r, y: B + 0.34 * r };
    const P = { x: AQ.lerp(M0.x, tip.x, t), y: AQ.lerp(M0.y, tip.y, t) };
    const c1 = { x: L + r - AQ.lerp(K45 * r, 0.62 * r, t), y: B };
    const c2 = { x: P.x + AQ.lerp(D45 * r, 0.3 * r, t), y: P.y + AQ.lerp(D45 * r, 0.02 * r, t) };
    const c3 = { x: P.x + AQ.lerp(-D45 * r, 0.12 * r, t), y: P.y + AQ.lerp(-D45 * r, -0.26 * r, t) };
    const c4 = { x: L, y: B - r + AQ.lerp(K45 * r, 0.42 * r, t) };
    return [
      `M${f(L + r)},${f(T)}`, `H${f(R - r)}`,
      `C${f(R - r + k)},${f(T)} ${f(R)},${f(T + r - k)} ${f(R)},${f(T + r)}`,
      `V${f(B - r)}`,
      `C${f(R)},${f(B - r + k)} ${f(R - r + k)},${f(B)} ${f(R - r)},${f(B)}`,
      `H${f(L + r)}`,
      `C${f(c1.x)},${f(c1.y)} ${f(c2.x)},${f(c2.y)} ${f(P.x)},${f(P.y)}`,
      `C${f(c3.x)},${f(c3.y)} ${f(c4.x)},${f(c4.y)} ${f(L)},${f(B - r)}`,
      `V${f(T + r)}`,
      `C${f(L)},${f(T + r - k)} ${f(L + r - k)},${f(T)} ${f(L + r)},${f(T)}`, "Z",
    ].join(" ");
  };

  /**
   * A thread: cubic curve from origin to destination, drawn to `progress` ∈ [0,1] by sampling
   * (works identically for solid and dashed strokes). vertical=true bends along y first.
   */
  AQ.curvePoints = function (a, b, progress, vertical) {
    const c1 = vertical ? { x: a.x, y: (a.y + b.y) / 2 } : { x: (a.x + b.x) / 2, y: a.y };
    const c2 = vertical ? { x: b.x, y: (a.y + b.y) / 2 } : { x: (a.x + b.x) / 2, y: b.y };
    const n = 48, pts = [];
    const end = Math.max(0, Math.min(1, progress));
    for (let i = 0; i <= n; i++) {
      const t = (i / n) * end, u = 1 - t;
      pts.push({
        x: u * u * u * a.x + 3 * u * u * t * c1.x + 3 * u * t * t * c2.x + t * t * t * b.x,
        y: u * u * u * a.y + 3 * u * u * t * c1.y + 3 * u * t * t * c2.y + t * t * t * b.y,
      });
    }
    return pts;
  };
  AQ.polyD = (pts) => "M" + pts.map((p) => `${AQ.r(p.x)},${AQ.r(p.y)}`).join(" L");
})();
