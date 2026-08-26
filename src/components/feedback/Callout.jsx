import React from 'react';

function Callout({ children, title, tone = 'neutral', style }) {
  const edge = { neutral: 'var(--ink-900)', accent: 'var(--cyan-500)', warn: 'var(--status-warn)', danger: 'var(--status-danger)' }[tone];
  return (
    <div style={{ background: 'var(--paper-000)', border: '1px solid var(--border-hair)', borderTop: '3px solid ' + edge,
      borderRadius: 'var(--radius-2)', padding: '16px 18px', display: 'grid', gap: 6, ...style }}>
      {title ? <span className="ll-eyebrow" style={{ color: 'var(--ink-900)' }}>{title}</span> : null}
      <div style={{ fontSize: 'var(--fs-body-sm)', lineHeight: 'var(--lh-body-sm)', color: 'var(--ink-600)' }}>{children}</div>
    </div>
  );
}

export default Callout;
