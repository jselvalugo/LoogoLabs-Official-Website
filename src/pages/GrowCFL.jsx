import React from 'react';
// Shared with the FAQPage schema in lib/seo.js: Google requires the answer text
// in structured data to match what the visitor actually reads on the page.
import { GROW_FAQ as faqs } from '../lib/content';
import { CITIES, cityPath } from '../lib/cfl';
import { Wrap, Eyebrow, H2, BookBtn, TopBanner, CityRail, CflMap, Services, Process, Faq, FinalCta } from './cfl/shared';

const COUNTIES = ['Orange County', 'Osceola County', 'Seminole County', 'Lake County'];

function GrowCFL() {
  return (
    <main style={{ fontFamily: 'var(--font-body)' }}>
      <TopBanner />
      <CityRail />
      <div className="cfl-page">

        {/* ── HERO ── */}
        <section className="ll-grid-bg--inverse" style={{ background: 'var(--ink-900)', color: 'var(--paper-000)',
          padding: 'clamp(56px,8vw,104px) 0', position: 'relative', overflow: 'hidden' }}>
          <div aria-hidden="true" style={{ position: 'absolute', top: -200, right: -120, width: 640, height: 640, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(134,164,92,0.22) 0%, transparent 65%)', pointerEvents: 'none' }} />
          <Wrap>
            <div className="cfl-hero-grid">
              <div>
                <Eyebrow light>Orlando · Kissimmee · Celebration · and beyond</Eyebrow>
                <h1 style={{ margin: 0, fontWeight: 800, fontSize: 'clamp(38px, 5.4vw, 68px)', lineHeight: 1.02, letterSpacing: '-0.04em' }}>
                  Central Florida's local SEO &amp; <span style={{ color: 'var(--ink-300)' }}>marketing automation</span> team.
                </h1>
                <p style={{ maxWidth: '52ch', margin: '26px 0 0', fontSize: 18, lineHeight: 1.65, color: 'rgba(245,242,235,0.75)' }}>
                  We put Central Florida businesses at the top of Google Maps in the cities they serve — then make sure every
                  call, form, and message gets an instant reply, a follow-up, and a review request. Built locally, for this market only.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 36, flexWrap: 'wrap' }}>
                  <BookBtn size="lg" label="Get my free local audit" />
                  <a href="#cities"
                    onClick={(e) => { e.preventDefault(); document.getElementById('cities')?.scrollIntoView({ behavior: 'smooth' }); }}
                    style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase',
                    color: 'var(--paper-000)', textDecoration: 'none', borderBottom: '1px solid rgba(245,242,235,0.4)', paddingBottom: 2 }}>
                    Find your city ↓
                  </a>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 36 }}>
                  {COUNTIES.map((c) => (
                    <span key={c} style={{ padding: '6px 12px', borderRadius: 999, border: '1px solid rgba(245,242,235,0.2)',
                      fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.06em', color: 'rgba(245,242,235,0.8)' }}>{c}</span>
                  ))}
                </div>
              </div>
              <CflMap />
            </div>
          </Wrap>
        </section>

        {/* ── WHY CENTRAL FLORIDA IS DIFFERENT ── */}
        <section style={{ background: 'var(--paper-000)', padding: 'clamp(64px,8vw,104px) 0' }}>
          <Wrap>
            <Eyebrow>Why local matters here</Eyebrow>
            <H2>Central Florida isn't one market. It's a dozen, side by side.</H2>
            <p style={{ margin: '20px 0 0', fontSize: 16, lineHeight: 1.7, color: 'var(--ink-500)', maxWidth: '62ch' }}>
              A homeowner in Lake Mary and a vacation-rental owner in Kissimmee search differently, buy differently, and
              trust different signals. Generic national marketing treats them the same. We don't.
            </p>
            <div className="ll-grid-3" style={{ gap: 16, marginTop: 44 }}>
              {[
                ['Search is hyper-local', 'Google shows the map pack by proximity. Ranking "in Orlando" means little if your customers are in St. Cloud. We build visibility city by city, neighborhood by neighborhood.'],
                ['Tourists and residents', 'Along the I-4 and US-192 corridors you serve both visitors and locals. Your profile, pages, and follow-up need to work for each.'],
                ['Bilingual, year-round', 'Much of the region searches and books in Spanish, and seasons here are hurricanes, summer heat, and snowbirds — not snow. Your campaigns should reflect that.'],
              ].map(([t, d]) => (
                <div key={t} style={{ padding: '28px 24px', borderRadius: 16, background: 'var(--paper-100)', border: '1px solid var(--border-hair)' }}>
                  <div style={{ fontWeight: 700, fontSize: 18, letterSpacing: '-0.01em', marginBottom: 10 }}>{t}</div>
                  <div style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--ink-500)' }}>{d}</div>
                </div>
              ))}
            </div>
          </Wrap>
        </section>

        {/* ── CITIES ── */}
        <section id="cities" style={{ background: 'var(--paper-200)', padding: 'clamp(64px,8vw,104px) 0', scrollMarginTop: 24 }}>
          <Wrap>
            <Eyebrow>Cities we serve</Eyebrow>
            <H2>Pick your city. See exactly how we'd grow you there.</H2>
            <div className="cfl-cards" style={{ marginTop: 44 }}>
              {CITIES.map((c) => (
                <a key={c.slug} href={cityPath(c.slug)} className="cfl-city-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
                    <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em' }}>{c.name}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-400)' }}>{c.county}</span>
                  </div>
                  <span style={{ fontSize: 13.5, lineHeight: 1.6, color: 'var(--ink-500)' }}>{c.market[0][0]}. {c.industries.slice(0, 2).join(', ')}, and more.</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-600)', marginTop: 4 }}>
                    {c.name} local SEO →
                  </span>
                </a>
              ))}
            </div>
          </Wrap>
        </section>

        <Services />

        {/* ── SPEED TO LEAD ── */}
        <section style={{ background: 'var(--paper-000)', padding: 'clamp(64px,8vw,104px) 0' }}>
          <Wrap>
            <div className="ll-2col" style={{ gap: 48, alignItems: 'center' }}>
              <div>
                <Eyebrow>Automated marketing</Eyebrow>
                <H2>Ranking gets the call. Speed wins the job.</H2>
                <p style={{ margin: '20px 0 0', fontSize: 16, lineHeight: 1.7, color: 'var(--ink-500)' }}>
                  Showing up on Google is only half of it. When a Kissimmee homeowner calls three AC companies, the one that
                  answers — or texts back within a minute — is usually the one that gets the job. Our automations make that you,
                  even when you're on a roof or with a patient.
                </p>
                <div style={{ marginTop: 32 }}><BookBtn variant="dark" label="See it for my business" /></div>
              </div>
              <div style={{ display: 'grid', gap: 10 }}>
                {[
                  ['0:00', 'Missed call from a new number'],
                  ['0:05', 'Auto-text: "Sorry we missed you — how can we help?"'],
                  ['0:40', 'Customer replies with the job details'],
                  ['1:30', 'Booking link sent, appointment on your calendar'],
                  ['Day 3', 'Job done → review request goes out automatically'],
                ].map(([t, d], i) => (
                  <div key={t} style={{ display: 'flex', gap: 16, alignItems: 'center', padding: '14px 18px', borderRadius: 14,
                    background: i === 4 ? 'var(--ink-900)' : 'var(--paper-100)', color: i === 4 ? 'var(--paper-000)' : 'var(--ink-800)',
                    border: '1px solid var(--border-hair)' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, minWidth: 48, color: i === 4 ? 'var(--ink-300)' : 'var(--ink-400)' }}>{t}</span>
                    <span style={{ fontSize: 14, lineHeight: 1.5 }}>{d}</span>
                  </div>
                ))}
              </div>
            </div>
          </Wrap>
        </section>

        <Process />
        <Faq items={faqs} />
        <FinalCta />
      </div>
    </main>
  );
}

export default GrowCFL;
