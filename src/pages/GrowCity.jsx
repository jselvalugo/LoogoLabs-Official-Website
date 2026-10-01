import React from 'react';
import { CITY_BY_SLUG, CFL_BASE, cityPath } from '../lib/cfl';
import { Wrap, Eyebrow, H2, BookBtn, TopBanner, CityRail, CflMap, Services, Process, Faq, FinalCta } from './cfl/shared';

// A short city-specific FAQ. It is not marked up as FAQPage schema (only the hub
// carries that), so it can vary freely per city.
const cityFaq = (c) => [
  [`Do you work with businesses in ${c.name}?`, `Yes. ${c.name} is part of our core ${c.county} service area. We build your Google Business Profile, service pages, and follow-up around the ${c.name} neighborhoods you actually serve.`],
  [`How long does local SEO take in ${c.name}?`, 'Profile and review improvements usually show within the first 30–60 days. Ranking for competitive searches takes longer and depends on how established your competitors are — we show you where you stand on the first call.'],
  ['Do I need to be physically located in the city?', `No. Google ranks service-area businesses by where they serve, not only where they sit. If you serve ${c.name}, we can build visibility there.`],
  ['Is there a contract?', 'No. We work month-to-month and keep your business by earning it.'],
];

function GrowCity({ slug }) {
  const c = CITY_BY_SLUG.get(slug);
  if (!c) return null;
  const nearby = c.nearby.map((s) => CITY_BY_SLUG.get(s)).filter(Boolean);

  return (
    <main style={{ fontFamily: 'var(--font-body)' }}>
      <TopBanner />
      <CityRail active={c.slug} />
      <div className="cfl-page">

        {/* ── HERO ── */}
        <section className="ll-grid-bg--inverse" style={{ background: 'var(--ink-900)', color: 'var(--paper-000)',
          padding: 'clamp(48px,7vw,96px) 0', position: 'relative', overflow: 'hidden' }}>
          <div aria-hidden="true" style={{ position: 'absolute', bottom: -260, left: -160, width: 620, height: 620, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(134,164,92,0.2) 0%, transparent 65%)', pointerEvents: 'none' }} />
          <Wrap>
            <nav aria-label="Breadcrumb" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 22 }}>
              <a href={CFL_BASE} style={{ color: 'var(--ink-300)', textDecoration: 'none' }}>Central Florida</a>
              <span style={{ color: 'rgba(245,242,235,0.4)', margin: '0 8px' }}>/</span>
              <span style={{ color: 'rgba(245,242,235,0.75)' }}>{c.name}, FL</span>
            </nav>
            <div className="cfl-hero-grid">
              <div>
                <Eyebrow light>{c.name} local SEO &amp; marketing automation</Eyebrow>
                <h1 style={{ margin: 0, fontWeight: 800, fontSize: 'clamp(34px, 4.8vw, 60px)', lineHeight: 1.04, letterSpacing: '-0.035em' }}>
                  {c.headline}
                </h1>
                <p style={{ maxWidth: '54ch', margin: '24px 0 0', fontSize: 17, lineHeight: 1.7, color: 'rgba(245,242,235,0.75)' }}>{c.intro}</p>
                <div style={{ marginTop: 34 }}><BookBtn size="lg" label={`Free ${c.name} local audit`} /></div>
              </div>
              <CflMap active={c.slug} />
            </div>
          </Wrap>
        </section>

        {/* ── MARKET ── */}
        <section style={{ background: 'var(--paper-000)', padding: 'clamp(64px,8vw,104px) 0' }}>
          <Wrap>
            <Eyebrow>The {c.name} market</Eyebrow>
            <H2>What it takes to win customers in {c.name}.</H2>
            <div className="ll-grid-3" style={{ gap: 16, marginTop: 44 }}>
              {c.market.map(([t, d], i) => (
                <div key={t} style={{ padding: '28px 24px', borderRadius: 16, background: 'var(--paper-100)', border: '1px solid var(--border-hair)' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-400)', marginBottom: 12 }}>0{i + 1}</div>
                  <div style={{ fontWeight: 700, fontSize: 18, letterSpacing: '-0.01em', marginBottom: 10 }}>{t}</div>
                  <div style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--ink-500)' }}>{d}</div>
                </div>
              ))}
            </div>
          </Wrap>
        </section>

        {/* ── LOCAL SEO TARGETS ── */}
        <section style={{ background: 'var(--paper-200)', padding: 'clamp(64px,8vw,104px) 0' }}>
          <Wrap>
            <div className="ll-2col" style={{ gap: 48, alignItems: 'start' }}>
              <div>
                <Eyebrow>Local SEO in {c.name}</Eyebrow>
                <H2>Show up for the searches {c.name} customers actually make.</H2>
                <p style={{ margin: '20px 0 0', fontSize: 15, lineHeight: 1.7, color: 'var(--ink-500)' }}>
                  We optimize your Google Business Profile, build pages for the neighborhoods you serve, and track your rank in
                  the {c.name} map pack every month. Searches like these are where buyers make up their minds:
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 24 }}>
                  {c.searches.map((s) => (
                    <span key={s} className="cfl-chip"><span aria-hidden="true">⌕</span>{s}</span>
                  ))}
                </div>
              </div>
              <div style={{ display: 'grid', gap: 16 }}>
                <div style={{ background: 'var(--paper-000)', borderRadius: 16, border: '1px solid var(--border-hair)', padding: '24px 24px' }}>
                  <div style={{ fontWeight: 700, marginBottom: 14 }}>Neighborhoods &amp; areas we target</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {c.areas.map((a) => <span key={a} className="cfl-chip">{a}</span>)}
                  </div>
                </div>
                <div style={{ background: 'var(--ink-900)', color: 'var(--paper-000)', borderRadius: 16, padding: '24px 24px' }}>
                  <div style={{ fontWeight: 700, marginBottom: 14 }}>{c.name} businesses we're built for</div>
                  <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 9 }}>
                    {c.industries.map((it) => (
                      <li key={it} style={{ display: 'flex', gap: 10, fontSize: 14, color: 'rgba(245,242,235,0.85)' }}>
                        <span aria-hidden="true" style={{ color: 'var(--ink-300)' }}>→</span>{it}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Wrap>
        </section>

        <Services cityName={c.name} />
        <Process />

        {/* ── NEARBY ── */}
        <section style={{ background: 'var(--paper-000)', padding: 'clamp(56px,7vw,88px) 0' }}>
          <Wrap>
            <Eyebrow>Also serving near {c.name}</Eyebrow>
            <div className="cfl-cards" style={{ marginTop: 8 }}>
              {nearby.map((n) => (
                <a key={n.slug} href={cityPath(n.slug)} className="cfl-city-card">
                  <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em' }}>{n.name}</span>
                  <span style={{ fontSize: 13.5, lineHeight: 1.6, color: 'var(--ink-500)' }}>{n.market[0][0]}.</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-600)' }}>{n.name} page →</span>
                </a>
              ))}
            </div>
          </Wrap>
        </section>

        <Faq items={cityFaq(c)} />
        <FinalCta cityName={c.name} />
      </div>
    </main>
  );
}

export default GrowCity;
