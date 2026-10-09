import React from 'react';

function SectionHeading({ eyebrow, title, description, level = 2, align = 'left', tone = 'paper', rule = false, style }) {
  const Tag = 'h' + level;
  const inverse = tone === 'inverse';
  return (
    <div style={{ display: 'grid', gap: 16, textAlign: align, borderTop: rule ? '1px solid ' + (inverse ? 'var(--border-hair-inverse)' : 'var(--border-hair)') : 'none',
      paddingTop: rule ? 20 : 0, ...style }}>
      {eyebrow ? <span className="ll-eyebrow" style={{ color: inverse ? 'var(--ink-300)' : 'var(--ink-400)' }}>{eyebrow}</span> : null}
      <Tag style={{ margin: 0, fontWeight: 700, fontSize: 'clamp(28px, 3.4vw, 46px)', lineHeight: 1.04,
        letterSpacing: '-0.035em', textWrap: 'balance', marginLeft: align === 'center' ? 'auto' : 0, marginRight: align === 'center' ? 'auto' : 0, color: inverse ? 'var(--paper-100)' : 'var(--ink-900)', maxWidth: '22ch' }}>{title}</Tag>
      {description ? <p style={{ margin: 0, maxWidth: '58ch', fontSize: 'var(--fs-body-lg)', lineHeight: 'var(--lh-body-lg)',
        color: inverse ? 'var(--ink-200)' : 'var(--ink-500)', marginLeft: align === 'center' ? 'auto' : 0, marginRight: align === 'center' ? 'auto' : 0 }}>{description}</p> : null}
    </div>
  );
}

export default SectionHeading;
