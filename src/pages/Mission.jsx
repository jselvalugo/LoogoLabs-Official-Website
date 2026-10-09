import React from 'react';
import Button from '../components/core/Button';
import { ArrowRight, ArrowDown, CurrencyDollar, Target, HandHeart, Lifebuoy } from '@phosphor-icons/react';
import { openBooking } from '../lib/booking';

// The Mission page is the house style for editorial pages: floating forest hero,
// bento principles, sage stat strip, step cards, closing CTA panel.
// All of its building blocks are the reusable `ll-staple-*` classes in globals.css.

const TOOLS = ['CRM', 'Email marketing', 'Scheduling', 'Course platform', 'Social scheduler', 'Review requests', 'Forms & funnels', 'Invoicing'];

const PRINCIPLES = [
  ['Software should make you money, not cost more of it',
    'We got tired of watching good businesses overpay for disconnected tools that barely talk to each other. We brought it all under one roof and made sure the math works from day one.'],
  ['The outcome is the product',
    'The goal is never the software. More leads followed up, more deals closed, more content published without burning hours, and more time to work on the business instead of inside it.'],
  ['Done for you, not handed to you',
    'Every account is configured, automated and taught by us. Nothing is left for you to figure out alone.'],
  ['We stay until it runs itself',
    'We are not done until your operations run on their own, and 24/7 support is included the whole way there.'],
];

const STATS = [['10+', 'Tools replaced'], ['$400+', 'Saved every month'], ['24/7', 'Support included']];

const STEPS = [
  ['Discovery', 'We learn your business: what tools you pay for, what costs you the most, and what the platform has to do first.'],
  ['Setup', 'We configure your account, build your pipelines, import your contacts and connect your existing systems.'],
  ['Automations', 'We build the workflows that matter most first: lead follow-up, appointment reminders, review requests.'],
  ['Training', 'We walk your team through the platform until everyone is confident, with recordings, guides and a direct line to us.'],
  ['Ongoing support', '24/7 support, always. As your business grows, the platform grows with it.'],
];

const ICONS = [CurrencyDollar, Target, HandHeart, Lifebuoy];
function Icon({ i }) { const C = ICONS[i]; return <C size={20} weight="bold" />; }

function Mission({ onNavigate }) {
  return (
    <main>
      {/* ── Hero ── */}
      <section className="ll-staple-wrap ll-staple-hero">
        <div className="ll-staple-hero-panel ll-forest">
          <div className="ll-hero-grid-bg" aria-hidden="true" />
          <div className="ll-staple-hero-inner">
            <div>
              <span className="ll-staple-kicker">Our mission</span>
              <h1 className="ll-staple-title">
                Running a business shouldn’t take <em>15 different tools.</em>
              </h1>
              <p className="ll-staple-lede">
                Most owners log into 10-15 platforms every day just to run basic operations. We built a
                better way, and we handle every step of getting you set up, trained and growing on it.
              </p>
              <div className="ll-staple-actions">
                <Button variant="primary" iconRight={<ArrowRight size={16} weight="bold" />} onClick={openBooking}>Book a free strategy call</Button>
              </div>
            </div>
            <div className="ll-staple-collapse ll-glass--dark" aria-label="Many tools replaced by one platform">
              <ul>
                {TOOLS.map((t) => <li key={t}>{t}</li>)}
              </ul>
              <div className="ll-staple-collapse-arrow" aria-hidden="true"><ArrowDown size={22} /></div>
              <div className="ll-staple-collapse-one">One platform. Set up for you.</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Principles ── */}
      <section className="ll-staple-wrap ll-staple-section">
        <div className="ll-staple-split">
          <div className="ll-staple-sticky">
            <span className="ll-eyebrow">What we believe</span>
            <h2 className="ll-staple-h2">Four principles behind <em>everything we build.</em></h2>
          </div>
          <ol className="ll-staple-principles">
            {PRINCIPLES.map(([t, d], i) => (
              <li key={t} className={`ll-reveal${i === 1 ? ' ll-staple-tile--sage' : i === 2 ? ' ll-staple-tile--glass' : ''}`}>
                <span className="ll-staple-num" aria-hidden="true"><Icon i={i} /></span>
                <h3>{t}</h3>
                <p>{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Stat band ── */}
      <section className="ll-staple-wrap ll-staple-band">
        <div className="ll-staple-stats ll-sage">
          {STATS.map(([v, l]) => (
            <div key={l}>
              <div className="ll-staple-stat-value">{v}</div>
              <div className="ll-staple-stat-label">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="ll-staple-wrap ll-staple-section">
        <h2 className="ll-staple-h2">Five steps. <em>Done for you, every time.</em></h2>
        <p className="ll-staple-sub">Every client goes through the same proven process. You never have to figure it out alone.</p>
        <ol className="ll-staple-timeline">
          {STEPS.map(([t, d], i) => (
            <li key={t} className="ll-glass ll-reveal">
              <span className="ll-staple-node">Step {i + 1}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ── Closing CTA ── */}
      <section className="ll-staple-wrap" style={{ paddingBottom: 96 }}>
        <div className="ll-staple-cta ll-forest">
          <img src="/team-photo.jpg" alt="The Loogo Labs team at work" />
          <div className="ll-staple-cta-body">
            <h2 className="ll-staple-h2">We stay close to every client.</h2>
            <p>
              We keep our client list intentional. If you are a local business, service provider or
              online brand tired of the tool chaos, this conversation is worth 15 minutes. We will tell
              you exactly what the platform can do for you, no pitch deck required.
            </p>
            <div className="ll-staple-actions">
              <Button variant="primary" iconRight={<ArrowRight size={16} weight="bold" />} onClick={openBooking}>Book a free strategy call</Button>
              <button type="button" className="ll-staple-textlink" onClick={() => onNavigate('Home')}>Back to home <ArrowRight size={16} /></button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Mission;
