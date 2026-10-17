import React from 'react';
import { ArrowLeft, ArrowRight, X, Check, ThumbsUp, PenNib, Palette, BookOpen, Storefront } from '@phosphor-icons/react';
import Badge from '../components/feedback/Badge';
import Button from '../components/core/Button';
import Input from '../components/forms/Input';
import { openBooking } from '../lib/booking';
import { getSessionId } from '../lib/sessionTracker';
import { useHref } from '../lib/i18n';
import '../styles/pages/landing.css';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const fire = (event, params) => { if (window.fbq) window.fbq('track', event, params); };
const fireCustom = (event, params) => { if (window.fbq) window.fbq('trackCustom', event, params); };
const trackBook = () => { fire('Schedule'); openBooking(); };

// Ad traffic lands here with utm_* tags; keep them with the lead so the admin
// can see which ad a lead came from, not just which page.
const utmNotes = () => {
  try {
    const params = new URLSearchParams(window.location.search);
    return ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']
      .filter((k) => params.get(k))
      .map((k) => `${k}=${params.get(k)}`)
      .join('\n');
  } catch { return ''; }
};

/* ─────────────────────── primitives ─────────────────────── */
const Card = ({ children, wide, tone = 'glass', className = '' }) => (
  <div className={`lp-card lp-card--${tone}${wide ? ' lp-card--wide' : ''} ${className}`}>{children}</div>
);

const Eyebrow = ({ children }) => <div className="lp-eyebrow">{children}</div>;

const StepHeading = ({ children }) => <h2 className="lp-h2">{children}</h2>;

const ContinueRow = ({ onNext, label, variant = 'inverse' }) => (
  <div className="lp-continue">
    <Button variant={variant} size="lg" iconRight={<ArrowRight size={16} weight="bold" />} onClick={onNext} fullWidth>{label}</Button>
  </div>
);

/* ─────────────────────── data ─────────────────────── */
const problems = [
  ['You look smaller than you are', 'A homemade logo and mismatched colors make customers assume you charge less, and you end up competing on price.'],
  ['Nothing matches', "Your truck, your website, your Facebook page and your business cards all look like different companies. People don't remember what they can't recognize."],
  ['Every new design starts from zero', 'Without a brand guide, every flyer and post means guessing at fonts and colors again, and it shows.'],
];

const deliverables = [
  ['Custom Logo', 'A primary logo plus simplified versions that work on a truck wrap, a favicon, and everything in between.', PenNib],
  ['Visual Identity', 'Your color palette and typography, chosen to fit your market and stand apart from local competitors.', Palette],
  ['Brand Guidelines', 'One reference document so anyone designing for you — printer, web developer, new hire — gets it right.', BookOpen],
  ['Ready-To-Use Files', 'Print and digital formats for signage, social profiles, uniforms and your website, delivered organized.', Storefront],
];

const process = [
  ['Discovery call', 'We learn your business, your customers, and who you are up against.'],
  ['Concepts', 'You see distinct logo directions built around that brief.'],
  ['Refine', 'We sharpen the direction you pick until it feels right.'],
  ['Deliver', 'Final files and your brand guide, ready to use everywhere.'],
];

const testimonialImages = [
  { src: '/testimonial-sally-butler.png', alt: '5-star Facebook recommendation from Sally Butler for Loogo Labs' },
  { src: '/testimonial-kristin-pitts.png', alt: '5-star Facebook recommendation from Kristin Pitts for Loogo Labs' },
];

function TestimonialImage({ src, alt }) {
  const [failed, setFailed] = React.useState(false);
  if (failed) return null;
  return <img src={src} alt={alt} onError={() => setFailed(true)} className="lp-proof__img" />;
}

const QUIZ_STEPS = [
  { key: 'businessType', question: 'Where is your business right now?',
    options: ['Just starting out', 'Established, but the brand looks dated', 'Growing and need a professional upgrade', 'Launching a new business or product line'] },
  { key: 'need', question: 'What do you need most?',
    options: ['A new logo', 'A full brand identity (logo, colors, fonts)', 'Brand guidelines for what I already have', 'Not sure yet, I want advice'] },
  { key: 'timeline', question: 'When do you want your new brand ready?',
    options: ['As soon as possible', 'Within 1–2 months', 'In the next 3–6 months', 'Just exploring'] },
  { key: 'decisionMaker', question: 'Are you the owner, or the person who decides on this?',
    options: ["Yes, that's me", "No, I'd need to check with someone"] },
];

const PRE_QUIZ_STEPS = ['hero', 'problem', 'deliverables', 'process', 'proof'];
const QUIZ_START = PRE_QUIZ_STEPS.length;
const CONTACT_STEP = QUIZ_START + QUIZ_STEPS.length;
const TOTAL_STEPS = CONTACT_STEP + 1;

