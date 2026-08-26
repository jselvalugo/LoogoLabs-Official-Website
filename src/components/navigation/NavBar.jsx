import React from 'react';

function NavBar({ items = [], active, onNavigate, cta, tone = 'paper', wordmark = 'Loogo Labs', style }) {
  const inverse = tone === 'inverse';
  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 20, height: 56,
      background: inverse ? 'rgba(11,15,18,0.85)' : 'rgba(245,247,248,0.85)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid ' + (inverse ? 'var(--border-hair-inverse)' : 'var(--border-hair)'), ...style }}>
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', height: '100%', padding: '0 24px',
        display: 'flex', alignItems: 'center', gap: 32 }}>
        <span style={{ fontWeight: 700, fontSize: 18, letterSpacing: '-0.03em', color: inverse ? 'var(--paper-100)' : 'var(--ink-900)' }}>
          {wordmark}<span style={{ color: 'var(--cyan-500)' }}>.</span>
        </span>
        <nav style={{ display: 'flex', gap: 24, marginRight: 'auto' }}>
          {items.map(it => {
            const on = it === active;
            return (
              <a key={it} href="#" onClick={e => { e.preventDefault(); onNavigate && onNavigate(it); }}
                style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase',
                  textDecoration: 'none', paddingBottom: 2,
                  color: on ? (inverse ? 'var(--paper-000)' : 'var(--ink-900)') : (inverse ? 'var(--ink-300)' : 'var(--ink-400)'),
                  borderBottom: '2px solid ' + (on ? 'var(--cyan-500)' : 'transparent') }}>{it}</a>
            );
          })}
        </nav>
        {cta}
      </div>
    </header>
  );
}

export default NavBar;
