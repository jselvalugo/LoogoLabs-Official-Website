import { getDatabase } from '@netlify/database';

export default async (req) => {
  const auth = req.headers.get('authorization') || '';
  const isAdmin = auth === `Bearer ${process.env.ADMIN_SECRET}`;

  const { sql } = getDatabase();

  const posts = isAdmin
    ? await sql`SELECT id, created_at, updated_at, title, slug, excerpt, tags, status, views, author, read_time, published_at FROM posts ORDER BY created_at DESC`
    : await sql`SELECT id, created_at, updated_at, title, slug, excerpt, tags, status, views, author, read_time, published_at FROM posts WHERE status = 'published' ORDER BY published_at DESC`;

  const cc = isAdmin ? 'no-store' : 'public, max-age=60, stale-while-revalidate=300';
  return new Response(JSON.stringify(posts), { status: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': cc } });
};
