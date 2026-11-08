import cardsAndCocktails from './cards-and-cocktails.js';

// Coded email templates for email blasts. Templates live here, in code, and
// nowhere else: CRM users pick one from a dropdown and upload who gets it, but
// cannot write or change a template's content. Every CRM instance sees every
// template in this list, in this order (the first is the default).
//
// To add a template for a client: create a file next to this one that exports
//   { id, name, description, from_name, postal_address?, subject, preheader, render(ctx) }
// and add it to TEMPLATES. `render` returns { html, text } and must put
// ctx.unsubscribeUrl and ctx.postalAddress in both (CAN-SPAM); renderTemplate
// refuses to send an email that leaves them out. subject and preheader may use
// {{first_name|fallback}}, {{name}} and {{email}}.
//
// ctx = { firstName, name, email, preheader (merged), unsubscribeUrl, postalAddress, esc }
// Merge values in ctx are raw; wrap them in ctx.esc() inside HTML.
export const TEMPLATES = [cardsAndCocktails];

export function listTemplates() {
  return TEMPLATES.map(({ id, name, description, from_name, subject, preheader }) => ({ id, name, description, from_name, subject, preheader }));
}

export const getTemplate = (id) => TEMPLATES.find((t) => t.id === id) || null;
