#!/bin/bash
# Run one step with the disposable QA app alive for exactly the duration of this call.
cd ${D01_RUNTIME:-/tmp/d01-runtime}/actiqo-app
freeport(){ for p in $(sudo lsof -t -iTCP:3000 -sTCP:LISTEN 2>/dev/null); do kill $p 2>/dev/null; done; for p in $(ps -eo pid,args | grep -E 'next-server|actiqo-app/node_modules/.bin/next|next/dist/bin/next' | grep -v grep | awk '{print $1}'); do kill $p 2>/dev/null; done; sleep 2; }
freeport
env -u ACTIQO_QA_SERVICE_ROLE_KEY NODE_OPTIONS=--max-old-space-size=2048 npx next dev -p 3000 >> ${D01_RUNTIME:-/tmp/d01-runtime}/next-dev.log 2>&1 < /dev/null &
SRV=$!
for i in $(seq 1 90); do curl -s -o /dev/null --max-time 2 http://localhost:3000/ && break; sleep 1; done
for p in /login "/dashboard/game-plan?activity=d01de000-0000-4000-8000-0000000000ac&date=${D01_DATE:-2026-11-19}" /api/legal/status "/api/legal/presentation?surface=consent_gate" /api/roster /api/account/profile /api/family /api/daily-snapshot /api/family-sync/config /api/family-sync/config/save /api/family-sync/instance /api/family-sync/session-state /api/family-sync/checklist /api/family-sync/last-time /api/family-sync/watchouts "/api/family-sync/upcoming?days=14" /api/snack-rotation /api/snack-rotation/coordinator-summary "/api/notifications?status=all&limit=50"; do curl -s -o /dev/null --max-time 120 -w "warm $p %{http_code} %{time_total}s\n" "http://localhost:3000$p"; done
cd "$(dirname "$(readlink -f "$0")")"; "$@"; RC=$?
freeport
exit $RC
