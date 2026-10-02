/*
 * LeaveByTick: the moment the family has to be out the door.
 * A dot on the TimeRuler at the leave time, a hairline drawn across to the event's day column,
 * and a label ("Leave 4:48") at its end. Always derived from (day, hour): it cannot float.
 */
(function () {
  const AQ = window.AQ;

  AQ.LeaveByTick = function (opts) {
    const T = window.AQ_TOKENS, TS = AQ.time;
    const line = AQ.el("line", "aq-leave-line", opts.svg, AQ.SVGNS);
    const dot = AQ.el("div", "aq-leave-dot", opts.rulerLayer);
    const label = AQ.el("div", "aq-leave-label", opts.overlay);
    label.textContent = opts.text;
    const lw = label.getBoundingClientRect().width;
    const lh = label.getBoundingClientRect().height;

    const tick = {
      hour: opts.hour,
      day: opts.day,
      // world point at the column's right edge: where the label attaches
      endWorld: { x: TS.x(opts.day) + TS.COL_W - TS.GUTTER, y: TS.y(opts.hour) },
      startWorld: { x: TS.x(opts.day) + TS.GUTTER, y: TS.y(opts.hour) },
      label, lw, lh,
    };

    /**
     * render(cam, st) st.draw 0..1 (line from ruler → column), st.label 0..1,
     * st.offset {x,y} screen offset of the label from the line end, st.scale label scale.
     */
    tick.render = function (cam, st) {
      const y = cam.y(TS.y(opts.hour));
      const x0 = opts.railX;
      const x1 = cam.x(tick.endWorld.x);
      const d = AQ.eases.draw(AQ.clamp01(st.draw));
      line.setAttribute("x1", AQ.r(x0));
      line.setAttribute("y1", AQ.r(y));
      line.setAttribute("x2", AQ.r(AQ.lerp(x0, x1, d)));
      line.setAttribute("y2", AQ.r(y));
      line.style.opacity = st.draw > 0 ? String(st.lineOpacity == null ? 1 : st.lineOpacity) : "0";
      dot.style.transform = `translate(${AQ.r(x0 - 7)}px, ${AQ.r(y - 7)}px) scale(${AQ.r(AQ.eases.signature(AQ.clamp01(st.draw * 3)))})`;

      const a = AQ.eases.signature(AQ.clamp01(st.label));
      const k = st.scale || 1;
      const ax = x1 + st.offset.x + 10 * (1 - a);
      const ay = y + st.offset.y;
      label.style.transform =
        `translate(${AQ.r(ax)}px, ${AQ.r(ay - lh / 2)}px) scale(${AQ.r(k * 1000) / 1000})`;
      label.style.opacity = String(a);
    };
    return tick;
  };
})();
