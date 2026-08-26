import React from 'react';

const GRID_BG = {
  backgroundImage: `linear-gradient(rgba(11,15,18,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(11,15,18,0.07) 1px, transparent 1px)`,
  backgroundSize: '32px 32px',
};

export default function Blog({ onNavigate }) {
  const [posts, setPosts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('/.netlify/functions/get-posts')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setPosts(data); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ ...GRID_BG, minHeight: '100vh', background: 'var(--paper-100)', paddingBottom: 96 }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '80px 32px 0' }}>

        <div style={{ marginBottom: 64 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-400)', marginBottom: 16 }}>
            Loogo Labs — Signal
          </div>
          <h1 style={{ fontSize: 'var(--fs-display-2)', fontWeight: 700, letterSpacing: '-0.035em', lineHeight: 0.94, margin: '0 0 20px', color: 'var(--ink-900)' }}>
            Intelligence on AI<br />in operations.
          </h1>
          <p style={{ fontSize: 'var(--fs-body-lg)', color: 'var(--ink-400)', maxWidth: 540, margin: 0, lineHeight: 1.55 }}>
            No hype. No noise. Practical analysis for operators making real decisions about AI.
          </p>
        </div>

        {loading ? (
          <div style={{ color: 'var(--ink-400)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>Loading posts…</div>
        ) : posts.length === 0 ? (
          <div style={{ color: 'var(--ink-400)', fontSize: 'var(--fs-body)', padding: '60px 0', borderTop: '1px solid var(--border-hair)' }}>
            First edition coming soon.
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 0, borderTop: '1px solid var(--border-hair)' }}>
            {posts.map((post, i) => (
              <PostCard key={post.id} post={post} index={i} onNavigate={onNavigate} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PostCard({ post, index, onNavigate }) {
  const [hover, setHover] = React.useState(false);
  const tags = post.tags ? post.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
  const date = post.published_at ? new Date(post.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '';

  return (
    <div
      onClick={() => onNavigate('BlogPost', post.slug)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'grid', gridTemplateColumns: '1fr auto', gap: 32, alignItems: 'start',
        padding: '36px 0', borderBottom: '1px solid var(--border-hair)',
        cursor: 'pointer', background: hover ? 'rgba(11,15,18,0.02)' : 'transparent',
        transition: 'background 90ms ease',
      }}
    >
      <div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
          {tags.map(tag => (
            <span key={tag} style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--cyan-700)', background: 'rgba(0,229,255,0.07)', border: '1px solid rgba(0,229,255,0.2)', borderRadius: 'var(--radius-1)', padding: '2px 7px' }}>
              {tag}
            </span>
          ))}
        </div>
        <h2 style={{ margin: '0 0 10px', fontSize: 'var(--fs-h2)', fontWeight: 700, letterSpacing: 'var(--ls-h2)', color: hover ? 'var(--cyan-700)' : 'var(--ink-900)', transition: 'color 90ms ease' }}>
          {post.title}
        </h2>
        {post.excerpt && (
          <p style={{ margin: 0, fontSize: 'var(--fs-body)', color: 'var(--ink-400)', lineHeight: 1.6, maxWidth: 640 }}>
            {post.excerpt}
          </p>
        )}
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0, paddingTop: 4 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-400)', marginBottom: 6 }}>{date}</div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-300)' }}>{post.read_time} min read</div>
        {post.views > 0 && (
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-300)', marginTop: 4 }}>{post.views} views</div>
        )}
      </div>
    </div>
  );
}
