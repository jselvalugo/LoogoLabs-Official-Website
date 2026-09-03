// Post-build step: turns the single-page bundle into something a crawler can
// actually read.
//
//   vite build && node scripts/generate-seo-assets.mjs
//
// Vite emits one index.html for every URL on the site, which means every page
// shared the same <title>, the same description, no canonical, and no content
// until JavaScript had run. This script takes that shell and writes one real
// HTML file per route — correct head tags, JSON-LD, and the page's text already
// in the markup — plus the topic hubs, robots.txt, sitemap.xml, an RSS feed, and
// llms.txt.
//
// Where the post list comes from
// ------------------------------
// The live posts table is the source of truth, and content/posts.mjs is the
// reviewed copy of it in git. This script reads both and merges them, so a post
// published from /admin is pre-rendered by the next deploy even though it has
// never been through a migration. When no database is reachable — a local build,
// or a preview without the env var — it falls back to content/posts.mjs and says
// so, rather than failing the build.
//
// The React app still boots and takes over on load: createRoot().render() clears
// #root first, so the pre-rendered markup is a fallback for crawlers and slow
// connections, never something the user sees twice.

import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { posts as sourcePosts } from '../content/posts.mjs';
import { readTime } from './generate-post-migration.mjs';
import {
  BLOG_BASE, ROUTES, SITE, blogLd, headForPage, headForPost, headForTopic,
  isoDate, jsonLdForPage, url,
} from '../src/lib/seo.js';
import { TOPICS, postsInTopic, relatedPosts, topicPath, topicsForPost } from '../src/lib/topics.js';
import {
  TEMPLATE_PATH, esc, postArticleHtml, postListHtml, renderPage, shellHtml, topicNavHtml,
} from '../src/lib/render.js';
import { byNewest, llmsTxt, robotsTxt, rssXml, sitemapXml } from '../src/lib/crawlfiles.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const MIGRATIONS = join(ROOT, 'netlify/database/migrations');

// ── Publication dates for posts that only exist in git ───────────────────────
// content/posts.mjs carries no dates: the database stamps published_at when a
// post's migration runs. The migration folder that first mentions a slug is
// therefore the closest thing to a publication date available at build time,
// and unlike a build timestamp it stays stable across rebuilds — which is what
// sitemap <lastmod> and BlogPosting datePublished need to be trusted.
function publicationDates() {
  const dates = new Map();
  const dirs = readdirSync(MIGRATIONS).filter((d) => /^\d{14}_/.test(d)).sort();
  for (const dir of dirs) {
    const stamp = dir.slice(0, 14);
    const iso = `${stamp.slice(0, 4)}-${stamp.slice(4, 6)}-${stamp.slice(6, 8)}T` +
      `${stamp.slice(8, 10)}:${stamp.slice(10, 12)}:${stamp.slice(12, 14)}Z`;
    let sql;
    try {
      sql = readFileSync(join(MIGRATIONS, dir, 'migration.sql'), 'utf8');
    } catch {
      continue;
    }
    for (const post of sourcePosts) {
      if (!dates.has(post.slug) && sql.includes(`'${post.slug}'`)) dates.set(post.slug, iso);
    }
  }
  return dates;
}

const wordCount = (text) => String(text).trim().split(/\s+/).length;

const fromSource = (post, dates) => ({
  ...post,
  author: SITE.author,
  read_time: readTime(post.content),
  word_count: wordCount(post.content),
  published_at: dates.get(post.slug) ?? null,
  updated_at: null,
});

