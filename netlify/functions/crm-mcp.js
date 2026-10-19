import { getDatabase } from '@netlify/database';
import { STAGES, text, tokenHash } from '../lib/crm.js';

// "Loogo Labs CRM" — an MCP server (Streamable HTTP, stateless JSON responses)
// at https://crm.loogolabs.com/mcp/<token>. The token can also be sent as
// "Authorization: Bearer <token>" to /mcp. Tokens are created in /admin →
// CRM Instances, and each one is locked to a single instance.
export const config = { path: ['/mcp', '/mcp/*'] };

const SERVER = { name: 'Loogo Labs CRM', version: '1.0.0' };
const PROTOCOL_VERSIONS = ['2025-06-18', '2025-03-26', '2024-11-05'];

const stageEnum = { type: 'string', enum: STAGES };
const contactProps = {
  name: { type: 'string', description: 'Full name of the contact' },
  company: { type: 'string' },
  email: { type: 'string' },
  phone: { type: 'string' },
  stage: { ...stageEnum, description: 'Pipeline stage' },
  value: { type: ['number', 'null'], description: 'Deal value in US dollars' },
};

const TOOLS = [
  {
    name: 'search_contacts',
    title: 'Search contacts',
    description: 'Find contacts by name, company, email or phone, optionally filtered by pipeline stage. An empty query lists the most recently updated contacts.',
    inputSchema: { type: 'object', properties: { query: { type: 'string' }, stage: stageEnum, limit: { type: 'integer', minimum: 1, maximum: 100, default: 25 } } },
    annotations: { readOnlyHint: true },
  },
  {
    name: 'get_contact',
    title: 'Get contact',
    description: 'Get one contact with all of its notes, newest first.',
    inputSchema: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] },
    annotations: { readOnlyHint: true },
  },
  {
    name: 'create_contact',
    title: 'Create contact',
    description: 'Add a new contact. Stage defaults to "lead".',
    inputSchema: { type: 'object', properties: contactProps, required: ['name'] },
  },
  {
    name: 'update_contact',
    title: 'Update contact',
    description: 'Change fields on a contact, including moving it to another pipeline stage. Only the fields you pass are changed.',
    inputSchema: { type: 'object', properties: { id: { type: 'string' }, ...contactProps }, required: ['id'] },
    annotations: { idempotentHint: true },
  },
  {
    name: 'add_note',
    title: 'Add note',
    description: 'Add a note to a contact (a call summary, next step, etc). Notes show in the contact timeline and the overview activity feed.',
    inputSchema: { type: 'object', properties: { contact_id: { type: 'string' }, body: { type: 'string' } }, required: ['contact_id', 'body'] },
  },
  {
    name: 'delete_contact',
    title: 'Delete contact',
    description: 'Permanently delete a contact and all of its notes. Confirm with the user before calling this.',
    inputSchema: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] },
    annotations: { destructiveHint: true },
  },
  {
    name: 'list_team',
    title: 'List team',
    description: 'The users who can sign in to this CRM workspace, with their roles.',
    inputSchema: { type: 'object', properties: {} },
    annotations: { readOnlyHint: true },
  },
  {
    name: 'pipeline_summary',
    title: 'Pipeline summary',
    description: 'Number of contacts and total deal value in each pipeline stage.',
    inputSchema: { type: 'object', properties: {} },
    annotations: { readOnlyHint: true },
  },
  {
    name: 'recent_activity',
    title: 'Recent activity',
    description: 'The latest notes across all contacts.',
    inputSchema: { type: 'object', properties: { limit: { type: 'integer', minimum: 1, maximum: 100, default: 20 } } },
    annotations: { readOnlyHint: true },
  },
];

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
class ToolError extends Error {}

function cleanValue(v) {
  if (v === null || v === '') return null;
  const n = Number(v);
  if (!Number.isFinite(n)) throw new ToolError('value must be a number');
  return n;
}
function needId(v, field = 'id') {
  if (typeof v !== 'string' || !UUID.test(v)) throw new ToolError(`${field} must be a contact id from search_contacts`);
  return v;
}
const clamp = (v, def) => Math.min(Math.max(parseInt(v, 10) || def, 1), 100);

