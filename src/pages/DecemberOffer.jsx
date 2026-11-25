import React from 'react';
import { ArrowRight, Check, ShieldCheck, Clock, Phone } from '@phosphor-icons/react';
import { fireCustom } from '../components/funnel/ScrollFunnel';
import { openBooking } from '../lib/booking';
import { getSessionId } from '../lib/sessionTracker';
import { trackLead, leadMeta } from '../lib/metaEvents';
import { getAttribution, gaLead } from '../lib/attribution';
import { useHref } from '../lib/i18n';
import { REFERENCES, CLIENT_LOGOS } from '../lib/references';
import '../styles/pages/consulting.css';
import '../styles/pages/december-offer.css';

// /december-offer: December 2026 promotion. Meta and Google Ads set up and
// managed for $299 a month. Mobile-first: the qualification form sits right
// under the hero, and a sticky bar keeps the CTA one tap away on phones.
// The form is two steps (three taps, then four fields) and creates a lead with
// source december_ads_offer, then sends the visitor to book a call.
// Change the offer in one place: OFFER below.

const SOURCE = 'december_ads_offer';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const OFFER = {
  price: '$299',
  // Normal pricing: a percentage of the client's total ad investment, set by industry.
  standard: 'a % of your ad investment, by industry',
  deadline: 'December 31, 2026',
  spendCap: '$2,000',
  // Risk reversal. Confirm before publishing.
  guaranteeTitle: 'The live-in-14-days promise',
  guarantee: 'If your campaigns are not live within 14 days of your kickoff call, your second month of management is on us.',
};

// Past-client logos: the same transparent, one-colour logos as the homepage.
const LOGOS = REFERENCES.filter((n) => CLIENT_LOGOS[n]).map((name) => ({ name, ...CLIENT_LOGOS[name], ...CLIENT_LOGOS[name].ticker }));

const QUESTIONS = [
  { key: 'platforms', label: 'Where do you want to advertise?', options: ['Meta and Google', 'Meta only', 'Google only', 'Not sure yet'] },
  { key: 'budget', label: 'How much do you plan to invest in ads each month?', hint: 'Paid directly to Meta and Google, separate from the $299 management fee.', options: ['Under $500', '$500 to $1,000', '$1,000 to $2,000', 'Over $2,000'] },
  { key: 'timing', label: 'When do you want to start?', options: ['This month', 'January', 'Exploring'] },
];

const PAINS = [
  ['“I boosted a post and got likes. Not customers.”', 'We build every campaign around leads and booked calls, not reach.'],
  ['“Google Ads ate my budget in a week.”', 'We cut the searches that waste money and pace your budget across the month.'],
  ['“I honestly can’t tell if any of it works.”', 'Tracking goes in first, so every report shows your leads and your cost per lead.'],
];

const STACK = [
  ['Setup on Meta and Google', 'Business Manager, Google Ads, audiences, keywords, first campaigns and ad copy'],
  ['Conversion tracking', 'Meta Pixel, Conversions API, calls, forms and bookings'],
  ['Weekly optimization', 'Budget pacing, search term reviews, new ad tests and retargeting'],
  ['Monthly plain-English report', 'Leads, cost per lead, what we changed and what comes next'],
  ['A real person on call', 'Text or call David. No ticket queues.'],
];

const STEPS = [
  ['Answer 3 quick questions', 'Thirty seconds. We confirm the offer fits your budget and goals.'],
  ['Kickoff call and setup', 'We learn your customers and build tracking and campaigns. You approve every ad.'],
  ['Launch and improve', 'Weekly tuning, one clear report a month, and a real person to ask.'],
];

const FAQ = [
  [`Is ad spend included in the ${OFFER.price}?`, `No. Meta and Google bill your own card directly, so you always own your accounts and data. The ${OFFER.price} covers management for ad budgets up to ${OFFER.spendCap} a month.`],
  ['Am I locked into a contract?', `No. It’s month-to-month, and your ${OFFER.price} rate stays as long as you stay.`],
  ['I already run ads. Do I start over?', 'No. We audit what you have, keep your history and fix what is wasting money.'],
  ['Why only in December?', `We cap new ad clients each month so every account gets real attention. The rate is for businesses approved by ${OFFER.deadline}.`],
];

