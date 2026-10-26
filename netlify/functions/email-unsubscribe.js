import { unsubscribe } from '../lib/crm-marketing.js';

// The unsubscribe link in every marketing email. GET shows a confirm button
// (so link scanners that open every URL cannot unsubscribe anyone); POST
// unsubscribes — that is also what Gmail's one-click List-Unsubscribe sends.
const page = (title, body) => new Response(`<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${title}</title></head>
<body style="margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#F6F2E8;font:16px/1.6 Helvetica,Arial,sans-serif;color:#1F2017;padding:16px;box-sizing:border-box;">
  <main style="max-width:420px;background:#fff;border:1px solid #E3DDCD;border-radius:14px;padding:32px;text-align:center;">
    <img src="/email-logo.png" alt="Loogo Labs" style="width:220px;max-width:100%;">
    <h1 style="font:400 26px/1.25 Georgia,serif;margin:20px 0 8px;">${title}</h1>${body}
  </main>
</body></html>`, { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } });

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export default async (req) => {
  const t = new URL(req.url).searchParams.get('t') || '';
  if (req.method === 'POST') {
    const row = await unsubscribe(t).catch((err) => { console.error('unsubscribe failed', err); return null; });
    if (!row) return page('Link not recognized', '<p>This unsubscribe link is not valid. Reply to any of our emails and we will take you off the list.</p>');
    return page('You are unsubscribed', `<p>${esc(row.email)} will not get any more marketing email from Loogo Labs.</p>`);
  }
  if (req.method !== 'GET') return new Response(null, { status: 405 });
  return page('Unsubscribe?', `<p>Stop getting marketing email from Loogo Labs.</p>
    <form method="post" action="?t=${encodeURIComponent(t)}"><button style="margin-top:12px;background:#2D3B1F;color:#fff;border:0;border-radius:999px;padding:13px 30px;font:600 15px Helvetica,Arial,sans-serif;cursor:pointer;">Unsubscribe</button></form>`);
};
