// Renders every coded invoice template against sample invoices and fails if
// anything a client would see is missing or broken. Run before adding or
// changing a template:  npm run check:invoices
import { TEMPLATES } from '../netlify/lib/invoice-templates/index.js';

const item = (description, quantity, unit_price, extra = {}) => ({ description, quantity, unit_price, amount: Math.round(quantity * unit_price * 100) / 100, ...extra });
const base = {
  name: 'INV-2026-123', issue_date: '2026-11-13', bill_to_name: 'Ana <b>Test</b> & Co', bill_to_title: 'Owner',
  bill_to_company: 'Test Realty', bill_to_email: 'ana@example.com', notes: 'Line one\nLine two', terms: 'Term one',
};
const totals = (items, over = {}) => {
  const total = items.reduce((s, i) => s + i.amount, 0);
  return { subtotal: total, discount: 0, tax_rate: 0, tax: 0, total, amount_due: total, overdue: false, ...over };
};
const items = [item('Website', 1, 0, { note: 'Complimentary', details: 'Design\nGA4' }), item('Campaign setup', 1, 500), item('Consulting', 2.5, 30, { unit_label: 'hr' })];
const CASES = [
  { label: 'draft, due on receipt', inv: { ...base, status: 'draft', items, totals: totals(items) } },
  { label: 'sent with due date and pay link', inv: { ...base, status: 'sent', due_date: '2026-12-01', payment_link: 'https://pay.example.com/x', items, totals: totals(items) } },
  { label: 'paid', inv: { ...base, status: 'paid', paid_at: '2026-11-20', items, totals: totals(items, { amount_due: 0 }) } },
  { label: 'void', inv: { ...base, status: 'void', items, totals: totals(items, { amount_due: 0 }) } },
  { label: 'no items, minimal bill-to', inv: { name: 'INV-2026-124', status: 'draft', bill_to_name: 'Solo', items: [], totals: totals([]) } },
];
const workspace = { name: 'Sample Workspace', email: 'owner@example.com', contact: 'Sam' };

let failed = 0;
const fail = (msg) => { failed++; console.error(`  ✗ ${msg}`); };
for (const t of TEMPLATES) {
  console.log(`${t.id} (${t.name})`);
  for (const k of ['id', 'name', 'description', 'render']) if (!t[k]) fail(`missing "${k}"`);
  if (!(t.instances === '*' || (Array.isArray(t.instances) && t.instances.length))) fail('instances must be "*" or a list of workspace slugs');
  if (TEMPLATES.filter((x) => x.id === t.id).length > 1) fail('duplicate id');
  for (const c of CASES) for (const forPrint of [false, true]) {
    let out;
    try { out = t.render(c.inv, { forPrint, workspace }); } catch (err) { fail(`${c.label}: render threw ${err.message}`); continue; }
    const where = `${c.label}${forPrint ? ' (print)' : ''}`;
    for (const k of ['subject', 'html', 'text']) if (!out?.[k]) fail(`${where}: empty ${k}`);
    if (!out?.html) continue;
    if (/undefined|NaN|\[object Object\]/.test(out.html + out.text + out.subject)) fail(`${where}: shows undefined / NaN`);
    if (!out.html.includes(c.inv.name)) fail(`${where}: invoice number missing`);
    if (out.html.includes('<b>Test</b>')) fail(`${where}: bill-to name not escaped`);
    for (const it of c.inv.items) if (!out.html.includes(it.description)) fail(`${where}: line "${it.description}" missing`);
    if (c.inv.items.length && !out.html.includes('$575.00')) fail(`${where}: total $575.00 missing`);
    if (c.inv.payment_link && !forPrint && !out.html.includes(c.inv.payment_link)) fail(`${where}: pay link missing`);
    if (!/<meta name="viewport"/.test(out.html)) fail(`${where}: no mobile viewport`);
  }
}
if (failed) { console.error(`\n${failed} problem(s) found.`); process.exit(1); }
console.log(`\nAll ${TEMPLATES.length} invoice templates passed ${CASES.length * 2} cases each.`);
