import React from 'react';
import { data } from './api';
import { useCrm } from './ctx';
import { ENTITIES, INVOICE_STATUSES, optionLabel } from './entities';
import { Activities, FieldInput, today } from './records';
import { Drawer, day, money2, when } from './report';

// Invoices: bill a prospect or client, add line items, preview the branded
// invoice from the workspace's coded template, and send it by email.
// /invoices lists them; /invoices/<id> and /invoices/new open a full page.

const E = ENTITIES.invoices;
const F = Object.fromEntries(E.fields.map((f) => [f.key, f]));
const statusOf = (r, overdue) => (overdue ? 'overdue' : r.status);
const isOverdue = (r) => r.status === 'sent' && r.due_date && r.due_date < today();

export function InvoiceStatus({ record, overdue }) {
  const s = statusOf(record, overdue ?? isOverdue(record));
  const cls = { draft: '', sent: 'pending', paid: 'on_track', void: 'lost', overdue: 'off_track' }[s];
  return <span className={`pill ${cls}`}>{s === 'overdue' ? 'Overdue' : optionLabel(F.status, s)}</span>;
}

// ── List ────────────────────────────────────────────────────────────────────

export function InvoicesPage() {
  const { open, version } = useCrm();
  const [rows, setRows] = React.useState(null);
  const [query, setQuery] = React.useState('');
  const [status, setStatus] = React.useState('');

  React.useEffect(() => {
    const filters = status && status !== 'overdue' ? { status } : status === 'overdue' ? { status: 'sent' } : {};
    const t = setTimeout(() => {
      data('list', { entity: 'invoices', query, filters, limit: 500, sort: 'issue_date:desc' })
        .then((r) => setRows(status === 'overdue' ? r.records.filter(isOverdue) : r.records)).catch(() => setRows([]));
    }, query ? 250 : 0);
    return () => clearTimeout(t);
  }, [query, status, version]);

  return (
    <>
      <div className="head">
        <h1>Invoices</h1>
        <input className="field" style={{ width: 240, maxWidth: '100%' }} placeholder="Search invoices" aria-label="Search invoices"
          value={query} onChange={(e) => setQuery(e.target.value)} />
        <button className="btn btn-primary" onClick={() => open('invoices')}>New invoice</button>
      </div>
      <div className="toolbar">
        <div className="seg" role="group" aria-label="Status">
          <button className={status === '' ? 'on' : ''} onClick={() => setStatus('')}>All</button>
          {[...INVOICE_STATUSES, { id: 'overdue', label: 'Overdue' }].map((s) => (
            <button key={s.id} className={status === s.id ? 'on' : ''} onClick={() => setStatus(s.id)}>{s.label}</button>
          ))}
        </div>
      </div>
      {!rows ? <p className="muted">Loading…</p>
        : rows.length === 0 && !query && !status ? (
          <div className="card pad empty">
            <strong>No invoices yet</strong>
            <p className="muted">Create an invoice for a prospect or client, add line items, preview it in your branded template, and send it by email.</p>
            <button className="btn btn-primary" onClick={() => open('invoices')}>Create the first invoice</button>
          </div>
        ) : rows.length === 0 ? <div className="card"><p className="muted" style={{ padding: 16 }}>No invoices match.</p></div> : (
          <>
          <ul className="inv-cards">
            {rows.map((r) => (
              <li key={r.id}>
                <button onClick={() => open('invoices', r.id)}>
                  <span className="inv-card-top"><strong>{r.name}</strong><InvoiceStatus record={r} /></span>
                  <span>{r.bill_to_name || r.bill_to_company || r.company_id_name || '—'}</span>
                  <span className={`muted ${isOverdue(r) ? 'overdue' : ''}`}>Issued {day(r.issue_date)} · {r.due_date ? `Due ${day(r.due_date)}` : 'Due on receipt'}</span>
                </button>
              </li>
            ))}
          </ul>
          <div className="card inv-table" style={{ overflowX: 'auto' }}>
            <table>
              <thead><tr><th>Invoice</th><th>Bill to</th><th className="hide-sm">Issued</th><th className="hide-sm">Due</th><th>Status</th></tr></thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} onClick={() => open('invoices', r.id)}>
                    <td><strong>{r.name}</strong></td>
                    <td>{r.bill_to_name || r.bill_to_company || r.company_id_name || <span className="muted">—</span>}{r.bill_to_company && r.bill_to_name ? <span className="muted"> · {r.bill_to_company}</span> : null}</td>
                    <td className="hide-sm">{day(r.issue_date)}</td>
                    <td className={`hide-sm ${isOverdue(r) ? 'overdue' : ''}`}>{r.due_date ? day(r.due_date) : <span className="muted">On receipt</span>}</td>
                    <td><InvoiceStatus record={r} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </>
        )}
    </>
  );
}

