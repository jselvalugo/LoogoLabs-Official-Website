import React from 'react';
import Button from '../components/core/Button';
import SectionHeading from '../components/surfaces/SectionHeading';
import { openBooking } from '../lib/booking';
import { SITE, pathForPage } from '../lib/seo';
import { REFERENCES, CLIENT_LOGOS, CLIENT_WORDMARKS } from '../lib/references';
import { useHref, useLang } from '../lib/i18n';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent, useReducedMotion } from 'motion/react';
import { Reveal, Stagger, Item, Words, Parallax, Magnetic, MotionPace, EASE, useMounted } from '../lib/motion';
import { LivingMonogram, ServiceGlyph, AmbientShape } from '../components/brand/Morph';

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
  return (
    <figure className="hm-mark" aria-label={es ? 'El monograma de Loogo Labs' : 'The Loogo Labs monogram'}>
      <LivingMonogram fill="var(--paper-000)" bg="var(--ink-900)" delay={1.1} />
      <figcaption className="hm-mark__caption"><span>Loogo Labs</span><span>Orlando, FL</span></figcaption>
    </figure>
  );
}

function Hero({ es, children }) {
  const ref = React.useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const mounted = useMounted();
  const Inner = !mounted || reduce ? 'div' : motion.div;
  const props = !mounted || reduce ? {} : { style: { y, opacity, scale } };
  return (
    <section ref={ref} className="hm-hero">
      <div className="hm-hero__frame">
        <Inner className="hm-hero__grid" {...props}>{children}</Inner>
      </div>
      {mounted && !reduce && (
        <motion.div className="hm-hero__hint" aria-hidden="true" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8, duration: 0.6 }}>
          <span>{es ? 'Desliza' : 'Scroll'}</span><i />
        </motion.div>
      )}
    </section>
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
          {[0, 1].map(copy => items.map((item) => (
            item.src ? (
              <span key={`${copy}-${item.name}`} aria-hidden={copy === 1 || undefined} className={`ll-ticker-logo${item.dark ? ' ll-ticker-logo--dark' : ''}${item.chip ? ' ll-ticker-logo--chip' : ''}${item.fill ? ' ll-ticker-logo--fill' : ''}`}>
                <img src={item.src} width={item.w} height={item.h} alt={copy === 0 ? item.name : ''} loading="lazy" style={item.th ? { height: item.th } : undefined} />
                {item.caption && <span className="ll-ticker-logo__cap">{item.caption}</span>}
              </span>
            ) : (
              <span key={`${copy}-${item.name}`} aria-hidden={copy === 1 || undefined} className="ll-ticker-ref">{item.wordmark || item.name}</span>
            )
          )))}
        </div>
      </div>
    </div>
  );
}

function useMedia(q) {
  const [m, setM] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia(q);
    const on = () => setM(mq.matches);
    on(); mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [q]);
  return m;
}

