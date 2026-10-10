import React from 'react';
import { VOICE_BASE, VOICE_CITY_BY_SLUG, voiceCityPath } from '../lib/voiceCities';
import { VOICE_CITIES_ES } from '../lib/voiceCities.es';
import { useLang } from '../lib/i18n';
import { ArrowRight, Check, PhoneX, Moon, CalendarX } from '@phosphor-icons/react';
import { Eyebrow, H2, BookBtn, Shell, Faq, Steps, CtaPanel, tidy } from './cfl/shared';
import '../styles/pages/cfl.css';

const TONES = ['cfl-tile ll-sage', 'cfl-tile', 'cfl-tile cfl-tile--glass'];
const ICONS = [PhoneX, Moon, CalendarX];

// What the agent does is the same in every city; the city-specific copy lives in
// lib/voiceCities.js. Kept short here so the local copy carries each page.
const CAPABILITIES = [
  ['Answers in under a second', 'Day, night, weekends, and holidays. No hold music, no voicemail.'],
  ['Books into your calendar', 'Callers pick a time during the call, and the booking lands in your CRM pipeline.'],
  ['Qualifies every caller', 'Location, timeline, and urgency, asked in the right order before your team gets involved.'],
  ['Hands off when it should', 'Anything outside its training goes to a person with the details already captured.'],
];

const CAPABILITIES_ES = [
  ['Contesta en menos de un segundo', 'De día, de noche, fines de semana y feriados. Sin música de espera ni buzón de voz.'],
  ['Agenda en tu calendario', 'Quien llama escoge una hora durante la llamada y la cita entra directo a tu CRM.'],
  ['Califica a cada persona que llama', 'Ubicación, plazo y urgencia, preguntados en el orden correcto antes de que tu equipo intervenga.'],
  ['Transfiere cuando debe', 'Todo lo que esté fuera de su entrenamiento pasa a una persona con los detalles ya tomados.'],
];

const STEPS_ES = [
  ['Levantamiento y guion', 'Documentamos tu mejor flujo de llamada, las preguntas comunes y tu área de servicio.', '1-2 días'],
  ['Construcción y llamadas de prueba', 'Construimos el agente y hacemos llamadas de prueba hasta que cumpla nuestro estándar.', '2-3 días'],
  ['Conectamos tu línea', 'Tu mismo número, calendario y CRM. Tus clientes marcan el mismo número.', '1 día'],
  ['Lanzamiento y ajustes', 'Revisamos llamadas reales durante los primeros 30 días y ajustamos lo que escuchamos.', 'Continuo'],
];

const STEPS = [
  ['Intake & scripting', 'We capture your best call flow, common questions, and service area.', '1-2 days'],
  ['Build & test calls', 'We build the agent and run test calls until it meets our standard.', '2-3 days'],
  ['Connect your line', 'Your existing number, calendar, and CRM. Callers dial the same number.', '1 day'],
  ['Go live & tune', 'We review real calls for the first 30 days and adjust what we hear.', 'Ongoing'],
];

const voiceFaq = (c) => [
  [`Do you set up AI voice agents for businesses in ${c.name}?`, `Yes. ${c.name} is part of our ${c.county} service area. We build, train, and manage the agent for you, including the questions ${c.name} callers ask most and the neighborhoods you serve.`],
  ['Can the agent speak Spanish?', 'Yes. The agent can answer and book in English or Spanish. We test both languages with real call scenarios before it goes live.'],
  ['Will callers know they are talking to AI?', 'We recommend the agent identifies itself as a virtual assistant at the start of the call. It still sounds natural, and callers appreciate the honesty.'],
  ['Do I keep my phone number?', 'Yes. Calls route through your existing number, so your signage, ads, and Google Business Profile do not change.'],
  ['What happens with emergencies or complex calls?', 'The agent is trained to recognize urgent situations and hand them to your team right away, with the caller\'s details captured.'],
];

