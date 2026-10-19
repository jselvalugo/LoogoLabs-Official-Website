import { createHash, randomBytes, scrypt as scryptCb, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { getDatabase } from '@netlify/database';

const scrypt = promisify(scryptCb);

// One database handle per function instance. getDatabase() builds a new
// connection pool on every call, so calling it per query would leak pools.
let handle;
export const db = () => (handle ??= getDatabase());

export const STAGES = ['lead', 'qualified', 'proposal', 'won', 'lost'];
export const ROLES = ['owner', 'member'];
const SESSION_DAYS = 30;

export const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
});
export const text = (v, max = 500) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
export const email = (v) => text(v, 320).toLowerCase();
export const validEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export async function hashPassword(password) {
  const salt = randomBytes(16);
  const key = await scrypt(password, salt, 64);
  return `scrypt$${salt.toString('hex')}$${key.toString('hex')}`;
}

export async function verifyPassword(password, stored) {
  const [scheme, saltHex, keyHex] = (stored || '').split('$');
  if (scheme !== 'scrypt' || !saltHex || !keyHex) return false;
  const key = await scrypt(password, Buffer.from(saltHex, 'hex'), 64);
  const expected = Buffer.from(keyHex, 'hex');
  return expected.length === key.length && timingSafeEqual(expected, key);
}

export function passwordProblem(password) {
  if (typeof password !== 'string' || password.length < 10) return 'Password must be at least 10 characters';
  if (password.length > 200) return 'Password is too long';
  return null;
}

export const tokenHash = (token) => createHash('sha256').update(token).digest('hex');

export async function createSession(userId) {
  const { sql } = db();
  const { token } = newToken();
  const expires = new Date(Date.now() + SESSION_DAYS * 86400000);
  await sql`INSERT INTO crm_sessions (token_hash, user_id, expires_at) VALUES (${tokenHash(token)}, ${userId}, ${expires})`;
  await sql`DELETE FROM crm_sessions WHERE expires_at < now()`;
  return token;
}

export async function endSession(req) {
  const token = bearer(req);
  if (!token) return;
  const { sql } = db();
  await sql`DELETE FROM crm_sessions WHERE token_hash = ${tokenHash(token)}`;
}

const bearer = (req) => {
  const auth = req.headers.get('authorization') || '';
  return auth.startsWith('Bearer ') ? auth.slice(7) : null;
};

// The signed-in CRM user for this request, with their instance — or null when
// the token is missing, expired, or the instance has been suspended.
export async function currentUser(req) {
  const token = bearer(req);
  if (!token) return null;
  const { sql } = db();
  const [row] = await sql`
    SELECT u.id, u.email, u.name, u.role, u.instance_id, i.name AS instance_name, i.slug AS instance_slug
    FROM crm_sessions s
    JOIN crm_users u ON u.id = s.user_id
    JOIN crm_instances i ON i.id = u.instance_id
    WHERE s.token_hash = ${tokenHash(token)} AND s.expires_at > now() AND i.status = 'active'`;
  return row || null;
}

export const isSiteAdmin = (req) => {
  const secret = process.env.ADMIN_SECRET;
  return !!secret && req.headers.get('authorization') === `Bearer ${secret}`;
};

export function newToken(prefix = '') {
  const token = prefix + randomBytes(32).toString('base64url');
  return { token, hash: tokenHash(token) };
}