// ── Record page ─────────────────────────────────────────────────────────────

export function InvoiceRecord({ id, preset }) {
  return id ? <InvoicePage id={id} /> : <NewInvoice preset={preset} />;
}

function Crumbs({ go, name }) {
  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      <button className="link" onClick={() => go('invoices')}>Invoices</button>
      <span aria-hidden="true">/</span>
      <span>{name}</span>
    </nav>
  );
}

const SECTIONS = [
  { title: 'Bill to', keys: ['bill_to_name', 'bill_to_title', 'bill_to_company', 'bill_to_email', 'bill_to_phone', 'bill_to_address'] },
  { title: 'Invoice', keys: ['name', 'status', 'issue_date', 'due_date', 'template', 'owner_id'] },
  { title: 'Linked records', keys: ['company_id', 'contact_id', 'project_id'] },
  { title: 'Amounts & payment', keys: ['discount', 'tax_rate', 'payment_link', 'paid_at', 'payment_method'] },
  { title: 'Notes to the client', keys: ['notes'] },
  { title: 'Terms & scope', keys: ['terms'] },
];

function valueOf(record, key, open) {
  const f = F[key];
  const v = record[key];
  if (key === 'template') return record.template_info?.name || (v ? v : <span className="muted">—</span>);
  if (v === null || v === undefined || v === '') return key === 'due_date' ? <span className="muted">Due on receipt</span> : <span className="muted">—</span>;
  switch (f.type) {
    case 'ref': return <button className="link" onClick={() => open(f.to, v)}>{record[`${key}_name`] || 'Open'}</button>;
    case 'user': return record[`${key}_name`];
    case 'select': return key === 'status' ? <InvoiceStatus record={record} /> : optionLabel(f, v);
    case 'money': return money2(Number(v));
    case 'percent': return `${v}%`;
    case 'date': return day(v);
    case 'url': return <a href={v} target="_blank" rel="noreferrer">{v}</a>;
    default: return <span className="pre">{String(v)}</span>;
  }
}

