// Film 02 · audio spotting list from the LOCKED picture timeline: node audio/cues.mjs
// Every time here is read from the same timeline the picture renders from (film/scene.mjs `T`, `GAIT`), and footfalls are
// the gait simulator's actual heel strikes, so sound lands on the exact frame the foot does. Writes cues.json + CUES.md.
import { writeFileSync } from 'node:fs';
import { simulate } from '../lib/gait.mjs';
import { T, GAIT } from '../film/scene.mjs';

const FPS = 30;
const fr = (t) => Math.round(t * FPS);
const tc = (t) => { const f = fr(t); return `00:00:${String(Math.floor(f / FPS)).padStart(2, '0')}:${String(f % FPS).padStart(2, '0')}`; };

// heel strikes (contact off → on), sampled at 480 Hz, inside the window the walker is on screen
function strikes(spec, from, to) {
  const s = simulate(spec(10)), out = []; let prev = null;
  for (let t = from; t <= to; t += 1 / 480) {
    const a = s.at(t);
    if (prev) for (const k of [0, 1]) if (!prev.feet[k].contact && a.feet[k].contact) out.push({ t: +t.toFixed(3), foot: k ? 'far' : 'near', moving: +a.moving.toFixed(2) });
    prev = a;
  }
  return { out, tStop: s.tStop };
}
const mom = strikes(GAIT.mom, 0, T.momOut + 0.6), dad = strikes(GAIT.dad, T.dadIn, T.peopleOut + 0.55), gma = strikes(GAIT.grandma, T.gEnter - 0.2, T.peopleOut + 0.55);

// [time, stem, cue, note]
const E = [
  [0.0, 'ambience', 'Room tone / exterior late-afternoon bed in', 'quiet, real-world; under Mom walking from frame 0'],
  [T.buzz1, 'ui', 'Phone buzz 1 · "Practice moved to Field 7"', 'one subtle buzz; message appears at ' + T.msg1 + ' s'],
  [T.buzz2, 'ui', 'Notification 2 (quieter) · "Who has pickup?"', 'message appears at ' + T.msg2 + ' s'],
  [T.floorUp, 'music', 'Score: first pulse, almost subconscious', 'floor strengthens, camera starts trucking'],
  [T.leave, 'ui', 'Register (very soft) · Leave by 4:48 PM', 'shared restrained register voice; not a beep per item'],
  [T.dad, 'ui', 'Register · Dad drop-off', 'optional; can sit inside the score'],
  [T.leo, 'ui', 'Register · Leo · Soccer Practice', ''],
  [T.field7, 'ui', '"Field 7" leaves the message', 'lands in Leo’s marker ~' + (T.field7 + 0.62).toFixed(2) + ' s'],
  [T.maya, 'ui', 'Register · Maya · Dance', 'Mom glances up and back'],
  [T.prep, 'ui', 'Register · Cleats · Shin guards', ''],
  [T.cleatsFly, 'foley', 'Cleats lift (start)', 'physical: faint cleat clack + lace'],
  [T.cleatsLand, 'foley', 'Cleats land in Mom’s far hand', 'carried from here; faint knock on each step'],
  [T.question, 'ui', '"Who has pickup?" collapses into the phone', ''],
  [T.spool, 'music', 'Orange thread spools → unresolved tension layer begins', 'this layer runs until the resolve at ' + T.resolve + ' s'],
  [T.pullback, 'music', 'Camera pull-back; Mom slows', 'reduce musical movement'],
  [T.pickup, 'ui', 'Pickup · 6:30 · ? lands (orange)', 'no boom, no bass hit'],
  [T.hold, 'music', 'THE WEIGHT · held still', 'space; tension sits. Mom’s breath (1 px shoulder) only'],
  [T.align, 'ui', 'Alignment: grid snaps', 'precise, tiny'],
  [T.fold, 'foley', 'THE FOLD begins (hero) · structural fold/register', 'spatial movement, tonal alignment; ends ' + T.foldEnd + ' s'],
  [T.regMaya, 'ui', 'Register · Maya’s card', 'information settling into place'],
  [T.gp, 'ui', 'Game Plan surface resolves', 'tactile UI register, no ding'],
  [T.regLeo, 'ui', 'Register · Leo — Soccer Practice / Thu 5:30 PM / Field 7', ''],
  [T.regLeave, 'ui', 'Register · Leave by 4:48 PM band', ''],
  [T.regDad, 'ui', 'Register · Who’s doing what · Dad drop-off', ''],
  [T.regPrep, 'ui', 'Register · What to bring · Cleats, Shin guards (lands ' + (T.regPrep + T.prepFly).toFixed(2) + ' s)', ''],
  [T.cleatsDown, 'foley', 'Mom lowers the cleats into the bag', 'into bag ~' + (T.cleatsDown + 0.3).toFixed(2) + '–' + (T.cleatsDown + 0.72).toFixed(2) + ' s'],
  [T.cleatsDown + 0.45, 'music', 'What to bring acknowledges · a little weight leaves', 'row tint ' + (T.cleatsDown + 0.45).toFixed(2) + '–' + (T.cleatsDown + 1.35).toFixed(2) + ' s'],
  [T.dadIn, 'foley', 'Dad walks in (footsteps below)', ''],
  [T.reach, 'foley', 'Dad reaches for the bag', ''],
  [T.bagLift, 'foley', 'BAG HANDOFF · cloth + strap', 'real handoff; almost no musical emphasis'],
  [T.ack, 'ui', 'Dad drop-off acknowledged (neutral link)', 'barely there'],
  [T.look, 'foley', 'Mom looks down at the phone', ''],
  [T.tapWho, 'ui', 'Tap · Who’s doing what', 'subtle'],
  [T.asOut, 'ui', 'Overview → Assignments (view change)', 'Assignments in from ' + T.asIn + ' s'],
  [T.threadRe, 'ui', 'Thread re-anchors to “No one on pickup”', ''],
  [T.gEnter, 'foley', 'Grandma walks in from frame-left (footsteps below)', 'slower pace, softer loafers'],
  [T.tapAssign, 'ui', 'Tap · Assign', ''],
  [T.catch, 'foley', 'Grandma’s hand takes the thread', ''],
  [T.resolve, 'music', 'RESOLVED · Grandma pickup · At 6:30 PM', 'PAYOFF BY SUBTRACTION: the unresolved layer drops out. No chime.'],
  [T.pocket, 'foley', 'Phone into coat pocket', 'small cloth/phone'],
  [T.gGo, 'foley', 'Grandma sets off toward 6:30', ''],
  [T.go, 'foley', 'Mom walks on (free gait)', 'more space around footsteps; music opens slightly'],
  [T.linksOut, 'ui', 'Responsibility links fade (0.55 s)', ''],
  [T.cardOut, 'music', 'World quiets (card recedes 26.85 s in 16:9, 27.0 s in 9:16)', 'world gone by ~' + (T.floorOut + 0.7).toFixed(2) + ' s'],
  [T.card, 'music', 'ACTIQO wordmark fades in', 'NO logo sting; music settles underneath'],
  [T.cardFAI, 'music', 'Family Activity Intelligence', ''],
  [T.cardL1, 'music', 'The activity lasts an hour. / The coordination lasts all week. (' + T.cardL2 + ' s)', ''],
  [T.still, 'music', 'Picture holds (final 24 frames)', 'stable audio tail allowed'],
  [T.end30, 'all', 'End (frame 900)', 'tail may ring out to here; nothing after'],
];
const cues = E.map(([t, stem, cue, note]) => ({ t: +t.toFixed(3), frame: fr(t), tc: tc(t), stem, cue, note }));
const steps = [...mom.out.map((s) => ({ ...s, who: 'Mom' })), ...dad.out.map((s) => ({ ...s, who: 'Dad' })), ...gma.out.map((s) => ({ ...s, who: 'Grandma' }))]
  .sort((a, b) => a.t - b.t).map((s) => ({ ...s, frame: fr(s.t), tc: tc(s.t) }));
