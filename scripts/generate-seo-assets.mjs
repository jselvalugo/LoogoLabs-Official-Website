// Post-build step: turns the single-page bundle into something a crawler can
// actually read.
//
//   vite build && node scripts/generate-seo-assets.mjs
//
// Vite emits one index.html for every URL on the site, which means every page
// shared the same <title>, the same description, no canonical, and no content
// until JavaScript had run. This script takes that shell and writes one real
// HTML file per route — correct head tags, JSON-LD, and the page's text already
// in the markup — plus robots.txt, sitemap.xml, an RSS feed, and llms.txt.
//
// Marketing pages are rendered with React at build time (src/entry-server.jsx)
// and marked data-ssr, so the client hydrates them in place. Other pages carry a
// plain fallback that createRoot().render() replaces on load.

import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { render } from '../dist-ssr/entry-server.js';
import { posts as sourcePosts } from '../content/posts.mjs';
import { readTime } from './generate-post-migration.mjs';
import {
  BLOG_BASE, BLOG_INDEX, ROUTES, SITE, blogLd, headForPage, headForPost,
  KNOWS_ABOUT, jsonLdForPage, ldGraph, splitTags, url,
} from '../src/lib/seo.js';
import { SERVICE_AREA } from '../src/lib/content.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const MIGRATIONS = join(ROOT, 'netlify/database/migrations');

// ── Publication dates ────────────────────────────────────────────────────────
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

const dates = publicationDates();
const missingDates = sourcePosts.filter((p) => !dates.has(p.slug));

const wordCount = (text) => String(text).trim().split(/\s+/).length;

// Newest first, matching the order the live feed serves.
const allPosts = sourcePosts
  .map((post) => ({
    ...post,
    author: SITE.author,
    read_time: readTime(post.content),
    word_count: wordCount(post.content),
    published_at: dates.get(post.slug) ?? null,
  }))
  .sort((a, b) => String(b.published_at ?? '').localeCompare(String(a.published_at ?? '')));

// ── Escaping ─────────────────────────────────────────────────────────────────

const esc = (s) => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

// A literal "</script>" inside JSON-LD would close the block early, and the
// Unicode line separators are not valid inside a JS string literal.
const escLd = (obj) => JSON.stringify(obj)
  .replace(/</g, '\\u003c')
  .replace(/\u2028/g, '\\u2028')
  .replace(/\u2029/g, '\\u2029');

// ── Markdown → HTML ──────────────────────────────────────────────────────────
// Mirrors renderMarkdown() in src/pages/BlogPost.jsx: the same subset of
// Markdown the posts are written in, so the pre-rendered article and the React
// article are the same document.

function inline(text) {
  return esc(text)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>');
}

function markdownToHtml(text) {
  return String(text || '').split(/\n\n+/).map((block) => {
    const trimmed = block.trim();
    if (!trimmed) return '';
    if (trimmed.startsWith('## ')) return `<h2>${inline(trimmed.slice(3))}</h2>`;
    if (trimmed.startsWith('### ')) return `<h3>${inline(trimmed.slice(4))}</h3>`;
    if (trimmed.startsWith('> ')) return `<blockquote><p>${inline(trimmed.slice(2))}</p></blockquote>`;
    const lines = trimmed.split('\n');
    if (lines.every((l) => /^\s*[-*] /.test(l))) {
      return `<ul>${lines.map((l) => `<li>${inline(l.trim().slice(2))}</li>`).join('')}</ul>`;
    }
    return `<p>${inline(trimmed)}</p>`;
  }).filter(Boolean).join('\n');
}

// ── HTML shell ───────────────────────────────────────────────────────────────

const template = readFileSync(join(DIST, 'index.html'), 'utf8');

const NAV_LINKS = ROUTES
  .filter((r) => r.page !== 'Home' && !r.unlisted)
  .map((r) => `<li><a href="${r.path}">${esc(r.label || r.page)}</a></li>`)
  .join('');

