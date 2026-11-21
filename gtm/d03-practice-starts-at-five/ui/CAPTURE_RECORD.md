# D03 · Real-UI capture record (2026-11-21)

**Result:** the real current Manual leave-time flow, captured automatically in one continuous take. Nothing redrawn, composited or faked.

## Source and runtime
| | |
|---|---|
| Source | `actiqo/actiqo@main` **`dca1b87c9a81371c02bb36177da46e3b894f0f7e`** (re-checked against `origin/main` before capture; fresh read-only clone in scratch; `/workspaces/actiqo` untouched) |
| Runtime | Temporary protected Vercel Preview `dpl_FctdKkJesAjYQ62KzXkxjm2f2HeQ` (`actiqo-d03-capture-gfy77zm0c-actiqo.vercel.app`, target **preview**) in an isolated, Git-less project `actiqo-d03-capture-tmp` (`prj_6FkQsqtt5Yvu2bFfNhUftFgPtZEB`). **Deleted after capture** (API returns 404), with its deployments, env vars and the bypass secret. |
| D02 lessons applied | A static placeholder (`dpl_8KcFAsf9tQy2SWTaY3qMGE6d2XPe`, blank HTML) was the first, Production-target deployment, so the app never deployed to Production. The Next.js framework preset was set before the app deploy. The anon key was added as `--type config`. No incidents. |
| Preview env (Preview only) | QA `NEXT_PUBLIC_SUPABASE_URL` + anon key; `SUPABASE_SERVICE_ROLE_KEY` (QA, sensitive, piped and never printed); random `LEGAL_RECEIPT_SECRET`; inert random `TWILIO_AUTH_TOKEN` / `CRON_SECRET` / `DEBUG_SESSION_KEY` (required by `startup-checks.ts`); `NEXT_TELEMETRY_DISABLED`. **No** Twilio SID, Resend, Stripe, Firebase/APNs, HERE or production values. |
| Recorder | `gtm/scripts/qa-capture/d03.mjs` + `d03-record.sh`: headed Chrome on Xvfb, emulated 432×768 @2.5 → **1080×1920**, ffmpeg x11grab 30 fps lossless. Only the preview host and QA Supabase are reachable (`vercel.live` and `www.clarity.ms` blocked). |

## Fixture (QA `actiqo-b1-qa` only; new, isolated; D01/D02 fixtures untouched)
| Entity | Values |
|---|---|
| Auth user | `9d18378f-dac3-432d-aa27-42adcfea1162`, `d03-demo-parent@example.com` ("Sam"), created with `email_confirm: true` (no email sent) |
| `users` / `notification_preferences_v2` | Timezone Pacific/Honolulu, setup complete, every email/SMS/push/marketing flag off, phone null, **`allow_leave_time_reminder = false`** |
| Family / child | `d03de000-…f1` "D03 Demo" (`{"fixture":"gtm-d03-practice-starts-at-five"}`), Sam owner; child `…c1` Leo |
| Activity | `…ac` **Soccer Practice**, Tue/Thu/Sat **17:00**, 75 min, **`drive_min = 20`** (saved, manual), location name "Riverside Park" with no coordinates, `notif_enabled false`, **no `events` rows** (projected session) |
| Family sync | Enabled; drop-off and pickup = Sam; every reminder off |

**Capture day and clock:** Sat 2026-11-21, about 07:45 HST, so the session reads "Today · 5:00–6:15 PM" and 4:30 PM is hours away. No "Leave now" or countdown copy.

## ⚠️ Product truth found during capture: the pre-save Game Plan row
With a saved 20-minute drive and no saved leave time, the real Game Plan does **not** read "Leave time not set". It reads **"Leave by about 4:30 PM · Based on 20 min travel time · Change"**. This is the app's estimate from the saved drive time (`departureKind` → `estimated` when `driveMinutes > 0`; snapshot lead = drive + 10 min). There's no traffic and nothing dynamic.

"Leave time not set" only appears when no drive time is saved. In that case the sheet's suggestion becomes 4:50 PM, with "Starting point: a 10 min buffer. No drive time is included.", which would contradict the narration. **The 20-minute-drive take was used.**

## Take (`capture/`)
| File | What |
|---|---|
| `d03_ui_flow_9x16.mp4` | 1080×1920, 30 fps, H.264 CRF 16, 28.03 s |
| `d03_ui_flow_source.mkv` | the same take, lossless |
| `d03_leave_before.png` | Game Plan · **Leave by about 4:30 PM · Based on 20 min travel time** · Change |
| `d03_leave_sheet.png` | Leave time · **Manual** · Leave at 4:30 PM · **Preview: Leave by 4:30 PM** · 30 min before start · **Starting point: your saved 20 min drive + 10 min buffer.** · "This is a fixed leave time. It won't adjust for traffic, location changes, or current conditions." |
| `d03_leave_saved.png` | Game Plan · **Leave by 4:30 PM · Fixed leave time** · Change (toast cleared) |
| `beats.json` | gameplan 0.80, leaveTap (Change) 3.73, sheetOpen 4.57, saveTap 8.30 ("Saving…" 8.27–8.70), saveResponse 8.77, savedRow 8.79, **toast on 8.77 → fully gone 12.70** (measured from frames), end 27.98 |

**Write:** exactly one, `PUT /api/activities/d03de000-…ac/leave-default` → 200 (`leave_time_mode = manual`, `leave_time_minutes = 30`). Manual only; Automatic was never selected. No adjustment taps were needed, because the suggestion already equalled 4:30.

**Toast:** the real post-save toast reads "Leave-time reminders are off." The edit cuts from "Saving…" (src ≤ 8.70, before the sheet dismisses) straight to src ≥ 12.75, after the toast has fully cleared. The settled state is the real recording, not a fabricated clean frame.

## Security, side effects, reset
- **Exposure scan:** 0 service-role/secret hits and 0 production-ref hits on the record run. In the probe run, the one "hit" was the automation-bypass token in the recorder's own login URL. It's expected; the token was then dropped from the scan list.
- **Side effects:** 0 rows in `notifications`, `email_log`, `sms_log` and `notification_deliveries`; 0 devices; 0 events. Other writes were app housekeeping only: legal acceptance (the real consent gate, once), app session, analytics, household timezone.
- **Reset:** fixture-only SQL on the D03 activity row (`leave_time_minutes = null`, `leave_time_source = null`, mode `manual`), so the session is back to the pre-save state.
- **Cleanup:** Vercel project deleted (verified 404). Sam's password rotated to an unstored random value. `/tmp/d03-*` (source copy, runtime, credentials, logs) removed.
