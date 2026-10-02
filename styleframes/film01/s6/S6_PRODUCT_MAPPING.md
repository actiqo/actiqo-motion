# Film 01 · S6 (8.0–10.8 s): product-truth mapping and choreography

**Status:** styleframes for approval. S6 is not animated. S1–S5 are locked at v02-1 and were not touched.

## Source of truth

- I read `/workspaces/actiqo` read-only, using `git show` and `git grep` only. No checkout and no fetch.
- The local checkout (`fix/rsvp-summary-delivery-authority`, 2026-09-10) is three weeks stale.
- I used **`release/3.0-integrated-candidate`** (29e538253, 2026-09-30 22:07). It is the newest 3.0 implementation: 348 commits ahead of `origin/main`, which is only 14 commits ahead of it, all "Add files via upload".

| Surface | File (on that ref) | Last change |
|---|---|---|
| Game Plan overview (`GamePlanView`, `IdentityCard`, `LeaveByLine`) | `src/components/game-plan/structure/views.tsx` | 2026-09-30 |
| Game Plan route wiring (labels, leave sub-line, `who.parts`) | `src/app/(dashboard)/dashboard/game-plan/page.tsx` | 2026-09-30 |
| Responsibility summary and copy (`Dad drop-off`, `No one on pickup`) | `src/components/game-plan/assignmentSummary.ts`, `assignmentCopy.ts` | 2026-09-28 |
| Row / card / section kit | `src/components/activity-home/ui.tsx` | 2026-09-26 |
| Home Next Up hero (status strip, responsibility line, CTA) | `src/components/daily-snapshot/UpNextCard.tsx`, `src/components/home/next-up-model.ts`, `NextUpStatusStrip.tsx` | 2026-09-28 → 30 |
| Day-level watchout copy (sibling conflicts) | `src/lib/daily-snapshot/variant-logic.ts` | — |
| Time and date formats | `src/lib/event-time.ts` (`formatEventTime` gives `4:48 PM`; weekday gives `Thu`) | — |

## Product mapping (S5 peak → S6)

The scenario: Thursday, Leo's soccer practice. The leave time is saved on Automatic. Dad is the explicit drop-off, and no lead or pickup is set. The prep list is Cleats and Shin guards, neither packed.

| # | Abstract element (S5) | Real destination | Exact real label or component | Source | S6 treatment |
|---|---|---|---|---|---|
| 1 | Hour Block · **Soccer Practice** | Game Plan session card (`IdentityCard`) | **Leo — Soccer Practice** · 📅 **Thu 5:30 PM** · 📍 location | `views.tsx` IdentityCard (strong 15/600; supporting 14) | **Becomes** the card. The navy block rises and re-sets its content, then flips navy → white. That flip deliberately echoes the S2 morph. |
| 2 | **Leave by 4:48 PM** | The session card's green leave band (`LeaveByLine`) | **Leave by 4:48 PM** in Fraunces 18/24, green ink, with the sub-line **32 min drive**. Today's weather is appended only when live data exists; omitted here. | `views.tsx` LeaveByLine; `page.tsx` `leaveSubText` | **Docks** as the band. It is the same green family, so the semantic is continuous. |
| 3 | **Dad driving** | "Who's doing what" row | **Who's doing what** · **Dad drop-off** | `views.tsx` Row; `assignmentSummary.ts` → `legSentence('Dad','drop-off')` | **Peels off** the leave card and settles into the row. The copy becomes the product's own wording, **"Dad drop-off"**; the product never says "Dad driving" on this screen. |
| 4 | **What to bring** · Cleats, shin guards | "What to bring" row | **What to bring** · **Cleats, Shin guards** · value **0/2**; the section accessory reads **Prep 0 of 2** | `views.tsx` Row + `prep.labels` | **Travels** into row 2. It is already row-shaped in flight. |
| 5 | **Moved to Field 7** · Usually Field 4 | The session card's location line **only** | 📍 **Field 7**. This is the occurrence's own location (`occurrenceEvent.location ?? activity.locationName`). | `page.tsx` identity mapping | **Partial.** "Field 7" lands in the location line and **"Usually Field 4" dissolves in flight**. ACTIQO has no per-session location-change concept, so it would not say "moved". |
| 6 | **Pickup · 6:30 PM — No one assigned yet** | Not on the Game Plan overview (see problems §1). The real home is the Assignments tab: **No one on pickup** · **Assign** (orange). | — | `views.tsx` SyncView L371 | **Stays outside**, still orange, as the film's abstract chip. It is tethered by a dashed orange thread to "Who's doing what", the real entry point to Assignments. It is not resolved and not turned green. This sets up S7. |
| 7 | **Maya · Dance · 5:15** (sibling overlap) | **None** on Game Plan, which is scoped to one activity | — | — | **Removed** with the rest of the week context during 8.0–8.6 s. Not absorbed anywhere. |
| — | Pickup · Tue · Grandma | Tuesday's own session, not this plan | — | — | Fades out with the week. |

The Game Plan rows I omitted are Snack Rotation (it always renders, and would say "Set up"), Caregivers and the **Ready Check** button. That is cropping for legibility, not a redesign. Nothing was added, relabelled or re-ordered.

