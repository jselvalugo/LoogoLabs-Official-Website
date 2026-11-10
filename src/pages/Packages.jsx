import React, { useState } from 'react';
import Button from '../components/core/Button';
import BrandingPricingCard from '../components/surfaces/BrandingPricingCard';
import { pathForPage } from '../lib/seo';
import { openBooking } from '../lib/booking';
import { SERVICE_PACKAGES } from '../lib/servicePackages';
import { PARTNER_PROGRAMS } from './BrandPartners';
import { SERVICE_PACKAGES_ES } from '../lib/servicePackages.es';
import { useHref, useLang, localizePath } from '../lib/i18n';
import { ArrowRight, Check, Plus, Minus } from '@phosphor-icons/react';
import '../styles/pages/packages.css';


// Software plans (SaaS). Each tier includes everything in the tier before it.
const PRIMARY_PACKAGES = [
  {
    name: 'Launch',
    tagline: 'Get found, answer every lead, collect reviews.',
    ideal: 'Local service businesses getting started',
    monthly: '$147',
    setup: '$297 setup',
    term: 'Month-to-month · live in 14 days',
    features: [
      'CRM, pipelines & unified inbox',
      'Missed-call text-back & business phone',
      'Website & funnels',
      'Online booking with reminders',
      'Automated review requests',
      'Invoices & text-to-pay',
      'Performance dashboard',
    ],
  },
  {
    name: 'Growth',
    featured: true,
    tagline: 'Full marketing automation with AI follow-up.',
    ideal: 'Established businesses ready to automate',
    monthly: '$297',
    setup: '$497 setup',
    term: '6-month term · live in 30 days',
    includesPrev: 'Everything in Launch, plus',
    features: [
      'Email & SMS marketing campaigns',
      'Conversation AI',
      'Social planner & Content AI',
      'Call tracking & attribution reporting',
      'Client portal, surveys & blog',
      'Subscriptions & e-sign contracts',
    ],
  },
  {
    name: 'Scale',
    tagline: 'The full platform, plus a monthly consulting call on the software itself.',
    ideal: 'Multi-location or high-ticket businesses',
    monthly: '$597',
    setup: '$997 setup',
    term: '12-month term · live in 45 days',
    includesPrev: 'Everything in Growth, plus',
    features: [
      'Monthly consulting call on using the software',
      '24/7 Voice AI receptionist',
      'Courses, memberships & communities',
      'E-commerce & webinars',
      'Power dialer & prospecting',
      'WhatsApp & affiliate program',
      'Custom AI agents & workflow AI',
    ],
  },
];

// Done-for-you retainers: services our team runs every month.
const RETAINERS = [
  {
    name: 'Essentials',
    tagline: 'A steady marketing presence, planned and posted for you.',
    ideal: 'Owners who need to show up consistently',
    monthly: '$750',
    setup: 'Monthly service',
    term: 'Billed monthly',
    features: [
      'Monthly strategy session',
      '8–12 posts a month',
      'Monthly report in plain English',
      'Google Business Profile Makeover at onboarding',
      'Monthly Google Business Profile posts',
    ],
  },
  {
    name: 'Growth Retainer',
    featured: true,
    tagline: 'Content, ads and local search working together.',
    ideal: 'Businesses ready to invest in paid growth',
    monthly: '$1,500',
    setup: 'Monthly service',
    term: 'Billed monthly',
    includesPrev: 'Everything in Essentials, plus',
    features: [
      'Ads management (up to $2K/mo ad spend)',
      'Monthly email newsletter',
      'Ongoing Local SEO: citations, reviews and on-page fixes',
    ],
  },
  {
    name: 'Fractional CMO',
    limited: true,
    tagline: 'A senior marketing lead for your business, without the full-time hire.',
    ideal: 'Teams that need someone to own marketing',
    monthly: '$2,500+',
    setup: '3-month minimum',
    term: 'One client at a time',
    includesPrev: 'Everything in Growth Retainer, plus',
    features: [
      'Weekly 45-minute strategy call',
      'Quarterly growth plan: goals, budget by channel and a 90-day roadmap',
      'We run every channel: social, ads, email, SEO and website',
      'Ads management up to $5K/mo ad spend (20% above)',
      'One major campaign or launch each quarter',
      'Management of your freelancers, vendors or marketing staff',
      'CRM and automation oversight',
      'Monthly leadership report and KPI dashboard',
      'Direct text or Slack access, replies within one business day',
      '$2,500 one location · $3,000 all channels, $2K–$5K ad spend · $3,500 multi-location',
    ],
  },
];

