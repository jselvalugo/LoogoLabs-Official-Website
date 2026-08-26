import React from 'react';
import { apiFetch } from '../../lib/identity';
import { StatusBadge, formatDate } from './shared';

export default function Dashboard({ onViewLeads }) {
  const [leads, setLeads] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    apiFetch('/.netlify/functions/get-leads')
      .then(r => r?.json())
      .then(data => { if (Array.isArray(data)) setLeads(data); })
      .finally(() => setLoading(false));
  }, []);

  const count = s => (leads || []).filter(l => l.status === s).length;

  return (
    <div style={{ padding: '36px 40px', maxWidth: 960, overflowY: 'auto', flex: 1 }}>
      <h1 style={{ margin: '0 0 28px', fontSize: 'var(--fs-h1)', fontWeight: 700, letterSpacing: 'var(--ls-h1)' }}>Dashboard</h1>

      {loading ? <Spinner /> : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 40 }}>
            {[
              { label: 'Total leads',  value: leads.length,       accent: false },
              { label: 'New',          value: count('new'),        accent: true  },
              { label: 'Contacted',    value: count('contacted'),  accent: false },
              { label: 'Converted',    value: count('converted'),  accent: false },
            ].map(({ label, value, accent }) => (
              <div key={label} style={{ background: 'var(--paper-000)', border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-2)', padding: '20px 22px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-400)' }}>{label}</div>
                <div style={{ fontSize: 36, fontWeight: 700, letterSpacing: '-0.03em', marginTop: 8, color: accent ? 'var(--cyan-700)' : 'var(--ink-900)' }}>{value}</div>
              </div>
            ))}
          </div>

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
