import { db } from './crm.js';
import { ACTIVITY_FIELDS, ENTITIES, ENTITY_KEYS, OPPORTUNITY_STAGES } from '../../src/crm/entities.js';

// Generic, instance-scoped CRUD over the entities in src/crm/entities.js, used by
// both the CRM app API and the MCP server. Table and column names only ever come
// from that file, never from the request; every value goes in as a parameter.

export class CrmError extends Error {
  constructor(message, status = 400) { super(message); this.status = status; }
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const q = (text, params = []) => db().sql.unsafe(text, params);

// A Postgres date as YYYY-MM-DD. node-postgres hands dates back as local
// midnight, so toISOString() could shift them a day; read the local parts.
const ymd = (d) => (d instanceof Date
  ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  : d);

export function entity(key) {
  const e = ENTITIES[key];
  if (!e) throw new CrmError(`Unknown record type "${key}". Use one of: ${ENTITY_KEYS.join(', ')}`);
  return e;
}

export function needId(v, what = 'id') {
  if (typeof v !== 'string' || !UUID.test(v)) throw new CrmError(`${what} must be a record id`);
  return v;
}

// Display names for ref and user columns, e.g. company_id → company_id_name.
function nameColumns(e, alias = 't') {
  return e.fields.filter((f) => f.type === 'ref' || f.type === 'user').map((f) => (f.type === 'user'
    ? `(SELECT COALESCE(NULLIF(u.name, ''), u.email) FROM crm_users u WHERE u.id = ${alias}.${f.key}) AS ${f.key}_name`
    : `(SELECT r.name FROM ${ENTITIES[f.to].table} r WHERE r.id = ${alias}.${f.key}) AS ${f.key}_name`)).join(', ');
}
const selectList = (e, alias = 't') => [`${alias}.*`, nameColumns(e, alias)].filter(Boolean).join(', ');

// Postgres numerics arrive as strings; hand callers numbers.
function shape(e, row) {
  if (!row) return row;
  const out = { ...row };
  delete out.instance_id;
  for (const f of e.fields) {
    if (['number', 'money', 'percent'].includes(f.type) && out[f.key] !== null && out[f.key] !== undefined) out[f.key] = Number(out[f.key]);
    if (f.type === 'date') out[f.key] = ymd(out[f.key]);
  }
  return out;
}

async function checkRef(inst, table, id, label) {
  const [row] = await q(`SELECT 1 FROM ${table} WHERE id = $1 AND instance_id = $2`, [id, inst]);
  if (!row) throw new CrmError(`${label}: no such record in this workspace`);
}

// Validates a write against the field list. Unknown keys are ignored, empty
// strings clear a field, and ref/user ids must belong to the same instance.
async function clean(inst, fields, input, { partial }) {
  const out = {};
  for (const f of fields) {
    if (!Object.prototype.hasOwnProperty.call(input, f.key)) {
      if (!partial && f.default !== undefined) out[f.key] = f.default;
      if (!partial && f.required) throw new CrmError(`${f.label} is required`);
      continue;
    }
    let v = input[f.key];
    if (typeof v === 'string') v = v.trim();
    if (v === '' || v === undefined) v = null;
    if (v === null) {
      if (f.required) throw new CrmError(`${f.label} is required`);
      if (f.default !== undefined) v = f.default;
      out[f.key] = v;
      continue;
    }
    switch (f.type) {
      case 'number': case 'money': case 'percent': {
        const n = Number(v);
        if (!Number.isFinite(n)) throw new CrmError(`${f.label} must be a number`);
        if (f.type === 'percent' && (n < 0 || n > 100)) throw new CrmError(`${f.label} must be between 0 and 100`);
        v = n;
        break;
      }
      case 'date': {
        const s = String(v).slice(0, 10);
        if (!/^\d{4}-\d{2}-\d{2}$/.test(s) || Number.isNaN(Date.parse(s))) throw new CrmError(`${f.label} must be a date (YYYY-MM-DD)`);
        v = s;
        break;
      }
      case 'select':
        if (!f.options.some((o) => o.id === v)) throw new CrmError(`${f.label} must be one of: ${f.options.map((o) => o.id).join(', ')}`);
        break;
      case 'ref':
        await checkRef(inst, ENTITIES[f.to].table, needId(v, f.label), f.label);
        break;
      case 'user': {
        const [u] = await q('SELECT 1 FROM crm_users WHERE id = $1 AND instance_id = $2', [needId(v, f.label), inst]);
        if (!u) throw new CrmError(`${f.label}: no such user in this workspace`);
        break;
      }
      case 'email':
        v = String(v).slice(0, 320).toLowerCase();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) throw new CrmError(`${f.label} is not a valid email`);
        break;
      default:
        v = String(v).slice(0, f.type === 'textarea' ? 20000 : 500);
    }
    out[f.key] = v;
  }
  return out;
}

