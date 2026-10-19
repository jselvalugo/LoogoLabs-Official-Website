import React from 'react';
import { apiFetch } from '../../lib/identity';

const inputStyle = { padding: '8px 10px', border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-1)', background: 'var(--paper-000)', fontSize: 13, fontFamily: 'var(--font-body)', width: '100%' };
const btn = { padding: '7px 14px', borderRadius: 999, border: '1px solid var(--border-hair)', background: 'var(--paper-000)', cursor: 'pointer', fontSize: 13, fontFamily: 'var(--font-body)' };
const btnPrimary = { ...btn, background: 'var(--ink-900)', color: 'var(--paper-000)', borderColor: 'var(--ink-900)' };
const label = { fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-400)', display: 'block', marginBottom: 4 };
const CRM_URL = 'https://crm.loogolabs.com';

async function crm(action, payload) {
  const res = await apiFetch('/.netlify/functions/crm-admin', { method: 'POST', body: JSON.stringify({ action, ...payload }) });
  const body = await res?.json().catch(() => ({}));
  if (!res?.ok) throw new Error(body?.error || 'Request failed');
  return body;
}

// CRM workspaces (crm.loogolabs.com): create one per client, give it users,
// suspend or delete it. Each instance only ever sees its own contacts.
export default function CrmInstances() {
  const [instances, setInstances] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [creating, setCreating] = React.useState(false);

  const load = React.useCallback(() => {
    apiFetch('/.netlify/functions/crm-admin')
      .then((r) => r?.json())
      .then((d) => { if (Array.isArray(d)) setInstances(d); })
      .finally(() => setLoading(false));
  }, []);
  React.useEffect(load, [load]);

  const patch = (id, fn) => setInstances((prev) => prev.map((i) => (i.id === id ? fn(i) : i)));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div className="ll-admin-content-header" style={{ padding: '20px 32px 16px', borderBottom: '1px solid var(--border-hair)', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ margin: 0, fontSize: 'var(--fs-h1)', fontWeight: 700, letterSpacing: 'var(--ls-h1)' }}>CRM Instances</h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--ink-400)' }}>
            Workspaces at <a href={CRM_URL} target="_blank" rel="noreferrer">crm.loogolabs.com</a> · {instances.length} instance{instances.length === 1 ? '' : 's'}
          </p>
        </div>
        <button style={btnPrimary} onClick={() => setCreating((v) => !v)}>{creating ? 'Cancel' : 'New instance'}</button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 32px', display: 'grid', gap: 16, alignContent: 'start' }}>
        {creating && <NewInstance onCreated={(row) => { setInstances((p) => [row, ...p]); setCreating(false); }} />}
        {loading ? <div style={{ color: 'var(--ink-400)', fontSize: 13 }}>Loading…</div>
          : instances.length === 0 && !creating ? <div style={{ color: 'var(--ink-400)', fontSize: 13 }}>No instances yet. Create one for yourself first.</div>
            : instances.map((inst) => (
              <Instance key={inst.id} inst={inst}
                onChange={(fields) => patch(inst.id, (i) => ({ ...i, ...fields }))}
                onUsers={(fn) => patch(inst.id, (i) => ({ ...i, users: fn(i.users) }))}
                onDeleted={() => setInstances((p) => p.filter((i) => i.id !== inst.id))} />
            ))}
      </div>
    </div>
  );
}

function Card({ children }) {
  return <div style={{ background: 'var(--paper-000)', border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-2)', padding: 20 }}>{children}</div>;
}

function NewInstance({ onCreated }) {
  const [f, setF] = React.useState({ name: '', ownerName: '', ownerEmail: '', ownerPassword: '' });
  const [error, setError] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setError('');
    try {
      onCreated(await crm('create_instance', { name: f.name, owner: { name: f.ownerName, email: f.ownerEmail, password: f.ownerPassword } }));
    } catch (err) { setError(err.message); setBusy(false); }
  }

  return (
    <Card>
      <form onSubmit={submit} style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <div><label style={label}>Workspace name</label><input style={inputStyle} value={f.name} onChange={set('name')} required placeholder="Loogo Labs" /></div>
        <div><label style={label}>Owner name</label><input style={inputStyle} value={f.ownerName} onChange={set('ownerName')} /></div>
        <div><label style={label}>Owner email</label><input style={inputStyle} type="email" value={f.ownerEmail} onChange={set('ownerEmail')} required /></div>
        <div><label style={label}>Owner password (10+)</label><input style={inputStyle} type="text" value={f.ownerPassword} onChange={set('ownerPassword')} required minLength={10} autoComplete="off" /></div>
        <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 12, alignItems: 'center' }}>
          <button style={btnPrimary} disabled={busy}>{busy ? 'Creating…' : 'Create instance'}</button>
          {error && <span style={{ color: '#B42318', fontSize: 13 }}>{error}</span>}
        </div>
      </form>
    </Card>
  );
}

