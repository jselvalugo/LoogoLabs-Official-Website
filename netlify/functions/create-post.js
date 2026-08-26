import { getDatabase } from '@netlify/database';

export default async (req) => {
  if (req.method !== 'POST') return new Response(null, { status: 405 });

  const auth = req.headers.get('authorization') || '';
  if (auth !== `Bearer ${process.env.ADMIN_SECRET}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  let body;
  try { body = await req.json(); } catch { return new Response(null, { status: 400 }); }

  const { title, slug, excerpt, content, tags, status, author, read_time } = body;
  if (!title || !slug) {
    return new Response(JSON.stringify({ error: 'title and slug required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  const published_at = status === 'published' ? new Date().toISOString() : null;
  const { sql } = getDatabase();

  const [post] = await sql`
    INSERT INTO posts (title, slug, excerpt, content, tags, status, author, read_time, published_at)
    VALUES (${title}, ${slug}, ${excerpt || ''}, ${content || ''}, ${tags || ''}, ${status || 'draft'}, ${author || 'Loogo Labs'}, ${read_time || 5}, ${published_at})
    RETURNING *
  `;

  return new Response(JSON.stringify(post), { status: 201, headers: { 'Content-Type': 'application/json' } });
};
