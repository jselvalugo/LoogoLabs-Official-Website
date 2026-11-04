import React from 'react';
import Button from '../components/core/Button';
import { ArrowRight, ArrowDown, Blueprint, ChartLineUp, UsersThree, Lifebuoy } from '@phosphor-icons/react';
import { openBooking } from '../lib/booking';
import { useLang } from '../lib/i18n';
import { Reveal, Stagger, Item, Counter } from '../lib/motion';

// The Mission page is the house style for editorial pages: floating forest hero,
// bento principles, sage stat strip, step cards, closing CTA panel.
// All of its building blocks are the reusable `ll-staple-*` classes in globals.css.

const TOOLS = ['Strategy deck', 'Agency retainer', 'Freelance dev', 'Ads vendor', 'Email tool', 'CRM setup', 'Analytics consultant', 'AI pilot'];

const PRINCIPLES = [
  ['A plan is only worth what gets built',
    'Most marketing strategies die between the deck and the dev queue. We write the plan and build what it needs, so nothing waits on a handoff and the numbers start moving in weeks, not quarters.'],
  ['Revenue is the only scoreboard',
    'Clicks, impressions and followers are inputs. We measure positioning, campaigns and automations against customers and revenue, with tracking we set up ourselves so the numbers are real.'],
  ['One team, end to end',
    'Strategy, ads, email, tracking, automations, AI. The people who plan your growth are the same people who build and run it. You never translate between an agency and a developer again.'],
  ['We stay until it runs itself',
    'Launch is the start. We review results monthly, keep the system healthy and hand over documentation, so your growth does not depend on us being in the room.'],
];

const STATS = [['1', 'Team from plan to build'], ['30 days', 'To a live system'], ['Monthly', 'Review against revenue']];

const STEPS = [
  ['Diagnose', 'We learn your product, your customers and your numbers: where leads come from today, where they leak, and what growth is worth to you.'],
  ['Plan', 'Positioning, channels, budget and targets in one document your team can read in ten minutes, with the build list it needs.'],
  ['Build', 'Pages, tracking, pipeline, automations and AI, built by us and connected to the tools you already use.'],
  ['Launch', 'Campaigns and sequences go live in batches, each with a clear test and a number it has to hit.'],
  ['Run and review', 'Monthly reviews against revenue. What worked gets more budget, what did not gets rewritten. Every month builds on the last.'],
];

const TOOLS_ES = ['Presentación de estrategia', 'Agencia por mes', 'Desarrollador freelance', 'Proveedor de anuncios', 'Herramienta de email', 'Configuración de CRM', 'Consultor de analítica', 'Piloto de IA'];

const PRINCIPLES_ES = [
  ['Un plan vale lo que se construye',
    'La mayoría de las estrategias de marketing mueren entre la presentación y la fila de desarrollo. Escribimos el plan y construimos lo que necesita, así nada espera un traspaso y los números se mueven en semanas, no en trimestres.'],
  ['Los ingresos son el único marcador',
    'Clics, impresiones y seguidores son insumos. Medimos el posicionamiento, las campañas y las automatizaciones contra clientes e ingresos, con un seguimiento que configuramos nosotros para que los números sean reales.'],
  ['Un solo equipo, de principio a fin',
    'Estrategia, anuncios, email, seguimiento, automatizaciones, IA. Las personas que planean tu crecimiento son las mismas que lo construyen y lo operan. Nunca vuelves a traducir entre una agencia y un desarrollador.'],
  ['Nos quedamos hasta que funcione solo',
    'El lanzamiento es el inicio. Revisamos resultados cada mes, mantenemos el sistema sano y entregamos documentación, para que tu crecimiento no dependa de que estemos en la sala.'],
];

const STATS_ES = [['1', 'Equipo del plan a la construcción'], ['30 días', 'Hasta un sistema en vivo'], ['Mensual', 'Revisión contra ingresos']];

const STEPS_ES = [
  ['Diagnóstico', 'Conocemos tu producto, tus clientes y tus números: de dónde vienen los prospectos hoy, dónde se pierden y cuánto vale crecer.'],
  ['Plan', 'Posicionamiento, canales, presupuesto y metas en un documento que tu equipo lee en diez minutos, con la lista de lo que hay que construir.'],
  ['Construcción', 'Páginas, seguimiento, pipeline, automatizaciones e IA, construidos por nosotros y conectados a las herramientas que ya usas.'],
  ['Lanzamiento', 'Campañas y secuencias salen en lotes, cada uno con una prueba clara y un número que debe alcanzar.'],
  ['Operación y revisión', 'Revisiones mensuales contra ingresos. Lo que funciona recibe más presupuesto; lo que no, se reescribe. Cada mes construye sobre el anterior.'],
];

const ICONS = [Blueprint, ChartLineUp, UsersThree, Lifebuoy];
function Icon({ i }) { const C = ICONS[i]; return <C size={20} weight="bold" />; }

