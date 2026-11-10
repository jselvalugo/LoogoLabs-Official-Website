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


// Primary packages: done-for-you growth systems. Each tier includes everything
// in the tier before it.
const PRIMARY_PACKAGES = [
  {
    name: 'Launch',
    tagline: 'Get found, answer every lead, collect reviews.',
    ideal: 'Local service businesses under ~$500K revenue',
    monthly: '$297',
    setup: '$497 setup',
    term: '6-month term · live in 14 days',
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
    ideal: 'Established businesses, $500K-$3M',
    monthly: '$597',
    setup: '$1,497 setup',
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
    tagline: 'The full platform, plus hands-on consulting on the software itself.',
    ideal: 'Multi-location or $3M+ / high-ticket firms',
    monthly: '$1,297',
    setup: '$2,997 setup',
    term: '12-month term · live in 45 days',
    includesPrev: 'Everything in Growth, plus',
    features: [
      'Consulting on the software: strategy and hands-on help using it',
      '24/7 Voice AI receptionist',
      'Courses, memberships & communities',
      'E-commerce & webinars',
      'Power dialer & prospecting',
      'WhatsApp & affiliate program',
      'Custom AI agents & workflow AI',
    ],
  },
];

// À-la-carte services, keyed by id. Monthly/one-time builds open the booking
// modal; entries with a `page` link to that service's own detail page.
const SERVICES = {
  LocalSEO: {
    title: 'Local SEO',
    price: '$500+',
    unit: '/mo',
    description: 'Ongoing Google Business Profile management, citations, on-page fixes, local content, and monthly ranking reports.',
  },
  ContentSocial: {
    title: 'Content & Social Media',
    price: '$500–$2,000',
    unit: '/mo',
    description: 'Short-form video and Reels, UGC, carousels, captions and a monthly content calendar for Instagram, Facebook, TikTok and LinkedIn. Price depends on your industry and how much content you need.',
  },
  AdsManagement: {
    title: 'Ads Management',
    price: '$500',
    unit: '/mo minimum, or 20% of ad spend (whichever is higher)',
    kind: 'Monthly',
    description: 'Google, Facebook & Instagram, and TikTok ads, run from one place: campaign setup, targeting and keywords, ad copy and creative, conversion tracking, and ongoing bid and budget optimization.',
  },
  WebDesign: {
    title: 'Web Design',
    price: '$1,500+',
    unit: ' one-time',
    description: 'A fast, mobile-first website built to turn visitors into calls and bookings, with on-page SEO set up from day one.',
  },
  PressRelease: {
    page: 'PressRelease',
    title: 'Press Release Distribution',
    from: 'From $149',
    description: 'Your announcement on 350+ news sites and Google News: written, distributed, and reported.',
  },
  ...Object.fromEntries(SERVICE_PACKAGES.map((p) => [p.page, { page: p.page, title: p.cardTitle, from: p.from, description: p.cardDescription }])),
};

// Services grouped by the job they do. Add a new service to SERVICES above,
// then list its id in the group it belongs to.
const SERVICE_GROUPS = [
  { id: 'found', title: 'Get found', blurb: 'Show up on Google, Maps and social feeds when customers are looking, with search and paid ads.', items: ['LocalSEO', 'AdsManagement', 'GBPMakeover', 'CityPages'] },
  { id: 'content', title: 'Get seen', blurb: 'Content that keeps you in front of customers every week.', items: ['ContentSocial'] },
  { id: 'reputation', title: 'Build trust', blurb: 'Reviews and press that make customers pick you.', items: ['ReviewKickstart', 'PressRelease'] },
  { id: 'brand', title: 'Brand & web', blurb: 'The look and the website everything else points to.', items: ['WebDesign'], branding: true },
];

