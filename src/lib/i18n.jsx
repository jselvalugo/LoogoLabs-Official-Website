// Site language (English / Spanish). The URL decides it: every public page has
// a Spanish twin under /es (/grow/kissimmee ↔ /es/grow/kissimmee), pre-rendered
// in Spanish so search engines index it. A small module-level store holds the
// current language so any component can read it without App wiring.
import React from 'react';

import { ES_PREFIX, isEsPath, langFromPath, localizePath, stripLang } from './lang.js';

export { ES_PREFIX, langFromPath, localizePath, stripLang };

const listeners = new Set();
let lang = typeof window !== 'undefined' ? langFromPath(window.location.pathname) : 'en';

/** Build-time renderer only: set the language before rendering a route. */
export function setRenderLang(next) { lang = next; }

export const currentLang = () => lang;

// Called by App whenever the route changes, so the store follows the URL.
export function syncLangToPath(pathname) {
  const next = langFromPath(pathname);
  if (next === lang) return;
  lang = next;
  listeners.forEach((fn) => fn());
}

const subscribe = (fn) => { listeners.add(fn); return () => listeners.delete(fn); };

export function useLang() {
  // The pre-render and the first client render both read the URL's language,
  // so hydration sees the same text the HTML was built with.
  const current = React.useSyncExternalStore(subscribe, () => lang, () => lang);
  React.useEffect(() => { document.documentElement.lang = current; }, [current]);
  return current;
}

/** Pick the string for the current language: pick(lang, { en: '…', es: '…' }). */
export const pick = (l, v) => (v && typeof v === 'object' && 'en' in v ? v[l] ?? v.en : v);

/** Switch language by moving to the same page's URL in the other language. */
export function switchLang(next) {
  if (typeof window === 'undefined' || next === lang) return;
  const { pathname, search, hash } = window.location;
  window.history.pushState({}, '', localizePath(pathname, next) + search + hash);
  // App listens for popstate to re-route; the store follows the new URL.
  window.dispatchEvent(new PopStateEvent('popstate'));
  syncLangToPath(window.location.pathname);
}

// Links across the site are written as English paths. While the visitor is in
// Spanish, point each internal link at its /es twin just before it is followed
// (or opened in a new tab), so browsing never drops back to English.
const SKIP = /^\/(?:assets|fonts|blog|park-supply|admin|\.netlify)(?:\/|$)|\.[a-z0-9]+$/i;
if (typeof document !== 'undefined') {
  const localizeAnchor = (e) => {
    if (lang !== 'es') return;
    const a = e.target.closest?.('a[href]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || !href.startsWith('/') || href.startsWith('//')) return;
    const [path, rest = ''] = href.split(/(?=[?#])/);
    if (isEsPath(path.toLowerCase()) || SKIP.test(path)) return;
    a.setAttribute('href', localizePath(path, 'es') + rest);
  };
  ['click', 'auxclick', 'contextmenu'].forEach((t) => document.addEventListener(t, localizeAnchor, true));
}

// Flags are inline SVG, not emoji: Windows renders flag emoji as plain letters.
const FlagUS = () => (
  <svg viewBox="0 0 30 20" aria-hidden="true" focusable="false" className="ll-flag">
    <rect width="30" height="20" fill="#fff" />
    {[0, 2, 4, 6, 8, 10, 12].map((i) => <rect key={i} y={(i * 20) / 13} width="30" height={20 / 13} fill="#b22234" />)}
    <rect width="12" height={(7 * 20) / 13} fill="#3c3b6e" />
  </svg>
);
const FlagES = () => (
  <svg viewBox="0 0 30 20" aria-hidden="true" focusable="false" className="ll-flag">
    <rect width="30" height="20" fill="#c60b1e" />
    <rect y="5" width="30" height="10" fill="#ffc400" />
  </svg>
);

const OPTIONS = [
  { code: 'en', label: 'EN', name: 'English', Flag: FlagUS },
  { code: 'es', label: 'ES', name: 'Español', Flag: FlagES },
];

/**
 * Language switch. Wide screens get the flag pill (both options visible);
 * phones get a single flag button that opens a small dropdown, so it fits in a
 * crowded header. CSS picks which one shows (see .ll-lang in globals.css).
 */
export function LangToggle({ className = '' }) {
  const current = useLang();
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  const active = OPTIONS.find((o) => o.code === current) ?? OPTIONS[0];

  React.useEffect(() => {
    if (!open) return undefined;
    const close = (e) => { if (e.type === 'keydown' ? e.key === 'Escape' : !ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', close);
    return () => { document.removeEventListener('pointerdown', close); document.removeEventListener('keydown', close); };
  }, [open]);

  const choose = (code) => { setOpen(false); switchLang(code); };

  return (
    <div className={`ll-langsw ${className}`} ref={ref}>
      <div className="ll-lang" role="group" aria-label="Language / Idioma">
        {OPTIONS.map(({ code, label, name, Flag }) => (
          <button key={code} type="button" lang={code} aria-label={name} aria-pressed={current === code}
            className={`ll-lang__opt${current === code ? ' on' : ''}`} onClick={() => choose(code)}>
            <Flag />{label}
          </button>
        ))}
      </div>

      <div className="ll-lang-dd">
        <button type="button" className="ll-lang-dd__btn" aria-haspopup="menu" aria-expanded={open}
          aria-label={`Language: ${active.name}`} onClick={() => setOpen((o) => !o)}>
          <active.Flag />
          <span className="ll-lang-dd__code">{active.label}</span>
          <svg className="ll-lang-dd__chev" viewBox="0 0 12 12" width="10" height="10" aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        {open && (
          <div className="ll-lang-dd__menu" role="menu">
            {OPTIONS.map(({ code, name, Flag }) => (
              <button key={code} type="button" role="menuitemradio" lang={code} aria-checked={current === code}
                className={`ll-lang-dd__item${current === code ? ' on' : ''}`} onClick={() => choose(code)}>
                <Flag /><span>{name}</span>
                {current === code && <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true"><path d="M2.5 6.2 5 8.5l4.5-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
