import React from 'react';
import Badge from '../components/feedback/Badge';
import Button from '../components/core/Button';
import Stat from '../components/surfaces/Stat';
import SectionHeading from '../components/surfaces/SectionHeading';
import Card from '../components/surfaces/Card';
import { openBooking } from '../lib/booking';
import { SITE } from '../lib/seo';

const Wrap = ({ children, style }) => (
  <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 24px', ...style }}>{children}</div>
);

const features = [
  ['01', 'CRM & Contacts', 'Manage every lead, client, and conversation in one place. No more juggling spreadsheets and disconnected inboxes — every contact, every pipeline stage, fully organized.'],
  ['02', 'Email & SMS Marketing', 'Send campaigns, automate follow-ups, and reach your audience where they are. Build sequences that run while you sleep and never miss a lead again.'],
  ['03', 'Social Media & AI Content', 'Schedule posts across every platform and generate content with 60+ AI-powered prompts. Stay consistent and visible without spending hours online every week.'],
  ['04', 'Courses, Payments & Automation', 'Sell courses, build membership communities, collect payments, and automate your entire workflow — all without duct-taping a dozen apps together.'],
];

const voiceBotFeatures = [
  'Answers every call',
  'Books straight to your calendar',
  'Qualifies & routes leads',
  'Texts back missed calls',
];

function VoiceBotSection() {
  return (
    <section className="ll-voicebot" style={{ position: 'relative', overflow: 'hidden', color: 'var(--paper-100)' }}>
      <div className="ll-voicebot-glow" aria-hidden="true" />
      <Wrap style={{ padding: '44px 24px', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="ll-live-dot" aria-hidden="true" />
          <Badge tone="inverse">AI Voice Bot · Try it live</Badge>
        </div>
        <div className="ll-grid-2" style={{ gap: 24, alignItems: 'center', marginTop: 14 }}>
          <div>
            <h2 style={{ margin: 0, fontWeight: 700, fontSize: 'var(--fs-h2)', lineHeight: 'var(--lh-h2)', maxWidth: '24ch' }}>
              It answers the phone <span style={{ color: 'var(--cyan-500)' }}>so you don't have to.</span>
            </h2>
            <p style={{ maxWidth: '50ch', margin: '10px 0 0', fontSize: 'var(--fs-body)', lineHeight: 'var(--lh-body)', color: 'var(--ink-200)' }}>
              Picks up every call, books the appointment, and texts back anyone it misses — 24/7, without hiring another employee.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}>
            <Button variant="primary" size="lg" iconRight={<span>→</span>} onClick={openBooking}>Test the AI Voice Bot</Button>
            <span style={{ fontSize: 12, lineHeight: 1.4, color: 'var(--ink-300)' }}>
              Book a slot and we'll set up a live call so you can hear it in action.
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 28px', marginTop: 24, paddingTop: 18, borderTop: '1px solid var(--border-hair-inverse)' }}>
          {voiceBotFeatures.map((t) => (
            <span key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--ink-200)' }}>
              <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--cyan-500)', flex: 'none' }} />
              {t}
            </span>
          ))}
        </div>
      </Wrap>
    </section>
  );
}

const REFERENCES = ['Feche Consulting', 'DaLife, LLC', 'House of Cars', 'Reef Ntwrks', 'Lugo’s Craft Distillery'];

