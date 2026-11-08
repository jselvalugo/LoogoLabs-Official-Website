import React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { SITE, pathForPage } from '../../lib/seo';
import { LangToggle, useHref, useLang } from '../../lib/i18n';
import { AmbientShape } from '../brand/Morph';

const LABELS = {
  en: { Mission: 'What we do', Company: 'Who we serve', LoogoNews: 'AI & marketing', AIVoice: 'AI Voice', Packages: 'Packaged Services', BrandPartners: 'Partner with us' },
  es: { Home: 'Inicio', Mission: 'Qué hacemos', Company: 'A quién servimos', LoogoNews: 'IA y marketing', AIVoice: 'Voz con IA', Packages: 'Paquetes de servicios', BrandPartners: 'Asóciate con nosotros' },
};

const EASE = [0.32, 0.72, 0, 1];

/*
  Nav: a full-width bar at the top of the page that detaches into a floating
  capsule once the page scrolls. A highlight slides between links on hover
  and rests on the current page. On phones the burger opens a full-screen
  menu with large staggered links.
*/
function NavBar({ items = [], active, onNavigate, cta, feature, style, overHero = false, home = false }) {
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [onHero, setOnHero] = React.useState(overHero);
  const [hover, setHover] = React.useState(null);
  const [mounted, setMounted] = React.useState(false);
  const reduce = useReducedMotion();
  const lang = useLang();
  const toHref = useHref();
  const label = it => LABELS[lang][it] || it;

  React.useEffect(() => { setMounted(true); }, []);

  React.useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      if (overHero) {
        const hero = document.querySelector('.hm-hero');
        setOnHero(hero ? hero.getBoundingClientRect().bottom > 72 : false);
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [overHero]);

  React.useEffect(() => {
    if (!open) return undefined;
    const onKey = e => { if (e.key === 'Escape') setOpen(false); };
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey); };
  }, [open]);

  function handleNav(item) { setOpen(false); onNavigate && onNavigate(item); }

  const links = [...items.map(it => ({ key: it, page: it, label: label(it) })), ...(feature ? [{ key: feature.page, page: feature.page, label: feature.label }] : [])];
  const lit = hover ?? active;
  const dark = overHero && onHero && !scrolled;
  const cls = ['ll-nav', home ? 'll-nav--home' : '', scrolled ? 'll-nav--floating' : '', dark ? 'll-nav--dark' : '', open ? 'll-nav--open' : ''].filter(Boolean).join(' ');

  return (
    <>
      <header className={cls} style={style}>
        <div className="ll-nav__bar">
          <a href={toHref(pathForPage('Home'))} aria-label="Loogo Labs, home" className="ll-nav__logo"
            onClick={e => { e.preventDefault(); handleNav('Home'); }}>
            <img src="/logo-horizontal.svg" alt="Loogo Labs" width="156" height="40" />
          </a>

          <nav className="ll-nav-links" aria-label="Primary" onMouseLeave={() => setHover(null)}>
            {links.map(l => {
              const on = l.page === active;
              return (
                <a key={l.key} href={toHref(pathForPage(l.page))} aria-current={on ? 'page' : undefined}
                  className={`ll-nav__link${on ? ' on' : ''}`}
                  onMouseEnter={() => setHover(l.page)} onFocus={() => setHover(l.page)}
                  onClick={e => { e.preventDefault(); handleNav(l.page); }}>
                  {mounted && !reduce && lit === l.page && (
                    <motion.span layoutId="ll-nav-pill" className="ll-nav__pill" transition={{ type: 'spring', stiffness: 420, damping: 36, mass: 0.6 }} />
                  )}
                  {(!mounted || reduce) && on && <span className="ll-nav__pill" />}
                  <span className="ll-nav__text">{l.label}</span>
                </a>
              );
            })}
          </nav>

          <div className="ll-nav__right">
            <LangToggle className="ll-lang--bar" />
            <a href={`tel:${SITE.tel}`} className="ll-nav__phone">{SITE.phone}</a>
            <div className="ll-cta-desktop">{cta}</div>
            <button className={`ll-nav-burger${open ? ' is-open' : ''}`} onClick={() => setOpen(o => !o)}
              aria-label={open ? (lang === 'es' ? 'Cerrar menú' : 'Close menu') : (lang === 'es' ? 'Abrir menú' : 'Open menu')}
              aria-expanded={open} aria-controls="ll-nav-mobile">
              <span /><span />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div id="ll-nav-mobile" className="ll-menu" role="dialog" aria-modal="true" aria-label={lang === 'es' ? 'Menú' : 'Menu'}
            initial={{ clipPath: 'circle(0% at calc(100% - 44px) 36px)' }}
            animate={{ clipPath: 'circle(150% at calc(100% - 44px) 36px)' }}
            exit={{ clipPath: 'circle(0% at calc(100% - 44px) 36px)' }}
            transition={{ duration: reduce ? 0 : 0.6, ease: EASE }}>
            <div className="ll-menu__bg" aria-hidden="true"><AmbientShape index={0} fill="rgba(243,240,231,0.06)" className="ll-menu__shape" /></div>
            <div className="ll-menu__inner">
              <nav className="ll-menu__links" aria-label="Primary">
                {[{ key: 'Home', page: 'Home', label: lang === 'es' ? 'Inicio' : 'Home' }, ...links].map((l, i) => {
                  const on = l.page === active;
                  return (
                    <motion.a key={l.key} href={toHref(pathForPage(l.page))} aria-current={on ? 'page' : undefined}
                      className={`ll-menu__link${on ? ' on' : ''}`}
                      initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}
                      transition={{ duration: reduce ? 0 : 0.5, ease: EASE, delay: reduce ? 0 : 0.2 + i * 0.06 }}
                      onClick={e => { e.preventDefault(); handleNav(l.page); }}>
                      <span className="ll-menu__num">0{i + 1}</span>{l.label}
                    </motion.a>
                  );
                })}
              </nav>
              <motion.div className="ll-menu__foot" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: reduce ? 0 : 0.55 }}>
                <div className="ll-menu__cta">{cta}</div>
                <a href={`tel:${SITE.tel}`} className="ll-menu__phone">
                  {lang === 'es' ? 'Llámanos' : 'Call us'} · {SITE.phone}
                </a>
                <div className="ll-menu__meta">
                  <span>Orlando, Florida</span>
                  <LangToggle className="ll-lang--menu" />
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default NavBar;