// One-time projects, keyed by id. Entries with a `page` link to that
// service's own detail page; the rest open the booking modal.
const SERVICES = {
  WebDesign: {
    title: 'Website',
    price: '$499–$3,000',
    unit: ' one-time',
    description: 'A fast, mobile-first website built to turn visitors into calls and bookings, with on-page SEO set up from day one.',
  },
  Automation: {
    title: 'Automation build',
    price: '$750–$2,500',
    unit: ' one-time',
    description: 'Follow-up, booking, intake and reporting workflows built in your CRM, so leads get answered and tasks run without you.',
  },
  Branding: {
    title: 'Branding',
    price: '$1,000–$3,500',
    unit: '',
    description: 'Logo, visual identity and brand guidelines your website, content and ads can all build on.',
  },
  PressRelease: {
    page: 'PressRelease',
    title: 'Press Release Distribution',
    from: '$199',
    description: 'Your announcement on 350+ news sites and Google News: written, distributed, and reported.',
  },
  Consulting: {
    title: 'IT & automation consulting',
    price: '$100–$150',
    unit: '/hr',
    kind: 'Hourly',
    description: 'Hands-on help with your systems, integrations and automation, billed by the hour.',
  },
  ...Object.fromEntries(SERVICE_PACKAGES.filter((p) => p.page !== 'GBPMakeover').map((p) => [p.page, { page: p.page, title: p.cardTitle, from: p.from, description: p.cardDescription }])),
};

// The order one-time projects appear in.
const PROJECTS = ['CityPages', 'PressRelease', 'ReviewKickstart', 'WebDesign', 'Automation', 'Branding', 'Consulting'];

// Spanish display copy, parallel to the arrays above (same order).
const PRIMARY_PACKAGES_ES = [
  {
    tagline: 'Haz que te encuentren, responde a cada cliente y consigue reseñas.',
    ideal: 'Negocios de servicios locales que van empezando',
    setup: '$297 de instalación',
    term: 'Mes a mes · listo en 14 días',
    features: [
      'CRM, embudos de venta y bandeja unificada',
      'Mensaje automático por llamada perdida y teléfono de negocio',
      'Sitio web y embudos',
      'Reservas en línea con recordatorios',
      'Solicitudes de reseñas automáticas',
      'Facturas y pago por mensaje de texto',
      'Panel de resultados',
    ],
  },
  {
    tagline: 'Automatización de marketing completa con seguimiento por IA.',
    ideal: 'Negocios establecidos listos para automatizar',
    setup: '$497 de instalación',
    term: 'Contrato de 6 meses · listo en 30 días',
    includesPrev: 'Todo lo de Launch, más',
    features: [
      'Campañas de marketing por correo y SMS',
      'Conversation AI',
      'Planificador de redes sociales y Content AI',
      'Seguimiento de llamadas y reportes de atribución',
      'Portal de clientes, encuestas y blog',
      'Suscripciones y contratos con firma electrónica',
    ],
  },
  {
    tagline: 'La plataforma completa, más una llamada mensual de consultoría sobre el software.',
    ideal: 'Negocios con varias sedes o de alto valor',
    setup: '$997 de instalación',
    term: 'Contrato de 12 meses · listo en 45 días',
    includesPrev: 'Todo lo de Growth, más',
    features: [
      'Llamada mensual de consultoría sobre cómo usar el software',
      'Recepcionista de voz con IA 24/7',
      'Cursos, membresías y comunidades',
      'Tienda en línea y webinars',
      'Marcador automático y prospección',
      'WhatsApp y programa de afiliados',
      'Agentes de IA a la medida y flujos con IA',
    ],
  },
];

