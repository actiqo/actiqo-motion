# ACTIQO motion system (v1, for approval)

This extends ACTIQO's shipped design system into time. It is not a separate motion brand.

Every value is scaled from production:
- Tokens: `brand/actiqo-motion-tokens.css`
- Provenance: `ACTIQO_BRAND_MOTION_AUDIT.md`

The product's motion character is: calm, finite, no bounce, prefers reduced motion.

Film motion should feel like the app behaving at its best, slowed just enough to be read.

## 1. Timing and easing

Production values:
- 120 / 200 ms `ease` (controls)
- 300 ms `cubic-bezier(0.2,0,0,1)` (view transitions)
- 320 ms `cubic-bezier(0.2,0.8,0.2,1)` + translateY 8px (card entrance)
- 600 ms `cubic-bezier(0.4,0,0.2,1)` "breath" (single editorial sentence)

In video, UI durations are stretched about 1.5× so they register at feed speed:

| Motion class | Duration (30 fps) | Easing | Production origin |
|---|---|---|---|
| Micro (tint fill, check, colour change) | 6–9 f (200–300 ms) | `cubic-bezier(0.2,0,0,1)` | 200 ms control transition |
| Element entrance (chip, card, pill) | 12–15 f (400–500 ms) | `cubic-bezier(0.2,0.8,0.2,1)` | `ds-fadein` 320 ms |
| Structural (morph, reflow, week column resize) | 18–24 f (600–800 ms) | `cubic-bezier(0.2,0,0,1)` | view transition 300 ms |
| Editorial line (Fraunces titles, end line) | 18 f (600 ms) | `cubic-bezier(0.4,0,0.2,1)` | `actiqoBreathIn` |
| Camera pull-back (day → week) | 60–75 f (2.0–2.5 s), one move | `cubic-bezier(0.65,0,0.35,1)` in-out | film-only (the product has no camera) |

- **Spring and bounce budget: zero.** No overshoot anywhere. Production's only overshoot, `v2-complete-pop`, is excluded.
- **Stagger:** 3–4 f between siblings. The order of a stagger is always **time order** (earliest dependency first), never decorative order.
- **Stillness:** every beat that asks to be read gets at least 12 f of true hold. The final beat before resolution holds 24 f pixel-identical, as the brief requires.

## 2. How each primitive moves

**Cards and chips enter** exactly as the product's cards do: opacity 0→1 plus translateY 20px→0 (8 px × k), over 12–15 f with the enter curve.
- No scale-in, no slide from off-screen, no rotation.
- A chip's tint surface and its well arrive together. The label never types on.

**Threads draw** from their **origin** (the time on the event, marked by a 7 px dot that appears first, over 4 f) to their **destination** chip.
- Draw uses stroke-dashoffset over 12 f with the standard curve. The chip enters as the thread reaches it (they overlap for the last 4 f).
- Resolved links are neutral `rgba(11,31,59,0.30)`.
- Unresolved links are **orange dashed** and draw last.
- Threads never pulse, flow or animate after they land.

**The leave-by bracket** grows *downward* from the leave time to the event's start, over 10 f. It reads "from when you leave, to when it starts".
- The `Leave by` card has already landed at the top of the bracket.
- At week scale the bracket is **localized to Thursday's column**. It never becomes a horizontal line.

**Responsibility (who's driving, pickup)** enters as a person pill.
- Assigned: green tint in, over 6 f after the card lands.
- Unassigned: orange. It is the only orange element in S1–S5 and appears **once**, with a single hold, **no pulse**. This follows the product: orange means input required.

**Preparation** is `What to bring` + list. Progress (`1 of 3 packed`) can count up only in S6+ where real UI shows it.

**Changed details** (`Field 4 → 7`): the old value is shown first, then the arrow and the new value slide in 12 px from the right over 9 f. The old value is never struck through or flashed.

**Time grids** never animate their lines in isolation.
- Hour lines fade in (0→1 over 12 f) only as the camera reveals them.
- Hour labels are tabular and do not re-flow.

**Week reveal:** column dividers and day headers appear with the pull-back.
- Thursday is already present; the other days fade in over 12 f, staggered outward from Thursday by 2 f per column.
- The selected-date navy circle is the only filled day marker.

**Expand / collapse** (S6+): height and reflow over 18 f with the standard curve. Content cross-fades in the last 8 f. This is the product's disclosure behaviour at 1.5×.

## 3. Hierarchy in motion

- **One mover at a time.** When the Hour Block morphs, nothing else animates. When the camera moves, chips are already settled.
- Order of revelation follows cause → responsibility → time: the event, then its leave time, then who drives, then what it needs, then what changed, then the unresolved pickup.
- **Colour enters late and sparingly.** A beat begins navy and neutral; semantic tints fill in (6 f) as each item becomes meaningful. Teal, the brand mark colour, is reserved for the logo on the end card.
- **Fraunces moments are rare:** the day title, the week title and the end line. Fraunces never animates per letter.

## 4. The camera

- One continuous pull-back from day to week. No cuts inside S1–S5, no rotation, no 3D tilt, no parallax layers.
- Scale is uniform (the world scales together). Text is re-set at each scale rather than scaled as pixels, so it stays crisp.
- Framing respects Reels/TikTok UI at every frame:
  - top 220 px clear
  - bottom 20% (y > 1536) clear of critical info
  - nothing important right of x ≈ 950 between y 700 and 1536

## 5. The bubble → Hour Block morph (S1 → S2)

- The message surface (white, overlay shadow) becomes the Hour Block (navy) as **one object**:
  - radius stays 16 × k throughout
  - fill interpolates white → navy over 18 f
  - the shadow holds
- Semantic continuity: "Soccer Practice" (Inter 600) rises into the object while "who's got pickup today?" is still receding.
  - The two lines overlap for about 8 f.
  - The question fades while translating up 20 px.
  - The title fades in while translating up from 20 px.
- There is never an empty object and never a hard cross-fade of the whole surface.

## 6. Never animate

- Logo or wordmark internals (the Q is never redrawn, spun or assembled). The logo only fades in, over 18 f.
- Any bounce, overshoot, elastic, wobble, shake, glow, pulse, ripple, particles, confetti, blur-in beyond production's 2 px breath, parallax or rotation.
- Numbers "slot-machine" counting. Times are facts; they appear, they don't tick.
- Alert styling: the `LEAVE NOW` coral ring and "happening now" dot pulses stay in the product.
- Colour cycling, gradient sweeps, shimmer / skeleton sweeps.
- More than one orange element, or any orange that isn't an unresolved responsibility.

## 7. What keeps it premium

- Real typography at confident scale: Fraunces 76 px titles, Inter 30–48 px operational text. Nothing smaller than 22 px on screen at 1080 wide.
- Depth only from the production shadow pair and tint, never from blur or glow.
- Negative space is kept deliberately (top and bottom bands are also platform-safe).
- Density comes from **meaning**, not count: 5–7 coordination elements at peak, each with an origin time.
- Accessibility parity: every motion beat has a still that reads on its own. The styleframes are those stills.
