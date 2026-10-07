// Building blocks shared by the Central Florida hub (/grow) and its city pages
// (/grow/<city>). Kept together so every page in the set looks and reads alike.
import React from 'react';
import { BOOKING_URL } from '../../lib/booking';
import { CITIES, CFL_BASE, cityPath } from '../../lib/cfl';

export const Wrap = ({ children, style }) => (
  <div className="cfl-wrap" style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px', ...style }}>{children}</div>
);

export const Eyebrow = ({ children, light }) => (
  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase',
    color: light ? 'var(--ink-300)' : 'var(--ink-400)', marginBottom: 14 }}>
    {children}
  </div>
);

export const H2 = ({ children, light, style }) => (
  <h2 style={{ margin: 0, fontSize: 'clamp(28px, 3.6vw, 46px)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.1,
    color: light ? 'var(--paper-000)' : 'var(--ink-900)', maxWidth: '24ch', ...style }}>
    {children}
  </h2>
);

const trackSchedule = () => { if (window.fbq) window.fbq('track', 'Schedule'); };

export const BookBtn = ({ size = 'md', label = 'Book a free strategy call', variant = 'light' }) => {
  const lg = size === 'lg';
  const light = variant === 'light';
  return (
    <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" onClick={trackSchedule}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: lg ? '17px 30px' : '12px 22px',
        background: light ? 'var(--paper-000)' : 'var(--ink-900)', color: light ? 'var(--ink-900)' : 'var(--paper-000)',
        fontWeight: 700, fontSize: lg ? 15 : 13, fontFamily: 'var(--font-mono)', letterSpacing: '0.05em',
        textTransform: 'uppercase', textDecoration: 'none', borderRadius: 999,
        boxShadow: light ? '0 10px 30px rgba(0,0,0,0.25)' : '0 10px 24px rgba(26,38,16,0.25)' }}>
      {label} <span aria-hidden="true">→</span>
    </a>
  );
};

export const TopBanner = () => (
  <div className="cfl-topbar">
    <a href="/" className="cfl-topbar__brand">Loogo Labs</a>
    <span aria-hidden="true" className="cfl-topbar__sep">/</span>
    <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" onClick={trackSchedule} className="cfl-topbar__cta">
      Book a free <span className="cfl-topbar__long">strategy </span>call <span aria-hidden="true">→</span>
    </a>
  </div>
);

/** The floating glass bar listing every city page. */
export const CityRail = ({ active }) => (
  <nav className="cfl-rail" aria-label="Central Florida cities">
    <div className="cfl-rail__title">Central Florida</div>
    <ul className="cfl-rail__list">
      <li>
        <a className="cfl-rail__link" href={CFL_BASE} aria-current={active ? undefined : 'page'}>
          All of Central FL <small>HUB</small>
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
      Free strategy call
    </a>
  </nav>
);

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
  <div className="cfl-glass" style={{ padding: 12, maxWidth: 400, width: '100%', justifySelf: 'end' }}>
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

export const Services = ({ cityName }) => (
  <section style={{ background: 'var(--paper-100)', padding: 'clamp(44px,5vw,64px) 0' }}>
    <Wrap><div className="cfl-narrow">
      <Eyebrow>What we do{cityName ? ` in ${cityName}` : ''}</Eyebrow>
      <h2 style={{ margin: 0, fontSize: 'clamp(24px, 2.8vw, 34px)', fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.15 }}>
        Get found. Get the job.
      </h2>
      <div className="cfl-services">
        {SERVICES.map(({ title, desc, items }, i) => (
          <div key={title} className="cfl-service">
            <div className="cfl-service__head">
              <span className="cfl-service__num">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="cfl-service__title">{title}</h3>
            </div>
            <p className="cfl-service__desc">{desc}</p>
            <div className="cfl-service__tags">{items.map((it) => <span key={it}>{it}</span>)}</div>
          </div>
        ))}
      </div>
    </div></Wrap>
  </section>
);

