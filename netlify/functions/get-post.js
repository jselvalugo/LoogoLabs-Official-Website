import { getDatabase } from '@netlify/database';

export default async (req) => {
  const url = new URL(req.url);
  const slug = url.searchParams.get('slug');

  if (!slug) {
    return new Response(JSON.stringify({ error: 'slug required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  const { sql } = getDatabase();

  const [post] = await sql`
    UPDATE posts SET views = views + 1
    WHERE slug = ${slug} AND status = 'published'
    RETURNING *
  `;

  if (!post) {
    return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
  }

  return new Response(JSON.stringify(post), { status: 200, headers: { 'Content-Type': 'application/json' } });
};
