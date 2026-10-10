// Site language (English / Spanish). A tiny module-level store rather than a
// context provider, so any component can read it without App wiring. The
// pre-render always produces English; the visitor's saved choice is applied on
// the client after hydration (getServerSnapshot keeps the two in step).
import React from 'react';

const KEY = 'll-lang';
const listeners = new Set();
let lang = 'en';

try {
  if (typeof window !== 'undefined' && window.localStorage.getItem(KEY) === 'es') lang = 'es';
} catch { /* storage blocked: stay in English */ }

export function setLang(next) {
  if (next === lang) return;
  lang = next;
  try { window.localStorage.setItem(KEY, next); } catch { /* not persisted */ }
  listeners.forEach((fn) => fn());
}

const subscribe = (fn) => { listeners.add(fn); return () => listeners.delete(fn); };

export function useLang() {
  const current = React.useSyncExternalStore(subscribe, () => lang, () => 'en');
  React.useEffect(() => { document.documentElement.lang = current; }, [current]);
  return current;
}

/** Pick the string for the current language: t({ en: '…', es: '…' }). */
export const pick = (lang, v) => (v && typeof v === 'object' && 'en' in v ? v[lang] ?? v.en : v);

/** EN | ES pill switch. */
export function LangToggle({ className = '' }) {
  const current = useLang();
  return (
    <div className={`ll-lang ${className}`} role="group" aria-label="Language / Idioma">
      {[['en', 'EN', 'English'], ['es', 'ES', 'Español']].map(([code, label, name]) => (
        <button key={code} type="button" lang={code} aria-label={name} aria-pressed={current === code}
          className={`ll-lang__opt${current === code ? ' on' : ''}`} onClick={() => setLang(code)}>
          {label}
        </button>
      ))}
    </div>
  );
}
