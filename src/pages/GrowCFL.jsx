import React from 'react';
// Shared with the FAQPage schema in lib/seo.js: Google requires the answer text
// in structured data to match what the visitor actually reads on the page.
import { GROW_FAQ as faqs } from '../lib/content';
import { CITIES, cityPath } from '../lib/cfl';
import { CITIES_ES, GROW_FAQ_ES, COUNTY_ES } from '../lib/cfl.es';
import { useLang } from '../lib/i18n';
import { ArrowRight, MapPin, UsersThree, Translate } from '@phosphor-icons/react';
import { Eyebrow, H2, BookBtn, Shell, CflMap, Services, Process, Faq, FinalCta } from './cfl/shared';
import '../styles/pages/cfl.css';

const COUNTIES = ['Orange County', 'Osceola County', 'Seminole County', 'Lake County'];

const WHY = [
  ['Search is hyper-local', 'Google shows the map pack by proximity. Ranking "in Orlando" means little if your customers are in St. Cloud. We build visibility city by city, neighborhood by neighborhood.', MapPin],
  ['Tourists and residents', 'Along the I-4 and US-192 corridors you serve both visitors and locals. Your profile, pages, and follow-up need to work for each.', UsersThree],
  ['Bilingual, year-round', 'Much of the region searches and books in Spanish, and seasons here are hurricanes, summer heat, and snowbirds, not snow. Your campaigns should reflect that.', Translate],
];
const WHY_ES = [
  ['La búsqueda es hiperlocal', 'Google muestra el mapa según la cercanía. Aparecer "en Orlando" significa poco si tus clientes están en St. Cloud. Construimos visibilidad ciudad por ciudad, vecindario por vecindario.', MapPin],
  ['Turistas y residentes', 'En los corredores de la I-4 y la US-192 atiendes tanto a visitantes como a locales. Tu perfil, tus páginas y tu seguimiento deben funcionar para ambos.', UsersThree],
  ['Bilingüe, todo el año', 'Gran parte de la región busca y reserva en español, y aquí las temporadas son huracanes, calor de verano y snowbirds, no nieve. Tus campañas deben reflejarlo.', Translate],
];

const FEED = [
  ['0:00', 'Missed call from a new number'],
  ['0:05', 'Auto-text: "Sorry we missed you. How can we help?"'],
  ['0:40', 'Customer replies with the job details'],
  ['1:30', 'Booking link sent, appointment on your calendar'],
  ['Day 3', 'Job done → review request goes out automatically'],
];
const FEED_ES = [
  ['0:00', 'Llamada perdida de un número nuevo'],
  ['0:05', 'Texto automático: "Perdón que no contestamos. ¿Cómo te ayudamos?"'],
  ['0:40', 'El cliente responde con los detalles del trabajo'],
  ['1:30', 'Se envía el enlace de reserva y la cita queda en tu calendario'],
  ['Día 3', 'Trabajo terminado → la solicitud de reseña sale automáticamente'],
];

const WHY_TONES = ['cfl-tile ll-sage', 'cfl-tile', 'cfl-tile cfl-tile--glass'];

