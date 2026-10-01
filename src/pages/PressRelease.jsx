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

const SectionTitle = ({ eyebrow, title, lead }) => (
  <div style={{ marginBottom: 28 }}>
    <span className="ll-eyebrow" style={{ color: 'var(--cyan-700)' }}>{eyebrow}</span>
    <h2 style={{ margin: '10px 0 0', fontSize: 'var(--fs-h1, 32px)', lineHeight: 1.2, letterSpacing: '-0.02em', color: 'var(--ink-900)' }}>{title}</h2>
    {lead && <p style={{ margin: '12px 0 0', maxWidth: '60ch', fontSize: 'var(--fs-body)', lineHeight: 'var(--lh-body)', color: 'var(--ink-500)' }}>{lead}</p>}
  </div>
);

// Prices are ours; outlet lists describe the network, not guaranteed placements.
const WEB_PACKAGES = [
  {
    name: 'Web Distribution',
    price: '$149',
    unit: 'per release',
    blurb: 'You send the release, we format it, optimise it, and publish it across the news network.',
    features: ['350+ downstream news sites', 'Google News indexing', 'Editorial review & formatting', 'Full placement report with live links'],
  },
  {
    name: 'Written + Distributed',
    price: '$299',
    unit: 'per release',
    featured: true,
    blurb: 'We interview you, write the release, and distribute it. The easiest way to get your news out.',
    features: ['Everything in Web Distribution', 'Professionally written release (up to 500 words)', 'One round of revisions', 'Headline & SEO keyword optimisation'],
  },
  {
    name: 'Monthly PR Plan',
    price: '$449',
    unit: 'per month',
    blurb: 'Stay in the news every week. Ideal for businesses with regular launches, events, or updates.',
    features: ['Up to 4 releases per month', 'Written + distributed', 'Monthly placement summary', 'Cancel anytime'],
  },
];

const MEDIA_PACKAGES = [
  ['Local', '$249', 'One city, metro area, or state', 'USA & Canada'],
  ['Regional', '$299', 'A multi-state region', 'USA & Canada'],
  ['Nationwide', '$399', 'Journalists across one country', null],
  ['Global', '$549', 'Journalists worldwide', null],
];

const NETWORK = [
  'Hundreds of downstream news & business sites',
  'ABC, CBS, FOX & NBC affiliate TV and radio station sites',
  'Google News',
  'Premium add-on outlets such as AP News, USA Today, Barchart & StreetInsider',
];

const STEPS = [
  ['Book a quick call', 'Tell us what you are announcing and pick your package.'],
  ['We write or polish', 'Your release is edited for news standards and approved by you before it goes out.'],
  ['We distribute', 'Published across the network, and pitched to journalists if you chose media outreach.'],
  ['You get a report', 'A full list of live placements you can share with customers and on social.'],
];

function Check() {
  return <span style={{ color: 'var(--cyan-700)', fontWeight: 700, flexShrink: 0 }}>✓</span>;
}

