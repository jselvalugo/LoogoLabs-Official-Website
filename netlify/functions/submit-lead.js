import { getDatabase } from '@netlify/database';

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response(null, { status: 405 });
  }

  let body;
  try { body = await req.json(); } catch { return new Response(null, { status: 400 }); }

  const { full_name, company, email, industry, data_problem, decision_it_feeds, referral } = body;
  if (!full_name || !company || !email || !data_problem) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  const { sql } = getDatabase();
  await sql`
    INSERT INTO leads (full_name, company, email, industry, data_problem, decision_it_feeds, referral)
    VALUES (${full_name}, ${company}, ${email}, ${industry ?? null}, ${data_problem}, ${decision_it_feeds ?? null}, ${referral ?? null})
  `;

  return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
};
