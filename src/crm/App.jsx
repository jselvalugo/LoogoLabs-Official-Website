import React from 'react';
import { call, data, getToken, setToken } from './api';
import { ACTIVITY_TYPES, ENTITIES, LEAD_STATUSES, OPPORTUNITY_STAGES, optionLabel } from './entities';
import { Approvals, Dashboards, Recaps } from './Clients';
import { Audience, Automations, Campaigns } from './Email';
import { Drawer, Stat } from './report';

const PAGES = [
  { id: 'overview', label: 'Overview', path: '' },
  { id: 'leads', label: 'Leads', path: '/leads', entity: 'leads' },
  { id: 'contacts', label: 'Contacts', path: '/contacts', entity: 'contacts' },
  { id: 'companies', label: 'Companies', path: '/companies', entity: 'companies' },
  { id: 'opportunities', label: 'Opportunities', path: '/opportunities', entity: 'opportunities' },
  { id: 'tasks', label: 'Tasks', path: '/tasks' },
  { id: 'dashboards', label: 'Dashboards', path: '/dashboards' },
  { id: 'approvals', label: 'Approvals', path: '/approvals' },
  { id: 'recaps', label: 'Recaps', path: '/recaps' },
  { id: 'audience', label: 'Audience', path: '/email/audience' },
  { id: 'campaigns', label: 'Campaigns', path: '/email/campaigns' },
  { id: 'automations', label: 'Automations', path: '/email/automations' },
  { id: 'settings', label: 'Settings', path: '/settings' },
];

// Top bar: record pages sit under one CRM menu; the rest are tabs.
const NAV = [
  'overview',
  { id: 'crm', label: 'CRM', items: ['leads', 'contacts', 'companies', 'opportunities', 'tasks'] },
  'dashboards', 'approvals', 'recaps',
  { id: 'email', label: 'Email', items: ['campaigns', 'automations', 'audience'] },
  'settings',
];
const pageLabel = (id) => PAGES.find((p) => p.id === id).label;

