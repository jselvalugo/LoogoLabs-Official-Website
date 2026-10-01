import React from 'react';
import Badge from '../components/feedback/Badge';
import Card from '../components/surfaces/Card';
import Button from '../components/core/Button';
import { openBooking } from '../lib/booking';

const Wrap = ({ children, style }) => (
  <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 24px', ...style }}>{children}</div>
);

const order = (pkg) => {
  if (window.fbq) window.fbq('track', 'InitiateCheckout', { content_name: pkg });
  openBooking();
};

const Eyebrow = ({ children, inverse }) => (
  <div className="ll-eyebrow" style={{ color: inverse ? 'var(--cyan-500)' : 'var(--cyan-700)', textAlign: 'center' }}>{children}</div>
);

const Heading = ({ children, inverse }) => (
  <h2 style={{ margin: '10px auto 32px', maxWidth: '24ch', textAlign: 'center', fontSize: 'clamp(26px,4vw,38px)', fontWeight: 700,
    lineHeight: 1.15, letterSpacing: '-0.03em', color: inverse ? 'var(--paper-000)' : 'var(--ink-900)' }}>{children}</h2>
);

// The value story: what a published release actually does for a business.
// Platforms are named as plain text, never logos, and nothing here promises a placement.
const VALUE = [
  {
    names: ['Google', 'Google News', 'Bing'],
    title: 'Show up when customers search your name',
    body: 'Published news pages stay on record, so anyone who looks you up finds a credible story, not just your own site.',
  },
  {
    names: ['ChatGPT', 'Claude', 'Gemini', 'Perplexity'],
    title: 'Be on the pages AI assistants read',
    body: 'Answer engines lean on published news as source material. A release gives them something about you to cite.',
  },
  {
    names: ['ABC', 'CBS', 'FOX', 'NBC affiliates'],
    title: 'Earn an "as seen on" you can share',
    body: 'Your placement report links to live news pages you can put on your site, socials, and sales decks.',
  },
];

const PACKAGES = [
  {
    name: 'Web Distribution',
    price: '$149',
    unit: 'per release',
    blurb: 'You write it, we polish and publish it.',
    features: ['350+ news & media sites', 'Google News indexing', 'Editorial review & formatting', 'Placement report with live links'],
  },
  {
    name: 'Written + Distributed',
    price: '$299',
    unit: 'per release',
    featured: true,
    blurb: 'We write it from a short interview, then publish it.',
    features: ['Everything in Web Distribution', 'Professionally written (up to 500 words)', 'One round of revisions', 'Headline & keyword optimisation'],
  },
  {
    name: 'Monthly PR Plan',
    price: '$449',
    unit: 'per month',
    blurb: 'Stay in the news every week.',
    features: ['Up to 4 releases a month', 'Written + distributed', 'Monthly placement summary', 'Cancel anytime'],
  },
];

const USES = ['Grand openings', 'New locations', 'Product & service launches', 'Awards & milestones', 'New hires & partnerships', 'Events & community work'];

const STEPS = [
  ['Book a call', 'Tell us your news.'],
  ['We write or polish', 'You approve before it goes out.'],
  ['We publish', 'Across the network and Google News.'],
  ['You get a report', 'Every live link, ready to share.'],
];

const FAQ = [
  ['How fast does it go live?', 'Most releases publish within 1–2 business days of your approval.'],
  ['Which sites will I appear on?', 'Your release is distributed across a network of 350+ news and media sites, including broadcast affiliate pages. Specific outlets are not guaranteed and depend on each outlet\'s editorial policies.'],
  ['Is this the same as getting featured by a journalist?', 'No. This is paid distribution of your announcement, not an earned story. It builds search presence and credibility; any journalist pickup is a bonus.'],
  ['What can\'t I publish?', 'Releases must be genuine news and meet content guidelines — no adult, gambling, or misleading claims. We will flag anything before it goes out.'],
];

const Check = () => <span style={{ color: 'var(--cyan-700)', fontWeight: 700, flexShrink: 0 }}>✓</span>;

