import React from 'react';
import { apiFetch } from '../../lib/identity';
import { DRAFT_STORAGE_KEY, PRODUCTS_BY_SKU } from '../../lib/parkSupply';

export const PROPOSAL_STATUSES = ['new', 'reviewing', 'sent', 'won', 'lost'];
const FILTERS = ['all', ...PROPOSAL_STATUSES];

const STATUS_COLORS = {
  new: { bg: '#FFF4D6', fg: '#8A5A00' },
  reviewing: { bg: 'var(--ink-100)', fg: 'var(--ink-700)' },
  sent: { bg: '#DCEBFA', fg: '#1D4E80' },
  won: { bg: '#D6F5E3', fg: '#12673A' },
  lost: { bg: 'var(--paper-200)', fg: 'var(--ink-500)' },
};

const usd = (n) => Number(n || 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' });

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
}

function StatusPill({ status }) {
  const c = STATUS_COLORS[status] || STATUS_COLORS.lost;
  return (
    <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 999, background: c.bg, color: c.fg,
      fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>
      {status}
    </span>
  );
}

// Proposal submissions from /park-supply. The list is owned by the admin shell
// (it also drives the sidebar's "new" badge); this view reads and edits it.
export default function Proposals({ proposals, loading, onChange, onRemove, onRefresh }) {
  const [filter, setFilter] = React.useState('all');
  const [selectedId, setSelectedId] = React.useState(null);

  const visible = filter === 'all' ? proposals : proposals.filter((p) => p.status === filter);
  const selected = proposals.find((p) => p.id === selectedId) || null;
  const countFor = (f) => (f === 'all' ? proposals.length : proposals.filter((p) => p.status === f).length);

  async function update(id, patch) {
    const res = await apiFetch('/.netlify/functions/update-proposal', { method: 'PATCH', body: JSON.stringify({ id, ...patch }) });
    const row = await res?.json();
    if (res?.ok) onChange(row);
    return res?.ok;
  }

  function open(p) {
    setSelectedId(p.id);
    // Opening a new submission is what "reviewing" means; saves a click.
    if (p.status === 'new') update(p.id, { status: 'reviewing' });
  }

  async function remove(id) {
    await apiFetch('/.netlify/functions/delete-proposal', { method: 'DELETE', body: JSON.stringify({ id }) });
    onRemove(id);
    setSelectedId(null);
  }

  return (
    <div className={`ll-admin-split${selected ? ' has-panel' : ''}`} style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
      <div className="ll-admin-split-list" style={{ flex: selected ? '0 0 44%' : '1', display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRight: selected ? '1px solid var(--border-hair)' : 'none' }}>
        <div className="ll-admin-content-header" style={{ padding: '20px 28px 0', flexShrink: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: 'var(--fs-h1)', fontWeight: 700, letterSpacing: 'var(--ls-h1)' }}>Proposals</h1>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--ink-400)' }}>
                Submissions from <a href="/park-supply" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--ink-600)' }}>/park-supply</a>
              </p>
            </div>
            <button onClick={onRefresh} style={ghostBtn}>Refresh</button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', borderBottom: '1px solid var(--border-hair)', marginTop: 16 }}>
            {FILTERS.map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                style={{ padding: '7px 12px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 13,
                  textTransform: 'capitalize', color: filter === f ? 'var(--ink-900)' : 'var(--ink-400)', fontWeight: filter === f ? 600 : 400,
                  borderBottom: `2px solid ${filter === f ? 'var(--ink-900)' : 'transparent'}`, marginBottom: -1 }}>
                {f} <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-400)' }}>{countFor(f)}</span>
              </button>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {loading && !proposals.length ? (
            <div style={emptyStyle}>Loading…</div>
          ) : visible.length === 0 ? (
            <div style={emptyStyle}>{proposals.length ? 'Nothing with this status.' : 'No proposal submissions yet.'}</div>
          ) : visible.map((p) => {
            const active = p.id === selectedId;
            return (
              <button key={p.id} onClick={() => open(p)}
                style={{ display: 'block', width: '100%', textAlign: 'left', padding: '14px 28px', border: 'none', borderBottom: '1px solid var(--border-hair)',
                  background: active ? 'var(--paper-000)' : 'transparent', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
                  <span style={{ fontWeight: p.status === 'new' ? 700 : 600, fontSize: 14, color: 'var(--ink-900)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {p.organization || p.contact}
                  </span>
                  <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--ink-900)', whiteSpace: 'nowrap' }}>{usd(p.total)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', marginTop: 6 }}>
                  <span style={{ fontSize: 12, color: 'var(--ink-400)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {[p.project, `${p.lines?.length || 0} line${p.lines?.length === 1 ? '' : 's'}`, formatDate(p.created_at)].filter(Boolean).join(' · ')}
                  </span>
                  <StatusPill status={p.status} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {selected && (
        <div className="ll-admin-split-editor" style={{ flex: '0 0 56%', overflowY: 'auto', background: 'var(--paper-000)' }}>
          <ProposalDetail key={selected.id} proposal={selected} onUpdate={(patch) => update(selected.id, patch)}
            onDelete={() => remove(selected.id)} onClose={() => setSelectedId(null)} />
        </div>
      )}
    </div>
  );
}

function ProposalDetail({ proposal: p, onUpdate, onDelete, onClose }) {
  const [notes, setNotes] = React.useState(p.admin_notes || '');
  const [saving, setSaving] = React.useState(false);
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  const lines = Array.isArray(p.lines) ? p.lines : [];
  const subtotal = Number(p.subtotal);
  const discount = subtotal * Number(p.discount_pct || 0) / 100;
  const tax = (subtotal - discount) * Number(p.tax_pct || 0) / 100;
  const changedPrices = lines.filter((l) => Number(l.price) !== Number(l.list_price)).length;
  const geo = [p.city, p.region || p.country].filter(Boolean).join(', ');

  async function saveNotes() {
    setSaving(true);
    await onUpdate({ admin_notes: notes });
    setSaving(false);
  }

  // Hand the submission to the public builder so it can be adjusted and printed
  // as a proper proposal PDF.
  function openInBuilder() {
    const draft = {
      number: p.number,
      lines: lines.filter((l) => PRODUCTS_BY_SKU.has(l.sku)).map((l) => ({ sku: l.sku, qty: l.qty, price: l.price })),
      client: { organization: p.organization || '', contact: p.contact, email: p.email, phone: p.phone || '', project: p.project || '', location: p.location || '' },
      scope: p.scope || '',
      discountPct: Number(p.discount_pct) ? String(Number(p.discount_pct)) : '',
      shipping: Number(p.shipping) ? String(Number(p.shipping)) : '',
      taxPct: Number(p.tax_pct) ? String(Number(p.tax_pct)) : '',
    };
    try {
      const current = JSON.parse(localStorage.getItem(DRAFT_STORAGE_KEY) || 'null');
      if (current?.lines?.length && current.number !== p.number
        && !window.confirm(`This replaces the proposal currently open in the builder (${current.number}). Continue?`)) return;
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
    } catch { /* storage blocked — the builder opens with its own draft */ }
    window.open('/park-supply', '_blank', 'noopener');
  }

  const subject = encodeURIComponent(`Your proposal ${p.number}${p.project ? ` — ${p.project}` : ''}`);

  return (
    <div style={{ padding: '20px 28px 40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', color: 'var(--ink-400)' }}>{p.number}</div>
          <h2 style={{ margin: '4px 0 0', fontSize: 22, letterSpacing: '-0.02em', color: 'var(--ink-900)' }}>{p.organization || p.contact}</h2>
          <div style={{ fontSize: 12, color: 'var(--ink-400)', marginTop: 4 }}>
            Submitted {formatDate(p.created_at)}{geo ? ` · from ${geo}` : ''}
          </div>
        </div>
        <button onClick={onClose} aria-label="Close" style={{ ...ghostBtn, padding: '4px 10px', fontSize: 18, lineHeight: 1 }}>×</button>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 16, alignItems: 'center' }}>
        <label style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-400)' }}>
          Status{' '}
          <select value={p.status} onChange={(e) => onUpdate({ status: e.target.value })}
            style={{ marginLeft: 6, padding: '6px 8px', fontFamily: 'var(--font-body)', fontSize: 13, borderRadius: 'var(--radius-1)', border: '1px solid var(--border-hair)', background: 'var(--paper-000)', textTransform: 'capitalize' }}>
            {PROPOSAL_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
        <div style={{ flex: 1 }} />
        <a href={`mailto:${p.email}?subject=${subject}`} style={{ ...ghostBtn, textDecoration: 'none' }}>Reply by email</a>
        <button onClick={openInBuilder} style={primaryBtn}>Open in builder</button>
      </div>

      <div className="ll-proposal-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginTop: 22 }}>
        <InfoBlock label="Contact">
          <div style={{ fontWeight: 600 }}>{p.contact}</div>
          <a href={`mailto:${p.email}`} style={{ color: 'var(--ink-600)' }}>{p.email}</a>
          {p.phone && <div><a href={`tel:${p.phone}`} style={{ color: 'var(--ink-600)' }}>{p.phone}</a></div>}
        </InfoBlock>
        <InfoBlock label="Project">
          <div style={{ fontWeight: 600 }}>{p.project || '—'}</div>
          {p.location && <div>{p.location}</div>}
        </InfoBlock>
      </div>

      {p.scope && (
        <InfoBlock label="Scope" style={{ marginTop: 16 }}>
          <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{p.scope}</p>
        </InfoBlock>
      )}

      <div style={{ marginTop: 22 }}>
        <div style={labelStyle}>Line items</div>
        {changedPrices > 0 && (
          <div style={{ fontSize: 12, color: '#8A5A00', background: '#FFF4D6', padding: '6px 10px', borderRadius: 'var(--radius-1)', marginBottom: 8 }}>
            {changedPrices === 1 ? '1 line has a unit price' : `${changedPrices} lines have unit prices`} different from list — highlighted below.
          </div>
        )}
        <div className="ll-table-scroll">
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 460 }}>
            <thead>
              <tr>
                {['Item', 'Qty', 'Unit', 'Amount'].map((h, i) => (
                  <th key={h} style={{ ...thStyle, textAlign: i ? 'right' : 'left' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {lines.map((l) => {
                const changed = Number(l.price) !== Number(l.list_price);
                return (
                  <tr key={l.sku} style={{ borderBottom: '1px solid var(--border-hair)' }}>
                    <td style={tdStyle}>
                      <div style={{ fontWeight: 600 }}>{l.name}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-400)' }}>{l.sku} · {l.unit}</div>
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'right' }}>{l.qty}</td>
                    <td style={{ ...tdStyle, textAlign: 'right', whiteSpace: 'nowrap', background: changed ? '#FFF4D6' : undefined }}>
                      {usd(l.price)}
                      {changed && <div style={{ fontSize: 11, color: '#8A5A00' }}>list {usd(l.list_price)}</div>}
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 600 }}>{usd(l.qty * l.price)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <dl style={{ margin: '12px 0 0 auto', maxWidth: 280, display: 'grid', gap: 4, fontSize: 13 }}>
          <SumRow label="Subtotal" value={usd(subtotal)} />
          {discount > 0 && <SumRow label={`Discount (${Number(p.discount_pct)}%)`} value={`−${usd(discount)}`} />}
          {Number(p.shipping) > 0 && <SumRow label="Freight" value={usd(p.shipping)} />}
          {tax > 0 && <SumRow label={`Tax (${Number(p.tax_pct)}%)`} value={usd(tax)} />}
          <div style={{ borderTop: '1px solid var(--ink-900)', paddingTop: 6, marginTop: 4 }}>
            <SumRow label="Total" value={usd(p.total)} strong />
          </div>
        </dl>
      </div>

      <div style={{ marginTop: 24 }}>
        <label htmlFor="proposal-notes" style={labelStyle}>Internal notes</label>
        <textarea id="proposal-notes" rows={4} value={notes} onChange={(e) => setNotes(e.target.value)}
          placeholder="Only visible here — follow-ups, pricing decisions, who you spoke to…"
          style={{ width: '100%', boxSizing: 'border-box', padding: '9px 11px', fontFamily: 'var(--font-body)', fontSize: 13, borderRadius: 'var(--radius-2)', border: '1px solid var(--border-hair)', background: 'var(--paper-000)', resize: 'vertical' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, gap: 12 }}>
          <button onClick={saveNotes} disabled={saving || notes === (p.admin_notes || '')}
            style={{ ...primaryBtn, opacity: saving || notes === (p.admin_notes || '') ? 0.4 : 1 }}>
            {saving ? 'Saving…' : 'Save notes'}
          </button>
          {confirmDelete ? (
            <span style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 12 }}>
              Delete this proposal?
              <button onClick={onDelete} style={{ ...ghostBtn, background: '#DC2626', color: '#fff', borderColor: '#DC2626' }}>Yes</button>
              <button onClick={() => setConfirmDelete(false)} style={ghostBtn}>Cancel</button>
            </span>
          ) : (
            <button onClick={() => setConfirmDelete(true)} style={{ ...ghostBtn, color: '#DC2626', borderColor: '#FCA5A5' }}>Delete</button>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoBlock({ label, children, style }) {
  return (
    <div style={{ padding: 14, background: 'var(--paper-100)', borderRadius: 'var(--radius-2)', border: '1px solid var(--border-hair)', fontSize: 13, lineHeight: 1.55, color: 'var(--ink-900)', ...style }}>
      <div style={labelStyle}>{label}</div>
      {children}
    </div>
  );
}

function SumRow({ label, value, strong }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: strong ? 700 : 400, fontSize: strong ? 15 : 13 }}>
      <dt>{label}</dt><dd style={{ margin: 0 }}>{value}</dd>
    </div>
  );
}

const labelStyle = { display: 'block', fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-400)', marginBottom: 6 };
const emptyStyle = { padding: '32px 28px', color: 'var(--ink-400)', fontSize: 13 };
const thStyle = { padding: '8px 8px', fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-400)', fontWeight: 500, borderBottom: '1px solid var(--ink-900)' };
const tdStyle = { padding: '10px 8px', verticalAlign: 'top', color: 'var(--ink-900)' };
const ghostBtn = { padding: '7px 12px', background: 'none', border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-1)', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-body)', color: 'var(--ink-600)' };
const primaryBtn = { padding: '7px 14px', background: 'var(--ink-900)', border: '1px solid var(--ink-900)', borderRadius: 'var(--radius-1)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)', color: 'var(--paper-000)' };
