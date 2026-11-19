# D01 · QA demo household (Option C, authorised 2026-11-19)

## Target: QA only
| | QA (used) | Production (never touched) |
|---|---|---|
| Supabase project | **`actiqo-b1-qa`** · ref `oqoqmzjldpefchegfqry` | `actiqo-prod` · ref `nbcscseppzzdfhmihvfl` |
| DB connection | `~/.actiqo-db-env` → `ACTIQO_QA_DB_URL` (user `postgres.oqoqmzjldpefchegfqry`) | `ACTIQO_PROD_DB_URL`: not used |
| App runtime | `NEXT_PUBLIC_SUPABASE_URL=https://oqoqmzjldpefchegfqry.supabase.co` + QA **anon** key (from the Supabase connector's publishable keys) | ⚠️ `/workspaces/actiqo/.env.local` points at **production**, so it is **not used** |

**Side-effect check on QA:**
- QA has no `cron.job` rows and no `pg_net` / `supabase_functions` webhook triggers.
- The disposable app runtime gets **no** Resend, Twilio, Stripe, Firebase or OpenAI keys, so it cannot send email, SMS, push or payments.
- The demo users have no phone, no devices, `@example.com` addresses (a reserved domain that never delivers), and every reminder and notification flag off.

## Entities created (all new; no existing row is updated or deleted)
| Entity | How | Values |
|---|---|---|
| auth user **Jordan** | GoTrue admin API (`email_confirm: true`, so no email is sent) | `d01-demo-jordan@example.com`, metadata `{full_name: "Jordan", gtm_fixture: "d01-pickup"}` |
| auth user **Alex** | same | `d01-demo-alex@example.com`, metadata `{full_name: "Alex", gtm_fixture: "d01-pickup"}` |
| `public.users` ×2 | created by the existing `handle_new_user` trigger, then updated on **these two rows only** | name / first_name, `timezone America/Chicago`, setup complete, tour dismissed, every email/SMS/marketing flag false, phone null |
| `notification_preferences_v2` ×2 | created by the existing trigger, then set to all-off | — |
| `families` | SQL | id `d01de000-0000-4000-8000-0000000000f1`, owner **Jordan**, name `D01 Demo`, `metadata {"fixture":"gtm-d01-pickup"}` (the same tagging convention as existing QA fixtures) |
| `family_members` ×2 | SQL | Jordan `owner`, Alex `admin` |
| `children` | SQL | id `…0000000000c1`, **Leo**, family above |
| `activities` | SQL | id `…0000000000ac`, **Soccer Practice**, Leo, Tue+Thu 17:30, 75 min, Sport, native schedule, `notif_enabled false` |
| `family_sync_configs` | SQL | activity above, `enabled true`, **drop-off = Jordan, pickup = NULL (unresolved)**, lead NULL, `handoff_pickup_follows_lead false`, all reminders off |

**Why Jordan's account records:** the app shows the signed-in user as "You". Recording as Jordan puts the name **Alex** on screen ("Alex will pick up Leo" → "Alex pickup"). Jordan's own row reads "You're on drop-off".

**Then, through the real UI only:** Jordan signs in with a password, accepts the current legal terms if the app asks (real user flow), and performs the assignment on camera. The save goes through the real `/api/family-sync/config/save`.

## Created so far (2026-11-19)
- Auth users: Jordan `dfd343b6-b66d-4d93-94a6-0c9656ae8bd2`, Alex `1a283aef-4eb1-4986-ad07-03884c4baf9e`
- All rows above. Verified: Jordan owner, Alex admin, drop-off = Jordan, pickup NULL, 4/4 activity notification configs off
- Via the real UI as Jordan: 3 `legal_acceptances` rows from one consent-gate acceptance (terms, privacy, account attestation). That table refuses deletes and updates by design, so it **survives teardown**.

## Teardown (NOT run; for later)
Delete in reverse order by the fixed ids above, then the two auth users by email via the admin API. Only rows tagged `gtm-d01-pickup` or created for these two users are in scope.
