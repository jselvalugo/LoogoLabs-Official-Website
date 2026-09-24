import { getDatabase } from '@netlify/database';
import { PRODUCTS_BY_SKU } from '../../src/lib/parkSupply.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const json = (data, status) => new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });

// Public endpoint: every field is clamped, and line items are rebuilt from the
// catalog so a submission cannot invent products. The submitted unit price is
// kept (buyers can edit it on the page) alongside the list price, so the admin
// can see any change at a glance.
const str = (v, max = 300) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const amount = (v, max) => { const n = Number(v); return Number.isFinite(n) && n >= 0 ? Math.min(n, max) : 0; };
const round2 = (n) => Math.round(n * 100) / 100;

export default async (req, context) => {
  if (req.method !== 'POST') return new Response(null, { status: 405 });

  let body;
  try { body = await req.json(); } catch { return new Response(null, { status: 400 }); }

  const contact = str(body.contact, 120);
  const email = str(body.email, 200);
  if (!contact || !EMAIL_RE.test(email)) return json({ error: 'contact and a valid email are required' }, 400);

  const lines = (Array.isArray(body.lines) ? body.lines : []).slice(0, 100).flatMap((l) => {
    const p = PRODUCTS_BY_SKU.get(l?.sku);
    const qty = Math.floor(amount(l?.qty, 100000));
    if (!p || qty <= 0) return [];
    return [{ sku: p.sku, name: p.name, unit: p.unit, qty, price: round2(amount(l.price, 1e6)), list_price: p.price }];
  });
  if (!lines.length) return json({ error: 'at least one product is required' }, 400);

  const discount_pct = amount(body.discount_pct, 100);
  const shipping = round2(amount(body.shipping, 1e7));
  const tax_pct = amount(body.tax_pct, 100);
  const subtotal = round2(lines.reduce((s, l) => s + l.qty * l.price, 0));
  const discounted = subtotal * (1 - discount_pct / 100);
  const total = round2(discounted + shipping + discounted * tax_pct / 100);

  const geo = context?.geo || {};
  const { sql } = getDatabase();
  const [row] = await sql`
    INSERT INTO proposals (number, organization, contact, email, phone, project, location, scope, lines,
      discount_pct, shipping, tax_pct, subtotal, total, city, region, country)
    VALUES (${str(body.number, 40) || 'LL-PS'}, ${str(body.organization) || null}, ${contact}, ${email},
      ${str(body.phone, 40) || null}, ${str(body.project) || null}, ${str(body.location) || null}, ${str(body.scope, 4000)},
      ${JSON.stringify(lines)}::jsonb, ${discount_pct}, ${shipping}, ${tax_pct}, ${subtotal}, ${total},
      ${geo.city || null}, ${geo.subdivision?.name || null}, ${geo.country?.name || null})
    RETURNING id, number
  `;

  return json(row, 201);
};
