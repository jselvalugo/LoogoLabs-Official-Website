import { db, tokenHash } from '../lib/crm.js';
import {
  CrmError, addActivity, convertLead, createRecord, deleteActivity, deleteRecord, getRecord, listActivities,
  listRecords, overview, updateActivity, updateRecord,
} from '../lib/crm-records.js';
import { ACTIVITY_FIELDS, ACTIVITY_TYPES, ENTITIES, ENTITY_KEYS, OPPORTUNITY_STAGES } from '../../src/crm/entities.js';

// "Loogo Labs CRM" — an MCP server (Streamable HTTP, stateless JSON responses)
// at https://crm.loogolabs.com/mcp/<token>. The token can also be sent as
// "Authorization: Bearer <token>" to /mcp. Tokens are created in /admin →
// CRM Instances, and each one is locked to a single instance.
//
// Scope: this server manages CRM data only (companies, contacts, leads,
// opportunities, activities, team list). It has no access to the website, blog,
// the website's own Leads CRM and proposals in /admin, analytics, email, or the
// CRM instances/users themselves, which stay in /admin.
export const config = { path: ['/mcp', '/mcp/*'] };

const SERVER = { name: 'Loogo Labs CRM', version: '2.0.0' };
const PROTOCOL_VERSIONS = ['2025-06-18', '2025-03-26', '2024-11-05'];

const typeArg = { type: 'string', enum: ENTITY_KEYS, description: 'Record type' };
const idArg = { type: 'string', description: 'Record id (from search_records)' };
const describeField = (f) => `${f.key}${f.required ? ' (required)' : ''}: ${f.type === 'select' ? f.options.map((o) => o.id).join('|')
  : f.type === 'ref' ? `${ENTITIES[f.to].label} id` : f.type === 'user' ? 'user id from list_team' : f.type}`;
const FIELD_GUIDE = ENTITY_KEYS.map((k) => `${k}: ${ENTITIES[k].fields.map(describeField).join('; ')}`).join('\n');
const valuesArg = {
  type: 'object', additionalProperties: true,
  description: `Field values by key. Pass an empty string or null to clear a field. Fields per type:\n${FIELD_GUIDE}`,
};

