import React from 'react';
import Button from '../components/core/Button';
import SectionHeading from '../components/surfaces/SectionHeading';
import { openBooking } from '../lib/booking';
import { SITE, pathForPage } from '../lib/seo';
import { REFERENCES, CLIENT_LOGOS, CLIENT_WORDMARKS } from '../lib/references';
import { useHref, useLang } from '../lib/i18n';

const Wrap = ({ children, style, className }) => (
  <div className={['hm-wrap', className].filter(Boolean).join(' ')} style={style}>{children}</div>
);

// ── Services: strategy first ────────────────────────────────────────────────
const SERVICES = [
  { title: 'Positioning & messaging', retires: ['Unclear offer', 'Guessing at messaging'],
    body: 'We find what makes your brand worth choosing, then sharpen your audience, messaging and offer so the right people understand you in seconds.' },
  { title: 'Go-to-market strategy', retires: ['Random posting', 'No clear funnel'],
    body: 'An audit of your channels, a plan with budget and targets, and a funnel that turns attention into users, subscribers and paying customers.' },
  { title: 'Ads strategy', retires: ['Wasted ad spend', 'No tracking'],
    body: 'Meta, Google and YouTube campaigns built around targeting, creative and budgets that pay back, with results tracked to real revenue.' },
  { title: 'Growth plan', retires: ['No roadmap', 'Guesswork'],
    body: 'A 90-day roadmap with clear targets your team can run, reviewed against results so every month builds on the last.' },
];
const SERVICES_ES = [
  { title: 'Posicionamiento y mensaje', retires: ['Oferta poco clara', 'Mensaje a ciegas'],
    body: 'Descubrimos qué hace que tu marca valga la pena elegir y afinamos tu audiencia, mensaje y oferta para que las personas correctas te entiendan en segundos.' },
  { title: 'Estrategia de salida al mercado', retires: ['Publicaciones al azar', 'Sin embudo claro'],
    body: 'Una auditoría de tus canales, un plan con presupuesto y metas, y un embudo que convierte la atención en usuarios, suscriptores y clientes que pagan.' },
  { title: 'Estrategia de anuncios', retires: ['Gasto publicitario perdido', 'Sin medición'],
    body: 'Campañas en Meta, Google y YouTube con segmentación, creatividades y presupuestos que se pagan solos, con resultados medidos en ingresos reales.' },
  { title: 'Plan de crecimiento', retires: ['Sin hoja de ruta', 'Adivinanzas'],
    body: 'Un plan de 90 días con metas claras que tu equipo puede ejecutar, revisado con resultados para que cada mes construya sobre el anterior.' },
];

// ── What we build: the part most consultants hand off ───────────────────────
const BUILD = [
  ['Performance marketing, engineered', 'We run paid media like an engineering problem: clean server-side tracking, real attribution, tight testing loops. Every dollar gets measured against revenue, not clicks or impressions.'],
  ['AI that ships', 'No slide-deck AI strategy. We find where AI actually moves your numbers (lead qualification, voice agents, content ops, reporting) then build and deploy it into your workflow.'],
  ['Software and backend work', 'APIs, data pipelines, CRM integrations, custom automations. When your marketing hits a technical wall, we don\'t file a ticket with someone else. We write the code ourselves.'],
  ['A partner, not a vendor', 'You work directly with the people doing the work. We learn your business, sit in on your numbers, and stay accountable to outcomes: strategy, execution, and the tech underneath it all.'],
];
const BUILD_ES = [
  ['Marketing de rendimiento, con ingeniería', 'Manejamos la publicidad pagada como un problema de ingeniería: seguimiento limpio del lado del servidor, atribución real y ciclos de prueba ágiles. Cada dólar se mide contra ingresos, no contra clics o impresiones.'],
  ['IA que se pone en marcha', 'Nada de estrategias de IA en diapositivas. Encontramos dónde la IA realmente mueve tus números (calificación de prospectos, agentes de voz, contenido, reportes) y luego la construimos e integramos en tu flujo de trabajo.'],
  ['Software y trabajo de backend', 'APIs, flujos de datos, integraciones de CRM, automatizaciones a la medida. Cuando tu marketing choca con un muro técnico, no le pasamos el problema a otro. Escribimos el código nosotros mismos.'],
  ['Un socio, no un proveedor', 'Trabajas directamente con las personas que hacen el trabajo. Aprendemos tu negocio, revisamos tus números contigo y respondemos por los resultados: estrategia, ejecución y la tecnología detrás de todo.'],
];

// ── Local offers: kept on their own pages, pointed to once here ─────────────
const LOCAL = [
  { page: 'AIReceptionist', en: ['AI receptionist', 'Answers every call, books the appointment, texts back missed calls.'], es: ['Recepcionista con IA', 'Contesta cada llamada, agenda la cita y responde por texto las perdidas.'] },
  { page: 'ReputationAutopilot', en: ['Reviews on autopilot', 'Review requests, replies and monitoring, run for you.'], es: ['Reseñas en automático', 'Solicitudes, respuestas y monitoreo de reseñas, operados por nosotros.'] },
  { page: 'GrowCFL', en: ['Central Florida', 'Marketing systems for Orlando, Lakeland and Tampa businesses.'], es: ['Florida Central', 'Sistemas de marketing para negocios en Orlando, Lakeland y Tampa.'] },
];

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

