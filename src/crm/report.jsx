import React from 'react';

// Pieces shared by the team-side client tabs (Clients.jsx) and the pages
// clients open from a share link (Share.jsx).

export const money = (n) => (n === null || n === undefined || n === '' ? '' : `$${Math.round(Number(n)).toLocaleString('en-US')}`);
export const money2 = (n) => (Number.isFinite(n) ? `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—');
export const count = (n) => Math.round(Number(n) || 0).toLocaleString('en-US');
export const pct = (n) => (Number.isFinite(n) ? `${(n * 100).toFixed(1)}%` : '—');
export const day = (d) => (d ? new Date(`${String(d).slice(0, 10)}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '');
export const when = (d) => new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
export const monthLabel = (ym) => new Date(`${ym}-15T12:00:00`).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
export const range = (a, b) => [day(a), day(b)].filter(Boolean).join(' – ');

export function Drawer({ title, kicker, onClose, children }) {
  React.useEffect(() => {
    const esc = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [onClose]);
  return (
    <div className="drawer-bg" onClick={onClose}>
      <aside className="drawer" role="dialog" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <div className="drawer-head">
          <div style={{ flex: 1, minWidth: 0 }}>
            {kicker && <div className="kicker">{kicker}</div>}
            <h2>{title}</h2>
          </div>
          <button className="btn" onClick={onClose}>Close</button>
        </div>
        {children}
      </aside>
    </div>
  );
}

export function Stat({ k, n, v }) {
  return <div className="card stat"><div className="k">{k}</div><div className="n">{n}</div>{v !== undefined && <div className="v">{v}</div>}</div>;
}

// ── Timestamps ──────────────────────────────────────────────────────────────

export const clock = (sec) => {
  if (sec === null || sec === undefined) return '';
  const s = Math.max(0, Math.floor(sec));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};
// "1:23", "83" or "1:02:03" → seconds; '' → null.
export const parseClock = (v) => {
  const s = String(v || '').trim();
  if (!s) return null;
  if (!/^\d+(:\d{1,2}){0,2}$/.test(s)) return NaN;
  return s.split(':').reduce((n, part) => n * 60 + Number(part), 0);
};

// ── Media preview ───────────────────────────────────────────────────────────

const VIDEO = /\.(mp4|webm|mov|m4v)(\?|#|$)/i;
const IMAGE = /\.(png|jpe?g|gif|webp|avif|svg)(\?|#|$)/i;

function embedUrl(url) {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, '');
    if (host === 'youtu.be') return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
    if (host.endsWith('youtube.com') && u.searchParams.get('v')) return `https://www.youtube.com/embed/${u.searchParams.get('v')}`;
    if (host === 'vimeo.com' && /^\/\d+/.test(u.pathname)) return `https://player.vimeo.com/video/${u.pathname.split('/')[1]}`;
    if (host.endsWith('loom.com') && u.pathname.startsWith('/share/')) return `https://www.loom.com/embed/${u.pathname.split('/')[2]}`;
  } catch { /* not a URL */ }
  return null;
}

// A direct video file gets a real <video> so comments can grab the current
// time; YouTube/Vimeo/Loom embed; anything else is a link.
export const Media = React.forwardRef(function Media({ url }, videoRef) {
  if (!url) return null;
  if (VIDEO.test(url)) return <video ref={videoRef} className="media" src={url} controls preload="metadata" />;
  if (IMAGE.test(url)) return <a href={url} target="_blank" rel="noreferrer"><img className="media" src={url} alt="" /></a>;
  const embed = embedUrl(url);
  if (embed) return <div className="media embed"><iframe src={embed} title="Preview" allow="fullscreen; picture-in-picture" allowFullScreen /></div>;
  // Big and gold so clients open the file before they approve.
  return (
    <a className="open-file" href={url} target="_blank" rel="noreferrer">
      <span>Open file to review ↗</span>
      <small>Opens in a new tab · please review before approving</small>
    </a>
  );
});
export const canSeek = (url) => !!url && VIDEO.test(url);

// ── Performance report ──────────────────────────────────────────────────────

const RANGES = [
  { id: 3, label: '3 months' },
  { id: 6, label: '6 months' },
  { id: 12, label: '12 months' },
  { id: 0, label: 'All time' },
];
const SERIES = [
  { id: 'spend', label: 'Ad spend', fmt: money },
  { id: 'views', label: 'Views', fmt: count },
  { id: 'engagement', label: 'Engagement', fmt: count },
  { id: 'conversions', label: 'Conversions', fmt: count },
];

const sum = (rows) => rows.reduce((t, r) => ({
  spend: t.spend + r.spend, views: t.views + r.views, engagement: t.engagement + r.engagement, conversions: t.conversions + r.conversions,
}), { spend: 0, views: 0, engagement: 0, conversions: 0 });

const delta = (now, before) => {
  if (!before) return undefined;
  const d = (now - before) / before;
  return `${d >= 0 ? '▲' : '▼'} ${Math.abs(d * 100).toFixed(0)}% vs prior period`;
};

// metrics: [{ period: 'YYYY-MM-DD', channel, spend, views, engagement, conversions }]
export function PerformanceReport({ metrics, color = '#1A1A18' }) {
  const [months, setMonths] = React.useState(6);
  const [series, setSeries] = React.useState('conversions');
  const allMonths = [...new Set(metrics.map((m) => m.period.slice(0, 7)))].sort();

  if (allMonths.length === 0) return <p className="muted">No performance data yet.</p>;

  const shown = months ? allMonths.slice(-months) : allMonths;
  const prior = months ? allMonths.slice(-months * 2, -months) : [];
  const inMonths = (list) => metrics.filter((m) => list.includes(m.period.slice(0, 7)));
  const t = sum(inMonths(shown));
  const p = prior.length ? sum(inMonths(prior)) : null;

  const byMonth = shown.map((ym) => ({ ym, ...sum(metrics.filter((m) => m.period.startsWith(ym))) }));
  const max = Math.max(1, ...byMonth.map((m) => m[series]));
  const channels = Object.entries(inMonths(shown).reduce((acc, m) => {
    (acc[m.channel] ||= []).push(m);
    return acc;
  }, {})).map(([channel, rows]) => ({ channel, ...sum(rows) })).sort((a, b) => b.spend - a.spend);
  const s = SERIES.find((x) => x.id === series);

  return (
    <div className="report" style={{ '--brand': color }}>
      <div className="seg" role="group" aria-label="Date range">
        {RANGES.map((r) => <button key={r.id} className={months === r.id ? 'on' : ''} onClick={() => setMonths(r.id)}>{r.label}</button>)}
        <span className="muted">{monthLabel(shown[0])} – {monthLabel(shown[shown.length - 1])}</span>
      </div>
      <div className="stats stats-4">
        <Stat k="Ad spend" n={money(t.spend)} v={p ? delta(t.spend, p.spend) : undefined} />
        <Stat k="Views" n={count(t.views)} v={p ? delta(t.views, p.views) : undefined} />
        <Stat k="Engagement" n={count(t.engagement)} v={p ? delta(t.engagement, p.engagement) : undefined} />
        <Stat k="Conversions" n={count(t.conversions)} v={p ? delta(t.conversions, p.conversions) : undefined} />
      </div>
      <div className="stats stats-3" style={{ marginTop: 12 }}>
        <Stat k="Cost per conversion" n={t.conversions ? money2(t.spend / t.conversions) : '—'} />
        <Stat k="Engagement rate" n={t.views ? pct(t.engagement / t.views) : '—'} />
        <Stat k="Cost per 1,000 views" n={t.views ? money2((t.spend / t.views) * 1000) : '—'} />
      </div>

      <div className="section row">
        <span style={{ flex: 1 }}>{s.label} by month</span>
        <select className="field" style={{ width: 'auto', fontSize: 13, padding: '4px 8px', letterSpacing: 0, textTransform: 'none' }}
          aria-label="Chart metric" value={series} onChange={(e) => setSeries(e.target.value)}>
          {SERIES.map((x) => <option key={x.id} value={x.id}>{x.label}</option>)}
        </select>
      </div>
      <div className="card chart" role="img" aria-label={`${s.label} by month`}>
        {byMonth.map((m) => (
          <div key={m.ym} className="bar-col" title={`${monthLabel(m.ym)}: ${s.fmt(m[series])}`}>
            <span className="bar-val">{s.fmt(m[series])}</span>
            <div className="bar" style={{ height: `${(m[series] / max) * 100}%` }} />
            <span className="bar-label">{monthLabel(m.ym)}</span>
          </div>
        ))}
      </div>

      <div className="section">By channel</div>
      <div className="card" style={{ overflowX: 'auto' }}>
        <table className="static">
          <thead><tr><th>Channel</th><th className="num">Spend</th><th className="num">Views</th><th className="num hide-sm">Engagement</th><th className="num">Conv.</th><th className="num hide-sm">Cost / conv.</th></tr></thead>
          <tbody>
            {channels.map((c) => (
              <tr key={c.channel}>
                <td>{c.channel}</td><td className="num">{money(c.spend)}</td><td className="num">{count(c.views)}</td>
                <td className="num hide-sm">{count(c.engagement)}</td><td className="num">{count(c.conversions)}</td>
                <td className="num hide-sm">{c.conversions ? money2(c.spend / c.conversions) : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export const APPROVAL_STATUS = {
  pending: 'Awaiting review',
  changes_requested: 'Changes requested',
  approved: 'Approved',
};
export const StatusPill = ({ status }) => <span className={`pill ${status}`}>{APPROVAL_STATUS[status] || status}</span>;

// Comment thread with timestamp chips; clicking a chip seeks the video.
export function Comments({ comments, version, onSeek, actions }) {
  if (!comments.length) return <p className="muted">No comments yet.</p>;
  return (
    <div>
      {comments.map((c) => (
        <div key={c.id} className={`note ${c.resolved ? 'done-note' : ''}`}>
          <div className="note-head">
            <strong>{c.author || 'Team'}</strong>
            {!c.from_client && <span className="pill">Team</span>}
            {c.version !== version && <span className="pill">v{c.version}</span>}
            {c.timestamp_sec !== null && (
              <button className="ts" onClick={() => onSeek?.(c.timestamp_sec)} title="Jump to this moment">{clock(c.timestamp_sec)}</button>
            )}
            {c.resolved && <span className="pill approved">Resolved</span>}
            {actions && <span style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>{actions(c)}</span>}
          </div>
          <div className="pre">{c.body}</div>
          <small>{when(c.created_at)}</small>
        </div>
      ))}
    </div>
  );
}