function QualifyForm({ onBook }) {
  const [step, setStep] = React.useState(1);
  const [answers, setAnswers] = React.useState({ platforms: '', budget: '', timing: '' });
  const [form, setForm] = React.useState({ fullName: '', email: '', phone: '', company: '' });
  const [error, setError] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const firstField = React.useRef(null);
  const ready = QUESTIONS.every((q) => answers[q.key]);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const pick = (key, value) => {
    setAnswers((a) => ({ ...a, [key]: value }));
    fireCustom('FunnelQualifyAnswer', { funnel: SOURCE, question: key });
  };

  const next = () => {
    if (!ready) { setError('Pick one answer for each question.'); return; }
    setError(''); setStep(2);
    fireCustom('FunnelQualifyStep2', { funnel: SOURCE });
    setTimeout(() => firstField.current?.focus({ preventScroll: true }), 50);
  };

  async function submit(e) {
    e.preventDefault();
    if (!form.fullName.trim() || !EMAIL_RE.test(form.email.trim())) { setError('Enter your name and a valid email.'); return; }
    if (form.phone.replace(/\D/g, '').length < 10) { setError('Enter a phone number so we can reach you.'); return; }
    if (!form.company.trim()) { setError('Tell us your business name or website.'); return; }
    setError(''); setBusy(true);
    const notes = [`December ads offer (${OFFER.price}/mo, Meta + Google management, setup included)`,
      `Platforms: ${answers.platforms}`, `Planned ad budget: ${answers.budget}`, `Start: ${answers.timing}`].join('\n');
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
    setStep(3);
  }

  if (step === 3) {
    return (
      <div className="do-form do-form--done" role="status">
        <span className="do-done__icon"><Check size={24} weight="bold" /></span>
        <h2>Your December rate is reserved.</h2>
        <p>Last step: pick a time for a 20-minute kickoff call. We’ll recommend a starting budget and schedule your setup.</p>
        <button type="button" className="do-btn" onClick={onBook}>Book my kickoff call <ArrowRight size={18} weight="bold" /></button>
        <a className="do-done__call" href="tel:+14077489150"><Phone size={16} weight="bold" aria-hidden="true" /> Or call (407) 748-9150</a>
      </div>
    );
  }

  return (
    <form className="do-form" onSubmit={step === 1 ? (e) => { e.preventDefault(); next(); } : submit} noValidate>
      <div className="do-progress" aria-hidden="true"><span style={{ width: step === 1 ? '50%' : '100%' }} /></div>
      <p className="do-eyebrow">Step {step} of 2 · {step === 1 ? 'Takes 30 seconds' : 'Almost done'}</p>
      <h2>{step === 1 ? 'See if your business qualifies' : 'Where should we send your plan?'}</h2>

      {step === 1 && QUESTIONS.map((q) => (
        <fieldset key={q.key} className="do-q">
          <legend>{q.label}</legend>
          {q.hint && <p className="do-q__hint">{q.hint}</p>}
          <div className={`do-opts do-opts--${q.options.length}`}>
            {q.options.map((o) => (
              <button key={o} type="button" aria-pressed={answers[q.key] === o} className={answers[q.key] === o ? 'is-on' : ''} onClick={() => pick(q.key, o)}>{o}</button>
            ))}
          </div>
        </fieldset>
      ))}

      {step === 2 && (
        <div className="do-fields">
          <label>Full name<input ref={firstField} value={form.fullName} onChange={set('fullName')} autoComplete="name" placeholder="Jane Smith" /></label>
          <label>Email<input type="email" inputMode="email" value={form.email} onChange={set('email')} autoComplete="email" placeholder="jane@yourbusiness.com" /></label>
          <label>Phone<input type="tel" inputMode="tel" value={form.phone} onChange={set('phone')} autoComplete="tel" placeholder="(407) 555-0123" /></label>
          <label>Business name or website<input value={form.company} onChange={set('company')} autoComplete="organization" placeholder="smithplumbing.com" /></label>
        </div>
      )}

      {error && <p className="do-error" role="alert">{error}</p>}

      {step === 1
        ? <button type="submit" className="do-btn" aria-disabled={!ready}>Continue <ArrowRight size={18} weight="bold" /></button>
        : <button type="submit" className="do-btn" disabled={busy}>{busy ? 'Sending…' : `Lock in ${OFFER.price} a month`} {!busy && <ArrowRight size={18} weight="bold" />}</button>}

      {step === 2
        ? <button type="button" className="do-back" onClick={() => { setError(''); setStep(1); }}>Back</button>
        : <p className="do-fine">No obligation. Management fee only. Ad spend is paid directly to Meta and Google.</p>}
    </form>
  );
}

