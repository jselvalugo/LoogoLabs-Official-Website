import React from 'react';
import { call, data, getToken, setToken } from './api';

export const STAGES = [
  { id: 'lead', label: 'Lead' },
  { id: 'qualified', label: 'Qualified' },
  { id: 'proposal', label: 'Proposal' },
  { id: 'won', label: 'Won' },
  { id: 'lost', label: 'Lost' },
];
const STAGE_LABEL = Object.fromEntries(STAGES.map((s) => [s.id, s.label]));
const PAGES = [
  { id: 'overview', label: 'Overview', path: '' },
  { id: 'contacts', label: 'Contacts', path: '/contacts' },
  { id: 'settings', label: 'Settings', path: '/settings' },
];

const money = (n) => `$${Math.round(Number(n) || 0).toLocaleString('en-US')}`;
const when = (d) => new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });

// Served at the root of crm.loogolabs.com, and under /crm on the main domain
// (for local dev and before DNS is set up).
const BASE = window.location.pathname.startsWith('/crm') ? '/crm' : '';
const pageFromPath = () => {
  const rest = window.location.pathname.slice(BASE.length).replace(/\/$/, '');
  return (PAGES.find((p) => p.path === rest) || PAGES[0]).id;
};

export default function App() {
  const [me, setMe] = React.useState(null);
  const [checking, setChecking] = React.useState(!!getToken());
  const [page, setPage] = React.useState(pageFromPath);

  React.useEffect(() => {
    if (getToken()) call('crm-auth', 'me').then(setMe).catch(() => {}).finally(() => setChecking(false));
    const out = () => setMe(null);
    const pop = () => setPage(pageFromPath());
    window.addEventListener('crm:signed-out', out);
    window.addEventListener('popstate', pop);
    return () => { window.removeEventListener('crm:signed-out', out); window.removeEventListener('popstate', pop); };
  }, []);

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

  if (checking) return null;
  if (!me) return <SignIn onSignedIn={setMe} />;

  return (
    <>
      <header className="top">
        <div className="brand"><img src="/admin-logo.png" alt="" />CRM</div>
        <nav className="nav">
          {PAGES.map((p) => <button key={p.id} className={page === p.id ? 'on' : ''} onClick={() => go(p.id)}>{p.label}</button>)}
        </nav>
        <div className="who hide-sm">{me.instance_name}<br />{me.name || me.email}</div>
        <button className="btn" onClick={signOut}>Sign out</button>
      </header>
      <main className="page">
        {page === 'overview' && <Overview />}
        {page === 'contacts' && <Contacts />}
        {page === 'settings' && <Settings me={me} />}
      </main>
    </>
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

function Overview() {
  const [state, setState] = React.useState(null);
  React.useEffect(() => { data('overview').then(setState).catch(() => setState({ stages: [], activity: [] })); }, []);
  if (!state) return <p className="muted">Loading…</p>;
  const by = Object.fromEntries(state.stages.map((s) => [s.stage, s]));

  return (
    <>
      <div className="head"><h1>Overview</h1></div>
      <div className="stats">
        {STAGES.map((s) => (
          <div key={s.id} className="card stat">
            <div className="k">{s.label}</div>
            <div className="n">{by[s.id]?.n || 0}</div>
            <div className="v">{money(by[s.id]?.total)}</div>
          </div>
        ))}
      </div>
      <div className="section">Recent activity</div>
      <div className="feed">
        {state.activity.length === 0
          ? <div className="muted">No activity yet. Add notes to contacts to see them here.</div>
          : state.activity.map((a) => (
            <div key={a.id}>
              <strong>{a.contact_name}</strong> <span className="muted">· {a.author || 'Removed user'} · {when(a.created_at)}</span>
              <div style={{ whiteSpace: 'pre-wrap', marginTop: 4 }}>{a.body}</div>
            </div>
          ))}
      </div>
    </>
  );
}

function Contacts() {
  const [contacts, setContacts] = React.useState(null);
  const [query, setQuery] = React.useState('');
  const [stage, setStage] = React.useState('all');
  const [open, setOpen] = React.useState(null); // a contact, or {} for a new one

  React.useEffect(() => { data('list_contacts').then(setContacts).catch(() => setContacts([])); }, []);

  const q = query.trim().toLowerCase();
  const shown = (contacts || []).filter((c) => (stage === 'all' || c.stage === stage)
    && (!q || [c.name, c.company, c.email].some((v) => (v || '').toLowerCase().includes(q))));

  function saved(row) {
    setContacts((prev) => (prev.some((c) => c.id === row.id) ? prev.map((c) => (c.id === row.id ? row : c)) : [row, ...prev]));
    setOpen(row);
  }

  return (
    <>
      <div className="head">
        <h1>Contacts</h1>
        <input className="field" style={{ width: 280, maxWidth: '100%' }} placeholder="Search name, company, email" aria-label="Search contacts"
          value={query} onChange={(e) => setQuery(e.target.value)} />
        <select className="field" style={{ width: 'auto' }} aria-label="Filter by stage" value={stage} onChange={(e) => setStage(e.target.value)}>
          <option value="all">All stages</option>
          {STAGES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
        <button className="btn btn-primary" onClick={() => setOpen({})}>New contact</button>
      </div>
      <div className="card" style={{ overflowX: 'auto' }}>
        {!contacts ? <p className="muted" style={{ padding: 16 }}>Loading…</p>
          : shown.length === 0 ? <p className="muted" style={{ padding: 16 }}>{contacts.length ? 'No contacts match.' : 'No contacts yet.'}</p>
            : (
              <table>
                <thead><tr><th>Name</th><th>Company</th><th className="hide-sm">Email</th><th>Stage</th><th className="num">Value</th></tr></thead>
                <tbody>
                  {shown.map((c) => (
                    <tr key={c.id} onClick={() => setOpen(c)}>
                      <td>{c.name}</td><td>{c.company}</td><td className="hide-sm">{c.email}</td>
                      <td><span className={`pill ${c.stage}`}>{STAGE_LABEL[c.stage]}</span></td>
                      <td className="num">{c.value === null ? '' : money(c.value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
      </div>
      {open && (
        <ContactDrawer key={open.id || 'new'} contact={open} onClose={() => setOpen(null)} onSaved={saved}
          onDeleted={(id) => { setContacts((prev) => prev.filter((c) => c.id !== id)); setOpen(null); }} />
      )}
    </>
  );
}

function ContactDrawer({ contact, onClose, onSaved, onDeleted }) {
  const isNew = !contact.id;
  const [form, setForm] = React.useState({
    name: contact.name || '', company: contact.company || '', email: contact.email || '', phone: contact.phone || '',
    stage: contact.stage || 'lead', value: contact.value ?? '',
  });
  const [notes, setNotes] = React.useState([]);
  const [note, setNote] = React.useState('');
  const [error, setError] = React.useState('');
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => { if (!isNew) data('list_notes', { contact_id: contact.id }).then(setNotes).catch(() => {}); }, [contact.id, isNew]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function save(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      onSaved(await data(isNew ? 'create_contact' : 'update_contact', { ...form, id: contact.id }));
    } catch (err) { setError(err.message); }
    setBusy(false);
  }

  async function remove() {
    if (!window.confirm(`Delete ${contact.name} and their notes?`)) return;
    await data('delete_contact', { id: contact.id });
    onDeleted(contact.id);
  }

  async function addNote(e) {
    e.preventDefault();
    if (!note.trim()) return;
    try {
      const row = await data('add_note', { contact_id: contact.id, body: note });
      setNotes((prev) => [row, ...prev]);
      setNote('');
    } catch (err) { setError(err.message); }
  }

  return (
    <div className="drawer-bg" onClick={onClose}>
      <aside className="drawer" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h2 style={{ margin: 0, flex: 1 }}>{isNew ? 'New contact' : contact.name}</h2>
          <button className="btn" onClick={onClose}>Close</button>
        </div>
        <form onSubmit={save}>
          <label className="label" htmlFor="c-name">Name</label>
          <input id="c-name" className="field" value={form.name} onChange={set('name')} required />
          <label className="label" htmlFor="c-company">Company</label>
          <input id="c-company" className="field" value={form.company} onChange={set('company')} />
          <div className="row2">
            <div><label className="label" htmlFor="c-email">Email</label><input id="c-email" className="field" type="email" value={form.email} onChange={set('email')} /></div>
            <div><label className="label" htmlFor="c-phone">Phone</label><input id="c-phone" className="field" value={form.phone} onChange={set('phone')} /></div>
          </div>
          <div className="row2">
            <div>
              <label className="label" htmlFor="c-stage">Stage</label>
              <select id="c-stage" className="field" value={form.stage} onChange={set('stage')}>
                {STAGES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </div>
            <div><label className="label" htmlFor="c-value">Value ($)</label><input id="c-value" className="field" inputMode="decimal" value={form.value} onChange={set('value')} /></div>
          </div>
          {error && <div className="error">{error}</div>}
          <div className="actions">
            <button className="btn btn-primary" disabled={busy}>{isNew ? 'Create contact' : 'Save'}</button>
            {!isNew && <button type="button" className="btn btn-danger" onClick={remove}>Delete</button>}
          </div>
        </form>

        {!isNew && (
          <>
            <div className="section">Notes</div>
            <form onSubmit={addNote}>
              <textarea className="field" rows={3} placeholder="Add a note…" aria-label="New note" value={note} onChange={(e) => setNote(e.target.value)} />
              <div className="actions" style={{ marginTop: 8 }}><button className="btn">Add note</button></div>
            </form>
            {notes.map((n) => <div key={n.id} className="note">{n.body}<small>{n.author || 'Removed user'} · {when(n.created_at)}</small></div>)}
          </>
        )}
      </aside>
    </div>
  );
}

function Settings({ me }) {
  const [team, setTeam] = React.useState([]);
  const [current, setCurrent] = React.useState('');
  const [next, setNext] = React.useState('');
  const [msg, setMsg] = React.useState('');

  React.useEffect(() => { data('team').then(setTeam).catch(() => {}); }, []);

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
