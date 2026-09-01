import React from 'react';
import { isLoggedIn, logout } from '../../lib/identity';
import Login from './Login';
import BlogAdmin from './BlogAdmin';
import Analytics from './Analytics';

const NAV = [
  { id: 'posts', label: 'Posts' },
  { id: 'analytics', label: 'Analytics' },
];

export default function Admin() {
  const [authed, setAuthed] = React.useState(isLoggedIn());
  const [subpage, setSubpage] = React.useState('posts');

  if (!authed) return <Login onLogin={() => setAuthed(true)} />;

  function handleLogout() {
    logout();
    setAuthed(false);
  }

  return (
    <div className="ll-admin-shell" style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--paper-100)', fontFamily: 'var(--font-body)' }}>
      <aside className="ll-admin-sidebar" style={{ width: 220, background: 'var(--ink-900)', color: 'var(--paper-100)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div className="ll-admin-sidebar-brand" style={{ padding: '24px 20px 20px', borderBottom: '1px solid rgba(216,211,198,0.10)' }}>
          <div style={{ fontWeight: 700, fontSize: 18, letterSpacing: '-0.02em' }}>
            Loogo Labs<span style={{ color: 'var(--cyan-500)' }}>.</span>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-400)', marginTop: 3 }}>
            Admin
          </div>
        </div>

        <nav className="ll-admin-nav">
          {NAV.map(({ id, label }) => {
            const active = subpage === id;
            return (
              <button key={id} onClick={() => setSubpage(id)}
                className="ll-admin-nav-item"
                style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 20px',
                  background: active ? 'rgba(216,211,198,0.08)' : 'transparent',
                  border: 'none', borderLeft: `2px solid ${active ? 'var(--cyan-500)' : 'transparent'}`,
                  cursor: 'pointer', color: active ? 'var(--paper-100)' : 'var(--ink-300)',
                  fontSize: 14, fontFamily: 'var(--font-body)', fontWeight: active ? 500 : 400, whiteSpace: 'nowrap' }}>
                {label}
              </button>
            );
          })}
        </nav>

        <div className="ll-admin-sidebar-footer" style={{ padding: '16px 20px', borderTop: '1px solid rgba(216,211,198,0.10)' }}>
          <button onClick={handleLogout}
            style={{ fontSize: 13, color: 'var(--ink-400)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'var(--font-body)' }}>
            Sign out
          </button>
        </div>
      </aside>

      <main className="ll-admin-main" style={{ flex: 1, minWidth: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {subpage === 'posts' && <BlogAdmin />}
        {subpage === 'analytics' && <Analytics />}
      </main>
    </div>
  );
}