const STEPS = [
  ['Strategy call', 'We review your Google profile, local rankings, and how fast leads hear back today.', '30 min'],
  ['Build', 'Profile, city pages, follow-up, reviews, and booking — set up for your service area.', 'Week 1'],
  ['Launch & test', 'Test leads run end-to-end so every message, alert, and booking is confirmed.', 'Week 2'],
  ['Manage & grow', 'A monthly report and call. We tune pages, campaigns, and sequences on results.', 'Ongoing'],
];

export const Process = () => (
  <section style={{ background: 'var(--paper-000)', padding: 'clamp(44px,5vw,64px) 0 clamp(28px,3vw,40px)', borderTop: '1px solid var(--border-hair)' }}>
    <Wrap><div className="cfl-narrow">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24, flexWrap: 'wrap' }}>
        <div>
          <Eyebrow>How it works</Eyebrow>
          <h2 style={{ margin: 0, fontSize: 'clamp(24px, 2.8vw, 34px)', fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.15 }}>
            Live in about two weeks.
          </h2>
        </div>
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: 'var(--ink-500)', maxWidth: '36ch' }}>
          Then managed every month — no hand-off, no DIY.
        </p>
      </div>
      <ol className="cfl-steps">
        {STEPS.map(([title, desc, when], i) => (
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
    </div></Wrap>
  </section>
);

export const Faq = ({ items }) => {
  const [open, setOpen] = React.useState(0);
  return (
    <section style={{ background: 'var(--paper-200)', padding: 'clamp(64px,8vw,104px) 0' }}>
      <Wrap>
        <Eyebrow>FAQ</Eyebrow>
        <H2 style={{ marginBottom: 36 }}>Common questions.</H2>
        <div style={{ display: 'grid', gap: 10 }}>
          {items.map(([q, a], i) => (
            <div key={q} style={{ background: 'var(--paper-000)', border: '1px solid var(--border-hair)', borderRadius: 14, overflow: 'hidden' }}>
              <button onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}
                style={{ width: '100%', padding: '20px 22px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, fontFamily: 'inherit' }}>
                <span style={{ fontWeight: 600, fontSize: 15, color: 'var(--ink-900)', lineHeight: 1.4 }}>{q}</span>
                <span aria-hidden="true" style={{ color: 'var(--ink-400)', fontSize: 22, transform: open === i ? 'rotate(45deg)' : 'none', transition: 'transform 160ms ease' }}>+</span>
              </button>
              {/* Kept in the DOM when closed so the answer text (which FAQPage
                  schema repeats) is always in the rendered markup. */}
              <div hidden={open !== i} style={{ padding: '0 22px 22px', fontSize: 14, lineHeight: 1.75, color: 'var(--ink-500)' }}>{a}</div>
            </div>
          ))}
        </div>
      </Wrap>
    </section>
  );
};

export const FinalCta = ({ cityName }) => (
  <section className="ll-grid-bg--inverse" style={{ background: 'var(--ink-900)', color: 'var(--paper-000)', padding: 'clamp(80px,10vw,128px) 0', textAlign: 'center' }}>
    <Wrap>
      <Eyebrow light>Free · 30 minutes · No obligation</Eyebrow>
      <h2 style={{ margin: '0 auto', fontSize: 'clamp(32px, 5vw, 58px)', fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 1.06, maxWidth: '20ch' }}>
        See where {cityName || 'your business'} {cityName ? 'customers are finding your competitors' : 'is losing local customers'} — and how to fix it.
      </h2>
      <p style={{ margin: '24px auto 0', maxWidth: '54ch', fontSize: 17, lineHeight: 1.7, color: 'rgba(245,242,235,0.72)' }}>
        On the call we pull up your Google profile and local rankings{cityName ? ` in ${cityName}` : ''}, check how fast a new lead hears back, and map out exactly what we would build.
      </p>
      <div style={{ marginTop: 40 }}><BookBtn size="lg" label="Book my free strategy call" /></div>
      <div style={{ marginTop: 18, fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-300)' }}>
        3-month recommended · Month-to-month available
      </div>
    </Wrap>
  </section>
);
