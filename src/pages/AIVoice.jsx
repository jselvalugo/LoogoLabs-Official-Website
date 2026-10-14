import React from 'react';
import Button from '../components/core/Button';
import { openBooking } from '../lib/booking';
import { VOICE_CITIES, voiceCityPath } from '../lib/voiceCities';
import {
  Phone, CalendarCheck, Check, X, Minus, Plus, ArrowRight, ArrowDown,
  Moon, Funnel, ChatsCircle, ShieldCheck, Microphone,
} from '@phosphor-icons/react';
import { useLang } from '../lib/i18n';
import '../styles/pages/aivoice.css';

const trackBook = () => { if (window.fbq) window.fbq('track', 'Schedule'); openBooking(); };

/* ─────────────────────── primitives ─────────────────────── */
const Wrap = ({ children, className, style }) => (
  <div className={['av-wrap', className].filter(Boolean).join(' ')} style={style}>{children}</div>
);

/* ─────────────────────── waveform bars ─────────────────────── */
const WAVE_BARS = [0.3, 0.7, 0.5, 1, 0.6, 0.85, 0.4, 0.9, 0.55, 0.75, 0.35, 0.95, 0.5, 0.8, 0.45, 1, 0.6, 0.7, 0.4, 0.9, 0.55, 0.65, 0.35, 0.85, 0.5, 0.75, 0.3, 0.95, 0.6, 0.8, 0.4, 0.7];

const Waveform = ({ height = 56, barCount = WAVE_BARS.length }) => (
  <div className="av-wave" style={{ height }} aria-hidden="true">
    {WAVE_BARS.slice(0, barCount).map((h, i) => (
      <i key={i} style={{ height: `${h * 100}%`, animationDelay: `${(i * 0.04).toFixed(2)}s` }} />
    ))}
  </div>
);

/* ─────────────────────── call transcript ─────────────────────── */
const transcript = [
  { role: 'caller', text: 'Hi, I need someone to look at my AC. It stopped working last night.' },
  { role: 'agent', text: "I'm so sorry to hear that, especially in this heat. We can absolutely help. Are you in the Orlando area?" },
  { role: 'caller', text: 'Yes, Winter Park.' },
  { role: 'agent', text: "Perfect, we service Winter Park. Are you available tomorrow between 8 and 11 A.M., or does the afternoon work better?" },
  { role: 'caller', text: 'Morning works.' },
  { role: 'agent', text: "Great, I've got you down for tomorrow, 8 to 11 A.M. You'll get a confirmation text shortly. Is there anything else I can help with?" },
];

/* ─────────────────────── data ─────────────────────── */
const heroStats = [
  ['100%', 'Answer rate'],
  ['< 1 s', 'Time to pick up'],
  ['24 / 7', 'Always on'],
  ['~1 week', 'To launch'],
];

const proofPoints = [
  'Picks up in under 1 second',
  'Never calls in sick',
  'Zero hold time',
  'Books directly into your calendar',
  'Works in English and Spanish',
  'Native CRM integration',
];

const problems = [
  ['62% of calls go unanswered', 'More than half the calls your business receives happen outside business hours. Every unanswered ring is a lead that just called your competitor.'],
  ['Voicemail gets deleted, not played', "The average person waits less than eight seconds before hanging up. They're not leaving a voicemail. They're googling someone else."],
  ['Speed to lead is everything', "Research shows the odds of contacting a lead drop by 80% after five minutes. If you're answering tomorrow, someone else answered today."],
];

const capabilities = [
  ['24/7 Live Call Answering', 'Never miss another call. Your AI agent picks up in under a second, day or night, weekends and holidays included.', Moon],
  ['Natural Lead Qualification', 'Asks the right questions in the right order (location, timeline, budget, urgency) and scores the lead before your team ever gets involved.', Funnel],
  ['Appointment Booking', 'Syncs directly with your calendar and CRM pipeline. Prospects book a time slot during the call, and every lead is tagged automatically, with no manual entry.', CalendarCheck],
  ['Objection Handling', 'Trained on your most common objections. Price shopping? Competition? Not ready? The agent has a scripted, on-brand response for each.', ChatsCircle],
];

