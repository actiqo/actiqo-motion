/*
 * LogisticsChip: one piece of hidden coordination ("Cleats · shin guards", "Maya · 5:15").
 * Screen-sized (always legible) but world-attached: it hangs off a CoordinationThread at an
 * attach point. `side` says which edge of the chip the thread meets ("left" | "right").
 * It never flies in: it resolves at the end of its thread.
 */
(function () {
  const AQ = window.AQ;

  AQ.LogisticsChip = function (opts) {
    const el = AQ.el("div", "aq-chip", opts.layer);
    if (opts.monogram) AQ.VillageMonogram(el, opts.monogram);
    const txt = AQ.el("span", "aq-chip-text", el);
    txt.textContent = opts.text;
    const box = el.getBoundingClientRect(); // setup-time measurement only
    const chip = { el, w: box.width, h: box.height, side: opts.side || "left" };
    el.style.transformOrigin = chip.side === "left" ? "0% 50%" : "100% 50%";

    /** render(attach screen point, appear 0..1, scale) */
    chip.render = function (p, appear, scale) {
      const a = AQ.eases.chaos(AQ.clamp01(appear));
      const k = (scale || 1) * (0.94 + 0.06 * a);
      const nudge = (1 - a) * 10 * (chip.side === "left" ? -1 : 1);
      const x = (chip.side === "left" ? p.x : p.x - chip.w) + nudge;
      el.style.transform = `translate(${AQ.r(x)}px, ${AQ.r(p.y - chip.h / 2)}px) scale(${AQ.r(k * 1000) / 1000})`;
      el.style.opacity = String(a);
    };
    return chip;
  };
})();
