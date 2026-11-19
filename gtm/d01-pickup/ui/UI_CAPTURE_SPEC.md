# D01 · Real UI: inventory and capture spec

## ✅ CAPTURED 2026-11-19 (automated, temporary QA Vercel preview of current main). See `CAPTURE_RECORD.md`. The notes below are history.

## ⛔ STATUS 2026-11-19 17:40Z (Option C): BLOCKED by machine memory (nothing captured, nothing fabricated)
**Done:**
- The QA household exists (`QA_DEMO_HOUSEHOLD.md`).
- The disposable `origin/main` 27a249258 copy in `/tmp` runs against QA. The service-role key and a fresh `LEGAL_RECEIPT_SECRET` were set **server-side only**; the client bundle was checked and is clean.
- Sign-in as Jordan works.
- The real consent gate ("Review and accept to continue") was accepted in the real UI. That writes 3 `legal_acceptances` rows in QA, which are immutable by design.

**Blocker:** the codespace has 8 GB RAM with about 3 GB available. An external watchdog SIGTERMs or SIGKILLs processes when available memory drops to about 1 GB. Every route the flow touches must compile in this app before Chrome can record, and that blows past the line:
- `next dev` (Turbopack, even with a 900 MB cache cap) was killed 9 times.
- `next dev --webpack` dropped the request.
- `next build` (Turbopack) was killed with SIGTERM.
- `next build --webpack` (1 CPU, no type-check, memory optimisations) was killed with SIGKILL at 577 MB available.
- Swap isn't permitted in this container. ptrace isn't permitted, so I couldn't trace the sender.

**Not used:** the `actiqo-qa30` Vercel deployment points at QA, but it runs a 4.0 release candidate from about 2026-11-04, not current `main`.