const TOOLS = [
  {
    name: 'describe_crm',
    title: 'CRM: Describe data model',
    description: 'Lists the CRM record types (companies, contacts, leads, opportunities), every field with its type and allowed values, and activity types. Call this first if unsure which fields exist.',
    inputSchema: { type: 'object', properties: {} },
    annotations: { readOnlyHint: true },
  },
  {
    name: 'search_records',
    title: 'CRM: Search records',
    description: 'Search companies, contacts, leads or opportunities. query matches names, emails, phones and similar text; filters match exact field values (e.g. {"stage":"proposal"}, {"company_id":"..."}, {"status":["new","contacted"]}). Results include display names for linked records (company_id_name, owner_id_name).',
    inputSchema: {
      type: 'object',
      properties: {
        type: typeArg,
        query: { type: 'string' },
        filters: { type: 'object', additionalProperties: true },
        sort: { type: 'string', description: 'field:asc or field:desc, default updated_at:desc' },
        limit: { type: 'integer', minimum: 1, maximum: 200, default: 25 },
        offset: { type: 'integer', minimum: 0, default: 0 },
      },
      required: ['type'],
    },
    annotations: { readOnlyHint: true },
  },
  {
    name: 'get_record',
    title: 'CRM: Get record',
    description: 'One record with all its fields, its activity timeline, and related records (a company\'s contacts and opportunities; a contact\'s opportunities).',
    inputSchema: { type: 'object', properties: { type: typeArg, id: idArg }, required: ['type', 'id'] },
    annotations: { readOnlyHint: true },
  },
  {
    name: 'create_record',
    title: 'CRM: Create record',
    description: 'Create a company, contact, lead or opportunity. Link records with company_id / contact_id. Opportunity probability follows its stage unless given.',
    inputSchema: { type: 'object', properties: { type: typeArg, values: valuesArg }, required: ['type', 'values'] },
  },
  {
    name: 'update_record',
    title: 'CRM: Update record',
    description: 'Change fields on a record. Only the fields passed change. Use this to move an opportunity between stages or change a lead status.',
    inputSchema: { type: 'object', properties: { type: typeArg, id: idArg, values: valuesArg }, required: ['type', 'id', 'values'] },
    annotations: { idempotentHint: true },
  },
  {
    name: 'delete_record',
    title: 'CRM: Delete record',
    description: 'Permanently delete a record and its activities. Linked records stay but lose the link. Confirm with the user before calling this.',
    inputSchema: { type: 'object', properties: { type: typeArg, id: idArg }, required: ['type', 'id'] },
    annotations: { destructiveHint: true },
  },
  {
    name: 'convert_lead',
    title: 'CRM: Convert lead',
    description: 'Convert a lead into a contact, linked to a company (an existing company_id, else one matched or created from the lead\'s company name), and by default a new opportunity. The lead is kept and marked converted; its activities move to the new contact.',
    inputSchema: {
      type: 'object',
      properties: {
        lead_id: idArg,
        company_id: { type: 'string', description: 'Attach to this existing company instead' },
        create_company: { type: 'boolean', default: true },
        create_opportunity: { type: 'boolean', default: true },
        opportunity_name: { type: 'string' },
        amount: { type: 'number' },
        stage: { type: 'string', enum: OPPORTUNITY_STAGES.map((s) => s.id), default: 'qualification' },
        close_date: { type: 'string', description: 'YYYY-MM-DD' },
      },
      required: ['lead_id'],
    },
  },
  {
    name: 'log_activity',
    title: 'CRM: Log activity',
    description: `Add a ${ACTIVITY_TYPES.map((t) => t.id).join(', ')} to any record's timeline. Tasks stay open until completed (set completed true to log a finished one); other types are recorded as done.`,
    inputSchema: {
      type: 'object',
      properties: {
        record_type: typeArg,
        record_id: idArg,
        type: { type: 'string', enum: ACTIVITY_TYPES.map((t) => t.id), default: 'note' },
        subject: { type: 'string' },
        body: { type: 'string' },
        due_date: { type: 'string', description: 'YYYY-MM-DD, for tasks and meetings' },
        owner_id: { type: 'string', description: 'Assignee, a user id from list_team' },
        completed: { type: 'boolean' },
      },
      required: ['record_type', 'record_id'],
    },
  },
  {
    name: 'list_activities',
    title: 'CRM: List activities',
    description: 'Activities newest first, optionally for one record or one type. open_tasks true lists unfinished tasks by due date.',
    inputSchema: {
      type: 'object',
      properties: {
        record_type: typeArg, record_id: idArg,
        type: { type: 'string', enum: ACTIVITY_TYPES.map((t) => t.id) },
        open_tasks: { type: 'boolean' },
        limit: { type: 'integer', minimum: 1, maximum: 200, default: 50 },
      },
    },
    annotations: { readOnlyHint: true },
  },
  {
    name: 'update_activity',
    title: 'CRM: Update activity',
    description: `Edit an activity (${ACTIVITY_FIELDS.map((f) => f.key).join(', ')}) or mark a task done with completed true (false reopens it).`,
    inputSchema: {
      type: 'object',
      properties: { id: { type: 'string' }, values: { type: 'object', additionalProperties: true }, completed: { type: 'boolean' } },
      required: ['id'],
    },
    annotations: { idempotentHint: true },
  },
  {
    name: 'delete_activity',
    title: 'CRM: Delete activity',
    description: 'Permanently delete one activity. Confirm with the user first.',
    inputSchema: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] },
    annotations: { destructiveHint: true },
  },
  {
    name: 'pipeline_overview',
    title: 'CRM: Pipeline overview',
    description: 'Record counts, opportunities by stage (count, amount, probability-weighted amount), leads by status, open tasks and recent activity.',
    inputSchema: { type: 'object', properties: {} },
    annotations: { readOnlyHint: true },
  },
  {
    name: 'list_team',
    title: 'CRM: List team',
    description: 'The users of this CRM workspace, with ids to use as owner_id.',
    inputSchema: { type: 'object', properties: {} },
    annotations: { readOnlyHint: true },
  },
];

function describe() {
  return {
    record_types: Object.fromEntries(ENTITY_KEYS.map((k) => [k, {
      label: ENTITIES[k].label,
      fields: ENTITIES[k].fields.map((f) => ({ key: f.key, label: f.label, type: f.type, required: !!f.required,
        ...(f.options && { options: f.options.map((o) => o.id) }), ...(f.to && { links_to: f.to }) })),
    }])),
    opportunity_stages: OPPORTUNITY_STAGES,
    activity_types: ACTIVITY_TYPES.map((t) => t.id),
  };
}