const stageProbability = (stage) => OPPORTUNITY_STAGES.find((s) => s.id === stage)?.probability ?? null;

// Opportunity bookkeeping: probability follows the stage unless given, and
// closed_at is stamped when a deal is won or lost.
function opportunityDefaults(values, before) {
  if (values.stage && values.stage !== before?.stage) {
    if (!('probability' in values)) values.probability = stageProbability(values.stage);
    values.closed_at = ['won', 'lost'].includes(values.stage) ? new Date().toISOString() : null;
  }
}

export async function listRecords(inst, key, { query, filters = {}, sort, limit = 50, offset = 0 } = {}) {
  const e = entity(key);
  const where = ['t.instance_id = $1'];
  const params = [inst];
  const add = (v) => { params.push(v); return `$${params.length}`; };

  if (query && String(query).trim()) {
    const p = add(`%${String(query).trim().toLowerCase()}%`);
    where.push(`(${e.search.map((c) => `lower(coalesce(t.${c}, '')) LIKE ${p}`).join(' OR ')})`);
  }
  for (const [k, v] of Object.entries(filters || {})) {
    const f = e.fields.find((x) => x.key === k);
    if (!f || v === undefined || v === '') continue;
    if (v === null) where.push(`t.${k} IS NULL`);
    else if (Array.isArray(v)) where.push(`t.${k}::text = ANY(${add(v.map(String))})`);
    else where.push(`t.${k}::text = ${add(String(v))}`);
  }
  const [field, dir] = String(sort || 'updated_at:desc').split(':');
  const sortCol = ['created_at', 'updated_at', ...e.fields.map((f) => f.key)].includes(field) ? field : 'updated_at';
  const order = `t.${sortCol} ${dir === 'asc' ? 'ASC' : 'DESC'} NULLS LAST`;
  const lim = Math.min(Math.max(parseInt(limit, 10) || 50, 1), 500);
  const off = Math.max(parseInt(offset, 10) || 0, 0);

  const rows = await q(`SELECT ${selectList(e)} FROM ${e.table} t WHERE ${where.join(' AND ')} ORDER BY ${order} LIMIT ${lim} OFFSET ${off}`, params);
  const [{ total }] = await q(`SELECT count(*)::int AS total FROM ${e.table} t WHERE ${where.join(' AND ')}`, params);
  return { records: rows.map((r) => shape(e, r)), total };
}

export async function getRecord(inst, key, id, { related = true } = {}) {
  const e = entity(key);
  const [row] = await q(`SELECT ${selectList(e)} FROM ${e.table} t WHERE t.id = $1 AND t.instance_id = $2`, [needId(id), inst]);
  if (!row) throw new CrmError(`${e.label} not found`, 404);
  const record = shape(e, row);
  if (!related) return record;

  const rel = {};
  const list = async (k, col) => (await listRecords(inst, k, { filters: { [col]: id }, limit: 200 })).records;
  if (key === 'companies') {
    rel.contacts = await list('contacts', 'company_id');
    rel.opportunities = await list('opportunities', 'company_id');
  }
  if (key === 'contacts') rel.opportunities = await list('opportunities', 'contact_id');
  return { ...record, related: rel, activities: await listActivities(inst, { entity_type: key, entity_id: id }) };
}

export async function createRecord(inst, key, input, audit = {}) {
  const e = entity(key);
  const values = await clean(inst, e.fields, input, { partial: false });
  if (key === 'opportunities') opportunityDefaults(values, null);
  if (values.owner_id === undefined && audit.userId) values.owner_id = audit.userId;
  const cols = Object.keys(values);
  const params = [inst, ...cols.map((c) => values[c])];
  const [row] = await q(
    `INSERT INTO ${e.table} (instance_id${cols.map((c) => `, ${c}`).join('')}) VALUES ($1${cols.map((_, i) => `, $${i + 2}`).join('')}) RETURNING id`,
    params,
  );
  return getRecord(inst, key, row.id, { related: false });
}