const steps = [
  ['01', 'Intake & scripting', 'We interview you (or your top salesperson) to capture your best call flow, objections, and closing language.', '1-2 days'],
  ['02', 'Build & training', 'We build the voice agent, train it on your business, and run test calls until it meets our standard.', '2-3 days'],
  ['03', 'Integration', 'We connect your phone system, CRM pipeline, and calendar. Zero downtime: runs alongside your existing setup.', '1 day'],
  ['04', 'Go live & tune', 'The agent goes live. We monitor real calls for the first 30 days and tune based on what we hear.', 'Ongoing'],
];

const industries = [
  'HVAC & Mechanical', 'Roofing & Exteriors', 'Dental & Med Spa', 'Real Estate & Mortgage',
  'Pest Control', 'Plumbing & Electric', 'Personal Injury Law', 'Auto Services',
];

// Each cell: [kind, text]. kind = yes | no | meh (drives icon + color).
const comparison = [
  ['Available after hours', ['yes', 'Always'], ['no', 'Voicemail or missed']],
  ['Answers in under 1 second', ['yes', 'Every call'], ['meh', 'Depends on hold queue']],
  ['Books directly into calendar', ['yes', 'Real time'], ['meh', 'Manual follow-up']],
  ['Handles 10 calls simultaneously', ['yes', 'No limit'], ['no', 'One call per person']],
  ['Cost per call', ['yes', 'Near zero'], ['no', '$15-$40 per handled call']],
];

const differentiators = [
  ['Built and run by us, not configured by you', "Most AI voice tools hand you a dashboard and wish you luck. We interview your team, write the script, train the agent, and monitor real calls for the first 30 days."],
  ['Every call feeds the CRM you already run on', 'No separate app, no manual export. Bookings, tags, and call outcomes land directly in your existing pipeline, next to your follow-up, reviews, and reporting.'],
  ["A person still has the leash", "When a call goes outside its training, the agent hands off to your team instead of guessing. You're never one strange call away from a bad review."],
];

const faqs = [
  ['Does it sound like a robot?', 'No. Modern voice AI is indistinguishable from human agents in most calls. We train it on your specific vocabulary, cadence, and tone so it sounds like someone who works for you, not a generic IVR system.'],
  ['What happens when a call gets too complex?', 'The agent knows its limits. If a caller asks something outside its training, it warmly offers to have a team member call them back, captures their info, and logs the ticket in your CRM.'],
  ['Will it work with our existing phone number?', 'Yes. We route calls through your existing number. No need to change your marketing, your signage, or your contacts. Callers dial the same number they always have.'],
  ['How long does setup take?', "Most clients go live within a week of our first call. We handle the entire build. You show up for a 90-minute intake session and an approval call before launch."],
];

/* ─────────────────────── Spanish data ─────────────────────── */
const transcript_ES = [
  { role: 'caller', text: 'Hola, necesito que alguien revise mi aire acondicionado. Dejó de funcionar anoche.' },
  { role: 'agent', text: 'Lamento mucho escuchar eso, sobre todo con este calor. Claro que te podemos ayudar. ¿Estás en el área de Orlando?' },
  { role: 'caller', text: 'Sí, en Winter Park.' },
  { role: 'agent', text: 'Perfecto, damos servicio en Winter Park. ¿Estás disponible mañana entre 8 y 11 a. m., o te funciona mejor en la tarde?' },
  { role: 'caller', text: 'En la mañana está bien.' },
  { role: 'agent', text: 'Excelente, te agendé para mañana de 8 a 11 a. m. En un momento te llega un texto de confirmación. ¿Hay algo más en lo que te pueda ayudar?' },
];