function PressRelease() {
  return (
    <main>
      <Wrap style={{ padding: '72px 24px 56px', borderBottom: '1px solid var(--border-hair)' }}>
        <Badge tone="accent">Packaged service</Badge>
        <h1 style={{ margin: '18px 0 0', fontWeight: 700, fontSize: 'var(--fs-display-2)', lineHeight: 'var(--lh-display-2)',
          letterSpacing: 'var(--ls-display-2)', maxWidth: '22ch' }}>
          Get your business in the news.
        </h1>
        <p style={{ maxWidth: 'var(--container-narrow)', margin: '24px 0 0', fontSize: 'var(--fs-body-lg)', lineHeight: 'var(--lh-body-lg)', color: 'var(--ink-400)' }}>
          Press release writing and distribution to hundreds of news sites, broadcast affiliate pages, and
          industry journalists. Fixed prices, done for you, with a report of every placement.
        </p>
        <div style={{ marginTop: 32, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Button variant="primary" size="lg" iconRight={<span>→</span>} onClick={() => order('hero')}>Book a release</Button>
        </div>
      </Wrap>

      <Wrap style={{ padding: '64px 24px' }}>
        <SectionTitle eyebrow="Web distribution" title="Pick a package"
          lead="Every release goes out across our news distribution network and is indexed by Google News." />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
          {WEB_PACKAGES.map((p) => (
            <Card key={p.name} emphasis={p.featured ? 'strong' : undefined} padding={28}
              style={{ display: 'flex', flexDirection: 'column', gap: 16, ...(p.featured ? { borderColor: 'var(--cyan-700)' } : null) }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                <h3 style={{ margin: 0, fontSize: 18, color: 'var(--ink-900)' }}>{p.name}</h3>
                {p.featured && <Badge tone="accent">Recommended</Badge>}
              </div>
              <div>
                <span style={{ fontSize: 40, fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--ink-900)' }}>{p.price}</span>
                <span style={{ marginLeft: 6, fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-400)' }}>{p.unit}</span>
              </div>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: 'var(--ink-500)' }}>{p.blurb}</p>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8, flex: 1 }}>
                {p.features.map((f) => (
                  <li key={f} style={{ display: 'flex', gap: 10, fontSize: 14, color: 'var(--ink-700)' }}><Check />{f}</li>
                ))}
              </ul>
              <Button variant={p.featured ? 'primary' : 'secondary'} size="lg" fullWidth onClick={() => order(p.name)}>Get started</Button>
            </Card>
          ))}
        </div>
      </Wrap>

      <Wrap style={{ padding: '0 24px 64px' }}>
        <SectionTitle eyebrow="Web + media outreach" title="Put your story in front of journalists"
          lead="Everything in Web Distribution, plus targeted outreach to journalists and editors across five industry categories you choose. Priced per release." />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          {MEDIA_PACKAGES.map(([name, price, reach, note]) => (
            <Card key={name} padding={24} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <h3 style={{ margin: 0, fontSize: 16, color: 'var(--ink-900)' }}>{name}</h3>
              <span style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--ink-900)' }}>{price}</span>
              <p style={{ margin: 0, fontSize: 14, color: 'var(--ink-500)', flex: 1 }}>{reach}{note && <><br /><span style={{ fontSize: 12, color: 'var(--ink-400)' }}>{note} only</span></>}</p>
              <Button variant="secondary" fullWidth onClick={() => order(`Media ${name}`)}>Choose {name}</Button>
            </Card>
          ))}
        </div>
      </Wrap>

      <Wrap style={{ padding: '64px 24px', borderTop: '1px solid var(--border-hair)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 48 }}>
          <div>
            <SectionTitle eyebrow="The network" title="Where your release can appear" />
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 12 }}>
              {NETWORK.map((n) => <li key={n} style={{ display: 'flex', gap: 10, fontSize: 15, color: 'var(--ink-700)' }}><Check />{n}</li>)}
            </ul>
            <p style={{ margin: '16px 0 0', fontSize: 12, lineHeight: 1.6, color: 'var(--ink-400)' }}>
              Placement on any specific outlet is not guaranteed and depends on the outlet's editorial policies.
              Premium outlets are available as add-ons. Releases must meet news content guidelines.
            </p>
          </div>
          <div>
            <SectionTitle eyebrow="How it works" title="Four steps, no busywork" />
            <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 16 }}>
              {STEPS.map(([t, d], i) => (
                <li key={t} style={{ display: 'flex', gap: 16 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--cyan-700)', paddingTop: 3 }}>0{i + 1}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--ink-900)' }}>{t}</div>
                    <div style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--ink-500)' }}>{d}</div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Wrap>

      <Wrap style={{ padding: '0 24px 88px' }}>
        <Card emphasis="strong" padding={32} style={{ display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ maxWidth: '52ch' }}>
            <h2 style={{ margin: 0, fontSize: 24, color: 'var(--ink-900)' }}>Have news to share?</h2>
            <p style={{ margin: '8px 0 0', fontSize: 15, color: 'var(--ink-500)' }}>Book a 15-minute call and we will recommend the right package for your announcement.</p>
          </div>
          <Button variant="primary" size="lg" iconRight={<span>→</span>} onClick={() => order('footer')}>Book a call</Button>
        </Card>
      </Wrap>
    </main>
  );
}

export default PressRelease;
