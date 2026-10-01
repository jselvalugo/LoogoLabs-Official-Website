import { getDatabase } from '@netlify/database';

export default async (req) => {
  if (req.method !== 'PATCH') return new Response(null, { status: 405 });

  const auth = req.headers.get('authorization') || '';
  if (auth !== `Bearer ${process.env.ADMIN_SECRET}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  let body;
  try { body = await req.json(); } catch { return new Response(null, { status: 400 }); }

  const { id, title, slug, excerpt, content, tags, status, author, read_time, featured } = body;
  if (!id) return new Response(JSON.stringify({ error: 'id required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });

  const { sql } = getDatabase();

  const [existing] = await sql`SELECT status, published_at, featured FROM posts WHERE id = ${id}`;
  if (!existing) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });

  const published_at = status === 'published' && existing.status !== 'published'
    ? new Date().toISOString()
    : existing.published_at;

  // Featured is optional on the request: leave it alone unless the editor sent it.
  // Only one post may be featured (posts_one_featured), and only a published one,
  // so featuring this post first un-features whichever post held the spot.
  const nextFeatured = (featured ?? existing.featured) && (status ?? 'draft') === 'published';
  if (nextFeatured) await sql`UPDATE posts SET featured = false WHERE featured AND id <> ${id}`;

  const [post] = await sql`
    UPDATE posts SET
      title = ${title},
      slug = ${slug},
      excerpt = ${excerpt ?? ''},
      content = ${content ?? ''},
      tags = ${tags ?? ''},
      status = ${status ?? 'draft'},
      author = ${author ?? 'Loogo Labs'},
      read_time = ${read_time ?? 5},
      updated_at = now(),
      published_at = ${published_at},
      featured = ${nextFeatured}
    WHERE id = ${id} RETURNING *
  `;

  return new Response(JSON.stringify(post), { status: 200, headers: { 'Content-Type': 'application/json' } });
};
