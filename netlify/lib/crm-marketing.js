import { randomBytes } from 'node:crypto';
import { db } from './crm.js';
import { CrmError, needId } from './crm-records.js';

// Email marketing through Resend: a subscriber list kept apart from business
// contacts, one-off campaigns, and automations (drip sequences). Nothing here
// sends directly except test emails — campaigns and sequence steps go into
// crm_email_sends, which the scheduled email-worker function drains within the
// daily cap. That cap is what keeps this on Resend's free plan (100/day).
//
// Env: RESEND_API_KEY, RESEND_MARKETING_FROM (falls back to RESEND_FROM),
// EMAIL_POSTAL_ADDRESS (required by CAN-SPAM in every marketing email),
// EMAIL_DAILY_LIMIT (default 100).

const q = (text, params = []) => db().sql.unsafe(text, params);
const SITE = 'https://www.loogolabs.com';
const LOGO = `${SITE}/email-logo.png`;
const GREEN = '#2D3B1F';
const INK = '#1F2017';
const CREAM = '#F6F2E8';
const MUTED = '#6B6A5E';
const LINE = '#E3DDCD';
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const dailyLimit = () => Math.max(0, Number(process.env.EMAIL_DAILY_LIMIT) || 100);
const fromAddress = () => process.env.RESEND_MARKETING_FROM || process.env.RESEND_FROM;

// What still has to be set in Netlify before anything can go out.
export function setupProblems() {
  const missing = [];
  if (!process.env.RESEND_API_KEY) missing.push('RESEND_API_KEY');
  if (!fromAddress()) missing.push('RESEND_MARKETING_FROM (or RESEND_FROM)');
  if (!process.env.EMAIL_POSTAL_ADDRESS) missing.push('EMAIL_POSTAL_ADDRESS');
  return missing;
}
function needSetup() {
  const missing = setupProblems();
  if (missing.length) throw new CrmError(`Email marketing is not set up yet: add ${missing.join(', ')} in Netlify`, 503);
}

const str = (v, max = 500) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const orNull = (v, max) => str(v, max) || null;
const token = () => randomBytes(24).toString('base64url');
const tag = (v) => str(v, 60).toLowerCase().replace(/\s+/g, '-') || null;
const tagList = (v) => [...new Set((Array.isArray(v) ? v : String(v || '').split(','))
  .map((x) => tag(String(x))).filter(Boolean))].slice(0, 30);
function emailAddress(v) {
  const e = str(v, 320).toLowerCase();
  if (!EMAIL.test(e)) throw new CrmError(`Not an email address: ${e || '(blank)'}`);
  return e;
}

// ── Subscribers ─────────────────────────────────────────────────────────────

export async function overview(inst) {
  const [counts] = await q(`SELECT
      count(*) FILTER (WHERE status = 'subscribed')::int AS subscribed,
      count(*) FILTER (WHERE status <> 'subscribed')::int AS unsubscribed
    FROM crm_email_subscribers WHERE instance_id = $1`, [inst]);
  // The cap is per Resend account, so it counts every instance's sends.
  const [sent] = await q(`SELECT count(*)::int AS n FROM crm_email_sends WHERE status = 'sent' AND sent_at > now() - interval '24 hours'`);
  const [queued] = await q(`SELECT count(*)::int AS n FROM crm_email_sends WHERE instance_id = $1 AND status IN ('queued', 'sending')`, [inst]);
  const tags = await q(`SELECT t AS tag, count(*)::int AS n FROM crm_email_subscribers, unnest(tags) t
    WHERE instance_id = $1 AND status = 'subscribed' GROUP BY t ORDER BY t`, [inst]);
  return { ...counts, sent_24h: sent.n, queued: queued.n, daily_limit: dailyLimit(), tags, setup: setupProblems() };
}

