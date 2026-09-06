import React from 'react';
import Badge from '../components/feedback/Badge';
import Button from '../components/core/Button';
import { openBooking } from '../lib/booking';

const fire = (event, params) => { if (window.fbq) window.fbq('track', event, params); };
const fireCustom = (event, params) => { if (window.fbq) window.fbq('trackCustom', event, params); };
const trackBook = () => { fire('Schedule'); openBooking(); };

/* ─────────────────────── primitives ─────────────────────── */
const Card = ({ children, style }) => (
  <div style={{ maxWidth: 640, margin: '0 auto', width: '100%', ...style }}>{children}</div>
);

const Eyebrow = ({ children }) => (
  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase',
    color: 'var(--cyan-700)', marginBottom: 14, textAlign: 'center' }}>
    {children}
  </div>
);

const StepHeading = ({ children }) => (
  <h2 style={{ margin: '0 0 28px', fontSize: 'clamp(24px,4vw,34px)', fontWeight: 700,
    letterSpacing: '-0.03em', lineHeight: 1.2, color: 'var(--ink-900)', textAlign: 'center' }}>
    {children}
  </h2>
);

const ContinueRow = ({ onNext, label }) => (
  <div style={{ marginTop: 32, display: 'flex', justifyContent: 'center' }}>
    <Button variant="primary" size="lg" iconRight={<span>→</span>} onClick={onNext} fullWidth>{label}</Button>
  </div>
);

/* ─────────────────────── data ─────────────────────── */
const problems = [
  ['A full-time receptionist runs $45K–$55K a year', 'Add payroll tax, benefits, sick days, and turnover, and that number is real before they answer a single call.'],
  ['They can only take one call at a time', "While they're on one call, everyone else hits voicemail — and voicemail is where leads go to die."],
  ['Gone at 5, out sick, or two weeks behind on training', 'Nights, weekends, lunch breaks, vacation. The phone does not take any of those off. Your coverage shouldn\'t either.'],
];

const capabilities = [
  ['Answers Every Call, Instantly', 'Picks up in under a second, day or night, weekends and holidays included.'],
  ['Greets Callers By Your Business Name', 'Sounds like a member of your team. Trained on your tone, services, and most common questions.'],
  ['Books & Reschedules Appointments', 'Syncs live with your calendar — callers pick a real open slot during the call.'],
  ['Routes Urgent Calls To A Real Person', 'Knows the difference between a routine question and an emergency.'],
];

const comparison = [
  ['Annual cost', 'A fraction of one month\'s salary', '$45,000–$55,000+'],
  ['Availability', '24 / 7 / 365', '~40 hrs / week'],
  ['Simultaneous calls', 'Unlimited', '1 at a time'],
  ['Sick days & turnover', 'Never', 'Every year'],
  ['Time to go live', '~1 week', '4–6 weeks of training'],
];

const industries = [
  'HVAC & Mechanical', 'Roofing & Exteriors', 'Dental & Med Spa', 'Real Estate & Mortgage',
  'Pest Control', 'Plumbing & Electric', 'Salon, Spa & Fitness', 'Legal & Professional Services',
];

