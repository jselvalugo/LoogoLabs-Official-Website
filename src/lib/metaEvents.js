// Meta Pixel + Conversions API, sent as one deduplicated event.
//
// Every standard event we care about (Lead, Schedule) goes out twice with the
// same event ID: once from the browser through the pixel, once from our server
// through the Conversions API. Meta counts it once, and the server copy still
// arrives when an ad blocker or iOS strips the browser one.
//
// Nothing here runs unless the visitor accepted marketing cookies, and nothing
// runs off the live domain, so localhost and deploy previews never reach the
// dataset.
import { hasConsent } from './cookieConsent';

export const LIVE_HOSTS = ['www.loogolabs.com', 'loogolabs.com'];

export function isLiveHost() {
  return typeof window !== 'undefined' && LIVE_HOSTS.includes(window.location.hostname);
}

/** True when events may be sent at all: live domain + marketing consent. */
export function canTrack() {
  return isLiveHost() && hasConsent('marketing');
}

export function newEventId() {
  try {
    if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  } catch { /* fall through */ }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

/** Browser half: the pixel, tagged with the shared event ID. */
export function pixelTrack(event, params, eventId) {
  if (typeof window === 'undefined' || !window.fbq) return;
  if (eventId) window.fbq('track', event, params || {}, { eventID: eventId });
  else window.fbq('track', event, params || {});
}

/** Event ID for a Lead the caller will fire later (null = don't track). */
export function leadEventId() {
  return canTrack() ? newEventId() : null;
}

/** Fields create-lead reads to send the server copy of a Lead. */
export function leadMeta(eventId) {
  return eventId ? { meta_event_id: eventId, meta_source_url: window.location.href } : {};
}

/**
 * Lead: fire the pixel now and return the event ID to send with the lead
 * itself, so create-lead can send the server copy with the visitor's contact
 * details. Returns null (and sends nothing) without consent or off the live site.
 */
export function trackLead(params) {
  const eventId = leadEventId();
  if (!eventId) return null;
  pixelTrack('Lead', params, eventId);
  return eventId;
}

/**
 * Any other standard event (Schedule): pixel plus a server copy through the
 * meta-event function. keepalive lets the request finish even if a click
 * navigates away.
 */
export function trackEvent(event, params) {
  if (!canTrack()) return;
  const eventId = newEventId();
  pixelTrack(event, params, eventId);
  try {
    fetch('/.netlify/functions/meta-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({
        event_name: event,
        event_id: eventId,
        event_source_url: window.location.href,
        custom_data: params || undefined,
      }),
    }).catch(() => {});
  } catch { /* never break the click */ }
}

export const trackSchedule = (params) => trackEvent('Schedule', params);