export async function listSubscribers(inst, { search, tag: t, status } = {}) {
  const where = ['instance_id = $1'];
  const params = [inst];
  if (str(search)) { params.push(`%${str(search)}%`); where.push(`(email ILIKE $${params.length} OR name ILIKE $${params.length})`); }
  if (tag(t)) { params.push(tag(t)); where.push(`$${params.length} = ANY(tags)`); }
  if (status === 'subscribed' || status === 'unsubscribed') { params.push(status); where.push(`status = $${params.length}`); }
  return q(`SELECT id, email, name, tags, status, source, unsubscribed_at, created_at FROM crm_email_subscribers
    WHERE ${where.join(' AND ')} ORDER BY created_at DESC LIMIT 500`, params);
}

// Adds or updates one subscriber (matched by email) and enrolls them in any
// active automation their tags now match. Re-adding someone who unsubscribed
// does not resubscribe them unless `resubscribe` is set, so an import can never
// undo an opt-out.
export async function upsertSubscriber(inst, values, { resubscribe = false } = {}) {
  const email = emailAddress(values.email);
  const tags = tagList(values.tags);
  const [row] = await q(`
    INSERT INTO crm_email_subscribers (instance_id, email, name, tags, source, unsubscribe_token)
    VALUES ($1, $2, $3, $4, $5, $6)
    ON CONFLICT (instance_id, email) DO UPDATE SET
      name = coalesce(EXCLUDED.name, crm_email_subscribers.name),
      tags = ARRAY(SELECT DISTINCT unnest(crm_email_subscribers.tags || EXCLUDED.tags)),
      status = CASE WHEN $7 THEN 'subscribed' ELSE crm_email_subscribers.status END,
      unsubscribed_at = CASE WHEN $7 THEN NULL ELSE crm_email_subscribers.unsubscribed_at END,
      updated_at = now()
    RETURNING id, email, name, tags, status, source, created_at`,
  [inst, email, orNull(values.name, 200), tags, orNull(values.source, 60) || 'manual', token(), resubscribe]);
  await enroll(inst, row);
  return row;
}

export async function saveSubscriber(inst, values) {
  if (!values.id) return upsertSubscriber(inst, values, { resubscribe: true });
  needId(values.id);
  const status = values.status === 'unsubscribed' ? 'unsubscribed' : 'subscribed';
  const [row] = await q(`UPDATE crm_email_subscribers SET name = $3, tags = $4, status = $5,
      unsubscribed_at = CASE WHEN $5 = 'unsubscribed' THEN coalesce(unsubscribed_at, now()) ELSE NULL END, updated_at = now()
    WHERE id = $1 AND instance_id = $2 RETURNING id, email, name, tags, status, source, created_at`,
  [values.id, inst, orNull(values.name, 200), tagList(values.tags), status]);
  if (!row) throw new CrmError('Subscriber not found', 404);
  if (status === 'unsubscribed') await stopSubscriber(row.id);
  else await enroll(inst, row);
  return row;
}

export async function deleteSubscriber(inst, id) {
  needId(id);
  await q('DELETE FROM crm_email_subscribers WHERE id = $1 AND instance_id = $2', [id, inst]);
  return { ok: true };
}

// Pasted CSV or one address per line: "email" or "email, name". Header rows and
// blank lines are skipped; bad addresses are reported back, not fatal.
export async function importSubscribers(inst, { text: raw, tags }) {
  const lines = String(raw || '').split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (lines.length > 2000) throw new CrmError('Up to 2,000 rows per import');
  let added = 0;
  const skipped = [];
  for (const line of lines) {
    const [first, ...rest] = line.split(/[,;\t]/).map((x) => x.trim().replace(/^"|"$/g, ''));
    if (/^e-?mail$/i.test(first)) continue;
    if (!EMAIL.test(first.toLowerCase())) { skipped.push(first); continue; }
    await upsertSubscriber(inst, { email: first, name: rest.join(' ').trim(), tags, source: 'import' });
    added += 1;
  }
  return { added, skipped: skipped.slice(0, 50), skipped_count: skipped.length };
}