async function runTool(name, args, auth) {
  const { sql } = getDatabase();
  const inst = auth.instance_id;

  switch (name) {
    case 'search_contacts': {
      const q = `%${text(args.query, 200).toLowerCase()}%`;
      const stage = STAGES.includes(args.stage) ? args.stage : null;
      return sql`
        SELECT id, name, company, email, phone, stage, value::float AS value, updated_at FROM crm_contacts
        WHERE instance_id = ${inst} AND (${stage}::text IS NULL OR stage = ${stage})
          AND (lower(name) LIKE ${q} OR lower(company) LIKE ${q} OR lower(email) LIKE ${q} OR phone LIKE ${q})
        ORDER BY updated_at DESC LIMIT ${clamp(args.limit, 25)}`;
    }
    case 'get_contact': {
      const [contact] = await sql`SELECT *, value::float AS value FROM crm_contacts WHERE id = ${needId(args.id)} AND instance_id = ${inst}`;
      if (!contact) throw new ToolError('Contact not found');
      const notes = await sql`
        SELECT n.body, n.created_at, COALESCE(u.name, n.author_label) AS author FROM crm_notes n
        LEFT JOIN crm_users u ON u.id = n.user_id WHERE n.contact_id = ${contact.id} ORDER BY n.created_at DESC`;
      delete contact.instance_id;
      return { ...contact, notes };
    }
    case 'create_contact': {
      const name = text(args.name, 200);
      if (!name) throw new ToolError('name is required');
      const stage = args.stage ?? 'lead';
      if (!STAGES.includes(stage)) throw new ToolError(`stage must be one of ${STAGES.join(', ')}`);
      const [row] = await sql`
        INSERT INTO crm_contacts (instance_id, name, company, email, phone, stage, value)
        VALUES (${inst}, ${name}, ${text(args.company, 200)}, ${text(args.email, 320)}, ${text(args.phone, 60)}, ${stage}, ${cleanValue(args.value ?? null)})
        RETURNING id, name, company, email, phone, stage, value::float AS value`;
      return row;
    }
    case 'update_contact': {
      const id = needId(args.id);
      const has = (k) => Object.prototype.hasOwnProperty.call(args, k);
      if (has('stage') && !STAGES.includes(args.stage)) throw new ToolError(`stage must be one of ${STAGES.join(', ')}`);
      if (has('name') && !text(args.name, 200)) throw new ToolError('name cannot be empty');
      const f = (k, max) => (has(k) ? text(args[k], max) : null);
      const [row] = await sql`
        UPDATE crm_contacts SET
          name = COALESCE(${f('name', 200)}, name), company = COALESCE(${f('company', 200)}, company),
          email = COALESCE(${f('email', 320)}, email), phone = COALESCE(${f('phone', 60)}, phone),
          stage = COALESCE(${has('stage') ? args.stage : null}, stage),
          value = CASE WHEN ${has('value')} THEN ${has('value') ? cleanValue(args.value) : null}::numeric ELSE value END,
          updated_at = now()
        WHERE id = ${id} AND instance_id = ${inst}
        RETURNING id, name, company, email, phone, stage, value::float AS value`;
      if (!row) throw new ToolError('Contact not found');
      return row;
    }
    case 'add_note': {
      const body = text(args.body, 5000);
      if (!body) throw new ToolError('body is required');
      const [contact] = await sql`SELECT id FROM crm_contacts WHERE id = ${needId(args.contact_id, 'contact_id')} AND instance_id = ${inst}`;
      if (!contact) throw new ToolError('Contact not found');
      const label = auth.name ? `Claude (${auth.name})` : 'Claude';
      const [row] = await sql`
        INSERT INTO crm_notes (instance_id, contact_id, body, author_label) VALUES (${inst}, ${contact.id}, ${body}, ${label})
        RETURNING id, body, created_at`;
      await sql`UPDATE crm_contacts SET updated_at = now() WHERE id = ${contact.id}`;
      return row;
    }
    case 'delete_contact': {
      const [row] = await sql`DELETE FROM crm_contacts WHERE id = ${needId(args.id)} AND instance_id = ${inst} RETURNING id, name`;
      if (!row) throw new ToolError('Contact not found');
      return { deleted: row };
    }
    case 'list_team':
      return sql`SELECT name, email, role, last_login_at FROM crm_users WHERE instance_id = ${inst} ORDER BY created_at`;
    case 'pipeline_summary': {
      const rows = await sql`
        SELECT stage, count(*)::int AS contacts, COALESCE(sum(value), 0)::float AS total_value
        FROM crm_contacts WHERE instance_id = ${inst} GROUP BY stage`;
      const by = Object.fromEntries(rows.map((r) => [r.stage, r]));
      return STAGES.map((s) => ({ stage: s, contacts: by[s]?.contacts || 0, total_value: by[s]?.total_value || 0 }));
    }
    case 'recent_activity':
      return sql`
        SELECT n.body, n.created_at, c.id AS contact_id, c.name AS contact_name, COALESCE(u.name, n.author_label) AS author
        FROM crm_notes n JOIN crm_contacts c ON c.id = n.contact_id LEFT JOIN crm_users u ON u.id = n.user_id
        WHERE n.instance_id = ${inst} ORDER BY n.created_at DESC LIMIT ${clamp(args.limit, 20)}`;
    default:
      return undefined;
  }
}

async function authenticate(req) {
  const url = new URL(req.url);
  const fromPath = url.pathname.replace(/^\/mcp\/?/, '').split('/')[0];
  const header = req.headers.get('authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : fromPath;
  if (!token) return null;
  const { sql } = getDatabase();
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
        instructions: `Tools for the "${auth.instance_name}" workspace in Loogo Labs CRM. Pipeline stages: ${STAGES.join(', ')}. Use search_contacts to find a contact id before get_contact, update_contact or add_note.`,
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
        if (!(err instanceof ToolError)) console.error('crm-mcp tool failed', params.name, err);
        return rpcResult(id, { isError: true, content: [{ type: 'text', text: err instanceof ToolError ? err.message : 'The CRM could not complete that request.' }] });
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
