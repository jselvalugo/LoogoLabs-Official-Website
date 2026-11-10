import React from 'react';
import { ArrowDown, ArrowRight, Printer, Check } from '@phosphor-icons/react';
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

// /game-plan: the free 90-day Marketing Game Plan. The plan itself is on the
// page (the value); the form gets it tailored on a free strategy call and
// creates a lead (source game_plan). New visitors can join the monthly
// newsletter. Readers who arrive from one of our emails carry ?s=<token>, so
// the form skips their name and email (create-lead looks them up).

const SOURCE = 'game_plan';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FOUNDATION = [
  ['Who is your best customer?', 'Not everyone who could buy. The one who buys most, pays on time and sends friends.'],
  ['What problem do you solve for them?', 'Write it the way they would say it, not the way you would.'],
  ['What is your one offer for the next 90 days?', 'One thing people can say yes to. Everything you publish points here.'],
  ['Where does that customer already spend time?', 'Pick one channel: a platform, a search, a community, a local spot.'],
  ['What number tells you it’s working?', 'Leads, booked calls or sales per week. Write today’s number down.'],
];

const PHASES = [
  {
    days: 'Days 1–30',
    name: 'Foundation',
    goal: 'Get clear and get measurable.',
    steps: [
      'Write your offer in one sentence: who it’s for, what they get, and why now.',
      'Fix the places people find you: Google Business Profile, website and social bios all point to one next step.',
      'Track every lead’s source: tagged links and one simple sheet or CRM.',
      'Choose one channel and a rhythm you can keep for 90 days.',
    ],
    done: 'Anyone can understand your offer in five seconds, reach you in one click, and you can count every lead.',
  },
  {
    days: 'Days 31–60',
    name: 'Build',
    goal: 'Turn attention into leads.',
    steps: [
      'Give people something to say yes to today: a free consult, a checklist, a quote.',
      'Publish on your channel every week, mixing proof (results, reviews), how-to and offer posts.',
      'Answer every lead the same day, with an automatic first reply so no one waits.',
      'Ask every happy customer for a review and a referral.',
    ],
    done: 'Leads arrive every week from your channel and none wait more than a day for a reply.',
  },
  {
    days: 'Days 61–90',
    name: 'Grow',
    goal: 'Double down on what works.',
    steps: [
      'Look at which posts, pages and sources brought leads who actually bought.',
      'Stop what didn’t work and move that time or budget to what did.',
      'Test a small, fixed ad budget behind your best-performing message.',
      'Plan your next 90 days with the numbers you have now.',
    ],
    done: 'You know what a lead costs you and which channel to grow next.',
  },
];

const WEEK = [
  ['Monday', 'Plan the week: 30 minutes.'],
  ['Tue – Thu', 'Create, publish and reach out.'],
  ['Friday', 'Check your number, follow up on every open lead: 30 minutes.'],
];

const CHALLENGES = [
  'Getting found by the right people',
  'Turning followers or visitors into customers',
  'No time to post consistently',
  'Ads aren’t paying off',
  'Not sure what to focus on',
  'Something else',
];

const field = {
  width: '100%', fontFamily: 'var(--font-body)', fontSize: 16, lineHeight: 1.4, color: 'var(--ink-900)',
  background: 'var(--paper-000)', padding: '12px 14px', borderRadius: 'var(--radius-2)', border: '1px solid var(--border-hair)',
};

