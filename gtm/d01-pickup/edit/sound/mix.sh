#!/usr/bin/env bash
# D01 final candidate (audio v02 = phone-translation pass): audio polish + masters. The picture is LOCKED: the v02 video stream is stream-copied (never re-encoded).
# Inputs: ../review/d01_rough_v02.mp4 (locked picture + locked dialogue edit), the locked Jordan clip (room-tone source),
#         ./out/*.wav from synth.mjs (original synthesized SFX + bed). Run from anywhere: ./sound/mix.sh
set -euo pipefail
cd "$(dirname "$0")"
node synth.mjs >/dev/null
V2=../review/d01_rough_v02.mp4
JORDAN=../assets/s2_jordan_fast_v01.mp4          # hard-linked by ../link-assets.sh
OUT=out; REV=../review; mkdir -p $OUT
TARGET_DIA=-13.5; CEIL=-1.5   # loudness is set by the dialogue (0.10–2.60 s); the rest sits under it

# --- Event map (timeline seconds; see AUDIO_NOTES.md) ---
T_ENTER=2.50     # air lift → felt pluck lands on the 2.80 cut into ACTIQO
T_ASSIGN=6.19    # Assign tap (screen changes at 6.233)
T_SELECT=8.59    # Alex selected (screen changes at 8.633)
T_SAVE=9.21      # Save tap ("Saving…" appears at 9.25)
T_SAVED=9.71     # resolved Game Plan (cut at 9.70)
ms() { awk "BEGIN{printf \"%d\", $1*1000}"; }

# Dialogue: locked edit from v02. Alex +3 dB to sit with Jordan (−28.5 vs −24.4 LUFS); 70 Hz high-pass for handling rumble only.
DIA="[0:a]aformat=sample_rates=48000:channel_layouts=stereo,volume='if(lt(t,1.28),1.413,1)':eval=frame,highpass=f=70:poles=1[dia]"
# Room-tone tail: Jordan's own room bed from his pause (src 2.30–2.52, no speech), ping-ponged to 0.66 s, under the 2.73 cut.
ROOM="[1:a]atrim=2.30:2.52,asetpts=N/SR/TB,aformat=sample_rates=48000:channel_layouts=stereo,asplit=3[r1][r2][r3];[r2]areverse[r2r];[r1][r2r][r3]concat=n=3:v=0:a=1,afade=t=in:d=0.08,afade=t=out:st=0.30:d=0.36,adelay=2620|2620,apad=whole_dur=15[room]"
SFX="[2:a]volume=0.38,adelay=$(ms $T_ENTER)|$(ms $T_ENTER),apad=whole_dur=15[enter];\
[3:a]volume=0.12,adelay=$(ms $T_ASSIGN)|$(ms $T_ASSIGN),apad=whole_dur=15[tap1];\
[4:a]volume=0.12,adelay=$(ms $T_SELECT)|$(ms $T_SELECT),apad=whole_dur=15[tap2];\
[5:a]volume=0.11,adelay=$(ms $T_SAVE)|$(ms $T_SAVE),apad=whole_dur=15[tap3];\
[6:a]volume=0.21,adelay=$(ms $T_SAVED)|$(ms $T_SAVED),apad=whole_dur=15[saved]"
# Bed: ducked ~−20 dB under dialogue; up from 2.70 → 3.00 under the UI; +1.5 dB lift on the release (9.72); spacious fade 13.6 → 15.0.
BEDENV="if(lt(t,2.70),0.10,if(lt(t,3.00),0.10+0.90*(t-2.70)/0.30,if(lt(t,9.62),1.0,if(lt(t,9.82),1.0+0.19*(t-9.62)/0.20,if(lt(t,13.6),1.19,1.19*max(0,(15.0-t)/1.4))))))"
BED="[7:a]volume=0.56[pad];[8:a]volume=0.285[rh];[pad][rh]amix=inputs=2:normalize=0,volume='$BEDENV':eval=frame,atrim=0:15[bed]"

mix() { # $1 = name, $2 = include bed (1/0)
  local inputs="[dia][room][enter][tap1][tap2][tap3][saved]" n=7 sink=""
  if [ "$2" = 1 ]; then inputs="$inputs[bed]"; n=8; else sink="[bed]anullsink;"; fi
  ffmpeg -hide_banner -loglevel error -y -i $V2 -i $JORDAN -i $OUT/sfx_enter.wav -i $OUT/sfx_tap.wav -i $OUT/sfx_tap_select.wav \
    -i $OUT/sfx_tap_save.wav -i locked/sfx_saved_v01.wav -i $OUT/bed_pad.wav -i $OUT/bed_rhythm.wav \
    -filter_complex "$DIA;$ROOM;$SFX;$BED;${sink}${inputs}amix=inputs=$n:normalize=0,atrim=0:15,asetpts=N/SR/TB[m]" \
    -map "[m]" -c:a pcm_s24le -ar 48000 $OUT/$1_premaster.wav
}
mix full 1
mix musicfree 0

# Loudness: one gain for both versions, set so the dialogue section reads −13.5 LUFS (identical in both), then a peak limiter.
# v02: the gain is FIXED at the v01 value (11.9 dB) so the locked dialogue level is unchanged; only the bed/SFX layers changed.
I=$(ffmpeg -hide_banner -nostats -ss 0.10 -t 2.50 -i $OUT/full_premaster.wav -af ebur128 -f null - 2>&1 | awk '/I:/{v=$2} END{print v}')
G=11.9
echo "dialogue section premaster I=$I LUFS (v01: −25.4) → fixed gain ${G} dB"
for v in full musicfree; do
  ffmpeg -hide_banner -loglevel error -y -i $OUT/${v}_premaster.wav \
    -af "volume=${G}dB,aresample=192000,alimiter=limit=$(awk "BEGIN{print 10^($CEIL/20)}"):attack=1:release=60:level=disabled,aresample=48000" \
    -c:a pcm_s24le $OUT/${v}_master.wav
done

# Masters: locked v02 picture stream-copied; AAC 320k.
VER=v02
ffmpeg -hide_banner -loglevel error -y -i $V2 -i $OUT/full_master.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 320k -ar 48000 -movflags +faststart -t 15 $REV/d01_final_candidate_$VER.mp4
ffmpeg -hide_banner -loglevel error -y -i $V2 -i $OUT/musicfree_master.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 320k -ar 48000 -movflags +faststart -t 15 $REV/d01_final_candidate_${VER}_musicfree.mp4
# Clean picture master is unchanged from v01 (review/d01_final_candidate_v01_clean.mp4); not duplicated.
# PHONE-CHECK reference only (NOT a master): small-speaker simulation, mono-summed, HP 180 Hz / LP 8 kHz (12 dB/oct each).
ffmpeg -hide_banner -loglevel error -y -i $V2 -i $OUT/full_master.wav -map 0:v -map 1:a -c:v copy \
  -af "pan=mono|c0=0.5*c0+0.5*c1,highpass=f=180:poles=2,highpass=f=180:poles=2,lowpass=f=8000:poles=2,pan=stereo|c0=c0|c1=c0" \
  -c:a aac -b:a 192k -ar 48000 -movflags +faststart -t 15 $REV/d01_final_candidate_${VER}_PHONECHECK_reference.mp4
echo done
