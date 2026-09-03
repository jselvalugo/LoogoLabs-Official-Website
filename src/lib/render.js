// Server-side HTML rendering, shared by two callers that must never disagree:
//
//   * scripts/generate-seo-assets.mjs, which writes a file per route at build time
//   * netlify/functions/render-post.js, which renders a post published from
//     /admin since the last build, on demand
//
// Both produce the same document for the same post, so a post's indexability
// does not depend on whether a deploy happened to run after it was published.
//
// The React app boots over the top of whatever this emits: createRoot().render()
// clears #root first, so this markup is a fallback for crawlers and slow
// connections, never something a visitor sees twice. That is also why it stays a
// subset of the rendered page rather than carrying links or text the visitor
// would not get — the two versions have to agree.

import {
  BLOG_BASE, BLOG_INDEX, ROUTES, SITE, crumbsForPost, ldGraph, splitTags,
  topicPath,
} from './seo.js';
import { topicsForPost } from './topics.js';

// ── Escaping ─────────────────────────────────────────────────────────────────

export const esc = (s) => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

// A literal "</script>" inside JSON-LD would close the block early, and the
// Unicode line separators are not valid inside a JS string literal.
export const escLd = (obj) => JSON.stringify(obj)
  .replace(/</g, '\\u003c')
  .replace(/\u2028/g, '\\u2028')
  .replace(/\u2029/g, '\\u2029');

// ── Markdown → HTML ──────────────────────────────────────────────────────────
// Mirrors renderMarkdown() in src/pages/BlogPost.jsx: the same subset of
// Markdown the posts are written in, so the pre-rendered article and the React
// article are the same document.

/**
 * Only the link targets a post is allowed to point at. Everything else — most of
 * all `javascript:` and `data:` — is dropped and the link renders as plain text,
 * because post bodies are also editable from /admin.
 */
export function safeHref(href) {
  const h = String(href || '').trim();
  if (/^\/(?!\/)/.test(h)) return h;                       // internal, not //evil.com
  if (/^https?:\/\//i.test(h)) return h;
  if (/^mailto:[^\s<>"']+$/i.test(h)) return h;
  return null;
}

export const isExternalHref = (href) => /^https?:\/\//i.test(href) && !href.startsWith(SITE.origin);

export function inline(text) {
  return esc(text)
    // Links first: the label may itself contain bold or code, and the href must
    // not be treated as emphasis when it contains an underscore or asterisk.
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (match, label, href) => {
      const safe = safeHref(href.replace(/&amp;/g, '&'));
      if (!safe) return label;
      const rel = isExternalHref(safe) ? ' rel="noopener noreferrer"' : '';
      return `<a href="${esc(safe)}"${rel}>${label}</a>`;
    })
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>');
}

export function markdownToHtml(text) {
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

// ── Head ─────────────────────────────────────────────────────────────────────

export function headTags(head) {
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

/**
 * Drop whatever the shell hard-codes for the homepage, add the tags for this
 * route, and put the fallback markup inside #root.
 */
export function renderPage(template, { head, body }) {
  let html = template
    .replace(/<title>[\s\S]*?<\/title>\s*/, '')
    .replace(/[ \t]*<meta name="description"[^>]*>\s*/g, '')
    .replace(/[ \t]*<meta name="robots"[^>]*>\s*/g, '')
    .replace(/[ \t]*<meta property="og:[^>]*>\s*/g, '')
    .replace(/[ \t]*<meta name="twitter:[^>]*>\s*/g, '')
    .replace(/[ \t]*<meta property="article:[^>]*>\s*/g, '')
    .replace(/[ \t]*<link rel="canonical"[^>]*>\s*/g, '')
    .replace(/[ \t]*<script type="application\/ld\+json"[\s\S]*?<\/script>\s*/g, '');

  html = html.replace('</head>', `  ${headTags(head)}\n  </head>`);
  return html.replace('<div id="root"></div>', `<div id="root">${body}</div>`);
}

// ── Shared body fragments ────────────────────────────────────────────────────

/** The site-wide link list, so no fallback page is a dead end. */
export const navHtml = () => `<nav aria-label="Site"><ul>${
  ROUTES.filter((r) => r.page !== 'Home')
    .map((r) => `<li><a href="${r.path}">${esc(r.label)}</a></li>`)
    .join('')
}</ul></nav>`;

/** The topic hubs, linked from every post and from the feed index. */
export const topicNavHtml = (topics) => `<nav aria-label="Topics"><ul>${
  topics.map((t) => `<li><a href="${topicPath(t.slug)}">${esc(t.name)}</a></li>`).join('')
}</ul></nav>`;

const crumbHtml = (crumbs) => `<nav aria-label="Breadcrumb">${
  crumbs.map((c, i) => (i === crumbs.length - 1
    ? `<span aria-current="page">${esc(c.name)}</span>`
    : `<a href="${c.path}">${esc(c.name)}</a>`)).join(' / ')
}</nav>`;

const postListHtml = (posts) => `<ul>${
  posts.map((p) => `<li><a href="${BLOG_BASE}/${p.slug}">${esc(p.title)}</a>${
    p.excerpt ? ` — ${esc(p.excerpt)}` : ''
  }</li>`).join('')
}</ul>`;

export { postListHtml };

/**
 * The fallback article. `related` and the topic links are the same ones the React
 * page renders, which is the point: a crawler that never runs the bundle still
 * sees every post reachable from every other post.
 */
export function postArticleHtml(post, { related = [] } = {}) {
  const topics = topicsForPost(post);
  const tags = splitTags(post.tags);
  const published = post.published_at || post.publishedAt;
  return `
      <main>
        ${crumbHtml(crumbsForPost(post))}
        <article>
          <h1>${esc(post.title)}</h1>
          <p><span>${esc(post.author || SITE.author)}</span>${
            published ? ` · <time datetime="${esc(published)}">${esc(String(published).slice(0, 10))}</time>` : ''
          } · ${esc(post.read_time || '')} min read</p>
          ${tags.length ? `<p>${tags.map((t) => esc(t)).join(', ')}</p>` : ''}
          ${post.excerpt ? `<p>${esc(post.excerpt)}</p>` : ''}
          ${markdownToHtml(post.content)}
        </article>
        ${topics.length ? `<section><h2>Filed under</h2>${topicNavHtml(topics)}</section>` : ''}
        ${related.length ? `<section><h2>Related reading</h2>${postListHtml(related)}</section>` : ''}
        <p><a href="${BLOG_INDEX}">Back to LoogoNews</a></p>
        <p><a href="/grow">Marketing systems for Central Florida service businesses</a></p>
        ${navHtml()}
      </main>`;
}

/** Minimal fallback for the routes that are not posts. */
export const shellHtml = (heading, lead, extra = '') => `
      <main>
        <a href="/">${esc(SITE.name)}</a>
        <h1>${esc(heading)}</h1>
        <p>${esc(lead)}</p>
        ${extra}
        ${navHtml()}
      </main>`;

/**
 * The unmodified Vite shell, written to the publish directory at build time so
 * render-post.js can fetch it at runtime instead of shipping its own copy of the
 * hashed asset URLs. Kept out of the index by netlify.toml and robots.txt.
 */
export const TEMPLATE_PATH = '/_template.html';
