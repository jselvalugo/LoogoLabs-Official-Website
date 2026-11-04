// Paid skill orders (marketplace): start a branded checkout, verify the payment, deliver the skill.
//
//   GET /.netlify/functions/skill-order?buy=saas-launch-playbook            -> 303 to branded Stripe Checkout
//   GET /.netlify/functions/skill-order?session_id=cs_...            -> order status (JSON)
//   GET /.netlify/functions/skill-order?session_id=cs_...&download=1 -> the skill .zip
//
// The buyer lands on /marketplace/thank-you?session_id=... after paying through a
// Stripe Payment Link whose metadata carries the product `sku`. We fetch the
// session from Stripe server-side, so the browser can't fake a purchase, and only
// then decrypt the bundled file. Paid files are committed encrypted because the
// repository is public (see scripts/encrypt-paid-skill.mjs).
//
// Environment (Functions scope, secret):
//   STRIPE_SECRET_KEY     restricted key with Checkout Sessions: Read is enough
//   SKILL_ENCRYPTION_KEY  64 hex chars, the key used to encrypt the files
import { createDecipheriv } from 'node:crypto';
import saasLaunchPlaybook from '../lib/paid-skills/saas-launch-playbook.enc.js';


// ── Checkout ─────────────────────────────────────────────────────────────────
const PRODUCTS = {
  'saas-launch-playbook': {
    name: 'SaaS Launch Playbook — Claude skill',
    description: 'Plan and run your SaaS launch with Claude: positioning, pricing, launch model, dated calendar, launch day, ads, email, scorecard and 30/60/90 review. Instant download.',
    amount: 3900, // cents
    currency: 'usd',
    image: '/skills/covers/saas-launch-playbook.png',
  },
};

const BRAND = {
  display_name: 'Loogo Labs',
  background_color: '#F4F0E9',
  button_color: '#1B2A12',
  border_style: 'rectangular',
  font_family: 'lato',
  logo: '/email-logo.png',
  icon: '/monogram.png',
};

const LICENSE_NOTE = 'Instant download after payment. Single-buyer license: use it for your own business and your own clients; no resale or redistribution.';

const fail = (origin, msg, status = 502) => new Response(null, {
  status: 303,
  headers: { Location: `${origin}/marketplace?checkout_error=${encodeURIComponent(msg)}`, 'Cache-Control': 'no-store', 'X-Status': String(status) },
});

async function startCheckout(req) {
  const url = new URL(req.url);
  // Always send buyers back to the canonical site in production; previews keep their own host.
  const origin = /(^|\.)loogolabs\.com$/.test(url.hostname) ? 'https://www.loogolabs.com' : url.origin;
  const sku = url.searchParams.get('buy') || '';
  const product = PRODUCTS[sku];
  if (!product) return fail(origin, 'unknown_product', 404);

  const key = Netlify.env.get('STRIPE_SECRET_KEY');
  if (!key) {
    console.error('skill-order checkout: STRIPE_SECRET_KEY missing');
    return fail(origin, 'unavailable', 503);
  }

  const f = new URLSearchParams();
  f.set('mode', 'payment');
  f.set('line_items[0][quantity]', '1');
  f.set('line_items[0][price_data][currency]', product.currency);
  f.set('line_items[0][price_data][unit_amount]', String(product.amount));
  f.set('line_items[0][price_data][product_data][name]', product.name);
  f.set('line_items[0][price_data][product_data][description]', product.description);
  f.set('line_items[0][price_data][product_data][images][0]', `${origin}${product.image}`);
  f.set('line_items[0][price_data][product_data][metadata][sku]', sku);
  f.set('metadata[sku]', sku);
  f.set('payment_intent_data[metadata][sku]', sku);
  f.set('success_url', `${origin}/marketplace/thank-you?session_id={CHECKOUT_SESSION_ID}`);
  f.set('cancel_url', `${origin}/marketplace`);
  f.set('allow_promotion_codes', 'true');
  f.set('invoice_creation[enabled]', 'true');
  f.set('custom_text[submit][message]', LICENSE_NOTE);
  f.set('branding_settings[display_name]', BRAND.display_name);
  f.set('branding_settings[background_color]', BRAND.background_color);
  f.set('branding_settings[button_color]', BRAND.button_color);
  f.set('branding_settings[border_style]', BRAND.border_style);
  f.set('branding_settings[font_family]', BRAND.font_family);
  f.set('branding_settings[logo][type]', 'url');
  f.set('branding_settings[logo][url]', `${origin}${BRAND.logo}`);
  f.set('branding_settings[icon][type]', 'url');
  f.set('branding_settings[icon][url]', `${origin}${BRAND.icon}`);

  try {
    const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: f,
    });
    const session = await res.json();
    if (!res.ok || !session.url) {
      console.error('skill-order checkout: stripe error', res.status, session?.error?.message);
      return fail(origin, 'unavailable');
    }
    return new Response(null, { status: 303, headers: { Location: session.url, 'Cache-Control': 'no-store' } });
  } catch (err) {
    console.error('skill-order checkout: request failed', err);
    return fail(origin, 'unavailable');
  }
}

