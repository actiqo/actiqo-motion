# D02 · QA fixture plan (PROPOSED; nothing created yet)

**Target:** QA `actiqo-b1-qa` (`oqoqmzjldpefchegfqry`) only. Production (`nbcscsepp…`) is never touched.

## Reuse D01's household? No. Create a separate D02 fixture.
D01's household (`D01 Demo`, Jordan + Alex, Leo, Soccer Practice) could technically hold a prep list, but I don't recommend reusing it:
- **Reuse would change D01's fixture.** Adding items changes its Game Plan: "What to bring" goes from "Build the prep list · Set up" to "…· 0/3". Any future D01 re-capture would no longer match the locked D01 footage.
- **D01's pickup is deliberately open.** Pickup = NULL was the D01 story. With pickup open, the Game Plan button reads "Assign pickup", not "Ready check". The D02 frames would then show an unresolved pickup warning, which isn't D02's message.
- **D02 needs one adult, not two.** A separate fixture is small and cleanly tagged.

## Proposed D02 fixture
The pattern is identical to D01 (`ui/QA_DEMO_HOUSEHOLD.md` in d01): fixed IDs, a `gtm-d02-water-bottles` tag, and no deliverable side effects.

| Entity | How | Values |
|---|---|---|
| auth user | GoTrue admin (`email_confirm: true`, so no email is sent) | `d02-demo-parent@example.com`, `{full_name: "Sam", gtm_fixture: "d02-water-bottles"}`. The app shows this user as "You". |
| `public.users` | existing trigger, then this one row updated | timezone America/Chicago, setup complete, tour dismissed, every email/SMS/marketing flag off, phone null |
| `notification_preferences_v2` | existing trigger → all off | |
| `families` | SQL | id `d02de000-0000-4000-8000-0000000000f1`, owner Sam, name `D02 Demo`, metadata `{"fixture":"gtm-d02-water-bottles"}` |
| `family_members` | SQL | Sam `owner` |
| `children` | SQL | `…0000000000c1` **Leo** |
| `activities` | SQL | `…0000000000ac` **Soccer Practice**, Leo, 17:30, 75 min, Sport, native schedule, `notif_enabled false`. The weekday set must include the capture day, so the overview reads "Today". |
| `family_sync_configs` | SQL | enabled, **drop-off = Sam, pickup = Sam** (so the Game Plan shows "Ready check" and no pickup warning), all reminders off |
| Prep items | **through the real app UI**, signed in as Sam, *before* recording: Prep list → Edit → add "Water bottle", "Cleats", "Shin guards" (in that order, so the bottle is first) | `family_sync_checklist_items` ×3, no assignee ("Not packed" shows) |

## Prerequisites and checks
- **Legal terms:** Sam accepts the current legal terms once, through the real consent gate (as Jordan did in D01). That writes immutable `legal_acceptances` rows, which survive teardown.
- **Access:** open-launch access gives Family capability with no billing rows. No subscription, grant or Stripe activity.
- **Side effects:** none. No outbound credentials exist in the preview, the user has an `@example.com` address and no phone or devices, and the routes involved send nothing. `family_sync_change_signals` rows are the app's own realtime refresh, nothing more.

## Reset and teardown
- **After capture:** untick the items in the real UI (and Undo "I'm ready" if used), then rotate Sam's password to an unstored random value.
- **Teardown (later, on request):** delete by fixed ID in reverse order, then the auth user. `legal_acceptances` rows remain by design.
