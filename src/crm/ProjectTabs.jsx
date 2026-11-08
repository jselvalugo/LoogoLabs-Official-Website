import React from 'react';
import { data } from './api';
import { CHARGE_KINDS, CHARGE_STATUSES, SOURCE_KINDS } from './entities';
import { ACCEPT, fileToText, guessKind } from './fileText';
import { detectPeriod, extractMetrics, formatMetric } from './metrics';
import { today } from './records';
import { day, when } from './report';

// The Billing and Data sources tabs of the project record page.

const money2 = (n) => (n === null || n === undefined || n === '' ? '—'
  : `${Number(n) < 0 ? '−' : ''}$${Math.abs(Number(n)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
const label = (list, id) => list.find((x) => x.id === id)?.label || id;
const monthName = (ymd) => (ymd ? new Date(`${ymd}T12:00:00`).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '');

// ── Billing ─────────────────────────────────────────────────────────────────

export function BillingTab({ project, onChanged }) {
  const b = project.billing_summary || {};
  const charges = project.charges || [];
  const [adding, setAdding] = React.useState(false);
  const [error, setError] = React.useState('');
  const [busy, setBusy] = React.useState(false);

  async function run(fn) {
    setBusy(true); setError('');
    try { await fn(); onChanged(); } catch (err) { setError(err.message); }
    setBusy(false);
  }
  const setStatus = (c, status) => run(() => data('update_charge', { id: c.id, values: { status } }));
  const remove = (c) => window.confirm(`Delete "${c.description || label(CHARGE_KINDS, c.kind)}"?`) && run(() => data('delete_charge', { id: c.id }));
  const nextMonthly = () => run(() => data('add_next_monthly', { project_id: project.id }));
  const billSetup = () => run(() => data('add_charge', { values: { project_id: project.id, kind: 'setup', description: 'Initiation fee', amount: b.setup_fee, due_date: today() } }));

  const setupText = b.setup_status === 'paid' ? `Paid ${day(b.setup_paid_at)}`
    : b.setup_status === 'due' ? 'Billed, not paid' : b.setup_status === 'not_billed' ? 'Not billed yet' : '';

  return (
    <>
      <div className="bill-stats">
        <div className="bstat">
          <div className="k">Initiation fee</div>
          <div className="n">{money2(b.setup_fee)}</div>
          <div className={`v ${b.setup_status === 'paid' ? 'ok' : b.setup_status ? 'warn' : ''}`}>{setupText || 'None set'}</div>
        </div>
        <div className="bstat">
          <div className="k">Monthly fee</div>
          <div className="n">{money2(b.monthly_fee)}</div>
          <div className="v">{b.next_monthly_period ? `Next to bill: ${monthName(b.next_monthly_period)}` : 'Set it under Details'}</div>
        </div>
        <div className="bstat">
          <div className="k">Paid to date</div>
          <div className="n">{money2(b.paid_total)}</div>
          <div className="v">{charges.filter((c) => c.status === 'paid').length} payments</div>
        </div>
        <div className="bstat">
          <div className="k">Outstanding</div>
          <div className={`n ${b.overdue > 0 ? 'overdue' : ''}`}>{money2(b.outstanding)}</div>
          <div className={`v ${b.overdue > 0 ? 'overdue' : ''}`}>
            {b.overdue > 0 ? `${money2(b.overdue)} overdue` : b.next_due ? `Next due ${day(b.next_due.due_date)}` : 'Nothing due'}
          </div>
        </div>
      </div>

      <div className="actions" style={{ marginTop: 16 }}>
        {b.monthly_fee ? <button className="btn btn-primary" disabled={busy} onClick={nextMonthly}>Bill {monthName(b.next_monthly_period)}</button> : null}
        {b.setup_status === 'not_billed' && <button className="btn" disabled={busy} onClick={billSetup}>Bill initiation fee</button>}
        <button className="btn" onClick={() => setAdding((x) => !x)}>{adding ? 'Close' : 'Add charge or payment'}</button>
      </div>
      {adding && <ChargeForm project={project} onDone={() => { setAdding(false); onChanged(); }} />}
      {error && <div className="error">{error}</div>}

      <h3 className="ov-h">Ledger</h3>
      {charges.length === 0 ? <div className="muted">No charges yet.</div> : (
        <div style={{ overflowX: 'auto' }}>
          <table className="static ledger">
            <thead><tr><th>Due</th><th>Description</th><th className="hide-sm">Type</th><th className="num">Amount</th><th>Status</th><th /></tr></thead>
            <tbody>
              {charges.map((c) => {
                const late = c.status === 'due' && c.due_date && c.due_date < today();
                return (
                  <tr key={c.id} className={c.status === 'void' ? 'void' : ''}>
                    <td className={late ? 'overdue' : ''}>{day(c.due_date) || '—'}</td>
                    <td>{c.description || label(CHARGE_KINDS, c.kind)}{c.method ? <span className="muted"> · {c.method}</span> : null}</td>
                    <td className="hide-sm">{label(CHARGE_KINDS, c.kind)}</td>
                    <td className="num">{money2(c.amount)}</td>
                    <td>
                      <span className={`pill ${c.status === 'paid' ? 'on_track' : late ? 'off_track' : c.status === 'due' ? 'at_risk' : ''}`}>
                        {c.status === 'paid' ? `Paid ${day(c.paid_at)}` : late ? 'Overdue' : label(CHARGE_STATUSES, c.status)}
                      </span>
                    </td>
                    <td className="row-actions">
                      {c.status === 'due' && <button className="btn btn-small" disabled={busy} onClick={() => setStatus(c, 'paid')}>Mark paid</button>}
                      {c.status === 'paid' && <button className="link" disabled={busy} onClick={() => setStatus(c, 'due')}>Undo</button>}
                      {c.status !== 'void' && <button className="link" disabled={busy} onClick={() => setStatus(c, 'void')}>Void</button>}
                      <button className="link danger" disabled={busy} onClick={() => remove(c)}>Delete</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

function ChargeForm({ project, onDone }) {
  const [f, setF] = React.useState({ kind: 'one_time', description: '', amount: '', due_date: today(), status: 'due', paid_at: '', method: '' });
  const [error, setError] = React.useState('');
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));
  async function submit(e) {
    e.preventDefault();
    setError('');
    try { await data('add_charge', { values: { ...f, project_id: project.id } }); onDone(); } catch (err) { setError(err.message); }
  }
  return (
    <form className="card report-form" onSubmit={submit} style={{ marginTop: 12 }}>
      <div className="grid2">
        <div><label className="label" htmlFor="c-kind">Type</label>
          <select id="c-kind" className="field" value={f.kind} onChange={set('kind')}>{CHARGE_KINDS.map((k) => <option key={k.id} value={k.id}>{k.label}</option>)}</select></div>
        <div><label className="label" htmlFor="c-amt">Amount *</label><input id="c-amt" className="field" inputMode="decimal" placeholder="0.00" value={f.amount} onChange={set('amount')} required /></div>
        <div className="span2"><label className="label" htmlFor="c-desc">Description</label><input id="c-desc" className="field" value={f.description} onChange={set('description')} /></div>
        <div><label className="label" htmlFor="c-due">Due date</label><input id="c-due" className="field" type="date" value={f.due_date} onChange={set('due_date')} /></div>
        <div><label className="label" htmlFor="c-status">Status</label>
          <select id="c-status" className="field" value={f.status} onChange={set('status')}>{CHARGE_STATUSES.filter((s) => s.id !== 'void').map((k) => <option key={k.id} value={k.id}>{k.label}</option>)}</select></div>
        {f.status === 'paid' && <>
          <div><label className="label" htmlFor="c-paid">Paid on</label><input id="c-paid" className="field" type="date" value={f.paid_at} onChange={set('paid_at')} /></div>
          <div><label className="label" htmlFor="c-method">Paid by</label><input id="c-method" className="field" placeholder="Stripe, Zelle, check…" value={f.method} onChange={set('method')} /></div>
        </>}
      </div>
      {error && <div className="error">{error}</div>}
      <div className="actions"><button className="btn btn-primary">Add to ledger</button></div>
    </form>
  );
}

// ── Data sources ────────────────────────────────────────────────────────────

const fmtSize = (n) => (n >= 1000000 ? `${(n / 1000000).toFixed(1)}M` : n >= 1000 ? `${Math.round(n / 1000)}k` : String(n));

export function SourcesTab({ project, onChanged }) {
  const sources = project.sources || [];
  const [draft, setDraft] = React.useState(null); // { title, kind, filename, content, period_start, period_end, notes }
  const [reading, setReading] = React.useState(false);
  const [drag, setDrag] = React.useState(false);
  const [error, setError] = React.useState('');
  const [open, setOpen] = React.useState(null);
  const [editing, setEditing] = React.useState(null);
  const inputRef = React.useRef(null);

  async function take(file) {
    if (!file) return;
    setError(''); setReading(true);
    try {
      const content = await fileToText(file);
      const { metrics, breakdown } = extractMetrics(content);
      const period = detectPeriod(content);
      setDraft({ title: file.name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' '), kind: guessKind(file.name), filename: file.name, content,
        period_start: period.period_start, period_end: period.period_end, notes: '', metrics, breakdown, useBreakdown: !!breakdown });
    } catch (err) { setError(err.message || 'Could not read that file.'); }
    setReading(false);
  }

  async function save(e) {
    e.preventDefault();
    setError('');
    const { useBreakdown, metrics = [], breakdown, ...rest } = draft;
    const values = { ...rest, project_id: project.id, metrics: metrics.filter((m) => m.include && String(m.label).trim()).map(({ include: _i, ...m }) => m), breakdown: useBreakdown ? breakdown : null };
    if (!values.period_start && !values.period_end) { setError('Set the period the report covers, so it lands in the right month.'); return; }
    try { await data('add_source', { values }); setDraft(null); onChanged(); } catch (err) { setError(err.message); }
  }

  async function remove(src) {
    if (!window.confirm(`Delete "${src.title}"?`)) return;
    await data('delete_source', { id: src.id });
    onChanged();
  }

  const set = (k) => (e) => setDraft((p) => ({ ...p, [k]: e.target.value }));

  return (
    <>
      <p className="muted" style={{ marginTop: 0, fontSize: 14 }}>
        Upload this month&rsquo;s Google Analytics and Meta exports (CSV or Excel work best). The key numbers are pulled out for you to
        confirm, and they feed the branded PDF report, with month-over-month change once last month is uploaded too.
      </p>

      {!draft && (
        <div className={`dropzone ${drag ? 'over' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); take(e.dataTransfer.files?.[0]); }}>
          <strong>{reading ? 'Reading file…' : 'Drop a report here'}</strong>
          <span className="muted">CSV, Excel (.xlsx), PDF or text · Google Analytics, Meta Business Suite, Ads Manager, Search Console…</span>
          <div className="actions" style={{ justifyContent: 'center', marginTop: 10 }}>
            <button type="button" className="btn btn-primary" disabled={reading} onClick={() => inputRef.current?.click()}>Choose file</button>
            <button type="button" className="btn" onClick={() => setDraft({ title: '', kind: 'other', filename: '', content: '', period_start: '', period_end: '', notes: '', metrics: [], breakdown: null, useBreakdown: false })}>Paste text instead</button>
          </div>
          <input ref={inputRef} type="file" accept={ACCEPT} hidden onChange={(e) => { take(e.target.files?.[0]); e.target.value = ''; }} />
        </div>
      )}

      {draft && (
        <form className="card report-form" onSubmit={save}>
          <div className="grid2">
            <div><label className="label" htmlFor="s-title">Title *</label><input id="s-title" className="field" value={draft.title} onChange={set('title')} required /></div>
            <div><label className="label" htmlFor="s-kind">Source</label>
              <select id="s-kind" className="field" value={draft.kind} onChange={set('kind')}>{SOURCE_KINDS.map((k) => <option key={k.id} value={k.id}>{k.label}</option>)}</select></div>
            <div><label className="label" htmlFor="s-from">Period from</label><input id="s-from" className="field" type="date" value={draft.period_start} onChange={set('period_start')} /></div>
            <div><label className="label" htmlFor="s-to">Period to</label><input id="s-to" className="field" type="date" value={draft.period_end} onChange={set('period_end')} /></div>
            <div className="span2"><label className="label" htmlFor="s-notes">Notes for the report</label>
              <input id="s-notes" className="field" placeholder="e.g. Campaign paused Oct 20–24" value={draft.notes} onChange={set('notes')} /></div>
            <div className="span2">
              <MetricsEditor metrics={draft.metrics || []} onChange={(metrics) => setDraft((p) => ({ ...p, metrics }))}
                found={!!draft.filename} />
              {draft.breakdown && (
                <label className="check" style={{ marginTop: 10 }}>
                  <input type="checkbox" checked={draft.useBreakdown} onChange={(e) => setDraft((p) => ({ ...p, useBreakdown: e.target.checked }))} />
                  Include the &ldquo;{draft.breakdown.title}&rdquo; table ({draft.breakdown.rows.length} rows) in the PDF
                </label>
              )}
            </div>
            <div className="span2">
              <label className="label" htmlFor="s-content">{draft.filename ? `Extracted text from ${draft.filename} (${fmtSize(draft.content.length)} characters)` : 'Report text *'}</label>
              <textarea id="s-content" className="field mono" rows={draft.filename ? 8 : 10} value={draft.content} onChange={set('content')} required />
            </div>
          </div>
          {error && <div className="error">{error}</div>}
          <div className="actions">
            <button className="btn btn-primary">Save source</button>
            <button type="button" className="btn" onClick={() => setDraft(null)}>Cancel</button>
          </div>
        </form>
      )}
      {!draft && error && <div className="error">{error}</div>}

      <h3 className="ov-h">Sources ({sources.length})</h3>
      {sources.length === 0 ? <div className="muted">No reports uploaded yet.</div> : sources.map((src) => (
        <div key={src.id} className="source-row">
          <div className="note-head">
            <span className={`pill src ${src.kind}`}>{label(SOURCE_KINDS, src.kind)}</span>
            <strong>{src.title}</strong>
            <button className="link" style={{ marginLeft: 'auto', fontSize: 13 }} onClick={() => setOpen(open === src.id ? null : src.id)}>{open === src.id ? 'Hide' : 'Preview'}</button>
            <button className="link danger" style={{ marginLeft: 8 }} onClick={() => remove(src)}>Delete</button>
          </div>
          <small className="muted">
            {src.period_start || src.period_end ? `${day(src.period_start) || '…'} – ${day(src.period_end) || '…'} · ` : ''}
            {fmtSize(src.content_chars)} characters{src.filename ? ` · ${src.filename}` : ''} · {src.author || 'Removed user'} · {when(src.created_at)}
          </small>
          {src.notes && <div className="pre" style={{ fontSize: 14, marginTop: 4 }}>{src.notes}</div>}
          {editing === src.id
            ? <SourceNumbers src={src} onDone={() => { setEditing(null); onChanged(); }} />
            : (
              <div className="metric-chips">
                {(src.metrics || []).length === 0
                  ? <span className="pill due">No key numbers yet, so it won&rsquo;t show in the PDF</span>
                  : src.metrics.map((m) => <span key={m.label} className="mchip"><b>{formatMetric(m.value, m.unit)}</b> {m.label}</span>)}
                <button className="link" style={{ fontSize: 13 }} onClick={() => setEditing(src.id)}>Edit numbers</button>
              </div>
            )}
          {open === src.id && <pre className="source-preview">{src.preview}{src.content_chars > 600 ? '\n…' : ''}</pre>}
        </div>
      ))}
    </>
  );
}

