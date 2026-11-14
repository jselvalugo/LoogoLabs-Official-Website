// Shared invoice layout. Each coded invoice template passes its brand (logo,
// colors, business details) and gets back { subject, preheader, html, text }.
// The same HTML is the email body and the CRM's print / PDF view, so it uses
// tables and inline styles (Gmail, Outlook, Apple Mail) plus a print stylesheet.
//
// Nothing a CRM user types becomes layout: only the invoice's own data
// (bill-to details, line items, dates, notes, terms) is merged in, escaped.

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const lines = (s) => String(s ?? '').split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
const usd = (n) => `$${Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const longDay = (d) => (d ? new Date(`${String(d).slice(0, 10)}T12:00:00Z`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }) : '');
const qty = (n) => (Number.isInteger(Number(n)) ? String(Number(n)) : Number(n).toLocaleString('en-US', { maximumFractionDigits: 2 }));

export function renderInvoice(brand, inv, { forPrint = false } = {}) {
  const B = brand;
  const C = B.colors;
  const items = inv.items || [];
  const t = inv.totals;
  const due = inv.due_date ? longDay(inv.due_date) : 'Due on receipt';
  const who = inv.bill_to_name || inv.bill_to_company || 'there';
  const first = String(inv.bill_to_name || '').split(/\s+/)[0] || who;
  const paid = inv.status === 'paid';
  const subject = `${paid ? 'Paid' : 'Invoice'} ${inv.name} from ${B.business.name}${paid ? '' : ` · ${usd(t.amount_due)} ${inv.due_date ? `due ${longDay(inv.due_date)}` : 'due on receipt'}`}`;
  const preheader = paid ? `Thank you. Invoice ${inv.name} is paid in full.` : `Invoice ${inv.name} for ${usd(t.total)}. ${inv.due_date ? `Due ${longDay(inv.due_date)}.` : 'Due on receipt.'}`;

  const SERIF = "Marcellus,Georgia,'Times New Roman',serif";
  const SANS = "'Work Sans','Helvetica Neue',Helvetica,Arial,sans-serif";
  const label = (x) => `<div style="font:600 10px/1.4 ${SANS};letter-spacing:.16em;text-transform:uppercase;color:${C.amber};margin:0 0 6px;">${x}</div>`;
  const kv = (k, v) => `<tr>
      <td style="padding:7px 0;border-top:1px solid ${C.line};font:600 11px/1.4 ${SANS};color:${C.ink};width:120px;vertical-align:top;">${k}</td>
      <td style="padding:7px 0;border-top:1px solid ${C.line};font:13px/1.5 ${SANS};color:${C.ink};">${v}</td></tr>`;

  const billTo = [
    `<div style="font:20px/1.3 ${SERIF};color:${C.ink};">${esc(inv.bill_to_name || inv.bill_to_company || '—')}</div>`,
    inv.bill_to_title ? `<div style="font:13px/1.5 ${SANS};color:${C.muted};">${esc(inv.bill_to_title)}</div>` : '',
    inv.bill_to_company && inv.bill_to_name ? `<div style="font:13px/1.5 ${SANS};color:${C.muted};">${esc(inv.bill_to_company)}</div>` : '',
    ...lines(inv.bill_to_address).map((l) => `<div style="font:13px/1.5 ${SANS};color:${C.muted};">${esc(l)}</div>`),
    inv.bill_to_email ? `<div style="font:13px/1.5 ${SANS};color:${C.muted};">${esc(inv.bill_to_email)}</div>` : '',
    inv.bill_to_phone ? `<div style="font:13px/1.5 ${SANS};color:${C.muted};">${esc(inv.bill_to_phone)}</div>` : '',
  ].join('');
  const from = [
    `<div style="font:20px/1.3 ${SERIF};color:${C.ink};">${esc(B.business.name)}</div>`,
    ...B.business.address.map((l) => `<div style="font:13px/1.5 ${SANS};color:${C.muted};">${esc(l)}</div>`),
    `<div style="font:13px/1.5 ${SANS};color:${C.muted};">${esc(B.business.email)}${B.business.phone ? ` · ${esc(B.business.phone)}` : ''}</div>`,
  ].join('');

  const th = (x, align = 'left') => `<th align="${align}" style="padding:10px 12px;background:${C.ink};font:500 11px/1.3 ${SANS};letter-spacing:.04em;color:${C.cream};text-align:${align};">${x}</th>`;
  const itemRows = items.map((it, i) => {
    const details = lines(it.details);
    const unit = it.unit_label ? ` / ${esc(it.unit_label)}` : '';
    return `<tr>
      <td style="padding:12px;border-bottom:1px solid ${C.line};font:13px/1.4 ${SANS};color:${C.muted};vertical-align:top;width:24px;">${i + 1}</td>
      <td style="padding:12px;border-bottom:1px solid ${C.line};vertical-align:top;">
        <div style="font:15px/1.35 ${SERIF};color:${C.ink};">${esc(it.description)}</div>
        ${details.map((d) => `<div style="font:12px/1.55 ${SANS};color:${C.muted};padding-left:12px;text-indent:-12px;">– ${esc(d)}</div>`).join('')}
      </td>
      <td align="right" style="padding:12px;border-bottom:1px solid ${C.line};font:13px/1.4 ${SANS};color:${C.ink};vertical-align:top;white-space:nowrap;">${qty(it.quantity)}</td>
      <td align="right" style="padding:12px;border-bottom:1px solid ${C.line};font:13px/1.4 ${SANS};color:${C.ink};vertical-align:top;white-space:nowrap;">${usd(it.unit_price)}${unit}</td>
      <td align="right" style="padding:12px;border-bottom:1px solid ${C.line};vertical-align:top;white-space:nowrap;">
        <div style="font:600 13px/1.4 ${SANS};color:${C.ink};">${usd(it.amount)}</div>
        ${it.note ? `<div style="font:600 10px/1.4 ${SANS};letter-spacing:.08em;text-transform:uppercase;color:${C.amber};">${esc(it.note)}</div>` : ''}
      </td></tr>`;
  }).join('');

  const sumRow = (k, v, strong) => `<tr>
      <td style="padding:${strong ? '12px' : '7px'} 12px;${strong ? `background:${C.sage};` : ''}font:${strong ? 600 : 400} 13px/1.4 ${SANS};color:${C.ink};">${k}</td>
      <td align="right" style="padding:${strong ? '12px' : '7px'} 12px;${strong ? `background:${C.sage};` : ''}font:${strong ? `20px/1.2 ${SERIF}` : `13px/1.4 ${SANS}`};color:${C.ink};white-space:nowrap;">${v}</td></tr>`;
  const totals = [
    sumRow('Subtotal', usd(t.subtotal)),
    t.discount ? sumRow('Discount', `−${usd(t.discount)}`) : '',
    t.tax ? sumRow(`Tax (${t.tax_rate}%)`, usd(t.tax)) : '',
    sumRow('Total', usd(t.total)),
    paid ? sumRow(`Paid${inv.paid_at ? ` ${longDay(inv.paid_at)}` : ''}`, `−${usd(t.total)}`) : '',
    sumRow('Amount due', usd(t.amount_due), true),
  ].join('');

  const payButton = !paid && inv.payment_link && t.amount_due > 0 ? `
        <tr><td style="padding:8px 40px 4px;">
          <table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="background:${C.ink};border-radius:999px;">
            <a href="${esc(inv.payment_link)}" style="display:inline-block;padding:14px 32px;font:600 14px/1 ${SANS};color:${C.cream};text-decoration:none;letter-spacing:.02em;">Pay ${usd(t.amount_due)} →</a>
          </td></tr></table>
        </td></tr>` : '';

  const textBlock = (title, body) => (lines(body).length ? `
        <tr><td style="padding:22px 40px 0;">
          ${label(title)}
          ${lines(body).map((l) => `<p style="margin:0 0 6px;font:13px/1.6 ${SANS};color:${C.ink};">${esc(l)}</p>`).join('')}
        </td></tr>` : '');

  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light">
<title>${esc(`Invoice ${inv.name} · ${B.business.name}`)}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Marcellus&family=Work+Sans:wght@400;500;600&display=swap');
  @media print { body, .page { background:#fff !important; } .page-pad { padding:0 !important; } .card { border:0 !important; } .no-print { display:none !important; } }
  @page { size: letter; margin: 0.5in; }
</style></head>
<body style="margin:0;padding:0;background:${C.cream};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(preheader)}</div>
  <table role="presentation" class="page" width="100%" cellpadding="0" cellspacing="0" style="background:${C.cream};">
    <tr><td align="center" class="page-pad" style="padding:32px 16px;">
      <table role="presentation" class="card" width="100%" cellpadding="0" cellspacing="0" style="max-width:680px;background:#FFFFFF;border:1px solid ${C.line};">
        <tr><td style="padding:32px 40px 0;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
            <td style="vertical-align:middle;"><img src="${B.logo}" width="220" alt="${esc(B.logoAlt)}" style="display:block;width:220px;max-width:100%;height:auto;border:0;"></td>
            <td align="right" style="vertical-align:middle;font:12px/1.4 ${SANS};"><a href="${B.business.website}" style="color:${C.ink};">${esc(B.business.website.replace(/^https?:\/\//, ''))}</a></td>
          </tr></table>
        </td></tr>
        <tr><td style="padding:22px 40px 0;">
          <div style="font:600 11px/1.4 ${SANS};letter-spacing:.18em;text-transform:uppercase;color:${C.amber};padding-bottom:8px;border-bottom:1px solid ${C.ink};">${paid ? 'Invoice · Paid' : 'Invoice'}</div>
          <div style="margin:16px 0 0;font:36px/1.15 ${SERIF};color:${C.ink};">${esc(inv.name)}</div>
          <div style="margin:6px 0 0;padding-bottom:16px;border-bottom:2px solid ${C.amber};font:16px/1.4 ${SERIF};color:${C.ink};">Prepared for ${esc(inv.bill_to_name || inv.bill_to_company || '')}</div>
        </td></tr>
        <tr><td style="padding:22px 40px 0;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
            <td width="50%" style="vertical-align:top;padding-right:12px;">${label('Bill to')}${billTo}</td>
            <td width="50%" style="vertical-align:top;padding-left:12px;">${label('From')}${from}</td>
          </tr></table>
        </td></tr>
        <tr><td style="padding:22px 40px 0;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-bottom:1px solid ${C.line};">
            ${kv('Invoice no.', esc(inv.name))}
            ${kv('Issued', esc(longDay(inv.issue_date) || longDay(new Date().toISOString())))}
            ${kv('Due', esc(due))}
            ${inv.project_id_name ? kv('Project', esc(inv.project_id_name)) : ''}
          </table>
        </td></tr>
        ${forPrint ? '' : `<tr><td style="padding:24px 40px 0;font:14px/1.6 ${SANS};color:${C.ink};">Hi ${esc(first)}, ${paid ? `thank you. This invoice is paid in full; a copy is below for your records.` : `here is your invoice from ${esc(B.business.name)}. The details are below${inv.payment_link ? ', and you can pay online with the button under the totals' : ''}.`}</td></tr>`}
        <tr><td style="padding:24px 40px 0;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
            <tr>${th('#')}${th('Item')}${th('Qty', 'right')}${th('Rate', 'right')}${th('Amount', 'right')}</tr>
            ${itemRows || `<tr><td colspan="5" style="padding:14px 12px;font:13px ${SANS};color:${C.muted};">No line items yet.</td></tr>`}
          </table>
        </td></tr>
        <tr><td style="padding:16px 40px 0;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
            <td width="45%"></td>
            <td width="55%"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">${totals}</table></td>
          </tr></table>
        </td></tr>
        ${payButton}
        ${textBlock('Notes', inv.notes)}
        ${textBlock('Terms & scope', inv.terms)}
        <tr><td style="padding:28px 40px 30px;">
          <p style="margin:0;font:13px/1.6 ${SANS};color:${C.ink};">Questions about this invoice? Reply to this email or reach ${esc(B.business.contact)} at <a href="mailto:${esc(B.business.email)}" style="color:${C.ink};">${esc(B.business.email)}</a>${B.business.phone ? ` or ${esc(B.business.phone)}` : ''}.</p>
        </td></tr>
        <tr><td style="padding:16px 40px;background:${C.cream};border-top:1px solid ${C.line};" align="center">
          <p style="margin:0;font:500 10px/1.5 ${SANS};letter-spacing:.16em;text-transform:uppercase;color:${C.muted};">${esc(B.business.name)} · ${esc(B.tagline)} · <a href="${B.business.website}" style="color:${C.muted};">${esc(B.business.website.replace(/^https?:\/\//, ''))}</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

  const text = [
    `${paid ? 'INVOICE (PAID)' : 'INVOICE'} ${inv.name}`,
    `From: ${B.business.name}, ${B.business.address.join(', ')}`,
    `Bill to: ${[inv.bill_to_name, inv.bill_to_title, inv.bill_to_company].filter(Boolean).join(', ')}`,
    `Issued: ${longDay(inv.issue_date)}   Due: ${due}`, '',
    ...items.map((it, i) => `${i + 1}. ${it.description}: ${qty(it.quantity)} × ${usd(it.unit_price)}${it.unit_label ? `/${it.unit_label}` : ''} = ${usd(it.amount)}${it.note ? ` (${it.note})` : ''}${lines(it.details).map((d) => `\n   - ${d}`).join('')}`),
    '', `Subtotal: ${usd(t.subtotal)}`,
    t.discount ? `Discount: -${usd(t.discount)}` : '',
    t.tax ? `Tax (${t.tax_rate}%): ${usd(t.tax)}` : '',
    `Total: ${usd(t.total)}`,
    `Amount due: ${usd(t.amount_due)}`,
    !paid && inv.payment_link ? `Pay online: ${inv.payment_link}` : '',
    lines(inv.notes).length ? `\nNotes:\n${lines(inv.notes).join('\n')}` : '',
    lines(inv.terms).length ? `\nTerms & scope:\n${lines(inv.terms).join('\n')}` : '',
    `\nQuestions? ${B.business.email}${B.business.phone ? ` · ${B.business.phone}` : ''}`,
    `${B.business.name} · ${B.business.website}`,
  ].filter((l) => l !== '').join('\n');

  return { subject, preheader, html, text };
}
