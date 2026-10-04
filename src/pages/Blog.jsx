import React from 'react';
import BlogSidebar from './BlogSidebar';
import { BLOG_BASE, applyHead, headForPage, blogLd } from '../lib/seo';

export default function Blog({ onNavigate }) {
  const [posts, setPosts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [topic, setTopic] = React.useState(null);

  React.useEffect(() => {
    fetch('/.netlify/functions/get-posts')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setPosts(data); })
      .finally(() => setLoading(false));
  }, []);

  // Re-publish the index's structured data once the real post list is in, so the
  // Blog node lists the posts a visitor actually sees.
  React.useEffect(() => {
    if (!posts.length) return;
    const head = headForPage('LoogoNews');
    applyHead({ ...head, jsonLd: [...head.jsonLd, blogLd(posts)] });
  }, [posts]);

  // An editor-picked featured post gets the spotlight layout. With none picked,
  // the newest post leads in the plain "Latest post" card, as before.
  const spotlight = posts.find(p => p.featured) || null;
  const featured = spotlight || posts[0] || null;
  const rest = posts.filter(p => p !== featured);
  const shown = topic
    ? rest.filter(p => (p.tags || '').split(',').some(t => t.trim() === topic))
    : rest;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper-100)' }}>

      {/* ── MASTHEAD ── */}
      <div className="ll-grid-bg--inverse ln-masthead" style={{ background: 'var(--ink-900)' }}>
        <img className="ln-masthead__art" src="/loogonews-masthead.png" alt="" aria-hidden="true" width="720" height="713" decoding="async" />
        <div className="ln-masthead__inner" style={{ maxWidth: 1240, margin: '0 auto', padding: 'clamp(48px,7vw,88px) 32px clamp(40px,5vw,72px)' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink-400)', marginBottom: 24 }}>
            Loogo Labs · LoogoNews
          </div>
          <div className="ln-masthead__copy">
            <h1 style={{ margin: 0, fontWeight: 800, fontSize: 'clamp(48px,7vw,96px)', lineHeight: 0.9, letterSpacing: '-0.04em', color: 'var(--paper-100)' }}>
              Marketing<br /><span style={{ color: 'var(--cyan-500)', fontStyle: 'italic' }}>News.</span>
            </h1>
            <p style={{ margin: 0, maxWidth: '38ch', fontSize: 16, lineHeight: 1.7, color: 'var(--ink-300)' }}>
              Operational guides, automation strategies, and platform updates — written for business owners running on our system.
            </p>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(216,211,198,0.10)' }} />
      </div>

      {/* ── CONTENT ── */}
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 32px clamp(64px,8vw,112px)' }}>

        {loading ? (
          <div style={{ padding: '80px 0', color: 'var(--ink-400)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>
            Loading…
          </div>
        ) : posts.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="ln-layout">
           <div className="ln-layout__main">
            {spotlight
              ? <FeaturedSpotlight post={spotlight} onNavigate={onNavigate} />
              : featured && <FeaturedCard post={featured} onNavigate={onNavigate} />}

            {(rest.length > 0 || topic) && (
              <div style={{ marginTop: 2 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '36px 0 24px', borderTop: '1px solid var(--border-hair)' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-400)' }}>
                    {topic ? `Topic: ${topic}` : 'All posts'}
                  </span>
                  <div style={{ flex: 1, height: 1, background: 'var(--border-hair)' }} />
                  {topic && (
                    <button type="button" onClick={() => setTopic(null)} style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-700)', background: 'none', border: 0, cursor: 'pointer' }}>
                      Clear ✕
                    </button>
                  )}
                </div>
                <div className="ll-grid-2" style={{ gap: 1, background: 'var(--border-hair)', border: '1px solid var(--border-hair)' }}>
                  {shown.map(post => <PostCard key={post.id} post={post} onNavigate={onNavigate} />)}
                </div>
              </div>
            )}
           </div>
            <BlogSidebar posts={posts} topic={topic} onTopic={setTopic} onNavigate={onNavigate} />
          </div>
        )}
      </div>
    </div>
  );
}

