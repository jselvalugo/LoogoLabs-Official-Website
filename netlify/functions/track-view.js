import { getDatabase } from '@netlify/database';

// context.geo is Netlify's built-in IP geolocation — city/region accuracy,
// no external service or user permission prompt needed. The client only
// calls this once per slug per browser session (see BlogPost.jsx), so each
// call here is one deduplicated view, not a page-load counter.
export default async (req, context) => {
  if (req.method !== 'POST') return new Response(null, { status: 405 });

  let body;
  try { body = await req.json(); } catch { return new Response(null, { status: 400 }); }

  const { slug } = body;
  if (!slug) return new Response(null, { status: 400 });

  const geo = context?.geo || {};
  const city = geo.city || null;
  const region = geo.subdivision?.name || null;
  const country = geo.country?.name || null;

  const { sql } = getDatabase();
  await sql`UPDATE posts SET views = COALESCE(views, 0) + 1 WHERE slug = ${slug} AND status = 'published'`;
  await sql`INSERT INTO post_views (post_slug, city, region, country) VALUES (${slug}, ${city}, ${region}, ${country})`;

  return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
};
