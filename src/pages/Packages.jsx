import React from 'react';
import Badge from '../components/feedback/Badge';
import Card from '../components/surfaces/Card';
import Button from '../components/core/Button';
import { pathForPage } from '../lib/seo';
import { SERVICE_PACKAGES } from '../lib/servicePackages';

const Wrap = ({ children, style }) => (
  <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 24px', ...style }}>{children}</div>
);

// Add a new entry here whenever another service is packaged up — this page
// automatically lists whatever is in this array.
const PACKAGES = [
  {
    page: 'PressRelease',
    title: 'Press Release Distribution',
    from: 'From $149',
    description: 'Get your announcement onto 350+ news sites and Google News — written, edited, and distributed for you, with a full placement report.',
  },
  ...SERVICE_PACKAGES.map((p) => ({ page: p.page, title: p.cardTitle, from: p.from, description: p.cardDescription })),
];

function Packages({ onNavigate }) {
  return (
    <main>
      <Wrap style={{ padding: '72px 24px 56px', borderBottom: '1px solid var(--border-hair)' }}>
        <Badge tone="accent">Packaged services</Badge>
        <h1 style={{ margin: '18px 0 0', fontWeight: 700, fontSize: 'var(--fs-display-2)', lineHeight: 'var(--lh-display-2)',
          letterSpacing: 'var(--ls-display-2)', maxWidth: '22ch' }}>
          Fixed scope. Fixed price. Done for you.
        </h1>
        <p style={{ maxWidth: 'var(--container-narrow)', margin: '24px 0 0', fontSize: 'var(--fs-body-lg)', lineHeight: 'var(--lh-body-lg)', color: 'var(--ink-400)' }}>
          Services you can buy off the shelf — no custom quote, no retainer. Pick a package and we handle the rest.
        </p>
      </Wrap>

      <Wrap style={{ padding: '56px 24px 88px' }}>
        <div style={{ display: 'grid', gap: 20 }}>
          {PACKAGES.map((p) => (
            <a key={p.page} href={pathForPage(p.page)}
              onClick={(e) => { e.preventDefault(); onNavigate(p.page); }}
              style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
              <Card emphasis="strong" padding={28} style={{ display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'grid', gap: 8, maxWidth: '52ch' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-400)' }}>
                    {p.from}
                  </span>
                  <h2 style={{ margin: 0, fontSize: 'var(--fs-h2)', lineHeight: 'var(--lh-h2)', color: 'var(--ink-900)' }}>{p.title}</h2>
                  <p style={{ margin: 0, fontSize: 'var(--fs-body)', lineHeight: 'var(--lh-body)', color: 'var(--ink-500)' }}>{p.description}</p>
                </div>
                <Button variant="primary" size="lg" iconRight={<span>→</span>}>View package</Button>
              </Card>
            </a>
          ))}
        </div>
      </Wrap>
    </main>
  );
}

export default Packages;
