# D03 opener still v01, for review (2026-11-21)

- **File:** `references/opener/d03_cleats_keyframe_v01.png` (1536×2752, 9:16). Generation record: `…_v01.json`.
- **Generation:** `fal-ai/nano-banana-pro`, 2K, request `01a1ff20-c109-7223-aff1-6d30d7823d8c`, **$0.15**. Prompt: `generations/prompts/s1_cleats_door.json`.
- **D03 spend so far:** $0.15 of the $0.70 cap. No motion generated.

## What works
- **Reads instantly:** an ordinary entryway, closed front door, a kid's jacket on the hook. Untied, muddy cleats on the rug, one tipped over. A half-open navy duffel with shin guards and a bottle poking out. Practice is coming, nobody's out the door.
- **Light and feel:** warm late-afternoon side light, lived-in rather than stock: worn trim, scuffed floor, old rug.
- **Clean:** no people, hands, clock, screen or text. The bag is plain.
- **Room for the hook:** the upper third (door panels and wall) is calm, so the hook text has room.

## ⚠️ Blocking issue: a real brand logo on the left cleat
The left cleat carries a clear white **double-diamond mark that reads as a real sportswear brand's logo** (crop: `references/opener/d03_cleats_keyframe_v01_logo_crop.png`). The brief says "no logos", so **this still can't be used as is**. The right cleat is turned sole-up, with no mark visible.

Smaller notes: a sliver of a third shoe at the right edge, behind the bag (harmless). The bottle in the bag is a plain unbranded shape.

**Options:**

| Option | Cost | What it does | D03 total (with motion + TTS) |
|---|---|---|---|
| **A (recommended)** | +$0.15 | `fal-ai/nano-banana-pro/edit` on this still: "remove the logo from the left cleat, plain black leather, change nothing else". Keeps the approved composition. | ≈ **$0.71**, $0.01 over the $0.70 cap |
| B | +$0.15 | Regenerate from the prompt, with "plain unbranded cleats" made explicit. A new composition. | ≈ $0.71 |
| C | $0 | Frame around it: a ≤1.06× push or a crop that keeps the cleat but loses the logo. Not workable here: the logo sits on the hero object at frame centre. | — |

Both A and B need you to approve a retry. Both land $0.01 over the cap unless the cap is raised to $0.75 (or the narration takes go to ~$0.005).
