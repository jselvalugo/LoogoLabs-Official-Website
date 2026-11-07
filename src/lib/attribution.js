// Where a visitor came from, kept for the whole visit so it can be saved with
// a lead even when they fill in a form a few pages after landing.
//
// The first page view that carries ad tags (utm_* or a click ID) wins; a
// later untagged page view never overwrites it. Stored in sessionStorage, so
// it lasts for the visit (the tab) and nothing is kept across visits.
//
// Also sends the GA4 conversions to Tag Manager's dataLayer, live domain only,
// so localhost and deploy previews never count as leads.
// Same hosts as LIVE_HOSTS in metaEvents.js (kept separate to avoid a circular import).
const isLiveHost = () => typeof window !== 'undefined' && ['www.loogolabs.com', 'loogolabs.com'].includes(window.location.hostname);

const KEY = 'll_attribution';
const PARAMS = [
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
  'fbclid', 'gclid', 'gbraid', 'wbraid', 'msclkid', 'ttclid', 'li_fat_id',
];

function read() {
  try { return JSON.parse(window.sessionStorage.getItem(KEY) || 'null'); } catch { return null; }
}

/** Run once per page load: saves the ad tags from the landing URL. */
export function captureAttribution() {
  if (typeof window === 'undefined') return;
  try {
    const params = new URLSearchParams(window.location.search);
    const tags = {};
    for (const k of PARAMS) {
      const v = params.get(k);
      if (v) tags[k] = v.slice(0, 300);
    }
    // An untagged page view never replaces what the visit already has.
    if (read() && !Object.keys(tags).length) return;
    const ref = document.referrer && !document.referrer.includes(window.location.hostname) ? document.referrer : '';
    window.sessionStorage.setItem(KEY, JSON.stringify({
      tags,
      landing_page: window.location.pathname,
      referrer: ref.slice(0, 300),
      first_seen: new Date().toISOString(),
    }));
  } catch { /* storage blocked: the lead just goes in without attribution */ }
}

/** What to send with a lead (create-lead adds it to the lead's notes). */
export function getAttribution() {
  if (typeof window === 'undefined') return undefined;
  const a = read();
  if (!a) return undefined;
  return { ...a.tags, landing_page: a.landing_page, referrer: a.referrer || undefined };
}

function pushDataLayer(event, params) {
  if (!isLiveHost()) return;
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...params });
  } catch { /* never break a form */ }
}

/** GA4 generate_lead, for every lead form. */
export function gaLead(source, decisionMaker) {
  pushDataLayer('generate_lead', {
    lead_source: source || 'unknown',
    decision_maker: decisionMaker || undefined,
  });
}

/** GA4 book_call_click, for every "Book a call" click. */
export function gaBookCall(params) {
  pushDataLayer('book_call_click', { link_url: params?.link_url, page_path: window.location.pathname });
}
