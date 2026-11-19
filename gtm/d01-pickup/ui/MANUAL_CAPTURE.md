# D01 · Manual product capture (SUPERSEDED: automated capture succeeded, see `CAPTURE_RECORD.md`)

Automated capture is **parked** (see `UI_CAPTURE_SPEC.md`). The product section uses a screen recording you make yourself in the real current app. Nothing is redrawn.

## Account
QA household (already seeded, see `QA_DEMO_HOUSEHOLD.md`): sign in as **Jordan**, `d01-demo-jordan@example.com`. Use the current build pointed at **QA** (`actiqo-b1-qa`). The household has **Jordan on drop-off** and **pickup open**. A new password for Jordan can be set on request.
*Or* any other demo household with the same names (Jordan, Alex, Leo, Soccer Practice). Never a real family.

## What to record (one continuous take is best)
| Beat | Required? | On screen |
|---|---|---|
| a. Open pickup | **Required** | Soccer Practice Game Plan, with "Who's doing what" showing Jordan's drop-off and **"No one on pickup"**. Hold 3 s. |
| b. Assign interaction | Optional | Tap Who's doing what → Assignments → tap Pickup / **Assign** → **"Who will pick up Leo?"** → tap **Alex** → **Save**. Pause ~1.5 s before each tap. |
| c. Saved state | **Required** | Back on the Game Plan: **"You're on drop-off"** (Jordan's view) **and "Alex pickup"**. Hold 3 s, hands off. |

If (b) is missing, the edit holds (a), hard-cuts, and holds (c). If (b) is present, the edit uses the full sequence. Either works.

## Format
- **9:16 portrait** phone recording, at the device's native resolution. iPhone Screen Recording or Simulator `recordVideo` are both fine.
- Clean status bar if you can (Simulator: `xcrun simctl status_bar booted override --time 9:41 --batteryLevel 100`). Do Not Disturb on, no banners.
- Also take screenshots of (a), the picker (if recorded) and (c).

## Where to put it
```
gtm/d01-pickup/ui/capture/d01_ui_source.mov      ← the recording (any of .mov/.mp4)
gtm/d01-pickup/ui/capture/still_a_unresolved.png
gtm/d01-pickup/ui/capture/still_b_picker.png     ← only if recorded
gtm/d01-pickup/ui/capture/still_c_saved.png
gtm/d01-pickup/ui/capture/BUILD.txt              ← app version/build number + date
```
`ui/capture/` is git-ignored for raw files. `/workspaces` is low on disk, so keep the source under ~300 MB.

After it lands: I check every on-screen string against current product code, write the beat timecodes to `ui/beats.json`, and `scene.mjs` picks `full` or `beforeAfter` automatically.
