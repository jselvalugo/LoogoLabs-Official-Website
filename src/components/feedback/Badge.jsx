import React from 'react';

// Small sentence-case tag. `bracket` is accepted for compatibility and ignored.
function Badge({ children, tone = 'neutral', bracket = false, style, className }) {
  const dot = { ok: 'var(--status-ok)', warn: 'var(--status-warn)', danger: 'var(--status-danger)' }[tone];
  const cls = ['ll-badge', tone !== 'neutral' ? `ll-badge--${tone}` : '', className].filter(Boolean).join(' ');
  return (
    <span className={cls} style={style}>
      {dot ? <span className="ll-badge__dot" style={{ background: dot }} /> : null}
      {children}
    </span>
  );
}

export default Badge;
