import React from 'react';
import Button from '../components/core/Button';
import SectionHeading from '../components/surfaces/SectionHeading';
import { openBooking } from '../lib/booking';
import { SITE, pathForPage } from '../lib/seo';
import { REFERENCES, CLIENT_LOGOS, CLIENT_WORDMARKS } from '../lib/references';
import { useHref, useLang } from '../lib/i18n';

const Wrap = ({ children, style, className, id }) => (
  <div id={id} className={['hm-wrap', className].filter(Boolean).join(' ')} style={style}>{children}</div>
);

// ── The story, in one place ────────────────────────────────────────────────
// Every service is a plan and a build. The explorer below shows both halves.
const SERVICES = [
  {
    title: 'Positioning & messaging',
    summary: 'Get clear on who you are for and why they should choose you, then put that everywhere a customer looks.',
    retires: ['Unclear offer', 'Guessing at messaging'],
    plan: ['Audience and segments worth winning', 'The offer, the promise and the proof', 'Messaging for site, ads and email'],
    build: ['Landing pages that say it in seconds', 'Email and SMS welcome sequences', 'Tracking so you see what the message does'],
  },
  {
    title: 'Go-to-market strategy',
    summary: 'A channel plan with budget and targets, and the funnel that turns attention into users and paying customers.',
    retires: ['Random posting', 'No clear funnel'],
    plan: ['Channel audit and the two or three that matter', 'Budget, targets and a 90-day calendar', 'Funnel stages and what moves each one'],
    build: ['The funnel itself: pages, forms, CRM pipeline', 'Automated follow-up for every lead', 'A dashboard with the numbers that count'],
  },
  {
    title: 'Ads strategy',
    summary: 'Meta, Google and YouTube campaigns built around targeting, creative and budgets that pay back.',
    retires: ['Wasted ad spend', 'No tracking'],
    plan: ['Targeting, offers and creative angles', 'Test plan and budget pacing', 'What a good CAC looks like for you'],
    build: ['Server-side tracking and Conversions API', 'Campaigns, audiences and creative in batches', 'Attribution tied to real revenue'],
  },
  {
    title: 'Growth plan',
    summary: 'A roadmap your team can run, reviewed against results so every month builds on the last.',
    retires: ['No roadmap', 'Guesswork'],
    plan: ['Quarterly targets and the bets behind them', 'Monthly review of what worked', 'Where AI actually moves your numbers'],
    build: ['AI for lead qualification, reporting and content ops', 'Integrations between your tools', 'Automations that replace manual work'],
  },
];
const SERVICES_ES = [
  {
    title: 'Posicionamiento y mensaje',
    summary: 'Ten claro para quién eres y por qué deberían elegirte, y ponlo en todos los lugares donde mira un cliente.',
    retires: ['Oferta poco clara', 'Mensaje a ciegas'],
    plan: ['Audiencia y segmentos que vale la pena ganar', 'La oferta, la promesa y la prueba', 'Mensaje para sitio, anuncios y email'],
    build: ['Páginas que lo dicen en segundos', 'Secuencias de bienvenida por email y SMS', 'Medición para ver qué hace el mensaje'],
  },
  {
    title: 'Estrategia de salida al mercado',
    summary: 'Un plan de canales con presupuesto y metas, y el embudo que convierte la atención en usuarios y clientes que pagan.',
    retires: ['Publicaciones al azar', 'Sin embudo claro'],
    plan: ['Auditoría de canales y los dos o tres que importan', 'Presupuesto, metas y un calendario de 90 días', 'Etapas del embudo y qué mueve cada una'],
    build: ['El embudo: páginas, formularios, pipeline en el CRM', 'Seguimiento automático para cada prospecto', 'Un tablero con los números que cuentan'],
  },
  {
    title: 'Estrategia de anuncios',
    summary: 'Campañas en Meta, Google y YouTube con segmentación, creatividades y presupuestos que se pagan solos.',
    retires: ['Gasto publicitario perdido', 'Sin medición'],
    plan: ['Segmentación, ofertas y ángulos creativos', 'Plan de pruebas y ritmo de presupuesto', 'Cómo se ve un buen CAC para ti'],
    build: ['Seguimiento del lado del servidor y Conversions API', 'Campañas, audiencias y creatividades por lotes', 'Atribución ligada a ingresos reales'],
  },
  {
    title: 'Plan de crecimiento',
    summary: 'Una hoja de ruta que tu equipo puede ejecutar, revisada contra resultados para que cada mes construya sobre el anterior.',
    retires: ['Sin hoja de ruta', 'Adivinanzas'],
    plan: ['Metas trimestrales y las apuestas detrás', 'Revisión mensual de lo que funcionó', 'Dónde la IA realmente mueve tus números'],
    build: ['IA para calificar prospectos, reportes y contenido', 'Integraciones entre tus herramientas', 'Automatizaciones que reemplazan trabajo manual'],
  },
];

