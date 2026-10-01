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
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, height: 36,
    background: 'var(--ink-900)', borderBottom: '1px solid rgba(216,211,198,0.18)',
    fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
    <a href="/" style={{ color: 'var(--paper-000)', textDecoration: 'none' }}>Loogo Labs</a>
    <span aria-hidden="true" style={{ color: 'var(--ink-400)' }}>/</span>
    <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" onClick={trackSchedule}
      style={{ color: 'var(--ink-300)', textDecoration: 'none' }}>
      Book a free strategy call <span aria-hidden="true">→</span>
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
// Labels that would collide with a neighbour's sit on the pin's left instead.
const LEFT_LABEL = new Set(['altamonte-springs']);
const W = 520;
const H = 500;
const project = ([lat, lon]) => [
  ((lon - BOUNDS.lonMin) / (BOUNDS.lonMax - BOUNDS.lonMin)) * W,
  ((BOUNDS.latMax - lat) / (BOUNDS.latMax - BOUNDS.latMin)) * H,
];

/** Stylised pin map of the service area; each pin links to its city page. */
export const CflMap = ({ active }) => (
  <div className="cfl-glass" style={{ padding: 18 }}>
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
            <text x={LEFT_LABEL.has(c.slug) ? x - 12 : x + 12} y={y + 4} textAnchor={LEFT_LABEL.has(c.slug) ? 'end' : 'start'} fill={on ? 'var(--ink-300)' : 'rgba(245,242,235,0.85)'}
              fontFamily="var(--font-body)" fontSize={on ? 15 : 13} fontWeight={on ? 700 : 500}>{c.name}</text>
          </a>
        );
      })}
    </svg>
  </div>
);

export const SERVICES = [
  { num: '01', title: 'Local SEO & map-pack ranking', desc: 'A fully built-out Google Business Profile, city and neighborhood service pages, consistent citations, and the local keywords your customers actually type.', items: ['Google Business Profile optimization & posting', 'City + neighborhood landing pages', 'Citation cleanup across major directories', 'Monthly local rankings report'] },
  { num: '02', title: 'Instant lead follow-up', desc: 'Every lead from your site, ads, Facebook, or phone gets a personal reply in seconds — by text and email — then a follow-up sequence that runs until they book.', items: ['Missed-call text-back', 'Speed-to-lead SMS & email', 'Multi-step nurture sequences', 'English & Spanish templates'] },
  { num: '03', title: 'Review generation', desc: 'Reviews are the strongest local ranking signal you control. After every job, customers get a simple request — and you get alerts and reply templates.', items: ['Automatic review requests', 'New-review alerts', 'One-click reply templates', 'Review growth dashboard'] },
  { num: '04', title: 'Automated email & SMS marketing', desc: 'Your past customers are your cheapest new revenue. Seasonal campaigns — hurricane prep, summer AC, snowbird season — go out without you writing a word.', items: ['Done-for-you campaigns', 'Seasonal Florida promos', 'Segmented customer lists', 'Open & click tracking'] },
  { num: '05', title: 'Booking & CRM pipeline', desc: 'One place to see every lead and conversation, with online booking synced to your calendar and reminders that cut no-shows.', items: ['Visual lead pipeline', 'Online booking calendar', 'Automated reminders', 'Mobile app'] },
  { num: '06', title: 'Reporting that ties to revenue', desc: 'See which searches, ads, and campaigns turned into booked jobs — so you only pay for what works.', items: ['Lead-source tracking', 'Calls, forms & bookings in one view', 'Monthly strategy call', 'Your data, always'] },
];

export const Services = ({ cityName }) => (
  <section style={{ background: 'var(--paper-100)', padding: 'clamp(64px,8vw,104px) 0' }}>
    <Wrap>
      <Eyebrow>What we do{cityName ? ` in ${cityName}` : ''}</Eyebrow>
      <H2>Local SEO gets you found. Automation makes sure you get the job.</H2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 16, marginTop: 48 }}>
        {SERVICES.map(({ num, title, desc, items }) => (
          <div key={num} style={{ background: 'var(--paper-000)', border: '1px solid var(--border-hair)', borderRadius: 16,
            padding: '28px 26px', display: 'grid', gap: 14, alignContent: 'start' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.12em', color: 'var(--ink-400)' }}>{num}</span>
              <span style={{ width: 8, height: 8, borderRadius: 99, background: 'var(--ink-300)' }} />
            </div>
            <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.2 }}>{title}</h3>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.65, color: 'var(--ink-500)' }}>{desc}</p>
            <ul style={{ listStyle: 'none', margin: 0, padding: '14px 0 0', borderTop: '1px solid var(--border-hair)', display: 'grid', gap: 8 }}>
              {items.map((it) => (
                <li key={it} style={{ display: 'flex', gap: 10, fontSize: 13, lineHeight: 1.5, color: 'var(--ink-600)' }}>
                  <span aria-hidden="true" style={{ color: 'var(--ink-400)' }}>✓</span>{it}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Wrap>
  </section>
);

export const Process = () => (
  <section className="ll-grid-bg--inverse" style={{ background: 'var(--ink-900)', color: 'var(--paper-000)', padding: 'clamp(64px,8vw,104px) 0' }}>
    <Wrap>
      <Eyebrow light>How it works</Eyebrow>
      <H2 light>Live in about two weeks. Managed every month after.</H2>
      <div className="ll-grid-4" style={{ gap: 14, marginTop: 48 }}>
        {[
          ['01', 'Strategy call', 'We look at your Google profile, your local rankings, and how fast leads get a reply today.', '30 minutes'],
          ['02', 'Build', 'Profile, city pages, follow-up, review automation, and booking — set up for your service area.', 'Week 1'],
          ['03', 'Launch & test', 'We run test leads end-to-end and confirm every message, alert, and booking works.', 'Week 2'],
          ['04', 'Manage & grow', 'Monthly report and strategy call. We adjust pages, campaigns, and sequences based on results.', 'Ongoing'],
        ].map(([num, title, desc, when]) => (
          <div key={num} className="cfl-glass" style={{ padding: '24px 22px', display: 'grid', gap: 10, alignContent: 'start' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 26, fontWeight: 600, color: 'var(--ink-300)' }}>{num}</div>
            <div style={{ fontWeight: 700, fontSize: 17 }}>{title}</div>
            <div style={{ fontSize: 14, lineHeight: 1.6, color: 'rgba(245,242,235,0.7)' }}>{desc}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--paper-200)', marginTop: 4 }}>{when}</div>
          </div>
        ))}
      </div>
    </Wrap>
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
