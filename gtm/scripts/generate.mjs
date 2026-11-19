#!/usr/bin/env node
// GTM · fal.ai generation runner. DRY-RUN BY DEFAULT: nothing is sent (and nothing is spent) without --confirm-spend.
//
//   node --env-file=.env gtm/scripts/generate.mjs <production> <shot> <keyframe|draft|keeper> [--confirm-spend] [--composition-approved]
//   e.g. node --env-file=.env gtm/scripts/generate.mjs d01-pickup s1 keyframe
//
// Reads  gtm/<production>/generations/prompts/<shot>_*.json  and  gtm/<production>/brief/budget.json
// Writes keyframes → the prompt's keyframe.out (versioned, never overwrites) · video → generations/raw/<shot>/ (git-ignored)
// Logs   every paid submission to gtm/generations-ledger.jsonl BEFORE it is sent, so a failed call still counts against caps.
// The key is read from FAL_KEY only and is never printed, logged or written anywhere.
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, appendFileSync } from 'node:fs';
import { dirname, join, resolve, extname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const GTM = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const LEDGER = join(GTM, 'generations-ledger.jsonl');
const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith('--')));
const [prod, shot, kind] = args.filter((a) => !a.startsWith('--'));
const die = (m) => { console.error('✖ ' + m); process.exit(1); };
if (!prod || !shot || !['keyframe', 'draft', 'keeper'].includes(kind)) die('usage: generate.mjs <production> <shot> <keyframe|draft|keeper> [--confirm-spend] [--composition-approved]');

const P = join(GTM, prod);
const budget = JSON.parse(readFileSync(join(P, 'brief/budget.json'), 'utf8'));
const promptFile = readdirSync(join(P, 'generations/prompts')).find((f) => f.startsWith(shot + '_') && f.endsWith('.json'));
if (!promptFile) die(`no prompt file for ${shot} in ${prod}/generations/prompts/`);
const spec = JSON.parse(readFileSync(join(P, 'generations/prompts', promptFile), 'utf8'));
const ledger = existsSync(LEDGER) ? readFileSync(LEDGER, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l)) : [];
// One 'submitted' line per call. A call the provider refused at submit (HTTP error, no job created, no charge) gets a
// 'rejected' line with the same ts and does not count against caps. Anything that got past submit always counts.
const rejected = new Set(ledger.filter((e) => e.status === 'rejected').map((e) => e.ts));
const prior = ledger.filter((e) => e.production === prod && e.shot === shot && e.status === 'submitted' && !rejected.has(e.ts));

const dataUri = (rel) => {
  const f = join(P, rel); if (!existsSync(f)) die(`missing input image ${rel} (approve the keyframe first)`);
  const buf = readFileSync(f); if (buf.length > 8e6) die(`${rel} is over 8 MB`);
  return `data:image/${extname(f).slice(1).replace('jpg', 'jpeg')};base64,${buf.toString('base64')}`;
};
const nextFree = (rel) => { // never overwrite: …_v01.png → …_v02.png
  let p = rel; while (existsSync(join(P, p))) p = p.replace(/_v(\d+)(\.\w+)$/, (_, n, e) => `_v${String(+n + 1).padStart(2, '0')}${e}`);
  return p;
};

