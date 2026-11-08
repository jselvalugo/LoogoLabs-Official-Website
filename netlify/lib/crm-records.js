import { db } from './crm.js';
import {
  ACTIVITY_FIELDS, CHARGE_FIELDS, ENTITIES, ENTITY_KEYS, OPPORTUNITY_STAGES, PROJECT_LIFECYCLES, REPORT_CADENCES, REPORT_FIELDS,
  SOCIAL_FIELDS, SOURCE_FIELDS, stageInfo, stagesFor,
} from '../../src/crm/entities.js';

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
  if (out.last_report_at) out.last_report_at = ymd(out.last_report_at);
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
      case 'image': {
        // An https URL, or a small uploaded image kept inline as a data URL.
        v = String(v);
        const ok = /^https:\/\/\S+$/i.test(v) ? v.length <= 2000
          : /^data:image\/(png|jpeg|webp|gif|svg\+xml);base64,[A-Za-z0-9+/=]+$/.test(v) && v.length <= 400000;
        if (!ok) throw new CrmError(`${f.label} must be an https image link or a PNG, JPG, WebP or SVG under 300 KB`);
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

// Project bookkeeping: the stage must belong to the project's lifecycle (a new
// lifecycle with no valid stage starts at its first one), stage changes stamp
// stage_changed_at and closed_at, and a cadence sets the first report due date.
// Returns { from, to } when the stage moved, for the timeline.
function projectDefaults(values, before) {
  const lifecycle = values.lifecycle ?? before?.lifecycle ?? 'agency';
  let stage = values.stage ?? before?.stage;
  if (!stageInfo(lifecycle, stage)) {
    if (values.stage && (!values.lifecycle || values.lifecycle === before?.lifecycle)) {
      throw new CrmError(`Stage must be one of: ${stagesFor(lifecycle).map((x) => x.id).join(', ')} on the ${lifecycle} lifecycle`);
    }
    stage = stagesFor(lifecycle)[0].id;
  }
  values.lifecycle = lifecycle;
  values.stage = stage;
  if (!before) {
    if (values.report_cadence == null) values.report_cadence = PROJECT_LIFECYCLES.find((l) => l.id === lifecycle).cadence;
    // First report is one cadence after the start, or after today if it started earlier.
    const from = values.start_date && values.start_date > todayYmd() ? values.start_date : todayYmd();
    if (!values.next_report_date) values.next_report_date = addDays(from, cadenceDays(values.report_cadence));
  }
  if (stage === before?.stage) return null;
  values.stage_changed_at = new Date().toISOString();
  values.closed_at = stageInfo(lifecycle, stage).closed ? new Date().toISOString() : null;
  return before ? { from: stageInfo(before.lifecycle, before.stage)?.label || before.stage, to: stageInfo(lifecycle, stage).label } : null;
}

const todayYmd = () => new Date().toISOString().slice(0, 10);
const cadenceDays = (c) => REPORT_CADENCES.find((x) => x.id === c)?.days ?? null;
function addDays(ymdStr, days) {
  if (!days) return null;
  const d = new Date(`${String(ymdStr).slice(0, 10)}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
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
    rel.projects = await list('projects', 'company_id');
  }
  if (key === 'contacts') rel.opportunities = await list('opportunities', 'contact_id');
  if (key === 'opportunities') rel.projects = await list('projects', 'opportunity_id');
  const extra = key === 'projects' ? {
    reports: await listReports(inst, id),
    charges: await listCharges(inst, id),
    billing_summary: await billingSummary(inst, id),
    sources: await listSources(inst, id),
    client: record.company_id ? await clientCard(inst, record.company_id) : null,
  } : {};
  return { ...record, related: rel, ...extra, activities: await listActivities(inst, { entity_type: key, entity_id: id }) };
}

export async function createRecord(inst, key, input, audit = {}) {
  const e = entity(key);
  const values = await clean(inst, e.fields, input, { partial: false });
  if (key === 'opportunities') opportunityDefaults(values, null);
  if (key === 'projects') projectDefaults(values, null);
  if (values.owner_id === undefined && audit.userId) values.owner_id = audit.userId;
  const cols = Object.keys(values);
  const params = [inst, ...cols.map((c) => values[c])];
  const [row] = await q(
    `INSERT INTO ${e.table} (instance_id${cols.map((c) => `, ${c}`).join('')}) VALUES ($1${cols.map((_, i) => `, $${i + 2}`).join('')}) RETURNING id`,
    params,
  );
  return getRecord(inst, key, row.id, { related: false });
}

export async function updateRecord(inst, key, id, input, audit = {}) {
  const e = entity(key);
  const before = await getRecord(inst, key, id, { related: false });
  const values = await clean(inst, e.fields, input, { partial: true });
  if (key === 'opportunities') opportunityDefaults(values, before);
  const moved = key === 'projects' && Object.keys(values).length ? projectDefaults(values, before) : null;
  const cols = Object.keys(values);
  if (!cols.length) return before;
  await q(
    `UPDATE ${e.table} SET ${cols.map((c, i) => `${c} = $${i + 3}`).join(', ')}, updated_at = now() WHERE id = $1 AND instance_id = $2`,
    [id, inst, ...cols.map((c) => values[c])],
  );
  // Stage moves go on the project's timeline, so the lifecycle has a history.
  if (moved) await addActivity(inst, { entity_type: key, entity_id: id, type: 'note', subject: `Stage: ${moved.from} → ${moved.to}` }, audit);
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
    (SELECT name FROM crm_leads WHERE id = a.entity_id), (SELECT name FROM crm_opportunities WHERE id = a.entity_id),
    (SELECT name FROM crm_projects WHERE id = a.entity_id)) AS entity_name`;

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
      (SELECT count(*)::int FROM crm_opportunities WHERE instance_id = $1) AS opportunities,
      (SELECT count(*)::int FROM crm_projects WHERE instance_id = $1) AS projects`, [inst]);
  return {
    counts,
    projects: await projectSummary(inst),
    pipeline: OPPORTUNITY_STAGES.map((s) => ({ stage: s.id, label: s.label, count: 0, amount: 0, weighted: 0, ...pipeline.find((p) => p.stage === s.id) })),
    leads,
    open_tasks: await listActivities(inst, { open_tasks: true, limit: 20 }),
    recent_activity: await listActivities(inst, { limit: 20 }),
  };
}

// ── Project status reports ──────────────────────────────────────────────────

const REPORT_SELECT = `r.id, r.project_id, r.report_date::text AS report_date, r.health, r.stage, r.status, r.summary, r.accomplishments, r.next_steps, r.blockers,
  r.created_at, r.updated_at,
  COALESCE((SELECT COALESCE(NULLIF(u.name, ''), u.email) FROM crm_users u WHERE u.id = r.user_id), r.author_label) AS author`;
const shapeReport = (r) => ({ ...r, report_date: ymd(r.report_date) });

export async function listReports(inst, projectId, { limit = 100 } = {}) {
  const lim = Math.min(Math.max(parseInt(limit, 10) || 100, 1), 500);
  return (await q(`SELECT ${REPORT_SELECT} FROM crm_project_reports r WHERE r.instance_id = $1 AND r.project_id = $2
    ORDER BY r.report_date DESC, r.created_at DESC LIMIT ${lim}`, [inst, needId(projectId, 'project_id')])).map(shapeReport);
}

async function getReport(inst, id) {
  const [row] = await q(`SELECT ${REPORT_SELECT} FROM crm_project_reports r WHERE r.id = $1 AND r.instance_id = $2`, [needId(id), inst]);
  if (!row) throw new CrmError('Status report not found', 404);
  return shapeReport(row);
}

// After any report change, the project's health and due date follow its newest report.
async function syncProjectFromReports(inst, projectId) {
  const [latest] = await q(`SELECT report_date::text AS report_date, health FROM crm_project_reports
    WHERE instance_id = $1 AND project_id = $2 AND status = 'final' ORDER BY report_date DESC, created_at DESC LIMIT 1`, [inst, projectId]);
  if (!latest) { await q('UPDATE crm_projects SET last_report_at = NULL, updated_at = now() WHERE id = $1', [projectId]); return; }
  const [p] = await q('SELECT report_cadence FROM crm_projects WHERE id = $1', [projectId]);
  const next = addDays(latest.report_date, cadenceDays(p.report_cadence));
  await q(`UPDATE crm_projects SET health = $2, last_report_at = $3, next_report_date = COALESCE($4, next_report_date), updated_at = now()
    WHERE id = $1`, [projectId, latest.health, latest.report_date, next]);
}

export async function addReport(inst, input, audit = {}) {
  const project = await getRecord(inst, 'projects', needId(input.project_id, 'project_id'), { related: false });
  const values = await clean(inst, REPORT_FIELDS, { report_date: todayYmd(), ...input }, { partial: false });
  const [row] = await q(
    `INSERT INTO crm_project_reports (instance_id, project_id, report_date, health, stage, summary, accomplishments, next_steps, blockers, user_id, author_label, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id`,
    [inst, project.id, values.report_date, values.health, project.stage, values.summary, values.accomplishments ?? null,
      values.next_steps ?? null, values.blockers ?? null, audit.userId ?? null, audit.label ?? null, values.status || 'final'],
  );
  await syncProjectFromReports(inst, project.id);
  return getReport(inst, row.id);
}

export async function updateReport(inst, id, input) {
  const before = await getReport(inst, id);
  const values = await clean(inst, REPORT_FIELDS, input, { partial: true });
  const cols = Object.keys(values);
  if (cols.length) {
    await q(`UPDATE crm_project_reports SET ${cols.map((c, i) => `${c} = $${i + 3}`).join(', ')}, updated_at = now() WHERE id = $1 AND instance_id = $2`,
      [id, inst, ...cols.map((c) => values[c])]);
    await syncProjectFromReports(inst, before.project_id);
  }
  return getReport(inst, id);
}

export async function deleteReport(inst, id) {
  const [row] = await q('DELETE FROM crm_project_reports WHERE id = $1 AND instance_id = $2 RETURNING id, project_id', [needId(id), inst]);
  if (!row) throw new CrmError('Status report not found', 404);
  await syncProjectFromReports(inst, row.project_id);
  return { id: row.id };
}

// Open projects grouped for the overview: counts per lifecycle and health, and
// the projects whose status report is due (today or earlier).
async function projectSummary(inst) {
  const open = await q(`SELECT t.id, t.name, t.lifecycle, t.stage, t.health, t.next_report_date,
      (SELECT c.name FROM crm_companies c WHERE c.id = t.company_id) AS company_id_name
    FROM crm_projects t WHERE t.instance_id = $1 AND t.closed_at IS NULL ORDER BY t.next_report_date ASC NULLS LAST`, [inst]);
  const rows = open.map((r) => ({ ...r, next_report_date: ymd(r.next_report_date) }));
  const today = todayYmd();
  const parked = (r) => stageInfo(r.lifecycle, r.stage)?.side;
  return {
    agency_active: rows.filter((r) => r.lifecycle === 'agency' && !parked(r)).length,
    evergreen_active: rows.filter((r) => r.lifecycle === 'evergreen' && !parked(r)).length,
    parked: rows.filter(parked).length,
    at_risk: rows.filter((r) => r.health !== 'on_track' && !parked(r)),
    reports_due: rows.filter((r) => !parked(r) && r.next_report_date && r.next_report_date <= today),
  };
}

// ── Client card (logo + socials, for the project page and Claude) ─────────

async function clientCard(inst, companyId) {
  const [c] = await q(`SELECT id, name, website, domain, logo_url, ${SOCIAL_FIELDS.join(', ')}
    FROM crm_companies WHERE id = $1 AND instance_id = $2`, [companyId, inst]);
  return c || null;
}

// ── Billing ledger ──────────────────────────────────────────────────────────

const CHARGE_SELECT = `id, project_id, kind, description, amount, due_date::text AS due_date, period_start::text AS period_start, status,
  paid_at::text AS paid_at, method, created_at, updated_at`;
const shapeCharge = (c) => ({ ...c, amount: Number(c.amount), due_date: ymd(c.due_date), period_start: ymd(c.period_start), paid_at: ymd(c.paid_at) });

export async function listCharges(inst, projectId) {
  return (await q(`SELECT ${CHARGE_SELECT} FROM crm_project_charges WHERE instance_id = $1 AND project_id = $2
    ORDER BY COALESCE(due_date, period_start, created_at::date) DESC, created_at DESC`, [inst, needId(projectId, 'project_id')])).map(shapeCharge);
}

async function getCharge(inst, id) {
  const [row] = await q(`SELECT ${CHARGE_SELECT} FROM crm_project_charges WHERE id = $1 AND instance_id = $2`, [needId(id), inst]);
  if (!row) throw new CrmError('Charge not found', 404);
  return shapeCharge(row);
}

async function touchProject(id) { await q('UPDATE crm_projects SET updated_at = now() WHERE id = $1', [id]); }

export async function addCharge(inst, input) {
  const project = await getRecord(inst, 'projects', needId(input.project_id, 'project_id'), { related: false });
  const v = await clean(inst, CHARGE_FIELDS, input, { partial: false });
  if (v.status === 'paid' && !v.paid_at) v.paid_at = todayYmd();
  if (v.kind === 'credit' && v.amount > 0) v.amount = -v.amount;
  const cols = Object.keys(v);
  const [row] = await q(`INSERT INTO crm_project_charges (instance_id, project_id, ${cols.join(', ')})
    VALUES ($1, $2, ${cols.map((_, i) => `$${i + 3}`).join(', ')}) RETURNING id`, [inst, project.id, ...cols.map((c) => v[c])]);
  await touchProject(project.id);
  return getCharge(inst, row.id);
}

export async function updateCharge(inst, id, input) {
  const before = await getCharge(inst, id);
  const v = await clean(inst, CHARGE_FIELDS, input, { partial: true });
  if (v.status === 'paid' && !v.paid_at && !before.paid_at) v.paid_at = todayYmd();
  if (v.status && v.status !== 'paid' && !('paid_at' in input)) v.paid_at = null;
  const cols = Object.keys(v);
  if (cols.length) {
    await q(`UPDATE crm_project_charges SET ${cols.map((c, i) => `${c} = $${i + 3}`).join(', ')}, updated_at = now() WHERE id = $1 AND instance_id = $2`,
      [id, inst, ...cols.map((c) => v[c])]);
    await touchProject(before.project_id);
  }
  return getCharge(inst, id);
}

export async function deleteCharge(inst, id) {
  const [row] = await q('DELETE FROM crm_project_charges WHERE id = $1 AND instance_id = $2 RETURNING id, project_id', [needId(id), inst]);
  if (!row) throw new CrmError('Charge not found', 404);
  await touchProject(row.project_id);
  return { id: row.id };
}

const monthStart = (ymdStr) => `${ymdStr.slice(0, 7)}-01`;
function addMonths(ymdStr, n) {
  const [y, m] = ymdStr.split('-').map(Number);
  const d = new Date(Date.UTC(y, m - 1 + n, 1));
  return d.toISOString().slice(0, 10);
}

// Adds the next monthly fee: the month after the latest one billed, else the
// project's start month. Due on the billing day (default the 1st, max 28).
export async function addNextMonthlyCharge(inst, projectId) {
  const p = await getRecord(inst, 'projects', needId(projectId, 'project_id'), { related: false });
  if (!p.monthly_fee) throw new CrmError('Set the project’s monthly fee first');
  const [last] = await q(`SELECT period_start::text AS period_start FROM crm_project_charges
    WHERE instance_id = $1 AND project_id = $2 AND kind = 'monthly' AND status <> 'void' AND period_start IS NOT NULL
    ORDER BY period_start DESC LIMIT 1`, [inst, p.id]);
  const period = last ? addMonths(last.period_start, 1) : monthStart(p.start_date || todayYmd());
  const dayN = Math.min(Math.max(parseInt(p.billing_day, 10) || 1, 1), 28);
  const due = `${period.slice(0, 8)}${String(dayN).padStart(2, '0')}`;
  const label = new Date(`${period}T12:00:00Z`).toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });
  return addCharge(inst, { project_id: p.id, kind: 'monthly', description: `Monthly fee, ${label}`, amount: p.monthly_fee, period_start: period, due_date: due });
}

export async function billingSummary(inst, projectId) {
  const p = await getRecord(inst, 'projects', projectId, { related: false });
  const rows = (await listCharges(inst, projectId)).filter((c) => c.status !== 'void');
  const today = todayYmd();
  const sum = (xs) => Math.round(xs.reduce((n, c) => n + c.amount, 0) * 100) / 100;
  const due = rows.filter((c) => c.status === 'due');
  const setup = rows.find((c) => c.kind === 'setup');
  const upcoming = due.filter((c) => c.due_date).sort((a, b) => (a.due_date < b.due_date ? -1 : 1));
  const lastMonthly = rows.filter((c) => c.kind === 'monthly' && c.period_start).sort((a, b) => (a.period_start < b.period_start ? 1 : -1))[0];
  return {
    setup_fee: p.setup_fee ?? setup?.amount ?? null,
    setup_status: setup ? setup.status : p.setup_fee ? 'not_billed' : null,
    setup_paid_at: setup?.paid_at ?? null,
    monthly_fee: p.monthly_fee ?? null,
    paid_total: sum(rows.filter((c) => c.status === 'paid')),
    outstanding: sum(due),
    overdue: sum(due.filter((c) => c.due_date && c.due_date < today)),
    overdue_count: due.filter((c) => c.due_date && c.due_date < today).length,
    next_due: upcoming[0] || null,
    next_monthly_period: p.monthly_fee ? (lastMonthly ? addMonths(lastMonthly.period_start, 1) : monthStart(p.start_date || today)) : null,
  };
}

// ── Research sources (uploaded reports, kept as text) ─────────────────────

const MAX_SOURCE_CHARS = 1500000;
const SOURCE_META = `id, project_id, kind, title, filename, period_start::text AS period_start, period_end::text AS period_end, notes, content_chars,
  metrics, breakdown, created_at,
  COALESCE((SELECT COALESCE(NULLIF(u.name, ''), u.email) FROM crm_users u WHERE u.id = s.user_id), s.author_label) AS author`;
const shapeSource = (r) => ({ ...r, period_start: ymd(r.period_start), period_end: ymd(r.period_end) });

export async function listSources(inst, projectId) {
  return (await q(`SELECT ${SOURCE_META}, left(s.content, 600) AS preview FROM crm_project_sources s
    WHERE s.instance_id = $1 AND s.project_id = $2 ORDER BY COALESCE(s.period_end, s.created_at::date) DESC, s.created_at DESC`,
  [inst, needId(projectId, 'project_id')])).map(shapeSource);
}

// One source's text, in pages (offset/limit in characters) so large exports
// can be read through the MCP without blowing a context window.
export async function getSource(inst, id, { offset = 0, limit = 60000 } = {}) {
  const off = Math.max(parseInt(offset, 10) || 0, 0);
  const lim = Math.min(Math.max(parseInt(limit, 10) || 60000, 1000), 200000);
  const [row] = await q(`SELECT ${SOURCE_META}, substr(s.content, $3, $4) AS content FROM crm_project_sources s
    WHERE s.id = $1 AND s.instance_id = $2`, [needId(id), inst, off + 1, lim]);
  if (!row) throw new CrmError('Source not found', 404);
  const next = off + lim < row.content_chars ? off + lim : null;
  return { ...shapeSource(row), offset: off, next_offset: next };
}

// Confirmed key numbers and an optional top-rows table, validated and capped.
function cleanMetrics(input) {
  if (input === undefined) return undefined;
  if (!Array.isArray(input)) throw new CrmError('metrics must be a list');
  return input.slice(0, 24).map((m) => {
    const label = String(m?.label ?? '').trim().slice(0, 60);
    const value = Number(m?.value);
    if (!label) throw new CrmError('Each metric needs a label');
    if (!Number.isFinite(value)) throw new CrmError(`${label}: value must be a number`);
    return { label, value, unit: ['%', '$'].includes(m?.unit) ? m.unit : '' };
  });
}
function cleanBreakdown(input) {
  if (input === undefined) return undefined;
  if (!input) return null;
  const columns = (input.columns || []).slice(0, 5).map((c) => String(c).slice(0, 40));
  const rows = (input.rows || []).slice(0, 10).map((r) => (r || []).slice(0, 5).map((c) => String(c ?? '').slice(0, 60)));
  if (!columns.length || !rows.length) return null;
  return { title: String(input.title || '').slice(0, 80), columns, rows };
}

export async function updateSource(inst, id, input) {
  const [before] = await q('SELECT project_id FROM crm_project_sources WHERE id = $1 AND instance_id = $2', [needId(id), inst]);
  if (!before) throw new CrmError('Source not found', 404);
  const v = await clean(inst, SOURCE_FIELDS, input, { partial: true });
  const metrics = cleanMetrics(input.metrics);
  const breakdown = cleanBreakdown(input.breakdown);
  if (metrics !== undefined) v.metrics = JSON.stringify(metrics);
  if (breakdown !== undefined) v.breakdown = breakdown === null ? null : JSON.stringify(breakdown);
  const cols = Object.keys(v);
  if (cols.length) {
    await q(`UPDATE crm_project_sources SET ${cols.map((c, i) => `${c} = $${i + 3}${['metrics', 'breakdown'].includes(c) ? '::jsonb' : ''}`).join(', ')} WHERE id = $1 AND instance_id = $2`,
      [id, inst, ...cols.map((c) => v[c])]);
    await touchProject(before.project_id);
  }
  return (await listSources(inst, before.project_id)).find((x) => x.id === id);
}

export async function addSource(inst, input, audit = {}) {
  const project = await getRecord(inst, 'projects', needId(input.project_id, 'project_id'), { related: false });
  const v = await clean(inst, SOURCE_FIELDS, input, { partial: false });
  const content = typeof input.content === 'string' ? input.content.replace(/\u0000/g, '') : '';
  if (!content.trim()) throw new CrmError('The file had no readable text');
  if (content.length > MAX_SOURCE_CHARS) throw new CrmError(`That file is too large (${content.length.toLocaleString('en-US')} characters; limit ${MAX_SOURCE_CHARS.toLocaleString('en-US')}). Export a shorter date range or fewer columns.`);
  const metrics = cleanMetrics(input.metrics) || [];
  const breakdown = cleanBreakdown(input.breakdown) ?? null;
  const [row] = await q(`INSERT INTO crm_project_sources (instance_id, project_id, kind, title, filename, period_start, period_end, notes, content, content_chars, user_id, author_label, metrics, breakdown)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13::jsonb, $14::jsonb) RETURNING id`,
  [inst, project.id, v.kind, v.title, v.filename ?? null, v.period_start ?? null, v.period_end ?? null, v.notes ?? null,
    content, content.length, audit.userId ?? null, audit.label ?? null, JSON.stringify(metrics), breakdown ? JSON.stringify(breakdown) : null]);
  await touchProject(project.id);
  return (await listSources(inst, project.id)).find((x) => x.id === row.id);
}

export async function deleteSource(inst, id) {
  const [row] = await q('DELETE FROM crm_project_sources WHERE id = $1 AND instance_id = $2 RETURNING id, project_id', [needId(id), inst]);
  if (!row) throw new CrmError('Source not found', 404);
  await touchProject(row.project_id);
  return { id: row.id };
}
