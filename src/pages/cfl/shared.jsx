// Building blocks shared by the Central Florida hub (/grow) and its city pages
// (/grow/<city>). Kept together so every page in the set looks and reads alike.
import React from 'react';
import { ArrowRight, Plus } from '@phosphor-icons/react';
import { BOOKING_URL } from '../../lib/booking';
import { CITIES, CFL_BASE, cityPath } from '../../lib/cfl';
import { LangToggle, useLang } from '../../lib/i18n';

export const Wrap = ({ children, style }) => (
  <div className="cfl-wrap" style={style}>{children}</div>
);

export const Eyebrow = ({ children }) => <div className="cfl-eyebrow">{children}</div>;

export const H2 = ({ children, small, style }) => (
  <h2 className={`cfl-h2${small ? ' cfl-h2--sm' : ''}`} style={style}>{children}</h2>
);

/** Visible-copy tidy for shared city data: the same strings feed meta tags, so
    the data stays as written and only the rendered body text loses its dashes. */
export const tidy = (s) => s.replace(/(\d)\s*[–—]\s*(\d)/g, '$1-$2').replace(/\s*[—–]\s*/g, ', ');

const trackSchedule = () => { if (window.fbq) window.fbq('track', 'Schedule'); };

export const BookBtn = ({ size = 'md', label, variant = 'light' }) => {
  const es = useLang() === 'es';
  return (
  <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" onClick={trackSchedule}
    className={`cfl-btn cfl-btn--${variant === 'light' ? 'light' : 'dark'}${size === 'lg' ? ' cfl-btn--lg' : ''}`}>
    <span>{label || (es ? 'Agenda una llamada de estrategia gratis' : 'Book a free strategy call')}</span>
    <span className="cfl-btn__icon" aria-hidden="true"><ArrowRight size={size === 'lg' ? 18 : 16} weight="bold" /></span>
  </a>
  );
};

/** Floating glass header pill shared by every Central Florida / city page. */
export const TopBanner = ({ crumb }) => {
  const es = useLang() === 'es';
  return (
  <div className="ll-nav cfl-nav">
    <div className="ll-nav__bar ll-glass--dark cfl-nav__bar">
      <a href="/" className="cfl-nav__brand">
        <span className="cfl-nav__logo"><img src="/logo.png" alt="" /></span>
        <span className="cfl-nav__brand-text">Loogo Labs</span>
      </a>
      {crumb && <a href={crumb.href} className="cfl-nav__crumb">{crumb.label}</a>}
      <span className="cfl-nav__spacer" />
      <LangToggle />
      <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" onClick={trackSchedule} className="cfl-btn cfl-btn--light">
        {es
          ? <span>Agenda <span className="cfl-nav__long">una llamada </span>gratis</span>
          : <span>Book a free <span className="cfl-nav__long">strategy </span>call</span>}
        <span className="cfl-btn__icon" aria-hidden="true"><ArrowRight size={16} weight="bold" /></span>
      </a>
    </div>
  </div>
  );
};

/** The floating glass bar listing every city page. */
export const CityRail = ({ active }) => {
  const es = useLang() === 'es';
  return (
  <nav className="cfl-rail" aria-label={es ? 'Ciudades de la Florida Central' : 'Central Florida cities'}>
    <div className="cfl-rail__title">{es ? 'Florida Central' : 'Central Florida'}</div>
    <ul className="cfl-rail__list">
      <li>
        <a className="cfl-rail__link" href={CFL_BASE} aria-current={active ? undefined : 'page'}>
          {es ? 'Toda la Florida Central' : 'All of Central FL'} <small>HUB</small>
        </a>
      </li>
      {CITIES.map((c) => (
        <li key={c.slug}>
          <a className="cfl-rail__link" href={cityPath(c.slug)} aria-current={active === c.slug ? 'page' : undefined}>
            {c.name} <small>{c.county.replace(' County', '').slice(0, 3).toUpperCase()}</small>
          </a>
        </li>
      ))}
    </ul>
    <a className="cfl-rail__cta" href={BOOKING_URL} target="_blank" rel="noopener noreferrer" onClick={trackSchedule}>
      {es ? 'Llamada de estrategia gratis' : 'Free strategy call'}
    </a>
  </nav>
  );
};

