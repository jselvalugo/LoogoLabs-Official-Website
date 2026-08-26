import React from 'react';
import Badge from '../components/feedback/Badge';
import Button from '../components/core/Button';
import Callout from '../components/feedback/Callout';
import Link from '../components/core/Link';

const Wrap = ({ children, style }) => (
  <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '72px 24px 96px', ...style }}>{children}</div>
);

const posts = [
  {
    badge: 'Coming Soon',
    date: '——.——.2026',
    product: 'Distillr Software',
    author: 'David Selva',
    title: 'Every barrel tracked. Every filing ready.',
    lede: 'Distillr Software is our operational platform for craft and independent distillers — barrel inventory, warehouse management, loss tracking, and excise filing in one ledger.',
    body: 'Most distillers run their operation across spreadsheets, a whiteboard, and whatever the warehouse manager remembers. Distillr replaces that with a single ledger that knows where every barrel is, what it weighs, and what it owes the regulator. It connects read-only to your existing systems first, and nothing writes back until you say so.',
    rows: [
      ['Barrel tracking', 'Full inventory by rick, warehouse position, and fill date — scanned once, maintained automatically.'],
      ['Loss curves', 'Automated evaporation tracking per position. The angels share is accounted for, not estimated.'],
      ['Excise filing', 'TTB and HMRC-ready reports generated from the same ledger that runs the operation. No separate prep.'],
      ['Audit trail', 'Every gauge reading, every barrel movement, every status change — timestamped and exportable.'],
    ],
    availability: 'Distillr Software is not publicly available yet. We are working closely with a small group of distilleries ahead of release. If you want to be part of that group, get in touch.',
  },
];

function LaunchPost({ onNavigate }) {
  const p = posts[0];
  return (
    <Wrap>
      <div style={{ display: 'grid', gridTemplateColumns: '200px minmax(0, var(--container-narrow))', gap: 48 }}>
        <aside style={{ display: 'grid', gap: 10, alignContent: 'start', fontFamily: 'var(--font-mono)', fontSize: 11,
          letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-400)' }}>
          <span>Launch notes</span>
          <span>{p.product}</span>
          <span style={{ borderTop: '1px solid var(--border-hair)', paddingTop: 10 }}>Written by<br /><span style={{ color: 'var(--ink-900)' }}>{p.author}</span></span>
          <span style={{ borderTop: '1px solid var(--border-hair)', paddingTop: 10 }}>Status<br /><span style={{ color: 'var(--status-warn)' }}>Not yet launched</span></span>
        </aside>
        <article>
          <Badge tone="warn">{p.badge}</Badge>
          <h1 style={{ margin: '18px 0 0', fontWeight: 700, fontSize: 'var(--fs-display-3)', lineHeight: 'var(--lh-display-3)', letterSpacing: 'var(--ls-display-3)' }}>{p.title}</h1>
          <p style={{ fontSize: 'var(--fs-body-lg)', lineHeight: 'var(--lh-body-lg)', color: 'var(--ink-400)', marginTop: 18, maxWidth: '54ch' }}>{p.lede}</p>
          <p style={{ fontSize: 'var(--fs-body)', lineHeight: 'var(--lh-body)', color: 'var(--ink-600)', marginTop: 24, maxWidth: '60ch' }}>{p.body}</p>
          <h2 style={{ fontSize: 'var(--fs-h2)', letterSpacing: 'var(--ls-h2)', marginTop: 40 }}>What is coming</h2>
          <div style={{ display: 'grid', gap: 0, marginTop: 16 }}>
            {p.rows.map(([k, v]) => (
              <div key={k} style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 16, padding: '14px 0', borderTop: '1px solid var(--border-hair)' }}>
                <span className="ll-eyebrow">{k}</span>
                <span style={{ fontSize: 'var(--fs-body-sm)', lineHeight: 'var(--lh-body-sm)', color: 'var(--ink-600)' }}>{v}</span>
              </div>
            ))}
          </div>
          <Callout tone="warn" title="Availability" style={{ marginTop: 28 }}>{p.availability}</Callout>
          {onNavigate && (
            <div style={{ marginTop: 32 }}>
              <Button variant="primary" iconRight={<span>→</span>} onClick={() => onNavigate('Contact')}>Get in touch</Button>
            </div>
          )}
        </article>
      </div>
    </Wrap>
  );
}

export default LaunchPost;
