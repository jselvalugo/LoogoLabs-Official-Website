// Engaged-time session tracking for the admin Analytics page.
//
// A session is one browser tab (its id lives in sessionStorage), and only
// engaged time counts: the tab is visible and the visitor moved, scrolled,
// clicked or typed within the last minute. An open-but-ignored tab stops
// accruing time. Totals are sent to track-session every 15s while they change,
// and once more via sendBeacon when the tab is hidden or closed.
//
// Runs only with Analytics cookie consent. If consent is granted later in the
// visit, tracking starts from that point.

import { getConsent, hasConsent } from './cookieConsent';

const ENDPOINT = '/.netlify/functions/track-session';
const STATE_KEY = 'll_session';
const TICK_MS = 1000;
const IDLE_MS = 60 * 1000;
const SEND_EVERY_MS = 15 * 1000;

let started = false;

const uuid = () => (crypto.randomUUID
  ? crypto.randomUUID()
  : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  }));

const isTracked = (path) => !path.startsWith('/admin');

function referrerHost() {
  try {
    if (!document.referrer) return null;
    const host = new URL(document.referrer).hostname.replace(/^www\./, '');
    return host === window.location.hostname.replace(/^www\./, '') ? null : host;
  } catch {
    return null;
  }
}

function device() {
  const w = Math.min(window.screen?.width || window.innerWidth, window.innerWidth);
  return w < 640 ? 'mobile' : w < 1024 ? 'tablet' : 'desktop';
}

function loadState() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STATE_KEY) || 'null');
    if (saved?.id) return saved;
  } catch { /* storage blocked — the session just lives in memory */ }
  return {
    id: uuid(),
    active_seconds: 0,
    page_count: 0,
    landing_path: window.location.pathname,
    paths: {},
    referrer: referrerHost(),
    device: device(),
  };
}

function start() {
  if (started || !hasConsent('analytics')) return;
  started = true;

  const state = loadState();
  let lastPath = null;
  let lastActivity = Date.now();
  let lastTick = Date.now();
  let lastSent = 0;
  let dirty = true;

  const save = () => { try { sessionStorage.setItem(STATE_KEY, JSON.stringify(state)); } catch { /* ignore */ } };

  const send = (beacon = false) => {
    if (!dirty || !hasConsent('analytics')) return;
    const body = JSON.stringify(state);
    dirty = false;
    lastSent = Date.now();
    if (beacon && navigator.sendBeacon) {
      navigator.sendBeacon(ENDPOINT, new Blob([body], { type: 'text/plain' }));
    } else {
      fetch(ENDPOINT, { method: 'POST', body, keepalive: true }).catch(() => { dirty = true; });
    }
  };

  const tick = () => {
    const now = Date.now();
    const elapsed = Math.min(now - lastTick, 5000) / 1000; // cap gaps from throttled/sleeping tabs
    lastTick = now;
    const path = window.location.pathname;

    // The app routes with pushState, so a path change is a page view.
    if (path !== lastPath) {
      lastPath = path;
      if (isTracked(path)) {
        state.page_count += 1;
        dirty = true;
      }
    }

    const engaged = document.visibilityState === 'visible' && now - lastActivity < IDLE_MS;
    if (engaged && isTracked(path)) {
      state.active_seconds += elapsed;
      state.paths[path] = (state.paths[path] || 0) + elapsed;
      dirty = true;
    }
    save();
    if (now - lastSent >= SEND_EVERY_MS && state.page_count > 0) send();
  };

  const activity = () => { lastActivity = Date.now(); };
  ['pointerdown', 'pointermove', 'keydown', 'scroll', 'wheel', 'touchstart'].forEach((e) =>
    window.addEventListener(e, activity, { passive: true, capture: true }));

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') { tick(); send(true); } else { lastTick = Date.now(); activity(); }
  });
  window.addEventListener('pagehide', () => { tick(); send(true); });

  setInterval(tick, TICK_MS);
  tick();
}

export function startSessionTracking() {
  if (typeof window === 'undefined') return;
  start();
  // Visitors who accept Analytics mid-visit start being tracked from then on.
  window.addEventListener('ll:consent-change', () => { if (getConsent()?.analytics) start(); });
}