// Spanish display copy, parallel to the arrays above (same order).
const PRIMARY_PACKAGES_ES = [
  {
    tagline: 'Haz que te encuentren, responde a cada cliente y consigue reseñas.',
    ideal: 'Negocios de servicios locales con ingresos menores a ~$500K',
    setup: '$497 de instalación',
    term: 'Contrato de 6 meses · listo en 14 días',
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
    ideal: 'Negocios establecidos, $500K-$3M',
    setup: '$1,497 de instalación',
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
    tagline: 'La plataforma completa, más consultoría práctica sobre el software.',
    ideal: 'Negocios con varias sedes o de $3M+ / alto valor',
    setup: '$2,997 de instalación',
    term: 'Contrato de 12 meses · listo en 45 días',
    includesPrev: 'Todo lo de Growth, más',
    features: [
      'Consultoría sobre el software: estrategia y ayuda práctica para usarlo',
      'Recepcionista de voz con IA 24/7',
      'Cursos, membresías y comunidades',
      'Tienda en línea y webinars',
      'Marcador automático y prospección',
      'WhatsApp y programa de afiliados',
      'Agentes de IA a la medida y flujos con IA',
    ],
  },
];

const SERVICES_ES = {
  LocalSEO: {
    title: 'SEO local',
    unit: '/mes',
    description: 'Manejo continuo del Perfil de Empresa en Google, citas en directorios, ajustes en la página, contenido local y reportes mensuales de posiciones.',
  },
  ContentSocial: {
    title: 'Contenido y redes sociales',
    unit: '/mes',
    description: 'Videos cortos y Reels, UGC, carruseles, textos y un calendario mensual de contenido para Instagram, Facebook, TikTok y LinkedIn. El precio depende de tu industria y de cuánto contenido necesitas.',
  },
  AdsManagement: {
    title: 'Manejo de publicidad',
    unit: '/mes mínimo, o 20% de la inversión en anuncios (lo que sea mayor)',
    kind: 'Mensual',
    description: 'Anuncios en Google, Facebook e Instagram, y TikTok, manejados desde un solo lugar: configuración de campañas, segmentación y palabras clave, textos y creativos, seguimiento de conversiones y optimización continua de pujas y presupuesto.',
  },
  WebDesign: {
    title: 'Diseño web',
    unit: ' pago único',
    description: 'Un sitio web rápido y pensado para el celular, hecho para convertir visitas en llamadas y reservas, con SEO en la página desde el primer día.',
  },
  PressRelease: {
    title: 'Distribución de comunicados de prensa',
    from: 'Desde $149',
    description: 'Tu anuncio en más de 350 sitios de noticias y Google News: redactado, distribuido y con reporte.',
  },
  ...Object.fromEntries(Object.entries(SERVICE_PACKAGES_ES).map(([page, p]) => [page, { title: p.cardTitle, from: p.from, description: p.cardDescription }])),
};

const SERVICE_GROUPS_ES = {
  found: { title: 'Que te encuentren', blurb: 'Aparece en Google, Maps y redes sociales cuando los clientes buscan, con búsqueda y anuncios pagados.' },
  content: { title: 'Que te vean', blurb: 'Contenido que te mantiene frente a tus clientes cada semana.' },
  reputation: { title: 'Genera confianza', blurb: 'Reseñas y prensa que hacen que los clientes te elijan.' },
  brand: { title: 'Marca y web', blurb: 'La imagen y el sitio web al que apunta todo lo demás.' },
};

const Arrow = <ArrowRight size={16} weight="bold" />;