const show = (s) => s.replace(/–/g, '-');

/* ─────────────────────── main component ─────────────────────── */
export default function BrandingFunnel() {
  const [step, setStep] = React.useState(0);
  const [answers, setAnswers] = React.useState({});
  const [contact, setContact] = React.useState({ fullName: '', email: '', phone: '' });
  const [contactError, setContactError] = React.useState('');
  const toHref = useHref();

  const go = (n) => {
    setStep(n);
    fireCustom('FunnelStep', { step: n, funnel: 'branding' });
    window.scrollTo(0, 0);
  };

  const submitLead = (a) => {
    const notes = [`Need: ${a.need || '-'}`, `Timeline: ${a.timeline || '-'}`, utmNotes()].filter(Boolean).join('\n');
    fetch('/.netlify/functions/create-lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        full_name: contact.fullName.trim(),
        email: contact.email.trim(),
        phone: contact.phone.trim(),
        source: 'branding',
        session_id: getSessionId(),
        business_type: a.businessType,
        pain_point: a.need,
        decision_maker: a.decisionMaker,
        notes,
      }),
    }).catch(() => {
      // Non-blocking: the visitor still sees their result even if the write fails.
    });
    if (a.decisionMaker === "Yes, that's me") fire('Lead', { content_name: 'branding' });
  };

  const confirmContact = () => {
    if (!contact.fullName.trim() || !EMAIL_RE.test(contact.email.trim())) {
      setContactError('Enter your full name and a valid email to see your results.');
      return;
    }
    setContactError('');
    submitLead(answers);
    go(TOTAL_STEPS);
  };

  const chooseQuiz = (qi, key, option) => {
    setAnswers((prev) => ({ ...prev, [key]: option }));
    fireCustom('QuizStep', { funnel: 'branding', step: qi + 1, question: key, answer: option });
    go(qi + 1 < QUIZ_STEPS.length ? QUIZ_START + qi + 1 : CONTACT_STEP);
  };

  const isIntroStep = step < QUIZ_START;
  const quizProgressTotal = TOTAL_STEPS - QUIZ_START;
  const progressPct = isIntroStep ? 0 : Math.min(step - QUIZ_START + 1, quizProgressTotal) / quizProgressTotal * 100;
  const isResult = step >= TOTAL_STEPS;
  const notDecisionMaker = answers.decisionMaker === "No, I'd need to check with someone";

  let body;

  if (isResult) {
    body = notDecisionMaker ? (
      <Card>
        <div className="lp-result-icon"><ThumbsUp size={26} weight="duotone" /></div>
        <h2 className="lp-h2">No problem. Bring in the decision-maker.</h2>
        <p className="lp-lede">Share this page with them, or book the call together. One short conversation is enough to see the fit.</p>
        <div className="lp-continue">
          <Button variant="secondary" size="lg" onClick={trackBook} fullWidth>Book the call anyway</Button>
        </div>
      </Card>
    ) : (
      <Card tone="forest">
        <div className="lp-center"><Badge tone="ok">You're a fit</Badge></div>
        <h2 className="lp-h2">Let's build a brand that looks as good as your work.</h2>
        <p className="lp-lede">
          Book a free brand strategy call. We'll look at where your brand is today, talk through what you need,
          and give you a clear scope and price before you commit to anything.
        </p>
        <ContinueRow onNext={trackBook} label="Book My Free Brand Call" variant="primary" />
      </Card>
    );
  } else if (step === CONTACT_STEP) {
    body = (
      <Card>
        <Eyebrow>Brand check · Almost done</Eyebrow>
        <StepHeading>Where should we send your results?</StepHeading>
        <div className="lp-fields">
          <Input label="Full name" value={contact.fullName}
            onChange={(e) => setContact((c) => ({ ...c, fullName: e.target.value }))} placeholder="Jane Smith" />
          <Input label="Email" type="email" value={contact.email}
            onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))} placeholder="jane@yourbusiness.com" />
          <Input label="Phone (optional)" type="tel" value={contact.phone}
            onChange={(e) => setContact((c) => ({ ...c, phone: e.target.value }))} placeholder="(407) 555-0123" error={contactError} />
        </div>
        <ContinueRow onNext={confirmContact} label="See My Results" />
      </Card>
    );
  } else if (step >= QUIZ_START) {
    const qi = step - QUIZ_START;
    const q = QUIZ_STEPS[qi];
    body = (
      <Card>
        <Eyebrow>Brand check · Question {qi + 1} of {QUIZ_STEPS.length}</Eyebrow>
        <StepHeading>{q.question}</StepHeading>
        <div className="lp-options">
          {q.options.map((opt) => (
            <button key={opt} className="lp-option" onClick={() => chooseQuiz(qi, q.key, opt)}>
              {show(opt)}
              <span className="lp-option__chip" aria-hidden="true"><ArrowRight size={14} weight="bold" /></span>
            </button>
          ))}
        </div>
      </Card>
    );
  } else {
    const id = PRE_QUIZ_STEPS[step];
    if (id === 'hero') {
      body = (
        <Card wide className="lp-hero">
          <div className="lp-center lp-hero__badge">
            <span className="ll-live-dot" aria-hidden="true" />
            <Badge tone="accent">Branding Design</Badge>
          </div>
          <h1 className="lp-h1">A Brand That Makes You Look Like <em>The Obvious Choice.</em></h1>
          <p className="lp-lede">
            Custom logo, visual identity and brand guidelines, designed for your business and ready to use on
            everything from your truck to your website.
          </p>
          <div className="lp-hero__cta">
            <ContinueRow onNext={() => go(1)} label="Start My 60-Second Brand Check" />
            <p className="lp-fine">Takes 60 seconds · No cost · No obligation</p>
          </div>
        </Card>
      );
    } else if (id === 'problem') {
      body = (
        <Card wide tone="forest">
          <Eyebrow>What a weak brand costs you</Eyebrow>
          <StepHeading>Customers judge your business before they ever call.</StepHeading>
          <div className="lp-problems">
            {problems.map(([title, desc]) => (
              <div key={title} className="lp-problem">
                <div className="lp-problem__x" aria-hidden="true"><X size={14} weight="bold" /></div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
          <ContinueRow onNext={() => go(2)} label="See What You Get" variant="primary" />
        </Card>
      );
    } else if (id === 'deliverables') {
      body = (
        <Card wide>
          <Eyebrow>What you get</Eyebrow>
          <StepHeading>Everything you need to look consistent everywhere.</StepHeading>
          <div className="lp-caps">
            {deliverables.map(([title, desc, Icon], i) => (
              <div key={title} className={`lp-cap${i === 0 ? ' lp-cap--lead' : ''}`}>
                <span className="lp-cap__icon" aria-hidden="true"><Icon size={22} weight="duotone" /></span>
                <div><h3>{title}</h3><p>{desc}</p></div>
              </div>
            ))}
          </div>
          <ContinueRow onNext={() => go(3)} label="See How It Works" />
        </Card>
      );
    } else if (id === 'process') {
      body = (
        <Card wide>
          <Eyebrow>How it works</Eyebrow>
          <StepHeading>Four steps. You approve every one.</StepHeading>
          <div className="lp-problems">
            {process.map(([title, desc], i) => (
              <div key={title} className="lp-problem">
                <div className="lp-problem__x" aria-hidden="true">{i === process.length - 1 ? <Check size={14} weight="bold" /> : i + 1}</div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
          <ContinueRow onNext={() => go(4)} label="See What Clients Say" />
        </Card>
      );
    } else if (id === 'proof') {
      body = (
        <Card wide tone="sage">
          <Eyebrow>What clients say</Eyebrow>
          <StepHeading>Real reviews from real Loogo Labs clients.</StepHeading>
          <div className="lp-proof">
            {testimonialImages.map((t) => <TestimonialImage key={t.src} {...t} />)}
          </div>
          <ContinueRow onNext={() => go(QUIZ_START)} label="Start My 60-Second Brand Check" />
        </Card>
      );
    }
  }

  return (
    <main className="ll-shell lp">
      <div className="ll-nav lp-nav">
        <div className="ll-nav__bar ll-glass--dark lp-nav__bar">
          <div className="lp-nav__side">
            {step > 0 && !isResult && (
              <button className="lp-back" aria-label="Back" onClick={() => go(step - 1)}>
                <ArrowLeft size={16} weight="bold" aria-hidden="true" /> <span className="lp-back__label">Back</span>
              </button>
            )}
          </div>
          <span className="ll-nav__logo lp-nav__logo"><img src="/logo.png" alt="" /></span>
          <div className="lp-nav__side lp-nav__side--end">
            {!isResult && !isIntroStep && <span className="lp-count">{step - QUIZ_START + 1}/{quizProgressTotal}</span>}
          </div>
          <div className="lp-progress" aria-hidden="true">
            <div className="lp-progress__fill" style={{ width: `${progressPct}%` }} />
          </div>
        </div>
      </div>

      <div className="lp-stage">
        <div key={step} className="lp-stage__inner">{body}</div>
      </div>

      <footer className="lp-footer">
        <div className="lp-footer__pill ll-glass">
          <span>© {new Date().getFullYear()} Loogo Labs</span>
          <a href={toHref('/privacy')}>Privacy</a>
          <a href={toHref('/terms')}>Terms</a>
        </div>
      </footer>
    </main>
  );
}
