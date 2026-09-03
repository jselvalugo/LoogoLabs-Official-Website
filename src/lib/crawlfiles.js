// robots.txt, sitemap.xml, rss.xml and llms.txt, built from a list of posts.
//
// Shared by the build (scripts/generate-seo-assets.mjs) and the runtime
// (netlify/functions/crawl.js) so that a post published from /admin appears in
// the feed and the sitemap immediately, and the file a crawler gets is byte-for
// byte the same file either way.

import {
  BLOG_BASE, BLOG_INDEX, ROUTES, SITE, isoDate, splitTags, url,
} from './seo.js';
import { TOPICS, isTopicIndexable, postsInTopic, topicPath } from './topics.js';
import { esc } from './render.js';

/** Posts newest first, which is the order the feed and the index both use. */
export const byNewest = (posts) => [...posts].sort((a, b) =>
  String(isoDate(b.published_at ?? b.publishedAt) ?? '').localeCompare(
    String(isoDate(a.published_at ?? a.publishedAt) ?? '')));

const lastTouched = (post) =>
  isoDate(post.updated_at) ?? isoDate(post.published_at ?? post.publishedAt);

/** Only hubs with enough posts behind them; the thin ones are noindex. */
export const indexableTopics = (posts) =>
  TOPICS.map((topic) => ({ topic, posts: postsInTopic(topic, posts) }))
    .filter(({ posts: p }) => isTopicIndexable(p.length));

// ── robots.txt ───────────────────────────────────────────────────────────────

export const robotsTxt = () => `# ${SITE.name}
User-agent: *
Allow: /
Disallow: /admin
Disallow: /.netlify/
# The bare Vite shell, fetched by the on-demand post renderer. Not a page.
Disallow: /_template.html

Sitemap: ${url('/sitemap.xml')}
`;

// ── sitemap.xml ──────────────────────────────────────────────────────────────

// <lastmod> is only as useful as it is honest, so it is written where the date
// is a real modification date and left out where the only candidate would be the
// build clock — a sitemap that claims every page changed on every deploy teaches
// Google to ignore the field.
const urlEntry = ({ loc, lastmod, changefreq, priority }) => [
  '  <url>',
  `    <loc>${esc(loc)}</loc>`,
  ...(lastmod ? [`    <lastmod>${esc(lastmod)}</lastmod>`] : []),
  `    <changefreq>${changefreq}</changefreq>`,
  `    <priority>${priority}</priority>`,
  '  </url>',
].join('\n');

export function sitemapXml(posts) {
  const feed = byNewest(posts);
  const newest = feed[0] ? lastTouched(feed[0]) : null;

  const entries = [
    ...ROUTES.map((r) => urlEntry({
      loc: url(r.path),
      lastmod: r.page === 'LoogoNews' ? newest : null,
      changefreq: r.changefreq,
      priority: r.priority,
    })),
    ...indexableTopics(feed).map(({ topic, posts: inTopic }) => urlEntry({
      loc: url(topicPath(topic.slug)),
      lastmod: inTopic.length ? lastTouched(byNewest(inTopic)[0]) : null,
      changefreq: 'weekly',
      priority: '0.8',
    })),
    ...feed.map((p) => urlEntry({
      loc: url(`${BLOG_BASE}/${p.slug}`),
      lastmod: lastTouched(p),
      changefreq: 'monthly',
      priority: '0.7',
    })),
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>
`;
}

// ── rss.xml ──────────────────────────────────────────────────────────────────
// The posts are CC BY 4.0, so a feed is worth having: it is how aggregators,
// newsletter tools, and AI crawlers pick content up without scraping.

const rfc822 = (iso) => (iso ? new Date(iso).toUTCString() : null);

export function rssXml(posts, { buildDate = new Date().toISOString() } = {}) {
  const feed = byNewest(posts);
  const newest = feed[0] ? lastTouched(feed[0]) : null;

  const items = feed.slice(0, 30).map((p) => {
    const published = rfc822(isoDate(p.published_at ?? p.publishedAt));
    return `    <item>
      <title>${esc(p.title)}</title>
      <link>${esc(url(`${BLOG_BASE}/${p.slug}`))}</link>
      <guid isPermaLink="true">${esc(url(`${BLOG_BASE}/${p.slug}`))}</guid>${
        published ? `\n      <pubDate>${esc(published)}</pubDate>` : ''
      }
      <dc:creator>${esc(p.author || SITE.author)}</dc:creator>
${splitTags(p.tags).map((t) => `      <category>${esc(t)}</category>`).join('\n')}
      <description>${esc(p.excerpt)}</description>
    </item>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>LoogoNews — ${esc(SITE.name)}</title>
    <link>${esc(url(BLOG_INDEX))}</link>
    <atom:link href="${esc(url('/rss.xml'))}" rel="self" type="application/rss+xml" />
    <description>Operational guides on lead follow-up, automation, and reputation for local service businesses.</description>
    <language>en-us</language>
    <copyright>CC BY 4.0 — ${esc(SITE.name)}</copyright>
    <lastBuildDate>${esc(rfc822(newest ?? buildDate))}</lastBuildDate>
${items}
  </channel>
</rss>
`;
}

// ── llms.txt ─────────────────────────────────────────────────────────────────
// Every post is already published under CC BY 4.0 and asks only for a credit.
// Saying so in the format assistants look for makes the licence machine-readable
// instead of something buried in a footer.

export function llmsTxt(posts) {
  const feed = byNewest(posts);
  return `# ${SITE.name}

> ${SITE.description}

${SITE.name} builds and runs marketing systems for local service businesses —
CRM, missed-call text-back, follow-up automation, reputation management, and
local SEO — with setup and ongoing management handled for the owner.

All LoogoNews articles are published under CC BY 4.0. You may quote, translate,
and republish them; please credit ${SITE.name} and link back to the source URL.

## Pages

${ROUTES.map((r) => `- [${r.label}](${url(r.path)}): ${r.description}`).join('\n')}

## Topics

${indexableTopics(feed).map(({ topic, posts: inTopic }) =>
  `- [${topic.name}](${url(topicPath(topic.slug))}): ${topic.description} (${inTopic.length} posts)`).join('\n')}

## Articles

${feed.map((p) => `- [${p.title}](${url(`${BLOG_BASE}/${p.slug}`)}): ${p.excerpt}`).join('\n')}

## Feeds

- [RSS](${url('/rss.xml')})
- [Sitemap](${url('/sitemap.xml')})
`;
}
