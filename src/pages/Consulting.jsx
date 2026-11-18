import React from 'react';
import {
  MagnifyingGlass, Wrench, RocketLaunch, TrendUp, ArrowDown, ArrowRight, Check, X, ShieldCheck, Quotes, ThumbsUp, EnvelopeSimple,
} from '@phosphor-icons/react';
import { FounderVideo, fireCustom, pickVariant } from '../components/funnel/ScrollFunnel';
import Button from '../components/core/Button';
import Input from '../components/forms/Input';
import Select from '../components/forms/Select';
import { openBooking } from '../lib/booking';
import { useHref } from '../lib/i18n';
import { REFERENCES, CLIENT_LOGOS } from '../lib/references';
import { getSessionId } from '../lib/sessionTracker';
import { trackLead, leadMeta } from '../lib/metaEvents';
import { getAttribution, gaLead } from '../lib/attribution';
import '../styles/pages/landing.css';
import '../styles/pages/brand-design.css';
import '../styles/pages/consulting.css';

// Growth Engine: the high-ticket, application-only ads program (90 days, 3 clients a quarter).
// Price stays off this page; it is quoted on the strategy session. No AI receptionist here.
const SOURCE = 'consulting';
const SPOTS = 3;

const logos = REFERENCES.filter((n) => CLIENT_LOGOS[n]);
// The client row under the nav: transparent, one-colour logos straight on the cream.
const beltItems = logos.map((name) => ({ name, ...CLIENT_LOGOS[name], ...CLIENT_LOGOS[name].ticker }));
const tickerLogo = (name) => ({ ...CLIENT_LOGOS[name], ...CLIENT_LOGOS[name].ticker });