// Public sign-up (website forms), into the instance that receives website leads.
export async function publicSubscribe({ email, name, tag: t, source }) {
  const [inst] = await q(`SELECT id FROM crm_instances WHERE receives_website_leads AND status = 'active'`);
  if (!inst) throw new CrmError('Sign-ups are closed', 503);
  await upsertSubscriber(inst.id, { email, name, tags: t ? [t] : [], source: source || 'website' }, { resubscribe: true });
  return { ok: true };
}

export async function unsubscribe(unsubToken) {
  if (typeof unsubToken !== 'string' || unsubToken.length < 20) return null;
  const [row] = await q(`UPDATE crm_email_subscribers SET status = 'unsubscribed', unsubscribed_at = coalesce(unsubscribed_at, now()), updated_at = now()
    WHERE unsubscribe_token = $1 RETURNING id, email`, [unsubToken]);
  if (row) await stopSubscriber(row.id);
  return row || null;
}

async function stopSubscriber(id) {
  await q(`UPDATE crm_email_enrollments SET status = 'stopped' WHERE subscriber_id = $1 AND status = 'active'`, [id]);
  await q(`UPDATE crm_email_sends SET status = 'skipped', error = 'Unsubscribed' WHERE subscriber_id = $1 AND status = 'queued'`, [id]);
}

// ── Automations ─────────────────────────────────────────────────────────────

const stepDelay = (steps, i) => Math.max(0, Number(steps[i]?.delay_days) || 0);

// Puts a subscribed person into every active sequence they match and are not
// already in. The first email is due after the first step's delay.
async function enroll(inst, sub) {
  if (sub.status !== 'subscribed') return;
  await q(`INSERT INTO crm_email_enrollments (sequence_id, subscriber_id, next_at)
    SELECT s.id, $2, now() + make_interval(days => coalesce((s.steps->0->>'delay_days')::int, 0))
    FROM crm_email_sequences s
    WHERE s.instance_id = $1 AND s.active AND jsonb_array_length(s.steps) > 0
      AND (s.trigger_tag IS NULL OR s.trigger_tag = ANY($3::text[]))
    ON CONFLICT (sequence_id, subscriber_id) DO NOTHING`, [inst, sub.id, sub.tags || []]);
}

export async function listSequences(inst) {
  return q(`SELECT s.*,
      (SELECT count(*)::int FROM crm_email_enrollments e WHERE e.sequence_id = s.id AND e.status = 'active') AS in_progress,
      (SELECT count(*)::int FROM crm_email_enrollments e WHERE e.sequence_id = s.id AND e.status = 'done') AS finished,
      (SELECT count(*)::int FROM crm_email_sends x WHERE x.sequence_id = s.id AND x.status = 'sent') AS sent
    FROM crm_email_sequences s WHERE s.instance_id = $1 ORDER BY s.created_at`, [inst]);
}

function cleanSteps(steps) {
  if (!Array.isArray(steps)) return [];
  if (steps.length > 20) throw new CrmError('Up to 20 emails per automation');
  return steps.map((s, i) => {
    const days = Number(s.delay_days);
    if (!Number.isInteger(days) || days < 0 || days > 365) throw new CrmError(`Email ${i + 1}: wait must be 0–365 whole days`);
    const subject = str(s.subject, 200);
    const body = str(s.body, 20000);
    if (!subject || !body) throw new CrmError(`Email ${i + 1} needs a subject and a message`);
    return { delay_days: days, subject, preheader: str(s.preheader, 200), body };
  });
}

