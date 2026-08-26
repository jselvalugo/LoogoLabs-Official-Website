import { getDatabase } from '@netlify/database';

export default async (req) => {
  if (req.method !== 'DELETE') {
    return new Response(null, { status: 405 });
  }

  const auth = req.headers.get('authorization') || '';
  if (auth !== `Bearer ${process.env.ADMIN_SECRET}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  let body;
  try { body = await req.json(); } catch { return new Response(null, { status: 400 }); }

  const { id } = body;
  if (!id) {
    return new Response(JSON.stringify({ error: 'id required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  const { sql } = getDatabase();
  await sql`DELETE FROM leads WHERE id = ${id}`;

  return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
};
