import { getDatabase } from '@netlify/database';
import { STAGES, currentUser, json, text } from '../lib/crm.js';

const num = (v) => (v === null || v === '' || v === undefined ? null : Number(v));

// Everything a signed-in CRM user reads or writes. Every query is scoped to the
// user's own instance_id, so one workspace can never see another's rows.
export default async (req) => {
  if (req.method !== 'POST') return new Response(null, { status: 405 });
  const me = await currentUser(req);
  if (!me) return json({ error: 'Unauthorized' }, 401);
  let body;
  try { body = await req.json(); } catch { return json({ error: 'Invalid JSON' }, 400); }
  const { sql } = getDatabase();
  const inst = me.instance_id;

  function contactFields(b) {
    const value = num(b.value);
    if (value !== null && !Number.isFinite(value)) throw new Error('Value must be a number');
    if (b.stage !== undefined && !STAGES.includes(b.stage)) throw new Error('Invalid stage');
    return { name: text(b.name, 200), company: text(b.company, 200), email: text(b.email, 320), phone: text(b.phone, 60), stage: b.stage || 'lead', value };
  }

  try {
    switch (body.action) {
      case 'overview': {
        const stages = await sql`
          SELECT stage, count(*)::int AS n, COALESCE(sum(value), 0)::float AS total
          FROM crm_contacts WHERE instance_id = ${inst} GROUP BY stage`;
        const activity = await sql`
          SELECT n.id, n.body, n.created_at, c.id AS contact_id, c.name AS contact_name, COALESCE(u.name, n.author_label) AS author
          FROM crm_notes n JOIN crm_contacts c ON c.id = n.contact_id LEFT JOIN crm_users u ON u.id = n.user_id
          WHERE n.instance_id = ${inst} ORDER BY n.created_at DESC LIMIT 20`;
        return json({ stages, activity });
      }
      case 'list_contacts':
        return json(await sql`SELECT * FROM crm_contacts WHERE instance_id = ${inst} ORDER BY updated_at DESC`);
      case 'create_contact': {
        const f = contactFields(body);
        if (!f.name) return json({ error: 'Name is required' }, 400);
        const [row] = await sql`
          INSERT INTO crm_contacts (instance_id, name, company, email, phone, stage, value)
          VALUES (${inst}, ${f.name}, ${f.company}, ${f.email}, ${f.phone}, ${f.stage}, ${f.value}) RETURNING *`;
        return json(row, 201);
      }
      case 'update_contact': {
        const f = contactFields(body);
        if (!f.name) return json({ error: 'Name is required' }, 400);
        const [row] = await sql`
          UPDATE crm_contacts SET name = ${f.name}, company = ${f.company}, email = ${f.email}, phone = ${f.phone},
            stage = ${f.stage}, value = ${f.value}, updated_at = now()
          WHERE id = ${body.id} AND instance_id = ${inst} RETURNING *`;
        return row ? json(row) : json({ error: 'Not found' }, 404);
      }
      case 'delete_contact':
        await sql`DELETE FROM crm_contacts WHERE id = ${body.id} AND instance_id = ${inst}`;
        return json({ ok: true });
      case 'list_notes':
        return json(await sql`
          SELECT n.id, n.body, n.created_at, COALESCE(u.name, n.author_label) AS author FROM crm_notes n LEFT JOIN crm_users u ON u.id = n.user_id
          WHERE n.contact_id = ${body.contact_id} AND n.instance_id = ${inst} ORDER BY n.created_at DESC`);
      case 'add_note': {
        const note = text(body.body, 5000);
        if (!note) return json({ error: 'Note is empty' }, 400);
        const [contact] = await sql`SELECT id FROM crm_contacts WHERE id = ${body.contact_id} AND instance_id = ${inst}`;
        if (!contact) return json({ error: 'Not found' }, 404);
        const [row] = await sql`
          INSERT INTO crm_notes (instance_id, contact_id, user_id, body) VALUES (${inst}, ${contact.id}, ${me.id}, ${note})
          RETURNING id, body, created_at`;
        await sql`UPDATE crm_contacts SET updated_at = now() WHERE id = ${contact.id}`;
        return json({ ...row, author: me.name }, 201);
      }
      case 'team':
        return json(await sql`SELECT id, email, name, role, last_login_at FROM crm_users WHERE instance_id = ${inst} ORDER BY created_at`);
      default:
        return json({ error: 'Unknown action' }, 400);
    }
  } catch (err) {
    return json({ error: err.message || 'Request failed' }, 400);
  }
};