// Key numbers for the PDF: tick the ones to show, rename or correct values,
// add your own (e.g. from a PDF export, where nothing is pulled out).
export function MetricsEditor({ metrics, onChange, found }) {
  const set = (i, patch) => onChange(metrics.map((m, j) => (j === i ? { ...m, ...patch } : m)));
  const add = () => onChange([...metrics, { label: '', value: '', unit: '', include: true }]);
  const shown = metrics.filter((m) => m.include).length;
  return (
    <div className="metrics-editor">
      <div className="me-head">
        <strong>Key numbers for the PDF</strong>
        <span className="muted">{metrics.length ? `${shown} of ${metrics.length} selected` : found ? 'None found in this file. Add them below.' : 'Add the numbers to show.'}</span>
      </div>
      {metrics.map((m, i) => (
        <div key={i} className="me-row">
          <input type="checkbox" checked={!!m.include} onChange={(e) => set(i, { include: e.target.checked })} aria-label="Show in PDF" />
          <input className="field" value={m.label} placeholder="Metric" aria-label="Metric name" onChange={(e) => set(i, { label: e.target.value })} />
          <input className="field num" value={m.value} inputMode="decimal" aria-label="Value" onChange={(e) => set(i, { value: e.target.value })} />
          <select className="field" value={m.unit} aria-label="Unit" onChange={(e) => set(i, { unit: e.target.value })}>
            <option value="">#</option><option value="%">%</option><option value="$">$</option>
          </select>
          <button type="button" className="ie-btn" aria-label="Remove" onClick={() => onChange(metrics.filter((_, j) => j !== i))}>✕</button>
        </div>
      ))}
      <button type="button" className="link" style={{ fontSize: 13, marginTop: 6 }} onClick={add}>+ Add a number</button>
    </div>
  );
}

function SourceNumbers({ src, onDone }) {
  const [metrics, setMetrics] = React.useState(() => (src.metrics || []).map((m) => ({ ...m, include: true })));
  const [error, setError] = React.useState('');
  async function save() {
    setError('');
    try {
      await data('update_source', { id: src.id, values: { metrics: metrics.filter((m) => m.include && String(m.label).trim()).map(({ include: _i, ...m }) => m) } });
      onDone();
    } catch (err) { setError(err.message); }
  }
  return (
    <div className="card report-form" style={{ marginTop: 10 }}>
      <MetricsEditor metrics={metrics} onChange={setMetrics} />
      {error && <div className="error">{error}</div>}
      <div className="actions"><button className="btn btn-primary btn-small" onClick={save}>Save numbers</button><button className="btn btn-small" onClick={onDone}>Cancel</button></div>
    </div>
  );
}