const HERE = new URL('./', import.meta.url).pathname;
writeFileSync(HERE + 'cues.json', JSON.stringify({ fps: FPS, duration: 30, frames: 900, cues, footfalls: steps, stops: { mom: mom.tStop, dad: dad.tStop, grandma: gma.tStop } }, null, 1));
let md = `# Film 02 · audio spotting list (locked picture)\n\nGenerated by \`audio/cues.mjs\` from the picture's own timeline. 30 fps, 900 frames, timecode 00:00:SS:FF. Don't edit by hand; re-run the script.\n\n## Events\n| Time (s) | Frame | TC | Stem | Cue | Note |\n|---|---|---|---|---|---|\n`;
for (const c of cues) md += `| ${c.t.toFixed(2)} | ${c.frame} | ${c.tc} | ${c.stem} | ${c.cue} | ${c.note} |\n`;
md += `\n## Footfalls (heel strikes from the gait simulator, on screen only)\nStops (last strike before standing): Mom ${mom.tStop.toFixed(2)} s, Dad ${dad.tStop.toFixed(2)} s, Grandma ${gma.tStop.toFixed(2)} s. \`speed\` is 0–1 (1 = full walking speed); use it for step weight.\n\n| Time (s) | Frame | Who | Foot | Speed |\n|---|---|---|---|---|\n`;
for (const s of steps) md += `| ${s.t.toFixed(3)} | ${s.frame} | ${s.who} | ${s.foot} | ${s.moving} |\n`;
writeFileSync(HERE + 'CUES.md', md);
console.log(`cues ${cues.length}, footfalls ${steps.length} (Mom ${mom.out.length}, Dad ${dad.out.length}, Grandma ${gma.out.length})`);
