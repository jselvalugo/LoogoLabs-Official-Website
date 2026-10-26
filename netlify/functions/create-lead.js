import { getDatabase } from '@netlify/database';
import { copyWebsiteLead } from '../lib/website-leads.js';
import { publicSubscribe } from '../lib/crm-marketing.js';

// Forms whose sign-ups also join the email marketing list, tagged with the
// source. The form itself tells people they will get the newsletter.
const NEWSLETTER_SOURCES = ['consulting'];

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
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
  const company = typeof body.company === 'string' ? body.company.trim().slice(0, 200) || null : null;
  const phone = typeof body.phone === 'string' ? body.phone.trim().slice(0, 50) || null : null;
  const session_id = UUID_RE.test(body.session_id || '') ? body.session_id : null;
  const geo = context?.geo || {};
  const city = geo.city || null;
  const region = geo.subdivision?.name || null;
  const country = geo.country?.name || null;
  const { sql } = getDatabase();

  const [lead] = await sql`
    INSERT INTO leads (full_name, email, source, business_type, missed_calls, pain_point, decision_maker, job_volume, review_pain_point, city, region, country, notes, session_id, company, phone)
    VALUES (${full_name}, ${email}, ${source || 'ai_receptionist'}, ${business_type || null}, ${missed_calls || null}, ${pain_point || null}, ${decision_maker || null}, ${job_volume || null}, ${review_pain_point || null}, ${city}, ${region}, ${country}, ${notes}, ${session_id}, ${company}, ${phone})
    RETURNING *
  `;
  await copyWebsiteLead(lead);
  if (NEWSLETTER_SOURCES.includes(lead.source)) {
    // Like the CRM copy, this must never fail the form.
    await publicSubscribe({ email: lead.email, name: lead.full_name, tag: lead.source, source: lead.source })
      .catch((err) => console.error('Could not add the lead to the newsletter', err));
  }

  return new Response(JSON.stringify(lead), { status: 201, headers: { 'Content-Type': 'application/json' } });
};
