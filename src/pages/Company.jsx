import React from 'react';
import Button from '../components/core/Button';
import { openBooking } from '../lib/booking';
import { SITE } from '../lib/seo';

// The Company page is about the founder: who is building Loogo Labs and the
// career that led here. It follows the Mission page's house style and reuses
// the same `ll-staple-*` building blocks from globals.css.

const DISCIPLINES = [
  ['Contract Lifecycle Management',
    'My day job is CLM inside legal tech: building the systems that move enterprise contracts from request to signature to renewal without a single approval falling through the cracks. It taught me that most business problems are process problems in disguise.'],
  ['Government contracting & consulting',
    'Working on government contracts and consulting engagements taught me to operate where compliance, documentation and deadlines are not optional. Every requirement is traced, every deliverable is accounted for, and nothing ships on a handshake.'],
  ['Project management',
    'Scoping, sequencing, managing stakeholders and landing work on time is how I run every Loogo Labs client. Discovery, setup, automations, training and support is a project plan, not a sales pitch.'],
  ['Marketing',
    'Years in performance marketing showed me where small businesses really leak money: slow follow-up, scattered tools and no system behind the leads they already paid for. Loogo Labs exists to close those leaks.'],
];

function Company({ onNavigate }) {
  const [imgOk, setImgOk] = React.useState(true);
  return (
    <main>
      {/* ── Hero: a compact founder quote ── */}
      <section className="ll-staple-hero">
        <div className="ll-hero-grid-bg" aria-hidden="true" />
        <div className="ll-staple-wrap" style={{ position: 'relative', padding: '56px 24px 48px', maxWidth: 760 }}>
          <h1 style={{ margin: 0, font: 'inherit' }}><span className="ll-staple-kicker"><span className="ll-live-dot" />Meet the founder</span></h1>
          <blockquote style={{ margin: '24px 0 0', fontSize: 'var(--fs-h2)', lineHeight: 1.35, fontWeight: 600, color: 'var(--paper-000)' }}>
            “Service delivery has been my career for the past 5 years. Now I deliver it for the
            businesses in my own backyard — because every local owner deserves a team that shows
            up, follows through and treats their business like family.”
          </blockquote>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 24 }}>
            {imgOk ? (
              <img src="/founder-david-selva.jpg" alt={`${SITE.founder}, founder of ${SITE.name}`} onError={() => setImgOk(false)}
                width={48} height={48}
                style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--paper-100)' }} />
            ) : null}
            <div>
              <div style={{ fontWeight: 700, color: 'var(--paper-000)' }}>{SITE.founder}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-300)' }}>
                Founder · Coamo, PR → Celebration, FL
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Disciplines ── */}
      <section className="ll-staple-wrap ll-staple-section">
        <div className="ll-staple-split">
          <div className="ll-staple-sticky">
            <span className="ll-eyebrow">Who I am as an entrepreneur</span>
            <h2 className="ll-staple-h2">What got me here.</h2>
          </div>
          <ol className="ll-staple-principles">
            {DISCIPLINES.map(([t, d], i) => (
              <li key={t}>
                <span className="ll-staple-num">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3>{t}</h3>
                  <p>{d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Closing CTA ── */}
      <section className="ll-staple-wrap" style={{ paddingBottom: 96 }}>
        <div className="ll-staple-cta">
          <img src="/team-photo.jpg" alt="Loogo Labs at work in Celebration, Florida" loading="lazy" decoding="async" />
          <div className="ll-staple-cta-body">
            <span className="ll-eyebrow" style={{ color: 'var(--ink-200)' }}>Work with me</span>
            <h2 className="ll-staple-h2" style={{ color: 'var(--paper-000)' }}>You talk to the founder, not a call center.</h2>
            <p>
              When you work with {SITE.name}, you get the person who designed the system and runs it.
              If you are a Central Florida business owner ready to stop losing leads, let's talk.
            </p>
            <div className="ll-staple-actions">
              <Button variant="primary" iconRight={<span>→</span>} onClick={openBooking}>Book a free strategy call</Button>
              <button type="button" className="ll-staple-textlink" onClick={() => onNavigate('Mission')}>Read our mission</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Company;