const RETAINERS_ES = [
  {
    tagline: 'Presencia constante en marketing, planeada y publicada por nosotros.',
    ideal: 'Dueños que necesitan aparecer con constancia',
    setup: 'Servicio mensual',
    term: 'Cobro mensual',
    features: [
      'Sesión mensual de estrategia',
      '8–12 publicaciones al mes',
      'Reporte mensual en palabras simples',
      'Renovación del Perfil de Empresa en Google al iniciar',
      'Publicaciones mensuales en tu Perfil de Google',
    ],
  },
  {
    tagline: 'Contenido, anuncios y búsqueda local trabajando juntos.',
    ideal: 'Negocios listos para invertir en crecimiento pagado',
    setup: 'Servicio mensual',
    term: 'Cobro mensual',
    includesPrev: 'Todo lo de Essentials, más',
    features: [
      'Manejo de anuncios (hasta $2K/mes de inversión)',
      'Boletín mensual por correo',
      'SEO local continuo: directorios, reseñas y ajustes en la página',
    ],
  },
  {
    tagline: 'Un líder de marketing para tu negocio, sin contratar a tiempo completo.',
    ideal: 'Equipos que necesitan a alguien a cargo del marketing',
    setup: 'Mínimo 3 meses',
    term: 'Un cliente a la vez',
    includesPrev: 'Todo lo de Growth Retainer, más',
    features: [
      'Llamada semanal de estrategia de 45 minutos',
      'Plan trimestral: metas, presupuesto por canal y ruta de 90 días',
      'Manejamos todos los canales: redes, anuncios, correo, SEO y sitio web',
      'Manejo de anuncios hasta $5K/mes de inversión (20% arriba de eso)',
      'Una campaña o lanzamiento principal cada trimestre',
      'Gestión de tus freelancers, proveedores o equipo de marketing',
      'Supervisión de CRM y automatizaciones',
      'Reporte mensual para dirección y panel de indicadores',
      'Acceso directo por texto o Slack, respuesta en un día hábil',
      '$2,500 una sede · $3,000 todos los canales, $2K–$5K de inversión · $3,500 varias sedes',
    ],
  },
];

const SERVICES_ES = {
  WebDesign: {
    title: 'Sitio web',
    unit: ' pago único',
    description: 'Un sitio web rápido y pensado para el celular, hecho para convertir visitas en llamadas y reservas, con SEO en la página desde el primer día.',
  },
  Automation: {
    title: 'Automatización a la medida',
    unit: ' pago único',
    description: 'Flujos de seguimiento, citas, registro y reportes en tu CRM, para que cada prospecto reciba respuesta y las tareas corran sin ti.',
  },
  Branding: {
    title: 'Branding',
    unit: '',
    description: 'Logotipo, identidad visual y guía de marca en la que se apoyan tu sitio, tu contenido y tus anuncios.',
  },
  PressRelease: {
    title: 'Distribución de comunicados de prensa',
    from: '$199',
    description: 'Tu anuncio en más de 350 sitios de noticias y Google News: redactado, distribuido y con reporte.',
  },
  Consulting: {
    title: 'Consultoría en TI y automatización',
    unit: '/hora',
    kind: 'Por hora',
    description: 'Ayuda práctica con tus sistemas, integraciones y automatizaciones, cobrada por hora.',
  },
  ...Object.fromEntries(Object.entries(SERVICE_PACKAGES_ES).map(([page, p]) => [page, { title: p.cardTitle, from: p.from, description: p.cardDescription }])),
};

const Arrow = <ArrowRight size={16} weight="bold" />;

