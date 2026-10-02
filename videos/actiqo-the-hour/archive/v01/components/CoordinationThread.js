/*
 * CoordinationThread: a hairline from an ORIGIN on the time system (an event edge, a time pin,
 * a responsibility) to the chip it explains. It draws outward from the origin; the origin is
 * always a world point, so the thread stays attached through every camera move.
 * An optional origin pin (small dot) marks origins that aren't an event edge (e.g. a deadline).
 */
(function () {
  const AQ = window.AQ;

  AQ.CoordinationThread = function (opts) {
    const line = AQ.el("line", "aq-thread", opts.svg, AQ.SVGNS);
    const pin = opts.pin ? AQ.el("circle", "aq-thread-pin", opts.svg, AQ.SVGNS) : null;
    if (pin) pin.setAttribute("r", "0");
    const thread = { line, pin };

    /** render(p0 screen, p1 screen, draw 0..1, opacity) */
    thread.render = function (p0, p1, draw, opacity) {
      const d = AQ.eases.draw(AQ.clamp01(draw));
      line.setAttribute("x1", AQ.r(p0.x));
      line.setAttribute("y1", AQ.r(p0.y));
      line.setAttribute("x2", AQ.r(AQ.lerp(p0.x, p1.x, d)));
      line.setAttribute("y2", AQ.r(AQ.lerp(p0.y, p1.y, d)));
      line.style.opacity = draw > 0 ? String(opacity == null ? 1 : opacity) : "0";
      if (pin) {
        pin.setAttribute("cx", AQ.r(p0.x));
        pin.setAttribute("cy", AQ.r(p0.y));
        pin.setAttribute("r", AQ.r(5 * AQ.eases.signature(AQ.clamp01(draw * 3))));
      }
    };
    return thread;
  };
})();
