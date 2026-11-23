import React from 'react';
import { ArrowLeft, ArrowRight, Check, CalendarCheck } from '@phosphor-icons/react';
import Button from '../components/core/Button';
import Input from '../components/forms/Input';
import { fireCustom } from '../components/funnel/ScrollFunnel';
import { openBooking } from '../lib/booking';
import { getSessionId } from '../lib/sessionTracker';
import { trackLead, leadMeta } from '../lib/metaEvents';
import { getAttribution, gaLead } from '../lib/attribution';
import { useHref } from '../lib/i18n';
import '../styles/pages/landing.css';
import '../styles/pages/consulting.css';
import '../styles/pages/revenue-leak.css';

// /revenue-leak: sales qualified lead funnel built on one question,
// "Where are you losing revenue?". The visitor picks a leak in the hero, answers
// four qualifying questions (revenue, lead volume, timeline, decision maker),
// leaves contact details, then gets routed:
//   qualified  → book a Revenue Leak Audit call (sales qualified lead)
//   not yet    → the fix plan for their leak + the 90-day Game Plan (nurture)
// Every submission creates a lead (source revenue_leak) with the answers and
// the SQL / nurture tag in its notes, so the CRM shows who to call first.

const SOURCE = 'revenue_leak';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LEAKS = [
  {
    id: 'leads', label: 'Not enough leads coming in',
    cost: 'Your phone isn’t ringing enough, so every month starts from zero.',
    fixes: [
      'Pick one channel your best customer already uses and show up there every week.',
      'Put one clear offer on your site and profiles, with one button to act on it.',
      'Fix your Google Business Profile: photos, services, and fresh reviews.',
    ],
  },
  {
    id: 'convert', label: 'Leads come in, but they don’t buy',
    cost: 'You already paid to get them. Each one that walks is money spent twice.',
    fixes: [
      'Write down the three objections you hear most and answer them before the call.',
      'Add proof where people decide: reviews, before-and-afters, real numbers.',
      'Make the next step one small yes, not a big commitment.',
    ],
  },
  {
    id: 'followup', label: 'Leads go cold before we follow up',
    cost: 'Most buyers go with whoever answers first. A slow reply hands the sale away.',
    fixes: [
      'Send an automatic reply within five minutes of every inquiry.',
      'Follow up at least five times over two weeks: text, email and a call.',
      'Track every open lead in one place so nobody slips through.',
    ],
  },
  {
    id: 'retention', label: 'Customers buy once and never come back',
    cost: 'Selling to someone who already trusts you is your cheapest revenue.',
    fixes: [
      'Send past customers a reason to return every month: an update, an offer, a reminder.',
      'Ask every happy customer for a referral right after the job.',
      'Build one repeat offer: a plan, a membership or a scheduled service.',
    ],
  },
  {
    id: 'ads', label: 'Spending on ads with no clear return',
    cost: 'Without tracking, you can’t tell which dollars bring customers and which disappear.',
    fixes: [
      'Set up conversion tracking so every lead is tied to the ad that brought it.',
      'Send each ad to a page built for that one offer, not your homepage.',
      'Judge ads on cost per lead and booked calls, not clicks and likes.',
    ],
  },
  {
    id: 'unknown', label: 'I honestly don’t know where',
    cost: 'That’s the most expensive leak of all, because you can’t fix what you can’t see.',
    fixes: [
      'Count four numbers every week: leads, calls booked, sales closed, revenue.',
      'Ask every new customer how they found you and write it down.',
      'Find the step where the number drops the most. That’s your leak.',
    ],
  },
];

const QUESTIONS = [
  {
    key: 'revenue', title: 'What does your business bring in each month?',
    options: ['Under $10K', '$10K – $50K', '$50K – $250K', '$250K+'],
  },
  {
    key: 'volume', title: 'How many new leads do you get in a month?',
    options: ['Under 20', '20 – 100', '100 – 500', '500+'],
  },
  {
    key: 'timeline', title: 'How soon do you want this leak fixed?',
    options: ['Right now', 'In the next 90 days', 'Just looking for now'],
  },
  {
    key: 'decision', title: 'Who makes the call on growth and marketing spend?',
    options: ['I do', 'Me and a partner', 'Someone else'],
  },
];

// Sales qualified: real revenue, a timeline, and the person who decides.
function isQualified(a) {
  return a.revenue && a.revenue !== 'Under $10K'
    && a.timeline && a.timeline !== 'Just looking for now'
    && a.decision && a.decision !== 'Someone else';
}

// Steps: 0 = hero question, 1..4 = qualifying questions, 5 = contact, 6 = result.
const CONTACT = QUESTIONS.length + 1;
const RESULT = CONTACT + 1;