// Approximate city-center coordinates, projected onto the hero map. Not a
// survey-grade map — just enough to put each pin in the right part of the region.
const COORDS = {
  celebration: [28.318, -81.541], kissimmee: [28.292, -81.408], orlando: [28.538, -81.379],
  'st-cloud': [28.249, -81.281], 'winter-garden': [28.565, -81.586], clermont: [28.549, -81.773],
  'winter-park': [28.6, -81.339], 'lake-mary': [28.759, -81.318], sanford: [28.8, -81.273],
  'altamonte-springs': [28.661, -81.366], oviedo: [28.67, -81.208], apopka: [28.676, -81.512],
};
const BOUNDS = { latMin: 28.18, latMax: 28.86, lonMin: -81.84, lonMax: -81.02 };
// Labels that would collide with a neighbour's sit under the pin instead.
const BELOW_LABEL = new Set(['altamonte-springs']);
const W = 520;
const H = 500;
const project = ([lat, lon]) => [
  ((lon - BOUNDS.lonMin) / (BOUNDS.lonMax - BOUNDS.lonMin)) * W,
  ((BOUNDS.latMax - lat) / (BOUNDS.latMax - BOUNDS.latMin)) * H,
];

/** Stylised pin map of the service area; each pin links to its city page. */
export const CflMap = ({ active }) => (
  <div className="cfl-mapbox">
    <svg className="cfl-map" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Map of the Central Florida cities we serve"
      style={{ width: '100%', height: 'auto', display: 'block' }}>
      <defs>
        <pattern id="cfl-dots" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.2" fill="rgba(245,242,235,0.14)" />
        </pattern>
        <radialGradient id="cfl-glow">
          <stop offset="0%" stopColor="rgba(134,164,92,0.55)" />
          <stop offset="100%" stopColor="rgba(134,164,92,0)" />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill="url(#cfl-dots)" rx="10" />
      {/* I-4 and the Turnpike, roughly, as orientation lines */}
      <polyline points={[[28.8, -81.27], [28.66, -81.37], [28.54, -81.38], [28.42, -81.47], [28.3, -81.62]].map((p) => project(p).join(',')).join(' ')}
        fill="none" stroke="rgba(245,242,235,0.22)" strokeWidth="2" strokeDasharray="6 6" />
      <text x={project([28.47, -81.43])[0] + 8} y={project([28.47, -81.43])[1]} fill="rgba(245,242,235,0.35)"
        fontFamily="var(--font-mono)" fontSize="10" letterSpacing="1.5">I-4</text>
      {CITIES.map((c) => {
        const [x, y] = project(COORDS[c.slug]);
        const on = active === c.slug;
        return (
          <a key={c.slug} href={cityPath(c.slug)} aria-label={`${c.name}, FL`}>
            {on && <circle cx={x} cy={y} r="40" fill="url(#cfl-glow)" />}
            <circle className="cfl-map-pin" cx={x} cy={y} r={on ? 8 : 6}
              fill={on ? 'var(--ink-300)' : 'var(--paper-000)'} stroke="var(--ink-900)" strokeWidth="2" />
            <text x={BELOW_LABEL.has(c.slug) ? x : x + 12} y={BELOW_LABEL.has(c.slug) ? y + 22 : y + 4} textAnchor={BELOW_LABEL.has(c.slug) ? 'middle' : 'start'} fill={on ? 'var(--ink-300)' : 'rgba(245,242,235,0.85)'}
              fontFamily="var(--font-body)" fontSize={on ? 15 : 13} fontWeight={on ? 700 : 500}>{c.name}</text>
          </a>
        );
      })}
    </svg>
  </div>
);

export const SERVICES = [
  { title: 'Local SEO & Maps', desc: 'Rank in the map pack for the cities and neighborhoods you serve.', items: ['Google Business Profile', 'City pages', 'Citations'] },
  { title: 'Instant lead follow-up', desc: 'Every call, form, and message gets a reply in seconds.', items: ['Missed-call text-back', 'SMS & email', 'English & Spanish'] },
  { title: 'Review generation', desc: 'An automatic review request after every job.', items: ['Auto requests', 'Alerts', 'Reply templates'] },
  { title: 'Email & SMS campaigns', desc: 'Seasonal Florida campaigns that bring past customers back.', items: ['Done for you', 'Segmented lists'] },
  { title: 'Booking & CRM', desc: 'Every lead in one pipeline, with online booking and reminders.', items: ['Pipeline', 'Calendar', 'Mobile app'] },
  { title: 'Revenue reporting', desc: 'See which searches and campaigns turned into booked jobs.', items: ['Lead sources', 'Monthly call'] },
];