function headTags(head) {
  const a = head.article;
  const tags = [
    `<title>${esc(head.title)}</title>`,
    `<meta name="description" content="${esc(head.description)}" />`,
    `<meta name="robots" content="${esc(head.robots)}" />`,
    `<link rel="canonical" href="${esc(head.canonical)}" />`,
    `<meta property="og:type" content="${esc(head.ogType)}" />`,
    `<meta property="og:site_name" content="${esc(SITE.name)}" />`,
    `<meta property="og:locale" content="${esc(SITE.locale)}" />`,
    `<meta property="og:title" content="${esc(head.title)}" />`,
    `<meta property="og:description" content="${esc(head.description)}" />`,
    `<meta property="og:url" content="${esc(head.canonical)}" />`,
    `<meta property="og:image" content="${esc(head.image)}" />`,
    `<meta property="og:image:width" content="${SITE.ogImageWidth}" />`,
    `<meta property="og:image:height" content="${SITE.ogImageHeight}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(head.title)}" />`,
    `<meta name="twitter:description" content="${esc(head.description)}" />`,
    `<meta name="twitter:image" content="${esc(head.image)}" />`,
  ];
  if (a?.published) tags.push(`<meta property="article:published_time" content="${esc(a.published)}" />`);
  if (a?.modified) tags.push(`<meta property="article:modified_time" content="${esc(a.modified)}" />`);
  if (a?.author) tags.push(`<meta property="article:author" content="${esc(a.author)}" />`);
  for (const tag of a?.tags || []) tags.push(`<meta property="article:tag" content="${esc(tag)}" />`);
  tags.push(`<script type="application/ld+json" id="ld-json">${escLd(ldGraph(head.jsonLd || []))}</script>`);
  return tags.join('\n    ');
}

// Everything the template hard-codes for the homepage is stripped, then replaced
// with the tags for whichever route is being written.
function renderPage({ head, body, ssr = false }) {
  let html = template
    .replace(/<title>[\s\S]*?<\/title>\s*/, '')
    .replace(/[ \t]*<meta name="description"[^>]*>\s*/g, '')
    .replace(/[ \t]*<meta property="og:[^>]*>\s*/g, '')
    .replace(/[ \t]*<meta name="twitter:[^>]*>\s*/g, '')
    .replace(/[ \t]*<link rel="canonical"[^>]*>\s*/g, '')
    .replace(/[ \t]*<script type="application\/ld\+json"[\s\S]*?<\/script>\s*/g, '');

  html = html.replace('</head>', `  ${headTags(head)}\n  </head>`);
  return html.replace('<div id="root"></div>', `<div id="root"${ssr ? ' data-ssr' : ''}>${body}</div>`);
}

function write(routePath, html) {
  const dir = routePath === '/' ? DIST : join(DIST, routePath.replace(/^\//, ''));
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), html);
}

// Fallback markup rendered before React mounts. Kept to the page's real heading,
// its description, and the site's internal links — the same information the head
// tags carry, never extra keywords the visitor would not see.
const shell = (heading, lead, extra = '') => `
      <main>
        <a href="/">${esc(SITE.name)}</a>
        <h1>${esc(heading)}</h1>
        <p>${esc(lead)}</p>
        ${extra}
        <nav aria-label="Site"><ul>${NAV_LINKS}</ul></nav>
      </main>`;

// ── Static routes ────────────────────────────────────────────────────────────

import { NICHE_QUIZZES } from '../src/lib/nicheQuizzes.js';
import { SERVICE_PACKAGES } from '../src/lib/servicePackages.js';

const HEADINGS = {
  ...Object.fromEntries(NICHE_QUIZZES.map((q) => [q.page, q.headline])),
  ...Object.fromEntries(SERVICE_PACKAGES.map((p) => [p.page, `${p.headline} ${p.accent}`])),
  Home: 'More Customers. Less Busywork. We Run It for You.',
  Mission: 'We believe running a business should not require 15 different tools.',
  Company: 'Meet the founder',
  LoogoNews: 'Industry LoogoBlog',
  GrowCFL: 'Stop losing customers to businesses that respond faster.',
  AIReceptionist: 'A Full-Time Receptionist. Without The Full-Time Cost.',
  ReputationAutopilot: 'Every Completed Job Becomes A 5-Star Review Request.',
  Quizzes: 'Free fit-check quizzes for your business',
  Packages: 'Fixed scope. Fixed price. Done for you.',
  PressRelease: 'Get your business in the news. Starting at $149.',
  ParkSupply: 'Pet waste stations & dog park amenities',
  Privacy: 'Privacy Policy',
  Terms: 'Terms of Service',
};

let written = 0;

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
    // index is an empty page and all 29 posts are unreachable by crawl.
    head.jsonLd = [...jsonLdForPage('LoogoNews'), blogLd(allPosts)];
    extra = `<ul>${allPosts.map((p) => `<li><a href="${BLOG_BASE}/${p.slug}">${esc(p.title)}</a> — ${esc(p.excerpt)}</li>`).join('')}</ul>`;
  }

  // Marketing pages are rendered by React itself, so the HTML carries their full
  // copy and the client hydrates it. The blog index lists posts it fetches at
  // runtime, so it keeps the hand-built fallback above. Park Supply is a noindexed
  // quoting tool whose first render depends on localStorage and today's date, so
  // it cannot hydrate from build-time markup and gains nothing from it.
  if (route.page !== 'LoogoNews' && route.page !== 'ParkSupply') {
    write(route.path, renderPage({ head, body: await render(route.path), ssr: true }));
  } else {
    write(route.path, renderPage({ head, body: shell(HEADINGS[route.page] ?? route.page, route.description, extra) }));
  }
  written += 1;
}

