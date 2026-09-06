import { getDatabase } from '@netlify/database';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async (req) => {
  if (req.method !== 'POST') return new Response(null, { status: 405 });

  let body;
  try { body = await req.json(); } catch { return new Response(null, { status: 400 }); }

  const full_name = (body.full_name || '').trim();
  const email = (body.email || '').trim();
  if (!full_name || !EMAIL_RE.test(email)) {
    return new Response(JSON.stringify({ error: 'full_name and a valid email are required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  const { business_type, missed_calls, pain_point, decision_maker } = body;
  const { sql } = getDatabase();

  const [lead] = await sql`
    INSERT INTO leads (full_name, email, business_type, missed_calls, pain_point, decision_maker)
    VALUES (${full_name}, ${email}, ${business_type || null}, ${missed_calls || null}, ${pain_point || null}, ${decision_maker || null})
    RETURNING *
  `;

  return new Response(JSON.stringify(lead), { status: 201, headers: { 'Content-Type': 'application/json' } });
};
