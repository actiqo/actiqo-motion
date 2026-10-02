/*
 * HourBlock: ACTIQO's hero primitive. One calendar event whose geometry IS its duration on
 * the time system (height = hours × HOUR_H in world units). Two variants:
 *   hero  – ink fill, title + time label, soft single-source shadow
 *   muted – eventFill, no label (other events in the week)
 * Labels are laid out at the DESIGN scale (camera s = designScale) and uniformly scaled with
 * the camera, so type never re-flows mid-move.
 *
 * A hero block may adopt a MessageBubble's path and morph from it (see `morph`).
 */
(function () {
  const AQ = window.AQ;

  AQ.HourBlock = function (opts) {
    const T = window.AQ_TOKENS;
    const variant = opts.variant || "muted";
    const world = AQ.time.eventRect(opts.day, opts.start, opts.end);
    const designScale = opts.designScale || 2;
    const path = opts.adoptPath || AQ.el("path", `aq-block aq-block--${variant}`, opts.svg, AQ.SVGNS);
    if (opts.adoptPath) path.setAttribute("class", `aq-block aq-block--${variant}`);

    let label = null, title = null, time = null;
    if (variant === "hero") {
      label = AQ.el("div", "aq-block-label", opts.textLayer);
      title = AQ.el("div", "aq-block-title", label);
      time = AQ.el("div", "aq-block-time", label);
      title.textContent = opts.title;
      time.textContent = opts.time;
    }

    const block = { world, path, label, variant, day: opts.day };

    /**
     * render(cam, st)
     * st.opacity       – whole block
     * st.labelOpacity  – label group (e.g. fade when the camera is too far out)
     * st.title/st.time – label entrance progress 0..1
     * st.morph         – optional { from: bubble, x, y, r, tail, fill } channel progress 0..1
     * Returns the screen rect actually drawn (for clipping text layers).
     */
    block.render = function (cam, st) {
      const target = cam.rect(world);
      const rT = T.radius.hourBlock * cam.s;
      let rect = target, radius = rT, tail = 0, fill;
      const base = variant === "hero" ? T.color.ink : T.color.eventFill;

      if (st.morph) {
        const m = st.morph, B = m.from.rect; // m.from = { rect, radius } (live bubble geometry)
        const L = AQ.lerp(B.x, target.x, m.x);
        const R = AQ.lerp(B.x + B.w, target.x + target.w, m.x);
        const Tp = AQ.lerp(B.y, target.y, m.y);
        const Bt = AQ.lerp(B.y + B.h, target.y + target.h, m.y);
        rect = { x: L, y: Tp, w: R - L, h: Bt - Tp };
        radius = AQ.lerp(m.from.radius, rT, m.r);
        tail = 1 - m.tail;
        fill = AQ.mixColor(T.color.bubbleFill, base, m.fill);
      } else {
        fill = base;
      }

      path.setAttribute("d", AQ.shapePath(rect, radius, tail));
      path.style.fill = fill;
      path.style.opacity = String(st.opacity == null ? 1 : st.opacity);
      if (variant === "hero") {
        // Shadow scales with the camera so a distant block doesn't look heavier than a near one.
        const k = cam.s / designScale;
        const sh = st.shadow == null ? 1 : st.shadow;
        path.style.filter = sh > 0
          ? `drop-shadow(0px ${AQ.r(10 * k)}px ${AQ.r(18 * k)}px rgba(23,24,27,${AQ.r(0.14 * sh)}))`
          : "none";
      }

      if (label) {
        const k = cam.s / designScale;
        const pad = T.space.blockPad * k;
        const lo = st.labelOpacity == null ? 1 : st.labelOpacity;
        label.style.transform =
          `translate(${AQ.r(target.x + pad)}px, ${AQ.r(target.y + pad)}px) scale(${AQ.r(k * 1000) / 1000})`;
        label.style.opacity = String(lo);
        const a = AQ.eases.signature(AQ.clamp01(st.title || 0));
        const b = AQ.eases.signature(AQ.clamp01(st.time || 0));
        title.style.transform = `translateY(${AQ.r(26 * (1 - a))}px)`;
        title.style.opacity = String(a);
        time.style.transform = `translateY(${AQ.r(22 * (1 - b))}px)`;
        time.style.opacity = String(b);
      }
      return rect;
    };
    return block;
  };
})();