function Instance({ inst, onChange, onUsers, onDeleted }) {
  const [adding, setAdding] = React.useState(false);
  const [error, setError] = React.useState('');
  const suspended = inst.status === 'suspended';

  const run = async (fn) => { setError(''); try { await fn(); } catch (err) { setError(err.message); } };

  const toggle = () => run(async () => onChange(await crm('update_instance', { id: inst.id, status: suspended ? 'active' : 'suspended' })));
  const rename = () => {
    const name = window.prompt('Workspace name', inst.name);
    if (name && name !== inst.name) run(async () => onChange(await crm('update_instance', { id: inst.id, name })));
  };
  const remove = () => {
    if (window.prompt(`This permanently deletes "${inst.name}", its users and all ${inst.contact_count} contacts. Type the workspace name to confirm.`) !== inst.name) return;
    run(async () => { await crm('delete_instance', { id: inst.id }); onDeleted(); });
  };
  const resetPassword = (u) => {
    const password = window.prompt(`New password for ${u.email} (10+ characters). They will be signed out everywhere.`);
    if (password) run(async () => { await crm('update_user', { id: u.id, password }); window.alert('Password updated.'); });
  };
  const setRole = (u, role) => run(async () => { const row = await crm('update_user', { id: u.id, role }); onUsers((list) => list.map((x) => (x.id === u.id ? row : x))); });
  const removeUser = (u) => {
    if (!window.confirm(`Remove ${u.email} from ${inst.name}?`)) return;
    run(async () => { await crm('delete_user', { id: u.id }); onUsers((list) => list.filter((x) => x.id !== u.id)); });
  };

  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontWeight: 600, fontSize: 16 }}>
            {inst.name}
            {suspended && <span style={{ marginLeft: 8, fontSize: 11, padding: '2px 8px', borderRadius: 999, background: '#FDECEA', color: '#B42318' }}>Suspended</span>}
          </div>
          <div style={{ fontSize: 12, color: 'var(--ink-400)', fontFamily: 'var(--font-mono)' }}>
            {inst.slug} · {inst.contact_count} contacts · created {new Date(inst.created_at).toLocaleDateString()}
          </div>
        </div>
        <button style={btn} onClick={rename}>Rename</button>
        <button style={btn} onClick={toggle}>{suspended ? 'Reactivate' : 'Suspend'}</button>
        <button style={{ ...btn, color: '#B42318' }} onClick={remove}>Delete</button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 14, fontSize: 13 }}>
        <thead>
          <tr style={{ textAlign: 'left', color: 'var(--ink-400)' }}>
            <th style={{ padding: '6px 0', fontWeight: 500 }}>User</th><th style={{ fontWeight: 500 }}>Role</th><th style={{ fontWeight: 500 }}>Last sign-in</th><th />
          </tr>
        </thead>
        <tbody>
          {inst.users.map((u) => (
            <tr key={u.id} style={{ borderTop: '1px solid var(--border-hair)' }}>
              <td style={{ padding: '8px 0' }}>{u.name || '—'}<div style={{ color: 'var(--ink-400)' }}>{u.email}</div></td>
              <td>
                <select value={u.role} onChange={(e) => setRole(u, e.target.value)} style={{ ...inputStyle, width: 'auto', padding: '4px 6px' }} aria-label={`Role for ${u.email}`}>
                  <option value="owner">Owner</option><option value="member">Member</option>
                </select>
              </td>
              <td style={{ color: 'var(--ink-400)' }}>{u.last_login_at ? new Date(u.last_login_at).toLocaleString() : 'Never'}</td>
              <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                <button style={{ ...btn, padding: '4px 10px' }} onClick={() => resetPassword(u)}>Reset password</button>{' '}
                <button style={{ ...btn, padding: '4px 10px', color: '#B42318' }} onClick={() => removeUser(u)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {inst.users.length === 0 && <div style={{ fontSize: 13, color: 'var(--ink-400)', padding: '8px 0' }}>No users yet.</div>}

      {adding
        ? <NewUser instanceId={inst.id} onCancel={() => setAdding(false)} onCreated={(row) => { onUsers((list) => [...list, row]); setAdding(false); }} />
        : <button style={{ ...btn, marginTop: 12 }} onClick={() => setAdding(true)}>Add user</button>}
      <McpTokens inst={inst} onTokens={(fn) => onChange({ tokens: fn(inst.tokens || []) })} />
      {error && <div style={{ color: '#B42318', fontSize: 13, marginTop: 8 }}>{error}</div>}
    </Card>
  );
}

// Connects Claude to this instance: each token gives a connector URL that can
// read and edit this instance's contacts. The token is shown once.
function McpTokens({ inst, onTokens }) {
  const [fresh, setFresh] = React.useState(null);
  const [error, setError] = React.useState('');
  const tokens = inst.tokens || [];

  async function create() {
    const name = window.prompt('Name this connection (e.g. "Jose - Claude")');
    if (name === null) return;
    setError('');
    try {
      const row = await crm('create_token', { instance_id: inst.id, name });
      setFresh(row);
      const { token, ...rest } = row;
      onTokens((list) => [...list, rest]);
    } catch (err) { setError(err.message); }
  }

  async function revoke(t) {
    if (!window.confirm(`Revoke "${t.name || 'unnamed'}"? Claude connected with it will stop working immediately.`)) return;
    try {
      await crm('delete_token', { id: t.id });
      onTokens((list) => list.filter((x) => x.id !== t.id));
      if (fresh?.id === t.id) setFresh(null);
    } catch (err) { setError(err.message); }
  }

  return (
    <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid var(--border-hair)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ flex: 1, fontWeight: 600, fontSize: 14 }}>Claude connections (MCP)</div>
        <button style={btn} onClick={create}>New connection</button>
      </div>
      {fresh && (
        <div style={{ marginTop: 10, padding: 12, background: 'var(--paper-100)', borderRadius: 'var(--radius-1)', fontSize: 13 }}>
          <div style={{ marginBottom: 6 }}>Copy this now; it will not be shown again. In Claude: Settings → Connectors → Add custom connector, name it <strong>Loogo Labs CRM</strong>, and paste:</div>
          <code style={{ display: 'block', wordBreak: 'break-all', fontFamily: 'var(--font-mono)', fontSize: 12, userSelect: 'all' }}>{CRM_URL}/mcp/{fresh.token}</code>
          <button style={{ ...btn, marginTop: 8, padding: '4px 10px' }} onClick={() => navigator.clipboard?.writeText(`${CRM_URL}/mcp/${fresh.token}`)}>Copy URL</button>{' '}
          <button style={{ ...btn, marginTop: 8, padding: '4px 10px' }} onClick={() => setFresh(null)}>Done</button>
        </div>
      )}
      {tokens.length === 0
        ? <div style={{ fontSize: 13, color: 'var(--ink-400)', marginTop: 6 }}>No connections yet.</div>
        : tokens.map((t) => (
          <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, padding: '8px 0', borderBottom: '1px solid var(--border-hair)' }}>
            <div style={{ flex: 1 }}>{t.name || 'Unnamed'}
              <div style={{ color: 'var(--ink-400)' }}>Created {new Date(t.created_at).toLocaleDateString()} · {t.last_used_at ? `last used ${new Date(t.last_used_at).toLocaleString()}` : 'never used'}</div>
            </div>
            <button style={{ ...btn, padding: '4px 10px', color: '#B42318' }} onClick={() => revoke(t)}>Revoke</button>
          </div>
        ))}
      {error && <div style={{ color: '#B42318', fontSize: 13, marginTop: 8 }}>{error}</div>}
    </div>
  );
}

