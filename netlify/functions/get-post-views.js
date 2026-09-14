import { getDatabase } from '@netlify/database';

export default async (req) => {
  const auth = req.headers.get('authorization') || '';
  if (auth !== `Bearer ${process.env.ADMIN_SECRET}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  const { sql } = getDatabase();
  const views = await sql`SELECT post_slug, city, region, country, created_at FROM post_views ORDER BY created_at DESC`;

  return new Response(JSON.stringify(views), { status: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
};
