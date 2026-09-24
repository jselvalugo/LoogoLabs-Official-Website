import React from 'react';
import { apiFetch } from '../../lib/identity';

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
}

const SOURCE_LABELS = {
  ai_receptionist: 'AI Receptionist',
  reputation_autopilot: 'Reputation Autopilot',
  park_supply: 'Park Supply quote',
};

export default function Leads() {
  const [leads, setLeads] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [confirmDeleteId, setConfirmDeleteId] = React.useState(null);
  const [deletingId, setDeletingId] = React.useState(null);

  React.useEffect(() => {
    apiFetch('/.netlify/functions/get-leads')
      .then((r) => r?.json())
      .then((data) => { if (Array.isArray(data)) setLeads(data); })
      .finally(() => setLoading(false));
  }, []);

  async function deleteLead(id) {
    setDeletingId(id);
    await apiFetch('/.netlify/functions/delete-lead', { method: 'DELETE', body: JSON.stringify({ id }) });
    setLeads((prev) => prev.filter((l) => l.id !== id));
    setConfirmDeleteId(null);
    setDeletingId(null);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div className="ll-admin-content-header" style={{ padding: '20px 32px 16px', borderBottom: '1px solid var(--border-hair)', flexShrink: 0, background: 'var(--paper-100)' }}>
        <h1 style={{ margin: 0, fontSize: 'var(--fs-h1)', fontWeight: 700, letterSpacing: 'var(--ls-h1)' }}>
          Quiz Funnel Leads
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
              <thead style={{ position: 'sticky', top: 0, background: 'var(--paper-100)', zIndex: 2 }}>
                <tr style={{ borderBottom: '1px solid var(--border-hair)' }}>
                  {['Full name', 'Email', 'Quiz', 'Business type', 'Volume/wk', 'Pain point', 'Decision maker', 'Details', 'Submitted', ''].map((h, i) => (
                    <th key={h || 'actions'} style={i === 0 ? thStickyStyle : thStyle}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} style={{ borderBottom: '1px solid var(--border-hair)' }}>
                    <td style={{ ...tdStickyStyle, fontWeight: 500 }}>{lead.full_name}</td>
                    <td style={tdStyle}>{lead.email}</td>
                    <td style={tdStyle}>{SOURCE_LABELS[lead.source] || lead.source || '—'}</td>
                    <td style={tdStyle}>{lead.business_type || '—'}</td>
                    <td style={tdStyle}>{lead.missed_calls || lead.job_volume || '—'}</td>
                    <td style={tdStyle}>{lead.pain_point || lead.review_pain_point || '—'}</td>
                    <td style={tdStyle}>{lead.decision_maker || '—'}</td>
                    <td style={tdStyle}>
                      {lead.notes ? (
                        <details>
                          <summary style={{ cursor: 'pointer', fontSize: 12, color: 'var(--ink-600)' }}>View</summary>
                          <pre style={{ margin: '8px 0 0', fontFamily: 'var(--font-mono)', fontSize: 11, whiteSpace: 'pre-wrap', maxWidth: 420 }}>{lead.notes}</pre>
                        </details>
                      ) : '—'}
                    </td>
                    <td style={{ ...tdStyle, fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-400)', whiteSpace: 'nowrap' }}>
                      {formatDate(lead.created_at)}
                    </td>
                    <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>
                      {confirmDeleteId === lead.id ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 12, color: 'var(--ink-600)' }}>Delete?</span>
                          <button onClick={() => deleteLead(lead.id)} disabled={deletingId === lead.id}
                            style={{ padding: '5px 10px', background: '#DC2626', border: 'none', borderRadius: 'var(--radius-1)', fontSize: 12, fontWeight: 600, cursor: deletingId === lead.id ? 'default' : 'pointer', fontFamily: 'var(--font-body)', color: '#fff' }}>
                            {deletingId === lead.id ? 'Deleting…' : 'Yes'}
                          </button>
                          <button onClick={() => setConfirmDeleteId(null)} disabled={deletingId === lead.id}
                            style={{ padding: '5px 10px', background: 'none', border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-1)', fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-body)', color: 'var(--ink-600)' }}>
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => setConfirmDeleteId(lead.id)}
                          style={{ padding: '5px 10px', background: 'none', border: '1px solid #FCA5A5', borderRadius: 'var(--radius-1)', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-body)', color: '#DC2626' }}>
                          Delete
                        </button>
                      )}
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
// Name stays visible while swiping through the rest of the columns on a narrow screen.
const thStickyStyle = { ...thStyle, position: 'sticky', left: 0, zIndex: 1, background: 'var(--paper-100)', borderRight: '1px solid var(--border-hair)' };
const tdStickyStyle = { ...tdStyle, position: 'sticky', left: 0, zIndex: 1, background: 'var(--paper-100)', borderRight: '1px solid var(--border-hair)' };