// The editor-picked featured post. Deliberately louder than everything else on
// the page: a dark full-width panel that breaks the paper grid, a display-size
// title, the excerpt set as a pull quote, and a numbered "featured" rule.
function FeaturedSpotlight({ post, onNavigate }) {
  const [hover, setHover] = React.useState(false);
  const tags = post.tags ? post.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
  const date = post.published_at
    ? new Date(post.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : '';
  const mono = { fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase' };

  return (
    <a
      href={`${BLOG_BASE}/${post.slug}`}
      onClick={e => { e.preventDefault(); onNavigate('BlogPost', post.slug); }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-label={`Featured post: ${post.title}`}
      style={{ display: 'block', marginTop: 48, textDecoration: 'none', color: 'inherit' }}
    >
      <div className="ll-feature-label">
        <span className="ll-feature-star" aria-hidden="true">★</span>
        <span style={{ ...mono, fontSize: 10, color: 'var(--ink-900)', fontWeight: 700 }}>Featured</span>
        <div style={{ flex: 1, height: 1, background: 'var(--ink-900)' }} />
        <span style={{ ...mono, fontSize: 10, color: 'var(--ink-400)' }}>Editor's pick</span>
      </div>

      <div className="ll-grid-bg--inverse ll-feature-panel" style={{
        background: 'var(--ink-900)', color: 'var(--paper-100)',
        boxShadow: hover ? '8px 8px 0 var(--cyan-500)' : '4px 4px 0 var(--cyan-500)',
        transform: hover ? 'translate(-2px,-2px)' : 'none',
        transition: 'box-shadow 160ms ease, transform 160ms ease',
      }}>
        <div className="ll-feature-main">
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {tags.map(tag => (
              <span key={tag} style={{ ...mono, fontSize: 10, color: 'var(--ink-200)', border: '1px solid rgba(216,211,198,0.25)', borderRadius: 'var(--radius-1)', padding: '4px 10px' }}>
                {tag}
              </span>
            ))}
          </div>
          <h2 style={{ margin: '28px 0 0', fontWeight: 800, fontSize: 'clamp(30px,4.6vw,60px)', lineHeight: 1.04, letterSpacing: '-0.035em', maxWidth: '20ch' }}>
            {post.title}
          </h2>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginTop: 36, ...mono, fontWeight: 700, color: 'var(--cyan-500)' }}>
            Read the featured post
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 34, background: 'var(--cyan-500)', color: 'var(--ink-900)', borderRadius: '50%', fontSize: 15, transition: 'transform 160ms ease', transform: hover ? 'translateX(4px)' : 'none' }}>→</span>
          </div>
        </div>

        <aside className="ll-feature-side">
          {post.excerpt && (
            <p style={{ margin: 0, fontSize: 'clamp(17px,1.6vw,20px)', lineHeight: 1.6, color: 'var(--ink-200)', fontStyle: 'italic' }}>
              <span aria-hidden="true" style={{ display: 'block', fontSize: 56, lineHeight: 0.6, color: 'var(--cyan-500)', fontStyle: 'normal', fontWeight: 800, marginBottom: 14 }}>“</span>
              {post.excerpt}
            </p>
          )}
          <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '8px 16px', ...mono, fontSize: 10 }}>
            <dt style={{ color: 'var(--ink-400)' }}>By</dt><dd style={{ margin: 0, color: 'var(--paper-100)' }}>{post.author}</dd>
            {date && <><dt style={{ color: 'var(--ink-400)' }}>Published</dt><dd style={{ margin: 0, color: 'var(--paper-100)' }}><time dateTime={post.published_at}>{date}</time></dd></>}
            <dt style={{ color: 'var(--ink-400)' }}>Length</dt><dd style={{ margin: 0, color: 'var(--paper-100)' }}>{post.read_time} min read</dd>
          </dl>
        </aside>
      </div>
    </a>
  );
}

