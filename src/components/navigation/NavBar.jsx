import React from 'react';
import { pathForPage } from '../../lib/seo';
import { LangToggle, useHref, useLang } from '../../lib/i18n';

const LABELS = {
  en: { AIVoice: 'AI Voice', Packages: 'Packaged Services', BrandPartners: 'Partner with us' },
  es: { Home: 'Inicio', Mission: 'Misión', AIVoice: 'Voz con IA', Packages: 'Paquetes de servicios', BrandPartners: 'Asóciate con nosotros' },
};

function NavBar({ items = [], active, onNavigate, cta, feature, style, overHero = false }) {
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [onHero, setOnHero] = React.useState(overHero);

  // Compact after the first scroll; while the forest hero is under the bar,
  // the bar goes dark so it reads as part of the hero.
  React.useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      if (overHero) {
        const hero = document.querySelector('.hm-hero');
        setOnHero(hero ? hero.getBoundingClientRect().bottom > 64 : false);
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [overHero]);
  const lang = useLang();
  const toHref = useHref();
  const label = it => LABELS[lang][it] || it;

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
    <header className={`ll-nav${scrolled ? ' ll-nav--scrolled' : ''}${overHero && onHero ? ' ll-nav--hero' : ''}`} style={style}>
      <div className="ll-nav__bar">

        {/* Logo: a real link so crawlers see a route back to the homepage. The
            mark is solid dark green, so it sits on a cream disc here. */}
        <a href={toHref(pathForPage('Home'))} aria-label="Loogo Labs, home" className="ll-nav__logo"
          onClick={e => { e.preventDefault(); handleNav('Home'); }}>
          <img src="/monogram.png" alt="" width="28" height="28" />
          <span className="ll-nav__name">Loogo Labs</span>
        </a>

        <nav className="ll-nav-links" aria-label="Primary">
          {items.map(it => (
            <a key={it} href={toHref(pathForPage(it))} aria-current={it === active ? 'page' : undefined}
              className="ll-nav__link" onClick={e => { e.preventDefault(); handleNav(it); }}>{label(it)}</a>
          ))}
        </nav>

        <div className="ll-nav__right">
          {feature && (
            <a href={toHref(pathForPage(feature.page))} aria-current={active === feature.page ? 'page' : undefined}
              className="ll-nav-feature ll-nav-feature-desktop" onClick={e => { e.preventDefault(); handleNav(feature.page); }}>
              {feature.label}
              {feature.badge && <span className="ll-nav-feature-badge">{feature.badge}</span>}
            </a>
          )}
          <LangToggle className="ll-lang--bar" />
          <div style={{ display: 'contents' }} className="ll-cta-desktop">
            {cta}
          </div>
          <button className="ll-nav-burger" onClick={() => setOpen(o => !o)} aria-label={open ? (lang === 'es' ? 'Cerrar menú' : 'Close menu') : (lang === 'es' ? 'Abrir menú' : 'Open menu')}
            aria-expanded={open} aria-controls="ll-nav-mobile">
            {open
              ? <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
              : <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M3 7h14M3 13h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
            }
          </button>
        </div>

        <div id="ll-nav-mobile" className={`ll-nav-mobile${open ? ' open' : ''}`}>
                    {items.map((it, i) => {
            const on = it === active;
            return (
              <a key={it} href={toHref(pathForPage(it))} aria-current={on ? 'page' : undefined}
                className={`ll-nav-mobile-link${on ? ' on' : ''}`}
                style={{ transitionDelay: open ? `${60 + i * 40}ms` : '0ms' }}
                onClick={e => { e.preventDefault(); handleNav(it); }}>
                <span className="ll-nav-mobile-label">{label(it)}</span>
                <span className="ll-nav-mobile-arrow" aria-hidden="true">→</span>
              </a>
            );
          })}
          {feature && (
            <a href={toHref(pathForPage(feature.page))} className="ll-nav-feature ll-nav-feature-mobile"
              onClick={e => { e.preventDefault(); handleNav(feature.page); }}>
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
