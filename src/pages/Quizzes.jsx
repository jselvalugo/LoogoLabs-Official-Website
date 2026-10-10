import React from 'react';
import Badge from '../components/feedback/Badge';
import Button from '../components/core/Button';
import { pathForPage } from '../lib/seo';
import { NICHE_QUIZZES } from '../lib/nicheQuizzes';
import { NICHE_QUIZZES_ES } from '../lib/nicheQuizzes.es';
import { useLang } from '../lib/i18n';

import { ArrowRight, Timer } from '@phosphor-icons/react';
import '../styles/pages/quiz.css';

// Add a new entry here whenever another quiz/funnel goes live — this page
// automatically lists whatever is in this array.
const QUIZZES = [
  {
    page: 'AIReceptionist',
    title: 'AI Receptionist Fit Check',
    time: '60 seconds',
    description: 'Answer a few questions about your call volume and find out whether an AI receptionist would pay for itself in your business, no call required to find out.',
  },
  {
    page: 'ReputationAutopilot',
    title: 'Reputation Autopilot Fit Check',
    time: '60 seconds',
    description: 'Answer a few questions about your review process and find out how many 5-star reviews you\'re likely missing every month, no call required to find out.',
  },
  ...NICHE_QUIZZES.map((q) => ({ page: q.page, title: q.label, time: '60 seconds', description: q.description })),
];

const QUIZZES_ES = {
  AIReceptionist: {
    title: 'Evaluación de recepcionista con IA',
    description: 'Responde unas preguntas sobre tu volumen de llamadas y descubre si una recepcionista con IA se pagaría sola en tu negocio, sin necesidad de una llamada.',
  },
  ReputationAutopilot: {
    title: 'Evaluación de Reputation Autopilot',
    description: 'Responde unas preguntas sobre cómo pides reseñas y descubre cuántas reseñas de 5 estrellas probablemente estás dejando de recibir cada mes, sin necesidad de una llamada.',
  },
  ...Object.fromEntries(Object.entries(NICHE_QUIZZES_ES).map(([page, q]) => [page, { title: q.label, description: q.description }])),
};

function Quizzes({ onNavigate }) {
  const es = useLang() === 'es';
  return (
    <main className="qz-hub">
      <div className="qz-wrap qz-hero">
        <Badge tone="accent">{es ? 'Herramientas gratis' : 'Free tools'}</Badge>
        {es ? (
          <>
            <h1 className="qz-hero__title">Evaluaciones rápidas. <em>Sin necesidad de llamar.</em></h1>
            <p className="qz-hero__lede">
              Unas cuantas preguntas, respuestas claras. Toma cualquiera de estas evaluaciones para ver si
              alguno de nuestros sistemas le conviene a tu negocio. Recibes tu resultado al instante.
            </p>
          </>
        ) : (
          <>
            <h1 className="qz-hero__title">Quick fit checks. <em>No call required.</em></h1>
            <p className="qz-hero__lede">
              A handful of questions, straight answers. Take any quiz below to see whether one of our
              systems fits your business. You'll get your result on the spot.
            </p>
          </>
        )}
      </div>

      <div className="qz-wrap">
        <div className="qz-grid">
          {QUIZZES.map((q, i) => (
            <a key={q.page} href={pathForPage(q.page)}
              onClick={(e) => { e.preventDefault(); onNavigate(q.page); }}
              className={`qz-card ${i === 0 ? 'qz-card--forest ll-forest ll-bezel--dark' : i === 1 ? 'qz-card--sage ll-sage ll-bezel' : 'll-glass'}`}>
              <div className="qz-card__body">
                <span className="qz-card__meta"><Timer size={14} weight="bold" aria-hidden="true" />{es ? '60 segundos · Gratis' : <>{q.time} · Free</>}</span>
                <h2 className="qz-card__title">{es ? QUIZZES_ES[q.page].title : q.title}</h2>
                <p className="qz-card__desc">{es ? QUIZZES_ES[q.page].description : q.description}</p>
              </div>
              <Button variant={i === 0 ? 'primary' : 'inverse'} size="sm" style={{ alignSelf: 'flex-start' }}
                iconRight={<ArrowRight size={14} weight="bold" />}>{es ? 'Tomar la evaluación' : 'Take the quiz'}</Button>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}

export default Quizzes;
