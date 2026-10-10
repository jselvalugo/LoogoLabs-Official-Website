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

/** EN | ES pill switch. */
export function LangToggle({ className = '' }) {
  const current = useLang();
  return (
    <div className={`ll-lang ${className}`} role="group" aria-label="Language / Idioma">
      {[['en', 'EN', 'English'], ['es', 'ES', 'Español']].map(([code, label, name]) => (
        <button key={code} type="button" lang={code} aria-label={name} aria-pressed={current === code}
          className={`ll-lang__opt${current === code ? ' on' : ''}`} onClick={() => switchLang(code)}>
          {label}
        </button>
      ))}
    </div>
  );
}
