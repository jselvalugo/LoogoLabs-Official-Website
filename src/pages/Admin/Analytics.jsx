import React from 'react';
import { apiFetch } from '../../lib/identity';

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function Analytics() {
  const [posts, setPosts] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    apiFetch('/.netlify/functions/get-posts')
      .then(r => r?.json())
      .then(data => { if (Array.isArray(data)) setPosts(data); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div style={{ padding: '40px 24px', color: 'var(--ink-400)', fontSize: 13 }}>Loading…</div>;
  }

  const all = posts || [];
  const published = all.filter(p => p.status === 'published');
  const drafts = all.filter(p => p.status === 'draft');
  const archived = all.filter(p => p.status === 'archived');

  const totalViews = all.reduce((sum, p) => sum + (Number(p.views) || 0), 0);
  const publishedViews = published.reduce((sum, p) => sum + (Number(p.views) || 0), 0);
  const avgViewsPerPublished = published.length ? Math.round(publishedViews / published.length) : 0;
  const avgReadTime = all.length ? (all.reduce((sum, p) => sum + (Number(p.read_time) || 0), 0) / all.length).toFixed(1) : 0;

  const topPosts = [...all].sort((a, b) => (Number(b.views) || 0) - (Number(a.views) || 0)).slice(0, 8);
  const needsAttention = [...published]
    .sort((a, b) => (Number(a.views) || 0) - (Number(b.views) || 0))
    .slice(0, 5);

  // Views + post count by tag
  const tagViews = {};
  const tagCounts = {};
  all.forEach(p => {
    (p.tags || '').split(',').map(t => t.trim()).filter(Boolean).forEach(tag => {
      tagViews[tag] = (tagViews[tag] || 0) + (Number(p.views) || 0);
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });
  const topTagsByViews = Object.entries(tagViews).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const maxTagViews = topTagsByViews[0]?.[1] || 1;
  const topTagsByCount = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const maxTagCount = topTagsByCount[0]?.[1] || 1;

  // Author breakdown
  const authorCounts = {};
  all.forEach(p => { const a = p.author || 'Unknown'; authorCounts[a] = (authorCounts[a] || 0) + 1; });
  const authors = Object.entries(authorCounts).sort((a, b) => b[1] - a[1]);
  const maxAuthor = authors[0]?.[1] || 1;

  // Publishing cadence — last 6 months
  const now = new Date();
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return { key: `${d.getFullYear()}-${d.getMonth()}`, label: `${MONTH_LABELS[d.getMonth()]} ${String(d.getFullYear()).slice(2)}` };
  });
  const cadenceCounts = months.map(({ key, label }) => {
    const [y, m] = key.split('-').map(Number);
    const count = published.filter(p => {
      if (!p.published_at) return false;
      const d = new Date(p.published_at);
      return d.getFullYear() === y && d.getMonth() === m;
    }).length;
    return { label, count };
  });
  const maxCadence = Math.max(1, ...cadenceCounts.map(c => c.count));

  // Draft-to-publish latency
  const latencies = published
    .filter(p => p.created_at && p.published_at)
    .map(p => (new Date(p.published_at) - new Date(p.created_at)) / (1000 * 60 * 60 * 24));
  const avgLatency = latencies.length ? (latencies.reduce((s, v) => s + v, 0) / latencies.length).toFixed(1) : null;

  const recentlyUpdated = [...all].sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)).slice(0, 6);

  return (
    <div style={{ padding: '28px 32px 56px', overflowY: 'auto', flex: 1 }} className="ll-admin-content">
      <h1 style={{ margin: '0 0 24px', fontSize: 'var(--fs-h1)', fontWeight: 700, letterSpacing: 'var(--ls-h1)' }}>Analytics</h1>

      {/* ── TOP-LEVEL STATS ── */}
      <div className="ll-grid-4" style={{ gap: 12, marginBottom: 32 }}>
        {[
          { label: 'Total posts', value: all.length },
          { label: 'Published', value: published.length, accent: true },
          { label: 'Drafts', value: drafts.length },
          { label: 'Archived', value: archived.length },
        ].map(({ label, value, accent }) => (
          <StatCard key={label} label={label} value={value} accent={accent} />
        ))}
      </div>

      <div className="ll-grid-4" style={{ gap: 12, marginBottom: 36 }}>
        {[
          { label: 'Total views (all)', value: totalViews },
          { label: 'Views (published)', value: publishedViews, accent: true },
          { label: 'Avg views / published', value: avgViewsPerPublished },
          { label: 'Avg read time', value: `${avgReadTime} min` },
        ].map(({ label, value, accent }) => (
          <StatCard key={label} label={label} value={value} accent={accent} />
        ))}
      </div>

      <div className="ll-grid-2" style={{ gap: 20, marginBottom: 32 }}>
        {/* Top posts */}
        <Panel title="Top posts by views">
          {topPosts.length === 0 ? <Empty /> : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 340 }}>
                <thead>
                  <tr style={{ background: 'var(--paper-200)' }}>
                    {['Title', 'Status', 'Views'].map(h => <th key={h} style={thStyle}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {topPosts.map(p => (
                    <tr key={p.id} style={{ borderTop: '1px solid var(--border-hair)' }}>
                      <td style={tdStyle}>
                        <div style={{ fontWeight: 500, maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</div>
                      </td>
                      <td style={tdStyle}><StatusPill status={p.status} /></td>
                      <td style={{ ...tdStyle, fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--cyan-700)' }}>{p.views || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>

        {/* Needs attention */}
        <Panel title="Published, lowest views">
          {needsAttention.length === 0 ? <Empty text="No published posts yet." /> : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 340 }}>
                <thead>
                  <tr style={{ background: 'var(--paper-200)' }}>
                    {['Title', 'Published', 'Views'].map(h => <th key={h} style={thStyle}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {needsAttention.map(p => (
                    <tr key={p.id} style={{ borderTop: '1px solid var(--border-hair)' }}>
                      <td style={tdStyle}>
                        <div style={{ fontWeight: 500, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</div>
                      </td>
                      <td style={{ ...tdStyle, fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-400)' }}>{formatDate(p.published_at)}</td>
                      <td style={{ ...tdStyle, fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{p.views || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>
      </div>

      <div className="ll-grid-2" style={{ gap: 20, marginBottom: 32 }}>
        {/* Views by tag */}
        <Panel title="Views by tag">
          {topTagsByViews.length === 0 ? <Empty /> : (
            <div style={{ display: 'grid', gap: 12 }}>
              {topTagsByViews.map(([tag, n]) => <BarRow key={tag} label={tag} value={n} max={maxTagViews} />)}
            </div>
          )}
        </Panel>

        {/* Post count by tag */}
        <Panel title="Posts by tag">
          {topTagsByCount.length === 0 ? <Empty /> : (
            <div style={{ display: 'grid', gap: 12 }}>
              {topTagsByCount.map(([tag, n]) => <BarRow key={tag} label={tag} value={n} max={maxTagCount} />)}
            </div>
          )}
        </Panel>
      </div>

      <div className="ll-grid-2" style={{ gap: 20, marginBottom: 32 }}>
        {/* Publishing cadence */}
        <Panel title="Publishing cadence (last 6 months)">
          <div style={{ display: 'grid', gap: 12 }}>
            {cadenceCounts.map(({ label, count }) => <BarRow key={label} label={label} value={count} max={maxCadence} />)}
          </div>
        </Panel>

        {/* Authors */}
        <Panel title="Posts by author">
          {authors.length === 0 ? <Empty /> : (
            <div style={{ display: 'grid', gap: 12 }}>
              {authors.map(([author, n]) => <BarRow key={author} label={author} value={n} max={maxAuthor} />)}
            </div>
          )}
        </Panel>
      </div>

      <div className="ll-grid-2" style={{ gap: 20 }}>
        {/* Draft-to-publish latency */}
        <Panel title="Draft-to-publish speed">
          <div style={{ display: 'grid', gap: 4 }}>
            <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--ink-900)' }}>
              {avgLatency !== null ? `${avgLatency}d` : '—'}
            </div>
            <div style={{ fontSize: 12, color: 'var(--ink-400)' }}>
              {avgLatency !== null
                ? `Average time from draft creation to publish across ${latencies.length} post${latencies.length === 1 ? '' : 's'}.`
                : 'No published posts with recorded draft dates yet.'}
            </div>
          </div>
        </Panel>

        {/* Recently updated */}
        <Panel title="Recently updated">
          {recentlyUpdated.length === 0 ? <Empty /> : (
            <div style={{ display: 'grid', gap: 0 }}>
              {recentlyUpdated.map(p => (
                <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, padding: '8px 0', borderTop: '1px solid var(--border-hair)' }}>
                  <span style={{ fontSize: 13, color: 'var(--ink-700)', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.title}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-400)', whiteSpace: 'nowrap' }}>{formatDate(p.updated_at)}</span>
                </div>
              ))}
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}

function StatCard({ label, value, accent }) {
  return (
    <div style={{ background: 'var(--paper-000)', border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-2)', padding: '16px 18px' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-400)' }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.03em', marginTop: 6, color: accent ? 'var(--cyan-700)' : 'var(--ink-900)' }}>{value}</div>
    </div>
  );
}

function Panel({ title, children }) {
  return (
    <div style={{ background: 'var(--paper-000)', border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-2)', padding: '20px 22px' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-400)', marginBottom: 16 }}>{title}</div>
      {children}
    </div>
  );
}

function BarRow({ label, value, max }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, gap: 12 }}>
        <span style={{ fontSize: 13, color: 'var(--ink-700)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-400)', flexShrink: 0 }}>{value}</span>
      </div>
      <div style={{ height: 4, background: 'var(--paper-200)', borderRadius: 2 }}>
        <div style={{ height: '100%', width: `${(value / max) * 100}%`, background: 'var(--ink-700)', borderRadius: 2 }} />
      </div>
    </div>
  );
}

function StatusPill({ status }) {
  const colors = { published: { bg: 'rgba(47,208,126,0.12)', color: '#065F46' }, draft: { bg: 'rgba(90,100,120,0.1)', color: 'var(--ink-500)' }, archived: { bg: 'rgba(255,74,61,0.08)', color: '#991B1B' } };
  const c = colors[status] || colors.draft;
  return (
    <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 600, fontFamily: 'var(--font-mono)', letterSpacing: '0.06em', textTransform: 'uppercase', background: c.bg, color: c.color }}>
      {status}
    </span>
  );
}

function Empty({ text = 'No data yet.' }) {
  return <div style={{ fontSize: 13, color: 'var(--ink-400)' }}>{text}</div>;
}

const thStyle = { padding: '8px 12px', textAlign: 'left', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-400)', fontWeight: 500 };
const tdStyle = { padding: '10px 12px', fontSize: 13, color: 'var(--ink-900)', verticalAlign: 'middle' };
