import React from 'react';
import Button from '../components/core/Button';
import { ArrowRight, ArrowDown, CurrencyDollar, Target, HandHeart, Lifebuoy } from '@phosphor-icons/react';
import { openBooking } from '../lib/booking';
import { useLang } from '../lib/i18n';

// The Mission page is the house style for editorial pages: floating forest hero,
// bento principles, sage stat strip, step cards, closing CTA panel.
// All of its building blocks are the reusable `ll-staple-*` classes in globals.css.

const TOOLS = ['CRM', 'Email marketing', 'Scheduling', 'Course platform', 'Social scheduler', 'Review requests', 'Forms & funnels', 'Invoicing'];

const PRINCIPLES = [
  ['Software should make you money, not cost more of it',
    'We got tired of watching good businesses overpay for disconnected tools that barely talk to each other. We brought it all under one roof and made sure the math works from day one.'],
  ['The outcome is the product',
    'The goal is never the software. More leads followed up, more deals closed, more content published without burning hours, and more time to work on the business instead of inside it.'],
  ['Done for you, not handed to you',
    'Every account is configured, automated and taught by us. Nothing is left for you to figure out alone.'],
  ['We stay until it runs itself',
    'We are not done until your operations run on their own, and 24/7 support is included the whole way there.'],
];

const STATS = [['10+', 'Tools replaced'], ['$400+', 'Saved every month'], ['24/7', 'Support included']];

const STEPS = [
  ['Discovery', 'We learn your business: what tools you pay for, what costs you the most, and what the platform has to do first.'],
  ['Setup', 'We configure your account, build your pipelines, import your contacts and connect your existing systems.'],
  ['Automations', 'We build the workflows that matter most first: lead follow-up, appointment reminders, review requests.'],
  ['Training', 'We walk your team through the platform until everyone is confident, with recordings, guides and a direct line to us.'],
  ['Ongoing support', '24/7 support, always. As your business grows, the platform grows with it.'],
];

const TOOLS_ES = ['CRM', 'Email marketing', 'Agenda de citas', 'Plataforma de cursos', 'Programador de redes', 'Solicitudes de reseñas', 'Formularios y embudos', 'Facturación'];

const PRINCIPLES_ES = [
  ['El software debe hacerte ganar dinero, no costarte más',
    'Nos cansamos de ver a buenos negocios pagar de más por herramientas desconectadas que casi no se comunican entre sí. Reunimos todo bajo un mismo techo y nos aseguramos de que los números cuadren desde el primer día.'],
  ['El resultado es el producto',
    'La meta nunca es el software. Es dar seguimiento a más prospectos, cerrar más ventas, publicar más contenido sin quemar horas y tener más tiempo para trabajar en tu negocio en lugar de dentro de él.'],
  ['Lo hacemos por ti, no te lo dejamos a ti',
    'Cada cuenta la configuramos, automatizamos y enseñamos nosotros. No te dejamos nada para que lo resuelvas solo.'],
  ['Nos quedamos hasta que funcione solo',
    'No terminamos hasta que tus operaciones funcionen por sí solas, y el soporte 24/7 está incluido en todo el camino.'],
];

const STATS_ES = [['10+', 'Herramientas reemplazadas'], ['$400+', 'De ahorro cada mes'], ['24/7', 'Soporte incluido']];

const STEPS_ES = [
  ['Descubrimiento', 'Conocemos tu negocio: qué herramientas pagas, qué te cuesta más y qué debe resolver primero la plataforma.'],
  ['Configuración', 'Configuramos tu cuenta, creamos tus embudos, importamos tus contactos y conectamos tus sistemas actuales.'],
  ['Automatizaciones', 'Primero creamos los flujos que más importan: seguimiento de prospectos, recordatorios de citas y solicitudes de reseñas.'],
  ['Capacitación', 'Guiamos a tu equipo por la plataforma hasta que todos se sientan seguros, con grabaciones, guías y línea directa con nosotros.'],
  ['Soporte continuo', 'Soporte 24/7, siempre. A medida que tu negocio crece, la plataforma crece contigo.'],
];

