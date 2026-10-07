import React from 'react';
import { ROUTES, BLOG_BASE, url } from '../../lib/seo';

// Pages the homepage already links to — through the nav bar (App.jsx `nav`),
// the footer columns, and the homepage body itself. Keep in step with those.
const LINKED_FROM_HOME = new Set([
  'Home', 'Mission', 'AIVoice', 'LoogoNews', 'GrowCFL', 'Quizzes', 'Privacy', 'Terms',
]);

export default function Links() {
  const [posts, setPosts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [copied, setCopied] = React.useState(null);

  React.useEffect(() => {
    fetch('/.netlify/functions/get-posts')
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setPosts(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const pages = ROUTES.filter((r) => !LINKED_FROM_HOME.has(r.page))
    .map((r) => ({ key: r.page, label: r.page + (r.unlisted ? ' (unlisted)' : ''), href: r.path, full: url(r.path) }));
  // The featured post is linked from the homepage hero line; every other post isn't.
  const postLinks = posts.filter((p) => p.status === 'published' && !p.featured)
    .map((p) => ({ key: p.slug, label: p.title, href: `${BLOG_BASE}/${p.slug}`, full: url(`${BLOG_BASE}/${p.slug}`) }));

  function copy(href) {
    navigator.clipboard?.writeText(href).then(() => {
      setCopied(href);
      setTimeout(() => setCopied(null), 1500);
    }).catch(() => {});
  }

  const section = (title, rows) => (
    <div style={{ padding: '20px 32px' }}>
      <h2 style={{ margin: '0 0 10px', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-400)', fontWeight: 500 }}>
        {title} ({rows.length})
      </h2>
      {rows.length === 0 ? (
        <div style={{ color: 'var(--ink-400)', fontSize: 13 }}>{loading ? 'Loading…' : 'None.'}</div>
      ) : rows.map((row) => (
        <div key={row.key} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border-hair)', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 260px', minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink-900)' }}>{row.label}</div>
            <a href={row.href} target="_blank" rel="noopener noreferrer"
              style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--cyan-700)', wordBreak: 'break-all' }}>{row.full}</a>
          </div>
          <button onClick={() => copy(row.full)}
            style={{ padding: '5px 10px', background: 'none', border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-1)', fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-body)', color: 'var(--ink-600)' }}>
            {copied === row.full ? 'Copied' : 'Copy'}
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div className="ll-admin-content-header" style={{ padding: '20px 32px 16px', borderBottom: '1px solid var(--border-hair)', flexShrink: 0, background: 'var(--paper-100)' }}>
        <h1 style={{ margin: 0, fontSize: 'var(--fs-h1)', fontWeight: 700, letterSpacing: 'var(--ls-h1)' }}>Backlinks</h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--ink-400)' }}>
          Pages and posts not linked from the homepage — useful for sharing and building backlinks.
        </p>
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {section('Pages', pages)}
        {section('Industry LoogoBlog posts', postLinks)}
      </div>
    </div>
  );
}
