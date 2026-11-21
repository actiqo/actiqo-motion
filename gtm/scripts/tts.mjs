// Guarded fal TTS runner (ElevenLabs v4 via fal). Dry-run by default; spends only with --confirm-spend.
// Usage: node --env-file=.env gtm/scripts/tts.mjs <production> <voice> <out.wav (relative to gtm/<production>/)> "<text>" [--confirm-spend]
// Cap: gtm/<production>/brief/tts_budget.json { endpoint, usd_per_1k_chars, cap_usd }. Ledger: gtm/generations-ledger.jsonl.
import { readFileSync, writeFileSync, appendFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const LEDGER = join(ROOT, 'generations-ledger.jsonl');
const [prod, voice, outRel, text] = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const confirm = process.argv.includes('--confirm-spend');
const die = (m) => { console.error('✖ ' + m); process.exit(1); };
if (!prod || !voice || !outRel || !text) die('usage: tts.mjs <production> <voice> <out.wav> "<text>" [--confirm-spend]');
const P = join(ROOT, prod);
const B = JSON.parse(readFileSync(join(P, 'brief/tts_budget.json'), 'utf8'));
const est = (text.length / 1000) * B.usd_per_1k_chars;
const ledger = existsSync(LEDGER) ? readFileSync(LEDGER, 'utf8').trim().split('\n').filter(Boolean).map((l) => JSON.parse(l)) : [];
const spent = ledger.filter((e) => e.production === prod && e.kind === 'tts' && e.status === 'completed').reduce((a, e) => a + e.est_usd, 0);
const out = join(P, outRel);
if (existsSync(out)) die(`refusing to overwrite ${outRel}`);
console.log(`${prod} · tts · ${B.endpoint} · voice ${voice}\n${text.length} chars → est $${est.toFixed(4)} · spent so far $${spent.toFixed(4)} of cap $${B.cap_usd}\n→ ${outRel}`);
if (spent + est > B.cap_usd) die(`cap: $${(spent + est).toFixed(4)} would exceed $${B.cap_usd}. Stop and report.`);
if (!confirm) { console.log('DRY RUN: nothing sent.'); process.exit(0); }
const KEY = process.env.FAL_KEY; if (!KEY) die('FAL_KEY not set');
const H = { Authorization: `Key ${KEY}`, 'Content-Type': 'application/json' };
const input = { text, voice, output_format: 'pcm_48000', timestamps: true, stability: B.stability ?? 0.5, similarity_boost: 0.75, language_code: 'en', ...(B.extra ?? {}) };
const entry = { ts: new Date().toISOString(), production: prod, shot: 'narration', kind: 'tts', endpoint: B.endpoint, voice, chars: text.length, est_usd: +est.toFixed(5), status: 'submitted' };
appendFileSync(LEDGER, JSON.stringify(entry) + '\n');
const sub = await fetch(`https://queue.fal.run/${B.endpoint}`, { method: 'POST', headers: H, body: JSON.stringify(input) });
if (!sub.ok) { appendFileSync(LEDGER, JSON.stringify({ ...entry, status: 'rejected', http: sub.status, est_usd: 0 }) + '\n'); die(`submit ${sub.status}: ${(await sub.text()).slice(0, 300)}`); }
const { request_id, status_url, response_url } = await sub.json();
for (;;) { await new Promise((r) => setTimeout(r, 1500)); const s = await (await fetch(status_url, { headers: H })).json(); if (s.status === 'COMPLETED') break; if (s.status === 'FAILED' || s.error) die(JSON.stringify(s).slice(0, 300)); }
const res = await (await fetch(response_url, { headers: H })).json();
const url = res.audio?.url; if (!url) die('no audio url: ' + JSON.stringify(res).slice(0, 300));
let buf = Buffer.from(await (await fetch(url)).arrayBuffer());
if (buf.subarray(0, 4).toString() !== 'RIFF') { // raw PCM s16le mono 48 kHz → WAV
  const h = Buffer.alloc(44); h.write('RIFF', 0); h.writeUInt32LE(36 + buf.length, 4); h.write('WAVEfmt ', 8); h.writeUInt32LE(16, 16);
  h.writeUInt16LE(1, 20); h.writeUInt16LE(1, 22); h.writeUInt32LE(48000, 24); h.writeUInt32LE(96000, 28); h.writeUInt16LE(2, 32); h.writeUInt16LE(16, 34);
  h.write('data', 36); h.writeUInt32LE(buf.length, 40); buf = Buffer.concat([h, buf]);
}
mkdirSync(dirname(out), { recursive: true }); writeFileSync(out, buf);
writeFileSync(out.replace(/\.wav$/, '.json'), JSON.stringify({ ...entry, status: 'completed', request_id, input: { ...input }, timestamps: res.timestamps ?? null }, null, 2));
appendFileSync(LEDGER, JSON.stringify({ ...entry, status: 'completed', request_id, output: outRel }) + '\n');
console.log(`✔ ${outRel} (request ${request_id})`);
