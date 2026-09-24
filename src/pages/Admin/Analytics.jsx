import React from 'react';
import { apiFetch } from '../../lib/identity';

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const SOURCE_LABELS = {
  ai_receptionist: 'AI Receptionist',
  reputation_autopilot: 'Reputation Autopilot',
};

// "City, Region" when both are known, falling back gracefully — location is
// IP-derived (Netlify's built-in geolocation), so it's occasionally missing.
function locationLabel(row) {
  const parts = [row.city, row.region || row.country].filter(Boolean);
  return parts.length ? parts.join(', ') : null;
}

// "1m 05s" / "42s" / "1h 03m" — engaged time reads better than raw seconds.
function formatDuration(sec) {
  const s = Math.round(Number(sec) || 0);
  if (s < 60) return `${s}s`;
  if (s < 3600) return `${Math.floor(s / 60)}m ${String(s % 60).padStart(2, '0')}s`;
  return `${Math.floor(s / 3600)}h ${String(Math.floor((s % 3600) / 60)).padStart(2, '0')}m`;
}

const median = (nums) => {
  if (!nums.length) return 0;
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
};

const DURATION_BUCKETS = [
  ['Under 10s', 0, 10], ['10–30s', 10, 30], ['30s–1m', 30, 60],
  ['1–3m', 60, 180], ['3–10m', 180, 600], ['10m+', 600, Infinity],
];

function topLocations(rows, limit = 8) {
  const counts = {};
  rows.forEach(r => {
    const label = locationLabel(r);
    if (label) counts[label] = (counts[label] || 0) + 1;
  });
  return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, limit);
}

