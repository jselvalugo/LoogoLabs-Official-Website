import React from 'react';
import { CATEGORIES, DRAFT_STORAGE_KEY as STORAGE_KEY, PRODUCTS, PRODUCTS_BY_SKU, PROPOSAL_VALID_DAYS, SITE_PLANS } from '../lib/parkSupply';
import { isLoggedIn } from '../lib/identity';
import { SITE } from '../lib/seo';

// Unlisted: reachable only by direct link. It is kept out of the nav, footer,
// sitemap and llms.txt (see `unlisted` in lib/seo.js) and served noindex.
//
// Buyers see a quote cart: quantities at list price, sent as a quote request
// (there is no payment step). Staff signed in to /admin also get unit-price,
// discount, freight, and tax controls to turn a request into a proposal.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const usd = (n) => Number(n || 0).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });
const num = (v) => { const n = parseFloat(v); return Number.isFinite(n) && n >= 0 ? n : 0; };

const newProposalNumber = () => {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  return `LL-PS-${ymd}-${Math.floor(1000 + Math.random() * 9000)}`;
};

const emptyDraft = () => ({
  number: newProposalNumber(),
  lines: [], // { sku, qty, price }
  client: { organization: '', contact: '', email: '', phone: '', project: '', location: '' },
  scope: '',
  discountPct: '',
  shipping: '',
  taxPct: '',
});

function loadDraft() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyDraft();
    const saved = JSON.parse(raw);
    const base = emptyDraft();
    return {
      ...base, ...saved,
      client: { ...base.client, ...(saved.client || {}) },
      // Drop lines whose product has since been removed from the catalog.
      lines: Array.isArray(saved.lines) ? saved.lines.filter((l) => PRODUCTS_BY_SKU.has(l.sku)) : [],
    };
  } catch {
    return emptyDraft();
  }
}

function totalsFor(draft) {
  const subtotal = draft.lines.reduce((s, l) => s + num(l.qty) * num(l.price), 0);
  const discount = subtotal * Math.min(num(draft.discountPct), 100) / 100;
  const shipping = num(draft.shipping);
  const tax = (subtotal - discount) * num(draft.taxPct) / 100;
  return { subtotal, discount, shipping, tax, total: subtotal - discount + shipping + tax };
}

// The buying process, shown on the page and echoed after a request is sent.
const PROCESS = [
  ['Build your list and send the form', 'Use the planner or the catalog, then tell us who you are and where it’s going. No payment, no commitment.'],
  ['We contact you', 'A real person reaches out by phone or email to talk through your site and confirm what you need.'],
  ['We work out logistics together', 'Delivery, freight, installation, and timing, planned around your site and your schedule.'],
  ['Formal quote, then we move forward', 'You get a final quote to approve. Once you do, we order, deliver, and install.'],
];

/* ─────────────────────── primitives ─────────────────────── */

const Wrap = ({ children, style }) => (
  <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 20px', ...style }}>{children}</div>
);

const Eyebrow = ({ children, light }) => (
  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase',
    color: light ? 'var(--cyan-500)' : 'var(--ink-400)', marginBottom: 12 }}>
    {children}
  </div>
);

const btn = (variant = 'primary') => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
  padding: '10px 16px', borderRadius: 'var(--radius-2)', cursor: 'pointer',
  fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase',
  ...(variant === 'primary'
    ? { background: 'var(--ink-900)', color: 'var(--paper-000)', border: '2px solid var(--ink-900)' }
    : variant === 'ghost'
      ? { background: 'transparent', color: 'var(--ink-600)', border: '1px solid var(--border-hair)' }
      : { background: 'var(--paper-000)', color: 'var(--ink-900)', border: '2px solid var(--ink-900)' }),
});

const fieldStyle = {
  width: '100%', boxSizing: 'border-box', fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--ink-900)',
  background: 'var(--paper-000)', padding: '9px 11px', borderRadius: 'var(--radius-2)', border: '1px solid var(--border-hair)',
};

function Field({ label, value, onChange, type = 'text', placeholder, textarea }) {
  const id = React.useId();
  return (
    <div style={{ display: 'grid', gap: 5 }}>
      <label htmlFor={id} style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-600)' }}>{label}</label>
      {textarea
        ? <textarea id={id} value={value} placeholder={placeholder} rows={3} onChange={(e) => onChange(e.target.value)} style={{ ...fieldStyle, resize: 'vertical' }} />
        : <input id={id} type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} style={fieldStyle} />}
    </div>
  );
}

function CategoryIcon({ category, size = 44 }) {
  const stroke = 'var(--ink-700)';
  const common = { width: size, height: size, viewBox: '0 0 48 48', fill: 'none', stroke, strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };
  switch (category) {
    case 'stations':
      return <svg {...common}><path d="M24 44V8" /><rect x="14" y="6" width="20" height="10" rx="1" /><rect x="17" y="19" width="14" height="9" rx="1" /><path d="M16 31h16l-2 11H18z" /></svg>;
    case 'dispensers':
      return <svg {...common}><rect x="12" y="6" width="24" height="26" rx="2" /><path d="M20 32v8h8v-8" /><path d="M18 14h12M18 20h12" /></svg>;
    case 'receptacles':
      return <svg {...common}><path d="M10 14h28" /><path d="M20 14v-4h8v4" /><path d="M13 14l3 28h16l3-28" /><path d="M21 20v16M27 20v16" /></svg>;
    case 'bags':
      return <svg {...common}><path d="M14 16h20l-2 26H16z" /><path d="M19 16c0-5 2-8 5-8s5 3 5 8" /></svg>;
    case 'signage':
      return <svg {...common}><rect x="8" y="6" width="32" height="20" rx="2" /><path d="M24 26v18" /><path d="M14 13h20M14 19h14" /></svg>;
    case 'amenities':
      return <svg {...common}><path d="M8 38h32" /><path d="M14 38V24h20v14" /><path d="M10 24l14-12 14 12" /><circle cx="24" cy="31" r="2" /></svg>;
    default:
      return <svg {...common}><path d="M30 8l10 10-18 18H12V26z" /><path d="M26 12l10 10" /></svg>;
  }
}

/* ─────────────────────── page ─────────────────────── */

