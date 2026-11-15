import loogoLabsInvoice from './loogo-labs-invoice.js';
import standardInvoice from './standard-invoice.js';

// Coded invoice templates. Like the email blast templates (../email-templates),
// the look and the fixed wording live here in code; a CRM user only fills in
// the invoice's data (who it's for, line items, dates, notes) and picks one of
// the templates their workspace can use.
//
// Which templates a workspace sees:
//   - templates that list the workspace's slug in `instances` (its branded ones, listed first)
//   - templates with `instances: '*'` (the Standard invoice, so every workspace can invoice)
//   - any template one of its invoices already uses
//
// To add a branded template for a client workspace:
//   1. Copy loogo-labs-invoice.js to <client>-invoice.js.
//   2. Change BRAND (logo URL, colors, business name, address, email, phone,
//      website) and `instances` to the workspace's slug (CRM → Settings).
//   3. Add it to TEMPLATES below and run `npm run check:invoices`.
//
// Template shape:
//   { id, name, description, instances: [slug, …] | '*', reply_to?,
//     render(invoice, { forPrint, workspace: { name, email, contact } }) → { subject, preheader, html, text } }
export const TEMPLATES = [loogoLabsInvoice, standardInvoice];

export const summary = ({ id, name, description }) => ({ id, name, description });
export const getTemplate = (id) => TEMPLATES.find((t) => t.id === id) || null;
export function templatesFor(slug, usedIds = []) {
  const own = TEMPLATES.filter((t) => Array.isArray(t.instances) && t.instances.includes(slug));
  const rest = TEMPLATES.filter((t) => !own.includes(t) && (t.instances === '*' || usedIds.includes(t.id)));
  return [...own, ...rest];
}
