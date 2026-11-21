#!/usr/bin/env bash
# Section loudness, full band vs phone-speaker band (HP 180 Hz / LP 8 kHz). Usage: phonecheck.sh file.mp4
F=$1; PH="highpass=f=180:poles=2,highpass=f=180:poles=2,lowpass=f=8000:poles=2"
printf "%-16s %8s %8s %6s\n" section full phone loss
for seg in "0.10 2.60 dialogue" "2.80 3.40 ui_pre_assign" "6.10 3.60 assign_to_save" "9.70 2.50 resolved" "12.20 2.80 endcard"; do set -- $seg
  a=$(ffmpeg -hide_banner -nostats -ss $1 -t $2 -i $F -vn -af ebur128 -f null - 2>&1 | awk '/I:/{v=$2} END{print v}')
  b=$(ffmpeg -hide_banner -nostats -ss $1 -t $2 -i $F -vn -af "$PH,ebur128" -f null - 2>&1 | awk '/I:/{v=$2} END{print v}')
  printf "%-16s %8s %8s %6.1f\n" $3 $a $b $(awk "BEGIN{print $a-($b)}"); done
