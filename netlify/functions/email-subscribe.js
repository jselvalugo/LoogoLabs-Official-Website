import { json } from '../lib/crm.js';
import { CrmError } from '../lib/crm-records.js';
import { publicSubscribe } from '../lib/crm-marketing.js';

// Public newsletter sign-up: POST { email, name?, tag?, website? }. Adds the
// person to the email marketing list (not to CRM contacts) of the instance
// that receives website leads. `website` is a honeypot field left empty by people.
export default async (req) => {
  if (req.method !== 'POST') return new Response(null, { status: 405 });
  let body;
  try { body = await req.json(); } catch { return json({ error: 'Invalid JSON' }, 400); }
  if (body.website) return json({ ok: true });
  try {
    return json(await publicSubscribe({ email: body.email, name: body.name, tag: body.tag, source: 'website' }));
  } catch (err) {
    if (err instanceof CrmError) return json({ error: err.message }, err.status);
    console.error('email-subscribe failed', err);
    return json({ error: 'Request failed' }, 500);
  }
};
