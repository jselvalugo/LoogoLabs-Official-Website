import React from 'react';
import { pathForPage } from '../../lib/seo';

function NavBar({ items = [], active, onNavigate, cta, style }) {
  const [open, setOpen] = React.useState(false);

  function handleNav(item) {
    setOpen(false);
    onNavigate && onNavigate(item);
  }

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 20, height: 56,
      background: 'var(--paper-200)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(38,53,23,0.15)',
      ...style
    }}>
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', height: '100%', padding: '0 24px',
        display: 'flex', alignItems: 'center', gap: 32, position: 'relative' }}>

        {/* Logo — a real link so crawlers see a route back to the homepage */}
        <a href={pathForPage('Home')} aria-label="Loogo Labs — home"
          onClick={e => { e.preventDefault(); handleNav('Home'); }}
          style={{ display: 'flex', flexShrink: 0 }}>
          <img
            src="/logo.png"
            alt="Loogo Labs"
            width="120"
            height="36"
            style={{ height: 36, width: 'auto', cursor: 'pointer' }}
          />
        </a>

        <nav className="ll-nav-links">
          {items.map(it => {
            const on = it === active;
            return (
              <a key={it} href={pathForPage(it)} aria-current={on ? 'page' : undefined}
                onClick={e => { e.preventDefault(); handleNav(it); }}
                style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase',
                  textDecoration: 'none', paddingBottom: 2,
                  color: on ? 'var(--ink-900)' : 'var(--ink-500)',
                  borderBottom: '2px solid ' + (on ? 'var(--ink-700)' : 'transparent') }}>{it}</a>
            );
          })}
        </nav>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'contents' }} className="ll-cta-desktop">
            {cta}
          </div>
          <button className="ll-nav-burger" onClick={() => setOpen(o => !o)} aria-label="Menu"
            style={{ color: 'var(--ink-700)' }}>
            {open
              ? <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
              : <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
            }
          </button>
        </div>

        <div className={`ll-nav-mobile${open ? ' open' : ''}`}
          style={{ background: 'var(--paper-200)', borderBottom: '1px solid rgba(38,53,23,0.15)' }}>
          {items.map(it => (
            <a key={it} href={pathForPage(it)} aria-current={it === active ? 'page' : undefined}
              onClick={e => { e.preventDefault(); handleNav(it); }}
              style={{ fontFamily: 'var(--font-mono)', fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase',
                textDecoration: 'none', color: it === active ? 'var(--ink-900)' : 'var(--ink-500)',
                padding: '12px 0', borderBottom: '1px solid rgba(38,53,23,0.08)' }}>{it}</a>
          ))}
          <div style={{ paddingTop: 16 }}>{cta}</div>
        </div>
      </div>
    </header>
  );
}

export default NavBar;
