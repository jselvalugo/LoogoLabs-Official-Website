import { getDatabase } from '@netlify/database';

const KINDS = ['note', 'call', 'email', 'meeting', 'text'];
const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

// A lead's CRM timeline. GET ?lead_id= lists it (newest first), POST adds a
// note or logged touchpoint, DELETE removes one entry.
export default async (req) => {
  const auth = req.headers.get('authorization') || '';
  if (auth !== `Bearer ${process.env.ADMIN_SECRET}`) return json({ error: 'Unauthorized' }, 401);

  const { sql } = getDatabase();

  if (req.method === 'GET') {
    const leadId = new URL(req.url).searchParams.get('lead_id');
    if (!leadId) return json({ error: 'lead_id required' }, 400);
    const rows = await sql`SELECT * FROM lead_activity WHERE lead_id = ${leadId} ORDER BY created_at DESC`;
    return json(rows);
  }

  let body;
  try { body = await req.json(); } catch { return new Response(null, { status: 400 }); }

  if (req.method === 'POST') {
    const kind = KINDS.includes(body.kind) ? body.kind : 'note';
    const text = typeof body.body === 'string' ? body.body.trim().slice(0, 8000) : '';
    if (!body.lead_id || !text) return json({ error: 'lead_id and body required' }, 400);
    const [row] = await sql`INSERT INTO lead_activity (lead_id, kind, body) VALUES (${body.lead_id}, ${kind}, ${text}) RETURNING *`;
    await sql`UPDATE leads SET updated_at = now() WHERE id = ${body.lead_id}`;
    return json(row, 201);
  }

  if (req.method === 'DELETE') {
    if (!body.id) return json({ error: 'id required' }, 400);
    await sql`DELETE FROM lead_activity WHERE id = ${body.id}`;
    return json({ ok: true });
  }

  return new Response(null, { status: 405 });
};