const FAQ = [
  ['How much does it cost?', 'Start with the free Game Plan call. Done-for-you retainers are $750/mo (Essentials), $1,500/mo (Growth Retainer) and $2,500–$3,500/mo (Fractional CMO). Ads management on its own is a $500/mo minimum, or 20% of ad spend above $2K/mo. Our marketing software (SaaS) starts at $147/mo, and one-time projects start at $97. You get a clear quote before anything starts.'],
  ['I’m not sure what I need. Where do I start?', 'Start with the free Game Plan call. We look at your business and tell you honestly what to fix first, even if the answer is something you can do yourself. If you want a deeper plan, the Strategy Sprint is $750–$1,500, credited to your first month if you sign a retainer.'],
  ['What is the difference between a retainer and a software plan?', 'Retainers are services: our team does the work every month. Launch, Growth and Scale are software plans (SaaS): our all-in-one platform, set up for you to use. Many clients use both.'],
  ['Do I have to do the work?', 'Not on a retainer. We make the content, run the ads and build the systems. We need some time from you at the start to learn your business, then quick approvals along the way.'],
  ['How soon will I see results?', 'Fixes like automatic follow-up can help within weeks. Content and ads usually take a few months of testing to find what works. We will not promise numbers we cannot control.'],
  ['Do you only work with Orlando businesses?', 'No. We are based in Orlando, Florida and work with businesses across the United States, in English and Spanish.'],
];
const FAQ_ES = [
  ['¿Cuánto cuesta?', 'Empieza con la llamada gratis del Plan. Los servicios mensuales cuestan $750/mes (Essentials), $1,500/mes (Growth Retainer) y $2,500–$3,500/mes (CMO fraccional). Solo el manejo de anuncios tiene un mínimo de $500/mes, o 20% de la inversión arriba de $2K/mes. Nuestro software de marketing (SaaS) empieza en $147/mes y los proyectos únicos desde $97. Recibes una cotización clara antes de empezar.'],
  ['No sé qué necesito. ¿Por dónde empiezo?', 'Empieza con la llamada gratis. Revisamos tu negocio y te decimos con honestidad qué arreglar primero, aunque sea algo que puedas hacer tú mismo. Si quieres un plan más profundo, el Strategy Sprint cuesta $750–$1,500 y se acredita a tu primer mes si contratas un servicio mensual.'],
  ['¿Cuál es la diferencia entre un servicio mensual y un plan de software?', 'Los servicios mensuales los hace nuestro equipo cada mes. Launch, Growth y Scale son planes de software (SaaS): nuestra plataforma todo en uno, configurada para que la uses. Muchos clientes usan ambos.'],
  ['¿Tengo que hacer el trabajo yo?', 'No con un servicio mensual. Nosotros hacemos el contenido, manejamos los anuncios y montamos los sistemas. Necesitamos algo de tu tiempo al inicio para conocer tu negocio y aprobaciones rápidas en el camino.'],
  ['¿Cuándo veré resultados?', 'Cosas como el seguimiento automático pueden ayudar en semanas. El contenido y los anuncios suelen tomar unos meses de pruebas para encontrar lo que funciona. No prometemos números que no controlamos.'],
  ['¿Solo trabajan con negocios de Orlando?', 'No. Estamos en Orlando, Florida y trabajamos con negocios en todo Estados Unidos, en inglés y en español.'],
];

