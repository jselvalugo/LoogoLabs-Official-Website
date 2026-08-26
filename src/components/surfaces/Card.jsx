import React from 'react';

function Card({ children, emphasis = 'default', tone = 'paper', padding = 24, style, ...rest }) {
  const tones = {
    paper: { background: 'var(--surface-card)', color: 'var(--text-primary)' },
    sunken: { background: 'var(--surface-sunken)', color: 'var(--text-primary)' },
    inverse: { background: 'var(--surface-inverse-card)', color: 'var(--text-on-inverse)' },
  };
  const emphases = {
    default: { border: '1px solid ' + (tone === 'inverse' ? 'var(--border-hair-inverse)' : 'var(--border-hair)') },
    strong: {
      border: '2px solid ' + (tone === 'inverse' ? 'var(--cyan-500)' : 'var(--ink-900)'),
      boxShadow: tone === 'inverse' ? 'var(--shadow-hard-accent)' : 'var(--shadow-hard)',
    },
    floating: { border: '1px solid var(--border-hair)', boxShadow: 'var(--shadow-soft-2)' },
  };
  return (
    <div style={{ borderRadius: 'var(--radius-2)', padding, ...tones[tone], ...emphases[emphasis], ...style }} {...rest}>
      {children}
    </div>
  );
}

export default Card;
