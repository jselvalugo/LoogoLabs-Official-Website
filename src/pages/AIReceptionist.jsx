import React from 'react';
import Badge from '../components/feedback/Badge';
import Button from '../components/core/Button';
import { openBooking } from '../lib/booking';

const fire = (event, params) => { if (window.fbq) window.fbq('track', event, params); };
const fireCustom = (event, params) => { if (window.fbq) window.fbq('trackCustom', event, params); };
const trackBook = () => { fire('Schedule'); openBooking(); };

/* ─────────────────────── primitives ─────────────────────── */
const Wrap = ({ children, style }) => (
  <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px', ...style }}>{children}</div>
);

const Eyebrow = ({ children, light }) => (
  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase',
    color: light ? 'var(--cyan-500)' : 'var(--ink-400)', marginBottom: 14 }}>
    {children}
  </div>
);

/* ─────────────────────── data ─────────────────────── */
const problems = [
  ['A full-time receptionist runs $45K–$55K a year', 'Add payroll tax, benefits, sick days, and turnover, and that number is real before they answer a single call.'],
  ['They can only take one call at a time', "While they're on one call, everyone else hits voicemail — and voicemail is where leads go to die."],
  ['Gone at 5, out sick, or two weeks behind on training', 'Nights, weekends, lunch breaks, vacation. The phone does not take any of those off. Your coverage shouldn\'t either.'],
];