export default function ParkSupply() {
  const [draft, setDraft] = React.useState(loadDraft);
  const [category, setCategory] = React.useState('all');
  const [submitState, setSubmitState] = React.useState({ status: 'idle', error: '' });
  const builderRef = React.useRef(null);
  const [staff] = React.useState(() => { try { return isLoggedIn(); } catch { return false; } });
  const [toast, setToast] = React.useState(null); // { id, text }
  const [builderInView, setBuilderInView] = React.useState(false);

  React.useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  React.useEffect(() => {
    const el = builderRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(([e]) => setBuilderInView(e.isIntersecting), { rootMargin: '0px 0px -30% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  React.useEffect(() => {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft)); } catch { /* storage blocked — draft just won't persist */ }
  }, [draft]);

  const totals = totalsFor(draft);
  const itemCount = draft.lines.reduce((s, l) => s + num(l.qty), 0);
  const visible = category === 'all' ? PRODUCTS : PRODUCTS.filter((p) => p.category === category);

  // Merge [sku, qty] pairs into the draft, adding to any quantity already there.
  const addLines = (pairs) => {
    setSubmitState({ status: 'idle', error: '' });
    setDraft((d) => {
      let lines = d.lines;
      for (const [sku, qty] of pairs) {
        lines = lines.some((l) => l.sku === sku)
          ? lines.map((l) => (l.sku === sku ? { ...l, qty: num(l.qty) + qty } : l))
          : [...lines, { sku, qty, price: PRODUCTS_BY_SKU.get(sku).price }];
      }
      return { ...d, lines };
    });
  };
  const addProduct = (sku) => {
    addLines([[sku, 1]]);
    setToast({ id: Date.now(), text: `${PRODUCTS_BY_SKU.get(sku).name} added` });
  };
  const addPlan = (pairs, label) => {
    addLines(pairs);
    const n = pairs.reduce((s, [, q]) => s + q, 0);
    setToast({ id: Date.now(), text: `${label} starter kit added: ${n} item${n === 1 ? '' : 's'}` });
  };
  const setQty = (sku, qty) => (qty <= 0 ? removeLine(sku) : updateLine(sku, { qty }));
  const updateLine = (sku, patch) => setDraft((d) => ({ ...d, lines: d.lines.map((l) => (l.sku === sku ? { ...l, ...patch } : l)) }));
  const removeLine = (sku) => setDraft((d) => ({ ...d, lines: d.lines.filter((l) => l.sku !== sku) }));
  const setClient = (key) => (value) => setDraft((d) => ({ ...d, client: { ...d.client, [key]: value } }));
  const setField = (key) => (value) => setDraft((d) => ({ ...d, [key]: value }));

  const startOver = () => {
    if (draft.lines.length && submitState.status !== 'sent' && !window.confirm('Clear this quote and start a new one?')) return;
    setDraft(emptyDraft());
    setSubmitState({ status: 'idle', error: '' });
  };

  const printProposal = async () => {
    // Print only once the brand fonts are in, or the PDF falls back to Arial.
    try { await document.fonts?.ready; } catch { /* print anyway */ }
    const prev = document.title;
    // The browser uses the document title as the default PDF filename.
    document.title = `${SITE.name} Proposal ${draft.number}${draft.client.organization ? ` — ${draft.client.organization}` : ''}`;
    window.print();
    document.title = prev;
  };

  const submitQuote = async () => {
    const { contact, email } = draft.client;
    if (!draft.lines.length) return setSubmitState({ status: 'error', error: 'Add at least one product first.' });
    if (!contact.trim() || !EMAIL_RE.test(email.trim())) {
      return setSubmitState({ status: 'error', error: 'A contact name and valid email are required.' });
    }
    setSubmitState({ status: 'sending', error: '' });
    try {
      const res = await fetch('/.netlify/functions/create-proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          number: draft.number,
          ...draft.client,
          contact: contact.trim(),
          email: email.trim(),
          scope: draft.scope,
          lines: draft.lines.map((l) => ({ sku: l.sku, qty: num(l.qty), price: num(l.price) })),
          discount_pct: num(draft.discountPct),
          shipping: num(draft.shipping),
          tax_pct: num(draft.taxPct),
        }),
      });
      if (!res.ok) throw new Error();
      setSubmitState({ status: 'sent', error: '' });
    } catch {
      setSubmitState({ status: 'error', error: 'Could not send right now. Try again, or email ' + SITE.email + '.' });
    }
  };

  return (
    <main style={{ fontFamily: 'var(--font-body)', background: 'var(--paper-100)', minHeight: '100vh' }}>
      <style>{PAGE_CSS}</style>

      <div className="ps-screen">
        {/* ── TOP BAR ── */}
        <header style={{ position: 'sticky', top: 0, zIndex: 30, background: 'var(--ink-900)', borderBottom: '1px solid rgba(216,211,198,0.2)' }}>
          <Wrap style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56, gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
              {/* The mark is solid dark green, so it sits on a light chip against the dark bar. */}
              <a href="/" aria-label="Loogo Labs — home"
                style={{ display: 'flex', flexShrink: 0, background: 'var(--paper-000)', padding: 4, borderRadius: 'var(--radius-1)' }}>
                <img src="/logo.png" alt="Loogo Labs" width="28" height="28" style={{ height: 28, width: 28, display: 'block' }} />
              </a>
              <span style={{ color: 'var(--paper-000)', fontWeight: 700, letterSpacing: '-0.02em', fontSize: 17, whiteSpace: 'nowrap' }}>Loogo Labs</span>
              <span className="ps-hide-sm" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-200)', whiteSpace: 'nowrap' }}>/ Park Supply</span>
            </div>
            <button type="button" onClick={() => builderRef.current?.scrollIntoView({ behavior: 'smooth' })}
              style={{ ...btn('secondary'), padding: '7px 12px', background: 'var(--cyan-500)', borderColor: 'var(--cyan-500)', whiteSpace: 'nowrap' }}>
              {staff ? 'Proposal' : 'Quote'} · <span key={itemCount} className={itemCount ? 'ps-bump' : undefined}>{itemCount}</span>
              <span className="ps-hide-sm">&nbsp;item{itemCount === 1 ? '' : 's'}</span>
            </button>
          </Wrap>
        </header>

        {/* ── HERO ── */}
        <section className="ll-grid-bg--inverse" style={{ background: 'var(--ink-900)', color: 'var(--paper-100)', padding: 'clamp(40px,6vw,72px) 0' }}>
          <Wrap>
            <Eyebrow light>Pet waste stations · Dog park amenities</Eyebrow>
            <h1 style={{ margin: 0, fontWeight: 800, fontSize: 'clamp(32px,4.6vw,56px)', lineHeight: 1.06, letterSpacing: '-0.03em', maxWidth: '20ch' }}>
              Cleaner parks, <span style={{ color: 'var(--cyan-500)' }}>fewer complaints</span>.
            </h1>
            <p style={{ maxWidth: '60ch', margin: '20px 0 0', fontSize: 17, lineHeight: 1.6, color: 'var(--ink-200)' }}>
              Commercial-grade pet waste stations, refills, signage, and dog park amenities for parks departments,
              HOAs, property managers, and developers. Pick what your site needs, or let the planner build a starter list,
              then send it to us for a formal quote. No payment and no commitment.
            </p>
          </Wrap>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section style={{ padding: 'clamp(32px,5vw,56px) 0 0' }}>
          <Wrap>
            <Eyebrow>How it works</Eyebrow>
            <h2 style={{ margin: '0 0 18px', fontSize: 'var(--fs-h2)', letterSpacing: 'var(--ls-h2)', color: 'var(--ink-900)' }}>From list to installed, with a person at every step</h2>
            <ol className="ps-steps">
              {PROCESS.map(([t, sub], i) => (
                <li key={t}>
                  <span className="ps-step-n">{i + 1}</span>
                  <div><strong>{t}</strong><p>{sub}</p></div>
                </li>
              ))}
            </ol>
          </Wrap>
        </section>

        {/* ── PLANNER ── */}
        <SitePlanner onAdd={addPlan} />

        {/* ── CATALOG ── */}
        <section style={{ padding: 'clamp(32px,5vw,56px) 0' }}>
          <Wrap>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 18 }}>
              <h2 style={{ margin: 0, fontSize: 'var(--fs-h2)', letterSpacing: 'var(--ls-h2)', color: 'var(--ink-900)' }}>Catalog</h2>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-400)' }}>{visible.length} products · list prices, USD</span>
            </div>

            <div className="ps-chips" role="tablist" aria-label="Product categories">
              {[{ id: 'all', label: 'All' }, ...CATEGORIES].map((c) => (
                <button key={c.id} type="button" role="tab" aria-selected={category === c.id} onClick={() => setCategory(c.id)}
                  className={`ps-chip${category === c.id ? ' is-active' : ''}`}>
                  {c.label}
                </button>
              ))}
            </div>

            <div className="ps-grid">
              {visible.map((p) => {
                const inProposal = draft.lines.find((l) => l.sku === p.sku);
                return (
                  <article key={p.sku} className={`ps-card${inProposal ? ' is-in' : ''}`}>
                    {p.image ? (
                      <div className="ps-photo">
                        <img src={p.image} alt={p.name} loading="lazy" decoding="async" />
                        <span className="ps-photo-sku">{p.sku}</span>
                        {p.illustration && <span className="ps-photo-note">Illustration</span>}
                      </div>
                    ) : (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                        <div style={{ width: 64, height: 64, borderRadius: 'var(--radius-2)', background: 'var(--paper-100)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                          <CategoryIcon category={p.category} />
                        </div>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.06em', color: 'var(--ink-400)' }}>{p.sku}</span>
                      </div>
                    )}
                    <h3 style={{ margin: '14px 0 6px', fontSize: 17, lineHeight: 1.3, letterSpacing: '-0.01em', color: 'var(--ink-900)' }}>{p.name}</h3>
                    <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: 'var(--ink-600)' }}>{p.desc}</p>
                    <ul style={{ margin: '12px 0 0', padding: 0, listStyle: 'none', display: 'grid', gap: 4 }}>
                      {p.specs.map((s) => (
                        <li key={s} style={{ fontSize: 13, color: 'var(--ink-500)', display: 'flex', gap: 8 }}>
                          <span aria-hidden style={{ color: 'var(--ink-300)' }}>—</span>{s}
                        </li>
                      ))}
                    </ul>
                    <div style={{ marginTop: 'auto', paddingTop: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                      <div>
                        <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--ink-900)', letterSpacing: '-0.02em' }}>{usd(p.price)}</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-400)' }}>{p.unit}</div>
                      </div>
                      {inProposal ? (
                        <Stepper label={p.name} value={num(inProposal.qty)} onChange={(q) => setQty(p.sku, q)} />
                      ) : (
                        <button type="button" onClick={() => addProduct(p.sku)} style={btn('primary')}>
                          Add to quote <span aria-hidden>+</span>
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </Wrap>
        </section>

        {/* ── PROPOSAL BUILDER ── */}
        <section ref={builderRef} style={{ padding: 'clamp(32px,5vw,56px) 0 80px', borderTop: '1px solid var(--border-hair)', background: 'var(--paper-000)', scrollMarginTop: 56 }}>
          <Wrap>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
              <div>
                <Eyebrow>{staff ? 'Proposal' : 'Quote request'} {draft.number}</Eyebrow>
                <h2 style={{ margin: 0, fontSize: 'var(--fs-h2)', letterSpacing: 'var(--ls-h2)', color: 'var(--ink-900)' }}>{staff ? 'Build a proposal' : 'Your quote'}</h2>
              </div>
              <button type="button" onClick={startOver} style={btn('ghost')}>{staff ? 'New proposal' : 'Start over'}</button>
            </div>

            <div className="ps-builder">
              {/* Line items */}
              <div>
                {draft.lines.length === 0 ? (
                  <div style={{ padding: '36px 20px', border: '1px dashed var(--border-hair)', borderRadius: 'var(--radius-2)', textAlign: 'center', color: 'var(--ink-400)', fontSize: 14 }}>
                    Your quote is empty. Try the planner above, or add items from the catalog.
                  </div>
                ) : (
                  <div style={{ display: 'grid', gap: 10 }}>
                    {draft.lines.map((l) => {
                      const p = PRODUCTS_BY_SKU.get(l.sku);
                      return (
                        <div key={l.sku} className={`ps-line${staff ? '' : ' ps-line--buyer'}`}>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--ink-900)' }}>{p.name}</div>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-400)', marginTop: 2 }}>{p.sku} · {usd(l.price)} {p.unit}</div>
                          </div>
                          {staff ? (
                            <>
                              <label className="ps-line-field">
                                <span>Qty</span>
                                <input type="number" min="0" step="1" value={l.qty} onChange={(e) => updateLine(l.sku, { qty: e.target.value })} style={fieldStyle} />
                              </label>
                              <label className="ps-line-field">
                                <span>Unit $</span>
                                <input type="number" min="0" step="0.01" value={l.price} onChange={(e) => updateLine(l.sku, { price: e.target.value })} style={fieldStyle} />
                              </label>
                            </>
                          ) : (
                            <Stepper label={p.name} value={num(l.qty)} onChange={(q) => setQty(l.sku, q)} />
                          )}
                          <div style={{ textAlign: 'right', fontWeight: 700, fontSize: 15, color: 'var(--ink-900)', whiteSpace: 'nowrap' }}>{usd(num(l.qty) * num(l.price))}</div>
                          <button type="button" aria-label={`Remove ${p.name}`} onClick={() => removeLine(l.sku)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-400)', fontSize: 20, lineHeight: 1, padding: 4 }}>×</button>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div style={{ marginTop: 24, display: 'grid', gap: 14 }}>
                  <Field label={staff ? 'Scope / notes (appears on the proposal)' : 'Anything we should know? (optional)'} textarea value={draft.scope} onChange={setField('scope')}
                    placeholder="e.g. Install 6 stations along the Lake Loop Trail and 2 at the dog park entrance. Includes first year of servicing." />
                </div>
              </div>

              {/* Client + totals */}
              <aside style={{ display: 'grid', gap: 20, alignContent: 'start' }}>
                <div className="ps-panel">
                  <Eyebrow>{staff ? 'Prepared for' : 'About you and the site'}</Eyebrow>
                  <div style={{ display: 'grid', gap: 12 }}>
                    <Field label="Organization" value={draft.client.organization} onChange={setClient('organization')} placeholder="City of Winter Park — Parks & Rec" />
                    <Field label="Project / park" value={draft.client.project} onChange={setClient('project')} placeholder="Lake Loop Trail improvements" />
                    <Field label="Location" value={draft.client.location} onChange={setClient('location')} placeholder="Winter Park, FL" />
                    <div className="ps-two">
                      <Field label="Contact name" value={draft.client.contact} onChange={setClient('contact')} />
                      <Field label="Phone" type="tel" value={draft.client.phone} onChange={setClient('phone')} />
                    </div>
                    <Field label="Email" type="email" value={draft.client.email} onChange={setClient('email')} />
                  </div>
                </div>

                <div className="ps-panel">
                  <Eyebrow>{staff ? 'Pricing' : 'Estimate'}</Eyebrow>
                  {staff && (
                    <div className="ps-three" style={{ marginBottom: 18 }}>
                      <Field label="Discount %" type="number" value={draft.discountPct} onChange={setField('discountPct')} placeholder="0" />
                      <Field label="Freight $" type="number" value={draft.shipping} onChange={setField('shipping')} placeholder="0" />
                      <Field label="Tax %" type="number" value={draft.taxPct} onChange={setField('taxPct')} placeholder="0" />
                    </div>
                  )}
                  <dl style={{ margin: 0, display: 'grid', gap: 6, fontSize: 14 }}>
                    <TotalRow label="Subtotal" value={usd(totals.subtotal)} />
                    {totals.discount > 0 && <TotalRow label={`Discount (${num(draft.discountPct)}%)`} value={`−${usd(totals.discount)}`} />}
                    {totals.shipping > 0 && <TotalRow label="Freight" value={usd(totals.shipping)} />}
                    {totals.tax > 0 && <TotalRow label={`Tax (${num(draft.taxPct)}%)`} value={usd(totals.tax)} />}
                    <div style={{ borderTop: '1px solid var(--border-hair)', marginTop: 6, paddingTop: 10 }}>
                      <TotalRow label={staff ? 'Total' : 'Estimated total'} value={usd(totals.total)} strong />
                    </div>
                  </dl>
                </div>

                <div style={{ display: 'grid', gap: 10 }}>
                  {submitState.status === 'sent' ? (
                    <QuoteSent number={draft.number} email={draft.client.email} onNew={startOver} />
                  ) : (
                    <>
                      <button type="button" onClick={submitQuote} disabled={submitState.status === 'sending'} style={{ ...btn('primary'), padding: '14px 16px', fontSize: 13 }}>
                        {submitState.status === 'sending' ? 'Sending…' : 'Request my quote'} <span aria-hidden>→</span>
                      </button>
                      <button type="button" onClick={printProposal} disabled={!draft.lines.length}
                        style={{ ...btn('secondary'), padding: '12px 16px', opacity: draft.lines.length ? 1 : 0.4, cursor: draft.lines.length ? 'pointer' : 'not-allowed' }}>
                        Print / save as PDF
                      </button>
                    </>
                  )}
                  {submitState.status === 'error' && (
                    <p role="alert" style={{ margin: 0, fontSize: 13, color: 'var(--status-danger)' }}>{submitState.error}</p>
                  )}
                  <p style={{ margin: 0, fontSize: 12, color: 'var(--ink-400)', lineHeight: 1.5 }}>
                    No payment is taken here. After you send this, we contact you to work out logistics before anything is ordered.
                    Your list saves in this browser. List prices valid {PROPOSAL_VALID_DAYS} days.
                  </p>
                </div>
              </aside>
            </div>
          </Wrap>
        </section>

        {itemCount > 0 && !builderInView && submitState.status !== 'sent' && (
          <div className="ps-dock">
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-200)' }}>
                {itemCount} item{itemCount === 1 ? '' : 's'} · est.
              </div>
              <div style={{ fontWeight: 700, fontSize: 17 }}>{usd(totals.total)}</div>
            </div>
            <button type="button" onClick={() => builderRef.current?.scrollIntoView({ behavior: 'smooth' })}
              style={{ ...btn('secondary'), background: 'var(--paper-000)', borderColor: 'var(--paper-000)' }}>
              Review quote <span aria-hidden>→</span>
            </button>
          </div>
        )}

        <div aria-live="polite" className="ps-toast-wrap">
          {toast && (
            <div key={toast.id} className="ps-toast">
              <PawIcon /> {toast.text}
            </div>
          )}
        </div>

        <footer style={{ background: 'var(--ink-900)', color: 'var(--ink-200)', padding: '24px 0', fontSize: 13 }}>
          <Wrap style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <span>© {new Date().getFullYear()} {SITE.name}</span>
            <a href={`mailto:${SITE.email}`} style={{ color: 'var(--paper-000)' }}>{SITE.email}</a>
          </Wrap>
        </footer>
      </div>

      <ProposalDocument draft={draft} totals={totals} />
    </main>
  );
}

function TotalRow({ label, value, strong }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontWeight: strong ? 700 : 400, fontSize: strong ? 18 : 14, color: strong ? 'var(--ink-900)' : 'var(--ink-600)' }}>
      <dt>{label}</dt><dd style={{ margin: 0 }}>{value}</dd>
    </div>
  );
}

/* ─────────────────────── buyer widgets ─────────────────────── */

function PawIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden style={{ flexShrink: 0 }}>
      <ellipse cx="12" cy="16" rx="5" ry="4.2" /><circle cx="5.5" cy="10" r="2.2" /><circle cx="9.5" cy="6" r="2.2" />
      <circle cx="14.5" cy="6" r="2.2" /><circle cx="18.5" cy="10" r="2.2" />
    </svg>
  );
}