export async function updateRecord(inst, key, id, input) {
  const e = entity(key);
  const before = await getRecord(inst, key, id, { related: false });
  const values = await clean(inst, e.fields, input, { partial: true });
  if (key === 'opportunities') opportunityDefaults(values, before);
  const cols = Object.keys(values);
  if (!cols.length) return before;
  await q(
    `UPDATE ${e.table} SET ${cols.map((c, i) => `${c} = $${i + 3}`).join(', ')}, updated_at = now() WHERE id = $1 AND instance_id = $2`,
    [id, inst, ...cols.map((c) => values[c])],
  );
  return getRecord(inst, key, id, { related: false });
}

export async function deleteRecord(inst, key, id) {
  const e = entity(key);
  const [row] = await q(`DELETE FROM ${e.table} WHERE id = $1 AND instance_id = $2 RETURNING id, name`, [needId(id), inst]);
  if (!row) throw new CrmError(`${e.label} not found`, 404);
  await q('DELETE FROM crm_activities WHERE entity_type = $1 AND entity_id = $2 AND instance_id = $3', [key, id, inst]);
  return row;
}

// ── Activities ──────────────────────────────────────────────────────────────

const ACTIVITY_SELECT = `a.id, a.entity_type, a.entity_id, a.type, a.subject, a.body, a.due_date, a.completed_at,
  a.owner_id, a.created_at, a.updated_at,
  (SELECT COALESCE(NULLIF(u.name, ''), u.email) FROM crm_users u WHERE u.id = a.owner_id) AS owner_id_name,
  COALESCE((SELECT COALESCE(NULLIF(u.name, ''), u.email) FROM crm_users u WHERE u.id = a.user_id), a.author_label) AS author,
  COALESCE((SELECT name FROM crm_companies WHERE id = a.entity_id), (SELECT name FROM crm_contacts WHERE id = a.entity_id),
    (SELECT name FROM crm_leads WHERE id = a.entity_id), (SELECT name FROM crm_opportunities WHERE id = a.entity_id)) AS entity_name`;

const shapeActivity = (a) => ({ ...a, due_date: ymd(a.due_date) });

export async function listActivities(inst, { entity_type, entity_id, type, open_tasks, limit = 100 } = {}) {
  const where = ['a.instance_id = $1'];
  const params = [inst];
  const add = (v) => { params.push(v); return `$${params.length}`; };
  if (entity_type) { entity(entity_type); where.push(`a.entity_type = ${add(entity_type)}`); }
  if (entity_id) where.push(`a.entity_id = ${add(needId(entity_id, 'entity_id'))}`);
  if (type) where.push(`a.type = ${add(type)}`);
  if (open_tasks) where.push(`a.type = 'task' AND a.completed_at IS NULL`);
  const order = open_tasks ? 'a.due_date ASC NULLS LAST, a.created_at' : 'a.created_at DESC';
  const lim = Math.min(Math.max(parseInt(limit, 10) || 100, 1), 500);
  return (await q(`SELECT ${ACTIVITY_SELECT} FROM crm_activities a WHERE ${where.join(' AND ')} ORDER BY ${order} LIMIT ${lim}`, params)).map(shapeActivity);
}

async function getActivity(inst, id) {
  const [row] = await q(`SELECT ${ACTIVITY_SELECT} FROM crm_activities a WHERE a.id = $1 AND a.instance_id = $2`, [needId(id), inst]);
  if (!row) throw new CrmError('Activity not found', 404);
  return shapeActivity(row);
}

export async function addActivity(inst, input, audit = {}) {
  const key = input.entity_type;
  await checkRef(inst, entity(key).table, needId(input.entity_id, 'entity_id'), entity(key).label);
  const values = await clean(inst, ACTIVITY_FIELDS, input, { partial: false });
  if (!values.subject && !values.body) throw new CrmError('An activity needs a subject or details');
  const completed = values.type !== 'task' || input.completed ? new Date().toISOString() : null;
  const [row] = await q(
    `INSERT INTO crm_activities (instance_id, entity_type, entity_id, type, subject, body, due_date, owner_id, completed_at, user_id, author_label)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id`,
    [inst, key, input.entity_id, values.type, values.subject ?? null, values.body ?? null, values.due_date ?? null,
      values.owner_id ?? audit.userId ?? null, completed, audit.userId ?? null, audit.label ?? null],
  );
  await q(`UPDATE ${entity(key).table} SET updated_at = now() WHERE id = $1`, [input.entity_id]);
  return getActivity(inst, row.id);
}

export async function updateActivity(inst, id, input) {
  await getActivity(inst, id);
  const values = await clean(inst, ACTIVITY_FIELDS, input, { partial: true });
  if ('completed' in input) values.completed_at = input.completed ? new Date().toISOString() : null;
  const cols = Object.keys(values);
  if (cols.length) {
    await q(`UPDATE crm_activities SET ${cols.map((c, i) => `${c} = $${i + 3}`).join(', ')}, updated_at = now() WHERE id = $1 AND instance_id = $2`,
      [id, inst, ...cols.map((c) => values[c])]);
  }
  return getActivity(inst, id);
}