const capabilities = [
  ['Answers Every Call, Instantly', 'Picks up in under a second, day or night, weekends and holidays included. No hold music, no "please stay on the line."'],
  ['Greets Callers By Your Business Name', "Sounds like a member of your team, not a call center. Trained on your tone, your services, and your most common questions."],
  ['Books & Reschedules Appointments', 'Syncs live with your calendar. Callers pick a real open slot during the call — no back-and-forth texts.'],
  ['Routes Urgent Calls To A Real Person', "Knows the difference between a routine question and an emergency, and connects the right caller to your team immediately."],
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

const testimonials = [
  { name: 'Sally Butler', quote: "Loogo Labs made running my business a lot simpler. Instead of jumping between a CRM, email tool, SMS, and social apps, it's all in one dashboard. Setup was straightforward, the automations actually work, and I'm not paying for a pile of separate subscriptions anymore.", stars: 5 },
  { name: 'Kristin Pitts', quote: 'Loogo Labs rebuilt our lead flow from the ground up. More qualified leads, better conversions, and for the first time our growth actually feels predictable instead of guesswork. The systems they set up work!!', stars: 5 },
];

const faqs = [
  ['Will it sound robotic on the phone?', "No. It's trained on your business's vocabulary, services, and tone so it sounds like a real front-desk hire — not a generic answering system."],
  ["What happens if it can't help with something?", "It knows its limits. If a call falls outside its training, it warmly takes a message, captures the details, and gets your team a callback ticket — nothing gets lost."],
  ['Does it work with my current phone number?', 'Yes. We route calls through the number you already have. No new number, no changes to your signage or ads.'],
  ['How fast can this be live for my business?', "Most clients are live within a week. We handle the build — you show up for one intake session and one approval call."],
];

/* ─────────────────────── qualification quiz ─────────────────────── */
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

function Quiz() {
  const [step, setStep] = React.useState(0);
  const [answers, setAnswers] = React.useState({});
  const [done, setDone] = React.useState(false);

  const total = QUIZ_STEPS.length;
  const current = QUIZ_STEPS[step];
  const notDecisionMaker = answers.decisionMaker === "No, I'd need to check with someone";

  const choose = (option) => {
    const next = { ...answers, [current.key]: option };
    setAnswers(next);
    fireCustom('QuizStep', { step: step + 1, question: current.key, answer: option });
    if (step + 1 < total) {
      setStep(step + 1);
    } else {
      setDone(true);
      if (next.decisionMaker === "Yes, that's me") fire('Lead');
    }
  };

  if (done) {
    if (notDecisionMaker) {
      return (
        <div style={{ textAlign: 'center', padding: '8px 4px' }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>👍</div>
          <h3 style={{ margin: '0 0 12px', fontSize: 22, fontWeight: 700, color: 'var(--ink-900)' }}>
            No problem — bring in the decision-maker.
          </h3>
          <p style={{ margin: '0 0 24px', fontSize: 15, lineHeight: 1.65, color: 'var(--ink-500)', maxWidth: '42ch', marginLeft: 'auto', marginRight: 'auto' }}>
            Share this page with them, or book the call together — a 15-minute walkthrough is enough for anyone to see the fit.
          </p>
          <Button variant="secondary" onClick={trackBook}>Book the call anyway</Button>
        </div>
      );
    }
    return (
      <div style={{ textAlign: 'center', padding: '8px 4px' }}>
        <Badge tone="ok">You qualify</Badge>
        <h3 style={{ margin: '16px 0 12px', fontSize: 24, fontWeight: 700, color: 'var(--ink-900)' }}>
          Good news — this is exactly what we built the AI Receptionist for.
        </h3>
        <p style={{ margin: '0 0 28px', fontSize: 15, lineHeight: 1.65, color: 'var(--ink-500)', maxWidth: '46ch', marginLeft: 'auto', marginRight: 'auto' }}>
          Based on your answers, book a free 20-minute fit call. We'll show you exactly what your AI receptionist
          would say on a real call from your business, and what it would cost you to keep missing calls instead.
        </p>
        <Button variant="primary" size="lg" iconRight={<span>→</span>} onClick={trackBook}>Book My Free Fit Call</Button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-400)' }}>
          Step {step + 1} of {total}
        </span>
        {step > 0 && (
          <button onClick={() => setStep(step - 1)} style={{ background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-400)' }}>
            ← Back
          </button>
        )}
      </div>
      <div style={{ height: 4, background: 'var(--border-hair)', borderRadius: 'var(--radius-pill)', marginBottom: 28, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${((step + 1) / total) * 100}%`, background: 'var(--cyan-700)',
          borderRadius: 'var(--radius-pill)', transition: 'width 240ms ease' }} />
      </div>
      <h3 style={{ margin: '0 0 24px', fontSize: 'clamp(19px,2.4vw,24px)', fontWeight: 700, lineHeight: 1.3, color: 'var(--ink-900)' }}>
        {current.question}
      </h3>
      <div style={{ display: 'grid', gap: 10 }}>
        {current.options.map((opt) => (
          <button key={opt} onClick={() => choose(opt)} style={{
            textAlign: 'left', padding: '16px 18px', background: 'var(--paper-000)',
            border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-2)',
            fontSize: 14.5, fontWeight: 600, color: 'var(--ink-800)', cursor: 'pointer',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12,
            transition: 'border-color 140ms ease, background 140ms ease',
          }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--cyan-700)'; e.currentTarget.style.background = 'var(--cyan-100)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-hair)'; e.currentTarget.style.background = 'var(--paper-000)'; }}
          >
            {opt}
            <span style={{ color: 'var(--cyan-700)', flexShrink: 0 }}>→</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────── main component ─────────────────────── */
export default function AIReceptionist() {
  const [openFaq, setOpenFaq] = React.useState(null);

  return (
    <main style={{ fontFamily: 'var(--font-body)', overflowX: 'hidden', background: 'var(--paper-100)' }}>

      <style>{`
        @keyframes pulseRing { 0% { transform: scale(1); opacity: 0.55; } 100% { transform: scale(1.9); opacity: 0; } }
        @media (max-width: 640px) {
          .air-compare-table { display: none; }
          .air-compare-cards { display: flex !important; }
          .air-industries-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── MINIMAL BRANDED HEADER (no site nav — this is a funnel, not a website) ── */}
      <header style={{ background: 'var(--ink-900)', padding: '18px 0', borderBottom: '1px solid var(--border-hair-inverse)' }}>
        <Wrap style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="/logo.png" alt="Loogo Labs" style={{ height: 26, width: 'auto' }} />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--paper-100)', letterSpacing: '-0.01em' }}>
            Loogo Labs
          </span>
        </Wrap>
      </header>

      {/* ── HERO ── */}
      <section style={{ position: 'relative', background: 'var(--ink-900)', padding: 'clamp(56px,9vw,100px) 0 clamp(56px,7vw,88px)', overflow: 'hidden' }}>
        <div className="ll-hero-grid-bg" aria-hidden="true" />
        <Wrap style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <span className="ll-live-dot" aria-hidden="true" />
            <Badge tone="inverse">AI Receptionist</Badge>
          </div>

          <h1 style={{
            margin: '20px auto 0', fontWeight: 700, fontSize: 'clamp(34px,5.4vw,64px)', lineHeight: 1.08,
            letterSpacing: '-0.03em', color: 'var(--paper-100)', maxWidth: '18ch',
          }}>
            A Full-Time Receptionist. <span style={{ color: 'var(--cyan-500)' }}>Without The Full-Time Cost.</span>
          </h1>

          <p style={{ margin: '24px auto 0', fontSize: 'var(--fs-body-lg)', lineHeight: 1.6,
            color: 'var(--ink-300)', maxWidth: '52ch' }}>
            Answers every call, greets callers by your business name, books the appointment, and never calls out
            sick — for a fraction of what one payroll costs.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 32, justifyContent: 'center' }}>
            <Button variant="primary" size="lg" iconRight={<span>→</span>}
              onClick={() => document.getElementById('qualify')?.scrollIntoView({ behavior: 'smooth' })}>
              Take The 60-Second Fit Check
            </Button>
            <Button variant="secondary" size="lg" onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>
              See how it works ↓
            </Button>
          </div>

          <div style={{ display: 'flex', gap: 0, marginTop: 56, borderTop: '1px solid var(--border-hair-inverse)', justifyContent: 'center' }}>
            {[
              ['24/7', 'Always answers'],
              ['< 1 s', 'Time to pick up'],
              ['~1 week', 'To go live'],
              ['$0', 'Sick days'],
            ].map(([val, label], i) => (
              <div key={label} style={{ padding: '20px 24px 0', borderLeft: i ? '1px solid var(--border-hair-inverse)' : 'none' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px,3vw,30px)', fontWeight: 700,
                  letterSpacing: '-0.03em', color: 'var(--cyan-500)', lineHeight: 1 }}>{val}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '0.1em',
                  textTransform: 'uppercase', color: 'var(--ink-400)', marginTop: 6, whiteSpace: 'nowrap' }}>{label}</div>
              </div>
            ))}
          </div>
        </Wrap>
      </section>

      {/* ── PROBLEM ── */}
      <section style={{ background: 'var(--paper-100)', padding: 'clamp(64px,9vw,100px) 0' }}>
        <Wrap>
          <Eyebrow>The real cost of a front desk</Eyebrow>
          <h2 style={{ margin: 0, fontSize: 'clamp(26px,4vw,42px)', fontWeight: 700,
            letterSpacing: '-0.03em', lineHeight: 1.15, color: 'var(--ink-900)', maxWidth: '24ch' }}>
            A human receptionist costs more than you think — and answers less than you need.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 1,
            marginTop: 40, background: 'var(--border-hair)', border: '1px solid var(--border-hair)' }}>
            {problems.map(([title, desc]) => (
              <div key={title} style={{ background: 'var(--paper-100)', padding: '28px 24px', display: 'grid', gap: 12 }}>
                <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'rgba(255,74,61,0.1)',
                  border: '1px solid rgba(255,74,61,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: 13, color: 'var(--status-danger)' }}>✕</div>
                <h3 style={{ margin: 0, fontSize: 15.5, fontWeight: 700, letterSpacing: '-0.01em', color: 'var(--ink-900)' }}>{title}</h3>
                <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.6, color: 'var(--ink-500)' }}>{desc}</p>
              </div>
            ))}
          </div>
        </Wrap>
      </section>

      {/* ── CAPABILITIES ── */}
      <section id="how-it-works" style={{ background: 'var(--paper-200)', padding: 'clamp(64px,9vw,100px) 0' }}>
        <Wrap>
          <Eyebrow>What it actually does</Eyebrow>
          <h2 style={{ margin: '0 0 44px', fontSize: 'clamp(26px,3.5vw,42px)', fontWeight: 700,
            letterSpacing: '-0.03em', lineHeight: 1.15, color: 'var(--ink-900)', maxWidth: '26ch' }}>
            Everything your front desk does. None of the payroll.
          </h2>
          <div className="ll-grid-4" style={{ gap: 16 }}>
            {capabilities.map(([title, desc], i) => (
              <div key={title} style={{
                background: 'var(--paper-000)', border: '1px solid var(--border-hair)',
                borderRadius: 'var(--radius-2)', padding: '26px 22px',
                boxShadow: '3px 3px 0 var(--border-hair)',
              }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.12em',
                  color: 'var(--cyan-700)', marginBottom: 14 }}>0{i + 1}</div>
                <h3 style={{ margin: '0 0 10px', fontSize: 15.5, fontWeight: 700,
                  letterSpacing: '-0.01em', color: 'var(--ink-900)' }}>{title}</h3>
                <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.6, color: 'var(--ink-500)' }}>{desc}</p>
              </div>
            ))}
          </div>
        </Wrap>
      </section>

      {/* ── COST COMPARISON ── */}
      <section style={{ background: 'var(--paper-100)', padding: 'clamp(64px,9vw,100px) 0' }}>
        <Wrap>
          <Eyebrow>AI Receptionist vs. human receptionist</Eyebrow>
          <h2 style={{ margin: '0 0 40px', fontSize: 'clamp(24px,3vw,38px)', fontWeight: 700,
            letterSpacing: '-0.03em', lineHeight: 1.15, color: 'var(--ink-900)', maxWidth: '26ch' }}>
            Side by side, it's not close.
          </h2>

          <div className="air-compare-table" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14,
              background: 'var(--paper-000)', border: '1px solid var(--ink-900)',
              boxShadow: '4px 4px 0 var(--ink-900)' }}>
              <thead>
                <tr style={{ background: 'var(--ink-900)', color: 'var(--paper-100)' }}>
                  <th style={{ textAlign: 'left', padding: '14px 20px', fontFamily: 'var(--font-mono)',
                    fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase',
                    borderRight: '1px solid var(--border-hair-inverse)', width: '34%' }}>Category</th>
                  <th style={{ textAlign: 'center', padding: '14px 20px', fontFamily: 'var(--font-mono)',
                    fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--cyan-500)',
                    borderRight: '1px solid var(--border-hair-inverse)' }}>AI Receptionist</th>
                  <th style={{ textAlign: 'center', padding: '14px 20px', fontFamily: 'var(--font-mono)',
                    fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-300)' }}>Human Receptionist</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map(([feat, ai, human], i) => (
                  <tr key={feat} style={{ borderTop: '1px solid var(--border-hair)',
                    background: i % 2 === 1 ? 'var(--paper-100)' : 'var(--paper-000)' }}>
                    <td style={{ padding: '14px 20px', color: 'var(--ink-700)', fontWeight: 600,
                      borderRight: '1px solid var(--border-hair)' }}>{feat}</td>
                    <td style={{ padding: '14px 20px', textAlign: 'center', color: 'var(--cyan-700)',
                      fontWeight: 600, borderRight: '1px solid var(--border-hair)' }}>{ai}</td>
                    <td style={{ padding: '14px 20px', textAlign: 'center', color: 'var(--ink-500)' }}>{human}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="air-compare-cards" style={{ display: 'none', flexDirection: 'column', gap: 12 }}>
            {comparison.map(([feat, ai, human]) => (
              <div key={feat} style={{ background: 'var(--paper-000)', border: '1px solid var(--ink-900)',
                borderRadius: 'var(--radius-2)', padding: '18px 20px', boxShadow: '3px 3px 0 var(--ink-900)' }}>
                <div style={{ fontWeight: 700, fontSize: 14.5, color: 'var(--ink-900)', marginBottom: 12 }}>{feat}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '8px 0', borderTop: '1px solid var(--border-hair)' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em',
                    textTransform: 'uppercase', color: 'var(--ink-400)' }}>AI Receptionist</span>
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--cyan-700)' }}>{ai}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '8px 0', borderTop: '1px solid var(--border-hair)' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em',
                    textTransform: 'uppercase', color: 'var(--ink-400)' }}>Human Receptionist</span>
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink-500)' }}>{human}</span>
                </div>
              </div>
            ))}
          </div>
        </Wrap>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ background: 'var(--ink-900)', padding: 'clamp(64px,9vw,100px) 0' }}>
        <Wrap>
          <Eyebrow light>What clients say</Eyebrow>
          <h2 style={{ margin: '0 0 40px', fontSize: 'clamp(24px,3vw,38px)', fontWeight: 700,
            letterSpacing: '-0.03em', lineHeight: 1.15, color: 'var(--paper-100)', maxWidth: '22ch' }}>
            Real reviews from real Loogo Labs clients.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
            {testimonials.map((t) => (
              <div key={t.name} style={{ background: 'var(--ink-800)', border: '1px solid var(--border-hair-inverse)',
                borderRadius: 'var(--radius-2)', padding: '26px 24px', display: 'grid', gap: 14, alignContent: 'start' }}>
                <span style={{ color: 'var(--cyan-500)', fontSize: 14, letterSpacing: 2 }}>{'★'.repeat(t.stars)}</span>
                <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.65, color: 'var(--ink-200)' }}>{t.quote}</p>
                <span style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--paper-100)' }}>{t.name}</span>
              </div>
            ))}
          </div>
        </Wrap>
      </section>

      {/* ── INDUSTRIES ── */}
      <section style={{ background: 'var(--paper-100)', padding: 'clamp(64px,9vw,100px) 0' }}>
        <Wrap>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 56 }}>
            <div>
              <Eyebrow>Who it's built for</Eyebrow>
              <h2 style={{ margin: '0 0 20px', fontSize: 'clamp(22px,3vw,34px)', fontWeight: 700,
                letterSpacing: '-0.03em', lineHeight: 1.15, color: 'var(--ink-900)' }}>
                Any business where a missed call is a missed sale.
              </h2>
              <p style={{ margin: '0 0 28px', fontSize: 15, lineHeight: 1.65, color: 'var(--ink-500)' }}>
                If your revenue depends on picking up the phone, this pays for itself within the first week.
              </p>
            </div>
            <div>
              <div className="air-industries-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1,
                background: 'var(--border-hair)', border: '1px solid var(--border-hair)' }}>
                {industries.map((ind) => (
                  <div key={ind} style={{ background: 'var(--paper-100)', padding: '16px 18px',
                    display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ color: 'var(--cyan-700)', fontSize: 12, flexShrink: 0 }}>→</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-900)', letterSpacing: '-0.01em' }}>{ind}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Wrap>
      </section>

      {/* ── QUALIFICATION QUIZ ── */}
      <section id="qualify" className="ll-grid-bg--inverse" style={{ background: 'var(--ink-900)', padding: 'clamp(64px,9vw,100px) 0' }}>
        <Wrap>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <Badge tone="inverse">60-second fit check</Badge>
            <h2 style={{ margin: '16px auto 0', fontSize: 'clamp(26px,4vw,42px)', fontWeight: 700,
              letterSpacing: '-0.03em', lineHeight: 1.15, color: 'var(--paper-100)', maxWidth: '20ch' }}>
              See if an AI Receptionist fits your business.
            </h2>
            <p style={{ margin: '16px auto 0', fontSize: 15, lineHeight: 1.65, color: 'var(--ink-300)', maxWidth: '44ch' }}>
              Four quick questions. No email required to start — just answer honestly and we'll tell you where you stand.
            </p>
          </div>
          <div style={{ maxWidth: 560, margin: '0 auto', background: 'var(--paper-100)',
            border: '2px solid var(--ink-900)', borderRadius: 'var(--radius-3)', padding: 'clamp(28px,4vw,40px)',
            boxShadow: '6px 6px 0 var(--cyan-500)' }}>
            <Quiz />
          </div>
        </Wrap>
      </section>

      {/* ── FAQ ── */}
      <section style={{ background: 'var(--paper-100)', padding: 'clamp(64px,9vw,100px) 0' }}>
        <Wrap>
          <Eyebrow>Common questions</Eyebrow>
          <h2 style={{ margin: '0 0 40px', fontSize: 'clamp(24px,3vw,38px)', fontWeight: 700,
            letterSpacing: '-0.03em', lineHeight: 1.15, color: 'var(--ink-900)', maxWidth: '22ch' }}>
            Before you book, you probably want to know.
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'var(--border-hair)',
            border: '1px solid var(--border-hair)' }}>
            {faqs.map(([q, a], i) => {
              const open = openFaq === i;
              return (
                <div key={q} style={{ background: open ? 'var(--paper-000)' : 'var(--paper-100)', transition: 'background 140ms ease' }}>
                  <button onClick={() => setOpenFaq(open ? null : i)}
                    style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '20px 22px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', gap: 16 }}>
                    <span style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--ink-900)', letterSpacing: '-0.01em' }}>{q}</span>
                    <span style={{ fontSize: 18, color: open ? 'var(--cyan-700)' : 'var(--ink-400)', flexShrink: 0,
                      transition: 'transform 200ms ease, color 200ms ease', transform: open ? 'rotate(45deg)' : 'none' }}>+</span>
                  </button>
                  {open && (
                    <div style={{ padding: '0 22px 22px' }}>
                      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.65, color: 'var(--ink-600)' }}>{a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Wrap>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ background: 'var(--ink-900)', padding: 'clamp(64px,8vw,88px) 0', color: 'var(--paper-100)', textAlign: 'center' }}>
        <Wrap>
          <h2 style={{ margin: '0 auto', fontSize: 'clamp(24px,3.6vw,38px)', fontWeight: 700,
            letterSpacing: '-0.03em', lineHeight: 1.15, maxWidth: '20ch' }}>
            Stop paying for a front desk that can't keep up.
          </h2>
          <div style={{ marginTop: 28 }}>
            <Button variant="primary" size="lg" iconRight={<span>→</span>}
              onClick={() => document.getElementById('qualify')?.scrollIntoView({ behavior: 'smooth' })}>
              Take The Fit Check
            </Button>
          </div>
        </Wrap>
      </section>

      {/* ── MINIMAL FOOTER ── */}
      <footer style={{ background: 'var(--ink-900)', borderTop: '1px solid var(--border-hair-inverse)', padding: '24px 0' }}>
        <Wrap style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12,
          fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.06em', color: 'var(--ink-400)' }}>
          <span>© {new Date().getFullYear()} Loogo Labs</span>
          <div style={{ display: 'flex', gap: 20 }}>
            <a href="/privacy" style={{ color: 'var(--ink-400)', textDecoration: 'none' }}>Privacy</a>
            <a href="/terms" style={{ color: 'var(--ink-400)', textDecoration: 'none' }}>Terms</a>
            <a href="mailto:david@loogolabs.com" style={{ color: 'var(--ink-400)', textDecoration: 'none' }}>david@loogolabs.com</a>
          </div>
        </Wrap>
      </footer>

    </main>
  );
}