const heroStats_ES = [
  ['100%', 'Tasa de respuesta'],
  ['< 1 s', 'Para contestar'],
  ['24 / 7', 'Siempre activo'],
  ['~1 semana', 'Para lanzar'],
];

const proofPoints_ES = [
  'Contesta en menos de 1 segundo',
  'Nunca se reporta enfermo',
  'Cero tiempo de espera',
  'Agenda directo en tu calendario',
  'Funciona en inglés y español',
  'Integración nativa con tu CRM',
];

const problems_ES = [
  ['El 62% de las llamadas no se contestan', 'Más de la mitad de las llamadas que recibe tu negocio llegan fuera del horario de oficina. Cada timbre sin contestar es un cliente que acaba de llamar a tu competencia.'],
  ['Los mensajes de voz se borran, no se escuchan', 'La persona promedio espera menos de ocho segundos antes de colgar. No va a dejar un mensaje. Va a buscar a otro en Google.'],
  ['La rapidez lo es todo', 'Los estudios muestran que la probabilidad de contactar a un cliente potencial cae un 80% después de cinco minutos. Si contestas mañana, alguien más contestó hoy.'],
];

const capabilities_ES = [
  ['Contestación de llamadas en vivo 24/7', 'No vuelvas a perder una llamada. Tu agente de IA contesta en menos de un segundo, de día o de noche, fines de semana y feriados incluidos.', Moon],
  ['Calificación natural de clientes', 'Hace las preguntas correctas en el orden correcto (ubicación, plazo, presupuesto, urgencia) y califica al cliente antes de que tu equipo intervenga.', Funnel],
  ['Agenda de citas', 'Se sincroniza directo con tu calendario y tu CRM. Los clientes escogen una hora durante la llamada y cada cliente se etiqueta automáticamente, sin entrada manual.', CalendarCheck],
  ['Manejo de objeciones', 'Entrenado con tus objeciones más comunes. ¿Comparan precios? ¿La competencia? ¿Todavía no están listos? El agente tiene una respuesta preparada y fiel a tu marca para cada una.', ChatsCircle],
];

const steps_ES = [
  ['01', 'Levantamiento y guion', 'Te entrevistamos a ti (o a tu mejor vendedor) para documentar tu mejor flujo de llamada, objeciones y lenguaje de cierre.', '1-2 días'],
  ['02', 'Construcción y entrenamiento', 'Construimos el agente de voz, lo entrenamos con tu negocio y hacemos llamadas de prueba hasta que cumpla nuestro estándar.', '2-3 días'],
  ['03', 'Integración', 'Conectamos tu sistema telefónico, tu CRM y tu calendario. Cero tiempo fuera de servicio: funciona junto a lo que ya tienes.', '1 día'],
  ['04', 'Lanzamiento y ajustes', 'El agente sale en vivo. Monitoreamos llamadas reales durante los primeros 30 días y lo ajustamos según lo que escuchamos.', 'Continuo'],
];

const industries_ES = [
  'Aire acondicionado y mecánica', 'Techos y exteriores', 'Dental y med spa', 'Bienes raíces e hipotecas',
  'Control de plagas', 'Plomería y electricidad', 'Abogados de lesiones personales', 'Servicios automotrices',
];

const comparison_ES = [
  ['Disponible fuera de horario', ['yes', 'Siempre'], ['no', 'Buzón de voz o llamada perdida']],
  ['Contesta en menos de 1 segundo', ['yes', 'Cada llamada'], ['meh', 'Depende de la fila de espera']],
  ['Agenda directo en el calendario', ['yes', 'En tiempo real'], ['meh', 'Seguimiento manual']],
  ['Atiende 10 llamadas a la vez', ['yes', 'Sin límite'], ['no', 'Una llamada por persona']],
  ['Costo por llamada', ['yes', 'Casi cero'], ['no', '$15-$40 por llamada atendida']],
];

