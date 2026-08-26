import { getDatabase } from '@netlify/database';

export default async (req) => {
  const auth = req.headers.get('authorization') || '';
  if (auth !== `Bearer ${process.env.ADMIN_SECRET}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  const { sql } = getDatabase();
  const leads = await sql`SELECT * FROM leads ORDER BY created_at DESC`;

  return new Response(JSON.stringify(leads), { status: 200, headers: { 'Content-Type': 'application/json' } });
};
