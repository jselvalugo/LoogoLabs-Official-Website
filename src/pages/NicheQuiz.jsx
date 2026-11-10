import React from 'react';
import {
  ArrowLeft, ArrowRight, X, Check, ThumbsUp,
  ChatCircleText, CalendarCheck, Tray, Star, Bell, ArrowsClockwise, UserPlus, Lightning, Heart, House, ChatsCircle, Clock, Key,
} from '@phosphor-icons/react';
import Badge from '../components/feedback/Badge';
import Button from '../components/core/Button';
import Input from '../components/forms/Input';
import { openBooking } from '../lib/booking';
import { trackLead, leadMeta } from '../lib/metaEvents';
import { getSessionId } from '../lib/sessionTracker';
import '../styles/pages/landing.css';
import { NICHE_BY_PAGE, DECISION_NO, DECISION_YES } from '../lib/nicheQuizzes';
import { NICHE_QUIZZES_ES } from '../lib/nicheQuizzes.es';
import { NICHE_FUNNELS } from '../lib/nicheFunnels';
import { useHref, useLang, LangToggle } from '../lib/i18n';
import { getAttribution, gaLead } from '../lib/attribution';

// One component for every niche fit check in lib/nicheQuizzes.js. Same structure
// as the AI Receptionist and Reputation Autopilot funnels:
//   hero (stats) → problem → what it does → side by side → reviews → questions → contact → result
// The hero's Start button goes straight to the questions; the four explainer
// screens are an optional "see how it works first" path. Topic copy lives in
// lib/nicheFunnels.js; the lead payload is unchanged.

const ICONS = { ChatCircleText, CalendarCheck, Tray, Star, Bell, ArrowsClockwise, UserPlus, Lightning, Heart, House, ChatsCircle, Clock, Key };

