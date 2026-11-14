// Shared invoice layout. Each coded invoice template passes its brand (logo,
// colors, business details) and gets back { subject, preheader, html, text }.
// The same HTML is the email body and the CRM's print / PDF view, so it uses
// tables and inline styles (Gmail, Outlook, Apple Mail), a small-screen
// stylesheet, and a print stylesheet that fits a letter page.
//
// Nothing a CRM user types becomes layout: only the invoice's own data
// (bill-to details, line items, dates, notes, terms) is merged in, escaped.

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const lines = (s) => String(s ?? '').split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
const usd = (n) => `$${Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const longDay = (d) => (d ? new Date(`${String(d).slice(0, 10)}T12:00:00Z`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }) : '');
const qty = (n) => (Number.isInteger(Number(n)) ? String(Number(n)) : Number(n).toLocaleString('en-US', { maximumFractionDigits: 2 }));
const host = (url) => String(url).replace(/^https?:\/\//, '').replace(/\/$/, '');

export function renderInvoice(brand, inv, { forPrint = false } = {}) {
  const B = brand;
  const C = B.colors;
  const items = inv.items || [];
  const t = inv.totals;
  const paid = inv.status === 'paid';
  const voided = inv.status === 'void';
  const dueText = inv.due_date ? longDay(inv.due_date) : 'Due on receipt';
  const issued = longDay(inv.issue_date) || longDay(new Date().toISOString());
  const first = String(inv.bill_to_name || '').split(/\s+/)[0] || 'there';
  const subject = paid
    ? `Paid: invoice ${inv.name} from ${B.business.name}`
    : `Invoice ${inv.name} from ${B.business.name} · ${usd(t.amount_due)} ${inv.due_date ? `due ${longDay(inv.due_date)}` : 'due on receipt'}`;
  const preheader = paid ? `Thank you. Invoice ${inv.name} is paid in full.` : `Invoice ${inv.name} for ${usd(t.total)}. ${inv.due_date ? `Due ${longDay(inv.due_date)}.` : 'Due on receipt.'}`;

  const SERIF = "Marcellus,Georgia,'Times New Roman',serif";
  const SANS = "'Work Sans','Helvetica Neue',Helvetica,Arial,sans-serif";
  const label = (x, color = C.amber) => `<div style="font:600 10px/1.4 ${SANS};letter-spacing:.16em;text-transform:uppercase;color:${color};margin:0 0 8px;">${x}</div>`;
  const small = (x) => `<div style="font:13px/1.55 ${SANS};color:${C.muted};">${x}</div>`;

  // ── Parties and invoice facts ──
  const billTo = [
    `<div style="font:18px/1.3 ${SERIF};color:${C.ink};margin-bottom:2px;">${esc(inv.bill_to_name || inv.bill_to_company || '—')}</div>`,
    inv.bill_to_title ? small(esc(inv.bill_to_title)) : '',
    inv.bill_to_company && inv.bill_to_name ? small(esc(inv.bill_to_company)) : '',
    ...lines(inv.bill_to_address).map((l) => small(esc(l))),
    inv.bill_to_email ? small(esc(inv.bill_to_email)) : '',
    inv.bill_to_phone ? small(esc(inv.bill_to_phone)) : '',
  ].join('');
  const from = [
    `<div style="font:18px/1.3 ${SERIF};color:${C.ink};margin-bottom:2px;">${esc(B.business.name)}</div>`,
    ...(B.business.address || []).map((l) => small(esc(l))),
    B.business.email ? small(esc(B.business.email)) : '',
    B.business.phone ? small(esc(B.business.phone)) : '',
  ].join('');
  const fact = (k, v) => `<tr>
      <td style="padding:0 0 6px;font:13px/1.5 ${SANS};color:${C.muted};white-space:nowrap;">${k}</td>
      <td align="right" style="padding:0 0 6px 12px;font:600 13px/1.5 ${SANS};color:${C.ink};white-space:nowrap;">${v}</td></tr>`;
  const facts = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      ${fact('Invoice no.', esc(inv.name))}
      ${fact('Issued', esc(issued))}
      ${fact('Due', esc(dueText))}
      ${inv.project_id_name ? fact('Project', esc(inv.project_id_name)) : ''}
    </table>`;

  // ── Line items ──
  const th = (x, align = 'left', w = '', cls = '') => `<th ${cls ? `class="${cls}"` : ''} align="${align}" ${w ? `width="${w}"` : ''} style="padding:10px 0;${align === 'right' ? 'padding-left:12px;' : ''}border-bottom:1px solid ${C.ink};font:600 10px/1.3 ${SANS};letter-spacing:.14em;text-transform:uppercase;color:${C.ink};text-align:${align};">${x}</th>`;
  const itemRows = items.map((it) => {
    const details = lines(it.details);
    const unit = it.unit_label ? `<span style="color:${C.muted};"> / ${esc(it.unit_label)}</span>` : '';
    const cell = `padding:16px 0;border-bottom:1px solid ${C.line};vertical-align:top;`;
    return `<tr>
      <td style="${cell}">
        <div style="font:16px/1.35 ${SERIF};color:${C.ink};">${esc(it.description)}</div>
        ${details.length ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:6px;">${details.map((d) => `<tr>
          <td style="padding:1px 8px 1px 0;vertical-align:top;font:12px/1.55 ${SANS};color:${C.amber};">&#8226;</td>
          <td style="padding:1px 0;font:12px/1.55 ${SANS};color:${C.muted};">${esc(d)}</td></tr>`).join('')}</table>` : ''}
      </td>
      <td align="right" class="hide-sm" style="${cell}padding-left:12px;font:13px/1.4 ${SANS};color:${C.ink};white-space:nowrap;">${qty(it.quantity)}</td>
      <td align="right" class="hide-sm" style="${cell}padding-left:12px;font:13px/1.4 ${SANS};color:${C.ink};white-space:nowrap;">${usd(it.unit_price)}${unit}</td>
      <td align="right" style="${cell}padding-left:12px;white-space:nowrap;">
        <div style="font:600 14px/1.4 ${SANS};color:${C.ink};">${usd(it.amount)}</div>
        ${it.note ? `<div style="display:inline-block;margin-top:6px;padding:3px 8px;background:${C.cream};border:1px solid ${C.line};border-radius:999px;font:600 9px/1.3 ${SANS};letter-spacing:.12em;text-transform:uppercase;color:${C.amber};">${esc(it.note)}</div>` : ''}
      </td></tr>`;
  }).join('');

  // ── Totals ──
  const sumRow = (k, v) => `<tr>
      <td style="padding:6px 0;font:13px/1.4 ${SANS};color:${C.muted};">${k}</td>
      <td align="right" style="padding:6px 0;font:13px/1.4 ${SANS};color:${C.ink};white-space:nowrap;">${v}</td></tr>`;
  const totals = `
      ${sumRow('Subtotal', usd(t.subtotal))}
      ${t.discount ? sumRow('Discount', `&minus;${usd(t.discount)}`) : ''}
      ${t.tax ? sumRow(`Tax (${t.tax_rate}%)`, usd(t.tax)) : ''}
      ${sumRow('Total', usd(t.total))}
      ${paid ? sumRow(`Paid${inv.paid_at ? ` ${esc(longDay(inv.paid_at))}` : ''}`, `&minus;${usd(t.total)}`) : ''}
      <tr>
        <td style="padding:12px 0 0;border-top:1px solid ${C.ink};font:600 13px/1.4 ${SANS};color:${C.ink};">Amount due</td>
        <td align="right" style="padding:12px 0 0;border-top:1px solid ${C.ink};font:24px/1.1 ${SERIF};color:${C.ink};white-space:nowrap;">${usd(t.amount_due)}</td>
      </tr>`;

  const payButton = !paid && !voided && inv.payment_link && t.amount_due > 0 ? `
        <tr><td class="px" style="padding:24px 48px 0;" align="right">
          <table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="background:${C.ink};border-radius:999px;">
            <a href="${esc(inv.payment_link)}" style="display:inline-block;padding:14px 30px;font:600 14px/1 ${SANS};color:${C.cream};text-decoration:none;letter-spacing:.02em;">Pay ${usd(t.amount_due)} &rarr;</a>
          </td></tr></table>
        </td></tr>` : '';

  const notes = lines(inv.notes);
  const terms = lines(inv.terms);
  const textCol = (title, ls) => `${label(title)}${ls.map((l) => `<p style="margin:0 0 6px;font:12px/1.6 ${SANS};color:${C.ink};">${esc(l)}</p>`).join('')}`;
  const notesBlock = notes.length || terms.length ? `
        <tr><td class="px" style="padding:28px 48px 0;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.cream};border-radius:6px;"><tr>
            ${notes.length ? `<td class="ncol" valign="top" width="${terms.length ? '40%' : '100%'}" style="padding:20px 22px;">${textCol('Notes', notes)}</td>` : ''}
            ${terms.length ? `<td class="ncol" valign="top" style="padding:20px 22px;${notes.length ? `border-left:1px solid ${C.line};` : ''}">${textCol('Terms &amp; scope', terms)}</td>` : ''}
          </tr></table>
        </td></tr>` : '';

  const status = paid ? 'Paid' : voided ? 'Void' : '';
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light">
<title>${esc(`Invoice ${inv.name} · ${B.business.name}`)}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Marcellus&family=Work+Sans:wght@400;500;600&display=swap');
  @media only screen and (max-width: 620px) {
    .px { padding-left: 22px !important; padding-right: 22px !important; }
    .col { display: block !important; width: 100% !important; border-left: 0 !important; padding-left: 0 !important; padding-right: 0 !important; }
    .col + .col { padding-top: 18px !important; }
    .logo { width: 260px !important; }
    .hide-sm { display: none !important; }
    .title { font-size: 26px !important; }
    .title-cell { text-align: left !important; padding-top: 18px !important; }
    .ncol { display: block !important; width: auto !important; border-left: 0 !important; }
    .ncol + .ncol { border-top: 1px solid ${C.line} !important; }
  }
  @media print {
    body, .page { background: #fff !important; }
    .page-pad { padding: 0 !important; }
    .card { border: 0 !important; max-width: none !important; }
    .no-print { display: none !important; }
    .px { padding-left: 0 !important; padding-right: 0 !important; }
    .card { zoom: .78; }
  }
  @page { size: letter; margin: 0.55in; }
</style></head>
<body style="margin:0;padding:0;background:${C.cream};-webkit-text-size-adjust:100%;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(preheader)}</div>
  <table role="presentation" class="page" width="100%" cellpadding="0" cellspacing="0" style="background:${C.cream};">
    <tr><td align="center" class="page-pad" style="padding:32px 12px;">
      <table role="presentation" class="card" width="100%" cellpadding="0" cellspacing="0" style="max-width:700px;background:#FFFFFF;border:1px solid ${C.line};border-top:4px solid ${C.ink};">

        <!-- Logo and title -->
        <tr><td class="px" style="padding:36px 48px 0;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
            <td class="col" valign="middle">${B.logo
              ? `<img class="logo" src="${B.logo}" width="340" alt="${esc(B.logoAlt || B.business.name)}" style="display:block;width:340px;max-width:100%;height:auto;border:0;">`
              : `<div style="font:28px/1.15 ${SERIF};color:${C.ink};">${esc(B.business.name)}</div>`}</td>
            <td class="col title-cell" valign="middle" align="right" style="padding-left:20px;">
              <div class="title" style="font:34px/1 ${SERIF};color:${C.ink};letter-spacing:.02em;">Invoice</div>
              <div style="margin-top:8px;font:600 11px/1.4 ${SANS};letter-spacing:.14em;color:${C.amber};text-transform:uppercase;">${esc(inv.name)}${status ? ` &middot; ${status}` : ''}</div>
            </td>
          </tr></table>
        </td></tr>
        <tr><td class="px" style="padding:28px 48px 0;"><div style="height:2px;background:${C.amber};line-height:2px;font-size:0;">&nbsp;</div></td></tr>

        <!-- Parties and facts -->
        <tr><td class="px" style="padding:26px 48px 0;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
            <td class="col" valign="top" width="34%" style="padding-right:16px;">${label('Bill to')}${billTo}</td>
            <td class="col" valign="top" width="33%" style="padding-right:16px;">${label('From')}${from}</td>
            <td class="col" valign="top" width="33%">${label('Details')}${facts}</td>
          </tr></table>
        </td></tr>

        <!-- Amount due banner -->
        <tr><td class="px" style="padding:28px 48px 0;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.ink};border-radius:6px;"><tr>
            <td style="padding:18px 22px;">
              <div style="font:600 10px/1.4 ${SANS};letter-spacing:.16em;text-transform:uppercase;color:${C.sage};">${paid ? 'Paid in full' : voided ? 'Void' : 'Amount due'}</div>
              <div style="margin-top:4px;font:13px/1.4 ${SANS};color:${C.cream};">${paid ? `Thank you${inv.paid_at ? ` · ${esc(longDay(inv.paid_at))}` : ''}` : voided ? 'Nothing is due on this invoice' : esc(dueText === 'Due on receipt' ? dueText : `Due ${dueText}`)}</div>
            </td>
            <td align="right" style="padding:18px 22px;font:30px/1 ${SERIF};color:${C.cream};white-space:nowrap;">${usd(paid ? t.total : t.amount_due)}</td>
          </tr></table>
        </td></tr>

        ${forPrint ? '' : `<tr><td class="px no-print" style="padding:26px 48px 0;font:14px/1.65 ${SANS};color:${C.ink};">Hi ${esc(first)},<br>${paid ? 'thank you. This invoice is paid in full; a copy is below for your records.' : `here is your invoice from ${esc(B.business.name)}. Everything we&rsquo;re billing for is listed below${inv.payment_link ? ', and you can pay online with the button under the totals' : ''}.`}</td></tr>`}

        <!-- Line items -->
        <tr><td class="px" style="padding:26px 48px 0;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
            <tr>${th('Description')}${th('Qty', 'right', '50', 'hide-sm')}${th('Rate', 'right', '100', 'hide-sm')}${th('Amount', 'right', '120')}</tr>
            ${itemRows || `<tr><td colspan="4" style="padding:16px 0;font:13px ${SANS};color:${C.muted};">No line items yet.</td></tr>`}
          </table>
        </td></tr>

        <!-- Totals -->
        <tr><td class="px" style="padding:18px 48px 0;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
            <td class="hide-sm" width="50%"></td>
            <td><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${totals}</table></td>
          </tr></table>
        </td></tr>
        ${payButton}
        ${notesBlock}

        <!-- Contact -->
        <tr><td class="px" style="padding:28px 48px 36px;">
          <p style="margin:0;font:13px/1.65 ${SANS};color:${C.ink};">Questions about this invoice? ${B.business.email
            ? `${forPrint ? 'Reach' : 'Reply to this email or reach'} ${esc(B.business.contact || 'us')} at <a href="mailto:${esc(B.business.email)}" style="color:${C.ink};">${esc(B.business.email)}</a>${B.business.phone ? ` or ${esc(B.business.phone)}` : ''}.`
            : (forPrint ? 'Please get in touch with us.' : 'Just reply to this email.')} Thank you for your business.</p>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:18px 48px;background:${C.cream};border-top:1px solid ${C.line};" align="center">
          <p style="margin:0;font:500 10px/1.6 ${SANS};letter-spacing:.14em;text-transform:uppercase;color:${C.muted};">${esc(B.business.name)}${B.business.website ? ` &middot; <a href="${B.business.website}" style="color:${C.muted};">${esc(host(B.business.website))}</a>` : ''}</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

  const text = [
    `${B.business.name}`,
    `${paid ? 'INVOICE (PAID)' : 'INVOICE'} ${inv.name}`, '',
    `Bill to: ${[inv.bill_to_name, inv.bill_to_title, inv.bill_to_company].filter(Boolean).join(', ')}`,
    `From: ${[B.business.name, ...(B.business.address || [])].join(', ')}`,
    `Issued: ${issued}   Due: ${dueText}`, '',
    ...items.map((it, i) => `${i + 1}. ${it.description}: ${qty(it.quantity)} x ${usd(it.unit_price)}${it.unit_label ? `/${it.unit_label}` : ''} = ${usd(it.amount)}${it.note ? ` (${it.note})` : ''}${lines(it.details).map((d) => `\n   - ${d}`).join('')}`),
    '', `Subtotal: ${usd(t.subtotal)}`,
    t.discount ? `Discount: -${usd(t.discount)}` : '',
    t.tax ? `Tax (${t.tax_rate}%): ${usd(t.tax)}` : '',
    `Total: ${usd(t.total)}`,
    `Amount due: ${usd(t.amount_due)}`,
    !paid && inv.payment_link ? `Pay online: ${inv.payment_link}` : '',
    notes.length ? `\nNotes:\n${notes.join('\n')}` : '',
    terms.length ? `\nTerms & scope:\n${terms.join('\n')}` : '',
    B.business.email ? `\nQuestions? ${B.business.email}${B.business.phone ? ` · ${B.business.phone}` : ''}` : '',
    [B.business.name, B.business.website].filter(Boolean).join(' · '),
  ].filter((l) => l !== '').join('\n');

  return { subject, preheader, html, text };
}
