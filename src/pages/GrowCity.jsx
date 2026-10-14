import React from 'react';
import { CITY_BY_SLUG, CFL_BASE, cityPath } from '../lib/cfl';
import { CITIES_ES } from '../lib/cfl.es';
import { useLang } from '../lib/i18n';
import { ArrowRight, MagnifyingGlass, ChartLineUp, Storefront, ChatsCircle } from '@phosphor-icons/react';
import { Eyebrow, H2, BookBtn, Shell, CflMap, Services, Process, Faq, FinalCta, tidy } from './cfl/shared';
import '../styles/pages/cfl.css';

const TONES = ['cfl-tile ll-sage', 'cfl-tile', 'cfl-tile cfl-tile--glass'];
const ICONS = [ChartLineUp, Storefront, ChatsCircle];

// A short city-specific FAQ. It is not marked up as FAQPage schema (only the hub
// carries that), so it can vary freely per city.
const cityFaq = (c) => [
  [`Do you work with businesses in ${c.name}?`, `Yes. ${c.name} is part of our core ${c.county} service area. We build your Google Business Profile, service pages, and follow-up around the ${c.name} neighborhoods you actually serve.`],
  [`How long does local SEO take in ${c.name}?`, 'Profile and review improvements usually show within the first 30-60 days. Ranking for competitive searches takes longer and depends on how established your competitors are. We show you where you stand on the first call.'],
  ['Do I need to be physically located in the city?', `No. Google ranks service-area businesses by where they serve, not only where they sit. If you serve ${c.name}, we can build visibility there.`],
  ['Is there a contract?', 'We recommend a 3-month minimum: local SEO and review growth take time to compound, and three months is when results become clear. For smaller businesses that want to test things first, we also offer month-to-month.'],
];

const cityFaqEs = (c) => [
  [`¿Trabajan con negocios en ${c.name}?`, `Sí. ${c.name} es parte de nuestra área de servicio principal en el condado de ${c.county.replace(' County', '')}. Construimos tu Perfil de Empresa en Google, tus páginas de servicio y tu seguimiento alrededor de los vecindarios de ${c.name} que realmente atiendes.`],
  [`¿Cuánto tarda el SEO local en ${c.name}?`, 'Las mejoras en el perfil y las reseñas suelen verse en los primeros 30-60 días. Posicionarse en búsquedas competitivas toma más tiempo y depende de qué tan establecida esté tu competencia. En la primera llamada te mostramos dónde estás.'],
  ['¿Necesito estar ubicado físicamente en la ciudad?', `No. Google posiciona a los negocios de área de servicio según dónde atienden, no solo dónde están. Si atiendes ${c.name}, podemos construir visibilidad allí.`],
  ['¿Hay contrato?', 'Recomendamos un mínimo de 3 meses: el SEO local y el crecimiento de reseñas toman tiempo en acumularse, y a los tres meses los resultados son claros. Para negocios pequeños que quieren probar primero, también ofrecemos mes a mes.'],
];

