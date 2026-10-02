/*
 * TimeRuler: the vertical time axis. Screen-anchored on x (a sticky left rail, like a
 * calendar app), world-projected on y. Labels stay at a constant, legible size at every camera
 * scale; half-hour ticks only exist when there is room for them.
 */
(function () {
  const AQ = window.AQ;

  AQ.TimeRuler = function (opts) {
    const T = window.AQ_TOKENS, TS = AQ.time;
    const railX = opts.railX; // screen x of the rule line
    const rail = AQ.el("div", "aq-ruler", opts.layer);
    rail.style.width = `${railX}px`;
    const line = AQ.el("div", "aq-ruler-line", rail);
    line.style.left = `${railX - 2}px`;

    const labels = [], ticks = [];
    for (let h = TS.START_H; h <= TS.END_H; h++) {
      const l = AQ.el("div", "aq-ruler-label", rail);
      l.textContent = TS.label(h);
      l.setAttribute("data-layout-allow-overflow", ""); // hours scroll past the frame with the camera
      l.style.right = `${22}px`;
      labels.push({ h, el: l });
      const tk = AQ.el("div", "aq-ruler-tick", rail);
      tk.style.left = `${railX - 14}px`;
      ticks.push({ h, el: tk, major: true });
      if (h < TS.END_H) {
        const hk = AQ.el("div", "aq-ruler-tick aq-ruler-tick--minor", rail);
        hk.style.left = `${railX - 9}px`;
        ticks.push({ h: h + 0.5, el: hk, major: false });
      }
    }

    const ruler = { railX, el: rail };
    /** render(cam, st) st.opacity, st.minor (half-hour tick visibility), st.labelIn (0..1 stagger) */
    ruler.render = function (cam, st) {
      rail.style.opacity = String(st.opacity);
      const lh = T.type.ruler * 1.2;
      labels.forEach((o, i) => {
        const y = cam.y(TS.y(o.h));
        o.el.style.transform = `translateY(${AQ.r(y - lh / 2)}px)`;
      });
      ticks.forEach((o) => {
        const y = cam.y(TS.y(o.h));
        o.el.style.transform = `translateY(${AQ.r(y)}px)`;
        o.el.style.opacity = o.major ? "1" : String(st.minor);
      });
    };
    return ruler;
  };
})();
