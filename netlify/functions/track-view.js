import { getDatabase } from '@netlify/database';

export default async (req) => {
  if (req.method !== 'POST') return new Response(null, { status: 405 });

  let body;
  try { body = await req.json(); } catch { return new Response(null, { status: 400 }); }

  const { slug } = body;
  if (!slug) return new Response(null, { status: 400 });

  const { sql } = getDatabase();
  await sql`UPDATE posts SET views = COALESCE(views, 0) + 1 WHERE slug = ${slug} AND status = 'published'`;

  return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
};
