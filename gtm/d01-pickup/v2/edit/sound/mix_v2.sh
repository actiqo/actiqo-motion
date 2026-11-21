#!/usr/bin/env bash
# D01 Narrated v2 sound: v1 dialogue edit + room tail + narration phrases + re-timed v02 UI SFX + locked Saved cue + v02 bed (ducked).
# Picture comes from the HyperFrames render (muted, $1); output muxed to $2. v1 files are read, never written.
set -euo pipefail
cd "$(dirname "$0")"
PIC=$1; OUT=$2; MUSICFREE=${3:-}
V1=../../../edit; SND=$V1/sound; A=../assets; W=/tmp/claude-1000/-workspaces-actiqo-motion/86b47b57-f058-4fdf-aa1c-0227865b12fc/scratchpad/d01v2/snd; mkdir -p $W
node $SND/synth.mjs >/dev/null   # writes $SND/out (git-ignored build output)
NARR_GAIN=${NARR_GAIN:-1.0}   # per-phrase gains above do the level match
# narration phrase placement: src_in src_out → timeline start (from the take's own timestamps / silences)
declare -a N=("0.00 2.95 2.85 0.462" "3.00 5.55 6.55 0.525" "5.62 8.27 9.70 0.376" "8.50 10.15 12.60 0.484")   # FINAL take: src_in src_out tl_start phrase_gain (each phrase → dialogue level, −25.3 LUFS premaster)
NF=""; NL=""
for i in "${!N[@]}"; do set -- ${N[$i]}; d=$(awk "BEGIN{printf \"%d\", $3*1000}");
  NF="$NF[6:a]atrim=$1:$2,asetpts=N/SR/TB,aformat=sample_rates=48000:channel_layouts=stereo,afade=t=in:d=0.02,afade=t=out:st=$(awk "BEGIN{print $2-$1-0.04}"):d=0.04,volume=$4,adelay=$d|$d,apad=whole_dur=15[n$i];"; NL="$NL[n$i]"; done
NARR="${NF}${NL}amix=inputs=4:normalize=0,highpass=f=80:poles=1,volume=$NARR_GAIN[narr]"
DIA="[0:a]aformat=sample_rates=48000:channel_layouts=stereo,volume='if(lt(t,1.28),1.413,1)':eval=frame,highpass=f=70:poles=1[dia]"
ROOM="[1:a]atrim=2.30:2.52,asetpts=N/SR/TB,aformat=sample_rates=48000:channel_layouts=stereo,asplit=3[r1][r2][r3];[r2]areverse[r2r];[r1][r2r][r3]concat=n=3:v=0:a=1,afade=t=in:d=0.08,afade=t=out:st=0.30:d=0.36,adelay=2620|2620,apad=whole_dur=15[room]"
ms() { awk "BEGIN{printf \"%d\", $1*1000}"; }
SFX="[2:a]volume=0.22,adelay=$(ms 2.50)|$(ms 2.50),apad=whole_dur=15[enter];[3:a]volume=0.12,adelay=$(ms 6.29)|$(ms 6.29),apad=whole_dur=15[t1];[4:a]volume=0.12,adelay=$(ms 8.80)|$(ms 8.80),apad=whole_dur=15[t2];[5:a]volume=0.11,adelay=$(ms 9.80)|$(ms 9.80),apad=whole_dur=15[t3];[7:a]volume=0.21,adelay=$(ms 10.00)|$(ms 10.00),apad=whole_dur=15[saved]"
# bed: delayed 0.277 s (release on the 10.00 resolved cut); 0.10 under dialogue, 0.30 under narration, 0.75 between, fade 13.9→15.0
ENV=$(node -e '
const iv=[[2.85,5.80],[6.55,9.10],[9.70,12.35],[12.60,14.25]]; const r=0.15;
// piecewise: under dialogue 0.10 until 2.70 then ramps; build nested if() over time
const pts=[[0,0.10],[2.70,0.10],[2.85,0.30]]; for (let k=0;k<iv.length;k++){ const [a,b]=iv[k]; if(k>0) pts.push([a-r,0.75],[a,0.30]); pts.push([b,0.30],[b+r,0.75]); }
pts.push([13.9,Math.min(0.75,0.30)],[15.0,0.0]);
pts.sort((x,y)=>x[0]-y[0]); let e=`${pts.at(-1)[1]}`;
for (let i=pts.length-2;i>=0;i--){ const [t0,v0]=pts[i],[t1,v1]=pts[i+1]; const seg=t1>t0?`${v0}+(${v1}-${v0})*(t-${t0})/${(t1-t0).toFixed(4)}`:`${v1}`; e=`if(lt(t,${t1}),${seg},${e})`; }
process.stdout.write(e);')
BED="[8:a]volume=0.56[pad];[9:a]volume=0.285[rh];[pad][rh]amix=inputs=2:normalize=0,adelay=277|277,atrim=0:15,asetpts=N/SR/TB,volume='$ENV':eval=frame[bed]"
mix() { local ins="[dia][room][narr][enter][t1][t2][t3][saved]" n=8 sink=""; if [ "$2" = 1 ]; then ins="$ins[bed]"; n=9; else sink="[bed]anullsink;"; fi
  ffmpeg -hide_banner -loglevel error -y -i $V1/review/d01_rough_v02.mp4 -i $A/s2_jordan_fast_v01.mp4 -i $SND/out/sfx_enter.wav -i $SND/out/sfx_tap.wav -i $SND/out/sfx_tap_select.wav \
    -i $SND/out/sfx_tap_save.wav -i $A/narration.wav -i $SND/locked/sfx_saved_v01.wav -i $SND/out/bed_pad.wav -i $SND/out/bed_rhythm.wav \
    -filter_complex "$DIA;$ROOM;$NARR;$SFX;$BED;${sink}${ins}amix=inputs=$n:normalize=0,atrim=0:15,asetpts=N/SR/TB[m]" -map "[m]" -c:a pcm_s24le -ar 48000 $W/$1_pre.wav; }
mix full 1; mix musicfree 0
G=11.9   # same master gain as D01 v1 (dialogue level identical)
for v in full musicfree; do ffmpeg -hide_banner -loglevel error -y -i $W/${v}_pre.wav -af "volume=${G}dB,aresample=192000,alimiter=limit=0.8414:attack=1:release=60:level=disabled,aresample=48000" -c:a pcm_s24le $W/${v}_master.wav; done
ffmpeg -hide_banner -loglevel error -y -i $PIC -i $W/full_master.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 320k -ar 48000 -movflags +faststart -t 15 $OUT
[ -n "$MUSICFREE" ] && ffmpeg -hide_banner -loglevel error -y -i $PIC -i $W/musicfree_master.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 320k -ar 48000 -movflags +faststart -t 15 $MUSICFREE
echo ok