**Ways to unblock:**
1. Move to a **16 GB codespace** (machine type change), then re-run. Everything is scripted (`with-server.sh` + capture).
2. You record on a device or Simulator from the current build, signed in as **`d01-demo-jordan@example.com`** in QA. The password is in the scratchpad `d01-demo-creds.env`; I'll pass it to you out of band.
3. A Vercel **preview** deploy of current `main` against QA (needs your approval: it's a deploy).

## Earlier status (before Option C)
I was allowed to *run* `/workspaces/actiqo` (`origin/main` 27a2492) without modifying it. A legitimate capture of the real app with the Alex/Jordan/Leo household is blocked by:
1. **No app runtime credentials.** The app needs `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` (`env.example`). Neither exists in this environment. The only credentials present are DB URLs/passwords and a QA *service-role* key, which are not app-login credentials.
2. **No demo household or login.** There's no Alex/Jordan/Leo account on any backend I can reach. Creating one means writing users and household rows into the QA or production database with the service-role key. That's an outward write to a shared database, and you haven't authorised it, so I did not do it.
3. **The product repo has no dependencies installed** (`node_modules` is empty). Installing them inside `/workspaces/actiqo` would modify it. The workaround is a `git archive` export into `/tmp` (32 GB free), which is fine once 1–2 are solved.

**Not used (and why):** `/dev-preview/occurrence-d2` renders the *real* Game Plan and "Assign pickup" components, but with fixture data (different household names) and a **stubbed save**. It also refuses to run outside local dev or Vercel Preview. Using it for Alex/Jordan/Leo would mean editing fixtures, so it's a dev harness, not the current build. I'll use it only if you explicitly accept it.

**Ways to unblock (pick one):**
- **A (best):** you record the flow on a device or Simulator from the current TestFlight/App Store build, on a demo household, per the spec below.
- **B:** you give me a QA demo login for Alex (household already seeded: Jordan on drop-off, pickup open), plus the QA `NEXT_PUBLIC_SUPABASE_URL`/anon key in `/workspaces/actiqo-motion/.env`. I run an isolated export of `origin/main` in `/tmp` and record it headlessly at 390 px.
- **C:** you authorise me to seed that demo household into **QA** (never prod) with the service-role key. I'd show you the exact rows before writing any of them.


## What we already have (and why none of it is enough for D01)
| Asset | Where | Use in D01 |
|---|---|---|
| Brand tokens, Inter/Fraunces, FA7 icons (`person-walking` = pickup, `car-side` = drop-off, `people-group` = Game Plan) | `brand/` | ✅ End card, captions, any film-layer accents |
| Official wordmark (raster, flat teal Q) | `brand/logo/current/actiqo-wordmark-navy-teal_trimmed.png` | ✅ End card |
| Film 02 Game Plan and Assignments **SVG redraws** (verbatim copy: "Dad drop-off", "No one on pickup · Assign", "Grandma pickup · At 6:30 PM") | `film02/production/lib/gameplan.mjs` | ⚠️ **Animatic only.** They're drawn from 3.0 commit `ea2d7216`. Current main has since changed this UI (see below), and the brief needs real UI, not a redraw. |
| Production QA screenshots at 390 px | `brand/reference-screens/` | ❌ None shows Game Plan, Assignments or the pickup picker. They're also from September (3.0). |
| Film 02 review renders | `film02/production/film/out/` | ❌ Locked Film 02 picture, so we don't touch it. |

**Gap:** we have **no capture of the current Assignments task or the pickup picker**. Film 02 also noted that "the Assign editor … must be captured from a real build". On current main (`origin/main` 27a2492, 2026-11-18) this UI was reworked: `AssignmentsEditor.tsx` (RC-228-01, "Assignment 3.0"), `HomePickupAssign.tsx` (3.3 B2·03, marked *PROVISIONAL*), and both `structure/views.tsx` and `v3views.tsx` exist. **We must capture the build that is actually shipping when the ad runs.**

## The flow to capture (in current main's words)
1. **Activity:** Game Plan for *Leo · Soccer Practice*. The "Who's doing what" row shows `Jordan drop-off` and the open pickup `No one on pickup` (`assignmentCopy.ts` `legSentence`, `OPEN_PICKUP`).
2. **Responsibilities:** tap *Who's doing what* to open the **Assignments** task ("Who's handling this activity?"). It has rows **Lead · Drop-off · Pickup · Backup** and the scope choice *Every Soccer Practice session (…)* / *Just this session*. **Leave the scope on "Every … session"**, because that's what makes the VO line ("stay with the activity") literally true.
3. **Pickup assignment:** tap **Pickup** to open the single-role picker, **"Who will pick up Leo?"** Choose **"Alex will pick up Leo"** (or "I'll pick up Leo" if Alex is the recording account).
4. **Save:** tap **Save assignments** (or **Assign pickup** if the Home sheet path is used).
5. **Saved state:** the Game Plan "Who's doing what" now shows both legs. Hold for 3 s untouched.

## Capture request (what we need from you)
- **Device:** an iPhone screen recording (Control Centre ▸ Screen Recording) from the **current TestFlight/App Store build**, or an iOS Simulator recording (`xcrun simctl io booted recordVideo d01.mov`) on the same build.
- **Account:** a **demo household**, never a real family. The adults are **Alex** (woman, Adult A) and **Jordan** (man, Adult B), the child is **Leo**, and the activity is **Soccer Practice** with a real-looking time and place. Seed it so drop-off = Jordan and pickup = open.
- **Clean status bar:** in Simulator, `xcrun simctl status_bar booted override --time 9:41 --batteryLevel 100 --cellularBars 4 --wifiBars 3`. On a device: full battery, Do Not Disturb on, no notification banners.
- **Pace:** perform the flow **slowly and deliberately**. Pause about 1.5 s before every tap, and hold for 3 s on every settled screen. We retime in the edit, so slow is safe.
- **Takes:** 3 full takes. Also capture still screenshots (side button + volume up) of every settled screen.
- **Delivery:** drop the files in `gtm/d01-pickup/ui/capture/` (which is git-ignored for raw material). Note the build number in `ui/capture/BUILD.txt`.

## Verification before use (Gate 3)
For every screen used, check its copy against `origin/main` (`git show` in `/workspaces/actiqo`, read-only) and record it in `ui/UI_VERIFIED.md`. Any string that differs from code is a flag; it isn't something to "fix".
