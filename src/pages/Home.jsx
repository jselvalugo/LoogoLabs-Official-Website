import React from 'react';
import Badge from '../components/feedback/Badge';
import Button from '../components/core/Button';
import Stat from '../components/surfaces/Stat';
import SectionHeading from '../components/surfaces/SectionHeading';
import Card from '../components/surfaces/Card';
import { openBooking } from '../lib/booking';

const Wrap = ({ children, style }) => (
  <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 24px', ...style }}>{children}</div>
);

const features = [
  ['01', 'CRM & Contacts', 'Manage every lead, client, and conversation in one place. No more juggling spreadsheets and disconnected inboxes — every contact, every pipeline stage, fully organized.'],
  ['02', 'Email & SMS Marketing', 'Send campaigns, automate follow-ups, and reach your audience where they are. Build sequences that run while you sleep and never miss a lead again.'],
  ['03', 'Social Media & AI Content', 'Schedule posts across every platform and generate content with 60+ AI-powered prompts. Stay consistent and visible without spending hours online every week.'],
  ['04', 'Courses, Payments & Automation', 'Sell courses, build membership communities, collect payments, and automate your entire workflow — all without duct-taping a dozen apps together.'],
];

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

function Home({ onNavigate }) {
  return (
    <main>
      <section className="ll-grid-bg--inverse" style={{ backgroundColor: 'var(--ink-900)', color: 'var(--paper-100)', padding: '80px 0 0' }}>
        <Wrap>
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

      <Wrap style={{ padding: '72px 24px 0' }}>
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

      <Wrap style={{ padding: '72px 24px' }}>
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

      <ReferencesTicker />
    </main>
  );
}

export default Home;
