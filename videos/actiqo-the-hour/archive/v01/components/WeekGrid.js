/*
 * WeekGrid: the calendar field the Hour Block lives in: day columns, hour lines and day
 * headers. Hairlines are drawn in screen space from world coordinates, so they stay crisp
 * hairlines at any camera scale. Each column has its own visibility so the week can be
 * revealed spatially (Thursday first, then its neighbours, then the whole week).
 */
(function () {
  const AQ = window.AQ;

  AQ.WeekGrid = function (opts) {
    const TS = AQ.time;
    const g = AQ.el("g", "aq-grid", opts.svg, AQ.SVGNS);
    const cols = TS.DAYS.map((name, d) => {
      const edge = AQ.el("line", "aq-grid-col", g, AQ.SVGNS);
      const hours = [];
      for (let h = TS.START_H; h <= TS.END_H; h++) hours.push({ h, el: AQ.el("line", "aq-grid-hour", g, AQ.SVGNS) });
      const header = AQ.el("div", "aq-day-header" + (d === opts.focusDay ? " is-focus" : ""), opts.headerLayer);
      header.textContent = name;
      return { d, edge, hours, header, hw: header.getBoundingClientRect().width };
    });
    const lastEdge = AQ.el("line", "aq-grid-col", g, AQ.SVGNS);

    const grid = {};
    /**
     * render(cam, st)
     * st.col(d) → 0..1 visibility of day column d
     * st.headers → 0..1 header row visibility; st.headerY screen y of the header row
     */
    grid.render = function (cam, st) {
      const y0 = cam.y(TS.y(TS.START_H)), y1 = cam.y(TS.y(TS.END_H));
      cols.forEach((c) => {
        const v = st.col(c.d);
        const xl = cam.x(TS.x(c.d)), xr = cam.x(TS.x(c.d + 1));
        // left edge of this column: visible if this or the previous column is visible
        const ve = Math.max(v, c.d > 0 ? st.col(c.d - 1) : 0);
        setLine(c.edge, xl, y0, xl, y1, ve);
        c.hours.forEach((o) => {
          const y = cam.y(TS.y(o.h));
          setLine(o.el, xl, y, xr, y, v);
        });
        const hx = (xl + xr) / 2 - c.hw / 2;
        c.header.style.transform = `translate(${AQ.r(hx)}px, ${AQ.r(st.headerY)}px)`;
        c.header.style.opacity = String(Math.min(v, st.headers));
      });
      const xe = cam.x(TS.x(7));
      setLine(lastEdge, xe, y0, xe, y1, st.col(6));
    };
    function setLine(el, x1, y1, x2, y2, o) {
      el.setAttribute("x1", AQ.r(x1)); el.setAttribute("y1", AQ.r(y1));
      el.setAttribute("x2", AQ.r(x2)); el.setAttribute("y2", AQ.r(y2));
      el.style.opacity = String(o);
    }
    return grid;
  };
})();
