#!/usr/bin/env bash
# Hard-links the locked D01 sources into edit/assets/ (git-ignored; no copies, no new media).
set -euo pipefail
cd "$(dirname "$0")"; D=..; B=../../../brand
mkdir -p assets
ln -f $D/generations/review/s1/d01_s1_alex_fast_v01.mp4   assets/s1_alex_fast_v01.mp4
ln -f $D/generations/review/s2/d01_s2_jordan_fast_v01.mp4 assets/s2_jordan_fast_v01.mp4
ln -f $D/ui/capture/d01_ui_flow_9x16.mp4                  assets/ui_flow_9x16.mp4
ln -f $B/logo/current/actiqo-wordmark-navy-teal_trimmed.png assets/actiqo-wordmark.png
ln -f "$B/fonts/Inter[opsz,wght].ttf"                      assets/Inter.ttf
