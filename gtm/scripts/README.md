# gtm/scripts: shared GTM tooling

**Implemented:** `generate.mjs` (fal.ai). **Configured endpoints** are in `gtm/<prod>/brief/budget.json`:

| Use | Endpoint | Settings | List price (fal, read 2026-11-19) |
|---|---|---|---|
| Keyframe | `fal-ai/nano-banana-pro` | 9:16, 2K, png | $0.15 / image |
| Keyframe matched to a reference | `fal-ai/nano-banana-pro/edit` | + `image_urls`: [approved keyframe] | $0.15 / image |
| Draft | `fal-ai/veo3.1/fast/image-to-video` | 9:16, 1080p, 4s, audio on | $0.15/s → **$0.60** per 4 s draft |
| Keeper | `fal-ai/veo3.1/image-to-video` | 9:16, 1080p, 4s, audio on | $0.40/s → **$1.60** per 4 s keeper |

**Guards:**
- Dry-run unless `--confirm-spend`.
- Max **2 paid video generations per shot**, counted from `gtm/generations-ledger.jsonl`. A failed call still counts.
- Max 3 keyframes per character.
- Keepers refuse to run without `--composition-approved`.
- 4K is refused.
- Keyframe outputs are versioned and never overwrite an earlier file.

Veo accepts only 4 s, 6 s or 8 s clips. We use 4 s because each shot needs only about 1 s.

```
node --env-file=.env gtm/scripts/generate.mjs d01-pickup s1 keyframe                  # dry run
node --env-file=.env gtm/scripts/generate.mjs d01-pickup s1 keyframe --confirm-spend
node --env-file=.env gtm/scripts/generate.mjs d01-pickup s2 keyframe --confirm-spend  # after Alex's still is approved
node --env-file=.env gtm/scripts/generate.mjs d01-pickup s1 draft --confirm-spend     # after both stills are approved
```
---
*Original design notes follow.*

## Connecting the video-generation API: the proposed design
```
.env  (repo root, already git-ignored by `.env` / `.env.*`)
  FAL_KEY=…            # if fal.ai (recommended gateway)
  GEMINI_API_KEY=…     # if Google Veo direct
  OPENAI_API_KEY=…     # if OpenAI Sora direct

node --env-file=.env gtm/scripts/generate.mjs <production> <shot> [--still|--video] [--takes N] [--confirm-spend]
```
- **No new dependencies.** It uses Node 24's built-in `fetch` and `--env-file`. Keys never go in code, prompts, sidecars or logs.
- **Dry-run by default.** It prints the exact request (model, prompt, duration, aspect) and a cost estimate from the provider's current price list. It sends only when you pass `--confirm-spend`.
- **Prompts are files:** `gtm/<prod>/generations/prompts/*.json`, versioned in git and reviewed before spend.
- **Output:** `generations/raw/<shot>/<UTC>_<model>_t<n>.mp4` plus a `.json` sidecar with the provider, model id, prompt hash, seed, request id, cost and timings. Raw takes are **git-ignored**. You approve a take by copying it to `generations/selects/`, which is committed via LFS.
- **Spend ledger:** one line per paid call is appended to `gtm/generations-ledger.jsonl` (committed), so we always know the total.
- **Hard caps:** max takes per call (default 1) and a per-production budget ceiling read from `brief/budget.json`. The script refuses to run past either.
- **Provider adapter:** one small `providers/<name>.mjs` per API (submit → poll → download). Adding Kling or Runway later means adding one file.

### Related scripts (planned)
| Script | Job |
|---|---|
| `ingest.mjs` | Conform a select to 1080×1920, 30 fps CFR, Rec.709; split the dialogue into `audio/`; write a poster frame |
| `still.mjs` | The Gate 1 keyframe stills (cheap image model) that feed image-to-video |
| `build.mjs` | `scene.mjs` → HyperFrames composition `index.html` → `hyperframes@0.8.98 render` into the scratchpad, then copy the MP4 into `renders/` (disk is ~1.3 GB free) |

## Provider recommendation
You mentioned "the selected external video-generation API/model", but no choice is recorded in this repo or in the environment. **I need you to name it.** Absent a choice, I recommend:

1. **fal.ai as the gateway (recommended).** One key reaches several current photoreal models (Veo-class, Kling-class and others) through one queue API. We can A/B two models on S1 without a second account.
2. **Google Veo direct (Gemini API).** Native 9:16, strong photoreal people, and **native synced dialogue audio**, which matters because S1/S2 are lip-synced lines.
3. **OpenAI Sora direct.** It also has native audio. Org verification is needed for API video access.

What the shots need from the model: photoreal people, 9:16, **native dialogue with lip-sync**, image-to-video (so the approved stills lock wardrobe and set), and 4–8 s clips.

## Account and key requirements (before any paid call)
| Provider | You need to | Key name |
|---|---|---|
| fal.ai | Create an account, **add prepaid credits / billing**, create an API key | `FAL_KEY` |
| Google (Veo) | A Google Cloud / AI Studio project **with billing enabled**, Veo access on that project, and an API key | `GEMINI_API_KEY` |
| OpenAI (Sora) | An org **with billing**, verified for video models, and an API key | `OPENAI_API_KEY` |

**Today:** no video-API key exists in this environment, and there is no `.env` file. To add one without it touching the chat log, run `! printf 'FAL_KEY=%s\n' "$(read -rs k; echo $k)" >> /workspaces/actiqo-motion/.env` and paste the key at the silent prompt. You can also create the file yourself.

**Expected spend for D01:** 2 shots × at most 2 takes × ~4–5 s, plus 2–4 stills. I'll show the exact live price in the dry-run before you confirm anything.