const BUILD = [
  ['Performance marketing, engineered', 'Paid media run like an engineering problem: clean server-side tracking, real attribution, tight testing loops. Every dollar measured against revenue, not clicks.'],
  ['AI that ships', 'No slide-deck AI strategy. We find where AI moves your numbers (lead qualification, voice agents, content ops, reporting) and deploy it into your workflow.'],
  ['The system underneath', 'CRM, pipelines, email and SMS, booking, reviews. One connected setup instead of ten tools taped together, configured and run by us.'],
  ['Software and backend work', 'APIs, data pipelines, integrations, custom automations. When marketing hits a technical wall we write the code ourselves.'],
];
const BUILD_ES = [
  ['Marketing de rendimiento, con ingeniería', 'Publicidad pagada manejada como un problema de ingeniería: seguimiento limpio del lado del servidor, atribución real y ciclos de prueba ágiles. Cada dólar medido contra ingresos, no clics.'],
  ['IA que se pone en marcha', 'Nada de estrategias de IA en diapositivas. Encontramos dónde la IA mueve tus números (calificación de prospectos, agentes de voz, contenido, reportes) y la integramos en tu flujo de trabajo.'],
  ['El sistema debajo', 'CRM, pipelines, email y SMS, agenda, reseñas. Una configuración conectada en lugar de diez herramientas pegadas con cinta, configurada y operada por nosotros.'],
  ['Software y trabajo de backend', 'APIs, flujos de datos, integraciones, automatizaciones a la medida. Cuando el marketing choca con un muro técnico, escribimos el código nosotros.'],
];

const BUILD_ICONS = [
  <svg key="a" width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 20l6-8 5 5 9-11"/><path d="M4 24h20"/></svg>,
  <svg key="b" width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="14" cy="14" r="9"/><path d="M14 9v5l3 3"/></svg>,
  <svg key="c" width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="4" y="4" width="9" height="9"/><rect x="15" y="4" width="9" height="9"/><rect x="4" y="15" width="9" height="9"/><rect x="15" y="15" width="9" height="9"/></svg>,
  <svg key="d" width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 8l-6 6 6 6"/><path d="M18 8l6 6-6 6"/></svg>,
];

const LOCAL = [
  { page: 'AIReceptionist', en: ['AI receptionist', 'Answers every call, books the appointment, texts back missed calls.'], es: ['Recepcionista con IA', 'Contesta cada llamada, agenda la cita y responde por texto las perdidas.'] },
  { page: 'ReputationAutopilot', en: ['Reviews on autopilot', 'Review requests, replies and monitoring, run for you.'], es: ['Reseñas en automático', 'Solicitudes, respuestas y monitoreo de reseñas, operados por nosotros.'] },
  { page: 'GrowCFL', en: ['Central Florida', 'Local SEO and follow-up systems for Orlando, Lakeland and Tampa businesses.'], es: ['Florida Central', 'SEO local y sistemas de seguimiento para negocios en Orlando, Lakeland y Tampa.'] },
];