function InvoicePage({ id }) {
  const { open, go, changed } = useCrm();
  const [record, setRecord] = React.useState(null);
  const [error, setError] = React.useState('');
  const [tab, setTab] = React.useState('items');
  const [panel, setPanel] = React.useState(null); // 'preview' | 'send' | 'billto'
  const [busy, setBusy] = React.useState(false);

  const load = React.useCallback(() => data('get', { entity: 'invoices', id }).then(setRecord).catch((err) => setError(err.message)), [id]);
  React.useEffect(() => { load(); }, [load]);
  React.useEffect(() => { if (record) document.title = `${record.name} | Invoice | Loogo CRM`; return () => { document.title = 'Loogo CRM'; }; }, [record?.name]);
  const refresh = () => { load(); changed(); };

  async function setStatus(status) {
    setBusy(true); setError('');
    try { await data('update', { entity: 'invoices', id, values: { status, ...(status !== 'paid' ? { paid_at: '' } : {}) } }); refresh(); } catch (err) { setError(err.message); }
    setBusy(false);
  }
  async function remove() {
    if (!window.confirm(`Delete invoice ${record.name}? Its line items are deleted too. This cannot be undone.`)) return;
    try { await data('delete', { entity: 'invoices', id }); changed(); go('invoices'); } catch (err) { setError(err.message); }
  }
  async function print() {
    setError('');
    const w = window.open('', '_blank');
    try {
      const p = await data('invoice_preview', { id, print: true });
      w.document.open(); w.document.write(p.html); w.document.close();
      w.onload = () => setTimeout(() => w.print(), 300);
    } catch (err) { w?.close(); setError(err.message); }
  }

  if (!record) {
    return (
      <div className="rec">
        <Crumbs go={go} name={error ? 'Not found' : 'Loading…'} />
        {error ? <div className="card pad"><div className="error" style={{ marginTop: 0 }}>{error}</div></div> : <p className="muted">Loading…</p>}
      </div>
    );
  }

  const t = record.totals || {};
  const items = record.items || [];
  return (
    <div className="rec">
      <Crumbs go={go} name={record.name} />

      <section className="card rec-head">
        <div className="rec-title">
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="kicker">Invoice · <InvoiceStatus record={record} overdue={t.overdue} /></div>
            <h1 className="inv-h1">{record.name}{record.bill_to_name ? <span className="muted inv-h1-sub"><span className="inv-dot"> · </span>{record.bill_to_name}</span> : null}</h1>
          </div>
          <div className="rec-actions inv-actions">
            {record.status !== 'void' && <button className="btn btn-primary inv-send" onClick={() => setPanel('send')}>{record.sent_at ? 'Resend' : 'Send invoice'}</button>}
            <button className="btn" onClick={() => setPanel('billto')}>Edit bill-to</button>
            <button className="btn" onClick={() => setPanel('preview')}>Preview</button>
            <button className="btn" onClick={print}>Print / PDF</button>
            <MoreMenu>
              {record.status === 'sent' && <button disabled={busy} onClick={() => setStatus('paid')}>Mark paid</button>}
              {record.status === 'paid' && <button disabled={busy} onClick={() => setStatus('sent')}>Mark unpaid</button>}
              {record.status === 'sent' && <button disabled={busy} onClick={() => setStatus('draft')}>Back to draft</button>}
              {record.status !== 'void' && record.status !== 'paid' && <button disabled={busy} onClick={() => window.confirm('Void this invoice? It stays on file with nothing due.') && setStatus('void')}>Void</button>}
              {record.status === 'void' && <button disabled={busy} onClick={() => setStatus('draft')}>Restore as draft</button>}
              <button className="danger-text" onClick={remove}>Delete invoice</button>
            </MoreMenu>
          </div>
        </div>
        <dl className="highlights inv-highlights">
          <div className="hide-sm"><dt>Bill to</dt><dd>{record.bill_to_name || record.bill_to_company || <span className="muted">—</span>}</dd></div>
          <div><dt>Total</dt><dd>{money2(t.total)}</dd></div>
          <div><dt>Amount due</dt><dd className={t.overdue ? 'overdue' : ''}>{money2(t.amount_due)}</dd></div>
          <div><dt>Issued</dt><dd>{day(record.issue_date) || '—'}</dd></div>
          <div><dt>Due</dt><dd className={t.overdue ? 'overdue' : ''}>{record.due_date ? day(record.due_date) : 'On receipt'}</dd></div>
          <div className="hide-sm"><dt>Sent</dt><dd>{record.sent_at ? when(record.sent_at) : <span className="muted">Not yet</span>}</dd></div>
        </dl>
      </section>

      {!record.template && <div className="notice warn-notice" style={{ marginBottom: 12 }}>No invoice template is set up for this workspace yet. Loogo Labs adds templates in code; ask us for one.</div>}
      {!record.bill_to_email && record.status !== 'void' && (
        <div className="notice warn-notice inv-banner">
          <span>No email on this invoice yet. Add one to send it.</span>
          <button className="btn btn-small btn-primary" onClick={() => setPanel('billto')}>Add email</button>
        </div>
      )}
      {error && <div className="error" style={{ marginBottom: 12 }}>{error}</div>}

      <div className="rec-grid">
        <div className="rec-main">
          <div className="card">
            <div className="rec-tabs" role="tablist">
              {[['items', `Line items (${items.length})`], ['details', 'Details'], ['activity', `Activity (${(record.activities || []).length})`]].map(([k, label]) => (
                <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{label}</button>
              ))}
            </div>
            <div className="rec-body">
              {tab === 'items' && <ItemsTab record={record} onChanged={refresh} />}
              {tab === 'details' && <DetailsView record={record} onSaved={refresh} />}
              {tab === 'activity' && <Activities key={record.updated_at} entityKey="invoices" id={record.id} initial={record.activities} />}
            </div>
          </div>
        </div>
        <aside className="rec-side">
          <div className="card side-card hide-sm">
            <div className="side-head inv-side-head">Bill to <button className="link" onClick={() => setPanel('billto')}>Edit</button></div>
            <dl className="kv">
              <dt>Name</dt><dd>{record.bill_to_name || '—'}</dd>
              {record.bill_to_title && <><dt>Title</dt><dd>{record.bill_to_title}</dd></>}
              <dt>Business</dt><dd>{record.bill_to_company || '—'}</dd>
              <dt>Email</dt><dd>{record.bill_to_email || <button className="link overdue" onClick={() => setPanel('billto')}>Add email</button>}</dd>
              <dt>Phone</dt><dd>{record.bill_to_phone || '—'}</dd>
            </dl>
          </div>
          <div className="card side-card">
            <div className="side-head">Related</div>
            {[['Company', 'company_id', 'companies'], ['Contact', 'contact_id', 'contacts'], ['Project', 'project_id', 'projects']].map(([label, key, ent]) => (
              <div key={key} className="rel-row">
                <div className="kicker">{label}</div>
                {record[key] ? <button className="link" onClick={() => open(ent, record[key])}>{record[`${key}_name`]}</button> : <span className="muted">None linked</span>}
              </div>
            ))}
          </div>
          <p className="muted meta" style={{ marginTop: 4 }}>
            Created {when(record.created_at)} · Updated {when(record.updated_at)}
            {record.sent_to ? <><br />Last sent to {record.sent_to}</> : null}
          </p>
        </aside>
      </div>

      {panel === 'preview' && <PreviewDrawer record={record} onClose={() => setPanel(null)} />}
      {panel === 'billto' && <BillToDrawer record={record} onClose={() => setPanel(null)} onSaved={() => { setPanel(null); refresh(); }} />}
      {panel === 'send' && <SendDrawer record={record} onClose={() => setPanel(null)} onSent={() => { setPanel(null); refresh(); }} />}
    </div>
  );
}