function GrowCFL() {
  const es = useLang() === 'es';
  return (
    <Shell rail>

      {/* ── HERO ── */}
      <section className="cfl-wrap">
        <div className="cfl-panel ll-forest cfl-hero">
          <div className="cfl-hero-grid">
            <div>
              <Eyebrow>Orlando · Kissimmee · Celebration · {es ? 'y más' : 'and beyond'}</Eyebrow>
              <h1 className="cfl-h1">
                {es
                  ? <>El equipo de SEO local y <em>automatización de marketing</em> de la Florida Central.</>
                  : <>Central Florida's local SEO &amp; <em>marketing automation</em> team.</>}
              </h1>
              <p className="cfl-lede">
                {es
                  ? 'Ponemos a los negocios de la Florida Central en lo más alto de Google Maps en las ciudades que atienden, y nos aseguramos de que cada llamada, formulario y mensaje reciba una respuesta instantánea, seguimiento y una solicitud de reseña. Hecho localmente, solo para este mercado.'
                  : 'We put Central Florida businesses at the top of Google Maps in the cities they serve, then make sure every call, form, and message gets an instant reply, a follow-up, and a review request. Built locally, for this market only.'}
              </p>
              <div className="cfl-actions">
                <BookBtn label={es ? 'Quiero mi auditoría local gratis' : 'Get my free local audit'} />
                <a href="#cities" className="cfl-btn cfl-btn--ghost"
                  onClick={(e) => { e.preventDefault(); document.getElementById('cities')?.scrollIntoView({ behavior: 'smooth' }); }}>
                  {es ? 'Encuentra tu ciudad ↓' : 'Find your city ↓'}
                </a>
              </div>
              <div className="cfl-counties">
                {COUNTIES.map((c) => <span key={c}>{es ? COUNTY_ES(c) : c}</span>)}
              </div>
            </div>
            <CflMap />
          </div>
        </div>
      </section>

      {/* ── WHY CENTRAL FLORIDA IS DIFFERENT ── */}
      <section className="cfl-wrap">
        <div className="cfl-panel cfl-panel--bare">
          <Eyebrow>{es ? 'Por qué lo local importa aquí' : 'Why local matters here'}</Eyebrow>
          <H2>{es ? 'La Florida Central no es un solo mercado. Son una docena, uno al lado del otro.' : "Central Florida isn't one market. It's a dozen, side by side."}</H2>
          <p className="cfl-lede">
            {es
              ? 'Un propietario en Lake Mary y el dueño de un alquiler vacacional en Kissimmee buscan distinto, compran distinto y confían en señales distintas. El marketing nacional genérico los trata igual. Nosotros no.'
              : "A homeowner in Lake Mary and a vacation-rental owner in Kissimmee search differently, buy differently, and trust different signals. Generic national marketing treats them the same. We don't."}
          </p>
          <div className="cfl-bento3">
            {(es ? WHY_ES : WHY).map(([t, d, Icon], i) => (
              <div key={t} className={WHY_TONES[i]}>
                <span className="cfl-tile__icon" aria-hidden="true"><Icon size={22} /></span>
                <div>
                  <div className="cfl-tile__title">{t}</div>
                  <p className="cfl-tile__text">{d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CITIES ── */}
      <section id="cities" className="cfl-wrap" style={{ scrollMarginTop: 96 }}>
        <div className="cfl-panel ll-glass">
          <Eyebrow>{es ? 'Ciudades que atendemos' : 'Cities we serve'}</Eyebrow>
          <H2>{es ? 'Elige tu ciudad. Mira exactamente cómo te haríamos crecer allí.' : "Pick your city. See exactly how we'd grow you there."}</H2>
          <div className="cfl-cards">
            {CITIES.map((c) => {
              const x = es ? CITIES_ES[c.slug] : c;
              return (
              <a key={c.slug} href={cityPath(c.slug)} className="cfl-city-card">
                <span className="cfl-city-card__top">
                  <span className="cfl-city-card__name">{c.name}</span>
                  <span className="cfl-city-card__county">{es ? COUNTY_ES(c.county) : c.county}</span>
                </span>
                <span className="cfl-city-card__desc">{x.market[0][0]}. {x.industries.slice(0, 2).join(', ')}{es ? ' y más.' : ', and more.'}</span>
                <span className="cfl-city-card__go">
                  {es ? `SEO local en ${c.name}` : `${c.name} local SEO`} <i aria-hidden="true"><ArrowRight size={14} weight="bold" /></i>
                </span>
              </a>
              );
            })}
          </div>
        </div>
      </section>

      <Services />

      {/* ── SPEED TO LEAD ── */}
      <section className="cfl-wrap">
        <div className="cfl-panel ll-forest">
          <div className="cfl-2col">
            <div>
              <Eyebrow>{es ? 'Marketing automatizado' : 'Automated marketing'}</Eyebrow>
              <H2>{es ? 'El ranking trae la llamada. La rapidez gana el trabajo.' : 'Ranking gets the call. Speed wins the job.'}</H2>
              <p className="cfl-lede">
                {es
                  ? 'Aparecer en Google es solo la mitad. Cuando un propietario en Kissimmee llama a tres compañías de aire acondicionado, la que contesta (o responde por texto en menos de un minuto) suele ser la que gana el trabajo. Nuestras automatizaciones hacen que seas tú, incluso cuando estás en un techo o con un paciente.'
                  : "Showing up on Google is only half of it. When a Kissimmee homeowner calls three AC companies, the one that answers (or texts back within a minute) is usually the one that gets the job. Our automations make that you, even when you're on a roof or with a patient."}
              </p>
              <div className="cfl-actions"><BookBtn label={es ? 'Verlo para mi negocio' : 'See it for my business'} /></div>
            </div>
            <div className="cfl-feed">
              {(es ? FEED_ES : FEED).map(([t, d], i) => (
                <div key={t} className={`cfl-feed__row${i === 4 ? ' cfl-feed__row--hl' : ''}`}>
                  <span>{t}</span>
                  <span>{d}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Process />
      <Faq items={es ? GROW_FAQ_ES : faqs} />
      <FinalCta />
    </Shell>
  );
}

export default GrowCFL;
