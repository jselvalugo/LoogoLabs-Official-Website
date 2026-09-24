import React from 'react';
import { CATEGORIES, PRODUCTS, PRODUCTS_BY_SKU, PROPOSAL_VALID_DAYS } from '../lib/parkSupply';
import { SITE } from '../lib/seo';

// Unlisted: reachable only by direct link. It is kept out of the nav, footer,
// sitemap and llms.txt (see `unlisted` in lib/seo.js) and served noindex.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const STORAGE_KEY = 'll-park-supply-draft';

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

  React.useEffect(() => {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft)); } catch { /* storage blocked — draft just won't persist */ }
  }, [draft]);

  const totals = totalsFor(draft);
  const itemCount = draft.lines.reduce((s, l) => s + num(l.qty), 0);
  const visible = category === 'all' ? PRODUCTS : PRODUCTS.filter((p) => p.category === category);

  const addProduct = (sku) => {
    setSubmitState({ status: 'idle', error: '' });
    setDraft((d) => {
      const existing = d.lines.find((l) => l.sku === sku);
      if (existing) return { ...d, lines: d.lines.map((l) => (l.sku === sku ? { ...l, qty: num(l.qty) + 1 } : l)) };
      return { ...d, lines: [...d.lines, { sku, qty: 1, price: PRODUCTS_BY_SKU.get(sku).price }] };
    });
  };
  const updateLine = (sku, patch) => setDraft((d) => ({ ...d, lines: d.lines.map((l) => (l.sku === sku ? { ...l, ...patch } : l)) }));
  const removeLine = (sku) => setDraft((d) => ({ ...d, lines: d.lines.filter((l) => l.sku !== sku) }));
  const setClient = (key) => (value) => setDraft((d) => ({ ...d, client: { ...d.client, [key]: value } }));
  const setField = (key) => (value) => setDraft((d) => ({ ...d, [key]: value }));

  const startOver = () => {
    if (draft.lines.length && !window.confirm('Clear this proposal and start a new one?')) return;
    setDraft(emptyDraft());
    setSubmitState({ status: 'idle', error: '' });
  };

  const printProposal = () => {
    const prev = document.title;
    // The browser uses the document title as the default PDF filename.
    document.title = `${draft.number}${draft.client.organization ? ` — ${draft.client.organization}` : ''}`;
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
      const res = await fetch('/.netlify/functions/create-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: contact.trim(),
          email: email.trim(),
          source: 'park_supply',
          business_type: draft.client.organization || null,
          pain_point: draft.client.project || null,
          job_volume: usd(totals.total),
          notes: proposalSummary(draft, totals),
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
              <span style={{ color: 'var(--paper-000)', fontWeight: 700, letterSpacing: '-0.02em', fontSize: 17, whiteSpace: 'nowrap' }}>Loogo Labs</span>
              <span className="ps-hide-sm" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-200)', whiteSpace: 'nowrap' }}>/ Park Supply</span>
            </div>
            <button type="button" onClick={() => builderRef.current?.scrollIntoView({ behavior: 'smooth' })}
              style={{ ...btn('secondary'), padding: '7px 12px', background: 'var(--cyan-500)', borderColor: 'var(--cyan-500)', whiteSpace: 'nowrap' }}>
              Proposal · {itemCount}<span className="ps-hide-sm">&nbsp;item{itemCount === 1 ? '' : 's'}</span>
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
              HOAs, property managers, and developers. Build a line-item proposal below, then print it or send it for a formal quote.
            </p>
          </Wrap>
        </section>

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
                  <article key={p.sku} className="ps-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                      <div style={{ width: 64, height: 64, borderRadius: 'var(--radius-2)', background: 'var(--paper-100)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                        <CategoryIcon category={p.category} />
                      </div>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.06em', color: 'var(--ink-400)' }}>{p.sku}</span>
                    </div>
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
                      <button type="button" onClick={() => addProduct(p.sku)} style={btn(inProposal ? 'secondary' : 'primary')}>
                        {inProposal ? `Added · ${inProposal.qty}` : 'Add'} <span aria-hidden>+</span>
                      </button>
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
                <Eyebrow>Proposal {draft.number}</Eyebrow>
                <h2 style={{ margin: 0, fontSize: 'var(--fs-h2)', letterSpacing: 'var(--ls-h2)', color: 'var(--ink-900)' }}>Build a proposal</h2>
              </div>
              <button type="button" onClick={startOver} style={btn('ghost')}>New proposal</button>
            </div>

            <div className="ps-builder">
              {/* Line items */}
              <div>
                {draft.lines.length === 0 ? (
                  <div style={{ padding: '36px 20px', border: '1px dashed var(--border-hair)', borderRadius: 'var(--radius-2)', textAlign: 'center', color: 'var(--ink-400)', fontSize: 14 }}>
                    No products yet. Add items from the catalog above.
                  </div>
                ) : (
                  <div style={{ display: 'grid', gap: 10 }}>
                    {draft.lines.map((l) => {
                      const p = PRODUCTS_BY_SKU.get(l.sku);
                      return (
                        <div key={l.sku} className="ps-line">
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--ink-900)' }}>{p.name}</div>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-400)', marginTop: 2 }}>{p.sku} · {p.unit}</div>
                          </div>
                          <label className="ps-line-field">
                            <span>Qty</span>
                            <input type="number" min="0" step="1" value={l.qty} onChange={(e) => updateLine(l.sku, { qty: e.target.value })} style={fieldStyle} />
                          </label>
                          <label className="ps-line-field">
                            <span>Unit $</span>
                            <input type="number" min="0" step="0.01" value={l.price} onChange={(e) => updateLine(l.sku, { price: e.target.value })} style={fieldStyle} />
                          </label>
                          <div style={{ textAlign: 'right', fontWeight: 700, fontSize: 15, color: 'var(--ink-900)', whiteSpace: 'nowrap' }}>{usd(num(l.qty) * num(l.price))}</div>
                          <button type="button" aria-label={`Remove ${p.name}`} onClick={() => removeLine(l.sku)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-400)', fontSize: 20, lineHeight: 1, padding: 4 }}>×</button>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div style={{ marginTop: 24, display: 'grid', gap: 14 }}>
                  <Field label="Scope / notes (appears on the proposal)" textarea value={draft.scope} onChange={setField('scope')}
                    placeholder="e.g. Install 6 stations along the Lake Loop Trail and 2 at the dog park entrance. Includes first year of servicing." />
                </div>
              </div>

              {/* Client + totals */}
              <aside style={{ display: 'grid', gap: 20, alignContent: 'start' }}>
                <div className="ps-panel">
                  <Eyebrow>Prepared for</Eyebrow>
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
                  <Eyebrow>Pricing</Eyebrow>
                  <div className="ps-three">
                    <Field label="Discount %" type="number" value={draft.discountPct} onChange={setField('discountPct')} placeholder="0" />
                    <Field label="Freight $" type="number" value={draft.shipping} onChange={setField('shipping')} placeholder="0" />
                    <Field label="Tax %" type="number" value={draft.taxPct} onChange={setField('taxPct')} placeholder="0" />
                  </div>
                  <dl style={{ margin: '18px 0 0', display: 'grid', gap: 6, fontSize: 14 }}>
                    <TotalRow label="Subtotal" value={usd(totals.subtotal)} />
                    {totals.discount > 0 && <TotalRow label={`Discount (${num(draft.discountPct)}%)`} value={`−${usd(totals.discount)}`} />}
                    {totals.shipping > 0 && <TotalRow label="Freight" value={usd(totals.shipping)} />}
                    {totals.tax > 0 && <TotalRow label={`Tax (${num(draft.taxPct)}%)`} value={usd(totals.tax)} />}
                    <div style={{ borderTop: '1px solid var(--border-hair)', marginTop: 6, paddingTop: 10 }}>
                      <TotalRow label="Total" value={usd(totals.total)} strong />
                    </div>
                  </dl>
                </div>

                <div style={{ display: 'grid', gap: 10 }}>
                  <button type="button" onClick={printProposal} disabled={!draft.lines.length}
                    style={{ ...btn('primary'), padding: '13px 16px', opacity: draft.lines.length ? 1 : 0.4, cursor: draft.lines.length ? 'pointer' : 'not-allowed' }}>
                    Print / save as PDF
                  </button>
                  <button type="button" onClick={submitQuote} disabled={submitState.status === 'sending'} style={{ ...btn('secondary'), padding: '13px 16px' }}>
                    {submitState.status === 'sending' ? 'Sending…' : 'Submit quote request'}
                  </button>
                  {submitState.status === 'sent' && (
                    <p role="status" style={{ margin: 0, fontSize: 13, color: 'var(--ink-600)' }}>
                      Received. A formal quote for {draft.number} will follow by email.
                    </p>
                  )}
                  {submitState.status === 'error' && (
                    <p role="alert" style={{ margin: 0, fontSize: 13, color: 'var(--status-danger)' }}>{submitState.error}</p>
                  )}
                  <p style={{ margin: 0, fontSize: 12, color: 'var(--ink-400)', lineHeight: 1.5 }}>
                    Drafts save in this browser automatically. Prices valid {PROPOSAL_VALID_DAYS} days; freight and install confirmed at order.
                  </p>
                </div>
              </aside>
            </div>
          </Wrap>
        </section>

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

/* ─────────────────────── printable proposal ─────────────────────── */

function ProposalDocument({ draft, totals }) {
  const today = new Date();
  const validUntil = new Date(today.getTime() + PROPOSAL_VALID_DAYS * 86400000);
  const fmt = (d) => d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const c = draft.client;

  return (
    <div className="ps-doc" aria-hidden>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #1A2610', paddingBottom: 14 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/logo.png" alt="" style={{ height: 36 }} />
            <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em' }}>{SITE.name}</span>
          </div>
          <div style={{ fontSize: 11, marginTop: 6 }}>{SITE.founder} · {SITE.email} · loogolabs.com</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em' }}>Proposal</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>{draft.number}</div>
          <div style={{ fontSize: 11 }}>Issued {fmt(today)}</div>
          <div style={{ fontSize: 11 }}>Valid until {fmt(validUntil)}</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 40, margin: '18px 0' }}>
        <div style={{ flex: 1 }}>
          <div className="ps-doc-label">Prepared for</div>
          {c.organization && <div style={{ fontWeight: 700 }}>{c.organization}</div>}
          {c.contact && <div>Attn: {c.contact}</div>}
          {c.email && <div>{c.email}</div>}
          {c.phone && <div>{c.phone}</div>}
        </div>
        {(c.project || c.location) && <div style={{ flex: 1 }}>
          <div className="ps-doc-label">Project</div>
          {c.project && <div style={{ fontWeight: 700 }}>{c.project}</div>}
          {c.location && <div>{c.location}</div>}
        </div>}
      </div>

      {draft.scope && (
        <div style={{ margin: '0 0 18px' }}>
          <div className="ps-doc-label">Scope</div>
          <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{draft.scope}</p>
        </div>
      )}

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
        <thead>
          <tr>
            {['SKU', 'Description', 'Qty', 'Unit price', 'Amount'].map((h, i) => (
              <th key={h} style={{ textAlign: i >= 2 ? 'right' : 'left', borderBottom: '1px solid #1A2610', padding: '6px 4px', whiteSpace: 'nowrap', fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {draft.lines.map((l) => {
            const p = PRODUCTS_BY_SKU.get(l.sku);
            return (
              <tr key={l.sku} style={{ breakInside: 'avoid' }}>
                <td style={{ ...docTd, whiteSpace: 'nowrap' }}>{p.sku}</td>
                <td style={docTd}><strong>{p.name}</strong><div style={{ color: '#415A27' }}>{p.specs.join(' · ')}</div></td>
                <td style={{ ...docTd, textAlign: 'right', whiteSpace: 'nowrap' }}>{num(l.qty)} <span style={{ color: '#5E7C3A' }}>{p.unit}</span></td>
                <td style={{ ...docTd, textAlign: 'right' }}>{usd(l.price)}</td>
                <td style={{ ...docTd, textAlign: 'right' }}>{usd(num(l.qty) * num(l.price))}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <table style={{ marginLeft: 'auto', marginTop: 12, fontSize: 12, minWidth: 260 }}>
        <tbody>
          <tr><td style={docSumTd}>Subtotal</td><td style={docSumVal}>{usd(totals.subtotal)}</td></tr>
          {totals.discount > 0 && <tr><td style={docSumTd}>Discount ({num(draft.discountPct)}%)</td><td style={docSumVal}>−{usd(totals.discount)}</td></tr>}
          {totals.shipping > 0 && <tr><td style={docSumTd}>Freight</td><td style={docSumVal}>{usd(totals.shipping)}</td></tr>}
          {totals.tax > 0 && <tr><td style={docSumTd}>Tax ({num(draft.taxPct)}%)</td><td style={docSumVal}>{usd(totals.tax)}</td></tr>}
          <tr><td style={{ ...docSumTd, fontWeight: 800, fontSize: 15, borderTop: '2px solid #1A2610' }}>Total</td>
            <td style={{ ...docSumVal, fontWeight: 800, fontSize: 15, borderTop: '2px solid #1A2610' }}>{usd(totals.total)}</td></tr>
        </tbody>
      </table>

      <div style={{ marginTop: 28, fontSize: 11, lineHeight: 1.5, color: '#263517', breakInside: 'avoid' }}>
        <div className="ps-doc-label">Terms</div>
        <p style={{ margin: 0 }}>
          Pricing valid for {PROPOSAL_VALID_DAYS} days from issue. Freight and installation are estimates until confirmed at order.
          Standard lead time 2–4 weeks from purchase order; amenities and custom signage may take longer. Purchase orders and
          tax-exemption certificates accepted. Net 30 for approved public agencies.
        </p>
        <div style={{ display: 'flex', gap: 40, marginTop: 36 }}>
          <div style={{ flex: 1, borderTop: '1px solid #1A2610', paddingTop: 4 }}>Accepted by (name, title)</div>
          <div style={{ width: 160, borderTop: '1px solid #1A2610', paddingTop: 4 }}>Date</div>
        </div>
      </div>
    </div>
  );
}

const docTd = { borderBottom: '1px solid #D8D3C6', padding: '7px 4px', verticalAlign: 'top' };
const docSumTd = { padding: '3px 12px 3px 0' };
const docSumVal = { padding: '3px 0', textAlign: 'right' };

/** Plain-text copy of the proposal, stored on the lead so it is readable in the admin. */
function proposalSummary(draft, totals) {
  const c = draft.client;
  const lines = draft.lines.map((l) => {
    const p = PRODUCTS_BY_SKU.get(l.sku);
    return `${num(l.qty)} × ${p.sku} ${p.name} @ ${usd(l.price)} = ${usd(num(l.qty) * num(l.price))}`;
  });
  return [
    `Proposal ${draft.number}`,
    [c.organization, c.project, c.location].filter(Boolean).join(' — '),
    c.phone ? `Phone: ${c.phone}` : '',
    '',
    ...lines,
    '',
    `Subtotal ${usd(totals.subtotal)}` +
      (totals.discount ? ` · Discount −${usd(totals.discount)}` : '') +
      (totals.shipping ? ` · Freight ${usd(totals.shipping)}` : '') +
      (totals.tax ? ` · Tax ${usd(totals.tax)}` : '') +
      ` · Total ${usd(totals.total)}`,
    draft.scope ? `\nScope: ${draft.scope}` : '',
  ].filter((s, i, a) => s !== '' || a[i - 1] !== '').join('\n').trim();
}

const PAGE_CSS = `
.ps-chips { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 6px; margin-bottom: 20px; scrollbar-width: thin; }
.ps-chip { flex-shrink: 0; padding: 8px 14px; border-radius: 999px; border: 1px solid var(--border-hair); background: var(--paper-000);
  font-family: var(--font-mono); font-size: 12px; letter-spacing: 0.04em; color: var(--ink-600); cursor: pointer; }
.ps-chip.is-active { background: var(--ink-900); border-color: var(--ink-900); color: var(--paper-000); }
.ps-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; }
.ps-card { display: flex; flex-direction: column; background: var(--paper-000); border: 1px solid var(--border-hair); border-radius: var(--radius-2); padding: 18px; }
.ps-builder { display: grid; grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr); gap: 28px; }
.ps-panel { background: var(--paper-100); border: 1px solid var(--border-hair); border-radius: var(--radius-2); padding: 18px; }
.ps-two { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.ps-three { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.ps-line { display: grid; grid-template-columns: minmax(0, 1fr) 76px 100px 96px 28px; align-items: center; gap: 12px;
  padding: 12px 14px; background: var(--paper-100); border: 1px solid var(--border-hair); border-radius: var(--radius-2); }
.ps-line-field { display: grid; gap: 3px; }
.ps-line-field span { font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-400); }
.ps-doc { display: none; }
.ps-doc-label { font-family: var(--font-mono); font-size: 9.5px; letter-spacing: 0.12em; text-transform: uppercase; color: #5E7C3A; margin-bottom: 4px; }
@media (max-width: 860px) {
  .ps-builder { grid-template-columns: 1fr; }
}
@media (max-width: 560px) {
  .ps-hide-sm { display: none; }
  .ps-line { grid-template-columns: 1fr 1fr 28px; }
  .ps-line > :first-child { grid-column: 1 / 3; }
  .ps-line > :nth-child(4) { grid-column: 1 / 3; text-align: left !important; }
  .ps-line > :last-child { grid-column: 3; grid-row: 1; }
  .ps-two, .ps-three { grid-template-columns: 1fr; }
}
@media print {
  @page { margin: 16mm; }
  body { background: #fff !important; }
  body * { visibility: hidden; }
  .ps-screen { display: none; }
  .ps-doc, .ps-doc * { visibility: visible; }
  .ps-doc { display: block; position: absolute; left: 0; top: 0; width: 100%; color: #1A2610; font-family: var(--font-body); font-size: 12px; }
}
`;