function PackageCard({ pkg, es, esPkg, service }) {
  // On phones the feature list starts collapsed so all three packages fit on a
  // couple of screens; desktop always shows it (see .pk-features in packages.css).
  const [open, setOpen] = useState(false);
  const dark = !!pkg.featured;
  const t = es ? { ...pkg, ...esPkg } : pkg;
  return (
    <div className={`pk-card ${dark ? 'pk-card--dark ll-forest pk-dark' : 'pk-card--paper'}${open ? ' is-open' : ''}`}>
      <span className="pk-tag pk-kind">{service ? (es ? 'Servicio · hecho por nuestro equipo' : 'Service · done for you') : (es ? 'Plan de software · SaaS' : 'Software plan · SaaS')}</span>
      <div className="pk-card__top">
        <h2>{pkg.name}</h2>
        {pkg.featured && <span className="pk-pop">{es ? 'Más popular' : 'Most popular'}</span>}
        {pkg.limited && <span className="pk-pop pk-pop--light">{es ? 'Un cliente a la vez' : 'One client at a time'}</span>}
      </div>
      <p>{t.tagline}</p>
      <div>
        <div className="pk-price-row">
          <span className="pk-price">{pkg.monthly}</span>
          <span className="pk-per">{es ? '/mes' : '/mo'}</span>
        </div>
        <span className="pk-tag">{t.setup} · {t.term}</span>
      </div>
      <div className="pk-ideal"><strong>{es ? 'Ideal para:' : 'Best for:'}</strong> {t.ideal}</div>
      <button type="button" className="pk-toggle" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        {es
          ? (open ? 'Ocultar detalles' : `Ver qué incluye (${pkg.features.length})`)
          : (open ? 'Hide details' : `See what's included (${pkg.features.length})`)}
        <span className="pk-toggle__icon" aria-hidden="true">{open ? <Minus size={14} weight="bold" /> : <Plus size={14} weight="bold" />}</span>
      </button>
      <div className="pk-features">
        {pkg.includesPrev && <div className="pk-features__prev">{t.includesPrev}</div>}
        <ul className="pk-list">
          {pkg.features.map((f, i) => (
            <li key={f}><Check className="pk-check" size={16} weight="bold" aria-hidden="true" />{t.features[i]}</li>
          ))}
        </ul>
      </div>
      <Button variant={dark ? 'primary' : 'inverse'} size="lg" fullWidth onClick={openBooking} iconRight={Arrow}>
        {es ? 'Agendar una llamada' : 'Book a call'}
      </Button>
    </div>
  );
}

function ServiceCard({ id, es, onNavigate }) {
  const toHref = useHref();
  const s = es ? { ...SERVICES[id], ...SERVICES_ES[id] } : SERVICES[id];
  const kind = s.page ? (es ? 'Pago único · precio fijo' : 'One-off · fixed price') : s.kind ? s.kind : (es ? 'Proyecto único' : 'One-time project');
  return (
    <div className="pk-service ll-glass">
      <span className="pk-tag" style={{ fontSize: 10 }}>{kind}</span>
      <h3 className="pk-service-title">
        {s.page ? <a href={toHref(pathForPage(s.page))} onClick={(e) => { e.preventDefault(); onNavigate(s.page); }}>{s.title}</a> : s.title}
      </h3>
      <div className="pk-price-row" style={{ gap: 4 }}>
        {s.page ? <span className="pk-service-price pk-service-price--from">{s.from}</span> : <>
          <span className="pk-service-price">{s.price}</span>
          <span className="pk-per">{s.unit}</span>
        </>}
      </div>
      <p className="pk-service-desc">{s.description}</p>
      {s.page ? (
        <Button variant="secondary" size="md" fullWidth iconRight={Arrow}
          onClick={(e) => { e.preventDefault(); onNavigate(s.page); }}>
          {es ? 'Ver detalles' : 'See details'}
        </Button>
      ) : (
        <Button variant="secondary" size="md" fullWidth onClick={openBooking} iconRight={Arrow}>{es ? 'Pedir cotización' : 'Get a quote'}</Button>
      )}
    </div>
  );
}