function NewUser({ instanceId, onCreated, onCancel }) {
  const [f, setF] = React.useState({ name: '', email: '', password: '', role: 'member' });
  const [error, setError] = React.useState('');
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setError('');
    try { onCreated(await crm('create_user', { instance_id: instanceId, ...f })); } catch (err) { setError(err.message); }
  }

  return (
    <form onSubmit={submit} style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', marginTop: 12, alignItems: 'end' }}>
      <div><label style={label}>Name</label><input style={inputStyle} value={f.name} onChange={set('name')} /></div>
      <div><label style={label}>Email</label><input style={inputStyle} type="email" value={f.email} onChange={set('email')} required /></div>
      <div><label style={label}>Password (10+)</label><input style={inputStyle} type="text" value={f.password} onChange={set('password')} required minLength={10} autoComplete="off" /></div>
      <div><label style={label}>Role</label>
        <select style={inputStyle} value={f.role} onChange={set('role')}><option value="member">Member</option><option value="owner">Owner</option></select>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button style={btnPrimary}>Add</button>
        <button type="button" style={btn} onClick={onCancel}>Cancel</button>
      </div>
      {error && <div style={{ gridColumn: '1 / -1', color: '#B42318', fontSize: 13 }}>{error}</div>}
    </form>
  );
}
