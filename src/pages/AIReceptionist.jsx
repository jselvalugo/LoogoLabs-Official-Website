import React from 'react';
import { ArrowLeft, ArrowRight, X, Check, ThumbsUp, Phone, UserSound, CalendarCheck, ArrowsSplit } from '@phosphor-icons/react';
import Badge from '../components/feedback/Badge';
import Button from '../components/core/Button';
import Input from '../components/forms/Input';
import { openBooking } from '../lib/booking';
import { getSessionId } from '../lib/sessionTracker';
import '../styles/pages/landing.css';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const fire = (event, params) => { if (window.fbq) window.fbq('track', event, params); };
const fireCustom = (event, params) => { if (window.fbq) window.fbq('trackCustom', event, params); };
const trackBook = () => { fire('Schedule'); openBooking(); };

/* Range strings keep their stored value; only the displayed dash changes. */
const show = (s) => s.replace(/\u2013/g, '-');

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
  ['A full-time receptionist runs $45K-$55K a year', 'Add payroll tax, benefits, sick days, and turnover, and that number is real before they answer a single call.'],
  ['They can only take one call at a time', "While they're on one call, everyone else hits voicemail, and voicemail is where leads go to die."],
  ['Gone at 5, out sick, or two weeks behind on training', 'Nights, weekends, lunch breaks, vacation. The phone does not take any of those off. Your coverage shouldn\'t either.'],
];

const capabilities = [
  ['Answers Every Call, Instantly', 'Picks up in under a second, day or night, weekends and holidays included.', Phone],
  ['Greets Callers By Your Business Name', 'Sounds like a member of your team. Trained on your tone, services, and most common questions.', UserSound],
  ['Books & Reschedules Appointments', 'Syncs live with your calendar: callers pick a real open slot during the call.', CalendarCheck],
  ['Routes Urgent Calls To A Real Person', 'Knows the difference between a routine question and an emergency.', ArrowsSplit],
];

const comparison = [
  ['Annual cost', 'A fraction of one month\'s salary', '$45,000-$55,000+'],
  ['Availability', '24 / 7 / 365', '~40 hrs / week'],
  ['Simultaneous calls', 'Unlimited', '1 at a time'],
  ['Sick days & turnover', 'Never', 'Every year'],
  ['Time to go live', '~1 week', '4-6 weeks of training'],
];

const testimonialImages = [
  { src: '/testimonial-sally-butler.png', alt: '5-star Facebook recommendation from Sally Butler for Loogo Labs' },
  { src: '/testimonial-kristin-pitts.png', alt: '5-star Facebook recommendation from Kristin Pitts for Loogo Labs' },
];

function TestimonialImage({ src, alt }) {
  const [failed, setFailed] = React.useState(false);
  if (failed) return null;
  return (
    <img src={src} alt={alt} onError={() => setFailed(true)}
      className="lp-proof__img" />
  );
}

const QUIZ_STEPS = [
  { key: 'businessType', question: 'What type of business do you run?',
    options: ['Home Services (HVAC, plumbing, electrical, roofing)', 'Medical, Dental & Wellness', 'Legal & Professional Services', 'Salon, Spa & Fitness', 'Something else'] },
  { key: 'missedCalls', question: 'How many calls does your business miss or send to voicemail every week?',
    options: ['0–5', '6–15', '16–30', '30+'] },
  { key: 'painPoint', question: "What's costing you the most right now?",
    options: ['Missed calls after hours & weekends', 'Staff too busy to answer every call', 'Slow follow-up losing leads to competitors', 'Paying too much for a human receptionist'] },
  { key: 'decisionMaker', question: 'Are you the owner, or the person who decides on tools like this?',
    options: ["Yes, that's me", "No, I'd need to check with someone"] },
];

const PRE_QUIZ_STEPS = ['hero', 'problem', 'capabilities', 'cost', 'proof'];
const QUIZ_START = PRE_QUIZ_STEPS.length; // index of the first quiz question
const QUIZ_END = QUIZ_START + QUIZ_STEPS.length; // index of the contact step
const CONTACT_STEP = QUIZ_END; // name + email, right before the result — after they've already invested in the quiz
const TOTAL_STEPS = CONTACT_STEP + 1;