function Stepper({ value, onChange, label, min = 0, max = 999 }) {
  const b = { width: 34, height: 34, border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 18, lineHeight: 1, color: 'var(--ink-900)' };
  return (
    <div className="ps-stepper" role="group" aria-label={`Quantity of ${label}`}>
      <button type="button" style={b} aria-label="Decrease" onClick={() => onChange(Math.max(min, value - 1))}>−</button>
      <input type="number" min={min} max={max} value={value} aria-label="Quantity"
        onChange={(e) => onChange(Math.min(max, Math.max(min, Math.floor(Number(e.target.value) || 0))))} />
      <button type="button" style={b} aria-label="Increase" onClick={() => onChange(Math.min(max, value + 1))}>+</button>
    </div>
  );
}

function SitePlanner({ onAdd }) {
  const [planId, setPlanId] = React.useState(SITE_PLANS[0].id);
  const [count, setCount] = React.useState(2);
  const plan = SITE_PLANS.find((x) => x.id === planId);
  const pairs = plan.lines(count);
  const est = pairs.reduce((s, [sku, q]) => s + PRODUCTS_BY_SKU.get(sku).price * q, 0);

  return (
    <section style={{ padding: 'clamp(32px,5vw,56px) 0 0' }}>
      <Wrap>
        <div className="ps-planner">
          <div>
            <Eyebrow>Quick start</Eyebrow>
            <h2 style={{ margin: '0 0 6px', fontSize: 'var(--fs-h2)', letterSpacing: 'var(--ls-h2)', color: 'var(--ink-900)' }}>What are you outfitting?</h2>
            <p style={{ margin: '0 0 18px', color: 'var(--ink-600)', fontSize: 15, lineHeight: 1.5 }}>
              Pick a site and we’ll sketch a starter list. You can change every line before you send it.
            </p>
            <div className="ps-plan-tiles" role="radiogroup" aria-label="Site type">
              {SITE_PLANS.map((x) => (
                <button key={x.id} type="button" role="radio" aria-checked={x.id === planId} onClick={() => setPlanId(x.id)}
                  className={`ps-plan-tile${x.id === planId ? ' is-active' : ''}`}>
                  <strong>{x.label}</strong>
                  <span>{x.blurb}</span>
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', marginTop: 18 }}>
              <span style={{ fontSize: 14, color: 'var(--ink-700)', fontWeight: 600 }}>{plan.countLabel}</span>
              <Stepper label={plan.countLabel} value={count} min={1} max={50} onChange={setCount} />
            </div>
          </div>

          <div className="ps-plan-preview">
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-400)', marginBottom: 10 }}>
              Starter kit · {plan.label}
            </div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8 }}>
              {pairs.map(([sku, q]) => {
                const p = PRODUCTS_BY_SKU.get(sku);
                return (
                  <li key={sku} style={{ display: 'grid', gridTemplateColumns: '44px 1fr auto', alignItems: 'center', gap: 10 }}>
                    <img src={p.image} alt="" width="44" height="44" style={{ width: 44, height: 44, objectFit: 'contain', background: '#fff', borderRadius: 'var(--radius-1)', border: '1px solid var(--border-hair)' }} />
                    <span style={{ fontSize: 14, color: 'var(--ink-900)', lineHeight: 1.3 }}>{p.name}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--ink-600)' }}>× {q}</span>
                  </li>
                );
              })}
            </ul>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderTop: '1px solid var(--border-hair)', marginTop: 14, paddingTop: 12 }}>
              <span style={{ fontSize: 13, color: 'var(--ink-500)' }}>Estimate at list price</span>
              <span style={{ fontWeight: 700, fontSize: 20, color: 'var(--ink-900)', letterSpacing: '-0.02em' }}>{usd(est)}</span>
            </div>
            <button type="button" onClick={() => onAdd(pairs, plan.label)} style={{ ...btn('primary'), width: '100%', marginTop: 14, padding: '13px 16px' }}>
              Add kit to my quote <span aria-hidden>+</span>
            </button>
          </div>
        </div>
      </Wrap>
    </section>
  );
}

