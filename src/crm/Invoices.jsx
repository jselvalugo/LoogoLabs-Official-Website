import React from 'react';
import { data } from './api';
import { useCrm } from './ctx';
import { ENTITIES, INVOICE_STATUSES, QUOTE_STATUSES, optionLabel } from './entities';
import { Activities, FieldInput, today } from './records';
import { Drawer, day, money2, when } from './report';

// Quotes and invoices share one set of screens. A quote is prepared for a
// prospect and, once accepted, turns into an invoice with one tap. Both get
// line items, a branded email from the workspace's coded template, preview,
// print / PDF and send. /quotes and /invoices list them; /<kind>/<id> and
// /<kind>/new open a full page.

const fieldsOf = (entity) => Object.fromEntries(ENTITIES[entity].fields.map((f) => [f.key, f]));
const past = (r) => !!r.due_date && String(r.due_date).slice(0, 10) < today();

export const KINDS = {
  invoices: {
    entity: 'invoices', Doc: 'Invoice', doc: 'invoice', Docs: 'Invoices', statuses: INVOICE_STATUSES, F: fieldsOf('invoices'),
    party: 'Bill to', dueLabel: 'Due', dueBlank: 'On receipt', dueHint: 'blank = on receipt',
    flagged: (r) => r.status === 'sent' && past(r), flag: { id: 'overdue', label: 'Overdue', cls: 'off_track' },
    pill: { draft: '', sent: 'pending', paid: 'on_track', void: 'lost' },
    locked: (r) => ['paid', 'void'].includes(r.status),
    empty: 'Create an invoice for a client, add line items, preview it in your branded template, and send it by email.',
    sections: [
      { title: 'Bill to', keys: ['bill_to_name', 'bill_to_title', 'bill_to_company', 'bill_to_email', 'bill_to_phone', 'bill_to_address'] },
      { title: 'Invoice', keys: ['name', 'status', 'issue_date', 'due_date', 'template', 'owner_id'] },
      { title: 'Linked records', keys: ['company_id', 'contact_id', 'project_id', 'quote_id'] },
      { title: 'Amounts & payment', keys: ['discount', 'tax_rate', 'payment_link', 'paid_at', 'payment_method'] },
      { title: 'Notes to the client', keys: ['notes'] },
      { title: 'Terms & scope', keys: ['terms'] },
    ],
    billKeys: ['bill_to_name', 'bill_to_email', 'bill_to_title', 'bill_to_company', 'bill_to_phone', 'bill_to_address', 'issue_date', 'due_date', 'payment_link'],
    newKeys: ['contact_id', 'company_id', 'project_id', 'bill_to_name', 'bill_to_title', 'bill_to_company', 'bill_to_email', 'bill_to_phone', 'issue_date', 'due_date'],
    related: [['Company', 'company_id', 'companies'], ['Contact', 'contact_id', 'contacts'], ['Project', 'project_id', 'projects'], ['From quote', 'quote_id', 'quotes']],
  },
  quotes: {
    entity: 'quotes', Doc: 'Quote', doc: 'quote', Docs: 'Quotes', statuses: QUOTE_STATUSES, F: fieldsOf('quotes'),
    party: 'Prepared for', dueLabel: 'Valid until', dueBlank: 'No end date', dueHint: 'optional',
    flagged: (r) => ['draft', 'sent'].includes(r.status) && past(r), flag: { id: 'expired', label: 'Expired', cls: 'off_track' },
    pill: { draft: '', sent: 'pending', accepted: 'on_track', declined: 'lost', void: 'lost' },
    locked: (r) => ['accepted', 'declined', 'void'].includes(r.status),
    empty: 'Create a quote for a prospect, add line items, preview it in your branded template, and send it by email. When they accept, turn it into an invoice with one tap.',
    sections: [
      { title: 'Prepared for', keys: ['bill_to_name', 'bill_to_title', 'bill_to_company', 'bill_to_email', 'bill_to_phone', 'bill_to_address'] },
      { title: 'Quote', keys: ['name', 'status', 'issue_date', 'due_date', 'template', 'owner_id'] },
      { title: 'Linked records', keys: ['company_id', 'contact_id', 'opportunity_id', 'project_id', 'invoice_id'] },
      { title: 'Amounts', keys: ['discount', 'tax_rate', 'accepted_at'] },
      { title: 'Notes to the client', keys: ['notes'] },
      { title: 'Terms & scope', keys: ['terms'] },
    ],
    billKeys: ['bill_to_name', 'bill_to_email', 'bill_to_title', 'bill_to_company', 'bill_to_phone', 'bill_to_address', 'issue_date', 'due_date'],
    newKeys: ['contact_id', 'company_id', 'opportunity_id', 'bill_to_name', 'bill_to_title', 'bill_to_company', 'bill_to_email', 'bill_to_phone', 'issue_date', 'due_date'],
    related: [['Company', 'company_id', 'companies'], ['Contact', 'contact_id', 'contacts'], ['Opportunity', 'opportunity_id', 'opportunities'], ['Invoice', 'invoice_id', 'invoices']],
  },
};

