import React from 'react';
import { apiFetch } from '../../lib/identity';
import { pathForPage } from '../../lib/seo';
import { NICHE_SOURCE_PAGES, NICHE_SOURCE_LABELS } from '../../lib/nicheQuizzes';

// Leads CRM: every form/quiz submission is a lead with a pipeline stage, deal
// value, next follow-up and an activity timeline (see update-lead and
// lead-activity functions).

function formatDate(iso, withTime = true) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', ...(withTime ? { hour: 'numeric', minute: '2-digit' } : {}) });
}
const money = (v) => (v === null || v === undefined || v === '' ? '—' : `$${Number(v).toLocaleString('en-US', { maximumFractionDigits: 0 })}`);
// <input type="date"> wants YYYY-MM-DD in local time.
const toDateInput = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
const startOfToday = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
const isDue = (lead) => lead.follow_up_at && !['won', 'lost'].includes(lead.status) && new Date(lead.follow_up_at) < new Date(startOfToday().getTime() + 86400000);

// Page each source lives on, so the Source column links straight to it.
const SOURCE_PAGES = {
  ai_receptionist: 'AIReceptionist',
  reputation_autopilot: 'ReputationAutopilot',
  park_supply: 'ParkSupply',
  branding: 'BrandingFunnel',
  brand_design: 'BrandDesign',
  consulting: 'Consulting',
  brand_partnership: 'BrandPartners',
  ...NICHE_SOURCE_PAGES,
};

const SOURCE_LABELS = {
  ai_receptionist: 'AI Receptionist',
  reputation_autopilot: 'Reputation Autopilot',
  park_supply: 'Park Supply quote',
  brand_partnership: 'Brand partnership',
  ...NICHE_SOURCE_LABELS,
};

export const STAGES = [
  { id: 'new', label: 'New', color: '#2563EB', bg: '#DBEAFE' },
  { id: 'contacted', label: 'Contacted', color: '#7C3AED', bg: '#EDE9FE' },
  { id: 'qualified', label: 'Qualified', color: '#B45309', bg: '#FEF3C7' },
  { id: 'proposal', label: 'Proposal', color: '#0E7490', bg: '#CFFAFE' },
  { id: 'won', label: 'Won', color: '#15803D', bg: '#DCFCE7' },
  { id: 'lost', label: 'Lost', color: '#6B7280', bg: '#F3F4F6' },
];
const STAGE = Object.fromEntries(STAGES.map((s) => [s.id, s]));

const KINDS = [
  { id: 'note', label: 'Note', icon: '✎' },
  { id: 'call', label: 'Call', icon: '☎' },
  { id: 'email', label: 'Email', icon: '✉' },
  { id: 'text', label: 'Text', icon: '💬' },
  { id: 'meeting', label: 'Meeting', icon: '◷' },
];
const KIND = { ...Object.fromEntries(KINDS.map((k) => [k.id, k])), status: { label: 'Stage change', icon: '→' } };

function StagePill({ status }) {
  const s = STAGE[status] || STAGE.new;
  return <span style={{ display: 'inline-block', padding: '3px 9px', borderRadius: 999, fontSize: 11, fontWeight: 600, color: s.color, background: s.bg, whiteSpace: 'nowrap' }}>{s.label}</span>;
}

