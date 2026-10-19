import { getDatabase } from '@netlify/database';
import { ROLES, email, hashPassword, isSiteAdmin, json, passwordProblem, text, validEmail } from '../lib/crm.js';

const slugify = (v) => text(v, 60).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

// Website /admin → CRM instances and their users. GET lists everything; POST
// takes { action, ...fields }. Guarded by the site admin token, not a CRM login.
export default async (req) => {
  if (!isSiteAdmin(req)) return json({ error: 'Unauthorized' }, 401);
  const { sql } = getDatabase();

  if (req.method === 'GET') {
    const instances = await sql`
      SELECT i.*, (SELECT count(*)::int FROM crm_contacts c WHERE c.instance_id = i.id) AS contact_count
      FROM crm_instances i ORDER BY i.created_at DESC`;
    const users = await sql`
      SELECT id, instance_id, email, name, role, created_at, last_login_at FROM crm_users ORDER BY created_at`;
    return json(instances.map((i) => ({ ...i, users: users.filter((u) => u.instance_id === i.id) })));
  }
  if (req.method !== 'POST') return new Response(null, { status: 405 });

  let body;
  try { body = await req.json(); } catch { return json({ error: 'Invalid JSON' }, 400); }

  async function newUser(instanceId, u, role) {
    const addr = email(u?.email);
    if (!validEmail(addr)) throw new Error('A valid email is required');
    const problem = passwordProblem(u?.password);
    if (problem) throw new Error(problem);
    const [taken] = await sql`SELECT 1 FROM crm_users WHERE lower(email) = ${addr}`;
    if (taken) throw new Error('That email already has a CRM login');
    const [row] = await sql`
      INSERT INTO crm_users (instance_id, email, name, password_hash, role)
      VALUES (${instanceId}, ${addr}, ${text(u.name, 120)}, ${await hashPassword(u.password)}, ${role})
      RETURNING id, instance_id, email, name, role, created_at, last_login_at`;
    return row;
  }

  try {
    switch (body.action) {
      case 'create_instance': {
        const name = text(body.name, 120);
        const slug = slugify(body.slug || name);
        if (!name || !slug) return json({ error: 'Name is required' }, 400);
        const [exists] = await sql`SELECT 1 FROM crm_instances WHERE slug = ${slug}`;
        if (exists) return json({ error: 'An instance with that slug already exists' }, 409);
        // Check the owner before inserting so a bad owner does not leave an empty instance behind.
        if (body.owner) {
          const addr = email(body.owner.email);
          if (!validEmail(addr)) return json({ error: 'Owner needs a valid email' }, 400);
          const problem = passwordProblem(body.owner.password);
          if (problem) return json({ error: problem }, 400);
          const [taken] = await sql`SELECT 1 FROM crm_users WHERE lower(email) = ${addr}`;
          if (taken) return json({ error: 'That email already has a CRM login' }, 409);
        }
        const [instance] = await sql`INSERT INTO crm_instances (name, slug) VALUES (${name}, ${slug}) RETURNING *`;
        const users = body.owner ? [await newUser(instance.id, body.owner, 'owner')] : [];
        return json({ ...instance, contact_count: 0, users }, 201);
      }
      case 'update_instance': {
        const status = body.status === undefined ? null : body.status;
        if (status !== null && !['active', 'suspended'].includes(status)) return json({ error: 'Invalid status' }, 400);
        const name = body.name === undefined ? null : text(body.name, 120) || null;
        const [row] = await sql`
          UPDATE crm_instances SET name = COALESCE(${name}, name), status = COALESCE(${status}, status)
          WHERE id = ${body.id} RETURNING *`;
        if (!row) return json({ error: 'Not found' }, 404);
        if (row.status === 'suspended') {
          await sql`DELETE FROM crm_sessions WHERE user_id IN (SELECT id FROM crm_users WHERE instance_id = ${row.id})`;
        }
        return json(row);
      }
      case 'delete_instance': {
        await sql`DELETE FROM crm_instances WHERE id = ${body.id}`;
        return json({ ok: true });
      }
      case 'create_user': {
        const role = ROLES.includes(body.role) ? body.role : 'member';
        const [instance] = await sql`SELECT id FROM crm_instances WHERE id = ${body.instance_id}`;
        if (!instance) return json({ error: 'Instance not found' }, 404);
        return json(await newUser(instance.id, body, role), 201);
      }
      case 'update_user': {
        const role = body.role === undefined ? null : body.role;
        if (role !== null && !ROLES.includes(role)) return json({ error: 'Invalid role' }, 400);
        const name = body.name === undefined ? null : text(body.name, 120);
        let hash = null;
        if (body.password) {
          const problem = passwordProblem(body.password);
          if (problem) return json({ error: problem }, 400);
          hash = await hashPassword(body.password);
        }
        const [row] = await sql`
          UPDATE crm_users SET role = COALESCE(${role}, role), name = COALESCE(${name}, name),
            password_hash = COALESCE(${hash}, password_hash)
          WHERE id = ${body.id} RETURNING id, instance_id, email, name, role, created_at, last_login_at`;
        if (!row) return json({ error: 'Not found' }, 404);
        // A password reset signs the user out everywhere.
        if (hash) await sql`DELETE FROM crm_sessions WHERE user_id = ${row.id}`;
        return json(row);
      }
      case 'delete_user': {
        await sql`DELETE FROM crm_users WHERE id = ${body.id}`;
        return json({ ok: true });
      }
      default:
        return json({ error: 'Unknown action' }, 400);
    }
  } catch (err) {
    return json({ error: err.message || 'Request failed' }, 400);
  }
};