// `enroll_existing` also enrolls everyone already on the list who matches —
// otherwise only people subscribed or tagged from now on get the sequence.
export async function saveSequence(inst, values) {
  const name = str(values.name, 200);
  if (!name) throw new CrmError('Give the automation a name');
  const steps = cleanSteps(values.steps);
  const active = !!values.active;
  if (active && !steps.length) throw new CrmError('Add at least one email before turning it on');
  const params = [inst, name, tag(values.trigger_tag), JSON.stringify(steps), active];
  let row;
  if (values.id) {
    needId(values.id);
    [row] = await q(`UPDATE crm_email_sequences SET name = $2, trigger_tag = $3, steps = $4::jsonb, active = $5, updated_at = now()
      WHERE id = $6 AND instance_id = $1 RETURNING *`, [...params, values.id]);
    if (!row) throw new CrmError('Automation not found', 404);
    // People past the new last step are finished.
    await q(`UPDATE crm_email_enrollments SET status = 'done' WHERE sequence_id = $1 AND status = 'active' AND step >= $2`, [row.id, steps.length]);
  } else {
    [row] = await q(`INSERT INTO crm_email_sequences (instance_id, name, trigger_tag, steps, active)
      VALUES ($1, $2, $3, $4::jsonb, $5) RETURNING *`, params);
  }
  if (active && values.enroll_existing) {
    await q(`INSERT INTO crm_email_enrollments (sequence_id, subscriber_id, next_at)
      SELECT $1, sub.id, now() + make_interval(days => $3::int) FROM crm_email_subscribers sub
      WHERE sub.instance_id = $2 AND sub.status = 'subscribed' AND ($4::text IS NULL OR $4 = ANY(sub.tags))
      ON CONFLICT (sequence_id, subscriber_id) DO NOTHING`, [row.id, inst, stepDelay(steps, 0), row.trigger_tag]);
  }
  return row;
}

export async function deleteSequence(inst, id) {
  needId(id);
  await q('DELETE FROM crm_email_sequences WHERE id = $1 AND instance_id = $2', [id, inst]);
  return { ok: true };
}

// ── Campaigns ───────────────────────────────────────────────────────────────

export async function listCampaigns(inst) {
  return q(`SELECT c.*,
      (SELECT count(*)::int FROM crm_email_sends x WHERE x.campaign_id = c.id AND x.status = 'sent') AS sent,
      (SELECT count(*)::int FROM crm_email_sends x WHERE x.campaign_id = c.id AND x.status = 'failed') AS failed,
      (SELECT count(*)::int FROM crm_email_sends x WHERE x.campaign_id = c.id AND x.status IN ('queued', 'sending')) AS waiting
    FROM crm_email_campaigns c WHERE c.instance_id = $1 ORDER BY c.updated_at DESC`, [inst]);
}

export async function saveCampaign(inst, values, { userId } = {}) {
  const name = str(values.name, 200);
  if (!name) throw new CrmError('Give the campaign a name');
  const params = [inst, name, str(values.subject, 200), orNull(values.preheader, 200), str(values.body, 20000), tag(values.audience_tag)];
  if (!values.id) {
    const [row] = await q(`INSERT INTO crm_email_campaigns (instance_id, name, subject, preheader, body, audience_tag, created_by)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`, [...params, userId || null]);
    return row;
  }
  needId(values.id);
  const [row] = await q(`UPDATE crm_email_campaigns SET name = $2, subject = $3, preheader = $4, body = $5, audience_tag = $6, updated_at = now()
    WHERE id = $7 AND instance_id = $1 AND status = 'draft' RETURNING *`, [...params, values.id]);
  if (!row) throw new CrmError('Only draft campaigns can be edited', 409);
  return row;
}

export async function deleteCampaign(inst, id) {
  needId(id);
  await q('DELETE FROM crm_email_campaigns WHERE id = $1 AND instance_id = $2', [id, inst]);
  return { ok: true };
}

async function draftCampaign(inst, id) {
  needId(id);
  const [c] = await q('SELECT * FROM crm_email_campaigns WHERE id = $1 AND instance_id = $2', [id, inst]);
  if (!c) throw new CrmError('Campaign not found', 404);
  if (!c.subject || !c.body) throw new CrmError('Add a subject and a message first');
  return c;
}

