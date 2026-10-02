#!/usr/bin/env bash
# Renders the S6 static styleframes to PNG at exactly 1080×1920 with headless Chrome.
set -euo pipefail
cd "$(dirname "$0")"
for f in s6-mid_9.0s s6-end_10.8s; do
  google-chrome --headless=new --no-sandbox --disable-gpu --hide-scrollbars \
    --allow-file-access-from-files --force-device-scale-factor=1 \
    --window-size=1080,1920 --virtual-time-budget=4000 \
    --screenshot="$PWD/actiqo-film01-$f.png" "file://$PWD/$f.html" 2>/dev/null
done