function QuoteSent({ number, email, onNew }) {
  return (
    <div className="ps-sent" role="status">
      <div className="ps-confetti" aria-hidden>
        {Array.from({ length: 12 }, (_, i) => <span key={i} style={{ '--i': i }}><PawIcon size={14} /></span>)}
      </div>
      <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--ink-900)', color: 'var(--paper-000)', display: 'grid', placeItems: 'center', fontSize: 22 }}>✓</div>
      <h3 style={{ margin: '14px 0 4px', fontSize: 20, color: 'var(--ink-900)' }}>Quote request sent</h3>
      <p style={{ margin: 0, fontSize: 14, color: 'var(--ink-600)', lineHeight: 1.5 }}>
        Reference <strong style={{ fontFamily: 'var(--font-mono)' }}>{number}</strong>. Here’s what happens next:
      </p>
      <ol style={{ margin: '14px 0 0', paddingLeft: 18, display: 'grid', gap: 6, fontSize: 14, color: 'var(--ink-700)' }}>
        <li>We contact you at {email || 'the email you gave us'} to talk through your site.</li>
        <li>We work out delivery, freight, install, and timing together.</li>
        <li>You approve a formal quote, and we move forward.</li>
      </ol>
      <button type="button" onClick={onNew} style={{ ...btn('ghost'), marginTop: 16, width: '100%' }}>Start another quote</button>
    </div>
  );
}