function PressRelease() {
  return (
    <main>
      {/* ── HERO ── */}
      <Wrap style={{ padding: '64px 24px 48px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}><Badge tone="accent">Press release distribution</Badge></div>
        <h1 style={{ margin: '18px auto 0', fontWeight: 700, fontSize: 'var(--fs-display-2)', lineHeight: 'var(--lh-display-2)',
          letterSpacing: 'var(--ls-display-2)', maxWidth: '20ch' }}>
          Get your business in the news. <span style={{ color: 'var(--cyan-700)' }}>Starting at $149.</span>
        </h1>
        <p style={{ maxWidth: '56ch', margin: '18px auto 0', fontSize: 'var(--fs-body-lg)', lineHeight: 'var(--lh-body-lg)', color: 'var(--ink-500)' }}>
          We write, publish, and report on your press release across 350+ news sites — so customers, search engines,
          and AI assistants find a credible story when they look you up.
        </p>
        <div style={{ marginTop: 28, display: 'flex', justifyContent: 'center' }}>
          <Button variant="primary" size="lg" iconRight={<span>→</span>} onClick={() => order('hero')}>Book a release</Button>
        </div>
        <div style={{ marginTop: 18, fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-400)' }}>
          Fixed price · Live in 1–2 days · Full placement report
        </div>
      </Wrap>

      {/* ── WHY IT WORKS ── */}
      <section className="ll-grid-bg--inverse" style={{ background: 'var(--ink-900)', padding: '56px 0' }}>
        <Wrap>
          <Eyebrow inverse>Why it works</Eyebrow>
          <Heading inverse>Why businesses publish a release before their big month</Heading>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            {VALUE.map((v) => (
              <div key={v.title} style={{ background: 'var(--paper-000)', borderRadius: 'var(--radius-3)', padding: 24 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, paddingBottom: 16, borderBottom: '1px solid var(--border-hair)' }}>
                  {v.names.map((n) => (
                    <span key={n} style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-600)', background: 'var(--paper-200)',
                      borderRadius: 999, padding: '4px 10px' }}>{n}</span>
                  ))}
                </div>
                <h3 style={{ margin: '16px 0 8px', fontSize: 18, lineHeight: 1.25, color: 'var(--ink-900)' }}>{v.title}</h3>
                <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.6, color: 'var(--ink-500)' }}>{v.body}</p>
              </div>
            ))}
          </div>
        </Wrap>
      </section>

      {/* ── PACKAGES ── */}
      <Wrap style={{ padding: '56px 24px' }}>
        <Eyebrow>Pricing</Eyebrow>
        <Heading>Simple, fixed-price packages</Heading>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
          {PACKAGES.map((p) => (
            <Card key={p.name} emphasis={p.featured ? 'strong' : undefined} padding={24}
              style={{ display: 'flex', flexDirection: 'column', gap: 14, ...(p.featured ? { borderColor: 'var(--cyan-700)' } : null) }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                <h3 style={{ margin: 0, fontSize: 17, color: 'var(--ink-900)' }}>{p.name}</h3>
                {p.featured && <Badge tone="accent">Recommended</Badge>}
              </div>
              <div>
                <span style={{ fontSize: 36, fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--ink-900)' }}>{p.price}</span>
                <span style={{ marginLeft: 6, fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-400)' }}>{p.unit}</span>
              </div>
              <p style={{ margin: 0, fontSize: 14, color: 'var(--ink-500)' }}>{p.blurb}</p>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 7, flex: 1 }}>
                {p.features.map((f) => <li key={f} style={{ display: 'flex', gap: 10, fontSize: 14, color: 'var(--ink-700)' }}><Check />{f}</li>)}
              </ul>
              <Button variant={p.featured ? 'primary' : 'secondary'} size="lg" fullWidth onClick={() => order(p.name)}>Get started</Button>
            </Card>
          ))}
        </div>
      </Wrap>

      {/* ── USES + HOW IT WORKS ── */}
      <section style={{ background: 'var(--paper-100)', borderTop: '1px solid var(--border-hair)', borderBottom: '1px solid var(--border-hair)', padding: '48px 0' }}>
        <Wrap>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 40 }}>
            <div>
              <div className="ll-eyebrow" style={{ color: 'var(--cyan-700)' }}>Great for</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
                {USES.map((u) => (
                  <span key={u} style={{ fontSize: 14, color: 'var(--ink-700)', background: 'var(--paper-000)',
                    border: '1px solid var(--border-hair)', borderRadius: 999, padding: '6px 14px' }}>{u}</span>
                ))}
              </div>
            </div>
            <div>
              <div className="ll-eyebrow" style={{ color: 'var(--cyan-700)' }}>How it works</div>
              <ol style={{ listStyle: 'none', margin: '14px 0 0', padding: 0, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
                {STEPS.map(([t, d], i) => (
                  <li key={t} style={{ display: 'flex', gap: 10 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--cyan-700)', paddingTop: 2 }}>0{i + 1}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14.5, color: 'var(--ink-900)' }}>{t}</div>
                      <div style={{ fontSize: 13.5, color: 'var(--ink-500)' }}>{d}</div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Wrap>
      </section>

      {/* ── FAQ ── */}
      <Wrap style={{ padding: '56px 24px 40px', maxWidth: 760 }}>
        <Eyebrow>FAQ</Eyebrow>
        <Heading>Good questions</Heading>
        <div style={{ display: 'grid', gap: 10 }}>
          {FAQ.map(([q, a]) => (
            <details key={q} style={{ background: 'var(--paper-100)', border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-2)', padding: '14px 18px' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 700, fontSize: 15, color: 'var(--ink-900)' }}>{q}</summary>
              <p style={{ margin: '10px 0 0', fontSize: 14, lineHeight: 1.6, color: 'var(--ink-500)' }}>{a}</p>
            </details>
          ))}
        </div>
      </Wrap>

      {/* ── CTA ── */}
      <Wrap style={{ padding: '24px 24px 80px' }}>
        <Card emphasis="strong" padding={28} style={{ display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ maxWidth: '52ch' }}>
            <h2 style={{ margin: 0, fontSize: 22, color: 'var(--ink-900)' }}>Have news to share?</h2>
            <p style={{ margin: '6px 0 0', fontSize: 15, color: 'var(--ink-500)' }}>Book a 15-minute call and we'll get your release live this week.</p>
          </div>
          <Button variant="primary" size="lg" iconRight={<span>→</span>} onClick={() => order('footer')}>Book a release</Button>
        </Card>
      </Wrap>
    </main>
  );
}

export default PressRelease;
