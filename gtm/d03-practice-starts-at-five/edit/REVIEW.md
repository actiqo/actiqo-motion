# D03 opener still, for review (2026-11-21)

**Current candidate: v02** (see the v02 section at the end). v01 below is kept for the record.

## v01

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

---
## v02: logo-removal edit (Option A, approved 2026-11-21), for review
- **File:** `references/opener/d03_cleats_keyframe_v02.png` (1536×2752, 9:16). Record: `…_v02.json`.
- **Generation:** `fal-ai/nano-banana-pro/edit` with v01 as the only input, 2K, request `01a1ff24-a40a-77d1-bbcc-2c98e633a6c4`, **$0.15**. It was the one paid edit allowed.
- **Edit prompt:** remove ONLY the left-cleat logo; plain black leather; everything else identical (`generations/prompts/s1_cleats_door.json`).
- **Crops:** `references/opener/d03_cleats_keyframe_v02_cleat_crop.png` (edited cleat) and `d03_cleats_v01_vs_v02_crop.png` (v01 left | v02 right, same crop).

### Checks
| Check | Result |
|---|---|
| Logo fully gone | **Yes.** The side panel of the left cleat is plain scuffed black leather with continuous creases and mud. There's no residue or outline of the diamonds. |
| New brand-like marks | **None found.** Checked both cleats, the bag, shin guards, bottle and jacket. The light edge at the left cleat's heel collar was already in v01: it's the inside lining catching light, not a stripe or badge. |
| Cleat geometry | Same shoe, position, orientation, laces, mud and wear. The right cleat is unchanged. |
| Rest of the scene | **Visually identical:** composition, framing, door, jacket, bench, rug, bag, shin guards, bottle, light, shadows and depth of field. A ×4-contrast difference map lights up **only the logo area**. (Whole-frame SSIM is 0.77 because the model regenerates fine grain everywhere; the change isn't visible at any viewing size.) |

### Spend
| Item | Cost |
|---|---|
| Still v01 | $0.15 |
| Edit v02 | $0.15 |
| **D03 spent so far** | **$0.30** of the $0.75 cap |

**Remaining plan if approved:** one Veo Fast silent 4 s ($0.40) and Sarah narration (≈$0.01), for ≈ $0.71 in total.

**Not done (by instruction):** motion, narration, deployment and capture.

---
## Opener motion v01 (Veo 3.1 Fast), for review, ⚠️ fails the "no face" rule
- **File:** `generations/review/s1/d03_s1_cleats_fast_v01.mp4` (+ `_contact.png`, 4 fps; `.json`). Raw copy: `generations/raw/s1/` (git-ignored).
- **Generation:** `fal-ai/veo3.1/fast/image-to-video`, 9:16, 1080p, 4 s, `generate_audio:false`, start frame = locked still v02, request `01a1ff29-bbea-77b1-9369-b2489dd99acb`, **$0.40**. It was the one allowed generation.
- **Output:** 1080×1920, 24 fps, 96 frames, 4.00 s, video only.

### What happens (checked frame by frame)
| Source time | Frames | Content |
|---|---|---|
| 0.00–0.90 s | 0–21 | Near-still entryway, identical to v02, faint sway. **Clean.** |
| 0.92 s | 22 | Forearm enters at the right edge. |
| **≈1.00 s → ≈3.6 s** | **24 → ~86** | **An adult man's head and face lean into the top right of the frame**, in a black/white/blue sports top. He bends down, picks up the **right (sole-up) cleat** and drops it into the bag. Face clearly visible from about 1.13 s. |
| ≈3.7–4.00 s | ~88–95 | He's out of frame. One cleat is on the rug, the other is in the bag. Scene clean. |

### Integrity checks
- **Text, clocks, numbers, logos:** none seen in any frame. The sports top has plain colour panels with no logo or lettering.
- **Scene:** the room, door, jacket, bench, rug and lighting stay stable. The left cleat doesn't morph. The bag and shin guards stay put (the bag only receives the cleat).
- **Brief violation:** a **person and face** enter (the prompt and negative prompt said forearm only). That's the same failure mode Veo shows when a hand reaches low into frame: it tends to bring the body with it.

### What can be used
The face-free part is only **src 0.00–0.95 s**, and it's essentially still. **The target section, 0.3–2.5 s, can't be used without the face.**

**Options:**

| Option | Cost | What it does |
|---|---|---|
| **A** | $0 | Opener = the locked v02 still, held for ~1.95 s, then **seamlessly into clip src 0.00–0.95**: the clip's first frame *is* v02. The forearm's first entry lands at the cut to the UI. Reads as "not ready yet", with a hint that someone is about to move. No face, no further spend. |
| B | $0 | Still-only opener (v02 with a very gentle push), as in the D02 draft. |
| C | +$0.40, needs a cap raise to about $1.15 | A second Fast generation with a reworked prompt (hand enters at mid-height reaching for the bag handle, "camera framing excludes everything above the bench"). Still a risk of the same failure. |

**D03 spent:** $0.70 of $0.75 (still $0.15 + edit $0.15 + Fast $0.40). Narration (≈$0.01) still fits.
