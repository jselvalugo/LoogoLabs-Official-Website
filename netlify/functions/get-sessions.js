import { getDatabase } from '@netlify/database';

export default async (req) => {
  const auth = req.headers.get('authorization') || '';
  if (auth !== `Bearer ${process.env.ADMIN_SECRET}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  // Last 90 days is what the Analytics page charts; capped so the payload stays small.
  const { sql } = getDatabase();
  const sessions = await sql`
    SELECT id, started_at, last_seen_at, active_seconds, page_count, landing_path, paths, referrer, device, city, region, country
    FROM site_sessions
    WHERE started_at > now() - interval '90 days'
    ORDER BY started_at DESC
    LIMIT 20000
  `;

  return new Response(JSON.stringify(sessions), { status: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
};