function Founder() {
  const es = useLang() === 'es';
  const [imgOk, setImgOk] = React.useState(true);
  return (
    <Wrap className="hm-section">
      <hr className="ll-rule hm-rule" />
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
            <p>Loogo Labs es esa misma obsesión apuntada a otra cosa: marketing para marcas SaaS y creadores que están cansados de estrategias que nadie termina de construir. Cada flujo que corre aquí lo diseñé y lo opero yo.</p>
          </>) : (<>
            <p>I'm David Selva. My day job is contract lifecycle management inside legal tech: the systems that keep enterprise contracts moving without a single approval falling through the cracks.</p>
            <p>Loogo Labs is that same obsession pointed somewhere else: marketing for SaaS brands and creators who are tired of strategies nobody finishes building. Every workflow running here, I designed and I run myself.</p>
          </>)}
        </div>
      </div>
    </Wrap>
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
                  ? 'Loogo Labs es un socio de marketing para marcas SaaS y creadores. Un mismo equipo escribe la estrategia, corre los anuncios y el email, y pone en marcha el seguimiento, las automatizaciones y la IA que lo hacen funcionar. Nada se queda esperando un traspaso.'
                  : 'Loogo Labs is a marketing partner for SaaS brands and creators. One team writes the strategy, runs the ads and email, and ships the tracking, automations and AI that make it work. Nothing waits on a handoff.'}
              </p>
              <div className="hm-hero__actions">
                <Button variant="primary" size="lg" iconRight={<span>→</span>} onClick={openBooking}>{es ? 'Agenda una llamada gratis' : 'Book a free call'}</Button>
                <Button variant="secondary" size="lg" onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}>{es ? 'Ver qué hacemos' : 'See what we do'}</Button>
              </div>
              <div className="hm-hero__meta">
                <span>{es ? 'Orlando, Florida' : 'Orlando, Florida'}</span>
                <span>{es ? 'Trabajas con quien hace el trabajo' : 'You work with the people doing the work'}</span>
              </div>
            </div>
            <figure className="hm-mark" aria-label={es ? 'El monograma de Loogo Labs' : 'The Loogo Labs monogram'}>
              <span className="hm-mark__tile" aria-hidden="true" />
              <figcaption className="hm-mark__caption"><span>Loogo Labs</span><span>{es ? 'Desde 2024' : 'Est. 2024'}</span></figcaption>
            </figure>
          </div>
        </Wrap>
      </section>

      <References />

      <Wrap className="hm-section" id="services">
        <SectionHeading eyebrow={es ? 'Qué hacemos' : 'What we do'}
          title={es ? 'Cuatro servicios, un plan, pensado para los clientes que quieres.' : 'Four services, one plan, built around the customers you want.'}
          description={es ? 'Estrategia de marketing y anuncios para marcas SaaS y creadores. Empezamos por la parte que casi todos saltan: tener claro a quién le hablas y por qué deberían elegirte.' : 'Marketing and ads strategy for SaaS brands and creators. We start with the part most people skip: being clear about who you are talking to and why they should choose you.'} />
        <ul className="hm-list" style={{ marginTop: 48 }}>
          {(es ? SERVICES_ES : SERVICES).map(s => (
            <li key={s.title}>
              <div>
                <h3>{s.title}</h3>
                <div className="hm-list__tags" aria-label={es ? 'Reemplaza' : 'Replaces'}>{s.retires.map(t => <span key={t}>{t}</span>)}</div>
              </div>
              <p>{s.body}</p>
            </li>
          ))}
        </ul>
      </Wrap>

      <Wrap className="hm-section">
        <div className="hm-why">
          <div className="hm-why__head">
            <SectionHeading eyebrow={es ? 'Qué construimos' : 'What we build'}
              title={es ? 'Consultores que de verdad lo construyen.' : 'Consultants who can actually build it.'}
              description={es ? 'La mayoría de las agencias te entregan una presentación. La mayoría de los desarrolladores esperan especificaciones. Nosotros estamos en el medio: especialistas en marketing que escriben el código, conectan el seguimiento y ponen en marcha la IA.' : 'Most agencies hand you a deck. Most dev shops wait for a spec. We sit in the middle: marketers who write the code, wire the tracking and ship the AI.'} />
          </div>
          <div className="hm-why__list">
            {(es ? BUILD_ES : BUILD).map(([k, v]) => (
              <div key={k} className="hm-why__item"><h3>{k}</h3><p>{v}</p></div>
            ))}
          </div>
        </div>
      </Wrap>

      <Founder />

      <Wrap className="hm-section">
        <div className="hm-local">
          <SectionHeading eyebrow={es ? 'Para negocios locales' : 'For local businesses'}
            title={es ? 'Lo mismo, para la tienda de la esquina.' : 'The same idea, for the shop down the street.'}
            description={es ? 'Sistemas listos que operamos por ti, para negocios de servicio en Florida Central.' : 'Ready-made systems we run for you, for service businesses in Central Florida.'} />
          <ul className="hm-local__links">
            {LOCAL.map(l => {
              const [t, d] = es ? l.es : l.en;
              return (
                <li key={l.page}>
                  <a href={toHref(pathForPage(l.page))} onClick={e => { e.preventDefault(); onNavigate(l.page); }}>
                    <strong>{t}</strong><span>{d}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </Wrap>

      <Wrap className="hm-section">
        <div className="hm-cta">
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
    </main>
  );
}

export default Home;