function FeaturedCard({ post, onNavigate }) {
  const [hover, setHover] = React.useState(false);
  const tags = post.tags ? post.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
  const date = post.published_at
    ? new Date(post.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : '';

  return (
    <a
      href={`${BLOG_BASE}/${post.slug}`}
      onClick={e => { e.preventDefault(); onNavigate('BlogPost', post.slug); }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ display: 'block', marginTop: 48, cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}
    >
      {/* Label row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 0 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-400)' }}>
          Latest post
        </span>
        <div style={{ flex: 1, height: 1, background: 'var(--border-hair)' }} />
      </div>

      {/* Card */}
      <div className="ll-2col" style={{
        gap: 0, background: hover ? 'var(--paper-000)' : 'var(--paper-200)',
        border: '1px solid var(--border-hair)', borderTop: '3px solid var(--ink-700)',
        transition: 'background 120ms ease', marginTop: 0,
      }}>
        {/* Left panel */}
        <div style={{ padding: 'clamp(28px,4vw,52px)', borderRight: '1px solid var(--border-hair)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 28, minHeight: 200 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {tags.map(tag => (
              <span key={tag} style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-700)', background: 'var(--paper-100)', border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-1)', padding: '4px 10px' }}>
                {tag}
              </span>
            ))}
          </div>
          <div>
            <time dateTime={post.published_at || undefined} style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-400)', marginBottom: 4 }}>{date}</time>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-300)' }}>{post.read_time} min read</div>
          </div>
        </div>

        {/* Right panel */}
        <div style={{ padding: 'clamp(28px,4vw,52px)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 24 }}>
          <div>
            <h2 style={{ margin: '0 0 18px', fontSize: 'clamp(22px,2.8vw,38px)', fontWeight: 700, lineHeight: 1.12, letterSpacing: '-0.025em', color: hover ? 'var(--ink-600)' : 'var(--ink-900)', transition: 'color 120ms ease' }}>
              {post.title}
            </h2>
            {post.excerpt && (
              <p style={{ margin: 0, fontSize: 16, lineHeight: 1.7, color: 'var(--ink-500)' }}>
                {post.excerpt}
              </p>
            )}
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-700)', fontWeight: 600 }}>
            Read the post
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, background: 'var(--ink-900)', color: 'var(--paper-100)', borderRadius: '50%', fontSize: 13, transition: 'transform 120ms ease', transform: hover ? 'translateX(3px)' : 'none' }}>→</span>
          </div>
        </div>
      </div>
    </a>
  );
}

function PostCard({ post, onNavigate }) {
  const [hover, setHover] = React.useState(false);
  const tags = post.tags ? post.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
  const date = post.published_at
    ? new Date(post.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    : '';

  return (
    <a
      href={`${BLOG_BASE}/${post.slug}`}
      onClick={e => { e.preventDefault(); onNavigate('BlogPost', post.slug); }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ background: hover ? 'var(--paper-000)' : 'var(--paper-100)', padding: '32px 28px', cursor: 'pointer', transition: 'background 120ms ease', display: 'flex', flexDirection: 'column', gap: 14, textDecoration: 'none', color: 'inherit' }}
    >
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {tags.map(tag => (
          <span key={tag} style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-500)', background: 'var(--paper-200)', border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-1)', padding: '2px 8px' }}>
            {tag}
          </span>
        ))}
      </div>
      <h3 style={{ margin: 0, fontSize: 'var(--fs-h3)', fontWeight: 700, lineHeight: 1.25, letterSpacing: 'var(--ls-h3)', color: hover ? 'var(--ink-600)' : 'var(--ink-900)', transition: 'color 120ms ease' }}>
        {post.title}
      </h3>
      {post.excerpt && (
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.65, color: 'var(--ink-400)' }}>
          {post.excerpt}
        </p>
      )}
      <div style={{ marginTop: 'auto', paddingTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 10, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-400)' }}>
          <time dateTime={post.published_at || undefined}>{date}</time>
          <span style={{ color: 'var(--ink-300)' }}>·</span>
          <span>{post.read_time} min read</span>
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: hover ? 'var(--ink-700)' : 'var(--ink-300)', transition: 'color 120ms ease' }}>→</span>
      </div>
    </a>
  );
}

function EmptyState() {
  return (
    <div style={{ padding: '96px 0 48px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, textAlign: 'center', borderTop: '1px solid var(--border-hair)', marginTop: 48 }}>
      <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--paper-200)', border: '1px solid var(--border-hair)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>✦</div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-400)' }}>Coming soon</div>
      <p style={{ margin: 0, fontSize: 16, color: 'var(--ink-500)', maxWidth: '30ch', lineHeight: 1.65 }}>
        First post is being written. Check back soon.
      </p>
    </div>
  );
}
