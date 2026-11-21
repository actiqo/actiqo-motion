# D03 · Real ACTIQO leave-time flow and the capture beats

Read-only inspection of **`actiqo/actiqo@main` `dca1b87`** (fresh shallow clone in scratch; `/workspaces/actiqo` untouched). Quoted strings are verbatim UI copy, with file:line.

## Entry point
**Game Plan overview** (`GamePlanV3View`): row `GpV3Leave` (`v3views.tsx:137-166`, copy `:39-40`) reads **"Leave time not set"**, with a **"Set leave time"** button. Tapping it sets `editor='leave'` (`page.tsx:438-442`) and mounts **LeaveTimeSheet** (`page.tsx:661-698`), a bottom sheet at ≤768 px.

## Leave time sheet (Manual)
**Header:**
- **Title:** **"Leave time"**, with "Cancel".
- **Subtitle:** "{Activity} · {Child} · {Thu Oct 22} · {5:00 PM}".

**Mode:** radiogroup "Leave time mode": "Automatic" / **"Manual"**. Manual is the default when nothing is saved (`LeaveTimeSheet.tsx:288-293`).

**Manual body** (`components/events/leave-time/views.tsx:452-497`):
- **"Leave at"** (time field).
- **Result:** **"Preview: Leave by 4:30 PM"** · **"30 min before start · adjust to fit your trip"**.
- **"Minutes before start"**, with −/+ 5 min buttons.
- **Basis:** **"Starting point: your saved 20 min drive + 10 min buffer."** With no saved drive it reads "Starting point: a 10 min buffer. No drive time is included."
- **"This is a fixed leave time. It won’t adjust for traffic, location changes, or current conditions."**
- **No coordinates:** "Add activity location" / "Add a location to enable automatic leave time." This is real UI; it's left visible, not used.

**Suggested time:** `start − (drive_min + 10)` (`LeaveTimeSheet.tsx:268, 574`; `AUTOMATIC_ARRIVAL_BUFFER_MIN = 10`).

**Scope:**
- **Projected session (no event row):** no choice. "Saves this leave time for every Soccer Practice session." (`:526-528`)
- **Real event row:** "Just this session" / "Every Soccer Practice session".

**Reminder (optional):**
- **Toggle:** "Leave time reminder".
- **On web:** "This device doesn’t receive ACTIQO reminders.", or with the toggle off "Leave by 4:30 PM — reminder off."

**Primary button:** **"Save leave time"** ("Saving…" while saving).

## After saving
- **Toast:** a warning toast restates the reminder line (`leave-save.ts:201-203`).
- **Game Plan row:** **"Leave by 4:30 PM"** · **"Fixed leave time"**, plus "Change" (`page.tsx:490-497`, `v3views.tsx:153-158`). Weather is appended only when the session is today and data exists.
- **Time-relative copy to avoid in frame:**
  - "Leave now" once the leave time has passed.
  - The Ready check's ticking "Leave in N min".

## Persistence and side effects
- **Projected session:** `PUT /api/activities/{id}/leave-default` `{mode:'manual', minutes:30}` writes `activities.leave_time_mode/leave_time_minutes/leave_time_source`.
- **Real event:** additionally `PUT /api/events/{id}`. That isn't used in D03, which has no event rows.
- **Traffic:** a Manual save never calls traffic; the monitor only processes `leave_time_mode='auto'` rows.
- **Reminders:** the leave-time reminder (checkin-scheduler) only acts on real event rows, with `allow_leave_time_reminder` not false. The D03 fixture has neither, so nothing fires.
- **Outbound:** no email fallback and no SMS path exist for leave-time reminders.
- **Access gates:** Manual works on every plan. The write path checks legal acceptance and Owner/Admin role.

## Capture beats (one continuous take, recorded slowly; the edit compresses waiting only)
| # | Beat | On screen (verbatim) | Hold |
|---|---|---|---|
| B1 | Plan context | Game Plan · Soccer Practice · "Leo · Today · 5:00–6:15 PM" · **"Leave time not set" · "Set leave time"** | 2.5 s |
| B2 | Open | tap **Set leave time** → sheet **"Leave time"**, Manual selected | 1.5 s |
| B3 | The math | **"Preview: Leave by 4:30 PM" · "30 min before start" · "Starting point: your saved 20 min drive + 10 min buffer."** | 3.0 s |
| B4 | Save | tap **Save leave time** | — |
| B5 | Payoff | (the toast clears) Game Plan: **"Leave by 4:30 PM" · "Fixed leave time"** | 3.5 s |

**Stills:** `d03_leave_unset.png` (B1), `d03_leave_sheet.png` (B3), `d03_leave_saved.png` (B5).
**Reset:** clear the saved leave default through the UI if possible; otherwise by SQL on the D03 activity row only.
