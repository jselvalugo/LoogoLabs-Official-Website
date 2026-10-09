import React from 'react';

// Cards sit in a translucent outer ring (double bezel) with soft, tinted depth.
// `emphasis="strong"` lifts the card further; `floating` turns it into glass.
function Card({ children, emphasis = 'default', tone = 'paper', padding = 28, style, className, ...rest }) {
  const tones = {
    paper: { background: 'linear-gradient(180deg, #FBFAF6 0%, var(--paper-000) 100%)', color: 'var(--text-primary)' },
    sunken: { background: 'var(--paper-200)', color: 'var(--text-primary)' },
    sage: { background: 'linear-gradient(160deg, #D5E0BE 0%, #C3D2A6 100%)', color: 'var(--ink-900)' },
    inverse: {
      background: 'radial-gradient(70% 90% at 80% 60%, rgba(134,164,92,0.22), transparent 60%), linear-gradient(120deg, var(--ink-900) 0%, var(--ink-800) 45%, var(--ink-600) 100%)',
      color: 'var(--text-on-inverse)',
    },
  };
  const dark = tone === 'inverse';
  const emphases = {
    default: {
      border: '1px solid ' + (dark ? 'rgba(245,242,235,0.08)' : 'rgba(255,255,255,0.8)'),
      boxShadow: dark ? 'var(--bezel-dark)' : 'var(--bezel)',
    },
    strong: {
      border: '1px solid ' + (dark ? 'rgba(245,242,235,0.1)' : 'rgba(255,255,255,0.9)'),
      boxShadow: (dark ? 'var(--bezel-dark)' : 'var(--bezel)') + ', 0 40px 80px -40px rgba(26,38,16,0.35)',
    },
    floating: {},
  };
  const glass = emphasis === 'floating';
  return (
    <div className={[glass ? (dark ? 'll-glass--dark' : 'll-glass') : '', className].filter(Boolean).join(' ') || undefined}
      style={{ borderRadius: 'var(--radius-3)', padding, ...(glass ? null : tones[tone]), ...emphases[emphasis], ...style }} {...rest}>
      {children}
    </div>
  );
}

export default Card;
