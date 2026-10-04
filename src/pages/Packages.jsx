import React from 'react';
import Badge from '../components/feedback/Badge';
import Card from '../components/surfaces/Card';
import Button from '../components/core/Button';
import { pathForPage } from '../lib/seo';
import { openBooking } from '../lib/booking';
import { SERVICE_PACKAGES } from '../lib/servicePackages';

const Wrap = ({ children, style }) => (
  <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 24px', ...style }}>{children}</div>
);

// Primary packages: done-for-you growth systems. Each tier includes everything
// in the tier before it.
const PRIMARY_PACKAGES = [
  {
    name: 'Launch',
    tagline: 'Get found, answer every lead, collect reviews.',
    ideal: 'Local service businesses under ~$500K revenue',
    monthly: '$297',
    setup: '$497 setup',
    term: '6-month term · live in 14 days',
    features: [
      'CRM, pipelines & unified inbox',
      'Missed-call text-back & business phone',
      'Website & funnels',
      'Online booking with reminders',
      'Automated review requests',
      'Invoices & text-to-pay',
      'Performance dashboard',
    ],
  },
  {
    name: 'Growth',
    featured: true,
    tagline: 'Full marketing automation with AI follow-up.',
    ideal: 'Established businesses, $500K–$3M',
    monthly: '$597',
    setup: '$1,497 setup',
    term: '6-month term · live in 30 days',
    includesPrev: 'Everything in Launch, plus',
    features: [
      'Email & SMS marketing campaigns',
      'Conversation AI & Reviews AI',
      'Social planner & Content AI',
      'Call tracking & attribution reporting',
      'Client portal, surveys & blog',
      'Subscriptions & e-sign contracts',
    ],
  },
  {
    name: 'Scale',
    tagline: 'AI receptionist, ads, memberships and custom integrations.',
    ideal: 'Multi-location or $3M+ / high-ticket firms',
    monthly: '$1,297',
    setup: '$2,997 setup',
    term: '12-month term · live in 45 days',
    includesPrev: 'Everything in Growth, plus',
    features: [
      '24/7 Voice AI receptionist',
      'Ad management & ad reporting',
      'Courses, memberships & communities',
      'E-commerce & webinars',
      'Power dialer & prospecting',
      'WhatsApp & affiliate program',
      'Custom AI agents & workflow AI',
    ],
  },
];

// Quick starts: fixed-scope, one-off services. Add a new entry here whenever
// another service is packaged up — the sidebar lists whatever is in this array.
const QUICK_STARTS = [
  {
    page: 'PressRelease',
    title: 'Press Release Distribution',
    from: 'From $149',
    description: 'Your announcement on 350+ news sites and Google News — written, distributed, and reported.',
  },
  ...SERVICE_PACKAGES.map((p) => ({ page: p.page, title: p.cardTitle, from: p.from, description: p.cardDescription })),
];

const mono = { fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-400)' };

