import React from 'react';
import Badge from '../components/feedback/Badge';
import Button from '../components/core/Button';
import Input from '../components/forms/Input';
import { openBooking } from '../lib/booking';
import { getSessionId } from '../lib/sessionTracker';
import { ArrowLeft, ArrowRight } from '@phosphor-icons/react';
import '../styles/pages/quiz.css';
import { NICHE_BY_PAGE, DECISION_NO, DECISION_YES } from '../lib/nicheQuizzes';
import { NICHE_QUIZZES_ES } from '../lib/nicheQuizzes.es';
import { useLang, LangToggle } from '../lib/i18n';

// One component for every niche fit check in lib/nicheQuizzes.js:
// intro → questions → name & email → result. Same funnel shape and lead
// payload as the Reputation Autopilot quiz, minus the long intro sequence.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const fire = (event, params) => { if (window.fbq) window.fbq('track', event, params); };
const fireCustom = (event, params) => { if (window.fbq) window.fbq('trackCustom', event, params); };
const trackBook = () => { fire('Schedule'); openBooking(); };

const Card = ({ children, style }) => (
  <div className="nq-card ll-glass" style={style}>{children}</div>
);
const Eyebrow = ({ children }) => <div className="nq-eyebrow">{children}</div>;
const StepHeading = ({ children }) => <h2 className="nq-step-title">{children}</h2>;
const Arrow = () => <ArrowRight size={16} weight="bold" />;

export default function NicheQuiz({ page }) {
  const es = useLang() === 'es';
  const quiz = NICHE_BY_PAGE[page];
  const t = es ? { ...quiz, ...NICHE_QUIZZES_ES[page] } : quiz;
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
      setError(es ? 'Escribe tu nombre completo y un correo válido para ver tus resultados.' : 'Enter your full name and a valid email to see your results.');
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
          <Badge tone="accent">{t.label}</Badge>
        </div>
        <h1 className="nq-title">{t.headline}</h1>
        <p className="nq-lede">{t.lede}</p>
        <div style={{ marginTop: 32 }}>
          <Button variant="inverse" size="lg" iconRight={<Arrow />} onClick={() => go(1)} fullWidth>{es ? 'Empezar mi evaluación de 60 segundos' : 'Start My 60-Second Fit Check'}</Button>
        </div>
        <p className="nq-fine">{es ? 'Toma 60 segundos · Sin costo · Sin compromiso' : 'Takes 60 seconds · No cost · No obligation'}</p>
      </Card>
    );
  } else if (step <= questions.length) {
    const qi = step - 1;
    const q = questions[qi];
    const qt = es ? t.questions[qi] : q;
    body = (
      <Card>
        <Eyebrow>{es ? `Evaluación · Pregunta ${qi + 1} de ${questions.length}` : <>Fit check · Question {qi + 1} of {questions.length}</>}</Eyebrow>
        <StepHeading>{qt.question}</StepHeading>
        <div className="nq-options">
          {q.options.map((opt, oi) => (
            <button key={opt} onClick={() => choose(qi, q.key, opt)}
              className={`nq-option${answers[q.key] === opt ? ' is-selected' : ''}`} aria-pressed={answers[q.key] === opt}>
              <span>{qt.options[oi]}</span>
              <span className="nq-option__icon" aria-hidden="true"><ArrowRight size={16} weight="bold" /></span>
            </button>
          ))}
        </div>
      </Card>
    );
  } else if (step === CONTACT) {
    body = (
      <Card>
        <Eyebrow>{es ? 'Evaluación · Casi listo' : 'Fit check · Almost done'}</Eyebrow>
        <StepHeading>{es ? '¿A dónde te enviamos tus resultados?' : 'Where should we send your results?'}</StepHeading>
        <div style={{ display: 'grid', gap: 16 }}>
          <Input label={es ? 'Nombre completo' : 'Full name'} value={contact.fullName}
            onChange={(e) => setContact((c) => ({ ...c, fullName: e.target.value }))} placeholder={es ? 'María Pérez' : 'Jane Smith'} />
          <Input label={es ? 'Correo electrónico' : 'Email'} type="email" value={contact.email}
            onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))}
            placeholder={es ? 'maria@tunegocio.com' : 'jane@yourbusiness.com'} error={error} />
        </div>
        <div style={{ marginTop: 32 }}>
          <Button variant="inverse" size="lg" iconRight={<Arrow />} onClick={submit} fullWidth>{es ? 'Ver mis resultados' : 'See My Results'}</Button>
        </div>
      </Card>
    );
  } else {
    body = answers.decision_maker === DECISION_NO ? (
      <Card style={{ textAlign: 'center' }}>
        <h2 className="nq-result-title">{es ? 'No hay problema. Invita a quien toma la decisión.' : 'No problem. Bring in the decision-maker.'}</h2>
        <p className="nq-result-text">
          {es
            ? 'Comparte esta página con esa persona, o agenden la llamada juntos: 15 minutos bastan para ver si es para ustedes.'
            : 'Share this page with them, or book the call together: 15 minutes is enough to see the fit.'}
        </p>
        <Button variant="secondary" size="lg" onClick={trackBook} fullWidth>{es ? 'Agendar la llamada de todos modos' : 'Book the call anyway'}</Button>
      </Card>
    ) : (
      <Card style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}><Badge tone="ok">{es ? 'Calificas' : 'You qualify'}</Badge></div>
        <h2 className="nq-result-title" style={{ marginTop: 18 }}>
          {es ? `${t.product} es ideal para negocios como el tuyo.` : <>{quiz.product} is built for businesses like yours.</>}
        </h2>
        <p className="nq-result-text">
          {es
            ? `${t.result} Agenda una llamada gratis de 20 minutos y te mostramos exactamente cómo funcionaría para ti.`
            : <>{quiz.result} Book a free 20-minute fit call and we'll show you exactly how it would work for you.</>}
        </p>
        <Button variant="inverse" size="lg" iconRight={<Arrow />} onClick={trackBook} fullWidth>{es ? 'Agendar mi llamada gratis' : 'Book My Free Fit Call'}</Button>
      </Card>
    );
  }

  const progressPct = step === 0 ? 0 : Math.min(step, CONTACT) / CONTACT * 100;

  return (
    <main className="ll-shell nq-page">
      <header className="ll-nav">
        <div className="ll-nav__bar ll-glass--dark nq-bar">
          <div className="nq-bar__side">
            {step > 0 && step < RESULT && (
              <button onClick={() => go(step - 1)} className="nq-back">
                <ArrowLeft size={14} weight="bold" aria-hidden="true" /> {es ? 'Atrás' : 'Back'}
              </button>
            )}
          </div>
          <a href="/quizzes" className="ll-nav__logo" aria-label="Loogo Labs"><img src="/logo.png" alt="Loogo Labs" /></a>
          <div className="nq-bar__side nq-bar__side--end">
            {step > 0 && step < RESULT && (
              <span className="nq-count">{step}/{CONTACT}</span>
            )}
            <LangToggle />
          </div>
          <div className="nq-progress" aria-hidden="true">
            <div className="nq-progress__fill" style={{ width: `${progressPct}%` }} />
          </div>
        </div>
      </header>

      <div className="nq-stage">
        <div style={{ width: '100%' }}>{body}</div>
      </div>

      <footer className="nq-footer">
        <span>© {new Date().getFullYear()} Loogo Labs</span>
        <a href="/privacy">{es ? 'Privacidad' : 'Privacy'}</a>
        <a href="/terms">{es ? 'Términos' : 'Terms'}</a>
      </footer>
    </main>
  );
}
