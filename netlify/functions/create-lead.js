import { getDatabase } from '@netlify/database';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async (req, context) => {
  if (req.method !== 'POST') return new Response(null, { status: 405 });

  let body;
  try { body = await req.json(); } catch { return new Response(null, { status: 400 }); }

  const full_name = (body.full_name || '').trim();
  const email = (body.email || '').trim();
  if (!full_name || !EMAIL_RE.test(email)) {
    return new Response(JSON.stringify({ error: 'full_name and a valid email are required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  const { source, business_type, missed_calls, pain_point, decision_maker, job_volume, review_pain_point } = body;
  // Park Supply quote requests carry their line items here; cap it so the
  // public endpoint cannot be used to stuff arbitrarily large rows.
  const notes = typeof body.notes === 'string' ? body.notes.slice(0, 8000) : '';
  const geo = context?.geo || {};
  const city = geo.city || null;
  const region = geo.subdivision?.name || null;
  const country = geo.country?.name || null;
  const { sql } = getDatabase();

  const [lead] = await sql`
    INSERT INTO leads (full_name, email, source, business_type, missed_calls, pain_point, decision_maker, job_volume, review_pain_point, city, region, country, notes)
    VALUES (${full_name}, ${email}, ${source || 'ai_receptionist'}, ${business_type || null}, ${missed_calls || null}, ${pain_point || null}, ${decision_maker || null}, ${job_volume || null}, ${review_pain_point || null}, ${city}, ${region}, ${country}, ${notes})
    RETURNING *
  `;

  return new Response(JSON.stringify(lead), { status: 201, headers: { 'Content-Type': 'application/json' } });
};