// ── Order lookup & delivery ──────────────────────────────────────────────────
const CATALOG = {
  'saas-launch-playbook': {
    name: 'SaaS Launch Playbook',
    file: 'saas-launch-playbook.zip',
    payload: saasLaunchPlaybook,
  },
};

// A purchase link keeps working for this long, so buyers can re-download.
const DOWNLOAD_WINDOW_DAYS = 30;
const SUPPORT_EMAIL = 'david@loogolabs.com';

const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
});

function decrypt(payloadB64, keyHex) {
  const buf = Buffer.from(payloadB64, 'base64');
  const decipher = createDecipheriv('aes-256-gcm', Buffer.from(keyHex, 'hex'), buf.subarray(0, 12));
  decipher.setAuthTag(buf.subarray(12, 28));
  return Buffer.concat([decipher.update(buf.subarray(28)), decipher.final()]);
}

const maskEmail = (e) => {
  if (!e || !e.includes('@')) return null;
  const [u, d] = e.split('@');
  return `${u.slice(0, 2)}${'•'.repeat(Math.max(1, u.length - 2))}@${d}`;
};

export default async (req) => {
  if (req.method !== 'GET') return json({ error: 'Method not allowed' }, 405);
  const url = new URL(req.url);
  if (url.searchParams.has('buy')) return startCheckout(req);
  const sessionId = url.searchParams.get('session_id') || '';
  if (!/^cs_(test|live)_[A-Za-z0-9]{10,200}$/.test(sessionId)) {
    return json({ status: 'invalid', message: 'This link is missing a valid order reference.' }, 400);
  }

  const stripeKey = Netlify.env.get('STRIPE_SECRET_KEY');
  const fileKey = Netlify.env.get('SKILL_ENCRYPTION_KEY');
  if (!stripeKey || !fileKey) {
    console.error('skill-order: missing STRIPE_SECRET_KEY or SKILL_ENCRYPTION_KEY');
    return json({ status: 'error', message: `Downloads are temporarily unavailable. Email ${SUPPORT_EMAIL} and we'll send your file.` }, 503);
  }

  let session;
  try {
    const res = await fetch(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`, {
      headers: { Authorization: `Bearer ${stripeKey}` },
    });
    if (res.status === 404) return json({ status: 'not_found', message: 'We couldn\'t find this order.' }, 404);
    if (!res.ok) throw new Error(`Stripe ${res.status}`);
    session = await res.json();
  } catch (err) {
    console.error('skill-order: stripe lookup failed', err);
    return json({ status: 'error', message: `We couldn't confirm your order right now. Refresh in a minute, or email ${SUPPORT_EMAIL}.` }, 502);
  }

  const item = CATALOG[session.metadata?.sku];
  if (!item) return json({ status: 'not_found', message: 'This order isn\'t for a downloadable skill.' }, 404);
  if (session.status !== 'complete' || session.payment_status !== 'paid') {
    return json({ status: 'unpaid', message: 'This payment hasn\'t completed yet. If you were charged, refresh in a minute.' }, 402);
  }
  const ageDays = (Date.now() / 1000 - session.created) / 86400;
  if (ageDays > DOWNLOAD_WINDOW_DAYS) {
    return json({ status: 'expired', message: `This download link has expired. Email ${SUPPORT_EMAIL} with your receipt and we'll send a fresh one.` }, 410);
  }

  if (url.searchParams.get('download') !== '1') {
    return json({
      status: 'paid',
      sku: session.metadata.sku,
      name: item.name,
      email: maskEmail(session.customer_details?.email),
      expiresInDays: Math.max(0, Math.floor(DOWNLOAD_WINDOW_DAYS - ageDays)),
    });
  }

  let file;
  try {
    file = decrypt(item.payload, fileKey);
  } catch (err) {
    console.error('skill-order: decrypt failed', err);
    return json({ status: 'error', message: `Something went wrong preparing your file. Email ${SUPPORT_EMAIL} and we'll send it.` }, 500);
  }
  return new Response(file, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${item.file}"`,
      'Cache-Control': 'private, no-store',
      'X-Robots-Tag': 'noindex',
    },
  });
};