export default function Leads() {
  const [leads, setLeads] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [source, setSource] = React.useState('all');
  const [stage, setStage] = React.useState('open');
  const [query, setQuery] = React.useState('');
  const [selectedId, setSelectedId] = React.useState(null);

  React.useEffect(() => {
    apiFetch('/.netlify/functions/get-leads')
      .then((r) => r?.json())
      .then((data) => { if (Array.isArray(data)) setLeads(data); })
      .finally(() => setLoading(false));
  }, []);

  const q = query.trim().toLowerCase();
  const bySource = source === 'all' ? leads : leads.filter((l) => l.source === source);
  const shown = bySource.filter((l) => {
    const st = l.status || 'new';
    if (stage === 'open' && ['won', 'lost'].includes(st)) return false;
    if (stage === 'due' && !isDue(l)) return false;
    if (STAGE[stage] && st !== stage) return false;
    if (!q) return true;
    return [l.full_name, l.email, l.company, l.phone, l.business_type, l.notes].some((v) => (v || '').toLowerCase().includes(q));
  });
  const count = (fn) => bySource.filter(fn).length;
  const pipelineValue = bySource.filter((l) => !['won', 'lost'].includes(l.status)).reduce((n, l) => n + (Number(l.deal_value) || 0), 0);
  const wonValue = bySource.filter((l) => l.status === 'won').reduce((n, l) => n + (Number(l.deal_value) || 0), 0);
  const selected = leads.find((l) => l.id === selectedId) || null;

  const patchLocal = (id, patch) => setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  const removeLocal = (id) => { setLeads((prev) => prev.filter((l) => l.id !== id)); setSelectedId(null); };

  const tabs = [
    { id: 'open', label: 'Open', n: count((l) => !['won', 'lost'].includes(l.status)) },
    { id: 'due', label: 'Follow-ups due', n: count(isDue) },
    ...STAGES.map((s) => ({ id: s.id, label: s.label, n: count((l) => (l.status || 'new') === s.id) })),
    { id: 'all', label: 'All', n: bySource.length },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', position: 'relative' }}>
      <div className="ll-admin-content-header" style={{ padding: '20px 32px 16px', borderBottom: '1px solid var(--border-hair)', flexShrink: 0, background: 'var(--paper-100)' }}>
        <h1 style={{ margin: 0, fontSize: 'var(--fs-h1)', fontWeight: 700, letterSpacing: 'var(--ls-h1)' }}>Leads CRM</h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--ink-400)' }}>
          {shown.length} lead{shown.length === 1 ? '' : 's'} shown · Open pipeline {money(pipelineValue)} · Won {money(wonValue)}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setStage(t.id)}
              style={{ ...chipStyle, ...(stage === t.id ? { background: 'var(--ink-900)', color: 'var(--paper-000)', borderColor: 'var(--ink-900)' } : {}),
                ...(t.id === 'due' && t.n > 0 && stage !== 'due' ? { borderColor: '#F59E0B', color: '#B45309' } : {}) }}>
              {t.label} <span style={{ opacity: 0.7 }}>{t.n}</span>
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, email, company…" aria-label="Search leads"
            style={{ ...inputStyle, width: 260, maxWidth: '100%' }} />
          <select value={source} onChange={(e) => setSource(e.target.value)} aria-label="Filter by source" style={{ ...inputStyle, width: 'auto' }}>
            <option value="all">All sources ({leads.length})</option>
            {Object.keys(SOURCE_LABELS).map((s) => (
              <option key={s} value={s}>{SOURCE_LABELS[s]} ({leads.filter((l) => l.source === s).length})</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {loading ? (
          <div style={{ padding: '32px 28px', color: 'var(--ink-400)', fontSize: 13 }}>Loading…</div>
        ) : shown.length === 0 ? (
          <div style={{ padding: '32px 28px', color: 'var(--ink-400)', fontSize: 13 }}>No leads match.</div>
        ) : (
          <div className="ll-table-scroll">
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
              <thead style={{ position: 'sticky', top: 0, background: 'var(--paper-100)', zIndex: 2 }}>
                <tr style={{ borderBottom: '1px solid var(--border-hair)' }}>
                  {['Name', 'Stage', 'Source', 'Company / type', 'Value', 'Follow-up', 'Email', 'Created'].map((h, i) => (
                    <th key={h} style={i === 0 ? thStickyStyle : thStyle}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {shown.map((lead) => (
                  <tr key={lead.id} onClick={() => setSelectedId(lead.id)} className="ll-crm-row"
                    style={{ borderBottom: '1px solid var(--border-hair)', cursor: 'pointer', background: lead.id === selectedId ? 'var(--paper-000)' : undefined }}>
                    <td style={{ ...tdStickyStyle, fontWeight: 600 }}>{lead.full_name}</td>
                    <td style={tdStyle}><StagePill status={lead.status} /></td>
                    <td style={tdStyle}>{SOURCE_LABELS[lead.source] || lead.source || '—'}</td>
                    <td style={tdStyle}>{lead.company || lead.business_type || '—'}</td>
                    <td style={{ ...tdStyle, fontFamily: 'var(--font-mono)', fontSize: 12 }}>{money(lead.deal_value)}</td>
                    <td style={{ ...tdStyle, whiteSpace: 'nowrap', fontSize: 12, color: isDue(lead) ? '#B45309' : 'var(--ink-600)', fontWeight: isDue(lead) ? 600 : 400 }}>
                      {lead.follow_up_at ? formatDate(lead.follow_up_at, false) : '—'}{isDue(lead) ? ' · due' : ''}
                    </td>
                    <td style={tdStyle}>{lead.email}</td>
                    <td style={{ ...tdStyle, fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-400)', whiteSpace: 'nowrap' }}>{formatDate(lead.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && (
        <LeadDrawer key={selected.id} lead={selected} onClose={() => setSelectedId(null)} onPatch={patchLocal} onDeleted={removeLocal} />
      )}
    </div>
  );
}

function LeadDrawer({ lead, onClose, onPatch, onDeleted }) {
  const [activity, setActivity] = React.useState(null);
  const [kind, setKind] = React.useState('note');
  const [draft, setDraft] = React.useState('');
  const [saving, setSaving] = React.useState(false);
  const [fields, setFields] = React.useState({
    phone: lead.phone || '', company: lead.company || '',
    deal_value: lead.deal_value ?? '', follow_up_at: toDateInput(lead.follow_up_at),
  });
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    apiFetch(`/.netlify/functions/lead-activity?lead_id=${encodeURIComponent(lead.id)}`)
      .then((r) => r?.json())
      .then((data) => setActivity(Array.isArray(data) ? data : []))
      .catch(() => setActivity([]));
  }, [lead.id]);

  React.useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  async function update(patch) {
    setError('');
    const res = await apiFetch('/.netlify/functions/update-lead', { method: 'PATCH', body: JSON.stringify({ id: lead.id, ...patch }) });
    if (!res?.ok) { setError('Could not save. Try again.'); return; }
    const data = await res.json();
    onPatch(lead.id, data.lead);
    if (data.activity) setActivity((a) => [data.activity, ...(a || [])]);
  }

  function saveField(k) {
    const current = k === 'follow_up_at' ? toDateInput(lead.follow_up_at) : (lead[k] ?? '');
    if (String(fields[k]) === String(current)) return;
    // A date input gives a calendar day; store it as local noon so it never shifts a day.
    const v = k === 'follow_up_at' ? (fields[k] ? new Date(`${fields[k]}T12:00:00`).toISOString() : null) : fields[k];
    update({ [k]: v });
  }

  async function addActivity(e) {
    e.preventDefault();
    if (!draft.trim()) return;
    setSaving(true);
    const res = await apiFetch('/.netlify/functions/lead-activity', { method: 'POST', body: JSON.stringify({ lead_id: lead.id, kind, body: draft }) });
    setSaving(false);
    if (!res?.ok) { setError('Could not add the entry. Try again.'); return; }
    const row = await res.json();
    setActivity((a) => [row, ...(a || [])]);
    setDraft('');
    // Logging a touchpoint on a brand-new lead moves it to Contacted.
    if (kind !== 'note' && (lead.status || 'new') === 'new') update({ status: 'contacted' });
  }

  async function removeActivity(id) {
    await apiFetch('/.netlify/functions/lead-activity', { method: 'DELETE', body: JSON.stringify({ id }) });
    setActivity((a) => a.filter((x) => x.id !== id));
  }

  async function deleteLead() {
    await apiFetch('/.netlify/functions/delete-lead', { method: 'DELETE', body: JSON.stringify({ id: lead.id }) });
    onDeleted(lead.id);
  }

  const sourcePage = SOURCE_PAGES[lead.source];
  const location = [lead.city, lead.region, lead.country].filter(Boolean).join(', ');
  const quizAnswers = [
    ['Business type', lead.business_type],
    ['Volume / wk', lead.missed_calls || lead.job_volume],
    [lead.source === 'brand_partnership' ? 'Interested in' : 'Pain point', lead.pain_point || lead.review_pain_point],
    ['Decision maker', lead.decision_maker],
    ['Location', location],
  ].filter(([, v]) => v);

  return (
    <>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(15,13,10,0.25)', zIndex: 5 }} />
      <aside role="dialog" aria-label={`Lead: ${lead.full_name}`}
        style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 'min(520px, 100%)', background: 'var(--paper-100)', borderLeft: '1px solid var(--border-hair)', zIndex: 6, display: 'flex', flexDirection: 'column', boxShadow: '-20px 0 40px -20px rgba(15,13,10,0.3)' }}>
        <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--border-hair)', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>{lead.full_name}</h2>
            <div style={{ fontSize: 13, color: 'var(--ink-500)', marginTop: 4, display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              <a href={`mailto:${lead.email}`} style={{ color: 'var(--cyan-700)' }}>{lead.email}</a>
              {lead.phone && <a href={`tel:${lead.phone}`} style={{ color: 'var(--cyan-700)' }}>{lead.phone}</a>}
            </div>
            <div style={{ fontSize: 12, color: 'var(--ink-400)', marginTop: 4 }}>
              {sourcePage ? <a href={pathForPage(sourcePage)} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--ink-500)' }}>{SOURCE_LABELS[lead.source]} ↗</a> : (SOURCE_LABELS[lead.source] || lead.source)}
              {' · '}{formatDate(lead.created_at)}
            </div>
          </div>
          <button onClick={onClose} aria-label="Close" style={{ ...chipStyle, fontSize: 16, padding: '2px 10px' }}>×</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '18px 22px', display: 'grid', gap: 20, alignContent: 'start' }}>
          <section>
            <div style={labelStyle}>Stage</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {STAGES.map((s) => {
                const on = (lead.status || 'new') === s.id;
                return (
                  <button key={s.id} onClick={() => !on && update({ status: s.id })}
                    style={{ ...chipStyle, ...(on ? { background: s.bg, color: s.color, borderColor: s.color, fontWeight: 700 } : {}) }}>
                    {s.label}
                  </button>
                );
              })}
            </div>
          </section>

          <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[['company', 'Company', 'text'], ['phone', 'Phone', 'tel'], ['deal_value', 'Deal value ($)', 'number'], ['follow_up_at', 'Next follow-up', 'date']].map(([k, label, type]) => (
              <label key={k} style={{ display: 'grid', gap: 4 }}>
                <span style={labelStyle}>{label}</span>
                <input type={type} value={fields[k]} min={type === 'number' ? 0 : undefined}
                  onChange={(e) => setFields((f) => ({ ...f, [k]: e.target.value }))}
                  onBlur={() => saveField(k)}
                  onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); }}
                  style={inputStyle} />
              </label>
            ))}
          </section>
          {error && <p role="alert" style={{ margin: 0, color: '#B91C1C', fontSize: 13 }}>{error}</p>}

          {(quizAnswers.length > 0 || lead.notes) && (
            <section>
              <div style={labelStyle}>Submission</div>
              <div style={{ border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-2)', padding: 12, background: 'var(--paper-000)', fontSize: 13, display: 'grid', gap: 6 }}>
                {quizAnswers.map(([k, v]) => <div key={k}><span style={{ color: 'var(--ink-400)' }}>{k}:</span> {v}</div>)}
                {lead.notes && <pre style={{ margin: 0, fontFamily: 'var(--font-body)', fontSize: 13, whiteSpace: 'pre-wrap' }}>{lead.notes}</pre>}
              </div>
            </section>
          )}

          <section>
            <div style={labelStyle}>Activity</div>
            <form onSubmit={addActivity} style={{ display: 'grid', gap: 8, marginBottom: 14 }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {KINDS.map((k) => (
                  <button type="button" key={k.id} onClick={() => setKind(k.id)}
                    style={{ ...chipStyle, ...(kind === k.id ? { background: 'var(--ink-900)', color: 'var(--paper-000)', borderColor: 'var(--ink-900)' } : {}) }}>
                    {k.icon} {k.label}
                  </button>
                ))}
              </div>
              <textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={3}
                placeholder={kind === 'note' ? 'Add a note…' : `What happened on the ${KIND[kind].label.toLowerCase()}?`}
                onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) addActivity(e); }}
                style={{ ...inputStyle, resize: 'vertical', minHeight: 70 }} />
              <div>
                <button type="submit" disabled={saving || !draft.trim()}
                  style={{ ...chipStyle, background: 'var(--ink-900)', color: 'var(--paper-000)', borderColor: 'var(--ink-900)', padding: '7px 14px', opacity: saving || !draft.trim() ? 0.5 : 1 }}>
                  {saving ? 'Saving…' : kind === 'note' ? 'Add note' : `Log ${KIND[kind].label.toLowerCase()}`}
                </button>
                <span style={{ marginLeft: 10, fontSize: 11, color: 'var(--ink-400)' }}>⌘↵ to save</span>
              </div>
            </form>
            {activity === null ? (
              <div style={{ fontSize: 13, color: 'var(--ink-400)' }}>Loading…</div>
            ) : activity.length === 0 ? (
              <div style={{ fontSize: 13, color: 'var(--ink-400)' }}>No activity yet.</div>
            ) : (
              <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 10 }}>
                {activity.map((a) => (
                  <li key={a.id} style={{ border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-2)', padding: '10px 12px', background: a.kind === 'status' ? 'transparent' : 'var(--paper-000)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--ink-400)' }}>
                      <span style={{ fontWeight: 600, color: 'var(--ink-600)' }}>{KIND[a.kind]?.icon} {KIND[a.kind]?.label || a.kind}</span>
                      <span>{formatDate(a.created_at)}</span>
                      <button onClick={() => removeActivity(a.id)} aria-label="Delete entry"
                        style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-400)', fontSize: 14 }}>×</button>
                    </div>
                    <div style={{ marginTop: 4, fontSize: 13, whiteSpace: 'pre-wrap', color: 'var(--ink-900)' }}>{a.body}</div>
                  </li>
                ))}
              </ol>
            )}
          </section>
        </div>

        <div style={{ padding: '12px 22px', borderTop: '1px solid var(--border-hair)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, color: 'var(--ink-400)', flex: 1 }}>Updated {formatDate(lead.updated_at || lead.created_at)}</span>
          {confirmDelete ? (
            <>
              <span style={{ fontSize: 12, color: 'var(--ink-600)' }}>Delete lead and its activity?</span>
              <button onClick={deleteLead} style={{ ...chipStyle, background: '#DC2626', color: '#fff', borderColor: '#DC2626' }}>Yes</button>
              <button onClick={() => setConfirmDelete(false)} style={chipStyle}>Cancel</button>
            </>
          ) : (
            <button onClick={() => setConfirmDelete(true)} style={{ ...chipStyle, borderColor: '#FCA5A5', color: '#DC2626' }}>Delete lead</button>
          )}
        </div>
      </aside>
    </>
  );
}

const chipStyle = { padding: '5px 10px', border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-1)', fontSize: 12, fontFamily: 'var(--font-body)', background: 'var(--paper-000)', color: 'var(--ink-700)', cursor: 'pointer' };
const inputStyle = { padding: '7px 10px', border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-1)', fontSize: 13, fontFamily: 'var(--font-body)', background: 'var(--paper-000)', color: 'var(--ink-900)', boxSizing: 'border-box', width: '100%' };
const labelStyle = { fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-400)', marginBottom: 6 };
const thStyle = { padding: '10px 22px', textAlign: 'left', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-400)', fontWeight: 500 };
const tdStyle = { padding: '13px 22px', fontSize: 13, color: 'var(--ink-900)', verticalAlign: 'middle' };
// Name stays visible while swiping through the rest of the columns on a narrow screen.
const thStickyStyle = { ...thStyle, position: 'sticky', left: 0, zIndex: 1, background: 'var(--paper-100)', borderRight: '1px solid var(--border-hair)' };
const tdStickyStyle = { ...tdStyle, position: 'sticky', left: 0, zIndex: 1, background: 'var(--paper-100)', borderRight: '1px solid var(--border-hair)' };
