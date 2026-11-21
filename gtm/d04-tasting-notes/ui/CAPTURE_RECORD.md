# D04 · Real-UI capture record (2026-11-21)

**Result:** ONE real current ACTIQO Game Plan showing all three ideas together: **leave time saved**, **pickup saved**, **What to bring populated**. Captured automatically in one continuous take. Nothing was redrawn or faked.

## Source and runtime
| | |
|---|---|
| Source | `actiqo/actiqo@main` **`c81c64e1490771b4372af3bbd4f5960265102049`** (fresh shallow, read-only clone in scratch; `/workspaces/actiqo` untouched). Since `dca1b87` the only commits are an image upload and its deletion; `src/`, `supabase/` and `package.json` are **identical** (checked with `git diff --quiet`). |
| Runtime | Temporary protected Vercel Preview `dpl_FvsLV4N4xik3UEKcvJ4aau7MoXNw` (`actiqo-d04-capture-ciffzbbf9-actiqo.vercel.app`, target **preview**) in the isolated, Git-less project `actiqo-d04-capture-tmp` (`prj_bJ1A7GnES049IoGNVTVbebbWwwtB`). **Deleted after capture** (API 404), with its deployments, env vars and bypass secret. |
| Applied lessons | A static placeholder (`dpl_6zBiqWr159qnC8UBCG5kKmhd6f1k`) was the first, Production-target deployment, so the app went only to Preview. Next.js preset set before the deploy. Anon key added as config. No incidents. |
| Preview env (Preview only) | QA `NEXT_PUBLIC_SUPABASE_URL` + anon key; `SUPABASE_SERVICE_ROLE_KEY` (QA, sensitive, piped and never printed); random `LEGAL_RECEIPT_SECRET`; inert random `TWILIO_AUTH_TOKEN` / `CRON_SECRET` / `DEBUG_SESSION_KEY`; `NEXT_TELEMETRY_DISABLED`. **No** production values, Twilio SID, Resend, Stripe, Firebase/APNs or HERE. |
| Recorder | `gtm/scripts/qa-capture/d04.mjs` (`MODE=setup` headless, `MODE=record` via `d04-record.sh` on Xvfb): emulated 432×768 @2.5 → **1080×1920**, ffmpeg x11grab 30 fps lossless. Only the preview host and QA Supabase are reachable (`vercel.live` and `www.clarity.ms` blocked). |

## Fixture (QA `actiqo-b1-qa` only; NEW and isolated; the D01–D03 fixtures are untouched)
| Entity | Values |
|---|---|
| Auth user | `aa3f48dd-ca72-4c84-9bf8-e4b6b7d10dac`, `d04-demo-parent@example.com` ("Sam", shown as "You"). Created with `email_confirm: true`, so no email was sent. |
| Prefs | Pacific/Honolulu. Every email/SMS/push/marketing flag off, phone null, `allow_leave_time_reminder = false`. |
| Family / child / activity | `d04de000-…f1` "D04 Demo" (`{"fixture":"gtm-d04-tasting-notes"}`) · Leo · **Soccer Practice**, Tue/Thu/Sat **17:00**, 75 min, saved drive 20 min, no coordinates. **No `events` rows.** |
| Pickup (saved) | Family-sync config: drop-off **and pickup = Sam**, all reminders off. Set as a fixture row (same pattern as D02/D03), so the real Game Plan shows **"Pickup · You · Saved"**. |
| What to bring | **Added through the real Prep list editor** (`POST /api/family-sync/checklist` ×3 → 200): Water bottle, Cleats, Shin guards |
| Leave time | **Saved through the real Leave time sheet** (Manual, "Preview: Leave by 4:30 PM", saved 20 min drive + 10 min buffer → **Save leave time**, `PUT …/leave-default` → 200; `manual`, 30 min) |

**Capture day:** Sat 2026-11-21, about 10:36 HST. The session reads "Today · 5:00–6:15 PM", so no "Leave now" or countdown copy.

## Take (`capture/`)
| File | What |
|---|---|
| `d04_ui_flow_9x16.mp4` | 1080×1920, 30 fps, H.264 CRF 16, 16.53 s |
| `d04_ui_flow_source.mkv` | the same take, lossless |
| `d04_gameplan_all_three.png` | Game Plan · Soccer Practice · Leo · Today 5:00–6:15 PM · **Leave by 4:30 PM · Fixed leave time** · Today's plan · **Pickup · You · Saved** · Who's doing what · **What to bring · Water bottle, Cleats, Shin guards · 0/3** · Prep 0 of 3 |
| `d04_prep_list.png` | Prep list · **3 items to pack** · Water bottle / Cleats / Shin guards · Not packed |
| `d04_gameplan_return.png` | Back on the Game Plan (the same settled state) |
| `d04_row_leave.png`, `d04_row_pickup.png`, `d04_row_bring.png` | Full-width real row crops (labels, chevrons, "Change" and "0/3" intact), for reference |
| `d04_ui_flow_contact.png` | Contact sheet (2 fps) |
| `beats.json` | gameplan 0.80 (settled, held 6.1 s), whatToBringTap 6.93, prepOpen 7.26 (held 4.6 s), backTap 11.86, gameplanAgain 11.91 (held 4.6 s), end 16.52 |

**Writes during the recorded take:** none to product data. Only app housekeeping: app session, analytics, household timezone.

## Security, side effects, cleanup
- **Exposure scan** (setup + record): **0** service-role/secret hits, **0** production-ref hits.
- **Side effects:** 0 rows in `notifications`, `email_log`, `sms_log` and `notification_deliveries`; 0 devices; 0 events. Legal acceptance via the real consent gate, once.
- **Fixture state kept (documented):** the saved leave time (manual, 30) and the three prep items stay on this isolated D04 fixture, so a re-take needs no setup. Teardown (on request) deletes by the fixed `d04de000-…` IDs, then the auth user.
- **Cleanup:** Vercel project deleted (verified 404). Sam's password rotated to an unstored random value. `/tmp/d04-*` (source, runtime, credentials, logs) removed.
- **No production credentials or data were involved.**