function Packages({ onNavigate }) {
  const es = useLang() === 'es';
  return (
    <main className="pk-page">
      <div className="pk-ambient" aria-hidden="true"><i /><i /><i /><i /><i /></div>
      <section className="pk-wrap pk-hero">
        {es ? (
          <>
            <h1 className="pk-title">Estrategia primero. <em>Luego nuestro equipo, nuestro software, o ambos.</em></h1>
            <p className="pk-lede">
              Empieza con un Plan de Marketing gratis. Los servicios mensuales los hace nuestro equipo cada mes.
              Launch, Growth y Scale son planes de software (SaaS). Los proyectos únicos tienen precio fijo.
            </p>
          </>
        ) : (
          <>
            <h1 className="pk-title">Strategy first. <em>Then our team, our software, or both.</em></h1>
            <p className="pk-lede">
              Start with a free Marketing Game Plan. Retainers are services our team runs every month.
              Launch, Growth and Scale are software plans (SaaS). One-time projects are fixed-price.
            </p>
          </>
        )}
      </section>

      <div className="pk-wrap pk-section" style={{ paddingBottom: 96 }}>
        <div className="pk-diy ll-sage ll-bezel">
          <div>
            {es ? (
              <>
                <span className="pk-tag">Plan de Marketing gratis · Strategy Sprint $750–$1,500</span>
                <h2>Empieza con estrategia.</h2>
                <p>
                  La llamada gratis te da un plan de 90 días. ¿Quieres más profundidad? El Strategy Sprint incluye auditoría, posicionamiento,
                  plan de canales y revisión de tu Perfil de Google, y se acredita a tu primer mes si contratas un servicio mensual.
                </p>
              </>
            ) : (
              <>
                <span className="pk-tag">Free Marketing Game Plan · Strategy Sprint $750–$1,500</span>
                <h2>Start with strategy.</h2>
                <p>
                  The free call gets you a 90-day plan. Want more depth? The Strategy Sprint covers an audit, positioning, a channel plan
                  and a Google Business Profile audit, and it is credited to your first month when you sign a retainer.
                </p>
              </>
            )}
          </div>
          <Button variant="inverse" size="lg" onClick={openBooking} iconRight={Arrow}>{es ? 'Agenda tu plan gratis' : 'Book your free Game Plan'}</Button>
        </div>

        <div className="pk-head pk-services-head">
          <h2 className="pk-h2">{es ? <>Servicios mensuales, <em>hechos por nuestro equipo.</em></> : <>Retainers, <em>done by our team.</em></>}</h2>
          <p>{es ? 'Planeamos, creamos y manejamos tu marketing cada mes. Cada nivel incluye todo lo del anterior.' : 'We plan, make and run your marketing every month. Each level includes everything in the one before it.'}</p>
        </div>
        <div className="pk-grid">
          {RETAINERS.map((p, i) => <PackageCard key={p.name} pkg={p} es={es} esPkg={RETAINERS_ES[i]} service />)}
        </div>
        <ul className="pk-notes">
          <li>{es ? 'Solo manejo de anuncios: $500/mes mínimo, o 20% de la inversión arriba de $2K/mes.' : 'Ads management on its own: $500/mo minimum, or 20% of ad spend above $2K/mo.'}</li>
          <li>{es ? 'CMO fraccional: trabajamos con un solo cliente a la vez para dar atención completa.' : 'Fractional CMO: we take on one client at a time so each one gets our full attention.'}</li>
        </ul>

        <div className="pk-head pk-services-head">
          <h2 className="pk-h2">{es ? <>Planes de software, <em>configurados para ti.</em></> : <>Software plans, <em>set up for you.</em></>}</h2>
          <p>{es ? 'Suscripciones mensuales a la plataforma de marketing de Loogo Labs: CRM, automatización e IA en un solo lugar. Nosotros la configuramos; Scale incluye una llamada mensual de consultoría sobre cómo usarla.' : 'Monthly subscriptions to the Loogo Labs marketing platform: CRM, automation and AI in one place. We set it up for you, and Scale includes a monthly consulting call on how to use it.'}</p>
        </div>
        <div className="pk-grid">
          {PRIMARY_PACKAGES.map((p, i) => <PackageCard key={p.name} pkg={p} es={es} esPkg={PRIMARY_PACKAGES_ES[i]} />)}
        </div>
        <div className="pk-diy ll-sage ll-bezel">
          <div>
            {es ? (
              <>
                <span className="pk-tag">Autoservicio · $39.99/mes · sin costo de instalación · mes a mes</span>
                <h2>¿Prefieres manejarlo tú mismo?</h2>
                <p>
                  Obtén la misma plataforma de Growth (CRM, automatización, IA y plantillas) y configúrala a tu manera, con apoyo de la comunidad.
                </p>
              </>
            ) : (
              <>
                <span className="pk-tag">Self-serve · $39.99/mo · no setup fee · month-to-month</span>
                <h2>Prefer to run it yourself?</h2>
                <p>
                  Get the same platform as Growth (CRM, automation, AI and templates) and set it up your way, with community support.
                </p>
              </>
            )}
          </div>
          <Button variant="inverse" size="lg" onClick={openBooking} iconRight={Arrow}>{es ? 'Agendar una llamada' : 'Book a call'}</Button>
        </div>

        <div className="pk-head pk-services-head">
          <h2 className="pk-h2">{es ? <>Proyectos únicos, <em>a precio fijo.</em></> : <>One-time projects, <em>fixed-price.</em></>}</h2>
          <p>{es ? 'Contrátanos para un solo proyecto, o agrégalo a cualquier servicio mensual o plan de software.' : 'Hire us for a single project, or add one to any retainer or software plan.'}</p>
        </div>
        <div className="pk-grid pk-grid--services">
          {PROJECTS.map((id) => <ServiceCard key={id} id={id} es={es} onNavigate={onNavigate} />)}
        </div>
        <BrandingPricingCard es={es} wide className="pk-pricing" />
        <div className="pk-head pk-services-head">
          <h2 className="pk-h2">{es ? <>Asóciate con nosotros <em>como marca.</em></> : <>Partner with us <em>as a brand.</em></>}</h2>
          <p>{es ? 'Alianzas de estrategia de marketing y consultoría de IA, a la medida de tu marca. Postúlate y te contactamos.' : "Marketing strategy and AI consulting partnerships, scoped to your brand. Apply and we'll reach out."}</p>
        </div>
        <div className="pk-grid pk-grid--services">
          {PARTNER_PROGRAMS.map((p0) => { const p = es ? { ...p0, ...p0.es } : p0; return (
            <div key={p.id} className="pk-service ll-glass">
              <span className="pk-tag" style={{ fontSize: 10 }}>{es ? 'Alianza de marca' : 'Brand partnership'}</span>
              <h3 className="pk-service-title">{p.title}</h3>
              <p className="pk-service-desc">{p.tagline} {p.items.slice(0, 3).join(', ')}{es ? ' y más.' : ', and more.'}</p>
              <Button variant="secondary" size="md" fullWidth iconRight={Arrow}
                onClick={() => { window.history.pushState({}, '', `${localizePath(pathForPage('BrandPartners'), es ? 'es' : 'en')}?program=${p.id}`); onNavigate('BrandPartners', null, { push: false }); window.scrollTo(0, 0); }}>
                {es ? 'Postularme' : 'Apply to partner'}
              </Button>
            </div>
          ); })}
        </div>
        <ul className="pk-notes">
          {(es ? [
            'La inversión en anuncios se cobra al costo y no está incluida en las tarifas de manejo.',
            'El uso de la plataforma (SMS, llamadas, correo, IA) se cobra al costo.',
            'Launch, Growth y Scale son Software como Servicio (SaaS); todo lo demás es un servicio.',
          ] : [
            'Ad spend is billed at cost and is not included in management fees.',
            'Platform usage (SMS, calls, email, AI) is billed at cost.',
            'Launch, Growth and Scale are Software as a Service (SaaS); everything else is a service.',
          ]).map((n) => <li key={n}>{n}</li>)}
        </ul>
      </div>
      <section className="pk-wrap pk-section pk-faq">
        <div className="pk-head">
          <span className="pk-tag">{es ? 'Preguntas' : 'Questions'}</span>
          <h2 className="pk-h2">{es ? <>Lo que la gente pregunta <em>antes de llamarnos.</em></> : <>What people ask <em>before they call.</em></>}</h2>
        </div>
        <div className="hm-faq__list">
          {(es ? FAQ_ES : FAQ).map(([q, a], i) => (
            <details key={q} className="hm-faq__item" open={i === 0}>
              <summary>{q}<span aria-hidden="true" /></summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Packages;
