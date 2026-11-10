import React from 'react';
import { ArrowDown, ArrowRight, Check } from '@phosphor-icons/react';
import Button from '../components/core/Button';
import Input from '../components/forms/Input';
import { fireCustom } from '../components/funnel/ScrollFunnel';
import { openBooking } from '../lib/booking';
import { getSessionId } from '../lib/sessionTracker';
import { trackLead, leadMeta } from '../lib/metaEvents';
import { getAttribution, gaLead } from '../lib/attribution';
import { useHref } from '../lib/i18n';
import '../styles/pages/landing.css';
import '../styles/pages/brand-design.css';
import '../styles/pages/consulting.css';
import '../styles/pages/game-plan.css';
import '../styles/pages/november-offer.css';

// /november-offer: November 2026 promotion. Meta and Google Ads set up and
// managed for one flat monthly rate. Built on the consulting landing (.cs) and
// the Game Plan sections (.gp). The form creates a lead (source
// november_ads_offer), then sends the visitor to book a call.
// Change the offer in one place: OFFER below.

const SOURCE = 'november_ads_offer';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const OFFER = {
  price: '$299',
  deadline: 'November 30, 2026',
  spendCap: '$2,000',
};

const PAINS = [
  ['“I boosted a post and got likes. Not customers.”', 'Boosting buys attention, not action. Without the right objective, audience and offer, Meta spends your money on people who will never call.'],
  ['“Google Ads ate my budget in a week.”', 'Broad keywords and no negative list mean you pay for searches that have nothing to do with what you sell.'],
  ['“I honestly can’t tell if any of it works.”', 'If calls, forms and bookings aren’t tracked, every decision is a guess. That’s the most expensive way to advertise.'],
];

const INCLUDED = [
  {
    name: 'Setup',
    items: [
      'Meta Business Manager and ad account setup or cleanup',
      'Google Ads account setup or an audit of your existing one',
      'Meta Pixel and Conversions API installed',
      'Google conversion tracking for calls, forms and bookings',
      'Audiences, keywords and negative keyword lists',
      'First campaigns built, with ad copy written for you',
    ],
  },
  {
    name: 'Ongoing management',
    items: [
      'Weekly optimization on both platforms',
      'Budget pacing so you never overspend',
      'Search term reviews to cut wasted clicks',
      'New ad variations tested every month',
      'Retargeting for people who visited but didn’t buy',
    ],
  },
  {
    name: 'Clear reporting',
    items: [
      'A monthly report in plain English',
      'Leads, cost per lead and what drove them',
      'What we changed and why',
      'Recommendations for next month',
      'A real person to reply when you have questions',
    ],
  },
];

const STEPS = [
  ['Book a quick call', 'Tell us what you sell, who buys it and what a new customer is worth to you.'],
  ['We set everything up', 'Accounts, tracking, audiences and campaigns. You approve the ads before anything goes live.'],
  ['We launch and improve', 'Your ads run, we tune them every week, and you see the results in one simple report.'],
];

const FAQ = [
  [`Is ad spend included in the ${OFFER.price}?`, `No. The ${OFFER.price} covers setup and management. Your ad budget is billed directly by Meta and Google to your own card, so you always own your accounts and your data.`],
  ['How much should I spend on ads?', `We’ll recommend a starting budget on our call based on your market and goals. This offer covers ad budgets up to ${OFFER.spendCap} a month across both platforms.`],
  ['I already have ad accounts. Do I start over?', 'No. We audit what you have, keep what works and fix what doesn’t. Your history stays with you.'],
  ['Am I locked into a contract?', 'No. It’s month-to-month. We earn your business every month.'],
  ['Why only in November?', `We take on a limited number of new ad clients each month so every account gets real attention. This rate is for businesses that sign up by ${OFFER.deadline}.`],
];

const BUDGETS = ['Under $500 a month', '$500 to $1,000 a month', '$1,000 to $2,000 a month', 'More than $2,000 a month', 'Not sure yet'];
const PLATFORMS = ['Meta and Google', 'Meta only (Facebook and Instagram)', 'Google only', 'Not sure yet'];

const field = {
  width: '100%', fontFamily: 'var(--font-body)', fontSize: 16, lineHeight: 1.4, color: 'var(--ink-900)',
  background: 'var(--paper-000)', padding: '12px 14px', borderRadius: 'var(--radius-2)', border: '1px solid var(--border-hair)',
};