async function runTool(name, a, auth) {
  const inst = auth.instance_id;
  const audit = { label: auth.name ? `Claude (${auth.name})` : 'Claude' };
  switch (name) {
    case 'describe_crm': return describe();
    case 'search_records': return listRecords(inst, a.type, { ...a, limit: a.limit ?? 25 });
    case 'get_record': return getRecord(inst, a.type, a.id);
    case 'create_record': return createRecord(inst, a.type, a.values || {}, audit);
    case 'update_record': return updateRecord(inst, a.type, a.id, a.values || {});
    case 'delete_record': return { deleted: await deleteRecord(inst, a.type, a.id) };
    case 'convert_lead': return convertLead(inst, a.lead_id, a, audit);
    case 'log_activity':
      return addActivity(inst, { ...a, entity_type: a.record_type, entity_id: a.record_id }, audit);
    case 'list_activities':
      return listActivities(inst, { ...a, entity_type: a.record_type, entity_id: a.record_id, limit: a.limit ?? 50 });
    case 'update_activity':
      return updateActivity(inst, a.id, { ...(a.values || {}), ...('completed' in a && { completed: a.completed }) });
    case 'delete_activity': return { deleted: await deleteActivity(inst, a.id) };
    case 'pipeline_overview': return overview(inst);
    case 'list_team': {
      const { sql } = db();
      return sql`SELECT id, name, email, role, last_login_at FROM crm_users WHERE instance_id = ${inst} ORDER BY created_at`;
    }
    default: return undefined;
  }
}

async function authenticate(req) {
  const url = new URL(req.url);
  const fromPath = url.pathname.replace(/^\/mcp\/?/, '').split('/')[0];
  const header = req.headers.get('authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : fromPath;
  if (!token) return null;
  const { sql } = db();
  const [row] = await sql`
    UPDATE crm_api_tokens t SET last_used_at = now()
    FROM crm_instances i
    WHERE t.token_hash = ${tokenHash(token)} AND i.id = t.instance_id AND i.status = 'active'
    RETURNING t.instance_id, t.name, i.name AS instance_name`;
  return row || null;
}

const rpcResult = (id, result) => ({ jsonrpc: '2.0', id, result });
const rpcError = (id, code, message) => ({ jsonrpc: '2.0', id: id ?? null, error: { code, message } });

async function handle(msg, auth) {
  const { id, method, params = {} } = msg || {};
  if (!msg || msg.jsonrpc !== '2.0' || typeof method !== 'string') return rpcError(id, -32600, 'Invalid request');
  const isNotification = id === undefined;

  switch (method) {
    case 'initialize': {
      const asked = params.protocolVersion;
      return rpcResult(id, {
        protocolVersion: PROTOCOL_VERSIONS.includes(asked) ? asked : PROTOCOL_VERSIONS[0],
        capabilities: { tools: { listChanged: false } },
        serverInfo: SERVER,
        instructions: `Loogo Labs CRM manages only the CRM data of the "${auth.instance_name}" workspace: companies, contacts, leads, opportunities, their activities, and the team list. It cannot change the Loogo Labs website, blog, the website's own lead forms and proposals, analytics or email, nor create workspaces, users or passwords; tell the user those are done in the Loogo Labs admin panel. Record types: companies, contacts, leads, opportunities, each with an activity timeline (notes, calls, emails, meetings, tasks). Use search_records to find an id before reading or changing a record; call describe_crm for the full field list. This is data only: nothing here sends emails or runs automations.`,
      });
    }
    case 'ping':
      return rpcResult(id, {});
    case 'tools/list':
      return rpcResult(id, { tools: TOOLS });
    case 'tools/call': {
      try {
        const out = await runTool(params.name, params.arguments || {}, auth);
        if (out === undefined) return rpcError(id, -32602, `Unknown tool: ${params.name}`);
        return rpcResult(id, { content: [{ type: 'text', text: JSON.stringify(out, null, 2) }] });
      } catch (err) {
        if (!(err instanceof CrmError)) console.error('crm-mcp tool failed', params.name, err);
        return rpcResult(id, { isError: true, content: [{ type: 'text', text: err instanceof CrmError ? err.message : 'The CRM could not complete that request.' }] });
      }
    }
    default:
      return isNotification ? null : rpcError(id, -32601, `Method not found: ${method}`);
  }
}

const respond = (body, status = 200) => new Response(body === null ? null : JSON.stringify(body), {
  status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
});

export default async (req) => {
  // Stateless server: no server-initiated stream, so GET and DELETE are not offered.
  if (req.method !== 'POST') return new Response(null, { status: 405, headers: { Allow: 'POST' } });

  const auth = await authenticate(req);
  if (!auth) return respond(rpcError(null, -32001, 'Missing or invalid Loogo Labs CRM token'), 401);

  let payload;
  try { payload = await req.json(); } catch { return respond(rpcError(null, -32700, 'Parse error'), 400); }

  if (Array.isArray(payload)) {
    const out = (await Promise.all(payload.map((m) => handle(m, auth)))).filter(Boolean);
    return out.length ? respond(out) : respond(null, 202);
  }
  const out = await handle(payload, auth);
  return out ? respond(out) : respond(null, 202);
};
