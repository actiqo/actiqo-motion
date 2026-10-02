# ACTIQO Icon & Emoji Policy

Three layers, one rule each. This document is the source of truth for any
question about which icon goes where.

---

## 1. SystemIcon — STATE

**File:** `src/lib/icons/system-icons.ts`
**Render:** `<SystemIcon name="..."/>` from `@/components/ui/Icon`

Use for any icon that conveys a **system state or intent**: insights,
warnings, success, locked, AI thinking, charts, trends, actions, navigation
chevrons, time/cost/drive/energy primitives.

### Tone guardrails

The dashboard should feel **intelligent**, not like an error console.

| Tone | Color | When to use |
|---|---|---|
| `alert` | Warm Coral `#E11D48` | **Only** real risk, errors, at-risk states |
| `warning` | Amber `#D97706` | "Watching" / "fuller than usual" / heavy load |
| `primary` | Trust Blue `#2563EB` | Insight, progress, prediction, default |
| `secondary` | Balanced Teal `#14B8A6` | Healthy, balanced, stable |
| `success` | Green `#16A34A` | Confirmed, completed, working |
| `muted` | Slate `#94A3B8` | De-emphasized, secondary metadata |

### Restricted icons in the map

Two icons are kept in `system-icons.ts` but flagged as restricted-use:

- **`sparkles`** — easiest icon to abuse and instantly cheapen the product
  feel. Default to `insight` or `ai` instead. Save sparkles for moments
  that actually deserve a "wow."
- **`activity`** (`fa-person-running`) — last-resort fallback only.
  Acceptable for empty states. **Never** use this to override a
  user-picked activity in the governed `activityIconMap`.

---

## 2. activityIconMap / avatarIconMap — IDENTITY

**File:** `src/lib/icons/icon-map.ts`
**Render:** `<ActivityIcon iconKey={...}/>` or `<AvatarIcon avatarKey={...}/>`

Use for icons that represent **a specific thing the user picked**: a
soccer activity, a piano lesson, a child's chosen avatar.

These are user-picked. **Never substitute SystemIcon here** — doing so
strips the personality the user added.

---

## 3. Emoji — PERSONALITY (controlled)

Allowed only in:

- `src/components/ActivityIconPicker.tsx` (the picker grid itself)
- `src/components/ChildAvatar.tsx` (when it ships)
- `src/app/(marketing)/**`
- Any file with a `// @allow-emoji: <reason>` header at the top

Forbidden everywhere else in `src/app/(dashboard)/**` and
`src/components/**`. ESLint enforces this in CI via `no-restricted-syntax`
in `eslint.config.js`.

### Files with allow-emoji headers (current)

| File | Reason |
|---|---|
| `CheckinHistoryDrilldown.tsx` | `ENJOY_EMOJI` / `ENERGY_EMOJI` are the 1–5 emotional check-in scale |
| `QuickCheckinBar.tsx` | `QUICK_OPTIONS` 1–5 face scale |
| `QuickCheckinModal.tsx` | `ENJOYMENT_OPTIONS` / `ENERGY_OPTIONS` / `MISSED_REASONS` user-picked categorical scale |

Each of these files has both:
1. A `// @allow-emoji: <reason>` comment header explaining *why*
2. A `/* eslint-disable no-restricted-syntax */` directive directly under it

The header is the source of truth for *why*; the eslint-disable is the
mechanical opt-out.

---

## The state/identity test

When in doubt, ask: **is this conveying STATE or IDENTITY?**

| Question | Answer | Use |
|---|---|---|
| "Is this a loading/success/AI/trend signal?" | STATE | `SystemIcon` |
| "Is this a specific activity the user added?" | IDENTITY | `ActivityIcon` |
| "Is this a child's chosen avatar?" | IDENTITY | `AvatarIcon` |
| "Is this an emotional moment the user is rating?" | IDENTITY | emoji (allowlisted) |
| "Is this a category in a user-picker grid?" | IDENTITY | emoji (allowlisted) |
| "Is this a marketing/auth/onboarding decoration?" | PERSONALITY | emoji OK |
| "Is this everywhere else?" | STATE | `SystemIcon` |

---

## Adding a new SystemIcon

1. Add the entry to `src/lib/icons/system-icons.ts` under the appropriate
   category section (intelligence / status / data / domain / actions / trends).
2. Use a Font Awesome free-tier glyph (`fa-solid fa-...`).
3. Document any tone restrictions in a JSDoc comment if it's restricted-use.
4. Use it via `<SystemIcon name="yourNewName"/>`.

---

## Migration from legacy `src/components/icons.tsx`

The old hand-written SVG set is `@deprecated`. See the migration mapping
in the file's header docblock. Existing usages keep working — please
don't introduce new ones in new code.

---

## Why this policy exists

Before this migration, ACTIQO product UI used emoji for state signals
(🧠 ⚠️ ✅ 🔮 ⚡ 📊 🔒 …). This made the product feel **consumer-grade**:
playful, approachable, and not particularly intelligent.

The fix wasn't to strip all personality — that would make it sterile.
The fix was to **separate state from identity**, governed by a single
source of truth, with controlled exceptions for the surfaces where
personality genuinely belongs (emotional check-ins, user-picked
categories, marketing).

The result: the dashboard feels like an intelligent system. The
check-in flow still feels human. The activity picker still has joy.
And future PRs can't quietly slip a 💪 into a card without a CI
failure.