const ICONS = [CurrencyDollar, Target, HandHeart, Lifebuoy];
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
                Manejar un negocio no debería requerir <em>15 herramientas distintas.</em>
              </h1>
              ) : (
              <h1 className="ll-staple-title">
                Running a business shouldn’t take <em>15 different tools.</em>
              </h1>
              )}
              {es ? (
              <p className="ll-staple-lede">
                La mayoría de los dueños entran a 10-15 plataformas cada día solo para las operaciones básicas.
                Creamos una mejor manera, y nos encargamos de cada paso para configurarte, capacitarte y hacerte crecer con ella.
              </p>
              ) : (
              <p className="ll-staple-lede">
                Most owners log into 10-15 platforms every day just to run basic operations. We built a
                better way, and we handle every step of getting you set up, trained and growing on it.
              </p>
              )}
              <div className="ll-staple-actions">
                <Button variant="primary" iconRight={<ArrowRight size={16} weight="bold" />} onClick={openBooking}>{es ? 'Agenda una llamada de estrategia gratis' : 'Book a free strategy call'}</Button>
              </div>
            </div>
            <div className="ll-staple-collapse ll-glass--dark" aria-label={es ? 'Muchas herramientas reemplazadas por una sola plataforma' : 'Many tools replaced by one platform'}>
              <ul>
                {(es ? TOOLS_ES : TOOLS).map((t) => <li key={t}>{t}</li>)}
              </ul>
              <div className="ll-staple-collapse-arrow" aria-hidden="true"><ArrowDown size={22} /></div>
              <div className="ll-staple-collapse-one">{es ? 'Una sola plataforma. Configurada por ti.' : 'One platform. Set up for you.'}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Principles ── */}
      <section className="ll-staple-wrap ll-staple-section">
        <div className="ll-staple-split">
          <div className="ll-staple-sticky">
            <span className="ll-eyebrow">{es ? 'Lo que creemos' : 'What we believe'}</span>
            {es ? <h2 className="ll-staple-h2">Cuatro principios detrás de <em>todo lo que creamos.</em></h2> : <h2 className="ll-staple-h2">Four principles behind <em>everything we build.</em></h2>}
          </div>
          <ol className="ll-staple-principles">
            {(es ? PRINCIPLES_ES : PRINCIPLES).map(([t, d], i) => (
              <li key={t} className={`ll-reveal${i === 1 ? ' ll-staple-tile--sage' : i === 2 ? ' ll-staple-tile--glass' : ''}`}>
                <span className="ll-staple-num" aria-hidden="true"><Icon i={i} /></span>
                <h3>{t}</h3>
                <p>{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Stat band ── */}
      <section className="ll-staple-wrap ll-staple-band">
        <div className="ll-staple-stats ll-sage">
          {(es ? STATS_ES : STATS).map(([v, l]) => (
            <div key={v}>
              <div className="ll-staple-stat-value">{v}</div>
              <div className="ll-staple-stat-label">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="ll-staple-wrap ll-staple-section">
        {es ? <h2 className="ll-staple-h2">Cinco pasos. <em>Hechos por ti, cada vez.</em></h2> : <h2 className="ll-staple-h2">Five steps. <em>Done for you, every time.</em></h2>}
        <p className="ll-staple-sub">{es ? 'Cada cliente pasa por el mismo proceso comprobado. Nunca tienes que resolverlo solo.' : 'Every client goes through the same proven process. You never have to figure it out alone.'}</p>
        <ol className="ll-staple-timeline">
          {(es ? STEPS_ES : STEPS).map(([t, d], i) => (
            <li key={i} className="ll-glass ll-reveal">
              <span className="ll-staple-node">{es ? 'Paso' : 'Step'} {i + 1}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ── Closing CTA ── */}
      <section className="ll-staple-wrap" style={{ paddingBottom: 96 }}>
        <div className="ll-staple-cta ll-forest">
          <img src="/team-photo.jpg" alt={es ? 'El equipo de Loogo Labs trabajando' : 'The Loogo Labs team at work'} />
          <div className="ll-staple-cta-body">
            <h2 className="ll-staple-h2">{es ? 'Nos mantenemos cerca de cada cliente.' : 'We stay close to every client.'}</h2>
            {es ? (
            <p>
              Mantenemos una lista de clientes selecta. Si tienes un negocio local, ofreces servicios o
              tienes una marca en línea y estás cansado del caos de herramientas, esta conversación vale 15 minutos.
              Te diremos exactamente lo que la plataforma puede hacer por ti, sin presentaciones de ventas.
            </p>
            ) : (
            <p>
              We keep our client list intentional. If you are a local business, service provider or
              online brand tired of the tool chaos, this conversation is worth 15 minutes. We will tell
              you exactly what the platform can do for you, no pitch deck required.
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
