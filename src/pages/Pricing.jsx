import React from 'react';
import SectionHeading from '../components/surfaces/SectionHeading';
import Switch from '../components/forms/Switch';
import Card from '../components/surfaces/Card';
import Badge from '../components/feedback/Badge';
import Button from '../components/core/Button';
import { openBooking } from '../lib/booking';
import { PLANS as plans, ANNUAL_DISCOUNT } from '../lib/content';


function Pricing({ onNavigate }) {
  const [monthly, setMonthly] = React.useState(true);
  return (
    <main style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '64px 24px 88px' }}>
      {/* level={1}: the page had no h1 at all. SectionHeading already renders at
          --fs-h1, so this changes the semantics without changing the design. */}
      <SectionHeading level={1} eyebrow="Pricing" title="One platform. Three plans. No hidden fees."
        description="Every plan includes 24/7 support and a done-for-you onboarding session. Most clients save $400–$500 a month in tools they can cancel the day they switch." rule={false} />
      <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: 32 }}>
        <Switch label={monthly ? 'Monthly billing' : 'Annual billing (-20%)'} checked={!monthly} onChange={v => setMonthly(!v)} />
      </div>
      <div className="ll-grid-3" style={{ gap: 20, marginTop: 24 }}>
        {plans.map(p => (
          <Card key={p.name} padding={26} emphasis={p.featured ? 'strong' : 'default'} style={{ display: 'grid', gap: 18, alignContent: 'start' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="ll-eyebrow">{p.name}</span>
              {p.featured ? <Badge tone="accent">Most popular</Badge> : null}
            </div>
            <div style={{ display: 'grid', gap: 4 }}>
              <span style={{ fontWeight: 700, fontSize: 'var(--fs-display-3)', lineHeight: 1, letterSpacing: 'var(--ls-display-3)' }}>
                ${monthly ? p.price : Math.round(p.price * ANNUAL_DISCOUNT)}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-400)', whiteSpace: 'nowrap' }}>{p.unit}</span>
            </div>
            <div style={{ display: 'grid', gap: 8, borderTop: '1px solid var(--border-hair)', paddingTop: 16 }}>
              {p.lines.map(l => (
                <div key={l} style={{ display: 'flex', gap: 8, fontSize: 'var(--fs-body-sm)', color: 'var(--ink-600)' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--cyan-700)' }}>✓</span>{l}
                </div>
              ))}
            </div>
            <Button variant={p.featured ? 'primary' : 'secondary'} fullWidth iconRight={<span>→</span>}
              onClick={openBooking}>
              Get started
            </Button>
          </Card>
        ))}
      </div>
      <p style={{ marginTop: 32, fontSize: 'var(--fs-body-sm)', color: 'var(--ink-400)', textAlign: 'center' }}>
        Not sure which plan is right? Book a free strategy call and we will help you pick the one that fits your business and your budget.
      </p>
    </main>
  );
}

export default Pricing;
