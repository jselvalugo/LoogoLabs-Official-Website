import { json } from '../lib/crm.js';
import { CrmError } from '../lib/crm-records.js';
import { clientApproval, clientComment, clientDecision, portalView, recapView } from '../lib/crm-clients.js';

// The client-facing side of the CRM: no sign-in, every call carries the share
// token from the client's portal or recap link and only sees that client.
// POST { action, token, ... }.
export default async (req) => {
  if (req.method !== 'POST') return new Response(null, { status: 405 });
  let body;
  try { body = await req.json(); } catch { return json({ error: 'Invalid JSON' }, 400); }
  const { token } = body;

  try {
    switch (body.action) {
      case 'portal': return json(await portalView(token));
      case 'approval': return json(await clientApproval(token, body.id));
      case 'comment': return json(await clientComment(token, body.id, body.values || {}), 201);
      case 'decide': return json(await clientDecision(token, body.id, body.values || {}));
      case 'recap': return json(await recapView(token));
      default: return json({ error: 'Unknown action' }, 400);
    }
  } catch (err) {
    if (err instanceof CrmError) return json({ error: err.message }, err.status);
    console.error('crm-share failed', body.action, err);
    return json({ error: 'Request failed' }, 500);
  }
};
