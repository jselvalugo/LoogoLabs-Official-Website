import React from 'react';
import Badge from '../components/feedback/Badge';
import Button from '../components/core/Button';
import SectionHeading from '../components/surfaces/SectionHeading';
import Stat from '../components/surfaces/Stat';
import Card from '../components/surfaces/Card';
import Callout from '../components/feedback/Callout';
import Placeholder from '../components/website/Placeholder';

const copy = {
  'PropIQ': {
    industry: 'Real estate', headline: 'Underwrite a property in ninety seconds.',
    lede: 'Eleven years of county records, comparable sales and permit history, resolved into one number you can defend.',
    steps: [['01', 'Pull', 'Records, permits and comps arrive nightly from 412 counties.'],
            ['02', 'Resolve', 'Addresses, parcels and owners are matched to a single entity.'],
            ['03', 'Price', 'The model returns a value, a confidence band and its eleven drivers.']],
    stats: [['Median time to value', '90', 'sec'], ['Counties covered', '412', ''], ['Parcels indexed', '1,284', 'k']],
    caveat: 'County records lag by up to 30 days in three states. PropIQ flags stale inputs rather than smoothing over them.',
  },
  'CartCaddy': {
    industry: 'Golf', headline: 'The tee sheet stops breaking on Saturday.',
    lede: 'Golf operators run three systems that do not talk to each other. CartCaddy replaces the middle one. You keep your POS and your booking engine.',
    steps: [['01', 'Connect', 'Read-only links to your POS and booking engine, live in a day.'],
            ['02', 'Consolidate', 'One tee sheet, one member record, one cart inventory.'],
            ['03', 'Forecast', 'Weather, member load and shoulder-season pricing on one screen.']],
    stats: [['Courses live', '37', ''], ['Rounds per week', '41', 'k'], ['Saturday incidents', '0', '']],
    caveat: 'CartCaddy does not process payments. Your POS stays the system of record for money.',
  },
  'Distillr': {
    industry: 'Distilling', headline: "Every barrel accounted for, including the angels' share.",
    lede: 'Barrel inventory, warehouse position, evaporation loss and bottling runs in one ledger that satisfies your excise filing.',
    steps: [['01', 'Inventory', 'Barrel, rick, warehouse and fill date, scanned once.'],
            ['02', 'Track', 'Gauge readings and loss curves per warehouse position.'],
            ['03', 'File', 'Excise-ready reports generated from the same ledger.']],
    stats: [['Barrels tracked', '18.4', 'k'], ['Litres under management', '1.2', 'M'], ['Filing prep time', '-82', '%']],
    caveat: 'Excise formats are supported for TTB and HMRC. Other jurisdictions are manual for now.',
  },
};

const Wrap = ({ children, style }) => (
  <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 24px', ...style }}>{children}</div>
);

function ProductPage({ product = 'CartCaddy', onNavigate }) {
  const c = copy[product] || copy['CartCaddy'];
  return (
    <main>
      <section style={{ borderBottom: '1px solid var(--border-hair)' }}>
        <Wrap style={{ padding: '80px 24px 64px', display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 48, alignItems: 'center' }}>
          <div>
            <Badge tone="accent">{c.industry}</Badge>
            <h1 style={{ margin: '18px 0 0', fontWeight: 700, fontSize: 'var(--fs-display-2)', lineHeight: 'var(--lh-display-2)',
              letterSpacing: 'var(--ls-display-2)', maxWidth: '20ch' }}>{c.headline}</h1>
            <p style={{ maxWidth: '50ch', margin: '20px 0 0', fontSize: 'var(--fs-body-lg)', lineHeight: 'var(--lh-body-lg)', color: 'var(--ink-400)' }}>{c.lede}</p>
            <div style={{ display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap' }}>
              <Button variant="primary" iconRight={<span>→</span>} onClick={() => onNavigate('Pricing')}>See pricing</Button>
              <Button variant="secondary" onClick={() => onNavigate('Products')}>All products</Button>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-300)', marginTop: 20 }}>{product} · one application of the Loogo engine</div>
          </div>
          <Placeholder label="HERO IMAGE — SUPPLY REAL ASSET" height={340} />
        </Wrap>
      </section>

      <Wrap style={{ padding: '72px 24px' }}>
        <SectionHeading eyebrow="How it works" title="Three steps, no migration project" rule={false} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, marginTop: 36 }}>
          {c.steps.map(([n, t, d], i) => (
            <div key={n} style={{ padding: i ? '0 24px' : '0 24px 0 0', borderLeft: i ? '1px solid var(--border-hair)' : 'none' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.12em', color: 'var(--cyan-700)' }}>{n}</div>
              <h3 style={{ margin: '10px 0 8px', fontSize: 'var(--fs-h3)', letterSpacing: 'var(--ls-h3)' }}>{t}</h3>
              <p style={{ margin: 0, fontSize: 'var(--fs-body-sm)', lineHeight: 'var(--lh-body-sm)', color: 'var(--ink-400)' }}>{d}</p>
            </div>
          ))}
        </div>
      </Wrap>

      <section className="ll-grid-bg--inverse" style={{ backgroundColor: 'var(--ink-900)', color: 'var(--paper-100)' }}>
        <Wrap style={{ padding: '64px 24px', display: 'flex', gap: 0 }}>
          {c.stats.map(([l, v, u], i) => (
            <div key={l} style={{ flex: 1, paddingLeft: i ? 24 : 0, borderLeft: i ? '1px solid var(--border-hair-inverse)' : 'none' }}>
              <Stat label={l} value={v} unit={u} accent={i === 0} />
            </div>
          ))}
        </Wrap>
      </section>

      <Wrap style={{ padding: '64px 24px 96px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <Card emphasis="strong" padding={28} style={{ display: 'grid', gap: 12, alignContent: 'start' }}>
          <span className="ll-eyebrow">What you keep</span>
          <p style={{ margin: 0, fontSize: 'var(--fs-body)', lineHeight: 'var(--lh-body)' }}>
            Your existing stack stays where it is. Loogo reads from it, writes back only where you allow it, and can be removed in an afternoon.
          </p>
        </Card>
        <Callout tone="warn" title="Known limit">{c.caveat}</Callout>
      </Wrap>
    </main>
  );
}

export default ProductPage;
