import React from 'react';
import { apiFetch } from '../../lib/identity';

// Email marketing analytics, read-only, from Resend (see the email-stats
// function). Resend reports each email's latest event, which progresses
// sent → delivered → opened → clicked, so later events count toward earlier
// stages. Opens/clicks need tracking enabled on the domain in Resend.

const REACHED = {
  delivered: ['delivered', 'opened', 'clicked'],
  opened: ['opened', 'clicked'],
  clicked: ['clicked'],
  bounced: ['bounced'],
  complained: ['complained'],
};
const EVENT_COLORS = {
  clicked: ['#15803D', '#DCFCE7'], opened: ['#0E7490', '#CFFAFE'], delivered: ['#2563EB', '#DBEAFE'],
  bounced: ['#B91C1C', '#FEE2E2'], complained: ['#B45309', '#FEF3C7'], delivery_delayed: ['#B45309', '#FEF3C7'],
};
const RANGES = [{ id: 7, label: '7 days' }, { id: 30, label: '30 days' }, { id: 90, label: '90 days' }, { id: 0, label: 'All' }];

function tally(list) {
  const n = (k) => list.filter((e) => REACHED[k].includes(e.last_event)).length;
  return { sent: list.length, delivered: n('delivered'), opened: n('opened'), clicked: n('clicked'), bounced: n('bounced'), complained: n('complained') };
}
const pct = (a, b) => (b ? `${Math.round((a / b) * 100)}%` : '—');
const formatDate = (iso) => new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });

export default function EmailMarketing() {
  const [data, setData] = React.useState(null);
  const [range, setRange] = React.useState(30);

  const load = React.useCallback(() => {
    setData(null);
    apiFetch('/.netlify/functions/email-stats').then((r) => r?.json()).then(setData).catch((e) => setData({ error: e.message, emails: [] }));
  }, []);
  React.useEffect(load, [load]);

  const cutoff = range ? Date.now() - range * 86400000 : 0;
  const emails = (data?.emails || []).filter((e) => new Date(e.created_at).getTime() >= cutoff);
  const t = tally(emails);

  const campaigns = Object.values(emails.reduce((acc, e) => {
    const key = e.subject || '(no subject)';
    (acc[key] ||= { subject: key, last: e.created_at, list: [] }).list.push(e);
    if (e.created_at > acc[key].last) acc[key].last = e.created_at;
    return acc;
  }, {})).map((c) => ({ ...c, ...tally(c.list) })).sort((a, b) => b.last.localeCompare(a.last));

  const cards = [
    { label: 'Sent', value: t.sent },
    { label: 'Delivered', value: t.delivered, sub: pct(t.delivered, t.sent) },
    { label: 'Opened', value: t.opened, sub: `${pct(t.opened, t.delivered)} open rate` },
    { label: 'Clicked', value: t.clicked, sub: `${pct(t.clicked, t.delivered)} click rate` },
    { label: 'Bounced', value: t.bounced, sub: pct(t.bounced, t.sent) },
    { label: 'Complaints', value: t.complained, sub: pct(t.complained, t.sent) },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div className="ll-admin-content-header" style={{ padding: '20px 32px 16px', borderBottom: '1px solid var(--border-hair)', flexShrink: 0 }}>
        <h1 style={{ margin: 0, fontSize: 'var(--fs-h1)', fontWeight: 700, letterSpacing: 'var(--ls-h1)' }}>Email Marketing</h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--ink-400)' }}>
          {data === null ? 'Loading from Resend…' : data.configured === false ? 'Resend is not configured — set RESEND_API_KEY in Netlify.' : data.error ? `Resend error: ${data.error}` : `Analytics from Resend · last ${data.emails.length} emails`}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
          {RANGES.map((r) => (
            <button key={r.id} onClick={() => setRange(r.id)}
              style={{ ...chipStyle, ...(range === r.id ? { background: 'var(--ink-900)', color: 'var(--paper-000)', borderColor: 'var(--ink-900)' } : {}) }}>{r.label}</button>
          ))}
          <button onClick={load} style={chipStyle}>Refresh</button>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '24px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12 }}>
          {cards.map((c) => (
            <div key={c.label} style={{ padding: '14px 16px', border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-1)', background: 'var(--paper-000)' }}>
              <div style={labelStyle}>{c.label}</div>
              <div style={{ fontSize: 26, fontWeight: 700, color: 'var(--ink-900)' }}>{c.value.toLocaleString('en-US')}</div>
              {c.sub && <div style={{ fontSize: 12, color: 'var(--ink-400)', marginTop: 2 }}>{c.sub}</div>}
            </div>
          ))}
        </div>

        <h2 style={sectionStyle}>Campaigns</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ borderBottom: '1px solid var(--border-hair)' }}>
              {['Subject', 'Last sent', 'Sent', 'Delivered', 'Open rate', 'Click rate', 'Bounced'].map((h) => <th key={h} style={thStyle}>{h}</th>)}
            </tr></thead>
            <tbody>
              {campaigns.length === 0 && <tr><td colSpan={7} style={{ ...tdStyle, color: 'var(--ink-400)' }}>{data === null ? 'Loading…' : 'No emails in this period.'}</td></tr>}
              {campaigns.map((c) => (
                <tr key={c.subject} style={{ borderBottom: '1px solid var(--border-hair)' }}>
                  <td style={{ ...tdStyle, fontWeight: 500 }}>{c.subject}</td>
                  <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>{formatDate(c.last)}</td>
                  <td style={tdStyle}>{c.sent}</td>
                  <td style={tdStyle}>{c.delivered}</td>
                  <td style={tdStyle}>{pct(c.opened, c.delivered)}</td>
                  <td style={tdStyle}>{pct(c.clicked, c.delivered)}</td>
                  <td style={tdStyle}>{c.bounced}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 style={sectionStyle}>Recent emails</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ borderBottom: '1px solid var(--border-hair)' }}>
              {['Recipient', 'Subject', 'Sent', 'Status'].map((h) => <th key={h} style={thStyle}>{h}</th>)}
            </tr></thead>
            <tbody>
              {emails.slice(0, 50).map((e) => {
                const [color, bg] = EVENT_COLORS[e.last_event] || ['#6B7280', '#F3F4F6'];
                return (
                  <tr key={e.id} style={{ borderBottom: '1px solid var(--border-hair)' }}>
                    <td style={tdStyle}>{(e.to || []).join(', ')}</td>
                    <td style={tdStyle}>{e.subject}</td>
                    <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>{formatDate(e.created_at)}</td>
                    <td style={tdStyle}><span style={{ padding: '3px 9px', borderRadius: 999, fontSize: 11, fontWeight: 600, color, background: bg, textTransform: 'capitalize' }}>{(e.last_event || 'sent').replace('_', ' ')}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const chipStyle = { padding: '5px 10px', border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-1)', fontSize: 12, fontFamily: 'var(--font-body)', background: 'var(--paper-000)', color: 'var(--ink-700)', cursor: 'pointer' };
const labelStyle = { fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-400)', marginBottom: 6 };
const sectionStyle = { margin: '32px 0 8px', fontSize: 16, fontWeight: 600, color: 'var(--ink-900)' };
const thStyle = { padding: '10px 12px', textAlign: 'left', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-400)', fontWeight: 500 };
const tdStyle = { padding: '11px 12px', fontSize: 13, color: 'var(--ink-900)', verticalAlign: 'middle' };