const faqs = [
  ['Will it sound robotic on the phone?', "No. It's trained on your business's vocabulary, services, and tone so it sounds like a real front-desk hire — not a generic answering system."],
  ["What happens if it can't help with something?", "It knows its limits. If a call falls outside its training, it warmly takes a message, captures the details, and gets your team a callback ticket — nothing gets lost."],
  ['Does it work with my current phone number?', 'Yes. We route calls through the number you already have. No new number, no changes to your signage or ads.'],
  ['How fast can this be live for my business?', "Most clients are live within a week. We handle the build — you show up for one intake session and one approval call."],
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
      style={{ width: '100%', borderRadius: 'var(--radius-2)', border: '1px solid var(--border-hair)', display: 'block' }} />
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

const CONTENT_STEPS = ['hero', 'problem', 'capabilities', 'cost', 'proof', 'industries', 'faq'];
const TOTAL_STEPS = CONTENT_STEPS.length + QUIZ_STEPS.length; // steps before the result screen

/* ─────────────────────── main component ─────────────────────── */
export default function AIReceptionist() {
  const [step, setStep] = React.useState(0);
  const [answers, setAnswers] = React.useState({});
  const [openFaq, setOpenFaq] = React.useState(null);

  const go = (n) => {
    setStep(n);
    fireCustom('FunnelStep', { step: n });
    window.scrollTo(0, 0);
  };

  const chooseQuiz = (quizIndex, key, option) => {
    const next = { ...answers, [key]: option };
    setAnswers(next);
    fireCustom('QuizStep', { step: quizIndex + 1, question: key, answer: option });
    if (quizIndex + 1 < QUIZ_STEPS.length) {
      go(CONTENT_STEPS.length + quizIndex + 1);
    } else {
      if (next.decisionMaker === "Yes, that's me") fire('Lead');
      go(TOTAL_STEPS);
    }
  };

  const progressPct = Math.min(step, TOTAL_STEPS) / TOTAL_STEPS * 100;
  const isQuizStep = step >= CONTENT_STEPS.length && step < TOTAL_STEPS;
  const isResult = step >= TOTAL_STEPS;
  const notDecisionMaker = answers.decisionMaker === "No, I'd need to check with someone";

  let body;

  if (isResult) {
    body = notDecisionMaker ? (
      <Card style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>👍</div>
        <h2 style={{ margin: '0 0 14px', fontSize: 26, fontWeight: 700, color: 'var(--ink-900)' }}>
          No problem — bring in the decision-maker.
        </h2>
        <p style={{ margin: '0 0 28px', fontSize: 15.5, lineHeight: 1.65, color: 'var(--ink-500)' }}>
          Share this page with them, or book the call together — a 15-minute walkthrough is enough for anyone to see the fit.
        </p>
        <Button variant="secondary" size="lg" onClick={trackBook} fullWidth>Book the call anyway</Button>
      </Card>
    ) : (
      <Card style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}><Badge tone="ok">You qualify</Badge></div>
        <h2 style={{ margin: '18px 0 14px', fontSize: 28, fontWeight: 700, color: 'var(--ink-900)', lineHeight: 1.2 }}>
          This is exactly what we built the AI Receptionist for.
        </h2>
        <p style={{ margin: '0 0 32px', fontSize: 15.5, lineHeight: 1.65, color: 'var(--ink-500)' }}>
          Book a free 20-minute fit call. We'll show you exactly what your AI receptionist would say on a real call
          from your business, and what it's costing you to keep missing calls instead.
        </p>
        <Button variant="primary" size="lg" iconRight={<span>→</span>} onClick={trackBook} fullWidth>Book My Free Fit Call</Button>
      </Card>
    );
  } else if (isQuizStep) {
    const qi = step - CONTENT_STEPS.length;
    const q = QUIZ_STEPS[qi];
    body = (
      <Card>
        <Eyebrow>Fit check · Question {qi + 1} of {QUIZ_STEPS.length}</Eyebrow>
        <StepHeading>{q.question}</StepHeading>
        <div style={{ display: 'grid', gap: 10 }}>
          {q.options.map((opt) => (
            <button key={opt} onClick={() => chooseQuiz(qi, q.key, opt)} style={{
              textAlign: 'left', padding: '16px 18px', background: 'var(--paper-100)',
              border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-2)',
              fontSize: 14.5, fontWeight: 600, color: 'var(--ink-800)', cursor: 'pointer',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12,
              transition: 'border-color 140ms ease, background 140ms ease',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--cyan-700)'; e.currentTarget.style.background = 'var(--paper-200)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-hair)'; e.currentTarget.style.background = 'var(--paper-100)'; }}
            >
              {opt}
              <span style={{ color: 'var(--cyan-700)', flexShrink: 0 }}>→</span>
            </button>
          ))}
        </div>
      </Card>
    );
  } else {
    const id = CONTENT_STEPS[step];

    if (id === 'hero') {
      body = (
        <Card style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <span className="ll-live-dot" aria-hidden="true" />
            <Badge tone="accent">AI Receptionist</Badge>
          </div>
          <h1 style={{ margin: '20px 0 0', fontWeight: 700, fontSize: 'clamp(30px,5.4vw,50px)', lineHeight: 1.1,
            letterSpacing: '-0.03em', color: 'var(--ink-900)' }}>
            A Full-Time Receptionist. <span style={{ color: 'var(--cyan-700)' }}>Without The Full-Time Cost.</span>
          </h1>
          <p style={{ margin: '20px 0 0', fontSize: 16, lineHeight: 1.6, color: 'var(--ink-500)' }}>
            Answers every call, greets callers by your business name, books the appointment, and never calls out
            sick — for a fraction of what one payroll costs.
          </p>
          <div style={{ display: 'flex', gap: 0, marginTop: 40, borderTop: '1px solid var(--border-hair)', justifyContent: 'center' }}>
            {[['24/7', 'Always answers'], ['< 1 s', 'Time to pick up'], ['~1 week', 'To go live'], ['$0', 'Sick days']].map(([val, label], i) => (
              <div key={label} style={{ padding: '18px 16px 0', borderLeft: i ? '1px solid var(--border-hair)' : 'none' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(18px,3vw,24px)', fontWeight: 700,
                  letterSpacing: '-0.03em', color: 'var(--cyan-700)', lineHeight: 1 }}>{val}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '0.08em',
                  textTransform: 'uppercase', color: 'var(--ink-400)', marginTop: 6, whiteSpace: 'nowrap' }}>{label}</div>
              </div>
            ))}
          </div>
          <ContinueRow onNext={() => go(1)} label="Start My 60-Second Fit Check" />
          <p style={{ marginTop: 14, fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '0.08em',
            textTransform: 'uppercase', color: 'var(--ink-400)' }}>Takes 60 seconds · No cost · No obligation</p>
        </Card>
      );
    } else if (id === 'problem') {
      body = (
        <Card>
          <Eyebrow>The real cost of a front desk</Eyebrow>
          <StepHeading>A human receptionist costs more than you think.</StepHeading>
          <div style={{ display: 'grid', gap: 12 }}>
            {problems.map(([title, desc]) => (
              <div key={title} style={{ background: 'var(--paper-100)', border: '1px solid var(--border-hair)',
                borderRadius: 'var(--radius-2)', padding: '20px 20px', display: 'grid', gap: 10 }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(255,74,61,0.1)',
                  border: '1px solid rgba(255,74,61,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: 12, color: 'var(--status-danger)' }}>✕</div>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, letterSpacing: '-0.01em', color: 'var(--ink-900)' }}>{title}</h3>
                <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.6, color: 'var(--ink-500)' }}>{desc}</p>
              </div>
            ))}
          </div>
          <ContinueRow onNext={() => go(2)} label="See How It Works" />
        </Card>
      );
    } else if (id === 'capabilities') {
      body = (
        <Card>
          <Eyebrow>What it actually does</Eyebrow>
          <StepHeading>Everything your front desk does. None of the payroll.</StepHeading>
          <div style={{ display: 'grid', gap: 10 }}>
            {capabilities.map(([title, desc], i) => (
              <div key={title} style={{ background: 'var(--paper-100)', border: '1px solid var(--border-hair)',
                borderRadius: 'var(--radius-2)', padding: '18px 20px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--cyan-700)', flexShrink: 0, paddingTop: 2 }}>0{i + 1}</span>
                <div>
                  <h3 style={{ margin: '0 0 6px', fontSize: 14.5, fontWeight: 700, color: 'var(--ink-900)' }}>{title}</h3>
                  <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.55, color: 'var(--ink-500)' }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
          <ContinueRow onNext={() => go(3)} label="See The Cost Comparison" />
        </Card>
      );
    } else if (id === 'cost') {
      body = (
        <Card>
          <Eyebrow>AI Receptionist vs. human receptionist</Eyebrow>
          <StepHeading>Side by side, it's not close.</StepHeading>
          <div style={{ display: 'grid', gap: 8 }}>
            {comparison.map(([feat, ai, human]) => (
              <div key={feat} style={{ background: 'var(--paper-100)', border: '1px solid var(--border-hair)',
                borderRadius: 'var(--radius-2)', padding: '14px 18px' }}>
                <div style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--ink-900)', marginBottom: 10 }}>{feat}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0',
                  borderTop: '1px solid var(--border-hair)' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-400)' }}>AI Receptionist</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--cyan-700)' }}>{ai}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0',
                  borderTop: '1px solid var(--border-hair)' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-400)' }}>Human Receptionist</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-500)' }}>{human}</span>
                </div>
              </div>
            ))}
          </div>
          <ContinueRow onNext={() => go(4)} label="See What Clients Say" />
        </Card>
      );
    } else if (id === 'proof') {
      body = (
        <Card>
          <Eyebrow>What clients say</Eyebrow>
          <StepHeading>Real reviews from real Loogo Labs clients.</StepHeading>
          <div style={{ display: 'grid', gap: 16 }}>
            {testimonialImages.map((t) => <TestimonialImage key={t.src} {...t} />)}
          </div>
          <ContinueRow onNext={() => go(5)} label="Continue" />
        </Card>
      );
    } else if (id === 'industries') {
      body = (
        <Card>
          <Eyebrow>Who it's built for</Eyebrow>
          <StepHeading>Any business where a missed call is a missed sale.</StepHeading>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1,
            background: 'var(--border-hair)', border: '1px solid var(--border-hair)' }}>
            {industries.map((ind) => (
              <div key={ind} style={{ background: 'var(--paper-100)', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: 'var(--cyan-700)', fontSize: 11, flexShrink: 0 }}>→</span>
                <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink-900)' }}>{ind}</span>
              </div>
            ))}
          </div>
          <ContinueRow onNext={() => go(6)} label="Continue" />
        </Card>
      );
    } else if (id === 'faq') {
      body = (
        <Card>
          <Eyebrow>Before you go further</Eyebrow>
          <StepHeading>Common questions.</StepHeading>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'var(--border-hair)',
            border: '1px solid var(--border-hair)' }}>
            {faqs.map(([q, a], i) => {
              const open = openFaq === i;
              return (
                <div key={q} style={{ background: open ? 'var(--paper-000)' : 'var(--paper-100)', transition: 'background 140ms ease' }}>
                  <button onClick={() => setOpenFaq(open ? null : i)}
                    style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '16px 18px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', gap: 16 }}>
                    <span style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--ink-900)' }}>{q}</span>
                    <span style={{ fontSize: 16, color: open ? 'var(--cyan-700)' : 'var(--ink-400)', flexShrink: 0,
                      transition: 'transform 200ms ease', transform: open ? 'rotate(45deg)' : 'none' }}>+</span>
                  </button>
                  {open && (
                    <div style={{ padding: '0 18px 18px' }}>
                      <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: 'var(--ink-600)' }}>{a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <ContinueRow onNext={() => go(CONTENT_STEPS.length)} label="I'm Ready — Start My Fit Check" />
        </Card>
      );
    }
  }

  return (
    <main style={{ fontFamily: 'var(--font-body)', overflowX: 'hidden', background: 'var(--paper-000)', minHeight: '100vh',
      display: 'flex', flexDirection: 'column' }}>

      {/* ── STICKY TOP BAR: logo mark only + progress ── */}
      <div style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--paper-000)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px' }}>
          {step > 0 && !isResult ? (
            <button onClick={() => go(step - 1)} style={{ background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-400)' }}>
              ← Back
            </button>
          ) : <span />}
          <img src="/logo.png" alt="" style={{ height: 22, width: 'auto' }} />
          {!isResult ? (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', color: 'var(--ink-400)' }}>
              {Math.min(step + 1, TOTAL_STEPS)}/{TOTAL_STEPS}
            </span>
          ) : <span />}
        </div>
        <div style={{ height: 3, background: 'var(--border-hair)' }}>
          <div style={{ height: '100%', width: `${progressPct}%`, background: 'var(--cyan-700)', transition: 'width 240ms ease' }} />
        </div>
      </div>

      {/* ── STEP CONTENT ── */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: 'clamp(32px,6vw,64px) 24px' }}>
        <div style={{ width: '100%' }}>{body}</div>
      </div>

      {/* ── SLIM LEGAL FOOTER ── */}
      <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-hair)',
        display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 16,
        fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.06em', color: 'var(--ink-400)' }}>
        <span>© {new Date().getFullYear()} Loogo Labs</span>
        <a href="/privacy" style={{ color: 'var(--ink-400)', textDecoration: 'none' }}>Privacy</a>
        <a href="/terms" style={{ color: 'var(--ink-400)', textDecoration: 'none' }}>Terms</a>
      </div>
    </main>
  );
}
