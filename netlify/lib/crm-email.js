import { CrmError } from './crm-records.js';

// Outgoing CRM email through Resend (https://resend.com/docs/api-reference/emails/send-email).
// Needs RESEND_API_KEY and RESEND_FROM (e.g. "Loogo Labs <approvals@loogolabs.com>",
// on a domain verified in Resend) in the Netlify environment.

const SITE = 'https://www.loogolabs.com';
const LOGO = `${SITE}/email-logo.png`;
const GREEN = '#2D3B1F';
const INK = '#1F2017';
const CREAM = '#F6F2E8';
const MUTED = '#6B6A5E';
const LINE = '#E3DDCD';

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const para = (s) => esc(s).replace(/\n/g, '<br>');
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function emailList(v) {
  const list = (Array.isArray(v) ? v : String(v || '').split(/[,;\s]+/)).map((x) => String(x).trim().toLowerCase()).filter(Boolean);
  const bad = list.find((x) => !EMAIL.test(x));
  if (bad) throw new CrmError(`Not an email address: ${bad}`);
  if (list.length > 20) throw new CrmError('Up to 20 recipients');
  return [...new Set(list)];
}

const KIND_NOUN = { video: 'video cut', draft: 'draft', image: 'design', other: 'item' };
const dueText = (d) => (d ? new Date(`${d}T12:00:00`).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : null);

// Branded "please review" email. Table layout + inline styles so it renders in
// Gmail, Outlook and Apple Mail alike.
export function approvalEmail({ clientName, title, kind, version, dueDate, note, link, senderName }) {
  const noun = KIND_NOUN[kind] || 'item';
  const due = dueText(dueDate);
  const subject = `${version > 1 ? `Updated v${version}: ` : 'Ready for your review: '}${title}`;
  const preheader = `${version > 1 ? 'A new version' : `A ${noun}`} is waiting for your approval${due ? ` by ${due}` : ''}.`;
  const row = (label, value) => `
          <tr>
            <td style="padding:10px 0;border-top:1px solid ${LINE};font:500 11px/1.4 Helvetica,Arial,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:${MUTED};width:130px;">${label}</td>
            <td style="padding:10px 0;border-top:1px solid ${LINE};font:15px/1.4 Georgia,'Times New Roman',serif;color:${INK};">${value}</td>
          </tr>`;

  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>${esc(subject)}</title></head>
<body style="margin:0;padding:0;background:${CREAM};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${CREAM};">
    <tr><td align="center" style="padding:32px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#FFFFFF;border:1px solid ${LINE};border-radius:14px;overflow:hidden;">
        <tr><td style="padding:28px 36px 22px;border-bottom:4px solid ${GREEN};">
          <img src="${LOGO}" width="260" alt="Loogo Labs — AI, Marketing &amp; Automation" style="display:block;width:260px;max-width:100%;height:auto;border:0;">
        </td></tr>
        <tr><td style="padding:34px 36px 8px;">
          <div style="font:500 11px/1.4 Helvetica,Arial,sans-serif;letter-spacing:.18em;text-transform:uppercase;color:${GREEN};">Approval requested</div>
          <h1 style="margin:10px 0 0;font:400 30px/1.2 Georgia,'Times New Roman',serif;color:${INK};">${esc(title)}</h1>
          <p style="margin:18px 0 0;font:16px/1.6 Helvetica,Arial,sans-serif;color:${INK};">Hi ${esc(clientName)} team,</p>
          <p style="margin:12px 0 0;font:16px/1.6 Helvetica,Arial,sans-serif;color:${INK};">
            ${version > 1 ? `We've made your changes — version ${version} of this ${noun} is ready.` : `Your ${noun} is ready for review.`}
            Watch or read it in your portal, leave comments right where you want changes${kind === 'video' ? ' (they pin to the exact moment in the video)' : ''}, and approve when it's good to go.
          </p>
          ${note ? `<p style="margin:18px 0 0;padding:14px 18px;background:${CREAM};border-left:3px solid ${GREEN};font:italic 15px/1.6 Georgia,'Times New Roman',serif;color:${INK};">${para(note)}</p>` : ''}
        </td></tr>
        <tr><td style="padding:22px 36px 6px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${row('Item', esc(title))}
            ${row('Type', `${esc(noun.replace(/^./, (c) => c.toUpperCase()))} · v${version}`)}
            ${due ? row('Review by', esc(due)) : ''}
          </table>
        </td></tr>
        <tr><td align="left" style="padding:26px 36px 34px;">
          <table role="presentation" cellpadding="0" cellspacing="0"><tr>
            <td style="background:${GREEN};border-radius:999px;">
              <a href="${esc(link)}" style="display:inline-block;padding:15px 34px;font:600 15px/1 Helvetica,Arial,sans-serif;color:#FFFFFF;text-decoration:none;letter-spacing:.02em;">Review &amp; approve →</a>
            </td>
          </tr></table>
          <p style="margin:16px 0 0;font:13px/1.5 Helvetica,Arial,sans-serif;color:${MUTED};">No login needed. Button not working? Paste this into your browser:<br><a href="${esc(link)}" style="color:${GREEN};word-break:break-all;">${esc(link)}</a></p>
        </td></tr>
        <tr><td style="padding:20px 36px;background:${CREAM};border-top:1px solid ${LINE};">
          <p style="margin:0;font:14px/1.5 Helvetica,Arial,sans-serif;color:${INK};">Thanks,<br>${esc(senderName || 'The Loogo Labs team')}</p>
          <p style="margin:12px 0 0;font:500 10px/1.4 Helvetica,Arial,sans-serif;letter-spacing:.2em;text-transform:uppercase;color:${MUTED};">Loogo Labs · AI, Marketing &amp; Automation · <a href="${SITE}" style="color:${MUTED};">loogolabs.com</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

  const text = [
    `Approval requested: ${title}`, '',
    `Hi ${clientName} team,`, '',
    version > 1 ? `Version ${version} of this ${noun} is ready with your changes.` : `Your ${noun} is ready for review.`,
    due ? `Please review by ${due}.` : '',
    note ? `\n${note}\n` : '',
    `Review & approve: ${link}`, '',
    `Thanks,\n${senderName || 'The Loogo Labs team'}`,
  ].filter((l) => l !== '').join('\n');

  return { subject, html, text };
}

export async function sendEmail({ to, cc, subject, html, text, replyTo }) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  if (!key || !from) throw new CrmError('Email is not set up yet: add RESEND_API_KEY and RESEND_FROM in Netlify', 503);
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to, ...(cc?.length ? { cc } : {}), ...(replyTo ? { reply_to: replyTo } : {}), subject, html, text }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new CrmError(`Resend: ${body.message || `error ${res.status}`}`, 502);
  return body.id;
}
