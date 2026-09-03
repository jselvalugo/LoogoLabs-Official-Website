// Serves sitemap.xml, rss.xml, and llms.txt from the live posts table, so a post
// published from /admin appears in all three the moment it goes live — not
// after the next deploy. netlify.toml force-redirects those three paths here;
// the build also writes static copies of the same files (via
// scripts/generate-seo-assets.mjs) as a fallback for any host that serves this
// repo without functions enabled.
//
// robots.txt is not served here: its contents don't depend on the post list, so
// the static file from the build is both correct and cheaper.

import { getDatabase } from '@netlify/database';
import { llmsTxt, rssXml, sitemapXml } from '../../src/lib/crawlfiles.js';

const CONTENT_TYPES = {
  sitemap: 'application/xml; charset=utf-8',
  rss: 'application/rss+xml; charset=utf-8',
  llms: 'text/plain; charset=utf-8',
};

const BUILDERS = {
  sitemap: sitemapXml,
  rss: rssXml,
  llms: llmsTxt,
};

export default async (req) => {
  const type = new URL(req.url).searchParams.get('type');
  const build = BUILDERS[type];
  if (!build) return new Response('Not found', { status: 404 });

  const { sql } = getDatabase();
  const posts = await sql`
    SELECT title, slug, excerpt, tags, author, read_time, published_at, updated_at
    FROM posts WHERE status = 'published'
  `;

  return new Response(build(posts), {
    status: 200,
    headers: {
      'Content-Type': CONTENT_TYPES[type],
      // Crawl files change with every publish; a CDN should not pin a stale one.
      'Cache-Control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=3600',
    },
  });
};