## Choreography (8.0 → 10.8 s): density → organization → calm

| Time | What happens |
|---|---|
| 8.00–8.60 | **Context recedes.** The other days' blocks, Maya's dance, the Tuesday pickup chip and its thread, the day headers and "This week" fade, in order of distance from Thursday. The dance → pickup thread goes with them. Only Thursday's chain stays. |
| 8.20–9.20 | **Camera returns to Thursday.** This is the reverse of the S4 pull-back and uses the same curve. The hour grid spreads, then drops to about 20% and then 0 as product layout takes over; ACTIQO UI has no time grid. |
| 8.60–9.40 | **The Hour Block becomes the session card.** It rises into the card slot and widens to the card's width, and its content re-sets line by line into the product's fields. The navy → white inversion runs at 9.1–9.4 with the contrast flip used in S2: the object stays one object. |
| 8.80–9.40 | **Leave-by docks** as the card's green band. The Fraunces "Leave by 4:48 PM" is already the product copy; "32 min drive" arrives last. |
| 8.90–9.50 | "Dad driving" peels off the leave card and travels down into **Who's doing what**, re-setting as **Dad drop-off**. At the same time, "Moved to Field 7" shrinks into the location line and "Usually Field 4" dissolves in flight. |
| 9.00–9.60 | **What to bring** flies into row 2. The plan card's surface assembles *around* the arriving rows rather than appearing first. |
| 9.20–9.60 | **"Game Plan"** (Fraunces page title) and **Today's plan · Prep 0 of 2** breathe in. The real UI is fully legible by about 9.5 s. |
| 9.30–9.80 | **Pickup holds orange** and settles below the plan. Its dashed thread re-anchors to "Who's doing what". |
| 9.80–10.80 | **Calm.** No movement after about 10.0 s: a true hold, the rhythm slowing as clarity arrives. |

Motion rules are the approved system: the ACTIQO enter curve for arrivals and the standard curve for structural moves. There is no spring, no glow, no device frame and no screenshot fade.

**Device frame: A, isolated surface. Recommended.** The Game Plan page canvas is `#FCFAF7`, the film's own ivory, so the real UI can sit directly in the brand world. A phone frame would add nothing to comprehension and would make the product smaller.

**Scale:** the real UI is set at 2.3× its phone point sizes. The content column is 358 pt → 823 px, from x 84 to 907, clear of the Reels right rail. Everything critical sits between y 300 and 1300.

## Product-truth problems found

1. **The Game Plan overview does not flag an open pickup.**
   - With Dad on drop-off and no lead, "Who's doing what" reads only **"Dad drop-off"**, and no attention value appears (`value` is set only when there are no parts).
   - The gap is stated in two other places:
     - the Assignments tab (**No one on pickup · Assign**);
     - the Home Next Up hero (**Game Plan · Pickup unassigned**, with CTA **Open game plan →**).
   - That's why pickup stays outside the surface in S6. The honest options for S7 are:
     - **(a)** go into the real Assignments tab and resolve the pickup there (recommended);
     - **(b)** accept that the overview doesn't flag the gap and say it only through the film layer, as now.
   - Worth a product conversation independent of the film.
2. **"Dad driving" is not product copy.** Game Plan says **"Dad drop-off"**. The Home hero doesn't show Dad at all in this scenario; with no lead, its responsibility line reads **"Assign someone →"**. S6 re-sets the label to the product's words.
3. **There is no "location changed" concept.** The product shows the session's location but doesn't know it moved. "Usually Field 4" cannot resolve truthfully. The only honest alternative is a parent-written **Watchout** such as "Field 7 this week". That would be user content, and I did not use it.
4. **Sibling conflicts are not a Game Plan concept.** The only conflict copy is Home's day-level watchout ("Pickup conflict — two routes within 10 min"). It **would not fire** for our 6:15 and 6:30 pickups, because they are 15 minutes apart.
5. **Prep does not appear on the Home hero** when a pickup is uncovered: the unresolved responsibility takes the single attention slot (`next-up-model.ts attentionCell`). That's why S6 uses Game Plan, not Home, as its destination.
6. **Leave-by sub-line differs.** The abstract chip said "32 min drive + 10 min buffer"; Game Plan says only **"32 min drive"**. Buffer wording lives in the leave-time sheet, so S6 uses the Game Plan copy.
7. **The rebuild is from source, not a capture.** No rendered capture of the current Game Plan overview exists in the repo (the only capture is the August Home). The S6 surface is rebuilt from the release-branch source at exact token values. **Please compare it against a real 3.0 device screenshot before animation.** I can't run the app without writing to the production repo.

## S1–S5 information that cannot truthfully resolve into Game Plan

- **"Usually Field 4"**, the change history: dissolves.
- **Maya · Dance** and the sibling overlap: fades with the week.
- **Tuesday · Grandma pickup**: another session, so it fades with the week.
- **"+ 10 min buffer"**: not on the Game Plan leave line.
- **"Pickup · No one assigned yet"**: has no home on the Game Plan *overview*. It remains a film-layer chip, deliberately unresolved, for S7.
