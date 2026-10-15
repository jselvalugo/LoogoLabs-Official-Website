import React from 'react';

const SEEN_KEY = 'll-welcome-seen';
const DURATION_MS = 2600;

// Plays once per browser session on a visitor's first page: the "L" monogram
// draws in, the welcome line rises under it, then the whole veil lifts away.
// Mounted in its own root (see main.jsx) so it never touches hydration.
export default function WelcomeIntro() {
  const [phase, setPhase] = React.useState('hidden');

  React.useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem(SEEN_KEY) === '1'; } catch {}
    if (seen || window.location.pathname.startsWith('/admin')) return;
    try { sessionStorage.setItem(SEEN_KEY, '1'); } catch {}

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setPhase('in');
    const leave = setTimeout(() => setPhase('out'), reduced ? 900 : DURATION_MS);
    const done = setTimeout(() => setPhase('hidden'), (reduced ? 900 : DURATION_MS) + 700);
    return () => { clearTimeout(leave); clearTimeout(done); };
  }, []);

  if (phase === 'hidden') return null;
  const es = window.location.pathname.startsWith('/es');

  return (
    <div
      className={`ll-welcome ll-welcome--${phase}`}
      role="status"
      aria-live="polite"
      onClick={() => setPhase('out')}
    >
      <div className="ll-welcome-inner">
        <svg className="ll-welcome-mark" viewBox="0 0 96 96" aria-hidden="true">
          <rect className="ll-welcome-frame" x="3" y="3" width="90" height="90" rx="18" pathLength="1" />
          <path className="ll-welcome-letter" d="M36 22 V72 H64" pathLength="1" />
        </svg>
        <p className="ll-welcome-title">{es ? 'Bienvenido a Loogo Labs' : 'Welcome to Loogo Labs'}</p>
        <p className="ll-welcome-sub">{es ? 'Nos alegra que estés aquí.' : "We're glad you're here."}</p>
      </div>
    </div>
  );
}
