# D01 · Real-UI capture record (2026-11-19)

**Result:** captured the real current flow automatically. Nothing was redrawn.

| | |
|---|---|
| Source | `actiqo/actiqo@main` **66ccdf64a03b50d3a0ae06129cb70912ca902331** (2026-11-19 18:58Z), fresh clone |
| Runtime | Temporary protected Vercel **Preview** `dpl_2HyEZoSL965KDKcXk3rAKBdYGdkV` (`actiqo-d01-capture-i70slxi7l-actiqo.vercel.app`) in a new isolated project `actiqo-d01-capture-tmp` with no Git link. **Deleted after capture**, together with its env vars and its automation-bypass secret. |
| Data | QA `actiqo-b1-qa` / `oqoqmzjldpefchegfqry` only. The existing D01 fixture was reused, signed in as Jordan. |
| Preview env (Preview target only) | `NEXT_PUBLIC_SUPABASE_URL`/`ANON_KEY` (QA), `SUPABASE_SERVICE_ROLE_KEY` (QA, sensitive, piped from `~/.actiqo-db-env`, never printed), `LEGAL_RECEIPT_SECRET` (random), and `NEXT_TELEMETRY_DISABLED`. Plus **inert placeholders** `TWILIO_AUTH_TOKEN`, `CRON_SECRET`, `DEBUG_SESSION_KEY` (random, approved), which exist only because `src/lib/startup-checks.ts` refuses to boot without them. There is no Twilio SID, Resend, Stripe, Firebase, APNs or production value. |
| Recorder | Headed Chrome on Xvfb, device emulation 432×768 CSS @2.5 → **1080×1920 px**, ffmpeg x11grab 30 fps lossless. Neutral UA, so there's no App Store sheet. Every host except the preview and QA Supabase is aborted (attempted and blocked: `vercel.live`, `www.clarity.ms`). Tooling: `gtm/scripts/qa-capture/` (`record.sh` → `record-x11.mjs`, `reset.mjs`, `exposure.mjs`). |

## Assets (`ui/capture/`)
| File | What |
|---|---|
| `d01_ui_flow_9x16.mp4` | 1080×1920, 30 fps, H.264 CRF 16, 24.97 s, the full flow |
| `d01_ui_flow_source.mkv` | The same take, **lossless** (libx264rgb `-qp 0`) |
| `d01_pickup_unresolved.png` | Game Plan: **Pickup · needs someone · Assign** · Who's doing what: **Drop-off · You** |
| `d01_pickup_picker.png` | **Pickup · Assignments › Pickup · "Who brings them home?"** · Same as lead / You (Owner) / **Alex (Admin)** / Not assigned |
| `d01_pickup_saved.png` | Game Plan: **Pickup · Alex · Saved · "Alex is picking up"** · Who's doing what: **Drop-off · You, Pickup · Alex** |

Beat timecodes are in `ui/beats.json`. `scene.mjs` resolves them to **full** mode.

## The real flow, as the product shows it today
Game Plan → **Who's doing what** → Assignments tab (Drop-off · You · Saved / Pickup · needs someone · **Assign**) → **Assign** opens the Assignments editor ("Applies to every Soccer Practice session (Tue & Thu)": Lead · Drop-off · Pickup · Backup) → **Pickup, Not assigned** → "Who brings them home?" → **Alex** → **Save assignments** → back to the Game Plan, which shows the saved state.

Copy differences from the brief: current `main` says **"Pickup · needs someone"**, not "No one on pickup". On this route the picker asks **"Who brings them home?"**. "Who will pick up Leo?" belongs to the separate Home "Assign pickup" sheet. Jordan's own leg reads **"Drop-off · You"**.

## Security checks (every run)
The scanner (`exposure.mjs`) took the service-role key and the receipt secret from env and compared them in memory. It covered every request URL, header and body; every response header and text body (≈145 per run); the page HTML; and local storage, session storage and cookies. Result on every run: **0 secret hits and 0 production-ref (`nbcscsepp…`) hits**. Supabase traffic went to QA only.

## Real save, and reset
- The save went through the product's own `POST /api/family-sync/config/save` → `200 {"ok":true,"scope":"permanent"}`. QA then showed **pickup = Alex, drop-off = Jordan**.
- The final take was the fourth save of the session (earlier takes were rejected for video quality). Each was undone through the same editor ("Not assigned" → Save assignments).
- **Final QA state: pickup NULL (unresolved), drop-off Jordan**, lead NULL, one fixture household.
- No `notifications`, deliveries, `sms_log`, `email_log` or change-signal rows reference the demo users or the activity.

## Finding: possible product bug
Right after **Save assignments**, the **Assignments tab still shows "Pickup · needs someone / Assign"**, while the Game Plan overview correctly shows "Pickup · Alex · Saved". It looks like the Assignments tab doesn't refresh after a save (current `main` 66ccdf6). It isn't used in the edit.

## Cleanup
- The Vercel project, both deployments, the env vars and the bypass secret are deleted.
- `/tmp` clone, runtime, frames, logs and password file are deleted.
- Jordan's QA password is rotated to an unstored random value.
- The temporary Playwright ffmpeg symlink is removed.