/* ─────────────────────── printable proposal ─────────────────────── */

// Brand palette as literal hex: print output should not depend on CSS variables
// resolving, and these match the site tokens in styles/globals.css.
const B = {
  ink900: '#1A2610', ink700: '#263517', ink500: '#415A27', ink400: '#5E7C3A', ink200: '#B0C492',
  paper: '#FFFFFF', paper000: '#F5F2EB', paper100: '#EAE6DC', paper200: '#D8D3C6',
};

function ProposalDocument({ draft, totals }) {
  const today = new Date();
  const validUntil = new Date(today.getTime() + PROPOSAL_VALID_DAYS * 86400000);
  const fmt = (d) => d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const c = draft.client;
  // Running footer on every printed page, via CSS page-margin boxes.
  const footerCss = `@media print { @page { @bottom-left { content: ${JSON.stringify(`${SITE.name}  ·  Proposal ${draft.number}`)}; } } }`;

  return (
    <div className="ps-doc" aria-hidden>
      <style>{footerCss}</style>

      {/* ── Masthead ── */}
      <header style={{ background: B.ink900, color: B.paper000, borderRadius: 8, padding: '22px 26px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ background: B.paper000, borderRadius: 6, padding: 6, display: 'flex' }}>
            <img src="/logo.png" alt="" style={{ height: 46, width: 46, display: 'block' }} />
          </div>
          <div>
            <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1 }}>{SITE.name}</div>
            <div className="ps-doc-mono" style={{ color: B.ink200, marginTop: 7 }}>Park Supply · Pet waste stations & dog park amenities</div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="ps-doc-mono" style={{ color: B.ink200 }}>Proposal</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 600, marginTop: 4, letterSpacing: '0.02em' }}>{draft.number}</div>
          <div style={{ fontSize: 10.5, marginTop: 6, color: B.paper200 }}>Issued {fmt(today)}</div>
          <div style={{ fontSize: 10.5, color: B.paper200 }}>Valid until {fmt(validUntil)}</div>
        </div>
      </header>

      {/* ── Parties ── */}
      <section style={{ display: 'grid', gridTemplateColumns: (c.project || c.location) ? '1fr 1fr 1fr' : '1fr 1fr', gap: 10, marginTop: 14 }}>
        <DocCard label="Prepared for">
          {c.organization && <div style={{ fontWeight: 700 }}>{c.organization}</div>}
          {c.contact && <div>Attn: {c.contact}</div>}
          {c.email && <div>{c.email}</div>}
          {c.phone && <div>{c.phone}</div>}
          {!c.organization && !c.contact && <div style={{ color: B.ink400 }}>—</div>}
        </DocCard>
        {(c.project || c.location) && (
          <DocCard label="Project">
            {c.project && <div style={{ fontWeight: 700 }}>{c.project}</div>}
            {c.location && <div>{c.location}</div>}
          </DocCard>
        )}
        <DocCard label="Prepared by">
          <div style={{ fontWeight: 700 }}>{SITE.name}</div>
          <div>{SITE.founder}, Founder</div>
          <div>{SITE.email}</div>
          <div>loogolabs.com</div>
        </DocCard>
      </section>

      {draft.scope && (
        <section style={{ marginTop: 14, borderLeft: `3px solid ${B.ink900}`, padding: '2px 0 2px 14px' }}>
          <div className="ps-doc-label">Scope of work</div>
          <p style={{ margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.55 }}>{draft.scope}</p>
        </section>
      )}

      {/* ── Line items ── */}
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11.5, marginTop: 18 }}>
        <thead>
          <tr>
            {['#', 'Item', 'Qty', 'Unit price', 'Amount'].map((h, i) => (
              <th key={h} className="ps-doc-mono" style={{
                textAlign: i >= 2 ? 'right' : 'left', background: B.ink900, color: B.paper000, padding: '8px 10px', whiteSpace: 'nowrap',
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {draft.lines.map((l, i) => {
            const p = PRODUCTS_BY_SKU.get(l.sku);
            const bg = i % 2 ? B.paper000 : B.paper;
            return (
              <tr key={l.sku} style={{ breakInside: 'avoid' }}>
                <td style={{ ...docTd, background: bg, color: B.ink400, fontFamily: 'var(--font-mono)', width: 22 }}>{String(i + 1).padStart(2, '0')}</td>
                <td style={{ ...docTd, background: bg }}>
                  <div>
                    <span style={{ fontWeight: 700 }}>{p.name}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: B.ink400, marginLeft: 8, letterSpacing: '0.04em' }}>{p.sku}</span>
                  </div>
                  <div style={{ color: B.ink500, fontSize: 10.5, marginTop: 2, lineHeight: 1.4 }}>{p.specs.join(' · ')}</div>
                </td>
                <td style={{ ...docTd, background: bg, textAlign: 'right', whiteSpace: 'nowrap' }}>{num(l.qty)} <span style={{ color: B.ink400 }}>{p.unit}</span></td>
                <td style={{ ...docTd, background: bg, textAlign: 'right', whiteSpace: 'nowrap' }}>{usd(l.price)}</td>
                <td style={{ ...docTd, background: bg, textAlign: 'right', whiteSpace: 'nowrap', fontWeight: 700 }}>{usd(num(l.qty) * num(l.price))}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* ── Terms & next steps beside the totals ── */}
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 290px', gap: 22, marginTop: 14, alignItems: 'start', breakInside: 'avoid' }}>
        <div style={{ display: 'grid', gap: 12, fontSize: 10.5, lineHeight: 1.5, color: B.ink700 }}>
          <div>
            <div className="ps-doc-label">Terms</div>
            <p style={{ margin: 0 }}>
              Pricing valid for {PROPOSAL_VALID_DAYS} days from issue. Freight and installation are estimates until confirmed at order.
              Standard lead time 2–4 weeks from purchase order; amenities and custom signage may take longer. Purchase orders and
              tax-exemption certificates accepted. Net 30 for approved public agencies.
            </p>
          </div>
          <div>
            <div className="ps-doc-label">Next steps</div>
            <ol style={{ margin: 0, paddingLeft: 16 }}>
              <li>Sign and return this proposal.</li>
              <li>Send a purchase order and, if applicable, your tax-exemption certificate.</li>
              <li>We confirm freight, schedule delivery, and coordinate installation.</li>
            </ol>
          </div>
        </div>
        <div style={{ background: B.paper000, borderRadius: 8, overflow: 'hidden', border: `1px solid ${B.paper200}` }}>
          <div style={{ padding: '10px 14px', display: 'grid', gap: 5 }}>
            <DocSum label="Subtotal" value={usd(totals.subtotal)} />
            {totals.discount > 0 && <DocSum label={`Discount (${num(draft.discountPct)}%)`} value={`−${usd(totals.discount)}`} />}
            {totals.shipping > 0 && <DocSum label="Freight" value={usd(totals.shipping)} />}
            {totals.tax > 0 && <DocSum label={`Tax (${num(draft.taxPct)}%)`} value={usd(totals.tax)} />}
          </div>
          <div style={{ background: B.ink900, color: B.paper000, padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span className="ps-doc-mono" style={{ color: B.ink200 }}>Total (USD)</span>
            <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em' }}>{usd(totals.total)}</span>
          </div>
        </div>
      </section>

      {/* ── Signatures ── */}
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, marginTop: 22, fontSize: 10.5, color: B.ink700, breakInside: 'avoid' }}>
        {[
          { who: `For ${SITE.name}`, name: `${SITE.founder}, Founder` },
          { who: `Accepted for ${c.organization || 'client'}`, name: 'Name, title' },
        ].map((s) => (
          <div key={s.who}>
            <div className="ps-doc-label">{s.who}</div>
            <div style={{ height: 28 }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px', gap: 12 }}>
              <div style={{ borderTop: `1px solid ${B.ink900}`, paddingTop: 4 }}>{s.name}</div>
              <div style={{ borderTop: `1px solid ${B.ink900}`, paddingTop: 4 }}>Date</div>
            </div>
          </div>
        ))}
      </section>

      {/* ── Sign-off ── */}
      <footer style={{ marginTop: 20, paddingTop: 12, borderTop: `2px solid ${B.ink900}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, breakInside: 'avoid' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="/logo.png" alt="" style={{ height: 26, width: 26 }} />
          <span style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>Thank you for considering {SITE.name}.</span>
        </div>
        <span className="ps-doc-mono" style={{ color: B.ink400 }}>{SITE.email} · loogolabs.com</span>
      </footer>
    </div>
  );
}

function DocCard({ label, children }) {
  return (
    <div style={{ background: B.paper000, border: `1px solid ${B.paper200}`, borderRadius: 8, padding: '11px 13px', lineHeight: 1.5 }}>
      <div className="ps-doc-label">{label}</div>
      {children}
    </div>
  );
}

function DocSum({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 11.5 }}>
      <span style={{ color: B.ink500 }}>{label}</span><span>{value}</span>
    </div>
  );
}

const docTd = { borderBottom: `1px solid ${B.paper200}`, padding: '7px 10px', verticalAlign: 'top' };

const PAGE_CSS = `
.ps-chips { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 6px; margin-bottom: 20px; scrollbar-width: thin; }
.ps-chip { flex-shrink: 0; padding: 8px 14px; border-radius: 999px; border: 1px solid var(--border-hair); background: var(--paper-000);
  font-family: var(--font-mono); font-size: 12px; letter-spacing: 0.04em; color: var(--ink-600); cursor: pointer; }
.ps-chip.is-active { background: var(--ink-900); border-color: var(--ink-900); color: var(--paper-000); }
.ps-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; }
.ps-card { display: flex; flex-direction: column; background: var(--paper-000); border: 1px solid var(--border-hair); border-radius: var(--radius-2); padding: 18px; }
.ps-photo { position: relative; margin: -18px -18px 0; height: 220px; padding: 14px; background: #fff;
  border-bottom: 1px solid var(--border-hair); border-radius: var(--radius-2) var(--radius-2) 0 0; overflow: hidden; }
.ps-photo img { display: block; width: 100%; height: 100%; object-fit: contain; }
.ps-photo-sku { position: absolute; top: 10px; right: 10px; padding: 3px 7px; border-radius: 999px; background: rgba(255,255,255,0.9);
  font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.06em; color: var(--ink-400); }
.ps-photo-note { position: absolute; left: 10px; bottom: 10px; padding: 3px 7px; border-radius: 999px; background: var(--paper-100);
  font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-400); }
.ps-card { transition: border-color .15s, box-shadow .15s, transform .15s; }
.ps-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-hard-sm); border-color: var(--ink-900); }
.ps-card.is-in { border-color: var(--ink-400); box-shadow: inset 0 0 0 1px var(--ink-400); }
.ps-stepper { display: inline-flex; align-items: center; border: 2px solid var(--ink-900); border-radius: var(--radius-2); background: var(--paper-000); }
.ps-stepper input { width: 42px; border: none; background: transparent; text-align: center; font: 600 14px var(--font-mono); color: var(--ink-900); -moz-appearance: textfield; }
.ps-stepper input::-webkit-inner-spin-button, .ps-stepper input::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
.ps-stepper button:hover { background: var(--paper-100); }
.ps-steps { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; counter-reset: none; }
.ps-steps li { display: flex; gap: 12px; align-items: flex-start; padding: 16px; background: var(--paper-000); border: 1px solid var(--border-hair); border-radius: var(--radius-2); }
.ps-steps strong { font-size: 15px; color: var(--ink-900); line-height: 1.3; }
.ps-steps p { margin: 6px 0 0; font-size: 13.5px; line-height: 1.5; color: var(--ink-600); }
.ps-step-n { flex-shrink: 0; width: 28px; height: 28px; border-radius: 50%; display: grid; place-items: center;
  background: var(--ink-900); color: var(--paper-000); font: 700 13px var(--font-mono); }
@media (max-width: 1000px) { .ps-steps { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
.ps-planner { display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr); gap: 28px; align-items: start;
  background: var(--paper-000); border: 2px solid var(--ink-900); border-radius: var(--radius-2); padding: clamp(18px, 3vw, 28px); box-shadow: var(--shadow-hard); }
.ps-plan-tiles { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
.ps-plan-tile { display: grid; gap: 3px; text-align: left; padding: 14px; border-radius: var(--radius-2); cursor: pointer;
  border: 1px solid var(--border-hair); background: var(--paper-100); color: var(--ink-900); font-family: var(--font-body); transition: all .15s; }
.ps-plan-tile strong { font-size: 15px; }
.ps-plan-tile span { font-size: 12.5px; color: var(--ink-500); }
.ps-plan-tile:hover { border-color: var(--ink-900); }
.ps-plan-tile.is-active { background: var(--ink-900); border-color: var(--ink-900); color: var(--paper-000); }
.ps-plan-tile.is-active span { color: var(--ink-200); }
.ps-plan-preview { background: var(--paper-100); border: 1px solid var(--border-hair); border-radius: var(--radius-2); padding: 16px; }
.ps-line.ps-line--buyer { grid-template-columns: minmax(0, 1fr) auto 96px 28px; }
.ps-bump { display: inline-block; animation: ps-bump .45s ease; }
@keyframes ps-bump { 0% { transform: scale(1); } 40% { transform: scale(1.6); } 100% { transform: scale(1); } }
.ps-toast-wrap { position: fixed; left: 0; right: 0; bottom: 20px; display: flex; justify-content: center; pointer-events: none; z-index: 60; }
.ps-toast { display: inline-flex; align-items: center; gap: 8px; padding: 10px 16px; border-radius: 999px; background: var(--ink-900); color: var(--paper-000);
  font-size: 14px; box-shadow: 0 8px 24px rgba(26,38,16,.25); animation: ps-toast-in .3s ease; max-width: calc(100vw - 32px); }
@keyframes ps-toast-in { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
.ps-dock { position: fixed; left: 12px; right: 12px; bottom: 12px; z-index: 50; display: none; align-items: center; justify-content: space-between; gap: 12px;
  padding: 10px 12px 10px 16px; border-radius: var(--radius-2); background: var(--ink-900); color: var(--paper-000); box-shadow: 0 10px 30px rgba(26,38,16,.3); }
.ps-sent { position: relative; overflow: hidden; background: var(--paper-100); border: 2px solid var(--ink-900); border-radius: var(--radius-2); padding: 20px; }
.ps-confetti span { position: absolute; top: -20px; left: calc(var(--i) * 8.3%); color: var(--ink-300); opacity: 0;
  animation: ps-fall 1.8s ease-in calc(var(--i) * 0.07s) 1 both; }
.ps-confetti span:nth-child(3n) { color: var(--ink-500); }
@keyframes ps-fall { 0% { opacity: 0; transform: translateY(0) rotate(0); } 15% { opacity: 1; } 100% { opacity: 0; transform: translateY(260px) rotate(200deg); } }
@media (prefers-reduced-motion: reduce) {
  .ps-card, .ps-card:hover { transition: none; transform: none; }
  .ps-bump, .ps-toast, .ps-confetti span { animation: none; }
  .ps-confetti { display: none; }
}
.ps-builder { display: grid; grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr); gap: 28px; }
.ps-panel { background: var(--paper-100); border: 1px solid var(--border-hair); border-radius: var(--radius-2); padding: 18px; }
.ps-two { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.ps-three { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.ps-line { display: grid; grid-template-columns: minmax(0, 1fr) 76px 100px 96px 28px; align-items: center; gap: 12px;
  padding: 12px 14px; background: var(--paper-100); border: 1px solid var(--border-hair); border-radius: var(--radius-2); }
.ps-line-field { display: grid; gap: 3px; }
.ps-line-field span { font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-400); }
.ps-doc { display: none; }
.ps-doc-label { font-family: var(--font-mono); font-size: 9px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #5E7C3A; margin-bottom: 5px; }
.ps-doc-mono { font-family: var(--font-mono); font-size: 9.5px; font-weight: 500; letter-spacing: 0.14em; text-transform: uppercase; }
@media (max-width: 860px) {
  .ps-builder, .ps-planner { grid-template-columns: 1fr; }
  .ps-dock { display: flex; }
  .ps-toast-wrap { bottom: 84px; }
}
@media (max-width: 560px) {
  .ps-hide-sm { display: none; }
  .ps-line { grid-template-columns: 1fr 1fr 28px; }
  .ps-line > :first-child { grid-column: 1 / 3; }
  .ps-line > :nth-child(4) { grid-column: 1 / 3; text-align: left !important; }
  .ps-line > :last-child { grid-column: 3; grid-row: 1; }
  .ps-two, .ps-three { grid-template-columns: 1fr; }
  .ps-line.ps-line--buyer { grid-template-columns: 1fr 1fr 28px; }
  .ps-steps { grid-template-columns: 1fr; }
}
@media print {
  @page {
    margin: 12mm 12mm 16mm;
    @bottom-left { font-family: "IBM Plex Mono", monospace; font-size: 8px; letter-spacing: 0.1em; color: #5E7C3A; }
    @bottom-right { content: "loogolabs.com  ·  Page " counter(page) " of " counter(pages); font-family: "IBM Plex Mono", monospace; font-size: 8px; letter-spacing: 0.1em; color: #5E7C3A; }
  }
  body { background: #fff !important; }
  body * { visibility: hidden; }
  .ps-screen { display: none; }
  .ps-doc, .ps-doc * { visibility: visible; }
  .ps-doc { display: block; position: absolute; left: 0; top: 0; width: 100%; color: #1A2610; font-family: var(--font-body); font-size: 12px; }
  /* Keep brand fills even when "Background graphics" is off in the print dialog. */
  .ps-doc, .ps-doc * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
}
`;
