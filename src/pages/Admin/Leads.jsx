import React from 'react';
import { apiFetch } from '../../lib/identity';
import { StatusBadge, STATUSES, formatDate } from './shared';

const FILTERS = ['all', ...STATUSES];

export default function Leads() {
  const [leads, setLeads] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [filter, setFilter] = React.useState('all');
  const [selectedId, setSelectedId] = React.useState(null);

  async function fetchLeads() {
    const res = await apiFetch('/.netlify/functions/get-leads');
    const data = await res?.json();
    if (Array.isArray(data)) setLeads(data);
    setLoading(false);
  }

  React.useEffect(() => { fetchLeads(); }, []);

  const visible = filter === 'all' ? leads : leads.filter(l => l.status === filter);
  const selected = leads.find(l => l.id === selectedId) || null;
  const countFor = f => f === 'all' ? leads.length : leads.filter(l => l.status === f).length;

  async function updateLead(id, patch) {
    const res = await apiFetch('/.netlify/functions/update-lead', {
      method: 'PATCH',
      body: JSON.stringify({ id, ...patch }),
    });
    const updated = await res?.json();
    if (updated?.id) setLeads(prev => prev.map(l => l.id === id ? updated : l));
    return updated;
  }

  async function deleteLead(id) {
    await apiFetch('/.netlify/functions/delete-lead', {
      method: 'DELETE',
      body: JSON.stringify({ id }),
    });
    setLeads(prev => prev.filter(l => l.id !== id));
    setSelectedId(null);
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* List */}
      <div style={{ flex: selectedId ? '0 0 55%' : '1', display: 'flex', flexDirection: 'column', borderRight: selectedId ? '1px solid var(--border-hair)' : 'none', overflow: 'hidden' }}>
        <div style={{ padding: '28px 32px 0', flexShrink: 0 }}>
          <h1 style={{ margin: '0 0 20px', fontSize: 'var(--fs-h1)', fontWeight: 700, letterSpacing: 'var(--ls-h1)' }}>Leads</h1>
          <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--border-hair)' }}>
            {FILTERS.map(f => (
              <button key={f} onClick={() => setFilter(f)}
                style={{ padding: '8px 14px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 13,
                  fontWeight: filter === f ? 600 : 400, color: filter === f ? 'var(--ink-900)' : 'var(--ink-400)',
                  borderBottom: filter === f ? '2px solid var(--ink-900)' : '2px solid transparent', marginBottom: -1 }}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
                <span style={{ marginLeft: 5, fontSize: 11, fontFamily: 'var(--font-mono)', color: filter === f ? 'var(--cyan-700)' : 'var(--ink-400)' }}>
                  {countFor(f)}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {loading ? (
            <div style={{ padding: '40px 32px', color: 'var(--ink-400)', fontSize: 'var(--fs-body-sm)' }}>Loading…</div>
          ) : visible.length === 0 ? (
            <div style={{ padding: '40px 32px', color: 'var(--ink-400)', fontSize: 'var(--fs-body-sm)' }}>No leads with this status.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ position: 'sticky', top: 0, background: 'var(--paper-100)', zIndex: 1 }}>
                <tr style={{ borderBottom: '1px solid var(--border-hair)' }}>
                  {['Name & Company', 'Industry', 'Status', 'Date'].map(h => (
                    <th key={h} style={thStyle}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visible.map(lead => (
                  <LeadRow key={lead.id} lead={lead} selected={lead.id === selectedId}
                    onClick={() => setSelectedId(lead.id === selectedId ? null : lead.id)} />
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Detail */}
      {selected && (
        <div style={{ flex: '0 0 45%', overflowY: 'auto', background: 'var(--paper-000)', borderLeft: '1px solid var(--border-hair)' }}>
          <LeadDetail lead={selected} onUpdate={updateLead} onDelete={deleteLead} onClose={() => setSelectedId(null)} />
        </div>
      )}
    </div>
  );
}

function LeadRow({ lead, selected, onClick }) {
  const [hover, setHover] = React.useState(false);
  return (
    <tr onClick={onClick} style={{ borderBottom: '1px solid var(--border-hair)', cursor: 'pointer', background: selected || hover ? 'var(--paper-200)' : 'transparent' }}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <td style={tdStyle}>
        <div style={{ fontWeight: 500 }}>{lead.full_name}</div>
        <div style={{ fontSize: 12, color: 'var(--ink-400)', marginTop: 2 }}>{lead.company}</div>
      </td>
      <td style={{ ...tdStyle, color: 'var(--ink-400)' }}>{lead.industry || '—'}</td>
      <td style={tdStyle}><StatusBadge status={lead.status} /></td>
      <td style={{ ...tdStyle, color: 'var(--ink-400)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>{formatDate(lead.created_at)}</td>
    </tr>
  );
}

function LeadDetail({ lead, onUpdate, onDelete, onClose }) {
  const [status, setStatus] = React.useState(lead.status);
  const [notes, setNotes] = React.useState(lead.notes || '');
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [confirmDelete, setConfirmDelete] = React.useState(false);

  React.useEffect(() => {
    setStatus(lead.status);
    setNotes(lead.notes || '');
    setSaved(false);
  }, [lead.id]);

  async function handleSave() {
    setSaving(true);
    await onUpdate(lead.id, { status, notes });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div style={{ padding: '28px 28px 48px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 'var(--fs-h2)', fontWeight: 700, letterSpacing: 'var(--ls-h2)' }}>{lead.full_name}</h2>
          <div style={{ fontSize: 'var(--fs-body-sm)', color: 'var(--ink-400)', marginTop: 4 }}>{lead.company}</div>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: 'var(--ink-400)', lineHeight: 1, padding: 4 }}>×</button>
      </div>

      <div style={{ display: 'grid', gap: 18, marginBottom: 28 }}>
        <Field label="Email">
          <a href={`mailto:${lead.email}`} style={{ fontSize: 'var(--fs-body-sm)', color: 'var(--cyan-700)', textDecoration: 'none' }}>{lead.email}</a>
        </Field>
        {lead.industry && <Field label="Industry"><Value>{lead.industry}</Value></Field>}
        <Field label="Data problem"><Value>{lead.data_problem}</Value></Field>
        {lead.decision_it_feeds && <Field label="Decision it feeds"><Value>{lead.decision_it_feeds}</Value></Field>}
        {lead.referral && <Field label="How they found us"><Value>{lead.referral.replace(/-/g, ' ')}</Value></Field>}
        <Field label="Submitted"><Value style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{formatDate(lead.created_at)}</Value></Field>
      </div>

      <div style={{ borderTop: '1px solid var(--border-hair)', paddingTop: 24, display: 'grid', gap: 18 }}>
        <div style={{ display: 'grid', gap: 8 }}>
          <label style={labelStyle}>Status</label>
          <select value={status} onChange={e => setStatus(e.target.value)}
            style={{ padding: '9px 12px', border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-2)', fontSize: 14, fontFamily: 'var(--font-body)', background: 'var(--paper-000)', color: 'var(--ink-900)' }}>
            {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
        </div>
        <div style={{ display: 'grid', gap: 8 }}>
          <label style={labelStyle}>Internal notes</label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={4} placeholder="Add notes about this lead…"
            style={{ padding: '10px 12px', border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-2)', fontSize: 14, fontFamily: 'var(--font-body)', resize: 'vertical', color: 'var(--ink-900)', background: 'var(--paper-000)' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={handleSave} disabled={saving}
            style={{ padding: '10px 20px', background: saving ? 'var(--ink-400)' : 'var(--ink-900)', color: 'var(--paper-100)', border: 'none', borderRadius: 'var(--radius-2)', fontSize: 14, fontWeight: 600, cursor: saving ? 'default' : 'pointer', fontFamily: 'var(--font-body)' }}>
            {saving ? 'Saving…' : 'Save changes'}
          </button>
          {saved && <span style={{ fontSize: 13, color: '#065F46', fontFamily: 'var(--font-mono)' }}>✓ Saved</span>}
        </div>

        <div style={{ borderTop: '1px solid var(--border-hair)', paddingTop: 20, marginTop: 8 }}>
          {!confirmDelete ? (
            <button onClick={() => setConfirmDelete(true)}
              style={{ padding: '8px 16px', background: 'none', border: '1px solid #FCA5A5', borderRadius: 'var(--radius-2)', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-body)', color: '#DC2626' }}>
              Delete lead
            </button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 13, color: 'var(--ink-600)' }}>Are you sure?</span>
              <button onClick={() => onDelete(lead.id)}
                style={{ padding: '8px 14px', background: '#DC2626', border: 'none', borderRadius: 'var(--radius-2)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)', color: '#fff' }}>
                Yes, delete
              </button>
              <button onClick={() => setConfirmDelete(false)}
                style={{ padding: '8px 14px', background: 'none', border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-2)', fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-body)', color: 'var(--ink-600)' }}>
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ display: 'grid', gap: 4 }}>
      <div style={labelStyle}>{label}</div>
      {children}
    </div>
  );
}

function Value({ children, style }) {
  return <div style={{ fontSize: 'var(--fs-body-sm)', lineHeight: 'var(--lh-body-sm)', color: 'var(--ink-600)', ...style }}>{children}</div>;
}

const labelStyle = { fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-400)' };
const thStyle = { padding: '10px 20px', textAlign: 'left', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-400)', fontWeight: 500 };
const tdStyle = { padding: '14px 20px', fontSize: 'var(--fs-body-sm)', color: 'var(--ink-900)', verticalAlign: 'middle' };