function GrowCity({ slug }) {
  const es = useLang() === 'es';
  const base = CITY_BY_SLUG.get(slug);
  if (!base) return null;
  const c = es ? { ...base, ...CITIES_ES[base.slug] } : base;
  const hub = es ? 'Florida Central' : 'Central Florida';
  const nearby = c.nearby.map((s) => CITY_BY_SLUG.get(s)).filter(Boolean);

  return (
    <Shell rail active={c.slug} crumb={{ href: CFL_BASE, label: hub }}>

      {/* ── HERO ── */}
      <section className="cfl-wrap">
        <div className="cfl-panel ll-forest cfl-hero">
          <nav aria-label="Breadcrumb" className="cfl-crumb">
            <a href={CFL_BASE}>{hub}</a>
            <span aria-hidden="true">/</span>
            <span>{c.name}, FL</span>
          </nav>
          <div className="cfl-hero-grid">
            <div>
              <Eyebrow>{es ? `SEO local y automatización de marketing en ${c.name}` : <>{c.name} local SEO &amp; marketing automation</>}</Eyebrow>
              <h1 className="cfl-h1" style={{ fontSize: 'clamp(34px, 4.6vw, 56px)' }}>{c.headline}</h1>
              <p className="cfl-lede">{tidy(c.intro)}</p>
              <div className="cfl-actions"><BookBtn label={es ? `Auditoría local gratis en ${c.name}` : `Free ${c.name} local audit`} /></div>
            </div>
            <CflMap active={c.slug} />
          </div>
        </div>
      </section>

      {/* ── MARKET ── */}
      <section className="cfl-wrap">
        <div className="cfl-panel cfl-panel--bare">
          <Eyebrow>{es ? `El mercado de ${c.name}` : `The ${c.name} market`}</Eyebrow>
          <H2>{es ? `Lo que se necesita para ganar clientes en ${c.name}.` : `What it takes to win customers in ${c.name}.`}</H2>
          <div className="cfl-bento3">
            {c.market.map(([t, d], i) => {
              const Icon = ICONS[i % 3];
              return (
                <div key={t} className={TONES[i % 3]}>
                  <span className="cfl-tile__icon" aria-hidden="true"><Icon size={22} /></span>
                  <div>
                    <div className="cfl-tile__title">{t}</div>
                    <p className="cfl-tile__text">{tidy(d)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── LOCAL SEO TARGETS ── */}
      <section className="cfl-wrap">
        <div className="cfl-panel ll-glass">
          <div className="cfl-2col cfl-2col--start">
            <div>
              <Eyebrow>{es ? `SEO local en ${c.name}` : `Local SEO in ${c.name}`}</Eyebrow>
              <H2 small>{es ? `Aparece en las búsquedas que realmente hacen los clientes de ${c.name}.` : `Show up for the searches ${c.name} customers actually make.`}</H2>
              <p className="cfl-lede" style={{ fontSize: 16 }}>
                {es
                  ? `Optimizamos tu Perfil de Empresa en Google, creamos páginas para los vecindarios que atiendes y medimos tu posición en el mapa de ${c.name} cada mes. En búsquedas como estas es donde los clientes deciden:`
                  : `We optimize your Google Business Profile, build pages for the neighborhoods you serve, and track your rank in the ${c.name} map pack every month. Searches like these are where buyers make up their minds:`}
              </p>
              <div className="cfl-chips">
                {c.searches.map((s) => (
                  <span key={s} className="cfl-chip"><MagnifyingGlass size={14} weight="bold" aria-hidden="true" />{s}</span>
                ))}
              </div>
            </div>
            <div className="cfl-stack">
              <div className="cfl-card">
                <div className="cfl-card__title">{es ? 'Vecindarios y zonas que trabajamos' : 'Neighborhoods & areas we target'}</div>
                <div className="cfl-chips">
                  {c.areas.map((a) => <span key={a} className="cfl-chip">{a}</span>)}
                </div>
              </div>
              <div className="cfl-card ll-forest">
                <div className="cfl-card__title">{es ? `Negocios de ${c.name} para los que estamos hechos` : `${c.name} businesses we're built for`}</div>
                <ul className="cfl-list">
                  {c.industries.map((it) => (
                    <li key={it}><ArrowRight size={14} weight="bold" aria-hidden="true" />{tidy(it)}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Services cityName={c.name} />

      {/* ── PROCESS + NEARBY ── */}
      <Process>
        <div className="cfl-nearby">
          <span className="cfl-nearby__label">{es ? `También cerca de ${c.name}` : `Also serving near ${c.name}`}</span>
          {nearby.map((n) => (
            <a key={n.slug} href={cityPath(n.slug)} className="cfl-nearby__link">{n.name} <ArrowRight size={14} weight="bold" aria-hidden="true" /></a>
          ))}
        </div>
      </Process>

      <Faq items={es ? cityFaqEs(c) : cityFaq(c)} />
      <FinalCta cityName={c.name} />
    </Shell>
  );
}

export default GrowCity;
