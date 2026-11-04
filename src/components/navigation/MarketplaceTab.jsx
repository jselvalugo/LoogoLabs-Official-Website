import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { SquaresFour } from '@phosphor-icons/react';
import { marketplaceEnabled } from '../../lib/marketplace';
import { pathForPage } from '../../lib/seo';

// Static tab pinned to the right edge of every page in the main site shell.
// Hidden until the marketplace launches (see marketplaceEnabled), and only
// rendered after mount so the pre-rendered HTML never contains it.
function MarketplaceTab({ active, onNavigate }) {
  const [show, setShow] = React.useState(false);
  const reduce = useReducedMotion();
  // On phones the nudge shrinks to its icon while the visitor scrolls down and
  // opens back up when they scroll up or reach the top.
  const [compact, setCompact] = React.useState(false);
  React.useEffect(() => { setShow(marketplaceEnabled()); }, []);
  React.useEffect(() => {
    if (!show) return undefined;
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - last) < 8) return;
      setCompact(y > 120 && y > last);
      last = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [show]);
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