// The admin console must never be indexed.
write('/admin', renderPage({
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

// ── Posts ────────────────────────────────────────────────────────────────────

for (const post of allPosts) {
  const head = headForPost(post);
  const tags = splitTags(post.tags);
  const body = `
      <main>
        <nav aria-label="Breadcrumb"><a href="/">${esc(SITE.name)}</a> / <a href="${BLOG_INDEX}">Industry LoogoBlog</a></nav>
        <article>
          <h1>${esc(post.title)}</h1>
          <p><span>${esc(post.author)}</span>${post.published_at ? ` · <time datetime="${esc(post.published_at)}">${esc(post.published_at.slice(0, 10))}</time>` : ''} · ${post.read_time} min read</p>
          ${tags.length ? `<p>${tags.map((t) => esc(t)).join(', ')}</p>` : ''}
          <p>${esc(post.excerpt)}</p>
          ${markdownToHtml(post.content)}
        </article>
        <p><a href="${BLOG_INDEX}">Back to Industry LoogoBlog</a></p>
        <nav aria-label="Site"><ul>${NAV_LINKS}</ul></nav>
      </main>`;
  write(`${BLOG_BASE}/${post.slug}`, renderPage({ head, body }));
  written += 1;
}

// ── 404 ──────────────────────────────────────────────────────────────────────
// Served with a real 404 status (see netlify.toml), so an unknown URL is no
// longer a 200-status copy of the homepage.

writeFileSync(join(DIST, '404.html'), renderPage({
  head: {
    title: `Page not found | ${SITE.name}`,
    description: 'That page isn’t here. The link may be out of date, or the page may have moved.',
    canonical: url('/'),
    robots: 'noindex, follow',
    ogType: 'website',
    image: url(SITE.ogImage),
    jsonLd: [],
  },
  body: shell('That page isn’t here.', 'The link may be out of date, or the page may have moved.'),
}));

// ── robots.txt ───────────────────────────────────────────────────────────────

// AI search and answer engines are named explicitly. The wildcard group already
// lets them in, but a crawler that matches a named group ignores the wildcard,
// so each named group repeats the same rules rather than relying on inheritance.
const AI_CRAWLERS = [
  'GPTBot', 'OAI-SearchBot', 'ChatGPT-User', // OpenAI / ChatGPT search
  'ClaudeBot', 'Claude-SearchBot', 'Claude-User', // Anthropic / Claude
  'PerplexityBot', 'Perplexity-User', // Perplexity
  'Google-Extended', // Gemini and AI Overviews grounding
  'Applebot', 'Applebot-Extended', // Siri, Spotlight, Apple Intelligence
  'Bingbot', // Bing index behind Copilot and ChatGPT search
  'meta-externalagent', // Meta AI
  'Amazonbot', 'DuckAssistBot', 'MistralAI-User', 'cohere-ai',
];
const crawlRules = `Allow: /
Disallow: /admin
Disallow: /.netlify/`;

writeFileSync(join(DIST, 'robots.txt'), `# ${SITE.name}
User-agent: *
${crawlRules}

# AI search and answer engines — welcome.
${AI_CRAWLERS.map((ua) => `User-agent: ${ua}`).join('\n')}
${crawlRules}

Sitemap: ${url('/sitemap.xml')}
`);

// ── sitemap.xml ──────────────────────────────────────────────────────────────

const buildDate = new Date().toISOString();

const urlEntry = ({ loc, lastmod, changefreq, priority }) => `  <url>
    <loc>${esc(loc)}</loc>
    <lastmod>${esc(lastmod)}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;

const newestPost = allPosts[0]?.published_at ?? buildDate;

const sitemapEntries = [
  ...ROUTES.filter((r) => !r.unlisted).map((r) => urlEntry({
    loc: url(r.path),
    lastmod: r.page === 'LoogoNews' ? newestPost : buildDate,
    changefreq: r.changefreq,
    priority: r.priority,
  })),
  ...allPosts.map((p) => urlEntry({
    loc: url(`${BLOG_BASE}/${p.slug}`),
    lastmod: p.published_at ?? buildDate,
    changefreq: 'monthly',
    priority: '0.7',
  })),
];

writeFileSync(join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries.join('\n')}
</urlset>
`);

// ── rss.xml ──────────────────────────────────────────────────────────────────
// The posts are CC BY 4.0, so a feed is worth having: it is how aggregators,
// newsletter tools, and AI crawlers pick content up without scraping.

const rfc822 = (iso) => new Date(iso ?? buildDate).toUTCString();

const rssItems = allPosts.slice(0, 30).map((p) => `    <item>
      <title>${esc(p.title)}</title>
      <link>${esc(url(`${BLOG_BASE}/${p.slug}`))}</link>
      <guid isPermaLink="true">${esc(url(`${BLOG_BASE}/${p.slug}`))}</guid>
      <pubDate>${rfc822(p.published_at)}</pubDate>
      <dc:creator>${esc(p.author)}</dc:creator>
${splitTags(p.tags).map((t) => `      <category>${esc(t)}</category>`).join('\n')}
      <description>${esc(p.excerpt)}</description>
    </item>`).join('\n');

writeFileSync(join(DIST, 'rss.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Industry LoogoBlog — ${esc(SITE.name)}</title>
    <link>${esc(url(BLOG_INDEX))}</link>
    <atom:link href="${esc(url('/rss.xml'))}" rel="self" type="application/rss+xml" />
    <description>Operational guides on lead follow-up, automation, and reputation for local service businesses.</description>
    <language>en-us</language>
    <copyright>CC BY 4.0 — ${esc(SITE.name)}</copyright>
    <lastBuildDate>${rfc822(newestPost)}</lastBuildDate>
${rssItems}
  </channel>
</rss>
`);

// ── llms.txt ─────────────────────────────────────────────────────────────────
// Every post is already published under CC BY 4.0 and asks only for a credit.
// Saying so in the format assistants look for makes the licence machine-readable
// instead of something buried in a footer.

writeFileSync(join(DIST, 'llms.txt'), `# ${SITE.name}

> ${SITE.description}

${SITE.name} builds and runs marketing systems for local service businesses —
CRM, missed-call text-back, follow-up automation, reputation management, and
local SEO — with setup and ongoing management handled for the owner.

All Industry LoogoBlog articles are published under CC BY 4.0. You may quote, translate,
and republish them; please credit ${SITE.name} and link back to the source URL.

## Key facts

- Name: ${SITE.name}
- Type: Marketing agency and marketing-automation platform for local service businesses
- Based in: ${SITE.address.addressLocality}, ${SITE.address.addressRegion} (Central Florida), founded by ${SITE.founder}
- Serves: ${SERVICE_AREA.join(', ')}; remote clients across the US
- Services: ${KNOWS_ABOUT.join(', ')}
- Who it's for: home services, healthcare and wellness, professional services, restaurants, and local retail
- Languages: English and Spanish
- Contact: ${SITE.email} · ${url('/grow')}

## Pages

${ROUTES.filter((r) => !r.unlisted).map((r) => `- [${r.label || r.page}](${url(r.path)}): ${r.description}`).join('\n')}

## Articles

${allPosts.map((p) => `- [${p.title}](${url(`${BLOG_BASE}/${p.slug}`)}): ${p.excerpt}`).join('\n')}

## Feeds

- [RSS](${url('/rss.xml')})
- [Sitemap](${url('/sitemap.xml')})
`);

console.log(
  `SEO assets: ${written} pre-rendered pages (${ROUTES.length} static, ${allPosts.length} posts), ` +
  `sitemap.xml, rss.xml, robots.txt, llms.txt, 404.html`,
);
if (missingDates.length) {
  console.warn(`  warning: no migration found for ${missingDates.length} slug(s); using build time as lastmod: ${missingDates.map((p) => p.slug).join(', ')}`);
}