function TailorForm({ token, onBook }) {
  const known = !!token;
  const [ask, setAsk] = React.useState(!known); // ask for name/email
  // The token is read after the first render, so follow it when it arrives.
  React.useEffect(() => { setAsk(!known); }, [known]);
  const [form, setForm] = React.useState({ fullName: '', email: '', company: '', website: '', challenge: '', goal: '', newsletter: true });
  const [error, setError] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  async function submit(e) {
    e.preventDefault();
    if (ask && (!form.fullName.trim() || !EMAIL_RE.test(form.email.trim()))) { setError('Enter your name and a valid email.'); return; }
    if (!form.company.trim() || !form.challenge) { setError('Tell us your business name and your biggest challenge.'); return; }
    setError(''); setBusy(true);
    const notes = ['Free Marketing Game Plan request',
      `Biggest challenge: ${form.challenge}`,
      form.website.trim() && `Website / social: ${form.website.trim()}`,
      form.goal.trim() && `A win in 90 days: ${form.goal.trim()}`].filter(Boolean).join('\n');
    const metaId = trackLead({ content_name: SOURCE });
    gaLead(SOURCE);
    try {
      const res = await fetch('/.netlify/functions/create-lead', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...(ask ? { full_name: form.fullName.trim(), email: form.email.trim(), newsletter: form.newsletter } : { subscriber_token: token }),
          company: form.company.trim(), source: SOURCE, notes, session_id: getSessionId(), attribution: getAttribution(),
          ...leadMeta(metaId),
        }),
      });
      if (res.status === 400 && !ask) { setAsk(true); setError('We couldn’t match your email link. Add your name and email and send again.'); setBusy(false); return; }
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
        <h2 className="lp-h2">You’re in. Now pick a time.</h2>
        <p className="lp-lede">Book your free 20-minute strategy call. We’ll walk you through your 90-day plan, built from what you just told us.</p>
        <div className="bd-cta">
          <Button variant="primary" size="lg" iconRight={<ArrowRight size={16} weight="bold" />} onClick={onBook} fullWidth>Book my free strategy call</Button>
        </div>
      </div>
    );
  }

  return (
    <form className="lp-card lp-card--forest lp-card--wide" onSubmit={submit} noValidate>
      <div className="lp-eyebrow">Free · tailored to you</div>
      <h2 className="lp-h2">Get this game plan built for your business</h2>
      <p className="lp-lede">Tell us a little about your business. On a free strategy call we turn this framework into your plan: your customer, your offer, your channel and your first 30 days.</p>
      {known && !ask && <p className="gp-known">Welcome from the Letter. We already have your email, so this takes 30 seconds.</p>}
      <div className="lp-fields bd-fields">
        {ask && <Input label="Full name" value={form.fullName} onChange={set('fullName')} placeholder="Jane Smith" />}
        {ask && <Input label="Email" type="email" value={form.email} onChange={set('email')} placeholder="jane@yourbusiness.com" />}
        <Input label="Business name" value={form.company} onChange={set('company')} placeholder="Smith Plumbing" />
        <Input label="Website or social (optional)" value={form.website} onChange={set('website')} placeholder="smithplumbing.com or @smithplumbing" />
        <div style={{ display: 'grid', gap: 6 }}>
          <label htmlFor="gp-challenge" className="ll-eyebrow" style={{ color: 'var(--ink-900)' }}>Biggest marketing challenge</label>
          <select id="gp-challenge" value={form.challenge} onChange={set('challenge')} style={field}>
            <option value="">Choose one</option>
            {CHALLENGES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div style={{ display: 'grid', gap: 6 }}>
          <label htmlFor="gp-goal" className="ll-eyebrow" style={{ color: 'var(--ink-900)' }}>What would make the next 90 days a win? (optional)</label>
          <textarea id="gp-goal" rows={3} value={form.goal} onChange={set('goal')} placeholder="10 new customers a month, a full calendar in January…" style={{ ...field, resize: 'vertical' }} />
        </div>
      </div>
      {ask && (
        <label className="gp-check"><input type="checkbox" checked={form.newsletter} onChange={set('newsletter')} /> Send me the Loogo Labs Letter: marketing news and ideas, once a month.</label>
      )}
      {error && <p className="gp-error" role="alert">{error}</p>}
      <div className="bd-cta">
        <Button type="submit" variant="primary" size="lg" iconRight={<ArrowRight size={16} weight="bold" />} fullWidth disabled={busy}>{busy ? 'Sending…' : 'Get my tailored plan'}</Button>
      </div>
      <p className="lp-fine">Free, no obligation. We use your details only to prepare your plan{ask ? ' and, if you ticked the box, to send the Letter' : ''}.</p>
    </form>
  );
}

function Newsletter() {
  const [email, setEmail] = React.useState('');
  const [hp, setHp] = React.useState('');
  const [state, setState] = React.useState('idle'); // idle | busy | done
  const [error, setError] = React.useState('');
  async function submit(e) {
    e.preventDefault();
    if (!EMAIL_RE.test(email.trim())) { setError('Enter a valid email.'); return; }
    setError(''); setState('busy');
    try {
      const res = await fetch('/.netlify/functions/email-subscribe', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), tag: 'newsletter', website: hp }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Something went wrong. Try again.');
      fireCustom('NewsletterSignup', { funnel: SOURCE });
      setState('done');
    } catch (err) { setError(err.message); setState('idle'); }
  }
  return (
    <section className="gp-news" aria-labelledby="gp-news-title">
      <p className="gp-kicker">The Loogo Labs Letter</p>
      <h2 id="gp-news-title">Want the latest in marketing, <em>without the noise?</em></h2>
      <p className="gp-news__lede">What’s working in marketing right now, a plan you can use, and one thing to try this week. Delivered once a month. Unsubscribe anytime.</p>
      {state === 'done' ? (
        <p className="gp-news__done"><Check size={18} weight="bold" /> You’re subscribed. Look for the next Letter in your inbox.</p>
      ) : (
        <form className="gp-news__form" onSubmit={submit} noValidate>
          <input type="email" aria-label="Email" placeholder="you@yourbusiness.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" className="gp-hp" value={hp} onChange={(e) => setHp(e.target.value)} />
          <button type="submit" disabled={state === 'busy'}>{state === 'busy' ? 'Subscribing…' : 'Subscribe'}</button>
        </form>
      )}
      {error && <p className="gp-error" role="alert">{error}</p>}
    </section>
  );
}

