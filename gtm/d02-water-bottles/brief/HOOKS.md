# D02 · Hook variants and attribution IDs

All four variants share **the same S1 opener footage, the same real-UI body, the same CTA end card and the same sound structure**. Only the on-screen hook line, and its hold length, changes. Source of truth: `scene.mjs` → `HOOKS`.

| ID (`utm_content`) | Variant | Hook line (on screen) | Opener hold | Runtime |
|---|---|---|---|---|
| **`d02_waterbottles`** | **A (primary)** | "Six water bottles. None in the bag." | 1.75 s | **9.50 s** |
| `d02_20minutes` | B | "Practice starts in 20 minutes. Guess what we forgot." | 2.25 s (the longer line needs more read time) | 10.00 s |
| `d02_alwaysforget` (**parked 2026-11-21**: draft kept, not advanced) | C | "The one thing we always forget before practice." | 1.75 s | 9.50 s |
| `d02_ownsix` | D | "Somehow we own six of these." | 1.75 s | 9.50 s |

**Render names (planned):** `final/ACTIQO_D02_SixWaterBottles_9x16_<id>.mp4`, plus a music-free version and one shared clean-picture master per hook.

## Attribution (documentation only; nothing changes on the website from this repo)
- **Destination:** `https://getactiqo.com/`. Never `actiqo.app/signup`.
- **Intended parameters:** `utm_source=<platform>` (`tiktok` / `instagram` / `youtube` / `facebook`), `utm_medium=paid_social`, `utm_campaign=d02_six_water_bottles`, `utm_content=<hook id from the table>`.
- **Example:** `https://getactiqo.com/?utm_source=tiktok&utm_medium=paid_social&utm_campaign=d02_six_water_bottles&utm_content=d02_waterbottles`
- **On screen:** the creative shows only "getactiqo.com". UTMs live in the ad platform's link, not in the video.