function ReferencesTicker() {
  const items = [...REFERENCES, ...REFERENCES];
  return (
    <div className="ll-ticker-bar" role="region" aria-label="Selected clients">
      <div className="ll-ticker-label"><span className="ll-ticker-live" aria-hidden="true" />In good company</div>
      <div className="ll-ticker-belt">
        <div className="ll-ticker-track">
          {items.map((name, i) => (
            <React.Fragment key={i}>
              <span className="ll-ticker-ref">{name}</span>
              <span className="ll-ticker-sep" aria-hidden="true" />
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

// A direct line to the founder, as a low-commitment counterpoint to the booking
// CTA that every other surface pushes. The mailto is a real link, so it also
// backs the email on the Organization entity.
function FounderNote() {
  const [hover, setHover] = React.useState(false);
  // width:100% — Home's <main> is a column flex container, and Wrap's auto side
  // margins suppress cross-axis stretch, so a Wrap shrinks to its content unless
  // it is wide enough to hit --container-max. Without this the rules below would
  // sit narrower than every other section on the page.
  return (
    <Wrap style={{ width: '100%', padding: '8px 24px 24px' }}>
      <div style={{
        borderTop: '1px solid var(--border-hair)',
        borderBottom: '1px solid var(--border-hair)',
        padding: '36px 0',
        display: 'flex', flexWrap: 'wrap', gap: 32,
        alignItems: 'flex-end', justifyContent: 'space-between',
      }}>
        <div>
          <span className="ll-eyebrow" style={{ color: 'var(--ink-400)' }}>Talk to a person</span>
          <p style={{ margin: '14px 0 0', maxWidth: '38ch', fontSize: 'var(--fs-body)',
            lineHeight: 'var(--lh-body)', color: 'var(--ink-600)' }}>
            Not ready to book a call? Email me directly. It lands in my inbox, not a
            ticket queue, and I answer it myself.
          </p>
        </div>
        <div style={{ display: 'grid', gap: 10, justifyItems: 'start' }}>
          <a
            href={`mailto:${SITE.email}`}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 12,
              fontSize: 'var(--fs-h3)', fontWeight: 700, letterSpacing: 'var(--ls-h3)',
              color: hover ? 'var(--cyan-700)' : 'var(--ink-900)',
              textDecoration: 'none',
              borderBottom: '2px solid ' + (hover ? 'var(--cyan-500)' : 'var(--border-strong)'),
              paddingBottom: 4,
              transition: 'color var(--dur-fast) var(--ease-standard), border-color var(--dur-fast) var(--ease-standard)',
            }}
          >
            {SITE.email}
            <span aria-hidden="true" style={{
              transform: hover ? 'translateX(3px)' : 'none',
              transition: 'transform var(--dur-fast) var(--ease-standard)',
            }}>→</span>
          </a>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: 'var(--ink-400)' }}>
            {SITE.founder} · Founder
          </span>
        </div>
      </div>
    </Wrap>
  );
}

function Home({ onNavigate }) {
  return (
    <main style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <section style={{ position: 'relative', backgroundColor: 'var(--ink-900)', color: 'var(--paper-100)', padding: '80px 0 0' }}>
        <div className="ll-hero-grid-bg" aria-hidden="true" />
        <Wrap style={{ position: 'relative', zIndex: 1 }}>
          <Badge tone="inverse">Loogo Labs · All-In-One Platform</Badge>
          <h1 style={{ margin: '20px 0 0', fontWeight: 700, fontSize: 'var(--fs-display-1)', lineHeight: 'var(--lh-display-1)',
            letterSpacing: 'var(--ls-display-1)', maxWidth: '20ch' }}>
            Launch, Grow & Automate Your Business — <span style={{ color: 'var(--cyan-500)' }}>All in One Place</span>.
          </h1>
          <p style={{ maxWidth: '52ch', margin: '24px 0 0', fontSize: 'var(--fs-body-lg)', lineHeight: 'var(--lh-body-lg)', color: 'var(--ink-300)' }}>
            Stop paying for 10–15 different tools that barely talk to each other. Our all-in-one
            platform gives you CRM, email & SMS marketing, social media, courses, and automation — in one dashboard.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 32, flexWrap: 'wrap' }}>
            <Button variant="primary" size="lg" iconRight={<span>→</span>} onClick={openBooking}>Book a free strategy call</Button>
            <Button variant="secondary" size="lg" onClick={() => onNavigate('Mission')}>See what's included</Button>
          </div>
          <div className="ll-hero-stats" style={{ display: 'flex', gap: 0, marginTop: 64, borderTop: '1px solid var(--border-hair-inverse)' }}>
            {[['Tools replaced', '10+', ''], ['Monthly savings', '$400+', ''], ['Support', '24/7', '']].map(([l, v, u], i) => (
              <div key={l} style={{ flex: 1, padding: '20px 0 32px', paddingLeft: i ? 24 : 0,
                borderLeft: i ? '1px solid var(--border-hair-inverse)' : 'none' }}>
                <Stat label={l} value={v} unit={u} />
              </div>
            ))}
          </div>
        </Wrap>
      </section>

      <Wrap style={{ padding: '40px 24px 0' }}>
        <SectionHeading eyebrow="What's included" title="Everything your business needs to grow — under one roof"
          description="We built one platform that replaces your CRM, your email tool, your scheduling app, your course platform, your social scheduler, and more. One login. One monthly bill." />
        <div className="ll-grid-4" style={{ gap: 16, marginTop: 36 }}>
          {features.map(([n, t, d]) => (
            <Card key={n} padding={24} tone="inverse" style={{ display: 'grid', gap: 12, alignContent: 'start' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.12em', color: 'var(--cyan-500)' }}>{n}</div>
              <h3 style={{ margin: 0, fontSize: 'var(--fs-h3)', letterSpacing: 'var(--ls-h3)', color: 'var(--paper-100)' }}>{t}</h3>
              <p style={{ margin: 0, fontSize: 'var(--fs-body-sm)', lineHeight: 'var(--lh-body-sm)', color: 'var(--ink-300)' }}>{d}</p>
            </Card>
          ))}
        </div>
      </Wrap>

      <VoiceBotSection />

      <Wrap style={{ padding: '40px 24px' }}>
        <span className="ll-eyebrow" style={{ color: 'var(--ink-400)' }}>Why clients switch</span>
        <div className="ll-grid-2" style={{ gap: 24, marginTop: 24 }}>
          {[['Replace 10–15+ tools', 'One login. One dashboard. One monthly bill. Stop paying for Mailchimp, ClickFunnels, Teachable, Calendly, and 10 other tools separately.'],
            ['Save $400–$500 a month', 'Most clients cut more than $400 in monthly subscriptions on day one. The platform pays for itself before your first campaign goes out.'],
            ['24/7 real support included', 'Live support from people who actually know the platform — not a chatbot, not a ticket queue. A real person who picks up and gets it done.'],
            ['Done-for-you setup', 'We handle the full onboarding. You walk in on day one with your account configured, your automations live, and your first campaign ready to send.']].map(([k, v]) => (
            <Card key={k} padding={24} emphasis="strong">
              <div style={{ fontSize: 'var(--fs-body)', fontWeight: 600 }}>{k}</div>
              <div style={{ fontSize: 'var(--fs-body-sm)', lineHeight: 'var(--lh-body-sm)', color: 'var(--ink-400)', marginTop: 6 }}>{v}</div>
            </Card>
          ))}
        </div>
      </Wrap>

      <FounderNote />

      <ReferencesTicker />
    </main>
  );
}

export default Home;
