#!/usr/bin/env bash
cd "$(dirname "$0")/out"
for f in *_wide.html *_tall.html; do
  n=${f%.html}; if [[ $n == *_wide ]]; then sz=1920,1080; else sz=1080,1920; fi
  timeout 60 google-chrome --user-data-dir=/tmp/actiqo-film02-chrome --headless=new --no-sandbox --disable-gpu --hide-scrollbars --allow-file-access-from-files \
    --force-device-scale-factor=1 --window-size=$sz --virtual-time-budget=4000 --screenshot="$PWD/$n.png" "file://$PWD/$f" 2>/dev/null
done
