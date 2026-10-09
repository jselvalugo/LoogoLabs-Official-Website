import React from 'react';
// Shared with the FAQPage schema in lib/seo.js: Google requires the answer text
// in structured data to match what the visitor actually reads on the page.
import { GROW_FAQ as faqs } from '../lib/content';
import { CITIES, cityPath } from '../lib/cfl';
import { ArrowRight, MapPin, UsersThree, Translate } from '@phosphor-icons/react';
import { Eyebrow, H2, BookBtn, Shell, CflMap, Services, Process, Faq, FinalCta } from './cfl/shared';
import '../styles/pages/cfl.css';

const COUNTIES = ['Orange County', 'Osceola County', 'Seminole County', 'Lake County'];

const WHY = [
  ['Search is hyper-local', 'Google shows the map pack by proximity. Ranking "in Orlando" means little if your customers are in St. Cloud. We build visibility city by city, neighborhood by neighborhood.', MapPin],
  ['Tourists and residents', 'Along the I-4 and US-192 corridors you serve both visitors and locals. Your profile, pages, and follow-up need to work for each.', UsersThree],
  ['Bilingual, year-round', 'Much of the region searches and books in Spanish, and seasons here are hurricanes, summer heat, and snowbirds, not snow. Your campaigns should reflect that.', Translate],
];
const WHY_TONES = ['cfl-tile ll-sage', 'cfl-tile', 'cfl-tile cfl-tile--glass'];

function GrowCFL() {
  return (
    <Shell rail>

      {/* ── HERO ── */}
      <section className="cfl-wrap">
        <div className="cfl-panel ll-forest cfl-hero">
          <div className="cfl-hero-grid">
            <div>
              <Eyebrow>Orlando · Kissimmee · Celebration · and beyond</Eyebrow>
              <h1 className="cfl-h1">
                Central Florida's local SEO &amp; <em>marketing automation</em> team.
              </h1>
              <p className="cfl-lede">
                We put Central Florida businesses at the top of Google Maps in the cities they serve, then make sure every
                call, form, and message gets an instant reply, a follow-up, and a review request. Built locally, for this market only.
              </p>
              <div className="cfl-actions">
                <BookBtn label="Get my free local audit" />
                <a href="#cities" className="cfl-btn cfl-btn--ghost"
                  onClick={(e) => { e.preventDefault(); document.getElementById('cities')?.scrollIntoView({ behavior: 'smooth' }); }}>
                  Find your city ↓
                </a>
              </div>
              <div className="cfl-counties">
                {COUNTIES.map((c) => <span key={c}>{c}</span>)}
              </div>
            </div>
            <CflMap />
          </div>
        </div>
      </section>

      {/* ── WHY CENTRAL FLORIDA IS DIFFERENT ── */}
      <section className="cfl-wrap">
        <div className="cfl-panel cfl-panel--bare">
          <Eyebrow>Why local matters here</Eyebrow>
          <H2>Central Florida isn't one market. It's a dozen, side by side.</H2>
          <p className="cfl-lede">
            A homeowner in Lake Mary and a vacation-rental owner in Kissimmee search differently, buy differently, and
            trust different signals. Generic national marketing treats them the same. We don't.
          </p>
          <div className="cfl-bento3">
            {WHY.map(([t, d, Icon], i) => (
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
          <Eyebrow>Cities we serve</Eyebrow>
          <H2>Pick your city. See exactly how we'd grow you there.</H2>
          <div className="cfl-cards">
            {CITIES.map((c) => (
              <a key={c.slug} href={cityPath(c.slug)} className="cfl-city-card">
                <span className="cfl-city-card__top">
                  <span className="cfl-city-card__name">{c.name}</span>
                  <span className="cfl-city-card__county">{c.county}</span>
                </span>
                <span className="cfl-city-card__desc">{c.market[0][0]}. {c.industries.slice(0, 2).join(', ')}, and more.</span>
                <span className="cfl-city-card__go">
                  {c.name} local SEO <i aria-hidden="true"><ArrowRight size={14} weight="bold" /></i>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <Services />

      {/* ── SPEED TO LEAD ── */}
      <section className="cfl-wrap">
        <div className="cfl-panel ll-forest">
          <div className="cfl-2col">
            <div>
              <Eyebrow>Automated marketing</Eyebrow>
              <H2>Ranking gets the call. Speed wins the job.</H2>
              <p className="cfl-lede">
                Showing up on Google is only half of it. When a Kissimmee homeowner calls three AC companies, the one that
                answers (or texts back within a minute) is usually the one that gets the job. Our automations make that you,
                even when you're on a roof or with a patient.
              </p>
              <div className="cfl-actions"><BookBtn label="See it for my business" /></div>
            </div>
            <div className="cfl-feed">
              {[
                ['0:00', 'Missed call from a new number'],
                ['0:05', 'Auto-text: "Sorry we missed you. How can we help?"'],
                ['0:40', 'Customer replies with the job details'],
                ['1:30', 'Booking link sent, appointment on your calendar'],
                ['Day 3', 'Job done → review request goes out automatically'],
              ].map(([t, d], i) => (
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
      <Faq items={faqs} />
      <FinalCta />
    </Shell>
  );
}

export default GrowCFL;