export default function GamePlan() {
  const toHref = useHref();
  // Read the email-reader token once, then drop it from the address bar so it
  // is not copied or shared with the link.
  const [token, setToken] = React.useState(null);
  React.useEffect(() => {
    const url = new URL(window.location.href);
    const s = url.searchParams.get('s');
    if (s) {
      setToken(s);
      url.searchParams.delete('s');
      window.history.replaceState({}, '', url.pathname + (url.search || '') + url.hash);
    }
  }, []);
  const go = (id) => () => {
    if (id === 'get-started') fireCustom('FunnelScrollToForm', { funnel: SOURCE });
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const onBook = () => openBooking({ content_name: SOURCE });

  return (
    <main className="cs gp">
      <header className="cs-nav">
        <a href={toHref('/')}><img src="/monogram.png" alt="Loogo Labs" className="cs-nav__logo" /></a>
        <button type="button" className="cs-pill" onClick={go('get-started')}>Get my plan</button>
      </header>

      <section className="cs-hero gp-hero">
        <h1>Stop guessing at marketing. <em>Run a 90-day game plan.</em></h1>
        <p className="cs-lede">Posting more and boosting more rarely fixes it. A plan does. This is the framework we use with clients, free. Work through it below, then get it built for your business.</p>
        <div className="gp-hero__ctas">
          <Button variant="primary" size="lg" iconRight={<ArrowDown size={16} weight="bold" />} onClick={go('plan')}>Read the plan</Button>
          <button type="button" className="cs-textcta" onClick={go('get-started')}>Get it tailored to me <ArrowRight size={18} weight="bold" /></button>
        </div>
      </section>

      <section className="gp-section" id="plan" aria-labelledby="gp-found-title">
        <p className="gp-kicker">Before day 1</p>
        <h2 id="gp-found-title">Answer five questions. <em>Write the answers down.</em></h2>
        <ol className="gp-found">
          {FOUNDATION.map(([q, hint], i) => (
            <li key={q}><span className="gp-num">{i + 1}</span><div><strong>{q}</strong><p>{hint}</p></div></li>
          ))}
        </ol>
      </section>

      <section className="gp-section gp-phases-wrap" aria-label="The 90-day plan">
        <p className="gp-kicker">The plan</p>
        <h2>Three phases. <em>Thirty days each.</em></h2>
        <div className="gp-phases">
          {PHASES.map((p) => (
            <article key={p.name} className="gp-phase">
              <p className="gp-phase__days">{p.days}</p>
              <h3>{p.name}</h3>
              <p className="gp-phase__goal">{p.goal}</p>
              <ul>{p.steps.map((s) => <li key={s}><Check size={16} weight="bold" aria-hidden="true" /><span>{s}</span></li>)}</ul>
              <p className="gp-phase__done"><strong>Done when:</strong> {p.done}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="gp-section" aria-labelledby="gp-week-title">
        <p className="gp-kicker">Keep it going</p>
        <h2 id="gp-week-title">One hour of planning a week. <em>That’s the whole habit.</em></h2>
        <dl className="gp-week">
          {WEEK.map(([d, t]) => <div key={d}><dt>{d}</dt><dd>{t}</dd></div>)}
        </dl>
        <button type="button" className="cs-textcta gp-print" onClick={() => window.print()}><Printer size={18} weight="bold" /> Save or print this plan</button>
      </section>

      <section className="cs-form bd gp-form" id="get-started">
        <TailorForm token={token} onBook={onBook} />
      </section>

      {!token && <Newsletter />}

      <footer className="cs-footer">
        <span>© {new Date().getFullYear()} Loogo Labs LLC</span>
        <a href={toHref('/privacy')}>Privacy</a>
        <a href={toHref('/terms')}>Terms</a>
      </footer>
    </main>
  );
}