const hero = {
  h1: <>How many customers did your ads <em>lose you this month?</em></>,
  lede: 'The Loogo Labs Growth Engine is a 90-day program where we build, launch and scale your Meta and Google Ads system, from tracking to follow-up, so every dollar you spend is working and every lead gets worked.',
};
// Ad-matched headlines: tag the ad's utm_content with one of these keys.
const heroVariants = {
  ads: { h1: <>Are your ads making money, <em>or just spending it?</em></>, lede: hero.lede },
  leads: { h1: <>What happens to a lead <em>after it clicks your ad?</em></>, lede: hero.lede },
  scale: { h1: <>Ready to spend more on ads, <em>but not sure what's working?</em></>, lede: hero.lede },
};

const problems = [
  ['You can’t see what’s working.', 'Without the pixel, Conversions API and Google conversions set up right, you’re guessing which ads bring customers and which just burn budget.'],
  ['Leads go cold.', 'Someone fills out your form, and nobody follows up for hours. By then they’ve already called your competitor.'],
  ['Every month starts over.', 'New campaigns, new agencies, new guesses. The platforms never get the data they need to find your buyers.'],
];

// What we actually did for each client. No invented numbers: add a result line when the client signs off on one.
const references = [
  { name: 'Feche Consulting', work: 'Business automation consulting across healthcare projects: intake, follow-up and back-office workflows.', tag: 'Healthcare automation' },
  { name: 'Reef Ntwrks', work: 'Mapped and automated core business processes so the team spends less time on manual hand-offs.', tag: 'Process automation' },
  { name: 'Lugo’s Craft Distillery', work: 'Led the promotion for the Cards and Cocktails event: brand, story ads and launch campaign.', tag: 'Event launch' },
  { name: 'Engentfy', work: 'Ongoing marketing consulting: positioning, content and paid campaigns for a growing AI product.', tag: 'Marketing partner' },
];

const phases = [
  { name: 'Diagnose', weeks: 'Weeks 1–2', Icon: MagnifyingGlass, items: ['Audit of your ads, site and funnel', 'Offer and positioning', 'Competitor check', 'Tracking setup: pixel, Conversions API, Google conversions', '90-day targets'] },
  { name: 'Build', weeks: 'Weeks 3–6', Icon: Wrench, items: ['Landing page', 'Google Business Profile makeover', 'CRM pipeline', 'Lead follow-up automations', 'Review engine', 'First set of Meta and Google ads'] },
  { name: 'Launch', weeks: 'Weeks 7–9', Icon: RocketLaunch, items: ['Ads live', 'Speed-to-lead tested', 'Weekly 45-minute strategy calls', 'First round of fixes'] },
  { name: 'Scale', weeks: 'Weeks 10–12', Icon: TrendUp, items: ['Cut the losing ads', 'Scale the winners in steady 20% steps', 'Past Customer Review Drive', 'Final results report'] },
];

const included = [
  'Full audit and 90-day growth plan',
  'Meta and Google Ads built and managed',
  'Pixel, Conversions API and Google conversion tracking',
  'Landing page built for your offer',
  'CRM pipeline and lead follow-up automations',
  'Google Business Profile makeover',
  'Review engine and Past Customer Review Drive',
  'Weekly 45-minute strategy calls',
  'Text access, replies within one business day',
  'Day 0 vs Day 90 results report',
];

// Before/after of what we measure. Describes the change, not promised numbers.
const dayCompare = [
  ['Cost per lead', 'Unknown or guessed', 'Tracked to the cent'],
  ['Lead response time', 'Hours, sometimes days', 'Minutes, automated'],
  ['Booked calls', 'Counted by memory', 'Reported every week'],
  ['Ad decisions', 'Gut feeling', 'Made from real conversion data'],
  ['Reviews', 'Whenever someone remembers', 'Asked for automatically'],
];

const testimonials = [
  { name: 'Kristin Pitts', quote: 'Loogo Labs rebuilt our lead flow from the ground up. More qualified leads, better conversions, and for the first time our growth actually feels predictable instead of guesswork. The systems they set up work!!' },
  { name: 'Sally Butler', quote: 'Loogo Labs made running my business a lot simpler. Setup was straightforward, the automations actually work, and I’m not paying for a pile of separate subscriptions anymore. Support has been responsive too. Highly recommend.' },
];

const fitYes = [
  'You already sell a proven offer and have steady revenue',
  'You can invest at least $1,000 a month in ad spend',
  'You want a system that runs, not another one-off campaign',
  'You can answer and close the leads we send',
  'You’re ready to start in the next 30 days',
];
const fitNo = [
  'You’re still figuring out what you sell',
  'You want results without spending on ads',
  'You’re looking for the cheapest option',
  'You want to change everything every week',
  'You’re just exploring for later',
];

const faqs = [
  ['How long does it take?', 'The program runs 90 days. Tracking is set up in the first two weeks, the system is built by week six, and ads are live from week seven.'],
  ['Is ad spend included?', 'No. You pay Meta and Google directly for ad spend, so you always own your accounts and data. Our fee covers the strategy, build and management.'],
  ['What does the guarantee cover?', 'If you’re not happy within the first 30 days, we refund the fees you paid us. Ad spend paid to Meta or Google can’t be refunded.'],
  ['What do you need from me?', 'Access to your ad accounts, website and Google Business Profile, about an hour a week for our call, and someone ready to answer the leads.'],
  ['What happens after day 90?', 'You keep everything we built. You can run it yourself, or stay on with us as your Fractional CMO or on a Growth retainer.'],
  ['Why only 3 clients a quarter?', 'Every system is built by hand and David is on every account. Limiting spots keeps the work at the level we promise.'],
];

const industries = ['Choose one', 'Home services', 'Health, wellness or med spa', 'Professional services', 'Real estate', 'E-commerce or product brand', 'SaaS or tech', 'Creator or coach', 'Other'];
const revenues = ['Choose one', 'Under $10K a month', '$10K–$30K a month', '$30K–$100K a month', '$100K+ a month'];
const budgets = ['Choose one', 'Not running ads yet', 'Under $1K a month', '$1K–$3K a month', '$3K+ a month'];
const timelines = ['Choose one', 'Right away', 'Within 30 days', 'Just exploring'];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const utmNotes = () => {
  try {
    const params = new URLSearchParams(window.location.search);
    return ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']
      .filter((k) => params.get(k)).map((k) => `${k}=${params.get(k)}`).join('\n');
  } catch { return ''; }
};

// Application form: qualified applicants unlock booking; early-stage applicants get the newsletter path.
function ApplicationForm({ onBook, toHref }) {
  const [f, setF] = React.useState({ fullName: '', email: '', phone: '', company: '', website: '', industry: industries[0], revenue: revenues[0], budget: budgets[0], timeline: timelines[0], problem: '' });
  const [error, setError] = React.useState('');
  const [result, setResult] = React.useState(null);
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    if (!f.fullName.trim() || !EMAIL_RE.test(f.email.trim()) || !f.phone.trim()) {
      setError('Enter your name, a valid email and your phone number.');
      return;
    }
    if ([f.industry, f.revenue, f.budget, f.timeline].includes('Choose one')) {
      setError('Answer the four questions about your business so we can check the fit.');
      return;
    }
    setError('');
    const qualified = f.revenue !== revenues[1] && f.timeline !== 'Just exploring';
    const notes = [
      'Growth Engine application',
      `Qualified: ${qualified ? 'yes' : 'no'}`,
      f.website.trim() && `Website: ${f.website.trim()}`,
      `Industry: ${f.industry}`,
      `Monthly revenue: ${f.revenue}`,
      `Monthly ad budget: ${f.budget}`,
      `Start: ${f.timeline}`,
      f.problem.trim() && `Biggest problem: ${f.problem.trim()}`,
      utmNotes(),
    ].filter(Boolean).join('\n');
    const metaId = trackLead({ content_name: SOURCE });
    gaLead(SOURCE);
    fetch('/.netlify/functions/create-lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        full_name: f.fullName.trim(), email: f.email.trim(), phone: f.phone.trim(), company: f.company.trim(),
        business_type: f.industry, pain_point: f.problem.trim().slice(0, 500) || null,
        source: SOURCE, session_id: getSessionId(), notes, attribution: getAttribution(), ...leadMeta(metaId),
      }),
    }).catch(() => {});
    setResult(qualified ? 'fit' : 'early');
  };

  if (result === 'fit') {
    return (
      <div className="lp-card lp-card--forest lp-card--wide cs-apply__done" role="status">
        <div className="lp-result-icon"><ThumbsUp size={26} weight="duotone" aria-hidden="true" /></div>
        <h2 className="lp-h2">Looks like a fit. Ready to pick a time?</h2>
        <p className="lp-lede">Book your Growth Engine strategy session. We’ll review your ads and funnel before the call and come with a first plan.</p>
        <div className="bd-cta">
          <Button variant="primary" size="lg" iconRight={<ArrowRight size={16} weight="bold" />} onClick={onBook} fullWidth>Book My Strategy Session</Button>
        </div>
      </div>
    );
  }
  if (result === 'early') {
    return (
      <div className="lp-card lp-card--forest lp-card--wide cs-apply__done" role="status">
        <div className="lp-result-icon"><EnvelopeSimple size={26} weight="duotone" aria-hidden="true" /></div>
        <h2 className="lp-h2">Thanks. Can we start you with a plan first?</h2>
        <p className="lp-lede">The Growth Engine works best once revenue and timing are in place. You’re on our monthly newsletter, and our 90-Day Marketing Game Plan is the best next step for now.</p>
        <div className="bd-cta">
          <Button variant="primary" size="lg" iconRight={<ArrowRight size={16} weight="bold" />} onClick={() => { window.location.href = toHref('/game-plan'); }} fullWidth>Get the 90-Day Game Plan</Button>
        </div>
      </div>
    );
  }

  return (
    <form className="lp-card lp-card--forest lp-card--wide cs-apply" onSubmit={submit} noValidate aria-labelledby="cs-apply-title">
      <h2 className="lp-h2" id="cs-apply-title">Is your business ready for the Growth Engine?</h2>
      <p className="lp-lede">Takes about 2 minutes. We review every application and only take {SPOTS} businesses a quarter.</p>
      <div className="cs-apply__grid">
        <Input label="Full name" value={f.fullName} onChange={set('fullName')} placeholder="Jane Smith" autoComplete="name" />
        <Input label="Email" type="email" value={f.email} onChange={set('email')} placeholder="jane@yourbusiness.com" autoComplete="email" />
        <Input label="Phone" type="tel" value={f.phone} onChange={set('phone')} placeholder="(407) 555-0123" autoComplete="tel" />
        <Input label="Business name" value={f.company} onChange={set('company')} placeholder="Smith Plumbing" autoComplete="organization" />
        <Input label="Website (optional)" value={f.website} onChange={set('website')} placeholder="yourbusiness.com" autoComplete="url" />
        <Select label="Industry" options={industries} value={f.industry} onChange={set('industry')} />
        <Select label="Monthly revenue" options={revenues} value={f.revenue} onChange={set('revenue')} />
        <Select label="Monthly ad budget" options={budgets} value={f.budget} onChange={set('budget')} />
        <Select label="When do you want to start?" options={timelines} value={f.timeline} onChange={set('timeline')} />
        <Input label="Biggest marketing problem right now (optional)" value={f.problem} onChange={set('problem')} placeholder="Ads run but leads don’t turn into customers" />
      </div>
      {error && <p className="cs-apply__error" role="alert">{error}</p>}
      <div className="bd-cta">
        <Button type="submit" variant="primary" size="lg" iconRight={<ArrowRight size={16} weight="bold" />} fullWidth>Apply for a Spot</Button>
      </div>
      <p className="lp-fine">You’ll also get our monthly newsletter. Unsubscribe anytime.</p>
    </form>
  );
}

