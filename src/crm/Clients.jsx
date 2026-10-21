import React from 'react';
import { data } from './api';
import {
  Comments, Drawer, Media, PerformanceReport, Stat, StatusPill, canSeek, clock, count, day, money, parseClock, range,
} from './report';

// Team-side "Client retention & reporting" tabs: Dashboards, Approvals and
// Recaps. Every client is a company record; what the client sees lives in
// Share.jsx behind the links these pages hand out.

const origin = () => `${window.location.origin}${window.location.pathname.startsWith('/crm') ? '/crm' : ''}`;
export const portalLink = (token) => `${origin()}/portal/${token}`;
export const recapLink = (token) => `${origin()}/recap/${token}`;
const thisMonth = () => new Date().toISOString().slice(0, 7);

function useClients(version) {
  const [clients, setClients] = React.useState(null);
  const reload = React.useCallback(() => data('clients').then(setClients).catch(() => setClients([])), []);
  React.useEffect(() => { reload(); }, [reload, version]);
  return [clients, reload];
}

function CopyLink({ href, label = 'Copy link' }) {
  const [done, setDone] = React.useState(false);
  return (
    <span className="copy">
      <input className="field" readOnly value={href} aria-label="Share link" onFocus={(e) => e.target.select()} />
      <button type="button" className="btn" onClick={() => navigator.clipboard?.writeText(href).then(() => { setDone(true); setTimeout(() => setDone(false), 1500); })}>
        {done ? 'Copied' : label}
      </button>
      <a className="btn" href={href} target="_blank" rel="noreferrer">Open ↗</a>
    </span>
  );
}

function ClientSelect({ clients, value, onChange, all }) {
  return (
    <select className="field" style={{ width: 'auto', maxWidth: '100%' }} aria-label="Client" value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">{all ? 'All clients' : 'Choose a client…'}</option>
      {(clients || []).map((c) => <option key={c.company_id} value={c.company_id}>{c.name}</option>)}
    </select>
  );
}

// ── Dashboards ──────────────────────────────────────────────────────────────