function MoreMenu({ children }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return undefined;
    const close = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, [open]);
  return (
    <div className="inv-more" ref={ref}>
      <button className="btn" aria-expanded={open} onClick={() => setOpen((o) => !o)}>More ▾</button>
      {open && <div className="inv-more-list" role="menu" onClick={() => setOpen(false)}>{children}</div>}
    </div>
  );
}

// ── Line items ──────────────────────────────────────────────────────────────

const blankItem = { description: '', details: '', quantity: '1', unit_price: '', unit_label: '', note: '' };

function ItemsTab({ record, onChanged }) {
  const items = record.items || [];
  const t = record.totals || {};
  const [editing, setEditing] = React.useState(null); // item id or 'new'
  const [error, setError] = React.useState('');
  const locked = record.status === 'paid' || record.status === 'void';

  async function remove(it) {
    if (!window.confirm(`Remove "${it.description}"?`)) return;
    try { await data('delete_invoice_item', { id: it.id }); onChanged(); } catch (err) { setError(err.message); }
  }
  async function move(it, dir) {
    const i = items.findIndex((x) => x.id === it.id);
    const other = items[i + dir];
    if (!other) return;
    try {
      await data('update_invoice_item', { id: it.id, values: { position: other.position } });
      await data('update_invoice_item', { id: other.id, values: { position: it.position === other.position ? it.position + dir : it.position } });
      onChanged();
    } catch (err) { setError(err.message); }
  }

  return (
    <>
      {error && <div className="error">{error}</div>}
      <ul className="inv-items">
        {items.map((it, i) => (editing === it.id
          ? <li key={it.id} className="inv-item editing"><ItemForm invoiceId={record.id} item={it} onDone={() => { setEditing(null); onChanged(); }} onCancel={() => setEditing(null)} /></li>
          : (
            <li key={it.id} className="inv-item">
              <div className="inv-item-top">
                <strong className="inv-item-name">{it.description}</strong>
                <span className="inv-item-amt">{money2(it.amount)}</span>
              </div>
              <div className="inv-item-meta">
                {it.quantity} × {money2(it.unit_price)}{it.unit_label ? ` / ${it.unit_label}` : ''}
                {it.note && <span className="inv-tag">{it.note}</span>}
              </div>
              {it.details && <ul className="inv-details">{it.details.split('\n').filter((d) => d.trim()).map((d, k) => <li key={k}>{d}</li>)}</ul>}
              {!locked && (
                <div className="inv-item-actions">
                  <button className="btn btn-small" onClick={() => setEditing(it.id)}>Edit</button>
                  <button className="btn btn-small" disabled={i === 0} onClick={() => move(it, -1)} aria-label="Move up">↑</button>
                  <button className="btn btn-small" disabled={i === items.length - 1} onClick={() => move(it, 1)} aria-label="Move down">↓</button>
                  <button className="btn btn-small danger-text" onClick={() => remove(it)}>Remove</button>
                </div>
              )}
            </li>
          )))}
        {items.length === 0 && editing !== 'new' && <li className="inv-item muted">No line items yet. Add the first one below.</li>}
      </ul>
      {editing === 'new'
        ? <ItemForm invoiceId={record.id} item={blankItem} onDone={() => { setEditing(null); onChanged(); }} onCancel={() => setEditing(null)} />
        : !locked && <button className="btn inv-add" onClick={() => setEditing('new')}>+ Add line item</button>}
      <dl className="inv-totals">
        <div><dt>Subtotal</dt><dd>{money2(t.subtotal)}</dd></div>
        {t.discount ? <div><dt>Discount</dt><dd>−{money2(t.discount)}</dd></div> : null}
        {t.tax ? <div><dt>Tax ({t.tax_rate}%)</dt><dd>{money2(t.tax)}</dd></div> : null}
        <div><dt>Total</dt><dd>{money2(t.total)}</dd></div>
        <div className="due"><dt>Amount due</dt><dd className={t.overdue ? 'overdue' : ''}>{money2(t.amount_due)}</dd></div>
      </dl>
      {locked && <p className="muted hint">This invoice is {record.status}; restore it to change line items.</p>}
    </>
  );
}

