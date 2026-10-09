import React, { useState } from 'react';
import Button from '../components/core/Button';
import { pathForPage } from '../lib/seo';
import { openBooking } from '../lib/booking';
import { SERVICE_PACKAGES } from '../lib/servicePackages';
import { ArrowRight, Check, Plus, Minus } from '@phosphor-icons/react';
import '../styles/pages/packages.css';


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
    ideal: 'Established businesses, $500K-$3M',
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
    description: 'Your announcement on 350+ news sites and Google News: written, distributed, and reported.',
  },
  ...SERVICE_PACKAGES.map((p) => ({ page: p.page, title: p.cardTitle, from: p.from, description: p.cardDescription })),
];

// Standalone services: ongoing management or one-off builds sold on their own,
// outside the packages above.
const STANDALONE_SERVICES = [
  {
    title: 'Local SEO',
    price: '$500+',
    unit: '/mo',
    description: 'Ongoing Google Business Profile management, citations, on-page fixes, local content, and monthly ranking reports.',
  },
  {
    title: 'Google Ads Management',
    price: '$500+',
    unit: '/mo',
    description: 'Campaign setup, keyword and negative lists, ad copy, conversion tracking, and ongoing bid and budget optimization.',
  },
  {
    title: 'Web Design',
    price: '$1,500+',
    unit: ' one-time',
    description: 'A fast, mobile-first website built to turn visitors into calls and bookings, with on-page SEO set up from day one.',
  },
];

const Arrow = <ArrowRight size={16} weight="bold" />;

function PackageCard({ pkg }) {
  // On phones the feature list starts collapsed so all three packages fit on a
  // couple of screens; desktop always shows it (see .pk-features in packages.css).
  const [open, setOpen] = useState(false);
  const dark = !!pkg.featured;
  return (
    <div className={`pk-card ${dark ? 'pk-card--dark ll-forest pk-dark' : 'pk-card--paper'}${open ? ' is-open' : ''}`}>
      <div className="pk-card__top">
        <h2>{pkg.name}</h2>
        {pkg.featured && <span className="pk-pop">Most popular</span>}
      </div>
      <p>{pkg.tagline}</p>
      <div>
        <div className="pk-price-row">
          <span className="pk-price">{pkg.monthly}</span>
          <span className="pk-per">/mo</span>
        </div>
        <span className="pk-tag">{pkg.setup} · {pkg.term}</span>
      </div>
      <div className="pk-ideal"><strong>Best for:</strong> {pkg.ideal}</div>
      <button type="button" className="pk-toggle" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        {open ? 'Hide details' : `See what's included (${pkg.features.length})`}
        <span className="pk-toggle__icon" aria-hidden="true">{open ? <Minus size={14} weight="bold" /> : <Plus size={14} weight="bold" />}</span>
      </button>
      <div className="pk-features">
        {pkg.includesPrev && <div className="pk-features__prev">{pkg.includesPrev}</div>}
        <ul className="pk-list">
          {pkg.features.map((f) => (
            <li key={f}><Check className="pk-check" size={16} weight="bold" aria-hidden="true" />{f}</li>
          ))}
        </ul>
      </div>
      <Button variant={dark ? 'primary' : 'inverse'} size="lg" fullWidth onClick={openBooking} iconRight={Arrow}>
        Book a call
      </Button>
    </div>
  );
}

function QuickStartSidebar({ onNavigate }) {
  return (
    <aside className="pk-sidebar ll-glass" aria-labelledby="quick-starts-heading">
      <div className="pk-sidebar__head">
        <span className="pk-tag">Quick starts</span>
        <h2 id="quick-starts-heading">One-off, fixed-price wins</h2>
        <p>Not ready for a package? Start with a single done-for-you service.</p>
      </div>
      <div className="pk-quick-grid">
        {QUICK_STARTS.map((q) => (
          <a key={q.page} href={pathForPage(q.page)} className="pk-quick"
            onClick={(e) => { e.preventDefault(); onNavigate(q.page); }}>
            <span className="pk-tag" style={{ fontSize: 10 }}>{q.from}</span>
            <span className="pk-quick__title">{q.title} <ArrowRight size={14} weight="bold" aria-hidden="true" /></span>
            <span className="pk-quick-desc">{q.description}</span>
          </a>
        ))}
      </div>
    </aside>
  );
}

function Packages({ onNavigate }) {
  return (
    <main>
      <section className="pk-wrap pk-hero">
        <span className="ll-eyebrow">Packages</span>
        <h1 className="pk-title">A complete growth system, <em>built and run for you.</em></h1>
        <p className="pk-lede">
          CRM, automation, reviews, and AI follow-up on one platform, set up by our team and managed every month.
          Pick the package that fits where your business is today, or grab a quick start to begin.
        </p>
      </section>

      <div className="pk-wrap pk-section" style={{ paddingBottom: 96 }}>
        <div className="pk-layout">
          <div>
            <div className="pk-grid">
              {PRIMARY_PACKAGES.map((p) => <PackageCard key={p.name} pkg={p} />)}
            </div>
            <div className="pk-diy ll-sage ll-bezel">
              <div>
                <span className="pk-tag">Self-serve · $39.99/mo · no setup fee · month-to-month</span>
                <h2>Prefer to run it yourself?</h2>
                <p>
                  Get the same platform as Growth (CRM, automation, AI and templates) and set it up your way, with community support.
                </p>
              </div>
              <Button variant="inverse" size="lg" onClick={openBooking} iconRight={Arrow}>Book a call</Button>
            </div>
            <div className="pk-head pk-services-head">
              <h2 className="pk-h2">Need one thing <em>done well?</em></h2>
              <p>Hire us for a single service on its own, or add it to any package. Final pricing depends on scope.</p>
            </div>
            <div className="pk-grid pk-grid--services">
              {STANDALONE_SERVICES.map((s) => (
                <div key={s.title} className="pk-service ll-glass">
                  <h3 className="pk-service-title">{s.title}</h3>
                  <div className="pk-price-row" style={{ gap: 4 }}>
                    <span className="pk-service-price">{s.price}</span>
                    <span className="pk-per">{s.unit}</span>
                  </div>
                  <p className="pk-service-desc">{s.description}</p>
                  <Button variant="secondary" size="md" fullWidth onClick={openBooking} iconRight={Arrow}>Get a quote</Button>
                </div>
              ))}
            </div>
            <p className="pk-note">Ad spend and usage (SMS, calls, AI) are billed at cost.</p>
          </div>
          <QuickStartSidebar onNavigate={onNavigate} />
        </div>
      </div>
    </main>
  );
}

export default Packages;