function PackageCard({ pkg }) {
  return (
    <Card emphasis="strong" padding={28} style={{
      display: 'flex', flexDirection: 'column', gap: 20, height: '100%', boxSizing: 'border-box', position: 'relative',
      ...(pkg.featured ? { boxShadow: '0 0 0 2px var(--ink-900)' } : null),
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <h2 style={{ margin: 0, fontSize: 'var(--fs-h2)', lineHeight: 'var(--lh-h2)', color: 'var(--ink-900)' }}>{pkg.name}</h2>
        {pkg.featured && <Badge tone="accent">Most popular</Badge>}
      </div>
      <p style={{ margin: 0, fontSize: 'var(--fs-body)', lineHeight: 'var(--lh-body)', color: 'var(--ink-500)' }}>{pkg.tagline}</p>
      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span style={{ fontSize: 40, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--ink-900)' }}>{pkg.monthly}</span>
          <span style={{ color: 'var(--ink-400)' }}>/mo</span>
        </div>
        <div style={{ ...mono, marginTop: 6 }}>{pkg.setup} · {pkg.term}</div>
      </div>
      <div style={{ fontSize: 14, color: 'var(--ink-500)' }}><strong style={{ color: 'var(--ink-700)' }}>Best for:</strong> {pkg.ideal}</div>
      <div style={{ borderTop: '1px solid var(--border-hair)', paddingTop: 18, flex: 1 }}>
        {pkg.includesPrev && <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-700)', marginBottom: 10 }}>{pkg.includesPrev}</div>}
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 10 }}>
          {pkg.features.map((f) => (
            <li key={f} style={{ display: 'flex', gap: 10, fontSize: 15, lineHeight: 1.4, color: 'var(--ink-700)' }}>
              <span aria-hidden="true" style={{ color: 'var(--status-ok)', fontWeight: 700 }}>✓</span>{f}
            </li>
          ))}
        </ul>
      </div>
      <Button variant={pkg.featured ? 'primary' : 'secondary'} size="lg" fullWidth onClick={openBooking} iconRight={<span>→</span>}>
        Book a call
      </Button>
    </Card>
  );
}

function QuickStartSidebar({ onNavigate }) {
  return (
    <aside className="pk-sidebar" aria-labelledby="quick-starts-heading">
      <div style={{ display: 'grid', gap: 6, marginBottom: 16 }}>
        <span style={mono}>Quick starts</span>
        <h2 id="quick-starts-heading" style={{ margin: 0, fontSize: 20, color: 'var(--ink-900)' }}>One-off, fixed-price wins</h2>
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: 'var(--ink-500)' }}>
          Not ready for a package? Start with a single done-for-you service.
        </p>
      </div>
      <div style={{ display: 'grid', gap: 12 }}>
        {QUICK_STARTS.map((q) => (
          <a key={q.page} href={pathForPage(q.page)}
            onClick={(e) => { e.preventDefault(); onNavigate(q.page); }}
            style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
            <Card padding={16} style={{ display: 'grid', gap: 4 }}>
              <span style={{ ...mono, fontSize: 10 }}>{q.from}</span>
              <span style={{ fontWeight: 600, fontSize: 15, color: 'var(--ink-900)' }}>{q.title} →</span>
              <span style={{ fontSize: 13, lineHeight: 1.45, color: 'var(--ink-500)' }}>{q.description}</span>
            </Card>
          </a>
        ))}
      </div>
    </aside>
  );
}

function Packages({ onNavigate }) {
  return (
    <main>
      <style>{`
        .pk-layout { display: grid; grid-template-columns: minmax(0, 1fr) 300px; gap: 40px; align-items: start; }
        .pk-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; align-items: stretch; }
        .pk-sidebar { position: sticky; top: 96px; }
        @media (max-width: 1180px) {
          .pk-layout { grid-template-columns: 1fr; }
          .pk-sidebar { position: static; }
        }
        @media (max-width: 860px) { .pk-grid { grid-template-columns: 1fr; } }
      `}</style>

      <Wrap style={{ padding: '72px 24px 56px', borderBottom: '1px solid var(--border-hair)' }}>
        <Badge tone="accent">Packages</Badge>
        <h1 style={{ margin: '18px 0 0', fontWeight: 700, fontSize: 'var(--fs-display-2)', lineHeight: 'var(--lh-display-2)',
          letterSpacing: 'var(--ls-display-2)', maxWidth: '22ch' }}>
          A complete growth system, built and run for you.
        </h1>
        <p style={{ maxWidth: 'var(--container-narrow)', margin: '24px 0 0', fontSize: 'var(--fs-body-lg)', lineHeight: 'var(--lh-body-lg)', color: 'var(--ink-400)' }}>
          CRM, automation, reviews, and AI follow-up on one platform — set up by our team and managed every month.
          Pick the package that fits where your business is today, or grab a quick start to begin.
        </p>
      </Wrap>

      <Wrap style={{ padding: '56px 24px 88px' }}>
        <div className="pk-layout">
          <div>
            <div className="pk-grid">
              {PRIMARY_PACKAGES.map((p) => <PackageCard key={p.name} pkg={p} />)}
            </div>
            <p style={{ margin: '20px 0 0', fontSize: 13, color: 'var(--ink-400)' }}>
              Prefer to run it yourself? Self-serve platform access is available from $147/mo — ask us on a call.
              Ad spend and usage (SMS, calls, AI) are billed at cost.
            </p>
          </div>
          <QuickStartSidebar onNavigate={onNavigate} />
        </div>
      </Wrap>
    </main>
  );
}

export default Packages;
