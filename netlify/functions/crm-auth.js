import {
  createSession, currentUser, db, email, endSession, hashPassword, json, passwordProblem, verifyPassword,
} from '../lib/crm.js';

// CRM sign-in. POST { action: 'login' | 'logout' | 'me' | 'change_password' }.
export default async (req) => {
  if (req.method !== 'POST') return new Response(null, { status: 405 });
  let body;
  try { body = await req.json(); } catch { return json({ error: 'Invalid JSON' }, 400); }
  const { sql } = db();

  if (body.action === 'login') {
    const [user] = await sql`
      SELECT u.id, u.password_hash, i.status FROM crm_users u JOIN crm_instances i ON i.id = u.instance_id
      WHERE lower(u.email) = ${email(body.email)}`;
    const ok = user && await verifyPassword(String(body.password || ''), user.password_hash);
    if (!ok) return json({ error: 'Wrong email or password' }, 401);
    if (user.status !== 'active') return json({ error: 'This workspace is suspended' }, 403);
    await sql`UPDATE crm_users SET last_login_at = now() WHERE id = ${user.id}`;
    return json({ token: await createSession(user.id) });
  }

  if (body.action === 'logout') {
    await endSession(req);
    return json({ ok: true });
  }

  const me = await currentUser(req);
  if (!me) return json({ error: 'Unauthorized' }, 401);

  if (body.action === 'me') return json(me);

  if (body.action === 'change_password') {
    const [row] = await sql`SELECT password_hash FROM crm_users WHERE id = ${me.id}`;
    if (!await verifyPassword(String(body.current || ''), row.password_hash)) return json({ error: 'Current password is wrong' }, 400);
    const problem = passwordProblem(body.next);
    if (problem) return json({ error: problem }, 400);
    await sql`UPDATE crm_users SET password_hash = ${await hashPassword(body.next)} WHERE id = ${me.id}`;
    return json({ ok: true });
  }

  return json({ error: 'Unknown action' }, 400);
};