/** Published posts from the live table, or null when there is no database here. */
async function loadPublishedFromDb() {
  if (!process.env.NETLIFY_DATABASE_URL && !process.env.DATABASE_URL) return null;
  try {
    const { getDatabase } = await import('@netlify/database');
    const { sql } = getDatabase();
    const rows = await sql`
      SELECT title, slug, excerpt, content, tags, author, read_time, published_at, updated_at
      FROM posts WHERE status = 'published'
    `;
    return rows.map((row) => ({
      ...row,
      published_at: isoDate(row.published_at),
      updated_at: isoDate(row.updated_at),
      word_count: wordCount(row.content),
    }));
  } catch (error) {
    console.warn(`  warning: could not read posts from the database (${error.message});` +
      ' falling back to content/posts.mjs');
    return null;
  }
}

async function loadPosts() {
  const dates = publicationDates();
  const source = sourcePosts.map((post) => fromSource(post, dates));
  const live = await loadPublishedFromDb();
  if (!live) return { posts: byNewest(source), source: 'content/posts.mjs', dbOnly: 0 };

  // The database wins for anything it knows about — it has the real publication
  // date and any edit made from /admin. Anything only in git is kept, so a build
  // that runs before a migration has been applied still pre-renders it.
  const bySlug = new Map(source.map((p) => [p.slug, p]));
  for (const row of live) bySlug.set(row.slug, { ...bySlug.get(row.slug), ...row });
  const dbOnly = live.filter((row) => !source.some((p) => p.slug === row.slug)).length;
  return { posts: byNewest([...bySlug.values()]), source: 'database + content/posts.mjs', dbOnly };
}

const { posts: allPosts, source: postSource, dbOnly } = await loadPosts();
const missingDates = allPosts.filter((p) => !p.published_at);

// A post that matches no topic is unreachable from any hub, which is the one
// failure this whole structure exists to prevent. Fail the build rather than
// publish an orphan — the fix is a tag on the post or a tag list in
// content/topics.mjs.
const orphans = allPosts.filter((p) => topicsForPost(p).length === 0);
if (orphans.length) {
  console.error(
    `error: ${orphans.length} post(s) match no topic in content/topics.mjs:\n` +
    orphans.map((p) => `  ${p.slug} [${p.tags}]`).join('\n') +
    '\nAdd one of their tags to a topic, or retag the post.',
  );
  process.exit(1);
}

// ── HTML shell ───────────────────────────────────────────────────────────────

const template = readFileSync(join(DIST, 'index.html'), 'utf8');

