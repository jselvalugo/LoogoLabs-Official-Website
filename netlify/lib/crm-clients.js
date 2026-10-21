import { randomBytes } from 'node:crypto';
import { db } from './crm.js';
import { CrmError, needId } from './crm-records.js';
import { approvalEmail, emailList, sendEmail } from './crm-email.js';

// Client retention & reporting: white-labeled performance dashboards, content
// approvals and campaign recaps. Team-side calls are scoped to the signed-in
// user's instance; client-side calls (byToken*) are scoped to a share token and
// only ever see that one client's data.

const q = (text, params = []) => db().sql.unsafe(text, params);
const shareToken = () => randomBytes(24).toString('base64url');

export const APPROVAL_STATUSES = ['pending', 'changes_requested', 'approved'];
export const APPROVAL_KINDS = ['video', 'draft', 'image', 'other'];

const str = (v, max = 500) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const orNull = (v, max) => str(v, max) || null;
const num = (v) => {
  if (v === '' || v === null || v === undefined) return 0;
  const n = Number(String(v).replace(/[$,\s]/g, ''));
  if (!Number.isFinite(n)) throw new CrmError('Numbers only in metric fields');
  return n;
};
const optNum = (v) => (v === '' || v === null || v === undefined ? null : num(v));
const date = (v) => {
  if (!v) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(v))) throw new CrmError('Dates must be YYYY-MM-DD');
  return String(v);
};
const url = (v) => {
  const s = str(v, 2000);
  if (!s) return null;
  if (!/^https?:\/\//i.test(s)) throw new CrmError('Links must start with http:// or https://');
  return s;
};
const color = (v) => (/^#[0-9a-f]{6}$/i.test(str(v)) ? str(v) : '#1A1A18');
const ymd = (d) => (d instanceof Date
  ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  : d);

const metricRow = (r) => ({
  id: r.id, period: ymd(r.period), channel: r.channel,
  spend: Number(r.spend), views: Number(r.views), engagement: Number(r.engagement), conversions: Number(r.conversions),
});
const commentRow = (r) => ({ ...r, timestamp_sec: r.timestamp_sec === null ? null : Number(r.timestamp_sec) });
const approvalRow = (r) => (r && { ...r, due_date: ymd(r.due_date), instance_id: undefined });
const recapRow = (r) => (r && { ...r, start_date: ymd(r.start_date), end_date: ymd(r.end_date), instance_id: undefined });
const portalRow = (r) => (r && { ...r, monthly_fee: r.monthly_fee === null ? null : Number(r.monthly_fee), instance_id: undefined });

async function company(inst, id) {
  needId(id, 'company_id');
  const [row] = await q('SELECT id, name FROM crm_companies WHERE id = $1 AND instance_id = $2', [id, inst]);
  if (!row) throw new CrmError('Client company not found in this workspace', 404);
  return row;
}

// A timeline entry on the client company, so approvals show up in the CRM.
async function logOnCompany(inst, companyId, subject, body, { userId = null, label = null } = {}) {
  await q(`INSERT INTO crm_activities (instance_id, entity_type, entity_id, type, subject, body, user_id, author_label)
    VALUES ($1, 'companies', $2, 'note', $3, $4, $5, $6)`, [inst, companyId, subject, body || null, userId, label]);
}

// ── Clients & dashboards (team side) ────────────────────────────────────────

export async function listClients(inst) {
  const rows = await q(`
    SELECT c.id AS company_id, c.name, c.type,
      p.id AS portal_id, p.display_name, p.brand_color, p.logo_url, p.monthly_fee, p.share_token, p.active,
      (SELECT max(period) FROM crm_client_metrics m WHERE m.company_id = c.id) AS last_period,
      (SELECT count(*)::int FROM crm_approvals a WHERE a.company_id = c.id AND a.status <> 'approved') AS open_approvals,
      (SELECT count(*)::int FROM crm_recaps r WHERE r.company_id = c.id) AS recaps
    FROM crm_companies c
    LEFT JOIN crm_client_portals p ON p.company_id = c.id
    WHERE c.instance_id = $1
    ORDER BY (p.id IS NULL), lower(c.name)`, [inst]);
  return rows.map((r) => ({ ...r, last_period: ymd(r.last_period), monthly_fee: r.monthly_fee === null ? null : Number(r.monthly_fee) }));
}

export async function getDashboard(inst, companyId) {
  const c = await company(inst, companyId);
  const [portal] = await q('SELECT * FROM crm_client_portals WHERE company_id = $1', [c.id]);
  const metrics = await q('SELECT * FROM crm_client_metrics WHERE company_id = $1 ORDER BY period DESC, channel', [c.id]);
  return { company: c, portal: portalRow(portal) || null, metrics: metrics.map(metricRow) };
}

export async function savePortal(inst, companyId, v) {
  const c = await company(inst, companyId);
  const vals = [
    orNull(v.display_name, 200), url(v.logo_url), color(v.brand_color), orNull(v.agency_name, 200),
    orNull(v.welcome, 2000), optNum(v.monthly_fee), v.active !== false,
  ];
  const [row] = await q(`
    INSERT INTO crm_client_portals (instance_id, company_id, display_name, logo_url, brand_color, agency_name, welcome, monthly_fee, active, share_token)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    ON CONFLICT (company_id) DO UPDATE SET display_name = $3, logo_url = $4, brand_color = $5, agency_name = $6,
      welcome = $7, monthly_fee = $8, active = $9, updated_at = now()
    RETURNING *`, [inst, c.id, ...vals, shareToken()]);
  return portalRow(row);
}

// Issues a new link; the old one stops working at once.
export async function rotatePortalLink(inst, companyId) {
  const c = await company(inst, companyId);
  const [row] = await q('UPDATE crm_client_portals SET share_token = $2, updated_at = now() WHERE company_id = $1 RETURNING *', [c.id, shareToken()]);
  if (!row) throw new CrmError('Set up the dashboard first', 404);
  return portalRow(row);
}

export async function saveMetric(inst, companyId, v) {
  const c = await company(inst, companyId);
  const period = date(v.period);
  if (!period) throw new CrmError('Period is required');
  const vals = [period, str(v.channel, 80) || 'All channels', num(v.spend), num(v.views), num(v.engagement), num(v.conversions)];
  if (v.id) {
    needId(v.id);
    const [row] = await q(`UPDATE crm_client_metrics SET period = $3, channel = $4, spend = $5, views = $6, engagement = $7, conversions = $8
      WHERE id = $1 AND instance_id = $2 RETURNING *`, [v.id, inst, ...vals]);
    if (!row) throw new CrmError('Metric row not found', 404);
    return metricRow(row);
  }
  const [row] = await q(`INSERT INTO crm_client_metrics (instance_id, company_id, period, channel, spend, views, engagement, conversions)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`, [inst, c.id, ...vals]);
  return metricRow(row);
}

export async function deleteMetric(inst, id) {
  needId(id);
  await q('DELETE FROM crm_client_metrics WHERE id = $1 AND instance_id = $2', [id, inst]);
  return { ok: true };
}

// ── Content approvals (team side) ───────────────────────────────────────────

export async function listApprovals(inst, { company_id, status } = {}) {
  const params = [inst];
  let where = 'a.instance_id = $1';
  if (company_id) { params.push(needId(company_id, 'company_id')); where += ` AND a.company_id = $${params.length}`; }
  if (status === 'open') where += " AND a.status <> 'approved'";
  else if (APPROVAL_STATUSES.includes(status)) { params.push(status); where += ` AND a.status = $${params.length}`; }
  const rows = await q(`
    SELECT a.*, c.name AS company_name,
      (SELECT count(*)::int FROM crm_approval_comments k WHERE k.approval_id = a.id AND NOT k.resolved AND k.from_client) AS open_comments
    FROM crm_approvals a JOIN crm_companies c ON c.id = a.company_id
    WHERE ${where} ORDER BY a.updated_at DESC LIMIT 500`, params);
  return rows.map(approvalRow);
}

async function approvalFor(inst, id) {
  needId(id);
  const [row] = await q('SELECT a.*, c.name AS company_name FROM crm_approvals a JOIN crm_companies c ON c.id = a.company_id WHERE a.id = $1 AND a.instance_id = $2', [id, inst]);
  if (!row) throw new CrmError('Approval not found', 404);
  return row;
}

const commentsFor = async (id) => (await q('SELECT * FROM crm_approval_comments WHERE approval_id = $1 ORDER BY created_at', [id])).map(commentRow);

export async function getApproval(inst, id) {
  const a = await approvalFor(inst, id);
  const [portal] = await q('SELECT share_token, active FROM crm_client_portals WHERE company_id = $1', [a.company_id]);
  return { ...approvalRow(a), comments: await commentsFor(a.id), portal_token: portal?.active ? portal.share_token : null };
}

export async function saveApproval(inst, v, { userId }) {
  const title = str(v.title, 200);
  if (!title) throw new CrmError('Title is required');
  const kind = APPROVAL_KINDS.includes(v.kind) ? v.kind : 'video';
  const vals = [title, kind, url(v.media_url), orNull(v.body, 20000), date(v.due_date)];
  if (v.id) {
    const a = await approvalFor(inst, v.id);
    const [row] = await q(`UPDATE crm_approvals SET title = $2, kind = $3, media_url = $4, body = $5, due_date = $6, updated_at = now()
      WHERE id = $1 RETURNING *`, [a.id, ...vals]);
    return approvalRow(row);
  }
  const c = await company(inst, v.company_id);
  const [row] = await q(`INSERT INTO crm_approvals (instance_id, company_id, title, kind, media_url, body, due_date, created_by)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`, [inst, c.id, ...vals, userId]);
  await logOnCompany(inst, c.id, `Sent for approval: ${title}`, null, { userId });
  return approvalRow(row);
}

// A new cut or draft: bumps the version and puts it back in front of the client.
export async function newApprovalVersion(inst, id, v, { userId }) {
  const a = await approvalFor(inst, id);
  const [row] = await q(`UPDATE crm_approvals SET version = version + 1, status = 'pending', decided_at = NULL, decided_by = NULL,
      media_url = COALESCE($2, media_url), body = COALESCE($3, body), updated_at = now()
    WHERE id = $1 RETURNING *`, [a.id, url(v.media_url), orNull(v.body, 20000)]);
  await logOnCompany(inst, a.company_id, `New version (v${row.version}) sent for approval: ${a.title}`, null, { userId });
  return approvalRow(row);
}

export async function deleteApproval(inst, id) {
  const a = await approvalFor(inst, id);
  await q('DELETE FROM crm_approvals WHERE id = $1', [a.id]);
  return { ok: true };
}

function commentValues(a, v) {
  const body = str(v.body, 4000);
  if (!body) throw new CrmError('Comment is empty');
  const ts = optNum(v.timestamp_sec);
  if (ts !== null && ts < 0) throw new CrmError('Timestamp must be positive');
  return { body, ts, version: a.version };
}

export async function teamComment(inst, id, v, me) {
  const a = await approvalFor(inst, id);
  const { body, ts, version } = commentValues(a, v);
  const [row] = await q(`INSERT INTO crm_approval_comments (approval_id, version, author, from_client, timestamp_sec, body)
    VALUES ($1, $2, $3, false, $4, $5) RETURNING *`, [a.id, version, me.name || me.email, ts, body]);
  await q('UPDATE crm_approvals SET updated_at = now() WHERE id = $1', [a.id]);
  return commentRow(row);
}

export async function resolveComment(inst, commentId, resolved) {
  needId(commentId);
  const [row] = await q(`UPDATE crm_approval_comments k SET resolved = $3 FROM crm_approvals a
    WHERE k.id = $1 AND a.id = k.approval_id AND a.instance_id = $2 RETURNING k.*`, [commentId, inst, !!resolved]);
  if (!row) throw new CrmError('Comment not found', 404);
  return commentRow(row);
}

export async function deleteComment(inst, commentId) {
  needId(commentId);
  await q('DELETE FROM crm_approval_comments k USING crm_approvals a WHERE k.id = $1 AND a.id = k.approval_id AND a.instance_id = $2', [commentId, inst]);
  return { ok: true };
}

// ── Campaign recaps (team side) ─────────────────────────────────────────────

const cleanList = (list, keys, max = 30) => (Array.isArray(list) ? list : []).slice(0, max)
  .map((it) => Object.fromEntries(keys.map(([k, len]) => [k, str(it?.[k], len)])))
  .filter((it) => Object.values(it).some(Boolean));

export async function listRecaps(inst, { company_id } = {}) {
  const params = [inst];
  let where = 'r.instance_id = $1';
  if (company_id) { params.push(needId(company_id, 'company_id')); where += ' AND r.company_id = $2'; }
  const rows = await q(`SELECT r.*, c.name AS company_name FROM crm_recaps r JOIN crm_companies c ON c.id = r.company_id
    WHERE ${where} ORDER BY COALESCE(r.end_date, r.created_at::date) DESC, r.created_at DESC LIMIT 500`, params);
  return rows.map(recapRow);
}

export async function saveRecap(inst, v, { userId }) {
  const title = str(v.title, 200);
  if (!title) throw new CrmError('Title is required');
  const highlights = cleanList(v.highlights, [['title', 200], ['body', 4000], ['image_url', 2000]]);
  for (const h of highlights) if (h.image_url) url(h.image_url);
  const vals = [
    title, date(v.start_date), date(v.end_date), orNull(v.summary, 20000),
    JSON.stringify(cleanList(v.metrics, [['label', 80], ['value', 80], ['note', 200]])),
    JSON.stringify(highlights), orNull(v.next_steps, 10000), !!v.published,
  ];
  if (v.id) {
    needId(v.id);
    const [row] = await q(`UPDATE crm_recaps SET title = $3, start_date = $4, end_date = $5, summary = $6, metrics = $7::jsonb,
        highlights = $8::jsonb, next_steps = $9, published = $10, updated_at = now()
      WHERE id = $1 AND instance_id = $2 RETURNING *`, [v.id, inst, ...vals]);
    if (!row) throw new CrmError('Recap not found', 404);
    return recapRow(row);
  }
  const c = await company(inst, v.company_id);
  const [row] = await q(`INSERT INTO crm_recaps (instance_id, company_id, title, start_date, end_date, summary, metrics, highlights, next_steps, published, share_token)
    VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8::jsonb, $9, $10, $11) RETURNING *`, [inst, c.id, ...vals, shareToken()]);
  await logOnCompany(inst, c.id, `Campaign recap created: ${title}`, null, { userId });
  return recapRow(row);
}

export async function deleteRecap(inst, id) {
  needId(id);
  await q('DELETE FROM crm_recaps WHERE id = $1 AND instance_id = $2', [id, inst]);
  return { ok: true };
}

// Totals for a date range, to prefill a recap from the dashboard numbers.
export async function metricTotals(inst, companyId, from, to) {
  const c = await company(inst, companyId);
  const [row] = await q(`SELECT COALESCE(sum(spend),0) AS spend, COALESCE(sum(views),0) AS views,
      COALESCE(sum(engagement),0) AS engagement, COALESCE(sum(conversions),0) AS conversions
    FROM crm_client_metrics WHERE company_id = $1 AND ($2::date IS NULL OR period >= $2) AND ($3::date IS NULL OR period <= $3)`,
  [c.id, date(from), date(to)]);
  return Object.fromEntries(Object.entries(row).map(([k, val]) => [k, Number(val)]));
}

// ── Client side (share tokens, no sign-in) ──────────────────────────────────

const TOKEN = /^[A-Za-z0-9_-]{20,80}$/;
const brandOf = (p, companyName) => ({
  name: p?.display_name || companyName, logo_url: p?.logo_url || null,
  brand_color: p?.brand_color || '#1A1A18', agency_name: p?.agency_name || null, welcome: p?.welcome || null,
});

async function portalByToken(token) {
  if (!TOKEN.test(String(token || ''))) throw new CrmError('This link is not valid', 404);
  const [p] = await q(`SELECT p.*, c.name AS company_name FROM crm_client_portals p
    JOIN crm_companies c ON c.id = p.company_id JOIN crm_instances i ON i.id = p.instance_id
    WHERE p.share_token = $1 AND p.active AND i.status = 'active'`, [token]);
  if (!p) throw new CrmError('This link is no longer active', 404);
  return p;
}

const publicApproval = (a) => ({
  id: a.id, title: a.title, kind: a.kind, media_url: a.media_url, body: a.body, version: a.version,
  status: a.status, due_date: ymd(a.due_date), decided_at: a.decided_at, decided_by: a.decided_by, updated_at: a.updated_at,
});
const publicComment = (k) => ({
  id: k.id, version: k.version, author: k.author, from_client: k.from_client,
  timestamp_sec: k.timestamp_sec === null ? null : Number(k.timestamp_sec), body: k.body, resolved: k.resolved, created_at: k.created_at,
});

export async function portalView(token) {
  const p = await portalByToken(token);
  const metrics = await q('SELECT * FROM crm_client_metrics WHERE company_id = $1 ORDER BY period, channel', [p.company_id]);
  const approvals = await q('SELECT * FROM crm_approvals WHERE company_id = $1 ORDER BY (status = \'approved\'), updated_at DESC', [p.company_id]);
  const recaps = await q(`SELECT title, start_date, end_date, share_token FROM crm_recaps
    WHERE company_id = $1 AND published ORDER BY COALESCE(end_date, created_at::date) DESC`, [p.company_id]);
  return {
    brand: brandOf(p, p.company_name),
    metrics: metrics.map(metricRow).map(({ id, ...m }) => m),
    approvals: approvals.map(publicApproval),
    recaps: recaps.map((r) => ({ ...r, start_date: ymd(r.start_date), end_date: ymd(r.end_date) })),
  };
}

async function approvalByToken(token, id) {
  const p = await portalByToken(token);
  needId(id);
  const [a] = await q('SELECT * FROM crm_approvals WHERE id = $1 AND company_id = $2', [id, p.company_id]);
  if (!a) throw new CrmError('Item not found', 404);
  return { p, a };
}

export async function clientApproval(token, id) {
  const { a } = await approvalByToken(token, id);
  return { ...publicApproval(a), comments: (await commentsFor(a.id)).map(publicComment) };
}

const clientName = (v) => {
  const name = str(v.author, 120);
  if (!name) throw new CrmError('Please add your name');
  return name;
};

export async function clientComment(token, id, v) {
  const { p, a } = await approvalByToken(token, id);
  const author = clientName(v);
  const { body, ts, version } = commentValues(a, v);
  const [row] = await q(`INSERT INTO crm_approval_comments (approval_id, version, author, from_client, timestamp_sec, body)
    VALUES ($1, $2, $3, true, $4, $5) RETURNING *`, [a.id, version, author, ts, body]);
  await q('UPDATE crm_approvals SET updated_at = now() WHERE id = $1', [a.id]);
  await logOnCompany(p.instance_id, p.company_id, `Client comment on ${a.title}`, `${author}: ${body}`, { label: `${author} (client portal)` });
  return publicComment(row);
}

export async function clientDecision(token, id, v) {
  const { p, a } = await approvalByToken(token, id);
  const author = clientName(v);
  const decision = v.decision === 'approved' ? 'approved' : v.decision === 'changes_requested' ? 'changes_requested' : null;
  if (!decision) throw new CrmError('Unknown decision');
  const note = str(v.note, 4000);
  if (decision === 'changes_requested' && !note) throw new CrmError('Tell us what to change');
  const [row] = await q(`UPDATE crm_approvals SET status = $2, decided_at = now(), decided_by = $3, updated_at = now()
    WHERE id = $1 RETURNING *`, [a.id, decision, author]);
  if (note) {
    await q(`INSERT INTO crm_approval_comments (approval_id, version, author, from_client, body) VALUES ($1, $2, $3, true, $4)`,
      [a.id, a.version, author, `${decision === 'approved' ? 'Approved' : 'Changes requested'}: ${note}`]);
  }
  await logOnCompany(p.instance_id, p.company_id,
    `${decision === 'approved' ? 'Client approved' : 'Client requested changes on'} ${a.title} (v${a.version})`,
    note || null, { label: `${author} (client portal)` });
  return publicApproval(row);
}

export async function recapView(token) {
  if (!TOKEN.test(String(token || ''))) throw new CrmError('This link is not valid', 404);
  const [r] = await q(`SELECT r.*, c.name AS company_name FROM crm_recaps r
    JOIN crm_companies c ON c.id = r.company_id JOIN crm_instances i ON i.id = r.instance_id
    WHERE r.share_token = $1 AND r.published AND i.status = 'active'`, [token]);
  if (!r) throw new CrmError('This recap is not available', 404);
  const [p] = await q('SELECT * FROM crm_client_portals WHERE company_id = $1', [r.company_id]);
  return {
    brand: brandOf(p, r.company_name),
    title: r.title, start_date: ymd(r.start_date), end_date: ymd(r.end_date), summary: r.summary,
    metrics: r.metrics, highlights: r.highlights, next_steps: r.next_steps, updated_at: r.updated_at,
  };
}

// ── Approval request emails (Resend) ────────────────────────────────────────

const LINK_BASE = /^(https:\/\/(www\.|crm\.)?loogolabs\.com(\/crm)?|http:\/\/localhost:\d+(\/crm)?)$/;

// The branded email for an approval, plus suggested recipients (the client
// company's contacts). send: true actually sends it and logs it on the company.
export async function approvalEmailFor(inst, id, v, me, { send = false } = {}) {
  const a = await approvalFor(inst, id);
  const [portal] = await q('SELECT share_token, active, display_name FROM crm_client_portals WHERE company_id = $1', [a.company_id]);
  if (!portal?.active) throw new CrmError("This client has no live portal link yet. Open Dashboards, set up this client and save, then come back to send");
  const base = str(v.link_base, 200).replace(/\/$/, '');
  if (!LINK_BASE.test(base)) throw new CrmError('Invalid link base');
  const link = `${base}/portal/${portal.share_token}?item=${a.id}`;
  const email = approvalEmail({
    clientName: portal.display_name || a.company_name, title: a.title, kind: a.kind, version: a.version,
    dueDate: ymd(a.due_date), note: str(v.note, 2000), link, senderName: me.name || null,
  });
  const contacts = await q(`SELECT name, email FROM crm_contacts WHERE company_id = $1 AND instance_id = $2 AND email IS NOT NULL AND email <> '' ORDER BY name`, [a.company_id, inst]);
  if (!send) return { ...email, link, contacts };

  const to = emailList(v.to);
  if (!to.length) throw new CrmError('Add at least one recipient');
  const cc = emailList(v.cc);
  const messageId = await sendEmail({ to, cc, subject: email.subject, html: email.html, text: email.text, replyTo: me.email });
  await q(`INSERT INTO crm_activities (instance_id, entity_type, entity_id, type, subject, body, user_id)
    VALUES ($1, 'companies', $2, 'email', $3, $4, $5)`,
  [inst, a.company_id, email.subject, `Approval request sent to ${[...to, ...cc].join(', ')}${v.note ? `\n\n${str(v.note, 2000)}` : ''}`, me.id]);
  return { ok: true, id: messageId, to, cc };
}