// Phone keyboards: Enter in the name field moves to email instead of submitting.
const nextOnEnter = (e) => {
  if (e.key === 'Enter' && e.target.name === 'name') { e.preventDefault(); e.currentTarget.elements.email?.focus(); }
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const fireCustom = (event, params) => { if (window.fbq) window.fbq('trackCustom', event, params); };
const trackBook = () => openBooking();
const show = (s) => s.replace(/–/g, '-');

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

const TESTIMONIALS = [
  { src: '/testimonial-sally-butler.png', en: '5-star Facebook recommendation from Sally Butler for Loogo Labs', es: 'Recomendación de 5 estrellas en Facebook de Sally Butler para Loogo Labs' },
  { src: '/testimonial-kristin-pitts.png', en: '5-star Facebook recommendation from Kristin Pitts for Loogo Labs', es: 'Recomendación de 5 estrellas en Facebook de Kristin Pitts para Loogo Labs' },
];
function TestimonialImage({ src, alt }) {
  const [failed, setFailed] = React.useState(false);
  if (failed) return null;
  return <img src={src} alt={alt} onError={() => setFailed(true)} className="lp-proof__img" />;
}

const PRE_QUIZ_STEPS = ['hero', 'problem', 'capabilities', 'compare', 'proof'];
const QUIZ_START = PRE_QUIZ_STEPS.length;

export default function NicheQuiz({ page }) {
  const es = useLang() === 'es';
  const toHref = useHref();
  const quiz = NICHE_BY_PAGE[page];
  const t = es ? { ...quiz, ...NICHE_QUIZZES_ES[page] } : quiz;
  const f = NICHE_FUNNELS[page][es ? 'es' : 'en'];
  const questions = quiz.questions;
  const CONTACT = QUIZ_START + questions.length;
  const RESULT = CONTACT + 1;

  const [step, setStep] = React.useState(0);
  const [answers, setAnswers] = React.useState({});
  const [contact, setContact] = React.useState({ fullName: '', email: '' });
  const [error, setError] = React.useState('');

  const go = (n) => { setStep(n); fireCustom('FunnelStep', { quiz: quiz.source, step: n }); window.scrollTo(0, 0); };

  const choose = (qi, key, option) => {
    setAnswers((a) => ({ ...a, [key]: option }));
    fireCustom('QuizStep', { quiz: quiz.source, step: qi + 1, question: key, answer: option });
    go(QUIZ_START + qi + 1);
  };

  const submit = () => {
    const full_name = contact.fullName.trim();
    const email = contact.email.trim();
    if (!full_name || !EMAIL_RE.test(email)) {
      setError(es ? 'Escribe tu nombre completo y un correo válido para ver tus resultados.' : 'Enter your full name and a valid email to see your results.');
      return;
    }
    setError('');
    const metaId = answers.decision_maker === DECISION_YES ? trackLead() : null;
    const notes = questions.map((q) => `${q.question}\n→ ${answers[q.key] || '—'}`).join('\n\n');
    gaLead(quiz.source, answers.decision_maker);
    fetch('/.netlify/functions/create-lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ full_name, email, source: quiz.source, session_id: getSessionId(), attribution: getAttribution(), notes, ...answers, ...leadMeta(metaId) }),
    }).catch(() => {
      // Non-blocking: the visitor still sees their result even if the write fails.
    });
    fireCustom('FunnelContact', { quiz: quiz.source });
    go(RESULT);
  };

  const isIntroStep = step < QUIZ_START;
  const isResult = step >= RESULT;
  const quizTotal = questions.length + 1; // questions + contact
  const progressPct = isIntroStep ? 0 : Math.min(step - QUIZ_START + 1, quizTotal) / quizTotal * 100;
  const startLabel = es ? 'Empezar mi evaluación de 60 segundos' : 'Start My 60-Second Fit Check';

  let body;
  if (isResult) {
    body = answers.decision_maker === DECISION_NO ? (
      <Card>
        <div className="lp-result-icon"><ThumbsUp size={26} weight="duotone" /></div>
        <h2 className="lp-h2">{es ? 'No hay problema. Invita a quien toma la decisión.' : 'No problem. Bring in the decision-maker.'}</h2>
        <p className="lp-lede">
          {es ? 'Comparte esta página con esa persona, o agenden la llamada juntos: 15 minutos bastan para ver si es para ustedes.'
            : 'Share this page with them, or book the call together: 15 minutes is enough to see the fit.'}
        </p>
        <div className="lp-continue">
          <Button variant="secondary" size="lg" onClick={trackBook} fullWidth>{es ? 'Agendar la llamada de todos modos' : 'Book the call anyway'}</Button>
        </div>
      </Card>
    ) : (
      <Card tone="forest">
        <div className="lp-center"><Badge tone="ok">{es ? 'Calificas' : 'You qualify'}</Badge></div>
        <h2 className="lp-h2">{es ? `${t.product} es ideal para negocios como el tuyo.` : `${quiz.product} is built for businesses like yours.`}</h2>
        <p className="lp-lede">
          {es ? `${t.result} Agenda una llamada gratis de 20 minutos y te mostramos exactamente cómo funcionaría para ti.`
            : `${quiz.result} Book a free 20-minute fit call and we'll show you exactly how it would work for you.`}
        </p>
        <ContinueRow onNext={trackBook} label={es ? 'Agendar mi llamada gratis' : 'Book My Free Fit Call'} variant="primary" />
      </Card>
    );
  } else if (step === CONTACT) {
    body = (
      <Card>
        <Eyebrow>{es ? 'Evaluación · Casi listo' : 'Fit check · Almost done'}</Eyebrow>
        <StepHeading>{es ? '¿A dónde te enviamos tus resultados?' : 'Where should we send your results?'}</StepHeading>
        <form className="lp-fields" noValidate onKeyDown={nextOnEnter} onSubmit={(e) => { e.preventDefault(); submit(); }}>
          <Input label={es ? 'Nombre completo' : 'Full name'} value={contact.fullName} name="name"
            autoComplete="name" autoCapitalize="words" enterKeyHint="next"
            onChange={(e) => setContact((c) => ({ ...c, fullName: e.target.value }))} placeholder={es ? 'María Pérez' : 'Jane Smith'} />
          <Input label={es ? 'Correo electrónico' : 'Email'} type="email" value={contact.email} name="email"
            autoComplete="email" inputMode="email" autoCapitalize="none" autoCorrect="off" spellCheck={false} enterKeyHint="go"
            onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))}
            placeholder={es ? 'maria@tunegocio.com' : 'jane@yourbusiness.com'} error={error} />
          <button type="submit" className="ll-sr-submit" aria-hidden="true" tabIndex={-1} />
        </form>
        <ContinueRow onNext={submit} label={es ? 'Ver mis resultados' : 'See My Results'} />
      </Card>
    );
  } else if (!isIntroStep) {
    const qi = step - QUIZ_START;
    const q = questions[qi];
    const qt = es ? t.questions[qi] : q;
    body = (
      <Card>
        <Eyebrow>{es ? `Evaluación · Pregunta ${qi + 1} de ${questions.length}` : `Fit check · Question ${qi + 1} of ${questions.length}`}</Eyebrow>
        <StepHeading>{qt.question}</StepHeading>
        <div className="lp-options">
          {q.options.map((opt, oi) => (
            <button key={opt} className="lp-option" onClick={() => choose(qi, q.key, opt)}>
              {show(qt.options[oi])}
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
          <h1 className="lp-h1">{f.h1[0]} <em>{f.h1[1]}</em></h1>
          <p className="lp-lede">{t.lede}</p>
          <div className="lp-stats">
            {f.stats.map(([val, label]) => (
              <div key={label} className="lp-stat">
                <div className="lp-stat__val">{val}</div>
                <div className="lp-stat__label">{label}</div>
              </div>
            ))}
          </div>
          <div className="lp-hero__cta">
            <ContinueRow onNext={() => go(QUIZ_START)} label={startLabel} />
            <p className="lp-fine">{es ? 'Toma 60 segundos · Sin costo · Sin compromiso' : 'Takes 60 seconds · No cost · No obligation'}</p>
            <button type="button" className="lp-skiplink" onClick={() => go(1)}>{es ? 'Primero quiero ver cómo funciona →' : 'Or see how it works first →'}</button>
          </div>
        </Card>
      );
    } else if (id === 'problem') {
      body = (
        <Card wide tone="forest">
          <Eyebrow>{f.problem.eyebrow}</Eyebrow>
          <StepHeading>{f.problem.title}</StepHeading>
          <div className="lp-problems">
            {f.problem.items.map(([title, desc]) => (
              <div key={title} className="lp-problem">
                <div className="lp-problem__x" aria-hidden="true"><X size={14} weight="bold" /></div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
          <ContinueRow onNext={() => go(2)} label={es ? 'Ver cómo funciona' : 'See How It Works'} variant="primary" />
        </Card>
      );
    } else if (id === 'capabilities') {
      body = (
        <Card wide>
          <Eyebrow>{es ? 'Lo que realmente hace' : 'What it actually does'}</Eyebrow>
          <StepHeading>{f.caps.title}</StepHeading>
          <div className="lp-caps">
            {f.caps.items.map(([title, desc, icon], i) => {
              const Icon = ICONS[icon] || Check;
              return (
                <div key={title} className={`lp-cap${i === 0 ? ' lp-cap--lead' : ''}`}>
                  <span className="lp-cap__icon" aria-hidden="true"><Icon size={22} weight="duotone" /></span>
                  <div><h3>{title}</h3><p>{desc}</p></div>
                </div>
              );
            })}
          </div>
          <ContinueRow onNext={() => go(3)} label={es ? 'Ver la comparación' : 'See The Comparison'} />
        </Card>
      );
    } else if (id === 'compare') {
      const c = f.compare;
      body = (
        <Card wide>
          <Eyebrow>{c.eyebrow}</Eyebrow>
          <StepHeading>{es ? 'Lado a lado, no hay comparación.' : "Side by side, it's not close."}</StepHeading>
          <div className="lp-compare" role="table">
            <div className="lp-compare__head" role="row">
              <span role="columnheader"><span className="ll-sr-only">{es ? 'Comparación' : 'Comparison'}</span></span>
              <span role="columnheader" className="lp-compare__us">{c.us}</span>
              <span role="columnheader">{c.them}</span>
            </div>
            {c.rows.map(([feat, a, b]) => (
              <div key={feat} className="lp-compare__row" role="row">
                <span role="rowheader" className="lp-compare__feat">{feat}</span>
                <span role="cell" className="lp-compare__us"><em className="lp-compare__tag">{c.us}</em><Check size={14} weight="bold" aria-hidden="true" /> {a}</span>
                <span role="cell" className="lp-compare__them"><em className="lp-compare__tag">{c.them}</em>{b}</span>
              </div>
            ))}
          </div>
          <ContinueRow onNext={() => go(4)} label={es ? 'Ver lo que dicen los clientes' : 'See What Clients Say'} />
        </Card>
      );
    } else {
      body = (
        <Card wide tone="sage">
          <Eyebrow>{es ? 'Lo que dicen los clientes' : 'What clients say'}</Eyebrow>
          <StepHeading>{es ? 'Reseñas reales de clientes reales de Loogo Labs.' : 'Real reviews from real Loogo Labs clients.'}</StepHeading>
          <div className="lp-proof">
            {TESTIMONIALS.map((r) => <TestimonialImage key={r.src} src={r.src} alt={es ? r.es : r.en} />)}
          </div>
          <ContinueRow onNext={() => go(QUIZ_START)} label={startLabel} />
        </Card>
      );
    }
  }

  return (
    <main className="ll-shell lp">
      <div className="ll-nav lp-nav">
        <div className="ll-nav__bar lp-nav__bar">
          <div className="lp-nav__side">
            {step > 0 && !isResult && (
              <button className="lp-back" aria-label={es ? 'Atrás' : 'Back'} onClick={() => go(step === QUIZ_START ? 0 : step - 1)}>
                <ArrowLeft size={16} weight="bold" aria-hidden="true" /> <span className="lp-back__label">{es ? 'Atrás' : 'Back'}</span>
              </button>
            )}
          </div>
          <a href={toHref('/quizzes')} className="ll-nav__logo lp-nav__logo" aria-label={es ? 'Todos los quizzes' : 'All quizzes'}><img src="/monogram.png" alt="" /></a>
          <div className="lp-nav__side lp-nav__side--end">
            <LangToggle />
            {!isResult && !isIntroStep && <span className="lp-count">{step - QUIZ_START + 1}/{quizTotal}</span>}
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
          <a href={toHref('/privacy')}>{es ? 'Privacidad' : 'Privacy'}</a>
          <a href={toHref('/terms')}>{es ? 'Términos' : 'Terms'}</a>
          <a href={toHref('/accessibility')}>{es ? 'Accesibilidad' : 'Accessibility'}</a>
        </div>
      </footer>
    </main>
  );
}
