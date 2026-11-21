# D02 · Real ACTIQO "What to bring" flow, and the capture beats

Read-only inspection of **`actiqo/actiqo@main` `dca1b87`** (2026-11-19 23:47 −05:00), from a fresh shallow clone in scratch. `/workspaces/actiqo` was not touched. Quoted strings are verbatim UI copy, cited by file:line.
⚠️ Main moves fast (D01 captured `66ccdf6` only hours earlier). Re-check this copy against the exact build that gets deployed for capture.

## The live views
`/dashboard/game-plan` picks its view from `?screen=`, with no feature flag (`page.tsx:609-617`):

| URL | View | Source |
|---|---|---|
| overview | `GamePlanV3View` | `page.tsx:875` |
| `screen=sync` | `SyncV3View` | `page.tsx:815` |
| `screen=ready` | `ReadyView` | `structure/views.tsx`, `page.tsx:861` |

The "What to bring" row in `structure/views.tsx:552` is legacy and not rendered.

## The flow, step by step
1. **Game Plan overview** ("Today's plan", or "Plan for Tue, Oct 6"). The "What to bring" row (`v3views.tsx:256-258`) shows:
   - **Sub-line:** the first item labels, e.g. "Water bottle, Cleats, Shin guards" (otherwise "Build the prep list").
   - **Right-hand value:** **"0/3"** (otherwise "Set up").
   - **Card accessory:** "Prep 0 of 3" (`:317`).
2. **Tap the row.** This goes to the workspace on its **"Prep list"** tab (`screen=sync&tab=prep`, `page.tsx:749`). The tabs are "Assignments" / "Prep list" / "Ready Check" (`v3views.tsx:412`).
3. **Prep list card** (`v3views.tsx:476-516`, copy in `views.tsx:189-198`):
   - **Before any taps:** headline **"3 items to pack"** / "Nothing checked off yet". Each item is a checkbox row whose right-hand label reads **"Not packed"** (or the assignee's name, if one is set).
   - **Tap "Water bottle":** **"1 of 3 packed"** / "2 items left". This saves at once, with a haptic.
   - **All three ticked:** **"Prep complete"** / **"Everything on the prep list is packed"**.
4. **Optional: Ready check.**
   - **Button:** "Ready check" at the bottom of the overview card (`v3views.tsx:224-227`). It only shows when pickup is assigned; otherwise the button says "Assign pickup".
   - **The screen** (`screen=ready`): "What to bring" toggles with "Packed" and "1 of 3 packed", then the primary button **"I'm ready"** ("Saves now, with Undo.").
   - **After tapping:** **"You're set."** with "Marked by you · 4:02 PM" and "Undo" (`views.tsx:849, 1010-1092`).
5. **Home Up Next card:** "X of Y packed" / "All packed" (`daily-snapshot/UpNextCard.tsx:696-717`). This is not needed for D02.

## How it differs from the brief's assumptions (use the real behaviour)
- **No suggested items.** There are no preset chips for Water bottle, Cleats or Shin guards; items are typed in the **Prep list** editor ("Add item — cleats, water, snack…", `editors.tsx:597-600`).
- **The list belongs to the activity.** It applies to every session, with no scope choice. The **packed** state is per session.
- **The resolved state is "Prep complete".** The packed state is a direct checkbox toggle. "I'm ready" / "You're set." is a separate, optional step.

## Persistence and side effects (for the fixture and reset)
**Items.** `POST/PATCH/DELETE /api/family-sync/checklist` writes `family_sync_checklist_items`:
- One item per label per config (unique index).
- DELETE archives the item.
- This route checks legal acceptance.

**Packed state.** `PATCH /api/family-sync/session-state` takes `{activityId, sessionDate, eventId, itemKey, checked}`:
- It writes `family_sync_instance_checklist_states`, and the session's `events` and instance rows on first write.
- "I'm ready" writes `family_sync_instance_states.ready_check_status`.

**Side effects.** No email, SMS, push or notification from either route. Database triggers update `family_sync_change_signals`, which is the app's own realtime refresh. The browser fires a window event and a haptic.

**Access.**
- Writes need `isFamilyPro`. On main, `LAUNCH_ACCESS_PHASE = 'open_launch'` (`lib/access/launch-access.ts:54`) gives every signed-in user Family capability, with **no plan, trial, grant or billing row**.
- Owner or Admin role is required to write.

## Automated capture beats (record slowly; the edit compresses)
| # | Beat | On screen (verbatim) | Hold |
|---|---|---|---|
| B1 | Activity context | Game Plan "Soccer Practice", "Leo · Today · 5:30–6:45 PM"; **"What to bring · Water bottle, Cleats, Shin guards · 0/3"** | 2.5 s |
| B2 | Open What to bring | tap the row → "Prep list" tab: **"3 items to pack" / "Nothing checked off yet"**, Water bottle first, all "Not packed" | 2.5 s |
| B3 | Water bottle unresolved | the same screen. Water bottle "Not packed" (the primary item, top row) | 1.5 s |
| B4 | Resolve | tap **Water bottle** → **"1 of 3 packed"**; then Cleats, then Shin guards, each about 1.2 s apart | 1.2 s each |
| B5 | Prepared | **"Prep complete" / "Everything on the prep list is packed"**, all three ticked | 3 s |
| B6 | (alt) Game Plan resolved | Back → overview: **"What to bring · 3/3"**, "Prep 3 of 3" | 2.5 s |
| B7 | (alt) Ready | "Ready check" → "I'm ready" → **"You're set."** | 2.5 s |

B6/B7 are captured for options only and aren't planned for the 9.5 s cut. Stills come from the same take: `d02_prep_unresolved.png` (B2), `d02_prep_bottle_packed.png` (B4) and `d02_prep_complete.png` (B5).

**Reset (real app behaviour only):** untick all three in the Prep list, and Undo the ready mark if B7 ran. That returns the session to "0/3". Items stay in place for re-takes.