export const SERVICES_ES = [
  { title: 'SEO local y Google Maps', desc: 'Aparece en el mapa de Google en las ciudades y vecindarios que atiendes.', items: ['Perfil de Empresa en Google', 'Páginas por ciudad', 'Directorios'] },
  { title: 'Seguimiento instantáneo', desc: 'Cada llamada, formulario y mensaje recibe respuesta en segundos.', items: ['Texto por llamada perdida', 'SMS y email', 'Inglés y español'] },
  { title: 'Generación de reseñas', desc: 'Una solicitud de reseña automática después de cada trabajo.', items: ['Solicitudes automáticas', 'Alertas', 'Plantillas de respuesta'] },
  { title: 'Campañas por email y SMS', desc: 'Campañas de temporada en Florida que traen de vuelta a tus clientes.', items: ['Hechas por nosotros', 'Listas segmentadas'] },
  { title: 'Reservas y CRM', desc: 'Todos tus clientes en un solo embudo, con reservas en línea y recordatorios.', items: ['Embudo de ventas', 'Calendario', 'App móvil'] },
  { title: 'Reportes de ingresos', desc: 'Mira qué búsquedas y campañas se convirtieron en trabajos agendados.', items: ['Origen de clientes', 'Llamada mensual'] },
];

export const Services = ({ cityName }) => {
  const es = useLang() === 'es';
  return (
  <section className="cfl-wrap">
    <div className="cfl-panel ll-sage">
      <div className="cfl-head">
        <div>
          <Eyebrow>{es ? 'Lo que hacemos' : 'What we do'}{cityName ? (es ? ` en ${cityName}` : ` in ${cityName}`) : ''}</Eyebrow>
          <H2>{es ? 'Que te encuentren. Gánate el trabajo.' : 'Get found. Get the job.'}</H2>
        </div>
      </div>
      <div className="cfl-services">
        {(es ? SERVICES_ES : SERVICES).map(({ title, desc, items }) => (
          <div key={title} className="cfl-service">
            <h3 className="cfl-service__title">{title}</h3>
            <p className="cfl-service__desc">{desc}</p>
            <div className="cfl-service__tags">{items.map((it) => <span key={it}>{it}</span>)}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
  );
};

const STEPS = [
  ['Strategy call', 'We review your Google profile, local rankings, and how fast leads hear back today.', '30 min'],
  ['Build', 'Profile, city pages, follow-up, reviews, and booking, set up for your service area.', 'Week 1'],
  ['Launch & test', 'Test leads run end-to-end so every message, alert, and booking is confirmed.', 'Week 2'],
  ['Manage & grow', 'A monthly report and call. We tune pages, campaigns, and sequences on results.', 'Ongoing'],
];

const STEPS_ES = [
  ['Llamada de estrategia', 'Revisamos tu perfil de Google, tu posición local y qué tan rápido reciben respuesta tus clientes hoy.', '30 min'],
  ['Construcción', 'Perfil, páginas por ciudad, seguimiento, reseñas y reservas, configurados para tu área de servicio.', 'Semana 1'],
  ['Lanzamiento y prueba', 'Probamos contactos de principio a fin para confirmar cada mensaje, alerta y reserva.', 'Semana 2'],
  ['Gestión y crecimiento', 'Un reporte y una llamada cada mes. Ajustamos páginas, campañas y secuencias según los resultados.', 'Continuo'],
];

/** Four-step timeline; `children` render under it (e.g. the nearby-cities strip). */
export const Steps = ({ steps }) => (
  <ol className="cfl-steps">
    {steps.map(([title, desc, when], i) => (
      <li key={title} className="cfl-step">
        <div className="cfl-step__mark">
          <span className="cfl-step__dot">{i + 1}</span>
          <span className="cfl-step__when">{when}</span>
        </div>
        <div className="cfl-step__title">{title}</div>
        <p className="cfl-step__desc">{desc}</p>
      </li>
    ))}
  </ol>
);

export const Process = ({ children }) => {
  const es = useLang() === 'es';
  return (
  <section className="cfl-wrap">
    <div className="cfl-panel cfl-panel--paper">
      <div className="cfl-head">
        <H2 small>{es ? 'En vivo en unas dos semanas.' : 'Live in about two weeks.'}</H2>
        <p className="cfl-lede">{es ? 'Y luego administrado cada mes: sin traspasos, sin hacerlo tú mismo.' : 'Then managed every month: no hand-off, no DIY.'}</p>
      </div>
      <Steps steps={es ? STEPS_ES : STEPS} />
      {children}
    </div>
  </section>
  );
};

export const Faq = ({ items }) => {
  const [open, setOpen] = React.useState(0);
  const es = useLang() === 'es';
  return (
    <section className="cfl-wrap">
      <div className="cfl-panel cfl-panel--bare cfl-faq">
        <div>
          <Eyebrow>{es ? 'Preguntas frecuentes' : 'FAQ'}</Eyebrow>
          <H2>{es ? 'Preguntas comunes.' : 'Common questions.'}</H2>
        </div>
        <div className="cfl-faq__list">
          {items.map(([q, a], i) => (
            <div key={q} className="cfl-faq__item">
              <button className="cfl-faq__q" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}>
                <span>{q}</span>
                <span className="cfl-faq__toggle" aria-hidden="true"><Plus size={16} weight="bold" /></span>
              </button>
              {/* Kept in the DOM when closed so the answer text (which FAQPage
                  schema repeats) is always in the rendered markup. */}
              <div className="cfl-faq__a" hidden={open !== i}>{a}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/** Closing forest panel; `children` replace the default copy (AI Voice pages). */
export const CtaPanel = ({ eyebrow, title, body, fine }) => {
  const es = useLang() === 'es';
  return (
  <section className="cfl-wrap">
    <div className="cfl-panel ll-forest cfl-panel--center" style={{ paddingTop: 'clamp(56px,8vw,104px)', paddingBottom: 'clamp(56px,8vw,104px)' }}>
      <Eyebrow>{eyebrow || (es ? 'Gratis · 30 minutos · Sin compromiso' : 'Free · 30 minutes · No obligation')}</Eyebrow>
      <H2>{title}</H2>
      <p className="cfl-lede">{body}</p>
      <div className="cfl-actions"><BookBtn size="lg" label={es ? 'Agendar mi llamada de estrategia gratis' : 'Book my free strategy call'} /></div>
      {fine && <div className="cfl-fine">{fine}</div>}
    </div>
  </section>
  );
};

export const FinalCta = ({ cityName }) => {
  const es = useLang() === 'es';
  if (es) return (
    <CtaPanel
      title={<>{cityName ? `Descubre dónde los clientes de ${cityName} están encontrando a tu competencia` : 'Descubre dónde tu negocio está perdiendo clientes locales'}, y cómo arreglarlo.</>}
      body={<>En la llamada revisamos tu perfil de Google y tu posición local{cityName ? ` en ${cityName}` : ''}, medimos qué tan rápido recibe respuesta un nuevo cliente y te mostramos exactamente lo que construiríamos.</>}
      fine="Recomendado 3 meses · Mes a mes disponible"
    />
  );
  return (
  <CtaPanel
    title={<>See where {cityName || 'your business'} {cityName ? 'customers are finding your competitors' : 'is losing local customers'} — and how to fix it.</>}
    body={<>On the call we pull up your Google profile and local rankings{cityName ? ` in ${cityName}` : ''}, check how fast a new lead hears back, and map out exactly what we would build.</>}
    fine="3-month recommended · Month-to-month available"
  />
  );
};

/** Page shell: ambient background, glass header, optional city rail. */
export const Shell = ({ rail, active, crumb, children }) => (
  <main className={`ll-shell cfl${rail ? ' cfl--rail' : ''}`}>
    <TopBanner crumb={crumb} />
    {rail && <CityRail active={active} />}
    <div className="cfl-page">{children}</div>
  </main>
);
