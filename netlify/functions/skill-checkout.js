// Start a branded Stripe Checkout for a paid marketplace skill.
//
//   GET /.netlify/functions/skill-checkout?sku=saas-launch-playbook  -> 303 to Stripe Checkout
//
// Creating the session here (instead of a fixed Payment Link) lets every checkout
// carry Loogo Labs branding, and lets the success URL follow the site the buyer
// came from (production or a deploy preview). Test vs live is decided by which
// STRIPE_SECRET_KEY the deploy context has. The key needs Checkout Sessions: Write.
//
// After payment Stripe sends the buyer to /marketplace/thank-you?session_id=...,
// where skill-order.js verifies the order and serves the file.

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

export default async (req) => {
  const url = new URL(req.url);
  // Always send buyers back to the canonical site in production; previews keep their own host.
  const origin = /(^|\.)loogolabs\.com$/.test(url.hostname) ? 'https://www.loogolabs.com' : url.origin;
  const sku = url.searchParams.get('sku') || '';
  const product = PRODUCTS[sku];
  if (!product) return fail(origin, 'unknown_product', 404);

  const key = Netlify.env.get('STRIPE_SECRET_KEY');
  if (!key) {
    console.error('skill-checkout: STRIPE_SECRET_KEY missing');
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
      console.error('skill-checkout: stripe error', res.status, session?.error?.message);
      return fail(origin, 'unavailable');
    }
    return new Response(null, { status: 303, headers: { Location: session.url, 'Cache-Control': 'no-store' } });
  } catch (err) {
    console.error('skill-checkout: request failed', err);
    return fail(origin, 'unavailable');
  }
};
