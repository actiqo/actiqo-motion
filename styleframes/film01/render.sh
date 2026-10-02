#!/usr/bin/env bash
# Renders styleframe-*.html → PNG at exactly 1080×1920 with headless Chrome.
set -euo pipefail
cd "$(dirname "$0")"
for f in A B C; do
  google-chrome --headless=new --no-sandbox --disable-gpu --hide-scrollbars \
    --allow-file-access-from-files --force-device-scale-factor=1 \
    --window-size=1080,1920 --virtual-time-budget=4000 \
    --screenshot="$PWD/actiqo-film01-styleframe-$f.png" "file://$PWD/styleframe-$f.html" 2>/dev/null
done
