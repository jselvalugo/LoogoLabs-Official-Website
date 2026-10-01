import React from 'react';
import Badge from '../components/feedback/Badge';
import Card from '../components/surfaces/Card';
import Button from '../components/core/Button';
import { openBooking } from '../lib/booking';
import { SERVICE_PACKAGE_BY_PAGE } from '../lib/servicePackages';

const Wrap = ({ children, style }) => (
  <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 24px', ...style }}>{children}</div>
);

const Eyebrow = ({ children }) => (
  <div className="ll-eyebrow" style={{ color: 'var(--cyan-700)', textAlign: 'center' }}>{children}</div>
);

const Heading = ({ children }) => (
  <h2 style={{ margin: '10px auto 32px', maxWidth: '24ch', textAlign: 'center', fontSize: 'clamp(26px,4vw,38px)', fontWeight: 700,
    lineHeight: 1.15, letterSpacing: '-0.03em', color: 'var(--ink-900)' }}>{children}</h2>
);

const Check = () => <span style={{ color: 'var(--cyan-700)', fontWeight: 700, flexShrink: 0 }}>✓</span>;

function ServicePackage({ page }) {
  const pkg = SERVICE_PACKAGE_BY_PAGE[page];
  const order = (where) => {
    if (window.fbq) window.fbq('track', 'InitiateCheckout', { content_name: `${pkg.page}-${where}` });
    openBooking();
  };

  return (
    <main>
      {/* ── HERO ── */}
      <Wrap style={{ padding: '64px 24px 48px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}><Badge tone="accent">{pkg.badge}</Badge></div>
        <h1 style={{ margin: '18px auto 0', fontWeight: 700, fontSize: 'var(--fs-display-2)', lineHeight: 'var(--lh-display-2)',
          letterSpacing: 'var(--ls-display-2)', maxWidth: '20ch' }}>
          {pkg.headline} <span style={{ color: 'var(--cyan-700)' }}>{pkg.accent}</span>
        </h1>
        <p style={{ maxWidth: '56ch', margin: '18px auto 0', fontSize: 'var(--fs-body-lg)', lineHeight: 'var(--lh-body-lg)', color: 'var(--ink-500)' }}>
          {pkg.summary}
        </p>
        <div style={{ marginTop: 28, display: 'flex', justifyContent: 'center' }}>
          <Button variant="primary" size="lg" iconRight={<span>→</span>} onClick={() => order('hero')}>Get started</Button>
        </div>
        <div style={{ marginTop: 18, fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-400)' }}>
          Fixed price · Done for you · {pkg.turnaround}
        </div>
      </Wrap>

      {/* ── PRICING ── */}
      <section style={{ background: 'var(--paper-100)', borderTop: '1px solid var(--border-hair)', borderBottom: '1px solid var(--border-hair)', padding: '56px 0' }}>
        <Wrap>
          <Eyebrow>What's included</Eyebrow>
          <Heading>One fixed price. No retainer.</Heading>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, maxWidth: pkg.tiers.length === 1 ? 480 : 880, margin: '0 auto' }}>
            {pkg.tiers.map((t) => (
              <Card key={t.name} emphasis="strong" padding={28}
                style={{ display: 'flex', flexDirection: 'column', gap: 18, ...(t.featured ? { borderColor: 'var(--cyan-700)' } : {}) }}>
                <div>
                  <div className="ll-eyebrow" style={{ color: 'var(--ink-400)' }}>{t.name}</div>
                  <div style={{ fontSize: 48, fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--ink-900)', lineHeight: 1.1 }}>{t.price}</div>
                  <div style={{ fontSize: 13, color: 'var(--ink-500)' }}>one-time · fixed price</div>
                </div>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8, flex: 1 }}>
                  {t.items.map((f) => <li key={f} style={{ display: 'flex', gap: 10, fontSize: 14.5, color: 'var(--ink-700)' }}><Check />{f}</li>)}
                </ul>
                <Button variant={t.featured ? 'primary' : 'secondary'} size="lg" iconRight={<span>→</span>} onClick={() => order(t.name)}>
                  Choose {t.name}
                </Button>
              </Card>
            ))}
          </div>
        </Wrap>
      </section>

      {/* ── HOW IT WORKS ── */}
      <Wrap style={{ padding: '56px 24px' }}>
        <Eyebrow>How it works</Eyebrow>
        <Heading>{pkg.turnaround}, start to finish.</Heading>
        <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 24 }}>
          {pkg.steps.map(([t, d], i) => (
            <li key={t}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--ink-900)', color: 'var(--paper-000)', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700 }}>0{i + 1}</span>
                <span style={{ flex: 1, height: 1, background: 'var(--border-hair)' }} />
              </div>
              <h3 style={{ margin: '16px 0 6px', fontSize: 17, color: 'var(--ink-900)' }}>{t}</h3>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: 'var(--ink-500)' }}>{d}</p>
            </li>
          ))}
        </ol>
        <div style={{ marginTop: 32, background: 'var(--paper-100)', border: '1px solid var(--border-hair)', borderLeft: '4px solid var(--cyan-700)',
          borderRadius: 'var(--radius-2)', padding: '18px 22px' }}>
          <div style={{ fontWeight: 700, fontSize: 17, color: 'var(--ink-900)' }}>What we need from you</div>
          <ul style={{ listStyle: 'none', margin: '10px 0 0', padding: 0, display: 'grid', gap: 6 }}>
            {pkg.needs.map((n) => <li key={n} style={{ display: 'flex', gap: 10, fontSize: 14.5, color: 'var(--ink-600)' }}><Check />{n}</li>)}
          </ul>
        </div>
      </Wrap>

      {/* ── FAQ ── */}
      <Wrap style={{ padding: '24px 24px 40px', maxWidth: 760 }}>
        <Eyebrow>FAQ</Eyebrow>
        <Heading>Good questions</Heading>
        <div style={{ display: 'grid', gap: 10 }}>
          {pkg.faq.map(([q, a]) => (
            <details key={q} style={{ background: 'var(--paper-100)', border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-2)', padding: '14px 18px' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 700, fontSize: 15, color: 'var(--ink-900)' }}>{q}</summary>
              <p style={{ margin: '10px 0 0', fontSize: 14, lineHeight: 1.6, color: 'var(--ink-500)' }}>{a}</p>
            </details>
          ))}
        </div>
      </Wrap>

      {/* ── CTA ── */}
      <Wrap style={{ padding: '24px 24px 80px' }}>
        <Card emphasis="strong" padding={28} style={{ display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ maxWidth: '52ch' }}>
            <h2 style={{ margin: 0, fontSize: 22, color: 'var(--ink-900)' }}>Ready when you are.</h2>
            <p style={{ margin: '6px 0 0', fontSize: 15, color: 'var(--ink-500)' }}>Book a 15-minute call and we'll get your {pkg.cardTitle} moving.</p>
          </div>
          <Button variant="primary" size="lg" iconRight={<span>→</span>} onClick={() => order('footer')}>Get started</Button>
        </Card>
      </Wrap>
    </main>
  );
}

export default ServicePackage;
