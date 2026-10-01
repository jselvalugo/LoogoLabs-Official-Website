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

// Pages where a visit turns into a lead or a quote. Reading one of these after
// a post counts as the post sending the reader somewhere useful.
const MONEY_PATHS = ['/ai-voice', '/ai-receptionist', '/reputation-autopilot', '/quizzes', '/park-supply', '/grow'];
const POST_PREFIX = '/news/';
const OPEN_PROPOSAL = ['new', 'reviewing', 'sent'];

const money = (n) => `$${Math.round(Number(n) || 0).toLocaleString('en-US')}`;
const pct = (num, den) => (den ? `${Math.round((num / den) * 100)}%` : '—');

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
  const [proposals, setProposals] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    Promise.all([
      apiFetch('/.netlify/functions/get-posts').then(r => r?.json()),
      apiFetch('/.netlify/functions/get-leads').then(r => r?.json()),
      apiFetch('/.netlify/functions/get-post-views').then(r => r?.json()),
      apiFetch('/.netlify/functions/get-sessions').then(r => r?.json()).catch(() => null),
      apiFetch('/.netlify/functions/get-proposals').then(r => r?.json()).catch(() => null),
    ])
      .then(([postsData, leadsData, viewsData, sessionsData, proposalsData]) => {
        if (Array.isArray(proposalsData)) setProposals(proposalsData);
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

  // ── Conversions & attribution (sessions cover the last 90 days) ──
  // Leads and proposals carry the session_id of the visit they came from when
  // the visitor accepted Analytics cookies; older rows and declined visitors
  // simply have none, so these numbers are a floor, not a total.
  const proposalRows = proposals || [];
  const sessionById = new Map(sessionRows.map(x => [x.id, x]));
  const linkedLeads = leadRows.filter(l => l.session_id && sessionById.has(l.session_id));
  const linkedProposals = proposalRows.filter(p => p.session_id && sessionById.has(p.session_id));
  const linkedWon = linkedProposals.filter(p => p.status === 'won');
  const leadsBySession = new Map();
  linkedLeads.forEach(l => leadsBySession.set(l.session_id, (leadsBySession.get(l.session_id) || 0) + 1));
  const proposalsBySession = new Map();
  linkedProposals.forEach(p => {
    const e = proposalsBySession.get(p.session_id) || { count: 0, won: 0 };
    e.count += 1;
    if (p.status === 'won') e.won += Number(p.total) || 0;
    proposalsBySession.set(p.session_id, e);
  });

  // One row per group: sessions, engagement, quick exits and what they produced.
  const attribution = (key, limit = 8) => {
    const groups = {};
    sessionRows.forEach(x => {
      const k = key(x);
      const g = groups[k] || (groups[k] = { key: k, sessions: 0, secs: 0, quick: 0, leads: 0, proposals: 0, won: 0 });
      g.sessions += 1;
      g.secs += x.secs;
      if ((Number(x.page_count) || 1) <= 1 && x.secs < 10) g.quick += 1;
      g.leads += leadsBySession.get(x.id) || 0;
      const pr = proposalsBySession.get(x.id);
      if (pr) { g.proposals += pr.count; g.won += pr.won; }
    });
    return Object.values(groups)
      .sort((a, b) => (b.leads + b.proposals) - (a.leads + a.proposals) || b.sessions - a.sessions)
      .slice(0, limit);
  };
  const bySource = attribution(x => x.referrer || 'Direct / none');
  const byLanding = attribution(x => x.landing_path || '/');
  const byDevice = attribution(x => (x.device ? x.device[0].toUpperCase() + x.device.slice(1) : 'Unknown'), 4);

  // ── Blog → next step ──
  const postBySlug = new Map(all.map(p => [p.slug, p]));
  const postFlow = {};
  sessionRows.forEach(x => {
    const visited = Object.keys(x.paths || {});
    const reachedMoney = visited.some(p => MONEY_PATHS.includes(p));
    const converted = (leadsBySession.get(x.id) || 0) + (proposalsBySession.get(x.id)?.count || 0);
    visited.filter(p => p.startsWith(POST_PREFIX)).forEach(p => {
      const slug = p.slice(POST_PREFIX.length);
      const e = postFlow[slug] || (postFlow[slug] = { slug, sessions: 0, secs: 0, onward: 0, converted: 0 });
      e.sessions += 1;
      e.secs += Number(x.paths[p]) || 0;
      if (reachedMoney) e.onward += 1;
      if (converted) e.converted += converted;
    });
  });
  const postFlowRows = Object.values(postFlow).map(e => {
    const post = postBySlug.get(e.slug);
    const avg = e.secs / e.sessions;
    const readSecs = (Number(post?.read_time) || 0) * 60;
    return { ...e, title: post?.title || e.slug, avg, readThrough: readSecs ? Math.min(100, Math.round((avg / readSecs) * 100)) : null };
  });
  const postsByOnward = [...postFlowRows].sort((a, b) => b.onward - a.onward || b.sessions - a.sessions).slice(0, 8);
  const deadEndPosts = postFlowRows.filter(e => e.sessions >= 3 && e.onward === 0).sort((a, b) => b.sessions - a.sessions).slice(0, 6);
  const blogSessions = sessionRows.filter(x => Object.keys(x.paths || {}).some(p => p.startsWith(POST_PREFIX)));
  const blogOnward = blogSessions.filter(x => Object.keys(x.paths || {}).some(p => MONEY_PATHS.includes(p))).length;

  // ── Park Supply ──
  const proposalTotal = p => Number(p.total) || 0;
  const wonProposals = proposalRows.filter(p => p.status === 'won');
  const lostProposals = proposalRows.filter(p => p.status === 'lost');
  const openProposals = proposalRows.filter(p => OPEN_PROPOSAL.includes(p.status || 'new'));
  const wonRevenue = wonProposals.reduce((s2, p) => s2 + proposalTotal(p), 0);
  const pipelineValue = openProposals.reduce((s2, p) => s2 + proposalTotal(p), 0);
  const avgDeal = proposalRows.length ? proposalRows.reduce((s2, p) => s2 + proposalTotal(p), 0) / proposalRows.length : 0;
  const avgDiscount = proposalRows.length ? proposalRows.reduce((s2, p) => s2 + (Number(p.discount_pct) || 0), 0) / proposalRows.length : 0;
  const proposalStatuses = ['new', 'reviewing', 'sent', 'won', 'lost'].map(st => {
    const rows = proposalRows.filter(p => (p.status || 'new') === st);
    return { label: st[0].toUpperCase() + st.slice(1), count: rows.length, value: rows.reduce((s2, p) => s2 + proposalTotal(p), 0) };
  });
  const maxStatus = Math.max(1, ...proposalStatuses.map(x => x.count));
  const productTotals = {};
  proposalRows.forEach(p => (Array.isArray(p.lines) ? p.lines : []).forEach(l => {
    const e = productTotals[l.sku] || (productTotals[l.sku] = { name: l.name || l.sku, qty: 0, value: 0, quotes: 0 });
    e.qty += Number(l.qty) || 0;
    e.value += (Number(l.qty) || 0) * (Number(l.price) || 0);
    e.quotes += 1;
  }));
  const topProducts = Object.values(productTotals).sort((a, b) => b.value - a.value).slice(0, 8);
  const maxProduct = topProducts[0]?.value || 1;
  const regionRevenue = {};
  proposalRows.forEach(p => {
    const k = p.region || p.country || 'Unknown';
    const e = regionRevenue[k] || (regionRevenue[k] = { quoted: 0, won: 0 });
    e.quoted += proposalTotal(p);
    if (p.status === 'won') e.won += proposalTotal(p);
  });
  const topRegions = Object.entries(regionRevenue).sort((a, b) => b[1].quoted - a[1].quoted).slice(0, 8);
  const maxRegion = topRegions[0]?.[1].quoted || 1;

  // ── Lead quality ──
  const isQualified = l => l.decision_maker === "Yes, that's me";
  const qualityBy = (key) => {
    const groups = {};
    leadRows.forEach(l => {
      const k = key(l);
      if (!k) return;
      const g = groups[k] || (groups[k] = { key: k, count: 0, qualified: 0 });
      g.count += 1;
      if (isQualified(l)) g.qualified += 1;
    });
    return Object.values(groups).sort((a, b) => b.count - a.count).slice(0, 8);
  };
  const leadsByBusiness = qualityBy(l => l.business_type);
  const leadsByPain = qualityBy(l => l.pain_point || l.review_pain_point);
  const leadsBySize = qualityBy(l => l.missed_calls || l.job_volume);
  const leadsByStatus = qualityBy(l => l.status || 'new');

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

      {/* ── CONVERSIONS & ATTRIBUTION ── */}
      <h2 style={sectionH2}>Conversions &amp; attribution</h2>
      <p style={sectionNote}>
        Last 90 days. A lead or quote is linked to the visit it came from only when the visitor accepted Analytics cookies,
        so these are the conversions we can trace, not every conversion. Quick exit = one page and under 10s engaged.
      </p>
      <div className="ll-grid-4" style={{ gap: 12, marginBottom: 20 }}>
        <StatCard label="Traced leads" value={linkedLeads.length} sub={`of ${leadRows.length} total`} />
        <StatCard label="Traced quotes" value={linkedProposals.length} sub={`of ${proposalRows.length} total`} />
        <StatCard label="Visit → lead or quote" value={pct(new Set([...leadsBySession.keys(), ...proposalsBySession.keys()]).size, sessionRows.length)} accent
          sub={`${sessionRows.length} sessions`} />
        <StatCard label="Traced won revenue" value={money(linkedWon.reduce((s2, p) => s2 + proposalTotal(p), 0))} />
      </div>
      <div style={{ display: 'grid', gap: 20, marginBottom: 48 }}>
        <AttributionTable title="By traffic source" label="Source" rows={bySource} />
        <AttributionTable title="By landing page" label="Landing page" rows={byLanding} />
        <AttributionTable title="By device" label="Device" rows={byDevice} />
      </div>

      {/* ── BLOG → NEXT STEP ── */}
      <h2 style={sectionH2}>Blog → next step</h2>
      <p style={sectionNote}>
        Last 90 days. Onward = the same visit also opened a product page, a quiz or Park Supply.
        Read-through compares engaged time on the post with its estimated read time.
      </p>
      <div className="ll-grid-4" style={{ gap: 12, marginBottom: 20 }}>
        <StatCard label="Visits reading a post" value={blogSessions.length} />
        <StatCard label="Went on to a product page" value={pct(blogOnward, blogSessions.length)} accent sub={`${blogOnward} visits`} />
        <StatCard label="Posts read" value={postFlowRows.length} />
        <StatCard label="Dead-end posts" value={deadEndPosts.length} sub="3+ visits, nobody went on" />
      </div>
      <div className="ll-grid-2" style={{ gap: 20, marginBottom: 48 }}>
        <Panel title="Posts that send readers onward">
          {postsByOnward.length === 0 ? <Empty text="No post visits recorded yet." /> : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 420 }}>
                <thead><tr style={{ background: 'var(--paper-200)' }}>
                  {['Post', 'Visits', 'Read', 'Onward', 'Conv.'].map(h => <th key={h} style={thStyle}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {postsByOnward.map(e => (
                    <tr key={e.slug} style={{ borderTop: '1px solid var(--border-hair)' }}>
                      <td style={tdStyle}><div style={ellipsis(200)} title={e.title}>{e.title}</div></td>
                      <td style={numTd}>{e.sessions}</td>
                      <td style={numTd}>{e.readThrough === null ? '—' : `${e.readThrough}%`}</td>
                      <td style={{ ...numTd, color: 'var(--cyan-700)', fontWeight: 600 }}>{pct(e.onward, e.sessions)}</td>
                      <td style={numTd}>{e.converted}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>
        <Panel title="Dead ends (worth a stronger call to action)">
          {deadEndPosts.length === 0 ? <Empty text="No post with 3+ visits is a dead end." /> : (
            <div style={{ display: 'grid', gap: 12 }}>
              {deadEndPosts.map(e => (
                <BarRow key={e.slug} label={e.title} value={e.sessions} max={deadEndPosts[0].sessions}
                  display={`${e.sessions} visits · ${formatDuration(e.avg)} avg`} />
              ))}
            </div>
          )}
        </Panel>
      </div>

      {/* ── PARK SUPPLY ── */}
      <h2 style={sectionH2}>Park Supply quotes</h2>
      <p style={sectionNote}>All quote requests. Win rate counts only quotes already marked won or lost.</p>
      <div className="ll-grid-4" style={{ gap: 12, marginBottom: 20 }}>
        <StatCard label="Won revenue" value={money(wonRevenue)} accent sub={`${wonProposals.length} won`} />
        <StatCard label="Open pipeline" value={money(pipelineValue)} sub={`${openProposals.length} open`} />
        <StatCard label="Win rate" value={pct(wonProposals.length, wonProposals.length + lostProposals.length)} />
        <StatCard label="Avg quote" value={money(avgDeal)} sub={`avg discount ${avgDiscount.toFixed(1)}%`} />
      </div>
      <div className="ll-grid-2" style={{ gap: 20, marginBottom: 20 }}>
        <Panel title="Quotes by status">
          {proposalRows.length === 0 ? <Empty text="No quote requests yet." /> : (
            <div style={{ display: 'grid', gap: 12 }}>
              {proposalStatuses.map(x => <BarRow key={x.label} label={x.label} value={x.count} max={maxStatus} display={`${x.count} · ${money(x.value)}`} />)}
            </div>
          )}
        </Panel>
        <Panel title="Most-quoted products (by value)">
          {topProducts.length === 0 ? <Empty text="No quote requests yet." /> : (
            <div style={{ display: 'grid', gap: 12 }}>
              {topProducts.map(x => <BarRow key={x.name} label={x.name} value={x.value} max={maxProduct} display={`${money(x.value)} · ${x.qty} units · ${x.quotes} quote${x.quotes === 1 ? '' : 's'}`} />)}
            </div>
          )}
        </Panel>
      </div>
      <div className="ll-grid-2" style={{ gap: 20, marginBottom: 48 }}>
        <Panel title="Quoted vs won by region">
          {topRegions.length === 0 ? <Empty text="No quote requests yet." /> : (
            <div style={{ display: 'grid', gap: 12 }}>
              {topRegions.map(([region, e]) => <BarRow key={region} label={region} value={e.quoted} max={maxRegion} display={`${money(e.quoted)} quoted · ${money(e.won)} won`} />)}
            </div>
          )}
        </Panel>
        <div />
      </div>

      {/* ── LEAD QUALITY ── */}
      <h2 style={sectionH2}>Lead quality</h2>
      <p style={sectionNote}>All quiz leads, from both quizzes. Qualified = answered that they make the decision.</p>
      <div className="ll-grid-2" style={{ gap: 20, marginBottom: 20 }}>
        <QualityPanel title="By business type" rows={leadsByBusiness} />
        <QualityPanel title="By main pain point" rows={leadsByPain} />
      </div>
      <div className="ll-grid-2" style={{ gap: 20, marginBottom: 48 }}>
        <QualityPanel title="By size (missed calls / job volume)" rows={leadsBySize} />
        <QualityPanel title="By lead status" rows={leadsByStatus} />
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

function AttributionTable({ title, label, rows }) {
  return (
    <Panel title={title}>
      {rows.length === 0 ? <Empty text="No sessions recorded yet." /> : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 560 }}>
            <thead><tr style={{ background: 'var(--paper-200)' }}>
              {[label, 'Visits', 'Avg engaged', 'Quick exit', 'Leads', 'Quotes', 'Won'].map(h => <th key={h} style={thStyle}>{h}</th>)}
            </tr></thead>
            <tbody>
              {rows.map(g => (
                <tr key={g.key} style={{ borderTop: '1px solid var(--border-hair)' }}>
                  <td style={tdStyle}><div style={ellipsis(220)} title={g.key}>{g.key}</div></td>
                  <td style={numTd}>{g.sessions}</td>
                  <td style={numTd}>{formatDuration(g.secs / g.sessions)}</td>
                  <td style={numTd}>{pct(g.quick, g.sessions)}</td>
                  <td style={{ ...numTd, color: g.leads ? 'var(--cyan-700)' : undefined, fontWeight: g.leads ? 600 : 400 }}>{g.leads}</td>
                  <td style={{ ...numTd, color: g.proposals ? 'var(--cyan-700)' : undefined, fontWeight: g.proposals ? 600 : 400 }}>{g.proposals}</td>
                  <td style={numTd}>{g.won ? money(g.won) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  );
}

function QualityPanel({ title, rows }) {
  return (
    <Panel title={title}>
      {rows.length === 0 ? <Empty text="No quiz submissions yet." /> : (
        <div style={{ display: 'grid', gap: 12 }}>
          {rows.map(g => <BarRow key={g.key} label={g.key} value={g.count} max={rows[0].count} display={`${g.count} · ${pct(g.qualified, g.count)} qualified`} />)}
        </div>
      )}
    </Panel>
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
const numTd = { ...tdStyle, fontFamily: 'var(--font-mono)', fontSize: 12 };
const ellipsis = (maxWidth) => ({ fontWeight: 500, maxWidth, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' });
const sectionH2 = { margin: '0 0 8px', fontSize: 'var(--fs-h2)', fontWeight: 700, letterSpacing: 'var(--ls-h2)' };
const sectionNote = { margin: '0 0 20px', fontSize: 12, color: 'var(--ink-400)', maxWidth: '70ch' };
