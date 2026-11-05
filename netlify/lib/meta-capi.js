// Meta Conversions API sender, shared by create-lead (Lead) and meta-event
// (Schedule). Each event carries the same event_id the browser pixel used, so
// Meta deduplicates the pair and counts one conversion.
//
// Safe by default:
//   - No META_CAPI_TOKEN set → does nothing.
//   - Only sends from the production deploy and for pages on the live domain,
//     so deploy previews, branch deploys and localhost never reach the dataset.
//   - Contact details are SHA-256 hashed before they leave our server.
//   - Never throws; a Meta outage can't break a form.
import { createHash } from 'node:crypto';

export const PIXEL_ID = process.env.META_PIXEL_ID || '1111915434503725';
const GRAPH_VERSION = process.env.META_GRAPH_VERSION || 'v23.0';
export const LIVE_HOSTS = ['www.loogolabs.com', 'loogolabs.com'];
export const ALLOWED_EVENTS = ['Lead', 'Schedule'];

const sha = (v) => createHash('sha256').update(v).digest('hex');
const clean = (v) => (typeof v === 'string' ? v.trim().toLowerCase() : '');

export function isLiveUrl(url) {
  try { return LIVE_HOSTS.includes(new URL(url).hostname); } catch { return false; }
}

/** Netlify sets context.deploy.context; anything but production is a preview. */
export function isProductionDeploy(context) {
  const c = context?.deploy?.context || process.env.CONTEXT;
  return !c || c === 'production';
}

function normPhone(phone, countryCode) {
  let d = String(phone || '').replace(/\D/g, '');
  if (!d) return '';
  // US/Canada numbers typed without the country code.
  if (d.length === 10 && (!countryCode || countryCode === 'us' || countryCode === 'ca')) d = `1${d}`;
  return d;
}

function readCookie(header, name) {
  const m = (header || '').match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  return m ? decodeURIComponent(m[1]) : undefined;
}

/** Build Meta's user_data block from raw contact details + the request. */
export function buildUserData({ email, phone, full_name } = {}, req, context) {
  const geo = context?.geo || {};
  const country = clean(geo.country?.code);
  const ud = {};
  const em = clean(email);
  if (em) ud.em = [sha(em)];
  const ph = normPhone(phone, country);
  if (ph) ud.ph = [sha(ph)];
  const parts = clean(full_name).split(/\s+/).filter(Boolean);
  if (parts.length) ud.fn = [sha(parts[0])];
  if (parts.length > 1) ud.ln = [sha(parts[parts.length - 1])];
  const ct = clean(geo.city).replace(/[^a-z]/g, '');
  if (ct) ud.ct = [sha(ct)];
  const st = clean(geo.subdivision?.code).replace(/[^a-z]/g, '');
  if (st && st.length === 2) ud.st = [sha(st)];
  if (country) ud.country = [sha(country)];
  const ip = context?.ip || req?.headers?.get('x-nf-client-connection-ip');
  if (ip) ud.client_ip_address = ip;
  const ua = req?.headers?.get('user-agent');
  if (ua) ud.client_user_agent = ua;
  const cookies = req?.headers?.get('cookie');
  const fbp = readCookie(cookies, '_fbp');
  const fbc = readCookie(cookies, '_fbc');
  if (fbp) ud.fbp = fbp;
  if (fbc) ud.fbc = fbc;
  return ud;
}

/** Payload Meta expects; exported so it can be checked without sending. */
export function buildPayload({ event_name, event_id, event_source_url, user_data, custom_data }) {
  const event = {
    event_name,
    event_time: Math.floor(Date.now() / 1000),
    event_id,
    action_source: 'website',
    event_source_url,
    user_data,
  };
  if (custom_data && typeof custom_data === 'object' && Object.keys(custom_data).length) event.custom_data = custom_data;
  const payload = { data: [event] };
  if (process.env.META_TEST_EVENT_CODE) payload.test_event_code = process.env.META_TEST_EVENT_CODE;
  return payload;
}

/**
 * Send one event. Returns { sent: boolean, reason? } and never throws.
 * `user` holds raw contact details (email, phone, full_name); they are hashed here.
 */
export async function sendMetaEvent({ event_name, event_id, event_source_url, user, custom_data, req, context }) {
  try {
    const token = process.env.META_CAPI_TOKEN;
    if (!token) return { sent: false, reason: 'no_token' };
    if (!ALLOWED_EVENTS.includes(event_name)) return { sent: false, reason: 'event_not_allowed' };
    if (!event_id || typeof event_id !== 'string' || event_id.length > 100) return { sent: false, reason: 'bad_event_id' };
    if (!isProductionDeploy(context)) return { sent: false, reason: 'not_production' };
    if (!isLiveUrl(event_source_url)) return { sent: false, reason: 'not_live_domain' };

    const payload = buildPayload({
      event_name, event_id, event_source_url,
      user_data: buildUserData(user, req, context),
      custom_data,
    });
    const res = await fetch(`https://graph.facebook.com/${GRAPH_VERSION}/${PIXEL_ID}/events?access_token=${encodeURIComponent(token)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      console.error('Meta CAPI rejected event', event_name, res.status, await res.text().catch(() => ''));
      return { sent: false, reason: `http_${res.status}` };
    }
    return { sent: true };
  } catch (err) {
    console.error('Meta CAPI send failed', err);
    return { sent: false, reason: 'error' };
  }
}
