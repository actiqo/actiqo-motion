#!/bin/bash
# Run d03.mjs MODE=record on a private 1280×1920 virtual display (the phone viewport is the top-left 1080×1920).
# Env: D03_BASE, D03_BYPASS, D03_SCAN_SECRETS, D03_RUNTIME.
set -euo pipefail
cd "$(dirname "$(readlink -f "$0")")"
Xvfb :99 -screen 0 1280x1920x24 -nolisten tcp >/dev/null 2>&1 &
XPID=$!; trap 'kill $XPID 2>/dev/null || true' EXIT
for i in $(seq 1 20); do [ -e /tmp/.X11-unix/X99 ] && break; sleep 0.25; done
DISPLAY=:99 MODE=record node d03.mjs
