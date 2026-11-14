import loogoLabsInvoice from './loogo-labs-invoice.js';

// Coded invoice templates, one or more per CRM instance. Like the email blast
// templates (../email-templates), the look and the fixed wording live here in
// code; a CRM user only fills in the invoice's data (who it's for, line items,
// dates, notes) and picks a template from the ones their workspace can use.
//
// An instance sees a template when the template lists the instance's slug in
// `instances`, or when one of its invoices already uses the template. To add
// one for a client: copy loogo-labs-invoice.js, change BRAND and `instances`,
// and add it to TEMPLATES.
//
// Template shape: { id, name, description, instances, reply_to?, render(invoice, { forPrint }) }
// where render returns { subject, preheader, html, text }.
export const TEMPLATES = [loogoLabsInvoice];

export const summary = ({ id, name, description }) => ({ id, name, description });
export const getTemplate = (id) => TEMPLATES.find((t) => t.id === id) || null;
export const templatesFor = (slug, usedIds = []) => TEMPLATES.filter((t) => t.instances.includes(slug) || usedIds.includes(t.id));