let endpoint, input, est, outRel;
if (kind === 'keyframe') {
  const k = spec.keyframe; endpoint = k.endpoint;
  const n = prior.filter((e) => e.kind === 'keyframe').length;
  if (n >= budget.max_keyframes_per_character) die(`cap: ${n} keyframes already for ${shot} (max ${budget.max_keyframes_per_character}). Stop and report.`);
  input = { ...k.input }; delete input.negative_prompt_note;
  if (k.reference) input.image_urls = [dataUri(k.reference)];
  if (/4k/i.test(input.resolution)) die('4K is not allowed');
  est = budget.price_usd[endpoint].per_image * (input.num_images ?? 1);
  outRel = nextFree(k.out);
} else {
  const v = spec.video; endpoint = kind === 'draft' ? v.draft_endpoint : v.keeper_endpoint;
  if (endpoint !== budget.endpoints[kind]) die(`endpoint ${endpoint} is not the configured ${kind} endpoint ${budget.endpoints[kind]}`);
  if (kind === 'keeper' && !flags.has('--composition-approved')) die('keeper renders need the draft composition approved first (--composition-approved)');
  const n = prior.filter((e) => e.kind === 'draft' || e.kind === 'keeper').length;
  if (n >= budget.max_paid_video_per_shot) die(`cap: ${n} paid video generations already for ${shot} (max ${budget.max_paid_video_per_shot}). Stop and report.`);
  input = { ...v.input, image_url: dataUri(spec.keyframe.out) };
  if (!budget.allow_4k && /4k/i.test(input.resolution)) die('4K is not allowed');
  const rate = budget.price_usd[endpoint][input.generate_audio ? 'per_second_audio' : 'per_second_silent'];
  est = rate * parseInt(input.duration, 10);
  outRel = `generations/raw/${shot}/${new Date().toISOString().replace(/[:.]/g, '-')}_${kind}.mp4`;
}

const shown = JSON.stringify(input, (k, val) => (typeof val === 'string' && val.startsWith('data:') ? `<${val.length} chars of image data>` : val), 2);
console.log(`\n${prod} · ${shot} · ${kind}\nendpoint: ${endpoint}\nestimated cost: $${est.toFixed(2)} (fal list price, ${budget.price_usd._source})\nprior paid calls for ${shot}: ${prior.length}\noutput → ${prod}/${outRel}\ninput:\n${shown}\n`);
if (!flags.has('--confirm-spend')) { console.log('DRY RUN: nothing sent. Re-run with --confirm-spend to submit.'); process.exit(0); }
const KEY = process.env.FAL_KEY; if (!KEY) die('FAL_KEY is not set (run with node --env-file=.env …)');

const entry = { ts: new Date().toISOString(), production: prod, shot, kind, endpoint, est_usd: est, prompt_sha: createHash('sha256').update(JSON.stringify({ ...input, image_url: undefined, image_urls: undefined })).digest('hex').slice(0, 12), status: 'submitted' };
appendFileSync(LEDGER, JSON.stringify(entry) + '\n');
const H = { Authorization: `Key ${KEY}`, 'Content-Type': 'application/json' };
const sub = await fetch(`https://queue.fal.run/${endpoint}`, { method: 'POST', headers: H, body: JSON.stringify(input) });
if (!sub.ok) {
  const body = (await sub.text()).slice(0, 500);
  appendFileSync(LEDGER, JSON.stringify({ ...entry, status: 'rejected', http: sub.status, est_usd: 0, note: 'refused at submit; no job, no charge' }) + '\n');
  die(`submit failed ${sub.status}: ${body}`);
}
const { request_id, status_url, response_url } = await sub.json();
console.log('request', request_id);
for (;;) {
  await new Promise((r) => setTimeout(r, 5000));
  const s = await (await fetch(status_url, { headers: H })).json();
  process.stdout.write(`\r${s.status}${s.queue_position != null ? ' · queue ' + s.queue_position : ''}      `);
  if (s.status === 'COMPLETED') break;
  if (s.status === 'FAILED' || s.error) die(`generation failed: ${JSON.stringify(s).slice(0, 500)}`);
}
const res = await (await fetch(response_url, { headers: H })).json();
const url = res.video?.url ?? res.images?.[0]?.url; if (!url) die(`no output url: ${JSON.stringify(res).slice(0, 500)}`);
const out = join(P, outRel); mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, Buffer.from(await (await fetch(url)).arrayBuffer()));
const side = { ...entry, status: 'completed', request_id, prompt_file: promptFile, input: JSON.parse(shown), seed: res.seed ?? null, description: res.description ?? null, output: outRel };
writeFileSync(out.replace(/\.\w+$/, '.json'), JSON.stringify(side, null, 2));
appendFileSync(LEDGER, JSON.stringify({ ...entry, status: 'completed', request_id, output: outRel }) + '\n');
console.log(`\n✔ ${prod}/${outRel}`);