const voiceFaqEs = (c) => [
  [`¿Configuran agentes de voz con IA para negocios en ${c.name}?`, `Sí. ${c.name} es parte de nuestra área de servicio en el condado de ${c.county.replace(' County', '')}. Construimos, entrenamos y administramos el agente por ti, incluyendo las preguntas que más hacen quienes llaman en ${c.name} y los vecindarios que atiendes.`],
  ['¿El agente puede hablar español?', 'Sí. El agente puede contestar y agendar en inglés o español. Probamos ambos idiomas con escenarios de llamadas reales antes de lanzarlo.'],
  ['¿Sabrán quienes llaman que hablan con una IA?', 'Recomendamos que el agente se identifique como asistente virtual al inicio de la llamada. Igual suena natural, y la gente agradece la honestidad.'],
  ['¿Me quedo con mi número de teléfono?', 'Sí. Las llamadas pasan por tu número actual, así que tus letreros, anuncios y Perfil de Empresa en Google no cambian.'],
  ['¿Qué pasa con emergencias o llamadas complicadas?', 'El agente está entrenado para reconocer situaciones urgentes y pasarlas a tu equipo de inmediato, con los datos de quien llama ya tomados.'],
];

function TranscriptCard({ c, es }) {
  return (
    <div className="cfl-transcript" lang={es ? 'es' : c.sampleLang || undefined}>
      <div className="cfl-transcript__head">
        <span className="ll-live-dot" aria-hidden="true" />
        {es ? `Llamada de ejemplo · ${c.name}` : <>Sample call · {c.name}{c.sampleLang === 'es' ? ' · Español' : ''}</>}
      </div>
      <div className="cfl-transcript__list">
        {c.sample.map(([role, text], i) => (
          <div key={i} className={`cfl-bubble cfl-bubble--${role === 'agent' ? 'agent' : 'caller'}`}>
            <small>{role === 'agent' ? (es ? 'Agente de IA' : 'AI agent') : (es ? 'Cliente' : 'Caller')}</small>
            {text}
          </div>
        ))}
      </div>
    </div>
  );
}