export default function RevenueLeak() {
  const toHref = useHref();
  const [step, setStep] = React.useState(0);
  const [leak, setLeak] = React.useState(null);
  const [answers, setAnswers] = React.useState({});
  const [form, setForm] = React.useState({ fullName: '', email: '', phone: '', company: '' });
  const [error, setError] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const headingRef = React.useRef(null);
  const topRef = React.useRef(null);

  const go = (n) => {
    setStep(n);
    setError('');
    fireCustom('FunnelStep', { funnel: SOURCE, step: n });
  };

  // Move focus to the new question so keyboard and screen reader users follow along.
  React.useEffect(() => {
    if (step === 0) return;
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    headingRef.current?.focus({ preventScroll: true });
  }, [step]);

  const pickLeak = (l) => { setLeak(l); fireCustom('RevenueLeakPicked', { funnel: SOURCE, leak: l.id }); go(1); };
  const pickAnswer = (key, value) => { setAnswers((a) => ({ ...a, [key]: value })); go(step + 1); };
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const qualified = isQualified(answers);

  async function submit(e) {
    e.preventDefault();
    if (!form.fullName.trim() || !EMAIL_RE.test(form.email.trim())) { setError('Enter your name and a valid email.'); return; }
    if (form.phone.replace(/\D/g, '').length < 10) { setError('Enter a phone number we can reach you at.'); return; }
    if (!form.company.trim()) { setError('Enter your business name.'); return; }
    setError(''); setBusy(true);
    const notes = [
      'Revenue Leak funnel: "Where are you losing revenue?"',
      `Qualification: ${qualified ? 'SALES QUALIFIED (book the audit call)' : 'Nurture (sent the fix plan and Game Plan)'}`,
      `Losing revenue at: ${leak?.label}`,
      `Monthly revenue: ${answers.revenue}`,
      `Leads per month: ${answers.volume}`,
      `Timeline: ${answers.timeline}`,
      `Decision maker: ${answers.decision}`,
    ].join('\n');
    const metaId = trackLead({ content_name: SOURCE });
    gaLead(SOURCE);
    if (qualified) fireCustom('QualifiedLead', { funnel: SOURCE, leak: leak?.id });
    try {
      await fetch('/.netlify/functions/create-lead', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: form.fullName.trim(), email: form.email.trim(), phone: form.phone.trim(), company: form.company.trim(),
          source: SOURCE, pain_point: leak?.label, decision_maker: answers.decision, job_volume: answers.volume,
          notes, session_id: getSessionId(), attribution: getAttribution(), ...leadMeta(metaId),
        }),
      });
    } catch {
      // Non-blocking: the visitor still sees their result.
    }
    setBusy(false);
    go(RESULT);
  }

  const onBook = () => openBooking({ content_name: SOURCE });
  const progress = Math.min(step, CONTACT) / CONTACT;

  return (
    <main className="cs rl">
      <header className="cs-nav">
        <a href={toHref('/')}><img src="/monogram.png" alt="Loogo Labs home" className="cs-nav__logo" /></a>
        {step > 0 && step < RESULT && (
          <button type="button" className="rl-back" onClick={() => go(step - 1)}><ArrowLeft size={16} weight="bold" aria-hidden="true" /> Back</button>
        )}
      </header>

      <div ref={topRef} className="rl-anchor" />

      {step === 0 && (
        <section className="cs-hero rl-hero" aria-labelledby="rl-q0">
          <h1 id="rl-q0">Where are you <em>losing revenue?</em></h1>
          <p className="cs-lede">Every business leaks money somewhere between the first click and the repeat sale. Pick the one that sounds most like you. It takes 60 seconds.</p>
          <div className="rl-options rl-options--hero" role="group" aria-labelledby="rl-q0">
            {LEAKS.map((l) => (
              <button key={l.id} type="button" className="rl-option" onClick={() => pickLeak(l)}>
                <span>{l.label}</span><ArrowRight size={18} weight="bold" aria-hidden="true" />
              </button>
            ))}
          </div>
        </section>
      )}

      {step > 0 && step < RESULT && (
        <div className="rl-progress" role="progressbar" aria-label="Your progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)}>
          <span style={{ width: `${progress * 100}%` }} />
        </div>
      )}

      {step >= 1 && step <= QUESTIONS.length && (() => {
        const q = QUESTIONS[step - 1];
        return (
          <section className="rl-step" aria-labelledby="rl-qh">
            <p className="rl-count">Question {step + 1} of {QUESTIONS.length + 1}</p>
            <h2 id="rl-qh" ref={headingRef} tabIndex={-1}>{q.title}</h2>
            <div className="rl-options" role="group" aria-labelledby="rl-qh">
              {q.options.map((o) => (
                <button key={o} type="button" className={`rl-option${answers[q.key] === o ? ' is-picked' : ''}`} aria-pressed={answers[q.key] === o} onClick={() => pickAnswer(q.key, o)}>
                  <span>{o}</span><ArrowRight size={18} weight="bold" aria-hidden="true" />
                </button>
              ))}
            </div>
          </section>
        );
      })()}

      {step === CONTACT && (
        <section className="rl-step" aria-labelledby="rl-ch">
          <h2 id="rl-ch" ref={headingRef} tabIndex={-1}>Where should we send your results?</h2>
          <p className="rl-sub">Your leak report is on the next screen.</p>
          <form className="rl-form" onSubmit={submit} noValidate>
            <Input label="Full name" value={form.fullName} onChange={set('fullName')} placeholder="Jane Smith" autoComplete="name" />
            <Input label="Email" type="email" value={form.email} onChange={set('email')} placeholder="jane@yourbusiness.com" autoComplete="email" />
            <Input label="Phone" type="tel" value={form.phone} onChange={set('phone')} placeholder="(407) 555-0123" autoComplete="tel" />
            <Input label="Business name" value={form.company} onChange={set('company')} placeholder="Smith Plumbing" autoComplete="organization" />
            {error && <p className="rl-error" role="alert">{error}</p>}
            <Button type="submit" variant="primary" size="lg" iconRight={<ArrowRight size={16} weight="bold" />} fullWidth disabled={busy}>{busy ? 'Sending…' : 'Show my results'}</Button>
            <p className="lp-fine">We use your details only to send your results and follow up about them. See our <a href={toHref('/privacy')}>privacy policy</a>.</p>
          </form>
        </section>
      )}

      {step === RESULT && leak && (
        <section className="rl-step rl-result" aria-labelledby="rl-rh">
          {qualified ? (
            <>
              <span className="rl-badge"><Check size={20} weight="bold" aria-hidden="true" /></span>
              <h2 id="rl-rh" ref={headingRef} tabIndex={-1}>You qualify for a Revenue Leak Audit.</h2>
              <p className="rl-sub">Your business is losing money at one point: <strong>{leak.label.toLowerCase()}</strong>. {leak.cost}</p>
              <div className="rl-audit">
                <h3>What happens on the 30-minute call</h3>
                <ol>
                  <li>We map your path from first click to repeat sale and find exactly where the money drops.</li>
                  <li>We put a dollar figure on the leak, using your own numbers.</li>
                  <li>You leave with the fix, in order, whether you work with us or not.</li>
                </ol>
                <Button variant="primary" size="lg" iconRight={<CalendarCheck size={18} weight="bold" />} onClick={onBook} fullWidth>Book my Revenue Leak Audit</Button>
                <p className="lp-fine">Spots are limited each week so every audit gets real attention.</p>
              </div>
            </>
          ) : (
            <>
              <h2 id="rl-rh" ref={headingRef} tabIndex={-1}>Here’s how to plug your leak.</h2>
              <p className="rl-sub">You’re losing money at one point: <strong>{leak.label.toLowerCase()}</strong>. {leak.cost}</p>
            </>
          )}

          <div className="rl-fixes">
            <h3>{qualified ? 'Start on these before the call' : 'Three fixes to start this week'}</h3>
            <ul>
              {leak.fixes.map((f) => <li key={f}><Check size={16} weight="bold" aria-hidden="true" /><span>{f}</span></li>)}
            </ul>
          </div>

          {!qualified && (
            <div className="rl-next">
              <h3>Want the full plan?</h3>
              <p>Our 90-day Marketing Game Plan walks you through foundation, build and growth, step by step.</p>
              <Button variant="primary" size="lg" iconRight={<ArrowRight size={16} weight="bold" />} onClick={() => { window.location.href = toHref('/game-plan'); }} fullWidth>Get the 90-day Game Plan</Button>
              <button type="button" className="cs-textcta" onClick={onBook}>Rather talk it through? Book a call <ArrowRight size={18} weight="bold" aria-hidden="true" /></button>
            </div>
          )}
        </section>
      )}

      <footer className="cs-footer">
        <span>© {new Date().getFullYear()} Loogo Labs LLC</span>
        <a href={toHref('/privacy')}>Privacy</a>
        <a href={toHref('/terms')}>Terms</a>
        <a href={toHref('/accessibility')}>Accessibility</a>
      </footer>
    </main>
  );
}