const differentiators_ES = [
  ['Lo construimos y operamos nosotros, no lo configuras tú', 'La mayoría de las herramientas de voz con IA te dan un panel y te desean suerte. Nosotros entrevistamos a tu equipo, escribimos el guion, entrenamos al agente y monitoreamos llamadas reales durante los primeros 30 días.'],
  ['Cada llamada alimenta el CRM que ya usas', 'Sin otra app, sin exportar a mano. Las citas, etiquetas y resultados de cada llamada llegan directo a tu pipeline actual, junto a tu seguimiento, reseñas y reportes.'],
  ['Una persona sigue teniendo el control', 'Cuando una llamada se sale de su entrenamiento, el agente se la pasa a tu equipo en vez de adivinar. Nunca estás a una llamada rara de una mala reseña.'],
];

const faqs_ES = [
  ['¿Suena como un robot?', 'No. La IA de voz moderna es indistinguible de un agente humano en la mayoría de las llamadas. La entrenamos con tu vocabulario, ritmo y tono para que suene como alguien que trabaja para ti, no como un sistema genérico de menú telefónico.'],
  ['¿Qué pasa cuando una llamada se complica?', 'El agente conoce sus límites. Si alguien pregunta algo fuera de su entrenamiento, ofrece amablemente que alguien del equipo le devuelva la llamada, toma sus datos y registra el caso en tu CRM.'],
  ['¿Funciona con nuestro número de teléfono actual?', 'Sí. Dirigimos las llamadas a través de tu número actual. No tienes que cambiar tu publicidad, tus letreros ni tus contactos. La gente marca el mismo número de siempre.'],
  ['¿Cuánto tarda la configuración?', 'La mayoría de los clientes salen en vivo en una semana desde nuestra primera llamada. Nosotros hacemos toda la construcción. Tú solo participas en una sesión de levantamiento de 90 minutos y una llamada de aprobación antes del lanzamiento.'],
];

const demoPoints = [
  'Speaks naturally, with no robotic pauses or clipped sentences',
  'Handles interruptions and tangents gracefully',
  'Stays on-brand for every single call',
  'Confirms booking details before ending the call',
];
const demoPoints_ES = [
  'Habla con naturalidad, sin pausas robóticas ni frases cortadas',
  'Maneja interrupciones y desvíos con soltura',
  'Se mantiene fiel a tu marca en cada llamada',
  'Confirma los detalles de la cita antes de terminar la llamada',
];

const trustPoints = [
  'No setup fee for the first call',
  'Live within 1 week',
  'Dedicated 30-day tuning period',
  'Cancel anytime',
];
const trustPoints_ES = [
  'Sin costo de configuración por la primera llamada',
  'En vivo en 1 semana',
  'Periodo de ajuste dedicado de 30 días',
  'Cancela cuando quieras',
];

const CellIcon = ({ kind }) => {
  const Icon = kind === 'yes' ? Check : kind === 'no' ? X : Minus;
  return <span className={`av-mark av-mark--${kind}`} aria-hidden="true"><Icon size={12} weight="bold" /></span>;
};

