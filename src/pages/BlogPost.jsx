import React from 'react';

const GRID_BG = {
  backgroundImage: `linear-gradient(rgba(11,15,18,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(11,15,18,0.07) 1px, transparent 1px)`,
  backgroundSize: '32px 32px',
};

export default function BlogPost({ slug, onNavigate }) {
  const [post, setPost] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [notFound, setNotFound] = React.useState(false);

  React.useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setNotFound(false);
    fetch(`/.netlify/functions/get-post?slug=${encodeURIComponent(slug)}`)
      .then(r => { if (r.status === 404) { setNotFound(true); return null; } return r.json(); })
      .then(data => { if (data) setPost(data); })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div style={{ ...GRID_BG, minHeight: '100vh', background: 'var(--paper-100)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--ink-400)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>Loading…</div>
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div style={{ ...GRID_BG, minHeight: '100vh', background: 'var(--paper-100)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--fs-h1)', fontWeight: 700, marginBottom: 16 }}>Post not found.</div>
          <button onClick={() => onNavigate('Blog')} style={linkBtn}>← Back to Signal</button>
        </div>
      </div>
    );
  }

  const tags = post.tags ? post.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
  const date = post.published_at ? new Date(post.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '';

  return (
    <div style={{ ...GRID_BG, minHeight: '100vh', background: 'var(--paper-100)', paddingBottom: 120 }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '64px 32px 0' }}>

        <button onClick={() => onNavigate('Blog')} style={{ ...linkBtn, marginBottom: 40 }}>← Signal</button>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
          {tags.map(tag => (
            <span key={tag} style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--cyan-700)', background: 'rgba(0,229,255,0.07)', border: '1px solid rgba(0,229,255,0.2)', borderRadius: 'var(--radius-1)', padding: '2px 7px' }}>
              {tag}
            </span>
          ))}
        </div>

        <h1 style={{ fontSize: 'var(--fs-display-3)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1, margin: '0 0 20px', color: 'var(--ink-900)' }}>
          {post.title}
        </h1>

        <div style={{ display: 'flex', gap: 20, alignItems: 'center', marginBottom: 48, paddingBottom: 32, borderBottom: '1px solid var(--border-hair)' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-400)' }}>{post.author}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-300)' }}>·</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-400)' }}>{date}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-300)' }}>·</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-400)' }}>{post.read_time} min read</span>
          {post.views > 0 && (
            <>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-300)' }}>·</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-300)' }}>{post.views} views</span>
            </>
          )}
        </div>

        <div style={{ color: 'var(--ink-900)' }}>
          {renderMarkdown(post.content)}
        </div>

        <div style={{ marginTop: 80, paddingTop: 32, borderTop: '1px solid var(--border-hair)' }}>
          <button onClick={() => onNavigate('Blog')} style={linkBtn}>← Back to Signal</button>
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

    if (trimmed.startsWith('## ')) {
      return <h2 key={i} style={h2Style}>{inlineRender(trimmed.slice(3))}</h2>;
    }
    if (trimmed.startsWith('### ')) {
      return <h3 key={i} style={h3Style}>{inlineRender(trimmed.slice(4))}</h3>;
    }
    const lines = trimmed.split('\n');
    if (lines.every(l => l.trim().startsWith('- ') || l.trim().startsWith('* '))) {
      return (
        <ul key={i} style={{ margin: '0 0 24px', paddingLeft: 24, lineHeight: 1.7 }}>
          {lines.map((l, j) => (
            <li key={j} style={{ fontSize: 'var(--fs-body)', color: 'var(--ink-700)', marginBottom: 6 }}>
              {inlineRender(l.trim().slice(2))}
            </li>
          ))}
        </ul>
      );
    }
    if (trimmed.startsWith('> ')) {
      return (
        <blockquote key={i} style={{ margin: '0 0 24px', paddingLeft: 20, borderLeft: '3px solid var(--cyan-500)', color: 'var(--ink-500)', fontSize: 'var(--fs-body-lg)', fontStyle: 'italic', lineHeight: 1.6 }}>
          {inlineRender(trimmed.slice(2))}
        </blockquote>
      );
    }
    return <p key={i} style={{ margin: '0 0 24px', fontSize: 'var(--fs-body)', lineHeight: 1.7, color: 'var(--ink-700)' }}>{inlineRender(trimmed)}</p>;
  });
}

function inlineRender(text) {
  const parts = [];
  const re = /(\*\*([^*]+)\*\*)|(\*([^*]+)\*)|(`([^`]+)`)/g;
  let last = 0, match;
  while ((match = re.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    if (match[1]) parts.push(<strong key={match.index}>{match[2]}</strong>);
    else if (match[3]) parts.push(<em key={match.index}>{match[4]}</em>);
    else if (match[5]) parts.push(<code key={match.index} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9em', background: 'var(--paper-200)', padding: '1px 5px', borderRadius: 3 }}>{match[6]}</code>);
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts.length === 1 ? parts[0] : parts;
}

const linkBtn = { background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.08em', color: 'var(--ink-400)', padding: 0, textTransform: 'uppercase' };
const h2Style = { fontSize: 'var(--fs-h2)', fontWeight: 700, letterSpacing: 'var(--ls-h2)', margin: '48px 0 16px', color: 'var(--ink-900)' };
const h3Style = { fontSize: 'var(--fs-h3)', fontWeight: 600, letterSpacing: 'var(--ls-h3)', margin: '36px 0 12px', color: 'var(--ink-900)' };
