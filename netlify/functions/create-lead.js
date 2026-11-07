import { getDatabase } from '@netlify/database';
import { copyWebsiteLead } from '../lib/website-leads.js';
import { publicSubscribe } from '../lib/crm-marketing.js';
import { sendMetaEvent } from '../lib/meta-capi.js';

// Forms whose sign-ups also join the email marketing list, tagged with the
// source. The form itself tells people they will get the newsletter.
const NEWSLETTER_SOURCES = ['consulting'];

// Where the visitor came from (ad tags, click IDs, landing page, referrer),
// sent by the browser from src/lib/attribution.js. Saved in the lead's notes
// so it shows in the CRM. Only known keys, each value capped.
const ATTRIBUTION_KEYS = [
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
  'fbclid', 'gclid', 'gbraid', 'wbraid', 'msclkid', 'ttclid', 'li_fat_id',
  'landing_page', 'referrer',
];
function attributionNotes(a) {
  if (!a || typeof a !== 'object') return '';
  const lines = ATTRIBUTION_KEYS
    .filter((k) => typeof a[k] === 'string' && a[k].trim())
    .map((k) => `${k}: ${a[k].trim().slice(0, 300)}`);
  return lines.length ? `Attribution\n${lines.join('\n')}` : '';
}

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
  const formNotes = typeof body.notes === 'string' ? body.notes.slice(0, 8000) : '';
  const notes = [formNotes, attributionNotes(body.attribution)].filter(Boolean).join('\n\n');
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

  // Server copy of the browser's Lead pixel event. The browser only sends
  // meta_event_id when it fired Lead itself, which already means the visitor
  // accepted marketing cookies and is on the live site; same ID → one lead in Meta.
  if (typeof body.meta_event_id === 'string' && body.meta_event_id) {
    await sendMetaEvent({
      event_name: 'Lead',
      event_id: body.meta_event_id,
      event_source_url: typeof body.meta_source_url === 'string' ? body.meta_source_url : req.headers.get('referer'),
      user: { email: lead.email, phone: lead.phone, full_name: lead.full_name },
      custom_data: { content_name: lead.source },
      req,
      context,
    });
  }

  return new Response(JSON.stringify(lead), { status: 201, headers: { 'Content-Type': 'application/json' } });
};