export function Dashboards({ version }) {
  const [clients, reload] = useClients(version);
  const [selected, setSelected] = React.useState(null);
  const [adding, setAdding] = React.useState('');
  if (!clients) return <p className="muted">Loading…</p>;

  const live = clients.filter((c) => c.portal_id);
  const mrr = live.filter((c) => c.active).reduce((n, c) => n + (c.monthly_fee || 0), 0);
  const others = clients.filter((c) => !c.portal_id);

  if (selected) return <DashboardEditor companyId={selected} onBack={() => { setSelected(null); reload(); }} />;

  return (
    <>
      <div className="head">
        <h1>Performance dashboards</h1>
        <ClientSelect clients={others} value={adding} onChange={setAdding} />
        <button className="btn btn-primary" disabled={!adding} onClick={() => setSelected(adding)}>Set up dashboard</button>
      </div>
      <p className="muted count">One white-labeled page per client with ad spend, views, engagement and conversions. Clients are company records.</p>
      <div className="stats stats-3">
        <Stat k="Live dashboards" n={live.filter((c) => c.active).length} v={`${live.length} set up`} />
        <Stat k="Reporting revenue" n={money(mrr) || '$0'} v="per month" />
        <Stat k="Awaiting approval" n={clients.reduce((n, c) => n + c.open_approvals, 0)} v="drafts & cuts" />
      </div>
      <div className="section">Clients</div>
      <div className="card" style={{ overflowX: 'auto' }}>
        {live.length === 0 ? <p className="muted" style={{ padding: 16 }}>No dashboards yet. Pick a company above to set one up.</p> : (
          <table>
            <thead><tr><th>Client</th><th>Status</th><th className="num">Monthly fee</th><th className="hide-sm">Latest data</th><th className="hide-sm">Open approvals</th></tr></thead>
            <tbody>
              {live.map((c) => (
                <tr key={c.company_id} onClick={() => setSelected(c.company_id)}>
                  <td><span className="swatch" style={{ background: c.brand_color }} />{c.display_name || c.name}</td>
                  <td><span className={`pill ${c.active ? 'approved' : ''}`}>{c.active ? 'Live' : 'Paused'}</span></td>
                  <td className="num">{money(c.monthly_fee)}</td>
                  <td className="hide-sm">{c.last_period ? day(c.last_period).replace(/ \d+,/, '') : <span className="muted">No data</span>}</td>
                  <td className="hide-sm">{c.open_approvals || ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

const BLANK_PORTAL = { display_name: '', logo_url: '', brand_color: '#1A1A18', agency_name: '', welcome: '', monthly_fee: '', active: true };
const BLANK_METRIC = { period: thisMonth(), channel: '', spend: '', views: '', engagement: '', conversions: '' };

function DashboardEditor({ companyId, onBack }) {
  const [state, setState] = React.useState(null);
  const [form, setForm] = React.useState(BLANK_PORTAL);
  const [row, setRow] = React.useState(BLANK_METRIC);
  const [error, setError] = React.useState('');
  const [saved, setSaved] = React.useState(false);

  const load = React.useCallback(() => data('dashboard', { company_id: companyId }).then((s) => {
    setState(s);
    if (s.portal) setForm(Object.fromEntries(Object.keys(BLANK_PORTAL).map((k) => [k, s.portal[k] ?? BLANK_PORTAL[k]])));
    else setForm({ ...BLANK_PORTAL, display_name: s.company.name });
  }).catch((e) => setError(e.message)), [companyId]);
  React.useEffect(() => { load(); }, [load]);

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  async function savePortal(e) {
    e.preventDefault();
    setError('');
    try {
      const portal = await data('save_portal', { company_id: companyId, values: form });
      setState((s) => ({ ...s, portal }));
      setSaved(true); setTimeout(() => setSaved(false), 1500);
    } catch (err) { setError(err.message); }
  }

  async function rotate() {
    if (!window.confirm('Issue a new link? The current link stops working immediately.')) return;
    const portal = await data('rotate_portal_link', { company_id: companyId });
    setState((s) => ({ ...s, portal }));
  }

  async function addRow(e) {
    e.preventDefault();
    setError('');
    try {
      const m = await data('save_metric', { company_id: companyId, values: { ...row, period: `${row.period}-01` } });
      setState((s) => ({ ...s, metrics: [m, ...s.metrics].sort((a, b) => b.period.localeCompare(a.period)) }));
      setRow((r) => ({ ...BLANK_METRIC, period: r.period }));
    } catch (err) { setError(err.message); }
  }

  async function removeRow(id) {
    await data('delete_metric', { id });
    setState((s) => ({ ...s, metrics: s.metrics.filter((m) => m.id !== id) }));
  }

  if (!state) return error ? <p className="error">{error}</p> : <p className="muted">Loading…</p>;
  const setR = (k) => (e) => setRow((p) => ({ ...p, [k]: e.target.value }));

  return (
    <>
      <div className="head">
        <button className="btn" onClick={onBack}>← All dashboards</button>
        <h1>{state.company.name}</h1>
      </div>

      <div className="cols">
        <form className="card pad" onSubmit={savePortal}>
          <div className="kicker">White-label branding</div>
          <div className="grid2">
            <div><label className="label" htmlFor="p-name">Name on dashboard</label><input id="p-name" className="field" value={form.display_name} onChange={set('display_name')} /></div>
            <div><label className="label" htmlFor="p-agency">Prepared by</label><input id="p-agency" className="field" placeholder="Your agency name" value={form.agency_name} onChange={set('agency_name')} /></div>
            <div className="span2"><label className="label" htmlFor="p-logo">Logo URL</label><input id="p-logo" className="field" placeholder="https://…/logo.png" value={form.logo_url} onChange={set('logo_url')} /></div>
            <div><label className="label" htmlFor="p-color">Brand color</label>
              <span className="copy"><input id="p-color" type="color" className="colorpick" value={form.brand_color} onChange={set('brand_color')} /><input className="field" aria-label="Brand color hex" value={form.brand_color} onChange={set('brand_color')} /></span>
            </div>
            <div><label className="label" htmlFor="p-fee">Monthly reporting fee</label><input id="p-fee" className="field" inputMode="decimal" placeholder="$" value={form.monthly_fee} onChange={set('monthly_fee')} /></div>
            <div className="span2"><label className="label" htmlFor="p-welcome">Welcome note</label><textarea id="p-welcome" className="field" rows={2} value={form.welcome} onChange={set('welcome')} /></div>
          </div>
          <label className="check" style={{ marginTop: 14 }}><input type="checkbox" checked={form.active} onChange={set('active')} /> Dashboard link is live</label>
          {error && <div className="error">{error}</div>}
          <div className="actions"><button className="btn btn-primary">{state.portal ? (saved ? 'Saved' : 'Save branding') : 'Create dashboard'}</button></div>
        </form>

        <div className="card pad">
          <div className="kicker">Client link</div>
          {state.portal ? (
            <>
              <p className="muted" style={{ fontSize: 14 }}>Your client opens their dashboard, approvals and recaps here. No login needed — treat it like a password.</p>
              <CopyLink href={portalLink(state.portal.share_token)} />
              <div className="actions"><button className="btn btn-small" onClick={rotate}>Issue a new link</button></div>
            </>
          ) : <p className="muted" style={{ fontSize: 14 }}>Save the branding to create the client's link.</p>}
        </div>
      </div>

      <div className="section">Performance data</div>
      <form className="card pad metric-form" onSubmit={addRow}>
        <div><label className="label" htmlFor="m-period">Month</label><input id="m-period" type="month" className="field" required value={row.period} onChange={setR('period')} /></div>
        <div><label className="label" htmlFor="m-ch">Channel</label><input id="m-ch" className="field" list="channels" placeholder="Meta Ads" value={row.channel} onChange={setR('channel')} /></div>
        <div><label className="label" htmlFor="m-spend">Ad spend</label><input id="m-spend" className="field" inputMode="decimal" value={row.spend} onChange={setR('spend')} /></div>
        <div><label className="label" htmlFor="m-views">Views</label><input id="m-views" className="field" inputMode="numeric" value={row.views} onChange={setR('views')} /></div>
        <div><label className="label" htmlFor="m-eng">Engagement</label><input id="m-eng" className="field" inputMode="numeric" value={row.engagement} onChange={setR('engagement')} /></div>
        <div><label className="label" htmlFor="m-conv">Conversions</label><input id="m-conv" className="field" inputMode="numeric" value={row.conversions} onChange={setR('conversions')} /></div>
        <div style={{ alignSelf: 'end' }}><button className="btn btn-primary">Add</button></div>
        <datalist id="channels">
          {['Meta Ads', 'Google Ads', 'TikTok', 'YouTube', 'Instagram (organic)', 'LinkedIn', 'Email'].map((c) => <option key={c} value={c} />)}
        </datalist>
      </form>
      {state.metrics.length > 0 && (
        <div className="card" style={{ overflowX: 'auto', marginTop: 12, maxHeight: 320, overflowY: 'auto' }}>
          <table className="static">
            <thead><tr><th>Month</th><th>Channel</th><th className="num">Spend</th><th className="num">Views</th><th className="num">Engagement</th><th className="num">Conv.</th><th /></tr></thead>
            <tbody>
              {state.metrics.map((m) => (
                <tr key={m.id}>
                  <td>{day(m.period).replace(/ \d+,/, '')}</td><td>{m.channel}</td><td className="num">{money(m.spend)}</td>
                  <td className="num">{count(m.views)}</td><td className="num">{count(m.engagement)}</td><td className="num">{count(m.conversions)}</td>
                  <td className="num"><button className="link danger" onClick={() => removeRow(m.id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="section">Preview — what your client sees</div>
      <PerformanceReport metrics={state.metrics} color={form.brand_color} />
    </>
  );
}

// ── Content approvals ───────────────────────────────────────────────────────

const KINDS = [
  { id: 'video', label: 'Video cut' },
  { id: 'draft', label: 'Copy / draft' },
  { id: 'image', label: 'Image / design' },
  { id: 'other', label: 'Other' },
];
const kindLabel = (k) => KINDS.find((x) => x.id === k)?.label || k;

export function Approvals({ version }) {
  const [clients] = useClients(version);
  const [rows, setRows] = React.useState(null);
  const [client, setClient] = React.useState('');
  const [status, setStatus] = React.useState('open');
  const [open, setOpen] = React.useState(null); // id | 'new'
  const [tick, setTick] = React.useState(0);

  React.useEffect(() => {
    data('approvals', { company_id: client || undefined, status }).then(setRows).catch(() => setRows([]));
  }, [client, status, tick, version]);
  const refresh = () => setTick((t) => t + 1);

  return (
    <>
      <div className="head">
        <h1>Content approvals</h1>
        <ClientSelect clients={clients} value={client} onChange={setClient} all />
        <select className="field" style={{ width: 'auto' }} aria-label="Status" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="open">Open</option>
          <option value="pending">Awaiting review</option>
          <option value="changes_requested">Changes requested</option>
          <option value="approved">Approved</option>
          <option value="">All</option>
        </select>
        <button className="btn btn-primary" onClick={() => setOpen('new')}>Send for approval</button>
      </div>
      <p className="muted count">Clients review drafts and video cuts in their portal, leave timestamped comments, and approve in one place.</p>
      <div className="card" style={{ overflowX: 'auto' }}>
        {!rows ? <p className="muted" style={{ padding: 16 }}>Loading…</p> : rows.length === 0 ? <p className="muted" style={{ padding: 16 }}>Nothing here.</p> : (
          <table>
            <thead><tr><th>Item</th><th>Client</th><th>Status</th><th className="hide-sm">Comments</th><th className="hide-sm">Due</th></tr></thead>
            <tbody>
              {rows.map((a) => (
                <tr key={a.id} onClick={() => setOpen(a.id)}>
                  <td><strong>{a.title}</strong> <span className="muted">· {kindLabel(a.kind)} · v{a.version}</span></td>
                  <td>{a.company_name}</td>
                  <td><StatusPill status={a.status} /></td>
                  <td className="hide-sm">{a.open_comments ? `${a.open_comments} open` : ''}</td>
                  <td className="hide-sm">{day(a.due_date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {open && (
        <ApprovalDrawer key={open} id={open === 'new' ? null : open} clients={clients || []} defaultClient={client}
          onClose={() => setOpen(null)} onSaved={(id) => { refresh(); setOpen(id); }} onDeleted={() => { refresh(); setOpen(null); }} />
      )}
    </>
  );
}

function ApprovalForm({ initial, clients, onSubmit, submitLabel }) {
  const [form, setForm] = React.useState(initial);
  const [error, setError] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));
  async function submit(e) {
    e.preventDefault();
    setBusy(true); setError('');
    try { await onSubmit(form); } catch (err) { setError(err.message); }
    setBusy(false);
  }
  return (
    <form onSubmit={submit}>
      <div className="grid2">
        {!initial.id && (
          <div className="span2"><label className="label" htmlFor="a-client">Client *</label>
            <select id="a-client" className="field" required value={form.company_id} onChange={set('company_id')}>
              <option value="">Choose a client…</option>
              {clients.map((c) => <option key={c.company_id} value={c.company_id}>{c.name}{c.portal_id ? '' : ' (no portal yet)'}</option>)}
            </select>
          </div>
        )}
        <div className="span2"><label className="label" htmlFor="a-title">Title *</label><input id="a-title" className="field" required value={form.title} onChange={set('title')} /></div>
        <div><label className="label" htmlFor="a-kind">Type</label>
          <select id="a-kind" className="field" value={form.kind} onChange={set('kind')}>{KINDS.map((k) => <option key={k.id} value={k.id}>{k.label}</option>)}</select>
        </div>
        <div><label className="label" htmlFor="a-due">Review by</label><input id="a-due" type="date" className="field" value={form.due_date || ''} onChange={set('due_date')} /></div>
        <div className="span2"><label className="label" htmlFor="a-url">File or video link</label>
          <input id="a-url" className="field" placeholder="https://… (.mp4, YouTube, Vimeo, Loom, Drive, image)" value={form.media_url || ''} onChange={set('media_url')} />
        </div>
        <div className="span2"><label className="label" htmlFor="a-body">{form.kind === 'draft' ? 'Draft copy' : 'Notes for the client'}</label>
          <textarea id="a-body" className="field" rows={form.kind === 'draft' ? 8 : 3} value={form.body || ''} onChange={set('body')} />
        </div>
      </div>
      {error && <div className="error">{error}</div>}
      <div className="actions"><button className="btn btn-primary" disabled={busy}>{submitLabel}</button></div>
    </form>
  );
}

function ApprovalDrawer({ id, clients, defaultClient, onClose, onSaved, onDeleted }) {
  const [item, setItem] = React.useState(null);
  const [mode, setMode] = React.useState(null); // 'edit' | 'version'
  const [reply, setReply] = React.useState('');
  const [at, setAt] = React.useState('');
  const [error, setError] = React.useState('');
  const video = React.useRef(null);

  const load = React.useCallback(() => data('get_approval', { id }).then(setItem).catch((e) => setError(e.message)), [id]);
  React.useEffect(() => { if (id) load(); }, [id, load]);

  if (!id) {
    return (
      <Drawer title="Send for approval" kicker="Content approval" onClose={onClose}>
        <ApprovalForm clients={clients} submitLabel="Send to client"
          initial={{ company_id: defaultClient || '', title: '', kind: 'video', media_url: '', body: '', due_date: '' }}
          onSubmit={async (v) => { const row = await data('save_approval', { values: v }); onSaved(row.id); }} />
      </Drawer>
    );
  }
  if (!item) return <Drawer title="Approval" onClose={onClose}>{error ? <p className="error">{error}</p> : <p className="muted">Loading…</p>}</Drawer>;

  async function comment(e) {
    e.preventDefault();
    setError('');
    const ts = parseClock(at);
    if (Number.isNaN(ts)) { setError('Time must look like 1:23'); return; }
    try {
      const c = await data('approval_comment', { id, values: { body: reply, timestamp_sec: ts } });
      setItem((p) => ({ ...p, comments: [...p.comments, c] }));
      setReply(''); setAt('');
    } catch (err) { setError(err.message); }
  }
  async function resolve(c) {
    const row = await data('resolve_comment', { id: c.id, resolved: !c.resolved });
    setItem((p) => ({ ...p, comments: p.comments.map((x) => (x.id === c.id ? row : x)) }));
  }
  async function removeComment(c) {
    if (!window.confirm('Delete this comment?')) return;
    await data('delete_comment', { id: c.id });
    setItem((p) => ({ ...p, comments: p.comments.filter((x) => x.id !== c.id) }));
  }
  async function remove() {
    if (!window.confirm(`Delete "${item.title}" and its comments?`)) return;
    await data('delete_approval', { id });
    onDeleted();
  }
  const seek = (s) => { if (video.current) { video.current.currentTime = s; video.current.play?.(); } };

  return (
    <Drawer title={item.title} kicker={`${item.company_name} · ${kindLabel(item.kind)} · v${item.version}`} onClose={onClose}>
      <div className="note-head" style={{ marginBottom: 12 }}>
        <StatusPill status={item.status} />
        {item.decided_by && <span className="muted" style={{ fontSize: 13 }}>by {item.decided_by} · {day(item.decided_at)}</span>}
        {item.due_date && <span className="muted" style={{ fontSize: 13 }}>Review by {day(item.due_date)}</span>}
      </div>
      {item.portal_token
        ? <CopyLink href={`${portalLink(item.portal_token)}?item=${item.id}`} label="Copy client link" />
        : <p className="notice">This client has no live dashboard link yet. Set one up under Client reporting → Dashboards so they can review.</p>}

      {mode === 'edit' && (
        <div className="card convert"><ApprovalForm clients={clients} submitLabel="Save" initial={item}
          onSubmit={async (v) => { await data('save_approval', { values: { ...v, id } }); setMode(null); load(); onSaved(id); }} /></div>
      )}
      {mode === 'version' && (
        <div className="card convert">
          <strong>Upload v{item.version + 1}</strong>
          <p className="muted" style={{ fontSize: 13 }}>Puts it back to “Awaiting review”. Earlier comments stay, tagged with their version.</p>
          <ApprovalForm clients={clients} submitLabel={`Send v${item.version + 1}`} initial={{ ...item, media_url: '' }}
            onSubmit={async (v) => { await data('new_approval_version', { id, values: { media_url: v.media_url || null, body: v.body } }); setMode(null); load(); onSaved(id); }} />
        </div>
      )}

      {mode === 'email' && <EmailComposer id={id} onDone={() => setMode(null)} />}

      <div style={{ marginTop: 16 }}><Media ref={video} url={item.media_url} /></div>
      {item.body && <div className="card pad pre draft">{item.body}</div>}

      <div className="actions">
        {item.portal_token && <button className="btn btn-primary" onClick={() => setMode(mode === 'email' ? null : 'email')}>Email client</button>}
        <button className="btn" onClick={() => setMode(mode === 'version' ? null : 'version')}>New version</button>
        <button className="btn" onClick={() => setMode(mode === 'edit' ? null : 'edit')}>Edit</button>
        <button className="btn btn-danger" onClick={remove}>Delete</button>
      </div>

      <div className="section">Comments</div>
      <Comments comments={item.comments} version={item.version} onSeek={seek}
        actions={(c) => (
          <>
            <button className="link" onClick={() => resolve(c)}>{c.resolved ? 'Reopen' : 'Resolve'}</button>
            <button className="link danger" style={{ marginLeft: 0 }} onClick={() => removeComment(c)}>Delete</button>
          </>
        )} />
      <form onSubmit={comment} className="composer" style={{ marginTop: 12 }}>
        <textarea className="field" rows={2} placeholder="Reply to the client…" aria-label="Reply" value={reply} onChange={(e) => setReply(e.target.value)} required />
        <div className="actions" style={{ marginTop: 8, alignItems: 'center' }}>
          <input className="field" style={{ width: 90 }} placeholder="0:00" aria-label="Timestamp" value={at} onChange={(e) => setAt(e.target.value)} />
          {canSeek(item.media_url) && <button type="button" className="btn btn-small" onClick={() => setAt(clock(video.current?.currentTime || 0))}>Use current time</button>}
          <button className="btn">Comment</button>
        </div>
        {error && <div className="error">{error}</div>}
      </form>
    </Drawer>
  );
}

// Sends the branded "please review" email through Resend, with a live preview.
function EmailComposer({ id, onDone }) {
  const [preview, setPreview] = React.useState(null);
  const [picked, setPicked] = React.useState([]);
  const [extra, setExtra] = React.useState('');
  const [cc, setCc] = React.useState('');
  const [note, setNote] = React.useState('');
  const [error, setError] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [sent, setSent] = React.useState(null);
  const linkBase = origin();

  React.useEffect(() => {
    const t = setTimeout(() => {
      data('approval_email', { id, values: { note, link_base: linkBase } })
        .then((p) => {
          setPreview(p);
          setPicked((cur) => (cur.length || preview ? cur : p.contacts.map((c) => c.email)));
        })
        .catch((e) => setError(e.message));
    }, note ? 400 : 0);
    return () => clearTimeout(t);
  }, [id, note]);

  const toggle = (email) => setPicked((p) => (p.includes(email) ? p.filter((x) => x !== email) : [...p, email]));

  async function send(e) {
    e.preventDefault();
    setBusy(true); setError('');
    try {
      const to = [...picked, ...extra.split(/[,;\s]+/).filter(Boolean)];
      setSent(await data('send_approval_email', { id, values: { to, cc, note, link_base: linkBase } }));
    } catch (err) { setError(err.message); }
    setBusy(false);
  }

  if (sent) {
    return (
      <div className="notice">
        Sent to {[...sent.to, ...sent.cc].join(', ')}. It's logged on the company's activity timeline.{' '}
        <button className="link" onClick={onDone}>Close</button>
      </div>
    );
  }
  return (
    <form className="card convert" onSubmit={send}>
      <strong>Email approval request</strong>
      {!preview ? <p className="muted">{error || 'Loading…'}</p> : (
        <>
          <label className="label">To</label>
          {preview.contacts.length === 0 && <p className="muted" style={{ fontSize: 13, margin: 0 }}>No contacts with an email on this company — add addresses below.</p>}
          {preview.contacts.map((c) => (
            <label key={c.email} className="check"><input type="checkbox" checked={picked.includes(c.email)} onChange={() => toggle(c.email)} /> {c.name} <span className="muted">{c.email}</span></label>
          ))}
          <input className="field" style={{ marginTop: 8 }} placeholder="Other addresses, comma separated" aria-label="Other recipients" value={extra} onChange={(e) => setExtra(e.target.value)} />
          <label className="label" htmlFor="em-cc">Cc</label>
          <input id="em-cc" className="field" placeholder="Optional" value={cc} onChange={(e) => setCc(e.target.value)} />
          <label className="label" htmlFor="em-note">Personal note</label>
          <textarea id="em-note" className="field" rows={3} placeholder="Optional — shows as a quote in the email" value={note} onChange={(e) => setNote(e.target.value)} />
          <label className="label">Preview · <span style={{ color: 'var(--ink)' }}>{preview.subject}</span></label>
          <iframe className="email-preview" title="Email preview" srcDoc={preview.html} sandbox="" />
          {error && <div className="error">{error}</div>}
          <div className="actions">
            <button className="btn btn-primary" disabled={busy || (!picked.length && !extra.trim())}>{busy ? 'Sending…' : 'Send email'}</button>
            <button type="button" className="btn" onClick={onDone}>Cancel</button>
          </div>
        </>
      )}
    </form>
  );
}

// ── Campaign recaps ─────────────────────────────────────────────────────────

export function Recaps({ version }) {
  const [clients] = useClients(version);
  const [rows, setRows] = React.useState(null);
  const [client, setClient] = React.useState('');
  const [open, setOpen] = React.useState(null); // recap row | 'new'
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    data('recaps', { company_id: client || undefined }).then(setRows).catch(() => setRows([]));
  }, [client, tick, version]);

  return (
    <>
      <div className="head">
        <h1>Campaign recaps</h1>
        <ClientSelect clients={clients} value={client} onChange={setClient} all />
        <button className="btn btn-primary" onClick={() => setOpen('new')}>New recap</button>
      </div>
      <p className="muted count">A shareable one-pager after each campaign that your client can forward to their boss.</p>
      <div className="card" style={{ overflowX: 'auto' }}>
        {!rows ? <p className="muted" style={{ padding: 16 }}>Loading…</p> : rows.length === 0 ? <p className="muted" style={{ padding: 16 }}>No recaps yet.</p> : (
          <table>
            <thead><tr><th>Campaign</th><th>Client</th><th className="hide-sm">Dates</th><th>Status</th></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} onClick={() => setOpen(r)}>
                  <td><strong>{r.title}</strong></td><td>{r.company_name}</td>
                  <td className="hide-sm">{range(r.start_date, r.end_date)}</td>
                  <td><span className={`pill ${r.published ? 'approved' : ''}`}>{r.published ? 'Published' : 'Draft'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {open && (
        <RecapDrawer key={open === 'new' ? 'new' : open.id} recap={open === 'new' ? null : open} clients={clients || []} defaultClient={client}
          onClose={() => setOpen(null)} onSaved={(row) => { setTick((t) => t + 1); setOpen(row); }} onDeleted={() => { setTick((t) => t + 1); setOpen(null); }} />
      )}
    </>
  );
}

function RecapDrawer({ recap, clients, defaultClient, onClose, onSaved, onDeleted }) {
  const [form, setForm] = React.useState(() => recap
    ? { ...recap, metrics: recap.metrics?.length ? recap.metrics : [], highlights: recap.highlights || [] }
    : { company_id: defaultClient || '', title: '', start_date: '', end_date: '', summary: '', metrics: [], highlights: [], next_steps: '', published: false });
  const [error, setError] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));
  const setItem = (list, i, k) => (e) => setForm((p) => ({ ...p, [list]: p[list].map((x, j) => (j === i ? { ...x, [k]: e.target.value } : x)) }));
  const add = (list, blank) => setForm((p) => ({ ...p, [list]: [...p[list], blank] }));
  const drop = (list, i) => setForm((p) => ({ ...p, [list]: p[list].filter((_, j) => j !== i) }));

  async function pull() {
    setError('');
    if (!form.company_id) { setError('Choose a client first'); return; }
    try {
      const t = await data('metric_totals', { company_id: form.company_id, from: form.start_date || null, to: form.end_date || null });
      const rows = [
        { label: 'Ad spend', value: money(t.spend) || '$0', note: '' },
        { label: 'Views', value: count(t.views), note: '' },
        { label: 'Engagement', value: count(t.engagement), note: t.views ? `${((t.engagement / t.views) * 100).toFixed(1)}% engagement rate` : '' },
        { label: 'Conversions', value: count(t.conversions), note: t.conversions ? `$${(t.spend / t.conversions).toFixed(2)} per conversion` : '' },
      ];
      setForm((p) => ({ ...p, metrics: [...rows, ...p.metrics.filter((m) => !rows.some((r) => r.label === m.label))] }));
    } catch (err) { setError(err.message); }
  }

  async function save(e) {
    e.preventDefault();
    setBusy(true); setError('');
    try { onSaved(await data('save_recap', { values: form })); } catch (err) { setError(err.message); }
    setBusy(false);
  }
  async function remove() {
    if (!window.confirm(`Delete "${recap.title}"? Its link stops working.`)) return;
    await data('delete_recap', { id: recap.id });
    onDeleted();
  }

  return (
    <Drawer title={recap ? recap.title : 'New campaign recap'} kicker={recap ? recap.company_name : 'Campaign recap'} onClose={onClose}>
      {recap && (recap.published
        ? <CopyLink href={recapLink(recap.share_token)} />
        : <p className="notice">Draft — tick “Published” and save to make the link work.</p>)}
      <form onSubmit={save}>
        <div className="grid2">
          {!recap && (
            <div className="span2"><label className="label" htmlFor="r-client">Client *</label>
              <select id="r-client" className="field" required value={form.company_id} onChange={set('company_id')}>
                <option value="">Choose a client…</option>
                {clients.map((c) => <option key={c.company_id} value={c.company_id}>{c.name}</option>)}
              </select>
            </div>
          )}
          <div className="span2"><label className="label" htmlFor="r-title">Campaign name *</label><input id="r-title" className="field" required value={form.title} onChange={set('title')} /></div>
          <div><label className="label" htmlFor="r-start">Start</label><input id="r-start" type="date" className="field" value={form.start_date || ''} onChange={set('start_date')} /></div>
          <div><label className="label" htmlFor="r-end">End</label><input id="r-end" type="date" className="field" value={form.end_date || ''} onChange={set('end_date')} /></div>
          <div className="span2"><label className="label" htmlFor="r-sum">Executive summary</label>
            <textarea id="r-sum" className="field" rows={4} placeholder="Two or three sentences a busy boss will read." value={form.summary || ''} onChange={set('summary')} />
          </div>
        </div>

        <div className="section row"><span style={{ flex: 1 }}>Headline numbers</span>
          <button type="button" className="btn btn-small" onClick={pull}>Pull from dashboard</button>
          <button type="button" className="btn btn-small" style={{ marginLeft: 6 }} onClick={() => add('metrics', { label: '', value: '', note: '' })}>Add</button>
        </div>
        {form.metrics.map((m, i) => (
          <div key={i} className="list-row">
            <input className="field" placeholder="Label" aria-label="Metric label" value={m.label} onChange={setItem('metrics', i, 'label')} />
            <input className="field" placeholder="Value" aria-label="Metric value" value={m.value} onChange={setItem('metrics', i, 'value')} />
            <input className="field" placeholder="Context (optional)" aria-label="Metric context" value={m.note} onChange={setItem('metrics', i, 'note')} />
            <button type="button" className="link danger" onClick={() => drop('metrics', i)}>Remove</button>
          </div>
        ))}

        <div className="section row"><span style={{ flex: 1 }}>Highlights</span>
          <button type="button" className="btn btn-small" onClick={() => add('highlights', { title: '', body: '', image_url: '' })}>Add</button>
        </div>
        {form.highlights.map((h, i) => (
          <div key={i} className="card pad" style={{ marginBottom: 8 }}>
            <input className="field" placeholder="Highlight" aria-label="Highlight title" value={h.title} onChange={setItem('highlights', i, 'title')} />
            <textarea className="field" style={{ marginTop: 8 }} rows={2} placeholder="What happened and why it mattered" aria-label="Highlight details" value={h.body} onChange={setItem('highlights', i, 'body')} />
            <div className="list-row" style={{ marginTop: 8 }}>
              <input className="field" placeholder="Image URL (optional)" aria-label="Highlight image" value={h.image_url} onChange={setItem('highlights', i, 'image_url')} />
              <button type="button" className="link danger" onClick={() => drop('highlights', i)}>Remove</button>
            </div>
          </div>
        ))}

        <label className="label" htmlFor="r-next">Next steps</label>
        <textarea id="r-next" className="field" rows={3} value={form.next_steps || ''} onChange={set('next_steps')} />
        <label className="check" style={{ marginTop: 14 }}><input type="checkbox" checked={!!form.published} onChange={set('published')} /> Published (link works and it shows in the client's portal)</label>
        {error && <div className="error">{error}</div>}
        <div className="actions">
          <button className="btn btn-primary" disabled={busy}>{recap ? 'Save recap' : 'Create recap'}</button>
          {recap && <button type="button" className="btn btn-danger" onClick={remove}>Delete</button>}
        </div>
      </form>
    </Drawer>
  );
}