export default function DecemberOffer() {
  const toHref = useHref();
  const formRef = React.useRef(null);
  const [formInView, setFormInView] = React.useState(true);

  React.useEffect(() => {
    const el = formRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(([entry]) => setFormInView(entry.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const toForm = () => {
    fireCustom('FunnelScrollToForm', { funnel: SOURCE });
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const onBook = () => openBooking({ content_name: SOURCE });

  return (
    <main className="do">
      <header className="do-nav">
        <a href={toHref('/')} aria-label="Loogo Labs home"><img src="/logo-horizontal.svg" alt="Loogo Labs" className="do-nav__logo" /></a>
        <a className="do-nav__call" href="tel:+14077489150"><Phone size={16} weight="bold" aria-hidden="true" /><span>(407) 748-9150</span></a>
      </header>

      <section className="do-hero">
        <div className="do-hero__copy">
          <p className="do-eyebrow">December offer · Meta and Google Ads</p>
          <h1>Your ads should bring customers. <em>Not just likes.</em></h1>
          <p className="do-lede">We set up, run and improve your Meta and Google Ads for one flat monthly rate, so every dollar has a job and a number you can check.</p>
          <div className="do-price">
            <span className="do-price__now">{OFFER.price}</span>
            <span className="do-price__per">/ month management fee</span>
            <span className="do-price__was">Normally {OFFER.standard}</span>
          </div>
          <p className="do-feenote"><strong>This is our fee to manage your ads.</strong> Your ad budget is separate: you decide how much to invest, and Meta and Google bill you for it directly.</p>
          <ul className="do-checks">
            <li><Check size={18} weight="bold" aria-hidden="true" />Setup and conversion tracking included</li>
            <li><Check size={18} weight="bold" aria-hidden="true" />Month-to-month. Cancel anytime</li>
            <li><Check size={18} weight="bold" aria-hidden="true" />You own your ad accounts and data</li>
          </ul>
          <div className="do-host">
            <span className="do-host__pic"><img src="/character/closeup-cool.webp" alt="" width="290" height="300" /></span>
            <p><strong>Hi, I’m David.</strong> I run your campaigns myself, and you can text or call me anytime. No account managers, no ticket queues.</p>
          </div>
          <p className="do-urgency"><Clock size={18} weight="bold" aria-hidden="true" /><span>Rate locks for businesses approved by <strong>{OFFER.deadline}</strong>. We take on only a few new clients each month.</span></p>
        </div>
        <div className="do-hero__form" id="qualify" ref={formRef}>
          <QualifyForm onBook={onBook} />
        </div>
      </section>

      <section className="cs-loop do-logos" aria-label="Past clients">
        <p className="cs-loop__label">Trusted by growing brands</p>
        <ul className="cs-loop__track">
          {LOGOS.map((item) => (
            <li key={item.name} className="cs-loop__item" style={{ '--th': `${item.th}px` }}>
              <img src={item.src} width={item.w} height={item.h} alt={item.caption ? '' : item.name} loading="lazy" />
              {item.caption && <span className="cs-loop__cap">{item.caption}</span>}
            </li>
          ))}
        </ul>
      </section>

      <section className="do-section" aria-labelledby="do-pain">
        <h2 id="do-pain">Running ads should not feel like <em>a second job.</em></h2>
        <div className="do-pains">
          {PAINS.map(([q, a]) => <div key={q} className="do-pain"><p className="do-pain__q">{q}</p><p>{a}</p></div>)}
        </div>
      </section>

      <section className="do-section do-section--alt" aria-labelledby="do-stack">
        <div className="do-stack">
          <div className="do-stack__intro">
            <p className="do-eyebrow">Everything you get</p>
            <h2 id="do-stack">A full ads team for less than <em>$10 a day.</em></h2>
            <p>The same work our retainer clients get, at a December rate, with nothing to sign long-term.</p>
          </div>
          <div className="do-stack__list">
            {STACK.map(([t, d]) => (
              <div key={t} className="do-stack__row">
                <div><strong>{t}</strong><span>{d}</span></div>
                <span className="do-stack__tag">Included</span>
              </div>
            ))}
            <div className="do-stack__total">
              <span>Normally: {OFFER.standard}</span>
              <strong>December fee: {OFFER.price}/mo</strong>
              <span className="do-stack__note">Plus the ad budget you choose, paid directly to Meta and Google.</span>
            </div>
          </div>
        </div>
      </section>

      <section className="do-section" aria-labelledby="do-promise">
        <div className="do-promise">
          <ShieldCheck size={56} weight="light" aria-hidden="true" />
          <div>
            <h2 id="do-promise">{OFFER.guaranteeTitle}</h2>
            <p>{OFFER.guarantee} You take on none of the risk.</p>
          </div>
        </div>
        <ol className="do-steps">
          {STEPS.map(([t, d], i) => <li key={t}><span>{String(i + 1).padStart(2, '0')}</span><strong>{t}</strong><p>{d}</p></li>)}
        </ol>
      </section>

      <section className="do-section do-section--alt" aria-labelledby="do-faq">
        <h2 id="do-faq">Quick answers</h2>
        <dl className="do-faq">
          {FAQ.map(([q, a]) => <div key={q}><dt>{q}</dt><dd>{a}</dd></div>)}
        </dl>
      </section>

      <section className="do-final">
        <div className="do-final__copy">
          <h2>Start January with ads <em>that already work.</em></h2>
          <p>Answer 3 questions. Lock in a {OFFER.price} monthly management fee before {OFFER.deadline}. You set the ad budget.</p>
          <button type="button" className="do-btn do-btn--inline" onClick={toForm}>Check if I qualify <ArrowRight size={18} weight="bold" /></button>
        </div>
        <div className="do-final__art" aria-hidden="true">
          <span className="do-final__sun" />
          <img src="/character/point.webp" alt="" width="368" height="743" loading="lazy" />
        </div>
      </section>

      <footer className="cs-footer do-footer">
        <span>© {new Date().getFullYear()} Loogo Labs LLC</span>
        <a href="tel:+14077489150">(407) 748-9150</a>
        <a href={toHref('/privacy')}>Privacy</a>
        <a href={toHref('/terms')}>Terms</a>
        <a href={toHref('/accessibility')}>Accessibility</a>
        <span className="do-tm">Meta, Facebook, Instagram and Google Ads are trademarks of their respective owners. Loogo Labs is an independent agency, not affiliated with or endorsed by Meta or Google.</span>
      </footer>

      <div className={`do-sticky${formInView ? '' : ' is-shown'}`} aria-hidden={formInView}>
        <div><strong>{OFFER.price}/mo</strong><span>Mgmt fee · ends Dec 31</span></div>
        <button type="button" className="do-btn" onClick={toForm} tabIndex={formInView ? -1 : 0}>Check if I qualify</button>
      </div>
    </main>
  );
}
