import { getDatabase } from '@netlify/database';

export const STATUSES = ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'];
const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
const text = (v, max = 500) => (typeof v === 'string' ? v.trim().slice(0, max) : null);

// CRM edits from the admin Leads page. Only fields present in the body change;
// send an empty string to clear phone/company, or null to clear value/follow-up.
export default async (req) => {
  if (req.method !== 'PATCH') return new Response(null, { status: 405 });

  const auth = req.headers.get('authorization') || '';
  if (auth !== `Bearer ${process.env.ADMIN_SECRET}`) return json({ error: 'Unauthorized' }, 401);

  let body;
  try { body = await req.json(); } catch { return new Response(null, { status: 400 }); }

  const { id, status } = body;
  if (!id) return json({ error: 'id required' }, 400);
  if (status !== undefined && !STATUSES.includes(status)) return json({ error: 'invalid status' }, 400);

  const has = (k) => Object.prototype.hasOwnProperty.call(body, k);
  const value = has('deal_value') ? (body.deal_value === null || body.deal_value === '' ? null : Number(body.deal_value)) : undefined;
  if (value !== undefined && value !== null && !Number.isFinite(value)) return json({ error: 'invalid deal_value' }, 400);
  const followUp = has('follow_up_at') ? (body.follow_up_at ? new Date(body.follow_up_at) : null) : undefined;
  if (followUp && Number.isNaN(followUp.getTime())) return json({ error: 'invalid follow_up_at' }, 400);

  const { sql } = getDatabase();
  const [before] = await sql`SELECT status FROM leads WHERE id = ${id}`;
  if (!before) return json({ error: 'Not found' }, 404);

  const [row] = await sql`
    UPDATE leads SET
      status = ${status ?? before.status},
      full_name = COALESCE(${has('full_name') ? text(body.full_name) || null : null}::text, full_name),
      phone = CASE WHEN ${has('phone')}::boolean THEN ${text(body.phone)}::text ELSE phone END,
      company = CASE WHEN ${has('company')}::boolean THEN ${text(body.company)}::text ELSE company END,
      deal_value = CASE WHEN ${value !== undefined}::boolean THEN ${value ?? null}::numeric ELSE deal_value END,
      follow_up_at = CASE WHEN ${followUp !== undefined}::boolean THEN ${followUp ? followUp.toISOString() : null}::timestamp ELSE follow_up_at END,
      updated_at = now()
    WHERE id = ${id} RETURNING *
  `;

  let activity = null;
  if (status && status !== before.status) {
    [activity] = await sql`
      INSERT INTO lead_activity (lead_id, kind, body)
      VALUES (${id}, 'status', ${`${before.status || 'new'} → ${status}`})
      RETURNING *
    `;
  }

  return json({ lead: row, activity });
};
