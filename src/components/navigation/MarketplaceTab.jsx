import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { SquaresFour } from '@phosphor-icons/react';
import { marketplaceEnabled } from '../../lib/marketplace';
import { pathForPage } from '../../lib/seo';

// Static tab pinned to the right edge of every page in the main site shell.
// Hidden until the marketplace launches (see marketplaceEnabled), and only
// rendered after mount so the pre-rendered HTML never contains it.
function MarketplaceTab({ active, page, onNavigate }) {
  const [show, setShow] = React.useState(false);
  const reduce = useReducedMotion();
  // On phones the nudge shrinks to its icon while the visitor scrolls down and
  // opens back up when they scroll up or reach the top.
  const [compact, setCompact] = React.useState(false);
  React.useEffect(() => { setShow(marketplaceEnabled()); }, []);
  React.useEffect(() => {
    if (!show) return undefined;
    let last = window.scrollY;
    // Home on phones: stay an icon while the hero is on screen so the chip
    // never sits on top of the founder photo in the hero's bottom-right corner.
    const overHero = () => {
      if (!window.matchMedia('(max-width: 720px)').matches) return false;
      const hero = document.querySelector('.hm-hero');
      return !!hero && hero.getBoundingClientRect().bottom > window.innerHeight - 80;
    };
    setCompact(overHero());
    // Page changes animate in, so look again once the new page has rendered.
    const recheck = setTimeout(() => setCompact(overHero()), 500);
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - last) < 8) return;
      setCompact(overHero() || (y > 120 && y > last));
      last = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { clearTimeout(recheck); window.removeEventListener('scroll', onScroll); };
  }, [show, page]);
  if (!show) return null;

  return (
    <motion.a href={pathForPage('Marketplace')} className={`mk-tab${active ? ' is-active' : ''}${compact ? ' is-compact' : ''}`}
      aria-label="Claude Skills marketplace" aria-current={active ? 'page' : undefined}
      onClick={(e) => { e.preventDefault(); onNavigate('Marketplace'); }}
      initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1], delay: 0.8 }}>
      <span className="mk-tab__icon"><SquaresFour size={18} weight="light" aria-hidden="true" /></span>
      <span className="mk-tab__dot" aria-hidden="true" />
      <span className="mk-tab__label">Claude Skills</span>
    </motion.a>
  );
}

export default MarketplaceTab;
