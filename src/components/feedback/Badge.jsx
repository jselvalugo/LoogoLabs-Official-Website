import React from 'react';

function Badge({ children, tone = 'neutral', bracket = false, style, className }) {
  const tones = {
    neutral: { color: 'var(--ink-800)', border: '1px solid rgba(255,255,255,0.8)', background: 'rgba(255,255,255,0.6)', boxShadow: '0 4px 12px -6px rgba(26,38,16,0.2)' },
    accent: { color: 'var(--paper-000)', border: '1px solid var(--ink-900)', background: 'var(--ink-900)' },
    ok: { color: 'var(--ink-900)', border: '1px solid var(--status-ok)', background: 'var(--paper-000)' },
    warn: { color: 'var(--ink-900)', border: '1px solid var(--status-warn)', background: 'var(--paper-000)' },
    danger: { color: 'var(--ink-900)', border: '1px solid var(--status-danger)', background: 'var(--paper-000)' },
    inverse: { color: 'var(--paper-100)', border: '1px solid rgba(245,242,235,0.18)', background: 'rgba(245,242,235,0.08)' },
  };
  const dot = { ok: 'var(--status-ok)', warn: 'var(--status-warn)', danger: 'var(--status-danger)' }[tone];
  return (
    <span className={className} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-mono)',
      fontSize: 'var(--fs-micro)', letterSpacing: 'var(--ls-micro)', textTransform: 'uppercase',
      padding: '5px 12px', borderRadius: 'var(--radius-pill)', whiteSpace: 'nowrap', ...tones[tone], ...style }}>
      {dot ? <span style={{ width: 6, height: 6, borderRadius: '50%', background: dot }} /> : null}
      {bracket ? '[ ' : ''}{children}{bracket ? ' ]' : ''}
    </span>
  );
}

export default Badge;
