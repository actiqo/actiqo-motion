/*
 * VillageMonogram (PLACEHOLDER form): a person in the family's village shown as an initial
 * in a circle, never a cartoon avatar. `dashed` + empty initial = an unassigned responsibility
 * ("who's got pickup?"). The real ACTIQO avatar/monogram treatment replaces this when supplied.
 */
(function () {
  const AQ = window.AQ;

  AQ.VillageMonogram = function (parent, opts) {
    const el = AQ.el("span", "aq-monogram" + (opts.dashed ? " aq-monogram--open" : ""), parent);
    el.textContent = opts.initial || "";
    return { el };
  };
})();
