# qa-capture: real-UI capture of the current ACTIQO build against QA (D01)

These are disposable tools. The runtime lives **outside** the repo in `$D01_RUNTIME` (default `/tmp/d01-runtime`) and is deleted after a successful capture. Credentials, `.env.local` and the app copy are **never committed**.

| File | Role |
|---|---|
| `with-server.sh <cmd…>` | Starts `next dev` in the runtime copy, pre-compiles every route the flow uses, runs `<cmd>`, then stops the server. Everything happens inside **one** shell call, because this environment reaps detached processes after a call ends. |
| `lib.mjs` | Builds the browser context (QA + localhost only; every other host is aborted), hides Next's dev badge, and signs in as Jordan with `?next=` straight to the Game Plan |
| `explore2.mjs` | Dumps text, clickable elements and screenshots per step (used to find tap targets) |

## Rebuild the runtime (after a machine change)
1. `git -C /workspaces/actiqo archive origin/main | tar -x -C $D01_RUNTIME/actiqo-app`, then `npm ci` **there**. Never in `/workspaces/actiqo`.
2. `$D01_RUNTIME/actiqo-app/.env.local` (mode 600) gets only:
   - `NEXT_PUBLIC_SUPABASE_URL=https://oqoqmzjldpefchegfqry.supabase.co` (**QA `actiqo-b1-qa`**, never prod `nbcscsepp…`)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY=` QA anon key, from the Supabase connector's publishable keys
   - `NEXT_PUBLIC_APP_URL=http://localhost:3000`, `NEXT_TELEMETRY_DISABLED=1`
   - **server-only:** `SUPABASE_SERVICE_ROLE_KEY=` QA key (`~/.actiqo-db-env`), and `LEGAL_RECEIPT_SECRET=` a fresh random value of at least 48 bytes
   - **Never** Resend, Twilio, Stripe, Firebase or OpenAI keys: the runtime must not be able to send anything.
3. Jordan's QA password: reset it via the GoTrue admin API on the QA ref into `$D01_RUNTIME/d01-demo-creds.env` (`D01_PW=…`, mode 600).
4. On an 8 GB machine, the compiler is killed by the memory watchdog. Use a 16 GB machine.

## Household (already in QA; do not recreate)
See `gtm/d01-pickup/ui/QA_DEMO_HOUSEHOLD.md`. To re-take: set `family_sync_configs.handoff_pickup_user_id = NULL` on activity `d01de000-0000-4000-8000-0000000000ac` only.
