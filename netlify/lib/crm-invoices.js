import { db } from './crm.js';
import { CrmError, addActivity, clean, createRecord, getRecord, needId, updateRecord } from './crm-records.js';
import { sendEmail, emailList } from './crm-email.js';
import { INVOICE_ITEM_FIELDS } from '../../src/crm/entities.js';
import { getTemplate, summary, templatesFor } from './invoice-templates/index.js';

// Quotes and invoices: numbering, bill-to defaults, line items, totals, and
// rendering / sending through the workspace's coded templates
// (./invoice-templates). Both are generic CRUD records in crm-records.js
// (entities "quotes" and "invoices"); this module adds what they share,
// bound per kind below, plus turning an accepted quote into an invoice.
//
//   quotes   → crm_quotes / crm_quote_items,     numbered LL-<year>-<nnn>, "Valid until" in due_date
//   invoices → crm_invoices / crm_invoice_items, numbered INV-<year>-<nnn>, "Due" in due_date

const q = (text, params = []) => db().sql.unsafe(text, params);
const round2 = (n) => Math.round((Number(n) || 0) * 100) / 100;
// Dates as the business sees them (Eastern), not the server's UTC day.
const todayYmd = () => new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' });

const KINDS = {
  invoices: { entity: 'invoices', kind: 'invoice', label: 'Invoice', table: 'crm_invoices', items: 'crm_invoice_items', parent: 'invoice_id', prefix: 'INV' },
  quotes: { entity: 'quotes', kind: 'quote', label: 'Quote', table: 'crm_quotes', items: 'crm_quote_items', parent: 'quote_id', prefix: 'LL' },
};

async function instanceRow(inst) {
  const [row] = await q('SELECT name, slug FROM crm_instances WHERE id = $1', [inst]);
  return row || { name: '', slug: '' };
}

// What a template knows about the workspace sending the document.
async function workspace(inst, me = {}) {
  const row = await instanceRow(inst);
  return { name: row.name, email: me.email || '', contact: me.name ? String(me.name).split(/\s+/)[0] : '' };
}

async function usedTemplates(inst) {
  const rows = await q(`SELECT template FROM crm_invoices WHERE instance_id = $1 AND template IS NOT NULL
    UNION SELECT template FROM crm_quotes WHERE instance_id = $1 AND template IS NOT NULL`, [inst]);
  return rows.map((r) => r.template);
}

export async function listTemplates(inst) {
  return templatesFor((await instanceRow(inst)).slug, await usedTemplates(inst)).map(summary);
}

const blankOf = (v) => (k) => v[k] === undefined || v[k] === null || v[k] === '';

// Fill bill-to details from the linked contact, then its company.
async function fillBillTo(inst, v) {
  const blank = blankOf(v);
  if (v.contact_id) {
    const [c] = await q(`SELECT c.name, c.title, c.email, c.phone, c.mobile, c.address, c.city, c.state, c.postal_code, c.company_id,
      (SELECT name FROM crm_companies WHERE id = c.company_id) AS company FROM crm_contacts c WHERE c.id = $1 AND c.instance_id = $2`, [needId(v.contact_id, 'Contact'), inst]);
    if (c) {
      if (blank('bill_to_name')) v.bill_to_name = c.name;
      if (blank('bill_to_title')) v.bill_to_title = c.title;
      if (blank('bill_to_email')) v.bill_to_email = c.email;
      if (blank('bill_to_phone')) v.bill_to_phone = c.phone || c.mobile;
      if (blank('bill_to_company')) v.bill_to_company = c.company;
      if (blank('company_id') && c.company_id) v.company_id = c.company_id;
      const addr = [c.address, [c.city, c.state, c.postal_code].filter(Boolean).join(', ')].filter(Boolean).join('\n');
      if (blank('bill_to_address') && addr) v.bill_to_address = addr;
    }
  }
  if (v.company_id && (blank('bill_to_company') || blank('bill_to_address') || blank('bill_to_phone'))) {
    const [co] = await q('SELECT name, phone, address, city, state, postal_code FROM crm_companies WHERE id = $1 AND instance_id = $2', [needId(v.company_id, 'Company'), inst]);
    if (co) {
      if (blank('bill_to_company')) v.bill_to_company = co.name;
      if (blank('bill_to_phone')) v.bill_to_phone = co.phone;
      const addr = [co.address, [co.city, co.state, co.postal_code].filter(Boolean).join(', ')].filter(Boolean).join('\n');
      if (blank('bill_to_address') && addr) v.bill_to_address = addr;
    }
  }
  return v;
}

