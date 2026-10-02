/*
 * ACTIQO Film 01 "The Hour" — S1–S5 (0.0–8.0 s), v02, built on the real ACTIQO system.
 *
 *   S1 0.0–1.0  Styleframe A: "who's got pickup today?" readable on frame 0 (family-text metaphor)
 *   S2 1.0–2.4  One object: the message becomes Thursday's Hour Block (Soccer Practice 5:30 – 6:30 PM)
 *   S3 2.4–4.6  The hour's dependencies arrive in time order → Styleframe B
 *   S4 4.6–7.2  One continuous pull-back: Thursday → the week → Styleframe C
 *   S5 7.2–8.0  24 frames of true stillness (nothing is scheduled after 7.2 s)
 *
 * Architecture: GSAP tweens plain numbers in `S`; the timeline's onUpdate calls render(), which
 * lays out every element as a pure function of S. Every element has a B (day) and a C (week)
 * placement; the pull-back progress Q interpolates between them. Seek-safe by construction.
 */
(function () {
  const AQ = window.AQ;

  AQ.buildTheHour = function (L) {
    const T = window.AQ_TOKENS, C = T.color, E = AQ.eases;
    const lerp = AQ.lerp, rng = AQ.range, sm = AQ.smooth, px = (v) => `${AQ.r(v)}px`;

    // ── The time system in its two framings ─────────────────────────────
    const yB = (h) => 470 + (h - 16) * 320; // Thursday, day scale: 4 PM at y 470, 320 px/hour
    const yC = (h) => 610 + (h - 15) * 210; // the week: 3 PM at y 610, 210 px/hour
    const yAt = (h, Q) => lerp(yB(h), yC(h), Q);

    // Week columns (C). Thursday stays widest: it is the anchor the camera pulled back from.
    const COLS = [
      { d: "Mon", n: "28", x: 164, w: 96 }, { d: "Tue", n: "29", x: 260, w: 96 },
      { d: "Wed", n: "30", x: 356, w: 96 }, { d: "Thu", n: "1", x: 452, w: 332 },
      { d: "Fri", n: "2", x: 784, w: 72 }, { d: "Sat", n: "3", x: 856, w: 72 },
      { d: "Sun", n: "4", x: 928, w: 72 },
    ];
    // In B the same columns sit at the day-scale zoom (Thursday fills the frame, others off-screen).
    const ZB = 884 / 332, xBofC = (x) => 196 + (x - 452) * ZB;
    const xAt = (x, Q) => lerp(xBofC(x), x, Q);
    const col = (d) => COLS.find((c) => c.d === d);
    const lane = (d, a, b) => { const c = col(d), inner = c.w - 12; return { x: c.x + 6 + inner * a, w: inner * (b - a) - (b < 1 ? 8 : 0) }; };
    const evC = (d, h1, h2, ln = [0, 1]) => { const l = lane(d, ln[0], ln[1]); return { x: l.x, y: yC(h1), w: l.w, h: yC(h2) - yC(h1) }; };
    const evAt = (d, h1, h2, ln, Q) => {
      const c = evC(d, h1, h2, ln);
      return { x: xAt(c.x, Q), y: yAt(h1, Q), w: lerp(c.w * ZB, c.w, Q), h: yAt(h2, Q) - yAt(h1, Q) };
    };

    // ── Layers ───────────────────────────────────────────────────────────
    const grid = L.grid, blocks = L.blocks, threadsSvg = L.threads, chips = L.chips, top = L.top;

    // Hour lines + labels (3–7 PM), half-hour lines (day scale only)
    const HOURS = [15, 16, 17, 18, 19].map((h) => ({
      h, line: AQ.el("div", "hline", grid),
      label: Object.assign(AQ.el("div", "hour", grid), { textContent: `${h - 12} PM` }),
    }));
    const HALVES = [16.5, 17.5, 18.5].map((h) => ({ h, line: AQ.el("div", "hline half", grid) }));
    const thuTint = AQ.el("div", "thu-tint", grid);
    const DIVIDERS = [...COLS.map((c) => c.x), 1000].map((x) => ({ x, el: AQ.el("div", "vline", grid) }));
    const HEADS = COLS.map((c) => {
      const el = AQ.el("div", "dayhead" + (c.d === "Thu" ? " is-thu" : ""), top);
      el.innerHTML = `<div class="dl">${c.d}</div><div class="dn">${c.n}</div>`;
      return { c, el };
    });

    // Page titles (Fraunces, the product's page-title role)
    const titleB = AQ.el("div", "title", top);
    titleB.innerHTML = `<div class="page-title">Thursday</div><div class="page-sub">Leo’s soccer practice</div>`;
    const titleC = AQ.el("div", "title", top);
    titleC.innerHTML = `<div class="page-title">This week</div><div class="page-sub">Sep 28 – Oct 4</div>`;

    // Other events: production calendar block formula (child colour 1C fill + 2.5 px rail)
    const childBlock = (child, lines) => {
      const el = AQ.el("div", "cblock", blocks);
      const hex = child === "leo" ? C.childLeo : C.childMaya;
      el.style.background = hex + "1C";
      el.style.borderLeft = `6px solid ${hex}`;
      el.innerHTML = lines.map((l, i) => `<div class="${i === lines.length - 1 ? "ct" : "cl"}">${l}</div>`).join("");
      return el;
    };
    const OTHER = [
      { el: childBlock("maya", ["Dance", "5:15"]), d: "Mon", h: [17.25, 18.25] },
      { el: childBlock("leo", ["Soccer", "5:30"]), d: "Tue", h: [17.5, 18.5] },
      { el: childBlock("maya", ["Dance", "5:15"]), d: "Wed", h: [17.25, 18.25] },
    ];
    const DANCE = { el: childBlock("maya", ["Maya", "Dance", "5:15"]), d: "Thu", h: [17.25, 18.25], ln: [0, 0.34] };

    // Leave-by bracket (localized to Thursday's practice)
    const bracket = AQ.el("div", "bracket", blocks);
    const bracketTick = AQ.el("div", "bracket-tick", blocks);

    // ── The one object: message bubble → Hour Block ──────────────────────
    const shape = AQ.el("path", "hero-shape", L.shape, AQ.SVGNS);
    const shapeText = L.shapeText;
    const question = AQ.el("div", "question", shapeText);
    question.innerHTML = `<div>who’s got pickup</div><div>today?</div>`;
    const qW = question.getBoundingClientRect().width; // setup-time measurement only
    const BUB = { x: 84, y: 700, w: qW + 128, h: 110 * 2 + 52 + 60 }; // padding 52/64/60 (styleframe A)
    const HERO_B = { x: 214, y: yB(17.5), w: 334, h: yB(18.5) - yB(17.5) };
    const heroC = () => { const r = evC("Thu", 17.5, 18.5, [0.34, 1]); return r; };
    const HERO_C = heroC();

    const heroLabel = AQ.el("div", "hero-label", shapeText);
    const hWell = AQ.el("div", "hero-well", heroLabel); hWell.innerHTML = AQ.icon("solid-futbol", 30);
    const hWho = Object.assign(AQ.el("div", "hero-who", heroLabel), { textContent: "Leo" });
    const hTitle = AQ.el("div", "hero-title", heroLabel);
    hTitle.innerHTML = `<div>Soccer</div><div>Practice</div>`;
    const hTime = Object.assign(AQ.el("div", "hero-time", heroLabel), { textContent: "5:30 – 6:30 PM" });

    // ── Chips (ACTIQO row language: circular tint well + Inter title/sub) ─
    function chip({ tone = "white", well = "blue", icon, iconSize = 26, wellSize = 64, title, sub, sub2, big = false }) {
      const el = AQ.el("div", `chip chip--${tone}${big ? " chip--big" : ""}`, chips);
      el.innerHTML =
        `<div class="well well--${well}" style="width:${wellSize}px;height:${wellSize}px">${AQ.icon(icon, iconSize)}</div>` +
        `<div class="txt"><div class="t">${title}</div><div class="subs"><div class="s s1">${sub}</div>` +
        (sub2 ? `<div class="s s2" data-layout-allow-overlap>${sub2}</div>` : "") + `</div></div>`;
      return { el, s1: el.querySelector(".s1"), s2: el.querySelector(".s2"), h: el.getBoundingClientRect().height, w: el.getBoundingClientRect().width };
    }
    const leave = chip({ tone: "green", well: "white-green", icon: "solid-car-side", iconSize: 36, wellSize: 80, big: true,
      title: "Leave by 4:48 PM", sub: "32 min drive + 10 min buffer", sub2: "Dad driving" });
    const dad = chip({ well: "green", icon: "solid-user", title: "Dad driving", sub: "Drop-off" });
    const bring = chip({ well: "blue", icon: "solid-bag-shopping", title: "What to bring", sub: "Cleats, shin guards" });
    const pickup = chip({ tone: "orange", well: "white-orange", icon: "solid-person-walking", iconSize: 34, wellSize: 80, big: true,
      title: "Pickup · 6:30 PM", sub: "No one assigned yet" });
    const field = chip({ well: "neutral", icon: "solid-location-dot", title: "Moved to Field 7", sub: "Usually Field 4" });
    const grandma = chip({ well: "green", icon: "solid-person-walking", title: "Pickup · Tue", sub: "Grandma" });

    // Chip placements: B (day scale) and C (week). s = scale.
    const P = {
      leave: { B: { x: 214, y: yB(16.8) - 58, s: 1 }, C: { x: 458, y: yC(16.8) - 48, s: 0.84 } },
      dad: { B: { x: 560, y: 804, s: 1 } },
      bring: { B: { x: 590, y: yB(17.93), s: 1 }, C: { x: 458, y: 632, s: 1 } },
      pickup: { B: { x: 214, y: HERO_B.y + HERO_B.h + 48, s: 1 }, C: { x: 496, y: HERO_C.y + HERO_C.h + 56, s: 0.84 } },
      field: { C: { x: 458, y: 772, s: 1 } },
      grandma: { C: { x: 172, y: HERO_C.y + HERO_C.h + 56, s: 1 } },
    };
    const place = (c, p, appear) => {
      const a = E.enter(AQ.clamp01(appear));
      c.el.style.transform = `translate(${px(p.x)}, ${px(p.y + 20 * (1 - a))}) scale(${AQ.r(p.s * 1000) / 1000})`;
      c.el.style.opacity = String(a);
      return { x: p.x, y: p.y, w: c.w * p.s, h: c.h * p.s };
    };
    const lp = (pB, pC, Q) => ({ x: lerp(pB.x, pC.x, Q), y: lerp(pB.y, pC.y, Q), s: lerp(pB.s, pC.s, Q) });

    // Threads: neutral = resolved link, orange dashed = unresolved responsibility
    const thread = (cls) => {
      const g = AQ.el("g", "", threadsSvg, AQ.SVGNS);
      const path = AQ.el("path", cls, g, AQ.SVGNS);
      const dot = AQ.el("circle", cls + "-dot", g, AQ.SVGNS);
      dot.setAttribute("r", "7");
      return { g, path, dot };
    };
    const TH = {
      dad: thread("th"), bring: thread("th"), spine1: thread("th"), spine2: thread("th"),
      pk: thread("th-open"), pkDance: thread("th-open"), grandma: thread("th"),
    };
    const drawThread = (t, a, b, progress, opacity, { vertical = false, dot = true } = {}) => {
      const p = AQ.clamp01(progress);
      t.path.setAttribute("d", p > 0 ? AQ.polyD(AQ.curvePoints(a, b, p, vertical)) : "M0,0");
      t.g.style.opacity = String(p > 0 ? opacity : 0);
      t.dot.setAttribute("cx", AQ.r(a.x)); t.dot.setAttribute("cy", AQ.r(a.y));
      t.dot.style.opacity = dot ? String(AQ.clamp01(p * 4)) : "0";
    };

    // ── State (the only things GSAP tweens) ──────────────────────────────
    const S = {
      drift: 0, tail: 0, mx: 0, my: 0, mr: 0, mf: 0, qf: 0, li: 0, grid: 0, titleB: 0,
      brk: 0, leave: 0, dadT: 0, dad: 0, bringT: 0, bring: 0, pkT: 0, pk: 0, q: 0,
    };

    function render() {
      const Q = S.q;
      const QW = sm(rng(Q, 0.45, 0.9)); // the week arriving
      const merge = sm(rng(Q, 0.02, 0.4)); // Dad driving folds into the leave-by card

      // Grid
      const gA = lerp(0.44, 1, S.grid); // faint in styleframe A, full hairline from S2
      HOURS.forEach(({ h, line, label }) => {
        const y = yAt(h, Q);
        const vis = h === 15 ? sm(rng(Q, 0.62, 0.92)) : 1;
        const lx = lerp(196, 164, Q);
        line.style.transform = `translate(${px(lx)}, ${px(y)})`;
        line.style.width = px(1080 - lx);
        line.style.opacity = String(gA * vis * (h === 19 ? lerp(1, 1, Q) : 1));
        label.style.transform = `translate(${px(lerp(84, 62, Q))}, ${px(y - 16)})`;
        label.style.opacity = String(S.grid * vis);
      });
      HALVES.forEach(({ h, line }) => {
        line.style.transform = `translate(${px(196)}, ${px(yAt(h, Q))})`;
        line.style.width = px(1080 - 196);
        line.style.opacity = String(gA * (1 - sm(rng(Q, 0, 0.35))));
      });
      DIVIDERS.forEach(({ x, el }) => {
        el.style.transform = `translate(${px(xAt(x, Q))}, 596px)`;
        el.style.opacity = String(QW);
      });
      thuTint.style.transform = `translate(${px(xAt(452, Q))}, 596px)`;
      thuTint.style.width = px(lerp(332 * ZB, 332, Q));
      thuTint.style.opacity = String(QW);

      // Titles: Thursday → This week (editorial breath)
      const tOut = sm(rng(Q, 0.3, 0.55)), tIn = E.breath(rng(Q, 0.5, 0.85));
      titleB.style.transform = `translate(84px, ${px(252 - 20 * tOut)})`;
      titleB.style.opacity = String(E.breath(S.titleB) * (1 - tOut));
      titleC.style.transform = `translate(84px, ${px(236 + 20 * (1 - tIn))})`;
      titleC.style.opacity = String(tIn);
      HEADS.forEach(({ c, el }, i) => {
        const a = sm(rng(Q, 0.62 + Math.abs(i - 3) * 0.03, 0.86 + Math.abs(i - 3) * 0.03));
        el.style.transform = `translate(${px(c.x)}, 452px)`;
        el.style.width = px(c.w);
        el.style.opacity = String(a);
      });

      // Other events (the week is context: quieter than Thursday)
      OTHER.forEach((o, i) => {
        const r = evAt(o.d, o.h[0], o.h[1], [0, 1], Q);
        Object.assign(o.el.style, { transform: `translate(${px(r.x)}, ${px(r.y)})`, width: px(r.w), height: px(r.h) });
        o.el.style.opacity = String(0.62 * sm(rng(Q, 0.5 + i * 0.04, 0.82 + i * 0.04)));
      });
      const rd = evAt("Thu", 17.25, 18.25, DANCE.ln, Q);
      Object.assign(DANCE.el.style, { transform: `translate(${px(rd.x)}, ${px(rd.y)})`, width: px(rd.w), height: px(rd.h) });
      DANCE.el.style.opacity = String(sm(rng(Q, 0.4, 0.7)));

      // The Hour Block (and, before it, the message it answers)
      const bub = (() => {
        const k = 1 + S.drift, cx = BUB.x + BUB.w / 2, cy = BUB.y + BUB.h / 2;
        return { x: cx - (BUB.w * k) / 2, y: cy - (BUB.h * k) / 2, w: BUB.w * k, h: BUB.h * k, k };
      })();
      const heroQ = AQ.lerpRect(HERO_B, HERO_C, Q);
      const rect = {
        x: lerp(bub.x, heroQ.x, S.mx), w: lerp(bub.w, heroQ.w, S.mx),
        y: lerp(bub.y, heroQ.y, S.my), h: lerp(bub.h, heroQ.h, S.my),
      };
      const radius = lerp(56 * bub.k, lerp(T.radius.surface, 22, Q), S.mr);
      shape.setAttribute("d", AQ.shapePath(rect, radius, 1 - S.tail));
      shape.style.fill = AQ.mixColor(C.surface, C.ink, S.mf);
      shape.style.strokeOpacity = String(1 - S.mf);
      shapeText.style.clipPath =
        `inset(${px(rect.y)} ${px(1080 - rect.x - rect.w)} ${px(1920 - rect.y - rect.h)} ${px(rect.x)} round ${px(radius)})`;

      // S2 handoff, carried by the card's own colour change (one object changing meaning):
      //  · the question stays one coherent group, scaled with the tightening container so no word
      //    is ever clipped, and sinks away as the card darkens (navy ink on a darkening card);
      //  · the event surfaces as one white group only once the card is dark enough to hold it.
      // Each group is faint exactly when the other is present, so they never compete.
      const qs = rect.w / BUB.w;
      const qGone = AQ.clamp01(S.qf);
      const qx = rect.x + (rect.w - BUB.w * qs) / 2 + 64 * qs;
      const qy = rect.y + (rect.h - BUB.h * qs) / 2 + 52 * qs - 24 * E.standard(qGone);
      question.style.transform = `translate(${px(qx)}, ${px(qy)}) scale(${AQ.r(qs * 1000) / 1000})`;
      question.style.opacity = String(1 - qGone);

      // Hero label: B layout → C layout, line by line (re-set, not pixel-scaled as one block)
      const padX = lerp(30, 16, Q), padY = lerp(26, 14, Q);
      const lIn = AQ.clamp01(S.li);
      const ox = rect.x + padX, oy = rect.y + padY + 24 * (1 - E.enter(lIn));
      heroLabel.style.opacity = String(E.enter(lIn));
      hTitle.style.color = hWell.style.color = "#FFFFFF";
      hWho.style.color = hTime.style.color = "#BABEC5"; // white @72% on navy, as in the card
      hWell.style.background = "rgba(255,255,255,0.12)";
      const wellA = 1 - sm(rng(Q, 0.05, 0.35));
      hWell.style.transform = `translate(${px(ox)}, ${px(oy)})`;
      hWell.style.opacity = String(wellA);
      hWho.style.transform = `translate(${px(ox + lerp(80, 0, Q))}, ${px(oy + lerp(16, 0, Q))}) scale(${AQ.r(lerp(1, 24 / 26, Q) * 1000) / 1000})`;
      const ts = lerp(1, 31 / 48, Q);
      hTitle.style.transform = `translate(${px(ox)}, ${px(oy + lerp(88, 34, Q))}) scale(${AQ.r(ts * 1000) / 1000})`;
      hTime.style.transform = `translate(${px(ox)}, ${px(oy + lerp(202, 110, Q))}) scale(${AQ.r(lerp(1, 23 / 28, Q) * 1000) / 1000})`;

      // Leave-by bracket: from 4:48 down to the start of practice
      const br = E.standard(AQ.clamp01(S.brk));
      const bx = lerp(192, heroQ.x + 26, Q), by0 = yAt(16.8, Q), by1 = heroQ.y - lerp(0, 6, Q);
      bracket.style.transform = `translate(${px(bx)}, ${px(by0)})`;
      bracket.style.height = px(Math.max(0, (by1 - by0) * br));
      bracket.style.opacity = String(br > 0 ? 1 : 0);
      bracketTick.style.transform = `translate(${px(bx - 8)}, ${px(by0 - 3)})`;
      bracketTick.style.opacity = String(AQ.clamp01(br * 3));

      // Chips
      const pLeave = lp(P.leave.B, P.leave.C, Q);
      const rLeave = place(leave, pLeave, S.leave);
      leave.s1.style.opacity = String(1 - sm(rng(Q, 0.02, 0.22)));
      leave.s2.style.opacity = String(sm(rng(Q, 0.22, 0.42)));

      // Dad driving travels into the leave card's sub-line, then hands over to it
      const dadDest = { x: pLeave.x + 116 * pLeave.s - 98 * pLeave.s, y: pLeave.y + 62 * pLeave.s - 14 * pLeave.s, s: pLeave.s };
      const pDad = lp(P.dad.B, dadDest, merge);
      const rDad = place(dad, pDad, S.dad);
      dad.el.style.opacity = String(E.enter(AQ.clamp01(S.dad)) * (1 - sm(rng(Q, 0.18, 0.4))));
      drawThread(TH.dad, { x: rDad.x + 48, y: rLeave.y + rLeave.h }, { x: rDad.x + 48, y: rDad.y }, S.dadT, 1 - merge);

      const bOut = sm(rng(Q, 0.04, 0.24)), bIn = rng(Q, 0.6, 0.84);
      const rBring = Q < 0.42 ? place(bring, P.bring.B, S.bring) : place(bring, P.bring.C, bIn);
      if (Q < 0.42) bring.el.style.opacity = String(E.enter(AQ.clamp01(S.bring)) * (1 - bOut));
      drawThread(TH.bring, { x: heroQ.x + heroQ.w, y: heroQ.y + heroQ.h * 0.62 }, { x: rBring.x, y: rBring.y + rBring.h / 2 },
        S.bringT, 1 - bOut);

      const rPk = place(pickup, lp(P.pickup.B, P.pickup.C, Q), S.pk);
      drawThread(TH.pk, { x: heroQ.x + lerp(56, heroQ.w * 0.5, Q), y: heroQ.y + heroQ.h },
        { x: rPk.x + lerp(56, rPk.w * 0.7, Q), y: rPk.y }, S.pkT, 1, { vertical: true });

      // Week-only dependencies arrive with the week
      const rField = place(field, P.field.C, sm(rng(Q, 0.68, 0.9)));
      const rGm = place(grandma, P.grandma.C, sm(rng(Q, 0.74, 0.96)));
      const spine = rng(Q, 0.82, 0.98);
      const sx = 458 + 16 + 32;
      drawThread(TH.spine1, { x: sx, y: rBring.y + rBring.h }, { x: sx, y: rField.y }, spine, 1, { vertical: true, dot: false });
      drawThread(TH.spine2, { x: sx, y: rField.y + rField.h }, { x: sx, y: rLeave.y }, spine, 1, { vertical: true, dot: false });
      drawThread(TH.pkDance, { x: rd.x + rd.w / 2, y: rd.y + rd.h }, { x: rPk.x + rPk.w * 0.22, y: rPk.y }, rng(Q, 0.72, 0.9), 1, { vertical: true });
      const tue = evAt("Tue", 17.5, 18.5, [0, 1], Q);
      drawThread(TH.grandma, { x: tue.x + tue.w / 2, y: tue.y + tue.h }, { x: rGm.x + rGm.w * 0.6, y: rGm.y }, rng(Q, 0.8, 0.96), 1, { vertical: true });
    }

    // ── Timeline ─────────────────────────────────────────────────────────
    const tl = gsap.timeline({ paused: true, onUpdate: render });
    const lin = { ease: "none" };

    // S1: frame 0 is complete; a barely-there lean-in (1.5%)
    tl.to(S, { drift: 0.015, duration: 1.1, ease: "power1.inOut" }, 0);

    // S2: one object. The question recedes while "Soccer Practice" is already rising in.
    tl.to(S, { tail: 1, duration: 0.3, ease: E.standard }, 1.0);
    tl.to(S, { mr: 1, duration: 0.5, ease: E.standard }, 1.02);
    tl.to(S, { mx: 1, duration: 0.62, ease: E.standard }, 1.05);
    tl.to(S, { my: 1, duration: 0.66, ease: E.standard }, 1.1);
    tl.to(S, { mf: 1, duration: 0.36, ease: "sine.inOut" }, 1.08);
    // text handoff timed against the fill: navy question sinks while the card is still light,
    // the white event rises as the card darkens enough to hold it. Strictly sequential: they never share a frame.
    tl.to(S, { qf: 1, duration: 0.09, ...lin }, 1.16);
    tl.to(S, { li: 1, duration: 0.18, ...lin }, 1.25);
    tl.to(S, { grid: 1, duration: 0.5, ease: E.standard }, 1.6);
    tl.to(S, { titleB: 1, duration: 0.6, ...lin }, 1.72);

    // S3: dependencies in time order — leave, who drives, what to pack, the open pickup
    tl.to(S, { brk: 1, duration: 0.34, ...lin }, 2.4);
    tl.to(S, { leave: 1, duration: 0.45, ...lin }, 2.52);
    tl.to(S, { dadT: 1, duration: 0.24, ease: E.standard }, 3.02);
    tl.to(S, { dad: 1, duration: 0.45, ...lin }, 3.14);
    tl.to(S, { bringT: 1, duration: 0.3, ease: E.standard }, 3.5);
    tl.to(S, { bring: 1, duration: 0.45, ...lin }, 3.64);
    tl.to(S, { pkT: 1, duration: 0.26, ease: E.standard }, 3.98);
    tl.to(S, { pk: 1, duration: 0.45, ...lin }, 4.1);

    // S4: one continuous pull-back, ending exactly at 7.2
    tl.to(S, { q: 1, duration: 2.6, ease: E.camera }, 4.6);

    // S5: stillness — nothing scheduled after 7.2 s.
    render();
    return { tl, render, S };
  };
})();