/* ─────────────────────── main component ─────────────────────── */
export default function AIReceptionist() {
  const [step, setStep] = React.useState(0);
  const [answers, setAnswers] = React.useState({});
  const [contact, setContact] = React.useState({ fullName: '', email: '' });
  const [contactError, setContactError] = React.useState('');

  const go = (n) => {
    setStep(n);
    fireCustom('FunnelStep', { step: n });
    window.scrollTo(0, 0);
  };

  const submitLead = (finalAnswers) => {
    fetch('/.netlify/functions/create-lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        full_name: contact.fullName.trim(),
        email: contact.email.trim(),
        source: 'ai_receptionist',
        session_id: getSessionId(),
        business_type: finalAnswers.businessType,
        missed_calls: finalAnswers.missedCalls,
        pain_point: finalAnswers.painPoint,
        decision_maker: finalAnswers.decisionMaker,
      }),
    }).catch(() => {
      // Non-blocking: the visitor still sees their result even if the write fails.
    });
    if (finalAnswers.decisionMaker === "Yes, that's me") fire('Lead');
  };

  const confirmContact = () => {
    const fullName = contact.fullName.trim();
    const email = contact.email.trim();
    if (!fullName || !EMAIL_RE.test(email)) {
      setContactError('Enter your full name and a valid email to see your results.');
      return;
    }
    setContactError('');
    fireCustom('FunnelContact', { email });
    submitLead(answers);
    go(TOTAL_STEPS);
  };

  const chooseQuiz = (quizIndex, key, option) => {
    const next = { ...answers, [key]: option };
    setAnswers(next);
    fireCustom('QuizStep', { step: quizIndex + 1, question: key, answer: option });
    if (quizIndex + 1 < QUIZ_STEPS.length) {
      go(QUIZ_START + quizIndex + 1);
    } else {
      go(CONTACT_STEP);
    }
  };

  const isIntroStep = step < QUIZ_START;
  const quizProgressTotal = TOTAL_STEPS - QUIZ_START; // quiz questions + the contact step
  const progressPct = isIntroStep ? 0 : Math.min(step - QUIZ_START + 1, quizProgressTotal) / quizProgressTotal * 100;
  const isQuizStep = step >= QUIZ_START && step < QUIZ_END;
  const isContactStep = step === CONTACT_STEP;
  const isResult = step >= TOTAL_STEPS;
  const notDecisionMaker = answers.decisionMaker === "No, I'd need to check with someone";

  let body;

  if (isResult) {
    body = notDecisionMaker ? (
      <Card>
        <div className="lp-result-icon"><ThumbsUp size={26} weight="duotone" /></div>
        <h2 className="lp-h2">No problem. Bring in the decision-maker.</h2>
        <p className="lp-lede">
          Share this page with them, or book the call together. A 15-minute walkthrough is enough for anyone to see the fit.
        </p>
        <div className="lp-continue">
          <Button variant="secondary" size="lg" onClick={trackBook} fullWidth>Book the call anyway</Button>
        </div>
      </Card>
    ) : (
      <Card tone="forest">
        <div className="lp-center"><Badge tone="ok">You qualify</Badge></div>
        <h2 className="lp-h2">This is exactly what we built the AI Receptionist for.</h2>
        <p className="lp-lede">
          Book a free 20-minute fit call. We'll show you exactly what your AI receptionist would say on a real call
          from your business, and what it's costing you to keep missing calls instead.
        </p>
        <ContinueRow onNext={trackBook} label="Book My Free Fit Call" variant="primary" />
      </Card>
    );
  } else if (isContactStep) {
    body = (
      <Card>
        <Eyebrow>Fit check · Almost done</Eyebrow>
        <StepHeading>Where should we send your results?</StepHeading>
        <div className="lp-fields">
          <Input label="Full name" value={contact.fullName}
            onChange={(e) => setContact((c) => ({ ...c, fullName: e.target.value }))}
            placeholder="Jane Smith" />
          <Input label="Email" type="email" value={contact.email}
            onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))}
            placeholder="jane@yourbusiness.com" error={contactError} />
        </div>
        <ContinueRow onNext={confirmContact} label="See My Results" />
      </Card>
    );
  } else if (isQuizStep) {
    const qi = step - QUIZ_START;
    const q = QUIZ_STEPS[qi];
    body = (
      <Card>
        <Eyebrow>Fit check · Question {qi + 1} of {QUIZ_STEPS.length}</Eyebrow>
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
            <Badge tone="accent">AI Receptionist</Badge>
          </div>
          <h1 className="lp-h1">
            A Full-Time Receptionist. <em>Without The Full-Time Cost.</em>
          </h1>
          <p className="lp-lede">
            Answers every call, greets callers by your business name, books the appointment, and never calls out
            sick, for a fraction of what one payroll costs.
          </p>
          <div className="lp-stats">
            {[['24/7', 'Always answers'], ['< 1 s', 'Time to pick up'], ['~1 week', 'To go live'], ['$0', 'Sick days']].map(([val, label]) => (
              <div key={label} className="lp-stat">
                <div className="lp-stat__val">{val}</div>
                <div className="lp-stat__label">{label}</div>
              </div>
            ))}
          </div>
          <div className="lp-hero__cta">
            <ContinueRow onNext={() => go(1)} label="Start My 60-Second Fit Check" />
            <p className="lp-fine">Takes 60 seconds · No cost · No obligation</p>
          </div>
        </Card>
      );
    } else if (id === 'problem') {
      body = (
        <Card wide tone="forest">
          <Eyebrow>The real cost of a front desk</Eyebrow>
          <StepHeading>A human receptionist costs more than you think.</StepHeading>
          <div className="lp-problems">
            {problems.map(([title, desc]) => (
              <div key={title} className="lp-problem">
                <div className="lp-problem__x" aria-hidden="true"><X size={14} weight="bold" /></div>
                <h3>{show(title)}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
          <ContinueRow onNext={() => go(2)} label="See How It Works" variant="primary" />
        </Card>
      );
    } else if (id === 'capabilities') {
      body = (
        <Card wide>
          <Eyebrow>What it actually does</Eyebrow>
          <StepHeading>Everything your front desk does. None of the payroll.</StepHeading>
          <div className="lp-caps">
            {capabilities.map(([title, desc, Icon], i) => (
              <div key={title} className={`lp-cap${i === 0 ? ' lp-cap--lead' : ''}`}>
                <span className="lp-cap__icon" aria-hidden="true"><Icon size={22} weight="duotone" /></span>
                <div>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </div>
              </div>
            ))}
          </div>
          <ContinueRow onNext={() => go(3)} label="See The Cost Comparison" />
        </Card>
      );
    } else if (id === 'cost') {
      body = (
        <Card wide>
          <Eyebrow>AI Receptionist vs. human receptionist</Eyebrow>
          <StepHeading>Side by side, it's not close.</StepHeading>
          <div className="lp-compare" role="table">
            <div className="lp-compare__head" role="row">
              <span role="columnheader" />
              <span role="columnheader" className="lp-compare__us">AI Receptionist</span>
              <span role="columnheader">Human Receptionist</span>
            </div>
            {comparison.map(([feat, a, b]) => (
              <div key={feat} className="lp-compare__row" role="row">
                <span role="rowheader" className="lp-compare__feat">{feat}</span>
                <span role="cell" className="lp-compare__us"><em className="lp-compare__tag">AI Receptionist</em><Check size={14} weight="bold" aria-hidden="true" /> {show(a)}</span>
                <span role="cell" className="lp-compare__them"><em className="lp-compare__tag">Human Receptionist</em>{show(b)}</span>
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
          <ContinueRow onNext={() => go(QUIZ_START)} label="Start My 60-Second Fit Check" />
        </Card>
      );
    }
  }

  return (
    <main className="ll-shell lp">

      {/* ── FLOATING GLASS HEADER: back, logo, progress ── */}
      <div className="ll-nav lp-nav">
        <div className="ll-nav__bar ll-glass--dark lp-nav__bar">
          <div className="lp-nav__side">
            {step > 0 && !isResult && (
              <button className="lp-back" onClick={() => go(step - 1)}>
                <ArrowLeft size={16} weight="bold" aria-hidden="true" /> Back
              </button>
            )}
          </div>
          <span className="ll-nav__logo lp-nav__logo"><img src="/logo.png" alt="" /></span>
          <div className="lp-nav__side lp-nav__side--end">
            {!isResult && !isIntroStep && (
              <span className="lp-count">{step - QUIZ_START + 1}/{quizProgressTotal}</span>
            )}
          </div>
          <div className="lp-progress" aria-hidden="true">
            <div className="lp-progress__fill" style={{ width: `${progressPct}%` }} />
          </div>
        </div>
      </div>

      {/* ── STEP CONTENT ── */}
      <div className="lp-stage">
        <div key={step} className="lp-stage__inner">{body}</div>
      </div>

      {/* ── SLIM LEGAL FOOTER ── */}
      <footer className="lp-footer">
        <div className="lp-footer__pill ll-glass">
          <span>© {new Date().getFullYear()} Loogo Labs</span>
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
        </div>
      </footer>
    </main>
  );
}
