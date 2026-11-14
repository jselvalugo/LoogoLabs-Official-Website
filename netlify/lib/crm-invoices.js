import { db } from './crm.js';
import { CrmError, addActivity, clean, getRecord, needId, updateRecord } from './crm-records.js';
import { sendEmail, emailList } from './crm-email.js';
import { INVOICE_ITEM_FIELDS } from '../../src/crm/entities.js';
import { getTemplate, summary, templatesFor } from './invoice-templates/index.js';

// Invoices: numbering, bill-to defaults, line items, totals, and rendering /
// sending through the instance's coded invoice template (./invoice-templates).
// The invoice record itself is generic CRUD in crm-records.js (entity "invoices").

const q = (text, params = []) => db().sql.unsafe(text, params);
const round2 = (n) => Math.round((Number(n) || 0) * 100) / 100;
const todayYmd = () => new Date().toISOString().slice(0, 10);

async function instanceRow(inst) {
  const [row] = await q('SELECT name, slug FROM crm_instances WHERE id = $1', [inst]);
  return row || { name: '', slug: '' };
}
const instanceSlug = async (inst) => (await instanceRow(inst)).slug;

// What a template knows about the workspace sending the invoice.
async function workspace(inst, me = {}) {
  const row = await instanceRow(inst);
  return { name: row.name, email: me.email || '', contact: me.name ? String(me.name).split(/\s+/)[0] : '' };
}

async function usedTemplates(inst) {
  return (await q('SELECT DISTINCT template FROM crm_invoices WHERE instance_id = $1 AND template IS NOT NULL', [inst])).map((r) => r.template);
}

export async function listTemplates(inst) {
  return templatesFor(await instanceSlug(inst), await usedTemplates(inst)).map(summary);
}

// INV-<year>-<nnn>, one higher than this instance's highest number this year.
export async function nextNumber(inst) {
  const year = new Date().getFullYear();
  const rows = await q(`SELECT name FROM crm_invoices WHERE instance_id = $1 AND name LIKE $2`, [inst, `INV-${year}-%`]);
  const max = rows.reduce((m, r) => Math.max(m, parseInt(String(r.name).split('-')[2], 10) || 0), 0);
  return `INV-${year}-${String(max + 1).padStart(3, '0')}`;
}

// Called by createRecord for invoices, before and after the generic field check.
export async function beforeCreate(inst, input) {
  const v = { ...input };
  if (!v.name || !String(v.name).trim()) v.name = await nextNumber(inst);
  const [dupe] = await q('SELECT 1 FROM crm_invoices WHERE instance_id = $1 AND name = $2', [inst, String(v.name).trim()]);
  if (dupe) throw new CrmError(`Invoice number ${v.name} is already used`);
  if (!v.issue_date) v.issue_date = todayYmd();
  if (!v.template) {
    const [first] = await listTemplates(inst);
    if (first) v.template = first.id;
  }
  // Bill-to details default to the linked contact, then its company.
  const blank = (k) => v[k] === undefined || v[k] === null || v[k] === '';
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
  if (v.template && !getTemplate(v.template)) throw new CrmError(`Unknown invoice template "${v.template}"`);
  return v;
}

export async function beforeUpdate(inst, input) {
  if (input.template && !getTemplate(input.template)) throw new CrmError(`Unknown invoice template "${input.template}"`);
  if (input.status === 'paid' && !input.paid_at) return { ...input, paid_at: todayYmd() };
  return input;
}

// ── Line items ──────────────────────────────────────────────────────────────

const ITEM_SELECT = 'id, invoice_id, position, description, details, quantity, unit_price, unit_label, note, created_at, updated_at';
const shapeItem = (r) => {
  const quantity = Number(r.quantity);
  const unit_price = Number(r.unit_price);
  return { ...r, quantity, unit_price, amount: round2(quantity * unit_price) };
};

export async function listItems(inst, invoiceId) {
  return (await q(`SELECT ${ITEM_SELECT} FROM crm_invoice_items WHERE instance_id = $1 AND invoice_id = $2 ORDER BY position, created_at`,
    [inst, needId(invoiceId, 'invoice_id')])).map(shapeItem);
}

async function getItem(inst, id) {
  const [row] = await q(`SELECT ${ITEM_SELECT} FROM crm_invoice_items WHERE id = $1 AND instance_id = $2`, [needId(id), inst]);
  if (!row) throw new CrmError('Line item not found', 404);
  return shapeItem(row);
}

const touch = (id) => q('UPDATE crm_invoices SET updated_at = now() WHERE id = $1', [id]);

export async function addItem(inst, input) {
  const inv = await getRecord(inst, 'invoices', needId(input.invoice_id, 'invoice_id'), { related: false });
  const v = await clean(inst, INVOICE_ITEM_FIELDS, input, { partial: false });
  if (v.position === undefined || v.position === null) {
    const [{ n }] = await q('SELECT COALESCE(max(position), 0)::int + 1 AS n FROM crm_invoice_items WHERE invoice_id = $1', [inv.id]);
    v.position = n;
  }
  const cols = Object.keys(v);
  const [row] = await q(`INSERT INTO crm_invoice_items (instance_id, invoice_id, ${cols.join(', ')})
    VALUES ($1, $2, ${cols.map((_, i) => `$${i + 3}`).join(', ')}) RETURNING id`, [inst, inv.id, ...cols.map((c) => v[c])]);
  await touch(inv.id);
  return getItem(inst, row.id);
}