export default function Consulting() {
  const toHref = useHref();
  // Swapped in after mount so the pre-rendered HTML always hydrates cleanly.
  const [variant, setVariant] = React.useState(null);
  React.useEffect(() => { setVariant(pickVariant(heroVariants)); }, []);
  const h = { ...hero, ...variant };
  const toForm = () => {
    fireCustom('FunnelScrollToForm', { funnel: SOURCE });
    document.getElementById('get-started')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const onBook = () => openBooking({ content_name: SOURCE });
  const ApplyButton = ({ label = 'Apply for a Spot' }) => (
    <button type="button" className="cs-btn" onClick={toForm}>{label} <ArrowDown size={16} weight="bold" aria-hidden="true" /></button>
  );

  return (
    <main className="cs">
      <header className="cs-nav">
        <img src="/monogram.png" alt="Loogo Labs" className="cs-nav__logo" />
        <button type="button" className="cs-pill" onClick={toForm}>Apply</button>
      </header>

      <section className="cs-loop" aria-label="Selected clients">
        <p className="cs-loop__label">Trusted by</p>
        <ul className="cs-loop__track">
          {beltItems.map((item) => (
            <li key={item.name} className="cs-loop__item" style={{ '--th': `${item.th}px` }}>
              <img src={item.src} width={item.w} height={item.h} alt={item.caption ? '' : item.name} loading="eager" />
              {item.caption && <span className="cs-loop__cap">{item.caption}</span>}
            </li>
          ))}
        </ul>
      </section>

      <section className="cs-hero">
        <h1>{h.h1}</h1>
        <p className="cs-lede">{h.lede}</p>
        <div className="cs-video">
          <FounderVideo url="/consulting/consulting-video.mp4" poster="/consulting/consulting-video-poster.jpg" funnel={SOURCE} />
        </div>
        <div className="cs-hero__cta">
          <ApplyButton />
          <p className="cs-spots"><span className="cs-spots__dot" aria-hidden="true" />Only {SPOTS} new clients a quarter, by application</p>
        </div>
      </section>

      <section className="cs-light cs-problem" aria-labelledby="cs-problem-title">
        <div className="cs-split">
          <img src="/character/explain.webp" alt="" className="cs-character" width="320" height="320" loading="lazy" />
          <div>
            <h2 id="cs-problem-title">Spending on ads <em>but not sure they work?</em></h2>
            <ul className="cs-problems">
              {problems.map(([title, desc]) => (
                <li key={title}><h3>{title}</h3><p>{desc}</p></li>
              ))}
            </ul>
            <p className="cs-problem__close">Sound familiar? That’s not an ads problem. It’s a <strong>system</strong> problem.</p>
          </div>
        </div>
      </section>

      <section className="cs-refs" aria-labelledby="cs-refs-title">
        <h2 id="cs-refs-title">Who have we built <em>systems for?</em></h2>
        <ul className="cs-refs__grid">
          {references.map((r) => {
            const logo = tickerLogo(r.name);
            return (
              <li key={r.name} className="cs-ref">
                <div className="cs-ref__logo"><img src={logo.src} width={logo.w} height={logo.h} alt={r.name} loading="lazy" /></div>
                <span className="cs-ref__tag">{r.tag}</span>
                <p>{r.work}</p>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="cs-program" aria-labelledby="cs-program-title">
        <h2 id="cs-program-title">What happens <em>in your 90 days?</em></h2>
        <p className="cs-section-lede">One program, four phases. Every phase has a job, and you see the progress every week.</p>
        <ol className="cs-phases">
          {phases.map(({ name, weeks, Icon, items }, i) => (
            <li key={name} className="cs-phase">
              <div className="cs-phase__head">
                <span className="cs-phase__num" aria-hidden="true">0{i + 1}</span>
                <Icon size={24} weight="duotone" aria-hidden="true" />
              </div>
              <h3>{name}</h3>
              <p className="cs-phase__weeks">{weeks}</p>
              <ul>{items.map((it) => <li key={it}>{it}</li>)}</ul>
            </li>
          ))}
        </ol>
        <p className="cs-day90"><strong>Day 90:</strong> keep the system and run it yourself, or stay on with us as your Fractional CMO or on a Growth retainer.</p>
      </section>

      <section className="cs-light cs-included" aria-labelledby="cs-included-title">
        <h2 id="cs-included-title">What do you <em>get?</em></h2>
        <ul className="cs-checklist">
          {included.map((it) => <li key={it}><Check size={18} weight="bold" aria-hidden="true" />{it}</li>)}
        </ul>
        <p className="cs-fine">Ad spend and software usage are billed at cost and paid directly by you.</p>
      </section>

      <section className="cs-results" aria-labelledby="cs-results-title">
        <h2 id="cs-results-title">What changes <em>from Day 0 to Day 90?</em></h2>
        <div className="cs-compare" role="table" aria-label="Day 0 compared with Day 90">
          <div className="cs-compare__row cs-compare__row--head" role="row">
            <span role="columnheader">What we measure</span><span role="columnheader">Day 0</span><span role="columnheader">Day 90</span>
          </div>
          {dayCompare.map(([m, before, after]) => (
            <div key={m} className="cs-compare__row" role="row">
              <span role="rowheader">{m}</span><span role="cell" className="cs-compare__before">{before}</span><span role="cell" className="cs-compare__after">{after}</span>
            </div>
          ))}
        </div>
        <p className="cs-results__fine">You get this report with your real numbers at the end of the program. Results depend on your offer, price and market.</p>
      </section>

      <section className="cs-light cs-testimonials" aria-labelledby="cs-testi-title">
        <h2 id="cs-testi-title">What do <em>clients say?</em></h2>
        <div className="cs-quotes">
          {testimonials.map((t) => (
            <figure key={t.name} className="cs-quote">
              <Quotes size={28} weight="fill" aria-hidden="true" />
              <div className="cs-quote__stars" role="img" aria-label="5 out of 5 stars">★★★★★</div>
              <blockquote><p>{t.quote}</p></blockquote>
              <figcaption>{t.name} <span>· Facebook recommendation</span></figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="cs-fit" aria-labelledby="cs-fit-title">
        <h2 id="cs-fit-title">Is this <em>right for you?</em></h2>
        <div className="cs-fit__cols">
          <div className="cs-fit__col cs-fit__col--yes">
            <h3>This is for you if</h3>
            <ul>{fitYes.map((it) => <li key={it}><Check size={18} weight="bold" aria-hidden="true" />{it}</li>)}</ul>
          </div>
          <div className="cs-fit__col cs-fit__col--no">
            <h3>This is not for you if</h3>
            <ul>{fitNo.map((it) => <li key={it}><X size={18} weight="bold" aria-hidden="true" />{it}</li>)}</ul>
          </div>
        </div>
      </section>

      <section className="cs-light cs-founder" aria-labelledby="cs-founder-title">
        <div className="cs-split cs-split--founder">
          <img src="/founder-david-selva.jpg" alt="David Selva, founder of Loogo Labs" className="cs-founder__photo" loading="lazy" />
          <div>
            <h2 id="cs-founder-title">Who will be <em>building your system?</em></h2>
            <p>I’m David Selva, founder of Loogo Labs. I come from IT, project management and automation consulting, with a marketing degree from the University of Puerto Rico. That mix is the point: I don’t just run your ads, I build the tracking and follow-up behind them so you can see exactly what each dollar brings back.</p>
            <p>I work on every Growth Engine account myself, in English or Spanish.</p>
          </div>
        </div>
      </section>

      <section className="cs-guarantee" aria-labelledby="cs-guarantee-title">
        <ShieldCheck size={40} weight="duotone" aria-hidden="true" />
        <div>
          <h2 id="cs-guarantee-title">30-day money-back guarantee</h2>
          <p>If you’re not happy within the first 30 days, we refund the fees you paid us. Ad spend paid to Meta or Google is not refundable.</p>
        </div>
      </section>

      <section className="cs-faq" aria-labelledby="cs-faq-title">
        <h2 id="cs-faq-title">Questions <em>before you apply?</em></h2>
        <div className="cs-faq__list">
          {faqs.map(([q, a]) => (
            <details key={q} className="cs-faq__item">
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="cs-form bd" id="get-started">
        <ApplicationForm onBook={onBook} toHref={toHref} />
      </section>

      <footer className="cs-footer">
        <span>© {new Date().getFullYear()} Loogo Labs</span>
        <a href={toHref('/privacy')}>Privacy</a>
        <a href={toHref('/terms')}>Terms</a>
        <a href={toHref('/accessibility')}>Accessibility</a>
      </footer>
    </main>
  );
}
