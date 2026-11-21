# D03 "Practice Starts at Five": checkpoint brief (2026-11-21, nothing generated, deployed or captured)

**Idea:** practice starts at 5:00. We don't leave at 5:00.
**Proof:** the real ACTIQO leave-time sheet turns a saved 20-minute drive plus a 10-minute buffer into **Leave by 4:30 PM**, and the plan shows it.
**Format:** 9:16, about **10.7 s**, one primary version. Content ID **`d03_leave430`**. Public CTA: getactiqo.com.

## 1. Current leave-time behaviour on main (`actiqo/actiqo@main` dca1b87; read-only clone)
Full UI path and copy: `ui/UI_FLOW.md`.

**The row:** Game Plan shows **"Leave time not set"**, with a **"Set leave time"** button (`v3views.tsx:137-166`).

**The sheet:** tapping it opens the **"Leave time"** sheet (`LeaveTimeSheet.tsx`):
- **Mode:** "Automatic" / **"Manual"**. Manual is the default when nothing is saved.
- **Suggestion:** **Manual pre-fills a suggestion: start − (the activity's saved drive minutes + a fixed 10-minute buffer)** (`LeaveTimeSheet.tsx:268, 574`; buffer `AUTOMATIC_ARRIVAL_BUFFER_MIN = 10`).
- **For 5:00 PM with a saved 20-minute drive:** "Preview: Leave by 4:30 PM" · "30 min before start · adjust to fit your trip" · **"Starting point: your saved 20 min drive + 10 min buffer."**
- **Fine-tuning:** the user can adjust in 5-minute steps or pick another time.
- **On screen:** **"This is a fixed leave time. It won't adjust for traffic, location changes, or current conditions."**

**Save:** **"Save leave time"**. The Game Plan row then reads **"Leave by 4:30 PM" · "Fixed leave time"**, with a "Change" link. The saved leave time also shows on the Ready check and the Home strip.

**Automatic:** this is a separate mode. It needs activity coordinates, device location and a HERE traffic key (`HERE_API_KEY`). **None of that is used by Manual, and it won't be used or shown as the method in D03.**

## 2. Is the "manual 4:30 leave time" claim accurate? **Yes, with one precision.**
- **The time:** it's a **manually saved, fixed** leave time.
- **The suggestion:** the 4:30 comes from the activity's **saved** drive time (entered by the family) plus ACTIQO's fixed 10-minute buffer. It isn't from traffic or location.
- **Narration match:** "Twenty minutes to drive, ten to get inside. We're leaving at four-thirty." matches the sheet's own line ("your saved 20 min drive + 10 min buffer").
- **Never imply:** live traffic, automatic or traffic-aware departure, or reminders. On the web the sheet itself says "This device doesn't receive ACTIQO reminders", and no reminder fires for a projected session with prefs off.

## 3. Real UI path to capture (beats in `ui/UI_FLOW.md`)
Game Plan "Soccer Practice · Leo · Today · 5:00–6:15 PM", **Leave time not set**
→ tap **Set leave time**
→ sheet: **Manual · Preview: Leave by 4:30 PM · Starting point: your saved 20 min drive + 10 min buffer**
→ tap **Save leave time**
→ Game Plan: **Leave by 4:30 PM · Fixed leave time**

This is one continuous take with no adjustment taps, because the suggestion already equals 4:30.

## 4. Fixture: **new isolated D03 fixture in QA** (same pattern as D02)
- **Why not reuse D02's household:** its activity starts at 5:30 and its prep list (0/3) and packed state would show on the Game Plan. Changing it would alter the D02 capture fixture.
- **Why not D01's:** its pickup is deliberately open, so its Game Plan shows "Assign pickup".
- **D03 fixture:**
  - **Household:** `d03-demo-parent@example.com` (display "Sam"), `d03de000-…` IDs, tag `gtm-d03-practice-starts-at-five`.
  - **Activity:** child Leo, **Soccer Practice 17:00, 75 min**, **`drive_min = 20`** (the "saved drive"). The location is name only, with no coordinates; Automatic is unused.
  - **Responsibilities:** drop-off and pickup both assigned to Sam, so no warning row.
  - **Notifications:** every notification preference off, **including `allow_leave_time_reminder = false`**. No phone, devices or email delivery.
  - **Events:** no `events` rows, so the session is projected. The sheet then has no scope choice and saves the activity default only ("Saves this leave time for every Soccer Practice session."). The leave-time reminder cron only acts on real event rows, so nothing can fire.
- **Clock:** as in D02, the household and browser time zone are chosen at capture time so the session is **"Today" and still before 4:30 local**. That avoids "Leave now" and ticking copy.
- **Reset:** after capture, clear the saved leave default. Through the UI if a clear control exists; otherwise by SQL on the D03 fixture's own activity row only (documented). Then rotate the password and tear down the preview.

**Capture runtime:** the proven D02 path, a temporary isolated Vercel **Preview** of main with **QA Supabase only**. No Twilio SID, Resend, Stripe, Firebase/APNs, HERE or production values; inert placeholders only where startup checks require them. It's deleted after capture. Applied lessons:
- Create a static placeholder deployment first, because a project's first deploy is Production.
- Set the framework preset to Next.js before deploying.
- Use the automation bypass, the exposure scan, and a reset through real app behaviour.

## 5. Timeline (≈10.7 s; shifts slightly with the real voice timings)
| t (s) | Picture | Narration (Sarah) |
|---|---|---|
| 0.00–2.90 | **Opener:** kid's cleats still by the front door, bag beside them (people-free), with the hook text in the top third | "Practice starts at five. We can't leave at five." |
| 2.90–4.10 | Real Game Plan: Soccer Practice · Today · 5:00 PM · **Leave time not set** → tap **Set leave time** | n/a |
| 4.10–6.90 | Real sheet: **Manual · Preview: Leave by 4:30 PM · your saved 20 min drive + 10 min buffer** → tap **Save leave time** | "Twenty minutes to drive, ten to get inside." (on the basis line) |
| 6.90–8.40 | Real Game Plan: **Leave by 4:30 PM · Fixed leave time** (payoff hold, gentle punch-in at most 1.06×) | "We're leaving at four-thirty." |
| 8.40–10.70 | End card | "Try it with your next practice." |

**Captions:** the hook text is on screen. The body narration gets no captions over the UI by default, since the UI itself shows 20 min + 10 min and 4:30. Phrase captions like D01's can be added if you want muted-view support.

## 6. Narration script: 27 words
| Line | Words |
|---|---|
| Hook: "Practice starts at five. We can't leave at five." | 9 |
| Body: "Twenty minutes to drive, ten to get inside. We're leaving at four-thirty." | 12 |
| CTA: "Try it with your next practice." | 6 (**reused** from the approved D01 final Sarah take, so no new generation) |

"ACTIQO" isn't spoken in this script. If it's added later, it's forced via IPA `/ˈæktɛkoʊ/`.

## 7. Opener recommendation
**A generated object keyframe:** cleats untied by the front door, bag slumped beside them, no clock, no people. The hook line carries "five", so there's **no generated clock**: models routinely draw wrong hands or numbers, and a clock graphic could read as UI.
- **Step 1:** keyframe, $0.15. Stop for review.
- **Step 2, only if you want motion:** one Veo Fast silent clip, $0.40, a slow push-in. D02 showed motion reads as "footage", but here nothing in the scene needs to move. **A still with a gentle push is a legitimate $0.15 option.**

## 8. Expected paid cost
| Item | Cost |
|---|---|
| Opener keyframe | **$0.15** |
| Opener Fast clip (optional) | **$0.40** |
| Sarah voice: hook + body (≈125 chars @ $0.08/1k) | **≈ $0.01** |
| CTA voice | $0 (reused from D01) |
| QA preview / capture | $0 |
| **Total** | **≈ $0.56 with motion, ≈ $0.16 still-only**, against a $0.70 cap |

## 9. Files
```
gtm/d03-practice-starts-at-five/
  README.md                             status + gates
  scene.mjs                             timeline data (draft)
  brief/D03_BRIEF.md                    this file
  brief/budget.json                     caps: 2 keyframes, 1 Fast clip, no keeper, no 4K
  generations/prompts/s1_cleats_door.json   opener keyframe + optional Fast prompt (draft, not run)
  references/opener/                    keyframe lands here
  ui/UI_FLOW.md                         real leave-time flow, verbatim copy, capture beats
  ui/capture/                           (later) d03_ui_flow_9x16.mp4, lossless source, stills, beats.json, CAPTURE_RECORD.md
  edit/                                 (later) HyperFrames project, same builder/mixer pattern as D02
  audio/                                (later) narration takes
```
Your earlier empty stub `gtm/d03-leave-time/` is untracked and left untouched; it can be deleted if unused.

## 10. Product-truth and claims issues
1. **The leave time is manual and fixed; the 4:30 is a suggestion from a saved drive time + 10 min.** The concept stands. Don't say "ACTIQO calculates your leave time from traffic". The narration doesn't.
2. **The post-save toast on web reads "This device doesn't receive ACTIQO reminders."** (or "Leave-time reminders are off."). It's truthful but looks like a warning. The edit cuts from the Save tap to the settled Game Plan row after the toast clears, without hiding any state. No reminder claim is made anywhere.
3. **The "Automatic" option is visible in the sheet,** and with no location there's an "Add a location to enable automatic leave time" row. It stays on screen as real UI, isn't narrated or emphasised, and is never selected.
4. **⚠️ End card "Free."** Per your instruction, D03's end card is ACTIQO / Try it with your next practice. / **Free.** / getactiqo.com.
   - **Conflict:** D01 carried your explicit rule "never 'Free…', no other pricing claim".
   - **What the code shows:** current main runs **`LAUNCH_ACCESS_PHASE = 'open_launch'`**, which gives every signed-in user full Family capability "as though subscriptions do not exist yet". So "free to use right now" is true today. But the code calls it a **temporary launch phase**, so an unqualified "Free." can read as permanent.
   - **Please confirm** "Free." is the approved D03 claim (it supersedes the D01 rule for D03 only), and whether it needs legal review.