// How many people a send would reach right now.
export async function campaignAudience(inst, audienceTag) {
  const [r] = await q(`SELECT count(*)::int AS n FROM crm_email_subscribers
    WHERE instance_id = $1 AND status = 'subscribed' AND ($2::text IS NULL OR $2 = ANY(tags))`, [inst, tag(audienceTag)]);
  return { recipients: r.n };
}

// Queues the campaign for every matching subscriber; email-worker sends it.
export async function sendCampaign(inst, id) {
  needSetup();
  const c = await draftCampaign(inst, id);
  if (c.status !== 'draft') throw new CrmError('This campaign was already sent', 409);
  const [{ n }] = await q(`WITH queued AS (
      INSERT INTO crm_email_sends (instance_id, subscriber_id, campaign_id)
      SELECT $1, id, $2 FROM crm_email_subscribers
      WHERE instance_id = $1 AND status = 'subscribed' AND ($3::text IS NULL OR $3 = ANY(tags))
      ON CONFLICT DO NOTHING RETURNING 1)
    SELECT count(*)::int AS n FROM queued`, [inst, c.id, c.audience_tag]);
  if (!n) throw new CrmError('Nobody on the list matches this audience');
  const [row] = await q(`UPDATE crm_email_campaigns SET status = 'sending', recipients = $2, sent_at = now(), updated_at = now()
    WHERE id = $1 RETURNING *`, [c.id, n]);
  return row;
}

// Sends one copy straight away (counts toward the daily cap like any send).
export async function testCampaign(inst, id, to, { step } = {}) {
  needSetup();
  const address = emailAddress(to);
  let message;
  if (step !== undefined) {
    needId(id);
    const [s] = await q('SELECT steps FROM crm_email_sequences WHERE id = $1 AND instance_id = $2', [id, inst]);
    message = cleanSteps(s?.steps || [])[Number(step)];
    if (!message) throw new CrmError('Save the automation first, then send a test');
  } else {
    message = await draftCampaign(inst, id);
  }
  const email = renderMarketingEmail(message, { email: address, name: '', unsubscribe_token: 'test-preview-link-not-active' });
  await deliver([{ to: address, ...email, subject: `[Test] ${email.subject}` }]);
  return { ok: true };
}

// ── Rendering ───────────────────────────────────────────────────────────────

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const firstName = (sub) => (sub.name || '').trim().split(/\s+/)[0];

// {{first_name}}, {{name}}, {{email}}; {{first_name|there}} gives a fallback.
const merge = (s, sub) => String(s || '').replace(/\{\{\s*(first_name|name|email)\s*(?:\|([^}]*))?\}\}/g,
  (_, key, fallback = '') => ({ first_name: firstName(sub), name: sub.name, email: sub.email }[key] || fallback.trim()));