function ItemForm({ invoiceId, item, onDone, onCancel }) {
  const [f, setF] = React.useState({
    ...blankItem, ...Object.fromEntries(Object.entries(item).filter(([k]) => k in blankItem).map(([k, v]) => [k, v ?? ''])),
  });
  const [error, setError] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));
  const amount = (Number(f.quantity) || 0) * (Number(f.unit_price) || 0);

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setError('');
    try {
      if (item.id) await data('update_invoice_item', { id: item.id, values: f });
      else await data('add_invoice_item', { values: { ...f, invoice_id: invoiceId } });
      onDone();
    } catch (err) { setError(err.message); setBusy(false); }
  }
  return (
    <form className="card report-form" onSubmit={submit} style={{ marginTop: 12 }}>
      <label className="label" htmlFor="it-desc">Item</label>
      <input id="it-desc" className="field" value={f.description} onChange={set('description')} placeholder="e.g. Campaign creation with full tracking" required />
      <label className="label" htmlFor="it-details">Details <span className="muted">· one per line, shown as a list</span></label>
      <textarea id="it-details" className="field" rows={3} value={f.details} onChange={set('details')} />
      <div className="grid2">
        <div><label className="label" htmlFor="it-qty">Quantity</label><input id="it-qty" className="field" inputMode="decimal" value={f.quantity} onChange={set('quantity')} /></div>
        <div><label className="label" htmlFor="it-price">Unit price ($)</label><input id="it-price" className="field" inputMode="decimal" value={f.unit_price} onChange={set('unit_price')} placeholder="0.00" /></div>
        <div><label className="label" htmlFor="it-unit">Unit <span className="muted">· optional, e.g. hr</span></label><input id="it-unit" className="field" value={f.unit_label} onChange={set('unit_label')} /></div>
        <div><label className="label" htmlFor="it-note">Price note <span className="muted">· optional, e.g. Complimentary</span></label><input id="it-note" className="field" value={f.note} onChange={set('note')} /></div>
      </div>
      <p className="muted hint">Amount: {money2(amount)}</p>
      {error && <div className="error">{error}</div>}
      <div className="actions" style={{ marginTop: 8 }}>
        <button className="btn btn-primary" disabled={busy}>{item.id ? 'Save item' : 'Add item'}</button>
        <button type="button" className="btn" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

// ── Details (per-field editing, like project pages) ─────────────────────────

function DetailsView({ record, onSaved }) {
  const { open } = useCrm();
  const [editing, setEditing] = React.useState(null);
  return (
    <>
      {SECTIONS.map((sec) => (
        <div key={sec.title} className="det-sec">
          <div className="det-title">{sec.title}</div>
          <dl className={`det-grid ${sec.keys.length === 1 ? 'one' : ''}`}>
            {sec.keys.map((k) => (editing === k
              ? <InlineEdit key={k} record={record} field={F[k]} onCancel={() => setEditing(null)} onSaved={() => { setEditing(null); onSaved(); }} />
              : (
                <div key={k} className="det-item tap-edit" role="button" tabIndex={0} onClick={(e) => { if (!e.target.closest('a, .link')) setEditing(k); }} onKeyDown={(e) => { if (e.key === 'Enter') setEditing(k); }} title="Tap to edit">
                  <dt>{F[k].label}</dt>
                  <dd><span className="dv">{valueOf(record, k, open)}</span><span className="pencil" aria-hidden="true">✎</span></dd>
                </div>
              )))}
          </dl>
        </div>
      ))}
    </>
  );
}

function TemplateSelect({ record, value, onChange, id }) {
  const options = record.templates || [];
  return (
    <select id={id} className="field" value={value || ''} onChange={(e) => onChange(e.target.value)}>
      <option value="">—</option>
      {options.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
    </select>
  );
}

function InlineEdit({ record, field, onCancel, onSaved }) {
  const [value, setValue] = React.useState(record[field.key] ?? '');
  const [error, setError] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => { ref.current?.querySelector('input, select, textarea')?.focus(); }, []);
  async function save(e) {
    e?.preventDefault();
    setBusy(true); setError('');
    try { await data('update', { entity: 'invoices', id: record.id, values: { [field.key]: value } }); onSaved(); } catch (err) { setError(err.message); setBusy(false); }
  }
  function keys(e) {
    if (e.key === 'Escape') { e.preventDefault(); onCancel(); }
    if (e.key === 'Enter' && field.type !== 'textarea') { e.preventDefault(); save(); }
    if (e.key === 'Enter' && field.type === 'textarea' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); save(); }
  }
  return (
    <form className={`det-item editing ${field.type === 'textarea' ? 'wide' : ''}`} onSubmit={save} onKeyDown={keys} ref={ref}>
      <dt><label htmlFor={`ie-${field.key}`}>{field.label}</label></dt>
      <dd className="ie">
        <div style={{ flex: 1, minWidth: 0 }}>
          {field.key === 'template'
            ? <TemplateSelect id={`ie-${field.key}`} record={record} value={value} onChange={setValue} />
            : <FieldInput id={`ie-${field.key}`} field={field} value={value} onChange={setValue} />}
        </div>
        <button className="ie-btn ok" disabled={busy} aria-label="Save">✓</button>
        <button type="button" className="ie-btn" onClick={onCancel} aria-label="Cancel">✕</button>
      </dd>
      {field.key === 'name' && <div className="hint">Invoice numbers must be unique in this workspace.</div>}
      {error && <div className="error" style={{ marginTop: 6 }}>{error}</div>}
    </form>
  );
}