// Accordion version: phones, reduced motion, and the server render.
function Accordion({ es, items }) {
  const [open, setOpen] = React.useState(0);
  return (
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
                    <div className="hm-acc__col hm-acc__col--plan"><h4><i />{es ? 'Planeamos' : 'We plan'}</h4><ul>{s.plan.map(x => <li key={x}>{x}</li>)}</ul></div>
                    <div className="hm-acc__col hm-acc__col--build"><h4><i />{es ? 'Construimos' : 'We build'}</h4><ul>{s.build.map(x => <li key={x}>{x}</li>)}</ul></div>
                  </div>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

// Pinned scroll scene: the viewport locks while the four services advance.
function Scene({ es, items }) {
  const ref = React.useRef(null);
  const [active, setActive] = React.useState(0);
  const [built, setBuilt] = React.useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const raw = v * items.length;
    const i = Math.min(items.length - 1, Math.floor(raw));
    if (i !== active) setActive(i);
    // Within each step: first half draws the plan (outline), second half fills the build.
    const local = Math.min(1, Math.max(0, raw - i));
    const b = Math.min(1, Math.max(0, (local - 0.35) / 0.45));
    if (Math.abs(b - built) > 0.01) setBuilt(b);
  });
  const bar = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const s = items[active];
  const jump = (i) => {
    const el = ref.current; if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const h = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + (h * (i + 0.5)) / items.length, behavior: 'smooth' });
  };
  return (
    <div ref={ref} className="hm-scene" style={{ height: `${items.length * 90 + 10}vh` }}>
      <div className="hm-scene__pin">
        <div className="hm-wrap hm-scene__grid">
          <div className="hm-scene__left">
            <h2 className="hm-scene__h2">{es ? 'Cada plan llega con su construcción.' : 'Every plan ships with its build.'}</h2>
            <ol className="hm-scene__nav">
              {items.map((it, i) => (
                <li key={it.title}>
                  <button type="button" className={i === active ? 'on' : ''} onClick={() => jump(i)} aria-current={i === active ? 'step' : undefined}>
                    <span>0{i + 1}</span>{it.title}
                  </button>
                </li>
              ))}
            </ol>
            <div className="hm-scene__bar" aria-hidden="true"><motion.span style={{ width: bar }} /></div>
          </div>
          <div className="hm-scene__right">
            <AnimatePresence mode="wait">
              <motion.div key={active} className="hm-scene__card"
                initial={{ opacity: 0, y: 40, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -30, scale: 0.98 }}
                transition={{ duration: 0.45, ease: EASE }}>
                <div className="hm-scene__glyph"><ServiceGlyph index={active} built={built} size={150} fill="var(--ink-900)" stroke="var(--amber-500)" /></div>
                <h3>{s.title}</h3>
                <p>{s.summary}</p>
                <div className="hm-acc__cols">
                  <motion.div className="hm-acc__col hm-acc__col--plan" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15, duration: 0.5, ease: EASE }}>
                    <h4><i />{es ? 'Planeamos' : 'We plan'}</h4><ul>{s.plan.map(x => <li key={x}>{x}</li>)}</ul>
                  </motion.div>
                  <motion.div className="hm-acc__col hm-acc__col--build" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.5, ease: EASE }}>
                    <h4><i />{es ? 'Construimos' : 'We build'}</h4><ul>{s.build.map(x => <li key={x}>{x}</li>)}</ul>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

