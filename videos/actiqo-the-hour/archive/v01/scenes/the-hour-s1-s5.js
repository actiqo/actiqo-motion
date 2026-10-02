/*
 * ACTIQO Film 01 "The Hour": S1–S5 (0.0–8.0 s)
 *
 *   S1 0.0–1.0  Hook: "who's got pickup today?" fully readable on frame 0
 *   S2 1.0–2.4  One object reveals its meaning: bubble → Hour Block (Soccer Practice 5:30–6:30 PM)
 *   S3 2.4–4.6  The event unfolds: Leave-By, Pickup, gear, field change, sibling
 *   S4 4.6–7.2  Hero pull-back: one hour → the whole week, density escalates
 *   S5 7.2–8.0  24 frames of true stillness (nothing is tweened in this window)
 *
 * Architecture: GSAP tweens plain proxy values in `S`; the timeline's onUpdate calls render(),
 * which projects every primitive through one Camera. Seek-safe: every frame is a pure function
 * of the proxies, which are a pure function of time.
 */
(function () {
  const AQ = window.AQ;

  AQ.buildTheHour = function (layers) {
    const T = window.AQ_TOKENS, TS = AQ.time;
    const THU = 3;

    // ── Camera states ────────────────────────────────────────────────────
    const HERO = TS.eventRect(THU, 17.5, 18.5);
    const FOCUS = { x: HERO.x + HERO.w / 2, y: HERO.y + HERO.h / 2 };
    const DAY = { s: 2, fx: 400, fy: 880 }; // one afternoon, Hour Block at left-centre
    const WEEK = { s: 0.5, fx: 590, fy: 1155 }; // Mon–Sun, 7 AM–10 PM
    const cam = AQ.Camera(FOCUS);
    const RAIL_X = 160;

    // ── Primitives ───────────────────────────────────────────────────────
    const grid = AQ.WeekGrid({ svg: layers.gGrid, headerLayer: layers.headers, focusDay: THU });

    const muted = [
      // [day, start, end, reveal] reveal: "q" = revealed by the camera, else a time in seconds
      [0, 15, 15.5], [1, 15, 15.5], [2, 15, 15.5], [3, 15, 15.5], [4, 15, 15.5], // school pickups
      [0, 16, 17], // Mon swim
      [1, 17.5, 18.5], // Tue soccer
      [2, 16.5, 17.25], // Wed piano (Maya)
      [5, 9, 10.5], // Sat game
      [5, 13, 14], // Sat recital (Maya)
      [6, 14, 16], // Sun party
    ].map(([d, s, e]) => ({ d, block: AQ.HourBlock({ svg: layers.gMuted, day: d, start: s, end: e }) }));
    const dance = AQ.HourBlock({ svg: layers.gMuted, day: THU, start: 16.25, end: 17.25 }); // Maya, Thu

    const bubble = AQ.MessageBubble({
      svg: layers.gHero, textLayer: layers.shapeText, text: "who’s got pickup today?", x: 110, cy: 880,
    });
    const hero = AQ.HourBlock({
      variant: "hero", day: THU, start: 17.5, end: 18.5, designScale: DAY.s,
      title: "Soccer Practice", time: "5:30–6:30 PM",
      adoptPath: bubble.path, textLayer: layers.shapeText,
    });

    const ruler = AQ.TimeRuler({ layer: layers.ruler, railX: RAIL_X });
    const leave = AQ.LeaveByTick({
      svg: layers.gThreads, rulerLayer: layers.ruler, overlay: layers.overlay,
      day: THU, hour: 16.8, text: "Leave 4:48", railX: RAIL_X,
    });

    const at = (r, where) => TS.anchor(r, where);
    const DANCE = TS.eventRect(THU, 16.25, 17.25);
    const leaveEnd = { x: TS.x(THU) + TS.COL_W - TS.GUTTER, y: TS.y(16.8) };
    const weekPt = (w) => ({ x: WEEK.fx + WEEK.s * (w.x - FOCUS.x), y: WEEK.fy + WEEK.s * (w.y - FOCUS.y) });
    const dayPt = (w) => ({ x: DAY.fx + DAY.s * (w.x - FOCUS.x), y: DAY.fy + DAY.s * (w.y - FOCUS.y) });

    /*
     * Chips: origin (WORLD point on the time system) → attach point (SCREEN).
     * dayAt/weekAt are designed screen positions; offsets are derived from them so the chip
     * always hangs off its origin, whatever the camera does.
     */
    const CHIPS = [
      // S3: the hour unfolds (camera locked on the afternoon)
      { t: 2.85, text: "Pickup", mono: { dashed: true }, origin: at(HERO, "bottom-right"), dayAt: { x: 680, y: 1030 }, weekAt: { x: 676, y: 1236 } },
      { t: 3.3, text: "Cleats \u00b7 shin guards", origin: at(HERO, "top-right"), dayAt: { x: 680, y: 440 }, weekAt: { x: 700, y: 985 } },
      { t: 3.75, text: "Field 4 \u2192 7", origin: at(HERO, "right-mid"), dayAt: { x: 680, y: 880 }, weekAt: { x: 706, y: 1178 } },
      { t: 4.2, text: "Maya \u00b7 5:15", origin: at(DANCE, "bottom-right"), dayAt: { x: 680, y: 655 }, weekAt: { x: 694, y: 1120 } },
      // S4: the week arrives. Each chip is timed to land only once its origin is on screen mid-pull.
      { t: 5.6, text: "Traffic +12m", side: "right", origin: { x: TS.colCenter(2), y: TS.y(16.8) }, weekAt: { x: 500, y: 1000 } },
      { t: 5.8, text: "Early pickup \u00b7 Wed", origin: at(TS.eventRect(2, 15, 15.5), "top-center"), weekAt: { x: 500, y: 470 } },
      { t: 5.95, text: "$85 due \u00b7 Fri", pin: true, origin: { x: TS.colCenter(4), y: TS.y(12) }, weekAt: { x: 740, y: 745 } },
      { t: 6.1, text: "Snack \u00b7 Sat", side: "right", origin: at(TS.eventRect(5, 9, 10.5), "bottom-left"), weekAt: { x: 745, y: 655 } },
      { t: 6.25, text: "Grandma? \u00b7 Tue", side: "right", origin: at(TS.eventRect(1, 17.5, 18.5), "bottom-center"), weekAt: { x: 430, y: 1320 } },
      { t: 6.5, text: "Swap carpool? \u00b7 Mon", origin: at(TS.eventRect(0, 16, 17), "top-center"), weekAt: { x: 200, y: 560 } },
    ].map((c) => {
      const w = weekPt(c.origin);
      const offWeek = { x: c.weekAt.x - w.x, y: c.weekAt.y - w.y };
      let offDay = offWeek;
      if (c.dayAt) { const d = dayPt(c.origin); offDay = { x: c.dayAt.x - d.x, y: c.dayAt.y - d.y }; }
      return Object.assign(c, {
        offDay, offWeek,
        thread: AQ.CoordinationThread({ svg: layers.gThreads, pin: c.pin }),
        chip: AQ.LogisticsChip({ layer: layers.overlay, text: c.text, side: c.side, monogram: c.mono }),
        st: { draw: 0, appear: 0 },
      });
    });

    // ── State proxies (the only things GSAP tweens) ──────────────────────
    const S = {
      drift: 0, qOut: 0, tail: 0, mx: 0, my: 0, mr: 0, mf: 0, title: 0, time: 0,
      ruler: 0, leaveDraw: 0, leaveLabel: 0, dance: 0, q: 0,
    };

    const smooth = (v) => v * v * (3 - 2 * v);
    function colVis(d) {
      if (d === THU) return S.ruler;
      const dist = Math.abs(d - THU);
      const a = 0.06 + (dist - 1) * 0.13;
      return smooth(AQ.range(S.q, a, a + 0.26));
    }

    function render() {
      cam.set(DAY, WEEK, S.q);
      const q = S.q;

      grid.render(cam, { col: colVis, headers: smooth(AQ.range(q, 0.72, 0.97)), headerY: cam.y(TS.y(TS.START_H)) - 68 });

      muted.forEach((m) => {
        const base = m.d === THU ? smooth(AQ.range(q, 0.04, 0.22)) : colVis(m.d) * smooth(AQ.range(q, 0.08, 0.5));
        m.block.render(cam, { opacity: base });
      });
      dance.render(cam, { opacity: S.dance });

      const g = bubble.geometry(S.drift);
      const rect = hero.render(cam, {
        morph: { from: g, x: S.mx, y: S.my, r: S.mr, tail: S.tail, fill: S.mf },
        title: S.title, time: S.time,
        labelOpacity: 1 - smooth(AQ.range(q, 0.42, 0.72)),
        shadow: AQ.clamp01(S.mf),
      });
      bubble.renderText(S.qOut, S.drift);

      // Text that belongs to the object (question, then title/time) is clipped by the object itself.
      const rr = AQ.lerp(g.radius, T.radius.hourBlock * cam.s, S.mr);
      layers.shapeText.style.clipPath =
        `inset(${AQ.r(rect.y)}px ${AQ.r(1080 - rect.x - rect.w)}px ${AQ.r(1920 - rect.y - rect.h)}px ${AQ.r(rect.x)}px round ${AQ.r(rr)}px)`;

      ruler.render(cam, { opacity: S.ruler, minor: 1 - smooth(AQ.range(q, 0, 0.3)) });

      leave.render(cam, {
        draw: S.leaveDraw, label: S.leaveLabel,
        offset: { x: AQ.lerp(30, 23, q), y: 0 }, scale: AQ.lerp(1, 0.82, q),
        lineOpacity: AQ.lerp(1, 0.6, smooth(q)),
      });

      const k = AQ.lerp(1, 0.8, q);
      CHIPS.forEach((c) => {
        const o = { x: cam.x(c.origin.x), y: cam.y(c.origin.y) };
        const off = { x: AQ.lerp(c.offDay.x, c.offWeek.x, q), y: AQ.lerp(c.offDay.y, c.offWeek.y, q) };
        const p = { x: o.x + off.x, y: o.y + off.y };
        c.thread.render(o, p, c.st.draw, 1);
        c.chip.render(p, c.st.appear, k);
      });
    }

    // ── Timeline ─────────────────────────────────────────────────────────
    const E = AQ.eases;
    const tl = gsap.timeline({ paused: true, onUpdate: render });
    const lin = { ease: "none" };

    // S1 hook: frame 0 is complete; a barely-there lean-in keeps it alive (≈1.8%)
    tl.to(S, { drift: 0.018, duration: 1.15, ease: "power1.inOut" }, 0);

    // S2 morph: the question leaves, the tail retracts, width then height resolve, fill deepens
    tl.to(S, { qOut: 1, duration: 0.3, ...lin }, 1.0);
    tl.to(S, { tail: 1, duration: 0.36, ease: E.signature }, 1.0);
    tl.to(S, { mr: 1, duration: 0.5, ease: E.signature }, 1.05);
    tl.to(S, { mx: 1, duration: 0.62, ease: E.signature }, 1.12);
    tl.to(S, { my: 1, duration: 0.64, ease: E.signature }, 1.2);
    tl.to(S, { mf: 1, duration: 0.42, ease: E.signature }, 1.16);
    tl.to(S, { title: 1, duration: 0.5, ...lin }, 1.34);
    tl.to(S, { time: 1, duration: 0.5, ...lin }, 1.46);
    tl.to(S, { ruler: 1, duration: 0.5, ease: E.signature }, 1.58);

    // S3 unfold: one relationship per beat
    tl.to(S, { leaveDraw: 1, duration: 0.45, ...lin }, 2.4);
    tl.to(S, { leaveLabel: 1, duration: 0.4, ...lin }, 2.62);
    tl.to(S, { dance: 1, duration: 0.3, ease: E.signature }, 3.95);
    CHIPS.forEach((c) => {
      tl.to(c.st, { draw: 1, duration: 0.34, ...lin }, c.t);
      tl.to(c.st, { appear: 1, duration: 0.34, ...lin }, c.t + 0.22);
    });

    // S4 hero move: one continuous pull-back, day → wider day → week (ends exactly at 7.2)
    tl.to(S, { q: 1, duration: 2.6, ease: E.pull }, 4.6);

    // S5 stillness: nothing is scheduled after 7.2 s.
    render();
    return { tl, render, S, CHIPS };
  };
})();
