import { getDatabase } from '@netlify/database';

export default async (req) => {
  if (req.method !== 'PATCH') {
    return new Response(null, { status: 405 });
  }

  const auth = req.headers.get('authorization') || '';
  if (auth !== `Bearer ${process.env.ADMIN_SECRET}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  let body;
  try { body = await req.json(); } catch { return new Response(null, { status: 400 }); }

  const { id, status, notes } = body;
  if (!id) {
    return new Response(JSON.stringify({ error: 'id required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  const { sql } = getDatabase();
  const [lead] = await sql`
    UPDATE leads SET status = ${status}, notes = ${notes ?? ''} WHERE id = ${id} RETURNING *
  `;

  return new Response(JSON.stringify(lead), { status: 200, headers: { 'Content-Type': 'application/json' } });
};
