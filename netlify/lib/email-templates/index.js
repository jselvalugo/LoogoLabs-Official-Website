import cardsAndCocktails from './cards-and-cocktails.js';
import loogoLabsLetter from './loogo-labs-newsletter.js';

// Coded email templates for email blasts. Templates live here, in code, and
// nowhere else: CRM users pick one from a dropdown and upload who gets it, but
// cannot write or change a template's content.
//
// Templates belong to CRM instances. An instance sees a template only when
//   - the template lists the instance's slug in `instances`, or
//   - the instance has already used it (a blast exists with this template), or
//   - the template lists another template id in `sameWorkspacesAs` and the
//     instance can see that one.
// A new instance therefore starts with no templates until one is made for it.
// Each instance's slug is shown in its CRM under Settings. Order in this list
// is dropdown order.
//
// To add a template for a client: create a file next to this one that exports
//   { id, name, description, instances: ['<instance slug>'], from_name,
//     postal_address?, subject, preheader, render(ctx) }
// and add it to TEMPLATES. `render` returns { html, text } and must put
// ctx.unsubscribeUrl and ctx.postalAddress in both (CAN-SPAM); renderTemplate
// refuses to send an email that leaves them out. subject and preheader may use
// {{first_name|fallback}}, {{name}} and {{email}}.
//
// Optional: reply_to (where replies go; the sending address may not be read).
//
// ctx = { firstName, name, email, preheader (merged), unsubscribeUrl, postalAddress,
//         subscriberToken (for ?s= on loogolabs.com landing pages), esc }
// Merge values in ctx are raw; wrap them in ctx.esc() inside HTML.
export const TEMPLATES = [...loogoLabsLetter, cardsAndCocktails];

// What the CRM's dropdown needs to know about a template.
export const summary = ({ id, name, description, from_name, subject, preheader }) => ({ id, name, description, from_name, subject, preheader });

export const getTemplate = (id) => TEMPLATES.find((t) => t.id === id) || null;