function AIVoiceCity({ slug }) {
  const es = useLang() === 'es';
  const base = VOICE_CITY_BY_SLUG.get(slug);
  if (!base) return null;
  const c = es ? { ...base, ...VOICE_CITIES_ES[base.slug] } : base;
  const crumbLabel = es ? 'Agentes de voz con IA' : 'AI Voice Agents';
  const nearby = c.nearby.map((s) => VOICE_CITY_BY_SLUG.get(s)).filter(Boolean);

  return (
    <Shell crumb={{ href: VOICE_BASE, label: crumbLabel }}>

      {/* ── HERO ── */}
      <section className="cfl-wrap">
        <div className="cfl-panel ll-forest cfl-hero">
          <nav aria-label={es ? 'Ruta de navegación' : 'Breadcrumb'} className="cfl-crumb">
            <a href={VOICE_BASE}>{crumbLabel}</a>
            <span aria-hidden="true">/</span>
            <span>{c.name}, FL</span>
          </nav>
          <div className="cfl-hero-grid">
            <div>
              <Eyebrow>{es ? `Agente de voz con IA · ${c.name}, FL` : <>AI voice agent · {c.name}, FL</>}</Eyebrow>
              <h1 className="cfl-h1" style={{ fontSize: 'clamp(34px, 4.6vw, 56px)' }}>{c.headline}</h1>
              <p className="cfl-lede">{tidy(c.intro)}</p>
              <div className="cfl-actions"><BookBtn label={es ? `Escucha una llamada demo de ${c.name}` : `Hear a ${c.name} demo call`} /></div>
            </div>
            <TranscriptCard c={c} es={es} />
          </div>
        </div>
      </section>

      {/* ── CITY CALL MOMENTS ── */}
      <section className="cfl-wrap">
        <div className="cfl-panel cfl-panel--bare">
          <Eyebrow>{es ? `Llamadas que pierden los negocios de ${c.name}` : <>Calls {c.name} businesses miss</>}</Eyebrow>
          <H2>{es ? `Dónde se escapan hoy las llamadas en ${c.name}.` : <>Where {c.name} calls slip through today.</>}</H2>
          <div className="cfl-bento3">
            {c.moments.map(([t, d], i) => {
              const Icon = ICONS[i % 3];
              return (
                <div key={t} className={TONES[i % 3]}>
                  <span className="cfl-tile__icon" aria-hidden="true"><Icon size={22} /></span>
                  <div>
                    <h3 className="cfl-tile__title">{t}</h3>
                    <p className="cfl-tile__text">{tidy(d)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── WHAT IT HANDLES ── */}
      <section className="cfl-wrap">
        <div className="cfl-panel ll-glass">
          <div className="cfl-2col cfl-2col--start">
            <div>
              <Eyebrow>{es ? 'Lo que maneja el agente' : 'What the agent handles'}</Eyebrow>
              <H2 small>{es ? 'Cada llamada contestada, calificada y agendada.' : 'Every call answered, qualified, and booked.'}</H2>
              <div className="cfl-checks">
                {(es ? CAPABILITIES_ES : CAPABILITIES).map(([t, d]) => (
                  <div key={t}>
                    <span className="cfl-checks__icon" aria-hidden="true"><Check size={16} weight="bold" /></span>
                    <div>
                      <strong>{t}</strong>
                      <p>{d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="cfl-stack">
              <div className="cfl-card">
                <div className="cfl-card__title">{es ? `Llamadas para las que lo entrenamos en ${c.name}` : <>Calls we train it for in {c.name}</>}</div>
                <div className="cfl-chips">
                  {c.calls.map((it) => <span key={it} className="cfl-chip">{it}</span>)}
                </div>
              </div>
              <div className="cfl-card ll-forest">
                <div className="cfl-card__title">{es ? 'Zonas en las que confirma cobertura' : 'Areas it confirms coverage for'}</div>
                <ul className="cfl-list">
                  {c.areas.map((a) => (
                    <li key={a}><ArrowRight size={14} weight="bold" aria-hidden="true" />{a}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section className="cfl-wrap">
        <div className="cfl-panel cfl-panel--paper">
          <Eyebrow>{es ? 'Cómo funciona' : 'How it works'}</Eyebrow>
          <H2 small>{es ? 'En vivo en una semana, más o menos. Administrado desde ahí.' : 'Live in about a week. Managed after that.'}</H2>
          <Steps steps={es ? STEPS_ES : STEPS} />
          <div className="cfl-nearby">
            <span className="cfl-nearby__label">{es ? `Agentes de voz con IA cerca de ${c.name}` : <>AI voice agents near {c.name}</>}</span>
            {nearby.map((n) => (
              <a key={n.slug} href={voiceCityPath(n.slug)} className="cfl-nearby__link">{n.name} <ArrowRight size={14} weight="bold" aria-hidden="true" /></a>
            ))}
          </div>
        </div>
      </section>

      <Faq items={es ? voiceFaqEs(c) : voiceFaq(c)} />

      {/* ── FINAL CTA ── */}
      <CtaPanel
        title={es ? <>Deja de mandar a quienes llaman en {c.name} al buzón de voz.</> : <>Stop sending {c.name} callers to voicemail.</>}
        body={es ? <>En la llamada revisamos cómo se contesta tu teléfono hoy, te ponemos una llamada de ejemplo hecha para un negocio de {c.name} como el tuyo y te mostramos exactamente lo que configuraríamos.</> : <>On the call we review how your phone is answered today, play a sample call built for a {c.name} business like yours, and map out exactly what we would set up.</>}
      />
    </Shell>
  );
}

export default AIVoiceCity;
