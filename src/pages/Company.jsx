import React from 'react';
import Button from '../components/core/Button';
import { ArrowRight, FileText, Bank, Kanban, Megaphone } from '@phosphor-icons/react';
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

const ICONS = [FileText, Bank, Kanban, Megaphone].map((C) => <C key="i" size={22} weight="bold" />);

function Company({ onNavigate }) {
  const [imgOk, setImgOk] = React.useState(true);
  return (
    <main>
      {/* ── Hero: a compact founder quote ── */}
      <section className="ll-staple-wrap ll-staple-quote-hero">
        {imgOk ? (
          <div className="ll-staple-founder ll-bezel">
            <img src="/founder-david-selva.jpg" alt={`${SITE.founder}, founder of ${SITE.name}`} onError={() => setImgOk(false)} width={480} height={600} />
            <div className="ll-staple-founder-tag ll-glass">
              <div style={{ fontWeight: 700, color: 'var(--ink-900)' }}>{SITE.founder}</div>
              <div className="ll-staple-meta">Founder · Coamo, PR to Celebration, FL</div>
            </div>
          </div>
        ) : null}
        <div className="ll-staple-quote ll-glass" style={imgOk ? undefined : { gridColumn: '1 / -1' }}>
          <h1 style={{ margin: 0, font: 'inherit' }}><span className="ll-staple-kicker ll-staple-kicker--light">Meet the founder</span></h1>
          <blockquote>
            “Service delivery has been my career for the past 5 years. Now I deliver it for the
            businesses in my own backyard, because every local owner deserves a team that shows
            up, follows through and treats their business like family.”
          </blockquote>
          {imgOk ? null : (
            <div style={{ marginTop: 24 }}>
              <div style={{ fontWeight: 700, color: 'var(--ink-900)' }}>{SITE.founder}</div>
              <div className="ll-staple-meta">Founder · Coamo, PR to Celebration, FL</div>
            </div>
          )}
        </div>
      </section>

      {/* ── Disciplines ── */}
      <section className="ll-staple-wrap ll-staple-section">
        <div className="ll-staple-split">
          <div className="ll-staple-sticky">
            <span className="ll-eyebrow">Who I am as an entrepreneur</span>
            <h2 className="ll-staple-h2">What got <em>me here.</em></h2>
          </div>
          <ol className="ll-staple-list ll-bezel" style={{ background: 'var(--paper-000)' }}>
            {DISCIPLINES.map(([t, d], i) => (
              <li key={t}>
                <span className="ll-staple-num" aria-hidden="true">{ICONS[i]}</span>
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
        <div className="ll-staple-cta ll-forest">
          <img src="/team-photo.jpg" alt="Loogo Labs at work in Celebration, Florida" loading="lazy" decoding="async" />
          <div className="ll-staple-cta-body">
            <h2 className="ll-staple-h2">You talk to the founder, not a call center.</h2>
            <p>
              When you work with {SITE.name}, you get the person who designed the system and runs it.
              If you are a Central Florida business owner ready to stop losing leads, let's talk.
            </p>
            <div className="ll-staple-actions">
              <Button variant="primary" iconRight={<ArrowRight size={16} weight="bold" />} onClick={openBooking}>Book a free strategy call</Button>
              <button type="button" className="ll-staple-textlink" onClick={() => onNavigate('Mission')}>Read our mission <ArrowRight size={16} /></button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Company;