export function totals(doc, items, kind = 'invoice') {
  const subtotal = round2(items.reduce((s, it) => s + it.amount, 0));
  const discount = round2(Math.min(Number(doc.discount) || 0, subtotal));
  const tax_rate = Number(doc.tax_rate) || 0;
  const tax = round2((subtotal - discount) * tax_rate / 100);
  const total = round2(subtotal - discount + tax);
  const closed = kind === 'quote' ? ['void', 'declined'].includes(doc.status) : ['paid', 'void'].includes(doc.status);
  const amount_due = closed ? 0 : total;
  const past = !!doc.due_date && String(doc.due_date).slice(0, 10) < todayYmd();
  const overdue = kind === 'invoice' && doc.status === 'sent' && past;
  const expired = kind === 'quote' && ['draft', 'sent'].includes(doc.status) && past;
  return { subtotal, discount, tax_rate, tax, total, amount_due, overdue, expired };
}

function bind(cfg) {
  const itemSelect = `id, ${cfg.parent}, position, description, details, quantity, unit_price, unit_label, note, created_at, updated_at`;
  const shapeItem = (r) => {
    const quantity = Number(r.quantity);
    const unit_price = Number(r.unit_price);
    return { ...r, parent_id: r[cfg.parent], quantity, unit_price, amount: round2(quantity * unit_price) };
  };
  const touch = (id) => q(`UPDATE ${cfg.table} SET updated_at = now() WHERE id = $1`, [id]);

  async function nextNumber(inst) {
    const year = Number(todayYmd().slice(0, 4));
    const rows = await q(`SELECT name FROM ${cfg.table} WHERE instance_id = $1 AND name LIKE $2`, [inst, `${cfg.prefix}-${year}-%`]);
    const max = rows.reduce((m, r) => Math.max(m, parseInt(String(r.name).split('-')[2], 10) || 0), 0);
    return `${cfg.prefix}-${year}-${String(max + 1).padStart(3, '0')}`;
  }

  async function beforeCreate(inst, input) {
    const v = { ...input };
    if (!v.name || !String(v.name).trim()) v.name = await nextNumber(inst);
    const [dupe] = await q(`SELECT 1 FROM ${cfg.table} WHERE instance_id = $1 AND name = $2`, [inst, String(v.name).trim()]);
    if (dupe) throw new CrmError(`${cfg.label} number ${v.name} is already used`);
    if (!v.issue_date) v.issue_date = todayYmd();
    if (!v.template) {
      const [first] = await listTemplates(inst);
      if (first) v.template = first.id;
    }
    await fillBillTo(inst, v);
    if (v.template && !getTemplate(v.template)) throw new CrmError(`Unknown template "${v.template}"`);
    return v;
  }

  async function beforeUpdate(inst, input) {
    if (input.template && !getTemplate(input.template)) throw new CrmError(`Unknown template "${input.template}"`);
    if (cfg.kind === 'invoice' && input.status === 'paid' && !input.paid_at) return { ...input, paid_at: todayYmd() };
    if (cfg.kind === 'quote' && input.status === 'accepted' && !input.accepted_at) return { ...input, accepted_at: todayYmd() };
    return input;
  }

  async function listItems(inst, parentId) {
    return (await q(`SELECT ${itemSelect} FROM ${cfg.items} WHERE instance_id = $1 AND ${cfg.parent} = $2 ORDER BY position, created_at`,
      [inst, needId(parentId, cfg.parent)])).map(shapeItem);
  }

  async function getItem(inst, id) {
    const [row] = await q(`SELECT ${itemSelect} FROM ${cfg.items} WHERE id = $1 AND instance_id = $2`, [needId(id), inst]);
    if (!row) throw new CrmError('Line item not found', 404);
    return shapeItem(row);
  }

  async function addItem(inst, input) {
    const parentId = input[cfg.parent] || input.parent_id;
    const doc = await getRecord(inst, cfg.entity, needId(parentId, cfg.parent), { related: false });
    const v = await clean(inst, INVOICE_ITEM_FIELDS, input, { partial: false });
    if (v.position === undefined || v.position === null) {
      const [{ n }] = await q(`SELECT COALESCE(max(position), 0)::int + 1 AS n FROM ${cfg.items} WHERE ${cfg.parent} = $1`, [doc.id]);
      v.position = n;
    }
    const cols = Object.keys(v);
    const [row] = await q(`INSERT INTO ${cfg.items} (instance_id, ${cfg.parent}, ${cols.join(', ')})
      VALUES ($1, $2, ${cols.map((_, i) => `$${i + 3}`).join(', ')}) RETURNING id`, [inst, doc.id, ...cols.map((c) => v[c])]);
    await touch(doc.id);
    return getItem(inst, row.id);
  }

  async function updateItem(inst, id, input) {
    const before = await getItem(inst, id);
    const v = await clean(inst, INVOICE_ITEM_FIELDS, input, { partial: true });
    const cols = Object.keys(v);
    if (cols.length) {
      await q(`UPDATE ${cfg.items} SET ${cols.map((c, i) => `${c} = $${i + 3}`).join(', ')}, updated_at = now() WHERE id = $1 AND instance_id = $2`,
        [id, inst, ...cols.map((c) => v[c])]);
      await touch(before.parent_id);
    }
    return getItem(inst, id);
  }

  async function deleteItem(inst, id) {
    const [row] = await q(`DELETE FROM ${cfg.items} WHERE id = $1 AND instance_id = $2 RETURNING id, ${cfg.parent} AS parent_id`, [needId(id), inst]);
    if (!row) throw new CrmError('Line item not found', 404);
    await touch(row.parent_id);
    return { id: row.id };
  }

  // Added to getRecord(entity, id).
  async function extras(inst, record) {
    const items = await listItems(inst, record.id);
    const t = getTemplate(record.template);
    return { kind: cfg.kind, items, totals: totals(record, items, cfg.kind), template_info: t ? summary(t) : null, templates: await listTemplates(inst) };
  }

  async function full(inst, id) {
    const doc = await getRecord(inst, cfg.entity, id, { related: false });
    const items = await listItems(inst, id);
    return { ...doc, kind: cfg.kind, items, totals: totals(doc, items, cfg.kind) };
  }

  function templateFor(doc) {
    const t = getTemplate(doc.template);
    if (!t) throw new CrmError(`Pick a template for this ${cfg.kind} first`);
    return t;
  }

  async function preview(inst, id, { forPrint = false } = {}, me = {}) {
    const doc = await full(inst, needId(id));
    const out = templateFor(doc).render(doc, { forPrint, workspace: await workspace(inst, me) });
    return { ...out, to: doc.bill_to_email || null };
  }

  // Emails the document, marks a draft as sent, and logs it on the record (and its contact).
  async function send(inst, id, { to, cc, save_email = true, attach_pdf = true } = {}, me = {}) {
    const doc = await full(inst, needId(id));
    if (doc.status === 'void') throw new CrmError(`This ${cfg.kind} is void`);
    if (!doc.items.length) throw new CrmError('Add at least one line item before sending');
    const recipients = emailList(to || doc.bill_to_email);
    if (!recipients.length) throw new CrmError('Add the bill-to email, or who to send it to');
    const copies = cc ? emailList(cc) : [];
    const t = templateFor(doc);
    const ws = await workspace(inst, me);
    const attachments = [];
    if (attach_pdf && t.pdf) attachments.push({ filename: t.pdfName(doc, { workspace: ws }), content: (await t.pdf(doc, { workspace: ws })).toString('base64') });
    const { subject, html, text } = t.render(doc, { workspace: ws, attached: attachments.length > 0 });
    const messageId = await sendEmail({ to: recipients, cc: copies, subject, html, text, replyTo: t.reply_to || me.email, attachments });
    const audit = { userId: me.id };
    await updateRecord(inst, cfg.entity, doc.id, doc.status === 'draft' ? { status: 'sent' } : {}, audit);
    await q(`UPDATE ${cfg.table} SET sent_at = now(), sent_to = $3 WHERE id = $1 AND instance_id = $2`, [doc.id, inst, recipients.join(', ')]);
    if (save_email && !doc.bill_to_email) {
      await q(`UPDATE ${cfg.table} SET bill_to_email = $3 WHERE id = $1 AND instance_id = $2`, [doc.id, inst, recipients[0]]);
      if (doc.contact_id) await q(`UPDATE crm_contacts SET email = $3, updated_at = now() WHERE id = $1 AND instance_id = $2 AND (email IS NULL OR email = '')`, [doc.contact_id, inst, recipients[0]]);
    }
    const note = { type: 'email', subject: `${cfg.label} ${doc.name} sent`, body: `${subject}${attachments.length ? `\nAttached: ${attachments[0].filename}` : ''}\nTo: ${recipients.join(', ')}${copies.length ? `\nCc: ${copies.join(', ')}` : ''}\nTotal: $${doc.totals.total.toFixed(2)}` };
    await addActivity(inst, { ...note, entity_type: cfg.entity, entity_id: doc.id }, audit);
    if (doc.contact_id) await addActivity(inst, { ...note, entity_type: 'contacts', entity_id: doc.contact_id }, audit).catch(() => {});
    return { sent: true, id: messageId, to: recipients, cc: copies };
  }

  // The PDF copy on its own, for the CRM's Download PDF button.
  async function pdf(inst, id, me = {}) {
    const doc = await full(inst, needId(id));
    const t = templateFor(doc);
    if (!t.pdf) throw new CrmError('This template has no PDF version yet');
    const ws = await workspace(inst, me);
    return { filename: t.pdfName(doc, { workspace: ws }), base64: (await t.pdf(doc, { workspace: ws })).toString('base64') };
  }

  return { cfg, pdf, nextNumber, beforeCreate, beforeUpdate, listItems, addItem, updateItem, deleteItem, extras, full, preview, send };
}

