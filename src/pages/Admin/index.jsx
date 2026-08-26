import React from 'react';
import { isLoggedIn, logout } from '../../lib/identity';
import Login from './Login';
import Dashboard from './Dashboard';
import Leads from './Leads';
import BlogAdmin from './BlogAdmin';

const NAV = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'leads', label: 'Leads' },
  { id: 'blog', label: 'Signal Blog' },
];

export default function Admin() {
  const [authed, setAuthed] = React.useState(isLoggedIn());
  const [subpage, setSubpage] = React.useState('dashboard');

  if (!authed) return <Login onLogin={() => setAuthed(true)} />;

  function handleLogout() {
    logout();
    setAuthed(false);
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--paper-100)', fontFamily: 'var(--font-body)' }}>
      <aside style={{ width: 220, background: 'var(--ink-900)', color: 'var(--paper-100)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ fontWeight: 700, fontSize: 18, letterSpacing: '-0.02em' }}>
            Loogo Labs<span style={{ color: 'var(--cyan-500)' }}>.</span>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-400)', marginTop: 3 }}>
            Admin
          </div>
        </div>

        <nav style={{ flex: 1, padding: '10px 0' }}>
          {NAV.map(({ id, label }) => {
            const active = subpage === id;
            return (
              <button key={id} onClick={() => setSubpage(id)}
                style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 20px',
                  background: active ? 'rgba(255,255,255,0.06)' : 'transparent',
                  border: 'none', borderLeft: `2px solid ${active ? 'var(--cyan-500)' : 'transparent'}`,
                  cursor: 'pointer', color: active ? 'var(--paper-100)' : 'var(--ink-300)',
                  fontSize: 14, fontFamily: 'var(--font-body)', fontWeight: active ? 500 : 400 }}>
                {label}
              </button>
            );
          })}
        </nav>

        <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <button onClick={handleLogout}
            style={{ fontSize: 13, color: 'var(--ink-400)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'var(--font-body)' }}>
            Sign out
          </button>
        </div>
      </aside>

      <main style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {subpage === 'dashboard' && <Dashboard onViewLeads={() => setSubpage('leads')} />}
        {subpage === 'leads' && <Leads />}
        {subpage === 'blog' && <BlogAdmin />}
      </main>
    </div>
  );
}
