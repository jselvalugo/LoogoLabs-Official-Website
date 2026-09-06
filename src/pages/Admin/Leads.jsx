import React from 'react';
import { apiFetch } from '../../lib/identity';

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
}

export default function Leads() {
  const [leads, setLeads] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    apiFetch('/.netlify/functions/get-leads')
      .then((r) => r?.json())
      .then((data) => { if (Array.isArray(data)) setLeads(data); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div className="ll-admin-content-header" style={{ padding: '20px 32px 16px', borderBottom: '1px solid var(--border-hair)', flexShrink: 0, background: 'var(--paper-100)' }}>
        <h1 style={{ margin: 0, fontSize: 'var(--fs-h1)', fontWeight: 700, letterSpacing: 'var(--ls-h1)' }}>
          AI Receptionist Funnel Leads
        </h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--ink-400)' }}>
          {leads.length} submission{leads.length === 1 ? '' : 's'}
        </p>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {loading ? (
          <div style={{ padding: '32px 28px', color: 'var(--ink-400)', fontSize: 13 }}>Loading…</div>
        ) : leads.length === 0 ? (
          <div style={{ padding: '32px 28px', color: 'var(--ink-400)', fontSize: 13 }}>No funnel submissions yet.</div>
        ) : (
          <div className="ll-table-scroll">
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
              <thead style={{ position: 'sticky', top: 0, background: 'var(--paper-100)', zIndex: 1 }}>
                <tr style={{ borderBottom: '1px solid var(--border-hair)' }}>
                  {['Full name', 'Email', 'Business type', 'Missed calls/wk', 'Pain point', 'Decision maker', 'Submitted'].map((h) => (
                    <th key={h} style={thStyle}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} style={{ borderBottom: '1px solid var(--border-hair)' }}>
                    <td style={{ ...tdStyle, fontWeight: 500 }}>{lead.full_name}</td>
                    <td style={tdStyle}>{lead.email}</td>
                    <td style={tdStyle}>{lead.business_type || '—'}</td>
                    <td style={tdStyle}>{lead.missed_calls || '—'}</td>
                    <td style={tdStyle}>{lead.pain_point || '—'}</td>
                    <td style={tdStyle}>{lead.decision_maker || '—'}</td>
                    <td style={{ ...tdStyle, fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-400)', whiteSpace: 'nowrap' }}>
                      {formatDate(lead.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const thStyle = { padding: '10px 22px', textAlign: 'left', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-400)', fontWeight: 500 };
const tdStyle = { padding: '13px 22px', fontSize: 13, color: 'var(--ink-900)', verticalAlign: 'middle' };
