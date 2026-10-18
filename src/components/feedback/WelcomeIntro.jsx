import React from 'react';
import { routeForPath } from '../../lib/seo';
import { NICHE_BY_PAGE } from '../../lib/nicheQuizzes';

// Ad funnels skip the intro: paid traffic should land straight on the offer.
const FUNNEL_PAGES = new Set(['AIReceptionist', 'ReputationAutopilot', 'BrandingFunnel', 'BrandDesign', 'Consulting']);
const isFunnel = (page) => FUNNEL_PAGES.has(page) || Boolean(NICHE_BY_PAGE[page]);

const SEEN_KEY = 'll-welcome-seen';
const HOLD_MS = 1300;
const EXIT_MS = 500;

// The four quadrants of the monogram, as clip-path insets on the square mark.
const TILES = ['tl', 'tr', 'bl', 'br'];

// Plays once per browser session on a visitor's first page: the monogram's four
// tiles settle into place, a thin progress line runs, and the veil fades away on
// its own. Any click, scroll, or key skips it. Mounted in its own root (see
// main.jsx) so it never touches hydration.
export default function WelcomeIntro() {
  const [phase, setPhase] = React.useState('hidden');
  const phaseRef = React.useRef(phase);
  phaseRef.current = phase;

  const leave = React.useCallback(() => {
    if (phaseRef.current !== 'in') return;
    setPhase('out');
    setTimeout(() => setPhase('hidden'), EXIT_MS);
  }, []);

  React.useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem(SEEN_KEY) === '1'; } catch {}
    const { page } = routeForPath(window.location.pathname);
    if (seen || page === 'Admin' || isFunnel(page)) return;
    try { sessionStorage.setItem(SEEN_KEY, '1'); } catch {}

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    phaseRef.current = 'in';
    setPhase('in');
    const t = setTimeout(leave, reduced ? 400 : HOLD_MS);
    return () => clearTimeout(t);
  }, [leave]);

  // Any interaction skips straight to the site.
  React.useEffect(() => {
    if (phase !== 'in') return;
    const events = ['wheel', 'touchstart', 'keydown', 'pointerdown'];
    events.forEach((e) => window.addEventListener(e, leave, { passive: true }));
    return () => events.forEach((e) => window.removeEventListener(e, leave));
  }, [phase, leave]);

  if (phase === 'hidden') return null;
  const es = window.location.pathname.startsWith('/es');

  return (
    <div className={`ll-welcome ll-welcome--${phase}`} role="presentation" aria-label={es ? 'Bienvenido a Loogo Labs' : 'Welcome to Loogo Labs'}>
      <div className="ll-welcome-stage">
        <div className="ll-welcome-mark" aria-hidden="true">
          {TILES.map((t) => <span key={t} className={`ll-welcome-tile ll-welcome-tile--${t}`} />)}
        </div>
        <span className="ll-welcome-bar" aria-hidden="true" />
      </div>
    </div>
  );
}