function Monogram({ es }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    if (window.matchMedia('(hover: none)').matches) return undefined;
    const stage = el.firstElementChild;
    const move = (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      stage.style.transform = `rotateX(${(-y * 10).toFixed(2)}deg) rotateY(${(x * 10).toFixed(2)}deg)`;
    };
    const leave = () => { stage.style.transform = ''; };
    el.addEventListener('mousemove', move);
    el.addEventListener('mouseleave', leave);
    return () => { el.removeEventListener('mousemove', move); el.removeEventListener('mouseleave', leave); };
  }, []);
  return (
    <figure ref={ref} className="hm-mark" aria-label={es ? 'El monograma de Loogo Labs' : 'The Loogo Labs monogram'}>
      <div className="hm-mark__stage" aria-hidden="true">
        {['tl', 'tr', 'bl', 'br'].map(t => <span key={t} className={`hm-mark__tile hm-mark__tile--${t}`} />)}
      </div>
      <figcaption className="hm-mark__caption"><span>Loogo Labs</span><span>Orlando, FL</span></figcaption>
    </figure>
  );
}

function References() {
  const es = useLang() === 'es';
  const items = [
    ...REFERENCES.map((name) => ({ name, ...CLIENT_LOGOS[name], ...CLIENT_LOGOS[name]?.ticker })),
    ...CLIENT_WORDMARKS.map((name) => ({ name, wordmark: name.split(' - ')[0] })),
  ];
  return (
    <div className="ll-ticker-bar" role="region" aria-label={es ? 'Clientes seleccionados' : 'Selected clients'}>
      <div className="ll-ticker-label">{es ? 'Hemos trabajado con' : 'Work we have done for'}</div>
      <div className="ll-ticker-belt">
        <div className="ll-ticker-track">
          {items.map((item) => (
            item.src ? (
              <span key={item.name} className={`ll-ticker-logo${item.dark ? ' ll-ticker-logo--dark' : ''}${item.chip ? ' ll-ticker-logo--chip' : ''}${item.fill ? ' ll-ticker-logo--fill' : ''}`}>
                <img src={item.src} width={item.w} height={item.h} alt={item.name} loading="lazy" />
                {item.caption && <span className="ll-ticker-logo__cap">{item.caption}</span>}
              </span>
            ) : (
              <span key={item.name} className="ll-ticker-ref">{item.wordmark || item.name}</span>
            )
          ))}
        </div>
      </div>
    </div>
  );
}