export default function Analytics() {
  const [posts, setPosts] = React.useState(null);
  const [leads, setLeads] = React.useState(null);
  const [postViews, setPostViews] = React.useState(null);
  const [sessions, setSessions] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    Promise.all([
      apiFetch('/.netlify/functions/get-posts').then(r => r?.json()),
      apiFetch('/.netlify/functions/get-leads').then(r => r?.json()),
      apiFetch('/.netlify/functions/get-post-views').then(r => r?.json()),
      apiFetch('/.netlify/functions/get-sessions').then(r => r?.json()).catch(() => null),
    ])
      .then(([postsData, leadsData, viewsData, sessionsData]) => {
        if (Array.isArray(sessionsData)) setSessions(sessionsData);
        if (Array.isArray(postsData)) setPosts(postsData);
        if (Array.isArray(leadsData)) setLeads(leadsData);
        if (Array.isArray(viewsData)) setPostViews(viewsData);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div style={{ padding: '40px 24px', color: 'var(--ink-400)', fontSize: 13 }}>Loading…</div>;
  }

  const all = posts || [];
  const leadRows = leads || [];
  const viewRows = postViews || [];
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

  // ── Leads ──
  const qualifiedLeads = leadRows.filter(l => l.decision_maker === "Yes, that's me");
  const qualifiedRate = leadRows.length ? Math.round((qualifiedLeads.length / leadRows.length) * 100) : 0;
  const leadsThisMonth = leadRows.filter(l => {
    if (!l.created_at) return false;
    const d = new Date(l.created_at);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  }).length;

  const leadsBySource = {};
  leadRows.forEach(l => {
    const key = SOURCE_LABELS[l.source] || l.source || 'Unknown';
    leadsBySource[key] = (leadsBySource[key] || 0) + 1;
  });
  const sourceCounts = Object.entries(leadsBySource).sort((a, b) => b[1] - a[1]);
  const maxSourceCount = sourceCounts[0]?.[1] || 1;

  const leadsCadence = months.map(({ key, label }) => {
    const [y, m] = key.split('-').map(Number);
    const count = leadRows.filter(l => {
      if (!l.created_at) return false;
      const d = new Date(l.created_at);
      return d.getFullYear() === y && d.getMonth() === m;
    }).length;
    return { label, count };
  });
  const maxLeadsCadence = Math.max(1, ...leadsCadence.map(c => c.count));

  // ── Visitors & engagement (last 30 days) ──
  const DAY = 24 * 60 * 60 * 1000;
  const sessionRows = (sessions || []).map(x => ({ ...x, secs: Number(x.active_seconds) || 0, t: new Date(x.started_at).getTime() }));
  const last30 = sessionRows.filter(x => now - x.t < 30 * DAY);
  const prev30 = sessionRows.filter(x => now - x.t >= 30 * DAY && now - x.t < 60 * DAY);
  const avgOf = rows => (rows.length ? rows.reduce((sum, x) => sum + x.secs, 0) / rows.length : 0);
  const avgSession = avgOf(last30);
  const prevAvgSession = avgOf(prev30);
  const avgChange = prev30.length && prevAvgSession ? Math.round(((avgSession - prevAvgSession) / prevAvgSession) * 100) : null;
  const medianSession = median(last30.map(x => x.secs));
  const pagesPerSession = last30.length ? (last30.reduce((sum, x) => sum + (Number(x.page_count) || 1), 0) / last30.length).toFixed(1) : '0';

  const durationBuckets = DURATION_BUCKETS.map(([label, lo, hi]) => ({ label, count: last30.filter(x => x.secs >= lo && x.secs < hi).length }));
  const maxBucket = Math.max(1, ...durationBuckets.map(b => b.count));

  const dailyEngagement = Array.from({ length: 14 }, (_, i) => {
    const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (13 - i));
    const next = day.getTime() + DAY;
    const rows = sessionRows.filter(x => x.t >= day.getTime() && x.t < next);
    return { label: day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), avg: avgOf(rows), count: rows.length };
  });
  const maxDaily = Math.max(1, ...dailyEngagement.map(d => d.avg));

  const pageTime = {};
  last30.forEach(x => Object.entries(x.paths || {}).forEach(([path, sec]) => {
    const e = pageTime[path] || (pageTime[path] = { total: 0, sessions: 0 });
    e.total += Number(sec) || 0;
    e.sessions += 1;
  }));
  const timeOnPage = Object.entries(pageTime)
    .map(([path, e]) => ({ path, avg: e.total / e.sessions, sessions: e.sessions }))
    .sort((a, b) => b.sessions - a.sessions).slice(0, 8);
  const maxTimeOnPage = Math.max(1, ...timeOnPage.map(p => p.avg));

  const countBy = (rows, key) => {
    const counts = {};
    rows.forEach(x => { const k = key(x); counts[k] = (counts[k] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 8);
  };
  const landingPages = countBy(last30, x => x.landing_path || '/');
  const sources = countBy(last30, x => x.referrer || 'Direct / none');
  const devices = countBy(last30, x => (x.device ? x.device[0].toUpperCase() + x.device.slice(1) : 'Unknown'));

  // ── Geography ──
  const readerLocations = topLocations(viewRows);
  const maxReaderLocation = readerLocations[0]?.[1] || 1;
  const leadLocations = topLocations(leadRows);
  const maxLeadLocation = leadLocations[0]?.[1] || 1;

  return (
    <div style={{ padding: '28px 32px 56px', overflowY: 'auto', flex: 1 }} className="ll-admin-content">
      <h1 style={{ margin: '0 0 24px', fontSize: 'var(--fs-h1)', fontWeight: 700, letterSpacing: 'var(--ls-h1)' }}>Analytics</h1>

      {/* ── VISITORS & ENGAGEMENT ── */}
      <h2 style={{ margin: '0 0 8px', fontSize: 'var(--fs-h2)', fontWeight: 700, letterSpacing: 'var(--ls-h2)' }}>Visitors &amp; engagement</h2>
      <p style={{ margin: '0 0 20px', fontSize: 12, color: 'var(--ink-400)', maxWidth: '70ch' }}>
        Last 30 days. Session length is engaged time: the tab is visible and the visitor was active in the last minute.
        Only visitors who accepted Analytics cookies are counted, so treat totals as a sample.
      </p>

      <div className="ll-grid-4" style={{ gap: 12, marginBottom: 20 }}>
        <StatCard label="Sessions" value={last30.length} />
        <StatCard label="Avg session" value={formatDuration(avgSession)} accent
          sub={avgChange === null ? null : `${avgChange >= 0 ? '▲' : '▼'} ${Math.abs(avgChange)}% vs prior 30 days`} />
        <StatCard label="Median session" value={formatDuration(medianSession)} />
        <StatCard label="Pages / session" value={pagesPerSession} />
      </div>

      <div className="ll-grid-2" style={{ gap: 20, marginBottom: 20 }}>
        <Panel title="Session length">
          {last30.length === 0 ? <Empty text="No sessions recorded yet." /> : (
            <div style={{ display: 'grid', gap: 12 }}>
              {durationBuckets.map(b => <BarRow key={b.label} label={b.label} value={b.count} max={maxBucket} />)}
            </div>
          )}
        </Panel>
        <Panel title="Avg session by day (last 14 days)">
          {sessionRows.length === 0 ? <Empty text="No sessions recorded yet." /> : (
            <div style={{ display: 'grid', gap: 10 }}>
              {dailyEngagement.map(d => (
                <BarRow key={d.label} label={d.label} value={d.avg} max={maxDaily}
                  display={d.count ? `${formatDuration(d.avg)} · ${d.count} session${d.count === 1 ? '' : 's'}` : '—'} />
              ))}
            </div>
          )}
        </Panel>
      </div>

      <div className="ll-grid-2" style={{ gap: 20, marginBottom: 20 }}>
        <Panel title="Avg time on page (most visited)">
          {timeOnPage.length === 0 ? <Empty text="No page data yet." /> : (
            <div style={{ display: 'grid', gap: 12 }}>
              {timeOnPage.map(p => (
                <BarRow key={p.path} label={p.path} value={p.avg} max={maxTimeOnPage}
                  display={`${formatDuration(p.avg)} · ${p.sessions} session${p.sessions === 1 ? '' : 's'}`} />
              ))}
            </div>
          )}
        </Panel>
        <Panel title="Top landing pages">
          {landingPages.length === 0 ? <Empty text="No sessions recorded yet." /> : (
            <div style={{ display: 'grid', gap: 12 }}>
              {landingPages.map(([path, n]) => <BarRow key={path} label={path} value={n} max={landingPages[0][1]} />)}
            </div>
          )}
        </Panel>
      </div>

      <div className="ll-grid-2" style={{ gap: 20, marginBottom: 48 }}>
        <Panel title="Traffic sources">
          {sources.length === 0 ? <Empty text="No sessions recorded yet." /> : (
            <div style={{ display: 'grid', gap: 12 }}>
              {sources.map(([src, n]) => <BarRow key={src} label={src} value={n} max={sources[0][1]} />)}
            </div>
          )}
        </Panel>
        <Panel title="Devices">
          {devices.length === 0 ? <Empty text="No sessions recorded yet." /> : (
            <div style={{ display: 'grid', gap: 12 }}>
              {devices.map(([d, n]) => <BarRow key={d} label={d} value={n} max={devices[0][1]} />)}
            </div>
          )}
        </Panel>
      </div>

      <h2 style={{ margin: '0 0 20px', fontSize: 'var(--fs-h2)', fontWeight: 700, letterSpacing: 'var(--ls-h2)' }}>Content</h2>

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

      {/* ── QUIZ LEADS ── */}
      <h2 style={{ margin: '48px 0 20px', fontSize: 'var(--fs-h2)', fontWeight: 700, letterSpacing: 'var(--ls-h2)' }}>Quiz Leads</h2>

      <div className="ll-grid-4" style={{ gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Total leads', value: leadRows.length },
          { label: 'Qualified leads', value: qualifiedLeads.length, accent: true },
          { label: 'Qualified rate', value: `${qualifiedRate}%` },
          { label: 'Leads this month', value: leadsThisMonth },
        ].map(({ label, value, accent }) => (
          <StatCard key={label} label={label} value={value} accent={accent} />
        ))}
      </div>

      <div className="ll-grid-2" style={{ gap: 20, marginBottom: 32 }}>
        {/* Leads by quiz */}
        <Panel title="Leads by quiz">
          {sourceCounts.length === 0 ? <Empty text="No quiz submissions yet." /> : (
            <div style={{ display: 'grid', gap: 12 }}>
              {sourceCounts.map(([source, n]) => <BarRow key={source} label={source} value={n} max={maxSourceCount} />)}
            </div>
          )}
        </Panel>

        {/* Leads over time */}
        <Panel title="Leads over time (last 6 months)">
          <div style={{ display: 'grid', gap: 12 }}>
            {leadsCadence.map(({ label, count }) => <BarRow key={label} label={label} value={count} max={maxLeadsCadence} />)}
          </div>
        </Panel>
      </div>

      {/* ── GEOGRAPHY ── */}
      <h2 style={{ margin: '16px 0 20px', fontSize: 'var(--fs-h2)', fontWeight: 700, letterSpacing: 'var(--ls-h2)' }}>Geography</h2>
      <p style={{ margin: '-8px 0 20px', fontSize: 12, color: 'var(--ink-400)' }}>
        Location is derived from IP address — city/region accuracy, not precise.
      </p>

      <div className="ll-grid-2" style={{ gap: 20 }}>
        {/* Reader locations */}
        <Panel title="Top reader locations">
          {readerLocations.length === 0 ? <Empty text="No location data yet." /> : (
            <div style={{ display: 'grid', gap: 12 }}>
              {readerLocations.map(([loc, n]) => <BarRow key={loc} label={loc} value={n} max={maxReaderLocation} />)}
            </div>
          )}
        </Panel>

        {/* Lead locations */}
        <Panel title="Top lead locations">
          {leadLocations.length === 0 ? <Empty text="No location data yet." /> : (
            <div style={{ display: 'grid', gap: 12 }}>
              {leadLocations.map(([loc, n]) => <BarRow key={loc} label={loc} value={n} max={maxLeadLocation} />)}
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}

function StatCard({ label, value, accent, sub }) {
  return (
    <div style={{ background: 'var(--paper-000)', border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-2)', padding: '16px 18px' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-400)' }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.03em', marginTop: 6, color: accent ? 'var(--cyan-700)' : 'var(--ink-900)' }}>{value}</div>
      {sub && <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-400)', marginTop: 4 }}>{sub}</div>}
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

function BarRow({ label, value, max, display }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, gap: 12 }}>
        <span style={{ fontSize: 13, color: 'var(--ink-700)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-400)', flexShrink: 0 }}>{display ?? value}</span>
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
