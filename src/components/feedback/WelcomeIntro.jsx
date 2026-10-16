import React from 'react';

const SEEN_KEY = 'll-welcome-seen';
const BOOT_MS = 3400;
const EXIT_MS = 900;
// If nobody swipes, the veil lifts on its own this long after the prompt shows.
const AUTO_ENTER_MS = 2500;

// The four quadrants of the monogram, as clip-path insets on the square mark.
const TILES = ['tl', 'tr', 'bl', 'br'];

// Plays once per browser session on a visitor's first page: the monogram's four
// tiles assemble out of a scanning grid, then the visitor swipes up (or scrolls,
// presses a key, or taps) to lift the veil and enter the site. Mounted in its
// own root (see main.jsx) so it never touches hydration.
export default function WelcomeIntro() {
  const [phase, setPhase] = React.useState('hidden');
  const phaseRef = React.useRef(phase);
  phaseRef.current = phase;

  React.useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem(SEEN_KEY) === '1'; } catch {}
    if (seen || window.location.pathname.startsWith('/admin')) return;
    try { sessionStorage.setItem(SEEN_KEY, '1'); } catch {}

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setPhase('boot');
    const t = setTimeout(() => setPhase((p) => (p === 'boot' ? 'ready' : p)), reduced ? 300 : BOOT_MS);
    return () => clearTimeout(t);
  }, []);

  const enter = React.useCallback(() => {
    if (phaseRef.current === 'hidden' || phaseRef.current === 'out') return;
    setPhase('out');
    setTimeout(() => setPhase('hidden'), EXIT_MS);
  }, []);

  // While the veil is up the page behind it must not scroll; any upward swipe,
  // downward wheel, or enter-ish key lifts it.
  React.useEffect(() => {
    if (phase === 'hidden') return;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = 'hidden';

    let startY = null;
    const onTouchStart = (e) => { startY = e.touches[0].clientY; };
    const onTouchMove = (e) => {
      e.preventDefault();
      if (startY !== null && startY - e.touches[0].clientY > 50) { startY = null; enter(); }
    };
    const onWheel = (e) => { e.preventDefault(); if (e.deltaY > 20) enter(); };
    const onKey = (e) => {
      if (['ArrowUp', 'ArrowDown', 'PageDown', 'Enter', ' ', 'Escape'].includes(e.key)) { e.preventDefault(); enter(); }
    };
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKey);
    return () => {
      html.style.overflow = prev;
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKey);
    };
  }, [phase === 'hidden', enter]);

  React.useEffect(() => {
    if (phase !== 'ready') return;
    const t = setTimeout(enter, AUTO_ENTER_MS);
    return () => clearTimeout(t);
  }, [phase, enter]);

  if (phase === 'hidden') return null;
  const es = window.location.pathname.startsWith('/es');

  return (
    <div className={`ll-welcome ll-welcome--${phase}`} role="dialog" aria-label={es ? 'Bienvenido a Loogo Labs' : 'Welcome to Loogo Labs'}>
      <div className="ll-welcome-grid" aria-hidden="true" />
      <div className="ll-welcome-scan" aria-hidden="true" />
      <div className="ll-welcome-stage">
        <div className="ll-welcome-mark" aria-hidden="true">
          <span className="ll-welcome-ring" />
          <span className="ll-welcome-ring ll-welcome-ring--2" />
          {TILES.map((t) => <span key={t} className={`ll-welcome-tile ll-welcome-tile--${t}`} />)}
          <span className="ll-welcome-tile ll-welcome-tile--ghost" />
          <span className="ll-welcome-sheen" />
        </div>
      </div>
      <button type="button" className="ll-welcome-enter" onClick={enter}>
        <span className="ll-welcome-chevrons" aria-hidden="true"><i /><i /></span>
        {es ? 'Desliza hacia arriba para entrar' : 'Swipe up to enter'}
      </button>
    </div>
  );
}