export async function updateItem(inst, id, input) {
  const before = await getItem(inst, id);
  const v = await clean(inst, INVOICE_ITEM_FIELDS, input, { partial: true });
  const cols = Object.keys(v);
  if (cols.length) {
    await q(`UPDATE crm_invoice_items SET ${cols.map((c, i) => `${c} = $${i + 3}`).join(', ')}, updated_at = now() WHERE id = $1 AND instance_id = $2`,
      [id, inst, ...cols.map((c) => v[c])]);
    await touch(before.invoice_id);
  }
  return getItem(inst, id);
}

export async function deleteItem(inst, id) {
  const [row] = await q('DELETE FROM crm_invoice_items WHERE id = $1 AND instance_id = $2 RETURNING id, invoice_id', [needId(id), inst]);
  if (!row) throw new CrmError('Line item not found', 404);
  await touch(row.invoice_id);
  return { id: row.id };
}

// ── Totals and the full invoice ────────────────────────────────────────────

export function totals(inv, items) {
  const subtotal = round2(items.reduce((s, it) => s + it.amount, 0));
  const discount = round2(Math.min(Number(inv.discount) || 0, subtotal));
  const tax_rate = Number(inv.tax_rate) || 0;
  const tax = round2((subtotal - discount) * tax_rate / 100);
  const total = round2(subtotal - discount + tax);
  const amount_due = inv.status === 'paid' || inv.status === 'void' ? 0 : total;
  const overdue = inv.status === 'sent' && !!inv.due_date && inv.due_date < todayYmd();
  return { subtotal, discount, tax_rate, tax, total, amount_due, overdue };
}

// Added to getRecord('invoices', id).
export async function extras(inst, record) {
  const items = await listItems(inst, record.id);
  const t = getTemplate(record.template);
  return { items, totals: totals(record, items), template_info: t ? summary(t) : null, templates: await listTemplates(inst) };
}

async function fullInvoice(inst, id) {
  const inv = await getRecord(inst, 'invoices', id, { related: false });
  const items = await listItems(inst, id);
  return { ...inv, items, totals: totals(inv, items) };
}

function templateFor(inv) {
  const t = getTemplate(inv.template);
  if (!t) throw new CrmError('Pick an invoice template for this invoice first');
  return t;
}

export async function preview(inst, id, { forPrint = false } = {}, me = {}) {
  const inv = await fullInvoice(inst, needId(id));
  const out = templateFor(inv).render(inv, { forPrint, workspace: await workspace(inst, me) });
  return { ...out, to: inv.bill_to_email || null };
}

// Sends the invoice email, marks a draft as sent, and logs it on the invoice
// (and its contact, if linked).
export async function send(inst, id, { to, cc, save_email = true } = {}, me = {}) {
  const inv = await fullInvoice(inst, needId(id));
  if (inv.status === 'void') throw new CrmError('This invoice is void');
  if (!inv.items.length) throw new CrmError('Add at least one line item before sending');
  const recipients = emailList(to || inv.bill_to_email);
  if (!recipients.length) throw new CrmError('Add the bill-to email, or who to send it to');
  const copies = cc ? emailList(cc) : [];
  const t = templateFor(inv);
  const { subject, html, text } = t.render(inv, { workspace: await workspace(inst, me) });
  const messageId = await sendEmail({ to: recipients, cc: copies, subject, html, text, replyTo: t.reply_to || me.email });
  const audit = { userId: me.id };
  await updateRecord(inst, 'invoices', inv.id, inv.status === 'draft' ? { status: 'sent' } : {}, audit);
  await q('UPDATE crm_invoices SET sent_at = now(), sent_to = $3 WHERE id = $1 AND instance_id = $2', [inv.id, inst, recipients.join(', ')]);
  // First send to a new address: keep it as the bill-to email (and on the contact if it has none).
  if (save_email && !inv.bill_to_email) {
    await q('UPDATE crm_invoices SET bill_to_email = $3 WHERE id = $1 AND instance_id = $2', [inv.id, inst, recipients[0]]);
    if (inv.contact_id) await q(`UPDATE crm_contacts SET email = $3, updated_at = now() WHERE id = $1 AND instance_id = $2 AND (email IS NULL OR email = '')`, [inv.contact_id, inst, recipients[0]]);
  }
  const note = { type: 'email', subject: `Invoice ${inv.name} sent`, body: `${subject}\nTo: ${recipients.join(', ')}${copies.length ? `\nCc: ${copies.join(', ')}` : ''}\nAmount due: $${inv.totals.amount_due.toFixed(2)}` };
  await addActivity(inst, { ...note, entity_type: 'invoices', entity_id: inv.id }, audit);
  if (inv.contact_id) await addActivity(inst, { ...note, entity_type: 'contacts', entity_id: inv.contact_id }, audit).catch(() => {});
  return { sent: true, id: messageId, to: recipients, cc: copies };
}
