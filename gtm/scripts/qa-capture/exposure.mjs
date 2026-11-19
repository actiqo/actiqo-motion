// Client-exposure scanner. Secrets arrive via env (D01_SCAN_SECRETS, newline-separated) and are only ever compared in
// memory; output is counts/booleans. Watches every browser request (URL, headers, body) and every response body/headers
// from the app host and QA, plus page HTML and local/session storage on demand.
const PROD_MARKERS = ['nbcscseppzzdfhmihvfl']; // production Supabase ref
export function attach(ctx, { qaHost }) {
  const secrets = (process.env.D01_SCAN_SECRETS ?? '').split('\n').map((s) => s.trim()).filter((s) => s.length >= 16);
  if (!secrets.length) throw new Error('D01_SCAN_SECRETS not provided: refusing to run without the exposure scan');
  const r = { requests: 0, responses: 0, bodiesScanned: 0, hosts: new Set(), secretHits: [], prodHits: [], qaSeen: false, pending: [] };
  const hit = (where, text) => {
    if (!text) return;
    if (secrets.some((s) => text.includes(s))) r.secretHits.push(where);
    if (PROD_MARKERS.some((m) => text.includes(m))) r.prodHits.push(where);
  };
  ctx.on('request', (q) => {
    r.requests++; const u = new URL(q.url()); if (u.protocol.startsWith('http')) r.hosts.add(u.host);
    if (u.host === qaHost) r.qaSeen = true;
    hit(`req-url ${u.host}${u.pathname}`, q.url());
    hit(`req-headers ${u.host}${u.pathname}`, JSON.stringify(q.headers()));
    hit(`req-body ${u.host}${u.pathname}`, q.postData() ?? '');
  });
  ctx.on('response', (s) => {
    r.responses++;
    const u = new URL(s.url());
    r.pending.push((async () => {
      hit(`res-headers ${u.host}${u.pathname}`, JSON.stringify(await s.allHeaders().catch(() => ({}))));
      const ct = (s.headers()['content-type'] ?? '');
      if (/javascript|json|html|text|x-component/.test(ct)) { const b = await s.text().catch(() => null); if (b != null) { r.bodiesScanned++; hit(`res-body ${u.host}${u.pathname}`, b); } }
    })());
  });
  return {
    async page(page, label) {
      hit(`html ${label}`, await page.content());
      const st = await page.evaluate(() => JSON.stringify({ l: { ...localStorage }, s: { ...sessionStorage }, c: document.cookie }));
      hit(`storage ${label}`, st);
    },
    async report() {
      await Promise.race([Promise.allSettled(r.pending), new Promise((ok) => setTimeout(ok, 15000))]); // streaming responses never settle
      return { requests: r.requests, responses: r.responses, bodiesScanned: r.bodiesScanned, hosts: [...r.hosts].sort(), qaSupabaseUsed: r.qaSeen,
        serviceRoleOrSecretHits: [...new Set(r.secretHits)], productionRefHits: [...new Set(r.prodHits)] };
    },
  };
}