const money = (n) => (n === null || n === undefined ? '' : `$${Math.round(Number(n)).toLocaleString('en-US')}`);
const when = (d) => new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
const day = (d) => (d ? new Date(`${String(d).slice(0, 10)}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '');
const today = () => new Date().toISOString().slice(0, 10);

// Served at the root of crm.loogolabs.com, and under /crm on the main domain
// (for local dev and before DNS is set up).
const BASE = window.location.pathname.startsWith('/crm') ? '/crm' : '';
const pageFromPath = () => {
  const rest = window.location.pathname.slice(BASE.length).replace(/\/$/, '');
  return (PAGES.find((p) => p.path === rest) || PAGES[0]).id;
};

// Shared app state: the team (for owner pickers) and the open record drawer.
const Crm = React.createContext(null);
const useCrm = () => React.useContext(Crm);

export default function App() {
  const [me, setMe] = React.useState(null);
  const [checking, setChecking] = React.useState(!!getToken());
  const [page, setPage] = React.useState(pageFromPath);
  const [team, setTeam] = React.useState([]);
  const [drawer, setDrawer] = React.useState(null); // { entity, id? , values? }
  const [version, setVersion] = React.useState(0); // bumps when a record changes so lists reload

  React.useEffect(() => {
    if (getToken()) call('crm-auth', 'me').then(setMe).catch(() => {}).finally(() => setChecking(false));
    const out = () => setMe(null);
    const pop = () => setPage(pageFromPath());
    window.addEventListener('crm:signed-out', out);
    window.addEventListener('popstate', pop);
    return () => { window.removeEventListener('crm:signed-out', out); window.removeEventListener('popstate', pop); };
  }, []);
  React.useEffect(() => { if (me) data('team').then(setTeam).catch(() => {}); }, [me]);

  function go(id) {
    const p = PAGES.find((x) => x.id === id);
    window.history.pushState(null, '', BASE + p.path || '/');
    setPage(id);
  }

  async function signOut() {
    await call('crm-auth', 'logout').catch(() => {});
    setToken(null);
    setMe(null);
  }

  const ctx = React.useMemo(() => ({
    me, team, version,
    open: (entity, id, values) => setDrawer({ entity, id, values }),
    changed: () => setVersion((v) => v + 1),
  }), [me, team, version]);

  if (checking) return null;
  if (!me) return <SignIn onSignedIn={setMe} />;
  const current = PAGES.find((p) => p.id === page);

  return (
    <Crm.Provider value={ctx}>
      <header className="top">
        <div className="brand"><img src="/admin-logo.png" alt="" />CRM</div>
        <nav className="nav">
          {NAV.map((n) => (typeof n === 'string'
            ? <button key={n} className={page === n ? 'on' : ''} onClick={() => go(n)}>{pageLabel(n)}</button>
            : <NavMenu key={n.id} group={n} page={page} go={go} />))}
        </nav>
        <div className="who hide-sm">{me.instance_name}<br />{me.name || me.email}</div>
        <button className="btn" onClick={signOut}>Sign out</button>
      </header>
      <main className="page">
        {page === 'overview' && <Overview />}
        {current.entity && <RecordList key={current.entity} entityKey={current.entity} />}
        {page === 'tasks' && <Tasks />}
        {page === 'dashboards' && <Dashboards version={version} />}
        {page === 'approvals' && <Approvals version={version} />}
        {page === 'recaps' && <Recaps version={version} />}
        {page === 'audience' && <Audience version={version} />}
        {page === 'campaigns' && <Campaigns version={version} />}
        {page === 'automations' && <Automations version={version} />}
        {page === 'settings' && <Settings me={me} />}
      </main>
      {drawer && (
        <RecordDrawer key={`${drawer.entity}:${drawer.id || 'new'}`} {...drawer} onClose={() => setDrawer(null)}
          onOpen={(entity, id, values) => setDrawer({ entity, id, values })} />
      )}
    </Crm.Provider>
  );
}

function SignIn({ onSignedIn }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [busy, setBusy] = React.useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const { token } = await call('crm-auth', 'login', { email, password });
      setToken(token);
      onSignedIn(await call('crm-auth', 'me'));
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <div className="auth">
      <img src="/admin-logo.png" alt="Loogo Labs" />
      <form className="card" onSubmit={submit}>
        <h1>Sign in</h1>
        <p className="muted" style={{ margin: 0 }}>Your login is set up by Loogo Labs.</p>
        <label className="label" htmlFor="email">Email</label>
        <input id="email" className="field" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label className="label" htmlFor="password">Password</label>
        <input id="password" className="field" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <div className="error">{error}</div>}
        <div className="actions"><button className="btn btn-primary" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button></div>
      </form>
    </div>
  );
}

// ── Overview ────────────────────────────────────────────────────────────────

function NavMenu({ group, page, go }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  const active = group.items.includes(page);
  React.useEffect(() => {
    if (!open) return undefined;
    const away = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    const esc = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', away);
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('mousedown', away); document.removeEventListener('keydown', esc); };
  }, [open]);
  return (
    <div className="menu" ref={ref}>
      <button className={active ? 'on' : ''} aria-haspopup="true" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        {group.label}{active ? ` · ${pageLabel(page)}` : ''} <span aria-hidden="true">▾</span>
      </button>
      {open && (
        <div className="menu-list" role="menu">
          {group.items.map((id) => (
            <button key={id} role="menuitem" className={page === id ? 'on' : ''} onClick={() => { setOpen(false); go(id); }}>{pageLabel(id)}</button>
          ))}
        </div>
      )}
    </div>
  );
}

function Overview() {
  const { open, version } = useCrm();
  const [state, setState] = React.useState(null);
  React.useEffect(() => { data('overview').then(setState).catch(() => setState(false)); }, [version]);
  if (state === null) return <p className="muted">Loading…</p>;
  if (!state) return <p className="error">Could not load the overview.</p>;

  const openStages = state.pipeline.filter((s) => !['won', 'lost'].includes(s.stage));
  const openTotal = openStages.reduce((n, s) => n + s.amount, 0);
  const weighted = openStages.reduce((n, s) => n + s.weighted, 0);
  const won = state.pipeline.find((s) => s.stage === 'won');
  const leadCount = (id) => state.leads.find((l) => l.status === id)?.count || 0;

  return (
    <>
      <div className="head"><h1>Overview</h1></div>
      <div className="stats">
        <Stat k="Open pipeline" n={money(openTotal)} v={`${money(weighted)} weighted`} />
        <Stat k="Closed won" n={money(won.amount)} v={`${won.count} deal${won.count === 1 ? '' : 's'}`} />
        <Stat k="Open leads" n={leadCount('new') + leadCount('contacted') + leadCount('qualified')} v={`${state.counts.leads} total`} />
        <Stat k="Contacts" n={state.counts.contacts} v={`${state.counts.companies} companies`} />
        <Stat k="Open tasks" n={state.open_tasks.length} v={`${state.open_tasks.filter((t) => t.due_date && t.due_date < today()).length} overdue`} />
      </div>

      <div className="section">Pipeline by stage</div>
      <div className="stats stats-6">
        {state.pipeline.map((s) => <Stat key={s.stage} k={s.label} n={s.count} v={money(s.amount)} />)}
      </div>

      <div className="section">Leads by status</div>
      <div className="stats">
        {LEAD_STATUSES.map((s) => <Stat key={s.id} k={s.label} n={leadCount(s.id)} />)}
      </div>

      <div className="cols">
        <div>
          <div className="section">Open tasks</div>
          <div className="feed">
            {state.open_tasks.length === 0 ? <div className="muted">No open tasks.</div> : state.open_tasks.map((a) => (
              <div key={a.id}>
                <strong>{a.subject || a.body}</strong>
                <div className="muted">
                  {a.due_date ? <span className={a.due_date < today() ? 'overdue' : ''}>Due {day(a.due_date)}</span> : 'No due date'}
                  {' · '}<button className="link" onClick={() => open(a.entity_type, a.entity_id)}>{a.entity_name}</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="section">Recent activity</div>
          <div className="feed">
            {state.recent_activity.length === 0 ? <div className="muted">No activity yet. Log calls, emails, meetings and notes on any record.</div>
              : state.recent_activity.map((a) => (
                <div key={a.id}>
                  <span className="pill">{optionLabel({ options: ACTIVITY_TYPES }, a.type)}</span>{' '}
                  <button className="link" onClick={() => open(a.entity_type, a.entity_id)}>{a.entity_name}</button>
                  <span className="muted"> · {a.author || 'Removed user'} · {when(a.created_at)}</span>
                  {a.subject && <div><strong>{a.subject}</strong></div>}
                  {a.body && <div className="pre">{a.body}</div>}
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}

// ── Lists ───────────────────────────────────────────────────────────────────

function Cell({ field, row }) {
  const v = row[field.key];
  if (v === null || v === undefined || v === '') return null;
  switch (field.type) {
    case 'ref': case 'user': return row[`${field.key}_name`] || '';
    case 'select': return <span className={`pill ${v}`}>{optionLabel(field, v)}</span>;
    case 'money': return money(v);
    case 'percent': return `${v}%`;
    case 'date': return day(v);
    default: return String(v);
  }
}

const filterField = (key) => ({ leads: 'status', opportunities: 'stage', contacts: 'lifecycle', companies: 'type' }[key]);

function RecordList({ entityKey }) {
  const e = ENTITIES[entityKey];
  const { open, version } = useCrm();
  const [rows, setRows] = React.useState(null);
  const [total, setTotal] = React.useState(0);
  const [query, setQuery] = React.useState('');
  const [filter, setFilter] = React.useState('');
  const [view, setView] = React.useState('table');
  const fField = e.fields.find((f) => f.key === filterField(entityKey));
  const columns = e.columns.map((k) => e.fields.find((f) => f.key === k));

  React.useEffect(() => {
    const t = setTimeout(() => {
      data('list', { entity: entityKey, query, filters: filter ? { [fField.key]: filter } : {}, limit: 500 })
        .then((r) => { setRows(r.records); setTotal(r.total); })
        .catch(() => setRows([]));
    }, query ? 250 : 0);
    return () => clearTimeout(t);
  }, [entityKey, query, filter, version]);

  return (
    <>
      <div className="head">
        <h1>{e.plural}</h1>
        <input className="field" style={{ width: 260, maxWidth: '100%' }} placeholder={`Search ${e.plural.toLowerCase()}`} aria-label={`Search ${e.plural}`}
          value={query} onChange={(ev) => setQuery(ev.target.value)} />
        {fField && (
          <select className="field" style={{ width: 'auto' }} aria-label={`Filter by ${fField.label}`} value={filter} onChange={(ev) => setFilter(ev.target.value)}>
            <option value="">All {fField.label.toLowerCase()}s</option>
            {fField.options.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
          </select>
        )}
        {entityKey === 'opportunities' && (
          <button className="btn" onClick={() => setView((v) => (v === 'table' ? 'board' : 'table'))}>{view === 'table' ? 'Board view' : 'Table view'}</button>
        )}
        <button className="btn btn-primary" onClick={() => open(entityKey)}>New {e.label.toLowerCase()}</button>
      </div>
      {rows && <p className="muted count">{total} {total === 1 ? e.label.toLowerCase() : e.plural.toLowerCase()}</p>}
      {view === 'board' && rows ? <Board rows={rows} /> : (
        <div className="card" style={{ overflowX: 'auto' }}>
          {!rows ? <p className="muted" style={{ padding: 16 }}>Loading…</p>
            : rows.length === 0 ? <p className="muted" style={{ padding: 16 }}>{query || filter ? `No ${e.plural.toLowerCase()} match.` : `No ${e.plural.toLowerCase()} yet.`}</p>
              : (
                <table>
                  <thead><tr>{columns.map((f, i) => <th key={f.key} className={`${f.type === 'money' ? 'num' : ''} ${i > 2 ? 'hide-sm' : ''}`}>{f.label}</th>)}</tr></thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr key={r.id} onClick={() => open(entityKey, r.id)}>
                        {columns.map((f, i) => <td key={f.key} className={`${f.type === 'money' ? 'num' : ''} ${i > 2 ? 'hide-sm' : ''}`}><Cell field={f} row={r} /></td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
        </div>
      )}
    </>
  );
}

function Board({ rows }) {
  const { open } = useCrm();
  return (
    <div className="board">
      {OPPORTUNITY_STAGES.map((s) => {
        const items = rows.filter((r) => r.stage === s.id);
        return (
          <div key={s.id} className="lane">
            <div className="lane-head">{s.label} <span className="muted">{items.length} · {money(items.reduce((n, r) => n + (r.amount || 0), 0))}</span></div>
            {items.map((r) => (
              <button key={r.id} className="card deal" onClick={() => open('opportunities', r.id)}>
                <strong>{r.name}</strong>
                <span className="muted">{r.company_id_name}</span>
                <span>{money(r.amount)}{r.close_date ? ` · ${day(r.close_date)}` : ''}</span>
              </button>
            ))}
          </div>
        );
      })}
    </div>
  );
}

// ── Record drawer ───────────────────────────────────────────────────────────

const refCache = {};
function useOptions(entityKey) {
  const { version } = useCrm();
  const [opts, setOpts] = React.useState(refCache[entityKey] || []);
  React.useEffect(() => {
    data('list', { entity: entityKey, limit: 500, sort: 'name:asc' })
      .then((r) => { refCache[entityKey] = r.records.map((x) => ({ id: x.id, name: x.name })); setOpts(refCache[entityKey]); })
      .catch(() => {});
  }, [entityKey, version]);
  return opts;
}

function RefSelect({ field, value, onChange, id }) {
  const options = useOptions(field.to);
  return (
    <select id={id} className="field" value={value || ''} onChange={(e) => onChange(e.target.value)}>
      <option value="">—</option>
      {options.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
    </select>
  );
}

function FieldInput({ field, value, onChange, id }) {
  const { team } = useCrm();
  const set = (e) => onChange(e.target.value);
  const v = value ?? '';
  switch (field.type) {
    case 'textarea': return <textarea id={id} className="field" rows={3} value={v} onChange={set} />;
    case 'select':
      return (
        <select id={id} className="field" value={v} onChange={set}>
          {!field.default && <option value="">—</option>}
          {field.options.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
        </select>
      );
    case 'ref': return <RefSelect id={id} field={field} value={v} onChange={onChange} />;
    case 'user':
      return (
        <select id={id} className="field" value={v} onChange={set}>
          <option value="">—</option>
          {team.map((u) => <option key={u.id} value={u.id}>{u.name || u.email}</option>)}
        </select>
      );
    case 'number': case 'money': case 'percent': return <input id={id} className="field" inputMode="decimal" value={v} onChange={set} />;
    case 'date': return <input id={id} className="field" type="date" value={v ? String(v).slice(0, 10) : ''} onChange={set} />;
    case 'email': return <input id={id} className="field" type="email" value={v} onChange={set} />;
    case 'url': return <input id={id} className="field" type="url" placeholder="https://" value={v} onChange={set} />;
    default: return <input id={id} className="field" value={v} onChange={set} required={field.required} />;
  }
}

const HALF = new Set(['text', 'email', 'phone', 'url', 'number', 'money', 'percent', 'date', 'select', 'ref', 'user']);

function RecordDrawer({ entity: entityKey, id, values: preset, onClose, onOpen }) {
  const e = ENTITIES[entityKey];
  const { me, changed } = useCrm();
  const isNew = !id;
  const [record, setRecord] = React.useState(null);
  const [form, setForm] = React.useState(() => {
    const base = Object.fromEntries(e.fields.map((f) => [f.key, f.default ?? '']));
    return { ...base, ...(isNew ? { owner_id: me.id } : {}), ...(preset || {}) };
  });
  const [error, setError] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [converting, setConverting] = React.useState(false);

  const load = React.useCallback(() => data('get', { entity: entityKey, id }).then((r) => {
    setRecord(r);
    setForm(Object.fromEntries(e.fields.map((f) => [f.key, r[f.key] ?? ''])));
  }).catch((err) => setError(err.message)), [entityKey, id]);
  React.useEffect(() => { if (!isNew) load(); }, [isNew, load]);

  async function save(ev) {
    ev.preventDefault();
    setBusy(true);
    setError('');
    try {
      const row = await data(isNew ? 'create' : 'update', { entity: entityKey, id, values: form });
      changed();
      if (isNew) onOpen(entityKey, row.id); else await load();
    } catch (err) { setError(err.message); }
    setBusy(false);
  }

  async function remove() {
    if (!window.confirm(`Delete ${record.name}? Its activities are deleted too. This cannot be undone.`)) return;
    try {
      await data('delete', { entity: entityKey, id });
      changed();
      onClose();
    } catch (err) { setError(err.message); }
  }

  if (!isNew && !record) {
    return <Drawer onClose={onClose} title={e.label}>{error ? <div className="error">{error}</div> : <p className="muted">Loading…</p>}</Drawer>;
  }

  const converted = entityKey === 'leads' && record?.status === 'converted';

  return (
    <Drawer onClose={onClose} title={isNew ? `New ${e.label.toLowerCase()}` : record.name} kicker={e.label}>
      {converted && (
        <div className="notice">
          Converted {record.converted_at ? day(record.converted_at) : ''}:{' '}
          {record.converted_contact_id && <button className="link" onClick={() => onOpen('contacts', record.converted_contact_id)}>contact</button>}
          {record.converted_company_id && <> · <button className="link" onClick={() => onOpen('companies', record.converted_company_id)}>company</button></>}
          {record.converted_opportunity_id && <> · <button className="link" onClick={() => onOpen('opportunities', record.converted_opportunity_id)}>opportunity</button></>}
        </div>
      )}
      <form onSubmit={save}>
        <div className="grid2">
          {e.fields.map((f) => (
            <div key={f.key} className={HALF.has(f.type) ? '' : 'span2'}>
              <label className="label" htmlFor={`f-${f.key}`}>{f.label}{f.required ? ' *' : ''}</label>
              <FieldInput id={`f-${f.key}`} field={f} value={form[f.key]} onChange={(v) => setForm((p) => ({ ...p, [f.key]: v }))} />
            </div>
          ))}
        </div>
        {error && <div className="error">{error}</div>}
        <div className="actions">
          <button className="btn btn-primary" disabled={busy}>{isNew ? `Create ${e.label.toLowerCase()}` : 'Save changes'}</button>
          {entityKey === 'leads' && !isNew && !converted && <button type="button" className="btn" onClick={() => setConverting(true)}>Convert lead</button>}
          {!isNew && <button type="button" className="btn btn-danger" onClick={remove}>Delete</button>}
        </div>
      </form>

      {converting && <ConvertLead lead={record} onCancel={() => setConverting(false)}
        onDone={(res) => { setConverting(false); changed(); onOpen('contacts', res.contact.id); }} />}

      {!isNew && (
        <>
          <Related record={record} entityKey={entityKey} onOpen={onOpen} />
          <Activities entityKey={entityKey} id={id} initial={record.activities} />
          <p className="muted meta">Created {when(record.created_at)} · Updated {when(record.updated_at)}</p>
        </>
      )}
    </Drawer>
  );
}

function Related({ record, entityKey, onOpen }) {
  const groups = Object.entries(record.related || {});
  const presets = { companies: { company_id: record.id }, contacts: { contact_id: record.id, company_id: record.company_id || '' } };
  if (!groups.length) return null;
  return groups.map(([key, rows]) => (
    <div key={key}>
      <div className="section row">
        <span style={{ flex: 1 }}>{ENTITIES[key].plural} ({rows.length})</span>
        <button className="btn btn-small" onClick={() => onOpen(key, null, presets[entityKey])}>Add</button>
      </div>
      {rows.length === 0 ? <div className="muted">None yet.</div> : rows.map((r) => (
        <button key={r.id} className="related" onClick={() => onOpen(key, r.id)}>
          <strong>{r.name}</strong>
          <span className="muted">
            {key === 'contacts' ? [r.title, r.email].filter(Boolean).join(' · ') : `${optionLabel(ENTITIES.opportunities.fields.find((f) => f.key === 'stage'), r.stage)} · ${money(r.amount) || 'no amount'}`}
          </span>
        </button>
      ))}
    </div>
  ));
}

function ConvertLead({ lead, onCancel, onDone }) {
  const [withOpp, setWithOpp] = React.useState(true);
  const [name, setName] = React.useState(`${lead.company_name || lead.name} deal`);
  const [amount, setAmount] = React.useState(lead.estimated_value ?? '');
  const [error, setError] = React.useState('');
  const [busy, setBusy] = React.useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      onDone(await data('convert_lead', { id: lead.id, options: { create_opportunity: withOpp, opportunity_name: name, amount: amount === '' ? null : Number(amount) } }));
    } catch (err) { setError(err.message); setBusy(false); }
  }

  return (
    <form className="card convert" onSubmit={submit}>
      <strong>Convert {lead.name}</strong>
      <p className="muted">
        Creates a contact{lead.company_name ? `, linked to ${lead.company_name} (matched or created)` : ''}. The lead is kept and marked converted.
      </p>
      <label className="check"><input type="checkbox" checked={withOpp} onChange={(e) => setWithOpp(e.target.checked)} /> Also create an opportunity</label>
      {withOpp && (
        <div className="grid2">
          <div><label className="label" htmlFor="cv-name">Opportunity name</label><input id="cv-name" className="field" value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div><label className="label" htmlFor="cv-amt">Amount</label><input id="cv-amt" className="field" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} /></div>
        </div>
      )}
      {error && <div className="error">{error}</div>}
      <div className="actions">
        <button className="btn btn-primary" disabled={busy}>Convert</button>
        <button type="button" className="btn" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

// ── Activities ──────────────────────────────────────────────────────────────

function Activities({ entityKey, id, initial }) {
  const { changed } = useCrm();
  const [items, setItems] = React.useState(initial || []);
  const [type, setType] = React.useState('note');
  const [subject, setSubject] = React.useState('');
  const [body, setBody] = React.useState('');
  const [due, setDue] = React.useState('');
  const [error, setError] = React.useState('');

  async function add(e) {
    e.preventDefault();
    setError('');
    try {
      const row = await data('add_activity', { values: { entity_type: entityKey, entity_id: id, type, subject, body, due_date: due } });
      setItems((p) => [row, ...p]);
      setSubject(''); setBody(''); setDue('');
      changed();
    } catch (err) { setError(err.message); }
  }

  async function toggle(a) {
    const row = await data('update_activity', { id: a.id, values: { completed: !a.completed_at } });
    setItems((p) => p.map((x) => (x.id === a.id ? row : x)));
    changed();
  }

  async function remove(a) {
    if (!window.confirm('Delete this activity?')) return;
    await data('delete_activity', { id: a.id });
    setItems((p) => p.filter((x) => x.id !== a.id));
    changed();
  }

  const scheduled = type === 'task' || type === 'meeting';
  return (
    <>
      <div className="section">Activity</div>
      <form onSubmit={add} className="composer">
        <div className="tabs">
          {ACTIVITY_TYPES.map((t) => <button type="button" key={t.id} className={type === t.id ? 'on' : ''} onClick={() => setType(t.id)}>{t.label}</button>)}
        </div>
        {type !== 'note' && <input className="field" placeholder={type === 'task' ? 'What needs doing?' : 'Subject'} aria-label="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />}
        <textarea className="field" rows={3} placeholder={type === 'note' ? 'Add a note…' : 'Details'} aria-label="Details" value={body} onChange={(e) => setBody(e.target.value)} />
        {scheduled && <input className="field" type="date" aria-label="Due date" value={due} onChange={(e) => setDue(e.target.value)} />}
        {error && <div className="error">{error}</div>}
        <div className="actions" style={{ marginTop: 8 }}><button className="btn">{type === 'task' ? 'Add task' : `Log ${type}`}</button></div>
      </form>
      {items.map((a) => (
        <div key={a.id} className="note">
          <div className="note-head">
            {a.type === 'task' && <input type="checkbox" checked={!!a.completed_at} onChange={() => toggle(a)} aria-label="Done" />}
            <span className="pill">{optionLabel({ options: ACTIVITY_TYPES }, a.type)}</span>
            <strong className={a.type === 'task' && a.completed_at ? 'done' : ''}>{a.subject}</strong>
            <button className="link danger" onClick={() => remove(a)} aria-label="Delete activity">Delete</button>
          </div>
          {a.body && <div className="pre">{a.body}</div>}
          <small>
            {a.author || 'Removed user'} · {when(a.created_at)}
            {a.due_date && <> · <span className={!a.completed_at && a.due_date < today() ? 'overdue' : ''}>due {day(a.due_date)}</span></>}
            {a.owner_id_name && a.type === 'task' && <> · assigned to {a.owner_id_name}</>}
          </small>
        </div>
      ))}
    </>
  );
}

function Tasks() {
  const { open, version, changed } = useCrm();
  const [tasks, setTasks] = React.useState(null);
  const [showDone, setShowDone] = React.useState(false);

  React.useEffect(() => {
    data('list_activities', showDone ? { type: 'task', limit: 300 } : { open_tasks: true, limit: 300 }).then(setTasks).catch(() => setTasks([]));
  }, [showDone, version]);

  async function toggle(a) {
    await data('update_activity', { id: a.id, values: { completed: !a.completed_at } });
    changed();
  }

  return (
    <>
      <div className="head">
        <h1>Tasks</h1>
        <label className="check"><input type="checkbox" checked={showDone} onChange={(e) => setShowDone(e.target.checked)} /> Include completed</label>
      </div>
      <p className="muted count">Add tasks from any lead, contact, company or opportunity.</p>
      <div className="card" style={{ overflowX: 'auto' }}>
        {!tasks ? <p className="muted" style={{ padding: 16 }}>Loading…</p> : tasks.length === 0 ? <p className="muted" style={{ padding: 16 }}>No tasks.</p> : (
          <table>
            <thead><tr><th style={{ width: 40 }} /><th>Task</th><th>Related to</th><th>Due</th><th className="hide-sm">Assigned to</th></tr></thead>
            <tbody>
              {tasks.map((a) => (
                <tr key={a.id} style={{ cursor: 'default' }}>
                  <td><input type="checkbox" checked={!!a.completed_at} onChange={() => toggle(a)} aria-label="Done" /></td>
                  <td className={a.completed_at ? 'done' : ''}>{a.subject || a.body}</td>
                  <td><button className="link" onClick={() => open(a.entity_type, a.entity_id)}>{a.entity_name}</button> <span className="muted">{ENTITIES[a.entity_type].label}</span></td>
                  <td className={!a.completed_at && a.due_date && a.due_date < today() ? 'overdue' : ''}>{day(a.due_date)}</td>
                  <td className="hide-sm">{a.owner_id_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

// ── Settings ────────────────────────────────────────────────────────────────

function Settings({ me }) {
  const { team } = useCrm();
  const [current, setCurrent] = React.useState('');
  const [next, setNext] = React.useState('');
  const [msg, setMsg] = React.useState('');

  async function changePassword(e) {
    e.preventDefault();
    setMsg('');
    try {
      await call('crm-auth', 'change_password', { current, next });
      setCurrent(''); setNext(''); setMsg('Password updated.');
    } catch (err) { setMsg(err.message); }
  }

  return (
    <>
      <div className="head"><h1>Settings</h1></div>
      <div className="card" style={{ padding: 20, marginBottom: 16 }}>
        <strong>{me.instance_name}</strong>
        <div className="muted">Signed in as {me.name ? `${me.name} · ` : ''}{me.email} ({me.role})</div>
      </div>
      <div className="card" style={{ padding: 20, marginBottom: 16, maxWidth: 420 }}>
        <strong>Change password</strong>
        <form onSubmit={changePassword}>
          <label className="label" htmlFor="pw-cur">Current password</label>
          <input id="pw-cur" className="field" type="password" autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} required />
          <label className="label" htmlFor="pw-new">New password (10+ characters)</label>
          <input id="pw-new" className="field" type="password" autoComplete="new-password" value={next} onChange={(e) => setNext(e.target.value)} required minLength={10} />
          {msg && <div className="muted" style={{ marginTop: 10 }}>{msg}</div>}
          <div className="actions"><button className="btn btn-primary">Update password</button></div>
        </form>
      </div>
      <div className="card" style={{ overflowX: 'auto' }}>
        <table>
          <thead><tr><th>Team member</th><th className="hide-sm">Email</th><th>Role</th></tr></thead>
          <tbody>
            {team.map((u) => <tr key={u.id} style={{ cursor: 'default' }}><td>{u.name || '—'}</td><td className="hide-sm">{u.email}</td><td>{u.role}</td></tr>)}
          </tbody>
        </table>
      </div>
      <p className="muted" style={{ fontSize: 13 }}>To add or remove team members, contact Loogo Labs.</p>
    </>
  );
}
