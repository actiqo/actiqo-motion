# D02 · Hook variants and attribution IDs

All variants share (active set: A, B, D) **the same S1 opener footage, the same real-UI body, the same CTA end card and the same sound structure**. Only the on-screen hook line, and its hold length, changes. Source of truth: `scene.mjs` → `HOOKS`.

| ID (`utm_content`) | Variant | Hook line (on screen) | Opener hold | Runtime |
|---|---|---|---|---|
| **`d02_waterbottles`** | **A (primary)** | "Six water bottles. None in the bag." | 2.0 s | **9.50 s** |
| `d02_20minutes` | B | "Practice in 20. Guess what we forgot." (final; was "Practice starts in 20 minutes…") | 2.8 s, narrated | 10.10 s |
| `d02_alwaysforget` (**parked 2026-11-21**: draft kept, not advanced) | C | "The one thing we always forget before practice." | 2.0 s | 9.50 s |
| `d02_ownsix` | D | "Somehow we own six of these." | 2.0 s | 9.50 s |

**Render names (planned):** `final/ACTIQO_D02_SixWaterBottles_9x16_<id>.mp4`, plus a music-free version and one shared clean-picture master per hook.

## Attribution (documentation only; nothing changes on the website from this repo)
- **Destination:** `https://getactiqo.com/`. Never `actiqo.app/signup`.
- **Intended parameters:** `utm_source=<platform>` (`tiktok` / `instagram` / `youtube` / `facebook`), `utm_medium=paid_social`, `utm_campaign=d02_six_water_bottles`, `utm_content=<hook id from the table>`.
- **Example:** `https://getactiqo.com/?utm_source=tiktok&utm_medium=paid_social&utm_campaign=d02_six_water_bottles&utm_content=d02_waterbottles`
- **On screen:** the creative shows only "getactiqo.com". UTMs live in the ad platform's link, not in the video.