// The message is plain text: blank lines split paragraphs, "# " starts a
// heading, [label](https://…) is a link, a line that is only [label](url) is a
// button, and bare URLs are linked.
function inline(s) {
  return esc(s)
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (_, label, href) => `<a href="${href}" style="color:${GREEN};">${label}</a>`)
    .replace(/(^|[\s(])(https?:\/\/[^\s<]+)/g, (_, pre, href) => `${pre}<a href="${href}" style="color:${GREEN};">${href}</a>`)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');
}
function blocks(body) {
  return body.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean).map((p) => {
    const button = p.match(/^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/);
    if (button) {
      return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:22px 0 4px;"><tr><td style="background:${GREEN};border-radius:999px;">
        <a href="${esc(button[2])}" style="display:inline-block;padding:15px 34px;font:600 15px/1 Helvetica,Arial,sans-serif;color:#FFFFFF;text-decoration:none;">${esc(button[1])}</a>
      </td></tr></table>`;
    }
    if (p.startsWith('# ')) return `<h1 style="margin:22px 0 0;font:400 28px/1.25 Georgia,'Times New Roman',serif;color:${INK};">${inline(p.slice(2))}</h1>`;
    return `<p style="margin:16px 0 0;font:16px/1.6 Helvetica,Arial,sans-serif;color:${INK};">${inline(p)}</p>`;
  }).join('\n');
}
const plain = (body) => body
  .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '$1: $2')
  .replace(/\*\*([^*]+)\*\*/g, '$1')
  .replace(/^# /gm, '');

export const unsubscribeUrl = (t) => `${SITE}/.netlify/functions/email-unsubscribe?t=${encodeURIComponent(t)}`;

export function renderMarketingEmail({ subject, preheader, body }, sub) {
  const subj = merge(subject, sub);
  const text = merge(body, sub);
  const unsub = unsubscribeUrl(sub.unsubscribe_token);
  const address = process.env.EMAIL_POSTAL_ADDRESS || '';
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>${esc(subj)}</title></head>
<body style="margin:0;padding:0;background:${CREAM};">
  ${preheader ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(merge(preheader, sub))}</div>` : ''}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${CREAM};">
    <tr><td align="center" style="padding:32px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#FFFFFF;border:1px solid ${LINE};border-radius:14px;overflow:hidden;">
        <tr><td style="padding:28px 36px 22px;border-bottom:4px solid ${GREEN};">
          <img src="${LOGO}" width="260" alt="Loogo Labs — AI, Marketing &amp; Automation" style="display:block;width:260px;max-width:100%;height:auto;border:0;">
        </td></tr>
        <tr><td style="padding:18px 36px 34px;">
          ${blocks(text)}
        </td></tr>
        <tr><td style="padding:20px 36px;background:${CREAM};border-top:1px solid ${LINE};">
          <p style="margin:0;font:12px/1.6 Helvetica,Arial,sans-serif;color:${MUTED};">You're getting this because you signed up for updates from Loogo Labs.
            <a href="${esc(unsub)}" style="color:${MUTED};">Unsubscribe</a>${address ? `<br>${esc(address)}` : ''}</p>
          <p style="margin:12px 0 0;font:500 10px/1.4 Helvetica,Arial,sans-serif;letter-spacing:.2em;text-transform:uppercase;color:${MUTED};">Loogo Labs · AI, Marketing &amp; Automation · <a href="${SITE}" style="color:${MUTED};">loogolabs.com</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
  const footer = `\n\n—\nUnsubscribe: ${unsub}${address ? `\n${address}` : ''}`;
  return {
    subject: subj, html, text: plain(text) + footer,
    headers: { 'List-Unsubscribe': `<${unsub}>`, 'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click' },
  };
}

// ── Sending ─────────────────────────────────────────────────────────────────

// One Resend batch call (up to 100 emails). Returns the ids in order.
async function deliver(messages) {
  const res = await fetch('https://api.resend.com/emails/batch', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(messages.map((m) => ({ from: fromAddress(), ...m }))),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new CrmError(`Resend: ${body.message || `error ${res.status}`}`, 502);
  return (body.data || []).map((d) => d.id);
}

const PER_RUN = 50;

// Called by the scheduled email-worker function. Moves due automation steps
// into the outbox, then sends what the daily cap allows, oldest first.
export async function runQueue() {
  if (setupProblems().length) return { skipped: 'not set up' };

  // Due sequence steps → outbox; then advance each enrollment.
  const due = await q(`SELECT e.id, e.step, e.subscriber_id, s.id AS sequence_id, s.instance_id, s.steps
    FROM crm_email_enrollments e
    JOIN crm_email_sequences s ON s.id = e.sequence_id AND s.active
    JOIN crm_email_subscribers sub ON sub.id = e.subscriber_id AND sub.status = 'subscribed'
    WHERE e.status = 'active' AND e.next_at <= now() ORDER BY e.next_at LIMIT 500`);
  for (const e of due) {
    if (e.step < e.steps.length) {
      await q(`INSERT INTO crm_email_sends (instance_id, subscriber_id, sequence_id, step) VALUES ($1, $2, $3, $4)
        ON CONFLICT DO NOTHING`, [e.instance_id, e.subscriber_id, e.sequence_id, e.step]);
    }
    const next = e.step + 1;
    await q(`UPDATE crm_email_enrollments SET step = $2::int,
        status = CASE WHEN $2::int >= $3::int THEN 'done' ELSE 'active' END,
        next_at = CASE WHEN $2::int >= $3::int THEN NULL ELSE now() + make_interval(days => $4::int) END
      WHERE id = $1`, [e.id, next, e.steps.length, stepDelay(e.steps, next)]);
  }

  const [{ n: sentToday }] = await q(`SELECT count(*)::int AS n FROM crm_email_sends WHERE status = 'sent' AND sent_at > now() - interval '24 hours'`);
  const budget = Math.min(PER_RUN, dailyLimit() - sentToday);
  if (budget <= 0) return { queued_steps: due.length, sent: 0, capped: true };

  // Claim a slice of the outbox so an overlapping run cannot send it twice.
  const claimed = await q(`UPDATE crm_email_sends SET status = 'sending' WHERE id IN (
      SELECT id FROM crm_email_sends WHERE status = 'queued' ORDER BY created_at LIMIT $1 FOR UPDATE SKIP LOCKED)
    RETURNING id`, [budget]);
  if (!claimed.length) { await finishCampaigns(); return { queued_steps: due.length, sent: 0 }; }

  const rows = await q(`SELECT x.id, x.step, sub.email, sub.name, sub.status AS sub_status, sub.unsubscribe_token,
      c.subject AS c_subject, c.preheader AS c_preheader, c.body AS c_body, seq.steps
    FROM crm_email_sends x
    JOIN crm_email_subscribers sub ON sub.id = x.subscriber_id
    LEFT JOIN crm_email_campaigns c ON c.id = x.campaign_id
    LEFT JOIN crm_email_sequences seq ON seq.id = x.sequence_id
    WHERE x.id = ANY($1::uuid[])`, [claimed.map((r) => r.id)]);

  const ready = [];
  for (const r of rows) {
    const message = r.c_body !== null ? { subject: r.c_subject, preheader: r.c_preheader, body: r.c_body } : r.steps?.[r.step];
    if (r.sub_status !== 'subscribed' || !message) {
      await q(`UPDATE crm_email_sends SET status = 'skipped', error = $2 WHERE id = $1`, [r.id, r.sub_status !== 'subscribed' ? 'Unsubscribed' : 'Email no longer exists']);
      continue;
    }
    ready.push({ id: r.id, message: { to: r.email, ...renderMarketingEmail(message, r) } });
  }

  let sent = 0;
  if (ready.length) {
    try {
      const ids = await deliver(ready.map((r) => r.message));
      for (const [i, r] of ready.entries()) {
        await q(`UPDATE crm_email_sends SET status = 'sent', resend_id = $2, sent_at = now() WHERE id = $1`, [r.id, ids[i] || null]);
      }
      sent = ready.length;
    } catch (err) {
      // A rejected batch goes back in the queue unless Resend refused it outright.
      const retry = err.status === 502 && /rate|limit|quota|429/i.test(err.message);
      await q(`UPDATE crm_email_sends SET status = $2, error = $3 WHERE id = ANY($1::uuid[])`,
        [ready.map((r) => r.id), retry ? 'queued' : 'failed', err.message.slice(0, 500)]);
      console.error('email-worker send failed', err);
    }
  }
  await finishCampaigns();
  return { queued_steps: due.length, sent };
}

async function finishCampaigns() {
  await q(`UPDATE crm_email_campaigns c SET status = 'sent', updated_at = now()
    WHERE status = 'sending' AND NOT EXISTS (
      SELECT 1 FROM crm_email_sends x WHERE x.campaign_id = c.id AND x.status IN ('queued', 'sending'))`);
}