export const invoices = bind(KINDS.invoices);
export const quotes = bind(KINDS.quotes);
export const byEntity = { invoices, quotes };

// An accepted quote becomes an invoice: same bill-to, line items, notes and
// terms, linked both ways. The quote is marked accepted.
export async function convertQuote(inst, quoteId, me = {}) {
  const quote = await quotes.full(inst, needId(quoteId));
  if (quote.invoice_id) {
    const [still] = await q('SELECT id FROM crm_invoices WHERE id = $1 AND instance_id = $2', [quote.invoice_id, inst]);
    if (still) throw new CrmError('This quote already has an invoice');
  }
  if (['void', 'declined'].includes(quote.status)) throw new CrmError(`This quote is ${quote.status}`);
  if (!quote.items.length) throw new CrmError('This quote has no line items');
  const audit = { userId: me.id };
  const keep = ['company_id', 'contact_id', 'project_id', 'bill_to_name', 'bill_to_title', 'bill_to_company', 'bill_to_email', 'bill_to_phone',
    'bill_to_address', 'tax_rate', 'discount', 'notes', 'terms', 'template', 'owner_id'];
  const values = Object.fromEntries(keep.filter((k) => quote[k] !== null && quote[k] !== undefined && quote[k] !== '').map((k) => [k, quote[k]]));
  const invoice = await createRecord(inst, 'invoices', { ...values, status: 'draft', quote_id: quote.id }, audit);
  for (const it of quote.items) {
    await invoices.addItem(inst, { invoice_id: invoice.id, description: it.description, details: it.details, quantity: it.quantity,
      unit_price: it.unit_price, unit_label: it.unit_label, note: it.note, position: it.position });
  }
  await updateRecord(inst, 'quotes', quote.id, { status: 'accepted', invoice_id: invoice.id }, audit);
  await addActivity(inst, { type: 'note', subject: `Converted to invoice ${invoice.name}`, body: `Quote ${quote.name} accepted and invoiced as ${invoice.name}.`, entity_type: 'quotes', entity_id: quote.id }, audit);
  await addActivity(inst, { type: 'note', subject: `Created from quote ${quote.name}`, body: `Line items, bill-to, notes and terms copied from quote ${quote.name}.`, entity_type: 'invoices', entity_id: invoice.id }, audit);
  return invoice;
}
