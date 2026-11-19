#!/bin/bash
# Run record-x11.mjs on a private 1080×1920 virtual display. Env: D01_BASE, D01_BYPASS, D01_SCAN_SECRETS, D01_RUNTIME.
set -euo pipefail
cd "$(dirname "$(readlink -f "$0")")"
Xvfb :99 -screen 0 1280x1920x24 -nolisten tcp >/dev/null 2>&1 &
XPID=$!; trap 'kill $XPID 2>/dev/null || true' EXIT
for i in $(seq 1 20); do [ -e /tmp/.X11-unix/X99 ] && break; sleep 0.25; done
DISPLAY=:99 node record-x11.mjs