// ── Preview and send ────────────────────────────────────────────────────────

function PreviewDrawer({ record, onClose }) {
  const [p, setP] = React.useState(null);
  const [error, setError] = React.useState('');
  React.useEffect(() => { data('invoice_preview', { id: record.id }).then(setP).catch((err) => setError(err.message)); }, [record.id, record.updated_at]);
  return (
    <Drawer title="Invoice email preview" kicker={record.name} onClose={onClose}>
      {error && <div className="error">{error}</div>}
      {!p && !error && <p className="muted">Loading…</p>}
      {p && (
        <>
          <dl className="kv" style={{ marginBottom: 12 }}>
            <dt>Subject</dt><dd>{p.subject}</dd>
            <dt>To</dt><dd>{p.to || <span className="overdue">No bill-to email yet</span>}</dd>
          </dl>
          <iframe title="Invoice preview" className="inv-frame" srcDoc={p.html} sandbox="allow-popups" />
        </>
      )}
    </Drawer>
  );
}

function SendDrawer({ record, onClose, onSent }) {
  const [to, setTo] = React.useState(record.bill_to_email || '');
  const [cc, setCc] = React.useState('');
  const [save, setSave] = React.useState(true);
  const [error, setError] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const t = record.totals || {};
  async function send(e) {
    e.preventDefault();
    setBusy(true); setError('');
    try { await data('send_invoice', { id: record.id, values: { to, cc, save_email: save } }); onSent(); } catch (err) { setError(err.message); setBusy(false); }
  }
  return (
    <Drawer title={record.sent_at ? 'Resend invoice' : 'Send invoice'} kicker={record.name} onClose={onClose}>
      <form onSubmit={send}>
        <p className="muted" style={{ marginTop: 0 }}>
          Sends {record.template_info?.name || 'the invoice'} for <strong>{money2(t.amount_due)}</strong> from your workspace&rsquo;s coded template.
          {record.status === 'draft' ? ' The invoice is marked Sent.' : ''} It is logged on this invoice{record.contact_id ? ' and the contact' : ''}.
        </p>
        <label className="label" htmlFor="si-to">To</label>
        <input id="si-to" className="field" value={to} onChange={(e) => setTo(e.target.value)} placeholder="client@example.com" required />
        {!record.bill_to_email && (
          <label className="check" style={{ marginTop: 10 }}>
            <input type="checkbox" checked={save} onChange={(e) => setSave(e.target.checked)} /> Save this as the bill-to email{record.contact_id ? ' (and on the contact)' : ''}
          </label>
        )}
        <label className="label" htmlFor="si-cc">Cc <span className="muted">· optional, comma separated</span></label>
        <input id="si-cc" className="field" value={cc} onChange={(e) => setCc(e.target.value)} />
        {!(record.items || []).length && <div className="notice warn-notice" style={{ marginTop: 12 }}>Add at least one line item first.</div>}
        {error && <div className="error">{error}</div>}
        <div className="actions">
          <button className="btn btn-primary" disabled={busy || !(record.items || []).length || !record.template}>{busy ? 'Sending…' : 'Send now'}</button>
          <button type="button" className="btn" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </Drawer>
  );
}

