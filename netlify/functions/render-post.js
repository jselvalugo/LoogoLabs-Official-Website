// Server-renders a single post on demand.
//
// scripts/generate-seo-assets.mjs writes a static file per post at build time,
// and Netlify serves those directly — this function never runs for them. It only
// runs for a slug with no static file yet: a post published from /admin since
// the last deploy. netlify.toml falls /news/* through to this function (without
// `force`, so an existing static file always wins), which means a crawler or
// social scraper gets a fully rendered page — correct title, description,
// canonical, JSON-LD, and the article text — the moment the post goes live,
// instead of a JS-only shell until the next build.
//
// Not a database-backed replacement for the static build: it does one read
// query (plus a second for related posts) per request, so it stays correct but
// is deliberately not what serves steady traffic to an old post. It is a bridge
// for the window between publish and deploy.

import { getDatabase } from '@netlify/database';
import { BLOG_BASE, headForPost, isoDate } from '../../src/lib/seo.js';
import { relatedPosts } from '../../src/lib/topics.js';
import { TEMPLATE_PATH, postArticleHtml, renderPage, shellHtml } from '../../src/lib/render.js';

const notFoundBody = () => shellHtml(
  'That post isn’t here.',
  'The link may be out of date, or the post may have moved.',
);

export default async (req) => {
  const pathname = new URL(req.url).pathname;
  if (!pathname.startsWith(`${BLOG_BASE}/`)) return new Response('Not found', { status: 404 });
  const slug = pathname.slice(BLOG_BASE.length + 1).replace(/\/+$/, '');
  if (!slug) return new Response('Not found', { status: 404 });

  const { sql } = getDatabase();

  const [row] = await sql`
    SELECT title, slug, excerpt, content, tags, author, read_time, published_at, updated_at, word_count
    FROM posts WHERE slug = ${slug} AND status = 'published'
  `;

  if (!row) {
    const html = renderPage(await fetchTemplate(req), {
      head: headForPost(null),
      body: notFoundBody(),
    });
    return new Response(html, { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  }

  const post = { ...row, published_at: isoDate(row.published_at), updated_at: isoDate(row.updated_at) };

  // Only the columns relatedPosts() needs, for every other published post — the
  // full content column would be wasted here.
  const siblings = await sql`
    SELECT title, slug, excerpt, tags, published_at FROM posts
    WHERE status = 'published' AND slug != ${slug}
  `;

  const html = renderPage(await fetchTemplate(req), {
    head: headForPost(post),
    body: postArticleHtml(post, { related: relatedPosts(post, siblings, 3) }),
  });

  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      // Short-lived: the next deploy replaces this with a real static file, and
      // until then a re-publish from /admin should show up quickly.
      'Cache-Control': 'public, max-age=0, s-maxage=120, stale-while-revalidate=600',
    },
  });
};

// The unmodified Vite shell (hashed asset URLs, fonts, the Netlify Forms probe)
// lives at /_template.html, written by the build so this function does not
// carry its own stale copy of asset hashes.
async function fetchTemplate(req) {
  const res = await fetch(new URL(TEMPLATE_PATH, req.url));
  if (!res.ok) throw new Error(`could not fetch ${TEMPLATE_PATH}: ${res.status}`);
  return res.text();
}