function Mission({ onNavigate }) {
  const es = useLang() === 'es';
  return (
    <main>
      {/* ── Hero ── */}
      <section className="ll-staple-wrap ll-staple-hero">
        <div className="ll-staple-hero-panel ll-forest">
          <div className="ll-hero-grid-bg" aria-hidden="true" />
          <div className="ll-staple-hero-inner">
            <div>
              <span className="ll-staple-kicker">{es ? 'Nuestra misión' : 'Our mission'}</span>
              {es ? (
              <h1 className="ll-staple-title">
                La mayoría de los planes de marketing <em>nunca se construyen.</em>
              </h1>
              ) : (
              <h1 className="ll-staple-title">
                Most marketing plans <em>never get built.</em>
              </h1>
              )}
              {es ? (
              <p className="ll-staple-lede">
                Una agencia escribe la estrategia. Un desarrollador espera las especificaciones. Entre los dos, los meses pasan.
                Loogo Labs existe para cerrar esa brecha: un solo equipo que planea tu marketing y luego construye y opera el sistema que lo hace funcionar.
              </p>
              ) : (
              <p className="ll-staple-lede">
                An agency writes the strategy. A developer waits for the spec. Between the two, months go by.
                Loogo Labs exists to close that gap: one team that plans your marketing, then builds and runs the system that makes it work.
              </p>
              )}
              <div className="ll-staple-actions">
                <Button variant="primary" iconRight={<ArrowRight size={16} weight="bold" />} onClick={openBooking}>{es ? 'Agenda una llamada de estrategia gratis' : 'Book a free strategy call'}</Button>
              </div>
            </div>
            <div className="ll-staple-collapse ll-glass--dark" aria-label={es ? 'Muchos proveedores reemplazados por un solo equipo' : 'Many vendors replaced by one team'}>
              <ul>
                {(es ? TOOLS_ES : TOOLS).map((t) => <li key={t}>{t}</li>)}
              </ul>
              <div className="ll-staple-collapse-arrow" aria-hidden="true"><ArrowDown size={22} /></div>
              <div className="ll-staple-collapse-one">{es ? 'Un equipo. Del plan a la construcción.' : 'One team. From plan to build.'}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Principles ── */}
      <section className="ll-staple-wrap ll-staple-section">
        <div className="ll-staple-split">
          <div className="ll-staple-sticky">
            <span className="ll-eyebrow">{es ? 'Lo que creemos' : 'What we believe'}</span>
            {es ? <h2 className="ll-staple-h2">Cuatro principios detrás de <em>cómo trabajamos.</em></h2> : <h2 className="ll-staple-h2">Four principles behind <em>how we work.</em></h2>}
          </div>
          <Stagger as="ol" className="ll-staple-principles" gap={0.12}>
            {(es ? PRINCIPLES_ES : PRINCIPLES).map(([t, d], i) => (
              <Item as="li" key={t}>
                <span className="ll-staple-num" aria-hidden="true"><Icon i={i} /></span>
                <h3>{t}</h3>
                <p>{d}</p>
              </Item>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ── Stat band ── */}
      <section className="ll-staple-wrap ll-staple-band">
        <div className="ll-staple-stats ll-sage">
          {(es ? STATS_ES : STATS).map(([v, l]) => (
            <div key={v}>
              <div className="ll-staple-stat-value"><Counter value={v} /></div>
              <div className="ll-staple-stat-label">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="ll-staple-wrap ll-staple-section">
        {es ? <h2 className="ll-staple-h2">Cinco pasos, <em>del plan al sistema en vivo.</em></h2> : <h2 className="ll-staple-h2">Five steps, <em>from plan to live system.</em></h2>}
        <p className="ll-staple-sub">{es ? 'Cada cliente pasa por el mismo proceso. Sabes qué sigue y cuándo, desde la primera llamada.' : 'Every client goes through the same process. You know what comes next and when, from the first call.'}</p>
        <Stagger as="ol" className="ll-staple-timeline" gap={0.1}>
          {(es ? STEPS_ES : STEPS).map(([t, d], i) => (
            <Item as="li" key={i}>
              <span className="ll-staple-node">{es ? 'Paso' : 'Step'} {i + 1}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </Item>
          ))}
        </Stagger>
      </section>

      {/* ── Closing CTA ── */}
      <section className="ll-staple-wrap" style={{ paddingBottom: 96 }}>
        <div className="ll-staple-cta ll-forest">
          <img src="/team-photo.jpg" alt={es ? 'El equipo de Loogo Labs trabajando' : 'The Loogo Labs team at work'} />
          <div className="ll-staple-cta-body">
            <h2 className="ll-staple-h2">{es ? 'Nos mantenemos cerca de cada cliente.' : 'We stay close to every client.'}</h2>
            {es ? (
            <p>
              Mantenemos una lista de clientes selecta. Si tienes una marca SaaS, una audiencia o un negocio
              de servicios y estás cansado de estrategias que nadie termina de construir, esta conversación vale 30 minutos.
              Te diremos qué planearíamos y qué construiríamos primero, sin presentación de ventas.
            </p>
            ) : (
            <p>
              We keep our client list intentional. If you run a SaaS brand, an audience or a service business
              and you are tired of strategies nobody finishes building, this conversation is worth 30 minutes.
              We will tell you what we would plan and what we would build first, no pitch deck required.
            </p>
            )}
            <div className="ll-staple-actions">
              <Button variant="primary" iconRight={<ArrowRight size={16} weight="bold" />} onClick={openBooking}>{es ? 'Agenda una llamada de estrategia gratis' : 'Book a free strategy call'}</Button>
              <button type="button" className="ll-staple-textlink" onClick={() => onNavigate('Home')}>{es ? 'Volver al inicio' : 'Back to home'} <ArrowRight size={16} /></button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Mission;
