import { currentUser, db, json } from '../lib/crm.js';
import {
  CrmError, addActivity, convertLead, createRecord, deleteActivity, deleteRecord, getRecord, listActivities,
  listRecords, overview, updateActivity, updateRecord,
} from '../lib/crm-records.js';

// Everything a signed-in CRM user reads or writes, as POST { action, ... }.
// Every call is scoped to the user's own instance (see netlify/lib/crm-records.js).
export default async (req) => {
  if (req.method !== 'POST') return new Response(null, { status: 405 });
  const me = await currentUser(req);
  if (!me) return json({ error: 'Unauthorized' }, 401);
  let body;
  try { body = await req.json(); } catch { return json({ error: 'Invalid JSON' }, 400); }
  const inst = me.instance_id;
  const audit = { userId: me.id };

  try {
    switch (body.action) {
      case 'overview': return json(await overview(inst));
      case 'list': return json(await listRecords(inst, body.entity, body));
      case 'get': return json(await getRecord(inst, body.entity, body.id));
      case 'create': return json(await createRecord(inst, body.entity, body.values || {}, audit), 201);
      case 'update': return json(await updateRecord(inst, body.entity, body.id, body.values || {}));
      case 'delete': return json(await deleteRecord(inst, body.entity, body.id));
      case 'convert_lead': return json(await convertLead(inst, body.id, body.options || {}, audit));
      case 'list_activities': return json(await listActivities(inst, body));
      case 'add_activity': return json(await addActivity(inst, body.values || {}, audit), 201);
      case 'update_activity': return json(await updateActivity(inst, body.id, body.values || {}));
      case 'delete_activity': return json(await deleteActivity(inst, body.id));
      case 'team': {
        const { sql } = db();
        return json(await sql`SELECT id, email, name, role, last_login_at FROM crm_users WHERE instance_id = ${inst} ORDER BY created_at`);
      }
      default:
        return json({ error: 'Unknown action' }, 400);
    }
  } catch (err) {
    if (err instanceof CrmError) return json({ error: err.message }, err.status);
    console.error('crm-data failed', body.action, err);
    return json({ error: 'Request failed' }, 500);
  }
};
