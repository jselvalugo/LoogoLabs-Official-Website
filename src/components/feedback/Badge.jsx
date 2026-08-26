import React from 'react';

function Badge({ children, tone = 'neutral', bracket = false, style }) {
  const tones = {
    neutral: { color: 'var(--ink-900)', border: '1px solid var(--border-hair)', background: 'var(--paper-000)' },
    accent: { color: 'var(--ink-900)', border: '1px solid var(--ink-900)', background: 'var(--cyan-500)' },
    ok: { color: 'var(--ink-900)', border: '1px solid var(--status-ok)', background: 'var(--paper-000)' },
    warn: { color: 'var(--ink-900)', border: '1px solid var(--status-warn)', background: 'var(--paper-000)' },
    danger: { color: 'var(--ink-900)', border: '1px solid var(--status-danger)', background: 'var(--paper-000)' },
    inverse: { color: 'var(--paper-100)', border: '1px solid var(--border-hair-inverse)', background: 'transparent' },
  };
  const dot = { ok: 'var(--status-ok)', warn: 'var(--status-warn)', danger: 'var(--status-danger)' }[tone];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-mono)',
      fontSize: 'var(--fs-micro)', letterSpacing: 'var(--ls-micro)', textTransform: 'uppercase',
      padding: '3px 8px', borderRadius: 'var(--radius-1)', whiteSpace: 'nowrap', ...tones[tone], ...style }}>
      {dot ? <span style={{ width: 6, height: 6, background: dot }} /> : null}
      {bracket ? '[ ' : ''}{children}{bracket ? ' ]' : ''}
    </span>
  );
}

export default Badge;
