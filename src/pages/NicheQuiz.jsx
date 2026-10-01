import React from 'react';
import Badge from '../components/feedback/Badge';
import Button from '../components/core/Button';
import Input from '../components/forms/Input';
import { openBooking } from '../lib/booking';
import { getSessionId } from '../lib/sessionTracker';
import { NICHE_BY_PAGE, DECISION_NO, DECISION_YES } from '../lib/nicheQuizzes';

// One component for every niche fit check in lib/nicheQuizzes.js:
// intro → questions → name & email → result. Same funnel shape and lead
// payload as the Reputation Autopilot quiz, minus the long intro sequence.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const fire = (event, params) => { if (window.fbq) window.fbq('track', event, params); };
const fireCustom = (event, params) => { if (window.fbq) window.fbq('trackCustom', event, params); };
const trackBook = () => { fire('Schedule'); openBooking(); };

const Card = ({ children, style }) => (
  <div style={{ maxWidth: 640, margin: '0 auto', width: '100%', ...style }}>{children}</div>
);
const Eyebrow = ({ children }) => (
  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase',
    color: 'var(--cyan-700)', marginBottom: 14, textAlign: 'center' }}>{children}</div>
);
const StepHeading = ({ children }) => (
  <h2 style={{ margin: '0 0 28px', fontSize: 'clamp(24px,4vw,34px)', fontWeight: 700,
    letterSpacing: '-0.03em', lineHeight: 1.2, color: 'var(--ink-900)', textAlign: 'center' }}>{children}</h2>
);

