// Counts clicks on the "open the official form" buttons (Form 6, Form 8).
// GET  /api/clicks        -> { "total": n }
// POST /api/clicks  body: "form6" | "form8"  (sent with navigator.sendBeacon)
//
// Counts at most once per visitor, form and day. The visitor is identified only by
// a salted SHA-256 hash of their IP address, kept until the next day. Preview
// deployments (COUNT_CLICKS != "true") never write.

const FORMS = new Set(['form6', 'form8']);

export async function onRequestGet({ env }) {
  const row = await env.DB.prepare('SELECT COALESCE(SUM(total), 0) AS total FROM form_clicks').first();
  return Response.json(
    { total: row.total },
    { headers: { 'Cache-Control': 'public, max-age=60' } },
  );
}

export async function onRequestPost({ request, env }) {
  const noContent = new Response(null, { status: 204 });
  if (env.COUNT_CLICKS !== 'true' || !env.COUNT_SALT) return noContent;

  // Only accept beacons sent by our own pages.
  if (request.headers.get('Origin') !== new URL(request.url).origin) {
    return new Response(null, { status: 403 });
  }
  const form = (await request.text()).trim();
  if (!FORMS.has(form)) return new Response(null, { status: 400 });

  const ip = request.headers.get('CF-Connecting-IP') ?? '';
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
  const id = await sha256(`${env.COUNT_SALT}|${today}|${form}|${ip}`);

  const [inserted] = await env.DB.batch([
    env.DB.prepare('INSERT OR IGNORE INTO seen_today (id, day) VALUES (?, ?)').bind(id, today),
    env.DB.prepare('DELETE FROM seen_today WHERE day < ?').bind(yesterday),
  ]);
  if (inserted.meta.changes === 1) {
    await env.DB.prepare('UPDATE form_clicks SET total = total + 1 WHERE form = ?').bind(form).run();
  }
  return noContent;
}

async function sha256(text) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}
