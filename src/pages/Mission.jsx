import React from 'react';
import Badge from '../components/feedback/Badge';
import SectionHeading from '../components/surfaces/SectionHeading';
import Stat from '../components/surfaces/Stat';
import Placeholder from '../components/website/Placeholder';
import Card from '../components/surfaces/Card';
import Button from '../components/core/Button';

const Wrap = ({ children, style }) => (
  <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 24px', ...style }}>{children}</div>
);

function Mission({ onNavigate }) {
  return (
    <main>
      <Wrap style={{ padding: '80px 24px 64px', borderBottom: '1px solid var(--border-hair)' }}>
        <Badge tone="accent">Mission</Badge>
        <h1 style={{ margin: '18px 0 0', fontWeight: 700, fontSize: 'var(--fs-display-2)', lineHeight: 'var(--lh-display-2)',
          letterSpacing: 'var(--ls-display-2)', maxWidth: '24ch' }}>
          The data already exists. The problem is it was never meant to be read.
        </h1>
        <p style={{ maxWidth: 'var(--container-narrow)', margin: '24px 0 0', fontSize: 'var(--fs-body-lg)', lineHeight: 'var(--lh-body-lg)', color: 'var(--ink-400)' }}>
          Most businesses are sitting on years of operational data — exports, documents, system logs —
          that nobody has ever been able to query in a useful way. The people who need answers from
          that data are the same ones without time to clean it. That is the gap Loogo Labs works in.
        </p>
      </Wrap>

      <Wrap style={{ padding: '72px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
          <div>
            <SectionHeading eyebrow="What we believe" title="An answer without its reasoning is not an answer" rule={false} level={2} />
            <p style={{ fontSize: 'var(--fs-body)', lineHeight: 'var(--lh-body)', color: 'var(--ink-600)', marginTop: 20 }}>
              Every output Loogo produces carries the inputs and logic behind it. Operators need to
              be able to explain their decisions to boards, lenders, and regulators — a number with
              no lineage is useless to them. We would rather be inspectable than impressive.
            </p>
            <p style={{ fontSize: 'var(--fs-body)', lineHeight: 'var(--lh-body)', color: 'var(--ink-600)' }}>
              We also believe software should be removable. Loogo connects read-only, writes back
              only where you permit it, and can be taken out in an afternoon. Lock-in is not a
              product strategy — it is a failure of confidence.
            </p>
          </div>
          <div>
            <SectionHeading eyebrow="How we choose what to build" title="We start with the data problem, not the industry" rule={false} level={2} />
            <p style={{ fontSize: 'var(--fs-body)', lineHeight: 'var(--lh-body)', color: 'var(--ink-600)', marginTop: 20 }}>
              We look for three things: records that exist but cannot be read, a decision downstream
              worth real money, and operators willing to work closely with us while we get it right.
              When all three align, there is a product. Industry comes second.
            </p>
            <p style={{ fontSize: 'var(--fs-body)', lineHeight: 'var(--lh-body)', color: 'var(--ink-600)' }}>
              The underlying engine does not change between deployments. Only the vocabulary does —
              the data formats, the entity types, the outputs that matter. The hard part is built once.
            </p>
          </div>
        </div>
      </Wrap>

      <section className="ll-grid-bg--inverse" style={{ backgroundColor: 'var(--ink-900)', color: 'var(--paper-100)' }}>
        <Wrap style={{ padding: '72px 24px', display: 'flex', gap: 0 }}>
          {[['Founded', '2026', ''], ['Customers served', '10', ''], ['Industries live', '3+', '']].map(([l, v, u], i) => (
            <div key={l} style={{ flex: 1, paddingLeft: i ? 24 : 0, borderLeft: i ? '1px solid var(--border-hair-inverse)' : 'none' }}>
              <Stat label={l} value={v} unit={u} />
            </div>
          ))}
        </Wrap>
      </section>

      <Wrap style={{ padding: '72px 24px', borderBottom: '1px solid var(--border-hair)' }}>
        <SectionHeading eyebrow="How every engagement runs" title="Five phases. The same every time." description="Every product we have built came out of this process. The phases do not change. The vocabulary does." />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginTop: 36 }}>
          {[
            ['01', 'Discovery', 'We map what records exist, where they live, and what decision they are meant to feed. We look before we plan.'],
            ['02', 'Readiness', 'We audit your data access, confirm system reach, and make sure we fully understand the project. Nothing moves to build until we can answer the problem without guessing.'],
            ['03', 'Buildout', 'The engine is configured for your vocabulary — your entity types, data formats, and output definitions. The underlying logic does not change; only the layer on top of it does.'],
            ['04', 'Testing', 'Outputs are checked against known data. Operators review edge cases. Confidence bands are stress-tested before anything touches production.'],
            ['05', 'Go-Live', 'The answer lands in the tool your team already uses. We stay close through the first weeks and adjust as real data comes in.'],
          ].map(([n, t, d]) => (
            <Card key={n} padding={22} tone="inverse" style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.12em', color: 'var(--cyan-500)' }}>{n}</div>
              <h3 style={{ margin: 0, fontSize: 'var(--fs-h3)', letterSpacing: 'var(--ls-h3)', color: 'var(--paper-100)' }}>{t}</h3>
              <p style={{ margin: 0, fontSize: 'var(--fs-body-sm)', lineHeight: 'var(--lh-body-sm)', color: 'var(--ink-300)' }}>{d}</p>
            </Card>
          ))}
        </div>
      </Wrap>

      <Wrap style={{ padding: '72px 24px 96px' }}>
        <SectionHeading eyebrow="The company" title="We stay close to the problem" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 36 }}>
          <Placeholder label="TEAM PHOTO — SUPPLY REAL ASSET" height={300} />
          <Card emphasis="strong" padding={28} style={{ display: 'grid', gap: 16, alignContent: 'start' }}>
            <span className="ll-eyebrow">Working with us</span>
            <p style={{ margin: 0, fontSize: 'var(--fs-body)', lineHeight: 'var(--lh-body)' }}>
              We take on a small number of engagements per year and stay close to each one. The
              work is only useful if the outputs are trusted — and trust takes time. If your
              operational data is a mess and the decisions it feeds are expensive, that is exactly
              the conversation we want to have.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Button variant="primary" iconRight={<span>→</span>} onClick={() => onNavigate('Contact')}>Talk to us</Button>
              <Button variant="secondary" onClick={() => onNavigate('Home')}>Back to home</Button>
            </div>
          </Card>
        </div>
      </Wrap>
    </main>
  );
}

export default Mission;
