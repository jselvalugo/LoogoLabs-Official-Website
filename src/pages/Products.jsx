import React from 'react';
import SectionHeading from '../components/surfaces/SectionHeading';
import Card from '../components/surfaces/Card';
import Badge from '../components/feedback/Badge';
import Link from '../components/core/Link';

const list = [
  { name: 'PropIQ', industry: 'Real estate', version: 'v4.0',
    line: 'Property valuation from public records, comparable sales and permit history — with the eleven drivers behind every number.',
    metric: ['Median time to value', '90 sec'] },
  { name: 'CartCaddy', industry: 'Golf', version: 'v2.1',
    line: 'One tee sheet, one member record, and pricing rules that live where the bookings already are.',
    metric: ['Courses live', '37'] },
  { name: 'Distillr', industry: 'Distilling', version: 'v1.4',
    line: 'Barrel inventory, warehouse position, evaporation loss and excise-ready reporting in one ledger.',
    metric: ['Barrels tracked', '18.4k'] },
];

function Products({ onNavigate }) {
  return (
    <main style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '72px 24px 96px' }}>
      <SectionHeading eyebrow="Products" title="Applications of one engine"
        description="Each product is the Loogo engine pointed at a specific set of records. Pick the one that matches your operation." rule={false} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginTop: 40 }}>
        {list.map(p => (
          <Card key={p.name} padding={26} style={{ display: 'grid', gap: 16, alignContent: 'start' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
              <Badge>{p.industry}</Badge>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-300)' }}>{p.version}</span>
            </div>
            <h3 style={{ margin: 0, fontSize: 'var(--fs-h3)', letterSpacing: 'var(--ls-h3)', lineHeight: 'var(--lh-h3)' }}>{p.name}</h3>
            <p style={{ margin: 0, fontSize: 'var(--fs-body-sm)', lineHeight: 'var(--lh-body-sm)', color: 'var(--ink-400)' }}>{p.line}</p>
            <div style={{ borderTop: '1px solid var(--border-hair)', paddingTop: 14, display: 'grid', gap: 4 }}>
              <span className="ll-eyebrow">{p.metric[0]}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 20, color: 'var(--ink-900)' }}>{p.metric[1]}</span>
            </div>
            <Link href="#" arrow onClick={e => { e.preventDefault(); onNavigate('product:' + p.name); }}>Open {p.name}</Link>
          </Card>
        ))}
      </div>
      <div style={{ borderTop: '1px solid var(--border-hair)', marginTop: 40, paddingTop: 22, fontSize: 'var(--fs-body-sm)', color: 'var(--ink-400)' }}>
        Nothing here fits? <Link href="#" onClick={e => { e.preventDefault(); onNavigate('Mission'); }}>How a new Loogo product starts.</Link>
      </div>
    </main>
  );
}

export default Products;
