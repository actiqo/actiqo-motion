/*
 * MessageBubble: a neutral (unbranded, not iMessage) incoming message.
 * Also owns the shared "bubble ⇄ block" silhouette: a rounded rect whose bottom-left
 * corner can grow a tail (tail = 1) or be a plain arc (tail = 0). HourBlock reuses the
 * same path element so the morph is ONE object changing shape, not a cross-fade.
 */
(function () {
  const AQ = window.AQ;
  const K45 = 0.2652; // cubic handle length for a 45° arc, as a fraction of r
  const D45 = K45 / Math.SQRT2; // its x/y component along the 45° tangent

  /** Silhouette path: rounded rect {x,y,w,h}, radius r, tail amount t ∈ [0,1]. */
  AQ.shapePath = function (rect, r, t) {
    const L = rect.x, T = rect.y, R = rect.x + rect.w, B = rect.y + rect.h;
    r = Math.max(0, Math.min(r, rect.w / 2, rect.h / 2));
    const k = 0.5523 * r;
    const f = AQ.r;
    // bottom-left corner: arc midpoint M0 → blended toward the tail tip
    const M0 = { x: L + r * (1 - Math.SQRT1_2), y: B - r * (1 - Math.SQRT1_2) };
    const tip = { x: L - 0.26 * r, y: B + 0.36 * r };
    const P = { x: AQ.lerp(M0.x, tip.x, t), y: AQ.lerp(M0.y, tip.y, t) };
    const c1 = { x: L + r - AQ.lerp(K45 * r, 0.62 * r, t), y: B };
    const c2 = { x: P.x + AQ.lerp(D45 * r, 0.3 * r, t), y: P.y + AQ.lerp(D45 * r, 0.02 * r, t) };
    const c3 = { x: P.x + AQ.lerp(-D45 * r, 0.12 * r, t), y: P.y + AQ.lerp(-D45 * r, -0.26 * r, t) };
    const c4 = { x: L, y: B - r + AQ.lerp(K45 * r, 0.42 * r, t) };
    return [
      `M${f(L + r)},${f(T)}`,
      `H${f(R - r)}`,
      `C${f(R - r + k)},${f(T)} ${f(R)},${f(T + r - k)} ${f(R)},${f(T + r)}`,
      `V${f(B - r)}`,
      `C${f(R)},${f(B - r + k)} ${f(R - r + k)},${f(B)} ${f(R - r)},${f(B)}`,
      `H${f(L + r)}`,
      `C${f(c1.x)},${f(c1.y)} ${f(c2.x)},${f(c2.y)} ${f(P.x)},${f(P.y)}`,
      `C${f(c3.x)},${f(c3.y)} ${f(c4.x)},${f(c4.y)} ${f(L)},${f(B - r)}`,
      `V${f(T + r)}`,
      `C${f(L)},${f(T + r - k)} ${f(L + r - k)},${f(T)} ${f(L + r)},${f(T)}`,
      "Z",
    ].join(" ");
  };

  /**
   * create({ svg, textLayer, text, x, cy }) → bubble
   * x: left edge (screen px), cy: vertical centre. Geometry is measured once at setup.
   */
  AQ.MessageBubble = function (opts) {
    const T = window.AQ_TOKENS;
    const path = AQ.el("path", "aq-bubble-shape", opts.svg, AQ.SVGNS);
    const text = AQ.el("div", "aq-bubble-text", opts.textLayer);
    text.textContent = opts.text;
    const tw = text.getBoundingClientRect().width; // setup-time measurement only
    const th = T.type.bubble * 1.18;
    const rect = {
      x: opts.x,
      y: opts.cy - (th / 2 + T.space.bubblePadY),
      w: tw + T.space.bubblePadX * 2,
      h: th + T.space.bubblePadY * 2,
    };
    const bubble = { path, text, rect, radius: T.radius.bubble };

    /** Geometry with an optional "lean-in" drift (scale about the bubble centre). */
    bubble.geometry = function (drift) {
      const k = 1 + (drift || 0);
      const cx = rect.x + rect.w / 2, cy = rect.y + rect.h / 2;
      return {
        k,
        radius: bubble.radius * k,
        rect: { x: cx - (rect.w * k) / 2, y: cy - (rect.h * k) / 2, w: rect.w * k, h: rect.h * k },
      };
    };

    /** exit ∈ [0,1] lifts the question out of the shape (the shape itself stays). */
    bubble.renderText = function (exit, drift) {
      const g = bubble.geometry(drift);
      const e = AQ.eases.signature(AQ.clamp01(exit));
      const x = g.rect.x + T.space.bubblePadX * g.k;
      const y = g.rect.y + T.space.bubblePadY * g.k - 52 * e;
      text.style.transform = `translate(${AQ.r(x)}px, ${AQ.r(y)}px) scale(${AQ.r(g.k * 10000) / 10000})`;
      text.style.opacity = String(1 - AQ.clamp01(e * 1.15));
    };
    /** Standalone render (before a morph takes the path over). */
    bubble.render = function (exit, drift) {
      const g = bubble.geometry(drift);
      path.setAttribute("d", AQ.shapePath(g.rect, g.radius, 1));
      path.style.fill = T.color.bubbleFill;
      bubble.renderText(exit || 0, drift);
    };
    return bubble;
  };
})();
