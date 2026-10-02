/*
 * The time system: ACTIQO's underlying grid.
 * WORLD units: one day column = COL_W wide, one hour = HOUR_H tall, 7 AM at y = 0, Monday at x = 0.
 * Every primitive positions itself from (day, hour), never from arbitrary coordinates.
 */
(function () {
  const AQ = window.AQ;
  const TS = (AQ.time = {
    COL_W: 240,
    HOUR_H: 150,
    START_H: 7,
    END_H: 22,
    GUTTER: 10, // world inset of an event inside its day column
    DAYS: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  });

  TS.x = (day) => day * TS.COL_W;
  TS.y = (hour) => (hour - TS.START_H) * TS.HOUR_H;
  TS.colCenter = (day) => TS.x(day) + TS.COL_W / 2;

  /** World rect for an event on `day` from `start` to `end` (decimal hours, 17.5 = 5:30 PM). */
  TS.eventRect = (day, start, end) => ({
    x: TS.x(day) + TS.GUTTER,
    y: TS.y(start),
    w: TS.COL_W - TS.GUTTER * 2,
    h: (end - start) * TS.HOUR_H,
  });

  /** Named anchor points on an event rect: where coordination threads may originate. */
  TS.anchor = (r, where) => {
    const m = {
      "top-left": [r.x, r.y], "top-right": [r.x + r.w, r.y], "top-center": [r.x + r.w / 2, r.y],
      "bottom-left": [r.x, r.y + r.h], "bottom-right": [r.x + r.w, r.y + r.h],
      "bottom-center": [r.x + r.w / 2, r.y + r.h],
      "right-mid": [r.x + r.w, r.y + r.h / 2], "left-mid": [r.x, r.y + r.h / 2],
    }[where];
    return { x: m[0], y: m[1] };
  };

  TS.label = (hour) => {
    const h = Math.floor(hour) % 24;
    const suffix = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 === 0 ? 12 : h % 12;
    return `${h12} ${suffix}`;
  };
})();
