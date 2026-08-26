import React from 'react';
import { login } from '../../lib/identity';

export default function Login({ onLogin }) {
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(password);
      onLogin();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--ink-900)' }}>
      <div style={{ width: 360 }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontWeight: 700, fontSize: 22, letterSpacing: '-0.02em', color: 'var(--paper-100)' }}>
            Loogo Labs<span style={{ color: 'var(--cyan-500)' }}>.</span>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-400)', marginTop: 4 }}>
            Admin
          </div>
        </div>

        <div style={{ background: 'var(--paper-000)', borderRadius: 'var(--radius-2)', padding: '32px 28px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 20 }}>
            <div style={{ display: 'grid', gap: 6 }}>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-600)' }}>
                Password
              </label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                required autoFocus style={inputStyle} />
            </div>
            {error && <p style={{ margin: 0, fontSize: 13, color: 'var(--status-danger)' }}>{error}</p>}
            <button type="submit" disabled={loading} style={btnStyle(loading)}>
              {loading ? 'Signing in…' : 'Sign in →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  padding: '10px 12px', border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-2)',
  fontSize: 15, fontFamily: 'var(--font-body)', color: 'var(--ink-900)', background: 'var(--paper-000)',
  width: '100%', boxSizing: 'border-box',
};
const btnStyle = loading => ({
  padding: '11px', background: loading ? 'var(--ink-400)' : 'var(--ink-900)', color: 'var(--paper-100)',
  border: 'none', borderRadius: 'var(--radius-2)', fontSize: 15, fontWeight: 600,
  cursor: loading ? 'default' : 'pointer', fontFamily: 'var(--font-body)',
});
