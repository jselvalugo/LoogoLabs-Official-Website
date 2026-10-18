import { getDatabase } from '@netlify/database';

const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const firstName = (name) => (name || '').trim().split(/\s+/)[0] || 'there';

// Email marketing via Resend. GET reports whether Resend is configured; POST
// sends one email per recipient (so nobody sees the others) through Resend's
// batch endpoint, 100 at a time. {{first_name}} / {{name}} are personalised,
// and each send to a known lead is logged on its CRM timeline.
export default async (req) => {
  const auth = req.headers.get('authorization') || '';
  if (auth !== `Bearer ${process.env.ADMIN_SECRET}`) return json({ error: 'Unauthorized' }, 401);

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM || 'David at Loogo Labs <david@loogolabs.com>';

  if (req.method === 'GET') return json({ configured: !!(apiKey && from), from: from || null });
  if (req.method !== 'POST') return new Response(null, { status: 405 });
  if (!apiKey || !from) return json({ error: 'Set RESEND_API_KEY in Netlify environment variables.' }, 500);

  let body;
  try { body = await req.json(); } catch { return json({ error: 'Invalid JSON' }, 400); }

  const subject = typeof body.subject === 'string' ? body.subject.trim().slice(0, 300) : '';
  const text = typeof body.body === 'string' ? body.body.trim().slice(0, 50000) : '';
  const recipients = (Array.isArray(body.recipients) ? body.recipients : [])
    .map((r) => ({ email: String(r?.email || '').trim().toLowerCase(), name: r?.name || '', lead_id: r?.lead_id || null }))
    .filter((r) => EMAIL_RE.test(r.email))
    .filter((r, i, all) => all.findIndex((o) => o.email === r.email) === i);

  if (!subject || !text) return json({ error: 'Subject and body are required' }, 400);
  if (!recipients.length) return json({ error: 'No valid recipients' }, 400);
  if (recipients.length > 1000) return json({ error: 'Max 1000 recipients per send' }, 400);

  const fill = (tpl, r) => tpl.replace(/\{\{\s*first_name\s*\}\}/g, firstName(r.name)).replace(/\{\{\s*name\s*\}\}/g, r.name || 'there');
  const toHtml = (s) => `<div style="font-family:Georgia,serif;font-size:16px;line-height:1.6;color:#1a1a1a">${s.split(/\n{2,}/).map((p) => `<p>${escapeHtml(p).replace(/\n/g, '<br>')}</p>`).join('')}</div>`;

  const sent = [];
  const failed = [];
  for (let i = 0; i < recipients.length; i += 100) {
    const chunk = recipients.slice(i, i + 100);
    const payload = chunk.map((r) => {
      const msg = fill(text, r);
      return { from, to: [r.email], subject: fill(subject, r), text: msg, html: toHtml(msg), ...(body.reply_to ? { reply_to: body.reply_to } : {}) };
    });
    const res = await fetch('https://api.resend.com/emails/batch', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) sent.push(...chunk);
    else {
      const err = await res.json().catch(() => ({}));
      failed.push(...chunk.map((r) => ({ email: r.email, error: err.message || `Resend error ${res.status}` })));
    }
  }

  const leadIds = sent.map((r) => r.lead_id).filter(Boolean);
  if (leadIds.length) {
    const { sql } = getDatabase();
    const note = `Marketing email sent: "${subject}"`;
    for (const id of leadIds) {
      await sql`INSERT INTO lead_activity (lead_id, kind, body) VALUES (${id}, 'email', ${note})`.catch(() => {});
    }
  }

  return json({ sent: sent.length, failed }, failed.length && !sent.length ? 502 : 200);
};
