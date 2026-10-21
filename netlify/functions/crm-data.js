import { currentUser, db, json } from '../lib/crm.js';
import {
  CrmError, addActivity, convertLead, createRecord, deleteActivity, deleteRecord, getRecord, listActivities,
  listRecords, overview, updateActivity, updateRecord,
} from '../lib/crm-records.js';
import * as clients from '../lib/crm-clients.js';

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
      // Client reporting: dashboards, approvals, recaps (netlify/lib/crm-clients.js).
      case 'clients': return json(await clients.listClients(inst));
      case 'dashboard': return json(await clients.getDashboard(inst, body.company_id));
      case 'save_portal': return json(await clients.savePortal(inst, body.company_id, body.values || {}));
      case 'rotate_portal_link': return json(await clients.rotatePortalLink(inst, body.company_id));
      case 'save_metric': return json(await clients.saveMetric(inst, body.company_id, body.values || {}));
      case 'delete_metric': return json(await clients.deleteMetric(inst, body.id));
      case 'metric_totals': return json(await clients.metricTotals(inst, body.company_id, body.from, body.to));
      case 'approvals': return json(await clients.listApprovals(inst, body));
      case 'get_approval': return json(await clients.getApproval(inst, body.id));
      case 'save_approval': return json(await clients.saveApproval(inst, body.values || {}, audit));
      case 'new_approval_version': return json(await clients.newApprovalVersion(inst, body.id, body.values || {}, audit));
      case 'delete_approval': return json(await clients.deleteApproval(inst, body.id));
      case 'approval_email': return json(await clients.approvalEmailFor(inst, body.id, body.values || {}, me));
      case 'send_approval_email': return json(await clients.approvalEmailFor(inst, body.id, body.values || {}, me, { send: true }));
      case 'approval_comment': return json(await clients.teamComment(inst, body.id, body.values || {}, me), 201);
      case 'resolve_comment': return json(await clients.resolveComment(inst, body.id, body.resolved));
      case 'delete_comment': return json(await clients.deleteComment(inst, body.id));
      case 'recaps': return json(await clients.listRecaps(inst, body));
      case 'save_recap': return json(await clients.saveRecap(inst, body.values || {}, audit));
      case 'delete_recap': return json(await clients.deleteRecap(inst, body.id));
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