function PackageCard({ pkg, es, esPkg }) {
  // On phones the feature list starts collapsed so all three packages fit on a
  // couple of screens; desktop always shows it (see .pk-features in packages.css).
  const [open, setOpen] = useState(false);
  const dark = !!pkg.featured;
  const t = es ? { ...pkg, ...esPkg } : pkg;
  return (
    <div className={`pk-card ${dark ? 'pk-card--dark ll-forest pk-dark' : 'pk-card--paper'}${open ? ' is-open' : ''}`}>
      <span className="pk-tag pk-kind">{es ? 'Plan de software · SaaS' : 'Software plan · SaaS'}</span>
      <div className="pk-card__top">
        <h2>{pkg.name}</h2>
        {pkg.featured && <span className="pk-pop">{es ? 'Más popular' : 'Most popular'}</span>}
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
  const kind = s.page ? (es ? 'Pago único · precio fijo' : 'One-off · fixed price') : s.kind ? s.kind : s.unit.includes('/') ? (es ? 'Mensual' : 'Monthly') : (es ? 'Proyecto' : 'Project');
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
    <main>
      <section className="pk-wrap pk-hero">
        <span className="ll-eyebrow">{es ? 'Software y servicios' : 'Software & services'}</span>
        {es ? (
          <>
            <h1 className="pk-title">Nuestro software, <em>o nuestro equipo.</em></h1>
            <p className="pk-lede">
              Launch, Growth y Scale son planes de software (SaaS): nuestra plataforma de marketing todo en uno, configurada para ti.
              Todo lo demás en esta página son servicios que hace nuestro equipo. Usa uno, el otro, o ambos.
            </p>
          </>
        ) : (
          <>
            <h1 className="pk-title">Our software, <em>or our team.</em></h1>
            <p className="pk-lede">
              Launch, Growth and Scale are software plans (SaaS): our all-in-one marketing platform, set up for you.
              Everything else on this page is a service our team does for you. Use one, the other, or both.
            </p>
          </>
        )}
      </section>

      <div className="pk-wrap pk-section" style={{ paddingBottom: 96 }}>
        <div className="pk-head">
          <span className="pk-tag">{es ? 'Software · SaaS' : 'Software · SaaS'}</span>
          <h2 className="pk-h2">{es ? <>Planes de software, <em>configurados para ti.</em></> : <>Software plans, <em>set up for you.</em></>}</h2>
          <p>{es ? 'Suscripciones mensuales a la plataforma de marketing de Loogo Labs: CRM, automatización e IA en un solo lugar. Nosotros la configuramos; Scale incluye consultoría sobre cómo usarla.' : 'Monthly subscriptions to the Loogo Labs marketing platform: CRM, automation and AI in one place. We set it up for you, and Scale includes consulting on how to use it.'}</p>
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
          {es ? (
            <>
              <span className="pk-tag">Servicios</span>
              <h2 className="pk-h2">Servicios, <em>hechos por nuestro equipo.</em></h2>
              <p>Contrátanos para un solo servicio, o agrégalo a cualquier plan de software. Los servicios mensuales se cobran cada mes; los de pago único tienen precio fijo.</p>
            </>
          ) : (
            <>
              <span className="pk-tag">Services</span>
              <h2 className="pk-h2">Services, <em>done by our team.</em></h2>
              <p>Hire us for a single service, or add one to any software plan. Monthly services are billed each month; one-offs are fixed-price.</p>
            </>
          )}
        </div>
        {SERVICE_GROUPS.map((g0) => { const g = es ? { ...g0, ...SERVICE_GROUPS_ES[g0.id] } : g0; return (
          <section key={g.id} className="pk-group" aria-labelledby={`pk-group-${g.id}`}>
            <div className="pk-group__head">
              <h3 id={`pk-group-${g.id}`} className="pk-group__title">{g.title}</h3>
              <p>{g.blurb}</p>
            </div>
            <div className="pk-grid pk-grid--services">
              {g.items.map((id) => <ServiceCard key={id} id={id} es={es} onNavigate={onNavigate} />)}
            </div>
            {g.branding && <BrandingPricingCard es={es} wide className="pk-pricing" />}
          </section>
        ); })}
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
            'El uso de la plataforma (SMS, llamadas, IA) se cobra al costo.',
          ] : [
            'Ad spend is billed at cost and is not included in management fees.',
            'Platform usage (SMS, calls, AI) is billed at cost.',
          ]).map((n) => <li key={n}>{n}</li>)}
        </ul>
      </div>
    </main>
  );
}

export default Packages;
