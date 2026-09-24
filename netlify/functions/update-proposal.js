import { getDatabase } from '@netlify/database';

const STATUSES = ['new', 'reviewing', 'sent', 'won', 'lost'];

export default async (req) => {
  if (req.method !== 'PATCH') return new Response(null, { status: 405 });

  const auth = req.headers.get('authorization') || '';
  if (auth !== `Bearer ${process.env.ADMIN_SECRET}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  let body;
  try { body = await req.json(); } catch { return new Response(null, { status: 400 }); }

  const { id, status, admin_notes } = body;
  if (!id) return new Response(JSON.stringify({ error: 'id required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  if (status !== undefined && !STATUSES.includes(status)) {
    return new Response(JSON.stringify({ error: 'invalid status' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  const { sql } = getDatabase();
  const [row] = await sql`
    UPDATE proposals SET
      status = COALESCE(${status ?? null}, status),
      admin_notes = COALESCE(${typeof admin_notes === 'string' ? admin_notes.slice(0, 8000) : null}, admin_notes),
      updated_at = now()
    WHERE id = ${id} RETURNING *
  `;
  if (!row) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });

  return new Response(JSON.stringify(row), { status: 200, headers: { 'Content-Type': 'application/json' } });
};