/* ─────────────────────── main component ─────────────────────── */
export default function AIVoice() {
  const [openFaq, setOpenFaq] = React.useState(null);
  const es = useLang() === 'es';
  const T = es
    ? { transcript: transcript_ES, heroStats: heroStats_ES, proofPoints: proofPoints_ES, problems: problems_ES, capabilities: capabilities_ES, steps: steps_ES, industries: industries_ES, comparison: comparison_ES, differentiators: differentiators_ES, faqs: faqs_ES, demoPoints: demoPoints_ES, trustPoints: trustPoints_ES }
    : { transcript, heroStats, proofPoints, problems, capabilities, steps, industries, comparison, differentiators, faqs, demoPoints, trustPoints };
  const aiLabel = es ? 'Agente de IA' : 'AI Agent';
  const incoming = es ? 'Llamada entrante' : 'Incoming call';
  const live = es ? 'En vivo' : 'Live';
  const colAI = es ? 'Agente de voz con IA' : 'AI Voice Agent';
  const colTrad = es ? 'Método tradicional' : 'Traditional Setup';

  return (
    <main className="av">

      {/* ── HERO ── */}
      <section className="av-hero">
        <Wrap>
          <div className="av-hero__grid">
            <div>
              <span className="av-pill ll-glass"><span className="av-pill__tag">{es ? 'Voz con IA' : 'AI Voice'}</span>{es ? 'Funciona en inglés y español' : 'Works in English and Spanish'}</span>
              <h1 className="av-hero__title">
                {es ? <>Tu negocio contesta cada llamada. <em>Hasta las de las 2 a. m.</em></> : <>Your Business Answers Every Call. <em>Even the 2 A.M. Ones.</em></>}
              </h1>
              <p className="av-hero__lede">{es ? 'Un agente de voz con IA hecho a la medida que califica clientes, agenda citas y maneja objeciones con la voz de tu marca, a toda hora, sin perder ni una llamada.' : <>
                A custom AI voice agent that qualifies leads, books appointments, and handles objections
                in your brand's voice, around the clock, without a single missed call.
              </>}</p>
              <div className="av-hero__actions">
                <Button variant="inverse" size="lg" iconRight={<ArrowRight size={16} weight="bold" />} onClick={trackBook}>{es ? 'Agenda una llamada demo gratis' : 'Book a free demo call'}</Button>
                <Button variant="secondary" size="lg" iconRight={<ArrowDown size={16} weight="bold" />} onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>
                  {es ? 'Mira cómo funciona' : 'See how it works'}
                </Button>
              </div>
            </div>

            <div className="av-hero__art" aria-hidden="true">
              <div className="av-call ll-forest">
                <div className="av-call__top">
                  <span className="av-call__icon"><Phone size={20} weight="fill" /></span>
                  <div>
                    <small>{incoming}</small>
                    <strong>+1 (407) 555-0182</strong>
                  </div>
                  <span className="av-call__live"><span className="ll-live-dot" />{live}</span>
                </div>
                <div className="av-call__wave">
                  <Waveform height={44} />
                  <span>0:47</span>
                </div>
                <div className="av-call__lines">
                  <p className="av-bubble av-bubble--caller">{T.transcript[0].text}</p>
                  <p className="av-bubble av-bubble--agent">{T.transcript[1].text}</p>
                </div>
              </div>
              <div className="av-float av-float--a ll-glass">
                <span className="av-float__icon"><CalendarCheck size={20} weight="bold" /></span>
                <div><strong>{es ? 'Cita agendada' : 'Appointment booked'}</strong><span>{es ? 'Sincronizada con tu CRM' : 'Synced to your CRM'}</span></div>
              </div>
              <div className="av-float av-float--b ll-glass">
                <span className="av-float__icon"><Microphone size={20} weight="bold" /></span>
                <div><strong>{es ? 'Contesta en menos de 1 segundo' : 'Picks up in under 1 second'}</strong><span>{es ? 'Cero tiempo de espera' : 'Zero hold time'}</span></div>
              </div>
            </div>
          </div>

          <div className="av-stats ll-glass">
            {T.heroStats.map(([val, label]) => (
              <div key={label}>
                <span className="av-stats__v">{val}</span>
                <span className="av-stats__l">{label}</span>
              </div>
            ))}
          </div>

          <ul className="av-proof" aria-label={es ? 'Puntos destacados' : 'Highlights'}>
            {T.proofPoints.map((txt) => (
              <li key={txt}><Check size={14} weight="bold" aria-hidden="true" />{txt}</li>
            ))}
          </ul>
        </Wrap>
      </section>

      {/* ── PROBLEM ── */}
      <Wrap className="av-section ll-reveal">
        <span className="ll-eyebrow">{es ? 'El problema' : 'The problem'}</span>
        <h2 className="av-h2">{es ? <>Cada llamada sin contestar es un <em>cliente nuevo para tu competencia.</em></> : <>Every unanswered call is a competitor's <em>new customer.</em></>}</h2>
        <p className="av-lede">{es ? 'El negocio pequeño promedio pierde más del 60% de las llamadas entrantes. La mayoría de esas personas nunca vuelve a intentar. Encuentran a alguien que conteste y agendan con esa persona.' : <>
          The average small business misses over 60% of inbound calls. Most of those callers never try again.
          They find someone who answers, and they book with them instead.
        </>}</p>
        <div className="av-problems">
          {T.problems.map(([title, desc], i) => (
            <div key={title} className={`av-problem ${i === 0 ? 'll-forest' : i === 1 ? 'av-paper' : 'll-sage'}`}>
              <span className="av-problem__x" aria-hidden="true"><X size={16} weight="bold" /></span>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </Wrap>

      {/* ── LIVE DEMO ── */}
      <Wrap className="av-section ll-reveal">
        <div className="av-demo ll-forest">
          <div>
            <h2 className="av-h2 av-h2--light">{es ? <>Suena como tu mejor empleado <em>en su mejor día.</em></> : <>It sounds like your best employee <em>on their best day.</em></>}</h2>
            <p className="av-demo__p">{es ? 'La IA no lee un guion. Mantiene una conversación real, se adapta a lo que dice la persona y la guía hacia el resultado que tu negocio necesita: una cita agendada.' : <>
              The AI doesn't read from a script. It holds a real conversation, adapts to what the caller says,
              and guides them toward the outcome your business needs: a booked appointment.
            </>}</p>
            <ul className="av-demo__list">
              {T.demoPoints.map((pt) => (
                <li key={pt}><Check size={14} weight="bold" aria-hidden="true" />{pt}</li>
              ))}
            </ul>
            <Button variant="primary" size="lg" iconRight={<ArrowRight size={16} weight="bold" />} onClick={trackBook}>{es ? 'Escúchalo en una llamada en vivo' : 'Hear it on a live call'}</Button>
          </div>

          {/* phone transcript mockup */}
          <div className="av-phone ll-glass--dark">
            <div className="av-phone__top">
              <div>
                <small>{incoming}</small>
                <strong>+1 (407) 555-0182</strong>
              </div>
              <span className="av-call__live"><span className="ll-live-dot" aria-hidden="true" />{live}</span>
            </div>
            <div className="av-phone__wave">
              <small>{aiLabel}</small>
              <Waveform height={22} />
              <small>1:12</small>
            </div>
            <div className="av-phone__body">
              {T.transcript.map((line, i) => (
                <div key={i} className={`av-bubble av-bubble--${line.role}`}>
                  {line.role === 'agent' && <small>{aiLabel}</small>}
                  <p>{line.text}</p>
                </div>
              ))}
              <div className="av-phone__done">
                <span><Check size={12} weight="bold" aria-hidden="true" />{es ? 'Cita agendada. Sincronizada con tu CRM' : 'Appointment booked. Synced to your CRM'}</span>
              </div>
            </div>
          </div>
        </div>
      </Wrap>

      {/* ── CAPABILITIES ── */}
      <Wrap className="av-section ll-reveal">
        <h2 className="av-h2">{es ? <>Todo lo que hace tu recepción, <em>y todo lo que no puede hacer.</em></> : <>Everything your front desk does, <em>plus everything they can't.</em></>}</h2>
        <div className="av-bento">
          {T.capabilities.map(([title, desc, Icon], i) => (
            <div key={title} className={`av-tile ${['ll-forest av-tile--dark', 'll-glass', 'll-sage', 'av-paper'][i]}`}>
              <span className="av-tile__icon" aria-hidden="true"><Icon size={22} weight="bold" /></span>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </Wrap>

      {/* ── DIFFERENTIATOR ── */}
      <Wrap className="av-section ll-reveal">
        <div className="av-diff">
          <div className="av-diff__head">
            <span className="ll-eyebrow">{es ? 'Por qué Loogo Labs' : 'Why Loogo Labs'}</span>
            <h2 className="av-h2">{es ? <>No es un bot pegado a <em>tu línea telefónica.</em></> : <>Not a bot bolted onto <em>your phone line.</em></>}</h2>
            <p className="av-lede">{es ? 'Muchas herramientas te venden un bot de voz para que lo configures tú y te dejan el resto. Esto no es eso.' : <>
              Plenty of tools will sell you a self-serve voice bot and leave the rest to you. That's not what this is.
            </>}</p>
          </div>
          <div className="av-diff__list">
            {T.differentiators.map(([title, desc], i) => (
              <div key={title} className={`av-diff__item ${i === 0 ? 'll-sage' : 'av-paper'}`}>
                {i === 0 && <span className="av-tile__icon" aria-hidden="true"><ShieldCheck size={22} weight="bold" /></span>}
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Wrap>

      {/* ── HOW IT WORKS ── */}
      <Wrap className="av-section ll-reveal">
        <section id="how-it-works" className="av-steps ll-forest">
          <h2 className="av-h2 av-h2--light">{es ? <>De la primera llamada al agente en vivo <em>en una semana, más o menos.</em></> : <>From first call to live agent <em>in about a week.</em></>}</h2>
          <div className="av-steps__grid">
            {T.steps.map(([num, title, desc, time]) => (
              <div key={num} className="av-step">
                <span className="av-step__time">{time}</span>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </section>
      </Wrap>

      {/* ── INDUSTRIES ── */}
      <Wrap className="av-section ll-reveal">
        <div className="av-ind ll-glass">
          <div>
            <h2 className="av-h2">{es ? <>Cualquier negocio donde una llamada perdida es <em>una venta perdida.</em></> : <>Any business where a missed call means <em>a missed sale.</em></>}</h2>
            <p className="av-lede">{es ? 'Si tus ingresos dependen de llamadas entrantes (servicios de emergencia, citas de alto valor, cotizaciones complejas), un agente de voz con IA se paga solo en la primera semana.' : <>
              If your revenue is tied to inbound calls (emergency services, high-ticket appointments,
              complex quotes), an AI voice agent pays for itself in the first week.
            </>}</p>
            <div style={{ marginTop: 28 }}>
              <Button variant="inverse" iconRight={<ArrowRight size={16} weight="bold" />} onClick={trackBook}>{es ? 'Mira si encaja con tu negocio' : 'See if it fits your business'}</Button>
            </div>
          </div>
          <ul className="av-ind__chips">
            {T.industries.map((ind) => <li key={ind}>{ind}</li>)}
          </ul>
        </div>
      </Wrap>

      {/* ── COMPARISON TABLE ── */}
      <Wrap className="av-section ll-reveal">
        <span className="ll-eyebrow">{es ? 'IA vs. tradicional' : 'AI vs. traditional'}</span>
        <h2 className="av-h2">{es ? <>Cómo se compara con <em>lo que usas hoy.</em></> : <>How it stacks up against <em>your current setup.</em></>}</h2>

        {/* desktop/tablet: full table */}
        <div className="av-compare av-compare-table">
          <table>
            <thead>
              <tr>
                <th scope="col">{es ? 'Capacidad' : 'Capability'}</th>
                <th scope="col" className="av-compare__ai">{colAI}</th>
                <th scope="col">{colTrad}</th>
              </tr>
            </thead>
            <tbody>
              {T.comparison.map(([feat, ai, trad]) => (
                <tr key={feat}>
                  <td>{feat}</td>
                  <td className="av-compare__ai"><span className="av-cell"><CellIcon kind={ai[0]} />{ai[1]}</span></td>
                  <td><span className={`av-cell av-cell--${trad[0]}`}><CellIcon kind={trad[0]} />{trad[1]}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* mobile: stacked cards; a 3-column table can't fit a phone width without truncating */}
        <div className="av-compare-cards">
          {T.comparison.map(([feat, ai, trad]) => (
            <div key={feat} className="av-ccard">
              <strong>{feat}</strong>
              <div><small>{colAI}</small><span className="av-cell"><CellIcon kind={ai[0]} />{ai[1]}</span></div>
              <div><small>{colTrad}</small><span className={`av-cell av-cell--${trad[0]}`}><CellIcon kind={trad[0]} />{trad[1]}</span></div>
            </div>
          ))}
        </div>
      </Wrap>

      {/* ── FAQ ── */}
      <Wrap className="av-section ll-reveal">
        <div className="av-faq">
          <h2 className="av-h2">{es ? <>Todo lo que te has estado <em>preguntando.</em></> : <>Everything you've been <em>wondering.</em></>}</h2>
          <div className="av-faq__list">
            {T.faqs.map(([q, a], i) => {
              const open = openFaq === i;
              return (
                <div key={q} className={`av-faq__item${open ? ' is-open' : ''}`}>
                  <button onClick={() => setOpenFaq(open ? null : i)} aria-expanded={open}>
                    <span>{q}</span>
                    <span className="av-faq__plus" aria-hidden="true"><Plus size={16} weight="bold" /></span>
                  </button>
                  {open && <p>{a}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </Wrap>

      {/* ── CENTRAL FLORIDA CITIES ── */}
      <Wrap className="av-section ll-reveal">
        <div className="av-cities av-paper">
          <h2 className="av-h2">{es ? <>Agentes de voz con IA para negocios <em>en tu ciudad.</em></> : <>AI voice agents for businesses <em>in your city.</em></>}</h2>
          <div className="cfl-nearby av-cities__links">
            {VOICE_CITIES.map((c) => (
              <a key={c.slug} href={voiceCityPath(c.slug)} className="cfl-nearby__link">{c.name} <span aria-hidden="true">→</span></a>
            ))}
          </div>
        </div>
      </Wrap>

      {/* ── FINAL CTA ── */}
      <Wrap className="av-section av-section--last ll-reveal">
        <div className="av-cta ll-forest">
          <span className="av-cta__badge ll-glass--dark"><span className="ll-live-dot" aria-hidden="true" />{es ? 'Aceptando clientes nuevos' : 'Accepting new clients'}</span>
          <h2>{es ? <>Deja de perder llamadas <em>en el buzón de voz.</em></> : <>Stop losing calls <em>to voicemail.</em></>}</h2>
          <p>{es ? 'Agenda una llamada de estrategia gratis de 30 minutos. Auditamos tu flujo de llamadas actual, te mostramos cómo se vería un agente de voz para tu negocio y te damos una idea clara del retorno de inversión antes de que te comprometas a nada.' : <>
            Book a free 30-minute strategy call. We'll audit your current call flow, show you what a
            voice agent would look like for your specific business, and give you a clear picture of ROI
            before you commit to anything.
          </>}</p>
          <div style={{ marginTop: 28 }}>
            <Button variant="primary" size="lg" iconRight={<ArrowRight size={16} weight="bold" />} onClick={trackBook}>{es ? 'Agendar mi llamada de estrategia gratis' : 'Book my free strategy call'}</Button>
          </div>
          <ul className="av-cta__trust">
            {T.trustPoints.map((txt) => (
              <li key={txt}><Check size={14} weight="bold" aria-hidden="true" />{txt}</li>
            ))}
          </ul>
        </div>
      </Wrap>

    </main>
  );
}