// ── Edit bill-to and dates in one form (works on phones) ───────────────────

const BILL_KEYS = ['bill_to_name', 'bill_to_email', 'bill_to_title', 'bill_to_company', 'bill_to_phone', 'bill_to_address', 'issue_date', 'due_date', 'payment_link'];

function BillToDrawer({ record, onClose, onSaved }) {
  const [v, setV] = React.useState(Object.fromEntries(BILL_KEYS.map((k) => [k, record[k] ?? ''])));
  const [error, setError] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const set = (k) => (val) => setV((p) => ({ ...p, [k]: val }));
  async function save(e) {
    e.preventDefault();
    setBusy(true); setError('');
    const changed = Object.fromEntries(BILL_KEYS.filter((k) => String(v[k] ?? '') !== String(record[k] ?? '')).map((k) => [k, v[k]]));
    try { if (Object.keys(changed).length) await data('update', { entity: 'invoices', id: record.id, values: changed }); onSaved(); } catch (err) { setError(err.message); setBusy(false); }
  }
  return (
    <Drawer title="Edit bill-to & dates" kicker={record.name} onClose={onClose}>
      <form onSubmit={save}>
        {BILL_KEYS.map((k) => (
          <div key={k}>
            <label className="label" htmlFor={`bt-${k}`}>{F[k].label}{k === 'due_date' ? <span className="muted"> · blank = on receipt</span> : null}</label>
            <FieldInput id={`bt-${k}`} field={F[k]} value={v[k]} onChange={set(k)} />
          </div>
        ))}
        {error && <div className="error">{error}</div>}
        <div className="actions">
          <button className="btn btn-primary" disabled={busy}>{busy ? 'Saving…' : 'Save'}</button>
          <button type="button" className="btn" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </Drawer>
  );
}

