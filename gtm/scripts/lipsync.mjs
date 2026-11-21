#!/usr/bin/env node
// GTM · fal.ai lip-sync runner. DRY-RUN BY DEFAULT: nothing is uploaded or spent without --confirm-spend.
//   node --env-file=.env gtm/scripts/lipsync.mjs <production> <video rel> <audio rel> <out rel> [--confirm-spend]
// Paths are relative to gtm/<production>/. Cap and price from brief/budget.json ("lipsync" + price_usd[endpoint].per_minute).
// Every paid submission is logged to gtm/generations-ledger.jsonl BEFORE it is sent. FAL_KEY is never printed or written.
import { readFileSync, writeFileSync, existsSync, mkdirSync, appendFileSync } from 'node:fs';
import { dirname, join, resolve, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const GTM = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const LEDGER = join(GTM, 'generations-ledger.jsonl');
const args = process.argv.slice(2); const confirm = args.includes('--confirm-spend');
const [prod, vRel, aRel, outRel] = args.filter((a) => !a.startsWith('--'));
const die = (m) => { console.error('✖ ' + m); process.exit(1); };
if (!prod || !vRel || !aRel || !outRel) die('usage: lipsync.mjs <production> <video> <audio> <out> [--confirm-spend]');
const P = join(GTM, prod); const B = JSON.parse(readFileSync(join(P, 'brief/budget.json'), 'utf8'));
const L = B.lipsync ?? die('no "lipsync" block in budget.json (not approved)');
const endpoint = L.endpoint; const perMin = B.price_usd?.[endpoint]?.per_minute ?? die(`no price for ${endpoint}`);
const V = join(P, vRel), A = join(P, aRel), OUT = join(P, outRel);
for (const f of [V, A]) if (!existsSync(f)) die(`missing ${f}`);
if (existsSync(OUT)) die(`refusing to overwrite ${outRel}`);
const dur = (f) => +execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString().trim();
const dv = dur(V), da = dur(A);
if (Math.abs(dv - da) > 0.05) die(`video ${dv}s and audio ${da}s differ; build matching durations first`);
const ledger = existsSync(LEDGER) ? readFileSync(LEDGER, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l)) : [];
const rejected = new Set(ledger.filter((e) => e.status === 'rejected').map((e) => e.ts));
const prior = ledger.filter((e) => e.production === prod && e.kind === 'lipsync' && e.status === 'submitted' && !rejected.has(e.ts)).length;
if (prior >= L.max_passes) die(`cap: ${prior} lip-sync pass(es) already for ${prod} (max ${L.max_passes}). Stop and report.`);
const est = +(perMin * dv / 60).toFixed(3);
console.log(`${prod} · lipsync · ${endpoint}\nvideo ${vRel} (${dv}s) · audio ${aRel} (${da}s) · sync_mode cut_off\nestimated cost: $${est} ($${perMin}/min list) · prior passes ${prior}/${L.max_passes}\n→ ${outRel}`);
if (!confirm) { console.log('DRY RUN: nothing uploaded or sent. Re-run with --confirm-spend.'); process.exit(0); }
const KEY = process.env.FAL_KEY ?? die('FAL_KEY not set');
const H = { Authorization: `Key ${KEY}` };
// upload both files to fal storage (CDN); fall back to a data URI if the storage API refuses
const upload = async (f, type) => {
  try {
    const init = await fetch('https://rest.alpha.fal.ai/storage/upload/initiate?storage_type=fal-cdn-v3', { method: 'POST', headers: { ...H, 'Content-Type': 'application/json' }, body: JSON.stringify({ content_type: type, file_name: basename(f) }) });
    if (!init.ok) throw new Error(`initiate ${init.status}`);
    const { upload_url, file_url } = await init.json();
    const put = await fetch(upload_url, { method: 'PUT', headers: { 'Content-Type': type }, body: readFileSync(f) });
    if (!put.ok) throw new Error(`put ${put.status}`);
    console.log('uploaded', basename(f)); return file_url;
  } catch (e) { console.log(`storage upload failed (${e.message}); using a data URI for`, basename(f)); return `data:${type};base64,${readFileSync(f).toString('base64')}`; }
};
const video_url = await upload(V, 'video/mp4'); const audio_url = await upload(A, 'audio/wav');
const input = { video_url, audio_url, sync_mode: 'cut_off' };
const entry = { ts: new Date().toISOString(), production: prod, shot: 's2', kind: 'lipsync', endpoint, est_usd: est, video: vRel, audio: aRel, status: 'submitted' };
appendFileSync(LEDGER, JSON.stringify(entry) + '\n');
const sub = await fetch(`https://queue.fal.run/${endpoint}`, { method: 'POST', headers: { ...H, 'Content-Type': 'application/json' }, body: JSON.stringify(input) });
if (!sub.ok) { const t = (await sub.text()).slice(0, 400); appendFileSync(LEDGER, JSON.stringify({ ...entry, status: 'rejected', http: sub.status, est_usd: 0, note: 'refused at submit; no job, no charge' }) + '\n'); die(`submit failed ${sub.status}: ${t}`); }
const { request_id, status_url, response_url } = await sub.json(); console.log('request', request_id);
for (;;) { await new Promise((r) => setTimeout(r, 5000)); const s = await (await fetch(status_url, { headers: H })).json(); process.stdout.write(`\r${s.status}      `); if (s.status === 'COMPLETED') break; if (s.status === 'FAILED' || s.error) die(`failed: ${JSON.stringify(s).slice(0, 400)}`); }
const res = await (await fetch(response_url, { headers: H })).json();
const url = res.video?.url ?? die(`no video in response: ${JSON.stringify(res).slice(0, 300)}`);
mkdirSync(dirname(OUT), { recursive: true }); writeFileSync(OUT, Buffer.from(await (await fetch(url)).arrayBuffer()));
writeFileSync(OUT.replace(/\.\w+$/, '.json'), JSON.stringify({ ...entry, status: 'completed', request_id, sync_mode: 'cut_off', output: outRel }, null, 2));
appendFileSync(LEDGER, JSON.stringify({ ...entry, status: 'completed', request_id, output: outRel }) + '\n');
console.log(`\n✔ ${prod}/${outRel}`);
