import React from 'react';
import { ArrowRight } from '@phosphor-icons/react';
import { pathForPage } from '../../lib/seo';
import { useHref, useLang } from '../../lib/i18n';
import { TOOLS, toolPath } from '../../lib/tools';
import { ServiceBand } from './shared';
import '../../styles/pages/tools.css';

// /tools: lists every entry in lib/tools.js, so a new tool shows up here as
// soon as it is added there.
function ToolsHub() {
  const es = useLang() === 'es';
  const toHref = useHref();
  return (
    <main className="tl-page">
      <div className="tl-wrap">
        <header className="tl-hero">
          <h1 className="tl-title">{es ? <>Herramientas de marketing <em>gratis para tu negocio.</em></> : <>Free marketing tools <em>for local businesses.</em></>}</h1>
          <p className="tl-lede">{es
            ? 'Herramientas sencillas que resuelven un problema concreto en minutos: más reseñas, menos llamadas perdidas y saber qué marketing funciona. Todo corre en tu navegador; no guardamos lo que escribes.'
            : 'Simple tools that solve one real problem in minutes: more reviews, fewer missed calls, and knowing which marketing works. Everything runs in your browser; we don’t store what you type.'}</p>
        </header>
        <div className="tl-cards">
          {TOOLS.map((t, i) => (
            <a key={t.page} className={`tl-card${i === 0 ? ' tl-card--forest' : ''}`} href={toHref(toolPath(t))}>
              <div>
                <h2 className="tl-card__title">{es ? t.es.title : t.title}</h2>
                <p className="tl-card__desc">{es ? t.es.blurb : t.blurb}</p>
              </div>
              <span className="tl-card__go">{es ? 'Abrir herramienta' : 'Open tool'} <ArrowRight size={14} weight="bold" aria-hidden="true" /></span>
            </a>
          ))}
        </div>
        <section className="tl-section tl-prose">
          <h2 className="tl-h2">{es ? '¿Buscas una evaluación rápida?' : 'Looking for a quick fit check?'}</h2>
          <p>{es ? 'Nuestros ' : 'Our '}<a href={toHref(pathForPage('Quizzes'))}>{es ? 'cuestionarios de 60 segundos' : '60-second fit checks'}</a>{es
            ? ' te dicen si una recepcionista con IA o las reseñas automáticas le convienen a tu negocio, sin necesidad de una llamada.'
            : ' tell you whether an AI receptionist or automated reviews would pay off in your business, no call required.'}</p>
        </section>
        <ServiceBand
          title={es ? '¿Prefieres que lo hagamos por ti?' : 'Rather have it done for you?'}
          text={es
            ? 'Loogo Labs LLC construye y administra los sistemas detrás de estas herramientas: reseñas automáticas, agentes de voz con IA y seguimiento de marketing, en inglés y español.'
            : 'Loogo Labs LLC builds and runs the systems behind these tools: automated reviews, AI voice agents and marketing tracking, in English and Spanish.'}
          servicePage="GrowCFL"
          serviceLabel={es ? 'Ver servicios locales' : 'See local services'}
        />
      </div>
    </main>
  );
}

export default ToolsHub;