function Explorer({ es }) {
  const [open, setOpen] = React.useState(0);
  const items = es ? SERVICES_ES : SERVICES;
  return (
    <Wrap className="hm-section" id="services">
      <div className="hm-plan">
        <div className="hm-plan__head">
          <SectionHeading eyebrow={es ? 'Qué hacemos' : 'What we do'}
            title={es ? 'Cada plan llega con su construcción.' : 'Every plan ships with its build.'}
            description={es ? 'Cuatro servicios para marcas SaaS y creadores. Abre cualquiera para ver qué planeamos y qué construimos para que funcione.' : 'Four services for SaaS brands and creators. Open any of them to see what we plan and what we build to make it run.'} />
          <div className="hm-plan__legend" aria-hidden="true">
            <span><i className="plan" />{es ? 'Planeamos' : 'We plan'}</span>
            <span><i className="build" />{es ? 'Construimos' : 'We build'}</span>
          </div>
        </div>
        <ul className="hm-acc">
          {items.map((s, i) => {
            const on = open === i;
            return (
              <li key={s.title}>
                <button type="button" className="hm-acc__btn" aria-expanded={on} aria-controls={`svc-${i}`} onClick={() => setOpen(on ? -1 : i)}>
                  <span className="hm-acc__num">0{i + 1}</span>
                  <span className="hm-acc__title">{s.title}</span>
                  <span className="hm-acc__icon" aria-hidden="true" />
                </button>
                <div id={`svc-${i}`} className="hm-acc__panel" data-open={on} aria-hidden={!on}>
                  <div className="hm-acc__inner">
                    <div className="hm-acc__body">
                      <p>{s.summary}</p>
                      <div className="hm-acc__cols">
                        <div className="hm-acc__col hm-acc__col--plan">
                          <h4><i />{es ? 'Planeamos' : 'We plan'}</h4>
                          <ul>{s.plan.map(x => <li key={x}>{x}</li>)}</ul>
                        </div>
                        <div className="hm-acc__col hm-acc__col--build">
                          <h4><i />{es ? 'Construimos' : 'We build'}</h4>
                          <ul>{s.build.map(x => <li key={x}>{x}</li>)}</ul>
                        </div>
                      </div>
                      <div className="hm-acc__tags" aria-label={es ? 'Reemplaza' : 'Replaces'}>{s.retires.map(t => <span key={t}>{t}</span>)}</div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </Wrap>
  );
}

function Founder() {
  const es = useLang() === 'es';
  const [imgOk, setImgOk] = React.useState(true);
  return (
    <Wrap className="hm-section">
      <div className="hm-founder">
        <div>
          <div className="hm-founder__photo">
            {imgOk
              ? <img src="/founder-david-selva.jpg" alt={es ? 'David Selva, fundador de Loogo Labs' : 'David Selva, founder of Loogo Labs'} loading="lazy" onError={() => setImgOk(false)} />
              : <div className="hm-founder__fallback">DS</div>}
          </div>
          <p className="hm-founder__name"><strong>David Selva</strong>{es ? 'Fundador' : 'Founder'}</p>
        </div>
        <div>
          {es
            ? <h2>De día construyo sistemas de contratos. <em>El resto del tiempo, construyo tu marketing.</em></h2>
            : <h2>By day I build contract systems. <em>The rest of the time, I build your marketing.</em></h2>}
          {es ? (<>
            <p>Soy David Selva. Mi trabajo de día es la gestión del ciclo de vida de contratos en la industria de tecnología legal: los sistemas que mantienen en movimiento los contratos de empresas sin que una sola aprobación se quede en el camino.</p>
            <p>Loogo Labs es esa misma obsesión apuntada al marketing. Trabajas conmigo y con la gente que hace el trabajo: escribimos el plan, lo construimos y nos quedamos para operarlo.</p>
          </>) : (<>
            <p>I'm David Selva. My day job is contract lifecycle management inside legal tech: the systems that keep enterprise contracts moving without a single approval falling through the cracks.</p>
            <p>Loogo Labs is that same obsession pointed at marketing. You work with me and the people doing the work: we write the plan, we build it, and we stay to run it.</p>
          </>)}
        </div>
      </div>
    </Wrap>
  );
}

function StickyCta({ es }) {
  const [on, setOn] = React.useState(false);
  React.useEffect(() => {
    const hero = document.querySelector('.hm-hero');
    if (!hero || !('IntersectionObserver' in window)) return undefined;
    const io = new IntersectionObserver(([e]) => setOn(!e.isIntersecting), { threshold: 0 });
    io.observe(hero);
    return () => io.disconnect();
  }, []);
  return (
    <div className={`hm-sticky${on ? ' on' : ''}`} aria-hidden={!on}>
      <Button variant="primary" size="lg" onClick={openBooking} tabIndex={on ? 0 : -1}>{es ? 'Agenda una llamada gratis' : 'Book a free call'}</Button>
    </div>
  );
}

function Home({ onNavigate }) {
  const es = useLang() === 'es';
  const toHref = useHref();
  return (
    <main>
      <section className="hm-hero">
        <Wrap>
          <div className="hm-hero__grid">
            <div>
              {es ? (
                <h1 className="hm-hero__title">Planeamos tu marketing. <em>Luego lo construimos.</em></h1>
              ) : (
                <h1 className="hm-hero__title">We plan your marketing. <em>Then we build it.</em></h1>
              )}
              <p className="hm-hero__lede">
                {es
                  ? 'Loogo Labs es un socio de marketing para marcas SaaS y creadores. Un mismo equipo escribe la estrategia, corre los anuncios y el email, y construye el sistema que lo hace funcionar: seguimiento, automatizaciones, IA. Nada se queda esperando un traspaso.'
                  : 'Loogo Labs is a marketing partner for SaaS brands and creators. One team writes the strategy, runs the ads and email, and builds the system that makes it work: tracking, automations, AI. Nothing waits on a handoff.'}
              </p>
              <div className="hm-hero__actions">
                <Button variant="primary" size="lg" iconRight={<span>→</span>} onClick={openBooking} className="ll-on-dark-btn">{es ? 'Agenda una llamada gratis' : 'Book a free call'}</Button>
                <Button variant="secondary" size="lg" onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}>{es ? 'Ver qué hacemos' : 'See what we do'}</Button>
              </div>
              <div className="hm-hero__meta">
                <span>{es ? 'Estrategia y construcción, un mismo equipo' : 'Strategy and build, one team'}</span>
                <span>{es ? 'Medido en ingresos, no en clics' : 'Measured in revenue, not clicks'}</span>
                <span>{es ? 'Orlando, Florida' : 'Orlando, Florida'}</span>
              </div>
            </div>
            <Monogram es={es} />
          </div>
        </Wrap>
      </section>

      <References />

      <Explorer es={es} />

      <section className="hm-build ll-band" style={{ marginTop: 112 }}>
        <Wrap>
          <SectionHeading eyebrow={es ? 'Qué construimos' : 'What we build'}
            title={es ? 'Consultores que de verdad lo construyen.' : 'Consultants who can actually build it.'}
            description={es ? 'La mayoría de las agencias te entregan una presentación. La mayoría de los desarrolladores esperan especificaciones. Nosotros estamos en el medio: especialistas en marketing que escriben el código, conectan el seguimiento y ponen en marcha la IA.' : 'Most agencies hand you a deck. Most dev shops wait for a spec. We sit in the middle: marketers who write the code, wire the tracking and ship the AI.'} />
          <div className="hm-build__grid">
            {(es ? BUILD_ES : BUILD).map(([k, v], i) => (
              <div key={k} className="hm-build__tile">{BUILD_ICONS[i]}<h3>{k}</h3><p>{v}</p></div>
            ))}
          </div>
        </Wrap>
      </section>

      <Founder />

      <Wrap className="hm-section">
        <div className="hm-local">
          <SectionHeading eyebrow={es ? 'Para negocios locales' : 'For local businesses'}
            title={es ? 'Los mismos sistemas, listos para la tienda de la esquina.' : 'The same systems, ready-made for the shop down the street.'}
            description={es ? 'Lo que construimos a la medida para marcas SaaS también existe como sistemas listos que operamos para negocios de servicio en Florida Central.' : 'What we build custom for SaaS brands also exists as ready-made systems we run for service businesses in Central Florida.'} />
          <ul className="hm-local__links">
            {LOCAL.map(l => {
              const [t, d] = es ? l.es : l.en;
              return (
                <li key={l.page}>
                  <a href={toHref(pathForPage(l.page))} onClick={e => { e.preventDefault(); onNavigate(l.page); }}>
                    <strong>{t}</strong><span>{d}</span><em aria-hidden="true">→</em>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </Wrap>

      <section className="hm-cta ll-band" style={{ marginTop: 112 }}>
        <Wrap>
          <div className="hm-cta__grid">
            <div>
              <h2>{es ? 'Cuéntanos qué quieres que crezca.' : 'Tell us what you want to grow.'}</h2>
              <p>{es ? 'Una llamada de 30 minutos. Revisamos dónde estás, qué está frenando el crecimiento y qué construiríamos primero. Sin presentación, sin compromiso.' : 'A 30-minute call. We look at where you are, what is holding growth back, and what we would build first. No deck, no commitment.'}</p>
            </div>
            <div className="hm-cta__side">
              <Button variant="primary" size="lg" iconRight={<span>→</span>} onClick={openBooking}>{es ? 'Agenda una llamada gratis' : 'Book a free call'}</Button>
              <a href={`mailto:${SITE.email}`}>{es ? '¿Prefieres escribir? ' : 'Rather write? '}{SITE.email}</a>
            </div>
          </div>
        </Wrap>
      </section>

      <StickyCta es={es} />
    </main>
  );
}

export default Home;