function Explorer({ es }) {
  const items = es ? SERVICES_ES : SERVICES;
  const reduce = useReducedMotion();
  const wide = useMedia('(min-width: 961px)');
  if (wide && !reduce) return <section id="services"><Scene es={es} items={items} /></section>;
  return (
    <Wrap className="hm-section" id="services">
      <div className="hm-plan">
        <div className="hm-plan__head">
          <SectionHeading
            title={es ? 'Cada plan llega con su construcción.' : 'Every plan ships with its build.'}
            description={es ? 'Cuatro servicios para marcas SaaS y creadores. Toca uno para ver qué planeamos y qué construimos.' : 'Four services for SaaS brands and creators. Tap one to see what we plan and what we build.'} />
        </div>
        <Accordion es={es} items={items} />
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
  // Phones: same animations, about 30% quicker, and blocks start revealing as
  // soon as they peek in, so nobody waits on text while scrolling.
  const phone = useMedia('(max-width: 767px)');
  return (
    <MotionPace pace={phone ? 0.7 : 1} amount={phone ? 0.12 : null}>
    <main>
      <Hero es={es}>
            <div className="hm-hero__copy">
              <Reveal y={10}><span className="hm-hero__kicker ll-label">{es ? 'Orlando, Florida' : 'Orlando, Florida'}</span></Reveal>
              <h1 className="hm-hero__title">
                <Words text={es ? 'Planeamos tu marketing.' : 'We plan your marketing.'} delay={0.1} step={0.07} />{' '}
                <Words as="em" text={es ? 'Luego lo construimos.' : 'Then we build it.'} delay={0.5} step={0.07} />
              </h1>
              <Reveal delay={0.9} y={10}><span className="hm-hero__sub ll-label">{es ? 'IA, marketing y automatización para marcas SaaS y creadores' : 'AI, marketing & automation for SaaS brands and creators'}</span></Reveal>
              <Reveal delay={1.0} y={16}>
              <p className="hm-hero__lede">
                {es
                  ? 'Un mismo equipo escribe la estrategia, corre los anuncios y el email, y construye el sistema que lo hace funcionar: seguimiento, automatizaciones, IA. Nada se queda esperando un traspaso.'
                  : 'One team writes the strategy, runs the ads and email, and builds the system that makes it work: tracking, automations, AI. Nothing waits on a handoff.'}
              </p>
              </Reveal>
              <Reveal delay={1.15} y={16}>
              <div className="hm-hero__actions">
                <Magnetic><Button variant="primary" size="lg" iconRight={<span>→</span>} onClick={openBooking}>{es ? 'Agenda una llamada gratis' : 'Book a free call'}</Button></Magnetic>
                <Button variant="ghost" size="md" iconRight={<span>→</span>} onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}>{es ? 'Ver qué hacemos' : 'Explore what we do'}</Button>
              </div>
              </Reveal>
            </div>
            <div className="hm-hero__side">
              <div className="hm-hero__mark" aria-hidden="true"><LivingMonogram fill="var(--ink-900)" bg="var(--paper-200)" delay={1.1} /></div>
              <figure className="hm-hero__founder">
                <img src="/founder-cutout.png" alt={es ? 'David Selva, fundador de Loogo Labs' : 'David Selva, founder of Loogo Labs'} width="536" height="612" fetchpriority="high" />
                <figcaption><strong>David Selva</strong><span>{es ? 'Fundador' : 'Founder'}</span></figcaption>
              </figure>
            </div>
      </Hero>

      <References />

      <Explorer es={es} />

      <section className="hm-build ll-band ll-band--tan">
        <Wrap>
          <Reveal>
          <SectionHeading eyebrow={es ? 'Qué construimos' : 'What we build'}
            title={es ? 'Consultores que de verdad lo construyen.' : 'Consultants who can actually build it.'}
            description={es ? 'La mayoría de las agencias te entregan una presentación. La mayoría de los desarrolladores esperan especificaciones. Nosotros estamos en el medio: especialistas en marketing que escriben el código, conectan el seguimiento y ponen en marcha la IA.' : 'Most agencies hand you a deck. Most dev shops wait for a spec. We sit in the middle: marketers who write the code, wire the tracking and ship the AI.'} />
          </Reveal>
          <Stagger className="hm-build__grid" gap={0.12}>
            {(es ? BUILD_ES : BUILD).map(([k, v], i) => (
              <Item key={k} className="hm-build__tile">{BUILD_ICONS[i]}<h3>{k}</h3><p>{v}</p></Item>
            ))}
          </Stagger>
        </Wrap>
      </section>


      <Wrap className="hm-section">
        <div className="hm-local">
          <Reveal>
          <SectionHeading eyebrow={es ? 'Para negocios locales' : 'For local businesses'}
            title={es ? 'Los mismos sistemas, listos para la tienda de la esquina.' : 'The same systems, ready-made for the shop down the street.'}
            description={es ? 'Lo que construimos a la medida para marcas SaaS también existe como sistemas listos que operamos para negocios de servicio en Florida Central.' : 'What we build custom for SaaS brands also exists as ready-made systems we run for service businesses in Central Florida.'} />
          </Reveal>
          <Stagger as="ul" className="hm-local__links" gap={0.1}>
            {LOCAL.map(l => {
              const [t, d] = es ? l.es : l.en;
              return (
                <Item key={l.page} as="li">
                  <a href={toHref(pathForPage(l.page))} onClick={e => { e.preventDefault(); onNavigate(l.page); }}>
                    <strong>{t}</strong><span>{d}</span><em aria-hidden="true">→</em>
                  </a>
                </Item>
              );
            })}
          </Stagger>
        </div>
      </Wrap>

      <section className="hm-cta ll-band" style={{ position: 'relative', overflow: 'hidden' }}>
        <AmbientShape index={3} className="hm-cta__shape" />
        <Wrap style={{ position: 'relative' }}>
          <div className="hm-cta__grid">
            <Reveal>
              <h2>{es ? 'Cuéntanos qué quieres que crezca.' : 'Tell us what you want to grow.'}</h2>
              <p>{es ? 'Una llamada de 30 minutos. Revisamos dónde estás, qué está frenando el crecimiento y qué construiríamos primero. Sin presentación, sin compromiso.' : 'A 30-minute call. We look at where you are, what is holding growth back, and what we would build first. No deck, no commitment.'}</p>
            </Reveal>
            <Reveal className="hm-cta__side" delay={0.15}>
              <Magnetic><Button variant="primary" size="lg" iconRight={<span>→</span>} onClick={openBooking}>{es ? 'Agenda una llamada gratis' : 'Book a free call'}</Button></Magnetic>
              <a href={`mailto:${SITE.email}`}>{es ? '¿Prefieres escribir? ' : 'Rather write? '}{SITE.email}</a>
            </Reveal>
          </div>
        </Wrap>
      </section>

      <StickyCta es={es} />
    </main>
    </MotionPace>
  );
}

export default Home;
