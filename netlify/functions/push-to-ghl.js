import { getDatabase } from '@netlify/database';

const GHL_API = 'https://services.leadconnectorhq.com';

export default async (req) => {
  if (req.method !== 'POST') return new Response(null, { status: 405 });

  const auth = req.headers.get('authorization') || '';
  if (auth !== `Bearer ${process.env.ADMIN_SECRET}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  const apiKey = process.env.GHL_API_KEY;
  const locationId = process.env.GHL_LOCATION_ID;
  if (!apiKey || !locationId) {
    return new Response(JSON.stringify({ error: 'GHL credentials not configured' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }

  const { sql } = getDatabase();
  const leads = await sql`SELECT * FROM leads ORDER BY created_at DESC`;

  const results = { pushed: 0, skipped: 0, errors: [] };

  for (const lead of leads) {
    const nameParts = (lead.full_name || '').trim().split(/\s+/);
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    const tags = ['website-lead'];
    if (lead.industry) tags.push(lead.industry.toLowerCase().replace(/\s+/g, '-'));
    if (lead.referral) tags.push(`ref-${lead.referral}`);

    const payload = {
      locationId,
      firstName,
      lastName,
      email: lead.email,
      companyName: lead.company || '',
      source: 'Website Form',
      tags,
      customFields: [
        ...(lead.data_problem ? [{ key: 'current_tools', field_value: lead.data_problem }] : []),
        ...(lead.decision_it_feeds ? [{ key: 'biggest_challenge', field_value: lead.decision_it_feeds }] : []),
      ],
    };

    try {
      const res = await fetch(`${GHL_API}/contacts/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Version': '2021-07-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        results.pushed++;
      } else {
        const err = await res.text();
        results.errors.push({ email: lead.email, status: res.status, detail: err });
        results.skipped++;
      }
    } catch (err) {
      results.errors.push({ email: lead.email, detail: err.message });
      results.skipped++;
    }
  }

  return new Response(JSON.stringify(results), { status: 200, headers: { 'Content-Type': 'application/json' } });
};
