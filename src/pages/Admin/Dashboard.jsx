import React from 'react';
import { apiFetch } from '../../lib/identity';
import { StatusBadge, formatDate } from './shared';

export default function Dashboard({ onViewLeads }) {
  const [leads, setLeads] = React.useState(null);
  const [posts, setPosts] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    Promise.all([
      apiFetch('/.netlify/functions/get-leads').then(r => r?.json()),
      apiFetch('/.netlify/functions/get-posts').then(r => r?.json()),
    ]).then(([leadsData, postsData]) => {
      if (Array.isArray(leadsData)) setLeads(leadsData);
      if (Array.isArray(postsData)) setPosts(postsData);
      setLoading(false);
    });
  }, []);

  const count = s => (leads || []).filter(l => l.status === s).length;

  const totalViews = (posts || []).reduce((sum, p) => sum + (p.views || 0), 0);
  const publishedPosts = (posts || []).filter(p => p.status === 'published');

  const sourceCounts = (leads || []).reduce((acc, l) => {
    const key = l.referral || 'not specified';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const topSources = Object.entries(sourceCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxSource = topSources[0]?.[1] || 1;

  const thisWeek = (leads || []).filter(l => {
    const d = new Date(l.created_at);
    const now = new Date();
    const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
    return d >= weekAgo;
  }).length;

  return (
    <div style={{ padding: '36px 40px', overflowY: 'auto', flex: 1 }}>
      <h1 style={{ margin: '0 0 28px', fontSize: 'var(--fs-h1)', fontWeight: 700, letterSpacing: 'var(--ls-h1)' }}>Dashboard</h1>

      {loading ? <Spinner /> : (
        <>
          {/* ── LEAD STATS ── */}
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-400)', marginBottom: 12 }}>Leads</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 36 }}>
            {[
              { label: 'Total',     value: leads.length,      accent: false },
              { label: 'This week', value: thisWeek,          accent: true  },
              { label: 'New',       value: count('new'),       accent: false },
              { label: 'Contacted', value: count('contacted'), accent: false },
              { label: 'Converted', value: count('converted'), accent: false },
            ].map(({ label, value, accent }) => (
              <div key={label} style={{ background: 'var(--paper-000)', border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-2)', padding: '18px 20px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-400)' }}>{label}</div>
                <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.03em', marginTop: 6, color: accent ? 'var(--cyan-700)' : 'var(--ink-900)' }}>{value}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 36 }}>
            {/* Lead sources */}
            <div style={{ background: 'var(--paper-000)', border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-2)', padding: '20px 22px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-400)', marginBottom: 18 }}>Lead sources</div>
              {topSources.length === 0 ? (
                <div style={{ fontSize: 13, color: 'var(--ink-400)' }}>No data yet.</div>
              ) : (
                <div style={{ display: 'grid', gap: 12 }}>
                  {topSources.map(([source, n]) => (
                    <div key={source}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 13, color: 'var(--ink-700)', textTransform: 'capitalize' }}>{source.replace(/-/g, ' ')}</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-400)' }}>{n}</span>
                      </div>
                      <div style={{ height: 4, background: 'var(--paper-200)', borderRadius: 2 }}>
                        <div style={{ height: '100%', width: `${(n / maxSource) * 100}%`, background: 'var(--ink-700)', borderRadius: 2 }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* LoogoNews stats */}
            <div style={{ background: 'var(--paper-000)', border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-2)', padding: '20px 22px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-400)', marginBottom: 18 }}>LoogoNews</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
                {[
                  { label: 'Published', value: publishedPosts.length },
                  { label: 'Total views', value: totalViews },
                ].map(({ label, value }) => (
                  <div key={label} style={{ background: 'var(--paper-100)', border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-2)', padding: '14px 16px' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-400)' }}>{label}</div>
                    <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.03em', marginTop: 4, color: 'var(--ink-900)' }}>{value}</div>
                  </div>
                ))}
              </div>
              {publishedPosts.slice(0, 3).map(p => (
                <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderTop: '1px solid var(--border-hair)' }}>
                  <span style={{ fontSize: 13, color: 'var(--ink-700)', flex: 1, marginRight: 12, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.title}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-400)', whiteSpace: 'nowrap' }}>{p.views || 0} views</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent leads table */}
          <div style={{ background: 'var(--paper-000)', border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 22px', borderBottom: '1px solid var(--border-hair)' }}>
              <span style={{ fontWeight: 600, fontSize: 'var(--fs-body)' }}>Recent leads</span>
              <button onClick={onViewLeads} style={{ fontSize: 13, color: 'var(--cyan-700)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                View all →
              </button>
            </div>
            {leads.length === 0 ? (
              <div style={{ padding: '40px 22px', textAlign: 'center', color: 'var(--ink-400)', fontSize: 'var(--fs-body-sm)' }}>
                No leads yet. They will appear here once someone submits the contact form.
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--paper-200)' }}>
                    {['Name', 'Company', 'Industry', 'Status', 'Date'].map(h => (
                      <th key={h} style={thStyle}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {leads.slice(0, 6).map(lead => (
                    <tr key={lead.id} style={{ borderTop: '1px solid var(--border-hair)' }}>
                      <td style={tdStyle}><span style={{ fontWeight: 500 }}>{lead.full_name}</span></td>
                      <td style={tdStyle}>{lead.company}</td>
                      <td style={{ ...tdStyle, color: 'var(--ink-400)' }}>{lead.industry || '—'}</td>
                      <td style={tdStyle}><StatusBadge status={lead.status} /></td>
                      <td style={{ ...tdStyle, color: 'var(--ink-400)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>{formatDate(lead.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function Spinner() {
  return <div style={{ color: 'var(--ink-400)', fontSize: 'var(--fs-body-sm)' }}>Loading…</div>;
}

const thStyle = { padding: '10px 22px', textAlign: 'left', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-400)', fontWeight: 500 };
const tdStyle = { padding: '13px 22px', fontSize: 'var(--fs-body-sm)', color: 'var(--ink-900)', verticalAlign: 'middle' };