export default function NicheQuiz({ page }) {
  const quiz = NICHE_BY_PAGE[page];
  const questions = quiz.questions;
  // step 0 = intro, 1..n = questions, n+1 = contact, n+2 = result
  const CONTACT = questions.length + 1;
  const RESULT = CONTACT + 1;
  const [step, setStep] = React.useState(0);
  const [answers, setAnswers] = React.useState({});
  const [contact, setContact] = React.useState({ fullName: '', email: '' });
  const [error, setError] = React.useState('');

  const go = (n) => { setStep(n); fireCustom('FunnelStep', { quiz: quiz.source, step: n }); window.scrollTo(0, 0); };

  const choose = (qi, key, option) => {
    setAnswers((a) => ({ ...a, [key]: option }));
    fireCustom('QuizStep', { quiz: quiz.source, step: qi + 1, question: key, answer: option });
    go(qi + 2);
  };

  const submit = () => {
    const full_name = contact.fullName.trim();
    const email = contact.email.trim();
    if (!full_name || !EMAIL_RE.test(email)) {
      setError('Enter your full name and a valid email to see your results.');
      return;
    }
    setError('');
    const notes = questions.map((q) => `${q.question}\n→ ${answers[q.key] || '—'}`).join('\n\n');
    fetch('/.netlify/functions/create-lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ full_name, email, source: quiz.source, session_id: getSessionId(), notes, ...answers }),
    }).catch(() => {
      // Non-blocking: the visitor still sees their result even if the write fails.
    });
    fireCustom('FunnelContact', { quiz: quiz.source });
    if (answers.decision_maker === DECISION_YES) fire('Lead');
    go(RESULT);
  };

  let body;
  if (step === 0) {
    body = (
      <Card style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <span className="ll-live-dot" aria-hidden="true" />
          <Badge tone="accent">{quiz.label}</Badge>
        </div>
        <h1 style={{ margin: '20px 0 0', fontWeight: 700, fontSize: 'clamp(30px,5.4vw,48px)', lineHeight: 1.1,
          letterSpacing: '-0.03em', color: 'var(--ink-900)' }}>{quiz.headline}</h1>
        <p style={{ margin: '20px 0 0', fontSize: 16, lineHeight: 1.6, color: 'var(--ink-500)' }}>{quiz.lede}</p>
        <div style={{ marginTop: 32 }}>
          <Button variant="primary" size="lg" iconRight={<span>→</span>} onClick={() => go(1)} fullWidth>Start My 60-Second Fit Check</Button>
        </div>
        <p style={{ marginTop: 14, fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '0.08em',
          textTransform: 'uppercase', color: 'var(--ink-400)' }}>Takes 60 seconds · No cost · No obligation</p>
      </Card>
    );
  } else if (step <= questions.length) {
    const qi = step - 1;
    const q = questions[qi];
    body = (
      <Card>
        <Eyebrow>Fit check · Question {qi + 1} of {questions.length}</Eyebrow>
        <StepHeading>{q.question}</StepHeading>
        <div style={{ display: 'grid', gap: 10 }}>
          {q.options.map((opt) => (
            <button key={opt} onClick={() => choose(qi, q.key, opt)} style={{
              textAlign: 'left', padding: '16px 18px', background: answers[q.key] === opt ? 'var(--paper-200)' : 'var(--paper-100)',
              border: `1px solid ${answers[q.key] === opt ? 'var(--cyan-700)' : 'var(--border-hair)'}`, borderRadius: 'var(--radius-2)',
              fontSize: 14.5, fontWeight: 600, color: 'var(--ink-800)', cursor: 'pointer',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
              {opt}
              <span style={{ color: 'var(--cyan-700)', flexShrink: 0 }}>→</span>
            </button>
          ))}
        </div>
      </Card>
    );
  } else if (step === CONTACT) {
    body = (
      <Card>
        <Eyebrow>Fit check · Almost done</Eyebrow>
        <StepHeading>Where should we send your results?</StepHeading>
        <div style={{ display: 'grid', gap: 16 }}>
          <Input label="Full name" value={contact.fullName}
            onChange={(e) => setContact((c) => ({ ...c, fullName: e.target.value }))} placeholder="Jane Smith" />
          <Input label="Email" type="email" value={contact.email}
            onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))}
            placeholder="jane@yourbusiness.com" error={error} />
        </div>
        <div style={{ marginTop: 32 }}>
          <Button variant="primary" size="lg" iconRight={<span>→</span>} onClick={submit} fullWidth>See My Results</Button>
        </div>
      </Card>
    );
  } else {
    body = answers.decision_maker === DECISION_NO ? (
      <Card style={{ textAlign: 'center' }}>
        <h2 style={{ margin: '0 0 14px', fontSize: 26, fontWeight: 700, color: 'var(--ink-900)' }}>No problem — bring in the decision-maker.</h2>
        <p style={{ margin: '0 0 28px', fontSize: 15.5, lineHeight: 1.65, color: 'var(--ink-500)' }}>
          Share this page with them, or book the call together — 15 minutes is enough to see the fit.
        </p>
        <Button variant="secondary" size="lg" onClick={trackBook} fullWidth>Book the call anyway</Button>
      </Card>
    ) : (
      <Card style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}><Badge tone="ok">You qualify</Badge></div>
        <h2 style={{ margin: '18px 0 14px', fontSize: 28, fontWeight: 700, color: 'var(--ink-900)', lineHeight: 1.2 }}>
          {quiz.product} is built for businesses like yours.
        </h2>
        <p style={{ margin: '0 0 32px', fontSize: 15.5, lineHeight: 1.65, color: 'var(--ink-500)' }}>
          {quiz.result} Book a free 20-minute fit call and we'll show you exactly how it would work for you.
        </p>
        <Button variant="primary" size="lg" iconRight={<span>→</span>} onClick={trackBook} fullWidth>Book My Free Fit Call</Button>
      </Card>
    );
  }

  const progressPct = step === 0 ? 0 : Math.min(step, CONTACT) / CONTACT * 100;

  return (
    <main style={{ fontFamily: 'var(--font-body)', overflowX: 'hidden', background: 'var(--paper-000)', minHeight: '100vh',
      display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--paper-000)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', padding: '16px 24px' }}>
          <div style={{ justifySelf: 'start' }}>
            {step > 0 && step < RESULT && (
              <button onClick={() => go(step - 1)} style={{ background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-400)' }}>
                ← Back
              </button>
            )}
          </div>
          <a href="/quizzes" style={{ justifySelf: 'center' }}><img src="/logo.png" alt="Loogo Labs" style={{ height: 22, width: 'auto', display: 'block' }} /></a>
          <div style={{ justifySelf: 'end' }}>
            {step > 0 && step < RESULT && (
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', color: 'var(--ink-400)' }}>{step}/{CONTACT}</span>
            )}
          </div>
        </div>
        <div style={{ height: 3, background: 'var(--border-hair)' }}>
          <div style={{ height: '100%', width: `${progressPct}%`, background: 'var(--cyan-700)', transition: 'width 240ms ease' }} />
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: 'clamp(32px,6vw,64px) 24px' }}>
        <div style={{ width: '100%' }}>{body}</div>
      </div>

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