function ClaimForm({ onBook }) {
  const [form, setForm] = React.useState({ fullName: '', email: '', phone: '', company: '', website: '', budget: '', platforms: '' });
  const [error, setError] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    if (!form.fullName.trim() || !EMAIL_RE.test(form.email.trim())) { setError('Enter your name and a valid email.'); return; }
    if (!form.company.trim()) { setError('Tell us your business name.'); return; }
    setError(''); setBusy(true);
    const notes = [`November ads offer (${OFFER.price}/mo, Meta + Google management, setup included)`,
      form.platforms && `Platforms: ${form.platforms}`,
      form.budget && `Planned ad budget: ${form.budget}`,
      form.website.trim() && `Website / social: ${form.website.trim()}`].filter(Boolean).join('\n');
    const metaId = trackLead({ content_name: SOURCE });
    gaLead(SOURCE);
    try {
      await fetch('/.netlify/functions/create-lead', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: form.fullName.trim(), email: form.email.trim(), phone: form.phone.trim(),
          company: form.company.trim(), source: SOURCE, notes, session_id: getSessionId(), attribution: getAttribution(),
          ...leadMeta(metaId),
        }),
      });
    } catch {
      // Non-blocking: the visitor still reaches the booking step.
    }
    setBusy(false);
    setDone(true);
  }

  if (done) {
    return (
      <div className="lp-card lp-card--forest lp-card--wide gp-done">
        <span className="gp-done__icon"><Check size={22} weight="bold" /></span>
        <h2 className="lp-h2">Your November rate is reserved. Now pick a time.</h2>
        <p className="lp-lede">Book a 20-minute call. We’ll look at your goals, recommend a starting budget and get your setup scheduled.</p>
        <div className="bd-cta">
          <Button variant="primary" size="lg" iconRight={<ArrowRight size={16} weight="bold" />} onClick={onBook} fullWidth>Book my call</Button>
        </div>
      </div>
    );
  }

  return (
    <form className="lp-card lp-card--forest lp-card--wide" onSubmit={submit} noValidate>
      <h2 className="lp-h2">Claim the November rate</h2>
      <p className="lp-lede">Meta and Google Ads, set up and managed, for {OFFER.price} a month. Tell us about your business and we’ll reach out to schedule your setup.</p>
      <div className="lp-fields bd-fields">
        <Input label="Full name" value={form.fullName} onChange={set('fullName')} placeholder="Jane Smith" />
        <Input label="Email" type="email" value={form.email} onChange={set('email')} placeholder="jane@yourbusiness.com" />
        <Input label="Phone (optional)" type="tel" value={form.phone} onChange={set('phone')} placeholder="(407) 555-0123" />
        <Input label="Business name" value={form.company} onChange={set('company')} placeholder="Smith Plumbing" />
        <Input label="Website or social (optional)" value={form.website} onChange={set('website')} placeholder="smithplumbing.com or @smithplumbing" />
        <div style={{ display: 'grid', gap: 6 }}>
          <label htmlFor="no-platforms" className="ll-eyebrow" style={{ color: 'var(--ink-900)' }}>Where do you want to advertise?</label>
          <select id="no-platforms" value={form.platforms} onChange={set('platforms')} style={field}>
            <option value="">Choose one</option>
            {PLATFORMS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div style={{ display: 'grid', gap: 6 }}>
          <label htmlFor="no-budget" className="ll-eyebrow" style={{ color: 'var(--ink-900)' }}>Planned monthly ad budget</label>
          <select id="no-budget" value={form.budget} onChange={set('budget')} style={field}>
            <option value="">Choose one</option>
            {BUDGETS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
      {error && <p className="gp-error" role="alert">{error}</p>}
      <div className="bd-cta">
        <Button type="submit" variant="primary" size="lg" iconRight={<ArrowRight size={16} weight="bold" />} fullWidth disabled={busy}>{busy ? 'Sending…' : `Lock in ${OFFER.price} a month`}</Button>
      </div>
      <p className="lp-fine">No obligation. Sign up by {OFFER.deadline}. Ad spend is paid directly to Meta and Google.</p>
    </form>
  );
}

export default function NovemberOffer() {
  const toHref = useHref();
  const go = (id) => () => {
    if (id === 'claim') fireCustom('FunnelScrollToForm', { funnel: SOURCE });
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const onBook = () => openBooking({ content_name: SOURCE });

  return (
    <main className="cs gp no">
      <header className="cs-nav">
        <a href={toHref('/')}><img src="/logo-horizontal.svg" alt="Loogo Labs" className="cs-nav__logo no-nav__logo" /></a>
        <button type="button" className="cs-pill" onClick={go('claim')}>Claim the November rate</button>
      </header>

      <section className="no-hero">
        <div className="no-hero__copy">
          <h1>You’re paying for ads. <em>Are they paying you back?</em></h1>
          <p className="cs-lede">Most small businesses boost a post, watch the budget disappear and never learn what it brought in. This November, Loogo Labs sets up and runs your Meta and Google Ads for one flat monthly rate, so every dollar has a job and a number attached to it.</p>
          <div className="gp-hero__ctas no-hero__ctas">
            <Button variant="primary" size="lg" iconRight={<ArrowRight size={16} weight="bold" />} onClick={go('claim')}>Claim the November rate</Button>
            <button type="button" className="cs-textcta" onClick={go('included')}>See what’s included <ArrowDown size={18} weight="bold" /></button>
          </div>
        </div>
        <aside className="no-card" aria-label="November offer">
          <p className="no-card__label">November offer</p>
          <p className="no-card__price"><span>{OFFER.price}</span> per month</p>
          <p className="no-card__what">Meta and Google Ads, set up and managed for you.</p>
          <ul>
            <li><Check size={16} weight="bold" aria-hidden="true" />Full setup included, no setup fee</li>
            <li><Check size={16} weight="bold" aria-hidden="true" />Facebook, Instagram and Google Search</li>
            <li><Check size={16} weight="bold" aria-hidden="true" />Conversion tracking that shows what works</li>
            <li><Check size={16} weight="bold" aria-hidden="true" />Month-to-month, no long contract</li>
          </ul>
          <button type="button" className="no-card__cta" onClick={go('claim')}>Lock in {OFFER.price} a month <ArrowRight size={16} weight="bold" /></button>
          <p className="no-card__fine">Sign up by {OFFER.deadline}. Ad spend is paid directly to Meta and Google. For ad budgets up to {OFFER.spendCap} a month.</p>
        </aside>
      </section>

      <section className="gp-section" aria-labelledby="no-pain-title">
        <h2 id="no-pain-title">Running ads yourself is a second job. <em>One you never applied for.</em></h2>
        <p className="no-sub">You started a business to serve customers, not to learn bid strategies at midnight. If any of this sounds familiar, you’re not behind. You’re just doing it alone.</p>
        <dl className="gp-week no-pains">
          {PAINS.map(([q, a]) => <div key={q}><dt>{q}</dt><dd>{a}</dd></div>)}
        </dl>
      </section>

      <section className="gp-section no-wide" id="included" aria-labelledby="no-inc-title">
        <h2 id="no-inc-title">Everything it takes to run your ads. <em>Handled for you.</em></h2>
        <p className="no-sub">Setup is part of the {OFFER.price} a month. You don’t pay extra to get started.</p>
        <div className="gp-phases">
          {INCLUDED.map((p) => (
            <article key={p.name} className="gp-phase">
              <h3>{p.name}</h3>
              <ul>{p.items.map((s) => <li key={s}><Check size={16} weight="bold" aria-hidden="true" /><span>{s}</span></li>)}</ul>
            </article>
          ))}
        </div>
      </section>

      <section className="gp-section" aria-labelledby="no-how-title">
        <h2 id="no-how-title">Three steps. <em>Then you get back to work.</em></h2>
        <ol className="gp-found">
          {STEPS.map(([q, hint], i) => (
            <li key={q}><span className="gp-num">{i + 1}</span><div><strong>{q}</strong><p>{hint}</p></div></li>
          ))}
        </ol>
      </section>

      <section className="gp-section" aria-labelledby="no-faq-title">
        <h2 id="no-faq-title">Good questions.</h2>
        <dl className="no-faq">
          {FAQ.map(([q, a]) => <div key={q}><dt>{q}</dt><dd>{a}</dd></div>)}
        </dl>
      </section>

      <section className="cs-form bd gp-form" id="claim">
        <ClaimForm onBook={onBook} />
      </section>

      <footer className="cs-footer">
        <span>© {new Date().getFullYear()} Loogo Labs LLC</span>
        <a href="tel:+14077489150">(407) 748-9150</a>
        <a href={toHref('/privacy')}>Privacy</a>
        <a href={toHref('/terms')}>Terms</a>
        <a href={toHref('/accessibility')}>Accessibility</a>
      </footer>
    </main>
  );
}
