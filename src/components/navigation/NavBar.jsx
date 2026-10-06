import React from 'react';
import { pathForPage } from '../../lib/seo';

function NavBar({ items = [], active, onNavigate, cta, feature, style }) {
  const [open, setOpen] = React.useState(false);

  // Close on Escape and stop the page scrolling behind the open menu.
  React.useEffect(() => {
    if (!open) return undefined;
    const onKey = e => { if (e.key === 'Escape') setOpen(false); };
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey); };
  }, [open]);

  function handleNav(item) {
    setOpen(false);
    onNavigate && onNavigate(item);
  }

  return (
    <>
    <header style={{
      position: 'sticky', top: 0, zIndex: 20, height: 56,
      background: 'var(--ink-900)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-hair-inverse)',
      ...style
    }}>
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', height: '100%', padding: '0 24px',
        display: 'flex', alignItems: 'center', gap: 32, position: 'relative' }}>

        {/* Logo — a real link so crawlers see a route back to the homepage. The
            mark is solid dark green, so it needs a light chip behind it here
            to stay visible against the dark bar. */}
        <a href={pathForPage('Home')} aria-label="Loogo Labs — home"
          onClick={e => { e.preventDefault(); handleNav('Home'); }}
          style={{ display: 'flex', flexShrink: 0, background: 'var(--paper-000)', padding: 5, borderRadius: 'var(--radius-1)' }}>
          <img
            src="/logo.png"
            alt="Loogo Labs"
            width="120"
            height="36"
            style={{ height: 28, width: 'auto', cursor: 'pointer', display: 'block' }}
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
                  color: on ? 'var(--paper-100)' : 'var(--ink-300)',
                  borderBottom: '2px solid ' + (on ? 'var(--cyan-500)' : 'transparent') }}>{it}</a>
            );
          })}
          {feature && (
            <a href={pathForPage(feature.page)} aria-current={active === feature.page ? 'page' : undefined}
              className="ll-nav-feature" onClick={e => { e.preventDefault(); handleNav(feature.page); }}>
              <span className="ll-nav-feature-dot" aria-hidden="true" />
              {feature.label}
              {feature.badge && <span className="ll-nav-feature-badge">{feature.badge}</span>}
            </a>
          )}
        </nav>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'contents' }} className="ll-cta-desktop">
            {cta}
          </div>
          <button className="ll-nav-burger" onClick={() => setOpen(o => !o)} aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open} aria-controls="ll-nav-mobile"
            style={{ color: 'var(--paper-100)' }}>
            {open
              ? <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
              : <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
            }
          </button>
        </div>

        <div id="ll-nav-mobile" className={`ll-nav-mobile${open ? ' open' : ''}`}>
                    {items.map((it, i) => {
            const on = it === active;
            return (
              <a key={it} href={pathForPage(it)} aria-current={on ? 'page' : undefined}
                className={`ll-nav-mobile-link${on ? ' on' : ''}`}
                style={{ transitionDelay: open ? `${60 + i * 40}ms` : '0ms' }}
                onClick={e => { e.preventDefault(); handleNav(it); }}>
                <span className="ll-nav-mobile-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="ll-nav-mobile-label">{it}</span>
                <span className="ll-nav-mobile-arrow" aria-hidden="true">→</span>
              </a>
            );
          })}
          {feature && (
            <a href={pathForPage(feature.page)} className="ll-nav-feature ll-nav-feature-mobile"
              onClick={e => { e.preventDefault(); handleNav(feature.page); }}>
              <span className="ll-nav-feature-dot" aria-hidden="true" />
              {feature.label}
              {feature.badge && <span className="ll-nav-feature-badge">{feature.badge}</span>}
            </a>
          )}
          <div className="ll-nav-mobile-cta">{cta}</div>
        </div>
      </div>
    </header>
    <div className={`ll-nav-scrim${open ? ' open' : ''}`} aria-hidden="true" onClick={() => setOpen(false)} />
    </>
  );
}

export default NavBar;