// ── New invoice ─────────────────────────────────────────────────────────────

function NewInvoice({ preset }) {
  const { go, open, changed } = useCrm();
  const [v, setV] = React.useState({ issue_date: today(), ...(preset || {}) });
  const [number, setNumber] = React.useState('');
  const [error, setError] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  React.useEffect(() => { data('next_invoice_number').then((r) => setNumber(r.number)).catch(() => {}); }, []);
  const set = (k) => (val) => setV((p) => ({ ...p, [k]: val }));
  const keys = ['contact_id', 'company_id', 'project_id', 'bill_to_name', 'bill_to_title', 'bill_to_company', 'bill_to_email', 'bill_to_phone', 'issue_date', 'due_date'];

  async function create(e) {
    e.preventDefault();
    setBusy(true); setError('');
    try {
      const rec = await data('create', { entity: 'invoices', values: { ...v, name: v.name || number } });
      changed();
      open('invoices', rec.id);
    } catch (err) { setError(err.message); setBusy(false); }
  }
  return (
    <div className="rec">
      <Crumbs go={go} name="New invoice" />
      <form className="card pad" onSubmit={create} style={{ maxWidth: 760 }}>
        <h1 style={{ marginTop: 0 }}>New invoice</h1>
        <p className="muted">Pick a contact to fill in the bill-to details, or type them for a prospect who isn&rsquo;t in the CRM yet. You add line items on the next page.</p>
        <label className="label" htmlFor="ni-name">Invoice number</label>
        <input id="ni-name" className="field" value={v.name ?? number} onChange={(e) => set('name')(e.target.value)} />
        <div className="grid2">
          {keys.map((k) => (
            <div key={k}>
              <label className="label" htmlFor={`ni-${k}`}>{F[k].label}{k === 'due_date' ? <span className="muted"> · blank = on receipt</span> : null}</label>
              <FieldInput id={`ni-${k}`} field={F[k]} value={v[k]} onChange={set(k)} />
            </div>
          ))}
        </div>
        {error && <div className="error">{error}</div>}
        <div className="actions">
          <button className="btn btn-primary" disabled={busy}>Create invoice</button>
          <button type="button" className="btn" onClick={() => go('invoices')}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
