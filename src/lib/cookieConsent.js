// Cookie consent state, shared by the CookieConsent banner, the Meta Pixel
// loader in index.html, and anything else that needs to check what a visitor
// has agreed to (e.g. BlogPost's view-tracking call). One key, one shape, so
// the banner and the things it gates can never disagree about what was chosen.

const KEY = 'll_cookie_consent';
const VERSION = 1;

export function getConsent() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && parsed.version === VERSION ? parsed : null;
  } catch {
    return null;
  }
}

export function setConsent({ analytics = false, marketing = false } = {}) {
  const consent = {
    version: VERSION,
    necessary: true,
    analytics: !!analytics,
    marketing: !!marketing,
    updatedAt: new Date().toISOString(),
  };
  try {
    window.localStorage.setItem(KEY, JSON.stringify(consent));
  } catch {
    // Private browsing / storage blocked — the banner still works for this
    // page view, it just can't be remembered for the next one.
  }
  try {
    window.dispatchEvent(new CustomEvent('ll:consent-change', { detail: consent }));
  } catch {
    // no-op
  }
  return consent;
}

/** category: 'necessary' | 'analytics' | 'marketing' */
export function hasConsent(category) {
  if (category === 'necessary') return true;
  const consent = getConsent();
  return !!(consent && consent[category]);
}
