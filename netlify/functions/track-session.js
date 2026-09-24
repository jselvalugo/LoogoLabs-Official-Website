import { getDatabase } from '@netlify/database';

// Heartbeat endpoint for src/lib/sessionTracker.js. Each call carries the
// session's running totals, so it upserts one row per session; GREATEST keeps a
// late or out-of-order beacon from rolling the numbers back. Public endpoint:
// everything is validated and clamped.
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX_SECONDS = 4 * 60 * 60;
const int = (v, max) => { const n = Math.floor(Number(v)); return Number.isFinite(n) && n > 0 ? Math.min(n, max) : 0; };
const path = (v) => (typeof v === 'string' && v.startsWith('/') ? v.slice(0, 200) : null);

export default async (req, context) => {
  if (req.method !== 'POST') return new Response(null, { status: 405 });

  // sendBeacon posts the body as text, so parse it ourselves.
  let body;
  try { body = JSON.parse(await req.text()); } catch { return new Response(null, { status: 400 }); }
  if (!UUID_RE.test(body?.id || '')) return new Response(null, { status: 400 });

  const paths = {};
  for (const [p, s] of Object.entries(body.paths || {}).slice(0, 50)) {
    const key = path(p);
    if (key) paths[key] = int(s, MAX_SECONDS);
  }
  const active = int(body.active_seconds, MAX_SECONDS);
  const pages = Math.max(1, int(body.page_count, 1000));
  const referrer = typeof body.referrer === 'string' ? body.referrer.slice(0, 120) || null : null;
  const device = ['mobile', 'tablet', 'desktop'].includes(body.device) ? body.device : null;
  const geo = context?.geo || {};

  const { sql } = getDatabase();
  await sql`
    INSERT INTO site_sessions (id, active_seconds, page_count, landing_path, paths, referrer, device, city, region, country)
    VALUES (${body.id}, ${active}, ${pages}, ${path(body.landing_path)}, ${JSON.stringify(paths)}::jsonb, ${referrer}, ${device},
      ${geo.city || null}, ${geo.subdivision?.name || null}, ${geo.country?.name || null})
    ON CONFLICT (id) DO UPDATE SET
      active_seconds = GREATEST(site_sessions.active_seconds, EXCLUDED.active_seconds),
      page_count = GREATEST(site_sessions.page_count, EXCLUDED.page_count),
      paths = EXCLUDED.paths,
      last_seen_at = now()
  `;

  return new Response(null, { status: 204 });
};