export async function deleteActivity(inst, id) {
  const [row] = await q('DELETE FROM crm_activities WHERE id = $1 AND instance_id = $2 RETURNING id', [needId(id), inst]);
  if (!row) throw new CrmError('Activity not found', 404);
  return row;
}

// ── Lead conversion ─────────────────────────────────────────────────────────

// Turns a lead into a contact, attached to an existing company (company_id), a
// new one made from the lead's company name, or none; optionally also opens an
// opportunity. The lead stays, marked converted, linking to what it became.
export async function convertLead(inst, id, opts = {}, audit = {}) {
  const lead = await getRecord(inst, 'leads', id, { related: false });
  if (lead.status === 'converted') throw new CrmError('This lead is already converted');
  const owner = lead.owner_id || undefined;

  let companyId = opts.company_id || null;
  if (companyId) await checkRef(inst, 'crm_companies', needId(companyId, 'company_id'), 'Company');
  else if (lead.company_name && opts.create_company !== false) {
    const [existing] = await q('SELECT id FROM crm_companies WHERE instance_id = $1 AND lower(name) = lower($2) LIMIT 1', [inst, lead.company_name]);
    companyId = existing?.id || (await createRecord(inst, 'companies', {
      name: lead.company_name, website: lead.website, industry: lead.industry, city: lead.city, country: lead.country, owner_id: owner,
    }, audit)).id;
  }

  const contact = await createRecord(inst, 'contacts', {
    name: lead.name, title: lead.title, email: lead.email, phone: lead.phone, company_id: companyId, source: lead.source,
    city: lead.city, country: lead.country, owner_id: owner, lifecycle: 'prospect', description: lead.description,
  }, audit);

  let opportunity = null;
  if (opts.create_opportunity !== false) {
    opportunity = await createRecord(inst, 'opportunities', {
      name: opts.opportunity_name || `${lead.company_name || lead.name} deal`,
      company_id: companyId, contact_id: contact.id, amount: opts.amount ?? lead.estimated_value, source: lead.source,
      stage: opts.stage || 'qualification', close_date: opts.close_date, owner_id: owner,
    }, audit);
  }

  // The lead's own timeline moves with it to the new contact.
  await q(`UPDATE crm_activities SET entity_type = 'contacts', entity_id = $1 WHERE entity_type = 'leads' AND entity_id = $2 AND instance_id = $3`,
    [contact.id, id, inst]);
  await q(`UPDATE crm_leads SET status = 'converted', converted_at = now(), converted_company_id = $3, converted_contact_id = $4,
    converted_opportunity_id = $5, updated_at = now() WHERE id = $1 AND instance_id = $2`, [id, inst, companyId, contact.id, opportunity?.id ?? null]);

  return {
    lead: await getRecord(inst, 'leads', id, { related: false }),
    company: companyId ? await getRecord(inst, 'companies', companyId, { related: false }) : null,
    contact, opportunity,
  };
}

// ── Overview ────────────────────────────────────────────────────────────────

export async function overview(inst) {
  const pipeline = await q(`SELECT stage, count(*)::int AS count, COALESCE(sum(amount), 0)::float AS amount,
      COALESCE(sum(amount * COALESCE(probability, 0) / 100), 0)::float AS weighted
    FROM crm_opportunities WHERE instance_id = $1 GROUP BY stage`, [inst]);
  const leads = await q('SELECT status, count(*)::int AS count FROM crm_leads WHERE instance_id = $1 GROUP BY status', [inst]);
  const [counts] = await q(`SELECT
      (SELECT count(*)::int FROM crm_companies WHERE instance_id = $1) AS companies,
      (SELECT count(*)::int FROM crm_contacts WHERE instance_id = $1) AS contacts,
      (SELECT count(*)::int FROM crm_leads WHERE instance_id = $1) AS leads,
      (SELECT count(*)::int FROM crm_opportunities WHERE instance_id = $1) AS opportunities`, [inst]);
  return {
    counts,
    pipeline: OPPORTUNITY_STAGES.map((s) => ({ stage: s.id, label: s.label, count: 0, amount: 0, weighted: 0, ...pipeline.find((p) => p.stage === s.id) })),
    leads,
    open_tasks: await listActivities(inst, { open_tasks: true, limit: 20 }),
    recent_activity: await listActivities(inst, { limit: 20 }),
  };
}
