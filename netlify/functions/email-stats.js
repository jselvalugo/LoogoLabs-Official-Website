const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Email marketing analytics from Resend. Pages through the most recent sent
// emails (Resend's list endpoint, 100 per page, rate-limited to ~2 req/s) and
// returns them with their latest delivery event; the admin page aggregates.
export default async (req) => {
  const auth = req.headers.get('authorization') || '';
  if (auth !== `Bearer ${process.env.ADMIN_SECRET}`) return json({ error: 'Unauthorized' }, 401);

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return json({ configured: false, emails: [] });

  const emails = [];
  let after = null;
  for (let page = 0; page < 5; page++) {
    const url = new URL('https://api.resend.com/emails');
    url.searchParams.set('limit', '100');
    if (after) url.searchParams.set('after', after);
    const res = await fetch(url, { headers: { Authorization: `Bearer ${apiKey}` } });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return json({ configured: true, error: err.message || `Resend error ${res.status}`, emails }, 502);
    }
    const data = await res.json();
    for (const e of data.data || []) {
      emails.push({ id: e.id, to: e.to, subject: e.subject, created_at: e.created_at, last_event: e.last_event });
    }
    if (!data.has_more || !data.data?.length) break;
    after = data.data[data.data.length - 1].id;
    await sleep(550);
  }

  return json({ configured: true, emails });
};