// Kept verbatim for netlify/functions/render-post.js, which fetches it at
// runtime to render posts published since this build.
writeFileSync(join(DIST, TEMPLATE_PATH.replace(/^\//, '')), template);

function write(routePath, html) {
  const dir = routePath === '/' ? DIST : join(DIST, routePath.replace(/^\//, ''));
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), html);
}

let written = 0;

// ── Static routes ────────────────────────────────────────────────────────────

const HEADINGS = {
  Home: 'Launch, Grow & Automate Your Business — All in One Place',
  Mission: 'We believe running a business should not require 15 different tools.',
  Pricing: 'One platform. Three plans. No hidden fees.',
  LoogoNews: 'LoogoNews — Marketing News',
  GrowCFL: 'Stop losing customers to businesses that respond faster.',
  Privacy: 'Privacy Policy',
  Terms: 'Terms of Service',
};

for (const route of ROUTES) {
  const head = headForPage(route.page);
  let extra = '';

  if (route.page === 'Home') {
    // The founder contact is a real link on the rendered page; mirror it here so
    // a crawler that does not run JavaScript sees the same thing, and so the
    // email on the Organization entity is backed by visible markup.
    extra = `<p>Email the founder: <a href="mailto:${esc(SITE.email)}">${esc(SITE.email)}</a> — ${esc(SITE.founder)}, Founder</p>`;
  }

  if (route.page === 'LoogoNews') {
    // The post list is fetched from the database at runtime, so without this the
    // index is an empty page and every post is unreachable by crawl. The topic
    // hubs go here too: this is the page that links them all.
    head.jsonLd = [...jsonLdForPage('LoogoNews'), blogLd(allPosts)];
    extra = `<section><h2>Browse by topic</h2>${topicNavHtml(TOPICS)}</section>${postListHtml(allPosts)}`;
  }

  write(route.path, renderPage(template, {
    head,
    body: shellHtml(HEADINGS[route.page] ?? route.label, route.description, extra),
  }));
  written += 1;
}

// The admin console must never be indexed.
write('/admin', renderPage(template, {
  head: {
    title: `Admin | ${SITE.name}`,
    description: 'Private administration console.',
    canonical: url('/admin'),
    robots: 'noindex, nofollow',
    ogType: 'website',
    image: url(SITE.ogImage),
    jsonLd: [],
  },
  body: '',
}));

// ── Topic hubs ───────────────────────────────────────────────────────────────

let hubs = 0;
for (const topic of TOPICS) {
  const inTopic = postsInTopic(topic, allPosts);
  const head = headForTopic(topic, allPosts);
  const siblings = TOPICS.filter((t) => t.slug !== topic.slug);
  const body = `
      <main>
        <nav aria-label="Breadcrumb"><a href="/">${esc(SITE.name)}</a> / <a href="/loogonews">LoogoNews</a> / <span aria-current="page">${esc(topic.name)}</span></nav>
        <h1>${esc(topic.heading)}</h1>
        ${topic.intro.map((para) => `<p>${esc(para)}</p>`).join('\n        ')}
        <section><h2>${inTopic.length} posts on ${esc(topic.name.toLowerCase())}</h2>${postListHtml(inTopic)}</section>
        <section><h2>Other topics</h2>${topicNavHtml(siblings)}</section>
        <p><a href="/grow">Marketing systems for Central Florida service businesses</a></p>
        <p><a href="/loogonews">All LoogoNews posts</a></p>
      </main>`;
  write(topicPath(topic.slug), renderPage(template, { head, body }));
  hubs += 1;
  written += 1;
}

// ── Posts ────────────────────────────────────────────────────────────────────

for (const post of allPosts) {
  write(`${BLOG_BASE}/${post.slug}`, renderPage(template, {
    head: headForPost(post),
    body: postArticleHtml(post, { related: relatedPosts(post, allPosts) }),
  }));
  written += 1;
}

// ── 404 ──────────────────────────────────────────────────────────────────────
// Served with a real 404 status (see netlify.toml), so an unknown URL is no
// longer a 200-status copy of the homepage.

writeFileSync(join(DIST, '404.html'), renderPage(template, {
  head: {
    title: `Page not found | ${SITE.name}`,
    description: 'That page isn’t here. The link may be out of date, or the page may have moved.',
    canonical: url('/'),
    robots: 'noindex, follow',
    ogType: 'website',
    image: url(SITE.ogImage),
    jsonLd: [],
  },
  body: shellHtml('That page isn’t here.', 'The link may be out of date, or the page may have moved.'),
}));

// ── Crawl files ──────────────────────────────────────────────────────────────
// Also served from netlify/functions/crawl.js so they stay current between
// deploys; these are the same bytes, written for any host without the function.

writeFileSync(join(DIST, 'robots.txt'), robotsTxt());
writeFileSync(join(DIST, 'sitemap.xml'), sitemapXml(allPosts));
writeFileSync(join(DIST, 'rss.xml'), rssXml(allPosts));
writeFileSync(join(DIST, 'llms.txt'), llmsTxt(allPosts));

console.log(
  `SEO assets from ${postSource}: ${written} pre-rendered pages ` +
  `(${ROUTES.length} static, ${hubs} topic hubs, ${allPosts.length} posts` +
  `${dbOnly ? `, ${dbOnly} of them published from /admin` : ''}), ` +
  `sitemap.xml, rss.xml, robots.txt, llms.txt, 404.html`,
);
if (missingDates.length) {
  console.warn(`  warning: no publication date for ${missingDates.length} slug(s); ` +
    `lastmod omitted: ${missingDates.map((p) => p.slug).join(', ')}`);
}
