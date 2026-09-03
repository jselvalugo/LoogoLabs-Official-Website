import React from 'react';
import { BLOG_BASE, BLOG_INDEX, applyHead, headForTopic } from '../lib/seo';
import { TOPICS, postsInTopic, topicBySlug, topicPath } from '../lib/topics';

export default function TopicHub({ slug, onNavigate }) {
  const [posts, setPosts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const topic = topicBySlug(slug);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  React.useEffect(() => {
    fetch('/.netlify/functions/get-posts')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setPosts(data); })
      .finally(() => setLoading(false));
  }, []);

  const inTopic = React.useMemo(() => (topic ? postsInTopic(topic, posts) : []), [topic, posts]);

  React.useEffect(() => {
    if (loading) return;
    applyHead(headForTopic(topic, posts));
  }, [loading, topic, posts]);

  if (!topic) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--paper-100)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: '0 24px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-400)', marginBottom: 16 }}>404</div>
          <div style={{ fontSize: 'var(--fs-h2)', fontWeight: 700, marginBottom: 24, color: 'var(--ink-900)' }}>Topic not found.</div>
          <a href={BLOG_INDEX} onClick={e => { e.preventDefault(); onNavigate('LoogoNews'); }} style={{ ...backBtn, textDecoration: 'none' }}>← Back to LoogoNews</a>
        </div>
      </div>
    );
  }

  const siblings = TOPICS.filter(t => t.slug !== topic.slug);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper-100)' }}>
      {/* ── MASTHEAD ── */}
      <div className="ll-grid-bg--inverse" style={{ background: 'var(--ink-900)' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: 'clamp(28px,4vw,40px) 32px clamp(40px,5vw,72px)' }}>
          <nav aria-label="Breadcrumb" style={{ marginBottom: 24 }}>
            <a href={BLOG_INDEX} onClick={e => { e.preventDefault(); onNavigate('LoogoNews'); }}
              style={{ ...backBtnInverse, textDecoration: 'none' }}>
              ← LoogoNews
            </a>
          </nav>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink-400)', marginBottom: 20 }}>
            Loogo Labs · LoogoNews · Topic
          </div>
          <h1 style={{ margin: '0 0 24px', fontWeight: 800, fontSize: 'clamp(32px,5vw,64px)', lineHeight: 1.05, letterSpacing: '-0.03em', color: 'var(--paper-100)', maxWidth: '22ch' }}>
            {topic.heading}
          </h1>
          <div style={{ maxWidth: 640, display: 'grid', gap: 14 }}>
            {topic.intro.map((para, i) => (
              <p key={i} style={{ margin: 0, fontSize: 16, lineHeight: 1.7, color: 'var(--ink-300)' }}>{para}</p>
            ))}
          </div>
        </div>
      </div>

      {/* ── POSTS ── */}
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 32px clamp(64px,8vw,112px)' }}>
        {loading ? (
          <div style={{ padding: '80px 0', color: 'var(--ink-400)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>Loading…</div>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '36px 0 24px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-400)' }}>
                {inTopic.length} {inTopic.length === 1 ? 'post' : 'posts'}
              </span>
              <div style={{ flex: 1, height: 1, background: 'var(--border-hair)' }} />
            </div>

            {inTopic.length === 0 ? (
              <div style={{ padding: '48px 0', color: 'var(--ink-500)', fontSize: 15 }}>
                No posts filed here yet. Check back soon.
              </div>
            ) : (
              <div className="ll-grid-2" style={{ gap: 1, background: 'var(--border-hair)', border: '1px solid var(--border-hair)' }}>
                {inTopic.map(post => <PostRow key={post.id ?? post.slug} post={post} onNavigate={onNavigate} />)}
              </div>
            )}

            {/* Other topics — keeps the hub graph fully connected */}
            <div style={{ marginTop: 56, paddingTop: 32, borderTop: '1px solid var(--border-hair)' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-400)', marginBottom: 16 }}>
                Other topics
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {siblings.map(t => (
                  <a key={t.slug} href={topicPath(t.slug)}
                    onClick={e => { e.preventDefault(); onNavigate('TopicHub', t.slug); }}
                    style={{ fontSize: 13, color: 'var(--ink-700)', background: 'var(--paper-200)', border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-1)', padding: '6px 14px', textDecoration: 'none' }}>
                    {t.name}
                  </a>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function PostRow({ post, onNavigate }) {
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
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.65, color: 'var(--ink-400)' }}>{post.excerpt}</p>
      )}
      <div style={{ marginTop: 'auto', paddingTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 10, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-400)' }}>
          <time dateTime={post.published_at || undefined}>{date}</time>
          {post.read_time ? (<><span style={{ color: 'var(--ink-300)' }}>·</span><span>{post.read_time} min read</span></>) : null}
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: hover ? 'var(--ink-700)' : 'var(--ink-300)', transition: 'color 120ms ease' }}>→</span>
      </div>
    </a>
  );
}

const backBtn = { background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-400)', padding: 0, transition: 'color 120ms ease' };
const backBtnInverse = { background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-400)', padding: 0, transition: 'color 120ms ease' };
