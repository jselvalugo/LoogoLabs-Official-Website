import React from 'react';
import Badge from '../components/feedback/Badge';
import Button from '../components/core/Button';
import Stat from '../components/surfaces/Stat';
import SectionHeading from '../components/surfaces/SectionHeading';
import Card from '../components/surfaces/Card';

const Wrap = ({ children, style }) => (
  <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 24px', ...style }}>{children}</div>
);

const engine = [
  ['01', 'Analysis', 'We turn operational records into clear, defensible answers — not dashboards nobody checks, but outputs operators can act on and explain to anyone who asks.'],
  ['02', 'Reporting', 'Audit-ready outputs generated from the same data that runs the operation. No manual prep, no reconciliation before the deadline.'],
  ['03', 'Operations', 'Built around the workflows your team already runs. Nothing requires a migration or a change in how the business operates day to day.'],
  ['04', 'Industry fit', 'Deployed in sectors where enterprise software has historically been absent or wrong — where the gap between what exists and what is needed is widest.'],
];

function Home({ onNavigate }) {
  return (
    <main>
      <section className="ll-grid-bg--inverse" style={{ backgroundColor: 'var(--ink-900)', color: 'var(--paper-100)', padding: '104px 0 0' }}>
        <Wrap>
          <Badge tone="inverse">Loogo Labs · Applied AI</Badge>
          <h1 style={{ margin: '20px 0 0', fontWeight: 700, fontSize: 'var(--fs-display-1)', lineHeight: 'var(--lh-display-1)',
            letterSpacing: 'var(--ls-display-1)', maxWidth: '17ch' }}>
            Your data exists. We make it <span style={{ color: 'var(--cyan-500)' }}>work</span>.
          </h1>
          <p style={{ maxWidth: '56ch', margin: '26px 0 0', fontSize: 'var(--fs-body-lg)', lineHeight: 'var(--lh-body-lg)', color: 'var(--ink-300)' }}>
            Most businesses already have the data they need to make better decisions — it is just
            trapped in formats nobody can read. Loogo Labs builds the engine that unlocks it, and
            deploys it where the records are worst and the stakes are highest.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 32, flexWrap: 'wrap' }}>
            <Button variant="primary" size="lg" iconRight={<span>→</span>} onClick={() => onNavigate('Mission')}>Read our mission</Button>
          </div>
          <div style={{ display: 'flex', gap: 0, marginTop: 80, borderTop: '1px solid var(--border-hair-inverse)' }}>
            {[['Founded', '2026', ''], ['Customers served', '10', ''], ['Industries live', '3+', '']].map(([l, v, u], i) => (
              <div key={l} style={{ flex: 1, padding: '24px 0 44px', paddingLeft: i ? 24 : 0,
                borderLeft: i ? '1px solid var(--border-hair-inverse)' : 'none' }}>
                <Stat label={l} value={v} unit={u} />
              </div>
            ))}
          </div>
        </Wrap>
      </section>

      <Wrap style={{ padding: '96px 24px 0' }}>
        <SectionHeading eyebrow="What we do" title="Software for analysis and reporting in industries that were left behind"
          description="We build operational applications for sectors where enterprise vendors never showed up. The outputs are built for the people running the business — not the people selling to them." />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginTop: 36 }}>
          {engine.map(([n, t, d]) => (
            <Card key={n} padding={24} tone="inverse" style={{ display: 'grid', gap: 12, alignContent: 'start' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.12em', color: 'var(--cyan-500)' }}>{n}</div>
              <h3 style={{ margin: 0, fontSize: 'var(--fs-h3)', letterSpacing: 'var(--ls-h3)', color: 'var(--paper-100)' }}>{t}</h3>
              <p style={{ margin: 0, fontSize: 'var(--fs-body-sm)', lineHeight: 'var(--lh-body-sm)', color: 'var(--ink-300)' }}>{d}</p>
            </Card>
          ))}
        </div>
      </Wrap>

      <Wrap style={{ padding: '96px 24px' }}>
        <span className="ll-eyebrow" style={{ color: 'var(--ink-400)' }}>How we work</span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24, marginTop: 24 }}>
          {[['Explainable by default', 'Every output ships with the inputs that produced it. Operators can check the work — and so can their auditors.'],
            ['Read before write', 'We connect read-only first. Nothing writes back to your systems until you explicitly allow it.'],
            ['No lock-in', 'No migration project required to get started, and no hostage situation if you want to leave. Loogo can be removed in an afternoon.'],
            ['Priced per real thing', 'Billed on units your business already counts, not on seats or API calls that nobody can explain to finance.']].map(([k, v]) => (
            <Card key={k} padding={24} emphasis="strong">
              <div style={{ fontSize: 'var(--fs-body)', fontWeight: 600 }}>{k}</div>
              <div style={{ fontSize: 'var(--fs-body-sm)', lineHeight: 'var(--lh-body-sm)', color: 'var(--ink-400)', marginTop: 6 }}>{v}</div>
            </Card>
          ))}
        </div>
      </Wrap>

    </main>
  );
}

export default Home;
