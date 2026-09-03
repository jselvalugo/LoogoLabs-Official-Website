import React from 'react';
import { BOOKING_URL } from '../lib/booking';
import { BLOG_BASE, BLOG_INDEX, applyHead, headForPost } from '../lib/seo';
import { relatedPosts, topicPath, topicsForPost } from '../lib/topics';

export default function BlogPost({ slug, onNavigate }) {
  const [post, setPost] = React.useState(null);
  const [allPosts, setAllPosts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [notFound, setNotFound] = React.useState(false);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  React.useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setNotFound(false);
    fetch(`/.netlify/functions/get-post?slug=${encodeURIComponent(slug)}`)
      .then(r => { if (r.status === 404) { setNotFound(true); return null; } return r.json(); })
      .then(data => {
        if (data) {
          setPost(data);
          fetch('/.netlify/functions/track-view', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug }) });
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  // The related-posts block needs the whole feed, not just this post, so it can
  // rank candidates by shared topic. Fetched once and reused across navigations.
  React.useEffect(() => {
    fetch('/.netlify/functions/get-posts')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setAllPosts(data); })
      .catch(() => {});
  }, []);

  // Title, description, canonical and BlogPosting schema all come from the post
  // body, so they can only be set once it has loaded. Until then the pre-rendered
  // tags from the static shell stand.
  React.useEffect(() => {
    if (loading) return;
    applyHead(headForPost(notFound ? null : post));
  }, [loading, notFound, post]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--paper-100)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--ink-400)', fontFamily: 'var(--font-mono)', fontSize: 13, letterSpacing: '0.1em' }}>Loading…</div>
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--paper-100)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: '0 24px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-400)', marginBottom: 16 }}>404</div>
          <div style={{ fontSize: 'var(--fs-h2)', fontWeight: 700, marginBottom: 24, color: 'var(--ink-900)' }}>Post not found.</div>
          <a href={BLOG_INDEX} onClick={e => { e.preventDefault(); onNavigate('LoogoNews'); }} style={{ ...backBtn, textDecoration: 'none' }}>← Back to LoogoNews</a>
        </div>
      </div>
    );
  }

  const tags = post.tags ? post.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
  const date = post.published_at ? new Date(post.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '';
  const topics = topicsForPost(post);
  const related = relatedPosts(post, allPosts, 3);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper-100)' }}>

      {/* ── HERO HEADER ── */}
      <div className="ll-grid-bg--inverse" style={{ background: 'var(--ink-900)' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 32px' }}>

          {/* Back nav — a real breadcrumb link, so the post is not an orphan */}
          <nav aria-label="Breadcrumb" style={{ paddingTop: 'clamp(28px,4vw,40px)', paddingBottom: 24, borderBottom: '1px solid rgba(216,211,198,0.10)' }}>
            <a href={BLOG_INDEX} onClick={e => { e.preventDefault(); onNavigate('LoogoNews'); }}
              style={{ ...backBtnInverse, textDecoration: 'none' }}>
              ← LoogoNews
            </a>
          </nav>

          {/* Hero content */}
          <div style={{ maxWidth: 800, padding: 'clamp(36px,5vw,64px) 0 clamp(40px,5vw,72px)' }}>
            {/* Tags */}
            {tags.length > 0 && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
                {tags.map(tag => (
                  <span key={tag} style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-300)', background: 'rgba(216,211,198,0.08)', border: '1px solid rgba(216,211,198,0.15)', borderRadius: 'var(--radius-1)', padding: '4px 10px' }}>
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 style={{ margin: '0 0 32px', fontWeight: 800, fontSize: 'clamp(28px,4.5vw,58px)', lineHeight: 1.08, letterSpacing: '-0.03em', color: 'var(--paper-100)' }}>
              {post.title}
            </h1>

            {/* Meta row */}
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--ink-700)', border: '1px solid rgba(216,211,198,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: 'var(--paper-200)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                  {post.author ? post.author[0].toUpperCase() : 'L'}
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-300)', letterSpacing: '0.06em' }}>{post.author}</span>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-600)' }}>·</span>
              <time dateTime={post.published_at || undefined} style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-400)' }}>{date}</time>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-600)' }}>·</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-400)' }}>{post.read_time} min read</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 32px' }}>
        <div className="ll-post-layout">

          {/* Article content */}
          <article style={{ paddingTop: 'clamp(40px,5vw,64px)', paddingBottom: 'clamp(56px,7vw,96px)' }}>
            {post.excerpt && (
              <p style={{ margin: '0 0 40px', fontSize: 20, lineHeight: 1.65, color: 'var(--ink-500)', fontWeight: 400, borderLeft: '3px solid var(--ink-700)', paddingLeft: 20 }}>
                {post.excerpt}
              </p>
            )}

            <div style={{ fontSize: 17, lineHeight: 1.8, color: 'var(--ink-700)' }}>
              {renderMarkdown(post.content)}
            </div>

            {/* Filed under — the topic hub(s) this post belongs to */}
            {topics.length > 0 && (
              <div style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid var(--border-hair)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-400)', marginBottom: 12 }}>
                  Filed under
                </div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {topics.map(topic => (
                    <a key={topic.slug} href={topicPath(topic.slug)}
                      onClick={e => { e.preventDefault(); onNavigate('TopicHub', topic.slug); }}
                      style={{ fontSize: 13, color: 'var(--ink-700)', background: 'var(--paper-200)', border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-1)', padding: '6px 14px', textDecoration: 'none' }}>
                      {topic.name}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* CTA box */}
            <div style={{ marginTop: 40, padding: 'clamp(28px,4vw,44px)', background: 'var(--ink-900)', border: '1px solid var(--ink-800)' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-400)', marginBottom: 14 }}>
                Loogo Labs · Get started
              </div>
              <h3 style={{ margin: '0 0 14px', fontSize: 'clamp(18px,2.5vw,26px)', fontWeight: 700, lineHeight: 1.2, color: 'var(--paper-100)', letterSpacing: '-0.02em' }}>
                Want this running in your business?
              </h3>
              <p style={{ margin: '0 0 24px', fontSize: 15, lineHeight: 1.65, color: 'var(--ink-300)' }}>
                We set it up, run it, and optimize it every month. You just run your business.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                <a
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-900)', background: 'var(--paper-200)', padding: '12px 20px', textDecoration: 'none', fontWeight: 700, transition: 'background 120ms ease' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--paper-100)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'var(--paper-200)'; }}
                >
                  Book a free strategy call →
                </a>
                <a
                  href="/grow"
                  onClick={e => { e.preventDefault(); onNavigate('GrowCFL'); }}
                  style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-300)', textDecoration: 'underline' }}
                >
                  Based in Central Florida? See our local page →
                </a>
              </div>
            </div>

            {/* Related reading — same topic first, so a crawler and a reader both
                have somewhere to go next instead of dead-ending on this post. */}
            {related.length > 0 && (
              <div style={{ marginTop: 40, paddingTop: 24, borderTop: '1px solid var(--border-hair)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-400)', marginBottom: 16 }}>
                  Related reading
                </div>
                <div style={{ display: 'grid', gap: 16 }}>
                  {related.map(r => (
                    <a key={r.slug} href={`${BLOG_BASE}/${r.slug}`}
                      onClick={e => { e.preventDefault(); onNavigate('BlogPost', r.slug); }}
                      style={{ textDecoration: 'none', color: 'inherit' }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink-900)', marginBottom: 4 }}>{r.title}</div>
                      {r.excerpt && <div style={{ fontSize: 14, color: 'var(--ink-500)' }}>{r.excerpt}</div>}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Licence */}
            <div style={{ marginTop: 40, paddingTop: 24, borderTop: '1px solid var(--border-hair)', fontSize: 13, lineHeight: 1.7, color: 'var(--ink-500)' }}>
              Republish this. It is licensed under{' '}
              <a
                href="https://creativecommons.org/licenses/by/4.0/"
                target="_blank"
                rel="noopener noreferrer license"
                style={{ color: 'var(--ink-700)' }}
              >
                CC BY 4.0
              </a>
              {' '}— copy it, translate it, quote it, print it for your team. All we ask is a credit to Loogo Labs. No permission needed, no email required.
            </div>

            {/* Back link */}
            <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--border-hair)' }}>
              <a href={BLOG_INDEX} onClick={e => { e.preventDefault(); onNavigate('LoogoNews'); }} style={{ ...backBtn, textDecoration: 'none' }}>← Back to LoogoNews</a>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}

function renderMarkdown(text) {
  if (!text) return null;
  const blocks = text.split(/\n\n+/);
  return blocks.map((block, i) => {
    const trimmed = block.trim();
    if (!trimmed) return null;
    if (trimmed.startsWith('## ')) return <h2 key={i} style={h2Style}>{inlineRender(trimmed.slice(3))}</h2>;
    if (trimmed.startsWith('### ')) return <h3 key={i} style={h3Style}>{inlineRender(trimmed.slice(4))}</h3>;
    const lines = trimmed.split('\n');
    if (lines.every(l => l.trim().startsWith('- ') || l.trim().startsWith('* '))) {
      return (
        <ul key={i} style={{ margin: '0 0 28px', paddingLeft: 24, lineHeight: 1.8 }}>
          {lines.map((l, j) => (
            <li key={j} style={{ fontSize: 17, color: 'var(--ink-700)', marginBottom: 8 }}>
              {inlineRender(l.trim().slice(2))}
            </li>
          ))}
        </ul>
      );
    }
    if (trimmed.startsWith('> ')) {
      return (
        <blockquote key={i} style={{ margin: '0 0 28px', paddingLeft: 20, borderLeft: '3px solid var(--ink-600)', color: 'var(--ink-500)', fontSize: 19, fontStyle: 'italic', lineHeight: 1.65 }}>
          {inlineRender(trimmed.slice(2))}
        </blockquote>
      );
    }
    return <p key={i} style={{ margin: '0 0 28px', fontSize: 17, lineHeight: 1.8, color: 'var(--ink-700)' }}>{inlineRender(trimmed)}</p>;
  });
}

// Only the link targets a post is allowed to point at — internal paths, https
// URLs, and mailto:. Post bodies are also editable from /admin, so this has to
// hold even against a malicious or careless paste, not just what content/posts.mjs
// happens to contain today. Mirrors safeHref() in lib/render.js.
function safeHref(href) {
  const h = String(href || '').trim();
  if (/^\/(?!\/)/.test(h)) return h;
  if (/^https?:\/\//i.test(h)) return h;
  if (/^mailto:[^\s<>"']+$/i.test(h)) return h;
  return null;
}

function inlineRender(text) {
  const parts = [];
  const re = /(\[([^\]]+)\]\(([^)\s]+)\))|(\*\*([^*]+)\*\*)|(\*([^*]+)\*)|(`([^`]+)`)/g;
  let last = 0, match;
  while ((match = re.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    if (match[1]) {
      const safe = safeHref(match[3]);
      parts.push(safe
        ? <a key={match.index} href={safe} style={{ color: 'var(--ink-900)', textDecoration: 'underline' }}
            {...(safe.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{match[2]}</a>
        : match[2]);
    } else if (match[4]) parts.push(<strong key={match.index} style={{ fontWeight: 700, color: 'var(--ink-900)' }}>{match[5]}</strong>);
    else if (match[6]) parts.push(<em key={match.index}>{match[7]}</em>);
    else if (match[8]) parts.push(<code key={match.index} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.88em', background: 'var(--paper-200)', padding: '2px 6px', borderRadius: 3, color: 'var(--ink-800)' }}>{match[9]}</code>);
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts.length === 1 ? parts[0] : parts;
}

const backBtn = { background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-400)', padding: 0, transition: 'color 120ms ease' };
const backBtnInverse = { background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-400)', padding: 0, transition: 'color 120ms ease' };
const h2Style = { fontSize: 'clamp(20px,2.5vw,28px)', fontWeight: 700, letterSpacing: '-0.02em', margin: '48px 0 16px', color: 'var(--ink-900)', lineHeight: 1.2 };
const h3Style = { fontSize: 'clamp(17px,2vw,22px)', fontWeight: 600, letterSpacing: '-0.015em', margin: '36px 0 12px', color: 'var(--ink-900)', lineHeight: 1.25 };
