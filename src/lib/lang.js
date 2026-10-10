// Language ↔ URL helpers, kept free of React so lib/seo.js and the build
// scripts (plain Node) can use them. Spanish pages live under /es.

export const LANGS = ['en', 'es'];
export const ES_PREFIX = '/es';

export const isEsPath = (p) => {
  const s = String(p).toLowerCase();
  return s === ES_PREFIX || s.startsWith(`${ES_PREFIX}/`);
};

/** Language a path belongs to. */
export const langFromPath = (p = '/') => (isEsPath(p) ? 'es' : 'en');

/** The path with any /es prefix removed: '/es/grow' → '/grow', '/es' → '/'. */
export const stripLang = (p = '/') => (isEsPath(p) ? String(p).slice(ES_PREFIX.length) || '/' : p);

/** The path in the given language: ('/grow', 'es') → '/es/grow'. */
export const localizePath = (p, lang) => {
  const base = stripLang(p);
  if (lang !== 'es') return base;
  return base === '/' ? ES_PREFIX : `${ES_PREFIX}${base}`;
};
