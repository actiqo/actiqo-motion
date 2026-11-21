# D02 · Real-UI capture record (2026-11-21)

**Result:** the real current Prep list flow, captured automatically. Nothing was redrawn.

## Source and runtime
| | |
|---|---|
| Source | `actiqo/actiqo@main` **`dca1b87c9a81371c02bb36177da46e3b894f0f7e`** (fresh clone, read-only) |
| Runtime | Temporary protected Vercel Preview `dpl_GEMCJHQYvtd3XzZh7VXXsJKkTbGT` (`actiqo-d02-capture-rdgu0uds3-actiqo.vercel.app`) in an isolated, Git-less project `actiqo-d02-capture-tmp` (`prj_85O20QrRhGmwF5IHLDjqnoZEFmoc`). **Deleted after capture**, with all its deployments, env vars and the bypass secret. |
| Preview env (Preview only) | QA `NEXT_PUBLIC_SUPABASE_URL` + anon key; `SUPABASE_SERVICE_ROLE_KEY` (QA, sensitive, piped and never printed); random `LEGAL_RECEIPT_SECRET`; inert random `TWILIO_AUTH_TOKEN` / `CRON_SECRET` / `DEBUG_SESSION_KEY` (required by `startup-checks.ts`, same as D01); `NEXT_TELEMETRY_DISABLED`. No Twilio SID, Resend, Stripe, Firebase/APNs or production values. |
| Data | QA `actiqo-b1-qa` only, with the new D02 fixture (`QA_FIXTURE_PLAN.md`): auth user `896b89b3-5cd3-4ea9-bb4c-9ad7445118b2` (`d02-demo-parent@example.com`, "Sam"), family/child/activity/config IDs `d02de000-…`. The household clock is Pacific/Honolulu, so Friday's 5:30 PM session was still upcoming at capture time. |
| Recorder | `gtm/scripts/qa-capture/d02.mjs` + `d02-record.sh`: headed Chrome on Xvfb, emulated 432×768 @2.5 → **1080×1920**, ffmpeg x11grab 30 fps lossless. Only the preview host and QA Supabase are reachable. |

## Deployment incidents (all on the temporary project, all resolved)
1. **Accidental production deployment.** The first `vercel deploy` of a new project goes to Production. `dpl_F3EddK813uvundirtXST9UEg5Tur` was deleted within about 3 minutes. It had **no env vars** (all vars were Preview-only), so it couldn't reach any database or service.
2. **Placeholder deployment.** Vercel then refused a Preview while the project had no deployments. A one-file static placeholder (`dpl_ELkofMkr3kKuf4BkZpmVLvA6Q6o5`: blank HTML, no app, no crons) became the first deployment.
3. **Framework preset.** The first app Preview (`dpl_AsnRwB1VT9jbbA6DwoWKQGmEwwFj`) ran without the Next.js preset (`MIDDLEWARE_INVOCATION_FAILED`). The project setting was changed to `nextjs` and the app redeployed.

All of these were deleted with the project.

## Fixture writes (real app UI)
The three prep items were added through the real **Prep list** editor (`POST /api/family-sync/checklist` ×3, 200), in this order: Water bottle, Cleats, Shin guards. Sam accepted the current legal terms once through the real consent gate.

## Capture
| File | What |
|---|---|
| `d02_ui_flow_9x16.mp4` | 1080×1920, 30 fps, H.264 CRF 16, 16.53 s |
| `d02_ui_flow_source.mkv` | the same take, lossless |
| `d02_gameplan_unresolved.png` | Game Plan · **What to bring · Water bottle, Cleats, Shin guards · 0/3** · "Prep 0 of 3" |
| `d02_prep_unresolved.png` | Prep list · **3 items to pack** · Nothing checked off yet · all "Not packed" |
| `d02_prep_bottle_packed.png` | **1 of 3 packed** · 2 items left · Water bottle ticked |
| `d02_prep_complete.png` | **Prep complete** · Everything on the prep list is packed |
| `d02_gameplan_resolved.png` | Game Plan · **What to bring … 3/3** · "Prep 3 of 3" |
| `beats.json` | seconds into the mp4: gameplan 0.80, whatToBringTap 3.508, prepOpen 4.334, bottleTap 7.030, bottlePacked 7.084, cleatsTap 8.978, shinTap 10.218, prepComplete 10.262, backTap 13.564, gameplanResolved 13.619, end 16.525 |

Each tick was a real `PATCH /api/family-sync/session-state` (×3, 200). Items are only ticked by the user; the app does not suggest or pack anything.

## Security
`exposure.mjs` scanned every run (setup ×2, record, reset): **0 service-role/secret hits, 0 production-ref hits**. Hosts reached: the preview and QA Supabase. `www.clarity.ms` (analytics) was attempted and blocked.

## Reset and side effects
- **Reset:** unticked through the real Prep list (`session-state` PATCH). QA now shows all three items `checked = false`. The items remain for re-takes.
- **Side effects:** none. 0 `notifications`, `email_log`, `sms_log` or `notification_deliveries` rows for Sam. One `family_sync_change_signals` row (the app's own realtime refresh).
- **Cleanup:** the Vercel project is deleted, Sam's password is rotated to an unstored random value, and `/tmp/d02-*` (the source copy, runtime, credentials and logs) is removed.
