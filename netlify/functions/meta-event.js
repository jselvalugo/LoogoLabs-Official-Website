import { sendMetaEvent, ALLOWED_EVENTS, isLiveUrl, isProductionDeploy } from '../lib/meta-capi.js';

// Server half of browser events that carry no form data (Schedule, from every
// "Book a call" button). The browser only calls this after the visitor accepted
// marketing cookies; see src/lib/metaEvents.js. Leads go through create-lead
// instead, so the server copy can include the contact details.
const CUSTOM_KEYS = ['content_name'];

export default async (req, context) => {
  if (req.method !== 'POST') return new Response(null, { status: 405 });
  let body;
  try { body = await req.json(); } catch { return new Response(null, { status: 400 }); }

  const { event_name, event_id, event_source_url } = body || {};
  if (event_name === 'Lead' || !ALLOWED_EVENTS.includes(event_name)) return new Response(null, { status: 400 });
  if (!isProductionDeploy(context) || !isLiveUrl(event_source_url)) return new Response(null, { status: 403 });

  const custom_data = {};
  for (const k of CUSTOM_KEYS) {
    const v = body?.custom_data?.[k];
    if (typeof v === 'string' && v) custom_data[k] = v.slice(0, 100);
  }

  await sendMetaEvent({ event_name, event_id, event_source_url, custom_data, req, context });
  return new Response(null, { status: 204 });
};
