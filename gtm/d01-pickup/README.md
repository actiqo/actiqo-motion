# D01 · "Pickup was handled." (GTM, 15 s, 9:16)

**Status (2026-11-19):** Gate 0 decisions applied. Keyframes are ready to generate once `FAL_KEY` is set. The real UI capture is BLOCKED (see `ui/UI_CAPTURE_SPEC.md`). Nothing has been spent.

| Path | Contents |
|---|---|
| `brief/D01_BRIEF.md` | The production brief, the claims check, the gates |
| `brief/D01_SHOTLIST.md` | Frame-exact shot list, caption track, continuity notes |
| `generations/prompts/` | Keyframe and video prompts for S1 (Adult A, keys) and S2 (Adult B, bag) |
| `generations/raw/` | Raw paid takes plus JSON sidecars (**git-ignored**) |
| `generations/selects/` | Approved takes only (LFS) |
| `ui/UI_CAPTURE_SPEC.md` | The real-UI inventory, the gap, and the exact capture request |
| `ui/capture/` | Raw screen recordings (**git-ignored**) |
| `audio/README.md` | Sync, VO, room tone and music plan |
| `references/casting/` | Approved Alex/Jordan keyframes (image-to-video inputs) |
| `references/` | Mood and reference frames (only references we have rights to; never used in the cut) |
| `renders/` | Review and final masters (LFS) |
| `scene.mjs` | The single timeline source → HyperFrames composition |

Shared tooling is in `gtm/scripts/` (see its README for the API connection design).
Brand sources are `brand/` (tokens, fonts, logo) and are referenced, not copied.
Never touch: `videos/actiqo-the-hour/` (Film 01), `film02/` (Film 02), `/workspaces/actiqo` (read-only product repo).