export function DocStatus({ K, record }) {
  const flagged = K.flagged(record);
  const s = flagged ? K.flag.id : record.status;
  return <span className={`pill ${flagged ? K.flag.cls : K.pill[s] ?? ''}`}>{flagged ? K.flag.label : optionLabel(K.F.status, s)}</span>;
}

// ── List ────────────────────────────────────────────────────────────────────

export const InvoicesPage = () => <DocsPage K={KINDS.invoices} />;
export const QuotesPage = () => <DocsPage K={KINDS.quotes} />;

function DocsPage({ K }) {
  const { open, version } = useCrm();
  const [rows, setRows] = React.useState(null);
  const [query, setQuery] = React.useState('');
  const [status, setStatus] = React.useState('');

  React.useEffect(() => {
    const filters = status === K.flag.id ? {} : status ? { status } : {};
    const t = setTimeout(() => {
      data('list', { entity: K.entity, query, filters, limit: 500, sort: 'issue_date:desc' })
        .then((r) => setRows(status === K.flag.id ? r.records.filter(K.flagged) : r.records)).catch(() => setRows([]));
    }, query ? 250 : 0);
    return () => clearTimeout(t);
  }, [query, status, version, K]);

  const due = (r) => (r.due_date ? `${K.dueLabel} ${day(r.due_date)}` : K.dueBlank);
  return (
    <>
      <div className="head">
        <h1>{K.Docs}</h1>
        <input className="field" style={{ width: 240, maxWidth: '100%' }} placeholder={`Search ${K.doc}s`} aria-label={`Search ${K.doc}s`}
          value={query} onChange={(e) => setQuery(e.target.value)} />
        <button className="btn btn-primary" onClick={() => open(K.entity)}>New {K.doc}</button>
      </div>
      <div className="toolbar">
        <div className="seg" role="group" aria-label="Status">
          <button className={status === '' ? 'on' : ''} onClick={() => setStatus('')}>All</button>
          {[...K.statuses, K.flag].map((s) => (
            <button key={s.id} className={status === s.id ? 'on' : ''} onClick={() => setStatus(s.id)}>{s.label}</button>
          ))}
        </div>
      </div>
      {!rows ? <p className="muted">Loading…</p>
        : rows.length === 0 && !query && !status ? (
          <div className="card pad empty">
            <strong>No {K.doc}s yet</strong>
            <p className="muted">{K.empty}</p>
            <button className="btn btn-primary" onClick={() => open(K.entity)}>Create the first {K.doc}</button>
          </div>
        ) : rows.length === 0 ? <div className="card"><p className="muted" style={{ padding: 16 }}>No {K.doc}s match.</p></div> : (
          <>
            <ul className="inv-cards">
              {rows.map((r) => (
                <li key={r.id}>
                  <button onClick={() => open(K.entity, r.id)}>
                    <span className="inv-card-top"><strong>{r.name}</strong><DocStatus K={K} record={r} /></span>
                    <span>{r.bill_to_name || r.bill_to_company || r.company_id_name || '—'}</span>
                    <span className={`muted ${K.flagged(r) ? 'overdue' : ''}`}>{day(r.issue_date)} · {due(r)}</span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="card inv-table" style={{ overflowX: 'auto' }}>
              <table>
                <thead><tr><th>{K.Doc}</th><th>{K.party}</th><th className="hide-sm">Date</th><th className="hide-sm">{K.dueLabel}</th><th>Status</th></tr></thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id} onClick={() => open(K.entity, r.id)}>
                      <td><strong>{r.name}</strong></td>
                      <td>{r.bill_to_name || r.bill_to_company || r.company_id_name || <span className="muted">—</span>}{r.bill_to_company && r.bill_to_name ? <span className="muted"> · {r.bill_to_company}</span> : null}</td>
                      <td className="hide-sm">{day(r.issue_date)}</td>
                      <td className={`hide-sm ${K.flagged(r) ? 'overdue' : ''}`}>{r.due_date ? day(r.due_date) : <span className="muted">{K.dueBlank}</span>}</td>
                      <td><DocStatus K={K} record={r} /></td>
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

export const InvoiceRecord = ({ id, preset }) => <DocRecord K={KINDS.invoices} id={id} preset={preset} />;
export const QuoteRecord = ({ id, preset }) => <DocRecord K={KINDS.quotes} id={id} preset={preset} />;

function DocRecord({ K, id, preset }) {
  return id ? <DocPage K={K} id={id} /> : <NewDoc K={K} preset={preset} />;
}

function Crumbs({ K, go, name }) {
  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      <button className="link" onClick={() => go(K.entity)}>{K.Docs}</button>
      <span aria-hidden="true">/</span>
      <span>{name}</span>
    </nav>
  );
}

function valueOf(K, record, key, open) {
  const f = K.F[key];
  const v = record[key];
  if (key === 'template') return record.template_info?.name || (v ? v : <span className="muted">—</span>);
  if (v === null || v === undefined || v === '') return key === 'due_date' ? <span className="muted">{K.dueBlank}</span> : <span className="muted">—</span>;
  switch (f.type) {
    case 'ref': return <button className="link" onClick={() => open(f.to, v)}>{record[`${key}_name`] || 'Open'}</button>;
    case 'user': return record[`${key}_name`];
    case 'select': return key === 'status' ? <DocStatus K={K} record={record} /> : optionLabel(f, v);
    case 'money': return money2(Number(v));
    case 'percent': return `${v}%`;
    case 'date': return day(v);
    case 'url': return <a href={v} target="_blank" rel="noreferrer">{v}</a>;
    default: return <span className="pre">{String(v)}</span>;
  }
}

function DocPage({ K, id }) {
  const { open, go, changed } = useCrm();
  const [record, setRecord] = React.useState(null);
  const [error, setError] = React.useState('');
  const [tab, setTab] = React.useState('items');
  const [panel, setPanel] = React.useState(null); // 'preview' | 'send' | 'billto'
  const [busy, setBusy] = React.useState(false);
  const isQuote = K.entity === 'quotes';

  const load = React.useCallback(() => data('get', { entity: K.entity, id }).then(setRecord).catch((err) => setError(err.message)), [K, id]);
  React.useEffect(() => { load(); }, [load]);
  React.useEffect(() => { if (record) document.title = `${record.name} | ${K.Doc} | Loogo CRM`; return () => { document.title = 'Loogo CRM'; }; }, [record?.name, K]);
  const refresh = () => { load(); changed(); };

  async function setStatus(status) {
    setBusy(true); setError('');
    const extra = isQuote ? (status !== 'accepted' ? { accepted_at: '' } : {}) : (status !== 'paid' ? { paid_at: '' } : {});
    try { await data('update', { entity: K.entity, id, values: { status, ...extra } }); refresh(); } catch (err) { setError(err.message); }
    setBusy(false);
  }
  async function remove() {
    if (!window.confirm(`Delete ${K.doc} ${record.name}? Its line items are deleted too. This cannot be undone.`)) return;
    try { await data('delete', { entity: K.entity, id }); changed(); go(K.entity); } catch (err) { setError(err.message); }
  }
  async function downloadPdf() {
    setBusy(true); setError('');
    try {
      const p = await data('invoice_pdf', { entity: K.entity, id });
      const bytes = Uint8Array.from(atob(p.base64), (c) => c.charCodeAt(0));
      const url = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
      const a = document.createElement('a');
      a.href = url; a.download = p.filename; document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch (err) { setError(err.message); }
    setBusy(false);
  }
  async function convert() {
    if (!window.confirm(`Mark ${record.name} accepted and create an invoice from it? The invoice starts as a draft you can review before sending.`)) return;
    setBusy(true); setError('');
    try { const inv = await data('convert_quote', { id }); changed(); open('invoices', inv.id); } catch (err) { setError(err.message); setBusy(false); }
  }

  if (!record) {
    return (
      <div className="rec">
        <Crumbs K={K} go={go} name={error ? 'Not found' : 'Loading…'} />
        {error ? <div className="card pad"><div className="error" style={{ marginTop: 0 }}>{error}</div></div> : <p className="muted">Loading…</p>}
      </div>
    );
  }

  const t = record.totals || {};
  const items = record.items || [];
  const canConvert = isQuote && !record.invoice_id && !['declined', 'void'].includes(record.status) && items.length > 0;
  const flagged = K.flagged(record);
  return (
    <div className="rec">
      <Crumbs K={K} go={go} name={record.name} />

      <section className="card rec-head">
        <div className="rec-title">
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="kicker">{K.Doc} · <DocStatus K={K} record={record} /></div>
            <h1 className="inv-h1">{record.name}{record.bill_to_name ? <span className="muted inv-h1-sub"><span className="inv-dot"> · </span>{record.bill_to_name}</span> : null}</h1>
          </div>
          <div className="rec-actions inv-actions">
            {record.status !== 'void' && <button className="btn btn-primary inv-send" onClick={() => setPanel('send')}>{record.sent_at ? 'Resend' : `Send ${K.doc}`}</button>}
            {canConvert && <button className="btn inv-convert" disabled={busy} onClick={convert}>Accepted → create invoice</button>}
            {isQuote && record.invoice_id && <button className="btn inv-convert" onClick={() => open('invoices', record.invoice_id)}>Open invoice {record.invoice_id_name}</button>}
            <button className="btn" onClick={() => setPanel('billto')}>Edit details</button>
            <button className="btn" onClick={() => setPanel('preview')}>Preview</button>
            <button className="btn" disabled={busy} onClick={downloadPdf}>Download PDF</button>
            <MoreMenu>
              {!isQuote && record.status === 'sent' && <button disabled={busy} onClick={() => setStatus('paid')}>Mark paid</button>}
              {!isQuote && record.status === 'paid' && <button disabled={busy} onClick={() => setStatus('sent')}>Mark unpaid</button>}
              {isQuote && ['draft', 'sent'].includes(record.status) && <button disabled={busy} onClick={() => setStatus('accepted')}>Mark accepted (no invoice)</button>}
              {isQuote && ['draft', 'sent'].includes(record.status) && <button disabled={busy} onClick={() => setStatus('declined')}>Mark declined</button>}
              {isQuote && ['accepted', 'declined'].includes(record.status) && !record.invoice_id && <button disabled={busy} onClick={() => setStatus('sent')}>Reopen</button>}
              {record.status === 'sent' && <button disabled={busy} onClick={() => setStatus('draft')}>Back to draft</button>}
              {!['void', 'paid', 'accepted'].includes(record.status) && <button disabled={busy} onClick={() => window.confirm(`Void this ${K.doc}? It stays on file.`) && setStatus('void')}>Void</button>}
              {record.status === 'void' && <button disabled={busy} onClick={() => setStatus('draft')}>Restore as draft</button>}
              <button className="danger-text" onClick={remove}>Delete {K.doc}</button>
            </MoreMenu>
          </div>
        </div>
        <dl className="highlights inv-highlights">
          <div className="hide-sm"><dt>{K.party}</dt><dd>{record.bill_to_name || record.bill_to_company || <span className="muted">—</span>}</dd></div>
          <div><dt>Total</dt><dd>{money2(t.total)}</dd></div>
          {isQuote
            ? <div><dt>Status</dt><dd><DocStatus K={K} record={record} /></dd></div>
            : <div><dt>Amount due</dt><dd className={flagged ? 'overdue' : ''}>{money2(t.amount_due)}</dd></div>}
          <div><dt>{isQuote ? 'Date' : 'Issued'}</dt><dd>{day(record.issue_date) || '—'}</dd></div>
          <div><dt>{K.dueLabel}</dt><dd className={flagged ? 'overdue' : ''}>{record.due_date ? day(record.due_date) : K.dueBlank}</dd></div>
          <div className="hide-sm"><dt>Sent</dt><dd>{record.sent_at ? when(record.sent_at) : <span className="muted">Not yet</span>}</dd></div>
        </dl>
      </section>

      {!record.template && <div className="notice warn-notice" style={{ marginBottom: 12 }}>No template is set up for this workspace yet. Loogo Labs adds templates in code; ask us for one.</div>}
      {!record.bill_to_email && record.status !== 'void' && (
        <div className="notice warn-notice inv-banner">
          <span>No email on this {K.doc} yet. Add one to send it.</span>
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
              {tab === 'items' && <ItemsTab K={K} record={record} onChanged={refresh} />}
              {tab === 'details' && <DetailsView K={K} record={record} onSaved={refresh} />}
              {tab === 'activity' && <Activities key={record.updated_at} entityKey={K.entity} id={record.id} initial={record.activities} />}
            </div>
          </div>
        </div>
        <aside className="rec-side">
          <div className="card side-card hide-sm">
            <div className="side-head inv-side-head">{K.party} <button className="link" onClick={() => setPanel('billto')}>Edit</button></div>
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
            {K.related.map(([label, key, ent]) => (
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

      {panel === 'preview' && <PreviewDrawer K={K} record={record} onClose={() => setPanel(null)} />}
      {panel === 'billto' && <DetailsDrawer K={K} record={record} onClose={() => setPanel(null)} onSaved={() => { setPanel(null); refresh(); }} />}
      {panel === 'send' && <SendDrawer K={K} record={record} onClose={() => setPanel(null)} onSent={() => { setPanel(null); refresh(); }} />}
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

function ItemsTab({ K, record, onChanged }) {
  const items = record.items || [];
  const t = record.totals || {};
  const [editing, setEditing] = React.useState(null); // item id or 'new'
  const [error, setError] = React.useState('');
  const locked = K.locked(record);
  const isQuote = K.entity === 'quotes';

  async function remove(it) {
    if (!window.confirm(`Remove "${it.description}"?`)) return;
    try { await data('delete_invoice_item', { entity: K.entity, id: it.id }); onChanged(); } catch (err) { setError(err.message); }
  }
  async function move(it, dir) {
    const i = items.findIndex((x) => x.id === it.id);
    const other = items[i + dir];
    if (!other) return;
    try {
      await data('update_invoice_item', { entity: K.entity, id: it.id, values: { position: other.position } });
      await data('update_invoice_item', { entity: K.entity, id: other.id, values: { position: it.position === other.position ? it.position + dir : it.position } });
      onChanged();
    } catch (err) { setError(err.message); }
  }

  return (
    <>
      {error && <div className="error">{error}</div>}
      <ul className="inv-items">
        {items.map((it, i) => (editing === it.id
          ? <li key={it.id} className="inv-item editing"><ItemForm K={K} parentId={record.id} item={it} onDone={() => { setEditing(null); onChanged(); }} onCancel={() => setEditing(null)} /></li>
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
        ? <ItemForm K={K} parentId={record.id} item={blankItem} onDone={() => { setEditing(null); onChanged(); }} onCancel={() => setEditing(null)} />
        : !locked && <button className="btn inv-add" onClick={() => setEditing('new')}>+ Add line item</button>}
      <dl className="inv-totals">
        <div><dt>Subtotal</dt><dd>{money2(t.subtotal)}</dd></div>
        {t.discount ? <div><dt>Discount</dt><dd>−{money2(t.discount)}</dd></div> : null}
        {t.tax ? <div><dt>Tax ({t.tax_rate}%)</dt><dd>{money2(t.tax)}</dd></div> : null}
        {isQuote
          ? <div className="due"><dt>Total</dt><dd>{money2(t.total)}</dd></div>
          : <>
              <div><dt>Total</dt><dd>{money2(t.total)}</dd></div>
              <div className="due"><dt>Amount due</dt><dd className={t.overdue ? 'overdue' : ''}>{money2(t.amount_due)}</dd></div>
            </>}
      </dl>
      {locked && <p className="muted hint">This {K.doc} is {record.status}; reopen or restore it to change line items.</p>}
    </>
  );
}

function ItemForm({ K, parentId, item, onDone, onCancel }) {
  const [f, setF] = React.useState({
    ...blankItem, ...Object.fromEntries(Object.entries(item).filter(([k]) => k in blankItem).map(([k, v]) => [k, v ?? ''])),
  });
  const [error, setError] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));
  const amount = (Number(f.quantity) || 0) * (Number(f.unit_price) || 0);
  const parentKey = K.entity === 'quotes' ? 'quote_id' : 'invoice_id';

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setError('');
    try {
      if (item.id) await data('update_invoice_item', { entity: K.entity, id: item.id, values: f });
      else await data('add_invoice_item', { entity: K.entity, values: { ...f, [parentKey]: parentId } });
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

// ── Details (tap a field to edit it) ────────────────────────────────────────

function DetailsView({ K, record, onSaved }) {
  const { open } = useCrm();
  const [editing, setEditing] = React.useState(null);
  return (
    <>
      {K.sections.map((sec) => (
        <div key={sec.title} className="det-sec">
          <div className="det-title">{sec.title}</div>
          <dl className={`det-grid ${sec.keys.length === 1 ? 'one' : ''}`}>
            {sec.keys.map((k) => (editing === k
              ? <InlineEdit key={k} K={K} record={record} field={K.F[k]} onCancel={() => setEditing(null)} onSaved={() => { setEditing(null); onSaved(); }} />
              : (
                <div key={k} className="det-item tap-edit" role="button" tabIndex={0} onClick={(e) => { if (!e.target.closest('a, .link')) setEditing(k); }} onKeyDown={(e) => { if (e.key === 'Enter') setEditing(k); }} title="Tap to edit">
                  <dt>{K.F[k].label}</dt>
                  <dd><span className="dv">{valueOf(K, record, k, open)}</span><span className="pencil" aria-hidden="true">✎</span></dd>
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

function InlineEdit({ K, record, field, onCancel, onSaved }) {
  const [value, setValue] = React.useState(record[field.key] ?? '');
  const [error, setError] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => { ref.current?.querySelector('input, select, textarea')?.focus(); }, []);
  async function save(e) {
    e?.preventDefault();
    setBusy(true); setError('');
    try { await data('update', { entity: K.entity, id: record.id, values: { [field.key]: value } }); onSaved(); } catch (err) { setError(err.message); setBusy(false); }
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
      {field.key === 'name' && <div className="hint">{K.Doc} numbers must be unique in this workspace.</div>}
      {error && <div className="error" style={{ marginTop: 6 }}>{error}</div>}
    </form>
  );
}

// ── Preview and send ────────────────────────────────────────────────────────

function PreviewDrawer({ K, record, onClose }) {
  const [p, setP] = React.useState(null);
  const [error, setError] = React.useState('');
  React.useEffect(() => { data('invoice_preview', { entity: K.entity, id: record.id }).then(setP).catch((err) => setError(err.message)); }, [K, record.id, record.updated_at]);
  return (
    <Drawer title={`${K.Doc} email preview`} kicker={record.name} onClose={onClose}>
      {error && <div className="error">{error}</div>}
      {!p && !error && <p className="muted">Loading…</p>}
      {p && (
        <>
          <dl className="kv" style={{ marginBottom: 12 }}>
            <dt>Subject</dt><dd>{p.subject}</dd>
            <dt>To</dt><dd>{p.to || <span className="overdue">No email yet</span>}</dd>
          </dl>
          <iframe title={`${K.Doc} preview`} className="inv-frame" srcDoc={p.html} sandbox="allow-popups" />
        </>
      )}
    </Drawer>
  );
}

function SendDrawer({ K, record, onClose, onSent }) {
  const [to, setTo] = React.useState(record.bill_to_email || '');
  const [cc, setCc] = React.useState('');
  const [save, setSave] = React.useState(true);
  const [attach, setAttach] = React.useState(true);
  const [error, setError] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const t = record.totals || {};
  async function send(e) {
    e.preventDefault();
    setBusy(true); setError('');
    try { await data('send_invoice', { entity: K.entity, id: record.id, values: { to, cc, save_email: save, attach_pdf: attach } }); onSent(); } catch (err) { setError(err.message); setBusy(false); }
  }
  return (
    <Drawer title={record.sent_at ? `Resend ${K.doc}` : `Send ${K.doc}`} kicker={record.name} onClose={onClose}>
      <form onSubmit={send}>
        <p className="muted" style={{ marginTop: 0 }}>
          Sends the {K.doc} for <strong>{money2(K.entity === 'quotes' ? t.total : t.amount_due)}</strong> as a branded email.
          {record.status === 'draft' ? ` The ${K.doc} is marked Sent.` : ''} It is logged here{record.contact_id ? ' and on the contact' : ''}.
          {' '}Tip: send it to yourself first to check it.
        </p>
        <label className="label" htmlFor="si-to">To</label>
        <input id="si-to" className="field" type="email" inputMode="email" autoComplete="email" value={to} onChange={(e) => setTo(e.target.value)} placeholder="client@example.com" required />
        {!record.bill_to_email && (
          <label className="check" style={{ marginTop: 10 }}>
            <input type="checkbox" checked={save} onChange={(e) => setSave(e.target.checked)} /> Save this as the client&rsquo;s email{record.contact_id ? ' (and on the contact)' : ''}
          </label>
        )}
        <label className="check" style={{ marginTop: 10 }}>
          <input type="checkbox" checked={attach} onChange={(e) => setAttach(e.target.checked)} /> Attach a PDF copy of the {K.doc}
        </label>
        <label className="label" htmlFor="si-cc">Cc <span className="muted">· optional, comma separated</span></label>
        <input id="si-cc" className="field" inputMode="email" value={cc} onChange={(e) => setCc(e.target.value)} />
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

// ── Edit client details and dates in one form (works on phones) ────────────

function DetailsDrawer({ K, record, onClose, onSaved }) {
  const [v, setV] = React.useState(Object.fromEntries(K.billKeys.map((k) => [k, record[k] ?? ''])));
  const [error, setError] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const set = (k) => (val) => setV((p) => ({ ...p, [k]: val }));
  async function save(e) {
    e.preventDefault();
    setBusy(true); setError('');
    const changed = Object.fromEntries(K.billKeys.filter((k) => String(v[k] ?? '') !== String(record[k] ?? '')).map((k) => [k, v[k]]));
    try { if (Object.keys(changed).length) await data('update', { entity: K.entity, id: record.id, values: changed }); onSaved(); } catch (err) { setError(err.message); setBusy(false); }
  }
  return (
    <Drawer title={`Edit ${K.doc} details`} kicker={record.name} onClose={onClose}>
      <form onSubmit={save}>
        {K.billKeys.map((k) => (
          <div key={k}>
            <label className="label" htmlFor={`bt-${k}`}>{K.F[k].label}{k === 'due_date' ? <span className="muted"> · {K.dueHint}</span> : null}</label>
            <FieldInput id={`bt-${k}`} field={K.F[k]} value={v[k]} onChange={set(k)} />
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

// ── New quote / invoice ─────────────────────────────────────────────────────

function NewDoc({ K, preset }) {
  const { go, open, changed } = useCrm();
  const [v, setV] = React.useState({ issue_date: today(), ...(preset || {}) });
  const [number, setNumber] = React.useState('');
  const [error, setError] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  React.useEffect(() => { data('next_invoice_number', { entity: K.entity }).then((r) => setNumber(r.number)).catch(() => {}); }, [K]);
  const set = (k) => (val) => setV((p) => ({ ...p, [k]: val }));

  async function create(e) {
    e.preventDefault();
    setBusy(true); setError('');
    try {
      const rec = await data('create', { entity: K.entity, values: { ...v, name: v.name || number } });
      changed();
      open(K.entity, rec.id);
    } catch (err) { setError(err.message); setBusy(false); }
  }
  return (
    <div className="rec">
      <Crumbs K={K} go={go} name={`New ${K.doc}`} />
      <form className="card pad" onSubmit={create} style={{ maxWidth: 760 }}>
        <h1 style={{ marginTop: 0 }}>New {K.doc}</h1>
        <p className="muted">Pick a contact to fill in the client details, or type them for a prospect who isn&rsquo;t in the CRM yet. You add line items on the next page.</p>
        <label className="label" htmlFor="ni-name">{K.Doc} number</label>
        <input id="ni-name" className="field" value={v.name ?? number} onChange={(e) => set('name')(e.target.value)} />
        <div className="grid2">
          {K.newKeys.map((k) => (
            <div key={k}>
              <label className="label" htmlFor={`ni-${k}`}>{K.F[k].label}{k === 'due_date' ? <span className="muted"> · {K.dueHint}</span> : null}</label>
              <FieldInput id={`ni-${k}`} field={K.F[k]} value={v[k]} onChange={set(k)} />
            </div>
          ))}
        </div>
        {error && <div className="error">{error}</div>}
        <div className="actions">
          <button className="btn btn-primary" disabled={busy}>Create {K.doc}</button>
          <button type="button" className="btn" onClick={() => go(K.entity)}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
