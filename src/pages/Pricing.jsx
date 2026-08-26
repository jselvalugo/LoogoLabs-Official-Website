import React from 'react';
import SectionHeading from '../components/surfaces/SectionHeading';
import Tabs from '../components/navigation/Tabs';
import Switch from '../components/forms/Switch';
import Card from '../components/surfaces/Card';
import Badge from '../components/feedback/Badge';
import Button from '../components/core/Button';

const plans = {
  'PropIQ': [
    { name: 'Desk', price: 490, unit: 'per analyst / mo', lines: ['3 counties', '250 valuations / mo', 'Email support'] },
    { name: 'Team', price: 1900, unit: 'per team / mo', lines: ['All 412 counties', '5,000 valuations / mo', 'Model card access', 'Slack channel'], featured: true },
    { name: 'Institution', price: null, unit: 'talk to us', lines: ['Unlimited valuations', 'Private model tuning', 'Audit export', 'On-prem option'] },
  ],
  'CartCaddy': [
    { name: 'Single course', price: 340, unit: 'per course / mo', lines: ['One tee sheet', 'POS read-only link', 'Email support'] },
    { name: 'Portfolio', price: 1200, unit: 'per 5 courses / mo', lines: ['Shared member record', 'Shoulder-season pricing', 'Forecasting', 'Slack channel'], featured: true },
    { name: 'Management co.', price: null, unit: 'talk to us', lines: ['Unlimited courses', 'Regional reporting', 'Custom integrations'] },
  ],
  'Distillr': [
    { name: 'Rickhouse', price: 420, unit: 'per warehouse / mo', lines: ['5,000 barrels', 'Gauge logging', 'Email support'] },
    { name: 'Distillery', price: 1450, unit: 'per site / mo', lines: ['Unlimited barrels', 'Loss curves', 'TTB + HMRC filing', 'Slack channel'], featured: true },
    { name: 'Group', price: null, unit: 'talk to us', lines: ['Multi-site ledger', 'Custom excise formats', 'Audit export'] },
  ],
};

function Pricing() {
  const [tab, setTab] = React.useState('CartCaddy');
  const [monthly, setMonthly] = React.useState(true);
  const list = plans[tab];
  return (
    <main style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '72px 24px 96px' }}>
      <SectionHeading eyebrow="Pricing" title="Priced per thing you already count"
        description="PropIQ bills per analyst, CartCaddy per course, Distillr per warehouse. Annual billing takes 15% off, and every plan includes the model card." rule={false} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24, marginTop: 36, flexWrap: 'wrap' }}>
        <Tabs items={['PropIQ', 'CartCaddy', 'Distillr']} value={tab} onChange={setTab} style={{ border: 'none' }} />
        <Switch label={monthly ? 'Monthly billing' : 'Annual billing (-15%)'} checked={!monthly} onChange={v => setMonthly(!v)} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginTop: 24 }}>
        {list.map(p => (
          <Card key={p.name} padding={26} emphasis={p.featured ? 'strong' : 'default'} style={{ display: 'grid', gap: 18, alignContent: 'start' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="ll-eyebrow">{p.name}</span>
              {p.featured ? <Badge tone="accent">Most chosen</Badge> : null}
            </div>
            <div style={{ display: 'grid', gap: 4 }}>
              {p.price === null
                ? <React.Fragment>
                    <span style={{ fontWeight: 700, fontSize: 'var(--fs-display-3)', lineHeight: 1, letterSpacing: 'var(--ls-display-3)' }}>Custom</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-400)', whiteSpace: 'nowrap' }}>{p.unit}</span>
                  </React.Fragment>
                : <React.Fragment>
                    <span style={{ fontWeight: 700, fontSize: 'var(--fs-display-3)', lineHeight: 1, letterSpacing: 'var(--ls-display-3)' }}>
                      ${monthly ? p.price : Math.round(p.price * 0.85)}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-400)', whiteSpace: 'nowrap' }}>{p.unit}</span>
                  </React.Fragment>}
            </div>
            <div style={{ display: 'grid', gap: 8, borderTop: '1px solid var(--border-hair)', paddingTop: 16 }}>
              {p.lines.map(l => (
                <div key={l} style={{ display: 'flex', gap: 8, fontSize: 'var(--fs-body-sm)', color: 'var(--ink-600)' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--cyan-700)' }}>·</span>{l}
                </div>
              ))}
            </div>
            <Button variant={p.featured ? 'primary' : 'secondary'} fullWidth iconRight={<span>→</span>}>
              {p.price === null ? 'Talk to us' : 'Start a trial'}
            </Button>
          </Card>
        ))}
      </div>
    </main>
  );
}

export default Pricing;
